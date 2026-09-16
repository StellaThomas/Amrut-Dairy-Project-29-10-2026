

import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  Table,
  Autocomplete,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  MenuItem,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "react-phone-input-2/lib/style.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import qs from "qs";
import moment from "moment";
import { MaterialReactTable } from "material-react-table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Cookies from "js-cookie";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import PrintIcon from "@mui/icons-material/Print";

import amrutLogo from "../imgs/amrutlogo.png";
import fremilaLogo from "../imgs/fremilalogo.png";

// import logonew from '../imgs/logo_white.png'

 const SalesEntry = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState([]);
  const [rows, setRows] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

 const [searchText, setSearchText] = useState("");
const [categoryFilter, setCategoryFilter] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");


const filteredInvoiceData = useMemo(() => {
  const search = searchText.trim().toLowerCase();

  return invoiceheaders.filter((invoice) => {
    // ==============================
    // BILL NO
    // ==============================
    // ==============================
// BILL / INVOICE NO
// ==============================
const billNo = String(
  invoice?.InvoiceNo ||
  invoice?.InvoiceNumber ||
  invoice?.BillNo ||
  invoice?.BillNumber ||
  invoice?.Id ||
  ""
).toLowerCase();

    // ==============================
    // CUSTOMER NAME
    // ==============================
    const customerName = String(
      invoice?.accountDetails?.AccountName || ""
    ).toLowerCase();

    // ==============================
    // CATEGORY
    // ==============================
    const customerType = String(
      invoice?.accountDetails?.CustomerType || ""
    )
      .trim()
      .toUpperCase();

    let categoryName = "";

    if (customerType === "R") {
      categoryName = "retailer";
    } else if (customerType === "D") {
      categoryName = "dealer";
    } else if (customerType === "C") {
      categoryName = "caterers";
    }

    // ==============================
    // INVOICE DATE
    // ==============================
    const invoiceDate = invoice?.InvoiceDate?.date
      ? invoice.InvoiceDate.date.substring(0, 10)
      : "";

    // ==============================
    // CATEGORY FILTER
    // ==============================
    const categoryMatch =
      categoryFilter === "" ||
      customerType === categoryFilter;

    // ==============================
    // SEARCH FILTER
    // ==============================
    const searchMatch =
      search === "" ||
      billNo.includes(search) ||
      customerName.includes(search) ||
      categoryName.includes(search);

    // ==============================
    // FROM DATE FILTER
    // ==============================
    const fromDateMatch =
      fromDate === "" ||
      (invoiceDate !== "" && invoiceDate >= fromDate);

    // ==============================
    // TO DATE FILTER
    // ==============================
    const toDateMatch =
      toDate === "" ||
      (invoiceDate !== "" && invoiceDate <= toDate);

    // ==============================
    // ALL FILTERS MUST MATCH
    // ==============================
    return (
      categoryMatch &&
      searchMatch &&
      fromDateMatch &&
      toDateMatch
    );
  });
}, [
  invoiceheaders,
  searchText,
  categoryFilter,
  fromDate,
  toDate,
]);






  useEffect(() => {
    // fetchInvdetails();
  }, []);
 
  useEffect(() => {
    const handleSalesShortcut = (event) => {
      // --------------------------------------------------
      // Do not run shortcut while typing
      // --------------------------------------------------

      const tagName = event.target?.tagName?.toLowerCase();

      const isTyping =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        event.target?.isContentEditable;

      if (isTyping) {
        return;
      }

      // --------------------------------------------------
      // Drawer open असेल तर keyboard shortcut बंद
      // --------------------------------------------------

      if (isDrawerOpen) {
        return;
      }

      // --------------------------------------------------
      // Ignore Ctrl / Alt / Windows combinations
      // --------------------------------------------------

      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      // ==================================================
      // R = REGULAR SALES ENTRY
      // ==================================================

      if (event.key?.toLowerCase() === "r") {
        event.preventDefault();
        event.stopPropagation();

        console.log("R pressed - Opening Regular Sales Entry");

        setIsDrawerOpen(true);
        resetForm();
        setIsEditing(false);
        setOpen(false);

        return;
      }

      // ==================================================
      // D = SALES DEALER
      // ==================================================

      if (event.key?.toLowerCase() === "d") {
        event.preventDefault();
        event.stopPropagation();

        console.log("D pressed - Opening Dealer Bill Entry");

        navigate("/salesdealer", {
          state: {
            openCreateForm: true,
          },
        });

        return;
      }

      // ==================================================
      // C = SALES CATERERS
      // ==================================================

      if (event.key?.toLowerCase() === "c") {
        event.preventDefault();
        event.stopPropagation();

        console.log("C pressed - Opening Caterers Bill Entry");

        navigate("/salescaterers", {
          state: {
            openCreateForm: true,
          },
        });

        return;
      }
    };

    window.addEventListener("keydown", handleSalesShortcut, true);

    return () => {
      window.removeEventListener("keydown", handleSalesShortcut, true);
    };
  }, [navigate, isDrawerOpen]);

// get of Invoice header
// get of Invoice header


const fetchInvoiceHeader = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    // ==========================================
    // 1. GET FIRST PAGE TO KNOW TOTAL PAGES
    // ==========================================
    const firstResponse = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1",
      requestOptions
    );

    if (!firstResponse.ok) {
      throw new Error(
        `Invoice Header API failed with status ${firstResponse.status}`
      );
    }

    const firstResult = await firstResponse.json();

    const totalPages = Number(firstResult?.total_pages || 1);

    // ==========================================
    // 2. CREATE ALL PAGE NUMBERS
    // ==========================================
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

    // ==========================================
    // 3. FETCH ALL PAGES
    // ==========================================
    const pageResponses = await Promise.all(
      pageNumbers.map(async (page) => {
        const response = await fetch(
          `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(
            `Invoice Header API failed for page ${page}`
          );
        }

        return response.json();
      })
    );

    // ==========================================
    // 4. COMBINE ALL INVOICES
    // Backend already returns Id DESC
    // ==========================================
    const allInvoiceData = pageResponses.flatMap((result) =>
      Array.isArray(result?.data) ? result.data : []
    );

    console.log("TOTAL PAGES:", totalPages);
    console.log("TOTAL INVOICES:", allInvoiceData.length);

    // ==========================================
    // 5. FETCH ACCOUNT + ADDRESS DETAILS
    // ==========================================
    const InvoicesList = await Promise.all(
      allInvoiceData.map(async (invoice) => {
        try {
          // ==========================================
          // ACCOUNT DETAILS
          // ==========================================
          let accountDetails = null;

          if (
            invoice.AccountId &&
            Number(invoice.AccountId) !== 0
          ) {
            const acctResponse = await fetch(
              `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invoice.AccountId}`,
              requestOptions
            );

            if (!acctResponse.ok) {
              throw new Error(
                `Account API failed with status ${acctResponse.status}`
              );
            }

            const acctResult = await acctResponse.json();

            accountDetails =
              Array.isArray(acctResult)
                ? acctResult[0] || null
                : Array.isArray(acctResult?.data)
                ? acctResult.data[0] || null
                : acctResult?.data ||
                  acctResult ||
                  null;
          }

          // ==========================================
          // ADDRESS DETAILS
          // CustomerType is stored in Address
          // ==========================================
          let addressDetails = null;

          if (
            invoice.AccountId &&
            Number(invoice.AccountId) !== 0
          ) {
            const addressResponse = await fetch(
              `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${invoice.AccountId}`,
              requestOptions
            );

            if (!addressResponse.ok) {
              throw new Error(
                `Address API failed with status ${addressResponse.status}`
              );
            }

            const addressResult =
              await addressResponse.json();

            addressDetails =
              Array.isArray(addressResult)
                ? addressResult[0] || null
                : Array.isArray(addressResult?.data)
                ? addressResult.data[0] || null
                : addressResult?.data ||
                  addressResult ||
                  null;
          }

          // ==========================================
          // CUSTOMER TYPE
          // ==========================================
          const customerType = String(
            addressDetails?.CustomerType ||
              addressDetails?.customerType ||
              accountDetails?.CustomerType ||
              accountDetails?.customerType ||
              invoice?.CustomerType ||
              invoice?.customerType ||
              ""
          )
            .trim()
            .toUpperCase();

          console.log(
            "CATEGORY CHECK:",
            invoice.Id,
            "CustomerType:",
            customerType
          );

          console.log(
            "========== REMARK CHECK ==========",
            {
              InvoiceId: invoice?.Id,
              Remark: invoice?.Remark,
              remark: invoice?.remark,
              History: invoice?.History,
              history: invoice?.history,
            }
          );

          return {
            ...invoice,

            accountDetails: {
              ...(accountDetails || {}),
              CustomerType: customerType,
            },

            addressDetails: addressDetails,
          };
        } catch (error) {
          console.error(
            `Failed to fetch account/address for invoice ${invoice.Id}:`,
            error
          );

          return {
            ...invoice,

            accountDetails: {
              ...(accountDetails || {}),
              AccountName:
                accountDetails?.AccountName || "",
              CustomerType:
                accountDetails?.CustomerType ||
                accountDetails?.customerType ||
                invoice?.CustomerType ||
                invoice?.customerType ||
                "",
            },

            addressDetails: null,
          };
        }
      })
    );

    // ==========================================
    // 6. FINAL INVOICE LIST
    // ==========================================
    console.log(
      "FINAL ALL INVOICE LIST:",
      InvoicesList
    );

    // ==========================================
    // 7. SET TABLE DATA
    // ==========================================
    setInvoiceheaders(InvoicesList);
  } catch (error) {
    console.error(
      "Error fetching invoice headers:",
      error
    );
  }
};

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = () => {
    setIsDrawerOpen(true);
    //  handleEdit()
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // handleMenuOpen(false);
  };

  const handleNewClick = () => {
    setIsDrawerOpen(true);
    resetForm();
    setIsEditing(false);
    setOpen(false);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setShowDropdown(false);
    resetForm();
  };

  //for delete Header
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

const handleConfirmDelete = async () => {
  try {
    // ==========================================
    // 1. GET CURRENT INVOICE ID
    // ==========================================
    const deleteId = String(editId || "").trim();

    if (!deleteId) {
      console.error("DELETE: Invoice ID not found.");
      toast.error("Invoice ID not found. Cannot delete.");
      return;
    }

    console.log("====================================");
    console.log("DELETE SALES ENTRY");
    console.log("DELETE INVOICE ID:", deleteId);
    console.log("====================================");

    // ==========================================
    // 2. DELETE INVOICE HEADER
    // ==========================================
    const deleteUrl =
      `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
      `?Table=invoiceheader&Id=${encodeURIComponent(deleteId)}`;

    console.log("DELETE URL:", deleteUrl);

    const response = await fetch(deleteUrl, {
      method: "GET",
      redirect: "follow",
    });

    const resultText = await response.text();

    console.log("DELETE API STATUS:", response.status);
    console.log("DELETE API RESPONSE:", resultText);

    // ==========================================
    // 3. CHECK API RESPONSE
    // ==========================================
    if (!response.ok) {
      throw new Error(
        `Delete failed with status ${response.status}`
      );
    }

    // ==========================================
    // 4. CLOSE CONFIRMATION
    // ==========================================
    setOpen(false);

    // ==========================================
    // 5. CLOSE EDIT DRAWER
    // ==========================================
    setIsDrawerOpen(false);

    // ==========================================
    // 6. RESET EDIT STATE
    // ==========================================
    setIsEditing(false);
    setEditId("");

    // ==========================================
    // 7. RESET FORM
    // ==========================================
    resetForm();

    // ==========================================
    // 8. REFRESH INVOICE LIST
    // ==========================================
    await fetchInvoiceHeader();

    // ==========================================
    // 9. SUCCESS
    // ==========================================
    toast.success("Sales Entry Deleted successfully!");

  } catch (error) {
    console.error("DELETE SALES ENTRY ERROR:", error);

    toast.error(
      error?.message || "Unable to delete Sales Entry."
    );
  }
};

  const [editId, setEditId] = useState("");

// =====================================================
// UPDATE / EDIT FORM
// =====================================================

const handleEdit = async (row) => {
  try {
    console.log("========== INVOICE EDIT START ==========");

    // -------------------------------------------------
    // 1. ORIGINAL INVOICE ROW
    // -------------------------------------------------
    const originalData = row?.original || row;

    if (!originalData) {
      console.error("No row selected for editing.");
      toast.error("Please select an invoice.");
      return;
    }

    // -------------------------------------------------
    // 2. INVOICE ID
    // -------------------------------------------------
    const invoiceId =
      originalData.Id ||
      originalData.InvoiceId;

    if (!invoiceId) {
      console.error(
        "Invoice ID not found:",
        originalData
      );

      toast.error("Invoice ID not found.");
      return;
    }

    console.log(
      "EDIT INVOICE ID:",
      invoiceId
    );

    // -------------------------------------------------
    // 3. FIND INVOICE HEADER
    // -------------------------------------------------
    let invheader = invoiceheaders.find(
      (item) =>
        String(item.Id) ===
        String(invoiceId)
    );

    // If header is not found in invoiceheaders,
    // use the selected table row
    if (!invheader) {
      invheader = originalData;
    }

    if (!invheader) {
      console.error(
        "Invoice header not found."
      );

      toast.error(
        "Invoice header not found."
      );

      return;
    }

    console.log(
      "EDIT INVOICE HEADER:",
      invheader
    );

    // -------------------------------------------------
    // 4. GET SAVED INVOICE DETAILS
    // -------------------------------------------------
    const detailResponse = await axios.get(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
    );

    console.log(
      "EDIT INVOICE DETAIL RESPONSE:",
      detailResponse.data
    );

    // -------------------------------------------------
    // 5. NORMALIZE DETAIL RESPONSE
    // -------------------------------------------------
    const detailData =
      detailResponse.data;

    const invdetail =
      Array.isArray(detailData)
        ? detailData
        : Array.isArray(detailData?.data)
        ? detailData.data
        : detailData?.data
        ? [detailData.data]
        : detailData
        ? [detailData]
        : [];

    console.log(
      "EDIT SAVED DETAILS:",
      invdetail
    );

    // -------------------------------------------------
    // 6. MAP SAVED PRODUCTS
    // -------------------------------------------------
    const mappedRows = invdetail.map(
      (detail) => {

        const matchedProduct =
          productOptions.find(
            (option) =>
              String(option.value) ===
              String(detail.ProductId)
          );

        const quantity =
          parseFloat(detail.Quantity) || 0;

        const rate =
          parseFloat(detail.Rate) || 0;

        const amount =
          detail.Amount != null
            ? parseFloat(detail.Amount) || 0
            : quantity * rate;

        return {
          Id: detail.Id,

          InvoiceId:
            detail.InvoiceId ||
            invoiceId,

          ProductId:
            detail.ProductId,

          ProductName:
            detail.ProductName ||
            matchedProduct?.label ||
            "",

          Quantity:
            quantity,

          Rate:
            rate,

          Amount:
            amount,

          // Backend fields
          // Keep these because save/update may need them
          CGSTPercentage:
            detail.CGSTPercentage ?? 0,

          CGSTAmount:
            detail.CGSTAmount ?? 0,

          SGSTPercentage:
            detail.SGSTPercentage ?? 0,

          SGSTAmount:
            detail.SGSTAmount ?? 0,

          IGSTPercentage:
            detail.IGSTPercentage ?? 0,

          IGSTAmount:
            detail.IGSTAmount ?? 0,

          DiscountAmt:
            detail.DiscountAmt ?? 0,
        };
      }
    );

    console.log(
      "EDIT MAPPED ROWS:",
      mappedRows
    );

    // -------------------------------------------------
    // 7. SET EDIT MODE
    // -------------------------------------------------
    setEditId(invoiceId);

    setIsEditing(true);

    // -------------------------------------------------
    // 8. SET INVOICE HEADER VALUES
    // -------------------------------------------------
    setInvoiceNo(
      invheader.InvoiceNo || ""
    );

    setPhone(
      invheader.ContactNo || ""
    );

    setDevice(
      invheader.Device || ""
    );

    setBillFor(
      invheader.BillFor || ""
    );

    // MachineId / MachineID
    const machineValue =
      invheader.MachineID ??
      invheader.MachineId ??
      "";

    setMachineID(
      machineValue !== ""
        ? String(machineValue)
        : ""
    );

    // IsGST / ISGST
    const gstValue =
      invheader.IsGST ??
      invheader.ISGST ??
      0;

    setIsGST(
      Number(gstValue) === 1
    );

    // -------------------------------------------------
    // 9. INVOICE DATE
    // -------------------------------------------------
    const rawDate =
      typeof invheader.InvoiceDate === "object"
        ? invheader.InvoiceDate?.date
        : invheader.InvoiceDate;

    if (rawDate) {
      setInvoiceDate(
        String(rawDate).split(" ")[0]
      );
    } else {
      setInvoiceDate("");
    }

    // -------------------------------------------------
    // 10. CUSTOMER
    // -------------------------------------------------
  if (invheader.AccountId) {

  setSelectedAccount(
    invheader.AccountId
  );

  // IMPORTANT:
  // AccountId (39) customer name मध्ये set करू नका.
  // Actual Customer Name Account API मधून घ्या.

  try {
    const customerResponse = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invheader.AccountId}`
    );

    const customerResult = await customerResponse.json();

    const customerData = Array.isArray(customerResult)
      ? customerResult[0]
      : customerResult?.data || customerResult;

    const actualCustomerName =
      customerData?.AccountName ||
      customerData?.accountName ||
      "";

    setCustomerName(actualCustomerName);

    setAccountDetails((prev) => ({
      ...prev,
      AccountName: actualCustomerName,
    }));

  } catch (error) {
    console.error(
      "Customer Name fetch error:",
      error
    );

    setCustomerName("");
  }

  // Address + GST
  await fetchAccounts(
    invheader.AccountId
  );

  // Existing function
  fetchAccountName(
    invheader.AccountId
  );

} else {

      setSelectedAccount("");
      setCustomerName("");
    }

    // -------------------------------------------------
    // 11. PAYMENT DETAILS
    // -------------------------------------------------
    setPaymentMode(
      invheader.PaymentMode || ""
    );

    setCashAmount(
      invheader.CashAmount != null
        ? String(invheader.CashAmount)
        : ""
    );

    setOnlineAmount(
      invheader.OnlineAmount != null
        ? String(invheader.OnlineAmount)
        : ""
    );

    setReceivedAmount(
      invheader.ReceivedAmount != null
        ? String(invheader.ReceivedAmount)
        : ""
    );

    setDiscount(
      invheader.Discount != null
        ? String(invheader.Discount)
        : ""
    );

    setTransport(
      invheader.Transport != null
        ? String(invheader.Transport)
        : ""
    );

    // -------------------------------------------------
    // 12. LOAD SAVED PRODUCTS
    // -------------------------------------------------
    setRows(mappedRows);

    // -------------------------------------------------
    // 13. OPEN EDIT DRAWER
    // -------------------------------------------------
    setIsDrawerOpen(true);

    // -------------------------------------------------
    // 14. LOAD FIRST PRODUCT INTO EDIT INPUT
    // -------------------------------------------------
    if (mappedRows.length > 0) {

      const firstRow =
        mappedRows[0];

      console.log(
        "FIRST PRODUCT FOR EDIT:",
        firstRow
      );

      // IMPORTANT
      // First saved row is now in EDIT mode
      setEditingRow(null);

      // Product
      setSelectedProductId(
        firstRow.ProductId
      );

      setProductName(
        firstRow.ProductName || ""
      );

      setSelectedProductName(
        firstRow.ProductName || ""
      );

      // Quantity
      setQuantity(
        String(
          firstRow.Quantity ?? ""
        )
      );

      // Rate
      setRate(
        String(
          firstRow.Rate ?? ""
        )
      );

      // Amount
      SetAmount(
        Number(firstRow.Amount) || 0
      );

      // GST values kept internally
      setCGST(
        firstRow.CGSTPercentage ?? 0
      );

      setCGSTAmount(
        firstRow.CGSTAmount ?? 0
      );

      setSGST(
        firstRow.SGSTPercentage ?? 0
      );

      setSGSTAmount(
        firstRow.SGSTAmount ?? 0
      );

      setIGST(
        firstRow.IGSTPercentage ?? 0
      );

      setIGSTAmount(
        firstRow.IGSTAmount ?? 0
      );

      // Focus product field
      setTimeout(() => {
        productRef.current?.focus();
      }, 200);

    } else {

      // -------------------------------------------------
      // NO SAVED PRODUCT
      // -------------------------------------------------
      setEditingRow(null);

      setSelectedProductId("");

      setProductName("");

      setSelectedProductName("");

      setQuantity("");

      setRate("");

      SetAmount(0);

      setCGST(0);
      setCGSTAmount(0);

      setSGST(0);
      setSGSTAmount(0);

      setIGST(0);
      setIGSTAmount(0);
    }

    // -------------------------------------------------
    // 15. FINAL DEBUG
    // -------------------------------------------------
    console.log(
      "======================================"
    );

    console.log(
      "EDIT MODE ACTIVE"
    );

    console.log(
      "EDIT ID:",
      invoiceId
    );

    console.log(
      "EDIT ROWS:",
      mappedRows
    );

    console.log(
      "======================================"
    );

  } catch (error) {

    console.error(
      "EDIT INVOICE ERROR:",
      error.response?.data ||
      error.message ||
      error
    );

    toast.error(
      "Unable to load invoice for editing."
    );
  }
};

  //table
  
  //for preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

const columns = useMemo(
  () => [


    // ==================================================
// BILL NO
// ==================================================
{
  accessorKey: "InvoiceNo",
  header: "Bill No",
  size: 100,

  Cell: ({ cell }) => (
    <span>
      {cell.getValue() || "-"}
    </span>
  ),
},

    // ==================================================
    // INVOICE DATE
    // ==================================================
    {
      accessorKey: "InvoiceDate.date",
      header: "Invoice Date",
      size: 120,

      Cell: ({ cell }) => (
        <span>
          {cell.getValue()
            ? moment(cell.getValue()).format("DD-MM-YYYY")
            : "-"}
        </span>
      ),
    },

    // ==================================================
    // CUSTOMER NAME
    // ==================================================
    {
      header: "Customer Name",
      size: 200,

      accessorFn: (row) =>
        row.accountDetails?.AccountName || "N/A",

      Cell: ({ cell }) => (
        <span>{cell.getValue()}</span>
      ),
    },

    // ==================================================
    // CATEGORY
    // ==================================================
    {
      header: "Category",
      size: 130,

      accessorFn: (row) => {
        const customerType = String(
          row?.accountDetails?.CustomerType || ""
        )
          .trim()
          .toUpperCase();

        if (customerType === "R") {
          return "Retailer";
        }

        if (customerType === "D") {
          return "Dealer";
        }

        if (customerType === "C") {
          return "Caterers";
        }

        return "-";
      },

      Cell: ({ cell }) => (
        <span>{cell.getValue()}</span>
      ),
    },

    // ==================================================
    // TOTAL
    // ==================================================
    {
      accessorKey: "Total",
      header: "Total",
      size: 100,
    },

    // ==================================================
    // ACTIONS
    // ==================================================
    {
      header: "Actions",
      size: 200,

      Cell: ({ row }) => (
        <Box display="flex" gap={1}>

          {/* =========================
              EDIT BUTTON
          ========================= */}
          <Button
            sx={{
              background: "var(--primary-color)",
            }}
            variant="contained"
            size="small"
            onClick={() => {
              console.log(
                "INVOICE EDIT CLICK:",
                row.original
              );

              handleEdit(row.original);
            }}
          >
            Edit
          </Button>

          {/* =========================
              PREVIEW BUTTON
          ========================= */}
          <Button
            variant="contained"
            sx={{
              background:
                "var(--complementary-color)",
            }}
            size="small"
            onClick={async () => {
              try {
                // ---------------------------------
                // 1. GET SAVED INVOICE ID
                // ---------------------------------
                const invoiceId =
                  row.original?.Id;

                if (!invoiceId) {
                  toast.error(
                    "Invoice ID not found."
                  );
                  return;
                }

                // ---------------------------------
                // 2. GET THIS INVOICE DETAILS
                // ---------------------------------
                const detailResponse =
                  await axios.get(
                    `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
                  );

                console.log(
                  "INVOICE DETAIL RESPONSE:",
                  detailResponse.data
                );

                const allDetails =
                  Array.isArray(
                    detailResponse.data
                  )
                    ? detailResponse.data
                    : Array.isArray(
                        detailResponse.data?.data
                      )
                    ? detailResponse.data.data
                    : detailResponse.data?.data
                    ? [detailResponse.data.data]
                    : detailResponse.data
                    ? [detailResponse.data]
                    : [];

                // ---------------------------------
                // 3. GET ONLY THIS BILL DETAILS
                // ---------------------------------
                const invdetail =
                  allDetails
                    .filter(
                      (detail) =>
                        String(
                          detail.InvoiceId
                        ) ===
                        String(invoiceId)
                    )
                    .map((detail) => {
                      const matchedMaterial =
                        productOptions.find(
                          (item) =>
                            String(item.value) ===
                            String(
                              detail.ProductId
                            )
                        );

                      return {
                        ...detail,

                        ProductName:
                          matchedMaterial?.label ||
                          "Unknown",
                      };
                    });

                // ---------------------------------
                // 4. GET SAVED INVOICE HEADER
                // ---------------------------------
                let invoiceHeader =
                  row.original;

                try {
                  const headerResponse =
                    await fetch(
                      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`
                    );

                  const headerResult =
                    await headerResponse.json();

                  invoiceHeader =
                    Array.isArray(headerResult)
                      ? headerResult[0]
                      : Array.isArray(
                          headerResult?.data
                        )
                      ? headerResult.data[0]
                      : headerResult?.data
                      ? headerResult.data
                      : headerResult;

                  console.log(
                    "SAVED INVOICE HEADER:",
                    invoiceHeader
                  );
                } catch (headerError) {
                  console.error(
                    "Invoice Header Error:",
                    headerError
                  );
                }

                // ---------------------------------
                // 5. FINAL PREVIEW DATA
                // ---------------------------------

                const cashAmountSaved =
                  Number(
                    invoiceHeader?.CashAmount || 0
                  );

                const onlineAmountSaved =
                  Number(
                    invoiceHeader?.OnlineAmount || 0
                  );

                const savedReceivedAmount =
                  invoiceHeader?.ReceivedAmount != null
                    ? Number(
                        invoiceHeader.ReceivedAmount
                      )
                    : cashAmountSaved +
                      onlineAmountSaved;

               const finalPreviewData = {
  ...row.original,

  // RECEIVED AMOUNT
  ReceivedAmount: savedReceivedAmount,

  // ACCOUNT DETAILS
  accountDetails: row.original?.accountDetails || {
    AccountName: "",
    Address1: "",
    Address2: "",
    Address3: "",
    GSTNo: "",
  },

  // INVOICE DETAILS
  invdetail: invdetail,
};

                console.log(
                  "FINAL PREVIEW DATA:",
                  finalPreviewData
                );

                console.log(
                  "RECEIVED AMOUNT:",
                  finalPreviewData.ReceivedAmount
                );

                // ---------------------------------
                // 6. CONSOLE CHECK
                // ---------------------------------
                console.log(
                  "========== PREVIEW =========="
                );

                console.log(
                  "Invoice ID:",
                  invoiceId
                );

                console.log(
                  "Invoice Header:",
                  row.original
                );

                console.log(
                  "Invoice Details:",
                  invdetail
                );

               console.log(
  "Customer:",
  finalPreviewData.accountDetails
);

                console.log(
                  "FINAL PREVIEW DATA:",
                  finalPreviewData
                );

                console.log(
                  "============================="
                );

                // ---------------------------------
                // 7. OPEN PREVIEW
                // ---------------------------------
                setPreviewData(
                  finalPreviewData
                );

                setPreviewOpen(true);

              } catch (error) {
                console.error(
                  "Preview Error:",
                  error
                );

                toast.error(
                  "Unable to load invoice preview."
                );
              }
            }}
          >
            Preview
          </Button>
        </Box>
      ),
    },


 // ==================================================
// REMARK / EDITED
// ==================================================
{
  header: "Remark",
  size: 140,

  accessorFn: (row) => {
    const updateCount = Number(
      row?.UpdateCount ?? 0
    );

    // New bill = no Edited button
    if (updateCount <= 1) {
      return "";
    }

    // Edited bill
    return "Edited";
  },

  Cell: ({ row }) => {
    const updateCount = Number(
      row?.original?.UpdateCount ?? 0
    );

    // New bill
    if (updateCount <= 1) {
      return (
        <span>-</span>
      );
    }

    // Edited bill
    return (
      <Button
        variant="contained"
        size="small"
        sx={{
          background: "var(--primary-color)",
          minWidth: "80px",
        }}
        onClick={() => {
          console.log(
            "EDITED HISTORY CLICK:",
            row.original
          );

          // History popup आपण STEP 2 मध्ये add करू
        }}
      >
        Edited
      </Button>
    );
  },
},

  ],
  [
    invoiceheaders,
    invoicedetails,
    productOptions,
  ],
);



  // =========================
  // Integration
  // =========================

  // Invoice Details
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const [phone, setPhone] = useState("");

  const [device, setDevice] = useState("");

  const [billFor, setBillFor] = useState("");

  const [machineID, setMachineID] = useState("");

  const [machineOptions, setMachineOptions] = useState([]);

  const [isGST, setIsGST] = useState(false);

  // Product Details
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [amount, SetAmount] = useState("");

  // Keyboard navigation refs
  const quantityRef = useRef(null);
  const rateRef = useRef(null);
  const productRef = useRef(null);
  const discountRef = useRef(null);
  const receivedAmountRef = useRef(null);

  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  // ======================================================
  // ESC = GO ONE STEP BACK
  // ======================================================
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleEscBack = (event) => {
      if (event.key !== "Escape") return;

      const activeElement = document.activeElement;

      event.preventDefault();
      event.stopPropagation();

      // Received Amount -> Discount
      if (receivedAmountRef.current === activeElement) {
        setTimeout(() => {
          discountRef.current?.focus();
          discountRef.current?.select();
        }, 50);
        return;
      }

      // Discount -> Payment Mode
      if (discountRef.current === activeElement) {
        setTimeout(() => {
          document.querySelector('[name="paymentMode"]')?.focus();
        }, 50);
        return;
      }

      // Payment Mode -> Quantity
      if (activeElement?.name === "paymentMode") {
        setTimeout(() => {
          quantityRef.current?.focus();
          quantityRef.current?.select();
        }, 50);
        return;
      }

      // Quantity -> Product
      if (quantityRef.current === activeElement) {
        setTimeout(() => {
          productRef.current?.focus();
        }, 50);
        return;
      }

      // Product -> Customer
      if (productRef.current === activeElement) {
        setTimeout(() => {
          const customerInput = document.querySelector(
            'input[placeholder="Select Customer"]',
          );

          customerInput?.focus();
        }, 50);
        return;
      }
    };

    window.addEventListener("keydown", handleEscBack, true);

    return () => {
      window.removeEventListener("keydown", handleEscBack, true);
    };
  }, [isDrawerOpen]);

  // Tax Details
  const [cgst, setCGST] = useState(0);
  const [cgstAmount, setCGSTAmount] = useState(0);

  const [sgst, setSGST] = useState(0);
  const [sgstAmount, setSGSTAmount] = useState(0);

  const [igst, setIGST] = useState(0);
  const [igstAmount, setIGSTAmount] = useState(0);

  // =========================
  // Payment Details
  // =========================
  const [paymentMode, setPaymentMode] = useState(null);

  // Received Amount
  const [receivedAmount, setReceivedAmount] = useState("");

  // Mix Payment
  const [cashAmount, setCashAmount] = useState("");
  const [onlineAmount, setOnlineAmount] = useState("");

  // Transport
  const [transport, setTransport] = useState("");

  const [productName, setProductName] = useState("");
  // =========================
  // Customer / Account
  // =========================
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  const [acctGSTNo, setacctGSTNo] = useState("");

  const [customerAddress1, setCustomerAddress1] = useState("");
  const [customerAddress2, setCustomerAddress2] = useState("");
  const [customerAddress3, setCustomerAddress3] = useState("");

  // Customer complete details
  const [accountDetails, setAccountDetails] = useState({
    AccountName: "",
    Address1: "",
    Address2: "",
    Address3: "",
    GSTNo: "",
  });

  useEffect(() => {
    // fetchAccounts();

    fetchProduct();

    fetchMachines();

    fetchInvoiceHeader();
  }, []);

  //fetch customer from  account table

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster&RateType=Retailer",
      );

      const data = await response.json();

      console.log("RETAILER PRODUCT API RESPONSE:", data);

      productvalidation(data);
    } catch (error) {
      console.error("Error fetching retailer products:", error);
    }
  };

  // ======================================================
  // FETCH MACHINES
  // ======================================================

  const fetchMachines = async () => {
    try {
      const response = await axios.get(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=Machines",
      );

      console.log("Machines API Response:", response.data);

      const data = Array.isArray(response.data) ? response.data : [];

      const options = data.map((machine) => ({
        value: machine.Id,
        label: machine.MachineName || machine.Name || `Machine ${machine.Id}`,
      }));

      setMachineOptions(options);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const [selectedProductID, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState(null);

  const productvalidation = (data) => {
    console.log("RETAILER PRODUCT DATA:", data?.[0]);

    const options = data.map((account) => ({
      value: account?.Id,
      label: account?.ProductName,
      cgst: account?.CGSTPercentage,
      sgst: account?.SGSTPercentage,
      igst: account?.IGSTPercentage,

      // Regular Sales Rate = PurchasePrice
      purchaseRate: parseFloat(account?.PurchasePrice) || 0,
    }));

    setProductOptions(options);
  };

  const resetForm = () => {
    // =========================
    // Invoice Details
    // =========================
    setInvoiceNo("");
    setInvoiceDate(new Date());
    setPhone("");
    setDevice("");

    // NEW BILL HEADER FIELDS
    setBillFor("");
    setMachineID("");
    setIsGST(false);

    // =========================
    // Customer
    // =========================

    setSelectedAccount("");

    setAccountDetails({
      AccountName: "",
      Address1: "",
      Address2: "",
      Address3: "",
      GSTNo: "",
    });

    setacctGSTNo("");

    setCustomerAddress1("");
    setCustomerAddress2("");
    setCustomerAddress3("");

    // =========================
    // Product Details
    // =========================
    setProduct("");
    setQuantity("");
    setRate("");
    SetAmount("");

    // Discount

    // Discount
    setDiscount("");
    setBaseAmount(0);

    // =========================
    // Tax Details
    // =========================
    setCGST("");
    setCGSTAmount("");

    setSGST("");
    setSGSTAmount("");

    setIGST("");
    setIGSTAmount("");

    // =========================
    // Payment Details
    // =========================
    setPaymentMode("");
    setReceivedAmount("");

    // Mix Payment
    setCashAmount("");
    setOnlineAmount("");

    // =========================
    // Transport
    // =========================
    setTransport("");

    // =========================
    // Validation Errors
    // =========================
    setErrors({
      invoiceDate: "",
      selectedAccount: "",
      paymentMode: "",
      rows: "",
    });

    // =========================
    // Customer Search
    // =========================
    setAccountOptions([]);
    setAccountName("");
    setText("");
    setShowDropdown(false);

    // =========================
    // Product Table
    // =========================
    setRows([]);

    // =========================
    // Product Selection
    // =========================
    setSelectedProductId("");
    setSelectedProductName("");
    setProductName("");

    // =========================
    // Editing Row
    // =========================
    setEditingRow(null);

    // =========================
    // Tax / Amount Summary
    // =========================
    setSubTotalCal(0);
    setCgstTotal(0);
    setSgstTotal(0);
    setIgstTotal(0);
    setTotal(0);
  };

const handleSubmit = async (e, shouldPrint = false) => {
  // ======================================================
  // 0. PREVENT DEFAULT FORM / BROWSER ACTION
  // ======================================================

  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // ======================================================
  // 1. RECEIVED AMOUNT VALIDATION
  // ======================================================
  // Save / Update / Print only when:
  // Received Amount === Total
  //
  // Received Amount can be typed more than Total,
  // but it cannot be saved/printed.
  // Balance Due is also handled by validateReceivedAmount().
  // ======================================================

  const receivedValue =
    receivedAmount === ""
      ? NaN
      : parseFloat(receivedAmount);

  const totalValue =
    parseFloat(total) || 0;

  if (!validateReceivedAmount()) {
    console.log("RECEIVED AMOUNT VALIDATION FAILED");
    return;
  }

  // ======================================================
  // 2. MAIN FORM VALIDATION
  // ======================================================

  if (!validateForm()) {
    console.log("FORM VALIDATION FAILED");
    return;
  }

  // ======================================================
  // 3. MIX PAYMENT VALIDATION
  // ======================================================

  if (!validatePaymentSplit()) {
    console.log("PAYMENT VALIDATION FAILED");
    return;
  }

  // ======================================================
  // 4. OPEN PRINT WINDOW ONLY AFTER
  // ALL VALIDATIONS PASS
  // ======================================================

  let printWindow = null;

  if (shouldPrint) {
    printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error(
        "Please allow popups for printing."
      );
      return;
    }

    // ====================================================
    // TEMPORARY PRINT WINDOW
    // ====================================================

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preparing Invoice...</title>
        </head>

        <body
          style="
            font-family: Arial;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          "
        >
          <h3>
            Preparing invoice for printing...
          </h3>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  try {
    // ======================================================
    // 5. FORMAT INVOICE DATE
    // ======================================================

    const formattedInvoicedate =
      moment(invoiceDate).format("YYYY-MM-DD");

    // ======================================================
    // 6. INVOICE HEADER DATA
    // ======================================================

    const invoiceheaderdata = {
      // ----------------------------------------------------
      // BASIC INVOICE DETAILS
      // ----------------------------------------------------

      Id: isEditing
        ? editId
        : "",

      InvoiceNo:
        invoiceNo,

      InvoiceDate:
        formattedInvoicedate,

     AccountId:
  selectedAccount
    ? selectedAccount
    : "",

      ContactNo:
        phone,

      // ----------------------------------------------------
      // BILL HEADER FIELDS
      // ----------------------------------------------------

      BillFor:
        billFor || "",

      MachineID:
        machineID
          ? parseInt(machineID, 10)
          : 0,

      IsGST:
        isGST ? 1 : 0,

      // ----------------------------------------------------
      // PAYMENT DETAILS
      // ----------------------------------------------------

      PaymentMode:
        paymentMode || "",

      // Cash payment
      CashAmount:
        paymentMode === "C"
          ? parseFloat(receivedAmount) || 0
          : parseFloat(cashAmount) || 0,

      // Online payment
      OnlineAmount:
        paymentMode === "O"
          ? parseFloat(receivedAmount) || 0
          : parseFloat(onlineAmount) || 0,

      Discount:
        parseFloat(discount) || 0,

      // ----------------------------------------------------
      // OTHER BILL FIELDS
      // ----------------------------------------------------

      Transport:
        parseFloat(transport) || 0,

      CGSTAmount:
        parseFloat(cgstTotal) || 0,

      SGSTAmount:
        parseFloat(sgstTotal) || 0,

      IGSTAmount:
        parseFloat(igstTotal) || 0,

      Total:
        totalValue,

      // IMPORTANT:
      // Received Amount
      ReceivedAmount:
        receivedValue,

      SubTotal:
        parseFloat(subTotalcal) || 0,
    };

    // ======================================================
    // 7. DEBUG
    // ======================================================

    console.log(
      "===================================="
    );

    console.log(
      "INVOICE HEADER DATA TO API:",
      invoiceheaderdata
    );

    console.log(
      "TOTAL:",
      totalValue
    );

    console.log(
      "RECEIVED:",
      receivedValue
    );

    console.log(
      "REFUND:",
      Math.max(
        receivedValue - totalValue,
        0
      )
    );

    console.log(
      "===================================="
    );

    // ======================================================
    // 8. SELECT CREATE / UPDATE API
    // ======================================================

    const invoiceurl =
      isEditing
        ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
        : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

    console.log(
      "Saving invoice using:",
      invoiceurl
    );

    // ======================================================
    // 9. SAVE / UPDATE INVOICE HEADER
    // ======================================================

    const response =
      await axios.post(
        invoiceurl,
        qs.stringify(
          invoiceheaderdata
        ),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

    console.log(
      "Invoice Header Response:",
      response.data
    );

    // ======================================================
    // 10. GET INVOICE ID
    // ======================================================

   // ======================================================
// 10. GET INVOICE ID + INVOICE NUMBER
// ======================================================

const invoiceId =
  isEditing
    ? editId
    : parseInt(
        response.data.Id,
        10
      );

// IMPORTANT:
// New invoice -> get generated InvoiceNo from API
// Edit invoice -> keep existing InvoiceNo
const savedInvoiceNo =
  isEditing
    ? invoiceNo
    : response.data.InvoiceNo;

console.log(
  "Invoice ID:",
  invoiceId
);

console.log(
  "Saved Invoice No:",
  savedInvoiceNo
);

if (!invoiceId) {
  throw new Error(
    "Invoice ID was not received from server."
  );
}
    // ======================================================
    // 11. SAVE INVOICE DETAILS
    // ======================================================

    for (
      const [index, row]
      of rows.entries()
    ) {
      const rowData = {
        Id:
          row.Id
            ? parseInt(
                row.Id,
                10
              )
            : "",

        InvoiceId:
          parseInt(
            invoiceId,
            10
          ),

        SerialNo:
          index + 1,

        ProductId:
          parseInt(
            row.ProductId,
            10
          ),

        Quantity:
          parseFloat(
            row.Quantity
          ) || 0,

        Rate:
          parseFloat(
            row.Rate
          ) || 0,

        Amount:
          parseFloat(
            row.Amount
          ) || 0,

        // Keep GST internally for backend
        CGSTPercentage:
          parseFloat(
            row.CGSTPercentage
          ) || 0,

        CGSTAmount:
          parseFloat(
            row.CGSTAmount
          ) || 0,

        SGSTPercentage:
          parseFloat(
            row.SGSTPercentage
          ) || 0,

        SGSTAmount:
          parseFloat(
            row.SGSTAmount
          ) || 0,

        IGSTPercentage:
          parseFloat(
            row.IGSTPercentage
          ) || 0,

        IGSTAmount:
          parseFloat(
            row.IGSTAmount
          ) || 0,
      };

      console.log(
        `Invoice Detail ${
          index + 1
        }:`,
        rowData
      );

      // ====================================================
      // UPDATE EXISTING ROW
      // OR INSERT NEW ROW
      // ====================================================

      const invoicdedetailurl =
        row.Id
          ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
          : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

      await axios.post(
        invoicdedetailurl,
        qs.stringify(
          rowData
        ),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );
    }

    // ======================================================
    // 12. PRINT DATA
    // ======================================================

    if (shouldPrint) {
      const currentAccountDetails =
        await fetchAccounts(
          selectedAccount
        );

      console.log(
        "Customer Details For Print:",
        currentAccountDetails
      );

      const customerNameForPrint =
        accountOptions.find(
          ({ Id }) =>
            String(Id) ===
            String(selectedAccount)
        )?.AccountName ||
        accountName ||
        "";

   

    // ====================================================
// PRINT DATA
// ====================================================

const printData = {
  ...invoiceheaderdata,

  // ==================================================
  // INVOICE ID
  // ==================================================
  Id: invoiceId,

  // ==================================================
  // ACTUAL GENERATED INVOICE NUMBER
  // ==================================================
  InvoiceNo: savedInvoiceNo,

  // ==================================================
  // DEVICE
  // ==================================================
  Device:
    device || "",

  // ==================================================
  // PAYMENT MODE
  // ==================================================
  PaymentMode:
    paymentMode || "",

  // --------------------------------------------------
  // CUSTOMER
  // --------------------------------------------------

  accountDetails: {
    AccountName:
      customerNameForPrint || "",

    Address1:
      customerAddress1 || "",

    Address2:
      customerAddress2 || "",

    Address3:
      customerAddress3 || "",

    // Keep GST internally
    // Do NOT print it in PDF
    GSTNo:
      acctGSTNo || "",
  },

  customerName:
    customerNameForPrint || "",

  customerAddress1:
    customerAddress1 || "",

  customerAddress2:
    customerAddress2 || "",

  customerAddress3:
    customerAddress3 || "",

  customerGSTNo:
    acctGSTNo || "",

  // --------------------------------------------------
  // RECEIVED AMOUNT
  // --------------------------------------------------

  ReceivedAmount:
    receivedValue,

  // --------------------------------------------------
  // INVOICE DETAILS
  // --------------------------------------------------

  invdetail:
    rows.map(
      (row) => ({
        ...row,

        ProductName:
          row.ProductName ||
          productOptions.find(
            (option) =>
              String(option.value) ===
              String(row.ProductId)
          )?.label ||
          "Unknown",

        Quantity:
          parseFloat(row.Quantity) || 0,

        Rate:
          parseFloat(row.Rate) || 0,

        Amount:
          parseFloat(row.Amount) || 0,

        DiscountAmt:
          parseFloat(row.DiscountAmt) || 0,
      })
    ),
};

      console.log(
        "PRINT DATA:",
        printData
      );

      // ====================================================
      // PRINT
      // ====================================================

      console.log(
        "CALLING generatePDF..."
      );

      generatePDF(
        printData,
        printWindow
      );
    }

    // ======================================================
    // 13. SUCCESS MESSAGE
    // ======================================================

    toast.success(
      isEditing
        ? "Sales Entry Updated successfully!"
        : "Sales Entry Created successfully!"
    );

    // ======================================================
    // 14. CLOSE DRAWER
    // ======================================================

    setIsDrawerOpen(false);

    // ======================================================
    // 15. RESET FORM
    // ======================================================

    resetForm();

    // ======================================================
    // 16. REFRESH TABLE
    // ======================================================

    fetchInvoiceHeader();

  } catch (error) {
    // ======================================================
    // ERROR
    // ======================================================

    console.error(
      "Error submitting invoice:",
      error
    );

    // ======================================================
    // CLOSE PRINT WINDOW
    // ======================================================

    if (
      printWindow &&
      !printWindow.closed
    ) {
      printWindow.close();
    }

    // ======================================================
    // CLOSE DRAWER
    // ======================================================

    setIsDrawerOpen(false);

    // ======================================================
    // ERROR MESSAGE
    // ======================================================

    toast.error(
      isEditing
        ? "Sales Entry Updated unsuccessfully!"
        : "Sales Entry Created unsuccessfully!"
    );
  }
};

  // ======================================================
  // CTRL + S = SAVE + PRINT
  // ======================================================

  useEffect(() => {
    const handleCtrlS = (event) => {
      // Ctrl + S
      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        // Browser Save Page थांबवा
        event.preventDefault();
        event.stopPropagation();

        // Drawer बंद असेल तर काही करू नका
        if (!isDrawerOpen) {
          return;
        }

        // Double submit prevent करण्यासाठी
        if (event.repeat) {
          return;
        }

        console.log("CTRL + S PRESSED");

        // Save + Print
        handleSubmit(event);
      }
    };

    // Capture phase मध्ये listener
    window.addEventListener("keydown", handleCtrlS, true);

    return () => {
      window.removeEventListener("keydown", handleCtrlS, true);
    };
  }, [isDrawerOpen]);

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    calculateAmount(qty, rate);
  };

  const handleRateChange = (e) => {
    const rt = e.target.value;
    setRate(rt);
    // console.log("rateee", rate);
    calculateAmount(quantity, rt);
  };

  ///  for discount Amount
  const [discount, setDiscount] = useState("");

  // const calculateAmount = (qty, rt) => {
  //   const qtyNum = parseFloat(qty) || 0;
  //   const rateNum = parseFloat(rt) || 0;
  //   const amt = qtyNum * rateNum;
  //   SetAmount(amt);
  //   calculateCgstAmount(cgst, amt);
  //   calculateSgstAmount(sgst, amt);
  //   calculateIgstAmount(igst, amt);
  // };

  const [baseAmount, setBaseAmount] = useState(0);

  const calculateAmount = (qty, rt) => {
    const qtyNum = parseFloat(qty) || 0;

    const rateNum = parseFloat(rt) || 0;

    const baseAmt = qtyNum * rateNum;

    setBaseAmount(baseAmt);

    SetAmount(baseAmt);

    calculateCgstAmount(cgst, baseAmt);

    calculateSgstAmount(sgst, baseAmt);

    calculateIgstAmount(igst, baseAmt);
  };

  const calculateSgstAmount = (sgstValue, amt) => {
    let sgstNum = parseFloat(sgstValue) || 0;
    let sgstAmt = (sgstNum * amt) / 100;
    setSGSTAmount(sgstAmt);
  };

  const calculateCgstAmount = (cgstValue, amt) => {
    let cgstNum = parseFloat(cgstValue) || 0;
    let cgstAmt = (cgstNum * amt) / 100;
    setCGSTAmount(cgstAmt);
  };

  const calculateIgstAmount = (igstValue, amt) => {
    let igstNum = parseFloat(igstValue) || 0;
    let igstAmt = (igstNum * amt) / 100;
    setIGSTAmount(igstAmt);
  };

  const handleAddRow = () => {
    //  console.log("Selected Product ID:", selectedProductID);
    //  console.log("Selected Product Name:", selectedProductName);

    let newRow = {
      // id: rows.length + 1,
      InvoiceId: null,
      ProductId: selectedProductID,
      ProductName: productName,
      Quantity: quantity,
      Rate: rate,
      Amount: amount,
      CGSTPercentage: cgst,
      CGSTAmount: cgstAmount,
      SGSTPercentage: sgst,
      SGSTAmount: sgstAmount,
      IGSTPercentage: igst,
      IGSTAmount: igstAmount,
      DiscountAmt: discount,
    };
    // console.log("newRow", newRow);
    // Update rows state and ensure the new row is added to the table
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const [subTotalcal, setSubTotalCal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [igstTotal, setIgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const received = parseFloat(receivedAmount) || 0;
  const grandTotal = parseFloat(total) || 0;

  const difference = received - grandTotal;

  const refund = difference > 0 ? difference : 0;

  const balanceDue = difference < 0 ? Math.abs(difference) : 0;

const validateReceivedAmount = () => {
  const receivedValue = parseFloat(receivedAmount);
  const totalValue = parseFloat(total);

  // ==========================================
  // RECEIVED AMOUNT REQUIRED
  // ==========================================
  if (
    receivedAmount === "" ||
    Number.isNaN(receivedValue)
  ) {
    toast.error(
      `Please enter received amount ₹${totalValue.toFixed(2)}`
    );

    receivedAmountRef.current?.focus();
    receivedAmountRef.current?.select();

    return false;
  }

  // ==========================================
  // RECEIVED AMOUNT MUST BE EXACTLY TOTAL
  // ==========================================
  if (Math.abs(receivedValue - totalValue) > 0.001) {
    // ==========================================
    // RECEIVED AMOUNT GREATER THAN TOTAL
    // ==========================================
    if (receivedValue > totalValue) {
      const refundAmount = receivedValue - totalValue;

      toast.error(
        `Received amount is ₹${receivedValue.toFixed(
          2
        )}. Please enter exactly ₹${totalValue.toFixed(
          2
        )}. Refund ₹${refundAmount.toFixed(
          2
        )} cannot be saved.`
      );
    }

    // ==========================================
    // RECEIVED AMOUNT LESS THAN TOTAL
    // ==========================================
    else {
      const balanceAmount = totalValue - receivedValue;

      toast.error(
        `Please enter full received amount ₹${totalValue.toFixed(
          2
        )}. Balance Due ₹${balanceAmount.toFixed(2)}`
      );
    }

    receivedAmountRef.current?.focus();
    receivedAmountRef.current?.select();

    return false;
  }

  // ==========================================
  // RECEIVED AMOUNT == TOTAL
  // ==========================================
  return true;
};

  const handleCashAmountChange = (e) => {
    const value = e.target.value;

    if (Number(value) < 0) {
      return;
    }

    setCashAmount(value);

    const cash = Number(value) || 0;
    const online = Number(onlineAmount) || 0;

    setReceivedAmount((cash + online).toString());
  };


const handleReceivedAmountChange = (e) => {
  const value = e.target.value;

  if (value === "") {
    setReceivedAmount("");

    if (paymentMode === "M") {
      setCashAmount("");
      setOnlineAmount("");
    }

    return;
  }

  // Total पेक्षा जास्त amount सुद्धा type करू द्या.
  // Example:
  // Total = 2000
  // Received = 3000
  // Refund = 1000

  setReceivedAmount(value);

  if (paymentMode === "M") {
    setCashAmount("");
    setOnlineAmount("");
  }
};


  const handleOnlineAmountChange = (e) => {
    const value = e.target.value;

    if (Number(value) < 0) {
      return;
    }

    setOnlineAmount(value);

    const cash = Number(cashAmount) || 0;
    const online = Number(value) || 0;

    setReceivedAmount((cash + online).toString());
  };

  const validatePaymentSplit = () => {
    if (paymentMode !== "M") {
      return true;
    }

    const received = parseFloat(receivedAmount) || 0;
    const cash = parseFloat(cashAmount) || 0;
    const online = parseFloat(onlineAmount) || 0;

    const splitTotal = cash + online;

    if (Math.abs(splitTotal - received) > 0.001) {
      toast.error(`Cash + Online amount must be ₹${received.toFixed(2)}`);

      return false;
    }

    return true;
  };

  const isPaid = difference === 0 && received > 0;

  const calculations = () => {
    // =========================
    // SUBTOTAL
    // =========================

    const subtotal = rows.reduce(
      (acc, row) => acc + (parseFloat(row.Amount) || 0),
      0,
    );

    setSubTotalCal(subtotal.toFixed(2));

    // =========================
    // GST TOTALS
    // Keep internally for backend
    // =========================

    const totalCGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
      0,
    );

    setCgstTotal(totalCGST.toFixed(2));

    const totalSGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
      0,
    );

    setSgstTotal(totalSGST.toFixed(2));

    const totalIGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
      0,
    );

    setIgstTotal(totalIGST.toFixed(2));

    // =========================
    // DISCOUNT
    // =========================

    const discountValue = parseFloat(discount) || 0;

    // =========================
    // TRANSPORT
    // =========================

    const transportValue = parseFloat(transport) || 0;

    // =========================
    // FINAL TOTAL
    // =========================

    const totalBeforeDiscount = subtotal;

    const afterDiscount = Math.max(totalBeforeDiscount - discountValue, 0);

    const grandTotal = afterDiscount + transportValue;

    setTotal(grandTotal.toFixed(2));
  };

  useEffect(() => {
    calculations();
  }, [rows, transport, discount]);
  //
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenutableOpen = (event, index) => {
    setAnchorEl1(event.currentTarget);
    setSelectedRow(index);
  };

  const handletableMenuClose = () => {
    setAnchorEl1(null);
    setSelectedRow(null);
  };

  const [editingRow, setEditingRow] = useState(null);

const handleEditRow = (index) => {
  const row = rows[index];

  if (!row) {
    toast.error("Product row not found.");
    return;
  }

  console.log("========== EDIT PRODUCT ROW ==========");
  console.log("EDIT ROW INDEX:", index);
  console.log("EDIT ROW DATA:", row);

  // Set row in edit mode
  setEditingRow(index);

  // Product
  setSelectedProductId(row.ProductId);
  setProductName(row.ProductName || "");

  // Quantity
  const q =
    row.Quantity !== null &&
    row.Quantity !== undefined
      ? String(row.Quantity)
      : "";

  setQuantity(q);

  // Rate
  const r =
    row.Rate !== null &&
    row.Rate !== undefined
      ? String(row.Rate)
      : "";

  setRate(r);

  // Calculate amount
  const qtyNum = parseFloat(q) || 0;
  const rateNum = parseFloat(r) || 0;

  const baseAmt = qtyNum * rateNum;

  setBaseAmount(baseAmt);
  SetAmount(baseAmt);

  // GST values
  setCGST(row.CGSTPercentage || 0);
  setSGST(row.SGSTPercentage || 0);
  setIGST(row.IGSTPercentage || 0);

  calculateCgstAmount(
    row.CGSTPercentage || 0,
    baseAmt
  );

  calculateSgstAmount(
    row.SGSTPercentage || 0,
    baseAmt
  );

  calculateIgstAmount(
    row.IGSTPercentage || 0,
    baseAmt
  );

  console.log("EDIT PRODUCT VALUES:", {
    ProductId: row.ProductId,
    ProductName: row.ProductName,
    Quantity: q,
    Rate: r,
    Amount: baseAmt,
  });

  console.log("======================================");
};

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const addProductRow = (productData = null) => {
    const productId = productData?.value || selectedProductID;

    if (!productId) {
      return;
    }

    const productLabel = productData?.label || productName || "";

    const qty = parseFloat(productData?.quantity ?? quantity) || 1;

    const rt = parseFloat(productData?.rate ?? rate) || 0;

    const cgstValue = parseFloat(productData?.cgst ?? cgst) || 0;

    const sgstValue = parseFloat(productData?.sgst ?? sgst) || 0;

    const igstValue = parseFloat(productData?.igst ?? igst) || 0;

    // Product Amount
    const baseAmt = qty * rt;

    // GST amounts
    const cgstValueAmount = (cgstValue * baseAmt) / 100;

    const sgstValueAmount = (sgstValue * baseAmt) / 100;

    const igstValueAmount = (igstValue * baseAmt) / 100;

    const newRow = {
      Id: null,
      InvoiceId: null,

      ProductId: productId,
      ProductName: productLabel,

      Quantity: qty,
      Rate: rt,

      // Product level discount नाही
      Amount: baseAmt,

      DiscountAmt: 0,

      CGSTPercentage: cgstValue,
      CGSTAmount: cgstValueAmount,

      SGSTPercentage: sgstValue,
      SGSTAmount: sgstValueAmount,

      IGSTPercentage: igstValue,
      IGSTAmount: igstValueAmount,
    };

    setRows((prevRows) => [...prevRows, newRow]);

    // Clear only product-entry fields
    setSelectedProductId("");
    setSelectedProductName("");
    setProductName("");

    setQuantity("");
    setRate("");
    SetAmount("");

    setCGST("");
    setCGSTAmount("");

    setSGST("");
    setSGSTAmount("");

    setIGST("");
    setIGSTAmount("");
  };

  // ============================================================
  // ENTER = SELECT HIGHLIGHTED PRODUCT
  // ============================================================

  const handleProductSelectKeyDown = (event) => {
    // ----------------------------------------------------------
    // Only handle ENTER
    // ----------------------------------------------------------

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // ----------------------------------------------------------
    // Find highlighted product
    // MUI uses .Mui-focused for the currently highlighted option
    // ----------------------------------------------------------

    const highlightedOption =
      document.querySelector(".MuiAutocomplete-option.Mui-focused") ||
      document.querySelector('.MuiAutocomplete-option[aria-selected="true"]');

    // ----------------------------------------------------------
    // Product found → select it
    // ----------------------------------------------------------

    if (highlightedOption) {
      highlightedOption.click();

      // --------------------------------------------------------
      // After product selection → Quantity field
      // --------------------------------------------------------

      setTimeout(() => {
        quantityRef.current?.focus();
        quantityRef.current?.select();
      }, 100);

      return;
    }

    // ----------------------------------------------------------
    // No product highlighted
    // ----------------------------------------------------------

    toast.error("Please select a product.");
  };

const handleSaveOrAddRow = () => {
  // =====================================================
  // 1. PRODUCT VALIDATION
  // =====================================================
  if (!selectedProductID) {
    toast.error("Please select a product.");

    setTimeout(() => {
      productRef.current?.focus();
    }, 100);

    return;
  }

  // =====================================================
  // 2. QUANTITY VALIDATION
  // =====================================================
  const finalQuantity = parseFloat(quantity);

  if (
    Number.isNaN(finalQuantity) ||
    finalQuantity <= 0
  ) {
    toast.error("Please enter quantity.");

    setTimeout(() => {
      quantityRef.current?.focus();
      quantityRef.current?.select();
    }, 100);

    return;
  }

  // =====================================================
  // 3. RATE VALIDATION
  // =====================================================
  const finalRate = parseFloat(rate);

  if (
    Number.isNaN(finalRate) ||
    finalRate <= 0
  ) {
    toast.error("Please enter rate.");

    setTimeout(() => {
      rateRef.current?.focus();
      rateRef.current?.select();
    }, 100);

    return;
  }

  // =====================================================
  // 4. CALCULATE AMOUNT
  // =====================================================
  const finalAmount =
    finalQuantity * finalRate;

  // =====================================================
  // 5. FIND SELECTED PRODUCT
  // =====================================================
  const selectedOption =
    productOptions.find(
      (option) =>
        String(option.value) ===
        String(selectedProductID)
    );

  // =====================================================
  // 6. PRODUCT NAME
  // =====================================================
  const finalProductName =
    productName ||
    selectedOption?.label ||
    selectedProductName ||
    "";

  // =====================================================
  // 7. EDIT EXISTING ROW
  // =====================================================
  if (editingRow !== null) {
    const updatedRows = [...rows];

    updatedRows[editingRow] = {
      ...updatedRows[editingRow],

      ProductId: selectedProductID,

      ProductName: finalProductName,

      Quantity: finalQuantity,

      Rate: finalRate,

      Amount: finalAmount,
    };

    console.log(
      "UPDATED PRODUCT ROW:",
      updatedRows[editingRow]
    );

    // Update rows
    setRows(updatedRows);

    // Editing completed
    setEditingRow(null);
  } else {
    // ===================================================
    // 8. ADD NEW PRODUCT ROW
    // ===================================================

    const newRow = {
      InvoiceId: null,

      ProductId: selectedProductID,

      ProductName: finalProductName,

      Quantity: finalQuantity,

      Rate: finalRate,

      Amount: finalAmount,
    };

    console.log(
      "NEW PRODUCT ROW:",
      newRow
    );

    // Add new row
    setRows((prevRows) => [
      ...prevRows,
      newRow,
    ]);
  }

  // =====================================================
  // 9. CLEAR CURRENT INPUTS
  // =====================================================
  resetFields();

  // =====================================================
  // 10. FOCUS NEXT PRODUCT
  // =====================================================
  setTimeout(() => {
    productRef.current?.focus();

    setProductDropdownOpen(true);
  }, 150);
};

  const resetFields = () => {
    setSelectedProductId("");
    setProductName("");
    setSelectedProductName("");
    setQuantity("");
    setRate("");
    SetAmount("");
    setCGST("");
    setCGSTAmount("");
    setSGST("");
    setSGSTAmount("");
    setIGST("");
    setIGSTAmount("");
  };

  //get company master
  const [gstNo, setGstNO] = useState("");

  const fetchCompanyMaster = async () => {
    try {
      const response = await axios.get(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=companymaster",
        { maxBodyLength: Infinity },
      );
      console.log(response.data);
      console.log(" Company GST NO:", response.data[0].GSTNo);
      setGstNO(response.data[0].GSTNo);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyMaster();
  }, []);

  //for serchApi
  const [showDropdown, setShowDropdown] = useState(false);
  const [text, setText] = useState("");

  const serchCustomers = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${text}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        //setAccountOptions(result);
        setAccountOptions(Array.isArray(result) ? result : []);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    serchCustomers();
  }, [text]);

  // create new Customer
  const [accountName, setAccountName] = useState("");
  const [customerName, setCustomerName] = useState("");

  const Namevalidation = () => {
    let temp = accountName.split(" ");
    let surname = temp[1];
    if (surname && surname.length >= 1) {
      return true;
    } else {
      toast.error("Need to Insert First and last Name ");
      return false;
    }
  };

  const [customerGSTNo, setCustomerGSTNo] = useState("");

  const CreateCustomerMaster = () => {
    if (!Namevalidation()) {
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("AccountName", accountName);
    urlencoded.append("GroupId", "3");
    urlencoded.append("SubGroupId", "1");
    urlencoded.append("OpeningBalance", "100");
    urlencoded.append("DrORCr", "D");
    urlencoded.append("TypeCode", "C");
    urlencoded.append("IsSystem", "false");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        //console.log("Customer Created:", result);

        if (result && result.Id) {
          //console.log(result.Id)
          toast.success("user created");
          // Now set the address and GSTNo for this customer
          const addressData = new URLSearchParams();

          addressData.append("AccountId", result.Id);

          addressData.append("GSTNo", "270000000000000");

          return fetch(
            "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
            {
              method: "POST",
              headers: myHeaders,
              body: addressData,
              redirect: "follow",
            },
          );
        } else {
          throw new Error("Customer ID not received from API.");
        }
      })
      .then((response) => response.json())
      .then((addressResult) => {
        //console.log("Address Added:", addressResult);
        // Clear the input field after successful creation
        setAccountName("");
      })
      .catch((error) => console.error("Error:", error));
  };

  //set GSTno

const fetchAccounts = async (customerId) => {
  if (!customerId) {
    setacctGSTNo("");
    setCustomerAddress1("");
    setCustomerAddress2("");
    setCustomerAddress3("");
    return;
  }

  try {
    const response = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`,
      {
        method: "GET",
        redirect: "follow",
      },
    );

    const result = await response.json();

    const temp = Array.isArray(result) ? result[0] : null;

    console.log("Customer Address API Response:", temp);

    setacctGSTNo(String(temp?.GSTNo ?? ""));
    setCustomerAddress1(temp?.Address1 ?? "");
    setCustomerAddress2(temp?.Address2 ?? "");
    setCustomerAddress3(temp?.Address3 ?? "");
  } catch (error) {
    console.error("Customer details fetch error:", error);

    setacctGSTNo("");
    setCustomerAddress1("");
    setCustomerAddress2("");
    setCustomerAddress3("");
  }
};

  const fetchAccountName = (acctname) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${acctname}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        //console.log('accountname', result)

        setAccountOptions(Array.isArray(result) ? result : []);
      })
      .catch((error) => console.error(error));
  };

  //

  const handleItemChange = (newValue) => {
    if (newValue) {
      setSelectedProductId(newValue.value);
      setProductName(newValue.label);
      setSelectedProductName(newValue.label);

      // Default Quantity
      const defaultQty = 1;

      // Regular Rate automatically comes from ProductMaster API
      const defaultRate = parseFloat(newValue.purchaseRate) || 0;

      setRate(defaultRate);

      setQuantity(defaultQty);
      setRate(defaultRate);

      // GST calculation
      const sameState = gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2);

      const cgstValue = sameState ? newValue.cgst : "0";
      const sgstValue = sameState ? newValue.sgst : "0";
      const igstValue = !sameState ? newValue.igst : "0";

      setCGST(cgstValue);
      setSGST(sgstValue);
      setIGST(igstValue);

      // Calculate amount using default quantity and Regular rate
      calculateAmount(defaultQty, defaultRate);
    } else {
      setSelectedProductId("");
      setProductName("");
      setSelectedProductName("");

      setQuantity("");
      setRate("");

      setCGST("0");
      setSGST("0");
      setIGST("0");

      SetAmount("");
    }
  };

  ///Pagination
  const [totalPages, setTotalPages] = useState(1);
  //validation
  const [errors, setErrors] = useState({
    invoiceDate: "",
    selectedAccount: "",
    paymentMode: "",
    rows: "",
  });

  const validateForm = () => {
    const newErrors = {
      invoiceDate: "",
      selectedAccount: "",
      paymentMode: "",
      rows: "",
    };

    let isValid = true;

    // Invoice Date
    if (!invoiceDate) {
      newErrors.invoiceDate = "Invoice date is required";

      isValid = false;
    } else {
      const invoiceDateObj = new Date(invoiceDate);

     const fromDateObj = new Date(fromDate);

const toDateObj = new Date(toDate);

if (invoiceDateObj < fromDateObj) {
  newErrors.invoiceDate = `Invoice date cannot be before ${new Date(
    fromDate,
  ).toLocaleDateString()}`;

  isValid = false;
} else if (invoiceDateObj > toDateObj) {
  newErrors.invoiceDate = `Invoice date cannot be after ${new Date(
    toDate,
  ).toLocaleDateString()}`;

  isValid = false;
}
      }

    // Payment Mode
    if (!paymentMode) {
      newErrors.paymentMode = "Payment mode is required";

      isValid = false;
    }

    // Product rows
    if (rows.length === 0) {
      newErrors.rows = "Please add at least one product";

      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  //for yearId
  const [yearid, setYearId] = useState("");
 

 useEffect(() => {
  const storedYearId = Cookies.get("YearId");
  const storedfromdate = Cookies.get("FromDate");
  const storedtodate = Cookies.get("ToDate");

  if (storedYearId) {
    setYearId(storedYearId);
  } else {
    toast.error("Year is not set.");
  }

  if (storedfromdate) {
    setFromDate(storedfromdate);
  } else {
    toast.error("FromDate is not set.");
  }

  if (storedtodate) {
    setToDate(storedtodate);
  } else {
    toast.error("ToDate is not set.");
  }
}, []);

  //for print
  // ============================================================
  // SALES ENTRY - 80MM THERMAL ROLL PRINT
  // ============================================================

  const generatePDF = async (printData = previewData, printWindow = null) => {
    // ============================================================
    // 1. CHECK INVOICE DATA
    // ============================================================

    if (!printData) {
      toast.error("No invoice data available for printing.");

      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }

      return;
    }

    console.log("========================================");
    console.log("INVOICE PRINT START");
    console.log("PRINT DATA:", printData);
    console.log("SELECTED ACCOUNT:", selectedAccount);
    //  console.log("SELECTED CUSTOMER NAME:", selectedCustomerName);
    console.log("========================================");

    // ============================================================
    // 2. GET ACCOUNT ID
    // ============================================================

    let accountId = "";

    accountId =
      printData?.AccountId ||
      printData?.AccountID ||
      printData?.CustomerId ||
      printData?.CustomerID ||
      printData?.CustomerAccountId ||
      printData?.CustomerAccountID ||
      printData?.accountDetails?.Id ||
      printData?.accountDetails?.AccountId ||
      "";

    // ============================================================
    // 3. IF ACCOUNT ID NOT FOUND, GET FROM selectedAccount
    // ============================================================

    if (!accountId && selectedAccount) {
      if (typeof selectedAccount === "object") {
        accountId =
          selectedAccount?.Id ||
          selectedAccount?.ID ||
          selectedAccount?.AccountId ||
          selectedAccount?.AccountID ||
          selectedAccount?.CustomerId ||
          selectedAccount?.CustomerID ||
          selectedAccount?.value ||
          selectedAccount?.id ||
          "";
      } else {
        accountId = selectedAccount;
      }
    }

    // ============================================================
    // 4. IF STILL NOT FOUND, FIND ID FROM accountOptions
    // ============================================================

    // ============================================================
    // 5. CUSTOMER VARIABLES
    // ============================================================

    let customerName = "";
let customerAddress1 = "";
let customerAddress2 = "";
let customerAddress3 = "";
let customerMobileNo = "";

   // ============================================================
// 6. FETCH CUSTOMER NAME + ADDRESS + CONTACT
// ============================================================

if (accountId) {
  try {

    // ========================================================
    // 6A. ACCOUNT API
    // ========================================================

    const accountResponse = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
        accountId
      )}`
    );

    if (!accountResponse.ok) {
      throw new Error(
        `Account API failed with status ${accountResponse.status}`
      );
    }

    const accountResult =
      await accountResponse.json();

    const accountData =
      Array.isArray(accountResult)
        ? accountResult[0] || null
        : Array.isArray(accountResult?.data)
        ? accountResult.data[0] || null
        : accountResult?.data ||
          accountResult ||
          null;

    console.log(
      "PRINT ACCOUNT DATA:",
      accountData
    );

    // ========================================================
    // CUSTOMER NAME
    // ========================================================

    customerName =
      accountData?.AccountName ||
      accountData?.accountName ||
      "";

    // ========================================================
    // CUSTOMER CONTACT
    // ========================================================

    customerMobileNo =
      accountData?.MobileNo ||
      accountData?.MobileNumber ||
      accountData?.ContactNo ||
      accountData?.ContactNumber ||
      accountData?.PhoneNo ||
      accountData?.PhoneNumber ||
      "";

    // ========================================================
    // 6B. ADDRESS API
    // ========================================================

    const addressResponse = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
        accountId
      )}`
    );

    if (!addressResponse.ok) {
      throw new Error(
        `Address API failed with status ${addressResponse.status}`
      );
    }

    const addressResult =
      await addressResponse.json();

    const addressData =
      Array.isArray(addressResult)
        ? addressResult[0] || null
        : Array.isArray(addressResult?.data)
        ? addressResult.data[0] || null
        : addressResult?.data ||
          addressResult ||
          null;

    console.log(
      "PRINT ADDRESS DATA:",
      addressData
    );

    if (addressData) {

      customerAddress1 =
        addressData?.Address1 ||
        addressData?.address1 ||
        "";

      customerAddress2 =
        addressData?.Address2 ||
        addressData?.address2 ||
        "";

      customerAddress3 =
        addressData?.Address3 ||
        addressData?.address3 ||
        "";
    }

  } catch (error) {

    console.error(
      "PRINT CUSTOMER DETAILS ERROR:",
      error
    );
  }
}
    // ============================================================
// 7. FALLBACK CUSTOMER NAME
// ============================================================

if (!customerName) {
  customerName =
    printData?.accountDetails?.AccountName ||
    printData?.customerName ||
    "";
}


    // ============================================================
    // 8. FALLBACK ADDRESS 1
    // ============================================================

    if (!customerAddress1) {
      customerAddress1 =
        printData?.accountDetails?.Address1 || printData?.Address1 || "";
    }

    // ============================================================
    // 9. FALLBACK ADDRESS 2
    // ============================================================

    if (!customerAddress2) {
      customerAddress2 =
        printData?.accountDetails?.Address2 || printData?.Address2 || "";
    }

    // ============================================================
    // 10. FALLBACK ADDRESS 3
    // ============================================================

    if (!customerAddress3) {
      customerAddress3 =
        printData?.accountDetails?.Address3 || printData?.Address3 || "";
    }

    // ============================================================
    // 11. CONTACT NUMBER
    // ============================================================

   const contactNo =
  customerMobileNo ||
  printData?.ContactNo ||
  printData?.ContactNumber ||
  printData?.MobileNo ||
  printData?.MobileNumber ||
  printData?.PhoneNo ||
  "";

   

    // ============================================================
    // 13. CUSTOMER DEBUG
    // ============================================================

    console.log("========================================");
    console.log("FINAL CUSTOMER INFORMATION");
    console.log("ACCOUNT ID:", accountId);
    console.log("CUSTOMER NAME:", customerName);
    console.log("ADDRESS 1:", customerAddress1);
    console.log("ADDRESS 2:", customerAddress2);
    console.log("ADDRESS 3:", customerAddress3);
    console.log("MOBILE:", contactNo);
   
    console.log("========================================");

    // ============================================================
    // 14. CREATE 80MM ROLL PDF
    // ============================================================

    const ROLL_WIDTH = 80;
    const ROLL_HEIGHT = 300;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [ROLL_WIDTH, ROLL_HEIGHT],
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ============================================================
    // 15. INVOICE NUMBER
    // ============================================================

    const invoiceNo =
      printData?.InvoiceNo ||
      printData?.InvoiceNumber ||
      printData?.BillNo ||
      printData?.BillNumber ||
      printData?.invoiceNo ||
      "";

    // ============================================================
    // 16. DATE
    // ============================================================

    let invoiceDateText = "-";

    try {
      if (printData?.InvoiceDate?.date) {
        invoiceDateText = moment(printData.InvoiceDate.date).format(
          "DD-MM-YYYY",
        );
      } else if (printData?.InvoiceDate) {
        invoiceDateText = moment(printData.InvoiceDate).format("DD-MM-YYYY");
      }
    } catch (error) {
      console.error("Invoice date formatting error:", error);
      invoiceDateText = "-";
    }

    // ============================================================
    // 17. TIME
    // ============================================================

    const invoiceTime = moment().format("hh:mm A");

    // ============================================================
    // 18. COMPANY DETAILS
    // ============================================================

    const companyName = "AMRUT MILK PRODUCTS 2";
    const companyAddress1 = "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER";
    const companyAddress2 = "KOLHAPUR.";
    const companyPhone = "8830261523";
    const companyState = "27-Maharashtra";

    // ============================================================
    // 19. LOAD IMAGE AS DATA URL
    // ============================================================

    const imageToDataURL = (imageSource) => {
      return new Promise((resolve, reject) => {
        if (!imageSource) {
          reject(new Error("Image source is empty."));
          return;
        }

        if (
          typeof imageSource === "string" &&
          imageSource.startsWith("data:image")
        ) {
          resolve(imageSource);
          return;
        }

        const img = new Image();

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");

            canvas.width = img.naturalWidth || img.width;

            canvas.height = img.naturalHeight || img.height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            resolve(canvas.toDataURL("image/png"));
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error(`Unable to load image: ${imageSource}`));
        };

        img.src = imageSource;
      });
    };

    // ============================================================
    // 20. LOAD BOTH LOGOS
    // ============================================================

    let amrutLogoData = null;
    let fremilaLogoData = null;

    try {
      amrutLogoData = await imageToDataURL(amrutLogo);
      console.log("Amrut Siddhi logo loaded.");
    } catch (error) {
      console.error("Amrut Siddhi logo error:", error);
    }

    try {
      fremilaLogoData = await imageToDataURL(fremilaLogo);
      console.log("Fremila logo loaded.");
    } catch (error) {
      console.error("Fremila logo error:", error);
    }

    // ============================================================
    // 21. ROLL PRINT MARGINS
    // ============================================================

    const leftMargin = 4;
    const rightMargin = 4;

    const contentWidth = pageWidth - leftMargin - rightMargin;

    // ============================================================
    // 22. OUTER BORDER
    // ============================================================

    doc.setLineWidth(0.4);

    doc.rect(leftMargin, 4, contentWidth, pageHeight - 8);

    // ============================================================
    // 23. HEADER
    // ============================================================

    let y = 11;

    // ============================================================
    // 23.1 AMRUT SIDDHI LOGO
    // ============================================================

    if (amrutLogoData) {
      try {
        doc.addImage(amrutLogoData, "PNG", pageWidth - 25, 7, 18, 12);
      } catch (error) {
        console.error("Amrut Siddhi PDF logo error:", error);
      }
    }

    // ============================================================
    // 23.2 FREMILA LOGO
    // ============================================================

    if (fremilaLogoData) {
      try {
        doc.addImage(fremilaLogoData, "PNG", pageWidth - 25, 20, 18, 12);
      } catch (error) {
        console.error("Fremila PDF logo error:", error);
      }
    }

    // ============================================================
    // 23.3 COMPANY NAME
    // ============================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(companyName, leftMargin + 2, y);

    y += 4;

    // ============================================================
    // 23.4 COMPANY ADDRESS 1
    // ============================================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);

    const companyAddressLines = doc.splitTextToSize(companyAddress1, 52);

    doc.text(companyAddressLines, leftMargin + 2, y);

    y += companyAddressLines.length * 3.2;

    // ============================================================
    // 23.5 COMPANY ADDRESS 2
    // ============================================================

    doc.text(companyAddress2, leftMargin + 2, y);

    y += 3.2;

    // ============================================================
    // 23.6 COMPANY PHONE
    // ============================================================

    doc.text(`Phone no.: ${companyPhone}`, leftMargin + 2, y);

    y += 3.2;

    // ============================================================
    // 23.7 COMPANY STATE
    // ============================================================

    doc.text(`State: ${companyState}`, leftMargin + 2, y);

    // ============================================================
    // 24. TAX INVOICE
    // ============================================================

    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text("Tax Invoice", pageWidth / 2, y, {
      align: "center",
    });

    y += 5;

    // ============================================================
    // 25. HEADER LINE
    // ============================================================

    doc.setLineWidth(0.3);

    doc.line(leftMargin + 2, y, pageWidth - rightMargin - 2, y);

    y += 5;

   // ============================================================
// 26. BILL TO / INVOICE DETAILS
// ============================================================

// ------------------------------------------------------------
// TWO INDEPENDENT COLUMNS
// ------------------------------------------------------------

const leftX = 6;
const rightX = 43;

const sectionStartY = y;

// ============================================================
// LEFT COLUMN - CUSTOMER
// ============================================================

let customerY = sectionStartY;

doc.setFont("helvetica", "bold");
doc.setFontSize(7);

doc.text(
  "Bill To",
  leftX,
  customerY
);

customerY += 4;

// ------------------------------------------------------------
// CUSTOMER NAME
// ------------------------------------------------------------

if (customerName) {

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);

  const customerNameLines =
    doc.splitTextToSize(
      String(customerName),
      34
    );

  doc.text(
    customerNameLines,
    leftX,
    customerY
  );

  customerY +=
    customerNameLines.length * 3.2;
}

// ------------------------------------------------------------
// ADDRESS 1
// ------------------------------------------------------------

if (customerAddress1) {

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);

  const address1Lines =
    doc.splitTextToSize(
      String(customerAddress1),
      34
    );

  doc.text(
    address1Lines,
    leftX,
    customerY
  );

  customerY +=
    address1Lines.length * 3.2;
}

// ------------------------------------------------------------
// ADDRESS 2
// ------------------------------------------------------------

if (customerAddress2) {

  const address2Lines =
    doc.splitTextToSize(
      String(customerAddress2),
      34
    );

  doc.text(
    address2Lines,
    leftX,
    customerY
  );

  customerY +=
    address2Lines.length * 3.2;
}

// ------------------------------------------------------------
// ADDRESS 3
// ------------------------------------------------------------

if (customerAddress3) {

  const address3Lines =
    doc.splitTextToSize(
      String(customerAddress3),
      34
    );

  doc.text(
    address3Lines,
    leftX,
    customerY
  );

  customerY +=
    address3Lines.length * 3.2;
}

// ------------------------------------------------------------
// CONTACT NUMBER
// ------------------------------------------------------------

if (contactNo) {

  doc.text(
    `Contact No.: ${contactNo}`,
    leftX,
    customerY
  );

  customerY += 3.5;
}


// ============================================================
// RIGHT COLUMN - INVOICE DETAILS
// ============================================================

let invoiceY = sectionStartY;

doc.setFont("helvetica", "bold");
doc.setFontSize(7);

doc.text(
  "Invoice Details",
  rightX,
  invoiceY
);

invoiceY += 4;

// ============================================================
// UPDATE Y AFTER CUSTOMER / INVOICE DETAILS
// ============================================================

y = Math.max(customerY, invoiceY) + 2;



// ------------------------------------------------------------
// INVOICE NUMBER
// ------------------------------------------------------------

doc.setFont("helvetica", "normal");
doc.setFontSize(6);

doc.text(
  `Invoice No.: ${invoiceNo || "-"}`,
  rightX,
  invoiceY
);

invoiceY += 5;

// ------------------------------------------------------------
// DATE
// ------------------------------------------------------------

doc.text(
  `Date: ${invoiceDateText}`,
  rightX,
  invoiceY
);

invoiceY += 5;

// ------------------------------------------------------------
// TIME
// ------------------------------------------------------------

doc.text(
  `Time: ${invoiceTime}`,
  rightX,
  invoiceY
);

invoiceY += 4;



// ============================================================
// 36. LINE BEFORE TABLE
// ============================================================

doc.setLineWidth(0.3);

doc.line(
  leftMargin + 2,
  y,
  pageWidth - rightMargin - 2,
  y
);

y += 4;




    // ============================================================
    // 37. INVOICE DETAILS
    // ============================================================

    const invoiceDetails = Array.isArray(printData?.invdetail)
      ? printData.invdetail
      : [];

    // ============================================================
    // 38. PRODUCT TABLE DATA
    // ============================================================

    const tableData = invoiceDetails.map((item, index) => {
      const matchedProduct = Array.isArray(productOptions)
        ? productOptions.find(
            (option) => String(option?.value) === String(item?.ProductId),
          )
        : null;

      const productName =
        item?.ProductName ||
        item?.productName ||
        matchedProduct?.label ||
        "Unknown";

      const hsnSac =
        item?.HSNSAC ||
        item?.HsnSac ||
        item?.HSNCode ||
        item?.HsnCode ||
        item?.HSN ||
        item?.SAC ||
        item?.SACCode ||
        "";

      const quantity = Number(item?.Quantity || 0);

      const rate = Number(item?.Rate || 0);

      const amount = Number(item?.Amount || 0);

      return [
        index + 1,
        productName,
        hsnSac,
        quantity.toFixed(2),
        rate.toFixed(2),
        amount.toFixed(2),
      ];
    });

    // ============================================================
    // 39. PRODUCT TABLE
    // ============================================================

    autoTable(doc, {
      head: [["#", "Item", "HSN", "Qty", "Rate", "Amount"]],

      body:
        tableData.length > 0 ? tableData : [["", "No items", "", "", "", ""]],

      startY: y,

      margin: {
        left: 6,
        right: 6,
      },

      tableWidth: 68,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 5.2,
        cellPadding: 1,
        lineWidth: 0.2,
        textColor: 0,
        valign: "middle",
        overflow: "linebreak",
      },

      headStyles: {
        font: "helvetica",
        fontSize: 5.2,
        fontStyle: "bold",
        fillColor: [240, 240, 240],
        textColor: 0,
        halign: "center",
        valign: "middle",
      },

      columnStyles: {
        0: {
          cellWidth: 5,
          halign: "center",
        },

        1: {
          cellWidth: 25,
          halign: "left",
        },

        2: {
          cellWidth: 10,
          halign: "center",
        },

        3: {
          cellWidth: 8,
          halign: "right",
        },

        4: {
          cellWidth: 10,
          halign: "right",
        },

        5: {
          cellWidth: 10,
          halign: "right",
        },
      },
    });

    // ============================================================
    // 40. TOTAL QUANTITY
    // ============================================================

    const totalQuantity = invoiceDetails.reduce(
      (sum, item) => sum + Number(item?.Quantity || 0),
      0,
    );

    // ============================================================
    // 41. SUB TOTAL
    // ============================================================

    const subTotal = Number(printData?.SubTotal || 0);

    // ============================================================
    // 42. GRAND TOTAL
    // ============================================================

    const grandTotal = Number(printData?.Total || 0);

    // ============================================================
    // 43. RECEIVED
    // ============================================================

    const receivedAmount = Number(printData?.ReceivedAmount || 0);

    // ============================================================
    // 44. BALANCE
    // ============================================================

    const balance = Math.max(grandTotal - receivedAmount, 0);

    // ============================================================
    // 45. TOTAL ROW
    // ============================================================

    y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : y + 4;

    autoTable(doc, {
      body: [
        [
          "",
          "Total",
          "",
          totalQuantity.toFixed(2),
          "",
          `Rs. ${grandTotal.toFixed(2)}`,
        ],
      ],

      startY: y,

      margin: {
        left: 6,
        right: 6,
      },

      tableWidth: 68,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 5.3,
        cellPadding: 1,
        fontStyle: "bold",
        lineWidth: 0.2,
      },

      columnStyles: {
        0: {
          cellWidth: 5,
        },

        1: {
          cellWidth: 25,
        },

        2: {
          cellWidth: 10,
        },

        3: {
          cellWidth: 8,
          halign: "right",
        },

        4: {
          cellWidth: 10,
        },

        5: {
          cellWidth: 10,
          halign: "right",
        },
      },
    });

    // ============================================================
    // 46. NUMBER TO WORDS
    // ============================================================

    const numberToWords = (num) => {
      const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];

      const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];

      const convertBelowThousand = (number) => {
        let result = "";

        if (number >= 100) {
          result += ones[Math.floor(number / 100)] + " Hundred ";

          number %= 100;
        }

        if (number >= 20) {
          result += tens[Math.floor(number / 10)] + " ";

          number %= 10;
        }

        if (number > 0) {
          result += ones[number] + " ";
        }

        return result.trim();
      };

      if (num === 0) {
        return "Zero";
      }

      num = Math.floor(num);

      let result = "";

      if (num >= 10000000) {
        result += convertBelowThousand(Math.floor(num / 10000000)) + " Crore ";

        num %= 10000000;
      }

      if (num >= 100000) {
        result += convertBelowThousand(Math.floor(num / 100000)) + " Lakh ";

        num %= 100000;
      }

      if (num >= 1000) {
        result += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";

        num %= 1000;
      }

      if (num > 0) {
        result += convertBelowThousand(num);
      }

      return result.trim();
    };

    // ============================================================
    // 47. AMOUNT IN WORDS
    // ============================================================

    const amountInWords = `${numberToWords(grandTotal)} Rupees only`;

    // ============================================================
    // 48. SUMMARY TABLE
    // ============================================================

    y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : y + 4;

    autoTable(doc, {
      body: [
        [
          {
            content: "Invoice Amount In Words",
            styles: {
              fontStyle: "bold",
            },
          },

          {
            content: "Sub Total",
            styles: {
              fontStyle: "bold",
            },
          },

          `Rs. ${subTotal.toFixed(2)}`,
        ],

        [amountInWords, "Total", `Rs. ${grandTotal.toFixed(2)}`],

        ["", "Received", `Rs. ${receivedAmount.toFixed(2)}`],

        ["", "Balance", `Rs. ${balance.toFixed(2)}`],
      ],

      startY: y,

      margin: {
        left: 6,
        right: 6,
      },

      tableWidth: 68,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 5.3,
        cellPadding: 1.5,
        lineWidth: 0.2,
        valign: "middle",
        overflow: "linebreak",
      },

      columnStyles: {
        0: {
          cellWidth: 39,
        },

        1: {
          cellWidth: 14,
          fontStyle: "bold",
        },

        2: {
          cellWidth: 15,
          halign: "right",
        },
      },
    });

    // ============================================================
    // 49. TERMS
    // ============================================================

    y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 5 : y + 5;

    doc.setFont("helvetica", "bold");

    doc.setFontSize(6.5);

    doc.text("Terms And Conditions", 6, y);

    y += 3.5;

    doc.setFont("helvetica", "normal");

    doc.setFontSize(5.5);

    doc.text("Thanks for doing business with us!", 6, y);

    y += 7;

    // ============================================================
    // 50. AUTHORIZED SIGNATORY
    // ============================================================

    doc.setFontSize(6);

    doc.text("For: AMRUT MILK PRODUCTS 2", pageWidth / 2, y, {
      align: "center",
    });

    y += 9;

    doc.line(pageWidth / 2 - 15, y, pageWidth / 2 + 15, y);

    y += 3.5;

    doc.setFont("helvetica", "bold");

    doc.text("Authorized Signatory", pageWidth / 2, y, {
      align: "center",
    });

    // ============================================================
    // 51. PRINT PDF - 80MM ROLL
    // ============================================================

    try {
      // ----------------------------------------------------------
      // IMPORTANT:
      // Mark PDF for printing.
      // This keeps the PDF itself available for Download.
      // ----------------------------------------------------------

      if (typeof doc.autoPrint === "function") {
        doc.autoPrint();
      }

      // ----------------------------------------------------------
      // Create PDF Blob
      // ----------------------------------------------------------

      const pdfBlob = doc.output("blob");

      // ----------------------------------------------------------
      // Create temporary PDF URL
      // ----------------------------------------------------------

      const pdfBlobUrl = URL.createObjectURL(pdfBlob);

      console.log("========================================");
      console.log("80MM ROLL PDF CREATED");
      console.log("PDF URL:", pdfBlobUrl);
      console.log("========================================");

      // ----------------------------------------------------------
      // OPEN DIRECT PDF
      //
      // IMPORTANT:
      // We are NOT using iframe now.
      // Therefore Chrome PDF Viewer will show its normal
      // Download and Print buttons.
      // ----------------------------------------------------------

      if (printWindow && !printWindow.closed) {
        printWindow.location.href = pdfBlobUrl;

        printWindow.focus();
      } else {
        const newPrintWindow = window.open(pdfBlobUrl, "_blank");

        if (!newPrintWindow) {
          toast.error("Please allow popups for printing.");

          URL.revokeObjectURL(pdfBlobUrl);

          return;
        }

        newPrintWindow.focus();
      }

      // ----------------------------------------------------------
      // DO NOT USE:
      //
      // doc.save(...)
      //
      // because that would automatically download the PDF.
      //
      // Chrome PDF Viewer Download button will remain available.
      // ----------------------------------------------------------

      // Keep Blob URL alive for enough time for the PDF viewer.
      setTimeout(() => {
        URL.revokeObjectURL(pdfBlobUrl);
      }, 60000);
    } catch (error) {
      console.error("Error generating invoice PDF:", error);

      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }

      toast.error("Unable to generate invoice PDF.");
    }
  };

  return (
    <Box>
      <Box textAlign={"center"}>
        <Typography color="var(--complementary-color)" variant="h4">
          <b>Sales Entry</b>
        </Typography>
      </Box>
      <Box
        sx={{
          //  background: 'rgb(236, 253, 230)',
          p: 5,
          height: "auto",
        }}
      >
       <Box sx={{ display: "flex", gap: 3 }}>
  <Button
    sx={{ background: "var(--complementary-color)" }}
    variant="contained"
    onClick={handleNewClick}
  >
    Create Sales Entry
  </Button>
</Box>

{/* =========================
    INVOICE FILTERS
========================= */}
<Box
  sx={{
    display: "flex",
    gap: 2,
    alignItems: "center",
    flexWrap: "wrap",
    mt: 2,
    mb: 2,
  }}
>
  {/* SEARCH */}
  <TextField
    size="small"
    label="Search"
    placeholder="Bill No / Customer / Category"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    sx={{ minWidth: 250 }}
  />

  {/* FROM DATE */}
  <TextField
    size="small"
    type="date"
    label="From Date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    InputLabelProps={{
      shrink: true,
    }}
    sx={{ minWidth: 160 }}
  />

  {/* TO DATE */}
  <TextField
    size="small"
    type="date"
    label="To Date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    InputLabelProps={{
      shrink: true,
    }}
    sx={{ minWidth: 160 }}
  />

  {/* CATEGORY */}
  <TextField
    select
    size="small"
    label="Category"
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    sx={{ minWidth: 160 }}
  >
    <MenuItem value="">All</MenuItem>
    <MenuItem value="R">Retailer</MenuItem>
    <MenuItem value="D">Dealer</MenuItem>
    <MenuItem value="C">Caterers</MenuItem>
  </TextField>

  {/* CLEAR */}
  <Button
    variant="outlined"
    size="small"
    onClick={() => {
      setSearchText("");
      setFromDate("");
      setToDate("");
      setCategoryFilter("");
    }}
  >
    Clear
  </Button>
</Box>
       <MaterialReactTable
  columns={columns}
  data={filteredInvoiceData}
  enablePagination={false}
  muiTableHeadCellProps={{
    sx: {
      backgroundColor: "#E9ECEF",
      color: "black",
      fontSize: "16px",
    },
  }}
/>

        
        {/* ///for preview///////// */}.
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          //   style: { cursor: 'pointer' },
          // })}
         
        />

        
        {/* ///for preview///////// */}.
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="xlg"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              {/* <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} /> */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#0B5E20",
                }}
              >
                Welcome To Amrut Dairy
              </Typography>
            </Box>
            {/* <Typography sx={{ mt: 1 }}>
              Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
            </Typography> */}

            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              Sales Preview
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box>
              {previewData ? (
                <Box>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    gap={2}
                  >
                    <Typography>
                      <strong>Invoice No:</strong> {previewData.InvoiceNo}
                    </Typography>
                    <Typography>
                      <strong>Invoice Date:</strong>{" "}
                     {previewData?.InvoiceDate?.date
  ? new Date(
      previewData.InvoiceDate.date
    ).toLocaleDateString()
  : previewData?.InvoiceDate
    ? new Date(
        previewData.InvoiceDate
      ).toLocaleDateString()
    : "-"}
                    </Typography>
                  </Box>

                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    gap={2}
                    mt={2}
                  >
                    <Box>
                      <Typography>
                        <strong>Order No:</strong> {previewData.OrderNo}
                      </Typography>
                    </Box>
                    <Box>
    {/* <Typography>
  <strong>Order Date:</strong>{" "}
  {(() => {
    const orderDateValue = previewData?.OrderDate;

    if (!orderDateValue) {
      return "-";
    }

    const dateValue =
      typeof orderDateValue === "object"
        ? orderDateValue?.date
        : orderDateValue;

    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString();
  })()}
</Typography> */}
                    </Box>
                    <Box>
                      <Typography>
                        <strong>Customer Name:</strong>{" "}
                        {previewData.accountDetails?.AccountName || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>
                        <strong>Contact No:</strong> {previewData.ContactNo}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2 }} />

                  {/* ////////// */}

                  <Grid container spacing={2}>
                    {/* =====================================================
      SALES DETAILS - FULL WIDTH
  ====================================================== */}

                    <Grid item xs={12} md={12}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        mt={1}
                      >
                        Sales Details
                      </Typography>

                      <TableContainer
                        component={Paper}
                        elevation={2}
                        sx={{
                          width: "100%",
                          mt: 1,
                        }}
                      >
                        <Table size="small">
                          <TableHead
                            sx={{
                              backgroundColor: "#f5f5f5",
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <strong>Material</strong>
                              </TableCell>

                              <TableCell>
                                <strong>Quantity (Lit)</strong>
                              </TableCell>

                              <TableCell>
                                <strong>Rate</strong>
                              </TableCell>

                              <TableCell>
                                <strong>Discount</strong>
                              </TableCell>

                              <TableCell>
                                <strong>Amount (Rs)</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {previewData.invdetail.map((item, index) => {
                              const materialName =
                                productOptions.find(
                                  (opt) =>
                                    opt.value.toString() ===
                                    item.ProductId?.toString(),
                                )?.label || "Unknown";

                              return (
                                <TableRow key={index}>
                                  <TableCell>{materialName}</TableCell>

                                  <TableCell>{item.Quantity}</TableCell>

                                  <TableCell>{item.Rate}</TableCell>

                                  <TableCell>{item.DiscountAmt || 0}</TableCell>

                                  <TableCell>{item.Amount}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* =====================================================
        PAYMENT MODE + TRANSPORT
    ====================================================== */}

                      <TableContainer
                        component={Paper}
                        elevation={1}
                        sx={{
                          width: "100%",
                          mt: 2,
                        }}
                      >
                        <Table size="small">
                          <TableHead
                            sx={{
                              backgroundColor: "#f5f5f5",
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <strong>Payment Mode</strong>
                              </TableCell>

                              <TableCell>
                                <strong>Transport Charge</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {previewData.PaymentMode || "-"}
                              </TableCell>

                              <TableCell>
                                ₹{" "}
                                {Number(previewData.Transport || 0).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    {/* =====================================================
      AMOUNT SUMMARY - FULL WIDTH
  ====================================================== */}

                    <Grid item xs={12} md={12}>
                      <Box
                        sx={{
                          width: "100%",
                          mt: 1,
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          boxShadow: 2,
                          p: 1.5,
                        }}
                      >
                        {/* TITLE */}

                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            color: "#1976d2",
                            mb: 1,
                          }}
                        >
                          Amount Summary
                        </Typography>

                        {/* =================================================
          ROW 1
      ================================================== */}
                        <Grid container spacing={1.5}>
                          {/* SUBTOTAL */}

                          <Grid item xs={12} sm={6} md={3}>
                            <Box
                              sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                                px: 1.5,
                                py: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <Typography fontWeight={600}>Subtotal</Typography>

                              <Typography fontWeight={600}>
                                ₹ {Number(previewData.SubTotal || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* DISCOUNT */}

                          <Grid item xs={12} sm={6} md={3}>
                            <Box
                              sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                                px: 1.5,
                                py: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <Typography fontWeight={600}>Discount</Typography>

                              <Typography fontWeight={600}>
                                ₹ {Number(previewData.Discount || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* TRANSPORT */}

                          <Grid item xs={12} sm={6} md={3}>
                            <Box
                              sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                                px: 1.5,
                                py: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <Typography fontWeight={600}>
                                Transport
                              </Typography>

                              <Typography fontWeight={600}>
                                ₹{" "}
                                {Number(previewData.Transport || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* GRAND TOTAL */}

                          <Grid item xs={12} sm={6} md={3}>
                            <Box
                              sx={{
                                border: "1px solid #90caf9",
                                backgroundColor: "#e3f2fd",
                                borderRadius: 1,
                                px: 1.5,
                                py: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <Typography fontWeight={600}>
                                Grand Total
                              </Typography>

                              <Typography
                                fontWeight={700}
                                sx={{
                                  color: "#1976d2",
                                  fontSize: "1.1rem",
                                }}
                              >
                                ₹ {Number(previewData.Total || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

 {/* RECEIVED AMOUNT */}
<Grid item xs={12} sm={6} md={3}>
  <Box
    sx={{
      border: "1px solid #e0e0e0",
      borderRadius: 1,
      px: 1.5,
      py: 1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: "62px",
      height: "auto",
    }}
  >
    <Typography fontWeight={600}>
      Received Amount
    </Typography>

    <Typography fontWeight={600}>
      ₹{" "}
      {Number(
        previewData?.ReceivedAmount ??
          previewData?.ReceivedAmt ??
          previewData?.Received ??
          previewData?.receivedAmount ??
          0
      ).toFixed(2)}
    </Typography>
  </Box>
</Grid>

                        {/* =================================================
          BALANCE DUE / REFUND
      ================================================== */}

                        <Box
                          sx={{
                            mt: 1,
                            px: 2,
                            py: 1,
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: refund >= 0 ? "#81c784" : "#ef9a9a",
                            backgroundColor:
                              refund >= 0 ? "#e8f5e9" : "#ffebee",

                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 20,
                              color: refund >= 0 ? "green" : "#d32f2f",
                            }}
                          >
                            ₹ {Math.abs(refund).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Typography>No data to preview</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => generatePDF(previewData)} color="primary">
              <PrintIcon sx={{ fontSize: 35 }} />
            </Button>
            <Button
              variant="contained"
              onClick={() => setPreviewOpen(false)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

       {/* ==========================================
            DELETE CONFIRMATION DIALOG
        ========================================== */}

        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>
            Confirm Deletion
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Sales Entry?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: "100vw",
              maxWidth: "100vw",
              height: "100vh",
              borderRadius: 0,
              zIndex: 1000,
              overflow: "hidden",
            },
          }}
        >
          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <Box
            sx={{
              height: "68px",
              minHeight: "68px",
              padding: "8px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgb(236, 253, 230)",
              boxSizing: "border-box",
            }}
          >
            {/* LEFT SIDE */}
            <Typography
              fontWeight="bold"
              variant="h6"
              sx={{
                m: 0,
                fontSize: "22px",
              }}
            >
              {isEditing
                ? "Update Sales Entry - Regular"
                : "Create Sales Entry - Regular"}
            </Typography>

            {/* RIGHT SIDE */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              {/* TOTAL */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#555",
                  }}
                >
                  TOTAL :
                </Typography>

                <Typography
                  sx={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#1976d2",
                    lineHeight: 1,
                  }}
                >
                  ₹ {Number(total || 0).toFixed(2)}
                </Typography>
              </Box>

              {/* REFUND */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#555",
                  }}
                >
                  REFUND :
                </Typography>

                <Typography
                  sx={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#087f23",
                    lineHeight: 1,
                  }}
                >
                  ₹ {Number(refund || 0).toFixed(2)}
                </Typography>
              </Box>

              {/* CLOSE */}
              <CloseIcon
                sx={{
                  cursor: "pointer",
                  fontSize: 28,
                }}
                onClick={handleDrawerClose}
              />
            </Box>
          </Box>

          <Divider />

          {/* ===================================================== */}
          {/* MAIN FORM */}
          {/* ===================================================== */}

          <Box
            sx={{
              height: "calc(100vh - 69px)",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
              boxSizing: "border-box",
              p: 1,
            }}
          >
            {/* ===================================================== */}
            {/* INVOICE / CUSTOMER DETAILS */}
            {/* ===================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
                minHeight: "62px",
              }}
            >
              {/* INVOICE NO */}
              <Box flex={1}>
                <Typography variant="body2">Invoice No</Typography>

                <TextField
                  variant="standard"
                  value={invoiceNo}
                  size="small"
                  margin="none"
                  placeholder="Invoice No Autogerated"
                  fullWidth
                  sx={{
                    mt: 0.5,
                    "& .MuiInput-underline:after": {
                      borderBottomWidth: 1.5,
                      borderBottomColor: "#44ad74",
                    },
                  }}
                  focused
                />
              </Box>

              {/* DEVICE */}
              <Box flex={1}>
                <Typography variant="body2">Device</Typography>

                <TextField
                  variant="standard"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Box>

              {/* INVOICE DATE */}
              <Box flex={1}>
                <Typography variant="body2">Invoice Date</Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={invoiceDate ? new Date(invoiceDate) : null}
                    format="dd-MM-yyyy"
                    onChange={(newValue) => {
                      setInvoiceDate(newValue);
                      setErrors({
                        ...errors,
                        invoiceDate: undefined,
                      });
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!errors.invoiceDate,
                        helperText: errors.invoiceDate,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            {/* ===================================================== */}
            {/* CUSTOMER / CONTACT */}
            {/* ===================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                minHeight: "62px",
              }}
            >
              {/* CUSTOMER */}
              <Box flex={1} position="relative">
                <Typography variant="body2">Customer</Typography>

                <TextField
                  fullWidth
                  variant="standard"
                  size="small"
                  value={
                    selectedAccount
                      ? accountOptions.find(
                          ({ Id }) => String(Id) === String(selectedAccount),
                        )?.AccountName || ""
                      : ""
                  }
                  placeholder="Customer"
                  InputProps={{
                    readOnly: true,
                  }}
                  error={!!errors.selectedAccount}
                  helperText={errors.selectedAccount}
                  sx={{
                    mt: 0.5,
                    "& .MuiInput-underline:before": {
                      borderBottomWidth: 1.5,
                      borderBottomColor: "#44ad74",
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              {/* CONTACT */}
              <Box flex={1}>
                <Typography variant="body2">Contact Number</Typography>

                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "38px",
                    fontSize: "15px",
                    borderRadius: "5px",
                  }}
                  buttonStyle={{
                    borderRadius: "5px",
                  }}
                />
              </Box>
            </Box>

            {/* ===================================================== */}
            {/* CONTENT AREA */}
            {/* ===================================================== */}

            <Grid
              container
              spacing={1}
              sx={{
                width: "100%",
                m: 0,
                alignItems: "flex-start",
              }}
            >
              {/* ================================================= */}
              {/* PRODUCT DETAILS - FULL WIDTH */}
              {/* ================================================= */}

              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  width: "100%",
                  minWidth: 0,
                }}
              >
                {/* PRODUCT */}
                <Paper
                  elevation={2}
                  sx={{
                    width: "100%",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: "18px",
                      }}
                    >
                      Product Details
                    </Typography>

                    <Grid container spacing={1} alignItems="center">
                      {/* ================================================= */}
                      {/* KEEP YOUR EXISTING PRODUCT INPUT CODE HERE */}
                      {/* ================================================= */}
                    </Grid>
                  </Box>

                  {/* PRODUCT TABLE */}

                  <TableContainer
                    sx={{
                      width: "100%",
                      overflow: "hidden",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <Table
                      size="small"
                      sx={{
                        width: "100%",
                        tableLayout: "fixed",
                      }}
                    >
                      <TableHead
                        sx={{
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Sr.No
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Product
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Quantity
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Rate
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Amount
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow key={row.Id || `row-${index}`} hover>
                            <TableCell>{index + 1}</TableCell>

                            <TableCell>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                              >
                                {row.ProductName || "-"}
                              </Typography>
                            </TableCell>

                            <TableCell align="center">
                              <TextField
                                variant="standard"
                                type="number"
                                value={row.Quantity ?? ""}
                                onChange={(e) => {
                                  const updatedRows = [...rows];

                                  const qty = parseFloat(e.target.value) || 0;

                                  const currentRate =
                                    parseFloat(updatedRows[index].Rate) || 0;

                                  const amount = qty * currentRate;

                                  updatedRows[index] = {
                                    ...updatedRows[index],
                                    Quantity: qty,
                                    Amount: amount,
                                  };

                                  setRows(updatedRows);
                                }}
                                sx={{
                                  width: 70,
                                }}
                                inputProps={{
                                  min: 0,
                                }}
                              />
                            </TableCell>

                          <TableCell align="right">
  <TextField
    variant="standard"
    type="number"
    value={row.Rate ?? ""}
    onChange={(e) => {
      const updatedRows = [...rows];

      const value = e.target.value;

      const currentRate =
        value === "" ? "" : parseFloat(value) || 0;

      const currentQty =
        parseFloat(updatedRows[index].Quantity) || 0;

      const amount =
        value === ""
          ? 0
          : currentQty * (parseFloat(value) || 0);

      updatedRows[index] = {
        ...updatedRows[index],
        Rate: currentRate,
        Amount: amount,
      };

      setRows(updatedRows);
    }}
    sx={{
      width: 90,
    }}
    inputProps={{
      min: 0,
    }}
  />
</TableCell>

                            <TableCell align="right">
                              ₹ {Number(row.Amount || 0).toFixed(2)}
                            </TableCell>

                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.5,
                                  justifyContent: "center",
                                }}
                              >
    <Button
  size="small"
  variant="outlined"
onClick={() => {
  console.log("EDIT BUTTON INDEX:", index);
  console.log("EDIT BUTTON ROW:", row);
  handleEditRow(index);
}}
>
  Edit
</Button>

                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDeleteRow(index)}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* ================================================= */}
                        {/* NEW PRODUCT ENTRY ROW */}
                        {/* ================================================= */}

                        <TableRow>
                          <TableCell>{rows.length + 1}</TableCell>

                          <TableCell>
                            <Autocomplete
                              options={productOptions}
                              value={
                                productOptions.find(
                                  (option) =>
                                    String(option.value) ===
                                    String(selectedProductID),
                                ) || null
                              }
                              getOptionLabel={(option) => option?.label || ""}
                              isOptionEqualToValue={(option, value) =>
                                String(option.value) === String(value?.value)
                              }
                              renderOption={(props, option) => (
                                <li {...props} key={String(option.value)}>
                                  {option.label}
                                </li>
                              )}
                              slotProps={{
                                popper: {
                                  sx: {
                                    width: "460px !important",
                                  },
                                },

                                paper: {
                                  sx: {
                                    width: "100%",
                                    height: "auto !important",
                                    minHeight: "0 !important",
                                    overflow: "hidden",
                                  },
                                },

                                listbox: {
                                  sx: {
                                    height: "auto !important",
                                    minHeight: "0 !important",
                                    maxHeight: "320px",
                                    paddingTop: "0 !important",
                                    paddingBottom: "0 !important",
                                    margin: 0,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                  },
                                },
                              }}
                              open={productDropdownOpen}
                              onOpen={() => {
                                setProductDropdownOpen(true);
                              }}
                              onClose={() => {
                                setProductDropdownOpen(false);
                              }}
                              onChange={(event, newValue) => {
                                handleItemChange(newValue);

                                if (newValue) {
                                  setProductDropdownOpen(false);

                                  setTimeout(() => {
                                    quantityRef.current?.focus();
                                    quantityRef.current?.select();
                                  }, 100);
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputRef={productRef}
                                  variant="standard"
                                  placeholder="Select Product"
                                  size="small"
                                  fullWidth
                                  onKeyDown={(event) => {
                                    handleProductSelectKeyDown(event);
                                  }}
                                />
                              )}
                            />
                          </TableCell>

                        <TableCell align="center">
  <TextField
    variant="standard"
    type="number"
    value={quantity}
    onChange={handleQuantityChange}
    onKeyDown={(event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // Quantity validation
      if (
        quantity === "" ||
        Number(quantity) <= 0
      ) {
        toast.error("Please enter quantity.");

        quantityRef.current?.focus();
        quantityRef.current?.select();

        return;
      }

      // Existing row Edit OR New row Add
      handleSaveOrAddRow();
    }}
    inputRef={quantityRef}
    sx={{
      width: 70,
    }}
    inputProps={{
      min: 0,
    }}
  />
</TableCell>

                          <TextField
    variant="standard"
    type="number"
    value={rate}
    onChange={handleRateChange}
    inputRef={rateRef}
    sx={{ width: 90 }}
    inputProps={{
      min: 0,
    }}
  />

                          <TableCell align="right">
                            ₹{" "}
                            {(
                              (parseFloat(quantity) || 0) *
                              (parseFloat(rate) || 0)
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell align="center">
                            <Typography
                              sx={{
                                color: "#999",
                                fontSize: 13,
                              }}
                            >
                              New
                            </Typography>
                          </TableCell>
                        </TableRow>

                        {/* ERROR */}

                        {errors.rows && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              sx={{
                                borderBottom: "none",
                                py: 0.5,
                              }}
                            >
                              <Typography
                                color="error"
                                sx={{
                                  fontSize: 13,
                                }}
                              >
                                {errors.rows}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {errors.rows && (
                    <Typography
                      color="error"
                      sx={{
                        px: 1,
                        py: 0.5,
                        fontSize: 13,
                      }}
                    >
                      {errors.rows}
                    </Typography>
                  )}
                </Paper>

                {/* ================================================= */}
                {/* PAYMENT + TRANSPORT */}
                {/* ================================================= */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {/* PAYMENT MODE */}

                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Payment Mode
                    </Typography>
                    <TextField
                      select
                      variant="standard"
                      name="paymentMode"
                      value={paymentMode || ""}
                      onChange={(e) => {
                        const mode = e.target.value;

                        setPaymentMode(mode);
                        setReceivedAmount("");

                        if (mode !== "M") {
                          setCashAmount("");
                          setOnlineAmount("");
                        }

                        setErrors({
                          ...errors,
                          paymentMode: "",
                        });

                        // Payment Mode select केल्यावर Discount वर जा
                        if (mode) {
                          setTimeout(() => {
                            discountRef.current?.focus();
                            discountRef.current?.select();
                          }, 100);
                        }
                      }}
                      onKeyDown={(e) => {
                        // ENTER = पुढे Discount
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();

                          if (!paymentMode) {
                            toast.error("Please select payment mode.");
                            return;
                          }

                          setTimeout(() => {
                            discountRef.current?.focus();
                            discountRef.current?.select();
                          }, 100);

                          return;
                        }

                        // ESC = मागे Quantity
                        if (e.key === "Escape") {
                          e.preventDefault();
                          e.stopPropagation();

                          setTimeout(() => {
                            quantityRef.current?.focus();
                            quantityRef.current?.select();
                          }, 100);

                          return;
                        }
                      }}
                      fullWidth
                      error={!!errors.paymentMode}
                      helperText={errors.paymentMode}
                    >
                      <MenuItem value="">Select Payment Mode</MenuItem>

                      <MenuItem value="C">Cash</MenuItem>

                      <MenuItem value="O">Online</MenuItem>

                      <MenuItem value="M">Mix</MenuItem>
                    </TextField>
                  </Box>

                  {/* TRANSPORT */}

                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Transport
                    </Typography>

                    <TextField
                      variant="standard"
                      value={transport}
                      onChange={(e) => setTransport(e.target.value)}
                      placeholder="Transport"
                      fullWidth
                      type="number"
                    />
                  </Box>
                </Box>

                {/* ================================================= */}
                {/* MIX PAYMENT */}
                {/* ================================================= */}

                {paymentMode === "M" && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      Mix Payment
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <TextField
                        label="Cash Amount"
                        type="number"
                        value={cashAmount}
                        onChange={handleCashAmountChange}
                        size="small"
                        fullWidth
                        inputProps={{
                          min: 0,
                        }}
                      />

                      <TextField
                        label="Online Amount"
                        type="number"
                        value={onlineAmount}
                        onChange={handleOnlineAmountChange}
                        size="small"
                        fullWidth
                        inputProps={{
                          min: 0,
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Grid>

              {/* ================================================= */}
              {/* AMOUNT SUMMARY - FULL WIDTH BELOW PAYMENT */}
              {/* ================================================= */}

              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    width: "100%",
                    p: 2,
                    mt: 1,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: "22px",
                    }}
                  >
                    Amount Summary
                  </Typography>

                  {/* ================================================= */}
                  {/* SUMMARY FIRST ROW */}
                  {/* ================================================= */}

                  <Grid container spacing={2} alignItems="center">
                    {/* SUBTOTAL */}

                    <Grid item xs={12} sm={6} md={3}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          Subtotal
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: 700,
                          }}
                        >
                          ₹ {Number(subTotalcal || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* DISCOUNT */}

                    <Grid item xs={12} sm={6} md={3}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          Discount
                        </Typography>

                        <TextField
                          inputRef={discountRef}
                          size="small"
                          type="number"
                          value={discount}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value === "" || Number(value) >= 0) {
                              setDiscount(value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.stopPropagation();

                              setTimeout(() => {
                                receivedAmountRef.current?.focus();
                                receivedAmountRef.current?.select();
                              }, 50);
                            }
                          }}
                          placeholder="0.00"
                          sx={{
                            width: 120,
                            "& input": {
                              textAlign: "right",
                              fontSize: "15px",
                            },
                          }}
                          inputProps={{
                            min: 0,
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* TOTAL */}

                    <Grid item xs={12} sm={6} md={3}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: 700,
                          }}
                        >
                          Total
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "25px",
                            fontWeight: 800,
                            color: "#1976d2",
                          }}
                        >
                          ₹ {Number(total || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* RECEIVED */}

                    <Grid item xs={12} sm={6} md={3}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          Received Amount
                        </Typography>

                       <TextField
  inputRef={receivedAmountRef}
  size="small"
  type="number"
  value={receivedAmount}
  onChange={handleReceivedAmountChange}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      // ==================================================
      // ENTER PRESS
      // Do not block amount greater than total here.
      // Save / Print validation is handled in handleSubmit.
      // ==================================================

      const receivedValue =
        receivedAmount === ""
          ? NaN
          : parseFloat(receivedAmount);

      const totalValue =
        parseFloat(total) || 0;

      // Empty received amount
      if (
        receivedAmount === "" ||
        Number.isNaN(receivedValue)
      ) {
        toast.error(
          `Please enter received amount ₹${totalValue.toFixed(2)}`
        );

        receivedAmountRef.current?.focus();
        receivedAmountRef.current?.select();

        return;
      }

      // ==================================================
      // RECEIVED CAN BE GREATER THAN TOTAL
      // Example:
      // Total = 2000
      // Received = 3000
      // Refund = 1000
      //
      // It is allowed to TYPE.
      // Save / Print validation happens in handleSubmit.
      // ==================================================

      console.log(
        "Received Amount:",
        receivedValue
      );

      console.log(
        "Total Amount:",
        totalValue
      );

      if (receivedValue > totalValue) {
        console.log(
          "Refund Amount:",
          receivedValue - totalValue
        );
      }

      // ==================================================
      // MOVE TO NEXT FIELD
      // ==================================================

      if (discountRef?.current) {
        discountRef.current.focus();
        discountRef.current.select();
      }
    }
  }}
  placeholder="0.00"
  sx={{
    width: 120,
    "& input": {
      textAlign: "right",
      fontSize: "15px",
    },
  }}
  inputProps={{
    min: 0,
  }}
/>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* ================================================= */}
                  {/* PAYMENT STATUS - EXISTING LOGIC */}
                  {/* ================================================= */}

                  <Divider
                    sx={{
                      mt: 1.5,
                      mb: 1.5,
                    }}
                  />

                  {isPaid ? (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "#e8f5e9",
                        border: "1px solid #a5d6a7",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: 800,
                          color: "#087f23",
                        }}
                      >
                        Paid
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 800,
                          color: "#087f23",
                        }}
                      >
                        ₹ {Number(grandTotal || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  ) : received > grandTotal ? (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "#e8f5e9",
                        border: "1px solid #a5d6a7",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: 800,
                          color: "#087f23",
                        }}
                      >
                        Refund
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 800,
                          color: "#087f23",
                        }}
                      >
                        ₹ {(received - grandTotal).toFixed(2)}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "#ffebee",
                        border: "1px solid #ef9a9a",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: 800,
                          color: "#d32f2f",
                        }}
                      >
                        Balance Due
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 800,
                          color: "#d32f2f",
                        }}
                      >
                        ₹ {Math.max(grandTotal - received, 0).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* ===================================================== */}
            {/* BUTTONS */}
            {/* ===================================================== */}

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              sx={{
                mt: 1,
                minHeight: "48px",
              }}
            >
              {/* SAVE / UPDATE */}

              <Button
                sx={{
                  background: "var(--primary-color)",
                }}
                onClick={(e) => handleSubmit(e, false)}
                variant="contained"
              >
                {isEditing ? "Update" : "Save"}
              </Button>

              <Button
                sx={{
                  background: "var(--complementary-color)",
                }}
                onClick={(e) => handleSubmit(e, true)}
                variant="contained"
              >
                Print
              </Button>

              {/* CANCEL */}

              <Button
                sx={{
                  borderColor: "var(--complementary-color)",
                  color: "var(--complementary-color)",
                }}
                onClick={handleDrawerClose}
                variant="outlined"
              >
                <b>Cancel</b>
              </Button>

              {/* DELETE */}

              {isEditing && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpen}
                >
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default SalesEntry;