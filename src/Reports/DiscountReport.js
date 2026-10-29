
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";


import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_TablePagination,
} from "material-react-table";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import logonew from "../imgs/logo_white.png";

const API_URL =
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDiscountReport.php";

const toApiDate = (date) => {
  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const displayDate = (value) => {
  if (!value) return "-";

  const text = String(value);

  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  return text;
};

const numberValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const parsed = Number(String(value).replace(/,/g, "").trim());

  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) =>
  numberValue(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getValue = (row, keys) => {
  for (const key of keys) {
    if (
      row &&
      row[key] !== undefined &&
      row[key] !== null &&
      row[key] !== ""
    ) {
      return row[key];
    }
  }

  return null;
};

const extractRows = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.result)) {
    return response.result;
  }

  if (Array.isArray(response?.records)) {
    return response.records;
  }

  if (Array.isArray(response?.Data)) {
    return response.Data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return null;
};

const formatBillTime = (value) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const text = String(value);

  // Preserve the time returned by the API.
  const timeMatch = text.match(
    /(?:T|\s)(\d{2}:\d{2}(?::\d{2})?)/ 
  );

  if (timeMatch) {
    return timeMatch[1];
  }

  // Handle time-only values such as 10:35:42.
  if (/^\d{2}:\d{2}(?::\d{2})?$/.test(text)) {
    return text;
  }

  return text;
};


const normalizeDiscountRow = (item, index) => {
  const discountValue = getValue(item, [
    "DiscountAmount",
    "DiscountAmt",
    "TotalDiscount",
    "Discount",
    "discount_amount",
    "discount",
  ]);

  const customerValue = getValue(item, [
    "PartyName",
    "AccountName",
    "CustomerName",
    "Party_Name",
    "party_name",
    "customer_name",
  ]);

  const userValue = getValue(item, [
    "UserId",
    "UserID",
    "CreatedBy",
    "CreatedByUserId",
    "User_Id",
    "user_id",
  ]);

  const billTimeValue = getValue(item, [
    "BillTime",
    "InvoiceTime",
    "CreatedTime",
    "Time",
    "BillDateTime",
    "CreatedDate",
    "InvoiceDate",
    "bill_time",
  ]);

  // Get the actual invoice ID separately
  const invoiceIdValue = getValue(item, [
    "InvoiceId",
    "InvoiceID",
    "invoice_id",
  ]);

  // Get the invoice number separately
  const invoiceNoValue = getValue(item, [
    "InvoiceNo",
    "BillNo",
    "InvoiceNumber",
    "invoice_no",
    "bill_no",
  ]);

  return {
    id: `${invoiceIdValue ?? invoiceNoValue ?? `discount-${index}`}-${index}`,

    invoiceNo:
      invoiceNoValue === null
        ? null
        : String(invoiceNoValue),

    invoiceId:
      invoiceIdValue === null
        ? null
        : String(invoiceIdValue),

    srNo: index + 1,

    billTime: formatBillTime(billTimeValue),

    customerName:
      customerValue === null
        ? "N/A"
        : String(customerValue),

    userId:
      userValue === null
        ? null
        : String(userValue),

    userName: getUserDisplayName(userValue),

    discountAmount:
      discountValue === null
        ? null
        : numberValue(discountValue),
  };
};







const getUserDisplayName = (userId) => {
  const userMap = {
    1: "Admin",
    2: "Sale",
    3: "Sales2",
  };

  if (
    userId === null ||
    userId === undefined ||
    String(userId).trim() === ""
  ) {
    return "Unknown";
  }

  const id = Number(userId);

  return userMap[id] || `Unknown (${userId})`;
};

const DiscountReport = () => {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const [reportData, setReportData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);



  // Original invoice preview
const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
const [invoiceLoading, setInvoiceLoading] = useState(false);
const [viewedInvoice, setViewedInvoice] = useState(null);
const [viewedInvoiceDetails, setViewedInvoiceDetails] = useState([]);
const [viewedCustomer, setViewedCustomer] = useState(null);

  const [error, setError] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showMessage = (message, severity = "error") => {
    setError(message);
    setAlertSeverity(severity);
    setSnackbarOpen(true);
  };

  const hasDiscount = useMemo(
    () => reportData.some((row) => row.discountAmount !== null),
    [reportData]
  );

  const totalDiscount = useMemo(
    () =>
      reportData.reduce(
        (sum, row) =>
          sum +
          (row.discountAmount === null ? 0 : row.discountAmount),
        0
      ),
    [reportData]
  );

  const handleGetReport = async () => {
    if (!fromDate || !toDate) {
      showMessage("Please select both From Date and To Date.");
      return;
    }

    const from = toApiDate(fromDate);
    const to = toApiDate(toDate);

    if (!from || !to) {
      showMessage("Please select valid dates.");
      return;
    }

    if (from > to) {
      showMessage("From Date cannot be later than To Date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        fromdate: from,
        todate: to,
      });

      const url = `${API_URL}?${params.toString()}`;

      console.log("Discount Report API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const responseText = await response.text();

      console.log("Discount Report Raw Response:", responseText);

      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status}`
        );
      }

      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The API did not return valid JSON. Check the backend response."
        );
      }

      console.log("Discount Report JSON:", responseData);

      const rows = extractRows(responseData);

      if (rows === null) {
        throw new Error(
          "Unexpected API response structure. Check the JSON array and field names."
        );
      }

      const formattedRows = rows.map(normalizeDiscountRow);

      setReportData(formattedRows);
      setPreviewOpen(true);

      if (formattedRows.length === 0) {
        showMessage(
          "No discount records found for the selected dates.",
          "info"
        );
      }
    } catch (err) {
      console.error("Discount Report API Error:", err);

      showMessage(
        err.message ||
          "Unable to load the report. Check the API and CORS settings."
      );
    } finally {
      setLoading(false);
    }
  };


const columns = useMemo(
  () => [
    {
      accessorKey: "srNo",
      header: "Sr No",
      size: 80,
    },
    {
      accessorKey: "billTime",
      header: "Bill Time",
      size: 160,
    },
    {
      accessorKey: "customerName",
      header: "Party Name",
      size: 260,
    },
    {
      accessorKey: "userName",
      header: "Discount Given By",
      size: 190,
      Cell: ({ row }) => {
        const userName = row.original.userName;

        const colors = {
          Admin: {
            bg: "#EDE7F6",
            color: "#4527A0",
          },
          Sale: {
            bg: "#E3F2FD",
            color: "#1565C0",
          },
          Sales2: {
            bg: "#E8F5E9",
            color: "#2E7D32",
          },
        };

        const style = colors[userName] || {
          bg: "#FBE9E7",
          color: "#BF360C",
        };

        return (
          <Chip
            label={userName}
            size="medium"
            sx={{
              backgroundColor: style.bg,
              color: style.color,
              fontWeight: 700,
              minWidth: 100,
              borderRadius: "8px",
            }}
          />
        );
      },
    },
    {
      accessorKey: "discountAmount",
      header: "Discount Amount",
      size: 180,
      Cell: ({ cell }) => {
        const value = cell.getValue();

        return value === null ? "N/A" : money(value);
      },
    },
    {
      id: "actions",
      header: "Action",
      size: 120,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const bill = row.original;

        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleViewBill(bill)}
            disabled={!bill.invoiceId && !bill.invoiceNo}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              minWidth: 80,
            }}
          >
            View
          </Button>
        );
      },
    },
  ],
  []
);







const handleViewBill = async (bill) => {
  const invoiceId = bill?.invoiceId;

  if (
    invoiceId === null ||
    invoiceId === undefined ||
    String(invoiceId).trim() === ""
  ) {
    showMessage(
      "Invoice ID is missing. Please check the Discount Report API.",
      "warning"
    );
    return;
  }

  const baseUrl =
    "https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php";

  // Normalize different API response formats.
  const getRows = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    if (Array.isArray(data?.records)) return data.records;
    if (data?.data && typeof data.data === "object") {
      return [data.data];
    }
    return data && typeof data === "object" ? [data] : [];
  };

  const fetchRows = async (table, column, value) => {
    const params = new URLSearchParams({
      Table: table,
      Colname: column,
      Colvalue: String(value),
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `${table} fetch failed. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return getRows(data);
  };

  setInvoiceLoading(true);
  setViewedInvoice(null);
  setViewedInvoiceDetails([]);
  setViewedCustomer(null);
  setInvoicePreviewOpen(true);

  try {
    // 1. Fetch the original invoice header.
    const headerRows = await fetchRows(
      "invoiceheader",
      "Id",
      invoiceId
    );

    const invoice = headerRows.find(
      (item) =>
        String(item?.Id ?? item?.InvoiceId ?? item?.InvoiceID) ===
        String(invoiceId)
    );

    if (!invoice) {
      throw new Error(
        `Invoice ${invoiceId} was not found in invoiceheader.`
      );
    }

    // 2. Fetch all products belonging to this invoice.
  
const detailRows = await fetchRows(
  "invoicedetail",
  "InvoiceId",
  invoiceId
);

// Fetch Product Master records
const productMasterUrl =
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster";

const productResponse = await fetch(productMasterUrl, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
});

if (!productResponse.ok) {
  throw new Error(
    `Product Master fetch failed: ${productResponse.status}`
  );
}

const productResult = await productResponse.json();
const productRows = getRows(productResult);

console.log("Product Master Records:", productRows);

// Create a map of Product ID to Product Name
const productMap = new Map();

productRows.forEach((product) => {
  const productId =
    product.Id ??
    product.ProductId ??
    product.ID ??
    product.ProductID;

  const productName =
    product.ProductName ??
    product.productName ??
    product.Name;

  if (
    productId !== null &&
    productId !== undefined &&
    productName
  ) {
    productMap.set(
      String(productId).trim(),
      String(productName).trim()
    );
  }
});

// Add ProductName to every invoice detail row
const enrichedDetailRows = detailRows.map((detail) => {
  const productId =
    detail.ProductId ??
    detail.ProductID ??
    detail.product_id;

  const matchedProductName =
    productId !== null && productId !== undefined
      ? productMap.get(String(productId).trim())
      : null;

  return {
    ...detail,
    ProductName:
      detail.ProductName ??
      detail.productName ??
      detail.Product ??
      matchedProductName ??
      `Product ID: ${productId ?? "N/A"}`,
  };
});

console.log(
  "Invoice Details with Product Names:",
  enrichedDetailRows
);

    // 3. Fetch customer information, if this is an account customer.
    const accountId =
      invoice.AccountId ?? invoice.AccountID ?? 0;

    let customer = null;

    if (Number(accountId) !== 0) {
      try {
        const accountRows = await fetchRows(
          "Account",
          "Id",
          accountId
        );

        customer = accountRows[0] || null;
      } catch (customerError) {
        console.warn(
          "Unable to fetch account details:",
          customerError
        );
      }
    }

    // 4. Display the fetched original invoice.
   setViewedInvoice(invoice);
setViewedInvoiceDetails(enrichedDetailRows);
setViewedCustomer(customer);

    console.log("Original Invoice:", invoice);
    console.log("Received Amount fields:", {
  ReceivedAmount: invoice.ReceivedAmount,
  Received: invoice.Received,
  CashAmount: invoice.CashAmount,
  OnlineAmount: invoice.OnlineAmount,
  PaymentMode: invoice.PaymentMode,
  FullInvoice: invoice,
});
    console.log("Original Invoice Details:", detailRows);
    console.log("Original Customer:", customer);
  } catch (error) {
    console.error("View Original Invoice Error:", error);

    setInvoicePreviewOpen(false);

    showMessage(
      error.message || "Unable to load the original invoice.",
      "error"
    );
  } finally {
    setInvoiceLoading(false);
  }
};






const table = useMaterialReactTable({
  columns,
  data: reportData,
  getRowId: (row) => row.id,

  // Table layout
  layoutMode: "grid",
  enableColumnResizing: true,
  enableGlobalFilter: true,
  enablePagination: true,
  enableStickyHeader: true,

  // Initial table settings
  initialState: {
    density: "comfortable",
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },

  // Table container styling
  muiTablePaperProps: {
    elevation: 2,
    sx: {
      width: "100%",
      maxWidth: "100%",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid #E0E0E0",
    },
  },

  muiTableContainerProps: {
    sx: {
      width: "100%",
      maxWidth: "100%",
      maxHeight: "calc(92vh - 280px)",
      overflowX: "auto",
      overflowY: "auto",
    },
  },

  muiTableProps: {
    sx: {
      width: "100%",
      tableLayout: "auto",
    },
  },

  // Attractive column headers
  muiTableHeadCellProps: {
    sx: {
      backgroundColor: "#E9ECEF",
      color: "#17324D",
      fontWeight: 700,
      fontSize: "14px",
      padding: "14px 16px",
      borderRight: "1px solid #D5D9DD",
      whiteSpace: "normal",
    },
  },

  // Alternate row colors and hover effect
  muiTableBodyRowProps: {
    sx: {
      "&:nth-of-type(even)": {
        backgroundColor: "#F8FAFC",
      },
      "&:hover": {
        backgroundColor: "#EAF3F0 !important",
      },
      transition: "background-color 0.2s ease",
    },
  },

  // Table cell styling
  muiTableBodyCellProps: {
    sx: {
      fontSize: "14px",
      color: "#333333",
      padding: "12px 16px",
      borderBottom: "1px solid #E0E0E0",
      whiteSpace: "nowrap",
    },
  },

  // Search and toolbar styling
  muiTopToolbarProps: {
    sx: {
      backgroundColor: "#FFFFFF",
      minHeight: "56px",
      px: 1,
    },
  },

  // Pagination and total discount footer
  renderBottomToolbar: ({ table: currentTable }) => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      px={2}
      py={1}
      sx={{
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
      }}
    >
      <MRT_TablePagination table={currentTable} />

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        flexWrap="wrap"
        py={1}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "15px",
            color: "#17324D",
          }}
        >
          Total Discount:
        </Typography>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "16px",
            color: "#087443",
          }}
        >
          {hasDiscount ? `₹${money(totalDiscount)}` : "N/A"}
        </Typography>
      </Box>
    </Box>
  ),
});








  const exportRows = () =>
  reportData.map((row) => [
    row.srNo,
    row.billTime,
    row.customerName,
    row.userName,
    row.discountAmount === null ? "N/A" : row.discountAmount,
  ]);

  const reportHeaders = [
  "Sr No",
  "Bill Time",
  "Party Name",
  "Discount Given By",
  "Discount Amount",
];

  const generatePDF = () => {
    if (!reportData.length) {
      showMessage("No data available to print.");
      return;
    }

    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setLineWidth(0.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    if (logonew) {
      try {
        doc.addImage(
          logonew,
          "PNG",
          pageWidth / 2 - 10,
          9,
          20,
          20
        );
      } catch (err) {
        console.warn("Unable to add logo to PDF:", err);
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);

    doc.text(
      "AMRUT MILK PRODUCTS 2",
      pageWidth / 2,
      35,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER, KOLHAPUR",
      pageWidth / 2,
      42,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
      "Discount Report",
      pageWidth / 2,
      51,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      `Period: ${displayDate(toApiDate(fromDate))} to ${displayDate(
        toApiDate(toDate)
      )}`,
      pageWidth / 2,
      58,
      { align: "center" }
    );

    const body = exportRows().map((row) =>
      row.map((value) =>
        typeof value === "number" ? money(value) : String(value ?? "N/A")
      )
    );

    body.push([
      "",
      "",
      "",
      "TOTAL",
      hasDiscount ? money(totalDiscount) : "N/A",
    ]);

    autoTable(doc, {
      head: [reportHeaders],
      body,
      startY: 64,
      margin: {
        left: 9,
        right: 9,
        bottom: 12,
      },
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [20, 83, 65],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 248, 246],
      },
      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.row.index === body.length - 1
        ) {
          data.cell.styles.fillColor = [225, 235, 230];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    doc.save(
      `Discount_Report_${toApiDate(fromDate)}_to_${toApiDate(toDate)}.pdf`
    );
  };

  const exportToExcel = async () => {
    if (!reportData.length) {
      showMessage("No data available to export.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Discount Report");

      worksheet.addRow([
        "AMRUT MILK PRODUCTS 2",
      ]);

      worksheet.addRow([
        `Discount Report: ${displayDate(toApiDate(fromDate))} to ${displayDate(
          toApiDate(toDate)
        )}`,
      ]);

      worksheet.addRow([]);
      worksheet.addRow(reportHeaders);

      const headerRow = worksheet.getRow(4);

      headerRow.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF145341" },
      };

      headerRow.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      exportRows().forEach((row) => {
        worksheet.addRow(row);
      });

      const totalRow = worksheet.addRow([
        "",
        "",
        "",
        "TOTAL",
        hasDiscount ? totalDiscount : "N/A",
      ]);

      totalRow.font = { bold: true };

      totalRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE1EBE6" },
        };
      });

      worksheet.columns = [
        { width: 12 },
        { width: 20 },
        { width: 32 },
        { width: 16 },
        { width: 22 },
      ];

      worksheet.views = [
        { state: "frozen", ySplit: 4 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        blob,
        `Discount_Report_${toApiDate(fromDate)}_to_${toApiDate(toDate)}.xlsx`
      );
    } catch (err) {
      console.error("Excel Export Error:", err);
      showMessage("Unable to export Excel file.");
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          sx={{
            color: "var(--complementary-color, #E96B2C)",
            fontWeight: 700,
          }}
        >
          Discount Report
        </Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
        >
          <Box flex={1} minWidth={250}>
            <Typography mb={0.5}>From Date</Typography>

            <DatePicker
              value={fromDate}
              format="dd-MM-yyyy"
              onChange={setFromDate}
              maxDate={toDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Box>

          <Box flex={1} minWidth={250}>
            <Typography mb={0.5}>To Date</Typography>

            <DatePicker
              value={toDate}
              format="dd-MM-yyyy"
              onChange={setToDate}
              minDate={fromDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Box>
        </Box>
      </LocalizationProvider>

      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <Button
          variant="contained"
          onClick={handleGetReport}
          disabled={loading}
          sx={{
            backgroundColor: "var(--primary-color, #075536)",
            px: 3,
            py: 1.2,
            "&:hover": {
              backgroundColor: "#06442C",
            },
          }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={20}
                color="inherit"
                sx={{ mr: 1 }}
              />
              Loading Report...
            </>
          ) : (
            "Get Discount Report"
          )}
        </Button>
      </Box>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: "92vh" },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 2 }}>
          <Typography
            variant="h4"
            fontWeight={900}
            color="#171717"
          >
            AMRUT MILK PRODUCTS 2
          </Typography>

          <Typography sx={{ mt: 1, color: "#606060" }}>
            E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER, KOLHAPUR
          </Typography>

          <Typography sx={{ mt: 1, fontWeight: 700 }}>
            Discount Report Preview for{" "}
            {displayDate(toApiDate(fromDate))} to{" "}
            {displayDate(toApiDate(toDate))}
          </Typography>
        </DialogTitle>

       
<DialogContent
  dividers
  sx={{
    p: 0,
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
  }}
>
  <Box
    sx={{
      p: { xs: 1, md: 2 },
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      flex: 1,
      minHeight: 0,
    }}
  >
    {reportData.some(
      (row) =>
        row.discountAmount === null ||
        row.billTime === "N/A" ||
        row.userId === null
    ) && (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Some fields are missing from the API response. Check the
        returned JSON field names and confirm that the backend
        provides BillTime, UserId, and DiscountAmount.
      </Alert>
    )}

    {reportData.length > 0 ? (
      <MaterialReactTable table={table} />
    ) : (
      <Box
        sx={{
          width: "100%",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          No records found for the selected date range.
        </Typography>
      </Box>
    )}
  </Box>
</DialogContent>


        <DialogActions
          sx={{
            borderTop: "2px solid #ddd",
            p: 2,
            justifyContent: "flex-start",
          }}
        >
          <Button
            onClick={generatePDF}
            color="primary"
            aria-label="Print PDF"
          >
            <PrintIcon sx={{ fontSize: 35 }} />
          </Button>

          <Button
            variant="contained"
            endIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
          >
            Excel Data
          </Button>

          <Button
            variant="contained"
            onClick={() => setPreviewOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>


 
<Dialog
  open={invoicePreviewOpen}
  onClose={() => setInvoicePreviewOpen(false)}
  fullWidth
  maxWidth="lg"
>
  <DialogTitle
    sx={{
      backgroundColor: "#E8F5E9",
      color: "#075536",
      fontWeight: 800,
    }}
  >
    Original Invoice — View Only
  </DialogTitle>

  <DialogContent dividers>
    {invoiceLoading ? (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    ) : viewedInvoice ? (
      <Box sx={{ py: 1 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Invoice Information
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Invoice No:</strong>{" "}
              {viewedInvoice.InvoiceNo ??
                viewedInvoice.BillNo ??
                viewedInvoice.Id ??
                "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Invoice Date:</strong>{" "}
              {displayDate(
                viewedInvoice.InvoiceDate?.date ??
                  viewedInvoice.InvoiceDate ??
                  "-"
              )}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Customer:</strong>{" "}
              {viewedCustomer?.AccountName ??
                viewedInvoice.CustomerName ??
                viewedInvoice.PartyName ??
                (Number(viewedInvoice.AccountId) === 0
                  ? "Regular Customer"
                  : "-")}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Contact:</strong>{" "}
              {viewedInvoice.ContactNo ??
                viewedInvoice.ContactNumber ??
                viewedCustomer?.ContactNo ??
                viewedCustomer?.MobileNo ??
                "-"}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Product Details
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F1F3F5" }}>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Rate</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {viewedInvoiceDetails.length > 0 ? (
                viewedInvoiceDetails.map((detail, index) => (
                  <TableRow key={detail.Id ?? index}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      {detail.ProductName ??
                        detail.productName ??
                        detail.Product ??
                        detail.ProductId ??
                        "-"}
                    </TableCell>

                    <TableCell align="right">
                      {detail.Quantity ?? detail.Qty ?? "-"}
                    </TableCell>

                    <TableCell align="right">
                      {money(
                        detail.Rate ??
                          detail.ProductRate ??
                          detail.Price ??
                          0
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {money(
                        detail.Amount ??
                          detail.Total ??
                          detail.NetAmount ??
                          0
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No invoice detail rows were returned by the API.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" fontWeight={700} mt={3} mb={1}>
          Payment Summary
        </Typography>

       

<Grid container spacing={2}>
  {[
    ["Subtotal", ["SubTotal", "Subtotal"]],
    ["Discount", ["Discount", "DiscountAmount"]],
    ["Transport", ["Transport", "TransportAmount"]],
    ["Total", ["Total", "GrandTotal"]],
    ["Balance Due", ["BalanceDue", "DueAmount", "PendingAmount"]],
  ].map(([label, keys]) => {
    const key = keys.find(
      (field) => viewedInvoice[field] != null
    );

    return (
      <Grid item xs={12} sm={6} md={4} key={label}>
        <Typography>
          <strong>{label}:</strong>{" "}
          {key != null
            ? `₹ ${money(viewedInvoice[key])}`
            : "-"}
        </Typography>
      </Grid>
    );
  })}

  <Grid item xs={12} sm={6} md={4}>
    <Typography>
      <strong>Payment Mode:</strong>{" "}
      {viewedInvoice.PaymentMode ?? "-"}
    </Typography>
  </Grid>
</Grid>


      </Box>
    ) : (
      <Typography>No invoice selected.</Typography>
    )}
  </DialogContent>

  <DialogActions>
    <Button
      variant="contained"
      onClick={() => setInvoicePreviewOpen(false)}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={alertSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscountReport;
