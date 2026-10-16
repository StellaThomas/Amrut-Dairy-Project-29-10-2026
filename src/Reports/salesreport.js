
// import { useState, useMemo } from 'react';
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button } from '@mui/material';
// import autoTable from 'jspdf-autotable';
// import jsPDF from 'jspdf';
// import PrintIcon from '@mui/icons-material/Print';

// import { saveAs } from "file-saver";
// import ExcelJS from "exceljs";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import moment from 'moment';
// import { useMaterialReactTable, } from "material-react-table";
// import { MaterialReactTable, } from 'material-react-table';
// import { MRT_TablePagination as MUITablePagination } from "material-react-table";


// const SalesReport = () => {
//    const today = new Date();

// const [fromDate, setFromDate] = useState(today);
// const [toDate, setToDate] = useState(today);
//     const [salesData, setSalesData] = useState([]);
//     const [showTable, setShowTable] = useState(false);
//     const [previewOpen, setPreviewOpen] = useState(false);


// const getSalesReport = async () => {
//     try {

//         // =====================================================
//         // DATE FORMAT
//         // =====================================================
//         const formatDate = (date) => {
//             if (!date) return "";

//             const d = new Date(date);

//             return `${d.getFullYear()}-${String(
//                 d.getMonth() + 1
//             ).padStart(2, "0")}-${String(
//                 d.getDate()
//             ).padStart(2, "0")}`;
//         };


//         // =====================================================
// // NORMALIZE API DATE
// // =====================================================
// const normalizeApiDate = (value) => {
//     if (!value) return "";

//     // API date object
//     if (typeof value === "object" && value?.date) {
//         return String(value.date).substring(0, 10);
//     }

//     // Normal string date
//     if (typeof value === "string") {
//         return value.substring(0, 10);
//     }

//     return "";
// };




//         const selectedFromDate = formatDate(fromDate);
//         const selectedToDate = formatDate(toDate);

//         console.log(
//             "SELECTED DATE RANGE:",
//             selectedFromDate,
//             "TO",
//             selectedToDate
//         );

//         // =====================================================
//         // 1. GET INVOICE HEADER - PAGE 1
//         // =====================================================
//         const firstResponse = await fetch(
//             "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1"
//         );

//         if (!firstResponse.ok) {
//             throw new Error(
//                 `Invoice Header API Error: ${firstResponse.status}`
//             );
//         }

//         const firstResult = await firstResponse.json();

//         console.log(
//             "INVOICE HEADER PAGE 1:",
//             firstResult
//         );

//         // =====================================================
//         // CHECK RESPONSE FORMAT
//         // =====================================================
//         const totalPages = Number(
//             firstResult?.total_pages ||
//             firstResult?.TotalPages ||
//             firstResult?.pages ||
//             1
//         );

//         console.log(
//             "TOTAL INVOICE PAGES:",
//             totalPages
//         );

//         // =====================================================
//         // PAGE 1 DATA
//         // =====================================================
//         const firstPageData =
//             Array.isArray(firstResult)
//                 ? firstResult
//                 : Array.isArray(firstResult?.data)
//                     ? firstResult.data
//                     : [];

//         // =====================================================
//         // GET REMAINING PAGES
//         // =====================================================
//         let allInvoiceHeaders = [
//             ...firstPageData
//         ];

//         if (totalPages > 1) {

//             const pageRequests = [];

//             for (
//                 let page = 2;
//                 page <= totalPages;
//                 page++
//             ) {
//                 pageRequests.push(
//                     fetch(
//                         `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}`
//                     ).then((res) => res.json())
//                 );
//             }

//             const remainingPages =
//                 await Promise.all(pageRequests);

//             remainingPages.forEach((pageResult) => {

//                 const pageData =
//                     Array.isArray(pageResult)
//                         ? pageResult
//                         : Array.isArray(pageResult?.data)
//                             ? pageResult.data
//                             : [];

//                 allInvoiceHeaders.push(
//                     ...pageData
//                 );
//             });
//         }

//        console.log(
//     "TOTAL INVOICE HEADERS:",
//     allInvoiceHeaders.length
// );

// console.log(
//     "ALL API INVOICE DATES:",
//     [...new Set(
//         allInvoiceHeaders.map((invoice) => {
//             const value = invoice?.InvoiceDate;

//             if (value && typeof value === "object") {
//                 return value.date;
//             }

//             return value;
//         })
//     )]
// );

//         // =====================================================
//         // 2. DATE FILTER
//         // =====================================================
//         // const dateFilteredInvoices =
//         //     allInvoiceHeaders.filter((invoice) => {

//         //         const rawInvoiceDate =
//         //             invoice?.InvoiceDate;

//         //         let invoiceDate = "";

//         //         if (
//         //             typeof rawInvoiceDate === "object" &&
//         //             rawInvoiceDate?.date
//         //         ) {
//         //             invoiceDate =
//         //                 String(
//         //                     rawInvoiceDate.date
//         //                 ).substring(0, 10);
//         //         }
//         //         else if (rawInvoiceDate) {
//         //             invoiceDate =
//         //                 String(
//         //                     rawInvoiceDate
//         //                 ).substring(0, 10);
//         //         }

//         //         const match =
//         //             invoiceDate >= selectedFromDate &&
//         //             invoiceDate <= selectedToDate;

//         //         console.log(
//         //             "DATE CHECK:",
//         //             invoice?.InvoiceNo,
//         //             invoiceDate,
//         //             match
//         //         );

//         //         return match;
//         //     });




        
// const dateFilteredInvoices = allInvoiceHeaders.filter((invoice) => {
//     const rawInvoiceDate = invoice?.InvoiceDate;

//     if (!rawInvoiceDate) {
//         return false;
//     }

//     // 1. Normalize API date
//     let invoiceDate = "";

//     if (
//         typeof rawInvoiceDate === "object" &&
//         rawInvoiceDate !== null
//     ) {
//         invoiceDate = String(
//             rawInvoiceDate.date ?? ""
//         ).trim();
//     } else {
//         invoiceDate = String(rawInvoiceDate).trim();
//     }

//     if (!invoiceDate) {
//         return false;
//     }

//     // 2. Extract date portion if time is also present
//     invoiceDate = invoiceDate.substring(0, 10);

//     // 3. Convert DD-MM-YYYY to YYYY-MM-DD
//     if (/^\d{2}-\d{2}-\d{4}$/.test(invoiceDate)) {
//         const [day, month, year] = invoiceDate.split("-");

//         invoiceDate = `${year}-${month}-${day}`;
//     }

//     // 4. Convert DD/MM/YYYY to YYYY-MM-DD
//     else if (/^\d{2}\/\d{2}\/\d{4}$/.test(invoiceDate)) {
//         const [day, month, year] = invoiceDate.split("/");

//         invoiceDate = `${year}-${month}-${day}`;
//     }

//     // 5. Validate normalized date format
//     if (!/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
//         console.warn(
//             "INVALID INVOICE DATE:",
//             invoice?.InvoiceNo,
//             rawInvoiceDate
//         );

//         return false;
//     }

//     // 6. Compare dates in YYYY-MM-DD format
//     const match =
//         invoiceDate >= selectedFromDate &&
//         invoiceDate <= selectedToDate;

//     console.log("DATE CHECK:", {
//         InvoiceNo: invoice?.InvoiceNo,
//         OriginalDate: rawInvoiceDate,
//         NormalizedDate: invoiceDate,
//         FromDate: selectedFromDate,
//         ToDate: selectedToDate,
//         Match: match,
//     });

//     return match;
// });

// console.log(
//     "DATE FILTERED INVOICE COUNT:",
//     dateFilteredInvoices.length
// );


        






// // =====================================================
// // PRODUCT MASTER
// // =====================================================
// const productResponse = await fetch(
//     "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster"
// );

// if (!productResponse.ok) {
//     throw new Error(
//         `Product Master API Error: ${productResponse.status}`
//     );
// }

// const productResult = await productResponse.json();

// const productList =
//     Array.isArray(productResult)
//         ? productResult
//         : Array.isArray(productResult?.data)
//             ? productResult.data
//             : [];

// console.log("PRODUCT MASTER:", productList);

// // ProductId -> ProductName
// const productMap = new Map();

// productList.forEach((product) => {
//     const id =
//         product?.Id ??
//         product?.ProductId ??
//         product?.ProductCode;

//     const name =
//         product?.ProductName ??
//         product?.name ??
//         "";

//     if (id != null) {
//         productMap.set(
//             String(id),
//             name
//         );
//     }
// });

// console.log("PRODUCT MAP:", productMap);




//       // =====================================================
// // CUSTOMER INFO CACHE
// // =====================================================
// const customerInfoCache = new Map();

// // =====================================================
// // GET CUSTOMER TYPE + CUSTOMER NAME
// // =====================================================
// const getCustomerInfo = async (accountId) => {

//     // -------------------------------------------------
//     // AccountId = 0 => Regular Sale
//     // -------------------------------------------------
//     if (!accountId || Number(accountId) === 0) {
//         return {
//             type: "R",
//             name: ""
//         };
//     }

//     const cacheKey = String(accountId);

//     if (customerInfoCache.has(cacheKey)) {
//         return customerInfoCache.get(cacheKey);
//     }

//     let customerType = "";
//     let customerName = "";

//     try {

//         // =================================================
//         // ACCOUNT API
//         // =================================================
//         const accountResponse = await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=account&Colname=Id&Colvalue=${accountId}`
//         );

//         if (accountResponse.ok) {

//             const accountResult =
//                 await accountResponse.json();

//             console.log(
//                 "ACCOUNT RESPONSE:",
//                 accountId,
//                 accountResult
//             );

//             const account =
//                 Array.isArray(accountResult)
//                     ? accountResult[0]
//                     : Array.isArray(accountResult?.data)
//                         ? accountResult.data[0]
//                         : accountResult?.data ||
//                           accountResult ||
//                           null;

//             if (account) {

//                 // -------------------------------
//                 // CUSTOMER TYPE
//                 // -------------------------------
//                 customerType = String(
//                     account?.CustomerType ||
//                     account?.customerType ||
//                     ""
//                 )
//                     .trim()
//                     .toUpperCase();

//                 // -------------------------------
//                 // CUSTOMER NAME
//                 // -------------------------------
//                 customerName =
//                     account?.AccountName ||
//                     account?.accountName ||
//                     account?.Name ||
//                     account?.name ||
//                     "";
//             }
//         }

//         // =================================================
//         // ADDRESS API - ONLY IF TYPE NOT FOUND
//         // =================================================
//         if (!customerType) {

//             const addressResponse = await fetch(
//                 `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`
//             );

//             if (addressResponse.ok) {

//                 const addressResult =
//                     await addressResponse.json();

//                 console.log(
//                     "ADDRESS RESPONSE:",
//                     accountId,
//                     addressResult
//                 );

//                 const address =
//                     Array.isArray(addressResult)
//                         ? addressResult[0]
//                         : Array.isArray(addressResult?.data)
//                             ? addressResult.data[0]
//                             : addressResult?.data ||
//                               addressResult ||
//                               null;

//                 if (address) {

//                     customerType = String(
//                         address?.CustomerType ||
//                         address?.customerType ||
//                         ""
//                     )
//                         .trim()
//                         .toUpperCase();

//                     if (!customerName) {
//                         customerName =
//                             address?.AccountName ||
//                             address?.accountName ||
//                             address?.Name ||
//                             address?.name ||
//                             "";
//                     }
//                 }
//             }
//         }

//     } catch (error) {

//         console.error(
//             "CUSTOMER INFO ERROR:",
//             accountId,
//             error
//         );
//     }

//     // =================================================
//     // NORMALIZE CUSTOMER TYPE
//     // =================================================

//     if (
//         customerType === "D" ||
//         customerType === "DEALER"
//     ) {
//         customerType = "D";
//     }
//     else if (
//         customerType === "C" ||
//         customerType === "CATERER" ||
//         customerType === "CATERERS"
//     ) {
//         customerType = "C";
//     }
//     else {
//         customerType = "R";
//     }

//     const result = {
//         type: customerType,
//         name: customerName
//     };

//     customerInfoCache.set(
//         cacheKey,
//         result
//     );

//     return result;
// };

//         // =====================================================
//         // 5. GET DETAILS FOR EACH INVOICE
//         // =====================================================
//         const finalReportData = [];

//         for (
//             const invoice of dateFilteredInvoices
//         ) {

//             const invoiceId =
//                 invoice?.Id ??
//                 invoice?.InvoiceId;

//             const accountId =
//                 invoice?.AccountId ?? 0;

//             console.log(
//                 "PROCESSING INVOICE:",
//                 invoice?.InvoiceNo,
//                 "InvoiceId:",
//                 invoiceId,
//                 "AccountId:",
//                 accountId
//             );

//             // =================================================
//             // CATEGORY
//             // =================================================
//            const customerInfo =
//     await getCustomerInfo(
//         accountId
//     );

// const customerType =
//     customerInfo.type;

//             let category = "Regular";

//             if (
//                 customerType === "D"
//             ) {
//                 category = "Dealer";
//             }
//             else if (
//                 customerType === "C"
//             ) {
//                 category = "Caterers";
//             }

//             // =================================================
//             // CUSTOMER NAME
//             // =================================================
//            const accountName =
//     invoice?.AccountName ||
//     invoice?.CustomerName ||
//     customerInfo.name ||
//     "N/A";

//             // =================================================
//             // GET INVOICE DETAILS
//             // =================================================
//             if (!invoiceId) {
//                 continue;
//             }

//             try {

//                 const detailResponse =
//                     await fetch(
//                         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//                     );

//                 if (!detailResponse.ok) {
//                     continue;
//                 }

//                 const detailResult =
//                     await detailResponse.json();

//                 const details =
//                     Array.isArray(detailResult)
//                         ? detailResult
//                         : Array.isArray(
//                             detailResult?.data
//                         )
//                             ? detailResult.data
//                             : [];

//                 // =================================================
//                 // IF NO DETAIL
//                 // =================================================
//                 if (details.length === 0) {

//                     finalReportData.push({

//                         InvoiceNo:
//                             invoice?.InvoiceNo,

//                        InvoiceDate:
//     normalizeApiDate(invoice?.InvoiceDate),

//                         AccountName:
//                             accountName,

//                         Category:
//                             category,

//                         OrderNo:
//                             invoice?.OrderNo || "",

//                         OrderDate:
//                             invoice?.OrderDate || "",

//                         ProductName:
//                             "",

//                         Rate:
//                             0,

//                         Quantity:
//                             0,

//                         Amount:
//                             Number(
//                                 invoice?.Total ||
//                                 invoice?.TotalAmount ||
//                                 0
//                             ),

//                         Transport:
//                             Number(
//                                 invoice?.Transport || 0
//                             ),

//                         "Product Subtotal":
//                             Number(
//                                 invoice?.SubTotal ||
//                                 invoice?.Subtotal ||
//                                 0
//                             ),

//                         "Total amt":
//                             Number(
//                                 invoice?.Total ||
//                                 invoice?.TotalAmount ||
//                                 0
//                             ),
//                     });

//                     continue;
//                 }

//                 // =================================================
//                 // ADD EACH PRODUCT
//                 // =================================================
// details.forEach((detail, index) => {
//     finalReportData.push({
//         InvoiceNo: invoice?.InvoiceNo,

//         InvoiceDate: normalizeApiDate(invoice?.InvoiceDate),

//         AccountName: accountName,

//         Category: category,

//         OrderNo: invoice?.OrderNo || "",

//         OrderDate: normalizeApiDate(invoice?.OrderDate),

//        ProductName:
//     detail?.ProductName ||
//     detail?.productName ||
//     productMap.get(
//         String(
//             detail?.ProductId ??
//             detail?.ProductCode ??
//             ""
//         )
//     ) ||
//     "Unknown Product",

//         Rate: Number(
//             detail?.Rate ??
//             detail?.rate ??
//             0
//         ),

//         Quantity: Number(
//             detail?.Quantity ??
//             detail?.quantity ??
//             0
//         ),

//         Amount: Number(
//             detail?.Amount ??
//             detail?.amount ??
//             0
//         ),

//         Transport:
//             index === 0
//                 ? Number(invoice?.Transport ?? 0)
//                 : 0,

//         "Product Subtotal": Number(
//             detail?.["Product Subtotal"] ??
//             detail?.ProductSubtotal ??
//             detail?.Amount ??
//             0
//         ),

//         "Total amt":
//             index === 0
//                 ? Number(
//                     invoice?.Total ??
//                     invoice?.TotalAmount ??
//                     0
//                 )
//                 : 0
//     });
// });

//             } catch (detailError) {

//                 console.error(
//                     "DETAIL API ERROR:",
//                     invoiceId,
//                     detailError
//                 );
//             }
//         }

//         // =====================================================
//         // 6. FINAL RESULT
//         // =====================================================
//         console.log(
//             "FINAL SALES REPORT DATA:",
//             finalReportData
//         );

//         console.log(
//             "FINAL SALES REPORT COUNT:",
//             finalReportData.length
//         );

//         // =====================================================
//         // 7. SET DATA
//         // =====================================================
//         setSalesData(
//             finalReportData
//         );

//         setShowTable(true);
//         setPreviewOpen(true);

//     } catch (error) {

//         console.error(
//             "SALES REPORT ERROR:",
//             error
//         );

//         setSalesData([]);

//         setShowTable(true);
//         setPreviewOpen(true);

//         alert(
//             "Sales Report data load failed."
//         );
//     }
// };

//     const handleGetSalesReport = () => {
//         if (!fromDate || !toDate) {
//             alert("Please select both From Date and To Date.");
//             return;
//         }
//         getSalesReport();
//     };


   


//   const generatePDF = () => {
//     const doc = new jsPDF();

//     if (!Array.isArray(salesData) || salesData.length === 0) {
//         alert("No sales data available");
//         return;
//     }

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     let y = 25;

//     // =====================================================
//     // PAGE BORDER
//     // =====================================================

//     doc.setLineWidth(0.5);

//     doc.rect(
//         5,
//         5,
//         pageWidth - 10,
//         pageHeight - 10
//     );

//     // =====================================================
//     // HEADER
//     // =====================================================

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(20);

//     doc.text(
//         "AMRUT MILK PRODUCTS 2",
//         pageWidth / 2,
//         y,
//         {
//             align: "center",
//         }
//     );

//     // =====================================================
//     // HEADER LINE
//     // =====================================================

//     y += 10;

//     doc.setLineWidth(0.5);

//     doc.line(
//         10,
//         y,
//         pageWidth - 10,
//         y
//     );

//     y += 8;

//     // =====================================================
//     // TABLE HEADERS
//     // =====================================================

//     const tableHeaders = [
//         "Invoice No",
//         "Invoice Date",
//         "Account Name",
//         "Category",
//         "Product Name",
//         "Rate",
//         "Quantity",
//         "Amount",
//         "Transport",
//         "Sub Total",
//         "Total amount",
//     ];

//     // =====================================================
//     // TABLE DATA
//     // =====================================================

//     const tableData = salesData.map((item) => [
//         item.InvoiceNo || "-",
//         item.InvoiceDate || "-",
//         item.AccountName || "-",
//         item.Category || "Regular",
//         item.ProductName || "-",
//         Number(item.Rate || 0).toFixed(2),
//         Number(item.Quantity || 0).toFixed(3),
//         Number(item.Amount || 0).toFixed(2),
//         Number(item.Transport || 0).toFixed(2),
//         Number(item["Product Subtotal"] || 0).toFixed(2),
//         Number(item["Total amt"] || 0).toFixed(2),
//     ]);

//     // =====================================================
//     // GRAND TOTAL
//     // =====================================================

//     const grandTotal = salesData.reduce(
//         (acc, row) =>
//             acc + (Number(row["Total amt"]) || 0),
//         0
//     );

//     // =====================================================
//     // TABLE
//     // =====================================================

//     autoTable(doc, {
//         head: [tableHeaders],

//         body: tableData,

//         startY: y,

//         margin: {
//             left: 8,
//             right: 8,
//         },

//         theme: "grid",

//         styles: {
//             font: "helvetica",
//             fontSize: 7,
//             cellPadding: 1.5,
//             textColor: 0,
//             lineColor: [180, 180, 180],
//             lineWidth: 0.2,
//         },

//         headStyles: {
//             fillColor: [245, 245, 245],
//             textColor: 0,
//             fontStyle: "bold",
//             fontSize: 7,
//         },

//         // =================================================
//         // COLUMN ALIGNMENT
//         // =================================================

//         columnStyles: {
//             0: {
//                 halign: "center",
//             },

//             1: {
//                 halign: "center",
//             },

//             5: {
//                 halign: "right",
//             },

//             6: {
//                 halign: "right",
//             },

//             7: {
//                 halign: "right",
//             },

//             8: {
//                 halign: "right",
//             },

//             9: {
//                 halign: "right",
//             },

//             10: {
//                 halign: "right",
//             },
//         },

//         // =================================================
//         // GRAND TOTAL
//         // =================================================

//         foot: [
//             [
//                 {
//                     content: "Grand Total",
//                     colSpan: 10,
//                     styles: {
//                         halign: "right",
//                         fontStyle: "bold",
//                     },
//                 },

//                 {
//                     content: grandTotal.toFixed(2),
//                     styles: {
//                         halign: "right",
//                         fontStyle: "bold",
//                     },
//                 },
//             ],
//         ],

//         footStyles: {
//             fillColor: [245, 245, 245],
//             textColor: 0,
//             fontStyle: "bold",
//             fontSize: 8,
//         },

//         // =================================================
//         // PAGE BORDER ON EVERY PAGE
//         // =================================================

//         didDrawPage: () => {
//             doc.setLineWidth(0.5);

//             doc.rect(
//                 5,
//                 5,
//                 pageWidth - 10,
//                 pageHeight - 10
//             );
//         },
//     });

//     // =====================================================
//     // SAVE PDF
//     // =====================================================

//     doc.save("Sales_Report_Preview.pdf");
// };


//     const exportToExcel = async (data) => {
//         if (!data || data.length === 0) {
//             alert("No data available to export");
//             return;
//         }

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("SalesReport");

//         // Define header row
//        const headers = [
//     "Invoice No",
//     "Invoice Date",
//     "Account Name",
//     "Category",
//     "Product Name",
//     "Rate",
//     "Quantity (Nos)",
//     "Amount (Rs)",
//     "Transport",
//     "Sub Total",
//     "Total Amount",
// ];

//         worksheet.addRow(headers);

//         // Style header
//         worksheet.getRow(1).eachCell((cell) => {
//             cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
//             cell.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "FF4F81BD" }, // Blue header background
//             };
//             cell.alignment = { horizontal: "center", vertical: "middle" };
//         });

//         // Add data rows
//        data.forEach((item) => {

//     worksheet.addRow([

//         item.InvoiceNo,

//         item.InvoiceDate,

//         item.AccountName || "N/A",

//         item.Category || "Regular",

//         item.ProductName || "N/A",

//         Number(item.Rate) || 0,

//         Number(item.Quantity) || 0,

//         Number(item.Amount) || 0,

//         Number(item.Transport) || 0,

//         Number(item["Product Subtotal"]) || 0,

//         Number(item["Total amt"]) || 0,

//     ]);

// });

//         // Auto-fit columns
//         worksheet.columns.forEach((col) => {
//             let maxLength = 10;
//             col.eachCell({ includeEmpty: true }, (cell) => {
//                 const columnLength = cell.value ? cell.value.toString().length : 0;
//                 if (columnLength > maxLength) maxLength = columnLength;
//             });
//             col.width = maxLength + 5;
//         });

//         // Add Grand Total row
//         const totalRowIndex = worksheet.lastRow.number + 2;
//         const totalRow = worksheet.getRow(totalRowIndex);
//         totalRow.getCell(11).value = "Grand Total";
//         totalRow.getCell(11).font = { bold: true, size: 14 };
//         totalRow.getCell(11).alignment = { horizontal: "right" };

//         totalRow.getCell(12).value = { formula: `SUM(L2:L${worksheet.lastRow.number - 2})` };
//         // totalRow.getCell(13).value = { formula: `SUM(M2:M${worksheet.lastRow.number - 2})` };

//         // Style Grand Total row
//         totalRow.eachCell((cell) => {
//             cell.font = { bold: true, size: 14, color: { argb: "FF000000" } }; // Black bold text
//             cell.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "FFFFE699" }, // Light yellow background
//             };
//             cell.alignment = { horizontal: "center", vertical: "middle" };
//             cell.border = {
//                 top: { style: "thin" },
//                 bottom: { style: "thin" },
//             };
//         });

//         // Generate file
//         const buffer = await workbook.xlsx.writeBuffer();
//         const blob = new Blob([buffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });
//         saveAs(blob, `SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     };


  

//  const columns = useMemo(() => {
//     return [

//         {
//             accessorKey: 'InvoiceNo',
//             header: 'Invoice No',
//             size: 100,
//         },

//         {
//             accessorKey: 'InvoiceDate',
//             header: 'Invoice Date',
//             size: 50,

//             Cell: ({ cell }) => (
//                 <span>
//                     {moment(cell.getValue()).format('DD-MM-YYYY')}
//                 </span>
//             ),
//         },

//         {
//             accessorKey: 'AccountName',
//             header: 'Account Name',
//             size: 100,
//         },

//         {
//             accessorKey: 'Category',
//             header: 'Category',
//             size: 80,
//         },

      

       

//         {
//             accessorKey: 'ProductName',
//             header: 'Product Name',
//             size: 100,
//         },

//         {
//             accessorKey: 'Rate',
//             header: 'Rate',
//             size: 70,
//         },

//         {
//             accessorKey: 'Quantity',
//             header: 'Quantity',
//             size: 70,
//         },

//         {
//             accessorKey: 'Amount',
//             header: 'Amount',
//             size: 80,
//         },

//         {
//             accessorKey: 'Transport',
//             header: 'Transport',
//             size: 80,
//         },

//         {
//             accessorKey: 'Product Subtotal',
//             header: 'Sub Total',
//             size: 100,

//             Cell: ({ cell }) =>
//                 Number(cell.getValue() || 0).toFixed(2),
//         },

//         // {
//         //     accessorKey: 'Total amt',
//         //     header: 'Total Amount',
//         //     size: 100,

//         //     Cell: ({ cell }) =>
//         //         Number(cell.getValue() || 0).toFixed(2),
//         // },

//     ];
// }, []);

//  const table = useMaterialReactTable({
//     columns,
//     data: salesData,

//     // ❌ Pagination OFF
//     enablePagination: false,

//     muiTableHeadCellProps: {
//         style: {
//             backgroundColor: "#E9ECEF",
//             color: "black",
//             fontSize: "16px",
//         },
//     },

//     // =====================================================
//     // BOTTOM TOOLBAR
//     // Pagination काढले आहे
//     // फक्त Grand Total ठेवला आहे
//     // =====================================================
//     renderBottomToolbar: () => (
//         <Box
//             display="flex"
//             justifyContent="flex-end"
//             alignItems="center"
//             mr={4}
//             py={1}
//         >
//             {/* ➡️ Grand Total on Right */}
//             <Box display="flex" alignItems="center">
//                 <Typography
//                     variant="subtitle1"
//                     sx={{ mr: 2 }}
//                 >
//                     <b>Grand Total:</b>
//                 </Typography>

//                 <Typography
//                     variant="subtitle1"
//                     color="primary"
//                 >
//                     <b>
//                         {grandTotal.toLocaleString("en-IN")}
//                     </b>
//                 </Typography>
//             </Box>
//         </Box>
//     ),
// });


//     //grand Total
//  const grandTotal = useMemo(() => {
//     return salesData?.reduce(
//         (acc, row) =>
//             acc +
//             (Number(row["Total amt"]) || 0),
//         0
//     );
// }, [salesData]);


//     return (
//         <Box >
//             <Box textAlign={'center'}>
//                 <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Sales Report</b></Typography>
//             </Box>

//             <Box sx={{ p: 5, height: 'auto' }}>

//                 <Box>
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2 }}>

//                             <Box flex={1} >
//                                 <Typography>From Date</Typography>
//                                 <DatePicker
//                                     value={fromDate ? new Date(fromDate) : null}
//                                     format="dd-MM-yyyy"
//                                     onChange={(newValue) => setFromDate(newValue)}
//                                     slotProps={{
//                                         textField: { size: "small", fullWidth: true },
//                                     }}
//                                 />
//                             </Box>



//                             <Box flex={1} >
//                                 <Typography>To Date</Typography>
//                                 <DatePicker
//                                     value={toDate ? new Date(toDate) : null}
//                                     format="dd-MM-yyyy"
//                                     onChange={(newValue) => setToDate(newValue)}
//                                     slotProps={{
//                                         textField: { size: "small", fullWidth: true },
//                                     }}
//                                 />
//                             </Box>

//                         </Box>



//                     </LocalizationProvider>
//                 </Box>

//                 <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//                     <Box>
//                         <Button
//                             sx={{
//                                 background: 'var(--primary-color)',
//                             }}

//                             onClick={handleGetSalesReport}
//                             variant="contained"
//                         >
//                             Get Sales Report
//                         </Button>
//                     </Box>

//                 </Box>


               
//                 <>
//                     {showTable && (
//                         <>
//                             <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>

//                                <DialogTitle
//     sx={{
//         textAlign: 'center',
//         p: 0,
//         borderBottom: '2px solid #222',
//     }}
// >
//     {/* COMPANY HEADER */}
//     <Box
//         sx={{
//             width: '100%',
//             py: 3,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//         }}
//     >
//         {/* COMPANY NAME */}
//         <Typography
//             sx={{
//                 fontSize: '36px',
//                 fontWeight: 900,
//                 letterSpacing: '1px',
//                 color: '#111',
//                 lineHeight: 1.2,
//             }}
//         >
//             AMRUT MILK PRODUCTS 2
//         </Typography>

//         {/* ADDRESS */}
//         <Typography
//             sx={{
//                 fontSize: '20px',
//                 fontWeight: 400,
//                 color: '#555',
//                 mt: 1,
//             }}
//         >
//             E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER, KOLHAPUR
//         </Typography>

//         {/* PHONE + STATE */}
//         <Typography
//             sx={{
//                 fontSize: '18px',
//                 fontWeight: 400,
//                 color: '#555',
//                 mt: 1,
//             }}
//         >
//             Phone: 8830261523
//             <span style={{ margin: '0 15px' }}>|</span>
//             State: 27-Maharashtra
//         </Typography>

//         {/* REPORT TITLE */}
//         <Typography
//             sx={{
//                 fontSize: '20px',
//                 fontWeight: 'bold',
//                 color: '#111',
//                 mt: 2,
//             }}
//         >
//             Sales Report Preview for{' '}
//             {fromDate
//                 ? new Date(fromDate).toLocaleDateString('en-GB')
//                 : '-'}
//             {' '}to{' '}
//             {toDate
//                 ? new Date(toDate).toLocaleDateString('en-GB')
//                 : '-'}
//         </Typography>
//     </Box>
// </DialogTitle>

// <DialogContent dividers>

//     {/* TABLE ALWAYS SHOW */}
//    {/* TABLE ALWAYS SHOW */}

// <MaterialReactTable
//     table={table}
//     enablePagination={false}
//     enableColumnResizing
//     muiTableHeadCellProps={{
//         sx: {
//             color: 'var(--primary-color)',
//         },
//     }}
// />

//     {/* NO DATA MESSAGE */}
//     {salesData.length === 0 && (
//         <Box
//             sx={{
//                 textAlign: 'center',
//                 py: 3,
//                 border: '1px solid #ddd',
//                 borderTop: 'none',
//             }}
//         >
//             <Typography
//                 sx={{
//                     fontWeight: 'bold',
//                     color: 'text.secondary',
//                 }}
//             >
//                 No sales records found for the selected date range.
//             </Typography>
//         </Box>
//     )}

// </DialogContent>



//                                 <DialogActions sx={{ p: 0 }}>
//                                     <Box
//                                         display="flex"
//                                         justifyContent="space-between"
//                                         alignItems="center"
//                                         width="100%"
//                                         sx={{ borderTop: "2px solid #ddd", backgroundColor: "#f8f9fa", p: 2 }}
//                                     >
//                                         {/* ✅ Left side: Buttons */}
//                                         <Box display="flex" gap={2}>
//                                             <Button onClick={generatePDF} color="primary">
//                                                 <PrintIcon sx={{ fontSize: 35 }} />
//                                             </Button>
//                                             <Button
//                                                 variant="contained"
//                                                 endIcon={<FileDownloadIcon />}
//                                                 onClick={() => exportToExcel(salesData)}
//                                             >
//                                                 Excel Data
//                                             </Button>
//                                             <Button
//                                                 variant="contained"
//                                                 onClick={() => setPreviewOpen(false)}
//                                                 color="primary"
//                                             >
//                                                 Close
//                                             </Button>
//                                         </Box>

//                                         {/* ✅ Right side: Grand Total */}
//                                         {/* <Box display="flex" alignItems="center" fontWeight="bold">
//                                                 <Typography variant="h6" sx={{ mr: 2 }}>
//                                                    <b>Grand Total:</b> 
//                                                 </Typography>
//                                                 <Typography variant="h6" color="primary">
//                                                    <b> {grandTotal.toLocaleString("en-IN")} </b> 
//                                                 </Typography>
//                                             </Box> */}
//                                     </Box>
//                                 </DialogActions>

//                             </Dialog>
//                         </>
//                     )}
//                 </>
//                 {/* )} */}
//             </Box >
//         </Box >
//     );
// };

// export default SalesReport;














































// import React, { useState, useMemo } from "react";

// import {
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
// } from "@mui/material";

// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// import PrintIcon from "@mui/icons-material/Print";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";

// import moment from "moment";

// const API_URL =
//   "https://amrutdairyapi.microtechsolutions.net.in/php/getsalesreport.php";

// const SalesReport = () => {
//   const today = new Date();

//   const [fromDate, setFromDate] = useState(today);
//   const [toDate, setToDate] = useState(today);

//   const [salesData, setSalesData] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // =========================================================
//   // FORMAT DATE AS YYYY-MM-DD
//   // =========================================================

//   const formatDate = (date) => {
//     if (!date) return "";

//     const d = new Date(date);

//     if (Number.isNaN(d.getTime())) return "";

//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   // =========================================================
//   // NORMALIZE API DATE
//   // =========================================================

//   const normalizeDate = (value) => {
//     if (!value) return "";

//     if (typeof value === "object" && value !== null) {
//       value = value.date ?? value.Date ?? "";
//     }

//     const dateString = String(value).trim().substring(0, 10);

//     if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
//       const [day, month, year] = dateString.split("-");
//       return `${year}-${month}-${day}`;
//     }

//     if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
//       const [day, month, year] = dateString.split("/");
//       return `${year}-${month}-${day}`;
//     }

//     return dateString;
//   };

//   // =========================================================
//   // GET VALUE FROM POSSIBLE API FIELD NAMES
//   // =========================================================

//   const getValue = (row, keys, fallback = "") => {
//     for (const key of keys) {
//       if (
//         row?.[key] !== undefined &&
//         row?.[key] !== null
//       ) {
//         return row[key];
//       }
//     }

//     return fallback;
//   };

//   const toNumber = (value) => {
//     if (value === null || value === undefined || value === "") {
//       return 0;
//     }

//     const number = Number(value);

//     return Number.isFinite(number) ? number : 0;
//   };

//   // =========================================================
//   // GET SALES REPORT
//   // =========================================================

//   const getSalesReport = async () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both From Date and To Date.");
//       return;
//     }

//     const selectedFromDate = formatDate(fromDate);
//     const selectedToDate = formatDate(toDate);

//     if (!selectedFromDate || !selectedToDate) {
//       alert("Please select valid dates.");
//       return;
//     }

//     if (selectedFromDate > selectedToDate) {
//       alert("From Date cannot be greater than To Date.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const reportUrl =
//         `${API_URL}?fromdate=${encodeURIComponent(
//           selectedFromDate
//         )}&todate=${encodeURIComponent(selectedToDate)}`;

//       console.log("SALES REPORT API URL:", reportUrl);
//       console.log("FROM DATE:", selectedFromDate);
//       console.log("TO DATE:", selectedToDate);

//       const response = await fetch(reportUrl, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       const responseText = await response.text();

//       console.log("SALES REPORT RAW RESPONSE:", responseText);

//       if (!response.ok) {
//         throw new Error(
//           `API Error ${response.status}: ${responseText}`
//         );
//       }

//       let result;

//       try {
//         result = JSON.parse(responseText);
//       } catch {
//         throw new Error(
//           "API response is not valid JSON. Check the API response in Console."
//         );
//       }

//       // -------------------------------------------------------
//       // HANDLE DIFFERENT RESPONSE STRUCTURES
//       // -------------------------------------------------------

//       let reportRows = null;

//       if (Array.isArray(result)) {
//         reportRows = result;
//       } else if (Array.isArray(result?.data)) {
//         reportRows = result.data;
//       } else if (Array.isArray(result?.Data)) {
//         reportRows = result.Data;
//       } else if (Array.isArray(result?.result)) {
//         reportRows = result.result;
//       } else if (Array.isArray(result?.records)) {
//         reportRows = result.records;
//       } else if (Array.isArray(result?.Recordset)) {
//         reportRows = result.Recordset;
//       }

//       if (!reportRows) {
//         console.error("UNEXPECTED API RESPONSE:", result);

//         throw new Error(
//           result?.message ||
//             result?.Message ||
//             "Sales report array not found in API response. Check Console."
//         );
//       }

//       console.log("API REPORT ROW COUNT:", reportRows.length);

//       // -------------------------------------------------------
//       // MAP API RESPONSE TO TABLE FIELDS
//       // -------------------------------------------------------

//       const mappedRows = reportRows.map((row) => {
//         const rawDate = getValue(row, [
//           "InvoiceDate",
//           "BillDate",
//           "Invoice_Date",
//           "Date",
//         ]);

//         const invoiceDate = normalizeDate(rawDate);

//         const invoiceNo = getValue(row, [
//           "InvoiceNo",
//           "InvoiceNumber",
//           "BillNo",
//           "BillNumber",
//         ]);

//         const accountName = getValue(
//           row,
//           [
//             "AccountName",
//             "CustomerName",
//             "PartyName",
//             "Customer",
//           ],
//           "N/A"
//         );

//        const categoryValue = String(
//   getValue(
//     row,
//     [
//       "Category",
//       "CustomerType",
//       "SaleType",
//       "AccountType",
//       "CustomerCategory",
//       "Customer_Type",
//       "CustomerGroup",
//     ],
//     ""
//   )
// )
//   .trim()
//   .toUpperCase();

// let category = "Unknown";

// if (
//   categoryValue === "D" ||
//   categoryValue.includes("DEALER")
// ) {
//   category = "Dealer";
// } else if (
//   categoryValue === "C" ||
//   categoryValue.includes("CATERER")
// ) {
//   category = "Caterers";
// } else if (
//   categoryValue === "R" ||
//   categoryValue.includes("REGULAR") ||
//   categoryValue.includes("RETAILER")
// ) {
//   category = "Regular";
// }

// console.log("CATEGORY DEBUG:", {
//   InvoiceNo: getValue(
//     row,
//     ["InvoiceNo", "InvoiceNumber", "BillNo"]
//   ),
//   AccountName: getValue(
//     row,
//     ["AccountName", "CustomerName", "PartyName"]
//   ),
//   CategoryValue: categoryValue,
//   FinalCategory: category,
// });




//         const rate = toNumber(
//           getValue(row, ["Rate", "ProductRate", "SalesRate"], 0)
//         );

//         const quantity = toNumber(
//           getValue(row, ["Quantity", "Qty"], 0)
//         );

//         const amount = toNumber(
//           getValue(
//             row,
//             ["Amount", "ItemAmount", "ProductAmount"],
//             0
//           )
//         );

//         const transport = toNumber(
//           getValue(row, ["Transport", "TransportAmount"], 0)
//         );

//         const subtotal = toNumber(
//           getValue(
//             row,
//             [
//               "Product Subtotal",
//               "ProductSubtotal",
//               "SubTotal",
//               "Subtotal",
//             ],
//             amount
//           )
//         );

//         const total = toNumber(
//           getValue(
//             row,
//             [
//               "Total amt",
//               "TotalAmount",
//               "Total",
//               "NetAmount",
//               "GrandTotal",
//             ],
//             0
//           )
//         );

//         return {
//           ...row,
//           InvoiceNo: invoiceNo,
//           InvoiceDate: invoiceDate,
//           AccountName: accountName,
//           Category: category,

//           OrderNo: getValue(
//             row,
//             ["OrderNo", "OrderNumber"],
//             ""
//           ),

//           OrderDate: normalizeDate(
//             getValue(row, ["OrderDate"], "")
//           ),

//           ProductName: getValue(
//             row,
//             ["ProductName", "ItemName", "Product"],
//             ""
//           ),

//           Rate: rate,
//           Quantity: quantity,
//           Amount: amount,
//           Transport: transport,
//           "Product Subtotal": subtotal,
//           "Total amt": total,
//         };
//       });

//       // -------------------------------------------------------
//       // CLIENT-SIDE DATE FILTER AS EXTRA VALIDATION
//       // -------------------------------------------------------

//       const filteredRows = mappedRows.filter((row) => {
//         if (!row.InvoiceDate) return false;

//         return (
//           row.InvoiceDate >= selectedFromDate &&
//           row.InvoiceDate <= selectedToDate
//         );
//       });

//       // -------------------------------------------------------
//       // AVOID REPEATING INVOICE TOTAL FOR EACH PRODUCT ROW
//       // -------------------------------------------------------
//       // If the API returns one row per product, invoice total
//       // should contribute only once to the Grand Total.

//       const seenInvoices = new Set();

//       const finalRows = filteredRows.map((row) => {
//         const invoiceKey = String(
//           row.InvoiceNo || ""
//         ).trim();

//         if (!invoiceKey) {
//           return row;
//         }

//         if (seenInvoices.has(invoiceKey)) {
//           return {
//             ...row,
//             Transport: 0,
//             "Total amt": 0,
//           };
//         }

//         seenInvoices.add(invoiceKey);

//         return row;
//       });

//       console.log("MAPPED REPORT ROWS:", mappedRows);
//       console.log("FILTERED REPORT ROWS:", finalRows);
//       console.log("FINAL REPORT COUNT:", finalRows.length);

//       setSalesData(finalRows);
//       setShowTable(true);
//       setPreviewOpen(true);
//     } catch (error) {
//       console.error("SALES REPORT ERROR:", error);

//       setSalesData([]);
//       setShowTable(true);
//       setPreviewOpen(true);

//       alert(`Sales Report failed: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGetSalesReport = () => {
//     getSalesReport();
//   };

//   // =========================================================
//   // GRAND TOTAL
//   // =========================================================

//   const grandTotal = useMemo(() => {
//     return salesData.reduce((total, row) => {
//       return total + toNumber(row["Total amt"]);
//     }, 0);
//   }, [salesData]);

//   // =========================================================
//   // GENERATE PDF
//   // =========================================================

//   const generatePDF = () => {
//     if (!salesData.length) {
//       alert("No sales data available.");
//       return;
//     }

//     const doc = new jsPDF("landscape");

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     doc.setLineWidth(0.5);
//     doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(18);

//     doc.text(
//       "AMRUT MILK PRODUCTS 2",
//       pageWidth / 2,
//       15,
//       { align: "center" }
//     );

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(10);

//     doc.text(
//       `Sales Report: ${moment(fromDate).format(
//         "DD-MM-YYYY"
//       )} to ${moment(toDate).format("DD-MM-YYYY")}`,
//       pageWidth / 2,
//       22,
//       { align: "center" }
//     );

//     const headers = [
//       "Invoice No",
//       "Invoice Date",
//       "Account Name",
//       "Category",
//       "Product Name",
//       "Rate",
//       "Quantity",
//       "Amount",
//       "Transport",
//       "Sub Total",
//       "Total Amount",
//     ];

//     const body = salesData.map((item) => [
//       item.InvoiceNo || "-",
//       item.InvoiceDate
//         ? moment(item.InvoiceDate).format("DD-MM-YYYY")
//         : "-",
//       item.AccountName || "-",
//       item.Category || "Regular",
//       item.ProductName || "-",
//       toNumber(item.Rate).toFixed(2),
//       toNumber(item.Quantity).toFixed(3),
//       toNumber(item.Amount).toFixed(2),
//       toNumber(item.Transport).toFixed(2),
//       toNumber(item["Product Subtotal"]).toFixed(2),
//       toNumber(item["Total amt"]).toFixed(2),
//     ]);

//     autoTable(doc, {
//       head: [headers],
//       body,
//       startY: 28,
//       margin: { left: 8, right: 8 },
//       theme: "grid",

//       styles: {
//         font: "helvetica",
//         fontSize: 7,
//         cellPadding: 1.5,
//         textColor: 0,
//         lineColor: [180, 180, 180],
//         lineWidth: 0.2,
//       },

//       headStyles: {
//         fillColor: [245, 245, 245],
//         textColor: 0,
//         fontStyle: "bold",
//       },

//       columnStyles: {
//         5: { halign: "right" },
//         6: { halign: "right" },
//         7: { halign: "right" },
//         8: { halign: "right" },
//         9: { halign: "right" },
//         10: { halign: "right" },
//       },

//       foot: [
//         [
//           {
//             content: "Grand Total",
//             colSpan: 10,
//             styles: {
//               halign: "right",
//               fontStyle: "bold",
//             },
//           },
//           {
//             content: grandTotal.toFixed(2),
//             styles: {
//               halign: "right",
//               fontStyle: "bold",
//             },
//           },
//         ],
//       ],

//       didDrawPage: () => {
//         doc.setLineWidth(0.5);
//         doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
//       },
//     });

//     doc.save("Sales_Report_Preview.pdf");
//   };

//   // =========================================================
//   // EXPORT TO EXCEL
//   // =========================================================

//   const exportToExcel = async () => {
//     if (!salesData.length) {
//       alert("No data available to export.");
//       return;
//     }

//     try {
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet("SalesReport");

//       const headers = [
//         "Invoice No",
//         "Invoice Date",
//         "Account Name",
//         "Category",
//         "Product Name",
//         "Rate",
//         "Quantity (Nos)",
//         "Amount (Rs)",
//         "Transport",
//         "Sub Total",
//         "Total Amount",
//       ];

//       worksheet.addRow(headers);

//       worksheet.getRow(1).eachCell((cell) => {
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" },
//           size: 12,
//         };

//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FF4F81BD" },
//         };

//         cell.alignment = {
//           horizontal: "center",
//           vertical: "middle",
//         };
//       });

//       salesData.forEach((item) => {
//         worksheet.addRow([
//           item.InvoiceNo || "",
//           item.InvoiceDate || "",
//           item.AccountName || "N/A",
//           item.Category || "Regular",
//           item.ProductName || "",
//           toNumber(item.Rate),
//           toNumber(item.Quantity),
//           toNumber(item.Amount),
//           toNumber(item.Transport),
//           toNumber(item["Product Subtotal"]),
//           toNumber(item["Total amt"]),
//         ]);
//       });

//       worksheet.columns.forEach((column) => {
//         let maxLength = 10;

//         column.eachCell({ includeEmpty: true }, (cell) => {
//           const length = cell.value
//             ? String(cell.value).length
//             : 0;

//           maxLength = Math.max(maxLength, length);
//         });

//         column.width = maxLength + 3;
//       });

//       const totalRow = worksheet.addRow([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "Grand Total",
//         grandTotal,
//       ]);

//       totalRow.font = { bold: true, size: 12 };

//       totalRow.eachCell((cell) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFFFE699" },
//         };

//         cell.border = {
//           top: { style: "thin" },
//           bottom: { style: "thin" },
//         };
//       });

//       const buffer = await workbook.xlsx.writeBuffer();

//       const blob = new Blob([buffer], {
//         type:
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });

//       saveAs(
//         blob,
//         `SalesReport_${formatDate(new Date())}.xlsx`
//       );
//     } catch (error) {
//       console.error("EXCEL EXPORT ERROR:", error);
//       alert("Failed to export Excel file.");
//     }
//   };

//   // =========================================================
//   // TABLE COLUMNS
//   // =========================================================

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "InvoiceNo",
//         header: "Invoice No",
//         size: 100,
//       },
//       {
//         accessorKey: "InvoiceDate",
//         header: "Invoice Date",
//         size: 110,
//         Cell: ({ cell }) => {
//           const value = cell.getValue();

//           return value
//             ? moment(value).format("DD-MM-YYYY")
//             : "-";
//         },
//       },
//       {
//         accessorKey: "AccountName",
//         header: "Account Name",
//         size: 180,
//       },
//       {
//         accessorKey: "Category",
//         header: "Category",
//         size: 100,
//       },
//       {
//         accessorKey: "ProductName",
//         header: "Product Name",
//         size: 160,
//       },
//       {
//         accessorKey: "Rate",
//         header: "Rate",
//         size: 90,
//         Cell: ({ cell }) =>
//           toNumber(cell.getValue()).toFixed(2),
//       },
//       {
//         accessorKey: "Quantity",
//         header: "Quantity",
//         size: 100,
//         Cell: ({ cell }) =>
//           toNumber(cell.getValue()).toFixed(3),
//       },
//       {
//         accessorKey: "Amount",
//         header: "Amount",
//         size: 100,
//         Cell: ({ cell }) =>
//           toNumber(cell.getValue()).toFixed(2),
//       },
//       {
//         accessorKey: "Transport",
//         header: "Transport",
//         size: 100,
//         Cell: ({ cell }) =>
//           toNumber(cell.getValue()).toFixed(2),
//       },
//       {
//         accessorKey: "Product Subtotal",
//         header: "Sub Total",
//         size: 110,
//         Cell: ({ cell }) =>
//           toNumber(cell.getValue()).toFixed(2),
//       },
//     ],
//     []
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: salesData,
//     enablePagination: false,
//     enableColumnResizing: true,

//     muiTableHeadCellProps: {
//       sx: {
//         backgroundColor: "#E9ECEF",
//         color: "#111",
//         fontSize: "14px",
//         fontWeight: "bold",
//       },
//     },

//     renderBottomToolbar: () => (
//       <Box
//         display="flex"
//         justifyContent="flex-end"
//         alignItems="center"
//         px={3}
//         py={2}
//       >
//         <Typography variant="subtitle1">
//           <b>Grand Total: </b>
//           <Box
//             component="span"
//             sx={{ color: "primary.main", fontWeight: "bold" }}
//           >
//             {grandTotal.toLocaleString("en-IN", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </Box>
//         </Typography>
//       </Box>
//     ),
//   });

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <Box>
//       <Box textAlign="center">
//         <Typography
//           sx={{
//             color: "var(--complementary-color)",
//             fontWeight: "bold",
//           }}
//           variant="h4"
//         >
//           Sales Report
//         </Typography>
//       </Box>

//       <Box sx={{ p: 5, height: "auto" }}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//               m: 1,
//               flexWrap: "wrap",
//             }}
//           >
//             <Box sx={{ flex: 1, minWidth: 200 }}>
//               <Typography>From Date</Typography>

//               <DatePicker
//                 value={fromDate}
//                 format="dd-MM-yyyy"
//                 onChange={(newValue) => setFromDate(newValue)}
//                 slotProps={{
//                   textField: {
//                     size: "small",
//                     fullWidth: true,
//                   },
//                 }}
//               />
//             </Box>

//             <Box sx={{ flex: 1, minWidth: 200 }}>
//               <Typography>To Date</Typography>

//               <DatePicker
//                 value={toDate}
//                 format="dd-MM-yyyy"
//                 onChange={(newValue) => setToDate(newValue)}
//                 slotProps={{
//                   textField: {
//                     size: "small",
//                     fullWidth: true,
//                   },
//                 }}
//               />
//             </Box>
//           </Box>
//         </LocalizationProvider>

//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           gap={2}
//           mt={5}
//         >
//           <Button
//             sx={{
//               background: "var(--primary-color)",
//               minWidth: 180,
//             }}
//             onClick={handleGetSalesReport}
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <CircularProgress
//                   size={20}
//                   color="inherit"
//                   sx={{ mr: 1 }}
//                 />
//                 Loading...
//               </>
//             ) : (
//               "Get Sales Report"
//             )}
//           </Button>
//         </Box>

//         {showTable && (
//           <Dialog
//             open={previewOpen}
//             onClose={() => setPreviewOpen(false)}
//             maxWidth="xl"
//             fullWidth
//           >
//             <DialogTitle
//               sx={{
//                 textAlign: "center",
//                 borderBottom: "2px solid #222",
//                 py: 3,
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: { xs: 22, md: 32 },
//                   fontWeight: 900,
//                   color: "#111",
//                 }}
//               >
//                 AMRUT MILK PRODUCTS 2
//               </Typography>

//               <Typography
//                 sx={{
//                   fontSize: { xs: 12, md: 16 },
//                   color: "#555",
//                   mt: 1,
//                 }}
//               >
//                 E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER,
//                 KOLHAPUR
//               </Typography>

//               <Typography
//                 sx={{ fontSize: 14, color: "#555", mt: 1 }}
//               >
//                 Phone: 8830261523 | State: 27-Maharashtra
//               </Typography>

//               <Typography
//                 sx={{
//                   fontSize: 18,
//                   fontWeight: "bold",
//                   color: "#111",
//                   mt: 2,
//                 }}
//               >
//                 Sales Report Preview for{" "}
//                 {moment(fromDate).format("DD-MM-YYYY")} to{" "}
//                 {moment(toDate).format("DD-MM-YYYY")}
//               </Typography>
//             </DialogTitle>

//             <DialogContent dividers>
//               <MaterialReactTable table={table} />

//               {salesData.length === 0 && (
//                 <Box
//                   sx={{
//                     textAlign: "center",
//                     py: 3,
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontWeight: "bold",
//                       color: "text.secondary",
//                     }}
//                   >
//                     No sales records found for the selected date
//                     range.
//                   </Typography>
//                 </Box>
//               )}
//             </DialogContent>

//             <DialogActions sx={{ p: 0 }}>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 flexWrap="wrap"
//                 gap={2}
//                 width="100%"
//                 sx={{
//                   borderTop: "2px solid #ddd",
//                   backgroundColor: "#f8f9fa",
//                   p: 2,
//                 }}
//               >
//                 <Box display="flex" gap={2} flexWrap="wrap">
//                   <Button
//                     onClick={generatePDF}
//                     color="primary"
//                     title="Print PDF"
//                   >
//                     <PrintIcon sx={{ fontSize: 30 }} />
//                   </Button>

//                   <Button
//                     variant="contained"
//                     endIcon={<FileDownloadIcon />}
//                     onClick={exportToExcel}
//                   >
//                     Excel Data
//                   </Button>

//                   <Button
//                     variant="contained"
//                     onClick={() => setPreviewOpen(false)}
//                   >
//                     Close
//                   </Button>
//                 </Box>

//                 <Typography variant="h6">
//                   <b>Grand Total: </b>
//                   <Box
//                     component="span"
//                     sx={{
//                       color: "primary.main",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {grandTotal.toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </Box>
//                 </Typography>
//               </Box>
//             </DialogActions>
//           </Dialog>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default SalesReport;


























// import { useState, useMemo } from 'react';
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button } from '@mui/material';
// import autoTable from 'jspdf-autotable';
// import jsPDF from 'jspdf';
// import PrintIcon from '@mui/icons-material/Print';

// import { saveAs } from "file-saver";
// import ExcelJS from "exceljs";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import moment from 'moment';
// import { useMaterialReactTable, } from "material-react-table";
// import { MaterialReactTable, } from 'material-react-table';
// import { MRT_TablePagination as MUITablePagination } from "material-react-table";


// const SalesReport = () => {
//    const today = new Date();

// const [fromDate, setFromDate] = useState(today);
// const [toDate, setToDate] = useState(today);
//     const [salesData, setSalesData] = useState([]);
//     const [showTable, setShowTable] = useState(false);
//     const [previewOpen, setPreviewOpen] = useState(false);


// const getSalesReport = async () => {
//     try {

//         // =====================================================
//         // DATE FORMAT
//         // =====================================================
//         const formatDate = (date) => {
//             if (!date) return "";

//             const d = new Date(date);

//             return `${d.getFullYear()}-${String(
//                 d.getMonth() + 1
//             ).padStart(2, "0")}-${String(
//                 d.getDate()
//             ).padStart(2, "0")}`;
//         };


//         // =====================================================
// // NORMALIZE API DATE
// // =====================================================
// const normalizeApiDate = (value) => {
//     if (!value) return "";

//     // API date object
//     if (typeof value === "object" && value?.date) {
//         return String(value.date).substring(0, 10);
//     }

//     // Normal string date
//     if (typeof value === "string") {
//         return value.substring(0, 10);
//     }

//     return "";
// };




//         const selectedFromDate = formatDate(fromDate);
//         const selectedToDate = formatDate(toDate);

//         console.log(
//             "SELECTED DATE RANGE:",
//             selectedFromDate,
//             "TO",
//             selectedToDate
//         );

//         // =====================================================
//         // 1. GET INVOICE HEADER - PAGE 1
//         // =====================================================
 

//         // =====================================================
//         // 1. GET ALL INVOICE HEADER PAGES
//         // =====================================================

//         const firstResponse = await fetch(
//             "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1"
//         );

//         if (!firstResponse.ok) {
//             throw new Error(
//                 `Invoice Header API Error: ${firstResponse.status}`
//             );
//         }

//         const firstResult = await firstResponse.json();

//         console.log("INVOICE HEADER PAGE 1:", firstResult);

//         // =====================================================
//         // EXTRACT PAGE DATA
//         // =====================================================


//         // =====================================================
//         // GET INVOICE HEADERS FOR SELECTED DATE RANGE
//         // =====================================================

//         const getPageData = (result) => {
//             if (Array.isArray(result)) return result;
//             if (Array.isArray(result?.data)) return result.data;
//             if (Array.isArray(result?.Data)) return result.Data;
//             if (Array.isArray(result?.records)) return result.records;
//             return [];
//         };

//         let allInvoiceHeaders = [];

//         const from = new Date(`${selectedFromDate}T12:00:00`);
//         const to = new Date(`${selectedToDate}T12:00:00`);

//         if (from > to) {
//             throw new Error("From Date cannot be after To Date.");
//         }

//         for (
//             let currentDate = new Date(from);
//             currentDate <= to;
//             currentDate.setDate(currentDate.getDate() + 1)
//         ) {
//             const selectedDate = formatDate(currentDate);

//             console.log("FETCHING INVOICES FOR:", selectedDate);

//             // PAGE 1 FOR SELECTED DATE
//             const firstResponse = await fetch(
//                 `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1&InvoiceDate=${encodeURIComponent(selectedDate)}`
//             );

//             if (!firstResponse.ok) {
//                 throw new Error(
//                     `Invoice API Error for ${selectedDate}: ${firstResponse.status}`
//                 );
//             }

//             const firstResult = await firstResponse.json();

//             console.log(
//                 `INVOICE RESPONSE FOR ${selectedDate}:`,
//                 firstResult
//             );

//             const firstPageData = getPageData(firstResult);

//             const totalPages = Number(
//                 firstResult?.total_pages ??
//                 firstResult?.TotalPages ??
//                 firstResult?.totalPages ??
//                 firstResult?.pages ??
//                 1
//             );

//             if (!Number.isFinite(totalPages) || totalPages < 1) {
//                 throw new Error(
//                     `Invalid total pages for ${selectedDate}`
//                 );
//             }

//             allInvoiceHeaders.push(...firstPageData);

//             // REMAINING PAGES FOR THE SAME DATE
//             for (let page = 2; page <= totalPages; page++) {
//                 const pageResponse = await fetch(
//                     `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}&InvoiceDate=${encodeURIComponent(selectedDate)}`
//                 );

//                 if (!pageResponse.ok) {
//                     throw new Error(
//                         `Invoice page ${page} failed for ${selectedDate}`
//                     );
//                 }

//                 const pageResult = await pageResponse.json();

//                 allInvoiceHeaders.push(...getPageData(pageResult));
//             }
//         }

//         // =====================================================
//         // REMOVE DUPLICATE INVOICE HEADERS
//         // =====================================================

//         const uniqueInvoices = new Map();

//         allInvoiceHeaders.forEach((invoice) => {
//             const invoiceDate = normalizeApiDate(invoice?.InvoiceDate);

//             const invoiceId =
//                 invoice?.Id ??
//                 invoice?.InvoiceId ??
//                 invoice?.InvoiceNo;

//             if (invoiceId != null) {
//                 uniqueInvoices.set(
//                     `${invoiceDate}_${invoiceId}`,
//                     invoice
//                 );
//             }
//         });

//         allInvoiceHeaders = [...uniqueInvoices.values()];

//         console.log(
//             "TOTAL INVOICE HEADERS:",
//             allInvoiceHeaders.length
//         );

//         console.log(
//             "ALL API INVOICE DATES:",
//             [
//                 ...new Set(
//                     allInvoiceHeaders.map((invoice) =>
//                         normalizeApiDate(invoice?.InvoiceDate)
//                     )
//                 ),
//             ]
//         );


//         // =====================================================
//         // 2. DATE FILTER
//         // =====================================================
//         // const dateFilteredInvoices =
//         //     allInvoiceHeaders.filter((invoice) => {

//         //         const rawInvoiceDate =
//         //             invoice?.InvoiceDate;

//         //         let invoiceDate = "";

//         //         if (
//         //             typeof rawInvoiceDate === "object" &&
//         //             rawInvoiceDate?.date
//         //         ) {
//         //             invoiceDate =
//         //                 String(
//         //                     rawInvoiceDate.date
//         //                 ).substring(0, 10);
//         //         }
//         //         else if (rawInvoiceDate) {
//         //             invoiceDate =
//         //                 String(
//         //                     rawInvoiceDate
//         //                 ).substring(0, 10);
//         //         }

//         //         const match =
//         //             invoiceDate >= selectedFromDate &&
//         //             invoiceDate <= selectedToDate;

//         //         console.log(
//         //             "DATE CHECK:",
//         //             invoice?.InvoiceNo,
//         //             invoiceDate,
//         //             match
//         //         );

//         //         return match;
//         //     });




        
// const dateFilteredInvoices = allInvoiceHeaders.filter((invoice) => {
//     const rawInvoiceDate = invoice?.InvoiceDate;

//     if (!rawInvoiceDate) {
//         return false;
//     }

//     // 1. Normalize API date
//     let invoiceDate = "";

//     if (
//         typeof rawInvoiceDate === "object" &&
//         rawInvoiceDate !== null
//     ) {
//         invoiceDate = String(
//             rawInvoiceDate.date ?? ""
//         ).trim();
//     } else {
//         invoiceDate = String(rawInvoiceDate).trim();
//     }

//     if (!invoiceDate) {
//         return false;
//     }

//     // 2. Extract date portion if time is also present
//     invoiceDate = invoiceDate.substring(0, 10);

//     // 3. Convert DD-MM-YYYY to YYYY-MM-DD
//     if (/^\d{2}-\d{2}-\d{4}$/.test(invoiceDate)) {
//         const [day, month, year] = invoiceDate.split("-");

//         invoiceDate = `${year}-${month}-${day}`;
//     }

//     // 4. Convert DD/MM/YYYY to YYYY-MM-DD
//     else if (/^\d{2}\/\d{2}\/\d{4}$/.test(invoiceDate)) {
//         const [day, month, year] = invoiceDate.split("/");

//         invoiceDate = `${year}-${month}-${day}`;
//     }

//     // 5. Validate normalized date format
//     if (!/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
//         console.warn(
//             "INVALID INVOICE DATE:",
//             invoice?.InvoiceNo,
//             rawInvoiceDate
//         );

//         return false;
//     }

//     // 6. Compare dates in YYYY-MM-DD format
//     const match =
//         invoiceDate >= selectedFromDate &&
//         invoiceDate <= selectedToDate;

//     console.log("DATE CHECK:", {
//         InvoiceNo: invoice?.InvoiceNo,
//         OriginalDate: rawInvoiceDate,
//         NormalizedDate: invoiceDate,
//         FromDate: selectedFromDate,
//         ToDate: selectedToDate,
//         Match: match,
//     });

//     return match;
// });

// console.log(
//     "DATE FILTERED INVOICE COUNT:",
//     dateFilteredInvoices.length
// );


        






// // =====================================================
// // PRODUCT MASTER
// // =====================================================
// const productResponse = await fetch(
//     "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster"
// );

// if (!productResponse.ok) {
//     throw new Error(
//         `Product Master API Error: ${productResponse.status}`
//     );
// }

// const productResult = await productResponse.json();

// const productList =
//     Array.isArray(productResult)
//         ? productResult
//         : Array.isArray(productResult?.data)
//             ? productResult.data
//             : [];

// console.log("PRODUCT MASTER:", productList);

// // ProductId -> ProductName
// const productMap = new Map();

// productList.forEach((product) => {
//     const id =
//         product?.Id ??
//         product?.ProductId ??
//         product?.ProductCode;

//     const name =
//         product?.ProductName ??
//         product?.name ??
//         "";

//     if (id != null) {
//         productMap.set(
//             String(id),
//             name
//         );
//     }
// });

// console.log("PRODUCT MAP:", productMap);




//       // =====================================================
// // CUSTOMER INFO CACHE
// // =====================================================
// const customerInfoCache = new Map();

// // =====================================================
// // GET CUSTOMER TYPE + CUSTOMER NAME
// // =====================================================
// const getCustomerInfo = async (accountId) => {

//     // -------------------------------------------------
//     // AccountId = 0 => Regular Sale
//     // -------------------------------------------------
//     if (!accountId || Number(accountId) === 0) {
//         return {
//             type: "R",
//             name: ""
//         };
//     }

//     const cacheKey = String(accountId);

//     if (customerInfoCache.has(cacheKey)) {
//         return customerInfoCache.get(cacheKey);
//     }

//     let customerType = "";
//     let customerName = "";

//     try {

//         // =================================================
//         // ACCOUNT API
//         // =================================================
//         const accountResponse = await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=account&Colname=Id&Colvalue=${accountId}`
//         );

//         if (accountResponse.ok) {

//             const accountResult =
//                 await accountResponse.json();

//             console.log(
//                 "ACCOUNT RESPONSE:",
//                 accountId,
//                 accountResult
//             );

//             const account =
//                 Array.isArray(accountResult)
//                     ? accountResult[0]
//                     : Array.isArray(accountResult?.data)
//                         ? accountResult.data[0]
//                         : accountResult?.data ||
//                           accountResult ||
//                           null;

//             if (account) {

//                 // -------------------------------
//                 // CUSTOMER TYPE
//                 // -------------------------------
//                 customerType = String(
//                     account?.CustomerType ||
//                     account?.customerType ||
//                     ""
//                 )
//                     .trim()
//                     .toUpperCase();

//                 // -------------------------------
//                 // CUSTOMER NAME
//                 // -------------------------------
//                 customerName =
//                     account?.AccountName ||
//                     account?.accountName ||
//                     account?.Name ||
//                     account?.name ||
//                     "";
//             }
//         }

//         // =================================================
//         // ADDRESS API - ONLY IF TYPE NOT FOUND
//         // =================================================
//         if (!customerType) {

//             const addressResponse = await fetch(
//                 `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`
//             );

//             if (addressResponse.ok) {

//                 const addressResult =
//                     await addressResponse.json();

//                 console.log(
//                     "ADDRESS RESPONSE:",
//                     accountId,
//                     addressResult
//                 );

//                 const address =
//                     Array.isArray(addressResult)
//                         ? addressResult[0]
//                         : Array.isArray(addressResult?.data)
//                             ? addressResult.data[0]
//                             : addressResult?.data ||
//                               addressResult ||
//                               null;

//                 if (address) {

//                     customerType = String(
//                         address?.CustomerType ||
//                         address?.customerType ||
//                         ""
//                     )
//                         .trim()
//                         .toUpperCase();

//                     if (!customerName) {
//                         customerName =
//                             address?.AccountName ||
//                             address?.accountName ||
//                             address?.Name ||
//                             address?.name ||
//                             "";
//                     }
//                 }
//             }
//         }

//     } catch (error) {

//         console.error(
//             "CUSTOMER INFO ERROR:",
//             accountId,
//             error
//         );
//     }

//     // =================================================
//     // NORMALIZE CUSTOMER TYPE
//     // =================================================

//     if (
//         customerType === "D" ||
//         customerType === "DEALER"
//     ) {
//         customerType = "D";
//     }
//     else if (
//         customerType === "C" ||
//         customerType === "CATERER" ||
//         customerType === "CATERERS"
//     ) {
//         customerType = "C";
//     }
//     else {
//         customerType = "R";
//     }

//     const result = {
//         type: customerType,
//         name: customerName
//     };

//     customerInfoCache.set(
//         cacheKey,
//         result
//     );

//     return result;
// };

//         // =====================================================
//         // 5. GET DETAILS FOR EACH INVOICE
//         // =====================================================
//         const finalReportData = [];

//         for (
//             const invoice of dateFilteredInvoices
//         ) {

//             const invoiceId =
//                 invoice?.Id ??
//                 invoice?.InvoiceId;

//             const accountId =
//                 invoice?.AccountId ?? 0;

//             console.log(
//                 "PROCESSING INVOICE:",
//                 invoice?.InvoiceNo,
//                 "InvoiceId:",
//                 invoiceId,
//                 "AccountId:",
//                 accountId
//             );

//             // =================================================
//             // CATEGORY
//             // =================================================
//            const customerInfo =
//     await getCustomerInfo(
//         accountId
//     );

// const customerType =
//     customerInfo.type;

//             let category = "Regular";

//             if (
//                 customerType === "D"
//             ) {
//                 category = "Dealer";
//             }
//             else if (
//                 customerType === "C"
//             ) {
//                 category = "Caterers";
//             }

//             // =================================================
//             // CUSTOMER NAME
//             // =================================================
//            const accountName =
//     invoice?.AccountName ||
//     invoice?.CustomerName ||
//     customerInfo.name ||
//     "N/A";

//             // =================================================
//             // GET INVOICE DETAILS
//             // =================================================
//             if (!invoiceId) {
//                 continue;
//             }

//             try {

//                 const detailResponse =
//                     await fetch(
//                         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//                     );

//                 if (!detailResponse.ok) {
//                     continue;
//                 }

//                 const detailResult =
//                     await detailResponse.json();

//                 const details =
//                     Array.isArray(detailResult)
//                         ? detailResult
//                         : Array.isArray(
//                             detailResult?.data
//                         )
//                             ? detailResult.data
//                             : [];

//                 // =================================================
//                 // IF NO DETAIL
//                 // =================================================
//                 if (details.length === 0) {

//                     finalReportData.push({

//                         InvoiceNo:
//                             invoice?.InvoiceNo,

//                        InvoiceDate:
//     normalizeApiDate(invoice?.InvoiceDate),

//                         AccountName:
//                             accountName,

//                         Category:
//                             category,

//                         OrderNo:
//                             invoice?.OrderNo || "",

//                         OrderDate:
//                             invoice?.OrderDate || "",

//                         ProductName:
//                             "",

//                         Rate:
//                             0,

//                         Quantity:
//                             0,

//                         Amount:
//                             Number(
//                                 invoice?.Total ||
//                                 invoice?.TotalAmount ||
//                                 0
//                             ),

//                         Transport:
//                             Number(
//                                 invoice?.Transport || 0
//                             ),

//                         "Product Subtotal":
//                             Number(
//                                 invoice?.SubTotal ||
//                                 invoice?.Subtotal ||
//                                 0
//                             ),

//                         "Total amt":
//                             Number(
//                                 invoice?.Total ||
//                                 invoice?.TotalAmount ||
//                                 0
//                             ),
//                     });

//                     continue;
//                 }

//                 // =================================================
//                 // ADD EACH PRODUCT
//                 // =================================================
// details.forEach((detail, index) => {
//     finalReportData.push({
//         InvoiceNo: invoice?.InvoiceNo,

//         InvoiceDate: normalizeApiDate(invoice?.InvoiceDate),

//         AccountName: accountName,

//         Category: category,

//         OrderNo: invoice?.OrderNo || "",

//         OrderDate: normalizeApiDate(invoice?.OrderDate),

//        ProductName:
//     detail?.ProductName ||
//     detail?.productName ||
//     productMap.get(
//         String(
//             detail?.ProductId ??
//             detail?.ProductCode ??
//             ""
//         )
//     ) ||
//     "Unknown Product",

//         Rate: Number(
//             detail?.Rate ??
//             detail?.rate ??
//             0
//         ),

//         Quantity: Number(
//             detail?.Quantity ??
//             detail?.quantity ??
//             0
//         ),

//         Amount: Number(
//             detail?.Amount ??
//             detail?.amount ??
//             0
//         ),

//         Transport:
//             index === 0
//                 ? Number(invoice?.Transport ?? 0)
//                 : 0,

//         "Product Subtotal": Number(
//             detail?.["Product Subtotal"] ??
//             detail?.ProductSubtotal ??
//             detail?.Amount ??
//             0
//         ),

//         "Total amt":
//             index === 0
//                 ? Number(
//                     invoice?.Total ??
//                     invoice?.TotalAmount ??
//                     0
//                 )
//                 : 0
//     });
// });

//             } catch (detailError) {

//                 console.error(
//                     "DETAIL API ERROR:",
//                     invoiceId,
//                     detailError
//                 );
//             }
//         }

//         // =====================================================
//         // 6. FINAL RESULT
//         // =====================================================
//         console.log(
//             "FINAL SALES REPORT DATA:",
//             finalReportData
//         );

//         console.log(
//             "FINAL SALES REPORT COUNT:",
//             finalReportData.length
//         );

//         // =====================================================
//         // 7. SET DATA
//         // =====================================================
//         setSalesData(
//             finalReportData
//         );

//         setShowTable(true);
//         setPreviewOpen(true);

//     } catch (error) {

//         console.error(
//             "SALES REPORT ERROR:",
//             error
//         );

//         setSalesData([]);

//         setShowTable(true);
//         setPreviewOpen(true);

//         alert(
//             "Sales Report data load failed."
//         );
//     }
// };

//     const handleGetSalesReport = () => {
//         if (!fromDate || !toDate) {
//             alert("Please select both From Date and To Date.");
//             return;
//         }
//         getSalesReport();
//     };


   


//   const generatePDF = () => {
//     const doc = new jsPDF();

//     if (!Array.isArray(salesData) || salesData.length === 0) {
//         alert("No sales data available");
//         return;
//     }

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     let y = 25;

//     // =====================================================
//     // PAGE BORDER
//     // =====================================================

//     doc.setLineWidth(0.5);

//     doc.rect(
//         5,
//         5,
//         pageWidth - 10,
//         pageHeight - 10
//     );

//     // =====================================================
//     // HEADER
//     // =====================================================

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(20);

//     doc.text(
//         "AMRUT MILK PRODUCTS 2",
//         pageWidth / 2,
//         y,
//         {
//             align: "center",
//         }
//     );

//     // =====================================================
//     // HEADER LINE
//     // =====================================================

//     y += 10;

//     doc.setLineWidth(0.5);

//     doc.line(
//         10,
//         y,
//         pageWidth - 10,
//         y
//     );

//     y += 8;

//     // =====================================================
//     // TABLE HEADERS
//     // =====================================================

//     const tableHeaders = [
//         "Invoice No",
//         "Invoice Date",
//         "Account Name",
//         "Category",
//         "Product Name",
//         "Rate",
//         "Quantity",
//         "Amount",
//         "Transport",
//         "Sub Total",
//         "Total amount",
//     ];

//     // =====================================================
//     // TABLE DATA
//     // =====================================================

//     const tableData = salesData.map((item) => [
//         item.InvoiceNo || "-",
//         item.InvoiceDate || "-",
//         item.AccountName || "-",
//         item.Category || "Regular",
//         item.ProductName || "-",
//         Number(item.Rate || 0).toFixed(2),
//         Number(item.Quantity || 0).toFixed(3),
//         Number(item.Amount || 0).toFixed(2),
//         Number(item.Transport || 0).toFixed(2),
//         Number(item["Product Subtotal"] || 0).toFixed(2),
//         Number(item["Total amt"] || 0).toFixed(2),
//     ]);

//     // =====================================================
//     // GRAND TOTAL
//     // =====================================================

//     const grandTotal = salesData.reduce(
//         (acc, row) =>
//             acc + (Number(row["Total amt"]) || 0),
//         0
//     );

//     // =====================================================
//     // TABLE
//     // =====================================================

//     autoTable(doc, {
//         head: [tableHeaders],

//         body: tableData,

//         startY: y,

//         margin: {
//             left: 8,
//             right: 8,
//         },

//         theme: "grid",

//         styles: {
//             font: "helvetica",
//             fontSize: 7,
//             cellPadding: 1.5,
//             textColor: 0,
//             lineColor: [180, 180, 180],
//             lineWidth: 0.2,
//         },

//         headStyles: {
//             fillColor: [245, 245, 245],
//             textColor: 0,
//             fontStyle: "bold",
//             fontSize: 7,
//         },

//         // =================================================
//         // COLUMN ALIGNMENT
//         // =================================================

//         columnStyles: {
//             0: {
//                 halign: "center",
//             },

//             1: {
//                 halign: "center",
//             },

//             5: {
//                 halign: "right",
//             },

//             6: {
//                 halign: "right",
//             },

//             7: {
//                 halign: "right",
//             },

//             8: {
//                 halign: "right",
//             },

//             9: {
//                 halign: "right",
//             },

//             10: {
//                 halign: "right",
//             },
//         },

//         // =================================================
//         // GRAND TOTAL
//         // =================================================

//         foot: [
//             [
//                 {
//                     content: "Grand Total",
//                     colSpan: 10,
//                     styles: {
//                         halign: "right",
//                         fontStyle: "bold",
//                     },
//                 },

//                 {
//                     content: grandTotal.toFixed(2),
//                     styles: {
//                         halign: "right",
//                         fontStyle: "bold",
//                     },
//                 },
//             ],
//         ],

//         footStyles: {
//             fillColor: [245, 245, 245],
//             textColor: 0,
//             fontStyle: "bold",
//             fontSize: 8,
//         },

//         // =================================================
//         // PAGE BORDER ON EVERY PAGE
//         // =================================================

//         didDrawPage: () => {
//             doc.setLineWidth(0.5);

//             doc.rect(
//                 5,
//                 5,
//                 pageWidth - 10,
//                 pageHeight - 10
//             );
//         },
//     });

//     // =====================================================
//     // SAVE PDF
//     // =====================================================

//     doc.save("Sales_Report_Preview.pdf");
// };


//     const exportToExcel = async (data) => {
//         if (!data || data.length === 0) {
//             alert("No data available to export");
//             return;
//         }

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("SalesReport");

//         // Define header row
//        const headers = [
//     "Invoice No",
//     "Invoice Date",
//     "Account Name",
//     "Category",
//     "Product Name",
//     "Rate",
//     "Quantity (Nos)",
//     "Amount (Rs)",
//     "Transport",
//     "Sub Total",
//     "Total Amount",
// ];

//         worksheet.addRow(headers);

//         // Style header
//         worksheet.getRow(1).eachCell((cell) => {
//             cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
//             cell.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "FF4F81BD" }, // Blue header background
//             };
//             cell.alignment = { horizontal: "center", vertical: "middle" };
//         });

//         // Add data rows
//        data.forEach((item) => {

//     worksheet.addRow([

//         item.InvoiceNo,

//         item.InvoiceDate,

//         item.AccountName || "N/A",

//         item.Category || "Regular",

//         item.ProductName || "N/A",

//         Number(item.Rate) || 0,

//         Number(item.Quantity) || 0,

//         Number(item.Amount) || 0,

//         Number(item.Transport) || 0,

//         Number(item["Product Subtotal"]) || 0,

//         Number(item["Total amt"]) || 0,

//     ]);

// });

//         // Auto-fit columns
//         worksheet.columns.forEach((col) => {
//             let maxLength = 10;
//             col.eachCell({ includeEmpty: true }, (cell) => {
//                 const columnLength = cell.value ? cell.value.toString().length : 0;
//                 if (columnLength > maxLength) maxLength = columnLength;
//             });
//             col.width = maxLength + 5;
//         });

//         // Add Grand Total row
//         const totalRowIndex = worksheet.lastRow.number + 2;
//         const totalRow = worksheet.getRow(totalRowIndex);
//         totalRow.getCell(11).value = "Grand Total";
//         totalRow.getCell(11).font = { bold: true, size: 14 };
//         totalRow.getCell(11).alignment = { horizontal: "right" };

//         totalRow.getCell(12).value = { formula: `SUM(L2:L${worksheet.lastRow.number - 2})` };
//         // totalRow.getCell(13).value = { formula: `SUM(M2:M${worksheet.lastRow.number - 2})` };

//         // Style Grand Total row
//         totalRow.eachCell((cell) => {
//             cell.font = { bold: true, size: 14, color: { argb: "FF000000" } }; // Black bold text
//             cell.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "FFFFE699" }, // Light yellow background
//             };
//             cell.alignment = { horizontal: "center", vertical: "middle" };
//             cell.border = {
//                 top: { style: "thin" },
//                 bottom: { style: "thin" },
//             };
//         });

//         // Generate file
//         const buffer = await workbook.xlsx.writeBuffer();
//         const blob = new Blob([buffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });
//         saveAs(blob, `SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     };


  

//  const columns = useMemo(() => {
//     return [

//         {
//             accessorKey: 'InvoiceNo',
//             header: 'Invoice No',
//             size: 100,
//         },

//         {
//             accessorKey: 'InvoiceDate',
//             header: 'Invoice Date',
//             size: 50,

//             Cell: ({ cell }) => (
//                 <span>
//                     {moment(cell.getValue()).format('DD-MM-YYYY')}
//                 </span>
//             ),
//         },

//         {
//             accessorKey: 'AccountName',
//             header: 'Account Name',
//             size: 100,
//         },

//         {
//             accessorKey: 'Category',
//             header: 'Category',
//             size: 80,
//         },

      

       

//         {
//             accessorKey: 'ProductName',
//             header: 'Product Name',
//             size: 100,
//         },

//         {
//             accessorKey: 'Rate',
//             header: 'Rate',
//             size: 70,
//         },

//         {
//             accessorKey: 'Quantity',
//             header: 'Quantity',
//             size: 70,
//         },

//         {
//             accessorKey: 'Amount',
//             header: 'Amount',
//             size: 80,
//         },

//         {
//             accessorKey: 'Transport',
//             header: 'Transport',
//             size: 80,
//         },

//         {
//             accessorKey: 'Product Subtotal',
//             header: 'Sub Total',
//             size: 100,

//             Cell: ({ cell }) =>
//                 Number(cell.getValue() || 0).toFixed(2),
//         },

//         // {
//         //     accessorKey: 'Total amt',
//         //     header: 'Total Amount',
//         //     size: 100,

//         //     Cell: ({ cell }) =>
//         //         Number(cell.getValue() || 0).toFixed(2),
//         // },

//     ];
// }, []);

//  const table = useMaterialReactTable({
//     columns,
//     data: salesData,

//     // ❌ Pagination OFF
//     enablePagination: false,

//     muiTableHeadCellProps: {
//         style: {
//             backgroundColor: "#E9ECEF",
//             color: "black",
//             fontSize: "16px",
//         },
//     },

//     // =====================================================
//     // BOTTOM TOOLBAR
//     // Pagination काढले आहे
//     // फक्त Grand Total ठेवला आहे
//     // =====================================================
//     renderBottomToolbar: () => (
//         <Box
//             display="flex"
//             justifyContent="flex-end"
//             alignItems="center"
//             mr={4}
//             py={1}
//         >
//             {/* ➡️ Grand Total on Right */}
//             <Box display="flex" alignItems="center">
//                 <Typography
//                     variant="subtitle1"
//                     sx={{ mr: 2 }}
//                 >
//                     <b>Grand Total:</b>
//                 </Typography>

//                 <Typography
//                     variant="subtitle1"
//                     color="primary"
//                 >
//                     <b>
//                         {grandTotal.toLocaleString("en-IN")}
//                     </b>
//                 </Typography>
//             </Box>
//         </Box>
//     ),
// });


//     //grand Total
//  const grandTotal = useMemo(() => {
//     return salesData?.reduce(
//         (acc, row) =>
//             acc +
//             (Number(row["Total amt"]) || 0),
//         0
//     );
// }, [salesData]);


//     return (
//         <Box >
//             <Box textAlign={'center'}>
//                 <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Sales Report</b></Typography>
//             </Box>

//             <Box sx={{ p: 5, height: 'auto' }}>

//                 <Box>
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2 }}>

//                             <Box flex={1} >
//                                 <Typography>From Date</Typography>
//                                 <DatePicker
//                                     value={fromDate ? new Date(fromDate) : null}
//                                     format="dd-MM-yyyy"
//                                     onChange={(newValue) => setFromDate(newValue)}
//                                     slotProps={{
//                                         textField: { size: "small", fullWidth: true },
//                                     }}
//                                 />
//                             </Box>



//                             <Box flex={1} >
//                                 <Typography>To Date</Typography>
//                                 <DatePicker
//                                     value={toDate ? new Date(toDate) : null}
//                                     format="dd-MM-yyyy"
//                                     onChange={(newValue) => setToDate(newValue)}
//                                     slotProps={{
//                                         textField: { size: "small", fullWidth: true },
//                                     }}
//                                 />
//                             </Box>

//                         </Box>



//                     </LocalizationProvider>
//                 </Box>

//                 <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//                     <Box>
//                         <Button
//                             sx={{
//                                 background: 'var(--primary-color)',
//                             }}

//                             onClick={handleGetSalesReport}
//                             variant="contained"
//                         >
//                             Get Sales Report
//                         </Button>
//                     </Box>

//                 </Box>


               
//                 <>
//                     {showTable && (
//                         <>
//                             <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>

//                                <DialogTitle
//     sx={{
//         textAlign: 'center',
//         p: 0,
//         borderBottom: '2px solid #222',
//     }}
// >
//     {/* COMPANY HEADER */}
//     <Box
//         sx={{
//             width: '100%',
//             py: 3,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//         }}
//     >
//         {/* COMPANY NAME */}
//         <Typography
//             sx={{
//                 fontSize: '36px',
//                 fontWeight: 900,
//                 letterSpacing: '1px',
//                 color: '#111',
//                 lineHeight: 1.2,
//             }}
//         >
//             AMRUT MILK PRODUCTS 2
//         </Typography>

//         {/* ADDRESS */}
//         <Typography
//             sx={{
//                 fontSize: '20px',
//                 fontWeight: 400,
//                 color: '#555',
//                 mt: 1,
//             }}
//         >
//             E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER, KOLHAPUR
//         </Typography>

//         {/* PHONE + STATE */}
//         <Typography
//             sx={{
//                 fontSize: '18px',
//                 fontWeight: 400,
//                 color: '#555',
//                 mt: 1,
//             }}
//         >
//             Phone: 8830261523
//             <span style={{ margin: '0 15px' }}>|</span>
//             State: 27-Maharashtra
//         </Typography>

//         {/* REPORT TITLE */}
//         <Typography
//             sx={{
//                 fontSize: '20px',
//                 fontWeight: 'bold',
//                 color: '#111',
//                 mt: 2,
//             }}
//         >
//             Sales Report Preview for{' '}
//             {fromDate
//                 ? new Date(fromDate).toLocaleDateString('en-GB')
//                 : '-'}
//             {' '}to{' '}
//             {toDate
//                 ? new Date(toDate).toLocaleDateString('en-GB')
//                 : '-'}
//         </Typography>
//     </Box>
// </DialogTitle>

// <DialogContent dividers>

//     {/* TABLE ALWAYS SHOW */}
//    {/* TABLE ALWAYS SHOW */}

// <MaterialReactTable
//     table={table}
//     enablePagination={false}
//     enableColumnResizing
//     muiTableHeadCellProps={{
//         sx: {
//             color: 'var(--primary-color)',
//         },
//     }}
// />

//     {/* NO DATA MESSAGE */}
//     {salesData.length === 0 && (
//         <Box
//             sx={{
//                 textAlign: 'center',
//                 py: 3,
//                 border: '1px solid #ddd',
//                 borderTop: 'none',
//             }}
//         >
//             <Typography
//                 sx={{
//                     fontWeight: 'bold',
//                     color: 'text.secondary',
//                 }}
//             >
//                 No sales records found for the selected date range.
//             </Typography>
//         </Box>
//     )}

// </DialogContent>



//                                 <DialogActions sx={{ p: 0 }}>
//                                     <Box
//                                         display="flex"
//                                         justifyContent="space-between"
//                                         alignItems="center"
//                                         width="100%"
//                                         sx={{ borderTop: "2px solid #ddd", backgroundColor: "#f8f9fa", p: 2 }}
//                                     >
//                                         {/* ✅ Left side: Buttons */}
//                                         <Box display="flex" gap={2}>
//                                             <Button onClick={generatePDF} color="primary">
//                                                 <PrintIcon sx={{ fontSize: 35 }} />
//                                             </Button>
//                                             <Button
//                                                 variant="contained"
//                                                 endIcon={<FileDownloadIcon />}
//                                                 onClick={() => exportToExcel(salesData)}
//                                             >
//                                                 Excel Data
//                                             </Button>
//                                             <Button
//                                                 variant="contained"
//                                                 onClick={() => setPreviewOpen(false)}
//                                                 color="primary"
//                                             >
//                                                 Close
//                                             </Button>
//                                         </Box>

//                                         {/* ✅ Right side: Grand Total */}
//                                         {/* <Box display="flex" alignItems="center" fontWeight="bold">
//                                                 <Typography variant="h6" sx={{ mr: 2 }}>
//                                                    <b>Grand Total:</b> 
//                                                 </Typography>
//                                                 <Typography variant="h6" color="primary">
//                                                    <b> {grandTotal.toLocaleString("en-IN")} </b> 
//                                                 </Typography>
//                                             </Box> */}
//                                     </Box>
//                                 </DialogActions>

//                             </Dialog>
//                         </>
//                     )}
//                 </>
//                 {/* )} */}
//             </Box >
//         </Box >
//     );
// };

// export default SalesReport;























import { useState, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';

import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import moment from 'moment';
import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';
import { MRT_TablePagination as MUITablePagination } from "material-react-table";


const SalesReport = () => {
   const today = new Date();

const [fromDate, setFromDate] = useState(today);
const [toDate, setToDate] = useState(today);
    const [salesData, setSalesData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);


const getSalesReport = async () => {
    try {

        // =====================================================
        // DATE FORMAT
        // =====================================================
        const formatDate = (date) => {
            if (!date) return "";

            const d = new Date(date);

            return `${d.getFullYear()}-${String(
                d.getMonth() + 1
            ).padStart(2, "0")}-${String(
                d.getDate()
            ).padStart(2, "0")}`;
        };


        // =====================================================
// NORMALIZE API DATE
// =====================================================
const normalizeApiDate = (value) => {
    if (!value) return "";

    // API date object
    if (typeof value === "object" && value?.date) {
        return String(value.date).substring(0, 10);
    }

    // Normal string date
    if (typeof value === "string") {
        return value.substring(0, 10);
    }

    return "";
};




        const selectedFromDate = formatDate(fromDate);
        const selectedToDate = formatDate(toDate);

        // console.log(
        //     "SELECTED DATE RANGE:",
        //     selectedFromDate,
        //     "TO",
        //     selectedToDate
        // );

        // =====================================================
        // 1. GET INVOICE HEADER - PAGE 1
        // =====================================================
 

        // =====================================================
        // 1. GET ALL INVOICE HEADER PAGES
        // =====================================================

        // const firstResponse = await fetch(
        //     "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1"
        // );

        // if (!firstResponse.ok) {
        //     throw new Error(
        //         `Invoice Header API Error: ${firstResponse.status}`
        //     );
        // }

        // const firstResult = await firstResponse.json();

        // console.log("INVOICE HEADER PAGE 1:", firstResult);

        // =====================================================
        // EXTRACT PAGE DATA
        // =====================================================


        // =====================================================
        // GET INVOICE HEADERS FOR SELECTED DATE RANGE
        // =====================================================

        const getPageData = (result) => {
            if (Array.isArray(result)) return result;
            if (Array.isArray(result?.data)) return result.data;
            if (Array.isArray(result?.Data)) return result.Data;
            if (Array.isArray(result?.records)) return result.records;
            return [];
        };

        let allInvoiceHeaders = [];

        const from = new Date(`${selectedFromDate}T12:00:00`);
        const to = new Date(`${selectedToDate}T12:00:00`);

        if (from > to) {
            throw new Error("From Date cannot be after To Date.");
        }

        for (
            let currentDate = new Date(from);
            currentDate <= to;
            currentDate.setDate(currentDate.getDate() + 1)
        ) {
            const selectedDate = formatDate(currentDate);

            // console.log("FETCHING INVOICES FOR:", selectedDate);

            // PAGE 1 FOR SELECTED DATE
            const firstResponse = await fetch(
                `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1&InvoiceDate=${encodeURIComponent(selectedDate)}`
            );

            if (!firstResponse.ok) {
                throw new Error(
                    `Invoice API Error for ${selectedDate}: ${firstResponse.status}`
                );
            }

            const firstResult = await firstResponse.json();

            // console.log(
            //     `INVOICE RESPONSE FOR ${selectedDate}:`,
            //     firstResult
            // );

            const firstPageData = getPageData(firstResult);

            const totalPages = Number(
                firstResult?.total_pages ??
                firstResult?.TotalPages ??
                firstResult?.totalPages ??
                firstResult?.pages ??
                1
            );

            if (!Number.isFinite(totalPages) || totalPages < 1) {
                throw new Error(
                    `Invalid total pages for ${selectedDate}`
                );
            }

            allInvoiceHeaders.push(...firstPageData);

            // REMAINING PAGES FOR THE SAME DATE
            for (let page = 2; page <= totalPages; page++) {
                const pageResponse = await fetch(
                    `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}&InvoiceDate=${encodeURIComponent(selectedDate)}`
                );

                if (!pageResponse.ok) {
                    throw new Error(
                        `Invoice page ${page} failed for ${selectedDate}`
                    );
                }

                const pageResult = await pageResponse.json();

                allInvoiceHeaders.push(...getPageData(pageResult));
            }
        }

        // =====================================================
        // REMOVE DUPLICATE INVOICE HEADERS
        // =====================================================

        const uniqueInvoices = new Map();

        allInvoiceHeaders.forEach((invoice) => {
            const invoiceDate = normalizeApiDate(invoice?.InvoiceDate);

            const invoiceId =
                invoice?.Id ??
                invoice?.InvoiceId ??
                invoice?.InvoiceNo;

            if (invoiceId != null) {
                uniqueInvoices.set(
                    `${invoiceDate}_${invoiceId}`,
                    invoice
                );
            }
        });

        allInvoiceHeaders = [...uniqueInvoices.values()];

        // console.log(
        //     "TOTAL INVOICE HEADERS:",
        //     allInvoiceHeaders.length
        // );

        console.log(
            "ALL API INVOICE DATES:",
            [
                ...new Set(
                    allInvoiceHeaders.map((invoice) =>
                        normalizeApiDate(invoice?.InvoiceDate)
                    )
                ),
            ]
        );


        // =====================================================
        // 2. DATE FILTER
        // =====================================================
        // const dateFilteredInvoices =
        //     allInvoiceHeaders.filter((invoice) => {

        //         const rawInvoiceDate =
        //             invoice?.InvoiceDate;

        //         let invoiceDate = "";

        //         if (
        //             typeof rawInvoiceDate === "object" &&
        //             rawInvoiceDate?.date
        //         ) {
        //             invoiceDate =
        //                 String(
        //                     rawInvoiceDate.date
        //                 ).substring(0, 10);
        //         }
        //         else if (rawInvoiceDate) {
        //             invoiceDate =
        //                 String(
        //                     rawInvoiceDate
        //                 ).substring(0, 10);
        //         }

        //         const match =
        //             invoiceDate >= selectedFromDate &&
        //             invoiceDate <= selectedToDate;

        //         console.log(
        //             "DATE CHECK:",
        //             invoice?.InvoiceNo,
        //             invoiceDate,
        //             match
        //         );

        //         return match;
        //     });




        
const dateFilteredInvoices = allInvoiceHeaders.filter((invoice) => {
    const rawInvoiceDate = invoice?.InvoiceDate;

    if (!rawInvoiceDate) {
        return false;
    }

    // 1. Normalize API date
    let invoiceDate = "";

    if (
        typeof rawInvoiceDate === "object" &&
        rawInvoiceDate !== null
    ) {
        invoiceDate = String(
            rawInvoiceDate.date ?? ""
        ).trim();
    } else {
        invoiceDate = String(rawInvoiceDate).trim();
    }

    if (!invoiceDate) {
        return false;
    }

    // 2. Extract date portion if time is also present
    invoiceDate = invoiceDate.substring(0, 10);

    // 3. Convert DD-MM-YYYY to YYYY-MM-DD
    if (/^\d{2}-\d{2}-\d{4}$/.test(invoiceDate)) {
        const [day, month, year] = invoiceDate.split("-");

        invoiceDate = `${year}-${month}-${day}`;
    }

    // 4. Convert DD/MM/YYYY to YYYY-MM-DD
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(invoiceDate)) {
        const [day, month, year] = invoiceDate.split("/");

        invoiceDate = `${year}-${month}-${day}`;
    }

    // 5. Validate normalized date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
        console.warn(
            "INVALID INVOICE DATE:",
            invoice?.InvoiceNo,
            rawInvoiceDate
        );

        return false;
    }

    // 6. Compare dates in YYYY-MM-DD format
    const match =
        invoiceDate >= selectedFromDate &&
        invoiceDate <= selectedToDate;

    // console.log("DATE CHECK:", {
    //     InvoiceNo: invoice?.InvoiceNo,
    //     OriginalDate: rawInvoiceDate,
    //     NormalizedDate: invoiceDate,
    //     FromDate: selectedFromDate,
    //     ToDate: selectedToDate,
    //     Match: match,
    // });

    return match;
});

// console.log(
//     "DATE FILTERED INVOICE COUNT:",
//     dateFilteredInvoices.length
// );


        






// =====================================================
// PRODUCT MASTER
// =====================================================
const productResponse = await fetch(
    "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster"
);

if (!productResponse.ok) {
    throw new Error(
        `Product Master API Error: ${productResponse.status}`
    );
}

const productResult = await productResponse.json();

const productList =
    Array.isArray(productResult)
        ? productResult
        : Array.isArray(productResult?.data)
            ? productResult.data
            : [];

// console.log("PRODUCT MASTER:", productList);

// ProductId -> ProductName
const productMap = new Map();

productList.forEach((product) => {
    const id =
        product?.Id ??
        product?.ProductId ??
        product?.ProductCode;

    const name =
        product?.ProductName ??
        product?.name ??
        "";

    if (id != null) {
        productMap.set(
            String(id),
            name
        );
    }
});

// console.log("PRODUCT MAP:", productMap);




      // =====================================================
// CUSTOMER INFO CACHE
// =====================================================
const customerInfoCache = new Map();

// =====================================================
// GET CUSTOMER TYPE + CUSTOMER NAME
// =====================================================
const getCustomerInfo = async (accountId) => {

    // -------------------------------------------------
    // AccountId = 0 => Regular Sale
    // -------------------------------------------------
    if (!accountId || Number(accountId) === 0) {
        return {
            type: "R",
            name: ""
        };
    }

    const cacheKey = String(accountId);

    if (customerInfoCache.has(cacheKey)) {
        return customerInfoCache.get(cacheKey);
    }

    let customerType = "";
    let customerName = "";

    try {

        // =================================================
        // ACCOUNT API
        // =================================================
        const accountResponse = await fetch(
            `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=account&Colname=Id&Colvalue=${accountId}`
        );

        if (accountResponse.ok) {

            const accountResult =
                await accountResponse.json();

            // console.log(
            //     "ACCOUNT RESPONSE:",
            //     accountId,
            //     accountResult
            // );

            const account =
                Array.isArray(accountResult)
                    ? accountResult[0]
                    : Array.isArray(accountResult?.data)
                        ? accountResult.data[0]
                        : accountResult?.data ||
                          accountResult ||
                          null;

            if (account) {

                // -------------------------------
                // CUSTOMER TYPE
                // -------------------------------
                customerType = String(
                    account?.CustomerType ||
                    account?.customerType ||
                    ""
                )
                    .trim()
                    .toUpperCase();

                // -------------------------------
                // CUSTOMER NAME
                // -------------------------------
                customerName =
                    account?.AccountName ||
                    account?.accountName ||
                    account?.Name ||
                    account?.name ||
                    "";
            }
        }

        // =================================================
        // ADDRESS API - ONLY IF TYPE NOT FOUND
        // =================================================
        if (!customerType) {

            const addressResponse = await fetch(
                `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`
            );

            if (addressResponse.ok) {

                const addressResult =
                    await addressResponse.json();

                // console.log(
                //     "ADDRESS RESPONSE:",
                //     accountId,
                //     addressResult
                // );

                const address =
                    Array.isArray(addressResult)
                        ? addressResult[0]
                        : Array.isArray(addressResult?.data)
                            ? addressResult.data[0]
                            : addressResult?.data ||
                              addressResult ||
                              null;

                if (address) {

                    customerType = String(
                        address?.CustomerType ||
                        address?.customerType ||
                        ""
                    )
                        .trim()
                        .toUpperCase();

                    if (!customerName) {
                        customerName =
                            address?.AccountName ||
                            address?.accountName ||
                            address?.Name ||
                            address?.name ||
                            "";
                    }
                }
            }
        }

    } catch (error) {

        console.error(
            "CUSTOMER INFO ERROR:",
            accountId,
            error
        );
    }

    // =================================================
    // NORMALIZE CUSTOMER TYPE
    // =================================================

    if (
        customerType === "D" ||
        customerType === "DEALER"
    ) {
        customerType = "D";
    }
    else if (
        customerType === "C" ||
        customerType === "CATERER" ||
        customerType === "CATERERS"
    ) {
        customerType = "C";
    }
    else {
        customerType = "R";
    }

    const result = {
        type: customerType,
        name: customerName
    };

    customerInfoCache.set(
        cacheKey,
        result
    );

    return result;
};

        // =====================================================
        // 5. GET DETAILS FOR EACH INVOICE
        // =====================================================
        const finalReportData = [];

        for (
            const invoice of dateFilteredInvoices
        ) {

            const invoiceId =
                invoice?.Id ??
                invoice?.InvoiceId;

            const accountId =
                invoice?.AccountId ?? 0;

            // console.log(
            //     "PROCESSING INVOICE:",
            //     invoice?.InvoiceNo,
            //     "InvoiceId:",
            //     invoiceId,
            //     "AccountId:",
            //     accountId
            // );

            // =================================================
            // CATEGORY
            // =================================================
           const customerInfo =
    await getCustomerInfo(
        accountId
    );

const customerType =
    customerInfo.type;

            let category = "Regular";

            if (
                customerType === "D"
            ) {
                category = "Dealer";
            }
            else if (
                customerType === "C"
            ) {
                category = "Caterers";
            }

            // =================================================
            // CUSTOMER NAME
            // =================================================
           const accountName =
    invoice?.AccountName ||
    invoice?.CustomerName ||
    customerInfo.name ||
    "N/A";

            // =================================================
            // GET INVOICE DETAILS
            // =================================================
            if (!invoiceId) {
                continue;
            }

            try {

                const detailResponse =
                    await fetch(
                        `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
                    );

                if (!detailResponse.ok) {
                    continue;
                }

                const detailResult =
                    await detailResponse.json();

                const details =
                    Array.isArray(detailResult)
                        ? detailResult
                        : Array.isArray(
                            detailResult?.data
                        )
                            ? detailResult.data
                            : [];

                // =================================================
                // IF NO DETAIL
                // =================================================
                if (details.length === 0) {

                    finalReportData.push({

                        InvoiceNo:
                            invoice?.InvoiceNo,

                       InvoiceDate:
    normalizeApiDate(invoice?.InvoiceDate),

                        AccountName:
                            accountName,

                        Category:
                            category,

                        OrderNo:
                            invoice?.OrderNo || "",

                        OrderDate:
                            invoice?.OrderDate || "",

                        ProductName:
                            "",

                        Rate:
                            0,

                        Quantity:
                            0,

                        Amount:
                            Number(
                                invoice?.Total ||
                                invoice?.TotalAmount ||
                                0
                            ),

                        Transport:
                            Number(
                                invoice?.Transport || 0
                            ),

                        "Product Subtotal":
                            Number(
                                invoice?.SubTotal ||
                                invoice?.Subtotal ||
                                0
                            ),

                        "Total amt":
                            Number(
                                invoice?.Total ||
                                invoice?.TotalAmount ||
                                0
                            ),
                    });

                    continue;
                }

                // =================================================
                // ADD EACH PRODUCT
                // =================================================
details.forEach((detail, index) => {
    finalReportData.push({
        InvoiceNo: invoice?.InvoiceNo,

        InvoiceDate: normalizeApiDate(invoice?.InvoiceDate),

        AccountName: accountName,

        Category: category,

        OrderNo: invoice?.OrderNo || "",

        OrderDate: normalizeApiDate(invoice?.OrderDate),

       ProductName:
    detail?.ProductName ||
    detail?.productName ||
    productMap.get(
        String(
            detail?.ProductId ??
            detail?.ProductCode ??
            ""
        )
    ) ||
    "Unknown Product",

        Rate: Number(
            detail?.Rate ??
            detail?.rate ??
            0
        ),

        Quantity: Number(
            detail?.Quantity ??
            detail?.quantity ??
            0
        ),

        Amount: Number(
            detail?.Amount ??
            detail?.amount ??
            0
        ),

        Transport:
            index === 0
                ? Number(invoice?.Transport ?? 0)
                : 0,

        "Product Subtotal": Number(
            detail?.["Product Subtotal"] ??
            detail?.ProductSubtotal ??
            detail?.Amount ??
            0
        ),

        "Total amt":
            index === 0
                ? Number(
                    invoice?.Total ??
                    invoice?.TotalAmount ??
                    0
                )
                : 0
    });
});

            } catch (detailError) {

                console.error(
                    "DETAIL API ERROR:",
                    invoiceId,
                    detailError
                );
            }
        }

        // =====================================================
        // 6. FINAL RESULT
        // =====================================================
        // console.log(
        //     "FINAL SALES REPORT DATA:",
        //     finalReportData
        // );

        // console.log(
        //     "FINAL SALES REPORT COUNT:",
        //     finalReportData.length
        // );

        // =====================================================
        // 7. SET DATA
        // =====================================================
        setSalesData(
            finalReportData
        );

        setShowTable(true);
        setPreviewOpen(true);

    } catch (error) {

        console.error(
            "SALES REPORT ERROR:",
            error
        );

        setSalesData([]);

        setShowTable(true);
        setPreviewOpen(true);

        alert(
            "Sales Report data load failed."
        );
    }
};

    const handleGetSalesReport = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        getSalesReport();
    };


   


  const generatePDF = () => {
    const doc = new jsPDF();

    if (!Array.isArray(salesData) || salesData.length === 0) {
        alert("No sales data available");
        return;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 25;

    // =====================================================
    // PAGE BORDER
    // =====================================================

    doc.setLineWidth(0.5);

    doc.rect(
        5,
        5,
        pageWidth - 10,
        pageHeight - 10
    );

    // =====================================================
    // HEADER
    // =====================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text(
        "AMRUT MILK PRODUCTS 2",
        pageWidth / 2,
        y,
        {
            align: "center",
        }
    );

    // =====================================================
    // HEADER LINE
    // =====================================================

    y += 10;

    doc.setLineWidth(0.5);

    doc.line(
        10,
        y,
        pageWidth - 10,
        y
    );

    y += 8;

    // =====================================================
    // TABLE HEADERS
    // =====================================================

    const tableHeaders = [
        "Invoice No",
        "Invoice Date",
        "Account Name",
        "Category",
        "Product Name",
        "Rate",
        "Quantity",
        "Amount",
        "Transport",
        "Sub Total",
        "Total amount",
    ];

    // =====================================================
    // TABLE DATA
    // =====================================================

    const tableData = salesData.map((item) => [
        item.InvoiceNo || "-",
        item.InvoiceDate || "-",
        item.AccountName || "-",
        item.Category || "Regular",
        item.ProductName || "-",
        Number(item.Rate || 0).toFixed(2),
        Number(item.Quantity || 0).toFixed(3),
        Number(item.Amount || 0).toFixed(2),
        Number(item.Transport || 0).toFixed(2),
        Number(item["Product Subtotal"] || 0).toFixed(2),
        Number(item["Total amt"] || 0).toFixed(2),
    ]);

    // =====================================================
    // GRAND TOTAL
    // =====================================================

    const grandTotal = salesData.reduce(
        (acc, row) =>
            acc + (Number(row["Total amt"]) || 0),
        0
    );

    // =====================================================
    // TABLE
    // =====================================================

    autoTable(doc, {
        head: [tableHeaders],

        body: tableData,

        startY: y,

        margin: {
            left: 8,
            right: 8,
        },

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 1.5,
            textColor: 0,
            lineColor: [180, 180, 180],
            lineWidth: 0.2,
        },

        headStyles: {
            fillColor: [245, 245, 245],
            textColor: 0,
            fontStyle: "bold",
            fontSize: 7,
        },

        // =================================================
        // COLUMN ALIGNMENT
        // =================================================

        columnStyles: {
            0: {
                halign: "center",
            },

            1: {
                halign: "center",
            },

            5: {
                halign: "right",
            },

            6: {
                halign: "right",
            },

            7: {
                halign: "right",
            },

            8: {
                halign: "right",
            },

            9: {
                halign: "right",
            },

            10: {
                halign: "right",
            },
        },

        // =================================================
        // GRAND TOTAL
        // =================================================

        foot: [
            [
                {
                    content: "Grand Total",
                    colSpan: 10,
                    styles: {
                        halign: "right",
                        fontStyle: "bold",
                    },
                },

                {
                    content: grandTotal.toFixed(2),
                    styles: {
                        halign: "right",
                        fontStyle: "bold",
                    },
                },
            ],
        ],

        footStyles: {
            fillColor: [245, 245, 245],
            textColor: 0,
            fontStyle: "bold",
            fontSize: 8,
        },

        // =================================================
        // PAGE BORDER ON EVERY PAGE
        // =================================================

        didDrawPage: () => {
            doc.setLineWidth(0.5);

            doc.rect(
                5,
                5,
                pageWidth - 10,
                pageHeight - 10
            );
        },
    });

    // =====================================================
    // SAVE PDF
    // =====================================================

    doc.save("Sales_Report_Preview.pdf");
};


    const exportToExcel = async (data) => {
        if (!data || data.length === 0) {
            alert("No data available to export");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("SalesReport");

        // Define header row
       const headers = [
    "Invoice No",
    "Invoice Date",
    "Account Name",
    "Category",
    "Product Name",
    "Rate",
    "Quantity (Nos)",
    "Amount (Rs)",
    "Transport",
    "Sub Total",
    "Total Amount",
];

        worksheet.addRow(headers);

        // Style header
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF4F81BD" }, // Blue header background
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // Add data rows
       data.forEach((item) => {

    worksheet.addRow([

        item.InvoiceNo,

        item.InvoiceDate,

        item.AccountName || "N/A",

        item.Category || "Regular",

        item.ProductName || "N/A",

        Number(item.Rate) || 0,

        Number(item.Quantity) || 0,

        Number(item.Amount) || 0,

        Number(item.Transport) || 0,

        Number(item["Product Subtotal"]) || 0,

        Number(item["Total amt"]) || 0,

    ]);

});

        // Auto-fit columns
        worksheet.columns.forEach((col) => {
            let maxLength = 10;
            col.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 0;
                if (columnLength > maxLength) maxLength = columnLength;
            });
            col.width = maxLength + 5;
        });

        // Add Grand Total row
        const totalRowIndex = worksheet.lastRow.number + 2;
        const totalRow = worksheet.getRow(totalRowIndex);
        totalRow.getCell(11).value = "Grand Total";
        totalRow.getCell(11).font = { bold: true, size: 14 };
        totalRow.getCell(11).alignment = { horizontal: "right" };

        totalRow.getCell(12).value = { formula: `SUM(L2:L${worksheet.lastRow.number - 2})` };
        // totalRow.getCell(13).value = { formula: `SUM(M2:M${worksheet.lastRow.number - 2})` };

        // Style Grand Total row
        totalRow.eachCell((cell) => {
            cell.font = { bold: true, size: 14, color: { argb: "FF000000" } }; // Black bold text
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFE699" }, // Light yellow background
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
            };
        });

        // Generate file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };


  

 const columns = useMemo(() => {
    return [

        {
            accessorKey: 'InvoiceNo',
            header: 'Invoice No',
            size: 100,
        },

        {
            accessorKey: 'InvoiceDate',
            header: 'Invoice Date',
            size: 50,

            Cell: ({ cell }) => (
                <span>
                    {moment(cell.getValue()).format('DD-MM-YYYY')}
                </span>
            ),
        },

        {
            accessorKey: 'AccountName',
            header: 'Account Name',
            size: 100,
        },

        {
            accessorKey: 'Category',
            header: 'Category',
            size: 80,
        },

      

       

        {
            accessorKey: 'ProductName',
            header: 'Product Name',
            size: 100,
        },

        {
            accessorKey: 'Rate',
            header: 'Rate',
            size: 70,
        },

        {
            accessorKey: 'Quantity',
            header: 'Quantity',
            size: 70,
        },

        {
            accessorKey: 'Amount',
            header: 'Amount',
            size: 80,
        },

        {
            accessorKey: 'Transport',
            header: 'Transport',
            size: 80,
        },

        {
            accessorKey: 'Product Subtotal',
            header: 'Sub Total',
            size: 100,

            Cell: ({ cell }) =>
                Number(cell.getValue() || 0).toFixed(2),
        },

        // {
        //     accessorKey: 'Total amt',
        //     header: 'Total Amount',
        //     size: 100,

        //     Cell: ({ cell }) =>
        //         Number(cell.getValue() || 0).toFixed(2),
        // },

    ];
}, []);

 const table = useMaterialReactTable({
    columns,
    data: salesData,

    // ❌ Pagination OFF
    enablePagination: false,

    muiTableHeadCellProps: {
        style: {
            backgroundColor: "#E9ECEF",
            color: "black",
            fontSize: "16px",
        },
    },

    // =====================================================
    // BOTTOM TOOLBAR
    // Pagination काढले आहे
    // फक्त Grand Total ठेवला आहे
    // =====================================================
    renderBottomToolbar: () => (
        <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mr={4}
            py={1}
        >
            {/* ➡️ Grand Total on Right */}
            <Box display="flex" alignItems="center">
                <Typography
                    variant="subtitle1"
                    sx={{ mr: 2 }}
                >
                    <b>Grand Total:</b>
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="primary"
                >
                    <b>
                        {grandTotal.toLocaleString("en-IN")}
                    </b>
                </Typography>
            </Box>
        </Box>
    ),
});


    //grand Total
 const grandTotal = useMemo(() => {
    return salesData?.reduce(
        (acc, row) =>
            acc +
            (Number(row["Total amt"]) || 0),
        0
    );
}, [salesData]);


    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Sales Report</b></Typography>
            </Box>

            <Box sx={{ p: 5, height: 'auto' }}>

                <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2 }}>

                            <Box flex={1} >
                                <Typography>From Date</Typography>
                                <DatePicker
                                    value={fromDate ? new Date(fromDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setFromDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", fullWidth: true },
                                    }}
                                />
                            </Box>



                            <Box flex={1} >
                                <Typography>To Date</Typography>
                                <DatePicker
                                    value={toDate ? new Date(toDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setToDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", fullWidth: true },
                                    }}
                                />
                            </Box>

                        </Box>



                    </LocalizationProvider>
                </Box>

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                    <Box>
                        <Button
                            sx={{
                                background: 'var(--primary-color)',
                            }}

                            onClick={handleGetSalesReport}
                            variant="contained"
                        >
                            Get Sales Report
                        </Button>
                    </Box>

                </Box>


               
                <>
                    {showTable && (
                        <>
                            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>

                               <DialogTitle
    sx={{
        textAlign: 'center',
        p: 0,
        borderBottom: '2px solid #222',
    }}
>
    {/* COMPANY HEADER */}
    <Box
        sx={{
            width: '100%',
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {/* COMPANY NAME */}
        <Typography
            sx={{
                fontSize: '36px',
                fontWeight: 900,
                letterSpacing: '1px',
                color: '#111',
                lineHeight: 1.2,
            }}
        >
            AMRUT MILK PRODUCTS 2
        </Typography>

        {/* ADDRESS */}
        <Typography
            sx={{
                fontSize: '20px',
                fontWeight: 400,
                color: '#555',
                mt: 1,
            }}
        >
            E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER, KOLHAPUR
        </Typography>

        {/* PHONE + STATE */}
        <Typography
            sx={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#555',
                mt: 1,
            }}
        >
            Phone: 8830261523
            <span style={{ margin: '0 15px' }}>|</span>
            State: 27-Maharashtra
        </Typography>

        {/* REPORT TITLE */}
        <Typography
            sx={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#111',
                mt: 2,
            }}
        >
            Sales Report Preview for{' '}
            {fromDate
                ? new Date(fromDate).toLocaleDateString('en-GB')
                : '-'}
            {' '}to{' '}
            {toDate
                ? new Date(toDate).toLocaleDateString('en-GB')
                : '-'}
        </Typography>
    </Box>
</DialogTitle>

<DialogContent dividers>

    {/* TABLE ALWAYS SHOW */}
   {/* TABLE ALWAYS SHOW */}

<MaterialReactTable
    table={table}
    enablePagination={false}
    enableColumnResizing
    muiTableHeadCellProps={{
        sx: {
            color: 'var(--primary-color)',
        },
    }}
/>

    {/* NO DATA MESSAGE */}
    {salesData.length === 0 && (
        <Box
            sx={{
                textAlign: 'center',
                py: 3,
                border: '1px solid #ddd',
                borderTop: 'none',
            }}
        >
            <Typography
                sx={{
                    fontWeight: 'bold',
                    color: 'text.secondary',
                }}
            >
                No sales records found for the selected date range.
            </Typography>
        </Box>
    )}

</DialogContent>



                                <DialogActions sx={{ p: 0 }}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        width="100%"
                                        sx={{ borderTop: "2px solid #ddd", backgroundColor: "#f8f9fa", p: 2 }}
                                    >
                                        {/* ✅ Left side: Buttons */}
                                        <Box display="flex" gap={2}>
                                            <Button onClick={generatePDF} color="primary">
                                                <PrintIcon sx={{ fontSize: 35 }} />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                endIcon={<FileDownloadIcon />}
                                                onClick={() => exportToExcel(salesData)}
                                            >
                                                Excel Data
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => setPreviewOpen(false)}
                                                color="primary"
                                            >
                                                Close
                                            </Button>
                                        </Box>

                                        {/* ✅ Right side: Grand Total */}
                                        {/* <Box display="flex" alignItems="center" fontWeight="bold">
                                                <Typography variant="h6" sx={{ mr: 2 }}>
                                                   <b>Grand Total:</b> 
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                   <b> {grandTotal.toLocaleString("en-IN")} </b> 
                                                </Typography>
                                            </Box> */}
                                    </Box>
                                </DialogActions>

                            </Dialog>
                        </>
                    )}
                </>
                {/* )} */}
            </Box >
        </Box >
    );
};

export default SalesReport;















