

// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // ============================================================
// // API URLS
// // ============================================================

// const POST_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

// const GET_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

// const UPDATE_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

// const DELETE_TABLE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

// const INVOICE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php";

// // ============================================================
// // DEFAULT BRANCH / USER
// // ============================================================

// const BRANCH_ID = 1;


// // ============================================================
// // COMPONENT
// // ============================================================

// const DenominationEntry = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const [entries, setEntries] = useState([]);

//   // ==========================================================
//   // FORM
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   const [deleteEntry, setDeleteEntry] = useState(null);

//   const [deleting, setDeleting] = useState(false);


//   const [saveCompleted, setSaveCompleted] = useState(false);

//   // ==========================================================
//   // SALES RECONCILIATION
//   // ==========================================================

// const [salesSummary, setSalesSummary] = useState({
//   regularCash: 0,
//   regularOnline: 0,

//   dealerCash: 0,
//   dealerOnline: 0,

//   catererCash: 0,
//   catererOnline: 0,

//   totalCash: 0,
//   totalOnline: 0,
//   totalCollection: 0,
//   salesTotalTillNow: 0,

//   summaryCutoffDateTime: "",
// });

//   const [showReconciliation, setShowReconciliation] = useState(false);

//   const [savedDenominationTotal, setSavedDenominationTotal] = useState(0);

//   const [cashDifference, setCashDifference] = useState(0);

//   const [isCashMatched, setIsCashMatched] = useState(false);

//   // ==========================================================
//   // ENTRY NUMBER
//   // ==========================================================

//   const [entryNo, setEntryNo] = useState("");

//   // ==========================================================
//   // ENTRY DATE
//   // ==========================================================

//   const [entryDate, setEntryDate] = useState(new Date());

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   // ==========================================================
//   // DENOMINATION MASTER
//   // ==========================================================

//   const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

//   // ==========================================================
//   // DENOMINATION ROWS
//   // ==========================================================

//   const [denominationRows, setDenominationRows] = useState([]);

//   // ==========================================================
//   // CREATE EMPTY ROWS
//   // ==========================================================

//   const createEmptyRows = () => {
//     return denominationValues.map((value) => ({
//       denomination: value,
//       quantity: "",
//       amount: 0,
//     }));
//   };

//   // ==========================================================
//   // FORMAT DENOMINATION
//   // ==========================================================

//   const formatDenomination = (value) => {
//     if (value === 0.5) {
//       return "0.50";
//     }

//     return String(value);
//   };

//   // ==========================================================
//   // FORMAT DATE FOR DISPLAY
//   // ==========================================================

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // FORMAT DATE FOR API
//   // ==========================================================

//   const formatApiDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const year = d.getFullYear();

//     const month = String(d.getMonth() + 1).padStart(2, "0");

//     const day = String(d.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   // ==========================================================
//   // CHECK SAME DATE
//   // ==========================================================

//   const isSameDate = (date1, date2) => {
//     if (!date1 || !date2) {
//       return false;
//     }

//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   // ==========================================================
//   // GET INVOICE DATE VALUE
//   // ==========================================================

//   const getInvoiceDateValue = (invoice) => {
//     const value = invoice?.InvoiceDate;

//     if (!value) {
//       return null;
//     }

//     // API sometimes returns:
//     // { date: "2026-09-30 18:30:00" }

//     if (typeof value === "object" && value?.date) {
//       return value.date;
//     }

//     return value;
//   };

//   // ==========================================================
//   // GET INVOICE DATETIME
//   // ==========================================================

//   const getInvoiceDateTime = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return null;
//     }

//     const dateObject = new Date(rawValue);

//     if (!isNaN(dateObject.getTime())) {
//       return dateObject;
//     }

//     return null;
//   };

//   // ==========================================================
//   // GET DATE ONLY FROM INVOICE
//   // ==========================================================

//   const getInvoiceDateOnly = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return "";
//     }

//     const stringValue = String(rawValue);

//     return stringValue.substring(0, 10);
//   };

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================


// const resetForm = () => {
//   setEntryNo("");
//   setEntryDate(new Date());
//   setEditingEntry(null);
//   setSaveCompleted(false);
//   setDenominationRows(createEmptyRows());

//   setSalesSummary({
//     regularCash: 0,
//     regularOnline: 0,
//     dealerCash: 0,
//     dealerOnline: 0,
//     catererCash: 0,
//     catererOnline: 0,
//     totalCash: 0,
//     totalOnline: 0,
//     totalCollection: 0,
//     salesTotalTillNow: 0,
//     summaryCutoffDateTime: "",
//   });

//   setSavedDenominationTotal(0);
//   setShowReconciliation(false);
//   setCashDifference(0);
//   setIsCashMatched(false);
// };


//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//      const createdBy = sessionStorage.getItem("CreatedBy") || "";

// const url =
//   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}` +
//   `&CreatedBy=${encodeURIComponent(createdBy)}`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Entry No API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const data = Array.isArray(result?.data) ? result.data : [];

//       if (data.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const entryNumbers = data
//         .map((item) => Number(item?.EntryNo))
//         .filter((value) => !Number.isNaN(value));

//       if (entryNumbers.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const maxEntryNo = Math.max(...entryNumbers);

//       setEntryNo(String(maxEntryNo + 1));
//     } catch (error) {
//       console.error("GENERATE ENTRY NO ERROR:", error);

//       setEntryNo("1");

//       toast.error("Unable to generate Entry No");
//     }
//   };

//   // ==========================================================
//   // FETCH SALES SUMMARY
//   //
//   // REQUIREMENT:
//   //
//   // Sales Entry
//   // + Sales Dealer
//   // + Sales Caterers
//   //
//   // selected date
//   // +
//   // till current time for today's date
//   //
//   // SUM invoice.Total
//   // ==========================================================

//   const fetchSalesSummary = async (selectedDate) => {
//     try {
//       if (!selectedDate) {
//         return;
//       }

//       const selectedDateString = formatApiDate(selectedDate);

//       const now = new Date();

//       console.log("====================================");

//       console.log("FETCH SALES SUMMARY");

//       console.log("SELECTED DATE:", selectedDateString);

//       console.log("CURRENT TIME:", now);

//       // ======================================================
//       // FETCH FIRST PAGE
//       // ======================================================

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const firstResponse = await fetch(
//         `${INVOICE_API}?Table=invoiceheader&PageNo=1`,
//         requestOptions,
//       );

//       if (!firstResponse.ok) {
//         throw new Error(`Sales API failed: ${firstResponse.status}`);
//       }

//       const firstResult = await firstResponse.json();

//       let allInvoices = [...(firstResult?.data || [])];

//       const totalPages = Number(firstResult?.total_pages || 1);

//       console.log("TOTAL INVOICE PAGES:", totalPages);

//       // ======================================================
//       // FETCH ALL REMAINING PAGES
//       // ======================================================

//       if (totalPages > 1) {
//         for (let page = 2; page <= totalPages; page++) {
//           try {
//             const response = await fetch(
//               `${INVOICE_API}?Table=invoiceheader&PageNo=${page}`,
//               requestOptions,
//             );

//             if (!response.ok) {
//               console.warn("Invoice page failed:", page);

//               continue;
//             }

//             const result = await response.json();

//             allInvoices = [...allInvoices, ...(result?.data || [])];
//           } catch (pageError) {
//             console.error("PAGE FETCH ERROR:", page, pageError);
//           }
//         }
//       }

//       console.log("TOTAL ALL INVOICES:", allInvoices.length);

//       // ======================================================
//       // FILTER SALES
//       //
//       // ALL INVOICEHEADER SALES ARE CONSIDERED:
//       //
//       // Sales Entry
//       // Dealer
//       // Caterers
//       //
//       // If your backend has other invoice types in
//       // invoiceheader, then SaleType filter can be added.
//       // ======================================================

//       const selectedInvoices = allInvoices.filter((invoice) => {
//         const invoiceDateOnly = getInvoiceDateOnly(invoice);

//         if (invoiceDateOnly !== selectedDateString) {
//           return false;
//         }

//         // ==================================================
//         // IF SELECTED DATE IS TODAY
//         // ONLY INCLUDE INVOICES TILL NOW
//         // ==================================================

//         if (isSameDate(selectedDate, now)) {
//           const invoiceDateTime = getInvoiceDateTime(invoice);

//           // If API contains proper time,
//           // compare with current time.
//           if (invoiceDateTime) {
//             return invoiceDateTime.getTime() <= now.getTime();
//           }

//           // If API has only date and no time,
//           // include today's invoice because
//           // backend has not provided invoice time.
//           return true;
//         }

//         // ==================================================
//         // PAST DATE
//         // ALL INVOICES OF THAT DATE
//         // ==================================================

//         return true;
//       });

//       console.log("SELECTED SALES INVOICES:", selectedInvoices);

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       let totalCash = 0;
//       let totalOnline = 0;
//       let salesTotalTillNow = 0;

//       selectedInvoices.forEach((invoice) => {
//         // ====================================================
//         // INVOICE TOTAL
//         // ====================================================

//         const invoiceTotal = Number(invoice?.Total || 0);

//         // ====================================================
//         // PAYMENT MODE
//         //
//         // C = Cash
//         // O = Online
//         // M = Mixed
//         // ====================================================

//         const paymentMode = String(invoice?.PaymentMode || "")
//           .trim()
//           .toUpperCase();

//         // ====================================================
//         // CASH AMOUNT
//         // ====================================================

//         const cashAmount = Number(invoice?.CashAmount || 0);

//         // ====================================================
//         // ONLINE AMOUNT
//         // ====================================================

//         const onlineAmount = Number(invoice?.OnlineAmount || 0);

//         // ====================================================
//         // SALES TOTAL
//         //
//         // Sales Entry
//         // + Dealer
//         // + Caterers
//         // ====================================================

//         salesTotalTillNow += invoiceTotal;

//         // ====================================================
//         // PAYMENT MODE WISE CALCULATION
//         // ====================================================

//         if (paymentMode === "C" || paymentMode === "CASH") {
//           // ----------------------------------------------
//           // CASH SALE
//           // ----------------------------------------------

//           totalCash += invoiceTotal;
//         } else if (paymentMode === "O" || paymentMode === "ONLINE") {
//           // ----------------------------------------------
//           // ONLINE SALE
//           // ----------------------------------------------

//           totalOnline += invoiceTotal;
//         } else if (paymentMode === "M" || paymentMode === "MIXED") {
//           // ----------------------------------------------
//           // MIXED PAYMENT
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         } else {
//           // ----------------------------------------------
//           // FALLBACK
//           //
//           // जर PaymentMode blank/unknown असेल
//           // तर saved CashAmount + OnlineAmount वापरू
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         }
//       });

//       // ======================================================
//       // ROUND VALUES
//       // ======================================================

//       salesTotalTillNow = Number(salesTotalTillNow.toFixed(2));

//       totalCash = Number(totalCash.toFixed(2));

//       totalOnline = Number(totalOnline.toFixed(2));

//       console.log("========== PAYMENT SUMMARY ==========");

//       console.table(
//         selectedInvoices.map((invoice) => ({
//           InvoiceNo: invoice?.InvoiceNo,
//           Total: Number(invoice?.Total || 0),
//           PaymentMode: invoice?.PaymentMode,
//           CashAmount: Number(invoice?.CashAmount || 0),
//           OnlineAmount: Number(invoice?.OnlineAmount || 0),
//         })),
//       );

//       console.log("FINAL SALES TOTAL:", salesTotalTillNow);

//       console.log("FINAL TOTAL CASH:", totalCash);

//       console.log("FINAL TOTAL ONLINE:", totalOnline);

//       console.log("CASH + ONLINE:", totalCash + totalOnline);

//       console.log("======================================");

//       const totalCollection = salesTotalTillNow;




      
//       const cutoffNow = new Date();
//       const pad = (value) => String(value).padStart(2, "0");

//       const summaryCutoffDateTime =
//         `${cutoffNow.getFullYear()}-${pad(cutoffNow.getMonth() + 1)}-${pad(cutoffNow.getDate())} ` +
//         `${pad(cutoffNow.getHours())}:${pad(cutoffNow.getMinutes())}:${pad(cutoffNow.getSeconds())}`;


//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

     
// setSalesSummary({
//   regularCash: 0,
//   regularOnline: 0,
//   dealerCash: 0,
//   dealerOnline: 0,
//   catererCash: 0,
//   catererOnline: 0,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   salesTotalTillNow,
//   summaryCutoffDateTime,
// });


//       console.log("====================================");

//       console.log(
//         "SALES TOTAL TILL NOW:",
//         Number(salesTotalTillNow || 0).toFixed(2),
//       );

//       console.log("TOTAL CASH:", Number(totalCash || 0).toFixed(2));

//       console.log("TOTAL ONLINE:", Number(totalOnline || 0).toFixed(2));

//       console.log("TOTAL COLLECTION:", Number(totalCollection || 0).toFixed(2));

//       console.log(
//         "CASH + ONLINE:",
//         (Number(totalCash || 0) + Number(totalOnline || 0)).toFixed(2),
//       );

//       console.log("SELECTED INVOICE COUNT:", selectedInvoices.length);

//       console.log("====================================");
//     } catch (error) {
//       console.error("FETCH SALES SUMMARY ERROR:", error);

//       toast.error("Unable to fetch Sales Summary");
//     }
//   };

//   // ==========================================================
//   // GET DENOMINATION DATA
//   // ==========================================================

// const fetchDenominationEntries = async () => {

//    const CREATED_BY =
//       sessionStorage.getItem("CreatedBy") || "";
//   try {
//     // ====================================================
//     // GET DENOMINATION ENTRIES
//     // ====================================================

//     const url =
//       `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}&CreatedBy=${CREATED_BY}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(
//         `GET API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     if (!result.success) {
//       throw new Error(
//         result.message ||
//           "Unable to load denomination entries"
//       );
//     }

//     // ====================================================
//     // VALIDATE RESPONSE DATA
//     // ====================================================

//     if (!Array.isArray(result.data)) {
//       setEntries([]);
//       setPageNo(1);
//       return;
//     }

//     // ====================================================
//     // GROUP BY ENTRY NO
//     // ====================================================


  
//     // ====================================================
//     // GROUP BY ENTRY NO
//     // ====================================================

  
// const groupedEntries = {};

// result.data.forEach((item) => {
//   const entryNo = String(item.EntryNo ?? "");
//   const branchId = String(item.BranchId ?? "");
//   const createdBy = String(item.CreatedBy ?? "");

//   const groupKey = `${branchId}_${createdBy}_${entryNo}`;

//   // Create a new entry group if it does not exist
//   if (!groupedEntries[groupKey]) {
//     groupedEntries[groupKey] = {
//       id: item.Id,
//       apiId: item.Id,
//       branchId: item.BranchId,
//       entryNo: item.EntryNo,
//       entryDate: item.EntryDate,
//       entryDateText: formatDate(item.EntryDate),
//       total: 0,
//       denominations: [],
//       active: Number(item.Active || 0),
//       createdBy: item.CreatedBy,
//       updatedBy: item.UpdatedBy,
//       updatedCount: item.UpdatedCount,
//       salesTotalTillNow: Number(item.SalesTotalTillNow || 0),
//       totalCash: Number(item.TotalCash || 0),
//       totalOnline: Number(item.TotalOnline || 0),
//       totalCollection: Number(item.TotalCollection || 0),
//       summaryCutoffDateTime: item.SummaryCutoffDateTime || "",
//     };
//   }

//   // Calculate denomination amount
//   const amount = Number(item.Amount || 0);

//   groupedEntries[groupKey].total += amount;

//   // Store denomination details
//   groupedEntries[groupKey].denominations.push({
//     id: item.Id,
//     notes: Number(item.Notes || 0),
//     numbers: Number(item.Numbers || 0),
//     amount: amount,
//   });
// });

// const formattedEntries = Object.values(groupedEntries);



     

   

//     // ====================================================
//     // SORT LATEST ENTRY FIRST
//     //
//     // 1. Latest Entry Date first
//     // 2. If same date, highest Entry No first
//     // ====================================================

//     formattedEntries.sort((a, b) => {
//       // ----------------------------------------------
//       // ENTRY DATE
//       // ----------------------------------------------

//       const dateA = a?.entryDate
//         ? new Date(
//             a.entryDate
//           ).getTime()
//         : 0;

//       const dateB = b?.entryDate
//         ? new Date(
//             b.entryDate
//           ).getTime()
//         : 0;

//       // ----------------------------------------------
//       // LATEST DATE FIRST
//       // ----------------------------------------------

//       if (dateA !== dateB) {
//         return dateB - dateA;
//       }

//       // ----------------------------------------------
//       // SAME DATE
//       // HIGHEST ENTRY NO FIRST
//       // ----------------------------------------------

//       const entryNoA =
//         Number(a?.entryNo || 0);

//       const entryNoB =
//         Number(b?.entryNo || 0);

//       return entryNoB - entryNoA;
//     });

//     // ====================================================
//     // DEBUG - CHECK SORTING
//     // ====================================================

//     console.log(
//       "======================================"
//     );

//     console.log(
//       "DENOMINATION ENTRIES - LATEST FIRST:",
//       formattedEntries
//     );

//     console.log(
//       "LATEST ENTRY:",
//       formattedEntries[0]
//     );

//     console.log(
//       "======================================"
//     );

//     // ====================================================
//     // SET SORTED ENTRIES
//     // ====================================================

//     setEntries(formattedEntries);

//     // ====================================================
//     // CALCULATE TOTAL PAGES
//     // ====================================================

//     const calculatedPages =
//       formattedEntries.length === 0
//         ? 0
//         : Math.ceil(
//             formattedEntries.length / 10
//           );

//     // ====================================================
//     // PAGE VALIDATION
//     // ====================================================

//     if (calculatedPages === 0) {
//       setPageNo(1);
//     } else if (
//       pageNo > calculatedPages
//     ) {
//       setPageNo(
//         calculatedPages
//       );
//     }

//   } catch (error) {
//     console.error(
//       "GET DENOMINATION ERROR:",
//       error
//     );

//     toast.error(
//       "Unable to load Denomination Entries"
//     );
//   }
// };

//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {
//     setDenominationRows(createEmptyRows());

//     fetchDenominationEntries();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = async () => {
//     resetForm();

//     const today = new Date();

//     setEntryDate(today);

//     setOpenForm(true);

//     // Fetch current sales total
//     await fetchSalesSummary(today);

//     // Generate entry no
//     await generateNextEntryNo();
//   };

//   // ==========================================================
//   // CLOSE FORM
//   // ==========================================================

//   const handleCloseForm = () => {
//     if (saving) {
//       return;
//     }

//     setOpenForm(false);

//     resetForm();
//   };

//   // ==========================================================
//   // EDIT DENOMINATION ENTRY
//   // ==========================================================

//   const handleEditEntry = async (entry) => {
//   try {
//     setSaveCompleted(false);

//     setEditingEntry(entry);

//       setEntryNo(String(entry?.entryNo || ""));

//       const editDate = entry?.entryDate
//         ? new Date(entry.entryDate)
//         : new Date();

//       setEntryDate(editDate);

//       // ------------------------------------------------------
//       // CREATE EMPTY ROWS
//       // ------------------------------------------------------

//       const emptyRows = createEmptyRows();

//       // ------------------------------------------------------
//       // PUT EXISTING DENOMINATION DATA INTO ROWS
//       // ------------------------------------------------------

//       const existingDenominations = Array.isArray(entry?.denominations)
//         ? entry.denominations
//         : [];

//       const editRows = emptyRows.map((row) => {
//         const existing = existingDenominations.find(
//           (item) => Number(item.notes) === Number(row.denomination),
//         );

//         if (existing) {
//           return {
//             ...row,

//             id: existing.id,

//             quantity:
//               Number(existing.numbers || 0) > 0 ? String(existing.numbers) : "",

//             amount: Number(existing.amount || 0),
//           };
//         }

//         return row;
//       });

//       setDenominationRows(editRows);

//       // ------------------------------------------------------
//       // FETCH SALES SUMMARY FOR EDIT DATE
//       // ------------------------------------------------------

    
//       setSalesSummary((previous) => ({
//         ...previous,
//         totalCash: Number(entry.totalCash || 0),
//         totalOnline: Number(entry.totalOnline || 0),
//         totalCollection: Number(entry.totalCollection || 0),
//         salesTotalTillNow: Number(entry.salesTotalTillNow || 0),
//         summaryCutoffDateTime: entry.summaryCutoffDateTime || "",
//       }));

//       setShowReconciliation(false);
//       setCashDifference(0);
//       setIsCashMatched(false);

//       setOpenForm(true);
//     } catch (error) {
//       console.error("EDIT DENOMINATION ERROR:", error);

//       toast.error("Unable to open denomination entry for edit");
//     }
//   };


//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (index, value) => {
//     // Empty
//     if (value === "") {
//       setDenominationRows((previousRows) =>
//         previousRows.map((row, rowIndex) => {
//           if (rowIndex === index) {
//             return {
//               ...row,
//               quantity: "",
//               amount: 0,
//             };
//           }

//           return row;
//         }),
//       );

//       return;
//     }

//     // Only integer
//     if (!/^\d+$/.test(value)) {
//       return;
//     }

//     const quantity = Number(value);

//     setDenominationRows((previousRows) =>
//       previousRows.map((row, rowIndex) => {
//         if (rowIndex === index) {
//           const amount = row.denomination * quantity;

//           return {
//             ...row,
//             quantity: value,
//             amount,
//           };
//         }

//         return row;
//       }),
//     );
//   };

//   // ==========================================================
//   // TOTAL DENOMINATION
//   // ==========================================================

//   const total = useMemo(() => {
//     return denominationRows.reduce(
//       (sum, row) => sum + Number(row.amount || 0),
//       0,
//     );
//   }, [denominationRows]);

//   // ==========================================================
//   // UPDATE DENOMINATION API
//   // ==========================================================

//   const updateDenomination = async ({
//     id,
//     branchId,
//     date,
//     notes,
//     numbers,
//     amount,
//     updatedBy,
//   }) => {
//     const formData = new FormData();

//     formData.append("Id", String(id));

//     formData.append("BranchId", String(branchId || BRANCH_ID));

//     formData.append("EntryDate", formatApiDate(date));

//     formData.append("Notes", String(Number(notes || 0)));

//     formData.append("Numbers", String(Number(numbers || 0)));

//     formData.append("Amount", Number(amount || 0).toFixed(2));

//     formData.append("UpdatedBy", String(updatedBy || ""));

//     const response = await fetch(UPDATE_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Unable to update denomination");
//     }

//     return result;
//   };

//   // ==========================================================
//   // CREATE DENOMINATION API
//   // ==========================================================

  



// const createDenomination = async ({
//   entryNo,
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId,
//   createdBy,
//   userId,
//   saleRole,
//   drawerId,
//   salesTotalTillNow,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   summaryCutoffDateTime,
// }) => {
//   try {
//     // ========================================
//     // 1. PREPARE AND VALIDATE VALUES
//     // ========================================
//     const resolvedBranchId = Number(branchId || BRANCH_ID);
//     const resolvedCreatedBy = Number(createdBy);
//     const notes = Number(denomination);
//     const numbers = Number(quantity);

//     const totalAmount =
//       amount !== undefined && amount !== null && amount !== ""
//         ? Number(amount)
//         : notes * numbers;

//     if (!Number.isFinite(resolvedBranchId) || resolvedBranchId <= 0) {
//       throw new Error("Please provide a valid BranchId.");
//     }

//     if (!Number.isFinite(resolvedCreatedBy) || resolvedCreatedBy <= 0) {
//       throw new Error("Please provide a valid CreatedBy.");
//     }

//     if (!Number.isFinite(notes) || notes <= 0) {
//       throw new Error("Please provide a valid denomination Notes value.");
//     }

//     if (!Number.isFinite(numbers) || numbers <= 0) {
//       throw new Error("Please provide a valid denomination quantity.");
//     }

//     if (!Number.isFinite(totalAmount) || totalAmount < 0) {
//       throw new Error("Please provide a valid denomination Amount.");
//     }

//     if (!entryDate) {
//       throw new Error("Please select Entry Date.");
//     }

//     // ========================================
//     // 2. FORMAT ENTRY DATE
//     // ========================================
//     const formattedEntryDate = formatApiDate(entryDate);

//     if (!formattedEntryDate) {
//       throw new Error("Invalid Entry Date.");
//     }

//     // ========================================
//     // 3. CREATE FORMDATA
//     // ========================================
//     const formData = new FormData();

//     formData.append("BranchId", String(resolvedBranchId));
//     formData.append("EntryDate", String(formattedEntryDate));
//     formData.append("Notes", String(notes));
//     formData.append("Numbers", String(numbers));
//     formData.append("Amount", totalAmount.toFixed(2));
//     formData.append("CreatedBy", String(resolvedCreatedBy));

//     formData.append("UserId", String(userId ?? ""));
//     formData.append("SaleRole", String(saleRole ?? ""));
//     formData.append("DrawerId", String(drawerId ?? ""));
//     formData.append("EntryNo", String(entryNo ?? "").trim());

//     formData.append(
//       "SalesTotalTillNow",
//       String(Number(salesTotalTillNow ?? 0))
//     );

//     formData.append("TotalCash", String(Number(totalCash ?? 0)));
//     formData.append("TotalOnline", String(Number(totalOnline ?? 0)));

//     formData.append(
//       "TotalCollection",
//       String(Number(totalCollection ?? 0))
//     );

//     formData.append(
//       "SummaryCutoffDateTime",
//       String(summaryCutoffDateTime ?? "")
//     );

//     // ========================================
//     // 4. LOG ACTUAL FORMDATA VALUES
//     // ========================================
//     const payloadForLog = {};

//     for (const [key, value] of formData.entries()) {
//       payloadForLog[key] = value;
//     }

//     console.log("========== DENOMINATION API REQUEST ==========");
//     console.log("API URL:", POST_DENOMINATION_API);
//     console.log("FORMDATA PAYLOAD:", payloadForLog);

//     // ========================================
//     // 5. CALL POST API
//     // ========================================
//     const response = await fetch(POST_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     // ========================================
//     // 6. READ API RESPONSE
//     // ========================================
//     const responseText = await response.text();

//     console.log("DENOMINATION HTTP STATUS:", response.status);
//     console.log("DENOMINATION RAW RESPONSE:", responseText);

//     let result;

//     try {
//       result = JSON.parse(responseText);
//     } catch {
//       throw new Error(
//         `The API returned an invalid JSON response. HTTP ${response.status}. ` +
//           `Response: ${responseText.slice(0, 300)}`
//       );
//     }

//     // ========================================
//     // 7. CHECK HTTP AND API SUCCESS
//     // ========================================
//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           `Denomination API failed. HTTP ${response.status}.`
//       );
//     }

//     // Support common API response formats.
//     const apiSuccess =
//       result.success === true ||
//       result.success === 1 ||
//       result.success === "true" ||
//       result.status === "success";

//     if (!apiSuccess) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           "The API did not confirm that the denomination was saved."
//       );
//     }

//     console.log("DENOMINATION SAVED SUCCESSFULLY:", result);

//     return result;
//   } catch (error) {
//     console.error("CREATE DENOMINATION ERROR:", error);
//     throw error;
//   }
// };



//   // ==========================================================
//   // SAVE
//   //
//   // IMPORTANT:
//   // VALIDATION HAPPENS BEFORE POST API
//   // ==========================================================

//   // ==========================================================
//   // SAVE / UPDATE DENOMINATION
//   // ==========================================================



// const handleSave = async () => {
//   if (saving) {
//     return;
//   }

//   if (!entryNo || !entryNo.trim()) {
//     toast.error("Please enter Entry No");
//     return;
//   }

//   if (!entryDate || isNaN(new Date(entryDate).getTime())) {
//     toast.error("Please select a valid Entry Date");
//     return;
//   }

//   const rowsToSave = denominationRows.filter(
//     (row) => Number(row.quantity || 0) > 0
//   );

//   if (rowsToSave.length === 0) {
//     toast.error("Please enter at least one denomination quantity");
//     return;
//   }

//   const loggedInUserId =
//     sessionStorage.getItem("UserId") ||
//     sessionStorage.getItem("LoginUserId") ||
//     "";

//   const loggedInSaleRole =
//     sessionStorage.getItem("UserRole") || "";

//   const currentCreatedBy =
//     sessionStorage.getItem("CreatedBy") || "";

//   const drawerId =
//     sessionStorage.getItem("Device") || "";

//   console.log("========== LOGIN DETAILS ==========");
//   console.log("UserId:", loggedInUserId);
//   console.log("SaleRole:", loggedInSaleRole);
//   console.log("CreatedBy:", currentCreatedBy);
//   console.log("DrawerId:", drawerId);
//   console.log("===================================");

//   if (!loggedInUserId || !loggedInSaleRole || !currentCreatedBy) {
//     toast.error(
//       "Login details are incomplete. Please login again."
//     );
//     return;
//   }

//   try {
//     setSaving(true);

//     const calculatedTotal = rowsToSave.reduce((sum, row) => {
//       const denomination = Number(row.denomination || 0);
//       const quantity = Number(row.quantity || 0);

//       return sum + denomination * quantity;
//     }, 0);

//     const denominationTotal = Number(calculatedTotal.toFixed(2));

//     setSavedDenominationTotal(denominationTotal);

//     const cashTotal = Number(salesSummary?.totalCash || 0);
//     const onlineTotal = Number(salesSummary?.totalOnline || 0);

//     const salesTotalTillNow = Number(
//       salesSummary?.salesTotalTillNow || 0
//     );

//     const totalCollection = Number(
//       salesSummary?.totalCollection || 0
//     );

//     const difference = Number(
//       (denominationTotal - cashTotal).toFixed(2)
//     );

//     const matched = Math.abs(difference) < 0.01;

//     setCashDifference(difference);
//     setIsCashMatched(matched);
//     setShowReconciliation(true);

//     const userDetails = {
//       userId: loggedInUserId,
//       saleRole: loggedInSaleRole,
//       drawerId,
//     };

//     if (editingEntry) {
//       for (const row of denominationRows) {
//         const quantity = Number(row.quantity || 0);
//         const denomination = Number(row.denomination || 0);

//         const amount = Number(
//           (denomination * quantity).toFixed(2)
//         );

//         if (row.id) {
//           if (quantity <= 0) {
//             continue;
//           }

//           await updateDenomination({
//             id: row.id,
//             branchId: BRANCH_ID,
//             date: entryDate,
//             notes: denomination,
//             numbers: quantity,
//             amount,
//             updatedBy: currentCreatedBy,
//             ...userDetails,
//           });
//         } else if (quantity > 0) {

//          await createDenomination({
//   entryNo: entryNo.trim(),
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId: BRANCH_ID,
//   createdBy: currentCreatedBy,
//   ...userDetails,

//   // Save sales summary snapshot
//   salesTotalTillNow: Number(salesSummary?.salesTotalTillNow || 0),
//   totalCash: Number(salesSummary?.totalCash || 0),
//   totalOnline: Number(salesSummary?.totalOnline || 0),
//   totalCollection: Number(salesSummary?.totalCollection || 0),

//   // Save snapshot cutoff date and time
//   summaryCutoffDateTime: salesSummary?.summaryCutoffDateTime || "",
// });
//         }
//       }

//       toast.success("Denomination Entry updated successfully!");
//     } else {
//       for (const row of rowsToSave) {
//         const denomination = Number(row.denomination || 0);
//         const quantity = Number(row.quantity || 0);

//         const amount = Number(
//           (denomination * quantity).toFixed(2)
//         );

//       await createDenomination({
//   entryNo: entryNo.trim(),
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId: BRANCH_ID,
//   createdBy: currentCreatedBy,
//   ...userDetails,

//   // Save sales summary snapshot
//   salesTotalTillNow: Number(salesSummary?.salesTotalTillNow || 0),
//   totalCash: Number(salesSummary?.totalCash || 0),
//   totalOnline: Number(salesSummary?.totalOnline || 0),
//   totalCollection: Number(salesSummary?.totalCollection || 0),

//   // Save snapshot cutoff date and time
//   summaryCutoffDateTime: salesSummary?.summaryCutoffDateTime || "",
// });
//       }

//       toast.success("Denomination Entry saved successfully!");
//     }

//     await fetchDenominationEntries();

//     setSaveCompleted(true);
//     setEditingEntry(null);
//   } catch (error) {
//     console.error("Denomination Save Error:", error);

//     toast.error(
//       error?.message || "Unable to save Denomination Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };


//   // ==========================================================
//   // DELETE
//   // ==========================================================

//   // ==========================================================
//   // OPEN DELETE CONFIRMATION DIALOG
//   // ==========================================================

//   const handleDeleteEntry = (entry) => {
//     if (
//       !entry ||
//       !Array.isArray(entry.denominations) ||
//       entry.denominations.length === 0
//     ) {
//       toast.error("No denomination records found for this entry.");

//       return;
//     }

//     console.log("DELETE ENTRY:", entry);

//     console.log("DENOMINATION RECORDS:", entry.denominations);

//     setDeleteEntry(entry);

//     setDeleteDialogOpen(true);
//   };

//   // ==========================================================
//   // CANCEL DELETE
//   // ==========================================================

//   const handleCancelDelete = () => {
//     if (deleting) {
//       return;
//     }

//     setDeleteDialogOpen(false);

//     setDeleteEntry(null);
//   };

//   // ==========================================================
//   // CONFIRM DELETE - DELETE COMPLETE ENTRY
//   // ==========================================================

//   const handleConfirmDelete = async () => {
//     if (
//       !deleteEntry ||
//       !Array.isArray(deleteEntry.denominations) ||
//       deleteEntry.denominations.length === 0
//     ) {
//       toast.error("No denomination records found.");

//       return;
//     }

//     try {
//       setDeleting(true);

//       // ======================================================
//       // GET ALL DENOMINATION IDS
//       // ======================================================

//       const denominationIds = deleteEntry.denominations
//         .map((item) => item?.id)
//         .filter((id) => id !== null && id !== undefined && id !== "");

//       console.log("====================================");

//       console.log("DELETE ENTRY NO:", deleteEntry.entryNo);

//       console.log("DENOMINATION IDS:", denominationIds);

//       console.log("TOTAL RECORDS TO DELETE:", denominationIds.length);

//       console.log("====================================");

//       if (denominationIds.length === 0) {
//         toast.error("No valid denomination IDs found.");

//         return;
//       }

//       // ======================================================
//       // DELETE ALL DENOMINATION RECORDS
//       // ======================================================

//       for (const id of denominationIds) {
//         const deleteUrl =
//           `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//           `?Table=DailyDenomination&Id=${encodeURIComponent(id)}`;

//         console.log("Deleting ID:", id);

//         console.log("Delete URL:", deleteUrl);

//         const response = await fetch(deleteUrl, {
//           method: "GET",
//           redirect: "follow",
//         });

//         const result = await response.text();

//         console.log("DELETE RESPONSE:", id, result);

//         // ====================================================
//         // CHECK API ERROR
//         // ====================================================

//         if (
//           result.includes("Connection could not be established") ||
//           result.includes("Login failed") ||
//           result.includes("SQLSTATE") ||
//           result.includes('"error"')
//         ) {
//           throw new Error(`Delete failed for denomination ID ${id}`);
//         }

//         if (!response.ok) {
//           throw new Error(`Delete failed for denomination ID ${id}`);
//         }
//       }

//       // ======================================================
//       // SUCCESS
//       // ======================================================

//       toast.success(
//         `Denomination Entry ${deleteEntry.entryNo} deleted successfully!`,
//       );

//       // ======================================================
//       // CLOSE POPUP
//       // ======================================================

//       setDeleteDialogOpen(false);

//       setDeleteEntry(null);

//       // ======================================================
//       // REFRESH TABLE
//       // ======================================================

//       await fetchDenominationEntries();
//     } catch (error) {
//       console.error("DELETE DENOMINATION ENTRY ERROR:", error);

//       toast.error(error?.message || "Unable to delete Denomination Entry");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

 
// const pageSize = 10;

// const totalPages = Math.ceil(entries.length / pageSize);

// const paginatedEntries = entries.slice(
//   (pageNo - 1) * pageSize,
//   pageNo * pageSize
// );


//   // ==========================================================
//   // TABLE COLUMNS
//   // ==========================================================

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "srNo",

//         header: "Sr.No",

//         size: 80,

//         Cell: ({ row }) => {
//           const index = entries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "entryNo",

//         header: "Entry No",

//         size: 150,
//       },

//       {
//         accessorKey: "entryDateText",

//         header: "Entry Date",

//         size: 160,
//       },

//       {
//         accessorKey: "total",

//         header: "Total",

//         size: 150,

//         Cell: ({ cell }) => (
//           <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
//         ),
//       },

//       {
//         header: "Actions",

//         size: 180,

//         enableSorting: false,

//         enableColumnFilter: false,

//         Cell: ({ row }) => (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             gap={1}
//           >
//             {/* ================= EDIT ================= */}
//             <Tooltip title="Edit">
//               <IconButton
//                 color="primary"
//                 size="small"
//                 onClick={() => handleEditEntry(row.original)}
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>

//             {/* ================= DELETE ================= */}
//             <Tooltip title="Delete">
//               <IconButton
//                 color="error"
//                 size="small"
//                 onClick={() => handleDeleteEntry(row.original)}
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         ),
//       },
//     ],
//     [entries, handleEditEntry, handleDeleteEntry],
//   );
//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{
//           width: "100%",
//           minHeight: "100%",
//           p: 5,
//           boxSizing: "border-box",

//           "@media (max-width: 768px)": {
//             p: 2,
//           },
//         }}
//       >
//         {/* ==================================================
//             PAGE TITLE
//         ================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Denomination Entry</b>
//           </Typography>
//         </Box>

//         {/* ==================================================
//             CREATE BUTTON
//         ================================================== */}

//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },

//               borderRadius: "5px 5px 0 0",

//               textTransform: "uppercase",

//               fontSize: "16px",

//               fontWeight: 500,

//               px: 2.5,

//               py: 1.5,
//             }}
//             variant="contained"
//             onClick={handleOpenForm}
//           >
//             CREATE DENOMINATION ENTRY
//           </Button>
//         </Box>

//         {/* ==================================================
//             MAIN TABLE
//         ================================================== */}

//         <MaterialReactTable
//   columns={columns}
//   data={paginatedEntries}
//   enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",

//               color: "black",

//               fontSize: "16px",

//               fontWeight: "bold",
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               fontSize: "15px",
//             },
//           }}
//           muiTablePaperProps={{
//             elevation: 2,

//             sx: {
//               borderRadius: "0 4px 4px 4px",

//               overflow: "hidden",

//               boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//             },
//           }}
//           muiTableContainerProps={{
//             sx: {
//               maxHeight: "none",
//             },
//           }}
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               mb={1}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//               pr={2}
//               gap={0.5}
//             >
//               <FirstPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(1);
//                   }
//                 }}
//               />

//               <KeyboardArrowLeftIcon
//                 sx={{
//                   cursor: pageNo > 1 ? "pointer" : "default",

//                   color: pageNo > 1 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                 }}
//               />

//               <Box ml={1}>Page No</Box>

//               <TextField
//                 sx={{
//                   width: "65px",

//                   ml: 1,

//                   "& .MuiInputBase-input": {
//                     textAlign: "center",

//                     padding: "8px 5px",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);

//                   if (value < 1 || isNaN(value)) {
//                     value = 1;
//                   }

//                   if (totalPages > 0 && value > totalPages) {
//                     value = totalPages;
//                   }

//                   setPageNo(value);
//                 }}
//                 size="small"
//               />

//               <KeyboardArrowRightIcon
//                 sx={{
//                   cursor: pageNo < totalPages ? "pointer" : "default",

//                   color: pageNo < totalPages ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (pageNo < totalPages) {
//                     setPageNo((prev) => Number(prev) + 1);
//                   }
//                 }}
//               />

//               <LastPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(totalPages);
//                   }
//                 }}
//               />

//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
//         />

//         {/* ==================================================
//             DENOMINATION FORM
//         ================================================== */}

//         <Dialog
//           open={openForm}
//           onClose={handleCloseForm}
//           fullWidth
//           maxWidth="md"
//           PaperProps={{
//             sx: {
//               borderRadius: "6px",
//               maxHeight: "90vh",
//             },
//           }}
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <DialogTitle
//             sx={{
//               backgroundColor: "rgb(236, 253, 230)",

//               display: "flex",

//               justifyContent: "space-between",

//               alignItems: "center",

//               borderBottom: "1px solid #ddd",

//               py: 1.2,

//               px: 2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 700,

//                 color: "#0B5E20",

//                 fontSize: "18px",
//               }}
//             >
//               Denomination Entry
//             </Typography>

//             <IconButton
//               onClick={handleCloseForm}
//               disabled={saving}
//               size="small"
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           {/* ==================================================
//               CONTENT
//           ================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#fff",

//               p: {
//                 xs: 1.5,
//                 sm: 2,
//               },
//             }}
//           >
//             {/* =================================================
//                 ENTRY NO + DATE
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "1fr 1fr",
//                 },

//                 gap: 2,

//                 mt: 0.5,

//                 mb: 2,
//               }}
//             >
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry No:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   value={entryNo}
//                   onChange={(e) => setEntryNo(e.target.value)}
//                   placeholder="Enter Entry No"
//                   fullWidth
//                 />
//               </Box>

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry Date:
//                 </Typography>

//               <DatePicker
//   value={entryDate}
//   onChange={(newValue) => {
//     setEntryDate(newValue);

//     if (newValue && !editingEntry) {
//       fetchSalesSummary(newValue);
//     }
//   }}
//   format="dd-MM-yyyy"
//   slotProps={{
//     textField: {
//       size: "small",
//       fullWidth: true,
//     },
//   }}
// />
//               </Box>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 SALES SUMMARY
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Sales Summary:
//             </Typography>

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "repeat(4, 1fr)",
//                 },

//                 gap: 1.5,

//                 mb: 2,
//               }}
//             >
//               {/* SALES TOTAL TILL NOW */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 1.5,

//                   border: "2px solid #0B5E20",

//                   borderRadius: 1,

//                   backgroundColor: "#f1fdf4",
//                 }}
//               >
//                 <Typography fontSize="13px" color="text.secondary">
//                   Sales Total Till Now
//                 </Typography>

//                 <Typography fontSize="18px" fontWeight={700} color="#0B5E20">
//                   ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
//                 </Typography>
//               </Paper>

//               {/* TOTAL CASH */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 1.5,

//                   border: "1px solid #d0d0d0",

//                   borderRadius: 1,
//                 }}
//               >
//                 <Typography fontSize="13px" color="text.secondary">
//                   Total Cash
//                 </Typography>

//                 <Typography fontSize="18px" fontWeight={700}>
//                   ₹ {Number(salesSummary.totalCash || 0).toFixed(2)}
//                 </Typography>
//               </Paper>

//               {/* TOTAL ONLINE */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 1.5,

//                   border: "1px solid #d0d0d0",

//                   borderRadius: 1,
//                 }}
//               >
//                 <Typography fontSize="13px" color="text.secondary">
//                   Total Online
//                 </Typography>

//                 <Typography fontSize="18px" fontWeight={700}>
//                   ₹ {Number(salesSummary.totalOnline || 0).toFixed(2)}
//                 </Typography>
//               </Paper>

//               {/* TOTAL COLLECTION */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 1.5,

//                   border: "1px solid #d0d0d0",

//                   borderRadius: 1,
//                 }}
//               >
//                 <Typography fontSize="13px" color="text.secondary">
//                   Total Collection
//                 </Typography>

//                 <Typography fontSize="18px" fontWeight={700}>
//                   ₹ {Number(salesSummary.totalCollection || 0).toFixed(2)}
//                 </Typography>
//               </Paper>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 DENOMINATION TITLE
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Denominations:
//             </Typography>

//             {/* =================================================
//                 DENOMINATION TABLE
//             ================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 border: "1px solid #d0d0d0",

//                 overflowX: "auto",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   minWidth: 600,

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",

//                     py: 0.8,

//                     px: 1,

//                     fontSize: "13px",
//                   },
//                 }}
//               >
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Notes
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Number / Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {denominationRows.map((row, index) => (
//                     <TableRow hover key={row.denomination}>
//                       <TableCell>
//                         <Typography fontWeight={600}>
//                           ₹ {formatDenomination(row.denomination)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell align="center">
//                         <TextField
//                           type="text"
//                           size="small"
//                           value={row.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(index, e.target.value)
//                           }
//                           placeholder="Enter Number"
//                           inputMode="numeric"
//                           inputProps={{
//                             inputMode: "numeric",
//                             pattern: "[0-9]*",
//                           }}
//                           onWheel={(e) => {
//                             e.currentTarget.blur();
//                           }}
//                           sx={{
//                             width: 150,
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell align="right">
//                         <TextField
//                           size="small"
//                           value={Number(row.amount || 0).toFixed(2)}
//                           InputProps={{
//                             readOnly: true,
//                           }}
//                           sx={{
//                             width: 160,
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 DENOMINATION TOTAL
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "flex",

//                 justifyContent: "flex-end",

//                 alignItems: "center",

//                 gap: 1,

//                 mt: 1.5,
//               }}
//             >
//               <Typography fontWeight={700} fontSize="14px">
//                 Denomination Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(
//                   showReconciliation ? savedDenominationTotal : total,
//                 ).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 160,
//                 }}
//               />
//             </Box>

//             {/* =================================================
//                 RECONCILIATION
//             ================================================= */}

//             {showReconciliation && (
//               <>
//                 <Divider
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                   }}
//                 />

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,

//                     border: "1px solid",

//                     borderColor: isCashMatched ? "success.main" : "error.main",

//                     borderRadius: 1,

//                     backgroundColor: isCashMatched ? "#f1fdf4" : "#fff5f5",
//                   }}
//                 >
//                   {/* =====================================================
//           CASH RECONCILIATION
//           Denomination Total VS Total Cash
//       ====================================================== */}

//                   <Typography
//                     fontWeight={700}
//                     fontSize="16px"
//                     sx={{
//                       mb: 2,
//                     }}
//                   >
//                     Cash Reconciliation
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "grid",

//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         sm: "repeat(3, 1fr)",
//                       },

//                       gap: 1.5,
//                     }}
//                   >
//                     {/* =================================================
//             TOTAL CASH
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Total Cash
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(salesSummary?.totalCash || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DENOMINATION TOTAL
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Denomination Total
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(savedDenominationTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DIFFERENCE
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: isCashMatched
//                           ? "success.light"
//                           : "error.light",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Difference
//                       </Typography>

//                      <Typography
//   fontWeight={700}
//   fontSize="17px"
//   color={isCashMatched ? "success.main" : "error.main"}
// >
//   ₹ {Number(cashDifference || 0).toFixed(2)}
// </Typography>
//                     </Box>
//                   </Box>

//                   {/* =====================================================
//           MATCH STATUS
//       ====================================================== */}

//                   <Typography
//                     sx={{
//                       mt: 2,

//                       fontWeight: 700,

//                       fontSize: "16px",

//                       color: isCashMatched ? "success.main" : "error.main",
//                     }}
//                   >
//                     {isCashMatched
//                       ? "✓ CASH TOTAL MATCHED"
//                       : "✗ CASH TOTAL MISMATCH"}
//                   </Typography>
//                 </Paper>
//               </>
//             )}
//           </DialogContent>

//           {/* ==================================================
//               ACTIONS
//           ================================================== */}

//           <DialogActions
//             sx={{
//               justifyContent: "flex-start",

//               px: 2,

//               py: 1.2,

//               gap: 1,
//             }}
//           >
//             <Button
//   variant="contained"
//   disabled={saving || saveCompleted}
//   onClick={handleSave}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",
//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving
//     ? "Saving..."
//     : saveCompleted
//     ? "Saved"
//     : "Save"}
// </Button>

//           <Button
//   variant="outlined"
//   disabled={saving}
//   onClick={handleCloseForm}
//   sx={{
//     textTransform: "none",
//     color: "var(--complementary-color)",
//     borderColor: "var(--complementary-color)",
//     "&:hover": {
//       borderColor: "var(--complementary-color)",
//     },
//   }}
// >
//   Close
// </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>

//       {/* ==========================================================
//     DELETE CONFIRMATION DIALOG
// ========================================================== */}

//       <Dialog
//         open={deleteDialogOpen}
//         onClose={deleting ? undefined : handleCancelDelete}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             color: "error.main",
//             fontWeight: 700,
//             fontSize: "24px",
//           }}
//         >
//           Delete Denomination Entry
//         </DialogTitle>

//         <DialogContent>
//           <Typography
//             sx={{
//               fontSize: "18px",
//               mb: 1,
//             }}
//           >
//             Are you sure you want to delete this Denomination Entry?
//           </Typography>

//           {deleteEntry && (
//             <Box
//               sx={{
//                 mt: 2,
//                 p: 2,
//                 backgroundColor: "#f5f5f5",
//                 borderRadius: 1,
//               }}
//             >
//               <Typography fontWeight={600}>Entry No:</Typography>

//               <Typography
//                 sx={{
//                   mb: 1,
//                 }}
//               >
//                 {deleteEntry.entryNo}
//               </Typography>

//               <Typography fontWeight={600}>Entry Date:</Typography>

//               <Typography
//                 sx={{
//                   mb: 1,
//                 }}
//               >
//                 {deleteEntry.entryDateText}
//               </Typography>

//               <Typography fontWeight={600}>Total:</Typography>

//               <Typography>
//                 ₹ {Number(deleteEntry.total || 0).toFixed(2)}
//               </Typography>

//               <Typography
//                 sx={{
//                   mt: 1,
//                   color: "error.main",
//                   fontSize: "14px",
//                 }}
//               >
//                 This will delete all denomination records belonging to this
//                 entry.
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions
//           sx={{
//             px: 3,
//             pb: 2,
//           }}
//         >
//           <Button
//             variant="outlined"
//             onClick={handleCancelDelete}
//             disabled={deleting}
//           >
//             CANCEL
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleConfirmDelete}
//             disabled={deleting}
//           >
//             {deleting ? "DELETING..." : "DELETE"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </LocalizationProvider>
//   );
// };

// export default DenominationEntry;














// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";

// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// // ============================================================
// // API URLS
// // ============================================================

// const POST_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

// const GET_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

// const UPDATE_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

// const DELETE_TABLE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

// const INVOICE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php";

// // ============================================================
// // DEFAULT BRANCH / USER
// // ============================================================

// const BRANCH_ID = 1;



// // ============================================================
// // COMPONENT
// // ============================================================

// const DenominationEntry = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================



// const currentCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const isAdmin = currentCreatedBy === 1;

//   const [entries, setEntries] = useState([]);
  

//   // ==========================================================
//   // FORM
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);




//   const [saveCompleted, setSaveCompleted] = useState(false);


//   const [previewOpen, setPreviewOpen] = useState(false);
// const [previewEntry, setPreviewEntry] = useState(null);

// const handlePreviewEntry = (entry) => {
//   setPreviewEntry(entry);
//   setPreviewOpen(true);
// };

// const handleClosePreview = () => {
//   setPreviewOpen(false);
//   setPreviewEntry(null);
// };

//   // ==========================================================
//   // SALES RECONCILIATION
//   // ==========================================================

// const [salesSummary, setSalesSummary] = useState({
//   regularCash: 0,
//   regularOnline: 0,

//   dealerCash: 0,
//   dealerOnline: 0,

//   catererCash: 0,
//   catererOnline: 0,

//   totalCash: 0,
//   totalOnline: 0,
//   totalCollection: 0,
//   salesTotalTillNow: 0,

//   summaryCutoffDateTime: "",
// });

//   const [showReconciliation, setShowReconciliation] = useState(false);

//   const [savedDenominationTotal, setSavedDenominationTotal] = useState(0);

//   const [cashDifference, setCashDifference] = useState(0);

//   const [isCashMatched, setIsCashMatched] = useState(false);

//   // ==========================================================
//   // ENTRY NUMBER
//   // ==========================================================

//   const [entryNo, setEntryNo] = useState("");

//   // ==========================================================
//   // ENTRY DATE
//   // ==========================================================

//   const [entryDate, setEntryDate] = useState(new Date());

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   // ==========================================================
//   // DENOMINATION MASTER
//   // ==========================================================

//   const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

//   // ==========================================================
//   // DENOMINATION ROWS
//   // ==========================================================

//   const [denominationRows, setDenominationRows] = useState([]);

//   // ==========================================================
//   // CREATE EMPTY ROWS
//   // ==========================================================

//   const createEmptyRows = () => {
//     return denominationValues.map((value) => ({
//       denomination: value,
//       quantity: "",
//       amount: 0,
//     }));
//   };

//   // ==========================================================
//   // FORMAT DENOMINATION
//   // ==========================================================

//   const formatDenomination = (value) => {
//     if (value === 0.5) {
//       return "0.50";
//     }

//     return String(value);
//   };

//   // ==========================================================
//   // FORMAT DATE FOR DISPLAY
//   // ==========================================================

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // FORMAT DATE FOR API
//   // ==========================================================

//   const formatApiDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const year = d.getFullYear();

//     const month = String(d.getMonth() + 1).padStart(2, "0");

//     const day = String(d.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   // ==========================================================
//   // CHECK SAME DATE
//   // ==========================================================

//   const isSameDate = (date1, date2) => {
//     if (!date1 || !date2) {
//       return false;
//     }

//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   // ==========================================================
//   // GET INVOICE DATE VALUE
//   // ==========================================================

//   const getInvoiceDateValue = (invoice) => {
//     const value = invoice?.InvoiceDate;

//     if (!value) {
//       return null;
//     }

//     // API sometimes returns:
//     // { date: "2026-09-30 18:30:00" }

//     if (typeof value === "object" && value?.date) {
//       return value.date;
//     }

//     return value;
//   };

//   // ==========================================================
//   // GET INVOICE DATETIME
//   // ==========================================================

//   const getInvoiceDateTime = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return null;
//     }

//     const dateObject = new Date(rawValue);

//     if (!isNaN(dateObject.getTime())) {
//       return dateObject;
//     }

//     return null;
//   };

//   // ==========================================================
//   // GET DATE ONLY FROM INVOICE
//   // ==========================================================

//   const getInvoiceDateOnly = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return "";
//     }

//     const stringValue = String(rawValue);

//     return stringValue.substring(0, 10);
//   };

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================


// const resetForm = () => {
//   setEntryNo("");
//   setEntryDate(new Date());
//   setEditingEntry(null);
//   setSaveCompleted(false);
//   setDenominationRows(createEmptyRows());

//   setSalesSummary({
//     regularCash: 0,
//     regularOnline: 0,
//     dealerCash: 0,
//     dealerOnline: 0,
//     catererCash: 0,
//     catererOnline: 0,
//     totalCash: 0,
//     totalOnline: 0,
//     totalCollection: 0,
//     salesTotalTillNow: 0,
//     summaryCutoffDateTime: "",
//   });

//   setSavedDenominationTotal(0);
//   setShowReconciliation(false);
//   setCashDifference(0);
//   setIsCashMatched(false);
// };


//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//      const createdBy = sessionStorage.getItem("CreatedBy") || "";

// const url =
//   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}` +
//   `&CreatedBy=${encodeURIComponent(createdBy)}`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Entry No API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const data = Array.isArray(result?.data) ? result.data : [];

//       if (data.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const entryNumbers = data
//         .map((item) => Number(item?.EntryNo))
//         .filter((value) => !Number.isNaN(value));

//       if (entryNumbers.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const maxEntryNo = Math.max(...entryNumbers);

//       setEntryNo(String(maxEntryNo + 1));
//     } catch (error) {
//       console.error("GENERATE ENTRY NO ERROR:", error);

//       setEntryNo("1");

//       toast.error("Unable to generate Entry No");
//     }
//   };

//   // ==========================================================
//   // FETCH SALES SUMMARY
//   //
//   // REQUIREMENT:
//   //
//   // Sales Entry
//   // + Sales Dealer
//   // + Sales Caterers
//   //
//   // selected date
//   // +
//   // till current time for today's date
//   //
//   // SUM invoice.Total
//   // ==========================================================

//   const fetchSalesSummary = async (selectedDate) => {
//     try {
//       if (!selectedDate) {
//         return;
//       }

//       const selectedDateString = formatApiDate(selectedDate);

//       const now = new Date();

//       console.log("====================================");

//       console.log("FETCH SALES SUMMARY");

//       console.log("SELECTED DATE:", selectedDateString);

//       console.log("CURRENT TIME:", now);

//       // ======================================================
//       // FETCH FIRST PAGE
//       // ======================================================

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const firstResponse = await fetch(
//         `${INVOICE_API}?Table=invoiceheader&PageNo=1`,
//         requestOptions,
//       );

//       if (!firstResponse.ok) {
//         throw new Error(`Sales API failed: ${firstResponse.status}`);
//       }

//       const firstResult = await firstResponse.json();

//       let allInvoices = [...(firstResult?.data || [])];

//       const totalPages = Number(firstResult?.total_pages || 1);

//       console.log("TOTAL INVOICE PAGES:", totalPages);

//       // ======================================================
//       // FETCH ALL REMAINING PAGES
//       // ======================================================

//       if (totalPages > 1) {
//         for (let page = 2; page <= totalPages; page++) {
//           try {
//             const response = await fetch(
//               `${INVOICE_API}?Table=invoiceheader&PageNo=${page}`,
//               requestOptions,
//             );

//             if (!response.ok) {
//               console.warn("Invoice page failed:", page);

//               continue;
//             }

//             const result = await response.json();

//             allInvoices = [...allInvoices, ...(result?.data || [])];
//           } catch (pageError) {
//             console.error("PAGE FETCH ERROR:", page, pageError);
//           }
//         }
//       }

//       console.log("TOTAL ALL INVOICES:", allInvoices.length);

//       // ======================================================
//       // FILTER SALES
//       //
//       // ALL INVOICEHEADER SALES ARE CONSIDERED:
//       //
//       // Sales Entry
//       // Dealer
//       // Caterers
//       //
//       // If your backend has other invoice types in
//       // invoiceheader, then SaleType filter can be added.
//       // ======================================================

//       const selectedInvoices = allInvoices.filter((invoice) => {
//         const invoiceDateOnly = getInvoiceDateOnly(invoice);

//         if (invoiceDateOnly !== selectedDateString) {
//           return false;
//         }

//         // ==================================================
//         // IF SELECTED DATE IS TODAY
//         // ONLY INCLUDE INVOICES TILL NOW
//         // ==================================================

//         if (isSameDate(selectedDate, now)) {
//           const invoiceDateTime = getInvoiceDateTime(invoice);

//           // If API contains proper time,
//           // compare with current time.
//           if (invoiceDateTime) {
//             return invoiceDateTime.getTime() <= now.getTime();
//           }

//           // If API has only date and no time,
//           // include today's invoice because
//           // backend has not provided invoice time.
//           return true;
//         }

//         // ==================================================
//         // PAST DATE
//         // ALL INVOICES OF THAT DATE
//         // ==================================================

//         return true;
//       });

//       console.log("SELECTED SALES INVOICES:", selectedInvoices);

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       let totalCash = 0;
//       let totalOnline = 0;
//       let salesTotalTillNow = 0;

//       selectedInvoices.forEach((invoice) => {
//         // ====================================================
//         // INVOICE TOTAL
//         // ====================================================

//         const invoiceTotal = Number(invoice?.Total || 0);

//         // ====================================================
//         // PAYMENT MODE
//         //
//         // C = Cash
//         // O = Online
//         // M = Mixed
//         // ====================================================

//         const paymentMode = String(invoice?.PaymentMode || "")
//           .trim()
//           .toUpperCase();

//         // ====================================================
//         // CASH AMOUNT
//         // ====================================================

//         const cashAmount = Number(invoice?.CashAmount || 0);

//         // ====================================================
//         // ONLINE AMOUNT
//         // ====================================================

//         const onlineAmount = Number(invoice?.OnlineAmount || 0);

//         // ====================================================
//         // SALES TOTAL
//         //
//         // Sales Entry
//         // + Dealer
//         // + Caterers
//         // ====================================================

//         salesTotalTillNow += invoiceTotal;

//         // ====================================================
//         // PAYMENT MODE WISE CALCULATION
//         // ====================================================

//         if (paymentMode === "C" || paymentMode === "CASH") {
//           // ----------------------------------------------
//           // CASH SALE
//           // ----------------------------------------------

//           totalCash += invoiceTotal;
//         } else if (paymentMode === "O" || paymentMode === "ONLINE") {
//           // ----------------------------------------------
//           // ONLINE SALE
//           // ----------------------------------------------

//           totalOnline += invoiceTotal;
//         } else if (paymentMode === "M" || paymentMode === "MIXED") {
//           // ----------------------------------------------
//           // MIXED PAYMENT
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         } else {
//           // ----------------------------------------------
//           // FALLBACK
//           //
        
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         }
//       });

//       // ======================================================
//       // ROUND VALUES
//       // ======================================================

//       salesTotalTillNow = Number(salesTotalTillNow.toFixed(2));

//       totalCash = Number(totalCash.toFixed(2));

//       totalOnline = Number(totalOnline.toFixed(2));

//       console.log("========== PAYMENT SUMMARY ==========");

//       console.table(
//         selectedInvoices.map((invoice) => ({
//           InvoiceNo: invoice?.InvoiceNo,
//           Total: Number(invoice?.Total || 0),
//           PaymentMode: invoice?.PaymentMode,
//           CashAmount: Number(invoice?.CashAmount || 0),
//           OnlineAmount: Number(invoice?.OnlineAmount || 0),
//         })),
//       );

//       console.log("FINAL SALES TOTAL:", salesTotalTillNow);

//       console.log("FINAL TOTAL CASH:", totalCash);

//       console.log("FINAL TOTAL ONLINE:", totalOnline);

//       console.log("CASH + ONLINE:", totalCash + totalOnline);

//       console.log("======================================");

//       const totalCollection = salesTotalTillNow;




      
//       const cutoffNow = new Date();
//       const pad = (value) => String(value).padStart(2, "0");

//       const summaryCutoffDateTime =
//         `${cutoffNow.getFullYear()}-${pad(cutoffNow.getMonth() + 1)}-${pad(cutoffNow.getDate())} ` +
//         `${pad(cutoffNow.getHours())}:${pad(cutoffNow.getMinutes())}:${pad(cutoffNow.getSeconds())}`;


//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

     
// setSalesSummary({
//   regularCash: 0,
//   regularOnline: 0,
//   dealerCash: 0,
//   dealerOnline: 0,
//   catererCash: 0,
//   catererOnline: 0,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   salesTotalTillNow,
//   summaryCutoffDateTime,
// });


//       console.log("====================================");

//       console.log(
//         "SALES TOTAL TILL NOW:",
//         Number(salesTotalTillNow || 0).toFixed(2),
//       );

//       console.log("TOTAL CASH:", Number(totalCash || 0).toFixed(2));

//       console.log("TOTAL ONLINE:", Number(totalOnline || 0).toFixed(2));

//       console.log("TOTAL COLLECTION:", Number(totalCollection || 0).toFixed(2));

//       console.log(
//         "CASH + ONLINE:",
//         (Number(totalCash || 0) + Number(totalOnline || 0)).toFixed(2),
//       );

//       console.log("SELECTED INVOICE COUNT:", selectedInvoices.length);

//       console.log("====================================");
//     } catch (error) {
//       console.error("FETCH SALES SUMMARY ERROR:", error);

//       toast.error("Unable to fetch Sales Summary");
//     }
//   };

//   // ==========================================================
//   // GET DENOMINATION DATA
//   // ==========================================================

// const fetchDenominationEntries = async () => {
//   try {
//     const currentCreatedBy = Number(
//       sessionStorage.getItem("CreatedBy") || 0
//     );

//     const isAdmin = currentCreatedBy === 1;

//     const params = new URLSearchParams({
//       Id: "",
//       BranchId: String(BRANCH_ID),
//     });

//     if (!isAdmin) {
//       params.set("CreatedBy", String(currentCreatedBy));
//     }

//     const url = `${GET_DENOMINATION_API}?${params.toString()}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(
//         `GET API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     if (!result.success) {
//       throw new Error(
//         result.message || "Unable to load denomination entries"
//       );
//     }

//     if (!Array.isArray(result.data)) {
//       setEntries([]);
//       setPageNo(1);
//       return;
//     }

//     const groupedEntries = {};

//     result.data.forEach((item) => {
//       const entryNo = String(item.EntryNo ?? "");
//       const branchId = String(item.BranchId ?? "");
//       const createdBy = String(item.CreatedBy ?? "");

//       const groupKey = `${branchId}_${createdBy}_${entryNo}`;

//       if (!groupedEntries[groupKey]) {
//         groupedEntries[groupKey] = {
//           id: item.Id,
//           apiId: item.Id,
//           branchId: item.BranchId,
//           entryNo: item.EntryNo,
//           entryDate: item.EntryDate,
//           entryDateText: formatDate(item.EntryDate),
//           total: 0,
//           denominations: [],
//           active: Number(item.Active || 0),
//           createdBy: item.CreatedBy,
//           updatedBy: item.UpdatedBy,
//           updatedCount: item.UpdatedCount,
//           salesTotalTillNow: Number(item.SalesTotalTillNow || 0),
//           totalCash: Number(item.TotalCash || 0),
//           totalOnline: Number(item.TotalOnline || 0),
//           totalCollection: Number(item.TotalCollection || 0),
//           summaryCutoffDateTime:
//             item.SummaryCutoffDateTime || "",
//         };
//       }

//       const amount = Number(item.Amount || 0);

//       groupedEntries[groupKey].total += amount;

//       groupedEntries[groupKey].denominations.push({
//         id: item.Id,
//         notes: Number(item.Notes || 0),
//         numbers: Number(item.Numbers || 0),
//         amount,
//       });
//     });

//     const formattedEntries = Object.values(groupedEntries);

//     formattedEntries.sort((a, b) => {
//       const dateA = a.entryDate
//         ? new Date(a.entryDate).getTime()
//         : 0;

//       const dateB = b.entryDate
//         ? new Date(b.entryDate).getTime()
//         : 0;

//       if (dateA !== dateB) {
//         return dateB - dateA;
//       }

//       return Number(b.entryNo || 0) - Number(a.entryNo || 0);
//     });

//     console.log(
//       "DENOMINATION ENTRIES - LATEST FIRST:",
//       formattedEntries
//     );

//     setEntries(formattedEntries);

//     const calculatedPages = Math.ceil(
//       formattedEntries.length / 10
//     );

//     if (calculatedPages === 0) {
//       setPageNo(1);
//     } else {
//       setPageNo((previousPage) =>
//         previousPage > calculatedPages
//           ? calculatedPages
//           : previousPage
//       );
//     }
//   } catch (error) {
//     console.error("GET DENOMINATION ERROR:", error);

//     toast.error("Unable to load Denomination Entries");
//   }
// };

//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {
//     setDenominationRows(createEmptyRows());

//     fetchDenominationEntries();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = async () => {
//     resetForm();

//     const today = new Date();

//     setEntryDate(today);

//     setOpenForm(true);

//     // Fetch current sales total
//     await fetchSalesSummary(today);

//     // Generate entry no
//     await generateNextEntryNo();
//   };

//   // ==========================================================
//   // CLOSE FORM
//   // ==========================================================

//   const handleCloseForm = () => {
//     if (saving) {
//       return;
//     }

//     setOpenForm(false);

//     resetForm();
//   };

//   // ==========================================================
//   // EDIT DENOMINATION ENTRY
//   // ==========================================================

 
// const handleEditEntry = async (entry) => {
//   try {
//     if (!entry) {
//       toast.error("Denomination entry not found");
//       return;
//     }

//     setSaveCompleted(false);
//     setEditingEntry(entry);

//     // ==========================================
//     // 1. SET ENTRY NUMBER AND DATE
//     // ==========================================
//     setEntryNo(String(entry.entryNo ?? ""));

//     const editDate = entry.entryDate
//       ? new Date(entry.entryDate)
//       : new Date();

//     setEntryDate(
//       Number.isNaN(editDate.getTime()) ? new Date() : editDate
//     );

//     // ==========================================
//     // 2. CREATE EMPTY DENOMINATION ROWS
//     // ==========================================
//     const emptyRows = createEmptyRows();

//     // ==========================================
//     // 3. LOAD SAVED DENOMINATION DETAILS
//     // ==========================================
//     const existingDenominations = Array.isArray(entry.denominations)
//       ? entry.denominations
//       : [];

//     const editRows = emptyRows.map((row) => {
//       const existing = existingDenominations.find(
//         (item) =>
//           Number(item.notes) === Number(row.denomination)
//       );

//       if (!existing) {
//         return {
//           ...row,
//           quantity: "",
//           amount: 0,
//         };
//       }

//       const quantity = Number(existing.numbers ?? 0);

//       return {
//         ...row,
//         id: existing.id ?? existing.Id ?? null,
//         quantity: quantity > 0 ? String(quantity) : "",
//         amount: Number(existing.amount ?? 0),
//       };
//     });

//     setDenominationRows(editRows);

//     // ==========================================
//     // 4. RESTORE THE SAVED SALES SUMMARY
//     // DO NOT FETCH CURRENT SALES DATA HERE
//     // ==========================================
//     setSalesSummary((previous) => ({
//       ...previous,
//       totalCash: Number(entry.totalCash ?? 0),
//       totalOnline: Number(entry.totalOnline ?? 0),
//       totalCollection: Number(entry.totalCollection ?? 0),
//       salesTotalTillNow: Number(entry.salesTotalTillNow ?? 0),
//       summaryCutoffDateTime: entry.summaryCutoffDateTime ?? "",
//     }));

//     // ==========================================
//     // 5. RESET RECONCILIATION STATE
//     // ==========================================
//     setShowReconciliation(false);
//     setCashDifference(0);
//     setIsCashMatched(false);

//     // ==========================================
//     // 6. OPEN EDIT FORM
//     // ==========================================
//     setOpenForm(true);
//   } catch (error) {
//     console.error("EDIT DENOMINATION ERROR:", error);
//     toast.error("Unable to open denomination entry for edit");
//   }
// };



//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (index, value) => {
//     // Empty
//     if (value === "") {
//       setDenominationRows((previousRows) =>
//         previousRows.map((row, rowIndex) => {
//           if (rowIndex === index) {
//             return {
//               ...row,
//               quantity: "",
//               amount: 0,
//             };
//           }

//           return row;
//         }),
//       );

//       return;
//     }

//     // Only integer
//     if (!/^\d+$/.test(value)) {
//       return;
//     }

//     const quantity = Number(value);

//     setDenominationRows((previousRows) =>
//       previousRows.map((row, rowIndex) => {
//         if (rowIndex === index) {
//           const amount = row.denomination * quantity;

//           return {
//             ...row,
//             quantity: value,
//             amount,
//           };
//         }

//         return row;
//       }),
//     );
//   };

//   // ==========================================================
//   // TOTAL DENOMINATION
//   // ==========================================================

//   const total = useMemo(() => {
//     return denominationRows.reduce(
//       (sum, row) => sum + Number(row.amount || 0),
//       0,
//     );
//   }, [denominationRows]);

//   // ==========================================================
//   // UPDATE DENOMINATION API
//   // ==========================================================

//   const updateDenomination = async ({
//     id,
//     branchId,
//     date,
//     notes,
//     numbers,
//     amount,
//     updatedBy,
//   }) => {
//     const formData = new FormData();

//     formData.append("Id", String(id));

//     formData.append("BranchId", String(branchId || BRANCH_ID));

//     formData.append("EntryDate", formatApiDate(date));

//     formData.append("Notes", String(Number(notes || 0)));

//     formData.append("Numbers", String(Number(numbers || 0)));

//     formData.append("Amount", Number(amount || 0).toFixed(2));

//     formData.append("UpdatedBy", String(updatedBy || ""));

//     const response = await fetch(UPDATE_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Unable to update denomination");
//     }

//     return result;
//   };

//   // ==========================================================
//   // CREATE DENOMINATION API
//   // ==========================================================

  



// const createDenomination = async ({
//   entryNo,
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId,
//   createdBy,
//   userId,
//   saleRole,
//   drawerId,
//   salesTotalTillNow,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   summaryCutoffDateTime,
// }) => {
//   try {
//     // ========================================
//     // 1. PREPARE AND VALIDATE VALUES
//     // ========================================
//     const resolvedBranchId = Number(branchId || BRANCH_ID);
//     const resolvedCreatedBy = Number(createdBy);
//     const notes = Number(denomination);
//     const numbers = Number(quantity);

//     const totalAmount =
//       amount !== undefined && amount !== null && amount !== ""
//         ? Number(amount)
//         : notes * numbers;

//     if (!Number.isFinite(resolvedBranchId) || resolvedBranchId <= 0) {
//       throw new Error("Please provide a valid BranchId.");
//     }

//     if (!Number.isFinite(resolvedCreatedBy) || resolvedCreatedBy <= 0) {
//       throw new Error("Please provide a valid CreatedBy.");
//     }

//     if (!Number.isFinite(notes) || notes <= 0) {
//       throw new Error("Please provide a valid denomination Notes value.");
//     }

//     if (!Number.isFinite(numbers) || numbers <= 0) {
//       throw new Error("Please provide a valid denomination quantity.");
//     }

//     if (!Number.isFinite(totalAmount) || totalAmount < 0) {
//       throw new Error("Please provide a valid denomination Amount.");
//     }

//     if (!entryDate) {
//       throw new Error("Please select Entry Date.");
//     }

//     // ========================================
//     // 2. FORMAT ENTRY DATE
//     // ========================================
//     const formattedEntryDate = formatApiDate(entryDate);

//     if (!formattedEntryDate) {
//       throw new Error("Invalid Entry Date.");
//     }

//     // ========================================
//     // 3. CREATE FORMDATA
//     // ========================================
//     const formData = new FormData();

//     formData.append("BranchId", String(resolvedBranchId));
//     formData.append("EntryDate", String(formattedEntryDate));
//     formData.append("Notes", String(notes));
//     formData.append("Numbers", String(numbers));
//     formData.append("Amount", totalAmount.toFixed(2));
//     formData.append("CreatedBy", String(resolvedCreatedBy));

//     formData.append("UserId", String(userId ?? ""));
//     formData.append("SaleRole", String(saleRole ?? ""));
//     formData.append("DrawerId", String(drawerId ?? ""));
//     formData.append("EntryNo", String(entryNo ?? "").trim());

//     formData.append(
//       "SalesTotalTillNow",
//       String(Number(salesTotalTillNow ?? 0))
//     );

//     formData.append("TotalCash", String(Number(totalCash ?? 0)));
//     formData.append("TotalOnline", String(Number(totalOnline ?? 0)));

//     formData.append(
//       "TotalCollection",
//       String(Number(totalCollection ?? 0))
//     );

//     formData.append(
//       "SummaryCutoffDateTime",
//       String(summaryCutoffDateTime ?? "")
//     );

//     // ========================================
//     // 4. LOG ACTUAL FORMDATA VALUES
//     // ========================================
//     const payloadForLog = {};

//     for (const [key, value] of formData.entries()) {
//       payloadForLog[key] = value;
//     }

//     console.log("========== DENOMINATION API REQUEST ==========");
//     console.log("API URL:", POST_DENOMINATION_API);
//     console.log("FORMDATA PAYLOAD:", payloadForLog);

//     // ========================================
//     // 5. CALL POST API
//     // ========================================
//     const response = await fetch(POST_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     // ========================================
//     // 6. READ API RESPONSE
//     // ========================================
//     const responseText = await response.text();

//     console.log("DENOMINATION HTTP STATUS:", response.status);
//     console.log("DENOMINATION RAW RESPONSE:", responseText);

//     let result;

//     try {
//       result = JSON.parse(responseText);
//     } catch {
//       throw new Error(
//         `The API returned an invalid JSON response. HTTP ${response.status}. ` +
//           `Response: ${responseText.slice(0, 300)}`
//       );
//     }

//     // ========================================
//     // 7. CHECK HTTP AND API SUCCESS
//     // ========================================
//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           `Denomination API failed. HTTP ${response.status}.`
//       );
//     }

//     // Support common API response formats.
//     const apiSuccess =
//       result.success === true ||
//       result.success === 1 ||
//       result.success === "true" ||
//       result.status === "success";

//     if (!apiSuccess) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           "The API did not confirm that the denomination was saved."
//       );
//     }

//     console.log("DENOMINATION SAVED SUCCESSFULLY:", result);

//     return result;
//   } catch (error) {
//     console.error("CREATE DENOMINATION ERROR:", error);
//     throw error;
//   }
// };



//   // ==========================================================
//   // SAVE
//   //
//   // IMPORTANT:
//   // VALIDATION HAPPENS BEFORE POST API
//   // ==========================================================

//   // ==========================================================
//   // SAVE / UPDATE DENOMINATION
//   // ==========================================================




// const handleSave = async () => {
//   if (saving) {
//     return;
//   }

//   if (!entryNo || !entryNo.trim()) {
//     toast.error("Please enter Entry No");
//     return;
//   }

//   if (!entryDate || isNaN(new Date(entryDate).getTime())) {
//     toast.error("Please select a valid Entry Date");
//     return;
//   }

//   const rowsToSave = denominationRows.filter(
//     (row) => Number(row.quantity || 0) > 0
//   );

//   if (rowsToSave.length === 0) {
//     toast.error("Please enter at least one denomination quantity");
//     return;
//   }

//   const loggedInUserId =
//     sessionStorage.getItem("UserId") ||
//     sessionStorage.getItem("LoginUserId") ||
//     "";

//   const loggedInSaleRole =
//     sessionStorage.getItem("UserRole") || "";

//   const currentCreatedBy =
//     sessionStorage.getItem("CreatedBy") || "";

//   const drawerId =
//     sessionStorage.getItem("Device") || "";

//   if (
//     !loggedInUserId ||
//     !loggedInSaleRole ||
//     !currentCreatedBy
//   ) {
//     toast.error(
//       "Login details are incomplete. Please login again."
//     );
//     return;
//   }

//   try {
//     setSaving(true);

//     const userDetails = {
//       userId: loggedInUserId,
//       saleRole: loggedInSaleRole,
//       drawerId,
//     };

//     const denominationTotal = Number(
//       rowsToSave
//         .reduce((sum, row) => {
//           const denomination = Number(row.denomination || 0);
//           const quantity = Number(row.quantity || 0);

//           return sum + denomination * quantity;
//         }, 0)
//         .toFixed(2)
//     );

//     const salesTotalTillNow = Number(
//       salesSummary?.salesTotalTillNow || 0
//     );

//     const cashTotal = Number(
//       salesSummary?.totalCash || 0
//     );

//     const onlineTotal = Number(
//       salesSummary?.totalOnline || 0
//     );

//     const totalCollection = Number(
//       salesSummary?.totalCollection || 0
//     );

//     const summaryCutoffDateTime =
//       salesSummary?.summaryCutoffDateTime || "";

//     const difference = Number(
//       (denominationTotal - cashTotal).toFixed(2)
//     );

//     const matched = Math.abs(difference) < 0.01;

//     setSavedDenominationTotal(denominationTotal);
//     setCashDifference(difference);
//     setIsCashMatched(matched);
//     setShowReconciliation(true);

//     const snapshotData = {
//       salesTotalTillNow,
//       totalCash: cashTotal,
//       totalOnline: onlineTotal,
//       totalCollection,
//       summaryCutoffDateTime,
//     };

//     const createEntry = async (row) => {
//       const denomination = Number(row.denomination || 0);
//       const quantity = Number(row.quantity || 0);

//       const amount = Number(
//         (denomination * quantity).toFixed(2)
//       );

//       await createDenomination({
//         entryNo: entryNo.trim(),
//         entryDate,
//         denomination,
//         quantity,
//         amount,
//         branchId: BRANCH_ID,
//         createdBy: currentCreatedBy,
//         ...userDetails,
//         ...snapshotData,
//       });
//     };

//     if (editingEntry) {
//       for (const row of denominationRows) {
//         const denomination = Number(row.denomination || 0);
//         const quantity = Number(row.quantity || 0);

//         const amount = Number(
//           (denomination * quantity).toFixed(2)
//         );

//         if (row.id) {
//           if (quantity <= 0) {
//             continue;
//           }

//           await updateDenomination({
//             id: row.id,
//             branchId: BRANCH_ID,
//             date: entryDate,
//             notes: denomination,
//             numbers: quantity,
//             amount,
//             updatedBy: currentCreatedBy,
//             ...userDetails,
//           });
//         } else if (quantity > 0) {
//           await createEntry(row);
//         }
//       }

//       toast.success(
//         "Denomination Entry updated successfully!"
//       );
//     } else {
//       for (const row of rowsToSave) {
//         await createEntry(row);
//       }

//       toast.success(
//         "Denomination Entry saved successfully!"
//       );
//     }

//     await fetchDenominationEntries();

//     setSaveCompleted(true);
//     setEditingEntry(null);
//   } catch (error) {
//     console.error("Denomination Save Error:", error);

//     toast.error(
//       error?.message || "Unable to save Denomination Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };





//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

 
// const pageSize = 10;

// const totalPages = Math.ceil(entries.length / pageSize);

// const paginatedEntries = entries.slice(
//   (pageNo - 1) * pageSize,
//   pageNo * pageSize
// );


//   // ==========================================================
//   // TABLE COLUMNS
//   // ==========================================================

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "srNo",

//         header: "Sr.No",

//         size: 80,

//         Cell: ({ row }) => {
//           const index = entries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "entryNo",

//         header: "Entry No",

//         size: 150,
//       },

//       {
//         accessorKey: "entryDateText",

//         header: "Entry Date",

//         size: 160,
//       },

//       {
//         accessorKey: "total",

//         header: "Total",

//         size: 150,

//         Cell: ({ cell }) => (
//           <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
//         ),
//       },

//       {
//         header: "Actions",

//         size: 180,

//         enableSorting: false,

//         enableColumnFilter: false,

//       Cell: ({ row }) => (
//   <Box
//     display="flex"
//     justifyContent="center"
//     alignItems="center"
//     gap={1}
//   >
//     {/* ================= PREVIEW ================= */}
//     <Tooltip title="Preview">
//       <IconButton
//         color="info"
//         size="small"
//         onClick={() => handlePreviewEntry(row.original)}
//       >
//         <VisibilityIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>

//     {/* ================= EDIT ================= */}
//     <Tooltip title="Edit">
//       <IconButton
//         color="primary"
//         size="small"
//         onClick={() => handleEditEntry(row.original)}
//       >
//         <EditIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>
//   </Box>
// ),
//       },
//     ],
//     [entries, handleEditEntry, handlePreviewEntry]
//   );
//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{
//           width: "100%",
//           minHeight: "100%",
//           p: 5,
//           boxSizing: "border-box",

//           "@media (max-width: 768px)": {
//             p: 2,
//           },
//         }}
//       >
//         {/* ==================================================
//             PAGE TITLE
//         ================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Denomination Entry</b>
//           </Typography>
//         </Box>

//         {/* ==================================================
//             CREATE BUTTON
//         ================================================== */}

//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },

//               borderRadius: "5px 5px 0 0",

//               textTransform: "uppercase",

//               fontSize: "16px",

//               fontWeight: 500,

//               px: 2.5,

//               py: 1.5,
//             }}
//             variant="contained"
//             onClick={handleOpenForm}
//           >
//             CREATE DENOMINATION ENTRY
//           </Button>
//         </Box>

//         {/* ==================================================
//             MAIN TABLE
//         ================================================== */}

//         <MaterialReactTable
//   columns={columns}
//   data={paginatedEntries}
//   enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",

//               color: "black",

//               fontSize: "16px",

//               fontWeight: "bold",
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               fontSize: "15px",
//             },
//           }}
//           muiTablePaperProps={{
//             elevation: 2,

//             sx: {
//               borderRadius: "0 4px 4px 4px",

//               overflow: "hidden",

//               boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//             },
//           }}
//           muiTableContainerProps={{
//             sx: {
//               maxHeight: "none",
//             },
//           }}
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               mb={1}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//               pr={2}
//               gap={0.5}
//             >
//               <FirstPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(1);
//                   }
//                 }}
//               />

//               <KeyboardArrowLeftIcon
//                 sx={{
//                   cursor: pageNo > 1 ? "pointer" : "default",

//                   color: pageNo > 1 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                 }}
//               />

//               <Box ml={1}>Page No</Box>

//               <TextField
//                 sx={{
//                   width: "65px",

//                   ml: 1,

//                   "& .MuiInputBase-input": {
//                     textAlign: "center",

//                     padding: "8px 5px",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);

//                   if (value < 1 || isNaN(value)) {
//                     value = 1;
//                   }

//                   if (totalPages > 0 && value > totalPages) {
//                     value = totalPages;
//                   }

//                   setPageNo(value);
//                 }}
//                 size="small"
//               />

//               <KeyboardArrowRightIcon
//                 sx={{
//                   cursor: pageNo < totalPages ? "pointer" : "default",

//                   color: pageNo < totalPages ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (pageNo < totalPages) {
//                     setPageNo((prev) => Number(prev) + 1);
//                   }
//                 }}
//               />

//               <LastPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(totalPages);
//                   }
//                 }}
//               />

//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
//         />

//         {/* ==================================================
//             DENOMINATION FORM
//         ================================================== */}

//         <Dialog
//           open={openForm}
//           onClose={handleCloseForm}
//           fullWidth
//           maxWidth="md"
//           PaperProps={{
//             sx: {
//               borderRadius: "6px",
//               maxHeight: "90vh",
//             },
//           }}
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <DialogTitle
//             sx={{
//               backgroundColor: "rgb(236, 253, 230)",

//               display: "flex",

//               justifyContent: "space-between",

//               alignItems: "center",

//               borderBottom: "1px solid #ddd",

//               py: 1.2,

//               px: 2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 700,

//                 color: "#0B5E20",

//                 fontSize: "18px",
//               }}
//             >
//               Denomination Entry
//             </Typography>

//             <IconButton
//               onClick={handleCloseForm}
//               disabled={saving}
//               size="small"
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           {/* ==================================================
//               CONTENT
//           ================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#fff",

//               p: {
//                 xs: 1.5,
//                 sm: 2,
//               },
//             }}
//           >
//             {/* =================================================
//                 ENTRY NO + DATE
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "1fr 1fr",
//                 },

//                 gap: 2,

//                 mt: 0.5,

//                 mb: 2,
//               }}
//             >
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry No:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   value={entryNo}
//                   onChange={(e) => setEntryNo(e.target.value)}
//                   placeholder="Enter Entry No"
//                   fullWidth
//                 />
//               </Box>

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry Date:
//                 </Typography>

//               <DatePicker
//   value={entryDate}
//   onChange={(newValue) => {
//     setEntryDate(newValue);

//     if (newValue && !editingEntry) {
//       fetchSalesSummary(newValue);
//     }
//   }}
//   format="dd-MM-yyyy"
//   slotProps={{
//     textField: {
//       size: "small",
//       fullWidth: true,
//     },
//   }}
// />
//               </Box>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 SALES SUMMARY
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Sales Summary:
//             </Typography>

          

// <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
//     },
//     gap: 1.5,
//     mb: 2,
//   }}
// >
//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "2px solid #0B5E20",
//         borderRadius: 1,
//         backgroundColor: "#f1fdf4",
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Sales Total Till Now
//       </Typography>

//       <Typography
//         fontSize="18px"
//         fontWeight={700}
//         color="#0B5E20"
//       >
//         ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Cash
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCash || 0).toFixed(2)}
//     </Typography>
//   </Paper>

//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "1px solid #d0d0d0",
//         borderRadius: 1,
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Total Online
//       </Typography>

//       <Typography fontSize="18px" fontWeight={700}>
//         ₹ {Number(salesSummary.totalOnline || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Collection
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCollection || 0).toFixed(2)}
//     </Typography>
//   </Paper>
// </Box>



//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 DENOMINATION TITLE
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Denominations:
//             </Typography>

//             {/* =================================================
//                 DENOMINATION TABLE
//             ================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 border: "1px solid #d0d0d0",

//                 overflowX: "auto",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   minWidth: 600,

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",

//                     py: 0.8,

//                     px: 1,

//                     fontSize: "13px",
//                   },
//                 }}
//               >
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Notes
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Number / Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {denominationRows.map((row, index) => (
//                     <TableRow hover key={row.denomination}>
//                       <TableCell>
//                         <Typography fontWeight={600}>
//                           ₹ {formatDenomination(row.denomination)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell align="center">
//                         <TextField
//                           type="text"
//                           size="small"
//                           value={row.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(index, e.target.value)
//                           }
//                           placeholder="Enter Number"
//                           inputMode="numeric"
//                           inputProps={{
//                             inputMode: "numeric",
//                             pattern: "[0-9]*",
//                           }}
//                           onWheel={(e) => {
//                             e.currentTarget.blur();
//                           }}
//                           sx={{
//                             width: 150,
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell align="right">
//                         <TextField
//                           size="small"
//                           value={Number(row.amount || 0).toFixed(2)}
//                           InputProps={{
//                             readOnly: true,
//                           }}
//                           sx={{
//                             width: 160,
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 DENOMINATION TOTAL
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "flex",

//                 justifyContent: "flex-end",

//                 alignItems: "center",

//                 gap: 1,

//                 mt: 1.5,
//               }}
//             >
//               <Typography fontWeight={700} fontSize="14px">
//                 Denomination Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(
//                   showReconciliation ? savedDenominationTotal : total,
//                 ).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 160,
//                 }}
//               />
//             </Box>

//             {/* =================================================
//                 RECONCILIATION
//             ================================================= */}

//             {showReconciliation && (
//               <>
//                 <Divider
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                   }}
//                 />

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,

//                     border: "1px solid",

//                     borderColor: isCashMatched ? "success.main" : "error.main",

//                     borderRadius: 1,

//                     backgroundColor: isCashMatched ? "#f1fdf4" : "#fff5f5",
//                   }}
//                 >
//                   {/* =====================================================
//           CASH RECONCILIATION
//           Denomination Total VS Total Cash
//       ====================================================== */}

//                   <Typography
//                     fontWeight={700}
//                     fontSize="16px"
//                     sx={{
//                       mb: 2,
//                     }}
//                   >
//                     Cash Reconciliation
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "grid",

//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         sm: "repeat(3, 1fr)",
//                       },

//                       gap: 1.5,
//                     }}
//                   >
//                     {/* =================================================
//             TOTAL CASH
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Total Cash
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(salesSummary?.totalCash || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DENOMINATION TOTAL
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Denomination Total
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(savedDenominationTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DIFFERENCE
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: isCashMatched
//                           ? "success.light"
//                           : "error.light",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Difference
//                       </Typography>

//                      <Typography
//   fontWeight={700}
//   fontSize="17px"
//   color={isCashMatched ? "success.main" : "error.main"}
// >
//   ₹ {Number(cashDifference || 0).toFixed(2)}
// </Typography>
//                     </Box>
//                   </Box>

//                   {/* =====================================================
//           MATCH STATUS
//       ====================================================== */}

//                   <Typography
//                     sx={{
//                       mt: 2,

//                       fontWeight: 700,

//                       fontSize: "16px",

//                       color: isCashMatched ? "success.main" : "error.main",
//                     }}
//                   >
//                     {isCashMatched
//                       ? "✓ CASH TOTAL MATCHED"
//                       : "✗ CASH TOTAL MISMATCH"}
//                   </Typography>
//                 </Paper>
//               </>
//             )}
//           </DialogContent>

//           {/* ==================================================
//               ACTIONS
//           ================================================== */}

//           <DialogActions
//             sx={{
//               justifyContent: "flex-start",

//               px: 2,

//               py: 1.2,

//               gap: 1,
//             }}
//           >
//             <Button
//   variant="contained"
//   disabled={saving || saveCompleted}
//   onClick={handleSave}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",
//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving
//     ? "Saving..."
//     : saveCompleted
//     ? "Saved"
//     : "Save"}
// </Button>

//           <Button
//   variant="outlined"
//   disabled={saving}
//   onClick={handleCloseForm}
//   sx={{
//     textTransform: "none",
//     color: "var(--complementary-color)",
//     borderColor: "var(--complementary-color)",
//     "&:hover": {
//       borderColor: "var(--complementary-color)",
//     },
//   }}
// >
//   Close
// </Button>
//           </DialogActions>
//         </Dialog>


//         <Dialog
//   open={previewOpen}
//   onClose={handleClosePreview}
//   fullWidth
//   maxWidth="md"
// >
//   <DialogTitle>
//     Denomination Entry Preview
//   </DialogTitle>

//   <DialogContent dividers>
//     {previewEntry && (
//       <>
//         <Typography>
//           <b>Entry No:</b> {previewEntry.entryNo}
//         </Typography>

//         <Typography>
//           <b>Entry Date:</b> {previewEntry.entryDateText}
//         </Typography>

//         {isAdmin && (
//           <>
//             <Typography>
//               <b>Sales Total Till Now:</b>{" "}
//               ₹ {Number(previewEntry.salesTotalTillNow || 0).toFixed(2)}
//             </Typography>

//             <Typography>
//               <b>Total Online:</b>{" "}
//               ₹ {Number(previewEntry.totalOnline || 0).toFixed(2)}
//             </Typography>

//             <Typography>
//               <b>Total Collection:</b>{" "}
//               ₹ {Number(previewEntry.totalCollection || 0).toFixed(2)}
//             </Typography>
//           </>
//         )}

//         <Typography>
//           <b>Total Cash:</b>{" "}
//           ₹ {Number(previewEntry.totalCash || 0).toFixed(2)}
//         </Typography>

//         <Divider sx={{ my: 2 }} />

//         <Typography fontWeight={700} mb={1}>
//           Denominations
//         </Typography>

//         <TableContainer component={Paper} variant="outlined">
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Notes</TableCell>
//                 <TableCell align="right">Quantity</TableCell>
//                 <TableCell align="right">Amount</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {(previewEntry.denominations || []).map((item) => (
//                 <TableRow key={item.id ?? item.notes}>
//                   <TableCell>
//                     ₹ {formatDenomination(item.notes)}
//                   </TableCell>

//                   <TableCell align="right">
//                     {Number(item.numbers || 0)}
//                   </TableCell>

//                   <TableCell align="right">
//                     ₹ {Number(item.amount || 0).toFixed(2)}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Typography textAlign="right" fontWeight={700} mt={2}>
//           Denomination Total: ₹{" "}
//           {Number(previewEntry.total || 0).toFixed(2)}
//         </Typography>

//         <Typography mt={1} color="text.secondary" fontSize="13px">
//           Summary Cutoff: {previewEntry.summaryCutoffDateTime || "Not available"}
//         </Typography>
//       </>
//     )}
//   </DialogContent>

//   <DialogActions>
//     <Button onClick={handleClosePreview}>
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>

//       </Box>

//       {/* ==========================================================
//     DELETE CONFIRMATION DIALOG
// ========================================================== */}

 
//     </LocalizationProvider>
//   );
// };

// export default DenominationEntry;















































// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";

// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// // ============================================================
// // API URLS
// // ============================================================

// const POST_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

// const GET_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

// const UPDATE_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

// const DELETE_TABLE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

// const INVOICE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php";

// // ============================================================
// // DEFAULT BRANCH / USER
// // ============================================================

// const BRANCH_ID = 1;



// // ============================================================
// // COMPONENT
// // ============================================================

// const DenominationEntry = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================



// const currentCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const isAdmin = currentCreatedBy === 1;

//   const [entries, setEntries] = useState([]);
  

//   // ==========================================================
//   // FORM
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);




//   const [saveCompleted, setSaveCompleted] = useState(false);


//   const [previewOpen, setPreviewOpen] = useState(false);
// const [previewEntry, setPreviewEntry] = useState(null);

// const handlePreviewEntry = (entry) => {
//   setPreviewEntry(entry);
//   setPreviewOpen(true);
// };

// const handleClosePreview = () => {
//   setPreviewOpen(false);
//   setPreviewEntry(null);
// };

//   // ==========================================================
//   // SALES RECONCILIATION
//   // ==========================================================

// const [salesSummary, setSalesSummary] = useState({
//   regularCash: 0,
//   regularOnline: 0,

//   dealerCash: 0,
//   dealerOnline: 0,

//   catererCash: 0,
//   catererOnline: 0,

//   totalCash: 0,
//   totalOnline: 0,
//   totalCollection: 0,
//   salesTotalTillNow: 0,

//   summaryCutoffDateTime: "",
// });

//   const [showReconciliation, setShowReconciliation] = useState(false);

//   const [savedDenominationTotal, setSavedDenominationTotal] = useState(0);

//   const [cashDifference, setCashDifference] = useState(0);

//   const [isCashMatched, setIsCashMatched] = useState(false);

//   // ==========================================================
//   // ENTRY NUMBER
//   // ==========================================================

//   const [entryNo, setEntryNo] = useState("");

//   // ==========================================================
//   // ENTRY DATE
//   // ==========================================================

//   const [entryDate, setEntryDate] = useState(new Date());

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   // ==========================================================
//   // DENOMINATION MASTER
//   // ==========================================================

//   const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

//   // ==========================================================
//   // DENOMINATION ROWS
//   // ==========================================================

//   const [denominationRows, setDenominationRows] = useState([]);

//   // ==========================================================
//   // CREATE EMPTY ROWS
//   // ==========================================================

//   const createEmptyRows = () => {
//     return denominationValues.map((value) => ({
//       denomination: value,
//       quantity: "",
//       amount: 0,
//     }));
//   };

//   // ==========================================================
//   // FORMAT DENOMINATION
//   // ==========================================================

//   const formatDenomination = (value) => {
//     if (value === 0.5) {
//       return "0.50";
//     }

//     return String(value);
//   };

//   // ==========================================================
//   // FORMAT DATE FOR DISPLAY
//   // ==========================================================

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // FORMAT DATE FOR API
//   // ==========================================================

//   const formatApiDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const year = d.getFullYear();

//     const month = String(d.getMonth() + 1).padStart(2, "0");

//     const day = String(d.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   // ==========================================================
//   // CHECK SAME DATE
//   // ==========================================================

//   const isSameDate = (date1, date2) => {
//     if (!date1 || !date2) {
//       return false;
//     }

//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   // ==========================================================
//   // GET INVOICE DATE VALUE
//   // ==========================================================

//   const getInvoiceDateValue = (invoice) => {
//     const value = invoice?.InvoiceDate;

//     if (!value) {
//       return null;
//     }

//     // API sometimes returns:
//     // { date: "2026-09-30 18:30:00" }

//     if (typeof value === "object" && value?.date) {
//       return value.date;
//     }

//     return value;
//   };

//   // ==========================================================
//   // GET INVOICE DATETIME
//   // ==========================================================

//   const getInvoiceDateTime = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return null;
//     }

//     const dateObject = new Date(rawValue);

//     if (!isNaN(dateObject.getTime())) {
//       return dateObject;
//     }

//     return null;
//   };

//   // ==========================================================
//   // GET DATE ONLY FROM INVOICE
//   // ==========================================================

//   const getInvoiceDateOnly = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return "";
//     }

//     const stringValue = String(rawValue);

//     return stringValue.substring(0, 10);
//   };

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================


// const resetForm = () => {
//   setEntryNo("");
//   setEntryDate(new Date());
//   setEditingEntry(null);
//   setSaveCompleted(false);
//   setDenominationRows(createEmptyRows());

//   setSalesSummary({
//     regularCash: 0,
//     regularOnline: 0,
//     dealerCash: 0,
//     dealerOnline: 0,
//     catererCash: 0,
//     catererOnline: 0,
//     totalCash: 0,
//     totalOnline: 0,
//     totalCollection: 0,
//     salesTotalTillNow: 0,
//     summaryCutoffDateTime: "",
//   });

//   setSavedDenominationTotal(0);
//   setShowReconciliation(false);
//   setCashDifference(0);
//   setIsCashMatched(false);
// };


//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//      const createdBy = sessionStorage.getItem("CreatedBy") || "";

// const url =
//   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}` +
//   `&CreatedBy=${encodeURIComponent(createdBy)}`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Entry No API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const data = Array.isArray(result?.data) ? result.data : [];

//       if (data.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const entryNumbers = data
//         .map((item) => Number(item?.EntryNo))
//         .filter((value) => !Number.isNaN(value));

//       if (entryNumbers.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const maxEntryNo = Math.max(...entryNumbers);

//       setEntryNo(String(maxEntryNo + 1));
//     } catch (error) {
//       console.error("GENERATE ENTRY NO ERROR:", error);

//       setEntryNo("1");

//       toast.error("Unable to generate Entry No");
//     }
//   };

//   // ==========================================================
//   // FETCH SALES SUMMARY
//   //
//   // REQUIREMENT:
//   //
//   // Sales Entry
//   // + Sales Dealer
//   // + Sales Caterers
//   //
//   // selected date
//   // +
//   // till current time for today's date
//   //
//   // SUM invoice.Total
//   // ==========================================================

//   const fetchSalesSummary = async (selectedDate) => {
//     try {
//       if (!selectedDate) {
//         return;
//       }

//       const selectedDateString = formatApiDate(selectedDate);

//       const now = new Date();

//       console.log("====================================");

//       console.log("FETCH SALES SUMMARY");

//       console.log("SELECTED DATE:", selectedDateString);

//       console.log("CURRENT TIME:", now);

//       // ======================================================
//       // FETCH FIRST PAGE
//       // ======================================================

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const firstResponse = await fetch(
//         `${INVOICE_API}?Table=invoiceheader&PageNo=1`,
//         requestOptions,
//       );

//       if (!firstResponse.ok) {
//         throw new Error(`Sales API failed: ${firstResponse.status}`);
//       }

//       const firstResult = await firstResponse.json();

//       let allInvoices = [...(firstResult?.data || [])];

//       const totalPages = Number(firstResult?.total_pages || 1);

//       console.log("TOTAL INVOICE PAGES:", totalPages);

//       // ======================================================
//       // FETCH ALL REMAINING PAGES
//       // ======================================================

//       if (totalPages > 1) {
//         for (let page = 2; page <= totalPages; page++) {
//           try {
//             const response = await fetch(
//               `${INVOICE_API}?Table=invoiceheader&PageNo=${page}`,
//               requestOptions,
//             );

//             if (!response.ok) {
//               console.warn("Invoice page failed:", page);

//               continue;
//             }

//             const result = await response.json();

//             allInvoices = [...allInvoices, ...(result?.data || [])];
//           } catch (pageError) {
//             console.error("PAGE FETCH ERROR:", page, pageError);
//           }
//         }
//       }

//       console.log("TOTAL ALL INVOICES:", allInvoices.length);

//       // ======================================================
//       // FILTER SALES
//       //
//       // ALL INVOICEHEADER SALES ARE CONSIDERED:
//       //
//       // Sales Entry
//       // Dealer
//       // Caterers
//       //
//       // If your backend has other invoice types in
//       // invoiceheader, then SaleType filter can be added.
//       // ======================================================

//       const selectedInvoices = allInvoices.filter((invoice) => {
//         const invoiceDateOnly = getInvoiceDateOnly(invoice);

//         if (invoiceDateOnly !== selectedDateString) {
//           return false;
//         }

//         // ==================================================
//         // IF SELECTED DATE IS TODAY
//         // ONLY INCLUDE INVOICES TILL NOW
//         // ==================================================

//         if (isSameDate(selectedDate, now)) {
//           const invoiceDateTime = getInvoiceDateTime(invoice);

//           // If API contains proper time,
//           // compare with current time.
//           if (invoiceDateTime) {
//             return invoiceDateTime.getTime() <= now.getTime();
//           }

//           // If API has only date and no time,
//           // include today's invoice because
//           // backend has not provided invoice time.
//           return true;
//         }

//         // ==================================================
//         // PAST DATE
//         // ALL INVOICES OF THAT DATE
//         // ==================================================

//         return true;
//       });

//       console.log("SELECTED SALES INVOICES:", selectedInvoices);

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       let totalCash = 0;
//       let totalOnline = 0;
//       let salesTotalTillNow = 0;

//       selectedInvoices.forEach((invoice) => {
//         // ====================================================
//         // INVOICE TOTAL
//         // ====================================================

//         const invoiceTotal = Number(invoice?.Total || 0);

//         // ====================================================
//         // PAYMENT MODE
//         //
//         // C = Cash
//         // O = Online
//         // M = Mixed
//         // ====================================================

//         const paymentMode = String(invoice?.PaymentMode || "")
//           .trim()
//           .toUpperCase();

//         // ====================================================
//         // CASH AMOUNT
//         // ====================================================

//         const cashAmount = Number(invoice?.CashAmount || 0);

//         // ====================================================
//         // ONLINE AMOUNT
//         // ====================================================

//         const onlineAmount = Number(invoice?.OnlineAmount || 0);

//         // ====================================================
//         // SALES TOTAL
//         //
//         // Sales Entry
//         // + Dealer
//         // + Caterers
//         // ====================================================

//         salesTotalTillNow += invoiceTotal;

//         // ====================================================
//         // PAYMENT MODE WISE CALCULATION
//         // ====================================================

//         if (paymentMode === "C" || paymentMode === "CASH") {
//           // ----------------------------------------------
//           // CASH SALE
//           // ----------------------------------------------

//           totalCash += invoiceTotal;
//         } else if (paymentMode === "O" || paymentMode === "ONLINE") {
//           // ----------------------------------------------
//           // ONLINE SALE
//           // ----------------------------------------------

//           totalOnline += invoiceTotal;
//         } else if (paymentMode === "M" || paymentMode === "MIXED") {
//           // ----------------------------------------------
//           // MIXED PAYMENT
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         } else {
//           // ----------------------------------------------
//           // FALLBACK
//           //
        
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         }
//       });

//       // ======================================================
//       // ROUND VALUES
//       // ======================================================

//       salesTotalTillNow = Number(salesTotalTillNow.toFixed(2));

//       totalCash = Number(totalCash.toFixed(2));

//       totalOnline = Number(totalOnline.toFixed(2));

//       console.log("========== PAYMENT SUMMARY ==========");

//       console.table(
//         selectedInvoices.map((invoice) => ({
//           InvoiceNo: invoice?.InvoiceNo,
//           Total: Number(invoice?.Total || 0),
//           PaymentMode: invoice?.PaymentMode,
//           CashAmount: Number(invoice?.CashAmount || 0),
//           OnlineAmount: Number(invoice?.OnlineAmount || 0),
//         })),
//       );

//       console.log("FINAL SALES TOTAL:", salesTotalTillNow);

//       console.log("FINAL TOTAL CASH:", totalCash);

//       console.log("FINAL TOTAL ONLINE:", totalOnline);

//       console.log("CASH + ONLINE:", totalCash + totalOnline);

//       console.log("======================================");

//       const totalCollection = salesTotalTillNow;




      
//       const cutoffNow = new Date();
//       const pad = (value) => String(value).padStart(2, "0");

//       const summaryCutoffDateTime =
//         `${cutoffNow.getFullYear()}-${pad(cutoffNow.getMonth() + 1)}-${pad(cutoffNow.getDate())} ` +
//         `${pad(cutoffNow.getHours())}:${pad(cutoffNow.getMinutes())}:${pad(cutoffNow.getSeconds())}`;


//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

     
// setSalesSummary({
//   regularCash: 0,
//   regularOnline: 0,
//   dealerCash: 0,
//   dealerOnline: 0,
//   catererCash: 0,
//   catererOnline: 0,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   salesTotalTillNow,
//   summaryCutoffDateTime,
// });


//       console.log("====================================");

//       console.log(
//         "SALES TOTAL TILL NOW:",
//         Number(salesTotalTillNow || 0).toFixed(2),
//       );

//       console.log("TOTAL CASH:", Number(totalCash || 0).toFixed(2));

//       console.log("TOTAL ONLINE:", Number(totalOnline || 0).toFixed(2));

//       console.log("TOTAL COLLECTION:", Number(totalCollection || 0).toFixed(2));

//       console.log(
//         "CASH + ONLINE:",
//         (Number(totalCash || 0) + Number(totalOnline || 0)).toFixed(2),
//       );

//       console.log("SELECTED INVOICE COUNT:", selectedInvoices.length);

//       console.log("====================================");
//     } catch (error) {
//       console.error("FETCH SALES SUMMARY ERROR:", error);

//       toast.error("Unable to fetch Sales Summary");
//     }
//   };

//   // ==========================================================
//   // GET DENOMINATION DATA
//   // ==========================================================

// const fetchDenominationEntries = async () => {
//   try {
//     const currentCreatedBy = Number(
//       sessionStorage.getItem("CreatedBy") || 0
//     );

//     const isAdmin = currentCreatedBy === 1;

//     const params = new URLSearchParams({
//       Id: "",
//       BranchId: String(BRANCH_ID),
//     });

//     if (!isAdmin) {
//       params.set("CreatedBy", String(currentCreatedBy));
//     }

//     const url = `${GET_DENOMINATION_API}?${params.toString()}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(
//         `GET API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     if (!result.success) {
//       throw new Error(
//         result.message || "Unable to load denomination entries"
//       );
//     }

//     if (!Array.isArray(result.data)) {
//       setEntries([]);
//       setPageNo(1);
//       return;
//     }

//     const groupedEntries = {};

//     result.data.forEach((item) => {
//       const entryNo = String(item.EntryNo ?? "");
//       const branchId = String(item.BranchId ?? "");
//       const createdBy = String(item.CreatedBy ?? "");

//       const groupKey = `${branchId}_${createdBy}_${entryNo}`;

//       if (!groupedEntries[groupKey]) {
//         groupedEntries[groupKey] = {
//           id: item.Id,
//           apiId: item.Id,
//           branchId: item.BranchId,
//           entryNo: item.EntryNo,
//           entryDate: item.EntryDate,
//           entryDateText: formatDate(item.EntryDate),
//           total: 0,
//           denominations: [],
//           active: Number(item.Active || 0),
//           createdBy: item.CreatedBy,
//           updatedBy: item.UpdatedBy,
//           updatedCount: item.UpdatedCount,
//           salesTotalTillNow: Number(item.SalesTotalTillNow || 0),
//           totalCash: Number(item.TotalCash || 0),
//           totalOnline: Number(item.TotalOnline || 0),
//           totalCollection: Number(item.TotalCollection || 0),
//           summaryCutoffDateTime:
//             item.SummaryCutoffDateTime || "",
//         };
//       }

//       const amount = Number(item.Amount || 0);

//       groupedEntries[groupKey].total += amount;

//       groupedEntries[groupKey].denominations.push({
//         id: item.Id,
//         notes: Number(item.Notes || 0),
//         numbers: Number(item.Numbers || 0),
//         amount,
//       });
//     });

//     const formattedEntries = Object.values(groupedEntries);

//     formattedEntries.sort((a, b) => {
//       const dateA = a.entryDate
//         ? new Date(a.entryDate).getTime()
//         : 0;

//       const dateB = b.entryDate
//         ? new Date(b.entryDate).getTime()
//         : 0;

//       if (dateA !== dateB) {
//         return dateB - dateA;
//       }

//       return Number(b.entryNo || 0) - Number(a.entryNo || 0);
//     });

//     console.log(
//       "DENOMINATION ENTRIES - LATEST FIRST:",
//       formattedEntries
//     );

//     setEntries(formattedEntries);

//     const calculatedPages = Math.ceil(
//       formattedEntries.length / 10
//     );

//     if (calculatedPages === 0) {
//       setPageNo(1);
//     } else {
//       setPageNo((previousPage) =>
//         previousPage > calculatedPages
//           ? calculatedPages
//           : previousPage
//       );
//     }
//   } catch (error) {
//     console.error("GET DENOMINATION ERROR:", error);

//     toast.error("Unable to load Denomination Entries");
//   }
// };

//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {
//     setDenominationRows(createEmptyRows());

//     fetchDenominationEntries();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = async () => {
//     resetForm();

//     const today = new Date();

//     setEntryDate(today);

//     setOpenForm(true);

//     // Fetch current sales total
//     await fetchSalesSummary(today);

//     // Generate entry no
//     await generateNextEntryNo();
//   };

//   // ==========================================================
//   // CLOSE FORM
//   // ==========================================================

//   const handleCloseForm = () => {
//     if (saving) {
//       return;
//     }

//     setOpenForm(false);

//     resetForm();
//   };

//   // ==========================================================
//   // EDIT DENOMINATION ENTRY
//   // ==========================================================

 


// const handleEditEntry = async (entry) => {
//   try {
//     // 1. Validate selected entry
//     if (!entry) {
//       toast.error("Denomination entry not found");
//       return;
//     }

//     setSaveCompleted(false);
//     setEditingEntry(entry);

//     // 2. Restore Entry Number
//     setEntryNo(String(entry.entryNo ?? ""));

//     // 3. Restore Entry Date without timezone conversion
//     const rawDate = String(entry.entryDate ?? "");
//     const datePart = rawDate.substring(0, 10);

//     let validEditDate;

//     if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
//       const [year, month, day] = datePart
//         .split("-")
//         .map(Number);

//       validEditDate = new Date(year, month - 1, day);
//     } else {
//       validEditDate = new Date(
//         entry.entryDate || Date.now()
//       );
//     }

//     if (Number.isNaN(validEditDate.getTime())) {
//       toast.error("Invalid denomination entry date");
//       return;
//     }

//     setEntryDate(validEditDate);

//     // 4. Restore existing denomination rows
//     const emptyRows = createEmptyRows();

//     const existingDenominations = Array.isArray(
//       entry.denominations
//     )
//       ? entry.denominations
//       : [];

//     const editRows = emptyRows.map((row) => {
//       const existing = existingDenominations.find(
//         (item) =>
//           Number(item.notes) === Number(row.denomination)
//       );

//       if (!existing) {
//         return {
//           ...row,
//           id: null,
//           quantity: "",
//           amount: 0,
//         };
//       }

//       const quantity = Number(existing.numbers ?? 0);

//       return {
//         ...row,
//         id: existing.id ?? existing.Id ?? null,
//         quantity: quantity > 0 ? String(quantity) : "",
//         amount: Number(existing.amount ?? 0),
//       };
//     });

//     setDenominationRows(editRows);

//     // 5. Restore saved Summary values
//     const savedSummary = {
//       totalCash: Number(entry.totalCash ?? 0),
//       totalOnline: Number(entry.totalOnline ?? 0),
//       totalCollection: Number(entry.totalCollection ?? 0),
//       salesTotalTillNow: Number(
//         entry.salesTotalTillNow ?? 0
//       ),
//       summaryCutoffDateTime:
//         entry.summaryCutoffDateTime ?? "",
//     };

//     const hasSavedSummary =
//       savedSummary.totalCash !== 0 ||
//       savedSummary.totalOnline !== 0 ||
//       savedSummary.totalCollection !== 0 ||
//       savedSummary.salesTotalTillNow !== 0;

//     console.log("EDIT ENTRY:", entry);
//     console.log("EDIT ENTRY DATE:", datePart);
//     console.log("SAVED SUMMARY:", savedSummary);
//     console.log("HAS SAVED SUMMARY:", hasSavedSummary);

//     // 6. Restore saved Summary or fetch it if unavailable
//     if (hasSavedSummary) {
//       setSalesSummary((previous) => ({
//         ...previous,
//         ...savedSummary,
//       }));
//     } else {
//       await fetchSalesSummary(validEditDate);
//     }

//     // 7. Reset reconciliation state
//     setShowReconciliation(false);
//     setCashDifference(0);
//     setIsCashMatched(false);
//     setSavedDenominationTotal(0);

//     // 8. Open Edit form
//     setOpenForm(true);
//   } catch (error) {
//     console.error("EDIT DENOMINATION ERROR:", error);

//     toast.error(
//       error?.message ||
//         "Unable to open denomination entry for edit"
//     );
//   }
// };





//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (index, value) => {
//     // Empty
//     if (value === "") {
//       setDenominationRows((previousRows) =>
//         previousRows.map((row, rowIndex) => {
//           if (rowIndex === index) {
//             return {
//               ...row,
//               quantity: "",
//               amount: 0,
//             };
//           }

//           return row;
//         }),
//       );

//       return;
//     }

//     // Only integer
//     if (!/^\d+$/.test(value)) {
//       return;
//     }

//     const quantity = Number(value);

//     setDenominationRows((previousRows) =>
//       previousRows.map((row, rowIndex) => {
//         if (rowIndex === index) {
//           const amount = row.denomination * quantity;

//           return {
//             ...row,
//             quantity: value,
//             amount,
//           };
//         }

//         return row;
//       }),
//     );
//   };

//   // ==========================================================
//   // TOTAL DENOMINATION
//   // ==========================================================

//   const total = useMemo(() => {
//     return denominationRows.reduce(
//       (sum, row) => sum + Number(row.amount || 0),
//       0,
//     );
//   }, [denominationRows]);

//   // ==========================================================
//   // UPDATE DENOMINATION API
//   // ==========================================================

//   const updateDenomination = async ({
//     id,
//     branchId,
//     date,
//     notes,
//     numbers,
//     amount,
//     updatedBy,
//   }) => {
//     const formData = new FormData();

//     formData.append("Id", String(id));

//     formData.append("BranchId", String(branchId || BRANCH_ID));

//     formData.append("EntryDate", formatApiDate(date));

//     formData.append("Notes", String(Number(notes || 0)));

//     formData.append("Numbers", String(Number(numbers || 0)));

//     formData.append("Amount", Number(amount || 0).toFixed(2));

//     formData.append("UpdatedBy", String(updatedBy || ""));

//     const response = await fetch(UPDATE_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Unable to update denomination");
//     }

//     return result;
//   };

//   // ==========================================================
//   // CREATE DENOMINATION API
//   // ==========================================================

  



// const createDenomination = async ({
//   entryNo,
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId,
//   createdBy,
//   userId,
//   saleRole,
//   drawerId,
//   salesTotalTillNow,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   summaryCutoffDateTime,
// }) => {
//   try {
//     // ========================================
//     // 1. PREPARE AND VALIDATE VALUES
//     // ========================================
//     const resolvedBranchId = Number(branchId || BRANCH_ID);
//     const resolvedCreatedBy = Number(createdBy);
//     const notes = Number(denomination);
//     const numbers = Number(quantity);

//     const totalAmount =
//       amount !== undefined && amount !== null && amount !== ""
//         ? Number(amount)
//         : notes * numbers;

//     if (!Number.isFinite(resolvedBranchId) || resolvedBranchId <= 0) {
//       throw new Error("Please provide a valid BranchId.");
//     }

//     if (!Number.isFinite(resolvedCreatedBy) || resolvedCreatedBy <= 0) {
//       throw new Error("Please provide a valid CreatedBy.");
//     }

//     if (!Number.isFinite(notes) || notes <= 0) {
//       throw new Error("Please provide a valid denomination Notes value.");
//     }

//     if (!Number.isFinite(numbers) || numbers <= 0) {
//       throw new Error("Please provide a valid denomination quantity.");
//     }

//     if (!Number.isFinite(totalAmount) || totalAmount < 0) {
//       throw new Error("Please provide a valid denomination Amount.");
//     }

//     if (!entryDate) {
//       throw new Error("Please select Entry Date.");
//     }

//     // ========================================
//     // 2. FORMAT ENTRY DATE
//     // ========================================
//     const formattedEntryDate = formatApiDate(entryDate);

//     if (!formattedEntryDate) {
//       throw new Error("Invalid Entry Date.");
//     }

//     // ========================================
//     // 3. CREATE FORMDATA
//     // ========================================
//     const formData = new FormData();

//     formData.append("BranchId", String(resolvedBranchId));
//     formData.append("EntryDate", String(formattedEntryDate));
//     formData.append("Notes", String(notes));
//     formData.append("Numbers", String(numbers));
//     formData.append("Amount", totalAmount.toFixed(2));
//     formData.append("CreatedBy", String(resolvedCreatedBy));

//     formData.append("UserId", String(userId ?? ""));
//     formData.append("SaleRole", String(saleRole ?? ""));
//     formData.append("DrawerId", String(drawerId ?? ""));
//     formData.append("EntryNo", String(entryNo ?? "").trim());

//     formData.append(
//       "SalesTotalTillNow",
//       String(Number(salesTotalTillNow ?? 0))
//     );

//     formData.append("TotalCash", String(Number(totalCash ?? 0)));
//     formData.append("TotalOnline", String(Number(totalOnline ?? 0)));

//     formData.append(
//       "TotalCollection",
//       String(Number(totalCollection ?? 0))
//     );

//     formData.append(
//       "SummaryCutoffDateTime",
//       String(summaryCutoffDateTime ?? "")
//     );

//     // ========================================
//     // 4. LOG ACTUAL FORMDATA VALUES
//     // ========================================
//     const payloadForLog = {};

//     for (const [key, value] of formData.entries()) {
//       payloadForLog[key] = value;
//     }

//     console.log("========== DENOMINATION API REQUEST ==========");
//     console.log("API URL:", POST_DENOMINATION_API);
//     console.log("FORMDATA PAYLOAD:", payloadForLog);

//     // ========================================
//     // 5. CALL POST API
//     // ========================================
//     const response = await fetch(POST_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     // ========================================
//     // 6. READ API RESPONSE
//     // ========================================
//     const responseText = await response.text();

//     console.log("DENOMINATION HTTP STATUS:", response.status);
//     console.log("DENOMINATION RAW RESPONSE:", responseText);

//     let result;

//     try {
//       result = JSON.parse(responseText);
//     } catch {
//       throw new Error(
//         `The API returned an invalid JSON response. HTTP ${response.status}. ` +
//           `Response: ${responseText.slice(0, 300)}`
//       );
//     }

//     // ========================================
//     // 7. CHECK HTTP AND API SUCCESS
//     // ========================================
//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           `Denomination API failed. HTTP ${response.status}.`
//       );
//     }

//     // Support common API response formats.
//     const apiSuccess =
//       result.success === true ||
//       result.success === 1 ||
//       result.success === "true" ||
//       result.status === "success";

//     if (!apiSuccess) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           "The API did not confirm that the denomination was saved."
//       );
//     }

//     console.log("DENOMINATION SAVED SUCCESSFULLY:", result);

//     return result;
//   } catch (error) {
//     console.error("CREATE DENOMINATION ERROR:", error);
//     throw error;
//   }
// };



//   // ==========================================================
//   // SAVE
//   //
//   // IMPORTANT:
//   // VALIDATION HAPPENS BEFORE POST API
//   // ==========================================================

//   // ==========================================================
//   // SAVE / UPDATE DENOMINATION
//   // ==========================================================




// const handleSave = async () => {
//   if (saving) {
//     return;
//   }

//   if (!entryNo || !entryNo.trim()) {
//     toast.error("Please enter Entry No");
//     return;
//   }

//   if (!entryDate || isNaN(new Date(entryDate).getTime())) {
//     toast.error("Please select a valid Entry Date");
//     return;
//   }

//   const rowsToSave = denominationRows.filter(
//     (row) => Number(row.quantity || 0) > 0
//   );

//   if (rowsToSave.length === 0) {
//     toast.error("Please enter at least one denomination quantity");
//     return;
//   }

//   const loggedInUserId =
//     sessionStorage.getItem("UserId") ||
//     sessionStorage.getItem("LoginUserId") ||
//     "";

//   const loggedInSaleRole =
//     sessionStorage.getItem("UserRole") || "";

//   const currentCreatedBy = Number(
//     sessionStorage.getItem("CreatedBy") || 0
//   );

//   const drawerId =
//     sessionStorage.getItem("Device") || "";

//   if (
//     !loggedInUserId ||
//     !loggedInSaleRole ||
//     !currentCreatedBy
//   ) {
//     toast.error(
//       "Login details are incomplete. Please login again."
//     );
//     return;
//   }

//   try {
//     setSaving(true);

//     const userDetails = {
//       userId: loggedInUserId,
//       saleRole: loggedInSaleRole,
//       drawerId,
//     };

//     const denominationTotal = Number(
//       rowsToSave
//         .reduce((sum, row) => {
//           const denomination = Number(row.denomination || 0);
//           const quantity = Number(row.quantity || 0);

//           return sum + denomination * quantity;
//         }, 0)
//         .toFixed(2)
//     );

//     // Read the current sales summary
//     const salesTotalTillNow = Number(
//       salesSummary?.salesTotalTillNow ?? 0
//     );

//     const cashTotal = Number(
//       salesSummary?.totalCash ?? 0
//     );

//     const onlineTotal = Number(
//       salesSummary?.totalOnline ?? 0
//     );

//     const totalCollection = Number(
//       salesSummary?.totalCollection ?? 0
//     );

//     const summaryCutoffDateTime =
//       salesSummary?.summaryCutoffDateTime || "";

//     // Debug the values before saving
//     console.log("SALES SUMMARY BEFORE SAVE:", salesSummary);

//     console.log("SUMMARY VALUES SENT:", {
//       SalesTotalTillNow: salesTotalTillNow,
//       TotalCash: cashTotal,
//       TotalOnline: onlineTotal,
//       TotalCollection: totalCollection,
//       SummaryCutoffDateTime: summaryCutoffDateTime,
//       CreatedBy: currentCreatedBy,
//     });

//     // Stop saving if the summary is not loaded
//     if (
//       salesTotalTillNow === 0 &&
//       cashTotal === 0 &&
//       onlineTotal === 0 &&
//       totalCollection === 0
//     ) {
//       toast.error(
//         "Sales summary is zero. Please refresh the sales summary before saving."
//       );
//       return;
//     }

//     const difference = Number(
//       (denominationTotal - cashTotal).toFixed(2)
//     );

//     const matched = Math.abs(difference) < 0.01;

//     setSavedDenominationTotal(denominationTotal);
//     setCashDifference(difference);
//     setIsCashMatched(matched);
//     setShowReconciliation(true);

//     const snapshotData = {
//       salesTotalTillNow,
//       totalCash: cashTotal,
//       totalOnline: onlineTotal,
//       totalCollection,
//       summaryCutoffDateTime,
//     };

//     const createEntry = async (row) => {
//       const denomination = Number(row.denomination || 0);
//       const quantity = Number(row.quantity || 0);

//       const amount = Number(
//         (denomination * quantity).toFixed(2)
//       );

//       await createDenomination({
//         entryNo: entryNo.trim(),
//         entryDate,
//         denomination,
//         quantity,
//         amount,
//         branchId: BRANCH_ID,
//         createdBy: currentCreatedBy,
//         ...userDetails,
//         ...snapshotData,
//       });
//     };

//     if (editingEntry) {
//       for (const row of denominationRows) {
//         const denomination = Number(row.denomination || 0);
//         const quantity = Number(row.quantity || 0);

//         const amount = Number(
//           (denomination * quantity).toFixed(2)
//         );

//         if (row.id) {
//           if (quantity <= 0) {
//             continue;
//           }

//           await updateDenomination({
//             id: row.id,
//             branchId: BRANCH_ID,
//             date: entryDate,
//             notes: denomination,
//             numbers: quantity,
//             amount,
//             updatedBy: currentCreatedBy,
//             ...userDetails,
//           });
//         } else if (quantity > 0) {
//           await createEntry(row);
//         }
//       }

//       toast.success(
//         "Denomination Entry updated successfully!"
//       );
//     } else {
//       for (const row of rowsToSave) {
//         await createEntry(row);
//       }

//       toast.success(
//         "Denomination Entry saved successfully!"
//       );
//     }

//     await fetchDenominationEntries();

//     setSaveCompleted(true);
//     setEditingEntry(null);
//   } catch (error) {
//     console.error("Denomination Save Error:", error);

//     toast.error(
//       error?.message || "Unable to save Denomination Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };






//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

 
// const pageSize = 10;

// const totalPages = Math.ceil(entries.length / pageSize);

// const paginatedEntries = entries.slice(
//   (pageNo - 1) * pageSize,
//   pageNo * pageSize
// );


//   // ==========================================================
//   // TABLE COLUMNS
//   // ==========================================================

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "srNo",

//         header: "Sr.No",

//         size: 80,

//         Cell: ({ row }) => {
//           const index = entries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "entryNo",

//         header: "Entry No",

//         size: 150,
//       },

//       {
//         accessorKey: "entryDateText",

//         header: "Entry Date",

//         size: 160,
//       },

//       {
//         accessorKey: "total",

//         header: "Total",

//         size: 150,

//         Cell: ({ cell }) => (
//           <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
//         ),
//       },

//       {
//         header: "Actions",

//         size: 180,

//         enableSorting: false,

//         enableColumnFilter: false,

//       Cell: ({ row }) => (
//   <Box
//     display="flex"
//     justifyContent="center"
//     alignItems="center"
//     gap={1}
//   >
//     {/* ================= PREVIEW ================= */}
//     <Tooltip title="Preview">
//       <IconButton
//         color="info"
//         size="small"
//         onClick={() => handlePreviewEntry(row.original)}
//       >
//         <VisibilityIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>

//     {/* ================= EDIT ================= */}
//     <Tooltip title="Edit">
//       <IconButton
//         color="primary"
//         size="small"
//         onClick={() => handleEditEntry(row.original)}
//       >
//         <EditIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>
//   </Box>
// ),
//       },
//     ],
//     [entries, handleEditEntry, handlePreviewEntry]
//   );
//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{
//           width: "100%",
//           minHeight: "100%",
//           p: 5,
//           boxSizing: "border-box",

//           "@media (max-width: 768px)": {
//             p: 2,
//           },
//         }}
//       >
//         {/* ==================================================
//             PAGE TITLE
//         ================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Denomination Entry</b>
//           </Typography>
//         </Box>

//         {/* ==================================================
//             CREATE BUTTON
//         ================================================== */}

//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },

//               borderRadius: "5px 5px 0 0",

//               textTransform: "uppercase",

//               fontSize: "16px",

//               fontWeight: 500,

//               px: 2.5,

//               py: 1.5,
//             }}
//             variant="contained"
//             onClick={handleOpenForm}
//           >
//             CREATE DENOMINATION ENTRY
//           </Button>
//         </Box>

//         {/* ==================================================
//             MAIN TABLE
//         ================================================== */}

//         <MaterialReactTable
//   columns={columns}
//   data={paginatedEntries}
//   enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",

//               color: "black",

//               fontSize: "16px",

//               fontWeight: "bold",
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               fontSize: "15px",
//             },
//           }}
//           muiTablePaperProps={{
//             elevation: 2,

//             sx: {
//               borderRadius: "0 4px 4px 4px",

//               overflow: "hidden",

//               boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//             },
//           }}
//           muiTableContainerProps={{
//             sx: {
//               maxHeight: "none",
//             },
//           }}
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               mb={1}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//               pr={2}
//               gap={0.5}
//             >
//               <FirstPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(1);
//                   }
//                 }}
//               />

//               <KeyboardArrowLeftIcon
//                 sx={{
//                   cursor: pageNo > 1 ? "pointer" : "default",

//                   color: pageNo > 1 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                 }}
//               />

//               <Box ml={1}>Page No</Box>

//               <TextField
//                 sx={{
//                   width: "65px",

//                   ml: 1,

//                   "& .MuiInputBase-input": {
//                     textAlign: "center",

//                     padding: "8px 5px",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);

//                   if (value < 1 || isNaN(value)) {
//                     value = 1;
//                   }

//                   if (totalPages > 0 && value > totalPages) {
//                     value = totalPages;
//                   }

//                   setPageNo(value);
//                 }}
//                 size="small"
//               />

//               <KeyboardArrowRightIcon
//                 sx={{
//                   cursor: pageNo < totalPages ? "pointer" : "default",

//                   color: pageNo < totalPages ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (pageNo < totalPages) {
//                     setPageNo((prev) => Number(prev) + 1);
//                   }
//                 }}
//               />

//               <LastPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(totalPages);
//                   }
//                 }}
//               />

//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
//         />

//         {/* ==================================================
//             DENOMINATION FORM
//         ================================================== */}

//         <Dialog
//           open={openForm}
//           onClose={handleCloseForm}
//           fullWidth
//           maxWidth="md"
//           PaperProps={{
//             sx: {
//               borderRadius: "6px",
//               maxHeight: "90vh",
//             },
//           }}
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <DialogTitle
//             sx={{
//               backgroundColor: "rgb(236, 253, 230)",

//               display: "flex",

//               justifyContent: "space-between",

//               alignItems: "center",

//               borderBottom: "1px solid #ddd",

//               py: 1.2,

//               px: 2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 700,

//                 color: "#0B5E20",

//                 fontSize: "18px",
//               }}
//             >
//               Denomination Entry
//             </Typography>

//             <IconButton
//               onClick={handleCloseForm}
//               disabled={saving}
//               size="small"
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           {/* ==================================================
//               CONTENT
//           ================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#fff",

//               p: {
//                 xs: 1.5,
//                 sm: 2,
//               },
//             }}
//           >
//             {/* =================================================
//                 ENTRY NO + DATE
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "1fr 1fr",
//                 },

//                 gap: 2,

//                 mt: 0.5,

//                 mb: 2,
//               }}
//             >
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry No:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   value={entryNo}
//                   onChange={(e) => setEntryNo(e.target.value)}
//                   placeholder="Enter Entry No"
//                   fullWidth
//                 />
//               </Box>

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry Date:
//                 </Typography>

//               <DatePicker
//   value={entryDate}
//   onChange={(newValue) => {
//     setEntryDate(newValue);

//     if (newValue && !editingEntry) {
//       fetchSalesSummary(newValue);
//     }
//   }}
//   format="dd-MM-yyyy"
//   slotProps={{
//     textField: {
//       size: "small",
//       fullWidth: true,
//     },
//   }}
// />
//               </Box>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 SALES SUMMARY
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Sales Summary:
//             </Typography>

          

// <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
//     },
//     gap: 1.5,
//     mb: 2,
//   }}
// >
//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "2px solid #0B5E20",
//         borderRadius: 1,
//         backgroundColor: "#f1fdf4",
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Sales Total Till Now
//       </Typography>

//       <Typography
//         fontSize="18px"
//         fontWeight={700}
//         color="#0B5E20"
//       >
//         ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Cash
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCash || 0).toFixed(2)}
//     </Typography>
//   </Paper>

//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "1px solid #d0d0d0",
//         borderRadius: 1,
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Total Online
//       </Typography>

//       <Typography fontSize="18px" fontWeight={700}>
//         ₹ {Number(salesSummary.totalOnline || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Collection
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCollection || 0).toFixed(2)}
//     </Typography>
//   </Paper>
// </Box>



//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 DENOMINATION TITLE
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Denominations:
//             </Typography>

//             {/* =================================================
//                 DENOMINATION TABLE
//             ================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 border: "1px solid #d0d0d0",

//                 overflowX: "auto",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   minWidth: 600,

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",

//                     py: 0.8,

//                     px: 1,

//                     fontSize: "13px",
//                   },
//                 }}
//               >
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Notes
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Number / Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {denominationRows.map((row, index) => (
//                     <TableRow hover key={row.denomination}>
//                       <TableCell>
//                         <Typography fontWeight={600}>
//                           ₹ {formatDenomination(row.denomination)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell align="center">
//                         <TextField
//                           type="text"
//                           size="small"
//                           value={row.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(index, e.target.value)
//                           }
//                           placeholder="Enter Number"
//                           inputMode="numeric"
//                           inputProps={{
//                             inputMode: "numeric",
//                             pattern: "[0-9]*",
//                           }}
//                           onWheel={(e) => {
//                             e.currentTarget.blur();
//                           }}
//                           sx={{
//                             width: 150,
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell align="right">
//                         <TextField
//                           size="small"
//                           value={Number(row.amount || 0).toFixed(2)}
//                           InputProps={{
//                             readOnly: true,
//                           }}
//                           sx={{
//                             width: 160,
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 DENOMINATION TOTAL
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "flex",

//                 justifyContent: "flex-end",

//                 alignItems: "center",

//                 gap: 1,

//                 mt: 1.5,
//               }}
//             >
//               <Typography fontWeight={700} fontSize="14px">
//                 Denomination Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(
//                   showReconciliation ? savedDenominationTotal : total,
//                 ).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 160,
//                 }}
//               />
//             </Box>

//             {/* =================================================
//                 RECONCILIATION
//             ================================================= */}

//             {showReconciliation && (
//               <>
//                 <Divider
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                   }}
//                 />

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,

//                     border: "1px solid",

//                     borderColor: isCashMatched ? "success.main" : "error.main",

//                     borderRadius: 1,

//                     backgroundColor: isCashMatched ? "#f1fdf4" : "#fff5f5",
//                   }}
//                 >
//                   {/* =====================================================
//           CASH RECONCILIATION
//           Denomination Total VS Total Cash
//       ====================================================== */}

//                   <Typography
//                     fontWeight={700}
//                     fontSize="16px"
//                     sx={{
//                       mb: 2,
//                     }}
//                   >
//                     Cash Reconciliation
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "grid",

//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         sm: "repeat(3, 1fr)",
//                       },

//                       gap: 1.5,
//                     }}
//                   >
//                     {/* =================================================
//             TOTAL CASH
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Total Cash
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(salesSummary?.totalCash || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DENOMINATION TOTAL
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Denomination Total
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(savedDenominationTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DIFFERENCE
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: isCashMatched
//                           ? "success.light"
//                           : "error.light",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Difference
//                       </Typography>

//                      <Typography
//   fontWeight={700}
//   fontSize="17px"
//   color={isCashMatched ? "success.main" : "error.main"}
// >
//   ₹ {Number(cashDifference || 0).toFixed(2)}
// </Typography>
//                     </Box>
//                   </Box>

//                   {/* =====================================================
//           MATCH STATUS
//       ====================================================== */}

//                   <Typography
//                     sx={{
//                       mt: 2,

//                       fontWeight: 700,

//                       fontSize: "16px",

//                       color: isCashMatched ? "success.main" : "error.main",
//                     }}
//                   >
//                     {isCashMatched
//                       ? "✓ CASH TOTAL MATCHED"
//                       : "✗ CASH TOTAL MISMATCH"}
//                   </Typography>
//                 </Paper>
//               </>
//             )}
//           </DialogContent>

//           {/* ==================================================
//               ACTIONS
//           ================================================== */}

//           <DialogActions
//             sx={{
//               justifyContent: "flex-start",

//               px: 2,

//               py: 1.2,

//               gap: 1,
//             }}
//           >
//             <Button
//   variant="contained"
//   disabled={saving || saveCompleted}
//   onClick={handleSave}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",
//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving
//     ? "Saving..."
//     : saveCompleted
//     ? "Saved"
//     : "Save"}
// </Button>

//           <Button
//   variant="outlined"
//   disabled={saving}
//   onClick={handleCloseForm}
//   sx={{
//     textTransform: "none",
//     color: "var(--complementary-color)",
//     borderColor: "var(--complementary-color)",
//     "&:hover": {
//       borderColor: "var(--complementary-color)",
//     },
//   }}
// >
//   Close
// </Button>
//           </DialogActions>
//         </Dialog>


//         <Dialog
//   open={previewOpen}
//   onClose={handleClosePreview}
//   fullWidth
//   maxWidth="md"
// >
//   <DialogTitle>
//     Denomination Entry Preview
//   </DialogTitle>

//   <DialogContent dividers>
//     {previewEntry && (
//       <>
//         <Typography>
//           <b>Entry No:</b> {previewEntry.entryNo}
//         </Typography>

//         <Typography>
//           <b>Entry Date:</b> {previewEntry.entryDateText}
//         </Typography>

//         {isAdmin && (
//           <>
            
// <Typography>
//   <b>Sales Total Till Now:</b>{" "}
//   ₹ {Number(previewEntry.salesTotalTillNow ?? 0).toFixed(2)}
// </Typography>

// <Typography>
//   <b>Total Cash:</b>{" "}
//   ₹ {Number(previewEntry.totalCash ?? 0).toFixed(2)}
// </Typography>

// <Typography>
//   <b>Total Online:</b>{" "}
//   ₹ {Number(previewEntry.totalOnline ?? 0).toFixed(2)}
// </Typography>

// <Typography>
//   <b>Total Collection:</b>{" "}
//   ₹ {Number(previewEntry.totalCollection ?? 0).toFixed(2)}
// </Typography>

//           </>
//         )}

//         <Typography>
//           <b>Total Cash:</b>{" "}
//           ₹ {Number(previewEntry.totalCash || 0).toFixed(2)}
//         </Typography>

//         <Divider sx={{ my: 2 }} />

//         <Typography fontWeight={700} mb={1}>
//           Denominations
//         </Typography>

//         <TableContainer component={Paper} variant="outlined">
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Notes</TableCell>
//                 <TableCell align="right">Quantity</TableCell>
//                 <TableCell align="right">Amount</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {(previewEntry.denominations || []).map((item) => (
//                 <TableRow key={item.id ?? item.notes}>
//                   <TableCell>
//                     ₹ {formatDenomination(item.notes)}
//                   </TableCell>

//                   <TableCell align="right">
//                     {Number(item.numbers || 0)}
//                   </TableCell>

//                   <TableCell align="right">
//                     ₹ {Number(item.amount || 0).toFixed(2)}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Typography textAlign="right" fontWeight={700} mt={2}>
//           Denomination Total: ₹{" "}
//           {Number(previewEntry.total || 0).toFixed(2)}
//         </Typography>

//         <Typography mt={1} color="text.secondary" fontSize="13px">
//           Summary Cutoff: {previewEntry.summaryCutoffDateTime || "Not available"}
//         </Typography>
//       </>
//     )}
//   </DialogContent>

//   <DialogActions>
//     <Button onClick={handleClosePreview}>
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>

//       </Box>

//       {/* ==========================================================
//     DELETE CONFIRMATION DIALOG
// ========================================================== */}

 
//     </LocalizationProvider>
//   );
// };

// export default DenominationEntry;






























// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";

// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// // ============================================================
// // API URLS
// // ============================================================

// const POST_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

// const GET_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

// const UPDATE_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

// const DELETE_TABLE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

// const INVOICE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php";

// // ============================================================
// // DEFAULT BRANCH / USER
// // ============================================================

// const BRANCH_ID = 1;



// // ============================================================
// // COMPONENT
// // ============================================================

// const DenominationEntry = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================



// const currentCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const isAdmin = currentCreatedBy === 1;

//   const [entries, setEntries] = useState([]);
  

//   // ==========================================================
//   // FORM
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);




//   const [saveCompleted, setSaveCompleted] = useState(false);


//   const [previewOpen, setPreviewOpen] = useState(false);
// const [previewEntry, setPreviewEntry] = useState(null);

// const handlePreviewEntry = (entry) => {
//   setPreviewEntry(entry);
//   setPreviewOpen(true);
// };

// const handleClosePreview = () => {
//   setPreviewOpen(false);
//   setPreviewEntry(null);
// };

//   // ==========================================================
//   // SALES RECONCILIATION
//   // ==========================================================

// const [salesSummary, setSalesSummary] = useState({
//   regularCash: 0,
//   regularOnline: 0,

//   dealerCash: 0,
//   dealerOnline: 0,

//   catererCash: 0,
//   catererOnline: 0,

//   totalCash: 0,
//   totalOnline: 0,
//   totalCollection: 0,
//   salesTotalTillNow: 0,

//   summaryCutoffDateTime: "",
// });

//   const [showReconciliation, setShowReconciliation] = useState(false);

//   const [savedDenominationTotal, setSavedDenominationTotal] = useState(0);

//   const [cashDifference, setCashDifference] = useState(0);

//   const [isCashMatched, setIsCashMatched] = useState(false);

//   // ==========================================================
//   // ENTRY NUMBER
//   // ==========================================================

//   const [entryNo, setEntryNo] = useState("");

//   // ==========================================================
//   // ENTRY DATE
//   // ==========================================================

//   const [entryDate, setEntryDate] = useState(new Date());

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   // ==========================================================
//   // DENOMINATION MASTER
//   // ==========================================================

//   const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

//   // ==========================================================
//   // DENOMINATION ROWS
//   // ==========================================================

//   const [denominationRows, setDenominationRows] = useState([]);

//   // ==========================================================
//   // CREATE EMPTY ROWS
//   // ==========================================================

//   const createEmptyRows = () => {
//     return denominationValues.map((value) => ({
//       denomination: value,
//       quantity: "",
//       amount: 0,
//     }));
//   };

//   // ==========================================================
//   // FORMAT DENOMINATION
//   // ==========================================================

//   const formatDenomination = (value) => {
//     if (value === 0.5) {
//       return "0.50";
//     }

//     return String(value);
//   };

//   // ==========================================================
//   // FORMAT DATE FOR DISPLAY
//   // ==========================================================

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };



// // Format Summary Cutoff in Indian Standard Time
// const formatCutoffIST = (value) => {
//   if (!value) {
//     return "Not available";
//   }

//   const rawValue = String(value).trim();

//   // Database datetime without timezone is treated as IST.
//   const match = rawValue.match(
//     /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/
//   );

//   if (match) {
//     const [, year, month, day, hour, minute, second = "00"] = match;

//    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
//   }

//   // If the value includes a timezone, convert it to IST.
//   const parsedDate = new Date(rawValue);

//   if (Number.isNaN(parsedDate.getTime())) {
//     return "Not available";
//   }

//   return (
//     new Intl.DateTimeFormat("en-IN", {
//       timeZone: "Asia/Kolkata",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     }).format(parsedDate) + " IST"
//   );
// };



//   // ==========================================================
//   // FORMAT DATE FOR API
//   // ==========================================================

//   const formatApiDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const year = d.getFullYear();

//     const month = String(d.getMonth() + 1).padStart(2, "0");

//     const day = String(d.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   // ==========================================================
//   // CHECK SAME DATE
//   // ==========================================================

//   const isSameDate = (date1, date2) => {
//     if (!date1 || !date2) {
//       return false;
//     }

//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   // ==========================================================
//   // GET INVOICE DATE VALUE
//   // ==========================================================

//   const getInvoiceDateValue = (invoice) => {
//     const value = invoice?.InvoiceDate;

//     if (!value) {
//       return null;
//     }

//     // API sometimes returns:
//     // { date: "2026-09-30 18:30:00" }

//     if (typeof value === "object" && value?.date) {
//       return value.date;
//     }

//     return value;
//   };

//   // ==========================================================
//   // GET INVOICE DATETIME
//   // ==========================================================

//   const getInvoiceDateTime = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return null;
//     }

//     const dateObject = new Date(rawValue);

//     if (!isNaN(dateObject.getTime())) {
//       return dateObject;
//     }

//     return null;
//   };

//   // ==========================================================
//   // GET DATE ONLY FROM INVOICE
//   // ==========================================================

//   const getInvoiceDateOnly = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return "";
//     }

//     const stringValue = String(rawValue);

//     return stringValue.substring(0, 10);
//   };

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================


// const resetForm = () => {
//   setEntryNo("");
//   setEntryDate(new Date());
//   setEditingEntry(null);
//   setSaveCompleted(false);
//   setDenominationRows(createEmptyRows());

//   setSalesSummary({
//     regularCash: 0,
//     regularOnline: 0,
//     dealerCash: 0,
//     dealerOnline: 0,
//     catererCash: 0,
//     catererOnline: 0,
//     totalCash: 0,
//     totalOnline: 0,
//     totalCollection: 0,
//     salesTotalTillNow: 0,
//     summaryCutoffDateTime: "",
//   });

//   setSavedDenominationTotal(0);
//   setShowReconciliation(false);
//   setCashDifference(0);
//   setIsCashMatched(false);
// };


//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//      const createdBy = sessionStorage.getItem("CreatedBy") || "";

// const url =
//   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}` +
//   `&CreatedBy=${encodeURIComponent(createdBy)}`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Entry No API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const data = Array.isArray(result?.data) ? result.data : [];

//       if (data.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const entryNumbers = data
//         .map((item) => Number(item?.EntryNo))
//         .filter((value) => !Number.isNaN(value));

//       if (entryNumbers.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const maxEntryNo = Math.max(...entryNumbers);

//       setEntryNo(String(maxEntryNo + 1));
//     } catch (error) {
//       console.error("GENERATE ENTRY NO ERROR:", error);

//       setEntryNo("1");

//       toast.error("Unable to generate Entry No");
//     }
//   };

//   // ==========================================================
//   // FETCH SALES SUMMARY
//   //
//   // REQUIREMENT:
//   //
//   // Sales Entry
//   // + Sales Dealer
//   // + Sales Caterers
//   //
//   // selected date
//   // +
//   // till current time for today's date
//   //
//   // SUM invoice.Total
//   // ==========================================================

//   const fetchSalesSummary = async (selectedDate) => {
//     try {
//       if (!selectedDate) {
//         return;
//       }

//       const selectedDateString = formatApiDate(selectedDate);

//       const now = new Date();

//       console.log("====================================");

//       console.log("FETCH SALES SUMMARY");

//       console.log("SELECTED DATE:", selectedDateString);

//       console.log("CURRENT TIME:", now);

//       // ======================================================
//       // FETCH FIRST PAGE
//       // ======================================================

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const firstResponse = await fetch(
//         `${INVOICE_API}?Table=invoiceheader&PageNo=1`,
//         requestOptions,
//       );

//       if (!firstResponse.ok) {
//         throw new Error(`Sales API failed: ${firstResponse.status}`);
//       }

//       const firstResult = await firstResponse.json();

//       let allInvoices = [...(firstResult?.data || [])];

//       const totalPages = Number(firstResult?.total_pages || 1);

//       console.log("TOTAL INVOICE PAGES:", totalPages);

//       // ======================================================
//       // FETCH ALL REMAINING PAGES
//       // ======================================================

//       if (totalPages > 1) {
//         for (let page = 2; page <= totalPages; page++) {
//           try {
//             const response = await fetch(
//               `${INVOICE_API}?Table=invoiceheader&PageNo=${page}`,
//               requestOptions,
//             );

//             if (!response.ok) {
//               console.warn("Invoice page failed:", page);

//               continue;
//             }

//             const result = await response.json();

//             allInvoices = [...allInvoices, ...(result?.data || [])];
//           } catch (pageError) {
//             console.error("PAGE FETCH ERROR:", page, pageError);
//           }
//         }
//       }

//       console.log("TOTAL ALL INVOICES:", allInvoices.length);

//       // ======================================================
//       // FILTER SALES
//       //
//       // ALL INVOICEHEADER SALES ARE CONSIDERED:
//       //
//       // Sales Entry
//       // Dealer
//       // Caterers
//       //
//       // If your backend has other invoice types in
//       // invoiceheader, then SaleType filter can be added.
//       // ======================================================

//       const selectedInvoices = allInvoices.filter((invoice) => {
//         const invoiceDateOnly = getInvoiceDateOnly(invoice);

//         if (invoiceDateOnly !== selectedDateString) {
//           return false;
//         }

//         // ==================================================
//         // IF SELECTED DATE IS TODAY
//         // ONLY INCLUDE INVOICES TILL NOW
//         // ==================================================

//         if (isSameDate(selectedDate, now)) {
//           const invoiceDateTime = getInvoiceDateTime(invoice);

//           // If API contains proper time,
//           // compare with current time.
//           if (invoiceDateTime) {
//             return invoiceDateTime.getTime() <= now.getTime();
//           }

//           // If API has only date and no time,
//           // include today's invoice because
//           // backend has not provided invoice time.
//           return true;
//         }

//         // ==================================================
//         // PAST DATE
//         // ALL INVOICES OF THAT DATE
//         // ==================================================

//         return true;
//       });

//       console.log("SELECTED SALES INVOICES:", selectedInvoices);

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       let totalCash = 0;
//       let totalOnline = 0;
//       let salesTotalTillNow = 0;

//       selectedInvoices.forEach((invoice) => {
//         // ====================================================
//         // INVOICE TOTAL
//         // ====================================================

//         const invoiceTotal = Number(invoice?.Total || 0);

//         // ====================================================
//         // PAYMENT MODE
//         //
//         // C = Cash
//         // O = Online
//         // M = Mixed
//         // ====================================================

//         const paymentMode = String(invoice?.PaymentMode || "")
//           .trim()
//           .toUpperCase();

//         // ====================================================
//         // CASH AMOUNT
//         // ====================================================

//         const cashAmount = Number(invoice?.CashAmount || 0);

//         // ====================================================
//         // ONLINE AMOUNT
//         // ====================================================

//         const onlineAmount = Number(invoice?.OnlineAmount || 0);

//         // ====================================================
//         // SALES TOTAL
//         //
//         // Sales Entry
//         // + Dealer
//         // + Caterers
//         // ====================================================

//         salesTotalTillNow += invoiceTotal;

//         // ====================================================
//         // PAYMENT MODE WISE CALCULATION
//         // ====================================================

//         if (paymentMode === "C" || paymentMode === "CASH") {
//           // ----------------------------------------------
//           // CASH SALE
//           // ----------------------------------------------

//           totalCash += invoiceTotal;
//         } else if (paymentMode === "O" || paymentMode === "ONLINE") {
//           // ----------------------------------------------
//           // ONLINE SALE
//           // ----------------------------------------------

//           totalOnline += invoiceTotal;
//         } else if (paymentMode === "M" || paymentMode === "MIXED") {
//           // ----------------------------------------------
//           // MIXED PAYMENT
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         } else {
//           // ----------------------------------------------
//           // FALLBACK
//           //
        
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         }
//       });

//       // ======================================================
//       // ROUND VALUES
//       // ======================================================

//       salesTotalTillNow = Number(salesTotalTillNow.toFixed(2));

//       totalCash = Number(totalCash.toFixed(2));

//       totalOnline = Number(totalOnline.toFixed(2));

//       console.log("========== PAYMENT SUMMARY ==========");

//       console.table(
//         selectedInvoices.map((invoice) => ({
//           InvoiceNo: invoice?.InvoiceNo,
//           Total: Number(invoice?.Total || 0),
//           PaymentMode: invoice?.PaymentMode,
//           CashAmount: Number(invoice?.CashAmount || 0),
//           OnlineAmount: Number(invoice?.OnlineAmount || 0),
//         })),
//       );

//       console.log("FINAL SALES TOTAL:", salesTotalTillNow);

//       console.log("FINAL TOTAL CASH:", totalCash);

//       console.log("FINAL TOTAL ONLINE:", totalOnline);

//       console.log("CASH + ONLINE:", totalCash + totalOnline);

//       console.log("======================================");

//       const totalCollection = salesTotalTillNow;




      
//       const cutoffNow = new Date();
//       const pad = (value) => String(value).padStart(2, "0");

//       const summaryCutoffDateTime =
//         `${cutoffNow.getFullYear()}-${pad(cutoffNow.getMonth() + 1)}-${pad(cutoffNow.getDate())} ` +
//         `${pad(cutoffNow.getHours())}:${pad(cutoffNow.getMinutes())}:${pad(cutoffNow.getSeconds())}`;


//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

     
// setSalesSummary({
//   regularCash: 0,
//   regularOnline: 0,
//   dealerCash: 0,
//   dealerOnline: 0,
//   catererCash: 0,
//   catererOnline: 0,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   salesTotalTillNow,
//   summaryCutoffDateTime,
// });


//       console.log("====================================");

//       console.log(
//         "SALES TOTAL TILL NOW:",
//         Number(salesTotalTillNow || 0).toFixed(2),
//       );

//       console.log("TOTAL CASH:", Number(totalCash || 0).toFixed(2));

//       console.log("TOTAL ONLINE:", Number(totalOnline || 0).toFixed(2));

//       console.log("TOTAL COLLECTION:", Number(totalCollection || 0).toFixed(2));

//       console.log(
//         "CASH + ONLINE:",
//         (Number(totalCash || 0) + Number(totalOnline || 0)).toFixed(2),
//       );

//       console.log("SELECTED INVOICE COUNT:", selectedInvoices.length);

//       console.log("====================================");
//     } catch (error) {
//       console.error("FETCH SALES SUMMARY ERROR:", error);

//       toast.error("Unable to fetch Sales Summary");
//     }
//   };

//   // ==========================================================
//   // GET DENOMINATION DATA
//   // ==========================================================

// const fetchDenominationEntries = async () => {
//   try {
//     const currentCreatedBy = Number(
//       sessionStorage.getItem("CreatedBy") || 0
//     );

//     const isAdmin = currentCreatedBy === 1;

//     const params = new URLSearchParams({
//       Id: "",
//       BranchId: String(BRANCH_ID),
//     });

//     if (!isAdmin) {
//       params.set("CreatedBy", String(currentCreatedBy));
//     }

//     const url = `${GET_DENOMINATION_API}?${params.toString()}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(
//         `GET API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     if (!result.success) {
//       throw new Error(
//         result.message || "Unable to load denomination entries"
//       );
//     }

//     if (!Array.isArray(result.data)) {
//       setEntries([]);
//       setPageNo(1);
//       return;
//     }

//     const groupedEntries = {};

//     result.data.forEach((item) => {
//       const entryNo = String(item.EntryNo ?? "");
//       const branchId = String(item.BranchId ?? "");
//       const createdBy = String(item.CreatedBy ?? "");

//       const groupKey = `${branchId}_${createdBy}_${entryNo}`;

//       if (!groupedEntries[groupKey]) {
//         groupedEntries[groupKey] = {
//           id: item.Id,
//           apiId: item.Id,
//           branchId: item.BranchId,
//           entryNo: item.EntryNo,
//           entryDate: item.EntryDate,
//           entryDateText: formatDate(item.EntryDate),
//           total: 0,
//           denominations: [],
//           active: Number(item.Active || 0),
//           createdBy: item.CreatedBy,
//           updatedBy: item.UpdatedBy,
//           updatedCount: item.UpdatedCount,
//           salesTotalTillNow: Number(item.SalesTotalTillNow || 0),
//           totalCash: Number(item.TotalCash || 0),
//           totalOnline: Number(item.TotalOnline || 0),
//           totalCollection: Number(item.TotalCollection || 0),
//           summaryCutoffDateTime:
//             item.SummaryCutoffDateTime || "",
//         };
//       }

//       const amount = Number(item.Amount || 0);

//       groupedEntries[groupKey].total += amount;

//       groupedEntries[groupKey].denominations.push({
//         id: item.Id,
//         notes: Number(item.Notes || 0),
//         numbers: Number(item.Numbers || 0),
//         amount,
//       });
//     });

//     const formattedEntries = Object.values(groupedEntries);

//     formattedEntries.sort((a, b) => {
//       const dateA = a.entryDate
//         ? new Date(a.entryDate).getTime()
//         : 0;

//       const dateB = b.entryDate
//         ? new Date(b.entryDate).getTime()
//         : 0;

//       if (dateA !== dateB) {
//         return dateB - dateA;
//       }

//       return Number(b.entryNo || 0) - Number(a.entryNo || 0);
//     });

//     console.log(
//       "DENOMINATION ENTRIES - LATEST FIRST:",
//       formattedEntries
//     );

//     setEntries(formattedEntries);

//     const calculatedPages = Math.ceil(
//       formattedEntries.length / 10
//     );

//     if (calculatedPages === 0) {
//       setPageNo(1);
//     } else {
//       setPageNo((previousPage) =>
//         previousPage > calculatedPages
//           ? calculatedPages
//           : previousPage
//       );
//     }
//   } catch (error) {
//     console.error("GET DENOMINATION ERROR:", error);

//     toast.error("Unable to load Denomination Entries");
//   }
// };

//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {
//     setDenominationRows(createEmptyRows());

//     fetchDenominationEntries();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = async () => {
//     resetForm();

//     const today = new Date();

//     setEntryDate(today);

//     setOpenForm(true);

//     // Fetch current sales total
//     await fetchSalesSummary(today);

//     // Generate entry no
//     await generateNextEntryNo();
//   };

//   // ==========================================================
//   // CLOSE FORM
//   // ==========================================================

//   const handleCloseForm = () => {
//     if (saving) {
//       return;
//     }

//     setOpenForm(false);

//     resetForm();
//   };

//   // ==========================================================
//   // EDIT DENOMINATION ENTRY
//   // ==========================================================

 


// const handleEditEntry = async (entry) => {
//   try {
//     // 1. Validate selected entry
//     if (!entry) {
//       toast.error("Denomination entry not found");
//       return;
//     }

//     setSaveCompleted(false);
//     setEditingEntry(entry);

//     // 2. Restore Entry Number
//     setEntryNo(String(entry.entryNo ?? ""));

//     // 3. Restore Entry Date without timezone conversion
//     const rawDate = String(entry.entryDate ?? "");
//     const datePart = rawDate.substring(0, 10);

//     let validEditDate;

//     if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
//       const [year, month, day] = datePart
//         .split("-")
//         .map(Number);

//       validEditDate = new Date(year, month - 1, day);
//     } else {
//       validEditDate = new Date(
//         entry.entryDate || Date.now()
//       );
//     }

//     if (Number.isNaN(validEditDate.getTime())) {
//       toast.error("Invalid denomination entry date");
//       return;
//     }

//     setEntryDate(validEditDate);

//     // 4. Restore existing denomination rows
//     const emptyRows = createEmptyRows();

//     const existingDenominations = Array.isArray(
//       entry.denominations
//     )
//       ? entry.denominations
//       : [];

//     const editRows = emptyRows.map((row) => {
//       const existing = existingDenominations.find(
//         (item) =>
//           Number(item.notes) === Number(row.denomination)
//       );

//       if (!existing) {
//         return {
//           ...row,
//           id: null,
//           quantity: "",
//           amount: 0,
//         };
//       }

//       const quantity = Number(existing.numbers ?? 0);

//       return {
//         ...row,
//         id: existing.id ?? existing.Id ?? null,
//         quantity: quantity > 0 ? String(quantity) : "",
//         amount: Number(existing.amount ?? 0),
//       };
//     });

//     setDenominationRows(editRows);

//     // 5. Restore saved Summary values
//     const savedSummary = {
//       totalCash: Number(entry.totalCash ?? 0),
//       totalOnline: Number(entry.totalOnline ?? 0),
//       totalCollection: Number(entry.totalCollection ?? 0),
//       salesTotalTillNow: Number(
//         entry.salesTotalTillNow ?? 0
//       ),
//       summaryCutoffDateTime:
//         entry.summaryCutoffDateTime ?? "",
//     };

//     const hasSavedSummary =
//       savedSummary.totalCash !== 0 ||
//       savedSummary.totalOnline !== 0 ||
//       savedSummary.totalCollection !== 0 ||
//       savedSummary.salesTotalTillNow !== 0;

//     console.log("EDIT ENTRY:", entry);
//     console.log("EDIT ENTRY DATE:", datePart);
//     console.log("SAVED SUMMARY:", savedSummary);
//     console.log("HAS SAVED SUMMARY:", hasSavedSummary);

//     // 6. Restore saved Summary or fetch it if unavailable
//     if (hasSavedSummary) {
//       setSalesSummary((previous) => ({
//         ...previous,
//         ...savedSummary,
//       }));
//     } else {
//       await fetchSalesSummary(validEditDate);
//     }

//     // 7. Reset reconciliation state
//     setShowReconciliation(false);
//     setCashDifference(0);
//     setIsCashMatched(false);
//     setSavedDenominationTotal(0);

//     // 8. Open Edit form
//     setOpenForm(true);
//   } catch (error) {
//     console.error("EDIT DENOMINATION ERROR:", error);

//     toast.error(
//       error?.message ||
//         "Unable to open denomination entry for edit"
//     );
//   }
// };





//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (index, value) => {
//     // Empty
//     if (value === "") {
//       setDenominationRows((previousRows) =>
//         previousRows.map((row, rowIndex) => {
//           if (rowIndex === index) {
//             return {
//               ...row,
//               quantity: "",
//               amount: 0,
//             };
//           }

//           return row;
//         }),
//       );

//       return;
//     }

//     // Only integer
//     if (!/^\d+$/.test(value)) {
//       return;
//     }

//     const quantity = Number(value);

//     setDenominationRows((previousRows) =>
//       previousRows.map((row, rowIndex) => {
//         if (rowIndex === index) {
//           const amount = row.denomination * quantity;

//           return {
//             ...row,
//             quantity: value,
//             amount,
//           };
//         }

//         return row;
//       }),
//     );
//   };

//   // ==========================================================
//   // TOTAL DENOMINATION
//   // ==========================================================

//   const total = useMemo(() => {
//     return denominationRows.reduce(
//       (sum, row) => sum + Number(row.amount || 0),
//       0,
//     );
//   }, [denominationRows]);

//   // ==========================================================
//   // UPDATE DENOMINATION API
//   // ==========================================================

//   const updateDenomination = async ({
//     id,
//     branchId,
//     date,
//     notes,
//     numbers,
//     amount,
//     updatedBy,
//   }) => {
//     const formData = new FormData();

//     formData.append("Id", String(id));

//     formData.append("BranchId", String(branchId || BRANCH_ID));

//     formData.append("EntryDate", formatApiDate(date));

//     formData.append("Notes", String(Number(notes || 0)));

//     formData.append("Numbers", String(Number(numbers || 0)));

//     formData.append("Amount", Number(amount || 0).toFixed(2));

//     formData.append("UpdatedBy", String(updatedBy || ""));

//     const response = await fetch(UPDATE_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Unable to update denomination");
//     }

//     return result;
//   };

//   // ==========================================================
//   // CREATE DENOMINATION API
//   // ==========================================================

  



// const createDenomination = async ({
//   entryNo,
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId,
//   createdBy,
//   userId,
//   saleRole,
//   drawerId,
//   salesTotalTillNow,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   summaryCutoffDateTime,
// }) => {
//   try {
//     // ========================================
//     // 1. PREPARE AND VALIDATE VALUES
//     // ========================================
//     const resolvedBranchId = Number(branchId || BRANCH_ID);
//     const resolvedCreatedBy = Number(createdBy);
//     const notes = Number(denomination);
//     const numbers = Number(quantity);

//     const totalAmount =
//       amount !== undefined && amount !== null && amount !== ""
//         ? Number(amount)
//         : notes * numbers;

//     if (!Number.isFinite(resolvedBranchId) || resolvedBranchId <= 0) {
//       throw new Error("Please provide a valid BranchId.");
//     }

//     if (!Number.isFinite(resolvedCreatedBy) || resolvedCreatedBy <= 0) {
//       throw new Error("Please provide a valid CreatedBy.");
//     }

//     if (!Number.isFinite(notes) || notes <= 0) {
//       throw new Error("Please provide a valid denomination Notes value.");
//     }

//     if (!Number.isFinite(numbers) || numbers <= 0) {
//       throw new Error("Please provide a valid denomination quantity.");
//     }

//     if (!Number.isFinite(totalAmount) || totalAmount < 0) {
//       throw new Error("Please provide a valid denomination Amount.");
//     }

//     if (!entryDate) {
//       throw new Error("Please select Entry Date.");
//     }

//     // ========================================
//     // 2. FORMAT ENTRY DATE
//     // ========================================
//     const formattedEntryDate = formatApiDate(entryDate);

//     if (!formattedEntryDate) {
//       throw new Error("Invalid Entry Date.");
//     }

//     // ========================================
//     // 3. CREATE FORMDATA
//     // ========================================
//     const formData = new FormData();

//     formData.append("BranchId", String(resolvedBranchId));
//     formData.append("EntryDate", String(formattedEntryDate));
//     formData.append("Notes", String(notes));
//     formData.append("Numbers", String(numbers));
//     formData.append("Amount", totalAmount.toFixed(2));
//     formData.append("CreatedBy", String(resolvedCreatedBy));

//     formData.append("UserId", String(userId ?? ""));
//     formData.append("SaleRole", String(saleRole ?? ""));
//     formData.append("DrawerId", String(drawerId ?? ""));
//     formData.append("EntryNo", String(entryNo ?? "").trim());

//     formData.append(
//       "SalesTotalTillNow",
//       String(Number(salesTotalTillNow ?? 0))
//     );

//     formData.append("TotalCash", String(Number(totalCash ?? 0)));
//     formData.append("TotalOnline", String(Number(totalOnline ?? 0)));

//     formData.append(
//       "TotalCollection",
//       String(Number(totalCollection ?? 0))
//     );

//     formData.append(
//       "SummaryCutoffDateTime",
//       String(summaryCutoffDateTime ?? "")
//     );

//     // ========================================
//     // 4. LOG ACTUAL FORMDATA VALUES
//     // ========================================
//     const payloadForLog = {};

//     for (const [key, value] of formData.entries()) {
//       payloadForLog[key] = value;
//     }

//     console.log("========== DENOMINATION API REQUEST ==========");
//     console.log("API URL:", POST_DENOMINATION_API);
//     console.log("FORMDATA PAYLOAD:", payloadForLog);

//     // ========================================
//     // 5. CALL POST API
//     // ========================================
//     const response = await fetch(POST_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     // ========================================
//     // 6. READ API RESPONSE
//     // ========================================
//     const responseText = await response.text();

//     console.log("DENOMINATION HTTP STATUS:", response.status);
//     console.log("DENOMINATION RAW RESPONSE:", responseText);

//     let result;

//     try {
//       result = JSON.parse(responseText);
//     } catch {
//       throw new Error(
//         `The API returned an invalid JSON response. HTTP ${response.status}. ` +
//           `Response: ${responseText.slice(0, 300)}`
//       );
//     }

//     // ========================================
//     // 7. CHECK HTTP AND API SUCCESS
//     // ========================================
//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           `Denomination API failed. HTTP ${response.status}.`
//       );
//     }

//     // Support common API response formats.
//     const apiSuccess =
//       result.success === true ||
//       result.success === 1 ||
//       result.success === "true" ||
//       result.status === "success";

//     if (!apiSuccess) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           "The API did not confirm that the denomination was saved."
//       );
//     }

//     console.log("DENOMINATION SAVED SUCCESSFULLY:", result);

//     return result;
//   } catch (error) {
//     console.error("CREATE DENOMINATION ERROR:", error);
//     throw error;
//   }
// };



//   // ==========================================================
//   // SAVE
//   //
//   // IMPORTANT:
//   // VALIDATION HAPPENS BEFORE POST API
//   // ==========================================================

//   // ==========================================================
//   // SAVE / UPDATE DENOMINATION
//   // ==========================================================




// const handleSave = async () => {
//   if (saving) {
//     return;
//   }

//   if (!entryNo || !entryNo.trim()) {
//     toast.error("Please enter Entry No");
//     return;
//   }

//   if (!entryDate || isNaN(new Date(entryDate).getTime())) {
//     toast.error("Please select a valid Entry Date");
//     return;
//   }

//   const rowsToSave = denominationRows.filter(
//     (row) => Number(row.quantity || 0) > 0
//   );

//   if (rowsToSave.length === 0) {
//     toast.error("Please enter at least one denomination quantity");
//     return;
//   }

//   const loggedInUserId =
//     sessionStorage.getItem("UserId") ||
//     sessionStorage.getItem("LoginUserId") ||
//     "";

//   const loggedInSaleRole =
//     sessionStorage.getItem("UserRole") || "";

//   const currentCreatedBy = Number(
//     sessionStorage.getItem("CreatedBy") || 0
//   );

//   const drawerId =
//     sessionStorage.getItem("Device") || "";

//   if (
//     !loggedInUserId ||
//     !loggedInSaleRole ||
//     !currentCreatedBy
//   ) {
//     toast.error(
//       "Login details are incomplete. Please login again."
//     );
//     return;
//   }

//   try {
//     setSaving(true);

//     const userDetails = {
//       userId: loggedInUserId,
//       saleRole: loggedInSaleRole,
//       drawerId,
//     };

//     const denominationTotal = Number(
//       rowsToSave
//         .reduce((sum, row) => {
//           const denomination = Number(row.denomination || 0);
//           const quantity = Number(row.quantity || 0);

//           return sum + denomination * quantity;
//         }, 0)
//         .toFixed(2)
//     );

//     // Read the current sales summary
//     const salesTotalTillNow = Number(
//       salesSummary?.salesTotalTillNow ?? 0
//     );

//     const cashTotal = Number(
//       salesSummary?.totalCash ?? 0
//     );

//     const onlineTotal = Number(
//       salesSummary?.totalOnline ?? 0
//     );

//     const totalCollection = Number(
//       salesSummary?.totalCollection ?? 0
//     );

//     const summaryCutoffDateTime =
//       salesSummary?.summaryCutoffDateTime || "";

//     // Debug the values before saving
//     console.log("SALES SUMMARY BEFORE SAVE:", salesSummary);

//     console.log("SUMMARY VALUES SENT:", {
//       SalesTotalTillNow: salesTotalTillNow,
//       TotalCash: cashTotal,
//       TotalOnline: onlineTotal,
//       TotalCollection: totalCollection,
//       SummaryCutoffDateTime: summaryCutoffDateTime,
//       CreatedBy: currentCreatedBy,
//     });

//     // Stop saving if the summary is not loaded
//     if (
//       salesTotalTillNow === 0 &&
//       cashTotal === 0 &&
//       onlineTotal === 0 &&
//       totalCollection === 0
//     ) {
//       toast.error(
//         "Sales summary is zero. Please refresh the sales summary before saving."
//       );
//       return;
//     }

//     const difference = Number(
//       (denominationTotal - cashTotal).toFixed(2)
//     );

//     const matched = Math.abs(difference) < 0.01;

//     setSavedDenominationTotal(denominationTotal);
//     setCashDifference(difference);
//     setIsCashMatched(matched);
//     setShowReconciliation(true);

//     const snapshotData = {
//       salesTotalTillNow,
//       totalCash: cashTotal,
//       totalOnline: onlineTotal,
//       totalCollection,
//       summaryCutoffDateTime,
//     };

//     const createEntry = async (row) => {
//       const denomination = Number(row.denomination || 0);
//       const quantity = Number(row.quantity || 0);

//       const amount = Number(
//         (denomination * quantity).toFixed(2)
//       );

//       await createDenomination({
//         entryNo: entryNo.trim(),
//         entryDate,
//         denomination,
//         quantity,
//         amount,
//         branchId: BRANCH_ID,
//         createdBy: currentCreatedBy,
//         ...userDetails,
//         ...snapshotData,
//       });
//     };

//     if (editingEntry) {
//       for (const row of denominationRows) {
//         const denomination = Number(row.denomination || 0);
//         const quantity = Number(row.quantity || 0);

//         const amount = Number(
//           (denomination * quantity).toFixed(2)
//         );

//         if (row.id) {
//           if (quantity <= 0) {
//             continue;
//           }

//           await updateDenomination({
//             id: row.id,
//             branchId: BRANCH_ID,
//             date: entryDate,
//             notes: denomination,
//             numbers: quantity,
//             amount,
//             updatedBy: currentCreatedBy,
//             ...userDetails,
//           });
//         } else if (quantity > 0) {
//           await createEntry(row);
//         }
//       }

//       toast.success(
//         "Denomination Entry updated successfully!"
//       );
//     } else {
//       for (const row of rowsToSave) {
//         await createEntry(row);
//       }

//       toast.success(
//         "Denomination Entry saved successfully!"
//       );
//     }

//     await fetchDenominationEntries();

//     setSaveCompleted(true);
//     setEditingEntry(null);
//   } catch (error) {
//     console.error("Denomination Save Error:", error);

//     toast.error(
//       error?.message || "Unable to save Denomination Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };






//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

 
// const pageSize = 10;

// const totalPages = Math.ceil(entries.length / pageSize);

// const paginatedEntries = entries.slice(
//   (pageNo - 1) * pageSize,
//   pageNo * pageSize
// );


//   // ==========================================================
//   // TABLE COLUMNS
//   // ==========================================================

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "srNo",

//         header: "Sr.No",

//         size: 80,

//         Cell: ({ row }) => {
//           const index = entries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "entryNo",

//         header: "Entry No",

//         size: 150,
//       },

//       {
//         accessorKey: "entryDateText",

//         header: "Entry Date",

//         size: 160,
//       },

//       {
//         accessorKey: "total",

//         header: "Total",

//         size: 150,

//         Cell: ({ cell }) => (
//           <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
//         ),
//       },

//       {
//         header: "Actions",

//         size: 180,

//         enableSorting: false,

//         enableColumnFilter: false,

//       Cell: ({ row }) => (
//   <Box
//     display="flex"
//     justifyContent="center"
//     alignItems="center"
//     gap={1}
//   >
//     {/* ================= PREVIEW ================= */}
//     <Tooltip title="Preview">
//       <IconButton
//         color="info"
//         size="small"
//         onClick={() => handlePreviewEntry(row.original)}
//       >
//         <VisibilityIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>

//     {/* ================= EDIT ================= */}
//     <Tooltip title="Edit">
//       <IconButton
//         color="primary"
//         size="small"
//         onClick={() => handleEditEntry(row.original)}
//       >
//         <EditIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>
//   </Box>
// ),
//       },
//     ],
//     [entries, handleEditEntry, handlePreviewEntry]
//   );
//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{
//           width: "100%",
//           minHeight: "100%",
//           p: 5,
//           boxSizing: "border-box",

//           "@media (max-width: 768px)": {
//             p: 2,
//           },
//         }}
//       >
//         {/* ==================================================
//             PAGE TITLE
//         ================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Denomination Entry</b>
//           </Typography>
//         </Box>

//         {/* ==================================================
//             CREATE BUTTON
//         ================================================== */}

//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },

//               borderRadius: "5px 5px 0 0",

//               textTransform: "uppercase",

//               fontSize: "16px",

//               fontWeight: 500,

//               px: 2.5,

//               py: 1.5,
//             }}
//             variant="contained"
//             onClick={handleOpenForm}
//           >
//             CREATE DENOMINATION ENTRY
//           </Button>
//         </Box>

//         {/* ==================================================
//             MAIN TABLE
//         ================================================== */}

//         <MaterialReactTable
//   columns={columns}
//   data={paginatedEntries}
//   enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",

//               color: "black",

//               fontSize: "16px",

//               fontWeight: "bold",
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               fontSize: "15px",
//             },
//           }}
//           muiTablePaperProps={{
//             elevation: 2,

//             sx: {
//               borderRadius: "0 4px 4px 4px",

//               overflow: "hidden",

//               boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//             },
//           }}
//           muiTableContainerProps={{
//             sx: {
//               maxHeight: "none",
//             },
//           }}
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               mb={1}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//               pr={2}
//               gap={0.5}
//             >
//               <FirstPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(1);
//                   }
//                 }}
//               />

//               <KeyboardArrowLeftIcon
//                 sx={{
//                   cursor: pageNo > 1 ? "pointer" : "default",

//                   color: pageNo > 1 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                 }}
//               />

//               <Box ml={1}>Page No</Box>

//               <TextField
//                 sx={{
//                   width: "65px",

//                   ml: 1,

//                   "& .MuiInputBase-input": {
//                     textAlign: "center",

//                     padding: "8px 5px",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);

//                   if (value < 1 || isNaN(value)) {
//                     value = 1;
//                   }

//                   if (totalPages > 0 && value > totalPages) {
//                     value = totalPages;
//                   }

//                   setPageNo(value);
//                 }}
//                 size="small"
//               />

//               <KeyboardArrowRightIcon
//                 sx={{
//                   cursor: pageNo < totalPages ? "pointer" : "default",

//                   color: pageNo < totalPages ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (pageNo < totalPages) {
//                     setPageNo((prev) => Number(prev) + 1);
//                   }
//                 }}
//               />

//               <LastPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(totalPages);
//                   }
//                 }}
//               />

//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
//         />

//         {/* ==================================================
//             DENOMINATION FORM
//         ================================================== */}

//         <Dialog
//           open={openForm}
//           onClose={handleCloseForm}
//           fullWidth
//           maxWidth="md"
//           PaperProps={{
//             sx: {
//               borderRadius: "6px",
//               maxHeight: "90vh",
//             },
//           }}
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <DialogTitle
//             sx={{
//               backgroundColor: "rgb(236, 253, 230)",

//               display: "flex",

//               justifyContent: "space-between",

//               alignItems: "center",

//               borderBottom: "1px solid #ddd",

//               py: 1.2,

//               px: 2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 700,

//                 color: "#0B5E20",

//                 fontSize: "18px",
//               }}
//             >
//               Denomination Entry
//             </Typography>

//             <IconButton
//               onClick={handleCloseForm}
//               disabled={saving}
//               size="small"
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           {/* ==================================================
//               CONTENT
//           ================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#fff",

//               p: {
//                 xs: 1.5,
//                 sm: 2,
//               },
//             }}
//           >
//             {/* =================================================
//                 ENTRY NO + DATE
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "1fr 1fr",
//                 },

//                 gap: 2,

//                 mt: 0.5,

//                 mb: 2,
//               }}
//             >
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry No:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   value={entryNo}
//                   onChange={(e) => setEntryNo(e.target.value)}
//                   placeholder="Enter Entry No"
//                   fullWidth
//                 />
//               </Box>

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry Date:
//                 </Typography>

//               <DatePicker
//   value={entryDate}
//   onChange={(newValue) => {
//     setEntryDate(newValue);

//     if (newValue && !editingEntry) {
//       fetchSalesSummary(newValue);
//     }
//   }}
//   format="dd-MM-yyyy"
//   slotProps={{
//     textField: {
//       size: "small",
//       fullWidth: true,
//     },
//   }}
// />
//               </Box>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 SALES SUMMARY
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Sales Summary:
//             </Typography>

          

// <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
//     },
//     gap: 1.5,
//     mb: 2,
//   }}
// >
//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "2px solid #0B5E20",
//         borderRadius: 1,
//         backgroundColor: "#f1fdf4",
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Sales Total Till Now
//       </Typography>

//       <Typography
//         fontSize="18px"
//         fontWeight={700}
//         color="#0B5E20"
//       >
//         ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Cash
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCash || 0).toFixed(2)}
//     </Typography>
//   </Paper>

//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "1px solid #d0d0d0",
//         borderRadius: 1,
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Total Online
//       </Typography>

//       <Typography fontSize="18px" fontWeight={700}>
//         ₹ {Number(salesSummary.totalOnline || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Collection
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCollection || 0).toFixed(2)}
//     </Typography>
//   </Paper>
// </Box>



//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 DENOMINATION TITLE
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Denominations:
//             </Typography>

//             {/* =================================================
//                 DENOMINATION TABLE
//             ================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 border: "1px solid #d0d0d0",

//                 overflowX: "auto",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   minWidth: 600,

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",

//                     py: 0.8,

//                     px: 1,

//                     fontSize: "13px",
//                   },
//                 }}
//               >
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Notes
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Number / Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {denominationRows.map((row, index) => (
//                     <TableRow hover key={row.denomination}>
//                       <TableCell>
//                         <Typography fontWeight={600}>
//                           ₹ {formatDenomination(row.denomination)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell align="center">
//                         <TextField
//                           type="text"
//                           size="small"
//                           value={row.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(index, e.target.value)
//                           }
//                           placeholder="Enter Number"
//                           inputMode="numeric"
//                           inputProps={{
//                             inputMode: "numeric",
//                             pattern: "[0-9]*",
//                           }}
//                           onWheel={(e) => {
//                             e.currentTarget.blur();
//                           }}
//                           sx={{
//                             width: 150,
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell align="right">
//                         <TextField
//                           size="small"
//                           value={Number(row.amount || 0).toFixed(2)}
//                           InputProps={{
//                             readOnly: true,
//                           }}
//                           sx={{
//                             width: 160,
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 DENOMINATION TOTAL
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "flex",

//                 justifyContent: "flex-end",

//                 alignItems: "center",

//                 gap: 1,

//                 mt: 1.5,
//               }}
//             >
//               <Typography fontWeight={700} fontSize="14px">
//                 Denomination Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(
//                   showReconciliation ? savedDenominationTotal : total,
//                 ).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 160,
//                 }}
//               />
//             </Box>

//             {/* =================================================
//                 RECONCILIATION
//             ================================================= */}

//             {showReconciliation && (
//               <>
//                 <Divider
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                   }}
//                 />

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,

//                     border: "1px solid",

//                     borderColor: isCashMatched ? "success.main" : "error.main",

//                     borderRadius: 1,

//                     backgroundColor: isCashMatched ? "#f1fdf4" : "#fff5f5",
//                   }}
//                 >
//                   {/* =====================================================
//           CASH RECONCILIATION
//           Denomination Total VS Total Cash
//       ====================================================== */}

//                   <Typography
//                     fontWeight={700}
//                     fontSize="16px"
//                     sx={{
//                       mb: 2,
//                     }}
//                   >
//                     Cash Reconciliation
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "grid",

//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         sm: "repeat(3, 1fr)",
//                       },

//                       gap: 1.5,
//                     }}
//                   >
//                     {/* =================================================
//             TOTAL CASH
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Total Cash
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(salesSummary?.totalCash || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DENOMINATION TOTAL
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Denomination Total
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(savedDenominationTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DIFFERENCE
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: isCashMatched
//                           ? "success.light"
//                           : "error.light",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Difference
//                       </Typography>

//                      <Typography
//   fontWeight={700}
//   fontSize="17px"
//   color={isCashMatched ? "success.main" : "error.main"}
// >
//   ₹ {Number(cashDifference || 0).toFixed(2)}
// </Typography>
//                     </Box>
//                   </Box>

//                   {/* =====================================================
//           MATCH STATUS
//       ====================================================== */}

//                   <Typography
//                     sx={{
//                       mt: 2,

//                       fontWeight: 700,

//                       fontSize: "16px",

//                       color: isCashMatched ? "success.main" : "error.main",
//                     }}
//                   >
//                     {isCashMatched
//                       ? "✓ CASH TOTAL MATCHED"
//                       : "✗ CASH TOTAL MISMATCH"}
//                   </Typography>
//                 </Paper>
//               </>
//             )}
//           </DialogContent>

//           {/* ==================================================
//               ACTIONS
//           ================================================== */}

//           <DialogActions
//             sx={{
//               justifyContent: "flex-start",

//               px: 2,

//               py: 1.2,

//               gap: 1,
//             }}
//           >
//             <Button
//   variant="contained"
//   disabled={saving || saveCompleted}
//   onClick={handleSave}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",
//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving
//     ? "Saving..."
//     : saveCompleted
//     ? "Saved"
//     : "Save"}
// </Button>

//           <Button
//   variant="outlined"
//   disabled={saving}
//   onClick={handleCloseForm}
//   sx={{
//     textTransform: "none",
//     color: "var(--complementary-color)",
//     borderColor: "var(--complementary-color)",
//     "&:hover": {
//       borderColor: "var(--complementary-color)",
//     },
//   }}
// >
//   Close
// </Button>
//           </DialogActions>
//         </Dialog>


 
// <Dialog
//   open={previewOpen}
//   onClose={handleClosePreview}
//   fullWidth
//   maxWidth="md"
//   PaperProps={{
//     sx: {
//       borderRadius: 3,
//       overflow: "hidden",
//       boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
//       m: 2,
//     },
//   }}
// >
//   {/* Header */}
//   <DialogTitle
//     sx={{
//       background: "linear-gradient(135deg, #0B5E20, #238443)",
//       color: "#fff",
//       px: 3,
//       py: 2.2,
//     }}
//   >
//     <Box display="flex" alignItems="center" gap={1.5}>
//       <VisibilityIcon />

//       <Box>
//         <Typography fontSize="21px" fontWeight={700}>
//           Denomination Entry Preview
//         </Typography>

//         <Typography fontSize="12px" sx={{ opacity: 0.9 }}>
//           Entry details and sales summary
//         </Typography>
//       </Box>
//     </Box>
//   </DialogTitle>

//   <DialogContent
//     dividers
//     sx={{
//       p: { xs: 2, sm: 3 },
//       backgroundColor: "#F7F9FC",
//     }}
//   >
//     {previewEntry && (
//       <>
//         {/* Entry Details */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 2,
//             mb: 2.5,
//             border: "1px solid #E0E6ED",
//             borderRadius: 2,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "1fr 1fr",
//               },
//               gap: 2,
//             }}
//           >
//             <Box>
//               <Typography fontSize="12px" color="text.secondary">
//                 ENTRY NUMBER
//               </Typography>

//               <Typography fontSize="18px" fontWeight={700}>
//                 #{previewEntry.entryNo}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography fontSize="12px" color="text.secondary">
//                 ENTRY DATE
//               </Typography>

//               <Typography fontSize="18px" fontWeight={700}>
//                 {previewEntry.entryDateText}
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Summary Cards */}
        
// {/* Summary Cards */}
// <Typography fontSize="16px" fontWeight={700} mb={1.5}>
//   Sales Summary
// </Typography>

// <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: isAdmin
//         ? "repeat(2, minmax(0, 1fr))"
//         : "repeat(2, minmax(0, 1fr))",
//     },
//     gap: 1.5,
//     mb: 3,
//   }}
// >
//   {(isAdmin
//     ? [
//         {
//           label: "Sales Total Till Now",
//           value: previewEntry.salesTotalTillNow,
//           color: "#245BC5",
//           background: "#EAF2FF",
//         },
//         {
//           label: "Total Cash",
//           value: previewEntry.totalCash,
//           color: "#17834A",
//           background: "#E8F7EF",
//         },
//         {
//           label: "Total Online",
//           value: previewEntry.totalOnline,
//           color: "#7041C5",
//           background: "#F1EBFF",
//         },
//         {
//           label: "Total Collection",
//           value: previewEntry.totalCollection,
//           color: "#B66A12",
//           background: "#FFF2E2",
//         },
//       ]
//     : [
//         {
//           label: "Total Cash",
//           value: previewEntry.totalCash,
//           color: "#17834A",
//           background: "#E8F7EF",
//         },
//         {
//           label: "Total Collection",
//           value: previewEntry.totalCollection,
//           color: "#B66A12",
//           background: "#FFF2E2",
//         },
//       ]
//   ).map((item) => (
//     <Paper
//       key={item.label}
//       elevation={0}
//       sx={{
//         p: 2,
//         borderRadius: 2,
//         border: `1px solid ${item.color}35`,
//         backgroundColor: item.background,
//       }}
//     >
//       <Typography
//         fontSize="13px"
//         fontWeight={600}
//         sx={{ color: item.color, mb: 0.7 }}
//       >
//         {item.label}
//       </Typography>

//       <Typography
//         fontSize={{ xs: "19px", sm: "22px" }}
//         fontWeight={800}
//         sx={{
//           color: item.color,
//           overflowWrap: "anywhere",
//         }}
//       >
//         ₹ {Number(item.value ?? 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   ))}
// </Box>


//         {/* Denominations */}
//         <Paper
//           elevation={0}
//           sx={{
//             border: "1px solid #E0E6ED",
//             borderRadius: 2,
//             overflow: "hidden",
//             backgroundColor: "#fff",
//           }}
//         >
//           <Box sx={{ px: 2, py: 1.7 }}>
//             <Typography fontSize="16px" fontWeight={700}>
//               Denominations
//             </Typography>

//             <Typography fontSize="12px" color="text.secondary">
//               Note-wise quantity and amount
//             </Typography>
//           </Box>

//           <Divider />

//           <TableContainer sx={{ maxHeight: 320 }}>
//             <Table
//               size="small"
//               stickyHeader
//               sx={{
//                 minWidth: 400,
//                 "& .MuiTableCell-root": {
//                   py: 1.3,
//                   px: 2,
//                   borderBottom: "1px solid #EDF0F4",
//                 },
//               }}
//             >
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       backgroundColor: "#EDF3F8",
//                       fontWeight: 700,
//                     }}
//                   >
//                     Notes
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       backgroundColor: "#EDF3F8",
//                       fontWeight: 700,
//                     }}
//                   >
//                     Quantity
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       backgroundColor: "#EDF3F8",
//                       fontWeight: 700,
//                     }}
//                   >
//                     Amount
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {(previewEntry.denominations || []).map((item) => (
//                   <TableRow hover key={item.id ?? item.notes}>
//                     <TableCell>
//                       <Typography fontWeight={600}>
//                         ₹ {formatDenomination(item.notes)}
//                       </Typography>
//                     </TableCell>

//                     <TableCell align="right">
//                       {Number(item.numbers || 0)}
//                     </TableCell>

//                     <TableCell align="right">
//                       <Typography fontWeight={600}>
//                         ₹ {Number(item.amount || 0).toFixed(2)}
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ))}

//                 {(!previewEntry.denominations ||
//                   previewEntry.denominations.length === 0) && (
//                   <TableRow>
//                     <TableCell colSpan={3} align="center">
//                       No denomination details available
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Denomination Total */}
//           <Box
//             sx={{
//               p: 2,
//               display: "flex",
//               justifyContent: "flex-end",
//               backgroundColor: "#F8FAFC",
//               borderTop: "1px solid #E0E6ED",
//             }}
//           >
//             <Typography fontSize="17px" fontWeight={800}>
//               Denomination Total: ₹{" "}
//               {Number(previewEntry.total || 0).toFixed(2)}
//             </Typography>
//           </Box>
//         </Paper>

//         {/* Summary Cutoff */}
//         <Paper
//           elevation={0}
//           sx={{
//             mt: 2,
//             p: 1.8,
//             border: "1px solid #D9E5F4",
//             borderRadius: 2,
//             backgroundColor: "#EFF6FF",
//           }}
//         >
//           <Typography
//             fontSize="13px"
//             fontWeight={700}
//             color="#245BC5"
//           >
//             Summary Cutoff Time
//           </Typography>

//           <Typography fontSize="15px" fontWeight={600} mt={0.5}>
//             {formatCutoffIST(
//               previewEntry.summaryCutoffDateTime
//             )}
//           </Typography>

//           <Typography fontSize="11px" color="text.secondary" mt={0.5}>
//             Sales summary captured at this time
//           </Typography>
//         </Paper>
//       </>
//     )}
//   </DialogContent>

//   {/* Footer */}
//   <DialogActions
//     sx={{
//       px: 3,
//       py: 1.8,
//       backgroundColor: "#fff",
//     }}
//   >
//     <Button
//       variant="outlined"
//       onClick={handleClosePreview}
//       sx={{
//         px: 3,
//         borderRadius: 2,
//         textTransform: "none",
//         fontWeight: 700,
//       }}
//     >
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>


//       </Box>

//       {/* ==========================================================
//     DELETE CONFIRMATION DIALOG
// ========================================================== */}

 
//     </LocalizationProvider>
//   );
// };

// export default DenominationEntry;













































































































// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";

// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// // ============================================================
// // API URLS
// // ============================================================

// const POST_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

// const GET_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

// const UPDATE_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

// const DELETE_TABLE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

// const INVOICE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php";

// // ============================================================
// // DEFAULT BRANCH / USER
// // ============================================================

// const BRANCH_ID = 1;



// // ============================================================
// // COMPONENT
// // ============================================================

// const DenominationEntry = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================



// const currentCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const isAdmin = currentCreatedBy === 1;

//   const [entries, setEntries] = useState([]);
  

//   // ==========================================================
//   // FORM
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);




//   const [saveCompleted, setSaveCompleted] = useState(false);


//   const [previewOpen, setPreviewOpen] = useState(false);
// const [previewEntry, setPreviewEntry] = useState(null);

// const handlePreviewEntry = (entry) => {
//   setPreviewEntry(entry);
//   setPreviewOpen(true);
// };

// const handleClosePreview = () => {
//   setPreviewOpen(false);
//   setPreviewEntry(null);
// };

//   // ==========================================================
//   // SALES RECONCILIATION
//   // ==========================================================

// const [salesSummary, setSalesSummary] = useState({
//   regularCash: 0,
//   regularOnline: 0,

//   dealerCash: 0,
//   dealerOnline: 0,

//   catererCash: 0,
//   catererOnline: 0,

//   totalCash: 0,
//   totalOnline: 0,
//   totalCollection: 0,
//   salesTotalTillNow: 0,

//   summaryCutoffDateTime: "",
// });

//   const [showReconciliation, setShowReconciliation] = useState(false);

//   const [savedDenominationTotal, setSavedDenominationTotal] = useState(0);

//   const [cashDifference, setCashDifference] = useState(0);

//   const [isCashMatched, setIsCashMatched] = useState(false);

//   // ==========================================================
//   // ENTRY NUMBER
//   // ==========================================================

//   const [entryNo, setEntryNo] = useState("");

//   // ==========================================================
//   // ENTRY DATE
//   // ==========================================================

//   const [entryDate, setEntryDate] = useState(new Date());

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   // ==========================================================
//   // DENOMINATION MASTER
//   // ==========================================================

//   const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

//   // ==========================================================
//   // DENOMINATION ROWS
//   // ==========================================================

//   const [denominationRows, setDenominationRows] = useState([]);

//   // ==========================================================
//   // CREATE EMPTY ROWS
//   // ==========================================================

//   const createEmptyRows = () => {
//     return denominationValues.map((value) => ({
//       denomination: value,
//       quantity: "",
//       amount: 0,
//     }));
//   };

//   // ==========================================================
//   // FORMAT DENOMINATION
//   // ==========================================================

//   const formatDenomination = (value) => {
//     if (value === 0.5) {
//       return "0.50";
//     }

//     return String(value);
//   };

//   // ==========================================================
//   // FORMAT DATE FOR DISPLAY
//   // ==========================================================

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };



// // Format Summary Cutoff in Indian Standard Time
// const formatCutoffIST = (value) => {
//   if (!value) {
//     return "Not available";
//   }

//   const rawValue = String(value).trim();

//   // Database datetime without timezone is treated as IST.
//   const match = rawValue.match(
//     /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/
//   );

//   if (match) {
//     const [, year, month, day, hour, minute, second = "00"] = match;

//    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
//   }

//   // If the value includes a timezone, convert it to IST.
//   const parsedDate = new Date(rawValue);

//   if (Number.isNaN(parsedDate.getTime())) {
//     return "Not available";
//   }

//   return (
//     new Intl.DateTimeFormat("en-IN", {
//       timeZone: "Asia/Kolkata",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     }).format(parsedDate) + " IST"
//   );
// };



//   // ==========================================================
//   // FORMAT DATE FOR API
//   // ==========================================================

//   const formatApiDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const year = d.getFullYear();

//     const month = String(d.getMonth() + 1).padStart(2, "0");

//     const day = String(d.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   // ==========================================================
//   // CHECK SAME DATE
//   // ==========================================================

//   const isSameDate = (date1, date2) => {
//     if (!date1 || !date2) {
//       return false;
//     }

//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   // ==========================================================
//   // GET INVOICE DATE VALUE
//   // ==========================================================

//   const getInvoiceDateValue = (invoice) => {
//     const value = invoice?.InvoiceDate;

//     if (!value) {
//       return null;
//     }

//     // API sometimes returns:
//     // { date: "2026-09-30 18:30:00" }

//     if (typeof value === "object" && value?.date) {
//       return value.date;
//     }

//     return value;
//   };

//   // ==========================================================
//   // GET INVOICE DATETIME
//   // ==========================================================

//   const getInvoiceDateTime = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return null;
//     }

//     const dateObject = new Date(rawValue);

//     if (!isNaN(dateObject.getTime())) {
//       return dateObject;
//     }

//     return null;
//   };

//   // ==========================================================
//   // GET DATE ONLY FROM INVOICE
//   // ==========================================================

//   const getInvoiceDateOnly = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return "";
//     }

//     const stringValue = String(rawValue);

//     return stringValue.substring(0, 10);
//   };

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================


// const resetForm = () => {
//   setEntryNo("");
//   setEntryDate(new Date());
//   setEditingEntry(null);
//   setSaveCompleted(false);
//   setDenominationRows(createEmptyRows());

//   setSalesSummary({
//     regularCash: 0,
//     regularOnline: 0,
//     dealerCash: 0,
//     dealerOnline: 0,
//     catererCash: 0,
//     catererOnline: 0,
//     totalCash: 0,
//     totalOnline: 0,
//     totalCollection: 0,
//     salesTotalTillNow: 0,
//     summaryCutoffDateTime: "",
//   });

//   setSavedDenominationTotal(0);
//   setShowReconciliation(false);
//   setCashDifference(0);
//   setIsCashMatched(false);
// };


//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//      const createdBy = sessionStorage.getItem("CreatedBy") || "";

// const url =
//   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}` +
//   `&CreatedBy=${encodeURIComponent(createdBy)}`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Entry No API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const data = Array.isArray(result?.data) ? result.data : [];

//       if (data.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const entryNumbers = data
//         .map((item) => Number(item?.EntryNo))
//         .filter((value) => !Number.isNaN(value));

//       if (entryNumbers.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const maxEntryNo = Math.max(...entryNumbers);

//       setEntryNo(String(maxEntryNo + 1));
//     } catch (error) {
//       console.error("GENERATE ENTRY NO ERROR:", error);

//       setEntryNo("1");

//       toast.error("Unable to generate Entry No");
//     }
//   };

//   // ==========================================================
//   // FETCH SALES SUMMARY
//   //
//   // REQUIREMENT:
//   //
//   // Sales Entry
//   // + Sales Dealer
//   // + Sales Caterers
//   //
//   // selected date
//   // +
//   // till current time for today's date
//   //
//   // SUM invoice.Total
//   // ==========================================================

//   const fetchSalesSummary = async (selectedDate) => {
//     try {
//       if (!selectedDate) {
//         return;
//       }

//       const selectedDateString = formatApiDate(selectedDate);
      

//       const now = new Date();



//       // Logged-in user ID used for invoice filtering
// const loggedInCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const loggedInIsAdmin = loggedInCreatedBy === 1;

// console.log("LOGGED-IN CREATED BY:", loggedInCreatedBy);
// console.log("IS ADMIN:", loggedInIsAdmin);

//       console.log("====================================");

//       console.log("FETCH SALES SUMMARY");

//       console.log("SELECTED DATE:", selectedDateString);

//       console.log("CURRENT TIME:", now);

//       // ======================================================
//       // FETCH FIRST PAGE
//       // ======================================================

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const firstResponse = await fetch(
//         `${INVOICE_API}?Table=invoiceheader&PageNo=1`,
//         requestOptions,
//       );

//       if (!firstResponse.ok) {
//         throw new Error(`Sales API failed: ${firstResponse.status}`);
//       }

//       const firstResult = await firstResponse.json();

//       let allInvoices = [...(firstResult?.data || [])];

//       const totalPages = Number(firstResult?.total_pages || 1);

//       console.log("TOTAL INVOICE PAGES:", totalPages);

//       // ======================================================
//       // FETCH ALL REMAINING PAGES
//       // ======================================================

//       if (totalPages > 1) {
//         for (let page = 2; page <= totalPages; page++) {
//           try {
//             const response = await fetch(
//               `${INVOICE_API}?Table=invoiceheader&PageNo=${page}`,
//               requestOptions,
//             );

//             if (!response.ok) {
//               console.warn("Invoice page failed:", page);

//               continue;
//             }

//             const result = await response.json();

//             allInvoices = [...allInvoices, ...(result?.data || [])];
//           } catch (pageError) {
//             console.error("PAGE FETCH ERROR:", page, pageError);
//           }
//         }
//       }

//       console.log("TOTAL ALL INVOICES:", allInvoices.length);



      
// console.log("========== INVOICE FILTER DEBUG ==========");
// console.log("Selected date:", selectedDateString);
// console.log("Login CreatedBy:", loggedInCreatedBy);
// console.log("First invoice object:", allInvoices[0]);

// console.table(
//   allInvoices.slice(0, 20).map((invoice) => ({
//     InvoiceNo: invoice?.InvoiceNo,
//     InvoiceDate: invoice?.InvoiceDate,
//     NormalizedDate: getInvoiceDateOnly(invoice),
//     CreatedBy: invoice?.CreatedBy,
//     UserId: invoice?.UserId,
//     Total: invoice?.Total,
//   }))
// );

// const dateMatchedInvoices = allInvoices.filter(
//   (invoice) =>
//     getInvoiceDateOnly(invoice) === selectedDateString
// );

// const userMatchedInvoices = allInvoices.filter(
//   (invoice) =>
//     Number(invoice?.CreatedBy ?? 0) === loggedInCreatedBy
// );

// console.log("DATE MATCHED COUNT:", dateMatchedInvoices.length);
// console.log("USER MATCHED COUNT:", userMatchedInvoices.length);


//       // ======================================================
//       // FILTER SALES
//       //
//       // ALL INVOICEHEADER SALES ARE CONSIDERED:
//       //
//       // Sales Entry
//       // Dealer
//       // Caterers
//       //
//       // If your backend has other invoice types in
//       // invoiceheader, then SaleType filter can be added.
//       // ======================================================

//      const selectedInvoices = allInvoices.filter((invoice) => {
//   // 1. Filter invoices by selected date
//   const invoiceDateOnly = getInvoiceDateOnly(invoice);

//   if (invoiceDateOnly !== selectedDateString) {
//     return false;
//   }

//   // 2. Get logged-in user's CreatedBy
//   const loggedInCreatedBy = Number(
//     sessionStorage.getItem("CreatedBy") || 0
//   );

//   // 3. Admin can see all users' invoices
//   const loggedInIsAdmin = loggedInCreatedBy === 1;

//   // 4. Sale and Sale2 can see only their own invoices
//   if (!loggedInIsAdmin) {
//     const invoiceCreatedBy = Number(invoice?.CreatedBy ?? 0);

//     if (invoiceCreatedBy !== loggedInCreatedBy) {
//       return false;
//     }
//   }

//   // 5. If selected date is today, include invoices only up to now
//   if (isSameDate(selectedDate, now)) {
//     const invoiceDateTime = getInvoiceDateTime(invoice);

//     if (invoiceDateTime) {
//       return invoiceDateTime.getTime() <= now.getTime();
//     }

//     // If API provides only the date, include today's invoice
//     return true;
//   }

//   // 6. For past dates, include all invoices of that date
//   return true;
// });

// // Debug logs
// console.log(
//   "LOGGED-IN CREATED BY:",
//   sessionStorage.getItem("CreatedBy")
// );

// console.log(
//   "FILTERED INVOICE COUNT:",
//   selectedInvoices.length
// );

// console.log(
//   "FILTERED INVOICES:",
//   selectedInvoices
// );

//       console.log("SELECTED SALES INVOICES:", selectedInvoices);

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       let totalCash = 0;
//       let totalOnline = 0;
//       let salesTotalTillNow = 0;

//       selectedInvoices.forEach((invoice) => {
//         // ====================================================
//         // INVOICE TOTAL
//         // ====================================================

//         const invoiceTotal = Number(invoice?.Total || 0);

//         // ====================================================
//         // PAYMENT MODE
//         //
//         // C = Cash
//         // O = Online
//         // M = Mixed
//         // ====================================================

//         const paymentMode = String(invoice?.PaymentMode || "")
//           .trim()
//           .toUpperCase();

//         // ====================================================
//         // CASH AMOUNT
//         // ====================================================

//         const cashAmount = Number(invoice?.CashAmount || 0);

//         // ====================================================
//         // ONLINE AMOUNT
//         // ====================================================

//         const onlineAmount = Number(invoice?.OnlineAmount || 0);

//         // ====================================================
//         // SALES TOTAL
//         //
//         // Sales Entry
//         // + Dealer
//         // + Caterers
//         // ====================================================

//         salesTotalTillNow += invoiceTotal;

//         // ====================================================
//         // PAYMENT MODE WISE CALCULATION
//         // ====================================================

//         if (paymentMode === "C" || paymentMode === "CASH") {
//           // ----------------------------------------------
//           // CASH SALE
//           // ----------------------------------------------

//           totalCash += invoiceTotal;
//         } else if (paymentMode === "O" || paymentMode === "ONLINE") {
//           // ----------------------------------------------
//           // ONLINE SALE
//           // ----------------------------------------------

//           totalOnline += invoiceTotal;
//         } else if (paymentMode === "M" || paymentMode === "MIXED") {
//           // ----------------------------------------------
//           // MIXED PAYMENT
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         } else {
//           // ----------------------------------------------
//           // FALLBACK
//           //
        
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         }
//       });

//       // ======================================================
//       // ROUND VALUES
//       // ======================================================

//       salesTotalTillNow = Number(salesTotalTillNow.toFixed(2));

//       totalCash = Number(totalCash.toFixed(2));

//       totalOnline = Number(totalOnline.toFixed(2));

//       console.log("========== PAYMENT SUMMARY ==========");

//       console.table(
//         selectedInvoices.map((invoice) => ({
//           InvoiceNo: invoice?.InvoiceNo,
//           Total: Number(invoice?.Total || 0),
//           PaymentMode: invoice?.PaymentMode,
//           CashAmount: Number(invoice?.CashAmount || 0),
//           OnlineAmount: Number(invoice?.OnlineAmount || 0),
//         })),
//       );

//       console.log("FINAL SALES TOTAL:", salesTotalTillNow);

//       console.log("FINAL TOTAL CASH:", totalCash);

//       console.log("FINAL TOTAL ONLINE:", totalOnline);

//       console.log("CASH + ONLINE:", totalCash + totalOnline);

//       console.log("======================================");

//       const totalCollection = salesTotalTillNow;




      
//       const cutoffNow = new Date();
//       const pad = (value) => String(value).padStart(2, "0");

//       const summaryCutoffDateTime =
//         `${cutoffNow.getFullYear()}-${pad(cutoffNow.getMonth() + 1)}-${pad(cutoffNow.getDate())} ` +
//         `${pad(cutoffNow.getHours())}:${pad(cutoffNow.getMinutes())}:${pad(cutoffNow.getSeconds())}`;


//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

     
// setSalesSummary({
//   regularCash: 0,
//   regularOnline: 0,
//   dealerCash: 0,
//   dealerOnline: 0,
//   catererCash: 0,
//   catererOnline: 0,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   salesTotalTillNow,
//   summaryCutoffDateTime,
// });


//       console.log("====================================");

//       console.log(
//         "SALES TOTAL TILL NOW:",
//         Number(salesTotalTillNow || 0).toFixed(2),
//       );

//       console.log("TOTAL CASH:", Number(totalCash || 0).toFixed(2));

//       console.log("TOTAL ONLINE:", Number(totalOnline || 0).toFixed(2));

//       console.log("TOTAL COLLECTION:", Number(totalCollection || 0).toFixed(2));

//       console.log(
//         "CASH + ONLINE:",
//         (Number(totalCash || 0) + Number(totalOnline || 0)).toFixed(2),
//       );

//       console.log("SELECTED INVOICE COUNT:", selectedInvoices.length);

//       console.log("====================================");
//     } catch (error) {
//       console.error("FETCH SALES SUMMARY ERROR:", error);

//       toast.error("Unable to fetch Sales Summary");
//     }
//   };

//   // ==========================================================
//   // GET DENOMINATION DATA
//   // ==========================================================

// const fetchDenominationEntries = async () => {
//   try {
//     const currentCreatedBy = Number(
//       sessionStorage.getItem("CreatedBy") || 0
//     );

//     const isAdmin = currentCreatedBy === 1;

//     const params = new URLSearchParams({
//       Id: "",
//       BranchId: String(BRANCH_ID),
//     });

//     if (!isAdmin) {
//       params.set("CreatedBy", String(currentCreatedBy));
//     }

//     const url = `${GET_DENOMINATION_API}?${params.toString()}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(
//         `GET API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     if (!result.success) {
//       throw new Error(
//         result.message || "Unable to load denomination entries"
//       );
//     }

//     if (!Array.isArray(result.data)) {
//       setEntries([]);
//       setPageNo(1);
//       return;
//     }

//     const groupedEntries = {};

//     result.data.forEach((item) => {
//       const entryNo = String(item.EntryNo ?? "");
//       const branchId = String(item.BranchId ?? "");
//       const createdBy = String(item.CreatedBy ?? "");

//       const groupKey = `${branchId}_${createdBy}_${entryNo}`;

//       if (!groupedEntries[groupKey]) {
//         groupedEntries[groupKey] = {
//           id: item.Id,
//           apiId: item.Id,
//           branchId: item.BranchId,
//           entryNo: item.EntryNo,
//           entryDate: item.EntryDate,
//           entryDateText: formatDate(item.EntryDate),
//           total: 0,
//           denominations: [],
//           active: Number(item.Active || 0),
//           createdBy: item.CreatedBy,
//           updatedBy: item.UpdatedBy,
//           updatedCount: item.UpdatedCount,
//           salesTotalTillNow: Number(item.SalesTotalTillNow || 0),
//           totalCash: Number(item.TotalCash || 0),
//           totalOnline: Number(item.TotalOnline || 0),
//           totalCollection: Number(item.TotalCollection || 0),
//           summaryCutoffDateTime:
//             item.SummaryCutoffDateTime || "",
//         };
//       }

//       const amount = Number(item.Amount || 0);

//       groupedEntries[groupKey].total += amount;

//       groupedEntries[groupKey].denominations.push({
//         id: item.Id,
//         notes: Number(item.Notes || 0),
//         numbers: Number(item.Numbers || 0),
//         amount,
//       });
//     });

//     const formattedEntries = Object.values(groupedEntries);

//     formattedEntries.sort((a, b) => {
//       const dateA = a.entryDate
//         ? new Date(a.entryDate).getTime()
//         : 0;

//       const dateB = b.entryDate
//         ? new Date(b.entryDate).getTime()
//         : 0;

//       if (dateA !== dateB) {
//         return dateB - dateA;
//       }

//       return Number(b.entryNo || 0) - Number(a.entryNo || 0);
//     });

//     console.log(
//       "DENOMINATION ENTRIES - LATEST FIRST:",
//       formattedEntries
//     );

//     setEntries(formattedEntries);

//     const calculatedPages = Math.ceil(
//       formattedEntries.length / 10
//     );

//     if (calculatedPages === 0) {
//       setPageNo(1);
//     } else {
//       setPageNo((previousPage) =>
//         previousPage > calculatedPages
//           ? calculatedPages
//           : previousPage
//       );
//     }
//   } catch (error) {
//     console.error("GET DENOMINATION ERROR:", error);

//     toast.error("Unable to load Denomination Entries");
//   }
// };

//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {
//     setDenominationRows(createEmptyRows());

//     fetchDenominationEntries();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = async () => {
//     resetForm();

//     const today = new Date();

//     setEntryDate(today);

//     setOpenForm(true);

//     // Fetch current sales total
//     await fetchSalesSummary(today);

//     // Generate entry no
//     await generateNextEntryNo();
//   };

//   // ==========================================================
//   // CLOSE FORM
//   // ==========================================================

//   const handleCloseForm = () => {
//     if (saving) {
//       return;
//     }

//     setOpenForm(false);

//     resetForm();
//   };

//   // ==========================================================
//   // EDIT DENOMINATION ENTRY
//   // ==========================================================

 


// const handleEditEntry = async (entry) => {
//   try {
//     // 1. Validate selected entry
//     if (!entry) {
//       toast.error("Denomination entry not found");
//       return;
//     }

//     setSaveCompleted(false);
//     setEditingEntry(entry);

//     // 2. Restore Entry Number
//     setEntryNo(String(entry.entryNo ?? ""));

//     // 3. Restore Entry Date without timezone conversion
//     const rawDate = String(entry.entryDate ?? "");
//     const datePart = rawDate.substring(0, 10);

//     let validEditDate;

//     if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
//       const [year, month, day] = datePart
//         .split("-")
//         .map(Number);

//       validEditDate = new Date(year, month - 1, day);
//     } else {
//       validEditDate = new Date(
//         entry.entryDate || Date.now()
//       );
//     }

//     if (Number.isNaN(validEditDate.getTime())) {
//       toast.error("Invalid denomination entry date");
//       return;
//     }

//     setEntryDate(validEditDate);

//     // 4. Restore existing denomination rows
//     const emptyRows = createEmptyRows();

//     const existingDenominations = Array.isArray(
//       entry.denominations
//     )
//       ? entry.denominations
//       : [];

//     const editRows = emptyRows.map((row) => {
//       const existing = existingDenominations.find(
//         (item) =>
//           Number(item.notes) === Number(row.denomination)
//       );

//       if (!existing) {
//         return {
//           ...row,
//           id: null,
//           quantity: "",
//           amount: 0,
//         };
//       }

//       const quantity = Number(existing.numbers ?? 0);

//       return {
//         ...row,
//         id: existing.id ?? existing.Id ?? null,
//         quantity: quantity > 0 ? String(quantity) : "",
//         amount: Number(existing.amount ?? 0),
//       };
//     });

//     setDenominationRows(editRows);

//     // 5. Restore saved Summary values
//     const savedSummary = {
//       totalCash: Number(entry.totalCash ?? 0),
//       totalOnline: Number(entry.totalOnline ?? 0),
//       totalCollection: Number(entry.totalCollection ?? 0),
//       salesTotalTillNow: Number(
//         entry.salesTotalTillNow ?? 0
//       ),
//       summaryCutoffDateTime:
//         entry.summaryCutoffDateTime ?? "",
//     };

//     const hasSavedSummary =
//       savedSummary.totalCash !== 0 ||
//       savedSummary.totalOnline !== 0 ||
//       savedSummary.totalCollection !== 0 ||
//       savedSummary.salesTotalTillNow !== 0;

//     console.log("EDIT ENTRY:", entry);
//     console.log("EDIT ENTRY DATE:", datePart);
//     console.log("SAVED SUMMARY:", savedSummary);
//     console.log("HAS SAVED SUMMARY:", hasSavedSummary);

//     // 6. Restore saved Summary or fetch it if unavailable
//     if (hasSavedSummary) {
//       setSalesSummary((previous) => ({
//         ...previous,
//         ...savedSummary,
//       }));
//     } else {
//       await fetchSalesSummary(validEditDate);
//     }

//     // 7. Reset reconciliation state
//     setShowReconciliation(false);
//     setCashDifference(0);
//     setIsCashMatched(false);
//     setSavedDenominationTotal(0);

//     // 8. Open Edit form
//     setOpenForm(true);
//   } catch (error) {
//     console.error("EDIT DENOMINATION ERROR:", error);

//     toast.error(
//       error?.message ||
//         "Unable to open denomination entry for edit"
//     );
//   }
// };





//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (index, value) => {
//     // Empty
//     if (value === "") {
//       setDenominationRows((previousRows) =>
//         previousRows.map((row, rowIndex) => {
//           if (rowIndex === index) {
//             return {
//               ...row,
//               quantity: "",
//               amount: 0,
//             };
//           }

//           return row;
//         }),
//       );

//       return;
//     }

//     // Only integer
//     if (!/^\d+$/.test(value)) {
//       return;
//     }

//     const quantity = Number(value);

//     setDenominationRows((previousRows) =>
//       previousRows.map((row, rowIndex) => {
//         if (rowIndex === index) {
//           const amount = row.denomination * quantity;

//           return {
//             ...row,
//             quantity: value,
//             amount,
//           };
//         }

//         return row;
//       }),
//     );
//   };

//   // ==========================================================
//   // TOTAL DENOMINATION
//   // ==========================================================

//   const total = useMemo(() => {
//     return denominationRows.reduce(
//       (sum, row) => sum + Number(row.amount || 0),
//       0,
//     );
//   }, [denominationRows]);

//   // ==========================================================
//   // UPDATE DENOMINATION API
//   // ==========================================================

//   const updateDenomination = async ({
//     id,
//     branchId,
//     date,
//     notes,
//     numbers,
//     amount,
//     updatedBy,
//   }) => {
//     const formData = new FormData();

//     formData.append("Id", String(id));

//     formData.append("BranchId", String(branchId || BRANCH_ID));

//     formData.append("EntryDate", formatApiDate(date));

//     formData.append("Notes", String(Number(notes || 0)));

//     formData.append("Numbers", String(Number(numbers || 0)));

//     formData.append("Amount", Number(amount || 0).toFixed(2));

//     formData.append("UpdatedBy", String(updatedBy || ""));

//     const response = await fetch(UPDATE_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Unable to update denomination");
//     }

//     return result;
//   };

//   // ==========================================================
//   // CREATE DENOMINATION API
//   // ==========================================================

  



// const createDenomination = async ({
//   entryNo,
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId,
//   createdBy,
//   userId,
//   saleRole,
//   drawerId,
//   salesTotalTillNow,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   summaryCutoffDateTime,
// }) => {
//   try {
//     // ========================================
//     // 1. PREPARE AND VALIDATE VALUES
//     // ========================================
//     const resolvedBranchId = Number(branchId || BRANCH_ID);
//     const resolvedCreatedBy = Number(createdBy);
//     const notes = Number(denomination);
//     const numbers = Number(quantity);

//     const totalAmount =
//       amount !== undefined && amount !== null && amount !== ""
//         ? Number(amount)
//         : notes * numbers;

//     if (!Number.isFinite(resolvedBranchId) || resolvedBranchId <= 0) {
//       throw new Error("Please provide a valid BranchId.");
//     }

//     if (!Number.isFinite(resolvedCreatedBy) || resolvedCreatedBy <= 0) {
//       throw new Error("Please provide a valid CreatedBy.");
//     }

//     if (!Number.isFinite(notes) || notes <= 0) {
//       throw new Error("Please provide a valid denomination Notes value.");
//     }

//     if (!Number.isFinite(numbers) || numbers <= 0) {
//       throw new Error("Please provide a valid denomination quantity.");
//     }

//     if (!Number.isFinite(totalAmount) || totalAmount < 0) {
//       throw new Error("Please provide a valid denomination Amount.");
//     }

//     if (!entryDate) {
//       throw new Error("Please select Entry Date.");
//     }

//     // ========================================
//     // 2. FORMAT ENTRY DATE
//     // ========================================
//     const formattedEntryDate = formatApiDate(entryDate);

//     if (!formattedEntryDate) {
//       throw new Error("Invalid Entry Date.");
//     }

//     // ========================================
//     // 3. CREATE FORMDATA
//     // ========================================
//     const formData = new FormData();

//     formData.append("BranchId", String(resolvedBranchId));
//     formData.append("EntryDate", String(formattedEntryDate));
//     formData.append("Notes", String(notes));
//     formData.append("Numbers", String(numbers));
//     formData.append("Amount", totalAmount.toFixed(2));
//     formData.append("CreatedBy", String(resolvedCreatedBy));

//     formData.append("UserId", String(userId ?? ""));
//     formData.append("SaleRole", String(saleRole ?? ""));
//     formData.append("DrawerId", String(drawerId ?? ""));
//     formData.append("EntryNo", String(entryNo ?? "").trim());

//     formData.append(
//       "SalesTotalTillNow",
//       String(Number(salesTotalTillNow ?? 0))
//     );

//     formData.append("TotalCash", String(Number(totalCash ?? 0)));
//     formData.append("TotalOnline", String(Number(totalOnline ?? 0)));

//     formData.append(
//       "TotalCollection",
//       String(Number(totalCollection ?? 0))
//     );

//     formData.append(
//       "SummaryCutoffDateTime",
//       String(summaryCutoffDateTime ?? "")
//     );

//     // ========================================
//     // 4. LOG ACTUAL FORMDATA VALUES
//     // ========================================
//     const payloadForLog = {};

//     for (const [key, value] of formData.entries()) {
//       payloadForLog[key] = value;
//     }

//     console.log("========== DENOMINATION API REQUEST ==========");
//     console.log("API URL:", POST_DENOMINATION_API);
//     console.log("FORMDATA PAYLOAD:", payloadForLog);

//     // ========================================
//     // 5. CALL POST API
//     // ========================================
//     const response = await fetch(POST_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     // ========================================
//     // 6. READ API RESPONSE
//     // ========================================
//     const responseText = await response.text();

//     console.log("DENOMINATION HTTP STATUS:", response.status);
//     console.log("DENOMINATION RAW RESPONSE:", responseText);

//     let result;

//     try {
//       result = JSON.parse(responseText);
//     } catch {
//       throw new Error(
//         `The API returned an invalid JSON response. HTTP ${response.status}. ` +
//           `Response: ${responseText.slice(0, 300)}`
//       );
//     }

//     // ========================================
//     // 7. CHECK HTTP AND API SUCCESS
//     // ========================================
//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           `Denomination API failed. HTTP ${response.status}.`
//       );
//     }

//     // Support common API response formats.
//     const apiSuccess =
//       result.success === true ||
//       result.success === 1 ||
//       result.success === "true" ||
//       result.status === "success";

//     if (!apiSuccess) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           "The API did not confirm that the denomination was saved."
//       );
//     }

//     console.log("DENOMINATION SAVED SUCCESSFULLY:", result);

//     return result;
//   } catch (error) {
//     console.error("CREATE DENOMINATION ERROR:", error);
//     throw error;
//   }
// };



//   // ==========================================================
//   // SAVE
//   //
//   // IMPORTANT:
//   // VALIDATION HAPPENS BEFORE POST API
//   // ==========================================================

//   // ==========================================================
//   // SAVE / UPDATE DENOMINATION
//   // ==========================================================




// const handleSave = async () => {
//   if (saving) {
//     return;
//   }

//   if (!entryNo || !entryNo.trim()) {
//     toast.error("Please enter Entry No");
//     return;
//   }

//   if (!entryDate || isNaN(new Date(entryDate).getTime())) {
//     toast.error("Please select a valid Entry Date");
//     return;
//   }

//   const rowsToSave = denominationRows.filter(
//     (row) => Number(row.quantity || 0) > 0
//   );

//   if (rowsToSave.length === 0) {
//     toast.error("Please enter at least one denomination quantity");
//     return;
//   }

//   const loggedInUserId =
//     sessionStorage.getItem("UserId") ||
//     sessionStorage.getItem("LoginUserId") ||
//     "";

//   const loggedInSaleRole =
//     sessionStorage.getItem("UserRole") || "";

//   const currentCreatedBy = Number(
//     sessionStorage.getItem("CreatedBy") || 0
//   );

//   const drawerId =
//     sessionStorage.getItem("Device") || "";

//   if (
//     !loggedInUserId ||
//     !loggedInSaleRole ||
//     !currentCreatedBy
//   ) {
//     toast.error(
//       "Login details are incomplete. Please login again."
//     );
//     return;
//   }

//   try {
//     setSaving(true);

//     const userDetails = {
//       userId: loggedInUserId,
//       saleRole: loggedInSaleRole,
//       drawerId,
//     };

//     const denominationTotal = Number(
//       rowsToSave
//         .reduce((sum, row) => {
//           const denomination = Number(row.denomination || 0);
//           const quantity = Number(row.quantity || 0);

//           return sum + denomination * quantity;
//         }, 0)
//         .toFixed(2)
//     );

//     // Read the current sales summary
//     const salesTotalTillNow = Number(
//       salesSummary?.salesTotalTillNow ?? 0
//     );

//     const cashTotal = Number(
//       salesSummary?.totalCash ?? 0
//     );

//     const onlineTotal = Number(
//       salesSummary?.totalOnline ?? 0
//     );

//     const totalCollection = Number(
//       salesSummary?.totalCollection ?? 0
//     );

//     const summaryCutoffDateTime =
//       salesSummary?.summaryCutoffDateTime || "";

//     // Debug the values before saving
//     console.log("SALES SUMMARY BEFORE SAVE:", salesSummary);

//     console.log("SUMMARY VALUES SENT:", {
//       SalesTotalTillNow: salesTotalTillNow,
//       TotalCash: cashTotal,
//       TotalOnline: onlineTotal,
//       TotalCollection: totalCollection,
//       SummaryCutoffDateTime: summaryCutoffDateTime,
//       CreatedBy: currentCreatedBy,
//     });

//     // Stop saving if the summary is not loaded
//     if (
//       salesTotalTillNow === 0 &&
//       cashTotal === 0 &&
//       onlineTotal === 0 &&
//       totalCollection === 0
//     ) {
//       toast.error(
//         "Sales summary is zero. Please refresh the sales summary before saving."
//       );
//       return;
//     }

//     const difference = Number(
//       (denominationTotal - cashTotal).toFixed(2)
//     );

//     const matched = Math.abs(difference) < 0.01;

//     setSavedDenominationTotal(denominationTotal);
//     setCashDifference(difference);
//     setIsCashMatched(matched);
//     setShowReconciliation(true);

//     const snapshotData = {
//       salesTotalTillNow,
//       totalCash: cashTotal,
//       totalOnline: onlineTotal,
//       totalCollection,
//       summaryCutoffDateTime,
//     };

//     const createEntry = async (row) => {
//       const denomination = Number(row.denomination || 0);
//       const quantity = Number(row.quantity || 0);

//       const amount = Number(
//         (denomination * quantity).toFixed(2)
//       );

//       await createDenomination({
//         entryNo: entryNo.trim(),
//         entryDate,
//         denomination,
//         quantity,
//         amount,
//         branchId: BRANCH_ID,
//         createdBy: currentCreatedBy,
//         ...userDetails,
//         ...snapshotData,
//       });
//     };

//     if (editingEntry) {
//       for (const row of denominationRows) {
//         const denomination = Number(row.denomination || 0);
//         const quantity = Number(row.quantity || 0);

//         const amount = Number(
//           (denomination * quantity).toFixed(2)
//         );

//         if (row.id) {
//           if (quantity <= 0) {
//             continue;
//           }

//           await updateDenomination({
//             id: row.id,
//             branchId: BRANCH_ID,
//             date: entryDate,
//             notes: denomination,
//             numbers: quantity,
//             amount,
//             updatedBy: currentCreatedBy,
//             ...userDetails,
//           });
//         } else if (quantity > 0) {
//           await createEntry(row);
//         }
//       }

//       toast.success(
//         "Denomination Entry updated successfully!"
//       );
//     } else {
//       for (const row of rowsToSave) {
//         await createEntry(row);
//       }

//       toast.success(
//         "Denomination Entry saved successfully!"
//       );
//     }

//     await fetchDenominationEntries();

//     setSaveCompleted(true);
//     setEditingEntry(null);
//   } catch (error) {
//     console.error("Denomination Save Error:", error);

//     toast.error(
//       error?.message || "Unable to save Denomination Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };






//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

 
// const pageSize = 10;

// const totalPages = Math.ceil(entries.length / pageSize);

// const paginatedEntries = entries.slice(
//   (pageNo - 1) * pageSize,
//   pageNo * pageSize
// );


//   // ==========================================================
//   // TABLE COLUMNS
//   // ==========================================================

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "srNo",

//         header: "Sr.No",

//         size: 80,

//         Cell: ({ row }) => {
//           const index = entries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "entryNo",

//         header: "Entry No",

//         size: 150,
//       },

//       {
//         accessorKey: "entryDateText",

//         header: "Entry Date",

//         size: 160,
//       },

//       {
//         accessorKey: "total",

//         header: "Total",

//         size: 150,

//         Cell: ({ cell }) => (
//           <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
//         ),
//       },

//       {
//         header: "Actions",

//         size: 180,

//         enableSorting: false,

//         enableColumnFilter: false,

//       Cell: ({ row }) => (
//   <Box
//     display="flex"
//     justifyContent="center"
//     alignItems="center"
//     gap={1}
//   >
//     {/* ================= PREVIEW ================= */}
//     <Tooltip title="Preview">
//       <IconButton
//         color="info"
//         size="small"
//         onClick={() => handlePreviewEntry(row.original)}
//       >
//         <VisibilityIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>

//     {/* ================= EDIT ================= */}
//     <Tooltip title="Edit">
//       <IconButton
//         color="primary"
//         size="small"
//         onClick={() => handleEditEntry(row.original)}
//       >
//         <EditIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>
//   </Box>
// ),
//       },
//     ],
//     [entries, handleEditEntry, handlePreviewEntry]
//   );
//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{
//           width: "100%",
//           minHeight: "100%",
//           p: 5,
//           boxSizing: "border-box",

//           "@media (max-width: 768px)": {
//             p: 2,
//           },
//         }}
//       >
//         {/* ==================================================
//             PAGE TITLE
//         ================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Denomination Entry</b>
//           </Typography>
//         </Box>

//         {/* ==================================================
//             CREATE BUTTON
//         ================================================== */}

//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },

//               borderRadius: "5px 5px 0 0",

//               textTransform: "uppercase",

//               fontSize: "16px",

//               fontWeight: 500,

//               px: 2.5,

//               py: 1.5,
//             }}
//             variant="contained"
//             onClick={handleOpenForm}
//           >
//             CREATE DENOMINATION ENTRY
//           </Button>
//         </Box>

//         {/* ==================================================
//             MAIN TABLE
//         ================================================== */}

//         <MaterialReactTable
//   columns={columns}
//   data={paginatedEntries}
//   enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",

//               color: "black",

//               fontSize: "16px",

//               fontWeight: "bold",
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               fontSize: "15px",
//             },
//           }}
//           muiTablePaperProps={{
//             elevation: 2,

//             sx: {
//               borderRadius: "0 4px 4px 4px",

//               overflow: "hidden",

//               boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//             },
//           }}
//           muiTableContainerProps={{
//             sx: {
//               maxHeight: "none",
//             },
//           }}
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               mb={1}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//               pr={2}
//               gap={0.5}
//             >
//               <FirstPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(1);
//                   }
//                 }}
//               />

//               <KeyboardArrowLeftIcon
//                 sx={{
//                   cursor: pageNo > 1 ? "pointer" : "default",

//                   color: pageNo > 1 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                 }}
//               />

//               <Box ml={1}>Page No</Box>

//               <TextField
//                 sx={{
//                   width: "65px",

//                   ml: 1,

//                   "& .MuiInputBase-input": {
//                     textAlign: "center",

//                     padding: "8px 5px",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);

//                   if (value < 1 || isNaN(value)) {
//                     value = 1;
//                   }

//                   if (totalPages > 0 && value > totalPages) {
//                     value = totalPages;
//                   }

//                   setPageNo(value);
//                 }}
//                 size="small"
//               />

//               <KeyboardArrowRightIcon
//                 sx={{
//                   cursor: pageNo < totalPages ? "pointer" : "default",

//                   color: pageNo < totalPages ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (pageNo < totalPages) {
//                     setPageNo((prev) => Number(prev) + 1);
//                   }
//                 }}
//               />

//               <LastPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(totalPages);
//                   }
//                 }}
//               />

//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
//         />

//         {/* ==================================================
//             DENOMINATION FORM
//         ================================================== */}

//         <Dialog
//           open={openForm}
//           onClose={handleCloseForm}
//           fullWidth
//           maxWidth="md"
//           PaperProps={{
//             sx: {
//               borderRadius: "6px",
//               maxHeight: "90vh",
//             },
//           }}
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <DialogTitle
//             sx={{
//               backgroundColor: "rgb(236, 253, 230)",

//               display: "flex",

//               justifyContent: "space-between",

//               alignItems: "center",

//               borderBottom: "1px solid #ddd",

//               py: 1.2,

//               px: 2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 700,

//                 color: "#0B5E20",

//                 fontSize: "18px",
//               }}
//             >
//               Denomination Entry
//             </Typography>

//             <IconButton
//               onClick={handleCloseForm}
//               disabled={saving}
//               size="small"
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           {/* ==================================================
//               CONTENT
//           ================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#fff",

//               p: {
//                 xs: 1.5,
//                 sm: 2,
//               },
//             }}
//           >
//             {/* =================================================
//                 ENTRY NO + DATE
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "1fr 1fr",
//                 },

//                 gap: 2,

//                 mt: 0.5,

//                 mb: 2,
//               }}
//             >
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry No:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   value={entryNo}
//                   onChange={(e) => setEntryNo(e.target.value)}
//                   placeholder="Enter Entry No"
//                   fullWidth
//                 />
//               </Box>

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry Date:
//                 </Typography>

//               <DatePicker
//   value={entryDate}
//   onChange={(newValue) => {
//     setEntryDate(newValue);

//     if (newValue && !editingEntry) {
//       fetchSalesSummary(newValue);
//     }
//   }}
//   format="dd-MM-yyyy"
//   slotProps={{
//     textField: {
//       size: "small",
//       fullWidth: true,
//     },
//   }}
// />
//               </Box>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 SALES SUMMARY
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Sales Summary:
//             </Typography>

          

// <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
//     },
//     gap: 1.5,
//     mb: 2,
//   }}
// >
//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "2px solid #0B5E20",
//         borderRadius: 1,
//         backgroundColor: "#f1fdf4",
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Sales Total Till Now
//       </Typography>

//       <Typography
//         fontSize="18px"
//         fontWeight={700}
//         color="#0B5E20"
//       >
//         ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Cash
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCash || 0).toFixed(2)}
//     </Typography>
//   </Paper>

//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "1px solid #d0d0d0",
//         borderRadius: 1,
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Total Online
//       </Typography>

//       <Typography fontSize="18px" fontWeight={700}>
//         ₹ {Number(salesSummary.totalOnline || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Collection
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCollection || 0).toFixed(2)}
//     </Typography>
//   </Paper>
// </Box>



//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 DENOMINATION TITLE
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Denominations:
//             </Typography>

//             {/* =================================================
//                 DENOMINATION TABLE
//             ================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 border: "1px solid #d0d0d0",

//                 overflowX: "auto",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   minWidth: 600,

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",

//                     py: 0.8,

//                     px: 1,

//                     fontSize: "13px",
//                   },
//                 }}
//               >
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Notes
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Number / Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {denominationRows.map((row, index) => (
//                     <TableRow hover key={row.denomination}>
//                       <TableCell>
//                         <Typography fontWeight={600}>
//                           ₹ {formatDenomination(row.denomination)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell align="center">
//                         <TextField
//                           type="text"
//                           size="small"
//                           value={row.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(index, e.target.value)
//                           }
//                           placeholder="Enter Number"
//                           inputMode="numeric"
//                           inputProps={{
//                             inputMode: "numeric",
//                             pattern: "[0-9]*",
//                           }}
//                           onWheel={(e) => {
//                             e.currentTarget.blur();
//                           }}
//                           sx={{
//                             width: 150,
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell align="right">
//                         <TextField
//                           size="small"
//                           value={Number(row.amount || 0).toFixed(2)}
//                           InputProps={{
//                             readOnly: true,
//                           }}
//                           sx={{
//                             width: 160,
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 DENOMINATION TOTAL
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "flex",

//                 justifyContent: "flex-end",

//                 alignItems: "center",

//                 gap: 1,

//                 mt: 1.5,
//               }}
//             >
//               <Typography fontWeight={700} fontSize="14px">
//                 Denomination Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(
//                   showReconciliation ? savedDenominationTotal : total,
//                 ).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 160,
//                 }}
//               />
//             </Box>

//             {/* =================================================
//                 RECONCILIATION
//             ================================================= */}

//             {showReconciliation && (
//               <>
//                 <Divider
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                   }}
//                 />

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,

//                     border: "1px solid",

//                     borderColor: isCashMatched ? "success.main" : "error.main",

//                     borderRadius: 1,

//                     backgroundColor: isCashMatched ? "#f1fdf4" : "#fff5f5",
//                   }}
//                 >
//                   {/* =====================================================
//           CASH RECONCILIATION
//           Denomination Total VS Total Cash
//       ====================================================== */}

//                   <Typography
//                     fontWeight={700}
//                     fontSize="16px"
//                     sx={{
//                       mb: 2,
//                     }}
//                   >
//                     Cash Reconciliation
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "grid",

//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         sm: "repeat(3, 1fr)",
//                       },

//                       gap: 1.5,
//                     }}
//                   >
//                     {/* =================================================
//             TOTAL CASH
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Total Cash
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(salesSummary?.totalCash || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DENOMINATION TOTAL
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Denomination Total
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(savedDenominationTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DIFFERENCE
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: isCashMatched
//                           ? "success.light"
//                           : "error.light",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Difference
//                       </Typography>

//                      <Typography
//   fontWeight={700}
//   fontSize="17px"
//   color={isCashMatched ? "success.main" : "error.main"}
// >
//   ₹ {Number(cashDifference || 0).toFixed(2)}
// </Typography>
//                     </Box>
//                   </Box>

//                   {/* =====================================================
//           MATCH STATUS
//       ====================================================== */}

//                   <Typography
//                     sx={{
//                       mt: 2,

//                       fontWeight: 700,

//                       fontSize: "16px",

//                       color: isCashMatched ? "success.main" : "error.main",
//                     }}
//                   >
//                     {isCashMatched
//                       ? "✓ CASH TOTAL MATCHED"
//                       : "✗ CASH TOTAL MISMATCH"}
//                   </Typography>
//                 </Paper>
//               </>
//             )}
//           </DialogContent>

//           {/* ==================================================
//               ACTIONS
//           ================================================== */}

//           <DialogActions
//             sx={{
//               justifyContent: "flex-start",

//               px: 2,

//               py: 1.2,

//               gap: 1,
//             }}
//           >
//             <Button
//   variant="contained"
//   disabled={saving || saveCompleted}
//   onClick={handleSave}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",
//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving
//     ? "Saving..."
//     : saveCompleted
//     ? "Saved"
//     : "Save"}
// </Button>

//           <Button
//   variant="outlined"
//   disabled={saving}
//   onClick={handleCloseForm}
//   sx={{
//     textTransform: "none",
//     color: "var(--complementary-color)",
//     borderColor: "var(--complementary-color)",
//     "&:hover": {
//       borderColor: "var(--complementary-color)",
//     },
//   }}
// >
//   Close
// </Button>
//           </DialogActions>
//         </Dialog>


 
// <Dialog
//   open={previewOpen}
//   onClose={handleClosePreview}
//   fullWidth
//   maxWidth="md"
//   PaperProps={{
//     sx: {
//       borderRadius: 3,
//       overflow: "hidden",
//       boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
//       m: 2,
//     },
//   }}
// >
//   {/* Header */}
//   <DialogTitle
//     sx={{
//       background: "linear-gradient(135deg, #0B5E20, #238443)",
//       color: "#fff",
//       px: 3,
//       py: 2.2,
//     }}
//   >
//     <Box display="flex" alignItems="center" gap={1.5}>
//       <VisibilityIcon />

//       <Box>
//         <Typography fontSize="21px" fontWeight={700}>
//           Denomination Entry Preview
//         </Typography>

//         <Typography fontSize="12px" sx={{ opacity: 0.9 }}>
//           Entry details and sales summary
//         </Typography>
//       </Box>
//     </Box>
//   </DialogTitle>

//   <DialogContent
//     dividers
//     sx={{
//       p: { xs: 2, sm: 3 },
//       backgroundColor: "#F7F9FC",
//     }}
//   >
//     {previewEntry && (
//       <>
//         {/* Entry Details */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 2,
//             mb: 2.5,
//             border: "1px solid #E0E6ED",
//             borderRadius: 2,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "1fr 1fr",
//               },
//               gap: 2,
//             }}
//           >
//             <Box>
//               <Typography fontSize="12px" color="text.secondary">
//                 ENTRY NUMBER
//               </Typography>

//               <Typography fontSize="18px" fontWeight={700}>
//                 #{previewEntry.entryNo}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography fontSize="12px" color="text.secondary">
//                 ENTRY DATE
//               </Typography>

//               <Typography fontSize="18px" fontWeight={700}>
//                 {previewEntry.entryDateText}
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Summary Cards */}
        
// {/* Summary Cards */}
// <Typography fontSize="16px" fontWeight={700} mb={1.5}>
//   Sales Summary
// </Typography>

// <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: isAdmin
//         ? "repeat(2, minmax(0, 1fr))"
//         : "repeat(2, minmax(0, 1fr))",
//     },
//     gap: 1.5,
//     mb: 3,
//   }}
// >
//   {(isAdmin
//     ? [
//         {
//           label: "Sales Total Till Now",
//           value: previewEntry.salesTotalTillNow,
//           color: "#245BC5",
//           background: "#EAF2FF",
//         },
//         {
//           label: "Total Cash",
//           value: previewEntry.totalCash,
//           color: "#17834A",
//           background: "#E8F7EF",
//         },
//         {
//           label: "Total Online",
//           value: previewEntry.totalOnline,
//           color: "#7041C5",
//           background: "#F1EBFF",
//         },
//         {
//           label: "Total Collection",
//           value: previewEntry.totalCollection,
//           color: "#B66A12",
//           background: "#FFF2E2",
//         },
//       ]
//     : [
//         {
//           label: "Total Cash",
//           value: previewEntry.totalCash,
//           color: "#17834A",
//           background: "#E8F7EF",
//         },
//         {
//           label: "Total Collection",
//           value: previewEntry.totalCollection,
//           color: "#B66A12",
//           background: "#FFF2E2",
//         },
//       ]
//   ).map((item) => (
//     <Paper
//       key={item.label}
//       elevation={0}
//       sx={{
//         p: 2,
//         borderRadius: 2,
//         border: `1px solid ${item.color}35`,
//         backgroundColor: item.background,
//       }}
//     >
//       <Typography
//         fontSize="13px"
//         fontWeight={600}
//         sx={{ color: item.color, mb: 0.7 }}
//       >
//         {item.label}
//       </Typography>

//       <Typography
//         fontSize={{ xs: "19px", sm: "22px" }}
//         fontWeight={800}
//         sx={{
//           color: item.color,
//           overflowWrap: "anywhere",
//         }}
//       >
//         ₹ {Number(item.value ?? 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   ))}
// </Box>


//         {/* Denominations */}
//         <Paper
//           elevation={0}
//           sx={{
//             border: "1px solid #E0E6ED",
//             borderRadius: 2,
//             overflow: "hidden",
//             backgroundColor: "#fff",
//           }}
//         >
//           <Box sx={{ px: 2, py: 1.7 }}>
//             <Typography fontSize="16px" fontWeight={700}>
//               Denominations
//             </Typography>

//             <Typography fontSize="12px" color="text.secondary">
//               Note-wise quantity and amount
//             </Typography>
//           </Box>

//           <Divider />

//           <TableContainer sx={{ maxHeight: 320 }}>
//             <Table
//               size="small"
//               stickyHeader
//               sx={{
//                 minWidth: 400,
//                 "& .MuiTableCell-root": {
//                   py: 1.3,
//                   px: 2,
//                   borderBottom: "1px solid #EDF0F4",
//                 },
//               }}
//             >
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       backgroundColor: "#EDF3F8",
//                       fontWeight: 700,
//                     }}
//                   >
//                     Notes
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       backgroundColor: "#EDF3F8",
//                       fontWeight: 700,
//                     }}
//                   >
//                     Quantity
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       backgroundColor: "#EDF3F8",
//                       fontWeight: 700,
//                     }}
//                   >
//                     Amount
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {(previewEntry.denominations || []).map((item) => (
//                   <TableRow hover key={item.id ?? item.notes}>
//                     <TableCell>
//                       <Typography fontWeight={600}>
//                         ₹ {formatDenomination(item.notes)}
//                       </Typography>
//                     </TableCell>

//                     <TableCell align="right">
//                       {Number(item.numbers || 0)}
//                     </TableCell>

//                     <TableCell align="right">
//                       <Typography fontWeight={600}>
//                         ₹ {Number(item.amount || 0).toFixed(2)}
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ))}

//                 {(!previewEntry.denominations ||
//                   previewEntry.denominations.length === 0) && (
//                   <TableRow>
//                     <TableCell colSpan={3} align="center">
//                       No denomination details available
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Denomination Total */}
//           <Box
//             sx={{
//               p: 2,
//               display: "flex",
//               justifyContent: "flex-end",
//               backgroundColor: "#F8FAFC",
//               borderTop: "1px solid #E0E6ED",
//             }}
//           >
//             <Typography fontSize="17px" fontWeight={800}>
//               Denomination Total: ₹{" "}
//               {Number(previewEntry.total || 0).toFixed(2)}
//             </Typography>
//           </Box>
//         </Paper>

//         {/* Summary Cutoff */}
//         <Paper
//           elevation={0}
//           sx={{
//             mt: 2,
//             p: 1.8,
//             border: "1px solid #D9E5F4",
//             borderRadius: 2,
//             backgroundColor: "#EFF6FF",
//           }}
//         >
//           <Typography
//             fontSize="13px"
//             fontWeight={700}
//             color="#245BC5"
//           >
//             Summary Cutoff Time
//           </Typography>

//           <Typography fontSize="15px" fontWeight={600} mt={0.5}>
//             {formatCutoffIST(
//               previewEntry.summaryCutoffDateTime
//             )}
//           </Typography>

//           <Typography fontSize="11px" color="text.secondary" mt={0.5}>
//             Sales summary captured at this time
//           </Typography>
//         </Paper>
//       </>
//     )}
//   </DialogContent>

//   {/* Footer */}
//   <DialogActions
//     sx={{
//       px: 3,
//       py: 1.8,
//       backgroundColor: "#fff",
//     }}
//   >
//     <Button
//       variant="outlined"
//       onClick={handleClosePreview}
//       sx={{
//         px: 3,
//         borderRadius: 2,
//         textTransform: "none",
//         fontWeight: 700,
//       }}
//     >
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>


//       </Box>

//       {/* ==========================================================
//     DELETE CONFIRMATION DIALOG
// ========================================================== */}

 
//     </LocalizationProvider>
//   );
// };

// export default DenominationEntry;



















































































































// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";

// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// // ============================================================
// // API URLS
// // ============================================================

// const POST_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

// const GET_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

// const UPDATE_DENOMINATION_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

// const DELETE_TABLE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

// const INVOICE_API =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php";

// // ============================================================
// // DEFAULT BRANCH / USER
// // ============================================================

// const BRANCH_ID = 1;



// // ============================================================
// // COMPONENT
// // ============================================================

// const DenominationEntry = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================



// const currentCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const isAdmin = currentCreatedBy === 1;

//   const [entries, setEntries] = useState([]);
  

//   // ==========================================================
//   // FORM
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);




//   const [saveCompleted, setSaveCompleted] = useState(false);


//   const [previewOpen, setPreviewOpen] = useState(false);
// const [previewEntry, setPreviewEntry] = useState(null);

// const handlePreviewEntry = (entry) => {
//   setPreviewEntry(entry);
//   setPreviewOpen(true);
// };

// const handleClosePreview = () => {
//   setPreviewOpen(false);
//   setPreviewEntry(null);
// };




// const previewCashDifference = Number(
//   (
//     Number(previewEntry?.total || 0) -
//     Number(previewEntry?.totalCash || 0)
//   ).toFixed(2)
// );

// const previewCashMatched =
//   Math.abs(previewCashDifference) < 0.01;


//   // ==========================================================
//   // SALES RECONCILIATION
//   // ==========================================================

// const [salesSummary, setSalesSummary] = useState({
//   regularCash: 0,
//   regularOnline: 0,

//   dealerCash: 0,
//   dealerOnline: 0,

//   catererCash: 0,
//   catererOnline: 0,

//   totalCash: 0,
//   totalOnline: 0,
//   totalCollection: 0,
//   salesTotalTillNow: 0,

//   summaryCutoffDateTime: "",
// });

//   const [showReconciliation, setShowReconciliation] = useState(false);

//   const [savedDenominationTotal, setSavedDenominationTotal] = useState(0);

//   const [cashDifference, setCashDifference] = useState(0);

//   const [isCashMatched, setIsCashMatched] = useState(false);

//   // ==========================================================
//   // ENTRY NUMBER
//   // ==========================================================

//   const [entryNo, setEntryNo] = useState("");

//   // ==========================================================
//   // ENTRY DATE
//   // ==========================================================

//   const [entryDate, setEntryDate] = useState(new Date());

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   // ==========================================================
//   // DENOMINATION MASTER
//   // ==========================================================

//   const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

//   // ==========================================================
//   // DENOMINATION ROWS
//   // ==========================================================

//   const [denominationRows, setDenominationRows] = useState([]);

//   // ==========================================================
//   // CREATE EMPTY ROWS
//   // ==========================================================

//   const createEmptyRows = () => {
//     return denominationValues.map((value) => ({
//       denomination: value,
//       quantity: "",
//       amount: 0,
//     }));
//   };

//   // ==========================================================
//   // FORMAT DENOMINATION
//   // ==========================================================

//   const formatDenomination = (value) => {
//     if (value === 0.5) {
//       return "0.50";
//     }

//     return String(value);
//   };

//   // ==========================================================
//   // FORMAT DATE FOR DISPLAY
//   // ==========================================================

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };



// // Format Summary Cutoff in Indian Standard Time
// const formatCutoffIST = (value) => {
//   if (!value) {
//     return "Not available";
//   }

//   const rawValue = String(value).trim();

//   // Database datetime without timezone is treated as IST.
//   const match = rawValue.match(
//     /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/
//   );

//   if (match) {
//     const [, year, month, day, hour, minute, second = "00"] = match;

//    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
//   }

//   // If the value includes a timezone, convert it to IST.
//   const parsedDate = new Date(rawValue);

//   if (Number.isNaN(parsedDate.getTime())) {
//     return "Not available";
//   }

//   return (
//     new Intl.DateTimeFormat("en-IN", {
//       timeZone: "Asia/Kolkata",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     }).format(parsedDate) + " IST"
//   );
// };



//   // ==========================================================
//   // FORMAT DATE FOR API
//   // ==========================================================

//   const formatApiDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const d = new Date(value);

//     if (isNaN(d.getTime())) {
//       return "";
//     }

//     const year = d.getFullYear();

//     const month = String(d.getMonth() + 1).padStart(2, "0");

//     const day = String(d.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   // ==========================================================
//   // CHECK SAME DATE
//   // ==========================================================

//   const isSameDate = (date1, date2) => {
//     if (!date1 || !date2) {
//       return false;
//     }

//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   // ==========================================================
//   // GET INVOICE DATE VALUE
//   // ==========================================================

//   const getInvoiceDateValue = (invoice) => {
//     const value = invoice?.InvoiceDate;

//     if (!value) {
//       return null;
//     }

//     // API sometimes returns:
//     // { date: "2026-09-30 18:30:00" }

//     if (typeof value === "object" && value?.date) {
//       return value.date;
//     }

//     return value;
//   };

//   // ==========================================================
//   // GET INVOICE DATETIME
//   // ==========================================================

//   const getInvoiceDateTime = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return null;
//     }

//     const dateObject = new Date(rawValue);

//     if (!isNaN(dateObject.getTime())) {
//       return dateObject;
//     }

//     return null;
//   };

//   // ==========================================================
//   // GET DATE ONLY FROM INVOICE
//   // ==========================================================

//   const getInvoiceDateOnly = (invoice) => {
//     const rawValue = getInvoiceDateValue(invoice);

//     if (!rawValue) {
//       return "";
//     }

//     const stringValue = String(rawValue);

//     return stringValue.substring(0, 10);
//   };

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================


// const resetForm = () => {
//   setEntryNo("");
//   setEntryDate(new Date());
//   setEditingEntry(null);
//   setSaveCompleted(false);
//   setDenominationRows(createEmptyRows());

//   setSalesSummary({
//     regularCash: 0,
//     regularOnline: 0,
//     dealerCash: 0,
//     dealerOnline: 0,
//     catererCash: 0,
//     catererOnline: 0,
//     totalCash: 0,
//     totalOnline: 0,
//     totalCollection: 0,
//     salesTotalTillNow: 0,
//     summaryCutoffDateTime: "",
//   });

//   setSavedDenominationTotal(0);
//   setShowReconciliation(false);
//   setCashDifference(0);
//   setIsCashMatched(false);
// };


//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//      const createdBy = sessionStorage.getItem("CreatedBy") || "";

// const url =
//   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}` +
//   `&CreatedBy=${encodeURIComponent(createdBy)}`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Entry No API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       const data = Array.isArray(result?.data) ? result.data : [];

//       if (data.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const entryNumbers = data
//         .map((item) => Number(item?.EntryNo))
//         .filter((value) => !Number.isNaN(value));

//       if (entryNumbers.length === 0) {
//         setEntryNo("1");
//         return;
//       }

//       const maxEntryNo = Math.max(...entryNumbers);

//       setEntryNo(String(maxEntryNo + 1));
//     } catch (error) {
//       console.error("GENERATE ENTRY NO ERROR:", error);

//       setEntryNo("1");

//       toast.error("Unable to generate Entry No");
//     }
//   };

//   // ==========================================================
//   // FETCH SALES SUMMARY
//   //
//   // REQUIREMENT:
//   //
//   // Sales Entry
//   // + Sales Dealer
//   // + Sales Caterers
//   //
//   // selected date
//   // +
//   // till current time for today's date
//   //
//   // SUM invoice.Total
//   // ==========================================================

//   const fetchSalesSummary = async (selectedDate) => {
//     try {
//       if (!selectedDate) {
//         return;
//       }

//       const selectedDateString = formatApiDate(selectedDate);
      

//       const now = new Date();



//       // Logged-in user ID used for invoice filtering
// const loggedInCreatedBy = Number(
//   sessionStorage.getItem("CreatedBy") || 0
// );

// const loggedInIsAdmin = loggedInCreatedBy === 1;

// console.log("LOGGED-IN CREATED BY:", loggedInCreatedBy);
// console.log("IS ADMIN:", loggedInIsAdmin);

//       console.log("====================================");

//       console.log("FETCH SALES SUMMARY");

//       console.log("SELECTED DATE:", selectedDateString);

//       console.log("CURRENT TIME:", now);

//       // ======================================================
//       // FETCH FIRST PAGE
//       // ======================================================

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const firstResponse = await fetch(
//         `${INVOICE_API}?Table=invoiceheader&PageNo=1`,
//         requestOptions,
//       );

//       if (!firstResponse.ok) {
//         throw new Error(`Sales API failed: ${firstResponse.status}`);
//       }

//       const firstResult = await firstResponse.json();

//       let allInvoices = [...(firstResult?.data || [])];

//       const totalPages = Number(firstResult?.total_pages || 1);

//       console.log("TOTAL INVOICE PAGES:", totalPages);

//       // ======================================================
//       // FETCH ALL REMAINING PAGES
//       // ======================================================

//       if (totalPages > 1) {
//         for (let page = 2; page <= totalPages; page++) {
//           try {
//             const response = await fetch(
//               `${INVOICE_API}?Table=invoiceheader&PageNo=${page}`,
//               requestOptions,
//             );

//             if (!response.ok) {
//               console.warn("Invoice page failed:", page);

//               continue;
//             }

//             const result = await response.json();

//             allInvoices = [...allInvoices, ...(result?.data || [])];
//           } catch (pageError) {
//             console.error("PAGE FETCH ERROR:", page, pageError);
//           }
//         }
//       }

//       console.log("TOTAL ALL INVOICES:", allInvoices.length);



      
// console.log("========== INVOICE FILTER DEBUG ==========");
// console.log("Selected date:", selectedDateString);
// console.log("Login CreatedBy:", loggedInCreatedBy);
// console.log("First invoice object:", allInvoices[0]);

// console.table(
//   allInvoices.slice(0, 20).map((invoice) => ({
//     InvoiceNo: invoice?.InvoiceNo,
//     InvoiceDate: invoice?.InvoiceDate,
//     NormalizedDate: getInvoiceDateOnly(invoice),
//     CreatedBy: invoice?.CreatedBy,
//     UserId: invoice?.UserId,
//     Total: invoice?.Total,
//   }))
// );

// const dateMatchedInvoices = allInvoices.filter(
//   (invoice) =>
//     getInvoiceDateOnly(invoice) === selectedDateString
// );

// const userMatchedInvoices = allInvoices.filter(
//   (invoice) =>
//     Number(invoice?.CreatedBy ?? 0) === loggedInCreatedBy
// );

// console.log("DATE MATCHED COUNT:", dateMatchedInvoices.length);
// console.log("USER MATCHED COUNT:", userMatchedInvoices.length);


//       // ======================================================
//       // FILTER SALES
//       //
//       // ALL INVOICEHEADER SALES ARE CONSIDERED:
//       //
//       // Sales Entry
//       // Dealer
//       // Caterers
//       //
//       // If your backend has other invoice types in
//       // invoiceheader, then SaleType filter can be added.
//       // ======================================================

//      const selectedInvoices = allInvoices.filter((invoice) => {
//   // 1. Filter invoices by selected date
//   const invoiceDateOnly = getInvoiceDateOnly(invoice);

//   if (invoiceDateOnly !== selectedDateString) {
//     return false;
//   }

//   // 2. Get logged-in user's CreatedBy
//   const loggedInCreatedBy = Number(
//     sessionStorage.getItem("CreatedBy") || 0
//   );

//   // 3. Admin can see all users' invoices
//   const loggedInIsAdmin = loggedInCreatedBy === 1;

//   // 4. Sale and Sale2 can see only their own invoices
//   if (!loggedInIsAdmin) {
//     const invoiceCreatedBy = Number(invoice?.CreatedBy ?? 0);

//     if (invoiceCreatedBy !== loggedInCreatedBy) {
//       return false;
//     }
//   }

//   // 5. If selected date is today, include invoices only up to now
//   if (isSameDate(selectedDate, now)) {
//     const invoiceDateTime = getInvoiceDateTime(invoice);

//     if (invoiceDateTime) {
//       return invoiceDateTime.getTime() <= now.getTime();
//     }

//     // If API provides only the date, include today's invoice
//     return true;
//   }

//   // 6. For past dates, include all invoices of that date
//   return true;
// });

// // Debug logs
// console.log(
//   "LOGGED-IN CREATED BY:",
//   sessionStorage.getItem("CreatedBy")
// );

// console.log(
//   "FILTERED INVOICE COUNT:",
//   selectedInvoices.length
// );

// console.log(
//   "FILTERED INVOICES:",
//   selectedInvoices
// );

//       console.log("SELECTED SALES INVOICES:", selectedInvoices);

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       // ======================================================
//       // CALCULATE VALUES
//       // ======================================================

//       let totalCash = 0;
//       let totalOnline = 0;
//       let salesTotalTillNow = 0;

//       selectedInvoices.forEach((invoice) => {
//         // ====================================================
//         // INVOICE TOTAL
//         // ====================================================

//         const invoiceTotal = Number(invoice?.Total || 0);

//         // ====================================================
//         // PAYMENT MODE
//         //
//         // C = Cash
//         // O = Online
//         // M = Mixed
//         // ====================================================

//         const paymentMode = String(invoice?.PaymentMode || "")
//           .trim()
//           .toUpperCase();

//         // ====================================================
//         // CASH AMOUNT
//         // ====================================================

//         const cashAmount = Number(invoice?.CashAmount || 0);

//         // ====================================================
//         // ONLINE AMOUNT
//         // ====================================================

//         const onlineAmount = Number(invoice?.OnlineAmount || 0);

//         // ====================================================
//         // SALES TOTAL
//         //
//         // Sales Entry
//         // + Dealer
//         // + Caterers
//         // ====================================================

//         salesTotalTillNow += invoiceTotal;

//         // ====================================================
//         // PAYMENT MODE WISE CALCULATION
//         // ====================================================

//         if (paymentMode === "C" || paymentMode === "CASH") {
//           // ----------------------------------------------
//           // CASH SALE
//           // ----------------------------------------------

//           totalCash += invoiceTotal;
//         } else if (paymentMode === "O" || paymentMode === "ONLINE") {
//           // ----------------------------------------------
//           // ONLINE SALE
//           // ----------------------------------------------

//           totalOnline += invoiceTotal;
//         } else if (paymentMode === "M" || paymentMode === "MIXED") {
//           // ----------------------------------------------
//           // MIXED PAYMENT
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         } else {
//           // ----------------------------------------------
//           // FALLBACK
//           //
        
//           // ----------------------------------------------

//           totalCash += cashAmount;

//           totalOnline += onlineAmount;
//         }
//       });

//       // ======================================================
//       // ROUND VALUES
//       // ======================================================

//       salesTotalTillNow = Number(salesTotalTillNow.toFixed(2));

//       totalCash = Number(totalCash.toFixed(2));

//       totalOnline = Number(totalOnline.toFixed(2));

//       console.log("========== PAYMENT SUMMARY ==========");

//       console.table(
//         selectedInvoices.map((invoice) => ({
//           InvoiceNo: invoice?.InvoiceNo,
//           Total: Number(invoice?.Total || 0),
//           PaymentMode: invoice?.PaymentMode,
//           CashAmount: Number(invoice?.CashAmount || 0),
//           OnlineAmount: Number(invoice?.OnlineAmount || 0),
//         })),
//       );

//       console.log("FINAL SALES TOTAL:", salesTotalTillNow);

//       console.log("FINAL TOTAL CASH:", totalCash);

//       console.log("FINAL TOTAL ONLINE:", totalOnline);

//       console.log("CASH + ONLINE:", totalCash + totalOnline);

//       console.log("======================================");

//       const totalCollection = salesTotalTillNow;




      
//       const cutoffNow = new Date();
//       const pad = (value) => String(value).padStart(2, "0");

//       const summaryCutoffDateTime =
//         `${cutoffNow.getFullYear()}-${pad(cutoffNow.getMonth() + 1)}-${pad(cutoffNow.getDate())} ` +
//         `${pad(cutoffNow.getHours())}:${pad(cutoffNow.getMinutes())}:${pad(cutoffNow.getSeconds())}`;


//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

     
// setSalesSummary({
//   regularCash: 0,
//   regularOnline: 0,
//   dealerCash: 0,
//   dealerOnline: 0,
//   catererCash: 0,
//   catererOnline: 0,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   salesTotalTillNow,
//   summaryCutoffDateTime,
// });


//       console.log("====================================");

//       console.log(
//         "SALES TOTAL TILL NOW:",
//         Number(salesTotalTillNow || 0).toFixed(2),
//       );

//       console.log("TOTAL CASH:", Number(totalCash || 0).toFixed(2));

//       console.log("TOTAL ONLINE:", Number(totalOnline || 0).toFixed(2));

//       console.log("TOTAL COLLECTION:", Number(totalCollection || 0).toFixed(2));

//       console.log(
//         "CASH + ONLINE:",
//         (Number(totalCash || 0) + Number(totalOnline || 0)).toFixed(2),
//       );

//       console.log("SELECTED INVOICE COUNT:", selectedInvoices.length);

//       console.log("====================================");
//     } catch (error) {
//       console.error("FETCH SALES SUMMARY ERROR:", error);

//       toast.error("Unable to fetch Sales Summary");
//     }
//   };

//   // ==========================================================
//   // GET DENOMINATION DATA
//   // ==========================================================

// const fetchDenominationEntries = async () => {
//   try {
//     const currentCreatedBy = Number(
//       sessionStorage.getItem("CreatedBy") || 0
//     );

//     const isAdmin = currentCreatedBy === 1;

//     const params = new URLSearchParams({
//       Id: "",
//       BranchId: String(BRANCH_ID),
//     });

//     if (!isAdmin) {
//       params.set("CreatedBy", String(currentCreatedBy));
//     }

//     const url = `${GET_DENOMINATION_API}?${params.toString()}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(
//         `GET API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     if (!result.success) {
//       throw new Error(
//         result.message || "Unable to load denomination entries"
//       );
//     }

//     if (!Array.isArray(result.data)) {
//       setEntries([]);
//       setPageNo(1);
//       return;
//     }

//     const groupedEntries = {};

//     result.data.forEach((item) => {
//       const entryNo = String(item.EntryNo ?? "");
//       const branchId = String(item.BranchId ?? "");
//       const createdBy = String(item.CreatedBy ?? "");

//       const groupKey = `${branchId}_${createdBy}_${entryNo}`;

//       if (!groupedEntries[groupKey]) {
//         groupedEntries[groupKey] = {
//           id: item.Id,
//           apiId: item.Id,
//           branchId: item.BranchId,
//           entryNo: item.EntryNo,
//           entryDate: item.EntryDate,
//           entryDateText: formatDate(item.EntryDate),
//           total: 0,
//           denominations: [],
//           active: Number(item.Active || 0),
//           createdBy: item.CreatedBy,
//           updatedBy: item.UpdatedBy,
//           updatedCount: item.UpdatedCount,
//           createdByName:
//   Number(item.CreatedBy) === 1
//     ? "Admin"
//     : Number(item.CreatedBy) === 2
//     ? "Sale"
//     : Number(item.CreatedBy) === 3
//     ? "Sale2"
//     : "Unknown",
//           salesTotalTillNow: Number(item.SalesTotalTillNow || 0),
//           totalCash: Number(item.TotalCash || 0),
//           totalOnline: Number(item.TotalOnline || 0),
//           totalCollection: Number(item.TotalCollection || 0),
//           summaryCutoffDateTime:
//             item.SummaryCutoffDateTime || "",
//         };
//       }

//       const amount = Number(item.Amount || 0);

//       groupedEntries[groupKey].total += amount;

//       groupedEntries[groupKey].denominations.push({
//         id: item.Id,
//         notes: Number(item.Notes || 0),
//         numbers: Number(item.Numbers || 0),
//         amount,
//       });
//     });

//     const formattedEntries = Object.values(groupedEntries);

//     formattedEntries.sort((a, b) => {
//       const dateA = a.entryDate
//         ? new Date(a.entryDate).getTime()
//         : 0;

//       const dateB = b.entryDate
//         ? new Date(b.entryDate).getTime()
//         : 0;

//       if (dateA !== dateB) {
//         return dateB - dateA;
//       }

//       return Number(b.entryNo || 0) - Number(a.entryNo || 0);
//     });

//     console.log(
//       "DENOMINATION ENTRIES - LATEST FIRST:",
//       formattedEntries
//     );

//     setEntries(formattedEntries);

//     const calculatedPages = Math.ceil(
//       formattedEntries.length / 10
//     );

//     if (calculatedPages === 0) {
//       setPageNo(1);
//     } else {
//       setPageNo((previousPage) =>
//         previousPage > calculatedPages
//           ? calculatedPages
//           : previousPage
//       );
//     }
//   } catch (error) {
//     console.error("GET DENOMINATION ERROR:", error);

//     toast.error("Unable to load Denomination Entries");
//   }
// };

//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {
//     setDenominationRows(createEmptyRows());

//     fetchDenominationEntries();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = async () => {
//     resetForm();

//     const today = new Date();

//     setEntryDate(today);

//     setOpenForm(true);

//     // Fetch current sales total
//     await fetchSalesSummary(today);

//     // Generate entry no
//     await generateNextEntryNo();
//   };

//   // ==========================================================
//   // CLOSE FORM
//   // ==========================================================

//   const handleCloseForm = () => {
//     if (saving) {
//       return;
//     }

//     setOpenForm(false);

//     resetForm();
//   };

//   // ==========================================================
//   // EDIT DENOMINATION ENTRY
//   // ==========================================================

 


// const handleEditEntry = async (entry) => {
//   try {
//     // 1. Validate selected entry
//     if (!entry) {
//       toast.error("Denomination entry not found");
//       return;
//     }

//     setSaveCompleted(false);
//     setEditingEntry(entry);

//     // 2. Restore Entry Number
//     setEntryNo(String(entry.entryNo ?? ""));

//     // 3. Restore Entry Date without timezone conversion
//     const rawDate = String(entry.entryDate ?? "");
//     const datePart = rawDate.substring(0, 10);

//     let validEditDate;

//     if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
//       const [year, month, day] = datePart
//         .split("-")
//         .map(Number);

//       validEditDate = new Date(year, month - 1, day);
//     } else {
//       validEditDate = new Date(
//         entry.entryDate || Date.now()
//       );
//     }

//     if (Number.isNaN(validEditDate.getTime())) {
//       toast.error("Invalid denomination entry date");
//       return;
//     }

//     setEntryDate(validEditDate);

//     // 4. Restore existing denomination rows
//     const emptyRows = createEmptyRows();

//     const existingDenominations = Array.isArray(
//       entry.denominations
//     )
//       ? entry.denominations
//       : [];

//     const editRows = emptyRows.map((row) => {
//       const existing = existingDenominations.find(
//         (item) =>
//           Number(item.notes) === Number(row.denomination)
//       );

//       if (!existing) {
//         return {
//           ...row,
//           id: null,
//           quantity: "",
//           amount: 0,
//         };
//       }

//       const quantity = Number(existing.numbers ?? 0);

//       return {
//         ...row,
//         id: existing.id ?? existing.Id ?? null,
//         quantity: quantity > 0 ? String(quantity) : "",
//         amount: Number(existing.amount ?? 0),
//       };
//     });

//     setDenominationRows(editRows);

//     // 5. Restore saved Summary values
//     const savedSummary = {
//       totalCash: Number(entry.totalCash ?? 0),
//       totalOnline: Number(entry.totalOnline ?? 0),
//       totalCollection: Number(entry.totalCollection ?? 0),
//       salesTotalTillNow: Number(
//         entry.salesTotalTillNow ?? 0
//       ),
//       summaryCutoffDateTime:
//         entry.summaryCutoffDateTime ?? "",
//     };

//     const hasSavedSummary =
//       savedSummary.totalCash !== 0 ||
//       savedSummary.totalOnline !== 0 ||
//       savedSummary.totalCollection !== 0 ||
//       savedSummary.salesTotalTillNow !== 0;

//     console.log("EDIT ENTRY:", entry);
//     console.log("EDIT ENTRY DATE:", datePart);
//     console.log("SAVED SUMMARY:", savedSummary);
//     console.log("HAS SAVED SUMMARY:", hasSavedSummary);

//     // 6. Restore saved Summary or fetch it if unavailable
//     if (hasSavedSummary) {
//       setSalesSummary((previous) => ({
//         ...previous,
//         ...savedSummary,
//       }));
//     } else {
//       await fetchSalesSummary(validEditDate);
//     }

//     // 7. Reset reconciliation state
//     setShowReconciliation(false);
//     setCashDifference(0);
//     setIsCashMatched(false);
//     setSavedDenominationTotal(0);

//     // 8. Open Edit form
//     setOpenForm(true);
//   } catch (error) {
//     console.error("EDIT DENOMINATION ERROR:", error);

//     toast.error(
//       error?.message ||
//         "Unable to open denomination entry for edit"
//     );
//   }
// };





//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (index, value) => {
//     // Empty
//     if (value === "") {
//       setDenominationRows((previousRows) =>
//         previousRows.map((row, rowIndex) => {
//           if (rowIndex === index) {
//             return {
//               ...row,
//               quantity: "",
//               amount: 0,
//             };
//           }

//           return row;
//         }),
//       );

//       return;
//     }

//     // Only integer
//     if (!/^\d+$/.test(value)) {
//       return;
//     }

//     const quantity = Number(value);

//     setDenominationRows((previousRows) =>
//       previousRows.map((row, rowIndex) => {
//         if (rowIndex === index) {
//           const amount = row.denomination * quantity;

//           return {
//             ...row,
//             quantity: value,
//             amount,
//           };
//         }

//         return row;
//       }),
//     );
//   };

//   // ==========================================================
//   // TOTAL DENOMINATION
//   // ==========================================================

//   const total = useMemo(() => {
//     return denominationRows.reduce(
//       (sum, row) => sum + Number(row.amount || 0),
//       0,
//     );
//   }, [denominationRows]);

//   // ==========================================================
//   // UPDATE DENOMINATION API
//   // ==========================================================

//   const updateDenomination = async ({
//     id,
//     branchId,
//     date,
//     notes,
//     numbers,
//     amount,
//     updatedBy,
//   }) => {
//     const formData = new FormData();

//     formData.append("Id", String(id));

//     formData.append("BranchId", String(branchId || BRANCH_ID));

//     formData.append("EntryDate", formatApiDate(date));

//     formData.append("Notes", String(Number(notes || 0)));

//     formData.append("Numbers", String(Number(numbers || 0)));

//     formData.append("Amount", Number(amount || 0).toFixed(2));

//     formData.append("UpdatedBy", String(updatedBy || ""));

//     const response = await fetch(UPDATE_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Unable to update denomination");
//     }

//     return result;
//   };

//   // ==========================================================
//   // CREATE DENOMINATION API
//   // ==========================================================

  



// const createDenomination = async ({
//   entryNo,
//   entryDate,
//   denomination,
//   quantity,
//   amount,
//   branchId,
//   createdBy,
//   userId,
//   saleRole,
//   drawerId,
//   salesTotalTillNow,
//   totalCash,
//   totalOnline,
//   totalCollection,
//   summaryCutoffDateTime,
// }) => {
//   try {
//     // ========================================
//     // 1. PREPARE AND VALIDATE VALUES
//     // ========================================
//     const resolvedBranchId = Number(branchId || BRANCH_ID);
//     const resolvedCreatedBy = Number(createdBy);
//     const notes = Number(denomination);
//     const numbers = Number(quantity);

//     const totalAmount =
//       amount !== undefined && amount !== null && amount !== ""
//         ? Number(amount)
//         : notes * numbers;

//     if (!Number.isFinite(resolvedBranchId) || resolvedBranchId <= 0) {
//       throw new Error("Please provide a valid BranchId.");
//     }

//     if (!Number.isFinite(resolvedCreatedBy) || resolvedCreatedBy <= 0) {
//       throw new Error("Please provide a valid CreatedBy.");
//     }

//     if (!Number.isFinite(notes) || notes <= 0) {
//       throw new Error("Please provide a valid denomination Notes value.");
//     }

//     if (!Number.isFinite(numbers) || numbers <= 0) {
//       throw new Error("Please provide a valid denomination quantity.");
//     }

//     if (!Number.isFinite(totalAmount) || totalAmount < 0) {
//       throw new Error("Please provide a valid denomination Amount.");
//     }

//     if (!entryDate) {
//       throw new Error("Please select Entry Date.");
//     }

//     // ========================================
//     // 2. FORMAT ENTRY DATE
//     // ========================================
//     const formattedEntryDate = formatApiDate(entryDate);

//     if (!formattedEntryDate) {
//       throw new Error("Invalid Entry Date.");
//     }

//     // ========================================
//     // 3. CREATE FORMDATA
//     // ========================================
//     const formData = new FormData();

//     formData.append("BranchId", String(resolvedBranchId));
//     formData.append("EntryDate", String(formattedEntryDate));
//     formData.append("Notes", String(notes));
//     formData.append("Numbers", String(numbers));
//     formData.append("Amount", totalAmount.toFixed(2));
//     formData.append("CreatedBy", String(resolvedCreatedBy));

//     formData.append("UserId", String(userId ?? ""));
//     formData.append("SaleRole", String(saleRole ?? ""));
//     formData.append("DrawerId", String(drawerId ?? ""));
//     formData.append("EntryNo", String(entryNo ?? "").trim());

//     formData.append(
//       "SalesTotalTillNow",
//       String(Number(salesTotalTillNow ?? 0))
//     );

//     formData.append("TotalCash", String(Number(totalCash ?? 0)));
//     formData.append("TotalOnline", String(Number(totalOnline ?? 0)));

//     formData.append(
//       "TotalCollection",
//       String(Number(totalCollection ?? 0))
//     );

//     formData.append(
//       "SummaryCutoffDateTime",
//       String(summaryCutoffDateTime ?? "")
//     );

//     // ========================================
//     // 4. LOG ACTUAL FORMDATA VALUES
//     // ========================================
//     const payloadForLog = {};

//     for (const [key, value] of formData.entries()) {
//       payloadForLog[key] = value;
//     }

//     console.log("========== DENOMINATION API REQUEST ==========");
//     console.log("API URL:", POST_DENOMINATION_API);
//     console.log("FORMDATA PAYLOAD:", payloadForLog);

//     // ========================================
//     // 5. CALL POST API
//     // ========================================
//     const response = await fetch(POST_DENOMINATION_API, {
//       method: "POST",
//       body: formData,
//     });

//     // ========================================
//     // 6. READ API RESPONSE
//     // ========================================
//     const responseText = await response.text();

//     console.log("DENOMINATION HTTP STATUS:", response.status);
//     console.log("DENOMINATION RAW RESPONSE:", responseText);

//     let result;

//     try {
//       result = JSON.parse(responseText);
//     } catch {
//       throw new Error(
//         `The API returned an invalid JSON response. HTTP ${response.status}. ` +
//           `Response: ${responseText.slice(0, 300)}`
//       );
//     }

//     // ========================================
//     // 7. CHECK HTTP AND API SUCCESS
//     // ========================================
//     if (!response.ok) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           `Denomination API failed. HTTP ${response.status}.`
//       );
//     }

//     // Support common API response formats.
//     const apiSuccess =
//       result.success === true ||
//       result.success === 1 ||
//       result.success === "true" ||
//       result.status === "success";

//     if (!apiSuccess) {
//       throw new Error(
//         result.message ||
//           result.error ||
//           "The API did not confirm that the denomination was saved."
//       );
//     }

//     console.log("DENOMINATION SAVED SUCCESSFULLY:", result);

//     return result;
//   } catch (error) {
//     console.error("CREATE DENOMINATION ERROR:", error);
//     throw error;
//   }
// };



//   // ==========================================================
//   // SAVE
//   //
//   // IMPORTANT:
//   // VALIDATION HAPPENS BEFORE POST API
//   // ==========================================================

//   // ==========================================================
//   // SAVE / UPDATE DENOMINATION
//   // ==========================================================




// const handleSave = async () => {
//   if (saving) {
//     return;
//   }

//   if (!entryNo || !entryNo.trim()) {
//     toast.error("Please enter Entry No");
//     return;
//   }

//   if (!entryDate || isNaN(new Date(entryDate).getTime())) {
//     toast.error("Please select a valid Entry Date");
//     return;
//   }

//   const rowsToSave = denominationRows.filter(
//     (row) => Number(row.quantity || 0) > 0
//   );

//   if (rowsToSave.length === 0) {
//     toast.error("Please enter at least one denomination quantity");
//     return;
//   }

//   const loggedInUserId =
//     sessionStorage.getItem("UserId") ||
//     sessionStorage.getItem("LoginUserId") ||
//     "";

//   const loggedInSaleRole =
//     sessionStorage.getItem("UserRole") || "";

//   const currentCreatedBy = Number(
//     sessionStorage.getItem("CreatedBy") || 0
//   );

//   const drawerId =
//     sessionStorage.getItem("Device") || "";

//   if (
//     !loggedInUserId ||
//     !loggedInSaleRole ||
//     !currentCreatedBy
//   ) {
//     toast.error(
//       "Login details are incomplete. Please login again."
//     );
//     return;
//   }

//   try {
//     setSaving(true);

//     const userDetails = {
//       userId: loggedInUserId,
//       saleRole: loggedInSaleRole,
//       drawerId,
//     };

//     const denominationTotal = Number(
//       rowsToSave
//         .reduce((sum, row) => {
//           const denomination = Number(row.denomination || 0);
//           const quantity = Number(row.quantity || 0);

//           return sum + denomination * quantity;
//         }, 0)
//         .toFixed(2)
//     );

//     // Read the current sales summary
//     const salesTotalTillNow = Number(
//       salesSummary?.salesTotalTillNow ?? 0
//     );

//     const cashTotal = Number(
//       salesSummary?.totalCash ?? 0
//     );

//     const onlineTotal = Number(
//       salesSummary?.totalOnline ?? 0
//     );

//     const totalCollection = Number(
//       salesSummary?.totalCollection ?? 0
//     );

//     const summaryCutoffDateTime =
//       salesSummary?.summaryCutoffDateTime || "";

//     // Debug the values before saving
//     console.log("SALES SUMMARY BEFORE SAVE:", salesSummary);

//     console.log("SUMMARY VALUES SENT:", {
//       SalesTotalTillNow: salesTotalTillNow,
//       TotalCash: cashTotal,
//       TotalOnline: onlineTotal,
//       TotalCollection: totalCollection,
//       SummaryCutoffDateTime: summaryCutoffDateTime,
//       CreatedBy: currentCreatedBy,
//     });

//     // Stop saving if the summary is not loaded
//     if (
//       salesTotalTillNow === 0 &&
//       cashTotal === 0 &&
//       onlineTotal === 0 &&
//       totalCollection === 0
//     ) {
//       toast.error(
//         "Sales summary is zero. Please refresh the sales summary before saving."
//       );
//       return;
//     }

//     const difference = Number(
//       (denominationTotal - cashTotal).toFixed(2)
//     );

//     const matched = Math.abs(difference) < 0.01;

//     setSavedDenominationTotal(denominationTotal);
//     setCashDifference(difference);
//     setIsCashMatched(matched);
//     setShowReconciliation(true);

//     const snapshotData = {
//       salesTotalTillNow,
//       totalCash: cashTotal,
//       totalOnline: onlineTotal,
//       totalCollection,
//       summaryCutoffDateTime,
//     };

//     const createEntry = async (row) => {
//       const denomination = Number(row.denomination || 0);
//       const quantity = Number(row.quantity || 0);

//       const amount = Number(
//         (denomination * quantity).toFixed(2)
//       );

//       await createDenomination({
//         entryNo: entryNo.trim(),
//         entryDate,
//         denomination,
//         quantity,
//         amount,
//         branchId: BRANCH_ID,
//         createdBy: currentCreatedBy,
//         ...userDetails,
//         ...snapshotData,
//       });
//     };

//     if (editingEntry) {
//       for (const row of denominationRows) {
//         const denomination = Number(row.denomination || 0);
//         const quantity = Number(row.quantity || 0);

//         const amount = Number(
//           (denomination * quantity).toFixed(2)
//         );

//         if (row.id) {
//           if (quantity <= 0) {
//             continue;
//           }

//           await updateDenomination({
//             id: row.id,
//             branchId: BRANCH_ID,
//             date: entryDate,
//             notes: denomination,
//             numbers: quantity,
//             amount,
//             updatedBy: currentCreatedBy,
//             ...userDetails,
//           });
//         } else if (quantity > 0) {
//           await createEntry(row);
//         }
//       }

//       toast.success(
//         "Denomination Entry updated successfully!"
//       );
//     } else {
//       for (const row of rowsToSave) {
//         await createEntry(row);
//       }

//       toast.success(
//         "Denomination Entry saved successfully!"
//       );
//     }

//     await fetchDenominationEntries();

//     setSaveCompleted(true);
//     setEditingEntry(null);
//   } catch (error) {
//     console.error("Denomination Save Error:", error);

//     toast.error(
//       error?.message || "Unable to save Denomination Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };






//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

 
// const pageSize = 10;

// const totalPages = Math.ceil(entries.length / pageSize);

// const paginatedEntries = entries.slice(
//   (pageNo - 1) * pageSize,
//   pageNo * pageSize
// );


//   // ==========================================================
//   // TABLE COLUMNS
//   // ==========================================================


// const columns = useMemo(
//   () => [
//     {
//       accessorKey: "srNo",
//       header: "Sr.No",
//       size: 80,
//       Cell: ({ row }) => {
//         const index = entries.findIndex(
//           (item) => item.id === row.original.id
//         );

//         return index + 1;
//       },
//     },

//     {
//       accessorKey: "entryNo",
//       header: "Entry No",
//       size: 150,
//     },

//     {
//       accessorKey: "entryDateText",
//       header: "Entry Date",
//       size: 160,
//     },

//     // Sales By column - Admin only
//     ...(isAdmin
//       ? [
//           {
//             accessorKey: "createdByName",
//             header: "Created  By",
//             size: 140,
//             Cell: ({ row }) => {
//               const createdBy = Number(
//                 row.original.createdBy
//               );

//               if (createdBy === 1) return "Admin";
//               if (createdBy === 2) return "Sale";
//               if (createdBy === 3) return "Sale2";

//               return "Unknown";
//             },
//           },
//         ]
//       : []),

//     {
//       accessorKey: "total",
//       header: "Total",
//       size: 150,
//       Cell: ({ cell }) => (
//         <span>
//           ₹ {Number(cell.getValue() || 0).toFixed(2)}
//         </span>
//       ),
//     },

//     {
//       header: "Actions",
//       size: 180,
//       enableSorting: false,
//       enableColumnFilter: false,
//       Cell: ({ row }) => (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           gap={1}
//         >
//           {/* Preview */}
//           <Tooltip title="Preview">
//             <IconButton
//               color="info"
//               size="small"
//               onClick={() => handlePreviewEntry(row.original)}
//             >
//               <VisibilityIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>

//           {/* Edit */}
//           <Tooltip title="Edit">
//             <IconButton
//               color="primary"
//               size="small"
//               onClick={() => handleEditEntry(row.original)}
//             >
//               <EditIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       ),
//     },
//   ],
//   [entries, isAdmin, handleEditEntry, handlePreviewEntry]
// );


//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{
//           width: "100%",
//           minHeight: "100%",
//           p: 5,
//           boxSizing: "border-box",

//           "@media (max-width: 768px)": {
//             p: 2,
//           },
//         }}
//       >
//         {/* ==================================================
//             PAGE TITLE
//         ================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Denomination Entry</b>
//           </Typography>
//         </Box>

//         {/* ==================================================
//             CREATE BUTTON
//         ================================================== */}

//         <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//           }}
//         >
//           <Button
//             sx={{
//               background: "var(--complementary-color)",

//               "&:hover": {
//                 background: "var(--complementary-color)",
//               },

//               borderRadius: "5px 5px 0 0",

//               textTransform: "uppercase",

//               fontSize: "16px",

//               fontWeight: 500,

//               px: 2.5,

//               py: 1.5,
//             }}
//             variant="contained"
//             onClick={handleOpenForm}
//           >
//             CREATE DENOMINATION ENTRY
//           </Button>
//         </Box>

//         {/* ==================================================
//             MAIN TABLE
//         ================================================== */}

//         <MaterialReactTable
//   columns={columns}
//   data={paginatedEntries}
//   enablePagination={false}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: "#E9ECEF",

//               color: "black",

//               fontSize: "16px",

//               fontWeight: "bold",
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               fontSize: "15px",
//             },
//           }}
//           muiTablePaperProps={{
//             elevation: 2,

//             sx: {
//               borderRadius: "0 4px 4px 4px",

//               overflow: "hidden",

//               boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//             },
//           }}
//           muiTableContainerProps={{
//             sx: {
//               maxHeight: "none",
//             },
//           }}
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               mb={1}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//               pr={2}
//               gap={0.5}
//             >
//               <FirstPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(1);
//                   }
//                 }}
//               />

//               <KeyboardArrowLeftIcon
//                 sx={{
//                   cursor: pageNo > 1 ? "pointer" : "default",

//                   color: pageNo > 1 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                 }}
//               />

//               <Box ml={1}>Page No</Box>

//               <TextField
//                 sx={{
//                   width: "65px",

//                   ml: 1,

//                   "& .MuiInputBase-input": {
//                     textAlign: "center",

//                     padding: "8px 5px",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => {
//                   let value = Number(e.target.value);

//                   if (value < 1 || isNaN(value)) {
//                     value = 1;
//                   }

//                   if (totalPages > 0 && value > totalPages) {
//                     value = totalPages;
//                   }

//                   setPageNo(value);
//                 }}
//                 size="small"
//               />

//               <KeyboardArrowRightIcon
//                 sx={{
//                   cursor: pageNo < totalPages ? "pointer" : "default",

//                   color: pageNo < totalPages ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (pageNo < totalPages) {
//                     setPageNo((prev) => Number(prev) + 1);
//                   }
//                 }}
//               />

//               <LastPageIcon
//                 sx={{
//                   cursor: totalPages > 0 ? "pointer" : "default",

//                   color: totalPages > 0 ? "inherit" : "#ccc",
//                 }}
//                 onClick={() => {
//                   if (totalPages > 0) {
//                     setPageNo(totalPages);
//                   }
//                 }}
//               />

//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
//         />

//         {/* ==================================================
//             DENOMINATION FORM
//         ================================================== */}

//         <Dialog
//           open={openForm}
//           onClose={handleCloseForm}
//           fullWidth
//           maxWidth="md"
//           PaperProps={{
//             sx: {
//               borderRadius: "6px",
//               maxHeight: "90vh",
//             },
//           }}
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <DialogTitle
//             sx={{
//               backgroundColor: "rgb(236, 253, 230)",

//               display: "flex",

//               justifyContent: "space-between",

//               alignItems: "center",

//               borderBottom: "1px solid #ddd",

//               py: 1.2,

//               px: 2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: 700,

//                 color: "#0B5E20",

//                 fontSize: "18px",
//               }}
//             >
//               Denomination Entry
//             </Typography>

//             <IconButton
//               onClick={handleCloseForm}
//               disabled={saving}
//               size="small"
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           {/* ==================================================
//               CONTENT
//           ================================================== */}

//           <DialogContent
//             dividers
//             sx={{
//               backgroundColor: "#fff",

//               p: {
//                 xs: 1.5,
//                 sm: 2,
//               },
//             }}
//           >
//             {/* =================================================
//                 ENTRY NO + DATE
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "1fr 1fr",
//                 },

//                 gap: 2,

//                 mt: 0.5,

//                 mb: 2,
//               }}
//             >
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry No:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   value={entryNo}
//                   onChange={(e) => setEntryNo(e.target.value)}
//                   placeholder="Enter Entry No"
//                   fullWidth
//                 />
//               </Box>

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry Date:
//                 </Typography>

//               <DatePicker
//   value={entryDate}
//   onChange={(newValue) => {
//     setEntryDate(newValue);

//     if (newValue && !editingEntry) {
//       fetchSalesSummary(newValue);
//     }
//   }}
//   format="dd-MM-yyyy"
//   slotProps={{
//     textField: {
//       size: "small",
//       fullWidth: true,
//     },
//   }}
// />
//               </Box>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 SALES SUMMARY
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Sales Summary:
//             </Typography>

          

// <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
//     },
//     gap: 1.5,
//     mb: 2,
//   }}
// >
//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "2px solid #0B5E20",
//         borderRadius: 1,
//         backgroundColor: "#f1fdf4",
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Sales Total Till Now
//       </Typography>

//       <Typography
//         fontSize="18px"
//         fontWeight={700}
//         color="#0B5E20"
//       >
//         ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Cash
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCash || 0).toFixed(2)}
//     </Typography>
//   </Paper>

//   {isAdmin && (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.5,
//         border: "1px solid #d0d0d0",
//         borderRadius: 1,
//       }}
//     >
//       <Typography fontSize="13px" color="text.secondary">
//         Total Online
//       </Typography>

//       <Typography fontSize="18px" fontWeight={700}>
//         ₹ {Number(salesSummary.totalOnline || 0).toFixed(2)}
//       </Typography>
//     </Paper>
//   )}

//   <Paper
//     elevation={0}
//     sx={{
//       p: 1.5,
//       border: "1px solid #d0d0d0",
//       borderRadius: 1,
//     }}
//   >
//     <Typography fontSize="13px" color="text.secondary">
//       Total Collection
//     </Typography>

//     <Typography fontSize="18px" fontWeight={700}>
//       ₹ {Number(salesSummary.totalCollection || 0).toFixed(2)}
//     </Typography>
//   </Paper>
// </Box>



//             <Divider
//               sx={{
//                 mb: 2,
//               }}
//             />

//             {/* =================================================
//                 DENOMINATION TITLE
//             ================================================= */}

//             <Typography fontWeight={700} fontSize="15px" mb={1}>
//               Denominations:
//             </Typography>

//             {/* =================================================
//                 DENOMINATION TABLE
//             ================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 border: "1px solid #d0d0d0",

//                 overflowX: "auto",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   minWidth: 600,

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",

//                     py: 0.8,

//                     px: 1,

//                     fontSize: "13px",
//                   },
//                 }}
//               >
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Notes
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Number / Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {denominationRows.map((row, index) => (
//                     <TableRow hover key={row.denomination}>
//                       <TableCell>
//                         <Typography fontWeight={600}>
//                           ₹ {formatDenomination(row.denomination)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell align="center">
//                         <TextField
//                           type="text"
//                           size="small"
//                           value={row.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(index, e.target.value)
//                           }
//                           placeholder="Enter Number"
//                           inputMode="numeric"
//                           inputProps={{
//                             inputMode: "numeric",
//                             pattern: "[0-9]*",
//                           }}
//                           onWheel={(e) => {
//                             e.currentTarget.blur();
//                           }}
//                           sx={{
//                             width: 150,
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell align="right">
//                         <TextField
//                           size="small"
//                           value={Number(row.amount || 0).toFixed(2)}
//                           InputProps={{
//                             readOnly: true,
//                           }}
//                           sx={{
//                             width: 160,
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 DENOMINATION TOTAL
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "flex",

//                 justifyContent: "flex-end",

//                 alignItems: "center",

//                 gap: 1,

//                 mt: 1.5,
//               }}
//             >
//               <Typography fontWeight={700} fontSize="14px">
//                 Denomination Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(
//                   showReconciliation ? savedDenominationTotal : total,
//                 ).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 160,
//                 }}
//               />
//             </Box>

//             {/* =================================================
//                 RECONCILIATION
//             ================================================= */}

//             {showReconciliation && (
//               <>
//                 <Divider
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                   }}
//                 />

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,

//                     border: "1px solid",

//                     borderColor: isCashMatched ? "success.main" : "error.main",

//                     borderRadius: 1,

//                     backgroundColor: isCashMatched ? "#f1fdf4" : "#fff5f5",
//                   }}
//                 >
//                   {/* =====================================================
//           CASH RECONCILIATION
//           Denomination Total VS Total Cash
//       ====================================================== */}

//                   <Typography
//                     fontWeight={700}
//                     fontSize="16px"
//                     sx={{
//                       mb: 2,
//                     }}
//                   >
//                     Cash Reconciliation
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "grid",

//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         sm: "repeat(3, 1fr)",
//                       },

//                       gap: 1.5,
//                     }}
//                   >
//                     {/* =================================================
//             TOTAL CASH
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Total Cash
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(salesSummary?.totalCash || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DENOMINATION TOTAL
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: "divider",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Denomination Total
//                       </Typography>

//                       <Typography fontWeight={700} fontSize="17px">
//                         ₹ {Number(savedDenominationTotal || 0).toFixed(2)}
//                       </Typography>
//                     </Box>

//                     {/* =================================================
//             DIFFERENCE
//         ================================================== */}

//                     <Box
//                       sx={{
//                         p: 1.5,

//                         border: "1px solid",

//                         borderColor: isCashMatched
//                           ? "success.light"
//                           : "error.light",

//                         borderRadius: 1,

//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       <Typography fontSize="13px" color="text.secondary">
//                         Difference
//                       </Typography>

//                      <Typography
//   fontWeight={700}
//   fontSize="17px"
//   color={isCashMatched ? "success.main" : "error.main"}
// >
//   ₹ {Number(cashDifference || 0).toFixed(2)}
// </Typography>
//                     </Box>
//                   </Box>

//                   {/* =====================================================
//           MATCH STATUS
//       ====================================================== */}

//                   <Typography
//                     sx={{
//                       mt: 2,

//                       fontWeight: 700,

//                       fontSize: "16px",

//                       color: isCashMatched ? "success.main" : "error.main",
//                     }}
//                   >
//                     {isCashMatched
//                       ? "✓ CASH TOTAL MATCHED"
//                       : "✗ CASH TOTAL MISMATCH"}
//                   </Typography>
//                 </Paper>
//               </>
//             )}
//           </DialogContent>

//           {/* ==================================================
//               ACTIONS
//           ================================================== */}

//           <DialogActions
//             sx={{
//               justifyContent: "flex-start",

//               px: 2,

//               py: 1.2,

//               gap: 1,
//             }}
//           >
//             <Button
//   variant="contained"
//   disabled={saving || saveCompleted}
//   onClick={handleSave}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",
//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving
//     ? "Saving..."
//     : saveCompleted
//     ? "Saved"
//     : "Save"}
// </Button>

//           <Button
//   variant="outlined"
//   disabled={saving}
//   onClick={handleCloseForm}
//   sx={{
//     textTransform: "none",
//     color: "var(--complementary-color)",
//     borderColor: "var(--complementary-color)",
//     "&:hover": {
//       borderColor: "var(--complementary-color)",
//     },
//   }}
// >
//   Close
// </Button>
//           </DialogActions>
//         </Dialog>


 

// <Dialog
//   open={previewOpen}
//   onClose={handleClosePreview}
//   fullWidth
//   maxWidth="md"
//   PaperProps={{
//     sx: {
//       borderRadius: 3,
//       maxHeight: "90vh",
//     },
//   }}
// >
//   <DialogTitle
//     sx={{
//       background: "linear-gradient(90deg, #08652B, #218447)",
//       color: "#fff",
//       fontWeight: 800,
//       py: 2,
//     }}
//   >
//     <Box display="flex" alignItems="center" gap={1.5}>
//       <VisibilityIcon />
//       <Box>
//         <Typography fontSize="22px" fontWeight={800}>
//           Denomination Entry Preview
//         </Typography>
//         <Typography fontSize="13px">
//           Entry details and sales summary
//         </Typography>
//       </Box>
//     </Box>
//   </DialogTitle>

//   <DialogContent
//     dividers
//     sx={{ backgroundColor: "#F5F8FC", p: 3 }}
//   >
//     {previewEntry && (
//       <>
//         {/* ENTRY DETAILS */}
//         <Paper
//           variant="outlined"
//           sx={{ p: 2, mb: 2, borderRadius: 2 }}
//         >
//           <Box
//             display="grid"
//             gridTemplateColumns="1fr 1fr"
//             gap={2}
//           >
//             <Box>
//               <Typography color="text.secondary" fontSize="13px">
//                 ENTRY NUMBER
//               </Typography>
//               <Typography fontSize="22px" fontWeight={800}>
//                 #{previewEntry.entryNo}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography color="text.secondary" fontSize="13px">
//                 ENTRY DATE
//               </Typography>
//               <Typography fontSize="22px" fontWeight={800}>
//                 {previewEntry.entryDateText}
//               </Typography>
//             </Box>
//           </Box>

//           {isAdmin && (
//             <Typography mt={1} fontWeight={600}>
//               Created By: {previewEntry.createdByName || "Unknown"}
//             </Typography>
//           )}
//         </Paper>

//         {/* SALES SUMMARY */}
//         <Typography fontWeight={800} fontSize="18px" mb={1.5}>
//           Sales Summary
//         </Typography>

//         <Box
//           display="grid"
//           gridTemplateColumns={{
//             xs: "1fr",
//             sm: isAdmin ? "1fr 1fr" : "1fr 1fr",
//           }}
//           gap={1.5}
//           mb={2.5}
//         >
//           {isAdmin && (
//             <Paper
//               sx={{
//                 p: 2,
//                 borderRadius: 2,
//                 backgroundColor: "#EAF2FF",
//                 border: "1px solid #BDD2FF",
//               }}
//             >
//               <Typography color="#245BC5" fontWeight={700}>
//                 Sales Total Till Now
//               </Typography>
//               <Typography color="#245BC5" fontSize="25px" fontWeight={800}>
//                 ₹ {Number(previewEntry.salesTotalTillNow || 0).toFixed(2)}
//               </Typography>
//             </Paper>
//           )}

//           <Paper
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               backgroundColor: "#E8F7EF",
//               border: "1px solid #B8DCC8",
//             }}
//           >
//             <Typography color="#17834A" fontWeight={700}>
//               Total Cash
//             </Typography>
//             <Typography color="#17834A" fontSize="25px" fontWeight={800}>
//               ₹ {Number(previewEntry.totalCash || 0).toFixed(2)}
//             </Typography>
//           </Paper>

//           {isAdmin && (
//             <Paper
//               sx={{
//                 p: 2,
//                 borderRadius: 2,
//                 backgroundColor: "#F1EBFF",
//                 border: "1px solid #D7C4FF",
//               }}
//             >
//               <Typography color="#7041C5" fontWeight={700}>
//                 Total Online
//               </Typography>
//               <Typography color="#7041C5" fontSize="25px" fontWeight={800}>
//                 ₹ {Number(previewEntry.totalOnline || 0).toFixed(2)}
//               </Typography>
//             </Paper>
//           )}

//           <Paper
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               backgroundColor: "#FFF2E2",
//               border: "1px solid #FFD2A3",
//             }}
//           >
//             <Typography color="#B66A12" fontWeight={700}>
//               Total Collection
//             </Typography>
//             <Typography color="#B66A12" fontSize="25px" fontWeight={800}>
//               ₹ {Number(previewEntry.totalCollection || 0).toFixed(2)}
//             </Typography>
//           </Paper>
//         </Box>

//         {/* DENOMINATION TABLE */}
//         <Paper
//           variant="outlined"
//           sx={{ borderRadius: 2, overflow: "hidden" }}
//         >
//           <Box p={2}>
//             <Typography fontSize="18px" fontWeight={800}>
//               Denominations
//             </Typography>
//             <Typography color="text.secondary" fontSize="13px">
//               Note-wise quantity and amount
//             </Typography>
//           </Box>

//           <TableContainer sx={{ maxHeight: 260 }}>
//             <Table stickyHeader size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 800, backgroundColor: "#EAF1F7" }}>
//                     Notes
//                   </TableCell>
//                   <TableCell
//                     align="center"
//                     sx={{ fontWeight: 800, backgroundColor: "#EAF1F7" }}
//                   >
//                     Quantity
//                   </TableCell>
//                   <TableCell
//                     align="right"
//                     sx={{ fontWeight: 800, backgroundColor: "#EAF1F7" }}
//                   >
//                     Amount
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {(previewEntry.denominations || []).map((item) => (
//                   <TableRow key={item.id ?? item.notes}>
//                     <TableCell>
//                       <b>₹ {formatDenomination(item.notes)}</b>
//                     </TableCell>
//                     <TableCell align="center">
//                       {Number(item.numbers || 0)}
//                     </TableCell>
//                     <TableCell align="right">
//                       <b>₹ {Number(item.amount || 0).toFixed(2)}</b>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <Box
//             sx={{
//               p: 2,
//               textAlign: "right",
//               backgroundColor: "#F7FAFC",
//               borderTop: "1px solid #DCE3EA",
//             }}
//           >
//             <Typography fontWeight={800} fontSize="20px">
//               Denomination Total: ₹{" "}
//               {Number(previewEntry.total || 0).toFixed(2)}
//             </Typography>
//           </Box>
//         </Paper>

//         {/* SUMMARY CUTOFF */}
//         <Paper
//           elevation={0}
//           sx={{
//             mt: 2,
//             p: 2,
//             borderRadius: 2,
//             backgroundColor: "#EAF2FF",
//             border: "1px solid #D3E2FF",
//           }}
//         >
//           <Typography color="#245BC5" fontWeight={700} fontSize="13px">
//             Summary Cutoff Time
//           </Typography>
//           <Typography fontWeight={700} mt={0.5}>
//             {formatCutoffIST(previewEntry.summaryCutoffDateTime)}
//           </Typography>
//           <Typography color="text.secondary" fontSize="13px" mt={0.5}>
//             Sales summary captured at this time
//           </Typography>
//         </Paper>

//         {/* CASH RECONCILIATION - ADMIN AND SALE/SALE2 */}
//         <Box
//           display="grid"
//           gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
//           gap={1.5}
//           mt={2}
//           mb={1}
//         >
//           {/* DENOMINATION TOTAL */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               backgroundColor: "#E8F7EF",
//               border: "1px solid #B8DCC8",
//             }}
//           >
//             <Typography color="#17834A" fontWeight={700}>
//               Total Denomination
//             </Typography>
//             <Typography
//               color="#17834A"
//               fontSize="28px"
//               fontWeight={800}
//               mt={0.5}
//             >
//               ₹ {Number(previewEntry.total || 0).toFixed(2)}
//             </Typography>
//           </Paper>

//           {/* CASH DIFFERENCE */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               backgroundColor: previewCashMatched ? "#E8F7EF" : "#FDECEC",
//               border: `1px solid ${
//                 previewCashMatched ? "#B8DCC8" : "#FFB3B3"
//               }`,
//             }}
//           >
//             <Typography
//               color={previewCashMatched ? "#17834A" : "#D92D2D"}
//               fontWeight={700}
//             >
//               Cash Difference
//             </Typography>

//             <Typography
//               color={previewCashMatched ? "#17834A" : "#D92D2D"}
//               fontSize="28px"
//               fontWeight={800}
//               mt={0.5}
//             >
//               {previewCashDifference > 0 ? "+" : ""}
//               ₹ {previewCashDifference.toFixed(2)}
//             </Typography>

//             <Typography
//               mt={1}
//               fontWeight={800}
//               color={previewCashMatched ? "#17834A" : "#D92D2D"}
//             >
//              {previewCashMatched
//   ? "✓ Cash Matched"
//   : previewCashDifference > 0
//   ? `₹ ${previewCashDifference.toFixed(2)} Extra Cash`
//   : `₹ ${Math.abs(previewCashDifference).toFixed(2)} Cash Short`}
//             </Typography>
//           </Paper>
//         </Box>
//       </>
//     )}
//   </DialogContent>

//   <DialogActions sx={{ px: 3, py: 1.5, backgroundColor: "#fff" }}>
//     <Button
//       onClick={handleClosePreview}
//       variant="outlined"
//       sx={{ textTransform: "none", fontWeight: 700 }}
//     >
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>



//       </Box>

//       {/* ==========================================================
//     DELETE CONFIRMATION DIALOG
// ========================================================== */}

 
//     </LocalizationProvider>
//   );
// };

// export default DenominationEntry;














































































































 









import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Typography,
  TextField,
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

import EditIcon from "@mui/icons-material/Edit";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import { MaterialReactTable } from "material-react-table";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";

// ============================================================
// API URLS
// ============================================================

const POST_DENOMINATION_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

const GET_DENOMINATION_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

const UPDATE_DENOMINATION_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

const DELETE_TABLE_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

const INVOICE_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php";

// ============================================================
// DEFAULT BRANCH / USER
// ============================================================

const BRANCH_ID = 1;



// ============================================================
// COMPONENT
// ============================================================

const DenominationEntry = () => {
  // ==========================================================
  // MAIN TABLE DATA
  // ==========================================================



const currentCreatedBy = Number(
  sessionStorage.getItem("CreatedBy") || 0
);

const isAdmin = currentCreatedBy === 1;

  const [entries, setEntries] = useState([]);

  
  

  // ==========================================================
  // FORM
  // ==========================================================

  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);




  const [saveCompleted, setSaveCompleted] = useState(false);


  const [previewOpen, setPreviewOpen] = useState(false);
const [previewEntry, setPreviewEntry] = useState(null);

const handlePreviewEntry = (entry) => {
  setPreviewEntry(entry);
  setPreviewOpen(true);
};

const handleClosePreview = () => {
  setPreviewOpen(false);
  setPreviewEntry(null);
};




const previewCashDifference = Number(
  (
    Number(previewEntry?.total || 0) -
    Number(previewEntry?.totalCash || 0)
  ).toFixed(2)
);

const previewCashMatched =
  Math.abs(previewCashDifference) < 0.01;


  // ==========================================================
  // SALES RECONCILIATION
  // ==========================================================

const [salesSummary, setSalesSummary] = useState({
  regularCash: 0,
  regularOnline: 0,
  dealerCash: 0,
  dealerOnline: 0,
  catererCash: 0,
  catererOnline: 0,
  totalCash: 0,
  totalOnline: 0,
  totalOnlineEntries: 0,
  totalCollection: 0,
  salesTotalTillNow: 0,
  summaryCutoffDateTime: "",
});

  const [showReconciliation, setShowReconciliation] = useState(false);

  const [savedDenominationTotal, setSavedDenominationTotal] = useState(0);

  const [cashDifference, setCashDifference] = useState(0);

  const [isCashMatched, setIsCashMatched] = useState(false);

  // ==========================================================
  // ENTRY NUMBER
  // ==========================================================

  const [entryNo, setEntryNo] = useState("");

  // ==========================================================
  // ENTRY DATE
  // ==========================================================

  const [entryDate, setEntryDate] = useState(new Date());

  // ==========================================================
  // PAGE NUMBER
  // ==========================================================

  const [pageNo, setPageNo] = useState(1);

  // ==========================================================
  // DENOMINATION MASTER
  // ==========================================================

  const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

  // ==========================================================
  // DENOMINATION ROWS
  // ==========================================================

  const [denominationRows, setDenominationRows] = useState([]);

  // ==========================================================
  // CREATE EMPTY ROWS
  // ==========================================================

  const createEmptyRows = () => {
    return denominationValues.map((value) => ({
      denomination: value,
      quantity: "",
      amount: 0,
    }));
  };

  // ==========================================================
  // FORMAT DENOMINATION
  // ==========================================================

  const formatDenomination = (value) => {
    if (value === 0.5) {
      return "0.50";
    }

    return String(value);
  };

  // ==========================================================
  // FORMAT DATE FOR DISPLAY
  // ==========================================================

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const d = new Date(value);

    if (isNaN(d.getTime())) {
      return "";
    }

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };



// Format Summary Cutoff in Indian Standard Time
const formatCutoffIST = (value) => {
  if (!value) {
    return "Not available";
  }

  const rawValue = String(value).trim();

  // Database datetime without timezone is treated as IST.
  const match = rawValue.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/
  );

  if (match) {
    const [, year, month, day, hour, minute, second = "00"] = match;

   return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
  }

  // If the value includes a timezone, convert it to IST.
  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return (
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(parsedDate) + " IST"
  );
};



  // ==========================================================
  // FORMAT DATE FOR API
  // ==========================================================

  const formatApiDate = (value) => {
    if (!value) {
      return "";
    }

    const d = new Date(value);

    if (isNaN(d.getTime())) {
      return "";
    }

    const year = d.getFullYear();

    const month = String(d.getMonth() + 1).padStart(2, "0");

    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================================
  // CHECK SAME DATE
  // ==========================================================

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) {
      return false;
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // ==========================================================
  // GET INVOICE DATE VALUE
  // ==========================================================

  const getInvoiceDateValue = (invoice) => {
    const value = invoice?.InvoiceDate;

    if (!value) {
      return null;
    }

    // API sometimes returns:
    // { date: "2026-09-30 18:30:00" }

    if (typeof value === "object" && value?.date) {
      return value.date;
    }

    return value;
  };

  // ==========================================================
  // GET INVOICE DATETIME
  // ==========================================================

  const getInvoiceDateTime = (invoice) => {
    const rawValue = getInvoiceDateValue(invoice);

    if (!rawValue) {
      return null;
    }

    const dateObject = new Date(rawValue);

    if (!isNaN(dateObject.getTime())) {
      return dateObject;
    }

    return null;
  };

  // ==========================================================
  // GET DATE ONLY FROM INVOICE
  // ==========================================================

  const getInvoiceDateOnly = (invoice) => {
    const rawValue = getInvoiceDateValue(invoice);

    if (!rawValue) {
      return "";
    }

    const stringValue = String(rawValue);

    return stringValue.substring(0, 10);
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================


const resetForm = () => {
  setEntryNo("");
  setEntryDate(new Date());
  setEditingEntry(null);
  setSaveCompleted(false);
  setDenominationRows(createEmptyRows());

setSalesSummary({
  regularCash: 0,
  regularOnline: 0,
  dealerCash: 0,
  dealerOnline: 0,
  catererCash: 0,
  catererOnline: 0,
  totalCash: 0,
  totalOnline: 0,
  totalOnlineEntries: 0,
  totalCollection: 0,
  salesTotalTillNow: 0,
  summaryCutoffDateTime: "",
});

  setSavedDenominationTotal(0);
  setShowReconciliation(false);
  setCashDifference(0);
  setIsCashMatched(false);
};


  // ==========================================================
  // GENERATE NEXT DENOMINATION ENTRY NO
  // ==========================================================

  const generateNextEntryNo = async () => {
    try {
     const createdBy = sessionStorage.getItem("CreatedBy") || "";

const url =
  `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}` +
  `&CreatedBy=${encodeURIComponent(createdBy)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Entry No API failed: ${response.status}`);
      }

      const result = await response.json();

      const data = Array.isArray(result?.data) ? result.data : [];

      if (data.length === 0) {
        setEntryNo("1");
        return;
      }

      const entryNumbers = data
        .map((item) => Number(item?.EntryNo))
        .filter((value) => !Number.isNaN(value));

      if (entryNumbers.length === 0) {
        setEntryNo("1");
        return;
      }

      const maxEntryNo = Math.max(...entryNumbers);

      setEntryNo(String(maxEntryNo + 1));
    } catch (error) {
      console.error("GENERATE ENTRY NO ERROR:", error);

      setEntryNo("1");

      toast.error("Unable to generate Entry No");
    }
  };

  // ==========================================================
  // FETCH SALES SUMMARY
  //
  // REQUIREMENT:
  //
  // Sales Entry
  // + Sales Dealer
  // + Sales Caterers
  //
  // selected date
  // +
  // till current time for today's date
  //
  // SUM invoice.Total
  // ==========================================================

  const fetchSalesSummary = async (selectedDate) => {
    try {
      if (!selectedDate) {
        return;
      }

      const selectedDateString = formatApiDate(selectedDate);
      

      const now = new Date();



      // Logged-in user ID used for invoice filtering
const loggedInCreatedBy = Number(
  sessionStorage.getItem("CreatedBy") || 0
);

const loggedInIsAdmin = loggedInCreatedBy === 1;

console.log("LOGGED-IN CREATED BY:", loggedInCreatedBy);
console.log("IS ADMIN:", loggedInIsAdmin);

      console.log("====================================");

      console.log("FETCH SALES SUMMARY");

      console.log("SELECTED DATE:", selectedDateString);

      console.log("CURRENT TIME:", now);

      // ======================================================
      // FETCH FIRST PAGE
      // ======================================================

      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const firstResponse = await fetch(
        `${INVOICE_API}?Table=invoiceheader&PageNo=1`,
        requestOptions,
      );

      if (!firstResponse.ok) {
        throw new Error(`Sales API failed: ${firstResponse.status}`);
      }

      const firstResult = await firstResponse.json();

      let allInvoices = [...(firstResult?.data || [])];

      const totalPages = Number(firstResult?.total_pages || 1);

      console.log("TOTAL INVOICE PAGES:", totalPages);

      // ======================================================
      // FETCH ALL REMAINING PAGES
      // ======================================================

      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page++) {
          try {
            const response = await fetch(
              `${INVOICE_API}?Table=invoiceheader&PageNo=${page}`,
              requestOptions,
            );

            if (!response.ok) {
              console.warn("Invoice page failed:", page);

              continue;
            }

            const result = await response.json();

            allInvoices = [...allInvoices, ...(result?.data || [])];
          } catch (pageError) {
            console.error("PAGE FETCH ERROR:", page, pageError);
          }
        }
      }

      console.log("TOTAL ALL INVOICES:", allInvoices.length);



      
console.log("========== INVOICE FILTER DEBUG ==========");
console.log("Selected date:", selectedDateString);
console.log("Login CreatedBy:", loggedInCreatedBy);
console.log("First invoice object:", allInvoices[0]);

console.table(
  allInvoices.slice(0, 20).map((invoice) => ({
    InvoiceNo: invoice?.InvoiceNo,
    InvoiceDate: invoice?.InvoiceDate,
    NormalizedDate: getInvoiceDateOnly(invoice),
    CreatedBy: invoice?.CreatedBy,
    UserId: invoice?.UserId,
    Total: invoice?.Total,
  }))
);

const dateMatchedInvoices = allInvoices.filter(
  (invoice) =>
    getInvoiceDateOnly(invoice) === selectedDateString
);

const userMatchedInvoices = allInvoices.filter(
  (invoice) =>
    Number(invoice?.CreatedBy ?? 0) === loggedInCreatedBy
);

console.log("DATE MATCHED COUNT:", dateMatchedInvoices.length);
console.log("USER MATCHED COUNT:", userMatchedInvoices.length);


      // ======================================================
      // FILTER SALES
      //
      // ALL INVOICEHEADER SALES ARE CONSIDERED:
      //
      // Sales Entry
      // Dealer
      // Caterers
      //
      // If your backend has other invoice types in
      // invoiceheader, then SaleType filter can be added.
      // ======================================================

     const selectedInvoices = allInvoices.filter((invoice) => {
  // 1. Filter invoices by selected date
  const invoiceDateOnly = getInvoiceDateOnly(invoice);

  if (invoiceDateOnly !== selectedDateString) {
    return false;
  }

  // 2. Get logged-in user's CreatedBy
  const loggedInCreatedBy = Number(
    sessionStorage.getItem("CreatedBy") || 0
  );

  // 3. Admin can see all users' invoices
  const loggedInIsAdmin = loggedInCreatedBy === 1;

  // 4. Sale and Sale2 can see only their own invoices
  if (!loggedInIsAdmin) {
    const invoiceCreatedBy = Number(invoice?.CreatedBy ?? 0);

    if (invoiceCreatedBy !== loggedInCreatedBy) {
      return false;
    }
  }

  // 5. If selected date is today, include invoices only up to now
  if (isSameDate(selectedDate, now)) {
    const invoiceDateTime = getInvoiceDateTime(invoice);

    if (invoiceDateTime) {
      return invoiceDateTime.getTime() <= now.getTime();
    }

    // If API provides only the date, include today's invoice
    return true;
  }

  // 6. For past dates, include all invoices of that date
  return true;
});

// Debug logs
console.log(
  "LOGGED-IN CREATED BY:",
  sessionStorage.getItem("CreatedBy")
);

console.log(
  "FILTERED INVOICE COUNT:",
  selectedInvoices.length
);

console.log(
  "FILTERED INVOICES:",
  selectedInvoices
);

      console.log("SELECTED SALES INVOICES:", selectedInvoices);

      // ======================================================
      // CALCULATE VALUES
      // ======================================================

      // ======================================================
      // CALCULATE VALUES
      // ======================================================

      let totalCash = 0;
      let totalOnline = 0;
      let salesTotalTillNow = 0;
      let totalOnlineEntries = 0;

      selectedInvoices.forEach((invoice) => {
        // ====================================================
        // INVOICE TOTAL
        // ====================================================

        const invoiceTotal = Number(invoice?.Total || 0);

        // ====================================================
        // PAYMENT MODE
        //
        // C = Cash
        // O = Online
        // M = Mixed
        // ====================================================

        const paymentMode = String(invoice?.PaymentMode || "")
          .trim()
          .toUpperCase();

        // ====================================================
        // CASH AMOUNT
        // ====================================================

        const cashAmount = Number(invoice?.CashAmount || 0);

        // ====================================================
        // ONLINE AMOUNT
        // ====================================================

        const onlineAmount = Number(invoice?.OnlineAmount || 0);


        // Count invoices that contain an online payment
if (onlineAmount > 0) {
  totalOnlineEntries += 1;
}

        // ====================================================
        // SALES TOTAL
        //
        // Sales Entry
        // + Dealer
        // + Caterers
        // ====================================================

        salesTotalTillNow += invoiceTotal;

        // ====================================================
        // PAYMENT MODE WISE CALCULATION
        // ====================================================

        if (paymentMode === "C" || paymentMode === "CASH") {
          // ----------------------------------------------
          // CASH SALE
          // ----------------------------------------------

          totalCash += invoiceTotal;
        } else if (paymentMode === "O" || paymentMode === "ONLINE") {
          // ----------------------------------------------
          // ONLINE SALE
          // ----------------------------------------------

          totalOnline += invoiceTotal;
        } else if (paymentMode === "M" || paymentMode === "MIXED") {
          // ----------------------------------------------
          // MIXED PAYMENT
          // ----------------------------------------------

          totalCash += cashAmount;

          totalOnline += onlineAmount;
        } else {
          // ----------------------------------------------
          // FALLBACK
          //
        
          // ----------------------------------------------

          totalCash += cashAmount;

          totalOnline += onlineAmount;
        }
      });

      // ======================================================
      // ROUND VALUES
      // ======================================================

      salesTotalTillNow = Number(salesTotalTillNow.toFixed(2));

      totalCash = Number(totalCash.toFixed(2));

      totalOnline = Number(totalOnline.toFixed(2));

      console.log("========== PAYMENT SUMMARY ==========");

      console.table(
        selectedInvoices.map((invoice) => ({
          InvoiceNo: invoice?.InvoiceNo,
          Total: Number(invoice?.Total || 0),
          PaymentMode: invoice?.PaymentMode,
          CashAmount: Number(invoice?.CashAmount || 0),
          OnlineAmount: Number(invoice?.OnlineAmount || 0),
        })),
      );

      console.log("FINAL SALES TOTAL:", salesTotalTillNow);

      console.log("FINAL TOTAL CASH:", totalCash);

      console.log("FINAL TOTAL ONLINE:", totalOnline);

      console.log("CASH + ONLINE:", totalCash + totalOnline);

      console.log("======================================");

      const totalCollection = salesTotalTillNow;




      
      const cutoffNow = new Date();
      const pad = (value) => String(value).padStart(2, "0");

      const summaryCutoffDateTime =
        `${cutoffNow.getFullYear()}-${pad(cutoffNow.getMonth() + 1)}-${pad(cutoffNow.getDate())} ` +
        `${pad(cutoffNow.getHours())}:${pad(cutoffNow.getMinutes())}:${pad(cutoffNow.getSeconds())}`;


      // ======================================================
      // SET SUMMARY
      // ======================================================

     
setSalesSummary({
  regularCash: 0,
  regularOnline: 0,
  dealerCash: 0,
  dealerOnline: 0,
  catererCash: 0,
  catererOnline: 0,
  totalCash,
  totalOnline,
  totalOnlineEntries,
  totalCollection,
  salesTotalTillNow,
  summaryCutoffDateTime,
});


      console.log("====================================");

      console.log(
        "SALES TOTAL TILL NOW:",
        Number(salesTotalTillNow || 0).toFixed(2),
      );

      console.log("TOTAL CASH:", Number(totalCash || 0).toFixed(2));

      console.log("TOTAL ONLINE:", Number(totalOnline || 0).toFixed(2));

      console.log("TOTAL COLLECTION:", Number(totalCollection || 0).toFixed(2));

      console.log(
        "CASH + ONLINE:",
        (Number(totalCash || 0) + Number(totalOnline || 0)).toFixed(2),
      );

      console.log("SELECTED INVOICE COUNT:", selectedInvoices.length);

      console.log("====================================");
    } catch (error) {
      console.error("FETCH SALES SUMMARY ERROR:", error);

      toast.error("Unable to fetch Sales Summary");
    }
  };

  // ==========================================================
  // GET DENOMINATION DATA
  // ==========================================================

const fetchDenominationEntries = async () => {
  try {
    const currentCreatedBy = Number(
      sessionStorage.getItem("CreatedBy") || 0
    );

    const isAdmin = currentCreatedBy === 1;

    const params = new URLSearchParams({
      Id: "",
      BranchId: String(BRANCH_ID),
    });

    if (!isAdmin) {
      params.set("CreatedBy", String(currentCreatedBy));
    }

    const url = `${GET_DENOMINATION_API}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `GET API failed with status ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || "Unable to load denomination entries"
      );
    }

    if (!Array.isArray(result.data)) {
      setEntries([]);
      setPageNo(1);
      return;
    }

    const groupedEntries = {};

    result.data.forEach((item) => {
      const entryNo = String(item.EntryNo ?? "");
      const branchId = String(item.BranchId ?? "");
      const createdBy = String(item.CreatedBy ?? "");

      const groupKey = `${branchId}_${createdBy}_${entryNo}`;

      if (!groupedEntries[groupKey]) {
        groupedEntries[groupKey] = {
          id: item.Id,
          apiId: item.Id,
          branchId: item.BranchId,
          entryNo: item.EntryNo,
          entryDate: item.EntryDate,
          entryDateText: formatDate(item.EntryDate),
          total: 0,
          denominations: [],
          active: Number(item.Active || 0),
          createdBy: item.CreatedBy,
          updatedBy: item.UpdatedBy,
          updatedCount: item.UpdatedCount,
          createdByName:
  Number(item.CreatedBy) === 1
    ? "Admin"
    : Number(item.CreatedBy) === 2
    ? "Sale"
    : Number(item.CreatedBy) === 3
    ? "Sale2"
    : "Unknown",
          salesTotalTillNow: Number(item.SalesTotalTillNow ?? 0),
totalCash: Number(item.TotalCash ?? 0),
totalOnline: Number(item.TotalOnline ?? 0),
totalOnlineEntries: Number(item.TotalOnlineEntries ?? 0),
totalCollection: Number(item.TotalCollection ?? 0),
summaryCutoffDateTime: item.SummaryCutoffDateTime ?? "",
        };
      }

      const amount = Number(item.Amount || 0);

      groupedEntries[groupKey].total += amount;

      groupedEntries[groupKey].denominations.push({
        id: item.Id,
        notes: Number(item.Notes || 0),
        numbers: Number(item.Numbers || 0),
        amount,
      });
    });

    const formattedEntries = Object.values(groupedEntries);

    formattedEntries.sort((a, b) => {
      const dateA = a.entryDate
        ? new Date(a.entryDate).getTime()
        : 0;

      const dateB = b.entryDate
        ? new Date(b.entryDate).getTime()
        : 0;

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      return Number(b.entryNo || 0) - Number(a.entryNo || 0);
    });

    console.log(
      "DENOMINATION ENTRIES - LATEST FIRST:",
      formattedEntries
    );

    setEntries(formattedEntries);

    const calculatedPages = Math.ceil(
      formattedEntries.length / 10
    );

    if (calculatedPages === 0) {
      setPageNo(1);
    } else {
      setPageNo((previousPage) =>
        previousPage > calculatedPages
          ? calculatedPages
          : previousPage
      );
    }
  } catch (error) {
    console.error("GET DENOMINATION ERROR:", error);

    toast.error("Unable to load Denomination Entries");
  }
};

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    setDenominationRows(createEmptyRows());

    fetchDenominationEntries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================
  // OPEN FORM
  // ==========================================================

  const handleOpenForm = async () => {
    resetForm();

    const today = new Date();

    setEntryDate(today);

    setOpenForm(true);

    // Fetch current sales total
    await fetchSalesSummary(today);

    // Generate entry no
    await generateNextEntryNo();
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
  // EDIT DENOMINATION ENTRY
  // ==========================================================

 


const handleEditEntry = async (entry) => {
  try {
    // 1. Validate selected entry
    if (!entry) {
      toast.error("Denomination entry not found");
      return;
    }

    setSaveCompleted(false);
    setEditingEntry(entry);

    // 2. Restore Entry Number
    setEntryNo(String(entry.entryNo ?? ""));

    // 3. Restore Entry Date without timezone conversion
    const rawDate = String(entry.entryDate ?? "");
    const datePart = rawDate.substring(0, 10);

    let validEditDate;

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [year, month, day] = datePart
        .split("-")
        .map(Number);

      validEditDate = new Date(year, month - 1, day);
    } else {
      validEditDate = new Date(
        entry.entryDate || Date.now()
      );
    }

    if (Number.isNaN(validEditDate.getTime())) {
      toast.error("Invalid denomination entry date");
      return;
    }

    setEntryDate(validEditDate);

    // 4. Restore existing denomination rows
    const emptyRows = createEmptyRows();

    const existingDenominations = Array.isArray(
      entry.denominations
    )
      ? entry.denominations
      : [];

    const editRows = emptyRows.map((row) => {
      const existing = existingDenominations.find(
        (item) =>
          Number(item.notes) === Number(row.denomination)
      );

      if (!existing) {
        return {
          ...row,
          id: null,
          quantity: "",
          amount: 0,
        };
      }

      const quantity = Number(existing.numbers ?? 0);

      return {
        ...row,
        id: existing.id ?? existing.Id ?? null,
        quantity: quantity > 0 ? String(quantity) : "",
        amount: Number(existing.amount ?? 0),
      };
    });

    setDenominationRows(editRows);

    // 5. Restore saved Summary values
   const savedSummary = {
  totalCash: Number(entry.totalCash ?? 0),
  totalOnline: Number(entry.totalOnline ?? 0),
  totalOnlineEntries: Number(entry.totalOnlineEntries ?? 0),
  totalCollection: Number(entry.totalCollection ?? 0),
  salesTotalTillNow: Number(entry.salesTotalTillNow ?? 0),
  summaryCutoffDateTime: entry.summaryCutoffDateTime ?? "",
};

    const hasSavedSummary =
      savedSummary.totalCash !== 0 ||
      savedSummary.totalOnline !== 0 ||
      savedSummary.totalCollection !== 0 ||
      savedSummary.salesTotalTillNow !== 0;

    console.log("EDIT ENTRY:", entry);
    console.log("EDIT ENTRY DATE:", datePart);
    console.log("SAVED SUMMARY:", savedSummary);
    console.log("HAS SAVED SUMMARY:", hasSavedSummary);

    // 6. Restore saved Summary or fetch it if unavailable
    if (hasSavedSummary) {
      setSalesSummary((previous) => ({
        ...previous,
        ...savedSummary,
      }));
    } else {
      await fetchSalesSummary(validEditDate);
    }

    // 7. Reset reconciliation state
    setShowReconciliation(false);
    setCashDifference(0);
    setIsCashMatched(false);
    setSavedDenominationTotal(0);

    // 8. Open Edit form
    setOpenForm(true);
  } catch (error) {
    console.error("EDIT DENOMINATION ERROR:", error);

    toast.error(
      error?.message ||
        "Unable to open denomination entry for edit"
    );
  }
};





  // ==========================================================
  // QUANTITY CHANGE
  // ==========================================================

  const handleQuantityChange = (index, value) => {
    // Empty
    if (value === "") {
      setDenominationRows((previousRows) =>
        previousRows.map((row, rowIndex) => {
          if (rowIndex === index) {
            return {
              ...row,
              quantity: "",
              amount: 0,
            };
          }

          return row;
        }),
      );

      return;
    }

    // Only integer
    if (!/^\d+$/.test(value)) {
      return;
    }

    const quantity = Number(value);

    setDenominationRows((previousRows) =>
      previousRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          const amount = row.denomination * quantity;

          return {
            ...row,
            quantity: value,
            amount,
          };
        }

        return row;
      }),
    );
  };

  // ==========================================================
  // TOTAL DENOMINATION
  // ==========================================================

  const total = useMemo(() => {
    return denominationRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0,
    );
  }, [denominationRows]);

  // ==========================================================
  // UPDATE DENOMINATION API
  // ==========================================================

  const updateDenomination = async ({
    id,
    branchId,
    date,
    notes,
    numbers,
    amount,
    updatedBy,
  }) => {
    const formData = new FormData();

    formData.append("Id", String(id));

    formData.append("BranchId", String(branchId || BRANCH_ID));

    formData.append("EntryDate", formatApiDate(date));

    formData.append("Notes", String(Number(notes || 0)));

    formData.append("Numbers", String(Number(numbers || 0)));

    formData.append("Amount", Number(amount || 0).toFixed(2));

    formData.append("UpdatedBy", String(updatedBy || ""));

    const response = await fetch(UPDATE_DENOMINATION_API, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to update denomination");
    }

    return result;
  };

  // ==========================================================
  // CREATE DENOMINATION API
  // ==========================================================

  



const createDenomination = async ({
  entryNo,
  entryDate,
  denomination,
  quantity,
  amount,
  branchId,
  createdBy,
  userId,
  saleRole,
  drawerId,
  salesTotalTillNow,
  totalCash,
  totalOnline,
  totalOnlineEntries,
  totalCollection,
  summaryCutoffDateTime,
}) => {


  try {
    // ========================================
    // 1. PREPARE AND VALIDATE VALUES
    // ========================================
    const resolvedBranchId = Number(branchId || BRANCH_ID);
    const resolvedCreatedBy = Number(createdBy);
    const notes = Number(denomination);
    const numbers = Number(quantity);

    const totalAmount =
      amount !== undefined && amount !== null && amount !== ""
        ? Number(amount)
        : notes * numbers;

    if (!Number.isFinite(resolvedBranchId) || resolvedBranchId <= 0) {
      throw new Error("Please provide a valid BranchId.");
    }

    if (!Number.isFinite(resolvedCreatedBy) || resolvedCreatedBy <= 0) {
      throw new Error("Please provide a valid CreatedBy.");
    }

    if (!Number.isFinite(notes) || notes <= 0) {
      throw new Error("Please provide a valid denomination Notes value.");
    }

    if (!Number.isFinite(numbers) || numbers <= 0) {
      throw new Error("Please provide a valid denomination quantity.");
    }

    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
      throw new Error("Please provide a valid denomination Amount.");
    }

    if (!entryDate) {
      throw new Error("Please select Entry Date.");
    }

    // ========================================
    // 2. FORMAT ENTRY DATE
    // ========================================
    const formattedEntryDate = formatApiDate(entryDate);

    if (!formattedEntryDate) {
      throw new Error("Invalid Entry Date.");
    }

    // ========================================
    // 3. CREATE FORMDATA
    // ========================================
    const formData = new FormData();

    formData.append("BranchId", String(resolvedBranchId));
    formData.append("EntryDate", String(formattedEntryDate));
    formData.append("Notes", String(notes));
    formData.append("Numbers", String(numbers));
    formData.append("Amount", totalAmount.toFixed(2));
    formData.append("CreatedBy", String(resolvedCreatedBy));

    formData.append("UserId", String(userId ?? ""));
    formData.append("SaleRole", String(saleRole ?? ""));
    formData.append("DrawerId", String(drawerId ?? ""));
    formData.append("EntryNo", String(entryNo ?? "").trim());

    formData.append(
      "SalesTotalTillNow",
      String(Number(salesTotalTillNow ?? 0))
    );

    formData.append("TotalCash", String(Number(totalCash ?? 0)));
    formData.append("TotalOnline", String(Number(totalOnline ?? 0)));
    formData.append(
  "TotalOnlineEntries",
  String(Number(totalOnlineEntries ?? 0))
);

    formData.append(
      "TotalCollection",
      String(Number(totalCollection ?? 0))
    );

    formData.append(
      "SummaryCutoffDateTime",
      String(summaryCutoffDateTime ?? "")
    );

    // ========================================
    // 4. LOG ACTUAL FORMDATA VALUES
    // ========================================
    const payloadForLog = {};

    for (const [key, value] of formData.entries()) {
      payloadForLog[key] = value;
    }

    console.log("========== DENOMINATION API REQUEST ==========");
    console.log("API URL:", POST_DENOMINATION_API);
    console.log("FORMDATA PAYLOAD:", payloadForLog);

    // ========================================
    // 5. CALL POST API
    // ========================================
    const response = await fetch(POST_DENOMINATION_API, {
      method: "POST",
      body: formData,
    });

    // ========================================
    // 6. READ API RESPONSE
    // ========================================
    const responseText = await response.text();

    console.log("DENOMINATION HTTP STATUS:", response.status);
    console.log("DENOMINATION RAW RESPONSE:", responseText);

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `The API returned an invalid JSON response. HTTP ${response.status}. ` +
          `Response: ${responseText.slice(0, 300)}`
      );
    }

    // ========================================
    // 7. CHECK HTTP AND API SUCCESS
    // ========================================
    if (!response.ok) {
      throw new Error(
        result.message ||
          result.error ||
          `Denomination API failed. HTTP ${response.status}.`
      );
    }

    // Support common API response formats.
    const apiSuccess =
      result.success === true ||
      result.success === 1 ||
      result.success === "true" ||
      result.status === "success";

    if (!apiSuccess) {
      throw new Error(
        result.message ||
          result.error ||
          "The API did not confirm that the denomination was saved."
      );
    }

    console.log("DENOMINATION SAVED SUCCESSFULLY:", result);

    return result;
  } catch (error) {
    console.error("CREATE DENOMINATION ERROR:", error);
    throw error;
  }
};



  // ==========================================================
  // SAVE
  //
  // IMPORTANT:
  // VALIDATION HAPPENS BEFORE POST API
  // ==========================================================

  // ==========================================================
  // SAVE / UPDATE DENOMINATION
  // ==========================================================




const handleSave = async () => {
  if (saving) {
    return;
  }

  if (!entryNo || !entryNo.trim()) {
    toast.error("Please enter Entry No");
    return;
  }

  if (!entryDate || isNaN(new Date(entryDate).getTime())) {
    toast.error("Please select a valid Entry Date");
    return;
  }

  const rowsToSave = denominationRows.filter(
    (row) => Number(row.quantity || 0) > 0
  );

  if (rowsToSave.length === 0) {
    toast.error("Please enter at least one denomination quantity");
    return;
  }

  const loggedInUserId =
    sessionStorage.getItem("UserId") ||
    sessionStorage.getItem("LoginUserId") ||
    "";

  const loggedInSaleRole =
    sessionStorage.getItem("UserRole") || "";

  const currentCreatedBy = Number(
    sessionStorage.getItem("CreatedBy") || 0
  );

  const drawerId =
    sessionStorage.getItem("Device") || "";

  if (
    !loggedInUserId ||
    !loggedInSaleRole ||
    !currentCreatedBy
  ) {
    toast.error(
      "Login details are incomplete. Please login again."
    );
    return;
  }

  try {
    setSaving(true);

    const userDetails = {
      userId: loggedInUserId,
      saleRole: loggedInSaleRole,
      drawerId,
    };

    const denominationTotal = Number(
      rowsToSave
        .reduce((sum, row) => {
          const denomination = Number(row.denomination || 0);
          const quantity = Number(row.quantity || 0);

          return sum + denomination * quantity;
        }, 0)
        .toFixed(2)
    );

    // Read the current sales summary
    const salesTotalTillNow = Number(
      salesSummary?.salesTotalTillNow ?? 0
    );

    const cashTotal = Number(
      salesSummary?.totalCash ?? 0
    );

    const onlineTotal = Number(
      salesSummary?.totalOnline ?? 0
    );

    const totalCollection = Number(
      salesSummary?.totalCollection ?? 0
    );

    const summaryCutoffDateTime =
      salesSummary?.summaryCutoffDateTime || "";

    // Debug the values before saving
    console.log("SALES SUMMARY BEFORE SAVE:", salesSummary);

    console.log("SUMMARY VALUES SENT:", {
      SalesTotalTillNow: salesTotalTillNow,
      TotalCash: cashTotal,
      TotalOnline: onlineTotal,
      TotalCollection: totalCollection,
      SummaryCutoffDateTime: summaryCutoffDateTime,
      CreatedBy: currentCreatedBy,
    });

    // Stop saving if the summary is not loaded
    if (
      salesTotalTillNow === 0 &&
      cashTotal === 0 &&
      onlineTotal === 0 &&
      totalCollection === 0
    ) {
      toast.error(
        "Sales summary is zero. Please refresh the sales summary before saving."
      );
      return;
    }

    const difference = Number(
      (denominationTotal - cashTotal).toFixed(2)
    );

    const matched = Math.abs(difference) < 0.01;

    setSavedDenominationTotal(denominationTotal);
    setCashDifference(difference);
    setIsCashMatched(matched);
    setShowReconciliation(true);

    const snapshotData = {
  salesTotalTillNow,
  totalCash: cashTotal,
  totalOnline: onlineTotal,
  totalOnlineEntries: Number(
    salesSummary?.totalOnlineEntries ?? 0
  ),
  totalCollection,
  summaryCutoffDateTime,
};

    const createEntry = async (row) => {
      const denomination = Number(row.denomination || 0);
      const quantity = Number(row.quantity || 0);

      const amount = Number(
        (denomination * quantity).toFixed(2)
      );

      await createDenomination({
        entryNo: entryNo.trim(),
        entryDate,
        denomination,
        quantity,
        amount,
        branchId: BRANCH_ID,
        createdBy: currentCreatedBy,
        ...userDetails,
        ...snapshotData,
      });
    };

    if (editingEntry) {
      for (const row of denominationRows) {
        const denomination = Number(row.denomination || 0);
        const quantity = Number(row.quantity || 0);

        const amount = Number(
          (denomination * quantity).toFixed(2)
        );

        if (row.id) {
          if (quantity <= 0) {
            continue;
          }

          await updateDenomination({
            id: row.id,
            branchId: BRANCH_ID,
            date: entryDate,
            notes: denomination,
            numbers: quantity,
            amount,
            updatedBy: currentCreatedBy,
            ...userDetails,
          });
        } else if (quantity > 0) {
          await createEntry(row);
        }
      }

      toast.success(
        "Denomination Entry updated successfully!"
      );
    } else {
      for (const row of rowsToSave) {
        await createEntry(row);
      }

      toast.success(
        "Denomination Entry saved successfully!"
      );
    }

    await fetchDenominationEntries();

    setSaveCompleted(true);
    setEditingEntry(null);
  } catch (error) {
    console.error("Denomination Save Error:", error);

    toast.error(
      error?.message || "Unable to save Denomination Entry"
    );
  } finally {
    setSaving(false);
  }
};






  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

 
const pageSize = 10;

const totalPages = Math.ceil(entries.length / pageSize);

const paginatedEntries = entries.slice(
  (pageNo - 1) * pageSize,
  pageNo * pageSize
);


  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================


const columns = useMemo(
  () => [
    {
      accessorKey: "srNo",
      header: "Sr.No",
      size: 80,
      Cell: ({ row }) => {
        const index = entries.findIndex(
          (item) => item.id === row.original.id
        );

        return index + 1;
      },
    },

    {
      accessorKey: "entryNo",
      header: "Entry No",
      size: 150,
    },

    {
      accessorKey: "entryDateText",
      header: "Entry Date",
      size: 160,
    },

    // Sales By column - Admin only
    ...(isAdmin
      ? [
          {
            accessorKey: "createdByName",
            header: "Created  By",
            size: 140,
            Cell: ({ row }) => {
              const createdBy = Number(
                row.original.createdBy
              );

              if (createdBy === 1) return "Admin";
              if (createdBy === 2) return "Sale";
              if (createdBy === 3) return "Sale2";

              return "Unknown";
            },
          },
        ]
      : []),

    {
      accessorKey: "total",
      header: "Total",
      size: 150,
      Cell: ({ cell }) => (
        <span>
          ₹ {Number(cell.getValue() || 0).toFixed(2)}
        </span>
      ),
    },

    {
      header: "Actions",
      size: 180,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          {/* Preview */}
          <Tooltip title="Preview">
            <IconButton
              color="info"
              size="small"
              onClick={() => handlePreviewEntry(row.original)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEditEntry(row.original)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ],
  [entries, isAdmin, handleEditEntry, handlePreviewEntry]
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
        {/* ==================================================
            PAGE TITLE
        ================================================== */}

        <Box textAlign="center" mb={5}>
          <Typography color="var(--complementary-color)" variant="h4">
            <b>Denomination Entry</b>
          </Typography>
        </Box>

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
            CREATE DENOMINATION ENTRY
          </Button>
        </Box>

        {/* ==================================================
            MAIN TABLE
        ================================================== */}

        <MaterialReactTable
  columns={columns}
  data={paginatedEntries}
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

              <KeyboardArrowLeftIcon
                sx={{
                  cursor: pageNo > 1 ? "pointer" : "default",

                  color: pageNo > 1 ? "inherit" : "#ccc",
                }}
                onClick={() => {
                  setPageNo((prev) => Math.max(Number(prev) - 1, 1));
                }}
              />

              <Box ml={1}>Page No</Box>

              <TextField
                sx={{
                  width: "65px",

                  ml: 1,

                  "& .MuiInputBase-input": {
                    textAlign: "center",

                    padding: "8px 5px",
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

              <Box ml={1}>Total Pages: {totalPages}</Box>
            </Box>
          )}
        />

        {/* ==================================================
            DENOMINATION FORM
        ================================================== */}

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
              HEADER
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
              Denomination Entry
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
              CONTENT
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
                ENTRY NO + DATE
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
              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Entry No:
                </Typography>

                <TextField
                  size="small"
                  value={entryNo}
                  onChange={(e) => setEntryNo(e.target.value)}
                  placeholder="Enter Entry No"
                  fullWidth
                />
              </Box>

              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Entry Date:
                </Typography>

              <DatePicker
  value={entryDate}
  onChange={(newValue) => {
    setEntryDate(newValue);

    if (newValue && !editingEntry) {
      fetchSalesSummary(newValue);
    }
  }}
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
                SALES SUMMARY
            ================================================= */}

            <Typography fontWeight={700} fontSize="15px" mb={1}>
              Sales Summary:
            </Typography>

          

<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
    },
    gap: 1.5,
    mb: 2,
  }}
>
  {isAdmin && (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "2px solid #0B5E20",
        borderRadius: 1,
        backgroundColor: "#f1fdf4",
      }}
    >
      <Typography fontSize="13px" color="text.secondary">
        Sales Total Till Now
      </Typography>

      <Typography
        fontSize="18px"
        fontWeight={700}
        color="#0B5E20"
      >
        ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
      </Typography>
    </Paper>
  )}

  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      border: "1px solid #d0d0d0",
      borderRadius: 1,
    }}
  >
    <Typography fontSize="13px" color="text.secondary">
      Total Cash
    </Typography>

    <Typography fontSize="18px" fontWeight={700}>
      ₹ {Number(salesSummary.totalCash || 0).toFixed(2)}
    </Typography>
  </Paper>

  {isAdmin && (
   <Paper
  elevation={0}
  sx={{
    p: 1.5,
    border: "1px solid #d0d0d0",
    borderRadius: 1,
    backgroundColor: "#F5F0FF",
  }}
>
  <Typography
    fontSize="13px"
    color="text.secondary"
    fontWeight={600}
  >
    Total Online
  </Typography>

  <Typography
    fontSize="18px"
    fontWeight={700}
    color="#6F42C1"
  >
    ₹ {Number(salesSummary?.totalOnline ?? 0).toFixed(2)}
  </Typography>

  <Divider sx={{ my: 1 }} />

  <Typography
    fontSize="12px"
    color="text.secondary"
    sx={{ fontWeight: 600 }}
  >
    Online Sales Entries:{" "}
    {Number(salesSummary?.totalOnlineEntries ?? 0)}
  </Typography>
</Paper>
  )}

  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      border: "1px solid #d0d0d0",
      borderRadius: 1,
    }}
  >
    <Typography fontSize="13px" color="text.secondary">
      Total Collection
    </Typography>

    <Typography fontSize="18px" fontWeight={700}>
      ₹ {Number(salesSummary.totalCollection || 0).toFixed(2)}
    </Typography>
  </Paper>
</Box>



            <Divider
              sx={{
                mb: 2,
              }}
            />

            {/* =================================================
                DENOMINATION TITLE
            ================================================= */}

            <Typography fontWeight={700} fontSize="15px" mb={1}>
              Denominations:
            </Typography>

            {/* =================================================
                DENOMINATION TABLE
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
                      Notes
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Number / Quantity
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {denominationRows.map((row, index) => (
                    <TableRow hover key={row.denomination}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          ₹ {formatDenomination(row.denomination)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <TextField
                          type="text"
                          size="small"
                          value={row.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          placeholder="Enter Number"
                          inputMode="numeric"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          onWheel={(e) => {
                            e.currentTarget.blur();
                          }}
                          sx={{
                            width: 150,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <TextField
                          size="small"
                          value={Number(row.amount || 0).toFixed(2)}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            width: 160,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* =================================================
                DENOMINATION TOTAL
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
              <Typography fontWeight={700} fontSize="14px">
                Denomination Total:
              </Typography>

              <TextField
                size="small"
                value={Number(
                  showReconciliation ? savedDenominationTotal : total,
                ).toFixed(2)}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  width: 160,
                }}
              />
            </Box>

            {/* =================================================
                RECONCILIATION
            ================================================= */}

            {showReconciliation && (
              <>
                <Divider
                  sx={{
                    mt: 2,
                    mb: 2,
                  }}
                />

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,

                    border: "1px solid",

                    borderColor: isCashMatched ? "success.main" : "error.main",

                    borderRadius: 1,

                    backgroundColor: isCashMatched ? "#f1fdf4" : "#fff5f5",
                  }}
                >
                  {/* =====================================================
          CASH RECONCILIATION
          Denomination Total VS Total Cash
      ====================================================== */}

                  <Typography
                    fontWeight={700}
                    fontSize="16px"
                    sx={{
                      mb: 2,
                    }}
                  >
                    Cash Reconciliation
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                      },

                      gap: 1.5,
                    }}
                  >
                    {/* =================================================
            TOTAL CASH
        ================================================== */}

                    <Box
                      sx={{
                        p: 1.5,

                        border: "1px solid",

                        borderColor: "divider",

                        borderRadius: 1,

                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography fontSize="13px" color="text.secondary">
                        Total Cash
                      </Typography>

                      <Typography fontWeight={700} fontSize="17px">
                        ₹ {Number(salesSummary?.totalCash || 0).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* =================================================
            DENOMINATION TOTAL
        ================================================== */}

                    <Box
                      sx={{
                        p: 1.5,

                        border: "1px solid",

                        borderColor: "divider",

                        borderRadius: 1,

                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography fontSize="13px" color="text.secondary">
                        Denomination Total
                      </Typography>

                      <Typography fontWeight={700} fontSize="17px">
                        ₹ {Number(savedDenominationTotal || 0).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* =================================================
            DIFFERENCE
        ================================================== */}

                    <Box
                      sx={{
                        p: 1.5,

                        border: "1px solid",

                        borderColor: isCashMatched
                          ? "success.light"
                          : "error.light",

                        borderRadius: 1,

                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography fontSize="13px" color="text.secondary">
                        Difference
                      </Typography>

                     <Typography
  fontWeight={700}
  fontSize="17px"
  color={isCashMatched ? "success.main" : "error.main"}
>
  ₹ {Number(cashDifference || 0).toFixed(2)}
</Typography>
                    </Box>
                  </Box>

                  {/* =====================================================
          MATCH STATUS
      ====================================================== */}

                  <Typography
                    sx={{
                      mt: 2,

                      fontWeight: 700,

                      fontSize: "16px",

                      color: isCashMatched ? "success.main" : "error.main",
                    }}
                  >
                    {isCashMatched
                      ? "✓ CASH TOTAL MATCHED"
                      : "✗ CASH TOTAL MISMATCH"}
                  </Typography>
                </Paper>
              </>
            )}
          </DialogContent>

          {/* ==================================================
              ACTIONS
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
  disabled={saving || saveCompleted}
  onClick={handleSave}
  sx={{
    textTransform: "none",
    background: "var(--primary-color)",
    "&:hover": {
      background: "var(--primary-color)",
    },
  }}
>
  {saving
    ? "Saving..."
    : saveCompleted
    ? "Saved"
    : "Save"}
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
  Close
</Button>
          </DialogActions>
        </Dialog>


 


<Dialog
  open={previewOpen}
  onClose={handleClosePreview}
  fullWidth
  maxWidth="md"
  PaperProps={{
    sx: {
      borderRadius: 3,
      maxHeight: "90vh",
    },
  }}
>
  <DialogTitle
    sx={{
      background: "linear-gradient(90deg, #08652B, #218447)",
      color: "#fff",
      fontWeight: 800,
      py: 2,
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5}>
      <VisibilityIcon />
      <Box>
        <Typography fontSize="22px" fontWeight={800}>
          Denomination Entry Preview
        </Typography>
        <Typography fontSize="13px">
          Entry details and sales summary
        </Typography>
      </Box>
    </Box>
  </DialogTitle>

  <DialogContent
    dividers
    sx={{ backgroundColor: "#F5F8FC", p: 3 }}
  >
    {previewEntry && (
      <>
        {/* ENTRY DETAILS */}
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 2, borderRadius: 2 }}
        >
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
            gap={2}
          >
            <Box>
              <Typography color="text.secondary" fontSize="13px">
                ENTRY NUMBER
              </Typography>
              <Typography fontSize="22px" fontWeight={800}>
                #{previewEntry.entryNo}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary" fontSize="13px">
                ENTRY DATE
              </Typography>
              <Typography fontSize="22px" fontWeight={800}>
                {previewEntry.entryDateText}
              </Typography>
            </Box>
          </Box>

          {isAdmin && (
            <Typography mt={1} fontWeight={600}>
              Created By: {previewEntry.createdByName || "Unknown"}
            </Typography>
          )}
        </Paper>

        {/* SALES SUMMARY */}
        <Typography fontWeight={800} fontSize="18px" mb={1.5}>
          Sales Summary
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: isAdmin
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(2, minmax(0, 1fr))",
          }}
          gap={1.5}
          mb={2.5}
        >
          {/* SALES TOTAL TILL NOW */}
          {isAdmin && (
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#EAF2FF",
                border: "1px solid #BDD2FF",
              }}
            >
              <Typography color="#245BC5" fontWeight={700}>
                Sales Total Till Now
              </Typography>
              <Typography color="#245BC5" fontSize="25px" fontWeight={800}>
                ₹ {Number(previewEntry.salesTotalTillNow || 0).toFixed(2)}
              </Typography>
            </Paper>
          )}

          {/* TOTAL CASH */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#E8F7EF",
              border: "1px solid #B8DCC8",
            }}
          >
            <Typography color="#17834A" fontWeight={700}>
              Total Cash
            </Typography>
            <Typography color="#17834A" fontSize="25px" fontWeight={800}>
              ₹ {Number(previewEntry.totalCash || 0).toFixed(2)}
            </Typography>
          </Paper>

          {/* TOTAL ONLINE AND ONLINE ENTRY COUNT */}
          {isAdmin && (
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#F1EBFF",
                border: "1px solid #D7C4FF",
              }}
            >
              <Typography color="#7041C5" fontWeight={700}>
                Total Online
              </Typography>

              <Typography color="#7041C5" fontSize="25px" fontWeight={800}>
                ₹ {Number(previewEntry.totalOnline || 0).toFixed(2)}
              </Typography>

              <Typography
                color="#7041C5"
                fontSize="13px"
                fontWeight={600}
                mt={0.5}
              >
                Online Sales Entries:{" "}
                {Number(previewEntry.totalOnlineEntries || 0)}
              </Typography>
            </Paper>
          )}

          {/* TOTAL COLLECTION */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#FFF2E2",
              border: "1px solid #FFD2A3",
            }}
          >
            <Typography color="#B66A12" fontWeight={700}>
              Total Collection
            </Typography>
            <Typography color="#B66A12" fontSize="25px" fontWeight={800}>
              ₹ {Number(previewEntry.totalCollection || 0).toFixed(2)}
            </Typography>
          </Paper>
        </Box>

        {/* DENOMINATION TABLE */}
        <Paper
          variant="outlined"
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Box p={2}>
            <Typography fontSize="18px" fontWeight={800}>
              Denominations
            </Typography>
            <Typography color="text.secondary" fontSize="13px">
              Note-wise quantity and amount
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 260 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 800, backgroundColor: "#EAF1F7" }}
                  >
                    Notes
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 800, backgroundColor: "#EAF1F7" }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 800, backgroundColor: "#EAF1F7" }}
                  >
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(previewEntry.denominations || []).map((item) => (
                  <TableRow key={item.id ?? item.notes}>
                    <TableCell>
                      <b>₹ {formatDenomination(item.notes)}</b>
                    </TableCell>
                    <TableCell align="center">
                      {Number(item.numbers || 0)}
                    </TableCell>
                    <TableCell align="right">
                      <b>₹ {Number(item.amount || 0).toFixed(2)}</b>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              p: 2,
              textAlign: "right",
              backgroundColor: "#F7FAFC",
              borderTop: "1px solid #DCE3EA",
            }}
          >
            <Typography fontWeight={800} fontSize="20px">
              Denomination Total: ₹{" "}
              {Number(previewEntry.total || 0).toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* SUMMARY CUTOFF */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#EAF2FF",
            border: "1px solid #D3E2FF",
          }}
        >
          <Typography color="#245BC5" fontWeight={700} fontSize="13px">
            Summary Cutoff Time
          </Typography>
          <Typography fontWeight={700} mt={0.5}>
            {formatCutoffIST(previewEntry.summaryCutoffDateTime)}
          </Typography>
          <Typography color="text.secondary" fontSize="13px" mt={0.5}>
            Sales summary captured at this time
          </Typography>
        </Paper>

        {/* CASH RECONCILIATION */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={1.5}
          mt={2}
          mb={1}
        >
          {/* DENOMINATION TOTAL */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#E8F7EF",
              border: "1px solid #B8DCC8",
            }}
          >
            <Typography color="#17834A" fontWeight={700}>
              Total Denomination
            </Typography>
            <Typography
              color="#17834A"
              fontSize="28px"
              fontWeight={800}
              mt={0.5}
            >
              ₹ {Number(previewEntry.total || 0).toFixed(2)}
            </Typography>
          </Paper>

          {/* CASH DIFFERENCE */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: previewCashMatched ? "#E8F7EF" : "#FDECEC",
              border: `1px solid ${
                previewCashMatched ? "#B8DCC8" : "#FFB3B3"
              }`,
            }}
          >
            <Typography
              color={previewCashMatched ? "#17834A" : "#D92D2D"}
              fontWeight={700}
            >
              Cash Difference
            </Typography>

            <Typography
              color={previewCashMatched ? "#17834A" : "#D92D2D"}
              fontSize="28px"
              fontWeight={800}
              mt={0.5}
            >
              {previewCashDifference > 0 ? "+" : ""}
              ₹ {previewCashDifference.toFixed(2)}
            </Typography>

            <Typography
              mt={1}
              fontWeight={800}
              color={previewCashMatched ? "#17834A" : "#D92D2D"}
            >
              {previewCashMatched
                ? "✓ Cash Matched"
                : previewCashDifference > 0
                ? `₹ ${previewCashDifference.toFixed(2)} Extra Cash`
                : `₹ ${Math.abs(previewCashDifference).toFixed(2)} Cash Short`}
            </Typography>
          </Paper>
        </Box>
      </>
    )}
    
  </DialogContent>

  <DialogActions sx={{ px: 3, py: 1.5, backgroundColor: "#fff" }}>
    <Button
      onClick={handleClosePreview}
      variant="outlined"
      sx={{ textTransform: "none", fontWeight: 700 }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>




      </Box>

      {/* ==========================================================
    DELETE CONFIRMATION DIALOG
========================================================== */}

 
    </LocalizationProvider>
  );
};

export default DenominationEntry;















































































































