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

const PRODUCT_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster";

const StockOutward = () => {
  const [productOptions, setProductOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [entries, setEntries] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState(new Date());
  const [productSearch, setProductSearch] = useState("");

  // Product-wise quantity and rate
  const [productValues, setProductValues] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch ProductMaster data
  const fetchProduct = useCallback(async () => {
    try {
      setLoadingProducts(true);

      const response = await fetch(PRODUCT_API);

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

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

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

  // Save frontend preview only
  const handleSave = () => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      toast.error("Please select a valid date.");
      return;
    }

    // Include only products with Quantity > 0
    const selectedProducts = productOptions
      .map((product) => {
        const values = productValues[String(product.value)] || {};

        return {
          ProductId: product.value,
          ProductCode: product.productCode,
          ProductName: product.label,
          Quantity: Number(values.Quantity || 0),
          Rate: Number(values.Rate ?? product.rate),
        };
      })
      .filter((product) => product.Quantity > 0);

    if (selectedProducts.length === 0) {
      toast.error("Please enter Quantity for at least one product.");
      return;
    }

    const invalidRow = selectedProducts.find(
      (product) =>
        !Number.isFinite(product.Quantity) ||
        !Number.isFinite(product.Rate) ||
        product.Quantity <= 0 ||
        product.Rate < 0
    );

    if (invalidRow) {
      toast.error("Please enter valid Quantity and Rate.");
      return;
    }

    setSaving(true);

    try {
      const entry = {
        id: editingId || Date.now(),
        date: new Date(date).toISOString(),
        total: selectedProducts.reduce(
          (sum, product) =>
            sum + product.Quantity * product.Rate,
          0
        ),
        status: "Pending (Preview)",
        details: selectedProducts,
      };

      if (editingId) {
        setEntries((previous) =>
          previous.map((item) =>
            item.id === editingId ? entry : item
          )
        );
      } else {
        setEntries((previous) => [entry, ...previous]);
      }

      setOpenForm(false);
      setProductSearch("");
      setEditingId(null);

      toast.success(
        "Entry frontend preview मध्ये save झाली. Backend मध्ये save केलेली नाही."
      );
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
        accessorKey: "total",
        header: "Total",
        Cell: ({ cell }) =>
          `₹ ${Number(cell.getValue() || 0).toFixed(2)}`,
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
          <Box display="flex" justifyContent="center" gap={1}>
            <Button
              size="small"
              onClick={() => {
                const details = row.original.details
                  .map(
                    (item) =>
                      `${item.ProductName} - Qty: ${item.Quantity}`
                  )
                  .join("\n");

                window.alert(details);
              }}
            >
              View
            </Button>

            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => handleEdit(row.original)}
              >
                <span style={{ fontSize: 16 }}>✏️</span>
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => {
                  setDeleteId(row.original.id);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#E9ECEF",
              color: "black",
              fontSize: "15px",
              fontWeight: "bold",
            },
          }}
        />

        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          fullWidth
          maxWidth="xl"
          PaperProps={{
            sx: {
              borderRadius: "6px",
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              py: 1.5,
              px: 2.5,
              color: "#0B5E20",
              fontWeight: 700,
              fontSize: "22px",
              flexShrink: 0,
            }}
          >
            Stock Outward

            <IconButton
              onClick={handleCloseForm}
              disabled={saving}
              size="small"
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              backgroundColor: "#fff",
              p: { xs: 1.5, sm: 2.5 },
              overflow: "auto",
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Office and Date */}
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
                <Typography fontWeight={600} mb={0.7} fontSize="15px">
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
                <Typography fontWeight={600} mb={0.7} fontSize="15px">
                  Date:
                </Typography>

                <DatePicker
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
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

            {/* Search */}
            <Typography fontWeight={600} mb={0.7} fontSize="15px">
              Product:
            </Typography>

            <Autocomplete
              freeSolo
              options={[]}
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
                          <CircularProgress size={18} color="inherit" />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 1.8 }}
            />

            {/* All products are displayed here */}
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                maxHeight: {
                  xs: 300,
                  sm: "min(48vh, 500px)",
                },
                overflow: "auto",
                borderRadius: "4px",
                "&::-webkit-scrollbar": {
                  width: "10px",
                  height: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#999",
                  borderRadius: "10px",
                },
              }}
            >
              <Table
                stickyHeader
                size="medium"
                sx={{
                  minWidth: 850,
                  "& .MuiTableCell-root": {
                    borderRight: "1px solid #dedede",
                    py: 1.1,
                    px: 1.5,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#E9ECEF",
                        fontWeight: "bold",
                        fontSize: "16px",
                        minWidth: 150,
                      }}
                    >
                      Product Code
                    </TableCell>

                    <TableCell
                      sx={{
                        backgroundColor: "#E9ECEF",
                        fontWeight: "bold",
                        fontSize: "16px",
                        minWidth: 300,
                      }}
                    >
                      Product Name
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#E9ECEF",
                        fontWeight: "bold",
                        fontSize: "16px",
                        minWidth: 190,
                      }}
                    >
                      Quantity
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#E9ECEF",
                        fontWeight: "bold",
                        fontSize: "16px",
                        minWidth: 170,
                      }}
                    >
                      Rate
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#E9ECEF",
                        fontWeight: "bold",
                        fontSize: "16px",
                        minWidth: 150,
                      }}
                    >
                      Amount
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#E9ECEF",
                        fontWeight: "bold",
                        fontSize: "16px",
                        minWidth: 90,
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loadingProducts && productOptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={24} />
                        <Typography mt={1}>Loading products...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
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

                      const quantity = Number(values.Quantity || 0);
                      const rate = Number(values.Rate || 0);
                      const amount = quantity * rate;

                      return (
                        <TableRow key={key} hover>
                          <TableCell>
                            {product.productCode || "-"}
                          </TableCell>

                          <TableCell>{product.label}</TableCell>

                          <TableCell sx={{ minWidth: 170 }}>

  <TextField
  size="small"
  fullWidth
  type="text"
  value={values.Quantity}
  onChange={(event) => {
    const value = event.target.value;

    // Allow only non-negative numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      updateProductValue(
        product.value,
        "Quantity",
        value
      );
    }
  }}
  inputProps={{
    inputMode: "decimal",
  }}
/>
                          </TableCell>

                          <TableCell sx={{ minWidth: 150 }}>
                            
                       <TextField
  size="small"
  fullWidth
  type="text"
  value={values.Rate}
  onChange={(event) => {
    const value = event.target.value;

    // Allow only non-negative numbers and decimal values
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      updateProductValue(
        product.value,
        "Rate",
        value
      );
    }
  }}
  inputProps={{
    inputMode: "decimal",
  }}
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

            {/* Total */}
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              mt={2}
              p={1.8}
              sx={{
                backgroundColor: "#f7f7f7",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
              }}
            >
              <Typography fontWeight={700} fontSize="19px">
                Total: ₹{" "}
                {totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>

            <Box mt={1.5}>
              <Chip
                label="Approval Status: Pending (Frontend Preview)"
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
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
              flexShrink: 0,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || loadingProducts}
              sx={{
                minWidth: 100,
                backgroundColor: "#0B5E20",
                "&:hover": {
                  backgroundColor: "#084719",
                },
                textTransform: "none",
              }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button
              variant="outlined"
              onClick={handleCloseForm}
              disabled={saving}
              sx={{
                minWidth: 100,
                color: "var(--complementary-color)",
                borderColor: "var(--complementary-color)",
                textTransform: "none",
              }}
            >
              Cancel
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