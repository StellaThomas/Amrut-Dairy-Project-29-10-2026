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
// const USER_ID = 1;

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

//   // ==========================================================
//   // SALES RECONCILIATION
//   // ==========================================================

//   const [salesSummary, setSalesSummary] = useState({
//     regularCash: 0,
//     regularOnline: 0,

//     dealerCash: 0,
//     dealerOnline: 0,

//     catererCash: 0,
//     catererOnline: 0,

//     totalCash: 0,
//     totalOnline: 0,

//     totalCollection: 0,

//     // Main value for denomination comparison
//     salesTotalTillNow: 0,
//   });

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

//   const resetForm = () => {
//     setEditingEntry(null);
//     setEntryNo("");
//     setEntryDate(new Date());

//     setDenominationRows(createEmptyRows());

//     setShowReconciliation(false);
//     setCashDifference(0);
//     setIsCashMatched(false);

//     setSalesSummary({
//       regularCash: 0,
//       regularOnline: 0,

//       dealerCash: 0,
//       dealerOnline: 0,

//       catererCash: 0,
//       catererOnline: 0,

//       totalCash: 0,
//       totalOnline: 0,

//       totalCollection: 0,
//       salesTotalTillNow: 0,
//     });
//   };

//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//       const url = `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;

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

//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

//       setSalesSummary({
//         regularCash: 0,
//         regularOnline: 0,

//         dealerCash: 0,
//         dealerOnline: 0,

//         catererCash: 0,
//         catererOnline: 0,

//         totalCash,
//         totalOnline,

//         totalCollection,

//         salesTotalTillNow,
//       });

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

//   const fetchDenominationEntries = async () => {
//     try {
//       const url = `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`GET API failed with status ${response.status}`);
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(
//           result.message || "Unable to load denomination entries",
//         );
//       }

//       if (!Array.isArray(result.data)) {
//         setEntries([]);
//         return;
//       }

//       // ====================================================
//       // GROUP BY ENTRY NO
//       // ====================================================

//       const groupedEntries = {};

//       result.data.forEach((item) => {
//         const entryNo = item.EntryNo;

//         if (!groupedEntries[entryNo]) {
//           groupedEntries[entryNo] = {
//             id: item.Id,
//             apiId: item.Id,

//             branchId: item.BranchId,

//             entryNo: item.EntryNo,

//             entryDate: item.EntryDate,

//             entryDateText: formatDate(item.EntryDate),

//             total: 0,

//             denominations: [],

//             active: Number(item.Active || 0),

//             createdBy: item.CreatedBy,

//             updatedBy: item.UpdatedBy,

//             updatedCount: item.UpdatedCount,
//           };
//         }

//         const amount = Number(item.Amount || 0);

//         groupedEntries[entryNo].total += amount;

//         groupedEntries[entryNo].denominations.push({
//           id: item.Id,

//           notes: Number(item.Notes || 0),

//           numbers: Number(item.Numbers || 0),

//           amount,
//         });
//       });

//       const formattedEntries = Object.values(groupedEntries);

//       setEntries(formattedEntries);

//       const calculatedPages =
//         formattedEntries.length === 0
//           ? 0
//           : Math.ceil(formattedEntries.length / 10);

//       if (calculatedPages === 0) {
//         setPageNo(1);
//       } else if (pageNo > calculatedPages) {
//         setPageNo(calculatedPages);
//       }
//     } catch (error) {
//       console.error("GET DENOMINATION ERROR:", error);

//       toast.error("Unable to load Denomination Entries");
//     }
//   };

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
//     try {
//       setEditingEntry(entry);

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

//       await fetchSalesSummary(editDate);

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

//     formData.append("UpdatedBy", String(updatedBy || USER_ID));

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

//   const createDenomination = async ({
//     entryNo,
//     entryDate,
//     denomination,
//     quantity,
//     amount,
//     branchId,
//     createdBy,
//   }) => {
//     try {
//       const notes = Number(denomination || 0);

//       const numbers = Number(quantity || 0);

//       const totalAmount = Number(amount || notes * numbers);

//       const formData = new FormData();

//       formData.append("BranchId", String(branchId || BRANCH_ID));

//       formData.append("EntryDate", formatApiDate(entryDate));

//       formData.append("Notes", String(notes));

//       formData.append("Numbers", String(numbers));

//       formData.append("Amount", totalAmount.toFixed(2));

//       formData.append("CreatedBy", String(createdBy || USER_ID));

//       if (
//         entryNo !== undefined &&
//         entryNo !== null &&
//         String(entryNo).trim() !== ""
//       ) {
//         formData.append("EntryNo", String(entryNo).trim());
//       }

//       const response = await fetch(POST_DENOMINATION_API, {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || "Unable to create denomination");
//       }

//       return result;
//     } catch (error) {
//       console.error("CREATE DENOMINATION ERROR:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // SAVE
//   //
//   // IMPORTANT:
//   // VALIDATION HAPPENS BEFORE POST API
//   // ==========================================================

//   // ==========================================================
//   // SAVE / UPDATE DENOMINATION
//   // ==========================================================

//   const handleSave = async () => {
//     // ========================================================
//     // ENTRY NO VALIDATION
//     // ========================================================

//     if (!entryNo || !entryNo.trim()) {
//       toast.error("Please enter Entry No");
//       return;
//     }

//     // ========================================================
//     // DATE VALIDATION
//     // ========================================================

//     if (!entryDate) {
//       toast.error("Please select Entry Date");
//       return;
//     }

//     // ========================================================
//     // GET ENTERED DENOMINATIONS
//     // ========================================================

//     const rowsToSave = denominationRows.filter(
//       (row) => Number(row.quantity || 0) > 0,
//     );

//     if (rowsToSave.length === 0) {
//       toast.error("Please enter at least one denomination quantity");
//       return;
//     }

//     try {
//       setSaving(true);

//       // ======================================================
//       // CALCULATE DENOMINATION TOTAL
//       // ======================================================

//       const calculatedTotal = rowsToSave.reduce((sum, row) => {
//         const denomination = Number(row.denomination || 0);

//         const quantity = Number(row.quantity || 0);

//         return sum + denomination * quantity;
//       }, 0);

//       const denominationTotal = Number(calculatedTotal.toFixed(2));

//       setSavedDenominationTotal(denominationTotal);

//       // ======================================================
//       // GET SALES PAYMENT SUMMARY
//       //
//       // Cash  = Physical cash to be matched
//       // Online = Informational only
//       // ======================================================

//       const cashTotal = Number(salesSummary?.totalCash || 0);

//       const onlineTotal = Number(salesSummary?.totalOnline || 0);

//       const salesTotalTillNow = Number(salesSummary?.salesTotalTillNow || 0);

//       const totalCollection = Number(salesSummary?.totalCollection || 0);

//       // ======================================================
//       // CASH RECONCILIATION
//       //
//       // Denomination Total
//       //          VS
//       // Total Cash
//       //
//       // Online is NOT included here.
//       // ======================================================

//       const difference = Number((denominationTotal - cashTotal).toFixed(2));

//       const matched = Math.abs(difference) < 0.01;

//       // ======================================================
//       // DEBUG
//       // ======================================================

//       console.log("======================================");

//       console.log("DENOMINATION TOTAL:", denominationTotal.toFixed(2));

//       console.log("TOTAL CASH:", cashTotal.toFixed(2));

//       console.log("TOTAL ONLINE:", onlineTotal.toFixed(2));

//       console.log("SALES TOTAL TILL NOW:", salesTotalTillNow.toFixed(2));

//       console.log("TOTAL COLLECTION:", totalCollection.toFixed(2));

//       console.log("CASH + ONLINE:", (cashTotal + onlineTotal).toFixed(2));

//       console.log("CASH DIFFERENCE:", difference.toFixed(2));

//       console.log("CASH MATCHED:", matched);

//       console.log("EDIT MODE:", Boolean(editingEntry));

//       console.log("======================================");

//       // ======================================================
//       // SET RECONCILIATION RESULT
//       //
//       // IMPORTANT:
//       // This does NOT block Save.
//       // It only displays matched / mismatch result.
//       // ======================================================

//       setCashDifference(difference);

//       setIsCashMatched(matched);

//       setShowReconciliation(true);

//       // ======================================================
//       // EDIT EXISTING ENTRY
//       // ======================================================

//       if (editingEntry) {
//         const allRows = denominationRows;

//         for (const row of allRows) {
//           const quantity = Number(row.quantity || 0);

//           const denomination = Number(row.denomination || 0);

//           const amount = Number((denomination * quantity).toFixed(2));

//           // --------------------------------------------------
//           // EXISTING ROW
//           // --------------------------------------------------

//           if (row.id) {
//             await updateDenomination({
//               id: row.id,

//               branchId: BRANCH_ID,

//               date: entryDate,

//               notes: row.denomination,

//               numbers: quantity,

//               amount: amount,

//               updatedBy: USER_ID,
//             });
//           }

//           // --------------------------------------------------
//           // NEW ROW ADDED DURING EDIT
//           // --------------------------------------------------
//           else if (quantity > 0) {
//             await createDenomination({
//               entryNo: entryNo.trim(),

//               entryDate,

//               denomination: denomination,

//               quantity: quantity,

//               amount: amount,

//               branchId: BRANCH_ID,

//               createdBy: USER_ID,
//             });
//           }
//         }

//         toast.success("Denomination Entry updated successfully!");
//       }

//       // ======================================================
//       // CREATE NEW ENTRY
//       // ======================================================
//       else {
//         for (const row of rowsToSave) {
//           const denomination = Number(row.denomination || 0);

//           const quantity = Number(row.quantity || 0);

//           const amount = Number((denomination * quantity).toFixed(2));

//           await createDenomination({
//             entryNo: entryNo.trim(),

//             entryDate,

//             denomination: denomination,

//             quantity: quantity,

//             amount: amount,

//             branchId: BRANCH_ID,

//             createdBy: USER_ID,
//           });
//         }

//         toast.success("Denomination Entry saved successfully!");
//       }

//       // ======================================================
//       // REFRESH MAIN TABLE
//       // ======================================================

//       await fetchDenominationEntries();

//       // ======================================================
//       // RESET FORM
//       // ======================================================

//       setDenominationRows(createEmptyRows());

//       setSavedDenominationTotal(0);

//       setEditingEntry(null);
//     } catch (error) {
//       console.error("Denomination Save Error:", error);

//       toast.error(error?.message || "Unable to save Denomination Entry");
//     } finally {
//       setSaving(false);
//     }
//   };

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

//   const totalPages = entries.length === 0 ? 0 : Math.ceil(entries.length / 10);

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
//           columns={columns}
//           data={entries}
//           enablePagination={false}
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

//                 <DatePicker
//                   value={entryDate}
//                   onChange={(newValue) => {
//                     setEntryDate(newValue);

//                     if (newValue) {
//                       fetchSalesSummary(newValue);
//                     }
//                   }}
//                   format="dd-MM-yyyy"
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       fullWidth: true,
//                     },
//                   }}
//                 />
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

//                       <Typography
//                         fontWeight={700}
//                         fontSize="17px"
//                         color={isCashMatched ? "success.main" : "error.main"}
//                       >
//                         ₹ {Math.abs(Number(cashDifference || 0)).toFixed(2)}
//                       </Typography>
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
//               variant="contained"
//               disabled={saving}
//               onClick={handleSave}
//               sx={{
//                 textTransform: "none",

//                 background: "var(--primary-color)",

//                 "&:hover": {
//                   background: "var(--primary-color)",
//                 },
//               }}
//             >
//               {saving ? "Saving..." : "Save"}
//             </Button>

//             <Button
//               variant="outlined"
//               disabled={saving}
//               onClick={handleCloseForm}
//               sx={{
//                 textTransform: "none",

//                 color: "var(--complementary-color)",

//                 borderColor: "var(--complementary-color)",

//                 "&:hover": {
//                   borderColor: "var(--complementary-color)",
//                 },
//               }}
//             >
//               Cancel
//             </Button>
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
import DeleteIcon from "@mui/icons-material/Delete";
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
const USER_ID = 1;

// ============================================================
// COMPONENT
// ============================================================

const DenominationEntry = () => {
  // ==========================================================
  // MAIN TABLE DATA
  // ==========================================================

  const [entries, setEntries] = useState([]);

  // ==========================================================
  // FORM
  // ==========================================================

  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteEntry, setDeleteEntry] = useState(null);

  const [deleting, setDeleting] = useState(false);


  const [saveCompleted, setSaveCompleted] = useState(false);

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

    totalCollection: 0,

    // Main value for denomination comparison
    salesTotalTillNow: 0,
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
  // ==========================================
  // RESET EDITING STATE
  // ==========================================
  setEditingEntry(null);

  // ==========================================
  // RESET ENTRY NO & DATE
  // ==========================================
  setEntryNo("");
  setEntryDate(new Date());

  // ==========================================
  // RESET DENOMINATION ROWS
  // ==========================================
  setDenominationRows(createEmptyRows());

  // ==========================================
  // RESET RECONCILIATION
  // ==========================================
  setShowReconciliation(false);
  setCashDifference(0);
  setIsCashMatched(false);

  // ==========================================
  // RESET SAVED DENOMINATION TOTAL
  // ==========================================
  setSavedDenominationTotal(0);

  // ==========================================
  // RESET SAVE STATUS
  // ==========================================
  setSaveCompleted(false);

  // ==========================================
  // RESET SALES SUMMARY
  // ==========================================
  setSalesSummary({
    regularCash: 0,
    regularOnline: 0,

    dealerCash: 0,
    dealerOnline: 0,

    catererCash: 0,
    catererOnline: 0,

    totalCash: 0,
    totalOnline: 0,

    totalCollection: 0,
    salesTotalTillNow: 0,
  });
};

  // ==========================================================
  // GENERATE NEXT DENOMINATION ENTRY NO
  // ==========================================================

  const generateNextEntryNo = async () => {
    try {
      const url = `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;

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
        const invoiceDateOnly = getInvoiceDateOnly(invoice);

        if (invoiceDateOnly !== selectedDateString) {
          return false;
        }

        // ==================================================
        // IF SELECTED DATE IS TODAY
        // ONLY INCLUDE INVOICES TILL NOW
        // ==================================================

        if (isSameDate(selectedDate, now)) {
          const invoiceDateTime = getInvoiceDateTime(invoice);

          // If API contains proper time,
          // compare with current time.
          if (invoiceDateTime) {
            return invoiceDateTime.getTime() <= now.getTime();
          }

          // If API has only date and no time,
          // include today's invoice because
          // backend has not provided invoice time.
          return true;
        }

        // ==================================================
        // PAST DATE
        // ALL INVOICES OF THAT DATE
        // ==================================================

        return true;
      });

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
          // जर PaymentMode blank/unknown असेल
          // तर saved CashAmount + OnlineAmount वापरू
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

        totalCollection,

        salesTotalTillNow,
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

   const CREATED_BY =
      sessionStorage.getItem("CreatedBy") || "";
  try {
    // ====================================================
    // GET DENOMINATION ENTRIES
    // ====================================================

    const url =
      `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}&CreatedBy=${CREATED_BY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `GET API failed with status ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to load denomination entries"
      );
    }

    // ====================================================
    // VALIDATE RESPONSE DATA
    // ====================================================

    if (!Array.isArray(result.data)) {
      setEntries([]);
      setPageNo(1);
      return;
    }

    // ====================================================
    // GROUP BY ENTRY NO
    // ====================================================

    const groupedEntries = {};

    result.data.forEach((item) => {
      const entryNo = item.EntryNo;

      if (!groupedEntries[entryNo]) {
        groupedEntries[entryNo] = {
          id: item.Id,

          apiId: item.Id,

          branchId: item.BranchId,

          entryNo: item.EntryNo,

          entryDate: item.EntryDate,

          entryDateText:
            formatDate(item.EntryDate),

          total: 0,

          denominations: [],

          active:
            Number(item.Active || 0),

          createdBy:
            item.CreatedBy,

          updatedBy:
            item.UpdatedBy,

          updatedCount:
            item.UpdatedCount,
        };
      }

      // ==================================================
      // CALCULATE ENTRY TOTAL
      // ==================================================

      const amount =
        Number(item.Amount || 0);

      groupedEntries[
        entryNo
      ].total += amount;

      // ==================================================
      // STORE DENOMINATION DETAILS
      // ==================================================

      groupedEntries[
        entryNo
      ].denominations.push({
        id: item.Id,

        notes:
          Number(item.Notes || 0),

        numbers:
          Number(item.Numbers || 0),

        amount: amount,
      });
    });

    // ====================================================
    // CONVERT GROUPED OBJECT TO ARRAY
    // ====================================================

    const formattedEntries =
      Object.values(groupedEntries);

    // ====================================================
    // SORT LATEST ENTRY FIRST
    //
    // 1. Latest Entry Date first
    // 2. If same date, highest Entry No first
    // ====================================================

    formattedEntries.sort((a, b) => {
      // ----------------------------------------------
      // ENTRY DATE
      // ----------------------------------------------

      const dateA = a?.entryDate
        ? new Date(
            a.entryDate
          ).getTime()
        : 0;

      const dateB = b?.entryDate
        ? new Date(
            b.entryDate
          ).getTime()
        : 0;

      // ----------------------------------------------
      // LATEST DATE FIRST
      // ----------------------------------------------

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      // ----------------------------------------------
      // SAME DATE
      // HIGHEST ENTRY NO FIRST
      // ----------------------------------------------

      const entryNoA =
        Number(a?.entryNo || 0);

      const entryNoB =
        Number(b?.entryNo || 0);

      return entryNoB - entryNoA;
    });

    // ====================================================
    // DEBUG - CHECK SORTING
    // ====================================================

    console.log(
      "======================================"
    );

    console.log(
      "DENOMINATION ENTRIES - LATEST FIRST:",
      formattedEntries
    );

    console.log(
      "LATEST ENTRY:",
      formattedEntries[0]
    );

    console.log(
      "======================================"
    );

    // ====================================================
    // SET SORTED ENTRIES
    // ====================================================

    setEntries(formattedEntries);

    // ====================================================
    // CALCULATE TOTAL PAGES
    // ====================================================

    const calculatedPages =
      formattedEntries.length === 0
        ? 0
        : Math.ceil(
            formattedEntries.length / 10
          );

    // ====================================================
    // PAGE VALIDATION
    // ====================================================

    if (calculatedPages === 0) {
      setPageNo(1);
    } else if (
      pageNo > calculatedPages
    ) {
      setPageNo(
        calculatedPages
      );
    }

  } catch (error) {
    console.error(
      "GET DENOMINATION ERROR:",
      error
    );

    toast.error(
      "Unable to load Denomination Entries"
    );
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
    setSaveCompleted(false);

    setEditingEntry(entry);

      setEntryNo(String(entry?.entryNo || ""));

      const editDate = entry?.entryDate
        ? new Date(entry.entryDate)
        : new Date();

      setEntryDate(editDate);

      // ------------------------------------------------------
      // CREATE EMPTY ROWS
      // ------------------------------------------------------

      const emptyRows = createEmptyRows();

      // ------------------------------------------------------
      // PUT EXISTING DENOMINATION DATA INTO ROWS
      // ------------------------------------------------------

      const existingDenominations = Array.isArray(entry?.denominations)
        ? entry.denominations
        : [];

      const editRows = emptyRows.map((row) => {
        const existing = existingDenominations.find(
          (item) => Number(item.notes) === Number(row.denomination),
        );

        if (existing) {
          return {
            ...row,

            id: existing.id,

            quantity:
              Number(existing.numbers || 0) > 0 ? String(existing.numbers) : "",

            amount: Number(existing.amount || 0),
          };
        }

        return row;
      });

      setDenominationRows(editRows);

      // ------------------------------------------------------
      // FETCH SALES SUMMARY FOR EDIT DATE
      // ------------------------------------------------------

      await fetchSalesSummary(editDate);

      setShowReconciliation(false);
      setCashDifference(0);
      setIsCashMatched(false);

      setOpenForm(true);
    } catch (error) {
      console.error("EDIT DENOMINATION ERROR:", error);

      toast.error("Unable to open denomination entry for edit");
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

    formData.append("UpdatedBy", String(updatedBy || USER_ID));

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
}) => {

    try {
      const notes = Number(denomination || 0);

      const numbers = Number(quantity || 0);

      const totalAmount = Number(amount || notes * numbers);

      const formData = new FormData();

      formData.append("BranchId", String(branchId || BRANCH_ID));

      formData.append("EntryDate", formatApiDate(entryDate));

      formData.append("Notes", String(notes));

      formData.append("Numbers", String(numbers));

      formData.append("Amount", totalAmount.toFixed(2));

      formData.append("CreatedBy", String(createdBy || USER_ID));


      
formData.append("CreatedBy", String(createdBy));

// Login मधील actual values
if (userId) {
  formData.append("UserId", String(userId));
}

if (saleRole) {
  formData.append("SaleRole", String(saleRole));
}

if (drawerId) {
  formData.append("DrawerId", String(drawerId));
}

console.log(
  "POST DENOMINATION PAYLOAD:",
  Object.fromEntries(formData.entries())
);


      if (
        entryNo !== undefined &&
        entryNo !== null &&
        String(entryNo).trim() !== ""
      ) {
        formData.append("EntryNo", String(entryNo).trim());
      }

      // const response = await fetch(POST_DENOMINATION_API, {
      //   method: "POST",
      //   body: formData,
      // });




      

const response = await fetch(POST_DENOMINATION_API, {
  method: "POST",
  credentials: "include",
  body: formData,
});

console.log("POST STATUS:", response.status);

const result = await response.json();

console.log("POST RESPONSE:", result);



    

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to create denomination");
      }

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
  // ========================================================
  // ENTRY NO VALIDATION
  // ========================================================
  if (!entryNo || !entryNo.trim()) {
    toast.error("Please enter Entry No");
    return;
  }

  // ========================================================
  // DATE VALIDATION
  // ========================================================
  if (!entryDate) {
    toast.error("Please select Entry Date");
    return;
  }

  // ========================================================
  // GET ENTERED DENOMINATIONS
  // ========================================================
  const rowsToSave = denominationRows.filter(
    (row) => Number(row.quantity || 0) > 0
  );

  if (rowsToSave.length === 0) {
    toast.error("Please enter at least one denomination quantity");
    return;
  }

  // ========================================================
  // GET LOGGED-IN USER DETAILS
  // ========================================================
  const loggedInUserId =
    sessionStorage.getItem("UserId") ||
    sessionStorage.getItem("LoginUserId") ||
    "";

  const loggedInSaleRole =
    sessionStorage.getItem("UserRole") || "";

  const currentCreatedBy =
    sessionStorage.getItem("CreatedBy") || "";

  const drawerId =
    sessionStorage.getItem("Device") || "";

  console.log("========== LOGIN DETAILS ==========");
  console.log("UserId:", loggedInUserId);
  console.log("SaleRole:", loggedInSaleRole);
  console.log("CreatedBy:", currentCreatedBy);
  console.log("DrawerId:", drawerId);
  console.log("===================================");

  // Do not send empty identity values
  if (!loggedInUserId || !loggedInSaleRole) {
    toast.error(
      "Login UserId or UserRole missing. Please login again."
    );
    return;
  }

  try {
    setSaving(true);

    // ======================================================
    // CALCULATE DENOMINATION TOTAL
    // ======================================================
    const calculatedTotal = rowsToSave.reduce((sum, row) => {
      const denomination = Number(row.denomination || 0);
      const quantity = Number(row.quantity || 0);

      return sum + denomination * quantity;
    }, 0);

    const denominationTotal = Number(calculatedTotal.toFixed(2));

    setSavedDenominationTotal(denominationTotal);

    // ======================================================
    // GET SALES PAYMENT SUMMARY
    // ======================================================
    const cashTotal = Number(salesSummary?.totalCash || 0);
    const onlineTotal = Number(salesSummary?.totalOnline || 0);
    const salesTotalTillNow = Number(
      salesSummary?.salesTotalTillNow || 0
    );
    const totalCollection = Number(
      salesSummary?.totalCollection || 0
    );

    // ======================================================
    // CASH RECONCILIATION
    // ======================================================
    const difference = Number(
      (denominationTotal - cashTotal).toFixed(2)
    );

    const matched = Math.abs(difference) < 0.01;

    console.log("========== RECONCILIATION ==========");
    console.log("DENOMINATION TOTAL:", denominationTotal);
    console.log("TOTAL CASH:", cashTotal);
    console.log("TOTAL ONLINE:", onlineTotal);
    console.log("SALES TOTAL TILL NOW:", salesTotalTillNow);
    console.log("TOTAL COLLECTION:", totalCollection);
    console.log("CASH + ONLINE:", cashTotal + onlineTotal);
    console.log("CASH DIFFERENCE:", difference);
    console.log("CASH MATCHED:", matched);
    console.log("EDIT MODE:", Boolean(editingEntry));
    console.log("====================================");

    setCashDifference(difference);
    setIsCashMatched(matched);
    setShowReconciliation(true);

    // ======================================================
    // COMMON USER DETAILS FOR API CALLS
    // ======================================================
    const userDetails = {
      userId: loggedInUserId,
      saleRole: loggedInSaleRole,
      drawerId,
    };

    // ======================================================
    // EDIT EXISTING ENTRY
    // ======================================================
    if (editingEntry) {
      for (const row of denominationRows) {
        const quantity = Number(row.quantity || 0);
        const denomination = Number(row.denomination || 0);
        const amount = Number(
          (denomination * quantity).toFixed(2)
        );

        // Existing denomination row
        if (row.id) {
          // Skip rows with zero quantity.
          // Confirm with backend how existing rows should be removed.
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
            updatedBy: currentCreatedBy || USER_ID,
            ...userDetails,
          });
        } else if (quantity > 0) {
          // New denomination row added during edit
          await createDenomination({
            entryNo: entryNo.trim(),
            entryDate,
            denomination,
            quantity,
            amount,
            branchId: BRANCH_ID,
            createdBy: currentCreatedBy || USER_ID,
            ...userDetails,
          });
        }
      }

      toast.success("Denomination Entry updated successfully!");
    } else {
      // ====================================================
      // CREATE NEW ENTRY
      // ====================================================
      for (const row of rowsToSave) {
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
          createdBy: currentCreatedBy || USER_ID,
          ...userDetails,
        });
      }

      toast.success("Denomination Entry saved successfully!");
    }

    // ======================================================
    // REFRESH MAIN TABLE
    // ======================================================
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
  // DELETE
  // ==========================================================

  // ==========================================================
  // OPEN DELETE CONFIRMATION DIALOG
  // ==========================================================

  const handleDeleteEntry = (entry) => {
    if (
      !entry ||
      !Array.isArray(entry.denominations) ||
      entry.denominations.length === 0
    ) {
      toast.error("No denomination records found for this entry.");

      return;
    }

    console.log("DELETE ENTRY:", entry);

    console.log("DENOMINATION RECORDS:", entry.denominations);

    setDeleteEntry(entry);

    setDeleteDialogOpen(true);
  };

  // ==========================================================
  // CANCEL DELETE
  // ==========================================================

  const handleCancelDelete = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);

    setDeleteEntry(null);
  };

  // ==========================================================
  // CONFIRM DELETE - DELETE COMPLETE ENTRY
  // ==========================================================

  const handleConfirmDelete = async () => {
    if (
      !deleteEntry ||
      !Array.isArray(deleteEntry.denominations) ||
      deleteEntry.denominations.length === 0
    ) {
      toast.error("No denomination records found.");

      return;
    }

    try {
      setDeleting(true);

      // ======================================================
      // GET ALL DENOMINATION IDS
      // ======================================================

      const denominationIds = deleteEntry.denominations
        .map((item) => item?.id)
        .filter((id) => id !== null && id !== undefined && id !== "");

      console.log("====================================");

      console.log("DELETE ENTRY NO:", deleteEntry.entryNo);

      console.log("DENOMINATION IDS:", denominationIds);

      console.log("TOTAL RECORDS TO DELETE:", denominationIds.length);

      console.log("====================================");

      if (denominationIds.length === 0) {
        toast.error("No valid denomination IDs found.");

        return;
      }

      // ======================================================
      // DELETE ALL DENOMINATION RECORDS
      // ======================================================

      for (const id of denominationIds) {
        const deleteUrl =
          `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
          `?Table=DailyDenomination&Id=${encodeURIComponent(id)}`;

        console.log("Deleting ID:", id);

        console.log("Delete URL:", deleteUrl);

        const response = await fetch(deleteUrl, {
          method: "GET",
          redirect: "follow",
        });

        const result = await response.text();

        console.log("DELETE RESPONSE:", id, result);

        // ====================================================
        // CHECK API ERROR
        // ====================================================

        if (
          result.includes("Connection could not be established") ||
          result.includes("Login failed") ||
          result.includes("SQLSTATE") ||
          result.includes('"error"')
        ) {
          throw new Error(`Delete failed for denomination ID ${id}`);
        }

        if (!response.ok) {
          throw new Error(`Delete failed for denomination ID ${id}`);
        }
      }

      // ======================================================
      // SUCCESS
      // ======================================================

      toast.success(
        `Denomination Entry ${deleteEntry.entryNo} deleted successfully!`,
      );

      // ======================================================
      // CLOSE POPUP
      // ======================================================

      setDeleteDialogOpen(false);

      setDeleteEntry(null);

      // ======================================================
      // REFRESH TABLE
      // ======================================================

      await fetchDenominationEntries();
    } catch (error) {
      console.error("DELETE DENOMINATION ENTRY ERROR:", error);

      toast.error(error?.message || "Unable to delete Denomination Entry");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

  const totalPages = entries.length === 0 ? 0 : Math.ceil(entries.length / 10);

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
            (item) => item.id === row.original.id,
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

      {
        accessorKey: "total",

        header: "Total",

        size: 150,

        Cell: ({ cell }) => (
          <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
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
            {/* ================= EDIT ================= */}
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEditEntry(row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* ================= DELETE ================= */}
            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteEntry(row.original)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [entries, handleEditEntry, handleDeleteEntry],
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
          data={entries}
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

                    if (newValue) {
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
                  sm: "repeat(4, 1fr)",
                },

                gap: 1.5,

                mb: 2,
              }}
            >
              {/* SALES TOTAL TILL NOW */}

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

                <Typography fontSize="18px" fontWeight={700} color="#0B5E20">
                  ₹ {Number(salesSummary.salesTotalTillNow || 0).toFixed(2)}
                </Typography>
              </Paper>

              {/* TOTAL CASH */}

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

              {/* TOTAL ONLINE */}

              <Paper
                elevation={0}
                sx={{
                  p: 1.5,

                  border: "1px solid #d0d0d0",

                  borderRadius: 1,
                }}
              >
                <Typography fontSize="13px" color="text.secondary">
                  Total Online
                </Typography>

                <Typography fontSize="18px" fontWeight={700}>
                  ₹ {Number(salesSummary.totalOnline || 0).toFixed(2)}
                </Typography>
              </Paper>

              {/* TOTAL COLLECTION */}

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
      </Box>

      {/* ==========================================================
    DELETE CONFIRMATION DIALOG
========================================================== */}

      <Dialog
        open={deleteDialogOpen}
        onClose={deleting ? undefined : handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "error.main",
            fontWeight: 700,
            fontSize: "24px",
          }}
        >
          Delete Denomination Entry
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              fontSize: "18px",
              mb: 1,
            }}
          >
            Are you sure you want to delete this Denomination Entry?
          </Typography>

          {deleteEntry && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography fontWeight={600}>Entry No:</Typography>

              <Typography
                sx={{
                  mb: 1,
                }}
              >
                {deleteEntry.entryNo}
              </Typography>

              <Typography fontWeight={600}>Entry Date:</Typography>

              <Typography
                sx={{
                  mb: 1,
                }}
              >
                {deleteEntry.entryDateText}
              </Typography>

              <Typography fontWeight={600}>Total:</Typography>

              <Typography>
                ₹ {Number(deleteEntry.total || 0).toFixed(2)}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "error.main",
                  fontSize: "14px",
                }}
              >
                This will delete all denomination records belonging to this
                entry.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            disabled={deleting}
          >
            CANCEL
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "DELETING..." : "DELETE"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DenominationEntry;





































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

//   const [salesSummary, setSalesSummary] = useState({
//     regularCash: 0,
//     regularOnline: 0,

//     dealerCash: 0,
//     dealerOnline: 0,

//     catererCash: 0,
//     catererOnline: 0,

//     totalCash: 0,
//     totalOnline: 0,

//     totalCollection: 0,

//     // Main value for denomination comparison
//     salesTotalTillNow: 0,
//   });

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

//  const resetForm = () => {
//   // ==========================================
//   // RESET EDITING STATE
//   // ==========================================
//   setEditingEntry(null);

//   // ==========================================
//   // RESET ENTRY NO & DATE
//   // ==========================================
//   setEntryNo("");
//   setEntryDate(new Date());

//   // ==========================================
//   // RESET DENOMINATION ROWS
//   // ==========================================
//   setDenominationRows(createEmptyRows());

//   // ==========================================
//   // RESET RECONCILIATION
//   // ==========================================
//   setShowReconciliation(false);
//   setCashDifference(0);
//   setIsCashMatched(false);

//   // ==========================================
//   // RESET SAVED DENOMINATION TOTAL
//   // ==========================================
//   setSavedDenominationTotal(0);

//   // ==========================================
//   // RESET SAVE STATUS
//   // ==========================================
//   setSaveCompleted(false);

//   // ==========================================
//   // RESET SALES SUMMARY
//   // ==========================================
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
//   });
// };

//   // ==========================================================
//   // GENERATE NEXT DENOMINATION ENTRY NO
//   // ==========================================================

//   const generateNextEntryNo = async () => {
//     try {
//       // const url = `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;


//       const url = `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;

// const response = await fetch(url, {
//   method: "GET",
//   credentials: "include",
// });

      

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

//       // const requestOptions = {
//       //   method: "GET",
//       //   redirect: "follow",
//       // };





//       const requestOptions = {
//   method: "GET",
//   credentials: "include",
//   redirect: "follow",
// };

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

//       // ======================================================
//       // SET SUMMARY
//       // ======================================================

//       setSalesSummary({
//         regularCash: 0,
//         regularOnline: 0,

//         dealerCash: 0,
//         dealerOnline: 0,

//         catererCash: 0,
//         catererOnline: 0,

//         totalCash,
//         totalOnline,

//         totalCollection,

//         salesTotalTillNow,
//       });

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
//     // ====================================================
//     // GET DENOMINATION ENTRIES
//     // ====================================================

//     // const url =
//     //   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;

//     // const response = await fetch(url);



    
// const url =
//   `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;

// const response = await fetch(url, {
//   method: "GET",
//   credentials: "include",
// });


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

//     const groupedEntries = {};

//   result.data.forEach((item) => {
//   // ==========================================
//   // CREATE UNIQUE ENTRY KEY
//   // ==========================================

//   const entryNo = item.EntryNo;

//   const entryKey = [
//     item.BranchId ?? BRANCH_ID,
//     item.UserId ?? "",
//     item.DrawerId ?? "",
//     item.EntryDate ?? "",
//     entryNo ?? "",
//   ].join("_");

//   // ==========================================
//   // CREATE ENTRY IF NOT EXISTS
//   // ==========================================

//   if (!groupedEntries[entryKey]) {
//     groupedEntries[entryKey] = {
//       id: item.Id,

//       apiId: item.Id,

//       branchId: item.BranchId ?? BRANCH_ID,

//       userId: item.UserId ?? null,

//       drawerId: item.DrawerId ?? null,

//       userName: item.UserName ?? "",

//       entryNo: item.EntryNo,

//       entryDate: item.EntryDate,

//       entryDateText: formatDate(item.EntryDate),

//       total: 0,

//       denominations: [],

//       active: Number(item.Active || 0),

//       createdBy: item.CreatedBy,

//       updatedBy: item.UpdatedBy,

//       updatedCount: item.UpdatedCount,
//     };
//   }

//   // ==========================================
//   // CALCULATE ENTRY TOTAL
//   // ==========================================

//   const amount = Number(item.Amount || 0);

//   groupedEntries[entryKey].total += amount;

//   // ==========================================
//   // STORE DENOMINATION DETAILS
//   // ==========================================

//   groupedEntries[entryKey].denominations.push({
//     id: item.Id,

//     notes: Number(item.Notes || 0),

//     numbers: Number(item.Numbers || 0),

//     amount: amount,
//   });
// });

//     // ====================================================
//     // CONVERT GROUPED OBJECT TO ARRAY
//     // ====================================================

//     const formattedEntries =
//       Object.values(groupedEntries);

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

//       await fetchSalesSummary(editDate);

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

// const updateDenomination = async ({
//   id,
//   branchId,
//   date,
//   notes,
//   numbers,
//   amount,
//   updatedBy,
//   userId,
//   drawerId,
// }) => {
//   try {
//     const formData = new FormData();

//     formData.append("Id", String(id));
//     formData.append("BranchId", String(branchId || BRANCH_ID));
//     formData.append("EntryDate", formatApiDate(date));
//     formData.append("Notes", String(Number(notes || 0)));
//     formData.append("Numbers", String(Number(numbers || 0)));
//     formData.append("Amount", Number(amount || 0).toFixed(2));
//     formData.append("UpdatedBy", String(updatedBy));

//     // UserId add करा
//     if (userId !== undefined && userId !== null && userId !== "") {
//       formData.append("UserId", String(userId));
//     }

//     // DrawerId add करा
//     if (drawerId !== undefined && drawerId !== null && drawerId !== "") {
//       formData.append("DrawerId", String(drawerId));
//     }

//     console.log(
//       "UPDATE DENOMINATION PAYLOAD:",
//       Object.fromEntries(formData.entries())
//     );

//     const response = await fetch(UPDATE_DENOMINATION_API, {
//   method: "POST",
//   credentials: "include",
//   body: formData,
// });

//     const result = await response.json();

//     console.log("UPDATE DENOMINATION RESPONSE:", result);

//     if (!response.ok || !result.success) {
//       throw new Error(
//         result.message || "Unable to update denomination"
//       );
//     }

//     return result;
//   } catch (error) {
//     console.error("UPDATE DENOMINATION ERROR:", error);
//     throw error;
//   }
// };

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
//   drawerId,
// }) => {
//   try {
//     const notes = Number(denomination || 0);
//     const numbers = Number(quantity || 0);
//     const totalAmount = Number(amount ?? notes * numbers);

//     const formData = new FormData();

//     formData.append("BranchId", String(branchId || BRANCH_ID));
//     formData.append("EntryDate", formatApiDate(entryDate));
//     formData.append("Notes", String(notes));
//     formData.append("Numbers", String(numbers));
//     formData.append("Amount", totalAmount.toFixed(2));
//     formData.append("CreatedBy", String(createdBy));

//     // UserId add करा
//     if (userId !== undefined && userId !== null && userId !== "") {
//       formData.append("UserId", String(userId));
//     }

//     // DrawerId add करा
//     if (drawerId !== undefined && drawerId !== null && drawerId !== "") {
//       formData.append("DrawerId", String(drawerId));
//     }

//     // EntryNo add करा
//     if (
//       entryNo !== undefined &&
//       entryNo !== null &&
//       String(entryNo).trim() !== ""
//     ) {
//       formData.append("EntryNo", String(entryNo).trim());
//     }

//     console.log(
//       "CREATE DENOMINATION PAYLOAD:",
//       Object.fromEntries(formData.entries())
//     );

//     // const response = await fetch(POST_DENOMINATION_API, {
//     //   method: "POST",
//     //   body: formData,
//     // });


//     const response = await fetch(POST_DENOMINATION_API, {
//   method: "POST",
//   credentials: "include",
//   body: formData,
// });

//     const result = await response.json();

//     console.log("CREATE DENOMINATION RESPONSE:", result);

//     if (!response.ok || !result.success) {
//       throw new Error(
//         result.message || "Unable to create denomination"
//       );
//     }

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

//   const handleSave = async () => {
//     // ========================================================
//     // ENTRY NO VALIDATION
//     // ========================================================

//     if (!entryNo || !entryNo.trim()) {
//       toast.error("Please enter Entry No");
//       return;
//     }

//     // ========================================================
//     // DATE VALIDATION
//     // ========================================================

//     if (!entryDate) {
//       toast.error("Please select Entry Date");
//       return;
//     }

//     // ========================================================
//     // GET ENTERED DENOMINATIONS
//     // ========================================================

//    const rowsToSave = denominationRows.filter(
//   (row) => Number(row.quantity || 0) > 0,
// );

// if (rowsToSave.length === 0) {
//   toast.error("Please enter at least one denomination quantity");
//   return;
// }

// // Get logged-in user's CreatedBy value from sessionStorage
// const currentUserId = sessionStorage.getItem("CreatedBy");

// if (!currentUserId) {
//   toast.error("Login user not found. Please login again.");
//   return;
// }



// const loggedInUserId =
//   sessionStorage.getItem("UserId") ||
//   sessionStorage.getItem("LoginUserId");

// const drawerId = sessionStorage.getItem("Device");

// if (!loggedInUserId || !drawerId) {
//   console.error("Missing user or device:", {
//     loggedInUserId,
//     drawerId,
//   });

//   toast.error("User ID or Device not found. Please login again.");
//   return;
// }

// console.log("CreatedBy:", currentUserId);
// console.log("UserId:", loggedInUserId);
// console.log("DrawerId:", drawerId);

// try {
//   setSaving(true);

//   // Continue with your existing code below...


//       // ======================================================
//       // CALCULATE DENOMINATION TOTAL
//       // ======================================================

//       const calculatedTotal = rowsToSave.reduce((sum, row) => {
//         const denomination = Number(row.denomination || 0);

//         const quantity = Number(row.quantity || 0);

//         return sum + denomination * quantity;
//       }, 0);

//       const denominationTotal = Number(calculatedTotal.toFixed(2));

//       setSavedDenominationTotal(denominationTotal);

//       // ======================================================
//       // GET SALES PAYMENT SUMMARY
//       //
//       // Cash  = Physical cash to be matched
//       // Online = Informational only
//       // ======================================================

//       const cashTotal = Number(salesSummary?.totalCash || 0);

//       const onlineTotal = Number(salesSummary?.totalOnline || 0);

//       const salesTotalTillNow = Number(salesSummary?.salesTotalTillNow || 0);

//       const totalCollection = Number(salesSummary?.totalCollection || 0);

//       // ======================================================
//       // CASH RECONCILIATION
//       //
//       // Denomination Total
//       //          VS
//       // Total Cash
//       //
//       // Online is NOT included here.
//       // ======================================================

//       const difference = Number((denominationTotal - cashTotal).toFixed(2));

//       const matched = Math.abs(difference) < 0.01;

//       // ======================================================
//       // DEBUG
//       // ======================================================

//       console.log("======================================");

//       console.log("DENOMINATION TOTAL:", denominationTotal.toFixed(2));

//       console.log("TOTAL CASH:", cashTotal.toFixed(2));

//       console.log("TOTAL ONLINE:", onlineTotal.toFixed(2));

//       console.log("SALES TOTAL TILL NOW:", salesTotalTillNow.toFixed(2));

//       console.log("TOTAL COLLECTION:", totalCollection.toFixed(2));

//       console.log("CASH + ONLINE:", (cashTotal + onlineTotal).toFixed(2));

//       console.log("CASH DIFFERENCE:", difference.toFixed(2));

//       console.log("CASH MATCHED:", matched);

//       console.log("EDIT MODE:", Boolean(editingEntry));

//       console.log("======================================");

//       // ======================================================
//       // SET RECONCILIATION RESULT
//       //
//       // IMPORTANT:
//       // This does NOT block Save.
//       // It only displays matched / mismatch result.
//       // ======================================================

//       setCashDifference(difference);

//       setIsCashMatched(matched);

//       setShowReconciliation(true);

//       // ======================================================
//       // EDIT EXISTING ENTRY
//       // ======================================================

//       if (editingEntry) {
//         const allRows = denominationRows;

//         for (const row of allRows) {
//           const quantity = Number(row.quantity || 0);

//           const denomination = Number(row.denomination || 0);

//           const amount = Number((denomination * quantity).toFixed(2));

//           // --------------------------------------------------
//           // EXISTING ROW
//           // --------------------------------------------------

//          if (row.id) {
//   await updateDenomination({
//     id: row.id,
//     branchId: BRANCH_ID,
//     date: entryDate,
//     notes: row.denomination,
//     numbers: quantity,
//     amount: amount,
//     updatedBy: currentUserId,
//     userId: loggedInUserId,
//     drawerId: drawerId,
//   });
// }

//           // --------------------------------------------------
//           // NEW ROW ADDED DURING EDIT
//           // --------------------------------------------------
//          else if (quantity > 0) {
//   await createDenomination({
//     entryNo: entryNo.trim(),
//     entryDate,
//     denomination: denomination,
//     quantity: quantity,
//     amount: amount,
//     branchId: BRANCH_ID,
//     createdBy: currentUserId,
//     userId: loggedInUserId,
//     drawerId: drawerId,
//   });
// }
//         }

//         toast.success("Denomination Entry updated successfully!");
//       }

//       // ======================================================
//       // CREATE NEW ENTRY
//       // ======================================================
//       else {
//         for (const row of rowsToSave) {
//           const denomination = Number(row.denomination || 0);

//           const quantity = Number(row.quantity || 0);

//           const amount = Number((denomination * quantity).toFixed(2));

//          await createDenomination({
//   entryNo: entryNo.trim(),
//   entryDate,
//   denomination: denomination,
//   quantity: quantity,
//   amount: amount,
//   branchId: BRANCH_ID,
//   createdBy: currentUserId,
//   userId: loggedInUserId,
//   drawerId: drawerId,
// });
//         }

//         toast.success("Denomination Entry saved successfully!");
//       }

//       // ======================================================
//       // REFRESH MAIN TABLE
//       // ======================================================

//     await fetchDenominationEntries();

// setSaveCompleted(true);

// setEditingEntry(null);


//     } catch (error) {
//       console.error("Denomination Save Error:", error);

//       toast.error(error?.message || "Unable to save Denomination Entry");
//     } finally {
//       setSaving(false);
//     }
//   };

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

     
// for (const id of denominationIds) {
//   const deleteUrl =
//     `${DELETE_TABLE_API}?Table=DailyDenomination&Id=${encodeURIComponent(id)}`;

//   console.log("Deleting ID:", id);
//   console.log("Delete URL:", deleteUrl);

//   // const response = await fetch(deleteUrl, {
//   //   method: "GET",
//   //   redirect: "follow",
//   // });




//   const response = await fetch(deleteUrl, {
//   method: "GET",
//   credentials: "include",
//   redirect: "follow",
// });

//   const result = await response.text();

//   console.log("DELETE RESPONSE:", id, result);

//   if (
//     result.includes("Connection could not be established") ||
//     result.includes("Login failed") ||
//     result.includes("SQLSTATE") ||
//     result.includes('"error"')
//   ) {
//     throw new Error(`Delete failed for denomination ID ${id}`);
//   }

//   if (!response.ok) {
//     throw new Error(`Delete failed for denomination ID ${id}`);
//   }
// }


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

//  const totalPages =
//   entries.length === 0 ? 0 : Math.ceil(entries.length / 10);

// const paginatedEntries = entries.slice(
//   (pageNo - 1) * 10,
//   pageNo * 10,
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

        
// <MaterialReactTable
//   columns={columns}
//   data={paginatedEntries}
//   enablePagination={false}
//   muiTableHeadCellProps={{
//     sx: {
//       backgroundColor: "#E9ECEF",
//       color: "black",
//       fontSize: "16px",
//       fontWeight: "bold",
//     },
//   }}
//   muiTableBodyCellProps={{
//     sx: {
//       fontSize: "15px",
//     },
//   }}
//   muiTablePaperProps={{
//     elevation: 2,
//     sx: {
//       borderRadius: "0 4px 4px 4px",
//       overflow: "hidden",
//       boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//     },
//   }}
//   muiTableContainerProps={{
//     sx: {
//       maxHeight: "none",
//     },
//   }}
//   renderBottomToolbarCustomActions={() => (
//     <Box
//       mt={2}
//       mb={1}
//       alignItems="center"
//       display="flex"
//       justifyContent="flex-end"
//       width="100%"
//       pr={2}
//       gap={0.5}
//     >
//       <FirstPageIcon
//         sx={{
//           cursor: totalPages > 0 ? "pointer" : "default",
//           color: totalPages > 0 ? "inherit" : "#ccc",
//         }}
//         onClick={() => {
//           if (totalPages > 0) {
//             setPageNo(1);
//           }
//         }}
//       />

//       <KeyboardArrowLeftIcon
//         sx={{
//           cursor: pageNo > 1 ? "pointer" : "default",
//           color: pageNo > 1 ? "inherit" : "#ccc",
//         }}
//         onClick={() => {
//           setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//         }}
//       />

//       <Box ml={1}>Page No</Box>

//       <TextField
//         sx={{
//           width: "65px",
//           ml: 1,
//           "& .MuiInputBase-input": {
//             textAlign: "center",
//             padding: "8px 5px",
//           },
//         }}
//         value={pageNo}
//         onChange={(e) => {
//           const inputValue = e.target.value;

//           if (inputValue === "") {
//             setPageNo("");
//             return;
//           }

//           const value = Number(inputValue);

//           if (Number.isNaN(value)) return;

//           setPageNo(
//             Math.min(Math.max(value, 1), Math.max(totalPages, 1))
//           );
//         }}
//         onBlur={() => {
//           setPageNo((prev) => {
//             const value = Number(prev);

//             if (!value || Number.isNaN(value)) return 1;

//             return Math.min(
//               Math.max(value, 1),
//               Math.max(totalPages, 1)
//             );
//           });
//         }}
//         size="small"
//       />

//       <KeyboardArrowRightIcon
//         sx={{
//           cursor: pageNo < totalPages ? "pointer" : "default",
//           color: pageNo < totalPages ? "inherit" : "#ccc",
//         }}
//         onClick={() => {
//           if (pageNo < totalPages) {
//             setPageNo((prev) => Number(prev) + 1);
//           }
//         }}
//       />

//       <LastPageIcon
//         sx={{
//           cursor: totalPages > 0 ? "pointer" : "default",
//           color: totalPages > 0 ? "inherit" : "#ccc",
//         }}
//         onClick={() => {
//           if (totalPages > 0) {
//             setPageNo(totalPages);
//           }
//         }}
//       />

//       <Box ml={1}>
//         Total Pages: {totalPages}
//       </Box>
//     </Box>
//   )}
// />
// ```
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

//                <TextField
//   size="small"
//   value={entryNo}
//   onChange={(e) => setEntryNo(e.target.value)}
//   placeholder="Enter Entry No"
//   fullWidth
//   InputProps={{
//     readOnly: Boolean(editingEntry),
//   }}
// />
//               </Box>

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Entry Date:
//                 </Typography>

//                 <DatePicker
//                   value={entryDate}
//                   onChange={(newValue) => {
//                     setEntryDate(newValue);

//                     if (newValue) {
//                       fetchSalesSummary(newValue);
//                     }
//                   }}
//                   format="dd-MM-yyyy"
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       fullWidth: true,
//                     },
//                   }}
//                 />
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
