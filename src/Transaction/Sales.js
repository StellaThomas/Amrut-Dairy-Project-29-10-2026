
// import { useMemo, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   IconButton,
//   Menu,
//   Table,
//   Autocomplete,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   useMediaQuery,
//   Button,
//   Typography,
//   TextField,
//   Drawer,
//   Divider,
//   MenuItem,
//   InputAdornment,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   CircularProgress,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";

// import MinimizeIcon from "@mui/icons-material/Minimize";
// import { useTheme } from "@mui/material/styles";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import "react-phone-input-2/lib/style.css";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import PhoneInput from "react-phone-input-2";
// import axios from "axios";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import qs from "qs";
// import moment from "moment";
// import { MaterialReactTable } from "material-react-table";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SearchIcon from "@mui/icons-material/Search";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import Cookies from "js-cookie";
// import autoTable from "jspdf-autotable";
// import jsPDF from "jspdf";
// import PrintIcon from "@mui/icons-material/Print";
// import Tooltip from "@mui/material/Tooltip";
// import RemoveIcon from "@mui/icons-material/Remove";

// import amrutLogo from "../imgs/amrutlogo.png";
// import fremilaLogo from "../imgs/fremilalogo.png";

// const SalesEntry = () => {
//   const customerDropdownRef = useRef(null);
//   // =====================================================
//   // PREVENT MOUSE WHEEL FROM CHANGING NUMBER INPUT VALUE
//   // =====================================================
//   const preventNumberInputScroll = (event) => {
//     event.currentTarget.blur();
//   };

//   // =====================================================
//   // THIS SCREEN IS ONLY FOR REGULAR / RETAILER CUSTOMERS
//   // R = Regular / Retailer
//   // =====================================================
//   const PAGE_CUSTOMER_TYPE = "R";

//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [invoiceheaders, setInvoiceheaders] = useState([]);
//   const [invoicedetails, setInvoicedetails] = useState([]);
//   const [invoiceHistoryStatus, setInvoiceHistoryStatus] = useState({});
//   const [rows, setRows] = useState([]);

//   const [isSaving, setIsSaving] = useState(false);
//   const isSavingRef = useRef(false);

//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     }),
//   );

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(
//         new Date().toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//         }),
//       );
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const [productOptions, setProductOptions] = useState([]);

//   // =====================================================
//   // GET PRODUCT NAME FROM PRODUCT ID
//   // =====================================================
//   const getProductNameById = (productId) => {
//     if (productId === null || productId === undefined || productId === "") {
//       return "-";
//     }

//     const matchedProduct = productOptions.find((product) => {
//       return (
//         String(product?.value) === String(productId) ||
//         String(product?.Id) === String(productId) ||
//         String(product?.ProductId) === String(productId)
//       );
//     });

//     return matchedProduct?.label || matchedProduct?.ProductName || "-";
//   };

//   // =====================================================
//   // FORMAT HISTORY DATE SAFELY
//   // Handles API date object + string + null
//   // =====================================================
//   const formatHistoryDate = (value) => {
//     if (!value) {
//       return "-";
//     }

//     // API sometimes returns:
//     // { date: "...", timezone_type: 3, timezone: "..." }
//     if (typeof value === "object") {
//       value = value?.date || value?.Date || value?.value || "";
//     }

//     if (!value) {
//       return "-";
//     }

//     const parsed = moment(value);

//     if (!parsed.isValid()) {
//       return "-";
//     }

//     return parsed.format("DD/MM/YYYY");
//   };

//   // =====================================================
//   // INVOICE EDIT HISTORY
//   // =====================================================

//   const [historyOpen, setHistoryOpen] = useState(false);
//   const [historyLoading, setHistoryLoading] = useState(false);

//   const [selectedHistoryInvoice, setSelectedHistoryInvoice] = useState(null);

//   const [historyHeader, setHistoryHeader] = useState([]);
//   const [historyDetails, setHistoryDetails] = useState([]);

//   const [currentHistoryHeader, setCurrentHistoryHeader] = useState(null);

//   const [currentHistoryDetails, setCurrentHistoryDetails] = useState([]);

//   // NEW
//   const [selectedHistoryVersion, setSelectedHistoryVersion] = useState(null);

//   const [selectedHistoryDetails, setSelectedHistoryDetails] = useState([]);

//   const [newCustomerAddress, setNewCustomerAddress] = useState("");

//   const [minimizedBills, setMinimizedBills] = useState([]);

//   // =====================================================
//   // SELECT HISTORY VERSION
//   // =====================================================

//   const handleHistoryVersionClick = (historyItem) => {
//     if (!historyItem) {
//       return;
//     }

//     const version = Number(historyItem?.VersionNo);

//     if (!version) {
//       toast.error("Version not found.");
//       return;
//     }

//     // console.log("======================================");
//     // console.log("HISTORY VERSION CLICK");
//     // console.log("Invoice No:", historyItem?.InvoiceNo);
//     // console.log("Invoice ID:", historyItem?.InvoiceId);
//     // console.log("Version:", version);
//     // console.log("======================================");

//     // Selected version
//     setSelectedHistoryVersion(version);

//     // Find all product details belonging to this version
//     const versionDetails = historyDetails.filter(
//       (detail) => Number(detail?.VersionNo) === version,
//     );

//     // console.log("SELECTED VERSION DETAILS:", versionDetails);

//     setSelectedHistoryDetails(versionDetails);
//   };

//   const fetchCurrentInvoiceForHistory = async (invoiceId) => {
//     try {
//       // ==========================================
//       // CURRENT HEADER
//       // ==========================================
//       const headerResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
//       );

//       const headerData = headerResponse.data;

//       const currentHeader = Array.isArray(headerData)
//         ? headerData[0] || null
//         : Array.isArray(headerData?.data)
//           ? headerData.data[0] || null
//           : headerData?.data || headerData || null;

//       // ==========================================
//       // CURRENT DETAILS
//       // ==========================================
//       const detailResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const detailData = detailResponse.data;

//       const currentDetails = Array.isArray(detailData)
//         ? detailData
//         : Array.isArray(detailData?.data)
//           ? detailData.data
//           : detailData?.data
//             ? [detailData.data]
//             : detailData
//               ? [detailData]
//               : [];

//       setCurrentHistoryHeader(currentHeader);
//       setCurrentHistoryDetails(currentDetails);

//       return {
//         header: currentHeader,
//         details: currentDetails,
//       };
//     } catch (error) {
//       console.error("CURRENT INVOICE HISTORY FETCH ERROR:", error);

//       throw error;
//     }
//   };

//   const handleInvoiceHistoryClick = async (invoice) => {
//     try {
//       const invoiceId = invoice?.Id || invoice?.InvoiceId;

//       if (!invoiceId) {
//         toast.error("Invoice ID not found.");
//         return;
//       }

//       // console.log("======================================");
//       // console.log("INVOICE HISTORY CLICK");
//       // console.log("Invoice ID:", invoiceId);
//       // console.log("======================================");

//       setSelectedHistoryInvoice(invoice);
//       setHistoryOpen(true);
//       setHistoryLoading(true);
//       setSelectedHistoryVersion(null);
//       setSelectedHistoryDetails([]);

//       // =================================================
//       // 1. OLD HEADER HISTORY
//       // =================================================
//       const headerResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       // console.log("OLD HEADER HISTORY:", headerResponse.data);

//       const headerData = headerResponse.data;

//       const oldHeaders = Array.isArray(headerData)
//         ? headerData
//         : Array.isArray(headerData?.data)
//           ? headerData.data
//           : headerData?.data
//             ? [headerData.data]
//             : headerData
//               ? [headerData]
//               : [];

//       setHistoryHeader(oldHeaders);

//       // =================================================
//       // 2. OLD DETAIL HISTORY
//       // =================================================
//       const detailResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       // console.log("OLD DETAIL HISTORY:", detailResponse.data);

//       const detailData = detailResponse.data;

//       const oldDetails = Array.isArray(detailData)
//         ? detailData
//         : Array.isArray(detailData?.data)
//           ? detailData.data
//           : detailData?.data
//             ? [detailData.data]
//             : detailData
//               ? [detailData]
//               : [];

//       setHistoryDetails(oldDetails);

//       // =================================================
//       // 3. CURRENT INVOICE
//       // =================================================
//       await fetchCurrentInvoiceForHistory(invoiceId);

//       // =================================================
//       // DEFAULT PREVIOUS VERSION
//       // =================================================

//       if (oldHeaders.length > 0) {
//         const latestVersionItem = [...oldHeaders].sort(
//           (a, b) => Number(b?.VersionNo || 0) - Number(a?.VersionNo || 0),
//         )[0];

//         const latestVersion = Number(latestVersionItem?.VersionNo);

//         if (latestVersion) {
//           setSelectedHistoryVersion(latestVersion);

//           const latestVersionDetails = oldDetails.filter(
//             (detail) => Number(detail?.VersionNo) === latestVersion,
//           );

//           setSelectedHistoryDetails(latestVersionDetails);
//         }
//       }
//     } catch (error) {
//       console.error("INVOICE HISTORY ERROR:", error);

//       toast.error("Unable to load invoice history.");
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   const [searchText, setSearchText] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const getTodayDate = () => {
//     const today = new Date();

//     return (
//       today.getFullYear() +
//       "-" +
//       String(today.getMonth() + 1).padStart(2, "0") +
//       "-" +
//       String(today.getDate()).padStart(2, "0")
//     );
//   };

//   const [fromDate, setFromDate] = useState(getTodayDate());
//   const [toDate, setToDate] = useState(getTodayDate());

//   const [financialYearFromDate, setFinancialYearFromDate] = useState("");
//   const [financialYearToDate, setFinancialYearToDate] = useState("");

//   const filteredInvoiceData = useMemo(() => {
//     const search = searchText.trim().toLowerCase();

//     return invoiceheaders.filter((invoice) => {
//       // ==============================
//       // BILL NO
//       // ==============================
//       // ==============================
//       // BILL / INVOICE NO
//       // ==============================
//       const billNo = String(
//         invoice?.InvoiceNo ||
//           invoice?.InvoiceNumber ||
//           invoice?.BillNo ||
//           invoice?.BillNumber ||
//           invoice?.Id ||
//           "",
//       ).toLowerCase();

//       // ==============================
//       // CUSTOMER NAME
//       // ==============================
//       const customerName = String(
//         invoice?.accountDetails?.AccountName || "",
//       ).toLowerCase();

//       // ==============================
//       // CATEGORY
//       // ==============================
//       const accountId = Number(invoice?.AccountId || 0);

//       const customerType = String(
//         invoice?.addressDetails?.CustomerType ||
//           invoice?.addressDetails?.customerType ||
//           invoice?.accountDetails?.CustomerType ||
//           invoice?.accountDetails?.customerType ||
//           invoice?.CustomerType ||
//           invoice?.customerType ||
//           "",
//       )
//         .trim()
//         .toUpperCase();

//       // =====================================================
//       // SALES ENTRY = REGULAR
//       //
//       // AccountId = 0 → Regular
//       // CustomerType = R → Regular
//       // D/C → Not Regular
//       // =====================================================

//       const isRegular = accountId === 0 || customerType === "R";

//       if (!isRegular) {
//         return false;
//       }

//       let categoryName = "";

//       if (accountId === 0 || customerType === "R") {
//         categoryName = "regular";
//       } else if (customerType === "D") {
//         categoryName = "dealer";
//       } else if (customerType === "C") {
//         categoryName = "caterers";
//       }

//       // ==============================
//       // INVOICE DATE
//       // ==============================
//       const invoiceDate = invoice?.InvoiceDate?.date
//         ? invoice.InvoiceDate.date.substring(0, 10)
//         : "";

//       // ==============================
//       // CATEGORY FILTER
//       // ==============================
//       const categoryMatch =
//         categoryFilter === "" || customerType === categoryFilter;

//       // ==============================
//       // SEARCH FILTER
//       // ==============================
//       const searchMatch =
//         search === "" ||
//         billNo.includes(search) ||
//         customerName.includes(search) ||
//         categoryName.includes(search);

//       // ==============================
//       // FROM DATE FILTER
//       // ==============================
//       const fromDateMatch =
//         fromDate === "" || (invoiceDate !== "" && invoiceDate >= fromDate);

//       // ==============================
//       // TO DATE FILTER
//       // ==============================
//       const toDateMatch =
//         toDate === "" || (invoiceDate !== "" && invoiceDate <= toDate);

//       // ==============================
//       // ALL FILTERS MUST MATCH
//       // ==============================
//       return categoryMatch && searchMatch && fromDateMatch && toDateMatch;
//     });
//   }, [invoiceheaders, searchText, categoryFilter, fromDate, toDate]);

//   useEffect(() => {
//     // fetchInvdetails();
//   }, []);

//   useEffect(() => {
//     const handleSalesShortcut = (event) => {
//       // --------------------------------------------------
//       // Do not run shortcut while typing
//       // --------------------------------------------------

//       const tagName = event.target?.tagName?.toLowerCase();

//       const isTyping =
//         tagName === "input" ||
//         tagName === "textarea" ||
//         tagName === "select" ||
//         event.target?.isContentEditable;

//       if (isTyping) {
//         return;
//       }

//       // --------------------------------------------------
//       // Drawer open असेल तर keyboard shortcut बंद
//       // --------------------------------------------------

//       if (isDrawerOpen) {
//         return;
//       }

//       // --------------------------------------------------
//       // Ignore Ctrl / Alt / Windows combinations
//       // --------------------------------------------------

//       if (event.ctrlKey || event.altKey || event.metaKey) {
//         return;
//       }

//       // ==================================================
//       // R = REGULAR SALES ENTRY
//       // ==================================================

//       if (event.key?.toLowerCase() === "r") {
//         event.preventDefault();
//         event.stopPropagation();

//         // Open Regular Sales Entry
//         setIsDrawerOpen(true);

//         // Reset form for new bill
//         resetForm();
//         setIsEditing(false);
//         setOpen(false);

//         // Focus directly on Select Product
//         setTimeout(() => {
//           productRef.current?.focus();
//           setProductDropdownOpen(true);
//         }, 300);

//         return;
//       }

//       // ==================================================
//       // D = SALES DEALER
//       // ==================================================

//       if (event.key?.toLowerCase() === "d") {
//         event.preventDefault();
//         event.stopPropagation();

//         // console.log("D pressed - Opening Dealer Bill Entry");

//         navigate("/salesdealer", {
//           state: {
//             openCreateForm: true,
//           },
//         });

//         return;
//       }

//       // ==================================================
//       // C = SALES CATERERS
//       // ==================================================

//       if (event.key?.toLowerCase() === "c") {
//         event.preventDefault();
//         event.stopPropagation();

//         // console.log("C pressed - Opening Caterers Bill Entry");

//         navigate("/salescaterers", {
//           state: {
//             openCreateForm: true,
//           },
//         });

//         return;
//       }
//     };

//     window.addEventListener("keydown", handleSalesShortcut, true);

//     return () => {
//       window.removeEventListener("keydown", handleSalesShortcut, true);
//     };
//   }, [navigate, isDrawerOpen]);

//   // get of Invoice header
//   // get of Invoice header

//   const fetchInvoiceHeader = async (
//     selectedFromDate = fromDate,
//     selectedToDate = toDate,
//   ) => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     // 1. Format dates for API
//     const formatDateForAPI = (value) => {
//       if (!value) return "";

//       if (value instanceof Date) {
//         if (isNaN(value.getTime())) return "";

//         const year = value.getFullYear();
//         const month = String(value.getMonth() + 1).padStart(2, "0");
//         const day = String(value.getDate()).padStart(2, "0");

//         return `${year}-${month}-${day}`;
//       }

//       const str = String(value).trim();

//       if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
//         return str.substring(0, 10);
//       }

//       const dmyMatch = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);

//       if (dmyMatch) {
//         return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
//       }

//       const parsedDate = new Date(value);

//       if (isNaN(parsedDate.getTime())) return "";

//       const year = parsedDate.getFullYear();
//       const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
//       const day = String(parsedDate.getDate()).padStart(2, "0");

//       return `${year}-${month}-${day}`;
//     };

//     const formattedFromDate = formatDateForAPI(selectedFromDate);
//     const formattedToDate = formatDateForAPI(selectedToDate);

//     if (
//       !formattedFromDate ||
//       !formattedToDate ||
//       formattedFromDate > formattedToDate
//     ) {
//       console.warn("Invalid invoice date range:", {
//         formattedFromDate,
//         formattedToDate,
//       });

//       setInvoiceheaders([]);
//       return;
//     }

//     // 2. Normalize array responses
//     const getArrayData = (result) => {
//       if (Array.isArray(result)) return result;
//       if (Array.isArray(result?.data)) return result.data;
//       if (Array.isArray(result?.Data)) return result.Data;

//       return [];
//     };

//     // 3. Normalize single-record responses
//     const normalizeSingleRecord = (result) => {
//       if (Array.isArray(result)) return result[0] || null;
//       if (Array.isArray(result?.data)) return result.data[0] || null;
//       if (Array.isArray(result?.Data)) return result.Data[0] || null;

//       if (result?.data && typeof result.data === "object") {
//         return result.data;
//       }

//       if (result?.Data && typeof result.Data === "object") {
//         return result.Data;
//       }

//       return result && typeof result === "object" ? result : null;
//     };

//     // 4. Fetch JSON safely
//     const fetchJSON = async (url) => {
//       const response = await fetch(url, requestOptions);

//       if (!response.ok) {
//         throw new Error(
//           `API failed: ${response.status} ${response.statusText} - ${url}`,
//         );
//       }

//       return response.json();
//     };

//     try {
//       // 5. Generate date list
//       const getDateList = (startDate, endDate) => {
//         const dates = [];
//         const current = new Date(`${startDate}T00:00:00`);
//         const end = new Date(`${endDate}T00:00:00`);

//         while (!isNaN(current.getTime()) && current <= end) {
//           const year = current.getFullYear();
//           const month = String(current.getMonth() + 1).padStart(2, "0");
//           const day = String(current.getDate()).padStart(2, "0");

//           dates.push(`${year}-${month}-${day}`);
//           current.setDate(current.getDate() + 1);
//         }

//         return dates;
//       };

//       const selectedDates = getDateList(formattedFromDate, formattedToDate);

//       // 6. Fetch invoice pages for one date
//       const fetchInvoicesForDate = async (selectedDate) => {
//         const getPageUrl = (page) =>
//           `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}&InvoiceDate=${encodeURIComponent(selectedDate)}`;

//         const firstResult = await fetchJSON(getPageUrl(1));

//         const totalPages = Math.max(
//           1,
//           Number(
//             firstResult?.total_pages ??
//               firstResult?.TotalPages ??
//               firstResult?.pages ??
//               1,
//           ) || 1,
//         );

//         const invoices = [...getArrayData(firstResult)];

//         // Fetch remaining pages only when required
//         if (totalPages > 1) {
//           const pageResults = await Promise.all(
//             Array.from({ length: totalPages - 1 }, (_, index) => index + 2).map(
//               async (page) => {
//                 const result = await fetchJSON(getPageUrl(page));
//                 return getArrayData(result);
//               },
//             ),
//           );

//           pageResults.forEach((pageData) => {
//             invoices.push(...pageData);
//           });
//         }

//         return invoices;
//       };

//       // 7. Fetch dates in small batches
//       const allInvoiceData = [];
//       const DATE_BATCH_SIZE = 3;

//       for (
//         let index = 0;
//         index < selectedDates.length;
//         index += DATE_BATCH_SIZE
//       ) {
//         const dateBatch = selectedDates.slice(index, index + DATE_BATCH_SIZE);

//         const batchResults = await Promise.all(
//           dateBatch.map((date) => fetchInvoicesForDate(date)),
//         );

//         batchResults.forEach((invoices) => {
//           allInvoiceData.push(...invoices);
//         });
//       }

//       // 8. Remove duplicate invoices
//       const invoiceMap = new Map();

//       allInvoiceData.forEach((invoice) => {
//         if (invoice?.Id !== undefined && invoice?.Id !== null) {
//           invoiceMap.set(String(invoice.Id), invoice);
//         }
//       });

//       const uniqueInvoices = Array.from(invoiceMap.values());

//       // 9. Filter invoices by date range
//       const filteredInvoices = uniqueInvoices.filter((invoice) => {
//         let rawDate = invoice?.InvoiceDate;

//         if (rawDate && typeof rawDate === "object") {
//           rawDate = rawDate.date || rawDate.Date || "";
//         }

//         const invoiceDate = String(rawDate || "").substring(0, 10);

//         return (
//           invoiceDate >= formattedFromDate && invoiceDate <= formattedToDate
//         );
//       });

//       // 10. Get unique customer IDs
//       const accountIds = [
//         ...new Set(
//           filteredInvoices
//             .map((invoice) => Number(invoice?.AccountId || 0))
//             .filter((id) => Number.isFinite(id) && id > 0),
//         ),
//       ];

//       // 11. Fetch Account and Address details in batches
//       const accountCache = new Map();
//       const ACCOUNT_BATCH_SIZE = 5;

//       for (
//         let index = 0;
//         index < accountIds.length;
//         index += ACCOUNT_BATCH_SIZE
//       ) {
//         const accountBatch = accountIds.slice(
//           index,
//           index + ACCOUNT_BATCH_SIZE,
//         );

//         await Promise.all(
//           accountBatch.map(async (accountId) => {
//             const accountUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(accountId)}`;

//             const addressUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(accountId)}`;

//             const [accountResult, addressResult] = await Promise.allSettled([
//               fetchJSON(accountUrl),
//               fetchJSON(addressUrl),
//             ]);

//             const accountDetails =
//               accountResult.status === "fulfilled"
//                 ? normalizeSingleRecord(accountResult.value)
//                 : null;

//             const addressDetails =
//               addressResult.status === "fulfilled"
//                 ? normalizeSingleRecord(addressResult.value)
//                 : null;

//             if (accountResult.status === "rejected") {
//               console.error(
//                 `Account API failed for AccountId ${accountId}:`,
//                 accountResult.reason,
//               );
//             }

//             if (addressResult.status === "rejected") {
//               console.error(
//                 `Address API failed for AccountId ${accountId}:`,
//                 addressResult.reason,
//               );
//             }

//             accountCache.set(accountId, {
//               accountDetails,
//               addressDetails,
//             });
//           }),
//         );
//       }

//       // 12. Attach customer details
//       const invoicesWithDetails = filteredInvoices.map((invoice) => {
//         const accountId = Number(invoice?.AccountId || 0);
//         const cached = accountCache.get(accountId) || {};

//         const accountDetails = cached.accountDetails || {};
//         const addressDetails = cached.addressDetails || null;

//         const customerType = String(
//           addressDetails?.CustomerType ??
//             addressDetails?.customerType ??
//             accountDetails?.CustomerType ??
//             accountDetails?.customerType ??
//             invoice?.CustomerType ??
//             invoice?.customerType ??
//             "",
//         )
//           .trim()
//           .toUpperCase();

//         return {
//           ...invoice,
//           accountDetails: {
//             ...accountDetails,
//             CustomerType: customerType,
//           },
//           addressDetails,
//         };
//       });

//       // 13. Keep Regular / Retailer invoices only
//       const regularInvoices = invoicesWithDetails.filter((invoice) => {
//         const accountId = Number(invoice?.AccountId || 0);

//         const customerType = String(
//           invoice?.addressDetails?.CustomerType ??
//             invoice?.addressDetails?.customerType ??
//             invoice?.accountDetails?.CustomerType ??
//             invoice?.accountDetails?.customerType ??
//             invoice?.CustomerType ??
//             invoice?.customerType ??
//             "",
//         )
//           .trim()
//           .toUpperCase();

//         return accountId === 0 || customerType === "R";
//       });

//       // 14. Update invoice table
//       setInvoiceheaders(regularInvoices);

//       // IMPORTANT:
//       // Do not call checkInvoiceHistory(regularInvoices) here.
//       // This avoids automatically starting per-invoice history GET requests.
//       // History status will not be automatically refreshed by this function.
//     } catch (error) {
//       console.error("Error fetching invoice headers:", error);
//       toast.error("Unable to refresh invoice list.");

//       // Avoid clearing the existing table if a refresh request fails.
//     }
//   };

//   const checkInvoiceHistory = async (invoiceList) => {
//     try {
//       const historyStatus = {};

//       await Promise.all(
//         invoiceList.map(async (invoice) => {
//           const invoiceId = invoice?.Id;

//           if (!invoiceId) {
//             return;
//           }

//           try {
//             const response = await axios.get(
//               `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//             );

//             const data = response.data;

//             const historyList = Array.isArray(data)
//               ? data
//               : Array.isArray(data?.data)
//                 ? data.data
//                 : data?.data
//                   ? [data.data]
//                   : data
//                     ? [data]
//                     : [];

//             historyStatus[invoiceId] = historyList.length > 0;
//           } catch (error) {
//             console.error(
//               `History check failed for InvoiceId ${invoiceId}:`,
//               error,
//             );

//             historyStatus[invoiceId] = false;
//           }
//         }),
//       );

//       // console.log("INVOICE HISTORY STATUS:", historyStatus);

//       setInvoiceHistoryStatus(historyStatus);
//     } catch (error) {
//       console.error("History status error:", error);
//     }
//   };

//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleMenuOpen = () => {
//     setIsDrawerOpen(true);
//     //  handleEdit()
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     // handleMenuOpen(false);
//   };

//   const handleNewClick = () => {
//     setIsDrawerOpen(true);
//     resetForm();
//     setIsEditing(false);
//     setOpen(false);
//   };

//   // ======================================================
//   // MINIMIZE CURRENT SALES BILL
//   // ======================================================

//   const handleMinimizeBill = () => {
//     try {
//       // --------------------------------------------------
//       // Create unique ID for minimized bill
//       // --------------------------------------------------

//       const draftId =
//         isEditing && editId ? `edit-${editId}` : `new-${Date.now()}`;

//       // --------------------------------------------------
//       // Save current form state
//       // --------------------------------------------------

//       const draftBill = {
//         draftId,

//         // ------------------------------------------------
//         // EDIT INFORMATION
//         // ------------------------------------------------

//         isEditing,
//         editId: editId || null,

//         // ------------------------------------------------
//         // INVOICE INFORMATION
//         // ------------------------------------------------

//         invoiceNo,
//         invoiceDate,
//         device,

//         // ------------------------------------------------
//         // CUSTOMER
//         // ------------------------------------------------

//         customerName,
//         phone,
//         selectedAccount,

//         // ------------------------------------------------
//         // ACCOUNT DETAILS
//         // ------------------------------------------------

//         accountDetails,

//         // ------------------------------------------------
//         // PRODUCT DETAILS
//         // ------------------------------------------------

//         rows,

//         selectedProductID,
//         productName,
//         selectedProductName,

//         quantity,
//         rate,
//         amount,

//         // ------------------------------------------------
//         // PAYMENT
//         // ------------------------------------------------

//         paymentMode,
//         cashAmount,
//         onlineAmount,
//         receivedAmount,

//         // ------------------------------------------------
//         // AMOUNT DETAILS
//         // ------------------------------------------------

//         discount,
//         transport,

//         // ------------------------------------------------
//         // OTHER DETAILS
//         // ------------------------------------------------

//         isGST,
//         billFor,
//         machineID,

//         // ------------------------------------------------
//         // CURRENT EDITING ROW
//         // ------------------------------------------------

//         editingRow,

//         // ------------------------------------------------
//         // TIME
//         // ------------------------------------------------

//         minimizedAt: new Date().toISOString(),
//       };

//       // console.log("======================================");

//       // console.log("MINIMIZING SALES BILL");

//       // console.log("DRAFT BILL:", draftBill);

//       // console.log("======================================");

//       // --------------------------------------------------
//       // Check if same invoice is already minimized
//       // --------------------------------------------------

//       setMinimizedBills((prev) => {
//         const existingIndex = prev.findIndex(
//           (bill) => bill.draftId === draftId,
//         );

//         // Existing draft -> update it
//         if (existingIndex !== -1) {
//           const updated = [...prev];

//           updated[existingIndex] = draftBill;

//           return updated;
//         }

//         // New draft -> add it
//         return [...prev, draftBill];
//       });

//       // --------------------------------------------------
//       // Close Drawer WITHOUT resetForm()
//       // --------------------------------------------------

//       setIsDrawerOpen(false);

//       setShowDropdown(false);

//       toast.success("Sales bill minimized successfully.");
//     } catch (error) {
//       console.error("Error minimizing sales bill:", error);

//       toast.error("Unable to minimize sales bill.");
//     }
//   };

//   const handleResumeBill = (billId) => {
//     const bill = minimizedBills.find((item) => item.draftId === billId);

//     if (!bill) {
//       toast.error("Minimized bill not found.");
//       return;
//     }

//     // Restore invoice
//     setInvoiceNo(bill.invoiceNo || "");

//     setInvoiceDate(bill.invoiceDate || moment().format("YYYY-MM-DD"));

//     // Restore customer
//     setSelectedAccount(bill.selectedAccount || "");

//     setCustomerName(bill.customerName || "");

//     setPhone(bill.phone || "");

//     // Restore account details
//     if (bill.accountDetails) {
//       setAccountDetails(bill.accountDetails);
//     }

//     // Restore products
//     setRows(Array.isArray(bill.rows) ? bill.rows : []);

//     // Restore payment
//     setPaymentMode(bill.paymentMode || "");

//     setCashAmount(bill.cashAmount || "");

//     setOnlineAmount(bill.onlineAmount || "");

//     setReceivedAmount(bill.receivedAmount || "");

//     // Restore discount / transport
//     setDiscount(bill.discount || "");

//     setTransport(bill.transport || "");

//     // Restore GST
//     setIsGST(bill.isGST || false);

//     // Restore bill for
//     setBillFor(bill.billFor || "");

//     // Restore machine
//     setMachineID(bill.machineID || "");

//     // Restore edit information
//     setIsEditing(bill.isEditing || false);

//     setEditId(bill.editId || null);

//     // Open Sales Entry
//     setIsDrawerOpen(true);

//     // Remove from minimized list
//     setMinimizedBills((prev) => prev.filter((item) => item.draftId !== billId));

//     toast.success("Minimized bill resumed successfully.");
//   };

//   const handleRemoveMinimizedBill = (billId) => {
//     setMinimizedBills((prev) => prev.filter((item) => item.id !== billId));

//     toast.success("Minimized bill removed.");
//   };

//   const handleDrawerClose = async () => {
//     setIsDrawerOpen(false);
//     setShowDropdown(false);
//     resetForm();

//     // X click केल्यावरच invoice list refresh करा
//     await fetchInvoiceHeader();
//   };

//   //for delete Header
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       // ==========================================
//       // 1. GET CURRENT INVOICE ID
//       // ==========================================
//       const deleteId = String(editId || "").trim();

//       if (!deleteId) {
//         console.error("DELETE: Invoice ID not found.");
//         toast.error("Invoice ID not found. Cannot delete.");
//         return;
//       }

//       // console.log("====================================");
//       // console.log("DELETE SALES ENTRY");
//       // console.log("DELETE INVOICE ID:", deleteId);
//       // console.log("====================================");

//       // ==========================================
//       // 2. DELETE INVOICE HEADER
//       // ==========================================
//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=invoiceheader&Id=${encodeURIComponent(deleteId)}`;

//       // console.log("DELETE URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       // console.log("DELETE API STATUS:", response.status);
//       // console.log("DELETE API RESPONSE:", resultText);

//       // ==========================================
//       // 3. CHECK API RESPONSE
//       // ==========================================
//       if (!response.ok) {
//         throw new Error(`Delete failed with status ${response.status}`);
//       }

//       // ==========================================
//       // 4. CLOSE CONFIRMATION
//       // ==========================================
//       setOpen(false);

//       // ==========================================
//       // 5. CLOSE EDIT DRAWER
//       // ==========================================
//       setIsDrawerOpen(false);

//       // ==========================================
//       // 6. RESET EDIT STATE
//       // ==========================================
//       setIsEditing(false);
//       setEditId("");

//       // ==========================================
//       // 7. RESET FORM
//       // ==========================================
//       resetForm();

//       // ==========================================
//       // 8. REFRESH INVOICE LIST
//       // ==========================================
//       await fetchInvoiceHeader();

//       // ==========================================
//       // 9. SUCCESS
//       // ==========================================
//       toast.success("Sales Entry Deleted successfully!");
//     } catch (error) {
//       console.error("DELETE SALES ENTRY ERROR:", error);

//       toast.error(error?.message || "Unable to delete Sales Entry.");
//     }
//   };

//   const [editId, setEditId] = useState("");

//   // =====================================================
//   // UPDATE / EDIT FORM
//   // =====================================================

//   const handleEdit = async (row) => {
//     try {
//       // // console.log("========== INVOICE EDIT START ==========");

//       // -------------------------------------------------
//       // 1. ORIGINAL INVOICE ROW
//       // -------------------------------------------------
//       const originalData = row?.original || row;

//       if (!originalData) {
//         console.error("No row selected for editing.");
//         toast.error("Please select an invoice.");
//         return;
//       }

//       // -------------------------------------------------
//       // 2. INVOICE ID
//       // -------------------------------------------------
//       const invoiceId = originalData.Id || originalData.InvoiceId;

//       if (!invoiceId) {
//         console.error("Invoice ID not found:", originalData);
//         toast.error("Invoice ID not found.");
//         return;
//       }

//       // // console.log("EDIT INVOICE ID:", invoiceId);

//       // -------------------------------------------------
//       // 3. FIND INVOICE HEADER
//       // -------------------------------------------------
//       let invheader = invoiceheaders.find(
//         (item) => String(item.Id) === String(invoiceId),
//       );

//       // If header is not found in invoiceheaders,
//       // use the selected table row
//       if (!invheader) {
//         invheader = originalData;
//       }

//       if (!invheader) {
//         console.error("Invoice header not found.");
//         toast.error("Invoice header not found.");
//         return;
//       }

//       // // console.log("EDIT INVOICE HEADER:", invheader);

//       // =================================================
//       // 3A. ONLY TODAY'S INVOICE CAN BE EDITED
//       // =================================================

//       const rawInvoiceDate =
//         typeof invheader.InvoiceDate === "object"
//           ? invheader.InvoiceDate?.date
//           : invheader.InvoiceDate;

//       if (!rawInvoiceDate) {
//         toast.error("Invoice date not found.");
//         return;
//       }

//       // Convert invoice date to YYYY-MM-DD
//       const invoiceDateText = String(rawInvoiceDate)
//         .split(" ")[0]
//         .split("T")[0];

//       // Today's date
//       const todayDate = moment().format("YYYY-MM-DD");

//       // // console.log("INVOICE DATE:", invoiceDateText);
//       // // console.log("TODAY DATE:", todayDate);

//       // Old invoice -> DO NOT ALLOW EDIT
//       if (invoiceDateText !== todayDate) {
//         toast.error("Only today's invoice can be edited.");
//         return;
//       }

//       // =================================================
//       // TODAY'S INVOICE -> CONTINUE EDIT
//       // =================================================

//       // -------------------------------------------------
//       // 4. GET SAVED INVOICE DETAILS
//       // -------------------------------------------------
//       const detailResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       // // console.log("EDIT INVOICE DETAIL RESPONSE:", detailResponse.data);

//       // -------------------------------------------------
//       // 5. NORMALIZE DETAIL RESPONSE
//       // -------------------------------------------------
//       const detailData = detailResponse.data;

//       const invdetail = Array.isArray(detailData)
//         ? detailData
//         : Array.isArray(detailData?.data)
//           ? detailData.data
//           : detailData?.data
//             ? [detailData.data]
//             : detailData
//               ? [detailData]
//               : [];

//       // // console.log("EDIT SAVED DETAILS:", invdetail);

//       // -------------------------------------------------
//       // 6. MAP SAVED PRODUCTS
//       // -------------------------------------------------
//       const mappedRows = invdetail.map((detail) => {
//         const matchedProduct = productOptions.find(
//           (option) => String(option.value) === String(detail.ProductId),
//         );

//         const quantity = parseFloat(detail.Quantity) || 0;

//         const rate = parseFloat(detail.Rate) || 0;

//         const amount =
//           detail.Amount != null
//             ? parseFloat(detail.Amount) || 0
//             : quantity * rate;

//         return {
//           Id: detail.Id,

//           InvoiceId: detail.InvoiceId || invoiceId,

//           ProductId: detail.ProductId,

//           ProductName: detail.ProductName || matchedProduct?.label || "",

//           Quantity: quantity,

//           Rate: rate,

//           Amount: amount,

//           // Backend fields
//           // Keep these because save/update may need them

//           CGSTPercentage: detail.CGSTPercentage ?? 0,

//           CGSTAmount: detail.CGSTAmount ?? 0,

//           SGSTPercentage: detail.SGSTPercentage ?? 0,

//           SGSTAmount: detail.SGSTAmount ?? 0,

//           IGSTPercentage: detail.IGSTPercentage ?? 0,

//           IGSTAmount: detail.IGSTAmount ?? 0,

//           DiscountAmt: detail.DiscountAmt ?? 0,
//         };
//       });

//       // // console.log("EDIT MAPPED ROWS:", mappedRows);

//       // -------------------------------------------------
//       // 7. SET EDIT MODE
//       // -------------------------------------------------
//       setEditId(invoiceId);

//       setIsEditing(true);

//       // -------------------------------------------------
//       // 8. SET INVOICE HEADER VALUES
//       // -------------------------------------------------
//       setInvoiceNo(invheader.InvoiceNo || "");

//       setPhone(invheader.ContactNo || "");

//       setDevice(getDeviceForLoggedInUser());

//       setBillFor(invheader.BillFor || "");

//       // MachineId / MachineID
//       const machineValue = invheader.MachineID ?? invheader.MachineId ?? "";

//       setMachineID(machineValue !== "" ? String(machineValue) : "");

//       // IsGST / ISGST
//       const gstValue = invheader.IsGST ?? invheader.ISGST ?? 0;

//       setIsGST(Number(gstValue) === 1);

//       // -------------------------------------------------
//       // 9. INVOICE DATE
//       // -------------------------------------------------
//       setInvoiceDate(invoiceDateText);

//       // -------------------------------------------------
//       // 10. CUSTOMER
//       // -------------------------------------------------
//       if (invheader.AccountId) {
//         setSelectedAccount(invheader.AccountId);

//         // IMPORTANT:
//         // AccountId customer name मध्ये set करू नका.
//         // Actual Customer Name Account API मधून घ्या.

//         try {
//           const customerResponse = await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invheader.AccountId}`,
//           );

//           const customerResult = await customerResponse.json();

//           const customerData = Array.isArray(customerResult)
//             ? customerResult[0]
//             : customerResult?.data || customerResult;

//           const actualCustomerName =
//             customerData?.AccountName || customerData?.accountName || "";

//           setCustomerName(actualCustomerName);

//           setAccountDetails((prev) => ({
//             ...prev,
//             AccountName: actualCustomerName,
//           }));
//         } catch (error) {
//           console.error("Customer Name fetch error:", error);

//           setCustomerName("");
//         }

//         // Address + GST
//         await fetchAccounts(invheader.AccountId);

//         // Existing function
//         fetchAccountName(invheader.AccountId);
//       } else {
//         setSelectedAccount("");
//         setCustomerName("");
//       }

//       // -------------------------------------------------
//       // 11. PAYMENT DETAILS
//       // -------------------------------------------------
//       setPaymentMode(invheader.PaymentMode || "");

//       setCashAmount(
//         invheader.CashAmount != null ? String(invheader.CashAmount) : "",
//       );

//       setOnlineAmount(
//         invheader.OnlineAmount != null ? String(invheader.OnlineAmount) : "",
//       );

//       setReceivedAmount(
//         invheader.ReceivedAmount != null
//           ? String(invheader.ReceivedAmount)
//           : "",
//       );

//       setDiscount(invheader.Discount != null ? String(invheader.Discount) : "");

//       setTransport(
//         invheader.Transport != null ? String(invheader.Transport) : "",
//       );

//       // -------------------------------------------------
//       // 12. LOAD SAVED PRODUCTS
//       // -------------------------------------------------
//       setRows(mappedRows);

//       // -------------------------------------------------
//       // 13. OPEN EDIT DRAWER
//       // -------------------------------------------------
//       setIsDrawerOpen(true);

//       // -------------------------------------------------
//       // 14. LOAD FIRST PRODUCT INTO EDIT INPUT
//       // -------------------------------------------------
//       if (mappedRows.length > 0) {
//         const firstRow = mappedRows[0];

//         // // console.log("FIRST PRODUCT FOR EDIT:", firstRow);

//         // IMPORTANT
//         // First saved row is now in EDIT mode
//         setEditingRow(null);

//         // Product
//         setSelectedProductId(firstRow.ProductId);

//         setProductName(firstRow.ProductName || "");

//         setSelectedProductName(firstRow.ProductName || "");

//         // Quantity
//         setQuantity(String(firstRow.Quantity ?? ""));

//         // Rate
//         setRate(String(firstRow.Rate ?? ""));

//         // Amount
//         SetAmount(Number(firstRow.Amount) || 0);

//         // GST values kept internally
//         setCGST(firstRow.CGSTPercentage ?? 0);

//         setCGSTAmount(firstRow.CGSTAmount ?? 0);

//         setSGST(firstRow.SGSTPercentage ?? 0);

//         setSGSTAmount(firstRow.SGSTAmount ?? 0);

//         setIGST(firstRow.IGSTPercentage ?? 0);

//         setIGSTAmount(firstRow.IGSTAmount ?? 0);

//         // Focus product field
//         setTimeout(() => {
//           productRef.current?.focus();
//         }, 200);
//       } else {
//         // -------------------------------------------------
//         // NO SAVED PRODUCT
//         // -------------------------------------------------
//         setEditingRow(null);

//         setSelectedProductId("");

//         setProductName("");

//         setSelectedProductName("");

//         setQuantity("");

//         setRate("");

//         SetAmount(0);

//         setCGST(0);
//         setCGSTAmount(0);

//         setSGST(0);
//         setSGSTAmount(0);

//         setIGST(0);
//         setIGSTAmount(0);
//       }

//       // -------------------------------------------------
//       // 15. FINAL DEBUG
//       // -------------------------------------------------
//       // console.log("======================================");

//       // console.log("EDIT MODE ACTIVE");

//       // console.log("EDIT ID:", invoiceId);

//       // console.log("EDIT DATE:", invoiceDateText);

//       // console.log("TODAY DATE:", todayDate);

//       // console.log("EDIT ROWS:", mappedRows);

//       // console.log("======================================");
//     } catch (error) {
//       console.error(
//         "EDIT INVOICE ERROR:",
//         error.response?.data || error.message || error,
//       );

//       toast.error("Unable to load invoice for editing.");
//     }
//   };

//   //table

//   //for preview
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewData, setPreviewData] = useState(null);

//   const columns = useMemo(
//     () => [
//       // ==================================================
//       // BILL NO
//       // ==================================================
//       {
//         accessorKey: "InvoiceNo",
//         header: "Bill No",
//         size: 100,

//         Cell: ({ cell }) => <span>{cell.getValue() || "-"}</span>,
//       },

//       // ==================================================
//       // INVOICE DATE
//       // ==================================================
//       {
//         accessorKey: "InvoiceDate.date",
//         header: "Invoice Date",
//         size: 120,

//         Cell: ({ cell }) => (
//           <span>
//             {cell.getValue()
//               ? moment(cell.getValue()).format("DD-MM-YYYY")
//               : "-"}
//           </span>
//         ),
//       },

//       // ==================================================
//       // CUSTOMER NAME
//       // ==================================================
//       {
//         header: "Customer Name",
//         size: 200,

//         accessorFn: (row) => row.accountDetails?.AccountName || "N/A",

//         Cell: ({ cell }) => <span>{cell.getValue()}</span>,
//       },

//       // ==================================================
//       // CATEGORY
//       // ==================================================
//       {
//         header: "Category",
//         size: 130,

//         accessorFn: (row) => {
//           const customerType = String(row?.accountDetails?.CustomerType || "")
//             .trim()
//             .toUpperCase();

//           if (customerType === "R") {
//             return "Retailer";
//           }

//           if (customerType === "D") {
//             return "Dealer";
//           }

//           if (customerType === "C") {
//             return "Caterers";
//           }

//           return "-";
//         },

//         Cell: ({ cell }) => <span>{cell.getValue()}</span>,
//       },

//       // ==================================================
//       // TOTAL
//       // ==================================================
//       {
//         accessorKey: "Total",
//         header: "Total",
//         size: 100,
//       },

//       // ==================================================
//       // ACTIONS
//       // ==================================================
//       {
//         header: "Actions",
//         size: 200,

//         Cell: ({ row }) => (
//           <Box display="flex" gap={1}>
//             {/* =========================
//               EDIT BUTTON
//           ========================= */}
//             <Button
//               sx={{
//                 background: "var(--primary-color)",
//               }}
//               variant="contained"
//               size="small"
//               onClick={() => {
//                 // // console.log("INVOICE EDIT CLICK:", row.original);

//                 handleEdit(row.original);
//               }}
//             >
//               Edit
//             </Button>

//             {/* =========================
//               PREVIEW BUTTON
//           ========================= */}
//             <Button
//               variant="contained"
//               sx={{
//                 background: "var(--complementary-color)",
//               }}
//               size="small"
//               onClick={async () => {
//                 try {
//                   // ---------------------------------
//                   // 1. GET SAVED INVOICE ID
//                   // ---------------------------------
//                   const invoiceId = row.original?.Id;

//                   if (!invoiceId) {
//                     toast.error("Invoice ID not found.");
//                     return;
//                   }

//                   // ---------------------------------
//                   // 2. GET THIS INVOICE DETAILS
//                   // ---------------------------------
//                   const detailResponse = await axios.get(
//                     `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//                   );

//                   // // console.log("INVOICE DETAIL RESPONSE:", detailResponse.data);

//                   const allDetails = Array.isArray(detailResponse.data)
//                     ? detailResponse.data
//                     : Array.isArray(detailResponse.data?.data)
//                       ? detailResponse.data.data
//                       : detailResponse.data?.data
//                         ? [detailResponse.data.data]
//                         : detailResponse.data
//                           ? [detailResponse.data]
//                           : [];

//                   // ---------------------------------
//                   // 3. GET ONLY THIS BILL DETAILS
//                   // ---------------------------------
//                   const invdetail = allDetails
//                     .filter(
//                       (detail) =>
//                         String(detail.InvoiceId) === String(invoiceId),
//                     )
//                     .map((detail) => {
//                       const matchedMaterial = productOptions.find(
//                         (item) =>
//                           String(item.value) === String(detail.ProductId),
//                       );

//                       return {
//                         ...detail,

//                         ProductName: matchedMaterial?.label || "Unknown",
//                       };
//                     });

//                   // ---------------------------------
//                   // 4. GET SAVED INVOICE HEADER
//                   // ---------------------------------
//                   let invoiceHeader = row.original;

//                   try {
//                     const headerResponse = await fetch(
//                       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
//                     );

//                     const headerResult = await headerResponse.json();

//                     invoiceHeader = Array.isArray(headerResult)
//                       ? headerResult[0]
//                       : Array.isArray(headerResult?.data)
//                         ? headerResult.data[0]
//                         : headerResult?.data
//                           ? headerResult.data
//                           : headerResult;

//                     // // console.log("SAVED INVOICE HEADER:", invoiceHeader);
//                   } catch (headerError) {
//                     console.error("Invoice Header Error:", headerError);
//                   }

//                   // ---------------------------------
//                   // 5. FINAL PREVIEW DATA
//                   // ---------------------------------

//                   const cashAmountSaved = Number(
//                     invoiceHeader?.CashAmount || 0,
//                   );

//                   const onlineAmountSaved = Number(
//                     invoiceHeader?.OnlineAmount || 0,
//                   );

//                   const savedReceivedAmount =
//                     invoiceHeader?.ReceivedAmount != null
//                       ? Number(invoiceHeader.ReceivedAmount)
//                       : cashAmountSaved + onlineAmountSaved;

//                   const finalPreviewData = {
//                     ...row.original,

//                     // ==========================================
//                     // CREATED DATE & TIME
//                     // ==========================================
//                     CreatedOn:
//                       invoiceHeader?.CreatedOn ??
//                       row.original?.CreatedOn ??
//                       null,

//                     // ==========================================
//                     // RECEIVED AMOUNT
//                     // ==========================================
//                     ReceivedAmount: savedReceivedAmount,

//                     // ==========================================
//                     // ACCOUNT DETAILS
//                     // ==========================================
//                     accountDetails: row.original?.accountDetails || {
//                       AccountName: "",
//                       Address1: "",
//                       Address2: "",
//                       Address3: "",
//                       GSTNo: "",
//                     },

//                     // ==========================================
//                     // INVOICE DETAILS
//                     // ==========================================
//                     invdetail: invdetail,
//                   };

//                   // // console.log("FINAL PREVIEW DATA:", finalPreviewData);

//                   // // console.log(
//                   //   "RECEIVED AMOUNT:",
//                   //   finalPreviewData.ReceivedAmount,
//                   // );

//                   // ---------------------------------
//                   // 6. CONSOLE CHECK
//                   // ---------------------------------
//                   // console.log("========== PREVIEW ==========");

//                   // console.log("Invoice ID:", invoiceId);

//                   // console.log("Invoice Header:", row.original);

//                   // console.log("Invoice Details:", invdetail);

//                   // console.log("Customer:", finalPreviewData.accountDetails);

//                   // console.log("FINAL PREVIEW DATA:", finalPreviewData);

//                   // console.log("=============================");

//                   // ---------------------------------
//                   // 7. OPEN PREVIEW
//                   // ---------------------------------
//                   setPreviewData(finalPreviewData);

//                   setPreviewOpen(true);
//                 } catch (error) {
//                   // // console.error("Preview Error:", error);

//                   toast.error("Unable to load invoice preview.");
//                 }
//               }}
//             >
//               Preview
//             </Button>
//           </Box>
//         ),
//       },

//       // ==================================================
//       // REMARK / EDITED
//       // ==================================================
//       {
//         header: "Remark",
//         size: 140,

//         accessorFn: (row) => {
//           const createdOn = row?.CreatedOn?.date || row?.CreatedOn || "";

//           const updatedOn = row?.UpdatedOn?.date || row?.UpdatedOn || "";

//           const updateCount = Number(row?.UpdateCount ?? 0);

//           const isEdited =
//             updateCount > 1 ||
//             (createdOn && updatedOn && String(createdOn) !== String(updatedOn));

//           return isEdited ? "Edited" : "-";
//         },

//         Cell: ({ row }) => {
//           const invoice = row.original;

//           const createdOn =
//             invoice?.CreatedOn?.date || invoice?.CreatedOn || "";

//           const updatedOn =
//             invoice?.UpdatedOn?.date || invoice?.UpdatedOn || "";

//           const updateCount = Number(invoice?.UpdateCount ?? 0);

//           const isEdited =
//             updateCount > 1 ||
//             (createdOn && updatedOn && String(createdOn) !== String(updatedOn));

//           // -----------------------------
//           // NOT EDITED
//           // -----------------------------
//           if (!isEdited) {
//             return (
//               <Typography
//                 sx={{
//                   color: "#999",
//                   fontWeight: 500,
//                 }}
//               >
//                 -
//               </Typography>
//             );
//           }

//           // -----------------------------
//           // EDITED
//           // -----------------------------
//           return (
//             <Button
//               variant="contained"
//               size="small"
//               sx={{
//                 background: "var(--primary-color)",
//                 minWidth: "80px",
//               }}
//               onClick={() => {
//                 // console.log("================================");

//                 // console.log("EDITED HISTORY CLICK");

//                 // console.log("Invoice No:", invoice?.InvoiceNo);

//                 // console.log("Invoice ID:", invoice?.Id);

//                 // console.log("================================");

//                 handleInvoiceHistoryClick(invoice);
//               }}
//             >
//               Edited
//             </Button>
//           );
//         },
//       },
//     ],
//     [invoiceheaders, invoicedetails, productOptions],
//   );

//   // =========================
//   // Integration
//   // =========================

//   // Invoice Details
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState("");

//   const [phone, setPhone] = useState("");

//   const [device, setDevice] = useState("");

//   const [userId, setUserId] = useState(
//     () => sessionStorage.getItem("UserId") || "",
//   );

//   // ======================================================
//   // GET DEVICE FOR LOGGED-IN USER
//   // ======================================================
//   const getDeviceForLoggedInUser = () => {
//     const userRole = String(sessionStorage.getItem("UserRole") || "")
//       .trim()
//       .toUpperCase();

//     if (userRole === "SALE") {
//       return "Device1";
//     }

//     if (userRole === "SALE2") {
//       return "Device2";
//     }

//     return "";
//   };

//   const userRole = String(sessionStorage.getItem("UserRole") || "")
//     .trim()
//     .toUpperCase();

//   const isAdmin = userRole === "ADMIN";

//   const [billFor, setBillFor] = useState("");

//   const [machineID, setMachineID] = useState("");

//   const [machineOptions, setMachineOptions] = useState([]);

//   const [isGST, setIsGST] = useState(false);

//   // Product Details
//   const [product, setProduct] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [rate, setRate] = useState("");
//   const [amount, SetAmount] = useState("");

//   const [editingRow, setEditingRow] = useState(null);

//   // Keyboard navigation refs
//   const quantityRef = useRef(null);
//   const rateRef = useRef(null);
//   const productRef = useRef(null);
//   const discountRef = useRef(null);
//   const receivedAmountRef = useRef(null);

//   const [productDropdownOpen, setProductDropdownOpen] = useState(false);

//   // ======================================================
//   // ESC = GO ONE STEP BACK
//   // ======================================================
//   useEffect(() => {
//     if (!isDrawerOpen) return;

//     const handleEscBack = (event) => {
//       if (event.key !== "Escape") return;

//       const activeElement = document.activeElement;

//       event.preventDefault();
//       event.stopPropagation();

//       // Received Amount -> Discount
//       if (receivedAmountRef.current === activeElement) {
//         setTimeout(() => {
//           discountRef.current?.focus();
//           discountRef.current?.select();
//         }, 50);
//         return;
//       }

//       // Discount -> Payment Mode
//       if (discountRef.current === activeElement) {
//         setTimeout(() => {
//           document.querySelector('[name="paymentMode"]')?.focus();
//         }, 50);
//         return;
//       }

//       // Payment Mode -> Quantity
//       if (activeElement?.name === "paymentMode") {
//         setTimeout(() => {
//           quantityRef.current?.focus();
//           quantityRef.current?.select();
//         }, 50);
//         return;
//       }

//       // Quantity -> Product
//       if (quantityRef.current === activeElement) {
//         setTimeout(() => {
//           productRef.current?.focus();
//         }, 50);
//         return;
//       }

//       // Product -> Customer
//       if (productRef.current === activeElement) {
//         setTimeout(() => {
//           const customerInput = document.querySelector(
//             'input[placeholder="Select Customer"]',
//           );

//           customerInput?.focus();
//         }, 50);
//         return;
//       }
//     };

//     window.addEventListener("keydown", handleEscBack, true);

//     return () => {
//       window.removeEventListener("keydown", handleEscBack, true);
//     };
//   }, [isDrawerOpen]);

//   // Tax Details
//   const [cgst, setCGST] = useState(0);
//   const [cgstAmount, setCGSTAmount] = useState(0);

//   const [sgst, setSGST] = useState(0);
//   const [sgstAmount, setSGSTAmount] = useState(0);

//   const [igst, setIGST] = useState(0);
//   const [igstAmount, setIGSTAmount] = useState(0);

//   // =========================
//   // Payment Details
//   // =========================
//   const [paymentMode, setPaymentMode] = useState(null);

//   // Received Amount
//   const [receivedAmount, setReceivedAmount] = useState("");

//   // Mix Payment
//   const [cashAmount, setCashAmount] = useState("");
//   const [onlineAmount, setOnlineAmount] = useState("");

//   // Transport
//   const [transport, setTransport] = useState("");

//   const [productName, setProductName] = useState("");
//   // =========================
//   // Customer / Account
//   // =========================
//   const [accountOptions, setAccountOptions] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [previousBalanceDue, setPreviousBalanceDue] = useState(0);

//   const [selectedCustomerName, setSelectedCustomerName] = useState("");

//   const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

//   const [acctGSTNo, setacctGSTNo] = useState("");

//   const [newCustomerMobile, setNewCustomerMobile] = useState("");

//   const fetchCustomerContact = async (customerId) => {
//     if (!customerId) {
//       setPhone("");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
//           customerId,
//         )}`,
//       );

//       if (!response.ok) {
//         throw new Error(`Contact API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const invoiceList = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : result?.data
//             ? [result.data]
//             : [];

//       invoiceList.sort((a, b) => Number(b?.Id || 0) - Number(a?.Id || 0));

//       const latestInvoice = invoiceList.find(
//         (invoice) =>
//           invoice?.ContactNo !== null &&
//           invoice?.ContactNo !== undefined &&
//           String(invoice.ContactNo).trim() !== "",
//       );

//       const savedContact = latestInvoice?.ContactNo || "";

//       // console.log("CUSTOMER SAVED CONTACT:", {
//       //   customerId,
//       //   savedContact,
//       //   latestInvoice,
//       // });

//       setPhone(String(savedContact));
//     } catch (error) {
//       console.error("Customer contact fetch error:", error);
//       setPhone("");
//     }
//   };

//   const fetchPreviousBalance = async (customerId, excludeInvoiceId = null) => {
//     if (!customerId) {
//       setPreviousBalanceDue(0);
//       return 0;
//     }

//     try {
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
//           customerId,
//         )}`,
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Invoice header API failed with status ${response.status}`,
//         );
//       }

//       const result = await response.json();

//       const invoiceList = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : result?.data
//             ? [result.data]
//             : [];

//       let previousBalance = 0;

//       for (const invoice of invoiceList) {
//         const invoiceId = Number(invoice?.Id || 0);

//         if (
//           excludeInvoiceId !== null &&
//           excludeInvoiceId !== undefined &&
//           invoiceId === Number(excludeInvoiceId)
//         ) {
//           continue;
//         }

//         const invoiceTotal = Number(invoice?.Total || 0);

//         let invoiceReceived = 0;

//         if (
//           invoice?.ReceivedAmount !== null &&
//           invoice?.ReceivedAmount !== undefined &&
//           invoice?.ReceivedAmount !== ""
//         ) {
//           invoiceReceived = Number(invoice.ReceivedAmount) || 0;
//         } else {
//           invoiceReceived =
//             (Number(invoice?.CashAmount) || 0) +
//             (Number(invoice?.OnlineAmount) || 0);
//         }

//         const invoiceDue = Math.max(invoiceTotal - invoiceReceived, 0);

//         previousBalance += invoiceDue;
//       }

//       setPreviousBalanceDue(previousBalance);

//       return previousBalance;
//     } catch (error) {
//       console.error("Previous balance fetch error:", error);

//       setPreviousBalanceDue(0);

//       return 0;
//     }
//   };

//   const [customerAddress1, setCustomerAddress1] = useState("");
//   const [customerAddress2, setCustomerAddress2] = useState("");
//   const [customerAddress3, setCustomerAddress3] = useState("");

//   // Customer complete details
//   const [accountDetails, setAccountDetails] = useState({
//     AccountName: "",
//     Address1: "",
//     Address2: "",
//     Address3: "",
//     GSTNo: "",
//   });

//   useEffect(() => {
//     // fetchAccounts();

//     fetchProduct();

//     fetchMachines();

//     setDevice(getDeviceForLoggedInUser());
//   }, []);

//   useEffect(() => {
//     if (fromDate && toDate) {
//       fetchInvoiceHeader(fromDate, toDate);
//     }
//   }, [fromDate, toDate]);

//   //fetch customer from  account table

//   const fetchProduct = async () => {
//     try {
//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster&RateType=Retailer",
//       );

//       const data = await response.json();

//       // console.log("RETAILER PRODUCT API RESPONSE:", data);

//       productvalidation(data);
//     } catch (error) {
//       // console.error("Error fetching retailer products:", error);
//     }
//   };

//   // ======================================================
//   // FETCH MACHINES
//   // ======================================================

//   const fetchMachines = async () => {
//     try {
//       const response = await axios.get(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=Machines",
//       );

//       // // console.log("Machines API Response:", response.data);

//       const data = Array.isArray(response.data) ? response.data : [];

//       const options = data.map((machine) => ({
//         value: machine.Id,
//         label: machine.MachineName || machine.Name || `Machine ${machine.Id}`,
//       }));

//       setMachineOptions(options);
//     } catch (error) {
//       console.error("Error fetching machines:", error);
//     }
//   };

//   const [selectedProductID, setSelectedProductId] = useState("");
//   const [selectedProductName, setSelectedProductName] = useState(null);

//   const productvalidation = (data) => {
//     // // console.log("RETAILER PRODUCT DATA:", data?.[0]);

//     const options = data.map((account) => ({
//       value: account?.Id,
//       label: account?.ProductName,
//       cgst: account?.CGSTPercentage,
//       sgst: account?.SGSTPercentage,
//       igst: account?.IGSTPercentage,

//       // Regular Sales Rate = PurchasePrice
//       purchaseRate: parseFloat(account?.PurchasePrice) || 0,
//     }));

//     setProductOptions(options);
//   };

//   const resetForm = () => {
//     // =========================
//     // Invoice Details
//     // =========================
//     setInvoiceNo("");
//     setInvoiceDate(new Date());
//     setPhone("");
//     setDevice(getDeviceForLoggedInUser());

//     // NEW BILL HEADER FIELDS
//     setBillFor("");
//     setMachineID("");
//     setIsGST(false);

//     // =========================
//     // Customer
//     // =========================

//     setSelectedAccount("");

//     setAccountDetails({
//       AccountName: "",
//       Address1: "",
//       Address2: "",
//       Address3: "",
//       GSTNo: "",
//     });

//     setacctGSTNo("");

//     setCustomerAddress1("");
//     setCustomerAddress2("");
//     setCustomerAddress3("");

//     // =========================
//     // Product Details
//     // =========================
//     setProduct("");
//     setQuantity("");
//     setRate("");
//     SetAmount("");

//     // Discount

//     // Discount
//     setDiscount("");
//     setBaseAmount(0);

//     // =========================
//     // Tax Details
//     // =========================
//     setCGST("");
//     setCGSTAmount("");

//     setSGST("");
//     setSGSTAmount("");

//     setIGST("");
//     setIGSTAmount("");

//     // =========================
//     // Payment Details
//     // =========================
//     setPaymentMode("");
//     setReceivedAmount("");

//     // Mix Payment
//     setCashAmount("");
//     setOnlineAmount("");

//     // =========================
//     // Transport
//     // =========================
//     setTransport("");

//     // =========================
//     // Validation Errors
//     // =========================
//     setErrors({
//       invoiceDate: "",
//       selectedAccount: "",
//       paymentMode: "",
//       rows: "",
//     });

//     // =========================
//     // Customer Search
//     // =========================
//     setAccountOptions([]);
//     setAccountName("");
//     setText("");
//     setShowDropdown(false);

//     // =========================
//     // Product Table
//     // =========================
//     setRows([]);

//     // =========================
//     // Product Selection
//     // =========================
//     setSelectedProductId("");
//     setSelectedProductName("");
//     setProductName("");

//     // =========================
//     // Editing Row
//     // =========================
//     setEditingRow(null);

//     // =========================
//     // Tax / Amount Summary
//     // =========================
//     setSubTotalCal(0);
//     setCgstTotal(0);
//     setSgstTotal(0);
//     setIgstTotal(0);
//     setTotal(0);
//   };

//   const handleSubmit = async (e, shouldPrint = false) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     // 1. Prevent duplicate save
//     if (isSavingRef.current) return;

//     let printWindow = null;

//     // 2. Prepare rows, including the last product if Enter was not pressed
//     const rowsToSave = [...rows];

//     const pendingProductExists =
//       editingRow === null &&
//       selectedProductID &&
//       quantity !== "" &&
//       rate !== "" &&
//       Number(quantity) > 0 &&
//       Number(rate) > 0;

//     const pendingProductAlreadyExists = rows.some(
//       (row) =>
//         String(row.ProductId) === String(selectedProductID) &&
//         Number(row.Quantity) === Number(quantity) &&
//         Number(row.Rate) === Number(rate),
//     );

//     if (pendingProductExists && !pendingProductAlreadyExists) {
//       const selectedOption = productOptions.find(
//         (option) => String(option.value) === String(selectedProductID),
//       );

//       const pendingQuantity = parseFloat(quantity) || 0;
//       const pendingRate = parseFloat(rate) || 0;
//       const pendingAmount = pendingQuantity * pendingRate;

//       const pendingCGST = parseFloat(cgst) || 0;
//       const pendingSGST = parseFloat(sgst) || 0;
//       const pendingIGST = parseFloat(igst) || 0;

//       const pendingCGSTAmount =
//         cgstAmount !== "" && cgstAmount !== undefined
//           ? Number(cgstAmount) || 0
//           : (pendingCGST * pendingAmount) / 100;

//       const pendingSGSTAmount =
//         sgstAmount !== "" && sgstAmount !== undefined
//           ? Number(sgstAmount) || 0
//           : (pendingSGST * pendingAmount) / 100;

//       const pendingIGSTAmount =
//         igstAmount !== "" && igstAmount !== undefined
//           ? Number(igstAmount) || 0
//           : (pendingIGST * pendingAmount) / 100;

//       rowsToSave.push({
//         Id: null,
//         InvoiceId: null,
//         ProductId: selectedProductID,
//         ProductName:
//           productName || selectedProductName || selectedOption?.label || "",
//         Quantity: pendingQuantity,
//         Rate: pendingRate,
//         Amount: pendingAmount,
//         DiscountAmt: 0,
//         CGSTPercentage: pendingCGST,
//         CGSTAmount: pendingCGSTAmount,
//         SGSTPercentage: pendingSGST,
//         SGSTAmount: pendingSGSTAmount,
//         IGSTPercentage: pendingIGST,
//         IGSTAmount: pendingIGSTAmount,
//       });
//     }

//     // 3. Validate products
//     if (!rowsToSave.length) {
//       toast.error("Please add at least one product.");
//       return;
//     }

//     // 4. Calculate totals
//     const finalSubTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.Amount) || 0),
//       0,
//     );

//     const finalCGSTTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.CGSTAmount) || 0),
//       0,
//     );

//     const finalSGSTTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.SGSTAmount) || 0),
//       0,
//     );

//     const finalIGSTTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.IGSTAmount) || 0),
//       0,
//     );

//     const finalDiscount = parseFloat(discount) || 0;
//     const finalTransport = parseFloat(transport) || 0;

//     const finalTotal =
//       Math.max(finalSubTotal - finalDiscount, 0) + finalTransport;

//     // 5. Validate before saving
//     if (!validateForm(rowsToSave)) return;
//     if (!validateReceivedAmount(finalTotal)) return;
//     if (!validatePaymentSplit()) return;

//     const receivedValue = receivedAmount === "" ? 0 : Number(receivedAmount);

//     if (!Number.isFinite(receivedValue) || receivedValue < 0) {
//       toast.error("Please enter a valid Received Amount.");
//       return;
//     }

//     // 6. Validate invoice date
//     const formattedInvoicedate = moment(invoiceDate).format("YYYY-MM-DD");

//     if (!moment(formattedInvoicedate, "YYYY-MM-DD", true).isValid()) {
//       toast.error("Please select a valid invoice date.");
//       return;
//     }

//     // 7. Update displayed totals
//     setSubTotalCal(finalSubTotal.toFixed(2));
//     setCgstTotal(finalCGSTTotal.toFixed(2));
//     setSgstTotal(finalSGSTTotal.toFixed(2));
//     setIgstTotal(finalIGSTTotal.toFixed(2));
//     setTotal(finalTotal.toFixed(2));

//     // 8. Lock Save
//     isSavingRef.current = true;
//     setIsSaving(true);

//     try {
//       // 9. Open print window only when printing is requested
//       if (shouldPrint) {
//         printWindow = window.open("", "_blank");

//         if (!printWindow) {
//           toast.error("Please allow popups for printing.");
//           return;
//         }

//         printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>Preparing Invoice...</title>
//           </head>
//           <body style="font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;margin:0">
//             <h3>Preparing invoice for printing...</h3>
//           </body>
//         </html>
//       `);

//         printWindow.document.close();
//       }

//       // 10. Prepare invoice header

//       const invoiceheaderdata = {
//         Id: isEditing ? editId : "",
//         InvoiceNo: invoiceNo,
//         InvoiceDate: formattedInvoicedate,

//         // Order Date = Invoice Date
//         OrderDate: formattedInvoicedate,

//         AccountId: selectedAccount ? parseInt(selectedAccount, 10) : 0,

//         ContactNo: phone,
//         Device: device,

//         // Regular Sales Entry
//         BillFor: "R",

//         MachineID: machineID ? parseInt(machineID, 10) : 0,

//         IsGST: isGST ? 1 : 0,
//         PaymentMode: paymentMode || "",
//         CashAmount: parseFloat(cashAmount) || 0,
//         OnlineAmount: parseFloat(onlineAmount) || 0,
//         Discount: finalDiscount,
//         Transport: finalTransport,
//         CGSTAmount: finalCGSTTotal,
//         SGSTAmount: finalSGSTTotal,
//         IGSTAmount: finalIGSTTotal,
//         Total: finalTotal,

//         // Actual amount received
//         ReceivedAmount: receivedValue,

//         SubTotal: finalSubTotal,
//         CreatedBy: !isEditing ? userId : undefined,
//         UpdatedBy: isEditing ? userId : undefined,
//       };

//       // 11. Save or update invoice header
//       const invoiceurl = isEditing
//         ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
//         : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

//       const response = await axios.post(
//         invoiceurl,
//         qs.stringify(invoiceheaderdata),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         },
//       );

//       // 12. Resolve invoice ID
//       const invoiceId = isEditing ? editId : parseInt(response?.data?.Id, 10);

//       const savedInvoiceNo = isEditing ? invoiceNo : response?.data?.InvoiceNo;

//       if (!invoiceId) {
//         throw new Error(
//           "Invoice ID was not received from the server. Check the invoice header API response.",
//         );
//       }

//       // 13. Save all invoice details
//       await Promise.all(
//         rowsToSave.map(async (row, index) => {
//           const rowData = {
//             Id: row.Id ? parseInt(row.Id, 10) : "",
//             InvoiceId: parseInt(invoiceId, 10),
//             SerialNo: index + 1,
//             ProductId: parseInt(row.ProductId, 10),
//             Quantity: parseFloat(row.Quantity) || 0,
//             Rate: parseFloat(row.Rate) || 0,
//             Amount: parseFloat(row.Amount) || 0,
//             CGSTPercentage: parseFloat(row.CGSTPercentage) || 0,
//             CGSTAmount: parseFloat(row.CGSTAmount) || 0,
//             SGSTPercentage: parseFloat(row.SGSTPercentage) || 0,
//             SGSTAmount: parseFloat(row.SGSTAmount) || 0,
//             IGSTPercentage: parseFloat(row.IGSTPercentage) || 0,
//             IGSTAmount: parseFloat(row.IGSTAmount) || 0,
//           };

//           const detailUrl = row.Id
//             ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
//             : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

//           const detailResponse = await axios.post(
//             detailUrl,
//             qs.stringify(rowData),
//             {
//               headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//               },
//             },
//           );

//           return detailResponse.data;
//         }),
//       );

//       // 14. Print only after header and all details have saved
//       if (shouldPrint) {
//         const currentAccountDetails = await fetchAccounts(selectedAccount);

//         const customerNameForPrint =
//           accountOptions.find(
//             ({ Id }) => String(Id) === String(selectedAccount),
//           )?.AccountName ||
//           accountName ||
//           "";

//         const printData = {
//           ...invoiceheaderdata,
//           Id: invoiceId,
//           InvoiceNo: savedInvoiceNo,
//           Device: device || "",
//           PaymentMode: paymentMode || "",

//           accountDetails: {
//             ...(currentAccountDetails || {}),
//             AccountName: customerNameForPrint,
//             Address1: customerAddress1 || "",
//             Address2: customerAddress2 || "",
//             Address3: customerAddress3 || "",
//             GSTNo: acctGSTNo || "",
//           },

//           customerName: customerNameForPrint,
//           customerAddress1: customerAddress1 || "",
//           customerAddress2: customerAddress2 || "",
//           customerAddress3: customerAddress3 || "",
//           customerGSTNo: acctGSTNo || "",
//           ReceivedAmount: receivedValue,

//           invdetail: rowsToSave.map((row) => ({
//             ...row,
//             ProductName:
//               row.ProductName ||
//               productOptions.find(
//                 (option) => String(option.value) === String(row.ProductId),
//               )?.label ||
//               "Unknown",
//             Quantity: parseFloat(row.Quantity) || 0,
//             Rate: parseFloat(row.Rate) || 0,
//             Amount: parseFloat(row.Amount) || 0,
//             DiscountAmt: parseFloat(row.DiscountAmt) || 0,
//           })),
//         };

//         generatePDF(printData, printWindow);
//       }

//       // 15. Success
//       toast.success(
//         isEditing
//           ? "Sales Entry Updated successfully!"
//           : "Sales Entry Created successfully!",
//       );

//       // 16. Reset edit mode and form
//       setIsEditing(false);
//       setEditId("");
//       resetForm();

//       // 17. Refresh invoice table only once
//       // Keep this GET so the table displays the saved invoice.
//       // void fetchInvoiceHeader();
//     } catch (error) {
//       console.error("Error submitting invoice:", error);

//       if (printWindow && !printWindow.closed) {
//         printWindow.close();
//       }

//       toast.error(
//         isEditing ? "Sales Entry Update failed!" : "Sales Entry Save failed!",
//       );
//     } finally {
//       // 18. Always unlock Save
//       isSavingRef.current = false;
//       setIsSaving(false);
//     }
//   };

//   // ======================================================
//   // CTRL + S = SAVE + PRINT
//   // ======================================================

//   useEffect(() => {
//     const handleCtrlS = (event) => {
//       // Ctrl + S
//       if (event.ctrlKey && event.key.toLowerCase() === "s") {
//         // Browser Save Page थांबवा
//         event.preventDefault();
//         event.stopPropagation();

//         // Drawer बंद असेल तर काही करू नका
//         if (!isDrawerOpen) {
//           return;
//         }

//         // Double submit prevent करण्यासाठी
//         if (event.repeat) {
//           return;
//         }

//         // console.log("CTRL + S PRESSED");

//         // Save + Print
//         handleSubmit(event);
//       }
//     };

//     // Capture phase मध्ये listener
//     window.addEventListener("keydown", handleCtrlS, true);

//     return () => {
//       window.removeEventListener("keydown", handleCtrlS, true);
//     };
//   }, [isDrawerOpen]);

//   const handleQuantityChange = (e) => {
//     const qty = e.target.value;
//     setQuantity(qty);
//     calculateAmount(qty, rate);
//   };

//   const handleRateChange = (e) => {
//     const rt = e.target.value;
//     setRate(rt);
//     // console.log("rateee", rate);
//     calculateAmount(quantity, rt);
//   };

//   ///  for discount Amount
//   const [discount, setDiscount] = useState("");

//   // const calculateAmount = (qty, rt) => {
//   //   const qtyNum = parseFloat(qty) || 0;
//   //   const rateNum = parseFloat(rt) || 0;
//   //   const amt = qtyNum * rateNum;
//   //   SetAmount(amt);
//   //   calculateCgstAmount(cgst, amt);
//   //   calculateSgstAmount(sgst, amt);
//   //   calculateIgstAmount(igst, amt);
//   // };

//   const [baseAmount, setBaseAmount] = useState(0);

//   const calculateAmount = (qty, rt) => {
//     const qtyNum = parseFloat(qty) || 0;

//     const rateNum = parseFloat(rt) || 0;

//     const baseAmt = qtyNum * rateNum;

//     setBaseAmount(baseAmt);

//     SetAmount(baseAmt);

//     calculateCgstAmount(cgst, baseAmt);

//     calculateSgstAmount(sgst, baseAmt);

//     calculateIgstAmount(igst, baseAmt);
//   };

//   const calculateSgstAmount = (sgstValue, amt) => {
//     let sgstNum = parseFloat(sgstValue) || 0;
//     let sgstAmt = (sgstNum * amt) / 100;
//     setSGSTAmount(sgstAmt);
//   };

//   const calculateCgstAmount = (cgstValue, amt) => {
//     let cgstNum = parseFloat(cgstValue) || 0;
//     let cgstAmt = (cgstNum * amt) / 100;
//     setCGSTAmount(cgstAmt);
//   };

//   const calculateIgstAmount = (igstValue, amt) => {
//     let igstNum = parseFloat(igstValue) || 0;
//     let igstAmt = (igstNum * amt) / 100;
//     setIGSTAmount(igstAmt);
//   };

//   const handleAddRow = () => {
//     //  console.log("Selected Product ID:", selectedProductID);
//     //  console.log("Selected Product Name:", selectedProductName);

//     let newRow = {
//       // id: rows.length + 1,
//       InvoiceId: null,
//       ProductId: selectedProductID,
//       ProductName: productName,
//       Quantity: quantity,
//       Rate: rate,
//       Amount: amount,
//       CGSTPercentage: cgst,
//       CGSTAmount: cgstAmount,
//       SGSTPercentage: sgst,
//       SGSTAmount: sgstAmount,
//       IGSTPercentage: igst,
//       IGSTAmount: igstAmount,
//       DiscountAmt: discount,
//     };
//     // console.log("newRow", newRow);
//     // Update rows state and ensure the new row is added to the table
//     setRows((prevRows) => [...prevRows, newRow]);
//   };

//   const [subTotalcal, setSubTotalCal] = useState(0);
//   const [cgstTotal, setCgstTotal] = useState(0);
//   const [igstTotal, setIgstTotal] = useState(0);
//   const [sgstTotal, setSgstTotal] = useState(0);
//   const [total, setTotal] = useState(0);

//   const received = parseFloat(receivedAmount) || 0;
//   const grandTotal = parseFloat(total) || 0;

//   const difference = received - grandTotal;

//   const refund = difference > 0 ? difference : 0;

//   const balanceDue = difference < 0 ? Math.abs(difference) : 0;

//   const validateReceivedAmount = (totalToValidate = total) => {
//     const receivedValue =
//       receivedAmount === "" ? NaN : parseFloat(receivedAmount);

//     const totalValue = parseFloat(totalToValidate) || 0;

//     // =====================================================
//     // 1. RECEIVED AMOUNT REQUIRED
//     // =====================================================

//     if (receivedAmount === "" || Number.isNaN(receivedValue)) {
//       toast.error(
//         `Please enter received amount. Total ₹${totalValue.toFixed(2)}`,
//       );

//       receivedAmountRef.current?.focus();
//       receivedAmountRef.current?.select();

//       return false;
//     }

//     // =====================================================
//     // 2. RECEIVED AMOUNT CANNOT BE GREATER THAN TOTAL
//     // =====================================================

//     if (receivedValue > totalValue) {
//       const extraAmount = receivedValue - totalValue;

//       toast.error(
//         `Received amount ₹${receivedValue.toFixed(
//           2,
//         )} cannot be greater than Total ₹${totalValue.toFixed(
//           2,
//         )}. Extra amount ₹${extraAmount.toFixed(2)} is not allowed.`,
//       );

//       receivedAmountRef.current?.focus();
//       receivedAmountRef.current?.select();

//       return false;
//     }

//     // =====================================================
//     // 3. RECEIVED LESS THAN TOTAL = ALLOWED
//     // =====================================================

//     const balanceAmount = totalValue - receivedValue;

//     // console.log("TOTAL:", totalValue);

//     // console.log("RECEIVED:", receivedValue);

//     // console.log("BALANCE DUE:", balanceAmount);

//     return true;
//   };

//   const handleCashAmountChange = (e) => {
//     const value = e.target.value;

//     if (Number(value) < 0) {
//       return;
//     }

//     setCashAmount(value);

//     const cash = Number(value) || 0;
//     const online = Number(onlineAmount) || 0;

//     setReceivedAmount((cash + online).toString());
//   };

//   const handleReceivedAmountChange = (e) => {
//     const value = e.target.value;

//     if (value === "") {
//       setReceivedAmount("");

//       if (paymentMode === "M") {
//         setCashAmount("");
//         setOnlineAmount("");
//       }

//       return;
//     }

//     // Total पेक्षा जास्त amount सुद्धा type करू द्या.
//     // Example:
//     // Total = 2000
//     // Received = 3000
//     // Refund = 1000

//     setReceivedAmount(value);

//     if (paymentMode === "M") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }
//   };

//   const handleOnlineAmountChange = (e) => {
//     const value = e.target.value;

//     if (Number(value) < 0) {
//       return;
//     }

//     setOnlineAmount(value);

//     const cash = Number(cashAmount) || 0;
//     const online = Number(value) || 0;

//     setReceivedAmount((cash + online).toString());
//   };

//   const validatePaymentSplit = () => {
//     if (paymentMode !== "M") {
//       return true;
//     }

//     const received = parseFloat(receivedAmount) || 0;
//     const cash = parseFloat(cashAmount) || 0;
//     const online = parseFloat(onlineAmount) || 0;

//     const splitTotal = cash + online;

//     if (Math.abs(splitTotal - received) > 0.001) {
//       toast.error(`Cash + Online amount must be ₹${received.toFixed(2)}`);

//       return false;
//     }

//     return true;
//   };

//   const isPaid = difference === 0 && received > 0;

//   const calculations = () => {
//     // =====================================================
//     // 1. NORMAL SAVED ROWS TOTAL
//     // =====================================================

//     let subtotal = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.Amount) || 0),
//       0,
//     );

//     let totalCGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
//       0,
//     );

//     let totalSGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
//       0,
//     );

//     let totalIGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
//       0,
//     );

//     // =====================================================
//     // 2. LAST PRODUCT - ENTER NOT PRESSED
//     // =====================================================

//     const pendingProductExists =
//       editingRow === null &&
//       selectedProductID &&
//       quantity !== "" &&
//       rate !== "" &&
//       Number(quantity) > 0 &&
//       Number(rate) > 0;

//     if (pendingProductExists) {
//       const pendingQuantity = parseFloat(quantity) || 0;

//       const pendingRate = parseFloat(rate) || 0;

//       const pendingAmount = pendingQuantity * pendingRate;

//       // Add pending product amount to subtotal
//       subtotal += pendingAmount;

//       // GST - only for backend/internal calculation
//       const pendingCGST =
//         parseFloat(cgstAmount) ||
//         ((parseFloat(cgst) || 0) * pendingAmount) / 100;

//       const pendingSGST =
//         parseFloat(sgstAmount) ||
//         ((parseFloat(sgst) || 0) * pendingAmount) / 100;

//       const pendingIGST =
//         parseFloat(igstAmount) ||
//         ((parseFloat(igst) || 0) * pendingAmount) / 100;

//       totalCGST += pendingCGST;
//       totalSGST += pendingSGST;
//       totalIGST += pendingIGST;

//       // console.log("PENDING LAST PRODUCT:", {
//       //   ProductId: selectedProductID,
//       //   Quantity: pendingQuantity,
//       //   Rate: pendingRate,
//       //   Amount: pendingAmount,
//       // });
//     }

//     // =====================================================
//     // 3. UPDATE SUBTOTAL
//     // =====================================================

//     setSubTotalCal(subtotal.toFixed(2));

//     // =====================================================
//     // 4. UPDATE GST TOTALS
//     // =====================================================

//     setCgstTotal(totalCGST.toFixed(2));

//     setSgstTotal(totalSGST.toFixed(2));

//     setIgstTotal(totalIGST.toFixed(2));

//     // =====================================================
//     // 5. DISCOUNT
//     // =====================================================

//     const discountValue = parseFloat(discount) || 0;

//     // =====================================================
//     // 6. TRANSPORT
//     // =====================================================

//     const transportValue = parseFloat(transport) || 0;

//     // =====================================================
//     // 7. FINAL TOTAL
//     // =====================================================

//     const totalBeforeDiscount = subtotal;

//     const afterDiscount = Math.max(totalBeforeDiscount - discountValue, 0);

//     const grandTotal = afterDiscount + transportValue;

//     // =====================================================
//     // 8. UPDATE TOTAL
//     // =====================================================

//     setTotal(grandTotal.toFixed(2));

//     // console.log("DISPLAY TOTAL INCLUDING PENDING PRODUCT:", grandTotal);
//   };

//   useEffect(() => {
//     calculations();
//   }, [
//     rows,
//     transport,
//     discount,
//     selectedProductID,
//     quantity,
//     rate,
//     editingRow,
//     cgst,
//     cgstAmount,
//     sgst,
//     sgstAmount,
//     igst,
//     igstAmount,
//   ]);

//   //
//   const [anchorEl1, setAnchorEl1] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);

//   const handleMenutableOpen = (event, index) => {
//     setAnchorEl1(event.currentTarget);
//     setSelectedRow(index);
//   };

//   const handletableMenuClose = () => {
//     setAnchorEl1(null);
//     setSelectedRow(null);
//   };

//   const handleEditRow = (index) => {
//     const row = rows[index];

//     if (!row) {
//       toast.error("Product row not found.");
//       return;
//     }

//     // console.log("========== EDIT PRODUCT ROW ==========");
//     // console.log("EDIT ROW INDEX:", index);
//     // console.log("EDIT ROW DATA:", row);

//     // Set row in edit mode
//     setEditingRow(index);

//     // Product
//     setSelectedProductId(row.ProductId);
//     setProductName(row.ProductName || "");

//     // Quantity
//     const q =
//       row.Quantity !== null && row.Quantity !== undefined
//         ? String(row.Quantity)
//         : "";

//     setQuantity(q);

//     // Rate
//     const r =
//       row.Rate !== null && row.Rate !== undefined ? String(row.Rate) : "";

//     setRate(r);

//     // Calculate amount
//     const qtyNum = parseFloat(q) || 0;
//     const rateNum = parseFloat(r) || 0;

//     const baseAmt = qtyNum * rateNum;

//     setBaseAmount(baseAmt);
//     SetAmount(baseAmt);

//     // GST values
//     setCGST(row.CGSTPercentage || 0);
//     setSGST(row.SGSTPercentage || 0);
//     setIGST(row.IGSTPercentage || 0);

//     calculateCgstAmount(row.CGSTPercentage || 0, baseAmt);

//     calculateSgstAmount(row.SGSTPercentage || 0, baseAmt);

//     calculateIgstAmount(row.IGSTPercentage || 0, baseAmt);

//     // console.log("EDIT PRODUCT VALUES:", {
//     //   ProductId: row.ProductId,
//     //   ProductName: row.ProductName,
//     //   Quantity: q,
//     //   Rate: r,
//     //   Amount: baseAmt,
//     // });

//     // console.log("======================================");
//   };

//   const handleDeleteRow = (index) => {
//     const updatedRows = [...rows];
//     updatedRows.splice(index, 1);
//     setRows(updatedRows);
//   };

//   const addProductRow = (productData = null) => {
//     const productId = productData?.value || selectedProductID;

//     if (!productId) {
//       return;
//     }

//     const productLabel = productData?.label || productName || "";

//     const qty = parseFloat(productData?.quantity ?? quantity) || 1;

//     const rt = parseFloat(productData?.rate ?? rate) || 0;

//     const cgstValue = parseFloat(productData?.cgst ?? cgst) || 0;

//     const sgstValue = parseFloat(productData?.sgst ?? sgst) || 0;

//     const igstValue = parseFloat(productData?.igst ?? igst) || 0;

//     // Product Amount
//     const baseAmt = qty * rt;

//     // GST amounts
//     const cgstValueAmount = (cgstValue * baseAmt) / 100;

//     const sgstValueAmount = (sgstValue * baseAmt) / 100;

//     const igstValueAmount = (igstValue * baseAmt) / 100;

//     const newRow = {
//       Id: null,
//       InvoiceId: null,

//       ProductId: productId,
//       ProductName: productLabel,

//       Quantity: qty,
//       Rate: rt,

//       // Product level discount नाही
//       Amount: baseAmt,

//       DiscountAmt: 0,

//       CGSTPercentage: cgstValue,
//       CGSTAmount: cgstValueAmount,

//       SGSTPercentage: sgstValue,
//       SGSTAmount: sgstValueAmount,

//       IGSTPercentage: igstValue,
//       IGSTAmount: igstValueAmount,
//     };

//     setRows((prevRows) => [...prevRows, newRow]);

//     // Clear only product-entry fields
//     setSelectedProductId("");
//     setSelectedProductName("");
//     setProductName("");

//     setQuantity("");
//     setRate("");
//     SetAmount("");

//     setCGST("");
//     setCGSTAmount("");

//     setSGST("");
//     setSGSTAmount("");

//     setIGST("");
//     setIGSTAmount("");
//   };

//   // ============================================================
//   // ENTER = SELECT HIGHLIGHTED PRODUCT
//   // ============================================================

//   const handleProductSelectKeyDown = (event) => {
//     // ----------------------------------------------------------
//     // Only handle ENTER
//     // ----------------------------------------------------------

//     if (event.key !== "Enter") {
//       return;
//     }

//     event.preventDefault();
//     event.stopPropagation();

//     // ----------------------------------------------------------
//     // Find highlighted product
//     // MUI uses .Mui-focused for the currently highlighted option
//     // ----------------------------------------------------------

//     const highlightedOption =
//       document.querySelector(".MuiAutocomplete-option.Mui-focused") ||
//       document.querySelector('.MuiAutocomplete-option[aria-selected="true"]');

//     // ----------------------------------------------------------
//     // Product found → select it
//     // ----------------------------------------------------------

//     if (highlightedOption) {
//       highlightedOption.click();

//       // --------------------------------------------------------
//       // After product selection → Quantity field
//       // --------------------------------------------------------

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }

//     // ----------------------------------------------------------
//     // No product highlighted
//     // ----------------------------------------------------------

//     toast.error("Please select a product.");
//   };

//   const handleSaveOrAddRow = () => {
//     // =====================================================
//     // 1. PRODUCT VALIDATION
//     // =====================================================
//     if (!selectedProductID) {
//       toast.error("Please select a product.");

//       setTimeout(() => {
//         productRef.current?.focus();
//       }, 100);

//       return;
//     }

//     // =====================================================
//     // 2. QUANTITY VALIDATION
//     // =====================================================
//     const finalQuantity = parseFloat(quantity);

//     if (Number.isNaN(finalQuantity) || finalQuantity <= 0) {
//       toast.error("Please enter quantity.");

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }

//     // =====================================================
//     // 3. RATE VALIDATION
//     // =====================================================
//     const finalRate = parseFloat(rate);

//     if (Number.isNaN(finalRate) || finalRate <= 0) {
//       toast.error("Please enter rate.");

//       setTimeout(() => {
//         rateRef.current?.focus();
//         rateRef.current?.select();
//       }, 100);

//       return;
//     }

//     // =====================================================
//     // 4. CALCULATE AMOUNT
//     // =====================================================
//     const finalAmount = finalQuantity * finalRate;

//     // =====================================================
//     // 5. FIND SELECTED PRODUCT
//     // =====================================================
//     const selectedOption = productOptions.find(
//       (option) => String(option.value) === String(selectedProductID),
//     );

//     // =====================================================
//     // 6. PRODUCT NAME
//     // =====================================================
//     const finalProductName =
//       productName || selectedOption?.label || selectedProductName || "";

//     // =====================================================
//     // 7. EDIT EXISTING ROW
//     // =====================================================
//     if (editingRow !== null) {
//       const updatedRows = [...rows];

//       updatedRows[editingRow] = {
//         ...updatedRows[editingRow],

//         ProductId: selectedProductID,

//         ProductName: finalProductName,

//         Quantity: finalQuantity,

//         Rate: finalRate,

//         Amount: finalAmount,
//       };

//       // console.log("UPDATED PRODUCT ROW:", updatedRows[editingRow]);

//       // Update rows
//       setRows(updatedRows);

//       // Editing completed
//       setEditingRow(null);
//     } else {
//       // ===================================================
//       // 8. ADD NEW PRODUCT ROW
//       // ===================================================

//       const newRow = {
//         InvoiceId: null,

//         ProductId: selectedProductID,

//         ProductName: finalProductName,

//         Quantity: finalQuantity,

//         Rate: finalRate,

//         Amount: finalAmount,
//       };

//       // console.log("NEW PRODUCT ROW:", newRow);

//       // Add new row
//       setRows((prevRows) => [...prevRows, newRow]);
//     }

//     // =====================================================
//     // 9. CLEAR CURRENT INPUTS
//     // =====================================================
//     resetFields();

//     // =====================================================
//     // 10. FOCUS NEXT PRODUCT
//     // =====================================================
//     setTimeout(() => {
//       productRef.current?.focus();

//       setProductDropdownOpen(true);
//     }, 150);
//   };

//   const resetFields = () => {
//     setSelectedProductId("");
//     setProductName("");
//     setSelectedProductName("");
//     setQuantity("");
//     setRate("");
//     SetAmount("");
//     setCGST("");
//     setCGSTAmount("");
//     setSGST("");
//     setSGSTAmount("");
//     setIGST("");
//     setIGSTAmount("");
//   };

//   //get company master
//   const [gstNo, setGstNO] = useState("");

//   const fetchCompanyMaster = async () => {
//     try {
//       const response = await axios.get(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=companymaster",
//         { maxBodyLength: Infinity },
//       );
//       console.log(response.data);
//       console.log(" Company GST NO:", response.data[0].GSTNo);
//       setGstNO(response.data[0].GSTNo);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyMaster();
//   }, []);

//   //for serchApi
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [text, setText] = useState("");

//   const serchCustomers = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     try {
//       // =====================================================
//       // DO NOT SEARCH EMPTY TEXT
//       // =====================================================

//       if (!text || !text.trim()) {
//         setAccountOptions([]);
//         return;
//       }

//       // =====================================================
//       // GET CUSTOMER ACCOUNTS
//       // TypeCode=C means Customer Account
//       // =====================================================

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${encodeURIComponent(
//           text.trim(),
//         )}`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Customer Search API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const customers = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : [];

//       // =====================================================
//       // CHECK ADDRESS CUSTOMER TYPE
//       // ONLY R = REGULAR / RETAILER
//       // =====================================================

//       const regularCustomers = (
//         await Promise.all(
//           customers.map(async (customer) => {
//             const accountId =
//               customer?.Id || customer?.AccountId || customer?.AccountID;

//             if (!accountId) {
//               return null;
//             }

//             try {
//               const addressResponse = await fetch(
//                 `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`,
//                 requestOptions,
//               );

//               if (!addressResponse.ok) {
//                 return null;
//               }

//               const addressResult = await addressResponse.json();

//               const addressData = Array.isArray(addressResult)
//                 ? addressResult[0] || null
//                 : Array.isArray(addressResult?.data)
//                   ? addressResult.data[0] || null
//                   : addressResult?.data || addressResult || null;

//               const customerType = String(
//                 addressData?.CustomerType ||
//                   addressData?.customerType ||
//                   customer?.CustomerType ||
//                   customer?.customerType ||
//                   "",
//               )
//                 .trim()
//                 .toUpperCase();

//               if (customerType !== PAGE_CUSTOMER_TYPE) {
//                 return null;
//               }

//               return {
//                 ...customer,
//                 CustomerType: customerType,
//                 addressDetails: addressData,
//               };
//             } catch (error) {
//               console.error(
//                 `Address fetch failed for AccountId ${accountId}:`,
//                 error,
//               );

//               return null;
//             }
//           }),
//         )
//       ).filter(Boolean);

//       // console.log("REGULAR CUSTOMER SEARCH RESULT:", regularCustomers);

//       setAccountOptions(regularCustomers);
//     } catch (error) {
//       console.error("Regular customer search error:", error);
//       setAccountOptions([]);
//     }
//   };

//   useEffect(() => {
//     serchCustomers();
//   }, [text]);

//   // create new Customer
//   const [accountName, setAccountName] = useState("");
//   const [customerName, setCustomerName] = useState("");

//   const Namevalidation = () => {
//     let temp = accountName.split(" ");
//     let surname = temp[1];
//     if (surname && surname.length >= 1) {
//       return true;
//     } else {
//       toast.error("Need to Insert First and last Name ");
//       return false;
//     }
//   };

//   const [customerGSTNo, setCustomerGSTNo] = useState("");

//   const CreateCustomerMaster = async () => {
//     // ============================================================
//     // 1. CUSTOMER NAME VALIDATION
//     // ============================================================

//     if (!Namevalidation()) {
//       return;
//     }

//     // ============================================================
//     // 2. HEADERS
//     // ============================================================

//     const myHeaders = new Headers();

//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     try {
//       // ============================================================
//       // 3. CREATE CUSTOMER ACCOUNT
//       // ============================================================

//       const urlencoded = new URLSearchParams();

//       urlencoded.append("AccountName", accountName.trim());

//       urlencoded.append("GroupId", "3");

//       urlencoded.append("SubGroupId", "1");

//       // KEEP YOUR EXISTING REQUIREMENT
//       urlencoded.append("OpeningBalance", "100");

//       urlencoded.append("DrORCr", "D");

//       urlencoded.append("TypeCode", "C");

//       urlencoded.append("IsSystem", "false");

//       // console.log(
//       //   "CREATE CUSTOMER ACCOUNT DATA:",
//       //   Object.fromEntries(urlencoded),
//       // );

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: urlencoded,
//           redirect: "follow",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Account API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       // console.log("CUSTOMER CREATED:", result);

//       // ============================================================
//       // 4. CHECK CUSTOMER ID
//       // ============================================================

//       if (!result || !result.Id) {
//         throw new Error("Customer ID not received from API.");
//       }

//       const newCustomerId = result.Id;

//       // ============================================================
//       // 5. CREATE CUSTOMER ADDRESS / CONTACT DETAILS
//       // ============================================================

//       const addressData = new URLSearchParams();

//       // CUSTOMER ID
//       addressData.append("AccountId", newCustomerId);

//       // REGULAR CUSTOMER
//       addressData.append("CustomerType", "R");

//       // EXISTING GST LOGIC
//       addressData.append("GSTNo", "270000000000000");

//       // ============================================================
//       // ADDRESS - OPTIONAL
//       // ============================================================

//       addressData.append("Address1", newCustomerAddress.trim());

//       addressData.append("Address", newCustomerAddress.trim());

//       // ============================================================
//       // MOBILE NUMBER - OPTIONAL
//       // ============================================================

//       addressData.append("MobileNo", newCustomerMobile.trim());

//       // ============================================================
//       // TELEPHONE / LAND PHONE - OPTIONAL
//       // ============================================================

//       // console.log("CUSTOMER ADDRESS DATA:", Object.fromEntries(addressData));

//       // ============================================================
//       // 6. SAVE ADDRESS / MOBILE / TELEPHONE
//       // ============================================================

//       const addressResponse = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: addressData,
//           redirect: "follow",
//         },
//       );

//       if (!addressResponse.ok) {
//         throw new Error(`Address API failed: ${addressResponse.status}`);
//       }

//       // Some APIs may return empty response,
//       // so don't blindly call response.json()
//       const addressResponseText = await addressResponse.text();

//       let addressResult = null;

//       try {
//         addressResult = addressResponseText
//           ? JSON.parse(addressResponseText)
//           : null;
//       } catch (jsonError) {
//         console.warn("Address API response is not JSON:", addressResponseText);
//       }

//       // console.log("ADDRESS / CONTACT SAVED:", addressResult);

//       // ============================================================
//       // 7. ADD NEW CUSTOMER TO LOCAL DROPDOWN
//       // ============================================================

//       const newCustomer = {
//         Id: newCustomerId,

//         AccountName: accountName.trim(),

//         CustomerType: "R",

//         Address1: newCustomerAddress.trim(),

//         Address: newCustomerAddress.trim(),

//         MobileNo: newCustomerMobile.trim(),
//       };

//       setAccountOptions((previousOptions) => {
//         const alreadyExists = previousOptions.some(
//           (customer) => String(customer.Id) === String(newCustomerId),
//         );

//         if (alreadyExists) {
//           return previousOptions;
//         }

//         return [newCustomer, ...previousOptions];
//       });

//       // ============================================================
//       // 8. SELECT NEW CUSTOMER AUTOMATICALLY
//       // ============================================================

//       setSelectedAccount(String(newCustomerId));

//       setSelectedCustomerName(accountName.trim());

//       setSelectedCustomerAddress(newCustomerAddress.trim());

//       // If mobile is entered,
//       // show it in Sales Entry Contact Number
//       if (newCustomerMobile.trim()) {
//         setPhone(newCustomerMobile.trim());
//       }

//       // ============================================================
//       // 9. CLOSE CUSTOMER POPUP
//       // ============================================================

//       setShowDropdown(false);

//       // ============================================================
//       // 10. CLEAR CREATE CUSTOMER FIELDS
//       // ============================================================

//       setAccountName("");

//       setNewCustomerAddress("");

//       setNewCustomerMobile("");

//       setText("");

//       // ============================================================
//       // 11. SUCCESS MESSAGE
//       // ============================================================

//       toast.success("Customer created successfully");
//     } catch (error) {
//       console.error("Error creating customer:", error);

//       toast.error(error.message || "Unable to create customer");
//     }
//   };

//   //set GSTno

//   const fetchAccounts = async (customerId) => {
//     if (!customerId) {
//       setacctGSTNo("");
//       setCustomerAddress1("");
//       setCustomerAddress2("");
//       setCustomerAddress3("");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       const result = await response.json();

//       const temp = Array.isArray(result) ? result[0] : null;

//       // console.log("Customer Address API Response:", temp);

//       setacctGSTNo(String(temp?.GSTNo ?? ""));
//       setCustomerAddress1(temp?.Address1 ?? "");
//       setCustomerAddress2(temp?.Address2 ?? "");
//       setCustomerAddress3(temp?.Address3 ?? "");
//     } catch (error) {
//       console.error("Customer details fetch error:", error);

//       setacctGSTNo("");
//       setCustomerAddress1("");
//       setCustomerAddress2("");
//       setCustomerAddress3("");
//     }
//   };

//   const fetchAccountName = (acctname) => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${acctname}`,
//       requestOptions,
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         //console.log('accountname', result)

//         setAccountOptions(Array.isArray(result) ? result : []);
//       })
//       .catch((error) => console.error(error));
//   };

//   //

//   const handleItemChange = (newValue) => {
//     if (newValue) {
//       setSelectedProductId(newValue.value);
//       setProductName(newValue.label);
//       setSelectedProductName(newValue.label);

//       // Default Quantity
//       const defaultQty = 1;

//       // Regular Rate automatically comes from ProductMaster API
//       const defaultRate = parseFloat(newValue.purchaseRate) || 0;

//       setRate(defaultRate);

//       setQuantity(defaultQty);
//       setRate(defaultRate);

//       // GST calculation
//       const sameState = gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2);

//       const cgstValue = sameState ? newValue.cgst : "0";
//       const sgstValue = sameState ? newValue.sgst : "0";
//       const igstValue = !sameState ? newValue.igst : "0";

//       setCGST(cgstValue);
//       setSGST(sgstValue);
//       setIGST(igstValue);

//       // Calculate amount using default quantity and Regular rate
//       calculateAmount(defaultQty, defaultRate);
//     } else {
//       setSelectedProductId("");
//       setProductName("");
//       setSelectedProductName("");

//       setQuantity("");
//       setRate("");

//       setCGST("0");
//       setSGST("0");
//       setIGST("0");

//       SetAmount("");
//     }
//   };

//   ///Pagination
//   const [totalPages, setTotalPages] = useState(1);
//   //validation
//   const [errors, setErrors] = useState({
//     invoiceDate: "",
//     selectedAccount: "",
//     paymentMode: "",
//     rows: "",
//   });

//   const validateForm = (rowsToValidate = rows) => {
//     const newErrors = {
//       invoiceDate: "",
//       selectedAccount: "",
//       paymentMode: "",
//       rows: "",
//     };

//     let isValid = true;

//     // ==========================================
//     // INVOICE DATE
//     // ==========================================
//     if (!invoiceDate) {
//       newErrors.invoiceDate = "Invoice date is required";
//       isValid = false;
//     } else {
//       const invoiceDateObj = new Date(invoiceDate);

//       // Remove time from invoice date
//       invoiceDateObj.setHours(0, 0, 0, 0);

//       // Financial year dates
//       const financialFromDate = Cookies.get("FromDate");
//       const financialToDate = Cookies.get("ToDate");

//       if (financialFromDate && financialToDate) {
//         const fromDateObj = new Date(financialFromDate);
//         const toDateObj = new Date(financialToDate);

//         // Remove time from financial year dates
//         fromDateObj.setHours(0, 0, 0, 0);
//         toDateObj.setHours(0, 0, 0, 0);

//         if (invoiceDateObj < fromDateObj) {
//           newErrors.invoiceDate = `Invoice date cannot be before ${fromDateObj.toLocaleDateString()}`;
//           isValid = false;
//         } else if (invoiceDateObj > toDateObj) {
//           newErrors.invoiceDate = `Invoice date cannot be after ${toDateObj.toLocaleDateString()}`;
//           isValid = false;
//         }
//       }
//     }

//     // ==========================================
//     // PAYMENT MODE
//     // ==========================================
//     if (!paymentMode) {
//       newErrors.paymentMode = "Payment mode is required";
//       isValid = false;
//     }

//     // ==========================================
//     // PRODUCT ROWS
//     // ==========================================
//     if (rowsToValidate.length === 0) {
//       newErrors.rows = "Please add at least one product";
//       isValid = false;
//     }

//     setErrors(newErrors);

//     return isValid;
//   };

//   //for yearId
//   const [yearid, setYearId] = useState("");

//   useEffect(() => {
//     const storedYearId = Cookies.get("YearId");
//     const storedfromdate = Cookies.get("FromDate");
//     const storedtodate = Cookies.get("ToDate");

//     if (storedYearId) {
//       setYearId(storedYearId);
//     } else {
//       toast.error("Year is not set.");
//     }

//     if (storedfromdate) {
//       setFinancialYearFromDate(storedfromdate);
//     } else {
//       toast.error("FromDate is not set.");
//     }

//     if (storedtodate) {
//       setFinancialYearToDate(storedtodate);
//     } else {
//       toast.error("ToDate is not set.");
//     }
//   }, []);

//   useEffect(() => {
//     const storedUserId = sessionStorage.getItem("UserId");

//     if (storedUserId) {
//       setUserId(storedUserId);
//     } else {
//       toast.error("User is not logged in.");
//     }
//   }, []);

//   //for print
//   // ============================================================
//   // SALES ENTRY - 80MM THERMAL ROLL PRINT
//   // ============================================================

//   const generatePDF = async (printData = previewData, printWindow = null) => {
//     // ============================================================
//     // 1. CHECK INVOICE DATA
//     // ============================================================

//     if (!printData) {
//       toast.error("No invoice data available for printing.");

//       if (printWindow && !printWindow.closed) {
//         printWindow.close();
//       }

//       return;
//     }

//     // console.log("========================================");
//     // console.log("INVOICE PRINT START");
//     // console.log("PRINT DATA:", printData);
//     // console.log("SELECTED ACCOUNT:", selectedAccount);
//     // console.log("========================================");

//     // ============================================================
//     // 2. GET ACCOUNT ID
//     // ============================================================

//     let accountId = "";

//     accountId =
//       printData?.AccountId ||
//       printData?.AccountID ||
//       printData?.CustomerId ||
//       printData?.CustomerID ||
//       printData?.CustomerAccountId ||
//       printData?.CustomerAccountID ||
//       printData?.accountDetails?.Id ||
//       printData?.accountDetails?.AccountId ||
//       "";

//     // ============================================================
//     // 3. GET ACCOUNT ID FROM selectedAccount
//     // ============================================================

//     if (!accountId && selectedAccount) {
//       if (typeof selectedAccount === "object") {
//         accountId =
//           selectedAccount?.Id ||
//           selectedAccount?.ID ||
//           selectedAccount?.AccountId ||
//           selectedAccount?.AccountID ||
//           selectedAccount?.CustomerId ||
//           selectedAccount?.CustomerID ||
//           selectedAccount?.value ||
//           selectedAccount?.id ||
//           "";
//       } else {
//         accountId = selectedAccount;
//       }
//     }

//     // ============================================================
//     // 4. CUSTOMER VARIABLES
//     // ============================================================

//     let customerName = "";
//     let customerAddress1 = "";
//     let customerAddress2 = "";
//     let customerAddress3 = "";
//     let customerMobileNo = "";

//     // ============================================================
//     // 5. FETCH CUSTOMER NAME + CONTACT + ADDRESS
//     // ============================================================

//     if (accountId) {
//       try {
//         // ----------------------------------------------------------
//         // 5A. ACCOUNT API
//         // ----------------------------------------------------------

//         const accountResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//             accountId,
//           )}`,
//         );

//         if (!accountResponse.ok) {
//           throw new Error(
//             `Account API failed with status ${accountResponse.status}`,
//           );
//         }

//         const accountResult = await accountResponse.json();

//         const accountData = Array.isArray(accountResult)
//           ? accountResult[0] || null
//           : Array.isArray(accountResult?.data)
//             ? accountResult.data[0] || null
//             : accountResult?.data || accountResult || null;

//         console.log("PRINT ACCOUNT DATA:", accountData);

//         // ----------------------------------------------------------
//         // CUSTOMER NAME
//         // ----------------------------------------------------------

//         customerName =
//           accountData?.AccountName || accountData?.accountName || "";

//         // ----------------------------------------------------------
//         // CUSTOMER CONTACT
//         // ----------------------------------------------------------

//         customerMobileNo =
//           accountData?.MobileNo ||
//           accountData?.MobileNumber ||
//           accountData?.ContactNo ||
//           accountData?.ContactNumber ||
//           accountData?.PhoneNo ||
//           accountData?.PhoneNumber ||
//           "";

//         // ----------------------------------------------------------
//         // 5B. ADDRESS API
//         // ----------------------------------------------------------

//         const addressResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
//             accountId,
//           )}`,
//         );

//         if (!addressResponse.ok) {
//           throw new Error(
//             `Address API failed with status ${addressResponse.status}`,
//           );
//         }

//         const addressResult = await addressResponse.json();

//         const addressData = Array.isArray(addressResult)
//           ? addressResult[0] || null
//           : Array.isArray(addressResult?.data)
//             ? addressResult.data[0] || null
//             : addressResult?.data || addressResult || null;

//         // console.log("PRINT ADDRESS DATA:", addressData);

//         if (addressData) {
//           customerAddress1 =
//             addressData?.Address1 || addressData?.address1 || "";

//           customerAddress2 =
//             addressData?.Address2 || addressData?.address2 || "";

//           customerAddress3 =
//             addressData?.Address3 || addressData?.address3 || "";
//         }
//       } catch (error) {
//         console.error("PRINT CUSTOMER DETAILS ERROR:", error);
//       }
//     }

//     // ============================================================
//     // 6. FALLBACK CUSTOMER NAME
//     // ============================================================

//     if (!customerName) {
//       customerName =
//         printData?.accountDetails?.AccountName || printData?.customerName || "";
//     }

//     // ============================================================
//     // 7. FALLBACK ADDRESS 1
//     // ============================================================

//     if (!customerAddress1) {
//       customerAddress1 =
//         printData?.accountDetails?.Address1 || printData?.Address1 || "";
//     }

//     // ============================================================
//     // 8. FALLBACK ADDRESS 2
//     // ============================================================

//     if (!customerAddress2) {
//       customerAddress2 =
//         printData?.accountDetails?.Address2 || printData?.Address2 || "";
//     }

//     // ============================================================
//     // 9. FALLBACK ADDRESS 3
//     // ============================================================

//     if (!customerAddress3) {
//       customerAddress3 =
//         printData?.accountDetails?.Address3 || printData?.Address3 || "";
//     }

//     // ============================================================
//     // 10. CONTACT NUMBER
//     // ============================================================

//     const contactNo =
//       customerMobileNo ||
//       printData?.ContactNo ||
//       printData?.ContactNumber ||
//       printData?.MobileNo ||
//       printData?.MobileNumber ||
//       printData?.PhoneNo ||
//       "";

//     // ============================================================
//     // 11. DEBUG
//     // ============================================================

//     // console.log("========================================");
//     // console.log("FINAL CUSTOMER INFORMATION");
//     // console.log("ACCOUNT ID:", accountId);
//     // console.log("CUSTOMER NAME:", customerName);
//     // console.log("ADDRESS 1:", customerAddress1);
//     // console.log("ADDRESS 2:", customerAddress2);
//     // console.log("ADDRESS 3:", customerAddress3);
//     // console.log("MOBILE:", contactNo);
//     // console.log("========================================");

//     // ============================================================
//     // 12. CREATE 80MM ROLL PDF
//     // ============================================================

//     const ROLL_WIDTH = 80;
//     const ROLL_HEIGHT = 300;

//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: [ROLL_WIDTH, ROLL_HEIGHT],
//     });

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     // ============================================================
//     // 13. INVOICE NUMBER
//     // ============================================================

//     const invoiceNo =
//       printData?.InvoiceNo ||
//       printData?.InvoiceNumber ||
//       printData?.BillNo ||
//       printData?.BillNumber ||
//       printData?.invoiceNo ||
//       "";

//     // ============================================================
//     // 14. DATE
//     // ============================================================

//     let invoiceDateText = "-";

//     try {
//       if (printData?.InvoiceDate?.date) {
//         invoiceDateText = moment(printData.InvoiceDate.date).format(
//           "DD-MM-YYYY",
//         );
//       } else if (printData?.InvoiceDate) {
//         invoiceDateText = moment(printData.InvoiceDate).format("DD-MM-YYYY");
//       }
//     } catch (error) {
//       console.error("Invoice date formatting error:", error);

//       invoiceDateText = "-";
//     }

//     // ============================================================
//     // 15. TIME
//     // ============================================================

//     const invoiceTime = moment().format("hh:mm A");

//     // ============================================================
//     // 16. COMPANY DETAILS
//     // ============================================================

//     const companyName = "AMRUT MILK PRODUCTS 2";

//     const companyAddress1 = "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER";

//     const companyAddress2 = "KOLHAPUR.";

//     const companyPhone = "8830261523";

//     const companyState = "27-Maharashtra";

//     // ============================================================
//     // 17. IMAGE TO DATA URL
//     // ============================================================

//     const imageToDataURL = (imageSource) => {
//       return new Promise((resolve, reject) => {
//         if (!imageSource) {
//           reject(new Error("Image source is empty."));
//           return;
//         }

//         if (
//           typeof imageSource === "string" &&
//           imageSource.startsWith("data:image")
//         ) {
//           resolve(imageSource);
//           return;
//         }

//         const img = new Image();

//         img.onload = () => {
//           try {
//             const canvas = document.createElement("canvas");

//             canvas.width = img.naturalWidth || img.width;

//             canvas.height = img.naturalHeight || img.height;

//             const ctx = canvas.getContext("2d");

//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//             resolve(canvas.toDataURL("image/png"));
//           } catch (error) {
//             reject(error);
//           }
//         };

//         img.onerror = () => {
//           reject(new Error(`Unable to load image: ${imageSource}`));
//         };

//         img.src = imageSource;
//       });
//     };

//     // ============================================================
//     // 18. LOAD LOGOS
//     // ============================================================

//     let amrutLogoData = null;
//     let fremilaLogoData = null;

//     try {
//       amrutLogoData = await imageToDataURL(amrutLogo);
//     } catch (error) {
//       console.error("Amrut Siddhi logo error:", error);
//     }

//     try {
//       fremilaLogoData = await imageToDataURL(fremilaLogo);
//     } catch (error) {
//       console.error("Fremila logo error:", error);
//     }

//     // ============================================================
//     // 19. MARGINS
//     // ============================================================

//     const leftMargin = 4;
//     const rightMargin = 4;

//     const contentWidth = pageWidth - leftMargin - rightMargin;

//     // ============================================================
//     // 20. OUTER BORDER
//     // ============================================================

//     doc.setLineWidth(0.4);

//     doc.rect(leftMargin, 4, contentWidth, pageHeight - 8);

//     // ============================================================
//     // 21. HEADER
//     // ============================================================

//     let y = 11;

//     // ============================================================
//     // AMRUT LOGO
//     // ============================================================

//     if (amrutLogoData) {
//       try {
//         doc.addImage(amrutLogoData, "PNG", pageWidth - 25, 7, 18, 12);
//       } catch (error) {
//         console.error("Amrut Siddhi PDF logo error:", error);
//       }
//     }

//     // ============================================================
//     // FREMILA LOGO
//     // ============================================================

//     if (fremilaLogoData) {
//       try {
//         doc.addImage(fremilaLogoData, "PNG", pageWidth - 25, 20, 18, 12);
//       } catch (error) {
//         console.error("Fremila PDF logo error:", error);
//       }
//     }

//     // ============================================================
//     // COMPANY NAME
//     // ============================================================

//     doc.setFont("helvetica", "bold");

//     doc.setFontSize(9);

//     doc.text(companyName, leftMargin + 2, y);

//     y += 4;

//     // ============================================================
//     // COMPANY ADDRESS
//     // ============================================================

//     doc.setFont("helvetica", "normal");

//     doc.setFontSize(5.5);

//     const companyAddressLines = doc.splitTextToSize(companyAddress1, 52);

//     doc.text(companyAddressLines, leftMargin + 2, y);

//     y += companyAddressLines.length * 3.2;

//     doc.text(companyAddress2, leftMargin + 2, y);

//     y += 3.2;

//     // ============================================================
//     // COMPANY PHONE
//     // ============================================================

//     doc.text(`Phone no.: ${companyPhone}`, leftMargin + 2, y);

//     y += 3.2;

//     // ============================================================
//     // COMPANY STATE
//     // ============================================================

//     doc.text(`State: ${companyState}`, leftMargin + 2, y);

//     // ============================================================
//     // TAX INVOICE
//     // ============================================================

//     y += 6;

//     doc.setFont("helvetica", "bold");

//     doc.setFontSize(9);

//     doc.text("Tax Invoice", pageWidth / 2, y, {
//       align: "center",
//     });

//     y += 5;

//     // ============================================================
//     // HEADER LINE
//     // ============================================================

//     doc.setLineWidth(0.3);

//     doc.line(leftMargin + 2, y, pageWidth - rightMargin - 2, y);

//     y += 5;

//     // ============================================================
//     // BILL TO + INVOICE DETAILS
//     // ============================================================

//     const leftX = 7;
//     const rightX = 43;

//     const sectionStartY = y;

//     // ------------------------------------------------------------
//     // LEFT : BILL TO
//     // ------------------------------------------------------------

//     let customerY = sectionStartY;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(7);

//     doc.text("Bill To", leftX, customerY);

//     customerY += 5;

//     // Customer Name
//     if (customerName) {
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(6.2);

//       const nameLines = doc.splitTextToSize(String(customerName), 32);

//       doc.text(nameLines, leftX, customerY);

//       customerY += nameLines.length * 3.2;
//     }

//     // Address 1
//     if (customerAddress1) {
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(5.8);

//       const address1Lines = doc.splitTextToSize(String(customerAddress1), 32);

//       doc.text(address1Lines, leftX, customerY);

//       customerY += address1Lines.length * 3;
//     }

//     // Address 2
//     if (customerAddress2) {
//       const address2Lines = doc.splitTextToSize(String(customerAddress2), 32);

//       doc.text(address2Lines, leftX, customerY);

//       customerY += address2Lines.length * 3;
//     }

//     // Address 3
//     if (customerAddress3) {
//       const address3Lines = doc.splitTextToSize(String(customerAddress3), 32);

//       doc.text(address3Lines, leftX, customerY);

//       customerY += address3Lines.length * 3;
//     }

//     // Mobile
//     if (contactNo) {
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(5.8);

//       doc.text(`Mobile No.: ${contactNo}`, leftX, customerY);

//       customerY += 3.5;
//     }

//     // ------------------------------------------------------------
//     // RIGHT : INVOICE DETAILS
//     // ------------------------------------------------------------

//     let invoiceY = sectionStartY;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(7);

//     doc.text("Invoice Details", rightX, invoiceY);

//     invoiceY += 5;

//     // Invoice Number
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(6.2);

//     doc.text(`Invoice No.: ${invoiceNo || "-"}`, rightX, invoiceY);

//     invoiceY += 5;

//     // Date
//     doc.text(`Date: ${invoiceDateText}`, rightX, invoiceY);

//     invoiceY += 5;

//     // Time
//     doc.text(`Time: ${invoiceTime}`, rightX, invoiceY);

//     invoiceY += 4;

//     // ------------------------------------------------------------
//     // CALCULATE NEXT Y POSITION
//     // ------------------------------------------------------------

//     y = Math.max(customerY, invoiceY) + 2;

//     // ------------------------------------------------------------
//     // LINE BEFORE PRODUCT TABLE
//     // ------------------------------------------------------------

//     doc.setLineWidth(0.3);

//     doc.line(leftMargin + 2, y, pageWidth - rightMargin - 2, y);

//     y += 4;

//     // ============================================================
//     // 23. INVOICE DETAILS
//     // ============================================================

//     const invoiceDetails = Array.isArray(printData?.invdetail)
//       ? printData.invdetail
//       : [];

//     // ============================================================
//     // 24. PRODUCT TABLE DATA
//     // ============================================================

//     const tableData = invoiceDetails.map((item, index) => {
//       const matchedProduct = Array.isArray(productOptions)
//         ? productOptions.find(
//             (option) => String(option?.value) === String(item?.ProductId),
//           )
//         : null;

//       const productName =
//         item?.ProductName ||
//         item?.productName ||
//         matchedProduct?.label ||
//         "Unknown";

//       const hsnSac =
//         item?.HSNSAC ||
//         item?.HsnSac ||
//         item?.HSNCode ||
//         item?.HsnCode ||
//         item?.HSN ||
//         item?.SAC ||
//         item?.SACCode ||
//         "";

//       const quantity = Number(item?.Quantity || 0);

//       const rate = Number(item?.Rate || 0);

//       const amount = Number(item?.Amount || 0);

//       return [
//         index + 1,
//         productName,
//         hsnSac,
//         quantity.toFixed(2),
//         rate.toFixed(2),
//         amount.toFixed(2),
//       ];
//     });

//     // ============================================================
//     // 25. PRODUCT TABLE
//     // ============================================================

//     autoTable(doc, {
//       head: [["#", "Item", "HSN", "Qty", "Rate", "Amount"]],

//       body:
//         tableData.length > 0 ? tableData : [["", "No items", "", "", "", ""]],

//       startY: y,

//       margin: {
//         left: 6,
//         right: 6,
//       },

//       tableWidth: 68,

//       theme: "grid",

//       styles: {
//         font: "helvetica",
//         fontSize: 5.2,
//         cellPadding: 1,
//         lineWidth: 0.2,
//         textColor: 0,
//         valign: "middle",
//         overflow: "linebreak",
//       },

//       headStyles: {
//         font: "helvetica",
//         fontSize: 5.2,
//         fontStyle: "bold",
//         fillColor: [240, 240, 240],
//         textColor: 0,
//         halign: "center",
//         valign: "middle",
//       },

//       columnStyles: {
//         0: {
//           cellWidth: 5,
//           halign: "center",
//         },

//         1: {
//           cellWidth: 25,
//           halign: "left",
//         },

//         2: {
//           cellWidth: 10,
//           halign: "center",
//         },

//         3: {
//           cellWidth: 8,
//           halign: "right",
//         },

//         4: {
//           cellWidth: 10,
//           halign: "right",
//         },

//         5: {
//           cellWidth: 10,
//           halign: "right",
//         },
//       },
//     });

//     // ============================================================
//     // 26. TOTAL QUANTITY
//     // ============================================================

//     const totalQuantity = invoiceDetails.reduce(
//       (sum, item) => sum + Number(item?.Quantity || 0),
//       0,
//     );

//     // ============================================================
//     // 27. SUB TOTAL
//     // ============================================================

//     const subTotal = Number(printData?.SubTotal || 0);

//     // ============================================================
//     // 28. GRAND TOTAL
//     // ============================================================

//     const grandTotal = Number(printData?.Total || 0);

//     // ============================================================
//     // 29. RECEIVED
//     // ============================================================

//     const receivedAmount = Number(printData?.ReceivedAmount || 0);

//     // ============================================================
//     // 30. BALANCE
//     // ============================================================

//     const balance = Math.max(grandTotal - receivedAmount, 0);

//     // ============================================================
//     // 31. TOTAL ROW
//     // ============================================================

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : y + 4;

//     autoTable(doc, {
//       body: [
//         [
//           "",
//           "Total",
//           "",
//           totalQuantity.toFixed(2),
//           "",
//           `Rs. ${grandTotal.toFixed(2)}`,
//         ],
//       ],

//       startY: y,

//       margin: {
//         left: 6,
//         right: 6,
//       },

//       tableWidth: 68,

//       theme: "grid",

//       styles: {
//         font: "helvetica",
//         fontSize: 5.3,
//         cellPadding: 1,
//         fontStyle: "bold",
//         lineWidth: 0.2,
//       },

//       columnStyles: {
//         0: {
//           cellWidth: 5,
//         },

//         1: {
//           cellWidth: 25,
//         },

//         2: {
//           cellWidth: 10,
//         },

//         3: {
//           cellWidth: 8,
//           halign: "right",
//         },

//         4: {
//           cellWidth: 10,
//         },

//         5: {
//           cellWidth: 10,
//           halign: "right",
//         },
//       },
//     });

//     // ============================================================
//     // 32. NUMBER TO WORDS
//     // ============================================================

//     const numberToWords = (num) => {
//       const ones = [
//         "",
//         "One",
//         "Two",
//         "Three",
//         "Four",
//         "Five",
//         "Six",
//         "Seven",
//         "Eight",
//         "Nine",
//         "Ten",
//         "Eleven",
//         "Twelve",
//         "Thirteen",
//         "Fourteen",
//         "Fifteen",
//         "Sixteen",
//         "Seventeen",
//         "Eighteen",
//         "Nineteen",
//       ];

//       const tens = [
//         "",
//         "",
//         "Twenty",
//         "Thirty",
//         "Forty",
//         "Fifty",
//         "Sixty",
//         "Seventy",
//         "Eighty",
//         "Ninety",
//       ];

//       const convertBelowThousand = (number) => {
//         let result = "";

//         if (number >= 100) {
//           result += ones[Math.floor(number / 100)] + " Hundred ";

//           number %= 100;
//         }

//         if (number >= 20) {
//           result += tens[Math.floor(number / 10)] + " ";

//           number %= 10;
//         }

//         if (number > 0) {
//           result += ones[number] + " ";
//         }

//         return result.trim();
//       };

//       if (num === 0) {
//         return "Zero";
//       }

//       num = Math.floor(num);

//       let result = "";

//       if (num >= 10000000) {
//         result += convertBelowThousand(Math.floor(num / 10000000)) + " Crore ";

//         num %= 10000000;
//       }

//       if (num >= 100000) {
//         result += convertBelowThousand(Math.floor(num / 100000)) + " Lakh ";

//         num %= 100000;
//       }

//       if (num >= 1000) {
//         result += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";

//         num %= 1000;
//       }

//       if (num > 0) {
//         result += convertBelowThousand(num);
//       }

//       return result.trim();
//     };

//     // ============================================================
//     // 33. AMOUNT IN WORDS
//     // ============================================================

//     const amountInWords = `${numberToWords(grandTotal)} Rupees only`;

//     // ============================================================
//     // 34. SUMMARY TABLE
//     // ============================================================

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : y + 4;

//     autoTable(doc, {
//       body: [
//         [
//           {
//             content: "Invoice Amount In Words",
//             styles: {
//               fontStyle: "bold",
//             },
//           },

//           {
//             content: "Sub Total",
//             styles: {
//               fontStyle: "bold",
//             },
//           },

//           `Rs. ${subTotal.toFixed(2)}`,
//         ],

//         [amountInWords, "Total", `Rs. ${grandTotal.toFixed(2)}`],

//         ["", "Received", `Rs. ${receivedAmount.toFixed(2)}`],

//         ["", "Balance", `Rs. ${balance.toFixed(2)}`],
//       ],

//       startY: y,

//       margin: {
//         left: 6,
//         right: 6,
//       },

//       tableWidth: 68,

//       theme: "grid",

//       styles: {
//         font: "helvetica",
//         fontSize: 5.3,
//         cellPadding: 1.5,
//         lineWidth: 0.2,
//         valign: "middle",
//         overflow: "linebreak",
//       },

//       columnStyles: {
//         0: {
//           cellWidth: 39,
//         },

//         1: {
//           cellWidth: 14,
//           fontStyle: "bold",
//         },

//         2: {
//           cellWidth: 15,
//           halign: "right",
//         },
//       },
//     });

//     // ============================================================
//     // 35. TERMS
//     // ============================================================

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 5 : y + 5;

//     doc.setFont("helvetica", "bold");

//     doc.setFontSize(6.5);

//     doc.text("Terms And Conditions", 6, y);

//     y += 3.5;

//     doc.setFont("helvetica", "normal");

//     doc.setFontSize(5.5);

//     doc.text("Thanks for doing business with us!", 6, y);

//     y += 7;

//     // ============================================================
//     // 36. AUTHORIZED SIGNATORY
//     // ============================================================

//     doc.setFontSize(6);

//     doc.text("For: AMRUT MILK PRODUCTS 2", pageWidth / 2, y, {
//       align: "center",
//     });

//     y += 9;

//     doc.line(pageWidth / 2 - 15, y, pageWidth / 2 + 15, y);

//     y += 3.5;

//     doc.setFont("helvetica", "bold");

//     doc.text("Authorized Signatory", pageWidth / 2, y, {
//       align: "center",
//     });

//     // ============================================================
//     // 37. PRINT PDF
//     // ============================================================

//     try {
//       if (typeof doc.autoPrint === "function") {
//         doc.autoPrint();
//       }

//       const pdfBlob = doc.output("blob");

//       const pdfBlobUrl = URL.createObjectURL(pdfBlob);

//       // console.log("========================================");

//       // console.log("80MM ROLL PDF CREATED");

//       // console.log("PDF URL:", pdfBlobUrl);

//       // console.log("========================================");

//       if (printWindow && !printWindow.closed) {
//         printWindow.location.href = pdfBlobUrl;

//         printWindow.focus();
//       } else {
//         const newPrintWindow = window.open(pdfBlobUrl, "_blank");

//         if (!newPrintWindow) {
//           toast.error("Please allow popups for printing.");

//           URL.revokeObjectURL(pdfBlobUrl);

//           return;
//         }

//         newPrintWindow.focus();
//       }

//       setTimeout(() => {
//         URL.revokeObjectURL(pdfBlobUrl);
//       }, 60000);
//     } catch (error) {
//       console.error("Error generating invoice PDF:", error);

//       if (printWindow && !printWindow.closed) {
//         printWindow.close();
//       }

//       toast.error("Unable to generate invoice PDF.");
//     }
//   };

//   return (
//     <Box>
//       <Box textAlign={"center"}>
//         <Typography color="var(--complementary-color)" variant="h4">
//           <b>Sales Entry</b>
//         </Typography>
//       </Box>
//       <Box
//         sx={{
//           //  background: 'rgb(236, 253, 230)',
//           p: 5,
//           height: "auto",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//             alignItems: "flex-start",
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",
//               minWidth: "235px",
//               height: "56px",
//               whiteSpace: "nowrap",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },
//             }}
//             variant="contained"
//             onClick={handleNewClick}
//           >
//             Create Sales Entry
//           </Button>

//           {minimizedBills.length > 0 && (
//             <Box
//               sx={{
//                 mt: 2,
//                 mb: 2,
//                 p: 2,
//                 borderRadius: "12px",
//                 backgroundColor: "#f5f7fa",
//                 border: "1px solid #e0e0e0",
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 700,
//                   mb: 1.5,
//                 }}
//               >
//                 Minimized Bills ({minimizedBills.length})
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 1,
//                 }}
//               >
//                 {minimizedBills.map((bill) => (
//                   <Box
//                     key={bill.draftId}
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       gap: 2,
//                       p: 1.5,
//                       backgroundColor: "#fff",
//                       borderRadius: "8px",
//                       border: "1px solid #e0e0e0",
//                     }}
//                   >
//                     <Box>
//                       <Typography
//                         sx={{
//                           fontWeight: 600,
//                         }}
//                       >
//                         {bill.customerName || "Regular Customer"}
//                       </Typography>

//                       <Typography variant="body2" color="text.secondary">
//                         Invoice: {bill.invoiceNo || "-"}
//                       </Typography>
//                     </Box>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                       }}
//                     >
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => handleResumeBill(bill.draftId)}
//                       >
//                         Resume
//                       </Button>

//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={() => handleRemoveMinimizedBill(bill.draftId)}
//                       >
//                         Remove
//                       </Button>
//                     </Box>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           )}
//         </Box>
//         {/* =========================
//     INVOICE FILTERS
// ========================= */}
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               alignItems: "center",
//               flexWrap: "wrap",
//               mt: 2,
//               mb: 2,
//             }}
//           >
//             {/* SEARCH */}
//             <TextField
//               size="small"
//               label="Search"
//               placeholder="Bill No / Customer / Category"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               sx={{ minWidth: 250 }}
//             />

//             {/* FROM DATE */}
//             <DatePicker
//               label="From Date"
//               format="dd-MM-yyyy"
//               value={
//                 fromDate
//                   ? moment(fromDate, "YYYY-MM-DD", true).isValid()
//                     ? moment(fromDate, "YYYY-MM-DD").toDate()
//                     : null
//                   : null
//               }
//               onChange={(newValue) => {
//                 setFromDate(
//                   newValue && !isNaN(newValue.getTime())
//                     ? moment(newValue).format("YYYY-MM-DD")
//                     : "",
//                 );
//               }}
//               slotProps={{
//                 textField: {
//                   size: "small",
//                   sx: { minWidth: 160 },
//                 },
//               }}
//             />

//             {/* TO DATE */}
//             <DatePicker
//               label="To Date"
//               format="dd-MM-yyyy"
//               value={
//                 toDate
//                   ? moment(toDate, "YYYY-MM-DD", true).isValid()
//                     ? moment(toDate, "YYYY-MM-DD").toDate()
//                     : null
//                   : null
//               }
//               onChange={(newValue) => {
//                 setToDate(
//                   newValue && !isNaN(newValue.getTime())
//                     ? moment(newValue).format("YYYY-MM-DD")
//                     : "",
//                 );
//               }}
//               slotProps={{
//                 textField: {
//                   size: "small",
//                   sx: { minWidth: 160 },
//                 },
//               }}
//             />

//             {/* CATEGORY */}
//             <TextField
//               select
//               size="small"
//               label="Category"
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//               sx={{ minWidth: 160 }}
//             >
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="R">Retailer</MenuItem>
//             </TextField>

//             {/* CLEAR */}
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => {
//                 setSearchText("");
//                 setFromDate("");
//                 setToDate("");
//                 setCategoryFilter("");
//               }}
//             >
//               Clear
//             </Button>
//           </Box>
//         </LocalizationProvider>
//         <MaterialReactTable
//           columns={columns}
//           data={filteredInvoiceData}
//           enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",
//               color: "black",
//               fontSize: "16px",
//             },
//           }}
//         />
//         {/* ///for preview///////// */}.
//         <Dialog
//           open={previewOpen}
//           onClose={() => setPreviewOpen(false)}
//           //   style: { cursor: 'pointer' },
//           // })}
//         />
//         {/* ///for preview///////// */}.
//         <Dialog
//           open={previewOpen}
//           onClose={() => setPreviewOpen(false)}
//           maxWidth="xlg"
//           fullWidth
//         >
//           <DialogTitle sx={{ textAlign: "center" }}>
//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               gap={1}
//             >
//               {/* <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} /> */}
//               <Typography
//                 variant="h5"
//                 sx={{
//                   fontWeight: "bold",
//                   color: "#0B5E20",
//                 }}
//               >
//                 Welcome To Amrut Dairy
//               </Typography>
//             </Box>
//             {/* <Typography sx={{ mt: 1 }}>
//               Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
//             </Typography> */}

//             <Typography
//               variant="h6"
//               component="div"
//               sx={{ fontWeight: "bold", mt: 1 }}
//             >
//               Sales Preview
//             </Typography>
//           </DialogTitle>

//           <DialogContent dividers>
//             <Box>
//               {previewData ? (
//                 <Box>
//                   <Box
//                     display={"flex"}
//                     justifyContent={"space-between"}
//                     gap={2}
//                   >
//                     <Typography>
//                       <strong>Invoice No:</strong> {previewData.InvoiceNo}
//                     </Typography>
//                     <Typography>
//                       <strong>Invoice Date:</strong>{" "}
//                       {previewData?.InvoiceDate?.date
//                         ? new Date(
//                             previewData.InvoiceDate.date,
//                           ).toLocaleDateString()
//                         : previewData?.InvoiceDate
//                           ? new Date(
//                               previewData.InvoiceDate,
//                             ).toLocaleDateString()
//                           : "-"}
//                     </Typography>
//                   </Box>

//                   <Box
//                     display={"flex"}
//                     justifyContent={"space-between"}
//                     gap={2}
//                     mt={2}
//                   >
//                     <Box>
//                       {/* ORDER NUMBER */}
//                       <Typography>
//                         <strong>Order No:</strong> {previewData?.OrderNo || "-"}
//                       </Typography>

//                       {/* ORDER TIME */}
//                       <Typography sx={{ mt: 1 }}>
//                         <strong>Order Time:</strong>{" "}
//                         {(() => {
//                           const createdOnValue = previewData?.CreatedOn;

//                           // CreatedOn नाही
//                           if (!createdOnValue) {
//                             return "-";
//                           }

//                           // CreatedOn object किंवा string असू शकतो
//                           const dateValue =
//                             typeof createdOnValue === "object"
//                               ? createdOnValue?.date ||
//                                 createdOnValue?.Date ||
//                                 createdOnValue?.value ||
//                                 ""
//                               : createdOnValue;

//                           // Date value नाही
//                           if (!dateValue) {
//                             return "-";
//                           }

//                           const date = new Date(dateValue);

//                           // Invalid date
//                           if (isNaN(date.getTime())) {
//                             return "-";
//                           }

//                           // Only Time
//                           return date.toLocaleTimeString("en-IN", {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             second: "2-digit",
//                             hour12: true,
//                           });
//                         })()}
//                       </Typography>
//                     </Box>
//                     <Box></Box>
//                     <Box>
//                       <Typography>
//                         <strong>Customer Name:</strong>{" "}
//                         {previewData.accountDetails?.AccountName || "-"}
//                       </Typography>
//                     </Box>
//                     <Box>
//                       <Typography>
//                         <strong>Contact No:</strong> {previewData.ContactNo}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Divider sx={{ mt: 2 }} />

//                   {/* ////////// */}

//                   <Grid container spacing={2}>
//                     {/* =====================================================
//       SALES DETAILS - FULL WIDTH
//   ====================================================== */}

//                     <Grid item xs={12} md={12}>
//                       <Typography
//                         variant="h6"
//                         fontWeight="bold"
//                         gutterBottom
//                         mt={1}
//                       >
//                         Sales Details
//                       </Typography>

//                       <TableContainer
//                         component={Paper}
//                         elevation={2}
//                         sx={{
//                           width: "100%",
//                           mt: 1,
//                         }}
//                       >
//                         <Table size="small">
//                           <TableHead
//                             sx={{
//                               backgroundColor: "#f5f5f5",
//                             }}
//                           >
//                             <TableRow>
//                               <TableCell>
//                                 <strong>Material</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Quantity (Lit)</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Rate</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Discount</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Amount (Rs)</strong>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             {previewData.invdetail.map((item, index) => {
//                               const materialName =
//                                 productOptions.find(
//                                   (opt) =>
//                                     opt.value.toString() ===
//                                     item.ProductId?.toString(),
//                                 )?.label || "Unknown";

//                               return (
//                                 <TableRow key={index}>
//                                   <TableCell>{materialName}</TableCell>

//                                   <TableCell>{item.Quantity}</TableCell>

//                                   <TableCell>{item.Rate}</TableCell>

//                                   <TableCell>{item.DiscountAmt || 0}</TableCell>

//                                   <TableCell>{item.Amount}</TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>

//                       {/* =====================================================
//         PAYMENT MODE + TRANSPORT
//     ====================================================== */}

//                       <TableContainer
//                         component={Paper}
//                         elevation={1}
//                         sx={{
//                           width: "100%",
//                           mt: 2,
//                         }}
//                       >
//                         <Table size="small">
//                           <TableHead
//                             sx={{
//                               backgroundColor: "#f5f5f5",
//                             }}
//                           >
//                             <TableRow>
//                               <TableCell>
//                                 <strong>Payment Mode</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Transport Charge</strong>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             <TableRow>
//                               <TableCell>
//                                 {previewData.PaymentMode || "-"}
//                               </TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(previewData.Transport || 0).toFixed(2)}
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Grid>

//                     {/* =====================================================
//       AMOUNT SUMMARY - FULL WIDTH
//   ====================================================== */}

//                     <Grid item xs={12} md={12}>
//                       <Box
//                         sx={{
//                           width: "100%",
//                           mt: 1,
//                           border: "1px solid #e0e0e0",
//                           borderRadius: 2,
//                           backgroundColor: "#fff",
//                           boxShadow: 2,
//                           p: 1.5,
//                         }}
//                       >
//                         {/* TITLE */}

//                         <Typography
//                           variant="h6"
//                           fontWeight="bold"
//                           sx={{
//                             color: "#1976d2",
//                             mb: 1,
//                           }}
//                         >
//                           Amount Summary
//                         </Typography>

//                         {/* =================================================
//           ROW 1
//       ================================================== */}
//                         <Grid container spacing={1.5}>
//                           {/* SUBTOTAL */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>Subtotal</Typography>

//                               <Typography fontWeight={600}>
//                                 ₹ {Number(previewData.SubTotal || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>

//                           {/* DISCOUNT */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>Discount</Typography>

//                               <Typography fontWeight={600}>
//                                 ₹ {Number(previewData.Discount || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>

//                           {/* TRANSPORT */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>
//                                 Transport
//                               </Typography>

//                               <Typography fontWeight={600}>
//                                 ₹{" "}
//                                 {Number(previewData.Transport || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>

//                           {/* GRAND TOTAL */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #90caf9",
//                                 backgroundColor: "#e3f2fd",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>
//                                 Grand Total
//                               </Typography>

//                               <Typography
//                                 fontWeight={700}
//                                 sx={{
//                                   color: "#1976d2",
//                                   fontSize: "1.1rem",
//                                 }}
//                               >
//                                 ₹ {Number(previewData.Total || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>
//                         </Grid>

//                         {/* RECEIVED AMOUNT */}
//                         <Grid item xs={12} sm={6} md={3}>
//                           <Box
//                             sx={{
//                               border: "1px solid #e0e0e0",
//                               borderRadius: 1,
//                               px: 1.5,
//                               py: 1,
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               minHeight: "62px",
//                               height: "auto",
//                             }}
//                           >
//                             <Typography fontWeight={600}>
//                               Received Amount
//                             </Typography>

//                             <Typography fontWeight={600}>
//                               ₹{" "}
//                               {Number(
//                                 previewData?.ReceivedAmount ??
//                                   previewData?.ReceivedAmt ??
//                                   previewData?.Received ??
//                                   previewData?.receivedAmount ??
//                                   0,
//                               ).toFixed(2)}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         {/* =================================================
//           BALANCE DUE / REFUND
//       ================================================== */}

//                         <Box
//                           sx={{
//                             mt: 1,
//                             px: 2,
//                             py: 1,
//                             borderRadius: 1.5,
//                             border: "1px solid",
//                             borderColor: refund >= 0 ? "#81c784" : "#ef9a9a",
//                             backgroundColor:
//                               refund >= 0 ? "#e8f5e9" : "#ffebee",

//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Typography
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: 20,
//                               color: refund >= 0 ? "green" : "#d32f2f",
//                             }}
//                           >
//                             ₹ {Math.abs(refund).toFixed(2)}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               ) : (
//                 <Typography>No data to preview</Typography>
//               )}
//             </Box>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={() => generatePDF(previewData)} color="primary">
//               <PrintIcon sx={{ fontSize: 35 }} />
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => setPreviewOpen(false)}
//               color="primary"
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog
//           open={historyOpen}
//           onClose={() => {
//             setHistoryOpen(false);
//             setSelectedHistoryVersion(null);
//             setSelectedHistoryDetails([]);
//           }}
//           fullWidth
//           maxWidth="xl"
//           PaperProps={{
//             sx: {
//               borderRadius: 3,
//               maxHeight: "92vh",
//             },
//           }}
//         >
//           {/* =====================================================
//       HEADER
//   ===================================================== */}

//           <DialogTitle
//             sx={{
//               background: "linear-gradient(135deg, #1976d2, #0d47a1)",
//               color: "#fff",
//               fontWeight: 700,
//               fontSize: "20px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Box>
//               Invoice Edit History
//               <Typography
//                 sx={{
//                   fontSize: "13px",
//                   opacity: 0.9,
//                   mt: 0.5,
//                 }}
//               >
//                 Invoice No:{" "}
//                 {selectedHistoryInvoice?.InvoiceNo ||
//                   selectedHistoryInvoice?.BillNo ||
//                   "-"}
//               </Typography>
//             </Box>

//             <IconButton
//               onClick={() => {
//                 setHistoryOpen(false);
//                 setSelectedHistoryVersion(null);
//                 setSelectedHistoryDetails([]);
//               }}
//               sx={{
//                 color: "#fff",
//               }}
//             >
//               <CloseIcon
//                 sx={{
//                   cursor: isSaving ? "not-allowed" : "pointer",
//                   fontSize: 28,
//                   color: isSaving ? "#bdbdbd" : "inherit",
//                 }}
//                 onClick={isSaving ? undefined : handleDrawerClose}
//               />
//             </IconButton>
//           </DialogTitle>

//           {/* =====================================================
//       CONTENT
//   ===================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#f7f9fc",
//             }}
//           >
//             {historyLoading ? (
//               <Box
//                 sx={{
//                   minHeight: 300,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <>
//                 {/* =================================================
//             CURRENT INVOICE
//         ================================================= */}

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: 2,
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: "22px",
//                       fontWeight: 700,
//                       color: "#1976d2",
//                       mb: 2,
//                     }}
//                   >
//                     Current Invoice
//                   </Typography>

//                   {currentHistoryHeader ? (
//                     <Box
//                       sx={{
//                         display: "grid",
//                         gridTemplateColumns:
//                           "repeat(auto-fit, minmax(180px, 1fr))",
//                         gap: 3,
//                       }}
//                     >
//                       <Box>
//                         <Typography color="text.secondary">
//                           Invoice No
//                         </Typography>

//                         <Typography fontWeight={700}>
//                           {currentHistoryHeader?.InvoiceNo ||
//                             selectedHistoryInvoice?.InvoiceNo ||
//                             "-"}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">
//                           Invoice Date
//                         </Typography>

//                         <Typography fontWeight={700}>
//                           {formatHistoryDate(currentHistoryHeader?.InvoiceDate)}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Customer</Typography>

//                         <Typography fontWeight={700}>
//                           {currentHistoryHeader?.AccountName ||
//                             currentHistoryHeader?.CustomerName ||
//                             currentHistoryHeader?.accountDetails?.AccountName ||
//                             "-"}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Total</Typography>

//                         <Typography fontWeight={700} color="#1976d2">
//                           ₹{" "}
//                           {Number(currentHistoryHeader?.Total || 0).toFixed(2)}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Received</Typography>

//                         <Typography fontWeight={700}>
//                           ₹{" "}
//                           {Number(
//                             currentHistoryHeader?.ReceivedAmount || 0,
//                           ).toFixed(2)}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Balance</Typography>

//                         <Typography fontWeight={700} color="red">
//                           ₹{" "}
//                           {Math.max(
//                             Number(currentHistoryHeader?.Total || 0) -
//                               Number(currentHistoryHeader?.ReceivedAmount || 0),
//                             0,
//                           ).toFixed(2)}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   ) : (
//                     <Typography color="text.secondary">
//                       Current invoice data not found.
//                     </Typography>
//                   )}
//                 </Paper>

//                 {/* =================================================
//             PREVIOUS INVOICE HISTORY
//         ================================================= */}

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: 2,
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: "22px",
//                       fontWeight: 700,
//                       color: "#e67e00",
//                       mb: 2,
//                     }}
//                   >
//                     Previous Invoice History
//                   </Typography>

//                   {historyHeader.length === 0 ? (
//                     <Typography color="text.secondary">
//                       No previous invoice history found.
//                     </Typography>
//                   ) : (
//                     <TableContainer component={Paper} elevation={0}>
//                       <Table>
//                         <TableHead>
//                           <TableRow
//                             sx={{
//                               backgroundColor: "#e3f2fd",
//                             }}
//                           >
//                             <TableCell>
//                               <b>Version</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Invoice No</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Invoice Date</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Customer</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Total</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Received</b>
//                             </TableCell>

//                             <TableCell align="center">
//                               <b>View</b>
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {historyHeader
//                             .slice()
//                             .sort(
//                               (a, b) =>
//                                 Number(a?.VersionNo || 0) -
//                                 Number(b?.VersionNo || 0),
//                             )
//                             .map((item, index) => {
//                               const version =
//                                 Number(item?.VersionNo) || index + 1;

//                               const isSelected =
//                                 Number(selectedHistoryVersion) === version;

//                               return (
//                                 <TableRow
//                                   key={item?.Id || `${version}-${index}`}
//                                   sx={{
//                                     backgroundColor: isSelected
//                                       ? "#e3f2fd"
//                                       : "transparent",
//                                   }}
//                                 >
//                                   <TableCell>
//                                     <Button
//                                       variant="contained"
//                                       size="small"
//                                       onClick={() =>
//                                         handleHistoryVersionClick(item)
//                                       }
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       VERSION {version}
//                                     </Button>
//                                   </TableCell>

//                                   <TableCell>
//                                     {item?.InvoiceNo || "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     {formatHistoryDate(item?.InvoiceDate)}
//                                   </TableCell>

//                                   <TableCell>
//                                     {item?.AccountName ||
//                                       item?.CustomerName ||
//                                       item?.accountDetails?.AccountName ||
//                                       "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(item?.Total || 0).toFixed(2)}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹{" "}
//                                     {Number(item?.ReceivedAmount || 0).toFixed(
//                                       2,
//                                     )}
//                                   </TableCell>

//                                   <TableCell align="center">
//                                     <Button
//                                       size="small"
//                                       onClick={() =>
//                                         handleHistoryVersionClick(item)
//                                       }
//                                     >
//                                       VIEW
//                                     </Button>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </Paper>

//                 {/* =================================================
//             PREVIOUS PRODUCT DETAILS
//         ================================================= */}

//                 {selectedHistoryVersion !== null && (
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 3,
//                       mb: 3,
//                       borderRadius: 2,
//                       border: "1px solid #ddd",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "22px",
//                         fontWeight: 700,
//                         color: "#e67e00",
//                         mb: 2,
//                       }}
//                     >
//                       Previous Product Details — Version{" "}
//                       {selectedHistoryVersion}
//                     </Typography>

//                     {selectedHistoryDetails.length === 0 ? (
//                       <Typography color="text.secondary">
//                         No previous product details found.
//                       </Typography>
//                     ) : (
//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow
//                               sx={{
//                                 backgroundColor: "#fff3e0",
//                               }}
//                             >
//                               <TableCell>
//                                 <b>Product</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Quantity</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Rate</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Amount</b>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             {selectedHistoryDetails.map((detail, index) => {
//                               const product = productOptions.find(
//                                 (option) =>
//                                   String(option?.value) ===
//                                   String(detail?.ProductId),
//                               );

//                               return (
//                                 <TableRow
//                                   key={
//                                     detail?.Id ||
//                                     `${detail?.ProductId}-${index}`
//                                   }
//                                 >
//                                   <TableCell>
//                                     {product?.label ||
//                                       detail?.ProductName ||
//                                       "Unknown"}
//                                   </TableCell>

//                                   <TableCell>
//                                     {detail?.Quantity ?? detail?.Qty ?? "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Rate || 0).toFixed(2)}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Amount || 0).toFixed(2)}
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     )}
//                   </Paper>
//                 )}

//                 {/* =================================================
//             CURRENT PRODUCT DETAILS
//         ================================================= */}

//                 {selectedHistoryVersion !== null && (
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 3,
//                       mb: 3,
//                       borderRadius: 2,
//                       border: "1px solid #ddd",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "22px",
//                         fontWeight: 700,
//                         color: "#1976d2",
//                         mb: 2,
//                       }}
//                     >
//                       Current Product Details
//                     </Typography>

//                     {currentHistoryDetails.length === 0 ? (
//                       <Typography color="text.secondary">
//                         No current product details found.
//                       </Typography>
//                     ) : (
//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow
//                               sx={{
//                                 backgroundColor: "#e3f2fd",
//                               }}
//                             >
//                               <TableCell>
//                                 <b>Product</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Quantity</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Rate</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Amount</b>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             {currentHistoryDetails.map((detail, index) => {
//                               const product = productOptions.find(
//                                 (option) =>
//                                   String(option?.value) ===
//                                   String(detail?.ProductId),
//                               );

//                               return (
//                                 <TableRow
//                                   key={
//                                     detail?.Id ||
//                                     `${detail?.ProductId}-${index}`
//                                   }
//                                 >
//                                   <TableCell>
//                                     {product?.label ||
//                                       detail?.ProductName ||
//                                       "Unknown"}
//                                   </TableCell>

//                                   <TableCell>
//                                     {detail?.Quantity ?? detail?.Qty ?? "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Rate || 0).toFixed(2)}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Amount || 0).toFixed(2)}
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     )}
//                   </Paper>
//                 )}

//                 {/* =================================================
//             OLD VS CURRENT
//         ================================================= */}

//                 {selectedHistoryVersion !== null &&
//                   selectedHistoryDetails.length > 0 &&
//                   currentHistoryDetails.length > 0 && (
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 3,
//                         mb: 2,
//                         borderRadius: 2,
//                         border: "1px solid #ddd",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "22px",
//                           fontWeight: 700,
//                           color: "#7b1fa2",
//                           mb: 2,
//                         }}
//                       >
//                         Old vs Current Invoice
//                       </Typography>

//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow
//                               sx={{
//                                 backgroundColor: "#f3e5f5",
//                               }}
//                             >
//                               <TableCell>
//                                 <b>Field</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>
//                                   Previous — Version {selectedHistoryVersion}
//                                 </b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Current</b>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             <TableRow>
//                               <TableCell>Product Count</TableCell>

//                               <TableCell>
//                                 {selectedHistoryDetails.length}
//                               </TableCell>

//                               <TableCell>
//                                 {currentHistoryDetails.length}
//                               </TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>Total</TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   historyHeader.find(
//                                     (h) =>
//                                       Number(h?.VersionNo) ===
//                                       Number(selectedHistoryVersion),
//                                   )?.Total || 0,
//                                 ).toFixed(2)}
//                               </TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   currentHistoryHeader?.Total || 0,
//                                 ).toFixed(2)}
//                               </TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>Received</TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   historyHeader.find(
//                                     (h) =>
//                                       Number(h?.VersionNo) ===
//                                       Number(selectedHistoryVersion),
//                                   )?.ReceivedAmount || 0,
//                                 ).toFixed(2)}
//                               </TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   currentHistoryHeader?.ReceivedAmount || 0,
//                                 ).toFixed(2)}
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Paper>
//                   )}
//               </>
//             )}
//           </DialogContent>

//           <DialogActions
//             sx={{
//               p: 2,
//             }}
//           >
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setHistoryOpen(false);
//                 setSelectedHistoryVersion(null);
//                 setSelectedHistoryDetails([]);
//               }}
//             >
//               CLOSE
//             </Button>
//           </DialogActions>
//         </Dialog>
//         {/* ==========================================
//             DELETE CONFIRMATION DIALOG
//         ========================================== */}
//         <Dialog open={open} onClose={handleClose}>
//           <DialogTitle>Confirm Deletion</DialogTitle>

//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete this Sales Entry?
//             </DialogContentText>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={handleClose} color="primary">
//               Cancel
//             </Button>

//             <Button
//               onClick={handleConfirmDelete}
//               color="error"
//               variant="contained"
//               autoFocus
//             >
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Drawer
//           anchor="right"
//           open={isDrawerOpen}
//           onClose={handleDrawerClose}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           PaperProps={{
//             sx: {
//               width: "100vw",
//               maxWidth: "100vw",
//               height: "100vh",
//               borderRadius: 0,
//               zIndex: 1000,
//               overflow: "hidden",
//             },
//           }}
//         >
//           {/* ===================================================== */}
//           {/* HEADER */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               height: "68px",
//               minHeight: "68px",
//               padding: "8px 18px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "rgb(236, 253, 230)",
//               boxSizing: "border-box",
//             }}
//           >
//             {/* LEFT SIDE */}
//             <Typography
//               fontWeight="bold"
//               variant="h6"
//               sx={{
//                 m: 0,
//                 fontSize: "22px",
//               }}
//             >
//               {isEditing
//                 ? "Update Sales Entry - Regular"
//                 : "Create Sales Entry - Regular"}
//             </Typography>

//             {/* RIGHT SIDE */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 3,
//               }}
//             >
//               {/* TOTAL */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.7,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "15px",
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   TOTAL :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: "28px",
//                     fontWeight: 900,
//                     color: "#1976d2",
//                     lineHeight: 1,
//                   }}
//                 >
//                   ₹ {Number(total || 0).toFixed(2)}
//                 </Typography>
//               </Box>

//               {/* REFUND */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.7,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "15px",
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   REFUND :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: "28px",
//                     fontWeight: 900,
//                     color: "#087f23",
//                     lineHeight: 1,
//                   }}
//                 >
//                   ₹ {Number(refund || 0).toFixed(2)}
//                 </Typography>
//               </Box>

//               {/* CLOSE */}

//               {/* MINIMIZE */}
//               <Tooltip title="Minimize Bill">
//                 <IconButton
//                   onClick={handleMinimizeBill}
//                   disabled={isSaving}
//                   sx={{
//                     color: "#1976d2",
//                     width: 42,
//                     height: 42,
//                     borderRadius: "8px",

//                     "&:hover": {
//                       backgroundColor: "rgba(25, 118, 210, 0.08)",
//                     },

//                     "&:disabled": {
//                       color: "#bdbdbd",
//                     },
//                   }}
//                 >
//                   <MinimizeIcon />
//                 </IconButton>
//               </Tooltip>

//               {/* CLOSE */}
//               <CloseIcon
//                 sx={{
//                   cursor: isSaving ? "not-allowed" : "pointer",
//                   fontSize: 28,
//                   color: isSaving ? "#bdbdbd" : "inherit",
//                 }}
//                 onClick={isSaving ? undefined : handleDrawerClose}
//               />
//             </Box>
//           </Box>

//           <Divider />

//           {/* ===================================================== */}
//           {/* MAIN FORM */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               height: "calc(100vh - 69px)",
//               display: "flex",
//               flexDirection: "column",
//               overflow: "auto",
//               boxSizing: "border-box",
//               p: 1,
//             }}
//           >
//             {/* ===================================================== */}
//             {/* INVOICE / CUSTOMER DETAILS */}
//             {/* ===================================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 mb: 0.5,
//                 minHeight: "62px",
//               }}
//             >
//               {/* INVOICE NO */}
//               <Box flex={1}>
//                 <Typography variant="body2">Invoice No</Typography>

//                 <TextField
//                   variant="standard"
//                   value={invoiceNo}
//                   size="small"
//                   margin="none"
//                   placeholder="Invoice No Autogerated"
//                   fullWidth
//                   sx={{
//                     mt: 0.5,
//                     "& .MuiInput-underline:after": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                     },
//                   }}
//                   focused
//                 />
//               </Box>

//               {/* DEVICE */}
//               <Box flex={1}>
//                 <Typography variant="body2">Device</Typography>

//                 <TextField
//                   variant="standard"
//                   value={device}
//                   fullWidth
//                   size="small"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     mt: 0.5,
//                   }}
//                 />
//               </Box>

//               <Grid item xs={12} md={2}>
//                 <TextField
//                   fullWidth
//                   label="Time"
//                   value={currentTime}
//                   variant="standard"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Grid>

//               {/* INVOICE DATE */}
//               <Box flex={1}>
//                 <Typography variant="body2">Invoice Date</Typography>

//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label="Invoice Date"
//                     value={invoiceDate ? new Date(invoiceDate) : null}
//                     format="dd-MM-yyyy"
//                     disabled={!isAdmin}
//                     onChange={(newValue) => {
//                       setInvoiceDate(newValue);

//                       setErrors((prev) => ({
//                         ...prev,
//                         invoiceDate: undefined,
//                       }));
//                     }}
//                     slotProps={{
//                       textField: {
//                         size: "small",
//                         fullWidth: true,
//                         error: !!errors.invoiceDate,
//                         helperText: errors.invoiceDate,
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>
//               </Box>
//             </Box>

//             {/* ===================================================== */}
//             {/* CUSTOMER / CONTACT */}
//             {/* ===================================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 mb: 1,
//                 minHeight: "62px",
//               }}
//             >
//               {/* CUSTOMER */}
//               <Box
//                 ref={customerDropdownRef}
//                 flex={1}
//                 position="relative"
//                 width="100%"
//               >
//                 <Typography variant="body2">Customer</Typography>

//                 {/* =========================
//       CUSTOMER MAIN FIELD
//   ========================= */}

//                 <TextField
//                   fullWidth
//                   variant="standard"
//                   size="small"
//                   value={
//                     selectedAccount
//                       ? accountOptions.find(
//                           ({ Id }) => String(Id) === String(selectedAccount),
//                         )?.AccountName ||
//                         selectedCustomerName ||
//                         ""
//                       : ""
//                   }
//                   placeholder="Select Customer"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   onClick={() => {
//                     setShowDropdown(true);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       e.stopPropagation();

//                       setShowDropdown(true);

//                       setTimeout(() => {
//                         const searchInput = document.querySelector(
//                           'input[placeholder="Search Customer Name"]',
//                         );

//                         if (searchInput) {
//                           searchInput.focus();
//                           searchInput.select();
//                         }
//                       }, 100);
//                     }

//                     if (e.key === "Escape") {
//                       e.preventDefault();
//                       e.stopPropagation();

//                       setShowDropdown(false);
//                       setText("");
//                     }
//                   }}
//                   error={!!errors.selectedAccount}
//                   helperText={errors.selectedAccount}
//                   sx={{
//                     mt: 0.5,

//                     "& .MuiInput-underline:before": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                       opacity: 1,
//                     },
//                   }}
//                 />

//                 {/* =========================
//       CUSTOMER POPUP
//   ========================= */}

//                 {showDropdown && (
//                   <Paper
//                     elevation={3}
//                     sx={{
//                       position: "absolute",
//                       top: "100%",
//                       left: 0,
//                       width: "100%",
//                       maxHeight: 450,
//                       overflowY: "auto",
//                       zIndex: 9999,
//                       mt: 1,
//                       p: 2,
//                     }}
//                   >
//                     {/* =========================
//           SEARCH CUSTOMER
//       ========================= */}

//                     <TextField
//                       value={text}
//                       onChange={(e) => {
//                         setText(e.target.value);
//                       }}
//                       size="small"
//                       fullWidth
//                       placeholder="Search Customer Name"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     {/* =========================
//           CREATE NEW CUSTOMER
//       ========================= */}

//                     <Box display="flex" flexDirection="column" gap={1} mt={1}>
//                       {/* NAME + ADD */}

//                       <Box display="flex" gap={1}>
//                         <TextField
//                           value={accountName}
//                           onChange={(e) => {
//                             setAccountName(e.target.value);
//                           }}
//                           size="small"
//                           placeholder="Create New Customer"
//                           fullWidth
//                         />

//                         <Button
//                           sx={{
//                             background: "var(--primary-color)",

//                             "&:hover": {
//                               background: "var(--primary-color)",
//                             },

//                             minWidth: "95px",
//                             whiteSpace: "nowrap",
//                           }}
//                           onClick={CreateCustomerMaster}
//                           variant="contained"
//                           startIcon={
//                             <AddCircleIcon
//                               sx={{
//                                 fontSize: "20px",
//                               }}
//                             />
//                           }
//                         >
//                           ADD
//                         </Button>
//                       </Box>

//                       {/* =========================
//             ADDRESS
//         ========================= */}

//                       <TextField
//                         value={newCustomerAddress}
//                         onChange={(e) => {
//                           setNewCustomerAddress(e.target.value);
//                         }}
//                         size="small"
//                         placeholder="Customer Address"
//                         fullWidth
//                       />

//                       {/* =========================
//             MOBILE NUMBER
//         ========================= */}

//                       <PhoneInput
//                         country={"in"}
//                         value={newCustomerMobile}
//                         onChange={(value) => {
//                           setNewCustomerMobile(value);
//                         }}
//                         inputProps={{
//                           name: "newCustomerMobile",
//                         }}
//                         inputStyle={{
//                           width: "100%",
//                           height: "40px",
//                           fontSize: "16px",
//                           borderRadius: "5px",
//                         }}
//                         buttonStyle={{
//                           borderRadius: "5px",
//                         }}
//                         placeholder="Customer Mobile Number"
//                       />

//                       {/* =========================
//             LAND PHONE / TELEPHONE
//         ========================= */}
//                     </Box>

//                     {/* =========================
//           CUSTOMER LIST
//       ========================= */}

//                     <Box mt={1}>
//                       {accountOptions.length > 0 ? (
//                         accountOptions.map((option) => {
//                           const customerId = option.Id?.toString() || "";

//                           const customerName = option.AccountName || "";

//                           const addressData = option.addressDetails || {};

//                           const customerAddress =
//                             addressData.Address1 ||
//                             addressData.address1 ||
//                             addressData.Address ||
//                             addressData.address ||
//                             addressData.AddressLine1 ||
//                             addressData.addressLine1 ||
//                             option.Address1 ||
//                             option.address1 ||
//                             option.Address ||
//                             option.address ||
//                             "";

//                           const customerMobile =
//                             addressData.MobileNo ||
//                             addressData.mobileNo ||
//                             addressData.Mobile ||
//                             addressData.mobile ||
//                             option.MobileNo ||
//                             option.mobileNo ||
//                             option.Mobile ||
//                             option.mobile ||
//                             "";

//                           return (
//                             <MenuItem
//                               key={option.Id}
//                               onClick={() => {
//                                 // =========================
//                                 // SELECT CUSTOMER
//                                 // =========================

//                                 setSelectedAccount(customerId);

//                                 setSelectedCustomerName(customerName);

//                                 setSelectedCustomerAddress(customerAddress);

//                                 // =========================
//                                 // SET MOBILE
//                                 // =========================

//                                 if (customerMobile) {
//                                   setPhone(customerMobile);
//                                 } else {
//                                   fetchCustomerContact(customerId);
//                                 }

//                                 fetchAccounts(customerId);

//                                 fetchPreviousBalance(customerId);

//                                 // =========================
//                                 // CLOSE POPUP
//                                 // =========================

//                                 setShowDropdown(false);

//                                 setText("");
//                               }}
//                               sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "flex-start",
//                                 width: "100%",
//                                 py: 1,
//                               }}
//                             >
//                               {/* CUSTOMER NAME */}

//                               <Typography
//                                 sx={{
//                                   fontWeight: 600,
//                                   width: "100%",
//                                 }}
//                               >
//                                 {customerName}
//                               </Typography>

//                               {/* CUSTOMER ADDRESS */}

//                               {customerAddress && (
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     color: "#777",
//                                     fontSize: "13px",
//                                     width: "100%",
//                                     mt: 0.3,
//                                   }}
//                                 >
//                                   {customerAddress}
//                                 </Typography>
//                               )}

//                               {/* CUSTOMER MOBILE */}

//                               {customerMobile && (
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     color: "#777",
//                                     fontSize: "13px",
//                                     width: "100%",
//                                     mt: 0.2,
//                                   }}
//                                 >
//                                   Mobile: {customerMobile}
//                                 </Typography>
//                               )}
//                             </MenuItem>
//                           );
//                         })
//                       ) : (
//                         <Typography
//                           sx={{
//                             p: 1,
//                             color: "gray",
//                           }}
//                         >
//                           No customers found
//                         </Typography>
//                       )}
//                     </Box>
//                   </Paper>
//                 )}
//               </Box>

//               {/* CONTACT */}
//               <Box flex={1}>
//                 <Typography variant="body2">Contact Number</Typography>

//                 <PhoneInput
//                   country={"in"}
//                   value={phone}
//                   onChange={(phone) => setPhone(phone)}
//                   inputProps={{
//                     name: "phone",
//                     required: true,
//                   }}
//                   inputStyle={{
//                     width: "100%",
//                     height: "38px",
//                     fontSize: "15px",
//                     borderRadius: "5px",
//                   }}
//                   buttonStyle={{
//                     borderRadius: "5px",
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* ===================================================== */}
//             {/* CONTENT AREA */}
//             {/* ===================================================== */}

//             <Grid
//               container
//               spacing={1}
//               sx={{
//                 width: "100%",
//                 m: 0,
//                 alignItems: "flex-start",
//               }}
//             >
//               {/* ================================================= */}
//               {/* PRODUCT DETAILS - FULL WIDTH */}
//               {/* ================================================= */}

//               <Grid
//                 item
//                 xs={12}
//                 md={12}
//                 sx={{
//                   width: "100%",
//                   minWidth: 0,
//                 }}
//               >
//                 {/* PRODUCT */}
//                 <Paper
//                   elevation={2}
//                   sx={{
//                     width: "100%",
//                     border: "1px solid #e0e0e0",
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     backgroundColor: "#ffffff",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       p: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: 700,
//                         mb: 1,
//                         fontSize: "18px",
//                       }}
//                     >
//                       Product Details
//                     </Typography>

//                     <Grid container spacing={1} alignItems="center">
//                       {/* ================================================= */}
//                       {/* KEEP YOUR EXISTING PRODUCT INPUT CODE HERE */}
//                       {/* ================================================= */}
//                     </Grid>
//                   </Box>

//                   {/* PRODUCT TABLE */}

//                   <TableContainer
//                     sx={{
//                       width: "100%",
//                       overflow: "hidden",
//                       borderTop: "1px solid #e0e0e0",
//                     }}
//                   >
//                     <Table
//                       size="small"
//                       sx={{
//                         width: "100%",
//                         tableLayout: "fixed",
//                       }}
//                     >
//                       <TableHead
//                         sx={{
//                           backgroundColor: "#f5f5f5",
//                         }}
//                       >
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Sr.No
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Product
//                           </TableCell>

//                           <TableCell
//                             align="center"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Quantity
//                           </TableCell>

//                           <TableCell
//                             align="right"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Rate
//                           </TableCell>

//                           <TableCell
//                             align="right"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Amount
//                           </TableCell>

//                           <TableCell
//                             align="center"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Action
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>

//                       <TableBody>
//                         {rows.map((row, index) => (
//                           <TableRow key={row.Id || `row-${index}`} hover>
//                             <TableCell>{index + 1}</TableCell>

//                             <TableCell>
//                               <Typography
//                                 sx={{
//                                   fontWeight: 600,
//                                   fontSize: 14,
//                                 }}
//                               >
//                                 {row.ProductName || "-"}
//                               </Typography>
//                             </TableCell>

//                             <TableCell align="center">
//                               <TextField
//                                 variant="standard"
//                                 type="number"
//                                 value={row.Quantity ?? ""}
//                                 onChange={(e) => {
//                                   const updatedRows = [...rows];

//                                   const qty = parseFloat(e.target.value) || 0;

//                                   const currentRate =
//                                     parseFloat(updatedRows[index].Rate) || 0;

//                                   const amount = qty * currentRate;

//                                   updatedRows[index] = {
//                                     ...updatedRows[index],
//                                     Quantity: qty,
//                                     Amount: amount,
//                                   };

//                                   setRows(updatedRows);
//                                 }}
//                                 sx={{
//                                   width: 70,
//                                 }}
//                                 inputProps={{
//                                   min: 0,
//                                   onWheel: preventNumberInputScroll,
//                                 }}
//                               />
//                             </TableCell>

//                             <TableCell align="right">
//                               <TextField
//                                 variant="standard"
//                                 type="number"
//                                 value={row.Rate ?? ""}
//                                 onChange={(e) => {
//                                   const updatedRows = [...rows];

//                                   const value = e.target.value;

//                                   const currentRate =
//                                     value === "" ? "" : parseFloat(value) || 0;

//                                   const currentQty =
//                                     parseFloat(updatedRows[index].Quantity) ||
//                                     0;

//                                   const amount =
//                                     value === ""
//                                       ? 0
//                                       : currentQty * (parseFloat(value) || 0);

//                                   updatedRows[index] = {
//                                     ...updatedRows[index],
//                                     Rate: currentRate,
//                                     Amount: amount,
//                                   };

//                                   setRows(updatedRows);
//                                 }}
//                                 sx={{
//                                   width: 90,
//                                 }}
//                                 inputProps={{
//                                   min: 0,
//                                   onWheel: preventNumberInputScroll,
//                                 }}
//                               />
//                             </TableCell>

//                             <TableCell align="right">
//                               ₹ {Number(row.Amount || 0).toFixed(2)}
//                             </TableCell>

//                             <TableCell align="center">
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   gap: 0.5,
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 <Button
//                                   size="small"
//                                   variant="outlined"
//                                   onClick={() => {
//                                     // console.log("EDIT BUTTON INDEX:", index);
//                                     // console.log("EDIT BUTTON ROW:", row);
//                                     handleEditRow(index);
//                                   }}
//                                 >
//                                   Edit
//                                 </Button>

//                                 <Button
//                                   size="small"
//                                   variant="outlined"
//                                   color="error"
//                                   onClick={() => handleDeleteRow(index)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </Box>
//                             </TableCell>
//                           </TableRow>
//                         ))}

//                         {/* ================================================= */}
//                         {/* NEW PRODUCT ENTRY ROW */}
//                         {/* ================================================= */}

//                         <TableRow>
//                           <TableCell>{rows.length + 1}</TableCell>

//                           <TableCell>
//                             <Autocomplete
//                               options={productOptions}
//                               value={
//                                 productOptions.find(
//                                   (option) =>
//                                     String(option.value) ===
//                                     String(selectedProductID),
//                                 ) || null
//                               }
//                               getOptionLabel={(option) => option?.label || ""}
//                               isOptionEqualToValue={(option, value) =>
//                                 String(option.value) === String(value?.value)
//                               }
//                               renderOption={(props, option) => (
//                                 <li {...props} key={String(option.value)}>
//                                   {option.label}
//                                 </li>
//                               )}
//                               slotProps={{
//                                 popper: {
//                                   sx: {
//                                     width: "460px !important",
//                                   },
//                                 },

//                                 paper: {
//                                   sx: {
//                                     width: "100%",
//                                     height: "auto !important",
//                                     minHeight: "0 !important",
//                                     overflow: "hidden",
//                                   },
//                                 },

//                                 listbox: {
//                                   sx: {
//                                     height: "auto !important",
//                                     minHeight: "0 !important",
//                                     maxHeight: "320px",
//                                     paddingTop: "0 !important",
//                                     paddingBottom: "0 !important",
//                                     margin: 0,
//                                     overflowY: "auto",
//                                     overflowX: "hidden",
//                                   },
//                                 },
//                               }}
//                               open={productDropdownOpen}
//                               onOpen={() => {
//                                 setProductDropdownOpen(true);
//                               }}
//                               onClose={() => {
//                                 setProductDropdownOpen(false);
//                               }}
//                               onChange={(event, newValue) => {
//                                 handleItemChange(newValue);

//                                 if (newValue) {
//                                   setProductDropdownOpen(false);

//                                   setTimeout(() => {
//                                     quantityRef.current?.focus();
//                                     quantityRef.current?.select();
//                                   }, 100);
//                                 }
//                               }}
//                               renderInput={(params) => (
//                                 <TextField
//                                   {...params}
//                                   inputRef={productRef}
//                                   variant="standard"
//                                   placeholder="Select Product"
//                                   size="small"
//                                   fullWidth
//                                   onKeyDown={(event) => {
//                                     handleProductSelectKeyDown(event);
//                                   }}
//                                   onFocus={() => {
//                                     setProductDropdownOpen(true);
//                                   }}
//                                 />
//                               )}
//                             />
//                           </TableCell>

//                           <TableCell align="center">
//                             <TextField
//                               variant="standard"
//                               type="number"
//                               value={quantity}
//                               onChange={handleQuantityChange}
//                               onKeyDown={(event) => {
//                                 if (event.key !== "Enter") {
//                                   return;
//                                 }

//                                 event.preventDefault();
//                                 event.stopPropagation();

//                                 // Quantity validation
//                                 if (quantity === "" || Number(quantity) <= 0) {
//                                   toast.error("Please enter quantity.");

//                                   quantityRef.current?.focus();
//                                   quantityRef.current?.select();

//                                   return;
//                                 }

//                                 // Existing row Edit OR New row Add
//                                 handleSaveOrAddRow();
//                               }}
//                               inputRef={quantityRef}
//                               sx={{
//                                 width: 70,
//                               }}
//                               inputProps={{
//                                 min: 0,
//                                 onWheel: preventNumberInputScroll,
//                               }}
//                             />
//                           </TableCell>

//                           <TextField
//                             variant="standard"
//                             type="number"
//                             value={rate}
//                             onChange={handleRateChange}
//                             inputRef={rateRef}
//                             sx={{ width: 90 }}
//                             inputProps={{
//                               min: 0,
//                               onWheel: preventNumberInputScroll,
//                             }}
//                           />

//                           <TableCell align="right">
//                             ₹{" "}
//                             {(
//                               (parseFloat(quantity) || 0) *
//                               (parseFloat(rate) || 0)
//                             ).toFixed(2)}
//                           </TableCell>

//                           <TableCell align="center">
//                             <Typography
//                               sx={{
//                                 color: "#999",
//                                 fontSize: 13,
//                               }}
//                             >
//                               New
//                             </Typography>
//                           </TableCell>
//                         </TableRow>

//                         {/* ERROR */}

//                         {errors.rows && (
//                           <TableRow>
//                             <TableCell
//                               colSpan={6}
//                               sx={{
//                                 borderBottom: "none",
//                                 py: 0.5,
//                               }}
//                             >
//                               <Typography
//                                 color="error"
//                                 sx={{
//                                   fontSize: 13,
//                                 }}
//                               >
//                                 {errors.rows}
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   {errors.rows && (
//                     <Typography
//                       color="error"
//                       sx={{
//                         px: 1,
//                         py: 0.5,
//                         fontSize: 13,
//                       }}
//                     >
//                       {errors.rows}
//                     </Typography>
//                   )}
//                 </Paper>

//                 {/* ================================================= */}
//                 {/* PAYMENT + TRANSPORT */}
//                 {/* ================================================= */}

//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 2,
//                     mt: 1,
//                   }}
//                 >
//                   {/* PAYMENT MODE */}

//                   <Box
//                     sx={{
//                       flex: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontWeight: 600,
//                       }}
//                     >
//                       Payment Mode
//                     </Typography>
//                     <TextField
//                       select
//                       variant="standard"
//                       name="paymentMode"
//                       value={paymentMode || ""}
//                       onChange={(e) => {
//                         const mode = e.target.value;

//                         setPaymentMode(mode);
//                         setReceivedAmount("");

//                         if (mode !== "M") {
//                           setCashAmount("");
//                           setOnlineAmount("");
//                         }

//                         setErrors({
//                           ...errors,
//                           paymentMode: "",
//                         });

//                         // Payment Mode select केल्यावर Discount वर जा
//                         if (mode) {
//                           setTimeout(() => {
//                             discountRef.current?.focus();
//                             discountRef.current?.select();
//                           }, 100);
//                         }
//                       }}
//                       onKeyDown={(e) => {
//                         // ENTER = पुढे Discount
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           if (!paymentMode) {
//                             toast.error("Please select payment mode.");
//                             return;
//                           }

//                           setTimeout(() => {
//                             discountRef.current?.focus();
//                             discountRef.current?.select();
//                           }, 100);

//                           return;
//                         }

//                         // ESC = मागे Quantity
//                         if (e.key === "Escape") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           setTimeout(() => {
//                             quantityRef.current?.focus();
//                             quantityRef.current?.select();
//                           }, 100);

//                           return;
//                         }
//                       }}
//                       fullWidth
//                       error={!!errors.paymentMode}
//                       helperText={errors.paymentMode}
//                     >
//                       <MenuItem value="">Select Payment Mode</MenuItem>

//                       <MenuItem value="C">Cash</MenuItem>

//                       <MenuItem value="O">Online</MenuItem>

//                       <MenuItem value="M">Mix</MenuItem>
//                     </TextField>
//                   </Box>

//                   {/* TRANSPORT */}

//                   <Box
//                     sx={{
//                       flex: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontWeight: 600,
//                       }}
//                     >
//                       Transport
//                     </Typography>

//                     <TextField
//                       variant="standard"
//                       value={transport}
//                       onChange={(e) => setTransport(e.target.value)}
//                       placeholder="Transport"
//                       fullWidth
//                       type="number"
//                       inputProps={{
//                         onWheel: preventNumberInputScroll,
//                       }}
//                     />
//                   </Box>
//                 </Box>

//                 {/* ================================================= */}
//                 {/* MIX PAYMENT */}
//                 {/* ================================================= */}

//                 {paymentMode === "M" && (
//                   <Box
//                     sx={{
//                       mt: 1,
//                       p: 1,
//                       border: "1px solid #e0e0e0",
//                       borderRadius: 2,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontWeight: 700,
//                         mb: 1,
//                       }}
//                     >
//                       Mix Payment
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                       }}
//                     >
//                       <TextField
//                         label="Cash Amount"
//                         type="number"
//                         value={cashAmount}
//                         onChange={handleCashAmountChange}
//                         size="small"
//                         fullWidth
//                         inputProps={{
//                           min: 0,
//                           onWheel: preventNumberInputScroll,
//                         }}
//                       />

//                       <TextField
//                         label="Online Amount"
//                         type="number"
//                         value={onlineAmount}
//                         onChange={handleOnlineAmountChange}
//                         size="small"
//                         fullWidth
//                         inputProps={{
//                           min: 0,
//                           onWheel: preventNumberInputScroll,
//                         }}
//                       />
//                     </Box>
//                   </Box>
//                 )}
//               </Grid>

//               {/* ================================================= */}
//               {/* AMOUNT SUMMARY - FULL WIDTH BELOW PAYMENT */}
//               {/* ================================================= */}

//               <Grid
//                 item
//                 xs={12}
//                 md={12}
//                 sx={{
//                   width: "100%",
//                   minWidth: 0,
//                 }}
//               >
//                 <Paper
//                   elevation={4}
//                   sx={{
//                     width: "100%",
//                     p: 2,
//                     mt: 1,
//                     borderRadius: 2,
//                     border: "1px solid #e0e0e0",
//                     backgroundColor: "#ffffff",
//                     boxSizing: "border-box",
//                   }}
//                 >
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       fontWeight: 800,
//                       color: "#1976d2",
//                       mb: 1.5,
//                       fontSize: "22px",
//                     }}
//                   >
//                     Amount Summary
//                   </Typography>

//                   {/* ================================================= */}
//                   {/* SUMMARY FIRST ROW */}
//                   {/* ================================================= */}

//                   <Grid container spacing={2} alignItems="center">
//                     {/* SUBTOTAL */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "16px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Subtotal
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontSize: "18px",
//                             fontWeight: 700,
//                           }}
//                         >
//                           ₹ {Number(subTotalcal || 0).toFixed(2)}
//                         </Typography>
//                       </Box>
//                     </Grid>

//                     {/* DISCOUNT */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "16px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Discount
//                         </Typography>

//                         <TextField
//                           inputRef={discountRef}
//                           size="small"
//                           type="number"
//                           value={discount}
//                           onChange={(e) => {
//                             const value = e.target.value;

//                             if (value === "" || Number(value) >= 0) {
//                               setDiscount(value);
//                             }
//                           }}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               e.stopPropagation();

//                               setTimeout(() => {
//                                 receivedAmountRef.current?.focus();
//                                 receivedAmountRef.current?.select();
//                               }, 50);
//                             }
//                           }}
//                           placeholder="0.00"
//                           sx={{
//                             width: 120,
//                             "& input": {
//                               textAlign: "right",
//                               fontSize: "15px",
//                             },
//                           }}
//                           inputProps={{
//                             min: 0,
//                             onWheel: preventNumberInputScroll,
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     {/* TOTAL */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "20px",
//                             fontWeight: 700,
//                           }}
//                         >
//                           Total
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontSize: "25px",
//                             fontWeight: 800,
//                             color: "#1976d2",
//                           }}
//                         >
//                           ₹ {Number(total || 0).toFixed(2)}
//                         </Typography>
//                       </Box>
//                     </Grid>

//                     {/* RECEIVED */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "16px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Received Amount
//                         </Typography>

//                         <TextField
//                           inputRef={receivedAmountRef}
//                           size="small"
//                           type="number"
//                           value={receivedAmount}
//                           onChange={handleReceivedAmountChange}
//                           onKeyDown={(e) => {
//                             // existing code
//                           }}
//                           inputProps={{
//                             min: 0,
//                             onWheel: preventNumberInputScroll,
//                           }}
//                         />
//                       </Box>
//                     </Grid>
//                   </Grid>

//                   {/* ================================================= */}
//                   {/* PAYMENT STATUS - EXISTING LOGIC */}
//                   {/* ================================================= */}

//                   <Divider
//                     sx={{
//                       mt: 1.5,
//                       mb: 1.5,
//                     }}
//                   />

//                   {isPaid ? (
//                     <Box
//                       sx={{
//                         p: 1.5,
//                         borderRadius: 2,
//                         backgroundColor: "#e8f5e9",
//                         border: "1px solid #a5d6a7",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "18px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         Paid
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontSize: "20px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         ₹ {Number(grandTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   ) : received > grandTotal ? (
//                     <Box
//                       sx={{
//                         p: 1.5,
//                         borderRadius: 2,
//                         backgroundColor: "#e8f5e9",
//                         border: "1px solid #a5d6a7",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "18px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         Refund
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontSize: "20px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         ₹ {(received - grandTotal).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box
//                       sx={{
//                         p: 1.5,
//                         borderRadius: 2,
//                         backgroundColor: "#ffebee",
//                         border: "1px solid #ef9a9a",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "18px",
//                           fontWeight: 800,
//                           color: "#d32f2f",
//                         }}
//                       >
//                         Balance Due
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontSize: "20px",
//                           fontWeight: 800,
//                           color: "#d32f2f",
//                         }}
//                       >
//                         ₹ {Math.max(grandTotal - received, 0).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Paper>
//               </Grid>
//             </Grid>

//             {/* ===================================================== */}
//             {/* BUTTONS */}
//             {/* ===================================================== */}

//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               gap={2}
//               sx={{
//                 mt: 1,
//                 minHeight: "48px",
//               }}
//             >
//               {/* SAVE / UPDATE */}

//               <Button
//                 variant="contained"
//                 disabled={isSaving}
//                 onClick={(e) => handleSubmit(e, false)}
//                 sx={{
//                   background: "var(--primary-color)",
//                   minWidth: "105px",
//                   height: "42px",

//                   "&:hover": {
//                     background: "var(--primary-color)",
//                   },

//                   "&:disabled": {
//                     background: "#9e9e9e",
//                     color: "#ffffff",
//                     cursor: "not-allowed",
//                   },
//                 }}
//               >
//                 {isSaving ? (
//                   <>
//                     <CircularProgress
//                       size={20}
//                       thickness={4}
//                       sx={{
//                         color: "#ffffff",
//                         mr: 1,
//                       }}
//                     />
//                     Saving...
//                   </>
//                 ) : isEditing ? (
//                   "Update"
//                 ) : (
//                   "Save"
//                 )}
//               </Button>

//               <Button
//                 sx={{
//                   background: "var(--complementary-color)",
//                   minWidth: "105px",

//                   "&:disabled": {
//                     background: "#9e9e9e",
//                     color: "#ffffff",
//                   },
//                 }}
//                 onClick={(e) => handleSubmit(e, true)}
//                 variant="contained"
//                 startIcon={
//                   isSaving ? (
//                     <CircularProgress
//                       size={18}
//                       thickness={4}
//                       sx={{
//                         color: "#ffffff",
//                       }}
//                     />
//                   ) : (
//                     <PrintIcon />
//                   )
//                 }
//                 disabled={isSaving}
//               >
//                 {isSaving ? "Saving..." : "Print"}
//               </Button>

//               {/* CANCEL */}

//               <Button
//                 sx={{
//                   borderColor: "var(--complementary-color)",
//                   color: "var(--complementary-color)",
//                 }}
//                 onClick={handleDrawerClose}
//                 variant="outlined"
//               >
//                 <b>Cancel</b>
//               </Button>

//               {/* DELETE */}

//               {isEditing && (
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleClickOpen}
//                 >
//                   Delete
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </Drawer>
//       </Box>
//     </Box>
//   );
// };

// export default SalesEntry;
































































// import { useMemo, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   IconButton,
//   Menu,
//   Table,
//   Autocomplete,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   useMediaQuery,
//   Button,
//   Typography,
//   TextField,
//   Drawer,
//   Divider,
//   MenuItem,
//   InputAdornment,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   CircularProgress,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";

// import MinimizeIcon from "@mui/icons-material/Minimize";
// import { useTheme } from "@mui/material/styles";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import "react-phone-input-2/lib/style.css";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import PhoneInput from "react-phone-input-2";
// import axios from "axios";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import qs from "qs";
// import moment from "moment";
// import { MaterialReactTable } from "material-react-table";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SearchIcon from "@mui/icons-material/Search";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import Cookies from "js-cookie";
// import autoTable from "jspdf-autotable";
// import jsPDF from "jspdf";
// import PrintIcon from "@mui/icons-material/Print";
// import Tooltip from "@mui/material/Tooltip";
// import RemoveIcon from "@mui/icons-material/Remove";

// import amrutLogo from "../imgs/amrutlogo.png";
// import fremilaLogo from "../imgs/fremilalogo.png";

// const SalesEntry = () => {
//   const customerDropdownRef = useRef(null);
//   // =====================================================
//   // PREVENT MOUSE WHEEL FROM CHANGING NUMBER INPUT VALUE
//   // =====================================================
//   const preventNumberInputScroll = (event) => {
//     event.currentTarget.blur();
//   };

//   // =====================================================
//   // THIS SCREEN IS ONLY FOR REGULAR / RETAILER CUSTOMERS
//   // R = Regular / Retailer
//   // =====================================================
//   const PAGE_CUSTOMER_TYPE = "R";

//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [invoiceheaders, setInvoiceheaders] = useState([]);
//   const [invoicedetails, setInvoicedetails] = useState([]);
//   const [invoiceHistoryStatus, setInvoiceHistoryStatus] = useState({});
//   const [rows, setRows] = useState([]);

//   const [isSaving, setIsSaving] = useState(false);
//   const isSavingRef = useRef(false);

//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     }),
//   );

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(
//         new Date().toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//         }),
//       );
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const [productOptions, setProductOptions] = useState([]);

//   // =====================================================
//   // GET PRODUCT NAME FROM PRODUCT ID
//   // =====================================================
//   const getProductNameById = (productId) => {
//     if (productId === null || productId === undefined || productId === "") {
//       return "-";
//     }

//     const matchedProduct = productOptions.find((product) => {
//       return (
//         String(product?.value) === String(productId) ||
//         String(product?.Id) === String(productId) ||
//         String(product?.ProductId) === String(productId)
//       );
//     });

//     return matchedProduct?.label || matchedProduct?.ProductName || "-";
//   };

//   // =====================================================
//   // FORMAT HISTORY DATE SAFELY
//   // Handles API date object + string + null
//   // =====================================================
//   const formatHistoryDate = (value) => {
//     if (!value) {
//       return "-";
//     }

//     // API sometimes returns:
//     // { date: "...", timezone_type: 3, timezone: "..." }
//     if (typeof value === "object") {
//       value = value?.date || value?.Date || value?.value || "";
//     }

//     if (!value) {
//       return "-";
//     }

//     const parsed = moment(value);

//     if (!parsed.isValid()) {
//       return "-";
//     }

//     return parsed.format("DD/MM/YYYY");
//   };

//   // =====================================================
//   // INVOICE EDIT HISTORY
//   // =====================================================

//   const [historyOpen, setHistoryOpen] = useState(false);
//   const [historyLoading, setHistoryLoading] = useState(false);

//   const [selectedHistoryInvoice, setSelectedHistoryInvoice] = useState(null);

//   const [historyHeader, setHistoryHeader] = useState([]);
//   const [historyDetails, setHistoryDetails] = useState([]);

//   const [currentHistoryHeader, setCurrentHistoryHeader] = useState(null);

//   const [currentHistoryDetails, setCurrentHistoryDetails] = useState([]);

//   // NEW
//   const [selectedHistoryVersion, setSelectedHistoryVersion] = useState(null);

//   const [selectedHistoryDetails, setSelectedHistoryDetails] = useState([]);

//   const [newCustomerAddress, setNewCustomerAddress] = useState("");

//  const [minimizedBills, setMinimizedBills] = useState(() => {
//   try {
//     return JSON.parse(
//       localStorage.getItem("minimizedRegularBills") || "[]"
//     );
//   } catch {
//     return [];
//   }
// });

// useEffect(() => {
//   localStorage.setItem(
//     "minimizedRegularBills",
//     JSON.stringify(minimizedBills)
//   );
// }, [minimizedBills]);

//   // =====================================================
//   // SELECT HISTORY VERSION
//   // =====================================================

//   const handleHistoryVersionClick = (historyItem) => {
//     if (!historyItem) {
//       return;
//     }

//     const version = Number(historyItem?.VersionNo);

//     if (!version) {
//       toast.error("Version not found.");
//       return;
//     }

//     // console.log("======================================");
//     // console.log("HISTORY VERSION CLICK");
//     // console.log("Invoice No:", historyItem?.InvoiceNo);
//     // console.log("Invoice ID:", historyItem?.InvoiceId);
//     // console.log("Version:", version);
//     // console.log("======================================");

//     // Selected version
//     setSelectedHistoryVersion(version);

//     // Find all product details belonging to this version
//     const versionDetails = historyDetails.filter(
//       (detail) => Number(detail?.VersionNo) === version,
//     );

//     // console.log("SELECTED VERSION DETAILS:", versionDetails);

//     setSelectedHistoryDetails(versionDetails);
//   };

//   const fetchCurrentInvoiceForHistory = async (invoiceId) => {
//     try {
//       // ==========================================
//       // CURRENT HEADER
//       // ==========================================
//       const headerResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
//       );

//       const headerData = headerResponse.data;

//       const currentHeader = Array.isArray(headerData)
//         ? headerData[0] || null
//         : Array.isArray(headerData?.data)
//           ? headerData.data[0] || null
//           : headerData?.data || headerData || null;

//       // ==========================================
//       // CURRENT DETAILS
//       // ==========================================
//       const detailResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const detailData = detailResponse.data;

//       const currentDetails = Array.isArray(detailData)
//         ? detailData
//         : Array.isArray(detailData?.data)
//           ? detailData.data
//           : detailData?.data
//             ? [detailData.data]
//             : detailData
//               ? [detailData]
//               : [];

//       setCurrentHistoryHeader(currentHeader);
//       setCurrentHistoryDetails(currentDetails);

//       return {
//         header: currentHeader,
//         details: currentDetails,
//       };
//     } catch (error) {
//       console.error("CURRENT INVOICE HISTORY FETCH ERROR:", error);

//       throw error;
//     }
//   };

//   const handleInvoiceHistoryClick = async (invoice) => {
//     try {
//       const invoiceId = invoice?.Id || invoice?.InvoiceId;

//       if (!invoiceId) {
//         toast.error("Invoice ID not found.");
//         return;
//       }

//       // console.log("======================================");
//       // console.log("INVOICE HISTORY CLICK");
//       // console.log("Invoice ID:", invoiceId);
//       // console.log("======================================");

//       setSelectedHistoryInvoice(invoice);
//       setHistoryOpen(true);
//       setHistoryLoading(true);
//       setSelectedHistoryVersion(null);
//       setSelectedHistoryDetails([]);

//       // =================================================
//       // 1. OLD HEADER HISTORY
//       // =================================================
//       const headerResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       // console.log("OLD HEADER HISTORY:", headerResponse.data);

//       const headerData = headerResponse.data;

//       const oldHeaders = Array.isArray(headerData)
//         ? headerData
//         : Array.isArray(headerData?.data)
//           ? headerData.data
//           : headerData?.data
//             ? [headerData.data]
//             : headerData
//               ? [headerData]
//               : [];

//       setHistoryHeader(oldHeaders);

//       // =================================================
//       // 2. OLD DETAIL HISTORY
//       // =================================================
//       const detailResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       // console.log("OLD DETAIL HISTORY:", detailResponse.data);

//       const detailData = detailResponse.data;

//       const oldDetails = Array.isArray(detailData)
//         ? detailData
//         : Array.isArray(detailData?.data)
//           ? detailData.data
//           : detailData?.data
//             ? [detailData.data]
//             : detailData
//               ? [detailData]
//               : [];

//       setHistoryDetails(oldDetails);

//       // =================================================
//       // 3. CURRENT INVOICE
//       // =================================================
//       await fetchCurrentInvoiceForHistory(invoiceId);

//       // =================================================
//       // DEFAULT PREVIOUS VERSION
//       // =================================================

//       if (oldHeaders.length > 0) {
//         const latestVersionItem = [...oldHeaders].sort(
//           (a, b) => Number(b?.VersionNo || 0) - Number(a?.VersionNo || 0),
//         )[0];

//         const latestVersion = Number(latestVersionItem?.VersionNo);

//         if (latestVersion) {
//           setSelectedHistoryVersion(latestVersion);

//           const latestVersionDetails = oldDetails.filter(
//             (detail) => Number(detail?.VersionNo) === latestVersion,
//           );

//           setSelectedHistoryDetails(latestVersionDetails);
//         }
//       }
//     } catch (error) {
//       console.error("INVOICE HISTORY ERROR:", error);

//       toast.error("Unable to load invoice history.");
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   const [searchText, setSearchText] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const getTodayDate = () => {
//     const today = new Date();

//     return (
//       today.getFullYear() +
//       "-" +
//       String(today.getMonth() + 1).padStart(2, "0") +
//       "-" +
//       String(today.getDate()).padStart(2, "0")
//     );
//   };

//   const [fromDate, setFromDate] = useState(getTodayDate());
//   const [toDate, setToDate] = useState(getTodayDate());

//   const [financialYearFromDate, setFinancialYearFromDate] = useState("");
//   const [financialYearToDate, setFinancialYearToDate] = useState("");

//   const filteredInvoiceData = useMemo(() => {
//     const search = searchText.trim().toLowerCase();

//     return invoiceheaders.filter((invoice) => {
     
//       // ==============================
//       // BILL / INVOICE NO
//       // ==============================
//       const billNo = String(
//         invoice?.InvoiceNo ||
//           invoice?.InvoiceNumber ||
//           invoice?.BillNo ||
//           invoice?.BillNumber ||
//           invoice?.Id ||
//           "",
//       ).toLowerCase();

//       // ==============================
//       // CUSTOMER NAME
//       // ==============================
//       const customerName = String(
//         invoice?.accountDetails?.AccountName || "",
//       ).toLowerCase();

//       // ==============================
//       // CATEGORY
//       // ==============================
//       const accountId = Number(invoice?.AccountId || 0);

//       const customerType = String(
//         invoice?.addressDetails?.CustomerType ||
//           invoice?.addressDetails?.customerType ||
//           invoice?.accountDetails?.CustomerType ||
//           invoice?.accountDetails?.customerType ||
//           invoice?.CustomerType ||
//           invoice?.customerType ||
//           "",
//       )
//         .trim()
//         .toUpperCase();

//       // =====================================================
//       // SALES ENTRY = REGULAR
//       //
//       // AccountId = 0 → Regular
//       // CustomerType = R → Regular
//       // D/C → Not Regular
//       // =====================================================

//       const isRegular = accountId === 0 || customerType === "R";

//       if (!isRegular) {
//         return false;
//       }

//       let categoryName = "";

//       if (accountId === 0 || customerType === "R") {
//         categoryName = "regular";
//       } else if (customerType === "D") {
//         categoryName = "dealer";
//       } else if (customerType === "C") {
//         categoryName = "caterers";
//       }

//       // ==============================
//       // INVOICE DATE
//       // ==============================
//       const invoiceDate = invoice?.InvoiceDate?.date
//         ? invoice.InvoiceDate.date.substring(0, 10)
//         : "";

//       // ==============================
//       // CATEGORY FILTER
//       // ==============================
//       const categoryMatch =
//         categoryFilter === "" || customerType === categoryFilter;

//       // ==============================
//       // SEARCH FILTER
//       // ==============================
//       const searchMatch =
//         search === "" ||
//         billNo.includes(search) ||
//         customerName.includes(search) ||
//         categoryName.includes(search);

//       // ==============================
//       // FROM DATE FILTER
//       // ==============================
//       const fromDateMatch =
//         fromDate === "" || (invoiceDate !== "" && invoiceDate >= fromDate);

//       // ==============================
//       // TO DATE FILTER
//       // ==============================
//       const toDateMatch =
//         toDate === "" || (invoiceDate !== "" && invoiceDate <= toDate);

//       // ==============================
//       // ALL FILTERS MUST MATCH
//       // ==============================
//       return categoryMatch && searchMatch && fromDateMatch && toDateMatch;
//     });
//   }, [invoiceheaders, searchText, categoryFilter, fromDate, toDate]);

//   useEffect(() => {
//     // fetchInvdetails();
//   }, []);

//   useEffect(() => {
//     const handleSalesShortcut = (event) => {
//       // --------------------------------------------------
//       // Do not run shortcut while typing
//       // --------------------------------------------------

//       const tagName = event.target?.tagName?.toLowerCase();

//       const isTyping =
//         tagName === "input" ||
//         tagName === "textarea" ||
//         tagName === "select" ||
//         event.target?.isContentEditable;

//       if (isTyping) {
//         return;
//       }

     

//       if (isDrawerOpen) {
//         return;
//       }

//       // --------------------------------------------------
//       // Ignore Ctrl / Alt / Windows combinations
//       // --------------------------------------------------

//       if (event.ctrlKey || event.altKey || event.metaKey) {
//         return;
//       }

//       // ==================================================
//       // R = REGULAR SALES ENTRY
//       // ==================================================

//       if (event.key?.toLowerCase() === "r") {
//         event.preventDefault();
//         event.stopPropagation();

//         // Open Regular Sales Entry
//         setIsDrawerOpen(true);

//         // Reset form for new bill
//         resetForm();
//         setIsEditing(false);
//         setOpen(false);

//         // Focus directly on Select Product
//         setTimeout(() => {
//           productRef.current?.focus();
//           setProductDropdownOpen(true);
//         }, 300);

//         return;
//       }

//       // ==================================================
//       // D = SALES DEALER
//       // ==================================================

//       if (event.key?.toLowerCase() === "d") {
//         event.preventDefault();
//         event.stopPropagation();

//         // console.log("D pressed - Opening Dealer Bill Entry");

//         navigate("/salesdealer", {
//           state: {
//             openCreateForm: true,
//           },
//         });

//         return;
//       }

//       // ==================================================
//       // C = SALES CATERERS
//       // ==================================================

//       if (event.key?.toLowerCase() === "c") {
//         event.preventDefault();
//         event.stopPropagation();

//         // console.log("C pressed - Opening Caterers Bill Entry");

//         navigate("/salescaterers", {
//           state: {
//             openCreateForm: true,
//           },
//         });

//         return;
//       }
//     };

//     window.addEventListener("keydown", handleSalesShortcut, true);

//     return () => {
//       window.removeEventListener("keydown", handleSalesShortcut, true);
//     };
//   }, [navigate, isDrawerOpen]);

//   // get of Invoice header
//   // get of Invoice header

//   const fetchInvoiceHeader = async (
//     selectedFromDate = fromDate,
//     selectedToDate = toDate,
//   ) => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     // 1. Format dates for API
//     const formatDateForAPI = (value) => {
//       if (!value) return "";

//       if (value instanceof Date) {
//         if (isNaN(value.getTime())) return "";

//         const year = value.getFullYear();
//         const month = String(value.getMonth() + 1).padStart(2, "0");
//         const day = String(value.getDate()).padStart(2, "0");

//         return `${year}-${month}-${day}`;
//       }

//       const str = String(value).trim();

//       if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
//         return str.substring(0, 10);
//       }

//       const dmyMatch = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);

//       if (dmyMatch) {
//         return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
//       }

//       const parsedDate = new Date(value);

//       if (isNaN(parsedDate.getTime())) return "";

//       const year = parsedDate.getFullYear();
//       const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
//       const day = String(parsedDate.getDate()).padStart(2, "0");

//       return `${year}-${month}-${day}`;
//     };

//     const formattedFromDate = formatDateForAPI(selectedFromDate);
//     const formattedToDate = formatDateForAPI(selectedToDate);

//     if (
//       !formattedFromDate ||
//       !formattedToDate ||
//       formattedFromDate > formattedToDate
//     ) {
//       console.warn("Invalid invoice date range:", {
//         formattedFromDate,
//         formattedToDate,
//       });

//       setInvoiceheaders([]);
//       return;
//     }

//     // 2. Normalize array responses
//     const getArrayData = (result) => {
//       if (Array.isArray(result)) return result;
//       if (Array.isArray(result?.data)) return result.data;
//       if (Array.isArray(result?.Data)) return result.Data;

//       return [];
//     };

//     // 3. Normalize single-record responses
//     const normalizeSingleRecord = (result) => {
//       if (Array.isArray(result)) return result[0] || null;
//       if (Array.isArray(result?.data)) return result.data[0] || null;
//       if (Array.isArray(result?.Data)) return result.Data[0] || null;

//       if (result?.data && typeof result.data === "object") {
//         return result.data;
//       }

//       if (result?.Data && typeof result.Data === "object") {
//         return result.Data;
//       }

//       return result && typeof result === "object" ? result : null;
//     };

//     // 4. Fetch JSON safely
//     const fetchJSON = async (url) => {
//       const response = await fetch(url, requestOptions);

//       if (!response.ok) {
//         throw new Error(
//           `API failed: ${response.status} ${response.statusText} - ${url}`,
//         );
//       }

//       return response.json();
//     };

//     try {
//       // 5. Generate date list
//       const getDateList = (startDate, endDate) => {
//         const dates = [];
//         const current = new Date(`${startDate}T00:00:00`);
//         const end = new Date(`${endDate}T00:00:00`);

//         while (!isNaN(current.getTime()) && current <= end) {
//           const year = current.getFullYear();
//           const month = String(current.getMonth() + 1).padStart(2, "0");
//           const day = String(current.getDate()).padStart(2, "0");

//           dates.push(`${year}-${month}-${day}`);
//           current.setDate(current.getDate() + 1);
//         }

//         return dates;
//       };

//       const selectedDates = getDateList(formattedFromDate, formattedToDate);

//       // 6. Fetch invoice pages for one date
//       const fetchInvoicesForDate = async (selectedDate) => {
//         const getPageUrl = (page) =>
//           `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}&InvoiceDate=${encodeURIComponent(selectedDate)}`;

//         const firstResult = await fetchJSON(getPageUrl(1));

//         const totalPages = Math.max(
//           1,
//           Number(
//             firstResult?.total_pages ??
//               firstResult?.TotalPages ??
//               firstResult?.pages ??
//               1,
//           ) || 1,
//         );

//         const invoices = [...getArrayData(firstResult)];

//         // Fetch remaining pages only when required
//         if (totalPages > 1) {
//           const pageResults = await Promise.all(
//             Array.from({ length: totalPages - 1 }, (_, index) => index + 2).map(
//               async (page) => {
//                 const result = await fetchJSON(getPageUrl(page));
//                 return getArrayData(result);
//               },
//             ),
//           );

//           pageResults.forEach((pageData) => {
//             invoices.push(...pageData);
//           });
//         }

//         return invoices;
//       };

//       // 7. Fetch dates in small batches
//       const allInvoiceData = [];
//       const DATE_BATCH_SIZE = 3;

//       for (
//         let index = 0;
//         index < selectedDates.length;
//         index += DATE_BATCH_SIZE
//       ) {
//         const dateBatch = selectedDates.slice(index, index + DATE_BATCH_SIZE);

//         const batchResults = await Promise.all(
//           dateBatch.map((date) => fetchInvoicesForDate(date)),
//         );

//         batchResults.forEach((invoices) => {
//           allInvoiceData.push(...invoices);
//         });
//       }

//       // 8. Remove duplicate invoices
//       const invoiceMap = new Map();

//       allInvoiceData.forEach((invoice) => {
//         if (invoice?.Id !== undefined && invoice?.Id !== null) {
//           invoiceMap.set(String(invoice.Id), invoice);
//         }
//       });

//       const uniqueInvoices = Array.from(invoiceMap.values());

//       // 9. Filter invoices by date range
//       const filteredInvoices = uniqueInvoices.filter((invoice) => {
//         let rawDate = invoice?.InvoiceDate;

//         if (rawDate && typeof rawDate === "object") {
//           rawDate = rawDate.date || rawDate.Date || "";
//         }

//         const invoiceDate = String(rawDate || "").substring(0, 10);

//         return (
//           invoiceDate >= formattedFromDate && invoiceDate <= formattedToDate
//         );
//       });

//       // 10. Get unique customer IDs
//       const accountIds = [
//         ...new Set(
//           filteredInvoices
//             .map((invoice) => Number(invoice?.AccountId || 0))
//             .filter((id) => Number.isFinite(id) && id > 0),
//         ),
//       ];

//       // 11. Fetch Account and Address details in batches
//       const accountCache = new Map();
//       const ACCOUNT_BATCH_SIZE = 5;

//       for (
//         let index = 0;
//         index < accountIds.length;
//         index += ACCOUNT_BATCH_SIZE
//       ) {
//         const accountBatch = accountIds.slice(
//           index,
//           index + ACCOUNT_BATCH_SIZE,
//         );

//         await Promise.all(
//           accountBatch.map(async (accountId) => {
//             const accountUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(accountId)}`;

//             const addressUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(accountId)}`;

//             const [accountResult, addressResult] = await Promise.allSettled([
//               fetchJSON(accountUrl),
//               fetchJSON(addressUrl),
//             ]);

//             const accountDetails =
//               accountResult.status === "fulfilled"
//                 ? normalizeSingleRecord(accountResult.value)
//                 : null;

//             const addressDetails =
//               addressResult.status === "fulfilled"
//                 ? normalizeSingleRecord(addressResult.value)
//                 : null;

//             if (accountResult.status === "rejected") {
//               console.error(
//                 `Account API failed for AccountId ${accountId}:`,
//                 accountResult.reason,
//               );
//             }

//             if (addressResult.status === "rejected") {
//               console.error(
//                 `Address API failed for AccountId ${accountId}:`,
//                 addressResult.reason,
//               );
//             }

//             accountCache.set(accountId, {
//               accountDetails,
//               addressDetails,
//             });
//           }),
//         );
//       }

//       // 12. Attach customer details
//       const invoicesWithDetails = filteredInvoices.map((invoice) => {
//         const accountId = Number(invoice?.AccountId || 0);
//         const cached = accountCache.get(accountId) || {};

//         const accountDetails = cached.accountDetails || {};
//         const addressDetails = cached.addressDetails || null;

//         const customerType = String(
//           addressDetails?.CustomerType ??
//             addressDetails?.customerType ??
//             accountDetails?.CustomerType ??
//             accountDetails?.customerType ??
//             invoice?.CustomerType ??
//             invoice?.customerType ??
//             "",
//         )
//           .trim()
//           .toUpperCase();

//         return {
//           ...invoice,
//           accountDetails: {
//             ...accountDetails,
//             CustomerType: customerType,
//           },
//           addressDetails,
//         };
//       });

//       // 13. Keep Regular / Retailer invoices only
//       const regularInvoices = invoicesWithDetails.filter((invoice) => {
//         const accountId = Number(invoice?.AccountId || 0);

//         const customerType = String(
//           invoice?.addressDetails?.CustomerType ??
//             invoice?.addressDetails?.customerType ??
//             invoice?.accountDetails?.CustomerType ??
//             invoice?.accountDetails?.customerType ??
//             invoice?.CustomerType ??
//             invoice?.customerType ??
//             "",
//         )
//           .trim()
//           .toUpperCase();

//         return accountId === 0 || customerType === "R";
//       });

//       // 14. Update invoice table
//       setInvoiceheaders(regularInvoices);

//       // IMPORTANT:
//       // Do not call checkInvoiceHistory(regularInvoices) here.
//       // This avoids automatically starting per-invoice history GET requests.
//       // History status will not be automatically refreshed by this function.
//     } catch (error) {
//       console.error("Error fetching invoice headers:", error);
//       toast.error("Unable to refresh invoice list.");

//       // Avoid clearing the existing table if a refresh request fails.
//     }
//   };

//   const checkInvoiceHistory = async (invoiceList) => {
//     try {
//       const historyStatus = {};

//       await Promise.all(
//         invoiceList.map(async (invoice) => {
//           const invoiceId = invoice?.Id;

//           if (!invoiceId) {
//             return;
//           }

//           try {
//             const response = await axios.get(
//               `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//             );

//             const data = response.data;

//             const historyList = Array.isArray(data)
//               ? data
//               : Array.isArray(data?.data)
//                 ? data.data
//                 : data?.data
//                   ? [data.data]
//                   : data
//                     ? [data]
//                     : [];

//             historyStatus[invoiceId] = historyList.length > 0;
//           } catch (error) {
//             console.error(
//               `History check failed for InvoiceId ${invoiceId}:`,
//               error,
//             );

//             historyStatus[invoiceId] = false;
//           }
//         }),
//       );

//       // console.log("INVOICE HISTORY STATUS:", historyStatus);

//       setInvoiceHistoryStatus(historyStatus);
//     } catch (error) {
//       console.error("History status error:", error);
//     }
//   };

//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleMenuOpen = () => {
//     setIsDrawerOpen(true);
//     //  handleEdit()
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     // handleMenuOpen(false);
//   };

//  const handleNewClick = () => {
//   resetForm();
//   setIsEditing(false);
//   setEditId("");
//   setOpen(false);
//   setIsDrawerOpen(true);
// };

//   // ======================================================
//   // MINIMIZE CURRENT SALES BILL
//   // ======================================================


// const handleMinimizeBill = () => {
//   try {
//     // Create a unique ID for each new bill
//     const draftId =
//       isEditing && editId
//         ? `edit-${editId}`
//         : `new-${Date.now()}-${Math.random()
//             .toString(36)
//             .slice(2, 9)}`;

//     // Capture the current form data
//     const draftBill = {
//       draftId,

//       // Edit information
//       isEditing,
//       editId: editId || null,

//       // Invoice information
//       invoiceNo,
//       invoiceDate,
//       device,

//       // Customer information
//       customerName,
//       phone,
//       selectedAccount,
//       accountDetails,

//       // Product details
//       rows: Array.isArray(rows) ? rows : [],
//       selectedProductID,
//       productName,
//       selectedProductName,
//       quantity,
//       rate,
//       amount,

//       // Payment information
//       paymentMode,
//       cashAmount,
//       onlineAmount,
//       receivedAmount,

//       // Amount details
//       discount,
//       transport,

//       // Other details
//       isGST,
//       billFor,
//       machineID,
//       editingRow,

//       // Minimized timestamp
//       minimizedAt: new Date().toISOString(),
//     };

//     // Create an independent snapshot of the bill
//     const independentDraft = JSON.parse(
//       JSON.stringify(draftBill)
//     );

//     console.log(
//       "Minimizing bill:",
//       independentDraft.draftId,
//       independentDraft.rows
//     );

//     // Add the new draft or update the matching draft
//     setMinimizedBills((prev) => {
//       const existingIndex = prev.findIndex(
//         (bill) =>
//           bill.draftId === independentDraft.draftId
//       );

//       if (existingIndex !== -1) {
//         const updatedBills = [...prev];
//         updatedBills[existingIndex] = independentDraft;
//         return updatedBills;
//       }

//       return [...prev, independentDraft];
//     });

//     // Close the drawer without resetting the form
//     setIsDrawerOpen(false);
//     setShowDropdown(false);

//     toast.success("Sales bill minimized successfully.");
//   } catch (error) {
//     console.error("Error minimizing sales bill:", error);
//     toast.error("Unable to minimize sales bill.");
//   }
// };




// const handleResumeBill = (billId) => {
//   try {
//     console.log("========== RESUME BILL START ==========");
//     console.log("Clicked Bill ID:", billId);

//     // Find the exact minimized bill
//     const bill = minimizedBills.find(
//       (item) => String(item.draftId) === String(billId)
//     );

//     console.log(
//       "Available Drafts:",
//       minimizedBills.map((item) => ({
//         draftId: item.draftId,
//         products: (item.rows || []).map((row) => ({
//           ProductId: row.ProductId,
//           ProductName: row.ProductName,
//           Rate: row.Rate,
//         })),
//       }))
//     );

//     if (!bill) {
//       console.error("Minimized bill not found:", billId);
//       toast.error("Minimized bill not found.");
//       return;
//     }

//     console.log("Selected Draft ID:", bill.draftId);
//     console.log("Selected Draft Data:", bill);

//     // Create an independent copy of the selected bill's rows
//     const restoredRows = JSON.parse(
//       JSON.stringify(Array.isArray(bill.rows) ? bill.rows : [])
//     );

//     console.table(
//       restoredRows.map((row) => ({
//         ProductId: row.ProductId,
//         ProductName: row.ProductName,
//         Quantity: row.Quantity,
//         Rate: row.Rate,
//         Amount: row.Amount,
//       }))
//     );

//     // Restore invoice information
//     setInvoiceNo(bill.invoiceNo ?? "");
//     setInvoiceDate(
//       bill.invoiceDate || moment().format("YYYY-MM-DD")
//     );
//     setDevice(bill.device ?? "");

//     // Restore customer information
//     setSelectedAccount(bill.selectedAccount ?? "");
//     setCustomerName(bill.customerName ?? "");
//     setPhone(bill.phone ?? "");

//     setAccountDetails(
//       bill.accountDetails ?? {
//         AccountName: "",
//         Address1: "",
//         Address2: "",
//         Address3: "",
//         GSTNo: "",
//       }
//     );

//     // Restore product table rows
//     setRows(restoredRows);

//     // Restore current product entry
//     setSelectedProductId(bill.selectedProductID ?? "");
//     setProductName(bill.productName ?? "");
//     setSelectedProductName(bill.selectedProductName ?? "");
//     setQuantity(bill.quantity ?? "");
//     setRate(bill.rate ?? "");
//     SetAmount(bill.amount ?? "");
//     setEditingRow(bill.editingRow ?? null);

//     // Restore payment information
//     setPaymentMode(bill.paymentMode ?? "");
//     setCashAmount(bill.cashAmount ?? "");
//     setOnlineAmount(bill.onlineAmount ?? "");
//     setReceivedAmount(bill.receivedAmount ?? "");

//     // Restore amount details
//     setDiscount(bill.discount ?? "");
//     setTransport(bill.transport ?? "");

//     // Restore GST and additional information
//     setIsGST(bill.isGST ?? false);
//     setBillFor(bill.billFor ?? "");
//     setMachineID(bill.machineID ?? "");

//     // Restore edit information
//     setIsEditing(Boolean(bill.isEditing));
//     setEditId(bill.editId ?? "");

//     // Remove only the selected draft
//     setMinimizedBills((prev) =>
//       prev.filter(
//         (item) => String(item.draftId) !== String(bill.draftId)
//       )
//     );

//     setShowDropdown(false);
//     setIsDrawerOpen(true);

//     console.log("Restored Bill ID:", bill.draftId);
//     console.log("Restored Product Rows:", restoredRows);
//     console.log("========== RESUME BILL END ==========");

//     toast.success("Minimized bill resumed successfully.");
//   } catch (error) {
//     console.error("Error resuming minimized bill:", error);
//     toast.error("Unable to resume minimized bill.");
//   }
// };




// const handleRemoveMinimizedBill = (billId) => {
//   try {
//     setMinimizedBills((prev) =>
//       prev.filter(
//         (item) => String(item.draftId) !== String(billId)
//       )
//     );

//     toast.success("Minimized bill removed.");
//   } catch (error) {
//     console.error("Error removing minimized bill:", error);
//     toast.error("Unable to remove minimized bill.");
//   }
// };


//   const handleDrawerClose = async () => {
//     setIsDrawerOpen(false);
//     setShowDropdown(false);
//     resetForm();

   
//     await fetchInvoiceHeader();
//   };

//   //for delete Header
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       // ==========================================
//       // 1. GET CURRENT INVOICE ID
//       // ==========================================
//       const deleteId = String(editId || "").trim();

//       if (!deleteId) {
//         console.error("DELETE: Invoice ID not found.");
//         toast.error("Invoice ID not found. Cannot delete.");
//         return;
//       }

//       // console.log("====================================");
//       // console.log("DELETE SALES ENTRY");
//       // console.log("DELETE INVOICE ID:", deleteId);
//       // console.log("====================================");

//       // ==========================================
//       // 2. DELETE INVOICE HEADER
//       // ==========================================
//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=invoiceheader&Id=${encodeURIComponent(deleteId)}`;

//       // console.log("DELETE URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       // console.log("DELETE API STATUS:", response.status);
//       // console.log("DELETE API RESPONSE:", resultText);

//       // ==========================================
//       // 3. CHECK API RESPONSE
//       // ==========================================
//       if (!response.ok) {
//         throw new Error(`Delete failed with status ${response.status}`);
//       }

//       // ==========================================
//       // 4. CLOSE CONFIRMATION
//       // ==========================================
//       setOpen(false);

//       // ==========================================
//       // 5. CLOSE EDIT DRAWER
//       // ==========================================
//       setIsDrawerOpen(false);

//       // ==========================================
//       // 6. RESET EDIT STATE
//       // ==========================================
//       setIsEditing(false);
//       setEditId("");

//       // ==========================================
//       // 7. RESET FORM
//       // ==========================================
//       resetForm();

//       // ==========================================
//       // 8. REFRESH INVOICE LIST
//       // ==========================================
//       await fetchInvoiceHeader();

//       // ==========================================
//       // 9. SUCCESS
//       // ==========================================
//       toast.success("Sales Entry Deleted successfully!");
//     } catch (error) {
//       console.error("DELETE SALES ENTRY ERROR:", error);

//       toast.error(error?.message || "Unable to delete Sales Entry.");
//     }
//   };

//   const [editId, setEditId] = useState("");

//   // =====================================================
//   // UPDATE / EDIT FORM
//   // =====================================================

//   const handleEdit = async (row) => {
//     try {
//       // // console.log("========== INVOICE EDIT START ==========");

//       // -------------------------------------------------
//       // 1. ORIGINAL INVOICE ROW
//       // -------------------------------------------------
//       const originalData = row?.original || row;

//       if (!originalData) {
//         console.error("No row selected for editing.");
//         toast.error("Please select an invoice.");
//         return;
//       }

//       // -------------------------------------------------
//       // 2. INVOICE ID
//       // -------------------------------------------------
//       const invoiceId = originalData.Id || originalData.InvoiceId;

//       if (!invoiceId) {
//         console.error("Invoice ID not found:", originalData);
//         toast.error("Invoice ID not found.");
//         return;
//       }

//       // // console.log("EDIT INVOICE ID:", invoiceId);

//       // -------------------------------------------------
//       // 3. FIND INVOICE HEADER
//       // -------------------------------------------------
//       let invheader = invoiceheaders.find(
//         (item) => String(item.Id) === String(invoiceId),
//       );

//       // If header is not found in invoiceheaders,
//       // use the selected table row
//       if (!invheader) {
//         invheader = originalData;
//       }

//       if (!invheader) {
//         console.error("Invoice header not found.");
//         toast.error("Invoice header not found.");
//         return;
//       }

//       // // console.log("EDIT INVOICE HEADER:", invheader);

//       // =================================================
//       // 3A. ONLY TODAY'S INVOICE CAN BE EDITED
//       // =================================================

//       const rawInvoiceDate =
//         typeof invheader.InvoiceDate === "object"
//           ? invheader.InvoiceDate?.date
//           : invheader.InvoiceDate;

//       if (!rawInvoiceDate) {
//         toast.error("Invoice date not found.");
//         return;
//       }

//       // Convert invoice date to YYYY-MM-DD
//       const invoiceDateText = String(rawInvoiceDate)
//         .split(" ")[0]
//         .split("T")[0];

//       // Today's date
//       const todayDate = moment().format("YYYY-MM-DD");

//       // // console.log("INVOICE DATE:", invoiceDateText);
//       // // console.log("TODAY DATE:", todayDate);

//       // Old invoice -> DO NOT ALLOW EDIT
//       if (invoiceDateText !== todayDate) {
//         toast.error("Only today's invoice can be edited.");
//         return;
//       }

//       // =================================================
//       // TODAY'S INVOICE -> CONTINUE EDIT
//       // =================================================

//       // -------------------------------------------------
//       // 4. GET SAVED INVOICE DETAILS
//       // -------------------------------------------------
//       const detailResponse = await axios.get(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       // // console.log("EDIT INVOICE DETAIL RESPONSE:", detailResponse.data);

//       // -------------------------------------------------
//       // 5. NORMALIZE DETAIL RESPONSE
//       // -------------------------------------------------
//       const detailData = detailResponse.data;

//       const invdetail = Array.isArray(detailData)
//         ? detailData
//         : Array.isArray(detailData?.data)
//           ? detailData.data
//           : detailData?.data
//             ? [detailData.data]
//             : detailData
//               ? [detailData]
//               : [];

//       // // console.log("EDIT SAVED DETAILS:", invdetail);

//       // -------------------------------------------------
//       // 6. MAP SAVED PRODUCTS
//       // -------------------------------------------------
//       const mappedRows = invdetail.map((detail) => {
//         const matchedProduct = productOptions.find(
//           (option) => String(option.value) === String(detail.ProductId),
//         );

//         const quantity = parseFloat(detail.Quantity) || 0;

//         const rate = parseFloat(detail.Rate) || 0;

//         const amount =
//           detail.Amount != null
//             ? parseFloat(detail.Amount) || 0
//             : quantity * rate;

//         return {
//           Id: detail.Id,

//           InvoiceId: detail.InvoiceId || invoiceId,

//           ProductId: detail.ProductId,

//           ProductName: detail.ProductName || matchedProduct?.label || "",

//           Quantity: quantity,

//           Rate: rate,

//           Amount: amount,

//           // Backend fields
//           // Keep these because save/update may need them

//           CGSTPercentage: detail.CGSTPercentage ?? 0,

//           CGSTAmount: detail.CGSTAmount ?? 0,

//           SGSTPercentage: detail.SGSTPercentage ?? 0,

//           SGSTAmount: detail.SGSTAmount ?? 0,

//           IGSTPercentage: detail.IGSTPercentage ?? 0,

//           IGSTAmount: detail.IGSTAmount ?? 0,

//           DiscountAmt: detail.DiscountAmt ?? 0,
//         };
//       });

//       // // console.log("EDIT MAPPED ROWS:", mappedRows);

//       // -------------------------------------------------
//       // 7. SET EDIT MODE
//       // -------------------------------------------------
//       setEditId(invoiceId);

//       setIsEditing(true);

//       // -------------------------------------------------
//       // 8. SET INVOICE HEADER VALUES
//       // -------------------------------------------------
//       setInvoiceNo(invheader.InvoiceNo || "");

//       setPhone(invheader.ContactNo || "");

//       setDevice(getDeviceForLoggedInUser());

//       setBillFor(invheader.BillFor || "");

//       // MachineId / MachineID
//       const machineValue = invheader.MachineID ?? invheader.MachineId ?? "";

//       setMachineID(machineValue !== "" ? String(machineValue) : "");

//       // IsGST / ISGST
//       const gstValue = invheader.IsGST ?? invheader.ISGST ?? 0;

//       setIsGST(Number(gstValue) === 1);

//       // -------------------------------------------------
//       // 9. INVOICE DATE
//       // -------------------------------------------------
//       setInvoiceDate(invoiceDateText);

//       // -------------------------------------------------
//       // 10. CUSTOMER
//       // -------------------------------------------------
//       if (invheader.AccountId) {
//         setSelectedAccount(invheader.AccountId);

       

//         try {
//           const customerResponse = await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invheader.AccountId}`,
//           );

//           const customerResult = await customerResponse.json();

//           const customerData = Array.isArray(customerResult)
//             ? customerResult[0]
//             : customerResult?.data || customerResult;

//           const actualCustomerName =
//             customerData?.AccountName || customerData?.accountName || "";

//           setCustomerName(actualCustomerName);

//           setAccountDetails((prev) => ({
//             ...prev,
//             AccountName: actualCustomerName,
//           }));
//         } catch (error) {
//           console.error("Customer Name fetch error:", error);

//           setCustomerName("");
//         }

//         // Address + GST
//         await fetchAccounts(invheader.AccountId);

//         // Existing function
//         fetchAccountName(invheader.AccountId);
//       } else {
//         setSelectedAccount("");
//         setCustomerName("");
//       }

//       // -------------------------------------------------
//       // 11. PAYMENT DETAILS
//       // -------------------------------------------------
//       setPaymentMode(invheader.PaymentMode || "");

//       setCashAmount(
//         invheader.CashAmount != null ? String(invheader.CashAmount) : "",
//       );

//       setOnlineAmount(
//         invheader.OnlineAmount != null ? String(invheader.OnlineAmount) : "",
//       );

//       setReceivedAmount(
//         invheader.ReceivedAmount != null
//           ? String(invheader.ReceivedAmount)
//           : "",
//       );

//       setDiscount(invheader.Discount != null ? String(invheader.Discount) : "");

//       setTransport(
//         invheader.Transport != null ? String(invheader.Transport) : "",
//       );

//       // -------------------------------------------------
//       // 12. LOAD SAVED PRODUCTS
//       // -------------------------------------------------
//       setRows(mappedRows);

//       // -------------------------------------------------
//       // 13. OPEN EDIT DRAWER
//       // -------------------------------------------------
//       setIsDrawerOpen(true);

//       // -------------------------------------------------
//       // 14. LOAD FIRST PRODUCT INTO EDIT INPUT
//       // -------------------------------------------------
//       if (mappedRows.length > 0) {
//         const firstRow = mappedRows[0];

//         // // console.log("FIRST PRODUCT FOR EDIT:", firstRow);

//         // IMPORTANT
//         // First saved row is now in EDIT mode
//         setEditingRow(null);

//         // Product
//         setSelectedProductId(firstRow.ProductId);

//         setProductName(firstRow.ProductName || "");

//         setSelectedProductName(firstRow.ProductName || "");

//         // Quantity
//         setQuantity(String(firstRow.Quantity ?? ""));

//         // Rate
//         setRate(String(firstRow.Rate ?? ""));

//         // Amount
//         SetAmount(Number(firstRow.Amount) || 0);

//         // GST values kept internally
//         setCGST(firstRow.CGSTPercentage ?? 0);

//         setCGSTAmount(firstRow.CGSTAmount ?? 0);

//         setSGST(firstRow.SGSTPercentage ?? 0);

//         setSGSTAmount(firstRow.SGSTAmount ?? 0);

//         setIGST(firstRow.IGSTPercentage ?? 0);

//         setIGSTAmount(firstRow.IGSTAmount ?? 0);

//         // Focus product field
//         setTimeout(() => {
//           productRef.current?.focus();
//         }, 200);
//       } else {
//         // -------------------------------------------------
//         // NO SAVED PRODUCT
//         // -------------------------------------------------
//         setEditingRow(null);

//         setSelectedProductId("");

//         setProductName("");

//         setSelectedProductName("");

//         setQuantity("");

//         setRate("");

//         SetAmount(0);

//         setCGST(0);
//         setCGSTAmount(0);

//         setSGST(0);
//         setSGSTAmount(0);

//         setIGST(0);
//         setIGSTAmount(0);
//       }

//       // -------------------------------------------------
//       // 15. FINAL DEBUG
//       // -------------------------------------------------
//       // console.log("======================================");

//       // console.log("EDIT MODE ACTIVE");

//       // console.log("EDIT ID:", invoiceId);

//       // console.log("EDIT DATE:", invoiceDateText);

//       // console.log("TODAY DATE:", todayDate);

//       // console.log("EDIT ROWS:", mappedRows);

//       // console.log("======================================");
//     } catch (error) {
//       console.error(
//         "EDIT INVOICE ERROR:",
//         error.response?.data || error.message || error,
//       );

//       toast.error("Unable to load invoice for editing.");
//     }
//   };

//   //table

//   //for preview
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewData, setPreviewData] = useState(null);

//   const columns = useMemo(
//     () => [
//       // ==================================================
//       // BILL NO
//       // ==================================================
//       {
//         accessorKey: "InvoiceNo",
//         header: "Bill No",
//         size: 100,

//         Cell: ({ cell }) => <span>{cell.getValue() || "-"}</span>,
//       },

//       // ==================================================
//       // INVOICE DATE
//       // ==================================================
//       {
//         accessorKey: "InvoiceDate.date",
//         header: "Invoice Date",
//         size: 120,

//         Cell: ({ cell }) => (
//           <span>
//             {cell.getValue()
//               ? moment(cell.getValue()).format("DD-MM-YYYY")
//               : "-"}
//           </span>
//         ),
//       },

//       // ==================================================
//       // CUSTOMER NAME
//       // ==================================================
//       {
//         header: "Customer Name",
//         size: 200,

//         accessorFn: (row) => row.accountDetails?.AccountName || "N/A",

//         Cell: ({ cell }) => <span>{cell.getValue()}</span>,
//       },

//       // ==================================================
//       // CATEGORY
//       // ==================================================
//       {
//         header: "Category",
//         size: 130,

//         accessorFn: (row) => {
//           const customerType = String(row?.accountDetails?.CustomerType || "")
//             .trim()
//             .toUpperCase();

//           if (customerType === "R") {
//             return "Retailer";
//           }

//           if (customerType === "D") {
//             return "Dealer";
//           }

//           if (customerType === "C") {
//             return "Caterers";
//           }

//           return "-";
//         },

//         Cell: ({ cell }) => <span>{cell.getValue()}</span>,
//       },

//       // ==================================================
//       // TOTAL
//       // ==================================================
//       {
//         accessorKey: "Total",
//         header: "Total",
//         size: 100,
//       },

//       // ==================================================
//       // ACTIONS
//       // ==================================================
//       {
//         header: "Actions",
//         size: 200,

//         Cell: ({ row }) => (
//           <Box display="flex" gap={1}>
//             {/* =========================
//               EDIT BUTTON
//           ========================= */}
//             <Button
//               sx={{
//                 background: "var(--primary-color)",
//               }}
//               variant="contained"
//               size="small"
//               onClick={() => {
//                 // // console.log("INVOICE EDIT CLICK:", row.original);

//                 handleEdit(row.original);
//               }}
//             >
//               Edit
//             </Button>

//             {/* =========================
//               PREVIEW BUTTON
//           ========================= */}
//             <Button
//               variant="contained"
//               sx={{
//                 background: "var(--complementary-color)",
//               }}
//               size="small"
//               onClick={async () => {
//                 try {
//                   // ---------------------------------
//                   // 1. GET SAVED INVOICE ID
//                   // ---------------------------------
//                   const invoiceId = row.original?.Id;

//                   if (!invoiceId) {
//                     toast.error("Invoice ID not found.");
//                     return;
//                   }

//                   // ---------------------------------
//                   // 2. GET THIS INVOICE DETAILS
//                   // ---------------------------------
//                   const detailResponse = await axios.get(
//                     `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//                   );

//                   // // console.log("INVOICE DETAIL RESPONSE:", detailResponse.data);

//                   const allDetails = Array.isArray(detailResponse.data)
//                     ? detailResponse.data
//                     : Array.isArray(detailResponse.data?.data)
//                       ? detailResponse.data.data
//                       : detailResponse.data?.data
//                         ? [detailResponse.data.data]
//                         : detailResponse.data
//                           ? [detailResponse.data]
//                           : [];

//                   // ---------------------------------
//                   // 3. GET ONLY THIS BILL DETAILS
//                   // ---------------------------------
//                   const invdetail = allDetails
//                     .filter(
//                       (detail) =>
//                         String(detail.InvoiceId) === String(invoiceId),
//                     )
//                     .map((detail) => {
//                       const matchedMaterial = productOptions.find(
//                         (item) =>
//                           String(item.value) === String(detail.ProductId),
//                       );

//                       return {
//                         ...detail,

//                         ProductName: matchedMaterial?.label || "Unknown",
//                       };
//                     });

//                   // ---------------------------------
//                   // 4. GET SAVED INVOICE HEADER
//                   // ---------------------------------
//                   let invoiceHeader = row.original;

//                   try {
//                     const headerResponse = await fetch(
//                       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
//                     );

//                     const headerResult = await headerResponse.json();

//                     invoiceHeader = Array.isArray(headerResult)
//                       ? headerResult[0]
//                       : Array.isArray(headerResult?.data)
//                         ? headerResult.data[0]
//                         : headerResult?.data
//                           ? headerResult.data
//                           : headerResult;

//                     // // console.log("SAVED INVOICE HEADER:", invoiceHeader);
//                   } catch (headerError) {
//                     console.error("Invoice Header Error:", headerError);
//                   }

//                   // ---------------------------------
//                   // 5. FINAL PREVIEW DATA
//                   // ---------------------------------

//                   const cashAmountSaved = Number(
//                     invoiceHeader?.CashAmount || 0,
//                   );

//                   const onlineAmountSaved = Number(
//                     invoiceHeader?.OnlineAmount || 0,
//                   );

//                   const savedReceivedAmount =
//                     invoiceHeader?.ReceivedAmount != null
//                       ? Number(invoiceHeader.ReceivedAmount)
//                       : cashAmountSaved + onlineAmountSaved;

//                   const finalPreviewData = {
//                     ...row.original,

//                     // ==========================================
//                     // CREATED DATE & TIME
//                     // ==========================================
//                     CreatedOn:
//                       invoiceHeader?.CreatedOn ??
//                       row.original?.CreatedOn ??
//                       null,

//                     // ==========================================
//                     // RECEIVED AMOUNT
//                     // ==========================================
//                     ReceivedAmount: savedReceivedAmount,

//                     // ==========================================
//                     // ACCOUNT DETAILS
//                     // ==========================================
//                     accountDetails: row.original?.accountDetails || {
//                       AccountName: "",
//                       Address1: "",
//                       Address2: "",
//                       Address3: "",
//                       GSTNo: "",
//                     },

//                     // ==========================================
//                     // INVOICE DETAILS
//                     // ==========================================
//                     invdetail: invdetail,
//                   };

//                   // // console.log("FINAL PREVIEW DATA:", finalPreviewData);

//                   // // console.log(
//                   //   "RECEIVED AMOUNT:",
//                   //   finalPreviewData.ReceivedAmount,
//                   // );

//                   // ---------------------------------
//                   // 6. CONSOLE CHECK
//                   // ---------------------------------
//                   // console.log("========== PREVIEW ==========");

//                   // console.log("Invoice ID:", invoiceId);

//                   // console.log("Invoice Header:", row.original);

//                   // console.log("Invoice Details:", invdetail);

//                   // console.log("Customer:", finalPreviewData.accountDetails);

//                   // console.log("FINAL PREVIEW DATA:", finalPreviewData);

//                   // console.log("=============================");

//                   // ---------------------------------
//                   // 7. OPEN PREVIEW
//                   // ---------------------------------
//                   setPreviewData(finalPreviewData);

//                   setPreviewOpen(true);
//                 } catch (error) {
//                   // // console.error("Preview Error:", error);

//                   toast.error("Unable to load invoice preview.");
//                 }
//               }}
//             >
//               Preview
//             </Button>
//           </Box>
//         ),
//       },

//       // ==================================================
//       // REMARK / EDITED
//       // ==================================================
//       {
//         header: "Remark",
//         size: 140,

//         accessorFn: (row) => {
//           const createdOn = row?.CreatedOn?.date || row?.CreatedOn || "";

//           const updatedOn = row?.UpdatedOn?.date || row?.UpdatedOn || "";

//           const updateCount = Number(row?.UpdateCount ?? 0);

//           const isEdited =
//             updateCount > 1 ||
//             (createdOn && updatedOn && String(createdOn) !== String(updatedOn));

//           return isEdited ? "Edited" : "-";
//         },

//         Cell: ({ row }) => {
//           const invoice = row.original;

//           const createdOn =
//             invoice?.CreatedOn?.date || invoice?.CreatedOn || "";

//           const updatedOn =
//             invoice?.UpdatedOn?.date || invoice?.UpdatedOn || "";

//           const updateCount = Number(invoice?.UpdateCount ?? 0);

//           const isEdited =
//             updateCount > 1 ||
//             (createdOn && updatedOn && String(createdOn) !== String(updatedOn));

//           // -----------------------------
//           // NOT EDITED
//           // -----------------------------
//           if (!isEdited) {
//             return (
//               <Typography
//                 sx={{
//                   color: "#999",
//                   fontWeight: 500,
//                 }}
//               >
//                 -
//               </Typography>
//             );
//           }

//           // -----------------------------
//           // EDITED
//           // -----------------------------
//           return (
//             <Button
//               variant="contained"
//               size="small"
//               sx={{
//                 background: "var(--primary-color)",
//                 minWidth: "80px",
//               }}
//               onClick={() => {
//                 // console.log("================================");

//                 // console.log("EDITED HISTORY CLICK");

//                 // console.log("Invoice No:", invoice?.InvoiceNo);

//                 // console.log("Invoice ID:", invoice?.Id);

//                 // console.log("================================");

//                 handleInvoiceHistoryClick(invoice);
//               }}
//             >
//               Edited
//             </Button>
//           );
//         },
//       },
//     ],
//     [invoiceheaders, invoicedetails, productOptions],
//   );

//   // =========================
//   // Integration
//   // =========================

//   // Invoice Details
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState("");

//   const [phone, setPhone] = useState("");

//   const [device, setDevice] = useState("");

//   const [userId, setUserId] = useState(
//     () => sessionStorage.getItem("UserId") || "",
//   );

//   // ======================================================
//   // GET DEVICE FOR LOGGED-IN USER
//   // ======================================================
//   const getDeviceForLoggedInUser = () => {
//     const userRole = String(sessionStorage.getItem("UserRole") || "")
//       .trim()
//       .toUpperCase();

//     if (userRole === "SALE") {
//       return "Device1";
//     }

//     if (userRole === "SALE2") {
//       return "Device2";
//     }

//     return "";
//   };

//   const userRole = String(sessionStorage.getItem("UserRole") || "")
//     .trim()
//     .toUpperCase();

//   const isAdmin = userRole === "ADMIN";

//   const [billFor, setBillFor] = useState("");

//   const [machineID, setMachineID] = useState("");

//   const [machineOptions, setMachineOptions] = useState([]);

//   const [isGST, setIsGST] = useState(false);

//   // Product Details
//   const [product, setProduct] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [rate, setRate] = useState("");
//   const [amount, SetAmount] = useState("");

//   const [editingRow, setEditingRow] = useState(null);

//   // Keyboard navigation refs
//   const quantityRef = useRef(null);
//   const rateRef = useRef(null);
//   const productRef = useRef(null);
//   const discountRef = useRef(null);
//   const receivedAmountRef = useRef(null);

//   const [productDropdownOpen, setProductDropdownOpen] = useState(false);

//   // ======================================================
//   // ESC = GO ONE STEP BACK
//   // ======================================================
//   useEffect(() => {
//     if (!isDrawerOpen) return;

//     const handleEscBack = (event) => {
//       if (event.key !== "Escape") return;

//       const activeElement = document.activeElement;

//       event.preventDefault();
//       event.stopPropagation();

//       // Received Amount -> Discount
//       if (receivedAmountRef.current === activeElement) {
//         setTimeout(() => {
//           discountRef.current?.focus();
//           discountRef.current?.select();
//         }, 50);
//         return;
//       }

//       // Discount -> Payment Mode
//       if (discountRef.current === activeElement) {
//         setTimeout(() => {
//           document.querySelector('[name="paymentMode"]')?.focus();
//         }, 50);
//         return;
//       }

//       // Payment Mode -> Quantity
//       if (activeElement?.name === "paymentMode") {
//         setTimeout(() => {
//           quantityRef.current?.focus();
//           quantityRef.current?.select();
//         }, 50);
//         return;
//       }

//       // Quantity -> Product
//       if (quantityRef.current === activeElement) {
//         setTimeout(() => {
//           productRef.current?.focus();
//         }, 50);
//         return;
//       }

//       // Product -> Customer
//       if (productRef.current === activeElement) {
//         setTimeout(() => {
//           const customerInput = document.querySelector(
//             'input[placeholder="Select Customer"]',
//           );

//           customerInput?.focus();
//         }, 50);
//         return;
//       }
//     };

//     window.addEventListener("keydown", handleEscBack, true);

//     return () => {
//       window.removeEventListener("keydown", handleEscBack, true);
//     };
//   }, [isDrawerOpen]);

//   // Tax Details
//   const [cgst, setCGST] = useState(0);
//   const [cgstAmount, setCGSTAmount] = useState(0);

//   const [sgst, setSGST] = useState(0);
//   const [sgstAmount, setSGSTAmount] = useState(0);

//   const [igst, setIGST] = useState(0);
//   const [igstAmount, setIGSTAmount] = useState(0);

//   // =========================
//   // Payment Details
//   // =========================
//   const [paymentMode, setPaymentMode] = useState(null);

//   // Received Amount
//   const [receivedAmount, setReceivedAmount] = useState("");

//   // Mix Payment
//   const [cashAmount, setCashAmount] = useState("");
//   const [onlineAmount, setOnlineAmount] = useState("");

//   // Transport
//   const [transport, setTransport] = useState("");

//   const [productName, setProductName] = useState("");
//   // =========================
//   // Customer / Account
//   // =========================
//   const [accountOptions, setAccountOptions] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [previousBalanceDue, setPreviousBalanceDue] = useState(0);

//   const [selectedCustomerName, setSelectedCustomerName] = useState("");

//   const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

//   const [acctGSTNo, setacctGSTNo] = useState("");

//   const [newCustomerMobile, setNewCustomerMobile] = useState("");

//   const fetchCustomerContact = async (customerId) => {
//     if (!customerId) {
//       setPhone("");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
//           customerId,
//         )}`,
//       );

//       if (!response.ok) {
//         throw new Error(`Contact API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const invoiceList = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : result?.data
//             ? [result.data]
//             : [];

//       invoiceList.sort((a, b) => Number(b?.Id || 0) - Number(a?.Id || 0));

//       const latestInvoice = invoiceList.find(
//         (invoice) =>
//           invoice?.ContactNo !== null &&
//           invoice?.ContactNo !== undefined &&
//           String(invoice.ContactNo).trim() !== "",
//       );

//       const savedContact = latestInvoice?.ContactNo || "";

//       // console.log("CUSTOMER SAVED CONTACT:", {
//       //   customerId,
//       //   savedContact,
//       //   latestInvoice,
//       // });

//       setPhone(String(savedContact));
//     } catch (error) {
//       console.error("Customer contact fetch error:", error);
//       setPhone("");
//     }
//   };

//   const fetchPreviousBalance = async (customerId, excludeInvoiceId = null) => {
//     if (!customerId) {
//       setPreviousBalanceDue(0);
//       return 0;
//     }

//     try {
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
//           customerId,
//         )}`,
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Invoice header API failed with status ${response.status}`,
//         );
//       }

//       const result = await response.json();

//       const invoiceList = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : result?.data
//             ? [result.data]
//             : [];

//       let previousBalance = 0;

//       for (const invoice of invoiceList) {
//         const invoiceId = Number(invoice?.Id || 0);

//         if (
//           excludeInvoiceId !== null &&
//           excludeInvoiceId !== undefined &&
//           invoiceId === Number(excludeInvoiceId)
//         ) {
//           continue;
//         }

//         const invoiceTotal = Number(invoice?.Total || 0);

//         let invoiceReceived = 0;

//         if (
//           invoice?.ReceivedAmount !== null &&
//           invoice?.ReceivedAmount !== undefined &&
//           invoice?.ReceivedAmount !== ""
//         ) {
//           invoiceReceived = Number(invoice.ReceivedAmount) || 0;
//         } else {
//           invoiceReceived =
//             (Number(invoice?.CashAmount) || 0) +
//             (Number(invoice?.OnlineAmount) || 0);
//         }

//         const invoiceDue = Math.max(invoiceTotal - invoiceReceived, 0);

//         previousBalance += invoiceDue;
//       }

//       setPreviousBalanceDue(previousBalance);

//       return previousBalance;
//     } catch (error) {
//       console.error("Previous balance fetch error:", error);

//       setPreviousBalanceDue(0);

//       return 0;
//     }
//   };

//   const [customerAddress1, setCustomerAddress1] = useState("");
//   const [customerAddress2, setCustomerAddress2] = useState("");
//   const [customerAddress3, setCustomerAddress3] = useState("");

//   // Customer complete details
//   const [accountDetails, setAccountDetails] = useState({
//     AccountName: "",
//     Address1: "",
//     Address2: "",
//     Address3: "",
//     GSTNo: "",
//   });

//   useEffect(() => {
//     // fetchAccounts();

//     fetchProduct();

//     fetchMachines();

//     setDevice(getDeviceForLoggedInUser());
//   }, []);

//   useEffect(() => {
//     if (fromDate && toDate) {
//       fetchInvoiceHeader(fromDate, toDate);
//     }
//   }, [fromDate, toDate]);

//   //fetch customer from  account table

//   const fetchProduct = async () => {
//     try {
//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster&RateType=Retailer",
//       );

//       const data = await response.json();

//       // console.log("RETAILER PRODUCT API RESPONSE:", data);

//       productvalidation(data);
//     } catch (error) {
//       // console.error("Error fetching retailer products:", error);
//     }
//   };

//   // ======================================================
//   // FETCH MACHINES
//   // ======================================================

//   const fetchMachines = async () => {
//     try {
//       const response = await axios.get(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=Machines",
//       );

//       // // console.log("Machines API Response:", response.data);

//       const data = Array.isArray(response.data) ? response.data : [];

//       const options = data.map((machine) => ({
//         value: machine.Id,
//         label: machine.MachineName || machine.Name || `Machine ${machine.Id}`,
//       }));

//       setMachineOptions(options);
//     } catch (error) {
//       console.error("Error fetching machines:", error);
//     }
//   };

//   const [selectedProductID, setSelectedProductId] = useState("");
//   const [selectedProductName, setSelectedProductName] = useState(null);

//   const productvalidation = (data) => {
//     // // console.log("RETAILER PRODUCT DATA:", data?.[0]);

//     const options = data.map((account) => ({
//       value: account?.Id,
//       label: account?.ProductName,
//       cgst: account?.CGSTPercentage,
//       sgst: account?.SGSTPercentage,
//       igst: account?.IGSTPercentage,

//       // Regular Sales Rate = PurchasePrice
//       purchaseRate: parseFloat(account?.PurchasePrice) || 0,
//     }));

//     setProductOptions(options);
//   };

//   const resetForm = () => {
//     // =========================
//     // Invoice Details
//     // =========================
//     setInvoiceNo("");
//     setInvoiceDate(new Date());
//     setPhone("");
//     setDevice(getDeviceForLoggedInUser());

//     // NEW BILL HEADER FIELDS
//     setBillFor("");
//     setMachineID("");
//     setIsGST(false);

//     // =========================
//     // Customer
//     // =========================

//     setSelectedAccount("");

//     setAccountDetails({
//       AccountName: "",
//       Address1: "",
//       Address2: "",
//       Address3: "",
//       GSTNo: "",
//     });

//     setacctGSTNo("");

//     setCustomerAddress1("");
//     setCustomerAddress2("");
//     setCustomerAddress3("");

//     // =========================
//     // Product Details
//     // =========================
//     setProduct("");
//     setQuantity("");
//     setRate("");
//     SetAmount("");

   

//     // Discount
//     setDiscount("");
//     setBaseAmount(0);

//     // =========================
//     // Tax Details
//     // =========================
//     setCGST("");
//     setCGSTAmount("");

//     setSGST("");
//     setSGSTAmount("");

//     setIGST("");
//     setIGSTAmount("");

//     // =========================
//     // Payment Details
//     // =========================
//     setPaymentMode("");
//     setReceivedAmount("");

//     // Mix Payment
//     setCashAmount("");
//     setOnlineAmount("");

//     // =========================
//     // Transport
//     // =========================
//     setTransport("");

//     // =========================
//     // Validation Errors
//     // =========================
//     setErrors({
//       invoiceDate: "",
//       selectedAccount: "",
//       paymentMode: "",
//       rows: "",
//     });

//     // =========================
//     // Customer Search
//     // =========================
//     setAccountOptions([]);
//     setAccountName("");
//     setText("");
//     setShowDropdown(false);

//     // =========================
//     // Product Table
//     // =========================
//     setRows([]);

//     // =========================
//     // Product Selection
//     // =========================
//     setSelectedProductId("");
//     setSelectedProductName("");
//     setProductName("");

//     // =========================
//     // Editing Row
//     // =========================
//     setEditingRow(null);

//     // =========================
//     // Tax / Amount Summary
//     // =========================
//     setSubTotalCal(0);
//     setCgstTotal(0);
//     setSgstTotal(0);
//     setIgstTotal(0);
//     setTotal(0);
//   };

//   const handleSubmit = async (e, shouldPrint = false) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     // 1. Prevent duplicate save
//     if (isSavingRef.current) return;

//     let printWindow = null;

//     // 2. Prepare rows, including the last product if Enter was not pressed
//     const rowsToSave = [...rows];

//     const pendingProductExists =
//       editingRow === null &&
//       selectedProductID &&
//       quantity !== "" &&
//       rate !== "" &&
//       Number(quantity) > 0 &&
//       Number(rate) > 0;

//     const pendingProductAlreadyExists = rows.some(
//       (row) =>
//         String(row.ProductId) === String(selectedProductID) &&
//         Number(row.Quantity) === Number(quantity) &&
//         Number(row.Rate) === Number(rate),
//     );

//     if (pendingProductExists && !pendingProductAlreadyExists) {
//       const selectedOption = productOptions.find(
//         (option) => String(option.value) === String(selectedProductID),
//       );

//       const pendingQuantity = parseFloat(quantity) || 0;
//       const pendingRate = parseFloat(rate) || 0;
//       const pendingAmount = pendingQuantity * pendingRate;

//       const pendingCGST = parseFloat(cgst) || 0;
//       const pendingSGST = parseFloat(sgst) || 0;
//       const pendingIGST = parseFloat(igst) || 0;

//       const pendingCGSTAmount =
//         cgstAmount !== "" && cgstAmount !== undefined
//           ? Number(cgstAmount) || 0
//           : (pendingCGST * pendingAmount) / 100;

//       const pendingSGSTAmount =
//         sgstAmount !== "" && sgstAmount !== undefined
//           ? Number(sgstAmount) || 0
//           : (pendingSGST * pendingAmount) / 100;

//       const pendingIGSTAmount =
//         igstAmount !== "" && igstAmount !== undefined
//           ? Number(igstAmount) || 0
//           : (pendingIGST * pendingAmount) / 100;

//       rowsToSave.push({
//         Id: null,
//         InvoiceId: null,
//         ProductId: selectedProductID,
//         ProductName:
//           productName || selectedProductName || selectedOption?.label || "",
//         Quantity: pendingQuantity,
//         Rate: pendingRate,
//         Amount: pendingAmount,
//         DiscountAmt: 0,
//         CGSTPercentage: pendingCGST,
//         CGSTAmount: pendingCGSTAmount,
//         SGSTPercentage: pendingSGST,
//         SGSTAmount: pendingSGSTAmount,
//         IGSTPercentage: pendingIGST,
//         IGSTAmount: pendingIGSTAmount,
//       });
//     }

//     // 3. Validate products
//     if (!rowsToSave.length) {
//       toast.error("Please add at least one product.");
//       return;
//     }

//     // 4. Calculate totals
//     const finalSubTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.Amount) || 0),
//       0,
//     );

//     const finalCGSTTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.CGSTAmount) || 0),
//       0,
//     );

//     const finalSGSTTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.SGSTAmount) || 0),
//       0,
//     );

//     const finalIGSTTotal = rowsToSave.reduce(
//       (sum, row) => sum + (parseFloat(row.IGSTAmount) || 0),
//       0,
//     );

//     const finalDiscount = parseFloat(discount) || 0;
//     const finalTransport = parseFloat(transport) || 0;

//     const finalTotal =
//       Math.max(finalSubTotal - finalDiscount, 0) + finalTransport;

//     // 5. Validate before saving
//     if (!validateForm(rowsToSave)) return;
//     if (!validateReceivedAmount(finalTotal)) return;
//     if (!validatePaymentSplit()) return;

//     const receivedValue = receivedAmount === "" ? 0 : Number(receivedAmount);

//     if (!Number.isFinite(receivedValue) || receivedValue < 0) {
//       toast.error("Please enter a valid Received Amount.");
//       return;
//     }

//     // 6. Validate invoice date
//     const formattedInvoicedate = moment(invoiceDate).format("YYYY-MM-DD");

//     if (!moment(formattedInvoicedate, "YYYY-MM-DD", true).isValid()) {
//       toast.error("Please select a valid invoice date.");
//       return;
//     }

//     // 7. Update displayed totals
//     setSubTotalCal(finalSubTotal.toFixed(2));
//     setCgstTotal(finalCGSTTotal.toFixed(2));
//     setSgstTotal(finalSGSTTotal.toFixed(2));
//     setIgstTotal(finalIGSTTotal.toFixed(2));
//     setTotal(finalTotal.toFixed(2));

//     // 8. Lock Save
//     isSavingRef.current = true;
//     setIsSaving(true);

//     try {
//       // 9. Open print window only when printing is requested
//       if (shouldPrint) {
//         printWindow = window.open("", "_blank");

//         if (!printWindow) {
//           toast.error("Please allow popups for printing.");
//           return;
//         }

//         printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>Preparing Invoice...</title>
//           </head>
//           <body style="font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;margin:0">
//             <h3>Preparing invoice for printing...</h3>
//           </body>
//         </html>
//       `);

//         printWindow.document.close();
//       }



//       // Get the logged-in user's identity
// const currentCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const currentUserId =
//   sessionStorage.getItem("UserId") ||
//   sessionStorage.getItem("LoginUserId") ||
//   "";

// if (!currentCreatedBy) {
//   toast.error("CreatedBy is missing. Please login again.");
//   return;
// }

// console.log("Logged-in UserId:", currentUserId);
// console.log("Logged-in CreatedBy:", currentCreatedBy);
// console.log("Logged-in Device:", device);


//       // 10. Prepare invoice header

//       const invoiceheaderdata = {
//         Id: isEditing ? editId : "",
//         InvoiceNo: invoiceNo,
//         InvoiceDate: formattedInvoicedate,

//         // Order Date = Invoice Date
//         OrderDate: formattedInvoicedate,

//         AccountId: selectedAccount ? parseInt(selectedAccount, 10) : 0,

//         ContactNo: phone,
//         Device: device,

//         // Regular Sales Entry
//         BillFor: "R",

//         MachineID: machineID ? parseInt(machineID, 10) : 0,

//         IsGST: isGST ? 1 : 0,
//         PaymentMode: paymentMode || "",
//         CashAmount: parseFloat(cashAmount) || 0,
//         OnlineAmount: parseFloat(onlineAmount) || 0,
//         Discount: finalDiscount,
//         Transport: finalTransport,
//         CGSTAmount: finalCGSTTotal,
//         SGSTAmount: finalSGSTTotal,
//         IGSTAmount: finalIGSTTotal,
//         Total: finalTotal,

//         // Actual amount received
//         ReceivedAmount: receivedValue,

//         SubTotal: finalSubTotal,
//        CreatedBy: !isEditing ? currentCreatedBy : undefined,
// UpdatedBy: isEditing ? currentCreatedBy : undefined,
//       };

//       // 11. Save or update invoice header
//       const invoiceurl = isEditing
//         ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
//         : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

//       const response = await axios.post(
//         invoiceurl,
//         qs.stringify(invoiceheaderdata),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         },
//       );

//       // 12. Resolve invoice ID
//       const invoiceId = isEditing ? editId : parseInt(response?.data?.Id, 10);

//       const savedInvoiceNo = isEditing ? invoiceNo : response?.data?.InvoiceNo;

//       if (!invoiceId) {
//         throw new Error(
//           "Invoice ID was not received from the server. Check the invoice header API response.",
//         );
//       }

//       // 13. Save all invoice details
//       await Promise.all(
//         rowsToSave.map(async (row, index) => {
//           const rowData = {
//             Id: row.Id ? parseInt(row.Id, 10) : "",
//             InvoiceId: parseInt(invoiceId, 10),
//             SerialNo: index + 1,
//             ProductId: parseInt(row.ProductId, 10),
//             Quantity: parseFloat(row.Quantity) || 0,
//             Rate: parseFloat(row.Rate) || 0,
//             Amount: parseFloat(row.Amount) || 0,
//             CGSTPercentage: parseFloat(row.CGSTPercentage) || 0,
//             CGSTAmount: parseFloat(row.CGSTAmount) || 0,
//             SGSTPercentage: parseFloat(row.SGSTPercentage) || 0,
//             SGSTAmount: parseFloat(row.SGSTAmount) || 0,
//             IGSTPercentage: parseFloat(row.IGSTPercentage) || 0,
//             IGSTAmount: parseFloat(row.IGSTAmount) || 0,
//           };

//           const detailUrl = row.Id
//             ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
//             : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

//           const detailResponse = await axios.post(
//             detailUrl,
//             qs.stringify(rowData),
//             {
//               headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//               },
//             },
//           );

//           return detailResponse.data;
//         }),
//       );

//       // 14. Print only after header and all details have saved
//       if (shouldPrint) {
//         const currentAccountDetails = await fetchAccounts(selectedAccount);

//         const customerNameForPrint =
//           accountOptions.find(
//             ({ Id }) => String(Id) === String(selectedAccount),
//           )?.AccountName ||
//           accountName ||
//           "";

//         const printData = {
//           ...invoiceheaderdata,
//           Id: invoiceId,
//           InvoiceNo: savedInvoiceNo,
//           Device: device || "",
//           PaymentMode: paymentMode || "",

//           accountDetails: {
//             ...(currentAccountDetails || {}),
//             AccountName: customerNameForPrint,
//             Address1: customerAddress1 || "",
//             Address2: customerAddress2 || "",
//             Address3: customerAddress3 || "",
//             GSTNo: acctGSTNo || "",
//           },

//           customerName: customerNameForPrint,
//           customerAddress1: customerAddress1 || "",
//           customerAddress2: customerAddress2 || "",
//           customerAddress3: customerAddress3 || "",
//           customerGSTNo: acctGSTNo || "",
//           ReceivedAmount: receivedValue,

//           invdetail: rowsToSave.map((row) => ({
//             ...row,
//             ProductName:
//               row.ProductName ||
//               productOptions.find(
//                 (option) => String(option.value) === String(row.ProductId),
//               )?.label ||
//               "Unknown",
//             Quantity: parseFloat(row.Quantity) || 0,
//             Rate: parseFloat(row.Rate) || 0,
//             Amount: parseFloat(row.Amount) || 0,
//             DiscountAmt: parseFloat(row.DiscountAmt) || 0,
//           })),
//         };

//         generatePDF(printData, printWindow);
//       }

//       // 15. Success
//       toast.success(
//         isEditing
//           ? "Sales Entry Updated successfully!"
//           : "Sales Entry Created successfully!",
//       );

//       // 16. Reset edit mode and form
//       setIsEditing(false);
//       setEditId("");
//       resetForm();

//       // 17. Refresh invoice table only once
//       // Keep this GET so the table displays the saved invoice.
//       // void fetchInvoiceHeader();
//     } catch (error) {
//       console.error("Error submitting invoice:", error);

//       if (printWindow && !printWindow.closed) {
//         printWindow.close();
//       }

//       toast.error(
//         isEditing ? "Sales Entry Update failed!" : "Sales Entry Save failed!",
//       );
//     } finally {
//       // 18. Always unlock Save
//       isSavingRef.current = false;
//       setIsSaving(false);
//     }
//   };

//   // ======================================================
//   // CTRL + S = SAVE + PRINT
//   // ======================================================

//   useEffect(() => {
//     const handleCtrlS = (event) => {
//       // Ctrl + S
//       if (event.ctrlKey && event.key.toLowerCase() === "s") {
//         // Browser Save Page थांबवा
//         event.preventDefault();
//         event.stopPropagation();

       
//         if (!isDrawerOpen) {
//           return;
//         }

//         if (event.repeat) {
//           return;
//         }

//         // console.log("CTRL + S PRESSED");

//         // Save + Print
//         handleSubmit(event);
//       }
//     };

    
//     window.addEventListener("keydown", handleCtrlS, true);

//     return () => {
//       window.removeEventListener("keydown", handleCtrlS, true);
//     };
//   }, [isDrawerOpen]);

//   const handleQuantityChange = (e) => {
//     const qty = e.target.value;
//     setQuantity(qty);
//     calculateAmount(qty, rate);
//   };

//   const handleRateChange = (e) => {
//     const rt = e.target.value;
//     setRate(rt);
//     // console.log("rateee", rate);
//     calculateAmount(quantity, rt);
//   };

//   ///  for discount Amount
//   const [discount, setDiscount] = useState("");

//   // const calculateAmount = (qty, rt) => {
//   //   const qtyNum = parseFloat(qty) || 0;
//   //   const rateNum = parseFloat(rt) || 0;
//   //   const amt = qtyNum * rateNum;
//   //   SetAmount(amt);
//   //   calculateCgstAmount(cgst, amt);
//   //   calculateSgstAmount(sgst, amt);
//   //   calculateIgstAmount(igst, amt);
//   // };

//   const [baseAmount, setBaseAmount] = useState(0);

//   const calculateAmount = (qty, rt) => {
//     const qtyNum = parseFloat(qty) || 0;

//     const rateNum = parseFloat(rt) || 0;

//     const baseAmt = qtyNum * rateNum;

//     setBaseAmount(baseAmt);

//     SetAmount(baseAmt);

//     calculateCgstAmount(cgst, baseAmt);

//     calculateSgstAmount(sgst, baseAmt);

//     calculateIgstAmount(igst, baseAmt);
//   };

//   const calculateSgstAmount = (sgstValue, amt) => {
//     let sgstNum = parseFloat(sgstValue) || 0;
//     let sgstAmt = (sgstNum * amt) / 100;
//     setSGSTAmount(sgstAmt);
//   };

//   const calculateCgstAmount = (cgstValue, amt) => {
//     let cgstNum = parseFloat(cgstValue) || 0;
//     let cgstAmt = (cgstNum * amt) / 100;
//     setCGSTAmount(cgstAmt);
//   };

//   const calculateIgstAmount = (igstValue, amt) => {
//     let igstNum = parseFloat(igstValue) || 0;
//     let igstAmt = (igstNum * amt) / 100;
//     setIGSTAmount(igstAmt);
//   };

//   const handleAddRow = () => {
//     //  console.log("Selected Product ID:", selectedProductID);
//     //  console.log("Selected Product Name:", selectedProductName);

//     let newRow = {
//       // id: rows.length + 1,
//       InvoiceId: null,
//       ProductId: selectedProductID,
//       ProductName: productName,
//       Quantity: quantity,
//       Rate: rate,
//       Amount: amount,
//       CGSTPercentage: cgst,
//       CGSTAmount: cgstAmount,
//       SGSTPercentage: sgst,
//       SGSTAmount: sgstAmount,
//       IGSTPercentage: igst,
//       IGSTAmount: igstAmount,
//       DiscountAmt: discount,
//     };
//     // console.log("newRow", newRow);
//     // Update rows state and ensure the new row is added to the table
//     setRows((prevRows) => [...prevRows, newRow]);
//   };

//   const [subTotalcal, setSubTotalCal] = useState(0);
//   const [cgstTotal, setCgstTotal] = useState(0);
//   const [igstTotal, setIgstTotal] = useState(0);
//   const [sgstTotal, setSgstTotal] = useState(0);
//   const [total, setTotal] = useState(0);

//   const received = parseFloat(receivedAmount) || 0;
//   const grandTotal = parseFloat(total) || 0;

//   const difference = received - grandTotal;

//   const refund = difference > 0 ? difference : 0;

//   const balanceDue = difference < 0 ? Math.abs(difference) : 0;

//   const validateReceivedAmount = (totalToValidate = total) => {
//     const receivedValue =
//       receivedAmount === "" ? NaN : parseFloat(receivedAmount);

//     const totalValue = parseFloat(totalToValidate) || 0;

//     // =====================================================
//     // 1. RECEIVED AMOUNT REQUIRED
//     // =====================================================

//     if (receivedAmount === "" || Number.isNaN(receivedValue)) {
//       toast.error(
//         `Please enter received amount. Total ₹${totalValue.toFixed(2)}`,
//       );

//       receivedAmountRef.current?.focus();
//       receivedAmountRef.current?.select();

//       return false;
//     }

//     // =====================================================
//     // 2. RECEIVED AMOUNT CANNOT BE GREATER THAN TOTAL
//     // =====================================================

//     if (receivedValue > totalValue) {
//       const extraAmount = receivedValue - totalValue;

//       toast.error(
//         `Received amount ₹${receivedValue.toFixed(
//           2,
//         )} cannot be greater than Total ₹${totalValue.toFixed(
//           2,
//         )}. Extra amount ₹${extraAmount.toFixed(2)} is not allowed.`,
//       );

//       receivedAmountRef.current?.focus();
//       receivedAmountRef.current?.select();

//       return false;
//     }

//     // =====================================================
//     // 3. RECEIVED LESS THAN TOTAL = ALLOWED
//     // =====================================================

//     const balanceAmount = totalValue - receivedValue;

//     // console.log("TOTAL:", totalValue);

//     // console.log("RECEIVED:", receivedValue);

//     // console.log("BALANCE DUE:", balanceAmount);

//     return true;
//   };

//   const handleCashAmountChange = (e) => {
//     const value = e.target.value;

//     if (Number(value) < 0) {
//       return;
//     }

//     setCashAmount(value);

//     const cash = Number(value) || 0;
//     const online = Number(onlineAmount) || 0;

//     setReceivedAmount((cash + online).toString());
//   };

//   const handleReceivedAmountChange = (e) => {
//     const value = e.target.value;

//     if (value === "") {
//       setReceivedAmount("");

//       if (paymentMode === "M") {
//         setCashAmount("");
//         setOnlineAmount("");
//       }

//       return;
//     }

  

//     setReceivedAmount(value);

//     if (paymentMode === "M") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }
//   };

//   const handleOnlineAmountChange = (e) => {
//     const value = e.target.value;

//     if (Number(value) < 0) {
//       return;
//     }

//     setOnlineAmount(value);

//     const cash = Number(cashAmount) || 0;
//     const online = Number(value) || 0;

//     setReceivedAmount((cash + online).toString());
//   };

//   const validatePaymentSplit = () => {
//     if (paymentMode !== "M") {
//       return true;
//     }

//     const received = parseFloat(receivedAmount) || 0;
//     const cash = parseFloat(cashAmount) || 0;
//     const online = parseFloat(onlineAmount) || 0;

//     const splitTotal = cash + online;

//     if (Math.abs(splitTotal - received) > 0.001) {
//       toast.error(`Cash + Online amount must be ₹${received.toFixed(2)}`);

//       return false;
//     }

//     return true;
//   };

//   const isPaid = difference === 0 && received > 0;

//   const calculations = () => {
//     // =====================================================
//     // 1. NORMAL SAVED ROWS TOTAL
//     // =====================================================

//     let subtotal = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.Amount) || 0),
//       0,
//     );

//     let totalCGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
//       0,
//     );

//     let totalSGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
//       0,
//     );

//     let totalIGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
//       0,
//     );

//     // =====================================================
//     // 2. LAST PRODUCT - ENTER NOT PRESSED
//     // =====================================================

//     const pendingProductExists =
//       editingRow === null &&
//       selectedProductID &&
//       quantity !== "" &&
//       rate !== "" &&
//       Number(quantity) > 0 &&
//       Number(rate) > 0;

//     if (pendingProductExists) {
//       const pendingQuantity = parseFloat(quantity) || 0;

//       const pendingRate = parseFloat(rate) || 0;

//       const pendingAmount = pendingQuantity * pendingRate;

//       // Add pending product amount to subtotal
//       subtotal += pendingAmount;

//       // GST - only for backend/internal calculation
//       const pendingCGST =
//         parseFloat(cgstAmount) ||
//         ((parseFloat(cgst) || 0) * pendingAmount) / 100;

//       const pendingSGST =
//         parseFloat(sgstAmount) ||
//         ((parseFloat(sgst) || 0) * pendingAmount) / 100;

//       const pendingIGST =
//         parseFloat(igstAmount) ||
//         ((parseFloat(igst) || 0) * pendingAmount) / 100;

//       totalCGST += pendingCGST;
//       totalSGST += pendingSGST;
//       totalIGST += pendingIGST;

//       // console.log("PENDING LAST PRODUCT:", {
//       //   ProductId: selectedProductID,
//       //   Quantity: pendingQuantity,
//       //   Rate: pendingRate,
//       //   Amount: pendingAmount,
//       // });
//     }

//     // =====================================================
//     // 3. UPDATE SUBTOTAL
//     // =====================================================

//     setSubTotalCal(subtotal.toFixed(2));

//     // =====================================================
//     // 4. UPDATE GST TOTALS
//     // =====================================================

//     setCgstTotal(totalCGST.toFixed(2));

//     setSgstTotal(totalSGST.toFixed(2));

//     setIgstTotal(totalIGST.toFixed(2));

//     // =====================================================
//     // 5. DISCOUNT
//     // =====================================================

//     const discountValue = parseFloat(discount) || 0;

//     // =====================================================
//     // 6. TRANSPORT
//     // =====================================================

//     const transportValue = parseFloat(transport) || 0;

//     // =====================================================
//     // 7. FINAL TOTAL
//     // =====================================================

//     const totalBeforeDiscount = subtotal;

//     const afterDiscount = Math.max(totalBeforeDiscount - discountValue, 0);

//     const grandTotal = afterDiscount + transportValue;

//     // =====================================================
//     // 8. UPDATE TOTAL
//     // =====================================================

//     setTotal(grandTotal.toFixed(2));

//     // console.log("DISPLAY TOTAL INCLUDING PENDING PRODUCT:", grandTotal);
//   };

//   useEffect(() => {
//     calculations();
//   }, [
//     rows,
//     transport,
//     discount,
//     selectedProductID,
//     quantity,
//     rate,
//     editingRow,
//     cgst,
//     cgstAmount,
//     sgst,
//     sgstAmount,
//     igst,
//     igstAmount,
//   ]);

//   //
//   const [anchorEl1, setAnchorEl1] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);

//   const handleMenutableOpen = (event, index) => {
//     setAnchorEl1(event.currentTarget);
//     setSelectedRow(index);
//   };

//   const handletableMenuClose = () => {
//     setAnchorEl1(null);
//     setSelectedRow(null);
//   };

//   const handleEditRow = (index) => {
//     const row = rows[index];

//     if (!row) {
//       toast.error("Product row not found.");
//       return;
//     }

//     // console.log("========== EDIT PRODUCT ROW ==========");
//     // console.log("EDIT ROW INDEX:", index);
//     // console.log("EDIT ROW DATA:", row);

//     // Set row in edit mode
//     setEditingRow(index);

//     // Product
//     setSelectedProductId(row.ProductId);
//     setProductName(row.ProductName || "");

//     // Quantity
//     const q =
//       row.Quantity !== null && row.Quantity !== undefined
//         ? String(row.Quantity)
//         : "";

//     setQuantity(q);

//     // Rate
//     const r =
//       row.Rate !== null && row.Rate !== undefined ? String(row.Rate) : "";

//     setRate(r);

//     // Calculate amount
//     const qtyNum = parseFloat(q) || 0;
//     const rateNum = parseFloat(r) || 0;

//     const baseAmt = qtyNum * rateNum;

//     setBaseAmount(baseAmt);
//     SetAmount(baseAmt);

//     // GST values
//     setCGST(row.CGSTPercentage || 0);
//     setSGST(row.SGSTPercentage || 0);
//     setIGST(row.IGSTPercentage || 0);

//     calculateCgstAmount(row.CGSTPercentage || 0, baseAmt);

//     calculateSgstAmount(row.SGSTPercentage || 0, baseAmt);

//     calculateIgstAmount(row.IGSTPercentage || 0, baseAmt);

//     // console.log("EDIT PRODUCT VALUES:", {
//     //   ProductId: row.ProductId,
//     //   ProductName: row.ProductName,
//     //   Quantity: q,
//     //   Rate: r,
//     //   Amount: baseAmt,
//     // });

//     // console.log("======================================");
//   };

//   const handleDeleteRow = (index) => {
//     const updatedRows = [...rows];
//     updatedRows.splice(index, 1);
//     setRows(updatedRows);
//   };

//   const addProductRow = (productData = null) => {
//     const productId = productData?.value || selectedProductID;

//     if (!productId) {
//       return;
//     }

//     const productLabel = productData?.label || productName || "";

//     const qty = parseFloat(productData?.quantity ?? quantity) || 1;

//     const rt = parseFloat(productData?.rate ?? rate) || 0;

//     const cgstValue = parseFloat(productData?.cgst ?? cgst) || 0;

//     const sgstValue = parseFloat(productData?.sgst ?? sgst) || 0;

//     const igstValue = parseFloat(productData?.igst ?? igst) || 0;

//     // Product Amount
//     const baseAmt = qty * rt;

//     // GST amounts
//     const cgstValueAmount = (cgstValue * baseAmt) / 100;

//     const sgstValueAmount = (sgstValue * baseAmt) / 100;

//     const igstValueAmount = (igstValue * baseAmt) / 100;

//     const newRow = {
//       Id: null,
//       InvoiceId: null,

//       ProductId: productId,
//       ProductName: productLabel,

//       Quantity: qty,
//       Rate: rt,

    
//       Amount: baseAmt,

//       DiscountAmt: 0,

//       CGSTPercentage: cgstValue,
//       CGSTAmount: cgstValueAmount,

//       SGSTPercentage: sgstValue,
//       SGSTAmount: sgstValueAmount,

//       IGSTPercentage: igstValue,
//       IGSTAmount: igstValueAmount,
//     };

//     setRows((prevRows) => [...prevRows, newRow]);

//     // Clear only product-entry fields
//     setSelectedProductId("");
//     setSelectedProductName("");
//     setProductName("");

//     setQuantity("");
//     setRate("");
//     SetAmount("");

//     setCGST("");
//     setCGSTAmount("");

//     setSGST("");
//     setSGSTAmount("");

//     setIGST("");
//     setIGSTAmount("");
//   };

//   // ============================================================
//   // ENTER = SELECT HIGHLIGHTED PRODUCT
//   // ============================================================

//   const handleProductSelectKeyDown = (event) => {
//     // ----------------------------------------------------------
//     // Only handle ENTER
//     // ----------------------------------------------------------

//     if (event.key !== "Enter") {
//       return;
//     }

//     event.preventDefault();
//     event.stopPropagation();

//     // ----------------------------------------------------------
//     // Find highlighted product
//     // MUI uses .Mui-focused for the currently highlighted option
//     // ----------------------------------------------------------

//     const highlightedOption =
//       document.querySelector(".MuiAutocomplete-option.Mui-focused") ||
//       document.querySelector('.MuiAutocomplete-option[aria-selected="true"]');

//     // ----------------------------------------------------------
//     // Product found → select it
//     // ----------------------------------------------------------

//     if (highlightedOption) {
//       highlightedOption.click();

//       // --------------------------------------------------------
//       // After product selection → Quantity field
//       // --------------------------------------------------------

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }

//     // ----------------------------------------------------------
//     // No product highlighted
//     // ----------------------------------------------------------

//     toast.error("Please select a product.");
//   };

//   const handleSaveOrAddRow = () => {
//     // =====================================================
//     // 1. PRODUCT VALIDATION
//     // =====================================================
//     if (!selectedProductID) {
//       toast.error("Please select a product.");

//       setTimeout(() => {
//         productRef.current?.focus();
//       }, 100);

//       return;
//     }

//     // =====================================================
//     // 2. QUANTITY VALIDATION
//     // =====================================================
//     const finalQuantity = parseFloat(quantity);

//     if (Number.isNaN(finalQuantity) || finalQuantity <= 0) {
//       toast.error("Please enter quantity.");

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }

//     // =====================================================
//     // 3. RATE VALIDATION
//     // =====================================================
//     const finalRate = parseFloat(rate);

//     if (Number.isNaN(finalRate) || finalRate <= 0) {
//       toast.error("Please enter rate.");

//       setTimeout(() => {
//         rateRef.current?.focus();
//         rateRef.current?.select();
//       }, 100);

//       return;
//     }

//     // =====================================================
//     // 4. CALCULATE AMOUNT
//     // =====================================================
//     const finalAmount = finalQuantity * finalRate;

//     // =====================================================
//     // 5. FIND SELECTED PRODUCT
//     // =====================================================
//     const selectedOption = productOptions.find(
//       (option) => String(option.value) === String(selectedProductID),
//     );

//     // =====================================================
//     // 6. PRODUCT NAME
//     // =====================================================
//     const finalProductName =
//       productName || selectedOption?.label || selectedProductName || "";

//     // =====================================================
//     // 7. EDIT EXISTING ROW
//     // =====================================================
//     if (editingRow !== null) {
//       const updatedRows = [...rows];

//       updatedRows[editingRow] = {
//         ...updatedRows[editingRow],

//         ProductId: selectedProductID,

//         ProductName: finalProductName,

//         Quantity: finalQuantity,

//         Rate: finalRate,

//         Amount: finalAmount,
//       };

//       // console.log("UPDATED PRODUCT ROW:", updatedRows[editingRow]);

//       // Update rows
//       setRows(updatedRows);

//       // Editing completed
//       setEditingRow(null);
//     } else {
//       // ===================================================
//       // 8. ADD NEW PRODUCT ROW
//       // ===================================================

//       const newRow = {
//         InvoiceId: null,

//         ProductId: selectedProductID,

//         ProductName: finalProductName,

//         Quantity: finalQuantity,

//         Rate: finalRate,

//         Amount: finalAmount,
//       };

//       // console.log("NEW PRODUCT ROW:", newRow);

//       // Add new row
//       setRows((prevRows) => [...prevRows, newRow]);
//     }

//     // =====================================================
//     // 9. CLEAR CURRENT INPUTS
//     // =====================================================
//     resetFields();

//     // =====================================================
//     // 10. FOCUS NEXT PRODUCT
//     // =====================================================
//     setTimeout(() => {
//       productRef.current?.focus();

//       setProductDropdownOpen(true);
//     }, 150);
//   };

//   const resetFields = () => {
//     setSelectedProductId("");
//     setProductName("");
//     setSelectedProductName("");
//     setQuantity("");
//     setRate("");
//     SetAmount("");
//     setCGST("");
//     setCGSTAmount("");
//     setSGST("");
//     setSGSTAmount("");
//     setIGST("");
//     setIGSTAmount("");
//   };

//   //get company master
//   const [gstNo, setGstNO] = useState("");

//   const fetchCompanyMaster = async () => {
//     try {
//       const response = await axios.get(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=companymaster",
//         { maxBodyLength: Infinity },
//       );
//       console.log(response.data);
//       console.log(" Company GST NO:", response.data[0].GSTNo);
//       setGstNO(response.data[0].GSTNo);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyMaster();
//   }, []);

//   //for serchApi
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [text, setText] = useState("");

//   const serchCustomers = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     try {
//       // =====================================================
//       // DO NOT SEARCH EMPTY TEXT
//       // =====================================================

//       if (!text || !text.trim()) {
//         setAccountOptions([]);
//         return;
//       }

//       // =====================================================
//       // GET CUSTOMER ACCOUNTS
//       // TypeCode=C means Customer Account
//       // =====================================================

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${encodeURIComponent(
//           text.trim(),
//         )}`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Customer Search API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const customers = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : [];

//       // =====================================================
//       // CHECK ADDRESS CUSTOMER TYPE
//       // ONLY R = REGULAR / RETAILER
//       // =====================================================

//       const regularCustomers = (
//         await Promise.all(
//           customers.map(async (customer) => {
//             const accountId =
//               customer?.Id || customer?.AccountId || customer?.AccountID;

//             if (!accountId) {
//               return null;
//             }

//             try {
//               const addressResponse = await fetch(
//                 `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`,
//                 requestOptions,
//               );

//               if (!addressResponse.ok) {
//                 return null;
//               }

//               const addressResult = await addressResponse.json();

//               const addressData = Array.isArray(addressResult)
//                 ? addressResult[0] || null
//                 : Array.isArray(addressResult?.data)
//                   ? addressResult.data[0] || null
//                   : addressResult?.data || addressResult || null;

//               const customerType = String(
//                 addressData?.CustomerType ||
//                   addressData?.customerType ||
//                   customer?.CustomerType ||
//                   customer?.customerType ||
//                   "",
//               )
//                 .trim()
//                 .toUpperCase();

//               if (customerType !== PAGE_CUSTOMER_TYPE) {
//                 return null;
//               }

//               return {
//                 ...customer,
//                 CustomerType: customerType,
//                 addressDetails: addressData,
//               };
//             } catch (error) {
//               console.error(
//                 `Address fetch failed for AccountId ${accountId}:`,
//                 error,
//               );

//               return null;
//             }
//           }),
//         )
//       ).filter(Boolean);

//       // console.log("REGULAR CUSTOMER SEARCH RESULT:", regularCustomers);

//       setAccountOptions(regularCustomers);
//     } catch (error) {
//       console.error("Regular customer search error:", error);
//       setAccountOptions([]);
//     }
//   };

//   useEffect(() => {
//     serchCustomers();
//   }, [text]);

//   // create new Customer
//   const [accountName, setAccountName] = useState("");
//   const [customerName, setCustomerName] = useState("");

//   const Namevalidation = () => {
//     let temp = accountName.split(" ");
//     let surname = temp[1];
//     if (surname && surname.length >= 1) {
//       return true;
//     } else {
//       toast.error("Need to Insert First and last Name ");
//       return false;
//     }
//   };

//   const [customerGSTNo, setCustomerGSTNo] = useState("");

//   const CreateCustomerMaster = async () => {
//     // ============================================================
//     // 1. CUSTOMER NAME VALIDATION
//     // ============================================================

//     if (!Namevalidation()) {
//       return;
//     }

//     // ============================================================
//     // 2. HEADERS
//     // ============================================================

//     const myHeaders = new Headers();

//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     try {
//       // ============================================================
//       // 3. CREATE CUSTOMER ACCOUNT
//       // ============================================================

//       const urlencoded = new URLSearchParams();

//       urlencoded.append("AccountName", accountName.trim());

//       urlencoded.append("GroupId", "3");

//       urlencoded.append("SubGroupId", "1");

//       // KEEP YOUR EXISTING REQUIREMENT
//       urlencoded.append("OpeningBalance", "100");

//       urlencoded.append("DrORCr", "D");

//       urlencoded.append("TypeCode", "C");

//       urlencoded.append("IsSystem", "false");

//       // console.log(
//       //   "CREATE CUSTOMER ACCOUNT DATA:",
//       //   Object.fromEntries(urlencoded),
//       // );

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: urlencoded,
//           redirect: "follow",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Account API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       // console.log("CUSTOMER CREATED:", result);

//       // ============================================================
//       // 4. CHECK CUSTOMER ID
//       // ============================================================

//       if (!result || !result.Id) {
//         throw new Error("Customer ID not received from API.");
//       }

//       const newCustomerId = result.Id;

//       // ============================================================
//       // 5. CREATE CUSTOMER ADDRESS / CONTACT DETAILS
//       // ============================================================

//       const addressData = new URLSearchParams();

//       // CUSTOMER ID
//       addressData.append("AccountId", newCustomerId);

//       // REGULAR CUSTOMER
//       addressData.append("CustomerType", "R");

//       // EXISTING GST LOGIC
//       addressData.append("GSTNo", "270000000000000");

//       // ============================================================
//       // ADDRESS - OPTIONAL
//       // ============================================================

//       addressData.append("Address1", newCustomerAddress.trim());

//       addressData.append("Address", newCustomerAddress.trim());

//       // ============================================================
//       // MOBILE NUMBER - OPTIONAL
//       // ============================================================

//       addressData.append("MobileNo", newCustomerMobile.trim());

//       // ============================================================
//       // TELEPHONE / LAND PHONE - OPTIONAL
//       // ============================================================

//       // console.log("CUSTOMER ADDRESS DATA:", Object.fromEntries(addressData));

//       // ============================================================
//       // 6. SAVE ADDRESS / MOBILE / TELEPHONE
//       // ============================================================

//       const addressResponse = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: addressData,
//           redirect: "follow",
//         },
//       );

//       if (!addressResponse.ok) {
//         throw new Error(`Address API failed: ${addressResponse.status}`);
//       }

//       // Some APIs may return empty response,
//       // so don't blindly call response.json()
//       const addressResponseText = await addressResponse.text();

//       let addressResult = null;

//       try {
//         addressResult = addressResponseText
//           ? JSON.parse(addressResponseText)
//           : null;
//       } catch (jsonError) {
//         console.warn("Address API response is not JSON:", addressResponseText);
//       }

//       // console.log("ADDRESS / CONTACT SAVED:", addressResult);

//       // ============================================================
//       // 7. ADD NEW CUSTOMER TO LOCAL DROPDOWN
//       // ============================================================

//       const newCustomer = {
//         Id: newCustomerId,

//         AccountName: accountName.trim(),

//         CustomerType: "R",

//         Address1: newCustomerAddress.trim(),

//         Address: newCustomerAddress.trim(),

//         MobileNo: newCustomerMobile.trim(),
//       };

//       setAccountOptions((previousOptions) => {
//         const alreadyExists = previousOptions.some(
//           (customer) => String(customer.Id) === String(newCustomerId),
//         );

//         if (alreadyExists) {
//           return previousOptions;
//         }

//         return [newCustomer, ...previousOptions];
//       });

//       // ============================================================
//       // 8. SELECT NEW CUSTOMER AUTOMATICALLY
//       // ============================================================

//       setSelectedAccount(String(newCustomerId));

//       setSelectedCustomerName(accountName.trim());

//       setSelectedCustomerAddress(newCustomerAddress.trim());

//       // If mobile is entered,
//       // show it in Sales Entry Contact Number
//       if (newCustomerMobile.trim()) {
//         setPhone(newCustomerMobile.trim());
//       }

//       // ============================================================
//       // 9. CLOSE CUSTOMER POPUP
//       // ============================================================

//       setShowDropdown(false);

//       // ============================================================
//       // 10. CLEAR CREATE CUSTOMER FIELDS
//       // ============================================================

//       setAccountName("");

//       setNewCustomerAddress("");

//       setNewCustomerMobile("");

//       setText("");

//       // ============================================================
//       // 11. SUCCESS MESSAGE
//       // ============================================================

//       toast.success("Customer created successfully");
//     } catch (error) {
//       console.error("Error creating customer:", error);

//       toast.error(error.message || "Unable to create customer");
//     }
//   };

//   //set GSTno

//   const fetchAccounts = async (customerId) => {
//     if (!customerId) {
//       setacctGSTNo("");
//       setCustomerAddress1("");
//       setCustomerAddress2("");
//       setCustomerAddress3("");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       const result = await response.json();

//       const temp = Array.isArray(result) ? result[0] : null;

//       // console.log("Customer Address API Response:", temp);

//       setacctGSTNo(String(temp?.GSTNo ?? ""));
//       setCustomerAddress1(temp?.Address1 ?? "");
//       setCustomerAddress2(temp?.Address2 ?? "");
//       setCustomerAddress3(temp?.Address3 ?? "");
//     } catch (error) {
//       console.error("Customer details fetch error:", error);

//       setacctGSTNo("");
//       setCustomerAddress1("");
//       setCustomerAddress2("");
//       setCustomerAddress3("");
//     }
//   };

//   const fetchAccountName = (acctname) => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${acctname}`,
//       requestOptions,
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         //console.log('accountname', result)

//         setAccountOptions(Array.isArray(result) ? result : []);
//       })
//       .catch((error) => console.error(error));
//   };

//   //

//   const handleItemChange = (newValue) => {
//     if (newValue) {
//       setSelectedProductId(newValue.value);
//       setProductName(newValue.label);
//       setSelectedProductName(newValue.label);

//       // Default Quantity
//       const defaultQty = 1;

//       // Regular Rate automatically comes from ProductMaster API
//       const defaultRate = parseFloat(newValue.purchaseRate) || 0;

//       setRate(defaultRate);

//       setQuantity(defaultQty);
//       setRate(defaultRate);

//       // GST calculation
//       const sameState = gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2);

//       const cgstValue = sameState ? newValue.cgst : "0";
//       const sgstValue = sameState ? newValue.sgst : "0";
//       const igstValue = !sameState ? newValue.igst : "0";

//       setCGST(cgstValue);
//       setSGST(sgstValue);
//       setIGST(igstValue);

//       // Calculate amount using default quantity and Regular rate
//       calculateAmount(defaultQty, defaultRate);
//     } else {
//       setSelectedProductId("");
//       setProductName("");
//       setSelectedProductName("");

//       setQuantity("");
//       setRate("");

//       setCGST("0");
//       setSGST("0");
//       setIGST("0");

//       SetAmount("");
//     }
//   };

//   ///Pagination
//   const [totalPages, setTotalPages] = useState(1);
//   //validation
//   const [errors, setErrors] = useState({
//     invoiceDate: "",
//     selectedAccount: "",
//     paymentMode: "",
//     rows: "",
//   });

//   const validateForm = (rowsToValidate = rows) => {
//     const newErrors = {
//       invoiceDate: "",
//       selectedAccount: "",
//       paymentMode: "",
//       rows: "",
//     };

//     let isValid = true;

//     // ==========================================
//     // INVOICE DATE
//     // ==========================================
//     if (!invoiceDate) {
//       newErrors.invoiceDate = "Invoice date is required";
//       isValid = false;
//     } else {
//       const invoiceDateObj = new Date(invoiceDate);

//       // Remove time from invoice date
//       invoiceDateObj.setHours(0, 0, 0, 0);

//       // Financial year dates
//       const financialFromDate = Cookies.get("FromDate");
//       const financialToDate = Cookies.get("ToDate");

//       if (financialFromDate && financialToDate) {
//         const fromDateObj = new Date(financialFromDate);
//         const toDateObj = new Date(financialToDate);

//         // Remove time from financial year dates
//         fromDateObj.setHours(0, 0, 0, 0);
//         toDateObj.setHours(0, 0, 0, 0);

//         if (invoiceDateObj < fromDateObj) {
//           newErrors.invoiceDate = `Invoice date cannot be before ${fromDateObj.toLocaleDateString()}`;
//           isValid = false;
//         } else if (invoiceDateObj > toDateObj) {
//           newErrors.invoiceDate = `Invoice date cannot be after ${toDateObj.toLocaleDateString()}`;
//           isValid = false;
//         }
//       }
//     }

//     // ==========================================
//     // PAYMENT MODE
//     // ==========================================
//     if (!paymentMode) {
//       newErrors.paymentMode = "Payment mode is required";
//       isValid = false;
//     }

//     // ==========================================
//     // PRODUCT ROWS
//     // ==========================================
//     if (rowsToValidate.length === 0) {
//       newErrors.rows = "Please add at least one product";
//       isValid = false;
//     }

//     setErrors(newErrors);

//     return isValid;
//   };

//   //for yearId
//   const [yearid, setYearId] = useState("");

//   useEffect(() => {
//     const storedYearId = Cookies.get("YearId");
//     const storedfromdate = Cookies.get("FromDate");
//     const storedtodate = Cookies.get("ToDate");

//     if (storedYearId) {
//       setYearId(storedYearId);
//     } else {
//       toast.error("Year is not set.");
//     }

//     if (storedfromdate) {
//       setFinancialYearFromDate(storedfromdate);
//     } else {
//       toast.error("FromDate is not set.");
//     }

//     if (storedtodate) {
//       setFinancialYearToDate(storedtodate);
//     } else {
//       toast.error("ToDate is not set.");
//     }
//   }, []);

//   useEffect(() => {
//     const storedUserId = sessionStorage.getItem("UserId");

//     if (storedUserId) {
//       setUserId(storedUserId);
//     } else {
//       toast.error("User is not logged in.");
//     }
//   }, []);

//   //for print
//   // ============================================================
//   // SALES ENTRY - 80MM THERMAL ROLL PRINT
//   // ============================================================

//   const generatePDF = async (printData = previewData, printWindow = null) => {
//     // ============================================================
//     // 1. CHECK INVOICE DATA
//     // ============================================================

//     if (!printData) {
//       toast.error("No invoice data available for printing.");

//       if (printWindow && !printWindow.closed) {
//         printWindow.close();
//       }

//       return;
//     }

//     // console.log("========================================");
//     // console.log("INVOICE PRINT START");
//     // console.log("PRINT DATA:", printData);
//     // console.log("SELECTED ACCOUNT:", selectedAccount);
//     // console.log("========================================");

//     // ============================================================
//     // 2. GET ACCOUNT ID
//     // ============================================================

//     let accountId = "";

//     accountId =
//       printData?.AccountId ||
//       printData?.AccountID ||
//       printData?.CustomerId ||
//       printData?.CustomerID ||
//       printData?.CustomerAccountId ||
//       printData?.CustomerAccountID ||
//       printData?.accountDetails?.Id ||
//       printData?.accountDetails?.AccountId ||
//       "";

//     // ============================================================
//     // 3. GET ACCOUNT ID FROM selectedAccount
//     // ============================================================

//     if (!accountId && selectedAccount) {
//       if (typeof selectedAccount === "object") {
//         accountId =
//           selectedAccount?.Id ||
//           selectedAccount?.ID ||
//           selectedAccount?.AccountId ||
//           selectedAccount?.AccountID ||
//           selectedAccount?.CustomerId ||
//           selectedAccount?.CustomerID ||
//           selectedAccount?.value ||
//           selectedAccount?.id ||
//           "";
//       } else {
//         accountId = selectedAccount;
//       }
//     }

//     // ============================================================
//     // 4. CUSTOMER VARIABLES
//     // ============================================================

//     let customerName = "";
//     let customerAddress1 = "";
//     let customerAddress2 = "";
//     let customerAddress3 = "";
//     let customerMobileNo = "";

//     // ============================================================
//     // 5. FETCH CUSTOMER NAME + CONTACT + ADDRESS
//     // ============================================================

//     if (accountId) {
//       try {
//         // ----------------------------------------------------------
//         // 5A. ACCOUNT API
//         // ----------------------------------------------------------

//         const accountResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//             accountId,
//           )}`,
//         );

//         if (!accountResponse.ok) {
//           throw new Error(
//             `Account API failed with status ${accountResponse.status}`,
//           );
//         }

//         const accountResult = await accountResponse.json();

//         const accountData = Array.isArray(accountResult)
//           ? accountResult[0] || null
//           : Array.isArray(accountResult?.data)
//             ? accountResult.data[0] || null
//             : accountResult?.data || accountResult || null;

//         console.log("PRINT ACCOUNT DATA:", accountData);

//         // ----------------------------------------------------------
//         // CUSTOMER NAME
//         // ----------------------------------------------------------

//         customerName =
//           accountData?.AccountName || accountData?.accountName || "";

//         // ----------------------------------------------------------
//         // CUSTOMER CONTACT
//         // ----------------------------------------------------------

//         customerMobileNo =
//           accountData?.MobileNo ||
//           accountData?.MobileNumber ||
//           accountData?.ContactNo ||
//           accountData?.ContactNumber ||
//           accountData?.PhoneNo ||
//           accountData?.PhoneNumber ||
//           "";

//         // ----------------------------------------------------------
//         // 5B. ADDRESS API
//         // ----------------------------------------------------------

//         const addressResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
//             accountId,
//           )}`,
//         );

//         if (!addressResponse.ok) {
//           throw new Error(
//             `Address API failed with status ${addressResponse.status}`,
//           );
//         }

//         const addressResult = await addressResponse.json();

//         const addressData = Array.isArray(addressResult)
//           ? addressResult[0] || null
//           : Array.isArray(addressResult?.data)
//             ? addressResult.data[0] || null
//             : addressResult?.data || addressResult || null;

//         // console.log("PRINT ADDRESS DATA:", addressData);

//         if (addressData) {
//           customerAddress1 =
//             addressData?.Address1 || addressData?.address1 || "";

//           customerAddress2 =
//             addressData?.Address2 || addressData?.address2 || "";

//           customerAddress3 =
//             addressData?.Address3 || addressData?.address3 || "";
//         }
//       } catch (error) {
//         console.error("PRINT CUSTOMER DETAILS ERROR:", error);
//       }
//     }

//     // ============================================================
//     // 6. FALLBACK CUSTOMER NAME
//     // ============================================================

//     if (!customerName) {
//       customerName =
//         printData?.accountDetails?.AccountName || printData?.customerName || "";
//     }

//     // ============================================================
//     // 7. FALLBACK ADDRESS 1
//     // ============================================================

//     if (!customerAddress1) {
//       customerAddress1 =
//         printData?.accountDetails?.Address1 || printData?.Address1 || "";
//     }

//     // ============================================================
//     // 8. FALLBACK ADDRESS 2
//     // ============================================================

//     if (!customerAddress2) {
//       customerAddress2 =
//         printData?.accountDetails?.Address2 || printData?.Address2 || "";
//     }

//     // ============================================================
//     // 9. FALLBACK ADDRESS 3
//     // ============================================================

//     if (!customerAddress3) {
//       customerAddress3 =
//         printData?.accountDetails?.Address3 || printData?.Address3 || "";
//     }

//     // ============================================================
//     // 10. CONTACT NUMBER
//     // ============================================================

//     const contactNo =
//       customerMobileNo ||
//       printData?.ContactNo ||
//       printData?.ContactNumber ||
//       printData?.MobileNo ||
//       printData?.MobileNumber ||
//       printData?.PhoneNo ||
//       "";

//     // ============================================================
//     // 11. DEBUG
//     // ============================================================

//     // console.log("========================================");
//     // console.log("FINAL CUSTOMER INFORMATION");
//     // console.log("ACCOUNT ID:", accountId);
//     // console.log("CUSTOMER NAME:", customerName);
//     // console.log("ADDRESS 1:", customerAddress1);
//     // console.log("ADDRESS 2:", customerAddress2);
//     // console.log("ADDRESS 3:", customerAddress3);
//     // console.log("MOBILE:", contactNo);
//     // console.log("========================================");

//     // ============================================================
//     // 12. CREATE 80MM ROLL PDF
//     // ============================================================

//     const ROLL_WIDTH = 80;
//     const ROLL_HEIGHT = 300;

//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: [ROLL_WIDTH, ROLL_HEIGHT],
//     });

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     // ============================================================
//     // 13. INVOICE NUMBER
//     // ============================================================

//     const invoiceNo =
//       printData?.InvoiceNo ||
//       printData?.InvoiceNumber ||
//       printData?.BillNo ||
//       printData?.BillNumber ||
//       printData?.invoiceNo ||
//       "";

//     // ============================================================
//     // 14. DATE
//     // ============================================================

//     let invoiceDateText = "-";

//     try {
//       if (printData?.InvoiceDate?.date) {
//         invoiceDateText = moment(printData.InvoiceDate.date).format(
//           "DD-MM-YYYY",
//         );
//       } else if (printData?.InvoiceDate) {
//         invoiceDateText = moment(printData.InvoiceDate).format("DD-MM-YYYY");
//       }
//     } catch (error) {
//       console.error("Invoice date formatting error:", error);

//       invoiceDateText = "-";
//     }

//     // ============================================================
//     // 15. TIME
//     // ============================================================

//     const invoiceTime = moment().format("hh:mm A");

//     // ============================================================
//     // 16. COMPANY DETAILS
//     // ============================================================

//     const companyName = "AMRUT MILK PRODUCTS 2";

//     const companyAddress1 = "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER";

//     const companyAddress2 = "KOLHAPUR.";

//     const companyPhone = "8830261523";

//     const companyState = "27-Maharashtra";

//     // ============================================================
//     // 17. IMAGE TO DATA URL
//     // ============================================================

//     const imageToDataURL = (imageSource) => {
//       return new Promise((resolve, reject) => {
//         if (!imageSource) {
//           reject(new Error("Image source is empty."));
//           return;
//         }

//         if (
//           typeof imageSource === "string" &&
//           imageSource.startsWith("data:image")
//         ) {
//           resolve(imageSource);
//           return;
//         }

//         const img = new Image();

//         img.onload = () => {
//           try {
//             const canvas = document.createElement("canvas");

//             canvas.width = img.naturalWidth || img.width;

//             canvas.height = img.naturalHeight || img.height;

//             const ctx = canvas.getContext("2d");

//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//             resolve(canvas.toDataURL("image/png"));
//           } catch (error) {
//             reject(error);
//           }
//         };

//         img.onerror = () => {
//           reject(new Error(`Unable to load image: ${imageSource}`));
//         };

//         img.src = imageSource;
//       });
//     };

//     // ============================================================
//     // 18. LOAD LOGOS
//     // ============================================================

//     let amrutLogoData = null;
//     let fremilaLogoData = null;

//     try {
//       amrutLogoData = await imageToDataURL(amrutLogo);
//     } catch (error) {
//       console.error("Amrut Siddhi logo error:", error);
//     }

//     try {
//       fremilaLogoData = await imageToDataURL(fremilaLogo);
//     } catch (error) {
//       console.error("Fremila logo error:", error);
//     }

//     // ============================================================
//     // 19. MARGINS
//     // ============================================================

//     const leftMargin = 4;
//     const rightMargin = 4;

//     const contentWidth = pageWidth - leftMargin - rightMargin;

//     // ============================================================
//     // 20. OUTER BORDER
//     // ============================================================

//     doc.setLineWidth(0.4);

//     doc.rect(leftMargin, 4, contentWidth, pageHeight - 8);

//     // ============================================================
//     // 21. HEADER
//     // ============================================================

//     let y = 11;

//     // ============================================================
//     // AMRUT LOGO
//     // ============================================================

//     if (amrutLogoData) {
//       try {
//         doc.addImage(amrutLogoData, "PNG", pageWidth - 25, 7, 18, 12);
//       } catch (error) {
//         console.error("Amrut Siddhi PDF logo error:", error);
//       }
//     }

//     // ============================================================
//     // FREMILA LOGO
//     // ============================================================

//     if (fremilaLogoData) {
//       try {
//         doc.addImage(fremilaLogoData, "PNG", pageWidth - 25, 20, 18, 12);
//       } catch (error) {
//         console.error("Fremila PDF logo error:", error);
//       }
//     }

//     // ============================================================
//     // COMPANY NAME
//     // ============================================================

//     doc.setFont("helvetica", "bold");

//     doc.setFontSize(9);

//     doc.text(companyName, leftMargin + 2, y);

//     y += 4;

//     // ============================================================
//     // COMPANY ADDRESS
//     // ============================================================

//     doc.setFont("helvetica", "normal");

//     doc.setFontSize(5.5);

//     const companyAddressLines = doc.splitTextToSize(companyAddress1, 52);

//     doc.text(companyAddressLines, leftMargin + 2, y);

//     y += companyAddressLines.length * 3.2;

//     doc.text(companyAddress2, leftMargin + 2, y);

//     y += 3.2;

//     // ============================================================
//     // COMPANY PHONE
//     // ============================================================

//     doc.text(`Phone no.: ${companyPhone}`, leftMargin + 2, y);

//     y += 3.2;

//     // ============================================================
//     // COMPANY STATE
//     // ============================================================

//     doc.text(`State: ${companyState}`, leftMargin + 2, y);

//     // ============================================================
//     // TAX INVOICE
//     // ============================================================

//     y += 6;

//     doc.setFont("helvetica", "bold");

//     doc.setFontSize(9);

//     doc.text("Tax Invoice", pageWidth / 2, y, {
//       align: "center",
//     });

//     y += 5;

//     // ============================================================
//     // HEADER LINE
//     // ============================================================

//     doc.setLineWidth(0.3);

//     doc.line(leftMargin + 2, y, pageWidth - rightMargin - 2, y);

//     y += 5;

//     // ============================================================
//     // BILL TO + INVOICE DETAILS
//     // ============================================================

//     const leftX = 7;
//     const rightX = 43;

//     const sectionStartY = y;

//     // ------------------------------------------------------------
//     // LEFT : BILL TO
//     // ------------------------------------------------------------

//     let customerY = sectionStartY;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(7);

//     doc.text("Bill To", leftX, customerY);

//     customerY += 5;

//     // Customer Name
//     if (customerName) {
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(6.2);

//       const nameLines = doc.splitTextToSize(String(customerName), 32);

//       doc.text(nameLines, leftX, customerY);

//       customerY += nameLines.length * 3.2;
//     }

//     // Address 1
//     if (customerAddress1) {
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(5.8);

//       const address1Lines = doc.splitTextToSize(String(customerAddress1), 32);

//       doc.text(address1Lines, leftX, customerY);

//       customerY += address1Lines.length * 3;
//     }

//     // Address 2
//     if (customerAddress2) {
//       const address2Lines = doc.splitTextToSize(String(customerAddress2), 32);

//       doc.text(address2Lines, leftX, customerY);

//       customerY += address2Lines.length * 3;
//     }

//     // Address 3
//     if (customerAddress3) {
//       const address3Lines = doc.splitTextToSize(String(customerAddress3), 32);

//       doc.text(address3Lines, leftX, customerY);

//       customerY += address3Lines.length * 3;
//     }

//     // Mobile
//     if (contactNo) {
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(5.8);

//       doc.text(`Mobile No.: ${contactNo}`, leftX, customerY);

//       customerY += 3.5;
//     }

//     // ------------------------------------------------------------
//     // RIGHT : INVOICE DETAILS
//     // ------------------------------------------------------------

//     let invoiceY = sectionStartY;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(7);

//     doc.text("Invoice Details", rightX, invoiceY);

//     invoiceY += 5;

//     // Invoice Number
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(6.2);

//     doc.text(`Invoice No.: ${invoiceNo || "-"}`, rightX, invoiceY);

//     invoiceY += 5;

//     // Date
//     doc.text(`Date: ${invoiceDateText}`, rightX, invoiceY);

//     invoiceY += 5;

//     // Time
//     doc.text(`Time: ${invoiceTime}`, rightX, invoiceY);

//     invoiceY += 4;

//     // ------------------------------------------------------------
//     // CALCULATE NEXT Y POSITION
//     // ------------------------------------------------------------

//     y = Math.max(customerY, invoiceY) + 2;

//     // ------------------------------------------------------------
//     // LINE BEFORE PRODUCT TABLE
//     // ------------------------------------------------------------

//     doc.setLineWidth(0.3);

//     doc.line(leftMargin + 2, y, pageWidth - rightMargin - 2, y);

//     y += 4;

//     // ============================================================
//     // 23. INVOICE DETAILS
//     // ============================================================

//     const invoiceDetails = Array.isArray(printData?.invdetail)
//       ? printData.invdetail
//       : [];

//     // ============================================================
//     // 24. PRODUCT TABLE DATA
//     // ============================================================

//     const tableData = invoiceDetails.map((item, index) => {
//       const matchedProduct = Array.isArray(productOptions)
//         ? productOptions.find(
//             (option) => String(option?.value) === String(item?.ProductId),
//           )
//         : null;

//       const productName =
//         item?.ProductName ||
//         item?.productName ||
//         matchedProduct?.label ||
//         "Unknown";

//       const hsnSac =
//         item?.HSNSAC ||
//         item?.HsnSac ||
//         item?.HSNCode ||
//         item?.HsnCode ||
//         item?.HSN ||
//         item?.SAC ||
//         item?.SACCode ||
//         "";

//       const quantity = Number(item?.Quantity || 0);

//       const rate = Number(item?.Rate || 0);

//       const amount = Number(item?.Amount || 0);

//       return [
//         index + 1,
//         productName,
//         hsnSac,
//         quantity.toFixed(2),
//         rate.toFixed(2),
//         amount.toFixed(2),
//       ];
//     });

//     // ============================================================
//     // 25. PRODUCT TABLE
//     // ============================================================

//     autoTable(doc, {
//       head: [["#", "Item", "HSN", "Qty", "Rate", "Amount"]],

//       body:
//         tableData.length > 0 ? tableData : [["", "No items", "", "", "", ""]],

//       startY: y,

//       margin: {
//         left: 6,
//         right: 6,
//       },

//       tableWidth: 68,

//       theme: "grid",

//       styles: {
//         font: "helvetica",
//         fontSize: 5.2,
//         cellPadding: 1,
//         lineWidth: 0.2,
//         textColor: 0,
//         valign: "middle",
//         overflow: "linebreak",
//       },

//       headStyles: {
//         font: "helvetica",
//         fontSize: 5.2,
//         fontStyle: "bold",
//         fillColor: [240, 240, 240],
//         textColor: 0,
//         halign: "center",
//         valign: "middle",
//       },

//       columnStyles: {
//         0: {
//           cellWidth: 5,
//           halign: "center",
//         },

//         1: {
//           cellWidth: 25,
//           halign: "left",
//         },

//         2: {
//           cellWidth: 10,
//           halign: "center",
//         },

//         3: {
//           cellWidth: 8,
//           halign: "right",
//         },

//         4: {
//           cellWidth: 10,
//           halign: "right",
//         },

//         5: {
//           cellWidth: 10,
//           halign: "right",
//         },
//       },
//     });

//     // ============================================================
//     // 26. TOTAL QUANTITY
//     // ============================================================

//     const totalQuantity = invoiceDetails.reduce(
//       (sum, item) => sum + Number(item?.Quantity || 0),
//       0,
//     );

//     // ============================================================
//     // 27. SUB TOTAL
//     // ============================================================

//     const subTotal = Number(printData?.SubTotal || 0);

//     // ============================================================
//     // 28. GRAND TOTAL
//     // ============================================================

//     const grandTotal = Number(printData?.Total || 0);

//     // ============================================================
//     // 29. RECEIVED
//     // ============================================================

//     const receivedAmount = Number(printData?.ReceivedAmount || 0);

//     // ============================================================
//     // 30. BALANCE
//     // ============================================================

//     const balance = Math.max(grandTotal - receivedAmount, 0);

//     // ============================================================
//     // 31. TOTAL ROW
//     // ============================================================

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : y + 4;

//     autoTable(doc, {
//       body: [
//         [
//           "",
//           "Total",
//           "",
//           totalQuantity.toFixed(2),
//           "",
//           `Rs. ${grandTotal.toFixed(2)}`,
//         ],
//       ],

//       startY: y,

//       margin: {
//         left: 6,
//         right: 6,
//       },

//       tableWidth: 68,

//       theme: "grid",

//       styles: {
//         font: "helvetica",
//         fontSize: 5.3,
//         cellPadding: 1,
//         fontStyle: "bold",
//         lineWidth: 0.2,
//       },

//       columnStyles: {
//         0: {
//           cellWidth: 5,
//         },

//         1: {
//           cellWidth: 25,
//         },

//         2: {
//           cellWidth: 10,
//         },

//         3: {
//           cellWidth: 8,
//           halign: "right",
//         },

//         4: {
//           cellWidth: 10,
//         },

//         5: {
//           cellWidth: 10,
//           halign: "right",
//         },
//       },
//     });

//     // ============================================================
//     // 32. NUMBER TO WORDS
//     // ============================================================

//     const numberToWords = (num) => {
//       const ones = [
//         "",
//         "One",
//         "Two",
//         "Three",
//         "Four",
//         "Five",
//         "Six",
//         "Seven",
//         "Eight",
//         "Nine",
//         "Ten",
//         "Eleven",
//         "Twelve",
//         "Thirteen",
//         "Fourteen",
//         "Fifteen",
//         "Sixteen",
//         "Seventeen",
//         "Eighteen",
//         "Nineteen",
//       ];

//       const tens = [
//         "",
//         "",
//         "Twenty",
//         "Thirty",
//         "Forty",
//         "Fifty",
//         "Sixty",
//         "Seventy",
//         "Eighty",
//         "Ninety",
//       ];

//       const convertBelowThousand = (number) => {
//         let result = "";

//         if (number >= 100) {
//           result += ones[Math.floor(number / 100)] + " Hundred ";

//           number %= 100;
//         }

//         if (number >= 20) {
//           result += tens[Math.floor(number / 10)] + " ";

//           number %= 10;
//         }

//         if (number > 0) {
//           result += ones[number] + " ";
//         }

//         return result.trim();
//       };

//       if (num === 0) {
//         return "Zero";
//       }

//       num = Math.floor(num);

//       let result = "";

//       if (num >= 10000000) {
//         result += convertBelowThousand(Math.floor(num / 10000000)) + " Crore ";

//         num %= 10000000;
//       }

//       if (num >= 100000) {
//         result += convertBelowThousand(Math.floor(num / 100000)) + " Lakh ";

//         num %= 100000;
//       }

//       if (num >= 1000) {
//         result += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";

//         num %= 1000;
//       }

//       if (num > 0) {
//         result += convertBelowThousand(num);
//       }

//       return result.trim();
//     };

//     // ============================================================
//     // 33. AMOUNT IN WORDS
//     // ============================================================

//     const amountInWords = `${numberToWords(grandTotal)} Rupees only`;

//     // ============================================================
//     // 34. SUMMARY TABLE
//     // ============================================================

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : y + 4;

//     autoTable(doc, {
//       body: [
//         [
//           {
//             content: "Invoice Amount In Words",
//             styles: {
//               fontStyle: "bold",
//             },
//           },

//           {
//             content: "Sub Total",
//             styles: {
//               fontStyle: "bold",
//             },
//           },

//           `Rs. ${subTotal.toFixed(2)}`,
//         ],

//         [amountInWords, "Total", `Rs. ${grandTotal.toFixed(2)}`],

//         ["", "Received", `Rs. ${receivedAmount.toFixed(2)}`],

//         ["", "Balance", `Rs. ${balance.toFixed(2)}`],
//       ],

//       startY: y,

//       margin: {
//         left: 6,
//         right: 6,
//       },

//       tableWidth: 68,

//       theme: "grid",

//       styles: {
//         font: "helvetica",
//         fontSize: 5.3,
//         cellPadding: 1.5,
//         lineWidth: 0.2,
//         valign: "middle",
//         overflow: "linebreak",
//       },

//       columnStyles: {
//         0: {
//           cellWidth: 39,
//         },

//         1: {
//           cellWidth: 14,
//           fontStyle: "bold",
//         },

//         2: {
//           cellWidth: 15,
//           halign: "right",
//         },
//       },
//     });

//     // ============================================================
//     // 35. TERMS
//     // ============================================================

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 5 : y + 5;

//     doc.setFont("helvetica", "bold");

//     doc.setFontSize(6.5);

//     doc.text("Terms And Conditions", 6, y);

//     y += 3.5;

//     doc.setFont("helvetica", "normal");

//     doc.setFontSize(5.5);

//     doc.text("Thanks for doing business with us!", 6, y);

//     y += 7;

//     // ============================================================
//     // 36. AUTHORIZED SIGNATORY
//     // ============================================================

//     doc.setFontSize(6);

//     doc.text("For: AMRUT MILK PRODUCTS 2", pageWidth / 2, y, {
//       align: "center",
//     });

//     y += 9;

//     doc.line(pageWidth / 2 - 15, y, pageWidth / 2 + 15, y);

//     y += 3.5;

//     doc.setFont("helvetica", "bold");

//     doc.text("Authorized Signatory", pageWidth / 2, y, {
//       align: "center",
//     });

//     // ============================================================
//     // 37. PRINT PDF
//     // ============================================================

//     try {
//       if (typeof doc.autoPrint === "function") {
//         doc.autoPrint();
//       }

//       const pdfBlob = doc.output("blob");

//       const pdfBlobUrl = URL.createObjectURL(pdfBlob);

//       // console.log("========================================");

//       // console.log("80MM ROLL PDF CREATED");

//       // console.log("PDF URL:", pdfBlobUrl);

//       // console.log("========================================");

//       if (printWindow && !printWindow.closed) {
//         printWindow.location.href = pdfBlobUrl;

//         printWindow.focus();
//       } else {
//         const newPrintWindow = window.open(pdfBlobUrl, "_blank");

//         if (!newPrintWindow) {
//           toast.error("Please allow popups for printing.");

//           URL.revokeObjectURL(pdfBlobUrl);

//           return;
//         }

//         newPrintWindow.focus();
//       }

//       setTimeout(() => {
//         URL.revokeObjectURL(pdfBlobUrl);
//       }, 60000);
//     } catch (error) {
//       console.error("Error generating invoice PDF:", error);

//       if (printWindow && !printWindow.closed) {
//         printWindow.close();
//       }

//       toast.error("Unable to generate invoice PDF.");
//     }
//   };

//   return (
//     <Box>
//       <Box textAlign={"center"}>
//         <Typography color="var(--complementary-color)" variant="h4">
//           <b>Sales Entry</b>
//         </Typography>
//       </Box>
//       <Box
//         sx={{
//           //  background: 'rgb(236, 253, 230)',
//           p: 5,
//           height: "auto",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//             alignItems: "flex-start",
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",
//               minWidth: "235px",
//               height: "56px",
//               whiteSpace: "nowrap",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },
//             }}
//             variant="contained"
//             onClick={handleNewClick}
//           >
//             Create Sales Entry
//           </Button>

//           {minimizedBills.length > 0 && (
//             <Box
//               sx={{
//                 mt: 2,
//                 mb: 2,
//                 p: 2,
//                 borderRadius: "12px",
//                 backgroundColor: "#f5f7fa",
//                 border: "1px solid #e0e0e0",
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 700,
//                   mb: 1.5,
//                 }}
//               >
//                 Minimized Bills ({minimizedBills.length})
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 1,
//                 }}
//               >
//                 {minimizedBills.map((bill) => (
//                   <Box
//                     key={bill.draftId}
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       gap: 2,
//                       p: 1.5,
//                       backgroundColor: "#fff",
//                       borderRadius: "8px",
//                       border: "1px solid #e0e0e0",
//                     }}
//                   >
//                     <Box>
//                       <Typography
//                         sx={{
//                           fontWeight: 600,
//                         }}
//                       >
//                         {bill.customerName || "Regular Customer"}
//                       </Typography>

//                       <Typography variant="body2" color="text.secondary">
//                         Invoice: {bill.invoiceNo || "-"}
//                       </Typography>
//                     </Box>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                       }}
//                     >
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => handleResumeBill(bill.draftId)}
//                       >
//                         Resume
//                       </Button>

//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={() => handleRemoveMinimizedBill(bill.draftId)}
//                       >
//                         Remove
//                       </Button>
//                     </Box>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           )}
//         </Box>
//         {/* =========================
//     INVOICE FILTERS
// ========================= */}
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               alignItems: "center",
//               flexWrap: "wrap",
//               mt: 2,
//               mb: 2,
//             }}
//           >
//             {/* SEARCH */}
//             <TextField
//               size="small"
//               label="Search"
//               placeholder="Bill No / Customer / Category"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               sx={{ minWidth: 250 }}
//             />

//             {/* FROM DATE */}
//             <DatePicker
//               label="From Date"
//               format="dd-MM-yyyy"
//               value={
//                 fromDate
//                   ? moment(fromDate, "YYYY-MM-DD", true).isValid()
//                     ? moment(fromDate, "YYYY-MM-DD").toDate()
//                     : null
//                   : null
//               }
//               onChange={(newValue) => {
//                 setFromDate(
//                   newValue && !isNaN(newValue.getTime())
//                     ? moment(newValue).format("YYYY-MM-DD")
//                     : "",
//                 );
//               }}
//               slotProps={{
//                 textField: {
//                   size: "small",
//                   sx: { minWidth: 160 },
//                 },
//               }}
//             />

//             {/* TO DATE */}
//             <DatePicker
//               label="To Date"
//               format="dd-MM-yyyy"
//               value={
//                 toDate
//                   ? moment(toDate, "YYYY-MM-DD", true).isValid()
//                     ? moment(toDate, "YYYY-MM-DD").toDate()
//                     : null
//                   : null
//               }
//               onChange={(newValue) => {
//                 setToDate(
//                   newValue && !isNaN(newValue.getTime())
//                     ? moment(newValue).format("YYYY-MM-DD")
//                     : "",
//                 );
//               }}
//               slotProps={{
//                 textField: {
//                   size: "small",
//                   sx: { minWidth: 160 },
//                 },
//               }}
//             />

//             {/* CATEGORY */}
//             <TextField
//               select
//               size="small"
//               label="Category"
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//               sx={{ minWidth: 160 }}
//             >
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="R">Retailer</MenuItem>
//             </TextField>

//             {/* CLEAR */}
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => {
//                 setSearchText("");
//                 setFromDate("");
//                 setToDate("");
//                 setCategoryFilter("");
//               }}
//             >
//               Clear
//             </Button>
//           </Box>
//         </LocalizationProvider>
//         <MaterialReactTable
//           columns={columns}
//           data={filteredInvoiceData}
//           enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",
//               color: "black",
//               fontSize: "16px",
//             },
//           }}
//         />
//         {/* ///for preview///////// */}.
//         <Dialog
//           open={previewOpen}
//           onClose={() => setPreviewOpen(false)}
//           //   style: { cursor: 'pointer' },
//           // })}
//         />
//         {/* ///for preview///////// */}.
//         <Dialog
//           open={previewOpen}
//           onClose={() => setPreviewOpen(false)}
//           maxWidth="xlg"
//           fullWidth
//         >
//           <DialogTitle sx={{ textAlign: "center" }}>
//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               gap={1}
//             >
//               {/* <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} /> */}
//               <Typography
//                 variant="h5"
//                 sx={{
//                   fontWeight: "bold",
//                   color: "#0B5E20",
//                 }}
//               >
//                 Welcome To Amrut Dairy
//               </Typography>
//             </Box>
//             {/* <Typography sx={{ mt: 1 }}>
//               Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
//             </Typography> */}

//             <Typography
//               variant="h6"
//               component="div"
//               sx={{ fontWeight: "bold", mt: 1 }}
//             >
//               Sales Preview
//             </Typography>
//           </DialogTitle>

//           <DialogContent dividers>
//             <Box>
//               {previewData ? (
//                 <Box>
//                   <Box
//                     display={"flex"}
//                     justifyContent={"space-between"}
//                     gap={2}
//                   >
//                     <Typography>
//                       <strong>Invoice No:</strong> {previewData.InvoiceNo}
//                     </Typography>
//                     <Typography>
//                       <strong>Invoice Date:</strong>{" "}
//                       {previewData?.InvoiceDate?.date
//                         ? new Date(
//                             previewData.InvoiceDate.date,
//                           ).toLocaleDateString()
//                         : previewData?.InvoiceDate
//                           ? new Date(
//                               previewData.InvoiceDate,
//                             ).toLocaleDateString()
//                           : "-"}
//                     </Typography>
//                   </Box>

//                   <Box
//                     display={"flex"}
//                     justifyContent={"space-between"}
//                     gap={2}
//                     mt={2}
//                   >
//                     <Box>
//                       {/* ORDER NUMBER */}
//                       <Typography>
//                         <strong>Order No:</strong> {previewData?.OrderNo || "-"}
//                       </Typography>

//                       {/* ORDER TIME */}
//                       <Typography sx={{ mt: 1 }}>
//                         <strong>Order Time:</strong>{" "}
//                         {(() => {
//                           const createdOnValue = previewData?.CreatedOn;

                         
//                           if (!createdOnValue) {
//                             return "-";
//                           }

                         
//                           const dateValue =
//                             typeof createdOnValue === "object"
//                               ? createdOnValue?.date ||
//                                 createdOnValue?.Date ||
//                                 createdOnValue?.value ||
//                                 ""
//                               : createdOnValue;

                        
//                           if (!dateValue) {
//                             return "-";
//                           }

//                           const date = new Date(dateValue);

//                           // Invalid date
//                           if (isNaN(date.getTime())) {
//                             return "-";
//                           }

//                           // Only Time
//                           return date.toLocaleTimeString("en-IN", {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             second: "2-digit",
//                             hour12: true,
//                           });
//                         })()}
//                       </Typography>
//                     </Box>
//                     <Box></Box>
//                     <Box>
//                       <Typography>
//                         <strong>Customer Name:</strong>{" "}
//                         {previewData.accountDetails?.AccountName || "-"}
//                       </Typography>
//                     </Box>
//                     <Box>
//                       <Typography>
//                         <strong>Contact No:</strong> {previewData.ContactNo}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Divider sx={{ mt: 2 }} />

//                   {/* ////////// */}

//                   <Grid container spacing={2}>
//                     {/* =====================================================
//       SALES DETAILS - FULL WIDTH
//   ====================================================== */}

//                     <Grid item xs={12} md={12}>
//                       <Typography
//                         variant="h6"
//                         fontWeight="bold"
//                         gutterBottom
//                         mt={1}
//                       >
//                         Sales Details
//                       </Typography>

//                       <TableContainer
//                         component={Paper}
//                         elevation={2}
//                         sx={{
//                           width: "100%",
//                           mt: 1,
//                         }}
//                       >
//                         <Table size="small">
//                           <TableHead
//                             sx={{
//                               backgroundColor: "#f5f5f5",
//                             }}
//                           >
//                             <TableRow>
//                               <TableCell>
//                                 <strong>Material</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Quantity (Lit)</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Rate</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Discount</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Amount (Rs)</strong>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             {previewData.invdetail.map((item, index) => {
//                               const materialName =
//                                 productOptions.find(
//                                   (opt) =>
//                                     opt.value.toString() ===
//                                     item.ProductId?.toString(),
//                                 )?.label || "Unknown";

//                               return (
//                                 <TableRow key={index}>
//                                   <TableCell>{materialName}</TableCell>

//                                   <TableCell>{item.Quantity}</TableCell>

//                                   <TableCell>{item.Rate}</TableCell>

//                                   <TableCell>{item.DiscountAmt || 0}</TableCell>

//                                   <TableCell>{item.Amount}</TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>

//                       {/* =====================================================
//         PAYMENT MODE + TRANSPORT
//     ====================================================== */}

//                       <TableContainer
//                         component={Paper}
//                         elevation={1}
//                         sx={{
//                           width: "100%",
//                           mt: 2,
//                         }}
//                       >
//                         <Table size="small">
//                           <TableHead
//                             sx={{
//                               backgroundColor: "#f5f5f5",
//                             }}
//                           >
//                             <TableRow>
//                               <TableCell>
//                                 <strong>Payment Mode</strong>
//                               </TableCell>

//                               <TableCell>
//                                 <strong>Transport Charge</strong>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             <TableRow>
//                               <TableCell>
//                                 {previewData.PaymentMode || "-"}
//                               </TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(previewData.Transport || 0).toFixed(2)}
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Grid>

//                     {/* =====================================================
//       AMOUNT SUMMARY - FULL WIDTH
//   ====================================================== */}

//                     <Grid item xs={12} md={12}>
//                       <Box
//                         sx={{
//                           width: "100%",
//                           mt: 1,
//                           border: "1px solid #e0e0e0",
//                           borderRadius: 2,
//                           backgroundColor: "#fff",
//                           boxShadow: 2,
//                           p: 1.5,
//                         }}
//                       >
//                         {/* TITLE */}

//                         <Typography
//                           variant="h6"
//                           fontWeight="bold"
//                           sx={{
//                             color: "#1976d2",
//                             mb: 1,
//                           }}
//                         >
//                           Amount Summary
//                         </Typography>

//                         {/* =================================================
//           ROW 1
//       ================================================== */}
//                         <Grid container spacing={1.5}>
//                           {/* SUBTOTAL */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>Subtotal</Typography>

//                               <Typography fontWeight={600}>
//                                 ₹ {Number(previewData.SubTotal || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>

//                           {/* DISCOUNT */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>Discount</Typography>

//                               <Typography fontWeight={600}>
//                                 ₹ {Number(previewData.Discount || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>

//                           {/* TRANSPORT */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #e0e0e0",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>
//                                 Transport
//                               </Typography>

//                               <Typography fontWeight={600}>
//                                 ₹{" "}
//                                 {Number(previewData.Transport || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>

//                           {/* GRAND TOTAL */}

//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box
//                               sx={{
//                                 border: "1px solid #90caf9",
//                                 backgroundColor: "#e3f2fd",
//                                 borderRadius: 1,
//                                 px: 1.5,
//                                 py: 1,
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 height: "100%",
//                               }}
//                             >
//                               <Typography fontWeight={600}>
//                                 Grand Total
//                               </Typography>

//                               <Typography
//                                 fontWeight={700}
//                                 sx={{
//                                   color: "#1976d2",
//                                   fontSize: "1.1rem",
//                                 }}
//                               >
//                                 ₹ {Number(previewData.Total || 0).toFixed(2)}
//                               </Typography>
//                             </Box>
//                           </Grid>
//                         </Grid>

//                         {/* RECEIVED AMOUNT */}
//                         <Grid item xs={12} sm={6} md={3}>
//                           <Box
//                             sx={{
//                               border: "1px solid #e0e0e0",
//                               borderRadius: 1,
//                               px: 1.5,
//                               py: 1,
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               minHeight: "62px",
//                               height: "auto",
//                             }}
//                           >
//                             <Typography fontWeight={600}>
//                               Received Amount
//                             </Typography>

//                             <Typography fontWeight={600}>
//                               ₹{" "}
//                               {Number(
//                                 previewData?.ReceivedAmount ??
//                                   previewData?.ReceivedAmt ??
//                                   previewData?.Received ??
//                                   previewData?.receivedAmount ??
//                                   0,
//                               ).toFixed(2)}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         {/* =================================================
//           BALANCE DUE / REFUND
//       ================================================== */}

//                         <Box
//                           sx={{
//                             mt: 1,
//                             px: 2,
//                             py: 1,
//                             borderRadius: 1.5,
//                             border: "1px solid",
//                             borderColor: refund >= 0 ? "#81c784" : "#ef9a9a",
//                             backgroundColor:
//                               refund >= 0 ? "#e8f5e9" : "#ffebee",

//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Typography
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: 20,
//                               color: refund >= 0 ? "green" : "#d32f2f",
//                             }}
//                           >
//                             ₹ {Math.abs(refund).toFixed(2)}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               ) : (
//                 <Typography>No data to preview</Typography>
//               )}
//             </Box>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={() => generatePDF(previewData)} color="primary">
//               <PrintIcon sx={{ fontSize: 35 }} />
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => setPreviewOpen(false)}
//               color="primary"
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog
//           open={historyOpen}
//           onClose={() => {
//             setHistoryOpen(false);
//             setSelectedHistoryVersion(null);
//             setSelectedHistoryDetails([]);
//           }}
//           fullWidth
//           maxWidth="xl"
//           PaperProps={{
//             sx: {
//               borderRadius: 3,
//               maxHeight: "92vh",
//             },
//           }}
//         >
//           {/* =====================================================
//       HEADER
//   ===================================================== */}

//           <DialogTitle
//             sx={{
//               background: "linear-gradient(135deg, #1976d2, #0d47a1)",
//               color: "#fff",
//               fontWeight: 700,
//               fontSize: "20px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Box>
//               Invoice Edit History
//               <Typography
//                 sx={{
//                   fontSize: "13px",
//                   opacity: 0.9,
//                   mt: 0.5,
//                 }}
//               >
//                 Invoice No:{" "}
//                 {selectedHistoryInvoice?.InvoiceNo ||
//                   selectedHistoryInvoice?.BillNo ||
//                   "-"}
//               </Typography>
//             </Box>

//             <IconButton
//               onClick={() => {
//                 setHistoryOpen(false);
//                 setSelectedHistoryVersion(null);
//                 setSelectedHistoryDetails([]);
//               }}
//               sx={{
//                 color: "#fff",
//               }}
//             >
//               <CloseIcon
//                 sx={{
//                   cursor: isSaving ? "not-allowed" : "pointer",
//                   fontSize: 28,
//                   color: isSaving ? "#bdbdbd" : "inherit",
//                 }}
//                 onClick={isSaving ? undefined : handleDrawerClose}
//               />
//             </IconButton>
//           </DialogTitle>

//           {/* =====================================================
//       CONTENT
//   ===================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#f7f9fc",
//             }}
//           >
//             {historyLoading ? (
//               <Box
//                 sx={{
//                   minHeight: 300,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <>
//                 {/* =================================================
//             CURRENT INVOICE
//         ================================================= */}

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: 2,
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: "22px",
//                       fontWeight: 700,
//                       color: "#1976d2",
//                       mb: 2,
//                     }}
//                   >
//                     Current Invoice
//                   </Typography>

//                   {currentHistoryHeader ? (
//                     <Box
//                       sx={{
//                         display: "grid",
//                         gridTemplateColumns:
//                           "repeat(auto-fit, minmax(180px, 1fr))",
//                         gap: 3,
//                       }}
//                     >
//                       <Box>
//                         <Typography color="text.secondary">
//                           Invoice No
//                         </Typography>

//                         <Typography fontWeight={700}>
//                           {currentHistoryHeader?.InvoiceNo ||
//                             selectedHistoryInvoice?.InvoiceNo ||
//                             "-"}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">
//                           Invoice Date
//                         </Typography>

//                         <Typography fontWeight={700}>
//                           {formatHistoryDate(currentHistoryHeader?.InvoiceDate)}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Customer</Typography>

//                         <Typography fontWeight={700}>
//                           {currentHistoryHeader?.AccountName ||
//                             currentHistoryHeader?.CustomerName ||
//                             currentHistoryHeader?.accountDetails?.AccountName ||
//                             "-"}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Total</Typography>

//                         <Typography fontWeight={700} color="#1976d2">
//                           ₹{" "}
//                           {Number(currentHistoryHeader?.Total || 0).toFixed(2)}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Received</Typography>

//                         <Typography fontWeight={700}>
//                           ₹{" "}
//                           {Number(
//                             currentHistoryHeader?.ReceivedAmount || 0,
//                           ).toFixed(2)}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography color="text.secondary">Balance</Typography>

//                         <Typography fontWeight={700} color="red">
//                           ₹{" "}
//                           {Math.max(
//                             Number(currentHistoryHeader?.Total || 0) -
//                               Number(currentHistoryHeader?.ReceivedAmount || 0),
//                             0,
//                           ).toFixed(2)}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   ) : (
//                     <Typography color="text.secondary">
//                       Current invoice data not found.
//                     </Typography>
//                   )}
//                 </Paper>

//                 {/* =================================================
//             PREVIOUS INVOICE HISTORY
//         ================================================= */}

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: 2,
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: "22px",
//                       fontWeight: 700,
//                       color: "#e67e00",
//                       mb: 2,
//                     }}
//                   >
//                     Previous Invoice History
//                   </Typography>

//                   {historyHeader.length === 0 ? (
//                     <Typography color="text.secondary">
//                       No previous invoice history found.
//                     </Typography>
//                   ) : (
//                     <TableContainer component={Paper} elevation={0}>
//                       <Table>
//                         <TableHead>
//                           <TableRow
//                             sx={{
//                               backgroundColor: "#e3f2fd",
//                             }}
//                           >
//                             <TableCell>
//                               <b>Version</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Invoice No</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Invoice Date</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Customer</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Total</b>
//                             </TableCell>

//                             <TableCell>
//                               <b>Received</b>
//                             </TableCell>

//                             <TableCell align="center">
//                               <b>View</b>
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {historyHeader
//                             .slice()
//                             .sort(
//                               (a, b) =>
//                                 Number(a?.VersionNo || 0) -
//                                 Number(b?.VersionNo || 0),
//                             )
//                             .map((item, index) => {
//                               const version =
//                                 Number(item?.VersionNo) || index + 1;

//                               const isSelected =
//                                 Number(selectedHistoryVersion) === version;

//                               return (
//                                 <TableRow
//                                   key={item?.Id || `${version}-${index}`}
//                                   sx={{
//                                     backgroundColor: isSelected
//                                       ? "#e3f2fd"
//                                       : "transparent",
//                                   }}
//                                 >
//                                   <TableCell>
//                                     <Button
//                                       variant="contained"
//                                       size="small"
//                                       onClick={() =>
//                                         handleHistoryVersionClick(item)
//                                       }
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       VERSION {version}
//                                     </Button>
//                                   </TableCell>

//                                   <TableCell>
//                                     {item?.InvoiceNo || "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     {formatHistoryDate(item?.InvoiceDate)}
//                                   </TableCell>

//                                   <TableCell>
//                                     {item?.AccountName ||
//                                       item?.CustomerName ||
//                                       item?.accountDetails?.AccountName ||
//                                       "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(item?.Total || 0).toFixed(2)}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹{" "}
//                                     {Number(item?.ReceivedAmount || 0).toFixed(
//                                       2,
//                                     )}
//                                   </TableCell>

//                                   <TableCell align="center">
//                                     <Button
//                                       size="small"
//                                       onClick={() =>
//                                         handleHistoryVersionClick(item)
//                                       }
//                                     >
//                                       VIEW
//                                     </Button>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </Paper>

//                 {/* =================================================
//             PREVIOUS PRODUCT DETAILS
//         ================================================= */}

//                 {selectedHistoryVersion !== null && (
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 3,
//                       mb: 3,
//                       borderRadius: 2,
//                       border: "1px solid #ddd",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "22px",
//                         fontWeight: 700,
//                         color: "#e67e00",
//                         mb: 2,
//                       }}
//                     >
//                       Previous Product Details — Version{" "}
//                       {selectedHistoryVersion}
//                     </Typography>

//                     {selectedHistoryDetails.length === 0 ? (
//                       <Typography color="text.secondary">
//                         No previous product details found.
//                       </Typography>
//                     ) : (
//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow
//                               sx={{
//                                 backgroundColor: "#fff3e0",
//                               }}
//                             >
//                               <TableCell>
//                                 <b>Product</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Quantity</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Rate</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Amount</b>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             {selectedHistoryDetails.map((detail, index) => {
//                               const product = productOptions.find(
//                                 (option) =>
//                                   String(option?.value) ===
//                                   String(detail?.ProductId),
//                               );

//                               return (
//                                 <TableRow
//                                   key={
//                                     detail?.Id ||
//                                     `${detail?.ProductId}-${index}`
//                                   }
//                                 >
//                                   <TableCell>
//                                     {product?.label ||
//                                       detail?.ProductName ||
//                                       "Unknown"}
//                                   </TableCell>

//                                   <TableCell>
//                                     {detail?.Quantity ?? detail?.Qty ?? "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Rate || 0).toFixed(2)}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Amount || 0).toFixed(2)}
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     )}
//                   </Paper>
//                 )}

//                 {/* =================================================
//             CURRENT PRODUCT DETAILS
//         ================================================= */}

//                 {selectedHistoryVersion !== null && (
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 3,
//                       mb: 3,
//                       borderRadius: 2,
//                       border: "1px solid #ddd",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "22px",
//                         fontWeight: 700,
//                         color: "#1976d2",
//                         mb: 2,
//                       }}
//                     >
//                       Current Product Details
//                     </Typography>

//                     {currentHistoryDetails.length === 0 ? (
//                       <Typography color="text.secondary">
//                         No current product details found.
//                       </Typography>
//                     ) : (
//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow
//                               sx={{
//                                 backgroundColor: "#e3f2fd",
//                               }}
//                             >
//                               <TableCell>
//                                 <b>Product</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Quantity</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Rate</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Amount</b>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             {currentHistoryDetails.map((detail, index) => {
//                               const product = productOptions.find(
//                                 (option) =>
//                                   String(option?.value) ===
//                                   String(detail?.ProductId),
//                               );

//                               return (
//                                 <TableRow
//                                   key={
//                                     detail?.Id ||
//                                     `${detail?.ProductId}-${index}`
//                                   }
//                                 >
//                                   <TableCell>
//                                     {product?.label ||
//                                       detail?.ProductName ||
//                                       "Unknown"}
//                                   </TableCell>

//                                   <TableCell>
//                                     {detail?.Quantity ?? detail?.Qty ?? "-"}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Rate || 0).toFixed(2)}
//                                   </TableCell>

//                                   <TableCell>
//                                     ₹ {Number(detail?.Amount || 0).toFixed(2)}
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     )}
//                   </Paper>
//                 )}

//                 {/* =================================================
//             OLD VS CURRENT
//         ================================================= */}

//                 {selectedHistoryVersion !== null &&
//                   selectedHistoryDetails.length > 0 &&
//                   currentHistoryDetails.length > 0 && (
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 3,
//                         mb: 2,
//                         borderRadius: 2,
//                         border: "1px solid #ddd",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "22px",
//                           fontWeight: 700,
//                           color: "#7b1fa2",
//                           mb: 2,
//                         }}
//                       >
//                         Old vs Current Invoice
//                       </Typography>

//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow
//                               sx={{
//                                 backgroundColor: "#f3e5f5",
//                               }}
//                             >
//                               <TableCell>
//                                 <b>Field</b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>
//                                   Previous — Version {selectedHistoryVersion}
//                                 </b>
//                               </TableCell>

//                               <TableCell>
//                                 <b>Current</b>
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>

//                           <TableBody>
//                             <TableRow>
//                               <TableCell>Product Count</TableCell>

//                               <TableCell>
//                                 {selectedHistoryDetails.length}
//                               </TableCell>

//                               <TableCell>
//                                 {currentHistoryDetails.length}
//                               </TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>Total</TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   historyHeader.find(
//                                     (h) =>
//                                       Number(h?.VersionNo) ===
//                                       Number(selectedHistoryVersion),
//                                   )?.Total || 0,
//                                 ).toFixed(2)}
//                               </TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   currentHistoryHeader?.Total || 0,
//                                 ).toFixed(2)}
//                               </TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>Received</TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   historyHeader.find(
//                                     (h) =>
//                                       Number(h?.VersionNo) ===
//                                       Number(selectedHistoryVersion),
//                                   )?.ReceivedAmount || 0,
//                                 ).toFixed(2)}
//                               </TableCell>

//                               <TableCell>
//                                 ₹{" "}
//                                 {Number(
//                                   currentHistoryHeader?.ReceivedAmount || 0,
//                                 ).toFixed(2)}
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Paper>
//                   )}
//               </>
//             )}
//           </DialogContent>

//           <DialogActions
//             sx={{
//               p: 2,
//             }}
//           >
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setHistoryOpen(false);
//                 setSelectedHistoryVersion(null);
//                 setSelectedHistoryDetails([]);
//               }}
//             >
//               CLOSE
//             </Button>
//           </DialogActions>
//         </Dialog>
//         {/* ==========================================
//             DELETE CONFIRMATION DIALOG
//         ========================================== */}
//         <Dialog open={open} onClose={handleClose}>
//           <DialogTitle>Confirm Deletion</DialogTitle>

//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete this Sales Entry?
//             </DialogContentText>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={handleClose} color="primary">
//               Cancel
//             </Button>

//             <Button
//               onClick={handleConfirmDelete}
//               color="error"
//               variant="contained"
//               autoFocus
//             >
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Drawer
//           anchor="right"
//           open={isDrawerOpen}
//           onClose={handleDrawerClose}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           PaperProps={{
//             sx: {
//               width: "100vw",
//               maxWidth: "100vw",
//               height: "100vh",
//               borderRadius: 0,
//               zIndex: 1000,
//               overflow: "hidden",
//             },
//           }}
//         >
//           {/* ===================================================== */}
//           {/* HEADER */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               height: "68px",
//               minHeight: "68px",
//               padding: "8px 18px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "rgb(236, 253, 230)",
//               boxSizing: "border-box",
//             }}
//           >
//             {/* LEFT SIDE */}
//             <Typography
//               fontWeight="bold"
//               variant="h6"
//               sx={{
//                 m: 0,
//                 fontSize: "22px",
//               }}
//             >
//               {isEditing
//                 ? "Update Sales Entry - Regular"
//                 : "Create Sales Entry - Regular"}
//             </Typography>

//             {/* RIGHT SIDE */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 3,
//               }}
//             >
//               {/* TOTAL */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.7,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "15px",
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   TOTAL :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: "28px",
//                     fontWeight: 900,
//                     color: "#1976d2",
//                     lineHeight: 1,
//                   }}
//                 >
//                   ₹ {Number(total || 0).toFixed(2)}
//                 </Typography>
//               </Box>

//               {/* REFUND */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.7,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "15px",
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   REFUND :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: "28px",
//                     fontWeight: 900,
//                     color: "#087f23",
//                     lineHeight: 1,
//                   }}
//                 >
//                   ₹ {Number(refund || 0).toFixed(2)}
//                 </Typography>
//               </Box>

//               {/* CLOSE */}

//               {/* MINIMIZE */}
//               <Tooltip title="Minimize Bill">
//                 <IconButton
//                   onClick={handleMinimizeBill}
//                   disabled={isSaving}
//                   sx={{
//                     color: "#1976d2",
//                     width: 42,
//                     height: 42,
//                     borderRadius: "8px",

//                     "&:hover": {
//                       backgroundColor: "rgba(25, 118, 210, 0.08)",
//                     },

//                     "&:disabled": {
//                       color: "#bdbdbd",
//                     },
//                   }}
//                 >
//                   <MinimizeIcon />
//                 </IconButton>
//               </Tooltip>

//               {/* CLOSE */}
//               <CloseIcon
//                 sx={{
//                   cursor: isSaving ? "not-allowed" : "pointer",
//                   fontSize: 28,
//                   color: isSaving ? "#bdbdbd" : "inherit",
//                 }}
//                 onClick={isSaving ? undefined : handleDrawerClose}
//               />
//             </Box>
//           </Box>

//           <Divider />

//           {/* ===================================================== */}
//           {/* MAIN FORM */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               height: "calc(100vh - 69px)",
//               display: "flex",
//               flexDirection: "column",
//               overflow: "auto",
//               boxSizing: "border-box",
//               p: 1,
//             }}
//           >
//             {/* ===================================================== */}
//             {/* INVOICE / CUSTOMER DETAILS */}
//             {/* ===================================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 mb: 0.5,
//                 minHeight: "62px",
//               }}
//             >
//               {/* INVOICE NO */}
//               <Box flex={1}>
//                 <Typography variant="body2">Invoice No</Typography>

//                 <TextField
//                   variant="standard"
//                   value={invoiceNo}
//                   size="small"
//                   margin="none"
//                   placeholder="Invoice No Autogerated"
//                   fullWidth
//                   sx={{
//                     mt: 0.5,
//                     "& .MuiInput-underline:after": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                     },
//                   }}
//                   focused
//                 />
//               </Box>

//               {/* DEVICE */}
//               <Box flex={1}>
//                 <Typography variant="body2">Device</Typography>

//                 <TextField
//                   variant="standard"
//                   value={device}
//                   fullWidth
//                   size="small"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     mt: 0.5,
//                   }}
//                 />
//               </Box>

//               <Grid item xs={12} md={2}>
//                 <TextField
//                   fullWidth
//                   label="Time"
//                   value={currentTime}
//                   variant="standard"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Grid>

//               {/* INVOICE DATE */}
//               <Box flex={1}>
//                 <Typography variant="body2">Invoice Date</Typography>

//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label="Invoice Date"
//                     value={invoiceDate ? new Date(invoiceDate) : null}
//                     format="dd-MM-yyyy"
//                     disabled={!isAdmin}
//                     onChange={(newValue) => {
//                       setInvoiceDate(newValue);

//                       setErrors((prev) => ({
//                         ...prev,
//                         invoiceDate: undefined,
//                       }));
//                     }}
//                     slotProps={{
//                       textField: {
//                         size: "small",
//                         fullWidth: true,
//                         error: !!errors.invoiceDate,
//                         helperText: errors.invoiceDate,
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>
//               </Box>
//             </Box>

//             {/* ===================================================== */}
//             {/* CUSTOMER / CONTACT */}
//             {/* ===================================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 mb: 1,
//                 minHeight: "62px",
//               }}
//             >
//               {/* CUSTOMER */}
//               <Box
//                 ref={customerDropdownRef}
//                 flex={1}
//                 position="relative"
//                 width="100%"
//               >
//                 <Typography variant="body2">Customer</Typography>

//                 {/* =========================
//       CUSTOMER MAIN FIELD
//   ========================= */}

//                 <TextField
//                   fullWidth
//                   variant="standard"
//                   size="small"
//                   value={
//                     selectedAccount
//                       ? accountOptions.find(
//                           ({ Id }) => String(Id) === String(selectedAccount),
//                         )?.AccountName ||
//                         selectedCustomerName ||
//                         ""
//                       : ""
//                   }
//                   placeholder="Select Customer"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   onClick={() => {
//                     setShowDropdown(true);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       e.stopPropagation();

//                       setShowDropdown(true);

//                       setTimeout(() => {
//                         const searchInput = document.querySelector(
//                           'input[placeholder="Search Customer Name"]',
//                         );

//                         if (searchInput) {
//                           searchInput.focus();
//                           searchInput.select();
//                         }
//                       }, 100);
//                     }

//                     if (e.key === "Escape") {
//                       e.preventDefault();
//                       e.stopPropagation();

//                       setShowDropdown(false);
//                       setText("");
//                     }
//                   }}
//                   error={!!errors.selectedAccount}
//                   helperText={errors.selectedAccount}
//                   sx={{
//                     mt: 0.5,

//                     "& .MuiInput-underline:before": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                       opacity: 1,
//                     },
//                   }}
//                 />

//                 {/* =========================
//       CUSTOMER POPUP
//   ========================= */}

//                 {showDropdown && (
//                   <Paper
//                     elevation={3}
//                     sx={{
//                       position: "absolute",
//                       top: "100%",
//                       left: 0,
//                       width: "100%",
//                       maxHeight: 450,
//                       overflowY: "auto",
//                       zIndex: 9999,
//                       mt: 1,
//                       p: 2,
//                     }}
//                   >
//                     {/* =========================
//           SEARCH CUSTOMER
//       ========================= */}

//                     <TextField
//                       value={text}
//                       onChange={(e) => {
//                         setText(e.target.value);
//                       }}
//                       size="small"
//                       fullWidth
//                       placeholder="Search Customer Name"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     {/* =========================
//           CREATE NEW CUSTOMER
//       ========================= */}

//                     <Box display="flex" flexDirection="column" gap={1} mt={1}>
//                       {/* NAME + ADD */}

//                       <Box display="flex" gap={1}>
//                         <TextField
//                           value={accountName}
//                           onChange={(e) => {
//                             setAccountName(e.target.value);
//                           }}
//                           size="small"
//                           placeholder="Create New Customer"
//                           fullWidth
//                         />

//                         <Button
//                           sx={{
//                             background: "var(--primary-color)",

//                             "&:hover": {
//                               background: "var(--primary-color)",
//                             },

//                             minWidth: "95px",
//                             whiteSpace: "nowrap",
//                           }}
//                           onClick={CreateCustomerMaster}
//                           variant="contained"
//                           startIcon={
//                             <AddCircleIcon
//                               sx={{
//                                 fontSize: "20px",
//                               }}
//                             />
//                           }
//                         >
//                           ADD
//                         </Button>
//                       </Box>

//                       {/* =========================
//             ADDRESS
//         ========================= */}

//                       <TextField
//                         value={newCustomerAddress}
//                         onChange={(e) => {
//                           setNewCustomerAddress(e.target.value);
//                         }}
//                         size="small"
//                         placeholder="Customer Address"
//                         fullWidth
//                       />

//                       {/* =========================
//             MOBILE NUMBER
//         ========================= */}

//                       <PhoneInput
//                         country={"in"}
//                         value={newCustomerMobile}
//                         onChange={(value) => {
//                           setNewCustomerMobile(value);
//                         }}
//                         inputProps={{
//                           name: "newCustomerMobile",
//                         }}
//                         inputStyle={{
//                           width: "100%",
//                           height: "40px",
//                           fontSize: "16px",
//                           borderRadius: "5px",
//                         }}
//                         buttonStyle={{
//                           borderRadius: "5px",
//                         }}
//                         placeholder="Customer Mobile Number"
//                       />

//                       {/* =========================
//             LAND PHONE / TELEPHONE
//         ========================= */}
//                     </Box>

//                     {/* =========================
//           CUSTOMER LIST
//       ========================= */}

//                     <Box mt={1}>
//                       {accountOptions.length > 0 ? (
//                         accountOptions.map((option) => {
//                           const customerId = option.Id?.toString() || "";

//                           const customerName = option.AccountName || "";

//                           const addressData = option.addressDetails || {};

//                           const customerAddress =
//                             addressData.Address1 ||
//                             addressData.address1 ||
//                             addressData.Address ||
//                             addressData.address ||
//                             addressData.AddressLine1 ||
//                             addressData.addressLine1 ||
//                             option.Address1 ||
//                             option.address1 ||
//                             option.Address ||
//                             option.address ||
//                             "";

//                           const customerMobile =
//                             addressData.MobileNo ||
//                             addressData.mobileNo ||
//                             addressData.Mobile ||
//                             addressData.mobile ||
//                             option.MobileNo ||
//                             option.mobileNo ||
//                             option.Mobile ||
//                             option.mobile ||
//                             "";

//                           return (
//                             <MenuItem
//                               key={option.Id}
//                               onClick={() => {
//                                 // =========================
//                                 // SELECT CUSTOMER
//                                 // =========================

//                                 setSelectedAccount(customerId);

//                                 setSelectedCustomerName(customerName);

//                                 setSelectedCustomerAddress(customerAddress);

//                                 // =========================
//                                 // SET MOBILE
//                                 // =========================

//                                 if (customerMobile) {
//                                   setPhone(customerMobile);
//                                 } else {
//                                   fetchCustomerContact(customerId);
//                                 }

//                                 fetchAccounts(customerId);

//                                 fetchPreviousBalance(customerId);

//                                 // =========================
//                                 // CLOSE POPUP
//                                 // =========================

//                                 setShowDropdown(false);

//                                 setText("");
//                               }}
//                               sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "flex-start",
//                                 width: "100%",
//                                 py: 1,
//                               }}
//                             >
//                               {/* CUSTOMER NAME */}

//                               <Typography
//                                 sx={{
//                                   fontWeight: 600,
//                                   width: "100%",
//                                 }}
//                               >
//                                 {customerName}
//                               </Typography>

//                               {/* CUSTOMER ADDRESS */}

//                               {customerAddress && (
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     color: "#777",
//                                     fontSize: "13px",
//                                     width: "100%",
//                                     mt: 0.3,
//                                   }}
//                                 >
//                                   {customerAddress}
//                                 </Typography>
//                               )}

//                               {/* CUSTOMER MOBILE */}

//                               {customerMobile && (
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     color: "#777",
//                                     fontSize: "13px",
//                                     width: "100%",
//                                     mt: 0.2,
//                                   }}
//                                 >
//                                   Mobile: {customerMobile}
//                                 </Typography>
//                               )}
//                             </MenuItem>
//                           );
//                         })
//                       ) : (
//                         <Typography
//                           sx={{
//                             p: 1,
//                             color: "gray",
//                           }}
//                         >
//                           No customers found
//                         </Typography>
//                       )}
//                     </Box>
//                   </Paper>
//                 )}
//               </Box>

//               {/* CONTACT */}
//               <Box flex={1}>
//                 <Typography variant="body2">Contact Number</Typography>

//                 <PhoneInput
//                   country={"in"}
//                   value={phone}
//                   onChange={(phone) => setPhone(phone)}
//                   inputProps={{
//                     name: "phone",
//                     required: true,
//                   }}
//                   inputStyle={{
//                     width: "100%",
//                     height: "38px",
//                     fontSize: "15px",
//                     borderRadius: "5px",
//                   }}
//                   buttonStyle={{
//                     borderRadius: "5px",
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* ===================================================== */}
//             {/* CONTENT AREA */}
//             {/* ===================================================== */}

//             <Grid
//               container
//               spacing={1}
//               sx={{
//                 width: "100%",
//                 m: 0,
//                 alignItems: "flex-start",
//               }}
//             >
//               {/* ================================================= */}
//               {/* PRODUCT DETAILS - FULL WIDTH */}
//               {/* ================================================= */}

//               <Grid
//                 item
//                 xs={12}
//                 md={12}
//                 sx={{
//                   width: "100%",
//                   minWidth: 0,
//                 }}
//               >
//                 {/* PRODUCT */}
//                 <Paper
//                   elevation={2}
//                   sx={{
//                     width: "100%",
//                     border: "1px solid #e0e0e0",
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     backgroundColor: "#ffffff",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       p: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: 700,
//                         mb: 1,
//                         fontSize: "18px",
//                       }}
//                     >
//                       Product Details
//                     </Typography>

//                     <Grid container spacing={1} alignItems="center">
//                       {/* ================================================= */}
//                       {/* KEEP YOUR EXISTING PRODUCT INPUT CODE HERE */}
//                       {/* ================================================= */}
//                     </Grid>
//                   </Box>

//                   {/* PRODUCT TABLE */}

//                   <TableContainer
//                     sx={{
//                       width: "100%",
//                       overflow: "hidden",
//                       borderTop: "1px solid #e0e0e0",
//                     }}
//                   >
//                     <Table
//                       size="small"
//                       sx={{
//                         width: "100%",
//                         tableLayout: "fixed",
//                       }}
//                     >
//                       <TableHead
//                         sx={{
//                           backgroundColor: "#f5f5f5",
//                         }}
//                       >
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Sr.No
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Product
//                           </TableCell>

//                           <TableCell
//                             align="center"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Quantity
//                           </TableCell>

//                           <TableCell
//                             align="right"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Rate
//                           </TableCell>

//                           <TableCell
//                             align="right"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Amount
//                           </TableCell>

//                           <TableCell
//                             align="center"
//                             sx={{
//                               fontWeight: 700,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             Action
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>

//                       <TableBody>
//                         {rows.map((row, index) => (
//                           <TableRow key={row.Id || `row-${index}`} hover>
//                             <TableCell>{index + 1}</TableCell>

//                             <TableCell>
//                               <Typography
//                                 sx={{
//                                   fontWeight: 600,
//                                   fontSize: 14,
//                                 }}
//                               >
//                                 {row.ProductName || "-"}
//                               </Typography>
//                             </TableCell>

//                             <TableCell align="center">
//                               <TextField
//                                 variant="standard"
//                                 type="number"
//                                 value={row.Quantity ?? ""}
//                                 onChange={(e) => {
//                                   const updatedRows = [...rows];

//                                   const qty = parseFloat(e.target.value) || 0;

//                                   const currentRate =
//                                     parseFloat(updatedRows[index].Rate) || 0;

//                                   const amount = qty * currentRate;

//                                   updatedRows[index] = {
//                                     ...updatedRows[index],
//                                     Quantity: qty,
//                                     Amount: amount,
//                                   };

//                                   setRows(updatedRows);
//                                 }}
//                                 sx={{
//                                   width: 70,
//                                 }}
//                                 inputProps={{
//                                   min: 0,
//                                   onWheel: preventNumberInputScroll,
//                                 }}
//                               />
//                             </TableCell>

//                             <TableCell align="right">
//                               <TextField
//                                 variant="standard"
//                                 type="number"
//                                 value={row.Rate ?? ""}
//                                 onChange={(e) => {
//                                   const updatedRows = [...rows];

//                                   const value = e.target.value;

//                                   const currentRate =
//                                     value === "" ? "" : parseFloat(value) || 0;

//                                   const currentQty =
//                                     parseFloat(updatedRows[index].Quantity) ||
//                                     0;

//                                   const amount =
//                                     value === ""
//                                       ? 0
//                                       : currentQty * (parseFloat(value) || 0);

//                                   updatedRows[index] = {
//                                     ...updatedRows[index],
//                                     Rate: currentRate,
//                                     Amount: amount,
//                                   };

//                                   setRows(updatedRows);
//                                 }}
//                                 sx={{
//                                   width: 90,
//                                 }}
//                                 inputProps={{
//                                   min: 0,
//                                   onWheel: preventNumberInputScroll,
//                                 }}
//                               />
//                             </TableCell>

//                             <TableCell align="right">
//                               ₹ {Number(row.Amount || 0).toFixed(2)}
//                             </TableCell>

//                             <TableCell align="center">
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   gap: 0.5,
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 <Button
//                                   size="small"
//                                   variant="outlined"
//                                   onClick={() => {
//                                     // console.log("EDIT BUTTON INDEX:", index);
//                                     // console.log("EDIT BUTTON ROW:", row);
//                                     handleEditRow(index);
//                                   }}
//                                 >
//                                   Edit
//                                 </Button>

//                                 <Button
//                                   size="small"
//                                   variant="outlined"
//                                   color="error"
//                                   onClick={() => handleDeleteRow(index)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </Box>
//                             </TableCell>
//                           </TableRow>
//                         ))}

//                         {/* ================================================= */}
//                         {/* NEW PRODUCT ENTRY ROW */}
//                         {/* ================================================= */}

//                         <TableRow>
//                           <TableCell>{rows.length + 1}</TableCell>

//                           <TableCell>
//                             <Autocomplete
//                               options={productOptions}
//                               value={
//                                 productOptions.find(
//                                   (option) =>
//                                     String(option.value) ===
//                                     String(selectedProductID),
//                                 ) || null
//                               }
//                               getOptionLabel={(option) => option?.label || ""}
//                               isOptionEqualToValue={(option, value) =>
//                                 String(option.value) === String(value?.value)
//                               }
//                               renderOption={(props, option) => (
//                                 <li {...props} key={String(option.value)}>
//                                   {option.label}
//                                 </li>
//                               )}
//                               slotProps={{
//                                 popper: {
//                                   sx: {
//                                     width: "460px !important",
//                                   },
//                                 },

//                                 paper: {
//                                   sx: {
//                                     width: "100%",
//                                     height: "auto !important",
//                                     minHeight: "0 !important",
//                                     overflow: "hidden",
//                                   },
//                                 },

//                                 listbox: {
//                                   sx: {
//                                     height: "auto !important",
//                                     minHeight: "0 !important",
//                                     maxHeight: "320px",
//                                     paddingTop: "0 !important",
//                                     paddingBottom: "0 !important",
//                                     margin: 0,
//                                     overflowY: "auto",
//                                     overflowX: "hidden",
//                                   },
//                                 },
//                               }}
//                               open={productDropdownOpen}
//                               onOpen={() => {
//                                 setProductDropdownOpen(true);
//                               }}
//                               onClose={() => {
//                                 setProductDropdownOpen(false);
//                               }}
//                               onChange={(event, newValue) => {
//                                 handleItemChange(newValue);

//                                 if (newValue) {
//                                   setProductDropdownOpen(false);

//                                   setTimeout(() => {
//                                     quantityRef.current?.focus();
//                                     quantityRef.current?.select();
//                                   }, 100);
//                                 }
//                               }}
//                               renderInput={(params) => (
//                                 <TextField
//                                   {...params}
//                                   inputRef={productRef}
//                                   variant="standard"
//                                   placeholder="Select Product"
//                                   size="small"
//                                   fullWidth
//                                   onKeyDown={(event) => {
//                                     handleProductSelectKeyDown(event);
//                                   }}
//                                   onFocus={() => {
//                                     setProductDropdownOpen(true);
//                                   }}
//                                 />
//                               )}
//                             />
//                           </TableCell>

//                           <TableCell align="center">
//                             <TextField
//                               variant="standard"
//                               type="number"
//                               value={quantity}
//                               onChange={handleQuantityChange}
//                               onKeyDown={(event) => {
//                                 if (event.key !== "Enter") {
//                                   return;
//                                 }

//                                 event.preventDefault();
//                                 event.stopPropagation();

//                                 // Quantity validation
//                                 if (quantity === "" || Number(quantity) <= 0) {
//                                   toast.error("Please enter quantity.");

//                                   quantityRef.current?.focus();
//                                   quantityRef.current?.select();

//                                   return;
//                                 }

//                                 // Existing row Edit OR New row Add
//                                 handleSaveOrAddRow();
//                               }}
//                               inputRef={quantityRef}
//                               sx={{
//                                 width: 70,
//                               }}
//                               inputProps={{
//                                 min: 0,
//                                 onWheel: preventNumberInputScroll,
//                               }}
//                             />
//                           </TableCell>

//                           <TextField
//                             variant="standard"
//                             type="number"
//                             value={rate}
//                             onChange={handleRateChange}
//                             inputRef={rateRef}
//                             sx={{ width: 90 }}
//                             inputProps={{
//                               min: 0,
//                               onWheel: preventNumberInputScroll,
//                             }}
//                           />

//                           <TableCell align="right">
//                             ₹{" "}
//                             {(
//                               (parseFloat(quantity) || 0) *
//                               (parseFloat(rate) || 0)
//                             ).toFixed(2)}
//                           </TableCell>

//                           <TableCell align="center">
//                             <Typography
//                               sx={{
//                                 color: "#999",
//                                 fontSize: 13,
//                               }}
//                             >
//                               New
//                             </Typography>
//                           </TableCell>
//                         </TableRow>

//                         {/* ERROR */}

//                         {errors.rows && (
//                           <TableRow>
//                             <TableCell
//                               colSpan={6}
//                               sx={{
//                                 borderBottom: "none",
//                                 py: 0.5,
//                               }}
//                             >
//                               <Typography
//                                 color="error"
//                                 sx={{
//                                   fontSize: 13,
//                                 }}
//                               >
//                                 {errors.rows}
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   {errors.rows && (
//                     <Typography
//                       color="error"
//                       sx={{
//                         px: 1,
//                         py: 0.5,
//                         fontSize: 13,
//                       }}
//                     >
//                       {errors.rows}
//                     </Typography>
//                   )}
//                 </Paper>

//                 {/* ================================================= */}
//                 {/* PAYMENT + TRANSPORT */}
//                 {/* ================================================= */}

//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 2,
//                     mt: 1,
//                   }}
//                 >
//                   {/* PAYMENT MODE */}

//                   <Box
//                     sx={{
//                       flex: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontWeight: 600,
//                       }}
//                     >
//                       Payment Mode
//                     </Typography>
//                     <TextField
//                       select
//                       variant="standard"
//                       name="paymentMode"
//                       value={paymentMode || ""}
//                       onChange={(e) => {
//                         const mode = e.target.value;

//                         setPaymentMode(mode);
//                         setReceivedAmount("");

//                         if (mode !== "M") {
//                           setCashAmount("");
//                           setOnlineAmount("");
//                         }

//                         setErrors({
//                           ...errors,
//                           paymentMode: "",
//                         });

                       
//                         if (mode) {
//                           setTimeout(() => {
//                             discountRef.current?.focus();
//                             discountRef.current?.select();
//                           }, 100);
//                         }
//                       }}
//                       onKeyDown={(e) => {
                       
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           if (!paymentMode) {
//                             toast.error("Please select payment mode.");
//                             return;
//                           }

//                           setTimeout(() => {
//                             discountRef.current?.focus();
//                             discountRef.current?.select();
//                           }, 100);

//                           return;
//                         }

                     
//                         if (e.key === "Escape") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           setTimeout(() => {
//                             quantityRef.current?.focus();
//                             quantityRef.current?.select();
//                           }, 100);

//                           return;
//                         }
//                       }}
//                       fullWidth
//                       error={!!errors.paymentMode}
//                       helperText={errors.paymentMode}
//                     >
//                       <MenuItem value="">Select Payment Mode</MenuItem>

//                       <MenuItem value="C">Cash</MenuItem>

//                       <MenuItem value="O">Online</MenuItem>

//                       <MenuItem value="M">Mix</MenuItem>
//                     </TextField>
//                   </Box>

//                   {/* TRANSPORT */}

//                   <Box
//                     sx={{
//                       flex: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontWeight: 600,
//                       }}
//                     >
//                       Transport
//                     </Typography>

//                     <TextField
//                       variant="standard"
//                       value={transport}
//                       onChange={(e) => setTransport(e.target.value)}
//                       placeholder="Transport"
//                       fullWidth
//                       type="number"
//                       inputProps={{
//                         onWheel: preventNumberInputScroll,
//                       }}
//                     />
//                   </Box>
//                 </Box>

//                 {/* ================================================= */}
//                 {/* MIX PAYMENT */}
//                 {/* ================================================= */}

//                 {paymentMode === "M" && (
//                   <Box
//                     sx={{
//                       mt: 1,
//                       p: 1,
//                       border: "1px solid #e0e0e0",
//                       borderRadius: 2,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontWeight: 700,
//                         mb: 1,
//                       }}
//                     >
//                       Mix Payment
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                       }}
//                     >
//                       <TextField
//                         label="Cash Amount"
//                         type="number"
//                         value={cashAmount}
//                         onChange={handleCashAmountChange}
//                         size="small"
//                         fullWidth
//                         inputProps={{
//                           min: 0,
//                           onWheel: preventNumberInputScroll,
//                         }}
//                       />

//                       <TextField
//                         label="Online Amount"
//                         type="number"
//                         value={onlineAmount}
//                         onChange={handleOnlineAmountChange}
//                         size="small"
//                         fullWidth
//                         inputProps={{
//                           min: 0,
//                           onWheel: preventNumberInputScroll,
//                         }}
//                       />
//                     </Box>
//                   </Box>
//                 )}
//               </Grid>

//               {/* ================================================= */}
//               {/* AMOUNT SUMMARY - FULL WIDTH BELOW PAYMENT */}
//               {/* ================================================= */}

//               <Grid
//                 item
//                 xs={12}
//                 md={12}
//                 sx={{
//                   width: "100%",
//                   minWidth: 0,
//                 }}
//               >
//                 <Paper
//                   elevation={4}
//                   sx={{
//                     width: "100%",
//                     p: 2,
//                     mt: 1,
//                     borderRadius: 2,
//                     border: "1px solid #e0e0e0",
//                     backgroundColor: "#ffffff",
//                     boxSizing: "border-box",
//                   }}
//                 >
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       fontWeight: 800,
//                       color: "#1976d2",
//                       mb: 1.5,
//                       fontSize: "22px",
//                     }}
//                   >
//                     Amount Summary
//                   </Typography>

//                   {/* ================================================= */}
//                   {/* SUMMARY FIRST ROW */}
//                   {/* ================================================= */}

//                   <Grid container spacing={2} alignItems="center">
//                     {/* SUBTOTAL */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "16px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Subtotal
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontSize: "18px",
//                             fontWeight: 700,
//                           }}
//                         >
//                           ₹ {Number(subTotalcal || 0).toFixed(2)}
//                         </Typography>
//                       </Box>
//                     </Grid>

//                     {/* DISCOUNT */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "16px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Discount
//                         </Typography>

//                         <TextField
//                           inputRef={discountRef}
//                           size="small"
//                           type="number"
//                           value={discount}
//                           onChange={(e) => {
//                             const value = e.target.value;

//                             if (value === "" || Number(value) >= 0) {
//                               setDiscount(value);
//                             }
//                           }}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               e.stopPropagation();

//                               setTimeout(() => {
//                                 receivedAmountRef.current?.focus();
//                                 receivedAmountRef.current?.select();
//                               }, 50);
//                             }
//                           }}
//                           placeholder="0.00"
//                           sx={{
//                             width: 120,
//                             "& input": {
//                               textAlign: "right",
//                               fontSize: "15px",
//                             },
//                           }}
//                           inputProps={{
//                             min: 0,
//                             onWheel: preventNumberInputScroll,
//                           }}
//                         />
//                       </Box>
//                     </Grid>

//                     {/* TOTAL */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "20px",
//                             fontWeight: 700,
//                           }}
//                         >
//                           Total
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontSize: "25px",
//                             fontWeight: 800,
//                             color: "#1976d2",
//                           }}
//                         >
//                           ₹ {Number(total || 0).toFixed(2)}
//                         </Typography>
//                       </Box>
//                     </Grid>

//                     {/* RECEIVED */}

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "16px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Received Amount
//                         </Typography>

//                         <TextField
//                           inputRef={receivedAmountRef}
//                           size="small"
//                           type="number"
//                           value={receivedAmount}
//                           onChange={handleReceivedAmountChange}
//                           onKeyDown={(e) => {
//                             // existing code
//                           }}
//                           inputProps={{
//                             min: 0,
//                             onWheel: preventNumberInputScroll,
//                           }}
//                         />
//                       </Box>
//                     </Grid>
//                   </Grid>

//                   {/* ================================================= */}
//                   {/* PAYMENT STATUS - EXISTING LOGIC */}
//                   {/* ================================================= */}

//                   <Divider
//                     sx={{
//                       mt: 1.5,
//                       mb: 1.5,
//                     }}
//                   />

//                   {isPaid ? (
//                     <Box
//                       sx={{
//                         p: 1.5,
//                         borderRadius: 2,
//                         backgroundColor: "#e8f5e9",
//                         border: "1px solid #a5d6a7",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "18px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         Paid
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontSize: "20px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         ₹ {Number(grandTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   ) : received > grandTotal ? (
//                     <Box
//                       sx={{
//                         p: 1.5,
//                         borderRadius: 2,
//                         backgroundColor: "#e8f5e9",
//                         border: "1px solid #a5d6a7",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "18px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         Refund
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontSize: "20px",
//                           fontWeight: 800,
//                           color: "#087f23",
//                         }}
//                       >
//                         ₹ {(received - grandTotal).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box
//                       sx={{
//                         p: 1.5,
//                         borderRadius: 2,
//                         backgroundColor: "#ffebee",
//                         border: "1px solid #ef9a9a",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "18px",
//                           fontWeight: 800,
//                           color: "#d32f2f",
//                         }}
//                       >
//                         Balance Due
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontSize: "20px",
//                           fontWeight: 800,
//                           color: "#d32f2f",
//                         }}
//                       >
//                         ₹ {Math.max(grandTotal - received, 0).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Paper>
//               </Grid>
//             </Grid>

//             {/* ===================================================== */}
//             {/* BUTTONS */}
//             {/* ===================================================== */}

//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               gap={2}
//               sx={{
//                 mt: 1,
//                 minHeight: "48px",
//               }}
//             >
//               {/* SAVE / UPDATE */}

//               <Button
//                 variant="contained"
//                 disabled={isSaving}
//                 onClick={(e) => handleSubmit(e, false)}
//                 sx={{
//                   background: "var(--primary-color)",
//                   minWidth: "105px",
//                   height: "42px",

//                   "&:hover": {
//                     background: "var(--primary-color)",
//                   },

//                   "&:disabled": {
//                     background: "#9e9e9e",
//                     color: "#ffffff",
//                     cursor: "not-allowed",
//                   },
//                 }}
//               >
//                 {isSaving ? (
//                   <>
//                     <CircularProgress
//                       size={20}
//                       thickness={4}
//                       sx={{
//                         color: "#ffffff",
//                         mr: 1,
//                       }}
//                     />
//                     Saving...
//                   </>
//                 ) : isEditing ? (
//                   "Update"
//                 ) : (
//                   "Save"
//                 )}
//               </Button>

//               <Button
//                 sx={{
//                   background: "var(--complementary-color)",
//                   minWidth: "105px",

//                   "&:disabled": {
//                     background: "#9e9e9e",
//                     color: "#ffffff",
//                   },
//                 }}
//                 onClick={(e) => handleSubmit(e, true)}
//                 variant="contained"
//                 startIcon={
//                   isSaving ? (
//                     <CircularProgress
//                       size={18}
//                       thickness={4}
//                       sx={{
//                         color: "#ffffff",
//                       }}
//                     />
//                   ) : (
//                     <PrintIcon />
//                   )
//                 }
//                 disabled={isSaving}
//               >
//                 {isSaving ? "Saving..." : "Print"}
//               </Button>

//               {/* CANCEL */}

//               <Button
//                 sx={{
//                   borderColor: "var(--complementary-color)",
//                   color: "var(--complementary-color)",
//                 }}
//                 onClick={handleDrawerClose}
//                 variant="outlined"
//               >
//                 <b>Cancel</b>
//               </Button>

//               {/* DELETE */}

//               {isEditing && (
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleClickOpen}
//                 >
//                   Delete
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </Drawer>
//       </Box>
//     </Box>
//   );
// };

// export default SalesEntry;
































































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
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import MinimizeIcon from "@mui/icons-material/Minimize";
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
import Tooltip from "@mui/material/Tooltip";
import RemoveIcon from "@mui/icons-material/Remove";

import amrutLogo from "../imgs/amrutlogo.png";
import fremilaLogo from "../imgs/fremilalogo.png";

const SalesEntry = () => {
  const customerDropdownRef = useRef(null);
  // =====================================================
  // PREVENT MOUSE WHEEL FROM CHANGING NUMBER INPUT VALUE
  // =====================================================
  const preventNumberInputScroll = (event) => {
    event.currentTarget.blur();
  };

  // =====================================================
  // THIS SCREEN IS ONLY FOR REGULAR / RETAILER CUSTOMERS
  // R = Regular / Retailer
  // =====================================================
  const PAGE_CUSTOMER_TYPE = "R";

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState([]);
  const [invoiceHistoryStatus, setInvoiceHistoryStatus] = useState({});
  const [rows, setRows] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [productOptions, setProductOptions] = useState([]);

  // =====================================================
  // GET PRODUCT NAME FROM PRODUCT ID
  // =====================================================
  const getProductNameById = (productId) => {
    if (productId === null || productId === undefined || productId === "") {
      return "-";
    }

    const matchedProduct = productOptions.find((product) => {
      return (
        String(product?.value) === String(productId) ||
        String(product?.Id) === String(productId) ||
        String(product?.ProductId) === String(productId)
      );
    });

    return matchedProduct?.label || matchedProduct?.ProductName || "-";
  };

  // =====================================================
  // FORMAT HISTORY DATE SAFELY
  // Handles API date object + string + null
  // =====================================================
  const formatHistoryDate = (value) => {
    if (!value) {
      return "-";
    }

    // API sometimes returns:
    // { date: "...", timezone_type: 3, timezone: "..." }
    if (typeof value === "object") {
      value = value?.date || value?.Date || value?.value || "";
    }

    if (!value) {
      return "-";
    }

    const parsed = moment(value);

    if (!parsed.isValid()) {
      return "-";
    }

    return parsed.format("DD/MM/YYYY");
  };

  // =====================================================
  // INVOICE EDIT HISTORY
  // =====================================================

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [selectedHistoryInvoice, setSelectedHistoryInvoice] = useState(null);

  const [historyHeader, setHistoryHeader] = useState([]);
  const [historyDetails, setHistoryDetails] = useState([]);

  const [currentHistoryHeader, setCurrentHistoryHeader] = useState(null);

  const [currentHistoryDetails, setCurrentHistoryDetails] = useState([]);

  // NEW
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState(null);

  const [selectedHistoryDetails, setSelectedHistoryDetails] = useState([]);

  const [newCustomerAddress, setNewCustomerAddress] = useState("");

 const [minimizedBills, setMinimizedBills] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("minimizedRegularBills") || "[]"
    );
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem(
    "minimizedRegularBills",
    JSON.stringify(minimizedBills)
  );
}, [minimizedBills]);

  // =====================================================
  // SELECT HISTORY VERSION
  // =====================================================

  const handleHistoryVersionClick = (historyItem) => {
    if (!historyItem) {
      return;
    }

    const version = Number(historyItem?.VersionNo);

    if (!version) {
      toast.error("Version not found.");
      return;
    }

    // console.log("======================================");
    // console.log("HISTORY VERSION CLICK");
    // console.log("Invoice No:", historyItem?.InvoiceNo);
    // console.log("Invoice ID:", historyItem?.InvoiceId);
    // console.log("Version:", version);
    // console.log("======================================");

    // Selected version
    setSelectedHistoryVersion(version);

    // Find all product details belonging to this version
    const versionDetails = historyDetails.filter(
      (detail) => Number(detail?.VersionNo) === version,
    );

    // console.log("SELECTED VERSION DETAILS:", versionDetails);

    setSelectedHistoryDetails(versionDetails);
  };

  const fetchCurrentInvoiceForHistory = async (invoiceId) => {
    try {
      // ==========================================
      // CURRENT HEADER
      // ==========================================
      const headerResponse = await axios.get(
        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
      );

      const headerData = headerResponse.data;

      const currentHeader = Array.isArray(headerData)
        ? headerData[0] || null
        : Array.isArray(headerData?.data)
          ? headerData.data[0] || null
          : headerData?.data || headerData || null;

      // ==========================================
      // CURRENT DETAILS
      // ==========================================
      const detailResponse = await axios.get(
        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
      );

      const detailData = detailResponse.data;

      const currentDetails = Array.isArray(detailData)
        ? detailData
        : Array.isArray(detailData?.data)
          ? detailData.data
          : detailData?.data
            ? [detailData.data]
            : detailData
              ? [detailData]
              : [];

      setCurrentHistoryHeader(currentHeader);
      setCurrentHistoryDetails(currentDetails);

      return {
        header: currentHeader,
        details: currentDetails,
      };
    } catch (error) {
      console.error("CURRENT INVOICE HISTORY FETCH ERROR:", error);

      throw error;
    }
  };

  const handleInvoiceHistoryClick = async (invoice) => {
    try {
      const invoiceId = invoice?.Id || invoice?.InvoiceId;

      if (!invoiceId) {
        toast.error("Invoice ID not found.");
        return;
      }

      // console.log("======================================");
      // console.log("INVOICE HISTORY CLICK");
      // console.log("Invoice ID:", invoiceId);
      // console.log("======================================");

      setSelectedHistoryInvoice(invoice);
      setHistoryOpen(true);
      setHistoryLoading(true);
      setSelectedHistoryVersion(null);
      setSelectedHistoryDetails([]);

      // =================================================
      // 1. OLD HEADER HISTORY
      // =================================================
      const headerResponse = await axios.get(
        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
      );

      // console.log("OLD HEADER HISTORY:", headerResponse.data);

      const headerData = headerResponse.data;

      const oldHeaders = Array.isArray(headerData)
        ? headerData
        : Array.isArray(headerData?.data)
          ? headerData.data
          : headerData?.data
            ? [headerData.data]
            : headerData
              ? [headerData]
              : [];

      setHistoryHeader(oldHeaders);

      // =================================================
      // 2. OLD DETAIL HISTORY
      // =================================================
      const detailResponse = await axios.get(
        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
      );

      // console.log("OLD DETAIL HISTORY:", detailResponse.data);

      const detailData = detailResponse.data;

      const oldDetails = Array.isArray(detailData)
        ? detailData
        : Array.isArray(detailData?.data)
          ? detailData.data
          : detailData?.data
            ? [detailData.data]
            : detailData
              ? [detailData]
              : [];

      setHistoryDetails(oldDetails);

      // =================================================
      // 3. CURRENT INVOICE
      // =================================================
      await fetchCurrentInvoiceForHistory(invoiceId);

      // =================================================
      // DEFAULT PREVIOUS VERSION
      // =================================================

      if (oldHeaders.length > 0) {
        const latestVersionItem = [...oldHeaders].sort(
          (a, b) => Number(b?.VersionNo || 0) - Number(a?.VersionNo || 0),
        )[0];

        const latestVersion = Number(latestVersionItem?.VersionNo);

        if (latestVersion) {
          setSelectedHistoryVersion(latestVersion);

          const latestVersionDetails = oldDetails.filter(
            (detail) => Number(detail?.VersionNo) === latestVersion,
          );

          setSelectedHistoryDetails(latestVersionDetails);
        }
      }
    } catch (error) {
      console.error("INVOICE HISTORY ERROR:", error);

      toast.error("Unable to load invoice history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const getTodayDate = () => {
    const today = new Date();

    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const [financialYearFromDate, setFinancialYearFromDate] = useState("");
  const [financialYearToDate, setFinancialYearToDate] = useState("");

  const filteredInvoiceData = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return invoiceheaders.filter((invoice) => {
     
      // ==============================
      // BILL / INVOICE NO
      // ==============================
      const billNo = String(
        invoice?.InvoiceNo ||
          invoice?.InvoiceNumber ||
          invoice?.BillNo ||
          invoice?.BillNumber ||
          invoice?.Id ||
          "",
      ).toLowerCase();

      // ==============================
      // CUSTOMER NAME
      // ==============================
      const customerName = String(
        invoice?.accountDetails?.AccountName || "",
      ).toLowerCase();

      // ==============================
      // CATEGORY
      // ==============================
      const accountId = Number(invoice?.AccountId || 0);

      const customerType = String(
        invoice?.addressDetails?.CustomerType ||
          invoice?.addressDetails?.customerType ||
          invoice?.accountDetails?.CustomerType ||
          invoice?.accountDetails?.customerType ||
          invoice?.CustomerType ||
          invoice?.customerType ||
          "",
      )
        .trim()
        .toUpperCase();

      // =====================================================
      // SALES ENTRY = REGULAR
      //
      // AccountId = 0 → Regular
      // CustomerType = R → Regular
      // D/C → Not Regular
      // =====================================================

      const isRegular = accountId === 0 || customerType === "R";

      if (!isRegular) {
        return false;
      }

      let categoryName = "";

      if (accountId === 0 || customerType === "R") {
        categoryName = "regular";
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
        categoryFilter === "" || customerType === categoryFilter;

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
        fromDate === "" || (invoiceDate !== "" && invoiceDate >= fromDate);

      // ==============================
      // TO DATE FILTER
      // ==============================
      const toDateMatch =
        toDate === "" || (invoiceDate !== "" && invoiceDate <= toDate);

      // ==============================
      // ALL FILTERS MUST MATCH
      // ==============================
      return categoryMatch && searchMatch && fromDateMatch && toDateMatch;
    });
  }, [invoiceheaders, searchText, categoryFilter, fromDate, toDate]);

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

        // Open Regular Sales Entry
        setIsDrawerOpen(true);

        // Reset form for new bill
        resetForm();
        setIsEditing(false);
        setOpen(false);

        // Focus directly on Select Product
        setTimeout(() => {
          productRef.current?.focus();
          setProductDropdownOpen(true);
        }, 300);

        return;
      }

      // ==================================================
      // D = SALES DEALER
      // ==================================================

      if (event.key?.toLowerCase() === "d") {
        event.preventDefault();
        event.stopPropagation();

        // console.log("D pressed - Opening Dealer Bill Entry");

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

        // console.log("C pressed - Opening Caterers Bill Entry");

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

  const fetchInvoiceHeader = async (
    selectedFromDate = fromDate,
    selectedToDate = toDate,
  ) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    // 1. Format dates for API
    const formatDateForAPI = (value) => {
      if (!value) return "";

      if (value instanceof Date) {
        if (isNaN(value.getTime())) return "";

        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      }

      const str = String(value).trim();

      if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
        return str.substring(0, 10);
      }

      const dmyMatch = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);

      if (dmyMatch) {
        return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
      }

      const parsedDate = new Date(value);

      if (isNaN(parsedDate.getTime())) return "";

      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const formattedFromDate = formatDateForAPI(selectedFromDate);
    const formattedToDate = formatDateForAPI(selectedToDate);

    if (
      !formattedFromDate ||
      !formattedToDate ||
      formattedFromDate > formattedToDate
    ) {
      console.warn("Invalid invoice date range:", {
        formattedFromDate,
        formattedToDate,
      });

      setInvoiceheaders([]);
      return;
    }

    // 2. Normalize array responses
    const getArrayData = (result) => {
      if (Array.isArray(result)) return result;
      if (Array.isArray(result?.data)) return result.data;
      if (Array.isArray(result?.Data)) return result.Data;

      return [];
    };

    // 3. Normalize single-record responses
    const normalizeSingleRecord = (result) => {
      if (Array.isArray(result)) return result[0] || null;
      if (Array.isArray(result?.data)) return result.data[0] || null;
      if (Array.isArray(result?.Data)) return result.Data[0] || null;

      if (result?.data && typeof result.data === "object") {
        return result.data;
      }

      if (result?.Data && typeof result.Data === "object") {
        return result.Data;
      }

      return result && typeof result === "object" ? result : null;
    };

    // 4. Fetch JSON safely
    const fetchJSON = async (url) => {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(
          `API failed: ${response.status} ${response.statusText} - ${url}`,
        );
      }

      return response.json();
    };

    try {
      // 5. Generate date list
      const getDateList = (startDate, endDate) => {
        const dates = [];
        const current = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);

        while (!isNaN(current.getTime()) && current <= end) {
          const year = current.getFullYear();
          const month = String(current.getMonth() + 1).padStart(2, "0");
          const day = String(current.getDate()).padStart(2, "0");

          dates.push(`${year}-${month}-${day}`);
          current.setDate(current.getDate() + 1);
        }

        return dates;
      };

      const selectedDates = getDateList(formattedFromDate, formattedToDate);

      // 6. Fetch invoice pages for one date
      const fetchInvoicesForDate = async (selectedDate) => {
        const getPageUrl = (page) =>
          `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}&InvoiceDate=${encodeURIComponent(selectedDate)}`;

        const firstResult = await fetchJSON(getPageUrl(1));

        const totalPages = Math.max(
          1,
          Number(
            firstResult?.total_pages ??
              firstResult?.TotalPages ??
              firstResult?.pages ??
              1,
          ) || 1,
        );

        const invoices = [...getArrayData(firstResult)];

        // Fetch remaining pages only when required
        if (totalPages > 1) {
          const pageResults = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) => index + 2).map(
              async (page) => {
                const result = await fetchJSON(getPageUrl(page));
                return getArrayData(result);
              },
            ),
          );

          pageResults.forEach((pageData) => {
            invoices.push(...pageData);
          });
        }

        return invoices;
      };

      // 7. Fetch dates in small batches
      const allInvoiceData = [];
      const DATE_BATCH_SIZE = 3;

      for (
        let index = 0;
        index < selectedDates.length;
        index += DATE_BATCH_SIZE
      ) {
        const dateBatch = selectedDates.slice(index, index + DATE_BATCH_SIZE);

        const batchResults = await Promise.all(
          dateBatch.map((date) => fetchInvoicesForDate(date)),
        );

        batchResults.forEach((invoices) => {
          allInvoiceData.push(...invoices);
        });
      }

      // 8. Remove duplicate invoices
      const invoiceMap = new Map();

      allInvoiceData.forEach((invoice) => {
        if (invoice?.Id !== undefined && invoice?.Id !== null) {
          invoiceMap.set(String(invoice.Id), invoice);
        }
      });

      const uniqueInvoices = Array.from(invoiceMap.values());

      // 9. Filter invoices by date range
      const filteredInvoices = uniqueInvoices.filter((invoice) => {
        let rawDate = invoice?.InvoiceDate;

        if (rawDate && typeof rawDate === "object") {
          rawDate = rawDate.date || rawDate.Date || "";
        }

        const invoiceDate = String(rawDate || "").substring(0, 10);

        return (
          invoiceDate >= formattedFromDate && invoiceDate <= formattedToDate
        );
      });

      // 10. Get unique customer IDs
      const accountIds = [
        ...new Set(
          filteredInvoices
            .map((invoice) => Number(invoice?.AccountId || 0))
            .filter((id) => Number.isFinite(id) && id > 0),
        ),
      ];

      // 11. Fetch Account and Address details in batches
      const accountCache = new Map();
      const ACCOUNT_BATCH_SIZE = 5;

      for (
        let index = 0;
        index < accountIds.length;
        index += ACCOUNT_BATCH_SIZE
      ) {
        const accountBatch = accountIds.slice(
          index,
          index + ACCOUNT_BATCH_SIZE,
        );

        await Promise.all(
          accountBatch.map(async (accountId) => {
            const accountUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(accountId)}`;

            const addressUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(accountId)}`;

            const [accountResult, addressResult] = await Promise.allSettled([
              fetchJSON(accountUrl),
              fetchJSON(addressUrl),
            ]);

            const accountDetails =
              accountResult.status === "fulfilled"
                ? normalizeSingleRecord(accountResult.value)
                : null;

            const addressDetails =
              addressResult.status === "fulfilled"
                ? normalizeSingleRecord(addressResult.value)
                : null;

            if (accountResult.status === "rejected") {
              console.error(
                `Account API failed for AccountId ${accountId}:`,
                accountResult.reason,
              );
            }

            if (addressResult.status === "rejected") {
              console.error(
                `Address API failed for AccountId ${accountId}:`,
                addressResult.reason,
              );
            }

            accountCache.set(accountId, {
              accountDetails,
              addressDetails,
            });
          }),
        );
      }

      // 12. Attach customer details
      const invoicesWithDetails = filteredInvoices.map((invoice) => {
        const accountId = Number(invoice?.AccountId || 0);
        const cached = accountCache.get(accountId) || {};

        const accountDetails = cached.accountDetails || {};
        const addressDetails = cached.addressDetails || null;

        const customerType = String(
          addressDetails?.CustomerType ??
            addressDetails?.customerType ??
            accountDetails?.CustomerType ??
            accountDetails?.customerType ??
            invoice?.CustomerType ??
            invoice?.customerType ??
            "",
        )
          .trim()
          .toUpperCase();

        return {
          ...invoice,
          accountDetails: {
            ...accountDetails,
            CustomerType: customerType,
          },
          addressDetails,
        };
      });

      // 13. Keep Regular / Retailer invoices only
      const regularInvoices = invoicesWithDetails.filter((invoice) => {
        const accountId = Number(invoice?.AccountId || 0);

        const customerType = String(
          invoice?.addressDetails?.CustomerType ??
            invoice?.addressDetails?.customerType ??
            invoice?.accountDetails?.CustomerType ??
            invoice?.accountDetails?.customerType ??
            invoice?.CustomerType ??
            invoice?.customerType ??
            "",
        )
          .trim()
          .toUpperCase();

        return accountId === 0 || customerType === "R";
      });

      // 14. Update invoice table
      setInvoiceheaders(regularInvoices);

      // IMPORTANT:
      // Do not call checkInvoiceHistory(regularInvoices) here.
      // This avoids automatically starting per-invoice history GET requests.
      // History status will not be automatically refreshed by this function.
    } catch (error) {
      console.error("Error fetching invoice headers:", error);
      toast.error("Unable to refresh invoice list.");

      // Avoid clearing the existing table if a refresh request fails.
    }
  };

  const checkInvoiceHistory = async (invoiceList) => {
    try {
      const historyStatus = {};

      await Promise.all(
        invoiceList.map(async (invoice) => {
          const invoiceId = invoice?.Id;

          if (!invoiceId) {
            return;
          }

          try {
            const response = await axios.get(
              `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
            );

            const data = response.data;

            const historyList = Array.isArray(data)
              ? data
              : Array.isArray(data?.data)
                ? data.data
                : data?.data
                  ? [data.data]
                  : data
                    ? [data]
                    : [];

            historyStatus[invoiceId] = historyList.length > 0;
          } catch (error) {
            console.error(
              `History check failed for InvoiceId ${invoiceId}:`,
              error,
            );

            historyStatus[invoiceId] = false;
          }
        }),
      );

      // console.log("INVOICE HISTORY STATUS:", historyStatus);

      setInvoiceHistoryStatus(historyStatus);
    } catch (error) {
      console.error("History status error:", error);
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
  resetForm();
  setIsEditing(false);
  setEditId("");
  setOpen(false);
  setIsDrawerOpen(true);
};

  // ======================================================
  // MINIMIZE CURRENT SALES BILL
  // ======================================================


const handleMinimizeBill = () => {
  try {
    // Create a unique ID for each new bill
    const draftId =
      isEditing && editId
        ? `edit-${editId}`
        : `new-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`;

    // Capture the current form data
    const draftBill = {
      draftId,

      // Edit information
      isEditing,
      editId: editId || null,

      // Invoice information
      invoiceNo,
      invoiceDate,
      device,

      // Customer information
      customerName,
      phone,
      selectedAccount,
      accountDetails,

      // Product details
      rows: Array.isArray(rows) ? rows : [],
      selectedProductID,
      productName,
      selectedProductName,
      quantity,
      rate,
      amount,

      // Payment information
      paymentMode,
      cashAmount,
      onlineAmount,
      receivedAmount,

      // Amount details
      discount,
      transport,

      // Other details
      isGST,
      billFor,
      machineID,
      editingRow,

      // Minimized timestamp
      minimizedAt: new Date().toISOString(),
    };

    // Create an independent snapshot of the bill
    const independentDraft = JSON.parse(
      JSON.stringify(draftBill)
    );

    console.log(
      "Minimizing bill:",
      independentDraft.draftId,
      independentDraft.rows
    );

    // Add the new draft or update the matching draft
    setMinimizedBills((prev) => {
      const existingIndex = prev.findIndex(
        (bill) =>
          bill.draftId === independentDraft.draftId
      );

      if (existingIndex !== -1) {
        const updatedBills = [...prev];
        updatedBills[existingIndex] = independentDraft;
        return updatedBills;
      }

      return [...prev, independentDraft];
    });

    // Close the drawer without resetting the form
    setIsDrawerOpen(false);
    setShowDropdown(false);

    toast.success("Sales bill minimized successfully.");
  } catch (error) {
    console.error("Error minimizing sales bill:", error);
    toast.error("Unable to minimize sales bill.");
  }
};




const handleResumeBill = (billId) => {
  try {
    console.log("========== RESUME BILL START ==========");
    console.log("Clicked Bill ID:", billId);

    // Find the exact minimized bill
    const bill = minimizedBills.find(
      (item) => String(item.draftId) === String(billId)
    );

    console.log(
      "Available Drafts:",
      minimizedBills.map((item) => ({
        draftId: item.draftId,
        products: (item.rows || []).map((row) => ({
          ProductId: row.ProductId,
          ProductName: row.ProductName,
          Rate: row.Rate,
        })),
      }))
    );

    if (!bill) {
      console.error("Minimized bill not found:", billId);
      toast.error("Minimized bill not found.");
      return;
    }

    console.log("Selected Draft ID:", bill.draftId);
    console.log("Selected Draft Data:", bill);

    // Create an independent copy of the selected bill's rows
    const restoredRows = JSON.parse(
      JSON.stringify(Array.isArray(bill.rows) ? bill.rows : [])
    );

    console.table(
      restoredRows.map((row) => ({
        ProductId: row.ProductId,
        ProductName: row.ProductName,
        Quantity: row.Quantity,
        Rate: row.Rate,
        Amount: row.Amount,
      }))
    );

    // Restore invoice information
    setInvoiceNo(bill.invoiceNo ?? "");
    setInvoiceDate(
      bill.invoiceDate || moment().format("YYYY-MM-DD")
    );
    setDevice(bill.device ?? "");

    // Restore customer information
    setSelectedAccount(bill.selectedAccount ?? "");
    setCustomerName(bill.customerName ?? "");
    setPhone(bill.phone ?? "");

    setAccountDetails(
      bill.accountDetails ?? {
        AccountName: "",
        Address1: "",
        Address2: "",
        Address3: "",
        GSTNo: "",
      }
    );

    // Restore product table rows
    setRows(restoredRows);

    // Restore current product entry
    setSelectedProductId(bill.selectedProductID ?? "");
    setProductName(bill.productName ?? "");
    setSelectedProductName(bill.selectedProductName ?? "");
    setQuantity(bill.quantity ?? "");
    setRate(bill.rate ?? "");
    SetAmount(bill.amount ?? "");
    setEditingRow(bill.editingRow ?? null);

    // Restore payment information
    setPaymentMode(bill.paymentMode ?? "");
    setCashAmount(bill.cashAmount ?? "");
    setOnlineAmount(bill.onlineAmount ?? "");
    setReceivedAmount(bill.receivedAmount ?? "");

    // Restore amount details
    setDiscount(bill.discount ?? "");
    setTransport(bill.transport ?? "");

    // Restore GST and additional information
    setIsGST(bill.isGST ?? false);
    setBillFor(bill.billFor ?? "");
    setMachineID(bill.machineID ?? "");

    // Restore edit information
    setIsEditing(Boolean(bill.isEditing));
    setEditId(bill.editId ?? "");

    // Remove only the selected draft
    setMinimizedBills((prev) =>
      prev.filter(
        (item) => String(item.draftId) !== String(bill.draftId)
      )
    );

    setShowDropdown(false);
    setIsDrawerOpen(true);

    console.log("Restored Bill ID:", bill.draftId);
    console.log("Restored Product Rows:", restoredRows);
    console.log("========== RESUME BILL END ==========");

    toast.success("Minimized bill resumed successfully.");
  } catch (error) {
    console.error("Error resuming minimized bill:", error);
    toast.error("Unable to resume minimized bill.");
  }
};




const handleRemoveMinimizedBill = (billId) => {
  try {
    setMinimizedBills((prev) =>
      prev.filter(
        (item) => String(item.draftId) !== String(billId)
      )
    );

    toast.success("Minimized bill removed.");
  } catch (error) {
    console.error("Error removing minimized bill:", error);
    toast.error("Unable to remove minimized bill.");
  }
};


  const handleDrawerClose = async () => {
    setIsDrawerOpen(false);
    setShowDropdown(false);
    resetForm();

   
    await fetchInvoiceHeader();
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

      // console.log("====================================");
      // console.log("DELETE SALES ENTRY");
      // console.log("DELETE INVOICE ID:", deleteId);
      // console.log("====================================");

      // ==========================================
      // 2. DELETE INVOICE HEADER
      // ==========================================
      const deleteUrl =
        `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
        `?Table=invoiceheader&Id=${encodeURIComponent(deleteId)}`;

      // console.log("DELETE URL:", deleteUrl);

      const response = await fetch(deleteUrl, {
        method: "GET",
        redirect: "follow",
      });

      const resultText = await response.text();

      // console.log("DELETE API STATUS:", response.status);
      // console.log("DELETE API RESPONSE:", resultText);

      // ==========================================
      // 3. CHECK API RESPONSE
      // ==========================================
      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}`);
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

      toast.error(error?.message || "Unable to delete Sales Entry.");
    }
  };

  const [editId, setEditId] = useState("");

  // =====================================================
  // UPDATE / EDIT FORM
  // =====================================================

  const handleEdit = async (row) => {
    try {
      // // console.log("========== INVOICE EDIT START ==========");

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
      const invoiceId = originalData.Id || originalData.InvoiceId;

      if (!invoiceId) {
        console.error("Invoice ID not found:", originalData);
        toast.error("Invoice ID not found.");
        return;
      }

      // // console.log("EDIT INVOICE ID:", invoiceId);

      // -------------------------------------------------
      // 3. FIND INVOICE HEADER
      // -------------------------------------------------
      let invheader = invoiceheaders.find(
        (item) => String(item.Id) === String(invoiceId),
      );

      // If header is not found in invoiceheaders,
      // use the selected table row
      if (!invheader) {
        invheader = originalData;
      }

      if (!invheader) {
        console.error("Invoice header not found.");
        toast.error("Invoice header not found.");
        return;
      }

      // // console.log("EDIT INVOICE HEADER:", invheader);

      // =================================================
      // 3A. ONLY TODAY'S INVOICE CAN BE EDITED
      // =================================================

      const rawInvoiceDate =
        typeof invheader.InvoiceDate === "object"
          ? invheader.InvoiceDate?.date
          : invheader.InvoiceDate;

      if (!rawInvoiceDate) {
        toast.error("Invoice date not found.");
        return;
      }

      // Convert invoice date to YYYY-MM-DD
      const invoiceDateText = String(rawInvoiceDate)
        .split(" ")[0]
        .split("T")[0];

      // Today's date
      const todayDate = moment().format("YYYY-MM-DD");

      // // console.log("INVOICE DATE:", invoiceDateText);
      // // console.log("TODAY DATE:", todayDate);

      // Old invoice -> DO NOT ALLOW EDIT
      if (invoiceDateText !== todayDate) {
        toast.error("Only today's invoice can be edited.");
        return;
      }

      // =================================================
      // TODAY'S INVOICE -> CONTINUE EDIT
      // =================================================

      // -------------------------------------------------
      // 4. GET SAVED INVOICE DETAILS
      // -------------------------------------------------
      const detailResponse = await axios.get(
        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
      );

      // // console.log("EDIT INVOICE DETAIL RESPONSE:", detailResponse.data);

      // -------------------------------------------------
      // 5. NORMALIZE DETAIL RESPONSE
      // -------------------------------------------------
      const detailData = detailResponse.data;

      const invdetail = Array.isArray(detailData)
        ? detailData
        : Array.isArray(detailData?.data)
          ? detailData.data
          : detailData?.data
            ? [detailData.data]
            : detailData
              ? [detailData]
              : [];

      // // console.log("EDIT SAVED DETAILS:", invdetail);

      // -------------------------------------------------
      // 6. MAP SAVED PRODUCTS
      // -------------------------------------------------
      const mappedRows = invdetail.map((detail) => {
        const matchedProduct = productOptions.find(
          (option) => String(option.value) === String(detail.ProductId),
        );

        const quantity = parseFloat(detail.Quantity) || 0;

        const rate = parseFloat(detail.Rate) || 0;

        const amount =
          detail.Amount != null
            ? parseFloat(detail.Amount) || 0
            : quantity * rate;

        return {
          Id: detail.Id,

          InvoiceId: detail.InvoiceId || invoiceId,

          ProductId: detail.ProductId,

          ProductName: detail.ProductName || matchedProduct?.label || "",

          Quantity: quantity,

          Rate: rate,

          Amount: amount,

          // Backend fields
          // Keep these because save/update may need them

          CGSTPercentage: detail.CGSTPercentage ?? 0,

          CGSTAmount: detail.CGSTAmount ?? 0,

          SGSTPercentage: detail.SGSTPercentage ?? 0,

          SGSTAmount: detail.SGSTAmount ?? 0,

          IGSTPercentage: detail.IGSTPercentage ?? 0,

          IGSTAmount: detail.IGSTAmount ?? 0,

          DiscountAmt: detail.DiscountAmt ?? 0,
        };
      });

      // // console.log("EDIT MAPPED ROWS:", mappedRows);

      // -------------------------------------------------
      // 7. SET EDIT MODE
      // -------------------------------------------------
      setEditId(invoiceId);

      setIsEditing(true);

      // -------------------------------------------------
      // 8. SET INVOICE HEADER VALUES
      // -------------------------------------------------
      setInvoiceNo(invheader.InvoiceNo || "");

      setPhone(invheader.ContactNo || "");

      setDevice(getDeviceForLoggedInUser());

      setBillFor(invheader.BillFor || "");

      // MachineId / MachineID
      const machineValue = invheader.MachineID ?? invheader.MachineId ?? "";

      setMachineID(machineValue !== "" ? String(machineValue) : "");

      // IsGST / ISGST
      const gstValue = invheader.IsGST ?? invheader.ISGST ?? 0;

      setIsGST(Number(gstValue) === 1);

      // -------------------------------------------------
      // 9. INVOICE DATE
      // -------------------------------------------------
      setInvoiceDate(invoiceDateText);

      // -------------------------------------------------
      // 10. CUSTOMER
      // -------------------------------------------------
      if (invheader.AccountId) {
        setSelectedAccount(invheader.AccountId);

       

        try {
          const customerResponse = await fetch(
            `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invheader.AccountId}`,
          );

          const customerResult = await customerResponse.json();

          const customerData = Array.isArray(customerResult)
            ? customerResult[0]
            : customerResult?.data || customerResult;

          const actualCustomerName =
            customerData?.AccountName || customerData?.accountName || "";

          setCustomerName(actualCustomerName);

          setAccountDetails((prev) => ({
            ...prev,
            AccountName: actualCustomerName,
          }));
        } catch (error) {
          console.error("Customer Name fetch error:", error);

          setCustomerName("");
        }

        // Address + GST
        await fetchAccounts(invheader.AccountId);

        // Existing function
        fetchAccountName(invheader.AccountId);
      } else {
        setSelectedAccount("");
        setCustomerName("");
      }

      // -------------------------------------------------
      // 11. PAYMENT DETAILS
      // -------------------------------------------------
      setPaymentMode(invheader.PaymentMode || "");

      setCashAmount(
        invheader.CashAmount != null ? String(invheader.CashAmount) : "",
      );

      setOnlineAmount(
        invheader.OnlineAmount != null ? String(invheader.OnlineAmount) : "",
      );

      setReceivedAmount(
        invheader.ReceivedAmount != null
          ? String(invheader.ReceivedAmount)
          : "",
      );

      setDiscount(invheader.Discount != null ? String(invheader.Discount) : "");

      setTransport(
        invheader.Transport != null ? String(invheader.Transport) : "",
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
        const firstRow = mappedRows[0];

        // // console.log("FIRST PRODUCT FOR EDIT:", firstRow);

        // IMPORTANT
        // First saved row is now in EDIT mode
        setEditingRow(null);

        // Product
        setSelectedProductId(firstRow.ProductId);

        setProductName(firstRow.ProductName || "");

        setSelectedProductName(firstRow.ProductName || "");

        // Quantity
        setQuantity(String(firstRow.Quantity ?? ""));

        // Rate
        setRate(String(firstRow.Rate ?? ""));

        // Amount
        SetAmount(Number(firstRow.Amount) || 0);

        // GST values kept internally
        setCGST(firstRow.CGSTPercentage ?? 0);

        setCGSTAmount(firstRow.CGSTAmount ?? 0);

        setSGST(firstRow.SGSTPercentage ?? 0);

        setSGSTAmount(firstRow.SGSTAmount ?? 0);

        setIGST(firstRow.IGSTPercentage ?? 0);

        setIGSTAmount(firstRow.IGSTAmount ?? 0);

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
      // console.log("======================================");

      // console.log("EDIT MODE ACTIVE");

      // console.log("EDIT ID:", invoiceId);

      // console.log("EDIT DATE:", invoiceDateText);

      // console.log("TODAY DATE:", todayDate);

      // console.log("EDIT ROWS:", mappedRows);

      // console.log("======================================");
    } catch (error) {
      console.error(
        "EDIT INVOICE ERROR:",
        error.response?.data || error.message || error,
      );

      toast.error("Unable to load invoice for editing.");
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

        Cell: ({ cell }) => <span>{cell.getValue() || "-"}</span>,
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

        accessorFn: (row) => row.accountDetails?.AccountName || "N/A",

        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
      },

      // ==================================================
      // CATEGORY
      // ==================================================
      {
        header: "Category",
        size: 130,

        accessorFn: (row) => {
          const customerType = String(row?.accountDetails?.CustomerType || "")
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

        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
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
                // // console.log("INVOICE EDIT CLICK:", row.original);

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
                background: "var(--complementary-color)",
              }}
              size="small"
              onClick={async () => {
                try {
                  // ---------------------------------
                  // 1. GET SAVED INVOICE ID
                  // ---------------------------------
                  const invoiceId = row.original?.Id;

                  if (!invoiceId) {
                    toast.error("Invoice ID not found.");
                    return;
                  }

                  // ---------------------------------
                  // 2. GET THIS INVOICE DETAILS
                  // ---------------------------------
                  const detailResponse = await axios.get(
                    `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
                  );

                  // // console.log("INVOICE DETAIL RESPONSE:", detailResponse.data);

                  const allDetails = Array.isArray(detailResponse.data)
                    ? detailResponse.data
                    : Array.isArray(detailResponse.data?.data)
                      ? detailResponse.data.data
                      : detailResponse.data?.data
                        ? [detailResponse.data.data]
                        : detailResponse.data
                          ? [detailResponse.data]
                          : [];

                  // ---------------------------------
                  // 3. GET ONLY THIS BILL DETAILS
                  // ---------------------------------
                  const invdetail = allDetails
                    .filter(
                      (detail) =>
                        String(detail.InvoiceId) === String(invoiceId),
                    )
                    .map((detail) => {
                      const matchedMaterial = productOptions.find(
                        (item) =>
                          String(item.value) === String(detail.ProductId),
                      );

                      return {
                        ...detail,

                        ProductName: matchedMaterial?.label || "Unknown",
                      };
                    });

                  // ---------------------------------
                  // 4. GET SAVED INVOICE HEADER
                  // ---------------------------------
                  let invoiceHeader = row.original;

                  try {
                    const headerResponse = await fetch(
                      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
                    );

                    const headerResult = await headerResponse.json();

                    invoiceHeader = Array.isArray(headerResult)
                      ? headerResult[0]
                      : Array.isArray(headerResult?.data)
                        ? headerResult.data[0]
                        : headerResult?.data
                          ? headerResult.data
                          : headerResult;

                    // // console.log("SAVED INVOICE HEADER:", invoiceHeader);
                  } catch (headerError) {
                    console.error("Invoice Header Error:", headerError);
                  }

                  // ---------------------------------
                  // 5. FINAL PREVIEW DATA
                  // ---------------------------------

                  const cashAmountSaved = Number(
                    invoiceHeader?.CashAmount || 0,
                  );

                  const onlineAmountSaved = Number(
                    invoiceHeader?.OnlineAmount || 0,
                  );

                  const savedReceivedAmount =
                    invoiceHeader?.ReceivedAmount != null
                      ? Number(invoiceHeader.ReceivedAmount)
                      : cashAmountSaved + onlineAmountSaved;

                  const finalPreviewData = {
                    ...row.original,

                    // ==========================================
                    // CREATED DATE & TIME
                    // ==========================================
                    CreatedOn:
                      invoiceHeader?.CreatedOn ??
                      row.original?.CreatedOn ??
                      null,

                    // ==========================================
                    // RECEIVED AMOUNT
                    // ==========================================
                    ReceivedAmount: savedReceivedAmount,

                    // ==========================================
                    // ACCOUNT DETAILS
                    // ==========================================
                    accountDetails: row.original?.accountDetails || {
                      AccountName: "",
                      Address1: "",
                      Address2: "",
                      Address3: "",
                      GSTNo: "",
                    },

                    // ==========================================
                    // INVOICE DETAILS
                    // ==========================================
                    invdetail: invdetail,
                  };

                  // // console.log("FINAL PREVIEW DATA:", finalPreviewData);

                  // // console.log(
                  //   "RECEIVED AMOUNT:",
                  //   finalPreviewData.ReceivedAmount,
                  // );

                  // ---------------------------------
                  // 6. CONSOLE CHECK
                  // ---------------------------------
                  // console.log("========== PREVIEW ==========");

                  // console.log("Invoice ID:", invoiceId);

                  // console.log("Invoice Header:", row.original);

                  // console.log("Invoice Details:", invdetail);

                  // console.log("Customer:", finalPreviewData.accountDetails);

                  // console.log("FINAL PREVIEW DATA:", finalPreviewData);

                  // console.log("=============================");

                  // ---------------------------------
                  // 7. OPEN PREVIEW
                  // ---------------------------------
                  setPreviewData(finalPreviewData);

                  setPreviewOpen(true);
                } catch (error) {
                  // // console.error("Preview Error:", error);

                  toast.error("Unable to load invoice preview.");
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
          const createdOn = row?.CreatedOn?.date || row?.CreatedOn || "";

          const updatedOn = row?.UpdatedOn?.date || row?.UpdatedOn || "";

          const updateCount = Number(row?.UpdateCount ?? 0);

          const isEdited =
            updateCount > 1 ||
            (createdOn && updatedOn && String(createdOn) !== String(updatedOn));

          return isEdited ? "Edited" : "-";
        },

        Cell: ({ row }) => {
          const invoice = row.original;

          const createdOn =
            invoice?.CreatedOn?.date || invoice?.CreatedOn || "";

          const updatedOn =
            invoice?.UpdatedOn?.date || invoice?.UpdatedOn || "";

          const updateCount = Number(invoice?.UpdateCount ?? 0);

          const isEdited =
            updateCount > 1 ||
            (createdOn && updatedOn && String(createdOn) !== String(updatedOn));

          // -----------------------------
          // NOT EDITED
          // -----------------------------
          if (!isEdited) {
            return (
              <Typography
                sx={{
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                -
              </Typography>
            );
          }

          // -----------------------------
          // EDITED
          // -----------------------------
          return (
            <Button
              variant="contained"
              size="small"
              sx={{
                background: "var(--primary-color)",
                minWidth: "80px",
              }}
              onClick={() => {
                // console.log("================================");

                // console.log("EDITED HISTORY CLICK");

                // console.log("Invoice No:", invoice?.InvoiceNo);

                // console.log("Invoice ID:", invoice?.Id);

                // console.log("================================");

                handleInvoiceHistoryClick(invoice);
              }}
            >
              Edited
            </Button>
          );
        },
      },
    ],
    [invoiceheaders, invoicedetails, productOptions],
  );

  // =========================
  // Integration
  // =========================

  // Invoice Details
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const [phone, setPhone] = useState("");

  const [device, setDevice] = useState("");

  const [userId, setUserId] = useState(
    () => sessionStorage.getItem("UserId") || "",
  );

  // ======================================================
  // GET DEVICE FOR LOGGED-IN USER
  // ======================================================
  const getDeviceForLoggedInUser = () => {
    const userRole = String(sessionStorage.getItem("UserRole") || "")
      .trim()
      .toUpperCase();

    if (userRole === "SALE") {
      return "Device1";
    }

    if (userRole === "SALE2") {
      return "Device2";
    }

    return "";
  };

  const userRole = String(sessionStorage.getItem("UserRole") || "")
    .trim()
    .toUpperCase();

  const isAdmin = userRole === "ADMIN";

  const [billFor, setBillFor] = useState("");

  const [machineID, setMachineID] = useState("");

  const [machineOptions, setMachineOptions] = useState([]);

  const [isGST, setIsGST] = useState(false);

  // Product Details
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [amount, SetAmount] = useState("");

  const [editingRow, setEditingRow] = useState(null);

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
  const [previousBalanceDue, setPreviousBalanceDue] = useState(0);

  const [selectedCustomerName, setSelectedCustomerName] = useState("");

  const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

  const [acctGSTNo, setacctGSTNo] = useState("");

  const [newCustomerMobile, setNewCustomerMobile] = useState("");

  const fetchCustomerContact = async (customerId) => {
    if (!customerId) {
      setPhone("");
      return;
    }

    try {
      const response = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
          customerId,
        )}`,
      );

      if (!response.ok) {
        throw new Error(`Contact API failed: ${response.status}`);
      }

      const result = await response.json();

      const invoiceList = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : result?.data
            ? [result.data]
            : [];

      invoiceList.sort((a, b) => Number(b?.Id || 0) - Number(a?.Id || 0));

      const latestInvoice = invoiceList.find(
        (invoice) =>
          invoice?.ContactNo !== null &&
          invoice?.ContactNo !== undefined &&
          String(invoice.ContactNo).trim() !== "",
      );

      const savedContact = latestInvoice?.ContactNo || "";

      // console.log("CUSTOMER SAVED CONTACT:", {
      //   customerId,
      //   savedContact,
      //   latestInvoice,
      // });

      setPhone(String(savedContact));
    } catch (error) {
      console.error("Customer contact fetch error:", error);
      setPhone("");
    }
  };

  const fetchPreviousBalance = async (customerId, excludeInvoiceId = null) => {
    if (!customerId) {
      setPreviousBalanceDue(0);
      return 0;
    }

    try {
      const response = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
          customerId,
        )}`,
      );

      if (!response.ok) {
        throw new Error(
          `Invoice header API failed with status ${response.status}`,
        );
      }

      const result = await response.json();

      const invoiceList = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : result?.data
            ? [result.data]
            : [];

      let previousBalance = 0;

      for (const invoice of invoiceList) {
        const invoiceId = Number(invoice?.Id || 0);

        if (
          excludeInvoiceId !== null &&
          excludeInvoiceId !== undefined &&
          invoiceId === Number(excludeInvoiceId)
        ) {
          continue;
        }

        const invoiceTotal = Number(invoice?.Total || 0);

        let invoiceReceived = 0;

        if (
          invoice?.ReceivedAmount !== null &&
          invoice?.ReceivedAmount !== undefined &&
          invoice?.ReceivedAmount !== ""
        ) {
          invoiceReceived = Number(invoice.ReceivedAmount) || 0;
        } else {
          invoiceReceived =
            (Number(invoice?.CashAmount) || 0) +
            (Number(invoice?.OnlineAmount) || 0);
        }

        const invoiceDue = Math.max(invoiceTotal - invoiceReceived, 0);

        previousBalance += invoiceDue;
      }

      setPreviousBalanceDue(previousBalance);

      return previousBalance;
    } catch (error) {
      console.error("Previous balance fetch error:", error);

      setPreviousBalanceDue(0);

      return 0;
    }
  };

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

    setDevice(getDeviceForLoggedInUser());
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchInvoiceHeader(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  //fetch customer from  account table

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster&RateType=Retailer",
      );

      const data = await response.json();

      // console.log("RETAILER PRODUCT API RESPONSE:", data);

      productvalidation(data);
    } catch (error) {
      // console.error("Error fetching retailer products:", error);
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

      // // console.log("Machines API Response:", response.data);

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
    // // console.log("RETAILER PRODUCT DATA:", data?.[0]);

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
    setDevice(getDeviceForLoggedInUser());

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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 1. Prevent duplicate save
    if (isSavingRef.current) return;

    let printWindow = null;

    // 2. Prepare rows, including the last product if Enter was not pressed
    const rowsToSave = [...rows];

    const pendingProductExists =
      editingRow === null &&
      selectedProductID &&
      quantity !== "" &&
      rate !== "" &&
      Number(quantity) > 0 &&
      Number(rate) > 0;

    const pendingProductAlreadyExists = rows.some(
      (row) =>
        String(row.ProductId) === String(selectedProductID) &&
        Number(row.Quantity) === Number(quantity) &&
        Number(row.Rate) === Number(rate),
    );

    if (pendingProductExists && !pendingProductAlreadyExists) {
      const selectedOption = productOptions.find(
        (option) => String(option.value) === String(selectedProductID),
      );

      const pendingQuantity = parseFloat(quantity) || 0;
      const pendingRate = parseFloat(rate) || 0;
      const pendingAmount = pendingQuantity * pendingRate;

      const pendingCGST = parseFloat(cgst) || 0;
      const pendingSGST = parseFloat(sgst) || 0;
      const pendingIGST = parseFloat(igst) || 0;

      const pendingCGSTAmount =
        cgstAmount !== "" && cgstAmount !== undefined
          ? Number(cgstAmount) || 0
          : (pendingCGST * pendingAmount) / 100;

      const pendingSGSTAmount =
        sgstAmount !== "" && sgstAmount !== undefined
          ? Number(sgstAmount) || 0
          : (pendingSGST * pendingAmount) / 100;

      const pendingIGSTAmount =
        igstAmount !== "" && igstAmount !== undefined
          ? Number(igstAmount) || 0
          : (pendingIGST * pendingAmount) / 100;

      rowsToSave.push({
        Id: null,
        InvoiceId: null,
        ProductId: selectedProductID,
        ProductName:
          productName || selectedProductName || selectedOption?.label || "",
        Quantity: pendingQuantity,
        Rate: pendingRate,
        Amount: pendingAmount,
        DiscountAmt: 0,
        CGSTPercentage: pendingCGST,
        CGSTAmount: pendingCGSTAmount,
        SGSTPercentage: pendingSGST,
        SGSTAmount: pendingSGSTAmount,
        IGSTPercentage: pendingIGST,
        IGSTAmount: pendingIGSTAmount,
      });
    }

    // 3. Validate products
    if (!rowsToSave.length) {
      toast.error("Please add at least one product.");
      return;
    }

    // 4. Calculate totals
    const finalSubTotal = rowsToSave.reduce(
      (sum, row) => sum + (parseFloat(row.Amount) || 0),
      0,
    );

    const finalCGSTTotal = rowsToSave.reduce(
      (sum, row) => sum + (parseFloat(row.CGSTAmount) || 0),
      0,
    );

    const finalSGSTTotal = rowsToSave.reduce(
      (sum, row) => sum + (parseFloat(row.SGSTAmount) || 0),
      0,
    );

    const finalIGSTTotal = rowsToSave.reduce(
      (sum, row) => sum + (parseFloat(row.IGSTAmount) || 0),
      0,
    );

    const finalDiscount = parseFloat(discount) || 0;
    const finalTransport = parseFloat(transport) || 0;

    const finalTotal =
      Math.max(finalSubTotal - finalDiscount, 0) + finalTransport;

    // 5. Validate before saving
    if (!validateForm(rowsToSave)) return;
    if (!validateReceivedAmount(finalTotal)) return;
    if (!validatePaymentSplit()) return;

    const receivedValue = receivedAmount === "" ? 0 : Number(receivedAmount);

    if (!Number.isFinite(receivedValue) || receivedValue < 0) {
      toast.error("Please enter a valid Received Amount.");
      return;
    }

    // 6. Validate invoice date
    const formattedInvoicedate = moment(invoiceDate).format("YYYY-MM-DD");

    if (!moment(formattedInvoicedate, "YYYY-MM-DD", true).isValid()) {
      toast.error("Please select a valid invoice date.");
      return;
    }

    // 7. Update displayed totals
    setSubTotalCal(finalSubTotal.toFixed(2));
    setCgstTotal(finalCGSTTotal.toFixed(2));
    setSgstTotal(finalSGSTTotal.toFixed(2));
    setIgstTotal(finalIGSTTotal.toFixed(2));
    setTotal(finalTotal.toFixed(2));

    // 8. Lock Save
    isSavingRef.current = true;
    setIsSaving(true);

    try {
      // 9. Open print window only when printing is requested
      if (shouldPrint) {
        printWindow = window.open("", "_blank");

        if (!printWindow) {
          toast.error("Please allow popups for printing.");
          return;
        }

        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preparing Invoice...</title>
          </head>
          <body style="font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;margin:0">
            <h3>Preparing invoice for printing...</h3>
          </body>
        </html>
      `);

        printWindow.document.close();
      }



      // Get the logged-in user's identity
const currentCreatedBy = Number(
  sessionStorage.getItem("CreatedBy") || 0
);

const currentUserId =
  sessionStorage.getItem("UserId") ||
  sessionStorage.getItem("LoginUserId") ||
  "";

if (!currentCreatedBy) {
  toast.error("CreatedBy is missing. Please login again.");
  return;
}

console.log("Logged-in UserId:", currentUserId);
console.log("Logged-in CreatedBy:", currentCreatedBy);
console.log("Logged-in Device:", device);


      // 10. Prepare invoice header

      const invoiceheaderdata = {
        Id: isEditing ? editId : "",
        InvoiceNo: invoiceNo,
        InvoiceDate: formattedInvoicedate,

        // Order Date = Invoice Date
        OrderDate: formattedInvoicedate,

        AccountId: selectedAccount ? parseInt(selectedAccount, 10) : 0,

        ContactNo: phone,
        Device: device,

        // Regular Sales Entry
        BillFor: "R",

        MachineID: machineID ? parseInt(machineID, 10) : 0,

        IsGST: isGST ? 1 : 0,
        PaymentMode: paymentMode || "",
        CashAmount: parseFloat(cashAmount) || 0,
        OnlineAmount: parseFloat(onlineAmount) || 0,
        Discount: finalDiscount,
        Transport: finalTransport,
        CGSTAmount: finalCGSTTotal,
        SGSTAmount: finalSGSTTotal,
        IGSTAmount: finalIGSTTotal,
        Total: finalTotal,

        // Actual amount received
        ReceivedAmount: receivedValue,

        SubTotal: finalSubTotal,
       CreatedBy: !isEditing ? currentCreatedBy : undefined,
UpdatedBy: isEditing ? currentCreatedBy : undefined,
      };

      // 11. Save or update invoice header
      const invoiceurl = isEditing
        ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
        : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

      const response = await axios.post(
        invoiceurl,
        qs.stringify(invoiceheaderdata),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      // 12. Resolve invoice ID
      const invoiceId = isEditing ? editId : parseInt(response?.data?.Id, 10);

      const savedInvoiceNo = isEditing ? invoiceNo : response?.data?.InvoiceNo;

      if (!invoiceId) {
        throw new Error(
          "Invoice ID was not received from the server. Check the invoice header API response.",
        );
      }

      // 13. Save all invoice details
      await Promise.all(
        rowsToSave.map(async (row, index) => {
          const rowData = {
            Id: row.Id ? parseInt(row.Id, 10) : "",
            InvoiceId: parseInt(invoiceId, 10),
            SerialNo: index + 1,
            ProductId: parseInt(row.ProductId, 10),
            Quantity: parseFloat(row.Quantity) || 0,
            Rate: parseFloat(row.Rate) || 0,
            Amount: parseFloat(row.Amount) || 0,
            CGSTPercentage: parseFloat(row.CGSTPercentage) || 0,
            CGSTAmount: parseFloat(row.CGSTAmount) || 0,
            SGSTPercentage: parseFloat(row.SGSTPercentage) || 0,
            SGSTAmount: parseFloat(row.SGSTAmount) || 0,
            IGSTPercentage: parseFloat(row.IGSTPercentage) || 0,
            IGSTAmount: parseFloat(row.IGSTAmount) || 0,
          };

          const detailUrl = row.Id
            ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
            : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

          const detailResponse = await axios.post(
            detailUrl,
            qs.stringify(rowData),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            },
          );

          return detailResponse.data;
        }),
      );

      // 14. Print only after header and all details have saved
      if (shouldPrint) {
        const currentAccountDetails = await fetchAccounts(selectedAccount);

        const customerNameForPrint =
          accountOptions.find(
            ({ Id }) => String(Id) === String(selectedAccount),
          )?.AccountName ||
          accountName ||
          "";

        const printData = {
          ...invoiceheaderdata,
          Id: invoiceId,
          InvoiceNo: savedInvoiceNo,
          Device: device || "",
          PaymentMode: paymentMode || "",

          accountDetails: {
            ...(currentAccountDetails || {}),
            AccountName: customerNameForPrint,
            Address1: customerAddress1 || "",
            Address2: customerAddress2 || "",
            Address3: customerAddress3 || "",
            GSTNo: acctGSTNo || "",
          },

          customerName: customerNameForPrint,
          customerAddress1: customerAddress1 || "",
          customerAddress2: customerAddress2 || "",
          customerAddress3: customerAddress3 || "",
          customerGSTNo: acctGSTNo || "",
          ReceivedAmount: receivedValue,

          invdetail: rowsToSave.map((row) => ({
            ...row,
            ProductName:
              row.ProductName ||
              productOptions.find(
                (option) => String(option.value) === String(row.ProductId),
              )?.label ||
              "Unknown",
            Quantity: parseFloat(row.Quantity) || 0,
            Rate: parseFloat(row.Rate) || 0,
            Amount: parseFloat(row.Amount) || 0,
            DiscountAmt: parseFloat(row.DiscountAmt) || 0,
          })),
        };

        generatePDF(printData, printWindow);
      }

      // 15. Success
      toast.success(
        isEditing
          ? "Sales Entry Updated successfully!"
          : "Sales Entry Created successfully!",
      );

      // 16. Reset edit mode and form
      setIsEditing(false);
      setEditId("");
      resetForm();

      // 17. Refresh invoice table only once
      // Keep this GET so the table displays the saved invoice.
      // void fetchInvoiceHeader();
    } catch (error) {
      console.error("Error submitting invoice:", error);

      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }

      toast.error(
        isEditing ? "Sales Entry Update failed!" : "Sales Entry Save failed!",
      );
    } finally {
      // 18. Always unlock Save
      isSavingRef.current = false;
      setIsSaving(false);
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

       
        if (!isDrawerOpen) {
          return;
        }

        if (event.repeat) {
          return;
        }

        // console.log("CTRL + S PRESSED");

        // Save + Print
        handleSubmit(event);
      }
    };

    
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

  const validateReceivedAmount = (totalToValidate = total) => {
    const receivedValue =
      receivedAmount === "" ? NaN : parseFloat(receivedAmount);

    const totalValue = parseFloat(totalToValidate) || 0;

    // =====================================================
    // 1. RECEIVED AMOUNT REQUIRED
    // =====================================================

    if (receivedAmount === "" || Number.isNaN(receivedValue)) {
      toast.error(
        `Please enter received amount. Total ₹${totalValue.toFixed(2)}`,
      );

      receivedAmountRef.current?.focus();
      receivedAmountRef.current?.select();

      return false;
    }

    // =====================================================
    // 2. RECEIVED AMOUNT CANNOT BE GREATER THAN TOTAL
    // =====================================================

    if (receivedValue > totalValue) {
      const extraAmount = receivedValue - totalValue;

      toast.error(
        `Received amount ₹${receivedValue.toFixed(
          2,
        )} cannot be greater than Total ₹${totalValue.toFixed(
          2,
        )}. Extra amount ₹${extraAmount.toFixed(2)} is not allowed.`,
      );

      receivedAmountRef.current?.focus();
      receivedAmountRef.current?.select();

      return false;
    }

    // =====================================================
    // 3. RECEIVED LESS THAN TOTAL = ALLOWED
    // =====================================================

    const balanceAmount = totalValue - receivedValue;

    // console.log("TOTAL:", totalValue);

    // console.log("RECEIVED:", receivedValue);

    // console.log("BALANCE DUE:", balanceAmount);

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
    // =====================================================
    // 1. NORMAL SAVED ROWS TOTAL
    // =====================================================

    let subtotal = rows.reduce(
      (acc, row) => acc + (parseFloat(row.Amount) || 0),
      0,
    );

    let totalCGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
      0,
    );

    let totalSGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
      0,
    );

    let totalIGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
      0,
    );

    // =====================================================
    // 2. LAST PRODUCT - ENTER NOT PRESSED
    // =====================================================

    const pendingProductExists =
      editingRow === null &&
      selectedProductID &&
      quantity !== "" &&
      rate !== "" &&
      Number(quantity) > 0 &&
      Number(rate) > 0;

    if (pendingProductExists) {
      const pendingQuantity = parseFloat(quantity) || 0;

      const pendingRate = parseFloat(rate) || 0;

      const pendingAmount = pendingQuantity * pendingRate;

      // Add pending product amount to subtotal
      subtotal += pendingAmount;

      // GST - only for backend/internal calculation
      const pendingCGST =
        parseFloat(cgstAmount) ||
        ((parseFloat(cgst) || 0) * pendingAmount) / 100;

      const pendingSGST =
        parseFloat(sgstAmount) ||
        ((parseFloat(sgst) || 0) * pendingAmount) / 100;

      const pendingIGST =
        parseFloat(igstAmount) ||
        ((parseFloat(igst) || 0) * pendingAmount) / 100;

      totalCGST += pendingCGST;
      totalSGST += pendingSGST;
      totalIGST += pendingIGST;

      // console.log("PENDING LAST PRODUCT:", {
      //   ProductId: selectedProductID,
      //   Quantity: pendingQuantity,
      //   Rate: pendingRate,
      //   Amount: pendingAmount,
      // });
    }

    // =====================================================
    // 3. UPDATE SUBTOTAL
    // =====================================================

    setSubTotalCal(subtotal.toFixed(2));

    // =====================================================
    // 4. UPDATE GST TOTALS
    // =====================================================

    setCgstTotal(totalCGST.toFixed(2));

    setSgstTotal(totalSGST.toFixed(2));

    setIgstTotal(totalIGST.toFixed(2));

    // =====================================================
    // 5. DISCOUNT
    // =====================================================

    const discountValue = parseFloat(discount) || 0;

    // =====================================================
    // 6. TRANSPORT
    // =====================================================

    const transportValue = parseFloat(transport) || 0;

    // =====================================================
    // 7. FINAL TOTAL
    // =====================================================

    const totalBeforeDiscount = subtotal;

    const afterDiscount = Math.max(totalBeforeDiscount - discountValue, 0);

    const grandTotal = afterDiscount + transportValue;

    // =====================================================
    // 8. UPDATE TOTAL
    // =====================================================

    setTotal(grandTotal.toFixed(2));

    // console.log("DISPLAY TOTAL INCLUDING PENDING PRODUCT:", grandTotal);
  };

  useEffect(() => {
    calculations();
  }, [
    rows,
    transport,
    discount,
    selectedProductID,
    quantity,
    rate,
    editingRow,
    cgst,
    cgstAmount,
    sgst,
    sgstAmount,
    igst,
    igstAmount,
  ]);

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

  const handleEditRow = (index) => {
    const row = rows[index];

    if (!row) {
      toast.error("Product row not found.");
      return;
    }

    // console.log("========== EDIT PRODUCT ROW ==========");
    // console.log("EDIT ROW INDEX:", index);
    // console.log("EDIT ROW DATA:", row);

    // Set row in edit mode
    setEditingRow(index);

    // Product
    setSelectedProductId(row.ProductId);
    setProductName(row.ProductName || "");

    // Quantity
    const q =
      row.Quantity !== null && row.Quantity !== undefined
        ? String(row.Quantity)
        : "";

    setQuantity(q);

    // Rate
    const r =
      row.Rate !== null && row.Rate !== undefined ? String(row.Rate) : "";

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

    calculateCgstAmount(row.CGSTPercentage || 0, baseAmt);

    calculateSgstAmount(row.SGSTPercentage || 0, baseAmt);

    calculateIgstAmount(row.IGSTPercentage || 0, baseAmt);

    // console.log("EDIT PRODUCT VALUES:", {
    //   ProductId: row.ProductId,
    //   ProductName: row.ProductName,
    //   Quantity: q,
    //   Rate: r,
    //   Amount: baseAmt,
    // });

    // console.log("======================================");
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

    if (Number.isNaN(finalQuantity) || finalQuantity <= 0) {
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

    if (Number.isNaN(finalRate) || finalRate <= 0) {
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
    const finalAmount = finalQuantity * finalRate;

    // =====================================================
    // 5. FIND SELECTED PRODUCT
    // =====================================================
    const selectedOption = productOptions.find(
      (option) => String(option.value) === String(selectedProductID),
    );

    // =====================================================
    // 6. PRODUCT NAME
    // =====================================================
    const finalProductName =
      productName || selectedOption?.label || selectedProductName || "";

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

      // console.log("UPDATED PRODUCT ROW:", updatedRows[editingRow]);

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

      // console.log("NEW PRODUCT ROW:", newRow);

      // Add new row
      setRows((prevRows) => [...prevRows, newRow]);
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

  const serchCustomers = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      // =====================================================
      // DO NOT SEARCH EMPTY TEXT
      // =====================================================

      if (!text || !text.trim()) {
        setAccountOptions([]);
        return;
      }

      // =====================================================
      // GET CUSTOMER ACCOUNTS
      // TypeCode=C means Customer Account
      // =====================================================

      const response = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${encodeURIComponent(
          text.trim(),
        )}`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`Customer Search API failed: ${response.status}`);
      }

      const result = await response.json();

      const customers = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      // =====================================================
      // CHECK ADDRESS CUSTOMER TYPE
      // ONLY R = REGULAR / RETAILER
      // =====================================================

      const regularCustomers = (
        await Promise.all(
          customers.map(async (customer) => {
            const accountId =
              customer?.Id || customer?.AccountId || customer?.AccountID;

            if (!accountId) {
              return null;
            }

            try {
              const addressResponse = await fetch(
                `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`,
                requestOptions,
              );

              if (!addressResponse.ok) {
                return null;
              }

              const addressResult = await addressResponse.json();

              const addressData = Array.isArray(addressResult)
                ? addressResult[0] || null
                : Array.isArray(addressResult?.data)
                  ? addressResult.data[0] || null
                  : addressResult?.data || addressResult || null;

              const customerType = String(
                addressData?.CustomerType ||
                  addressData?.customerType ||
                  customer?.CustomerType ||
                  customer?.customerType ||
                  "",
              )
                .trim()
                .toUpperCase();

              if (customerType !== PAGE_CUSTOMER_TYPE) {
                return null;
              }

              return {
                ...customer,
                CustomerType: customerType,
                addressDetails: addressData,
              };
            } catch (error) {
              console.error(
                `Address fetch failed for AccountId ${accountId}:`,
                error,
              );

              return null;
            }
          }),
        )
      ).filter(Boolean);

      // console.log("REGULAR CUSTOMER SEARCH RESULT:", regularCustomers);

      setAccountOptions(regularCustomers);
    } catch (error) {
      console.error("Regular customer search error:", error);
      setAccountOptions([]);
    }
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

  const CreateCustomerMaster = async () => {
    // ============================================================
    // 1. CUSTOMER NAME VALIDATION
    // ============================================================

    if (!Namevalidation()) {
      return;
    }

    // ============================================================
    // 2. HEADERS
    // ============================================================

    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    try {
      // ============================================================
      // 3. CREATE CUSTOMER ACCOUNT
      // ============================================================

      const urlencoded = new URLSearchParams();

      urlencoded.append("AccountName", accountName.trim());

      urlencoded.append("GroupId", "3");

      urlencoded.append("SubGroupId", "1");

      // KEEP YOUR EXISTING REQUIREMENT
      urlencoded.append("OpeningBalance", "100");

      urlencoded.append("DrORCr", "D");

      urlencoded.append("TypeCode", "C");

      urlencoded.append("IsSystem", "false");

      // console.log(
      //   "CREATE CUSTOMER ACCOUNT DATA:",
      //   Object.fromEntries(urlencoded),
      // );

      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
        {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow",
        },
      );

      if (!response.ok) {
        throw new Error(`Account API failed: ${response.status}`);
      }

      const result = await response.json();

      // console.log("CUSTOMER CREATED:", result);

      // ============================================================
      // 4. CHECK CUSTOMER ID
      // ============================================================

      if (!result || !result.Id) {
        throw new Error("Customer ID not received from API.");
      }

      const newCustomerId = result.Id;

      // ============================================================
      // 5. CREATE CUSTOMER ADDRESS / CONTACT DETAILS
      // ============================================================

      const addressData = new URLSearchParams();

      // CUSTOMER ID
      addressData.append("AccountId", newCustomerId);

      // REGULAR CUSTOMER
      addressData.append("CustomerType", "R");

      // EXISTING GST LOGIC
      addressData.append("GSTNo", "270000000000000");

      // ============================================================
      // ADDRESS - OPTIONAL
      // ============================================================

      addressData.append("Address1", newCustomerAddress.trim());

      addressData.append("Address", newCustomerAddress.trim());

      // ============================================================
      // MOBILE NUMBER - OPTIONAL
      // ============================================================

      addressData.append("MobileNo", newCustomerMobile.trim());

      // ============================================================
      // TELEPHONE / LAND PHONE - OPTIONAL
      // ============================================================

      // console.log("CUSTOMER ADDRESS DATA:", Object.fromEntries(addressData));

      // ============================================================
      // 6. SAVE ADDRESS / MOBILE / TELEPHONE
      // ============================================================

      const addressResponse = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
        {
          method: "POST",
          headers: myHeaders,
          body: addressData,
          redirect: "follow",
        },
      );

      if (!addressResponse.ok) {
        throw new Error(`Address API failed: ${addressResponse.status}`);
      }

      // Some APIs may return empty response,
      // so don't blindly call response.json()
      const addressResponseText = await addressResponse.text();

      let addressResult = null;

      try {
        addressResult = addressResponseText
          ? JSON.parse(addressResponseText)
          : null;
      } catch (jsonError) {
        console.warn("Address API response is not JSON:", addressResponseText);
      }

      // console.log("ADDRESS / CONTACT SAVED:", addressResult);

      // ============================================================
      // 7. ADD NEW CUSTOMER TO LOCAL DROPDOWN
      // ============================================================

      const newCustomer = {
        Id: newCustomerId,

        AccountName: accountName.trim(),

        CustomerType: "R",

        Address1: newCustomerAddress.trim(),

        Address: newCustomerAddress.trim(),

        MobileNo: newCustomerMobile.trim(),
      };

      setAccountOptions((previousOptions) => {
        const alreadyExists = previousOptions.some(
          (customer) => String(customer.Id) === String(newCustomerId),
        );

        if (alreadyExists) {
          return previousOptions;
        }

        return [newCustomer, ...previousOptions];
      });

      // ============================================================
      // 8. SELECT NEW CUSTOMER AUTOMATICALLY
      // ============================================================

      setSelectedAccount(String(newCustomerId));

      setSelectedCustomerName(accountName.trim());

      setSelectedCustomerAddress(newCustomerAddress.trim());

      // If mobile is entered,
      // show it in Sales Entry Contact Number
      if (newCustomerMobile.trim()) {
        setPhone(newCustomerMobile.trim());
      }

      // ============================================================
      // 9. CLOSE CUSTOMER POPUP
      // ============================================================

      setShowDropdown(false);

      // ============================================================
      // 10. CLEAR CREATE CUSTOMER FIELDS
      // ============================================================

      setAccountName("");

      setNewCustomerAddress("");

      setNewCustomerMobile("");

      setText("");

      // ============================================================
      // 11. SUCCESS MESSAGE
      // ============================================================

      toast.success("Customer created successfully");
    } catch (error) {
      console.error("Error creating customer:", error);

      toast.error(error.message || "Unable to create customer");
    }
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

      // console.log("Customer Address API Response:", temp);

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

  const validateForm = (rowsToValidate = rows) => {
    const newErrors = {
      invoiceDate: "",
      selectedAccount: "",
      paymentMode: "",
      rows: "",
    };

    let isValid = true;

    // ==========================================
    // INVOICE DATE
    // ==========================================
    if (!invoiceDate) {
      newErrors.invoiceDate = "Invoice date is required";
      isValid = false;
    } else {
      const invoiceDateObj = new Date(invoiceDate);

      // Remove time from invoice date
      invoiceDateObj.setHours(0, 0, 0, 0);

      // Financial year dates
      const financialFromDate = Cookies.get("FromDate");
      const financialToDate = Cookies.get("ToDate");

      if (financialFromDate && financialToDate) {
        const fromDateObj = new Date(financialFromDate);
        const toDateObj = new Date(financialToDate);

        // Remove time from financial year dates
        fromDateObj.setHours(0, 0, 0, 0);
        toDateObj.setHours(0, 0, 0, 0);

        if (invoiceDateObj < fromDateObj) {
          newErrors.invoiceDate = `Invoice date cannot be before ${fromDateObj.toLocaleDateString()}`;
          isValid = false;
        } else if (invoiceDateObj > toDateObj) {
          newErrors.invoiceDate = `Invoice date cannot be after ${toDateObj.toLocaleDateString()}`;
          isValid = false;
        }
      }
    }

    // ==========================================
    // PAYMENT MODE
    // ==========================================
    if (!paymentMode) {
      newErrors.paymentMode = "Payment mode is required";
      isValid = false;
    }

    // ==========================================
    // PRODUCT ROWS
    // ==========================================
    if (rowsToValidate.length === 0) {
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
      setFinancialYearFromDate(storedfromdate);
    } else {
      toast.error("FromDate is not set.");
    }

    if (storedtodate) {
      setFinancialYearToDate(storedtodate);
    } else {
      toast.error("ToDate is not set.");
    }
  }, []);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
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

    // console.log("========================================");
    // console.log("INVOICE PRINT START");
    // console.log("PRINT DATA:", printData);
    // console.log("SELECTED ACCOUNT:", selectedAccount);
    // console.log("========================================");

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
    // 3. GET ACCOUNT ID FROM selectedAccount
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
    // 4. CUSTOMER VARIABLES
    // ============================================================

    let customerName = "";
    let customerAddress1 = "";
    let customerAddress2 = "";
    let customerAddress3 = "";
    let customerMobileNo = "";

    // ============================================================
    // 5. FETCH CUSTOMER NAME + CONTACT + ADDRESS
    // ============================================================

    if (accountId) {
      try {
        // ----------------------------------------------------------
        // 5A. ACCOUNT API
        // ----------------------------------------------------------

        const accountResponse = await fetch(
          `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
            accountId,
          )}`,
        );

        if (!accountResponse.ok) {
          throw new Error(
            `Account API failed with status ${accountResponse.status}`,
          );
        }

        const accountResult = await accountResponse.json();

        const accountData = Array.isArray(accountResult)
          ? accountResult[0] || null
          : Array.isArray(accountResult?.data)
            ? accountResult.data[0] || null
            : accountResult?.data || accountResult || null;

        console.log("PRINT ACCOUNT DATA:", accountData);

        // ----------------------------------------------------------
        // CUSTOMER NAME
        // ----------------------------------------------------------

        customerName =
          accountData?.AccountName || accountData?.accountName || "";

        // ----------------------------------------------------------
        // CUSTOMER CONTACT
        // ----------------------------------------------------------

        customerMobileNo =
          accountData?.MobileNo ||
          accountData?.MobileNumber ||
          accountData?.ContactNo ||
          accountData?.ContactNumber ||
          accountData?.PhoneNo ||
          accountData?.PhoneNumber ||
          "";

        // ----------------------------------------------------------
        // 5B. ADDRESS API
        // ----------------------------------------------------------

        const addressResponse = await fetch(
          `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
            accountId,
          )}`,
        );

        if (!addressResponse.ok) {
          throw new Error(
            `Address API failed with status ${addressResponse.status}`,
          );
        }

        const addressResult = await addressResponse.json();

        const addressData = Array.isArray(addressResult)
          ? addressResult[0] || null
          : Array.isArray(addressResult?.data)
            ? addressResult.data[0] || null
            : addressResult?.data || addressResult || null;

        // console.log("PRINT ADDRESS DATA:", addressData);

        if (addressData) {
          customerAddress1 =
            addressData?.Address1 || addressData?.address1 || "";

          customerAddress2 =
            addressData?.Address2 || addressData?.address2 || "";

          customerAddress3 =
            addressData?.Address3 || addressData?.address3 || "";
        }
      } catch (error) {
        console.error("PRINT CUSTOMER DETAILS ERROR:", error);
      }
    }

    // ============================================================
    // 6. FALLBACK CUSTOMER NAME
    // ============================================================

    if (!customerName) {
      customerName =
        printData?.accountDetails?.AccountName || printData?.customerName || "";
    }

    // ============================================================
    // 7. FALLBACK ADDRESS 1
    // ============================================================

    if (!customerAddress1) {
      customerAddress1 =
        printData?.accountDetails?.Address1 || printData?.Address1 || "";
    }

    // ============================================================
    // 8. FALLBACK ADDRESS 2
    // ============================================================

    if (!customerAddress2) {
      customerAddress2 =
        printData?.accountDetails?.Address2 || printData?.Address2 || "";
    }

    // ============================================================
    // 9. FALLBACK ADDRESS 3
    // ============================================================

    if (!customerAddress3) {
      customerAddress3 =
        printData?.accountDetails?.Address3 || printData?.Address3 || "";
    }

    // ============================================================
    // 10. CONTACT NUMBER
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
    // 11. DEBUG
    // ============================================================

    // console.log("========================================");
    // console.log("FINAL CUSTOMER INFORMATION");
    // console.log("ACCOUNT ID:", accountId);
    // console.log("CUSTOMER NAME:", customerName);
    // console.log("ADDRESS 1:", customerAddress1);
    // console.log("ADDRESS 2:", customerAddress2);
    // console.log("ADDRESS 3:", customerAddress3);
    // console.log("MOBILE:", contactNo);
    // console.log("========================================");

    // ============================================================
    // 12. CREATE 80MM ROLL PDF
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
    // 13. INVOICE NUMBER
    // ============================================================

    const invoiceNo =
      printData?.InvoiceNo ||
      printData?.InvoiceNumber ||
      printData?.BillNo ||
      printData?.BillNumber ||
      printData?.invoiceNo ||
      "";

    // ============================================================
    // 14. DATE
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
    // 15. TIME
    // ============================================================

    const invoiceTime = moment().format("hh:mm A");

    // ============================================================
    // 16. COMPANY DETAILS
    // ============================================================

    const companyName = "AMRUT MILK PRODUCTS 2";

    const companyAddress1 = "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER";

    const companyAddress2 = "KOLHAPUR.";

    const companyPhone = "8830261523";

    const companyState = "27-Maharashtra";

    // ============================================================
    // 17. IMAGE TO DATA URL
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
    // 18. LOAD LOGOS
    // ============================================================

    let amrutLogoData = null;
    let fremilaLogoData = null;

    try {
      amrutLogoData = await imageToDataURL(amrutLogo);
    } catch (error) {
      console.error("Amrut Siddhi logo error:", error);
    }

    try {
      fremilaLogoData = await imageToDataURL(fremilaLogo);
    } catch (error) {
      console.error("Fremila logo error:", error);
    }

    // ============================================================
    // 19. MARGINS
    // ============================================================

    const leftMargin = 4;
    const rightMargin = 4;

    const contentWidth = pageWidth - leftMargin - rightMargin;

    // ============================================================
    // 20. OUTER BORDER
    // ============================================================

    doc.setLineWidth(0.4);

    doc.rect(leftMargin, 4, contentWidth, pageHeight - 8);

    // ============================================================
    // 21. HEADER
    // ============================================================

    let y = 11;

    // ============================================================
    // AMRUT LOGO
    // ============================================================

    if (amrutLogoData) {
      try {
        doc.addImage(amrutLogoData, "PNG", pageWidth - 25, 7, 18, 12);
      } catch (error) {
        console.error("Amrut Siddhi PDF logo error:", error);
      }
    }

    // ============================================================
    // FREMILA LOGO
    // ============================================================

    if (fremilaLogoData) {
      try {
        doc.addImage(fremilaLogoData, "PNG", pageWidth - 25, 20, 18, 12);
      } catch (error) {
        console.error("Fremila PDF logo error:", error);
      }
    }

    // ============================================================
    // COMPANY NAME
    // ============================================================

    doc.setFont("helvetica", "bold");

    doc.setFontSize(9);

    doc.text(companyName, leftMargin + 2, y);

    y += 4;

    // ============================================================
    // COMPANY ADDRESS
    // ============================================================

    doc.setFont("helvetica", "normal");

    doc.setFontSize(5.5);

    const companyAddressLines = doc.splitTextToSize(companyAddress1, 52);

    doc.text(companyAddressLines, leftMargin + 2, y);

    y += companyAddressLines.length * 3.2;

    doc.text(companyAddress2, leftMargin + 2, y);

    y += 3.2;

    // ============================================================
    // COMPANY PHONE
    // ============================================================

    doc.text(`Phone no.: ${companyPhone}`, leftMargin + 2, y);

    y += 3.2;

    // ============================================================
    // COMPANY STATE
    // ============================================================

    doc.text(`State: ${companyState}`, leftMargin + 2, y);

    // ============================================================
    // TAX INVOICE
    // ============================================================

    y += 6;

    doc.setFont("helvetica", "bold");

    doc.setFontSize(9);

    doc.text("Tax Invoice", pageWidth / 2, y, {
      align: "center",
    });

    y += 5;

    // ============================================================
    // HEADER LINE
    // ============================================================

    doc.setLineWidth(0.3);

    doc.line(leftMargin + 2, y, pageWidth - rightMargin - 2, y);

    y += 5;

    // ============================================================
    // BILL TO + INVOICE DETAILS
    // ============================================================

    const leftX = 7;
    const rightX = 43;

    const sectionStartY = y;

    // ------------------------------------------------------------
    // LEFT : BILL TO
    // ------------------------------------------------------------

    let customerY = sectionStartY;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);

    doc.text("Bill To", leftX, customerY);

    customerY += 5;

    // Customer Name
    if (customerName) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);

      const nameLines = doc.splitTextToSize(String(customerName), 32);

      doc.text(nameLines, leftX, customerY);

      customerY += nameLines.length * 3.2;
    }

    // Address 1
    if (customerAddress1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.8);

      const address1Lines = doc.splitTextToSize(String(customerAddress1), 32);

      doc.text(address1Lines, leftX, customerY);

      customerY += address1Lines.length * 3;
    }

    // Address 2
    if (customerAddress2) {
      const address2Lines = doc.splitTextToSize(String(customerAddress2), 32);

      doc.text(address2Lines, leftX, customerY);

      customerY += address2Lines.length * 3;
    }

    // Address 3
    if (customerAddress3) {
      const address3Lines = doc.splitTextToSize(String(customerAddress3), 32);

      doc.text(address3Lines, leftX, customerY);

      customerY += address3Lines.length * 3;
    }

    // Mobile
    if (contactNo) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.8);

      doc.text(`Mobile No.: ${contactNo}`, leftX, customerY);

      customerY += 3.5;
    }

    // ------------------------------------------------------------
    // RIGHT : INVOICE DETAILS
    // ------------------------------------------------------------

    let invoiceY = sectionStartY;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);

    doc.text("Invoice Details", rightX, invoiceY);

    invoiceY += 5;

    // Invoice Number
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);

    doc.text(`Invoice No.: ${invoiceNo || "-"}`, rightX, invoiceY);

    invoiceY += 5;

    // Date
    doc.text(`Date: ${invoiceDateText}`, rightX, invoiceY);

    invoiceY += 5;

    // Time
    doc.text(`Time: ${invoiceTime}`, rightX, invoiceY);

    invoiceY += 4;

    // ------------------------------------------------------------
    // CALCULATE NEXT Y POSITION
    // ------------------------------------------------------------

    y = Math.max(customerY, invoiceY) + 2;

    // ------------------------------------------------------------
    // LINE BEFORE PRODUCT TABLE
    // ------------------------------------------------------------

    doc.setLineWidth(0.3);

    doc.line(leftMargin + 2, y, pageWidth - rightMargin - 2, y);

    y += 4;

    // ============================================================
    // 23. INVOICE DETAILS
    // ============================================================

    const invoiceDetails = Array.isArray(printData?.invdetail)
      ? printData.invdetail
      : [];

    // ============================================================
    // 24. PRODUCT TABLE DATA
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
    // 25. PRODUCT TABLE
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
    // 26. TOTAL QUANTITY
    // ============================================================

    const totalQuantity = invoiceDetails.reduce(
      (sum, item) => sum + Number(item?.Quantity || 0),
      0,
    );

    // ============================================================
    // 27. SUB TOTAL
    // ============================================================

    const subTotal = Number(printData?.SubTotal || 0);

    // ============================================================
    // 28. GRAND TOTAL
    // ============================================================

    const grandTotal = Number(printData?.Total || 0);

    // ============================================================
    // 29. RECEIVED
    // ============================================================

    const receivedAmount = Number(printData?.ReceivedAmount || 0);

    // ============================================================
    // 30. BALANCE
    // ============================================================

    const balance = Math.max(grandTotal - receivedAmount, 0);

    // ============================================================
    // 31. TOTAL ROW
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
    // 32. NUMBER TO WORDS
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
    // 33. AMOUNT IN WORDS
    // ============================================================

    const amountInWords = `${numberToWords(grandTotal)} Rupees only`;

    // ============================================================
    // 34. SUMMARY TABLE
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
    // 35. TERMS
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
    // 36. AUTHORIZED SIGNATORY
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
    // 37. PRINT PDF
    // ============================================================

    try {
      if (typeof doc.autoPrint === "function") {
        doc.autoPrint();
      }

      const pdfBlob = doc.output("blob");

      const pdfBlobUrl = URL.createObjectURL(pdfBlob);

      // console.log("========================================");

      // console.log("80MM ROLL PDF CREATED");

      // console.log("PDF URL:", pdfBlobUrl);

      // console.log("========================================");

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
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          <Button
            sx={{
              background: "var(--complementary-color)",
              minWidth: "235px",
              height: "56px",
              whiteSpace: "nowrap",

              "&:hover": {
                background: "var(--complementary-color)",
              },
            }}
            variant="contained"
            onClick={handleNewClick}
          >
            Create Sales Entry
          </Button>

          {minimizedBills.length > 0 && (
            <Box
              sx={{
                mt: 2,
                mb: 2,
                p: 2,
                borderRadius: "12px",
                backgroundColor: "#f5f7fa",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                Minimized Bills ({minimizedBills.length})
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {minimizedBills.map((bill) => (
                  <Box
                    key={bill.draftId}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      p: 1.5,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {bill.customerName || "Regular Customer"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Invoice: {bill.invoiceNo || "-"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleResumeBill(bill.draftId)}
                      >
                        Resume
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveMinimizedBill(bill.draftId)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        {/* =========================
    INVOICE FILTERS
========================= */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <DatePicker
              label="From Date"
              format="dd-MM-yyyy"
              value={
                fromDate
                  ? moment(fromDate, "YYYY-MM-DD", true).isValid()
                    ? moment(fromDate, "YYYY-MM-DD").toDate()
                    : null
                  : null
              }
              onChange={(newValue) => {
                setFromDate(
                  newValue && !isNaN(newValue.getTime())
                    ? moment(newValue).format("YYYY-MM-DD")
                    : "",
                );
              }}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 160 },
                },
              }}
            />

            {/* TO DATE */}
            <DatePicker
              label="To Date"
              format="dd-MM-yyyy"
              value={
                toDate
                  ? moment(toDate, "YYYY-MM-DD", true).isValid()
                    ? moment(toDate, "YYYY-MM-DD").toDate()
                    : null
                  : null
              }
              onChange={(newValue) => {
                setToDate(
                  newValue && !isNaN(newValue.getTime())
                    ? moment(newValue).format("YYYY-MM-DD")
                    : "",
                );
              }}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 160 },
                },
              }}
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
        </LocalizationProvider>
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
                            previewData.InvoiceDate.date,
                          ).toLocaleDateString()
                        : previewData?.InvoiceDate
                          ? new Date(
                              previewData.InvoiceDate,
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
                      {/* ORDER NUMBER */}
                      <Typography>
                        <strong>Order No:</strong> {previewData?.OrderNo || "-"}
                      </Typography>

                      {/* ORDER TIME */}
                      <Typography sx={{ mt: 1 }}>
                        <strong>Order Time:</strong>{" "}
                        {(() => {
                          const createdOnValue = previewData?.CreatedOn;

                         
                          if (!createdOnValue) {
                            return "-";
                          }

                         
                          const dateValue =
                            typeof createdOnValue === "object"
                              ? createdOnValue?.date ||
                                createdOnValue?.Date ||
                                createdOnValue?.value ||
                                ""
                              : createdOnValue;

                        
                          if (!dateValue) {
                            return "-";
                          }

                          const date = new Date(dateValue);

                          // Invalid date
                          if (isNaN(date.getTime())) {
                            return "-";
                          }

                          // Only Time
                          return date.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          });
                        })()}
                      </Typography>
                    </Box>
                    <Box></Box>
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
                                  0,
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
        <Dialog
          open={historyOpen}
          onClose={() => {
            setHistoryOpen(false);
            setSelectedHistoryVersion(null);
            setSelectedHistoryDetails([]);
          }}
          fullWidth
          maxWidth="xl"
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: "92vh",
            },
          }}
        >
          {/* =====================================================
      HEADER
  ===================================================== */}

          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #1976d2, #0d47a1)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              Invoice Edit History
              <Typography
                sx={{
                  fontSize: "13px",
                  opacity: 0.9,
                  mt: 0.5,
                }}
              >
                Invoice No:{" "}
                {selectedHistoryInvoice?.InvoiceNo ||
                  selectedHistoryInvoice?.BillNo ||
                  "-"}
              </Typography>
            </Box>

            <IconButton
              onClick={() => {
                setHistoryOpen(false);
                setSelectedHistoryVersion(null);
                setSelectedHistoryDetails([]);
              }}
              sx={{
                color: "#fff",
              }}
            >
              <CloseIcon
                sx={{
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: 28,
                  color: isSaving ? "#bdbdbd" : "inherit",
                }}
                onClick={isSaving ? undefined : handleDrawerClose}
              />
            </IconButton>
          </DialogTitle>

          {/* =====================================================
      CONTENT
  ===================================================== */}

          <DialogContent
            dividers
            sx={{
              backgroundColor: "#f7f9fc",
            }}
          >
            {historyLoading ? (
              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* =================================================
            CURRENT INVOICE
        ================================================= */}

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    border: "1px solid #ddd",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#1976d2",
                      mb: 2,
                    }}
                  >
                    Current Invoice
                  </Typography>

                  {currentHistoryHeader ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 3,
                      }}
                    >
                      <Box>
                        <Typography color="text.secondary">
                          Invoice No
                        </Typography>

                        <Typography fontWeight={700}>
                          {currentHistoryHeader?.InvoiceNo ||
                            selectedHistoryInvoice?.InvoiceNo ||
                            "-"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography color="text.secondary">
                          Invoice Date
                        </Typography>

                        <Typography fontWeight={700}>
                          {formatHistoryDate(currentHistoryHeader?.InvoiceDate)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography color="text.secondary">Customer</Typography>

                        <Typography fontWeight={700}>
                          {currentHistoryHeader?.AccountName ||
                            currentHistoryHeader?.CustomerName ||
                            currentHistoryHeader?.accountDetails?.AccountName ||
                            "-"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography color="text.secondary">Total</Typography>

                        <Typography fontWeight={700} color="#1976d2">
                          ₹{" "}
                          {Number(currentHistoryHeader?.Total || 0).toFixed(2)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography color="text.secondary">Received</Typography>

                        <Typography fontWeight={700}>
                          ₹{" "}
                          {Number(
                            currentHistoryHeader?.ReceivedAmount || 0,
                          ).toFixed(2)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography color="text.secondary">Balance</Typography>

                        <Typography fontWeight={700} color="red">
                          ₹{" "}
                          {Math.max(
                            Number(currentHistoryHeader?.Total || 0) -
                              Number(currentHistoryHeader?.ReceivedAmount || 0),
                            0,
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Current invoice data not found.
                    </Typography>
                  )}
                </Paper>

                {/* =================================================
            PREVIOUS INVOICE HISTORY
        ================================================= */}

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    border: "1px solid #ddd",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#e67e00",
                      mb: 2,
                    }}
                  >
                    Previous Invoice History
                  </Typography>

                  {historyHeader.length === 0 ? (
                    <Typography color="text.secondary">
                      No previous invoice history found.
                    </Typography>
                  ) : (
                    <TableContainer component={Paper} elevation={0}>
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: "#e3f2fd",
                            }}
                          >
                            <TableCell>
                              <b>Version</b>
                            </TableCell>

                            <TableCell>
                              <b>Invoice No</b>
                            </TableCell>

                            <TableCell>
                              <b>Invoice Date</b>
                            </TableCell>

                            <TableCell>
                              <b>Customer</b>
                            </TableCell>

                            <TableCell>
                              <b>Total</b>
                            </TableCell>

                            <TableCell>
                              <b>Received</b>
                            </TableCell>

                            <TableCell align="center">
                              <b>View</b>
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {historyHeader
                            .slice()
                            .sort(
                              (a, b) =>
                                Number(a?.VersionNo || 0) -
                                Number(b?.VersionNo || 0),
                            )
                            .map((item, index) => {
                              const version =
                                Number(item?.VersionNo) || index + 1;

                              const isSelected =
                                Number(selectedHistoryVersion) === version;

                              return (
                                <TableRow
                                  key={item?.Id || `${version}-${index}`}
                                  sx={{
                                    backgroundColor: isSelected
                                      ? "#e3f2fd"
                                      : "transparent",
                                  }}
                                >
                                  <TableCell>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() =>
                                        handleHistoryVersionClick(item)
                                      }
                                      sx={{
                                        fontWeight: 700,
                                      }}
                                    >
                                      VERSION {version}
                                    </Button>
                                  </TableCell>

                                  <TableCell>
                                    {item?.InvoiceNo || "-"}
                                  </TableCell>

                                  <TableCell>
                                    {formatHistoryDate(item?.InvoiceDate)}
                                  </TableCell>

                                  <TableCell>
                                    {item?.AccountName ||
                                      item?.CustomerName ||
                                      item?.accountDetails?.AccountName ||
                                      "-"}
                                  </TableCell>

                                  <TableCell>
                                    ₹ {Number(item?.Total || 0).toFixed(2)}
                                  </TableCell>

                                  <TableCell>
                                    ₹{" "}
                                    {Number(item?.ReceivedAmount || 0).toFixed(
                                      2,
                                    )}
                                  </TableCell>

                                  <TableCell align="center">
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        handleHistoryVersionClick(item)
                                      }
                                    >
                                      VIEW
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>

                {/* =================================================
            PREVIOUS PRODUCT DETAILS
        ================================================= */}

                {selectedHistoryVersion !== null && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 2,
                      border: "1px solid #ddd",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#e67e00",
                        mb: 2,
                      }}
                    >
                      Previous Product Details — Version{" "}
                      {selectedHistoryVersion}
                    </Typography>

                    {selectedHistoryDetails.length === 0 ? (
                      <Typography color="text.secondary">
                        No previous product details found.
                      </Typography>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "#fff3e0",
                              }}
                            >
                              <TableCell>
                                <b>Product</b>
                              </TableCell>

                              <TableCell>
                                <b>Quantity</b>
                              </TableCell>

                              <TableCell>
                                <b>Rate</b>
                              </TableCell>

                              <TableCell>
                                <b>Amount</b>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {selectedHistoryDetails.map((detail, index) => {
                              const product = productOptions.find(
                                (option) =>
                                  String(option?.value) ===
                                  String(detail?.ProductId),
                              );

                              return (
                                <TableRow
                                  key={
                                    detail?.Id ||
                                    `${detail?.ProductId}-${index}`
                                  }
                                >
                                  <TableCell>
                                    {product?.label ||
                                      detail?.ProductName ||
                                      "Unknown"}
                                  </TableCell>

                                  <TableCell>
                                    {detail?.Quantity ?? detail?.Qty ?? "-"}
                                  </TableCell>

                                  <TableCell>
                                    ₹ {Number(detail?.Rate || 0).toFixed(2)}
                                  </TableCell>

                                  <TableCell>
                                    ₹ {Number(detail?.Amount || 0).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Paper>
                )}

                {/* =================================================
            CURRENT PRODUCT DETAILS
        ================================================= */}

                {selectedHistoryVersion !== null && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 2,
                      border: "1px solid #ddd",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#1976d2",
                        mb: 2,
                      }}
                    >
                      Current Product Details
                    </Typography>

                    {currentHistoryDetails.length === 0 ? (
                      <Typography color="text.secondary">
                        No current product details found.
                      </Typography>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "#e3f2fd",
                              }}
                            >
                              <TableCell>
                                <b>Product</b>
                              </TableCell>

                              <TableCell>
                                <b>Quantity</b>
                              </TableCell>

                              <TableCell>
                                <b>Rate</b>
                              </TableCell>

                              <TableCell>
                                <b>Amount</b>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {currentHistoryDetails.map((detail, index) => {
                              const product = productOptions.find(
                                (option) =>
                                  String(option?.value) ===
                                  String(detail?.ProductId),
                              );

                              return (
                                <TableRow
                                  key={
                                    detail?.Id ||
                                    `${detail?.ProductId}-${index}`
                                  }
                                >
                                  <TableCell>
                                    {product?.label ||
                                      detail?.ProductName ||
                                      "Unknown"}
                                  </TableCell>

                                  <TableCell>
                                    {detail?.Quantity ?? detail?.Qty ?? "-"}
                                  </TableCell>

                                  <TableCell>
                                    ₹ {Number(detail?.Rate || 0).toFixed(2)}
                                  </TableCell>

                                  <TableCell>
                                    ₹ {Number(detail?.Amount || 0).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Paper>
                )}

                {/* =================================================
            OLD VS CURRENT
        ================================================= */}

                {selectedHistoryVersion !== null &&
                  selectedHistoryDetails.length > 0 &&
                  currentHistoryDetails.length > 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 2,
                        border: "1px solid #ddd",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "22px",
                          fontWeight: 700,
                          color: "#7b1fa2",
                          mb: 2,
                        }}
                      >
                        Old vs Current Invoice
                      </Typography>

                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "#f3e5f5",
                              }}
                            >
                              <TableCell>
                                <b>Field</b>
                              </TableCell>

                              <TableCell>
                                <b>
                                  Previous — Version {selectedHistoryVersion}
                                </b>
                              </TableCell>

                              <TableCell>
                                <b>Current</b>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            <TableRow>
                              <TableCell>Product Count</TableCell>

                              <TableCell>
                                {selectedHistoryDetails.length}
                              </TableCell>

                              <TableCell>
                                {currentHistoryDetails.length}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>Total</TableCell>

                              <TableCell>
                                ₹{" "}
                                {Number(
                                  historyHeader.find(
                                    (h) =>
                                      Number(h?.VersionNo) ===
                                      Number(selectedHistoryVersion),
                                  )?.Total || 0,
                                ).toFixed(2)}
                              </TableCell>

                              <TableCell>
                                ₹{" "}
                                {Number(
                                  currentHistoryHeader?.Total || 0,
                                ).toFixed(2)}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>Received</TableCell>

                              <TableCell>
                                ₹{" "}
                                {Number(
                                  historyHeader.find(
                                    (h) =>
                                      Number(h?.VersionNo) ===
                                      Number(selectedHistoryVersion),
                                  )?.ReceivedAmount || 0,
                                ).toFixed(2)}
                              </TableCell>

                              <TableCell>
                                ₹{" "}
                                {Number(
                                  currentHistoryHeader?.ReceivedAmount || 0,
                                ).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  )}
              </>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setHistoryOpen(false);
                setSelectedHistoryVersion(null);
                setSelectedHistoryDetails([]);
              }}
            >
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
        {/* ==========================================
            DELETE CONFIRMATION DIALOG
        ========================================== */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Sales Entry?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
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

              {/* MINIMIZE */}
              <Tooltip title="Minimize Bill">
                <IconButton
                  onClick={handleMinimizeBill}
                  disabled={isSaving}
                  sx={{
                    color: "#1976d2",
                    width: 42,
                    height: 42,
                    borderRadius: "8px",

                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },

                    "&:disabled": {
                      color: "#bdbdbd",
                    },
                  }}
                >
                  <MinimizeIcon />
                </IconButton>
              </Tooltip>

              {/* CLOSE */}
              <CloseIcon
                sx={{
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: 28,
                  color: isSaving ? "#bdbdbd" : "inherit",
                }}
                onClick={isSaving ? undefined : handleDrawerClose}
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
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    mt: 0.5,
                  }}
                />
              </Box>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Time"
                  value={currentTime}
                  variant="standard"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* INVOICE DATE */}
              <Box flex={1}>
                <Typography variant="body2">Invoice Date</Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Invoice Date"
                    value={invoiceDate ? new Date(invoiceDate) : null}
                    format="dd-MM-yyyy"
                    disabled={!isAdmin}
                    onChange={(newValue) => {
                      setInvoiceDate(newValue);

                      setErrors((prev) => ({
                        ...prev,
                        invoiceDate: undefined,
                      }));
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
              <Box
                ref={customerDropdownRef}
                flex={1}
                position="relative"
                width="100%"
              >
                <Typography variant="body2">Customer</Typography>

                {/* =========================
      CUSTOMER MAIN FIELD
  ========================= */}

                <TextField
                  fullWidth
                  variant="standard"
                  size="small"
                  value={
                    selectedAccount
                      ? accountOptions.find(
                          ({ Id }) => String(Id) === String(selectedAccount),
                        )?.AccountName ||
                        selectedCustomerName ||
                        ""
                      : ""
                  }
                  placeholder="Select Customer"
                  InputProps={{
                    readOnly: true,
                  }}
                  onClick={() => {
                    setShowDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();

                      setShowDropdown(true);

                      setTimeout(() => {
                        const searchInput = document.querySelector(
                          'input[placeholder="Search Customer Name"]',
                        );

                        if (searchInput) {
                          searchInput.focus();
                          searchInput.select();
                        }
                      }, 100);
                    }

                    if (e.key === "Escape") {
                      e.preventDefault();
                      e.stopPropagation();

                      setShowDropdown(false);
                      setText("");
                    }
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

                {/* =========================
      CUSTOMER POPUP
  ========================= */}

                {showDropdown && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      maxHeight: 450,
                      overflowY: "auto",
                      zIndex: 9999,
                      mt: 1,
                      p: 2,
                    }}
                  >
                    {/* =========================
          SEARCH CUSTOMER
      ========================= */}

                    <TextField
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                      }}
                      size="small"
                      fullWidth
                      placeholder="Search Customer Name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* =========================
          CREATE NEW CUSTOMER
      ========================= */}

                    <Box display="flex" flexDirection="column" gap={1} mt={1}>
                      {/* NAME + ADD */}

                      <Box display="flex" gap={1}>
                        <TextField
                          value={accountName}
                          onChange={(e) => {
                            setAccountName(e.target.value);
                          }}
                          size="small"
                          placeholder="Create New Customer"
                          fullWidth
                        />

                        <Button
                          sx={{
                            background: "var(--primary-color)",

                            "&:hover": {
                              background: "var(--primary-color)",
                            },

                            minWidth: "95px",
                            whiteSpace: "nowrap",
                          }}
                          onClick={CreateCustomerMaster}
                          variant="contained"
                          startIcon={
                            <AddCircleIcon
                              sx={{
                                fontSize: "20px",
                              }}
                            />
                          }
                        >
                          ADD
                        </Button>
                      </Box>

                      {/* =========================
            ADDRESS
        ========================= */}

                      <TextField
                        value={newCustomerAddress}
                        onChange={(e) => {
                          setNewCustomerAddress(e.target.value);
                        }}
                        size="small"
                        placeholder="Customer Address"
                        fullWidth
                      />

                      {/* =========================
            MOBILE NUMBER
        ========================= */}

                      <PhoneInput
                        country={"in"}
                        value={newCustomerMobile}
                        onChange={(value) => {
                          setNewCustomerMobile(value);
                        }}
                        inputProps={{
                          name: "newCustomerMobile",
                        }}
                        inputStyle={{
                          width: "100%",
                          height: "40px",
                          fontSize: "16px",
                          borderRadius: "5px",
                        }}
                        buttonStyle={{
                          borderRadius: "5px",
                        }}
                        placeholder="Customer Mobile Number"
                      />

                      {/* =========================
            LAND PHONE / TELEPHONE
        ========================= */}
                    </Box>

                    {/* =========================
          CUSTOMER LIST
      ========================= */}

                    <Box mt={1}>
                      {accountOptions.length > 0 ? (
                        accountOptions.map((option) => {
                          const customerId = option.Id?.toString() || "";

                          const customerName = option.AccountName || "";

                          const addressData = option.addressDetails || {};

                          const customerAddress =
                            addressData.Address1 ||
                            addressData.address1 ||
                            addressData.Address ||
                            addressData.address ||
                            addressData.AddressLine1 ||
                            addressData.addressLine1 ||
                            option.Address1 ||
                            option.address1 ||
                            option.Address ||
                            option.address ||
                            "";

                          const customerMobile =
                            addressData.MobileNo ||
                            addressData.mobileNo ||
                            addressData.Mobile ||
                            addressData.mobile ||
                            option.MobileNo ||
                            option.mobileNo ||
                            option.Mobile ||
                            option.mobile ||
                            "";

                          return (
                            <MenuItem
                              key={option.Id}
                              onClick={() => {
                                // =========================
                                // SELECT CUSTOMER
                                // =========================

                                setSelectedAccount(customerId);

                                setSelectedCustomerName(customerName);

                                setSelectedCustomerAddress(customerAddress);

                                // =========================
                                // SET MOBILE
                                // =========================

                                if (customerMobile) {
                                  setPhone(customerMobile);
                                } else {
                                  fetchCustomerContact(customerId);
                                }

                                fetchAccounts(customerId);

                                fetchPreviousBalance(customerId);

                                // =========================
                                // CLOSE POPUP
                                // =========================

                                setShowDropdown(false);

                                setText("");
                              }}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                width: "100%",
                                py: 1,
                              }}
                            >
                              {/* CUSTOMER NAME */}

                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  width: "100%",
                                }}
                              >
                                {customerName}
                              </Typography>

                              {/* CUSTOMER ADDRESS */}

                              {customerAddress && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#777",
                                    fontSize: "13px",
                                    width: "100%",
                                    mt: 0.3,
                                  }}
                                >
                                  {customerAddress}
                                </Typography>
                              )}

                              {/* CUSTOMER MOBILE */}

                              {customerMobile && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#777",
                                    fontSize: "13px",
                                    width: "100%",
                                    mt: 0.2,
                                  }}
                                >
                                  Mobile: {customerMobile}
                                </Typography>
                              )}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <Typography
                          sx={{
                            p: 1,
                            color: "gray",
                          }}
                        >
                          No customers found
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                )}
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
                                  onWheel: preventNumberInputScroll,
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
                                    parseFloat(updatedRows[index].Quantity) ||
                                    0;

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
                                  onWheel: preventNumberInputScroll,
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
                                    // console.log("EDIT BUTTON INDEX:", index);
                                    // console.log("EDIT BUTTON ROW:", row);
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
                                  onFocus={() => {
                                    setProductDropdownOpen(true);
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
                                if (quantity === "" || Number(quantity) <= 0) {
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
                                onWheel: preventNumberInputScroll,
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
                              onWheel: preventNumberInputScroll,
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

                       
                        if (mode) {
                          setTimeout(() => {
                            discountRef.current?.focus();
                            discountRef.current?.select();
                          }, 100);
                        }
                      }}
                      onKeyDown={(e) => {
                       
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
                      inputProps={{
                        onWheel: preventNumberInputScroll,
                      }}
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
                          onWheel: preventNumberInputScroll,
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
                          onWheel: preventNumberInputScroll,
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
                            onWheel: preventNumberInputScroll,
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
                            // existing code
                          }}
                          inputProps={{
                            min: 0,
                            onWheel: preventNumberInputScroll,
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
                variant="contained"
                disabled={isSaving}
                onClick={(e) => handleSubmit(e, false)}
                sx={{
                  background: "var(--primary-color)",
                  minWidth: "105px",
                  height: "42px",

                  "&:hover": {
                    background: "var(--primary-color)",
                  },

                  "&:disabled": {
                    background: "#9e9e9e",
                    color: "#ffffff",
                    cursor: "not-allowed",
                  },
                }}
              >
                {isSaving ? (
                  <>
                    <CircularProgress
                      size={20}
                      thickness={4}
                      sx={{
                        color: "#ffffff",
                        mr: 1,
                      }}
                    />
                    Saving...
                  </>
                ) : isEditing ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>

              <Button
                sx={{
                  background: "var(--complementary-color)",
                  minWidth: "105px",

                  "&:disabled": {
                    background: "#9e9e9e",
                    color: "#ffffff",
                  },
                }}
                onClick={(e) => handleSubmit(e, true)}
                variant="contained"
                startIcon={
                  isSaving ? (
                    <CircularProgress
                      size={18}
                      thickness={4}
                      sx={{
                        color: "#ffffff",
                      }}
                    />
                  ) : (
                    <PrintIcon />
                  )
                }
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Print"}
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
