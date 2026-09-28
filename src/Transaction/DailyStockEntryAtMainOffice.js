// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
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
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // ============================================================
// // API BASE URL
// // ============================================================

// // ============================================================
// // COMPONENT
// // ============================================================

// const DailyStockEntryAtMainOffice = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const MAIN_OFFICE_ID = 2;

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [shopOptions, setShopOptions] = useState([]);

//  const [selectedShop, setSelectedShop] = useState({
//   Id: MAIN_OFFICE_ID,
//   AccountName: "Main Office",
// });

//   const [loadingShops, setLoadingShops] = useState(false);

//   const [editingEntry, setEditingEntry] = useState(null);

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   // ==========================================================
//   // QUANTITY / RATE
//   // ==========================================================

//   const [quantity, setQuantity] = useState("");

//   const [rate, setRate] = useState("");

//   // ==========================================================
//   // PRODUCT DETAIL ROWS
//   // ==========================================================

//   const [rows, setRows] = useState([]);

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//  const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT
//   // ==========================================================
// const fetchProduct = async () => {
//   try {
//     setLoadingProducts(true);

//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
//       requestOptions
//     );

//     if (!response.ok) {
//       throw new Error(`Product API failed: ${response.status}`);
//     }

//     const data = await response.json();

//     const productData = Array.isArray(data) ? data : [];

//     const options = productData
//       .filter(
//         (item) =>
//           item?.ProductName !== null &&
//           item?.ProductName !== undefined &&
//           String(item?.ProductName).trim() !== ""
//       )
//       .map((item) => ({
//         value: item?.Id ?? "",

//         label: String(item?.ProductName ?? "").trim(),

//         productCode: item?.ProductCode ?? "",

//         rate: Number(item?.PurchasePrice ?? 0),
//       }));

//     setProductOptions(options);

//     console.log("PRODUCT API RESPONSE:", data);
//   } catch (error) {
//     console.error("Product API Error:", error);
//     toast.error("Product data could not be loaded");
//   } finally {
//     setLoadingProducts(false);
//   }
// };

// // ============================================================
// // FETCH DAILY STOCK HEADER BY ID
// // ============================================================
// const fetchDailyStockHeader = async (headerId) => {
//   try {
//     // Header ID is required
//     if (!headerId) {
//       console.error("Daily Stock Header ID is required");
//       return [];
//     }

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
//       {
//         method: "GET",
//         redirect: "follow",
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Header API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     console.log("DAILY STOCK HEADER RESPONSE:", result);

//     // ============================================================
//     // HANDLE API RESPONSE
//     // ============================================================

//     let data = [];

//     if (Array.isArray(result)) {
//       data = result;
//     } else if (Array.isArray(result?.data)) {
//       data = result.data;
//     } else if (result?.success && result?.data) {
//       data = [result.data];
//     } else if (result && typeof result === "object") {
//       data = [result];
//     }

//     console.log("DAILY STOCK HEADER DATA:", data);

//     // ============================================================
//     // MAP API RESPONSE FOR MAIN TABLE
//     // ============================================================

//     const mappedData = data.map((item) => ({
//       ...item,

//       // Header ID
//       id: item?.Id || item?.id || "",

//       // Date
//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       // Shop Name
//       shop:
//         item?.ShopName ||
//         item?.shop ||
//         "",

//       // Total Amount
//       total: Number(
//         item?.TotalAmount ??
//         item?.total ??
//         0
//       ),
//     }));

//     console.log(
//       "MAPPED DAILY STOCK HEADER DATA:",
//       mappedData
//     );

//     setStockEntries(mappedData);

//     return mappedData;
//   } catch (error) {
//     console.error(
//       "Daily Stock Header API Error:",
//       error
//     );

//     toast.error(
//       "Daily Stock Header data could not be loaded"
//     );

//     return [];
//   }
// };

// const fetchDailyStockDetail = async (headerId) => {
//   try {
//     if (!headerId) {
//       return [];
//     }

//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`,
//       requestOptions
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Detail API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     console.log(
//       "DAILY STOCK DETAIL RESPONSE:",
//       result
//     );

//     const data = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : [];

//     return data;
//   } catch (error) {
//     console.error(
//       "Daily Stock Detail API Error:",
//       error
//     );

//     toast.error(
//       "Daily Stock Detail data could not be loaded"
//     );

//     return [];
//   }
// };

// const updateDailyStockHeader = async (
//   headerId,
//   entryDate,
//   totalAmount
// ) => {
//   try {
//     // ============================================================
//     // 1. HEADER ID
//     // ============================================================

//     const id = Number(headerId);

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // ============================================================
//     // 2. ENTRY DATE
//     // API FORMAT = YYYY-MM-DD
//     // ============================================================

//     let formattedEntryDate = "";

//     if (entryDate) {
//       if (typeof entryDate === "string") {

//         // YYYY-MM-DD
//         if (
//           /^\d{4}-\d{2}-\d{2}$/.test(entryDate)
//         ) {
//           formattedEntryDate = entryDate;
//         }

//         // DD-MM-YYYY
//         else if (
//           /^\d{2}-\d{2}-\d{4}$/.test(entryDate)
//         ) {
//           const [day, month, year] =
//             entryDate.split("-");

//           formattedEntryDate =
//             `${year}-${month}-${day}`;
//         }

//         // Other valid date
//         else {
//           const dateObj = new Date(entryDate);

//           if (!isNaN(dateObj.getTime())) {
//             formattedEntryDate =
//               dateObj.toISOString().split("T")[0];
//           }
//         }
//       }

//       // JavaScript Date
//       else if (entryDate instanceof Date) {
//         if (!isNaN(entryDate.getTime())) {
//           formattedEntryDate =
//             entryDate.toISOString().split("T")[0];
//         }
//       }
//     }

//     // ============================================================
//     // INVALID DATE
//     // ============================================================

//     if (
//       !formattedEntryDate ||
//       formattedEntryDate.includes("NaN")
//     ) {
//       throw new Error(
//         `Invalid EntryDate: ${entryDate}`
//       );
//     }

//     // ============================================================
//     // 3. TOTAL AMOUNT
//     // ============================================================

//     const amount = Number(totalAmount || 0);

//     if (isNaN(amount)) {
//       throw new Error(
//         `Invalid TotalAmount: ${totalAmount}`
//       );
//     }

//     // ============================================================
//     // 4. MAIN OFFICE ID
//     // MAIN OFFICE = ID 2
//     // ============================================================

//     const shopId = Number(MAIN_OFFICE_ID);

//     if (
//       !Number.isInteger(shopId) ||
//       shopId <= 0
//     ) {
//       throw new Error(
//         `Invalid ShopId: ${MAIN_OFFICE_ID}`
//       );
//     }

//     // ============================================================
//     // 5. UPDATED BY
//     // ============================================================

//     const updatedBy = 1;

//     if (
//       !Number.isInteger(updatedBy) ||
//       updatedBy <= 0
//     ) {
//       throw new Error(
//         `Invalid UpdatedBy: ${updatedBy}`
//       );
//     }

//     // ============================================================
//     // 6. FORM DATA
//     // ============================================================

//     const updateData =
//       new URLSearchParams();

//     updateData.append(
//       "Id",
//       String(id)
//     );

//     updateData.append(
//       "EntryDate",
//       formattedEntryDate
//     );

//     updateData.append(
//       "ShopId",
//       String(shopId)
//     );

//     // IMPORTANT:
//     // OfficeId blank पाठवायचा नाही

//     updateData.append(
//       "TotalAmount",
//       String(amount)
//     );

//     updateData.append(
//       "UpdatedBy",
//       String(updatedBy)
//     );

//     // ============================================================
//     // DEBUG
//     // ============================================================

//     console.log(
//       "========== DAILY STOCK HEADER UPDATE =========="
//     );

//     console.log(
//       "HEADER ID:",
//       id
//     );

//     console.log(
//       "ENTRY DATE:",
//       formattedEntryDate
//     );

//     console.log(
//       "SHOP ID:",
//       shopId
//     );

//     console.log(
//       "TOTAL AMOUNT:",
//       amount
//     );

//     console.log(
//       "UPDATED BY:",
//       updatedBy
//     );

//     console.log(
//       "DAILY STOCK HEADER UPDATE PAYLOAD:",
//       Object.fromEntries(
//         updateData.entries()
//       )
//     );

//     // ============================================================
//     // API CALL
//     // ============================================================

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php",
//       {
//         method: "POST",
//         body: updateData,
//         redirect: "follow",
//       }
//     );

//     const responseText =
//       await response.text();

//     console.log(
//       "DAILY STOCK HEADER UPDATE STATUS:",
//       response.status
//     );

//     console.log(
//       "DAILY STOCK HEADER UPDATE RESPONSE:",
//       responseText
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Header Update API failed: ${response.status} - ${responseText}`
//       );
//     }

//     let result = {};

//     try {
//       result = JSON.parse(responseText);
//     } catch {
//       result = {};
//     }

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//         "Daily Stock Header update failed"
//       );
//     }

//     console.log(
//       "DAILY STOCK HEADER UPDATED SUCCESSFULLY:",
//       result
//     );

//     return result;

//   } catch (error) {
//     console.error(
//       "Daily Stock Header Update API Error:",
//       error
//     );

//     throw error;
//   }
// };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

//  useEffect(() => {
//   fetchProduct();
// }, []);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
// const resetForm = () => {
//   setSelectedShop({
//     Id: MAIN_OFFICE_ID,
//     AccountName: "Main Office",
//   });
//   setDate(new Date());
//   setSelectedProduct(null);
//   setQuantity("");
//   setRate("");
//   setRows([]);
//   setEditingEntry(null);
// };

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = () => {
//     resetForm();

//     setOpenForm(true);
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
//   // PRODUCT CHANGE
//   // ==========================================================

//   const handleProductChange = (event, newValue) => {
//     setSelectedProduct(newValue);

//     if (newValue) {
//       setRate(newValue.rate);
//     } else {
//       setRate("");
//     }
//   };

//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setQuantity(value);
//     }
//   };

//   // ==========================================================
//   // RATE CHANGE
//   // ==========================================================

//   // ==========================================================
//   // ADD PRODUCT
//   // ==========================================================

//   const handleAddProduct = () => {
//     if (!selectedProduct) {
//       toast.error("Please select Product");

//       return;
//     }

//     if (quantity === "" || Number(quantity) <= 0) {
//       toast.error("Please enter Quantity");

//       return;
//     }

//     if (rate === "" || Number(rate) < 0) {
//       toast.error("Please enter Rate");

//       return;
//     }

//     const qty = Number(quantity);

//     const productRate = Number(rate);

//     const amount = qty * productRate;

//     const newRow = {
//       Id: "",

//       ProductId: selectedProduct.value,

//       ProductCode: selectedProduct.productCode,

//       ProductName: selectedProduct.label,

//       Quantity: qty,

//       Rate: productRate,

//       Amount: amount,
//     };

//     setRows((previousRows) => [...previousRows, newRow]);

//     setSelectedProduct(null);

//     setQuantity("");

//     setRate("");
//   };

//   // ==========================================================
//   // DELETE DETAIL ROW
//   // ==========================================================

//   const handleDeleteRow = (index) => {
//     setRows((previousRows) =>
//       previousRows.filter((_, rowIndex) => rowIndex !== index),
//     );
//   };

//   // ==========================================================
//   // TOTAL
//   // ==========================================================

//   const total = useMemo(() => {
//     return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
//   }, [rows]);

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   // PHP date object response:
//   // { date: "2026-09-22 00:00:00.000000", ... }
//   if (typeof value === "object" && value?.date) {
//     value = value.date;
//   }

//   const dateString = String(value).trim();

//   // Handle: YYYY-MM-DD
//   // Handle: YYYY-MM-DD HH:mm:ss
//   // Handle: YYYY-MM-DDTHH:mm:ss
//   const match = dateString.match(
//     /^(\d{4})-(\d{2})-(\d{2})/
//   );

//   if (match) {
//     const [, year, month, day] = match;

//     return `${day}-${month}-${year}`;
//   }

//   // Fallback for normal JS date values
//   const d = new Date(dateString);

//   if (Number.isNaN(d.getTime())) {
//     return "";
//   }

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// // ==========================================================
// // MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
// // ==========================================================

// const mappedStockEntries = useMemo(() => {
//   return stockEntries.map((item) => ({
//     ...item,

//     // Header ID
//     id: item?.Id || item?.id || "",

//     // Date
//     dateText: item?.EntryDate
//       ? formatDate(item.EntryDate)
//       : item?.dateText || "",

//     // Main Office is fixed
//     shop: "Main Office",

//     // Total Amount
//     total: Number(
//       item?.TotalAmount ??
//         item?.total ??
//         0
//     ),
//   }));
// }, [stockEntries]);

//   // ==========================================================
//   // SAVE DAILY STOCK ENTRY
//   // ==========================================================

//  const handleSave = async () => {

//   if (
//   !date ||
//   !(date instanceof Date) ||
//   Number.isNaN(date.getTime())
// ) {
//   toast.error(
//     "Please select a valid Date"
//   );
//   return;
// }

//   if (rows.length === 0) {
//     toast.error("Please add at least one Product");
//     return;
//   }

//   try {
//     setSaving(true);

//    const entryDate =
//   `${date.getFullYear()}-${String(
//     date.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     date.getDate()
//   ).padStart(2, "0")}`;

// console.log(
//   "FINAL ENTRY DATE:",
//   entryDate
// );

//     // ============================================
//     // EDIT EXISTING ENTRY
//     // ============================================
//     if (editingEntry) {
//       const headerId =
//         editingEntry?.Id ||
//         editingEntry?.id;

//       if (!headerId) {
//         throw new Error(
//           "Daily Stock Header ID not found"
//         );
//       }

//       // --------------------------------------------
//       // UPDATE HEADER
//       // --------------------------------------------
// await updateDailyStockHeader(
//   headerId,
//   entryDate,
//   total
// );

//       console.log(
//         "DAILY STOCK HEADER UPDATED:",
//         headerId
//       );

//     // --------------------------------------------
// // UPDATE / INSERT DETAILS
// // --------------------------------------------
// // ============================================================
// // UPDATE / INSERT DAILY STOCK DETAILS
// // ============================================================
// for (const row of rows) {

//   const detailId =
//     row?.Id ||
//     row?.id ||
//     "";

//   // ==========================================================
//   // EXISTING DETAIL -> UPDATE
//   // ==========================================================
//   if (detailId) {

//     const detailData = new URLSearchParams();

//     detailData.append(
//       "Id",
//       String(detailId)
//     );

//     detailData.append(
//       "DailyStockHeaderId",
//       String(headerId)
//     );

//     detailData.append(
//       "ProductId",
//       String(row?.ProductId || "")
//     );

//     detailData.append(
//       "Quantity",
//       String(Number(row?.Quantity || 0))
//     );

//     detailData.append(
//       "Rate",
//       String(Number(row?.Rate || 0))
//     );

//     detailData.append(
//       "Amount",
//       String(Number(row?.Amount || 0))
//     );

//     detailData.append(
//       "UpdatedBy",
//       "1"
//     );

//     console.log(
//       "UPDATING DAILY STOCK DETAIL:",
//       Object.fromEntries(detailData.entries())
//     );

//     const detailResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//       {
//         method: "POST",
//         body: detailData,
//         redirect: "follow",
//       }
//     );

//     const detailText =
//       await detailResponse.text();

//     console.log(
//       "DAILY STOCK DETAIL UPDATE STATUS:",
//       detailResponse.status
//     );

//     console.log(
//       "DAILY STOCK DETAIL UPDATE RESPONSE:",
//       detailText
//     );

//     if (!detailResponse.ok) {
//       throw new Error(
//         `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`
//       );
//     }

//     let detailResult;

//     try {
//       detailResult =
//         JSON.parse(detailText);
//     } catch {
//       detailResult = {};
//     }

//     if (detailResult?.success === false) {
//       throw new Error(
//         detailResult?.message ||
//         "Daily Stock Detail update failed"
//       );
//     }

//     console.log(
//       "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
//       detailResult
//     );
//   }

//   // ==========================================================
//   // NEW DETAIL -> INSERT
//   // ==========================================================
//   else {

//     const detailData =
//       new URLSearchParams();

//     detailData.append(
//       "DailyStockHeaderId",
//       String(headerId)
//     );

//     detailData.append(
//       "ProductId",
//       String(row?.ProductId || "")
//     );

//     detailData.append(
//       "Quantity",
//       String(Number(row?.Quantity || 0))
//     );

//     detailData.append(
//       "Rate",
//       String(Number(row?.Rate || 0))
//     );

//     detailData.append(
//       "Amount",
//       String(Number(row?.Amount || 0))
//     );

//     detailData.append(
//       "CreatedBy",
//       "1"
//     );

//     console.log(
//       "ADDING NEW DAILY STOCK DETAIL:",
//       Object.fromEntries(detailData.entries())
//     );

//     const detailResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//       {
//         method: "POST",
//         body: detailData,
//         redirect: "follow",
//       }
//     );

//     const detailText =
//       await detailResponse.text();

//     console.log(
//       "DAILY STOCK DETAIL INSERT STATUS:",
//       detailResponse.status
//     );

//     console.log(
//       "DAILY STOCK DETAIL INSERT RESPONSE:",
//       detailText
//     );

//     if (!detailResponse.ok) {
//       throw new Error(
//         `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`
//       );
//     }

//     let detailResult;

//     try {
//       detailResult =
//         JSON.parse(detailText);
//     } catch {
//       detailResult = {};
//     }

//     if (detailResult?.success === false) {
//       throw new Error(
//         detailResult?.message ||
//         "Daily Stock Detail insert failed"
//       );
//     }

//     console.log(
//       "NEW DAILY STOCK DETAIL INSERTED:",
//       detailResult
//     );
//   }
// }

//       toast.success(
//         "Daily Stock Entry updated successfully!"
//       );

//       setOpenForm(false);
//       resetForm();

//       // Refresh Header list
//       await fetchDailyStockHeader(headerId);

//       return;
//     }

//     // ============================================
//     // NEW ENTRY
//     // ============================================

//     const headerData = new URLSearchParams();

//     headerData.append(
//       "EntryDate",
//       entryDate
//     );

//    headerData.append(
//   "ShopId",
//   String(MAIN_OFFICE_ID)
// );

//     headerData.append(
//       "OfficeId",
//       ""
//     );

//     headerData.append(
//       "TotalAmount",
//       String(Number(total || 0))
//     );

//     headerData.append(
//       "CreatedBy",
//       "1"
//     );

//     const headerRequestOptions = {
//       method: "POST",
//       body: headerData,
//       redirect: "follow",
//     };

//     const headerResponse = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
//       headerRequestOptions
//     );

//     if (!headerResponse.ok) {
//       throw new Error(
//         `Daily Stock Header API failed: ${headerResponse.status}`
//       );
//     }

//     const headerResult =
//       await headerResponse.json();

//     console.log(
//       "DAILY STOCK HEADER POST RESPONSE:",
//       headerResult
//     );

//     const headerId =
//       headerResult?.Id ||
//       headerResult?.id ||
//       headerResult?.insert_id ||
//       headerResult?.DailyStockHeaderId ||
//       headerResult?.data?.Id ||
//       headerResult?.data?.id;

//     if (!headerId) {
//       throw new Error(
//         "Daily Stock Header ID was not returned from API"
//       );
//     }

//     console.log(
//       "CREATED DAILY STOCK HEADER ID:",
//       headerId
//     );

//     // --------------------------------------------
//     // POST DETAILS
//     // --------------------------------------------
//     for (const row of rows) {
//       const detailData = new URLSearchParams();

//       detailData.append(
//         "DailyStockHeaderId",
//         String(headerId)
//       );

//       detailData.append(
//         "ProductId",
//         String(row.ProductId || "")
//       );

//       detailData.append(
//         "Quantity",
//         String(Number(row.Quantity || 0))
//       );

//       detailData.append(
//         "Rate",
//         String(Number(row.Rate || 0))
//       );

//       detailData.append(
//         "Amount",
//         String(Number(row.Amount || 0))
//       );

//       detailData.append(
//         "CreatedBy",
//         "1"
//       );

//       const detailRequestOptions = {
//         method: "POST",
//         body: detailData,
//         redirect: "follow",
//       };

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
//         detailRequestOptions
//       );

//       if (!detailResponse.ok) {
//         throw new Error(
//           `Daily Stock Detail API failed: ${detailResponse.status}`
//         );
//       }

//       const detailResult =
//         await detailResponse.json();

//       console.log(
//         "DAILY STOCK DETAIL POST RESPONSE:",
//         detailResult
//       );
//     }

//     toast.success(
//       "Daily Stock Entry at Main Office saved successfully!"
//     );

//     setOpenForm(false);
//     resetForm();

//     // Refresh Header list
//     await fetchDailyStockHeader(headerId);

//   } catch (error) {
//     console.error(
//       "Main Office Daily Stock Save Error:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to save Daily Stock Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };

//  // ==========================================================
// // SAFE DATE PARSER
// // ==========================================================
// const parseApiDate = (value) => {
//   if (!value) {
//     return null;
//   }

//   // PHP date object
//   // Example:
//   // { date: "2026-09-22 00:00:00.000000", ... }
//   if (
//     typeof value === "object" &&
//     value?.date
//   ) {
//     value = value.date;
//   }

//   const dateString = String(value).trim();

//   if (!dateString) {
//     return null;
//   }

//   // YYYY-MM-DD
//   // YYYY-MM-DD HH:mm:ss
//   // YYYY-MM-DDTHH:mm:ss
//   const match = dateString.match(
//     /^(\d{4})-(\d{2})-(\d{2})/
//   );

//   if (match) {
//     const year = Number(match[1]);
//     const month = Number(match[2]);
//     const day = Number(match[3]);

//     const result = new Date(
//       year,
//       month - 1,
//       day
//     );

//     if (!Number.isNaN(result.getTime())) {
//       return result;
//     }
//   }

//   // DD-MM-YYYY
//   const ddmmyyyy = dateString.match(
//     /^(\d{2})-(\d{2})-(\d{4})$/
//   );

//   if (ddmmyyyy) {
//     const day = Number(ddmmyyyy[1]);
//     const month = Number(ddmmyyyy[2]);
//     const year = Number(ddmmyyyy[3]);

//     const result = new Date(
//       year,
//       month - 1,
//       day
//     );

//     if (!Number.isNaN(result.getTime())) {
//       return result;
//     }
//   }

//   return null;
// };

// // ==========================================================
// // EDIT DAILY STOCK ENTRY
// // ==========================================================
// const handleEditEntry = async (entry) => {
//   try {
//     console.log(
//       "EDIT DAILY STOCK HEADER:",
//       entry
//     );

//     // ========================================================
//     // HEADER ID
//     // ========================================================

//     const headerId =
//       entry?.Id ||
//       entry?.id;

//     if (!headerId) {
//       toast.error(
//         "Daily Stock Header ID not found"
//       );
//       return;
//     }

//     // ========================================================
//     // SET EDITING ENTRY
//     // ========================================================

//     setEditingEntry(entry);
//     setOpenForm(true);

//     // ========================================================
//     // DATE
//     // ========================================================

//     const apiDate =
//       entry?.EntryDate ||
//       entry?.date;

//     const parsedDate =
//       parseApiDate(apiDate);

//     console.log(
//       "EDIT API DATE:",
//       apiDate
//     );

//     console.log(
//       "EDIT PARSED DATE:",
//       parsedDate
//     );

//     if (parsedDate) {
//       setDate(parsedDate);
//     } else {
//       // Important:
//       // Never allow invalid date to reach update API
//       toast.error(
//         "Invalid Entry Date received from API"
//       );

//       setDate(new Date());
//     }

//     // ========================================================
//     // MAIN OFFICE ALWAYS ID = 2
//     // ========================================================

//     setSelectedShop({
//       Id: MAIN_OFFICE_ID,
//       AccountName: "Main Office",
//     });

//     // ========================================================
//     // FETCH DETAILS
//     // ========================================================

//     const detailData =
//       await fetchDailyStockDetail(
//         headerId
//       );

//     console.log(
//       "EDIT DAILY STOCK DETAIL:",
//       detailData
//     );

//     // ========================================================
//     // MAP DETAIL DATA
//     // ========================================================

//     const detailRows =
//       detailData.map((item) => ({
//         Id:
//           item?.Id ||
//           item?.id ||
//           "",

//         ProductId:
//           item?.ProductId ||
//           item?.productId ||
//           0,

//         ProductCode:
//           item?.ProductCode ||
//           item?.Code ||
//           item?.ProductCodeNo ||
//           "",

//         ProductName:
//           item?.ProductName ||
//           item?.Name ||
//           "",

//         Quantity: Number(
//           item?.Quantity ??
//           item?.quantity ??
//           0
//         ),

//         Rate: Number(
//           item?.Rate ??
//           item?.rate ??
//           0
//         ),

//         Amount: Number(
//           item?.Amount ??
//           item?.amount ??
//           0
//         ),
//       }));

//     console.log(
//       "EDIT MAPPED DETAIL ROWS:",
//       detailRows
//     );

//     setRows(detailRows);

//   } catch (error) {
//     console.error(
//       "Edit Daily Stock Entry Error:",
//       error
//     );

//     toast.error(
//       "Unable to load Daily Stock Entry"
//     );
//   }
// };

//   const handleDeleteEntry = (id) => {
//     setStockEntries((previousEntries) =>
//       previousEntries.filter((item) => item.id !== id),
//     );

//     toast.success("Entry removed successfully");
//   };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

// const totalPages =
//   mappedStockEntries.length === 0
//     ? 0
//     : Math.ceil(mappedStockEntries.length / pageSize);

// const paginatedStockEntries = useMemo(() => {
//   const startIndex = (pageNo - 1) * pageSize;
//   const endIndex = startIndex + pageSize;

//   return mappedStockEntries.slice(startIndex, endIndex);
// }, [mappedStockEntries, pageNo]);

//   // ==========================================================
//   // TABLE COLUMNS
//   // ==========================================================

//   const columns = useMemo(
//     () => [
//       // ====================================================
//       // SR NO
//       // ====================================================

//       {
//         accessorKey: "srNo",

//         header: "Sr.No",

//         size: 80,

//         Cell: ({ row }) => {
//           const index = mappedStockEntries.findIndex(
//   (item) => item.id === row.original.id
// );

//           return index + 1;
//         },
//       },

//       // ====================================================
//       // DATE
//       // ====================================================

//       {
//         accessorKey: "dateText",

//         header: "Date",

//         size: 150,

//         Cell: ({ cell }) => cell.getValue(),
//       },

//       // ====================================================
//       // MAIN OFFICE
//       // ====================================================

//       {
//         accessorKey: "shop",

//         header: "Main Office",

//         size: 250,
//       },

//       // ====================================================
//       // TOTAL
//       // ====================================================

//       {
//         accessorKey: "total",

//         header: "Total",

//         size: 150,

//         Cell: ({ cell }) => (
//           <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
//         ),
//       },

//       // ====================================================
//       // ACTIONS
//       // ====================================================

//       {
//         header: "Actions",

//         size: 150,

//         enableSorting: false,

//         enableColumnFilter: false,

//        Cell: ({ row }) => (
//   <Box display="flex" justifyContent="center">
//     <Tooltip title="Edit">
//       <IconButton
//         size="small"
//         onClick={() => handleEditEntry(row.original)}
//       >
//         <EditIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>

//     <Tooltip title="Delete">
//       <IconButton
//         color="error"
//         size="small"
//         onClick={() => handleDeleteEntry(row.original.id)}
//       >
//         <DeleteIcon fontSize="small" />
//       </IconButton>
//     </Tooltip>
//   </Box>
// ),
//       },
//     ],
//     [mappedStockEntries, handleEditEntry, handleDeleteEntry]
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
//         {/* ====================================================
//             PAGE TITLE
//         ==================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Daily Stock Entry at Main Office</b>
//           </Typography>
//         </Box>

//         {/* ====================================================
//             TABLE SECTION
//         ==================================================== */}

//         <Box
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* ==================================================
//               CREATE BUTTON
//           ================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             <Button
//               sx={{
//                 background: "var(--complementary-color)",

//                 "&:hover": {
//                   background: "var(--complementary-color)",
//                 },

//                 borderRadius: "5px 5px 0 0",

//                 textTransform: "uppercase",

//                 fontSize: "16px",

//                 fontWeight: 500,

//                 px: 2.5,

//                 py: 1.5,
//               }}
//               variant="contained"
//               onClick={handleOpenForm}
//             >
//               CREATE DAILY STOCK ENTRY AT MAIN OFFICE
//             </Button>
//           </Box>

//           {/* ==================================================
//               MATERIAL REACT TABLE
//           ================================================== */}

//           <MaterialReactTable
//   columns={columns}
//   data={paginatedStockEntries}
//   enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",

//                 color: "black",

//                 fontSize: "16px",

//                 fontWeight: "bold",
//               },
//             }}
//             muiTableBodyCellProps={{
//               sx: {
//                 fontSize: "15px",
//               },
//             }}
//             muiTablePaperProps={{
//               elevation: 2,

//               sx: {
//                 borderRadius: "0 4px 4px 4px",

//                 overflow: "hidden",

//                 boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//               },
//             }}
//             muiTableContainerProps={{
//               sx: {
//                 maxHeight: "none",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 mb={1}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//                 pr={2}
//                 gap={0.5}
//               >
//                 {/* FIRST PAGE */}

//                 <FirstPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(1);
//                     }
//                   }}
//                 />

//                 {/* PREVIOUS */}

//                 <KeyboardArrowLeftIcon
//                   sx={{
//                     cursor: pageNo > 1 ? "pointer" : "default",

//                     color: pageNo > 1 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                   }}
//                 />

//                 {/* PAGE NO */}

//                 <Box ml={1}>Page No</Box>

//                 <TextField
//                   sx={{
//                     width: "65px",

//                     ml: 1,

//                     "& .MuiInputBase-input": {
//                       textAlign: "center",

//                       padding: "8px 5px",
//                     },

//                     "@media (max-width: 768px)": {
//                       width: "60px",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => {
//                     let value = Number(e.target.value);

//                     if (value < 1 || isNaN(value)) {
//                       value = 1;
//                     }

//                     if (totalPages > 0 && value > totalPages) {
//                       value = totalPages;
//                     }

//                     setPageNo(value);
//                   }}
//                   size="small"
//                 />

//                 {/* NEXT */}

//                 <KeyboardArrowRightIcon
//                   sx={{
//                     cursor: pageNo < totalPages ? "pointer" : "default",

//                     color: pageNo < totalPages ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (pageNo < totalPages) {
//                       setPageNo((prev) => Number(prev) + 1);
//                     }
//                   }}
//                 />

//                 {/* LAST PAGE */}

//                 <LastPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(totalPages);
//                     }
//                   }}
//                 />

//                 {/* TOTAL PAGES */}

//                 <Box ml={1}>Total Pages: {totalPages}</Box>
//               </Box>
//             )}
//           />
//         </Box>

//         {/* ====================================================
//             MAIN OFFICE DAILY STOCK FORM
//         ==================================================== */}

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
//               DIALOG HEADER
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
//               Daily Stock Entry at Main Office
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
//               DIALOG CONTENT
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
//                 MAIN OFFICE + DATE
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

//            {/* MAIN OFFICE */}

// <Box>
//   <Typography fontWeight={600} mb={0.5} fontSize="14px">
//     Main Office:
//   </Typography>

//   <TextField
//     value="Main Office"
//     size="small"
//     fullWidth
//     InputProps={{
//       readOnly: true,
//     }}
//   />
// </Box>

//               {/* DATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Date:
//                 </Typography>

//                 <DatePicker
//                   value={date}
//                   onChange={(newValue) => setDate(newValue)}
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
//                 PRODUCT
//             ================================================= */}

//             <Box
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                 Product:
//               </Typography>

//               <Autocomplete
//                 options={productOptions}
//                 loading={loadingProducts}
//                 value={selectedProduct}
//                 onChange={handleProductChange}
//                 getOptionLabel={(option) =>
//                   option ? `${option.productCode} - ${option.label}` : ""
//                 }
//                 isOptionEqualToValue={(option, value) =>
//                   String(option?.value) === String(value?.value)
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
//                     placeholder="Select Product"
//                     fullWidth
//                   />
//                 )}
//               />
//             </Box>

//             {/* =================================================
//                 QUANTITY + RATE + ADD
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",

//                   sm: "1fr 1fr auto",
//                 },

//                 gap: 1.5,

//                 alignItems: "end",

//                 mb: 2,
//               }}
//             >
//               {/* QUANTITY */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Quantity:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   placeholder="Enter Quantity"
//                   fullWidth
//                 />
//               </Box>

//               {/* RATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Rate:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={rate}
//                   placeholder="Rate"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box>

//               {/* ADD */}

//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   height: "40px",

//                   px: 2.5,

//                   textTransform: "none",

//                   background: "var(--complementary-color)",

//                   "&:hover": {
//                     background: "var(--complementary-color)",
//                   },
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 1.5,
//               }}
//             />

//             {/* =================================================
//                 PRODUCT DETAIL TABLE
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
//                       Product Code
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Name
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Rate
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         align="center"
//                         sx={{
//                           height: "75px",

//                           color: "#777",

//                           fontStyle: "italic",
//                         }}
//                       >
//                         No products added
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.map((row, index) => (
//                       <TableRow hover key={`${row.ProductId}-${index}`}>
//                         <TableCell>{row.ProductCode}</TableCell>

//                         <TableCell>{row.ProductName}</TableCell>

//                         <TableCell align="center">{row.Quantity}</TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Rate).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Amount).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 TOTAL
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
//               <Typography fontWeight={600} fontSize="14px">
//                 Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(total).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 140,
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           {/* ==================================================
//               DIALOG ACTIONS
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
//     </LocalizationProvider>
//   );
// };

// export default DailyStockEntryAtMainOffice;

// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
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
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const DailyStockEntryAtMainOffice = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const MAIN_OFFICE_ID = 2;

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const CREATED_BY = 1;

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [shopOptions, setShopOptions] = useState([]);

//  const [selectedShop, setSelectedShop] = useState({
//   Id: MAIN_OFFICE_ID,
//   AccountName: "Main Office",
// });

//   const [loadingShops, setLoadingShops] = useState(false);

//   const [editingEntry, setEditingEntry] = useState(null);

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   // ==========================================================
//   // QUANTITY / RATE
//   // ==========================================================

//   const [quantity, setQuantity] = useState("");

//   const [rate, setRate] = useState("");

//   // ==========================================================
//   // PRODUCT DETAIL ROWS
//   // ==========================================================

//   const [rows, setRows] = useState([]);

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//  const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT
//   // ==========================================================
// const fetchProduct = async () => {
//   try {
//     setLoadingProducts(true);

//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
//       requestOptions
//     );

//     if (!response.ok) {
//       throw new Error(`Product API failed: ${response.status}`);
//     }

//     const data = await response.json();

//     const productData = Array.isArray(data) ? data : [];

//     const options = productData
//       .filter(
//         (item) =>
//           item?.ProductName !== null &&
//           item?.ProductName !== undefined &&
//           String(item?.ProductName).trim() !== ""
//       )
//       .map((item) => ({
//         value: item?.Id ?? "",

//         label: String(item?.ProductName ?? "").trim(),

//         productCode: item?.ProductCode ?? "",

//         rate: Number(item?.PurchasePrice ?? 0),
//       }));

//     setProductOptions(options);

//     console.log("PRODUCT API RESPONSE:", data);
//   } catch (error) {
//     console.error("Product API Error:", error);
//     toast.error("Product data could not be loaded");
//   } finally {
//     setLoadingProducts(false);
//   }
// };

// // ============================================================
// // FETCH DAILY STOCK HEADER BY ID
// // ============================================================
// const fetchDailyStockHeader = async (headerId) => {
//   try {
//     // Header ID is required
//     if (!headerId) {
//       console.error("Daily Stock Header ID is required");
//       return [];
//     }

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
//       {
//         method: "GET",
//         redirect: "follow",
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Header API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     console.log("DAILY STOCK HEADER RESPONSE:", result);

//     // ============================================================
//     // HANDLE API RESPONSE
//     // ============================================================

//     let data = [];

//     if (Array.isArray(result)) {
//       data = result;
//     } else if (Array.isArray(result?.data)) {
//       data = result.data;
//     } else if (result?.success && result?.data) {
//       data = [result.data];
//     } else if (result && typeof result === "object") {
//       data = [result];
//     }

//     console.log("DAILY STOCK HEADER DATA:", data);

//     // ============================================================
//     // MAP API RESPONSE FOR MAIN TABLE
//     // ============================================================

//     const mappedData = data.map((item) => ({
//       ...item,

//       // Header ID
//       id: item?.Id || item?.id || "",

//       // Date
//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       // Shop Name
//       shop:
//         item?.ShopName ||
//         item?.shop ||
//         "",

//       // Total Amount
//       total: Number(
//         item?.TotalAmount ??
//         item?.total ??
//         0
//       ),
//     }));

//     console.log(
//       "MAPPED DAILY STOCK HEADER DATA:",
//       mappedData
//     );

//     setStockEntries(mappedData);

//     return mappedData;
//   } catch (error) {
//     console.error(
//       "Daily Stock Header API Error:",
//       error
//     );

//     toast.error(
//       "Daily Stock Header data could not be loaded"
//     );

//     return [];
//   }
// };

// // ==========================================================
// // FETCH ALL DAILY STOCK HEADERS - STOCK ENTRY SHOP
// // ==========================================================
// const fetchAllDailyStockHeaders = async () => {
//   try {
//     console.log("========================================");
//     console.log("FETCHING ALL DAILY STOCK HEADERS");
//     console.log("========================================");

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php",
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//         redirect: "follow",
//       }
//     );

//     console.log(
//       "DAILY STOCK HEADER LIST STATUS:",
//       response.status
//     );

//     const rawText = await response.text();

//     console.log(
//       "DAILY STOCK HEADER LIST RAW RESPONSE:",
//       rawText
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Header List API failed: ${response.status}`
//       );
//     }

//     let result;

//     try {
//       result = rawText ? JSON.parse(rawText) : {};
//     } catch (error) {
//       console.error(
//         "DAILY STOCK HEADER LIST JSON ERROR:",
//         error
//       );

//       throw new Error(
//         `Invalid Daily Stock Header API response: ${rawText}`
//       );
//     }

//     console.log(
//       "DAILY STOCK HEADER LIST RESPONSE:",
//       result
//     );

//     // ======================================================
//     // NORMALIZE RESPONSE
//     // ======================================================

//     let data = [];

//     if (Array.isArray(result)) {
//       data = result;
//     } else if (Array.isArray(result?.data)) {
//       data = result.data;
//     } else if (
//       result?.success &&
//       result?.data
//     ) {
//       data = Array.isArray(result.data)
//         ? result.data
//         : [result.data];
//     }

//     console.log(
//       "DAILY STOCK HEADER LIST DATA:",
//       data
//     );

//     // ======================================================
//     // ONLY STOCK ENTRY SHOP
//     // ======================================================

//     const shopId = String(MAIN_OFFICE_ID);

//     const shopEntries = data.filter((item) => {
//       const itemShopId =
//         item?.ShopId ??
//         item?.shopId ??
//         "";

//       return String(itemShopId) === shopId;
//     });

//     console.log(
//       "STOCK ENTRY SHOP HEADERS:",
//       shopEntries
//     );

//     // ======================================================
//     // MAP DATA FOR TABLE
//     // ======================================================

//     const mappedData = shopEntries.map((item) => ({
//       ...item,

//       // --------------------------------------------------
//       // ID
//       // --------------------------------------------------

//       Id:
//         item?.Id ??
//         item?.id ??
//         item?.DailyStockHeaderId ??
//         "",

//       id:
//         item?.Id ??
//         item?.id ??
//         item?.DailyStockHeaderId ??
//         "",

//       // --------------------------------------------------
//       // DATE
//       // --------------------------------------------------

//       EntryDate:
//         item?.EntryDate ??
//         item?.entryDate ??
//         item?.date ??
//         "",

//       dateText:
//         item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.entryDate
//           ? formatDate(item.entryDate)
//           : item?.date
//           ? formatDate(item.date)
//           : "",

//       // --------------------------------------------------
//       // SHOP
//       // --------------------------------------------------

//       ShopId:
//         item?.ShopId ??
//         item?.shopId ??
//         MAIN_OFFICE_ID,

//       OfficeId:
//         item?.OfficeId ??
//         item?.officeId ??
//         null,

//       ShopName:
//         item?.ShopName ??
//         item?.AccountName ??
//         item?.Shop ??
//         item?.shop ??
//         "Stock Entry Shop",

//       shop:
//         item?.ShopName ??
//         item?.AccountName ??
//         item?.Shop ??
//         item?.shop ??
//         "Stock Entry Shop",

//       // --------------------------------------------------
//       // TOTAL
//       // --------------------------------------------------

//       TotalAmount: Number(
//         item?.TotalAmount ??
//         item?.totalAmount ??
//         item?.Total ??
//         item?.total ??
//         0
//       ),

//       total: Number(
//         item?.TotalAmount ??
//         item?.totalAmount ??
//         item?.Total ??
//         item?.total ??
//         0
//       ),
//     }));

//     // ======================================================
//     // NEWEST RECORD FIRST
//     // ======================================================

//     mappedData.sort((a, b) => {
//       const idA = Number(a?.Id || 0);
//       const idB = Number(b?.Id || 0);

//       return idB - idA;
//     });

//     console.log(
//       "FINAL STOCK ENTRY SHOP LIST:",
//       mappedData
//     );

//     // ======================================================
//     // SET TABLE DATA
//     // ======================================================

//     setStockEntries(mappedData);

//     // Go to first page
//     setPageNo(1);

//     return mappedData;

//   } catch (error) {
//     console.error(
//       "❌ FETCH DAILY STOCK HEADER LIST ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//       "Daily Stock Header list could not be loaded"
//     );

//     setStockEntries([]);

//     return [];
//   }
// };

// const fetchDailyStockDetail = async (headerId) => {
//   try {
//     if (!headerId) {
//       return [];
//     }

//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`,
//       requestOptions
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Detail API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     console.log(
//       "DAILY STOCK DETAIL RESPONSE:",
//       result
//     );

//     const data = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : [];

//     return data;
//   } catch (error) {
//     console.error(
//       "Daily Stock Detail API Error:",
//       error
//     );

//     toast.error(
//       "Daily Stock Detail data could not be loaded"
//     );

//     return [];
//   }
// };

// const updateDailyStockHeader = async (
//   headerId,
//   entryDate,
//   totalAmount
// ) => {
//   try {
//     // ============================================================
//     // 1. HEADER ID
//     // ============================================================

//     const id = Number(headerId);

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // ============================================================
//     // 2. ENTRY DATE
//     // ============================================================

//     let formattedEntryDate = "";

//     if (entryDate) {
//       if (typeof entryDate === "string") {

//         // YYYY-MM-DD
//         if (
//           /^\d{4}-\d{2}-\d{2}$/.test(entryDate)
//         ) {
//           formattedEntryDate = entryDate;
//         }

//         // DD-MM-YYYY
//         else if (
//           /^\d{2}-\d{2}-\d{4}$/.test(entryDate)
//         ) {
//           const [day, month, year] =
//             entryDate.split("-");

//           formattedEntryDate =
//             `${year}-${month}-${day}`;
//         }

//         // Other valid date
//         else {
//           const dateObj = new Date(entryDate);

//           if (!isNaN(dateObj.getTime())) {
//             formattedEntryDate =
//               dateObj.toISOString().split("T")[0];
//           }
//         }
//       }

//       else if (entryDate instanceof Date) {
//         if (!isNaN(entryDate.getTime())) {
//           formattedEntryDate =
//             entryDate.toISOString().split("T")[0];
//         }
//       }
//     }

//     if (
//       !formattedEntryDate ||
//       formattedEntryDate.includes("NaN")
//     ) {
//       throw new Error(
//         `Invalid EntryDate: ${entryDate}`
//       );
//     }

//     // ============================================================
//     // 3. TOTAL AMOUNT
//     // ============================================================

//     const amount = Number(totalAmount || 0);

//     if (isNaN(amount)) {
//       throw new Error(
//         `Invalid TotalAmount: ${totalAmount}`
//       );
//     }

//     // ============================================================
//     // 4. MAIN OFFICE ID
//     // ============================================================

//     const shopId = Number(MAIN_OFFICE_ID);

//     if (
//       !Number.isInteger(shopId) ||
//       shopId <= 0
//     ) {
//       throw new Error(
//         `Invalid Main Office ID: ${MAIN_OFFICE_ID}`
//       );
//     }

//     // ============================================================
//     // 5. UPDATED BY
//     // ============================================================

//     const updatedBy = Number(CREATED_BY);

//     if (
//       !Number.isInteger(updatedBy) ||
//       updatedBy <= 0
//     ) {
//       throw new Error(
//         `Invalid UpdatedBy: ${CREATED_BY}`
//       );
//     }

//     // ============================================================
//     // 6. FORM DATA
//     // ============================================================

//     const updateData = new URLSearchParams();

//     updateData.append(
//       "Id",
//       String(id)
//     );

//     updateData.append(
//       "EntryDate",
//       formattedEntryDate
//     );

//     updateData.append(
//       "ShopId",
//       String(shopId)
//     );

//     updateData.append(
//       "TotalAmount",
//       String(amount)
//     );

//     updateData.append(
//       "UpdatedBy",
//       String(updatedBy)
//     );

//     // ============================================================
//     // 7. LOG
//     // ============================================================

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "DAILY STOCK HEADER UPDATE PAYLOAD:",
//       Object.fromEntries(
//         updateData.entries()
//       )
//     );

//     console.log(
//       "=========================================="
//     );

//     // ============================================================
//     // 8. API
//     // ============================================================

//     const apiUrl =
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//     const response = await fetch(
//       apiUrl,
//       {
//         method: "POST",

//         headers: {
//           "Content-Type":
//             "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData.toString(),

//         redirect: "follow",
//       }
//     );

//     console.log(
//       "HEADER UPDATE STATUS:",
//       response.status
//     );

//     // ============================================================
//     // 9. RAW RESPONSE
//     // ============================================================

//     const responseText =
//       await response.text();

//     console.log(
//       "HEADER UPDATE RAW RESPONSE:",
//       responseText
//     );

//     // ============================================================
//     // 10. JSON
//     // ============================================================

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch (error) {
//       throw new Error(
//         `Invalid Header Update API response: ${responseText}`
//       );
//     }

//     console.log(
//       "HEADER UPDATE RESPONSE:",
//       result
//     );

//     // ============================================================
//     // 11. SUCCESS CHECK
//     // ============================================================

//     if (!response.ok) {
//       throw new Error(
//         result?.message ||
//         `Header Update API failed: ${response.status}`
//       );
//     }

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//         "Daily Stock Header update failed"
//       );
//     }

//     console.log(
//       "✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY"
//     );

//     return result;

//   } catch (error) {

//     console.error(
//       "DAILY STOCK HEADER UPDATE ERROR:",
//       error
//     );

//     throw error;
//   }
// };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

// useEffect(() => {
//   fetchProduct();
//   fetchAllDailyStockHeaders();
// }, []);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
// const resetForm = () => {
//   setSelectedShop({
//     Id: MAIN_OFFICE_ID,
//     AccountName: "Main Office",
//   });
//   setDate(new Date());
//   setSelectedProduct(null);
//   setQuantity("");
//   setRate("");
//   setRows([]);
//   setEditingEntry(null);
// };

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = () => {
//     resetForm();

//     setOpenForm(true);
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
//   // PRODUCT CHANGE
//   // ==========================================================

//   const handleProductChange = (event, newValue) => {
//     setSelectedProduct(newValue);

//     if (newValue) {
//       setRate(newValue.rate);
//     } else {
//       setRate("");
//     }
//   };

//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setQuantity(value);
//     }
//   };

//   // ==========================================================
//   // RATE CHANGE
//   // ==========================================================

//   // ==========================================================
//   // ADD PRODUCT
//   // ==========================================================

//   const handleAddProduct = () => {
//     if (!selectedProduct) {
//       toast.error("Please select Product");

//       return;
//     }

//     if (quantity === "" || Number(quantity) <= 0) {
//       toast.error("Please enter Quantity");

//       return;
//     }

//     if (rate === "" || Number(rate) < 0) {
//       toast.error("Please enter Rate");

//       return;
//     }

//     const qty = Number(quantity);

//     const productRate = Number(rate);

//     const amount = qty * productRate;

//     const newRow = {
//       Id: "",

//       ProductId: selectedProduct.value,

//       ProductCode: selectedProduct.productCode,

//       ProductName: selectedProduct.label,

//       Quantity: qty,

//       Rate: productRate,

//       Amount: amount,
//     };

//     setRows((previousRows) => [...previousRows, newRow]);

//     setSelectedProduct(null);

//     setQuantity("");

//     setRate("");
//   };

//   // ==========================================================
//   // DELETE DETAIL ROW
//   // ==========================================================

//   const handleDeleteRow = (index) => {
//     setRows((previousRows) =>
//       previousRows.filter((_, rowIndex) => rowIndex !== index),
//     );
//   };

//   // ==========================================================
//   // TOTAL
//   // ==========================================================

//   const total = useMemo(() => {
//     return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
//   }, [rows]);

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   // PHP date object response:
//   // { date: "2026-09-22 00:00:00.000000", ... }
//   if (typeof value === "object" && value?.date) {
//     value = value.date;
//   }

//   const dateString = String(value).trim();

//   // Handle: YYYY-MM-DD
//   // Handle: YYYY-MM-DD HH:mm:ss
//   // Handle: YYYY-MM-DDTHH:mm:ss
//   const match = dateString.match(
//     /^(\d{4})-(\d{2})-(\d{2})/
//   );

//   if (match) {
//     const [, year, month, day] = match;

//     return `${day}-${month}-${year}`;
//   }

//   // Fallback for normal JS date values
//   const d = new Date(dateString);

//   if (Number.isNaN(d.getTime())) {
//     return "";
//   }

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// // ==========================================================
// // MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
// // ==========================================================

// const mappedStockEntries = useMemo(() => {
//   return stockEntries.map((item) => ({
//     ...item,

//     id:
//       item?.Id ??
//       item?.id ??
//       item?.DailyStockHeaderId ??
//       "",

//     dateText:
//       item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//     shop:
//       item?.ShopName ??
//       item?.AccountName ??
//       item?.Shop ??
//       item?.shop ??
//       "Stock Entry Shop",

//     total: Number(
//       item?.TotalAmount ??
//       item?.totalAmount ??
//       item?.Total ??
//       item?.total ??
//       0
//     ),
//   }));
// }, [stockEntries]);

//   // ==========================================================
//   // SAVE DAILY STOCK ENTRY
//   // ==========================================================

//  const handleSave = async () => {

//   if (
//   !date ||
//   !(date instanceof Date) ||
//   Number.isNaN(date.getTime())
// ) {
//   toast.error(
//     "Please select a valid Date"
//   );
//   return;
// }

//   if (rows.length === 0) {
//     toast.error("Please add at least one Product");
//     return;
//   }

//   try {
//     setSaving(true);

//    const entryDate =
//   `${date.getFullYear()}-${String(
//     date.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     date.getDate()
//   ).padStart(2, "0")}`;

// console.log(
//   "FINAL ENTRY DATE:",
//   entryDate
// );

//     // ============================================
//     // EDIT EXISTING ENTRY
//     // ============================================
//     if (editingEntry) {
//       const headerId =
//         editingEntry?.Id ||
//         editingEntry?.id;

//       if (!headerId) {
//         throw new Error(
//           "Daily Stock Header ID not found"
//         );
//       }

//       // --------------------------------------------
//       // UPDATE HEADER
//       // --------------------------------------------
// await updateDailyStockHeader(
//   headerId,
//   entryDate,
//   total
// );

//       console.log(
//         "DAILY STOCK HEADER UPDATED:",
//         headerId
//       );

//     // --------------------------------------------
// // UPDATE / INSERT DETAILS
// // --------------------------------------------
// // ============================================================
// // UPDATE / INSERT DAILY STOCK DETAILS
// // ============================================================
// for (const row of rows) {

//   const detailId =
//     row?.Id ||
//     row?.id ||
//     "";

//   // ==========================================================
//   // EXISTING DETAIL -> UPDATE
//   // ==========================================================
//   if (detailId) {

//     const detailData = new URLSearchParams();

//     detailData.append(
//       "Id",
//       String(detailId)
//     );

//     detailData.append(
//       "DailyStockHeaderId",
//       String(headerId)
//     );

//     detailData.append(
//       "ProductId",
//       String(row?.ProductId || "")
//     );

//     detailData.append(
//       "Quantity",
//       String(Number(row?.Quantity || 0))
//     );

//     detailData.append(
//       "Rate",
//       String(Number(row?.Rate || 0))
//     );

//     detailData.append(
//       "Amount",
//       String(Number(row?.Amount || 0))
//     );

//     detailData.append(
//       "UpdatedBy",
//       "1"
//     );

//     console.log(
//       "UPDATING DAILY STOCK DETAIL:",
//       Object.fromEntries(detailData.entries())
//     );

//     const detailResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//       {
//         method: "POST",
//         body: detailData,
//         redirect: "follow",
//       }
//     );

//     const detailText =
//       await detailResponse.text();

//     console.log(
//       "DAILY STOCK DETAIL UPDATE STATUS:",
//       detailResponse.status
//     );

//     console.log(
//       "DAILY STOCK DETAIL UPDATE RESPONSE:",
//       detailText
//     );

//     if (!detailResponse.ok) {
//       throw new Error(
//         `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`
//       );
//     }

//     let detailResult;

//     try {
//       detailResult =
//         JSON.parse(detailText);
//     } catch {
//       detailResult = {};
//     }

//     if (detailResult?.success === false) {
//       throw new Error(
//         detailResult?.message ||
//         "Daily Stock Detail update failed"
//       );
//     }

//     console.log(
//       "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
//       detailResult
//     );
//   }

//   // ==========================================================
//   // NEW DETAIL -> INSERT
//   // ==========================================================
//   else {

//     const detailData =
//       new URLSearchParams();

//     detailData.append(
//       "DailyStockHeaderId",
//       String(headerId)
//     );

//     detailData.append(
//       "ProductId",
//       String(row?.ProductId || "")
//     );

//     detailData.append(
//       "Quantity",
//       String(Number(row?.Quantity || 0))
//     );

//     detailData.append(
//       "Rate",
//       String(Number(row?.Rate || 0))
//     );

//     detailData.append(
//       "Amount",
//       String(Number(row?.Amount || 0))
//     );

//     detailData.append(
//       "CreatedBy",
//       "1"
//     );

//     console.log(
//       "ADDING NEW DAILY STOCK DETAIL:",
//       Object.fromEntries(detailData.entries())
//     );

//     const detailResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//       {
//         method: "POST",
//         body: detailData,
//         redirect: "follow",
//       }
//     );

//     const detailText =
//       await detailResponse.text();

//     console.log(
//       "DAILY STOCK DETAIL INSERT STATUS:",
//       detailResponse.status
//     );

//     console.log(
//       "DAILY STOCK DETAIL INSERT RESPONSE:",
//       detailText
//     );

//     if (!detailResponse.ok) {
//       throw new Error(
//         `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`
//       );
//     }

//     let detailResult;

//     try {
//       detailResult =
//         JSON.parse(detailText);
//     } catch {
//       detailResult = {};
//     }

//     if (detailResult?.success === false) {
//       throw new Error(
//         detailResult?.message ||
//         "Daily Stock Detail insert failed"
//       );
//     }

//     console.log(
//       "NEW DAILY STOCK DETAIL INSERTED:",
//       detailResult
//     );
//   }
// }

//       toast.success(
//         "Daily Stock Entry updated successfully!"
//       );

//       setOpenForm(false);
//       resetForm();

//       // Refresh Header list
//      await fetchAllDailyStockHeaders();

//       return;
//     }

//     // ============================================
//     // NEW ENTRY
//     // ============================================

//     const headerData = new URLSearchParams();

//     headerData.append(
//       "EntryDate",
//       entryDate
//     );

//    headerData.append(
//   "ShopId",
//   String(MAIN_OFFICE_ID)
// );

//     headerData.append(
//       "OfficeId",
//       ""
//     );

//     headerData.append(
//       "TotalAmount",
//       String(Number(total || 0))
//     );

//     headerData.append(
//       "CreatedBy",
//       "1"
//     );

//     const headerRequestOptions = {
//       method: "POST",
//       body: headerData,
//       redirect: "follow",
//     };

//     const headerResponse = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
//       headerRequestOptions
//     );

//     if (!headerResponse.ok) {
//       throw new Error(
//         `Daily Stock Header API failed: ${headerResponse.status}`
//       );
//     }

//     const headerResult =
//       await headerResponse.json();

//     console.log(
//       "DAILY STOCK HEADER POST RESPONSE:",
//       headerResult
//     );

//     const headerId =
//       headerResult?.Id ||
//       headerResult?.id ||
//       headerResult?.insert_id ||
//       headerResult?.DailyStockHeaderId ||
//       headerResult?.data?.Id ||
//       headerResult?.data?.id;

//     if (!headerId) {
//       throw new Error(
//         "Daily Stock Header ID was not returned from API"
//       );
//     }

//     console.log(
//       "CREATED DAILY STOCK HEADER ID:",
//       headerId
//     );

//     // --------------------------------------------
//     // POST DETAILS
//     // --------------------------------------------
//     for (const row of rows) {
//       const detailData = new URLSearchParams();

//       detailData.append(
//         "DailyStockHeaderId",
//         String(headerId)
//       );

//       detailData.append(
//         "ProductId",
//         String(row.ProductId || "")
//       );

//       detailData.append(
//         "Quantity",
//         String(Number(row.Quantity || 0))
//       );

//       detailData.append(
//         "Rate",
//         String(Number(row.Rate || 0))
//       );

//       detailData.append(
//         "Amount",
//         String(Number(row.Amount || 0))
//       );

//       detailData.append(
//         "CreatedBy",
//         "1"
//       );

//       const detailRequestOptions = {
//         method: "POST",
//         body: detailData,
//         redirect: "follow",
//       };

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
//         detailRequestOptions
//       );

//       if (!detailResponse.ok) {
//         throw new Error(
//           `Daily Stock Detail API failed: ${detailResponse.status}`
//         );
//       }

//       const detailResult =
//         await detailResponse.json();

//       console.log(
//         "DAILY STOCK DETAIL POST RESPONSE:",
//         detailResult
//       );
//     }

//     toast.success(
//       "Daily Stock Entry at Main Office saved successfully!"
//     );

//     setOpenForm(false);
//     resetForm();

//     // Refresh Header list
//     await fetchAllDailyStockHeaders();

//   } catch (error) {
//     console.error(
//       "Main Office Daily Stock Save Error:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to save Daily Stock Entry"
//     );
//   } finally {
//     setSaving(false);
//   }
// };

//  // ==========================================================
// // SAFE DATE PARSER
// // ==========================================================
// const parseApiDate = (value) => {
//   if (!value) {
//     return null;
//   }

//   // PHP date object
//   // Example:
//   // { date: "2026-09-22 00:00:00.000000", ... }
//   if (
//     typeof value === "object" &&
//     value?.date
//   ) {
//     value = value.date;
//   }

//   const dateString = String(value).trim();

//   if (!dateString) {
//     return null;
//   }

//   // YYYY-MM-DD
//   // YYYY-MM-DD HH:mm:ss
//   // YYYY-MM-DDTHH:mm:ss
//   const match = dateString.match(
//     /^(\d{4})-(\d{2})-(\d{2})/
//   );

//   if (match) {
//     const year = Number(match[1]);
//     const month = Number(match[2]);
//     const day = Number(match[3]);

//     const result = new Date(
//       year,
//       month - 1,
//       day
//     );

//     if (!Number.isNaN(result.getTime())) {
//       return result;
//     }
//   }

//   // DD-MM-YYYY
//   const ddmmyyyy = dateString.match(
//     /^(\d{2})-(\d{2})-(\d{4})$/
//   );

//   if (ddmmyyyy) {
//     const day = Number(ddmmyyyy[1]);
//     const month = Number(ddmmyyyy[2]);
//     const year = Number(ddmmyyyy[3]);

//     const result = new Date(
//       year,
//       month - 1,
//       day
//     );

//     if (!Number.isNaN(result.getTime())) {
//       return result;
//     }
//   }

//   return null;
// };

// // ==========================================================
// // EDIT DAILY STOCK ENTRY
// // ==========================================================
// const handleEditEntry = async (entry) => {
//   try {
//     console.log(
//       "EDIT DAILY STOCK HEADER:",
//       entry
//     );

//     // ========================================================
//     // HEADER ID
//     // ========================================================

//     const headerId =
//       entry?.Id ||
//       entry?.id;

//     if (!headerId) {
//       toast.error(
//         "Daily Stock Header ID not found"
//       );
//       return;
//     }

//     // ========================================================
//     // SET EDITING ENTRY
//     // ========================================================

//     setEditingEntry(entry);
//     setOpenForm(true);

//     // ========================================================
//     // DATE
//     // ========================================================

//     const apiDate =
//       entry?.EntryDate ||
//       entry?.date;

//     const parsedDate =
//       parseApiDate(apiDate);

//     console.log(
//       "EDIT API DATE:",
//       apiDate
//     );

//     console.log(
//       "EDIT PARSED DATE:",
//       parsedDate
//     );

//     if (parsedDate) {
//       setDate(parsedDate);
//     } else {
//       // Important:
//       // Never allow invalid date to reach update API
//       toast.error(
//         "Invalid Entry Date received from API"
//       );

//       setDate(new Date());
//     }

//     // ========================================================
//     // MAIN OFFICE ALWAYS ID = 2
//     // ========================================================

//     setSelectedShop({
//       Id: MAIN_OFFICE_ID,
//       AccountName: "Main Office",
//     });

//     // ========================================================
//     // FETCH DETAILS
//     // ========================================================

//     const detailData =
//       await fetchDailyStockDetail(
//         headerId
//       );

//     console.log(
//       "EDIT DAILY STOCK DETAIL:",
//       detailData
//     );

//     // ========================================================
//     // MAP DETAIL DATA
//     // ========================================================

//     const detailRows =
//       detailData.map((item) => ({
//         Id:
//           item?.Id ||
//           item?.id ||
//           "",

//         ProductId:
//           item?.ProductId ||
//           item?.productId ||
//           0,

//         ProductCode:
//           item?.ProductCode ||
//           item?.Code ||
//           item?.ProductCodeNo ||
//           "",

//         ProductName:
//           item?.ProductName ||
//           item?.Name ||
//           "",

//         Quantity: Number(
//           item?.Quantity ??
//           item?.quantity ??
//           0
//         ),

//         Rate: Number(
//           item?.Rate ??
//           item?.rate ??
//           0
//         ),

//         Amount: Number(
//           item?.Amount ??
//           item?.amount ??
//           0
//         ),
//       }));

//     console.log(
//       "EDIT MAPPED DETAIL ROWS:",
//       detailRows
//     );

//     setRows(detailRows);

//   } catch (error) {
//     console.error(
//       "Edit Daily Stock Entry Error:",
//       error
//     );

//     toast.error(
//       "Unable to load Daily Stock Entry"
//     );
//   }
// };

//   const handleDeleteEntry = (id) => {
//     setStockEntries((previousEntries) =>
//       previousEntries.filter((item) => item.id !== id),
//     );

//     toast.success("Entry removed successfully");
//   };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

// const totalPages =
//   mappedStockEntries.length === 0
//     ? 0
//     : Math.ceil(mappedStockEntries.length / pageSize);

// const paginatedStockEntries = useMemo(() => {
//   const startIndex = (pageNo - 1) * pageSize;
//   const endIndex = startIndex + pageSize;

//   return mappedStockEntries.slice(startIndex, endIndex);
// }, [mappedStockEntries, pageNo]);

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
//         const index =
//           mappedStockEntries.findIndex(
//             (item) =>
//               item.id === row.original.id
//           );

//         return index + 1;
//       },
//     },

//     {
//       accessorKey: "dateText",
//       header: "Date",
//       size: 150,

//       Cell: ({ cell }) =>
//         cell.getValue(),
//     },

//     {
//       accessorKey: "shop",
//       header: "Shop",
//       size: 250,
//     },

//     {
//       accessorKey: "total",
//       header: "Total",
//       size: 150,

//       Cell: ({ cell }) => (
//         <span>
//           ₹{" "}
//           {Number(
//             cell.getValue() || 0
//           ).toFixed(2)}
//         </span>
//       ),
//     },

//     {
//       header: "Actions",
//       size: 150,

//       enableSorting: false,
//       enableColumnFilter: false,

//       Cell: ({ row }) => (
//         <Box
//           display="flex"
//           justifyContent="center"
//         >
//           <Tooltip title="Edit">
//             <IconButton
//               size="small"
//               onClick={() =>
//                 handleEditEntry(
//                   row.original
//                 )
//               }
//             >
//               <EditIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Delete">
//             <IconButton
//               color="error"
//               size="small"
//               onClick={() =>
//                 handleDeleteEntry(
//                   row.original.id
//                 )
//               }
//             >
//               <DeleteIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       ),
//     },
//   ],
//   [
//     mappedStockEntries,
//     handleEditEntry,
//     handleDeleteEntry,
//   ]
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
//         {/* ====================================================
//             PAGE TITLE
//         ==================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Daily Stock Entry at Main Office</b>
//           </Typography>
//         </Box>

//         {/* ====================================================
//             TABLE SECTION
//         ==================================================== */}

//         <Box
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* ==================================================
//               CREATE BUTTON
//           ================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             <Button
//               sx={{
//                 background: "var(--complementary-color)",

//                 "&:hover": {
//                   background: "var(--complementary-color)",
//                 },

//                 borderRadius: "5px 5px 0 0",

//                 textTransform: "uppercase",

//                 fontSize: "16px",

//                 fontWeight: 500,

//                 px: 2.5,

//                 py: 1.5,
//               }}
//               variant="contained"
//               onClick={handleOpenForm}
//             >
//               CREATE DAILY STOCK ENTRY AT MAIN OFFICE
//             </Button>
//           </Box>

//           {/* ==================================================
//               MATERIAL REACT TABLE
//           ================================================== */}

//           <MaterialReactTable
//   columns={columns}
//   data={paginatedStockEntries}
//   enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",

//                 color: "black",

//                 fontSize: "16px",

//                 fontWeight: "bold",
//               },
//             }}
//             muiTableBodyCellProps={{
//               sx: {
//                 fontSize: "15px",
//               },
//             }}
//             muiTablePaperProps={{
//               elevation: 2,

//               sx: {
//                 borderRadius: "0 4px 4px 4px",

//                 overflow: "hidden",

//                 boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//               },
//             }}
//             muiTableContainerProps={{
//               sx: {
//                 maxHeight: "none",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 mb={1}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//                 pr={2}
//                 gap={0.5}
//               >
//                 {/* FIRST PAGE */}

//                 <FirstPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(1);
//                     }
//                   }}
//                 />

//                 {/* PREVIOUS */}

//                 <KeyboardArrowLeftIcon
//                   sx={{
//                     cursor: pageNo > 1 ? "pointer" : "default",

//                     color: pageNo > 1 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                   }}
//                 />

//                 {/* PAGE NO */}

//                 <Box ml={1}>Page No</Box>

//                 <TextField
//                   sx={{
//                     width: "65px",

//                     ml: 1,

//                     "& .MuiInputBase-input": {
//                       textAlign: "center",

//                       padding: "8px 5px",
//                     },

//                     "@media (max-width: 768px)": {
//                       width: "60px",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => {
//                     let value = Number(e.target.value);

//                     if (value < 1 || isNaN(value)) {
//                       value = 1;
//                     }

//                     if (totalPages > 0 && value > totalPages) {
//                       value = totalPages;
//                     }

//                     setPageNo(value);
//                   }}
//                   size="small"
//                 />

//                 {/* NEXT */}

//                 <KeyboardArrowRightIcon
//                   sx={{
//                     cursor: pageNo < totalPages ? "pointer" : "default",

//                     color: pageNo < totalPages ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (pageNo < totalPages) {
//                       setPageNo((prev) => Number(prev) + 1);
//                     }
//                   }}
//                 />

//                 {/* LAST PAGE */}

//                 <LastPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(totalPages);
//                     }
//                   }}
//                 />

//                 {/* TOTAL PAGES */}

//                 <Box ml={1}>Total Pages: {totalPages}</Box>
//               </Box>
//             )}
//           />
//         </Box>

//         {/* ====================================================
//             MAIN OFFICE DAILY STOCK FORM
//         ==================================================== */}

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
//               DIALOG HEADER
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
//               Daily Stock Entry at Main Office
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
//               DIALOG CONTENT
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
//                 MAIN OFFICE + DATE
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

//            {/* MAIN OFFICE */}

// <Box>
//   <Typography fontWeight={600} mb={0.5} fontSize="14px">
//     Main Office:
//   </Typography>

//   <TextField
//     value="Main Office"
//     size="small"
//     fullWidth
//     InputProps={{
//       readOnly: true,
//     }}
//   />
// </Box>

//               {/* DATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Date:
//                 </Typography>

//                 <DatePicker
//                   value={date}
//                   onChange={(newValue) => setDate(newValue)}
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
//                 PRODUCT
//             ================================================= */}

//             <Box
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                 Product:
//               </Typography>

//               <Autocomplete
//                 options={productOptions}
//                 loading={loadingProducts}
//                 value={selectedProduct}
//                 onChange={handleProductChange}
//                 getOptionLabel={(option) =>
//                   option ? `${option.productCode} - ${option.label}` : ""
//                 }
//                 isOptionEqualToValue={(option, value) =>
//                   String(option?.value) === String(value?.value)
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
//                     placeholder="Select Product"
//                     fullWidth
//                   />
//                 )}
//               />
//             </Box>

//             {/* =================================================
//                 QUANTITY + RATE + ADD
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",

//                   sm: "1fr 1fr auto",
//                 },

//                 gap: 1.5,

//                 alignItems: "end",

//                 mb: 2,
//               }}
//             >
//               {/* QUANTITY */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Quantity:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   placeholder="Enter Quantity"
//                   fullWidth
//                 />
//               </Box>

//               {/* RATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Rate:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={rate}
//                   placeholder="Rate"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box>

//               {/* ADD */}

//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   height: "40px",

//                   px: 2.5,

//                   textTransform: "none",

//                   background: "var(--complementary-color)",

//                   "&:hover": {
//                     background: "var(--complementary-color)",
//                   },
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 1.5,
//               }}
//             />

//             {/* =================================================
//                 PRODUCT DETAIL TABLE
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
//                       Product Code
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Name
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Rate
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         align="center"
//                         sx={{
//                           height: "75px",

//                           color: "#777",

//                           fontStyle: "italic",
//                         }}
//                       >
//                         No products added
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.map((row, index) => (
//                       <TableRow hover key={`${row.ProductId}-${index}`}>
//                         <TableCell>{row.ProductCode}</TableCell>

//                         <TableCell>{row.ProductName}</TableCell>

//                         <TableCell align="center">{row.Quantity}</TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Rate).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Amount).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 TOTAL
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
//               <Typography fontWeight={600} fontSize="14px">
//                 Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(total).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 140,
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           {/* ==================================================
//               DIALOG ACTIONS
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
//     </LocalizationProvider>
//   );
// };

// export default DailyStockEntryAtMainOffice;

// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
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

// import { createFilterOptions } from "@mui/material/Autocomplete";

// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const DailyStockEntryAtMainOffice = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const MAIN_OFFICE_ID = 2;

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const CREATED_BY = 1;

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [shopOptions, setShopOptions] = useState([]);

//   const [selectedShop, setSelectedShop] = useState({
//     Id: MAIN_OFFICE_ID,
//     AccountName: "Main Office",
//   });

//   const [loadingShops, setLoadingShops] = useState(false);

//   const [editingEntry, setEditingEntry] = useState(null);

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productSearch, setProductSearch] = useState("");

//   // ==========================================================
//   // QUANTITY / RATE
//   // ==========================================================

//   const [quantity, setQuantity] = useState("");

//   const [rate, setRate] = useState("");

//   // ==========================================================
//   // PRODUCT DETAIL ROWS
//   // ==========================================================

//   const [rows, setRows] = useState([]);

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item?.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: item?.Id ?? "",

//           label: String(item?.ProductName ?? "").trim(),

//           productCode: item?.ProductCode ?? "",

//           rate: Number(item?.PurchasePrice ?? 0),
//         }));

//       setProductOptions(options);

//       console.log("PRODUCT API RESPONSE:", data);
//     } catch (error) {
//       console.error("Product API Error:", error);
//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleRateChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setRate(value);
//     }
//   };

//   // ============================================================
//   // FETCH DAILY STOCK HEADER BY ID
//   // ============================================================
//   const fetchDailyStockHeader = async (headerId) => {
//     try {
//       // Header ID is required
//       if (!headerId) {
//         console.error("Daily Stock Header ID is required");
//         return [];
//       }

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK HEADER RESPONSE:", result);

//       // ============================================================
//       // HANDLE API RESPONSE
//       // ============================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = [result.data];
//       } else if (result && typeof result === "object") {
//         data = [result];
//       }

//       console.log("DAILY STOCK HEADER DATA:", data);

//       // ============================================================
//       // MAP API RESPONSE FOR MAIN TABLE
//       // ============================================================

//       const mappedData = data.map((item) => ({
//         ...item,

//         // Header ID
//         id: item?.Id || item?.id || "",

//         // Date
//         dateText: item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.dateText || "",

//         // Shop Name
//         shop: item?.ShopName || item?.shop || "",

//         // Total Amount
//         total: Number(item?.TotalAmount ?? item?.total ?? 0),
//       }));

//       console.log("MAPPED DAILY STOCK HEADER DATA:", mappedData);

//       setStockEntries(mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Header API Error:", error);

//       toast.error("Daily Stock Header data could not be loaded");

//       return [];
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADERS - STOCK ENTRY SHOP
//   // ==========================================================
//   const fetchAllDailyStockHeaders = async () => {
//     try {
//       console.log("========================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("========================================");

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php",
//         {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//           redirect: "follow",
//         },
//       );

//       console.log("DAILY STOCK HEADER LIST STATUS:", response.status);

//       const rawText = await response.text();

//       console.log("DAILY STOCK HEADER LIST RAW RESPONSE:", rawText);

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header List API failed: ${response.status}`,
//         );
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : {};
//       } catch (error) {
//         console.error("DAILY STOCK HEADER LIST JSON ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER LIST RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = Array.isArray(result.data) ? result.data : [result.data];
//       }

//       console.log("DAILY STOCK HEADER LIST DATA:", data);

//       // ======================================================
//       // ONLY STOCK ENTRY SHOP
//       // ======================================================

//       const shopId = String(MAIN_OFFICE_ID);

//       const shopEntries = data.filter((item) => {
//         const itemShopId = item?.ShopId ?? item?.shopId ?? "";

//         return String(itemShopId) === shopId;
//       });

//       console.log("STOCK ENTRY SHOP HEADERS:", shopEntries);

//       // ======================================================
//       // MAP DATA FOR TABLE
//       // ======================================================

//       const mappedData = shopEntries.map((item) => ({
//         ...item,

//         // --------------------------------------------------
//         // ID
//         // --------------------------------------------------

//         Id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//         id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//         // --------------------------------------------------
//         // DATE
//         // --------------------------------------------------

//         EntryDate: item?.EntryDate ?? item?.entryDate ?? item?.date ?? "",

//         dateText: item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.entryDate
//             ? formatDate(item.entryDate)
//             : item?.date
//               ? formatDate(item.date)
//               : "",

//         // --------------------------------------------------
//         // SHOP
//         // --------------------------------------------------

//         ShopId: item?.ShopId ?? item?.shopId ?? MAIN_OFFICE_ID,

//         OfficeId: item?.OfficeId ?? item?.officeId ?? null,

//         ShopName:
//           item?.ShopName ??
//           item?.AccountName ??
//           item?.Shop ??
//           item?.shop ??
//           "Stock Entry Shop",

//         shop:
//           item?.ShopName ??
//           item?.AccountName ??
//           item?.Shop ??
//           item?.shop ??
//           "Stock Entry Shop",

//         // --------------------------------------------------
//         // TOTAL
//         // --------------------------------------------------

//         TotalAmount: Number(
//           item?.TotalAmount ??
//             item?.totalAmount ??
//             item?.Total ??
//             item?.total ??
//             0,
//         ),

//         total: Number(
//           item?.TotalAmount ??
//             item?.totalAmount ??
//             item?.Total ??
//             item?.total ??
//             0,
//         ),
//       }));

//       // ======================================================
//       // NEWEST RECORD FIRST
//       // ======================================================

//       mappedData.sort((a, b) => {
//         const idA = Number(a?.Id || 0);
//         const idB = Number(b?.Id || 0);

//         return idB - idA;
//       });

//       console.log("FINAL STOCK ENTRY SHOP LIST:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Go to first page
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("❌ FETCH DAILY STOCK HEADER LIST ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header list could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       if (!headerId) {
//         return [];
//       }

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Detail API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK DETAIL RESPONSE:", result);

//       const data = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : [];

//       return data;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error("Daily Stock Detail data could not be loaded");

//       return [];
//     }
//   };

//   const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
//     try {
//       // ============================================================
//       // 1. HEADER ID
//       // ============================================================

//       const id = Number(headerId);

//       if (!Number.isInteger(id) || id <= 0) {
//         throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
//       }

//       // ============================================================
//       // 2. ENTRY DATE
//       // ============================================================

//       let formattedEntryDate = "";

//       if (entryDate) {
//         if (typeof entryDate === "string") {
//           // YYYY-MM-DD
//           if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//             formattedEntryDate = entryDate;
//           }

//           // DD-MM-YYYY
//           else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//             const [day, month, year] = entryDate.split("-");

//             formattedEntryDate = `${year}-${month}-${day}`;
//           }

//           // Other valid date
//           else {
//             const dateObj = new Date(entryDate);

//             if (!isNaN(dateObj.getTime())) {
//               formattedEntryDate = dateObj.toISOString().split("T")[0];
//             }
//           }
//         } else if (entryDate instanceof Date) {
//           if (!isNaN(entryDate.getTime())) {
//             formattedEntryDate = entryDate.toISOString().split("T")[0];
//           }
//         }
//       }

//       if (!formattedEntryDate || formattedEntryDate.includes("NaN")) {
//         throw new Error(`Invalid EntryDate: ${entryDate}`);
//       }

//       // ============================================================
//       // 3. TOTAL AMOUNT
//       // ============================================================

//       const amount = Number(totalAmount || 0);

//       if (isNaN(amount)) {
//         throw new Error(`Invalid TotalAmount: ${totalAmount}`);
//       }

//       // ============================================================
//       // 4. MAIN OFFICE ID
//       // ============================================================

//       const shopId = Number(MAIN_OFFICE_ID);

//       if (!Number.isInteger(shopId) || shopId <= 0) {
//         throw new Error(`Invalid Main Office ID: ${MAIN_OFFICE_ID}`);
//       }

//       // ============================================================
//       // 5. UPDATED BY
//       // ============================================================

//       const updatedBy = Number(CREATED_BY);

//       if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//         throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
//       }

//       // ============================================================
//       // 6. FORM DATA
//       // ============================================================

//       const updateData = new URLSearchParams();

//       updateData.append("Id", String(id));

//       updateData.append("EntryDate", formattedEntryDate);

//       updateData.append("ShopId", String(shopId));

//       updateData.append("TotalAmount", String(amount));

//       updateData.append("UpdatedBy", String(updatedBy));

//       // ============================================================
//       // 7. LOG
//       // ============================================================

//       console.log("==========================================");

//       console.log(
//         "DAILY STOCK HEADER UPDATE PAYLOAD:",
//         Object.fromEntries(updateData.entries()),
//       );

//       console.log("==========================================");

//       // ============================================================
//       // 8. API
//       // ============================================================

//       const apiUrl =
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//       const response = await fetch(apiUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData.toString(),

//         redirect: "follow",
//       });

//       console.log("HEADER UPDATE STATUS:", response.status);

//       // ============================================================
//       // 9. RAW RESPONSE
//       // ============================================================

//       const responseText = await response.text();

//       console.log("HEADER UPDATE RAW RESPONSE:", responseText);

//       // ============================================================
//       // 10. JSON
//       // ============================================================

//       let result = {};

//       try {
//         result = responseText ? JSON.parse(responseText) : {};
//       } catch (error) {
//         throw new Error(`Invalid Header Update API response: ${responseText}`);
//       }

//       console.log("HEADER UPDATE RESPONSE:", result);

//       // ============================================================
//       // 11. SUCCESS CHECK
//       // ============================================================

//       if (!response.ok) {
//         throw new Error(
//           result?.message || `Header Update API failed: ${response.status}`,
//         );
//       }

//       if (result?.success === false) {
//         throw new Error(result?.message || "Daily Stock Header update failed");
//       }

//       console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

//       return result;
//     } catch (error) {
//       console.error("DAILY STOCK HEADER UPDATE ERROR:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

//   useEffect(() => {
//     fetchProduct();
//     fetchAllDailyStockHeaders();
//   }, []);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//   const resetForm = () => {
//     setSelectedShop({
//       Id: MAIN_OFFICE_ID,
//       AccountName: "Main Office",
//     });
//     setDate(new Date());
//     setSelectedProduct(null);
//     setQuantity("");
//     setRate("");
//     setRows([]);
//     setEditingEntry(null);
//   };

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = () => {
//     resetForm();

//     setOpenForm(true);
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
//   // PRODUCT CHANGE
//   // ==========================================================

//   const handleProductChange = (event, newValue) => {
//     setSelectedProduct(newValue);

//     if (newValue) {
//       setRate(newValue.rate);
//     } else {
//       setRate("");
//     }
//   };

//   const handleProductTableQuantityChange = (product, value) => {
//     // Empty quantity
//     if (value === "") {
//       setRows((previousRows) =>
//         previousRows.filter(
//           (row) => String(row.ProductId) !== String(product.value),
//         ),
//       );

//       return;
//     }

//     const qty = Number(value);

//     if (isNaN(qty) || qty < 0) {
//       return;
//     }

//     const productRate = Number(product.rate || 0);

//     const amount = qty * productRate;

//     const newRow = {
//       Id: "",
//       ProductId: product.value,
//       ProductCode: product.productCode,
//       ProductName: product.label,
//       Quantity: qty,
//       Rate: productRate,
//       Amount: amount,
//     };

//     setRows((previousRows) => {
//       const exists = previousRows.some(
//         (row) => String(row.ProductId) === String(product.value),
//       );

//       if (exists) {
//         return previousRows.map((row) =>
//           String(row.ProductId) === String(product.value) ? newRow : row,
//         );
//       }

//       return [...previousRows, newRow];
//     });
//   };

//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setQuantity(value);
//     }
//   };

//   // ==========================================================
//   // RATE CHANGE
//   // ==========================================================

//   // ==========================================================
//   // ADD PRODUCT
//   // ==========================================================

//   const handleAddProduct = () => {
//     if (!selectedProduct) {
//       toast.error("Please select Product");

//       return;
//     }

//     if (quantity === "" || Number(quantity) <= 0) {
//       toast.error("Please enter Quantity");

//       return;
//     }

//     if (rate === "" || Number(rate) < 0) {
//       toast.error("Please enter Rate");

//       return;
//     }

//     const qty = Number(quantity);

//     const productRate = Number(rate);

//     const amount = qty * productRate;

//     const newRow = {
//       Id: "",

//       ProductId: selectedProduct.value,

//       ProductCode: selectedProduct.productCode,

//       ProductName: selectedProduct.label,

//       Quantity: qty,

//       Rate: productRate,

//       Amount: amount,
//     };

//     setRows((previousRows) => [...previousRows, newRow]);

//     setSelectedProduct(null);

//     setQuantity("");

//     setRate("");
//   };

//   // ==========================================================
//   // DELETE DETAIL ROW
//   // ==========================================================

//   const handleDeleteRow = (index) => {
//     setRows((previousRows) =>
//       previousRows.filter((_, rowIndex) => rowIndex !== index),
//     );
//   };

//   // ==========================================================
//   // TOTAL
//   // ==========================================================

//   const total = useMemo(() => {
//     return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
//   }, [rows]);

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     // PHP date object response:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     // Handle: YYYY-MM-DD
//     // Handle: YYYY-MM-DD HH:mm:ss
//     // Handle: YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const [, year, month, day] = match;

//       return `${day}-${month}-${year}`;
//     }

//     // Fallback for normal JS date values
//     const d = new Date(dateString);

//     if (Number.isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
//   // ==========================================================

//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ??
//         item?.AccountName ??
//         item?.Shop ??
//         item?.shop ??
//         "Stock Entry Shop",

//       total: Number(
//         item?.TotalAmount ??
//           item?.totalAmount ??
//           item?.Total ??
//           item?.total ??
//           0,
//       ),
//     }));
//   }, [stockEntries]);

//   // ==========================================================
//   // SAVE DAILY STOCK ENTRY
//   // ==========================================================

//   const handleSave = async () => {
//     if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
//       toast.error("Please select a valid Date");
//       return;
//     }

//     if (rows.length === 0) {
//       toast.error("Please add at least one Product");
//       return;
//     }

//     try {
//       setSaving(true);

//       const entryDate = `${date.getFullYear()}-${String(
//         date.getMonth() + 1,
//       ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//       console.log("FINAL ENTRY DATE:", entryDate);

//       // ============================================
//       // EDIT EXISTING ENTRY
//       // ============================================
//       if (editingEntry) {
//         const headerId = editingEntry?.Id || editingEntry?.id;

//         if (!headerId) {
//           throw new Error("Daily Stock Header ID not found");
//         }

//         // --------------------------------------------
//         // UPDATE HEADER
//         // --------------------------------------------
//         await updateDailyStockHeader(headerId, entryDate, total);

//         console.log("DAILY STOCK HEADER UPDATED:", headerId);

//         // --------------------------------------------
//         // UPDATE / INSERT DETAILS
//         // --------------------------------------------
//         // ============================================================
//         // UPDATE / INSERT DAILY STOCK DETAILS
//         // ============================================================
//         for (const row of rows) {
//           const detailId = row?.Id || row?.id || "";

//           // ==========================================================
//           // EXISTING DETAIL -> UPDATE
//           // ==========================================================
//           if (detailId) {
//             const detailData = new URLSearchParams();

//             detailData.append("Id", String(detailId));

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("UpdatedBy", "1");

//             console.log(
//               "UPDATING DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL UPDATE STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL UPDATE RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail update failed",
//               );
//             }

//             console.log(
//               "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
//               detailResult,
//             );
//           }

//           // ==========================================================
//           // NEW DETAIL -> INSERT
//           // ==========================================================
//           else {
//             const detailData = new URLSearchParams();

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("CreatedBy", "1");

//             console.log(
//               "ADDING NEW DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL INSERT STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL INSERT RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail insert failed",
//               );
//             }

//             console.log("NEW DAILY STOCK DETAIL INSERTED:", detailResult);
//           }
//         }

//         toast.success("Daily Stock Entry updated successfully!");

//         setOpenForm(false);
//         resetForm();

//         // Refresh Header list
//         await fetchAllDailyStockHeaders();

//         return;
//       }

//       // ============================================
//       // NEW ENTRY
//       // ============================================

//       const headerData = new URLSearchParams();

//       headerData.append("EntryDate", entryDate);

//       headerData.append("ShopId", String(MAIN_OFFICE_ID));

//       headerData.append("OfficeId", "");

//       headerData.append("TotalAmount", String(Number(total || 0)));

//       headerData.append("CreatedBy", "1");

//       const headerRequestOptions = {
//         method: "POST",
//         body: headerData,
//         redirect: "follow",
//       };

//       const headerResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
//         headerRequestOptions,
//       );

//       if (!headerResponse.ok) {
//         throw new Error(
//           `Daily Stock Header API failed: ${headerResponse.status}`,
//         );
//       }

//       const headerResult = await headerResponse.json();

//       console.log("DAILY STOCK HEADER POST RESPONSE:", headerResult);

//       const headerId =
//         headerResult?.Id ||
//         headerResult?.id ||
//         headerResult?.insert_id ||
//         headerResult?.DailyStockHeaderId ||
//         headerResult?.data?.Id ||
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error("Daily Stock Header ID was not returned from API");
//       }

//       console.log("CREATED DAILY STOCK HEADER ID:", headerId);

//       // --------------------------------------------
//       // POST DETAILS
//       // --------------------------------------------
//       for (const row of rows) {
//         const detailData = new URLSearchParams();

//         detailData.append("DailyStockHeaderId", String(headerId));

//         detailData.append("ProductId", String(row.ProductId || ""));

//         detailData.append("Quantity", String(Number(row.Quantity || 0)));

//         detailData.append("Rate", String(Number(row.Rate || 0)));

//         detailData.append("Amount", String(Number(row.Amount || 0)));

//         detailData.append("CreatedBy", "1");

//         const detailRequestOptions = {
//           method: "POST",
//           body: detailData,
//           redirect: "follow",
//         };

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
//           detailRequestOptions,
//         );

//         if (!detailResponse.ok) {
//           throw new Error(
//             `Daily Stock Detail API failed: ${detailResponse.status}`,
//           );
//         }

//         const detailResult = await detailResponse.json();

//         console.log("DAILY STOCK DETAIL POST RESPONSE:", detailResult);
//       }

//       toast.success("Daily Stock Entry at Main Office saved successfully!");

//       setOpenForm(false);
//       resetForm();

//       // Refresh Header list
//       await fetchAllDailyStockHeaders();
//     } catch (error) {
//       console.error("Main Office Daily Stock Save Error:", error);

//       toast.error(error?.message || "Unable to save Daily Stock Entry");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================================
//   // SAFE DATE PARSER
//   // ==========================================================
//   const parseApiDate = (value) => {
//     if (!value) {
//       return null;
//     }

//     // PHP date object
//     // Example:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     if (!dateString) {
//       return null;
//     }

//     // YYYY-MM-DD
//     // YYYY-MM-DD HH:mm:ss
//     // YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const year = Number(match[1]);
//       const month = Number(match[2]);
//       const day = Number(match[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     // DD-MM-YYYY
//     const ddmmyyyy = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);

//     if (ddmmyyyy) {
//       const day = Number(ddmmyyyy[1]);
//       const month = Number(ddmmyyyy[2]);
//       const year = Number(ddmmyyyy[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     return null;
//   };

//   // ==========================================================
//   // EDIT DAILY STOCK ENTRY
//   // ==========================================================
//   const handleEditEntry = async (entry) => {
//     try {
//       console.log("EDIT DAILY STOCK HEADER:", entry);

//       // ========================================================
//       // HEADER ID
//       // ========================================================

//       const headerId = entry?.Id || entry?.id;

//       if (!headerId) {
//         toast.error("Daily Stock Header ID not found");
//         return;
//       }

//       // ========================================================
//       // SET EDITING ENTRY
//       // ========================================================

//       setEditingEntry(entry);
//       setOpenForm(true);

//       // ========================================================
//       // DATE
//       // ========================================================

//       const apiDate = entry?.EntryDate || entry?.date;

//       const parsedDate = parseApiDate(apiDate);

//       console.log("EDIT API DATE:", apiDate);

//       console.log("EDIT PARSED DATE:", parsedDate);

//       if (parsedDate) {
//         setDate(parsedDate);
//       } else {
//         // Important:
//         // Never allow invalid date to reach update API
//         toast.error("Invalid Entry Date received from API");

//         setDate(new Date());
//       }

//       // ========================================================
//       // MAIN OFFICE ALWAYS ID = 2
//       // ========================================================

//       setSelectedShop({
//         Id: MAIN_OFFICE_ID,
//         AccountName: "Main Office",
//       });

//       // ========================================================
//       // FETCH DETAILS
//       // ========================================================

//       const detailData = await fetchDailyStockDetail(headerId);

//       console.log("EDIT DAILY STOCK DETAIL:", detailData);

//       // ========================================================
//       // MAP DETAIL DATA
//       // ========================================================

//       const detailRows = detailData.map((item) => ({
//         Id: item?.Id || item?.id || "",

//         ProductId: item?.ProductId || item?.productId || 0,

//         ProductCode:
//           item?.ProductCode || item?.Code || item?.ProductCodeNo || "",

//         ProductName: item?.ProductName || item?.Name || "",

//         Quantity: Number(item?.Quantity ?? item?.quantity ?? 0),

//         Rate: Number(item?.Rate ?? item?.rate ?? 0),

//         Amount: Number(item?.Amount ?? item?.amount ?? 0),
//       }));

//       console.log("EDIT MAPPED DETAIL ROWS:", detailRows);

//       setRows(detailRows);
//     } catch (error) {
//       console.error("Edit Daily Stock Entry Error:", error);

//       toast.error("Unable to load Daily Stock Entry");
//     }
//   };

//   const handleDeleteEntry = (id) => {
//     setStockEntries((previousEntries) =>
//       previousEntries.filter((item) => item.id !== id),
//     );

//     toast.success("Entry removed successfully");
//   };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

//   const totalPages =
//     mappedStockEntries.length === 0
//       ? 0
//       : Math.ceil(mappedStockEntries.length / pageSize);

//   const paginatedStockEntries = useMemo(() => {
//     const startIndex = (pageNo - 1) * pageSize;
//     const endIndex = startIndex + pageSize;

//     return mappedStockEntries.slice(startIndex, endIndex);
//   }, [mappedStockEntries, pageNo]);

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
//           const index = mappedStockEntries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "dateText",
//         header: "Date",
//         size: 150,

//         Cell: ({ cell }) => cell.getValue(),
//       },

//       {
//         accessorKey: "shop",
//         header: "Shop",
//         size: 250,
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
//         size: 150,

//         enableSorting: false,
//         enableColumnFilter: false,

//         Cell: ({ row }) => (
//           <Box display="flex" justifyContent="center">
//             <Tooltip title="Edit">
//               <IconButton
//                 size="small"
//                 onClick={() => handleEditEntry(row.original)}
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Delete">
//               <IconButton
//                 color="error"
//                 size="small"
//                 onClick={() => handleDeleteEntry(row.original.id)}
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         ),
//       },
//     ],
//     [mappedStockEntries, handleEditEntry, handleDeleteEntry],
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
//         {/* ====================================================
//             PAGE TITLE
//         ==================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b>Daily Stock Entry at Main Office</b>
//           </Typography>
//         </Box>

//         {/* ====================================================
//             TABLE SECTION
//         ==================================================== */}

//         <Box
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* ==================================================
//               CREATE BUTTON
//           ================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             <Button
//               sx={{
//                 background: "var(--complementary-color)",

//                 "&:hover": {
//                   background: "var(--complementary-color)",
//                 },

//                 borderRadius: "5px 5px 0 0",

//                 textTransform: "uppercase",

//                 fontSize: "16px",

//                 fontWeight: 500,

//                 px: 2.5,

//                 py: 1.5,
//               }}
//               variant="contained"
//               onClick={handleOpenForm}
//             >
//               CREATE DAILY STOCK ENTRY AT MAIN OFFICE
//             </Button>
//           </Box>

//           {/* ==================================================
//               MATERIAL REACT TABLE
//           ================================================== */}

//           <MaterialReactTable
//             columns={columns}
//             data={paginatedStockEntries}
//             enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",

//                 color: "black",

//                 fontSize: "16px",

//                 fontWeight: "bold",
//               },
//             }}
//             muiTableBodyCellProps={{
//               sx: {
//                 fontSize: "15px",
//               },
//             }}
//             muiTablePaperProps={{
//               elevation: 2,

//               sx: {
//                 borderRadius: "0 4px 4px 4px",

//                 overflow: "hidden",

//                 boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//               },
//             }}
//             muiTableContainerProps={{
//               sx: {
//                 maxHeight: "none",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 mb={1}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//                 pr={2}
//                 gap={0.5}
//               >
//                 {/* FIRST PAGE */}

//                 <FirstPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(1);
//                     }
//                   }}
//                 />

//                 {/* PREVIOUS */}

//                 <KeyboardArrowLeftIcon
//                   sx={{
//                     cursor: pageNo > 1 ? "pointer" : "default",

//                     color: pageNo > 1 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                   }}
//                 />

//                 {/* PAGE NO */}

//                 <Box ml={1}>Page No</Box>

//                 <TextField
//                   sx={{
//                     width: "65px",

//                     ml: 1,

//                     "& .MuiInputBase-input": {
//                       textAlign: "center",

//                       padding: "8px 5px",
//                     },

//                     "@media (max-width: 768px)": {
//                       width: "60px",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => {
//                     let value = Number(e.target.value);

//                     if (value < 1 || isNaN(value)) {
//                       value = 1;
//                     }

//                     if (totalPages > 0 && value > totalPages) {
//                       value = totalPages;
//                     }

//                     setPageNo(value);
//                   }}
//                   size="small"
//                 />

//                 {/* NEXT */}

//                 <KeyboardArrowRightIcon
//                   sx={{
//                     cursor: pageNo < totalPages ? "pointer" : "default",

//                     color: pageNo < totalPages ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (pageNo < totalPages) {
//                       setPageNo((prev) => Number(prev) + 1);
//                     }
//                   }}
//                 />

//                 {/* LAST PAGE */}

//                 <LastPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(totalPages);
//                     }
//                   }}
//                 />

//                 {/* TOTAL PAGES */}

//                 <Box ml={1}>Total Pages: {totalPages}</Box>
//               </Box>
//             )}
//           />
//         </Box>

//         {/* ====================================================
//             MAIN OFFICE DAILY STOCK FORM
//         ==================================================== */}

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
//               DIALOG HEADER
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
//               Daily Stock Entry at Main Office
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
//               DIALOG CONTENT
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
//                 MAIN OFFICE + DATE
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
//               {/* MAIN OFFICE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Main Office:
//                 </Typography>

//                 <TextField
//                   value="Main Office"
//                   size="small"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box>

//               {/* DATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Date:
//                 </Typography>

//                 <DatePicker
//                   value={date}
//                   onChange={(newValue) => setDate(newValue)}
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
//                 PRODUCT
//             ================================================= */}

//             <Box
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                 Product:
//               </Typography>

//               {/* =================================================
//     PRODUCT SEARCH + PRODUCT SELECTION TABLE
// ================================================= */}

//               <Box sx={{ mb: 2 }}>
//                 {/* SEARCH */}
//                 {/* <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography> */}

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Search Product / Code"
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   sx={{ mb: 1.5 }}
//                 />

//                 {/* PRODUCT TABLE */}
//                 <Box
//                   sx={{
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                     overflow: "hidden",
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {/* TABLE HEADER */}
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                       backgroundColor: "#e9edf1",
//                       borderBottom: "1px solid #ccc",
//                       fontWeight: 700,
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Code
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Name
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "center",
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Quantity
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "right",
//                       }}
//                     >
//                       Rate
//                     </Box>
//                   </Box>

//                   {/* PRODUCT ROWS */}

//                   {productOptions
//                     .filter((product) => {
//                       const search = String(productSearch || "")
//                         .trim()
//                         .toLowerCase();

//                       if (!search) {
//                         return true;
//                       }

//                       return (
//                         String(product.productCode || "")
//                           .toLowerCase()
//                           .includes(search) ||
//                         String(product.label || "")
//                           .toLowerCase()
//                           .includes(search)
//                       );
//                     })
//                     .map((product) => {
//                       const existingRow = rows.find(
//                         (row) =>
//                           String(row.ProductId) === String(product.value),
//                       );

//                       return (
//                         <Box
//                           key={product.value}
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                             borderBottom: "1px solid #ddd",
//                             alignItems: "center",

//                             "&:hover": {
//                               backgroundColor: "#fafafa",
//                             },
//                           }}
//                         >
//                           {/* PRODUCT CODE */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               borderRight: "1px solid #ddd",
//                             }}
//                           >
//                             {product.productCode}
//                           </Box>

//                           {/* PRODUCT NAME */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               borderRight: "1px solid #ddd",
//                             }}
//                           >
//                             {product.label}
//                           </Box>

//                           {/* QUANTITY */}
//                           <Box
//                             sx={{
//                               p: 1,
//                               borderRight: "1px solid #ddd",
//                               display: "flex",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="Enter Qty"
//                               value={existingRow ? existingRow.Quantity : ""}
//                               onChange={(e) =>
//                                 handleProductTableQuantityChange(
//                                   product,
//                                   e.target.value,
//                                 )
//                               }
//                               inputProps={{
//                                 min: 0,
//                               }}
//                               sx={{
//                                 width: "150px",
//                               }}
//                             />
//                           </Box>

//                           {/* RATE */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               textAlign: "right",
//                             }}
//                           >
//                             ₹ {Number(product.rate || 0).toFixed(2)}
//                           </Box>
//                         </Box>
//                       );
//                     })}

//                   {/* NO PRODUCT */}
//                   {productOptions.filter((product) => {
//                     const search = String(productSearch || "")
//                       .trim()
//                       .toLowerCase();

//                     if (!search) {
//                       return true;
//                     }

//                     return (
//                       String(product.productCode || "")
//                         .toLowerCase()
//                         .includes(search) ||
//                       String(product.label || "")
//                         .toLowerCase()
//                         .includes(search)
//                     );
//                   }).length === 0 && (
//                     <Box
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         color: "text.secondary",
//                       }}
//                     >
//                       No products found
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Box>

//             {/* =================================================
//                 QUANTITY + RATE + ADD
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",

//                   sm: "1fr 1fr auto",
//                 },

//                 gap: 1.5,

//                 alignItems: "end",

//                 mb: 2,
//               }}
//             >
//               {/* QUANTITY */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Quantity:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   placeholder="Enter Quantity"
//                   fullWidth
//                 />
//               </Box> */}

//               {/* RATE */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Rate:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={rate}
//                   placeholder="Rate"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box> */}

//               {/* ADD */}

//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   height: "40px",

//                   px: 2.5,

//                   textTransform: "none",

//                   background: "var(--complementary-color)",

//                   "&:hover": {
//                     background: "var(--complementary-color)",
//                   },
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 1.5,
//               }}
//             />

//             {/* =================================================
//                 PRODUCT DETAIL TABLE
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
//                       Product Code
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Name
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Rate
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         align="center"
//                         sx={{
//                           height: "75px",

//                           color: "#777",

//                           fontStyle: "italic",
//                         }}
//                       >
//                         No products added
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.map((row, index) => (
//                       <TableRow hover key={`${row.ProductId}-${index}`}>
//                         <TableCell>{row.ProductCode}</TableCell>

//                         <TableCell>{row.ProductName}</TableCell>

//                         <TableCell align="center">{row.Quantity}</TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Rate).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Amount).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 TOTAL
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
//               <Typography fontWeight={600} fontSize="14px">
//                 Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(total).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 140,
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           {/* ==================================================
//               DIALOG ACTIONS
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
//     </LocalizationProvider>
//   );
// };

// export default DailyStockEntryAtMainOffice;


































// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
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

// import { createFilterOptions } from "@mui/material/Autocomplete";

// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const DailyStockEntryAtMainOffice = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const MAIN_OFFICE_ID = 2;

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const CREATED_BY = 1;

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [shopOptions, setShopOptions] = useState([]);

//   const [selectedShop, setSelectedShop] = useState({
//     Id: MAIN_OFFICE_ID,
//     AccountName: "Main Office",
//   });

//   const [loadingShops, setLoadingShops] = useState(false);

//   const [editingEntry, setEditingEntry] = useState(null);

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productSearch, setProductSearch] = useState("");

//   // ==========================================================
//   // QUANTITY / RATE
//   // ==========================================================

//   const [quantity, setQuantity] = useState("");

//   const [rate, setRate] = useState("");

//   // ==========================================================
//   // PRODUCT DETAIL ROWS
//   // ==========================================================

//   const [rows, setRows] = useState([]);

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item?.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: item?.Id ?? "",

//           label: String(item?.ProductName ?? "").trim(),

//           productCode: item?.ProductCode ?? "",

//           rate: Number(item?.PurchasePrice ?? 0),
//         }));

//       setProductOptions(options);

//       console.log("PRODUCT API RESPONSE:", data);
//     } catch (error) {
//       console.error("Product API Error:", error);
//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleRateChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setRate(value);
//     }
//   };

//   // ============================================================
//   // FETCH DAILY STOCK HEADER BY ID
//   // ============================================================
//   const fetchDailyStockHeader = async (headerId) => {
//     try {
//       // Header ID is required
//       if (!headerId) {
//         console.error("Daily Stock Header ID is required");
//         return [];
//       }

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK HEADER RESPONSE:", result);

//       // ============================================================
//       // HANDLE API RESPONSE
//       // ============================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = [result.data];
//       } else if (result && typeof result === "object") {
//         data = [result];
//       }

//       console.log("DAILY STOCK HEADER DATA:", data);

//       // ============================================================
//       // MAP API RESPONSE FOR MAIN TABLE
//       // ============================================================

//       const mappedData = data.map((item) => ({
//         ...item,

//         // Header ID
//         id: item?.Id || item?.id || "",

//         // Date
//         dateText: item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.dateText || "",

//         // Shop Name
//         shop: item?.ShopName || item?.shop || "",

//         // Total Amount
//         total: Number(item?.TotalAmount ?? item?.total ?? 0),
//       }));

//       console.log("MAPPED DAILY STOCK HEADER DATA:", mappedData);

//       setStockEntries(mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Header API Error:", error);

//       toast.error("Daily Stock Header data could not be loaded");

//       return [];
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADERS - STOCK ENTRY SHOP
//   // ==========================================================
//   const fetchAllDailyStockHeaders = async () => {
//     try {
//       console.log("========================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("========================================");

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php",
//         {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//           redirect: "follow",
//         },
//       );

//       console.log("DAILY STOCK HEADER LIST STATUS:", response.status);

//       const rawText = await response.text();

//       console.log("DAILY STOCK HEADER LIST RAW RESPONSE:", rawText);

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header List API failed: ${response.status}`,
//         );
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : {};
//       } catch (error) {
//         console.error("DAILY STOCK HEADER LIST JSON ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER LIST RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = Array.isArray(result.data) ? result.data : [result.data];
//       }

//       console.log("DAILY STOCK HEADER LIST DATA:", data);

//       // ======================================================
//       // ONLY STOCK ENTRY SHOP
//       // ======================================================

//       const shopId = String(MAIN_OFFICE_ID);

//       const shopEntries = data.filter((item) => {
//         const itemShopId = item?.ShopId ?? item?.shopId ?? "";

//         return String(itemShopId) === shopId;
//       });

//       console.log("STOCK ENTRY SHOP HEADERS:", shopEntries);

//       // ======================================================
//       // MAP DATA FOR TABLE
//       // ======================================================

//       const mappedData = shopEntries.map((item) => ({
//         ...item,

//         // --------------------------------------------------
//         // ID
//         // --------------------------------------------------

//         Id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//         id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//         // --------------------------------------------------
//         // DATE
//         // --------------------------------------------------

//         EntryDate: item?.EntryDate ?? item?.entryDate ?? item?.date ?? "",

//         dateText: item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.entryDate
//             ? formatDate(item.entryDate)
//             : item?.date
//               ? formatDate(item.date)
//               : "",

//         // --------------------------------------------------
//         // SHOP
//         // --------------------------------------------------

//         ShopId: item?.ShopId ?? item?.shopId ?? MAIN_OFFICE_ID,

//         OfficeId: item?.OfficeId ?? item?.officeId ?? null,

//         ShopName:
//           item?.ShopName ??
//           item?.AccountName ??
//           item?.Shop ??
//           item?.shop ??
//           "Stock Entry Shop",

//         shop:
//           item?.ShopName ??
//           item?.AccountName ??
//           item?.Shop ??
//           item?.shop ??
//           "Stock Entry Shop",

//         // --------------------------------------------------
//         // TOTAL
//         // --------------------------------------------------

//         TotalAmount: Number(
//           item?.TotalAmount ??
//             item?.totalAmount ??
//             item?.Total ??
//             item?.total ??
//             0,
//         ),

//         total: Number(
//           item?.TotalAmount ??
//             item?.totalAmount ??
//             item?.Total ??
//             item?.total ??
//             0,
//         ),
//       }));

//       // ======================================================
//       // NEWEST RECORD FIRST
//       // ======================================================

//       mappedData.sort((a, b) => {
//         const idA = Number(a?.Id || 0);
//         const idB = Number(b?.Id || 0);

//         return idB - idA;
//       });

//       console.log("FINAL STOCK ENTRY SHOP LIST:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Go to first page
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("❌ FETCH DAILY STOCK HEADER LIST ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header list could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       if (!headerId) {
//         return [];
//       }

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Detail API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK DETAIL RESPONSE:", result);

//       const data = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : [];

//       return data;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error("Daily Stock Detail data could not be loaded");

//       return [];
//     }
//   };

//   const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
//     try {
//       // ============================================================
//       // 1. HEADER ID
//       // ============================================================

//       const id = Number(headerId);

//       if (!Number.isInteger(id) || id <= 0) {
//         throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
//       }

//       // ============================================================
//       // 2. ENTRY DATE
//       // ============================================================

//       let formattedEntryDate = "";

//       if (entryDate) {
//         if (typeof entryDate === "string") {
//           // YYYY-MM-DD
//           if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//             formattedEntryDate = entryDate;
//           }

//           // DD-MM-YYYY
//           else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//             const [day, month, year] = entryDate.split("-");

//             formattedEntryDate = `${year}-${month}-${day}`;
//           }

//           // Other valid date
//           else {
//             const dateObj = new Date(entryDate);

//             if (!isNaN(dateObj.getTime())) {
//               formattedEntryDate = dateObj.toISOString().split("T")[0];
//             }
//           }
//         } else if (entryDate instanceof Date) {
//           if (!isNaN(entryDate.getTime())) {
//             formattedEntryDate = entryDate.toISOString().split("T")[0];
//           }
//         }
//       }

//       if (!formattedEntryDate || formattedEntryDate.includes("NaN")) {
//         throw new Error(`Invalid EntryDate: ${entryDate}`);
//       }

//       // ============================================================
//       // 3. TOTAL AMOUNT
//       // ============================================================

//       const amount = Number(totalAmount || 0);

//       if (isNaN(amount)) {
//         throw new Error(`Invalid TotalAmount: ${totalAmount}`);
//       }

//       // ============================================================
//       // 4. MAIN OFFICE ID
//       // ============================================================

//       const shopId = Number(MAIN_OFFICE_ID);

//       if (!Number.isInteger(shopId) || shopId <= 0) {
//         throw new Error(`Invalid Main Office ID: ${MAIN_OFFICE_ID}`);
//       }

//       // ============================================================
//       // 5. UPDATED BY
//       // ============================================================

//       const updatedBy = Number(CREATED_BY);

//       if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//         throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
//       }

//       // ============================================================
//       // 6. FORM DATA
//       // ============================================================

//       const updateData = new URLSearchParams();

//       updateData.append("Id", String(id));

//       updateData.append("EntryDate", formattedEntryDate);

//       updateData.append("ShopId", String(shopId));

//       updateData.append("TotalAmount", String(amount));

//       updateData.append("UpdatedBy", String(updatedBy));

//       // ============================================================
//       // 7. LOG
//       // ============================================================

//       console.log("==========================================");

//       console.log(
//         "DAILY STOCK HEADER UPDATE PAYLOAD:",
//         Object.fromEntries(updateData.entries()),
//       );

//       console.log("==========================================");

//       // ============================================================
//       // 8. API
//       // ============================================================

//       const apiUrl =
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//       const response = await fetch(apiUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData.toString(),

//         redirect: "follow",
//       });

//       console.log("HEADER UPDATE STATUS:", response.status);

//       // ============================================================
//       // 9. RAW RESPONSE
//       // ============================================================

//       const responseText = await response.text();

//       console.log("HEADER UPDATE RAW RESPONSE:", responseText);

//       // ============================================================
//       // 10. JSON
//       // ============================================================

//       let result = {};

//       try {
//         result = responseText ? JSON.parse(responseText) : {};
//       } catch (error) {
//         throw new Error(`Invalid Header Update API response: ${responseText}`);
//       }

//       console.log("HEADER UPDATE RESPONSE:", result);

//       // ============================================================
//       // 11. SUCCESS CHECK
//       // ============================================================

//       if (!response.ok) {
//         throw new Error(
//           result?.message || `Header Update API failed: ${response.status}`,
//         );
//       }

//       if (result?.success === false) {
//         throw new Error(result?.message || "Daily Stock Header update failed");
//       }

//       console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

//       return result;
//     } catch (error) {
//       console.error("DAILY STOCK HEADER UPDATE ERROR:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

//   useEffect(() => {
//     fetchProduct();
//     fetchAllDailyStockHeaders();
//   }, []);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//   const resetForm = () => {
//     setSelectedShop({
//       Id: MAIN_OFFICE_ID,
//       AccountName: "Main Office",
//     });
//     setDate(new Date());
//     setSelectedProduct(null);
//     setQuantity("");
//     setRate("");
//     setRows([]);
//     setEditingEntry(null);
//   };

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = () => {
//     resetForm();

//     setOpenForm(true);
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
//   // PRODUCT CHANGE
//   // ==========================================================

//   const handleProductChange = (event, newValue) => {
//     setSelectedProduct(newValue);

//     if (newValue) {
//       setRate(newValue.rate);
//     } else {
//       setRate("");
//     }
//   };

//   const handleProductTableQuantityChange = (product, value) => {
//     // Empty quantity
//     if (value === "") {
//       setRows((previousRows) =>
//         previousRows.filter(
//           (row) => String(row.ProductId) !== String(product.value),
//         ),
//       );

//       return;
//     }

//     const qty = Number(value);

//     if (isNaN(qty) || qty < 0) {
//       return;
//     }

//     const productRate = Number(product.rate || 0);

//     const amount = qty * productRate;

//     const newRow = {
//       Id: "",
//       ProductId: product.value,
//       ProductCode: product.productCode,
//       ProductName: product.label,
//       Quantity: qty,
//       Rate: productRate,
//       Amount: amount,
//     };

//     setRows((previousRows) => {
//       const exists = previousRows.some(
//         (row) => String(row.ProductId) === String(product.value),
//       );

//       if (exists) {
//         return previousRows.map((row) =>
//           String(row.ProductId) === String(product.value) ? newRow : row,
//         );
//       }

//       return [...previousRows, newRow];
//     });
//   };

//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setQuantity(value);
//     }
//   };

//   // ==========================================================
//   // RATE CHANGE
//   // ==========================================================

//   // ==========================================================
//   // ADD PRODUCT
//   // ==========================================================

//   const handleAddProduct = () => {
//     if (!selectedProduct) {
//       toast.error("Please select Product");

//       return;
//     }

//     if (quantity === "" || Number(quantity) <= 0) {
//       toast.error("Please enter Quantity");

//       return;
//     }

//     if (rate === "" || Number(rate) < 0) {
//       toast.error("Please enter Rate");

//       return;
//     }

//     const qty = Number(quantity);

//     const productRate = Number(rate);

//     const amount = qty * productRate;

//     const newRow = {
//       Id: "",

//       ProductId: selectedProduct.value,

//       ProductCode: selectedProduct.productCode,

//       ProductName: selectedProduct.label,

//       Quantity: qty,

//       Rate: productRate,

//       Amount: amount,
//     };

//     setRows((previousRows) => [...previousRows, newRow]);

//     setSelectedProduct(null);

//     setQuantity("");

//     setRate("");
//   };

//   // ==========================================================
//   // DELETE DETAIL ROW
//   // ==========================================================

//   const handleDeleteRow = (index) => {
//     setRows((previousRows) =>
//       previousRows.filter((_, rowIndex) => rowIndex !== index),
//     );
//   };

//   // ==========================================================
//   // TOTAL
//   // ==========================================================

//   const total = useMemo(() => {
//     return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
//   }, [rows]);

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     // PHP date object response:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     // Handle: YYYY-MM-DD
//     // Handle: YYYY-MM-DD HH:mm:ss
//     // Handle: YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const [, year, month, day] = match;

//       return `${day}-${month}-${year}`;
//     }

//     // Fallback for normal JS date values
//     const d = new Date(dateString);

//     if (Number.isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
//   // ==========================================================

//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ??
//         item?.AccountName ??
//         item?.Shop ??
//         item?.shop ??
//         "Stock Entry Shop",

//       total: Number(
//         item?.TotalAmount ??
//           item?.totalAmount ??
//           item?.Total ??
//           item?.total ??
//           0,
//       ),
//     }));
//   }, [stockEntries]);

//   // ==========================================================
//   // SAVE DAILY STOCK ENTRY
//   // ==========================================================

//   const handleSave = async () => {
//     if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
//       toast.error("Please select a valid Date");
//       return;
//     }

//     if (rows.length === 0) {
//       toast.error("Please add at least one Product");
//       return;
//     }

//     try {
//       setSaving(true);

//       const entryDate = `${date.getFullYear()}-${String(
//         date.getMonth() + 1,
//       ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//       console.log("FINAL ENTRY DATE:", entryDate);

//       // ============================================
//       // EDIT EXISTING ENTRY
//       // ============================================
//       if (editingEntry) {
//         const headerId = editingEntry?.Id || editingEntry?.id;

//         if (!headerId) {
//           throw new Error("Daily Stock Header ID not found");
//         }

//         // --------------------------------------------
//         // UPDATE HEADER
//         // --------------------------------------------
//         await updateDailyStockHeader(headerId, entryDate, total);

//         console.log("DAILY STOCK HEADER UPDATED:", headerId);

//         // --------------------------------------------
//         // UPDATE / INSERT DETAILS
//         // --------------------------------------------
//         // ============================================================
//         // UPDATE / INSERT DAILY STOCK DETAILS
//         // ============================================================
//         for (const row of rows) {
//           const detailId = row?.Id || row?.id || "";

//           // ==========================================================
//           // EXISTING DETAIL -> UPDATE
//           // ==========================================================
//           if (detailId) {
//             const detailData = new URLSearchParams();

//             detailData.append("Id", String(detailId));

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("UpdatedBy", "1");

//             console.log(
//               "UPDATING DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL UPDATE STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL UPDATE RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail update failed",
//               );
//             }

//             console.log(
//               "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
//               detailResult,
//             );
//           }

//           // ==========================================================
//           // NEW DETAIL -> INSERT
//           // ==========================================================
//           else {
//             const detailData = new URLSearchParams();

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("CreatedBy", "1");

//             console.log(
//               "ADDING NEW DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL INSERT STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL INSERT RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail insert failed",
//               );
//             }

//             console.log("NEW DAILY STOCK DETAIL INSERTED:", detailResult);
//           }
//         }

//         toast.success("Main -Office Stock Entry updated successfully!");

//         setOpenForm(false);
//         resetForm();

//         // Refresh Header list
//         await fetchAllDailyStockHeaders();

//         return;
//       }

//       // ============================================
//       // NEW ENTRY
//       // ============================================

//       const headerData = new URLSearchParams();

//       headerData.append("EntryDate", entryDate);

//       headerData.append("ShopId", String(MAIN_OFFICE_ID));

//       headerData.append("OfficeId", "");

//       headerData.append("TotalAmount", String(Number(total || 0)));

//       headerData.append("CreatedBy", "1");

//       const headerRequestOptions = {
//         method: "POST",
//         body: headerData,
//         redirect: "follow",
//       };

//       const headerResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
//         headerRequestOptions,
//       );

//       if (!headerResponse.ok) {
//         throw new Error(
//           `Daily Stock Header API failed: ${headerResponse.status}`,
//         );
//       }

//       const headerResult = await headerResponse.json();

//       console.log("DAILY STOCK HEADER POST RESPONSE:", headerResult);

//       const headerId =
//         headerResult?.Id ||
//         headerResult?.id ||
//         headerResult?.insert_id ||
//         headerResult?.DailyStockHeaderId ||
//         headerResult?.data?.Id ||
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error("Daily Stock Header ID was not returned from API");
//       }

//       console.log("CREATED DAILY STOCK HEADER ID:", headerId);

//       // --------------------------------------------
//       // POST DETAILS
//       // --------------------------------------------
//       for (const row of rows) {
//         const detailData = new URLSearchParams();

//         detailData.append("DailyStockHeaderId", String(headerId));

//         detailData.append("ProductId", String(row.ProductId || ""));

//         detailData.append("Quantity", String(Number(row.Quantity || 0)));

//         detailData.append("Rate", String(Number(row.Rate || 0)));

//         detailData.append("Amount", String(Number(row.Amount || 0)));

//         detailData.append("CreatedBy", "1");

//         const detailRequestOptions = {
//           method: "POST",
//           body: detailData,
//           redirect: "follow",
//         };

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
//           detailRequestOptions,
//         );

//         if (!detailResponse.ok) {
//           throw new Error(
//             `Daily Stock Detail API failed: ${detailResponse.status}`,
//           );
//         }

//         const detailResult = await detailResponse.json();

//         console.log("DAILY STOCK DETAIL POST RESPONSE:", detailResult);
//       }

//       toast.success(" Stock Entry at Main Office saved successfully!");

//       setOpenForm(false);
//       resetForm();

//       // Refresh Header list
//       await fetchAllDailyStockHeaders();
//     } catch (error) {
//       console.error("Main Office Daily Stock Save Error:", error);

//       toast.error(error?.message || "Unable to save Daily Stock Entry");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================================
//   // SAFE DATE PARSER
//   // ==========================================================
//   const parseApiDate = (value) => {
//     if (!value) {
//       return null;
//     }

//     // PHP date object
//     // Example:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     if (!dateString) {
//       return null;
//     }

//     // YYYY-MM-DD
//     // YYYY-MM-DD HH:mm:ss
//     // YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const year = Number(match[1]);
//       const month = Number(match[2]);
//       const day = Number(match[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     // DD-MM-YYYY
//     const ddmmyyyy = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);

//     if (ddmmyyyy) {
//       const day = Number(ddmmyyyy[1]);
//       const month = Number(ddmmyyyy[2]);
//       const year = Number(ddmmyyyy[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     return null;
//   };

//   // ==========================================================
//   // EDIT DAILY STOCK ENTRY
//   // ==========================================================
//   const handleEditEntry = async (entry) => {
//     try {
//       console.log("EDIT DAILY STOCK HEADER:", entry);

//       // ========================================================
//       // HEADER ID
//       // ========================================================

//       const headerId = entry?.Id || entry?.id;

//       if (!headerId) {
//         toast.error("Daily Stock Header ID not found");
//         return;
//       }

//       // ========================================================
//       // SET EDITING ENTRY
//       // ========================================================

//       setEditingEntry(entry);
//       setOpenForm(true);

//       // ========================================================
//       // DATE
//       // ========================================================

//       const apiDate = entry?.EntryDate || entry?.date;

//       const parsedDate = parseApiDate(apiDate);

//       console.log("EDIT API DATE:", apiDate);

//       console.log("EDIT PARSED DATE:", parsedDate);

//       if (parsedDate) {
//         setDate(parsedDate);
//       } else {
//         // Important:
//         // Never allow invalid date to reach update API
//         toast.error("Invalid Entry Date received from API");

//         setDate(new Date());
//       }

//       // ========================================================
//       // MAIN OFFICE ALWAYS ID = 2
//       // ========================================================

//       setSelectedShop({
//         Id: MAIN_OFFICE_ID,
//         AccountName: "Main Office",
//       });

//       // ========================================================
//       // FETCH DETAILS
//       // ========================================================

//       const detailData = await fetchDailyStockDetail(headerId);

//       console.log("EDIT DAILY STOCK DETAIL:", detailData);

//       // ========================================================
//       // MAP DETAIL DATA
//       // ========================================================

//       const detailRows = detailData.map((item) => ({
//         Id: item?.Id || item?.id || "",

//         ProductId: item?.ProductId || item?.productId || 0,

//         ProductCode:
//           item?.ProductCode || item?.Code || item?.ProductCodeNo || "",

//         ProductName: item?.ProductName || item?.Name || "",

//         Quantity: Number(item?.Quantity ?? item?.quantity ?? 0),

//         Rate: Number(item?.Rate ?? item?.rate ?? 0),

//         Amount: Number(item?.Amount ?? item?.amount ?? 0),
//       }));

//       console.log("EDIT MAPPED DETAIL ROWS:", detailRows);

//       setRows(detailRows);
//     } catch (error) {
//       console.error("Edit Daily Stock Entry Error:", error);

//       toast.error("Unable to load Daily Stock Entry");
//     }
//   };

//   const handleDeleteEntry = (id) => {
//     setStockEntries((previousEntries) =>
//       previousEntries.filter((item) => item.id !== id),
//     );

//     toast.success("Entry removed successfully");
//   };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

//   const totalPages =
//     mappedStockEntries.length === 0
//       ? 0
//       : Math.ceil(mappedStockEntries.length / pageSize);

//   const paginatedStockEntries = useMemo(() => {
//     const startIndex = (pageNo - 1) * pageSize;
//     const endIndex = startIndex + pageSize;

//     return mappedStockEntries.slice(startIndex, endIndex);
//   }, [mappedStockEntries, pageNo]);

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
//           const index = mappedStockEntries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "dateText",
//         header: "Date",
//         size: 150,

//         Cell: ({ cell }) => cell.getValue(),
//       },

//       {
//         accessorKey: "shop",
//         header: "Shop",
//         size: 250,
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
//         size: 150,

//         enableSorting: false,
//         enableColumnFilter: false,

//         Cell: ({ row }) => (
//           <Box display="flex" justifyContent="center">
//             <Tooltip title="Edit">
//               <IconButton
//                 size="small"
//                 onClick={() => handleEditEntry(row.original)}
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Delete">
//               <IconButton
//                 color="error"
//                 size="small"
//                 onClick={() => handleDeleteEntry(row.original.id)}
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         ),
//       },
//     ],
//     [mappedStockEntries, handleEditEntry, handleDeleteEntry],
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
//         {/* ====================================================
//             PAGE TITLE
//         ==================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b> Stock Entry at Main Office</b>
//           </Typography>
//         </Box>

//         {/* ====================================================
//             TABLE SECTION
//         ==================================================== */}

//         <Box
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* ==================================================
//               CREATE BUTTON
//           ================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             <Button
//               sx={{
//                 background: "var(--complementary-color)",

//                 "&:hover": {
//                   background: "var(--complementary-color)",
//                 },

//                 borderRadius: "5px 5px 0 0",

//                 textTransform: "uppercase",

//                 fontSize: "16px",

//                 fontWeight: 500,

//                 px: 2.5,

//                 py: 1.5,
//               }}
//               variant="contained"
//               onClick={handleOpenForm}
//             >
//               CREATE DAILY STOCK ENTRY AT MAIN OFFICE
//             </Button>
//           </Box>

//           {/* ==================================================
//               MATERIAL REACT TABLE
//           ================================================== */}

//           <MaterialReactTable
//             columns={columns}
//             data={paginatedStockEntries}
//             enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",

//                 color: "black",

//                 fontSize: "16px",

//                 fontWeight: "bold",
//               },
//             }}
//             muiTableBodyCellProps={{
//               sx: {
//                 fontSize: "15px",
//               },
//             }}
//             muiTablePaperProps={{
//               elevation: 2,

//               sx: {
//                 borderRadius: "0 4px 4px 4px",

//                 overflow: "hidden",

//                 boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//               },
//             }}
//             muiTableContainerProps={{
//               sx: {
//                 maxHeight: "none",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 mb={1}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//                 pr={2}
//                 gap={0.5}
//               >
//                 {/* FIRST PAGE */}

//                 <FirstPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(1);
//                     }
//                   }}
//                 />

//                 {/* PREVIOUS */}

//                 <KeyboardArrowLeftIcon
//                   sx={{
//                     cursor: pageNo > 1 ? "pointer" : "default",

//                     color: pageNo > 1 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                   }}
//                 />

//                 {/* PAGE NO */}

//                 <Box ml={1}>Page No</Box>

//                 <TextField
//                   sx={{
//                     width: "65px",

//                     ml: 1,

//                     "& .MuiInputBase-input": {
//                       textAlign: "center",

//                       padding: "8px 5px",
//                     },

//                     "@media (max-width: 768px)": {
//                       width: "60px",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => {
//                     let value = Number(e.target.value);

//                     if (value < 1 || isNaN(value)) {
//                       value = 1;
//                     }

//                     if (totalPages > 0 && value > totalPages) {
//                       value = totalPages;
//                     }

//                     setPageNo(value);
//                   }}
//                   size="small"
//                 />

//                 {/* NEXT */}

//                 <KeyboardArrowRightIcon
//                   sx={{
//                     cursor: pageNo < totalPages ? "pointer" : "default",

//                     color: pageNo < totalPages ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (pageNo < totalPages) {
//                       setPageNo((prev) => Number(prev) + 1);
//                     }
//                   }}
//                 />

//                 {/* LAST PAGE */}

//                 <LastPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(totalPages);
//                     }
//                   }}
//                 />

//                 {/* TOTAL PAGES */}

//                 <Box ml={1}>Total Pages: {totalPages}</Box>
//               </Box>
//             )}
//           />
//         </Box>

//         {/* ====================================================
//             MAIN OFFICE DAILY STOCK FORM
//         ==================================================== */}

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
//               DIALOG HEADER
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
//               Stock Entry at Main Office
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
//               DIALOG CONTENT
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
//                 MAIN OFFICE + DATE
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
//               {/* MAIN OFFICE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Main Office:
//                 </Typography>

//                 <TextField
//                   value="Main Office"
//                   size="small"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box>

//               {/* DATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Date:
//                 </Typography>

//                 <DatePicker
//                   value={date}
//                   onChange={(newValue) => setDate(newValue)}
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
//                 PRODUCT
//             ================================================= */}

//             <Box
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                 Product:
//               </Typography>

//               {/* =================================================
//     PRODUCT SEARCH + PRODUCT SELECTION TABLE
// ================================================= */}

//               <Box sx={{ mb: 2 }}>
//                 {/* SEARCH */}
//                 {/* <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography> */}

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Search Product / Code"
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   sx={{ mb: 1.5 }}
//                 />

//                 {/* PRODUCT TABLE */}
//                 <Box
//                   sx={{
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                     overflow: "hidden",
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {/* TABLE HEADER */}
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                       backgroundColor: "#e9edf1",
//                       borderBottom: "1px solid #ccc",
//                       fontWeight: 700,
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Code
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Name
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "center",
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Quantity
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "right",
//                       }}
//                     >
//                       Rate
//                     </Box>
//                   </Box>

//                   {/* PRODUCT ROWS */}

//                   {productOptions
//                     .filter((product) => {
//                       const search = String(productSearch || "")
//                         .trim()
//                         .toLowerCase();

//                       if (!search) {
//                         return true;
//                       }

//                       return (
//                         String(product.productCode || "")
//                           .toLowerCase()
//                           .includes(search) ||
//                         String(product.label || "")
//                           .toLowerCase()
//                           .includes(search)
//                       );
//                     })
//                     .map((product) => {
//                       const existingRow = rows.find(
//                         (row) =>
//                           String(row.ProductId) === String(product.value),
//                       );

//                       return (
//                         <Box
//                           key={product.value}
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                             borderBottom: "1px solid #ddd",
//                             alignItems: "center",

//                             "&:hover": {
//                               backgroundColor: "#fafafa",
//                             },
//                           }}
//                         >
//                           {/* PRODUCT CODE */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               borderRight: "1px solid #ddd",
//                             }}
//                           >
//                             {product.productCode}
//                           </Box>

//                           {/* PRODUCT NAME */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               borderRight: "1px solid #ddd",
//                             }}
//                           >
//                             {product.label}
//                           </Box>

//                           {/* QUANTITY */}
//                           <Box
//                             sx={{
//                               p: 1,
//                               borderRight: "1px solid #ddd",
//                               display: "flex",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="Enter Qty"
//                               value={existingRow ? existingRow.Quantity : ""}
//                               onChange={(e) =>
//                                 handleProductTableQuantityChange(
//                                   product,
//                                   e.target.value,
//                                 )
//                               }
//                               inputProps={{
//                                 min: 0,
//                               }}
//                               sx={{
//                                 width: "150px",
//                               }}
//                             />
//                           </Box>

//                           {/* RATE */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               textAlign: "right",
//                             }}
//                           >
//                             ₹ {Number(product.rate || 0).toFixed(2)}
//                           </Box>
//                         </Box>
//                       );
//                     })}

//                   {/* NO PRODUCT */}
//                   {productOptions.filter((product) => {
//                     const search = String(productSearch || "")
//                       .trim()
//                       .toLowerCase();

//                     if (!search) {
//                       return true;
//                     }

//                     return (
//                       String(product.productCode || "")
//                         .toLowerCase()
//                         .includes(search) ||
//                       String(product.label || "")
//                         .toLowerCase()
//                         .includes(search)
//                     );
//                   }).length === 0 && (
//                     <Box
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         color: "text.secondary",
//                       }}
//                     >
//                       No products found
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Box>

//             {/* =================================================
//                 QUANTITY + RATE + ADD
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",

//                   sm: "1fr 1fr auto",
//                 },

//                 gap: 1.5,

//                 alignItems: "end",

//                 mb: 2,
//               }}
//             >
//               {/* QUANTITY */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Quantity:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   placeholder="Enter Quantity"
//                   fullWidth
//                 />
//               </Box> */}

//               {/* RATE */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Rate:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={rate}
//                   placeholder="Rate"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box> */}

//               {/* ADD */}

//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   height: "40px",

//                   px: 2.5,

//                   textTransform: "none",

//                   background: "var(--complementary-color)",

//                   "&:hover": {
//                     background: "var(--complementary-color)",
//                   },
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 1.5,
//               }}
//             />

//             {/* =================================================
//                 PRODUCT DETAIL TABLE
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
//                       Product Code
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Name
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Rate
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         align="center"
//                         sx={{
//                           height: "75px",

//                           color: "#777",

//                           fontStyle: "italic",
//                         }}
//                       >
//                         No products added
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.map((row, index) => (
//                       <TableRow hover key={`${row.ProductId}-${index}`}>
//                         <TableCell>{row.ProductCode}</TableCell>

//                         <TableCell>{row.ProductName}</TableCell>

//                         <TableCell align="center">{row.Quantity}</TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Rate).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Amount).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 TOTAL
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
//               <Typography fontWeight={600} fontSize="14px">
//                 Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(total).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 140,
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           {/* ==================================================
//               DIALOG ACTIONS
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
//     </LocalizationProvider>
//   );
// };

// export default DailyStockEntryAtMainOffice;



























// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
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

// import { createFilterOptions } from "@mui/material/Autocomplete";

// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const DailyStockEntryAtMainOffice = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const MAIN_OFFICE_ID = 2;

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const CREATED_BY = 1;

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [shopOptions, setShopOptions] = useState([]);

//   const [selectedShop, setSelectedShop] = useState({
//     Id: MAIN_OFFICE_ID,
//     AccountName: "Main Office",
//   });

//   const [loadingShops, setLoadingShops] = useState(false);

//   const [editingEntry, setEditingEntry] = useState(null);

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productSearch, setProductSearch] = useState("");

//   // ==========================================================
//   // QUANTITY / RATE
//   // ==========================================================

//   const [quantity, setQuantity] = useState("");

//   const [rate, setRate] = useState("");

//   // ==========================================================
//   // PRODUCT DETAIL ROWS
//   // ==========================================================

//   const [rows, setRows] = useState([]);

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item?.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: item?.Id ?? "",

//           label: String(item?.ProductName ?? "").trim(),

//           productCode: item?.ProductCode ?? "",

//           rate: Number(item?.PurchasePrice ?? 0),
//         }));

//       setProductOptions(options);

//       console.log("PRODUCT API RESPONSE:", data);
//     } catch (error) {
//       console.error("Product API Error:", error);
//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleRateChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setRate(value);
//     }
//   };

//   // ============================================================
//   // FETCH DAILY STOCK HEADER BY ID
//   // ============================================================
//   const fetchDailyStockHeader = async (headerId) => {
//     try {
//       // Header ID is required
//       if (!headerId) {
//         console.error("Daily Stock Header ID is required");
//         return [];
//       }

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK HEADER RESPONSE:", result);

//       // ============================================================
//       // HANDLE API RESPONSE
//       // ============================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = [result.data];
//       } else if (result && typeof result === "object") {
//         data = [result];
//       }

//       console.log("DAILY STOCK HEADER DATA:", data);

//       // ============================================================
//       // MAP API RESPONSE FOR MAIN TABLE
//       // ============================================================

//       const mappedData = data.map((item) => ({
//         ...item,

//         // Header ID
//         id: item?.Id || item?.id || "",

//         // Date
//         dateText: item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.dateText || "",

//         // Shop Name
//         shop: item?.ShopName || item?.shop || "",

//         // Total Amount
//         total: Number(item?.TotalAmount ?? item?.total ?? 0),
//       }));

//       console.log("MAPPED DAILY STOCK HEADER DATA:", mappedData);

//       setStockEntries(mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Header API Error:", error);

//       toast.error("Daily Stock Header data could not be loaded");

//       return [];
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADERS - STOCK ENTRY SHOP
//   // ==========================================================
//   const fetchAllDailyStockHeaders = async () => {
//     try {
//       console.log("========================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("========================================");

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php",
//         {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//           redirect: "follow",
//         },
//       );

//       console.log("DAILY STOCK HEADER LIST STATUS:", response.status);

//       const rawText = await response.text();

//       console.log("DAILY STOCK HEADER LIST RAW RESPONSE:", rawText);

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header List API failed: ${response.status}`,
//         );
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : {};
//       } catch (error) {
//         console.error("DAILY STOCK HEADER LIST JSON ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER LIST RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = Array.isArray(result.data) ? result.data : [result.data];
//       }

//       console.log("DAILY STOCK HEADER LIST DATA:", data);

//       // ======================================================
//       // ONLY STOCK ENTRY SHOP
//       // ======================================================

//      // ======================================================
// // ONLY MAIN OFFICE ENTRIES
// // LocationType = "O"
// // OfficeId = MAIN_OFFICE_ID
// // ======================================================

// const officeEntries = data.filter((item) => {
//   const locationType = String(
//     item?.LocationType ??
//       item?.locationType ??
//       ""
//   )
//     .trim()
//     .toUpperCase();

//   const officeId = String(
//     item?.OfficeId ??
//       item?.officeId ??
//       item?.LocationId ??
//       item?.locationId ??
//       ""
//   ).trim();

//   return (
//     locationType === "O" &&
//     officeId === String(MAIN_OFFICE_ID)
//   );
// });

// console.log(
//   "=========================================="
// );

// console.log(
//   "MAIN OFFICE HEADER RECORDS:"
// );

// console.log(
//   "TOTAL MAIN OFFICE RECORDS:",
//   officeEntries.length
// );

// console.log(
//   "MAIN OFFICE RECORDS:",
//   officeEntries
// );

//       // ======================================================
//       // MAP DATA FOR TABLE
//       // ======================================================

//      // ======================================================
// // MAP DATA FOR MAIN OFFICE TABLE
// // ======================================================

// const mappedData = officeEntries.map((item) => ({
//   ...item,

//   // --------------------------------------------------
//   // ID
//   // --------------------------------------------------

//   Id:
//     item?.Id ??
//     item?.id ??
//     item?.DailyStockHeaderId ??
//     "",

//   id:
//     item?.Id ??
//     item?.id ??
//     item?.DailyStockHeaderId ??
//     "",

//   // --------------------------------------------------
//   // DATE
//   // --------------------------------------------------

//   EntryDate:
//     item?.EntryDate ??
//     item?.entryDate ??
//     item?.date ??
//     "",

//   dateText:
//     item?.EntryDate
//       ? formatDate(item.EntryDate)
//       : item?.entryDate
//         ? formatDate(item.entryDate)
//         : item?.date
//           ? formatDate(item.date)
//           : "",

//   // --------------------------------------------------
//   // MAIN OFFICE
//   // --------------------------------------------------

//   LocationType:
//     String(
//       item?.LocationType ??
//         item?.locationType ??
//         "O"
//     )
//       .trim()
//       .toUpperCase(),

//   LocationId:
//     item?.LocationId ??
//     item?.locationId ??
//     MAIN_OFFICE_ID,

//   OfficeId:
//     item?.OfficeId ??
//     item?.officeId ??
//     MAIN_OFFICE_ID,

//   ShopId:
//     item?.ShopId ??
//     item?.shopId ??
//     null,

//   ShopName:
//     item?.ShopName ??
//     item?.AccountName ??
//     item?.Shop ??
//     item?.shop ??
//     "Main Office",

//   shop:
//     item?.ShopName ??
//     item?.AccountName ??
//     item?.Shop ??
//     item?.shop ??
//     "Main Office",

//   // --------------------------------------------------
//   // TOTAL
//   // --------------------------------------------------

//   TotalAmount: Number(
//     item?.TotalAmount ??
//       item?.totalAmount ??
//       item?.Total ??
//       item?.total ??
//       0
//   ),

//   total: Number(
//     item?.TotalAmount ??
//       item?.totalAmount ??
//       item?.Total ??
//       item?.total ??
//       0
//   ),
// }));

// // ======================================================
// // NEWEST RECORD FIRST
// // ======================================================

// mappedData.sort((a, b) => {
//   return Number(b?.Id || 0) - Number(a?.Id || 0);
// });

// console.log(
//   "=========================================="
// );

// console.log(
//   "FINAL MAIN OFFICE LIST:"
// );

// console.log(
//   "TOTAL MAIN OFFICE RECORDS:",
//   mappedData.length
// );

// console.log(
//   "MAPPED MAIN OFFICE RECORDS:",
//   mappedData
// );

// // ======================================================
// // SET TABLE DATA
// // ======================================================

// setStockEntries(mappedData);

// // Reset pagination
// setPageNo(1);

// return mappedData;

//       // ======================================================
//       // NEWEST RECORD FIRST
//       // ======================================================

//       mappedData.sort((a, b) => {
//         const idA = Number(a?.Id || 0);
//         const idB = Number(b?.Id || 0);

//         return idB - idA;
//       });

//       console.log("FINAL STOCK ENTRY SHOP LIST:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Go to first page
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("❌ FETCH DAILY STOCK HEADER LIST ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header list could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       if (!headerId) {
//         return [];
//       }

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Detail API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK DETAIL RESPONSE:", result);

//       const data = Array.isArray(result)
//         ? result
//         : Array.isArray(result?.data)
//           ? result.data
//           : [];

//       return data;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error("Daily Stock Detail data could not be loaded");

//       return [];
//     }
//   };

//  const updateDailyStockHeader = async (
//   headerId,
//   entryDate,
//   totalAmount
// ) => {
//   try {
//     // ============================================================
//     // 1. HEADER ID
//     // ============================================================

//     const id = Number(headerId);

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // ============================================================
//     // 2. ENTRY DATE
//     // ============================================================

//     let formattedEntryDate = "";

//     if (entryDate) {
//       if (typeof entryDate === "string") {

//         // YYYY-MM-DD
//         if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//           formattedEntryDate = entryDate;
//         }

//         // DD-MM-YYYY
//         else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//           const [day, month, year] =
//             entryDate.split("-");

//           formattedEntryDate =
//             `${year}-${month}-${day}`;
//         }

//         // Other valid date
//         else {
//           const dateObj = new Date(entryDate);

//           if (!isNaN(dateObj.getTime())) {
//             formattedEntryDate =
//               dateObj.toISOString().split("T")[0];
//           }
//         }
//       }

//       // Date object
//       else if (entryDate instanceof Date) {
//         if (!isNaN(entryDate.getTime())) {
//           formattedEntryDate =
//             entryDate.toISOString().split("T")[0];
//         }
//       }
//     }

//     if (
//       !formattedEntryDate ||
//       formattedEntryDate.includes("NaN")
//     ) {
//       throw new Error(
//         `Invalid EntryDate: ${entryDate}`
//       );
//     }

//     // ============================================================
//     // 3. TOTAL AMOUNT
//     // ============================================================

//     const amount = Number(totalAmount || 0);

//     if (isNaN(amount)) {
//       throw new Error(
//         `Invalid TotalAmount: ${totalAmount}`
//       );
//     }

//     // ============================================================
//     // 4. MAIN OFFICE ID
//     // ============================================================

//     const officeId = Number(MAIN_OFFICE_ID);

//     if (
//       !Number.isInteger(officeId) ||
//       officeId <= 0
//     ) {
//       throw new Error(
//         `Invalid Main Office ID: ${MAIN_OFFICE_ID}`
//       );
//     }

//     // ============================================================
//     // 5. UPDATED BY
//     // ============================================================

//     const updatedBy = Number(CREATED_BY);

//     if (
//       !Number.isInteger(updatedBy) ||
//       updatedBy <= 0
//     ) {
//       throw new Error(
//         `Invalid UpdatedBy: ${CREATED_BY}`
//       );
//     }

//     // ============================================================
//     // 6. FORM DATA
//     // MAIN OFFICE MAPPING
//     //
//     // LocationType = O
//     // LocationId   = Main Office ID
//     // ShopId       = empty
//     // OfficeId     = Main Office ID
//     // ============================================================

//     const updateData = new URLSearchParams();

//     // Header ID
//     updateData.append(
//       "Id",
//       String(id)
//     );

//     // Entry Date
//     updateData.append(
//       "EntryDate",
//       formattedEntryDate
//     );

//     // IMPORTANT: Main Office
//     updateData.append(
//       "LocationType",
//       "O"
//     );

//     // Main Office Location ID
//     updateData.append(
//       "LocationId",
//       String(officeId)
//     );

//     // Main Office is NOT a Shop
//     updateData.append(
//       "ShopId",
//       ""
//     );

//     // Main Office ID
//     updateData.append(
//       "OfficeId",
//       String(officeId)
//     );

//     // Total
//     updateData.append(
//       "TotalAmount",
//       String(amount)
//     );

//     // Updated By
//     updateData.append(
//       "UpdatedBy",
//       String(updatedBy)
//     );

//     // ============================================================
//     // 7. DEBUG PAYLOAD
//     // ============================================================

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "MAIN OFFICE HEADER UPDATE PAYLOAD:",
//       Object.fromEntries(updateData.entries())
//     );

//     console.log(
//       "=========================================="
//     );

//     // ============================================================
//     // 8. API
//     // ============================================================

//     const apiUrl =
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//     const response = await fetch(apiUrl, {
//       method: "POST",

//       headers: {
//         "Content-Type":
//           "application/x-www-form-urlencoded;charset=UTF-8",

//         Accept: "application/json",
//       },

//       body: updateData.toString(),

//       redirect: "follow",
//     });

//     // ============================================================
//     // 9. RESPONSE STATUS
//     // ============================================================

//     console.log(
//       "HEADER UPDATE STATUS:",
//       response.status
//     );

//     // ============================================================
//     // 10. RAW RESPONSE
//     // ============================================================

//     const responseText =
//       await response.text();

//     console.log(
//       "HEADER UPDATE RAW RESPONSE:",
//       responseText
//     );

//     // ============================================================
//     // 11. JSON RESPONSE
//     // ============================================================

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch (error) {
//       throw new Error(
//         `Invalid Header Update API response: ${responseText}`
//       );
//     }

//     console.log(
//       "HEADER UPDATE RESPONSE:",
//       result
//     );

//     // ============================================================
//     // 12. HTTP ERROR
//     // ============================================================

//     if (!response.ok) {
//       throw new Error(
//         result?.message ||
//           `Header Update API failed: ${response.status}`
//       );
//     }

//     // ============================================================
//     // 13. API SUCCESS CHECK
//     // ============================================================

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//           "Daily Stock Header update failed"
//       );
//     }

//     // ============================================================
//     // 14. SUCCESS
//     // ============================================================

//     console.log(
//       "✅ MAIN OFFICE DAILY STOCK HEADER UPDATED SUCCESSFULLY"
//     );

//     console.log(
//       "UPDATED HEADER ID:",
//       id
//     );

//     console.log(
//       "UPDATED OFFICE ID:",
//       officeId
//     );

//     console.log(
//       "UPDATED TOTAL:",
//       amount
//     );

//     return result;

//   } catch (error) {

//     console.error(
//       "❌ DAILY STOCK HEADER UPDATE ERROR:",
//       error
//     );

//     throw error;
//   }
// };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

//   useEffect(() => {
//     fetchProduct();
//     fetchAllDailyStockHeaders();
//   }, []);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//   const resetForm = () => {
//     setSelectedShop({
//       Id: MAIN_OFFICE_ID,
//       AccountName: "Main Office",
//     });
//     setDate(new Date());
//     setSelectedProduct(null);
//     setQuantity("");
//     setRate("");
//     setRows([]);
//     setEditingEntry(null);
//   };

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = () => {
//     resetForm();

//     setOpenForm(true);
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
//   // PRODUCT CHANGE
//   // ==========================================================

//   const handleProductChange = (event, newValue) => {
//     setSelectedProduct(newValue);

//     if (newValue) {
//       setRate(newValue.rate);
//     } else {
//       setRate("");
//     }
//   };

//   // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================
// const handleProductTableQuantityChange = (
//   product,
//   value
// ) => {

//   // --------------------------------------------------------
//   // EMPTY QUANTITY
//   // --------------------------------------------------------
//   if (value === "") {

//     setRows((previousRows) =>
//       previousRows.filter(
//         (row) =>
//           String(row.ProductId) !==
//           String(product.value)
//       )
//     );

//     return;
//   }

//   // --------------------------------------------------------
//   // VALIDATE QUANTITY
//   // --------------------------------------------------------
//   const qty = Number(value);

//   if (isNaN(qty) || qty < 0) {
//     return;
//   }

//   const productId = String(product.value);

//   const productRate =
//     Number(product.rate || 0);

//   // --------------------------------------------------------
//   // UPDATE / INSERT
//   // --------------------------------------------------------
//   setRows((previousRows) => {

//     const existingRow =
//       previousRows.find(
//         (row) =>
//           String(row.ProductId) ===
//           productId
//       );

//     // ======================================================
//     // EXISTING → UPDATE
//     // ======================================================
//     if (existingRow) {

//       const updatedRow = {
//         ...existingRow,

//         // KEEP DETAIL ID
//         Id:
//           existingRow.Id ||
//           existingRow.id ||
//           "",

//         ProductId:
//           product.value,

//         ProductCode:
//           product.productCode || "",

//         ProductName:
//           product.label || "",

//         Quantity:
//           qty,

//         Rate:
//           productRate,

//         Amount:
//           qty * productRate,
//       };

//       return previousRows.map((row) =>
//         String(row.ProductId) === productId
//           ? updatedRow
//           : row
//       );
//     }

//     // ======================================================
//     // NEW → INSERT
//     // ======================================================
//     const newRow = {
//       Id: "",

//       ProductId:
//         product.value,

//       ProductCode:
//         product.productCode || "",

//       ProductName:
//         product.label || "",

//       Quantity:
//         qty,

//       Rate:
//         productRate,

//       Amount:
//         qty * productRate,
//     };

//     return [
//       ...previousRows,
//       newRow,
//     ];
//   });
// };

//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setQuantity(value);
//     }
//   };

//   // ==========================================================
//   // RATE CHANGE
//   // ==========================================================

//   // ==========================================================
//   // ADD PRODUCT
//   // ==========================================================

//  // ==========================================================
// // ADD / UPDATE PRODUCT
// // ==========================================================
// const handleAddProduct = () => {
//   // --------------------------------------------------------
//   // PRODUCT VALIDATION
//   // --------------------------------------------------------
//   if (!selectedProduct) {
//     toast.error("Please select a Product");
//     return;
//   }

//   // --------------------------------------------------------
//   // QUANTITY VALIDATION
//   // --------------------------------------------------------
//   const quantityValue = Number(quantity);

//   if (!quantity || quantityValue <= 0) {
//     toast.error("Please enter valid Quantity");
//     return;
//   }

//   // --------------------------------------------------------
//   // RATE
//   // --------------------------------------------------------
//   const rateValue = Number(rate || 0);

//   if (rateValue < 0) {
//     toast.error("Please enter valid Rate");
//     return;
//   }

//   const productId = String(selectedProduct.value);

//   // --------------------------------------------------------
//   // IMPORTANT:
//   // CHECK WHETHER PRODUCT ALREADY EXISTS
//   // --------------------------------------------------------
//   setRows((previousRows) => {

//     const existingRow = previousRows.find(
//       (row) =>
//         String(row.ProductId) === productId
//     );

//     // ======================================================
//     // EXISTING PRODUCT → UPDATE SAME ROW
//     // ======================================================
//     if (existingRow) {

//       const updatedRow = {
//         ...existingRow,

//         // VERY IMPORTANT
//         // Keep existing detail Id
//         Id:
//           existingRow.Id ||
//           existingRow.id ||
//           "",

//         ProductId:
//           selectedProduct.value,

//         ProductCode:
//           selectedProduct.productCode || "",

//         ProductName:
//           selectedProduct.label || "",

//         Quantity:
//           quantityValue,

//         Rate:
//           rateValue,

//         Amount:
//           quantityValue * rateValue,
//       };

//       console.log(
//         "✏️ UPDATING EXISTING PRODUCT ROW:",
//         updatedRow
//       );

//       return previousRows.map((row) =>
//         String(row.ProductId) === productId
//           ? updatedRow
//           : row
//       );
//     }

//     // ======================================================
//     // NEW PRODUCT → INSERT NEW ROW
//     // ======================================================

//     const newRow = {
//       Id: "",

//       ProductId:
//         selectedProduct.value,

//       ProductCode:
//         selectedProduct.productCode || "",

//       ProductName:
//         selectedProduct.label || "",

//       Quantity:
//         quantityValue,

//       Rate:
//         rateValue,

//       Amount:
//         quantityValue * rateValue,
//     };

//     console.log(
//       "➕ ADDING NEW PRODUCT ROW:",
//       newRow
//     );

//     return [
//       ...previousRows,
//       newRow,
//     ];
//   });

//   // --------------------------------------------------------
//   // RESET PRODUCT INPUT
//   // --------------------------------------------------------
//   setSelectedProduct(null);
//   setQuantity("");
//   setRate("");
// };

//   // ==========================================================
//   // DELETE DETAIL ROW
//   // ==========================================================

//   const handleDeleteRow = (index) => {
//     setRows((previousRows) =>
//       previousRows.filter((_, rowIndex) => rowIndex !== index),
//     );
//   };

//   // ==========================================================
//   // TOTAL
//   // ==========================================================

//   const total = useMemo(() => {
//     return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
//   }, [rows]);

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     // PHP date object response:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     // Handle: YYYY-MM-DD
//     // Handle: YYYY-MM-DD HH:mm:ss
//     // Handle: YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const [, year, month, day] = match;

//       return `${day}-${month}-${year}`;
//     }

//     // Fallback for normal JS date values
//     const d = new Date(dateString);

//     if (Number.isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
//   // ==========================================================

//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ??
//         item?.AccountName ??
//         item?.Shop ??
//         item?.shop ??
//         "Stock Entry Shop",

//       total: Number(
//         item?.TotalAmount ??
//           item?.totalAmount ??
//           item?.Total ??
//           item?.total ??
//           0,
//       ),
//     }));
//   }, [stockEntries]);

//   // ==========================================================
//   // SAVE DAILY STOCK ENTRY
//   // ==========================================================

//   const handleSave = async () => {
//     if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
//       toast.error("Please select a valid Date");
//       return;
//     }

//     if (rows.length === 0) {
//       toast.error("Please add at least one Product");
//       return;
//     }

//     try {
//       setSaving(true);

//       const entryDate = `${date.getFullYear()}-${String(
//         date.getMonth() + 1,
//       ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//       console.log("FINAL ENTRY DATE:", entryDate);

//       // ============================================
//       // EDIT EXISTING ENTRY
//       // ============================================
//       if (editingEntry) {
//         const headerId = editingEntry?.Id || editingEntry?.id;

//         if (!headerId) {
//           throw new Error("Daily Stock Header ID not found");
//         }

//         // --------------------------------------------
//         // UPDATE HEADER
//         // --------------------------------------------
//         await updateDailyStockHeader(headerId, entryDate, total);

//         console.log("DAILY STOCK HEADER UPDATED:", headerId);

//         // --------------------------------------------
//         // UPDATE / INSERT DETAILS
//         // --------------------------------------------
//         // ============================================================
//         // UPDATE / INSERT DAILY STOCK DETAILS
//         // ============================================================
//         for (const row of rows) {
//           const detailId = row?.Id || row?.id || "";

//           // ==========================================================
//           // EXISTING DETAIL -> UPDATE
//           // ==========================================================
//           if (detailId) {
//             const detailData = new URLSearchParams();

//             detailData.append("Id", String(detailId));

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("UpdatedBy", "1");

//             console.log(
//               "UPDATING DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL UPDATE STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL UPDATE RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail update failed",
//               );
//             }

//             console.log(
//               "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
//               detailResult,
//             );
//           }

//           // ==========================================================
//           // NEW DETAIL -> INSERT
//           // ==========================================================
//           else {
//             const detailData = new URLSearchParams();

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("CreatedBy", "1");

//             console.log(
//               "ADDING NEW DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL INSERT STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL INSERT RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail insert failed",
//               );
//             }

//             console.log("NEW DAILY STOCK DETAIL INSERTED:", detailResult);
//           }
//         }

//         toast.success("Main -Office Stock Entry updated successfully!");

//         setOpenForm(false);
//         resetForm();

//         // Refresh Header list
//         await fetchAllDailyStockHeaders();

//         return;
//       }

//       // ============================================
//       // NEW ENTRY
//       // ============================================

//       const headerData = new URLSearchParams();

// headerData.append(
//   "EntryDate",
//   entryDate
// );

// // ==========================================================
// // MAIN OFFICE
// // ==========================================================
// headerData.append(
//   "LocationType",
//   "O"
// );

// headerData.append(
//   "LocationId",
//   String(MAIN_OFFICE_ID)
// );

// // Main Office is NOT a Shop
// headerData.append(
//   "ShopId",
//   ""
// );

// // Main Office ID
// headerData.append(
//   "OfficeId",
//   String(MAIN_OFFICE_ID)
// );

// headerData.append(
//   "TotalAmount",
//   String(Number(total || 0))
// );

// headerData.append(
//   "CreatedBy",
//   "1"
// );

// console.log(
//   "MAIN OFFICE HEADER PAYLOAD:",
//   Object.fromEntries(headerData.entries())
// );

// const headerRequestOptions = {
//   method: "POST",
//   body: headerData,
//   redirect: "follow",
// };

//       const headerResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
//         headerRequestOptions,
//       );

//       if (!headerResponse.ok) {
//         throw new Error(
//           `Daily Stock Header API failed: ${headerResponse.status}`,
//         );
//       }

//       const headerResult = await headerResponse.json();

//       console.log("DAILY STOCK HEADER POST RESPONSE:", headerResult);

//       const headerId =
//         headerResult?.Id ||
//         headerResult?.id ||
//         headerResult?.insert_id ||
//         headerResult?.DailyStockHeaderId ||
//         headerResult?.data?.Id ||
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error("Daily Stock Header ID was not returned from API");
//       }

//       console.log("CREATED DAILY STOCK HEADER ID:", headerId);

//       // --------------------------------------------
//       // POST DETAILS
//       // --------------------------------------------
//       for (const row of rows) {
//         const detailData = new URLSearchParams();

//         detailData.append("DailyStockHeaderId", String(headerId));

//         detailData.append("ProductId", String(row.ProductId || ""));

//         detailData.append("Quantity", String(Number(row.Quantity || 0)));

//         detailData.append("Rate", String(Number(row.Rate || 0)));

//         detailData.append("Amount", String(Number(row.Amount || 0)));

//         detailData.append("CreatedBy", "1");

//         const detailRequestOptions = {
//           method: "POST",
//           body: detailData,
//           redirect: "follow",
//         };

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
//           detailRequestOptions,
//         );

//         if (!detailResponse.ok) {
//           throw new Error(
//             `Daily Stock Detail API failed: ${detailResponse.status}`,
//           );
//         }

//         const detailResult = await detailResponse.json();

//         console.log("DAILY STOCK DETAIL POST RESPONSE:", detailResult);
//       }

//       toast.success(" Stock Entry at Main Office saved successfully!");

//       setOpenForm(false);
//       resetForm();

//       // Refresh Header list
//       await fetchAllDailyStockHeaders();
//     } catch (error) {
//       console.error("Main Office Daily Stock Save Error:", error);

//       toast.error(error?.message || "Unable to save Daily Stock Entry");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================================
//   // SAFE DATE PARSER
//   // ==========================================================
//   const parseApiDate = (value) => {
//     if (!value) {
//       return null;
//     }

//     // PHP date object
//     // Example:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     if (!dateString) {
//       return null;
//     }

//     // YYYY-MM-DD
//     // YYYY-MM-DD HH:mm:ss
//     // YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const year = Number(match[1]);
//       const month = Number(match[2]);
//       const day = Number(match[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     // DD-MM-YYYY
//     const ddmmyyyy = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);

//     if (ddmmyyyy) {
//       const day = Number(ddmmyyyy[1]);
//       const month = Number(ddmmyyyy[2]);
//       const year = Number(ddmmyyyy[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     return null;
//   };

//   // ==========================================================
//   // EDIT DAILY STOCK ENTRY
//   // ==========================================================
//   const handleEditEntry = async (entry) => {
//     try {
//       console.log("EDIT DAILY STOCK HEADER:", entry);

//       // ========================================================
//       // HEADER ID
//       // ========================================================

//       const headerId = entry?.Id || entry?.id;

//       if (!headerId) {
//         toast.error("Daily Stock Header ID not found");
//         return;
//       }

//       // ========================================================
//       // SET EDITING ENTRY
//       // ========================================================

//       setEditingEntry(entry);
//       setOpenForm(true);

//       // ========================================================
//       // DATE
//       // ========================================================

//       const apiDate = entry?.EntryDate || entry?.date;

//       const parsedDate = parseApiDate(apiDate);

//       console.log("EDIT API DATE:", apiDate);

//       console.log("EDIT PARSED DATE:", parsedDate);

//       if (parsedDate) {
//         setDate(parsedDate);
//       } else {
//         // Important:
//         // Never allow invalid date to reach update API
//         toast.error("Invalid Entry Date received from API");

//         setDate(new Date());
//       }

//       // ========================================================
//       // MAIN OFFICE ALWAYS ID = 2
//       // ========================================================

//       setSelectedShop({
//         Id: MAIN_OFFICE_ID,
//         AccountName: "Main Office",
//       });

//       // ========================================================
//       // FETCH DETAILS
//       // ========================================================

//       const detailData = await fetchDailyStockDetail(headerId);

//       console.log("EDIT DAILY STOCK DETAIL:", detailData);

//       // ========================================================
//       // MAP DETAIL DATA
//       // ========================================================

//       const detailRows = detailData.map((item) => ({
//         Id: item?.Id || item?.id || "",

//         ProductId: item?.ProductId || item?.productId || 0,

//         ProductCode:
//           item?.ProductCode || item?.Code || item?.ProductCodeNo || "",

//         ProductName: item?.ProductName || item?.Name || "",

//         Quantity: Number(item?.Quantity ?? item?.quantity ?? 0),

//         Rate: Number(item?.Rate ?? item?.rate ?? 0),

//         Amount: Number(item?.Amount ?? item?.amount ?? 0),
//       }));

//       console.log("EDIT MAPPED DETAIL ROWS:", detailRows);

//       setRows(detailRows);
//     } catch (error) {
//       console.error("Edit Daily Stock Entry Error:", error);

//       toast.error("Unable to load Daily Stock Entry");
//     }
//   };

//   const handleDeleteEntry = (id) => {
//     setStockEntries((previousEntries) =>
//       previousEntries.filter((item) => item.id !== id),
//     );

//     toast.success("Entry removed successfully");
//   };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

//   const totalPages =
//     mappedStockEntries.length === 0
//       ? 0
//       : Math.ceil(mappedStockEntries.length / pageSize);

//   const paginatedStockEntries = useMemo(() => {
//     const startIndex = (pageNo - 1) * pageSize;
//     const endIndex = startIndex + pageSize;

//     return mappedStockEntries.slice(startIndex, endIndex);
//   }, [mappedStockEntries, pageNo]);

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
//           const index = mappedStockEntries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "dateText",
//         header: "Date",
//         size: 150,

//         Cell: ({ cell }) => cell.getValue(),
//       },

//       {
//         accessorKey: "shop",
//         header: "Shop",
//         size: 250,
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
//         size: 150,

//         enableSorting: false,
//         enableColumnFilter: false,

//         Cell: ({ row }) => (
//           <Box display="flex" justifyContent="center">
//             <Tooltip title="Edit">
//               <IconButton
//                 size="small"
//                 onClick={() => handleEditEntry(row.original)}
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Delete">
//               <IconButton
//                 color="error"
//                 size="small"
//                 onClick={() => handleDeleteEntry(row.original.id)}
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         ),
//       },
//     ],
//     [mappedStockEntries, handleEditEntry, handleDeleteEntry],
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
//         {/* ====================================================
//             PAGE TITLE
//         ==================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b> Stock Entry at Main Office</b>
//           </Typography>
//         </Box>

//         {/* ====================================================
//             TABLE SECTION
//         ==================================================== */}

//         <Box
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* ==================================================
//               CREATE BUTTON
//           ================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             <Button
//               sx={{
//                 background: "var(--complementary-color)",

//                 "&:hover": {
//                   background: "var(--complementary-color)",
//                 },

//                 borderRadius: "5px 5px 0 0",

//                 textTransform: "uppercase",

//                 fontSize: "16px",

//                 fontWeight: 500,

//                 px: 2.5,

//                 py: 1.5,
//               }}
//               variant="contained"
//               onClick={handleOpenForm}
//             >
//               CREATE DAILY STOCK ENTRY AT MAIN OFFICE
//             </Button>
//           </Box>

//           {/* ==================================================
//               MATERIAL REACT TABLE
//           ================================================== */}

//           <MaterialReactTable
//             columns={columns}
//             data={paginatedStockEntries}
//             enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",

//                 color: "black",

//                 fontSize: "16px",

//                 fontWeight: "bold",
//               },
//             }}
//             muiTableBodyCellProps={{
//               sx: {
//                 fontSize: "15px",
//               },
//             }}
//             muiTablePaperProps={{
//               elevation: 2,

//               sx: {
//                 borderRadius: "0 4px 4px 4px",

//                 overflow: "hidden",

//                 boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//               },
//             }}
//             muiTableContainerProps={{
//               sx: {
//                 maxHeight: "none",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 mb={1}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//                 pr={2}
//                 gap={0.5}
//               >
//                 {/* FIRST PAGE */}

//                 <FirstPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(1);
//                     }
//                   }}
//                 />

//                 {/* PREVIOUS */}

//                 <KeyboardArrowLeftIcon
//                   sx={{
//                     cursor: pageNo > 1 ? "pointer" : "default",

//                     color: pageNo > 1 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                   }}
//                 />

//                 {/* PAGE NO */}

//                 <Box ml={1}>Page No</Box>

//                 <TextField
//                   sx={{
//                     width: "65px",

//                     ml: 1,

//                     "& .MuiInputBase-input": {
//                       textAlign: "center",

//                       padding: "8px 5px",
//                     },

//                     "@media (max-width: 768px)": {
//                       width: "60px",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => {
//                     let value = Number(e.target.value);

//                     if (value < 1 || isNaN(value)) {
//                       value = 1;
//                     }

//                     if (totalPages > 0 && value > totalPages) {
//                       value = totalPages;
//                     }

//                     setPageNo(value);
//                   }}
//                   size="small"
//                 />

//                 {/* NEXT */}

//                 <KeyboardArrowRightIcon
//                   sx={{
//                     cursor: pageNo < totalPages ? "pointer" : "default",

//                     color: pageNo < totalPages ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (pageNo < totalPages) {
//                       setPageNo((prev) => Number(prev) + 1);
//                     }
//                   }}
//                 />

//                 {/* LAST PAGE */}

//                 <LastPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(totalPages);
//                     }
//                   }}
//                 />

//                 {/* TOTAL PAGES */}

//                 <Box ml={1}>Total Pages: {totalPages}</Box>
//               </Box>
//             )}
//           />
//         </Box>

//         {/* ====================================================
//             MAIN OFFICE DAILY STOCK FORM
//         ==================================================== */}

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
//               DIALOG HEADER
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
//               Stock Entry at Main Office
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
//               DIALOG CONTENT
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
//                 MAIN OFFICE + DATE
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
//               {/* MAIN OFFICE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Main Office:
//                 </Typography>

//                 <TextField
//                   value="Main Office"
//                   size="small"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box>

//               {/* DATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Date:
//                 </Typography>

//                 <DatePicker
//                   value={date}
//                   onChange={(newValue) => setDate(newValue)}
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
//                 PRODUCT
//             ================================================= */}

//             <Box
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                 Product:
//               </Typography>

//               {/* =================================================
//     PRODUCT SEARCH + PRODUCT SELECTION TABLE
// ================================================= */}

//               <Box sx={{ mb: 2 }}>
//                 {/* SEARCH */}
//                 {/* <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography> */}

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Search Product / Code"
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   sx={{ mb: 1.5 }}
//                 />

//                 {/* PRODUCT TABLE */}
//                 <Box
//                   sx={{
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                     overflow: "hidden",
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {/* TABLE HEADER */}
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                       backgroundColor: "#e9edf1",
//                       borderBottom: "1px solid #ccc",
//                       fontWeight: 700,
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Code
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Name
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "center",
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Quantity
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "right",
//                       }}
//                     >
//                       Rate
//                     </Box>
//                   </Box>

//                   {/* PRODUCT ROWS */}

//                   {productOptions
//                     .filter((product) => {
//                       const search = String(productSearch || "")
//                         .trim()
//                         .toLowerCase();

//                       if (!search) {
//                         return true;
//                       }

//                       return (
//                         String(product.productCode || "")
//                           .toLowerCase()
//                           .includes(search) ||
//                         String(product.label || "")
//                           .toLowerCase()
//                           .includes(search)
//                       );
//                     })
//                     .map((product) => {
//                       const existingRow = rows.find(
//                         (row) =>
//                           String(row.ProductId) === String(product.value),
//                       );

//                       return (
//                         <Box
//                           key={product.value}
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                             borderBottom: "1px solid #ddd",
//                             alignItems: "center",

//                             "&:hover": {
//                               backgroundColor: "#fafafa",
//                             },
//                           }}
//                         >
//                           {/* PRODUCT CODE */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               borderRight: "1px solid #ddd",
//                             }}
//                           >
//                             {product.productCode}
//                           </Box>

//                           {/* PRODUCT NAME */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               borderRight: "1px solid #ddd",
//                             }}
//                           >
//                             {product.label}
//                           </Box>

//                           {/* QUANTITY */}
//                           <Box
//                             sx={{
//                               p: 1,
//                               borderRight: "1px solid #ddd",
//                               display: "flex",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="Enter Qty"
//                               value={existingRow ? existingRow.Quantity : ""}
//                               onChange={(e) =>
//                                 handleProductTableQuantityChange(
//                                   product,
//                                   e.target.value,
//                                 )
//                               }
//                               inputProps={{
//                                 min: 0,
//                               }}
//                               sx={{
//                                 width: "150px",
//                               }}
//                             />
//                           </Box>

//                           {/* RATE */}
//                           <Box
//                             sx={{
//                               p: 1.2,
//                               textAlign: "right",
//                             }}
//                           >
//                             ₹ {Number(product.rate || 0).toFixed(2)}
//                           </Box>
//                         </Box>
//                       );
//                     })}

//                   {/* NO PRODUCT */}
//                   {productOptions.filter((product) => {
//                     const search = String(productSearch || "")
//                       .trim()
//                       .toLowerCase();

//                     if (!search) {
//                       return true;
//                     }

//                     return (
//                       String(product.productCode || "")
//                         .toLowerCase()
//                         .includes(search) ||
//                       String(product.label || "")
//                         .toLowerCase()
//                         .includes(search)
//                     );
//                   }).length === 0 && (
//                     <Box
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         color: "text.secondary",
//                       }}
//                     >
//                       No products found
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Box>

//             {/* =================================================
//                 QUANTITY + RATE + ADD
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",

//                   sm: "1fr 1fr auto",
//                 },

//                 gap: 1.5,

//                 alignItems: "end",

//                 mb: 2,
//               }}
//             >
//               {/* QUANTITY */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Quantity:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   placeholder="Enter Quantity"
//                   fullWidth
//                 />
//               </Box> */}

//               {/* RATE */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Rate:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={rate}
//                   placeholder="Rate"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box> */}

//               {/* ADD */}

//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   height: "40px",

//                   px: 2.5,

//                   textTransform: "none",

//                   background: "var(--complementary-color)",

//                   "&:hover": {
//                     background: "var(--complementary-color)",
//                   },
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 1.5,
//               }}
//             />

//             {/* =================================================
//                 PRODUCT DETAIL TABLE
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
//                       Product Code
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Name
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Rate
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         align="center"
//                         sx={{
//                           height: "75px",

//                           color: "#777",

//                           fontStyle: "italic",
//                         }}
//                       >
//                         No products added
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.map((row, index) => (
//                       <TableRow hover key={`${row.ProductId}-${index}`}>
//                         <TableCell>{row.ProductCode}</TableCell>

//                         <TableCell>{row.ProductName}</TableCell>

//                         <TableCell align="center">{row.Quantity}</TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Rate).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Amount).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 TOTAL
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
//               <Typography fontWeight={600} fontSize="14px">
//                 Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(total).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 140,
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           {/* ==================================================
//               DIALOG ACTIONS
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
//     </LocalizationProvider>
//   );
// };

// export default DailyStockEntryAtMainOffice;








































// import React, { useEffect, useMemo, useState, useRef } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
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



// import { createFilterOptions } from "@mui/material/Autocomplete";

// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const DailyStockEntryAtMainOffice = () => {



//     const quantityInputRefs = useRef({});
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const MAIN_OFFICE_ID = 2;

//   const [stockEntries, setStockEntries] = useState([]);


//   // ==========================================================
// // OLD DETAIL STATE
// // Used by existing Save / Edit / Total logic
// // ==========================================================
// const [quantity, setQuantity] = useState("");
// const [rate, setRate] = useState("");
// const [rows, setRows] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const CREATED_BY = 1;

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [shopOptions, setShopOptions] = useState([]);

//   const [selectedShop, setSelectedShop] = useState({
//     Id: MAIN_OFFICE_ID,
//     AccountName: "Main Office",
//   });

//   const [loadingShops, setLoadingShops] = useState(false);

//   const [editingEntry, setEditingEntry] = useState(null);

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productSearch, setProductSearch] = useState("");



//   const filteredProductOptions = useMemo(() => {
//   const search = String(productSearch || "")
//     .trim()
//     .toLowerCase();

//   if (!search) {
//     return productOptions;
//   }

//   return productOptions.filter((product) => {
//     const productCode = String(
//       product?.productCode || ""
//     ).toLowerCase();

//     const productName = String(
//       product?.label || ""
//     ).toLowerCase();

//     return (
//       productCode.includes(search) ||
//       productName.includes(search)
//     );
//   });
// }, [productOptions, productSearch]);














// const handleQuantityKeyDown = (
//   event,
//   currentProductId
// ) => {
//   if (event.key !== "Enter") {
//     return;
//   }

//   event.preventDefault();

//   const currentIndex =
//     filteredProductOptions.findIndex(
//       (product) =>
//         String(product.value) ===
//         String(currentProductId)
//     );

//   if (currentIndex === -1) {
//     return;
//   }

//   const nextProduct =
//     filteredProductOptions[currentIndex + 1];

//   if (!nextProduct) {
//     return;
//   }

//   const nextInput =
//     quantityInputRefs.current[
//       String(nextProduct.value)
//     ];

//   if (nextInput) {
//     requestAnimationFrame(() => {
//       nextInput.focus();
//       nextInput.select();
//     });
//   }
// };



//   // ==========================================================
//   // QUANTITY / RATE
//   // ==========================================================

//  const [productQuantities, setProductQuantities] = useState({});
// const [productRates, setProductRates] = useState({});

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;


//   const [mainOfficeCurrentStock, setMainOfficeCurrentStock] = useState({});


// const calculateDailySoldQuantity = async () => {
//   try {
//     console.log(
//       "=========================================="
//     );
//     console.log(
//       "CALCULATING TOTAL DAILY SHOP SALES"
//     );
//     console.log(
//       "=========================================="
//     );

//     // ======================================================
//     // 1. GET ALL DAILY STOCK HEADERS
//     // ======================================================

//     const headerResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!headerResponse.ok) {
//       throw new Error(
//         `Daily Stock Header API failed: ${headerResponse.status}`
//       );
//     }

//     const headerResult =
//       await headerResponse.json();

//     let headers = [];

//     if (Array.isArray(headerResult)) {
//       headers = headerResult;
//     } else if (
//       Array.isArray(headerResult?.data)
//     ) {
//       headers = headerResult.data;
//     }

//     // ======================================================
//     // 2. ONLY SHOP DAILY STOCK ENTRIES
//     //
//     // LocationType = S
//     //
//     // These are the daily sales/stock entries
//     // ======================================================

//     const shopHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//           item?.locationType ??
//           ""
//       )
//         .trim()
//         .toUpperCase();

//       return locationType === "S";
//     });

//     console.log(
//       "TOTAL SHOP DAILY STOCK HEADERS:",
//       shopHeaders.length
//     );

//     console.log(
//       "SHOP DAILY STOCK HEADERS:",
//       shopHeaders
//     );

//     // ======================================================
//     // 3. PRODUCT-WISE TOTAL SALE
//     // ======================================================

//     const soldMap = {};

//     // ======================================================
//     // 4. FETCH DETAILS OF EVERY SHOP ENTRY
//     // ======================================================

//     for (const header of shopHeaders) {

//       const headerId =
//         header?.Id ??
//         header?.id ??
//         header?.DailyStockHeaderId;

//       if (!headerId) {
//         continue;
//       }

//       try {

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//         );

//         if (!detailResponse.ok) {
//           console.warn(
//             "DETAIL API FAILED:",
//             headerId,
//             detailResponse.status
//           );

//           continue;
//         }

//         const detailResult =
//           await detailResponse.json();

//         let details = [];

//         if (Array.isArray(detailResult)) {
//           details = detailResult;
//         } else if (
//           Array.isArray(detailResult?.data)
//         ) {
//           details = detailResult.data;
//         }

//         // ==================================================
//         // PRODUCT-WISE QUANTITY
//         // ==================================================

//         details.forEach((detail) => {

//           const productId = String(
//             detail?.ProductId ??
//               detail?.productId ??
//               ""
//           ).trim();

//           if (!productId) {
//             return;
//           }

//           const quantity = Number(
//             detail?.Quantity ??
//               detail?.quantity ??
//               0
//           );

//           if (
//             !Number.isFinite(quantity) ||
//             quantity <= 0
//           ) {
//             return;
//           }

//           soldMap[productId] =
//             Number(soldMap[productId] || 0) +
//             quantity;
//         });

//       } catch (detailError) {

//         console.error(
//           `ERROR FETCHING SHOP DETAIL ${headerId}:`,
//           detailError
//         );

//         continue;
//       }
//     }

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "TOTAL SHOP SALE PRODUCT-WISE:"
//     );

//     console.log(soldMap);

//     console.log(
//       "=========================================="
//     );

//     return soldMap;

//   } catch (error) {

//     console.error(
//       "DAILY SOLD QUANTITY CALCULATION ERROR:",
//       error
//     );

//     return {};
//   }
// };





// const calculateMainOfficeOpeningStock = async () => {
//   try {
//     // ======================================================
//     // GET ALL MAIN OFFICE STOCK ENTRY HEADERS
//     // ======================================================

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!response.ok) {
//       throw new Error("Main Office Stock Header API failed");
//     }

//     const result = await response.json();

//     let headers = [];

//     if (Array.isArray(result)) {
//       headers = result;
//     } else if (Array.isArray(result?.data)) {
//       headers = result.data;
//     }

//     // ======================================================
//     // ONLY MAIN OFFICE ENTRIES
//     // ======================================================

//     const mainOfficeHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//         item?.locationType ??
//         ""
//       )
//         .trim()
//         .toUpperCase();

//       const officeId = String(
//         item?.OfficeId ??
//         item?.officeId ??
//         item?.LocationId ??
//         item?.locationId ??
//         ""
//       ).trim();

//       return (
//         locationType === "O" &&
//         officeId === String(MAIN_OFFICE_ID)
//       );
//     });

//     // ======================================================
//     // PRODUCT-WISE OPENING STOCK
//     // ======================================================

//     const openingStockMap = {};

//     for (const header of mainOfficeHeaders) {
//       const headerId =
//         header?.Id ??
//         header?.id ??
//         header?.DailyStockHeaderId;

//       if (!headerId) {
//         continue;
//       }

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//       );

//       if (!detailResponse.ok) {
//         continue;
//       }

//       const detailResult = await detailResponse.json();

//       let details = [];

//       if (Array.isArray(detailResult)) {
//         details = detailResult;
//       } else if (Array.isArray(detailResult?.data)) {
//         details = detailResult.data;
//       }

//       details.forEach((detail) => {
//         const productId = String(
//           detail?.ProductId ??
//           detail?.productId ??
//           ""
//         ).trim();

//         if (!productId) {
//           return;
//         }

//         const quantity = Number(
//           detail?.Quantity ??
//           detail?.quantity ??
//           0
//         );

//         const productName =
//           detail?.ProductName ??
//           detail?.Name ??
//           "";

//         if (!openingStockMap[productId]) {
//           openingStockMap[productId] = {
//             openingStock: 0,
//             productName,
//           };
//         }

//         openingStockMap[productId].openingStock += quantity;
//       });
//     }

//     console.log(
//       "MAIN OFFICE OPENING STOCK:",
//       openingStockMap
//     );

//     return openingStockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE OPENING STOCK ERROR:",
//       error
//     );

//     return {};
//   }
// };













// const calculateMainOfficeCurrentStock = async () => {
//   try {
//     // ======================================================
//     // 1. GET MAIN OFFICE OPENING STOCK
//     // ======================================================

//     const openingStockMap =
//       await calculateMainOfficeOpeningStock();

//     // ======================================================
//     // 2. GET TOTAL DAILY SALES
//     // ======================================================

//     const soldMap =
//       await calculateDailySoldQuantity();

//     // ======================================================
//     // 3. CALCULATE CURRENT STOCK
//     // ======================================================

//     const currentStockMap = {};

//     Object.keys(openingStockMap).forEach((productId) => {
//       const openingStock = Number(
//         openingStockMap[productId]?.openingStock || 0
//       );

//       const totalSold = Number(
//         soldMap[productId] || 0
//       );

//       // IMPORTANT:
//       // Negative value is allowed.
//       //
//       // 200 - 50 = 150
//       // 200 - 150 = 50
//       // 200 - 210 = -10

//       const currentStock =
//         openingStock - totalSold;

//       currentStockMap[productId] = {
//         productName:
//           openingStockMap[productId]?.productName || "",

//         openingStock,

//         totalSold,

//         currentStock,
//       };
//     });

//     // ======================================================
//     // SAVE CURRENT STOCK IN STATE
//     // ======================================================

//     setMainOfficeCurrentStock(currentStockMap);

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "MAIN OFFICE CURRENT STOCK:"
//     );

//     console.log(currentStockMap);

//     console.log(
//       "=========================================="
//     );

//     // ======================================================
//     // CHECK STOCK
//     // ======================================================

//     checkMainOfficeStock(currentStockMap);

//     return currentStockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE CURRENT STOCK ERROR:",
//       error
//     );

//     return {};
//   }
// };






// const checkMainOfficeStock = (stockMap) => {

//   Object.values(stockMap).forEach((product) => {

//     const currentStock =
//       Number(product?.currentStock ?? 0);

//     const productName =
//       product?.productName || "Product";

//     // ====================================================
//     // STOCK FINISHED
//     // ====================================================

//     if (currentStock === 0) {

//       toast.warning(
//         `${productName} stock is finished.`
//       );

//       return;
//     }

//     // ====================================================
//     // STOCK NEGATIVE
//     // ====================================================

//     if (currentStock < 0) {

//       toast.error(
//         `${productName} stock is less. Shortage: ${Math.abs(
//           currentStock
//         )}`
//       );

//       return;
//     }

//     // ====================================================
//     // LOW STOCK
//     // ====================================================

//     if (currentStock > 0 && currentStock <= 10) {

//       toast.warning(
//         `${productName} stock is low. Available: ${currentStock}`
//       );
//     }
//   });
// };


//   // ==========================================================
//   // FETCH PRODUCT
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item?.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: item?.Id ?? "",

//           label: String(item?.ProductName ?? "").trim(),

//           productCode: item?.ProductCode ?? "",

//           rate: Number(item?.PurchasePrice ?? 0),
//         }));

//       setProductOptions(options);

//       console.log("PRODUCT API RESPONSE:", data);
//     } catch (error) {
//       console.error("Product API Error:", error);
//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleRateChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setRate(value);
//     }
//   };

//   // ============================================================
//   // FETCH DAILY STOCK HEADER BY ID
//   // ============================================================
//   const fetchDailyStockHeader = async (headerId) => {
//     try {
//       // Header ID is required
//       if (!headerId) {
//         console.error("Daily Stock Header ID is required");
//         return [];
//       }

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK HEADER RESPONSE:", result);

//       // ============================================================
//       // HANDLE API RESPONSE
//       // ============================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = [result.data];
//       } else if (result && typeof result === "object") {
//         data = [result];
//       }

//       console.log("DAILY STOCK HEADER DATA:", data);

//       // ============================================================
//       // MAP API RESPONSE FOR MAIN TABLE
//       // ============================================================

//       const mappedData = data.map((item) => ({
//         ...item,

//         // Header ID
//         id: item?.Id || item?.id || "",

//         // Date
//         dateText: item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.dateText || "",

//         // Shop Name
//         shop: item?.ShopName || item?.shop || "",

//         // Total Amount
//         total: Number(item?.TotalAmount ?? item?.total ?? 0),
//       }));

//       console.log("MAPPED DAILY STOCK HEADER DATA:", mappedData);

//       setStockEntries(mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Header API Error:", error);

//       toast.error("Daily Stock Header data could not be loaded");

//       return [];
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADERS - STOCK ENTRY SHOP
//   // ==========================================================
//   const fetchAllDailyStockHeaders = async () => {
//     try {
//       console.log("========================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("========================================");

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php",
//         {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//           redirect: "follow",
//         },
//       );

//       console.log("DAILY STOCK HEADER LIST STATUS:", response.status);

//       const rawText = await response.text();

//       console.log("DAILY STOCK HEADER LIST RAW RESPONSE:", rawText);

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header List API failed: ${response.status}`,
//         );
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : {};
//       } catch (error) {
//         console.error("DAILY STOCK HEADER LIST JSON ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER LIST RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = Array.isArray(result.data) ? result.data : [result.data];
//       }

//       console.log("DAILY STOCK HEADER LIST DATA:", data);

//       // ======================================================
//       // ONLY STOCK ENTRY SHOP
//       // ======================================================

//      // ======================================================
// // ONLY MAIN OFFICE ENTRIES
// // LocationType = "O"
// // OfficeId = MAIN_OFFICE_ID
// // ======================================================

// const officeEntries = data.filter((item) => {
//   const locationType = String(
//     item?.LocationType ??
//       item?.locationType ??
//       ""
//   )
//     .trim()
//     .toUpperCase();

//   const officeId = String(
//     item?.OfficeId ??
//       item?.officeId ??
//       item?.LocationId ??
//       item?.locationId ??
//       ""
//   ).trim();

//   return (
//     locationType === "O" &&
//     officeId === String(MAIN_OFFICE_ID)
//   );
// });

// console.log(
//   "=========================================="
// );

// console.log(
//   "MAIN OFFICE HEADER RECORDS:"
// );

// console.log(
//   "TOTAL MAIN OFFICE RECORDS:",
//   officeEntries.length
// );

// console.log(
//   "MAIN OFFICE RECORDS:",
//   officeEntries
// );

//       // ======================================================
//       // MAP DATA FOR TABLE
//       // ======================================================

//      // ======================================================
// // MAP DATA FOR MAIN OFFICE TABLE
// // ======================================================

// const mappedData = officeEntries.map((item) => ({
//   ...item,

//   // --------------------------------------------------
//   // ID
//   // --------------------------------------------------

//   Id:
//     item?.Id ??
//     item?.id ??
//     item?.DailyStockHeaderId ??
//     "",

//   id:
//     item?.Id ??
//     item?.id ??
//     item?.DailyStockHeaderId ??
//     "",

//   // --------------------------------------------------
//   // DATE
//   // --------------------------------------------------

//   EntryDate:
//     item?.EntryDate ??
//     item?.entryDate ??
//     item?.date ??
//     "",

//   dateText:
//     item?.EntryDate
//       ? formatDate(item.EntryDate)
//       : item?.entryDate
//         ? formatDate(item.entryDate)
//         : item?.date
//           ? formatDate(item.date)
//           : "",

//   // --------------------------------------------------
//   // MAIN OFFICE
//   // --------------------------------------------------

//   LocationType:
//     String(
//       item?.LocationType ??
//         item?.locationType ??
//         "O"
//     )
//       .trim()
//       .toUpperCase(),

//   LocationId:
//     item?.LocationId ??
//     item?.locationId ??
//     MAIN_OFFICE_ID,

//   OfficeId:
//     item?.OfficeId ??
//     item?.officeId ??
//     MAIN_OFFICE_ID,

//   ShopId:
//     item?.ShopId ??
//     item?.shopId ??
//     null,

//   ShopName:
//     item?.ShopName ??
//     item?.AccountName ??
//     item?.Shop ??
//     item?.shop ??
//     "Main Office",

//   shop:
//     item?.ShopName ??
//     item?.AccountName ??
//     item?.Shop ??
//     item?.shop ??
//     "Main Office",

//   // --------------------------------------------------
//   // TOTAL
//   // --------------------------------------------------

//   TotalAmount: Number(
//     item?.TotalAmount ??
//       item?.totalAmount ??
//       item?.Total ??
//       item?.total ??
//       0
//   ),

//   total: Number(
//     item?.TotalAmount ??
//       item?.totalAmount ??
//       item?.Total ??
//       item?.total ??
//       0
//   ),
// }));

// // ======================================================
// // NEWEST RECORD FIRST
// // ======================================================

// mappedData.sort((a, b) => {
//   return Number(b?.Id || 0) - Number(a?.Id || 0);
// });

// console.log(
//   "=========================================="
// );

// console.log(
//   "FINAL MAIN OFFICE LIST:"
// );

// console.log(
//   "TOTAL MAIN OFFICE RECORDS:",
//   mappedData.length
// );

// console.log(
//   "MAPPED MAIN OFFICE RECORDS:",
//   mappedData
// );

// // ======================================================
// // SET TABLE DATA
// // ======================================================

// setStockEntries(mappedData);

// // Reset pagination
// setPageNo(1);

// return mappedData;

//       // ======================================================
//       // NEWEST RECORD FIRST
//       // ======================================================

    
//     } catch (error) {
//       console.error("❌ FETCH DAILY STOCK HEADER LIST ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header list could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   // ==========================================================
// // FETCH DAILY STOCK DETAIL BY HEADER ID
// // ==========================================================
// const fetchDailyStockDetail = async (headerId) => {
//   try {
//     const id = Number(headerId);

//     console.log(
//       "======================================"
//     );
//     console.log(
//       "FETCH DAILY STOCK DETAIL"
//     );
//     console.log(
//       "HEADER ID:",
//       id
//     );
//     console.log(
//       "======================================"
//     );

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // IMPORTANT
//     // Use DailyStockHeaderId for Edit/Detail GET
//     const url =
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php` +
//       `?DailyStockHeaderId=${encodeURIComponent(id)}`;

//     console.log(
//       "DAILY STOCK DETAIL GET URL:",
//       url
//     );

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//       redirect: "follow",
//     });

//     console.log(
//       "DAILY STOCK DETAIL STATUS:",
//       response.status
//     );

//     const responseText =
//       await response.text();

//     console.log(
//       "DAILY STOCK DETAIL RAW RESPONSE:",
//       responseText
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Detail API failed: ${response.status}`
//       );
//     }

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch {
//       throw new Error(
//         `Invalid Daily Stock Detail API response: ${responseText}`
//       );
//     }

//     console.log(
//       "DAILY STOCK DETAIL PARSED RESPONSE:",
//       result
//     );

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//         "Daily Stock Detail data could not be loaded"
//       );
//     }

//     let data = [];

//     if (Array.isArray(result)) {
//       data = result;
//     } else if (Array.isArray(result?.data)) {
//       data = result.data;
//     } else if (
//       result?.data &&
//       typeof result.data === "object"
//     ) {
//       data = [result.data];
//     } else if (
//       result &&
//       typeof result === "object" &&
//       result?.Id
//     ) {
//       data = [result];
//     }

//     console.log(
//       "FINAL DAILY STOCK DETAIL DATA:",
//       data
//     );

//     return data;

//   } catch (error) {
//     console.error(
//       "DAILY STOCK DETAIL FETCH ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//       "Daily Stock Detail data could not be loaded"
//     );

//     return [];
//   }
// };

//   // ==========================================================
// // DELETE DAILY STOCK DETAIL
// // ==========================================================
// const deleteDailyStockDetail = async (detailId) => {
//   if (!detailId) {
//     throw new Error("Daily Stock Detail ID not found");
//   }

//   const deleteUrl =
//     `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//     `?Table=dailystockdetail&Id=${encodeURIComponent(detailId)}`;

//   console.log("======================================");
//   console.log("DELETE DAILY STOCK DETAIL");
//   console.log("DETAIL ID:", detailId);
//   console.log("DELETE URL:", deleteUrl);
//   console.log("======================================");

//   const response = await fetch(deleteUrl, {
//     method: "GET",
//     redirect: "follow",
//   });

//   const responseText = await response.text();

//   console.log(
//     "DELETE DETAIL API STATUS:",
//     response.status
//   );

//   console.log(
//     "DELETE DETAIL API RESPONSE:",
//     responseText
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Daily Stock Detail Delete API failed: ${response.status}`
//     );
//   }

//   let result = {};

//   try {
//     result = responseText
//       ? JSON.parse(responseText)
//       : {};
//   } catch {
//     result = {};
//   }

//   if (result?.success === false) {
//     throw new Error(
//       result?.message ||
//       "Daily Stock Detail delete failed"
//     );
//   }

//   console.log(
//     "DAILY STOCK DETAIL DELETED SUCCESSFULLY:",
//     detailId
//   );

//   return true;
// };

//  const updateDailyStockHeader = async (
//   headerId,
//   entryDate,
//   totalAmount
// ) => {
//   try {
//     // ============================================================
//     // 1. HEADER ID
//     // ============================================================

//     const id = Number(headerId);

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // ============================================================
//     // 2. ENTRY DATE
//     // ============================================================

//     let formattedEntryDate = "";

//     if (entryDate) {
//       if (typeof entryDate === "string") {

//         // YYYY-MM-DD
//         if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//           formattedEntryDate = entryDate;
//         }

//         // DD-MM-YYYY
//         else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//           const [day, month, year] =
//             entryDate.split("-");

//           formattedEntryDate =
//             `${year}-${month}-${day}`;
//         }

//         // Other valid date
//         else {
//           const dateObj = new Date(entryDate);

//           if (!isNaN(dateObj.getTime())) {
//             formattedEntryDate =
//               dateObj.toISOString().split("T")[0];
//           }
//         }
//       }

//       // Date object
//       else if (entryDate instanceof Date) {
//         if (!isNaN(entryDate.getTime())) {
//           formattedEntryDate =
//             entryDate.toISOString().split("T")[0];
//         }
//       }
//     }

//     if (
//       !formattedEntryDate ||
//       formattedEntryDate.includes("NaN")
//     ) {
//       throw new Error(
//         `Invalid EntryDate: ${entryDate}`
//       );
//     }

//     // ============================================================
//     // 3. TOTAL AMOUNT
//     // ============================================================

//     const amount = Number(totalAmount || 0);

//     if (isNaN(amount)) {
//       throw new Error(
//         `Invalid TotalAmount: ${totalAmount}`
//       );
//     }

//     // ============================================================
//     // 4. MAIN OFFICE ID
//     // ============================================================

//     const officeId = Number(MAIN_OFFICE_ID);

//     if (
//       !Number.isInteger(officeId) ||
//       officeId <= 0
//     ) {
//       throw new Error(
//         `Invalid Main Office ID: ${MAIN_OFFICE_ID}`
//       );
//     }

//     // ============================================================
//     // 5. UPDATED BY
//     // ============================================================

//     const updatedBy = Number(CREATED_BY);

//     if (
//       !Number.isInteger(updatedBy) ||
//       updatedBy <= 0
//     ) {
//       throw new Error(
//         `Invalid UpdatedBy: ${CREATED_BY}`
//       );
//     }

//     // ============================================================
//     // 6. FORM DATA
//     // MAIN OFFICE MAPPING
//     //
//     // LocationType = O
//     // LocationId   = Main Office ID
//     // ShopId       = empty
//     // OfficeId     = Main Office ID
//     // ============================================================

//     const updateData = new URLSearchParams();

//     // Header ID
//     updateData.append(
//       "Id",
//       String(id)
//     );

//     // Entry Date
//     updateData.append(
//       "EntryDate",
//       formattedEntryDate
//     );

//     // IMPORTANT: Main Office
//     updateData.append(
//       "LocationType",
//       "O"
//     );

//     // Main Office Location ID
//     updateData.append(
//       "LocationId",
//       String(officeId)
//     );

//     // Main Office is NOT a Shop
//     updateData.append(
//       "ShopId",
//       ""
//     );

//     // Main Office ID
//     updateData.append(
//       "OfficeId",
//       String(officeId)
//     );

//     // Total
//     updateData.append(
//       "TotalAmount",
//       String(amount)
//     );

//     // Updated By
//     updateData.append(
//       "UpdatedBy",
//       String(updatedBy)
//     );

//     // ============================================================
//     // 7. DEBUG PAYLOAD
//     // ============================================================

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "MAIN OFFICE HEADER UPDATE PAYLOAD:",
//       Object.fromEntries(updateData.entries())
//     );

//     console.log(
//       "=========================================="
//     );

//     // ============================================================
//     // 8. API
//     // ============================================================

//     const apiUrl =
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//     const response = await fetch(apiUrl, {
//       method: "POST",

//       headers: {
//         "Content-Type":
//           "application/x-www-form-urlencoded;charset=UTF-8",

//         Accept: "application/json",
//       },

//       body: updateData.toString(),

//       redirect: "follow",
//     });

//     // ============================================================
//     // 9. RESPONSE STATUS
//     // ============================================================

//     console.log(
//       "HEADER UPDATE STATUS:",
//       response.status
//     );

//     // ============================================================
//     // 10. RAW RESPONSE
//     // ============================================================

//     const responseText =
//       await response.text();

//     console.log(
//       "HEADER UPDATE RAW RESPONSE:",
//       responseText
//     );

//     // ============================================================
//     // 11. JSON RESPONSE
//     // ============================================================

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch (error) {
//       throw new Error(
//         `Invalid Header Update API response: ${responseText}`
//       );
//     }

//     console.log(
//       "HEADER UPDATE RESPONSE:",
//       result
//     );

//     // ============================================================
//     // 12. HTTP ERROR
//     // ============================================================

//     if (!response.ok) {
//       throw new Error(
//         result?.message ||
//           `Header Update API failed: ${response.status}`
//       );
//     }

//     // ============================================================
//     // 13. API SUCCESS CHECK
//     // ============================================================

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//           "Daily Stock Header update failed"
//       );
//     }

//     // ============================================================
//     // 14. SUCCESS
//     // ============================================================

//     console.log(
//       "✅ MAIN OFFICE DAILY STOCK HEADER UPDATED SUCCESSFULLY"
//     );

//     console.log(
//       "UPDATED HEADER ID:",
//       id
//     );

//     console.log(
//       "UPDATED OFFICE ID:",
//       officeId
//     );

//     console.log(
//       "UPDATED TOTAL:",
//       amount
//     );

//     return result;

//   } catch (error) {

//     console.error(
//       "❌ DAILY STOCK HEADER UPDATE ERROR:",
//       error
//     );

//     throw error;
//   }
// };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

// useEffect(() => {
//   fetchProduct();
//   fetchAllDailyStockHeaders();
//   calculateMainOfficeCurrentStock();
// }, []);




// useEffect(() => {
//   if (!productOptions.length) {
//     return;
//   }

//   setProductRates((previous) => {
//     const updated = {
//       ...previous,
//     };

//     productOptions.forEach((product) => {
//       const productId =
//         String(product.value);

//       if (updated[productId] === undefined) {
//         updated[productId] =
//           Number(product.rate || 0);
//       }
//     });

//     return updated;
//   });
// }, [productOptions]);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//   const resetForm = () => {
//     setSelectedShop({
//       Id: MAIN_OFFICE_ID,
//       AccountName: "Main Office",
//     });
//     setDate(new Date());
//     setSelectedProduct(null);
//     setQuantity("");
//     setRate("");
//     setRows([]);
//     setEditingEntry(null);
//     setProductQuantities({});
// setProductRates({});
//   };

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = () => {
//     resetForm();

//     setOpenForm(true);
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
//   // PRODUCT CHANGE
//   // ==========================================================

//   const handleProductChange = (event, newValue) => {
//     setSelectedProduct(newValue);

//     if (newValue) {
//       setRate(newValue.rate);
//     } else {
//       setRate("");
//     }
//   };

//   // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================

// // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================
// // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================
// const handleProductQuantityChange = (
//   productId,
//   value
// ) => {
//   const key = String(productId);

//   // ========================================================
//   // 1. UPDATE PRODUCT QUANTITY STATE
//   // ========================================================
//   setProductQuantities((previous) => {
//     const existing =
//       previous[key];

//     return {
//       ...previous,

//       [key]: {
//         ...(existing &&
//         typeof existing === "object"
//           ? existing
//           : {}),

//         quantity: value,
//       },
//     };
//   });

//   // ========================================================
//   // 2. UPDATE LOWER DETAIL TABLE ALSO
//   // ========================================================
//   setRows((previousRows) => {
//     const product =
//       productOptions.find(
//         (item) =>
//           String(item.value) === key
//       );

//     if (!product) {
//       return previousRows;
//     }

//     // ======================================================
//     // BLANK OR ZERO
//     // ======================================================
//     if (
//       value === "" ||
//       Number(value) <= 0
//     ) {
//       return previousRows.filter(
//         (row) =>
//           String(row.ProductId) !== key
//       );
//     }

//     const quantityValue =
//       Number(value);

//     const rateValue =
//       Number(
//         productRates?.[key] ??
//         product.rate ??
//         0
//       );

//     // ======================================================
//     // CHECK EXISTING DETAIL ROW
//     // ======================================================
//     const existingRow =
//       previousRows.find(
//         (row) =>
//           String(row.ProductId) === key
//       );

//     // ======================================================
//     // UPDATE EXISTING DETAIL
//     // ======================================================
//     if (existingRow) {
//       return previousRows.map((row) =>
//         String(row.ProductId) === key
//           ? {
//               ...row,

//               // KEEP DATABASE DETAIL ID
//               Id:
//                 row.Id ||
//                 row.id ||
//                 "",

//               ProductId:
//                 product.value,

//               ProductCode:
//                 product.productCode ||
//                 "",

//               ProductName:
//                 product.label ||
//                 "",

//               Quantity:
//                 quantityValue,

//               Rate:
//                 rateValue,

//               Amount:
//                 quantityValue *
//                 rateValue,
//             }
//           : row
//       );
//     }

//     // ======================================================
//     // NEW DETAIL
//     // ======================================================
//     return [
//       ...previousRows,

//       {
//         Id: "",

//         ProductId:
//           product.value,

//         ProductCode:
//           product.productCode ||
//           "",

//         ProductName:
//           product.label ||
//           "",

//         Quantity:
//           quantityValue,

//         Rate:
//           rateValue,

//         Amount:
//           quantityValue *
//           rateValue,
//       },
//     ];
//   });
// };
//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setQuantity(value);
//     }
//   };

//   // ==========================================================
//   // RATE CHANGE
//   // ==========================================================

  

// // ==========================================================
// // ADD / UPDATE PRODUCTS FROM PRODUCT TABLE
// // ==========================================================
// const handleAddProduct = () => {
//   try {
//     const selectedRows =
//       productOptions
//         .map((product) => {
//           const productId =
//             String(product.value);

//           const savedValue =
//             productQuantities?.[
//               productId
//             ];

//           // ------------------------------------------------
//           // QUANTITY
//           // ------------------------------------------------
//           const quantityValue =
//             savedValue &&
//             typeof savedValue ===
//               "object"
//               ? Number(
//                   savedValue?.quantity ||
//                     0
//                 )
//               : Number(
//                   savedValue || 0
//                 );

//           // ------------------------------------------------
//           // RATE
//           // ------------------------------------------------
//           const rateValue =
//             productRates?.[
//               productId
//             ] !== undefined
//               ? Number(
//                   productRates[
//                     productId
//                   ] || 0
//                 )
//               : Number(
//                   product.rate || 0
//                 );

//           // ------------------------------------------------
//           // EXISTING DETAIL ID
//           // ------------------------------------------------
//           const detailId =
//             savedValue &&
//             typeof savedValue ===
//               "object"
//               ? savedValue?.detailId ||
//                 ""
//               : "";

//           return {
//             Id: detailId,

//             ProductId:
//               product.value,

//             ProductCode:
//               product.productCode ||
//               "",

//             ProductName:
//               product.label ||
//               "",

//             Quantity:
//               quantityValue,

//             Rate:
//               rateValue,

//             Amount:
//               quantityValue *
//               rateValue,
//           };
//         })

//         .filter(
//           (row) =>
//             Number(row.Quantity) >
//               0 ||
//             row.Id
//         );

//     // ------------------------------------------------------
//     // VALIDATION
//     // ------------------------------------------------------
//     if (
//       selectedRows.length === 0
//     ) {
//       toast.error(
//         "Please enter Quantity for at least one Product"
//       );

//       return;
//     }

//     // ------------------------------------------------------
//     // UPDATE DETAIL TABLE
//     // ------------------------------------------------------
//     setRows(
//       selectedRows
//     );

//     console.log(
//       "FINAL DETAIL ROWS:",
//       selectedRows
//     );

//     toast.success(
//       "Products added successfully"
//     );

//   } catch (error) {
//     console.error(
//       "ADD PRODUCT ERROR:",
//       error
//     );

//     toast.error(
//       "Unable to add products"
//     );
//   }
// };

//   // ==========================================================
//   // DELETE DETAIL ROW
//   // ==========================================================

//  // ==========================================================
// // DELETE PRODUCT FROM DETAIL TABLE
// // ==========================================================
// const handleDeleteRow = (index) => {
//   let deletedProductId = "";

//   setRows((previousRows) => {
//     const row =
//       previousRows[index];

//     deletedProductId =
//       row?.ProductId || "";

//     return previousRows.filter(
//       (_, rowIndex) =>
//         rowIndex !== index
//     );
//   });

//   // ========================================================
//   // REMOVE FROM PRODUCT QUANTITY STATE
//   // ========================================================
//   if (deletedProductId) {
//     const key =
//       String(deletedProductId);

//     setProductQuantities(
//       (previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[key];

//         return updated;
//       }
//     );
//   }
// };

//   // ==========================================================
//   // TOTAL
//   // ==========================================================

//   const total = useMemo(() => {
//     return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
//   }, [rows]);

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     // PHP date object response:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     // Handle: YYYY-MM-DD
//     // Handle: YYYY-MM-DD HH:mm:ss
//     // Handle: YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const [, year, month, day] = match;

//       return `${day}-${month}-${year}`;
//     }

//     // Fallback for normal JS date values
//     const d = new Date(dateString);

//     if (Number.isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
//   // ==========================================================

//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ??
//         item?.AccountName ??
//         item?.Shop ??
//         item?.shop ??
//         "Stock Entry Shop",

//       total: Number(
//         item?.TotalAmount ??
//           item?.totalAmount ??
//           item?.Total ??
//           item?.total ??
//           0,
//       ),
//     }));
//   }, [stockEntries]);

//   // ==========================================================
//   // SAVE DAILY STOCK ENTRY
//   // ==========================================================

//   const handleSave = async () => {
//     if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
//       toast.error("Please select a valid Date");
//       return;
//     }

//     if (rows.length === 0) {
//       toast.error("Please add at least one Product");
//       return;
//     }

//     try {
//       setSaving(true);

//       const entryDate = `${date.getFullYear()}-${String(
//         date.getMonth() + 1,
//       ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//       console.log("FINAL ENTRY DATE:", entryDate);

//       // ============================================
//       // EDIT EXISTING ENTRY
//       // ============================================
//       if (editingEntry) {
//         const headerId = editingEntry?.Id || editingEntry?.id;

//         // ============================================================
// // FETCH OLD DETAILS BEFORE EDIT
// // ============================================================

// const existingDetailData =
//   await fetchDailyStockDetail(headerId);

// console.log(
//   "EXISTING DETAILS BEFORE EDIT:",
//   existingDetailData
// );

// // ============================================================
// // EXISTING DATABASE DETAIL IDS
// // ============================================================

// const existingDetailIds =
//   existingDetailData
//     .map((item) =>
//       Number(item?.Id || item?.id)
//     )
//     .filter(
//       (id) =>
//         Number.isInteger(id) &&
//         id > 0
//     );

// // ============================================================
// // CURRENT DETAILS STILL PRESENT IN UI
// // ============================================================

// const currentDetailIds =
//   rows
//     .map((row) =>
//       Number(row?.Id || row?.id)
//     )
//     .filter(
//       (id) =>
//         Number.isInteger(id) &&
//         id > 0
//     );

// // ============================================================
// // FIND REMOVED DETAILS
// // ============================================================

// const deletedDetailIds =
//   existingDetailIds.filter(
//     (existingId) =>
//       !currentDetailIds.includes(existingId)
//   );

// console.log(
//   "DETAIL IDS REMOVED DURING EDIT:",
//   deletedDetailIds
// );

// // ============================================================
// // DELETE REMOVED DETAILS FROM DATABASE
// // ============================================================

// for (const deletedDetailId of deletedDetailIds) {
//   await deleteDailyStockDetail(
//     deletedDetailId
//   );
// }

//         if (!headerId) {
//           throw new Error("Daily Stock Header ID not found");
//         }

//         // --------------------------------------------
//         // UPDATE HEADER
//         // --------------------------------------------
//         await updateDailyStockHeader(headerId, entryDate, total);

//         console.log("DAILY STOCK HEADER UPDATED:", headerId);

//         // --------------------------------------------
//         // UPDATE / INSERT DETAILS
//         // --------------------------------------------
//         // ============================================================
//         // UPDATE / INSERT DAILY STOCK DETAILS
//         // ============================================================
//         for (const row of rows) {
//           const detailId = row?.Id || row?.id || "";

//           // ==========================================================
//           // EXISTING DETAIL -> UPDATE
//           // ==========================================================
//           if (detailId) {
//             const detailData = new URLSearchParams();

//             detailData.append("Id", String(detailId));

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("UpdatedBy", "1");

//             console.log(
//               "UPDATING DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL UPDATE STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL UPDATE RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail update failed",
//               );
//             }

//             console.log(
//               "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
//               detailResult,
//             );
//           }

//           // ==========================================================
//           // NEW DETAIL -> INSERT
//           // ==========================================================
//           else {
//             const detailData = new URLSearchParams();

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("CreatedBy", "1");

//             console.log(
//               "ADDING NEW DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL INSERT STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL INSERT RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail insert failed",
//               );
//             }

//             console.log("NEW DAILY STOCK DETAIL INSERTED:", detailResult);
//           }
//         }

//         toast.success("Main -Office Stock Entry updated successfully!");

//         setOpenForm(false);
//         resetForm();

//         // Refresh Header list
// await fetchAllDailyStockHeaders();
// await calculateMainOfficeCurrentStock();

// return;
//       }

//       // ============================================
//       // NEW ENTRY
//       // ============================================

//       const headerData = new URLSearchParams();

// headerData.append(
//   "EntryDate",
//   entryDate
// );

// // ==========================================================
// // MAIN OFFICE
// // ==========================================================
// headerData.append(
//   "LocationType",
//   "O"
// );

// headerData.append(
//   "LocationId",
//   String(MAIN_OFFICE_ID)
// );

// // Main Office is NOT a Shop
// headerData.append(
//   "ShopId",
//   ""
// );

// // Main Office ID
// headerData.append(
//   "OfficeId",
//   String(MAIN_OFFICE_ID)
// );

// headerData.append(
//   "TotalAmount",
//   String(Number(total || 0))
// );

// headerData.append(
//   "CreatedBy",
//   "1"
// );

// console.log(
//   "MAIN OFFICE HEADER PAYLOAD:",
//   Object.fromEntries(headerData.entries())
// );

// const headerRequestOptions = {
//   method: "POST",
//   body: headerData,
//   redirect: "follow",
// };

//       const headerResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
//         headerRequestOptions,
//       );

//       if (!headerResponse.ok) {
//         throw new Error(
//           `Daily Stock Header API failed: ${headerResponse.status}`,
//         );
//       }

//       const headerResult = await headerResponse.json();

//       console.log("DAILY STOCK HEADER POST RESPONSE:", headerResult);

//       const headerId =
//         headerResult?.Id ||
//         headerResult?.id ||
//         headerResult?.insert_id ||
//         headerResult?.DailyStockHeaderId ||
//         headerResult?.data?.Id ||
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error("Daily Stock Header ID was not returned from API");
//       }

//       console.log("CREATED DAILY STOCK HEADER ID:", headerId);

//       // --------------------------------------------
//       // POST DETAILS
//       // --------------------------------------------
//       for (const row of rows) {
//         const detailData = new URLSearchParams();

//         detailData.append("DailyStockHeaderId", String(headerId));

//         detailData.append("ProductId", String(row.ProductId || ""));

//         detailData.append("Quantity", String(Number(row.Quantity || 0)));

//         detailData.append("Rate", String(Number(row.Rate || 0)));

//         detailData.append("Amount", String(Number(row.Amount || 0)));

//         detailData.append("CreatedBy", "1");

//         const detailRequestOptions = {
//           method: "POST",
//           body: detailData,
//           redirect: "follow",
//         };

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
//           detailRequestOptions,
//         );

//         if (!detailResponse.ok) {
//           throw new Error(
//             `Daily Stock Detail API failed: ${detailResponse.status}`,
//           );
//         }

//         const detailResult = await detailResponse.json();

//         console.log("DAILY STOCK DETAIL POST RESPONSE:", detailResult);
//       }

//       toast.success(" Stock Entry at Main Office saved successfully!");

//      setOpenForm(false);
// resetForm();

// // Refresh Header list
// await fetchAllDailyStockHeaders();

// // Recalculate Main Office Current Stock
// await calculateMainOfficeCurrentStock();

//       // Refresh Header list
     
//     } catch (error) {
//       console.error("Main Office Daily Stock Save Error:", error);

//       toast.error(error?.message || "Unable to save Daily Stock Entry");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================================
//   // SAFE DATE PARSER
//   // ==========================================================
//   const parseApiDate = (value) => {
//     if (!value) {
//       return null;
//     }

//     // PHP date object
//     // Example:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     if (!dateString) {
//       return null;
//     }

//     // YYYY-MM-DD
//     // YYYY-MM-DD HH:mm:ss
//     // YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const year = Number(match[1]);
//       const month = Number(match[2]);
//       const day = Number(match[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     // DD-MM-YYYY
//     const ddmmyyyy = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);

//     if (ddmmyyyy) {
//       const day = Number(ddmmyyyy[1]);
//       const month = Number(ddmmyyyy[2]);
//       const year = Number(ddmmyyyy[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     return null;
//   };

//   // ==========================================================
//   // EDIT DAILY STOCK ENTRY
//   // ==========================================================
//   const handleEditEntry = async (entry) => {
//     try {
//       console.log("EDIT DAILY STOCK HEADER:", entry);

//       // ========================================================
//       // HEADER ID
//       // ========================================================

//       const headerId = entry?.Id || entry?.id;

//       if (!headerId) {
//         toast.error("Daily Stock Header ID not found");
//         return;
//       }

//       // ========================================================
//       // SET EDITING ENTRY
//       // ========================================================

//       setEditingEntry(entry);
//       setOpenForm(true);

//       // ========================================================
//       // DATE
//       // ========================================================

//       const apiDate = entry?.EntryDate || entry?.date;

//       const parsedDate = parseApiDate(apiDate);

//       console.log("EDIT API DATE:", apiDate);

//       console.log("EDIT PARSED DATE:", parsedDate);

//       if (parsedDate) {
//         setDate(parsedDate);
//       } else {
//         // Important:
//         // Never allow invalid date to reach update API
//         toast.error("Invalid Entry Date received from API");

//         setDate(new Date());
//       }

//       // ========================================================
//       // MAIN OFFICE ALWAYS ID = 2
//       // ========================================================

//       setSelectedShop({
//         Id: MAIN_OFFICE_ID,
//         AccountName: "Main Office",
//       });

//       // ========================================================
//       // FETCH DETAILS
//       // ========================================================

//       const detailData = await fetchDailyStockDetail(headerId);

//       console.log("EDIT DAILY STOCK DETAIL:", detailData);

//       // ========================================================
//       // MAP DETAIL DATA
//       // ========================================================

//       const detailRows = detailData.map((item) => ({
//         Id: item?.Id || item?.id || "",

//         ProductId: item?.ProductId || item?.productId || 0,

//         ProductCode:
//           item?.ProductCode || item?.Code || item?.ProductCodeNo || "",

//         ProductName: item?.ProductName || item?.Name || "",

//         Quantity: Number(item?.Quantity ?? item?.quantity ?? 0),

//         Rate: Number(item?.Rate ?? item?.rate ?? 0),

//         Amount: Number(item?.Amount ?? item?.amount ?? 0),
//       }));

//       console.log("EDIT MAPPED DETAIL ROWS:", detailRows);

//       setRows(detailRows);

//       // ========================================================
// // LOAD EDIT DATA INTO PRODUCT QUANTITY STATE
// // ========================================================
// const editedQuantities = {};
// const editedRates = {};

// detailRows.forEach((row) => {
//   const key =
//     String(row.ProductId);

//   editedQuantities[key] = {
//     quantity:
//       String(row.Quantity ?? 0),

//     // IMPORTANT
//     // Keep database detail ID
//     detailId:
//       row.Id || "",
//   };

//   editedRates[key] =
//     Number(row.Rate || 0);
// });

// // ========================================================
// // SET BOTH STATES
// // ========================================================
// setRows(detailRows);

// setProductQuantities(
//   editedQuantities
// );

// setProductRates(
//   editedRates
// );

//     } catch (error) {
//       console.error("Edit Daily Stock Entry Error:", error);

//       toast.error("Unable to load Daily Stock Entry");
//     }
//   };


//  const handleDeleteEntry = async (id) => {
//   if (!id) {
//     toast.error("Stock Entry ID not found");
//     return;
//   }

//   try {
//     setSaving(true);

//     // ========================================================
// // FETCH DETAILS OF THIS HEADER
// // ========================================================

// const detailData =
//   await fetchDailyStockDetail(id);

// console.log(
//   "DETAILS BEFORE HEADER DELETE:",
//   detailData
// );

// // ========================================================
// // DELETE ALL DETAILS FIRST
// // ========================================================

// const detailIds =
//   detailData
//     .map((item) =>
//       Number(item?.Id || item?.id)
//     )
//     .filter(
//       (detailId) =>
//         Number.isInteger(detailId) &&
//         detailId > 0
//     );

// for (const detailId of detailIds) {
//   await deleteDailyStockDetail(
//     detailId
//   );
// }

//     const deleteUrl =
//       `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//       `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//     console.log("======================================");
//     console.log("DELETE MAIN OFFICE STOCK ENTRY");
//     console.log("DELETE URL:", deleteUrl);
//     console.log("HEADER ID:", id);
//     console.log("======================================");

//     const response = await fetch(deleteUrl, {
//       method: "GET",
//       redirect: "follow",
//     });

//     const responseText = await response.text();

//     console.log("DELETE API STATUS:", response.status);
//     console.log("DELETE API RESPONSE:", responseText);

//     if (!response.ok) {
//       throw new Error(
//         `Delete API failed: ${response.status}`
//       );
//     }

//     // -----------------------------------------
//     // CHECK API RESPONSE
//     // -----------------------------------------

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch {
//       result = {};
//     }

//     console.log("DELETE PARSED RESPONSE:", result);

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//           "Main Office Stock Entry delete failed"
//       );
//     }

//     // -----------------------------------------
//     // REMOVE FROM UI
//     // -----------------------------------------

//     setStockEntries((previousEntries) =>
//       previousEntries.filter(
//         (item) =>
//           Number(item?.id) !== Number(id) &&
//           Number(item?.Id) !== Number(id)
//       )
//     );

//     // -----------------------------------------
//     // REFRESH DATABASE DATA
//     // -----------------------------------------

//     await fetchAllDailyStockHeaders();

//     // -----------------------------------------
//     // RECALCULATE MAIN OFFICE STOCK
//     // -----------------------------------------

//     await calculateMainOfficeCurrentStock();

//     toast.success(
//       "Main Office Stock Entry deleted successfully!"
//     );

//   } catch (error) {
//     console.error(
//       "DELETE MAIN OFFICE STOCK ENTRY ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to delete Main Office Stock Entry"
//     );

//   } finally {
//     setSaving(false);
//   }
// };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

//   const totalPages =
//     mappedStockEntries.length === 0
//       ? 0
//       : Math.ceil(mappedStockEntries.length / pageSize);

//   const paginatedStockEntries = useMemo(() => {
//     const startIndex = (pageNo - 1) * pageSize;
//     const endIndex = startIndex + pageSize;

//     return mappedStockEntries.slice(startIndex, endIndex);
//   }, [mappedStockEntries, pageNo]);

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
//           const index = mappedStockEntries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "dateText",
//         header: "Date",
//         size: 150,

//         Cell: ({ cell }) => cell.getValue(),
//       },

//       {
//         accessorKey: "shop",
//         header: "Shop",
//         size: 250,
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
//         size: 150,

//         enableSorting: false,
//         enableColumnFilter: false,

//         Cell: ({ row }) => (
//           <Box display="flex" justifyContent="center">
//             <Tooltip title="Edit">
//               <IconButton
//                 size="small"
//                 onClick={() => handleEditEntry(row.original)}
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Delete">
//               <IconButton
//                 color="error"
//                 size="small"
//                 onClick={() => handleDeleteEntry(row.original.id)}
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         ),
//       },
//     ],
//     [mappedStockEntries, handleEditEntry, handleDeleteEntry],
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
//         {/* ====================================================
//             PAGE TITLE
//         ==================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b> Stock Entry at Main Office</b>
//           </Typography>
//         </Box>

//         {/* ====================================================
//             TABLE SECTION
//         ==================================================== */}

//         <Box
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* ==================================================
//               CREATE BUTTON
//           ================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             <Button
//               sx={{
//                 background: "var(--complementary-color)",

//                 "&:hover": {
//                   background: "var(--complementary-color)",
//                 },

//                 borderRadius: "5px 5px 0 0",

//                 textTransform: "uppercase",

//                 fontSize: "16px",

//                 fontWeight: 500,

//                 px: 2.5,

//                 py: 1.5,
//               }}
//               variant="contained"
//               onClick={handleOpenForm}
//             >
//               CREATE DAILY STOCK ENTRY AT MAIN OFFICE
//             </Button>
//           </Box>

//           {/* ==================================================
//               MATERIAL REACT TABLE
//           ================================================== */}

//           <MaterialReactTable
//             columns={columns}
//             data={paginatedStockEntries}
//             enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",

//                 color: "black",

//                 fontSize: "16px",

//                 fontWeight: "bold",
//               },
//             }}
//             muiTableBodyCellProps={{
//               sx: {
//                 fontSize: "15px",
//               },
//             }}
//             muiTablePaperProps={{
//               elevation: 2,

//               sx: {
//                 borderRadius: "0 4px 4px 4px",

//                 overflow: "hidden",

//                 boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//               },
//             }}
//             muiTableContainerProps={{
//               sx: {
//                 maxHeight: "none",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 mb={1}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//                 pr={2}
//                 gap={0.5}
//               >
//                 {/* FIRST PAGE */}

//                 <FirstPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(1);
//                     }
//                   }}
//                 />

//                 {/* PREVIOUS */}

//                 <KeyboardArrowLeftIcon
//                   sx={{
//                     cursor: pageNo > 1 ? "pointer" : "default",

//                     color: pageNo > 1 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                   }}
//                 />

//                 {/* PAGE NO */}

//                 <Box ml={1}>Page No</Box>

//                 <TextField
//                   sx={{
//                     width: "65px",

//                     ml: 1,

//                     "& .MuiInputBase-input": {
//                       textAlign: "center",

//                       padding: "8px 5px",
//                     },

//                     "@media (max-width: 768px)": {
//                       width: "60px",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => {
//                     let value = Number(e.target.value);

//                     if (value < 1 || isNaN(value)) {
//                       value = 1;
//                     }

//                     if (totalPages > 0 && value > totalPages) {
//                       value = totalPages;
//                     }

//                     setPageNo(value);
//                   }}
//                   size="small"
//                 />

//                 {/* NEXT */}

//                 <KeyboardArrowRightIcon
//                   sx={{
//                     cursor: pageNo < totalPages ? "pointer" : "default",

//                     color: pageNo < totalPages ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (pageNo < totalPages) {
//                       setPageNo((prev) => Number(prev) + 1);
//                     }
//                   }}
//                 />

//                 {/* LAST PAGE */}

//                 <LastPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(totalPages);
//                     }
//                   }}
//                 />

//                 {/* TOTAL PAGES */}

//                 <Box ml={1}>Total Pages: {totalPages}</Box>
//               </Box>
//             )}
//           />
//         </Box>

//         {/* ====================================================
//             MAIN OFFICE DAILY STOCK FORM
//         ==================================================== */}

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
//               DIALOG HEADER
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
//               Stock Entry at Main Office
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
//               DIALOG CONTENT
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
//                 MAIN OFFICE + DATE
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
//               {/* MAIN OFFICE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Main Office:
//                 </Typography>

//                 <TextField
//                   value="Main Office"
//                   size="small"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box>

//               {/* DATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Date:
//                 </Typography>

//                 <DatePicker
//                   value={date}
//                   onChange={(newValue) => setDate(newValue)}
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
//                 PRODUCT
//             ================================================= */}

//             <Box
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                 Product:
//               </Typography>

//               {/* =================================================
//     PRODUCT SEARCH + PRODUCT SELECTION TABLE
// ================================================= */}

//               <Box sx={{ mb: 2 }}>
//                 {/* SEARCH */}
//                 {/* <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography> */}

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Search Product / Code"
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   sx={{ mb: 1.5 }}
//                 />

//                 {/* PRODUCT TABLE */}
//                 <Box
//                   sx={{
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                     overflow: "hidden",
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {/* TABLE HEADER */}
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                       backgroundColor: "#e9edf1",
//                       borderBottom: "1px solid #ccc",
//                       fontWeight: 700,
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Code
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Name
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "center",
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Quantity
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "right",
//                       }}
//                     >
//                       Rate
//                     </Box>
//                   </Box>

//                   {/* PRODUCT ROWS */}

//                   {/* PRODUCT ROWS */}

// {filteredProductOptions.map((product) => {
//   const productId =
//     String(product.value);

//   // Current quantity
//   const quantity =
//     productQuantities?.[productId]?.quantity ??
//     "";

//   // Current rate
//   const rate =
//     productRates?.[productId] ??
//     Number(product.rate || 0);

//   return (
//     <Box
//       key={productId}
//       sx={{
//         display: "grid",
//         gridTemplateColumns:
//           "1fr 2fr 1fr 1fr",
//         borderBottom:
//           "1px solid #ddd",
//         alignItems: "center",

//         "&:hover": {
//           backgroundColor:
//             "#fafafa",
//         },
//       }}
//     >

//       {/* PRODUCT CODE */}
//       <Box
//         sx={{
//           p: 1.2,
//           borderRight:
//             "1px solid #ddd",
//         }}
//       >
//         {product.productCode}
//       </Box>

//       {/* PRODUCT NAME */}
//       <Box
//         sx={{
//           p: 1.2,
//           borderRight:
//             "1px solid #ddd",
//         }}
//       >
//         {product.label}
//       </Box>

//       {/* QUANTITY */}
//       <Box
//         sx={{
//           p: 1,
//           borderRight:
//             "1px solid #ddd",
//           display: "flex",
//           justifyContent:
//             "center",
//         }}
//       >
//         <TextField
//           size="small"
//           type="number"

//           value={quantity}

//           onChange={(e) => {
//             handleProductQuantityChange(
//               product.value,
//               e.target.value
//             );
//           }}

//           onKeyDown={(e) => {
//             handleQuantityKeyDown(
//               e,
//               product.value
//             );
//           }}

//           inputRef={(input) => {
//             quantityInputRefs.current[
//               productId
//             ] = input;
//           }}

//           inputProps={{
//             min: 0,
//             step: 1,
//           }}

//           sx={{
//             width: "150px",
//           }}
//         />
//       </Box>

//       {/* RATE */}
//       <Box
//         sx={{
//           p: 1,
//           display: "flex",
//           justifyContent:
//             "center",
//         }}
//       >
//         <TextField
//           size="small"
//           type="number"

//           value={rate}

//          onChange={(e) => {
//   const value =
//     e.target.value;

//   const newRate =
//     value === ""
//       ? 0
//       : Number(value);

//   // ======================================================
//   // UPDATE RATE STATE
//   // ======================================================
//   setProductRates(
//     (previous) => ({
//       ...previous,

//       [productId]:
//         newRate,
//     })
//   );

//   // ======================================================
//   // UPDATE LOWER DETAIL TABLE
//   // ======================================================
//   setRows(
//     (previousRows) =>
//       previousRows.map((row) => {
//         if (
//           String(row.ProductId) !==
//           productId
//         ) {
//           return row;
//         }

//         const rowQuantity =
//           Number(
//             row.Quantity || 0
//           );

//         return {
//           ...row,

//           Rate:
//             newRate,

//           Amount:
//             rowQuantity *
//             newRate,
//         };
//       })
//   );
// }}

//           inputProps={{
//             min: 0,
//             step: "0.01",
//           }}

//           sx={{
//             width: "110px",
//           }}
//         />
//       </Box>

//     </Box>
//   );
// })}
                       

//                   {/* NO PRODUCT */}

//                   {productOptions.filter((product) => {
//                     const search = String(productSearch || "")
//                       .trim()
//                       .toLowerCase();

//                     if (!search) {
//                       return true;
//                     }

//                     return (
//                       String(product.productCode || "")
//                         .toLowerCase()
//                         .includes(search) ||
//                       String(product.label || "")
//                         .toLowerCase()
//                         .includes(search)
//                     );
//                   }).length === 0 && (
//                     <Box
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         color: "text.secondary",
//                       }}
//                     >
//                       No products found
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Box>

//             {/* =================================================
//                 QUANTITY + RATE + ADD
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",

//                   sm: "1fr 1fr auto",
//                 },

//                 gap: 1.5,

//                 alignItems: "end",

//                 mb: 2,
//               }}
//             >
//               {/* QUANTITY */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Quantity:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   placeholder="Enter Quantity"
//                   fullWidth
//                 />
//               </Box> */}

//               {/* RATE */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Rate:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={rate}
//                   placeholder="Rate"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box> */}

//               {/* ADD */}

//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   height: "40px",

//                   px: 2.5,

//                   textTransform: "none",

//                   background: "var(--complementary-color)",

//                   "&:hover": {
//                     background: "var(--complementary-color)",
//                   },
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 1.5,
//               }}
//             />

//             {/* =================================================
//                 PRODUCT DETAIL TABLE
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
//                       Product Code
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Name
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Rate
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         align="center"
//                         sx={{
//                           height: "75px",

//                           color: "#777",

//                           fontStyle: "italic",
//                         }}
//                       >
//                         No products added
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.map((row, index) => (
//                       <TableRow hover key={`${row.ProductId}-${index}`}>
//                         <TableCell>{row.ProductCode}</TableCell>

//                         <TableCell>{row.ProductName}</TableCell>

//                         <TableCell align="center">{row.Quantity}</TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Rate).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Amount).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 TOTAL
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
//               <Typography fontWeight={600} fontSize="14px">
//                 Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(total).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 140,
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           {/* ==================================================
//               DIALOG ACTIONS
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
//     </LocalizationProvider>
//   );
// };

// export default DailyStockEntryAtMainOffice;


























// import React, { useEffect, useMemo, useState, useRef } from "react";

// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Autocomplete,
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



// import { createFilterOptions } from "@mui/material/Autocomplete";

// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import EditIcon from "@mui/icons-material/Edit";

// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";

// import { MaterialReactTable } from "material-react-table";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const DailyStockEntryAtMainOffice = () => {



//     const quantityInputRefs = useRef({});
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const MAIN_OFFICE_ID = 2;

//   const [stockEntries, setStockEntries] = useState([]);


//   // ==========================================================
// // OLD DETAIL STATE
// // Used by existing Save / Edit / Total logic
// // ==========================================================
// const [quantity, setQuantity] = useState("");
// const [rate, setRate] = useState("");
// const [rows, setRows] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const CREATED_BY = 1;

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [shopOptions, setShopOptions] = useState([]);

//   const [selectedShop, setSelectedShop] = useState({
//     Id: MAIN_OFFICE_ID,
//     AccountName: "Main Office",
//   });

//   const [loadingShops, setLoadingShops] = useState(false);

//   const [editingEntry, setEditingEntry] = useState(null);

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productSearch, setProductSearch] = useState("");



//   const filteredProductOptions = useMemo(() => {
//   const search = String(productSearch || "")
//     .trim()
//     .toLowerCase();

//   if (!search) {
//     return productOptions;
//   }

//   return productOptions.filter((product) => {
//     const productCode = String(
//       product?.productCode || ""
//     ).toLowerCase();

//     const productName = String(
//       product?.label || ""
//     ).toLowerCase();

//     return (
//       productCode.includes(search) ||
//       productName.includes(search)
//     );
//   });
// }, [productOptions, productSearch]);














// const handleQuantityKeyDown = (
//   event,
//   currentProductId
// ) => {
//   if (event.key !== "Enter") {
//     return;
//   }

//   event.preventDefault();

//   const currentIndex =
//     filteredProductOptions.findIndex(
//       (product) =>
//         String(product.value) ===
//         String(currentProductId)
//     );

//   if (currentIndex === -1) {
//     return;
//   }

//   const nextProduct =
//     filteredProductOptions[currentIndex + 1];

//   if (!nextProduct) {
//     return;
//   }

//   const nextInput =
//     quantityInputRefs.current[
//       String(nextProduct.value)
//     ];

//   if (nextInput) {
//     requestAnimationFrame(() => {
//       nextInput.focus();
//       nextInput.select();
//     });
//   }
// };



//   // ==========================================================
//   // QUANTITY / RATE
//   // ==========================================================

//  const [productQuantities, setProductQuantities] = useState({});
// const [productRates, setProductRates] = useState({});

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;


//   const [mainOfficeCurrentStock, setMainOfficeCurrentStock] = useState({});


// const calculateDailySoldQuantity = async () => {
//   try {
//     console.log(
//       "=========================================="
//     );
//     console.log(
//       "CALCULATING TOTAL DAILY SHOP SALES"
//     );
//     console.log(
//       "=========================================="
//     );

//     // ======================================================
//     // 1. GET ALL DAILY STOCK HEADERS
//     // ======================================================

//     const headerResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!headerResponse.ok) {
//       throw new Error(
//         `Daily Stock Header API failed: ${headerResponse.status}`
//       );
//     }

//     const headerResult =
//       await headerResponse.json();

//     let headers = [];

//     if (Array.isArray(headerResult)) {
//       headers = headerResult;
//     } else if (
//       Array.isArray(headerResult?.data)
//     ) {
//       headers = headerResult.data;
//     }

//     // ======================================================
//     // 2. ONLY SHOP DAILY STOCK ENTRIES
//     //
//     // LocationType = S
//     //
//     // These are the daily sales/stock entries
//     // ======================================================

//     const shopHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//           item?.locationType ??
//           ""
//       )
//         .trim()
//         .toUpperCase();

//       return locationType === "S";
//     });

//     console.log(
//       "TOTAL SHOP DAILY STOCK HEADERS:",
//       shopHeaders.length
//     );

//     console.log(
//       "SHOP DAILY STOCK HEADERS:",
//       shopHeaders
//     );

//     // ======================================================
//     // 3. PRODUCT-WISE TOTAL SALE
//     // ======================================================

//     const soldMap = {};

//     // ======================================================
//     // 4. FETCH DETAILS OF EVERY SHOP ENTRY
//     // ======================================================

//     for (const header of shopHeaders) {

//       const headerId =
//         header?.Id ??
//         header?.id ??
//         header?.DailyStockHeaderId;

//       if (!headerId) {
//         continue;
//       }

//       try {

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//         );

//         if (!detailResponse.ok) {
//           console.warn(
//             "DETAIL API FAILED:",
//             headerId,
//             detailResponse.status
//           );

//           continue;
//         }

//         const detailResult =
//           await detailResponse.json();

//         let details = [];

//         if (Array.isArray(detailResult)) {
//           details = detailResult;
//         } else if (
//           Array.isArray(detailResult?.data)
//         ) {
//           details = detailResult.data;
//         }

//         // ==================================================
//         // PRODUCT-WISE QUANTITY
//         // ==================================================

//         details.forEach((detail) => {

//           const productId = String(
//             detail?.ProductId ??
//               detail?.productId ??
//               ""
//           ).trim();

//           if (!productId) {
//             return;
//           }

//           const quantity = Number(
//             detail?.Quantity ??
//               detail?.quantity ??
//               0
//           );

//           if (
//             !Number.isFinite(quantity) ||
//             quantity <= 0
//           ) {
//             return;
//           }

//           soldMap[productId] =
//             Number(soldMap[productId] || 0) +
//             quantity;
//         });

//       } catch (detailError) {

//         console.error(
//           `ERROR FETCHING SHOP DETAIL ${headerId}:`,
//           detailError
//         );

//         continue;
//       }
//     }

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "TOTAL SHOP SALE PRODUCT-WISE:"
//     );

//     console.log(soldMap);

//     console.log(
//       "=========================================="
//     );

//     return soldMap;

//   } catch (error) {

//     console.error(
//       "DAILY SOLD QUANTITY CALCULATION ERROR:",
//       error
//     );

//     return {};
//   }
// };





// const calculateMainOfficeOpeningStock = async () => {
//   try {
//     // ======================================================
//     // GET ALL MAIN OFFICE STOCK ENTRY HEADERS
//     // ======================================================

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!response.ok) {
//       throw new Error("Main Office Stock Header API failed");
//     }

//     const result = await response.json();

//     let headers = [];

//     if (Array.isArray(result)) {
//       headers = result;
//     } else if (Array.isArray(result?.data)) {
//       headers = result.data;
//     }

//     // ======================================================
//     // ONLY MAIN OFFICE ENTRIES
//     // ======================================================

//     const mainOfficeHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//         item?.locationType ??
//         ""
//       )
//         .trim()
//         .toUpperCase();

//       const officeId = String(
//         item?.OfficeId ??
//         item?.officeId ??
//         item?.LocationId ??
//         item?.locationId ??
//         ""
//       ).trim();

//       return (
//         locationType === "O" &&
//         officeId === String(MAIN_OFFICE_ID)
//       );
//     });

//     // ======================================================
//     // PRODUCT-WISE OPENING STOCK
//     // ======================================================

//     const openingStockMap = {};

//     for (const header of mainOfficeHeaders) {
//       const headerId =
//         header?.Id ??
//         header?.id ??
//         header?.DailyStockHeaderId;

//       if (!headerId) {
//         continue;
//       }

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//       );

//       if (!detailResponse.ok) {
//         continue;
//       }

//       const detailResult = await detailResponse.json();

//       let details = [];

//       if (Array.isArray(detailResult)) {
//         details = detailResult;
//       } else if (Array.isArray(detailResult?.data)) {
//         details = detailResult.data;
//       }

//       details.forEach((detail) => {
//         const productId = String(
//           detail?.ProductId ??
//           detail?.productId ??
//           ""
//         ).trim();

//         if (!productId) {
//           return;
//         }

//         const quantity = Number(
//           detail?.Quantity ??
//           detail?.quantity ??
//           0
//         );

//         const productName =
//           detail?.ProductName ??
//           detail?.Name ??
//           "";

//         if (!openingStockMap[productId]) {
//           openingStockMap[productId] = {
//             openingStock: 0,
//             productName,
//           };
//         }

//         openingStockMap[productId].openingStock += quantity;
//       });
//     }

//     console.log(
//       "MAIN OFFICE OPENING STOCK:",
//       openingStockMap
//     );

//     return openingStockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE OPENING STOCK ERROR:",
//       error
//     );

//     return {};
//   }
// };













// const calculateMainOfficeCurrentStock = async () => {
//   try {
//     // ======================================================
//     // 1. GET MAIN OFFICE OPENING STOCK
//     // ======================================================

//     const openingStockMap =
//       await calculateMainOfficeOpeningStock();

//     // ======================================================
//     // 2. GET TOTAL DAILY SALES
//     // ======================================================

//     const soldMap =
//       await calculateDailySoldQuantity();

//     // ======================================================
//     // 3. CALCULATE CURRENT STOCK
//     // ======================================================

//     const currentStockMap = {};

//     Object.keys(openingStockMap).forEach((productId) => {
//       const openingStock = Number(
//         openingStockMap[productId]?.openingStock || 0
//       );

//       const totalSold = Number(
//         soldMap[productId] || 0
//       );

//       // IMPORTANT:
//       // Negative value is allowed.
//       //
//       // 200 - 50 = 150
//       // 200 - 150 = 50
//       // 200 - 210 = -10

//       const currentStock =
//         openingStock - totalSold;

//       currentStockMap[productId] = {
//         productName:
//           openingStockMap[productId]?.productName || "",

//         openingStock,

//         totalSold,

//         currentStock,
//       };
//     });

//     // ======================================================
//     // SAVE CURRENT STOCK IN STATE
//     // ======================================================

//     setMainOfficeCurrentStock(currentStockMap);

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "MAIN OFFICE CURRENT STOCK:"
//     );

//     console.log(currentStockMap);

//     console.log(
//       "=========================================="
//     );

//     // ======================================================
//     // CHECK STOCK
//     // ======================================================

//     checkMainOfficeStock(currentStockMap);

//     return currentStockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE CURRENT STOCK ERROR:",
//       error
//     );

//     return {};
//   }
// };






// const checkMainOfficeStock = (stockMap) => {

//   Object.values(stockMap).forEach((product) => {

//     const currentStock =
//       Number(product?.currentStock ?? 0);

//     const productName =
//       product?.productName || "Product";

//     // ====================================================
//     // STOCK FINISHED
//     // ====================================================

//     if (currentStock === 0) {

//       toast.warning(
//         `${productName} stock is finished.`
//       );

//       return;
//     }

//     // ====================================================
//     // STOCK NEGATIVE
//     // ====================================================

//     if (currentStock < 0) {

//       toast.error(
//         `${productName} stock is less. Shortage: ${Math.abs(
//           currentStock
//         )}`
//       );

//       return;
//     }

//     // ====================================================
//     // LOW STOCK
//     // ====================================================

//     if (currentStock > 0 && currentStock <= 10) {

//       toast.warning(
//         `${productName} stock is low. Available: ${currentStock}`
//       );
//     }
//   });
// };


//   // ==========================================================
//   // FETCH PRODUCT
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster`,
//         requestOptions,
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item?.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: item?.Id ?? "",

//           label: String(item?.ProductName ?? "").trim(),

//           productCode: item?.ProductCode ?? "",

//           rate: Number(item?.PurchasePrice ?? 0),
//         }));

//       setProductOptions(options);

//       console.log("PRODUCT API RESPONSE:", data);
//     } catch (error) {
//       console.error("Product API Error:", error);
//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const handleRateChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setRate(value);
//     }
//   };

//   // ============================================================
//   // FETCH DAILY STOCK HEADER BY ID
//   // ============================================================
//   const fetchDailyStockHeader = async (headerId) => {
//     try {
//       // Header ID is required
//       if (!headerId) {
//         console.error("Daily Stock Header ID is required");
//         return [];
//       }

//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php?Id=${headerId}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("DAILY STOCK HEADER RESPONSE:", result);

//       // ============================================================
//       // HANDLE API RESPONSE
//       // ============================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = [result.data];
//       } else if (result && typeof result === "object") {
//         data = [result];
//       }

//       console.log("DAILY STOCK HEADER DATA:", data);

//       // ============================================================
//       // MAP API RESPONSE FOR MAIN TABLE
//       // ============================================================

//       const mappedData = data.map((item) => ({
//         ...item,

//         // Header ID
//         id: item?.Id || item?.id || "",

//         // Date
//         dateText: item?.EntryDate
//           ? formatDate(item.EntryDate)
//           : item?.dateText || "",

//         // Shop Name
//         shop: item?.ShopName || item?.shop || "",

//         // Total Amount
//         total: Number(item?.TotalAmount ?? item?.total ?? 0),
//       }));

//       console.log("MAPPED DAILY STOCK HEADER DATA:", mappedData);

//       setStockEntries(mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Header API Error:", error);

//       toast.error("Daily Stock Header data could not be loaded");

//       return [];
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADERS - STOCK ENTRY SHOP
//   // ==========================================================
//   const fetchAllDailyStockHeaders = async () => {
//     try {
//       console.log("========================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("========================================");

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php",
//         {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//           redirect: "follow",
//         },
//       );

//       console.log("DAILY STOCK HEADER LIST STATUS:", response.status);

//       const rawText = await response.text();

//       console.log("DAILY STOCK HEADER LIST RAW RESPONSE:", rawText);

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header List API failed: ${response.status}`,
//         );
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : {};
//       } catch (error) {
//         console.error("DAILY STOCK HEADER LIST JSON ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER LIST RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.success && result?.data) {
//         data = Array.isArray(result.data) ? result.data : [result.data];
//       }

//       console.log("DAILY STOCK HEADER LIST DATA:", data);

//       // ======================================================
//       // ONLY STOCK ENTRY SHOP
//       // ======================================================

//      // ======================================================
// // ONLY MAIN OFFICE ENTRIES
// // LocationType = "O"
// // OfficeId = MAIN_OFFICE_ID
// // ======================================================

// const officeEntries = data.filter((item) => {
//   const locationType = String(
//     item?.LocationType ??
//       item?.locationType ??
//       ""
//   )
//     .trim()
//     .toUpperCase();

//   const officeId = String(
//     item?.OfficeId ??
//       item?.officeId ??
//       item?.LocationId ??
//       item?.locationId ??
//       ""
//   ).trim();

//   return (
//     locationType === "O" &&
//     officeId === String(MAIN_OFFICE_ID)
//   );
// });

// console.log(
//   "=========================================="
// );

// console.log(
//   "MAIN OFFICE HEADER RECORDS:"
// );

// console.log(
//   "TOTAL MAIN OFFICE RECORDS:",
//   officeEntries.length
// );

// console.log(
//   "MAIN OFFICE RECORDS:",
//   officeEntries
// );

//       // ======================================================
//       // MAP DATA FOR TABLE
//       // ======================================================

//      // ======================================================
// // MAP DATA FOR MAIN OFFICE TABLE
// // ======================================================

// const mappedData = officeEntries.map((item) => ({
//   ...item,

//   // --------------------------------------------------
//   // ID
//   // --------------------------------------------------

//   Id:
//     item?.Id ??
//     item?.id ??
//     item?.DailyStockHeaderId ??
//     "",

//   id:
//     item?.Id ??
//     item?.id ??
//     item?.DailyStockHeaderId ??
//     "",

//   // --------------------------------------------------
//   // DATE
//   // --------------------------------------------------

//   EntryDate:
//     item?.EntryDate ??
//     item?.entryDate ??
//     item?.date ??
//     "",

//   dateText:
//     item?.EntryDate
//       ? formatDate(item.EntryDate)
//       : item?.entryDate
//         ? formatDate(item.entryDate)
//         : item?.date
//           ? formatDate(item.date)
//           : "",

//   // --------------------------------------------------
//   // MAIN OFFICE
//   // --------------------------------------------------

//   LocationType:
//     String(
//       item?.LocationType ??
//         item?.locationType ??
//         "O"
//     )
//       .trim()
//       .toUpperCase(),

//   LocationId:
//     item?.LocationId ??
//     item?.locationId ??
//     MAIN_OFFICE_ID,

//   OfficeId:
//     item?.OfficeId ??
//     item?.officeId ??
//     MAIN_OFFICE_ID,

//   ShopId:
//     item?.ShopId ??
//     item?.shopId ??
//     null,

//   ShopName:
//     item?.ShopName ??
//     item?.AccountName ??
//     item?.Shop ??
//     item?.shop ??
//     "Main Office",

//   shop:
//     item?.ShopName ??
//     item?.AccountName ??
//     item?.Shop ??
//     item?.shop ??
//     "Main Office",

//   // --------------------------------------------------
//   // TOTAL
//   // --------------------------------------------------

//   TotalAmount: Number(
//     item?.TotalAmount ??
//       item?.totalAmount ??
//       item?.Total ??
//       item?.total ??
//       0
//   ),

//   total: Number(
//     item?.TotalAmount ??
//       item?.totalAmount ??
//       item?.Total ??
//       item?.total ??
//       0
//   ),
// }));

// // ======================================================
// // NEWEST RECORD FIRST
// // ======================================================

// mappedData.sort((a, b) => {
//   return Number(b?.Id || 0) - Number(a?.Id || 0);
// });

// console.log(
//   "=========================================="
// );

// console.log(
//   "FINAL MAIN OFFICE LIST:"
// );

// console.log(
//   "TOTAL MAIN OFFICE RECORDS:",
//   mappedData.length
// );

// console.log(
//   "MAPPED MAIN OFFICE RECORDS:",
//   mappedData
// );

// // ======================================================
// // SET TABLE DATA
// // ======================================================

// setStockEntries(mappedData);

// // Reset pagination
// setPageNo(1);

// return mappedData;

//       // ======================================================
//       // NEWEST RECORD FIRST
//       // ======================================================

    
//     } catch (error) {
//       console.error("❌ FETCH DAILY STOCK HEADER LIST ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header list could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   // ==========================================================
// // FETCH DAILY STOCK DETAIL BY HEADER ID
// // ==========================================================
// const fetchDailyStockDetail = async (headerId) => {
//   try {
//     const id = Number(headerId);

//     console.log(
//       "======================================"
//     );
//     console.log(
//       "FETCH DAILY STOCK DETAIL"
//     );
//     console.log(
//       "HEADER ID:",
//       id
//     );
//     console.log(
//       "======================================"
//     );

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // IMPORTANT
//     // Use DailyStockHeaderId for Edit/Detail GET
//     const url =
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php` +
//       `?DailyStockHeaderId=${encodeURIComponent(id)}`;

//     console.log(
//       "DAILY STOCK DETAIL GET URL:",
//       url
//     );

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//       redirect: "follow",
//     });

//     console.log(
//       "DAILY STOCK DETAIL STATUS:",
//       response.status
//     );

//     const responseText =
//       await response.text();

//     console.log(
//       "DAILY STOCK DETAIL RAW RESPONSE:",
//       responseText
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Detail API failed: ${response.status}`
//       );
//     }

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch {
//       throw new Error(
//         `Invalid Daily Stock Detail API response: ${responseText}`
//       );
//     }

//     console.log(
//       "DAILY STOCK DETAIL PARSED RESPONSE:",
//       result
//     );

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//         "Daily Stock Detail data could not be loaded"
//       );
//     }

//     let data = [];

//     if (Array.isArray(result)) {
//       data = result;
//     } else if (Array.isArray(result?.data)) {
//       data = result.data;
//     } else if (
//       result?.data &&
//       typeof result.data === "object"
//     ) {
//       data = [result.data];
//     } else if (
//       result &&
//       typeof result === "object" &&
//       result?.Id
//     ) {
//       data = [result];
//     }

//     console.log(
//       "FINAL DAILY STOCK DETAIL DATA:",
//       data
//     );

//     return data;

//   } catch (error) {
//     console.error(
//       "DAILY STOCK DETAIL FETCH ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//       "Daily Stock Detail data could not be loaded"
//     );

//     return [];
//   }
// };

//   // ==========================================================
// // DELETE DAILY STOCK DETAIL
// // ==========================================================
// const deleteDailyStockDetail = async (detailId) => {
//   if (!detailId) {
//     throw new Error("Daily Stock Detail ID not found");
//   }

//   const deleteUrl =
//     `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//     `?Table=dailystockdetail&Id=${encodeURIComponent(detailId)}`;

//   console.log("======================================");
//   console.log("DELETE DAILY STOCK DETAIL");
//   console.log("DETAIL ID:", detailId);
//   console.log("DELETE URL:", deleteUrl);
//   console.log("======================================");

//   const response = await fetch(deleteUrl, {
//     method: "GET",
//     redirect: "follow",
//   });

//   const responseText = await response.text();

//   console.log(
//     "DELETE DETAIL API STATUS:",
//     response.status
//   );

//   console.log(
//     "DELETE DETAIL API RESPONSE:",
//     responseText
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Daily Stock Detail Delete API failed: ${response.status}`
//     );
//   }

//   let result = {};

//   try {
//     result = responseText
//       ? JSON.parse(responseText)
//       : {};
//   } catch {
//     result = {};
//   }

//   if (result?.success === false) {
//     throw new Error(
//       result?.message ||
//       "Daily Stock Detail delete failed"
//     );
//   }

//   console.log(
//     "DAILY STOCK DETAIL DELETED SUCCESSFULLY:",
//     detailId
//   );

//   return true;
// };

//  const updateDailyStockHeader = async (
//   headerId,
//   entryDate,
//   totalAmount
// ) => {
//   try {
//     // ============================================================
//     // 1. HEADER ID
//     // ============================================================

//     const id = Number(headerId);

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // ============================================================
//     // 2. ENTRY DATE
//     // ============================================================

//     let formattedEntryDate = "";

//     if (entryDate) {
//       if (typeof entryDate === "string") {

//         // YYYY-MM-DD
//         if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//           formattedEntryDate = entryDate;
//         }

//         // DD-MM-YYYY
//         else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//           const [day, month, year] =
//             entryDate.split("-");

//           formattedEntryDate =
//             `${year}-${month}-${day}`;
//         }

//         // Other valid date
//         else {
//           const dateObj = new Date(entryDate);

//           if (!isNaN(dateObj.getTime())) {
//             formattedEntryDate =
//               dateObj.toISOString().split("T")[0];
//           }
//         }
//       }

//       // Date object
//       else if (entryDate instanceof Date) {
//         if (!isNaN(entryDate.getTime())) {
//           formattedEntryDate =
//             entryDate.toISOString().split("T")[0];
//         }
//       }
//     }

//     if (
//       !formattedEntryDate ||
//       formattedEntryDate.includes("NaN")
//     ) {
//       throw new Error(
//         `Invalid EntryDate: ${entryDate}`
//       );
//     }

//     // ============================================================
//     // 3. TOTAL AMOUNT
//     // ============================================================

//     const amount = Number(totalAmount || 0);

//     if (isNaN(amount)) {
//       throw new Error(
//         `Invalid TotalAmount: ${totalAmount}`
//       );
//     }

//     // ============================================================
//     // 4. MAIN OFFICE ID
//     // ============================================================

//     const officeId = Number(MAIN_OFFICE_ID);

//     if (
//       !Number.isInteger(officeId) ||
//       officeId <= 0
//     ) {
//       throw new Error(
//         `Invalid Main Office ID: ${MAIN_OFFICE_ID}`
//       );
//     }

//     // ============================================================
//     // 5. UPDATED BY
//     // ============================================================

//     const updatedBy = Number(CREATED_BY);

//     if (
//       !Number.isInteger(updatedBy) ||
//       updatedBy <= 0
//     ) {
//       throw new Error(
//         `Invalid UpdatedBy: ${CREATED_BY}`
//       );
//     }

//     // ============================================================
//     // 6. FORM DATA
//     // MAIN OFFICE MAPPING
//     //
//     // LocationType = O
//     // LocationId   = Main Office ID
//     // ShopId       = empty
//     // OfficeId     = Main Office ID
//     // ============================================================

//     const updateData = new URLSearchParams();

//     // Header ID
//     updateData.append(
//       "Id",
//       String(id)
//     );

//     // Entry Date
//     updateData.append(
//       "EntryDate",
//       formattedEntryDate
//     );

//     // IMPORTANT: Main Office
//     updateData.append(
//       "LocationType",
//       "O"
//     );

//     // Main Office Location ID
//     updateData.append(
//       "LocationId",
//       String(officeId)
//     );

//     // Main Office is NOT a Shop
//     updateData.append(
//       "ShopId",
//       ""
//     );

//     // Main Office ID
//     updateData.append(
//       "OfficeId",
//       String(officeId)
//     );

//     // Total
//     updateData.append(
//       "TotalAmount",
//       String(amount)
//     );

//     // Updated By
//     updateData.append(
//       "UpdatedBy",
//       String(updatedBy)
//     );

//     // ============================================================
//     // 7. DEBUG PAYLOAD
//     // ============================================================

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "MAIN OFFICE HEADER UPDATE PAYLOAD:",
//       Object.fromEntries(updateData.entries())
//     );

//     console.log(
//       "=========================================="
//     );

//     // ============================================================
//     // 8. API
//     // ============================================================

//     const apiUrl =
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//     const response = await fetch(apiUrl, {
//       method: "POST",

//       headers: {
//         "Content-Type":
//           "application/x-www-form-urlencoded;charset=UTF-8",

//         Accept: "application/json",
//       },

//       body: updateData.toString(),

//       redirect: "follow",
//     });

//     // ============================================================
//     // 9. RESPONSE STATUS
//     // ============================================================

//     console.log(
//       "HEADER UPDATE STATUS:",
//       response.status
//     );

//     // ============================================================
//     // 10. RAW RESPONSE
//     // ============================================================

//     const responseText =
//       await response.text();

//     console.log(
//       "HEADER UPDATE RAW RESPONSE:",
//       responseText
//     );

//     // ============================================================
//     // 11. JSON RESPONSE
//     // ============================================================

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch (error) {
//       throw new Error(
//         `Invalid Header Update API response: ${responseText}`
//       );
//     }

//     console.log(
//       "HEADER UPDATE RESPONSE:",
//       result
//     );

//     // ============================================================
//     // 12. HTTP ERROR
//     // ============================================================

//     if (!response.ok) {
//       throw new Error(
//         result?.message ||
//           `Header Update API failed: ${response.status}`
//       );
//     }

//     // ============================================================
//     // 13. API SUCCESS CHECK
//     // ============================================================

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//           "Daily Stock Header update failed"
//       );
//     }

//     // ============================================================
//     // 14. SUCCESS
//     // ============================================================

//     console.log(
//       "✅ MAIN OFFICE DAILY STOCK HEADER UPDATED SUCCESSFULLY"
//     );

//     console.log(
//       "UPDATED HEADER ID:",
//       id
//     );

//     console.log(
//       "UPDATED OFFICE ID:",
//       officeId
//     );

//     console.log(
//       "UPDATED TOTAL:",
//       amount
//     );

//     return result;

//   } catch (error) {

//     console.error(
//       "❌ DAILY STOCK HEADER UPDATE ERROR:",
//       error
//     );

//     throw error;
//   }
// };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

// useEffect(() => {
//   fetchProduct();
//   fetchAllDailyStockHeaders();
//   calculateMainOfficeCurrentStock();
// }, []);




// useEffect(() => {
//   if (!productOptions.length) {
//     return;
//   }

//   setProductRates((previous) => {
//     const updated = {
//       ...previous,
//     };

//     productOptions.forEach((product) => {
//       const productId =
//         String(product.value);

//       if (updated[productId] === undefined) {
//         updated[productId] =
//           Number(product.rate || 0);
//       }
//     });

//     return updated;
//   });
// }, [productOptions]);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//   const resetForm = () => {
//     setSelectedShop({
//       Id: MAIN_OFFICE_ID,
//       AccountName: "Main Office",
//     });
//     setDate(new Date());
//     setSelectedProduct(null);
//     setQuantity("");
//     setRate("");
//     setRows([]);
//     setEditingEntry(null);
//     setProductQuantities({});
// setProductRates({});
//   };

//   // ==========================================================
//   // OPEN FORM
//   // ==========================================================

//   const handleOpenForm = () => {
//     resetForm();

//     setOpenForm(true);
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
//   // PRODUCT CHANGE
//   // ==========================================================

//   const handleProductChange = (event, newValue) => {
//     setSelectedProduct(newValue);

//     if (newValue) {
//       setRate(newValue.rate);
//     } else {
//       setRate("");
//     }
//   };

//   // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================

// // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================
// // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================


// // ==========================================================
// // PRODUCT TABLE QUANTITY CHANGE
// // ==========================================================
// const handleProductQuantityChange = (
//   productId,
//   value
// ) => {
//   const key = String(productId);

//   // ========================================================
//   // 1. UPDATE PRODUCT QUANTITY STATE
//   // ========================================================
//   setProductQuantities((previous) => {
//     const existing =
//       previous[key];

//     return {
//       ...previous,

//       [key]: {
//         ...(existing &&
//         typeof existing === "object"
//           ? existing
//           : {}),

//         quantity: value,
//       },
//     };
//   });

//   // ========================================================
//   // 2. UPDATE LOWER DETAIL TABLE
//   // ========================================================
//   setRows((previousRows) => {
//     const product =
//       productOptions.find(
//         (item) =>
//           String(item.value) === key
//       );

//     if (!product) {
//       return previousRows;
//     }

//     // ------------------------------------------------------
//     // BLANK / ZERO
//     // ------------------------------------------------------
//     if (
//       value === "" ||
//       Number(value) <= 0
//     ) {
//       return previousRows.filter(
//         (row) =>
//           String(row.ProductId) !== key
//       );
//     }

//     const quantityValue =
//       Number(value);

//     const rateValue =
//       Number(
//         productRates?.[key] ??
//         product.rate ??
//         0
//       );

//     const existingRow =
//       previousRows.find(
//         (row) =>
//           String(row.ProductId) === key
//       );

//     // ------------------------------------------------------
//     // EXISTING ROW -> UPDATE
//     // ------------------------------------------------------
//     if (existingRow) {
//       return previousRows.map((row) =>
//         String(row.ProductId) === key
//           ? {
//               ...row,

//               Id:
//                 row.Id ||
//                 row.id ||
//                 "",

//               ProductId:
//                 product.value,

//               ProductCode:
//                 product.productCode ||
//                 "",

//               ProductName:
//                 product.label ||
//                 "",

//               Quantity:
//                 quantityValue,

//               Rate:
//                 rateValue,

//               Amount:
//                 quantityValue *
//                 rateValue,
//             }
//           : row
//       );
//     }

//     // ------------------------------------------------------
//     // NEW ROW -> ADD
//     // ------------------------------------------------------
//     return [
//       ...previousRows,

//       {
//         Id: "",

//         ProductId:
//           product.value,

//         ProductCode:
//           product.productCode ||
//           "",

//         ProductName:
//           product.label ||
//           "",

//         Quantity:
//           quantityValue,

//         Rate:
//           rateValue,

//         Amount:
//           quantityValue *
//           rateValue,
//       },
//     ];
//   });
// };

//   // ==========================================================
//   // QUANTITY CHANGE
//   // ==========================================================

//   const handleQuantityChange = (event) => {
//     const value = event.target.value;

//     if (value === "" || Number(value) >= 0) {
//       setQuantity(value);
//     }
//   };

//   // ==========================================================
//   // RATE CHANGE
//   // ==========================================================

  

// // ==========================================================
// // ADD / UPDATE PRODUCTS FROM PRODUCT TABLE
// // ==========================================================
// const handleAddProduct = () => {
//   try {
//     const selectedRows =
//       productOptions
//         .map((product) => {
//           const productId =
//             String(product.value);

//           const savedValue =
//             productQuantities?.[
//               productId
//             ];

//           // ------------------------------------------------
//           // QUANTITY
//           // ------------------------------------------------
//           const quantityValue =
//             savedValue &&
//             typeof savedValue ===
//               "object"
//               ? Number(
//                   savedValue?.quantity ||
//                     0
//                 )
//               : Number(
//                   savedValue || 0
//                 );

//           // ------------------------------------------------
//           // RATE
//           // ------------------------------------------------
//           const rateValue =
//             productRates?.[
//               productId
//             ] !== undefined
//               ? Number(
//                   productRates[
//                     productId
//                   ] || 0
//                 )
//               : Number(
//                   product.rate || 0
//                 );

//           // ------------------------------------------------
//           // EXISTING DETAIL ID
//           // ------------------------------------------------
//           const detailId =
//             savedValue &&
//             typeof savedValue ===
//               "object"
//               ? savedValue?.detailId ||
//                 ""
//               : "";

//           return {
//             Id: detailId,

//             ProductId:
//               product.value,

//             ProductCode:
//               product.productCode ||
//               "",

//             ProductName:
//               product.label ||
//               "",

//             Quantity:
//               quantityValue,

//             Rate:
//               rateValue,

//             Amount:
//               quantityValue *
//               rateValue,
//           };
//         })

//         .filter(
//           (row) =>
//             Number(row.Quantity) >
//               0 ||
//             row.Id
//         );

//     // ------------------------------------------------------
//     // VALIDATION
//     // ------------------------------------------------------
//     if (
//       selectedRows.length === 0
//     ) {
//       toast.error(
//         "Please enter Quantity for at least one Product"
//       );

//       return;
//     }

//     // ------------------------------------------------------
//     // UPDATE DETAIL TABLE
//     // ------------------------------------------------------
//     setRows(
//       selectedRows
//     );

//     console.log(
//       "FINAL DETAIL ROWS:",
//       selectedRows
//     );

//     toast.success(
//       "Products added successfully"
//     );

//   } catch (error) {
//     console.error(
//       "ADD PRODUCT ERROR:",
//       error
//     );

//     toast.error(
//       "Unable to add products"
//     );
//   }
// };

//   // ==========================================================
//   // DELETE DETAIL ROW
//   // ==========================================================

//  // ==========================================================
// // DELETE PRODUCT FROM DETAIL TABLE
// // ==========================================================
// const handleDeleteRow = (index) => {
//   let deletedProductId = "";

//   setRows((previousRows) => {
//     const row =
//       previousRows[index];

//     deletedProductId =
//       row?.ProductId || "";

//     return previousRows.filter(
//       (_, rowIndex) =>
//         rowIndex !== index
//     );
//   });

//   // ========================================================
//   // REMOVE FROM PRODUCT QUANTITY STATE
//   // ========================================================
//   if (deletedProductId) {
//     const key =
//       String(deletedProductId);

//     setProductQuantities(
//       (previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[key];

//         return updated;
//       }
//     );
//   }
// };

//   // ==========================================================
//   // TOTAL
//   // ==========================================================

//   const total = useMemo(() => {
//     return rows.reduce((sum, row) => sum + Number(row.Amount || 0), 0);
//   }, [rows]);

//   const formatDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     // PHP date object response:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     // Handle: YYYY-MM-DD
//     // Handle: YYYY-MM-DD HH:mm:ss
//     // Handle: YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const [, year, month, day] = match;

//       return `${day}-${month}-${year}`;
//     }

//     // Fallback for normal JS date values
//     const d = new Date(dateString);

//     if (Number.isNaN(d.getTime())) {
//       return "";
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA FOR MAIN TABLE
//   // ==========================================================

//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ??
//         item?.AccountName ??
//         item?.Shop ??
//         item?.shop ??
//         "Stock Entry Shop",

//       total: Number(
//         item?.TotalAmount ??
//           item?.totalAmount ??
//           item?.Total ??
//           item?.total ??
//           0,
//       ),
//     }));
//   }, [stockEntries]);

//   // ==========================================================
//   // SAVE DAILY STOCK ENTRY
//   // ==========================================================

//   const handleSave = async () => {
//     if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
//       toast.error("Please select a valid Date");
//       return;
//     }

//     if (rows.length === 0) {
//       toast.error("Please add at least one Product");
//       return;
//     }

//     try {
//       setSaving(true);

//       const entryDate = `${date.getFullYear()}-${String(
//         date.getMonth() + 1,
//       ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//       console.log("FINAL ENTRY DATE:", entryDate);

//       // ============================================
//       // EDIT EXISTING ENTRY
//       // ============================================
//       if (editingEntry) {
//         const headerId = editingEntry?.Id || editingEntry?.id;

//         // ============================================================
// // FETCH OLD DETAILS BEFORE EDIT
// // ============================================================

// const existingDetailData =
//   await fetchDailyStockDetail(headerId);

// console.log(
//   "EXISTING DETAILS BEFORE EDIT:",
//   existingDetailData
// );

// // ============================================================
// // EXISTING DATABASE DETAIL IDS
// // ============================================================

// const existingDetailIds =
//   existingDetailData
//     .map((item) =>
//       Number(item?.Id || item?.id)
//     )
//     .filter(
//       (id) =>
//         Number.isInteger(id) &&
//         id > 0
//     );

// // ============================================================
// // CURRENT DETAILS STILL PRESENT IN UI
// // ============================================================

// const currentDetailIds =
//   rows
//     .map((row) =>
//       Number(row?.Id || row?.id)
//     )
//     .filter(
//       (id) =>
//         Number.isInteger(id) &&
//         id > 0
//     );

// // ============================================================
// // FIND REMOVED DETAILS
// // ============================================================

// const deletedDetailIds =
//   existingDetailIds.filter(
//     (existingId) =>
//       !currentDetailIds.includes(existingId)
//   );

// console.log(
//   "DETAIL IDS REMOVED DURING EDIT:",
//   deletedDetailIds
// );

// // ============================================================
// // DELETE REMOVED DETAILS FROM DATABASE
// // ============================================================

// for (const deletedDetailId of deletedDetailIds) {
//   await deleteDailyStockDetail(
//     deletedDetailId
//   );
// }

//         if (!headerId) {
//           throw new Error("Daily Stock Header ID not found");
//         }

//         // --------------------------------------------
//         // UPDATE HEADER
//         // --------------------------------------------
//         await updateDailyStockHeader(headerId, entryDate, total);

//         console.log("DAILY STOCK HEADER UPDATED:", headerId);

//         // --------------------------------------------
//         // UPDATE / INSERT DETAILS
//         // --------------------------------------------
//         // ============================================================
//         // UPDATE / INSERT DAILY STOCK DETAILS
//         // ============================================================
//         for (const row of rows) {
//           const detailId = row?.Id || row?.id || "";

//           // ==========================================================
//           // EXISTING DETAIL -> UPDATE
//           // ==========================================================
//           if (detailId) {
//             const detailData = new URLSearchParams();

//             detailData.append("Id", String(detailId));

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("UpdatedBy", "1");

//             console.log(
//               "UPDATING DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL UPDATE STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL UPDATE RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail update failed",
//               );
//             }

//             console.log(
//               "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
//               detailResult,
//             );
//           }

//           // ==========================================================
//           // NEW DETAIL -> INSERT
//           // ==========================================================
//           else {
//             const detailData = new URLSearchParams();

//             detailData.append("DailyStockHeaderId", String(headerId));

//             detailData.append("ProductId", String(row?.ProductId || ""));

//             detailData.append("Quantity", String(Number(row?.Quantity || 0)));

//             detailData.append("Rate", String(Number(row?.Rate || 0)));

//             detailData.append("Amount", String(Number(row?.Amount || 0)));

//             detailData.append("CreatedBy", "1");

//             console.log(
//               "ADDING NEW DAILY STOCK DETAIL:",
//               Object.fromEntries(detailData.entries()),
//             );

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//                 redirect: "follow",
//               },
//             );

//             const detailText = await detailResponse.text();

//             console.log(
//               "DAILY STOCK DETAIL INSERT STATUS:",
//               detailResponse.status,
//             );

//             console.log("DAILY STOCK DETAIL INSERT RESPONSE:", detailText);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch {
//               detailResult = {};
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail insert failed",
//               );
//             }

//             console.log("NEW DAILY STOCK DETAIL INSERTED:", detailResult);
//           }
//         }

//         toast.success("Main -Office Stock Entry updated successfully!");

//         setOpenForm(false);
//         resetForm();

//         // Refresh Header list
// await fetchAllDailyStockHeaders();
// await calculateMainOfficeCurrentStock();

// return;
//       }

//       // ============================================
//       // NEW ENTRY
//       // ============================================

//       const headerData = new URLSearchParams();

// headerData.append(
//   "EntryDate",
//   entryDate
// );

// // ==========================================================
// // MAIN OFFICE
// // ==========================================================
// headerData.append(
//   "LocationType",
//   "O"
// );

// headerData.append(
//   "LocationId",
//   String(MAIN_OFFICE_ID)
// );

// // Main Office is NOT a Shop
// headerData.append(
//   "ShopId",
//   ""
// );

// // Main Office ID
// headerData.append(
//   "OfficeId",
//   String(MAIN_OFFICE_ID)
// );

// headerData.append(
//   "TotalAmount",
//   String(Number(total || 0))
// );

// headerData.append(
//   "CreatedBy",
//   "1"
// );

// console.log(
//   "MAIN OFFICE HEADER PAYLOAD:",
//   Object.fromEntries(headerData.entries())
// );

// const headerRequestOptions = {
//   method: "POST",
//   body: headerData,
//   redirect: "follow",
// };

//       const headerResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
//         headerRequestOptions,
//       );

//       if (!headerResponse.ok) {
//         throw new Error(
//           `Daily Stock Header API failed: ${headerResponse.status}`,
//         );
//       }

//       const headerResult = await headerResponse.json();

//       console.log("DAILY STOCK HEADER POST RESPONSE:", headerResult);

//       const headerId =
//         headerResult?.Id ||
//         headerResult?.id ||
//         headerResult?.insert_id ||
//         headerResult?.DailyStockHeaderId ||
//         headerResult?.data?.Id ||
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error("Daily Stock Header ID was not returned from API");
//       }

//       console.log("CREATED DAILY STOCK HEADER ID:", headerId);

//       // --------------------------------------------
//       // POST DETAILS
//       // --------------------------------------------
//       for (const row of rows) {
//         const detailData = new URLSearchParams();

//         detailData.append("DailyStockHeaderId", String(headerId));

//         detailData.append("ProductId", String(row.ProductId || ""));

//         detailData.append("Quantity", String(Number(row.Quantity || 0)));

//         detailData.append("Rate", String(Number(row.Rate || 0)));

//         detailData.append("Amount", String(Number(row.Amount || 0)));

//         detailData.append("CreatedBy", "1");

//         const detailRequestOptions = {
//           method: "POST",
//           body: detailData,
//           redirect: "follow",
//         };

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
//           detailRequestOptions,
//         );

//         if (!detailResponse.ok) {
//           throw new Error(
//             `Daily Stock Detail API failed: ${detailResponse.status}`,
//           );
//         }

//         const detailResult = await detailResponse.json();

//         console.log("DAILY STOCK DETAIL POST RESPONSE:", detailResult);
//       }

//       toast.success(" Stock Entry at Main Office saved successfully!");

//      setOpenForm(false);
// resetForm();

// // Refresh Header list
// await fetchAllDailyStockHeaders();

// // Recalculate Main Office Current Stock
// await calculateMainOfficeCurrentStock();

//       // Refresh Header list
     
//     } catch (error) {
//       console.error("Main Office Daily Stock Save Error:", error);

//       toast.error(error?.message || "Unable to save Daily Stock Entry");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================================
//   // SAFE DATE PARSER
//   // ==========================================================
//   const parseApiDate = (value) => {
//     if (!value) {
//       return null;
//     }

//     // PHP date object
//     // Example:
//     // { date: "2026-09-22 00:00:00.000000", ... }
//     if (typeof value === "object" && value?.date) {
//       value = value.date;
//     }

//     const dateString = String(value).trim();

//     if (!dateString) {
//       return null;
//     }

//     // YYYY-MM-DD
//     // YYYY-MM-DD HH:mm:ss
//     // YYYY-MM-DDTHH:mm:ss
//     const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

//     if (match) {
//       const year = Number(match[1]);
//       const month = Number(match[2]);
//       const day = Number(match[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     // DD-MM-YYYY
//     const ddmmyyyy = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);

//     if (ddmmyyyy) {
//       const day = Number(ddmmyyyy[1]);
//       const month = Number(ddmmyyyy[2]);
//       const year = Number(ddmmyyyy[3]);

//       const result = new Date(year, month - 1, day);

//       if (!Number.isNaN(result.getTime())) {
//         return result;
//       }
//     }

//     return null;
//   };

//   // ==========================================================
//   // EDIT DAILY STOCK ENTRY
//   // ==========================================================
//   const handleEditEntry = async (entry) => {
//     try {
//       console.log("EDIT DAILY STOCK HEADER:", entry);

//       // ========================================================
//       // HEADER ID
//       // ========================================================

//       const headerId = entry?.Id || entry?.id;

//       if (!headerId) {
//         toast.error("Daily Stock Header ID not found");
//         return;
//       }

//       // ========================================================
//       // SET EDITING ENTRY
//       // ========================================================

//       setEditingEntry(entry);
//       setOpenForm(true);

//       // ========================================================
//       // DATE
//       // ========================================================

//       const apiDate = entry?.EntryDate || entry?.date;

//       const parsedDate = parseApiDate(apiDate);

//       console.log("EDIT API DATE:", apiDate);

//       console.log("EDIT PARSED DATE:", parsedDate);

//       if (parsedDate) {
//         setDate(parsedDate);
//       } else {
//         // Important:
//         // Never allow invalid date to reach update API
//         toast.error("Invalid Entry Date received from API");

//         setDate(new Date());
//       }

//       // ========================================================
//       // MAIN OFFICE ALWAYS ID = 2
//       // ========================================================

//       setSelectedShop({
//         Id: MAIN_OFFICE_ID,
//         AccountName: "Main Office",
//       });

//       // ========================================================
//       // FETCH DETAILS
//       // ========================================================

//       const detailData = await fetchDailyStockDetail(headerId);

//       console.log("EDIT DAILY STOCK DETAIL:", detailData);

//       // ========================================================
//       // MAP DETAIL DATA
//       // ========================================================

//       const detailRows = detailData.map((item) => ({
//         Id: item?.Id || item?.id || "",

//         ProductId: item?.ProductId || item?.productId || 0,

//         ProductCode:
//           item?.ProductCode || item?.Code || item?.ProductCodeNo || "",

//         ProductName: item?.ProductName || item?.Name || "",

//         Quantity: Number(item?.Quantity ?? item?.quantity ?? 0),

//         Rate: Number(item?.Rate ?? item?.rate ?? 0),

//         Amount: Number(item?.Amount ?? item?.amount ?? 0),
//       }));

//       console.log("EDIT MAPPED DETAIL ROWS:", detailRows);

//       setRows(detailRows);

//       // ========================================================
// // LOAD EDIT DATA INTO PRODUCT QUANTITY STATE
// // ========================================================
// const editedQuantities = {};
// const editedRates = {};

// detailRows.forEach((row) => {
//   const key =
//     String(row.ProductId);

//   editedQuantities[key] = {
//     quantity:
//       String(row.Quantity ?? 0),

//     // IMPORTANT
//     // Keep database detail ID
//     detailId:
//       row.Id || "",
//   };

//   editedRates[key] =
//     Number(row.Rate || 0);
// });

// // ========================================================
// // SET BOTH STATES
// // ========================================================
// setRows(detailRows);

// setProductQuantities(
//   editedQuantities
// );

// setProductRates(
//   editedRates
// );

//     } catch (error) {
//       console.error("Edit Daily Stock Entry Error:", error);

//       toast.error("Unable to load Daily Stock Entry");
//     }
//   };


//  const handleDeleteEntry = async (id) => {
//   if (!id) {
//     toast.error("Stock Entry ID not found");
//     return;
//   }

//   try {
//     setSaving(true);

//     // ========================================================
// // FETCH DETAILS OF THIS HEADER
// // ========================================================

// const detailData =
//   await fetchDailyStockDetail(id);

// console.log(
//   "DETAILS BEFORE HEADER DELETE:",
//   detailData
// );

// // ========================================================
// // DELETE ALL DETAILS FIRST
// // ========================================================

// const detailIds =
//   detailData
//     .map((item) =>
//       Number(item?.Id || item?.id)
//     )
//     .filter(
//       (detailId) =>
//         Number.isInteger(detailId) &&
//         detailId > 0
//     );

// for (const detailId of detailIds) {
//   await deleteDailyStockDetail(
//     detailId
//   );
// }

//     const deleteUrl =
//       `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//       `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//     console.log("======================================");
//     console.log("DELETE MAIN OFFICE STOCK ENTRY");
//     console.log("DELETE URL:", deleteUrl);
//     console.log("HEADER ID:", id);
//     console.log("======================================");

//     const response = await fetch(deleteUrl, {
//       method: "GET",
//       redirect: "follow",
//     });

//     const responseText = await response.text();

//     console.log("DELETE API STATUS:", response.status);
//     console.log("DELETE API RESPONSE:", responseText);

//     if (!response.ok) {
//       throw new Error(
//         `Delete API failed: ${response.status}`
//       );
//     }

//     // -----------------------------------------
//     // CHECK API RESPONSE
//     // -----------------------------------------

//     let result = {};

//     try {
//       result = responseText
//         ? JSON.parse(responseText)
//         : {};
//     } catch {
//       result = {};
//     }

//     console.log("DELETE PARSED RESPONSE:", result);

//     if (result?.success === false) {
//       throw new Error(
//         result?.message ||
//           "Main Office Stock Entry delete failed"
//       );
//     }

//     // -----------------------------------------
//     // REMOVE FROM UI
//     // -----------------------------------------

//     setStockEntries((previousEntries) =>
//       previousEntries.filter(
//         (item) =>
//           Number(item?.id) !== Number(id) &&
//           Number(item?.Id) !== Number(id)
//       )
//     );

//     // -----------------------------------------
//     // REFRESH DATABASE DATA
//     // -----------------------------------------

//     await fetchAllDailyStockHeaders();

//     // -----------------------------------------
//     // RECALCULATE MAIN OFFICE STOCK
//     // -----------------------------------------

//     await calculateMainOfficeCurrentStock();

//     toast.success(
//       "Main Office Stock Entry deleted successfully!"
//     );

//   } catch (error) {
//     console.error(
//       "DELETE MAIN OFFICE STOCK ENTRY ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to delete Main Office Stock Entry"
//     );

//   } finally {
//     setSaving(false);
//   }
// };

//   // ==========================================================
//   // TOTAL PAGES
//   // ==========================================================

//   const totalPages =
//     mappedStockEntries.length === 0
//       ? 0
//       : Math.ceil(mappedStockEntries.length / pageSize);

//   const paginatedStockEntries = useMemo(() => {
//     const startIndex = (pageNo - 1) * pageSize;
//     const endIndex = startIndex + pageSize;

//     return mappedStockEntries.slice(startIndex, endIndex);
//   }, [mappedStockEntries, pageNo]);

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
//           const index = mappedStockEntries.findIndex(
//             (item) => item.id === row.original.id,
//           );

//           return index + 1;
//         },
//       },

//       {
//         accessorKey: "dateText",
//         header: "Date",
//         size: 150,

//         Cell: ({ cell }) => cell.getValue(),
//       },

//       {
//         accessorKey: "shop",
//         header: "Shop",
//         size: 250,
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
//         size: 150,

//         enableSorting: false,
//         enableColumnFilter: false,

//         Cell: ({ row }) => (
//           <Box display="flex" justifyContent="center">
//             <Tooltip title="Edit">
//               <IconButton
//                 size="small"
//                 onClick={() => handleEditEntry(row.original)}
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Delete">
//               <IconButton
//                 color="error"
//                 size="small"
//                 onClick={() => handleDeleteEntry(row.original.id)}
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         ),
//       },
//     ],
//     [mappedStockEntries, handleEditEntry, handleDeleteEntry],
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
//         {/* ====================================================
//             PAGE TITLE
//         ==================================================== */}

//         <Box textAlign="center" mb={5}>
//           <Typography color="var(--complementary-color)" variant="h4">
//             <b> Stock Entry at Main Office</b>
//           </Typography>
//         </Box>

//         {/* ====================================================
//             TABLE SECTION
//         ==================================================== */}

//         <Box
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* ==================================================
//               CREATE BUTTON
//           ================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             <Button
//               sx={{
//                 background: "var(--complementary-color)",

//                 "&:hover": {
//                   background: "var(--complementary-color)",
//                 },

//                 borderRadius: "5px 5px 0 0",

//                 textTransform: "uppercase",

//                 fontSize: "16px",

//                 fontWeight: 500,

//                 px: 2.5,

//                 py: 1.5,
//               }}
//               variant="contained"
//               onClick={handleOpenForm}
//             >
//               CREATE DAILY STOCK ENTRY AT MAIN OFFICE
//             </Button>
//           </Box>

//           {/* ==================================================
//               MATERIAL REACT TABLE
//           ================================================== */}

//           <MaterialReactTable
//             columns={columns}
//             data={paginatedStockEntries}
//             enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",

//                 color: "black",

//                 fontSize: "16px",

//                 fontWeight: "bold",
//               },
//             }}
//             muiTableBodyCellProps={{
//               sx: {
//                 fontSize: "15px",
//               },
//             }}
//             muiTablePaperProps={{
//               elevation: 2,

//               sx: {
//                 borderRadius: "0 4px 4px 4px",

//                 overflow: "hidden",

//                 boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
//               },
//             }}
//             muiTableContainerProps={{
//               sx: {
//                 maxHeight: "none",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 mb={1}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//                 pr={2}
//                 gap={0.5}
//               >
//                 {/* FIRST PAGE */}

//                 <FirstPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(1);
//                     }
//                   }}
//                 />

//                 {/* PREVIOUS */}

//                 <KeyboardArrowLeftIcon
//                   sx={{
//                     cursor: pageNo > 1 ? "pointer" : "default",

//                     color: pageNo > 1 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1));
//                   }}
//                 />

//                 {/* PAGE NO */}

//                 <Box ml={1}>Page No</Box>

//                 <TextField
//                   sx={{
//                     width: "65px",

//                     ml: 1,

//                     "& .MuiInputBase-input": {
//                       textAlign: "center",

//                       padding: "8px 5px",
//                     },

//                     "@media (max-width: 768px)": {
//                       width: "60px",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => {
//                     let value = Number(e.target.value);

//                     if (value < 1 || isNaN(value)) {
//                       value = 1;
//                     }

//                     if (totalPages > 0 && value > totalPages) {
//                       value = totalPages;
//                     }

//                     setPageNo(value);
//                   }}
//                   size="small"
//                 />

//                 {/* NEXT */}

//                 <KeyboardArrowRightIcon
//                   sx={{
//                     cursor: pageNo < totalPages ? "pointer" : "default",

//                     color: pageNo < totalPages ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (pageNo < totalPages) {
//                       setPageNo((prev) => Number(prev) + 1);
//                     }
//                   }}
//                 />

//                 {/* LAST PAGE */}

//                 <LastPageIcon
//                   sx={{
//                     cursor: totalPages > 0 ? "pointer" : "default",

//                     color: totalPages > 0 ? "inherit" : "#ccc",
//                   }}
//                   onClick={() => {
//                     if (totalPages > 0) {
//                       setPageNo(totalPages);
//                     }
//                   }}
//                 />

//                 {/* TOTAL PAGES */}

//                 <Box ml={1}>Total Pages: {totalPages}</Box>
//               </Box>
//             )}
//           />
//         </Box>

//         {/* ====================================================
//             MAIN OFFICE DAILY STOCK FORM
//         ==================================================== */}

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
//               DIALOG HEADER
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
//               Stock Entry at Main Office
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
//               DIALOG CONTENT
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
//                 MAIN OFFICE + DATE
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
//               {/* MAIN OFFICE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Main Office:
//                 </Typography>

//                 <TextField
//                   value="Main Office"
//                   size="small"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box>

//               {/* DATE */}

//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Date:
//                 </Typography>

//                 <DatePicker
//                   value={date}
//                   onChange={(newValue) => setDate(newValue)}
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
//                 PRODUCT
//             ================================================= */}

//             <Box
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                 Product:
//               </Typography>

//               {/* =================================================
//     PRODUCT SEARCH + PRODUCT SELECTION TABLE
// ================================================= */}

//               <Box sx={{ mb: 2 }}>
//                 {/* SEARCH */}
//                 {/* <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography> */}

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Search Product / Code"
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   sx={{ mb: 1.5 }}
//                 />

//                 {/* PRODUCT TABLE */}
//                 <Box
//                   sx={{
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                     overflow: "hidden",
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {/* TABLE HEADER */}
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 2fr 1fr 1fr",
//                       backgroundColor: "#e9edf1",
//                       borderBottom: "1px solid #ccc",
//                       fontWeight: 700,
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Code
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Product Name
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "center",
//                         borderRight: "1px solid #ccc",
//                       }}
//                     >
//                       Quantity
//                     </Box>

//                     <Box
//                       sx={{
//                         p: 1.2,
//                         textAlign: "right",
//                       }}
//                     >
//                       Rate
//                     </Box>
//                   </Box>

//                   {/* PRODUCT ROWS */}

//                   {/* PRODUCT ROWS */}

// {filteredProductOptions.map((product) => {
//   const productId =
//     String(product.value);

//   // Current quantity
//  const quantity =
//   productQuantities?.[productId]?.quantity;

// const quantityDisplay =
//   quantity === undefined ||
//   quantity === null
//     ? "0"
//     : String(quantity);

//   // Current rate
//   const rate =
//     productRates?.[productId] ??
//     Number(product.rate || 0);

//   return (
//     <Box
//       key={productId}
//       sx={{
//         display: "grid",
//         gridTemplateColumns:
//           "1fr 2fr 1fr 1fr",
//         borderBottom:
//           "1px solid #ddd",
//         alignItems: "center",

//         "&:hover": {
//           backgroundColor:
//             "#fafafa",
//         },
//       }}
//     >

//       {/* PRODUCT CODE */}
//       <Box
//         sx={{
//           p: 1.2,
//           borderRight:
//             "1px solid #ddd",
//         }}
//       >
//         {product.productCode}
//       </Box>

//       {/* PRODUCT NAME */}
//       <Box
//         sx={{
//           p: 1.2,
//           borderRight:
//             "1px solid #ddd",
//         }}
//       >
//         {product.label}
//       </Box>

//       {/* QUANTITY */}
//       <Box
//         sx={{
//           p: 1,
//           borderRight:
//             "1px solid #ddd",
//           display: "flex",
//           justifyContent:
//             "center",
//         }}
//       >
//         <TextField
//   size="small"
//   type="number"

//   // ========================================================
//   // DEFAULT = 0
//   // पण Backspace केल्यावर blank होऊ शकते
//   // ========================================================
//   value={quantityDisplay}

//   // ========================================================
//   // QUANTITY CHANGE
//   // ========================================================
//   onChange={(e) => {
//     handleProductQuantityChange(
//       product.value,
//       e.target.value
//     );
//   }}

//   // ========================================================
//   // 0 वर click/focus केल्यावर 0 select होईल
//   // म्हणून 010 problem येणार नाही
//   // ========================================================
//   onFocus={(e) => {
//     if (e.target.value === "0") {
//       e.target.select();
//     }
//   }}

//   onClick={(e) => {
//     if (e.target.value === "0") {
//       e.target.select();
//     }
//   }}

//   // ========================================================
//   // ENTER -> NEXT ROW
//   // ========================================================
//   onKeyDown={(e) => {
//     if (e.key !== "Enter") {
//       return;
//     }

//     e.preventDefault();

//     const currentInput =
//       e.target;

//     // Blank असेल तर 0 save करा
//     if (currentInput.value === "") {
//       handleProductQuantityChange(
//         product.value,
//         "0"
//       );
//     }

//     const currentIndex =
//       filteredProductOptions.findIndex(
//         (item) =>
//           String(item.value) ===
//           String(product.value)
//       );

//     const nextProduct =
//       filteredProductOptions[
//         currentIndex + 1
//       ];

//     if (!nextProduct) {
//       return;
//     }

//     const nextInput =
//       quantityInputRefs.current[
//         String(nextProduct.value)
//       ];

//     if (nextInput) {
//       requestAnimationFrame(() => {
//         nextInput.focus();

//         // 0 असेल तर select करा
//         if (nextInput.value === "0") {
//           nextInput.select();
//         }
//       });
//     }
//   }}

//   inputRef={(input) => {
//     quantityInputRefs.current[
//       productId
//     ] = input;
//   }}

//   inputProps={{
//     min: 0,
//     step: 1,
//   }}

//   sx={{
//     width: "150px",
//   }}
// />
//       </Box>

//       {/* RATE */}
//       <Box
//         sx={{
//           p: 1,
//           display: "flex",
//           justifyContent:
//             "center",
//         }}
//       >
//         <TextField
//           size="small"
//           type="number"

//           value={rate}

//          onChange={(e) => {
//   const value =
//     e.target.value;

//   const newRate =
//     value === ""
//       ? 0
//       : Number(value);

//   // ======================================================
//   // UPDATE RATE STATE
//   // ======================================================
//   setProductRates(
//     (previous) => ({
//       ...previous,

//       [productId]:
//         newRate,
//     })
//   );

//   // ======================================================
//   // UPDATE LOWER DETAIL TABLE
//   // ======================================================
//   setRows(
//     (previousRows) =>
//       previousRows.map((row) => {
//         if (
//           String(row.ProductId) !==
//           productId
//         ) {
//           return row;
//         }

//         const rowQuantity =
//           Number(
//             row.Quantity || 0
//           );

//         return {
//           ...row,

//           Rate:
//             newRate,

//           Amount:
//             rowQuantity *
//             newRate,
//         };
//       })
//   );
// }}

//           inputProps={{
//             min: 0,
//             step: "0.01",
//           }}

//           sx={{
//             width: "110px",
//           }}
//         />
//       </Box>

//     </Box>
//   );
// })}
                       

//                   {/* NO PRODUCT */}

//                   {productOptions.filter((product) => {
//                     const search = String(productSearch || "")
//                       .trim()
//                       .toLowerCase();

//                     if (!search) {
//                       return true;
//                     }

//                     return (
//                       String(product.productCode || "")
//                         .toLowerCase()
//                         .includes(search) ||
//                       String(product.label || "")
//                         .toLowerCase()
//                         .includes(search)
//                     );
//                   }).length === 0 && (
//                     <Box
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         color: "text.secondary",
//                       }}
//                     >
//                       No products found
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Box>

//             {/* =================================================
//                 QUANTITY + RATE + ADD
//             ================================================= */}

//             <Box
//               sx={{
//                 display: "grid",

//                 gridTemplateColumns: {
//                   xs: "1fr",

//                   sm: "1fr 1fr auto",
//                 },

//                 gap: 1.5,

//                 alignItems: "end",

//                 mb: 2,
//               }}
//             >
//               {/* QUANTITY */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Quantity:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   placeholder="Enter Quantity"
//                   fullWidth
//                 />
//               </Box> */}

//               {/* RATE */}

//               {/* <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Rate:
//                 </Typography>

//                 <TextField
//                   type="number"
//                   size="small"
//                   value={rate}
//                   placeholder="Rate"
//                   fullWidth
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </Box> */}

//               {/* ADD */}

//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   height: "40px",

//                   px: 2.5,

//                   textTransform: "none",

//                   background: "var(--complementary-color)",

//                   "&:hover": {
//                     background: "var(--complementary-color)",
//                   },
//                 }}
//               >
//                 Add
//               </Button>
//             </Box>

//             <Divider
//               sx={{
//                 mb: 1.5,
//               }}
//             />

//             {/* =================================================
//                 PRODUCT DETAIL TABLE
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
//                       Product Code
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Name
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Rate
//                     </TableCell>

//                     <TableCell
//                       align="right"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Amount
//                     </TableCell>

//                     <TableCell
//                       align="center"
//                       sx={{
//                         fontWeight: 700,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         align="center"
//                         sx={{
//                           height: "75px",

//                           color: "#777",

//                           fontStyle: "italic",
//                         }}
//                       >
//                         No products added
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.map((row, index) => (
//                       <TableRow hover key={`${row.ProductId}-${index}`}>
//                         <TableCell>{row.ProductCode}</TableCell>

//                         <TableCell>{row.ProductName}</TableCell>

//                         <TableCell align="center">{row.Quantity}</TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Rate).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="right">
//                           ₹ {Number(row.Amount).toFixed(2)}
//                         </TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="Delete">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* =================================================
//                 TOTAL
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
//               <Typography fontWeight={600} fontSize="14px">
//                 Total:
//               </Typography>

//               <TextField
//                 size="small"
//                 value={Number(total).toFixed(2)}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 sx={{
//                   width: 140,
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           {/* ==================================================
//               DIALOG ACTIONS
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
//     </LocalizationProvider>
//   );
// };

// export default DailyStockEntryAtMainOffice;



























import React, { useEffect, useMemo, useState, useRef } from "react";

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



import { createFilterOptions } from "@mui/material/Autocomplete";

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

const DailyStockEntryAtMainOffice = () => {



    const quantityInputRefs = useRef({});
  // ==========================================================
  // MAIN TABLE DATA
  // ==========================================================

  const MAIN_OFFICE_ID = 2;

  const preventNumberInputScroll = (event) => {
  event.currentTarget.blur();
};

  const [stockEntries, setStockEntries] = useState([]);


  // ==========================================================
// OLD DETAIL STATE
// Used by existing Save / Edit / Total logic
// ==========================================================
const [quantity, setQuantity] = useState("");
const [rate, setRate] = useState("");
const [rows, setRows] = useState([]);

  // ==========================================================
  // FORM DIALOG
  // ==========================================================

  const [openForm, setOpenForm] = useState(false);

  const [saving, setSaving] = useState(false);

 const createdBy =
  sessionStorage.getItem("CreatedBy") || "";

const updatedBy =
  sessionStorage.getItem("CreatedBy") || "";

  // ==========================================================
  // SHOP / ACCOUNT
  // ==========================================================

  const [shopOptions, setShopOptions] = useState([]);

  const [selectedShop, setSelectedShop] = useState({
    Id: MAIN_OFFICE_ID,
    AccountName: "Main Office",
  });

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

  const [productSearch, setProductSearch] = useState("");



  const filteredProductOptions = useMemo(() => {
  const search = String(productSearch || "")
    .trim()
    .toLowerCase();

  if (!search) {
    return productOptions;
  }

  return productOptions.filter((product) => {
    const productCode = String(
      product?.productCode || ""
    ).toLowerCase();

    const productName = String(
      product?.label || ""
    ).toLowerCase();

    return (
      productCode.includes(search) ||
      productName.includes(search)
    );
  });
}, [productOptions, productSearch]);














const handleQuantityKeyDown = (
  event,
  currentProductId
) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();

  const currentIndex =
    filteredProductOptions.findIndex(
      (product) =>
        String(product.value) ===
        String(currentProductId)
    );

  if (currentIndex === -1) {
    return;
  }

  const nextProduct =
    filteredProductOptions[currentIndex + 1];

  if (!nextProduct) {
    return;
  }

  const nextInput =
    quantityInputRefs.current[
      String(nextProduct.value)
    ];

  if (nextInput) {
    requestAnimationFrame(() => {
      nextInput.focus();
      nextInput.select();
    });
  }
};



  // ==========================================================
  // QUANTITY / RATE
  // ==========================================================

 const [productQuantities, setProductQuantities] = useState({});
const [productRates, setProductRates] = useState({});

  // ==========================================================
  // PAGE NUMBER
  // ==========================================================

  const [pageNo, setPageNo] = useState(1);

  const pageSize = 10;


  const [mainOfficeCurrentStock, setMainOfficeCurrentStock] = useState({});


const calculateDailySoldQuantity = async () => {
  try {
    console.log(
      "=========================================="
    );
    console.log(
      "CALCULATING TOTAL DAILY SHOP SALES"
    );
    console.log(
      "=========================================="
    );

    // ======================================================
    // 1. GET ALL DAILY STOCK HEADERS
    // ======================================================

    const headerResponse = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
    );

    if (!headerResponse.ok) {
      throw new Error(
        `Daily Stock Header API failed: ${headerResponse.status}`
      );
    }

    const headerResult =
      await headerResponse.json();

    let headers = [];

    if (Array.isArray(headerResult)) {
      headers = headerResult;
    } else if (
      Array.isArray(headerResult?.data)
    ) {
      headers = headerResult.data;
    }

    // ======================================================
    // 2. ONLY SHOP DAILY STOCK ENTRIES
    //
    // LocationType = S
    //
    // These are the daily sales/stock entries
    // ======================================================

    const shopHeaders = headers.filter((item) => {
      const locationType = String(
        item?.LocationType ??
          item?.locationType ??
          ""
      )
        .trim()
        .toUpperCase();

      return locationType === "S";
    });

    console.log(
      "TOTAL SHOP DAILY STOCK HEADERS:",
      shopHeaders.length
    );

    console.log(
      "SHOP DAILY STOCK HEADERS:",
      shopHeaders
    );

    // ======================================================
    // 3. PRODUCT-WISE TOTAL SALE
    // ======================================================

    const soldMap = {};

    // ======================================================
    // 4. FETCH DETAILS OF EVERY SHOP ENTRY
    // ======================================================

    for (const header of shopHeaders) {

      const headerId =
        header?.Id ??
        header?.id ??
        header?.DailyStockHeaderId;

      if (!headerId) {
        continue;
      }

      try {

        const detailResponse = await fetch(
          `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
        );

        if (!detailResponse.ok) {
          console.warn(
            "DETAIL API FAILED:",
            headerId,
            detailResponse.status
          );

          continue;
        }

        const detailResult =
          await detailResponse.json();

        let details = [];

        if (Array.isArray(detailResult)) {
          details = detailResult;
        } else if (
          Array.isArray(detailResult?.data)
        ) {
          details = detailResult.data;
        }

        // ==================================================
        // PRODUCT-WISE QUANTITY
        // ==================================================

        details.forEach((detail) => {

          const productId = String(
            detail?.ProductId ??
              detail?.productId ??
              ""
          ).trim();

          if (!productId) {
            return;
          }

          const quantity = Number(
            detail?.Quantity ??
              detail?.quantity ??
              0
          );

          if (
            !Number.isFinite(quantity) ||
            quantity <= 0
          ) {
            return;
          }

          soldMap[productId] =
            Number(soldMap[productId] || 0) +
            quantity;
        });

      } catch (detailError) {

        console.error(
          `ERROR FETCHING SHOP DETAIL ${headerId}:`,
          detailError
        );

        continue;
      }
    }

    console.log(
      "=========================================="
    );

    console.log(
      "TOTAL SHOP SALE PRODUCT-WISE:"
    );

    console.log(soldMap);

    console.log(
      "=========================================="
    );

    return soldMap;

  } catch (error) {

    console.error(
      "DAILY SOLD QUANTITY CALCULATION ERROR:",
      error
    );

    return {};
  }
};





const calculateMainOfficeOpeningStock = async () => {
  try {
    // ======================================================
    // GET ALL MAIN OFFICE STOCK ENTRY HEADERS
    // ======================================================

    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
    );

    if (!response.ok) {
      throw new Error("Main Office Stock Header API failed");
    }

    const result = await response.json();

    let headers = [];

    if (Array.isArray(result)) {
      headers = result;
    } else if (Array.isArray(result?.data)) {
      headers = result.data;
    }

    // ======================================================
    // ONLY MAIN OFFICE ENTRIES
    // ======================================================

    const mainOfficeHeaders = headers.filter((item) => {
      const locationType = String(
        item?.LocationType ??
        item?.locationType ??
        ""
      )
        .trim()
        .toUpperCase();

      const officeId = String(
        item?.OfficeId ??
        item?.officeId ??
        item?.LocationId ??
        item?.locationId ??
        ""
      ).trim();

      return (
        locationType === "O" &&
        officeId === String(MAIN_OFFICE_ID)
      );
    });

    // ======================================================
    // PRODUCT-WISE OPENING STOCK
    // ======================================================

    const openingStockMap = {};

    for (const header of mainOfficeHeaders) {
      const headerId =
        header?.Id ??
        header?.id ??
        header?.DailyStockHeaderId;

      if (!headerId) {
        continue;
      }

      const detailResponse = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
      );

      if (!detailResponse.ok) {
        continue;
      }

      const detailResult = await detailResponse.json();

      let details = [];

      if (Array.isArray(detailResult)) {
        details = detailResult;
      } else if (Array.isArray(detailResult?.data)) {
        details = detailResult.data;
      }

      details.forEach((detail) => {
        const productId = String(
          detail?.ProductId ??
          detail?.productId ??
          ""
        ).trim();

        if (!productId) {
          return;
        }

        const quantity = Number(
          detail?.Quantity ??
          detail?.quantity ??
          0
        );

        const productName =
          detail?.ProductName ??
          detail?.Name ??
          "";

        if (!openingStockMap[productId]) {
          openingStockMap[productId] = {
            openingStock: 0,
            productName,
          };
        }

        openingStockMap[productId].openingStock += quantity;
      });
    }

    console.log(
      "MAIN OFFICE OPENING STOCK:",
      openingStockMap
    );

    return openingStockMap;

  } catch (error) {
    console.error(
      "MAIN OFFICE OPENING STOCK ERROR:",
      error
    );

    return {};
  }
};













const calculateMainOfficeCurrentStock = async () => {
  try {
    // ======================================================
    // 1. GET MAIN OFFICE OPENING STOCK
    // ======================================================

    const openingStockMap =
      await calculateMainOfficeOpeningStock();

    // ======================================================
    // 2. GET TOTAL DAILY SALES
    // ======================================================

    const soldMap =
      await calculateDailySoldQuantity();

    // ======================================================
    // 3. CALCULATE CURRENT STOCK
    // ======================================================

    const currentStockMap = {};

    Object.keys(openingStockMap).forEach((productId) => {
      const openingStock = Number(
        openingStockMap[productId]?.openingStock || 0
      );

      const totalSold = Number(
        soldMap[productId] || 0
      );

      // IMPORTANT:
      // Negative value is allowed.
      //
      // 200 - 50 = 150
      // 200 - 150 = 50
      // 200 - 210 = -10

      const currentStock =
        openingStock - totalSold;

      currentStockMap[productId] = {
        productName:
          openingStockMap[productId]?.productName || "",

        openingStock,

        totalSold,

        currentStock,
      };
    });

    // ======================================================
    // SAVE CURRENT STOCK IN STATE
    // ======================================================

    setMainOfficeCurrentStock(currentStockMap);

    console.log(
      "=========================================="
    );

    console.log(
      "MAIN OFFICE CURRENT STOCK:"
    );

    console.log(currentStockMap);

    console.log(
      "=========================================="
    );

    // ======================================================
    // CHECK STOCK
    // ======================================================

    

    return currentStockMap;

  } catch (error) {
    console.error(
      "MAIN OFFICE CURRENT STOCK ERROR:",
      error
    );

    return {};
  }
};







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
        requestOptions,
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
            String(item?.ProductName).trim() !== "",
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

  const handleRateChange = (event) => {
    const value = event.target.value;

    if (value === "" || Number(value) >= 0) {
      setRate(value);
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
        },
      );

      if (!response.ok) {
        throw new Error(`Daily Stock Header API failed: ${response.status}`);
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
        shop: item?.ShopName || item?.shop || "",

        // Total Amount
        total: Number(item?.TotalAmount ?? item?.total ?? 0),
      }));

      console.log("MAPPED DAILY STOCK HEADER DATA:", mappedData);

      setStockEntries(mappedData);

      return mappedData;
    } catch (error) {
      console.error("Daily Stock Header API Error:", error);

      toast.error("Daily Stock Header data could not be loaded");

      return [];
    }
  };

  // ==========================================================
  // FETCH ALL DAILY STOCK HEADERS - STOCK ENTRY SHOP
  // ==========================================================
  const fetchAllDailyStockHeaders = async () => {
    try {
      console.log("========================================");
      console.log("FETCHING ALL DAILY STOCK HEADERS");
      console.log("========================================");

      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          redirect: "follow",
        },
      );

      console.log("DAILY STOCK HEADER LIST STATUS:", response.status);

      const rawText = await response.text();

      console.log("DAILY STOCK HEADER LIST RAW RESPONSE:", rawText);

      if (!response.ok) {
        throw new Error(
          `Daily Stock Header List API failed: ${response.status}`,
        );
      }

      let result;

      try {
        result = rawText ? JSON.parse(rawText) : {};
      } catch (error) {
        console.error("DAILY STOCK HEADER LIST JSON ERROR:", error);

        throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
      }

      console.log("DAILY STOCK HEADER LIST RESPONSE:", result);

      // ======================================================
      // NORMALIZE RESPONSE
      // ======================================================

      let data = [];

      if (Array.isArray(result)) {
        data = result;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      } else if (result?.success && result?.data) {
        data = Array.isArray(result.data) ? result.data : [result.data];
      }

      console.log("DAILY STOCK HEADER LIST DATA:", data);

      // ======================================================
      // ONLY STOCK ENTRY SHOP
      // ======================================================

     // ======================================================
// ONLY MAIN OFFICE ENTRIES
// LocationType = "O"
// OfficeId = MAIN_OFFICE_ID
// ======================================================

const officeEntries = data.filter((item) => {
  const locationType = String(
    item?.LocationType ??
      item?.locationType ??
      ""
  )
    .trim()
    .toUpperCase();

  const officeId = String(
    item?.OfficeId ??
      item?.officeId ??
      item?.LocationId ??
      item?.locationId ??
      ""
  ).trim();

  return (
    locationType === "O" &&
    officeId === String(MAIN_OFFICE_ID)
  );
});

console.log(
  "=========================================="
);

console.log(
  "MAIN OFFICE HEADER RECORDS:"
);

console.log(
  "TOTAL MAIN OFFICE RECORDS:",
  officeEntries.length
);

console.log(
  "MAIN OFFICE RECORDS:",
  officeEntries
);

      // ======================================================
      // MAP DATA FOR TABLE
      // ======================================================

     // ======================================================
// MAP DATA FOR MAIN OFFICE TABLE
// ======================================================

const mappedData = officeEntries.map((item) => ({
  ...item,

  // --------------------------------------------------
  // ID
  // --------------------------------------------------

  Id:
    item?.Id ??
    item?.id ??
    item?.DailyStockHeaderId ??
    "",

  id:
    item?.Id ??
    item?.id ??
    item?.DailyStockHeaderId ??
    "",

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  EntryDate:
    item?.EntryDate ??
    item?.entryDate ??
    item?.date ??
    "",

  dateText:
    item?.EntryDate
      ? formatDate(item.EntryDate)
      : item?.entryDate
        ? formatDate(item.entryDate)
        : item?.date
          ? formatDate(item.date)
          : "",

  // --------------------------------------------------
  // MAIN OFFICE
  // --------------------------------------------------

  LocationType:
    String(
      item?.LocationType ??
        item?.locationType ??
        "O"
    )
      .trim()
      .toUpperCase(),

  LocationId:
    item?.LocationId ??
    item?.locationId ??
    MAIN_OFFICE_ID,

  OfficeId:
    item?.OfficeId ??
    item?.officeId ??
    MAIN_OFFICE_ID,

  ShopId:
    item?.ShopId ??
    item?.shopId ??
    null,

  ShopName:
    item?.ShopName ??
    item?.AccountName ??
    item?.Shop ??
    item?.shop ??
    "Main Office",

  shop:
    item?.ShopName ??
    item?.AccountName ??
    item?.Shop ??
    item?.shop ??
    "Main Office",

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  TotalAmount: Number(
    item?.TotalAmount ??
      item?.totalAmount ??
      item?.Total ??
      item?.total ??
      0
  ),

  total: Number(
    item?.TotalAmount ??
      item?.totalAmount ??
      item?.Total ??
      item?.total ??
      0
  ),
}));

// ======================================================
// NEWEST RECORD FIRST
// ======================================================

mappedData.sort((a, b) => {
  return Number(b?.Id || 0) - Number(a?.Id || 0);
});

console.log(
  "=========================================="
);

console.log(
  "FINAL MAIN OFFICE LIST:"
);

console.log(
  "TOTAL MAIN OFFICE RECORDS:",
  mappedData.length
);

console.log(
  "MAPPED MAIN OFFICE RECORDS:",
  mappedData
);

// ======================================================
// SET TABLE DATA
// ======================================================

setStockEntries(mappedData);

// Reset pagination
setPageNo(1);

return mappedData;

      // ======================================================
      // NEWEST RECORD FIRST
      // ======================================================

    
    } catch (error) {
      console.error("❌ FETCH DAILY STOCK HEADER LIST ERROR:", error);

      toast.error(
        error?.message || "Daily Stock Header list could not be loaded",
      );

      setStockEntries([]);

      return [];
    }
  };

  // ==========================================================
// FETCH DAILY STOCK DETAIL BY HEADER ID
// ==========================================================
const fetchDailyStockDetail = async (headerId) => {
  try {
    const id = Number(headerId);

    console.log(
      "======================================"
    );
    console.log(
      "FETCH DAILY STOCK DETAIL"
    );
    console.log(
      "HEADER ID:",
      id
    );
    console.log(
      "======================================"
    );

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        `Invalid Daily Stock Header ID: ${headerId}`
      );
    }

    // IMPORTANT
    // Use DailyStockHeaderId for Edit/Detail GET
    const url =
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php` +
      `?DailyStockHeaderId=${encodeURIComponent(id)}`;

    console.log(
      "DAILY STOCK DETAIL GET URL:",
      url
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      redirect: "follow",
    });

    console.log(
      "DAILY STOCK DETAIL STATUS:",
      response.status
    );

    const responseText =
      await response.text();

    console.log(
      "DAILY STOCK DETAIL RAW RESPONSE:",
      responseText
    );

    if (!response.ok) {
      throw new Error(
        `Daily Stock Detail API failed: ${response.status}`
      );
    }

    let result = {};

    try {
      result = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      throw new Error(
        `Invalid Daily Stock Detail API response: ${responseText}`
      );
    }

    console.log(
      "DAILY STOCK DETAIL PARSED RESPONSE:",
      result
    );

    if (result?.success === false) {
      throw new Error(
        result?.message ||
        "Daily Stock Detail data could not be loaded"
      );
    }

    let data = [];

    if (Array.isArray(result)) {
      data = result;
    } else if (Array.isArray(result?.data)) {
      data = result.data;
    } else if (
      result?.data &&
      typeof result.data === "object"
    ) {
      data = [result.data];
    } else if (
      result &&
      typeof result === "object" &&
      result?.Id
    ) {
      data = [result];
    }

    console.log(
      "FINAL DAILY STOCK DETAIL DATA:",
      data
    );

    return data;

  } catch (error) {
    console.error(
      "DAILY STOCK DETAIL FETCH ERROR:",
      error
    );

    toast.error(
      error?.message ||
      "Daily Stock Detail data could not be loaded"
    );

    return [];
  }
};

  // ==========================================================
// DELETE DAILY STOCK DETAIL
// ==========================================================
const deleteDailyStockDetail = async (detailId) => {
  if (!detailId) {
    throw new Error("Daily Stock Detail ID not found");
  }

  const deleteUrl =
    `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
    `?Table=dailystockdetail&Id=${encodeURIComponent(detailId)}`;

  console.log("======================================");
  console.log("DELETE DAILY STOCK DETAIL");
  console.log("DETAIL ID:", detailId);
  console.log("DELETE URL:", deleteUrl);
  console.log("======================================");

  const response = await fetch(deleteUrl, {
    method: "GET",
    redirect: "follow",
  });

  const responseText = await response.text();

  console.log(
    "DELETE DETAIL API STATUS:",
    response.status
  );

  console.log(
    "DELETE DETAIL API RESPONSE:",
    responseText
  );

  if (!response.ok) {
    throw new Error(
      `Daily Stock Detail Delete API failed: ${response.status}`
    );
  }

  let result = {};

  try {
    result = responseText
      ? JSON.parse(responseText)
      : {};
  } catch {
    result = {};
  }

  if (result?.success === false) {
    throw new Error(
      result?.message ||
      "Daily Stock Detail delete failed"
    );
  }

  console.log(
    "DAILY STOCK DETAIL DELETED SUCCESSFULLY:",
    detailId
  );

  return true;
};

 const updateDailyStockHeader = async (
  headerId,
  entryDate,
  totalAmount
) => {
  try {
    // ============================================================
    // 1. HEADER ID
    // ============================================================

    const id = Number(headerId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        `Invalid Daily Stock Header ID: ${headerId}`
      );
    }

    // ============================================================
    // 2. ENTRY DATE
    // ============================================================

    let formattedEntryDate = "";

    if (entryDate) {
      if (typeof entryDate === "string") {

        // YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
          formattedEntryDate = entryDate;
        }

        // DD-MM-YYYY
        else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
          const [day, month, year] =
            entryDate.split("-");

          formattedEntryDate =
            `${year}-${month}-${day}`;
        }

        // Other valid date
        else {
          const dateObj = new Date(entryDate);

          if (!isNaN(dateObj.getTime())) {
            formattedEntryDate =
              dateObj.toISOString().split("T")[0];
          }
        }
      }

      // Date object
      else if (entryDate instanceof Date) {
        if (!isNaN(entryDate.getTime())) {
          formattedEntryDate =
            entryDate.toISOString().split("T")[0];
        }
      }
    }

    if (
      !formattedEntryDate ||
      formattedEntryDate.includes("NaN")
    ) {
      throw new Error(
        `Invalid EntryDate: ${entryDate}`
      );
    }

    // ============================================================
    // 3. TOTAL AMOUNT
    // ============================================================

    const amount = Number(totalAmount || 0);

    if (isNaN(amount)) {
      throw new Error(
        `Invalid TotalAmount: ${totalAmount}`
      );
    }

    // ============================================================
    // 4. MAIN OFFICE ID
    // ============================================================

    const officeId = Number(MAIN_OFFICE_ID);

    if (
      !Number.isInteger(officeId) ||
      officeId <= 0
    ) {
      throw new Error(
        `Invalid Main Office ID: ${MAIN_OFFICE_ID}`
      );
    }

    // ============================================================
    // 5. UPDATED BY
    // ============================================================

   const updatedBy =
  sessionStorage.getItem("CreatedBy") || "";

    if (
      !Number.isInteger(updatedBy) ||
      updatedBy <= 0
    ) {
      throw new Error(
       `Invalid UpdatedBy: ${updatedBy}`
      );
    }

    // ============================================================
    // 6. FORM DATA
    // MAIN OFFICE MAPPING
    //
    // LocationType = O
    // LocationId   = Main Office ID
    // ShopId       = empty
    // OfficeId     = Main Office ID
    // ============================================================

    const updateData = new URLSearchParams();

    // Header ID
    updateData.append(
      "Id",
      String(id)
    );

    // Entry Date
    updateData.append(
      "EntryDate",
      formattedEntryDate
    );

    // IMPORTANT: Main Office
    updateData.append(
      "LocationType",
      "O"
    );

    // Main Office Location ID
    updateData.append(
      "LocationId",
      String(officeId)
    );

    // Main Office is NOT a Shop
    updateData.append(
      "ShopId",
      ""
    );

    // Main Office ID
    updateData.append(
      "OfficeId",
      String(officeId)
    );

    // Total
    updateData.append(
      "TotalAmount",
      String(amount)
    );

    // Updated By
    updateData.append(
      "UpdatedBy",
      String(updatedBy)
    );

    // ============================================================
    // 7. DEBUG PAYLOAD
    // ============================================================

    console.log(
      "=========================================="
    );

    console.log(
      "MAIN OFFICE HEADER UPDATE PAYLOAD:",
      Object.fromEntries(updateData.entries())
    );

    console.log(
      "=========================================="
    );

    // ============================================================
    // 8. API
    // ============================================================

    const apiUrl =
      "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

    const response = await fetch(apiUrl, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;charset=UTF-8",

        Accept: "application/json",
      },

      body: updateData.toString(),

      redirect: "follow",
    });

    // ============================================================
    // 9. RESPONSE STATUS
    // ============================================================

    console.log(
      "HEADER UPDATE STATUS:",
      response.status
    );

    // ============================================================
    // 10. RAW RESPONSE
    // ============================================================

    const responseText =
      await response.text();

    console.log(
      "HEADER UPDATE RAW RESPONSE:",
      responseText
    );

    // ============================================================
    // 11. JSON RESPONSE
    // ============================================================

    let result = {};

    try {
      result = responseText
        ? JSON.parse(responseText)
        : {};
    } catch (error) {
      throw new Error(
        `Invalid Header Update API response: ${responseText}`
      );
    }

    console.log(
      "HEADER UPDATE RESPONSE:",
      result
    );

    // ============================================================
    // 12. HTTP ERROR
    // ============================================================

    if (!response.ok) {
      throw new Error(
        result?.message ||
          `Header Update API failed: ${response.status}`
      );
    }

    // ============================================================
    // 13. API SUCCESS CHECK
    // ============================================================

    if (result?.success === false) {
      throw new Error(
        result?.message ||
          "Daily Stock Header update failed"
      );
    }

    // ============================================================
    // 14. SUCCESS
    // ============================================================

    console.log(
      "✅ MAIN OFFICE DAILY STOCK HEADER UPDATED SUCCESSFULLY"
    );

    console.log(
      "UPDATED HEADER ID:",
      id
    );

    console.log(
      "UPDATED OFFICE ID:",
      officeId
    );

    console.log(
      "UPDATED TOTAL:",
      amount
    );

    return result;

  } catch (error) {

    console.error(
      "❌ DAILY STOCK HEADER UPDATE ERROR:",
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
  fetchAllDailyStockHeaders();
  calculateMainOfficeCurrentStock();
}, []);




useEffect(() => {
  if (!productOptions.length) {
    return;
  }

  setProductRates((previous) => {
    const updated = {
      ...previous,
    };

    productOptions.forEach((product) => {
      const productId =
        String(product.value);

      if (updated[productId] === undefined) {
        updated[productId] =
          Number(product.rate || 0);
      }
    });

    return updated;
  });
}, [productOptions]);

  // ==========================================================
  // RESET FORM
  // ==========================================================
  const resetForm = () => {
    setSelectedShop({
      Id: MAIN_OFFICE_ID,
      AccountName: "Main Office",
    });
    setDate(new Date());
    setSelectedProduct(null);
    setQuantity("");
    setRate("");
    setRows([]);
    setEditingEntry(null);
    setProductQuantities({});
setProductRates({});
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
// PRODUCT TABLE QUANTITY CHANGE
// ==========================================================

// ==========================================================
// PRODUCT TABLE QUANTITY CHANGE
// ==========================================================
// ==========================================================
// PRODUCT TABLE QUANTITY CHANGE
// ==========================================================


// ==========================================================
// PRODUCT TABLE QUANTITY CHANGE
// ==========================================================
const handleProductQuantityChange = (
  productId,
  value
) => {
  const key = String(productId);

  // ========================================================
  // 1. UPDATE PRODUCT QUANTITY STATE
  // ========================================================
  setProductQuantities((previous) => {
    const existing =
      previous[key];

    return {
      ...previous,

      [key]: {
        ...(existing &&
        typeof existing === "object"
          ? existing
          : {}),

        quantity: value,
      },
    };
  });

  // ========================================================
  // 2. UPDATE LOWER DETAIL TABLE
  // ========================================================
  setRows((previousRows) => {
    const product =
      productOptions.find(
        (item) =>
          String(item.value) === key
      );

    if (!product) {
      return previousRows;
    }

    // ------------------------------------------------------
    // BLANK / ZERO
    // ------------------------------------------------------
    if (
      value === "" ||
      Number(value) <= 0
    ) {
      return previousRows.filter(
        (row) =>
          String(row.ProductId) !== key
      );
    }

    const quantityValue =
      Number(value);

    const rateValue =
      Number(
        productRates?.[key] ??
        product.rate ??
        0
      );

    const existingRow =
      previousRows.find(
        (row) =>
          String(row.ProductId) === key
      );

    // ------------------------------------------------------
    // EXISTING ROW -> UPDATE
    // ------------------------------------------------------
    if (existingRow) {
      return previousRows.map((row) =>
        String(row.ProductId) === key
          ? {
              ...row,

              Id:
                row.Id ||
                row.id ||
                "",

              ProductId:
                product.value,

              ProductCode:
                product.productCode ||
                "",

              ProductName:
                product.label ||
                "",

              Quantity:
                quantityValue,

              Rate:
                rateValue,

              Amount:
                quantityValue *
                rateValue,
            }
          : row
      );
    }

    // ------------------------------------------------------
    // NEW ROW -> ADD
    // ------------------------------------------------------
    return [
      ...previousRows,

      {
        Id: "",

        ProductId:
          product.value,

        ProductCode:
          product.productCode ||
          "",

        ProductName:
          product.label ||
          "",

        Quantity:
          quantityValue,

        Rate:
          rateValue,

        Amount:
          quantityValue *
          rateValue,
      },
    ];
  });
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
// ADD / UPDATE PRODUCTS FROM PRODUCT TABLE
// ==========================================================
const handleAddProduct = () => {
  try {
    const selectedRows =
      productOptions
        .map((product) => {
          const productId =
            String(product.value);

          const savedValue =
            productQuantities?.[
              productId
            ];

          // ------------------------------------------------
          // QUANTITY
          // ------------------------------------------------
          const quantityValue =
            savedValue &&
            typeof savedValue ===
              "object"
              ? Number(
                  savedValue?.quantity ||
                    0
                )
              : Number(
                  savedValue || 0
                );

          // ------------------------------------------------
          // RATE
          // ------------------------------------------------
          const rateValue =
            productRates?.[
              productId
            ] !== undefined
              ? Number(
                  productRates[
                    productId
                  ] || 0
                )
              : Number(
                  product.rate || 0
                );

          // ------------------------------------------------
          // EXISTING DETAIL ID
          // ------------------------------------------------
          const detailId =
            savedValue &&
            typeof savedValue ===
              "object"
              ? savedValue?.detailId ||
                ""
              : "";

          return {
            Id: detailId,

            ProductId:
              product.value,

            ProductCode:
              product.productCode ||
              "",

            ProductName:
              product.label ||
              "",

            Quantity:
              quantityValue,

            Rate:
              rateValue,

            Amount:
              quantityValue *
              rateValue,
          };
        })

        .filter(
          (row) =>
            Number(row.Quantity) >
              0 ||
            row.Id
        );

    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------
    if (
      selectedRows.length === 0
    ) {
      toast.error(
        "Please enter Quantity for at least one Product"
      );

      return;
    }

    // ------------------------------------------------------
    // UPDATE DETAIL TABLE
    // ------------------------------------------------------
    setRows(
      selectedRows
    );

    console.log(
      "FINAL DETAIL ROWS:",
      selectedRows
    );

    toast.success(
      "Products added successfully"
    );

  } catch (error) {
    console.error(
      "ADD PRODUCT ERROR:",
      error
    );

    toast.error(
      "Unable to add products"
    );
  }
};

  // ==========================================================
  // DELETE DETAIL ROW
  // ==========================================================

 // ==========================================================
// DELETE PRODUCT FROM DETAIL TABLE
// ==========================================================
const handleDeleteRow = (index) => {
  let deletedProductId = "";

  setRows((previousRows) => {
    const row =
      previousRows[index];

    deletedProductId =
      row?.ProductId || "";

    return previousRows.filter(
      (_, rowIndex) =>
        rowIndex !== index
    );
  });

  // ========================================================
  // REMOVE FROM PRODUCT QUANTITY STATE
  // ========================================================
  if (deletedProductId) {
    const key =
      String(deletedProductId);

    setProductQuantities(
      (previous) => {
        const updated = {
          ...previous,
        };

        delete updated[key];

        return updated;
      }
    );
  }
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

    // PHP date object response:
    // { date: "2026-09-22 00:00:00.000000", ... }
    if (typeof value === "object" && value?.date) {
      value = value.date;
    }

    const dateString = String(value).trim();

    // Handle: YYYY-MM-DD
    // Handle: YYYY-MM-DD HH:mm:ss
    // Handle: YYYY-MM-DDTHH:mm:ss
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      const [, year, month, day] = match;

      return `${day}-${month}-${year}`;
    }

    // Fallback for normal JS date values
    const d = new Date(dateString);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

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

      id: item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "",

      dateText: item?.EntryDate
        ? formatDate(item.EntryDate)
        : item?.dateText || "",

      shop:
        item?.ShopName ??
        item?.AccountName ??
        item?.Shop ??
        item?.shop ??
        "Stock Entry Shop",

      total: Number(
        item?.TotalAmount ??
          item?.totalAmount ??
          item?.Total ??
          item?.total ??
          0,
      ),
    }));
  }, [stockEntries]);

  // ==========================================================
  // SAVE DAILY STOCK ENTRY
  // ==========================================================

  const handleSave = async () => {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      toast.error("Please select a valid Date");
      return;
    }

    if (rows.length === 0) {
      toast.error("Please add at least one Product");
      return;
    }

    try {
      setSaving(true);

      const entryDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      console.log("FINAL ENTRY DATE:", entryDate);

      // ============================================
      // EDIT EXISTING ENTRY
      // ============================================
      if (editingEntry) {
        const headerId = editingEntry?.Id || editingEntry?.id;

        // ============================================================
// FETCH OLD DETAILS BEFORE EDIT
// ============================================================

const existingDetailData =
  await fetchDailyStockDetail(headerId);

console.log(
  "EXISTING DETAILS BEFORE EDIT:",
  existingDetailData
);

// ============================================================
// EXISTING DATABASE DETAIL IDS
// ============================================================

const existingDetailIds =
  existingDetailData
    .map((item) =>
      Number(item?.Id || item?.id)
    )
    .filter(
      (id) =>
        Number.isInteger(id) &&
        id > 0
    );

// ============================================================
// CURRENT DETAILS STILL PRESENT IN UI
// ============================================================

const currentDetailIds =
  rows
    .map((row) =>
      Number(row?.Id || row?.id)
    )
    .filter(
      (id) =>
        Number.isInteger(id) &&
        id > 0
    );

// ============================================================
// FIND REMOVED DETAILS
// ============================================================

const deletedDetailIds =
  existingDetailIds.filter(
    (existingId) =>
      !currentDetailIds.includes(existingId)
  );

console.log(
  "DETAIL IDS REMOVED DURING EDIT:",
  deletedDetailIds
);

// ============================================================
// DELETE REMOVED DETAILS FROM DATABASE
// ============================================================

for (const deletedDetailId of deletedDetailIds) {
  await deleteDailyStockDetail(
    deletedDetailId
  );
}

        if (!headerId) {
          throw new Error("Daily Stock Header ID not found");
        }

        // --------------------------------------------
        // UPDATE HEADER
        // --------------------------------------------
        await updateDailyStockHeader(headerId, entryDate, total);

        console.log("DAILY STOCK HEADER UPDATED:", headerId);

        // --------------------------------------------
        // UPDATE / INSERT DETAILS
        // --------------------------------------------
        // ============================================================
        // UPDATE / INSERT DAILY STOCK DETAILS
        // ============================================================
        for (const row of rows) {
          const detailId = row?.Id || row?.id || "";

          // ==========================================================
          // EXISTING DETAIL -> UPDATE
          // ==========================================================
          if (detailId) {
            const detailData = new URLSearchParams();

            detailData.append("Id", String(detailId));

            detailData.append("DailyStockHeaderId", String(headerId));

            detailData.append("ProductId", String(row?.ProductId || ""));

            detailData.append("Quantity", String(Number(row?.Quantity || 0)));

            detailData.append("Rate", String(Number(row?.Rate || 0)));

            detailData.append("Amount", String(Number(row?.Amount || 0)));

            detailData.append(
  "UpdatedBy",
  String(updatedBy)
);

            console.log(
              "UPDATING DAILY STOCK DETAIL:",
              Object.fromEntries(detailData.entries()),
            );

            const detailResponse = await fetch(
              "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
              {
                method: "POST",
                body: detailData,
                redirect: "follow",
              },
            );

            const detailText = await detailResponse.text();

            console.log(
              "DAILY STOCK DETAIL UPDATE STATUS:",
              detailResponse.status,
            );

            console.log("DAILY STOCK DETAIL UPDATE RESPONSE:", detailText);

            if (!detailResponse.ok) {
              throw new Error(
                `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`,
              );
            }

            let detailResult;

            try {
              detailResult = JSON.parse(detailText);
            } catch {
              detailResult = {};
            }

            if (detailResult?.success === false) {
              throw new Error(
                detailResult?.message || "Daily Stock Detail update failed",
              );
            }

            console.log(
              "DAILY STOCK DETAIL UPDATED SUCCESSFULLY:",
              detailResult,
            );
          }

          // ==========================================================
          // NEW DETAIL -> INSERT
          // ==========================================================
          else {
            const detailData = new URLSearchParams();

            detailData.append("DailyStockHeaderId", String(headerId));

            detailData.append("ProductId", String(row?.ProductId || ""));

            detailData.append("Quantity", String(Number(row?.Quantity || 0)));

            detailData.append("Rate", String(Number(row?.Rate || 0)));

            detailData.append("Amount", String(Number(row?.Amount || 0)));

            detailData.append(
  "CreatedBy",
  String(createdBy)
);

            console.log(
              "ADDING NEW DAILY STOCK DETAIL:",
              Object.fromEntries(detailData.entries()),
            );

            const detailResponse = await fetch(
              "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
              {
                method: "POST",
                body: detailData,
                redirect: "follow",
              },
            );

            const detailText = await detailResponse.text();

            console.log(
              "DAILY STOCK DETAIL INSERT STATUS:",
              detailResponse.status,
            );

            console.log("DAILY STOCK DETAIL INSERT RESPONSE:", detailText);

            if (!detailResponse.ok) {
              throw new Error(
                `Daily Stock Detail Insert API failed: ${detailResponse.status} - ${detailText}`,
              );
            }

            let detailResult;

            try {
              detailResult = JSON.parse(detailText);
            } catch {
              detailResult = {};
            }

            if (detailResult?.success === false) {
              throw new Error(
                detailResult?.message || "Daily Stock Detail insert failed",
              );
            }

            console.log("NEW DAILY STOCK DETAIL INSERTED:", detailResult);
          }
        }

        toast.success("Main -Office Stock Entry updated successfully!");

        setOpenForm(false);
        resetForm();

        // Refresh Header list
await fetchAllDailyStockHeaders();
await calculateMainOfficeCurrentStock();

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

// ==========================================================
// MAIN OFFICE
// ==========================================================
headerData.append(
  "LocationType",
  "O"
);

headerData.append(
  "LocationId",
  String(MAIN_OFFICE_ID)
);

// Main Office is NOT a Shop
headerData.append(
  "ShopId",
  ""
);

// Main Office ID
headerData.append(
  "OfficeId",
  String(MAIN_OFFICE_ID)
);

headerData.append(
  "TotalAmount",
  String(Number(total || 0))
);

const createdBy =
  sessionStorage.getItem("CreatedBy") || "";

headerData.append(
  "CreatedBy",
  createdBy
);

console.log(
  "MAIN OFFICE HEADER PAYLOAD:",
  Object.fromEntries(headerData.entries())
);

const headerRequestOptions = {
  method: "POST",
  body: headerData,
  redirect: "follow",
};

      const headerResponse = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php`,
        headerRequestOptions,
      );

      if (!headerResponse.ok) {
        throw new Error(
          `Daily Stock Header API failed: ${headerResponse.status}`,
        );
      }

      const headerResult = await headerResponse.json();

      console.log("DAILY STOCK HEADER POST RESPONSE:", headerResult);

      const headerId =
        headerResult?.Id ||
        headerResult?.id ||
        headerResult?.insert_id ||
        headerResult?.DailyStockHeaderId ||
        headerResult?.data?.Id ||
        headerResult?.data?.id;

      if (!headerId) {
        throw new Error("Daily Stock Header ID was not returned from API");
      }

      console.log("CREATED DAILY STOCK HEADER ID:", headerId);

      // --------------------------------------------
      // POST DETAILS
      // --------------------------------------------
      for (const row of rows) {
        const detailData = new URLSearchParams();

        detailData.append("DailyStockHeaderId", String(headerId));

        detailData.append("ProductId", String(row.ProductId || ""));

        detailData.append("Quantity", String(Number(row.Quantity || 0)));

        detailData.append("Rate", String(Number(row.Rate || 0)));

        detailData.append("Amount", String(Number(row.Amount || 0)));

        detailData.append(
  "CreatedBy",
  createdBy
);

        const detailRequestOptions = {
          method: "POST",
          body: detailData,
          redirect: "follow",
        };

        const detailResponse = await fetch(
          `https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php`,
          detailRequestOptions,
        );

        if (!detailResponse.ok) {
          throw new Error(
            `Daily Stock Detail API failed: ${detailResponse.status}`,
          );
        }

        const detailResult = await detailResponse.json();

        console.log("DAILY STOCK DETAIL POST RESPONSE:", detailResult);
      }

      toast.success(" Stock Entry at Main Office saved successfully!");

     setOpenForm(false);
resetForm();

// Refresh Header list
await fetchAllDailyStockHeaders();

// Recalculate Main Office Current Stock
await calculateMainOfficeCurrentStock();

      // Refresh Header list
     
    } catch (error) {
      console.error("Main Office Daily Stock Save Error:", error);

      toast.error(error?.message || "Unable to save Daily Stock Entry");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // SAFE DATE PARSER
  // ==========================================================
  const parseApiDate = (value) => {
    if (!value) {
      return null;
    }

    // PHP date object
    // Example:
    // { date: "2026-09-22 00:00:00.000000", ... }
    if (typeof value === "object" && value?.date) {
      value = value.date;
    }

    const dateString = String(value).trim();

    if (!dateString) {
      return null;
    }

    // YYYY-MM-DD
    // YYYY-MM-DD HH:mm:ss
    // YYYY-MM-DDTHH:mm:ss
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);

      const result = new Date(year, month - 1, day);

      if (!Number.isNaN(result.getTime())) {
        return result;
      }
    }

    // DD-MM-YYYY
    const ddmmyyyy = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);

    if (ddmmyyyy) {
      const day = Number(ddmmyyyy[1]);
      const month = Number(ddmmyyyy[2]);
      const year = Number(ddmmyyyy[3]);

      const result = new Date(year, month - 1, day);

      if (!Number.isNaN(result.getTime())) {
        return result;
      }
    }

    return null;
  };

  // ==========================================================
  // EDIT DAILY STOCK ENTRY
  // ==========================================================
  const handleEditEntry = async (entry) => {
    try {
      console.log("EDIT DAILY STOCK HEADER:", entry);

      // ========================================================
      // HEADER ID
      // ========================================================

      const headerId = entry?.Id || entry?.id;

      if (!headerId) {
        toast.error("Daily Stock Header ID not found");
        return;
      }

      // ========================================================
      // SET EDITING ENTRY
      // ========================================================

      setEditingEntry(entry);
      setOpenForm(true);

      // ========================================================
      // DATE
      // ========================================================

      const apiDate = entry?.EntryDate || entry?.date;

      const parsedDate = parseApiDate(apiDate);

      console.log("EDIT API DATE:", apiDate);

      console.log("EDIT PARSED DATE:", parsedDate);

      if (parsedDate) {
        setDate(parsedDate);
      } else {
        // Important:
        // Never allow invalid date to reach update API
        toast.error("Invalid Entry Date received from API");

        setDate(new Date());
      }

      // ========================================================
      // MAIN OFFICE ALWAYS ID = 2
      // ========================================================

      setSelectedShop({
        Id: MAIN_OFFICE_ID,
        AccountName: "Main Office",
      });

      // ========================================================
      // FETCH DETAILS
      // ========================================================

      const detailData = await fetchDailyStockDetail(headerId);

      console.log("EDIT DAILY STOCK DETAIL:", detailData);

      // ========================================================
      // MAP DETAIL DATA
      // ========================================================

      const detailRows = detailData.map((item) => ({
        Id: item?.Id || item?.id || "",

        ProductId: item?.ProductId || item?.productId || 0,

        ProductCode:
          item?.ProductCode || item?.Code || item?.ProductCodeNo || "",

        ProductName: item?.ProductName || item?.Name || "",

        Quantity: Number(item?.Quantity ?? item?.quantity ?? 0),

        Rate: Number(item?.Rate ?? item?.rate ?? 0),

        Amount: Number(item?.Amount ?? item?.amount ?? 0),
      }));

      console.log("EDIT MAPPED DETAIL ROWS:", detailRows);

      setRows(detailRows);

      // ========================================================
// LOAD EDIT DATA INTO PRODUCT QUANTITY STATE
// ========================================================
const editedQuantities = {};
const editedRates = {};

detailRows.forEach((row) => {
  const key =
    String(row.ProductId);

  editedQuantities[key] = {
    quantity:
      String(row.Quantity ?? 0),

    // IMPORTANT
    // Keep database detail ID
    detailId:
      row.Id || "",
  };

  editedRates[key] =
    Number(row.Rate || 0);
});

// ========================================================
// SET BOTH STATES
// ========================================================
setRows(detailRows);

setProductQuantities(
  editedQuantities
);

setProductRates(
  editedRates
);

    } catch (error) {
      console.error("Edit Daily Stock Entry Error:", error);

      toast.error("Unable to load Daily Stock Entry");
    }
  };


 const handleDeleteEntry = async (id) => {
  if (!id) {
    toast.error("Stock Entry ID not found");
    return;
  }

  try {
    setSaving(true);

    // ========================================================
// FETCH DETAILS OF THIS HEADER
// ========================================================

const detailData =
  await fetchDailyStockDetail(id);

console.log(
  "DETAILS BEFORE HEADER DELETE:",
  detailData
);

// ========================================================
// DELETE ALL DETAILS FIRST
// ========================================================

const detailIds =
  detailData
    .map((item) =>
      Number(item?.Id || item?.id)
    )
    .filter(
      (detailId) =>
        Number.isInteger(detailId) &&
        detailId > 0
    );

for (const detailId of detailIds) {
  await deleteDailyStockDetail(
    detailId
  );
}

    const deleteUrl =
      `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
      `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

    console.log("======================================");
    console.log("DELETE MAIN OFFICE STOCK ENTRY");
    console.log("DELETE URL:", deleteUrl);
    console.log("HEADER ID:", id);
    console.log("======================================");

    const response = await fetch(deleteUrl, {
      method: "GET",
      redirect: "follow",
    });

    const responseText = await response.text();

    console.log("DELETE API STATUS:", response.status);
    console.log("DELETE API RESPONSE:", responseText);

    if (!response.ok) {
      throw new Error(
        `Delete API failed: ${response.status}`
      );
    }

    // -----------------------------------------
    // CHECK API RESPONSE
    // -----------------------------------------

    let result = {};

    try {
      result = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      result = {};
    }

    console.log("DELETE PARSED RESPONSE:", result);

    if (result?.success === false) {
      throw new Error(
        result?.message ||
          "Main Office Stock Entry delete failed"
      );
    }

    // -----------------------------------------
    // REMOVE FROM UI
    // -----------------------------------------

    setStockEntries((previousEntries) =>
      previousEntries.filter(
        (item) =>
          Number(item?.id) !== Number(id) &&
          Number(item?.Id) !== Number(id)
      )
    );

    // -----------------------------------------
    // REFRESH DATABASE DATA
    // -----------------------------------------

    await fetchAllDailyStockHeaders();

    // -----------------------------------------
    // RECALCULATE MAIN OFFICE STOCK
    // -----------------------------------------

    await calculateMainOfficeCurrentStock();

    toast.success(
      "Main Office Stock Entry deleted successfully!"
    );

  } catch (error) {
    console.error(
      "DELETE MAIN OFFICE STOCK ENTRY ERROR:",
      error
    );

    toast.error(
      error?.message ||
        "Unable to delete Main Office Stock Entry"
    );

  } finally {
    setSaving(false);
  }
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
      {
        accessorKey: "srNo",
        header: "Sr.No",
        size: 80,

        Cell: ({ row }) => {
          const index = mappedStockEntries.findIndex(
            (item) => item.id === row.original.id,
          );

          return index + 1;
        },
      },

      {
        accessorKey: "dateText",
        header: "Date",
        size: 150,

        Cell: ({ cell }) => cell.getValue(),
      },

      {
        accessorKey: "shop",
        header: "Shop",
        size: 250,
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
    [mappedStockEntries, handleEditEntry, handleDeleteEntry],
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
            <b> Stock Entry at Main Office</b>
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
              CREATE DAILY STOCK ENTRY AT MAIN OFFICE
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
              Stock Entry at Main Office
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
                  Main Office:
                </Typography>

                <TextField
                  value="Main Office"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
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

              {/* =================================================
    PRODUCT SEARCH + PRODUCT SELECTION TABLE
================================================= */}

              <Box sx={{ mb: 2 }}>
                {/* SEARCH */}
                {/* <Typography
    fontWeight={600}
    mb={0.5}
    fontSize="14px"
  >
    Product:
  </Typography> */}

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search Product / Code"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  sx={{ mb: 1.5 }}
                /><TextField
  fullWidth
  size="small"
  placeholder="Search Product / Code"
  value={productSearch}
  onChange={(e) => setProductSearch(e.target.value)}
  sx={{ mb: 1.5 }}
  onWheel={(e) => e.currentTarget.blur()}
/>

                {/* PRODUCT TABLE */}
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    overflow: "hidden",
                    maxHeight: "450px",
                    overflowY: "auto",
                  }}
                >
                  {/* TABLE HEADER */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2fr 1fr 1fr",
                      backgroundColor: "#e9edf1",
                      borderBottom: "1px solid #ccc",
                      fontWeight: 700,
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.2,
                        borderRight: "1px solid #ccc",
                      }}
                    >
                      Product Code
                    </Box>

                    <Box
                      sx={{
                        p: 1.2,
                        borderRight: "1px solid #ccc",
                      }}
                    >
                      Product Name
                    </Box>

                    <Box
                      sx={{
                        p: 1.2,
                        textAlign: "center",
                        borderRight: "1px solid #ccc",
                      }}
                    >
                      Quantity
                    </Box>

                    <Box
                      sx={{
                        p: 1.2,
                        textAlign: "right",
                      }}
                    >
                      Rate
                    </Box>
                  </Box>

                  {/* PRODUCT ROWS */}

                  {/* PRODUCT ROWS */}

{filteredProductOptions.map((product) => {
  const productId =
    String(product.value);

  // Current quantity
 const quantity =
  productQuantities?.[productId]?.quantity;

const quantityDisplay =
  quantity === undefined ||
  quantity === null
    ? "0"
    : String(quantity);

  // Current rate
  const rate =
    productRates?.[productId] ??
    Number(product.rate || 0);

  return (
    <Box
      key={productId}
      sx={{
        display: "grid",
        gridTemplateColumns:
          "1fr 2fr 1fr 1fr",
        borderBottom:
          "1px solid #ddd",
        alignItems: "center",

        "&:hover": {
          backgroundColor:
            "#fafafa",
        },
      }}
    >

      {/* PRODUCT CODE */}
      <Box
        sx={{
          p: 1.2,
          borderRight:
            "1px solid #ddd",
        }}
      >
        {product.productCode}
      </Box>

      {/* PRODUCT NAME */}
      <Box
        sx={{
          p: 1.2,
          borderRight:
            "1px solid #ddd",
        }}
      >
        {product.label}
      </Box>

      {/* QUANTITY */}
      <Box
        sx={{
          p: 1,
          borderRight:
            "1px solid #ddd",
          display: "flex",
          justifyContent:
            "center",
        }}
      >


   <TextField
  size="small"
  type="number"
  value={quantityDisplay}

  onChange={(e) => {
    handleProductQuantityChange(
      product.value,
      e.target.value
    );
  }}

  // ========================================================
  // 0 वर click/focus केल्यावर 0 select होईल
  // म्हणून 010 problem येणार नाही
  // ========================================================
  onFocus={(e) => {
    if (e.target.value === "0") {
      e.target.select();
    }
  }}

  onClick={(e) => {
    if (e.target.value === "0") {
      e.target.select();
    }
  }}

  // ========================================================
  // ENTER -> NEXT ROW
  // ========================================================
  onKeyDown={(e) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    const currentInput = e.target;

    // Blank असेल तर 0 save करा
    if (currentInput.value === "") {
      handleProductQuantityChange(
        product.value,
        "0"
      );
    }

    const currentIndex =
      filteredProductOptions.findIndex(
        (item) =>
          String(item.value) ===
          String(product.value)
      );

    const nextProduct =
      filteredProductOptions[
        currentIndex + 1
      ];

    if (!nextProduct) {
      return;
    }

    const nextInput =
      quantityInputRefs.current[
        String(nextProduct.value)
      ];

    if (nextInput) {
      requestAnimationFrame(() => {
        nextInput.focus();

        // 0 असेल तर select करा
        if (nextInput.value === "0") {
          nextInput.select();
        }
      });
    }
  }}

  inputRef={(input) => {
    quantityInputRefs.current[
      productId
    ] = input;
  }}

  // ========================================================
  // MOUSE SCROLL -> NUMBER VALUE CHANGE होऊ नये
  // ========================================================
  inputProps={{
    min: 0,
    onWheel: preventNumberInputScroll,
  }}

  sx={{
    width: "150px",
  }}
/>

      </Box>

      {/* RATE */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent:
            "center",
        }}
      >
        <TextField
          size="small"
          type="number"

          value={rate}

         onChange={(e) => {
  const value =
    e.target.value;

  const newRate =
    value === ""
      ? 0
      : Number(value);

  // ======================================================
  // UPDATE RATE STATE
  // ======================================================
  setProductRates(
    (previous) => ({
      ...previous,

      [productId]:
        newRate,
    })
  );

  // ======================================================
  // UPDATE LOWER DETAIL TABLE
  // ======================================================
  setRows(
    (previousRows) =>
      previousRows.map((row) => {
        if (
          String(row.ProductId) !==
          productId
        ) {
          return row;
        }

        const rowQuantity =
          Number(
            row.Quantity || 0
          );

        return {
          ...row,

          Rate:
            newRate,

          Amount:
            rowQuantity *
            newRate,
        };
      })
  );
}}

         inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}

          sx={{
            width: "110px",
          }}
        />
      </Box>

    </Box>
  );
})}
                       

                  {/* NO PRODUCT */}

                  {productOptions.filter((product) => {
                    const search = String(productSearch || "")
                      .trim()
                      .toLowerCase();

                    if (!search) {
                      return true;
                    }

                    return (
                      String(product.productCode || "")
                        .toLowerCase()
                        .includes(search) ||
                      String(product.label || "")
                        .toLowerCase()
                        .includes(search)
                    );
                  }).length === 0 && (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      No products found
                    </Box>
                  )}
                </Box>
              </Box>
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

              {/* <Box>
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
              </Box> */}

              {/* RATE */}

              {/* <Box>
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
              </Box> */}

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


