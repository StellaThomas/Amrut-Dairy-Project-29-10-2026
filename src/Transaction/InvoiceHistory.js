// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   FormControl,
//   Grid,
//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Paper,
//   Select,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";

// import HistoryIcon from "@mui/icons-material/History";
// import SearchIcon from "@mui/icons-material/Search";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CloseIcon from "@mui/icons-material/Close";
// import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import EditNoteIcon from "@mui/icons-material/EditNote";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import StorefrontIcon from "@mui/icons-material/Storefront";

// const API_BASE =
//   "https://amrutdairyapi.microtechsolutions.net.in/php";

// /* =========================================================
//    HELPER FUNCTIONS
// ========================================================= */

// const normalizeList = (responseData) => {
//   if (Array.isArray(responseData)) {
//     return responseData;
//   }

//   if (Array.isArray(responseData?.data)) {
//     return responseData.data;
//   }

//   if (responseData?.data) {
//     return [responseData.data];
//   }

//   if (responseData) {
//     return [responseData];
//   }

//   return [];
// };

// const normalizeOne = (responseData) => {
//   if (Array.isArray(responseData)) {
//     return responseData[0] || null;
//   }

//   if (Array.isArray(responseData?.data)) {
//     return responseData.data[0] || null;
//   }

//   return responseData?.data || responseData || null;
// };

// const getValue = (obj, keys, fallback = "") => {
//   for (const key of keys) {
//     if (
//       obj?.[key] !== undefined &&
//       obj?.[key] !== null &&
//       obj?.[key] !== ""
//     ) {
//       return obj[key];
//     }
//   }

//   return fallback;
// };

// const getInvoiceNo = (invoice) => {
//   return getValue(
//     invoice,
//     [
//       "InvoiceNo",
//       "InvoiceNumber",
//       "BillNo",
//       "BillNumber",
//       "Id",
//     ],
//     "-",
//   );
// };

// const getInvoiceId = (invoice) => {
//   return getValue(invoice, ["Id", "InvoiceId"], "");
// };

// const getCustomerName = (invoice) => {
//   return (
//     getValue(
//       invoice?.accountDetails,
//       ["AccountName", "accountName"],
//       "",
//     ) ||
//     getValue(
//       invoice,
//       ["AccountName", "CustomerName", "customerName"],
//       "",
//     ) ||
//     "Walk-in Customer"
//   );
// };

// const getCustomerType = (invoice) => {
//   return String(
//     getValue(
//       invoice?.addressDetails,
//       ["CustomerType", "customerType"],
//       "",
//     ) ||
//       getValue(
//         invoice?.accountDetails,
//         ["CustomerType", "customerType"],
//         "",
//       ) ||
//       getValue(
//         invoice,
//         ["CustomerType", "customerType"],
//         "",
//       ),
//   )
//     .trim()
//     .toUpperCase();
// };

// const getSaleTypeLabel = (type) => {
//   switch (String(type).toUpperCase()) {
//     case "R":
//       return "Regular";

//     case "D":
//       return "Dealer";

//     case "C":
//       return "Caterers";

//     default:
//       return "Other";
//   }
// };

// const getSaleTypeChip = (type) => {
//   switch (String(type).toUpperCase()) {
//     case "R":
//       return "Regular";

//     case "D":
//       return "Dealer";

//     case "C":
//       return "Caterers";

//     default:
//       return "Other";
//   }
// };

// const formatMoney = (value) => {
//   const number = Number(value || 0);

//   return `₹${number.toFixed(2)}`;
// };

// const formatDate = (value) => {
//   if (!value) {
//     return "-";
//   }

//   try {
//     let raw = value;

//     if (typeof value === "object" && value?.date) {
//       raw = value.date;
//     }

//     const date = new Date(raw);

//     if (Number.isNaN(date.getTime())) {
//       return String(raw);
//     }

//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   } catch {
//     return String(value);
//   }
// };

// const formatDateTime = (value) => {
//   if (!value) {
//     return "-";
//   }

//   try {
//     let raw = value;

//     if (typeof value === "object" && value?.date) {
//       raw = value.date;
//     }

//     const date = new Date(raw);

//     if (Number.isNaN(date.getTime())) {
//       return String(raw);
//     }

//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return String(value);
//   }
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// const InvoiceHistory = () => {
//   const navigate = useNavigate();

//   /* =======================================================
//      MAIN DATA
//   ======================================================= */

//   const [invoiceData, setInvoiceData] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [refreshing, setRefreshing] = useState(false);

//   /* =======================================================
//      FILTERS
//   ======================================================= */

//   const [searchText, setSearchText] = useState("");

//   const [saleType, setSaleType] = useState("");

//   const [fromDate, setFromDate] = useState("");

//   const [toDate, setToDate] = useState("");

//   /* =======================================================
//      HISTORY DIALOG
//   ======================================================= */

//   const [historyOpen, setHistoryOpen] = useState(false);

//   const [historyLoading, setHistoryLoading] = useState(false);

//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const [historyHeaders, setHistoryHeaders] = useState([]);

//   const [historyDetails, setHistoryDetails] = useState([]);

//   const [selectedVersion, setSelectedVersion] = useState(null);

//   const [selectedVersionDetails, setSelectedVersionDetails] =
//     useState([]);

//   const [currentHeader, setCurrentHeader] = useState(null);

//   const [currentDetails, setCurrentDetails] = useState([]);

//   /* =======================================================
//      PRODUCT MASTER
//   ======================================================= */

//   const [productOptions, setProductOptions] = useState([]);

//   /* =======================================================
//      PRODUCT NAME
//   ======================================================= */

//   const getProductNameById = (productId) => {
//     if (
//       productId === null ||
//       productId === undefined ||
//       productId === ""
//     ) {
//       return "-";
//     }

//     const matchedProduct = productOptions.find((product) => {
//       return (
//         String(product?.value) === String(productId) ||
//         String(product?.Id) === String(productId) ||
//         String(product?.ProductId) === String(productId)
//       );
//     });

//     return (
//       matchedProduct?.label ||
//       matchedProduct?.ProductName ||
//       "-"
//     );
//   };

//   /* =======================================================
//      FETCH PRODUCT MASTER
//   ======================================================= */

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(
//         `${API_BASE}/get/gettable.php?Table=ProductMaster&RateType=Retailer`,
//       );

//       const products = normalizeList(response.data);

//       setProductOptions(products);
//     } catch (error) {
//       console.error("PRODUCT MASTER ERROR:", error);
//     }
//   };

//   /* =======================================================
//      FETCH ALL INVOICE HEADERS
//   ======================================================= */

//   const fetchInvoices = async (isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       /* ----------------------------------------------------
//          FIRST PAGE
//       ---------------------------------------------------- */

//       const firstResponse = await axios.get(
//         `${API_BASE}/gettblpage.php?Table=invoiceheader&PageNo=1`,
//       );

//       const firstData = firstResponse.data;

//       const totalPages = Number(
//         firstData?.total_pages || 1,
//       );

//       /* ----------------------------------------------------
//          PAGE NUMBERS
//       ---------------------------------------------------- */

//       const pageNumbers = Array.from(
//         {
//           length: totalPages,
//         },
//         (_, index) => index + 1,
//       );

//       /* ----------------------------------------------------
//          FETCH ALL PAGES
//       ---------------------------------------------------- */

//       const pageResponses = await Promise.all(
//         pageNumbers.map(async (page) => {
//           try {
//             const response = await axios.get(
//               `${API_BASE}/gettblpage.php?Table=invoiceheader&PageNo=${page}`,
//             );

//             return response.data;
//           } catch (error) {
//             console.error(
//               `Invoice page ${page} error:`,
//               error,
//             );

//             return null;
//           }
//         }),
//       );

//       const allInvoices = pageResponses.flatMap(
//         (pageData) =>
//           Array.isArray(pageData?.data)
//             ? pageData.data
//             : [],
//       );

//       /* ----------------------------------------------------
//          GET ACCOUNT + ADDRESS + HISTORY STATUS
//       ---------------------------------------------------- */

//       const enrichedInvoices = await Promise.all(
//         allInvoices.map(async (invoice) => {
//           const invoiceId = getInvoiceId(invoice);

//           let accountDetails = null;

//           let addressDetails = null;

//           let hasHistory = false;

//           /* ================================================
//              ACCOUNT
//           ================================================= */

//           try {
//             if (
//               invoice?.AccountId &&
//               Number(invoice.AccountId) !== 0
//             ) {
//               const response = await axios.get(
//                 `${API_BASE}/getbyid.php?Table=Account&Colname=Id&Colvalue=${invoice.AccountId}`,
//               );

//               accountDetails = normalizeOne(
//                 response.data,
//               );
//             }
//           } catch (error) {
//             console.error(
//               `Account fetch failed ${invoiceId}:`,
//               error,
//             );
//           }

//           /* ================================================
//              ADDRESS
//           ================================================= */

//           try {
//             if (
//               invoice?.AccountId &&
//               Number(invoice.AccountId) !== 0
//             ) {
//               const response = await axios.get(
//                 `${API_BASE}/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${invoice.AccountId}`,
//               );

//               addressDetails = normalizeOne(
//                 response.data,
//               );
//             }
//           } catch (error) {
//             console.error(
//               `Address fetch failed ${invoiceId}:`,
//               error,
//             );
//           }

//           /* ================================================
//              HISTORY
//           ================================================= */

//           try {
//             if (invoiceId) {
//               const response = await axios.get(
//                 `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//               );

//               const historyList = normalizeList(
//                 response.data,
//               );

//               hasHistory = historyList.length > 0;
//             }
//           } catch (error) {
//             console.error(
//               `History check failed ${invoiceId}:`,
//               error,
//             );

//             hasHistory = false;
//           }

//           return {
//             ...invoice,

//             accountDetails,

//             addressDetails,

//             hasHistory,
//           };
//         }),
//       );

//       /* ----------------------------------------------------
//          ONLY EDITED INVOICES
//       ---------------------------------------------------- */

//       const editedInvoices = enrichedInvoices.filter(
//         (invoice) => invoice.hasHistory === true,
//       );

//       setInvoiceData(editedInvoices);
//     } catch (error) {
//       console.error(
//         "INVOICE HISTORY PAGE ERROR:",
//         error,
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     fetchProducts();

//     fetchInvoices();
//   }, []);

//   /* =======================================================
//      FILTER DATA
//   ======================================================= */

//   const filteredInvoices = useMemo(() => {
//     const search = searchText
//       .trim()
//       .toLowerCase();

//     return invoiceData.filter((invoice) => {
//       const invoiceNo = String(
//         getInvoiceNo(invoice),
//       ).toLowerCase();

//       const customerName = String(
//         getCustomerName(invoice),
//       ).toLowerCase();

//       const type = getCustomerType(invoice);

//       const typeLabel = getSaleTypeLabel(type)
//         .toLowerCase();

//       /* -----------------------------------------------
//          SEARCH
//       ------------------------------------------------ */

//       const searchMatch =
//         search === "" ||
//         invoiceNo.includes(search) ||
//         customerName.includes(search) ||
//         typeLabel.includes(search);

//       /* -----------------------------------------------
//          SALE TYPE
//       ------------------------------------------------ */

//       const saleTypeMatch =
//         saleType === "" ||
//         type === saleType;

//       /* -----------------------------------------------
//          DATE
//       ------------------------------------------------ */

//       let invoiceDate = "";

//       const rawDate = invoice?.InvoiceDate;

//       if (
//         typeof rawDate === "object" &&
//         rawDate?.date
//       ) {
//         invoiceDate = String(
//           rawDate.date,
//         ).substring(0, 10);
//       } else if (rawDate) {
//         invoiceDate = String(rawDate).substring(
//           0,
//           10,
//         );
//       }

//       const fromDateMatch =
//         fromDate === "" ||
//         invoiceDate >= fromDate;

//       const toDateMatch =
//         toDate === "" ||
//         invoiceDate <= toDate;

//       return (
//         searchMatch &&
//         saleTypeMatch &&
//         fromDateMatch &&
//         toDateMatch
//       );
//     });
//   }, [
//     invoiceData,
//     searchText,
//     saleType,
//     fromDate,
//     toDate,
//   ]);

//   /* =======================================================
//      RESET FILTERS
//   ======================================================= */

//   const resetFilters = () => {
//     setSearchText("");
//     setSaleType("");
//     setFromDate("");
//     setToDate("");
//   };

//   /* =======================================================
//      FETCH SINGLE INVOICE HISTORY
//   ======================================================= */

//   const handleViewHistory = async (invoice) => {
//     const invoiceId = getInvoiceId(invoice);

//     if (!invoiceId) {
//       return;
//     }

//     try {
//       setSelectedInvoice(invoice);

//       setHistoryOpen(true);

//       setHistoryLoading(true);

//       /* ----------------------------------------------------
//          RESET
//       ---------------------------------------------------- */

//       setHistoryHeaders([]);

//       setHistoryDetails([]);

//       setSelectedVersion(null);

//       setSelectedVersionDetails([]);

//       setCurrentHeader(null);

//       setCurrentDetails([]);

//       /* ====================================================
//          OLD HEADER HISTORY
//       ================================================== */

//       const oldHeaderResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const oldHeaders = normalizeList(
//         oldHeaderResponse.data,
//       );

//       setHistoryHeaders(oldHeaders);

//       /* ====================================================
//          OLD DETAIL HISTORY
//       ================================================== */

//       const oldDetailResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const oldDetails = normalizeList(
//         oldDetailResponse.data,
//       );

//       setHistoryDetails(oldDetails);

//       /* ====================================================
//          CURRENT HEADER
//       ================================================== */

//       const currentHeaderResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
//       );

//       const currentInvoiceHeader =
//         normalizeOne(
//           currentHeaderResponse.data,
//         );

//       setCurrentHeader(
//         currentInvoiceHeader,
//       );

//       /* ====================================================
//          CURRENT DETAILS
//       ================================================== */

//       const currentDetailResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const currentInvoiceDetails =
//         normalizeList(
//           currentDetailResponse.data,
//         );

//       setCurrentDetails(
//         currentInvoiceDetails,
//       );

//       /* ====================================================
//          AUTO SELECT LATEST VERSION
//       ================================================== */

//       if (oldHeaders.length > 0) {
//         const latestVersionItem =
//           [...oldHeaders].sort(
//             (a, b) =>
//               Number(
//                 b?.VersionNo || 0,
//               ) -
//               Number(
//                 a?.VersionNo || 0,
//               ),
//           )[0];

//         const latestVersion = Number(
//           latestVersionItem?.VersionNo,
//         );

//         if (latestVersion) {
//           setSelectedVersion(
//             latestVersion,
//           );

//           const latestDetails =
//             oldDetails.filter(
//               (detail) =>
//                 Number(
//                   detail?.VersionNo,
//                 ) === latestVersion,
//             );

//           setSelectedVersionDetails(
//             latestDetails,
//           );
//         }
//       }
//     } catch (error) {
//       console.error(
//         "SINGLE INVOICE HISTORY ERROR:",
//         error,
//       );
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   /* =======================================================
//      VERSION CLICK
//   ======================================================= */

//   const handleVersionClick = (historyItem) => {
//     const version = Number(
//       historyItem?.VersionNo,
//     );

//     if (!version) {
//       return;
//     }

//     setSelectedVersion(version);

//     const versionDetails =
//       historyDetails.filter(
//         (detail) =>
//           Number(detail?.VersionNo) ===
//           version,
//       );

//     setSelectedVersionDetails(
//       versionDetails,
//     );
//   };

//   /* =======================================================
//      CLOSE HISTORY
//   ======================================================= */

//   const closeHistory = () => {
//     setHistoryOpen(false);

//     setSelectedInvoice(null);

//     setHistoryHeaders([]);

//     setHistoryDetails([]);

//     setSelectedVersion(null);

//     setSelectedVersionDetails([]);

//     setCurrentHeader(null);

//     setCurrentDetails([]);
//   };

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, #f5f7fa 0%, #eef3f8 100%)",
//         p: {
//           xs: 1.5,
//           sm: 2.5,
//           md: 3,
//         },
//       }}
//     >
//       {/* =================================================
//           PAGE HEADER
//       ================================================= */}

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           mb: 3,
//           overflow: "hidden",
//           background:
//             "linear-gradient(135deg, #073b2a 0%, #0c6b4d 100%)",
//           color: "#fff",
//         }}
//       >
//         <CardContent
//           sx={{
//             p: {
//               xs: 2,
//               md: 3,
//             },
//           }}
//         >
//           <Stack
//             direction={{
//               xs: "column",
//               sm: "row",
//             }}
//             justifyContent="space-between"
//             alignItems={{
//               xs: "flex-start",
//               sm: "center",
//             }}
//             spacing={2}
//           >
//             <Stack
//               direction="row"
//               spacing={2}
//               alignItems="center"
//             >
//               <Box
//                 sx={{
//                   width: 52,
//                   height: 52,
//                   borderRadius: 3,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   background:
//                     "rgba(255,255,255,0.15)",
//                   backdropFilter:
//                     "blur(10px)",
//                 }}
//               >
//                 <HistoryIcon
//                   sx={{
//                     fontSize: 30,
//                   }}
//                 />
//               </Box>

//               <Box>
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontWeight: 800,
//                     fontSize: {
//                       xs: "1.5rem",
//                       md: "2rem",
//                     },
//                   }}
//                 >
//                   Invoice History
//                 </Typography>

//                 <Typography
//                   sx={{
//                     opacity: 0.85,
//                     mt: 0.5,
//                   }}
//                 >
//                   View edited invoices and
//                   previous versions
//                 </Typography>
//               </Box>
//             </Stack>

//             <Button
//               variant="contained"
//               startIcon={
//                 refreshing ? (
//                   <CircularProgress
//                     size={18}
//                     sx={{
//                       color: "#fff",
//                     }}
//                   />
//                 ) : (
//                   <RefreshIcon />
//                 )
//               }
//               onClick={() =>
//                 fetchInvoices(true)
//               }
//               disabled={refreshing}
//               sx={{
//                 borderRadius: 2.5,
//                 textTransform: "none",
//                 fontWeight: 700,
//                 px: 2.5,
//                 background:
//                   "rgba(255,255,255,0.16)",
//                 "&:hover": {
//                   background:
//                     "rgba(255,255,255,0.25)",
//                 },
//               }}
//             >
//               Refresh
//             </Button>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* =================================================
//           FILTER CARD
//       ================================================= */}

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           mb: 3,
//           border:
//             "1px solid rgba(0,0,0,0.06)",
//         }}
//       >
//         <CardContent
//           sx={{
//             p: {
//               xs: 2,
//               md: 2.5,
//             },
//           }}
//         >
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={1}
//             mb={2}
//           >
//             <StorefrontIcon
//               sx={{
//                 color: "#0c6b4d",
//               }}
//             />

//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 800,
//               }}
//             >
//               Search & Filter
//             </Typography>
//           </Stack>

//           <Grid
//             container
//             spacing={2}
//             alignItems="center"
//           >
//             {/* SEARCH */}

//             <Grid
//               item
//               xs={12}
//               md={4}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={searchText}
//                 onChange={(event) =>
//                   setSearchText(
//                     event.target.value,
//                   )
//                 }
//                 placeholder="Search Invoice / Customer"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>

//             {/* SALE TYPE */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <FormControl
//                 fullWidth
//                 size="small"
//               >
//                 <Select
//                   value={saleType}
//                   displayEmpty
//                   onChange={(event) =>
//                     setSaleType(
//                       event.target.value,
//                     )
//                   }
//                 >
//                   <MenuItem value="">
//                     All Sales
//                   </MenuItem>

//                   <MenuItem value="R">
//                     Regular
//                   </MenuItem>

//                   <MenuItem value="D">
//                     Dealer
//                   </MenuItem>

//                   <MenuItem value="C">
//                     Caterers
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* FROM DATE */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="date"
//                 label="From Date"
//                 value={fromDate}
//                 onChange={(event) =>
//                   setFromDate(
//                     event.target.value,
//                   )
//                 }
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//             </Grid>

//             {/* TO DATE */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="date"
//                 label="To Date"
//                 value={toDate}
//                 onChange={(event) =>
//                   setToDate(
//                     event.target.value,
//                   )
//                 }
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//             </Grid>

//             {/* RESET */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={
//                   <FilterAltOffIcon />
//                 }
//                 onClick={resetFilters}
//                 sx={{
//                   height: 40,
//                   borderRadius: 2,
//                   textTransform:
//                     "none",
//                   fontWeight: 700,
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* =================================================
//           SUMMARY CARDS
//       ================================================= */}

//       <Grid
//         container
//         spacing={2}
//         mb={3}
//       >
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={4}
//         >
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border:
//                 "1px solid rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardContent>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                   >
//                     Edited Invoices
//                   </Typography>

//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     {filteredInvoices.length}
//                   </Typography>
//                 </Box>

//                 <EditNoteIcon
//                   sx={{
//                     fontSize: 40,
//                     opacity: 0.35,
//                   }}
//                 />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={4}
//         >
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border:
//                 "1px solid rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardContent>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                   >
//                     Regular
//                   </Typography>

//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     {
//                       filteredInvoices.filter(
//                         (invoice) =>
//                           getCustomerType(
//                             invoice,
//                           ) === "R",
//                       ).length
//                     }
//                   </Typography>
//                 </Box>

//                 <ReceiptLongIcon
//                   sx={{
//                     fontSize: 40,
//                     opacity: 0.35,
//                   }}
//                 />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={4}
//         >
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border:
//                 "1px solid rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardContent>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                   >
//                     Dealer / Caterers
//                   </Typography>

//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     {
//                       filteredInvoices.filter(
//                         (invoice) =>
//                           ["D", "C"].includes(
//                             getCustomerType(
//                               invoice,
//                             ),
//                           ),
//                       ).length
//                     }
//                   </Typography>
//                 </Box>

//                 <HistoryIcon
//                   sx={{
//                     fontSize: 40,
//                     opacity: 0.35,
//                   }}
//                 />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* =================================================
//           MAIN TABLE
//       ================================================= */}

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           overflow: "hidden",
//           border:
//             "1px solid rgba(0,0,0,0.06)",
//         }}
//       >
//         <Box
//           sx={{
//             px: 2.5,
//             py: 2,
//             background:
//               "linear-gradient(90deg, #f7faf9, #eef5f2)",
//             borderBottom:
//               "1px solid rgba(0,0,0,0.06)",
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 800,
//             }}
//           >
//             Edited Invoice List
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//           >
//             Only invoices having edit history
//             are shown here.
//           </Typography>
//         </Box>

//         {loading ? (
//           <Box
//             sx={{
//               minHeight: 300,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//               gap: 2,
//             }}
//           >
//             <CircularProgress />

//             <Typography color="text.secondary">
//               Loading invoice history...
//             </Typography>
//           </Box>
//         ) : filteredInvoices.length === 0 ? (
//           <Box
//             sx={{
//               minHeight: 280,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//               gap: 1,
//             }}
//           >
//             <HistoryIcon
//               sx={{
//                 fontSize: 55,
//                 opacity: 0.25,
//               }}
//             />

//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 700,
//               }}
//             >
//               No edited invoices found
//             </Typography>

//             <Typography
//               color="text.secondary"
//             >
//               Try changing your filters.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer
//             sx={{
//               maxHeight: 620,
//             }}
//           >
//             <Table
//               stickyHeader
//               size="small"
//             >
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Invoice No
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Invoice Date
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Customer
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Sale Type
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Total
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Status
//                   </TableCell>

//                   <TableCell
//                     align="center"
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Action
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {filteredInvoices.map(
//                   (invoice) => {
//                     const type =
//                       getCustomerType(
//                         invoice,
//                       );

//                     const total = getValue(
//                       invoice,
//                       [
//                         "Total",
//                         "GrandTotal",
//                         "NetAmount",
//                       ],
//                       0,
//                     );

//                     return (
//                       <TableRow
//                         key={getInvoiceId(
//                           invoice,
//                         )}
//                         hover
//                         sx={{
//                           "&:hover": {
//                             background:
//                               "#f7fbf9",
//                           },
//                         }}
//                       >
//                         <TableCell>
//                           <Typography
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             #
//                             {getInvoiceNo(
//                               invoice,
//                             )}
//                           </Typography>
//                         </TableCell>

//                         <TableCell>
//                           <Stack
//                             direction="row"
//                             spacing={1}
//                             alignItems="center"
//                           >
//                             <CalendarMonthIcon
//                               sx={{
//                                 fontSize: 18,
//                                 opacity: 0.6,
//                               }}
//                             />

//                             <Typography>
//                               {formatDate(
//                                 invoice?.InvoiceDate,
//                               )}
//                             </Typography>
//                           </Stack>
//                         </TableCell>

//                         <TableCell>
//                           <Typography
//                             sx={{
//                               fontWeight: 600,
//                             }}
//                           >
//                             {getCustomerName(
//                               invoice,
//                             )}
//                           </Typography>
//                         </TableCell>

//                         <TableCell>
//                           <Chip
//                             label={getSaleTypeChip(
//                               type,
//                             )}
//                             size="small"
//                             variant="outlined"
//                             sx={{
//                               fontWeight: 700,
//                             }}
//                           />
//                         </TableCell>

//                         <TableCell align="right">
//                           <Typography
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             {formatMoney(
//                               total,
//                             )}
//                           </Typography>
//                         </TableCell>

//                         <TableCell>
//                           <Chip
//                             icon={
//                               <EditNoteIcon />
//                             }
//                             label="EDITED"
//                             size="small"
//                             sx={{
//                               fontWeight: 800,
//                               borderRadius: 2,
//                             }}
//                           />
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="View Invoice History">
//                             <Button
//                               variant="contained"
//                               size="small"
//                               startIcon={
//                                 <VisibilityIcon />
//                               }
//                               onClick={() =>
//                                 handleViewHistory(
//                                   invoice,
//                                 )
//                               }
//                               sx={{
//                                 borderRadius: 2,
//                                 textTransform:
//                                   "none",
//                                 fontWeight: 700,
//                               }}
//                             >
//                               View
//                             </Button>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   },
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Card>

//       {/* =================================================
//           HISTORY DIALOG
//       ================================================= */}

//       <Dialog
//         open={historyOpen}
//         onClose={closeHistory}
//         fullWidth
//         maxWidth="xl"
//         PaperProps={{
//           sx: {
//             borderRadius: 4,
//             overflow: "hidden",
//             maxHeight: "92vh",
//           },
//         }}
//       >
//         {/* DIALOG HEADER */}

//         <DialogTitle
//           sx={{
//             p: 0,
//           }}
//         >
//           <Box
//             sx={{
//               p: 2.5,
//               background:
//                 "linear-gradient(135deg, #073b2a 0%, #0c6b4d 100%)",
//               color: "#fff",
//             }}
//           >
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Stack
//                 direction="row"
//                 spacing={1.5}
//                 alignItems="center"
//               >
//                 <HistoryIcon />

//                 <Box>
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Invoice Edit History
//                   </Typography>

//                   <Typography
//                     sx={{
//                       opacity: 0.8,
//                     }}
//                   >
//                     Invoice No:{" "}
//                     {getInvoiceNo(
//                       selectedInvoice,
//                     )}
//                   </Typography>
//                 </Box>
//               </Stack>

//               <IconButton
//                 onClick={closeHistory}
//                 sx={{
//                   color: "#fff",
//                 }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Stack>
//           </Box>
//         </DialogTitle>

//         <DialogContent
//           dividers
//           sx={{
//             background: "#f7f9f8",
//             p: {
//               xs: 1.5,
//               md: 2.5,
//             },
//           }}
//         >
//           {historyLoading ? (
//             <Box
//               sx={{
//                 minHeight: 400,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 2,
//               }}
//             >
//               <CircularProgress />

//               <Typography>
//                 Loading invoice history...
//               </Typography>
//             </Box>
//           ) : (
//             <>
//               {/* =========================================
//                   INVOICE INFORMATION
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 800,
//                       mb: 1.5,
//                     }}
//                   >
//                     Invoice Information
//                   </Typography>

//                   <Stack
//                     direction={{
//                       xs: "column",
//                       sm: "row",
//                     }}
//                     spacing={2}
//                   >
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 1.5,
//                         flex: 1,
//                         background:
//                           "#eef4f1",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         Invoice No
//                       </Typography>

//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       >
//                         #
//                         {getInvoiceNo(
//                           selectedInvoice,
//                         )}
//                       </Typography>
//                     </Paper>

//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 1.5,
//                         flex: 1,
//                         background:
//                           "#eef4f1",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         Customer
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       >
//                         {getCustomerName(
//                           selectedInvoice,
//                         )}
//                       </Typography>
//                     </Paper>

//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 1.5,
//                         flex: 1,
//                         background:
//                           "#eef4f1",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         Sale Type
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       >
//                         {getSaleTypeLabel(
//                           getCustomerType(
//                             selectedInvoice,
//                           ),
//                         )}
//                       </Typography>
//                     </Paper>
//                   </Stack>
//                 </CardContent>
//               </Card>

//               {/* =========================================
//                   PREVIOUS PRODUCT DETAILS
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Stack
//                     direction={{
//                       xs: "column",
//                       sm: "row",
//                     }}
//                     justifyContent="space-between"
//                     spacing={1}
//                     mb={2}
//                   >
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: 800,
//                       }}
//                     >
//                       Previous Product Details
//                       {selectedVersion
//                         ? ` — Version ${selectedVersion}`
//                         : ""}
//                     </Typography>

//                     {selectedVersion && (
//                       <Chip
//                         label={`Version ${selectedVersion}`}
//                         color="warning"
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       />
//                     )}
//                   </Stack>

//                   {selectedVersionDetails.length ===
//                   0 ? (
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         background:
//                           "#fff8ed",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography color="text.secondary">
//                         No previous product
//                         details found.
//                       </Typography>
//                     </Paper>
//                   ) : (
//                     <TableContainer
//                       component={Paper}
//                       elevation={0}
//                       sx={{
//                         borderRadius: 2,
//                         border:
//                           "1px solid #e1e7e4",
//                       }}
//                     >
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Product
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Quantity
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Rate
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Amount
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {selectedVersionDetails.map(
//                             (item, index) => {
//                               const productId =
//                                 getValue(
//                                   item,
//                                   [
//                                     "ProductId",
//                                     "ProductID",
//                                     "productId",
//                                   ],
//                                   "",
//                                 );

//                               const quantity =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Quantity",
//                                     "Qty",
//                                     "quantity",
//                                   ],
//                                   0,
//                                 );

//                               const rate =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Rate",
//                                     "rate",
//                                     "Price",
//                                   ],
//                                   0,
//                                 );

//                               const amount =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Amount",
//                                     "amount",
//                                     "Total",
//                                   ],
//                                   Number(
//                                     quantity,
//                                   ) *
//                                     Number(
//                                       rate,
//                                     ),
//                                 );

//                               return (
//                                 <TableRow
//                                   key={`${productId}-${index}`}
//                                 >
//                                   <TableCell>
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {getProductNameById(
//                                         productId,
//                                       )}
//                                     </Typography>
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {Number(
//                                       quantity,
//                                     ).toFixed(
//                                       3,
//                                     )}
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {formatMoney(
//                                       rate,
//                                     )}
//                                   </TableCell>

//                                   <TableCell
//                                     align="right"
//                                   >
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {formatMoney(
//                                         amount,
//                                       )}
//                                     </Typography>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             },
//                           )}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* =========================================
//                   PREVIOUS INVOICE HISTORY
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 800,
//                       mb: 2,
//                     }}
//                   >
//                     Previous Invoice History
//                   </Typography>

//                   {historyHeaders.length ===
//                   0 ? (
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                       }}
//                     >
//                       <Typography color="text.secondary">
//                         No previous versions
//                         found.
//                       </Typography>
//                     </Paper>
//                   ) : (
//                     <TableContainer
//                       component={Paper}
//                       elevation={0}
//                       sx={{
//                         borderRadius: 2,
//                         border:
//                           "1px solid #e1e7e4",
//                       }}
//                     >
//                       <Table
//                         size="small"
//                         stickyHeader
//                       >
//                         <TableHead>
//                           <TableRow>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Version
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Invoice No
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Edit Date
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Total
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Received
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Payment Mode
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {[...historyHeaders]
//                             .sort(
//                               (a, b) =>
//                                 Number(
//                                   a?.VersionNo ||
//                                     0,
//                                 ) -
//                                 Number(
//                                   b?.VersionNo ||
//                                     0,
//                                 ),
//                             )
//                             .map(
//                               (
//                                 historyItem,
//                               ) => {
//                                 const version =
//                                   Number(
//                                     historyItem?.VersionNo,
//                                   );

//                                 const isSelected =
//                                   selectedVersion ===
//                                   version;

//                                 return (
//                                   <TableRow
//                                     key={`${historyItem?.InvoiceId}-${version}`}
//                                     hover
//                                     selected={
//                                       isSelected
//                                     }
//                                     onClick={() =>
//                                       handleVersionClick(
//                                         historyItem,
//                                       )
//                                     }
//                                     sx={{
//                                       cursor:
//                                         "pointer",
//                                     }}
//                                   >
//                                     <TableCell>
//                                       <Chip
//                                         label={`Version ${version}`}
//                                         color={
//                                           isSelected
//                                             ? "primary"
//                                             : "default"
//                                         }
//                                         variant={
//                                           isSelected
//                                             ? "filled"
//                                             : "outlined"
//                                         }
//                                         sx={{
//                                           fontWeight: 800,
//                                         }}
//                                       />
//                                     </TableCell>

//                                     <TableCell>
//                                       {getValue(
//                                         historyItem,
//                                         [
//                                           "InvoiceNo",
//                                           "InvoiceNumber",
//                                           "BillNo",
//                                         ],
//                                         getInvoiceNo(
//                                           selectedInvoice,
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell>
//                                       {formatDateTime(
//                                         getValue(
//                                           historyItem,
//                                           [
//                                             "CreatedDate",
//                                             "EditDate",
//                                             "UpdatedDate",
//                                           ],
//                                           "",
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell align="right">
//                                       {formatMoney(
//                                         getValue(
//                                           historyItem,
//                                           [
//                                             "Total",
//                                             "GrandTotal",
//                                             "NetAmount",
//                                           ],
//                                           0,
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell align="right">
//                                       {formatMoney(
//                                         getValue(
//                                           historyItem,
//                                           [
//                                             "ReceivedAmount",
//                                             "Received",
//                                             "ReceivedAmt",
//                                           ],
//                                           0,
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell>
//                                       {getValue(
//                                         historyItem,
//                                         [
//                                           "PaymentMode",
//                                           "paymentMode",
//                                         ],
//                                         "-",
//                                       )}
//                                     </TableCell>
//                                   </TableRow>
//                                 );
//                               },
//                             )}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* =========================================
//                   CURRENT PRODUCT DETAILS
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 800,
//                       mb: 2,
//                     }}
//                   >
//                     Current Product Details
//                   </Typography>

//                   {currentDetails.length ===
//                   0 ? (
//                     <Typography color="text.secondary">
//                       No current product details
//                       found.
//                     </Typography>
//                   ) : (
//                     <TableContainer
//                       component={Paper}
//                       elevation={0}
//                       sx={{
//                         borderRadius: 2,
//                         border:
//                           "1px solid #e1e7e4",
//                       }}
//                     >
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Product
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Quantity
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Rate
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Amount
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {currentDetails.map(
//                             (item, index) => {
//                               const productId =
//                                 getValue(
//                                   item,
//                                   [
//                                     "ProductId",
//                                     "ProductID",
//                                     "productId",
//                                   ],
//                                   "",
//                                 );

//                               const quantity =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Quantity",
//                                     "Qty",
//                                   ],
//                                   0,
//                                 );

//                               const rate =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Rate",
//                                     "Price",
//                                   ],
//                                   0,
//                                 );

//                               const amount =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Amount",
//                                     "Total",
//                                   ],
//                                   Number(
//                                     quantity,
//                                   ) *
//                                     Number(
//                                       rate,
//                                     ),
//                                 );

//                               return (
//                                 <TableRow
//                                   key={`${productId}-current-${index}`}
//                                 >
//                                   <TableCell>
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {getProductNameById(
//                                         productId,
//                                       )}
//                                     </Typography>
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {Number(
//                                       quantity,
//                                     ).toFixed(
//                                       3,
//                                     )}
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {formatMoney(
//                                       rate,
//                                     )}
//                                   </TableCell>

//                                   <TableCell
//                                     align="right"
//                                   >
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {formatMoney(
//                                         amount,
//                                       )}
//                                     </Typography>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             },
//                           )}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* =========================================
//                   CURRENT INVOICE
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 1,
//                   background:
//                     "linear-gradient(135deg, #073b2a 0%, #0c6b4d 100%)",
//                   color: "#fff",
//                 }}
//               >
//                 <CardContent>
//                   <Stack
//                     direction={{
//                       xs: "column",
//                       md: "row",
//                     }}
//                     justifyContent="space-between"
//                     spacing={2}
//                   >
//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 800,
//                           mb: 1,
//                         }}
//                       >
//                         Current Invoice
//                       </Typography>

//                       <Typography
//                         sx={{
//                           opacity: 0.8,
//                         }}
//                       >
//                         Latest saved invoice
//                         information
//                       </Typography>
//                     </Box>

//                     <Stack
//                       direction={{
//                         xs: "column",
//                         sm: "row",
//                       }}
//                       spacing={1.5}
//                     >
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           px: 2,
//                           py: 1.2,
//                           borderRadius: 2,
//                           background:
//                             "rgba(255,255,255,0.12)",
//                           color: "#fff",
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             opacity: 0.7,
//                           }}
//                         >
//                           Total
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontWeight: 800,
//                             fontSize:
//                               "1.15rem",
//                           }}
//                         >
//                           {formatMoney(
//                             getValue(
//                               currentHeader,
//                               [
//                                 "Total",
//                                 "GrandTotal",
//                                 "NetAmount",
//                               ],
//                               0,
//                             ),
//                           )}
//                         </Typography>
//                       </Paper>

//                       <Paper
//                         elevation={0}
//                         sx={{
//                           px: 2,
//                           py: 1.2,
//                           borderRadius: 2,
//                           background:
//                             "rgba(255,255,255,0.12)",
//                           color: "#fff",
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             opacity: 0.7,
//                           }}
//                         >
//                           Received
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontWeight: 800,
//                             fontSize:
//                               "1.15rem",
//                           }}
//                         >
//                           {formatMoney(
//                             getValue(
//                               currentHeader,
//                               [
//                                 "ReceivedAmount",
//                                 "Received",
//                                 "ReceivedAmt",
//                               ],
//                               0,
//                             ),
//                           )}
//                         </Typography>
//                       </Paper>

//                       <Paper
//                         elevation={0}
//                         sx={{
//                           px: 2,
//                           py: 1.2,
//                           borderRadius: 2,
//                           background:
//                             "rgba(255,255,255,0.12)",
//                           color: "#fff",
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             opacity: 0.7,
//                           }}
//                         >
//                           Payment Mode
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontWeight: 800,
//                             fontSize:
//                               "1.15rem",
//                           }}
//                         >
//                           {getValue(
//                             currentHeader,
//                             [
//                               "PaymentMode",
//                               "paymentMode",
//                             ],
//                             "-",
//                           )}
//                         </Typography>
//                       </Paper>
//                     </Stack>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </DialogContent>

//         <DialogActions
//           sx={{
//             p: 1.5,
//             background: "#fff",
//           }}
//         >
//           <Button
//             variant="outlined"
//             onClick={closeHistory}
//             sx={{
//               borderRadius: 2,
//               textTransform: "none",
//               fontWeight: 700,
//               px: 3,
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default InvoiceHistory;
























































































// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
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

//   // ADD THESE
//   Card,
//   CardContent,
//   Stack,
//   CircularProgress,
//   FormControl,
//   Select,
//   Tooltip,
//   Chip,
// } from "@mui/material";

// import HistoryIcon from "@mui/icons-material/History";
// import SearchIcon from "@mui/icons-material/Search";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CloseIcon from "@mui/icons-material/Close";
// import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import EditNoteIcon from "@mui/icons-material/EditNote";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import StorefrontIcon from "@mui/icons-material/Storefront";

// const API_BASE =
//   "https://amrutdairyapi.microtechsolutions.net.in/php";

// /* =========================================================
//    HELPER FUNCTIONS
// ========================================================= */

// const normalizeList = (responseData) => {
//   if (Array.isArray(responseData)) {
//     return responseData;
//   }

//   if (Array.isArray(responseData?.data)) {
//     return responseData.data;
//   }

//   if (responseData?.data) {
//     return [responseData.data];
//   }

//   if (responseData) {
//     return [responseData];
//   }

//   return [];
// };

// const normalizeOne = (responseData) => {
//   if (Array.isArray(responseData)) {
//     return responseData[0] || null;
//   }

//   if (Array.isArray(responseData?.data)) {
//     return responseData.data[0] || null;
//   }

//   return responseData?.data || responseData || null;
// };

// const getValue = (obj, keys, fallback = "") => {
//   for (const key of keys) {
//     if (
//       obj?.[key] !== undefined &&
//       obj?.[key] !== null &&
//       obj?.[key] !== ""
//     ) {
//       return obj[key];
//     }
//   }

//   return fallback;
// };

// const getInvoiceNo = (invoice) => {
//   return getValue(
//     invoice,
//     [
//       "InvoiceNo",
//       "InvoiceNumber",
//       "BillNo",
//       "BillNumber",
//       "Id",
//     ],
//     "-",
//   );
// };

// const getInvoiceId = (invoice) => {
//   return getValue(invoice, ["Id", "InvoiceId"], "");
// };



// const getCustomerName = (invoice) => {
//   return (
//     getValue(
//       invoice?.accountDetails,
//       [
//         "AccountName",
//         "accountName",
//         "Name",
//         "PartyName",
//         "CustomerName",
//       ],
//       ""
//     ) ||
//     getValue(
//       invoice,
//       [
//         "AccountName",
//         "CustomerName",
//         "customerName",
//         "PartyName",
//         "PartyName",
//         "Customer",
//       ],
//       ""
//     ) ||
//     "Walk-in Customer"
//   );
// };



// const getCustomerType = (invoice) => {
//   return String(
//     getValue(
//       invoice?.addressDetails,
//       [
//         "CustomerType",
//         "customerType",
//         "Type",
//         "SaleType",
//       ],
//       ""
//     ) ||
//       getValue(
//         invoice?.accountDetails,
//         [
//           "CustomerType",
//           "customerType",
//           "Type",
//           "SaleType",
//         ],
//         ""
//       ) ||
//       getValue(
//         invoice,
//         [
//           "CustomerType",
//           "customerType",
//           "SaleType",
//           "saleType",
//           "Type",
//           "type",
//           "CustomerCategory",
//           "Category",
//         ],
//         ""
//       )
//   )
//     .trim()
//     .toUpperCase();
// };


// const getSaleTypeLabel = (type) => {
//   switch (String(type).toUpperCase()) {
//     case "R":
//       return "Regular";

//     case "D":
//       return "Dealer";

//     case "C":
//       return "Caterers";

//     default:
//       return "Other";
//   }
// };

// const getSaleTypeChip = (type) => {
//   switch (String(type).toUpperCase()) {
//     case "R":
//       return "Regular";

//     case "D":
//       return "Dealer";

//     case "C":
//       return "Caterers";

//     default:
//       return "Other";
//   }
// };

// const formatMoney = (value) => {
//   const number = Number(value || 0);

//   return `₹${number.toFixed(2)}`;
// };

// const formatDate = (value) => {
//   if (!value) {
//     return "-";
//   }

//   try {
//     let raw = value;

//     if (typeof value === "object" && value?.date) {
//       raw = value.date;
//     }

//     const date = new Date(raw);

//     if (Number.isNaN(date.getTime())) {
//       return String(raw);
//     }

//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   } catch {
//     return String(value);
//   }
// };

// const formatDateTime = (value) => {
//   if (!value) {
//     return "-";
//   }

//   try {
//     let raw = value;

//     if (typeof value === "object" && value?.date) {
//       raw = value.date;
//     }

//     const date = new Date(raw);

//     if (Number.isNaN(date.getTime())) {
//       return String(raw);
//     }

//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return String(value);
//   }
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// const InvoiceHistory = () => {
//   const navigate = useNavigate();

//   /* =======================================================
//      MAIN DATA
//   ======================================================= */

//   const [invoiceData, setInvoiceData] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [refreshing, setRefreshing] = useState(false);

//   /* =======================================================
//      FILTERS
//   ======================================================= */

//   const [searchText, setSearchText] = useState("");

//   const [saleType, setSaleType] = useState("");

//   const [fromDate, setFromDate] = useState("");

//   const [toDate, setToDate] = useState("");

//   /* =======================================================
//      HISTORY DIALOG
//   ======================================================= */

//   const [historyOpen, setHistoryOpen] = useState(false);

//   const [historyLoading, setHistoryLoading] = useState(false);

//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const [historyHeaders, setHistoryHeaders] = useState([]);

//   const [historyDetails, setHistoryDetails] = useState([]);

//   const [selectedVersion, setSelectedVersion] = useState(null);

//   const [selectedVersionDetails, setSelectedVersionDetails] =
//     useState([]);

//   const [currentHeader, setCurrentHeader] = useState(null);

//   const [currentDetails, setCurrentDetails] = useState([]);

//   /* =======================================================
//      PRODUCT MASTER
//   ======================================================= */

//   const [productOptions, setProductOptions] = useState([]);




//   // =====================================================
// // GET PRODUCT NAME FROM PRODUCT ID - HISTORY
// // =====================================================
// const getHistoryProductName = (productId, detail = {}) => {
//   // If ProductId is missing, try ProductName directly
//   if (
//     productId === null ||
//     productId === undefined ||
//     productId === ""
//   ) {
//     return (
//       detail?.ProductName ||
//       detail?.productName ||
//       "-"
//     );
//   }

//   // Find product from Product Master options
//   const matchedProduct = productOptions.find((product) => {
//     return (
//       String(product?.value) === String(productId) ||
//       String(product?.Id) === String(productId) ||
//       String(product?.ProductId) === String(productId)
//     );
//   });

//   return (
//     matchedProduct?.label ||
//     matchedProduct?.ProductName ||
//     detail?.ProductName ||
//     detail?.productName ||
//     "-"
//   );
// };




// // =====================================================
// // HEADER CHANGE COMPARISON
// // =====================================================

// const getInvoiceHeaderChanges = () => {
//   if (!selectedVersion || !currentHeader) {
//     return [];
//   }

//   const oldHeader = historyHeaders.find(
//     (item) =>
//       Number(item?.VersionNo) === Number(selectedVersion)
//   );

//   if (!oldHeader) {
//     return [];
//   }

//   const fields = [
//     {
//       label: "Invoice Date",
//       oldValue: oldHeader?.InvoiceDate,
//       newValue: currentHeader?.InvoiceDate,
//     },
//     {
//       label: "Customer",
//       oldValue:
//         oldHeader?.AccountName ||
//         oldHeader?.CustomerName ||
//         oldHeader?.PartyName ||
//         "-",
//       newValue:
//         currentHeader?.AccountName ||
//         currentHeader?.CustomerName ||
//         currentHeader?.PartyName ||
//         selectedInvoice?.AccountName ||
//         "-",
//     },
//     {
//       label: "Total",
//       oldValue: oldHeader?.Total ?? 0,
//       newValue: currentHeader?.Total ?? 0,
//     },
//     {
//       label: "Received",
//       oldValue: oldHeader?.ReceivedAmount ?? 0,
//       newValue: currentHeader?.ReceivedAmount ?? 0,
//     },
//     {
//       label: "Discount",
//       oldValue: oldHeader?.Discount ?? 0,
//       newValue: currentHeader?.Discount ?? 0,
//     },
//     {
//       label: "Payment Mode",
//       oldValue:
//         oldHeader?.PaymentMode ||
//         oldHeader?.paymentMode ||
//         "-",
//       newValue:
//         currentHeader?.PaymentMode ||
//         currentHeader?.paymentMode ||
//         "-",
//     },
//     {
//       label: "Transport",
//       oldValue: oldHeader?.Transport ?? 0,
//       newValue: currentHeader?.Transport ?? 0,
//     },
//     {
//       label: "CGST",
//       oldValue: oldHeader?.CGSTAmount ?? 0,
//       newValue: currentHeader?.CGSTAmount ?? 0,
//     },
//     {
//       label: "SGST",
//       oldValue: oldHeader?.SGSTAmount ?? 0,
//       newValue: currentHeader?.SGSTAmount ?? 0,
//     },
//     {
//       label: "IGST",
//       oldValue: oldHeader?.IGSTAmount ?? 0,
//       newValue: currentHeader?.IGSTAmount ?? 0,
//     },
//   ];

//   return fields.filter(
//     (field) =>
//       String(field.oldValue ?? "").trim() !==
//       String(field.newValue ?? "").trim()
//   );
// };


// // =====================================================
// // HISTORY COMPARISON HELPERS
// // =====================================================

// const normalizeHistoryValue = (value) => {
//   if (
//     value === null ||
//     value === undefined ||
//     value === ""
//   ) {
//     return "";
//   }

//   if (
//     typeof value === "object" &&
//     value?.date
//   ) {
//     return String(value.date);
//   }

//   return String(value).trim();
// };

// const historyValueChanged = (oldValue, newValue) => {
//   return (
//     normalizeHistoryValue(oldValue) !==
//     normalizeHistoryValue(newValue)
//   );
// };







// // =====================================================
// // PRODUCT COMPARISON
// // =====================================================



//   /* =======================================================
//      PRODUCT NAME
//   ======================================================= */

//   const getProductNameById = (productId) => {
//     if (
//       productId === null ||
//       productId === undefined ||
//       productId === ""
//     ) {
//       return "-";
//     }

//     const matchedProduct = productOptions.find((product) => {
//       return (
//         String(product?.value) === String(productId) ||
//         String(product?.Id) === String(productId) ||
//         String(product?.ProductId) === String(productId)
//       );
//     });

//     return (
//       matchedProduct?.label ||
//       matchedProduct?.ProductName ||
//       "-"
//     );
//   };


// // =====================================================
// // HEADER CHANGE COMPARISON
// // =====================================================
// const getHeaderChanges = () => {
//   if (!selectedVersion || !currentHeader) {
//     return [];
//   }

//   const previousHeader = historyHeaders.find(
//     (item) =>
//       Number(item?.VersionNo) === Number(selectedVersion)
//   );

//   if (!previousHeader) {
//     return [];
//   }

//   const fields = [
//     {
//       label: "Invoice Date",
//       oldValue: previousHeader?.InvoiceDate,
//       currentValue: currentHeader?.InvoiceDate,
//     },
//     {
//       label: "Customer",
//       oldValue:
//         previousHeader?.AccountName ||
//         previousHeader?.CustomerName ||
//         "-",
//       currentValue:
//         currentHeader?.AccountName ||
//         currentHeader?.CustomerName ||
//         getCustomerName(selectedInvoice) ||
//         "-",
//     },
//     {
//       label: "Total",
//       oldValue:
//         previousHeader?.Total ||
//         previousHeader?.GrandTotal ||
//         previousHeader?.NetAmount ||
//         0,
//       currentValue:
//         currentHeader?.Total ||
//         currentHeader?.GrandTotal ||
//         currentHeader?.NetAmount ||
//         0,
//     },
//     {
//       label: "Received Amount",
//       oldValue:
//         previousHeader?.ReceivedAmount ||
//         previousHeader?.Received ||
//         previousHeader?.ReceivedAmt ||
//         0,
//       currentValue:
//         currentHeader?.ReceivedAmount ||
//         currentHeader?.Received ||
//         currentHeader?.ReceivedAmt ||
//         0,
//     },
//     {
//       label: "Discount",
//       oldValue: previousHeader?.Discount || 0,
//       currentValue: currentHeader?.Discount || 0,
//     },
//     {
//       label: "Payment Mode",
//       oldValue:
//         previousHeader?.PaymentMode ||
//         previousHeader?.paymentMode ||
//         "-",
//       currentValue:
//         currentHeader?.PaymentMode ||
//         currentHeader?.paymentMode ||
//         "-",
//     },
//     {
//       label: "Transport",
//       oldValue: previousHeader?.Transport || 0,
//       currentValue: currentHeader?.Transport || 0,
//     },
//     {
//       label: "CGST",
//       oldValue: previousHeader?.CGSTAmount || 0,
//       currentValue: currentHeader?.CGSTAmount || 0,
//     },
//     {
//       label: "SGST",
//       oldValue: previousHeader?.SGSTAmount || 0,
//       currentValue: currentHeader?.SGSTAmount || 0,
//     },
//     {
//       label: "IGST",
//       oldValue: previousHeader?.IGSTAmount || 0,
//       currentValue: currentHeader?.IGSTAmount || 0,
//     },
//   ];

//   return fields.map((item) => ({
//     ...item,
//     changed: isValueChanged(
//       item.oldValue,
//       item.currentValue
//     ),
//   }));
// };

// // =====================================================
// // PRODUCT CHANGE COMPARISON
// // =====================================================
// const getProductChanges = () => {
//   if (!selectedVersion) {
//     return [];
//   }

//   const oldProducts = selectedVersionDetails || [];
//   const newProducts = currentDetails || [];

//   const getProductId = (item) =>
//     String(
//       getValue(
//         item,
//         [
//           "ProductId",
//           "ProductID",
//           "productId",
//         ],
//         ""
//       )
//     );

//   const result = [];

//   // ---------------------------------------------
//   // OLD PRODUCTS
//   // ---------------------------------------------
//   oldProducts.forEach((oldItem) => {
//     const productId = getProductId(oldItem);

//     const currentItem = newProducts.find(
//       (item) =>
//         getProductId(item) === productId
//     );

//     if (!currentItem) {
//       result.push({
//         productId,
//         productName: getProductNameById(productId),
//         status: "REMOVED",
//         oldQty: getValue(
//           oldItem,
//           ["Quantity", "Qty"],
//           0
//         ),
//         currentQty: "-",
//         oldRate: getValue(
//           oldItem,
//           ["Rate", "Price"],
//           0
//         ),
//         currentRate: "-",
//       });

//       return;
//     }

//     const oldQty = getValue(
//       oldItem,
//       ["Quantity", "Qty"],
//       0
//     );

//     const currentQty = getValue(
//       currentItem,
//       ["Quantity", "Qty"],
//       0
//     );

//     const oldRate = getValue(
//       oldItem,
//       ["Rate", "Price"],
//       0
//     );

//     const currentRate = getValue(
//       currentItem,
//       ["Rate", "Price"],
//       0
//     );

//     const qtyChanged = isValueChanged(
//       oldQty,
//       currentQty
//     );

//     const rateChanged = isValueChanged(
//       oldRate,
//       currentRate
//     );

//     if (qtyChanged || rateChanged) {
//       result.push({
//         productId,
//         productName: getProductNameById(productId),
//         status: "CHANGED",
//         oldQty,
//         currentQty,
//         oldRate,
//         currentRate,
//       });
//     }
//   });

//   // ---------------------------------------------
//   // NEW PRODUCTS
//   // ---------------------------------------------
//   newProducts.forEach((currentItem) => {
//     const productId = getProductId(currentItem);

//     const oldItem = oldProducts.find(
//       (item) =>
//         getProductId(item) === productId
//     );

//     if (!oldItem) {
//       result.push({
//         productId,
//         productName: getProductNameById(productId),
//         status: "ADDED",
//         oldQty: "-",
//         currentQty: getValue(
//           currentItem,
//           ["Quantity", "Qty"],
//           0
//         ),
//         oldRate: "-",
//         currentRate: getValue(
//           currentItem,
//           ["Rate", "Price"],
//           0
//         ),
//       });
//     }
//   });

//   return result;
// };


// /* =========================================================
//    COMPARE HELPERS
// ========================================================= */

// const normalizeCompareValue = (value) => {
//   if (
//     value === null ||
//     value === undefined ||
//     value === ""
//   ) {
//     return "";
//   }

//   if (
//     typeof value === "object" &&
//     value?.date
//   ) {
//     return String(value.date);
//   }

//   return String(value).trim();
// };

// const getComparableValue = (
//   obj,
//   keys,
//   fallback = ""
// ) => {
//   return getValue(obj, keys, fallback);
// };

// const isValueChanged = (oldValue, newValue) => {
//   return (
//     normalizeCompareValue(oldValue) !==
//     normalizeCompareValue(newValue)
//   );
// };



//   /* =======================================================
//      FETCH PRODUCT MASTER
//   ======================================================= */

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(
//         `${API_BASE}/get/gettable.php?Table=ProductMaster&RateType=Retailer`,
//       );

//      const invoices = response.data;

//       const products = normalizeList(response.data);

//       setProductOptions(products);
//     } catch (error) {
//       console.error("PRODUCT MASTER ERROR:", error);
//     }
//   };

//   /* =======================================================
//      FETCH ALL INVOICE HEADERS
//   ======================================================= */

//   const fetchInvoices = async (isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       /* ----------------------------------------------------
//          FIRST PAGE
//       ---------------------------------------------------- */

//      const firstResponse = await axios.get(
//   `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=1`,
// );

//       const firstData = firstResponse.data;

//       const totalPages = Number(
//         firstData?.total_pages || 1,
//       );

//       /* ----------------------------------------------------
//          PAGE NUMBERS
//       ---------------------------------------------------- */

//       const pageNumbers = Array.from(
//         {
//           length: totalPages,
//         },
//         (_, index) => index + 1,
//       );

//       /* ----------------------------------------------------
//          FETCH ALL PAGES
//       ---------------------------------------------------- */

//       const pageResponses = await Promise.all(
//         pageNumbers.map(async (page) => {
//           try {
//            const response = await axios.get(
//   `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=${page}`,
// );

//             return response.data;
//           } catch (error) {
//             console.error(
//               `Invoice page ${page} error:`,
//               error,
//             );

//             return null;
//           }
//         }),
//       );

//       const allInvoices = pageResponses.flatMap(
//         (pageData) =>
//           Array.isArray(pageData?.data)
//             ? pageData.data
//             : [],
//       );



//       console.log(
//   "TOTAL_INVOICES_FROM_API:",
//   allInvoices.length,
//   allInvoices
// );

//       /* ----------------------------------------------------
//          GET ACCOUNT + ADDRESS + HISTORY STATUS
//       ---------------------------------------------------- */

//       const enrichedInvoices = await Promise.all(
//         allInvoices.map(async (invoice) => {
//           const invoiceId = getInvoiceId(invoice);

//           let accountDetails = null;

//           let addressDetails = null;

//           let hasHistory = false;

//           /* ================================================
//              ACCOUNT
//           ================================================= */

//           try {
//             if (
//               invoice?.AccountId &&
//               Number(invoice.AccountId) !== 0
//             ) {

//              const response = await axios.get(
//   `${API_BASE}/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//     invoice.AccountId
//   )}`,
// );

            



//               accountDetails = normalizeOne(
//                 response.data,
//               );
//             }
//           } catch (error) {
//             console.error(
//               `Account fetch failed ${invoiceId}:`,
//               error,
//             );
//           }

//           /* ================================================
//              ADDRESS
//           ================================================= */

//           try {
//             if (
//               invoice?.AccountId &&
//               Number(invoice.AccountId) !== 0
//             ) {
//               const response = await axios.get(
//                 `${API_BASE}/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${invoice.AccountId}`,
//               );

//               addressDetails = normalizeOne(
//                 response.data,
//               );
//             }
//           } catch (error) {
//             console.error(
//               `Address fetch failed ${invoiceId}:`,
//               error,
//             );
//           }

//           /* ================================================
//              HISTORY
//           ================================================= */

//          /* ================================================
//    INVOICE HISTORY CHECK
// ================================================ */

// try {
//   if (invoiceId) {
//     const response = await axios.get(
//       `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`
//     );

//     const historyList = normalizeList(response.data);

//     console.log("HISTORY_CHECK:", {
//       invoiceId: invoiceId,
//       invoiceNo: getInvoiceNo(invoice),
//       historyCount: historyList.length,
//       historyList: historyList,
//     });

//     hasHistory = historyList.length > 0;
//   } else {
//     hasHistory = false;
//   }
// } catch (error) {
//   console.error(
//     `History check failed for InvoiceId ${invoiceId}:`,
//     error
//   );

//   hasHistory = false;
// }
         

//           return {
//             ...invoice,

//             accountDetails,

//             addressDetails,

//             hasHistory,
//           };
//         }),
//       );

//       /* ----------------------------------------------------
//          ONLY EDITED INVOICES
//       ---------------------------------------------------- */

//       const editedInvoices = enrichedInvoices.filter(
//         (invoice) => invoice.hasHistory === true,
//       );

// console.log(
//   "EDITED_INVOICES:",
//   editedInvoices.length,
//   editedInvoices
// );


//       setInvoiceData(editedInvoices);
//     } catch (error) {
//       console.error(
//         "INVOICE HISTORY PAGE ERROR:",
//         error,
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     fetchProducts();

//     fetchInvoices();
//   }, []);

//   /* =======================================================
//      FILTER DATA
//   ======================================================= */

//   const filteredInvoices = useMemo(() => {
//     const search = searchText
//       .trim()
//       .toLowerCase();

//     return invoiceData.filter((invoice) => {
//       const invoiceNo = String(
//         getInvoiceNo(invoice),
//       ).toLowerCase();

//       const customerName = String(
//         getCustomerName(invoice),
//       ).toLowerCase();

//       const type = getCustomerType(invoice);

//       const typeLabel = getSaleTypeLabel(type)
//         .toLowerCase();

//       /* -----------------------------------------------
//          SEARCH
//       ------------------------------------------------ */

//       const searchMatch =
//         search === "" ||
//         invoiceNo.includes(search) ||
//         customerName.includes(search) ||
//         typeLabel.includes(search);

//       /* -----------------------------------------------
//          SALE TYPE
//       ------------------------------------------------ */

//       const saleTypeMatch =
//         saleType === "" ||
//         type === saleType;

//       /* -----------------------------------------------
//          DATE
//       ------------------------------------------------ */

//       let invoiceDate = "";

//       const rawDate = invoice?.InvoiceDate;

//       if (
//         typeof rawDate === "object" &&
//         rawDate?.date
//       ) {
//         invoiceDate = String(
//           rawDate.date,
//         ).substring(0, 10);
//       } else if (rawDate) {
//         invoiceDate = String(rawDate).substring(
//           0,
//           10,
//         );
//       }

//       const fromDateMatch =
//         fromDate === "" ||
//         invoiceDate >= fromDate;

//       const toDateMatch =
//         toDate === "" ||
//         invoiceDate <= toDate;

//       return (
//         searchMatch &&
//         saleTypeMatch &&
//         fromDateMatch &&
//         toDateMatch
//       );
//     });
//   }, [
//     invoiceData,
//     searchText,
//     saleType,
//     fromDate,
//     toDate,
//   ]);

//   /* =======================================================
//      RESET FILTERS
//   ======================================================= */

//   const resetFilters = () => {
//     setSearchText("");
//     setSaleType("");
//     setFromDate("");
//     setToDate("");
//   };

//   /* =======================================================
//      FETCH SINGLE INVOICE HISTORY
//   ======================================================= */

//   const handleViewHistory = async (invoice) => {
//     const invoiceId = getInvoiceId(invoice);

//     if (!invoiceId) {
//       return;
//     }

//     try {
//       setSelectedInvoice(invoice);

//       setHistoryOpen(true);

//       setHistoryLoading(true);

//       /* ----------------------------------------------------
//          RESET
//       ---------------------------------------------------- */

//       setHistoryHeaders([]);

//       setHistoryDetails([]);

//       setSelectedVersion(null);

//       setSelectedVersionDetails([]);

//       setCurrentHeader(null);

//       setCurrentDetails([]);

//       /* ====================================================
//          OLD HEADER HISTORY
//       ================================================== */

//       const oldHeaderResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const oldHeaders = normalizeList(
//         oldHeaderResponse.data,
//       );

//       setHistoryHeaders(oldHeaders);

//       /* ====================================================
//          OLD DETAIL HISTORY
//       ================================================== */

//       const oldDetailResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const oldDetails = normalizeList(
//         oldDetailResponse.data,
//       );

//       setHistoryDetails(oldDetails);

//       /* ====================================================
//          CURRENT HEADER
//       ================================================== */

//       const currentHeaderResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`,
//       );

//       const currentInvoiceHeader =
//         normalizeOne(
//           currentHeaderResponse.data,
//         );

//       setCurrentHeader(
//         currentInvoiceHeader,
//       );

//       /* ====================================================
//          CURRENT DETAILS
//       ================================================== */

//       const currentDetailResponse = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`,
//       );

//       const currentInvoiceDetails =
//         normalizeList(
//           currentDetailResponse.data,
//         );

//       setCurrentDetails(
//         currentInvoiceDetails,
//       );

//       /* ====================================================
//          AUTO SELECT LATEST VERSION
//       ================================================== */

//       if (oldHeaders.length > 0) {
//         const latestVersionItem =
//           [...oldHeaders].sort(
//             (a, b) =>
//               Number(
//                 b?.VersionNo || 0,
//               ) -
//               Number(
//                 a?.VersionNo || 0,
//               ),
//           )[0];

//         const latestVersion = Number(
//           latestVersionItem?.VersionNo,
//         );

//         if (latestVersion) {
//           setSelectedVersion(
//             latestVersion,
//           );

//           const latestDetails =
//             oldDetails.filter(
//               (detail) =>
//                 Number(
//                   detail?.VersionNo,
//                 ) === latestVersion,
//             );

//           setSelectedVersionDetails(
//             latestDetails,
//           );
//         }
//       }
//     } catch (error) {
//       console.error(
//         "SINGLE INVOICE HISTORY ERROR:",
//         error,
//       );
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   /* =======================================================
//      VERSION CLICK
//   ======================================================= */

//   const handleVersionClick = (historyItem) => {
//     const version = Number(
//       historyItem?.VersionNo,
//     );

//     if (!version) {
//       return;
//     }

//     setSelectedVersion(version);

//     const versionDetails =
//       historyDetails.filter(
//         (detail) =>
//           Number(detail?.VersionNo) ===
//           version,
//       );

//     setSelectedVersionDetails(
//       versionDetails,
//     );
//   };

//   /* =======================================================
//      CLOSE HISTORY
//   ======================================================= */

//   const closeHistory = () => {
//     setHistoryOpen(false);

//     setSelectedInvoice(null);

//     setHistoryHeaders([]);

//     setHistoryDetails([]);

//     setSelectedVersion(null);

//     setSelectedVersionDetails([]);

//     setCurrentHeader(null);

//     setCurrentDetails([]);
//   };

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, #f5f7fa 0%, #eef3f8 100%)",
//         p: {
//           xs: 1.5,
//           sm: 2.5,
//           md: 3,
//         },
//       }}
//     >
//       {/* =================================================
//           PAGE HEADER
//       ================================================= */}

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           mb: 3,
//           overflow: "hidden",
//           background:
//             "linear-gradient(135deg, #073b2a 0%, #0c6b4d 100%)",
//           color: "#fff",
//         }}
//       >
//         <CardContent
//           sx={{
//             p: {
//               xs: 2,
//               md: 3,
//             },
//           }}
//         >
//           <Stack
//             direction={{
//               xs: "column",
//               sm: "row",
//             }}
//             justifyContent="space-between"
//             alignItems={{
//               xs: "flex-start",
//               sm: "center",
//             }}
//             spacing={2}
//           >
//             <Stack
//               direction="row"
//               spacing={2}
//               alignItems="center"
//             >
//               <Box
//                 sx={{
//                   width: 52,
//                   height: 52,
//                   borderRadius: 3,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   background:
//                     "rgba(255,255,255,0.15)",
//                   backdropFilter:
//                     "blur(10px)",
//                 }}
//               >
//                 <HistoryIcon
//                   sx={{
//                     fontSize: 30,
//                   }}
//                 />
//               </Box>

//               <Box>
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontWeight: 800,
//                     fontSize: {
//                       xs: "1.5rem",
//                       md: "2rem",
//                     },
//                   }}
//                 >
//                   Invoice History
//                 </Typography>

//                 <Typography
//                   sx={{
//                     opacity: 0.85,
//                     mt: 0.5,
//                   }}
//                 >
//                   View edited invoices and
//                   previous versions
//                 </Typography>
//               </Box>
//             </Stack>

//             <Button
//               variant="contained"
//               startIcon={
//                 refreshing ? (
//                   <CircularProgress
//                     size={18}
//                     sx={{
//                       color: "#fff",
//                     }}
//                   />
//                 ) : (
//                   <RefreshIcon />
//                 )
//               }
//               onClick={() =>
//                 fetchInvoices(true)
//               }
//               disabled={refreshing}
//               sx={{
//                 borderRadius: 2.5,
//                 textTransform: "none",
//                 fontWeight: 700,
//                 px: 2.5,
//                 background:
//                   "rgba(255,255,255,0.16)",
//                 "&:hover": {
//                   background:
//                     "rgba(255,255,255,0.25)",
//                 },
//               }}
//             >
//               Refresh
//             </Button>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* =================================================
//           FILTER CARD
//       ================================================= */}

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           mb: 3,
//           border:
//             "1px solid rgba(0,0,0,0.06)",
//         }}
//       >
//         <CardContent
//           sx={{
//             p: {
//               xs: 2,
//               md: 2.5,
//             },
//           }}
//         >
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={1}
//             mb={2}
//           >
//             <StorefrontIcon
//               sx={{
//                 color: "#0c6b4d",
//               }}
//             />

//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 800,
//               }}
//             >
//               Search & Filter
//             </Typography>
//           </Stack>

//           <Grid
//             container
//             spacing={2}
//             alignItems="center"
//           >
//             {/* SEARCH */}

//             <Grid
//               item
//               xs={12}
//               md={4}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={searchText}
//                 onChange={(event) =>
//                   setSearchText(
//                     event.target.value,
//                   )
//                 }
//                 placeholder="Search Invoice / Customer"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>

//             {/* SALE TYPE */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <FormControl
//                 fullWidth
//                 size="small"
//               >
//                 <Select
//                   value={saleType}
//                   displayEmpty
//                   onChange={(event) =>
//                     setSaleType(
//                       event.target.value,
//                     )
//                   }
//                 >
//                   <MenuItem value="">
//                     All Sales
//                   </MenuItem>

//                   <MenuItem value="R">
//                     Regular
//                   </MenuItem>

//                   <MenuItem value="D">
//                     Dealer
//                   </MenuItem>

//                   <MenuItem value="C">
//                     Caterers
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* FROM DATE */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="date"
//                 label="From Date"
//                 value={fromDate}
//                 onChange={(event) =>
//                   setFromDate(
//                     event.target.value,
//                   )
//                 }
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//             </Grid>

//             {/* TO DATE */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="date"
//                 label="To Date"
//                 value={toDate}
//                 onChange={(event) =>
//                   setToDate(
//                     event.target.value,
//                   )
//                 }
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//             </Grid>

//             {/* RESET */}

//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={2}
//             >
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={
//                   <FilterAltOffIcon />
//                 }
//                 onClick={resetFilters}
//                 sx={{
//                   height: 40,
//                   borderRadius: 2,
//                   textTransform:
//                     "none",
//                   fontWeight: 700,
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* =================================================
//           SUMMARY CARDS
//       ================================================= */}

//       <Grid
//         container
//         spacing={2}
//         mb={3}
//       >
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={4}
//         >
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border:
//                 "1px solid rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardContent>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                   >
//                     Edited Invoices
//                   </Typography>

//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     {filteredInvoices.length}
//                   </Typography>
//                 </Box>

//                 <EditNoteIcon
//                   sx={{
//                     fontSize: 40,
//                     opacity: 0.35,
//                   }}
//                 />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={4}
//         >
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border:
//                 "1px solid rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardContent>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                   >
//                     Regular
//                   </Typography>

//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     {
//                       filteredInvoices.filter(
//                         (invoice) =>
//                           getCustomerType(
//                             invoice,
//                           ) === "R",
//                       ).length
//                     }
//                   </Typography>
//                 </Box>

//                 <ReceiptLongIcon
//                   sx={{
//                     fontSize: 40,
//                     opacity: 0.35,
//                   }}
//                 />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={4}
//         >
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border:
//                 "1px solid rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardContent>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                   >
//                     Dealer / Caterers
//                   </Typography>

//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 800,
//                       mt: 0.5,
//                     }}
//                   >
//                     {
//                       filteredInvoices.filter(
//                         (invoice) =>
//                           ["D", "C"].includes(
//                             getCustomerType(
//                               invoice,
//                             ),
//                           ),
//                       ).length
//                     }
//                   </Typography>
//                 </Box>

//                 <HistoryIcon
//                   sx={{
//                     fontSize: 40,
//                     opacity: 0.35,
//                   }}
//                 />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* =================================================
//           MAIN TABLE
//       ================================================= */}

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           overflow: "hidden",
//           border:
//             "1px solid rgba(0,0,0,0.06)",
//         }}
//       >
//         <Box
//           sx={{
//             px: 2.5,
//             py: 2,
//             background:
//               "linear-gradient(90deg, #f7faf9, #eef5f2)",
//             borderBottom:
//               "1px solid rgba(0,0,0,0.06)",
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 800,
//             }}
//           >
//             Edited Invoice List
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//           >
//             Only invoices having edit history
//             are shown here.
//           </Typography>
//         </Box>

//         {loading ? (
//           <Box
//             sx={{
//               minHeight: 300,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//               gap: 2,
//             }}
//           >
//             <CircularProgress />

//             <Typography color="text.secondary">
//               Loading invoice history...
//             </Typography>
//           </Box>
//         ) : filteredInvoices.length === 0 ? (
//           <Box
//             sx={{
//               minHeight: 280,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//               gap: 1,
//             }}
//           >
//             <HistoryIcon
//               sx={{
//                 fontSize: 55,
//                 opacity: 0.25,
//               }}
//             />

//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 700,
//               }}
//             >
//               No edited invoices found
//             </Typography>

//             <Typography
//               color="text.secondary"
//             >
//               Try changing your filters.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer
//             sx={{
//               maxHeight: 620,
//             }}
//           >
//             <Table
//               stickyHeader
//               size="small"
//             >
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Invoice No
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Invoice Date
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Customer
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Sale Type
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Total
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Status
//                   </TableCell>

//                   <TableCell
//                     align="center"
//                     sx={{
//                       fontWeight: 800,
//                       background:
//                         "#eaf1ee",
//                     }}
//                   >
//                     Action
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {filteredInvoices.map(
//                   (invoice) => {
//                     const type =
//                       getCustomerType(
//                         invoice,
//                       );

//                     const total = getValue(
//                       invoice,
//                       [
//                         "Total",
//                         "GrandTotal",
//                         "NetAmount",
//                       ],
//                       0,
//                     );

//                     return (
//                       <TableRow
//                         key={getInvoiceId(
//                           invoice,
//                         )}
//                         hover
//                         sx={{
//                           "&:hover": {
//                             background:
//                               "#f7fbf9",
//                           },
//                         }}
//                       >
//                         <TableCell>
//                           <Typography
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             #
//                             {getInvoiceNo(
//                               invoice,
//                             )}
//                           </Typography>
//                         </TableCell>

//                         <TableCell>
//                           <Stack
//                             direction="row"
//                             spacing={1}
//                             alignItems="center"
//                           >
//                             <CalendarMonthIcon
//                               sx={{
//                                 fontSize: 18,
//                                 opacity: 0.6,
//                               }}
//                             />

//                             <Typography>
//                               {formatDate(
//                                 invoice?.InvoiceDate,
//                               )}
//                             </Typography>
//                           </Stack>
//                         </TableCell>

//                         <TableCell>
//                           <Typography
//                             sx={{
//                               fontWeight: 600,
//                             }}
//                           >
//                             {getCustomerName(
//                               invoice,
//                             )}
//                           </Typography>
//                         </TableCell>

//                         <TableCell>
//                           <Chip
//                             label={getSaleTypeChip(
//                               type,
//                             )}
//                             size="small"
//                             variant="outlined"
//                             sx={{
//                               fontWeight: 700,
//                             }}
//                           />
//                         </TableCell>

//                         <TableCell align="right">
//                           <Typography
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             {formatMoney(
//                               total,
//                             )}
//                           </Typography>
//                         </TableCell>

//                         <TableCell>
//                           <Chip
//                             icon={
//                               <EditNoteIcon />
//                             }
//                             label="EDITED"
//                             size="small"
//                             sx={{
//                               fontWeight: 800,
//                               borderRadius: 2,
//                             }}
//                           />
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="View Invoice History">
//                             <Button
//                               variant="contained"
//                               size="small"
//                               startIcon={
//                                 <VisibilityIcon />
//                               }
//                               onClick={() =>
//                                 handleViewHistory(
//                                   invoice,
//                                 )
//                               }
//                               sx={{
//                                 borderRadius: 2,
//                                 textTransform:
//                                   "none",
//                                 fontWeight: 700,
//                               }}
//                             >
//                               View
//                             </Button>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   },
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Card>

//       {/* =================================================
//           HISTORY DIALOG
//       ================================================= */}

//       <Dialog
//         open={historyOpen}
//         onClose={closeHistory}
//         fullWidth
//         maxWidth="xl"
//         PaperProps={{
//           sx: {
//             borderRadius: 4,
//             overflow: "hidden",
//             maxHeight: "92vh",
//           },
//         }}
//       >
//         {/* DIALOG HEADER */}

//         <DialogTitle
//           sx={{
//             p: 0,
//           }}
//         >
//           <Box
//             sx={{
//               p: 2.5,
//               background:
//                 "linear-gradient(135deg, #073b2a 0%, #0c6b4d 100%)",
//               color: "#fff",
//             }}
//           >
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Stack
//                 direction="row"
//                 spacing={1.5}
//                 alignItems="center"
//               >
//                 <HistoryIcon />

//                 <Box>
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Invoice Edit History
//                   </Typography>

//                   <Typography
//                     sx={{
//                       opacity: 0.8,
//                     }}
//                   >
//                     Invoice No:{" "}
//                     {getInvoiceNo(
//                       selectedInvoice,
//                     )}
//                   </Typography>
//                 </Box>
//               </Stack>

//               <IconButton
//                 onClick={closeHistory}
//                 sx={{
//                   color: "#fff",
//                 }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Stack>
//           </Box>
//         </DialogTitle>

//         <DialogContent
//           dividers
//           sx={{
//             background: "#f7f9f8",
//             p: {
//               xs: 1.5,
//               md: 2.5,
//             },
//           }}
//         >
//           {historyLoading ? (
//             <Box
//               sx={{
//                 minHeight: 400,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 2,
//               }}
//             >
//               <CircularProgress />

//               <Typography>
//                 Loading invoice history...
//               </Typography>
//             </Box>
//           ) : (
//             <>
//               {/* =========================================
//                   INVOICE INFORMATION
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 800,
//                       mb: 1.5,
//                     }}
//                   >
//                     Invoice Information
//                   </Typography>

//                   <Stack
//                     direction={{
//                       xs: "column",
//                       sm: "row",
//                     }}
//                     spacing={2}
//                   >
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 1.5,
//                         flex: 1,
//                         background:
//                           "#eef4f1",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         Invoice No
//                       </Typography>

//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       >
//                         #
//                         {getInvoiceNo(
//                           selectedInvoice,
//                         )}
//                       </Typography>
//                     </Paper>

//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 1.5,
//                         flex: 1,
//                         background:
//                           "#eef4f1",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         Customer
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       >
//                         {getCustomerName(
//                           selectedInvoice,
//                         )}
//                       </Typography>
//                     </Paper>

//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 1.5,
//                         flex: 1,
//                         background:
//                           "#eef4f1",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         Sale Type
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       >
//                         {getSaleTypeLabel(
//                           getCustomerType(
//                             selectedInvoice,
//                           ),
//                         )}
//                       </Typography>
//                     </Paper>
//                   </Stack>
//                 </CardContent>
//               </Card>

//               {/* =========================================
//                   PREVIOUS PRODUCT DETAILS
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Stack
//                     direction={{
//                       xs: "column",
//                       sm: "row",
//                     }}
//                     justifyContent="space-between"
//                     spacing={1}
//                     mb={2}
//                   >
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: 800,
//                       }}
//                     >
//                       Previous Product Details
//                       {selectedVersion
//                         ? ` — Version ${selectedVersion}`
//                         : ""}
//                     </Typography>

//                     {selectedVersion && (
//                       <Chip
//                         label={`Version ${selectedVersion}`}
//                         color="warning"
//                         sx={{
//                           fontWeight: 800,
//                         }}
//                       />
//                     )}
//                   </Stack>

//                   {selectedVersionDetails.length ===
//                   0 ? (
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         background:
//                           "#fff8ed",
//                         borderRadius: 2,
//                       }}
//                     >
//                       <Typography color="text.secondary">
//                         No previous product
//                         details found.
//                       </Typography>
//                     </Paper>
//                   ) : (
//                     <TableContainer
//                       component={Paper}
//                       elevation={0}
//                       sx={{
//                         borderRadius: 2,
//                         border:
//                           "1px solid #e1e7e4",
//                       }}
//                     >
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Product
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Quantity
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Rate
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#f0f4f2",
//                               }}
//                             >
//                               Amount
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {selectedVersionDetails.map(
//                             (item, index) => {
//                               const productId =
//                                 getValue(
//                                   item,
//                                   [
//                                     "ProductId",
//                                     "ProductID",
//                                     "productId",
//                                   ],
//                                   "",
//                                 );

//                               const quantity =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Quantity",
//                                     "Qty",
//                                     "quantity",
//                                   ],
//                                   0,
//                                 );

//                               const rate =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Rate",
//                                     "rate",
//                                     "Price",
//                                   ],
//                                   0,
//                                 );

//                               const amount =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Amount",
//                                     "amount",
//                                     "Total",
//                                   ],
//                                   Number(
//                                     quantity,
//                                   ) *
//                                     Number(
//                                       rate,
//                                     ),
//                                 );

//                               return (
//                                 <TableRow
//                                   key={`${productId}-${index}`}
//                                 >
//                                   <TableCell>
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {getProductNameById(
//                                         productId,
//                                       )}
//                                     </Typography>
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {Number(
//                                       quantity,
//                                     ).toFixed(
//                                       3,
//                                     )}
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {formatMoney(
//                                       rate,
//                                     )}
//                                   </TableCell>

//                                   <TableCell
//                                     align="right"
//                                   >
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {formatMoney(
//                                         amount,
//                                       )}
//                                     </Typography>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             },
//                           )}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* =========================================
//                   PREVIOUS INVOICE HISTORY
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 800,
//                       mb: 2,
//                     }}
//                   >
//                     Previous Invoice History
//                   </Typography>

//                   {historyHeaders.length ===
//                   0 ? (
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                       }}
//                     >
//                       <Typography color="text.secondary">
//                         No previous versions
//                         found.
//                       </Typography>
//                     </Paper>
//                   ) : (
//                     <TableContainer
//                       component={Paper}
//                       elevation={0}
//                       sx={{
//                         borderRadius: 2,
//                         border:
//                           "1px solid #e1e7e4",
//                       }}
//                     >
//                       <Table
//                         size="small"
//                         stickyHeader
//                       >
//                         <TableHead>
//                           <TableRow>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Version
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Invoice No
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Edit Date
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Total
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Received
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Payment Mode
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {[...historyHeaders]
//                             .sort(
//                               (a, b) =>
//                                 Number(
//                                   a?.VersionNo ||
//                                     0,
//                                 ) -
//                                 Number(
//                                   b?.VersionNo ||
//                                     0,
//                                 ),
//                             )
//                             .map(
//                               (
//                                 historyItem,
//                               ) => {
//                                 const version =
//                                   Number(
//                                     historyItem?.VersionNo,
//                                   );

//                                 const isSelected =
//                                   selectedVersion ===
//                                   version;

//                                 return (
//                                   <TableRow
//                                     key={`${historyItem?.InvoiceId}-${version}`}
//                                     hover
//                                     selected={
//                                       isSelected
//                                     }
//                                     onClick={() =>
//                                       handleVersionClick(
//                                         historyItem,
//                                       )
//                                     }
//                                     sx={{
//                                       cursor:
//                                         "pointer",
//                                     }}
//                                   >
//                                     <TableCell>
//                                       <Chip
//                                         label={`Version ${version}`}
//                                         color={
//                                           isSelected
//                                             ? "primary"
//                                             : "default"
//                                         }
//                                         variant={
//                                           isSelected
//                                             ? "filled"
//                                             : "outlined"
//                                         }
//                                         sx={{
//                                           fontWeight: 800,
//                                         }}
//                                       />
//                                     </TableCell>

//                                     <TableCell>
//                                       {getValue(
//                                         historyItem,
//                                         [
//                                           "InvoiceNo",
//                                           "InvoiceNumber",
//                                           "BillNo",
//                                         ],
//                                         getInvoiceNo(
//                                           selectedInvoice,
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell>
//                                       {formatDateTime(
//                                         getValue(
//                                           historyItem,
//                                           [
//                                             "CreatedDate",
//                                             "EditDate",
//                                             "UpdatedDate",
//                                           ],
//                                           "",
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell align="right">
//                                       {formatMoney(
//                                         getValue(
//                                           historyItem,
//                                           [
//                                             "Total",
//                                             "GrandTotal",
//                                             "NetAmount",
//                                           ],
//                                           0,
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell align="right">
//                                       {formatMoney(
//                                         getValue(
//                                           historyItem,
//                                           [
//                                             "ReceivedAmount",
//                                             "Received",
//                                             "ReceivedAmt",
//                                           ],
//                                           0,
//                                         ),
//                                       )}
//                                     </TableCell>

//                                     <TableCell>
//                                       {getValue(
//                                         historyItem,
//                                         [
//                                           "PaymentMode",
//                                           "paymentMode",
//                                         ],
//                                         "-",
//                                       )}
//                                     </TableCell>
//                                   </TableRow>
//                                 );
//                               },
//                             )}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* =========================================
//                   CURRENT PRODUCT DETAILS
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 800,
//                       mb: 2,
//                     }}
//                   >
//                     Current Product Details
//                   </Typography>

//                   {currentDetails.length ===
//                   0 ? (
//                     <Typography color="text.secondary">
//                       No current product details
//                       found.
//                     </Typography>
//                   ) : (
//                     <TableContainer
//                       component={Paper}
//                       elevation={0}
//                       sx={{
//                         borderRadius: 2,
//                         border:
//                           "1px solid #e1e7e4",
//                       }}
//                     >
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Product
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Quantity
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Rate
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{
//                                 fontWeight: 800,
//                                 background:
//                                   "#eef4f1",
//                               }}
//                             >
//                               Amount
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>

//                         <TableBody>
//                           {currentDetails.map(
//                             (item, index) => {
//                               const productId =
//                                 getValue(
//                                   item,
//                                   [
//                                     "ProductId",
//                                     "ProductID",
//                                     "productId",
//                                   ],
//                                   "",
//                                 );

//                               const quantity =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Quantity",
//                                     "Qty",
//                                   ],
//                                   0,
//                                 );

//                               const rate =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Rate",
//                                     "Price",
//                                   ],
//                                   0,
//                                 );

//                               const amount =
//                                 getValue(
//                                   item,
//                                   [
//                                     "Amount",
//                                     "Total",
//                                   ],
//                                   Number(
//                                     quantity,
//                                   ) *
//                                     Number(
//                                       rate,
//                                     ),
//                                 );

//                               return (
//                                 <TableRow
//                                   key={`${productId}-current-${index}`}
//                                 >
//                                   <TableCell>
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {getProductNameById(
//                                         productId,
//                                       )}
//                                     </Typography>
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {Number(
//                                       quantity,
//                                     ).toFixed(
//                                       3,
//                                     )}
//                                   </TableCell>

//                                   <TableCell align="right">
//                                     {formatMoney(
//                                       rate,
//                                     )}
//                                   </TableCell>

//                                   <TableCell
//                                     align="right"
//                                   >
//                                     <Typography
//                                       sx={{
//                                         fontWeight: 700,
//                                       }}
//                                     >
//                                       {formatMoney(
//                                         amount,
//                                       )}
//                                     </Typography>
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             },
//                           )}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   )}
//                 </CardContent>
// {/* =================================================
//     CHANGE SUMMARY
// ================================================= */}

// {selectedVersion && (
//   <Card
//     elevation={0}
//     sx={{
//       borderRadius: 3,
//       mb: 2,
//       border: "1px solid #e1e7e4",
//     }}
//   >
//     <CardContent>

//       <Typography
//         variant="h6"
//         sx={{
//           fontWeight: 800,
//           mb: 2,
//           color: "#1565c0",
//         }}
//       >
//         Change Summary
//       </Typography>

//       {/* ==========================================
//           HEADER CHANGES
//       ========================================== */}

//       <Typography
//         sx={{
//           fontWeight: 800,
//           mb: 1.5,
//         }}
//       >
//         Invoice Changes
//       </Typography>

//       {getHeaderChanges()
//         .filter((item) => item.changed)
//         .map((item) => (
//           <Paper
//             key={item.label}
//             elevation={0}
//             sx={{
//               p: 1.5,
//               mb: 1,
//               borderRadius: 2,
//               background: "#fff8e1",
//               border: "1px solid #ffe082",
//             }}
//           >
//             <Grid
//               container
//               spacing={2}
//               alignItems="center"
//             >
//               <Grid item xs={12} md={3}>
//                 <Typography fontWeight={800}>
//                   {item.label}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <Typography>
//                   Previous:
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontWeight: 700,
//                     color: "#d84315",
//                   }}
//                 >
//                   {String(item.oldValue ?? "-")}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <Typography>
//                   Current:
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontWeight: 700,
//                     color: "#2e7d32",
//                   }}
//                 >
//                   {String(item.currentValue ?? "-")}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} md={1}>
//                 <Chip
//                   label="CHANGED"
//                   color="warning"
//                   size="small"
//                   sx={{
//                     fontWeight: 800,
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         ))}

//       {getHeaderChanges().filter(
//         (item) => item.changed
//       ).length === 0 && (
//         <Typography
//           color="text.secondary"
//           sx={{ mb: 3 }}
//         >
//           No invoice header changes.
//         </Typography>
//       )}

//       {/* ==========================================
//           PRODUCT CHANGES
//       ========================================== */}

//       <Typography
//         sx={{
//           fontWeight: 800,
//           mt: 3,
//           mb: 1.5,
//         }}
//       >
//         Product Changes
//       </Typography>

//       {getProductChanges().map((item) => (
//         <Paper
//           key={`${item.productId}-${item.status}`}
//           elevation={0}
//           sx={{
//             p: 1.5,
//             mb: 1,
//             borderRadius: 2,

//             background:
//               item.status === "ADDED"
//                 ? "#e8f5e9"
//                 : item.status === "REMOVED"
//                 ? "#ffebee"
//                 : "#fff8e1",

//             border:
//               item.status === "ADDED"
//                 ? "1px solid #a5d6a7"
//                 : item.status === "REMOVED"
//                 ? "1px solid #ef9a9a"
//                 : "1px solid #ffe082",
//           }}
//         >
//           <Grid
//             container
//             spacing={2}
//             alignItems="center"
//           >
//             <Grid item xs={12} md={3}>
//               <Typography fontWeight={800}>
//                 {item.productName}
//               </Typography>
//             </Grid>

//             <Grid item xs={6} md={2}>
//               <Typography variant="caption">
//                 Old Qty
//               </Typography>

//               <Typography fontWeight={700}>
//                 {item.oldQty}
//               </Typography>
//             </Grid>

//             <Grid item xs={6} md={2}>
//               <Typography variant="caption">
//                 New Qty
//               </Typography>

//               <Typography fontWeight={700}>
//                 {item.currentQty}
//               </Typography>
//             </Grid>

//             <Grid item xs={6} md={2}>
//               <Typography variant="caption">
//                 Old Rate
//               </Typography>

//               <Typography fontWeight={700}>
//                 ₹{item.oldRate}
//               </Typography>
//             </Grid>

//             <Grid item xs={6} md={2}>
//               <Typography variant="caption">
//                 New Rate
//               </Typography>

//               <Typography fontWeight={700}>
//                 ₹{item.currentRate}
//               </Typography>
//             </Grid>

//             <Grid item xs={12} md={1}>
//               <Chip
//                 label={item.status}
//                 size="small"
//                 color={
//                   item.status === "ADDED"
//                     ? "success"
//                     : item.status === "REMOVED"
//                     ? "error"
//                     : "warning"
//                 }
//                 sx={{
//                   fontWeight: 800,
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </Paper>
//       ))}

//       {getProductChanges().length === 0 && (
//         <Typography color="text.secondary">
//           No product changes.
//         </Typography>
//       )}

//     </CardContent>
//   </Card>
// )}
              
//               </Card>

//               {/* =========================================
//                   CURRENT INVOICE
//               ========================================= */}

//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   mb: 1,
//                   background:
//                     "linear-gradient(135deg, #073b2a 0%, #0c6b4d 100%)",
//                   color: "#fff",
//                 }}
//               >
//                 <CardContent>
//                   <Stack
//                     direction={{
//                       xs: "column",
//                       md: "row",
//                     }}
//                     justifyContent="space-between"
//                     spacing={2}
//                   >
//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 800,
//                           mb: 1,
//                         }}
//                       >
//                         Current Invoice
//                       </Typography>

//                       <Typography
//                         sx={{
//                           opacity: 0.8,
//                         }}
//                       >
//                         Latest saved invoice
//                         information
//                       </Typography>
//                     </Box>

//                     <Stack
//                       direction={{
//                         xs: "column",
//                         sm: "row",
//                       }}
//                       spacing={1.5}
//                     >
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           px: 2,
//                           py: 1.2,
//                           borderRadius: 2,
//                           background:
//                             "rgba(255,255,255,0.12)",
//                           color: "#fff",
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             opacity: 0.7,
//                           }}
//                         >
//                           Total
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontWeight: 800,
//                             fontSize:
//                               "1.15rem",
//                           }}
//                         >
//                           {formatMoney(
//                             getValue(
//                               currentHeader,
//                               [
//                                 "Total",
//                                 "GrandTotal",
//                                 "NetAmount",
//                               ],
//                               0,
//                             ),
//                           )}
//                         </Typography>
//                       </Paper>

//                       <Paper
//                         elevation={0}
//                         sx={{
//                           px: 2,
//                           py: 1.2,
//                           borderRadius: 2,
//                           background:
//                             "rgba(255,255,255,0.12)",
//                           color: "#fff",
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             opacity: 0.7,
//                           }}
//                         >
//                           Received
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontWeight: 800,
//                             fontSize:
//                               "1.15rem",
//                           }}
//                         >
//                           {formatMoney(
//                             getValue(
//                               currentHeader,
//                               [
//                                 "ReceivedAmount",
//                                 "Received",
//                                 "ReceivedAmt",
//                               ],
//                               0,
//                             ),
//                           )}
//                         </Typography>
//                       </Paper>

//                       <Paper
//                         elevation={0}
//                         sx={{
//                           px: 2,
//                           py: 1.2,
//                           borderRadius: 2,
//                           background:
//                             "rgba(255,255,255,0.12)",
//                           color: "#fff",
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             opacity: 0.7,
//                           }}
//                         >
//                           Payment Mode
//                         </Typography>

//                         <Typography
//                           sx={{
//                             fontWeight: 800,
//                             fontSize:
//                               "1.15rem",
//                           }}
//                         >
//                           {getValue(
//                             currentHeader,
//                             [
//                               "PaymentMode",
//                               "paymentMode",
//                             ],
//                             "-",
//                           )}
//                         </Typography>
//                       </Paper>
//                     </Stack>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </DialogContent>

//         <DialogActions
//           sx={{
//             p: 1.5,
//             background: "#fff",
//           }}
//         >
//           <Button
//             variant="outlined"
//             onClick={closeHistory}
//             sx={{
//               borderRadius: 2,
//               textTransform: "none",
//               fontWeight: 700,
//               px: 3,
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default InvoiceHistory;































































































// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import moment from "moment";

// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   IconButton,
//   Chip,
//   Dialog,
//   DialogContent,
//   CircularProgress,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   InputAdornment,
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditNoteIcon from "@mui/icons-material/EditNote";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import HistoryIcon from "@mui/icons-material/History";
// import CloseIcon from "@mui/icons-material/Close";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";


// // ============================================================
// // API BASE URL
// // ============================================================

// const API_BASE =
//   "https://amrutdairyapi.microtechsolutions.net.in/php";


// // ============================================================
// // SAFE ARRAY
// // ============================================================

// const toArray = (response) => {
//   const data = response?.data;

//   if (Array.isArray(data)) {
//     return data;
//   }

//   if (Array.isArray(data?.data)) {
//     return data.data;
//   }

//   if (data?.data) {
//     return [data.data];
//   }

//   if (data) {
//     return [data];
//   }

//   return [];
// };


// // ============================================================
// // SAFE DATE
// // ============================================================

// const getDateValue = (value) => {
//   if (!value) return "";

//   if (typeof value === "object") {
//     return (
//       value?.date ||
//       value?.Date ||
//       value?.value ||
//       ""
//     );
//   }

//   return String(value);
// };


// // ============================================================
// // DISPLAY DATE
// // ============================================================

// const formatDate = (value) => {
//   const dateValue = getDateValue(value);

//   if (!dateValue) {
//     return "-";
//   }

//   const date = moment(dateValue);

//   if (!date.isValid()) {
//     return "-";
//   }

//   return date.format("DD/MM/YYYY");
// };


// // ============================================================
// // DATE FOR FILTER
// // ============================================================

// const formatDateForFilter = (value) => {
//   const dateValue = getDateValue(value);

//   if (!dateValue) {
//     return "";
//   }

//   const date = moment(dateValue);

//   if (!date.isValid()) {
//     return "";
//   }

//   return date.format("YYYY-MM-DD");
// };


// // ============================================================
// // NUMBER
// // ============================================================

// const money = (value) => {
//   const number = Number(value || 0);

//   return `₹ ${number.toFixed(2)}`;
// };


// // ============================================================
// // CUSTOMER TYPE
// // ============================================================

// const getCustomerType = (invoice) => {
//   return String(
//     invoice?.CustomerType ||
//       invoice?.customerType ||
//       invoice?.accountDetails?.CustomerType ||
//       invoice?.accountDetails?.customerType ||
//       invoice?.addressDetails?.CustomerType ||
//       invoice?.addressDetails?.customerType ||
//       ""
//   )
//     .trim()
//     .toUpperCase();
// };


// // ============================================================
// // SALE TYPE
// // ============================================================

// const getSaleType = (invoice) => {
//   const customerType = getCustomerType(invoice);

//   if (customerType === "R") {
//     return "Regular";
//   }

//   if (customerType === "D") {
//     return "Dealer";
//   }

//   if (customerType === "C") {
//     return "Caterers";
//   }

//   return "Other";
// };


// // ============================================================
// // COMPONENT
// // ============================================================

// const InvoiceEditHistoryDashboard = () => {

//   // ==========================================================
//   // MAIN DATA
//   // ==========================================================

//   const [invoiceList, setInvoiceList] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // ==========================================================
//   // FILTERS
//   // ==========================================================

//   const [searchText, setSearchText] = useState("");

//   const [saleType, setSaleType] = useState("ALL");

//   const [fromDate, setFromDate] = useState("");

//   const [toDate, setToDate] = useState("");


//   // ==========================================================
//   // HISTORY DIALOG
//   // ==========================================================

//   const [historyOpen, setHistoryOpen] = useState(false);

//   const [historyLoading, setHistoryLoading] = useState(false);

//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const [historyHeader, setHistoryHeader] = useState([]);

//   const [historyDetails, setHistoryDetails] = useState([]);

//   const [currentHeader, setCurrentHeader] = useState(null);

//   const [currentDetails, setCurrentDetails] = useState([]);

//   const [selectedVersion, setSelectedVersion] = useState(null);

//   const [selectedVersionDetails, setSelectedVersionDetails] =
//     useState([]);


//   // ==========================================================
//   // FETCH ALL INVOICE HEADER PAGES
//   // ==========================================================

//   const fetchAllInvoiceHeaders = async () => {
//     try {

//       const firstResponse = await axios.get(
//         `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=1`
//       );

//       const firstData = firstResponse?.data || {};

//       const totalPages = Number(
//         firstData?.total_pages || 1
//       );

//       const pages = Array.from(
//         { length: totalPages },
//         (_, index) => index + 1
//       );


//       const responses = await Promise.all(
//         pages.map(async (pageNo) => {

//           try {

//             const response = await axios.get(
//               `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=${pageNo}`
//             );

//             return toArray(response);

//           } catch (error) {

//             console.error(
//               `Invoice page ${pageNo} failed:`,
//               error
//             );

//             return [];
//           }
//         })
//       );


//       const allInvoices = responses.flat();


//       // Remove duplicate invoice IDs
//       const uniqueInvoices = [];

//       const invoiceIds = new Set();


//       allInvoices.forEach((invoice) => {

//         const id =
//           invoice?.Id ||
//           invoice?.InvoiceId;

//         if (!id) {
//           return;
//         }

//         if (invoiceIds.has(String(id))) {
//           return;
//         }

//         invoiceIds.add(String(id));

//         uniqueInvoices.push(invoice);
//       });


//       return uniqueInvoices;

//     } catch (error) {

//       console.error(
//         "FETCH ALL INVOICE HEADER ERROR:",
//         error
//       );

//       return [];
//     }
//   };


//   // ==========================================================
//   // FETCH ACCOUNT
//   // ==========================================================

//   const fetchAccount = async (accountId) => {

//     if (
//       !accountId ||
//       Number(accountId) === 0
//     ) {
//       return null;
//     }


//     try {

//       const response = await axios.get(
//         `${API_BASE}/getbyid.php?Table=Account&Colname=Id&Colvalue=${accountId}`
//       );

//       const list = toArray(response);

//       return list[0] || null;

//     } catch (error) {

//       console.error(
//         "ACCOUNT FETCH ERROR:",
//         accountId,
//         error
//       );

//       return null;
//     }
//   };


//   // ==========================================================
//   // FETCH ADDRESS
//   // ==========================================================

//   const fetchAddress = async (accountId) => {

//     if (
//       !accountId ||
//       Number(accountId) === 0
//     ) {
//       return null;
//     }


//     try {

//       const response = await axios.get(
//         `${API_BASE}/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`
//       );

//       const list = toArray(response);

//       return list[0] || null;

//     } catch (error) {

//       console.error(
//         "ADDRESS FETCH ERROR:",
//         accountId,
//         error
//       );

//       return null;
//     }
//   };


//   // ==========================================================
//   // CHECK HISTORY FOR ONE INVOICE
//   // ==========================================================

//   const fetchInvoiceHistory = async (invoiceId) => {

//     if (!invoiceId) {
//       return [];
//     }


//     try {

//       const response = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`
//       );

//       return toArray(response);

//     } catch (error) {

//       console.error(
//         "HISTORY FETCH ERROR:",
//         invoiceId,
//         error
//       );

//       return [];
//     }
//   };


//   // ==========================================================
//   // LOAD DASHBOARD
//   // ==========================================================

//   const loadDashboard = async () => {

//     setLoading(true);

//     try {

//       console.log(
//         "========================================"
//       );

//       console.log(
//         "LOADING INVOICE EDIT HISTORY DASHBOARD"
//       );

//       console.log(
//         "========================================"
//       );


//       // ------------------------------------------------------
//       // 1. GET ALL CURRENT INVOICES
//       // ------------------------------------------------------

//       const invoices =
//         await fetchAllInvoiceHeaders();


//       console.log(
//         "TOTAL CURRENT INVOICES:",
//         invoices.length
//       );


//       // ------------------------------------------------------
//       // 2. CHECK HISTORY
//       // ------------------------------------------------------

//       const editedInvoices = [];


//       // Process in small batches to avoid too many API calls
//       const batchSize = 10;


//       for (
//         let i = 0;
//         i < invoices.length;
//         i += batchSize
//       ) {

//         const batch =
//           invoices.slice(
//             i,
//             i + batchSize
//           );


//         const batchResults =
//           await Promise.all(
//             batch.map(async (invoice) => {

//               const invoiceId =
//                 invoice?.Id ||
//                 invoice?.InvoiceId;


//               if (!invoiceId) {
//                 return null;
//               }


//               const history =
//                 await fetchInvoiceHistory(
//                   invoiceId
//                 );


//               if (!history.length) {
//                 return null;
//               }


//               return {
//                 ...invoice,

//                 historyCount:
//                   history.length,

//                 isEdited: true,

//                 historyHeader:
//                   history,
//               };

//             })
//           );


//         batchResults.forEach(
//           (item) => {

//             if (item) {
//               editedInvoices.push(item);
//             }

//           }
//         );
//       }


//       console.log(
//         "EDITED INVOICES:",
//         editedInvoices
//       );


//       // ------------------------------------------------------
//       // 3. FETCH ACCOUNT + ADDRESS
//       // ------------------------------------------------------

//       const finalInvoices = [];


//       for (
//         let i = 0;
//         i < editedInvoices.length;
//         i += batchSize
//       ) {

//         const batch =
//           editedInvoices.slice(
//             i,
//             i + batchSize
//           );


//         const batchResults =
//           await Promise.all(
//             batch.map(async (invoice) => {

//               const accountId =
//                 invoice?.AccountId;


//               const [
//                 account,
//                 address
//               ] = await Promise.all([
//                 fetchAccount(accountId),
//                 fetchAddress(accountId),
//               ]);


//               const customerType =
//                 String(
//                   address?.CustomerType ||
//                     account?.CustomerType ||
//                     invoice?.CustomerType ||
//                     ""
//                 )
//                   .trim()
//                   .toUpperCase();


//               return {

//                 ...invoice,

//                 accountDetails: {
//                   ...(account || {}),
//                   CustomerType:
//                     customerType,
//                 },

//                 addressDetails:
//                   address,

//               };

//             })
//           );


//         finalInvoices.push(
//           ...batchResults
//         );
//       }


//       setInvoiceList(
//         finalInvoices
//       );


//     } catch (error) {

//       console.error(
//         "DASHBOARD LOAD ERROR:",
//         error
//       );

//     } finally {

//       setLoading(false);
//     }
//   };


//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {

//     loadDashboard();

//   }, []);


//   // ==========================================================
//   // CUSTOMER NAME
//   // ==========================================================

//   const getCustomerName = (invoice) => {

//     const accountName =
//       invoice?.accountDetails?.AccountName ||
//       invoice?.accountDetails?.accountName ||
//       invoice?.AccountName ||
//       invoice?.CustomerName ||
//       invoice?.customerName;


//     if (
//       accountName &&
//       String(accountName).trim()
//     ) {

//       return accountName;
//     }


//     return "Walk-in Customer";
//   };


//   // ==========================================================
//   // CONTACT
//   // ==========================================================

//   const getContact = (invoice) => {

//     return (
//       invoice?.ContactNo ||
//       invoice?.Phone ||
//       invoice?.Mobile ||
//       "-"
//     );

//   };


//   // ==========================================================
//   // INVOICE NUMBER
//   // ==========================================================

//   const getInvoiceNumber = (invoice) => {

//     return (
//       invoice?.InvoiceNo ||
//       invoice?.InvoiceNumber ||
//       invoice?.BillNo ||
//       invoice?.BillNumber ||
//       invoice?.Id ||
//       "-"
//     );

//   };


//   // ==========================================================
//   // FILTERED LIST
//   // ==========================================================

//   const filteredInvoices = useMemo(() => {

//     const search =
//       searchText
//         .trim()
//         .toLowerCase();


//     return invoiceList.filter(
//       (invoice) => {

//         const invoiceNo =
//           String(
//             getInvoiceNumber(invoice)
//           ).toLowerCase();


//         const customer =
//           String(
//             getCustomerName(invoice)
//           ).toLowerCase();


//         const contact =
//           String(
//             getContact(invoice)
//           ).toLowerCase();


//         const type =
//           getSaleType(invoice)
//             .toLowerCase();


//         const invoiceDate =
//           formatDateForFilter(
//             invoice?.InvoiceDate
//           );


//         // ----------------------------------------------------
//         // SEARCH
//         // ----------------------------------------------------

//         const searchMatch =
//           !search ||
//           invoiceNo.includes(search) ||
//           customer.includes(search) ||
//           contact.includes(search) ||
//           type.includes(search);


//         // ----------------------------------------------------
//         // SALE TYPE
//         // ----------------------------------------------------

//         const typeMatch =
//           saleType === "ALL" ||
//           getSaleType(invoice) === saleType;


//         // ----------------------------------------------------
//         // FROM DATE
//         // ----------------------------------------------------

//         const fromMatch =
//           !fromDate ||
//           (
//             invoiceDate &&
//             invoiceDate >= fromDate
//           );


//         // ----------------------------------------------------
//         // TO DATE
//         // ----------------------------------------------------

//         const toMatch =
//           !toDate ||
//           (
//             invoiceDate &&
//             invoiceDate <= toDate
//           );


//         return (
//           searchMatch &&
//           typeMatch &&
//           fromMatch &&
//           toMatch
//         );

//       }
//     );

//   }, [
//     invoiceList,
//     searchText,
//     saleType,
//     fromDate,
//     toDate,
//   ]);


//   // ==========================================================
//   // COUNTS
//   // ==========================================================

//   const editedCount =
//     filteredInvoices.length;


//   const regularCount =
//     filteredInvoices.filter(
//       (invoice) =>
//         getSaleType(invoice) === "Regular"
//     ).length;


//   const dealerCaterersCount =
//     filteredInvoices.filter(
//       (invoice) =>
//         getSaleType(invoice) === "Dealer" ||
//         getSaleType(invoice) === "Caterers"
//     ).length;


//   // ==========================================================
//   // CLEAR FILTER
//   // ==========================================================

//   const clearFilters = () => {

//     setSearchText("");

//     setSaleType("ALL");

//     setFromDate("");

//     setToDate("");
//   };


//   // ==========================================================
//   // FETCH CURRENT INVOICE
//   // ==========================================================

//   const fetchCurrentInvoice = async (invoiceId) => {

//     const [
//       headerResponse,
//       detailResponse
//     ] = await Promise.all([

//       axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`
//       ),

//       axios.get(
//         `${API_BASE}/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//       ),

//     ]);


//     const headerList =
//       toArray(headerResponse);


//     const detailList =
//       toArray(detailResponse);


//     return {

//       header:
//         headerList[0] || null,

//       details:
//         detailList,

//     };
//   };


//   // ==========================================================
//   // OPEN HISTORY
//   // ==========================================================

//   const openHistory = async (invoice) => {

//     const invoiceId =
//       invoice?.Id ||
//       invoice?.InvoiceId;


//     if (!invoiceId) {
//       return;
//     }


//     setSelectedInvoice(invoice);

//     setHistoryOpen(true);

//     setHistoryLoading(true);


//     setHistoryHeader([]);

//     setHistoryDetails([]);

//     setCurrentHeader(null);

//     setCurrentDetails([]);

//     setSelectedVersion(null);

//     setSelectedVersionDetails([]);


//     try {

//       // ------------------------------------------------------
//       // OLD HEADER HISTORY
//       // ------------------------------------------------------

//       const oldHeaderResponse =
//         await axios.get(
//           `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${invoiceId}`
//         );


//       const oldHeaders =
//         toArray(oldHeaderResponse);


//       // ------------------------------------------------------
//       // OLD DETAIL HISTORY
//       // ------------------------------------------------------

//       const oldDetailResponse =
//         await axios.get(
//           `${API_BASE}/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${invoiceId}`
//         );


//       const oldDetails =
//         toArray(oldDetailResponse);


//       setHistoryHeader(
//         oldHeaders
//       );

//       setHistoryDetails(
//         oldDetails
//       );


//       // ------------------------------------------------------
//       // CURRENT
//       // ------------------------------------------------------

//       const current =
//         await fetchCurrentInvoice(
//           invoiceId
//         );


//       setCurrentHeader(
//         current.header
//       );

//       setCurrentDetails(
//         current.details
//       );


//       // ------------------------------------------------------
//       // SELECT LATEST VERSION
//       // ------------------------------------------------------

//       if (oldHeaders.length > 0) {

//         const sortedHeaders =
//           [...oldHeaders].sort(
//             (a, b) =>
//               Number(
//                 b?.VersionNo || 0
//               ) -
//               Number(
//                 a?.VersionNo || 0
//               )
//           );


//         const latest =
//           sortedHeaders[0];


//         const latestVersion =
//           Number(
//             latest?.VersionNo || 0
//           );


//         if (latestVersion) {

//           setSelectedVersion(
//             latestVersion
//           );


//           const details =
//             oldDetails.filter(
//               (detail) =>
//                 Number(
//                   detail?.VersionNo
//                 ) === latestVersion
//             );


//           setSelectedVersionDetails(
//             details
//           );

//         }

//       }

//     } catch (error) {

//       console.error(
//         "OPEN HISTORY ERROR:",
//         error
//       );

//     } finally {

//       setHistoryLoading(false);

//     }
//   };


//   // ==========================================================
//   // SELECT VERSION
//   // ==========================================================

//   const selectVersion = (historyItem) => {

//     const version =
//       Number(
//         historyItem?.VersionNo || 0
//       );


//     if (!version) {
//       return;
//     }


//     setSelectedVersion(
//       version
//     );


//     const details =
//       historyDetails.filter(
//         (detail) =>
//           Number(
//             detail?.VersionNo
//           ) === version
//       );


//     setSelectedVersionDetails(
//       details
//     );

//   };


//   // ==========================================================
//   // CLOSE HISTORY
//   // ==========================================================

//   const closeHistory = () => {

//     setHistoryOpen(false);

//     setSelectedInvoice(null);

//     setHistoryHeader([]);

//     setHistoryDetails([]);

//     setCurrentHeader(null);

//     setCurrentDetails([]);

//     setSelectedVersion(null);

//     setSelectedVersionDetails([]);

//   };


//   // ==========================================================
//   // PRODUCT NAME
//   // ==========================================================

//   const getProductName = (detail) => {

//     return (
//       detail?.ProductName ||
//       detail?.productName ||
//       detail?.Product ||
//       detail?.product ||
//       `Product ${detail?.ProductId || "-"}`
//     );

//   };


//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (

//     <Box
//       sx={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, #f3f7f5 0%, #eef3f7 100%)",
//         p: {
//           xs: 1.5,
//           md: 3,
//         },
//       }}
//     >

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <Paper
//         elevation={0}
//         sx={{
//           background:
//             "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
//           color: "#fff",
//           borderRadius: 4,
//           px: {
//             xs: 2,
//             md: 4,
//           },
//           py: {
//             xs: 2,
//             md: 3,
//           },
//           mb: 3,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           boxShadow:
//             "0 8px 25px rgba(0,0,0,0.12)",
//         }}
//       >

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >

//           <Box
//             sx={{
//               width: 60,
//               height: 60,
//               borderRadius: 3,
//               background:
//                 "rgba(255,255,255,0.15)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >

//             <HistoryIcon
//               sx={{
//                 fontSize: 34,
//               }}
//             />

//           </Box>


//           <Box>

//             <Typography
//               sx={{
//                 fontSize: {
//                   xs: 25,
//                   md: 34,
//                 },
//                 fontWeight: 800,
//                 lineHeight: 1.1,
//               }}
//             >
//               Invoice History
//             </Typography>


//             <Typography
//               sx={{
//                 mt: 0.5,
//                 fontSize: {
//                   xs: 13,
//                   md: 17,
//                 },
//                 opacity: 0.9,
//               }}
//             >
//               View edited invoices and previous versions
//             </Typography>

//           </Box>

//         </Box>


//         <Button
//           variant="contained"
//           startIcon={<RefreshIcon />}
//           onClick={loadDashboard}
//           disabled={loading}
//           sx={{
//             background:
//               "rgba(255,255,255,0.16)",
//             color: "#fff",
//             textTransform: "none",
//             fontWeight: 700,
//             borderRadius: 2,
//             px: 2.5,
//             "&:hover": {
//               background:
//                 "rgba(255,255,255,0.25)",
//             },
//           }}
//         >
//           Refresh
//         </Button>

//       </Paper>


//       {/* =====================================================
//           SEARCH FILTER
//       ===================================================== */}

//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           p: {
//             xs: 2,
//             md: 3,
//           },
//           mb: 3,
//           border:
//             "1px solid #e5e7eb",
//         }}
//       >

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//             mb: 2,
//           }}
//         >

//           <ReceiptLongIcon
//             sx={{
//               color: "#00695c",
//               fontSize: 28,
//             }}
//           />

//           <Typography
//             sx={{
//               fontSize: 25,
//               fontWeight: 800,
//             }}
//           >
//             Search & Filter
//           </Typography>

//         </Box>


//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: {
//               xs: "1fr",
//               md: "2fr 1fr 1fr 1fr auto",
//             },
//             gap: 2,
//             alignItems: "center",
//           }}
//         >

//           {/* SEARCH */}

//           <TextField
//             fullWidth
//             value={searchText}
//             onChange={(e) =>
//               setSearchText(
//                 e.target.value
//               )
//             }
//             placeholder="Search Invoice / Customer"
//             size="medium"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon
//                     sx={{
//                       color: "#777",
//                     }}
//                   />
//                 </InputAdornment>
//               ),
//             }}
//           />


//           {/* SALE TYPE */}

//           <TextField
//             select
//             fullWidth
//             label="Sale Type"
//             value={saleType}
//             onChange={(e) =>
//               setSaleType(
//                 e.target.value
//               )
//             }
//           >

//             <MenuItem value="ALL">
//               All Sales
//             </MenuItem>

//             <MenuItem value="Regular">
//               Regular
//             </MenuItem>

//             <MenuItem value="Dealer">
//               Dealer
//             </MenuItem>

//             <MenuItem value="Caterers">
//               Caterers
//             </MenuItem>

//             <MenuItem value="Other">
//               Other
//             </MenuItem>

//           </TextField>


//           {/* FROM DATE */}

//           <TextField
//             fullWidth
//             type="date"
//             label="From Date"
//             value={fromDate}
//             onChange={(e) =>
//               setFromDate(
//                 e.target.value
//               )
//             }
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />


//           {/* TO DATE */}

//           <TextField
//             fullWidth
//             type="date"
//             label="To Date"
//             value={toDate}
//             onChange={(e) =>
//               setToDate(
//                 e.target.value
//               )
//             }
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />


//           {/* CLEAR */}

//           <Button
//             variant="outlined"
//             startIcon={
//               <FilterAltOffIcon />
//             }
//             onClick={clearFilters}
//             sx={{
//               height: 56,
//               whiteSpace: "nowrap",
//               textTransform: "none",
//               fontWeight: 700,
//               borderRadius: 2,
//             }}
//           >
//             Clear Filters
//           </Button>

//         </Box>

//       </Paper>


//       {/* =====================================================
//           SUMMARY CARDS
//       ===================================================== */}

//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "1fr",
//             md: "repeat(3, 1fr)",
//           },
//           gap: 3,
//           mb: 3,
//         }}
//       >

//         {/* EDITED */}

//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             borderRadius: 4,
//             border:
//               "1px solid #e5e7eb",
//             minHeight: 145,
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >

//           <Box>

//             <Typography
//               sx={{
//                 color: "#666",
//                 fontSize: 17,
//               }}
//             >
//               Edited Invoices
//             </Typography>


//             <Typography
//               sx={{
//                 fontSize: 42,
//                 fontWeight: 800,
//                 mt: 1,
//               }}
//             >
//               {editedCount}
//             </Typography>

//           </Box>


//           <EditNoteIcon
//             sx={{
//               fontSize: 50,
//               color: "#aaa",
//             }}
//           />

//         </Paper>


//         {/* REGULAR */}

//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             borderRadius: 4,
//             border:
//               "1px solid #e5e7eb",
//             minHeight: 145,
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >

//           <Box>

//             <Typography
//               sx={{
//                 color: "#666",
//                 fontSize: 17,
//               }}
//             >
//               Regular
//             </Typography>


//             <Typography
//               sx={{
//                 fontSize: 42,
//                 fontWeight: 800,
//                 mt: 1,
//               }}
//             >
//               {regularCount}
//             </Typography>

//           </Box>


//           <CalendarMonthIcon
//             sx={{
//               fontSize: 50,
//               color: "#aaa",
//             }}
//           />

//         </Paper>


//         {/* DEALER / CATERERS */}

//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             borderRadius: 4,
//             border:
//               "1px solid #e5e7eb",
//             minHeight: 145,
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >

//           <Box>

//             <Typography
//               sx={{
//                 color: "#666",
//                 fontSize: 17,
//               }}
//             >
//               Dealer / Caterers
//             </Typography>


//             <Typography
//               sx={{
//                 fontSize: 42,
//                 fontWeight: 800,
//                 mt: 1,
//               }}
//             >
//               {dealerCaterersCount}
//             </Typography>

//           </Box>


//           <HistoryIcon
//             sx={{
//               fontSize: 55,
//               color: "#aaa",
//             }}
//           />

//         </Paper>

//       </Box>


//       {/* =====================================================
//           EDITED INVOICE LIST
//       ===================================================== */}

//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           overflow: "hidden",
//           border:
//             "1px solid #e5e7eb",
//         }}
//       >

//         <Box
//           sx={{
//             px: 3,
//             py: 2.5,
//             background:
//               "linear-gradient(135deg,#f4faf7,#edf7f3)",
//             borderBottom:
//               "1px solid #ddd",
//           }}
//         >

//           <Typography
//             sx={{
//               fontSize: 27,
//               fontWeight: 800,
//             }}
//           >
//             Edited Invoice List
//           </Typography>


//           <Typography
//             sx={{
//               color: "#666",
//               mt: 0.5,
//             }}
//           >
//             Only invoices having edit history are shown here.
//           </Typography>

//         </Box>


//         {loading ? (

//           <Box
//             sx={{
//               py: 8,
//               display: "flex",
//               justifyContent: "center",
//             }}
//           >

//             <CircularProgress />

//           </Box>

//         ) : filteredInvoices.length === 0 ? (

//           <Box
//             sx={{
//               py: 8,
//               textAlign: "center",
//             }}
//           >

//             <HistoryIcon
//               sx={{
//                 fontSize: 60,
//                 color: "#bbb",
//               }}
//             />


//             <Typography
//               sx={{
//                 mt: 1,
//                 fontSize: 18,
//                 fontWeight: 600,
//                 color: "#777",
//               }}
//             >
//               No edited invoices found
//             </Typography>

//           </Box>

//         ) : (

//           <TableContainer>

//             <Table>

//               <TableHead>

//                 <TableRow
//                   sx={{
//                     background:
//                       "#edf3f2",
//                   }}
//                 >

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Invoice No
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Invoice Date
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Customer
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Sale Type
//                   </TableCell>


//                   <TableCell
//                     align="right"
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Total
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Status
//                   </TableCell>


//                   <TableCell
//                     align="center"
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Action
//                   </TableCell>

//                 </TableRow>

//               </TableHead>


//               <TableBody>

//                 {filteredInvoices.map(
//                   (invoice, index) => {

//                     const saleType =
//                       getSaleType(invoice);


//                     return (

//                       <TableRow
//                         key={
//                           invoice?.Id ||
//                           invoice?.InvoiceId ||
//                           index
//                         }
//                         hover
//                       >

//                         {/* INVOICE NO */}

//                         <TableCell>

//                           <Typography
//                             sx={{
//                               fontWeight: 800,
//                               fontSize: 17,
//                             }}
//                           >
//                             #
//                             {
//                               getInvoiceNumber(
//                                 invoice
//                               )
//                             }
//                           </Typography>

//                         </TableCell>


//                         {/* DATE */}

//                         <TableCell>

//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >

//                             <CalendarMonthIcon
//                               sx={{
//                                 fontSize: 20,
//                                 color: "#777",
//                               }}
//                             />

//                             {formatDate(
//                               invoice?.InvoiceDate
//                             )}

//                           </Box>

//                         </TableCell>


//                         {/* CUSTOMER */}

//                         <TableCell>

//                           <Typography
//                             sx={{
//                               fontWeight: 700,
//                             }}
//                           >
//                             {
//                               getCustomerName(
//                                 invoice
//                               )
//                             }
//                           </Typography>


//                           {getContact(
//                             invoice
//                           ) !== "-" && (

//                             <Typography
//                               sx={{
//                                 fontSize: 12,
//                                 color: "#888",
//                               }}
//                             >
//                               {
//                                 getContact(
//                                   invoice
//                                 )
//                               }
//                             </Typography>

//                           )}

//                         </TableCell>


//                         {/* SALE TYPE */}

//                         <TableCell>

//                           <Chip
//                             label={
//                               saleType
//                             }
//                             size="small"
//                             variant="outlined"
//                             sx={{
//                               fontWeight: 700,
//                               borderRadius: 2,
//                             }}
//                           />

//                         </TableCell>


//                         {/* TOTAL */}

//                         <TableCell
//                           align="right"
//                         >

//                           <Typography
//                             sx={{
//                               fontWeight: 800,
//                               fontSize: 17,
//                             }}
//                           >
//                             {money(
//                               invoice?.Total
//                             )}
//                           </Typography>

//                         </TableCell>


//                         {/* STATUS */}

//                         <TableCell>

//                           <Chip
//                             icon={
//                               <EditNoteIcon />
//                             }
//                             label="EDITED"
//                             size="small"
//                             sx={{
//                               fontWeight: 800,
//                               background:
//                                 "#eeeeee",
//                               color: "#555",
//                             }}
//                           />

//                         </TableCell>


//                         {/* ACTION */}

//                         <TableCell
//                           align="center"
//                         >

//                           <Button
//                             variant="contained"
//                             startIcon={
//                               <VisibilityIcon />
//                             }
//                             onClick={() =>
//                               openHistory(
//                                 invoice
//                               )
//                             }
//                             sx={{
//                               textTransform:
//                                 "none",
//                               fontWeight: 800,
//                               borderRadius: 2,
//                               background:
//                                 "#1976d2",
//                               "&:hover": {
//                                 background:
//                                   "#1565c0",
//                               },
//                             }}
//                           >
//                             View
//                           </Button>

//                         </TableCell>

//                       </TableRow>

//                     );

//                   }
//                 )}

//               </TableBody>

//             </Table>

//           </TableContainer>

//         )}

//       </Paper>


//       {/* =====================================================
//           HISTORY DIALOG
//       ===================================================== */}

//       <Dialog
//         open={historyOpen}
//         onClose={closeHistory}
//         fullWidth
//         maxWidth="xl"
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             maxHeight: "94vh",
//           },
//         }}
//       >

//         {/* DIALOG HEADER */}

//         <Box
//           sx={{
//             background:
//               "linear-gradient(135deg,#1976d2,#0d47a1)",
//             color: "#fff",
//             px: 3,
//             py: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >

//           <Box>

//             <Typography
//               sx={{
//                 fontSize: 28,
//                 fontWeight: 800,
//               }}
//             >
//               Invoice Edit History
//             </Typography>


//             <Typography
//               sx={{
//                 mt: 0.5,
//                 opacity: 0.9,
//               }}
//             >
//               Invoice No:{" "}
//               {
//                 selectedInvoice
//                   ? getInvoiceNumber(
//                       selectedInvoice
//                     )
//                   : "-"
//               }
//             </Typography>

//           </Box>


//           <IconButton
//             onClick={closeHistory}
//             sx={{
//               color: "#fff",
//             }}
//           >
//             <CloseIcon />
//           </IconButton>

//         </Box>


//         <DialogContent
//           sx={{
//             background:
//               "#f5f7fa",
//             p: {
//               xs: 2,
//               md: 3,
//             },
//           }}
//         >

//           {historyLoading ? (

//             <Box
//               sx={{
//                 minHeight: 400,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >

//               <CircularProgress />

//             </Box>

//           ) : (

//             <>

//               {/* =================================================
//                   CURRENT INVOICE
//               ================================================= */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   mb: 3,
//                   borderRadius: 3,
//                   border:
//                     "1px solid #ddd",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize: 26,
//                     fontWeight: 800,
//                     color: "#1976d2",
//                     mb: 3,
//                   }}
//                 >
//                   Current Invoice
//                 </Typography>


//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: {
//                       xs: "repeat(2,1fr)",
//                       md: "repeat(6,1fr)",
//                     },
//                     gap: 3,
//                   }}
//                 >

//                   <InfoItem
//                     label="Invoice No"
//                     value={
//                       currentHeader?.InvoiceNo ||
//                       currentHeader?.Id ||
//                       "-"
//                     }
//                   />


//                   <InfoItem
//                     label="Invoice Date"
//                     value={formatDate(
//                       currentHeader?.InvoiceDate
//                     )}
//                   />


//                   <InfoItem
//                     label="Customer"
//                     value={
//                       getCustomerName(
//                         {
//                           ...selectedInvoice,
//                           ...currentHeader,
//                         }
//                       )
//                     }
//                   />


//                   <InfoItem
//                     label="Total"
//                     value={money(
//                       currentHeader?.Total
//                     )}
//                     valueColor="#1976d2"
//                   />


//                   <InfoItem
//                     label="Received"
//                     value={money(
//                       currentHeader?.ReceivedAmount
//                     )}
//                   />


//                   <InfoItem
//                     label="Balance"
//                     value={money(
//                       Math.max(
//                         Number(
//                           currentHeader?.Total ||
//                           0
//                         ) -
//                         Number(
//                           currentHeader?.ReceivedAmount ||
//                           0
//                         ),
//                         0
//                       )
//                     )}
//                     valueColor="red"
//                   />

//                 </Box>

//               </Paper>


//               {/* =================================================
//                   PREVIOUS HISTORY
//               ================================================= */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   mb: 3,
//                   borderRadius: 3,
//                   border:
//                     "1px solid #ddd",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize: 26,
//                     fontWeight: 800,
//                     color: "#ed6c02",
//                     mb: 2,
//                   }}
//                 >
//                   Previous Invoice History
//                 </Typography>


//                 {historyHeader.length === 0 ? (

//                   <Typography
//                     color="text.secondary"
//                   >
//                     No previous history found.
//                   </Typography>

//                 ) : (

//                   <TableContainer>

//                     <Table
//                       size="small"
//                     >

//                       <TableHead>

//                         <TableRow
//                           sx={{
//                             background:
//                               "#eaf2f8",
//                           }}
//                         >

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Version
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Invoice No
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Invoice Date
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Customer
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Total
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Received
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             View
//                           </TableCell>

//                         </TableRow>

//                       </TableHead>


//                       <TableBody>

//                         {[...historyHeader]
//                           .sort(
//                             (a, b) =>
//                               Number(
//                                 b?.VersionNo ||
//                                 0
//                               ) -
//                               Number(
//                                 a?.VersionNo ||
//                                 0
//                               )
//                           )
//                           .map(
//                             (
//                               item,
//                               index
//                             ) => {

//                               const version =
//                                 Number(
//                                   item?.VersionNo ||
//                                   0
//                                 );


//                               const selected =
//                                 selectedVersion ===
//                                 version;


//                               return (

//                                 <TableRow
//                                   key={
//                                     item?.Id ||
//                                     `${version}-${index}`
//                                   }
//                                   sx={{
//                                     backgroundColor:
//                                       selected
//                                         ? "#e3f2fd"
//                                         : "inherit",
//                                   }}
//                                 >

//                                   <TableCell>

//                                     <Button
//                                       variant={
//                                         selected
//                                           ? "contained"
//                                           : "outlined"
//                                       }
//                                       size="small"
//                                       onClick={() =>
//                                         selectVersion(
//                                           item
//                                         )
//                                       }
//                                     >
//                                       VERSION{" "}
//                                       {
//                                         version
//                                       }
//                                     </Button>

//                                   </TableCell>


//                                   <TableCell>
//                                     {
//                                       item?.InvoiceNo ||
//                                       item?.BillNo ||
//                                       "-"
//                                     }
//                                   </TableCell>


//                                   <TableCell>
//                                     {formatDate(
//                                       item?.InvoiceDate
//                                     )}
//                                   </TableCell>


//                                   <TableCell>
//                                     {
//                                       item?.AccountName ||
//                                       item?.CustomerName ||
//                                       "-"
//                                     }
//                                   </TableCell>


//                                   <TableCell>
//                                     {money(
//                                       item?.Total
//                                     )}
//                                   </TableCell>


//                                   <TableCell>
//                                     {money(
//                                       item?.ReceivedAmount
//                                     )}
//                                   </TableCell>


//                                   <TableCell>

//                                     <Button
//                                       size="small"
//                                       onClick={() =>
//                                         selectVersion(
//                                           item
//                                         )
//                                       }
//                                     >
//                                       VIEW
//                                     </Button>

//                                   </TableCell>

//                                 </TableRow>

//                               );

//                             }
//                           )}

//                       </TableBody>

//                     </Table>

//                   </TableContainer>

//                 )}

//               </Paper>


//               {/* =================================================
//                   OLD VS CURRENT
//               ================================================= */}

//               {selectedVersion && (

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: 3,
//                     border:
//                       "1px solid #ddd",
//                   }}
//                 >

//                   <Typography
//                     sx={{
//                       fontSize: 26,
//                       fontWeight: 800,
//                       color: "#7b1fa2",
//                       mb: 2,
//                     }}
//                   >
//                     Old vs Current Invoice
//                   </Typography>


//                   {(() => {

//                     const oldHeader =
//                       historyHeader.find(
//                         (item) =>
//                           Number(
//                             item?.VersionNo
//                           ) ===
//                           Number(
//                             selectedVersion
//                           )
//                       );


//                     const oldBalance =
//                       Math.max(
//                         Number(
//                           oldHeader?.Total ||
//                           0
//                         ) -
//                         Number(
//                           oldHeader?.ReceivedAmount ||
//                           0
//                         ),
//                         0
//                       );


//                     const currentBalance =
//                       Math.max(
//                         Number(
//                           currentHeader?.Total ||
//                           0
//                         ) -
//                         Number(
//                           currentHeader?.ReceivedAmount ||
//                           0
//                         ),
//                         0
//                       );


//                     return (

//                       <TableContainer>

//                         <Table>

//                           <TableHead>

//                             <TableRow
//                               sx={{
//                                 background:
//                                   "#f3e5f5",
//                               }}
//                             >

//                               <TableCell
//                                 sx={{
//                                   fontWeight: 800,
//                                 }}
//                               >
//                                 Field
//                               </TableCell>

//                               <TableCell
//                                 sx={{
//                                   fontWeight: 800,
//                                 }}
//                               >
//                                 Version{" "}
//                                 {
//                                   selectedVersion
//                                 }
//                               </TableCell>

//                               <TableCell
//                                 sx={{
//                                   fontWeight: 800,
//                                 }}
//                               >
//                                 Current
//                               </TableCell>

//                             </TableRow>

//                           </TableHead>


//                           <TableBody>

//                             <CompareRow
//                               label="Invoice No"
//                               oldValue={
//                                 oldHeader?.InvoiceNo ||
//                                 "-"
//                               }
//                               currentValue={
//                                 currentHeader?.InvoiceNo ||
//                                 "-"
//                               }
//                             />


//                             <CompareRow
//                               label="Invoice Date"
//                               oldValue={formatDate(
//                                 oldHeader?.InvoiceDate
//                               )}
//                               currentValue={formatDate(
//                                 currentHeader?.InvoiceDate
//                               )}
//                             />


//                             <CompareRow
//                               label="Customer"
//                               oldValue={
//                                 oldHeader?.AccountName ||
//                                 oldHeader?.CustomerName ||
//                                 "-"
//                               }
//                               currentValue={
//                                 getCustomerName(
//                                   {
//                                     ...selectedInvoice,
//                                     ...currentHeader,
//                                   }
//                                 )
//                               }
//                             />


//                             <CompareRow
//                               label="Total"
//                               oldValue={money(
//                                 oldHeader?.Total
//                               )}
//                               currentValue={money(
//                                 currentHeader?.Total
//                               )}
//                             />


//                             <CompareRow
//                               label="Received"
//                               oldValue={money(
//                                 oldHeader?.ReceivedAmount
//                               )}
//                               currentValue={money(
//                                 currentHeader?.ReceivedAmount
//                               )}
//                             />


//                             <CompareRow
//                               label="Balance"
//                               oldValue={money(
//                                 oldBalance
//                               )}
//                               currentValue={money(
//                                 currentBalance
//                               )}
//                             />

//                           </TableBody>

//                         </Table>

//                       </TableContainer>

//                     );

//                   })()}

//                 </Paper>

//               )}


//               {/* =================================================
//                   PREVIOUS PRODUCT DETAILS
//               ================================================= */}

//               {selectedVersion && (

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: 3,
//                     border:
//                       "1px solid #ddd",
//                   }}
//                 >

//                   <Typography
//                     sx={{
//                       fontSize: 24,
//                       fontWeight: 800,
//                       color: "#7b1fa2",
//                       mb: 2,
//                     }}
//                   >
//                     Previous Product Details —
//                     Version{" "}
//                     {selectedVersion}
//                   </Typography>


//                   {selectedVersionDetails.length ===
//                   0 ? (

//                     <Typography
//                       color="text.secondary"
//                     >
//                       No product details found
//                       for this version.
//                     </Typography>

//                   ) : (

//                     <TableContainer>

//                       <Table>

//                         <TableHead>

//                           <TableRow
//                             sx={{
//                               background:
//                                 "#f7f1f8",
//                             }}
//                           >

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Product
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Quantity
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Rate
//                             </TableCell>

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Amount
//                             </TableCell>

//                           </TableRow>

//                         </TableHead>


//                         <TableBody>

//                           {selectedVersionDetails.map(
//                             (
//                               detail,
//                               index
//                             ) => (

//                               <TableRow
//                                 key={
//                                   detail?.Id ||
//                                   index
//                                 }
//                               >

//                                 <TableCell>
//                                   {
//                                     getProductName(
//                                       detail
//                                     )
//                                   }
//                                 </TableCell>


//                                 <TableCell>
//                                   {
//                                     detail?.Quantity ??
//                                     detail?.Qty ??
//                                     "-"
//                                   }
//                                 </TableCell>


//                                 <TableCell>
//                                   {money(
//                                     detail?.Rate
//                                   )}
//                                 </TableCell>


//                                 <TableCell>
//                                   {money(
//                                     detail?.Amount
//                                   )}
//                                 </TableCell>

//                               </TableRow>

//                             )
//                           )}

//                         </TableBody>

//                       </Table>

//                     </TableContainer>

//                   )}

//                 </Paper>

//               )}


//               {/* =================================================
//                   CURRENT PRODUCT DETAILS
//               ================================================= */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   borderRadius: 3,
//                   border:
//                     "1px solid #ddd",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize: 24,
//                     fontWeight: 800,
//                     color: "#1976d2",
//                     mb: 2,
//                   }}
//                 >
//                   Current Product Details
//                 </Typography>


//                 {currentDetails.length === 0 ? (

//                   <Typography
//                     color="text.secondary"
//                   >
//                     No current product details found.
//                   </Typography>

//                 ) : (

//                   <TableContainer>

//                     <Table>

//                       <TableHead>

//                         <TableRow
//                           sx={{
//                             background:
//                               "#e3f2fd",
//                           }}
//                         >

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Product
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Quantity
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Rate
//                           </TableCell>

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Amount
//                           </TableCell>

//                         </TableRow>

//                       </TableHead>


//                       <TableBody>

//                         {currentDetails.map(
//                           (
//                             detail,
//                             index
//                           ) => (

//                             <TableRow
//                               key={
//                                 detail?.Id ||
//                                 index
//                               }
//                             >

//                               <TableCell>
//                                 {
//                                   getProductName(
//                                     detail
//                                   )
//                                 }
//                               </TableCell>


//                               <TableCell>
//                                 {
//                                   detail?.Quantity ??
//                                   detail?.Qty ??
//                                   "-"
//                                 }
//                               </TableCell>


//                               <TableCell>
//                                 {money(
//                                   detail?.Rate
//                                 )}
//                               </TableCell>


//                               <TableCell>
//                                 {money(
//                                   detail?.Amount
//                                 )}
//                               </TableCell>

//                             </TableRow>

//                           )
//                         )}

//                       </TableBody>

//                     </Table>

//                   </TableContainer>

//                 )}

//               </Paper>

//             </>

//           )}

//         </DialogContent>


//         {/* CLOSE */}

//         <Box
//           sx={{
//             px: 3,
//             py: 1.5,
//             borderTop:
//               "1px solid #ddd",
//             display: "flex",
//             justifyContent: "flex-end",
//           }}
//         >

//           <Button
//             variant="contained"
//             onClick={closeHistory}
//             sx={{
//               textTransform: "none",
//               fontWeight: 700,
//             }}
//           >
//             CLOSE
//           </Button>

//         </Box>

//       </Dialog>

//     </Box>

//   );
// };


// // ============================================================
// // INFO ITEM
// // ============================================================

// const InfoItem = ({
//   label,
//   value,
//   valueColor,
// }) => {

//   return (

//     <Box>

//       <Typography
//         sx={{
//           color: "#666",
//           fontSize: 15,
//           mb: 0.5,
//         }}
//       >
//         {label}
//       </Typography>


//       <Typography
//         sx={{
//           fontSize: 18,
//           fontWeight: 800,
//           color:
//             valueColor ||
//             "#222",
//         }}
//       >
//         {value}
//       </Typography>

//     </Box>

//   );
// };


// // ============================================================
// // COMPARE ROW
// // ============================================================

// const CompareRow = ({
//   label,
//   oldValue,
//   currentValue,
// }) => {

//   const changed =
//     String(oldValue ?? "") !==
//     String(currentValue ?? "");


//   return (

//     <TableRow>

//       <TableCell
//         sx={{
//           fontWeight: 700,
//         }}
//       >
//         {label}
//       </TableCell>


//       <TableCell
//         sx={{
//           background:
//             changed
//               ? "#fff3e0"
//               : "transparent",
//           fontWeight:
//             changed
//               ? 700
//               : 500,
//         }}
//       >
//         {oldValue}
//       </TableCell>


//       <TableCell
//         sx={{
//           background:
//             changed
//               ? "#e8f5e9"
//               : "transparent",
//           fontWeight:
//             changed
//               ? 700
//               : 500,
//         }}
//       >
//         {currentValue}
//       </TableCell>

//     </TableRow>

//   );
// };


// export default InvoiceEditHistoryDashboard;







// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import moment from "moment";

// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   IconButton,
//   Chip,
//   Dialog,
//   DialogContent,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   InputAdornment,
//   Divider,
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditNoteIcon from "@mui/icons-material/EditNote";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import HistoryIcon from "@mui/icons-material/History";
// import CloseIcon from "@mui/icons-material/Close";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import PersonIcon from "@mui/icons-material/Person";
// import StoreIcon from "@mui/icons-material/Store";
// import RestaurantIcon from "@mui/icons-material/Restaurant";


// // ============================================================
// // API
// // ============================================================

// const API_BASE =
//   "https://amrutdairyapi.microtechsolutions.net.in/php";


// // ============================================================
// // SAFE ARRAY
// // ============================================================

// const toArray = (response) => {
//   const data = response?.data;

//   if (Array.isArray(data)) {
//     return data;
//   }

//   if (Array.isArray(data?.data)) {
//     return data.data;
//   }

//   if (data?.data) {
//     return [data.data];
//   }

//   if (data) {
//     return [data];
//   }

//   return [];
// };


// // ============================================================
// // DATE VALUE
// // ============================================================

// const getDateValue = (value) => {
//   if (!value) return "";

//   if (typeof value === "object") {
//     return (
//       value?.date ||
//       value?.Date ||
//       value?.value ||
//       ""
//     );
//   }

//   return String(value);
// };


// // ============================================================
// // FORMAT DATE
// // ============================================================

// const formatDate = (value) => {
//   const dateValue = getDateValue(value);

//   if (!dateValue) {
//     return "-";
//   }

//   const date = moment(dateValue);

//   if (!date.isValid()) {
//     return "-";
//   }

//   return date.format("DD/MM/YYYY");
// };


// // ============================================================
// // FILTER DATE
// // ============================================================

// const formatDateForFilter = (value) => {
//   const dateValue = getDateValue(value);

//   if (!dateValue) {
//     return "";
//   }

//   const date = moment(dateValue);

//   if (!date.isValid()) {
//     return "";
//   }

//   return date.format("YYYY-MM-DD");
// };


// // ============================================================
// // MONEY
// // ============================================================

// const money = (value) => {
//   const number = Number(value || 0);

//   return `₹ ${number.toFixed(2)}`;
// };


// // ============================================================
// // CUSTOMER TYPE
// // ============================================================

// const getCustomerType = (invoice) => {
//   const type = String(
//     invoice?.CustomerType ||
//       invoice?.customerType ||
//       invoice?.accountDetails?.CustomerType ||
//       invoice?.accountDetails?.customerType ||
//       invoice?.addressDetails?.CustomerType ||
//       invoice?.addressDetails?.customerType ||
//       ""
//   )
//     .trim()
//     .toUpperCase();

//   return type;
// };


// // ============================================================
// // SALE TYPE
// //
// // R = Regular
// // D = Dealer
// // C = Caterers
// //
// // IMPORTANT:
// // AccountId = 0 means Walk-in Customer
// // Walk-in is treated as Regular
// // ============================================================

// const getSaleType = (invoice) => {
//   const accountId = Number(
//     invoice?.AccountId ||
//       invoice?.accountId ||
//       0
//   );

//   const customerType = getCustomerType(invoice);

//   // Walk-in customer
//   if (accountId === 0) {
//     return "Regular";
//   }

//   if (customerType === "R") {
//     return "Regular";
//   }

//   if (customerType === "D") {
//     return "Dealer";
//   }

//   if (customerType === "C") {
//     return "Caterers";
//   }

//   // If type is missing but account exists,
//   // treat it as Regular instead of Other.
//   return "Regular";
// };


// // ============================================================
// // INVOICE NUMBER
// // ============================================================

// const getInvoiceNumber = (invoice) => {
//   return (
//     invoice?.InvoiceNo ||
//     invoice?.InvoiceNumber ||
//     invoice?.BillNo ||
//     invoice?.BillNumber ||
//     "-"
//   );
// };


// // ============================================================
// // COMPONENT
// // ============================================================

// const InvoiceEditHistoryDashboard = () => {

//   // ==========================================================
//   // MAIN DATA
//   // ==========================================================

//   const [invoiceList, setInvoiceList] = useState([]);

//   const [loading, setLoading] = useState(false);


//   // ==========================================================
//   // FILTERS
//   // ==========================================================

//   const [searchText, setSearchText] = useState("");

//   const [saleType, setSaleType] = useState("ALL");

//   const [fromDate, setFromDate] = useState("");

//   const [toDate, setToDate] = useState("");


//   // ==========================================================
//   // HISTORY DIALOG
//   // ==========================================================

//   const [historyOpen, setHistoryOpen] = useState(false);

//   const [historyLoading, setHistoryLoading] =
//     useState(false);

//   const [selectedInvoice, setSelectedInvoice] =
//     useState(null);

//   const [historyHeader, setHistoryHeader] =
//     useState([]);

//   const [historyDetails, setHistoryDetails] =
//     useState([]);

//   const [currentHeader, setCurrentHeader] =
//     useState(null);

//   const [currentDetails, setCurrentDetails] =
//     useState([]);

//   const [selectedVersion, setSelectedVersion] =
//     useState(null);

//   const [selectedVersionDetails, setSelectedVersionDetails] =
//     useState([]);


//   // ==========================================================
//   // FETCH ALL CURRENT INVOICES
//   // ==========================================================

//   const fetchAllInvoiceHeaders = async () => {

//     try {

//       console.log(
//         "=========================================="
//       );

//       console.log(
//         "FETCHING ALL CURRENT INVOICES"
//       );

//       console.log(
//         "=========================================="
//       );


//       // First page
//       const firstResponse = await axios.get(
//         `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=1`
//       );

//       const firstData =
//         firstResponse?.data || {};


//       const totalPages = Math.max(
//         Number(firstData?.total_pages || 1),
//         1
//       );


//       console.log(
//         "TOTAL INVOICE PAGES:",
//         totalPages
//       );


//       const pageNumbers = Array.from(
//         { length: totalPages },
//         (_, index) => index + 1
//       );


//       const responses = await Promise.all(
//         pageNumbers.map(async (pageNo) => {

//           try {

//             const response = await axios.get(
//               `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=${pageNo}`
//             );

//             return toArray(response);

//           } catch (error) {

//             console.error(
//               `Invoice page ${pageNo} failed`,
//               error
//             );

//             return [];
//           }
//         })
//       );


//       const allInvoices =
//         responses.flat();


//       // =====================================================
//       // REMOVE DUPLICATES
//       // =====================================================

//       const uniqueInvoices = [];

//       const seenIds = new Set();


//       allInvoices.forEach((invoice) => {

//         const id =
//           invoice?.Id ||
//           invoice?.InvoiceId;


//         if (!id) {
//           return;
//         }


//         const key = String(id);


//         if (seenIds.has(key)) {
//           return;
//         }


//         seenIds.add(key);

//         uniqueInvoices.push(invoice);

//       });


//       console.log(
//         "TOTAL UNIQUE CURRENT INVOICES:",
//         uniqueInvoices.length
//       );


//       return uniqueInvoices;

//     } catch (error) {

//       console.error(
//         "FETCH ALL INVOICE HEADER ERROR:",
//         error
//       );

//       return [];
//     }
//   };


//   // ==========================================================
//   // FETCH ACCOUNT
//   // ==========================================================

//   const fetchAccount = async (accountId) => {

//     if (
//       !accountId ||
//       Number(accountId) === 0
//     ) {
//       return null;
//     }


//     try {

//       const response = await axios.get(
//         `${API_BASE}/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//           accountId
//         )}`
//       );


//       const list = toArray(response);


//       return list[0] || null;

//     } catch (error) {

//       console.error(
//         "ACCOUNT FETCH ERROR:",
//         accountId,
//         error
//       );

//       return null;
//     }
//   };


//   // ==========================================================
//   // FETCH ADDRESS
//   // ==========================================================

//   const fetchAddress = async (accountId) => {

//     if (
//       !accountId ||
//       Number(accountId) === 0
//     ) {
//       return null;
//     }


//     try {

//       const response = await axios.get(
//         `${API_BASE}/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
//           accountId
//         )}`
//       );


//       const list = toArray(response);


//       return list[0] || null;

//     } catch (error) {

//       console.error(
//         "ADDRESS FETCH ERROR:",
//         accountId,
//         error
//       );

//       return null;
//     }
//   };


//   // ==========================================================
//   // FETCH HISTORY FOR ONE INVOICE
//   // ==========================================================

//   const fetchInvoiceHistory = async (invoiceId) => {

//     if (!invoiceId) {
//       return [];
//     }


//     try {

//       const response = await axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
//           invoiceId
//         )}`
//       );


//       const history = toArray(response);


//       console.log(
//         "HISTORY:",
//         invoiceId,
//         history
//       );


//       return history;

//     } catch (error) {

//       console.error(
//         "HISTORY FETCH ERROR:",
//         invoiceId,
//         error
//       );

//       return [];
//     }
//   };


//   // ==========================================================
//   // LOAD DASHBOARD
//   // ==========================================================

//   const loadDashboard = async () => {

//     setLoading(true);


//     try {

//       console.log(
//         "=========================================="
//       );

//       console.log(
//         "LOADING INVOICE EDIT HISTORY DASHBOARD"
//       );

//       console.log(
//         "=========================================="
//       );


//       // ======================================================
//       // 1. CURRENT INVOICES
//       // ======================================================

//       const invoices =
//         await fetchAllInvoiceHeaders();


//       console.log(
//         "CURRENT INVOICE COUNT:",
//         invoices.length
//       );


//       // ======================================================
//       // 2. FIND EDITED INVOICES
//       // ======================================================

//       const editedInvoices = [];

//       const batchSize = 8;


//       for (
//         let i = 0;
//         i < invoices.length;
//         i += batchSize
//       ) {

//         const batch =
//           invoices.slice(
//             i,
//             i + batchSize
//           );


//         const batchResults =
//           await Promise.all(

//             batch.map(
//               async (invoice) => {

//                 const invoiceId =
//                   invoice?.Id ||
//                   invoice?.InvoiceId;


//                 if (!invoiceId) {
//                   return null;
//                 }


//                 const history =
//                   await fetchInvoiceHistory(
//                     invoiceId
//                   );


//                 // IMPORTANT
//                 // No history = not edited

//                 if (
//                   !history ||
//                   history.length === 0
//                 ) {
//                   return null;
//                 }


//                 return {
//                   ...invoice,

//                   isEdited: true,

//                   historyCount:
//                     history.length,

//                   historyHeader:
//                     history,
//                 };
//               }
//             )
//           );


//         batchResults.forEach(
//           (item) => {

//             if (item) {
//               editedInvoices.push(item);
//             }

//           }
//         );
//       }


//       console.log(
//         "=========================================="
//       );

//       console.log(
//         "TOTAL EDITED INVOICES:",
//         editedInvoices.length
//       );

//       console.log(
//         "EDITED INVOICES:",
//         editedInvoices
//       );

//       console.log(
//         "=========================================="
//       );


//       // ======================================================
//       // 3. FETCH CUSTOMER DATA
//       // ======================================================

//       const finalInvoices = [];


//       for (
//         let i = 0;
//         i < editedInvoices.length;
//         i += batchSize
//       ) {

//         const batch =
//           editedInvoices.slice(
//             i,
//             i + batchSize
//           );


//         const batchResults =
//           await Promise.all(

//             batch.map(
//               async (invoice) => {

//                 const accountId =
//                   Number(
//                     invoice?.AccountId ||
//                     0
//                   );


//                 // Walk-in
//                 if (
//                   accountId === 0
//                 ) {

//                   return {
//                     ...invoice,

//                     accountDetails: null,

//                     addressDetails: null,

//                     CustomerType: "R",
//                   };
//                 }


//                 // Fetch Account + Address
//                 const [
//                   account,
//                   address
//                 ] = await Promise.all([
//                   fetchAccount(accountId),
//                   fetchAddress(accountId),
//                 ]);


//                 const customerType =
//                   String(
//                     address?.CustomerType ||
//                       address?.customerType ||
//                       account?.CustomerType ||
//                       account?.customerType ||
//                       invoice?.CustomerType ||
//                       invoice?.customerType ||
//                       ""
//                   )
//                     .trim()
//                     .toUpperCase();


//                 console.log(
//                   "CATEGORY:",
//                   {
//                     InvoiceId:
//                       invoice?.Id,

//                     InvoiceNo:
//                       invoice?.InvoiceNo,

//                     AccountId:
//                       accountId,

//                     CustomerName:
//                       account?.AccountName,

//                     CustomerType:
//                       customerType,
//                   }
//                 );


//                 return {

//                   ...invoice,

//                   accountDetails: {
//                     ...(account || {}),

//                     CustomerType:
//                       customerType,
//                   },

//                   addressDetails:
//                     address,

//                   CustomerType:
//                     customerType,
//                 };
//               }
//             )
//           );


//         finalInvoices.push(
//           ...batchResults
//         );
//       }


//       // ======================================================
//       // 4. SORT BY LATEST INVOICE
//       // ======================================================

//       finalInvoices.sort(
//         (a, b) => {

//           const dateA =
//             moment(
//               getDateValue(
//                 a?.InvoiceDate
//               )
//             ).valueOf();


//           const dateB =
//             moment(
//               getDateValue(
//                 b?.InvoiceDate
//               )
//             ).valueOf();


//           return dateB - dateA;
//         }
//       );


//       // ======================================================
//       // 5. SET DASHBOARD
//       // ======================================================

//       setInvoiceList(
//         finalInvoices
//       );


//       console.log(
//         "=========================================="
//       );

//       console.log(
//         "FINAL DASHBOARD DATA:",
//         finalInvoices
//       );

//       console.log(
//         "=========================================="
//       );

//     } catch (error) {

//       console.error(
//         "DASHBOARD LOAD ERROR:",
//         error
//       );

//     } finally {

//       setLoading(false);
//     }
//   };


//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {

//     loadDashboard();

//   }, []);


//   // ==========================================================
//   // CUSTOMER NAME
//   // ==========================================================

//   const getCustomerName = (invoice) => {

//     const accountName =
//       invoice?.accountDetails?.AccountName ||
//       invoice?.accountDetails?.accountName ||
//       invoice?.AccountName ||
//       invoice?.CustomerName ||
//       invoice?.customerName;


//     if (
//       accountName &&
//       String(accountName).trim()
//     ) {

//       return String(
//         accountName
//       ).trim();
//     }


//     return "Walk-in Customer";
//   };


//   // ==========================================================
//   // CONTACT
//   // ==========================================================

//   const getContact = (invoice) => {

//     return (
//       invoice?.ContactNo ||
//       invoice?.Phone ||
//       invoice?.Mobile ||
//       invoice?.MobileNo ||
//       "-"
//     );
//   };


//   // ==========================================================
//   // FILTERED DATA
//   //
//   // SEARCH ONLY:
//   // Invoice No
//   // Customer Name
//   // ==========================================================

//   const filteredInvoices = useMemo(() => {

//     const search =
//       searchText
//         .trim()
//         .toLowerCase();


//     return invoiceList.filter(
//       (invoice) => {

//         const invoiceNo =
//           String(
//             getInvoiceNumber(
//               invoice
//             )
//           )
//             .toLowerCase();


//         const customerName =
//           String(
//             getCustomerName(
//               invoice
//             )
//           )
//             .toLowerCase();


//         const invoiceDate =
//           formatDateForFilter(
//             invoice?.InvoiceDate
//           );


//         // ==================================================
//         // SEARCH
//         // ==================================================

//         const searchMatch =
//           !search ||
//           invoiceNo.includes(search) ||
//           customerName.includes(search);


//         // ==================================================
//         // SALE TYPE
//         // ==================================================

//         const currentSaleType =
//           getSaleType(
//             invoice
//           );


//         const typeMatch =
//           saleType === "ALL" ||
//           currentSaleType === saleType;


//         // ==================================================
//         // FROM DATE
//         // ==================================================

//         const fromMatch =
//           !fromDate ||
//           (
//             invoiceDate &&
//             invoiceDate >= fromDate
//           );


//         // ==================================================
//         // TO DATE
//         // ==================================================

//         const toMatch =
//           !toDate ||
//           (
//             invoiceDate &&
//             invoiceDate <= toDate
//           );


//         return (
//           searchMatch &&
//           typeMatch &&
//           fromMatch &&
//           toMatch
//         );
//       }
//     );

//   }, [
//     invoiceList,
//     searchText,
//     saleType,
//     fromDate,
//     toDate,
//   ]);


//   // ==========================================================
//   // COUNTS
//   // ==========================================================

//   const editedCount =
//     filteredInvoices.length;


//   const regularCount =
//     filteredInvoices.filter(
//       (invoice) =>
//         getSaleType(invoice) ===
//         "Regular"
//     ).length;


//   const dealerCount =
//     filteredInvoices.filter(
//       (invoice) =>
//         getSaleType(invoice) ===
//         "Dealer"
//     ).length;


//   const caterersCount =
//     filteredInvoices.filter(
//       (invoice) =>
//         getSaleType(invoice) ===
//         "Caterers"
//     ).length;


//   const dealerCaterersCount =
//     dealerCount +
//     caterersCount;


//   // ==========================================================
//   // CLEAR FILTERS
//   // ==========================================================

//   const clearFilters = () => {

//     setSearchText("");

//     setSaleType("ALL");

//     setFromDate("");

//     setToDate("");
//   };


//   // ==========================================================
//   // FETCH CURRENT INVOICE
//   // ==========================================================

//   const fetchCurrentInvoice = async (
//     invoiceId
//   ) => {

//     const [
//       headerResponse,
//       detailResponse
//     ] = await Promise.all([

//       axios.get(
//         `${API_BASE}/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${encodeURIComponent(
//           invoiceId
//         )}`
//       ),

//       axios.get(
//         `${API_BASE}/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${encodeURIComponent(
//           invoiceId
//         )}`
//       ),

//     ]);


//     const headers =
//       toArray(
//         headerResponse
//       );


//     const details =
//       toArray(
//         detailResponse
//       );


//     return {

//       header:
//         headers[0] || null,

//       details,

//     };
//   };


//   // ==========================================================
//   // OPEN HISTORY
//   // ==========================================================

//   const openHistory = async (
//     invoice
//   ) => {

//     const invoiceId =
//       invoice?.Id ||
//       invoice?.InvoiceId;


//     if (!invoiceId) {

//       console.error(
//         "Invoice ID missing:",
//         invoice
//       );

//       return;
//     }


//     setSelectedInvoice(
//       invoice
//     );

//     setHistoryOpen(
//       true
//     );

//     setHistoryLoading(
//       true
//     );


//     setHistoryHeader([]);

//     setHistoryDetails([]);

//     setCurrentHeader(
//       null
//     );

//     setCurrentDetails([]);

//     setSelectedVersion(
//       null
//     );

//     setSelectedVersionDetails([]);


//     try {

//       // ======================================================
//       // OLD HEADER
//       // ======================================================

//       const oldHeaderResponse =
//         await axios.get(
//           `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
//             invoiceId
//           )}`
//         );


//       const oldHeaders =
//         toArray(
//           oldHeaderResponse
//         );


//       // ======================================================
//       // OLD DETAILS
//       // ======================================================

//       const oldDetailResponse =
//         await axios.get(
//           `${API_BASE}/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
//             invoiceId
//           )}`
//         );


//       const oldDetails =
//         toArray(
//           oldDetailResponse
//         );


//       console.log(
//         "OLD HEADERS:",
//         oldHeaders
//       );

//       console.log(
//         "OLD DETAILS:",
//         oldDetails
//       );


//       setHistoryHeader(
//         oldHeaders
//       );

//       setHistoryDetails(
//         oldDetails
//       );


//       // ======================================================
//       // CURRENT INVOICE
//       // ======================================================

//       const current =
//         await fetchCurrentInvoice(
//           invoiceId
//         );


//       setCurrentHeader(
//         current.header
//       );

//       setCurrentDetails(
//         current.details
//       );


//       // ======================================================
//       // DEFAULT LATEST VERSION
//       // ======================================================

//       if (
//         oldHeaders.length > 0
//       ) {

//         const sorted =
//           [...oldHeaders].sort(
//             (a, b) =>
//               Number(
//                 b?.VersionNo || 0
//               ) -
//               Number(
//                 a?.VersionNo || 0
//               )
//           );


//         const latest =
//           sorted[0];


//         const latestVersion =
//           Number(
//             latest?.VersionNo || 0
//           );


//         if (
//           latestVersion
//         ) {

//           setSelectedVersion(
//             latestVersion
//           );


//           const latestDetails =
//             oldDetails.filter(
//               (detail) =>
//                 Number(
//                   detail?.VersionNo
//                 ) ===
//                 latestVersion
//             );


//           setSelectedVersionDetails(
//             latestDetails
//           );
//         }
//       }

//     } catch (error) {

//       console.error(
//         "OPEN HISTORY ERROR:",
//         error
//       );

//     } finally {

//       setHistoryLoading(
//         false
//       );
//     }
//   };


//   // ==========================================================
//   // SELECT VERSION
//   // ==========================================================

//   const selectVersion = (
//     historyItem
//   ) => {

//     const version =
//       Number(
//         historyItem?.VersionNo || 0
//       );


//     if (!version) {
//       return;
//     }


//     setSelectedVersion(
//       version
//     );


//     const details =
//       historyDetails.filter(
//         (detail) =>
//           Number(
//             detail?.VersionNo
//           ) === version
//       );


//     setSelectedVersionDetails(
//       details
//     );
//   };


//   // ==========================================================
//   // CLOSE HISTORY
//   // ==========================================================

//   const closeHistory = () => {

//     setHistoryOpen(false);

//     setSelectedInvoice(null);

//     setHistoryHeader([]);

//     setHistoryDetails([]);

//     setCurrentHeader(null);

//     setCurrentDetails([]);

//     setSelectedVersion(null);

//     setSelectedVersionDetails([]);
//   };


//   // ==========================================================
//   // PRODUCT NAME
//   // ==========================================================

//   const getProductName = (
//     detail
//   ) => {

//     return (
//       detail?.ProductName ||
//       detail?.productName ||
//       detail?.Product ||
//       detail?.product ||
//       `Product ${detail?.ProductId || "-"}`
//     );
//   };


//   // ==========================================================
//   // SALE TYPE ICON
//   // ==========================================================

//   const getSaleTypeIcon = (
//     type
//   ) => {

//     if (type === "Dealer") {
//       return (
//         <StoreIcon
//           sx={{
//             fontSize: 18,
//           }}
//         />
//       );
//     }


//     if (type === "Caterers") {
//       return (
//         <RestaurantIcon
//           sx={{
//             fontSize: 18,
//           }}
//         />
//       );
//     }


//     return (
//       <PersonIcon
//         sx={{
//           fontSize: 18,
//         }}
//       />
//     );
//   };


//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (

//     <Box
//       sx={{
//         minHeight: "100vh",

//         background:
//           "linear-gradient(135deg,#f3f7f5 0%,#eef3f7 100%)",

//         p: {
//           xs: 1.5,
//           md: 3,
//         },
//       }}
//     >

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <Paper
//         elevation={0}
//         sx={{
//           background:
//             "linear-gradient(135deg,#00695c 0%,#004d40 100%)",

//           color: "#fff",

//           borderRadius: 4,

//           px: {
//             xs: 2,
//             md: 4,
//           },

//           py: {
//             xs: 2,
//             md: 3,
//           },

//           mb: 3,

//           display: "flex",

//           alignItems: "center",

//           justifyContent:
//             "space-between",

//           boxShadow:
//             "0 8px 25px rgba(0,0,0,0.12)",
//         }}
//       >

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >

//           <Box
//             sx={{
//               width: 60,
//               height: 60,
//               borderRadius: 3,
//               background:
//                 "rgba(255,255,255,0.15)",

//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >

//             <HistoryIcon
//               sx={{
//                 fontSize: 34,
//               }}
//             />

//           </Box>


//           <Box>

//             <Typography
//               sx={{
//                 fontSize: {
//                   xs: 25,
//                   md: 34,
//                 },

//                 fontWeight: 800,

//                 lineHeight: 1.1,
//               }}
//             >
//               Invoice History
//             </Typography>


//             <Typography
//               sx={{
//                 mt: 0.5,

//                 fontSize: {
//                   xs: 13,
//                   md: 17,
//                 },

//                 opacity: 0.9,
//               }}
//             >
//               View edited invoices and previous versions
//             </Typography>

//           </Box>

//         </Box>


//         <Button
//           variant="contained"
//           startIcon={
//             <RefreshIcon />
//           }
//           onClick={
//             loadDashboard
//           }
//           disabled={loading}
//           sx={{
//             background:
//               "rgba(255,255,255,0.16)",

//             color: "#fff",

//             textTransform:
//               "none",

//             fontWeight: 700,

//             borderRadius: 2,

//             px: 2.5,

//             "&:hover": {
//               background:
//                 "rgba(255,255,255,0.25)",
//             },
//           }}
//         >
//           Refresh
//         </Button>

//       </Paper>


//       {/* =====================================================
//           SEARCH & FILTER
//       ===================================================== */}

//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 4,

//           p: {
//             xs: 2,
//             md: 3,
//           },

//           mb: 3,

//           border:
//             "1px solid #e5e7eb",
//         }}
//       >

//         <Box
//           sx={{
//             display: "flex",

//             alignItems: "center",

//             gap: 1,

//             mb: 2,
//           }}
//         >

//           <ReceiptLongIcon
//             sx={{
//               color: "#00695c",
//               fontSize: 28,
//             }}
//           />

//           <Typography
//             sx={{
//               fontSize: 25,
//               fontWeight: 800,
//             }}
//           >
//             Search & Filter
//           </Typography>

//         </Box>


//         <Box
//           sx={{
//             display: "grid",

//             gridTemplateColumns: {
//               xs: "1fr",

//               md:
//                 "2fr 1fr 1fr 1fr auto",
//             },

//             gap: 2,

//             alignItems: "center",
//           }}
//         >

//           {/* SEARCH */}

//           <TextField
//             fullWidth
//             value={searchText}
//             onChange={(e) =>
//               setSearchText(
//                 e.target.value
//               )
//             }
//             placeholder="Search Invoice / Customer"
//             size="medium"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment
//                   position="start"
//                 >
//                   <SearchIcon
//                     sx={{
//                       color: "#777",
//                     }}
//                   />
//                 </InputAdornment>
//               ),
//             }}
//           />


//           {/* SALE TYPE */}

//           <TextField
//             select
//             fullWidth
//             label="Sale Type"
//             value={saleType}
//             onChange={(e) =>
//               setSaleType(
//                 e.target.value
//               )
//             }
//           >

//             <MenuItem value="ALL">
//               All Sales
//             </MenuItem>

//             <MenuItem value="Regular">
//               Regular
//             </MenuItem>

//             <MenuItem value="Dealer">
//               Dealer
//             </MenuItem>

//             <MenuItem value="Caterers">
//               Caterers
//             </MenuItem>

//           </TextField>


//           {/* FROM DATE */}

//           <TextField
//             fullWidth
//             type="date"
//             label="From Date"
//             value={fromDate}
//             onChange={(e) =>
//               setFromDate(
//                 e.target.value
//               )
//             }
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />


//           {/* TO DATE */}

//           <TextField
//             fullWidth
//             type="date"
//             label="To Date"
//             value={toDate}
//             onChange={(e) =>
//               setToDate(
//                 e.target.value
//               )
//             }
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />


//           {/* CLEAR */}

//           <Button
//             variant="outlined"
//             startIcon={
//               <FilterAltOffIcon />
//             }
//             onClick={
//               clearFilters
//             }
//             sx={{
//               height: 56,

//               whiteSpace:
//                 "nowrap",

//               textTransform:
//                 "none",

//               fontWeight: 700,

//               borderRadius: 2,
//             }}
//           >
//             Clear Filters
//           </Button>

//         </Box>

//       </Paper>


//       {/* =====================================================
//           SUMMARY CARDS
//       ===================================================== */}

//       <Box
//         sx={{
//           display: "grid",

//           gridTemplateColumns: {
//             xs: "1fr",

//             md:
//               "repeat(3,1fr)",
//           },

//           gap: 3,

//           mb: 3,
//         }}
//       >

//         {/* EDITED */}

//         <SummaryCard
//           title="Edited Invoices"
//           value={editedCount}
//           icon={
//             <EditNoteIcon
//               sx={{
//                 fontSize: 50,
//               }}
//             />
//           }
//         />


//         {/* REGULAR */}

//         <SummaryCard
//           title="Regular"
//           value={regularCount}
//           icon={
//             <CalendarMonthIcon
//               sx={{
//                 fontSize: 50,
//               }}
//             />
//           }
//         />


//         {/* DEALER / CATERERS */}

//         <SummaryCard
//           title="Dealer / Caterers"
//           value={
//             dealerCaterersCount
//           }
//           icon={
//             <HistoryIcon
//               sx={{
//                 fontSize: 55,
//               }}
//             />
//           }
//         />

//       </Box>


//       {/* =====================================================
//           SMALL TYPE SUMMARY
//       ===================================================== */}

//       <Box
//         sx={{
//           display: "flex",
//           gap: 1.5,
//           flexWrap: "wrap",
//           mb: 3,
//         }}
//       >

//         <Chip
//           icon={
//             <PersonIcon />
//           }
//           label={`Regular: ${regularCount}`}
//           variant="outlined"
//           sx={{
//             fontWeight: 700,
//           }}
//         />

//         <Chip
//           icon={
//             <StoreIcon />
//           }
//           label={`Dealer: ${dealerCount}`}
//           variant="outlined"
//           sx={{
//             fontWeight: 700,
//           }}
//         />

//         <Chip
//           icon={
//             <RestaurantIcon />
//           }
//           label={`Caterers: ${caterersCount}`}
//           variant="outlined"
//           sx={{
//             fontWeight: 700,
//           }}
//         />

//       </Box>


//       {/* =====================================================
//           EDITED INVOICE LIST
//       ===================================================== */}

//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 4,

//           overflow: "hidden",

//           border:
//             "1px solid #e5e7eb",
//         }}
//       >

//         <Box
//           sx={{
//             px: 3,

//             py: 2.5,

//             background:
//               "linear-gradient(135deg,#f4faf7,#edf7f3)",

//             borderBottom:
//               "1px solid #ddd",
//           }}
//         >

//           <Typography
//             sx={{
//               fontSize: 27,

//               fontWeight: 800,
//             }}
//           >
//             Edited Invoice List
//           </Typography>


//           <Typography
//             sx={{
//               color: "#666",

//               mt: 0.5,
//             }}
//           >
//             Only invoices having edit history are shown here.
//           </Typography>

//         </Box>


//         {loading ? (

//           <Box
//             sx={{
//               py: 8,

//               display: "flex",

//               justifyContent:
//                 "center",

//               alignItems:
//                 "center",

//               flexDirection:
//                 "column",

//               gap: 2,
//             }}
//           >

//             <CircularProgress />

//             <Typography
//               color="text.secondary"
//             >
//               Loading edited invoices...
//             </Typography>

//           </Box>

//         ) : filteredInvoices.length === 0 ? (

//           <Box
//             sx={{
//               py: 8,

//               textAlign: "center",
//             }}
//           >

//             <HistoryIcon
//               sx={{
//                 fontSize: 60,

//                 color: "#bbb",
//               }}
//             />


//             <Typography
//               sx={{
//                 mt: 1,

//                 fontSize: 18,

//                 fontWeight: 600,

//                 color: "#777",
//               }}
//             >
//               No edited invoices found
//             </Typography>


//             <Typography
//               sx={{
//                 mt: 0.5,

//                 color: "#999",
//               }}
//             >
//               Try another invoice number or customer name.
//             </Typography>

//           </Box>

//         ) : (

//           <TableContainer>

//             <Table>

//               <TableHead>

//                 <TableRow
//                   sx={{
//                     background:
//                       "#edf3f2",
//                   }}
//                 >

//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Invoice No
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Invoice Date
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Customer
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Sale Type
//                   </TableCell>


//                   <TableCell
//                     align="right"
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Total
//                   </TableCell>


//                   <TableCell
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Status
//                   </TableCell>


//                   <TableCell
//                     align="center"
//                     sx={{
//                       fontWeight: 800,
//                     }}
//                   >
//                     Action
//                   </TableCell>

//                 </TableRow>

//               </TableHead>


//               <TableBody>

//                 {filteredInvoices.map(
//                   (invoice, index) => {

//                     const currentType =
//                       getSaleType(
//                         invoice
//                       );


//                     return (

//                       <TableRow
//                         key={
//                           invoice?.Id ||
//                           invoice?.InvoiceId ||
//                           index
//                         }
//                         hover
//                       >

//                         {/* INVOICE NO */}

//                         <TableCell>

//                           <Typography
//                             sx={{
//                               fontWeight: 800,

//                               fontSize: 17,
//                             }}
//                           >
//                             #
//                             {
//                               getInvoiceNumber(
//                                 invoice
//                               )
//                             }
//                           </Typography>

//                         </TableCell>


//                         {/* DATE */}

//                         <TableCell>

//                           <Box
//                             sx={{
//                               display: "flex",

//                               alignItems:
//                                 "center",

//                               gap: 1,
//                             }}
//                           >

//                             <CalendarMonthIcon
//                               sx={{
//                                 fontSize: 20,

//                                 color: "#777",
//                               }}
//                             />

//                             {
//                               formatDate(
//                                 invoice?.InvoiceDate
//                               )
//                             }

//                           </Box>

//                         </TableCell>


//                         {/* CUSTOMER */}

//                         <TableCell>

//                           <Typography
//                             sx={{
//                               fontWeight: 700,
//                             }}
//                           >
//                             {
//                               getCustomerName(
//                                 invoice
//                               )
//                             }
//                           </Typography>


//                           {getContact(
//                             invoice
//                           ) !== "-" && (

//                             <Typography
//                               sx={{
//                                 fontSize: 12,

//                                 color: "#888",
//                               }}
//                             >
//                               {
//                                 getContact(
//                                   invoice
//                                 )
//                               }
//                             </Typography>

//                           )}

//                         </TableCell>


//                         {/* SALE TYPE */}

//                         <TableCell>

//                           <Chip
//                             icon={
//                               getSaleTypeIcon(
//                                 currentType
//                               )
//                             }
//                             label={
//                               currentType
//                             }
//                             size="small"
//                             variant="outlined"
//                             sx={{
//                               fontWeight: 700,

//                               borderRadius: 2,
//                             }}
//                           />

//                         </TableCell>


//                         {/* TOTAL */}

//                         <TableCell
//                           align="right"
//                         >

//                           <Typography
//                             sx={{
//                               fontWeight: 800,

//                               fontSize: 17,
//                             }}
//                           >
//                             {
//                               money(
//                                 invoice?.Total
//                               )
//                             }
//                           </Typography>

//                         </TableCell>


//                         {/* STATUS */}

//                         <TableCell>

//                           <Chip
//                             icon={
//                               <EditNoteIcon />
//                             }
//                             label="EDITED"
//                             size="small"
//                             sx={{
//                               fontWeight: 800,

//                               background:
//                                 "#eeeeee",

//                               color:
//                                 "#555",
//                             }}
//                           />

//                         </TableCell>


//                         {/* ACTION */}

//                         <TableCell
//                           align="center"
//                         >

//                           <Button
//                             variant="contained"
//                             startIcon={
//                               <VisibilityIcon />
//                             }
//                             onClick={() =>
//                               openHistory(
//                                 invoice
//                               )
//                             }
//                             sx={{
//                               textTransform:
//                                 "none",

//                               fontWeight: 800,

//                               borderRadius: 2,

//                               background:
//                                 "#1976d2",

//                               "&:hover":
//                                 {
//                                   background:
//                                     "#1565c0",
//                                 },
//                             }}
//                           >
//                             View
//                           </Button>

//                         </TableCell>

//                       </TableRow>

//                     );
//                   }
//                 )}

//               </TableBody>

//             </Table>

//           </TableContainer>

//         )}

//       </Paper>


//       {/* =====================================================
//           HISTORY DIALOG
//       ===================================================== */}

//       <Dialog
//         open={historyOpen}
//         onClose={closeHistory}
//         fullWidth
//         maxWidth="xl"
//         PaperProps={{
//           sx: {
//             borderRadius: 3,

//             maxHeight:
//               "94vh",
//           },
//         }}
//       >

//         {/* HEADER */}

//         <Box
//           sx={{
//             background:
//               "linear-gradient(135deg,#1976d2,#0d47a1)",

//             color: "#fff",

//             px: 3,

//             py: 2,

//             display: "flex",

//             alignItems:
//               "center",

//             justifyContent:
//               "space-between",
//           }}
//         >

//           <Box>

//             <Typography
//               sx={{
//                 fontSize: 28,

//                 fontWeight: 800,
//               }}
//             >
//               Invoice Edit History
//             </Typography>


//             <Typography
//               sx={{
//                 mt: 0.5,

//                 opacity: 0.9,
//               }}
//             >
//               Invoice No:{" "}
//               {
//                 selectedInvoice
//                   ? getInvoiceNumber(
//                       selectedInvoice
//                     )
//                   : "-"
//               }
//             </Typography>

//           </Box>


//           <IconButton
//             onClick={
//               closeHistory
//             }
//             sx={{
//               color: "#fff",
//             }}
//           >
//             <CloseIcon />
//           </IconButton>

//         </Box>


//         <DialogContent
//           sx={{
//             background:
//               "#f5f7fa",

//             p: {
//               xs: 2,
//               md: 3,
//             },
//           }}
//         >

//           {historyLoading ? (

//             <Box
//               sx={{
//                 minHeight: 400,

//                 display: "flex",

//                 alignItems:
//                   "center",

//                 justifyContent:
//                   "center",
//               }}
//             >

//               <CircularProgress />

//             </Box>

//           ) : (

//             <>

//               {/* =================================================
//                   CURRENT INVOICE
//               ================================================= */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,

//                   mb: 3,

//                   borderRadius: 3,

//                   border:
//                     "1px solid #ddd",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize: 26,

//                     fontWeight: 800,

//                     color: "#1976d2",

//                     mb: 3,
//                   }}
//                 >
//                   Current Invoice
//                 </Typography>


//                 <Box
//                   sx={{
//                     display: "grid",

//                     gridTemplateColumns: {
//                       xs:
//                         "repeat(2,1fr)",

//                       md:
//                         "repeat(6,1fr)",
//                     },

//                     gap: 3,
//                   }}
//                 >

//                   <InfoItem
//                     label="Invoice No"
//                     value={
//                       currentHeader?.InvoiceNo ||
//                       currentHeader?.Id ||
//                       "-"
//                     }
//                   />


//                   <InfoItem
//                     label="Invoice Date"
//                     value={
//                       formatDate(
//                         currentHeader?.InvoiceDate
//                       )
//                     }
//                   />


//                   <InfoItem
//                     label="Customer"
//                     value={
//                       getCustomerName(
//                         {
//                           ...selectedInvoice,
//                           ...currentHeader,
//                         }
//                       )
//                     }
//                   />


//                   <InfoItem
//                     label="Total"
//                     value={
//                       money(
//                         currentHeader?.Total
//                       )
//                     }
//                     valueColor="#1976d2"
//                   />


//                   <InfoItem
//                     label="Received"
//                     value={
//                       money(
//                         currentHeader?.ReceivedAmount
//                       )
//                     }
//                   />


//                   <InfoItem
//                     label="Balance"
//                     value={
//                       money(
//                         Math.max(
//                           Number(
//                             currentHeader?.Total ||
//                             0
//                           ) -
//                           Number(
//                             currentHeader?.ReceivedAmount ||
//                             0
//                           ),
//                           0
//                         )
//                       )
//                     }
//                     valueColor="red"
//                   />

//                 </Box>

//               </Paper>


//               {/* =================================================
//                   PREVIOUS HISTORY
//               ================================================= */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,

//                   mb: 3,

//                   borderRadius: 3,

//                   border:
//                     "1px solid #ddd",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize: 26,

//                     fontWeight: 800,

//                     color: "#ed6c02",

//                     mb: 2,
//                   }}
//                 >
//                   Previous Invoice History
//                 </Typography>


//                 {historyHeader.length === 0 ? (

//                   <Typography
//                     color="text.secondary"
//                   >
//                     No previous history found.
//                   </Typography>

//                 ) : (

//                   <TableContainer>

//                     <Table
//                       size="small"
//                     >

//                       <TableHead>

//                         <TableRow
//                           sx={{
//                             background:
//                               "#eaf2f8",
//                           }}
//                         >

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Version
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Invoice No
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Invoice Date
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Customer
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Total
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Received
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             View
//                           </TableCell>

//                         </TableRow>

//                       </TableHead>


//                       <TableBody>

//                         {[...historyHeader]
//                           .sort(
//                             (a, b) =>
//                               Number(
//                                 b?.VersionNo ||
//                                 0
//                               ) -
//                               Number(
//                                 a?.VersionNo ||
//                                 0
//                               )
//                           )
//                           .map(
//                             (
//                               item,
//                               index
//                             ) => {

//                               const version =
//                                 Number(
//                                   item?.VersionNo ||
//                                   0
//                                 );


//                               const selected =
//                                 selectedVersion ===
//                                 version;


//                               return (

//                                 <TableRow
//                                   key={
//                                     item?.Id ||
//                                     `${version}-${index}`
//                                   }
//                                   sx={{
//                                     backgroundColor:
//                                       selected
//                                         ? "#e3f2fd"
//                                         : "inherit",
//                                   }}
//                                 >

//                                   <TableCell>

//                                     <Button
//                                       variant={
//                                         selected
//                                           ? "contained"
//                                           : "outlined"
//                                       }
//                                       size="small"
//                                       onClick={() =>
//                                         selectVersion(
//                                           item
//                                         )
//                                       }
//                                     >
//                                       VERSION{" "}
//                                       {
//                                         version
//                                       }
//                                     </Button>

//                                   </TableCell>


//                                   <TableCell>
//                                     {
//                                       item?.InvoiceNo ||
//                                       "-"
//                                     }
//                                   </TableCell>


//                                   <TableCell>
//                                     {
//                                       formatDate(
//                                         item?.InvoiceDate
//                                       )
//                                     }
//                                   </TableCell>


//                                   <TableCell>
//                                     {
//                                       getCustomerName(
//                                         {
//                                           ...selectedInvoice,
//                                           ...item,
//                                         }
//                                       )
//                                     }
//                                   </TableCell>


//                                   <TableCell>
//                                     {
//                                       money(
//                                         item?.Total
//                                       )
//                                     }
//                                   </TableCell>


//                                   <TableCell>
//                                     {
//                                       money(
//                                         item?.ReceivedAmount
//                                       )
//                                     }
//                                   </TableCell>


//                                   <TableCell>

//                                     <Button
//                                       size="small"
//                                       onClick={() =>
//                                         selectVersion(
//                                           item
//                                         )
//                                       }
//                                     >
//                                       VIEW
//                                     </Button>

//                                   </TableCell>

//                                 </TableRow>

//                               );
//                             }
//                           )}

//                       </TableBody>

//                     </Table>

//                   </TableContainer>

//                 )}

//               </Paper>


//               {/* =================================================
//                   OLD VS CURRENT
//               ================================================= */}

//               {selectedVersion && (

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,

//                     mb: 3,

//                     borderRadius: 3,

//                     border:
//                       "1px solid #ddd",
//                   }}
//                 >

//                   <Typography
//                     sx={{
//                       fontSize: 26,

//                       fontWeight: 800,

//                       color: "#7b1fa2",

//                       mb: 2,
//                     }}
//                   >
//                     Old vs Current Invoice
//                   </Typography>


//                   {(() => {

//                     const oldHeader =
//                       historyHeader.find(
//                         (item) =>
//                           Number(
//                             item?.VersionNo
//                           ) ===
//                           Number(
//                             selectedVersion
//                           )
//                       );


//                     const oldBalance =
//                       Math.max(
//                         Number(
//                           oldHeader?.Total ||
//                           0
//                         ) -
//                         Number(
//                           oldHeader?.ReceivedAmount ||
//                           0
//                         ),
//                         0
//                       );


//                     const currentBalance =
//                       Math.max(
//                         Number(
//                           currentHeader?.Total ||
//                           0
//                         ) -
//                         Number(
//                           currentHeader?.ReceivedAmount ||
//                           0
//                         ),
//                         0
//                       );


//                     return (

//                       <TableContainer>

//                         <Table>

//                           <TableHead>

//                             <TableRow
//                               sx={{
//                                 background:
//                                   "#f3e5f5",
//                               }}
//                             >

//                               <TableCell
//                                 sx={{
//                                   fontWeight: 800,
//                                 }}
//                               >
//                                 Field
//                               </TableCell>


//                               <TableCell
//                                 sx={{
//                                   fontWeight: 800,
//                                 }}
//                               >
//                                 Version{" "}
//                                 {
//                                   selectedVersion
//                                 }
//                               </TableCell>


//                               <TableCell
//                                 sx={{
//                                   fontWeight: 800,
//                                 }}
//                               >
//                                 Current
//                               </TableCell>

//                             </TableRow>

//                           </TableHead>


//                           <TableBody>

//                             <CompareRow
//                               label="Invoice No"
//                               oldValue={
//                                 oldHeader?.InvoiceNo ||
//                                 "-"
//                               }
//                               currentValue={
//                                 currentHeader?.InvoiceNo ||
//                                 "-"
//                               }
//                             />


//                             <CompareRow
//                               label="Invoice Date"
//                               oldValue={
//                                 formatDate(
//                                   oldHeader?.InvoiceDate
//                                 )
//                               }
//                               currentValue={
//                                 formatDate(
//                                   currentHeader?.InvoiceDate
//                                 )
//                               }
//                             />


//                             <CompareRow
//                               label="Customer"
//                               oldValue={
//                                 getCustomerName(
//                                   {
//                                     ...selectedInvoice,
//                                     ...oldHeader,
//                                   }
//                                 )
//                               }
//                               currentValue={
//                                 getCustomerName(
//                                   {
//                                     ...selectedInvoice,
//                                     ...currentHeader,
//                                   }
//                                 )
//                               }
//                             />


//                             <CompareRow
//                               label="Total"
//                               oldValue={
//                                 money(
//                                   oldHeader?.Total
//                                 )
//                               }
//                               currentValue={
//                                 money(
//                                   currentHeader?.Total
//                                 )
//                               }
//                             />


//                             <CompareRow
//                               label="Received"
//                               oldValue={
//                                 money(
//                                   oldHeader?.ReceivedAmount
//                                 )
//                               }
//                               currentValue={
//                                 money(
//                                   currentHeader?.ReceivedAmount
//                                 )
//                               }
//                             />


//                             <CompareRow
//                               label="Balance"
//                               oldValue={
//                                 money(
//                                   oldBalance
//                                 )
//                               }
//                               currentValue={
//                                 money(
//                                   currentBalance
//                                 )
//                               }
//                             />

//                           </TableBody>

//                         </Table>

//                       </TableContainer>

//                     );

//                   })()}

//                 </Paper>

//               )}


//               {/* =================================================
//                   PREVIOUS PRODUCTS
//               ================================================= */}

//               {selectedVersion && (

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,

//                     mb: 3,

//                     borderRadius: 3,

//                     border:
//                       "1px solid #ddd",
//                   }}
//                 >

//                   <Typography
//                     sx={{
//                       fontSize: 24,

//                       fontWeight: 800,

//                       color: "#7b1fa2",

//                       mb: 2,
//                     }}
//                   >
//                     Previous Product Details —
//                     Version{" "}
//                     {
//                       selectedVersion
//                     }
//                   </Typography>


//                   {selectedVersionDetails.length === 0 ? (

//                     <Typography
//                       color="text.secondary"
//                     >
//                       No product details found
//                       for this version.
//                     </Typography>

//                   ) : (

//                     <TableContainer>

//                       <Table>

//                         <TableHead>

//                           <TableRow
//                             sx={{
//                               background:
//                                 "#f7f1f8",
//                             }}
//                           >

//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Product
//                             </TableCell>


//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Quantity
//                             </TableCell>


//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Rate
//                             </TableCell>


//                             <TableCell
//                               sx={{
//                                 fontWeight: 800,
//                               }}
//                             >
//                               Amount
//                             </TableCell>

//                           </TableRow>

//                         </TableHead>


//                         <TableBody>

//                           {selectedVersionDetails.map(
//                             (
//                               detail,
//                               index
//                             ) => (

//                               <TableRow
//                                 key={
//                                   detail?.Id ||
//                                   index
//                                 }
//                               >

//                                 <TableCell>
//                                   {
//                                     getProductName(
//                                       detail
//                                     )
//                                   }
//                                 </TableCell>


//                                 <TableCell>
//                                   {
//                                     detail?.Quantity ??
//                                     detail?.Qty ??
//                                     "-"
//                                   }
//                                 </TableCell>


//                                 <TableCell>
//                                   {
//                                     money(
//                                       detail?.Rate
//                                     )
//                                   }
//                                 </TableCell>


//                                 <TableCell>
//                                   {
//                                     money(
//                                       detail?.Amount
//                                     )
//                                   }
//                                 </TableCell>

//                               </TableRow>

//                             )
//                           )}

//                         </TableBody>

//                       </Table>

//                     </TableContainer>

//                   )}

//                 </Paper>

//               )}


//               {/* =================================================
//                   CURRENT PRODUCTS
//               ================================================= */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,

//                   borderRadius: 3,

//                   border:
//                     "1px solid #ddd",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize: 24,

//                     fontWeight: 800,

//                     color: "#1976d2",

//                     mb: 2,
//                   }}
//                 >
//                   Current Product Details
//                 </Typography>


//                 {currentDetails.length === 0 ? (

//                   <Typography
//                     color="text.secondary"
//                   >
//                     No current product details found.
//                   </Typography>

//                 ) : (

//                   <TableContainer>

//                     <Table>

//                       <TableHead>

//                         <TableRow
//                           sx={{
//                             background:
//                               "#e3f2fd",
//                           }}
//                         >

//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Product
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Quantity
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Rate
//                           </TableCell>


//                           <TableCell
//                             sx={{
//                               fontWeight: 800,
//                             }}
//                           >
//                             Amount
//                           </TableCell>

//                         </TableRow>

//                       </TableHead>


//                       <TableBody>

//                         {currentDetails.map(
//                           (
//                             detail,
//                             index
//                           ) => (

//                             <TableRow
//                               key={
//                                 detail?.Id ||
//                                 index
//                               }
//                             >

//                               <TableCell>
//                                 {
//                                   getProductName(
//                                     detail
//                                   )
//                                 }
//                               </TableCell>


//                               <TableCell>
//                                 {
//                                   detail?.Quantity ??
//                                   detail?.Qty ??
//                                   "-"
//                                 }
//                               </TableCell>


//                               <TableCell>
//                                 {
//                                   money(
//                                     detail?.Rate
//                                   )
//                                 }
//                               </TableCell>


//                               <TableCell>
//                                 {
//                                   money(
//                                     detail?.Amount
//                                   )
//                                 }
//                               </TableCell>

//                             </TableRow>

//                           )
//                         )}

//                       </TableBody>

//                     </Table>

//                   </TableContainer>

//                 )}

//               </Paper>

//             </>

//           )}

//         </DialogContent>


//         {/* CLOSE */}

//         <Box
//           sx={{
//             px: 3,

//             py: 1.5,

//             borderTop:
//               "1px solid #ddd",

//             display: "flex",

//             justifyContent:
//               "flex-end",
//           }}
//         >

//           <Button
//             variant="contained"
//             onClick={
//               closeHistory
//             }
//             sx={{
//               textTransform:
//                 "none",

//               fontWeight: 700,
//             }}
//           >
//             CLOSE
//           </Button>

//         </Box>

//       </Dialog>

//     </Box>
//   );
// };


// // ============================================================
// // SUMMARY CARD
// // ============================================================

// const SummaryCard = ({
//   title,
//   value,
//   icon,
// }) => {

//   return (

//     <Paper
//       elevation={0}
//       sx={{
//         p: 3,

//         borderRadius: 4,

//         border:
//           "1px solid #e5e7eb",

//         minHeight: 145,

//         display: "flex",

//         justifyContent:
//           "space-between",

//         alignItems:
//           "flex-start",
//       }}
//     >

//       <Box>

//         <Typography
//           sx={{
//             color: "#666",

//             fontSize: 17,
//           }}
//         >
//           {title}
//         </Typography>


//         <Typography
//           sx={{
//             fontSize: 42,

//             fontWeight: 800,

//             mt: 1,
//           }}
//         >
//           {value}
//         </Typography>

//       </Box>


//       <Box
//         sx={{
//           color: "#aaa",

//           display: "flex",

//           alignItems:
//             "center",

//           justifyContent:
//             "center",
//         }}
//       >
//         {icon}
//       </Box>

//     </Paper>
//   );
// };


// // ============================================================
// // INFO ITEM
// // ============================================================

// const InfoItem = ({
//   label,
//   value,
//   valueColor,
// }) => {

//   return (

//     <Box>

//       <Typography
//         sx={{
//           color: "#666",

//           fontSize: 15,

//           mb: 0.5,
//         }}
//       >
//         {label}
//       </Typography>


//       <Typography
//         sx={{
//           fontSize: 18,

//           fontWeight: 800,

//           color:
//             valueColor ||
//             "#222",
//         }}
//       >
//         {value}
//       </Typography>

//     </Box>
//   );
// };


// // ============================================================
// // COMPARE ROW
// // ============================================================

// const CompareRow = ({
//   label,
//   oldValue,
//   currentValue,
// }) => {

//   const changed =
//     String(
//       oldValue ?? ""
//     ) !==
//     String(
//       currentValue ?? ""
//     );


//   return (

//     <TableRow>

//       <TableCell
//         sx={{
//           fontWeight: 700,
//         }}
//       >
//         {label}
//       </TableCell>


//       <TableCell
//         sx={{
//           background:
//             changed
//               ? "#fff3e0"
//               : "transparent",

//           fontWeight:
//             changed
//               ? 700
//               : 500,
//         }}
//       >
//         {oldValue}
//       </TableCell>


//       <TableCell
//         sx={{
//           background:
//             changed
//               ? "#e8f5e9"
//               : "transparent",

//           fontWeight:
//             changed
//               ? 700
//               : 500,
//         }}
//       >
//         {currentValue}
//       </TableCell>

//     </TableRow>
//   );
// };


// export default InvoiceEditHistoryDashboard;


































import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import RestaurantIcon from "@mui/icons-material/Restaurant";


// ============================================================
// API
// ============================================================

const API_BASE =
  "https://amrutdairyapi.microtechsolutions.net.in/php";


// ============================================================
// SAFE ARRAY
// ============================================================

const toArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (data?.data) {
    return [data.data];
  }

  if (data) {
    return [data];
  }

  return [];
};


// ============================================================
// DATE VALUE
// ============================================================

const getDateValue = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return (
      value?.date ||
      value?.Date ||
      value?.value ||
      ""
    );
  }

  return String(value);
};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {
  const dateValue = getDateValue(value);

  if (!dateValue) {
    return "-";
  }

  const date = moment(dateValue);

  if (!date.isValid()) {
    return "-";
  }

  return date.format("DD/MM/YYYY");
};


// ============================================================
// FILTER DATE
// ============================================================

const formatDateForFilter = (value) => {
  const dateValue = getDateValue(value);

  if (!dateValue) {
    return "";
  }

  const date = moment(dateValue);

  if (!date.isValid()) {
    return "";
  }

  return date.format("YYYY-MM-DD");
};


// ============================================================
// MONEY
// ============================================================

const money = (value) => {
  const number = Number(value || 0);

  return `₹ ${number.toFixed(2)}`;
};


// ============================================================
// CUSTOMER TYPE
// ============================================================

const getCustomerType = (invoice) => {
  const type = String(
    invoice?.CustomerType ||
      invoice?.customerType ||
      invoice?.accountDetails?.CustomerType ||
      invoice?.accountDetails?.customerType ||
      invoice?.addressDetails?.CustomerType ||
      invoice?.addressDetails?.customerType ||
      ""
  )
    .trim()
    .toUpperCase();

  return type;
};


// ============================================================
// SALE TYPE
//
// R = Regular
// D = Dealer
// C = Caterers
//
// IMPORTANT:
// AccountId = 0 means Walk-in Customer
// Walk-in is treated as Regular
// ============================================================

// ============================================================
// SALE TYPE
//
// R = Regular
// D = Dealer
// C = Caterers
//
// AccountId = 0 => Regular
// ============================================================
const getSaleType = (invoice) => {
  const accountId = Number(
    invoice?.AccountId ||
    invoice?.accountId ||
    0
  );

  const customerType = getCustomerType(invoice);

  // Walk-in / no account
  if (accountId === 0) {
    return "Regular";
  }

  if (customerType === "R") {
    return "Regular";
  }

  if (customerType === "D") {
    return "Dealer";
  }

  if (customerType === "C") {
    return "Caterers";
  }

  // Unknown account type -> Regular
  return "Regular";
};


// ============================================================
// INVOICE NUMBER
// ============================================================

const getInvoiceNumber = (invoice) => {
  return (
    invoice?.InvoiceNo ||
    invoice?.InvoiceNumber ||
    invoice?.BillNo ||
    invoice?.BillNumber ||
    "-"
  );
};


// ============================================================
// COMPONENT
// ============================================================

const InvoiceEditHistoryDashboard = () => {

  // ==========================================================
  // MAIN DATA
  // ==========================================================

  const [invoiceList, setInvoiceList] = useState([]);

  const [loading, setLoading] = useState(false);


  const [productOptions, setProductOptions] = useState([]);





  // ==========================================================
// LOAD PRODUCT MASTER
// ==========================================================
const fetchProductMaster = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/get/gettable.php?Table=ProductMaster`
    );

    const data = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    const options = data
      .map((product) => {
        const productId =
          product?.Id ??
          product?.ProductId ??
          product?.id;

        const productName =
          product?.ProductName ??
          product?.productName ??
          product?.Name ??
          product?.name ??
          "";

        return {
          value: productId,
          label: productName,
          Id: productId,
          ProductId: product?.ProductId ?? productId,
          ProductName: productName,
        };
      })
      .filter(
        (product) =>
          product.value !== null &&
          product.value !== undefined
      );

    setProductOptions(options);

    console.log(
      "=========================================="
    );
    console.log(
      "PRODUCT MASTER LOADED"
    );
    console.log(
      "TOTAL PRODUCTS:",
      options.length
    );
    console.log(
      "PRODUCT MASTER:",
      options
    );
    console.log(
      "=========================================="
    );

    return options;

  } catch (error) {
    console.error(
      "PRODUCT MASTER LOAD ERROR:",
      error
    );

    setProductOptions([]);

    return [];
  }
};


  // ==========================================================
  // FILTERS
  // ==========================================================

  const [searchText, setSearchText] = useState("");

  const [saleType, setSaleType] = useState("ALL");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");


  // ==========================================================
  // HISTORY DIALOG
  // ==========================================================

  const [historyOpen, setHistoryOpen] = useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);

  const [historyHeader, setHistoryHeader] =
    useState([]);

  const [historyDetails, setHistoryDetails] =
    useState([]);

  const [currentHeader, setCurrentHeader] =
    useState(null);

  const [currentDetails, setCurrentDetails] =
    useState([]);

  const [selectedVersion, setSelectedVersion] =
    useState(null);

  const [selectedVersionDetails, setSelectedVersionDetails] =
    useState([]);


  // ==========================================================
  // FETCH ALL CURRENT INVOICES
  // ==========================================================

  const fetchAllInvoiceHeaders = async () => {

    try {

      console.log(
        "=========================================="
      );

      console.log(
        "FETCHING ALL CURRENT INVOICES"
      );

      console.log(
        "=========================================="
      );


      // First page
      const firstResponse = await axios.get(
        `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=1`
      );

      const firstData =
        firstResponse?.data || {};


      const totalPages = Math.max(
        Number(firstData?.total_pages || 1),
        1
      );


      console.log(
        "TOTAL INVOICE PAGES:",
        totalPages
      );


      const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );


      const responses = await Promise.all(
        pageNumbers.map(async (pageNo) => {

          try {

            const response = await axios.get(
              `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=${pageNo}`
            );

            return toArray(response);

          } catch (error) {

            console.error(
              `Invoice page ${pageNo} failed`,
              error
            );

            return [];
          }
        })
      );


      const allInvoices =
        responses.flat();


      // =====================================================
      // REMOVE DUPLICATES
      // =====================================================

      const uniqueInvoices = [];

      const seenIds = new Set();


      allInvoices.forEach((invoice) => {

        const id =
          invoice?.Id ||
          invoice?.InvoiceId;


        if (!id) {
          return;
        }


        const key = String(id);


        if (seenIds.has(key)) {
          return;
        }


        seenIds.add(key);

        uniqueInvoices.push(invoice);

      });


      console.log(
        "TOTAL UNIQUE CURRENT INVOICES:",
        uniqueInvoices.length
      );


      return uniqueInvoices;

    } catch (error) {

      console.error(
        "FETCH ALL INVOICE HEADER ERROR:",
        error
      );

      return [];
    }
  };


  // ==========================================================
  // FETCH ACCOUNT
  // ==========================================================

  const fetchAccount = async (accountId) => {

    if (
      !accountId ||
      Number(accountId) === 0
    ) {
      return null;
    }


    try {

      const response = await axios.get(
        `${API_BASE}/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
          accountId
        )}`
      );


      const list = toArray(response);


      return list[0] || null;

    } catch (error) {

      console.error(
        "ACCOUNT FETCH ERROR:",
        accountId,
        error
      );

      return null;
    }
  };


  // ==========================================================
  // FETCH ADDRESS
  // ==========================================================

  const fetchAddress = async (accountId) => {

    if (
      !accountId ||
      Number(accountId) === 0
    ) {
      return null;
    }


    try {

      const response = await axios.get(
        `${API_BASE}/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
          accountId
        )}`
      );


      const list = toArray(response);


      return list[0] || null;

    } catch (error) {

      console.error(
        "ADDRESS FETCH ERROR:",
        accountId,
        error
      );

      return null;
    }
  };


  // ==========================================================
  // FETCH HISTORY FOR ONE INVOICE
  // ==========================================================

  const fetchInvoiceHistory = async (invoiceId) => {

    if (!invoiceId) {
      return [];
    }


    try {

      const response = await axios.get(
        `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
          invoiceId
        )}`
      );


      const history = toArray(response);


      console.log(
        "HISTORY:",
        invoiceId,
        history
      );


      return history;

    } catch (error) {

      console.error(
        "HISTORY FETCH ERROR:",
        invoiceId,
        error
      );

      return [];
    }
  };


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard = async () => {

    setLoading(true);


    try {

      console.log(
        "=========================================="
      );

      console.log(
        "LOADING INVOICE EDIT HISTORY DASHBOARD"
      );

      console.log(
        "=========================================="
      );


      // ======================================================
      // 1. CURRENT INVOICES
      // ======================================================

      const invoices =
        await fetchAllInvoiceHeaders();


      console.log(
        "CURRENT INVOICE COUNT:",
        invoices.length
      );


      // ======================================================
      // 2. FIND EDITED INVOICES
      // ======================================================

      const editedInvoices = [];

      const batchSize = 8;


      for (
        let i = 0;
        i < invoices.length;
        i += batchSize
      ) {

        const batch =
          invoices.slice(
            i,
            i + batchSize
          );


        const batchResults =
          await Promise.all(

            batch.map(
              async (invoice) => {

                const invoiceId =
                  invoice?.Id ||
                  invoice?.InvoiceId;


                if (!invoiceId) {
                  return null;
                }


                const history =
                  await fetchInvoiceHistory(
                    invoiceId
                  );


                // IMPORTANT
                // No history = not edited

                if (
                  !history ||
                  history.length === 0
                ) {
                  return null;
                }


                return {
                  ...invoice,

                  isEdited: true,

                  historyCount:
                    history.length,

                  historyHeader:
                    history,
                };
              }
            )
          );


        batchResults.forEach(
          (item) => {

            if (item) {
              editedInvoices.push(item);
            }

          }
        );
      }


      console.log(
        "=========================================="
      );

      console.log(
        "TOTAL EDITED INVOICES:",
        editedInvoices.length
      );

      console.log(
        "EDITED INVOICES:",
        editedInvoices
      );

      console.log(
        "=========================================="
      );


      // ======================================================
      // 3. FETCH CUSTOMER DATA
      // ======================================================

      const finalInvoices = [];


      for (
        let i = 0;
        i < editedInvoices.length;
        i += batchSize
      ) {

        const batch =
          editedInvoices.slice(
            i,
            i + batchSize
          );


        const batchResults =
          await Promise.all(

            batch.map(
              async (invoice) => {

                const accountId =
                  Number(
                    invoice?.AccountId ||
                    0
                  );


                // Walk-in
                if (
                  accountId === 0
                ) {

                  return {
                    ...invoice,

                    accountDetails: null,

                    addressDetails: null,

                    CustomerType: "R",
                  };
                }


                // Fetch Account + Address
                const [
                  account,
                  address
                ] = await Promise.all([
                  fetchAccount(accountId),
                  fetchAddress(accountId),
                ]);


                const customerType =
                  String(
                    address?.CustomerType ||
                      address?.customerType ||
                      account?.CustomerType ||
                      account?.customerType ||
                      invoice?.CustomerType ||
                      invoice?.customerType ||
                      ""
                  )
                    .trim()
                    .toUpperCase();


                console.log(
                  "CATEGORY:",
                  {
                    InvoiceId:
                      invoice?.Id,

                    InvoiceNo:
                      invoice?.InvoiceNo,

                    AccountId:
                      accountId,

                    CustomerName:
                      account?.AccountName,

                    CustomerType:
                      customerType,
                  }
                );


                return {

                  ...invoice,

                  accountDetails: {
                    ...(account || {}),

                    CustomerType:
                      customerType,
                  },

                  addressDetails:
                    address,

                  CustomerType:
                    customerType,
                };
              }
            )
          );


        finalInvoices.push(
          ...batchResults
        );
      }


      // ======================================================
      // 4. SORT BY LATEST INVOICE
      // ======================================================

      finalInvoices.sort(
        (a, b) => {

          const dateA =
            moment(
              getDateValue(
                a?.InvoiceDate
              )
            ).valueOf();


          const dateB =
            moment(
              getDateValue(
                b?.InvoiceDate
              )
            ).valueOf();


          return dateB - dateA;
        }
      );


      // ======================================================
      // 5. SET DASHBOARD
      // ======================================================

      setInvoiceList(
        finalInvoices
      );


      console.log(
        "=========================================="
      );

      console.log(
        "FINAL DASHBOARD DATA:",
        finalInvoices
      );

      console.log(
        "=========================================="
      );

    } catch (error) {

      console.error(
        "DASHBOARD LOAD ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

 useEffect(() => {
  const initializeDashboard = async () => {
    try {
      // First load Product Master
      await fetchProductMaster();

      // Then load invoice history dashboard
      await loadDashboard();

    } catch (error) {
      console.error(
        "DASHBOARD INITIALIZATION ERROR:",
        error
      );
    }
  };

  initializeDashboard();
}, []);


 

 // ==========================================================
// CUSTOMER NAME
// ==========================================================
const getCustomerName = (invoice) => {
  const accountName =
    invoice?.accountDetails?.AccountName ||
    invoice?.accountDetails?.accountName ||
    invoice?.AccountName ||
    invoice?.CustomerName ||
    invoice?.customerName;

  if (accountName && String(accountName).trim()) {
    return String(accountName).trim();
  }

  // No customer/account name
  return "-";
};

  // ==========================================================
  // CONTACT
  // ==========================================================

  const getContact = (invoice) => {

    return (
      invoice?.ContactNo ||
      invoice?.Phone ||
      invoice?.Mobile ||
      invoice?.MobileNo ||
      "-"
    );
  };


  // ==========================================================
  // FILTERED DATA
  //
  // SEARCH ONLY:
  // Invoice No
  // Customer Name
  // ==========================================================

  const filteredInvoices = useMemo(() => {

    const search =
      searchText
        .trim()
        .toLowerCase();


    return invoiceList.filter(
      (invoice) => {

        const invoiceNo =
          String(
            getInvoiceNumber(
              invoice
            )
          )
            .toLowerCase();


        const customerName =
          String(
            getCustomerName(
              invoice
            )
          )
            .toLowerCase();


        const invoiceDate =
          formatDateForFilter(
            invoice?.InvoiceDate
          );


        // ==================================================
        // SEARCH
        // ==================================================

        const searchMatch =
          !search ||
          invoiceNo.includes(search) ||
          customerName.includes(search);


        // ==================================================
        // SALE TYPE
        // ==================================================

        const currentSaleType =
          getSaleType(
            invoice
          );


        const typeMatch =
          saleType === "ALL" ||
          currentSaleType === saleType;


        // ==================================================
        // FROM DATE
        // ==================================================

        const fromMatch =
          !fromDate ||
          (
            invoiceDate &&
            invoiceDate >= fromDate
          );


        // ==================================================
        // TO DATE
        // ==================================================

        const toMatch =
          !toDate ||
          (
            invoiceDate &&
            invoiceDate <= toDate
          );


        return (
          searchMatch &&
          typeMatch &&
          fromMatch &&
          toMatch
        );
      }
    );

  }, [
    invoiceList,
    searchText,
    saleType,
    fromDate,
    toDate,
  ]);


  // ==========================================================
  // COUNTS
  // ==========================================================

  const editedCount =
    filteredInvoices.length;


  const regularCount =
    filteredInvoices.filter(
      (invoice) =>
        getSaleType(invoice) ===
        "Regular"
    ).length;


  const dealerCount =
    filteredInvoices.filter(
      (invoice) =>
        getSaleType(invoice) ===
        "Dealer"
    ).length;


  const caterersCount =
    filteredInvoices.filter(
      (invoice) =>
        getSaleType(invoice) ===
        "Caterers"
    ).length;


  const dealerCaterersCount =
    dealerCount +
    caterersCount;


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {

    setSearchText("");

    setSaleType("ALL");

    setFromDate("");

    setToDate("");
  };


  // ==========================================================
  // FETCH CURRENT INVOICE
  // ==========================================================

  const fetchCurrentInvoice = async (
    invoiceId
  ) => {

    const [
      headerResponse,
      detailResponse
    ] = await Promise.all([

      axios.get(
        `${API_BASE}/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${encodeURIComponent(
          invoiceId
        )}`
      ),

      axios.get(
        `${API_BASE}/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${encodeURIComponent(
          invoiceId
        )}`
      ),

    ]);


    const headers =
      toArray(
        headerResponse
      );


    const details =
      toArray(
        detailResponse
      );


    return {

      header:
        headers[0] || null,

      details,

    };
  };


  // ==========================================================
  // OPEN HISTORY
  // ==========================================================

  const openHistory = async (
    invoice
  ) => {

    const invoiceId =
      invoice?.Id ||
      invoice?.InvoiceId;


    if (!invoiceId) {

      console.error(
        "Invoice ID missing:",
        invoice
      );

      return;
    }


    setSelectedInvoice(
      invoice
    );

    setHistoryOpen(
      true
    );

    setHistoryLoading(
      true
    );


    setHistoryHeader([]);

    setHistoryDetails([]);

    setCurrentHeader(
      null
    );

    setCurrentDetails([]);

    setSelectedVersion(
      null
    );

    setSelectedVersionDetails([]);


    try {

      // ======================================================
      // OLD HEADER
      // ======================================================

      const oldHeaderResponse =
        await axios.get(
          `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
            invoiceId
          )}`
        );


      const oldHeaders =
        toArray(
          oldHeaderResponse
        );


      // ======================================================
      // OLD DETAILS
      // ======================================================

      const oldDetailResponse =
        await axios.get(
          `${API_BASE}/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
            invoiceId
          )}`
        );


      const oldDetails =
        toArray(
          oldDetailResponse
        );


      console.log(
        "OLD HEADERS:",
        oldHeaders
      );

      console.log(
        "OLD DETAILS:",
        oldDetails
      );


      setHistoryHeader(
        oldHeaders
      );

      setHistoryDetails(
        oldDetails
      );


      // ======================================================
      // CURRENT INVOICE
      // ======================================================

      const current =
        await fetchCurrentInvoice(
          invoiceId
        );


      setCurrentHeader(
        current.header
      );

      setCurrentDetails(
        current.details
      );


      // ======================================================
      // DEFAULT LATEST VERSION
      // ======================================================

      if (
        oldHeaders.length > 0
      ) {

        const sorted =
          [...oldHeaders].sort(
            (a, b) =>
              Number(
                b?.VersionNo || 0
              ) -
              Number(
                a?.VersionNo || 0
              )
          );


        const latest =
          sorted[0];


        const latestVersion =
          Number(
            latest?.VersionNo || 0
          );


        if (
          latestVersion
        ) {

          setSelectedVersion(
            latestVersion
          );


          const latestDetails =
            oldDetails.filter(
              (detail) =>
                Number(
                  detail?.VersionNo
                ) ===
                latestVersion
            );


          setSelectedVersionDetails(
            latestDetails
          );
        }
      }

    } catch (error) {

      console.error(
        "OPEN HISTORY ERROR:",
        error
      );

    } finally {

      setHistoryLoading(
        false
      );
    }
  };


  // ==========================================================
  // SELECT VERSION
  // ==========================================================

  const selectVersion = (
    historyItem
  ) => {

    const version =
      Number(
        historyItem?.VersionNo || 0
      );


    if (!version) {
      return;
    }


    setSelectedVersion(
      version
    );


    const details =
      historyDetails.filter(
        (detail) =>
          Number(
            detail?.VersionNo
          ) === version
      );


    setSelectedVersionDetails(
      details
    );
  };


  // ==========================================================
  // CLOSE HISTORY
  // ==========================================================

  const closeHistory = () => {

    setHistoryOpen(false);

    setSelectedInvoice(null);

    setHistoryHeader([]);

    setHistoryDetails([]);

    setCurrentHeader(null);

    setCurrentDetails([]);

    setSelectedVersion(null);

    setSelectedVersionDetails([]);
  };


  // ==========================================================
  // PRODUCT NAME
  // ==========================================================

 // ==========================================================
// GET PRODUCT NAME FROM PRODUCT MASTER
// ==========================================================
const getProductName = (detail) => {
  if (!detail) {
    return "-";
  }

  // --------------------------------------------------------
  // 1. If API already gives ProductName, use it
  // --------------------------------------------------------
  const directName =
    detail?.ProductName ||
    detail?.productName ||
    detail?.Product ||
    detail?.product;

  if (
    directName &&
    String(directName).trim() !== ""
  ) {
    return String(directName).trim();
  }

  // --------------------------------------------------------
  // 2. Get ProductId from invoice detail
  // --------------------------------------------------------
  const productId =
    detail?.ProductId ??
    detail?.ProductID ??
    detail?.productId ??
    detail?.Product ??
    detail?.Product_Id;

  if (
    productId === null ||
    productId === undefined ||
    productId === ""
  ) {
    return "-";
  }

  // --------------------------------------------------------
  // 3. Find product in Product Master
  // --------------------------------------------------------
  const product = productOptions.find(
    (option) =>
      String(option?.value) ===
      String(productId)
  );

  // --------------------------------------------------------
  // 4. Return Product Master name
  // --------------------------------------------------------
  if (
    product?.label &&
    String(product.label).trim() !== ""
  ) {
    return String(product.label).trim();
  }

  // --------------------------------------------------------
  // 5. Last fallback
  // --------------------------------------------------------
  return `Product ${productId}`;
};


  // ==========================================================
  // SALE TYPE ICON
  // ==========================================================

  const getSaleTypeIcon = (
    type
  ) => {

    if (type === "Dealer") {
      return (
        <StoreIcon
          sx={{
            fontSize: 18,
          }}
        />
      );
    }


    if (type === "Caterers") {
      return (
        <RestaurantIcon
          sx={{
            fontSize: 18,
          }}
        />
      );
    }


    return (
      <PersonIcon
        sx={{
          fontSize: 18,
        }}
      />
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg,#f3f7f5 0%,#eef3f7 100%)",

        p: {
          xs: 1.5,
          md: 3,
        },
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          background:
            "linear-gradient(135deg,#00695c 0%,#004d40 100%)",

          color: "#fff",

          borderRadius: 4,

          px: {
            xs: 2,
            md: 4,
          },

          py: {
            xs: 2,
            md: 3,
          },

          mb: 3,

          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          boxShadow:
            "0 8px 25px rgba(0,0,0,0.12)",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background:
                "rgba(255,255,255,0.15)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <HistoryIcon
              sx={{
                fontSize: 34,
              }}
            />

          </Box>


          <Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 25,
                  md: 34,
                },

                fontWeight: 800,

                lineHeight: 1.1,
              }}
            >
              Invoice History
            </Typography>


            <Typography
              sx={{
                mt: 0.5,

                fontSize: {
                  xs: 13,
                  md: 17,
                },

                opacity: 0.9,
              }}
            >
              View edited invoices and previous versions
            </Typography>

          </Box>

        </Box>


       <Button
  variant="contained"
  startIcon={<RefreshIcon />}
  onClick={async () => {
    try {
      setLoading(true);

      // First reload Product Master
      await fetchProductMaster();

      // Then reload Invoice History Dashboard
      await loadDashboard();

    } catch (error) {
      console.error(
        "REFRESH DASHBOARD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
  sx={{
    background:
      "rgba(255,255,255,0.16)",

    color: "#fff",

    textTransform:
      "none",

    fontWeight: 700,

    borderRadius: 2,

    px: 2.5,

    "&:hover": {
      background:
        "rgba(255,255,255,0.25)",
    },
  }}
>
  {loading ? "Refreshing..." : "Refresh"}
</Button>

      </Paper>


      {/* =====================================================
          SEARCH & FILTER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,

          p: {
            xs: 2,
            md: 3,
          },

          mb: 3,

          border:
            "1px solid #e5e7eb",
        }}
      >

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1,

            mb: 2,
          }}
        >

          <ReceiptLongIcon
            sx={{
              color: "#00695c",
              fontSize: 28,
            }}
          />

          <Typography
            sx={{
              fontSize: 25,
              fontWeight: 800,
            }}
          >
            Search & Filter
          </Typography>

        </Box>


        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              md:
                "2fr 1fr 1fr 1fr auto",
            },

            gap: 2,

            alignItems: "center",
          }}
        >

          {/* SEARCH */}

          <TextField
            fullWidth
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
            placeholder="Search Invoice / Customer"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <SearchIcon
                    sx={{
                      color: "#777",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* SALE TYPE */}

          <TextField
            select
            fullWidth
            label="Sale Type"
            value={saleType}
            onChange={(e) =>
              setSaleType(
                e.target.value
              )
            }
          >

            <MenuItem value="ALL">
              All Sales
            </MenuItem>

            <MenuItem value="Regular">
              Regular
            </MenuItem>

            <MenuItem value="Dealer">
              Dealer
            </MenuItem>

            <MenuItem value="Caterers">
              Caterers
            </MenuItem>

          </TextField>


          {/* FROM DATE */}

          <TextField
            fullWidth
            type="date"
            label="From Date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />


          {/* TO DATE */}

          <TextField
            fullWidth
            type="date"
            label="To Date"
            value={toDate}
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />


          {/* CLEAR */}

          <Button
            variant="outlined"
            startIcon={
              <FilterAltOffIcon />
            }
            onClick={
              clearFilters
            }
            sx={{
              height: 56,

              whiteSpace:
                "nowrap",

              textTransform:
                "none",

              fontWeight: 700,

              borderRadius: 2,
            }}
          >
            Clear Filters
          </Button>

        </Box>

      </Paper>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            md:
              "repeat(3,1fr)",
          },

          gap: 3,

          mb: 3,
        }}
      >

        {/* EDITED */}

        <SummaryCard
          title="Edited Invoices"
          value={editedCount}
          icon={
            <EditNoteIcon
              sx={{
                fontSize: 50,
              }}
            />
          }
        />


        {/* REGULAR */}

        <SummaryCard
          title="Regular"
          value={regularCount}
          icon={
            <CalendarMonthIcon
              sx={{
                fontSize: 50,
              }}
            />
          }
        />


        {/* DEALER / CATERERS */}

        <SummaryCard
          title="Dealer / Caterers"
          value={
            dealerCaterersCount
          }
          icon={
            <HistoryIcon
              sx={{
                fontSize: 55,
              }}
            />
          }
        />

      </Box>


      {/* =====================================================
          SMALL TYPE SUMMARY
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          mb: 3,
        }}
      >

        <Chip
          icon={
            <PersonIcon />
          }
          label={`Regular: ${regularCount}`}
          variant="outlined"
          sx={{
            fontWeight: 700,
          }}
        />

        <Chip
          icon={
            <StoreIcon />
          }
          label={`Dealer: ${dealerCount}`}
          variant="outlined"
          sx={{
            fontWeight: 700,
          }}
        />

        <Chip
          icon={
            <RestaurantIcon />
          }
          label={`Caterers: ${caterersCount}`}
          variant="outlined"
          sx={{
            fontWeight: 700,
          }}
        />

      </Box>


      {/* =====================================================
          EDITED INVOICE LIST
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,

          overflow: "hidden",

          border:
            "1px solid #e5e7eb",
        }}
      >

        <Box
          sx={{
            px: 3,

            py: 2.5,

            background:
              "linear-gradient(135deg,#f4faf7,#edf7f3)",

            borderBottom:
              "1px solid #ddd",
          }}
        >

          <Typography
            sx={{
              fontSize: 27,

              fontWeight: 800,
            }}
          >
            Edited Invoice List
          </Typography>


          <Typography
            sx={{
              color: "#666",

              mt: 0.5,
            }}
          >
            Only invoices having edit history are shown here.
          </Typography>

        </Box>


        {loading ? (

          <Box
            sx={{
              py: 8,

              display: "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              flexDirection:
                "column",

              gap: 2,
            }}
          >

            <CircularProgress />

            <Typography
              color="text.secondary"
            >
              Loading edited invoices...
            </Typography>

          </Box>

        ) : filteredInvoices.length === 0 ? (

          <Box
            sx={{
              py: 8,

              textAlign: "center",
            }}
          >

            <HistoryIcon
              sx={{
                fontSize: 60,

                color: "#bbb",
              }}
            />


            <Typography
              sx={{
                mt: 1,

                fontSize: 18,

                fontWeight: 600,

                color: "#777",
              }}
            >
              No edited invoices found
            </Typography>


            <Typography
              sx={{
                mt: 0.5,

                color: "#999",
              }}
            >
              Try another invoice number or customer name.
            </Typography>

          </Box>

        ) : (

          <TableContainer>

            <Table>

              <TableHead>

                <TableRow
                  sx={{
                    background:
                      "#edf3f2",
                  }}
                >

                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Invoice No
                  </TableCell>


                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Invoice Date
                  </TableCell>


                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Customer
                  </TableCell>


                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Sale Type
                  </TableCell>


                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Total
                  </TableCell>


                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Status
                  </TableCell>


                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Action
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {filteredInvoices.map(
                  (invoice, index) => {

                    const currentType =
                      getSaleType(
                        invoice
                      );


                    return (

                      <TableRow
                        key={
                          invoice?.Id ||
                          invoice?.InvoiceId ||
                          index
                        }
                        hover
                      >

                        {/* INVOICE NO */}

                        <TableCell>

                          <Typography
                            sx={{
                              fontWeight: 800,

                              fontSize: 17,
                            }}
                          >
                            #
                            {
                              getInvoiceNumber(
                                invoice
                              )
                            }
                          </Typography>

                        </TableCell>


                        {/* DATE */}

                        <TableCell>

                          <Box
                            sx={{
                              display: "flex",

                              alignItems:
                                "center",

                              gap: 1,
                            }}
                          >

                            <CalendarMonthIcon
                              sx={{
                                fontSize: 20,

                                color: "#777",
                              }}
                            />

                            {
                              formatDate(
                                invoice?.InvoiceDate
                              )
                            }

                          </Box>

                        </TableCell>


                        {/* CUSTOMER */}

                        <TableCell>

                          <Typography
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {
                              getCustomerName(
                                invoice
                              )
                            }
                          </Typography>


                          {getContact(
                            invoice
                          ) !== "-" && (

                            <Typography
                              sx={{
                                fontSize: 12,

                                color: "#888",
                              }}
                            >
                              {
                                getContact(
                                  invoice
                                )
                              }
                            </Typography>

                          )}

                        </TableCell>


                        {/* SALE TYPE */}

                        <TableCell>

                          <Chip
                            icon={
                              getSaleTypeIcon(
                                currentType
                              )
                            }
                            label={
                              currentType
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,

                              borderRadius: 2,
                            }}
                          />

                        </TableCell>


                        {/* TOTAL */}

                        <TableCell
                          align="right"
                        >

                          <Typography
                            sx={{
                              fontWeight: 800,

                              fontSize: 17,
                            }}
                          >
                            {
                              money(
                                invoice?.Total
                              )
                            }
                          </Typography>

                        </TableCell>


                        {/* STATUS */}

                        <TableCell>

                          <Chip
                            icon={
                              <EditNoteIcon />
                            }
                            label="EDITED"
                            size="small"
                            sx={{
                              fontWeight: 800,

                              background:
                                "#eeeeee",

                              color:
                                "#555",
                            }}
                          />

                        </TableCell>


                        {/* ACTION */}

                        <TableCell
                          align="center"
                        >

                          <Button
                            variant="contained"
                            startIcon={
                              <VisibilityIcon />
                            }
                            onClick={() =>
                              openHistory(
                                invoice
                              )
                            }
                            sx={{
                              textTransform:
                                "none",

                              fontWeight: 800,

                              borderRadius: 2,

                              background:
                                "#1976d2",

                              "&:hover":
                                {
                                  background:
                                    "#1565c0",
                                },
                            }}
                          >
                            View
                          </Button>

                        </TableCell>

                      </TableRow>

                    );
                  }
                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </Paper>


      {/* =====================================================
          HISTORY DIALOG
      ===================================================== */}

      <Dialog
        open={historyOpen}
        onClose={closeHistory}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            borderRadius: 3,

            maxHeight:
              "94vh",
          },
        }}
      >

        {/* HEADER */}

        <Box
          sx={{
            background:
              "linear-gradient(135deg,#1976d2,#0d47a1)",

            color: "#fff",

            px: 3,

            py: 2,

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",
          }}
        >

          <Box>

            <Typography
              sx={{
                fontSize: 28,

                fontWeight: 800,
              }}
            >
              Invoice Edit History
            </Typography>


            <Typography
              sx={{
                mt: 0.5,

                opacity: 0.9,
              }}
            >
              Invoice No:{" "}
              {
                selectedInvoice
                  ? getInvoiceNumber(
                      selectedInvoice
                    )
                  : "-"
              }
            </Typography>

          </Box>


          <IconButton
            onClick={
              closeHistory
            }
            sx={{
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>

        </Box>


        <DialogContent
          sx={{
            background:
              "#f5f7fa",

            p: {
              xs: 2,
              md: 3,
            },
          }}
        >

          {historyLoading ? (

            <Box
              sx={{
                minHeight: 400,

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
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

                  borderRadius: 3,

                  border:
                    "1px solid #ddd",
                }}
              >

                <Typography
                  sx={{
                    fontSize: 26,

                    fontWeight: 800,

                    color: "#1976d2",

                    mb: 3,
                  }}
                >
                  Current Invoice
                </Typography>


                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs:
                        "repeat(2,1fr)",

                      md:
                        "repeat(6,1fr)",
                    },

                    gap: 3,
                  }}
                >

                  <InfoItem
                    label="Invoice No"
                    value={
                      currentHeader?.InvoiceNo ||
                      currentHeader?.Id ||
                      "-"
                    }
                  />


                  <InfoItem
                    label="Invoice Date"
                    value={
                      formatDate(
                        currentHeader?.InvoiceDate
                      )
                    }
                  />


                  <InfoItem
                    label="Customer"
                    value={
                      getCustomerName(
                        {
                          ...selectedInvoice,
                          ...currentHeader,
                        }
                      )
                    }
                  />


                  <InfoItem
                    label="Total"
                    value={
                      money(
                        currentHeader?.Total
                      )
                    }
                    valueColor="#1976d2"
                  />


                  <InfoItem
                    label="Received"
                    value={
                      money(
                        currentHeader?.ReceivedAmount
                      )
                    }
                  />


                  <InfoItem
                    label="Balance"
                    value={
                      money(
                        Math.max(
                          Number(
                            currentHeader?.Total ||
                            0
                          ) -
                          Number(
                            currentHeader?.ReceivedAmount ||
                            0
                          ),
                          0
                        )
                      )
                    }
                    valueColor="red"
                  />

                </Box>

              </Paper>


              {/* =================================================
                  PREVIOUS HISTORY
              ================================================= */}

              <Paper
                elevation={0}
                sx={{
                  p: 3,

                  mb: 3,

                  borderRadius: 3,

                  border:
                    "1px solid #ddd",
                }}
              >

                <Typography
                  sx={{
                    fontSize: 26,

                    fontWeight: 800,

                    color: "#ed6c02",

                    mb: 2,
                  }}
                >
                  Previous Invoice History
                </Typography>


                {historyHeader.length === 0 ? (

                  <Typography
                    color="text.secondary"
                  >
                    No previous history found.
                  </Typography>

                ) : (

                  <TableContainer>

                    <Table
                      size="small"
                    >

                      <TableHead>

                        <TableRow
                          sx={{
                            background:
                              "#eaf2f8",
                          }}
                        >

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Version
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Invoice No
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Invoice Date
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Customer
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Total
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Received
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            View
                          </TableCell>

                        </TableRow>

                      </TableHead>


                      <TableBody>

                        {[...historyHeader]
                          .sort(
                            (a, b) =>
                              Number(
                                b?.VersionNo ||
                                0
                              ) -
                              Number(
                                a?.VersionNo ||
                                0
                              )
                          )
                          .map(
                            (
                              item,
                              index
                            ) => {

                              const version =
                                Number(
                                  item?.VersionNo ||
                                  0
                                );


                              const selected =
                                selectedVersion ===
                                version;


                              return (

                                <TableRow
                                  key={
                                    item?.Id ||
                                    `${version}-${index}`
                                  }
                                  sx={{
                                    backgroundColor:
                                      selected
                                        ? "#e3f2fd"
                                        : "inherit",
                                  }}
                                >

                                  <TableCell>

                                    <Button
                                      variant={
                                        selected
                                          ? "contained"
                                          : "outlined"
                                      }
                                      size="small"
                                      onClick={() =>
                                        selectVersion(
                                          item
                                        )
                                      }
                                    >
                                      VERSION{" "}
                                      {
                                        version
                                      }
                                    </Button>

                                  </TableCell>


                                  <TableCell>
                                    {
                                      item?.InvoiceNo ||
                                      "-"
                                    }
                                  </TableCell>


                                  <TableCell>
                                    {
                                      formatDate(
                                        item?.InvoiceDate
                                      )
                                    }
                                  </TableCell>


                                  <TableCell>
                                    {
                                      getCustomerName(
                                        {
                                          ...selectedInvoice,
                                          ...item,
                                        }
                                      )
                                    }
                                  </TableCell>


                                  <TableCell>
                                    {
                                      money(
                                        item?.Total
                                      )
                                    }
                                  </TableCell>


                                  <TableCell>
                                    {
                                      money(
                                        item?.ReceivedAmount
                                      )
                                    }
                                  </TableCell>


                                  <TableCell>

                                    <Button
                                      size="small"
                                      onClick={() =>
                                        selectVersion(
                                          item
                                        )
                                      }
                                    >
                                      VIEW
                                    </Button>

                                  </TableCell>

                                </TableRow>

                              );
                            }
                          )}

                      </TableBody>

                    </Table>

                  </TableContainer>

                )}

              </Paper>


              {/* =================================================
                  OLD VS CURRENT
              ================================================= */}

              {selectedVersion && (

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,

                    mb: 3,

                    borderRadius: 3,

                    border:
                      "1px solid #ddd",
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: 26,

                      fontWeight: 800,

                      color: "#7b1fa2",

                      mb: 2,
                    }}
                  >
                    Old vs Current Invoice
                  </Typography>


                  {(() => {

                    const oldHeader =
                      historyHeader.find(
                        (item) =>
                          Number(
                            item?.VersionNo
                          ) ===
                          Number(
                            selectedVersion
                          )
                      );


                    const oldBalance =
                      Math.max(
                        Number(
                          oldHeader?.Total ||
                          0
                        ) -
                        Number(
                          oldHeader?.ReceivedAmount ||
                          0
                        ),
                        0
                      );


                    const currentBalance =
                      Math.max(
                        Number(
                          currentHeader?.Total ||
                          0
                        ) -
                        Number(
                          currentHeader?.ReceivedAmount ||
                          0
                        ),
                        0
                      );


                    return (

                      <TableContainer>

                        <Table>

                          <TableHead>

                            <TableRow
                              sx={{
                                background:
                                  "#f3e5f5",
                              }}
                            >

                              <TableCell
                                sx={{
                                  fontWeight: 800,
                                }}
                              >
                                Field
                              </TableCell>


                              <TableCell
                                sx={{
                                  fontWeight: 800,
                                }}
                              >
                                Version{" "}
                                {
                                  selectedVersion
                                }
                              </TableCell>


                              <TableCell
                                sx={{
                                  fontWeight: 800,
                                }}
                              >
                                Current
                              </TableCell>

                            </TableRow>

                          </TableHead>


                          <TableBody>

                            <CompareRow
                              label="Invoice No"
                              oldValue={
                                oldHeader?.InvoiceNo ||
                                "-"
                              }
                              currentValue={
                                currentHeader?.InvoiceNo ||
                                "-"
                              }
                            />


                            <CompareRow
                              label="Invoice Date"
                              oldValue={
                                formatDate(
                                  oldHeader?.InvoiceDate
                                )
                              }
                              currentValue={
                                formatDate(
                                  currentHeader?.InvoiceDate
                                )
                              }
                            />


                            <CompareRow
                              label="Customer"
                              oldValue={
                                getCustomerName(
                                  {
                                    ...selectedInvoice,
                                    ...oldHeader,
                                  }
                                )
                              }
                              currentValue={
                                getCustomerName(
                                  {
                                    ...selectedInvoice,
                                    ...currentHeader,
                                  }
                                )
                              }
                            />


                            <CompareRow
                              label="Total"
                              oldValue={
                                money(
                                  oldHeader?.Total
                                )
                              }
                              currentValue={
                                money(
                                  currentHeader?.Total
                                )
                              }
                            />


                            <CompareRow
                              label="Received"
                              oldValue={
                                money(
                                  oldHeader?.ReceivedAmount
                                )
                              }
                              currentValue={
                                money(
                                  currentHeader?.ReceivedAmount
                                )
                              }
                            />


                            <CompareRow
                              label="Balance"
                              oldValue={
                                money(
                                  oldBalance
                                )
                              }
                              currentValue={
                                money(
                                  currentBalance
                                )
                              }
                            />

                          </TableBody>

                        </Table>

                      </TableContainer>

                    );

                  })()}

                </Paper>

              )}


              {/* =================================================
                  PREVIOUS PRODUCTS
              ================================================= */}

              {selectedVersion && (

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,

                    mb: 3,

                    borderRadius: 3,

                    border:
                      "1px solid #ddd",
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: 24,

                      fontWeight: 800,

                      color: "#7b1fa2",

                      mb: 2,
                    }}
                  >
                    Previous Product Details —
                    Version{" "}
                    {
                      selectedVersion
                    }
                  </Typography>


                  {selectedVersionDetails.length === 0 ? (

                    <Typography
                      color="text.secondary"
                    >
                      No product details found
                      for this version.
                    </Typography>

                  ) : (

                    <TableContainer>

                      <Table>

                        <TableHead>

                          <TableRow
                            sx={{
                              background:
                                "#f7f1f8",
                            }}
                          >

                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Product
                            </TableCell>


                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Quantity
                            </TableCell>


                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Rate
                            </TableCell>


                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Amount
                            </TableCell>

                          </TableRow>

                        </TableHead>


                        <TableBody>

                          {selectedVersionDetails.map(
                            (
                              detail,
                              index
                            ) => (

                              <TableRow
                                key={
                                  detail?.Id ||
                                  index
                                }
                              >

                                <TableCell>
                                  {
                                    getProductName(
                                      detail
                                    )
                                  }
                                </TableCell>


                                <TableCell>
                                  {
                                    detail?.Quantity ??
                                    detail?.Qty ??
                                    "-"
                                  }
                                </TableCell>


                                <TableCell>
                                  {
                                    money(
                                      detail?.Rate
                                    )
                                  }
                                </TableCell>


                                <TableCell>
                                  {
                                    money(
                                      detail?.Amount
                                    )
                                  }
                                </TableCell>

                              </TableRow>

                            )
                          )}

                        </TableBody>

                      </Table>

                    </TableContainer>

                  )}

                </Paper>

              )}


              {/* =================================================
                  CURRENT PRODUCTS
              ================================================= */}

              <Paper
                elevation={0}
                sx={{
                  p: 3,

                  borderRadius: 3,

                  border:
                    "1px solid #ddd",
                }}
              >

                <Typography
                  sx={{
                    fontSize: 24,

                    fontWeight: 800,

                    color: "#1976d2",

                    mb: 2,
                  }}
                >
                  Current Product Details
                </Typography>


                {currentDetails.length === 0 ? (

                  <Typography
                    color="text.secondary"
                  >
                    No current product details found.
                  </Typography>

                ) : (

                  <TableContainer>

                    <Table>

                      <TableHead>

                        <TableRow
                          sx={{
                            background:
                              "#e3f2fd",
                          }}
                        >

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Product
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Quantity
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Rate
                          </TableCell>


                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Amount
                          </TableCell>

                        </TableRow>

                      </TableHead>


                      <TableBody>

                        {currentDetails.map(
                          (
                            detail,
                            index
                          ) => (

                            <TableRow
                              key={
                                detail?.Id ||
                                index
                              }
                            >

                              <TableCell>
                                {
                                  getProductName(
                                    detail
                                  )
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  detail?.Quantity ??
                                  detail?.Qty ??
                                  "-"
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  money(
                                    detail?.Rate
                                  )
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  money(
                                    detail?.Amount
                                  )
                                }
                              </TableCell>

                            </TableRow>

                          )
                        )}

                      </TableBody>

                    </Table>

                  </TableContainer>

                )}

              </Paper>

            </>

          )}

        </DialogContent>


        {/* CLOSE */}

        <Box
          sx={{
            px: 3,

            py: 1.5,

            borderTop:
              "1px solid #ddd",

            display: "flex",

            justifyContent:
              "flex-end",
          }}
        >

          <Button
            variant="contained"
            onClick={
              closeHistory
            }
            sx={{
              textTransform:
                "none",

              fontWeight: 700,
            }}
          >
            CLOSE
          </Button>

        </Box>

      </Dialog>

    </Box>
  );
};


// ============================================================
// SUMMARY CARD
// ============================================================

const SummaryCard = ({
  title,
  value,
  icon,
}) => {

  return (

    <Paper
      elevation={0}
      sx={{
        p: 3,

        borderRadius: 4,

        border:
          "1px solid #e5e7eb",

        minHeight: 145,

        display: "flex",

        justifyContent:
          "space-between",

        alignItems:
          "flex-start",
      }}
    >

      <Box>

        <Typography
          sx={{
            color: "#666",

            fontSize: 17,
          }}
        >
          {title}
        </Typography>


        <Typography
          sx={{
            fontSize: 42,

            fontWeight: 800,

            mt: 1,
          }}
        >
          {value}
        </Typography>

      </Box>


      <Box
        sx={{
          color: "#aaa",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >
        {icon}
      </Box>

    </Paper>
  );
};


// ============================================================
// INFO ITEM
// ============================================================

const InfoItem = ({
  label,
  value,
  valueColor,
}) => {

  return (

    <Box>

      <Typography
        sx={{
          color: "#666",

          fontSize: 15,

          mb: 0.5,
        }}
      >
        {label}
      </Typography>


      <Typography
        sx={{
          fontSize: 18,

          fontWeight: 800,

          color:
            valueColor ||
            "#222",
        }}
      >
        {value}
      </Typography>

    </Box>
  );
};


// ============================================================
// COMPARE ROW
// ============================================================

const CompareRow = ({
  label,
  oldValue,
  currentValue,
}) => {

  const changed =
    String(
      oldValue ?? ""
    ) !==
    String(
      currentValue ?? ""
    );


  return (

    <TableRow>

      <TableCell
        sx={{
          fontWeight: 700,
        }}
      >
        {label}
      </TableCell>


      <TableCell
        sx={{
          background:
            changed
              ? "#fff3e0"
              : "transparent",

          fontWeight:
            changed
              ? 700
              : 500,
        }}
      >
        {oldValue}
      </TableCell>


      <TableCell
        sx={{
          background:
            changed
              ? "#e8f5e9"
              : "transparent",

          fontWeight:
            changed
              ? 700
              : 500,
        }}
      >
        {currentValue}
      </TableCell>

    </TableRow>
  );
};


export default InvoiceEditHistoryDashboard;