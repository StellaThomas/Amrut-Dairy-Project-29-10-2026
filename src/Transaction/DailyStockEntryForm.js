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

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   const d = new Date(value);

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const EntryShop = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [editingEntry, setEditingEntry] = useState(null);

//   const STOCK_ENTRY_SHOP_ID = 1;

//   const CREATED_BY = 1;

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productQuantities, setProductQuantities] = useState({});

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

// // ==========================================================
// // FETCH PRODUCT MASTER - REGULAR RATE
// // ==========================================================
// const fetchProduct = async () => {
//   try {
//     setLoadingProducts(true);

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster"
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Product API failed: ${response.status}`
//       );
//     }

//     const data = await response.json();

//     console.log(
//       "PRODUCT MASTER API RESPONSE:",
//       data
//     );

//     const productData = Array.isArray(data)
//       ? data
//       : [];

//     const options = productData
//       .filter(
//         (item) =>
//           item?.ProductName !== null &&
//           item?.ProductName !== undefined &&
//           String(item.ProductName).trim() !== ""
//       )
//       .map((item) => ({
//         value: Number(
//           item?.Id ??
//           item?.ProductId ??
//           0
//         ),

//         label: String(
//           item?.ProductName ??
//           item?.Name ??
//           ""
//         ).trim(),

//         productCode:
//           item?.ProductCode ??
//           item?.Code ??
//           item?.ProductCodeNo ??
//           item?.Id ??
//           "",

//         // ==================================================
//         // REGULAR RATE
//         // If Rate exists and > 0, use Rate.
//         // Otherwise use PurchasePrice.
//         // ==================================================
//         rate: Number(
//           Number(item?.Rate) > 0
//             ? item?.Rate
//             : item?.PurchasePrice ?? 0
//         ),
//       }));

//     console.log(
//       "PRODUCT OPTIONS WITH RATE:",
//       options
//     );

//     setProductOptions(options);

//   } catch (error) {
//     console.error(
//       "Product API Error:",
//       error
//     );

//     toast.error(
//       "Product data could not be loaded"
//     );
//   } finally {
//     setLoadingProducts(false);
//   }
// };

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

// const fetchDailyStockDetail = async (headerId) => {
//   try {
//     const id = Number(headerId);

//     console.log("DAILY STOCK HEADER ID:", id);

//     if (!id) {
//       throw new Error("Daily Stock Header ID not found");
//     }

//     const url =
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${id}`;

//     console.log("DAILY STOCK DETAIL GET URL:", url);

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     });

//     console.log("DETAIL GET STATUS:", response.status);
//     console.log("DETAIL GET STATUS TEXT:", response.statusText);

//     const text = await response.text();

//     console.log("DETAIL GET RAW RESPONSE:", text);

//     let result;

//     try {
//       result = JSON.parse(text);
//     } catch (error) {
//       console.error("DETAIL GET JSON PARSE ERROR:", error);

//       throw new Error(
//         `Invalid Daily Stock Detail API response: ${text}`
//       );
//     }

//     console.log("DAILY STOCK DETAIL API RESPONSE:", result);

//     if (!response.ok) {
//       throw new Error(
//         result?.message ||
//         `Daily Stock Detail API failed: ${response.status}`
//       );
//     }

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

//     const mappedData = data.map((item) => ({
//       Id: Number(item?.Id || 0),
//       DailyStockHeaderId: Number(
//         item?.DailyStockHeaderId || id
//       ),
//       ProductId: Number(item?.ProductId || 0),
//       Quantity: Number(item?.Quantity || 0),
//       Rate: Number(item?.Rate || 0),
//       Amount: Number(item?.Amount || 0),
//     }));

//     console.log(
//       "DAILY STOCK DETAIL FINAL DATA:",
//       mappedData
//     );

//     return mappedData;
//   } catch (error) {
//     console.error(
//       "Daily Stock Detail API Error:",
//       error
//     );

//     toast.error(
//       error?.message ||
//       "Daily Stock Detail data could not be loaded"
//     );

//     return [];
//   }
// };

//  const updateDailyStockHeader = async (
//   headerId,
//   entryDate,
//   totalAmount
// ) => {
//   try {
//     // ============================================================
//     // 1. VALIDATE HEADER ID
//     // ============================================================

//     const id = Number(headerId);

//     console.log("========== DAILY STOCK HEADER UPDATE ==========");
//     console.log("HEADER ID:", id);
//     console.log("ENTRY DATE:", entryDate);
//     console.log("TOTAL AMOUNT:", totalAmount);

//     if (!Number.isInteger(id) || id <= 0) {
//       throw new Error(
//         `Invalid Daily Stock Header ID: ${headerId}`
//       );
//     }

//     // ============================================================
//     // 2. FORMAT DATE
//     // API ला YYYY-MM-DD format मध्ये date पाठवा
//     // ============================================================

//     let formattedEntryDate = "";

//     if (entryDate) {
//       if (typeof entryDate === "string") {
//         // Already YYYY-MM-DD
//         if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//           formattedEntryDate = entryDate;
//         }

//         // DD-MM-YYYY
//         else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//           const [day, month, year] = entryDate.split("-");

//           formattedEntryDate = `${year}-${month}-${day}`;
//         }

//         // Try Date parsing
//         else {
//           const dateObj = new Date(entryDate);

//           if (!isNaN(dateObj.getTime())) {
//             formattedEntryDate = dateObj
//               .toISOString()
//               .split("T")[0];
//           }
//         }
//       } else if (entryDate instanceof Date) {
//         if (!isNaN(entryDate.getTime())) {
//           formattedEntryDate = entryDate
//             .toISOString()
//             .split("T")[0];
//         }
//       }
//     }

//     if (!formattedEntryDate) {
//       throw new Error(
//         `Invalid EntryDate: ${entryDate}`
//       );
//     }

//     console.log(
//       "FORMATTED ENTRY DATE:",
//       formattedEntryDate
//     );

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
//     // 4. SHOP ID
//     // ============================================================

//     const shopId = Number(STOCK_ENTRY_SHOP_ID);

//     if (!Number.isInteger(shopId) || shopId <= 0) {
//       throw new Error(
//         `Invalid ShopId: ${STOCK_ENTRY_SHOP_ID}`
//       );
//     }

//     // ============================================================
//     // 5. UPDATED BY
//     // ============================================================

//     const updatedBy = Number(CREATED_BY);

//     if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//       throw new Error(
//         `Invalid UpdatedBy: ${CREATED_BY}`
//       );
//     }

//     // ============================================================
//     // 6. CREATE FORM DATA
//     // ============================================================

//     const updateData = new URLSearchParams();

//     updateData.append("Id", String(id));
//     updateData.append(
//       "EntryDate",
//       formattedEntryDate
//     );
//     updateData.append(
//       "ShopId",
//       String(shopId)
//     );

//     // Existing record मध्ये OfficeId NULL आहे,
//     // म्हणून blank ठेवत आहोत.

//     updateData.append(
//       "TotalAmount",
//       String(amount)
//     );

//     updateData.append(
//       "UpdatedBy",
//       String(updatedBy)
//     );

//     // ============================================================
//     // 7. LOG EXACT REQUEST
//     // ============================================================

//     console.log(
//       "DAILY STOCK HEADER UPDATE PAYLOAD:",
//       Object.fromEntries(
//         updateData.entries()
//       )
//     );

//     // ============================================================
//     // 8. API CALL
//     // ============================================================

//     const apiUrl =
//       "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//     console.log(
//       "DAILY STOCK HEADER UPDATE URL:",
//       apiUrl
//     );

//     const response = await fetch(
//       apiUrl,
//       {
//         method: "POST",

//         headers: {
//           "Content-Type":
//             "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData,

//         redirect: "follow",
//       }
//     );

//     // ============================================================
//     // 9. READ RAW RESPONSE
//     // IMPORTANT FOR 500 ERROR
//     // ============================================================

//     console.log(
//       "HEADER UPDATE STATUS:",
//       response.status
//     );

//     console.log(
//       "HEADER UPDATE STATUS TEXT:",
//       response.statusText
//     );

//     const rawResponse =
//       await response.text();

//     console.log(
//       "HEADER UPDATE RAW RESPONSE:",
//       rawResponse
//     );

//     // ============================================================
//     // 10. HTTP ERROR
//     // ============================================================

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Header Update API failed: ${response.status}${
//           rawResponse
//             ? ` - ${rawResponse}`
//             : ""
//         }`
//       );
//     }

//     // ============================================================
//     // 11. PARSE JSON
//     // ============================================================

//     let result;

//     try {
//       result = rawResponse
//         ? JSON.parse(rawResponse)
//         : {};
//     } catch (jsonError) {
//       console.error(
//         "HEADER UPDATE JSON PARSE ERROR:",
//         jsonError
//       );

//       throw new Error(
//         `Invalid Header Update API response: ${rawResponse}`
//       );
//     }

//     console.log(
//       "DAILY STOCK HEADER UPDATE RESPONSE:",
//       result
//     );

//     // ============================================================
//     // 12. CHECK API SUCCESS
//     // ============================================================

//     if (
//       result?.success === false
//     ) {
//       throw new Error(
//         result?.message ||
//           "Daily Stock Header update failed"
//       );
//     }

//     console.log(
//       "✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY"
//     );

//     return result;

//   } catch (error) {
//     console.error(
//       "❌ Daily Stock Header Update API Error:",
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
//   const resetForm = () => {
//     setDate(new Date());
//     setProductQuantities({});
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
//   // PRODUCT QUANTITY CHANGE
//   // ==========================================================
//   const handleProductQuantityChange = (productId, value) => {
//     setProductQuantities((previous) => {
//       const key = String(productId);

//       const existing = previous[key];

//       if (existing && typeof existing === "object") {
//         return {
//           ...previous,
//           [key]: {
//             ...existing,
//             quantity: value,
//           },
//         };
//       }

//       return {
//         ...previous,
//         [key]: value,
//       };
//     });
//   };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA
//   // ==========================================================
//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id || item?.id || "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ||
//         item?.AccountName ||
//         item?.Shop ||
//         item?.Name ||
//         item?.shop ||
//         "Stock Entry Shop",

//       total: Number(item?.TotalAmount ?? item?.total ?? 0),
//     }));
//   }, [stockEntries]);

//   // ==========================================================
//   // SAVE / UPDATE STOCK ENTRY SHOP
//   // ==========================================================
//   const handleSave = async () => {
//     // --------------------------------------------------------
//     // DATE VALIDATION
//     // --------------------------------------------------------
//     if (!date) {
//       toast.error("Please select Date");
//       return;
//     }

//     // --------------------------------------------------------
//     // CREATE DATE STRING
//     // --------------------------------------------------------
//     const entryDate = `${date.getFullYear()}-${String(
//       date.getMonth() + 1,
//     ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//     try {
//       setSaving(true);
//       // ======================================================
//       // PREPARE PRODUCTS TO SAVE / UPDATE
//       // ======================================================
//       const selectedRows = productOptions
//         .map((product) => {
//           const savedValue = productQuantities[String(product.value)];

//           const quantity =
//             typeof savedValue === "object"
//               ? Number(savedValue?.quantity || 0)
//               : Number(savedValue || 0);

//           const detailId =
//             typeof savedValue === "object" ? savedValue?.detailId || "" : "";

//           const rate = Number(product.rate || 0);

//           return {
//             Id: detailId,

//             ProductId: Number(product.value),

//             ProductCode: product.productCode || "",

//             ProductName: product.label || "",

//             Quantity: quantity,

//             Rate: rate,

//             Amount: quantity * rate,
//           };
//         })
//         .filter((row) => row.Quantity > 0 || row.Id);

//       console.log("FINAL SELECTED ROWS:", selectedRows);

//       const totalAmount = selectedRows.reduce(
//         (sum, row) => sum + Number(row.Quantity || 0) * Number(row.Rate || 0),
//         0,
//       );

//       // --------------------------------------------------------
//       // VALIDATE PRODUCTS
//       // --------------------------------------------------------
//       if (selectedRows.length === 0) {
//         toast.error("Please enter quantity for at least one product");

//         setSaving(false);
//         return;
//       }

//       console.log("PRODUCTS TO SAVE:", selectedRows);

//       // ======================================================
//       // FIXED SHOP
//       // ======================================================

//       // ======================================================
//       // EDIT EXISTING ENTRY
//       // ======================================================

//       if (editingEntry) {
//         const headerId = editingEntry?.Id || editingEntry?.id;

//         if (!headerId) {
//           throw new Error("Stock Entry Shop Header ID not found");
//         }

//         console.log("UPDATING STOCK ENTRY SHOP:", headerId);

//         // ----------------------------------------------------
//         // UPDATE HEADER
//         // ----------------------------------------------------

//         await updateDailyStockHeader(headerId, entryDate, totalAmount);

//         console.log("STOCK ENTRY SHOP HEADER UPDATED:", headerId);

//         // ======================================================
//         // UPDATE / INSERT DETAILS
//         // ======================================================

//         for (const row of selectedRows) {
//           // ----------------------------------------------------
//           // EXISTING DETAIL ID
//           // ----------------------------------------------------
//           const detailId = row?.Id || row?.id || "";

//           // ----------------------------------------------------
//           // COMMON VALUES
//           // ----------------------------------------------------
//           const quantity = Number(row?.Quantity || 0);

//           const rate = Number(row?.Rate || 0);

//           const amount = quantity * rate;

//           // ====================================================
//           // EXISTING DETAIL → UPDATE
//           // ====================================================
//           if (detailId) {
//             const detailData = new URLSearchParams();

//             detailData.append("Id", (detailId));

//             detailData.append("ProductId", (row?.ProductId || ""));

//             detailData.append("Quantity", (quantity));

//             detailData.append("Rate", (rate));

//             detailData.append("Amount", (amount));

//             // detailData.append("UpdatedBy", "1");

//             console.log(
//               "UPDATE DETAIL DATA:",
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

//             if (!detailResponse.ok) {
//               throw new Error(
//                 `Daily Stock Detail Update API failed: ${detailResponse.status}`,
//               );
//             }

//             const detailResult = await detailResponse.json();

//             console.log("UPDATE DETAIL RESPONSE:", detailResult);

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Stock Detail update failed",
//               );
//             }
//           }

//           // ====================================================
//           // NEW DETAIL → INSERT
//           // ====================================================
// else {
//   const dailyStockHeaderId = Number(headerId);
//   const productId = Number(row?.ProductId);
//   const quantityValue = Number(row?.Quantity ?? 0);
//   const rateValue = Number(row?.Rate ?? 0);
//   const amountValue = Number(
//     row?.Amount ?? quantityValue * rateValue
//   );
//   const createdByValue = 1;

//   const detailData = new URLSearchParams();

//   detailData.append(
//     "DailyStockHeaderId",
//     String(dailyStockHeaderId)
//   );

//   detailData.append(
//     "ProductId",
//     String(productId)
//   );

//   detailData.append(
//     "Quantity",
//     String(quantityValue)
//   );

//   detailData.append(
//     "Rate",
//     String(rateValue)
//   );

//   detailData.append(
//     "Amount",
//     String(amountValue)
//   );

//   detailData.append(
//     "CreatedBy",
//     String(createdByValue)
//   );

//   console.log(
//     "DAILY STOCK DETAIL FORM:",
//     Object.fromEntries(detailData.entries())
//   );

//   console.log(
//     "DAILY STOCK DETAIL BODY:",
//     detailData.toString()
//   );

//   const detailResponse = await fetch(
//     "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//     {
//       method: "POST",
//       body: detailData,
//     }
//   );

//   console.log(
//     "DETAIL STATUS:",
//     detailResponse.status
//   );

//   const detailText = await detailResponse.text();

//   console.log(
//     "DETAIL RESPONSE:",
//     detailText
//   );

//   let detailResult;

//   try {
//     detailResult = JSON.parse(detailText);
//   } catch (error) {
//     console.error(
//       "DETAIL RESPONSE JSON ERROR:",
//       error
//     );

//     throw new Error(
//       `Invalid Detail API response: ${detailText}`
//     );
//   }

//   console.log(
//     "DETAIL RESULT:",
//     detailResult
//   );

//   if (!detailResponse.ok) {
//     throw new Error(
//       detailResult?.message ||
//         `Daily Stock Detail API failed: ${detailResponse.status}`
//     );
//   }

//   if (detailResult?.success === false) {
//     throw new Error(
//       detailResult?.message ||
//         "Daily Stock Detail insert failed"
//     );
//   }

//   console.log(
//     "DAILY STOCK DETAIL SAVED SUCCESSFULLY",
//     detailResult
//   );
// }
//         }

//         // ----------------------------------------------------
//         // SUCCESS
//         // ----------------------------------------------------

//         toast.success("Stock Entry Shop updated successfully!");

//         setOpenForm(false);

//         resetForm();

//         // Refresh list
//         setStockEntries((previous) =>
//           previous.map((item) => {
//             const itemId = item?.Id || item?.id;

//             if (String(itemId) !== String(headerId)) {
//               return item;
//             }

//             return {
//               ...item,
//               EntryDate: entryDate,
//               dateText: formatDate(entryDate),
//               TotalAmount: Number(totalAmount || 0),
//               total: Number(totalAmount || 0),
//             };
//           }),
//         );

//         return;
//       }

//     // ======================================================
// // PREPARE HEADER DATA
// // ======================================================
// // ======================================================
// // PREPARE HEADER DATA
// // ======================================================

// const headerData = new URLSearchParams();

// headerData.append("EntryDate", String(entryDate));
// headerData.append("ShopId", String(STOCK_ENTRY_SHOP_ID));
// headerData.append("OfficeId", "");
// headerData.append("TotalAmount", String(Number(totalAmount || 0)));
// headerData.append("CreatedBy", String(CREATED_BY));

// console.log("STOCK ENTRY SHOP HEADER DATA:", {
//   EntryDate: entryDate,
//   ShopId: STOCK_ENTRY_SHOP_ID,
//   OfficeId: "",
//   TotalAmount: Number(totalAmount || 0),
//   CreatedBy: CREATED_BY,
// });

// const headerResponse = await fetch(
//    "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
//   {
//     method: "POST",
//     mode: "cors",
//     credentials: "omit",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//     },
//     body: headerData.toString(),
//   }
// );

// console.log("HEADER STATUS:", headerResponse.status);
// console.log("HEADER OK:", headerResponse.ok);

// const headerText = await headerResponse.text();

// console.log("HEADER RAW RESPONSE:", headerText);

// let headerResult;

// try {
//   headerResult = JSON.parse(headerText);
// } catch (parseError) {
//   console.error("HEADER JSON PARSE ERROR:", parseError);
//   throw new Error(
//     `Invalid Header API response: ${headerText}`
//   );
// }

// console.log("HEADER API RESPONSE:", headerResult);

// if (!headerResponse.ok || !headerResult?.success) {
//   throw new Error(
//     headerResult?.message ||
//       `Header API failed with status ${headerResponse.status}`
//   );
// }

// const headerId =
//   headerResult?.Id ??
//   headerResult?.id ??
//   headerResult?.insert_id ??
//   headerResult?.DailyStockHeaderId ??
//   headerResult?.data?.Id ??
//   headerResult?.data?.id;

// if (!headerId) {
//   throw new Error(
//     "Header created but Header ID was not returned by API."
//   );
// }

// console.log("CREATED STOCK ENTRY SHOP HEADER ID:", headerId);

//       // ======================================================
//       // POST DETAILS
//       // ======================================================

//      // ======================================================
// // POST DETAILS
// // ======================================================

// for (const row of selectedRows) {
//   const dailyStockHeaderId = Number(headerId);
//   const productId = Number(row?.ProductId);

//   const quantityValue = Number(row?.Quantity || 0);
//   const rateValue = Number(row?.Rate || 0);

//   const amountValue =
//     Number(row?.Amount) || quantityValue * rateValue;

//   const createdByValue = Number(CREATED_BY || 1);

//   const detailData = new URLSearchParams();

//   detailData.append(
//     "DailyStockHeaderId",
//     dailyStockHeaderId
//   );

//   detailData.append(
//     "ProductId",
//     productId
//   );

//   detailData.append(
//     "Quantity",
//     quantityValue
//   );

//   detailData.append(
//     "Rate",
//     rateValue
//   );

//   detailData.append(
//     "Amount",
//     amountValue
//   );

//   detailData.append(
//     "CreatedBy",
//     createdByValue
//   );

//   console.log("========== DAILY STOCK DETAIL ==========");

//   console.log("DETAIL DATA:", {
//     DailyStockHeaderId: dailyStockHeaderId,
//     ProductId: productId,
//     Quantity: quantityValue,
//     Rate: rateValue,
//     Amount: amountValue,
//     CreatedBy: createdByValue,
//   });

//   console.log(
//     "DETAIL REQUEST BODY:",
//     detailData.toString()
//   );

//   const detailResponse = await fetch(
//     "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//     {
//       method: "POST",

//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/x-www-form-urlencoded",
//       },

//       body: detailData,
//     }
//   );

//   console.log(
//     "DETAIL STATUS:",
//     detailResponse.status
//   );

//   console.log(
//     "DETAIL STATUS TEXT:",
//     detailResponse.statusText
//   );

//   const detailText = await detailResponse.text();

//   console.log(
//     "DETAIL RAW RESPONSE:",
//     detailText
//   );

//   let detailResult;

//   try {
//     detailResult = JSON.parse(detailText);
//   } catch (error) {
//     console.error(
//       "DETAIL RESPONSE JSON ERROR:",
//       error
//     );

//     throw new Error(
//       `Invalid Detail API response: ${detailText}`
//     );
//   }

//   console.log(
//     "DETAIL API RESPONSE:",
//     detailResult
//   );

//   if (!detailResponse.ok) {
//     throw new Error(
//       detailResult?.message ||
//         `Detail API failed with status ${detailResponse.status}`
//     );
//   }

//   if (detailResult?.success === false) {
//     throw new Error(
//       detailResult?.message ||
//         "Daily Stock Detail insert failed"
//     );
//   }

//   console.log(
//     "DAILY STOCK DETAIL SAVED SUCCESSFULLY",
//     detailResult
//   );
// }

//       // ======================================================
//       // SUCCESS
//       // ======================================================

//       toast.success("Stock Entry Shop saved successfully!");

//       setOpenForm(false);

//       resetForm();

//       // ======================================================
//       // UPDATE MAIN TABLE AFTER NEW SAVE
//       // ======================================================

//       const newEntry = {
//         Id: Number(headerId),
//         id: Number(headerId),

//         EntryDate: entryDate,
//         dateText: formatDate(entryDate),

//         // SHOP ENTRY
//         ShopId: STOCK_ENTRY_SHOP_ID,
//         OfficeId: null,

//         ShopName: "Stock Entry Shop",
//         shop: "Stock Entry Shop",

//         TotalAmount: Number(totalAmount || 0),
//         total: Number(totalAmount || 0),
//       };

//       setStockEntries((previous) => [newEntry, ...previous]);

//       // Go to first page
//       setPageNo(1);
//     } catch (error) {
//       console.error("Stock Entry Shop Save Error:", error);

//       toast.error(error?.message || "Unable to save Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================================
//   // DELETE MAIN ENTRY
//   // ==========================================================

//   // ==========================================================
//   // EDIT STOCK ENTRY SHOP
//   // ==========================================================
//   const handleEditEntry = async (entry) => {
//     try {
//       // ------------------------------------------------------
//       // SET EDITING ENTRY
//       // ------------------------------------------------------
//       setEditingEntry(entry);

//       // ------------------------------------------------------
//       // GET HEADER ID
//       // ------------------------------------------------------
//       const headerId = entry?.Id || entry?.id;

//       if (!headerId) {
//         toast.error("Stock Entry Shop Header ID not found");
//         return;
//       }

//       console.log("EDIT STOCK ENTRY SHOP HEADER ID:", headerId);

//       // ------------------------------------------------------
//       // OPEN FORM
//       // ------------------------------------------------------
//       setOpenForm(true);

//       // ------------------------------------------------------
//       // SET DATE
//       // ------------------------------------------------------
//       const entryDate = entry?.EntryDate || entry?.entryDate || entry?.date;

//       if (entryDate) {
//         const parsedDate = new Date(entryDate);

//         if (!isNaN(parsedDate.getTime())) {
//           setDate(parsedDate);
//         } else {
//           setDate(new Date());
//         }
//       } else {
//         setDate(new Date());
//       }

//       // ------------------------------------------------------
//       // FETCH EXISTING DETAILS
//       // ------------------------------------------------------
//       const detailData = await fetchDailyStockDetail(headerId);

//       console.log("EDIT STOCK ENTRY SHOP DETAILS:", detailData);

//       // ------------------------------------------------------
//       // VALIDATE DETAIL DATA
//       // ------------------------------------------------------
//       if (!Array.isArray(detailData)) {
//         console.warn(
//           "Daily Stock Detail response is not an array:",
//           detailData,
//         );

//         setProductQuantities({});
//         return;
//       }

//       // ------------------------------------------------------
//       // CREATE PRODUCT QUANTITY MAP
//       // ------------------------------------------------------
//       //
//       // Example:
//       //
//       // {
//       //   "115": {
//       //      quantity: 10,
//       //      detailId: 501
//       //   },
//       //   "113": {
//       //      quantity: 5,
//       //      detailId: 502
//       //   }
//       // }
//       //
//       // ------------------------------------------------------

//       const quantityMap = {};

//       detailData.forEach((item) => {
//         const productId = item?.ProductId ?? item?.productId;

//         if (
//           productId !== null &&
//           productId !== undefined &&
//           String(productId).trim() !== ""
//         ) {
//           const detailId =
//             item?.Id ?? item?.id ?? item?.DailyStockDetailId ?? "";

//           const quantity = Number(item?.Quantity ?? item?.quantity ?? 0);

//           quantityMap[String(productId)] = {
//             quantity,
//             detailId,
//           };
//         }
//       });

//       console.log("EDIT PRODUCT QUANTITY MAP:", quantityMap);

//       // ------------------------------------------------------
//       // SET EXISTING QUANTITIES
//       // ------------------------------------------------------

//       setProductQuantities(quantityMap);
//     } catch (error) {
//       console.error("Edit Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to load Stock Entry Shop");
//     }
//   };

//   // const handleDeleteEntry = (id) => {
//   //   setStockEntries((previousEntries) =>
//   //     previousEntries.filter((item) => item.id !== id),
//   //   );

//   //   toast.success("Entry removed successfully");
//   // };

//   const handleDeleteEntry = async (id) => {
//     if (!id) {
//       toast.error("Stock Entry ID not found");
//       return;
//     }

//     try {
//       setSaving(true);

//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//       console.log("DELETE STOCK ENTRY SHOP URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       console.log("DELETE API STATUS:", response.status);

//       console.log("DELETE API RESPONSE:", resultText);

//       if (!response.ok) {
//         throw new Error(`Delete API failed: ${response.status}`);
//       }

//       // Remove from UI after successful API delete
//       setStockEntries((previousEntries) =>
//         previousEntries.filter((item) => Number(item.id) !== Number(id)),
//       );

//       toast.success("Stock Entry Shop deleted successfully");
//     } catch (error) {
//       console.error("Delete Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to delete Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
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
//       // ====================================================
//       // SR NO
//       // ====================================================

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

//         header: "Shop",

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
//             <b>Stock Entry Shop </b>
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
//               CREATE DAILY STOCK ENTRY
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
//               Stock Entry Shop
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
//               {/* ==================================================
//       STOCK ENTRY SHOP
//   ================================================== */}
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Stock Entry Shop:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   fullWidth
//                   value="Stock Entry Shop"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "#fafafa",
//                       borderRadius: "5px",
//                     },

//                     "& .MuiInputBase-input": {
//                       fontSize: "14px",
//                       fontWeight: 500,
//                     },
//                   }}
//                 />
//               </Box>

//               {/* ==================================================
//       DATE
//   ================================================== */}
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

//             {/* =========================================================
//     PRODUCT SELECTION / QUANTITY / RATE / ADD
//     NOT REQUIRED FOR STOCK ENTRY SHOP
//     Products are shown directly in the table below.
// ========================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #d0d0d0",
//                 borderRadius: "6px",
//                 overflowX: "hidden",
//                 overflowY: "visible",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   width: "100%",
//                   tableLayout: "fixed",

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",
//                   },
//                 }}
//               >
//                 {/* =====================================================
//         TABLE HEADER
//     ===================================================== */}
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     {/* PRODUCT CODE */}
//                     <TableCell
//                       sx={{
//                         width: "18%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Product Code
//                     </TableCell>

//                     {/* PRODUCT NAME */}
//                     <TableCell
//                       sx={{
//                         width: "42%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                       }}
//                     >
//                       Product Name
//                     </TableCell>

//                     {/* QUANTITY */}
//                     <TableCell
//                       align="center"
//                       sx={{
//                         width: "20%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     {/* RATE */}
//                     <TableCell
//                       align="right"
//                       sx={{
//                         width: "20%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Rate
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 {/* =====================================================
//         TABLE BODY
//     ===================================================== */}
//                 <TableBody>
//                   {loadingProducts ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={4}
//                         align="center"
//                         sx={{
//                           py: 4,
//                           color: "#777",
//                         }}
//                       >
//                         Loading Products...
//                       </TableCell>
//                     </TableRow>
//                   ) : productOptions.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={4}
//                         align="center"
//                         sx={{
//                           py: 4,
//                           color: "#777",
//                         }}
//                       >
//                         No Products Found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     productOptions.map((product) => (
//                       <TableRow
//                         hover
//                         key={String(product.value)}
//                         sx={{
//                           "&:hover": {
//                             backgroundColor: "#f8fdf8",
//                           },
//                         }}
//                       >
//                         {/* =================================================
//                 PRODUCT CODE
//             ================================================= */}
//                         <TableCell
//                           sx={{
//                             width: "18%",
//                             fontSize: "14px",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {product.productCode || "-"}
//                         </TableCell>

//                         {/* =================================================
//                 PRODUCT NAME
//             ================================================= */}
//                         <TableCell
//                           sx={{
//                             width: "42%",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           {product.label || "-"}
//                         </TableCell>

//                         {/* =================================================
//                 QUANTITY
//             ================================================= */}
//                         <TableCell
//                           align="center"
//                           sx={{
//                             width: "20%",
//                           }}
//                         >
//                           <TextField
//                             type="number"
//                             size="small"
//                             value={(() => {
//                               const savedValue =
//                                 productQuantities[String(product.value)];

//                               if (
//                                 savedValue !== null &&
//                                 typeof savedValue === "object"
//                               ) {
//                                 return savedValue?.quantity ?? "";
//                               }

//                               return savedValue ?? "";
//                             })()}
//                             onChange={(e) => {
//                               handleProductQuantityChange(
//                                 product.value,
//                                 e.target.value,
//                               );
//                             }}
//                             placeholder="Enter Qty"
//                             inputProps={{
//                               min: 0,
//                               step: 1,
//                             }}
//                             sx={{
//                               width: 110,

//                               "& .MuiOutlinedInput-root": {
//                                 borderRadius: "6px",
//                                 backgroundColor: "#fff",
//                               },

//                               "& .MuiInputBase-input": {
//                                 textAlign: "center",
//                                 fontSize: "15px",
//                                 fontWeight: 500,
//                                 padding: "8px 10px",
//                               },
//                             }}
//                           />
//                         </TableCell>

//                         {/* =================================================
//                 REGULAR / RETAILER RATE
//             ================================================= */}
//                         <TableCell
//                           align="right"
//                           sx={{
//                             width: "20%",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                             whiteSpace: "nowrap",
//                             paddingRight: "16px",
//                           }}
//                         >
//                           ₹ {Number(product.rate || 0).toFixed(2)}
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
//             ></Box>
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

// export default EntryShop;

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

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   const d = new Date(value);

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const EntryShop = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);

//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [editingEntry, setEditingEntry] = useState(null);

//   const STOCK_ENTRY_SHOP_ID = 1;

//   const CREATED_BY = 1;

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());

//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productQuantities, setProductQuantities] = useState({});

//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT MASTER - REGULAR RATE
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       console.log("PRODUCT MASTER API RESPONSE:", data);

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: Number(item?.Id ?? item?.ProductId ?? 0),

//           label: String(item?.ProductName ?? item?.Name ?? "").trim(),

//           productCode:
//             item?.ProductCode ??
//             item?.Code ??
//             item?.ProductCodeNo ??
//             item?.Id ??
//             "",

//           // ==================================================
//           // REGULAR RATE
//           // If Rate exists and > 0, use Rate.
//           // Otherwise use PurchasePrice.
//           // ==================================================
//           rate: Number(
//             Number(item?.Rate) > 0 ? item?.Rate : (item?.PurchasePrice ?? 0),
//           ),
//         }));

//       console.log("PRODUCT OPTIONS WITH RATE:", options);

//       setProductOptions(options);
//     } catch (error) {
//       console.error("Product API Error:", error);

//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADER RECORDS
//   // ==========================================================
//   const fetchDailyStockHeaders = async () => {
//     try {
//       console.log("====================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("====================================");

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
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : [];
//       } catch (error) {
//         console.error("DAILY STOCK HEADER JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER API RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE API RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//       console.log("ALL DAILY STOCK HEADER RECORDS:", data);

//       // ======================================================
//       // MAP DATA
//       // ======================================================

//       const mappedData = data.map((item) => {
//         const id = item?.Id ?? item?.id ?? item?.DailyStockHeaderId ?? "";

//         const entryDate =
//           item?.EntryDate ?? item?.entryDate ?? item?.Date ?? item?.date ?? "";

//         const shopName =
//           item?.ShopName ??
//           item?.AccountName ??
//           item?.Shop ??
//           item?.shop ??
//           item?.Name ??
//           "Stock Entry Shop";

//         const totalAmount = Number(
//           item?.TotalAmount ??
//             item?.totalAmount ??
//             item?.Total ??
//             item?.total ??
//             0,
//         );

//         return {
//           ...item,

//           // Header ID
//           Id: id,
//           id: id,

//           // Date
//           EntryDate: entryDate,
//           dateText: entryDate ? formatDate(entryDate) : "",

//           // Shop
//           ShopName: shopName,
//           shop: shopName,

//           // Total
//           TotalAmount: totalAmount,
//           total: totalAmount,
//         };
//       });

//       console.log("MAPPED DAILY STOCK HEADER RECORDS:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Page reset
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("FETCH ALL DAILY STOCK HEADER ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header data could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       const id = Number(headerId);

//       console.log("DAILY STOCK HEADER ID:", id);

//       if (!id) {
//         throw new Error("Daily Stock Header ID not found");
//       }

//       const url = `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${id}`;

//       console.log("DAILY STOCK DETAIL GET URL:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       console.log("DETAIL GET STATUS:", response.status);
//       console.log("DETAIL GET STATUS TEXT:", response.statusText);

//       const text = await response.text();

//       console.log("DETAIL GET RAW RESPONSE:", text);

//       let result;

//       try {
//         result = JSON.parse(text);
//       } catch (error) {
//         console.error("DETAIL GET JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Detail API response: ${text}`);
//       }

//       console.log("DAILY STOCK DETAIL API RESPONSE:", result);

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             `Daily Stock Detail API failed: ${response.status}`,
//         );
//       }

//       if (result?.success === false) {
//         throw new Error(
//           result?.message || "Daily Stock Detail data could not be loaded",
//         );
//       }

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//       const mappedData = data.map((item) => ({
//         Id: Number(item?.Id || 0),
//         DailyStockHeaderId: Number(item?.DailyStockHeaderId || id),
//         ProductId: Number(item?.ProductId || 0),
//         Quantity: Number(item?.Quantity || 0),
//         Rate: Number(item?.Rate || 0),
//         Amount: Number(item?.Amount || 0),
//       }));

//       console.log("DAILY STOCK DETAIL FINAL DATA:", mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error(
//         error?.message || "Daily Stock Detail data could not be loaded",
//       );

//       return [];
//     }
//   };

//   const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
//     try {
//       // ============================================================
//       // 1. VALIDATE HEADER ID
//       // ============================================================

//       const id = Number(headerId);

//       console.log("========== DAILY STOCK HEADER UPDATE ==========");
//       console.log("HEADER ID:", id);
//       console.log("ENTRY DATE:", entryDate);
//       console.log("TOTAL AMOUNT:", totalAmount);

//       if (!Number.isInteger(id) || id <= 0) {
//         throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
//       }

//       // ============================================================
//       // 2. FORMAT DATE
//       // API ला YYYY-MM-DD format मध्ये date पाठवा
//       // ============================================================

//       let formattedEntryDate = "";

//       if (entryDate) {
//         if (typeof entryDate === "string") {
//           // Already YYYY-MM-DD
//           if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//             formattedEntryDate = entryDate;
//           }

//           // DD-MM-YYYY
//           else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//             const [day, month, year] = entryDate.split("-");

//             formattedEntryDate = `${year}-${month}-${day}`;
//           }

//           // Try Date parsing
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

//       if (!formattedEntryDate) {
//         throw new Error(`Invalid EntryDate: ${entryDate}`);
//       }

//       console.log("FORMATTED ENTRY DATE:", formattedEntryDate);

//       // ============================================================
//       // 3. TOTAL AMOUNT
//       // ============================================================

//       const amount = Number(totalAmount || 0);

//       if (isNaN(amount)) {
//         throw new Error(`Invalid TotalAmount: ${totalAmount}`);
//       }

//       // ============================================================
//       // 4. SHOP ID
//       // ============================================================

//       const shopId = Number(STOCK_ENTRY_SHOP_ID);

//       if (!Number.isInteger(shopId) || shopId <= 0) {
//         throw new Error(`Invalid ShopId: ${STOCK_ENTRY_SHOP_ID}`);
//       }

//       // ============================================================
//       // 5. UPDATED BY
//       // ============================================================

//       const updatedBy = Number(CREATED_BY);

//       if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//         throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
//       }

//       // ============================================================
//       // 6. CREATE FORM DATA
//       // ============================================================

//       const updateData = new URLSearchParams();

//       updateData.append("Id", String(id));
//       updateData.append("EntryDate", formattedEntryDate);
//       updateData.append("ShopId", String(shopId));

//       // Existing record मध्ये OfficeId NULL आहे,
//       // म्हणून blank ठेवत आहोत.

//       updateData.append("TotalAmount", String(amount));

//       updateData.append("UpdatedBy", String(updatedBy));

//       // ============================================================
//       // 7. LOG EXACT REQUEST
//       // ============================================================

//       console.log(
//         "DAILY STOCK HEADER UPDATE PAYLOAD:",
//         Object.fromEntries(updateData.entries()),
//       );

//       // ============================================================
//       // 8. API CALL
//       // ============================================================

//       const apiUrl =
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//       console.log("DAILY STOCK HEADER UPDATE URL:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData,

//         redirect: "follow",
//       });

//       // ============================================================
//       // 9. READ RAW RESPONSE
//       // IMPORTANT FOR 500 ERROR
//       // ============================================================

//       console.log("HEADER UPDATE STATUS:", response.status);

//       console.log("HEADER UPDATE STATUS TEXT:", response.statusText);

//       const rawResponse = await response.text();

//       console.log("HEADER UPDATE RAW RESPONSE:", rawResponse);

//       // ============================================================
//       // 10. HTTP ERROR
//       // ============================================================

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header Update API failed: ${response.status}${
//             rawResponse ? ` - ${rawResponse}` : ""
//           }`,
//         );
//       }

//       // ============================================================
//       // 11. PARSE JSON
//       // ============================================================

//       let result;

//       try {
//         result = rawResponse ? JSON.parse(rawResponse) : {};
//       } catch (jsonError) {
//         console.error("HEADER UPDATE JSON PARSE ERROR:", jsonError);

//         throw new Error(`Invalid Header Update API response: ${rawResponse}`);
//       }

//       console.log("DAILY STOCK HEADER UPDATE RESPONSE:", result);

//       // ============================================================
//       // 12. CHECK API SUCCESS
//       // ============================================================

//       if (result?.success === false) {
//         throw new Error(result?.message || "Daily Stock Header update failed");
//       }

//       console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

//       return result;
//     } catch (error) {
//       console.error("❌ Daily Stock Header Update API Error:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

//   useEffect(() => {
//     fetchProduct();
//     fetchDailyStockHeaders();
//   }, []);

//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//   const resetForm = () => {
//     setDate(new Date());
//     setProductQuantities({});
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
//   // PRODUCT QUANTITY CHANGE
//   // ==========================================================
//   const handleProductQuantityChange = (productId, value) => {
//     setProductQuantities((previous) => {
//       const key = String(productId);

//       const existing = previous[key];

//       if (existing && typeof existing === "object") {
//         return {
//           ...previous,
//           [key]: {
//             ...existing,
//             quantity: value,
//           },
//         };
//       }

//       return {
//         ...previous,
//         [key]: value,
//       };
//     });
//   };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA
//   // ==========================================================
//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id || item?.id || "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ||
//         item?.AccountName ||
//         item?.Shop ||
//         item?.Name ||
//         item?.shop ||
//         "Stock Entry Shop",

//       total: Number(item?.TotalAmount ?? item?.total ?? 0),
//     }));
//   }, [stockEntries]);

//   // ==========================================================
//   // SAVE / UPDATE STOCK ENTRY SHOP
//   // ==========================================================
//   const handleSave = async () => {
//     // --------------------------------------------------------
//     // DATE VALIDATION
//     // --------------------------------------------------------
//     if (!date) {
//       toast.error("Please select Date");
//       return;
//     }

//     // --------------------------------------------------------
//     // CREATE DATE STRING
//     // --------------------------------------------------------
//     const entryDate = `${date.getFullYear()}-${String(
//       date.getMonth() + 1,
//     ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//     try {
//       setSaving(true);
//       // ======================================================
//       // PREPARE PRODUCTS TO SAVE / UPDATE
//       // ======================================================
//       const selectedRows = productOptions
//         .map((product) => {
//           const savedValue = productQuantities[String(product.value)];

//           const quantity =
//             typeof savedValue === "object"
//               ? Number(savedValue?.quantity || 0)
//               : Number(savedValue || 0);

//           const detailId =
//             typeof savedValue === "object" ? savedValue?.detailId || "" : "";

//           const rate = Number(product.rate || 0);

//           return {
//             Id: detailId,

//             ProductId: Number(product.value),

//             ProductCode: product.productCode || "",

//             ProductName: product.label || "",

//             Quantity: quantity,

//             Rate: rate,

//             Amount: quantity * rate,
//           };
//         })
//         .filter((row) => row.Quantity > 0 || row.Id);

//       console.log("FINAL SELECTED ROWS:", selectedRows);

//       const totalAmount = selectedRows.reduce(
//         (sum, row) => sum + Number(row.Quantity || 0) * Number(row.Rate || 0),
//         0,
//       );

//       // --------------------------------------------------------
//       // VALIDATE PRODUCTS
//       // --------------------------------------------------------
//       if (selectedRows.length === 0) {
//         toast.error("Please enter quantity for at least one product");

//         setSaving(false);
//         return;
//       }

//       console.log("PRODUCTS TO SAVE:", selectedRows);

//       // ======================================================
//       // FIXED SHOP
//       // ======================================================

//       // ======================================================
//       // EDIT EXISTING ENTRY
//       // ======================================================

//       if (editingEntry) {
//         const headerId = editingEntry?.Id || editingEntry?.id;

//         if (!headerId) {
//           throw new Error("Stock Entry Shop Header ID not found");
//         }

//         console.log("UPDATING STOCK ENTRY SHOP:", headerId);

//         // ----------------------------------------------------
//         // UPDATE HEADER
//         // ----------------------------------------------------

//         await updateDailyStockHeader(headerId, entryDate, totalAmount);

//         console.log("STOCK ENTRY SHOP HEADER UPDATED:", headerId);

//         // ======================================================
//         // UPDATE / INSERT DETAILS
//         // ======================================================

//         for (const row of selectedRows) {
//           // ----------------------------------------------------
//           // EXISTING DETAIL ID
//           // ----------------------------------------------------
//           const detailId = row?.Id || row?.id || "";

//           // ----------------------------------------------------
//           // COMMON VALUES
//           // ----------------------------------------------------
//           const quantity = Number(row?.Quantity || 0);

//           const rate = Number(row?.Rate || 0);

//           const amount = quantity * rate;

//           // ====================================================
//           // EXISTING DETAIL → UPDATE
//           // ====================================================

//           if (detailId) {
//             // ==========================================================
//             // UPDATE EXISTING DAILY STOCK DETAIL
//             // ==========================================================

//             const detailData = new URLSearchParams();

//             // ----------------------------------------------------------
//             // PREPARE SAFE VALUES
//             // ----------------------------------------------------------

//             const detailIdValue = Number(detailId);
//             const headerIdValue = Number(headerId);
//             const productIdValue = Number(row?.ProductId || 0);
//             const quantityValue = Number(quantity || 0);
//             const rateValue = Number(rate || 0);
//             const amountValue = quantityValue * rateValue;
//             const updatedByValue = Number(CREATED_BY || 1);

//             // ----------------------------------------------------------
//             // VALIDATION
//             // ----------------------------------------------------------

//             if (!Number.isInteger(detailIdValue) || detailIdValue <= 0) {
//               throw new Error(`Invalid Daily Stock Detail Id: ${detailId}`);
//             }

//             if (!Number.isInteger(headerIdValue) || headerIdValue <= 0) {
//               throw new Error(`Invalid Daily Stock Header Id: ${headerId}`);
//             }

//             if (!Number.isInteger(productIdValue) || productIdValue <= 0) {
//               throw new Error(`Invalid Product Id: ${row?.ProductId}`);
//             }

//             if (quantityValue < 0) {
//               throw new Error(`Invalid Quantity: ${quantity}`);
//             }

//             if (rateValue < 0) {
//               throw new Error(`Invalid Rate: ${rate}`);
//             }

//             // ==========================================================
//             // API PAYLOAD
//             // ==========================================================

//             detailData.append("Id", String(detailIdValue));

//             detailData.append("DailyStockHeaderId", String(headerIdValue));

//             detailData.append("ProductId", String(productIdValue));

//             detailData.append("Quantity", String(quantityValue));

//             detailData.append("Rate", String(rateValue));

//             detailData.append("Amount", String(amountValue));

//             detailData.append("UpdatedBy", String(updatedByValue));

//             // ==========================================================
//             // DEBUG PAYLOAD
//             // ==========================================================

//             console.log("==================================================");

//             console.log("UPDATE DAILY STOCK DETAIL PAYLOAD:");

//             console.log(Object.fromEntries(detailData.entries()));

//             console.log("DETAIL ID:", detailIdValue);

//             console.log("HEADER ID:", headerIdValue);

//             console.log("PRODUCT ID:", productIdValue);

//             console.log("QUANTITY:", quantityValue);

//             console.log("RATE:", rateValue);

//             console.log("AMOUNT:", amountValue);

//             console.log("UPDATED BY:", updatedByValue);

//             console.log("REQUEST BODY:", detailData.toString());

//             console.log("==================================================");

//             // ==========================================================
//             // UPDATE API
//             // ==========================================================

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",

//                 headers: {
//                   Accept: "application/json",
//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },

//                 body: detailData.toString(),

//                 redirect: "follow",
//               },
//             );

//             // ==========================================================
//             // STATUS
//             // ==========================================================

//             console.log(
//               "DAILY STOCK DETAIL UPDATE STATUS:",
//               detailResponse.status,
//             );

//             console.log(
//               "DAILY STOCK DETAIL UPDATE STATUS TEXT:",
//               detailResponse.statusText,
//             );

//             // ==========================================================
//             // READ RAW RESPONSE
//             // ==========================================================

//             const detailText = await detailResponse.text();

//             console.log("DAILY STOCK DETAIL UPDATE RAW RESPONSE:", detailText);

//             // ==========================================================
//             // PARSE RESPONSE
//             // ==========================================================

//             let detailResult = {};

//             try {
//               detailResult = detailText ? JSON.parse(detailText) : {};
//             } catch (jsonError) {
//               console.error(
//                 "DAILY STOCK DETAIL UPDATE JSON PARSE ERROR:",
//                 jsonError,
//               );

//               throw new Error(
//                 `Invalid Detail Update API response: ${detailText}`,
//               );
//             }

//             console.log("DAILY STOCK DETAIL UPDATE RESPONSE:", detailResult);

//             // ==========================================================
//             // HTTP ERROR
//             // ==========================================================

//             if (!detailResponse.ok) {
//               throw new Error(
//                 detailResult?.message ||
//                   detailResult?.error ||
//                   `Daily Stock Detail Update API failed: ${detailResponse.status} - ${detailText}`,
//               );
//             }

//             // ==========================================================
//             // API SUCCESS CHECK
//             // ==========================================================

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message ||
//                   detailResult?.error ||
//                   "Daily Stock Detail update failed",
//               );
//             }

//             // ==========================================================
//             // SUCCESS
//             // ==========================================================

//             console.log("==================================================");

//             console.log("✅ DAILY STOCK DETAIL UPDATED SUCCESSFULLY");

//             console.log("DETAIL ID:", detailIdValue);

//             console.log("HEADER ID:", headerIdValue);

//             console.log("==================================================");
//           }

//           // ====================================================
//           // NEW DETAIL → INSERT
//           // ====================================================
//           else {
//             const dailyStockHeaderId = Number(headerId);
//             const productId = Number(row?.ProductId);
//             const quantityValue = Number(row?.Quantity ?? 0);
//             const rateValue = Number(row?.Rate ?? 0);
//             const amountValue = Number(
//               row?.Amount ?? quantityValue * rateValue,
//             );
//             const createdByValue = 1;

//             const detailData = new URLSearchParams();

//             detailData.append("DailyStockHeaderId", String(dailyStockHeaderId));

//             detailData.append("ProductId", String(productId));

//             detailData.append("Quantity", String(quantityValue));

//             detailData.append("Rate", String(rateValue));

//             detailData.append("Amount", String(amountValue));

//             detailData.append("CreatedBy", String(createdByValue));

//             console.log(
//               "DAILY STOCK DETAIL FORM:",
//               Object.fromEntries(detailData.entries()),
//             );

//             console.log("DAILY STOCK DETAIL BODY:", detailData.toString());

//             const detailResponse = await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",
//                 body: detailData,
//               },
//             );

//             console.log("DETAIL STATUS:", detailResponse.status);

//             const detailText = await detailResponse.text();

//             console.log("DETAIL RESPONSE:", detailText);

//             let detailResult;

//             try {
//               detailResult = JSON.parse(detailText);
//             } catch (error) {
//               console.error("DETAIL RESPONSE JSON ERROR:", error);

//               throw new Error(`Invalid Detail API response: ${detailText}`);
//             }

//             console.log("DETAIL RESULT:", detailResult);

//             if (!detailResponse.ok) {
//               throw new Error(
//                 detailResult?.message ||
//                   `Daily Stock Detail API failed: ${detailResponse.status}`,
//               );
//             }

//             if (detailResult?.success === false) {
//               throw new Error(
//                 detailResult?.message || "Daily Stock Detail insert failed",
//               );
//             }

//             console.log("DAILY STOCK DETAIL SAVED SUCCESSFULLY", detailResult);
//           }
//         }

//         // ----------------------------------------------------
//         // SUCCESS
//         // ----------------------------------------------------

//         toast.success("Stock Entry Shop updated successfully!");

//         setOpenForm(false);

//         resetForm();

//         // Refresh list
//         setStockEntries((previous) =>
//           previous.map((item) => {
//             const itemId = item?.Id || item?.id;

//             if (String(itemId) !== String(headerId)) {
//               return item;
//             }

//             return {
//               ...item,
//               EntryDate: entryDate,
//               dateText: formatDate(entryDate),
//               TotalAmount: Number(totalAmount || 0),
//               total: Number(totalAmount || 0),
//             };
//           }),
//         );

//         return;
//       }

//       // ======================================================
//       // PREPARE HEADER DATA
//       // ======================================================
//       // ======================================================
//       // PREPARE HEADER DATA
//       // ======================================================

//       const headerData = new URLSearchParams();

//       headerData.append("EntryDate", String(entryDate));
//       headerData.append("ShopId", String(STOCK_ENTRY_SHOP_ID));
//       headerData.append("OfficeId", "");
//       headerData.append("TotalAmount", String(Number(totalAmount || 0)));
//       headerData.append("CreatedBy", String(CREATED_BY));

//       console.log("STOCK ENTRY SHOP HEADER DATA:", {
//         EntryDate: entryDate,
//         ShopId: STOCK_ENTRY_SHOP_ID,
//         OfficeId: "",
//         TotalAmount: Number(totalAmount || 0),
//         CreatedBy: CREATED_BY,
//       });

//       const headerResponse = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
//         {
//           method: "POST",
//           mode: "cors",
//           credentials: "omit",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//           },
//           body: headerData.toString(),
//         },
//       );

//       console.log("HEADER STATUS:", headerResponse.status);
//       console.log("HEADER OK:", headerResponse.ok);

//       const headerText = await headerResponse.text();

//       console.log("HEADER RAW RESPONSE:", headerText);

//       let headerResult;

//       try {
//         headerResult = JSON.parse(headerText);
//       } catch (parseError) {
//         console.error("HEADER JSON PARSE ERROR:", parseError);
//         throw new Error(`Invalid Header API response: ${headerText}`);
//       }

//       console.log("HEADER API RESPONSE:", headerResult);

//       if (!headerResponse.ok || !headerResult?.success) {
//         throw new Error(
//           headerResult?.message ||
//             `Header API failed with status ${headerResponse.status}`,
//         );
//       }

//       const headerId =
//         headerResult?.Id ??
//         headerResult?.id ??
//         headerResult?.insert_id ??
//         headerResult?.DailyStockHeaderId ??
//         headerResult?.data?.Id ??
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error(
//           "Header created but Header ID was not returned by API.",
//         );
//       }

//       console.log("CREATED STOCK ENTRY SHOP HEADER ID:", headerId);

//       // ======================================================
//       // POST DETAILS
//       // ======================================================

//       // ======================================================
//       // POST DETAILS
//       // ======================================================

//       for (const row of selectedRows) {
//         const dailyStockHeaderId = Number(headerId);
//         const productId = Number(row?.ProductId);

//         const quantityValue = Number(row?.Quantity || 0);
//         const rateValue = Number(row?.Rate || 0);

//         const amountValue = Number(row?.Amount) || quantityValue * rateValue;

//         const createdByValue = Number(CREATED_BY || 1);

//         const detailData = new URLSearchParams();

//         detailData.append("DailyStockHeaderId", dailyStockHeaderId);

//         detailData.append("ProductId", productId);

//         detailData.append("Quantity", quantityValue);

//         detailData.append("Rate", rateValue);

//         detailData.append("Amount", amountValue);

//         detailData.append("CreatedBy", createdByValue);

//         console.log("========== DAILY STOCK DETAIL ==========");

//         console.log("DETAIL DATA:", {
//           DailyStockHeaderId: dailyStockHeaderId,
//           ProductId: productId,
//           Quantity: quantityValue,
//           Rate: rateValue,
//           Amount: amountValue,
//           CreatedBy: createdByValue,
//         });

//         console.log("DETAIL REQUEST BODY:", detailData.toString());

//         const detailResponse = await fetch(
//           "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//           {
//             method: "POST",

//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/x-www-form-urlencoded",
//             },

//             body: detailData,
//           },
//         );

//         console.log("DETAIL STATUS:", detailResponse.status);

//         console.log("DETAIL STATUS TEXT:", detailResponse.statusText);

//         const detailText = await detailResponse.text();

//         console.log("DETAIL RAW RESPONSE:", detailText);

//         let detailResult;

//         try {
//           detailResult = JSON.parse(detailText);
//         } catch (error) {
//           console.error("DETAIL RESPONSE JSON ERROR:", error);

//           throw new Error(`Invalid Detail API response: ${detailText}`);
//         }

//         console.log("DETAIL API RESPONSE:", detailResult);

//         if (!detailResponse.ok) {
//           throw new Error(
//             detailResult?.message ||
//               `Detail API failed with status ${detailResponse.status}`,
//           );
//         }

//         if (detailResult?.success === false) {
//           throw new Error(
//             detailResult?.message || "Daily Stock Detail insert failed",
//           );
//         }

//         console.log("DAILY STOCK DETAIL SAVED SUCCESSFULLY", detailResult);
//       }

//       // ======================================================
//       // SUCCESS
//       // ======================================================

//       toast.success("Stock Entry Shop saved successfully!");

//       setOpenForm(false);

//       resetForm();

//       // ======================================================
//       // UPDATE MAIN TABLE AFTER NEW SAVE
//       // ======================================================

//       const newEntry = {
//         Id: Number(headerId),
//         id: Number(headerId),

//         EntryDate: entryDate,
//         dateText: formatDate(entryDate),

//         // SHOP ENTRY
//         ShopId: STOCK_ENTRY_SHOP_ID,
//         OfficeId: null,

//         ShopName: "Stock Entry Shop",
//         shop: "Stock Entry Shop",

//         TotalAmount: Number(totalAmount || 0),
//         total: Number(totalAmount || 0),
//       };

//       setStockEntries((previous) => [newEntry, ...previous]);

//       // Go to first page
//       setPageNo(1);
//     } catch (error) {
//       console.error("Stock Entry Shop Save Error:", error);

//       toast.error(error?.message || "Unable to save Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================================
//   // DELETE MAIN ENTRY
//   // ==========================================================

//   // ==========================================================
//   // EDIT STOCK ENTRY SHOP
//   // ==========================================================
//   const handleEditEntry = async (entry) => {
//     try {
//       // ------------------------------------------------------
//       // SET EDITING ENTRY
//       // ------------------------------------------------------
//       setEditingEntry(entry);

//       // ------------------------------------------------------
//       // GET HEADER ID
//       // ------------------------------------------------------
//       const headerId = entry?.Id || entry?.id;

//       if (!headerId) {
//         toast.error("Stock Entry Shop Header ID not found");
//         return;
//       }

//       console.log("EDIT STOCK ENTRY SHOP HEADER ID:", headerId);

//       // ------------------------------------------------------
//       // OPEN FORM
//       // ------------------------------------------------------
//       setOpenForm(true);

//       // ------------------------------------------------------
//       // SET DATE
//       // ------------------------------------------------------
//       const entryDate = entry?.EntryDate || entry?.entryDate || entry?.date;

//       if (entryDate) {
//         const parsedDate = new Date(entryDate);

//         if (!isNaN(parsedDate.getTime())) {
//           setDate(parsedDate);
//         } else {
//           setDate(new Date());
//         }
//       } else {
//         setDate(new Date());
//       }

//       // ------------------------------------------------------
//       // FETCH EXISTING DETAILS
//       // ------------------------------------------------------
//       const detailData = await fetchDailyStockHeaders();

//       console.log("EDIT STOCK ENTRY SHOP DETAILS:", detailData);

//       // ------------------------------------------------------
//       // VALIDATE DETAIL DATA
//       // ------------------------------------------------------
//       if (!Array.isArray(detailData)) {
//         console.warn(
//           "Daily Stock Detail response is not an array:",
//           detailData,
//         );

//         setProductQuantities({});
//         return;
//       }

//       // ------------------------------------------------------
//       // CREATE PRODUCT QUANTITY MAP
//       // ------------------------------------------------------
//       //
//       // Example:
//       //
//       // {
//       //   "115": {
//       //      quantity: 10,
//       //      detailId: 501
//       //   },
//       //   "113": {
//       //      quantity: 5,
//       //      detailId: 502
//       //   }
//       // }
//       //
//       // ------------------------------------------------------

//       const quantityMap = {};

//       detailData.forEach((item) => {
//         const productId = item?.ProductId ?? item?.productId;

//         if (
//           productId !== null &&
//           productId !== undefined &&
//           String(productId).trim() !== ""
//         ) {
//           const detailId =
//             item?.Id ?? item?.id ?? item?.DailyStockDetailId ?? "";

//           const quantity = Number(item?.Quantity ?? item?.quantity ?? 0);

//           quantityMap[String(productId)] = {
//             quantity,
//             detailId,
//           };
//         }
//       });

//       console.log("EDIT PRODUCT QUANTITY MAP:", quantityMap);

//       // ------------------------------------------------------
//       // SET EXISTING QUANTITIES
//       // ------------------------------------------------------

//       setProductQuantities(quantityMap);
//     } catch (error) {
//       console.error("Edit Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to load Stock Entry Shop");
//     }
//   };

//   // const handleDeleteEntry = (id) => {
//   //   setStockEntries((previousEntries) =>
//   //     previousEntries.filter((item) => item.id !== id),
//   //   );

//   //   toast.success("Entry removed successfully");
//   // };

//   const handleDeleteEntry = async (id) => {
//     if (!id) {
//       toast.error("Stock Entry ID not found");
//       return;
//     }

//     try {
//       setSaving(true);

//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//       console.log("DELETE STOCK ENTRY SHOP URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       console.log("DELETE API STATUS:", response.status);

//       console.log("DELETE API RESPONSE:", resultText);

//       if (!response.ok) {
//         throw new Error(`Delete API failed: ${response.status}`);
//       }

//       // Remove from UI after successful API delete
//       setStockEntries((previousEntries) =>
//         previousEntries.filter((item) => Number(item.id) !== Number(id)),
//       );

//       toast.success("Stock Entry Shop deleted successfully");
//     } catch (error) {
//       console.error("Delete Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to delete Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
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
//       // ====================================================
//       // SR NO
//       // ====================================================

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

//         header: "Shop",

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
//             <b>Stock Entry Shop </b>
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
//               CREATE DAILY STOCK ENTRY
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
//               Stock Entry Shop
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
//               {/* ==================================================
//       STOCK ENTRY SHOP
//   ================================================== */}
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Stock Entry Shop:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   fullWidth
//                   value="Stock Entry Shop"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "#fafafa",
//                       borderRadius: "5px",
//                     },

//                     "& .MuiInputBase-input": {
//                       fontSize: "14px",
//                       fontWeight: 500,
//                     },
//                   }}
//                 />
//               </Box>

//               {/* ==================================================
//       DATE
//   ================================================== */}
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

//             {/* =========================================================
//     PRODUCT SELECTION / QUANTITY / RATE / ADD
//     NOT REQUIRED FOR STOCK ENTRY SHOP
//     Products are shown directly in the table below.
// ========================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #d0d0d0",
//                 borderRadius: "6px",
//                 overflowX: "hidden",
//                 overflowY: "visible",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   width: "100%",
//                   tableLayout: "fixed",

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",
//                   },
//                 }}
//               >
//                 {/* =====================================================
//         TABLE HEADER
//     ===================================================== */}
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e9ecef",
//                     }}
//                   >
//                     {/* PRODUCT CODE */}
//                     <TableCell
//                       sx={{
//                         width: "18%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Product Code
//                     </TableCell>

//                     {/* PRODUCT NAME */}
//                     <TableCell
//                       sx={{
//                         width: "42%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                       }}
//                     >
//                       Product Name
//                     </TableCell>

//                     {/* QUANTITY */}
//                     <TableCell
//                       align="center"
//                       sx={{
//                         width: "20%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Quantity
//                     </TableCell>

//                     {/* RATE */}
//                     <TableCell
//                       align="right"
//                       sx={{
//                         width: "20%",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       Rate
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 {/* =====================================================
//         TABLE BODY
//     ===================================================== */}
//                 <TableBody>
//                   {loadingProducts ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={4}
//                         align="center"
//                         sx={{
//                           py: 4,
//                           color: "#777",
//                         }}
//                       >
//                         Loading Products...
//                       </TableCell>
//                     </TableRow>
//                   ) : productOptions.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={4}
//                         align="center"
//                         sx={{
//                           py: 4,
//                           color: "#777",
//                         }}
//                       >
//                         No Products Found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     productOptions.map((product) => (
//                       <TableRow
//                         hover
//                         key={String(product.value)}
//                         sx={{
//                           "&:hover": {
//                             backgroundColor: "#f8fdf8",
//                           },
//                         }}
//                       >
//                         {/* =================================================
//                 PRODUCT CODE
//             ================================================= */}
//                         <TableCell
//                           sx={{
//                             width: "18%",
//                             fontSize: "14px",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {product.productCode || "-"}
//                         </TableCell>

//                         {/* =================================================
//                 PRODUCT NAME
//             ================================================= */}
//                         <TableCell
//                           sx={{
//                             width: "42%",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           {product.label || "-"}
//                         </TableCell>

//                         {/* =================================================
//                 QUANTITY
//             ================================================= */}
//                         <TableCell
//                           align="center"
//                           sx={{
//                             width: "20%",
//                           }}
//                         >
//                           <TextField
//                             type="number"
//                             size="small"
//                             value={(() => {
//                               const savedValue =
//                                 productQuantities[String(product.value)];

//                               if (
//                                 savedValue !== null &&
//                                 typeof savedValue === "object"
//                               ) {
//                                 return savedValue?.quantity ?? "";
//                               }

//                               return savedValue ?? "";
//                             })()}
//                             onChange={(e) => {
//                               handleProductQuantityChange(
//                                 product.value,
//                                 e.target.value,
//                               );
//                             }}
//                             placeholder="Enter Qty"
//                             inputProps={{
//                               min: 0,
//                               step: 1,
//                             }}
//                             sx={{
//                               width: 110,

//                               "& .MuiOutlinedInput-root": {
//                                 borderRadius: "6px",
//                                 backgroundColor: "#fff",
//                               },

//                               "& .MuiInputBase-input": {
//                                 textAlign: "center",
//                                 fontSize: "15px",
//                                 fontWeight: 500,
//                                 padding: "8px 10px",
//                               },
//                             }}
//                           />
//                         </TableCell>

//                         {/* =================================================
//                 REGULAR / RETAILER RATE
//             ================================================= */}
//                         <TableCell
//                           align="right"
//                           sx={{
//                             width: "20%",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                             whiteSpace: "nowrap",
//                             paddingRight: "16px",
//                           }}
//                         >
//                           ₹ {Number(product.rate || 0).toFixed(2)}
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
//             ></Box>
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

// export default EntryShop;




































// import React, { useEffect, useMemo, useState } from "react";
// import { createFilterOptions } from "@mui/material/Autocomplete";
// import Autocomplete from "@mui/material/Autocomplete";

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

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   const d = new Date(value);

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const EntryShop = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);


// // ==========================================================
// // SAVE COMPARISON POPUP
// // ==========================================================
// const [openComparisonPopup, setOpenComparisonPopup] = useState(false);
// const [comparisonRows, setComparisonRows] = useState([]);

// // ==========================================================
// // STOCK COMPARISON REPORT
// // ==========================================================
// const [comparisonReportOpen, setComparisonReportOpen] = useState(false);
// const [comparisonReportRows, setComparisonReportRows] = useState([]);
// const [comparisonReportDate, setComparisonReportDate] = useState("");




//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [editingEntry, setEditingEntry] = useState(null);

//   const STOCK_ENTRY_SHOP_ID = 1;

//   const CREATED_BY = 1;

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());


//   const [soldQuantities, setSoldQuantities] = useState({});



  


//   // ==========================================================
// // FETCH SOLD QUANTITY FOR SELECTED DATE
// // ==========================================================

// const fetchSoldQuantities = async (
//   selectedDate = date
// ) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH SOLD QUANTITIES");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     // ==========================================================
//     // 1. FETCH DAILY STOCK HEADERS
//     // ==========================================================

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Daily Stock Header API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     const headers = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : [];

//     // ==========================================================
//     // 2. SELECTED DATE
//     // ==========================================================

//     const selectedDateString =
//       selectedDate instanceof Date
//         ? `${selectedDate.getFullYear()}-${String(
//             selectedDate.getMonth() + 1
//           ).padStart(2, "0")}-${String(
//             selectedDate.getDate()
//           ).padStart(2, "0")}`
//         : String(selectedDate).slice(0, 10);

//     console.log(
//       "SOLD SELECTED DATE:",
//       selectedDateString
//     );

//     // ==========================================================
//     // 3. GET ONLY SHOP ENTRIES
//     // LocationType = S
//     // ==========================================================

//     const shopHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//           item?.locationType ??
//           ""
//       )
//         .trim()
//         .toUpperCase();

//       const entryDate = String(
//         item?.EntryDate ??
//           item?.entryDate ??
//           item?.Date ??
//           item?.date ??
//           ""
//       ).slice(0, 10);

//       return (
//         locationType === "S" &&
//         entryDate === selectedDateString
//       );
//     });

//     console.log(
//       "SHOP HEADERS FOR SOLD:",
//       shopHeaders
//     );

//     console.log(
//       "TOTAL SHOP HEADERS:",
//       shopHeaders.length
//     );

//     // ==========================================================
//     // 4. SOLD QUANTITY MAP
//     // ==========================================================

//     const soldMap = {};

//     // ==========================================================
//     // 5. PRODUCT MASTER LOOKUP
//     //
//     // ProductCode -> ProductId mapping
//     // ==========================================================

//     const productMasterList = Array.isArray(
//       productOptions
//     )
//       ? productOptions
//       : [];

//     console.log(
//       "PRODUCT MASTER LIST FOR SOLD MAPPING:",
//       productMasterList
//     );

//     // ==========================================================
//     // 6. HELPER FUNCTION
//     // Convert API ProductId/ProductCode to actual ProductId
//     // ==========================================================

//     const getActualProductId = (item) => {

//       const rawProductId = Number(
//         item?.ProductId ??
//           item?.productId ??
//           0
//       );

//       const rawProductCode = String(
//         item?.ProductCode ??
//           item?.productCode ??
//           item?.Code ??
//           item?.code ??
//           ""
//       ).trim();

//       // --------------------------------------------------------
//       // CASE 1:
//       // ProductCode available
//       // --------------------------------------------------------

//       if (rawProductCode) {

//         const matchedProduct =
//           productMasterList.find((product) => {

//             const masterCode = String(
//               product?.ProductCode ??
//                 product?.productCode ??
//                 product?.Code ??
//                 product?.code ??
//                 ""
//             ).trim();

//             return (
//               masterCode === rawProductCode
//             );
//           });

//         if (matchedProduct) {

//           const actualId = Number(
//             matchedProduct?.ProductId ??
//               matchedProduct?.productId ??
//               matchedProduct?.Id ??
//               matchedProduct?.id ??
//               0
//           );

//           if (actualId > 0) {
//             return actualId;
//           }
//         }
//       }

//       // --------------------------------------------------------
//       // CASE 2:
//       // API ProductId directly matches Product Master ID
//       // --------------------------------------------------------

//       if (rawProductId > 0) {

//         const matchedById =
//           productMasterList.find((product) => {

//             const masterId = Number(
//               product?.ProductId ??
//                 product?.productId ??
//                 product?.Id ??
//                 product?.id ??
//                 0
//             );

//             return (
//               masterId === rawProductId
//             );
//           });

//         if (matchedById) {
//           return rawProductId;
//         }
//       }

//       // --------------------------------------------------------
//       // CASE 3:
//       // No Product Master match
//       // Use API ProductId
//       // --------------------------------------------------------

//       return rawProductId;
//     };

//     // ==========================================================
//     // 7. FETCH DETAILS FROM ALL SHOP HEADERS
//     // ==========================================================

//     for (const header of shopHeaders) {

//       const headerId = Number(
//         header?.Id ??
//           header?.id ??
//           0
//       );

//       if (!headerId) {
//         continue;
//       }

//       try {

//         const detailResponse = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//         );

//         if (!detailResponse.ok) {

//           console.error(
//             `DETAIL API FAILED FOR HEADER ${headerId}:`,
//             detailResponse.status
//           );

//           continue;
//         }

//         const detailResult =
//           await detailResponse.json();

//         const details = Array.isArray(
//           detailResult
//         )
//           ? detailResult
//           : Array.isArray(
//               detailResult?.data
//             )
//           ? detailResult.data
//           : [];

//         console.log(
//           `SHOP DETAILS - HEADER ${headerId}:`,
//           details
//         );

//         // ======================================================
//         // 8. PROCESS DETAILS
//         // ======================================================

//         details.forEach((item) => {

//           console.log(
//             "--------------------------------------"
//           );

//           console.log(
//             "SOLD RAW DETAIL ITEM:",
//             item
//           );

//           const rawProductId = Number(
//             item?.ProductId ??
//               item?.productId ??
//               0
//           );

//           const rawProductCode = String(
//             item?.ProductCode ??
//               item?.productCode ??
//               item?.Code ??
//               item?.code ??
//               ""
//           ).trim();

//           const quantity = Number(
//             item?.Quantity ??
//               item?.quantity ??
//               0
//           );

//           console.log(
//             "RAW PRODUCT ID:",
//             rawProductId
//           );

//           console.log(
//             "RAW PRODUCT CODE:",
//             rawProductCode
//           );

//           console.log(
//             "SOLD QUANTITY:",
//             quantity
//           );

//           // ----------------------------------------------------
//           // Find actual ProductId
//           // ----------------------------------------------------

//           const actualProductId =
//             getActualProductId(item);

//           console.log(
//             "ACTUAL PRODUCT ID USED FOR SOLD:",
//             actualProductId
//           );

//           // ----------------------------------------------------
//           // Invalid product
//           // ----------------------------------------------------

//           if (
//             !actualProductId ||
//             actualProductId <= 0
//           ) {
//             console.warn(
//               "SKIPPING SOLD ITEM - INVALID PRODUCT ID:",
//               item
//             );

//             return;
//           }

//           // ----------------------------------------------------
//           // Invalid quantity
//           // ----------------------------------------------------

//           if (
//             !Number.isFinite(quantity) ||
//             quantity <= 0
//           ) {
//             console.warn(
//               "SKIPPING SOLD ITEM - INVALID QUANTITY:",
//               item
//             );

//             return;
//           }

//           // ----------------------------------------------------
//           // FINAL SOLD MAP
//           // ----------------------------------------------------

//           const key =
//             String(actualProductId);

//           soldMap[key] =
//             Number(soldMap[key] || 0) +
//             quantity;

//         });

//       } catch (detailError) {

//         console.error(
//           `ERROR FETCHING DETAILS FOR HEADER ${headerId}:`,
//           detailError
//         );

//         continue;
//       }
//     }

//     // ==========================================================
//     // 9. FINAL SOLD MAP
//     // ==========================================================

//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL SOLD QUANTITY MAP:",
//       soldMap
//     );

//     console.log(
//       "======================================"
//     );

//     // ==========================================================
//     // 10. SAVE TO STATE
//     // ==========================================================

//     setSoldQuantities(soldMap);

//     // ==========================================================
//     // 11. RETURN LATEST DATA
//     // IMPORTANT FOR handleSave
//     // ==========================================================

//     return soldMap;

//   } catch (error) {

//     console.error(
//       "FETCH SOLD QUANTITIES ERROR:",
//       error
//     );

//     setSoldQuantities({});

//     return {};
//   }
// };


// const [mainOfficeQuantities, setMainOfficeQuantities] = useState({});
// const [physicalQuantities, setPhysicalQuantities] = useState({});




// const fetchMainOfficeStock = async (selectedDate = date) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH MAIN OFFICE STOCK");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Main Office Header API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     const headers = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : [];

//     // ----------------------------------------------------------
//     // SELECTED DATE
//     // ----------------------------------------------------------

//     const selectedDateString =
//       selectedDate instanceof Date
//         ? `${selectedDate.getFullYear()}-${String(
//             selectedDate.getMonth() + 1
//           ).padStart(2, "0")}-${String(
//             selectedDate.getDate()
//           ).padStart(2, "0")}`
//         : String(selectedDate).slice(0, 10);

//     console.log(
//       "MAIN OFFICE SELECTED DATE:",
//       selectedDateString
//     );

//     // ----------------------------------------------------------
//     // GET ALL MAIN OFFICE HEADERS FOR SELECTED DATE
//     // LocationType = O
//     // ----------------------------------------------------------

//     const mainOfficeHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//           item?.locationType ??
//           ""
//       )
//         .trim()
//         .toUpperCase();

//       const entryDate = String(
//         item?.EntryDate ??
//           item?.entryDate ??
//           item?.Date ??
//           item?.date ??
//           ""
//       ).slice(0, 10);

//       return (
//         locationType === "O" &&
//         entryDate === selectedDateString
//       );
//     });

//     console.log(
//       "MAIN OFFICE HEADERS FOR DATE:",
//       mainOfficeHeaders
//     );

//     console.log(
//       "TOTAL MAIN OFFICE HEADERS:",
//       mainOfficeHeaders.length
//     );

//     // ----------------------------------------------------------
//     // NO MAIN OFFICE ENTRY
//     // ----------------------------------------------------------

//     if (mainOfficeHeaders.length === 0) {
//       console.log(
//         "NO MAIN OFFICE HEADER FOR SELECTED DATE"
//       );

//       setMainOfficeQuantities({});
//       return {};
//     }

//     // ----------------------------------------------------------
//     // FETCH DETAILS FROM ALL MAIN OFFICE HEADERS
//     // ----------------------------------------------------------

//     const stockMap = {};

//     for (const header of mainOfficeHeaders) {
//       const headerId = Number(header?.Id);

//       if (!headerId) {
//         continue;
//       }

//       console.log(
//         "FETCHING MAIN OFFICE DETAILS - HEADER:",
//         headerId
//       );

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//       );

//       if (!detailResponse.ok) {
//         console.error(
//           "DETAIL API FAILED:",
//           headerId,
//           detailResponse.status
//         );

//         continue;
//       }

//       const detailResult =
//         await detailResponse.json();

//       const details = Array.isArray(detailResult)
//         ? detailResult
//         : Array.isArray(detailResult?.data)
//         ? detailResult.data
//         : [];

//       console.log(
//         `MAIN OFFICE DETAILS - HEADER ${headerId}:`,
//         details
//       );

//       // --------------------------------------------------------
//       // ADD PRODUCT QUANTITY
//       // --------------------------------------------------------

//       details.forEach((item) => {
//         const productId = Number(
//           item?.ProductId ??
//             item?.productId ??
//             0
//         );

//         const quantity = Number(
//           item?.Quantity ??
//             item?.quantity ??
//             0
//         );

//         if (!productId) {
//           return;
//         }

//         const key = String(productId);

//         stockMap[key] =
//           (stockMap[key] || 0) +
//           quantity;
//       });
//     }

//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL DATE-WISE MAIN OFFICE STOCK MAP:",
//       stockMap
//     );

//     console.log(
//       "======================================"
//     );

//     setMainOfficeQuantities(stockMap);

//     return stockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE STOCK ERROR:",
//       error
//     );

//     setMainOfficeQuantities({});

//     return {};
//   }
// };




// const handlePhysicalQuantityChange = (
//   productId,
//   value
// ) => {
//   setPhysicalQuantities((prev) => ({
//     ...prev,
//     [String(productId)]: value,
//   }));
// };



//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productQuantities, setProductQuantities] = useState({});



//   const [openReport, setOpenReport] = useState(false);


// // ==========================================================
// // PRODUCT SELECTION
// // ==========================================================

// const [selectedProduct, setSelectedProduct] = useState(null);
// const [productQuantity, setProductQuantity] = useState("");
// const [productRate, setProductRate] = useState("");


// // ==========================================================
// // PRODUCT CHANGE
// // ==========================================================

// const handleProductChange = (event, newValue) => {
//   setSelectedProduct(newValue);

//   // No product selected
//   if (!newValue) {
//     setProductQuantity("");
//     setProductRate("");
//     return;
//   }

//   const productId = String(newValue.value);

//   const savedValue =
//     productQuantities?.[productId];

//   let savedQuantity = "";
//   let savedRate = Number(newValue.rate || 0);

//   // Existing saved product
//   if (
//     savedValue &&
//     typeof savedValue === "object"
//   ) {
//     savedQuantity =
//       savedValue?.quantity ?? "";

//     if (
//       savedValue?.rate !== undefined &&
//       savedValue?.rate !== ""
//     ) {
//       savedRate =
//         Number(savedValue.rate);
//     }
//   } else if (
//     savedValue !== undefined &&
//     savedValue !== null &&
//     savedValue !== ""
//   ) {
//     savedQuantity = savedValue;
//   }

//   setProductQuantity(
//     savedQuantity === ""
//       ? ""
//       : String(savedQuantity)
//   );

//   setProductRate(
//     savedRate === 0
//       ? ""
//       : String(savedRate)
//   );
// };


// // ==========================================================
// // QUANTITY CHANGE
// // ==========================================================

// const handleQuantityChange = (event) => {
//   const value = event.target.value;

//   setProductQuantity(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         value === ""
//           ? ""
//           : Number(value),

//       rate:
//         previous[productId]?.rate ??
//         Number(selectedProduct.rate || 0),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };


// // ==========================================================
// // RATE CHANGE
// // ==========================================================

// const handleRateChange = (event) => {
//   const value = event.target.value;

//   setProductRate(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         previous[productId]?.quantity ??
//         Number(productQuantity || 0),

//       rate:
//         value === ""
//           ? ""
//           : Number(value),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };
//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT MASTER - REGULAR RATE
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       console.log("PRODUCT MASTER API RESPONSE:", data);

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: Number(item?.Id ?? item?.ProductId ?? 0),

//           label: String(item?.ProductName ?? item?.Name ?? "").trim(),

//           productCode:
//             item?.ProductCode ??
//             item?.Code ??
//             item?.ProductCodeNo ??
//             item?.Id ??
//             "",

//           // ==================================================
//           // REGULAR RATE
//           // If Rate exists and > 0, use Rate.
//           // Otherwise use PurchasePrice.
//           // ==================================================
//           rate: Number(
//             Number(item?.Rate) > 0 ? item?.Rate : (item?.PurchasePrice ?? 0),
//           ),
//         }));

//       console.log("PRODUCT OPTIONS WITH RATE:", options);

//       setProductOptions(options);
//     } catch (error) {
//       console.error("Product API Error:", error);

//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADER RECORDS
//   // ==========================================================
//   const fetchDailyStockHeaders = async () => {
//     try {
//       console.log("====================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("====================================");

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
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : [];
//       } catch (error) {
//         console.error("DAILY STOCK HEADER JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER API RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE API RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//       console.log("ALL DAILY STOCK HEADER RECORDS:", data);

//       // ======================================================
//       // MAP DATA
//       // ======================================================

//      const mappedData = data
//   // ==========================================================
//   // DAILY STOCK SHOP ENTRIES ONLY
//   // Main Office = O
//   // Shop       = S
//   // ==========================================================
//   .filter((item) => {
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     return locationType === "S";
//   })

//   .map((item) => {
//     // ========================================================
//     // HEADER ID
//     // ========================================================
//     const id =
//       item?.Id ??
//       item?.id ??
//       item?.DailyStockHeaderId ??
//       item?.HeaderId ??
//       "";

//     // ========================================================
//     // DATE
//     // ========================================================
//     const entryDate =
//       item?.EntryDate ??
//       item?.entryDate ??
//       item?.Date ??
//       item?.date ??
//       "";

//     // ========================================================
//     // SHOP NAME
//     //
//     // API response मध्ये ShopName नसल्यास
//     // Daily Stock Shop साठी fixed name वापरू
//     // ========================================================
//     const shopName =
//       item?.ShopName ??
//       item?.AccountName ??
//       item?.Shop ??
//       item?.shop ??
//       item?.Name ??
//       "Stock Entry Shop";

//     // ========================================================
//     // TOTAL AMOUNT
//     // ========================================================
//     const totalAmount = Number(
//       item?.TotalAmount ??
//         item?.totalAmount ??
//         item?.Total ??
//         item?.total ??
//         0
//     );

//     // ========================================================
//     // LOCATION TYPE
//     // ========================================================
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         "S"
//     )
//       .trim()
//       .toUpperCase();

//     // ========================================================
//     // SHOP ID
//     // ========================================================
//     const shopId =
//       item?.ShopId ??
//       item?.shopId ??
//       item?.LocationId ??
//       item?.locationId ??
//       "";

//     // ========================================================
//     // FINAL MAPPED OBJECT
//     // ========================================================
//     return {
//       ...item,

//       // Header ID
//       Id: id,
//       id: id,
//       HeaderId: id,

//       // Date
//       EntryDate: entryDate,
//       dateText: entryDate
//         ? formatDate(entryDate)
//         : "",

//       // Shop
//       ShopName: shopName,
//       shop: shopName,

//       // Shop / Location
//       ShopId: shopId,
//       shopId: shopId,
//       LocationId: shopId,

//       // Location Type
//       LocationType: locationType,

//       // Total
//       TotalAmount: totalAmount,
//       total: totalAmount,
//     };
//   });

// console.log(
//   "=========================================="
// );
// console.log(
//   "DAILY STOCK SHOP MAPPED DATA"
// );
// console.log(
//   "=========================================="
// );
// console.log(
//   "TOTAL SHOP RECORDS:",
//   mappedData.length
// );
// console.log(
//   "MAPPED DAILY STOCK SHOP RECORDS:",
//   mappedData
// );

// // ==========================================================
// // SET TABLE DATA
// // ==========================================================
// setStockEntries(mappedData);

// // Reset pagination
// setPageNo(1);

// return mappedData;

//       console.log("MAPPED DAILY STOCK HEADER RECORDS:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Page reset
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("FETCH ALL DAILY STOCK HEADER ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header data could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       const id = Number(headerId);

//       console.log("DAILY STOCK HEADER ID:", id);

//       if (!id) {
//         throw new Error("Daily Stock Header ID not found");
//       }

//       const url = `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${id}`;

//       console.log("DAILY STOCK DETAIL GET URL:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       console.log("DETAIL GET STATUS:", response.status);
//       console.log("DETAIL GET STATUS TEXT:", response.statusText);

//       const text = await response.text();

//       console.log("DETAIL GET RAW RESPONSE:", text);

//       let result;

//       try {
//         result = JSON.parse(text);
//       } catch (error) {
//         console.error("DETAIL GET JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Detail API response: ${text}`);
//       }

//       console.log("DAILY STOCK DETAIL API RESPONSE:", result);

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             `Daily Stock Detail API failed: ${response.status}`,
//         );
//       }

//       if (result?.success === false) {
//         throw new Error(
//           result?.message || "Daily Stock Detail data could not be loaded",
//         );
//       }

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//     const mappedData = data.map((item) => ({
//   Id: Number(
//     item?.Id ??
//     item?.id ??
//     0
//   ),

//   DailyStockHeaderId: Number(
//     item?.DailyStockHeaderId ??
//     item?.dailyStockHeaderId ??
//     headerId ??
//     0
//   ),

//   ProductId: Number(
//     item?.ProductId ??
//     item?.ProductID ??
//     item?.productId ??
//     item?.productID ??
//     item?.product_id ??
//     0
//   ),

//   Quantity: Number(
//     item?.Quantity ??
//     item?.quantity ??
//     item?.Qty ??
//     item?.qty ??
//     0
//   ),

//   Rate: Number(
//     item?.Rate ??
//     item?.rate ??
//     item?.Price ??
//     item?.price ??
//     0
//   ),

//   Amount: Number(
//     item?.Amount ??
//     item?.amount ??
//     0
//   ),
// }));

//       console.log("DAILY STOCK DETAIL FINAL DATA:", mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error(
//         error?.message || "Daily Stock Detail data could not be loaded",
//       );

//       return [];
//     }
//   };

//   const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
//     try {
//       // ============================================================
//       // 1. VALIDATE HEADER ID
//       // ============================================================

//       const id = Number(headerId);

//       console.log("========== DAILY STOCK HEADER UPDATE ==========");
//       console.log("HEADER ID:", id);
//       console.log("ENTRY DATE:", entryDate);
//       console.log("TOTAL AMOUNT:", totalAmount);

//       if (!Number.isInteger(id) || id <= 0) {
//         throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
//       }

//       // ============================================================
//       // 2. FORMAT DATE
//       // API ला YYYY-MM-DD format मध्ये date पाठवा
//       // ============================================================

//       let formattedEntryDate = "";

//       if (entryDate) {
//         if (typeof entryDate === "string") {
//           // Already YYYY-MM-DD
//           if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//             formattedEntryDate = entryDate;
//           }

//           // DD-MM-YYYY
//           else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//             const [day, month, year] = entryDate.split("-");

//             formattedEntryDate = `${year}-${month}-${day}`;
//           }

//           // Try Date parsing
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

//       if (!formattedEntryDate) {
//         throw new Error(`Invalid EntryDate: ${entryDate}`);
//       }

//       console.log("FORMATTED ENTRY DATE:", formattedEntryDate);

//       // ============================================================
//       // 3. TOTAL AMOUNT
//       // ============================================================

//       const amount = Number(totalAmount || 0);

//       if (isNaN(amount)) {
//         throw new Error(`Invalid TotalAmount: ${totalAmount}`);
//       }

//       // ============================================================
//       // 4. SHOP ID
//       // ============================================================

//       const shopId = Number(STOCK_ENTRY_SHOP_ID);

//       if (!Number.isInteger(shopId) || shopId <= 0) {
//         throw new Error(`Invalid ShopId: ${STOCK_ENTRY_SHOP_ID}`);
//       }

//       // ============================================================
//       // 5. UPDATED BY
//       // ============================================================

//       const updatedBy = Number(CREATED_BY);

//       if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//         throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
//       }

//       // ============================================================
//       // 6. CREATE FORM DATA
//       // ============================================================

//       const updateData = new URLSearchParams();

//       updateData.append("Id", String(id));
//       updateData.append("EntryDate", formattedEntryDate);
//       updateData.append("ShopId", String(shopId));

//       // Existing record मध्ये OfficeId NULL आहे,
//       // म्हणून blank ठेवत आहोत.

//       updateData.append("TotalAmount", String(amount));

//       updateData.append("UpdatedBy", String(updatedBy));

//       // ============================================================
//       // 7. LOG EXACT REQUEST
//       // ============================================================

//       console.log(
//         "DAILY STOCK HEADER UPDATE PAYLOAD:",
//         Object.fromEntries(updateData.entries()),
//       );

//       // ============================================================
//       // 8. API CALL
//       // ============================================================

//       const apiUrl =
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//       console.log("DAILY STOCK HEADER UPDATE URL:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData,

//         redirect: "follow",
//       });

//       // ============================================================
//       // 9. READ RAW RESPONSE
//       // IMPORTANT FOR 500 ERROR
//       // ============================================================

//       console.log("HEADER UPDATE STATUS:", response.status);

//       console.log("HEADER UPDATE STATUS TEXT:", response.statusText);

//       const rawResponse = await response.text();

//       console.log("HEADER UPDATE RAW RESPONSE:", rawResponse);

//       // ============================================================
//       // 10. HTTP ERROR
//       // ============================================================

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header Update API failed: ${response.status}${
//             rawResponse ? ` - ${rawResponse}` : ""
//           }`,
//         );
//       }

//       // ============================================================
//       // 11. PARSE JSON
//       // ============================================================

//       let result;

//       try {
//         result = rawResponse ? JSON.parse(rawResponse) : {};
//       } catch (jsonError) {
//         console.error("HEADER UPDATE JSON PARSE ERROR:", jsonError);

//         throw new Error(`Invalid Header Update API response: ${rawResponse}`);
//       }

//       console.log("DAILY STOCK HEADER UPDATE RESPONSE:", result);

//       // ============================================================
//       // 12. CHECK API SUCCESS
//       // ============================================================

//       if (result?.success === false) {
//         throw new Error(result?.message || "Daily Stock Header update failed");
//       }

//       console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

//       return result;
//     } catch (error) {
//       console.error("❌ Daily Stock Header Update API Error:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

// useEffect(() => {
//   const loadStockData = async () => {
//     try {
//       await fetchProduct();
//       await fetchDailyStockHeaders();
//       await fetchMainOfficeStock(date);
//       await fetchSoldQuantities(date);
//     } catch (error) {
//       console.error(
//         "ERROR LOADING DAILY STOCK DATA:",
//         error
//       );
//     }
//   };

//   if (date) {
//     loadStockData();
//   }
// }, [date]);


//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//  const resetForm = () => {
//   setDate(new Date());

//   setProductQuantities({});

//   setSelectedProduct(null);

//   setProductQuantity("");

//   setProductRate("");

//   setEditingEntry(null);

//   setPhysicalQuantities({});
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
//   // PRODUCT QUANTITY CHANGE
//   // ==========================================================

//  const handleProductQuantityChange = (productId, value) => {
//   const key = String(productId);

//   // ==========================================================
//   // PHYSICAL QUANTITY
//   // ==========================================================
//   setPhysicalQuantities((previous) => ({
//     ...previous,
//     [key]: value,
//   }));

//   // ==========================================================
//   // PRODUCT QUANTITY
//   // Keep rate + detailId while changing quantity
//   // ==========================================================
//   setProductQuantities((previous) => {
//     const existing = previous[key];

//     return {
//       ...previous,
//       [key]: {
//         ...(existing && typeof existing === "object"
//           ? existing
//           : {}),
//         quantity: value,
//       },
//     };
//   });
// };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA
//   // ==========================================================
//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id || item?.id || "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ||
//         item?.AccountName ||
//         item?.Shop ||
//         item?.Name ||
//         item?.shop ||
//         "Stock Entry Shop",

//       total: Number(item?.TotalAmount ?? item?.total ?? 0),
//     }));
//   }, [stockEntries]);








//   // ==========================================================
//   // SAVE / UPDATE STOCK ENTRY SHOP
//   // ==========================================================
//  const handleSave = async (skipComparisonPopup = false) => {

//  console.log("🔥🔥🔥 HANDLE SAVE CALLED 🔥🔥🔥");
//   console.log("skipComparisonPopup =", skipComparisonPopup);
//   console.log("physicalQuantities =", physicalQuantities);
//   console.log("productQuantities =", productQuantities);
  
//   // ==========================================================
//   // DATE VALIDATION
//   // ==========================================================
//   if (!date) {
//     toast.error("Please select Date");
//     return;
//   }

//   // ==========================================================
//   // CREATE DATE STRING
//   // ==========================================================
//   const entryDate = `${date.getFullYear()}-${String(
//     date.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     date.getDate()
//   ).padStart(2, "0")}`;

//   // ==========================================================
//   // PREPARE SELECTED PRODUCTS
//   // ==========================================================
//   const selectedRows = productOptions
//     .map((product) => {
//       const productId = String(product.value);

//       const savedValue =
//         productQuantities?.[productId];

//       // IMPORTANT:
//       // Physical Quantity is the actual entered quantity
//       const physicalValue =
//         physicalQuantities?.[productId];

//       const quantity =
//         physicalValue !== undefined &&
//         physicalValue !== ""
//           ? Number(physicalValue)
//           : savedValue &&
//             typeof savedValue === "object"
//           ? Number(savedValue?.quantity || 0)
//           : Number(savedValue || 0);

//       // Existing detail ID
//       const detailId =
//         savedValue &&
//         typeof savedValue === "object"
//           ? savedValue?.detailId || ""
//           : "";

//       // Rate
//       const rate =
//         savedValue &&
//         typeof savedValue === "object" &&
//         savedValue.rate !== undefined &&
//         savedValue.rate !== ""
//           ? Number(savedValue.rate)
//           : Number(product.rate || 0);

//       return {
//         Id: detailId,

//         ProductId: Number(product.value),

//         ProductCode:
//           product.productCode || "",

//         ProductName:
//           product.label || "",

//         Quantity: quantity,

//         Rate: rate,

//         Amount:
//           quantity * rate,
//       };
//     })
//     .filter(
//       (row) =>
//         Number(row.Quantity) > 0 ||
//         row.Id
//     );

//   console.log(
//     "=================================================="
//   );


//   // ==========================================================
// // REFRESH MAIN OFFICE + SOLD STOCK BEFORE COMPARISON
// // ==========================================================

// let latestMainOfficeQuantities = mainOfficeQuantities;
// let latestSoldQuantities = soldQuantities;

// if (!skipComparisonPopup) {
//   console.log(
//     "🔄 REFRESHING STOCK DATA BEFORE COMPARISON..."
//   );

//   try {
//     // ------------------------------------------------------
//     // FETCH LATEST MAIN OFFICE STOCK
//     // ------------------------------------------------------
//     latestMainOfficeQuantities =
//       await fetchMainOfficeStock(date);

//     // ------------------------------------------------------
//     // FETCH LATEST SOLD STOCK
//     // ------------------------------------------------------
//     latestSoldQuantities =
//       await fetchSoldQuantities(date);

//     console.log(
//       "LATEST MAIN OFFICE QUANTITIES:",
//       latestMainOfficeQuantities
//     );

//     console.log(
//       "LATEST SOLD QUANTITIES:",
//       latestSoldQuantities
//     );

//   } catch (error) {
//     console.error(
//       "ERROR REFRESHING STOCK BEFORE COMPARISON:",
//       error
//     );

//     latestMainOfficeQuantities = {};
//     latestSoldQuantities = {};
//   }
// }
//   console.log(
//     "FINAL SELECTED ROWS:",
//     selectedRows
//   );
//   console.log(
//     "=================================================="
//   );

//   // ==========================================================
//   // VALIDATE QUANTITY
//   // ==========================================================
//   if (selectedRows.length === 0) {
//     toast.error(
//       "Please enter quantity for at least one product"
//     );
//     return;
//   }

//   // ==========================================================
//   // TOTAL AMOUNT
//   // ==========================================================
//   const totalAmount =
//     selectedRows.reduce(
//       (sum, row) =>
//         sum +
//         Number(row.Quantity || 0) *
//           Number(row.Rate || 0),
//       0
//     );

//   console.log(
//     "TOTAL AMOUNT:",
//     totalAmount
//   );

//   // ==========================================================
//   // IMPORTANT:
//   // SHOW POPUP BEFORE API SAVE
//   // ==========================================================
//  if (!skipComparisonPopup) {

//   // ==========================================================
//   // REFRESH DATA FROM API
//   // ==========================================================

//   const latestMainOfficeQuantities =
//     await fetchMainOfficeStock(date);

//   const latestSoldQuantities =
//     await fetchSoldQuantities(date);

//   console.log(
//     "LATEST MAIN OFFICE STOCK:",
//     latestMainOfficeQuantities
//   );

//   console.log(
//     "LATEST SOLD STOCK:",
//     latestSoldQuantities
//   );

//   // ==========================================================
//   // CREATE COMPARISON DATA
//   // ==========================================================

//   const comparisonData =
//     selectedRows.map((row) => {

//       const productId =
//         String(row.ProductId);

//       // ------------------------------------------------------
//       // MAIN OFFICE STOCK
//       // ------------------------------------------------------

//       const mainOfficeQty =
//         Number(
//           latestMainOfficeQuantities?.[productId] || 0
//         );

//       // ------------------------------------------------------
//       // SOLD / SHOP DAILY STOCK
//       // ------------------------------------------------------

//       const soldQty =
//         Number(
//           latestSoldQuantities?.[productId] || 0
//         );

//       // ------------------------------------------------------
//       // EXPECTED STOCK
//       // Main Office - Sold
//       // ------------------------------------------------------

//       const expectedQty =
//         mainOfficeQty - soldQty;

//       // ------------------------------------------------------
//       // PHYSICAL STOCK
//       // ------------------------------------------------------

//       const physicalQty =
//         Number(row.Quantity || 0);

//       // ------------------------------------------------------
//       // DIFFERENCE
//       // ------------------------------------------------------

//       const difference =
//         expectedQty - physicalQty;

//       return {
//         ProductId:
//           row.ProductId,

//         ProductCode:
//           row.ProductCode,

//         ProductName:
//           row.ProductName,

//         MainOffice:
//           mainOfficeQty,

//         Sold:
//           soldQty,

//         Expected:
//           expectedQty,

//         Physical:
//           physicalQty,

//         Difference:
//           difference,

//         Rate:
//           Number(row.Rate || 0),
//       };
//     });

//   console.log(
//     "======================================"
//   );

//   console.log(
//     "FINAL STOCK COMPARISON:",
//     comparisonData
//   );

//   console.log(
//     "======================================"
//   );

//   setComparisonRows(
//     comparisonData
//   );

//   setSaving(false);

//   setOpenComparisonPopup(true);

//   return;
// }

//   // ==========================================================
//   // ACTUAL API SAVE STARTS HERE
//   // ==========================================================
//   console.log("🚨🚨🚨 ACTUAL API SAVE BLOCK ENTERED 🚨🚨🚨");
// console.log("skipComparisonPopup =", skipComparisonPopup);
//   try {
//     setSaving(true);

//     console.log(
//       "=================================================="
//     );
//     console.log(
//       "ACTUAL SAVE STARTED"
//     );
//     console.log(
//       "=================================================="
//     );

//     // ========================================================
//     // EDIT EXISTING ENTRY
//     // ========================================================
//     if (editingEntry) {
//       const headerId =
//         editingEntry?.Id ||
//         editingEntry?.id;

//       if (!headerId) {
//         throw new Error(
//           "Stock Entry Shop Header ID not found"
//         );
//       }

//       console.log(
//         "UPDATING STOCK ENTRY SHOP:",
//         headerId
//       );

//       // ------------------------------------------------------
//       // UPDATE HEADER
//       // ------------------------------------------------------
//       await updateDailyStockHeader(
//         headerId,
//         entryDate,
//         totalAmount
//       );

//       // ------------------------------------------------------
//       // UPDATE / INSERT DETAILS
//       // ------------------------------------------------------
//       for (const row of selectedRows) {
//         const detailId =
//           row?.Id ||
//           row?.id ||
//           "";

//         const quantity =
//           Number(row?.Quantity || 0);

//         const rate =
//           Number(row?.Rate || 0);

//         const amount =
//           quantity * rate;

//         // ====================================================
//         // UPDATE EXISTING DETAIL
//         // ====================================================
//         if (detailId) {
//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "Id",
//             String(Number(detailId))
//           );

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(Number(row.ProductId))
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "UpdatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "UPDATE DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",
//                 headers: {
//                   Accept:
//                     "application/json",
//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },
//                 body:
//                   detailData.toString(),
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL UPDATE RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Update API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail update failed"
//             );
//           }
//         }

//         // ====================================================
//         // INSERT NEW DETAIL
//         // ====================================================
//         else {
//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(Number(row.ProductId))
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "CreatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "INSERT DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",
//                 headers: {
//                   Accept:
//                     "application/json",
//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },
//                 body:
//                   detailData,
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL INSERT RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Insert API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail insert failed"
//             );
//           }
//         }
//       }

//       // ------------------------------------------------------
//       // UPDATE LOCAL TABLE
//       // ------------------------------------------------------
//       setStockEntries((previous) =>
//         previous.map((item) => {
//           const itemId =
//             item?.Id ||
//             item?.id;

//           if (
//             String(itemId) !==
//             String(headerId)
//           ) {
//             return item;
//           }

//           return {
//             ...item,

//             EntryDate:
//               entryDate,

//             dateText:
//               formatDate(entryDate),

//             TotalAmount:
//               Number(totalAmount || 0),

//             total:
//               Number(totalAmount || 0),
//           };
//         })
//       );

//       toast.success(
//         "Stock Entry Shop updated successfully!"
//       );
//     }

//     // ========================================================
//     // NEW ENTRY
//     // ========================================================
//     else {
//       // ------------------------------------------------------
//       // HEADER DATA
//       // ------------------------------------------------------
//       const headerData =
//         new URLSearchParams();

//       headerData.append(
//         "EntryDate",
//         String(entryDate)
//       );

//       headerData.append(
//         "ShopId",
//         String(STOCK_ENTRY_SHOP_ID)
//       );

//       headerData.append(
//         "OfficeId",
//         ""
//       );

//       headerData.append(
//         "TotalAmount",
//         String(
//           Number(totalAmount || 0)
//         )
//       );

//       headerData.append(
//         "CreatedBy",
//         String(CREATED_BY)
//       );

//       console.log(
//         "STOCK ENTRY SHOP HEADER DATA:",
//         Object.fromEntries(
//           headerData.entries()
//         )
//       );

//       // ------------------------------------------------------
//       // HEADER API
//       // ------------------------------------------------------
//       const headerResponse =
//         await fetch(
//           "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
//           {
//             method: "POST",
//             mode: "cors",
//             credentials: "omit",
//             headers: {
//               Accept:
//                 "application/json",
//               "Content-Type":
//                 "application/x-www-form-urlencoded;charset=UTF-8",
//             },
//             body:
//               headerData.toString(),
//           }
//         );

//       const headerText =
//         await headerResponse.text();

//       console.log(
//         "HEADER RESPONSE:",
//         headerText
//       );

//       let headerResult = {};

//       try {
//         headerResult =
//           headerText
//             ? JSON.parse(headerText)
//             : {};
//       } catch {
//         throw new Error(
//           `Invalid Header API response: ${headerText}`
//         );
//       }

//       if (
//         !headerResponse.ok ||
//         !headerResult?.success
//       ) {
//         throw new Error(
//           headerResult?.message ||
//             "Daily Stock Header save failed"
//         );
//       }

//       const headerId =
//         headerResult?.Id ??
//         headerResult?.id ??
//         headerResult?.insert_id ??
//         headerResult?.DailyStockHeaderId ??
//         headerResult?.data?.Id ??
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error(
//           "Header created but Header ID was not returned."
//         );
//       }

//       console.log(
//         "CREATED HEADER ID:",
//         headerId
//       );

//       // ------------------------------------------------------
//       // SAVE DETAILS
//       // ------------------------------------------------------
//       for (const row of selectedRows) {
//         const detailData =
//           new URLSearchParams();

//         detailData.append(
//           "DailyStockHeaderId",
//           String(Number(headerId))
//         );

//         detailData.append(
//           "ProductId",
//           String(Number(row.ProductId))
//         );

//         detailData.append(
//           "Quantity",
//           String(Number(row.Quantity || 0))
//         );

//         detailData.append(
//           "Rate",
//           String(Number(row.Rate || 0))
//         );

//         detailData.append(
//           "Amount",
//           String(Number(row.Amount || 0))
//         );

//         detailData.append(
//           "CreatedBy",
//           String(CREATED_BY)
//         );

//         console.log(
//           "DETAIL SAVE PAYLOAD:",
//           Object.fromEntries(
//             detailData.entries()
//           )
//         );

//         const detailResponse =
//           await fetch(
//             "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//             {
//               method: "POST",
//               headers: {
//                 Accept:
//                   "application/json",
//                 "Content-Type":
//                   "application/x-www-form-urlencoded",
//               },
//               body:
//                 detailData.toString(),
//             }
//           );

//         const detailText =
//           await detailResponse.text();

//         console.log(
//           "DETAIL RESPONSE:",
//           detailText
//         );

//         let detailResult = {};

//         try {
//           detailResult =
//             detailText
//               ? JSON.parse(detailText)
//               : {};
//         } catch {
//           throw new Error(
//             `Invalid Detail API response: ${detailText}`
//           );
//         }

//         if (
//           !detailResponse.ok ||
//           detailResult?.success === false
//         ) {
//           throw new Error(
//             detailResult?.message ||
//               "Daily Stock Detail save failed"
//           );
//         }
//       }

//       // ------------------------------------------------------
//       // ADD NEW RECORD TO TABLE
//       // ------------------------------------------------------
//       const newEntry = {
//         Id: Number(headerId),

//         id: Number(headerId),

//         EntryDate:
//           entryDate,

//         dateText:
//           formatDate(entryDate),

//         ShopId:
//           STOCK_ENTRY_SHOP_ID,

//         OfficeId:
//           null,

//         LocationType:
//           "S",

//         ShopName:
//           "Stock Entry Shop",

//         shop:
//           "Stock Entry Shop",

//         TotalAmount:
//           Number(totalAmount || 0),

//         total:
//           Number(totalAmount || 0),
//       };

//       setStockEntries(
//         (previous) => [
//           newEntry,
//           ...previous,
//         ]
//       );

//       toast.success(
//         "Stock Entry Shop saved successfully!"
//       );
//     }

//     // ========================================================
//     // CLOSE FORM AFTER ACTUAL SAVE
//     // ========================================================
//     setOpenForm(false);

//     resetForm();

//     setPageNo(1);

//     // Refresh headers
//     await fetchDailyStockHeaders();

//   } catch (error) {
//     console.error(
//       "STOCK ENTRY SHOP SAVE ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to save Stock Entry Shop"
//     );
//   } finally {
//     setSaving(false);
//   }
// };

//   // ==========================================================
//   // DELETE MAIN ENTRY
//   // ==========================================================

//   // ==========================================================
//   // EDIT STOCK ENTRY SHOP
//   // ==========================================================
//   // ==========================================================
// // EDIT STOCK ENTRY SHOP
// // ==========================================================


// const handleEditEntry = async (entry) => {
//   try {
//     console.log("====================================");
//     console.log("EDIT STOCK ENTRY SHOP");
//     console.log("ENTRY:", entry);
//     console.log("====================================");

//     // --------------------------------------------------
//     // HEADER ID
//     // --------------------------------------------------
//     const headerId =
//       entry?.Id ??
//       entry?.id ??
//       entry?.DailyStockHeaderId;

//     if (!headerId) {
//       toast.error(
//         "Stock Entry Shop Header ID not found"
//       );
//       return;
//     }

//     console.log(
//       "EDIT HEADER ID:",
//       headerId
//     );

//     // --------------------------------------------------
//     // SET EDITING ENTRY
//     // --------------------------------------------------
//     setEditingEntry({
//       ...entry,
//       Id: Number(headerId),
//       id: Number(headerId),
//     });

//     // --------------------------------------------------
//     // SET DATE
//     // --------------------------------------------------
//     const entryDate =
//       entry?.EntryDate ??
//       entry?.entryDate ??
//       entry?.date;

//     if (entryDate) {
//       const parsedDate = new Date(entryDate);

//       if (!isNaN(parsedDate.getTime())) {
//         setDate(parsedDate);
//       }
//     }

//     // --------------------------------------------------
//     // CLEAR OLD QUANTITIES
//     // --------------------------------------------------
//     setProductQuantities({});

//     // --------------------------------------------------
//     // OPEN FORM
//     // --------------------------------------------------
//     setOpenForm(true);

//     // --------------------------------------------------
//     // IMPORTANT:
//     // FETCH DETAILS USING HEADER ID
//     // --------------------------------------------------
//     const details =
//       await fetchDailyStockDetail(headerId);

//     console.log(
//       "EDIT DAILY STOCK DETAILS:",
//       details
//     );

//     if (!Array.isArray(details)) {
//       console.error(
//         "Invalid detail response:",
//         details
//       );

//       toast.error(
//         "Daily Stock details not found"
//       );

//       return;
//     }

//     // --------------------------------------------------
//     // CREATE PRODUCT QUANTITY MAP
//     // --------------------------------------------------
//     const quantityMap = {};

//     details.forEach((item) => {
//       const productId =
//         item?.ProductId ??
//         item?.productId;

//       if (
//         productId === null ||
//         productId === undefined ||
//         String(productId).trim() === ""
//       ) {
//         return;
//       }

//       const detailId =
//         item?.Id ??
//         item?.id ??
//         item?.DailyStockDetailId ??
//         "";

//       const quantity = Number(
//         item?.Quantity ??
//         item?.quantity ??
//         0
//       );

//       const rate = Number(
//         item?.Rate ??
//         item?.rate ??
//         0
//       );

//       quantityMap[String(productId)] = {
//         quantity: quantity,
//         rate: rate,
//         detailId: detailId,
//       };
//     });

//     console.log(
//       "EDIT PRODUCT QUANTITY MAP:",
//       quantityMap
//     );

//     // --------------------------------------------------
//     // SET EXISTING DATA
//     // --------------------------------------------------
//     setProductQuantities(quantityMap);


//     // ==========================================================
// // ALSO SET PHYSICAL QUANTITIES FOR EDIT MODE
// // ==========================================================
// const physicalMap = {};

// Object.keys(quantityMap).forEach((productId) => {
//   physicalMap[productId] =
//     quantityMap[productId]?.quantity ?? "";
// });

// setPhysicalQuantities(physicalMap);

//     // --------------------------------------------------
//     // ALSO UPDATE PRODUCT MASTER RATE
//     // --------------------------------------------------
//     setProductOptions((previousProducts) =>
//       previousProducts.map((product) => {
//         const saved =
//           quantityMap[
//             String(product.value)
//           ];

//         if (!saved) {
//           return product;
//         }

//         return {
//           ...product,
//           rate:
//             saved.rate !== undefined
//               ? saved.rate
//               : product.rate,
//         };
//       })
//     );

//   } catch (error) {
//     console.error(
//       "EDIT STOCK ENTRY SHOP ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to load Stock Entry Shop"
//     );
//   }
// };

//   // const handleDeleteEntry = (id) => {
//   //   setStockEntries((previousEntries) =>
//   //     previousEntries.filter((item) => item.id !== id),
//   //   );

//   //   toast.success("Entry removed successfully");
//   // };

//   const handleDeleteEntry = async (id) => {
//     if (!id) {
//       toast.error("Stock Entry ID not found");
//       return;
//     }

//     try {
//       setSaving(true);

//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//       console.log("DELETE STOCK ENTRY SHOP URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       console.log("DELETE API STATUS:", response.status);

//       console.log("DELETE API RESPONSE:", resultText);

//       if (!response.ok) {
//         throw new Error(`Delete API failed: ${response.status}`);
//       }

//       // Remove from UI after successful API delete
//       setStockEntries((previousEntries) =>
//         previousEntries.filter((item) => Number(item.id) !== Number(id)),
//       );

//       toast.success("Stock Entry Shop deleted successfully");
//     } catch (error) {
//       console.error("Delete Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to delete Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
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
//       // ====================================================
//       // SR NO
//       // ====================================================

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

//         header: "Shop",

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
//             <b>Stock Entry Shop </b>
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
//               CREATE DAILY STOCK ENTRY
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
//               Stock Entry Shop
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
//               {/* ==================================================
//       STOCK ENTRY SHOP
//   ================================================== */}
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Stock Entry Shop:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   fullWidth
//                   value="Stock Entry Shop"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "#fafafa",
//                       borderRadius: "5px",
//                     },

//                     "& .MuiInputBase-input": {
//                       fontSize: "14px",
//                       fontWeight: 500,
//                     },
//                   }}
//                 />
//               </Box>

//               {/* ==================================================
//       DATE
//   ================================================== */}
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

//             {/* =========================================================
//     PRODUCT SELECTION / QUANTITY / RATE / ADD
//     NOT REQUIRED FOR STOCK ENTRY SHOP
//     Products are shown directly in the table below.
// ========================================================= */}

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #d0d0d0",
//                 borderRadius: "6px",
//                 overflowX: "hidden",
//                 overflowY: "visible",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   width: "100%",
//                   tableLayout: "fixed",

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",
//                   },
//                 }}
//               >
//                 {/* =====================================================
//         TABLE HEADER
//     ===================================================== */}
//       <TableHead>
//   <TableRow
//     sx={{
//       backgroundColor: "#e9ecef",
//     }}
//   >
//     {/* PRODUCT CODE */}
//     <TableCell
//       sx={{
//         width: "18%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Code
//     </TableCell>

//     {/* PRODUCT NAME */}
//     <TableCell
//       sx={{
//         width: "42%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Name
//     </TableCell>

//     {/* QUANTITY */}
//     <TableCell
//       align="center"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Quantity
//     </TableCell>

//     {/* RATE */}
//     <TableCell
//       align="right"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Rate
//     </TableCell>
//   </TableRow>
// </TableHead>

//                 {/* =====================================================
//         TABLE BODY
//     ===================================================== */}

// <TableBody>
//   {loadingProducts ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         Loading Products...
//       </TableCell>
//     </TableRow>
//   ) : productOptions.length === 0 ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         No Products Found
//       </TableCell>
//     </TableRow>
//   ) : (
//     productOptions.map((product) => {
//       const savedValue =
//         productQuantities[
//           String(product.value)
//         ];

//       const quantity =
//         savedValue &&
//         typeof savedValue === "object"
//           ? savedValue?.quantity ?? ""
//           : savedValue ?? "";

//       return (
//         <TableRow
//           key={String(product.value)}
//           hover
//         >
//           {/* PRODUCT CODE */}
//           <TableCell>
//             {product.productCode || "-"}
//           </TableCell>

//           {/* PRODUCT NAME */}
//           <TableCell>
//             {product.label || "-"}
//           </TableCell>

//           {/* QUANTITY */}
//           <TableCell align="center">
//             <TextField
//               type="number"
//               size="small"
//               value={quantity}
//               onChange={(e) => {
//                 handleProductQuantityChange(
//                   product.value,
//                   e.target.value
//                 );
//               }}
//               placeholder="Enter Qty"
//               inputProps={{
//                 min: 0,
//                 step: 1,
//               }}
//               sx={{
//                 width: 110,

//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "6px",
//                   backgroundColor: "#fff",
//                 },

//                 "& .MuiInputBase-input": {
//                   textAlign: "center",
//                   fontSize: "15px",
//                 },
//               }}
//             />
//           </TableCell>

//           {/* RATE */}
//           <TableCell align="right">
//             ₹{" "}
//             {Number(
//               product.rate || 0
//             ).toFixed(2)}
//           </TableCell>
//         </TableRow>
//       );
//     })
//   )}
// </TableBody>

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
//             ></Box>
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
//   variant="contained"
//   disabled={saving}
//   onClick={() => handleSave(false)}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",

//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving ? "Saving..." : "Save"}
// </Button>
              

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

//         {/* ==========================================================
//     STOCK COMPARISON REPORT
// ========================================================== */}

// <Dialog
//   open={openReport}
//   onClose={() => setOpenReport(false)}
//   fullWidth
//   maxWidth="xl"
//   PaperProps={{
//     sx: {
//       borderRadius: "8px",
//       maxHeight: "90vh",
//     },
//   }}
// >
//   {/* REPORT HEADER */}
//   <DialogTitle
//     sx={{
//       backgroundColor: "rgb(236, 253, 230)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       borderBottom: "1px solid #ddd",
//       fontWeight: 700,
//       color: "#0B5E20",
//     }}
//   >
//     <Typography
//       sx={{
//         fontWeight: 700,
//         fontSize: "20px",
//       }}
//     >
//       Daily Stock Comparison Report
//     </Typography>

//     <IconButton
//       onClick={() => setOpenReport(false)}
//     >
//       <CloseIcon />
//     </IconButton>
//   </DialogTitle>

//   {/* REPORT CONTENT */}
//   <DialogContent dividers>
//     <TableContainer
//       component={Paper}
//       elevation={0}
//       sx={{
//         border: "1px solid #d0d0d0",
//         borderRadius: "6px",
//         overflowX: "auto",
//       }}
//     >
//       <Table
//         size="small"
//         sx={{
//           minWidth: 1000,

//           "& .MuiTableCell-root": {
//             border: "1px solid #d0d0d0",
//           },
//         }}
//       >
//         <TableHead>
//           <TableRow
//             sx={{
//               backgroundColor: "#e9ecef",
//             }}
//           >
//             <TableCell sx={{ fontWeight: 700 }}>
//               Product Code
//             </TableCell>

//             <TableCell sx={{ fontWeight: 700 }}>
//               Product Name
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Main Office Stock
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Sold
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Remaining
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Physical Stock
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Difference
//             </TableCell>

//             <TableCell
//               align="right"
//               sx={{ fontWeight: 700 }}
//             >
//               Rate
//             </TableCell>
//           </TableRow>
//         </TableHead>

//      <TableBody>
//   {productOptions.map((product) => {

//     const productId = String(product.value);

//     const savedValue =
//       productQuantities?.[productId];

//     const quantity =
//       typeof savedValue === "object"
//         ? savedValue?.quantity ?? ""
//         : savedValue ?? "";

//     const rate =
//       product.rate ??
//       product.SaleRate ??
//       product.Price ??
//       "";

//     return (
//       <TableRow
//         key={productId}
//         hover
//       >

//         <TableCell>
//           {product.productCode || "-"}
//         </TableCell>

//         <TableCell>
//           {product.label || "-"}
//         </TableCell>

//         <TableCell align="center">
//           <TextField
//             size="small"
//             type="number"
//             value={quantity}
//             placeholder="Enter Qty"
//             onChange={(e) => {
//               handleProductQuantityChange(
//                 product.value,
//                 e.target.value
//               );
//             }}
//             inputProps={{
//               min: 0,
//               step: 1,
//             }}
//             sx={{
//               width: "110px",
//               "& input": {
//                 textAlign: "center",
//               },
//             }}
//           />
//         </TableCell>

//         <TableCell align="right">
//           <TextField
//             size="small"
//             type="number"
//             value={rate}
//             onChange={(e) => {

//               const value =
//                 e.target.value;

//               setProductOptions((prevProducts) =>
//                 prevProducts.map((item) =>
//                   String(item.value) === productId
//                     ? {
//                         ...item,
//                         rate:
//                           value === ""
//                             ? ""
//                             : Number(value),
//                       }
//                     : item
//                 )
//               );

//             }}
//             inputProps={{
//               min: 0,
//               step: "0.01",
//             }}
//             sx={{
//               width: "100px",
//               "& input": {
//                 textAlign: "right",
//               },
//             }}
//           />
//         </TableCell>

//       </TableRow>
//     );
//   })}
// </TableBody>
        
//       </Table>
//     </TableContainer>
//   </DialogContent>

//   {/* CLOSE */}
//   <DialogActions
//     sx={{
//       justifyContent: "flex-end",
//       px: 2,
//       py: 1.5,
//     }}
//   >
//     <Button
//       variant="contained"
//       onClick={() => setOpenReport(false)}
//       sx={{
//         textTransform: "none",
//         backgroundColor: "var(--primary-color)",
//       }}
//     >
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>


// {/* ==========================================================
//     SAVE COMPARISON POPUP
// ========================================================== */}

// <Dialog
//   open={openComparisonPopup}
//   onClose={() => {
//     if (!saving) {
//       setOpenComparisonPopup(false);
//     }
//   }}
//   fullWidth
//   maxWidth="md"
// >
//   <DialogTitle
//     sx={{
//       backgroundColor: "#ecfde6",
//       color: "#0B5E20",
//       fontWeight: 700,
//     }}
//   >
//     Stock Comparison
//   </DialogTitle>

//   <DialogContent dividers>
//     <Typography
//       sx={{
//         mb: 2,
//         fontWeight: 600,
//         fontSize: "15px",
//       }}
//     >
//       Please verify the stock before saving.
//     </Typography>

//     <TableContainer
//       component={Paper}
//       sx={{
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//       }}
//     >
//       <Table size="small">
//         <TableHead>
//           <TableRow
//             sx={{
//               backgroundColor: "#e9ecef",
//             }}
//           >
//             <TableCell sx={{ fontWeight: 700 }}>
//               Product Code
//             </TableCell>

//             <TableCell sx={{ fontWeight: 700 }}>
//               Product Name
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Main Office
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Sold
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Expected
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Physical
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Difference
//             </TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {comparisonRows.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={7}
//                 align="center"
//               >
//                 No comparison data
//               </TableCell>
//             </TableRow>
//           ) : (
//             comparisonRows.map((row) => (
//               <TableRow
//                 key={String(row.ProductId)}
//               >
//                 <TableCell>
//                   {row.ProductCode || "-"}
//                 </TableCell>

//                 <TableCell>
//                   {row.ProductName || "-"}
//                 </TableCell>

//                 <TableCell align="center">
//                   {row.MainOffice}
//                 </TableCell>

//                 <TableCell align="center">
//                   {row.Sold}
//                 </TableCell>

//                 <TableCell
//                   align="center"
//                   sx={{
//                     fontWeight: 700,
//                   }}
//                 >
//                   {row.Expected}
//                 </TableCell>

//                 <TableCell
//                   align="center"
//                   sx={{
//                     fontWeight: 700,
//                   }}
//                 >
//                   {row.Physical}
//                 </TableCell>

//                 <TableCell
//                   align="center"
//                   sx={{
//                     fontWeight: 700,
//                     color:
//                       Number(row.Difference) === 0
//                         ? "green"
//                         : "red",
//                   }}
//                 >
//                   {row.Difference}
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   </DialogContent>

//   <DialogActions
//     sx={{
//       px: 2,
//       py: 1.5,
//       gap: 1,
//     }}
//   >
//     <Button
//       variant="outlined"
//       disabled={saving}
//       onClick={() => {
//         setOpenComparisonPopup(false);
//       }}
//       sx={{
//         textTransform: "none",
//         color: "var(--complementary-color)",
//         borderColor: "var(--complementary-color)",
//       }}
//     >
//       Cancel
//     </Button>

//     <Button
//       variant="contained"
//       disabled={saving}
//       onClick={async () => {
//         setOpenComparisonPopup(false);

//         // ACTUAL SAVE
//         await handleSave(true);
//       }}
//       sx={{
//         textTransform: "none",
//         background: "var(--primary-color)",
//         "&:hover": {
//           background: "var(--primary-color)",
//         },
//       }}
//     >
//       {saving ? "Saving..." : "Confirm Save"}
//     </Button>
//   </DialogActions>
// </Dialog>

//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default EntryShop;
























// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { createFilterOptions } from "@mui/material/Autocomplete";
// import Autocomplete from "@mui/material/Autocomplete";

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

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   const d = new Date(value);

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const EntryShop = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);


// // ==========================================================
// // SAVE COMPARISON POPUP
// // ==========================================================
// const [openComparisonPopup, setOpenComparisonPopup] = useState(false);
// const [comparisonRows, setComparisonRows] = useState([]);

// // ==========================================================
// // STOCK COMPARISON REPORT
// // ==========================================================
// const [comparisonReportOpen, setComparisonReportOpen] = useState(false);
// const [comparisonReportRows, setComparisonReportRows] = useState([]);
// const [comparisonReportDate, setComparisonReportDate] = useState("");




//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [editingEntry, setEditingEntry] = useState(null);

//   const STOCK_ENTRY_SHOP_ID = 1;

//   const CREATED_BY = 1;

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());


//   const [soldQuantities, setSoldQuantities] = useState({});



  
// const [quantity, setQuantity] = useState("");
// const [rate, setRate] = useState("");
// const [rows, setRows] = useState([]);

//   // ==========================================================
// // FETCH SOLD QUANTITY FOR SELECTED DATE
// // ==========================================================

// // ==========================================================
// // FETCH ACTUAL SOLD QUANTITY FROM SALES / INVOICE
// // ==========================================================
// const fetchSoldQuantities = async (
//   selectedDate = date
// ) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH ACTUAL SOLD QUANTITIES");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     // --------------------------------------------------------
//     // FORMAT SELECTED DATE
//     // --------------------------------------------------------
//     const getDateOnly = (value) => {
//       if (!value) {
//         return "";
//       }

//       // Date object
//       if (value instanceof Date) {
//         if (Number.isNaN(value.getTime())) {
//           return "";
//         }

//         return `${value.getFullYear()}-${String(
//           value.getMonth() + 1
//         ).padStart(2, "0")}-${String(
//           value.getDate()
//         ).padStart(2, "0")}`;
//       }

//       // API date object:
//       // { date: "2026-09-23 00:00:00.000000" }
//       if (
//         typeof value === "object" &&
//         value?.date
//       ) {
//         return String(value.date).slice(0, 10);
//       }

//       return String(value).slice(0, 10);
//     };

//     const selectedDateString =
//       getDateOnly(selectedDate);

//     console.log(
//       "SALES DATE:",
//       selectedDateString
//     );

//     // --------------------------------------------------------
//     // FETCH INVOICE HEADERS
//     // --------------------------------------------------------
//     const headerResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=InvoiceHeader"
//     );

//     if (!headerResponse.ok) {
//       throw new Error(
//         `Invoice Header API failed: ${headerResponse.status}`
//       );
//     }

//     const headerResult =
//       await headerResponse.json();

//     const invoiceHeaders =
//       Array.isArray(headerResult)
//         ? headerResult
//         : Array.isArray(headerResult?.data)
//         ? headerResult.data
//         : [];

//     console.log(
//       "TOTAL INVOICE HEADERS:",
//       invoiceHeaders.length
//     );

//     // --------------------------------------------------------
//     // FILTER INVOICES FOR SELECTED DATE
//     // --------------------------------------------------------
//     const selectedDateInvoices =
//       invoiceHeaders.filter((invoice) => {
//         const invoiceDate =
//           invoice?.InvoiceDate ??
//           invoice?.invoiceDate ??
//           invoice?.Date ??
//           invoice?.date ??
//           "";

//         const invoiceDateString =
//           getDateOnly(invoiceDate);

//         return (
//           invoiceDateString ===
//           selectedDateString
//         );
//       });

//     console.log(
//       "SELECTED DATE INVOICES:",
//       selectedDateInvoices
//     );

//     console.log(
//       "TOTAL SELECTED DATE INVOICES:",
//       selectedDateInvoices.length
//     );

//     // --------------------------------------------------------
//     // PRODUCT-WISE SOLD QUANTITY
//     // --------------------------------------------------------
//     const soldMap = {};

//     // --------------------------------------------------------
//     // FETCH DETAILS FOR EACH INVOICE
//     // --------------------------------------------------------
//     for (
//       const invoice of selectedDateInvoices
//     ) {
//       const invoiceId =
//         invoice?.Id ??
//         invoice?.id ??
//         invoice?.InvoiceId ??
//         "";

//       if (!invoiceId) {
//         continue;
//       }

//       try {
//         const detailResponse =
//           await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//           );

//         if (!detailResponse.ok) {
//           console.warn(
//             "Invoice Detail API failed:",
//             invoiceId
//           );

//           continue;
//         }

//         const detailResult =
//           await detailResponse.json();

//         const details =
//           Array.isArray(detailResult)
//             ? detailResult
//             : Array.isArray(
//                 detailResult?.data
//               )
//             ? detailResult.data
//             : detailResult?.data
//             ? [detailResult.data]
//             : detailResult
//             ? [detailResult]
//             : [];

//         console.log(
//           `INVOICE DETAILS - ${invoiceId}:`,
//           details
//         );

//         // ----------------------------------------------------
//         // ADD PRODUCT SOLD QUANTITY
//         // ----------------------------------------------------
//         details.forEach((detail) => {
//           const productId = Number(
//             detail?.ProductId ??
//               detail?.productId ??
//               0
//           );

//           const quantity = Number(
//             detail?.Quantity ??
//               detail?.quantity ??
//               0
//           );

//           if (
//             !productId ||
//             !Number.isFinite(quantity)
//           ) {
//             return;
//           }

//           const key = String(productId);

//           soldMap[key] =
//             (soldMap[key] || 0) +
//             quantity;
//         });

//       } catch (detailError) {
//         console.error(
//           "INVOICE DETAIL ERROR:",
//           invoiceId,
//           detailError
//         );
//       }
//     }

//     // --------------------------------------------------------
//     // FINAL SOLD MAP
//     // --------------------------------------------------------
//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL ACTUAL SOLD QUANTITY MAP:",
//       soldMap
//     );

//     console.log(
//       "======================================"
//     );

//     setSoldQuantities(soldMap);

//     return soldMap;

//   } catch (error) {
//     console.error(
//       "FETCH ACTUAL SOLD QUANTITIES ERROR:",
//       error
//     );

//     setSoldQuantities({});

//     return {};
//   }
// };


// const [mainOfficeQuantities, setMainOfficeQuantities] = useState({});
// const [physicalQuantities, setPhysicalQuantities] = useState({});




// const fetchMainOfficeStock = async (selectedDate = date) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH MAIN OFFICE STOCK");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Main Office Header API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     const headers = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : [];

//     // ----------------------------------------------------------
//     // SELECTED DATE
//     // ----------------------------------------------------------

//     const selectedDateString =
//       selectedDate instanceof Date
//         ? `${selectedDate.getFullYear()}-${String(
//             selectedDate.getMonth() + 1
//           ).padStart(2, "0")}-${String(
//             selectedDate.getDate()
//           ).padStart(2, "0")}`
//         : String(selectedDate).slice(0, 10);

//     console.log(
//       "MAIN OFFICE SELECTED DATE:",
//       selectedDateString
//     );

//     // ----------------------------------------------------------
//     // GET ALL MAIN OFFICE HEADERS FOR SELECTED DATE
//     // LocationType = O
//     // ----------------------------------------------------------

//     const mainOfficeHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//           item?.locationType ??
//           ""
//       )
//         .trim()
//         .toUpperCase();

//       const entryDate = String(
//         item?.EntryDate ??
//           item?.entryDate ??
//           item?.Date ??
//           item?.date ??
//           ""
//       ).slice(0, 10);

//       return (
//         locationType === "O" &&
//         entryDate === selectedDateString
//       );
//     });

//     console.log(
//       "MAIN OFFICE HEADERS FOR DATE:",
//       mainOfficeHeaders
//     );

//     console.log(
//       "TOTAL MAIN OFFICE HEADERS:",
//       mainOfficeHeaders.length
//     );

//     // ----------------------------------------------------------
//     // NO MAIN OFFICE ENTRY
//     // ----------------------------------------------------------

//     if (mainOfficeHeaders.length === 0) {
//       console.log(
//         "NO MAIN OFFICE HEADER FOR SELECTED DATE"
//       );

//       setMainOfficeQuantities({});
//       return {};
//     }

//     // ----------------------------------------------------------
//     // FETCH DETAILS FROM ALL MAIN OFFICE HEADERS
//     // ----------------------------------------------------------

//     const stockMap = {};

//     for (const header of mainOfficeHeaders) {
//       const headerId = Number(header?.Id);

//       if (!headerId) {
//         continue;
//       }

//       console.log(
//         "FETCHING MAIN OFFICE DETAILS - HEADER:",
//         headerId
//       );

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//       );

//       if (!detailResponse.ok) {
//         console.error(
//           "DETAIL API FAILED:",
//           headerId,
//           detailResponse.status
//         );

//         continue;
//       }

//       const detailResult =
//         await detailResponse.json();

//       const details = Array.isArray(detailResult)
//         ? detailResult
//         : Array.isArray(detailResult?.data)
//         ? detailResult.data
//         : [];

//       console.log(
//         `MAIN OFFICE DETAILS - HEADER ${headerId}:`,
//         details
//       );

//       // --------------------------------------------------------
//       // ADD PRODUCT QUANTITY
//       // --------------------------------------------------------

//       details.forEach((item) => {
//         const productId = Number(
//           item?.ProductId ??
//             item?.productId ??
//             0
//         );

//         const quantity = Number(
//           item?.Quantity ??
//             item?.quantity ??
//             0
//         );

//         if (!productId) {
//           return;
//         }

//         const key = String(productId);

//         stockMap[key] =
//           (stockMap[key] || 0) +
//           quantity;
//       });
//     }

//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL DATE-WISE MAIN OFFICE STOCK MAP:",
//       stockMap
//     );

//     console.log(
//       "======================================"
//     );

//     setMainOfficeQuantities(stockMap);

//     return stockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE STOCK ERROR:",
//       error
//     );

//     setMainOfficeQuantities({});

//     return {};
//   }
// };




// const handlePhysicalQuantityChange = (
//   productId,
//   value
// ) => {
//   setPhysicalQuantities((prev) => ({
//     ...prev,
//     [String(productId)]: value,
//   }));
// };



//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productQuantities, setProductQuantities] = useState({});
//   const [productRates, setProductRates] = useState({});

//   // ==========================================================
// // PRODUCT SEARCH
// // ==========================================================
// const [productSearch, setProductSearch] = useState("");

// // ==========================================================
// // QUANTITY INPUT REFS
// // Used for Enter -> next row focus
// // ==========================================================
// const quantityInputRefs = useRef({});





// // ==========================================================
// // FILTER PRODUCTS BY SEARCH
// // Search by Product Code OR Product Name
// // ==========================================================
// const filteredProductOptions = useMemo(() => {
//   const search = String(productSearch || "")
//     .trim()
//     .toLowerCase();

//   if (!search) {
//     return productOptions;
//   }

//   return productOptions.filter((product) => {
//     const productCode = String(
//       product?.productCode ?? ""
//     ).toLowerCase();

//     const productName = String(
//       product?.label ?? ""
//     ).toLowerCase();

//     return (
//       productCode.includes(search) ||
//       productName.includes(search)
//     );
//   });
// }, [productOptions, productSearch]);






// // ==========================================================
// // QUANTITY ENTER -> MOVE TO NEXT ROW
// // ==========================================================
// const handleQuantityKeyDown = (event, currentProductId) => {
//   if (event.key !== "Enter") {
//     return;
//   }

//   event.preventDefault();

//   const currentIndex = filteredProductOptions.findIndex(
//     (product) =>
//       String(product.value) === String(currentProductId)
//   );

//   if (currentIndex === -1) {
//     return;
//   }

//   const nextProduct =
//     filteredProductOptions[currentIndex + 1];

//   // No next row
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



//   const [openReport, setOpenReport] = useState(false);


// // ==========================================================
// // PRODUCT SELECTION
// // ==========================================================

// const [selectedProduct, setSelectedProduct] = useState(null);
// const [productQuantity, setProductQuantity] = useState("");
// const [productRate, setProductRate] = useState("");


// // ==========================================================
// // PRODUCT CHANGE
// // ==========================================================

// const handleProductChange = (event, newValue) => {
//   setSelectedProduct(newValue);

//   // No product selected
//   if (!newValue) {
//     setProductQuantity("");
//     setProductRate("");
//     return;
//   }

//   const productId = String(newValue.value);

//   const savedValue =
//     productQuantities?.[productId];

//   let savedQuantity = "";
//   let savedRate = Number(newValue.rate || 0);

//   // Existing saved product
//   if (
//     savedValue &&
//     typeof savedValue === "object"
//   ) {
//     savedQuantity =
//       savedValue?.quantity ?? "";

//     if (
//       savedValue?.rate !== undefined &&
//       savedValue?.rate !== ""
//     ) {
//       savedRate =
//         Number(savedValue.rate);
//     }
//   } else if (
//     savedValue !== undefined &&
//     savedValue !== null &&
//     savedValue !== ""
//   ) {
//     savedQuantity = savedValue;
//   }

//   setProductQuantity(
//     savedQuantity === ""
//       ? ""
//       : String(savedQuantity)
//   );

//   setProductRate(
//     savedRate === 0
//       ? ""
//       : String(savedRate)
//   );
// };


// // ==========================================================
// // QUANTITY CHANGE
// // ==========================================================

// const handleQuantityChange = (event) => {
//   const value = event.target.value;

//   setProductQuantity(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         value === ""
//           ? ""
//           : Number(value),

//       rate:
//         previous[productId]?.rate ??
//         Number(selectedProduct.rate || 0),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };


// // ==========================================================
// // RATE CHANGE
// // ==========================================================

// const handleRateChange = (event) => {
//   const value = event.target.value;

//   setProductRate(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         previous[productId]?.quantity ??
//         Number(productQuantity || 0),

//       rate:
//         value === ""
//           ? ""
//           : Number(value),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };
//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT MASTER - REGULAR RATE
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       console.log("PRODUCT MASTER API RESPONSE:", data);

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: Number(item?.Id ?? item?.ProductId ?? 0),

//           label: String(item?.ProductName ?? item?.Name ?? "").trim(),

//           productCode:
//             item?.ProductCode ??
//             item?.Code ??
//             item?.ProductCodeNo ??
//             item?.Id ??
//             "",

//           // ==================================================
//           // REGULAR RATE
//           // If Rate exists and > 0, use Rate.
//           // Otherwise use PurchasePrice.
//           // ==================================================
//           rate: Number(
//             Number(item?.Rate) > 0 ? item?.Rate : (item?.PurchasePrice ?? 0),
//           ),
//         }));

//       console.log("PRODUCT OPTIONS WITH RATE:", options);

//       setProductOptions(options);
//     } catch (error) {
//       console.error("Product API Error:", error);

//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADER RECORDS
//   // ==========================================================
//   const fetchDailyStockHeaders = async () => {
//     try {
//       console.log("====================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("====================================");

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
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : [];
//       } catch (error) {
//         console.error("DAILY STOCK HEADER JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER API RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE API RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//       console.log("ALL DAILY STOCK HEADER RECORDS:", data);

//       // ======================================================
//       // MAP DATA
//       // ======================================================

//      const mappedData = data
//   // ==========================================================
//   // DAILY STOCK SHOP ENTRIES ONLY
//   // Main Office = O
//   // Shop       = S
//   // ==========================================================
//   .filter((item) => {
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     return locationType === "S";
//   })

//   .map((item) => {
//     // ========================================================
//     // HEADER ID
//     // ========================================================
//     const id =
//       item?.Id ??
//       item?.id ??
//       item?.DailyStockHeaderId ??
//       item?.HeaderId ??
//       "";

//     // ========================================================
//     // DATE
//     // ========================================================
//     const entryDate =
//       item?.EntryDate ??
//       item?.entryDate ??
//       item?.Date ??
//       item?.date ??
//       "";

//     // ========================================================
//     // SHOP NAME
//     //
//     // API response मध्ये ShopName नसल्यास
//     // Daily Stock Shop साठी fixed name वापरू
//     // ========================================================
//     const shopName =
//       item?.ShopName ??
//       item?.AccountName ??
//       item?.Shop ??
//       item?.shop ??
//       item?.Name ??
//       "Stock Entry Shop";

//     // ========================================================
//     // TOTAL AMOUNT
//     // ========================================================
//     const totalAmount = Number(
//       item?.TotalAmount ??
//         item?.totalAmount ??
//         item?.Total ??
//         item?.total ??
//         0
//     );

//     // ========================================================
//     // LOCATION TYPE
//     // ========================================================
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         "S"
//     )
//       .trim()
//       .toUpperCase();

//     // ========================================================
//     // SHOP ID
//     // ========================================================
//     const shopId =
//       item?.ShopId ??
//       item?.shopId ??
//       item?.LocationId ??
//       item?.locationId ??
//       "";

//     // ========================================================
//     // FINAL MAPPED OBJECT
//     // ========================================================
//     return {
//       ...item,

//       // Header ID
//       Id: id,
//       id: id,
//       HeaderId: id,

//       // Date
//       EntryDate: entryDate,
//       dateText: entryDate
//         ? formatDate(entryDate)
//         : "",

//       // Shop
//       ShopName: shopName,
//       shop: shopName,

//       // Shop / Location
//       ShopId: shopId,
//       shopId: shopId,
//       LocationId: shopId,

//       // Location Type
//       LocationType: locationType,

//       // Total
//       TotalAmount: totalAmount,
//       total: totalAmount,
//     };
//   });

// console.log(
//   "=========================================="
// );
// console.log(
//   "DAILY STOCK SHOP MAPPED DATA"
// );
// console.log(
//   "=========================================="
// );
// console.log(
//   "TOTAL SHOP RECORDS:",
//   mappedData.length
// );
// console.log(
//   "MAPPED DAILY STOCK SHOP RECORDS:",
//   mappedData
// );

// // ==========================================================
// // SET TABLE DATA
// // ==========================================================
// setStockEntries(mappedData);

// // Reset pagination
// setPageNo(1);

// return mappedData;

//       console.log("MAPPED DAILY STOCK HEADER RECORDS:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Page reset
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("FETCH ALL DAILY STOCK HEADER ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header data could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       const id = Number(headerId);

//       console.log("DAILY STOCK HEADER ID:", id);

//       if (!id) {
//         throw new Error("Daily Stock Header ID not found");
//       }

//       const url = `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${id}`;

//       console.log("DAILY STOCK DETAIL GET URL:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       console.log("DETAIL GET STATUS:", response.status);
//       console.log("DETAIL GET STATUS TEXT:", response.statusText);

//       const text = await response.text();

//       console.log("DETAIL GET RAW RESPONSE:", text);

//       let result;

//       try {
//         result = JSON.parse(text);
//       } catch (error) {
//         console.error("DETAIL GET JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Detail API response: ${text}`);
//       }

//       console.log("DAILY STOCK DETAIL API RESPONSE:", result);

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             `Daily Stock Detail API failed: ${response.status}`,
//         );
//       }

//       if (result?.success === false) {
//         throw new Error(
//           result?.message || "Daily Stock Detail data could not be loaded",
//         );
//       }

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//     const mappedData = data.map((item) => ({
//   Id: Number(
//     item?.Id ??
//     item?.id ??
//     0
//   ),

//   DailyStockHeaderId: Number(
//     item?.DailyStockHeaderId ??
//     item?.dailyStockHeaderId ??
//     headerId ??
//     0
//   ),

//   ProductId: Number(
//     item?.ProductId ??
//     item?.ProductID ??
//     item?.productId ??
//     item?.productID ??
//     item?.product_id ??
//     0
//   ),

//   Quantity: Number(
//     item?.Quantity ??
//     item?.quantity ??
//     item?.Qty ??
//     item?.qty ??
//     0
//   ),

//   Rate: Number(
//     item?.Rate ??
//     item?.rate ??
//     item?.Price ??
//     item?.price ??
//     0
//   ),

//   Amount: Number(
//     item?.Amount ??
//     item?.amount ??
//     0
//   ),
// }));

//       console.log("DAILY STOCK DETAIL FINAL DATA:", mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error(
//         error?.message || "Daily Stock Detail data could not be loaded",
//       );

//       return [];
//     }
//   };

//   const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
//     try {
//       // ============================================================
//       // 1. VALIDATE HEADER ID
//       // ============================================================

//       const id = Number(headerId);

//       console.log("========== DAILY STOCK HEADER UPDATE ==========");
//       console.log("HEADER ID:", id);
//       console.log("ENTRY DATE:", entryDate);
//       console.log("TOTAL AMOUNT:", totalAmount);

//       if (!Number.isInteger(id) || id <= 0) {
//         throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
//       }

//       // ============================================================
//       // 2. FORMAT DATE
//       // API ला YYYY-MM-DD format मध्ये date पाठवा
//       // ============================================================

//       let formattedEntryDate = "";

//       if (entryDate) {
//         if (typeof entryDate === "string") {
//           // Already YYYY-MM-DD
//           if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//             formattedEntryDate = entryDate;
//           }

//           // DD-MM-YYYY
//           else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//             const [day, month, year] = entryDate.split("-");

//             formattedEntryDate = `${year}-${month}-${day}`;
//           }

//           // Try Date parsing
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

//       if (!formattedEntryDate) {
//         throw new Error(`Invalid EntryDate: ${entryDate}`);
//       }

//       console.log("FORMATTED ENTRY DATE:", formattedEntryDate);

//       // ============================================================
//       // 3. TOTAL AMOUNT
//       // ============================================================

//       const amount = Number(totalAmount || 0);

//       if (isNaN(amount)) {
//         throw new Error(`Invalid TotalAmount: ${totalAmount}`);
//       }

//       // ============================================================
//       // 4. SHOP ID
//       // ============================================================

//       const shopId = Number(STOCK_ENTRY_SHOP_ID);

//       if (!Number.isInteger(shopId) || shopId <= 0) {
//         throw new Error(`Invalid ShopId: ${STOCK_ENTRY_SHOP_ID}`);
//       }

//       // ============================================================
//       // 5. UPDATED BY
//       // ============================================================

//       const updatedBy = Number(CREATED_BY);

//       if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//         throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
//       }

//       // ============================================================
//       // 6. CREATE FORM DATA
//       // ============================================================

//       const updateData = new URLSearchParams();

//       updateData.append("Id", String(id));
//       updateData.append("EntryDate", formattedEntryDate);
//       updateData.append("ShopId", String(shopId));

//       // Existing record मध्ये OfficeId NULL आहे,
//       // म्हणून blank ठेवत आहोत.

//       updateData.append("TotalAmount", String(amount));

//       updateData.append("UpdatedBy", String(updatedBy));

//       // ============================================================
//       // 7. LOG EXACT REQUEST
//       // ============================================================

//       console.log(
//         "DAILY STOCK HEADER UPDATE PAYLOAD:",
//         Object.fromEntries(updateData.entries()),
//       );

//       // ============================================================
//       // 8. API CALL
//       // ============================================================

//       const apiUrl =
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//       console.log("DAILY STOCK HEADER UPDATE URL:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData,

//         redirect: "follow",
//       });

//       // ============================================================
//       // 9. READ RAW RESPONSE
//       // IMPORTANT FOR 500 ERROR
//       // ============================================================

//       console.log("HEADER UPDATE STATUS:", response.status);

//       console.log("HEADER UPDATE STATUS TEXT:", response.statusText);

//       const rawResponse = await response.text();

//       console.log("HEADER UPDATE RAW RESPONSE:", rawResponse);

//       // ============================================================
//       // 10. HTTP ERROR
//       // ============================================================

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header Update API failed: ${response.status}${
//             rawResponse ? ` - ${rawResponse}` : ""
//           }`,
//         );
//       }

//       // ============================================================
//       // 11. PARSE JSON
//       // ============================================================

//       let result;

//       try {
//         result = rawResponse ? JSON.parse(rawResponse) : {};
//       } catch (jsonError) {
//         console.error("HEADER UPDATE JSON PARSE ERROR:", jsonError);

//         throw new Error(`Invalid Header Update API response: ${rawResponse}`);
//       }

//       console.log("DAILY STOCK HEADER UPDATE RESPONSE:", result);

//       // ============================================================
//       // 12. CHECK API SUCCESS
//       // ============================================================

//       if (result?.success === false) {
//         throw new Error(result?.message || "Daily Stock Header update failed");
//       }

//       console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

//       return result;
//     } catch (error) {
//       console.error("❌ Daily Stock Header Update API Error:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

// useEffect(() => {
//   const loadStockData = async () => {
//     try {
//       await fetchProduct();
//       await fetchDailyStockHeaders();
//       await fetchMainOfficeStock(date);
//     } catch (error) {
//       console.error(
//         "ERROR LOADING DAILY STOCK DATA:",
//         error
//       );
//     }
//   };

//   if (date) {
//     loadStockData();
//   }
// }, [date]);



// useEffect(() => {
//   if (!productOptions || productOptions.length === 0) {
//     return;
//   }

//   setProductRates((prev) => {
//     const updated = { ...prev };

//     productOptions.forEach((product) => {
//       const productId = String(product.value);

//       // Existing manually changed rate असेल तर तोच ठेवा
//       if (updated[productId] === undefined) {
//         updated[productId] = Number(product.rate || 0);
//       }
//     });

//     return updated;
//   });
// }, [productOptions]);


//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//  const resetForm = () => {
//   setDate(new Date());

//   setProductQuantities({});

//   setSelectedProduct(null);

//   setProductQuantity("");

//   setProductRate("");

//   setEditingEntry(null);

//   setPhysicalQuantities({});

//   setProductSearch("");
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
//   // PRODUCT QUANTITY CHANGE
//   // ==========================================================

//  const handleProductQuantityChange = (productId, value) => {
//   const key = String(productId);

//   // ==========================================================
//   // PHYSICAL QUANTITY
//   // ==========================================================
//   setPhysicalQuantities((previous) => ({
//     ...previous,
//     [key]: value,
//   }));

//   // ==========================================================
//   // PRODUCT QUANTITY
//   // Keep rate + detailId while changing quantity
//   // ==========================================================
//   setProductQuantities((previous) => {
//     const existing = previous[key];

//     return {
//       ...previous,
//       [key]: {
//         ...(existing && typeof existing === "object"
//           ? existing
//           : {}),
//         quantity: value,
//       },
//     };
//   });
// };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA
//   // ==========================================================
//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id || item?.id || "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ||
//         item?.AccountName ||
//         item?.Shop ||
//         item?.Name ||
//         item?.shop ||
//         "Stock Entry Shop",

//       total: Number(item?.TotalAmount ?? item?.total ?? 0),
//     }));
//   }, [stockEntries]);








//   // ==========================================================
//   // SAVE / UPDATE STOCK ENTRY SHOP
//   // ==========================================================

// const handleSave = async (skipComparisonPopup = false) => {
//   console.log("🔥🔥🔥 HANDLE SAVE CALLED 🔥🔥🔥");
//   console.log("skipComparisonPopup =", skipComparisonPopup);
//   console.log("physicalQuantities =", physicalQuantities);
//   console.log("productQuantities =", productQuantities);

//   // ==========================================================
//   // DATE VALIDATION
//   // ==========================================================
//   if (!date) {
//     toast.error("Please select Date");
//     return;
//   }

//   // ==========================================================
//   // CREATE DATE STRING
//   // ==========================================================
//   const entryDate = `${date.getFullYear()}-${String(
//     date.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     date.getDate()
//   ).padStart(2, "0")}`;

//   try {
//     setSaving(true);

//     // ==========================================================
//     // PREPARE SELECTED PRODUCTS
//     // ==========================================================

//    const selectedRows = productOptions.map((product) => {
//   const productId = String(product.value);

//   const savedValue = productQuantities?.[productId];

//   const physicalValue = physicalQuantities?.[productId];

//   const quantity =
//     physicalValue !== undefined &&
//     physicalValue !== ""
//       ? Number(physicalValue)
//       : savedValue &&
//         typeof savedValue === "object"
//       ? Number(savedValue?.quantity || 0)
//       : Number(savedValue || 0);

//   const detailId =
//     savedValue &&
//     typeof savedValue === "object"
//       ? savedValue?.detailId || ""
//       : "";

//   const rate =
//     savedValue &&
//     typeof savedValue === "object" &&
//     savedValue.rate !== undefined &&
//     savedValue.rate !== ""
//       ? Number(savedValue.rate)
//       : Number(
//           productRates?.[productId] ??
//           product.rate ??
//           0
//         );

//   return {
//     Id: detailId,

//     ProductId: Number(product.value),

//     ProductCode:
//       product.productCode || "",

//     ProductName:
//       product.label || "",

//     Quantity: quantity,

//     Rate: rate,

//     Amount: quantity * rate,
//   };
// });
      

//     console.log(
//       "=================================================="
//     );

//     console.log(
//       "FINAL SELECTED ROWS:",
//       selectedRows
//     );

//     console.log(
//       "=================================================="
//     );

//     // ==========================================================
//     // VALIDATE PRODUCTS
//     // ==========================================================
//     if (selectedRows.length === 0) {
//       toast.error(
//         "Please enter quantity for at least one product"
//       );

//       setSaving(false);
//       return;
//     }

//     // ==========================================================
//     // TOTAL AMOUNT
//     // ==========================================================
//     const totalAmount =
//       selectedRows.reduce(
//         (sum, row) =>
//           sum +
//           Number(row.Quantity || 0) *
//             Number(row.Rate || 0),
//         0
//       );

//     console.log(
//       "TOTAL AMOUNT:",
//       totalAmount
//     );

//     // ==========================================================
//     // ==========================================================
//     // SHOW STOCK COMPARISON POPUP
//     // ==========================================================
//     // IMPORTANT:
//     //
//     // Sold is NOT used here.
//     //
//     // Main Office = actual stock received at Main Office
//     // Physical    = quantity entered in Daily Stock
//     //
//     // Expected    = Main Office Stock
//     // Difference  = Expected - Physical
//     //
//     // ==========================================================

//    if (!skipComparisonPopup) {

//   console.log(
//     "🔄 REFRESHING STOCK DATA BEFORE COMPARISON..."
//   );

//   // ========================================================
//   // LATEST MAIN OFFICE STOCK
//   // ========================================================
//   let latestMainOfficeQuantities = {};

//   // ========================================================
//   // LATEST SOLD QUANTITIES
//   // ========================================================
//   let latestSoldQuantities = {};

//   // ========================================================
//   // REFRESH MAIN OFFICE STOCK
//   // ========================================================
//   try {

//     latestMainOfficeQuantities =
//       await fetchMainOfficeStock(date);

//     console.log(
//       "LATEST MAIN OFFICE QUANTITIES:",
//       latestMainOfficeQuantities
//     );

//   } catch (error) {

//     console.error(
//       "MAIN OFFICE STOCK REFRESH ERROR:",
//       error
//     );

//     latestMainOfficeQuantities = {};
//   }

//   // ========================================================
//   // REFRESH SOLD QUANTITIES
//   // ========================================================
//   try {

//     latestSoldQuantities =
//       await fetchSoldQuantities(date);

//     console.log(
//       "LATEST SOLD QUANTITIES:",
//       latestSoldQuantities
//     );

//   } catch (error) {

//     console.error(
//       "SOLD QUANTITY REFRESH ERROR:",
//       error
//     );

//     latestSoldQuantities = {};
//   }

//   // ========================================================
//   // CREATE COMPARISON DATA
//   // ========================================================
//  const comparisonData = selectedRows.map((row) => {
//   const productId = String(row.ProductId);

//   const mainOfficeQty = Number(
//     latestMainOfficeQuantities?.[productId] ?? 0
//   );

//   const soldQty = Number(
//     latestSoldQuantities?.[productId] ?? 0
//   );

//   const physicalQty = Number(
//     row.Quantity ?? 0
//   );

//   // Main Office - Sold
//   const expectedQty =
//     mainOfficeQty - soldQty;

//   // Expected - Physical
//   const difference =
//     expectedQty - physicalQty;

//   return {
//     ProductId: row.ProductId,
//     ProductCode: row.ProductCode || "-",
//     ProductName: row.ProductName || "-",

//     MainOffice: mainOfficeQty,

//     // Internally keep it, UI मध्ये दाखवायचे नाही
//     Sold: soldQty,

//     Expected: expectedQty,

//     Physical: physicalQty,

//     Difference: difference,

//     Rate: Number(row.Rate || 0),
//   };
// });
    

//   // ========================================================
//   // FINAL COMPARISON LOG
//   // ========================================================
//   console.log(
//     "======================================"
//   );

//   console.log(
//     "FINAL STOCK COMPARISON:",
//     comparisonData
//   );

//   console.log(
//     "======================================"
//   );

//   // ========================================================
//   // SET COMPARISON DATA
//   // ========================================================
//   setComparisonRows(
//     comparisonData
//   );

//   // ========================================================
//   // STOP SAVING LOADER
//   // ========================================================
//   setSaving(false);

//   // ========================================================
//   // OPEN COMPARISON POPUP
//   // ========================================================
//   setOpenComparisonPopup(true);

//   return;
// }

//     // ==========================================================
//     // ==========================================================
//     // ACTUAL API SAVE STARTS HERE
//     // ==========================================================
//     // ==========================================================

//     console.log(
//       "🚨🚨🚨 ACTUAL API SAVE BLOCK ENTERED 🚨🚨🚨"
//     );

//     console.log(
//       "skipComparisonPopup =",
//       skipComparisonPopup
//     );

//     // ==========================================================
//     // EDIT EXISTING ENTRY
//     // ==========================================================
//     if (editingEntry) {

//       const headerId =
//         editingEntry?.Id ||
//         editingEntry?.id;

//       if (!headerId) {
//         throw new Error(
//           "Stock Entry Shop Header ID not found"
//         );
//       }

//       console.log(
//         "UPDATING STOCK ENTRY SHOP:",
//         headerId
//       );

//       // ========================================================
//       // UPDATE HEADER
//       // ========================================================
//       await updateDailyStockHeader(
//         headerId,
//         entryDate,
//         totalAmount
//       );

//       console.log(
//         "STOCK ENTRY SHOP HEADER UPDATED:",
//         headerId
//       );

//       // ========================================================
//       // UPDATE / INSERT DETAILS
//       // ========================================================
//       for (const row of selectedRows) {

//         const detailId =
//           row?.Id ||
//           row?.id ||
//           "";

//         const quantity =
//           Number(row?.Quantity || 0);

//         const rate =
//           Number(row?.Rate || 0);

//         const amount =
//           quantity * rate;

//         // ======================================================
//         // UPDATE EXISTING DETAIL
//         // ======================================================
//         if (detailId) {

//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "Id",
//             String(Number(detailId))
//           );

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(
//               Number(row.ProductId)
//             )
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "UpdatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "UPDATE DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },

//                 body:
//                   detailData.toString(),
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL UPDATE RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Update API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail update failed"
//             );
//           }

//           console.log(
//             "DETAIL UPDATED SUCCESSFULLY:",
//             result
//           );
//         }

//         // ======================================================
//         // INSERT NEW DETAIL
//         // ======================================================
//         else {

//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(
//               Number(row.ProductId)
//             )
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "CreatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "INSERT DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },

//                 body:
//                   detailData.toString(),
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL INSERT RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Insert API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail insert failed"
//             );
//           }

//           console.log(
//             "DETAIL INSERTED SUCCESSFULLY:",
//             result
//           );
//         }
//       }

//       // ========================================================
//       // UPDATE LOCAL TABLE
//       // ========================================================
//       setStockEntries(
//         (previous) =>
//           previous.map((item) => {

//             const itemId =
//               item?.Id ||
//               item?.id;

//             if (
//               String(itemId) !==
//               String(headerId)
//             ) {
//               return item;
//             }

//             return {
//               ...item,

//               EntryDate:
//                 entryDate,

//               dateText:
//                 formatDate(entryDate),

//               TotalAmount:
//                 Number(
//                   totalAmount || 0
//                 ),

//               total:
//                 Number(
//                   totalAmount || 0
//                 ),
//             };
//           })
//       );

//       toast.success(
//         "Stock Entry Shop updated successfully!"
//       );
//     }

//     // ==========================================================
//     // NEW ENTRY
//     // ==========================================================
//     else {

//       // ========================================================
//       // HEADER DATA
//       // ========================================================
//       const headerData =
//         new URLSearchParams();

//       headerData.append(
//         "EntryDate",
//         String(entryDate)
//       );

//       headerData.append(
//         "ShopId",
//         String(STOCK_ENTRY_SHOP_ID)
//       );

//       headerData.append(
//         "OfficeId",
//         ""
//       );

//       headerData.append(
//         "TotalAmount",
//         String(
//           Number(totalAmount || 0)
//         )
//       );

//       headerData.append(
//         "CreatedBy",
//         String(CREATED_BY)
//       );

//       console.log(
//         "STOCK ENTRY SHOP HEADER DATA:",
//         Object.fromEntries(
//           headerData.entries()
//         )
//       );

//       // ========================================================
//       // HEADER API
//       // ========================================================
//       const headerResponse =
//         await fetch(
//           "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
//           {
//             method: "POST",

//             mode: "cors",

//             credentials: "omit",

//             headers: {
//               Accept:
//                 "application/json",

//               "Content-Type":
//                 "application/x-www-form-urlencoded;charset=UTF-8",
//             },

//             body:
//               headerData.toString(),
//           }
//         );

//       const headerText =
//         await headerResponse.text();

//       console.log(
//         "HEADER RESPONSE:",
//         headerText
//       );

//       let headerResult = {};

//       try {
//         headerResult =
//           headerText
//             ? JSON.parse(headerText)
//             : {};
//       } catch {
//         throw new Error(
//           `Invalid Header API response: ${headerText}`
//         );
//       }

//       if (
//         !headerResponse.ok ||
//         !headerResult?.success
//       ) {
//         throw new Error(
//           headerResult?.message ||
//             "Daily Stock Header save failed"
//         );
//       }

//       const headerId =
//         headerResult?.Id ??
//         headerResult?.id ??
//         headerResult?.insert_id ??
//         headerResult?.DailyStockHeaderId ??
//         headerResult?.data?.Id ??
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error(
//           "Header created but Header ID was not returned."
//         );
//       }

//       console.log(
//         "CREATED HEADER ID:",
//         headerId
//       );

//       // ========================================================
//       // SAVE DETAILS
//       // ========================================================
//       for (const row of selectedRows) {

//         const detailData =
//           new URLSearchParams();

//         detailData.append(
//           "DailyStockHeaderId",
//           String(Number(headerId))
//         );

//         detailData.append(
//           "ProductId",
//           String(
//             Number(row.ProductId)
//           )
//         );

//         detailData.append(
//           "Quantity",
//           String(
//             Number(row.Quantity || 0)
//           )
//         );

//         detailData.append(
//           "Rate",
//           String(
//             Number(row.Rate || 0)
//           )
//         );

//         detailData.append(
//           "Amount",
//           String(
//             Number(row.Amount || 0)
//           )
//         );

//         detailData.append(
//           "CreatedBy",
//           String(CREATED_BY)
//         );

//         console.log(
//           "DETAIL SAVE PAYLOAD:",
//           Object.fromEntries(
//             detailData.entries()
//           )
//         );

//         const detailResponse =
//           await fetch(
//             "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//             {
//               method: "POST",

//               headers: {
//                 Accept:
//                   "application/json",

//                 "Content-Type":
//                   "application/x-www-form-urlencoded",
//               },

//               body:
//                 detailData.toString(),
//             }
//           );

//         const detailText =
//           await detailResponse.text();

//         console.log(
//           "DETAIL RESPONSE:",
//           detailText
//         );

//         let detailResult = {};

//         try {
//           detailResult =
//             detailText
//               ? JSON.parse(detailText)
//               : {};
//         } catch {
//           throw new Error(
//             `Invalid Detail API response: ${detailText}`
//           );
//         }

//         if (
//           !detailResponse.ok ||
//           detailResult?.success === false
//         ) {
//           throw new Error(
//             detailResult?.message ||
//               "Daily Stock Detail save failed"
//           );
//         }

//         console.log(
//           "DETAIL SAVED SUCCESSFULLY:",
//           detailResult
//         );
//       }

//       // ========================================================
//       // ADD NEW RECORD TO TABLE
//       // ========================================================
//       const newEntry = {

//         Id:
//           Number(headerId),

//         id:
//           Number(headerId),

//         EntryDate:
//           entryDate,

//         dateText:
//           formatDate(entryDate),

//         ShopId:
//           STOCK_ENTRY_SHOP_ID,

//         OfficeId:
//           null,

//         LocationType:
//           "S",

//         ShopName:
//           "Stock Entry Shop",

//         shop:
//           "Stock Entry Shop",

//         TotalAmount:
//           Number(
//             totalAmount || 0
//           ),

//         total:
//           Number(
//             totalAmount || 0
//           ),
//       };

//       setStockEntries(
//         (previous) => [
//           newEntry,
//           ...previous,
//         ]
//       );

//       toast.success(
//         "Stock Entry Shop saved successfully!"
//       );
//     }

//     // ==========================================================
//     // CLOSE FORM AFTER ACTUAL SAVE
//     // ==========================================================
//     setOpenForm(false);

//     resetForm();

//     setPageNo(1);

//     // ==========================================================
//     // REFRESH TABLE
//     // ==========================================================
//     await fetchDailyStockHeaders();

//   } catch (error) {

//     console.error(
//       "STOCK ENTRY SHOP SAVE ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to save Stock Entry Shop"
//     );

//   } finally {

//     setSaving(false);
//   }
// };

//   // ==========================================================
//   // DELETE MAIN ENTRY
//   // ==========================================================

//   // ==========================================================
//   // EDIT STOCK ENTRY SHOP
//   // ==========================================================
//   // ==========================================================
// // EDIT STOCK ENTRY SHOP
// // ==========================================================


// const handleEditEntry = async (entry) => {
//   try {
//     console.log("====================================");
//     console.log("EDIT STOCK ENTRY SHOP");
//     console.log("ENTRY:", entry);
//     console.log("====================================");

//     // --------------------------------------------------
//     // HEADER ID
//     // --------------------------------------------------
//     const headerId =
//       entry?.Id ??
//       entry?.id ??
//       entry?.DailyStockHeaderId;

//     if (!headerId) {
//       toast.error(
//         "Stock Entry Shop Header ID not found"
//       );
//       return;
//     }

//     console.log(
//       "EDIT HEADER ID:",
//       headerId
//     );

//     // --------------------------------------------------
//     // SET EDITING ENTRY
//     // --------------------------------------------------
//     setEditingEntry({
//       ...entry,
//       Id: Number(headerId),
//       id: Number(headerId),
//     });

//     // --------------------------------------------------
//     // SET DATE
//     // --------------------------------------------------
//     const entryDate =
//       entry?.EntryDate ??
//       entry?.entryDate ??
//       entry?.date;

//     if (entryDate) {
//       const parsedDate = new Date(entryDate);

//       if (!isNaN(parsedDate.getTime())) {
//         setDate(parsedDate);
//       }
//     }

//     // --------------------------------------------------
//     // CLEAR OLD QUANTITIES
//     // --------------------------------------------------
//     setProductQuantities({});

//     // --------------------------------------------------
//     // OPEN FORM
//     // --------------------------------------------------
//     setOpenForm(true);

//     // --------------------------------------------------
//     // IMPORTANT:
//     // FETCH DETAILS USING HEADER ID
//     // --------------------------------------------------
//     const details =
//       await fetchDailyStockDetail(headerId);

//     console.log(
//       "EDIT DAILY STOCK DETAILS:",
//       details
//     );

//     if (!Array.isArray(details)) {
//       console.error(
//         "Invalid detail response:",
//         details
//       );

//       toast.error(
//         "Daily Stock details not found"
//       );

//       return;
//     }

//     // --------------------------------------------------
//     // CREATE PRODUCT QUANTITY MAP
//     // --------------------------------------------------
//     const quantityMap = {};

//     details.forEach((item) => {
//       const productId =
//         item?.ProductId ??
//         item?.productId;

//       if (
//         productId === null ||
//         productId === undefined ||
//         String(productId).trim() === ""
//       ) {
//         return;
//       }

//       const detailId =
//         item?.Id ??
//         item?.id ??
//         item?.DailyStockDetailId ??
//         "";

//       const quantity = Number(
//         item?.Quantity ??
//         item?.quantity ??
//         0
//       );

//       const rate = Number(
//         item?.Rate ??
//         item?.rate ??
//         0
//       );

//       quantityMap[String(productId)] = {
//         quantity: quantity,
//         rate: rate,
//         detailId: detailId,
//       };
//     });

//     console.log(
//       "EDIT PRODUCT QUANTITY MAP:",
//       quantityMap
//     );

//     // --------------------------------------------------
//     // SET EXISTING DATA
//     // --------------------------------------------------
//     setProductQuantities(quantityMap);


    

//     // ==========================================================
// // ALSO SET PHYSICAL QUANTITIES FOR EDIT MODE
// // ==========================================================
// const physicalMap = {};

// Object.keys(quantityMap).forEach((productId) => {
//   physicalMap[productId] =
//     quantityMap[productId]?.quantity ?? "";
// });

// setPhysicalQuantities(physicalMap);

//     // --------------------------------------------------
//     // ALSO UPDATE PRODUCT MASTER RATE
//     // --------------------------------------------------
//     setProductOptions((previousProducts) =>
//       previousProducts.map((product) => {
//         const saved =
//           quantityMap[
//             String(product.value)
//           ];

//         if (!saved) {
//           return product;
//         }

//         return {
//           ...product,
//           rate:
//             saved.rate !== undefined
//               ? saved.rate
//               : product.rate,
//         };
//       })
//     );

//   } catch (error) {
//     console.error(
//       "EDIT STOCK ENTRY SHOP ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to load Stock Entry Shop"
//     );
//   }
// };

//   // const handleDeleteEntry = (id) => {
//   //   setStockEntries((previousEntries) =>
//   //     previousEntries.filter((item) => item.id !== id),
//   //   );

//   //   toast.success("Entry removed successfully");
//   // };

//   const handleDeleteEntry = async (id) => {
//     if (!id) {
//       toast.error("Stock Entry ID not found");
//       return;
//     }

//     try {
//       setSaving(true);

//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//       console.log("DELETE STOCK ENTRY SHOP URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       console.log("DELETE API STATUS:", response.status);

//       console.log("DELETE API RESPONSE:", resultText);

//       if (!response.ok) {
//         throw new Error(`Delete API failed: ${response.status}`);
//       }

//       // Remove from UI after successful API delete
//       setStockEntries((previousEntries) =>
//         previousEntries.filter((item) => Number(item.id) !== Number(id)),
//       );

//       toast.success("Stock Entry Shop deleted successfully");
//     } catch (error) {
//       console.error("Delete Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to delete Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
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
//       // ====================================================
//       // SR NO
//       // ====================================================

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

//         header: "Shop",

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
//             <b>Stock Entry Shop </b>
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
//               CREATE DAILY STOCK ENTRY
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
//               Stock Entry Shop
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
//               {/* ==================================================
//       STOCK ENTRY SHOP
//   ================================================== */}
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Stock Entry Shop:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   fullWidth
//                   value="Stock Entry Shop"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "#fafafa",
//                       borderRadius: "5px",
//                     },

//                     "& .MuiInputBase-input": {
//                       fontSize: "14px",
//                       fontWeight: 500,
//                     },
//                   }}
//                 />
//               </Box>

//               {/* ==================================================
//       DATE
//   ================================================== */}
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

//             {/* =========================================================
//     PRODUCT SELECTION / QUANTITY / RATE / ADD
//     NOT REQUIRED FOR STOCK ENTRY SHOP
//     Products are shown directly in the table below.
// ========================================================= */}


//  {/* ==========================================================
//     PRODUCT SEARCH
// ========================================================== */}
// <Box sx={{ mb: 2 }}>
//   <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography>

//   <TextField
//     fullWidth
//     size="small"
//     value={productSearch}
//     onChange={(e) => {
//       setProductSearch(e.target.value);
//     }}
//     placeholder="Search Product / Code"
//     sx={{
//       "& .MuiOutlinedInput-root": {
//         borderRadius: "6px",
//         backgroundColor: "#fff",
//       },

//       "& .MuiInputBase-input": {
//         fontSize: "15px",
//       },
//     }}
//   />
// </Box>

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #d0d0d0",
//                 borderRadius: "6px",
//                 overflowX: "hidden",
//                 overflowY: "visible",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   width: "100%",
//                   tableLayout: "fixed",

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",
//                   },
//                 }}
//               >
//                 {/* =====================================================
//         TABLE HEADER
//     ===================================================== */}
//       <TableHead>
//   <TableRow
//     sx={{
//       backgroundColor: "#e9ecef",
//     }}
//   >
//     {/* PRODUCT CODE */}
//     <TableCell
//       sx={{
//         width: "18%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Code
//     </TableCell>

//     {/* PRODUCT NAME */}
//     <TableCell
//       sx={{
//         width: "42%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Name
//     </TableCell>

//     {/* QUANTITY */}
//     <TableCell
//       align="center"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Quantity
//     </TableCell>

//     {/* RATE */}
//     <TableCell
//       align="right"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Rate
//     </TableCell>
//   </TableRow>
// </TableHead>

//                 {/* =====================================================
//         TABLE BODY
//     ===================================================== */}

// <TableBody>
//   {loadingProducts ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         Loading Products...
//       </TableCell>
//     </TableRow>
//   ) : filteredProductOptions.length === 0 ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         No Products Found
//       </TableCell>
//     </TableRow>
//   ) : (
//     filteredProductOptions.map((product) => {
//       const savedValue =
//         productQuantities[
//           String(product.value)
//         ];

//       // ================================
//       // DEFAULT QUANTITY = 0
//       // ================================
//       const quantity =
//         savedValue &&
//         typeof savedValue === "object"
//           ? savedValue?.quantity ?? 0
//           : savedValue ?? 0;

//       // ================================
//       // CURRENT RATE
//       // ================================
//       const rate =
//         productRates[
//           String(product.value)
//         ] ?? Number(product.rate || 0);

//       return (
//         <TableRow
//           key={String(product.value)}
//           hover
//         >

//           {/* PRODUCT CODE */}
//           <TableCell>
//             {product.productCode || "-"}
//           </TableCell>

//           {/* PRODUCT NAME */}
//           <TableCell>
//             {product.label || "-"}
//           </TableCell>

//           {/* ============================
//               QUANTITY
//           ============================ */}
//           <TableCell align="center">
//             <TextField
//               type="number"
//               size="small"

//               value={quantity}

//               onChange={(e) => {
//                 handleProductQuantityChange(
//                   product.value,
//                   e.target.value
//                 );
//               }}

//               onKeyDown={(e) => {
//                 handleQuantityKeyDown(
//                   e,
//                   product.value
//                 );
//               }}

//               inputRef={(input) => {
//                 quantityInputRefs.current[
//                   String(product.value)
//                 ] = input;
//               }}

//               inputProps={{
//                 min: 0,
//                 step: 1,
//               }}

//               sx={{
//                 width: 110,

//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "6px",
//                   backgroundColor: "#fff",
//                 },

//                 "& .MuiInputBase-input": {
//                   textAlign: "center",
//                   fontSize: "15px",
//                 },
//               }}
//             />
//           </TableCell>

//           {/* ============================
//               EDITABLE RATE
//           ============================ */}
//           <TableCell align="center">
//             <TextField
//               type="number"
//               size="small"

//               value={rate}

//               onChange={(e) => {
//                 const value =
//                   e.target.value;

//                 setProductRates((prev) => ({
//                   ...prev,

//                   [String(product.value)]:
//                     value === ""
//                       ? 0
//                       : Number(value),
//                 }));
//               }}

//               inputProps={{
//                 min: 0,
//                 step: 0.01,
//               }}

//               sx={{
//                 width: 110,

//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "6px",
//                   backgroundColor: "#fff",
//                 },

//                 "& .MuiInputBase-input": {
//                   textAlign: "right",
//                   fontSize: "15px",
//                 },
//               }}
//             />
//           </TableCell>

//         </TableRow>
//       );
//     })
//   )}
// </TableBody>

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
//             ></Box>
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
//   variant="contained"
//   disabled={saving}
//   onClick={() => handleSave(false)}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",

//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving ? "Saving..." : "Save"}
// </Button>
              

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

//         {/* ==========================================================
//     STOCK COMPARISON REPORT
// ========================================================== */}

// <Dialog
//   open={openReport}
//   onClose={() => setOpenReport(false)}
//   fullWidth
//   maxWidth="xl"
//   PaperProps={{
//     sx: {
//       borderRadius: "8px",
//       maxHeight: "90vh",
//     },
//   }}
// >
//   {/* REPORT HEADER */}
//   <DialogTitle
//     sx={{
//       backgroundColor: "rgb(236, 253, 230)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       borderBottom: "1px solid #ddd",
//       fontWeight: 700,
//       color: "#0B5E20",
//     }}
//   >
//     <Typography
//       sx={{
//         fontWeight: 700,
//         fontSize: "20px",
//       }}
//     >
//       Daily Stock Comparison Report
//     </Typography>

//     <IconButton
//       onClick={() => setOpenReport(false)}
//     >
//       <CloseIcon />
//     </IconButton>
//   </DialogTitle>

//   {/* REPORT CONTENT */}
//   <DialogContent dividers>
//     <TableContainer
//       component={Paper}
//       elevation={0}
//       sx={{
//         border: "1px solid #d0d0d0",
//         borderRadius: "6px",
//         overflowX: "auto",
//       }}
//     >
//       <Table
//         size="small"
//         sx={{
//           minWidth: 1000,

//           "& .MuiTableCell-root": {
//             border: "1px solid #d0d0d0",
//           },
//         }}
//       >
//     <TableHead>
//   <TableRow>

//     <TableCell>
//       Product Code
//     </TableCell>

//     <TableCell>
//       Product Name
//     </TableCell>

//     <TableCell align="center">
//       Main Office
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Expected
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Physical
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Difference
//     </TableCell>

//   </TableRow>
// </TableHead>

//      <TableBody>
//   {productOptions.map((product) => {

//     const productId = String(product.value);

//     const savedValue =
//       productQuantities?.[productId];

//     const quantity =
//       typeof savedValue === "object"
//         ? savedValue?.quantity ?? ""
//         : savedValue ?? "";

//     const rate =
//       product.rate ??
//       product.SaleRate ??
//       product.Price ??
//       "";

//     return (
//       <TableRow
//         key={productId}
//         hover
//       >

//         <TableCell>
//           {product.productCode || "-"}
//         </TableCell>

//         <TableCell>
//           {product.label || "-"}
//         </TableCell>

//         <TableCell align="center">
//           <TextField
//             size="small"
//             type="number"
//             value={quantity}
//             placeholder="Enter Qty"
//             onChange={(e) => {
//               handleProductQuantityChange(
//                 product.value,
//                 e.target.value
//               );
//             }}
//             inputProps={{
//               min: 0,
//               step: 1,
//             }}
//             sx={{
//               width: "110px",
//               "& input": {
//                 textAlign: "center",
//               },
//             }}
//           />
//         </TableCell>

//         <TableCell align="right">
//           <TextField
//             size="small"
//             type="number"
//             value={rate}
//             onChange={(e) => {

//               const value =
//                 e.target.value;

//               setProductOptions((prevProducts) =>
//                 prevProducts.map((item) =>
//                   String(item.value) === productId
//                     ? {
//                         ...item,
//                         rate:
//                           value === ""
//                             ? ""
//                             : Number(value),
//                       }
//                     : item
//                 )
//               );

//             }}
//             inputProps={{
//               min: 0,
//               step: "0.01",
//             }}
//             sx={{
//               width: "100px",
//               "& input": {
//                 textAlign: "right",
//               },
//             }}
//           />
//         </TableCell>

//       </TableRow>
//     );
//   })}
// </TableBody>
        
//       </Table>
//     </TableContainer>
//   </DialogContent>

//   {/* CLOSE */}
//   <DialogActions
//     sx={{
//       justifyContent: "flex-end",
//       px: 2,
//       py: 1.5,
//     }}
//   >
//     <Button
//       variant="contained"
//       onClick={() => setOpenReport(false)}
//       sx={{
//         textTransform: "none",
//         backgroundColor: "var(--primary-color)",
//       }}
//     >
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>


// {/* ==========================================================
//     SAVE COMPARISON POPUP
// ========================================================== */}

// <Dialog
//   open={openComparisonPopup}
//   onClose={() => {
//     if (!saving) {
//       setOpenComparisonPopup(false);
//     }
//   }}
//   fullWidth
//   maxWidth="md"
// >
//   <DialogTitle
//     sx={{
//       backgroundColor: "#ecfde6",
//       color: "#0B5E20",
//       fontWeight: 700,
//     }}
//   >
//     Stock Comparison
//   </DialogTitle>

//   <DialogContent dividers>
//     <Typography
//       sx={{
//         mb: 2,
//         fontWeight: 600,
//         fontSize: "15px",
//       }}
//     >
//       Please verify the stock before saving.
//     </Typography>

//     <TableContainer
//       component={Paper}
//       sx={{
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//       }}
//     >
//       <Table size="small">
//         <TableHead>
//           <TableRow
//             sx={{
//               backgroundColor: "#e9ecef",
//             }}
//           >
//             <TableCell sx={{ fontWeight: 700 }}>
//               Product Code
//             </TableCell>

//             <TableCell sx={{ fontWeight: 700 }}>
//               Product Name
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Main Office
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Sold
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Expected
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Physical
//             </TableCell>

//             <TableCell
//               align="center"
//               sx={{ fontWeight: 700 }}
//             >
//               Difference
//             </TableCell>
//           </TableRow>
//         </TableHead>

//       <TableBody>
//   {comparisonRows.length === 0 ? (
//     <TableRow>
//       <TableCell
//         colSpan={6}
//         align="center"
//       >
//         No comparison data available
//       </TableCell>
//     </TableRow>
//   ) : (
//     comparisonRows.map((row) => (
//       <TableRow
//         key={String(row.ProductId)}
//       >

//         {/* PRODUCT CODE */}
//         <TableCell>
//           {row.ProductCode || "-"}
//         </TableCell>

//         {/* PRODUCT NAME */}
//         <TableCell>
//           {row.ProductName || "-"}
//         </TableCell>

//         {/* MAIN OFFICE */}
//         <TableCell align="center">
//           {Number(row.MainOffice || 0)}
//         </TableCell>

//         {/* EXPECTED */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//           }}
//         >
//           {Number(row.Expected || 0)}
//         </TableCell>

//         {/* PHYSICAL */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//             color:
//               Number(row.Difference || 0) === 0
//                 ? "green"
//                 : "red",
//           }}
//         >
//           {Number(row.Physical || 0)}
//         </TableCell>

//         {/* DIFFERENCE */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//             color:
//               Number(row.Difference || 0) === 0
//                 ? "green"
//                 : "red",
//           }}
//         >
//           {Number(row.Difference || 0)}
//         </TableCell>

//       </TableRow>
//     ))
//   )}
// </TableBody>

//       </Table>
//     </TableContainer>
//   </DialogContent>

//   <DialogActions
//     sx={{
//       px: 2,
//       py: 1.5,
//       gap: 1,
//     }}
//   >
//     <Button
//       variant="outlined"
//       disabled={saving}
//       onClick={() => {
//         setOpenComparisonPopup(false);
//       }}
//       sx={{
//         textTransform: "none",
//         color: "var(--complementary-color)",
//         borderColor: "var(--complementary-color)",
//       }}
//     >
//       Cancel
//     </Button>

//     <Button
//       variant="contained"
//       disabled={saving}
//       onClick={async () => {
//         setOpenComparisonPopup(false);

//         // ACTUAL SAVE
//         await handleSave(true);
//       }}
//       sx={{
//         textTransform: "none",
//         background: "var(--primary-color)",
//         "&:hover": {
//           background: "var(--primary-color)",
//         },
//       }}
//     >
//       {saving ? "Saving..." : "Confirm Save"}
//     </Button>
//   </DialogActions>
// </Dialog>

//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default EntryShop;





















// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { createFilterOptions } from "@mui/material/Autocomplete";
// import Autocomplete from "@mui/material/Autocomplete";

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

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   const d = new Date(value);

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const EntryShop = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);


// // ==========================================================
// // SAVE COMPARISON POPUP
// // ==========================================================
// const [openComparisonPopup, setOpenComparisonPopup] = useState(false);
// const [comparisonRows, setComparisonRows] = useState([]);

// // ==========================================================
// // STOCK COMPARISON REPORT
// // ==========================================================
// const [comparisonReportOpen, setComparisonReportOpen] = useState(false);
// const [comparisonReportRows, setComparisonReportRows] = useState([]);
// const [comparisonReportDate, setComparisonReportDate] = useState("");




//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [editingEntry, setEditingEntry] = useState(null);

//   const STOCK_ENTRY_SHOP_ID = 1;

//   const CREATED_BY = 1;

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());


//   const [soldQuantities, setSoldQuantities] = useState({});



  
// const [quantity, setQuantity] = useState("");
// const [rate, setRate] = useState("");
// const [rows, setRows] = useState([]);

//   // ==========================================================
// // FETCH SOLD QUANTITY FOR SELECTED DATE
// // ==========================================================

// // ==========================================================
// // FETCH ACTUAL SOLD QUANTITY FROM SALES / INVOICE
// // ==========================================================
// const fetchSoldQuantities = async (
//   selectedDate = date
// ) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH ACTUAL SOLD QUANTITIES");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     // --------------------------------------------------------
//     // FORMAT SELECTED DATE
//     // --------------------------------------------------------
//     const getDateOnly = (value) => {
//       if (!value) {
//         return "";
//       }

//       // Date object
//       if (value instanceof Date) {
//         if (Number.isNaN(value.getTime())) {
//           return "";
//         }

//         return `${value.getFullYear()}-${String(
//           value.getMonth() + 1
//         ).padStart(2, "0")}-${String(
//           value.getDate()
//         ).padStart(2, "0")}`;
//       }

//       // API date object:
//       // { date: "2026-09-23 00:00:00.000000" }
//       if (
//         typeof value === "object" &&
//         value?.date
//       ) {
//         return String(value.date).slice(0, 10);
//       }

//       return String(value).slice(0, 10);
//     };

//     const selectedDateString =
//       getDateOnly(selectedDate);

//     console.log(
//       "SALES DATE:",
//       selectedDateString
//     );

//     // --------------------------------------------------------
//     // FETCH INVOICE HEADERS
//     // --------------------------------------------------------
//     const headerResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=InvoiceHeader"
//     );

//     if (!headerResponse.ok) {
//       throw new Error(
//         `Invoice Header API failed: ${headerResponse.status}`
//       );
//     }

//     const headerResult =
//       await headerResponse.json();

//     const invoiceHeaders =
//       Array.isArray(headerResult)
//         ? headerResult
//         : Array.isArray(headerResult?.data)
//         ? headerResult.data
//         : [];

//     console.log(
//       "TOTAL INVOICE HEADERS:",
//       invoiceHeaders.length
//     );

//     // --------------------------------------------------------
//     // FILTER INVOICES FOR SELECTED DATE
//     // --------------------------------------------------------
//    const selectedDateInvoices = invoiceHeaders.filter((invoice) => {
//   const invoiceDate = invoice.InvoiceDate;

//   if (!invoiceDate) {
//     return false;
//   }

//   let invoiceDateString = "";

//   // Object date
//   if (
//     typeof invoiceDate === "object" &&
//     invoiceDate?.date
//   ) {
//     invoiceDateString = String(
//       invoiceDate.date
//     ).slice(0, 10);
//   }

//   // String date
//   else if (typeof invoiceDate === "string") {
//     const value = invoiceDate.trim();

//     // YYYY-MM-DD...
//     if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
//       invoiceDateString = value.slice(0, 10);
//     }

//     // DD-MM-YYYY
//     else if (
//       /^\d{2}-\d{2}-\d{4}/.test(value)
//     ) {
//       const parts = value.slice(0, 10).split("-");

//       invoiceDateString =
//         `${parts[2]}-${parts[1]}-${parts[0]}`;
//     }

//     // DD/MM/YYYY
//     else if (
//       /^\d{2}\/\d{2}\/\d{4}/.test(value)
//     ) {
//       const parts = value.slice(0, 10).split("/");

//       invoiceDateString =
//         `${parts[2]}-${parts[1]}-${parts[0]}`;
//     }

//     // Fallback
//     else {
//       invoiceDateString =
//         getDateOnly(value);
//     }
//   }

//   // Other date types
//   else {
//     invoiceDateString =
//       getDateOnly(invoiceDate);
//   }

//   console.log(
//     "INVOICE DATE CHECK:",
//     invoiceDate,
//     "=>",
//     invoiceDateString,
//     "TARGET:",
//     selectedDateString
//   );

//   return (
//     invoiceDateString === selectedDateString
//   );
// });
      

//     console.log(
//       "SELECTED DATE INVOICES:",
//       selectedDateInvoices
//     );

//     console.log(
//       "TOTAL SELECTED DATE INVOICES:",
//       selectedDateInvoices.length
//     );

//     // --------------------------------------------------------
//     // PRODUCT-WISE SOLD QUANTITY
//     // --------------------------------------------------------
//     const soldMap = {};

//     // --------------------------------------------------------
//     // FETCH DETAILS FOR EACH INVOICE
//     // --------------------------------------------------------


//     console.log(
//   "========== INVOICE DATE DEBUG =========="
// );

// invoiceHeaders.slice(0, 10).forEach((invoice) => {
//   console.log(
//     "InvoiceNo:",
//     invoice.InvoiceNo,
//     "InvoiceDate:",
//     invoice.InvoiceDate,
//     "Normalized:",
//     getDateOnly(invoice.InvoiceDate)
//   );
// });

// console.log(
//   "========================================"
// );

//     for (
//       const invoice of selectedDateInvoices
//     ) {
//       const invoiceId =
//         invoice?.Id ??
//         invoice?.id ??
//         invoice?.InvoiceId ??
//         "";

//       if (!invoiceId) {
//         continue;
//       }

//       try {
//         const detailResponse =
//           await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//           );

//         if (!detailResponse.ok) {
//           console.warn(
//             "Invoice Detail API failed:",
//             invoiceId
//           );

//           continue;
//         }

//         const detailResult =
//           await detailResponse.json();

//         const details =
//           Array.isArray(detailResult)
//             ? detailResult
//             : Array.isArray(
//                 detailResult?.data
//               )
//             ? detailResult.data
//             : detailResult?.data
//             ? [detailResult.data]
//             : detailResult
//             ? [detailResult]
//             : [];

//         console.log(
//           `INVOICE DETAILS - ${invoiceId}:`,
//           details
//         );

//         // ----------------------------------------------------
//         // ADD PRODUCT SOLD QUANTITY
//         // ----------------------------------------------------
//         details.forEach((detail) => {
//           const productId = Number(
//             detail?.ProductId ??
//               detail?.productId ??
//               0
//           );

//           const quantity = Number(
//             detail?.Quantity ??
//               detail?.quantity ??
//               0
//           );

//           if (
//             !productId ||
//             !Number.isFinite(quantity)
//           ) {
//             return;
//           }

//           const key = String(productId);

//           soldMap[key] =
//             (soldMap[key] || 0) +
//             quantity;
//         });

//       } catch (detailError) {
//         console.error(
//           "INVOICE DETAIL ERROR:",
//           invoiceId,
//           detailError
//         );
//       }
//     }

//     // --------------------------------------------------------
//     // FINAL SOLD MAP
//     // --------------------------------------------------------
//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL ACTUAL SOLD QUANTITY MAP:",
//       soldMap
//     );

//     console.log(
//       "======================================"
//     );

//     setSoldQuantities(soldMap);

//     return soldMap;

//   } catch (error) {
//     console.error(
//       "FETCH ACTUAL SOLD QUANTITIES ERROR:",
//       error
//     );

//     setSoldQuantities({});

//     return {};
//   }
// };


// const [mainOfficeQuantities, setMainOfficeQuantities] = useState({});
// const [physicalQuantities, setPhysicalQuantities] = useState({});




// const fetchMainOfficeStock = async (selectedDate = date) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH MAIN OFFICE STOCK");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Main Office Header API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     const headers = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : [];

//     // ----------------------------------------------------------
//     // SELECTED DATE
//     // ----------------------------------------------------------

//     const selectedDateString =
//       selectedDate instanceof Date
//         ? `${selectedDate.getFullYear()}-${String(
//             selectedDate.getMonth() + 1
//           ).padStart(2, "0")}-${String(
//             selectedDate.getDate()
//           ).padStart(2, "0")}`
//         : String(selectedDate).slice(0, 10);

//     console.log(
//       "MAIN OFFICE SELECTED DATE:",
//       selectedDateString
//     );

//     // ----------------------------------------------------------
//     // GET ALL MAIN OFFICE HEADERS FOR SELECTED DATE
//     // LocationType = O
//     // ----------------------------------------------------------

//     const mainOfficeHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//           item?.locationType ??
//           ""
//       )
//         .trim()
//         .toUpperCase();

//       const entryDate = String(
//         item?.EntryDate ??
//           item?.entryDate ??
//           item?.Date ??
//           item?.date ??
//           ""
//       ).slice(0, 10);

//       return (
//         locationType === "O" &&
//         entryDate === selectedDateString
//       );
//     });

//     console.log(
//       "MAIN OFFICE HEADERS FOR DATE:",
//       mainOfficeHeaders
//     );

//     console.log(
//       "TOTAL MAIN OFFICE HEADERS:",
//       mainOfficeHeaders.length
//     );

//     // ----------------------------------------------------------
//     // NO MAIN OFFICE ENTRY
//     // ----------------------------------------------------------

//     if (mainOfficeHeaders.length === 0) {
//       console.log(
//         "NO MAIN OFFICE HEADER FOR SELECTED DATE"
//       );

//       setMainOfficeQuantities({});
//       return {};
//     }

//     // ----------------------------------------------------------
//     // FETCH DETAILS FROM ALL MAIN OFFICE HEADERS
//     // ----------------------------------------------------------

//     const stockMap = {};

//     for (const header of mainOfficeHeaders) {
//       const headerId = Number(header?.Id);

//       if (!headerId) {
//         continue;
//       }

//       console.log(
//         "FETCHING MAIN OFFICE DETAILS - HEADER:",
//         headerId
//       );

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//       );

//       if (!detailResponse.ok) {
//         console.error(
//           "DETAIL API FAILED:",
//           headerId,
//           detailResponse.status
//         );

//         continue;
//       }

//       const detailResult =
//         await detailResponse.json();

//       const details = Array.isArray(detailResult)
//         ? detailResult
//         : Array.isArray(detailResult?.data)
//         ? detailResult.data
//         : [];

//       console.log(
//         `MAIN OFFICE DETAILS - HEADER ${headerId}:`,
//         details
//       );

//       // --------------------------------------------------------
//       // ADD PRODUCT QUANTITY
//       // --------------------------------------------------------

//       details.forEach((item) => {
//         const productId = Number(
//           item?.ProductId ??
//             item?.productId ??
//             0
//         );

//         const quantity = Number(
//           item?.Quantity ??
//             item?.quantity ??
//             0
//         );

//         if (!productId) {
//           return;
//         }

//         const key = String(productId);

//         stockMap[key] =
//           (stockMap[key] || 0) +
//           quantity;
//       });
//     }

//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL DATE-WISE MAIN OFFICE STOCK MAP:",
//       stockMap
//     );

//     console.log(
//       "======================================"
//     );

//     setMainOfficeQuantities(stockMap);

//     return stockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE STOCK ERROR:",
//       error
//     );

//     setMainOfficeQuantities({});

//     return {};
//   }
// };




// const handlePhysicalQuantityChange = (
//   productId,
//   value
// ) => {
//   setPhysicalQuantities((prev) => ({
//     ...prev,
//     [String(productId)]: value,
//   }));
// };



//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productQuantities, setProductQuantities] = useState({});
//   const [productRates, setProductRates] = useState({});

//   // ==========================================================
// // PRODUCT SEARCH
// // ==========================================================
// const [productSearch, setProductSearch] = useState("");

// // ==========================================================
// // QUANTITY INPUT REFS
// // Used for Enter -> next row focus
// // ==========================================================
// const quantityInputRefs = useRef({});





// // ==========================================================
// // FILTER PRODUCTS BY SEARCH
// // Search by Product Code OR Product Name
// // ==========================================================
// const filteredProductOptions = useMemo(() => {
//   const search = String(productSearch || "")
//     .trim()
//     .toLowerCase();

//   if (!search) {
//     return productOptions;
//   }

//   return productOptions.filter((product) => {
//     const productCode = String(
//       product?.productCode ?? ""
//     ).toLowerCase();

//     const productName = String(
//       product?.label ?? ""
//     ).toLowerCase();

//     return (
//       productCode.includes(search) ||
//       productName.includes(search)
//     );
//   });
// }, [productOptions, productSearch]);






// // ==========================================================
// // QUANTITY ENTER -> MOVE TO NEXT ROW
// // ==========================================================
// const handleQuantityKeyDown = (event, currentProductId) => {
//   if (event.key !== "Enter") {
//     return;
//   }

//   event.preventDefault();

//   const currentIndex = filteredProductOptions.findIndex(
//     (product) =>
//       String(product.value) === String(currentProductId)
//   );

//   if (currentIndex === -1) {
//     return;
//   }

//   const nextProduct =
//     filteredProductOptions[currentIndex + 1];

//   // No next row
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



//   const [openReport, setOpenReport] = useState(false);


// // ==========================================================
// // PRODUCT SELECTION
// // ==========================================================

// const [selectedProduct, setSelectedProduct] = useState(null);
// const [productQuantity, setProductQuantity] = useState("");
// const [productRate, setProductRate] = useState("");


// // ==========================================================
// // PRODUCT CHANGE
// // ==========================================================

// const handleProductChange = (event, newValue) => {
//   setSelectedProduct(newValue);

//   // No product selected
//   if (!newValue) {
//     setProductQuantity("");
//     setProductRate("");
//     return;
//   }

//   const productId = String(newValue.value);

//   const savedValue =
//     productQuantities?.[productId];

//   let savedQuantity = "";
//   let savedRate = Number(newValue.rate || 0);

//   // Existing saved product
//   if (
//     savedValue &&
//     typeof savedValue === "object"
//   ) {
//     savedQuantity =
//       savedValue?.quantity ?? "";

//     if (
//       savedValue?.rate !== undefined &&
//       savedValue?.rate !== ""
//     ) {
//       savedRate =
//         Number(savedValue.rate);
//     }
//   } else if (
//     savedValue !== undefined &&
//     savedValue !== null &&
//     savedValue !== ""
//   ) {
//     savedQuantity = savedValue;
//   }

//   setProductQuantity(
//     savedQuantity === ""
//       ? ""
//       : String(savedQuantity)
//   );

//   setProductRate(
//     savedRate === 0
//       ? ""
//       : String(savedRate)
//   );
// };


// // ==========================================================
// // QUANTITY CHANGE
// // ==========================================================

// const handleQuantityChange = (event) => {
//   const value = event.target.value;

//   setProductQuantity(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         value === ""
//           ? ""
//           : Number(value),

//       rate:
//         previous[productId]?.rate ??
//         Number(selectedProduct.rate || 0),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };


// // ==========================================================
// // RATE CHANGE
// // ==========================================================

// const handleRateChange = (event) => {
//   const value = event.target.value;

//   setProductRate(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         previous[productId]?.quantity ??
//         Number(productQuantity || 0),

//       rate:
//         value === ""
//           ? ""
//           : Number(value),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };
//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT MASTER - REGULAR RATE
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       console.log("PRODUCT MASTER API RESPONSE:", data);

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: Number(item?.Id ?? item?.ProductId ?? 0),

//           label: String(item?.ProductName ?? item?.Name ?? "").trim(),

//           productCode:
//             item?.ProductCode ??
//             item?.Code ??
//             item?.ProductCodeNo ??
//             item?.Id ??
//             "",

//           // ==================================================
//           // REGULAR RATE
//           // If Rate exists and > 0, use Rate.
//           // Otherwise use PurchasePrice.
//           // ==================================================
//           rate: Number(
//             Number(item?.Rate) > 0 ? item?.Rate : (item?.PurchasePrice ?? 0),
//           ),
//         }));

//       console.log("PRODUCT OPTIONS WITH RATE:", options);

//       setProductOptions(options);
//     } catch (error) {
//       console.error("Product API Error:", error);

//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADER RECORDS
//   // ==========================================================
//   const fetchDailyStockHeaders = async () => {
//     try {
//       console.log("====================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("====================================");

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
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : [];
//       } catch (error) {
//         console.error("DAILY STOCK HEADER JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER API RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE API RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//       console.log("ALL DAILY STOCK HEADER RECORDS:", data);

//       // ======================================================
//       // MAP DATA
//       // ======================================================

//      const mappedData = data
//   // ==========================================================
//   // DAILY STOCK SHOP ENTRIES ONLY
//   // Main Office = O
//   // Shop       = S
//   // ==========================================================
//   .filter((item) => {
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     return locationType === "S";
//   })

//   .map((item) => {
//     // ========================================================
//     // HEADER ID
//     // ========================================================
//     const id =
//       item?.Id ??
//       item?.id ??
//       item?.DailyStockHeaderId ??
//       item?.HeaderId ??
//       "";

//     // ========================================================
//     // DATE
//     // ========================================================
//     const entryDate =
//       item?.EntryDate ??
//       item?.entryDate ??
//       item?.Date ??
//       item?.date ??
//       "";

//     // ========================================================
//     // SHOP NAME
//     //
//     // API response मध्ये ShopName नसल्यास
//     // Daily Stock Shop साठी fixed name वापरू
//     // ========================================================
//     const shopName =
//       item?.ShopName ??
//       item?.AccountName ??
//       item?.Shop ??
//       item?.shop ??
//       item?.Name ??
//       "Stock Entry Shop";

//     // ========================================================
//     // TOTAL AMOUNT
//     // ========================================================
//     const totalAmount = Number(
//       item?.TotalAmount ??
//         item?.totalAmount ??
//         item?.Total ??
//         item?.total ??
//         0
//     );

//     // ========================================================
//     // LOCATION TYPE
//     // ========================================================
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         "S"
//     )
//       .trim()
//       .toUpperCase();

//     // ========================================================
//     // SHOP ID
//     // ========================================================
//     const shopId =
//       item?.ShopId ??
//       item?.shopId ??
//       item?.LocationId ??
//       item?.locationId ??
//       "";

//     // ========================================================
//     // FINAL MAPPED OBJECT
//     // ========================================================
//     return {
//       ...item,

//       // Header ID
//       Id: id,
//       id: id,
//       HeaderId: id,

//       // Date
//       EntryDate: entryDate,
//       dateText: entryDate
//         ? formatDate(entryDate)
//         : "",

//       // Shop
//       ShopName: shopName,
//       shop: shopName,

//       // Shop / Location
//       ShopId: shopId,
//       shopId: shopId,
//       LocationId: shopId,

//       // Location Type
//       LocationType: locationType,

//       // Total
//       TotalAmount: totalAmount,
//       total: totalAmount,
//     };
//   });

// console.log(
//   "=========================================="
// );
// console.log(
//   "DAILY STOCK SHOP MAPPED DATA"
// );
// console.log(
//   "=========================================="
// );
// console.log(
//   "TOTAL SHOP RECORDS:",
//   mappedData.length
// );
// console.log(
//   "MAPPED DAILY STOCK SHOP RECORDS:",
//   mappedData
// );

// // ==========================================================
// // SET TABLE DATA
// // ==========================================================
// setStockEntries(mappedData);

// // Reset pagination
// setPageNo(1);

// return mappedData;

//       console.log("MAPPED DAILY STOCK HEADER RECORDS:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Page reset
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("FETCH ALL DAILY STOCK HEADER ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header data could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       const id = Number(headerId);

//       console.log("DAILY STOCK HEADER ID:", id);

//       if (!id) {
//         throw new Error("Daily Stock Header ID not found");
//       }

//       const url = `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${id}`;

//       console.log("DAILY STOCK DETAIL GET URL:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       console.log("DETAIL GET STATUS:", response.status);
//       console.log("DETAIL GET STATUS TEXT:", response.statusText);

//       const text = await response.text();

//       console.log("DETAIL GET RAW RESPONSE:", text);

//       let result;

//       try {
//         result = JSON.parse(text);
//       } catch (error) {
//         console.error("DETAIL GET JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Detail API response: ${text}`);
//       }

//       console.log("DAILY STOCK DETAIL API RESPONSE:", result);

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             `Daily Stock Detail API failed: ${response.status}`,
//         );
//       }

//       if (result?.success === false) {
//         throw new Error(
//           result?.message || "Daily Stock Detail data could not be loaded",
//         );
//       }

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//     const mappedData = data.map((item) => ({
//   Id: Number(
//     item?.Id ??
//     item?.id ??
//     0
//   ),

//   DailyStockHeaderId: Number(
//     item?.DailyStockHeaderId ??
//     item?.dailyStockHeaderId ??
//     headerId ??
//     0
//   ),

//   ProductId: Number(
//     item?.ProductId ??
//     item?.ProductID ??
//     item?.productId ??
//     item?.productID ??
//     item?.product_id ??
//     0
//   ),

//   Quantity: Number(
//     item?.Quantity ??
//     item?.quantity ??
//     item?.Qty ??
//     item?.qty ??
//     0
//   ),

//   Rate: Number(
//     item?.Rate ??
//     item?.rate ??
//     item?.Price ??
//     item?.price ??
//     0
//   ),

//   Amount: Number(
//     item?.Amount ??
//     item?.amount ??
//     0
//   ),
// }));

//       console.log("DAILY STOCK DETAIL FINAL DATA:", mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error(
//         error?.message || "Daily Stock Detail data could not be loaded",
//       );

//       return [];
//     }
//   };

//   const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
//     try {
//       // ============================================================
//       // 1. VALIDATE HEADER ID
//       // ============================================================

//       const id = Number(headerId);

//       console.log("========== DAILY STOCK HEADER UPDATE ==========");
//       console.log("HEADER ID:", id);
//       console.log("ENTRY DATE:", entryDate);
//       console.log("TOTAL AMOUNT:", totalAmount);

//       if (!Number.isInteger(id) || id <= 0) {
//         throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
//       }

//       // ============================================================
//       // 2. FORMAT DATE
//       // API ला YYYY-MM-DD format मध्ये date पाठवा
//       // ============================================================

//       let formattedEntryDate = "";

//       if (entryDate) {
//         if (typeof entryDate === "string") {
//           // Already YYYY-MM-DD
//           if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//             formattedEntryDate = entryDate;
//           }

//           // DD-MM-YYYY
//           else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//             const [day, month, year] = entryDate.split("-");

//             formattedEntryDate = `${year}-${month}-${day}`;
//           }

//           // Try Date parsing
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

//       if (!formattedEntryDate) {
//         throw new Error(`Invalid EntryDate: ${entryDate}`);
//       }

//       console.log("FORMATTED ENTRY DATE:", formattedEntryDate);

//       // ============================================================
//       // 3. TOTAL AMOUNT
//       // ============================================================

//       const amount = Number(totalAmount || 0);

//       if (isNaN(amount)) {
//         throw new Error(`Invalid TotalAmount: ${totalAmount}`);
//       }

//       // ============================================================
//       // 4. SHOP ID
//       // ============================================================

//       const shopId = Number(STOCK_ENTRY_SHOP_ID);

//       if (!Number.isInteger(shopId) || shopId <= 0) {
//         throw new Error(`Invalid ShopId: ${STOCK_ENTRY_SHOP_ID}`);
//       }

//       // ============================================================
//       // 5. UPDATED BY
//       // ============================================================

//       const updatedBy = Number(CREATED_BY);

//       if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//         throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
//       }

//       // ============================================================
//       // 6. CREATE FORM DATA
//       // ============================================================

//       const updateData = new URLSearchParams();

//       updateData.append("Id", String(id));
//       updateData.append("EntryDate", formattedEntryDate);
//       updateData.append("ShopId", String(shopId));

//       // Existing record मध्ये OfficeId NULL आहे,
//       // म्हणून blank ठेवत आहोत.

//       updateData.append("TotalAmount", String(amount));

//       updateData.append("UpdatedBy", String(updatedBy));

//       // ============================================================
//       // 7. LOG EXACT REQUEST
//       // ============================================================

//       console.log(
//         "DAILY STOCK HEADER UPDATE PAYLOAD:",
//         Object.fromEntries(updateData.entries()),
//       );

//       // ============================================================
//       // 8. API CALL
//       // ============================================================

//       const apiUrl =
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//       console.log("DAILY STOCK HEADER UPDATE URL:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData,

//         redirect: "follow",
//       });

//       // ============================================================
//       // 9. READ RAW RESPONSE
//       // IMPORTANT FOR 500 ERROR
//       // ============================================================

//       console.log("HEADER UPDATE STATUS:", response.status);

//       console.log("HEADER UPDATE STATUS TEXT:", response.statusText);

//       const rawResponse = await response.text();

//       console.log("HEADER UPDATE RAW RESPONSE:", rawResponse);

//       // ============================================================
//       // 10. HTTP ERROR
//       // ============================================================

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header Update API failed: ${response.status}${
//             rawResponse ? ` - ${rawResponse}` : ""
//           }`,
//         );
//       }

//       // ============================================================
//       // 11. PARSE JSON
//       // ============================================================

//       let result;

//       try {
//         result = rawResponse ? JSON.parse(rawResponse) : {};
//       } catch (jsonError) {
//         console.error("HEADER UPDATE JSON PARSE ERROR:", jsonError);

//         throw new Error(`Invalid Header Update API response: ${rawResponse}`);
//       }

//       console.log("DAILY STOCK HEADER UPDATE RESPONSE:", result);

//       // ============================================================
//       // 12. CHECK API SUCCESS
//       // ============================================================

//       if (result?.success === false) {
//         throw new Error(result?.message || "Daily Stock Header update failed");
//       }

//       console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

//       return result;
//     } catch (error) {
//       console.error("❌ Daily Stock Header Update API Error:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

// useEffect(() => {
//   const loadStockData = async () => {
//     try {
//       await fetchProduct();
//       await fetchDailyStockHeaders();
//       await fetchMainOfficeStock(date);
//     } catch (error) {
//       console.error(
//         "ERROR LOADING DAILY STOCK DATA:",
//         error
//       );
//     }
//   };

//   if (date) {
//     loadStockData();
//   }
// }, [date]);



// useEffect(() => {
//   if (!productOptions || productOptions.length === 0) {
//     return;
//   }

//   setProductRates((prev) => {
//     const updated = { ...prev };

//     productOptions.forEach((product) => {
//       const productId = String(product.value);

//       // Existing manually changed rate असेल तर तोच ठेवा
//       if (updated[productId] === undefined) {
//         updated[productId] = Number(product.rate || 0);
//       }
//     });

//     return updated;
//   });
// }, [productOptions]);


//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//  const resetForm = () => {
//   setDate(new Date());

//   setProductQuantities({});

//   setSelectedProduct(null);

//   setProductQuantity("");

//   setProductRate("");

//   setEditingEntry(null);

//   setPhysicalQuantities({});

//   setProductSearch("");
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
//   // PRODUCT QUANTITY CHANGE
//   // ==========================================================

//  const handleProductQuantityChange = (productId, value) => {
//   const key = String(productId);

//   // ==========================================================
//   // PHYSICAL QUANTITY
//   // ==========================================================
//   setPhysicalQuantities((previous) => ({
//     ...previous,
//     [key]: value,
//   }));

//   // ==========================================================
//   // PRODUCT QUANTITY
//   // Keep rate + detailId while changing quantity
//   // ==========================================================
//   setProductQuantities((previous) => {
//     const existing = previous[key];

//     return {
//       ...previous,
//       [key]: {
//         ...(existing && typeof existing === "object"
//           ? existing
//           : {}),
//         quantity: value,
//       },
//     };
//   });
// };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA
//   // ==========================================================
//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id || item?.id || "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ||
//         item?.AccountName ||
//         item?.Shop ||
//         item?.Name ||
//         item?.shop ||
//         "Stock Entry Shop",

//       total: Number(item?.TotalAmount ?? item?.total ?? 0),
//     }));
//   }, [stockEntries]);








//   // ==========================================================
//   // SAVE / UPDATE STOCK ENTRY SHOP
//   // ==========================================================

// const handleSave = async (skipComparisonPopup = false) => {
//   console.log("🔥🔥🔥 HANDLE SAVE CALLED 🔥🔥🔥");
//   console.log("skipComparisonPopup =", skipComparisonPopup);
//   console.log("physicalQuantities =", physicalQuantities);
//   console.log("productQuantities =", productQuantities);

//   // ==========================================================
//   // DATE VALIDATION
//   // ==========================================================
//   if (!date) {
//     toast.error("Please select Date");
//     return;
//   }

//   // ==========================================================
//   // CREATE DATE STRING
//   // ==========================================================
//   const entryDate = `${date.getFullYear()}-${String(
//     date.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     date.getDate()
//   ).padStart(2, "0")}`;

//   try {
//     setSaving(true);

//     // ==========================================================
//     // PREPARE SELECTED PRODUCTS
//     // ==========================================================

//    const selectedRows = productOptions.map((product) => {
//   const productId = String(product.value);

//   const savedValue = productQuantities?.[productId];

//   const physicalValue = physicalQuantities?.[productId];

//   const quantity =
//     physicalValue !== undefined &&
//     physicalValue !== ""
//       ? Number(physicalValue)
//       : savedValue &&
//         typeof savedValue === "object"
//       ? Number(savedValue?.quantity || 0)
//       : Number(savedValue || 0);

//   const detailId =
//     savedValue &&
//     typeof savedValue === "object"
//       ? savedValue?.detailId || ""
//       : "";

//   const rate =
//     savedValue &&
//     typeof savedValue === "object" &&
//     savedValue.rate !== undefined &&
//     savedValue.rate !== ""
//       ? Number(savedValue.rate)
//       : Number(
//           productRates?.[productId] ??
//           product.rate ??
//           0
//         );

//   return {
//     Id: detailId,

//     ProductId: Number(product.value),

//     ProductCode:
//       product.productCode || "",

//     ProductName:
//       product.label || "",

//     Quantity: quantity,

//     Rate: rate,

//     Amount: quantity * rate,
//   };
// });
      

//     console.log(
//       "=================================================="
//     );

//     console.log(
//       "FINAL SELECTED ROWS:",
//       selectedRows
//     );

//     console.log(
//       "=================================================="
//     );

//     // ==========================================================
//     // VALIDATE PRODUCTS
//     // ==========================================================
//     if (selectedRows.length === 0) {
//       toast.error(
//         "Please enter quantity for at least one product"
//       );

//       setSaving(false);
//       return;
//     }

//     // ==========================================================
//     // TOTAL AMOUNT
//     // ==========================================================
//     const totalAmount =
//       selectedRows.reduce(
//         (sum, row) =>
//           sum +
//           Number(row.Quantity || 0) *
//             Number(row.Rate || 0),
//         0
//       );

//     console.log(
//       "TOTAL AMOUNT:",
//       totalAmount
//     );

//    // ========================================================
// // STOCK COMPARISON LOGIC
// // ========================================================
// //
// // Main Office = Stock received from Main Office
// // Sold       = Actual Sales Entry quantity
// // Physical   = Quantity entered in Daily Stock
// //
// // Expected   = Main Office - Sold
// // Difference = Physical - Expected
// //
// // Example:
// // Main Office = 60
// // Sold       = 40
// // Expected   = 20
// // Physical   = 19
// // Difference = -1
// // ========================================================

//    if (!skipComparisonPopup) {

//   console.log(
//     "🔄 REFRESHING STOCK DATA BEFORE COMPARISON..."
//   );

//   // ========================================================
//   // LATEST MAIN OFFICE STOCK
//   // ========================================================
//   let latestMainOfficeQuantities = {};

//   // ========================================================
//   // LATEST SOLD QUANTITIES
//   // ========================================================
//   let latestSoldQuantities = {};

//   // ========================================================
//   // REFRESH MAIN OFFICE STOCK
//   // ========================================================
//   try {

//     latestMainOfficeQuantities =
//       await fetchMainOfficeStock(date);

//     console.log(
//       "LATEST MAIN OFFICE QUANTITIES:",
//       latestMainOfficeQuantities
//     );

//   } catch (error) {

//     console.error(
//       "MAIN OFFICE STOCK REFRESH ERROR:",
//       error
//     );

//     latestMainOfficeQuantities = {};
//   }

//   // ========================================================
//   // REFRESH SOLD QUANTITIES
//   // ========================================================
//   try {

//     latestSoldQuantities =
//       await fetchSoldQuantities(date);

//     console.log(
//       "LATEST SOLD QUANTITIES:",
//       latestSoldQuantities
//     );

//   } catch (error) {

//     console.error(
//       "SOLD QUANTITY REFRESH ERROR:",
//       error
//     );

//     latestSoldQuantities = {};
//   }

//   // ========================================================
//   // CREATE COMPARISON DATA
//   // ========================================================
// const comparisonData = selectedRows.map((row) => {
//   const productId = String(row.ProductId);

//   // ========================================================
//   // MAIN OFFICE STOCK
//   // ========================================================
//   const mainOfficeQty = Number(
//     latestMainOfficeQuantities?.[productId] ?? 0
//   );

//   // ========================================================
//   // ACTUAL SALES QUANTITY
//   // ========================================================
//   const soldQty = Number(
//     latestSoldQuantities?.[productId] ?? 0
//   );

//   // ========================================================
//   // PHYSICAL STOCK ENTERED BY USER
//   // ========================================================
//   const physicalQty = Number(
//     row.Quantity ?? 0
//   );

//   // ========================================================
//   // EXPECTED STOCK
//   // Main Office - Sold
//   // ========================================================
//   const expectedQty =
//     mainOfficeQty - soldQty;

//   // ========================================================
//   // DIFFERENCE
//   // Physical - Expected
//   // ========================================================
//   const difference =
//     physicalQty - expectedQty;

//   return {
//     ProductId: row.ProductId,

//     ProductCode:
//       row.ProductCode || "-",

//     ProductName:
//       row.ProductName || "-",

//     MainOffice:
//       mainOfficeQty,

//     Sold:
//       soldQty,

//     Expected:
//       expectedQty,

//     Physical:
//       physicalQty,

//     Difference:
//       difference,

//     Rate:
//       Number(row.Rate || 0),
//   };
// });

//   // ========================================================
//   // FINAL COMPARISON LOG
//   // ========================================================
//   console.log(
//     "======================================"
//   );

//   console.log(
//     "FINAL STOCK COMPARISON:",
//     comparisonData
//   );

//   console.log(
//     "======================================"
//   );

//   // ========================================================
//   // SET COMPARISON DATA
//   // ========================================================
//   setComparisonRows(
//     comparisonData
//   );

//   // ========================================================
//   // STOP SAVING LOADER
//   // ========================================================
//   setSaving(false);

//   // ========================================================
//   // OPEN COMPARISON POPUP
//   // ========================================================
//   setOpenComparisonPopup(true);

//   return;
// }

//     // ==========================================================
//     // ==========================================================
//     // ACTUAL API SAVE STARTS HERE
//     // ==========================================================
//     // ==========================================================

//     console.log(
//       "🚨🚨🚨 ACTUAL API SAVE BLOCK ENTERED 🚨🚨🚨"
//     );

//     console.log(
//       "skipComparisonPopup =",
//       skipComparisonPopup
//     );

//     // ==========================================================
//     // EDIT EXISTING ENTRY
//     // ==========================================================
//     if (editingEntry) {

//       const headerId =
//         editingEntry?.Id ||
//         editingEntry?.id;

//       if (!headerId) {
//         throw new Error(
//           "Stock Entry Shop Header ID not found"
//         );
//       }

//       console.log(
//         "UPDATING STOCK ENTRY SHOP:",
//         headerId
//       );

//       // ========================================================
//       // UPDATE HEADER
//       // ========================================================
//       await updateDailyStockHeader(
//         headerId,
//         entryDate,
//         totalAmount
//       );

//       console.log(
//         "STOCK ENTRY SHOP HEADER UPDATED:",
//         headerId
//       );

//       // ========================================================
//       // UPDATE / INSERT DETAILS
//       // ========================================================
//       for (const row of selectedRows) {

//         const detailId =
//           row?.Id ||
//           row?.id ||
//           "";

//         const quantity =
//           Number(row?.Quantity || 0);

//         const rate =
//           Number(row?.Rate || 0);

//         const amount =
//           quantity * rate;

//         // ======================================================
//         // UPDATE EXISTING DETAIL
//         // ======================================================
//         if (detailId) {

//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "Id",
//             String(Number(detailId))
//           );

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(
//               Number(row.ProductId)
//             )
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "UpdatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "UPDATE DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },

//                 body:
//                   detailData.toString(),
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL UPDATE RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Update API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail update failed"
//             );
//           }

//           console.log(
//             "DETAIL UPDATED SUCCESSFULLY:",
//             result
//           );
//         }

//         // ======================================================
//         // INSERT NEW DETAIL
//         // ======================================================
//         else {

//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(
//               Number(row.ProductId)
//             )
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "CreatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "INSERT DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },

//                 body:
//                   detailData.toString(),
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL INSERT RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Insert API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail insert failed"
//             );
//           }

//           console.log(
//             "DETAIL INSERTED SUCCESSFULLY:",
//             result
//           );
//         }
//       }

//       // ========================================================
//       // UPDATE LOCAL TABLE
//       // ========================================================
//       setStockEntries(
//         (previous) =>
//           previous.map((item) => {

//             const itemId =
//               item?.Id ||
//               item?.id;

//             if (
//               String(itemId) !==
//               String(headerId)
//             ) {
//               return item;
//             }

//             return {
//               ...item,

//               EntryDate:
//                 entryDate,

//               dateText:
//                 formatDate(entryDate),

//               TotalAmount:
//                 Number(
//                   totalAmount || 0
//                 ),

//               total:
//                 Number(
//                   totalAmount || 0
//                 ),
//             };
//           })
//       );

//       toast.success(
//         "Stock Entry Shop updated successfully!"
//       );
//     }

//     // ==========================================================
//     // NEW ENTRY
//     // ==========================================================
//     else {

//       // ========================================================
//       // HEADER DATA
//       // ========================================================
//       const headerData =
//         new URLSearchParams();

//       headerData.append(
//         "EntryDate",
//         String(entryDate)
//       );

//       headerData.append(
//         "ShopId",
//         String(STOCK_ENTRY_SHOP_ID)
//       );

//       headerData.append(
//         "OfficeId",
//         ""
//       );

//       headerData.append(
//         "TotalAmount",
//         String(
//           Number(totalAmount || 0)
//         )
//       );

//       headerData.append(
//         "CreatedBy",
//         String(CREATED_BY)
//       );

//       console.log(
//         "STOCK ENTRY SHOP HEADER DATA:",
//         Object.fromEntries(
//           headerData.entries()
//         )
//       );

//       // ========================================================
//       // HEADER API
//       // ========================================================
//       const headerResponse =
//         await fetch(
//           "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
//           {
//             method: "POST",

//             mode: "cors",

//             credentials: "omit",

//             headers: {
//               Accept:
//                 "application/json",

//               "Content-Type":
//                 "application/x-www-form-urlencoded;charset=UTF-8",
//             },

//             body:
//               headerData.toString(),
//           }
//         );

//       const headerText =
//         await headerResponse.text();

//       console.log(
//         "HEADER RESPONSE:",
//         headerText
//       );

//       let headerResult = {};

//       try {
//         headerResult =
//           headerText
//             ? JSON.parse(headerText)
//             : {};
//       } catch {
//         throw new Error(
//           `Invalid Header API response: ${headerText}`
//         );
//       }

//       if (
//         !headerResponse.ok ||
//         !headerResult?.success
//       ) {
//         throw new Error(
//           headerResult?.message ||
//             "Daily Stock Header save failed"
//         );
//       }

//       const headerId =
//         headerResult?.Id ??
//         headerResult?.id ??
//         headerResult?.insert_id ??
//         headerResult?.DailyStockHeaderId ??
//         headerResult?.data?.Id ??
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error(
//           "Header created but Header ID was not returned."
//         );
//       }

//       console.log(
//         "CREATED HEADER ID:",
//         headerId
//       );

//       // ========================================================
//       // SAVE DETAILS
//       // ========================================================
//       for (const row of selectedRows) {

//         const detailData =
//           new URLSearchParams();

//         detailData.append(
//           "DailyStockHeaderId",
//           String(Number(headerId))
//         );

//         detailData.append(
//           "ProductId",
//           String(
//             Number(row.ProductId)
//           )
//         );

//         detailData.append(
//           "Quantity",
//           String(
//             Number(row.Quantity || 0)
//           )
//         );

//         detailData.append(
//           "Rate",
//           String(
//             Number(row.Rate || 0)
//           )
//         );

//         detailData.append(
//           "Amount",
//           String(
//             Number(row.Amount || 0)
//           )
//         );

//         detailData.append(
//           "CreatedBy",
//           String(CREATED_BY)
//         );

//         console.log(
//           "DETAIL SAVE PAYLOAD:",
//           Object.fromEntries(
//             detailData.entries()
//           )
//         );

//         const detailResponse =
//           await fetch(
//             "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//             {
//               method: "POST",

//               headers: {
//                 Accept:
//                   "application/json",

//                 "Content-Type":
//                   "application/x-www-form-urlencoded",
//               },

//               body:
//                 detailData.toString(),
//             }
//           );

//         const detailText =
//           await detailResponse.text();

//         console.log(
//           "DETAIL RESPONSE:",
//           detailText
//         );

//         let detailResult = {};

//         try {
//           detailResult =
//             detailText
//               ? JSON.parse(detailText)
//               : {};
//         } catch {
//           throw new Error(
//             `Invalid Detail API response: ${detailText}`
//           );
//         }

//         if (
//           !detailResponse.ok ||
//           detailResult?.success === false
//         ) {
//           throw new Error(
//             detailResult?.message ||
//               "Daily Stock Detail save failed"
//           );
//         }

//         console.log(
//           "DETAIL SAVED SUCCESSFULLY:",
//           detailResult
//         );
//       }

//       // ========================================================
//       // ADD NEW RECORD TO TABLE
//       // ========================================================
//       const newEntry = {

//         Id:
//           Number(headerId),

//         id:
//           Number(headerId),

//         EntryDate:
//           entryDate,

//         dateText:
//           formatDate(entryDate),

//         ShopId:
//           STOCK_ENTRY_SHOP_ID,

//         OfficeId:
//           null,

//         LocationType:
//           "S",

//         ShopName:
//           "Stock Entry Shop",

//         shop:
//           "Stock Entry Shop",

//         TotalAmount:
//           Number(
//             totalAmount || 0
//           ),

//         total:
//           Number(
//             totalAmount || 0
//           ),
//       };

//       setStockEntries(
//         (previous) => [
//           newEntry,
//           ...previous,
//         ]
//       );

//       toast.success(
//         "Stock Entry Shop saved successfully!"
//       );
//     }

//     // ==========================================================
//     // CLOSE FORM AFTER ACTUAL SAVE
//     // ==========================================================
//     setOpenForm(false);

//     resetForm();

//     setPageNo(1);

//     // ==========================================================
//     // REFRESH TABLE
//     // ==========================================================
//     await fetchDailyStockHeaders();

//   } catch (error) {

//     console.error(
//       "STOCK ENTRY SHOP SAVE ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to save Stock Entry Shop"
//     );

//   } finally {

//     setSaving(false);
//   }
// };

//   // ==========================================================
//   // DELETE MAIN ENTRY
//   // ==========================================================

//   // ==========================================================
//   // EDIT STOCK ENTRY SHOP
//   // ==========================================================
//   // ==========================================================
// // EDIT STOCK ENTRY SHOP
// // ==========================================================


// const handleEditEntry = async (entry) => {
//   try {
//     console.log("====================================");
//     console.log("EDIT STOCK ENTRY SHOP");
//     console.log("ENTRY:", entry);
//     console.log("====================================");

//     // --------------------------------------------------
//     // HEADER ID
//     // --------------------------------------------------
//     const headerId =
//       entry?.Id ??
//       entry?.id ??
//       entry?.DailyStockHeaderId;

//     if (!headerId) {
//       toast.error(
//         "Stock Entry Shop Header ID not found"
//       );
//       return;
//     }

//     console.log(
//       "EDIT HEADER ID:",
//       headerId
//     );

//     // --------------------------------------------------
//     // SET EDITING ENTRY
//     // --------------------------------------------------
//     setEditingEntry({
//       ...entry,
//       Id: Number(headerId),
//       id: Number(headerId),
//     });

//     // --------------------------------------------------
//     // SET DATE
//     // --------------------------------------------------
//     const entryDate =
//       entry?.EntryDate ??
//       entry?.entryDate ??
//       entry?.date;

//     if (entryDate) {
//       const parsedDate = new Date(entryDate);

//       if (!isNaN(parsedDate.getTime())) {
//         setDate(parsedDate);
//       }
//     }

//     // --------------------------------------------------
//     // CLEAR OLD QUANTITIES
//     // --------------------------------------------------
//     setProductQuantities({});

//     // --------------------------------------------------
//     // OPEN FORM
//     // --------------------------------------------------
//     setOpenForm(true);

//     // --------------------------------------------------
//     // IMPORTANT:
//     // FETCH DETAILS USING HEADER ID
//     // --------------------------------------------------
//     const details =
//       await fetchDailyStockDetail(headerId);

//     console.log(
//       "EDIT DAILY STOCK DETAILS:",
//       details
//     );

//     if (!Array.isArray(details)) {
//       console.error(
//         "Invalid detail response:",
//         details
//       );

//       toast.error(
//         "Daily Stock details not found"
//       );

//       return;
//     }

//     // --------------------------------------------------
//     // CREATE PRODUCT QUANTITY MAP
//     // --------------------------------------------------
//     const quantityMap = {};

//     details.forEach((item) => {
//       const productId =
//         item?.ProductId ??
//         item?.productId;

//       if (
//         productId === null ||
//         productId === undefined ||
//         String(productId).trim() === ""
//       ) {
//         return;
//       }

//       const detailId =
//         item?.Id ??
//         item?.id ??
//         item?.DailyStockDetailId ??
//         "";

//       const quantity = Number(
//         item?.Quantity ??
//         item?.quantity ??
//         0
//       );

//       const rate = Number(
//         item?.Rate ??
//         item?.rate ??
//         0
//       );

//       quantityMap[String(productId)] = {
//         quantity: quantity,
//         rate: rate,
//         detailId: detailId,
//       };
//     });

//     console.log(
//       "EDIT PRODUCT QUANTITY MAP:",
//       quantityMap
//     );

//     // --------------------------------------------------
//     // SET EXISTING DATA
//     // --------------------------------------------------
//     setProductQuantities(quantityMap);


    

//     // ==========================================================
// // ALSO SET PHYSICAL QUANTITIES FOR EDIT MODE
// // ==========================================================
// const physicalMap = {};

// Object.keys(quantityMap).forEach((productId) => {
//   physicalMap[productId] =
//     quantityMap[productId]?.quantity ?? "";
// });

// setPhysicalQuantities(physicalMap);

//     // --------------------------------------------------
//     // ALSO UPDATE PRODUCT MASTER RATE
//     // --------------------------------------------------
//     setProductOptions((previousProducts) =>
//       previousProducts.map((product) => {
//         const saved =
//           quantityMap[
//             String(product.value)
//           ];

//         if (!saved) {
//           return product;
//         }

//         return {
//           ...product,
//           rate:
//             saved.rate !== undefined
//               ? saved.rate
//               : product.rate,
//         };
//       })
//     );

//   } catch (error) {
//     console.error(
//       "EDIT STOCK ENTRY SHOP ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to load Stock Entry Shop"
//     );
//   }
// };

//   // const handleDeleteEntry = (id) => {
//   //   setStockEntries((previousEntries) =>
//   //     previousEntries.filter((item) => item.id !== id),
//   //   );

//   //   toast.success("Entry removed successfully");
//   // };

//   const handleDeleteEntry = async (id) => {
//     if (!id) {
//       toast.error("Stock Entry ID not found");
//       return;
//     }

//     try {
//       setSaving(true);

//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//       console.log("DELETE STOCK ENTRY SHOP URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       console.log("DELETE API STATUS:", response.status);

//       console.log("DELETE API RESPONSE:", resultText);

//       if (!response.ok) {
//         throw new Error(`Delete API failed: ${response.status}`);
//       }

//       // Remove from UI after successful API delete
//       setStockEntries((previousEntries) =>
//         previousEntries.filter((item) => Number(item.id) !== Number(id)),
//       );

//       toast.success("Stock Entry Shop deleted successfully");
//     } catch (error) {
//       console.error("Delete Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to delete Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
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
//       // ====================================================
//       // SR NO
//       // ====================================================

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

//         header: "Shop",

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
//             <b>Stock Entry Shop </b>
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
//               CREATE DAILY STOCK ENTRY
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
//               Stock Entry Shop
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
//               {/* ==================================================
//       STOCK ENTRY SHOP
//   ================================================== */}
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Stock Entry Shop:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   fullWidth
//                   value="Stock Entry Shop"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "#fafafa",
//                       borderRadius: "5px",
//                     },

//                     "& .MuiInputBase-input": {
//                       fontSize: "14px",
//                       fontWeight: 500,
//                     },
//                   }}
//                 />
//               </Box>

//               {/* ==================================================
//       DATE
//   ================================================== */}
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

//             {/* =========================================================
//     PRODUCT SELECTION / QUANTITY / RATE / ADD
//     NOT REQUIRED FOR STOCK ENTRY SHOP
//     Products are shown directly in the table below.
// ========================================================= */}


//  {/* ==========================================================
//     PRODUCT SEARCH
// ========================================================== */}
// <Box sx={{ mb: 2 }}>
//   <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography>

//   <TextField
//     fullWidth
//     size="small"
//     value={productSearch}
//     onChange={(e) => {
//       setProductSearch(e.target.value);
//     }}
//     placeholder="Search Product / Code"
//     sx={{
//       "& .MuiOutlinedInput-root": {
//         borderRadius: "6px",
//         backgroundColor: "#fff",
//       },

//       "& .MuiInputBase-input": {
//         fontSize: "15px",
//       },
//     }}
//   />
// </Box>

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #d0d0d0",
//                 borderRadius: "6px",
//                 overflowX: "hidden",
//                 overflowY: "visible",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   width: "100%",
//                   tableLayout: "fixed",

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",
//                   },
//                 }}
//               >
//                 {/* =====================================================
//         TABLE HEADER
//     ===================================================== */}
//       <TableHead>
//   <TableRow
//     sx={{
//       backgroundColor: "#e9ecef",
//     }}
//   >
//     {/* PRODUCT CODE */}
//     <TableCell
//       sx={{
//         width: "18%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Code
//     </TableCell>

//     {/* PRODUCT NAME */}
//     <TableCell
//       sx={{
//         width: "42%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Name
//     </TableCell>

//     {/* QUANTITY */}
//     <TableCell
//       align="center"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Quantity
//     </TableCell>

//     {/* RATE */}
//     <TableCell
//       align="right"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Rate
//     </TableCell>
//   </TableRow>
// </TableHead>

//                 {/* =====================================================
//         TABLE BODY
//     ===================================================== */}

// <TableBody>
//   {loadingProducts ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         Loading Products...
//       </TableCell>
//     </TableRow>
//   ) : filteredProductOptions.length === 0 ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         No Products Found
//       </TableCell>
//     </TableRow>
//   ) : (
//     filteredProductOptions.map((product) => {
//       const savedValue =
//         productQuantities[
//           String(product.value)
//         ];

//       // ================================
//       // DEFAULT QUANTITY = 0
//       // ================================
//       const quantity =
//         savedValue &&
//         typeof savedValue === "object"
//           ? savedValue?.quantity ?? 0
//           : savedValue ?? 0;

//       // ================================
//       // CURRENT RATE
//       // ================================
//       const rate =
//         productRates[
//           String(product.value)
//         ] ?? Number(product.rate || 0);

//       return (
//         <TableRow
//           key={String(product.value)}
//           hover
//         >

//           {/* PRODUCT CODE */}
//           <TableCell>
//             {product.productCode || "-"}
//           </TableCell>

//           {/* PRODUCT NAME */}
//           <TableCell>
//             {product.label || "-"}
//           </TableCell>

//           {/* ============================
//               QUANTITY
//           ============================ */}
//           <TableCell align="center">
//             <TextField
//               type="number"
//               size="small"

//               value={quantity}

//               onChange={(e) => {
//                 handleProductQuantityChange(
//                   product.value,
//                   e.target.value
//                 );
//               }}

//               onKeyDown={(e) => {
//                 handleQuantityKeyDown(
//                   e,
//                   product.value
//                 );
//               }}

//               inputRef={(input) => {
//                 quantityInputRefs.current[
//                   String(product.value)
//                 ] = input;
//               }}

//               inputProps={{
//                 min: 0,
//                 step: 1,
//               }}

//               sx={{
//                 width: 110,

//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "6px",
//                   backgroundColor: "#fff",
//                 },

//                 "& .MuiInputBase-input": {
//                   textAlign: "center",
//                   fontSize: "15px",
//                 },
//               }}
//             />
//           </TableCell>

//           {/* ============================
//               EDITABLE RATE
//           ============================ */}
//           <TableCell align="center">
//             <TextField
//               type="number"
//               size="small"

//               value={rate}

//               onChange={(e) => {
//                 const value =
//                   e.target.value;

//                 setProductRates((prev) => ({
//                   ...prev,

//                   [String(product.value)]:
//                     value === ""
//                       ? 0
//                       : Number(value),
//                 }));
//               }}

//               inputProps={{
//                 min: 0,
//                 step: 0.01,
//               }}

//               sx={{
//                 width: 110,

//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "6px",
//                   backgroundColor: "#fff",
//                 },

//                 "& .MuiInputBase-input": {
//                   textAlign: "right",
//                   fontSize: "15px",
//                 },
//               }}
//             />
//           </TableCell>

//         </TableRow>
//       );
//     })
//   )}
// </TableBody>

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
//             ></Box>
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
//   variant="contained"
//   disabled={saving}
//   onClick={() => handleSave(false)}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",

//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving ? "Saving..." : "Save"}
// </Button>
              

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

//         {/* ==========================================================
//     STOCK COMPARISON REPORT
// ========================================================== */}

// <Dialog
//   open={openReport}
//   onClose={() => setOpenReport(false)}
//   fullWidth
//   maxWidth="xl"
//   PaperProps={{
//     sx: {
//       borderRadius: "8px",
//       maxHeight: "90vh",
//     },
//   }}
// >
//   {/* REPORT HEADER */}
//   <DialogTitle
//     sx={{
//       backgroundColor: "rgb(236, 253, 230)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       borderBottom: "1px solid #ddd",
//       fontWeight: 700,
//       color: "#0B5E20",
//     }}
//   >
//     <Typography
//       sx={{
//         fontWeight: 700,
//         fontSize: "20px",
//       }}
//     >
//       Daily Stock Comparison Report
//     </Typography>

//     <IconButton
//       onClick={() => setOpenReport(false)}
//     >
//       <CloseIcon />
//     </IconButton>
//   </DialogTitle>

//   {/* REPORT CONTENT */}
//   <DialogContent dividers>
//     <TableContainer
//       component={Paper}
//       elevation={0}
//       sx={{
//         border: "1px solid #d0d0d0",
//         borderRadius: "6px",
//         overflowX: "auto",
//       }}
//     >
//       <Table
//         size="small"
//         sx={{
//           minWidth: 1000,

//           "& .MuiTableCell-root": {
//             border: "1px solid #d0d0d0",
//           },
//         }}
//       >
//     <TableHead>
//   <TableRow>

//     <TableCell>
//       Product Code
//     </TableCell>

//     <TableCell>
//       Product Name
//     </TableCell>

//     <TableCell align="center">
//       Main Office
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Expected
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Physical
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Difference
//     </TableCell>

//   </TableRow>
// </TableHead>

//      <TableBody>
//   {productOptions.map((product) => {

//     const productId = String(product.value);

//     const savedValue =
//       productQuantities?.[productId];

//     const quantity =
//       typeof savedValue === "object"
//         ? savedValue?.quantity ?? ""
//         : savedValue ?? "";

//     const rate =
//       product.rate ??
//       product.SaleRate ??
//       product.Price ??
//       "";

//     return (
//       <TableRow
//         key={productId}
//         hover
//       >

//         <TableCell>
//           {product.productCode || "-"}
//         </TableCell>

//         <TableCell>
//           {product.label || "-"}
//         </TableCell>

//         <TableCell align="center">
//           <TextField
//             size="small"
//             type="number"
//             value={quantity}
//             placeholder="Enter Qty"
//             onChange={(e) => {
//               handleProductQuantityChange(
//                 product.value,
//                 e.target.value
//               );
//             }}
//             inputProps={{
//               min: 0,
//               step: 1,
//             }}
//             sx={{
//               width: "110px",
//               "& input": {
//                 textAlign: "center",
//               },
//             }}
//           />
//         </TableCell>

//         <TableCell align="right">
//           <TextField
//             size="small"
//             type="number"
//             value={rate}
//             onChange={(e) => {

//               const value =
//                 e.target.value;

//               setProductOptions((prevProducts) =>
//                 prevProducts.map((item) =>
//                   String(item.value) === productId
//                     ? {
//                         ...item,
//                         rate:
//                           value === ""
//                             ? ""
//                             : Number(value),
//                       }
//                     : item
//                 )
//               );

//             }}
//             inputProps={{
//               min: 0,
//               step: "0.01",
//             }}
//             sx={{
//               width: "100px",
//               "& input": {
//                 textAlign: "right",
//               },
//             }}
//           />
//         </TableCell>

//       </TableRow>
//     );
//   })}
// </TableBody>
        
//       </Table>
//     </TableContainer>
//   </DialogContent>

//   {/* CLOSE */}
//   <DialogActions
//     sx={{
//       justifyContent: "flex-end",
//       px: 2,
//       py: 1.5,
//     }}
//   >
//     <Button
//       variant="contained"
//       onClick={() => setOpenReport(false)}
//       sx={{
//         textTransform: "none",
//         backgroundColor: "var(--primary-color)",
//       }}
//     >
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>


// {/* ==========================================================
//     SAVE COMPARISON POPUP
// ========================================================== */}

// <Dialog
//   open={openComparisonPopup}
//   onClose={() => {
//     if (!saving) {
//       setOpenComparisonPopup(false);
//     }
//   }}
//   fullWidth
//   maxWidth="md"
// >
//   <DialogTitle
//     sx={{
//       backgroundColor: "#ecfde6",
//       color: "#0B5E20",
//       fontWeight: 700,
//     }}
//   >
//     Stock Comparison
//   </DialogTitle>

//   <DialogContent dividers>
//     <Typography
//       sx={{
//         mb: 2,
//         fontWeight: 600,
//         fontSize: "15px",
//       }}
//     >
//       Please verify the stock before saving.
//     </Typography>

//     <TableContainer
//       component={Paper}
//       sx={{
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//       }}
//     >
//       <Table size="small">
//         <TableHead>
//   <TableRow>

//     <TableCell sx={{ fontWeight: 700 }}>
//       Product Code
//     </TableCell>

//     <TableCell sx={{ fontWeight: 700 }}>
//       Product Name
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Main Office
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Sold
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Expected
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Physical
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Difference
//     </TableCell>

//   </TableRow>
// </TableHead>

//    <TableBody>
//   {comparisonRows.length === 0 ? (
//     <TableRow>
//       <TableCell
//         colSpan={7}
//         align="center"
//       >
//         No comparison data available
//       </TableCell>
//     </TableRow>
//   ) : (
//     comparisonRows.map((row) => (
//       <TableRow
//         key={String(row.ProductId)}
//       >

//         {/* PRODUCT CODE */}
//         <TableCell>
//           {row.ProductCode || "-"}
//         </TableCell>

//         {/* PRODUCT NAME */}
//         <TableCell>
//           {row.ProductName || "-"}
//         </TableCell>

//         {/* MAIN OFFICE */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//           }}
//         >
//           {Number(row.MainOffice || 0)}
//         </TableCell>

//         {/* SOLD */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//           }}
//         >
//           {Number(row.Sold || 0)}
//         </TableCell>

//         {/* EXPECTED */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//           }}
//         >
//           {Number(row.Expected || 0)}
//         </TableCell>

//         {/* PHYSICAL */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//             color:
//               Number(row.Difference || 0) === 0
//                 ? "green"
//                 : "red",
//           }}
//         >
//           {Number(row.Physical || 0)}
//         </TableCell>

//         {/* DIFFERENCE */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//             color:
//               Number(row.Difference || 0) === 0
//                 ? "green"
//                 : "red",
//           }}
//         >
//           {Number(row.Difference || 0)}
//         </TableCell>

//       </TableRow>
//     ))
//   )}
// </TableBody>

//       </Table>
//     </TableContainer>
//   </DialogContent>

//   <DialogActions
//     sx={{
//       px: 2,
//       py: 1.5,
//       gap: 1,
//     }}
//   >
//     <Button
//       variant="outlined"
//       disabled={saving}
//       onClick={() => {
//         setOpenComparisonPopup(false);
//       }}
//       sx={{
//         textTransform: "none",
//         color: "var(--complementary-color)",
//         borderColor: "var(--complementary-color)",
//       }}
//     >
//       Cancel
//     </Button>

//     <Button
//       variant="contained"
//       disabled={saving}
//       onClick={async () => {
//         setOpenComparisonPopup(false);

//         // ACTUAL SAVE
//         await handleSave(true);
//       }}
//       sx={{
//         textTransform: "none",
//         background: "var(--primary-color)",
//         "&:hover": {
//           background: "var(--primary-color)",
//         },
//       }}
//     >
//       {saving ? "Saving..." : "Confirm Save"}
//     </Button>
//   </DialogActions>
// </Dialog>

//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default EntryShop;





















// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { createFilterOptions } from "@mui/material/Autocomplete";
// import Autocomplete from "@mui/material/Autocomplete";

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

// const formatDate = (value) => {
//   if (!value) {
//     return "";
//   }

//   const d = new Date(value);

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const EntryShop = () => {
//   // ==========================================================
//   // MAIN TABLE DATA
//   // ==========================================================

//   const preventNumberInputScroll = (event) => {
//   event.currentTarget.blur();
// };

//   const [stockEntries, setStockEntries] = useState([]);

//   // ==========================================================
//   // FORM DIALOG
//   // ==========================================================

//   const [openForm, setOpenForm] = useState(false);

//   const [saving, setSaving] = useState(false);


// // ==========================================================
// // SAVE COMPARISON POPUP
// // ==========================================================
// const [openComparisonPopup, setOpenComparisonPopup] = useState(false);
// const [comparisonRows, setComparisonRows] = useState([]);

// // ==========================================================
// // STOCK COMPARISON REPORT
// // ==========================================================
// const [comparisonReportOpen, setComparisonReportOpen] = useState(false);
// const [comparisonReportRows, setComparisonReportRows] = useState([]);
// const [comparisonReportDate, setComparisonReportDate] = useState("");




//   // ==========================================================
//   // SHOP / ACCOUNT
//   // ==========================================================

//   const [editingEntry, setEditingEntry] = useState(null);

//   const STOCK_ENTRY_SHOP_ID = 1;

//  // =====================================================
// // LOGGED-IN USER ROLE → CREATED BY / UPDATED BY
// // ADMIN = 1
// // SALE  = 2
// // SALE2 = 3
// // =====================================================

// const getUserTypeId = () => {
//   const role = String(
//     sessionStorage.getItem("UserRole") || ""
//   )
//     .trim()
//     .toUpperCase();

//   if (role === "ADMIN") {
//     return 1;
//   }

//   if (role === "SALE") {
//     return 2;
//   }

//   if (role === "SALE2") {
//     return 3;
//   }

//   return 0;
// };

// const CREATED_BY = getUserTypeId();
// const UPDATED_BY = getUserTypeId();

//   // ==========================================================
//   // DATE
//   // ==========================================================

//   const [date, setDate] = useState(new Date());


//   const [soldQuantities, setSoldQuantities] = useState({});



  
// const [quantity, setQuantity] = useState("");
// const [rate, setRate] = useState("");
// const [rows, setRows] = useState([]);

//   // ==========================================================
// // FETCH SOLD QUANTITY FOR SELECTED DATE
// // ==========================================================

// // ==========================================================
// // FETCH ACTUAL SOLD QUANTITY FROM SALES / INVOICE
// // ==========================================================
// const fetchSoldQuantities = async (
//   selectedDate = date
// ) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH ACTUAL SOLD QUANTITIES");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     // --------------------------------------------------------
//     // FORMAT SELECTED DATE
//     // --------------------------------------------------------
//     const getDateOnly = (value) => {
//       if (!value) {
//         return "";
//       }

//       // Date object
//       if (value instanceof Date) {
//         if (Number.isNaN(value.getTime())) {
//           return "";
//         }

//         return `${value.getFullYear()}-${String(
//           value.getMonth() + 1
//         ).padStart(2, "0")}-${String(
//           value.getDate()
//         ).padStart(2, "0")}`;
//       }

//       // API date object:
//       // { date: "2026-09-23 00:00:00.000000" }
//       if (
//         typeof value === "object" &&
//         value?.date
//       ) {
//         return String(value.date).slice(0, 10);
//       }

//       return String(value).slice(0, 10);
//     };

//     const selectedDateString =
//       getDateOnly(selectedDate);

//     console.log(
//       "SALES DATE:",
//       selectedDateString
//     );

//     // --------------------------------------------------------
//     // FETCH INVOICE HEADERS
//     // --------------------------------------------------------
//     const headerResponse = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=InvoiceHeader"
//     );

//     if (!headerResponse.ok) {
//       throw new Error(
//         `Invoice Header API failed: ${headerResponse.status}`
//       );
//     }

//     const headerResult =
//       await headerResponse.json();

//     const invoiceHeaders =
//       Array.isArray(headerResult)
//         ? headerResult
//         : Array.isArray(headerResult?.data)
//         ? headerResult.data
//         : [];

//     console.log(
//       "TOTAL INVOICE HEADERS:",
//       invoiceHeaders.length
//     );

//     // --------------------------------------------------------
//     // FILTER INVOICES FOR SELECTED DATE
//     // --------------------------------------------------------
//    const selectedDateInvoices = invoiceHeaders.filter((invoice) => {
//   const invoiceDate = invoice.InvoiceDate;

//   if (!invoiceDate) {
//     return false;
//   }

//   let invoiceDateString = "";

//   // Object date
//   if (
//     typeof invoiceDate === "object" &&
//     invoiceDate?.date
//   ) {
//     invoiceDateString = String(
//       invoiceDate.date
//     ).slice(0, 10);
//   }

//   // String date
//   else if (typeof invoiceDate === "string") {
//     const value = invoiceDate.trim();

//     // YYYY-MM-DD...
//     if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
//       invoiceDateString = value.slice(0, 10);
//     }

//     // DD-MM-YYYY
//     else if (
//       /^\d{2}-\d{2}-\d{4}/.test(value)
//     ) {
//       const parts = value.slice(0, 10).split("-");

//       invoiceDateString =
//         `${parts[2]}-${parts[1]}-${parts[0]}`;
//     }

//     // DD/MM/YYYY
//     else if (
//       /^\d{2}\/\d{2}\/\d{4}/.test(value)
//     ) {
//       const parts = value.slice(0, 10).split("/");

//       invoiceDateString =
//         `${parts[2]}-${parts[1]}-${parts[0]}`;
//     }

//     // Fallback
//     else {
//       invoiceDateString =
//         getDateOnly(value);
//     }
//   }

//   // Other date types
//   else {
//     invoiceDateString =
//       getDateOnly(invoiceDate);
//   }

//   console.log(
//     "INVOICE DATE CHECK:",
//     invoiceDate,
//     "=>",
//     invoiceDateString,
//     "TARGET:",
//     selectedDateString
//   );

//   return (
//     invoiceDateString === selectedDateString
//   );
// });
      

//     console.log(
//       "SELECTED DATE INVOICES:",
//       selectedDateInvoices
//     );

//     console.log(
//       "TOTAL SELECTED DATE INVOICES:",
//       selectedDateInvoices.length
//     );

//     // --------------------------------------------------------
//     // PRODUCT-WISE SOLD QUANTITY
//     // --------------------------------------------------------
//     const soldMap = {};

//     // --------------------------------------------------------
//     // FETCH DETAILS FOR EACH INVOICE
//     // --------------------------------------------------------


//     console.log(
//   "========== INVOICE DATE DEBUG =========="
// );

// invoiceHeaders.slice(0, 10).forEach((invoice) => {
//   console.log(
//     "InvoiceNo:",
//     invoice.InvoiceNo,
//     "InvoiceDate:",
//     invoice.InvoiceDate,
//     "Normalized:",
//     getDateOnly(invoice.InvoiceDate)
//   );
// });

// console.log(
//   "========================================"
// );

//     for (
//       const invoice of selectedDateInvoices
//     ) {
//       const invoiceId =
//         invoice?.Id ??
//         invoice?.id ??
//         invoice?.InvoiceId ??
//         "";

//       if (!invoiceId) {
//         continue;
//       }

//       try {
//         const detailResponse =
//           await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//           );

//         if (!detailResponse.ok) {
//           console.warn(
//             "Invoice Detail API failed:",
//             invoiceId
//           );

//           continue;
//         }

//         const detailResult =
//           await detailResponse.json();

//         const details =
//           Array.isArray(detailResult)
//             ? detailResult
//             : Array.isArray(
//                 detailResult?.data
//               )
//             ? detailResult.data
//             : detailResult?.data
//             ? [detailResult.data]
//             : detailResult
//             ? [detailResult]
//             : [];

//         console.log(
//           `INVOICE DETAILS - ${invoiceId}:`,
//           details
//         );

//         // ----------------------------------------------------
//         // ADD PRODUCT SOLD QUANTITY
//         // ----------------------------------------------------
//         details.forEach((detail) => {
//           const productId = Number(
//             detail?.ProductId ??
//               detail?.productId ??
//               0
//           );

//           const quantity = Number(
//             detail?.Quantity ??
//               detail?.quantity ??
//               0
//           );

//           if (
//             !productId ||
//             !Number.isFinite(quantity)
//           ) {
//             return;
//           }

//           const key = String(productId);

//           soldMap[key] =
//             (soldMap[key] || 0) +
//             quantity;
//         });

//       } catch (detailError) {
//         console.error(
//           "INVOICE DETAIL ERROR:",
//           invoiceId,
//           detailError
//         );
//       }
//     }

//     // --------------------------------------------------------
//     // FINAL SOLD MAP
//     // --------------------------------------------------------
//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL ACTUAL SOLD QUANTITY MAP:",
//       soldMap
//     );

//     console.log(
//       "======================================"
//     );

//     setSoldQuantities(soldMap);

//     return soldMap;

//   } catch (error) {
//     console.error(
//       "FETCH ACTUAL SOLD QUANTITIES ERROR:",
//       error
//     );

//     setSoldQuantities({});

//     return {};
//   }
// };


// const [mainOfficeQuantities, setMainOfficeQuantities] = useState({});
// const [physicalQuantities, setPhysicalQuantities] = useState({});




// const fetchMainOfficeStock = async (selectedDate = date) => {
//   try {
//     console.log("======================================");
//     console.log("FETCH MAIN OFFICE STOCK");
//     console.log("SELECTED DATE:", selectedDate);
//     console.log("======================================");

//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Main Office Header API failed: ${response.status}`
//       );
//     }

//     const result = await response.json();

//     const headers = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : [];

//     // ----------------------------------------------------------
//     // SELECTED DATE
//     // ----------------------------------------------------------

//     const selectedDateString =
//       selectedDate instanceof Date
//         ? `${selectedDate.getFullYear()}-${String(
//             selectedDate.getMonth() + 1
//           ).padStart(2, "0")}-${String(
//             selectedDate.getDate()
//           ).padStart(2, "0")}`
//         : String(selectedDate).slice(0, 10);

//     console.log(
//       "MAIN OFFICE SELECTED DATE:",
//       selectedDateString
//     );

//     // ----------------------------------------------------------
//     // GET ALL MAIN OFFICE HEADERS FOR SELECTED DATE
//     // LocationType = O
//     // ----------------------------------------------------------

//     const mainOfficeHeaders = headers.filter((item) => {
//       const locationType = String(
//         item?.LocationType ??
//           item?.locationType ??
//           ""
//       )
//         .trim()
//         .toUpperCase();

//       const entryDate = String(
//         item?.EntryDate ??
//           item?.entryDate ??
//           item?.Date ??
//           item?.date ??
//           ""
//       ).slice(0, 10);

//       return (
//         locationType === "O" &&
//         entryDate === selectedDateString
//       );
//     });

//     console.log(
//       "MAIN OFFICE HEADERS FOR DATE:",
//       mainOfficeHeaders
//     );

//     console.log(
//       "TOTAL MAIN OFFICE HEADERS:",
//       mainOfficeHeaders.length
//     );

//     // ----------------------------------------------------------
//     // NO MAIN OFFICE ENTRY
//     // ----------------------------------------------------------

//     if (mainOfficeHeaders.length === 0) {
//       console.log(
//         "NO MAIN OFFICE HEADER FOR SELECTED DATE"
//       );

//       setMainOfficeQuantities({});
//       return {};
//     }

//     // ----------------------------------------------------------
//     // FETCH DETAILS FROM ALL MAIN OFFICE HEADERS
//     // ----------------------------------------------------------

//     const stockMap = {};

//     for (const header of mainOfficeHeaders) {
//       const headerId = Number(header?.Id);

//       if (!headerId) {
//         continue;
//       }

//       console.log(
//         "FETCHING MAIN OFFICE DETAILS - HEADER:",
//         headerId
//       );

//       const detailResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
//       );

//       if (!detailResponse.ok) {
//         console.error(
//           "DETAIL API FAILED:",
//           headerId,
//           detailResponse.status
//         );

//         continue;
//       }

//       const detailResult =
//         await detailResponse.json();

//       const details = Array.isArray(detailResult)
//         ? detailResult
//         : Array.isArray(detailResult?.data)
//         ? detailResult.data
//         : [];

//       console.log(
//         `MAIN OFFICE DETAILS - HEADER ${headerId}:`,
//         details
//       );

//       // --------------------------------------------------------
//       // ADD PRODUCT QUANTITY
//       // --------------------------------------------------------

//       details.forEach((item) => {
//         const productId = Number(
//           item?.ProductId ??
//             item?.productId ??
//             0
//         );

//         const quantity = Number(
//           item?.Quantity ??
//             item?.quantity ??
//             0
//         );

//         if (!productId) {
//           return;
//         }

//         const key = String(productId);

//         stockMap[key] =
//           (stockMap[key] || 0) +
//           quantity;
//       });
//     }

//     console.log(
//       "======================================"
//     );

//     console.log(
//       "FINAL DATE-WISE MAIN OFFICE STOCK MAP:",
//       stockMap
//     );

//     console.log(
//       "======================================"
//     );

//     setMainOfficeQuantities(stockMap);

//     return stockMap;

//   } catch (error) {
//     console.error(
//       "MAIN OFFICE STOCK ERROR:",
//       error
//     );

//     setMainOfficeQuantities({});

//     return {};
//   }
// };




// const handlePhysicalQuantityChange = (
//   productId,
//   value
// ) => {
//   setPhysicalQuantities((prev) => ({
//     ...prev,
//     [String(productId)]: value,
//   }));
// };



//   // ==========================================================
//   // PRODUCT
//   // ==========================================================

//   const [productOptions, setProductOptions] = useState([]);

//   const [loadingProducts, setLoadingProducts] = useState(false);

//   const [productQuantities, setProductQuantities] = useState({});
//   const [productRates, setProductRates] = useState({});

//   // ==========================================================
// // PRODUCT SEARCH
// // ==========================================================
// const [productSearch, setProductSearch] = useState("");

// // ==========================================================
// // QUANTITY INPUT REFS
// // Used for Enter -> next row focus
// // ==========================================================
// const quantityInputRefs = useRef({});





// // ==========================================================
// // FILTER PRODUCTS BY SEARCH
// // Search by Product Code OR Product Name
// // ==========================================================
// const filteredProductOptions = useMemo(() => {
//   const search = String(productSearch || "")
//     .trim()
//     .toLowerCase();

//   if (!search) {
//     return productOptions;
//   }

//   return productOptions.filter((product) => {
//     const productCode = String(
//       product?.productCode ?? ""
//     ).toLowerCase();

//     const productName = String(
//       product?.label ?? ""
//     ).toLowerCase();

//     return (
//       productCode.includes(search) ||
//       productName.includes(search)
//     );
//   });
// }, [productOptions, productSearch]);






// // ==========================================================
// // QUANTITY ENTER -> MOVE TO NEXT ROW
// // ==========================================================
// const handleQuantityKeyDown = (event, currentProductId) => {
//   if (event.key !== "Enter") {
//     return;
//   }

//   event.preventDefault();

//   const currentIndex = filteredProductOptions.findIndex(
//     (product) =>
//       String(product.value) === String(currentProductId)
//   );

//   if (currentIndex === -1) {
//     return;
//   }

//   const nextProduct =
//     filteredProductOptions[currentIndex + 1];

//   // No next row
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



//   const [openReport, setOpenReport] = useState(false);


// // ==========================================================
// // PRODUCT SELECTION
// // ==========================================================

// const [selectedProduct, setSelectedProduct] = useState(null);
// const [productQuantity, setProductQuantity] = useState("");
// const [productRate, setProductRate] = useState("");


// // ==========================================================
// // PRODUCT CHANGE
// // ==========================================================

// const handleProductChange = (event, newValue) => {
//   setSelectedProduct(newValue);

//   // No product selected
//   if (!newValue) {
//     setProductQuantity("");
//     setProductRate("");
//     return;
//   }

//   const productId = String(newValue.value);

//   const savedValue =
//     productQuantities?.[productId];

//   let savedQuantity = "";
//   let savedRate = Number(newValue.rate || 0);

//   // Existing saved product
//   if (
//     savedValue &&
//     typeof savedValue === "object"
//   ) {
//     savedQuantity =
//       savedValue?.quantity ?? "";

//     if (
//       savedValue?.rate !== undefined &&
//       savedValue?.rate !== ""
//     ) {
//       savedRate =
//         Number(savedValue.rate);
//     }
//   } else if (
//     savedValue !== undefined &&
//     savedValue !== null &&
//     savedValue !== ""
//   ) {
//     savedQuantity = savedValue;
//   }

//   setProductQuantity(
//     savedQuantity === ""
//       ? ""
//       : String(savedQuantity)
//   );

//   setProductRate(
//     savedRate === 0
//       ? ""
//       : String(savedRate)
//   );
// };


// // ==========================================================
// // QUANTITY CHANGE
// // ==========================================================

// const handleQuantityChange = (event) => {
//   const value = event.target.value;

//   setProductQuantity(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         value === ""
//           ? ""
//           : Number(value),

//       rate:
//         previous[productId]?.rate ??
//         Number(selectedProduct.rate || 0),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };


// // ==========================================================
// // RATE CHANGE
// // ==========================================================

// const handleRateChange = (event) => {
//   const value = event.target.value;

//   setProductRate(value);

//   if (!selectedProduct) {
//     return;
//   }

//   const productId =
//     String(selectedProduct.value);

//   setProductQuantities((previous) => ({
//     ...previous,

//     [productId]: {
//       ...(previous[productId] || {}),

//       quantity:
//         previous[productId]?.quantity ??
//         Number(productQuantity || 0),

//       rate:
//         value === ""
//           ? ""
//           : Number(value),

//       detailId:
//         previous[productId]?.detailId || "",
//     },
//   }));
// };
//   // ==========================================================
//   // PAGE NUMBER
//   // ==========================================================

//   const [pageNo, setPageNo] = useState(1);

//   const pageSize = 10;

//   // ==========================================================
//   // FETCH PRODUCT MASTER - REGULAR RATE
//   // ==========================================================
//   const fetchProduct = async () => {
//     try {
//       setLoadingProducts(true);

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
//       );

//       if (!response.ok) {
//         throw new Error(`Product API failed: ${response.status}`);
//       }

//       const data = await response.json();

//       console.log("PRODUCT MASTER API RESPONSE:", data);

//       const productData = Array.isArray(data) ? data : [];

//       const options = productData
//         .filter(
//           (item) =>
//             item?.ProductName !== null &&
//             item?.ProductName !== undefined &&
//             String(item.ProductName).trim() !== "",
//         )
//         .map((item) => ({
//           value: Number(item?.Id ?? item?.ProductId ?? 0),

//           label: String(item?.ProductName ?? item?.Name ?? "").trim(),

//           productCode:
//             item?.ProductCode ??
//             item?.Code ??
//             item?.ProductCodeNo ??
//             item?.Id ??
//             "",

//           // ==================================================
//           // REGULAR RATE
//           // If Rate exists and > 0, use Rate.
//           // Otherwise use PurchasePrice.
//           // ==================================================
//           rate: Number(
//             Number(item?.Rate) > 0 ? item?.Rate : (item?.PurchasePrice ?? 0),
//           ),
//         }));

//       console.log("PRODUCT OPTIONS WITH RATE:", options);

//       setProductOptions(options);
//     } catch (error) {
//       console.error("Product API Error:", error);

//       toast.error("Product data could not be loaded");
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   // ==========================================================
//   // FETCH ALL DAILY STOCK HEADER RECORDS
//   // ==========================================================
//   const fetchDailyStockHeaders = async () => {
//     try {
//       console.log("====================================");
//       console.log("FETCHING ALL DAILY STOCK HEADERS");
//       console.log("====================================");

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
//         throw new Error(`Daily Stock Header API failed: ${response.status}`);
//       }

//       let result;

//       try {
//         result = rawText ? JSON.parse(rawText) : [];
//       } catch (error) {
//         console.error("DAILY STOCK HEADER JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
//       }

//       console.log("DAILY STOCK HEADER API RESPONSE:", result);

//       // ======================================================
//       // NORMALIZE API RESPONSE
//       // ======================================================

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//       console.log("ALL DAILY STOCK HEADER RECORDS:", data);

//       // ======================================================
//       // MAP DATA
//       // ======================================================

//      const mappedData = data
//   // ==========================================================
//   // DAILY STOCK SHOP ENTRIES ONLY
//   // Main Office = O
//   // Shop       = S
//   // ==========================================================
//   .filter((item) => {
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     return locationType === "S";
//   })

//   .map((item) => {
//     // ========================================================
//     // HEADER ID
//     // ========================================================
//     const id =
//       item?.Id ??
//       item?.id ??
//       item?.DailyStockHeaderId ??
//       item?.HeaderId ??
//       "";

//     // ========================================================
//     // DATE
//     // ========================================================
//     const entryDate =
//       item?.EntryDate ??
//       item?.entryDate ??
//       item?.Date ??
//       item?.date ??
//       "";

//     // ========================================================
//     // SHOP NAME
//     //
//     // API response मध्ये ShopName नसल्यास
//     // Daily Stock Shop साठी fixed name वापरू
//     // ========================================================
//     const shopName =
//       item?.ShopName ??
//       item?.AccountName ??
//       item?.Shop ??
//       item?.shop ??
//       item?.Name ??
//       "Stock Entry Shop";

//     // ========================================================
//     // TOTAL AMOUNT
//     // ========================================================
//     const totalAmount = Number(
//       item?.TotalAmount ??
//         item?.totalAmount ??
//         item?.Total ??
//         item?.total ??
//         0
//     );

//     // ========================================================
//     // LOCATION TYPE
//     // ========================================================
//     const locationType = String(
//       item?.LocationType ??
//         item?.locationType ??
//         "S"
//     )
//       .trim()
//       .toUpperCase();

//     // ========================================================
//     // SHOP ID
//     // ========================================================
//     const shopId =
//       item?.ShopId ??
//       item?.shopId ??
//       item?.LocationId ??
//       item?.locationId ??
//       "";

//     // ========================================================
//     // FINAL MAPPED OBJECT
//     // ========================================================
//     return {
//       ...item,

//       // Header ID
//       Id: id,
//       id: id,
//       HeaderId: id,

//       // Date
//       EntryDate: entryDate,
//       dateText: entryDate
//         ? formatDate(entryDate)
//         : "",

//       // Shop
//       ShopName: shopName,
//       shop: shopName,

//       // Shop / Location
//       ShopId: shopId,
//       shopId: shopId,
//       LocationId: shopId,

//       // Location Type
//       LocationType: locationType,

//       // Total
//       TotalAmount: totalAmount,
//       total: totalAmount,
//     };
//   });

// console.log(
//   "=========================================="
// );
// console.log(
//   "DAILY STOCK SHOP MAPPED DATA"
// );
// console.log(
//   "=========================================="
// );
// console.log(
//   "TOTAL SHOP RECORDS:",
//   mappedData.length
// );
// console.log(
//   "MAPPED DAILY STOCK SHOP RECORDS:",
//   mappedData
// );

// // ==========================================================
// // SET TABLE DATA
// // ==========================================================
// setStockEntries(mappedData);

// // Reset pagination
// setPageNo(1);

// return mappedData;

//       console.log("MAPPED DAILY STOCK HEADER RECORDS:", mappedData);

//       // ======================================================
//       // SET TABLE DATA
//       // ======================================================

//       setStockEntries(mappedData);

//       // Page reset
//       setPageNo(1);

//       return mappedData;
//     } catch (error) {
//       console.error("FETCH ALL DAILY STOCK HEADER ERROR:", error);

//       toast.error(
//         error?.message || "Daily Stock Header data could not be loaded",
//       );

//       setStockEntries([]);

//       return [];
//     }
//   };

//   const fetchDailyStockDetail = async (headerId) => {
//     try {
//       const id = Number(headerId);

//       console.log("DAILY STOCK HEADER ID:", id);

//       if (!id) {
//         throw new Error("Daily Stock Header ID not found");
//       }

//       const url = `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${id}`;

//       console.log("DAILY STOCK DETAIL GET URL:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       console.log("DETAIL GET STATUS:", response.status);
//       console.log("DETAIL GET STATUS TEXT:", response.statusText);

//       const text = await response.text();

//       console.log("DETAIL GET RAW RESPONSE:", text);

//       let result;

//       try {
//         result = JSON.parse(text);
//       } catch (error) {
//         console.error("DETAIL GET JSON PARSE ERROR:", error);

//         throw new Error(`Invalid Daily Stock Detail API response: ${text}`);
//       }

//       console.log("DAILY STOCK DETAIL API RESPONSE:", result);

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             `Daily Stock Detail API failed: ${response.status}`,
//         );
//       }

//       if (result?.success === false) {
//         throw new Error(
//           result?.message || "Daily Stock Detail data could not be loaded",
//         );
//       }

//       let data = [];

//       if (Array.isArray(result)) {
//         data = result;
//       } else if (Array.isArray(result?.data)) {
//         data = result.data;
//       } else if (result?.data && typeof result.data === "object") {
//         data = [result.data];
//       } else if (result && typeof result === "object" && result?.Id) {
//         data = [result];
//       }

//     const mappedData = data.map((item) => ({
//   Id: Number(
//     item?.Id ??
//     item?.id ??
//     0
//   ),

//   DailyStockHeaderId: Number(
//     item?.DailyStockHeaderId ??
//     item?.dailyStockHeaderId ??
//     headerId ??
//     0
//   ),

//   ProductId: Number(
//     item?.ProductId ??
//     item?.ProductID ??
//     item?.productId ??
//     item?.productID ??
//     item?.product_id ??
//     0
//   ),

//   Quantity: Number(
//     item?.Quantity ??
//     item?.quantity ??
//     item?.Qty ??
//     item?.qty ??
//     0
//   ),

//   Rate: Number(
//     item?.Rate ??
//     item?.rate ??
//     item?.Price ??
//     item?.price ??
//     0
//   ),

//   Amount: Number(
//     item?.Amount ??
//     item?.amount ??
//     0
//   ),
// }));

//       console.log("DAILY STOCK DETAIL FINAL DATA:", mappedData);

//       return mappedData;
//     } catch (error) {
//       console.error("Daily Stock Detail API Error:", error);

//       toast.error(
//         error?.message || "Daily Stock Detail data could not be loaded",
//       );

//       return [];
//     }
//   };

//   const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
//     try {
//       // ============================================================
//       // 1. VALIDATE HEADER ID
//       // ============================================================

//       const id = Number(headerId);

//       console.log("========== DAILY STOCK HEADER UPDATE ==========");
//       console.log("HEADER ID:", id);
//       console.log("ENTRY DATE:", entryDate);
//       console.log("TOTAL AMOUNT:", totalAmount);

//       if (!Number.isInteger(id) || id <= 0) {
//         throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
//       }

//       // ============================================================
//       // 2. FORMAT DATE
//       // API ला YYYY-MM-DD format मध्ये date पाठवा
//       // ============================================================

//       let formattedEntryDate = "";

//       if (entryDate) {
//         if (typeof entryDate === "string") {
//           // Already YYYY-MM-DD
//           if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
//             formattedEntryDate = entryDate;
//           }

//           // DD-MM-YYYY
//           else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
//             const [day, month, year] = entryDate.split("-");

//             formattedEntryDate = `${year}-${month}-${day}`;
//           }

//           // Try Date parsing
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

//       if (!formattedEntryDate) {
//         throw new Error(`Invalid EntryDate: ${entryDate}`);
//       }

//       console.log("FORMATTED ENTRY DATE:", formattedEntryDate);

//       // ============================================================
//       // 3. TOTAL AMOUNT
//       // ============================================================

//       const amount = Number(totalAmount || 0);

//       if (isNaN(amount)) {
//         throw new Error(`Invalid TotalAmount: ${totalAmount}`);
//       }

//       // ============================================================
//       // 4. SHOP ID
//       // ============================================================

//       const shopId = Number(STOCK_ENTRY_SHOP_ID);

//       if (!Number.isInteger(shopId) || shopId <= 0) {
//         throw new Error(`Invalid ShopId: ${STOCK_ENTRY_SHOP_ID}`);
//       }

//       // ============================================================
//       // 5. UPDATED BY
//       // ============================================================

//       const updatedBy = Number(CREATED_BY);

//       if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
//         throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
//       }

//       // ============================================================
//       // 6. CREATE FORM DATA
//       // ============================================================

//       const updateData = new URLSearchParams();

//       updateData.append("Id", String(id));
//       updateData.append("EntryDate", formattedEntryDate);
//       updateData.append("ShopId", String(shopId));

//       // Existing record मध्ये OfficeId NULL आहे,
//       // म्हणून blank ठेवत आहोत.

//       updateData.append("TotalAmount", String(amount));

//       updateData.append("UpdatedBy", String(updatedBy));

//       // ============================================================
//       // 7. LOG EXACT REQUEST
//       // ============================================================

//       console.log(
//         "DAILY STOCK HEADER UPDATE PAYLOAD:",
//         Object.fromEntries(updateData.entries()),
//       );

//       // ============================================================
//       // 8. API CALL
//       // ============================================================

//       const apiUrl =
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

//       console.log("DAILY STOCK HEADER UPDATE URL:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

//           Accept: "application/json",
//         },

//         body: updateData,

//         redirect: "follow",
//       });

//       // ============================================================
//       // 9. READ RAW RESPONSE
//       // IMPORTANT FOR 500 ERROR
//       // ============================================================

//       console.log("HEADER UPDATE STATUS:", response.status);

//       console.log("HEADER UPDATE STATUS TEXT:", response.statusText);

//       const rawResponse = await response.text();

//       console.log("HEADER UPDATE RAW RESPONSE:", rawResponse);

//       // ============================================================
//       // 10. HTTP ERROR
//       // ============================================================

//       if (!response.ok) {
//         throw new Error(
//           `Daily Stock Header Update API failed: ${response.status}${
//             rawResponse ? ` - ${rawResponse}` : ""
//           }`,
//         );
//       }

//       // ============================================================
//       // 11. PARSE JSON
//       // ============================================================

//       let result;

//       try {
//         result = rawResponse ? JSON.parse(rawResponse) : {};
//       } catch (jsonError) {
//         console.error("HEADER UPDATE JSON PARSE ERROR:", jsonError);

//         throw new Error(`Invalid Header Update API response: ${rawResponse}`);
//       }

//       console.log("DAILY STOCK HEADER UPDATE RESPONSE:", result);

//       // ============================================================
//       // 12. CHECK API SUCCESS
//       // ============================================================

//       if (result?.success === false) {
//         throw new Error(result?.message || "Daily Stock Header update failed");
//       }

//       console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

//       return result;
//     } catch (error) {
//       console.error("❌ Daily Stock Header Update API Error:", error);

//       throw error;
//     }
//   };

//   // ==========================================================
//   // INITIAL API CALL
//   // ==========================================================

// useEffect(() => {
//   const loadStockData = async () => {
//     try {
//       await fetchProduct();
//       await fetchDailyStockHeaders();
//       await fetchMainOfficeStock(date);
//     } catch (error) {
//       console.error(
//         "ERROR LOADING DAILY STOCK DATA:",
//         error
//       );
//     }
//   };

//   if (date) {
//     loadStockData();
//   }
// }, [date]);



// useEffect(() => {
//   if (!productOptions || productOptions.length === 0) {
//     return;
//   }

//   setProductRates((prev) => {
//     const updated = { ...prev };

//     productOptions.forEach((product) => {
//       const productId = String(product.value);

//       // Existing manually changed rate असेल तर तोच ठेवा
//       if (updated[productId] === undefined) {
//         updated[productId] = Number(product.rate || 0);
//       }
//     });

//     return updated;
//   });
// }, [productOptions]);


//   // ==========================================================
//   // RESET FORM
//   // ==========================================================
//  const resetForm = () => {
//   setDate(new Date());

//   setProductQuantities({});

//   setSelectedProduct(null);

//   setProductQuantity("");

//   setProductRate("");

//   setEditingEntry(null);

//   setPhysicalQuantities({});

//   setProductSearch("");
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
//   // PRODUCT QUANTITY CHANGE
//   // ==========================================================

//  const handleProductQuantityChange = (productId, value) => {
//   const key = String(productId);

//   // ==========================================================
//   // PHYSICAL QUANTITY
//   // ==========================================================
//   setPhysicalQuantities((previous) => ({
//     ...previous,
//     [key]: value,
//   }));

//   // ==========================================================
//   // PRODUCT QUANTITY
//   // Keep rate + detailId while changing quantity
//   // ==========================================================
//   setProductQuantities((previous) => {
//     const existing = previous[key];

//     return {
//       ...previous,
//       [key]: {
//         ...(existing && typeof existing === "object"
//           ? existing
//           : {}),
//         quantity: value,
//       },
//     };
//   });
// };

//   // ==========================================================
//   // MAP DAILY STOCK HEADER DATA
//   // ==========================================================
//   const mappedStockEntries = useMemo(() => {
//     return stockEntries.map((item) => ({
//       ...item,

//       id: item?.Id || item?.id || "",

//       dateText: item?.EntryDate
//         ? formatDate(item.EntryDate)
//         : item?.dateText || "",

//       shop:
//         item?.ShopName ||
//         item?.AccountName ||
//         item?.Shop ||
//         item?.Name ||
//         item?.shop ||
//         "Stock Entry Shop",

//       total: Number(item?.TotalAmount ?? item?.total ?? 0),
//     }));
//   }, [stockEntries]);








//   // ==========================================================
//   // SAVE / UPDATE STOCK ENTRY SHOP
//   // ==========================================================

// const handleSave = async (skipComparisonPopup = false) => {
//   console.log("🔥🔥🔥 HANDLE SAVE CALLED 🔥🔥🔥");
//   console.log("skipComparisonPopup =", skipComparisonPopup);
//   console.log("physicalQuantities =", physicalQuantities);
//   console.log("productQuantities =", productQuantities);

//   // ==========================================================
//   // DATE VALIDATION
//   // ==========================================================
//   if (!date) {
//     toast.error("Please select Date");
//     return;
//   }

//   // ==========================================================
//   // CREATE DATE STRING
//   // ==========================================================
//   const entryDate = `${date.getFullYear()}-${String(
//     date.getMonth() + 1
//   ).padStart(2, "0")}-${String(
//     date.getDate()
//   ).padStart(2, "0")}`;

//   try {
//     setSaving(true);

//     // ==========================================================
//     // PREPARE SELECTED PRODUCTS
//     // ==========================================================

//    const selectedRows = productOptions.map((product) => {
//   const productId = String(product.value);

//   const savedValue = productQuantities?.[productId];

//   const physicalValue = physicalQuantities?.[productId];

//   const quantity =
//     physicalValue !== undefined &&
//     physicalValue !== ""
//       ? Number(physicalValue)
//       : savedValue &&
//         typeof savedValue === "object"
//       ? Number(savedValue?.quantity || 0)
//       : Number(savedValue || 0);

//   const detailId =
//     savedValue &&
//     typeof savedValue === "object"
//       ? savedValue?.detailId || ""
//       : "";

//   const rate =
//     savedValue &&
//     typeof savedValue === "object" &&
//     savedValue.rate !== undefined &&
//     savedValue.rate !== ""
//       ? Number(savedValue.rate)
//       : Number(
//           productRates?.[productId] ??
//           product.rate ??
//           0
//         );

//   return {
//     Id: detailId,

//     ProductId: Number(product.value),

//     ProductCode:
//       product.productCode || "",

//     ProductName:
//       product.label || "",

//     Quantity: quantity,

//     Rate: rate,

//     Amount: quantity * rate,
//   };
// });
      

//     console.log(
//       "=================================================="
//     );

//     console.log(
//       "FINAL SELECTED ROWS:",
//       selectedRows
//     );

//     console.log(
//       "=================================================="
//     );

//     // ==========================================================
//     // VALIDATE PRODUCTS
//     // ==========================================================
//     if (selectedRows.length === 0) {
//       toast.error(
//         "Please enter quantity for at least one product"
//       );

//       setSaving(false);
//       return;
//     }

//     // ==========================================================
//     // TOTAL AMOUNT
//     // ==========================================================
//     const totalAmount =
//       selectedRows.reduce(
//         (sum, row) =>
//           sum +
//           Number(row.Quantity || 0) *
//             Number(row.Rate || 0),
//         0
//       );

//     console.log(
//       "TOTAL AMOUNT:",
//       totalAmount
//     );

//    // ========================================================
// // STOCK COMPARISON LOGIC
// // ========================================================
// //
// // Main Office = Stock received from Main Office
// // Sold       = Actual Sales Entry quantity
// // Physical   = Quantity entered in Daily Stock
// //
// // Expected   = Main Office - Sold
// // Difference = Physical - Expected
// //
// // Example:
// // Main Office = 60
// // Sold       = 40
// // Expected   = 20
// // Physical   = 19
// // Difference = -1
// // ========================================================

//    if (!skipComparisonPopup) {

//   console.log(
//     "🔄 REFRESHING STOCK DATA BEFORE COMPARISON..."
//   );

//   // ========================================================
//   // LATEST MAIN OFFICE STOCK
//   // ========================================================
//   let latestMainOfficeQuantities = {};

//   // ========================================================
//   // LATEST SOLD QUANTITIES
//   // ========================================================
//   let latestSoldQuantities = {};

//   // ========================================================
//   // REFRESH MAIN OFFICE STOCK
//   // ========================================================
//   try {

//     latestMainOfficeQuantities =
//       await fetchMainOfficeStock(date);

//     console.log(
//       "LATEST MAIN OFFICE QUANTITIES:",
//       latestMainOfficeQuantities
//     );

//   } catch (error) {

//     console.error(
//       "MAIN OFFICE STOCK REFRESH ERROR:",
//       error
//     );

//     latestMainOfficeQuantities = {};
//   }

//   // ========================================================
//   // REFRESH SOLD QUANTITIES
//   // ========================================================
//   try {

//     latestSoldQuantities =
//       await fetchSoldQuantities(date);

//     console.log(
//       "LATEST SOLD QUANTITIES:",
//       latestSoldQuantities
//     );

//   } catch (error) {

//     console.error(
//       "SOLD QUANTITY REFRESH ERROR:",
//       error
//     );

//     latestSoldQuantities = {};
//   }

//   // ========================================================
//   // CREATE COMPARISON DATA
//   // ========================================================
// const comparisonData = selectedRows.map((row) => {
//   const productId = String(row.ProductId);

//   // ========================================================
//   // MAIN OFFICE STOCK
//   // ========================================================
//   const mainOfficeQty = Number(
//     latestMainOfficeQuantities?.[productId] ?? 0
//   );

//   // ========================================================
//   // ACTUAL SALES QUANTITY
//   // ========================================================
//   const soldQty = Number(
//     latestSoldQuantities?.[productId] ?? 0
//   );

//   // ========================================================
//   // PHYSICAL STOCK ENTERED BY USER
//   // ========================================================
//   const physicalQty = Number(
//     row.Quantity ?? 0
//   );

//   // ========================================================
//   // EXPECTED STOCK
//   // Main Office - Sold
//   // ========================================================
//   const expectedQty =
//     mainOfficeQty - soldQty;

//   // ========================================================
//   // DIFFERENCE
//   // Physical - Expected
//   // ========================================================
//   const difference =
//     physicalQty - expectedQty;

//   return {
//     ProductId: row.ProductId,

//     ProductCode:
//       row.ProductCode || "-",

//     ProductName:
//       row.ProductName || "-",

//     MainOffice:
//       mainOfficeQty,

//     Sold:
//       soldQty,

//     Expected:
//       expectedQty,

//     Physical:
//       physicalQty,

//     Difference:
//       difference,

//     Rate:
//       Number(row.Rate || 0),
//   };
// });

//   // ========================================================
//   // FINAL COMPARISON LOG
//   // ========================================================
//   console.log(
//     "======================================"
//   );

//   console.log(
//     "FINAL STOCK COMPARISON:",
//     comparisonData
//   );

//   console.log(
//     "======================================"
//   );

//   // ========================================================
//   // SET COMPARISON DATA
//   // ========================================================
//   setComparisonRows(
//     comparisonData
//   );

//   // ========================================================
//   // STOP SAVING LOADER
//   // ========================================================
//   setSaving(false);

//   // ========================================================
//   // OPEN COMPARISON POPUP
//   // ========================================================
//   setOpenComparisonPopup(true);

//   return;
// }

//     // ==========================================================
//     // ==========================================================
//     // ACTUAL API SAVE STARTS HERE
//     // ==========================================================
//     // ==========================================================

//     console.log(
//       "🚨🚨🚨 ACTUAL API SAVE BLOCK ENTERED 🚨🚨🚨"
//     );

//     console.log(
//       "skipComparisonPopup =",
//       skipComparisonPopup
//     );

//     // ==========================================================
//     // EDIT EXISTING ENTRY
//     // ==========================================================
//     if (editingEntry) {

//       const headerId =
//         editingEntry?.Id ||
//         editingEntry?.id;

//       if (!headerId) {
//         throw new Error(
//           "Stock Entry Shop Header ID not found"
//         );
//       }

//       console.log(
//         "UPDATING STOCK ENTRY SHOP:",
//         headerId
//       );

//       // ========================================================
//       // UPDATE HEADER
//       // ========================================================
//       await updateDailyStockHeader(
//         headerId,
//         entryDate,
//         totalAmount
//       );

//       console.log(
//         "STOCK ENTRY SHOP HEADER UPDATED:",
//         headerId
//       );

//       // ========================================================
//       // UPDATE / INSERT DETAILS
//       // ========================================================
//       for (const row of selectedRows) {

//         const detailId =
//           row?.Id ||
//           row?.id ||
//           "";

//         const quantity =
//           Number(row?.Quantity || 0);

//         const rate =
//           Number(row?.Rate || 0);

//         const amount =
//           quantity * rate;

//         // ======================================================
//         // UPDATE EXISTING DETAIL
//         // ======================================================
//         if (detailId) {

//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "Id",
//             String(Number(detailId))
//           );

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(
//               Number(row.ProductId)
//             )
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "UpdatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "UPDATE DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
//               {
//                 method: "POST",

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },

//                 body:
//                   detailData.toString(),
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL UPDATE RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Update API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail update failed"
//             );
//           }

//           console.log(
//             "DETAIL UPDATED SUCCESSFULLY:",
//             result
//           );
//         }

//         // ======================================================
//         // INSERT NEW DETAIL
//         // ======================================================
//         else {

//           const detailData =
//             new URLSearchParams();

//           detailData.append(
//             "DailyStockHeaderId",
//             String(Number(headerId))
//           );

//           detailData.append(
//             "ProductId",
//             String(
//               Number(row.ProductId)
//             )
//           );

//           detailData.append(
//             "Quantity",
//             String(quantity)
//           );

//           detailData.append(
//             "Rate",
//             String(rate)
//           );

//           detailData.append(
//             "Amount",
//             String(amount)
//           );

//           detailData.append(
//             "CreatedBy",
//             String(CREATED_BY)
//           );

//           console.log(
//             "INSERT DETAIL PAYLOAD:",
//             Object.fromEntries(
//               detailData.entries()
//             )
//           );

//           const response =
//             await fetch(
//               "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//               {
//                 method: "POST",

//                 headers: {
//                   Accept:
//                     "application/json",

//                   "Content-Type":
//                     "application/x-www-form-urlencoded;charset=UTF-8",
//                 },

//                 body:
//                   detailData.toString(),
//               }
//             );

//           const text =
//             await response.text();

//           console.log(
//             "DETAIL INSERT RESPONSE:",
//             text
//           );

//           let result = {};

//           try {
//             result =
//               text
//                 ? JSON.parse(text)
//                 : {};
//           } catch {
//             throw new Error(
//               `Invalid Detail Insert API response: ${text}`
//             );
//           }

//           if (
//             !response.ok ||
//             result?.success === false
//           ) {
//             throw new Error(
//               result?.message ||
//                 "Daily Stock Detail insert failed"
//             );
//           }

//           console.log(
//             "DETAIL INSERTED SUCCESSFULLY:",
//             result
//           );
//         }
//       }

//       // ========================================================
//       // UPDATE LOCAL TABLE
//       // ========================================================
//       setStockEntries(
//         (previous) =>
//           previous.map((item) => {

//             const itemId =
//               item?.Id ||
//               item?.id;

//             if (
//               String(itemId) !==
//               String(headerId)
//             ) {
//               return item;
//             }

//             return {
//               ...item,

//               EntryDate:
//                 entryDate,

//               dateText:
//                 formatDate(entryDate),

//               TotalAmount:
//                 Number(
//                   totalAmount || 0
//                 ),

//               total:
//                 Number(
//                   totalAmount || 0
//                 ),
//             };
//           })
//       );

//       toast.success(
//         "Stock Entry Shop updated successfully!"
//       );
//     }

//     // ==========================================================
//     // NEW ENTRY
//     // ==========================================================
//     else {

//       // ========================================================
//       // HEADER DATA
//       // ========================================================
//       const headerData =
//         new URLSearchParams();

//       headerData.append(
//         "EntryDate",
//         String(entryDate)
//       );

//       headerData.append(
//         "ShopId",
//         String(STOCK_ENTRY_SHOP_ID)
//       );

//       headerData.append(
//         "OfficeId",
//         ""
//       );

//       headerData.append(
//         "TotalAmount",
//         String(
//           Number(totalAmount || 0)
//         )
//       );

//       headerData.append(
//         "CreatedBy",
//         String(CREATED_BY)
//       );

//       console.log(
//         "STOCK ENTRY SHOP HEADER DATA:",
//         Object.fromEntries(
//           headerData.entries()
//         )
//       );

//       // ========================================================
//       // HEADER API
//       // ========================================================
//       const headerResponse =
//         await fetch(
//           "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
//           {
//             method: "POST",

//             mode: "cors",

//             credentials: "omit",

//             headers: {
//               Accept:
//                 "application/json",

//               "Content-Type":
//                 "application/x-www-form-urlencoded;charset=UTF-8",
//             },

//             body:
//               headerData.toString(),
//           }
//         );

//       const headerText =
//         await headerResponse.text();

//       console.log(
//         "HEADER RESPONSE:",
//         headerText
//       );

//       let headerResult = {};

//       try {
//         headerResult =
//           headerText
//             ? JSON.parse(headerText)
//             : {};
//       } catch {
//         throw new Error(
//           `Invalid Header API response: ${headerText}`
//         );
//       }

//       if (
//         !headerResponse.ok ||
//         !headerResult?.success
//       ) {
//         throw new Error(
//           headerResult?.message ||
//             "Daily Stock Header save failed"
//         );
//       }

//       const headerId =
//         headerResult?.Id ??
//         headerResult?.id ??
//         headerResult?.insert_id ??
//         headerResult?.DailyStockHeaderId ??
//         headerResult?.data?.Id ??
//         headerResult?.data?.id;

//       if (!headerId) {
//         throw new Error(
//           "Header created but Header ID was not returned."
//         );
//       }

//       console.log(
//         "CREATED HEADER ID:",
//         headerId
//       );

//       // ========================================================
//       // SAVE DETAILS
//       // ========================================================
//       for (const row of selectedRows) {

//         const detailData =
//           new URLSearchParams();

//         detailData.append(
//           "DailyStockHeaderId",
//           String(Number(headerId))
//         );

//         detailData.append(
//           "ProductId",
//           String(
//             Number(row.ProductId)
//           )
//         );

//         detailData.append(
//           "Quantity",
//           String(
//             Number(row.Quantity || 0)
//           )
//         );

//         detailData.append(
//           "Rate",
//           String(
//             Number(row.Rate || 0)
//           )
//         );

//         detailData.append(
//           "Amount",
//           String(
//             Number(row.Amount || 0)
//           )
//         );

//         detailData.append(
//           "CreatedBy",
//           String(CREATED_BY)
//         );

//         console.log(
//           "DETAIL SAVE PAYLOAD:",
//           Object.fromEntries(
//             detailData.entries()
//           )
//         );

//         const detailResponse =
//           await fetch(
//             "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
//             {
//               method: "POST",

//               headers: {
//                 Accept:
//                   "application/json",

//                 "Content-Type":
//                   "application/x-www-form-urlencoded",
//               },

//               body:
//                 detailData.toString(),
//             }
//           );

//         const detailText =
//           await detailResponse.text();

//         console.log(
//           "DETAIL RESPONSE:",
//           detailText
//         );

//         let detailResult = {};

//         try {
//           detailResult =
//             detailText
//               ? JSON.parse(detailText)
//               : {};
//         } catch {
//           throw new Error(
//             `Invalid Detail API response: ${detailText}`
//           );
//         }

//         if (
//           !detailResponse.ok ||
//           detailResult?.success === false
//         ) {
//           throw new Error(
//             detailResult?.message ||
//               "Daily Stock Detail save failed"
//           );
//         }

//         console.log(
//           "DETAIL SAVED SUCCESSFULLY:",
//           detailResult
//         );
//       }

//       // ========================================================
//       // ADD NEW RECORD TO TABLE
//       // ========================================================
//       const newEntry = {

//         Id:
//           Number(headerId),

//         id:
//           Number(headerId),

//         EntryDate:
//           entryDate,

//         dateText:
//           formatDate(entryDate),

//         ShopId:
//           STOCK_ENTRY_SHOP_ID,

//         OfficeId:
//           null,

//         LocationType:
//           "S",

//         ShopName:
//           "Stock Entry Shop",

//         shop:
//           "Stock Entry Shop",

//         TotalAmount:
//           Number(
//             totalAmount || 0
//           ),

//         total:
//           Number(
//             totalAmount || 0
//           ),
//       };

//       setStockEntries(
//         (previous) => [
//           newEntry,
//           ...previous,
//         ]
//       );

//       toast.success(
//         "Stock Entry Shop saved successfully!"
//       );
//     }

//     // ==========================================================
//     // CLOSE FORM AFTER ACTUAL SAVE
//     // ==========================================================
//     setOpenForm(false);

//     resetForm();

//     setPageNo(1);

//     // ==========================================================
//     // REFRESH TABLE
//     // ==========================================================
//     await fetchDailyStockHeaders();

//   } catch (error) {

//     console.error(
//       "STOCK ENTRY SHOP SAVE ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to save Stock Entry Shop"
//     );

//   } finally {

//     setSaving(false);
//   }
// };

//   // ==========================================================
//   // DELETE MAIN ENTRY
//   // ==========================================================

//   // ==========================================================
//   // EDIT STOCK ENTRY SHOP
//   // ==========================================================
//   // ==========================================================
// // EDIT STOCK ENTRY SHOP
// // ==========================================================


// const handleEditEntry = async (entry) => {
//   try {
//     console.log("====================================");
//     console.log("EDIT STOCK ENTRY SHOP");
//     console.log("ENTRY:", entry);
//     console.log("====================================");

//     // --------------------------------------------------
//     // HEADER ID
//     // --------------------------------------------------
//     const headerId =
//       entry?.Id ??
//       entry?.id ??
//       entry?.DailyStockHeaderId;

//     if (!headerId) {
//       toast.error(
//         "Stock Entry Shop Header ID not found"
//       );
//       return;
//     }

//     console.log(
//       "EDIT HEADER ID:",
//       headerId
//     );

//     // --------------------------------------------------
//     // SET EDITING ENTRY
//     // --------------------------------------------------
//     setEditingEntry({
//       ...entry,
//       Id: Number(headerId),
//       id: Number(headerId),
//     });

//     // --------------------------------------------------
//     // SET DATE
//     // --------------------------------------------------
//     const entryDate =
//       entry?.EntryDate ??
//       entry?.entryDate ??
//       entry?.date;

//     if (entryDate) {
//       const parsedDate = new Date(entryDate);

//       if (!isNaN(parsedDate.getTime())) {
//         setDate(parsedDate);
//       }
//     }

//     // --------------------------------------------------
//     // CLEAR OLD QUANTITIES
//     // --------------------------------------------------
//     setProductQuantities({});

//     // --------------------------------------------------
//     // OPEN FORM
//     // --------------------------------------------------
//     setOpenForm(true);

//     // --------------------------------------------------
//     // IMPORTANT:
//     // FETCH DETAILS USING HEADER ID
//     // --------------------------------------------------
//     const details =
//       await fetchDailyStockDetail(headerId);

//     console.log(
//       "EDIT DAILY STOCK DETAILS:",
//       details
//     );

//     if (!Array.isArray(details)) {
//       console.error(
//         "Invalid detail response:",
//         details
//       );

//       toast.error(
//         "Daily Stock details not found"
//       );

//       return;
//     }

//     // --------------------------------------------------
//     // CREATE PRODUCT QUANTITY MAP
//     // --------------------------------------------------
//     const quantityMap = {};

//     details.forEach((item) => {
//       const productId =
//         item?.ProductId ??
//         item?.productId;

//       if (
//         productId === null ||
//         productId === undefined ||
//         String(productId).trim() === ""
//       ) {
//         return;
//       }

//       const detailId =
//         item?.Id ??
//         item?.id ??
//         item?.DailyStockDetailId ??
//         "";

//       const quantity = Number(
//         item?.Quantity ??
//         item?.quantity ??
//         0
//       );

//       const rate = Number(
//         item?.Rate ??
//         item?.rate ??
//         0
//       );

//       quantityMap[String(productId)] = {
//         quantity: quantity,
//         rate: rate,
//         detailId: detailId,
//       };
//     });

//     console.log(
//       "EDIT PRODUCT QUANTITY MAP:",
//       quantityMap
//     );

//     // --------------------------------------------------
//     // SET EXISTING DATA
//     // --------------------------------------------------
//     setProductQuantities(quantityMap);


    

//     // ==========================================================
// // ALSO SET PHYSICAL QUANTITIES FOR EDIT MODE
// // ==========================================================
// const physicalMap = {};

// Object.keys(quantityMap).forEach((productId) => {
//   physicalMap[productId] =
//     quantityMap[productId]?.quantity ?? "";
// });

// setPhysicalQuantities(physicalMap);

//     // --------------------------------------------------
//     // ALSO UPDATE PRODUCT MASTER RATE
//     // --------------------------------------------------
//     setProductOptions((previousProducts) =>
//       previousProducts.map((product) => {
//         const saved =
//           quantityMap[
//             String(product.value)
//           ];

//         if (!saved) {
//           return product;
//         }

//         return {
//           ...product,
//           rate:
//             saved.rate !== undefined
//               ? saved.rate
//               : product.rate,
//         };
//       })
//     );

//   } catch (error) {
//     console.error(
//       "EDIT STOCK ENTRY SHOP ERROR:",
//       error
//     );

//     toast.error(
//       error?.message ||
//         "Unable to load Stock Entry Shop"
//     );
//   }
// };

//   // const handleDeleteEntry = (id) => {
//   //   setStockEntries((previousEntries) =>
//   //     previousEntries.filter((item) => item.id !== id),
//   //   );

//   //   toast.success("Entry removed successfully");
//   // };

//   const handleDeleteEntry = async (id) => {
//     if (!id) {
//       toast.error("Stock Entry ID not found");
//       return;
//     }

//     try {
//       setSaving(true);

//       const deleteUrl =
//         `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
//         `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

//       console.log("DELETE STOCK ENTRY SHOP URL:", deleteUrl);

//       const response = await fetch(deleteUrl, {
//         method: "GET",
//         redirect: "follow",
//       });

//       const resultText = await response.text();

//       console.log("DELETE API STATUS:", response.status);

//       console.log("DELETE API RESPONSE:", resultText);

//       if (!response.ok) {
//         throw new Error(`Delete API failed: ${response.status}`);
//       }

//       // Remove from UI after successful API delete
//       setStockEntries((previousEntries) =>
//         previousEntries.filter((item) => Number(item.id) !== Number(id)),
//       );

//       toast.success("Stock Entry Shop deleted successfully");
//     } catch (error) {
//       console.error("Delete Stock Entry Shop Error:", error);

//       toast.error(error?.message || "Unable to delete Stock Entry Shop");
//     } finally {
//       setSaving(false);
//     }
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
//       // ====================================================
//       // SR NO
//       // ====================================================

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

//         header: "Shop",

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
//             <b>Stock Entry Shop </b>
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
//               CREATE DAILY STOCK ENTRY
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
//               Stock Entry Shop
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
//               {/* ==================================================
//       STOCK ENTRY SHOP
//   ================================================== */}
//               <Box>
//                 <Typography fontWeight={600} mb={0.5} fontSize="14px">
//                   Stock Entry Shop:
//                 </Typography>

//                 <TextField
//                   size="small"
//                   fullWidth
//                   value="Stock Entry Shop"
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "#fafafa",
//                       borderRadius: "5px",
//                     },

//                     "& .MuiInputBase-input": {
//                       fontSize: "14px",
//                       fontWeight: 500,
//                     },
//                   }}
//                 />
//               </Box>

//               {/* ==================================================
//       DATE
//   ================================================== */}
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

//             {/* =========================================================
//     PRODUCT SELECTION / QUANTITY / RATE / ADD
//     NOT REQUIRED FOR STOCK ENTRY SHOP
//     Products are shown directly in the table below.
// ========================================================= */}


//  {/* ==========================================================
//     PRODUCT SEARCH
// ========================================================== */}
// <Box sx={{ mb: 2 }}>
//   <Typography
//     fontWeight={600}
//     mb={0.5}
//     fontSize="14px"
//   >
//     Product:
//   </Typography>

//   <TextField
//     fullWidth
//     size="small"
//     value={productSearch}
//     onChange={(e) => {
//       setProductSearch(e.target.value);
//     }}
//     placeholder="Search Product / Code"
//     sx={{
//       "& .MuiOutlinedInput-root": {
//         borderRadius: "6px",
//         backgroundColor: "#fff",
//       },

//       "& .MuiInputBase-input": {
//         fontSize: "15px",
//       },
//     }}
//   />
// </Box>

//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #d0d0d0",
//                 borderRadius: "6px",
//                 overflowX: "hidden",
//                 overflowY: "visible",
//               }}
//             >
//               <Table
//                 size="small"
//                 sx={{
//                   width: "100%",
//                   tableLayout: "fixed",

//                   "& .MuiTableCell-root": {
//                     border: "1px solid #d0d0d0",
//                   },
//                 }}
//               >
//                 {/* =====================================================
//         TABLE HEADER
//     ===================================================== */}
//       <TableHead>
//   <TableRow
//     sx={{
//       backgroundColor: "#e9ecef",
//     }}
//   >
//     {/* PRODUCT CODE */}
//     <TableCell
//       sx={{
//         width: "18%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Code
//     </TableCell>

//     {/* PRODUCT NAME */}
//     <TableCell
//       sx={{
//         width: "42%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Product Name
//     </TableCell>

//     {/* QUANTITY */}
//     <TableCell
//       align="center"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Quantity
//     </TableCell>

//     {/* RATE */}
//     <TableCell
//       align="right"
//       sx={{
//         width: "20%",
//         fontWeight: 700,
//         fontSize: "14px",
//         whiteSpace: "nowrap",
//       }}
//     >
//       Rate
//     </TableCell>
//   </TableRow>
// </TableHead>

//                 {/* =====================================================
//         TABLE BODY
//     ===================================================== */}

// <TableBody>
//   {loadingProducts ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         Loading Products...
//       </TableCell>
//     </TableRow>
//   ) : filteredProductOptions.length === 0 ? (
//     <TableRow>
//       <TableCell
//         colSpan={4}
//         align="center"
//         sx={{ py: 4 }}
//       >
//         No Products Found
//       </TableCell>
//     </TableRow>
//   ) : (
//     filteredProductOptions.map((product) => {
//       const savedValue =
//         productQuantities[
//           String(product.value)
//         ];

//       // ================================
//       // DEFAULT QUANTITY = 0
//       // ================================
//       const quantity =
//         savedValue &&
//         typeof savedValue === "object"
//           ? savedValue?.quantity ?? 0
//           : savedValue ?? 0;

//       // ================================
//       // CURRENT RATE
//       // ================================
//       const rate =
//         productRates[
//           String(product.value)
//         ] ?? Number(product.rate || 0);

//       return (
//         <TableRow
//           key={String(product.value)}
//           hover
//         >

//           {/* PRODUCT CODE */}
//           <TableCell>
//             {product.productCode || "-"}
//           </TableCell>

//           {/* PRODUCT NAME */}
//           <TableCell>
//             {product.label || "-"}
//           </TableCell>

//           {/* ============================
//               QUANTITY
//           ============================ */}
//           <TableCell align="center">
//             <TextField
//               type="number"
//               size="small"

//               value={quantity}

//               onChange={(e) => {
//                 handleProductQuantityChange(
//                   product.value,
//                   e.target.value
//                 );
//               }}

//               onKeyDown={(e) => {
//                 handleQuantityKeyDown(
//                   e,
//                   product.value
//                 );
//               }}

//               inputRef={(input) => {
//                 quantityInputRefs.current[
//                   String(product.value)
//                 ] = input;
//               }}

//              inputProps={{
//   min: 0,
//   onWheel: preventNumberInputScroll,
// }}

//               sx={{
//                 width: 110,

//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "6px",
//                   backgroundColor: "#fff",
//                 },

//                 "& .MuiInputBase-input": {
//                   textAlign: "center",
//                   fontSize: "15px",
//                 },
//               }}
//             />
//           </TableCell>

//           {/* ============================
//               EDITABLE RATE
//           ============================ */}
//           <TableCell align="center">
//             <TextField
//               type="number"
//               size="small"

//               value={rate}

//               onChange={(e) => {
//                 const value =
//                   e.target.value;

//                 setProductRates((prev) => ({
//                   ...prev,

//                   [String(product.value)]:
//                     value === ""
//                       ? 0
//                       : Number(value),
//                 }));
//               }}

//              inputProps={{
//   min: 0,
//   onWheel: preventNumberInputScroll,
// }}

//               sx={{
//                 width: 110,

//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "6px",
//                   backgroundColor: "#fff",
//                 },

//                 "& .MuiInputBase-input": {
//                   textAlign: "right",
//                   fontSize: "15px",
//                 },
//               }}
//             />
//           </TableCell>

//         </TableRow>
//       );
//     })
//   )}
// </TableBody>

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
//             ></Box>
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
//   variant="contained"
//   disabled={saving}
//   onClick={() => handleSave(false)}
//   sx={{
//     textTransform: "none",
//     background: "var(--primary-color)",

//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
// >
//   {saving ? "Saving..." : "Save"}
// </Button>
              

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

//         {/* ==========================================================
//     STOCK COMPARISON REPORT
// ========================================================== */}

// <Dialog
//   open={openReport}
//   onClose={() => setOpenReport(false)}
//   fullWidth
//   maxWidth="xl"
//   PaperProps={{
//     sx: {
//       borderRadius: "8px",
//       maxHeight: "90vh",
//     },
//   }}
// >
//   {/* REPORT HEADER */}
//   <DialogTitle
//     sx={{
//       backgroundColor: "rgb(236, 253, 230)",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       borderBottom: "1px solid #ddd",
//       fontWeight: 700,
//       color: "#0B5E20",
//     }}
//   >
//     <Typography
//       sx={{
//         fontWeight: 700,
//         fontSize: "20px",
//       }}
//     >
//       Daily Stock Comparison Report
//     </Typography>

//     <IconButton
//       onClick={() => setOpenReport(false)}
//     >
//       <CloseIcon />
//     </IconButton>
//   </DialogTitle>

//   {/* REPORT CONTENT */}
//   <DialogContent dividers>
//     <TableContainer
//       component={Paper}
//       elevation={0}
//       sx={{
//         border: "1px solid #d0d0d0",
//         borderRadius: "6px",
//         overflowX: "auto",
//       }}
//     >
//       <Table
//         size="small"
//         sx={{
//           minWidth: 1000,

//           "& .MuiTableCell-root": {
//             border: "1px solid #d0d0d0",
//           },
//         }}
//       >
//     <TableHead>
//   <TableRow>

//     <TableCell>
//       Product Code
//     </TableCell>

//     <TableCell>
//       Product Name
//     </TableCell>

//     <TableCell align="center">
//       Main Office
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Expected
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Physical
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{
//         fontWeight: 700,
//       }}
//     >
//       Difference
//     </TableCell>

//   </TableRow>
// </TableHead>

//      <TableBody>
//   {productOptions.map((product) => {

//     const productId = String(product.value);

//     const savedValue =
//       productQuantities?.[productId];

//     const quantity =
//       typeof savedValue === "object"
//         ? savedValue?.quantity ?? ""
//         : savedValue ?? "";

//     const rate =
//       product.rate ??
//       product.SaleRate ??
//       product.Price ??
//       "";

//     return (
//       <TableRow
//         key={productId}
//         hover
//       >

//         <TableCell>
//           {product.productCode || "-"}
//         </TableCell>

//         <TableCell>
//           {product.label || "-"}
//         </TableCell>

//         <TableCell align="center">
//           <TextField
//             size="small"
//             type="number"
//             value={quantity}
//             placeholder="Enter Qty"
//             onChange={(e) => {
//               handleProductQuantityChange(
//                 product.value,
//                 e.target.value
//               );
//             }}
//            inputProps={{
//   min: 0,
//   onWheel: preventNumberInputScroll,
// }}
//             sx={{
//               width: "110px",
//               "& input": {
//                 textAlign: "center",
//               },
//             }}
//           />
//         </TableCell>

//         <TableCell align="right">
//           <TextField
//             size="small"
//             type="number"
//             value={rate}
//             onChange={(e) => {

//               const value =
//                 e.target.value;

//               setProductOptions((prevProducts) =>
//                 prevProducts.map((item) =>
//                   String(item.value) === productId
//                     ? {
//                         ...item,
//                         rate:
//                           value === ""
//                             ? ""
//                             : Number(value),
//                       }
//                     : item
//                 )
//               );

//             }}
//             inputProps={{
//   min: 0,
//   onWheel: preventNumberInputScroll,
// }}
//             sx={{
//               width: "100px",
//               "& input": {
//                 textAlign: "right",
//               },
//             }}
//           />
//         </TableCell>

//       </TableRow>
//     );
//   })}
// </TableBody>
        
//       </Table>
//     </TableContainer>
//   </DialogContent>

//   {/* CLOSE */}
//   <DialogActions
//     sx={{
//       justifyContent: "flex-end",
//       px: 2,
//       py: 1.5,
//     }}
//   >
//     <Button
//       variant="contained"
//       onClick={() => setOpenReport(false)}
//       sx={{
//         textTransform: "none",
//         backgroundColor: "var(--primary-color)",
//       }}
//     >
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>


// {/* ==========================================================
//     SAVE COMPARISON POPUP
// ========================================================== */}

// <Dialog
//   open={openComparisonPopup}
//   onClose={() => {
//     if (!saving) {
//       setOpenComparisonPopup(false);
//     }
//   }}
//   fullWidth
//   maxWidth="md"
// >
//   <DialogTitle
//     sx={{
//       backgroundColor: "#ecfde6",
//       color: "#0B5E20",
//       fontWeight: 700,
//     }}
//   >
//     Stock Comparison
//   </DialogTitle>

//   <DialogContent dividers>
//     <Typography
//       sx={{
//         mb: 2,
//         fontWeight: 600,
//         fontSize: "15px",
//       }}
//     >
//       Please verify the stock before saving.
//     </Typography>

//     <TableContainer
//       component={Paper}
//       sx={{
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//       }}
//     >
//       <Table size="small">
//         <TableHead>
//   <TableRow>

//     <TableCell sx={{ fontWeight: 700 }}>
//       Product Code
//     </TableCell>

//     <TableCell sx={{ fontWeight: 700 }}>
//       Product Name
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Main Office
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Sold
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Expected
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Physical
//     </TableCell>

//     <TableCell
//       align="center"
//       sx={{ fontWeight: 700 }}
//     >
//       Difference
//     </TableCell>

//   </TableRow>
// </TableHead>

//    <TableBody>
//   {comparisonRows.length === 0 ? (
//     <TableRow>
//       <TableCell
//         colSpan={7}
//         align="center"
//       >
//         No comparison data available
//       </TableCell>
//     </TableRow>
//   ) : (
//     comparisonRows.map((row) => (
//       <TableRow
//         key={String(row.ProductId)}
//       >

//         {/* PRODUCT CODE */}
//         <TableCell>
//           {row.ProductCode || "-"}
//         </TableCell>

//         {/* PRODUCT NAME */}
//         <TableCell>
//           {row.ProductName || "-"}
//         </TableCell>

//         {/* MAIN OFFICE */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//           }}
//         >
//           {Number(row.MainOffice || 0)}
//         </TableCell>

//         {/* SOLD */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//           }}
//         >
//           {Number(row.Sold || 0)}
//         </TableCell>

//         {/* EXPECTED */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//           }}
//         >
//           {Number(row.Expected || 0)}
//         </TableCell>

//         {/* PHYSICAL */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//             color:
//               Number(row.Difference || 0) === 0
//                 ? "green"
//                 : "red",
//           }}
//         >
//           {Number(row.Physical || 0)}
//         </TableCell>

//         {/* DIFFERENCE */}
//         <TableCell
//           align="center"
//           sx={{
//             fontWeight: 700,
//             color:
//               Number(row.Difference || 0) === 0
//                 ? "green"
//                 : "red",
//           }}
//         >
//           {Number(row.Difference || 0)}
//         </TableCell>

//       </TableRow>
//     ))
//   )}
// </TableBody>

//       </Table>
//     </TableContainer>
//   </DialogContent>

//   <DialogActions
//     sx={{
//       px: 2,
//       py: 1.5,
//       gap: 1,
//     }}
//   >
//     <Button
//       variant="outlined"
//       disabled={saving}
//       onClick={() => {
//         setOpenComparisonPopup(false);
//       }}
//       sx={{
//         textTransform: "none",
//         color: "var(--complementary-color)",
//         borderColor: "var(--complementary-color)",
//       }}
//     >
//       Cancel
//     </Button>

//     <Button
//       variant="contained"
//       disabled={saving}
//       onClick={async () => {
//         setOpenComparisonPopup(false);

//         // ACTUAL SAVE
//         await handleSave(true);
//       }}
//       sx={{
//         textTransform: "none",
//         background: "var(--primary-color)",
//         "&:hover": {
//           background: "var(--primary-color)",
//         },
//       }}
//     >
//       {saving ? "Saving..." : "Confirm Save"}
//     </Button>
//   </DialogActions>
// </Dialog>

//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default EntryShop;


























import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";

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

const EntryShop = () => {
  // ==========================================================
  // MAIN TABLE DATA
  // ==========================================================

  const preventNumberInputScroll = (event) => {
  event.currentTarget.blur();
};

  const [stockEntries, setStockEntries] = useState([]);

  // ==========================================================
  // FORM DIALOG
  // ==========================================================

  const [openForm, setOpenForm] = useState(false);

  const [saving, setSaving] = useState(false);


// ==========================================================
// SAVE COMPARISON POPUP
// ==========================================================
const [openComparisonPopup, setOpenComparisonPopup] = useState(false);
const [comparisonRows, setComparisonRows] = useState([]);

// ==========================================================
// STOCK COMPARISON REPORT
// ==========================================================
const [comparisonReportOpen, setComparisonReportOpen] = useState(false);
const [comparisonReportRows, setComparisonReportRows] = useState([]);
const [comparisonReportDate, setComparisonReportDate] = useState("");




  // ==========================================================
  // SHOP / ACCOUNT
  // ==========================================================

  const [editingEntry, setEditingEntry] = useState(null);

  const STOCK_ENTRY_SHOP_ID = 1;

 // =====================================================
// LOGGED-IN USER ROLE → CREATED BY / UPDATED BY
// ADMIN = 1
// SALE  = 2
// SALE2 = 3
// =====================================================

const getUserTypeId = () => {
  const role = String(
    sessionStorage.getItem("UserRole") || ""
  )
    .trim()
    .toUpperCase();

  if (role === "ADMIN") {
    return 1;
  }

  if (role === "SALE") {
    return 2;
  }

  if (role === "SALE2") {
    return 3;
  }

  return 0;
};

const CREATED_BY = getUserTypeId();
const UPDATED_BY = getUserTypeId();

  // ==========================================================
  // DATE
  // ==========================================================

  const [date, setDate] = useState(new Date());


  const [soldQuantities, setSoldQuantities] = useState({});



  
const [quantity, setQuantity] = useState("");
const [rate, setRate] = useState("");
const [rows, setRows] = useState([]);



// ==========================================================
// FETCH ACTUAL SOLD QUANTITY FROM SALES / INVOICE
// ==========================================================
const fetchSoldQuantities = async (
  selectedDate = date
) => {
  try {
    console.log("======================================");
    console.log("FETCH ACTUAL SOLD QUANTITIES");
    console.log("SELECTED DATE:", selectedDate);
    console.log("======================================");

    // ========================================================
    // 1. DATE FORMAT FUNCTION
    // ========================================================
    const getDateOnly = (value) => {
      if (!value) {
        return "";
      }

      // ------------------------------------------------------
      // JavaScript Date object
      // ------------------------------------------------------
      if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
          return "";
        }

        return `${value.getFullYear()}-${String(
          value.getMonth() + 1
        ).padStart(2, "0")}-${String(
          value.getDate()
        ).padStart(2, "0")}`;
      }

      // ------------------------------------------------------
      // API DATE OBJECT
      //
      // Example:
      // {
      //   date: "2026-09-28 00:00:00.000000",
      //   timezone_type: 3,
      //   timezone: "UTC"
      // }
      // ------------------------------------------------------
      if (
        typeof value === "object" &&
        value?.date
      ) {
        return String(value.date).slice(0, 10);
      }

      // ------------------------------------------------------
      // String
      // ------------------------------------------------------
      if (typeof value === "string") {
        const str = value.trim();

        // YYYY-MM-DD
        if (
          /^\d{4}-\d{2}-\d{2}/.test(str)
        ) {
          return str.slice(0, 10);
        }

        // DD-MM-YYYY
        if (
          /^\d{2}-\d{2}-\d{4}/.test(str)
        ) {
          const parts =
            str.slice(0, 10).split("-");

          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        // DD/MM/YYYY
        if (
          /^\d{2}\/\d{2}\/\d{4}/.test(str)
        ) {
          const parts =
            str.slice(0, 10).split("/");

          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        return str.slice(0, 10);
      }

      return "";
    };

    // ========================================================
    // 2. SELECTED DATE
    // ========================================================
    const selectedDateString =
      getDateOnly(selectedDate);

    console.log(
      "SELECTED DATE STRING:",
      selectedDateString
    );

    if (!selectedDateString) {
      console.warn(
        "SELECTED DATE IS EMPTY"
      );

      setSoldQuantities({});
      return {};
    }

    // ========================================================
    // 3. FETCH ALL INVOICE HEADERS
    // ========================================================
    const headerUrl =
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=InvoiceHeader";

    console.log(
      "FETCHING INVOICE HEADER:",
      headerUrl
    );

    const headerResponse =
      await fetch(headerUrl);

    if (!headerResponse.ok) {
      throw new Error(
        `Invoice Header API failed: ${headerResponse.status}`
      );
    }

    const headerResult =
      await headerResponse.json();

    console.log(
      "RAW INVOICE HEADER RESPONSE:",
      headerResult
    );

    // ========================================================
    // 4. NORMALIZE HEADER RESPONSE
    // ========================================================
    let invoiceHeaders = [];

    if (Array.isArray(headerResult)) {
      invoiceHeaders = headerResult;
    }

    else if (
      Array.isArray(headerResult?.data)
    ) {
      invoiceHeaders =
        headerResult.data;
    }

    else if (
      headerResult?.data &&
      typeof headerResult.data === "object"
    ) {
      invoiceHeaders = [
        headerResult.data
      ];
    }

    console.log(
      "TOTAL INVOICE HEADERS:",
      invoiceHeaders.length
    );

    // ========================================================
    // 5. DEBUG ALL INVOICE DATES
    // ========================================================
    console.log(
      "========== ALL INVOICE DATE DEBUG =========="
    );

    invoiceHeaders.forEach(
      (invoice) => {
        console.log({
          InvoiceNo:
            invoice?.InvoiceNo,

          InvoiceId:
            invoice?.Id ??
            invoice?.InvoiceId,

          InvoiceDate:
            invoice?.InvoiceDate,

          NormalizedDate:
            getDateOnly(
              invoice?.InvoiceDate
            )
        });
      }
    );

    console.log(
      "============================================"
    );

    // ========================================================
    // 6. FILTER INVOICES FOR SELECTED DATE
    // ========================================================
    const selectedDateInvoices =
      invoiceHeaders.filter(
        (invoice) => {

          const invoiceDate =
            invoice?.InvoiceDate;

          const invoiceDateString =
            getDateOnly(invoiceDate);

          console.log(
            "INVOICE DATE CHECK:",
            {
              InvoiceNo:
                invoice?.InvoiceNo,

              InvoiceId:
                invoice?.Id ??
                invoice?.InvoiceId,

              InvoiceDate:
                invoiceDate,

              NormalizedDate:
                invoiceDateString,

              TargetDate:
                selectedDateString
            }
          );

          return (
            invoiceDateString ===
            selectedDateString
          );
        }
      );

    // ========================================================
    // 7. SELECTED DATE INVOICES DEBUG
    // ========================================================
    console.log(
      "======================================"
    );

    console.log(
      "SELECTED DATE INVOICES:",
      selectedDateInvoices
    );

    console.log(
      "TOTAL SELECTED DATE INVOICES:",
      selectedDateInvoices.length
    );

    console.log(
      "======================================"
    );

    // ========================================================
    // 8. PRODUCT-WISE SOLD QUANTITY
    // ========================================================
    const soldMap = {};

    // ========================================================
    // 9. FETCH INVOICE DETAILS
    // ========================================================
    for (
      const invoice of selectedDateInvoices
    ) {

      // ------------------------------------------------------
      // Get Invoice Id
      // ------------------------------------------------------
      const invoiceId =
        invoice?.Id ??
        invoice?.InvoiceId ??
        invoice?.id ??
        "";

      if (!invoiceId) {
        console.warn(
          "INVOICE ID NOT FOUND:",
          invoice
        );

        continue;
      }

      console.log(
        "--------------------------------------"
      );

      console.log(
        "FETCHING DETAILS FOR INVOICE:",
        invoiceId
      );

      // ------------------------------------------------------
      // IMPORTANT:
      // Colname MUST be InvoiceId
      // Colvalue MUST be invoiceId
      // ------------------------------------------------------
      const detailUrl =
        `https://amrutdairyapi.microtechsolutions.net.in/php/get/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${encodeURIComponent(
          invoiceId
        )}`;

      console.log(
        "INVOICE DETAIL URL:",
        detailUrl
      );

      try {

        // ====================================================
        // 10. FETCH DETAIL API
        // ====================================================
        const detailResponse =
          await fetch(detailUrl);

        console.log(
          "DETAIL API STATUS:",
          invoiceId,
          detailResponse.status
        );

        if (!detailResponse.ok) {

          console.warn(
            "Invoice Detail API failed:",
            {
              InvoiceId:
                invoiceId,

              Status:
                detailResponse.status,

              URL:
                detailUrl
            }
          );

          continue;
        }

        // ====================================================
        // 11. READ RESPONSE
        // ====================================================
        const detailResult =
          await detailResponse.json();

        console.log(
          `RAW INVOICE DETAILS - ${invoiceId}:`,
          detailResult
        );

        // ====================================================
        // 12. NORMALIZE DETAIL RESPONSE
        // ====================================================
        let details = [];

        if (
          Array.isArray(detailResult)
        ) {
          details =
            detailResult;
        }

        else if (
          Array.isArray(
            detailResult?.data
          )
        ) {
          details =
            detailResult.data;
        }

        else if (
          detailResult?.data &&
          typeof detailResult.data === "object"
        ) {
          details = [
            detailResult.data
          ];
        }

        else if (
          detailResult &&
          typeof detailResult === "object"
        ) {
          details = [
            detailResult
          ];
        }

        console.log(
          `NORMALIZED DETAILS - ${invoiceId}:`,
          details
        );

        console.log(
          `DETAIL COUNT - ${invoiceId}:`,
          details.length
        );

        // ====================================================
        // 13. ADD PRODUCT-WISE SOLD QUANTITY
        // ====================================================
        details.forEach(
          (detail, index) => {

            console.log(
              "RAW DETAIL ROW:",
              {
                InvoiceId:
                  invoiceId,

                Index:
                  index,

                Detail:
                  detail
              }
            );

            // ------------------------------------------------
            // ProductId
            // ------------------------------------------------
            const productId =
              Number(
                detail?.ProductId ??
                detail?.productId ??
                0
              );

            // ------------------------------------------------
            // Quantity
            // ------------------------------------------------
            const quantity =
              Number(
                detail?.Quantity ??
                detail?.quantity ??
                0
              );

            console.log(
              "SALE DETAIL:",
              {
                InvoiceId:
                  invoiceId,

                ProductId:
                  productId,

                Quantity:
                  quantity
              }
            );

            // ------------------------------------------------
            // Invalid product
            // ------------------------------------------------
            if (
              !productId
            ) {
              console.warn(
                "INVALID PRODUCT ID:",
                detail
              );

              return;
            }

            // ------------------------------------------------
            // Invalid quantity
            // ------------------------------------------------
            if (
              !Number.isFinite(
                quantity
              )
            ) {
              console.warn(
                "INVALID QUANTITY:",
                detail
              );

              return;
            }

            // ------------------------------------------------
            // Product key
            // ------------------------------------------------
            const key =
              String(productId);

            // ------------------------------------------------
            // Add quantity
            // ------------------------------------------------
            soldMap[key] =
              (
                soldMap[key] || 0
              ) + quantity;

            console.log(
              "UPDATED SOLD MAP:",
              {
                ProductId:
                  key,

                Quantity:
                  quantity,

                TotalSold:
                  soldMap[key]
              }
            );
          }
        );

      } catch (
        detailError
      ) {

        console.error(
          "INVOICE DETAIL ERROR:",
          {
            InvoiceId:
              invoiceId,

            Error:
              detailError
          }
        );
      }
    }

    // ========================================================
    // 14. FINAL SOLD MAP
    // ========================================================
    console.log(
      "======================================"
    );

    console.log(
      "FINAL ACTUAL SOLD QUANTITY MAP:",
      soldMap
    );

    console.log(
      "FINAL SOLD MAP JSON:",
      JSON.stringify(
        soldMap,
        null,
        2
      )
    );

    console.log(
      "======================================"
    );

    // ========================================================
    // 15. SAVE TO STATE
    // ========================================================
    setSoldQuantities(
      soldMap
    );

    // ========================================================
    // 16. RETURN
    // ========================================================
    return soldMap;

  } catch (error) {

    console.error(
      "======================================"
    );

    console.error(
      "FETCH ACTUAL SOLD QUANTITIES ERROR:",
      error
    );

    console.error(
      "======================================"
    );

    setSoldQuantities({});

    return {};
  }
};

const [mainOfficeQuantities, setMainOfficeQuantities] = useState({});
const [physicalQuantities, setPhysicalQuantities] = useState({});




const fetchMainOfficeStock = async (selectedDate = date) => {
  try {
    console.log("======================================");
    console.log("FETCH MAIN OFFICE STOCK");
    console.log("SELECTED DATE:", selectedDate);
    console.log("======================================");

    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockHeader.php"
    );

    if (!response.ok) {
      throw new Error(
        `Main Office Header API failed: ${response.status}`
      );
    }

    const result = await response.json();

    const headers = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
      ? result.data
      : [];

    // ----------------------------------------------------------
    // SELECTED DATE
    // ----------------------------------------------------------

    const selectedDateString =
      selectedDate instanceof Date
        ? `${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0")}-${String(
            selectedDate.getDate()
          ).padStart(2, "0")}`
        : String(selectedDate).slice(0, 10);

    console.log(
      "MAIN OFFICE SELECTED DATE:",
      selectedDateString
    );

    // ----------------------------------------------------------
    // GET ALL MAIN OFFICE HEADERS FOR SELECTED DATE
    // LocationType = O
    // ----------------------------------------------------------

    const mainOfficeHeaders = headers.filter((item) => {
      const locationType = String(
        item?.LocationType ??
          item?.locationType ??
          ""
      )
        .trim()
        .toUpperCase();

      const entryDate = String(
        item?.EntryDate ??
          item?.entryDate ??
          item?.Date ??
          item?.date ??
          ""
      ).slice(0, 10);

      return (
        locationType === "O" &&
        entryDate === selectedDateString
      );
    });

    console.log(
      "MAIN OFFICE HEADERS FOR DATE:",
      mainOfficeHeaders
    );

    console.log(
      "TOTAL MAIN OFFICE HEADERS:",
      mainOfficeHeaders.length
    );

    // ----------------------------------------------------------
    // NO MAIN OFFICE ENTRY
    // ----------------------------------------------------------

    if (mainOfficeHeaders.length === 0) {
      console.log(
        "NO MAIN OFFICE HEADER FOR SELECTED DATE"
      );

      setMainOfficeQuantities({});
      return {};
    }

    // ----------------------------------------------------------
    // FETCH DETAILS FROM ALL MAIN OFFICE HEADERS
    // ----------------------------------------------------------

    const stockMap = {};

    for (const header of mainOfficeHeaders) {
      const headerId = Number(header?.Id);

      if (!headerId) {
        continue;
      }

      console.log(
        "FETCHING MAIN OFFICE DETAILS - HEADER:",
        headerId
      );

      const detailResponse = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${headerId}`
      );

      if (!detailResponse.ok) {
        console.error(
          "DETAIL API FAILED:",
          headerId,
          detailResponse.status
        );

        continue;
      }

      const detailResult =
        await detailResponse.json();

      const details = Array.isArray(detailResult)
        ? detailResult
        : Array.isArray(detailResult?.data)
        ? detailResult.data
        : [];

      console.log(
        `MAIN OFFICE DETAILS - HEADER ${headerId}:`,
        details
      );

      // --------------------------------------------------------
      // ADD PRODUCT QUANTITY
      // --------------------------------------------------------

      details.forEach((item) => {
        const productId = Number(
          item?.ProductId ??
            item?.productId ??
            0
        );

        const quantity = Number(
          item?.Quantity ??
            item?.quantity ??
            0
        );

        if (!productId) {
          return;
        }

        const key = String(productId);

        stockMap[key] =
          (stockMap[key] || 0) +
          quantity;
      });
    }

    console.log(
      "======================================"
    );

    console.log(
      "FINAL DATE-WISE MAIN OFFICE STOCK MAP:",
      stockMap
    );

    console.log(
      "======================================"
    );

    setMainOfficeQuantities(stockMap);

    return stockMap;

  } catch (error) {
    console.error(
      "MAIN OFFICE STOCK ERROR:",
      error
    );

    setMainOfficeQuantities({});

    return {};
  }
};




const handlePhysicalQuantityChange = (
  productId,
  value
) => {
  setPhysicalQuantities((prev) => ({
    ...prev,
    [String(productId)]: value,
  }));
};



  // ==========================================================
  // PRODUCT
  // ==========================================================

  const [productOptions, setProductOptions] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [productQuantities, setProductQuantities] = useState({});
  const [productRates, setProductRates] = useState({});

  // ==========================================================
// PRODUCT SEARCH
// ==========================================================
const [productSearch, setProductSearch] = useState("");

// ==========================================================
// QUANTITY INPUT REFS
// Used for Enter -> next row focus
// ==========================================================
const quantityInputRefs = useRef({});





// ==========================================================
// FILTER PRODUCTS BY SEARCH
// Search by Product Code OR Product Name
// ==========================================================
const filteredProductOptions = useMemo(() => {
  const search = String(productSearch || "")
    .trim()
    .toLowerCase();

  if (!search) {
    return productOptions;
  }

  return productOptions.filter((product) => {
    const productCode = String(
      product?.productCode ?? ""
    ).toLowerCase();

    const productName = String(
      product?.label ?? ""
    ).toLowerCase();

    return (
      productCode.includes(search) ||
      productName.includes(search)
    );
  });
}, [productOptions, productSearch]);






// ==========================================================
// QUANTITY ENTER -> MOVE TO NEXT ROW
// ==========================================================
const handleQuantityKeyDown = (event, currentProductId) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();

  const currentIndex = filteredProductOptions.findIndex(
    (product) =>
      String(product.value) === String(currentProductId)
  );

  if (currentIndex === -1) {
    return;
  }

  const nextProduct =
    filteredProductOptions[currentIndex + 1];

  // No next row
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



  const [openReport, setOpenReport] = useState(false);


// ==========================================================
// PRODUCT SELECTION
// ==========================================================

const [selectedProduct, setSelectedProduct] = useState(null);
const [productQuantity, setProductQuantity] = useState("");
const [productRate, setProductRate] = useState("");


// ==========================================================
// PRODUCT CHANGE
// ==========================================================

const handleProductChange = (event, newValue) => {
  setSelectedProduct(newValue);

  // No product selected
  if (!newValue) {
    setProductQuantity("");
    setProductRate("");
    return;
  }

  const productId = String(newValue.value);

  const savedValue =
    productQuantities?.[productId];

  let savedQuantity = "";
  let savedRate = Number(newValue.rate || 0);

  // Existing saved product
  if (
    savedValue &&
    typeof savedValue === "object"
  ) {
    savedQuantity =
      savedValue?.quantity ?? "";

    if (
      savedValue?.rate !== undefined &&
      savedValue?.rate !== ""
    ) {
      savedRate =
        Number(savedValue.rate);
    }
  } else if (
    savedValue !== undefined &&
    savedValue !== null &&
    savedValue !== ""
  ) {
    savedQuantity = savedValue;
  }

  setProductQuantity(
    savedQuantity === ""
      ? ""
      : String(savedQuantity)
  );

  setProductRate(
    savedRate === 0
      ? ""
      : String(savedRate)
  );
};


// ==========================================================
// QUANTITY CHANGE
// ==========================================================

const handleQuantityChange = (event) => {
  const value = event.target.value;

  setProductQuantity(value);

  if (!selectedProduct) {
    return;
  }

  const productId =
    String(selectedProduct.value);

  setProductQuantities((previous) => ({
    ...previous,

    [productId]: {
      ...(previous[productId] || {}),

      quantity:
        value === ""
          ? ""
          : Number(value),

      rate:
        previous[productId]?.rate ??
        Number(selectedProduct.rate || 0),

      detailId:
        previous[productId]?.detailId || "",
    },
  }));
};


// ==========================================================
// RATE CHANGE
// ==========================================================

const handleRateChange = (event) => {
  const value = event.target.value;

  setProductRate(value);

  if (!selectedProduct) {
    return;
  }

  const productId =
    String(selectedProduct.value);

  setProductQuantities((previous) => ({
    ...previous,

    [productId]: {
      ...(previous[productId] || {}),

      quantity:
        previous[productId]?.quantity ??
        Number(productQuantity || 0),

      rate:
        value === ""
          ? ""
          : Number(value),

      detailId:
        previous[productId]?.detailId || "",
    },
  }));
};
  // ==========================================================
  // PAGE NUMBER
  // ==========================================================

  const [pageNo, setPageNo] = useState(1);

  const pageSize = 10;

  // ==========================================================
  // FETCH PRODUCT MASTER - REGULAR RATE
  // ==========================================================
  const fetchProduct = async () => {
    try {
      setLoadingProducts(true);

      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
      );

      if (!response.ok) {
        throw new Error(`Product API failed: ${response.status}`);
      }

      const data = await response.json();

      console.log("PRODUCT MASTER API RESPONSE:", data);

      const productData = Array.isArray(data) ? data : [];

      const options = productData
        .filter(
          (item) =>
            item?.ProductName !== null &&
            item?.ProductName !== undefined &&
            String(item.ProductName).trim() !== "",
        )
        .map((item) => ({
          value: Number(item?.Id ?? item?.ProductId ?? 0),

          label: String(item?.ProductName ?? item?.Name ?? "").trim(),

          productCode:
            item?.ProductCode ??
            item?.Code ??
            item?.ProductCodeNo ??
            item?.Id ??
            "",

          // ==================================================
          // REGULAR RATE
          // If Rate exists and > 0, use Rate.
          // Otherwise use PurchasePrice.
          // ==================================================
          rate: Number(
            Number(item?.Rate) > 0 ? item?.Rate : (item?.PurchasePrice ?? 0),
          ),
        }));

      console.log("PRODUCT OPTIONS WITH RATE:", options);

      setProductOptions(options);
    } catch (error) {
      console.error("Product API Error:", error);

      toast.error("Product data could not be loaded");
    } finally {
      setLoadingProducts(false);
    }
  };

  // ==========================================================
  // FETCH ALL DAILY STOCK HEADER RECORDS
  // ==========================================================
  const fetchDailyStockHeaders = async () => {
    try {
      console.log("====================================");
      console.log("FETCHING ALL DAILY STOCK HEADERS");
      console.log("====================================");

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
        throw new Error(`Daily Stock Header API failed: ${response.status}`);
      }

      let result;

      try {
        result = rawText ? JSON.parse(rawText) : [];
      } catch (error) {
        console.error("DAILY STOCK HEADER JSON PARSE ERROR:", error);

        throw new Error(`Invalid Daily Stock Header API response: ${rawText}`);
      }

      console.log("DAILY STOCK HEADER API RESPONSE:", result);

      // ======================================================
      // NORMALIZE API RESPONSE
      // ======================================================

      let data = [];

      if (Array.isArray(result)) {
        data = result;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      } else if (result?.data && typeof result.data === "object") {
        data = [result.data];
      } else if (result && typeof result === "object" && result?.Id) {
        data = [result];
      }

      console.log("ALL DAILY STOCK HEADER RECORDS:", data);

      // ======================================================
      // MAP DATA
      // ======================================================

     const mappedData = data
  // ==========================================================
  // DAILY STOCK SHOP ENTRIES ONLY
  // Main Office = O
  // Shop       = S
  // ==========================================================
  .filter((item) => {
    const locationType = String(
      item?.LocationType ??
        item?.locationType ??
        ""
    )
      .trim()
      .toUpperCase();

    return locationType === "S";
  })

  .map((item) => {
    // ========================================================
    // HEADER ID
    // ========================================================
    const id =
      item?.Id ??
      item?.id ??
      item?.DailyStockHeaderId ??
      item?.HeaderId ??
      "";

    // ========================================================
    // DATE
    // ========================================================
    const entryDate =
      item?.EntryDate ??
      item?.entryDate ??
      item?.Date ??
      item?.date ??
      "";

    // ========================================================
    // SHOP NAME
    //
    // API response मध्ये ShopName नसल्यास
    // Daily Stock Shop साठी fixed name वापरू
    // ========================================================
    const shopName =
      item?.ShopName ??
      item?.AccountName ??
      item?.Shop ??
      item?.shop ??
      item?.Name ??
      "Stock Entry Shop";

    // ========================================================
    // TOTAL AMOUNT
    // ========================================================
    const totalAmount = Number(
      item?.TotalAmount ??
        item?.totalAmount ??
        item?.Total ??
        item?.total ??
        0
    );

    // ========================================================
    // LOCATION TYPE
    // ========================================================
    const locationType = String(
      item?.LocationType ??
        item?.locationType ??
        "S"
    )
      .trim()
      .toUpperCase();

    // ========================================================
    // SHOP ID
    // ========================================================
    const shopId =
      item?.ShopId ??
      item?.shopId ??
      item?.LocationId ??
      item?.locationId ??
      "";

    // ========================================================
    // FINAL MAPPED OBJECT
    // ========================================================
    return {
      ...item,

      // Header ID
      Id: id,
      id: id,
      HeaderId: id,

      // Date
      EntryDate: entryDate,
      dateText: entryDate
        ? formatDate(entryDate)
        : "",

      // Shop
      ShopName: shopName,
      shop: shopName,

      // Shop / Location
      ShopId: shopId,
      shopId: shopId,
      LocationId: shopId,

      // Location Type
      LocationType: locationType,

      // Total
      TotalAmount: totalAmount,
      total: totalAmount,
    };
  });

console.log(
  "=========================================="
);
console.log(
  "DAILY STOCK SHOP MAPPED DATA"
);
console.log(
  "=========================================="
);
console.log(
  "TOTAL SHOP RECORDS:",
  mappedData.length
);
console.log(
  "MAPPED DAILY STOCK SHOP RECORDS:",
  mappedData
);

// ==========================================================
// SET TABLE DATA
// ==========================================================
setStockEntries(mappedData);

// Reset pagination
setPageNo(1);

return mappedData;

      console.log("MAPPED DAILY STOCK HEADER RECORDS:", mappedData);

      // ======================================================
      // SET TABLE DATA
      // ======================================================

      setStockEntries(mappedData);

      // Page reset
      setPageNo(1);

      return mappedData;
    } catch (error) {
      console.error("FETCH ALL DAILY STOCK HEADER ERROR:", error);

      toast.error(
        error?.message || "Daily Stock Header data could not be loaded",
      );

      setStockEntries([]);

      return [];
    }
  };

  const fetchDailyStockDetail = async (headerId) => {
    try {
      const id = Number(headerId);

      console.log("DAILY STOCK HEADER ID:", id);

      if (!id) {
        throw new Error("Daily Stock Header ID not found");
      }

      const url = `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockDetail.php?DailyStockHeaderId=${id}`;

      console.log("DAILY STOCK DETAIL GET URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("DETAIL GET STATUS:", response.status);
      console.log("DETAIL GET STATUS TEXT:", response.statusText);

      const text = await response.text();

      console.log("DETAIL GET RAW RESPONSE:", text);

      let result;

      try {
        result = JSON.parse(text);
      } catch (error) {
        console.error("DETAIL GET JSON PARSE ERROR:", error);

        throw new Error(`Invalid Daily Stock Detail API response: ${text}`);
      }

      console.log("DAILY STOCK DETAIL API RESPONSE:", result);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Daily Stock Detail API failed: ${response.status}`,
        );
      }

      if (result?.success === false) {
        throw new Error(
          result?.message || "Daily Stock Detail data could not be loaded",
        );
      }

      let data = [];

      if (Array.isArray(result)) {
        data = result;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      } else if (result?.data && typeof result.data === "object") {
        data = [result.data];
      } else if (result && typeof result === "object" && result?.Id) {
        data = [result];
      }

    const mappedData = data.map((item) => ({
  Id: Number(
    item?.Id ??
    item?.id ??
    0
  ),

  DailyStockHeaderId: Number(
    item?.DailyStockHeaderId ??
    item?.dailyStockHeaderId ??
    headerId ??
    0
  ),

  ProductId: Number(
    item?.ProductId ??
    item?.ProductID ??
    item?.productId ??
    item?.productID ??
    item?.product_id ??
    0
  ),

  Quantity: Number(
    item?.Quantity ??
    item?.quantity ??
    item?.Qty ??
    item?.qty ??
    0
  ),

  Rate: Number(
    item?.Rate ??
    item?.rate ??
    item?.Price ??
    item?.price ??
    0
  ),

  Amount: Number(
    item?.Amount ??
    item?.amount ??
    0
  ),
}));

      console.log("DAILY STOCK DETAIL FINAL DATA:", mappedData);

      return mappedData;
    } catch (error) {
      console.error("Daily Stock Detail API Error:", error);

      toast.error(
        error?.message || "Daily Stock Detail data could not be loaded",
      );

      return [];
    }
  };

  const updateDailyStockHeader = async (headerId, entryDate, totalAmount) => {
    try {
      // ============================================================
      // 1. VALIDATE HEADER ID
      // ============================================================

      const id = Number(headerId);

      console.log("========== DAILY STOCK HEADER UPDATE ==========");
      console.log("HEADER ID:", id);
      console.log("ENTRY DATE:", entryDate);
      console.log("TOTAL AMOUNT:", totalAmount);

      if (!Number.isInteger(id) || id <= 0) {
        throw new Error(`Invalid Daily Stock Header ID: ${headerId}`);
      }

      // ============================================================
      // 2. FORMAT DATE
      // API ला YYYY-MM-DD format मध्ये date पाठवा
      // ============================================================

      let formattedEntryDate = "";

      if (entryDate) {
        if (typeof entryDate === "string") {
          // Already YYYY-MM-DD
          if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
            formattedEntryDate = entryDate;
          }

          // DD-MM-YYYY
          else if (/^\d{2}-\d{2}-\d{4}$/.test(entryDate)) {
            const [day, month, year] = entryDate.split("-");

            formattedEntryDate = `${year}-${month}-${day}`;
          }

          // Try Date parsing
          else {
            const dateObj = new Date(entryDate);

            if (!isNaN(dateObj.getTime())) {
              formattedEntryDate = dateObj.toISOString().split("T")[0];
            }
          }
        } else if (entryDate instanceof Date) {
          if (!isNaN(entryDate.getTime())) {
            formattedEntryDate = entryDate.toISOString().split("T")[0];
          }
        }
      }

      if (!formattedEntryDate) {
        throw new Error(`Invalid EntryDate: ${entryDate}`);
      }

      console.log("FORMATTED ENTRY DATE:", formattedEntryDate);

      // ============================================================
      // 3. TOTAL AMOUNT
      // ============================================================

      const amount = Number(totalAmount || 0);

      if (isNaN(amount)) {
        throw new Error(`Invalid TotalAmount: ${totalAmount}`);
      }

      // ============================================================
      // 4. SHOP ID
      // ============================================================

      const shopId = Number(STOCK_ENTRY_SHOP_ID);

      if (!Number.isInteger(shopId) || shopId <= 0) {
        throw new Error(`Invalid ShopId: ${STOCK_ENTRY_SHOP_ID}`);
      }

      // ============================================================
      // 5. UPDATED BY
      // ============================================================

      const updatedBy = Number(CREATED_BY);

      if (!Number.isInteger(updatedBy) || updatedBy <= 0) {
        throw new Error(`Invalid UpdatedBy: ${CREATED_BY}`);
      }

      // ============================================================
      // 6. CREATE FORM DATA
      // ============================================================

      const updateData = new URLSearchParams();

      updateData.append("Id", String(id));
      updateData.append("EntryDate", formattedEntryDate);
      updateData.append("ShopId", String(shopId));

      // Existing record मध्ये OfficeId NULL आहे,
      // म्हणून blank ठेवत आहोत.

      updateData.append("TotalAmount", String(amount));

      updateData.append("UpdatedBy", String(updatedBy));

      // ============================================================
      // 7. LOG EXACT REQUEST
      // ============================================================

      console.log(
        "DAILY STOCK HEADER UPDATE PAYLOAD:",
        Object.fromEntries(updateData.entries()),
      );

      // ============================================================
      // 8. API CALL
      // ============================================================

      const apiUrl =
        "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockHeader.php";

      console.log("DAILY STOCK HEADER UPDATE URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

          Accept: "application/json",
        },

        body: updateData,

        redirect: "follow",
      });

      // ============================================================
      // 9. READ RAW RESPONSE
      // IMPORTANT FOR 500 ERROR
      // ============================================================

      console.log("HEADER UPDATE STATUS:", response.status);

      console.log("HEADER UPDATE STATUS TEXT:", response.statusText);

      const rawResponse = await response.text();

      console.log("HEADER UPDATE RAW RESPONSE:", rawResponse);

      // ============================================================
      // 10. HTTP ERROR
      // ============================================================

      if (!response.ok) {
        throw new Error(
          `Daily Stock Header Update API failed: ${response.status}${
            rawResponse ? ` - ${rawResponse}` : ""
          }`,
        );
      }

      // ============================================================
      // 11. PARSE JSON
      // ============================================================

      let result;

      try {
        result = rawResponse ? JSON.parse(rawResponse) : {};
      } catch (jsonError) {
        console.error("HEADER UPDATE JSON PARSE ERROR:", jsonError);

        throw new Error(`Invalid Header Update API response: ${rawResponse}`);
      }

      console.log("DAILY STOCK HEADER UPDATE RESPONSE:", result);

      // ============================================================
      // 12. CHECK API SUCCESS
      // ============================================================

      if (result?.success === false) {
        throw new Error(result?.message || "Daily Stock Header update failed");
      }

      console.log("✅ DAILY STOCK HEADER UPDATED SUCCESSFULLY");

      return result;
    } catch (error) {
      console.error("❌ Daily Stock Header Update API Error:", error);

      throw error;
    }
  };

  // ==========================================================
  // INITIAL API CALL
  // ==========================================================

useEffect(() => {
  const loadStockData = async () => {
    try {
      await fetchProduct();
      await fetchDailyStockHeaders();
      await fetchMainOfficeStock(date);
    } catch (error) {
      console.error(
        "ERROR LOADING DAILY STOCK DATA:",
        error
      );
    }
  };

  if (date) {
    loadStockData();
  }
}, [date]);



useEffect(() => {
  if (!productOptions || productOptions.length === 0) {
    return;
  }

  setProductRates((prev) => {
    const updated = { ...prev };

    productOptions.forEach((product) => {
      const productId = String(product.value);

      // Existing manually changed rate असेल तर तोच ठेवा
      if (updated[productId] === undefined) {
        updated[productId] = Number(product.rate || 0);
      }
    });

    return updated;
  });
}, [productOptions]);


  // ==========================================================
  // RESET FORM
  // ==========================================================
 const resetForm = () => {
  setDate(new Date());

  setProductQuantities({});

  setSelectedProduct(null);

  setProductQuantity("");

  setProductRate("");

  setEditingEntry(null);

  setPhysicalQuantities({});

  setProductSearch("");
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
  // PRODUCT QUANTITY CHANGE
  // ==========================================================

 const handleProductQuantityChange = (productId, value) => {
  const key = String(productId);

  // ==========================================================
  // PHYSICAL QUANTITY
  // ==========================================================
  setPhysicalQuantities((previous) => ({
    ...previous,
    [key]: value,
  }));

  // ==========================================================
  // PRODUCT QUANTITY
  // Keep rate + detailId while changing quantity
  // ==========================================================
  setProductQuantities((previous) => {
    const existing = previous[key];

    return {
      ...previous,
      [key]: {
        ...(existing && typeof existing === "object"
          ? existing
          : {}),
        quantity: value,
      },
    };
  });
};

  // ==========================================================
  // MAP DAILY STOCK HEADER DATA
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
        "Stock Entry Shop",

      total: Number(item?.TotalAmount ?? item?.total ?? 0),
    }));
  }, [stockEntries]);








  // ==========================================================
  // SAVE / UPDATE STOCK ENTRY SHOP
  // ==========================================================

const handleSave = async (skipComparisonPopup = false) => {
  console.log("🔥🔥🔥 HANDLE SAVE CALLED 🔥🔥🔥");
  console.log("skipComparisonPopup =", skipComparisonPopup);
  console.log("physicalQuantities =", physicalQuantities);
  console.log("productQuantities =", productQuantities);

  // ==========================================================
  // DATE VALIDATION
  // ==========================================================
  if (!date) {
    toast.error("Please select Date");
    return;
  }

  // ==========================================================
  // CREATE DATE STRING
  // ==========================================================
  const entryDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

  try {
    setSaving(true);

    // ==========================================================
    // PREPARE SELECTED PRODUCTS
    // ==========================================================

   const selectedRows = productOptions.map((product) => {
  const productId = String(product.value);

  const savedValue = productQuantities?.[productId];

  const physicalValue = physicalQuantities?.[productId];

  const quantity =
    physicalValue !== undefined &&
    physicalValue !== ""
      ? Number(physicalValue)
      : savedValue &&
        typeof savedValue === "object"
      ? Number(savedValue?.quantity || 0)
      : Number(savedValue || 0);

  const detailId =
    savedValue &&
    typeof savedValue === "object"
      ? savedValue?.detailId || ""
      : "";

  const rate =
    savedValue &&
    typeof savedValue === "object" &&
    savedValue.rate !== undefined &&
    savedValue.rate !== ""
      ? Number(savedValue.rate)
      : Number(
          productRates?.[productId] ??
          product.rate ??
          0
        );

  return {
    Id: detailId,

    ProductId: Number(product.value),

    ProductCode:
      product.productCode || "",

    ProductName:
      product.label || "",

    Quantity: quantity,

    Rate: rate,

    Amount: quantity * rate,
  };
});
      

    console.log(
      "=================================================="
    );

    console.log(
      "FINAL SELECTED ROWS:",
      selectedRows
    );

    console.log(
      "=================================================="
    );

    // ==========================================================
    // VALIDATE PRODUCTS
    // ==========================================================
    if (selectedRows.length === 0) {
      toast.error(
        "Please enter quantity for at least one product"
      );

      setSaving(false);
      return;
    }

    // ==========================================================
    // TOTAL AMOUNT
    // ==========================================================
    const totalAmount =
      selectedRows.reduce(
        (sum, row) =>
          sum +
          Number(row.Quantity || 0) *
            Number(row.Rate || 0),
        0
      );

    console.log(
      "TOTAL AMOUNT:",
      totalAmount
    );

   // ========================================================
// STOCK COMPARISON LOGIC
// ========================================================
//
// Main Office = Stock received from Main Office
// Sold       = Actual Sales Entry quantity
// Physical   = Quantity entered in Daily Stock
//
// Expected   = Main Office - Sold
// Difference = Physical - Expected
//
// Example:
// Main Office = 60
// Sold       = 40
// Expected   = 20
// Physical   = 19
// Difference = -1
// ========================================================
// ========================================================
// STOCK COMPARISON
// ========================================================

if (!skipComparisonPopup) {

  console.log(
    "🔄 REFRESHING STOCK DATA BEFORE COMPARISON..."
  );

  // ========================================================
  // LATEST MAIN OFFICE STOCK
  // ========================================================

  let latestMainOfficeQuantities = {};

  // ========================================================
  // LATEST SOLD QUANTITIES
  // ========================================================

  let latestSoldQuantities = {};


  // ========================================================
  // REFRESH MAIN OFFICE STOCK
  // ========================================================

  try {

    latestMainOfficeQuantities =
      await fetchMainOfficeStock(date);

    console.log(
      "LATEST MAIN OFFICE QUANTITIES:",
      latestMainOfficeQuantities
    );

  } catch (error) {

    console.error(
      "MAIN OFFICE STOCK REFRESH ERROR:",
      error
    );

    latestMainOfficeQuantities = {};
  }


  // ========================================================
  // REFRESH SOLD QUANTITIES
  // ========================================================

  try {

    latestSoldQuantities =
      await fetchSoldQuantities(date);

    console.log(
      "LATEST SOLD QUANTITIES:",
      latestSoldQuantities
    );

  } catch (error) {

    console.error(
      "SOLD QUANTITY REFRESH ERROR:",
      error
    );

    latestSoldQuantities = {};
  }


  // ========================================================
  // CREATE COMPARISON DATA
  // ========================================================

  const comparisonData =
    selectedRows.map((row) => {

      const productId =
        String(
  row?.ProductId ??
  row?.productId ??
  ""
)


      // ====================================================
      // MAIN OFFICE
      // INTERNAL ONLY
      // ====================================================

      const mainOfficeQty =
        Number(
          latestMainOfficeQuantities?.[productId] ?? 0
        );


      // ====================================================
      // SOLD
      // FROM SALES ENTRY / DEALER / CATERERS
      // ====================================================

      const soldQty =
        Number(
          latestSoldQuantities?.[productId] ?? 0
        );


      // ====================================================
      // DAILY STOCK ENTERED BY USER
      // ====================================================

      const physicalQty =
        Number(
          row.Quantity ?? 0
        );


      // ====================================================
      // EXPECTED
      //
      // INTERNAL ONLY
      //
      // Main Office - Sold
      // ====================================================

      const expectedQty =
        mainOfficeQty - soldQty;

// ========================================================
// STOCK COMPARISON LOGIC
// ========================================================
//
// Main Office = Stock received from Main Office
// Sale       = Actual Sales Entry quantity
// Daily Stock = Quantity entered by user
//
// Expected = Main Office - Sale
//
// Difference = Expected - Daily Stock
//
// Example:
// Main Office = 40
// Sale        = 20
// Expected   = 20
// Daily Stock = 19
// Difference = 1
//
// Positive = stock कमी
// Zero     = stock correct
// Negative = stock जास्त
// ========================================================

      const difference =
        expectedQty - physicalQty;


      return {

        ProductId:
          row.ProductId,

        ProductCode:
          row.ProductCode || "-",

        ProductName:
          row.ProductName || "-",

        // INTERNAL
        MainOffice:
          mainOfficeQty,

        // DISPLAY
        Sold:
          soldQty,

        // INTERNAL
        Expected:
          expectedQty,

        // DISPLAY
        Physical:
          physicalQty,

        // DISPLAY
        Difference:
          difference,

        Rate:
          Number(row.Rate || 0),

      };

    });


  // ========================================================
  // ENTERED PRODUCTS FIRST
  // ========================================================

  comparisonData.sort((a, b) => {

    const aPhysical =
      Number(a.Physical || 0);

    const bPhysical =
      Number(b.Physical || 0);

    const aSold =
      Number(a.Sold || 0);

    const bSold =
      Number(b.Sold || 0);


    // ------------------------------------------------------
    // FIRST:
    // Daily Stock entry केलेले products
    // ------------------------------------------------------

    const aEntered =
      aPhysical > 0 ? 1 : 0;

    const bEntered =
      bPhysical > 0 ? 1 : 0;


    if (aEntered !== bEntered) {

      return (
        bEntered - aEntered
      );

    }


    // ------------------------------------------------------
    // SECOND:
    // Sales झालेले products
    // ------------------------------------------------------

    const aHasSales =
      aSold > 0 ? 1 : 0;

    const bHasSales =
      bSold > 0 ? 1 : 0;


    if (aHasSales !== bHasSales) {

      return (
        bHasSales - aHasSales
      );

    }


    return 0;

  });


  // ========================================================
  // LOG
  // ========================================================

  console.log(
    "======================================"
  );

  console.log(
    "FINAL STOCK COMPARISON:",
    comparisonData
  );

  console.log(
    "======================================"
  );


  // ========================================================
  // SET POPUP DATA
  // ========================================================


  // ========================================================
// ENTERED DAILY STOCK PRODUCTS FIRST
// ========================================================

comparisonData.sort((a, b) => {

  const aPhysical =
    Number(a.Physical || 0);

  const bPhysical =
    Number(b.Physical || 0);

  const aSold =
    Number(a.Sold || 0);

  const bSold =
    Number(b.Sold || 0);

  // 1st priority:
  // Daily Stock मध्ये quantity भरलेले products
  const aEntered =
    aPhysical > 0 ? 1 : 0;

  const bEntered =
    bPhysical > 0 ? 1 : 0;

  if (aEntered !== bEntered) {
    return bEntered - aEntered;
  }

  // 2nd priority:
  // Sale झालेले products
  const aHasSale =
    aSold > 0 ? 1 : 0;

  const bHasSale =
    bSold > 0 ? 1 : 0;

  if (aHasSale !== bHasSale) {
    return bHasSale - aHasSale;
  }

  return 0;
});

  setComparisonRows(
    comparisonData
  );


  // ========================================================
  // STOP LOADING
  // ========================================================

  setSaving(false);


  // ========================================================
  // OPEN POPUP
  // ========================================================

  setOpenComparisonPopup(true);


  return;
}

    // ==========================================================
    // ==========================================================
    // ACTUAL API SAVE STARTS HERE
    // ==========================================================
    // ==========================================================

    console.log(
      "🚨🚨🚨 ACTUAL API SAVE BLOCK ENTERED 🚨🚨🚨"
    );

    console.log(
      "skipComparisonPopup =",
      skipComparisonPopup
    );

    // ==========================================================
    // EDIT EXISTING ENTRY
    // ==========================================================
    if (editingEntry) {

      const headerId =
        editingEntry?.Id ||
        editingEntry?.id;

      if (!headerId) {
        throw new Error(
          "Stock Entry Shop Header ID not found"
        );
      }

      console.log(
        "UPDATING STOCK ENTRY SHOP:",
        headerId
      );

      // ========================================================
      // UPDATE HEADER
      // ========================================================
      await updateDailyStockHeader(
        headerId,
        entryDate,
        totalAmount
      );

      console.log(
        "STOCK ENTRY SHOP HEADER UPDATED:",
        headerId
      );

      // ========================================================
      // UPDATE / INSERT DETAILS
      // ========================================================
      for (const row of selectedRows) {

        const detailId =
          row?.Id ||
          row?.id ||
          "";

        const quantity =
          Number(row?.Quantity || 0);

        const rate =
          Number(row?.Rate || 0);

        const amount =
          quantity * rate;

        // ======================================================
        // UPDATE EXISTING DETAIL
        // ======================================================
        if (detailId) {

          const detailData =
            new URLSearchParams();

          detailData.append(
            "Id",
            String(Number(detailId))
          );

          detailData.append(
            "DailyStockHeaderId",
            String(Number(headerId))
          );

          detailData.append(
            "ProductId",
            String(
              Number(row.ProductId)
            )
          );

          detailData.append(
            "Quantity",
            String(quantity)
          );

          detailData.append(
            "Rate",
            String(rate)
          );

          detailData.append(
            "Amount",
            String(amount)
          );

          detailData.append(
            "UpdatedBy",
            String(CREATED_BY)
          );

          console.log(
            "UPDATE DETAIL PAYLOAD:",
            Object.fromEntries(
              detailData.entries()
            )
          );

          const response =
            await fetch(
              "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
              {
                method: "POST",

                headers: {
                  Accept:
                    "application/json",

                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                },

                body:
                  detailData.toString(),
              }
            );

          const text =
            await response.text();

          console.log(
            "DETAIL UPDATE RESPONSE:",
            text
          );

          let result = {};

          try {
            result =
              text
                ? JSON.parse(text)
                : {};
          } catch {
            throw new Error(
              `Invalid Detail Update API response: ${text}`
            );
          }

          if (
            !response.ok ||
            result?.success === false
          ) {
            throw new Error(
              result?.message ||
                "Daily Stock Detail update failed"
            );
          }

          console.log(
            "DETAIL UPDATED SUCCESSFULLY:",
            result
          );
        }

        // ======================================================
        // INSERT NEW DETAIL
        // ======================================================
        else {

          const detailData =
            new URLSearchParams();

          detailData.append(
            "DailyStockHeaderId",
            String(Number(headerId))
          );

          detailData.append(
            "ProductId",
            String(
              Number(row.ProductId)
            )
          );

          detailData.append(
            "Quantity",
            String(quantity)
          );

          detailData.append(
            "Rate",
            String(rate)
          );

          detailData.append(
            "Amount",
            String(amount)
          );

          detailData.append(
            "CreatedBy",
            String(CREATED_BY)
          );

          console.log(
            "INSERT DETAIL PAYLOAD:",
            Object.fromEntries(
              detailData.entries()
            )
          );

          const response =
            await fetch(
              "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
              {
                method: "POST",

                headers: {
                  Accept:
                    "application/json",

                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                },

                body:
                  detailData.toString(),
              }
            );

          const text =
            await response.text();

          console.log(
            "DETAIL INSERT RESPONSE:",
            text
          );

          let result = {};

          try {
            result =
              text
                ? JSON.parse(text)
                : {};
          } catch {
            throw new Error(
              `Invalid Detail Insert API response: ${text}`
            );
          }

          if (
            !response.ok ||
            result?.success === false
          ) {
            throw new Error(
              result?.message ||
                "Daily Stock Detail insert failed"
            );
          }

          console.log(
            "DETAIL INSERTED SUCCESSFULLY:",
            result
          );
        }
      }

      // ========================================================
      // UPDATE LOCAL TABLE
      // ========================================================
      setStockEntries(
        (previous) =>
          previous.map((item) => {

            const itemId =
              item?.Id ||
              item?.id;

            if (
              String(itemId) !==
              String(headerId)
            ) {
              return item;
            }

            return {
              ...item,

              EntryDate:
                entryDate,

              dateText:
                formatDate(entryDate),

              TotalAmount:
                Number(
                  totalAmount || 0
                ),

              total:
                Number(
                  totalAmount || 0
                ),
            };
          })
      );

      toast.success(
        "Stock Entry Shop updated successfully!"
      );
    }

    // ==========================================================
    // NEW ENTRY
    // ==========================================================
    else {

      // ========================================================
      // HEADER DATA
      // ========================================================
      const headerData =
        new URLSearchParams();

      headerData.append(
        "EntryDate",
        String(entryDate)
      );

      headerData.append(
        "ShopId",
        String(STOCK_ENTRY_SHOP_ID)
      );

      headerData.append(
        "OfficeId",
        ""
      );

      headerData.append(
        "TotalAmount",
        String(
          Number(totalAmount || 0)
        )
      );

      headerData.append(
        "CreatedBy",
        String(CREATED_BY)
      );

      console.log(
        "STOCK ENTRY SHOP HEADER DATA:",
        Object.fromEntries(
          headerData.entries()
        )
      );

      // ========================================================
      // HEADER API
      // ========================================================
      const headerResponse =
        await fetch(
          "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
          {
            method: "POST",

            mode: "cors",

            credentials: "omit",

            headers: {
              Accept:
                "application/json",

              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8",
            },

            body:
              headerData.toString(),
          }
        );

      const headerText =
        await headerResponse.text();

      console.log(
        "HEADER RESPONSE:",
        headerText
      );

      let headerResult = {};

      try {
        headerResult =
          headerText
            ? JSON.parse(headerText)
            : {};
      } catch {
        throw new Error(
          `Invalid Header API response: ${headerText}`
        );
      }

      if (
        !headerResponse.ok ||
        !headerResult?.success
      ) {
        throw new Error(
          headerResult?.message ||
            "Daily Stock Header save failed"
        );
      }

      const headerId =
        headerResult?.Id ??
        headerResult?.id ??
        headerResult?.insert_id ??
        headerResult?.DailyStockHeaderId ??
        headerResult?.data?.Id ??
        headerResult?.data?.id;

      if (!headerId) {
        throw new Error(
          "Header created but Header ID was not returned."
        );
      }

      console.log(
        "CREATED HEADER ID:",
        headerId
      );

      // ========================================================
      // SAVE DETAILS
      // ========================================================
      for (const row of selectedRows) {

        const detailData =
          new URLSearchParams();

        detailData.append(
          "DailyStockHeaderId",
          String(Number(headerId))
        );

        detailData.append(
          "ProductId",
          String(
            Number(row.ProductId)
          )
        );

        detailData.append(
          "Quantity",
          String(
            Number(row.Quantity || 0)
          )
        );

        detailData.append(
          "Rate",
          String(
            Number(row.Rate || 0)
          )
        );

        detailData.append(
          "Amount",
          String(
            Number(row.Amount || 0)
          )
        );

        detailData.append(
          "CreatedBy",
          String(CREATED_BY)
        );

        console.log(
          "DETAIL SAVE PAYLOAD:",
          Object.fromEntries(
            detailData.entries()
          )
        );

        const detailResponse =
          await fetch(
            "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
            {
              method: "POST",

              headers: {
                Accept:
                  "application/json",

                "Content-Type":
                  "application/x-www-form-urlencoded",
              },

              body:
                detailData.toString(),
            }
          );

        const detailText =
          await detailResponse.text();

        console.log(
          "DETAIL RESPONSE:",
          detailText
        );

        let detailResult = {};

        try {
          detailResult =
            detailText
              ? JSON.parse(detailText)
              : {};
        } catch {
          throw new Error(
            `Invalid Detail API response: ${detailText}`
          );
        }

        if (
          !detailResponse.ok ||
          detailResult?.success === false
        ) {
          throw new Error(
            detailResult?.message ||
              "Daily Stock Detail save failed"
          );
        }

        console.log(
          "DETAIL SAVED SUCCESSFULLY:",
          detailResult
        );
      }

      // ========================================================
      // ADD NEW RECORD TO TABLE
      // ========================================================
      const newEntry = {

        Id:
          Number(headerId),

        id:
          Number(headerId),

        EntryDate:
          entryDate,

        dateText:
          formatDate(entryDate),

        ShopId:
          STOCK_ENTRY_SHOP_ID,

        OfficeId:
          null,

        LocationType:
          "S",

        ShopName:
          "Stock Entry Shop",

        shop:
          "Stock Entry Shop",

        TotalAmount:
          Number(
            totalAmount || 0
          ),

        total:
          Number(
            totalAmount || 0
          ),
      };

      setStockEntries(
        (previous) => [
          newEntry,
          ...previous,
        ]
      );

      toast.success(
        "Stock Entry Shop saved successfully!"
      );
    }

    // ==========================================================
    // CLOSE FORM AFTER ACTUAL SAVE
    // ==========================================================
    setOpenForm(false);

    resetForm();

    setPageNo(1);

    // ==========================================================
    // REFRESH TABLE
    // ==========================================================
    await fetchDailyStockHeaders();

  } catch (error) {

    console.error(
      "STOCK ENTRY SHOP SAVE ERROR:",
      error
    );

    toast.error(
      error?.message ||
        "Unable to save Stock Entry Shop"
    );

  } finally {

    setSaving(false);
  }
};

  // ==========================================================
  // DELETE MAIN ENTRY
  // ==========================================================

  // ==========================================================
  // EDIT STOCK ENTRY SHOP
  // ==========================================================
  // ==========================================================
// EDIT STOCK ENTRY SHOP
// ==========================================================


const handleEditEntry = async (entry) => {
  try {
    console.log("====================================");
    console.log("EDIT STOCK ENTRY SHOP");
    console.log("ENTRY:", entry);
    console.log("====================================");

    // --------------------------------------------------
    // HEADER ID
    // --------------------------------------------------
    const headerId =
      entry?.Id ??
      entry?.id ??
      entry?.DailyStockHeaderId;

    if (!headerId) {
      toast.error(
        "Stock Entry Shop Header ID not found"
      );
      return;
    }

    console.log(
      "EDIT HEADER ID:",
      headerId
    );

    // --------------------------------------------------
    // SET EDITING ENTRY
    // --------------------------------------------------
    setEditingEntry({
      ...entry,
      Id: Number(headerId),
      id: Number(headerId),
    });

    // --------------------------------------------------
    // SET DATE
    // --------------------------------------------------
    const entryDate =
      entry?.EntryDate ??
      entry?.entryDate ??
      entry?.date;

    if (entryDate) {
      const parsedDate = new Date(entryDate);

      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }

    // --------------------------------------------------
    // CLEAR OLD QUANTITIES
    // --------------------------------------------------
    setProductQuantities({});

    // --------------------------------------------------
    // OPEN FORM
    // --------------------------------------------------
    setOpenForm(true);

    // --------------------------------------------------
    // IMPORTANT:
    // FETCH DETAILS USING HEADER ID
    // --------------------------------------------------
    const details =
      await fetchDailyStockDetail(headerId);

    console.log(
      "EDIT DAILY STOCK DETAILS:",
      details
    );

    if (!Array.isArray(details)) {
      console.error(
        "Invalid detail response:",
        details
      );

      toast.error(
        "Daily Stock details not found"
      );

      return;
    }

    // --------------------------------------------------
    // CREATE PRODUCT QUANTITY MAP
    // --------------------------------------------------
    const quantityMap = {};

    details.forEach((item) => {
      const productId =
        item?.ProductId ??
        item?.productId;

      if (
        productId === null ||
        productId === undefined ||
        String(productId).trim() === ""
      ) {
        return;
      }

      const detailId =
        item?.Id ??
        item?.id ??
        item?.DailyStockDetailId ??
        "";

      const quantity = Number(
        item?.Quantity ??
        item?.quantity ??
        0
      );

      const rate = Number(
        item?.Rate ??
        item?.rate ??
        0
      );

      quantityMap[String(productId)] = {
        quantity: quantity,
        rate: rate,
        detailId: detailId,
      };
    });

    console.log(
      "EDIT PRODUCT QUANTITY MAP:",
      quantityMap
    );

    // --------------------------------------------------
    // SET EXISTING DATA
    // --------------------------------------------------
    setProductQuantities(quantityMap);


    

    // ==========================================================
// ALSO SET PHYSICAL QUANTITIES FOR EDIT MODE
// ==========================================================
const physicalMap = {};

Object.keys(quantityMap).forEach((productId) => {
  physicalMap[productId] =
    quantityMap[productId]?.quantity ?? "";
});

setPhysicalQuantities(physicalMap);

    // --------------------------------------------------
    // ALSO UPDATE PRODUCT MASTER RATE
    // --------------------------------------------------
    setProductOptions((previousProducts) =>
      previousProducts.map((product) => {
        const saved =
          quantityMap[
            String(product.value)
          ];

        if (!saved) {
          return product;
        }

        return {
          ...product,
          rate:
            saved.rate !== undefined
              ? saved.rate
              : product.rate,
        };
      })
    );

  } catch (error) {
    console.error(
      "EDIT STOCK ENTRY SHOP ERROR:",
      error
    );

    toast.error(
      error?.message ||
        "Unable to load Stock Entry Shop"
    );
  }
};

  // const handleDeleteEntry = (id) => {
  //   setStockEntries((previousEntries) =>
  //     previousEntries.filter((item) => item.id !== id),
  //   );

  //   toast.success("Entry removed successfully");
  // };

  const handleDeleteEntry = async (id) => {
    if (!id) {
      toast.error("Stock Entry ID not found");
      return;
    }

    try {
      setSaving(true);

      const deleteUrl =
        `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
        `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

      console.log("DELETE STOCK ENTRY SHOP URL:", deleteUrl);

      const response = await fetch(deleteUrl, {
        method: "GET",
        redirect: "follow",
      });

      const resultText = await response.text();

      console.log("DELETE API STATUS:", response.status);

      console.log("DELETE API RESPONSE:", resultText);

      if (!response.ok) {
        throw new Error(`Delete API failed: ${response.status}`);
      }

      // Remove from UI after successful API delete
      setStockEntries((previousEntries) =>
        previousEntries.filter((item) => Number(item.id) !== Number(id)),
      );

      toast.success("Stock Entry Shop deleted successfully");
    } catch (error) {
      console.error("Delete Stock Entry Shop Error:", error);

      toast.error(error?.message || "Unable to delete Stock Entry Shop");
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
      // ====================================================
      // SR NO
      // ====================================================

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

        header: "Shop",

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
            <b>Stock Entry Shop </b>
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
              Stock Entry Shop
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
              {/* ==================================================
      STOCK ENTRY SHOP
  ================================================== */}
              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Stock Entry Shop:
                </Typography>

                <TextField
                  size="small"
                  fullWidth
                  value="Stock Entry Shop"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      borderRadius: "5px",
                    },

                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>

              {/* ==================================================
      DATE
  ================================================== */}
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

            {/* =========================================================
    PRODUCT SELECTION / QUANTITY / RATE / ADD
    NOT REQUIRED FOR STOCK ENTRY SHOP
    Products are shown directly in the table below.
========================================================= */}


 {/* ==========================================================
    PRODUCT SEARCH
========================================================== */}
<Box sx={{ mb: 2 }}>
  <Typography
    fontWeight={600}
    mb={0.5}
    fontSize="14px"
  >
    Product:
  </Typography>

  <TextField
    fullWidth
    size="small"
    value={productSearch}
    onChange={(e) => {
      setProductSearch(e.target.value);
    }}
    placeholder="Search Product / Code"
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "6px",
        backgroundColor: "#fff",
      },

      "& .MuiInputBase-input": {
        fontSize: "15px",
      },
    }}
  />
</Box>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                width: "100%",
                border: "1px solid #d0d0d0",
                borderRadius: "6px",
                overflowX: "hidden",
                overflowY: "visible",
              }}
            >
              <Table
                size="small"
                sx={{
                  width: "100%",
                  tableLayout: "fixed",

                  "& .MuiTableCell-root": {
                    border: "1px solid #d0d0d0",
                  },
                }}
              >
                {/* =====================================================
        TABLE HEADER
    ===================================================== */}
      <TableHead>
  <TableRow
    sx={{
      backgroundColor: "#e9ecef",
    }}
  >
    {/* PRODUCT CODE */}
    <TableCell
      sx={{
        width: "18%",
        fontWeight: 700,
        fontSize: "14px",
        whiteSpace: "nowrap",
      }}
    >
      Product Code
    </TableCell>

    {/* PRODUCT NAME */}
    <TableCell
      sx={{
        width: "42%",
        fontWeight: 700,
        fontSize: "14px",
        whiteSpace: "nowrap",
      }}
    >
      Product Name
    </TableCell>

    {/* QUANTITY */}
    <TableCell
      align="center"
      sx={{
        width: "20%",
        fontWeight: 700,
        fontSize: "14px",
        whiteSpace: "nowrap",
      }}
    >
      Quantity
    </TableCell>

    {/* RATE */}
    <TableCell
      align="right"
      sx={{
        width: "20%",
        fontWeight: 700,
        fontSize: "14px",
        whiteSpace: "nowrap",
      }}
    >
      Rate
    </TableCell>
  </TableRow>
</TableHead>

                {/* =====================================================
        TABLE BODY
    ===================================================== */}

<TableBody>
  {loadingProducts ? (
    <TableRow>
      <TableCell
        colSpan={4}
        align="center"
        sx={{ py: 4 }}
      >
        Loading Products...
      </TableCell>
    </TableRow>
  ) : filteredProductOptions.length === 0 ? (
    <TableRow>
      <TableCell
        colSpan={4}
        align="center"
        sx={{ py: 4 }}
      >
        No Products Found
      </TableCell>
    </TableRow>
  ) : (
    filteredProductOptions.map((product) => {
      const savedValue =
        productQuantities[
          String(product.value)
        ];

      // ================================
      // DEFAULT QUANTITY = 0
      // ================================
      const quantity =
        savedValue &&
        typeof savedValue === "object"
          ? savedValue?.quantity ?? 0
          : savedValue ?? 0;

      // ================================
      // CURRENT RATE
      // ================================
      const rate =
        productRates[
          String(product.value)
        ] ?? Number(product.rate || 0);

      return (
        <TableRow
          key={String(product.value)}
          hover
        >

          {/* PRODUCT CODE */}
          <TableCell>
            {product.productCode || "-"}
          </TableCell>

          {/* PRODUCT NAME */}
          <TableCell>
            {product.label || "-"}
          </TableCell>

          {/* ============================
              QUANTITY
          ============================ */}
          <TableCell align="center">
            <TextField
              type="number"
              size="small"

              value={quantity}

              onChange={(e) => {
                handleProductQuantityChange(
                  product.value,
                  e.target.value
                );
              }}

              onKeyDown={(e) => {
                handleQuantityKeyDown(
                  e,
                  product.value
                );
              }}

              inputRef={(input) => {
                quantityInputRefs.current[
                  String(product.value)
                ] = input;
              }}

             inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}

              sx={{
                width: 110,

                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                },

                "& .MuiInputBase-input": {
                  textAlign: "center",
                  fontSize: "15px",
                },
              }}
            />
          </TableCell>

          {/* ============================
              EDITABLE RATE
          ============================ */}
          <TableCell align="center">
            <TextField
              type="number"
              size="small"

              value={rate}

              onChange={(e) => {
                const value =
                  e.target.value;

                setProductRates((prev) => ({
                  ...prev,

                  [String(product.value)]:
                    value === ""
                      ? 0
                      : Number(value),
                }));
              }}

             inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}

              sx={{
                width: 110,

                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                },

                "& .MuiInputBase-input": {
                  textAlign: "right",
                  fontSize: "15px",
                },
              }}
            />
          </TableCell>

        </TableRow>
      );
    })
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
            ></Box>
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
  onClick={() => handleSave(false)}
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

        {/* ==========================================================
    STOCK COMPARISON REPORT
========================================================== */}

<Dialog
  open={openReport}
  onClose={() => setOpenReport(false)}
  fullWidth
  maxWidth="xl"
  PaperProps={{
    sx: {
      borderRadius: "8px",
      maxHeight: "90vh",
    },
  }}
>
  {/* REPORT HEADER */}
  <DialogTitle
    sx={{
      backgroundColor: "rgb(236, 253, 230)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #ddd",
      fontWeight: 700,
      color: "#0B5E20",
    }}
  >
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: "20px",
      }}
    >
      Daily Stock Comparison Report
    </Typography>

    <IconButton
      onClick={() => setOpenReport(false)}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  {/* REPORT CONTENT */}
  <DialogContent dividers>
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid #d0d0d0",
        borderRadius: "6px",
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        sx={{
          minWidth: 1000,

          "& .MuiTableCell-root": {
            border: "1px solid #d0d0d0",
          },
        }}
      >
   <TableHead>
  <TableRow>

    <TableCell
      sx={{ fontWeight: 700 }}
    >
      Product Code
    </TableCell>

    <TableCell
      sx={{ fontWeight: 700 }}
    >
      Product Name
    </TableCell>

    <TableCell
      align="center"
      sx={{ fontWeight: 700 }}
    >
      Sale
    </TableCell>

    <TableCell
      align="center"
      sx={{ fontWeight: 700 }}
    >
      Daily Stock
    </TableCell>

    <TableCell
      align="center"
      sx={{ fontWeight: 700 }}
    >
      Difference
    </TableCell>

  </TableRow>
</TableHead>

     <TableBody>
  {productOptions.map((product) => {

    const productId = String(product.value);

    const savedValue =
      productQuantities?.[productId];

    const quantity =
      typeof savedValue === "object"
        ? savedValue?.quantity ?? ""
        : savedValue ?? "";

    const rate =
      product.rate ??
      product.SaleRate ??
      product.Price ??
      "";

    return (
      <TableRow
        key={productId}
        hover
      >

        <TableCell>
          {product.productCode || "-"}
        </TableCell>

        <TableCell>
          {product.label || "-"}
        </TableCell>

        <TableCell align="center">
          <TextField
            size="small"
            type="number"
            value={quantity}
            placeholder="Enter Qty"
            onChange={(e) => {
              handleProductQuantityChange(
                product.value,
                e.target.value
              );
            }}
           inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}
            sx={{
              width: "110px",
              "& input": {
                textAlign: "center",
              },
            }}
          />
        </TableCell>

        <TableCell align="right">
          <TextField
            size="small"
            type="number"
            value={rate}
            onChange={(e) => {

              const value =
                e.target.value;

              setProductOptions((prevProducts) =>
                prevProducts.map((item) =>
                  String(item.value) === productId
                    ? {
                        ...item,
                        rate:
                          value === ""
                            ? ""
                            : Number(value),
                      }
                    : item
                )
              );

            }}
            inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}
            sx={{
              width: "100px",
              "& input": {
                textAlign: "right",
              },
            }}
          />
        </TableCell>

      </TableRow>
    );
  })}
</TableBody>
        
      </Table>
    </TableContainer>
  </DialogContent>

  {/* CLOSE */}
  <DialogActions
    sx={{
      justifyContent: "flex-end",
      px: 2,
      py: 1.5,
    }}
  >
    <Button
      variant="contained"
      onClick={() => setOpenReport(false)}
      sx={{
        textTransform: "none",
        backgroundColor: "var(--primary-color)",
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


{/* ==========================================================
    SAVE COMPARISON POPUP
========================================================== */}

{/* ==========================================================
    SAVE COMPARISON POPUP
========================================================== */}

<Dialog
  open={openComparisonPopup}
  onClose={() => {
    if (!saving) {
      setOpenComparisonPopup(false);
    }
  }}
  fullWidth
  maxWidth="md"
>
  <DialogTitle
    sx={{
      backgroundColor: "#ecfde6",
      color: "#0B5E20",
      fontWeight: 700,
    }}
  >
    Stock Comparison
  </DialogTitle>

  <DialogContent dividers>

    <Typography
      sx={{
        mb: 2,
        fontWeight: 600,
        fontSize: "15px",
      }}
    >
      Please verify the stock before saving.
    </Typography>


    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid #ddd",
        borderRadius: "6px",
      }}
    >

      <Table size="small">

        {/* ==================================================
            TABLE HEADER
        =================================================== */}

        <TableHead>

          <TableRow>

            {/* PRODUCT CODE */}
            <TableCell
              sx={{
                fontWeight: 700,
              }}
            >
              Product Code
            </TableCell>


            {/* PRODUCT NAME */}
            <TableCell
              sx={{
                fontWeight: 700,
              }}
            >
              Product Name
            </TableCell>


          {/* SALE */}
<TableCell
  align="center"
  sx={{
    fontWeight: 700,
  }}
>
  Sale
</TableCell>


            {/* DAILY STOCK */}
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
              }}
            >
              Daily Stock
            </TableCell>


            {/* DIFFERENCE */}
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
              }}
            >
              Difference
            </TableCell>

          </TableRow>

        </TableHead>


        {/* ==================================================
            TABLE BODY
        =================================================== */}

        <TableBody>

          {comparisonRows.length === 0 ? (

            <TableRow>

              <TableCell
                colSpan={5}
                align="center"
              >
                No comparison data available
              </TableCell>

            </TableRow>

          ) : (

           comparisonRows.map((row) => (
  <TableRow
    key={String(row.ProductId)}
  >

    {/* PRODUCT CODE */}
    <TableCell>
      {row.ProductCode || "-"}
    </TableCell>

    {/* PRODUCT NAME */}
    <TableCell>
      {row.ProductName || "-"}
    </TableCell>

    {/* SALE */}
    <TableCell
      align="center"
      sx={{
        fontWeight: 700,
      }}
    >
      {Number(row.Sold || 0)}
    </TableCell>

    {/* DAILY STOCK */}
    <TableCell
      align="center"
      sx={{
        fontWeight: 700,
      }}
    >
      {Number(row.Physical || 0)}
    </TableCell>

    {/* DIFFERENCE */}
    <TableCell
      align="center"
      sx={{
        fontWeight: 700,
        color:
          Number(row.Difference || 0) === 0
            ? "green"
            : "red",
      }}
    >
      {Number(row.Difference || 0)}
    </TableCell>

  </TableRow>
))
          )}

        </TableBody>

      </Table>

    </TableContainer>

  </DialogContent>


  {/* ========================================================
      ACTION BUTTONS
  ========================================================= */}

  <DialogActions
    sx={{
      px: 2,
      py: 1.5,
      gap: 1,
    }}
  >

    {/* CANCEL */}
    <Button
      variant="outlined"
      disabled={saving}
      onClick={() => {
        setOpenComparisonPopup(false);
      }}
      sx={{
        textTransform: "none",
        color: "var(--complementary-color)",
        borderColor: "var(--complementary-color)",
      }}
    >
      Cancel
    </Button>


    {/* CONFIRM SAVE */}
    <Button
      variant="contained"
      disabled={saving}
      onClick={async () => {

        setOpenComparisonPopup(false);

        // ACTUAL SAVE
        await handleSave(true);

      }}
      sx={{
        textTransform: "none",
        background: "var(--primary-color)",

        "&:hover": {
          background: "var(--primary-color)",
        },
      }}
    >
      {saving ? "Saving..." : "Confirm Save"}
    </Button>

  </DialogActions>

</Dialog>

      </Box>
    </LocalizationProvider>
  );
};

export default EntryShop;




















