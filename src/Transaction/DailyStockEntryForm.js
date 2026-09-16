

import React, { useEffect, useMemo, useState } from "react";

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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import { MaterialReactTable } from "material-react-table";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
// API BASE URL
// ============================================================



// ============================================================
// COMPONENT
// ============================================================

const DailyStockEntryAtMainOffice = () => {
  // ==========================================================
  // MAIN TABLE DATA
  // ==========================================================

  const [stockEntries, setStockEntries] = useState([]);

  // ==========================================================
  // FORM DIALOG
  // ==========================================================

  const [openForm, setOpenForm] = useState(false);

  const [saving, setSaving] = useState(false);

  // ==========================================================
  // SHOP / ACCOUNT
  // ==========================================================

  const [shopOptions, setShopOptions] = useState([]);

  const [selectedShop, setSelectedShop] = useState(null);

  const [loadingShops, setLoadingShops] = useState(false);


  const [editingEntry, setEditingEntry] = useState(null);


  

  // ==========================================================
  // DATE
  // ==========================================================

  const [date, setDate] = useState(new Date());

  // ==========================================================
  // PRODUCT
  // ==========================================================

  const [productOptions, setProductOptions] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loadingProducts, setLoadingProducts] = useState(false);

  // ==========================================================
  // QUANTITY / RATE
  // ==========================================================

  const [quantity, setQuantity] = useState("");

  const [rate, setRate] = useState("");

  // ==========================================================
  // PRODUCT DETAIL ROWS
  // ==========================================================

  const [rows, setRows] = useState([]);

  // ==========================================================
  // PAGE NUMBER
  // ==========================================================

  const [pageNo, setPageNo] = useState(1);



 const pageSize = 10;

  // ==========================================================
  // FETCH ACCOUNT / SHOP
  // ==========================================================

  // ==========================================================
  // FETCH PRODUCT
  // ==========================================================
const fetchProduct = async () => {
  try {
    setLoadingProducts(true);

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`Product API failed: ${response.status}`);
    }

    const data = await response.json();

    const productData = Array.isArray(data) ? data : [];

    const options = productData
      .filter(
        (item) =>
          item?.ProductName !== null &&
          item?.ProductName !== undefined &&
          String(item?.ProductName).trim() !== ""
      )
      .map((item) => ({
        value: item?.Id ?? "",

        label: String(item?.ProductName ?? "").trim(),

        productCode: item?.ProductCode ?? "",

        rate: Number(item?.PurchasePrice ?? 0),
      }));

    setProductOptions(options);

    console.log("PRODUCT API RESPONSE:", data);
  } catch (error) {
    console.error("Product API Error:", error);
    toast.error("Product data could not be loaded");
  } finally {
    setLoadingProducts(false);
  }
};

// ============================================================
// FETCH DAILY STOCK HEADER BY ID
// ============================================================
const fetchDailyStockHeader = async (headerId) => {
  try {
    // Header ID is required
    if (!headerId) {
      console.error("Daily Stock Header ID is required");
      return [];
    }

    const response = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Daily Stock Header API failed: ${response.status}`
      );
    }

    const result = await response.json();

    console.log("DAILY STOCK HEADER RESPONSE:", result);

    // ============================================================
    // HANDLE API RESPONSE
    // ============================================================

    let data = [];

    if (Array.isArray(result)) {
      data = result;
    } else if (Array.isArray(result?.data)) {
      data = result.data;
    } else if (result?.success && result?.data) {
      data = [result.data];
    } else if (result && typeof result === "object") {
      data = [result];
    }

    console.log("DAILY STOCK HEADER DATA:", data);

    // ============================================================
    // MAP API RESPONSE FOR MAIN TABLE
    // ============================================================

    const mappedData = data.map((item) => ({
      ...item,

      // Header ID
      id: item?.Id || item?.id || "",

      // Date
      dateText: item?.EntryDate
        ? formatDate(item.EntryDate)
        : item?.dateText || "",

      // Shop Name
      shop:
        item?.ShopName ||
        item?.shop ||
        "",

      // Total Amount
      total: Number(
        item?.TotalAmount ??
        item?.total ??
        0
      ),
    }));

    console.log(
      "MAPPED DAILY STOCK HEADER DATA:",
      mappedData
    );

    setStockEntries(mappedData);

    return mappedData;
  } catch (error) {
    console.error(
      "Daily Stock Header API Error:",
      error
    );

    toast.error(
      "Daily Stock Header data could not be loaded"
    );

    return [];
  }
};

const fetchDailyStockDetail = async (headerId) => {
  try {
    if (!headerId) {
      return [];
    }

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?Id=${headerId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Daily Stock Detail API failed: ${response.status}`
      );
    }

    const result = await response.json();

    console.log(
      "DAILY STOCK DETAIL RESPONSE:",
      result
    );

    const data = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
      ? result.data
      : [];

    return data;
  } catch (error) {
    console.error(
      "Daily Stock Detail API Error:",
      error
    );

    toast.error(
      "Daily Stock Detail data could not be loaded"
    );

    return [];
  }
};


const updateDailyStockHeader = async (
  headerId,
  entryDate,
  shopId,
  totalAmount
) => {
  try {
    const updateData = new URLSearchParams();

    updateData.append("Id", String(headerId));

    updateData.append(
      "EntryDate",
      entryDate
    );

    updateData.append(
      "ShopId",
      String(shopId || "")
    );

    updateData.append(
      "OfficeId",
      ""
    );

    updateData.append(
      "TotalAmount",
      String(Number(totalAmount || 0))
    );

    updateData.append(
      "UpdatedBy",
      "1"
    );

    const requestOptions = {
      method: "POST",
      body: updateData,
      redirect: "follow",
    };

    const response = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Daily Stock Header Update API failed: ${response.status}`
      );
    }

    const result = await response.json();

    console.log(
      "DAILY STOCK HEADER UPDATE RESPONSE:",
      result
    );

    return result;
  } catch (error) {
    console.error(
      "Daily Stock Header Update API Error:",
      error
    );

    throw error;
  }
};





  // ==========================================================
  // INITIAL API CALL
  // ==========================================================

 useEffect(() => {
  fetchProduct();
}, []);

  // ==========================================================
  // RESET FORM
  // ==========================================================
const resetForm = () => {
  setSelectedShop(null);
  setDate(new Date());
  setSelectedProduct(null);
  setQuantity("");
  setRate("");
  setRows([]);
  setEditingEntry(null);
};

  // ==========================================================
  // OPEN FORM
  // ==========================================================

  const handleOpenForm = () => {
    resetForm();

    setOpenForm(true);
  };

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setOpenForm(false);

    resetForm();
  };

  // ==========================================================
  // PRODUCT CHANGE
  // ==========================================================

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);

    if (newValue) {
      setRate(newValue.rate);
    } else {
      setRate("");
    }
  };

  // ==========================================================
  // QUANTITY CHANGE
  // ==========================================================

  const handleQuantityChange = (event) => {
    const value = event.target.value;

    if (value === "" || Number(value) >= 0) {
      setQuantity(value);
    }
  };

  // ==========================================================
  // RATE CHANGE
  // ==========================================================

  // ==========================================================
  // ADD PRODUCT
  // ==========================================================

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast.error("Please select Product");

      return;
    }

    if (quantity === "" || Number(quantity) <= 0) {
      toast.error("Please enter Quantity");

      return;
    }

    if (rate === "" || Number(rate) < 0) {
      toast.error("Please enter Rate");

      return;
    }

    const qty = Number(quantity);

    const productRate = Number(rate);

    const amount = qty * productRate;

    const newRow = {
      Id: "",

      ProductId: selectedProduct.value,

      ProductCode: selectedProduct.productCode,

      ProductName: selectedProduct.label,

      Quantity: qty,

      Rate: productRate,

      Amount: amount,
    };

    setRows((previousRows) => [...previousRows, newRow]);

    setSelectedProduct(null);

    setQuantity("");

    setRate("");
  };

  // ==========================================================
  // DELETE DETAIL ROW
  // ==========================================================

  const handleDeleteRow = (index) => {
    setRows((previousRows) =>
      previousRows.filter((_, rowIndex) => rowIndex !== index),
    );
  };

  // ==========================================================
  // TOTAL
  // ==========================================================

  const total = useMemo(() => {
    return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
  }, [rows]);

 const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const d = new Date(value);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};


// ==========================================================
// MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
// ==========================================================

const mappedStockEntries = useMemo(() => {
  return stockEntries.map((item) => ({
    ...item,

    id: item?.Id || item?.id || "",

    dateText: item?.EntryDate
      ? formatDate(item.EntryDate)
      : item?.dateText || "",

    shop:
      item?.ShopName ||
      item?.AccountName ||
      item?.Shop ||
      item?.Name ||
      item?.shop ||
      "",

    total: Number(
      item?.TotalAmount ??
        item?.total ??
        0
    ),
  }));
}, [stockEntries]);



  // ==========================================================
  // SAVE DAILY STOCK ENTRY
  // ==========================================================

 const handleSave = async () => {
  if (!selectedShop) {
    toast.error("Please select Main Office");
    return;
  }

  if (!date) {
    toast.error("Please select Date");
    return;
  }

  if (rows.length === 0) {
    toast.error("Please add at least one Product");
    return;
  }

  try {
    setSaving(true);

    const entryDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

    // ============================================
    // EDIT EXISTING ENTRY
    // ============================================
    if (editingEntry) {
      const headerId =
        editingEntry?.Id ||
        editingEntry?.id;

      if (!headerId) {
        throw new Error(
          "Daily Stock Header ID not found"
        );
      }

      // --------------------------------------------
      // UPDATE HEADER
      // --------------------------------------------
      await updateDailyStockHeader(
        headerId,
        entryDate,
        selectedShop?.Id,
        total
      );

      console.log(
        "DAILY STOCK HEADER UPDATED:",
        headerId
      );

    // --------------------------------------------
// UPDATE / INSERT DETAILS
// --------------------------------------------
for (const row of rows) {
  const detailId =
    row?.Id ||
    row?.id;

  // --------------------------------------------
  // EXISTING DETAIL → UPDATE
  // --------------------------------------------
  if (detailId) {
    const detailData = new URLSearchParams();

    detailData.append(
      "Id",
      String(detailId)
    );

    detailData.append(
      "ProductId",
      String(row.ProductId || "")
    );

    detailData.append(
      "Quantity",
      String(Number(row.Quantity || 0))
    );

    detailData.append(
      "Rate",
      String(Number(row.Rate || 0))
    );

    detailData.append(
      "Amount",
      String(Number(row.Amount || 0))
    );

    detailData.append(
      "UpdatedBy",
      "1"
    );

    const detailRequestOptions = {
      method: "POST",
      body: detailData,
      redirect: "follow",
    };

    const detailResponse = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
      detailRequestOptions
    );

    if (!detailResponse.ok) {
      throw new Error(
        `Daily Stock Detail Update API failed: ${detailResponse.status}`
      );
    }

    const detailResult =
      await detailResponse.json();

    console.log(
      "DAILY STOCK DETAIL UPDATE RESPONSE:",
      detailResult
    );
  }

  // --------------------------------------------
  // NEW DETAIL → INSERT
  // --------------------------------------------
  else {
    const detailData = new URLSearchParams();

    detailData.append(
      "DailyStockHeaderId",
      String(headerId)
    );

    detailData.append(
      "ProductId",
      String(row.ProductId || "")
    );

    detailData.append(
      "Quantity",
      String(Number(row.Quantity || 0))
    );

    detailData.append(
      "Rate",
      String(Number(row.Rate || 0))
    );

    detailData.append(
      "Amount",
      String(Number(row.Amount || 0))
    );

    detailData.append(
      "CreatedBy",
      "1"
    );

    const detailRequestOptions = {
      method: "POST",
      body: detailData,
      redirect: "follow",
    };

    const detailResponse = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
      detailRequestOptions
    );

    if (!detailResponse.ok) {
      throw new Error(
        `Daily Stock Detail Post API failed: ${detailResponse.status}`
      );
    }

    const detailResult =
      await detailResponse.json();

    console.log(
      "DAILY STOCK DETAIL POST RESPONSE:",
      detailResult
    );
  }
}

      toast.success(
        "Daily Stock Entry updated successfully!"
      );

      setOpenForm(false);
      resetForm();

      // Refresh Header list
      await fetchDailyStockHeader(headerId);

      return;
    }

    // ============================================
    // NEW ENTRY
    // ============================================

    const headerData = new URLSearchParams();

    headerData.append(
      "EntryDate",
      entryDate
    );

    headerData.append(
      "ShopId",
      String(selectedShop?.Id || "")
    );

    headerData.append(
      "OfficeId",
      ""
    );

    headerData.append(
      "TotalAmount",
      String(Number(total || 0))
    );

    headerData.append(
      "CreatedBy",
      "1"
    );

    const headerRequestOptions = {
      method: "POST",
      body: headerData,
      redirect: "follow",
    };

    const headerResponse = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
      headerRequestOptions
    );

    if (!headerResponse.ok) {
      throw new Error(
        `Daily Stock Header API failed: ${headerResponse.status}`
      );
    }

    const headerResult =
      await headerResponse.json();

    console.log(
      "DAILY STOCK HEADER POST RESPONSE:",
      headerResult
    );

    const headerId =
      headerResult?.Id ||
      headerResult?.id ||
      headerResult?.insert_id ||
      headerResult?.DailyStockHeaderId ||
      headerResult?.data?.Id ||
      headerResult?.data?.id;

    if (!headerId) {
      throw new Error(
        "Daily Stock Header ID was not returned from API"
      );
    }

    console.log(
      "CREATED DAILY STOCK HEADER ID:",
      headerId
    );

    // --------------------------------------------
    // POST DETAILS
    // --------------------------------------------
    for (const row of rows) {
      const detailData = new URLSearchParams();

      detailData.append(
        "DailyStockHeaderId",
        String(headerId)
      );

      detailData.append(
        "ProductId",
        String(row.ProductId || "")
      );

      detailData.append(
        "Quantity",
        String(Number(row.Quantity || 0))
      );

      detailData.append(
        "Rate",
        String(Number(row.Rate || 0))
      );

      detailData.append(
        "Amount",
        String(Number(row.Amount || 0))
      );

      detailData.append(
        "CreatedBy",
        "1"
      );

      const detailRequestOptions = {
        method: "POST",
        body: detailData,
        redirect: "follow",
      };

      const detailResponse = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
        detailRequestOptions
      );

      if (!detailResponse.ok) {
        throw new Error(
          `Daily Stock Detail API failed: ${detailResponse.status}`
        );
      }

      const detailResult =
        await detailResponse.json();

      console.log(
        "DAILY STOCK DETAIL POST RESPONSE:",
        detailResult
      );
    }

    toast.success(
      "Daily Stock Entry at Main Office saved successfully!"
    );

    setOpenForm(false);
    resetForm();

    // Refresh Header list
    await fetchDailyStockHeader(headerId);

  } catch (error) {
    console.error(
      "Main Office Daily Stock Save Error:",
      error
    );

    toast.error(
      error?.message ||
        "Unable to save Daily Stock Entry"
    );
  } finally {
    setSaving(false);
  }
};

  // ==========================================================
  // DELETE MAIN ENTRY
  // ==========================================================


  const handleEditEntry = async (entry) => {
  try {
    setEditingEntry(entry);

    setOpenForm(true);

    const headerId =
      entry?.Id ||
      entry?.id;

    if (!headerId) {
      toast.error("Daily Stock Header ID not found");
      return;
    }

    const detailData = await fetchDailyStockDetail(headerId);

    console.log(
      "EDIT DAILY STOCK HEADER:",
      entry
    );

    console.log(
      "EDIT DAILY STOCK DETAIL:",
      detailData
    );

    // Header data
    setDate(
      entry?.EntryDate
        ? new Date(entry.EntryDate)
        : entry?.date
        ? new Date(entry.date)
        : new Date()
    );

    const shopId =
      entry?.ShopId ||
      entry?.shopId;

    const shop =
      shopOptions.find(
        (item) =>
          String(item?.Id) === String(shopId)
      ) || null;

    setSelectedShop(shop);

// Detail data → rows
const detailRows = detailData.map((item) => ({
  Id: item?.Id,
  ProductId: item?.ProductId,

  ProductCode:
    item?.ProductCode ||
    item?.Code ||
    "",

  ProductName:
    item?.ProductName ||
    item?.Name ||
    "",

  Quantity: Number(item?.Quantity || 0),
  Rate: Number(item?.Rate || 0),
  Amount: Number(item?.Amount || 0),
}));
    setRows(detailRows);
  } catch (error) {
    console.error(
      "Edit Daily Stock Entry Error:",
      error
    );

    toast.error(
      "Unable to load Daily Stock Entry"
    );
  }
};

  const handleDeleteEntry = (id) => {
    setStockEntries((previousEntries) =>
      previousEntries.filter((item) => item.id !== id),
    );

    toast.success("Entry removed successfully");
  };

  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

const totalPages =
  mappedStockEntries.length === 0
    ? 0
    : Math.ceil(mappedStockEntries.length / pageSize);

const paginatedStockEntries = useMemo(() => {
  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return mappedStockEntries.slice(startIndex, endIndex);
}, [mappedStockEntries, pageNo]);

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = useMemo(
    () => [
      // ====================================================
      // SR NO
      // ====================================================

      {
        accessorKey: "srNo",

        header: "Sr.No",

        size: 80,

        Cell: ({ row }) => {
          const index = mappedStockEntries.findIndex(
  (item) => item.id === row.original.id
);

          return index + 1;
        },
      },

      // ====================================================
      // DATE
      // ====================================================

      {
        accessorKey: "dateText",

        header: "Date",

        size: 150,

        Cell: ({ cell }) => cell.getValue(),
      },

      // ====================================================
      // MAIN OFFICE
      // ====================================================

      {
        accessorKey: "shop",

        header: "Main Office",

        size: 250,
      },

      // ====================================================
      // TOTAL
      // ====================================================

      {
        accessorKey: "total",

        header: "Total",

        size: 150,

        Cell: ({ cell }) => (
          <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
        ),
      },

      // ====================================================
      // ACTIONS
      // ====================================================

      {
        header: "Actions",

        size: 150,

        enableSorting: false,

        enableColumnFilter: false,

       Cell: ({ row }) => (
  <Box display="flex" justifyContent="center">
    <Tooltip title="Edit">
      <IconButton
        size="small"
        onClick={() => handleEditEntry(row.original)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    <Tooltip title="Delete">
      <IconButton
        color="error"
        size="small"
        onClick={() => handleDeleteEntry(row.original.id)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
),
      },
    ],
    [mappedStockEntries, handleEditEntry, handleDeleteEntry]
  );

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          p: 5,
          boxSizing: "border-box",

          "@media (max-width: 768px)": {
            p: 2,
          },
        }}
      >
        {/* ====================================================
            PAGE TITLE
        ==================================================== */}

        <Box textAlign="center" mb={5}>
          <Typography color="var(--complementary-color)" variant="h4">
            <b>Daily Stock Entry </b>
          </Typography>
        </Box>

        {/* ====================================================
            TABLE SECTION
        ==================================================== */}

        <Box
          sx={{
            width: "100%",
          }}
        >
          {/* ==================================================
              CREATE BUTTON
          ================================================== */}

          <Box
            sx={{
              display: "flex",
              gap: 3,
            }}
          >
            <Button
              sx={{
                background: "var(--complementary-color)",

                "&:hover": {
                  background: "var(--complementary-color)",
                },

                borderRadius: "5px 5px 0 0",

                textTransform: "uppercase",

                fontSize: "16px",

                fontWeight: 500,

                px: 2.5,

                py: 1.5,
              }}
              variant="contained"
              onClick={handleOpenForm}
            >
              CREATE DAILY STOCK ENTRY 
            </Button>
          </Box>

          {/* ==================================================
              MATERIAL REACT TABLE
          ================================================== */}

          <MaterialReactTable
  columns={columns}
  data={paginatedStockEntries}
  enablePagination={false}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#E9ECEF",

                color: "black",

                fontSize: "16px",

                fontWeight: "bold",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                fontSize: "15px",
              },
            }}
            muiTablePaperProps={{
              elevation: 2,

              sx: {
                borderRadius: "0 4px 4px 4px",

                overflow: "hidden",

                boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
              },
            }}
            muiTableContainerProps={{
              sx: {
                maxHeight: "none",
              },
            }}
            renderBottomToolbarCustomActions={() => (
              <Box
                mt={2}
                mb={1}
                alignItems="center"
                display="flex"
                justifyContent="flex-end"
                width="100%"
                pr={2}
                gap={0.5}
              >
                {/* FIRST PAGE */}

                <FirstPageIcon
                  sx={{
                    cursor: totalPages > 0 ? "pointer" : "default",

                    color: totalPages > 0 ? "inherit" : "#ccc",
                  }}
                  onClick={() => {
                    if (totalPages > 0) {
                      setPageNo(1);
                    }
                  }}
                />

                {/* PREVIOUS */}

                <KeyboardArrowLeftIcon
                  sx={{
                    cursor: pageNo > 1 ? "pointer" : "default",

                    color: pageNo > 1 ? "inherit" : "#ccc",
                  }}
                  onClick={() => {
                    setPageNo((prev) => Math.max(Number(prev) - 1, 1));
                  }}
                />

                {/* PAGE NO */}

                <Box ml={1}>Page No</Box>

                <TextField
                  sx={{
                    width: "65px",

                    ml: 1,

                    "& .MuiInputBase-input": {
                      textAlign: "center",

                      padding: "8px 5px",
                    },

                    "@media (max-width: 768px)": {
                      width: "60px",
                    },
                  }}
                  value={pageNo}
                  onChange={(e) => {
                    let value = Number(e.target.value);

                    if (value < 1 || isNaN(value)) {
                      value = 1;
                    }

                    if (totalPages > 0 && value > totalPages) {
                      value = totalPages;
                    }

                    setPageNo(value);
                  }}
                  size="small"
                />

                {/* NEXT */}

                <KeyboardArrowRightIcon
                  sx={{
                    cursor: pageNo < totalPages ? "pointer" : "default",

                    color: pageNo < totalPages ? "inherit" : "#ccc",
                  }}
                  onClick={() => {
                    if (pageNo < totalPages) {
                      setPageNo((prev) => Number(prev) + 1);
                    }
                  }}
                />

                {/* LAST PAGE */}

                <LastPageIcon
                  sx={{
                    cursor: totalPages > 0 ? "pointer" : "default",

                    color: totalPages > 0 ? "inherit" : "#ccc",
                  }}
                  onClick={() => {
                    if (totalPages > 0) {
                      setPageNo(totalPages);
                    }
                  }}
                />

                {/* TOTAL PAGES */}

                <Box ml={1}>Total Pages: {totalPages}</Box>
              </Box>
            )}
          />
        </Box>

        {/* ====================================================
            MAIN OFFICE DAILY STOCK FORM
        ==================================================== */}

        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: "6px",

              maxHeight: "90vh",
            },
          }}
        >
          {/* ==================================================
              DIALOG HEADER
          ================================================== */}

          <DialogTitle
            sx={{
              backgroundColor: "rgb(236, 253, 230)",

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              borderBottom: "1px solid #ddd",

              py: 1.2,

              px: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,

                color: "#0B5E20",

                fontSize: "18px",
              }}
            >
              Daily Stock Entry 
            </Typography>

            <IconButton
              onClick={handleCloseForm}
              disabled={saving}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {/* ==================================================
              DIALOG CONTENT
          ================================================== */}

          <DialogContent
            dividers
            sx={{
              backgroundColor: "#fff",

              p: {
                xs: 1.5,
                sm: 2,
              },
            }}
          >
            {/* =================================================
                MAIN OFFICE + DATE
            ================================================= */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",

                  sm: "1fr 1fr",
                },

                gap: 2,

                mt: 0.5,

                mb: 2,
              }}
            >
              {/* MAIN OFFICE */}

              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Stock Entry:
                </Typography>

<Autocomplete
  options={productOptions}
  loading={loadingProducts}
  value={selectedProduct}
  onChange={handleProductChange}
  getOptionLabel={(option) =>
    option ? `${option.productCode} - ${option.label}` : ""
  }
  isOptionEqualToValue={(option, value) =>
    String(option?.value) === String(value?.value)
  }
  renderInput={(params) => (
    <TextField
      {...params}
      size="small"
      placeholder="Select Product"
      fullWidth
    />
  )}
/>
              </Box>

              {/* DATE */}

              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Date:
                </Typography>

                <DatePicker
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  format="dd-MM-yyyy"
                  slotProps={{
                    textField: {
                      size: "small",

                      fullWidth: true,
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider
              sx={{
                mb: 2,
              }}
            />

            {/* =================================================
                PRODUCT
            ================================================= */}

            <Box
              sx={{
                mb: 2,
              }}
            >
              <Typography fontWeight={600} mb={0.5} fontSize="14px">
                Product:
              </Typography>

              <Autocomplete
                options={productOptions}
                loading={loadingProducts}
                value={selectedProduct}
                onChange={handleProductChange}
                getOptionLabel={(option) =>
                  option ? `${option.productCode} - ${option.label}` : ""
                }
                isOptionEqualToValue={(option, value) =>
                  String(option?.value) === String(value?.value)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select Product"
                    fullWidth
                  />
                )}
              />
            </Box>

            {/* =================================================
                QUANTITY + RATE + ADD
            ================================================= */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",

                  sm: "1fr 1fr auto",
                },

                gap: 1.5,

                alignItems: "end",

                mb: 2,
              }}
            >
              {/* QUANTITY */}

              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Quantity:
                </Typography>

                <TextField
                  type="number"
                  size="small"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter Quantity"
                  fullWidth
                />
              </Box>

              {/* RATE */}

              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Rate:
                </Typography>

                <TextField
                  type="number"
                  size="small"
                  value={rate}
                  placeholder="Rate"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>

              {/* ADD */}

              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddProduct}
                sx={{
                  height: "40px",

                  px: 2.5,

                  textTransform: "none",

                  background: "var(--complementary-color)",

                  "&:hover": {
                    background: "var(--complementary-color)",
                  },
                }}
              >
                Add
              </Button>
            </Box>

            <Divider
              sx={{
                mb: 1.5,
              }}
            />

            {/* =================================================
                PRODUCT DETAIL TABLE
            ================================================= */}

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #d0d0d0",

                overflowX: "auto",
              }}
            >
              <Table
                size="small"
                sx={{
                  minWidth: 600,

                  "& .MuiTableCell-root": {
                    border: "1px solid #d0d0d0",

                    py: 0.8,

                    px: 1,

                    fontSize: "13px",
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#e9ecef",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Product Code
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Name
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Quantity
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Rate
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Amount
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{
                          height: "75px",

                          color: "#777",

                          fontStyle: "italic",
                        }}
                      >
                        No products added
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, index) => (
                      <TableRow hover key={`${row.ProductId}-${index}`}>
                        <TableCell>{row.ProductCode}</TableCell>

                        <TableCell>{row.ProductName}</TableCell>

                        <TableCell align="center">{row.Quantity}</TableCell>

                        <TableCell align="right">
                          ₹ {Number(row.Rate).toFixed(2)}
                        </TableCell>

                        <TableCell align="right">
                          ₹ {Number(row.Amount).toFixed(2)}
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteRow(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* =================================================
                TOTAL
            ================================================= */}

            <Box
              sx={{
                display: "flex",

                justifyContent: "flex-end",

                alignItems: "center",

                gap: 1,

                mt: 1.5,
              }}
            >
              <Typography fontWeight={600} fontSize="14px">
                Total:
              </Typography>

              <TextField
                size="small"
                value={Number(total).toFixed(2)}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  width: 140,
                }}
              />
            </Box>
          </DialogContent>

          {/* ==================================================
              DIALOG ACTIONS
          ================================================== */}

          <DialogActions
            sx={{
              justifyContent: "flex-start",

              px: 2,

              py: 1.2,

              gap: 1,
            }}
          >
            <Button
              variant="contained"
              disabled={saving}
              onClick={handleSave}
              sx={{
                textTransform: "none",

                background: "var(--primary-color)",

                "&:hover": {
                  background: "var(--primary-color)",
                },
              }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button
              variant="outlined"
              disabled={saving}
              onClick={handleCloseForm}
              sx={{
                textTransform: "none",

                color: "var(--complementary-color)",

                borderColor: "var(--complementary-color)",

                "&:hover": {
                  borderColor: "var(--complementary-color)",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default DailyStockEntryAtMainOffice;
