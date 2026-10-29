import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { MaterialReactTable } from "material-react-table";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import VisibilityIcon from "@mui/icons-material/Visibility";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";


  const StockOutward = () => {

    
const STOCK_OUTWARD_SHOP_ID = 1;
const STOCK_OUTWARD_OFFICE_ID = 2;
  

  const [productOptions, setProductOptions] = useState([]);
 
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [entries, setEntries] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);


  const [loadingRequests, setLoadingRequests] = useState(false);

  const [date, setDate] = useState(new Date());
  const [productSearch, setProductSearch] = useState("");

  // Product-wise quantity and rate
  const [productValues, setProductValues] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);




  const [viewDialogOpen, setViewDialogOpen] = useState(false);
const [selectedEntry, setSelectedEntry] = useState(null);

const handleView = (entry) => {
  setSelectedEntry(entry);
  setViewDialogOpen(true);
};

const handleCloseView = () => {
  setViewDialogOpen(false);
  setSelectedEntry(null);
};

  // Fetch ProductMaster data
  const fetchProduct = useCallback(async () => {
    try {
      setLoadingProducts(true);

      const response = await fetch(
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
  {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }
);

      if (!response.ok) {
        throw new Error(`Product API failed: ${response.status}`);
      }

      const data = await response.json();

      const productData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const options = productData
        .filter(
          (item) =>
            item?.ProductName !== null &&
            item?.ProductName !== undefined &&
            String(item.ProductName).trim() !== ""
        )
        .map((item) => ({
          value: item?.Id ?? "",
          label: String(item?.ProductName ?? "").trim(),
          productCode: String(item?.ProductCode ?? ""),
          rate: Number(item?.PurchasePrice ?? 0),
        }));

      setProductOptions(options);

      // Initialize all products with Quantity 0 and API rate
      setProductValues((previous) => {
        const updated = { ...previous };

        options.forEach((product) => {
          const key = String(product.value);

          if (!updated[key]) {
            updated[key] = {
              Quantity: 0,
              Rate: product.rate,
            };
          }
        });

        return updated;
      });
    } catch (error) {
      console.error("Product API Error:", error);
      toast.error("Product data could not be loaded.");
    } finally {
      setLoadingProducts(false);
    }
  }, []);


const fetchStockTransferRequests = useCallback(async () => {
  try {
    setLoadingRequests(true);

    const shopId = STOCK_OUTWARD_SHOP_ID;

    if (!Number.isInteger(Number(shopId)) || Number(shopId) <= 0) {
      throw new Error("Invalid Shop ID.");
    }

    const apiUrl =
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/getStockTransferRequest.php` +
      `?Status=Pending&ShopId=${encodeURIComponent(shopId)}`;

    console.log("Stock Transfer GET API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const responseText = await response.text();

    console.log("Stock Transfer GET Raw Response:", responseText);

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid JSON response from Stock Transfer API.");
    }

    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.message || `Failed to fetch requests. Status: ${response.status}`
      );
    }

    console.log("Stock Transfer GET Response:", result);

    const requests = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
      ? result
      : Array.isArray(result?.requests)
      ? result.requests
      : [];

    const mappedEntries = requests.map((request) => {
      const items = Array.isArray(request.Items)
        ? request.Items
        : request.ProductId != null
        ? [
            {
              ProductId: request.ProductId,
              ProductName: request.ProductName,
              Quantity: request.Quantity,
              Rate: request.Rate,
            },
          ]
        : [];

      return {
        id: request.RequestId,
        date: request.RequestDate,
        totalQuantity: items.reduce(
          (sum, item) => sum + Number(item.Quantity || 0),
          0
        ),
        status:
          request.RequestStatus ||
          request.Status ||
          "Pending",
        details: items.map((item) => ({
          ProductId: item.ProductId,
          ProductName: item.ProductName || "Product",
          Quantity: Number(item.Quantity || 0),
          Rate: Number(item.Rate || 0),
        })),
      };
    });

    setEntries(mappedEntries);
  } catch (error) {
    console.error("Stock Transfer GET API Error:", error);
    toast.error(
      error.message || "Failed to load stock transfer requests."
    );
  } finally {
    setLoadingRequests(false);
  }
}, []);



 useEffect(() => {
  fetchProduct();
  fetchStockTransferRequests();
}, [fetchProduct, fetchStockTransferRequests]);

  // Search products by Product Code or Product Name
  const filteredProducts = useMemo(() => {
    const search = productSearch.trim().toLowerCase();

    if (!search) {
      return productOptions;
    }

    return productOptions.filter(
      (product) =>
        product.productCode.toLowerCase().includes(search) ||
        product.label.toLowerCase().includes(search)
    );
  }, [productOptions, productSearch]);

  // Total from products having Quantity greater than zero
  const totalAmount = useMemo(() => {
    return productOptions.reduce((total, product) => {
      const values = productValues[String(product.value)] || {};

      return (
        total +
        Number(values.Quantity || 0) * Number(values.Rate || 0)
      );
    }, 0);
  }, [productOptions, productValues]);

  // Reset form for a new entry
  const resetForm = () => {
    const initialValues = {};

    productOptions.forEach((product) => {
      initialValues[String(product.value)] = {
        Quantity: 0,
        Rate: product.rate,
      };
    });

    setProductValues(initialValues);
    setDate(new Date());
    setProductSearch("");
    setEditingId(null);
  };

 const handleOpenForm = () => {
  console.log("Create Stock Outward button clicked");

  resetForm();
  setOpenForm(true);
};

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setProductSearch("");
    setEditingId(null);
  };

  // Update a product's Quantity or Rate
  const updateProductValue = (productId, field, value) => {
    if (value !== "" && Number(value) < 0) {
      return;
    }

    const key = String(productId);

    setProductValues((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] || {
          Quantity: 0,
          Rate: 0,
        }),
        [field]: value,
      },
    }));
  };

  // Clear quantity without removing the product from the table
  const clearProductQuantity = (productId) => {
    updateProductValue(productId, "Quantity", 0);
  };

  // Save stock transfer requests to the backend



// const handleSave = async () => {
//   if (saving) {
//     return;
//   }

//   if (!date || Number.isNaN(new Date(date).getTime())) {
//     toast.error("Please select a valid date.");
//     return;
//   }

//   const selectedProducts = productOptions
//     .map((product) => {
//       const values = productValues[String(product.value)] || {};

//       return {
//         ProductId: product.value,
//         ProductCode: product.productCode,
//         ProductName: product.label,
//         Quantity:
//           values.Quantity === "" || values.Quantity == null
//             ? 0
//             : Number(values.Quantity),
//         Rate:
//           values.Rate === "" || values.Rate == null
//             ? Number(product.rate ?? 0)
//             : Number(values.Rate),
//       };
//     })
//     .filter((product) => product.Quantity > 0);

//   if (selectedProducts.length === 0) {
//     toast.error("Please enter Quantity for at least one product.");
//     return;
//   }

//   const invalidRow = selectedProducts.find(
//     (product) =>
//       product.ProductId === "" ||
//       product.ProductId == null ||
//       !Number.isFinite(product.Quantity) ||
//       !Number.isFinite(product.Rate) ||
//       product.Quantity <= 0 ||
//       product.Rate < 0
//   );

//   if (invalidRow) {
//     toast.error(
//       `Please enter valid Quantity and Rate for ${
//         invalidRow.ProductName || "the selected product"
//       }.`
//     );
//     return;
//   }

//  const shopId = STOCK_OUTWARD_SHOP_ID;
// const officeId = STOCK_OUTWARD_OFFICE_ID;
// const requestedBy = 1;

//   if (!shopId) {
//     toast.error("Shop ID not found. Please check login configuration.");
//     return;
//   }

//   if (!requestedBy) {
//     toast.error("User ID not found. Please log in again.");
//     return;
//   }

//   setSaving(true);

//   let savedCount = 0;

//   try {
//     for (const product of selectedProducts) {
//       const formData = new URLSearchParams();

//       formData.append("ShopId", String(shopId));
//       formData.append("OfficeId", String(officeId));
//       formData.append("RequestedBy", String(requestedBy));
//       formData.append("ProductId", String(product.ProductId));
//       formData.append("Quantity", String(product.Quantity));

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postStockTransferRequest.php",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Accept: "application/json",
//           },
//           body: formData.toString(),
//         }
//       );

//       const responseText = await response.text();

//       let result;

//       try {
//         result = JSON.parse(responseText);
//       } catch {
//         throw new Error(
//           `Invalid API response for ${product.ProductName}.`
//         );
//       }

//       if (
//         !response.ok ||
//         result?.success === false ||
//         result?.Success === false
//       ) {
//         throw new Error(
//           result?.message ||
//             result?.Message ||
//             `Failed to save request for ${product.ProductName}.`
//         );
//       }

//       savedCount += 1;
//     }

//     toast.success(
//       `${savedCount} stock transfer request(s) saved successfully.`
//     );

//     setOpenForm(false);
//     setProductSearch("");
//     setEditingId(null);
//     setDate(new Date());

//     setProductValues(() => {
//       const initialValues = {};

//       productOptions.forEach((product) => {
//         initialValues[String(product.value)] = {
//           Quantity: 0,
//           Rate: product.rate,
//         };
//       });

//       return initialValues;
//     });

//     await fetchStockTransferRequests();
//   } catch (error) {
//     console.error("Stock Transfer Save API Error:", error);

//     if (savedCount > 0) {
//       toast.warning(
//         `${savedCount} request(s) saved. Some remaining requests failed. ${error.message}`
//       );
//     } else {
//       toast.error(
//         error.message || "Failed to save stock transfer requests."
//       );
//     }

//     try {
//       await fetchStockTransferRequests();
//     } catch (refreshError) {
//       console.error(
//         "Failed to refresh stock transfer requests:",
//         refreshError
//       );
//     }
//   } finally {
//     setSaving(false);
//   }
// };















const handleSave = async () => {
  if (saving) return;

  if (!date || Number.isNaN(new Date(date).getTime())) {
    toast.error("Please select a valid date.");
    return;
  }

  // Collect all products with a quantity greater than zero.
  const selectedProducts = productOptions
    .map((product) => {
      const values = productValues[String(product.value)] || {};

      return {
        ProductId: Number(product.value),
        Quantity:
          values.Quantity === "" || values.Quantity == null
            ? 0
            : Number(values.Quantity),
        Rate:
          values.Rate === "" || values.Rate == null
            ? Number(product.rate ?? 0)
            : Number(values.Rate),
        ProductName: product.label,
      };
    })
    .filter((product) => product.Quantity > 0);

  if (selectedProducts.length === 0) {
    toast.error("Please enter Quantity for at least one product.");
    return;
  }

  // Validate each selected product.
  const invalidProduct = selectedProducts.find(
    (product) =>
      !Number.isInteger(product.ProductId) ||
      product.ProductId <= 0 ||
      !Number.isFinite(product.Quantity) ||
      product.Quantity <= 0 ||
      !Number.isFinite(product.Rate) ||
      product.Rate < 0
  );

  if (invalidProduct) {
    toast.error(
      `Please check Quantity and Rate for ${invalidProduct.ProductName}.`
    );
    return;
  }

  const shopId = Number(STOCK_OUTWARD_SHOP_ID);
  const officeId = Number(STOCK_OUTWARD_OFFICE_ID);

  // Replace with the logged-in user's numeric ID when available.
  const requestedBy = 1;

  if (
    !Number.isInteger(shopId) ||
    shopId <= 0 ||
    !Number.isInteger(officeId) ||
    officeId <= 0 ||
    !Number.isInteger(requestedBy) ||
    requestedBy <= 0
  ) {
    toast.error("Invalid Shop ID, Office ID, or User ID.");
    return;
  }

  // Build one request containing all selected products.
  const items = selectedProducts.map((product) => ({
    ProductId: product.ProductId,
    Quantity: product.Quantity,
  }));

  const formData = new URLSearchParams();
  formData.append("ShopId", String(shopId));
  formData.append("OfficeId", String(officeId));
  formData.append("RequestedBy", String(requestedBy));
  formData.append("Items", JSON.stringify(items));

  setSaving(true);

  try {
    console.log("Stock Outward Items:", items);
    console.log("Stock Outward Form Payload:", formData.toString());

    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/postStockTransferRequest.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      }
    );

    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Invalid API response. HTTP status: ${response.status}.`
      );
    }

    console.log("Stock Outward API Response:", result);

    if (
      !response.ok ||
      result?.success === false ||
      result?.Success === false
    ) {
      throw new Error(
        result?.message ||
          result?.Message ||
          `Failed to save entry. HTTP status: ${response.status}.`
      );
    }

    toast.success(
      `Stock Outward entry saved with ${selectedProducts.length} product(s).`
    );

    setOpenForm(false);
    setProductSearch("");
    setEditingId(null);
    setDate(new Date());

    const initialValues = {};
    productOptions.forEach((product) => {
      initialValues[String(product.value)] = {
        Quantity: 0,
        Rate: product.rate,
      };
    });

    setProductValues(initialValues);

    await fetchStockTransferRequests();
  } catch (error) {
    console.error("Stock Outward Save API Error:", error);
    toast.error(error.message || "Failed to save Stock Outward entry.");
  } finally {
    setSaving(false);
  }
};















  // Edit an existing preview entry
  const handleEdit = (entry) => {
    const values = {};

    // Initialize every product first
    productOptions.forEach((product) => {
      values[String(product.value)] = {
        Quantity: 0,
        Rate: product.rate,
      };
    });

    // Restore saved product values
    entry.details.forEach((item) => {
      values[String(item.ProductId)] = {
        Quantity: item.Quantity,
        Rate: item.Rate,
      };
    });

    setProductValues(values);
    setEditingId(entry.id);
    setDate(new Date(entry.date));
    setProductSearch("");
    setOpenForm(true);
  };

  // Delete a preview entry
  const handleDelete = () => {
    setEntries((previous) =>
      previous.filter((entry) => entry.id !== deleteId)
    );

    setDeleteDialogOpen(false);
    setDeleteId(null);

    toast.success("Temporary preview entry deleted.");
  };

  // Main listing columns
  const columns = useMemo(
    () => [
      {
        header: "Sr.No",
        size: 80,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "date",
        header: "Date",
        Cell: ({ cell }) =>
          new Date(cell.getValue()).toLocaleDateString("en-GB"),
      },
     {
  accessorKey: "totalQuantity",
  header: "Total Quantity",
  Cell: ({ cell }) => Number(cell.getValue() || 0),
},
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            color="warning"
            size="small"
          />
        ),
      },


 
{
  header: "Actions",
  enableSorting: false,
  Cell: ({ row }) => (
    <Button
      variant="contained"
      size="small"
      startIcon={<VisibilityIcon />}
      onClick={() => handleView(row.original)}
      sx={{
        backgroundColor: "#0B5E20",
        color: "#fff",
        textTransform: "none",
        borderRadius: 2,
        px: 2,
        "&:hover": {
          backgroundColor: "#084719",
        },
      }}
    >
      View Details
    </Button>
  ),
},

    ],
    [productOptions]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          p: { xs: 1.5, md: 3 },
          boxSizing: "border-box",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            color="var(--complementary-color)"
            variant="h4"
            fontWeight={700}
          >
            Stock Outward
          </Typography>
        </Box>

        <Box mb={0}>

        <Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={handleOpenForm}
  sx={{
    background: "var(--complementary-color)",
    "&:hover": {
      background: "var(--complementary-color)",
    },
    borderRadius: "5px 5px 0 0",
    textTransform: "uppercase",
    fontSize: "15px",
    fontWeight: 600,
    px: 2.5,
    py: 1.5,
  }}
>
  Create Stock Outward Entry
</Button>


        </Box>

     <MaterialReactTable
  columns={columns}
  data={entries}
  enablePagination
  initialState={{ density: "comfortable" }}
  state={{ isLoading: loadingRequests }}
  muiTableHeadCellProps={{
    sx: {
      backgroundColor: "#E9ECEF",
      color: "black",
      fontSize: "15px",
      fontWeight: "bold",
    },
  }}
/>






{/* CREATE STOCK OUTWARD FORM */}
<Dialog
  open={openForm}
  onClose={handleCloseForm}
  fullWidth
  maxWidth="xl"
  PaperProps={{
    sx: {
      borderRadius: 2,
      width: "96vw",
      maxWidth: "1400px",
      height: "92vh",
      maxHeight: "92vh",
      m: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: "rgb(236, 253, 230)",
      color: "#0B5E20",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: 700,
      fontSize: 22,
      borderBottom: "1px solid #ddd",
    }}
  >
    Stock Outward

    <IconButton
      onClick={handleCloseForm}
      disabled={saving}
      aria-label="Close"
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent
    dividers
    sx={{
      p: { xs: 1.5, sm: 2.5 },
      overflow: "auto",
      flex: 1,
      minHeight: 0,
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 2.5,
        mb: 2,
        pb: 2,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Box>
        <Typography fontWeight={600} mb={0.7}>
          Stock Outward:
        </Typography>

        <TextField
          size="small"
          fullWidth
          value="Stock Outward"
          InputProps={{ readOnly: true }}
        />
      </Box>

      <Box>
        <Typography fontWeight={600} mb={0.7}>
          Date:
        </Typography>

        <DatePicker
          value={date}
          onChange={setDate}
          format="dd-MM-yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
            },
          }}
        />
      </Box>
    </Box>

    <Typography fontWeight={600} mb={0.7}>
      Product:
    </Typography>

    <Autocomplete
      freeSolo
      options={filteredProducts}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : option.label || ""
      }
      inputValue={productSearch}
      onInputChange={(event, newValue) => {
        setProductSearch(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search Product / Code"
          size="small"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loadingProducts && (
                  <CircularProgress size={18} />
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{ mb: 2 }}
    />

    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        maxHeight: "48vh",
        overflow: "auto",
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            {[
              "Product Code",
              "Product Name",
              "Quantity",
              "Rate",
              "Amount",
              "Action",
            ].map((heading) => (
              <TableCell
                key={heading}
                sx={{
                  backgroundColor: "#E9ECEF",
                  fontWeight: 700,
                }}
                align={
                  ["Quantity", "Rate"].includes(heading)
                    ? "center"
                    : heading === "Amount"
                    ? "right"
                    : "left"
                }
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loadingProducts && productOptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => {
              const key = String(product.value);
              const values = productValues[key] || {
                Quantity: 0,
                Rate: product.rate,
              };

              const amount =
                Number(values.Quantity || 0) *
                Number(values.Rate || 0);

              return (
                <TableRow key={key} hover>
                  <TableCell>
                    {product.productCode || "-"}
                  </TableCell>

                  <TableCell>{product.label}</TableCell>

                  <TableCell sx={{ minWidth: 130 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={values.Quantity}
                      onChange={(event) => {
                        const value = event.target.value;

                        if (
                          value === "" ||
                          /^\d*\.?\d*$/.test(value)
                        ) {
                          updateProductValue(
                            product.value,
                            "Quantity",
                            value
                          );
                        }
                      }}
                      inputProps={{ inputMode: "decimal" }}
                    />
                  </TableCell>

                  <TableCell sx={{ minWidth: 130 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={values.Rate}
                      onChange={(event) => {
                        const value = event.target.value;

                        if (
                          value === "" ||
                          /^\d*\.?\d*$/.test(value)
                        ) {
                          updateProductValue(
                            product.value,
                            "Rate",
                            value
                          );
                        }
                      }}
                      inputProps={{ inputMode: "decimal" }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    ₹ {amount.toFixed(2)}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Reset Quantity">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() =>
                          clearProductQuantity(product.value)
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <Box
      display="flex"
      justifyContent="flex-end"
      mt={2}
      p={2}
      sx={{
        backgroundColor: "#f7f7f7",
        border: "1px solid #e0e0e0",
        borderRadius: 1,
      }}
    >
      <Typography fontWeight={700} fontSize={19}>
        Total: ₹{" "}
        {totalAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Box>

    <Box mt={1.5}>
      <Chip
        label="Approval Status: Pending"
        color="warning"
        size="small"
      />
    </Box>
  </DialogContent>

  <DialogActions
    sx={{
      px: 2.5,
      py: 1.5,
      justifyContent: "flex-start",
      gap: 1,
    }}
  >
    <Button
      variant="contained"
      onClick={handleSave}
      disabled={saving || loadingProducts}
      sx={{
        backgroundColor: "#0B5E20",
        "&:hover": { backgroundColor: "#084719" },
        textTransform: "none",
      }}
    >
      {saving ? "Saving..." : "Save"}
    </Button>

    <Button
      variant="outlined"
      onClick={handleCloseForm}
      disabled={saving}
      sx={{ textTransform: "none" }}
    >
      Cancel
    </Button>
  </DialogActions>
</Dialog>




     <Dialog
  open={viewDialogOpen}
  onClose={handleCloseView}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
    },
  }}
>
  <DialogTitle
    sx={{
      background: "linear-gradient(135deg, #0B5E20, #238636)",
      color: "#fff",
      px: 3,
      py: 2.5,
    }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Inventory2OutlinedIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Stock Outward Details
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Request ID: {selectedEntry?.id ?? "-"}
          </Typography>
        </Box>
      </Box>

      <IconButton
        onClick={handleCloseView}
        sx={{ color: "#fff" }}
        aria-label="Close details"
      >
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ p: 3, backgroundColor: "#f8faf9" }}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={1}
      mb={2.5}
      mt={1}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          Request Date
        </Typography>
        <Typography fontWeight={600}>
          {selectedEntry?.date
            ? new Date(selectedEntry.date).toLocaleDateString("en-IN")
            : "-"}
        </Typography>
      </Box>

      <Chip
        label={selectedEntry?.status || "Pending"}
        color={
          String(selectedEntry?.status).toLowerCase() === "approved"
            ? "success"
            : String(selectedEntry?.status).toLowerCase() === "rejected"
            ? "error"
            : "warning"
        }
        sx={{ fontWeight: 600 }}
      />
    </Box>

    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, overflow: "hidden" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
            <TableCell>
              <strong>Product Name</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Quantity</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {selectedEntry?.details?.length ? (
            selectedEntry.details.map((item, index) => (
              <TableRow key={`${item.ProductId}-${index}`} hover>
                <TableCell>
                  <Typography fontWeight={500}>
                    {item.ProductName || "Product"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Product ID: {item.ProductId ?? "-"}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography fontWeight={700}>
                    {Number(item.Quantity || 0)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No product details available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        mt: 2.5,
        p: 2,
        borderRadius: 2,
        backgroundColor: "#e8f5e9",
        border: "1px solid #c8e6c9",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography color="#245b31" fontWeight={600}>
          Total Quantity
        </Typography>

        <Typography variant="h5" fontWeight={800} color="#0B5E20">
          {Number(selectedEntry?.totalQuantity || 0)}
        </Typography>
      </Box>
    </Paper>
  </DialogContent>

  <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#fff" }}>
    <Button
      variant="contained"
      onClick={handleCloseView}
      sx={{
        backgroundColor: "#0B5E20",
        textTransform: "none",
        px: 3,
        "&:hover": {
          backgroundColor: "#084719",
        },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

        {/* Delete confirmation for preview entries */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete Stock Outward Entry</DialogTitle>

          <DialogContent>
            Are you sure you want to delete this temporary entry?
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default StockOutward;