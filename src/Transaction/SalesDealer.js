

// import { useMemo, useState, useEffect, useRef } from "react";

// import { useLocation, useNavigate } from "react-router-dom";
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
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";
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
// import { toast, ToastContainer } from "react-toastify";
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

// import amrutLogo from "../imgs/amrutlogo.png";
// import fremilaLogo from "../imgs/fremilalogo.png";

// const DealerSalesEntry = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [invoiceheaders, setInvoiceheaders] = useState([]);
//   const [invoicedetails, setInvoicedetails] = useState([]);
//   const [rows, setRows] = useState([]);


// // ======================================================
// // INVOICE LIST FILTERS
// // ======================================================
// const [searchText, setSearchText] = useState("");
// const [categoryFilter, setCategoryFilter] = useState("");
// const [filterFromDate, setFilterFromDate] = useState("");
// const [filterToDate, setFilterToDate] = useState("");

// // Product options
// const [productOptions, setProductOptions] = useState([]);


//   useEffect(() => {
//     // fetchInvdetails();
//   }, []);

  
// // ======================================================
// // GET ALL INVOICE HEADERS
// // ======================================================
// const fetchInvoiceHeader = async () => {
//   const requestOptions = {
//     method: "GET",
//     redirect: "follow",
//   };

//   try {
//     // ==================================================
//     // 1. FIRST PAGE
//     // ==================================================
//     const firstResponse = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1`,
//       requestOptions
//     );

//     const firstResult = await firstResponse.json();

//     const totalPages = Number(
//       firstResult?.total_pages || 1
//     );

//     let allInvoiceData = [
//       ...(firstResult?.data || []),
//     ];

//     // ==================================================
//     // 2. GET REMAINING PAGES
//     // ==================================================
//     if (totalPages > 1) {
//       for (let page = 2; page <= totalPages; page++) {
//         const response = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}`,
//           requestOptions
//         );

//         const result = await response.json();

//         allInvoiceData = [
//           ...allInvoiceData,
//           ...(result?.data || []),
//         ];
//       }
//     }

//     // ==================================================
//     // 3. SORT NEWEST BILL FIRST
//     // ==================================================
//     allInvoiceData.sort(
//       (a, b) =>
//         Number(b?.Id || 0) -
//         Number(a?.Id || 0)
//     );

//     // ==================================================
//     // 4. FETCH ACCOUNT + ADDRESS
//     // ==================================================
//     const invoicesList = await Promise.all(
//       allInvoiceData.map(async (invoice) => {
//         try {
//           // --------------------------------------------
//           // ACCOUNT
//           // --------------------------------------------
//           let accountDetails = null;

//           if (
//             invoice?.AccountId &&
//             Number(invoice.AccountId) !== 0
//           ) {
//             const acctResponse = await fetch(
//               `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invoice.AccountId}`,
//               requestOptions
//             );

//             if (acctResponse.ok) {
//               const acctResult =
//                 await acctResponse.json();

//               accountDetails = Array.isArray(
//                 acctResult
//               )
//                 ? acctResult[0] || null
//                 : Array.isArray(acctResult?.data)
//                   ? acctResult.data[0] || null
//                   : acctResult?.data ||
//                     acctResult ||
//                     null;
//             }
//           }

//           // --------------------------------------------
//           // ADDRESS
//           // --------------------------------------------
//           let addressDetails = null;

//           if (
//             invoice?.AccountId &&
//             Number(invoice.AccountId) !== 0
//           ) {
//             const addressResponse =
//               await fetch(
//                 `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${invoice.AccountId}`,
//                 requestOptions
//               );

//             if (addressResponse.ok) {
//               const addressResult =
//                 await addressResponse.json();

//               addressDetails = Array.isArray(
//                 addressResult
//               )
//                 ? addressResult[0] || null
//                 : Array.isArray(
//                       addressResult?.data
//                     )
//                   ? addressResult.data[0] ||
//                     null
//                   : addressResult?.data ||
//                     addressResult ||
//                     null;
//             }
//           }

//           // --------------------------------------------
//           // CUSTOMER TYPE
//           // --------------------------------------------
//           const customerType = String(
//             addressDetails?.CustomerType ||
//               addressDetails?.customerType ||
//               accountDetails?.CustomerType ||
//               accountDetails?.customerType ||
//               invoice?.CustomerType ||
//               invoice?.customerType ||
//               ""
//           )
//             .trim()
//             .toUpperCase();

//           return {
//             ...invoice,

//             accountDetails: {
//               ...(accountDetails || {}),
//               CustomerType: customerType,
//             },

//             addressDetails,
//           };
//         } catch (error) {
//           console.error(
//             `Failed to fetch customer details for invoice ${invoice?.Id}:`,
//             error
//           );


// return {
//   ...invoice,

//   accountDetails: {
//     AccountName: invoice?.AccountName || "",
//     CustomerType:
//       invoice?.CustomerType ||
//       invoice?.customerType ||
//       "",
//   },

//   addressDetails: null,
// };

//         }
//       })
//     );

//     // ==================================================
//     // 5. SAVE ALL INVOICES
//     // ==================================================
//     setInvoiceheaders(invoicesList);

//     setTotalPages(totalPages);

//     console.log(
//       "ALL DEALER INVOICES:",
//       invoicesList
//     );

//     console.log(
//       "TOTAL DEALER INVOICE COUNT:",
//       invoicesList.length
//     );
//   } catch (error) {
//     console.error(
//       "Error fetching all invoice headers:",
//       error
//     );
//   }
// };




// // ======================================================
// // FETCH CUSTOMER PREVIOUS DUE
// // ======================================================

// const fetchPreviousBalance = async (
//   customerId,
//   excludeInvoiceId = null
// ) => {
//   if (!customerId) {
//     setPreviousBalanceDue(0);
//     return 0;
//   }

//   try {
//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
//         customerId
//       )}`
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Invoice history API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     // API response array handle करा
//     const invoiceList = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : result?.data
//       ? [result.data]
//       : [];

//     let previousBalance = 0;

//     console.log("==============================================");
//     console.log("PREVIOUS BALANCE CALCULATION");
//     console.log("Customer ID:", customerId);
//     console.log("Exclude Invoice ID:", excludeInvoiceId);
//     console.log("Total Invoices Returned:", invoiceList.length);
//     console.log("==============================================");

//     for (const invoice of invoiceList) {
//       const invoiceId = Number(invoice?.Id || 0);

//       // --------------------------------------------------
//       // EDIT MODE
//       // Currently editing invoice Previous Due मध्ये
//       // पुन्हा calculate होऊ नये
//       // --------------------------------------------------
//       if (
//         excludeInvoiceId !== null &&
//         excludeInvoiceId !== undefined &&
//         String(invoiceId) === String(excludeInvoiceId)
//       ) {
//         console.log(
//           "SKIPPING CURRENT EDIT INVOICE:",
//           invoiceId
//         );

//         continue;
//       }

//       // --------------------------------------------------
//       // Invoice Total
//       // --------------------------------------------------
//       const invoiceTotal =
//         parseFloat(invoice?.Total) || 0;

//       // --------------------------------------------------
//       // Received Amount
//       // --------------------------------------------------
//       let invoiceReceived = 0;

//       if (
//         invoice?.ReceivedAmount !== null &&
//         invoice?.ReceivedAmount !== undefined &&
//         invoice?.ReceivedAmount !== ""
//       ) {
//         invoiceReceived =
//           parseFloat(invoice.ReceivedAmount) || 0;
//       } else {
//         // Fallback:
//         // Cash + Online
//         const cashAmount =
//           parseFloat(invoice?.CashAmount) || 0;

//         const onlineAmount =
//           parseFloat(invoice?.OnlineAmount) || 0;

//         invoiceReceived =
//           cashAmount + onlineAmount;
//       }

//       // --------------------------------------------------
//       // Invoice Due
//       // --------------------------------------------------
//       const invoiceDue = Math.max(
//         invoiceTotal - invoiceReceived,
//         0
//       );

//       // --------------------------------------------------
//       // Add to Previous Balance
//       // --------------------------------------------------
//       previousBalance += invoiceDue;

//       console.log("Invoice Due Calculation:", {
//         InvoiceId: invoiceId,
//         Total: invoiceTotal,
//         ReceivedAmount: invoiceReceived,
//         Due: invoiceDue,
//         RunningPreviousBalance: previousBalance,
//       });
//     }

//     // --------------------------------------------------
//     // Final Previous Due
//     // --------------------------------------------------
//     const finalPreviousBalance =
//       Number(previousBalance.toFixed(2));

//     console.log(
//       "FINAL PREVIOUS BALANCE:",
//       finalPreviousBalance
//     );

//     setPreviousBalanceDue(
//       finalPreviousBalance
//     );

//     return finalPreviousBalance;
//   } catch (error) {
//     console.error(
//       "Error fetching customer previous balance:",
//       error
//     );

//     setPreviousBalanceDue(0);

//     return 0;
//   }
// };





// // ======================================================
// // FILTER INVOICE LIST
// // ======================================================
// const filteredInvoiceData = useMemo(() => {
//   const search = searchText.trim().toLowerCase();

//   return invoiceheaders.filter((invoice) => {
//     // Bill / Invoice number
//    const billNo = String(
//   invoice?.InvoiceNo || ""
// ).toLowerCase();

//     // Customer name
//     const customerName = String(
//       invoice?.accountDetails?.AccountName || ""
//     ).toLowerCase();

//     // Customer type
//     const customerType = String(
//       invoice?.accountDetails?.CustomerType ||
//         invoice?.addressDetails?.CustomerType ||
//         invoice?.CustomerType ||
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     // Category name
//     let categoryName = "";

//     if (customerType === "R") {
//       categoryName = "retailer";
//     } else if (customerType === "D") {
//       categoryName = "dealer";
//     } else if (customerType === "C") {
//       categoryName = "caterers";
//     }

//     // Invoice date
//     const invoiceDate = invoice?.InvoiceDate?.date
//       ? invoice.InvoiceDate.date.substring(0, 10)
//       : typeof invoice?.InvoiceDate === "string"
//         ? invoice.InvoiceDate.substring(0, 10)
//         : "";

//     // Category filter
//     const categoryMatch =
//       categoryFilter === "" ||
//       customerType === categoryFilter;

//     // Search filter
//     const searchMatch =
//       search === "" ||
//       billNo.includes(search) ||
//       customerName.includes(search) ||
//       categoryName.includes(search);

//     // From date
//     const fromDateMatch =
//       filterFromDate === "" ||
//       (invoiceDate !== "" &&
//         invoiceDate >= filterFromDate);

//     // To date
//     const toDateMatch =
//       filterToDate === "" ||
//       (invoiceDate !== "" &&
//         invoiceDate <= filterToDate);

//     return (
//       categoryMatch &&
//       searchMatch &&
//       fromDateMatch &&
//       toDateMatch
//     );
//   });
// }, [
//   invoiceheaders,
//   searchText,
//   categoryFilter,
//   filterFromDate,
//   filterToDate,
// ]);


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
//   // OPEN CATERERS FORM FROM NAVIGATION
//   // ======================================================



//   useEffect(() => {
//     if (location.state?.openCreateForm === true) {
//       // Open Create Sales Entry - Dealer form
//       handleNewClick();

//       // Clear navigation state so refresh won't reopen form
//       navigate(location.pathname, {
//         replace: true,
//         state: {},
//       });
//     }
//   }, [location.state, location.pathname, navigate]);

  


// const handleDrawerClose = () => {
//   setIsDrawerOpen(false);
//   setShowDropdown(false);
//   resetForm();
// };

// const handleDrawerCloseAndGoSalesEntry = () => {
//   setIsDrawerOpen(false);
//   setShowDropdown(false);
//   resetForm();
//   navigate("/salesentry");
// };

//   //for delete Header
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleConfirmDelete = () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     // const itemId = currentRow.original.Id;
//     // console.log('itemId',currentRow.original.Id)

//     fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=invoiceheader&Id=${editId}`,
//       requestOptions,
//     )
//       .then((response) => response.text())
//       .then((result) => {
//         console.log(result);

//         handleDrawerClose();
//         fetchInvoiceHeader();
//         handleMenuClose();
//         toast.success("Sales Entry - Dealer Deleted successfully!");
//       })
//       .catch((error) => console.error(error));
//   };

//   const [editId, setEditId] = useState("");

//   //update form

// const handleEdit = async (row) => {
//   const originalData = row.original;

//   if (!originalData) return;

//  const rowId = originalData.Id;

// const invheader = invoiceheaders.find(
//   (h) => String(h.Id) === String(rowId)
// );

//   if (!invheader) {
//     console.error("No invoice header found for the selected row.");
//     return;
//   }

//   // ==============================
//   // FETCH SAVED INVOICE DETAILS
//   // ==============================
//   let invdetail = [];

//   try {
//     const detailResponse = await axios.get(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invheader.Id}`
//     );

//     invdetail = Array.isArray(detailResponse.data)
//       ? detailResponse.data
//       : detailResponse.data?.data || [];

//     console.log("EDIT INVOICE DETAIL RESPONSE:", invdetail);
//   } catch (error) {
//     console.error("Error fetching invoice details:", error);
//     toast.error("Unable to fetch invoice details.");
//     return;
//   }

//  // ==============================
// // CUSTOMER DETAILS
// // ==============================
// fetchAccounts(invheader.AccountId);
// fetchAccountName(invheader.AccountId);

// const savedCustomerName =
//   invheader.accountDetails?.AccountName ||
//   invheader.accountDetails?.accountName ||
//   "";

// setCustomerName(savedCustomerName);
// setSelectedAccount(invheader.AccountId);


// // Fetch previous customer due
// // Current edited invoice exclude करा
// fetchPreviousBalance(
//   invheader.AccountId,
//   invheader.Id
// );



// setSelectedCustomerName(savedCustomerName);

//   // ==============================
//   // DATE CONVERSION
//   // ==============================
//   const convertDateForInput = (dateStr) => {
//     if (typeof dateStr === "string" && dateStr.includes("-")) {
//       const [year, month, day] = dateStr.split(" ")[0].split("-");

//       return `${year}-${month}-${day}`;
//     } else {
//       toast.error(`Invalid date format: ${dateStr}`);
//       return "";
//     }
//   };

//   // ==============================
//   // MAP SAVED PRODUCTS
//   // ==============================
// const mappedRows = invdetail.map((detail) => ({
//   Id: detail.Id,

//   InvoiceId: detail.InvoiceId,

//   ProductId: detail.ProductId,

//   ProductName:
//     productOptions.find(
//       (data) =>
//         data.value?.toString() === detail.ProductId?.toString()
//     )?.label || "",

//   Quantity:
//     detail.Quantity !== null && detail.Quantity !== undefined
//       ? parseFloat(detail.Quantity) || 0
//       : 0,

//   Rate:
//     detail.Rate !== null && detail.Rate !== undefined
//       ? parseFloat(detail.Rate) || 0
//       : 0,

//   Amount:
//     detail.Amount !== null && detail.Amount !== undefined
//       ? parseFloat(detail.Amount) || 0
//       : 0,

//   CGSTPercentage:
//     detail.CGSTPercentage !== null &&
//     detail.CGSTPercentage !== undefined
//       ? parseFloat(detail.CGSTPercentage) || 0
//       : 0,

//   CGSTAmount:
//     detail.CGSTAmount !== null &&
//     detail.CGSTAmount !== undefined
//       ? parseFloat(detail.CGSTAmount) || 0
//       : 0,

//   SGSTPercentage:
//     detail.SGSTPercentage !== null &&
//     detail.SGSTPercentage !== undefined
//       ? parseFloat(detail.SGSTPercentage) || 0
//       : 0,

//   SGSTAmount:
//     detail.SGSTAmount !== null &&
//     detail.SGSTAmount !== undefined
//       ? parseFloat(detail.SGSTAmount) || 0
//       : 0,

//   IGSTPercentage:
//     detail.IGSTPercentage !== null &&
//     detail.IGSTPercentage !== undefined
//       ? parseFloat(detail.IGSTPercentage) || 0
//       : 0,

//   IGSTAmount:
//     detail.IGSTAmount !== null &&
//     detail.IGSTAmount !== undefined
//       ? parseFloat(detail.IGSTAmount) || 0
//       : 0,

//   DiscountAmt:
//     detail.DiscountAmt !== null &&
//     detail.DiscountAmt !== undefined
//       ? parseFloat(detail.DiscountAmt) || 0
//       : 0,
// }));

//   // ==============================
//   // OPEN EDIT FORM
//   // ==============================
//   const invoiceDate = convertDateForInput(
//     invheader.InvoiceDate?.date
//   );

//   setIsDrawerOpen(true);

//   setInvoiceNo(invheader.InvoiceNo);

//   setInvoiceDate(invoiceDate);

//   setPhone(invheader.ContactNo);

//   setDevice(invheader.Device || "");

//   // ==============================
//   // BILL HEADER FIELDS
//   // ==============================
//   setBillFor(invheader.BillFor || "");

//   setMachineID(
//     invheader.MachineID
//       ? String(invheader.MachineID)
//       : ""
//   );

//   setIsGST(Number(invheader.IsGST) === 1);

//   // ==============================
//   // RESET CURRENT PRODUCT INPUT
//   // ==============================
//  // ==============================
// // LOAD FIRST SAVED PRODUCT INTO INPUT
// // ==============================
// if (mappedRows.length > 0) {
//   const firstRow = mappedRows[0];

//   setEditingRow(0);

//   setSelectedProductId(firstRow.ProductId);
//   setProductName(firstRow.ProductName || "");

//   setQuantity(firstRow.Quantity ?? "");
//   setRate(firstRow.Rate ?? "");
//   SetAmount(firstRow.Amount ?? "");

//   setDiscount(firstRow.DiscountAmt ?? 0);

//   setCGST(firstRow.CGSTPercentage ?? 0);
//   setCGSTAmount(firstRow.CGSTAmount ?? 0);

//   setSGST(firstRow.SGSTPercentage ?? 0);
//   setSGSTAmount(firstRow.SGSTAmount ?? 0);

//   setIGST(firstRow.IGSTPercentage ?? 0);
//   setIGSTAmount(firstRow.IGSTAmount ?? 0);
// } else {
//   setEditingRow(null);

//   setQuantity("");
//   setRate("");
//   SetAmount("");
//   setDiscount("");

//   setCGST("");
//   setCGSTAmount("");

//   setSGST("");
//   setSGSTAmount("");

//   setIGST("");
//   setIGSTAmount("");
// }


//   // ==============================
//   // PAYMENT DETAILS
//   // ==============================
//   setPaymentMode(invheader.PaymentMode || "");

//   setCashAmount(
//     invheader.CashAmount != null
//       ? String(invheader.CashAmount)
//       : ""
//   );

//   setOnlineAmount(
//     invheader.OnlineAmount != null
//       ? String(invheader.OnlineAmount)
//       : ""
//   );

//   setDiscount(
//     invheader.Discount != null
//       ? String(invheader.Discount)
//       : ""
//   );

//   setReceivedAmount(
//     invheader.ReceivedAmount != null
//       ? String(invheader.ReceivedAmount)
//       : ""
//   );

//   setTransport(
//     invheader.Transport != null
//       ? String(invheader.Transport)
//       : ""
//   );

//   // ==============================
//   // SET SAVED PRODUCTS
//   // ==============================
//   setRows(mappedRows);

//   // ==============================
//   // EDIT MODE
//   // ==============================
//   setIsEditing(true);

//   setEditId(row.original?.Id);

//   handleMenuOpen();

//   fetchInvoiceHeader();
// };

//   //table
//   const [pageNo, setPageNo] = useState(1);
//   //for preview
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewData, setPreviewData] = useState(null);



//   // ======================================================
// // CUSTOMER-WISE DUE
// // ======================================================

// const [previousBalanceDue, setPreviousBalanceDue] = useState(0);
// const [currentInvoiceDue, setCurrentInvoiceDue] = useState(0);
// const [totalOutstanding, setTotalOutstanding] = useState(0);


// const isSubmittingRef = useRef(false);


// const savedPreviewReceived = parseFloat(
//   previewData?.ReceivedAmount
// );

// const previewReceivedAmount =
//   !Number.isNaN(savedPreviewReceived)
//     ? savedPreviewReceived
//     : (parseFloat(previewData?.CashAmount) || 0) +
//       (parseFloat(previewData?.OnlineAmount) || 0);

// const previewTotal =
//   parseFloat(previewData?.Total) || 0;

// const previewRefund = Math.max(
//   previewReceivedAmount - previewTotal,
//   0
// );

// const previewCurrentDue = Math.max(
//   previewTotal - previewReceivedAmount,
//   0
// );

// const previewPreviousDue =
//   Number(previewData?.PreviousBalanceDue || 0);

// const previewTotalOutstanding =
//   previewPreviousDue +
//   previewCurrentDue;



//   const columns = useMemo(
//   () => [
//   {
//   accessorKey: "InvoiceNo",
//   header: "Bill No",
//   size: 80,
//   Cell: ({ row }) => (
//     <span>
//       {row.original?.InvoiceNo || "-"}
//     </span>
//   ),
// },

//     {
//       accessorKey: "InvoiceDate.date",
//       header: "Invoice Date",
//       size: 80,
//       Cell: ({ cell }) => (
//         <span>
//           {cell.getValue()
//             ? moment(cell.getValue()).format("DD-MM-YYYY")
//             : "-"}
//         </span>
//       ),
//     },

//     // ======================================================
//     // CUSTOMER NAME
//     // ======================================================
//     {
//       header: "Customer Name",
//       size: 120,
//       accessorFn: (row) =>
//         row?.accountDetails?.AccountName || "N/A",
//       Cell: ({ cell }) => (
//         <span>{cell.getValue()}</span>
//       ),
//     },

//     // ======================================================
//     // CATEGORY
//     // ======================================================
//     {
//       header: "Category",
//       size: 100,

//       accessorFn: (row) => {
//         const customerType = String(
//           row?.accountDetails?.CustomerType ||
//             row?.addressDetails?.CustomerType ||
//             row?.CustomerType ||
//             ""
//         )
//           .trim()
//           .toUpperCase();

//         if (customerType === "R") {
//           return "Retailer";
//         }

//         if (customerType === "D") {
//           return "Dealer";
//         }

//         if (customerType === "C") {
//           return "Caterers";
//         }

//         return "-";
//       },

//       Cell: ({ cell }) => (
//         <span>{cell.getValue()}</span>
//       ),
//     },

//     // ======================================================
//     // TOTAL
//     // ======================================================
//     {
//       accessorKey: "Total",
//       header: "Total",
//       size: 80,
//     },

//     // ======================================================
//     // ACTIONS
//     // ======================================================
//     {
//       header: "Actions",
//       size: 200,

//       Cell: ({ row }) => (
//         <Box
//           display="flex"
//           gap={1}
//           alignItems="center"
//         >
//           {/* EDIT */}
//           <Button
//             sx={{
//               background:
//                 "var(--primary-color)",
//             }}
//             variant="contained"
//             size="small"
//             onClick={() => {
//               handleEdit(row);
//             }}
//           >
//             Edit
//           </Button>

//           {/* PREVIEW */}
//           <Button
//             variant="contained"
//             sx={{
//               background:
//                 "var(--complementary-color)",
//             }}
//             size="small"
//             onClick={async () => {
//               try {
//                 const invoiceId =
//                   row.original?.Id;

//                 if (!invoiceId) {
//                   toast.error(
//                     "Invoice ID not found."
//                   );
//                   return;
//                 }

//                 // ==========================================
//                 // FETCH SAVED INVOICE DETAILS
//                 // ==========================================
//                 const detailResponse =
//                   await axios.get(
//                     `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//                   );

//                 const details =
//                   Array.isArray(
//                     detailResponse.data
//                   )
//                     ? detailResponse.data
//                     : detailResponse.data?.data ||
//                       [];

//                 console.log(
//                   "PREVIEW INVOICE DETAIL RESPONSE:",
//                   details
//                 );

//                 // ==========================================
//                 // ADD PRODUCT NAME
//                 // ==========================================
//                 const invdetail =
//                   details.map((detail) => {
//                     const matchedMaterial =
//                       productOptions.find(
//                         (item) =>
//                           item.value?.toString() ===
//                           detail.ProductId?.toString()
//                       );

//                     return {
//                       ...detail,
//                       ProductName:
//                         matchedMaterial?.label ||
//                         "Unknown",
//                     };
//                   });

//                // ==========================================
// // FETCH PREVIOUS CUSTOMER DUE FOR PREVIEW
// // ==========================================

// const previousDueForPreview =
//   await fetchPreviousBalance(
//     row.original?.AccountId,
//     invoiceId
//   );

// const previewTotal =
//   Number(row.original?.Total || 0);

// const previewReceived =
//   row.original?.ReceivedAmount != null
//     ? Number(row.original.ReceivedAmount || 0)
//     : (Number(row.original?.CashAmount || 0) +
//        Number(row.original?.OnlineAmount || 0));

// const previewCurrentDue = Math.max(
//   previewTotal - previewReceived,
//   0
// );

// const previewOutstanding =
//   previousDueForPreview + previewCurrentDue;

// // ==========================================
// // SET PREVIEW DATA
// // ==========================================

// const previewInvoice = {
//   ...row.original,

//   PreviousBalanceDue: Number(
//     previousDueForPreview.toFixed(2)
//   ),

//   CurrentInvoiceDue: Number(
//     previewCurrentDue.toFixed(2)
//   ),

//   BalanceDue: Number(
//     previewOutstanding.toFixed(2)
//   ),

//   invdetail,
// };

//                 setPreviewData(
//                   previewInvoice
//                 );

//                 setPreviewOpen(true);

//                 console.log(
//                   "PREVIEW DATA:",
//                   previewInvoice
//                 );
//               } catch (error) {
//                 console.error(
//                   "Error fetching invoice details for preview:",
//                   error
//                 );

//                 toast.error(
//                   "Unable to fetch invoice details."
//                 );
//               }
//             }}
//           >
//             Preview
//           </Button>
//         </Box>
//       ),
//     },
//   ],
//   [
//     invoiceheaders,
//     productOptions,
//     pageNo,
//   ]
// );




//   // =========================
//   // Integration
//   // =========================

//   // Invoice Details
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState("");

//   const [phone, setPhone] = useState("");

//   const [device, setDevice] = useState("");

//   const [billFor, setBillFor] = useState("");

//   const [machineID, setMachineID] = useState("");

//   const [machineOptions, setMachineOptions] = useState([]);

//   const [isGST, setIsGST] = useState(false);

//   // Product Details
//   const [product, setProduct] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [rate, setRate] = useState("");
//   const [amount, SetAmount] = useState("");

//   // Keyboard navigation refs
//   const quantityRef = useRef(null);
//   const rateRef = useRef(null);
//   const productRef = useRef(null);

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
//   const discountRef = useRef(null);
//   const receivedAmountRef = useRef(null);

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

//   const [selectedCustomerName, setSelectedCustomerName] = useState("");

//   const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

//   const [newCustomerAddress, setNewCustomerAddress] = useState("");

//   const [acctGSTNo, setacctGSTNo] = useState("");

//   useEffect(() => {
//     // fetchAccounts();

//     fetchProduct();

//     fetchMachines();

//     fetchInvoiceHeader();
//   }, []);

//   //fetch customer from  account table
  

//  const fetchProduct = async () => {
//   try {
//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster&RateType=Dealer",
//     );

//     const data = await response.json();

//     console.log("DEALER PRODUCT API RESPONSE:", data);

//     productvalidation(data);
//   } catch (error) {
//     console.error("Error fetching dealer products:", error);
//   }
// };
//   // ======================================================
//   // FETCH MACHINES
//   // ======================================================

//   const fetchMachines = async () => {
//     try {
//       const response = await axios.get(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=Machines",
//       );

//       console.log("Machines API Response:", response.data);

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

// const productvalidation = (data) => {
//   const options = data
//     .filter(
//       (account) =>
//         account?.ProductName &&
//         String(account.ProductName).trim() !== ""
//     )
//     .map((account) => ({
//       value: account?.Id,
//       label: account?.ProductName,
//       cgst: account?.CGSTPercentage,
//       sgst: account?.SGSTPercentage,
//       igst: account?.IGSTPercentage,

//       // Dealer API मधून automatic Dealer Rate
//       purchaseRate: account?.Rate,
//     }));

//   setProductOptions(options);
// };

//   const resetForm = () => {
//     // =========================
//     // Invoice Details
//     // =========================
//     setInvoiceNo("");
//     setInvoiceDate(new Date());
//     setPhone("");
//     setDevice("");

//     // NEW BILL HEADER FIELDS
//     setBillFor("");
//     setMachineID("");
//     setIsGST(false);

//     // Customer
//     setSelectedAccount("");
//     setSelectedCustomerName("");

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
//  setErrors({
//   invoiceDate: "",
//   selectedAccount: "",
//   paymentMode: "",
//   rows: "",
//   phone: "",
// });

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
//    setSubTotalCal(0);
// setCgstTotal(0);
// setSgstTotal(0);
// setIgstTotal(0);
// setTotal(0);

// setPreviousBalanceDue(0);
// setCurrentInvoiceDue(0);
// setTotalOutstanding(0);
//   };

// const handleSubmit = async (e, shouldPrint = false) => {
//   // ======================================================
//   // 0. PREVENT DEFAULT FORM / BROWSER ACTION
//   // ======================================================

//   if (e) {
//     e.preventDefault();
//     e.stopPropagation();
//   }

//   // ======================================================
//   // 1. PREVENT DOUBLE SUBMIT
//   // ======================================================

//   if (isSubmittingRef.current) {
//     console.log(
//       "SUBMIT ALREADY IN PROGRESS - IGNORING"
//     );
//     return;
//   }

//   // ======================================================
//   // 2. MAIN FORM VALIDATION
//   // ======================================================

//   if (!validateForm()) {
//     console.log("FORM VALIDATION FAILED");
//     return;
//   }

//   // ======================================================
//   // 3. RECEIVED AMOUNT VALIDATION
//   // ======================================================

//   if (!validateReceivedAmount()) {
//     console.log(
//       "RECEIVED AMOUNT VALIDATION FAILED"
//     );
//     return;
//   }

//   // ======================================================
//   // 4. MIX PAYMENT VALIDATION
//   // ======================================================

//   if (!validatePaymentSplit()) {
//     console.log(
//       "PAYMENT VALIDATION FAILED"
//     );
//     return;
//   }

//   // ======================================================
//   // 5. LOCK SUBMIT
//   // ======================================================

//   isSubmittingRef.current = true;

//   let printWindow = null;

//   try {
//     // ======================================================
//     // 6. OPEN PRINT WINDOW ONLY IF PRINT REQUESTED
//     // ======================================================

//     if (shouldPrint) {
//       printWindow = window.open("", "_blank");

//       if (!printWindow) {
//         toast.error(
//           "Please allow popups for printing."
//         );

//         return;
//       }

//       // ======================================================
//       // TEMPORARY PRINT WINDOW CONTENT
//       // ======================================================

//       printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>Preparing Invoice...</title>
//           </head>

//           <body
//             style="
//               font-family: Arial;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               height: 100vh;
//               margin: 0;
//             "
//           >
//             <h3>
//               Preparing invoice for printing...
//             </h3>
//           </body>
//         </html>
//       `);

//       printWindow.document.close();
//     }

//     // ======================================================
//     // 7. FORMAT INVOICE DATE
//     // ======================================================

//     const formattedInvoicedate =
//       moment(invoiceDate).format("YYYY-MM-DD");

//     // ======================================================
//     // 8. FETCH PREVIOUS CUSTOMER DUE BEFORE SAVE
//     // ======================================================

//     const previousDueForSave =
//       await fetchPreviousBalance(
//         selectedAccount,
//         isEditing ? editId : null
//       );

//     // ======================================================
//     // 9. CURRENT INVOICE DUE
//     // ======================================================

//     const currentDueForSave = Math.max(
//       (parseFloat(total) || 0) -
//         (parseFloat(receivedAmount) || 0),
//       0
//     );

//     // ======================================================
//     // 10. TOTAL CUSTOMER OUTSTANDING
//     // ======================================================

//     const totalOutstandingForSave =
//       Number(previousDueForSave || 0) +
//       Number(currentDueForSave || 0);

//     console.log(
//       "PREVIOUS DUE:",
//       previousDueForSave
//     );

//     console.log(
//       "CURRENT INVOICE DUE:",
//       currentDueForSave
//     );

//     console.log(
//       "TOTAL OUTSTANDING:",
//       totalOutstandingForSave
//     );

//     // ======================================================
//     // 11. SET CUSTOMER DUE STATES
//     // ======================================================

//     setPreviousBalanceDue(
//       Number(
//         Number(previousDueForSave || 0).toFixed(2)
//       )
//     );

//     setCurrentInvoiceDue(
//       Number(
//         Number(currentDueForSave || 0).toFixed(2)
//       )
//     );

//     setTotalOutstanding(
//       Number(
//         Number(totalOutstandingForSave || 0).toFixed(2)
//       )
//     );

//     // ======================================================
//     // 12. INVOICE HEADER DATA
//     // ======================================================

//     const invoiceheaderdata = {
//       Id: isEditing ? editId : "",

//       InvoiceNo: invoiceNo,

//       InvoiceDate: formattedInvoicedate,

//       AccountId: selectedAccount
//         ? selectedAccount
//         : customerName,

//       ContactNo: phone,

//       BillFor: billFor || "",

//       MachineID: machineID
//         ? parseInt(machineID, 10)
//         : 0,

//       IsGST: isGST ? 1 : 0,

//       PaymentMode: paymentMode || "",

//       CashAmount:
//         parseFloat(cashAmount) || 0,

//       OnlineAmount:
//         parseFloat(onlineAmount) || 0,

//       Discount:
//         parseFloat(discount) || 0,

//       Transport:
//         parseFloat(transport) || 0,

//       CGSTAmount:
//         parseFloat(cgstTotal) || 0,

//       SGSTAmount:
//         parseFloat(sgstTotal) || 0,

//       IGSTAmount:
//         parseFloat(igstTotal) || 0,

//       Total:
//         parseFloat(total) || 0,

//       ReceivedAmount:
//         parseFloat(receivedAmount) || 0,

//       SubTotal:
//         parseFloat(subTotalcal) || 0,
//     };

//     console.log(
//       "INVOICE HEADER DATA TO API:",
//       invoiceheaderdata
//     );

//     // ======================================================
//     // 13. SELECT HEADER API
//     // ======================================================

//     const invoiceurl = isEditing
//       ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
//       : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

//     console.log(
//       "Saving invoice using:",
//       invoiceurl
//     );

//     // ======================================================
//     // 14. SAVE INVOICE HEADER
//     // ======================================================

//     const response = await axios.post(
//       invoiceurl,
//       qs.stringify(invoiceheaderdata),
//       {
//         headers: {
//           "Content-Type":
//             "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     console.log(
//       "Invoice Header Response:",
//       response.data
//     );

//     // ======================================================
//     // 15. GET INVOICE ID
//     // ======================================================

//    const invoiceId = isEditing
//   ? editId
//   : parseInt(response.data.Id, 10);

// const savedInvoiceNo = isEditing
//   ? invoiceNo
//   : response.data.InvoiceNo;

// console.log("Invoice ID:", invoiceId);
// console.log("Saved Invoice No:", savedInvoiceNo);

//     console.log(
//       "Invoice ID:",
//       invoiceId
//     );

//     if (!invoiceId) {
//       throw new Error(
//         "Invoice ID was not received from server."
//       );
//     }

//     // ======================================================
//     // 16. SAVE INVOICE DETAILS
//     // ======================================================

//     for (const [index, row] of rows.entries()) {
//       const rowData = {
//         Id: row.Id
//           ? parseInt(row.Id, 10)
//           : "",

//         InvoiceId:
//           parseInt(invoiceId, 10),

//         SerialNo: index + 1,

//         ProductId:
//           parseInt(row.ProductId, 10),

//         Quantity:
//           parseFloat(row.Quantity) || 0,

//         Rate:
//           parseFloat(row.Rate) || 0,

//         Amount:
//           parseFloat(row.Amount) || 0,

//         CGSTPercentage:
//           parseFloat(row.CGSTPercentage) || 0,

//         CGSTAmount:
//           parseFloat(row.CGSTAmount) || 0,

//         SGSTPercentage:
//           parseFloat(row.SGSTPercentage) || 0,

//         SGSTAmount:
//           parseFloat(row.SGSTAmount) || 0,

//         IGSTPercentage:
//           parseFloat(row.IGSTPercentage) || 0,

//         IGSTAmount:
//           parseFloat(row.IGSTAmount) || 0,
//       };

//       console.log(
//         `Invoice Detail ${index + 1}:`,
//         rowData
//       );

//       const invoicdedetailurl = row.Id
//         ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
//         : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

//       await axios.post(
//         invoicdedetailurl,
//         qs.stringify(rowData),
//         {
//           headers: {
//             "Content-Type":
//               "application/x-www-form-urlencoded",
//           },
//         }
//       );
//     }

//     // ======================================================
//     // 17. CUSTOMER NAME FOR PRINT
//     // ======================================================

//     const customerNameForPrint =
//       accountOptions.find(
//         ({ Id }) =>
//           String(Id) ===
//           String(selectedAccount)
//       )?.AccountName ||
//       accountName ||
//       "-";

//     // ======================================================
//     // 18. PREPARE PRINT DATA
//     // ======================================================

// const printData = {
//   ...invoiceheaderdata,

//   Id: invoiceId,

//   InvoiceNo: savedInvoiceNo,

//   Device: device || "-",

//   PaymentMode: paymentMode || "-",

//   PreviousBalanceDue: Number(
//     Number(previousDueForSave || 0).toFixed(2)
//   ),

//   CurrentInvoiceDue: Number(
//     Number(currentDueForSave || 0).toFixed(2)
//   ),

//   BalanceDue: Number(
//     Number(totalOutstandingForSave || 0).toFixed(2)
//   ),

//   accountDetails: {
//     AccountName: customerNameForPrint,
//   },

//   customerName: customerNameForPrint,

//   invdetail: rows.map((row) => ({
//     ...row,

//     ProductName:
//       row.ProductName ||
//       productOptions.find(
//         (option) =>
//           String(option.value) ===
//           String(row.ProductId)
//       )?.label ||
//       "Unknown",

//     Quantity: parseFloat(row.Quantity) || 0,
//     Rate: parseFloat(row.Rate) || 0,
//     Amount: parseFloat(row.Amount) || 0,

//     DiscountAmt:
//       parseFloat(row.DiscountAmt) || 0,

//     CGSTPercentage:
//       parseFloat(row.CGSTPercentage) || 0,

//     CGSTAmount:
//       parseFloat(row.CGSTAmount) || 0,

//     SGSTPercentage:
//       parseFloat(row.SGSTPercentage) || 0,

//     SGSTAmount:
//       parseFloat(row.SGSTAmount) || 0,

//     IGSTPercentage:
//       parseFloat(row.IGSTPercentage) || 0,

//     IGSTAmount:
//       parseFloat(row.IGSTAmount) || 0,
//   })),
// };

//     console.log(
//       "PRINT DATA:",
//       printData
//     );

//     // ======================================================
//     // 19. SUCCESS MESSAGE
//     // ======================================================

//     toast.success(
//       isEditing
//         ? "Sales Entry- Dealer Updated successfully!"
//         : "Sales Entry- Dealer Created successfully!"
//     );

//     // ======================================================
//     // 20. PRINT ONLY IF REQUESTED
//     // ======================================================

//     if (
//       shouldPrint &&
//       printWindow
//     ) {
//       console.log(
//         "CALLING generatePDF..."
//       );

//       generatePDF(
//         printData,
//         printWindow
//       );
//     } else {
//       console.log(
//         "SAVE ONLY - PRINT NOT REQUESTED"
//       );
//     }

//     // ======================================================
//     // 21. CLOSE DRAWER
//     // ======================================================

//     setIsDrawerOpen(false);

//     // ======================================================
//     // 22. RESET FORM
//     // ======================================================

//     resetForm();

//     // ======================================================
//     // 23. REFRESH TABLE DATA
//     // ======================================================

//     await fetchInvoiceHeader();

//   } catch (error) {
//     // ======================================================
//     // ERROR
//     // ======================================================

//     console.error(
//       "Error submitting invoice:",
//       error
//     );

//     // ======================================================
//     // CLOSE PRINT WINDOW ON ERROR
//     // ======================================================

//     if (
//       printWindow &&
//       !printWindow.closed
//     ) {
//       printWindow.close();
//     }

//     setIsDrawerOpen(false);

//     toast.error(
//       isEditing
//         ? "Sales Entry- Dealer Updated unsuccessfully!"
//         : "Sales Entry- Dealer unsuccessfully!"
//     );

//   } finally {
//     // ======================================================
//     // RELEASE SUBMIT LOCK
//     // ======================================================

//     isSubmittingRef.current = false;

//     console.log(
//       "SUBMIT LOCK RELEASED"
//     );
//   }
// };

// // ======================================================
// // CTRL + S = SAVE ONLY
// // ======================================================

// useEffect(() => {
//   const handleCtrlS = (event) => {
//     if (
//       event.ctrlKey &&
//       event.key.toLowerCase() === "s"
//     ) {
//       event.preventDefault();
//       event.stopPropagation();

//       if (!isDrawerOpen) {
//         return;
//       }

//       if (event.repeat) {
//         return;
//       }

//       console.log("CTRL + S PRESSED - SAVE ONLY");

//       handleSubmit(event, false);
//     }
//   };

//   window.addEventListener(
//     "keydown",
//     handleCtrlS,
//     true
//   );

//   return () => {
//     window.removeEventListener(
//       "keydown",
//       handleCtrlS,
//       true
//     );
//   };
// }, [isDrawerOpen]);

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
// const received =
//   parseFloat(receivedAmount) || 0;

// const grandTotal =
//   parseFloat(total) || 0;

// // Current bill due
// const balanceDue = Math.max(
//   grandTotal - received,
//   0
// );

// // Refund
// const refund = Math.max(
//   received - grandTotal,
//   0
// );

// // Total customer outstanding
// const customerOutstanding =
//   Number(previousBalanceDue || 0) +
//   Number(balanceDue || 0);

// // ======================================================
// // PAYMENT STATUS
// // ======================================================

// const isPaid =
//   balanceDue === 0 && received > 0;
  

// const handleReceivedAmountChange = (e) => {
//   const value = e.target.value;

//   // Empty value
//   if (value === "") {
//     setReceivedAmount("");

//     if (paymentMode === "C") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }

//     if (paymentMode === "O") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }

//     // Mix मध्ये Cash + Online manually enter होतात
//     return;
//   }

//   const receivedValue = parseFloat(value);

//   // Negative amount not allowed
//   if (receivedValue < 0) {
//     return;
//   }

//   // Main Received Amount
//   setReceivedAmount(value);

//   // Cash payment
//   if (paymentMode === "C") {
//     setCashAmount(value);
//     setOnlineAmount("");
//   }

//   // Online payment
//   if (paymentMode === "O") {
//     setOnlineAmount(value);
//     setCashAmount("");
//   }

//   // Mix payment
//   // Cash + Online manually enter होतात
// };


// const validateReceivedAmount = () => {
//   const receivedValue = parseFloat(receivedAmount);
//   const totalValue = parseFloat(total) || 0;

//   // Received Amount रिकामा असल्यास
//   if (
//     receivedAmount === "" ||
//     Number.isNaN(receivedValue)
//   ) {
//     toast.error(
//       `Please enter received amount ₹${totalValue.toFixed(2)}`
//     );

//     receivedAmountRef.current?.focus();
//     receivedAmountRef.current?.select();

//     return false;
//   }

//   // Negative amount
//   if (receivedValue < 0) {
//     toast.error("Received amount cannot be negative.");

//     receivedAmountRef.current?.focus();
//     receivedAmountRef.current?.select();

//     return false;
//   }

//   // Received > Current Bill Total
//   if (receivedValue > totalValue) {
//     const refundAmount =
//       receivedValue - totalValue;

//     toast.error(
//       `Received amount ₹${receivedValue.toFixed(
//         2
//       )} is greater than bill total ₹${totalValue.toFixed(
//         2
//       )}. Refund ₹${refundAmount.toFixed(
//         2
//       )} cannot be saved.`
//     );

//     receivedAmountRef.current?.focus();
//     receivedAmountRef.current?.select();

//     return false;
//   }

//   // Received <= Total is allowed
//   return true;
// };


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

//     if (splitTotal !== received) {
//       toast.error(`Cash + Online amount must be ₹${received.toFixed(2)}`);

//       return false;
//     }

//     return true;
//   };

  

//   const calculations = () => {
//     // =========================
//     // SUBTOTAL
//     // =========================

//     const subtotal = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.Amount) || 0),
//       0,
//     );

//     setSubTotalCal(subtotal.toFixed(2));

//     // =========================
//     // GST TOTALS
//     // Keep internally for backend
//     // =========================

//     const totalCGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
//       0,
//     );

//     setCgstTotal(totalCGST.toFixed(2));

//     const totalSGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
//       0,
//     );

//     setSgstTotal(totalSGST.toFixed(2));

//     const totalIGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
//       0,
//     );

//     setIgstTotal(totalIGST.toFixed(2));

//     // =========================
//     // DISCOUNT
//     // =========================

//     const discountValue = parseFloat(discount) || 0;

//     // =========================
//     // TRANSPORT
//     // =========================

//     const transportValue = parseFloat(transport) || 0;

//     // =========================
//     // FINAL TOTAL
//     // =========================

//     const totalBeforeDiscount = subtotal;

//     const afterDiscount = Math.max(totalBeforeDiscount - discountValue, 0);

//     const grandTotal = afterDiscount + transportValue;

//     setTotal(grandTotal.toFixed(2));
//   };

//   useEffect(() => {
//     calculations();
//   }, [rows, transport, discount]);
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

//   const [editingRow, setEditingRow] = useState(null);

//   const handleEditRow = (index) => {
//     const row = rows[index];

//     setEditingRow(index);

//     setSelectedProductId(row.ProductId);
//     setProductName(row.ProductName);

//     const q = row.Quantity || "";
//     const r = row.Rate || "";

//     setQuantity(q);
//     setRate(r);

//     const qtyNum = parseFloat(q) || 0;
//     const rateNum = parseFloat(r) || 0;

//     const baseAmt = qtyNum * rateNum;

//     setBaseAmount(baseAmt);
//     SetAmount(baseAmt);

//     setCGST(row.CGSTPercentage || 0);
//     setSGST(row.SGSTPercentage || 0);
//     setIGST(row.IGSTPercentage || 0);

//     calculateCgstAmount(row.CGSTPercentage || 0, baseAmt);

//     calculateSgstAmount(row.SGSTPercentage || 0, baseAmt);

//     calculateIgstAmount(row.IGSTPercentage || 0, baseAmt);
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

//   const handleProductKeyDown = (event) => {
//     if (event.key !== "Enter") {
//       return;
//     }

//     event.preventDefault();
//     event.stopPropagation();

//     // Product validation
//     if (!selectedProductID) {
//       toast.error("Please select a product.");
//       return;
//     }

//     // Quantity validation
//     if (!quantity || Number(quantity) <= 0) {
//       toast.error("Please enter quantity.");
//       quantityRef.current?.focus();
//       return;
//     }

//     // Rate validation
//     if (!rate || Number(rate) <= 0) {
//       toast.error("Please enter rate.");
//       rateRef.current?.focus();
//       return;
//     }

//     // Add / update row
//     handleSaveOrAddRow();

//     // After row is added, focus Product field
//     setTimeout(() => {
//       productRef.current?.focus();
//     }, 0);
//   };

// const handleSaveOrAddRow = () => {
//   // ==============================
//   // 1. PRODUCT VALIDATION
//   // ==============================
//   if (!selectedProductID) {
//     alert("Please select a product before adding the row.");
//     return;
//   }

//   // ==============================
//   // 2. QUANTITY
//   // ==============================
//   const finalQuantity = parseFloat(quantity) || 1;

//   // ==============================
//   // 3. RATE
//   // ==============================
//   const finalRate = parseFloat(rate) || 0;

//   // ==============================
//   // 4. AMOUNT
//   // ==============================
//   const finalAmount = finalQuantity * finalRate;

//   // ==============================
//   // 5. SELECTED PRODUCT
//   // ==============================
//   const selectedOption = productOptions.find(
//     (option) =>
//       String(option.value) === String(selectedProductID)
//   );

//   const finalProductName =
//     productName ||
//     selectedProductName ||
//     selectedOption?.label ||
//     "";

//   // ==============================
//   // 6. GST VALUES
//   // Keep internally for backend
//   // ==============================
//   const finalCGST = parseFloat(cgst) || 0;
//   const finalCGSTAmount = parseFloat(cgstAmount) || 0;

//   const finalSGST = parseFloat(sgst) || 0;
//   const finalSGSTAmount = parseFloat(sgstAmount) || 0;

//   const finalIGST = parseFloat(igst) || 0;
//   const finalIGSTAmount = parseFloat(igstAmount) || 0;

//   // ==============================
//   // 7. DISCOUNT
//   // ==============================
//   const finalDiscount =
//     discount !== ""
//       ? parseFloat(discount) || 0
//       : 0;

//   // ==============================
//   // 8. EDIT EXISTING ROW
//   // ==============================
//   if (editingRow !== null) {
//     setRows((prevRows) =>
//       prevRows.map((row, index) => {
//         if (index !== editingRow) {
//           return row;
//         }

//         return {
//           ...row,

//           ProductId: selectedProductID,

//           ProductName: finalProductName,

//           Quantity: finalQuantity,

//           Rate: finalRate,

//           Amount: finalAmount,

//           // Internal GST values
//           CGSTPercentage: finalCGST,
//           CGSTAmount: finalCGSTAmount,

//           SGSTPercentage: finalSGST,
//           SGSTAmount: finalSGSTAmount,

//           IGSTPercentage: finalIGST,
//           IGSTAmount: finalIGSTAmount,

//           DiscountAmt: finalDiscount,
//         };
//       })
//     );

//     toast.success("Product row updated.");
//   }

//   // ==============================
//   // 9. ADD NEW ROW
//   // ==============================
//   else {
//     const newRow = {
//       Id: null,

//       InvoiceId: editId || null,

//       ProductId: selectedProductID,

//       ProductName: finalProductName,

//       Quantity: finalQuantity,

//       Rate: finalRate,

//       Amount: finalAmount,

//       // Internal GST values
//       CGSTPercentage: finalCGST,
//       CGSTAmount: finalCGSTAmount,

//       SGSTPercentage: finalSGST,
//       SGSTAmount: finalSGSTAmount,

//       IGSTPercentage: finalIGST,
//       IGSTAmount: finalIGSTAmount,

//       DiscountAmt: finalDiscount,
//     };

//     setRows((prevRows) => [
//       ...prevRows,
//       newRow,
//     ]);

//     toast.success("Product added.");
//   }

//   // ==============================
//   // 10. CLEAR ONLY PRODUCT INPUT
//   // ==============================
//   resetFields();
//   setEditingRow(null);
// };

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

//   // ======================================================
// // ESC = GO ONE STEP BACK
// // ======================================================
// useEffect(() => {
//   if (!isDrawerOpen) return;

//   const handleEscBack = (event) => {
//     if (event.key !== "Escape") return;

//     const activeElement = document.activeElement;

//     event.preventDefault();
//     event.stopPropagation();

//     // Received Amount -> Discount
//     if (receivedAmountRef.current === activeElement) {
//       setTimeout(() => {
//         discountRef.current?.focus();
//         discountRef.current?.select();
//       }, 50);
//       return;
//     }

//     // Discount -> Payment Mode
//     if (discountRef.current === activeElement) {
//       setTimeout(() => {
//         document.querySelector(
//           '[name="paymentMode"]'
//         )?.focus();
//       }, 50);
//       return;
//     }

//     // Payment Mode -> Quantity
//     if (activeElement?.name === "paymentMode") {
//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 50);
//       return;
//     }

//     // Quantity -> Product
//     if (quantityRef.current === activeElement) {
//       setTimeout(() => {
//         productRef.current?.focus();
//       }, 50);
//       return;
//     }

//     // Product -> Customer
//     if (productRef.current === activeElement) {
//       setTimeout(() => {
//         const customerInput = document.querySelector(
//           'input[placeholder="Select Customer"]'
//         );

//         customerInput?.focus();
//       }, 50);
//       return;
//     }
//   };

//   window.addEventListener("keydown", handleEscBack, true);

//   return () => {
//     window.removeEventListener("keydown", handleEscBack, true);
//   };
// }, [isDrawerOpen]);


//   const [text, setText] = useState("");

//   const customerDropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         customerDropdownRef.current &&
//         !customerDropdownRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//         setText("");
//       }
//     };

//     if (!showDropdown) {
//       return;
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDropdown]);

//   const serchCustomers = async () => {
//     try {
//       // Search रिकामी असेल तर list clear करा
//       if (!text.trim()) {
//         setAccountOptions([]);
//         return;
//       }

//       // 1. Search Account
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${encodeURIComponent(text)}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       const result = await response.json();

//       console.log("ACCOUNT SEARCH RESPONSE:", result);

//       if (!Array.isArray(result)) {
//         setAccountOptions([]);
//         return;
//       }

//       // 2. प्रत्येक account चा Address / CustomerType fetch करा
//       const dealerCustomers = [];

//       for (const customer of result) {
//         try {
//           const addressResponse = await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customer.Id}`,
//             {
//               method: "GET",
//               redirect: "follow",
//             },
//           );

//           const addressResult = await addressResponse.json();

//           console.log(`Address for ${customer.AccountName}:`, addressResult);

//           const address = Array.isArray(addressResult)
//             ? addressResult[0]
//             : null;

//           // 3. फक्त Dealer घ्या
//           if (address && String(address.CustomerType).toUpperCase() === "D") {
//             dealerCustomers.push({
//               ...customer,

//               CustomerType: address.CustomerType,

//               GSTNo: address.GSTNo || "",

//               Address1:
//                 address.Address1 ||
//                 address.address1 ||
//                 address.Address ||
//                 address.address ||
//                 address.AddressLine1 ||
//                 address.addressLine1 ||
//                 "",

//               Address2:
//                 address.Address2 ||
//                 address.address2 ||
//                 address.AddressLine2 ||
//                 address.addressLine2 ||
//                 "",

//               Address3:
//                 address.Address3 ||
//                 address.address3 ||
//                 address.AddressLine3 ||
//                 address.addressLine3 ||
//                 "",
//             });
//           }
//         } catch (addressError) {
//           console.error(
//             `Address fetch failed for AccountId ${customer.Id}:`,
//             addressError,
//           );
//         }
//       }

//       console.log("DEALER CUSTOMERS:", dealerCustomers);

//       // 4. फक्त Dealer records dropdown ला द्या
//       setAccountOptions(dealerCustomers);
//     } catch (error) {
//       console.error("Dealer customer search error:", error);

//       setAccountOptions([]);
//     }
//   };

//   useEffect(() => {
//     serchCustomers();
//   }, [text]);

//   // create new Customer
//   const [accountName, setAccountName] = useState("");
//   const [customerName, setCustomerName] = useState("");
  

//   const CreateCustomerMaster = async () => {
//     // ============================================================
//     // DEALER NAME
//     // ============================================================

//     const newCustomerName = accountName.trim();

//     if (!newCustomerName) {
//       toast.error("Please enter dealer name");
//       return;
//     }

//     // ============================================================
//     // DEALER ADDRESS
//     // ============================================================

//     const newAddress = newCustomerAddress.trim();

//     const myHeaders = new Headers();

//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     // ============================================================
//     // CREATE DEALER ACCOUNT
//     // ============================================================

//     const urlencoded = new URLSearchParams();

//     urlencoded.append("AccountName", newCustomerName);

//     urlencoded.append("GroupId", "3");

//     urlencoded.append("SubGroupId", "1");

//     urlencoded.append("OpeningBalance", "100");

//     urlencoded.append("DrORCr", "D");

//     urlencoded.append("TypeCode", "C");

//     urlencoded.append("IsSystem", "false");

//     try {
//       // ==========================================================
//       // 1. CREATE ACCOUNT
//       // ==========================================================

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: urlencoded,
//           redirect: "follow",
//         },
//       );

//       const result = await response.json();

//       console.log("Dealer Created:", result);

//       if (!result || !result.Id) {
//         throw new Error("Dealer ID not received from API.");
//       }

//       // ==========================================================
//       // 2. CREATE ADDRESS
//       // ==========================================================

//       const addressData = new URLSearchParams();

//       addressData.append("AccountId", result.Id);

//       // Dealer
//       addressData.append("CustomerType", "D");

//       // Keep GST in database
//       // It will NOT be printed on invoice
//       addressData.append("GSTNo", "270000000000000");

//       addressData.append("Address1", newAddress);

//       addressData.append("Address", newAddress);

//       const addressResponse = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: addressData,
//           redirect: "follow",
//         },
//       );

//       const addressResult = await addressResponse.json();

//       console.log("Dealer Address Created:", addressResult);

//       // ==========================================================
//       // 3. CREATE LOCAL DEALER OBJECT
//       // ==========================================================

//       const newDealer = {
//         Id: result.Id,

//         AccountName: newCustomerName,

//         CustomerType: "D",

//         GSTNo: "270000000000000",

//         Address1: newAddress,

//         Address: newAddress,
//       };

//       // ==========================================================
//       // 4. ADD DEALER TO CURRENT DROPDOWN
//       // ==========================================================

//       setAccountOptions((previousOptions) => {
//         const alreadyExists = previousOptions.some(
//           (dealer) => String(dealer.Id) === String(result.Id),
//         );

//         if (alreadyExists) {
//           return previousOptions;
//         }

//         return [newDealer, ...previousOptions];
//       });

//       // ==========================================================
//       // 5. SELECT NEW DEALER IMMEDIATELY
//       // ==========================================================

//       setSelectedAccount(String(result.Id));

//       setSelectedCustomerName(newCustomerName);

//       setSelectedCustomerAddress(newAddress);

//       setPreviousBalanceDue(0);

//       // ==========================================================
//       // 6. SUCCESS MESSAGE
//       // ==========================================================

//       toast.success("Dealer created successfully");

//       // ==========================================================
//       // 7. CLOSE CUSTOMER POPUP
//       // ==========================================================

//       setShowDropdown(false);

//       // ==========================================================
//       // 8. CLEAR INPUTS
//       // ==========================================================

//       setAccountName("");

//       setNewCustomerAddress("");

//       setText("");
//     } catch (error) {
//       console.error("Error creating dealer:", error);

//       toast.error("Error creating dealer");
//     }
//   };
//   //set GSTno
//   const fetchAccounts = (customerId) => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`,
//       requestOptions,
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         const temp = Array.isArray(result) ? result[0] : null;

//         console.log("GST DATA:", temp?.GSTNo);

//         setacctGSTNo(String(temp?.GSTNo ?? ""));
//       })
//       .catch((error) => {
//         console.error("GST fetch error:", error);
//         setacctGSTNo("");
//       });
//   };


//   // ======================================================
// // FETCH SELECTED CUSTOMER CONTACT NUMBER
// // ======================================================
// const fetchCustomerContact = async (customerId) => {
//   try {
//     if (!customerId) {
//       setPhone("");
//       return;
//     }

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//         customerId
//       )}`
//     );

//     if (!response.ok) {
//       throw new Error(`Account API failed with status ${response.status}`);
//     }

//     const result = await response.json();

//     console.log("SELECTED CUSTOMER ACCOUNT RESPONSE:", result);

//     const accountData = Array.isArray(result)
//       ? result[0]
//       : result;

//     if (!accountData) {
//       setPhone("");
//       return;
//     }

//     const contactNo =
//       accountData?.MobileNo ||
//       accountData?.MobileNumber ||
//       accountData?.ContactNo ||
//       accountData?.ContactNumber ||
//       accountData?.PhoneNo ||
//       accountData?.PhoneNumber ||
//       "";

//     console.log("SELECTED CUSTOMER CONTACT NO:", contactNo);

//     setPhone(String(contactNo));
//   } catch (error) {
//     console.error("CUSTOMER CONTACT FETCH ERROR:", error);
//     setPhone("");
//   }
// };



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

//       const defaultQty = 1;

//       const defaultRate = parseFloat(newValue.purchaseRate) || 0;

//       setQuantity(defaultQty);

//       setRate(defaultRate);

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 0);

//       const sameState =
//         String(gstNo || "").substring(0, 2) ===
//         String(acctGSTNo || "").substring(0, 2);

//       const cgstValue = sameState ? newValue.cgst : "0";

//       const sgstValue = sameState ? newValue.sgst : "0";

//       const igstValue = !sameState ? newValue.igst : "0";

//       setCGST(cgstValue);
//       setSGST(sgstValue);
//       setIGST(igstValue);

//       // Calculate current input amount
//       calculateAmount(defaultQty, defaultRate);
//     } else {
//       setSelectedProductId("");
//       setProductName("");
//       setRate("");
//       setQuantity("");
//       setSelectedProductName("");

//       setCGST("0");
//       setSGST("0");
//       setIGST("0");

//       SetAmount("");
//     }
//   };

//   ///Pagination
//   const [totalPages, setTotalPages] = useState(1);
//   //validation
// const [errors, setErrors] = useState({
//   invoiceDate: "",
//   selectedAccount: "",
//   paymentMode: "",
//   rows: "",
//   phone: "",
// });

//   const validateForm = () => {
//    const newErrors = {
//   invoiceDate: "",
//   selectedAccount: "",
//   paymentMode: "",
//   rows: "",
//   phone: "",
// };

//     let isValid = true;

//     // Invoice Date
//     if (!invoiceDate) {
//       newErrors.invoiceDate = "Invoice date is required";

//       isValid = false;
//     } else {
//       const invoiceDateObj = new Date(invoiceDate);

//       const fromDateObj = new Date(fromdate);

//       const toDateObj = new Date(todate);

//       if (invoiceDateObj < fromDateObj) {
//         newErrors.invoiceDate = `Invoice date cannot be before ${new Date(
//           fromdate,
//         ).toLocaleDateString()}`;

//         isValid = false;
//       } else if (invoiceDateObj > toDateObj) {
//         newErrors.invoiceDate = `Invoice date cannot be after ${new Date(
//           todate,
//         ).toLocaleDateString()}`;

//         isValid = false;
//       }
//     }

//   // Customer Name
// if (!selectedCustomerName?.trim()) {
//   newErrors.selectedAccount = "Customer name is required";
//   isValid = false;
// }

// // ==============================
// // MOBILE NUMBER VALIDATION
// // ==============================
// const mobileDigits = String(phone || "").replace(/\D/g, "");

// if (mobileDigits.length < 12) {
//   newErrors.phone = "Valid mobile number is required";
//   isValid = false;

//   toast.error(
//     "📱 Please enter a valid 10-digit mobile number to continue."
//   );
// }

//     // Payment Mode
//     if (!paymentMode) {
//       newErrors.paymentMode = "Payment mode is required";

//       isValid = false;
//     }

//     // Product rows
//     if (rows.length === 0) {
//       newErrors.rows = "Please add at least one product";

//       isValid = false;
//     }

//     setErrors(newErrors);

//     return isValid;
//   };

//   //for yearId
//   const [yearid, setYearId] = useState("");
//   const [fromdate, setFromDate] = useState("");
//   const [todate, setToDate] = useState("");

//   useEffect(() => {
//     const storedYearId = Cookies.get("YearId");
//     const storedfromdate = Cookies.get("FromDate");
//     const storedtodate = Cookies.get("ToDate");

//     if (storedYearId) {
//       setYearId(storedYearId);
//       //console.log('storedYearId', storedYearId);
//     } else {
//       toast.error("Year is not set.");
//     }
//     if (storedfromdate) {
//       setFromDate(storedfromdate);
//       //console.log('storedfromdate', storedfromdate);
//     } else {
//       toast.error("FromDate is not set.");
//     }

//     if (storedtodate) {
//       setToDate(storedtodate);
//       // console.log('storedTodate', storedtodate);
//     } else {
//       toast.error("ToDate is not set.");
//     }
//   }, [yearid, fromdate, todate]);

//   //for print

//   // ======================================================
//   // GENERATE PDF / DIRECT PRINT
//   // ======================================================

//   // ============================================================
//   // GENERATE PDF / DIRECT PRINT
//   // ============================================================

// const generatePDF = async (printData = previewData, printWindow = null) => {
//   // ============================================================
//   // 1. CHECK INVOICE DATA
//   // ============================================================

//   if (!printData) {
//     toast.error("No invoice data available for printing.");

//     if (printWindow && !printWindow.closed) {
//       printWindow.close();
//     }

//     return;
//   }

//   console.log("========================================");
//   console.log("INVOICE PRINT START");
//   console.log("PRINT DATA:", printData);
//   console.log("SELECTED ACCOUNT:", selectedAccount);
//   console.log("SELECTED CUSTOMER NAME:", selectedCustomerName);
//   console.log("========================================");

//   // ============================================================
//   // 2. GET ACCOUNT ID
//   // ============================================================

//   let accountId = "";

//   accountId =
//     printData?.AccountId ||
//     printData?.AccountID ||
//     printData?.CustomerId ||
//     printData?.CustomerID ||
//     printData?.CustomerAccountId ||
//     printData?.CustomerAccountID ||
//     printData?.accountDetails?.Id ||
//     printData?.accountDetails?.AccountId ||
//     "";

//   // ============================================================
//   // 3. IF ACCOUNT ID NOT FOUND, GET FROM selectedAccount
//   // ============================================================

//   if (!accountId && selectedAccount) {
//     if (typeof selectedAccount === "object") {
//       accountId =
//         selectedAccount?.Id ||
//         selectedAccount?.ID ||
//         selectedAccount?.AccountId ||
//         selectedAccount?.AccountID ||
//         selectedAccount?.CustomerId ||
//         selectedAccount?.CustomerID ||
//         selectedAccount?.value ||
//         selectedAccount?.id ||
//         "";
//     } else {
//       accountId = selectedAccount;
//     }
//   }

//   // ============================================================
//   // 4. IF STILL NOT FOUND, FIND ID FROM accountOptions
//   // ============================================================

//   if (
//     !accountId &&
//     Array.isArray(accountOptions) &&
//     selectedCustomerName
//   ) {
//     const matchedAccount = accountOptions.find(
//       (account) =>
//         String(
//           account?.AccountName ||
//             account?.accountName ||
//             account?.label ||
//             ""
//         )
//           .trim()
//           .toLowerCase() ===
//         String(selectedCustomerName).trim().toLowerCase()
//     );

//     if (matchedAccount) {
//       accountId =
//         matchedAccount?.Id ||
//         matchedAccount?.ID ||
//         matchedAccount?.AccountId ||
//         matchedAccount?.AccountID ||
//         matchedAccount?.value ||
//         matchedAccount?.id ||
//         "";
//     }
//   }

//   console.log("FINAL ACCOUNT ID:", accountId);

//   // ============================================================
//   // 5. CUSTOMER VARIABLES
//   // ============================================================

//   let customerName = "";
//   let customerAddress1 = "";
//   let customerAddress2 = "";
//   let customerAddress3 = "";
//   let customerGSTNo = "";
//   let customerMobileNo = "";

//   // ============================================================
//   // 6. FETCH SELECTED CUSTOMER FROM ACCOUNT API
//   // ============================================================

//   if (accountId) {
//     try {
//       const accountResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//           accountId
//         )}`
//       );

//       if (!accountResponse.ok) {
//         throw new Error(
//           `Account API failed with status ${accountResponse.status}`
//         );
//       }

//      const accountResult = await accountResponse.json();

// console.log("FULL ACCOUNT API RESPONSE:", accountResult);

// const accountData = Array.isArray(accountResult)
//   ? accountResult[0]
//   : Array.isArray(accountResult?.data)
//   ? accountResult.data[0]
//   : accountResult?.data || accountResult;

// console.log("FINAL ACCOUNT DATA FOR PRINT:", accountData);

      

//       if (accountData) {
//         customerName =
//           accountData?.AccountName ||
//           accountData?.accountName ||
//           "";

//         customerAddress1 =
//           accountData?.Address1 ||
//           accountData?.address1 ||
//           "";

//         customerAddress2 =
//           accountData?.Address2 ||
//           accountData?.address2 ||
//           "";

//         customerAddress3 =
//           accountData?.Address3 ||
//           accountData?.address3 ||
//           "";

//         customerGSTNo =
//           accountData?.GSTNo ||
//           accountData?.GSTNO ||
//           accountData?.GstNo ||
//           "";

//         customerMobileNo =
//           accountData?.MobileNo ||
//           accountData?.MobileNumber ||
//           accountData?.ContactNo ||
//           accountData?.ContactNumber ||
//           accountData?.PhoneNo ||
//           accountData?.PhoneNumber ||
//           "";
//       }
//     } catch (error) {
//       console.error("CUSTOMER ACCOUNT API ERROR:", error);
//     }
//   } else {
//     console.warn(
//       "ACCOUNT ID NOT FOUND. Customer API was not called."
//     );
//   }

//   // ============================================================
//   // 7. FALLBACK CUSTOMER NAME
//   // ============================================================

//   if (!customerName) {
//     customerName =
//       printData?.accountDetails?.AccountName ||
//       printData?.accountDetails?.accountName ||
//       printData?.CustomerName ||
//       printData?.customerName ||
//       printData?.AccountName ||
//       printData?.CustomerAccountName ||
//       selectedCustomerName ||
//       "-";
//   }

//   // ============================================================
//   // 8. FALLBACK ADDRESS 1
//   // ============================================================

//   if (!customerAddress1) {
//     customerAddress1 =
//       printData?.accountDetails?.Address1 ||
//       printData?.Address1 ||
//       "";
//   }

//   // ============================================================
//   // 9. FALLBACK ADDRESS 2
//   // ============================================================

//   if (!customerAddress2) {
//     customerAddress2 =
//       printData?.accountDetails?.Address2 ||
//       printData?.Address2 ||
//       "";
//   }

//   // ============================================================
//   // 10. FALLBACK ADDRESS 3
//   // ============================================================

//   if (!customerAddress3) {
//     customerAddress3 =
//       printData?.accountDetails?.Address3 ||
//       printData?.Address3 ||
//       "";
//   }

//   // ============================================================
//   // 11. CONTACT NUMBER
//   // ============================================================

//   const contactNo =
//     customerMobileNo ||
//     printData?.ContactNo ||
//     printData?.ContactNumber ||
//     printData?.MobileNo ||
//     printData?.MobileNumber ||
//     printData?.PhoneNo ||
//     "-";

//   // ============================================================
//   // 12. GST NUMBER
//   // ============================================================

//   const gstNumber =
//     customerGSTNo ||
//     printData?.GSTNo ||
//     printData?.CustomerGSTNo ||
//     printData?.customerGSTNo ||
//     "";

//   // ============================================================
//   // 13. CUSTOMER DEBUG
//   // ============================================================

//   console.log("========================================");
//   console.log("FINAL CUSTOMER INFORMATION");
//   console.log("ACCOUNT ID:", accountId);
//   console.log("CUSTOMER NAME:", customerName);
//   console.log("ADDRESS 1:", customerAddress1);
//   console.log("ADDRESS 2:", customerAddress2);
//   console.log("ADDRESS 3:", customerAddress3);
//   console.log("MOBILE:", contactNo);
//   console.log("GST:", gstNumber);
//   console.log("========================================");

//   // ============================================================
//   // 14. CREATE 80MM ROLL PDF
//   // ============================================================

//   const ROLL_WIDTH = 80;
//   const ROLL_HEIGHT = 300;

//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: [ROLL_WIDTH, ROLL_HEIGHT],
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   // ============================================================
//   // 15. INVOICE NUMBER
//   // ============================================================

//   const invoiceNo =
//     printData?.InvoiceNo ||
//     printData?.InvoiceNumber ||
//     printData?.BillNo ||
//     printData?.BillNumber ||
//     printData?.invoiceNo ||
//     "";

//   // ============================================================
//   // 16. DATE
//   // ============================================================

//   let invoiceDateText = "-";

//   try {
//     if (printData?.InvoiceDate?.date) {
//       invoiceDateText = moment(
//         printData.InvoiceDate.date
//       ).format("DD-MM-YYYY");
//     } else if (printData?.InvoiceDate) {
//       invoiceDateText = moment(
//         printData.InvoiceDate
//       ).format("DD-MM-YYYY");
//     }
//   } catch (error) {
//     console.error(
//       "Invoice date formatting error:",
//       error
//     );

//     invoiceDateText = "-";
//   }

//   // ============================================================
//   // 17. TIME
//   // ============================================================

//   const invoiceTime = moment().format("hh:mm A");

//   // ============================================================
//   // 18. COMPANY DETAILS
//   // ============================================================

//   const companyName = "AMRUT MILK PRODUCTS 2";
//   const companyAddress1 =
//     "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER";
//   const companyAddress2 = "KOLHAPUR.";
//   const companyPhone = "8830261523";
//   const companyState = "27-Maharashtra";

//   // ============================================================
//   // 19. LOAD IMAGE AS DATA URL
//   // ============================================================

//   const imageToDataURL = (imageSource) => {
//     return new Promise((resolve, reject) => {
//       if (!imageSource) {
//         reject(new Error("Image source is empty."));
//         return;
//       }

//       if (
//         typeof imageSource === "string" &&
//         imageSource.startsWith("data:image")
//       ) {
//         resolve(imageSource);
//         return;
//       }

//       const img = new Image();

//       img.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");

//           canvas.width =
//             img.naturalWidth || img.width;

//           canvas.height =
//             img.naturalHeight || img.height;

//           const ctx = canvas.getContext("2d");

//           ctx.drawImage(
//             img,
//             0,
//             0,
//             canvas.width,
//             canvas.height
//           );

//           resolve(
//             canvas.toDataURL("image/png")
//           );
//         } catch (error) {
//           reject(error);
//         }
//       };

//       img.onerror = () => {
//         reject(
//           new Error(
//             `Unable to load image: ${imageSource}`
//           )
//         );
//       };

//       img.src = imageSource;
//     });
//   };

//   // ============================================================
//   // 20. LOAD BOTH LOGOS
//   // ============================================================

//   let amrutLogoData = null;
//   let fremilaLogoData = null;

//   try {
//     amrutLogoData =
//       await imageToDataURL(amrutLogo);

//     console.log("Amrut Siddhi logo loaded.");
//   } catch (error) {
//     console.error(
//       "Amrut Siddhi logo error:",
//       error
//     );
//   }

//   try {
//     fremilaLogoData =
//       await imageToDataURL(fremilaLogo);

//     console.log("Fremila logo loaded.");
//   } catch (error) {
//     console.error(
//       "Fremila logo error:",
//       error
//     );
//   }

//   // ============================================================
//   // 21. ROLL PRINT MARGINS
//   // ============================================================

//   const leftMargin = 4;
//   const rightMargin = 4;

//   const contentWidth =
//     pageWidth -
//     leftMargin -
//     rightMargin;

//   // ============================================================
//   // 22. OUTER BORDER
//   // ============================================================

//   doc.setLineWidth(0.4);

//   doc.rect(
//     leftMargin,
//     4,
//     contentWidth,
//     pageHeight - 8
//   );

//   // ============================================================
//   // 23. HEADER
//   // ============================================================

//   let y = 11;

//   // ============================================================
//   // 23.1 AMRUT SIDDHI LOGO
//   // ============================================================

//   if (amrutLogoData) {
//     try {
//       doc.addImage(
//         amrutLogoData,
//         "PNG",
//         pageWidth - 25,
//         7,
//         18,
//         12
//       );
//     } catch (error) {
//       console.error(
//         "Amrut Siddhi PDF logo error:",
//         error
//       );
//     }
//   }

//   // ============================================================
//   // 23.2 FREMILA LOGO
//   // ============================================================

//   if (fremilaLogoData) {
//     try {
//       doc.addImage(
//         fremilaLogoData,
//         "PNG",
//         pageWidth - 25,
//         20,
//         18,
//         12
//       );
//     } catch (error) {
//       console.error(
//         "Fremila PDF logo error:",
//         error
//       );
//     }
//   }

//   // ============================================================
//   // 23.3 COMPANY NAME
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(9);

//   doc.text(
//     companyName,
//     leftMargin + 2,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 23.4 COMPANY ADDRESS 1
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "normal"
//   );

//   doc.setFontSize(5.5);

//   const companyAddressLines =
//     doc.splitTextToSize(
//       companyAddress1,
//       52
//     );

//   doc.text(
//     companyAddressLines,
//     leftMargin + 2,
//     y
//   );

//   y +=
//     companyAddressLines.length *
//     3.2;

//   // ============================================================
//   // 23.5 COMPANY ADDRESS 2
//   // ============================================================

//   doc.text(
//     companyAddress2,
//     leftMargin + 2,
//     y
//   );

//   y += 3.2;

//   // ============================================================
//   // 23.6 COMPANY PHONE
//   // ============================================================

//   doc.text(
//     `Phone no.: ${companyPhone}`,
//     leftMargin + 2,
//     y
//   );

//   y += 3.2;

//   // ============================================================
//   // 23.7 COMPANY STATE
//   // ============================================================

//   doc.text(
//     `State: ${companyState}`,
//     leftMargin + 2,
//     y
//   );

//   // ============================================================
//   // 24. TAX INVOICE
//   // ============================================================

//   y += 6;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(9);

//   doc.text(
//     "Tax Invoice",
//     pageWidth / 2,
//     y,
//     {
//       align: "center",
//     }
//   );

//   y += 5;

//   // ============================================================
//   // 25. HEADER LINE
//   // ============================================================

//   doc.setLineWidth(0.3);

//   doc.line(
//     leftMargin + 2,
//     y,
//     pageWidth - rightMargin - 2,
//     y
//   );

//   y += 5;

//   // ============================================================
//   // 26. BILL TO / INVOICE DETAILS
//   // ============================================================

//   const leftX = 6;
//   const rightX = 43;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(7);

//   doc.text(
//     "Bill To",
//     leftX,
//     y
//   );

//   doc.text(
//     "Invoice Details",
//     rightX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 27. CUSTOMER NAME
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(6.5);

//   const customerNameLines =
//     doc.splitTextToSize(
//       String(customerName || "-"),
//       34
//     );

//   doc.text(
//     customerNameLines,
//     leftX,
//     y
//   );

//   // ============================================================
//   // 28. INVOICE NUMBER
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "normal"
//   );

//   doc.setFontSize(6);

//   doc.text(
//     `Invoice No.: ${invoiceNo || "-"}`,
//     rightX,
//     y
//   );

//   y += Math.max(
//     customerNameLines.length * 3.2,
//     4
//   );

//   // ============================================================
//   // 29. CUSTOMER ADDRESS 1
//   // ============================================================

//   if (customerAddress1) {
//     const address1Lines =
//       doc.splitTextToSize(
//         String(customerAddress1),
//         34
//       );

//     doc.text(
//       address1Lines,
//       leftX,
//       y
//     );

//     y +=
//       address1Lines.length *
//       3.2;
//   }

//   // ============================================================
//   // 30. DATE
//   // ============================================================

//   doc.text(
//     `Date: ${invoiceDateText}`,
//     rightX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 31. CUSTOMER ADDRESS 2
//   // ============================================================

//   if (customerAddress2) {
//     const address2Lines =
//       doc.splitTextToSize(
//         String(customerAddress2),
//         34
//       );

//     doc.text(
//       address2Lines,
//       leftX,
//       y
//     );

//     y +=
//       address2Lines.length *
//       3.2;
//   }

//   // ============================================================
//   // 32. TIME
//   // ============================================================

//   doc.text(
//     `Time: ${invoiceTime}`,
//     rightX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 33. CUSTOMER ADDRESS 3
//   // ============================================================

//   if (customerAddress3) {
//     const address3Lines =
//       doc.splitTextToSize(
//         String(customerAddress3),
//         34
//       );

//     doc.text(
//       address3Lines,
//       leftX,
//       y
//     );

//     y +=
//       address3Lines.length *
//       3.2;
//   }

//   // ============================================================
//   // 34. CONTACT NUMBER
//   // ============================================================

//   doc.text(
//     `Contact No.: ${contactNo}`,
//     leftX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 36. LINE BEFORE TABLE
//   // ============================================================

//   y += 2;

//   doc.line(
//     leftMargin + 2,
//     y,
//     pageWidth - rightMargin - 2,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 37. INVOICE DETAILS
//   // ============================================================

//   const invoiceDetails =
//     Array.isArray(printData?.invdetail)
//       ? printData.invdetail
//       : [];

//   // ============================================================
//   // 38. PRODUCT TABLE DATA
//   // ============================================================

//   const tableData =
//     invoiceDetails.map(
//       (item, index) => {
//         const matchedProduct =
//           Array.isArray(productOptions)
//             ? productOptions.find(
//                 (option) =>
//                   String(
//                     option?.value
//                   ) ===
//                   String(
//                     item?.ProductId
//                   )
//               )
//             : null;

//         const productName =
//           item?.ProductName ||
//           item?.productName ||
//           matchedProduct?.label ||
//           "Unknown";

//         const hsnSac =
//           item?.HSNSAC ||
//           item?.HsnSac ||
//           item?.HSNCode ||
//           item?.HsnCode ||
//           item?.HSN ||
//           item?.SAC ||
//           item?.SACCode ||
//           "";

//         const quantity =
//           Number(
//             item?.Quantity || 0
//           );

//         const rate =
//           Number(
//             item?.Rate || 0
//           );

//         const amount =
//           Number(
//             item?.Amount || 0
//           );

//         return [
//           index + 1,
//           productName,
//           hsnSac,
//           quantity.toFixed(2),
//           rate.toFixed(2),
//           amount.toFixed(2),
//         ];
//       }
//     );

//   // ============================================================
//   // 39. PRODUCT TABLE
//   // ============================================================

//   autoTable(doc, {
//     head: [
//       [
//         "#",
//         "Item",
//         "HSN",
//         "Qty",
//         "Rate",
//         "Amount",
//       ],
//     ],

//     body:
//       tableData.length > 0
//         ? tableData
//         : [
//             [
//               "",
//               "No items",
//               "",
//               "",
//               "",
//               "",
//             ],
//           ],

//     startY: y,

//     margin: {
//       left: 6,
//       right: 6,
//     },

//     tableWidth: 68,

//     theme: "grid",

//     styles: {
//       font: "helvetica",
//       fontSize: 5.2,
//       cellPadding: 1,
//       lineWidth: 0.2,
//       textColor: 0,
//       valign: "middle",
//       overflow: "linebreak",
//     },

//     headStyles: {
//       font: "helvetica",
//       fontSize: 5.2,
//       fontStyle: "bold",
//       fillColor: [240, 240, 240],
//       textColor: 0,
//       halign: "center",
//       valign: "middle",
//     },

//     columnStyles: {
//       0: {
//         cellWidth: 5,
//         halign: "center",
//       },

//       1: {
//         cellWidth: 25,
//         halign: "left",
//       },

//       2: {
//         cellWidth: 10,
//         halign: "center",
//       },

//       3: {
//         cellWidth: 8,
//         halign: "right",
//       },

//       4: {
//         cellWidth: 10,
//         halign: "right",
//       },

//       5: {
//         cellWidth: 10,
//         halign: "right",
//       },
//     },
//   });

//   // ============================================================
//   // 40. TOTAL QUANTITY
//   // ============================================================

//   const totalQuantity =
//     invoiceDetails.reduce(
//       (sum, item) =>
//         sum +
//         Number(
//           item?.Quantity || 0
//         ),
//       0
//     );

//   // ============================================================
//   // 41. SUB TOTAL
//   // ============================================================

//   const subTotal =
//     Number(
//       printData?.SubTotal || 0
//     );

//   // ============================================================
//   // 42. GRAND TOTAL
//   // ============================================================

//   const grandTotal =
//     Number(
//       printData?.Total || 0
//     );

//   // ============================================================
//   // 43. RECEIVED AMOUNT
//   // ============================================================

//   const savedReceivedAmount =
//     parseFloat(
//       printData?.ReceivedAmount
//     );

//   const receivedAmount =
//     !Number.isNaN(
//       savedReceivedAmount
//     )
//       ? savedReceivedAmount
//       : (parseFloat(
//           printData?.CashAmount
//         ) || 0) +
//         (parseFloat(
//           printData?.OnlineAmount
//         ) || 0);




// // ============================================================
// // 44. PREVIOUS / CURRENT / TOTAL OUTSTANDING
// // ============================================================

// const previousDue = Number(
//   printData?.PreviousBalanceDue || 0
// );

// const currentBillDue = Math.max(
//   grandTotal - receivedAmount,
//   0
// );

// const totalOutstanding =
//   previousDue + currentBillDue;

// const refund = Math.max(
//   receivedAmount - grandTotal,
//   0
// );

//   // ============================================================
// // 45. TOTAL ROW
// // ============================================================
// // ONLY TOTAL ROW SHOULD BE DISPLAYED
// // Previous Due / Current Bill Due / Total Outstanding
// // are intentionally removed from the PDF.

// y =
//   doc.lastAutoTable?.finalY
//     ? doc.lastAutoTable.finalY + 4
//     : y + 4;

// autoTable(doc, {
//   body: [
//     [
//       "",
//       "Total",
//       "",
//       totalQuantity.toFixed(2),
//       "",
//       `Rs. ${grandTotal.toFixed(2)}`,
//     ],
//   ],

//   startY: y,

//   margin: {
//     left: 6,
//     right: 6,
//   },

//   tableWidth: 68,

//   theme: "grid",

//   styles: {
//     font: "helvetica",
//     fontSize: 5.3,
//     cellPadding: 1,
//     fontStyle: "bold",
//     lineWidth: 0.2,
//     valign: "middle",
//   },

//   columnStyles: {
//     0: {
//       cellWidth: 5,
//     },

//     1: {
//       cellWidth: 25,
//     },

//     2: {
//       cellWidth: 10,
//     },

//     3: {
//       cellWidth: 8,
//       halign: "right",
//     },

//     4: {
//       cellWidth: 10,
//     },

//     5: {
//       cellWidth: 10,
//       halign: "right",
//     },
//   },
// });
//   // ============================================================
//   // 46. NUMBER TO WORDS
//   // ============================================================

//   const numberToWords = (num) => {
//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];

//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const convertBelowThousand =
//       (number) => {
//         let result = "";

//         if (number >= 100) {
//           result +=
//             ones[
//               Math.floor(
//                 number / 100
//               )
//             ] +
//             " Hundred ";

//           number %= 100;
//         }

//         if (number >= 20) {
//           result +=
//             tens[
//               Math.floor(
//                 number / 10
//               )
//             ] +
//             " ";

//           number %= 10;
//         }

//         if (number > 0) {
//           result +=
//             ones[number] +
//             " ";
//         }

//         return result.trim();
//       };

//     if (num === 0) {
//       return "Zero";
//     }

//     num = Math.floor(num);

//     let result = "";

//     if (num >= 10000000) {
//       result +=
//         convertBelowThousand(
//           Math.floor(
//             num / 10000000
//           )
//         ) +
//         " Crore ";

//       num %= 10000000;
//     }

//     if (num >= 100000) {
//       result +=
//         convertBelowThousand(
//           Math.floor(
//             num / 100000
//           )
//         ) +
//         " Lakh ";

//       num %= 100000;
//     }

//     if (num >= 1000) {
//       result +=
//         convertBelowThousand(
//           Math.floor(
//             num / 1000
//           )
//         ) +
//         " Thousand ";

//       num %= 1000;
//     }

//     if (num > 0) {
//       result +=
//         convertBelowThousand(num);
//     }

//     return result.trim();
//   };

//   // ============================================================
//   // 47. AMOUNT IN WORDS
//   // ============================================================

//   const amountInWords =
//     `${numberToWords(
//       grandTotal
//     )} Rupees only`;

//   // ============================================================
//   // 48. SUMMARY TABLE
//   // ============================================================

//   y =
//     doc.lastAutoTable?.finalY
//       ? doc.lastAutoTable.finalY + 4
//       : y + 4;

// autoTable(doc, {
//   body: [
//     // ============================================================
//     // 1. SUB TOTAL
//     // ============================================================
//     [
//       {
//         content: "Invoice Amount In Words",
//         styles: {
//           fontStyle: "bold",
//         },
//       },

//       {
//         content: "Sub Total",
//         styles: {
//           fontStyle: "bold",
//         },
//       },

//       `Rs. ${subTotal.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 2. TOTAL
//     // ============================================================
//     [
//       amountInWords,
//       "Total",
//       `Rs. ${grandTotal.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 3. RECEIVED
//     // ============================================================
//     [
//       "",
//       "Received",
//       `Rs. ${receivedAmount.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 4. PREVIOUS CUSTOMER DUE
//     // ============================================================
//     [
//       "",
//       "Previous Due",
//       `Rs. ${previousDue.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 5. CURRENT BILL DUE
//     // ============================================================
//     [
//       "",
//       "Current Bill Due",
//       `Rs. ${currentBillDue.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 6. TOTAL CUSTOMER OUTSTANDING
//     // ============================================================
//     [
//       "",
//       "Total Outstanding",
//       `Rs. ${totalOutstanding.toFixed(2)}`,
//     ],
//   ],

//   // ============================================================
//   // TABLE POSITION
//   // ============================================================
//   startY: y,

//   margin: {
//     left: 6,
//     right: 6,
//   },

//   // ============================================================
//   // TABLE WIDTH
//   // ============================================================
//   tableWidth: 68,

//   theme: "grid",

//   // ============================================================
//   // GENERAL STYLES
//   // ============================================================
//   styles: {
//     font: "helvetica",
//     fontSize: 5.3,
//     cellPadding: 1.5,
//     lineWidth: 0.2,
//     valign: "middle",
//     overflow: "linebreak",
//   },

//   // ============================================================
//   // COLUMN WIDTHS
//   // ============================================================
//   columnStyles: {
//     0: {
//       cellWidth: 39,
//     },

//     1: {
//       cellWidth: 14,
//       fontStyle: "bold",
//     },

//     2: {
//       cellWidth: 15,
//       halign: "right",
//     },
//   },
// });

//   // ============================================================
//   // 49. TERMS
//   // ============================================================

//   y =
//     doc.lastAutoTable?.finalY
//       ? doc.lastAutoTable.finalY + 5
//       : y + 5;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(6.5);

//   doc.text(
//     "Terms And Conditions",
//     6,
//     y
//   );

//   y += 3.5;

//   doc.setFont(
//     "helvetica",
//     "normal"
//   );

//   doc.setFontSize(5.5);

//   doc.text(
//     "Thanks for doing business with us!",
//     6,
//     y
//   );

//   y += 7;

//   // ============================================================
//   // 50. AUTHORIZED SIGNATORY
//   // ============================================================

//   doc.setFontSize(6);

//   doc.text(
//     "For: AMRUT MILK PRODUCTS 2",
//     pageWidth / 2,
//     y,
//     {
//       align: "center",
//     }
//   );

//   y += 9;

//   doc.line(
//     pageWidth / 2 - 15,
//     y,
//     pageWidth / 2 + 15,
//     y
//   );

//   y += 3.5;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.text(
//     "Authorized Signatory",
//     pageWidth / 2,
//     y,
//     {
//       align: "center",
//     }
//   );

//   // ============================================================
//   // 51. PRINT PDF - 80MM ROLL
//   // ============================================================

//   try {
//     // ----------------------------------------------------------
//     // IMPORTANT:
//     // Mark PDF for printing.
//     // ----------------------------------------------------------

//     if (
//       typeof doc.autoPrint ===
//       "function"
//     ) {
//       doc.autoPrint();
//     }

//     // ----------------------------------------------------------
//     // Create PDF Blob
//     // ----------------------------------------------------------

//     const pdfBlob =
//       doc.output("blob");

//     // ----------------------------------------------------------
//     // Create temporary PDF URL
//     // ----------------------------------------------------------

//     const pdfBlobUrl =
//       URL.createObjectURL(
//         pdfBlob
//       );

//     console.log(
//       "========================================"
//     );
//     console.log(
//       "80MM ROLL PDF CREATED"
//     );
//     console.log(
//       "PDF URL:",
//       pdfBlobUrl
//     );
//     console.log(
//       "========================================"
//     );

//     // ----------------------------------------------------------
//     // OPEN DIRECT PDF
//     // ----------------------------------------------------------

//     if (
//       printWindow &&
//       !printWindow.closed
//     ) {
//       printWindow.location.href =
//         pdfBlobUrl;

//       printWindow.focus();
//     } else {
//       const newPrintWindow =
//         window.open(
//           pdfBlobUrl,
//           "_blank"
//         );

//       if (!newPrintWindow) {
//         toast.error(
//           "Please allow popups for printing."
//         );

//         URL.revokeObjectURL(
//           pdfBlobUrl
//         );

//         return;
//       }

//       newPrintWindow.focus();
//     }

//     // ----------------------------------------------------------
//     // Keep Blob URL alive
//     // ----------------------------------------------------------

//     setTimeout(() => {
//       URL.revokeObjectURL(
//         pdfBlobUrl
//       );
//     }, 60000);
//   } catch (error) {
//     console.error(
//       "Error generating invoice PDF:",
//       error
//     );

//     if (
//       printWindow &&
//       !printWindow.closed
//     ) {
//       printWindow.close();
//     }

//     toast.error(
//       "Unable to generate invoice PDF."
//     );
//   }
// };

//   return (
//     <Box>
      


// <Box
//   sx={{
//     p: 5,
//     height: "auto",
//   }}
// >

//   {/* ======================================================
//       CREATE SALES ENTRY BUTTON
//   ====================================================== */}
//   <Box
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       mb: 2,
//     }}
//   >
//     <Button
//       sx={{
//         background: "var(--complementary-color)",
//         fontWeight: "bold",
//         fontSize: "17px",
//         padding: "9px 20px",
//       }}
//       variant="contained"
//       onClick={handleNewClick}
//     >
//       CREATE SALES ENTRY - DEALER
//     </Button>
//   </Box>


//   {/* ======================================================
//       INVOICE FILTERS
//   ====================================================== */}

  
//       <Box
//     sx={{
//       display: "flex",
//       gap: 2,
//       alignItems: "center",
//       flexWrap: "wrap",
//       mt: 2,
//       mb: 2,
//     }}
//   >
//     {/* SEARCH */}
//     <TextField
//       size="small"
//       label="Search"
//       placeholder="Bill No / Customer / Category"
//       value={searchText}
//       onChange={(e) => setSearchText(e.target.value)}
//       sx={{ minWidth: 250 }}
//     />
  
//     {/* FROM DATE */}
// {/* FROM DATE */}
// <TextField
//   size="small"
//   type="date"
//   label="From Date"
//   value={filterFromDate}
//   onChange={(e) => setFilterFromDate(e.target.value)}
//   InputLabelProps={{
//     shrink: true,
//   }}
//   sx={{ minWidth: 160 }}
// />
    
    
  
//     {/* TO DATE */}
//    {/* TO DATE */}
// <TextField
//   size="small"
//   type="date"
//   label="To Date"
//   value={filterToDate}
//   onChange={(e) => setFilterToDate(e.target.value)}
//   InputLabelProps={{
//     shrink: true,
//   }}
//   sx={{ minWidth: 160 }}
// />
  
//     {/* CATEGORY */}
//     <TextField
//       select
//       size="small"
//       label="Category"
//       value={categoryFilter}
//       onChange={(e) => setCategoryFilter(e.target.value)}
//       sx={{ minWidth: 160 }}
//     >
//       <MenuItem value="">All</MenuItem>
//       <MenuItem value="R">Retailer</MenuItem>
//       <MenuItem value="D">Dealer</MenuItem>
//       <MenuItem value="C">Caterers</MenuItem>
//     </TextField>
  
//     {/* CLEAR */}
//     <Button
//       variant="outlined"
//       size="small"
//       onClick={() => {
//         setSearchText("");
//         setFromDate("");
//         setToDate("");
//         setCategoryFilter("");
//       }}
//     >
//       Clear
//     </Button>
//   </Box>


//   {/* ======================================================
//       TABLE
//   ====================================================== */}
//   <MaterialReactTable
//     columns={columns}
//     data={filteredInvoiceData}
//     enablePagination={false}
//     muiTableHeadCellProps={{
//       sx: {
//         backgroundColor: "#E9ECEF",
//         color: "black",
//         fontSize: "16px",
//       },
//     }}
         
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//             >
//               <FirstPageIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setPageNo(1)}
//               />
//               <KeyboardArrowLeftIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() =>
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1))
//                 }
//               />
//               <Box ml={1}> Page No </Box>
//               <TextField
//                 sx={{
//                   width: "4.5%",
//                   ml: 1,
//                   "@media (max-width: 768px)": {
//                     width: "10%",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => setPageNo(e.target.value)}
//                 size="small"
//               />
//               <KeyboardArrowRightIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setPageNo((prev) => Number(prev) + 1)}
//               />
//               <LastPageIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setPageNo(totalPages)}
//               />
//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
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
//             <Typography sx={{ mt: 1 }}>
//               Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park
//               Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
//             </Typography>

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
//                       {new Date(
//                         previewData.InvoiceDate.date,
//                       ).toLocaleDateString()}
//                     </Typography>
//                   </Box>

//                   <Box
//                     display={"flex"}
//                     justifyContent={"space-between"}
//                     gap={2}
//                     mt={2}
//                   >
//                     <Box>
//                       <Typography>
//                         <strong>Order No:</strong> {previewData.OrderNo}
//                       </Typography>
//                     </Box>
//                     <Box>
//                       <Typography>
//                         <strong>Order Date:</strong>{" "}
//                         {new Date(
//                           previewData.OrderDate.date,
//                         ).toLocaleDateString()}
//                       </Typography>
//                     </Box>
//                     <Box>
//                       <Typography>
//                         <strong>Customer Name:</strong>{" "}
//                         {previewData.accountDetails.AccountName}
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

//                   <Grid container spacing={4}>
//                     <Grid item xs={12} md={8}>
//                       <Typography
//                         variant="h6"
//                         fontWeight="bold"
//                         gutterBottom
//                         mt={2}
//                       >
//                         Sales Details
//                       </Typography>

//                       <TableContainer
//                         component={Paper}
//                         elevation={2}
//                         sx={{ width: "100%", mt: 2 }}
//                       >
//                         <Table size="small">
//                         <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//   <TableRow>
//     <TableCell>
//       <strong>Material</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Quantity (Lit)</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Rate</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Discount</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Amount (Rs)</strong>
//     </TableCell>
//   </TableRow>
// </TableHead>

// <TableBody>
//   {previewData.invdetail.map((item, index) => {
//     const materialName =
//       productOptions.find(
//         (opt) =>
//           opt.value?.toString() ===
//           item.ProductId?.toString()
//       )?.label || "Unknown";

//     return (
//       <TableRow key={index}>
//         <TableCell>{materialName}</TableCell>

//         <TableCell>
//           {item.Quantity}
//         </TableCell>

//         <TableCell>
//           {item.Rate}
//         </TableCell>

//         <TableCell>
//           {item.DiscountAmt || 0}
//         </TableCell>

//         <TableCell>
//           {item.Amount}
//         </TableCell>
//       </TableRow>
//     );
//   })}
// </TableBody>
                         

//                         </Table>

//                       </TableContainer>

//                    <TableContainer
//   component={Paper}
//   elevation={1}
//   sx={{ width: "100%", mt: 8 }}
// >
//   <Table size="small">
//     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//       <TableRow>
//         <TableCell>
//           <strong>Payment Mode</strong>
//         </TableCell>

//         <TableCell>
//           <strong>Transport Charge</strong>
//         </TableCell>
//       </TableRow>
//     </TableHead>

//     <TableBody>
//       <TableRow>
//         <TableCell>
//           {previewData.PaymentMode || "-"}
//         </TableCell>

//         <TableCell>
//           ₹ {Number(previewData.Transport || 0).toFixed(2)}
//         </TableCell>
//       </TableRow>
//     </TableBody>
//   </Table>
// </TableContainer>

//                     </Grid>

//                     {/* Summary Table */}

//                   <Grid item xs={12} md={4}>
//   <Typography
//     variant="h6"
//     fontWeight="bold"
//     gutterBottom
//     mt={2}
//   >
//     Amount Summary
//   </Typography>

//   <TableContainer
//     component={Paper}
//     elevation={2}
//     sx={{
//       mt: 2,
//       borderRadius: 2,
//     }}
//   >
//     <Table size="small">

//       <TableBody>

//         {/* =============================== */}
//         {/* SUBTOTAL */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Subtotal</strong>
//           </TableCell>

//           <TableCell align="right">
//             ₹ {Number(previewData?.SubTotal || 0).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* TRANSPORT */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Transport</strong>
//           </TableCell>

//           <TableCell align="right">
//             ₹ {Number(previewData?.Transport || 0).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* GRAND TOTAL */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Grand Total</strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#1976d2",
//             }}
//           >
//             ₹ {Number(previewData?.Total || 0).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* RECEIVED AMOUNT */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Received Amount</strong>
//           </TableCell>

//           <TableCell align="right">
//             <Typography sx={{ fontWeight: "bold" }}>
//               ₹ {Number(previewReceivedAmount || 0).toFixed(2)}
//             </Typography>
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* PREVIOUS CUSTOMER DUE */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong style={{ color: "#e65100" }}>
//               Previous Customer Due
//             </strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#e65100",
//             }}
//           >
//             ₹{" "}
//             {Number(
//               previewData?.PreviousBalanceDue || 0
//             ).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* CURRENT BILL DUE */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong style={{ color: "#d32f2f" }}>
//               Current Bill Due
//             </strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#d32f2f",
//             }}
//           >
//             ₹{" "}
//             {Number(
//               previewData?.CurrentInvoiceDue || 0
//             ).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* TOTAL CUSTOMER OUTSTANDING */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong style={{ color: "#b71c1c" }}>
//               Total Customer Outstanding
//             </strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#b71c1c",
//               fontSize: "18px",
//             }}
//           >
//             ₹{" "}
//             {Number(
//               previewData?.BalanceDue || 0
//             ).toFixed(2)}
//           </TableCell>
//         </TableRow>

//       </TableBody>

//     </Table>
//   </TableContainer>
// </Grid>

//                   </Grid>
//                 </Box>
//               ) : (
//                 <Typography>No data to preview</Typography>
//               )}
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={generatePDF} color="primary">
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

//               display: "flex",
//               flexDirection: "column",

//               overflow: "hidden",

//               "@media (max-width: 900px)": {
//                 width: "100%",
//                 maxWidth: "100%",
//               },
//             },
//           }}
//         >
//           {/* ===================================================== */}
//           {/* DRAWER HEADER */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               px: 2,
//               py: 1.5,
//               minHeight: 70,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "rgb(236, 253, 230)",
//               borderBottom: "1px solid #ddd",
//               flexShrink: 0,
//             }}
//           >
//             {/* TITLE */}

//             <Typography
//               fontWeight="bold"
//               variant="h6"
//               sx={{
//                 fontSize: {
//                   xs: "17px",
//                   sm: "20px",
//                 },
//               }}
//             >
//               {isEditing
//                 ? "Update Sales Entry - Dealer"
//                 : "Create Sales Entry - Dealer"}
//             </Typography>

//             {/* TOTAL / REFUND / CLOSE */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: {
//                   xs: 1,
//                   sm: 3,
//                 },
//               }}
//             >
//               {/* TOTAL */}

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "12px",
//                       sm: "16px",
//                     },
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   TOTAL :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "20px",
//                       sm: "30px",
//                     },
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
//                   gap: 0.5,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "12px",
//                       sm: "16px",
//                     },
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   REFUND :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "20px",
//                       sm: "30px",
//                     },
//                     fontWeight: 900,
//                     color: "#087f23",
//                     lineHeight: 1,
//                   }}
//                 >
//                   ₹ {Number(refund || 0).toFixed(2)}
//                 </Typography>
//               </Box>

//               {/* CLOSE */}

//               <CloseIcon
//                 sx={{
//                   cursor: "pointer",
//                   fontSize: 28,
//                 }}
//                 onClick={handleDrawerCloseAndGoSalesEntry}
//               />
//             </Box>
//           </Box>

//           {/* ===================================================== */}
//           {/* DRAWER CONTENT */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               flex: 1,
//               minHeight: 0,

//               overflowY: "auto",
//               overflowX: "hidden",

//               scrollbarWidth: "none",

//               "&::-webkit-scrollbar": {
//                 display: "none",
//               },

//               p: {
//                 xs: 1,
//                 sm: 1.5,
//               },
//             }}
//           >
//             {/* ===================================================== */}
//             {/* INVOICE / DEVICE / DATE */}
//             {/* ===================================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 2,
//                 mb: 1.5,

//                 "@media (max-width: 900px)": {
//                   flexDirection: "column",
//                 },
//               }}
//             >
//               {/* INVOICE NO */}

//               <Box flex={1} width="100%">
//                 <Typography variant="body2">Invoice No</Typography>

//                <TextField
//   variant="standard"
//   sx={{
//     mt: 0.5,

//     "& .MuiInput-underline:after": {
//       borderBottomWidth: 1.5,
//       borderBottomColor: "#44ad74",
//     },
//   }}
//   focused
//   value={invoiceNo}
//   size="small"
//   margin="none"
//   placeholder="Invoice No Auto Generated"
//   fullWidth
//   InputProps={{
//     readOnly: true,
//   }}
// />
//               </Box>

//               {/* DEVICE */}

//               <Box flex={1} width="100%">
//                 <Typography variant="body2">Device</Typography>

//                 <TextField
//                   variant="standard"
//                   value={device}
//                   onChange={(e) => setDevice(e.target.value)}
//                   fullWidth
//                   size="small"
//                   sx={{
//                     mt: 0.5,
//                   }}
//                 />
//               </Box>

//               {/* INVOICE DATE */}

//               <Box flex={1} width="100%">
//                 <Typography variant="body2">Invoice Date</Typography>

//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     value={invoiceDate ? new Date(invoiceDate) : null}
//                     format="dd-MM-yyyy"
//                     onChange={(newValue) => {
//                       setInvoiceDate(newValue);

//                       setErrors({
//                         ...errors,
//                         invoiceDate: undefined,
//                       });
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
//                 alignItems: "flex-start",
//                 gap: 2,
//                 mb: 1.5,

//                 "@media (max-width: 900px)": {
//                   flexDirection: "column",
//                 },
//               }}
//             >
//               {/* CUSTOMER */}

//               <Box
//                 ref={customerDropdownRef}
//                 flex={1}
//                 width="100%"
//                 position="relative"
//               >
//                 <Typography variant="body2">Customer</Typography>

//                 {/* SELECTED CUSTOMER */}
//                 <TextField
//                   fullWidth
//                   variant="standard"
//                   size="small"
//                   value={selectedCustomerName || ""}
//                   placeholder="Select Customer"
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

//                     "& .MuiInput-underline:hover:before": {
//                       borderBottomColor: "#44ad74",
//                     },

//                     "& .MuiInput-underline:after": {
//                       borderBottomColor: "#1976d2",
//                     },
//                   }}
//                 />

//                 {/* SELECTED CUSTOMER ADDRESS */}
//                 {selectedCustomerAddress && (
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       mt: 0.5,
//                       color: "#555",
//                       fontSize: "13px",
//                     }}
//                   >
//                     {selectedCustomerAddress}
//                   </Typography>
//                 )}

//                 {/* CUSTOMER POPUP */}
//                 {showDropdown && (
//                   <Paper
//                     elevation={3}
//                     sx={{
//                       position: "absolute",
//                       top: "100%",
//                       left: 0,
//                       width: "100%",
//                       maxHeight: 350,
//                       overflowY: "auto",
//                       zIndex: 9999,
//                       mt: 1,
//                       p: 2,
//                     }}
//                   >
//                     {/* SEARCH CUSTOMER */}
//                     <TextField
//                       autoFocus
//                       value={text}
//                       onChange={(e) => {
//                         setText(e.target.value);
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();
// if (accountOptions.length > 0) {
//   const option = accountOptions[0];

//   const customerId = option.Id?.toString() || "";

//   const customerName = option.AccountName || "";

//   const customerAddress =
//     option.Address1 ||
//     option.address1 ||
//     option.Address ||
//     option.address ||
//     option.AddressLine1 ||
//     option.addressLine1 ||
//     "";

//   setSelectedAccount(customerId);

//   setSelectedCustomerName(customerName);

//   setSelectedCustomerAddress(customerAddress);

// // Existing API logic
// fetchAccounts(customerId);

// fetchCustomerContact(customerId);

// // Fetch customer previous outstanding
// fetchPreviousBalance(customerId, null);

// // Close popup
// setShowDropdown(false);



// // Clear search
// setText("");
// }
//                         }

//                         if (e.key === "Escape") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           setShowDropdown(false);
//                           setText("");
//                         }
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

//                     {/* CREATE CUSTOMER */}
//                     <Box display="flex" gap={1} mt={1}>
//                       <TextField
//                         value={accountName}
//                         onChange={(e) => {
//                           setAccountName(e.target.value);
//                         }}
//                         size="small"
//                         placeholder="Create New Customer"
//                         fullWidth
//                       />

//                       <Button
//                         sx={{
//                           background: "var(--primary-color)",

//                           "&:hover": {
//                             background: "var(--primary-color)",
//                           },
//                         }}
//                         onClick={CreateCustomerMaster}
//                         variant="contained"
//                         startIcon={
//                           <AddCircleIcon
//                             sx={{
//                               fontSize: "20px",
//                             }}
//                           />
//                         }
//                       >
//                         ADD
//                       </Button>
//                     </Box>

//                     {/* NEW CUSTOMER ADDRESS */}
//                     <TextField
//                       value={newCustomerAddress}
//                       onChange={(e) => {
//                         setNewCustomerAddress(e.target.value);
//                       }}
//                       size="small"
//                       placeholder="Dealer Address"
//                       fullWidth
//                       sx={{
//                         mt: 1,
//                       }}
//                     />

//                     {/* CUSTOMER LIST */}
//                     <Box mt={1}>
//                       {accountOptions.length > 0 ? (
//                         accountOptions.map((option) => {
//                           const customerAddress =
//                             option.Address1 ||
//                             option.address1 ||
//                             option.Address ||
//                             option.address ||
//                             option.AddressLine1 ||
//                             option.addressLine1 ||
//                             "";

//                           return (
//                             <MenuItem
//                               key={option.Id}
//                               onClick={() => {
//                                 const customerId = option.Id?.toString() || "";

//                                 const customerName = option.AccountName || "";

//                                 setSelectedAccount(customerId);

//                                 setSelectedCustomerName(customerName);

//                                 setSelectedCustomerAddress(customerAddress);

                            
//                               // Existing API logic
// fetchAccounts(customerId);

// fetchCustomerContact(customerId);

// // Fetch customer previous outstanding
// fetchPreviousBalance(customerId, null);


                              

//                                 // Close popup
//                                 setShowDropdown(false);

//                                 // Clear search
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
//                                 {option.AccountName}
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

//               {/* CONTACT NUMBER */}

//               <Box flex={1} width="100%">
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
//                     height: "40px",
//                     fontSize: "16px",
//                     borderRadius: "5px",
//                   }}
//                   buttonStyle={{
//                     borderRadius: "5px",
//                   }}
//                 />
//               </Box>
//             </Box>
//             {/* ===================================================== */}
//             {/* PRODUCT DETAILS */}
//             {/* ===================================================== */}

//             <Paper
//               elevation={2}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #dcdcdc",
//                 borderRadius: 2,
//                 overflow: "hidden",
//                 backgroundColor: "#fff",
//                 mb: 1.5,
//               }}
//             >
//               {/* PRODUCT DETAILS TITLE */}
//               <Box
//                 sx={{
//                   px: 1.5,
//                   py: 1.2,
//                   borderBottom: "1px solid #dcdcdc",
//                   backgroundColor: "#fff",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: { xs: "17px", sm: "20px" },
//                     fontWeight: 700,
//                   }}
//                 >
//                   Product Details
//                 </Typography>
//               </Box>

//               {/* ===================================================== */}
//               {/* PRODUCT TABLE */}
//               {/* ===================================================== */}

//               <TableContainer
//                 sx={{
//                   width: "100%",
//                   overflowX: "auto",
//                 }}
//               >
//                 <Table
//                   size="small"
//                   sx={{
//                     width: "100%",
//                     minWidth: 850,
//                     tableLayout: "fixed",

//                     "& .MuiTableCell-root": {
//                       borderBottom: "1px solid #e5e5e5",
//                       py: 1.2,
//                       px: 1.5,
//                       fontSize: "14px",
//                     },
//                   }}
//                 >
//                   {/* ================================================= */}
//                   {/* TABLE HEADER */}
//                   {/* ================================================= */}

//                   <TableHead>
//                     <TableRow
//                       sx={{
//                         backgroundColor: "#f5f5f5",
//                       }}
//                     >
//                       <TableCell
//                         sx={{
//                           width: "8%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Sr.No
//                       </TableCell>

//                       <TableCell
//                         sx={{
//                           width: "27%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Product
//                       </TableCell>

//                       <TableCell
//                         align="center"
//                         sx={{
//                           width: "15%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Quantity
//                       </TableCell>

//                       <TableCell
//                         align="right"
//                         sx={{
//                           width: "15%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Rate
//                       </TableCell>

//                       <TableCell
//                         align="right"
//                         sx={{
//                           width: "17%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Amount
//                       </TableCell>

//                       <TableCell
//                         align="center"
//                         sx={{
//                           width: "18%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Action
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   {/* ================================================= */}
//                   {/* TABLE BODY */}
//                   {/* ================================================= */}

//                   <TableBody>
//                     {/* ================================================= */}
//                     {/* SAVED PRODUCT ROWS */}
//                     {/* ================================================= */}

//                     {rows.map((row, index) => (
//                       <TableRow key={row.Id || `product-row-${index}`} hover>
//                         {/* SR NO */}
//                         <TableCell>{index + 1}</TableCell>

//                         {/* PRODUCT */}
//                         <TableCell>
//                           <Typography
//                             sx={{
//                               fontSize: "14px",
//                               fontWeight: 500,
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {row.ProductName || "-"}
//                           </Typography>
//                         </TableCell>

//                         {/* QUANTITY */}
//                         <TableCell align="center">
//                           <TextField
//                             variant="standard"
//                             type="number"
//                             value={row.Quantity ?? ""}
//                             onChange={(e) => {
//                               const updatedRows = [...rows];

//                               const qty =
//                                 e.target.value === ""
//                                   ? ""
//                                   : Number(e.target.value);

//                               const currentRate =
//                                 Number(updatedRows[index].Rate) || 0;

//                               updatedRows[index] = {
//                                 ...updatedRows[index],
//                                 Quantity: qty,
//                                 Amount: (Number(qty) || 0) * currentRate,
//                               };

//                               setRows(updatedRows);
//                             }}
//                             sx={{
//                               width: 80,
//                             }}
//                             inputProps={{
//                               min: 0,
//                             }}
//                           />
//                         </TableCell>

//                         {/* RATE */}
//                         <TableCell align="right">
//                           <TextField
//                             variant="standard"
//                             type="number"
//                             value={row.Rate ?? ""}
//                             onChange={(e) => {
//                               const updatedRows = [...rows];

//                               const newRate =
//                                 e.target.value === ""
//                                   ? ""
//                                   : Number(e.target.value);

//                               const currentQty =
//                                 Number(updatedRows[index].Quantity) || 0;

//                               updatedRows[index] = {
//                                 ...updatedRows[index],
//                                 Rate: newRate,
//                                 Amount: currentQty * (Number(newRate) || 0),
//                               };

//                               setRows(updatedRows);
//                             }}
//                             sx={{
//                               width: 100,
//                             }}
//                             inputProps={{
//                               min: 0,
//                             }}
//                           />
//                         </TableCell>

//                         {/* AMOUNT */}
//                         <TableCell align="right">
//                           ₹ {Number(row.Amount || 0).toFixed(2)}
//                         </TableCell>

//                         {/* ACTION */}
//                         <TableCell align="center">
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               gap: 0.5,
//                             }}
//                           >
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               onClick={() => handleEditRow(index)}
//                             >
//                               Edit
//                             </Button>

//                             <Button
//                               size="small"
//                               variant="outlined"
//                               color="error"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               Delete
//                             </Button>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}

//                     {/* ================================================= */}
//                     {/* NEW PRODUCT ROW */}
//                     {/* ================================================= */}

//                     <TableRow
//                       sx={{
//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       {/* SR NO */}
//                       <TableCell>{rows.length + 1}</TableCell>

//                       {/* ================================================= */}
//                       {/* PRODUCT */}
//                       {/* ================================================= */}

//                       <TableCell>
// <Autocomplete
//   options={productOptions}
//   value={
//     productOptions.find(
//       (option) =>
//         String(option.value) === String(selectedProductID)
//     ) || null
//   }
//   getOptionLabel={(option) => option?.label || ""}
//   isOptionEqualToValue={(option, value) =>
//     String(option.value) === String(value?.value)
//   }
//   ListboxProps={{
//     style: {
//       maxHeight: "300px",
//       overflowY: "auto",
//     },
//   }}
//   onChange={(event, newValue) => {
//     handleItemChange(newValue);
//   }}
//   onKeyDown={(event) => {
//     if (event.key !== "Enter") {
//       return;
//     }

//     if (selectedProductID) {
//       event.preventDefault();
//       event.stopPropagation();

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);
//     }
//   }}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       inputRef={productRef}
//       variant="standard"
//       placeholder="Select Product"
//       size="small"
//       fullWidth
//       sx={{
//         "& .MuiInputBase-root": {
//           fontSize: "15px",
//         },
//       }}
//     />
//   )}
// />
//                       </TableCell>

//                       {/* ================================================= */}
//                       {/* QUANTITY */}
//                       {/* ================================================= */}
// <TableCell align="center">
// <TextField
//   variant="standard"
//   type="number"
//  value={quantity}
//   onChange={handleQuantityChange}
//   inputRef={quantityRef}
//   onKeyDown={(event) => {
//     if (event.key !== "Enter") {
//       return;
//     }

//     event.preventDefault();
//     event.stopPropagation();

//     // Product select आहे का?
//     if (!selectedProductID) {
//       toast.error("Please select a product.");

//       setTimeout(() => {
//         productRef.current?.focus();
//       }, 100);

//       return;
//     }

//     // Quantity check
//     if (!quantity || Number(quantity) <= 0) {
//       toast.error("Please enter quantity.");

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }

//     // Dealer Rate check
//     if (!rate || Number(rate) <= 0) {
//       toast.error("Dealer rate not available.");

//       return;
//     }

//     // ==========================================
//     // ADD / UPDATE ROW
//     // ==========================================
//     handleSaveOrAddRow();

//     // ==========================================
//     // AFTER ADD → PRODUCT FOCUS
//     // ==========================================
//     setTimeout(() => {
//       productRef.current?.focus();
//     }, 100);
//   }}
//   sx={{
//     width: 80,
//   }}
//   inputProps={{
//     min: 0,
//   }}
// />
// </TableCell>

//                       {/* ================================================= */}
//                       {/* RATE */}
//                       {/* ================================================= */}
// <TableCell align="right">
//   <TextField
//     variant="standard"
//     type="number"
//     // NEW
// value={rate}
//     inputRef={rateRef}
//     InputProps={{
//       readOnly: true,
//     }}
//     sx={{
//       width: 100,
//     }}
//     inputProps={{
//       min: 0,
//     }}
//   />
// </TableCell>

//                       {/* ================================================= */}
//                       {/* AMOUNT */}
//                       {/* ================================================= */}

//                       <TableCell align="right">
//                         ₹{" "}
//                         {(
//                           (Number(quantity) || 0) * (Number(rate) || 0)
//                         ).toFixed(2)}
//                       </TableCell>

//                       {/* ================================================= */}
//                       {/* ACTION */}
//                       {/* ================================================= */}

//                       <TableCell align="center">
//                         <Typography
//                           sx={{
//                             color: "#999",
//                             fontSize: "13px",
//                           }}
//                         >
//                           New
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* ERROR */}
//               {errors.rows && (
//                 <Typography
//                   color="error"
//                   sx={{
//                     px: 2,
//                     py: 1,
//                     fontSize: "14px",
//                   }}
//                 >
//                   {errors.rows}
//                 </Typography>
//               )}
//             </Paper>

//             {/* ===================================================== */}
//             {/* PAYMENT MODE + TRANSPORT */}
//             {/* ===================================================== */}

//             <Grid
//               container
//               spacing={2}
//               sx={{
//                 mb: 1.5,
//               }}
//             >
//               {/* PAYMENT MODE */}

//               <Grid item xs={12} md={6}>
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       fontWeight: 600,
//                       mb: 0.5,
//                     }}
//                   >
//                     Payment Mode
//                   </Typography>
// <TextField
//   select
//   variant="standard"
//   name="paymentMode"
//   value={paymentMode || ""}
//   onChange={(e) => {
//     const mode = e.target.value;

//     setPaymentMode(mode);
//     setReceivedAmount("");

//     if (mode !== "M") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }

//     setErrors({
//       ...errors,
//       paymentMode: "",
//     });
//   }}
//   onKeyDown={(e) => {
//     // ENTER = पुढे Discount
//     if (e.key === "Enter") {
//       e.preventDefault();
//       e.stopPropagation();

//       if (!paymentMode) {
//         toast.error("Please select payment mode.");
//         return;
//       }

//       setTimeout(() => {
//         discountRef.current?.focus();
//         discountRef.current?.select();
//       }, 100);

//       return;
//     }

//     // ESC = मागे Quantity
//     if (e.key === "Escape") {
//       e.preventDefault();
//       e.stopPropagation();

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }
//   }}
//   fullWidth
//   error={!!errors.paymentMode}
//   helperText={errors.paymentMode}
// >
//   <MenuItem value="">
//     Select Payment Mode
//   </MenuItem>

//   <MenuItem value="C">
//     Cash
//   </MenuItem>

//   <MenuItem value="O">
//     Online
//   </MenuItem>

//   <MenuItem value="M">
//     Mix
//   </MenuItem>
// </TextField>
//                 </Box>

//                 {/* MIX PAYMENT */}

//                 {paymentMode === "M" && (
//                   <Box
//                     sx={{
//                       mt: 1.5,
//                       p: 1.5,
//                       border: "1px solid #e0e0e0",
//                       borderRadius: 2,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontWeight: 700,
//                         mb: 1.5,
//                       }}
//                     >
//                       Mix Payment
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 2,
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
//                         }}
//                       />
//                     </Box>

//                     <Box
//                       sx={{
//                         mt: 1.5,
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Typography fontWeight={700}>Received</Typography>

//                       <Typography fontWeight={800} color="primary">
//                         ₹ {Number(receivedAmount || 0).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 )}
//               </Grid>

//               {/* TRANSPORT */}

//               <Grid item xs={12} md={6}>
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       fontWeight: 600,
//                       mb: 0.5,
//                     }}
//                   >
//                     Transport
//                   </Typography>

//                   <TextField
//                     variant="standard"
//                     value={transport}
//                     onChange={(e) => setTransport(e.target.value)}
//                     placeholder="Transport"
//                     fullWidth
//                     type="number"
//                   />
//                 </Box>
//               </Grid>
//             </Grid>

//             {/* ===================================================== */}
//             {/* AMOUNT SUMMARY - FULL WIDTH */}
//             {/* ===================================================== */}

//             <Paper
//               elevation={4}
//               sx={{
//                 width: "100%",
//                 p: {
//                   xs: 1.5,
//                   sm: 2,
//                 },
//                 borderRadius: 3,
//                 border: "1px solid #e0e0e0",
//                 backgroundColor: "#ffffff",
//                 mb: 2,
//               }}
//             >
//               {/* TITLE */}

//               <Typography
//                 variant="h5"
//                 sx={{
//                   fontWeight: 800,
//                   color: "#1976d2",
//                   mb: 2,
//                 }}
//               >
//                 Amount Summary
//               </Typography>

//               {/* SUMMARY ROW */}

//               <Grid container spacing={2} alignItems="center">
//                 {/* SUBTOTAL */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "17px",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Subtotal
//                     </Typography>

//                     <Typography
//                       sx={{
//                         fontSize: "19px",
//                         fontWeight: 700,
//                       }}
//                     >
//                       ₹ {Number(subTotalcal || 0).toFixed(2)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 {/* DISCOUNT */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "17px",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Discount
//                     </Typography>

//                     <TextField
//                       inputRef={discountRef}
//                       size="small"
//                       type="number"
//                       value={discount}
//                       onChange={(e) => {
//                         const value = e.target.value;

//                         if (value === "" || Number(value) >= 0) {
//                           setDiscount(value);
//                         }
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           setTimeout(() => {
//                             receivedAmountRef.current?.focus();
//                             receivedAmountRef.current?.select();
//                           }, 100);
//                         }
//                       }}
//                       placeholder="0.00"
//                       sx={{
//                         width: 120,

//                         "& input": {
//                           textAlign: "right",
//                           fontSize: "16px",
//                           fontWeight: 500,
//                         },
//                       }}
//                       inputProps={{
//                         min: 0,
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 {/* TOTAL */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "20px",
//                         fontWeight: 700,
//                       }}
//                     >
//                       Total
//                     </Typography>

//                     <Typography
//                       sx={{
//                         fontSize: "26px",
//                         fontWeight: 800,
//                         color: "#1976d2",
//                       }}
//                     >
//                       ₹ {Number(total || 0).toFixed(2)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 {/* RECEIVED */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "17px",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Received Amount
//                     </Typography>

//                     <TextField
//                       inputRef={receivedAmountRef}
//                       size="small"
//                       type="number"
//                       value={receivedAmount}
//                       onChange={handleReceivedAmountChange}
//                       disabled={paymentMode === "M"}
//                       placeholder="0.00"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           // Received Amount पेक्षा पुढे जायचे असल्यास
//                           // Save button / पुढचा action इथे ठेवू शकतो.
//                         }
//                       }}
//                       sx={{
//                         width: 120,

//                         "& input": {
//                           textAlign: "right",
//                           fontSize: "16px",
//                           fontWeight: 500,
//                         },
//                       }}
//                       inputProps={{
//                         min: 0,
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>

//               <Divider
//                 sx={{
//                   my: 1.5,
//                 }}
//               />

//               {/* ================================================= */}
//               {/* PAYMENT STATUS */}
//               {/* ================================================= */}

//              {/* ================================================= */}
// {/* PAYMENT STATUS */}
// {/* ================================================= */}

// {isPaid ? (
//   <Box
//     sx={{
//       p: 1.5,
//       borderRadius: 2,
//       backgroundColor: "#e8f5e9",
//       border: "1px solid #a5d6a7",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Typography
//       sx={{
//         fontSize: "20px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       Paid
//     </Typography>

//     <Typography
//       sx={{
//         fontSize: "22px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       ₹ {Number(grandTotal || 0).toFixed(2)}
//     </Typography>
//   </Box>
// ) : received > grandTotal ? (
//   <Box
//     sx={{
//       p: 1.5,
//       borderRadius: 2,
//       backgroundColor: "#e8f5e9",
//       border: "1px solid #a5d6a7",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Typography
//       sx={{
//         fontSize: "20px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       Refund
//     </Typography>

//     <Typography
//       sx={{
//         fontSize: "22px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       ₹ {(received - grandTotal).toFixed(2)}
//     </Typography>
//   </Box>
// ) : (
//   <Box
//     sx={{
//       p: 1.5,
//       borderRadius: 2,
//       backgroundColor: "#ffebee",
//       border: "1px solid #ef9a9a",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Typography
//       sx={{
//         fontSize: "20px",
//         fontWeight: 800,
//         color: "#d32f2f",
//       }}
//     >
//       Current Bill Due
//     </Typography>

//     <Typography
//       sx={{
//         fontSize: "22px",
//         fontWeight: 800,
//         color: "#d32f2f",
//       }}
//     >
//       ₹ {Math.max(grandTotal - received, 0).toFixed(2)}
//     </Typography>
//   </Box>
// )}

// {/* ================================================= */}
// {/* PREVIOUS DUE */}
// {/* ================================================= */}

// <Box
//   sx={{
//     p: 1.5,
//     mt: 1,
//     borderRadius: 2,
//     backgroundColor: "#fff8e1",
//     border: "1px solid #ffcc80",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }}
// >
//   <Typography
//     sx={{
//       fontSize: "20px",
//       fontWeight: 800,
//       color: "#e65100",
//     }}
//   >
//     Previous Due
//   </Typography>

//   <Typography
//     sx={{
//       fontSize: "22px",
//       fontWeight: 800,
//       color: "#e65100",
//     }}
//   >
//     ₹ {Number(previousBalanceDue || 0).toFixed(2)}
//   </Typography>
// </Box>

// {/* ================================================= */}
// {/* TOTAL OUTSTANDING */}
// {/* ================================================= */}

// <Box
//   sx={{
//     p: 1.5,
//     mt: 1,
//     borderRadius: 2,
//     backgroundColor: "#ffebee",
//     border: "1px solid #ef5350",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }}
// >
//   <Typography
//     sx={{
//       fontSize: "20px",
//       fontWeight: 800,
//       color: "#b71c1c",
//     }}
//   >
//     Total Outstanding
//   </Typography>

//   <Typography
//     sx={{
//       fontSize: "22px",
//       fontWeight: 800,
//       color: "#b71c1c",
//     }}
//   >
//     ₹ {Number(customerOutstanding || 0).toFixed(2)}
//   </Typography>
// </Box>
//             </Paper>
//           </Box>

//           {/* ===================================================== */}
//           {/* SAVE / CANCEL / DELETE */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 2,
//               py: 1.5,
//               px: 2,
//               borderTop: "1px solid #ddd",
//               backgroundColor: "#fff",
//               flexShrink: 0,
//             }}
//           >
//           {/* SAVE / UPDATE */}

// <Button
//   sx={{
//     background: "var(--primary-color)",

//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
//   onClick={handleSubmit}
//   variant="contained"
// >
//   {isEditing ? "Update" : "Save"}
// </Button>

// {/* PRINT */}

// <Button
//   sx={{
//     background: "var(--complementary-color)",

//     "&:hover": {
//       background: "var(--complementary-color)",
//     },
//   }}
//   onClick={(e) => handleSubmit(e, true)}
//   variant="contained"
//   startIcon={<PrintIcon />}
// >
//   Print
// </Button>

// {/* CANCEL */}

// <Button
//   sx={{
//     borderColor: "var(--complementary-color)",
//     color: "var(--complementary-color)",
//   }}
//   onClick={handleDrawerClose}
//   variant="outlined"
// >
//   <b>Cancel</b>
// </Button>

//             {isEditing && (
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={handleClickOpen}
//               >
//                 Delete
//               </Button>
//             )}

//             {/* DELETE DIALOG */}

//             <Dialog open={open} onClose={handleClose}>
//               <DialogTitle>Confirm Deletion</DialogTitle>

//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this item?
//                 </DialogContentText>
//               </DialogContent>

//               <DialogActions>
//                 <Button onClick={handleClose} color="primary">
//                   Cancel
//                 </Button>

//                 <Button onClick={handleConfirmDelete} color="error" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </Box>
//         </Drawer>
//            <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           newestOnTop
//         />

//       </Box>
//     </Box>
//   );
// };

// export default DealerSalesEntry;

































// import { useMemo, useState, useEffect, useRef } from "react";

// import { useLocation, useNavigate } from "react-router-dom";
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
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";
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
// import { toast, ToastContainer } from "react-toastify";
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

// import amrutLogo from "../imgs/amrutlogo.png";
// import fremilaLogo from "../imgs/fremilalogo.png";

// const DealerSalesEntry = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [invoiceheaders, setInvoiceheaders] = useState([]);
//   const [invoicedetails, setInvoicedetails] = useState([]);
//   const [rows, setRows] = useState([]);


// // ======================================================
// // INVOICE LIST FILTERS
// // ======================================================
// const [searchText, setSearchText] = useState("");
// const [categoryFilter, setCategoryFilter] = useState("");
// const [filterFromDate, setFilterFromDate] = useState("");
// const [filterToDate, setFilterToDate] = useState("");

// // =====================================================
// // INVOICE EDIT HISTORY
// // =====================================================

// const [historyOpen, setHistoryOpen] = useState(false);
// const [historyLoading, setHistoryLoading] = useState(false);

// const [selectedHistoryInvoice, setSelectedHistoryInvoice] =
//   useState(null);

// const [historyHeader, setHistoryHeader] = useState([]);
// const [historyDetails, setHistoryDetails] = useState([]);

// const [currentHistoryHeader, setCurrentHistoryHeader] =
//   useState(null);

// const [currentHistoryDetails, setCurrentHistoryDetails] =
//   useState([]);

// const [selectedHistoryVersion, setSelectedHistoryVersion] =
//   useState(null);

// const [selectedHistoryDetails, setSelectedHistoryDetails] =
//   useState([]);

// // Product options
// const [productOptions, setProductOptions] = useState([]);


//   useEffect(() => {
//     // fetchInvdetails();
//   }, []);

  
// // ======================================================
// // GET ALL INVOICE HEADERS
// // ======================================================
// const fetchInvoiceHeader = async () => {
//   const requestOptions = {
//     method: "GET",
//     redirect: "follow",
//   };

//   try {
//     // ==================================================
//     // 1. FIRST PAGE
//     // ==================================================
//     const firstResponse = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1`,
//       requestOptions
//     );

//     const firstResult = await firstResponse.json();

//     const totalPages = Number(
//       firstResult?.total_pages || 1
//     );

//     let allInvoiceData = [
//       ...(firstResult?.data || []),
//     ];

//     // ==================================================
//     // 2. GET REMAINING PAGES
//     // ==================================================
//     if (totalPages > 1) {
//       for (let page = 2; page <= totalPages; page++) {
//         const response = await fetch(
//           `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}`,
//           requestOptions
//         );

//         const result = await response.json();

//         allInvoiceData = [
//           ...allInvoiceData,
//           ...(result?.data || []),
//         ];
//       }
//     }




// // =====================================================
// // OPEN INVOICE EDIT HISTORY
// // =====================================================



//     // ==================================================
//     // 3. SORT NEWEST BILL FIRST
//     // ==================================================
//     allInvoiceData.sort(
//       (a, b) =>
//         Number(b?.Id || 0) -
//         Number(a?.Id || 0)
//     );

//     // ==================================================
//     // 4. FETCH ACCOUNT + ADDRESS
//     // ==================================================
//     const invoicesList = await Promise.all(
//       allInvoiceData.map(async (invoice) => {
//         try {
//           // --------------------------------------------
//           // ACCOUNT
//           // --------------------------------------------
//           let accountDetails = null;

//           if (
//             invoice?.AccountId &&
//             Number(invoice.AccountId) !== 0
//           ) {
//             const acctResponse = await fetch(
//               `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invoice.AccountId}`,
//               requestOptions
//             );

//             if (acctResponse.ok) {
//               const acctResult =
//                 await acctResponse.json();

//               accountDetails = Array.isArray(
//                 acctResult
//               )
//                 ? acctResult[0] || null
//                 : Array.isArray(acctResult?.data)
//                   ? acctResult.data[0] || null
//                   : acctResult?.data ||
//                     acctResult ||
//                     null;
//             }
//           }

//           // --------------------------------------------
//           // ADDRESS
//           // --------------------------------------------
//           let addressDetails = null;

//           if (
//             invoice?.AccountId &&
//             Number(invoice.AccountId) !== 0
//           ) {
//             const addressResponse =
//               await fetch(
//                 `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${invoice.AccountId}`,
//                 requestOptions
//               );

//             if (addressResponse.ok) {
//               const addressResult =
//                 await addressResponse.json();

//               addressDetails = Array.isArray(
//                 addressResult
//               )
//                 ? addressResult[0] || null
//                 : Array.isArray(
//                       addressResult?.data
//                     )
//                   ? addressResult.data[0] ||
//                     null
//                   : addressResult?.data ||
//                     addressResult ||
//                     null;
//             }
//           }

//           // --------------------------------------------
//           // CUSTOMER TYPE
//           // --------------------------------------------
//           const customerType = String(
//             addressDetails?.CustomerType ||
//               addressDetails?.customerType ||
//               accountDetails?.CustomerType ||
//               accountDetails?.customerType ||
//               invoice?.CustomerType ||
//               invoice?.customerType ||
//               ""
//           )
//             .trim()
//             .toUpperCase();

//           return {
//             ...invoice,

//             accountDetails: {
//               ...(accountDetails || {}),
//               CustomerType: customerType,
//             },

//             addressDetails,
//           };
//         } catch (error) {
//           console.error(
//             `Failed to fetch customer details for invoice ${invoice?.Id}:`,
//             error
//           );


// return {
//   ...invoice,

//   accountDetails: {
//     AccountName: invoice?.AccountName || "",
//     CustomerType:
//       invoice?.CustomerType ||
//       invoice?.customerType ||
//       "",
//   },

//   addressDetails: null,
// };

//         }
//       })
//     );

//     // ==================================================
//     // 5. SAVE ALL INVOICES
//     // ==================================================
//     setInvoiceheaders(invoicesList);

//     setTotalPages(totalPages);

//     console.log(
//       "ALL DEALER INVOICES:",
//       invoicesList
//     );

//     console.log(
//       "TOTAL DEALER INVOICE COUNT:",
//       invoicesList.length
//     );
//   } catch (error) {
//     console.error(
//       "Error fetching all invoice headers:",
//       error
//     );
//   }
// };




// // =====================================================
// // SELECT HISTORY VERSION
// // =====================================================

// const handleHistoryVersionClick = (historyItem) => {
//   if (!historyItem) {
//     return;
//   }

//   const version = Number(historyItem?.VersionNo);

//   if (!version) {
//     toast.error("Version not found.");
//     return;
//   }

//   console.log("======================================");
//   console.log("HISTORY VERSION CLICK");
//   console.log("Invoice No:", historyItem?.InvoiceNo);
//   console.log("Invoice ID:", historyItem?.InvoiceId);
//   console.log("Version:", version);
//   console.log("======================================");

//   setSelectedHistoryVersion(version);

//   const versionDetails = historyDetails.filter(
//     (detail) =>
//       Number(detail?.VersionNo) === version
//   );

//   console.log(
//     "SELECTED VERSION DETAILS:",
//     versionDetails
//   );

//   setSelectedHistoryDetails(versionDetails);
// };



// const fetchCurrentInvoiceForHistory = async (invoiceId) => {
//   try {
   
//     const headerResponse = await axios.get(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`
//     );

//     const headerData = headerResponse.data;

//     const currentHeader =
//       Array.isArray(headerData)
//         ? headerData[0] || null
//         : Array.isArray(headerData?.data)
//         ? headerData.data[0] || null
//         : headerData?.data || headerData || null;

//     // ==========================================
//     // CURRENT DETAILS
//     // ==========================================

//     const detailResponse = await axios.get(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//     );

//     const detailData = detailResponse.data;

//     const currentDetails =
//       Array.isArray(detailData)
//         ? detailData
//         : Array.isArray(detailData?.data)
//         ? detailData.data
//         : detailData?.data
//         ? [detailData.data]
//         : detailData
//         ? [detailData]
//         : [];

//     setCurrentHistoryHeader(currentHeader);
//     setCurrentHistoryDetails(currentDetails);

//     return {
//       header: currentHeader,
//       details: currentDetails,
//     };

//   } catch (error) {
//     console.error(
//       "CURRENT INVOICE HISTORY FETCH ERROR:",
//       error
//     );

//     throw error;
//   }
// };



// // =====================================================
// // OPEN INVOICE EDIT HISTORY
// // =====================================================

// const handleInvoiceHistoryClick = async (invoice) => {
//   console.log("======================================");
//   console.log("EDITED BUTTON CLICKED");
//   console.log("FULL INVOICE:", invoice);
//   console.log("======================================");

//   const invoiceId =
//     invoice?.Id ||
//     invoice?.InvoiceId ||
//     invoice?.invoiceId;

//   console.log("HISTORY INVOICE ID:", invoiceId);

//   if (!invoiceId) {
//     toast.error("Invoice ID not found.");
//     return;
//   }

//   // Open dialog immediately
//   setSelectedHistoryInvoice(invoice);
//   setHistoryOpen(true);
//   setHistoryLoading(true);

//   // Clear old data
//   setHistoryHeader([]);
//   setHistoryDetails([]);
//   setCurrentHistoryHeader(null);
//   setCurrentHistoryDetails([]);
//   setSelectedHistoryVersion(null);
//   setSelectedHistoryDetails([]);

//   try {
//     // =================================================
//     // OLD HEADER
//     // =================================================
//     const headerResponse = await axios.get(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(invoiceId)}`
//     );

//     const headerData = headerResponse.data;

//     const oldHeaders = Array.isArray(headerData)
//       ? headerData
//       : Array.isArray(headerData?.data)
//         ? headerData.data
//         : headerData?.data
//           ? [headerData.data]
//           : headerData
//             ? [headerData]
//             : [];

//     console.log(
//       "OLD HEADER HISTORY:",
//       oldHeaders
//     );

//     setHistoryHeader(oldHeaders);

//     // =================================================
//     // OLD DETAILS
//     // =================================================
//     const detailResponse = await axios.get(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(invoiceId)}`
//     );

//     const detailData = detailResponse.data;

//     const oldDetails = Array.isArray(detailData)
//       ? detailData
//       : Array.isArray(detailData?.data)
//         ? detailData.data
//         : detailData?.data
//           ? [detailData.data]
//           : detailData
//             ? [detailData]
//             : [];

//     console.log(
//       "OLD DETAIL HISTORY:",
//       oldDetails
//     );

//     setHistoryDetails(oldDetails);

//     // =================================================
//     // LATEST VERSION
//     // =================================================
//     if (oldHeaders.length > 0) {
//       const latestVersionItem =
//         [...oldHeaders].sort(
//           (a, b) =>
//             Number(b?.VersionNo || 0) -
//             Number(a?.VersionNo || 0)
//         )[0];

//       const latestVersion = Number(
//         latestVersionItem?.VersionNo || 0
//       );

//       console.log(
//         "LATEST VERSION:",
//         latestVersion
//       );

//       if (latestVersion > 0) {
//         setSelectedHistoryVersion(
//           latestVersion
//         );

//         const versionDetails =
//           oldDetails.filter(
//             (detail) =>
//               Number(detail?.VersionNo) ===
//               latestVersion
//           );

//         setSelectedHistoryDetails(
//           versionDetails
//         );
//       }
//     }

//     // =================================================
//     // CURRENT INVOICE
//     // =================================================
//     await fetchCurrentInvoiceForHistory(
//       invoiceId
//     );

//     console.log(
//       "CURRENT INVOICE LOADED SUCCESSFULLY"
//     );

//   } catch (error) {
//     console.error(
//       "INVOICE HISTORY ERROR:",
//       error
//     );

//     toast.error(
//       "Unable to load invoice history."
//     );
//   } finally {
//     setHistoryLoading(false);
//   }
// };




// // ======================================================
// // FETCH CUSTOMER PREVIOUS DUE
// // ======================================================

// const fetchPreviousBalance = async (
//   customerId,
//   excludeInvoiceId = null
// ) => {
//   if (!customerId) {
//     setPreviousBalanceDue(0);
//     return 0;
//   }

//   try {
//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
//         customerId
//       )}`
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Invoice history API failed with status ${response.status}`
//       );
//     }

//     const result = await response.json();

//     // API response array handle करा
//     const invoiceList = Array.isArray(result)
//       ? result
//       : Array.isArray(result?.data)
//       ? result.data
//       : result?.data
//       ? [result.data]
//       : [];

//     let previousBalance = 0;

//     console.log("==============================================");
//     console.log("PREVIOUS BALANCE CALCULATION");
//     console.log("Customer ID:", customerId);
//     console.log("Exclude Invoice ID:", excludeInvoiceId);
//     console.log("Total Invoices Returned:", invoiceList.length);
//     console.log("==============================================");

//     for (const invoice of invoiceList) {
//       const invoiceId = Number(invoice?.Id || 0);

//       // --------------------------------------------------
//       // EDIT MODE
//       // Currently editing invoice Previous Due मध्ये
//       // पुन्हा calculate होऊ नये
//       // --------------------------------------------------
//       if (
//         excludeInvoiceId !== null &&
//         excludeInvoiceId !== undefined &&
//         String(invoiceId) === String(excludeInvoiceId)
//       ) {
//         console.log(
//           "SKIPPING CURRENT EDIT INVOICE:",
//           invoiceId
//         );

//         continue;
//       }

//       // --------------------------------------------------
//       // Invoice Total
//       // --------------------------------------------------
//       const invoiceTotal =
//         parseFloat(invoice?.Total) || 0;

//       // --------------------------------------------------
//       // Received Amount
//       // --------------------------------------------------
//       let invoiceReceived = 0;

//       if (
//         invoice?.ReceivedAmount !== null &&
//         invoice?.ReceivedAmount !== undefined &&
//         invoice?.ReceivedAmount !== ""
//       ) {
//         invoiceReceived =
//           parseFloat(invoice.ReceivedAmount) || 0;
//       } else {
//         // Fallback:
//         // Cash + Online
//         const cashAmount =
//           parseFloat(invoice?.CashAmount) || 0;

//         const onlineAmount =
//           parseFloat(invoice?.OnlineAmount) || 0;

//         invoiceReceived =
//           cashAmount + onlineAmount;
//       }

//       // --------------------------------------------------
//       // Invoice Due
//       // --------------------------------------------------
//       const invoiceDue = Math.max(
//         invoiceTotal - invoiceReceived,
//         0
//       );

//       // --------------------------------------------------
//       // Add to Previous Balance
//       // --------------------------------------------------
//       previousBalance += invoiceDue;

//       console.log("Invoice Due Calculation:", {
//         InvoiceId: invoiceId,
//         Total: invoiceTotal,
//         ReceivedAmount: invoiceReceived,
//         Due: invoiceDue,
//         RunningPreviousBalance: previousBalance,
//       });
//     }

//     // --------------------------------------------------
//     // Final Previous Due
//     // --------------------------------------------------
//     const finalPreviousBalance =
//       Number(previousBalance.toFixed(2));

//     console.log(
//       "FINAL PREVIOUS BALANCE:",
//       finalPreviousBalance
//     );

//     setPreviousBalanceDue(
//       finalPreviousBalance
//     );

//     return finalPreviousBalance;
//   } catch (error) {
//     console.error(
//       "Error fetching customer previous balance:",
//       error
//     );

//     setPreviousBalanceDue(0);

//     return 0;
//   }
// };





// // ======================================================
// // FILTER INVOICE LIST
// // ======================================================
// const filteredInvoiceData = useMemo(() => {
//   const search = searchText.trim().toLowerCase();

//   return invoiceheaders.filter((invoice) => {
//     // Bill / Invoice number
//    const billNo = String(
//   invoice?.InvoiceNo || ""
// ).toLowerCase();

//     // Customer name
//     const customerName = String(
//       invoice?.accountDetails?.AccountName || ""
//     ).toLowerCase();

//     // Customer type
//     const customerType = String(
//       invoice?.accountDetails?.CustomerType ||
//         invoice?.addressDetails?.CustomerType ||
//         invoice?.CustomerType ||
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     // Category name
//     let categoryName = "";

//     if (customerType === "R") {
//       categoryName = "retailer";
//     } else if (customerType === "D") {
//       categoryName = "dealer";
//     } else if (customerType === "C") {
//       categoryName = "caterers";
//     }

//     // Invoice date
//     const invoiceDate = invoice?.InvoiceDate?.date
//       ? invoice.InvoiceDate.date.substring(0, 10)
//       : typeof invoice?.InvoiceDate === "string"
//         ? invoice.InvoiceDate.substring(0, 10)
//         : "";

//     // Category filter
//     const categoryMatch =
//       categoryFilter === "" ||
//       customerType === categoryFilter;

//     // Search filter
//     const searchMatch =
//       search === "" ||
//       billNo.includes(search) ||
//       customerName.includes(search) ||
//       categoryName.includes(search);

//     // From date
//     const fromDateMatch =
//       filterFromDate === "" ||
//       (invoiceDate !== "" &&
//         invoiceDate >= filterFromDate);

//     // To date
//     const toDateMatch =
//       filterToDate === "" ||
//       (invoiceDate !== "" &&
//         invoiceDate <= filterToDate);

//     return (
//       categoryMatch &&
//       searchMatch &&
//       fromDateMatch &&
//       toDateMatch
//     );
//   });
// }, [
//   invoiceheaders,
//   searchText,
//   categoryFilter,
//   filterFromDate,
//   filterToDate,
// ]);


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
//   // OPEN CATERERS FORM FROM NAVIGATION
//   // ======================================================



//   useEffect(() => {
//     if (location.state?.openCreateForm === true) {
//       // Open Create Sales Entry - Dealer form
//       handleNewClick();

//       // Clear navigation state so refresh won't reopen form
//       navigate(location.pathname, {
//         replace: true,
//         state: {},
//       });
//     }
//   }, [location.state, location.pathname, navigate]);

  


// const handleDrawerClose = () => {
//   setIsDrawerOpen(false);
//   setShowDropdown(false);
//   resetForm();
// };

// const handleDrawerCloseAndGoSalesEntry = () => {
//   setIsDrawerOpen(false);
//   setShowDropdown(false);
//   resetForm();
//   navigate("/salesentry");
// };

//   //for delete Header
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleConfirmDelete = () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     // const itemId = currentRow.original.Id;
//     // console.log('itemId',currentRow.original.Id)

//     fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=invoiceheader&Id=${editId}`,
//       requestOptions,
//     )
//       .then((response) => response.text())
//       .then((result) => {
//         console.log(result);

//         handleDrawerClose();
//         fetchInvoiceHeader();
//         handleMenuClose();
//         toast.success("Sales Entry - Dealer Deleted successfully!");
//       })
//       .catch((error) => console.error(error));
//   };

//   const [editId, setEditId] = useState("");

//   //update form

// const handleEdit = async (row) => {
//   const originalData = row.original;

//   if (!originalData) return;

//  const rowId = originalData.Id;

// const invheader = invoiceheaders.find(
//   (h) => String(h.Id) === String(rowId)
// );

//   if (!invheader) {
//     console.error("No invoice header found for the selected row.");
//     return;
//   }

//   // ==============================
//   // FETCH SAVED INVOICE DETAILS
//   // ==============================
//   let invdetail = [];

//   try {
//     const detailResponse = await axios.get(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invheader.Id}`
//     );

//     invdetail = Array.isArray(detailResponse.data)
//       ? detailResponse.data
//       : detailResponse.data?.data || [];

//     console.log("EDIT INVOICE DETAIL RESPONSE:", invdetail);
//   } catch (error) {
//     console.error("Error fetching invoice details:", error);
//     toast.error("Unable to fetch invoice details.");
//     return;
//   }

//  // ==============================
// // CUSTOMER DETAILS
// // ==============================
// fetchAccounts(invheader.AccountId);
// fetchAccountName(invheader.AccountId);

// const savedCustomerName =
//   invheader.accountDetails?.AccountName ||
//   invheader.accountDetails?.accountName ||
//   "";

// setCustomerName(savedCustomerName);
// setSelectedAccount(invheader.AccountId);


// // Fetch previous customer due
// // Current edited invoice exclude करा
// fetchPreviousBalance(
//   invheader.AccountId,
//   invheader.Id
// );



// setSelectedCustomerName(savedCustomerName);

//   // ==============================
//   // DATE CONVERSION
//   // ==============================
//   const convertDateForInput = (dateStr) => {
//     if (typeof dateStr === "string" && dateStr.includes("-")) {
//       const [year, month, day] = dateStr.split(" ")[0].split("-");

//       return `${year}-${month}-${day}`;
//     } else {
//       toast.error(`Invalid date format: ${dateStr}`);
//       return "";
//     }
//   };

//   // ==============================
//   // MAP SAVED PRODUCTS
//   // ==============================
// const mappedRows = invdetail.map((detail) => ({
//   Id: detail.Id,

//   InvoiceId: detail.InvoiceId,

//   ProductId: detail.ProductId,

//   ProductName:
//     productOptions.find(
//       (data) =>
//         data.value?.toString() === detail.ProductId?.toString()
//     )?.label || "",

//   Quantity:
//     detail.Quantity !== null && detail.Quantity !== undefined
//       ? parseFloat(detail.Quantity) || 0
//       : 0,

//   Rate:
//     detail.Rate !== null && detail.Rate !== undefined
//       ? parseFloat(detail.Rate) || 0
//       : 0,

//   Amount:
//     detail.Amount !== null && detail.Amount !== undefined
//       ? parseFloat(detail.Amount) || 0
//       : 0,

//   CGSTPercentage:
//     detail.CGSTPercentage !== null &&
//     detail.CGSTPercentage !== undefined
//       ? parseFloat(detail.CGSTPercentage) || 0
//       : 0,

//   CGSTAmount:
//     detail.CGSTAmount !== null &&
//     detail.CGSTAmount !== undefined
//       ? parseFloat(detail.CGSTAmount) || 0
//       : 0,

//   SGSTPercentage:
//     detail.SGSTPercentage !== null &&
//     detail.SGSTPercentage !== undefined
//       ? parseFloat(detail.SGSTPercentage) || 0
//       : 0,

//   SGSTAmount:
//     detail.SGSTAmount !== null &&
//     detail.SGSTAmount !== undefined
//       ? parseFloat(detail.SGSTAmount) || 0
//       : 0,

//   IGSTPercentage:
//     detail.IGSTPercentage !== null &&
//     detail.IGSTPercentage !== undefined
//       ? parseFloat(detail.IGSTPercentage) || 0
//       : 0,

//   IGSTAmount:
//     detail.IGSTAmount !== null &&
//     detail.IGSTAmount !== undefined
//       ? parseFloat(detail.IGSTAmount) || 0
//       : 0,

//   DiscountAmt:
//     detail.DiscountAmt !== null &&
//     detail.DiscountAmt !== undefined
//       ? parseFloat(detail.DiscountAmt) || 0
//       : 0,
// }));

//   // ==============================
//   // OPEN EDIT FORM
//   // ==============================
//   const invoiceDate = convertDateForInput(
//     invheader.InvoiceDate?.date
//   );

//   setIsDrawerOpen(true);

//   setInvoiceNo(invheader.InvoiceNo);

//   setInvoiceDate(invoiceDate);

//   setPhone(invheader.ContactNo);

//   setDevice(invheader.Device || "");

//   // ==============================
//   // BILL HEADER FIELDS
//   // ==============================
//   setBillFor(invheader.BillFor || "");

//   setMachineID(
//     invheader.MachineID
//       ? String(invheader.MachineID)
//       : ""
//   );

//   setIsGST(Number(invheader.IsGST) === 1);

//   // ==============================
//   // RESET CURRENT PRODUCT INPUT
//   // ==============================
//  // ==============================
// // LOAD FIRST SAVED PRODUCT INTO INPUT
// // ==============================
// if (mappedRows.length > 0) {
//   const firstRow = mappedRows[0];

//   setEditingRow(0);

//   setSelectedProductId(firstRow.ProductId);
//   setProductName(firstRow.ProductName || "");

//   setQuantity(firstRow.Quantity ?? "");
//   setRate(firstRow.Rate ?? "");
//   SetAmount(firstRow.Amount ?? "");

//   setDiscount(firstRow.DiscountAmt ?? 0);

//   setCGST(firstRow.CGSTPercentage ?? 0);
//   setCGSTAmount(firstRow.CGSTAmount ?? 0);

//   setSGST(firstRow.SGSTPercentage ?? 0);
//   setSGSTAmount(firstRow.SGSTAmount ?? 0);

//   setIGST(firstRow.IGSTPercentage ?? 0);
//   setIGSTAmount(firstRow.IGSTAmount ?? 0);
// } else {
//   setEditingRow(null);

//   setQuantity("");
//   setRate("");
//   SetAmount("");
//   setDiscount("");

//   setCGST("");
//   setCGSTAmount("");

//   setSGST("");
//   setSGSTAmount("");

//   setIGST("");
//   setIGSTAmount("");
// }


//   // ==============================
//   // PAYMENT DETAILS
//   // ==============================
//   setPaymentMode(invheader.PaymentMode || "");

//   setCashAmount(
//     invheader.CashAmount != null
//       ? String(invheader.CashAmount)
//       : ""
//   );

//   setOnlineAmount(
//     invheader.OnlineAmount != null
//       ? String(invheader.OnlineAmount)
//       : ""
//   );

//   setDiscount(
//     invheader.Discount != null
//       ? String(invheader.Discount)
//       : ""
//   );

//   setReceivedAmount(
//     invheader.ReceivedAmount != null
//       ? String(invheader.ReceivedAmount)
//       : ""
//   );

//   setTransport(
//     invheader.Transport != null
//       ? String(invheader.Transport)
//       : ""
//   );

//   // ==============================
//   // SET SAVED PRODUCTS
//   // ==============================
//   setRows(mappedRows);

//   // ==============================
//   // EDIT MODE
//   // ==============================
//   setIsEditing(true);

//   setEditId(row.original?.Id);

//   handleMenuOpen();

//   fetchInvoiceHeader();
// };

//   //table
//   const [pageNo, setPageNo] = useState(1);
//   //for preview
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewData, setPreviewData] = useState(null);



//   // ======================================================
// // CUSTOMER-WISE DUE
// // ======================================================

// const [previousBalanceDue, setPreviousBalanceDue] = useState(0);
// const [currentInvoiceDue, setCurrentInvoiceDue] = useState(0);
// const [totalOutstanding, setTotalOutstanding] = useState(0);


// const isSubmittingRef = useRef(false);


// const savedPreviewReceived = parseFloat(
//   previewData?.ReceivedAmount
// );

// const previewReceivedAmount =
//   !Number.isNaN(savedPreviewReceived)
//     ? savedPreviewReceived
//     : (parseFloat(previewData?.CashAmount) || 0) +
//       (parseFloat(previewData?.OnlineAmount) || 0);

// const previewTotal =
//   parseFloat(previewData?.Total) || 0;

// const previewRefund = Math.max(
//   previewReceivedAmount - previewTotal,
//   0
// );

// const previewCurrentDue = Math.max(
//   previewTotal - previewReceivedAmount,
//   0
// );

// const previewPreviousDue =
//   Number(previewData?.PreviousBalanceDue || 0);

// const previewTotalOutstanding =
//   previewPreviousDue +
//   previewCurrentDue;



//   const columns = useMemo(
//   () => [
//   {
//   accessorKey: "InvoiceNo",
//   header: "Bill No",
//   size: 80,
//   Cell: ({ row }) => (
//     <span>
//       {row.original?.InvoiceNo || "-"}
//     </span>
//   ),
// },

//     {
//       accessorKey: "InvoiceDate.date",
//       header: "Invoice Date",
//       size: 80,
//       Cell: ({ cell }) => (
//         <span>
//           {cell.getValue()
//             ? moment(cell.getValue()).format("DD-MM-YYYY")
//             : "-"}
//         </span>
//       ),
//     },

//     // ======================================================
//     // CUSTOMER NAME
//     // ======================================================
//     {
//       header: "Customer Name",
//       size: 120,
//       accessorFn: (row) =>
//         row?.accountDetails?.AccountName || "N/A",
//       Cell: ({ cell }) => (
//         <span>{cell.getValue()}</span>
//       ),
//     },

//     // ======================================================
//     // CATEGORY
//     // ======================================================
//     {
//       header: "Category",
//       size: 100,

//       accessorFn: (row) => {
//         const customerType = String(
//           row?.accountDetails?.CustomerType ||
//             row?.addressDetails?.CustomerType ||
//             row?.CustomerType ||
//             ""
//         )
//           .trim()
//           .toUpperCase();

//         if (customerType === "R") {
//           return "Retailer";
//         }

//         if (customerType === "D") {
//           return "Dealer";
//         }

//         if (customerType === "C") {
//           return "Caterers";
//         }

//         return "-";
//       },

//       Cell: ({ cell }) => (
//         <span>{cell.getValue()}</span>
//       ),
//     },

//     // ======================================================
//     // TOTAL
//     // ======================================================
//     {
//       accessorKey: "Total",
//       header: "Total",
//       size: 80,
//     },

//     // ======================================================
//     // ACTIONS
//     // ======================================================
//     {
//       header: "Actions",
//       size: 200,

//       Cell: ({ row }) => (
//         <Box
//           display="flex"
//           gap={1}
//           alignItems="center"
//         >
//           {/* EDIT */}
//           <Button
//             sx={{
//               background:
//                 "var(--primary-color)",
//             }}
//             variant="contained"
//             size="small"
//             onClick={() => {
//               handleEdit(row);
//             }}
//           >
//             Edit
//           </Button>

//           {/* PREVIEW */}
//           <Button
//             variant="contained"
//             sx={{
//               background:
//                 "var(--complementary-color)",
//             }}
//             size="small"
//             onClick={async () => {
//               try {
//                 const invoiceId =
//                   row.original?.Id;

//                 if (!invoiceId) {
//                   toast.error(
//                     "Invoice ID not found."
//                   );
//                   return;
//                 }

//                 // ==========================================
//                 // FETCH SAVED INVOICE DETAILS
//                 // ==========================================
//                 const detailResponse =
//                   await axios.get(
//                     `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
//                   );

//                 const details =
//                   Array.isArray(
//                     detailResponse.data
//                   )
//                     ? detailResponse.data
//                     : detailResponse.data?.data ||
//                       [];

//                 console.log(
//                   "PREVIEW INVOICE DETAIL RESPONSE:",
//                   details
//                 );

//                 // ==========================================
//                 // ADD PRODUCT NAME
//                 // ==========================================
//                 const invdetail =
//                   details.map((detail) => {
//                     const matchedMaterial =
//                       productOptions.find(
//                         (item) =>
//                           item.value?.toString() ===
//                           detail.ProductId?.toString()
//                       );

//                     return {
//                       ...detail,
//                       ProductName:
//                         matchedMaterial?.label ||
//                         "Unknown",
//                     };
//                   });

//                // ==========================================
// // FETCH PREVIOUS CUSTOMER DUE FOR PREVIEW
// // ==========================================

// const previousDueForPreview =
//   await fetchPreviousBalance(
//     row.original?.AccountId,
//     invoiceId
//   );

// const previewTotal =
//   Number(row.original?.Total || 0);

// const previewReceived =
//   row.original?.ReceivedAmount != null
//     ? Number(row.original.ReceivedAmount || 0)
//     : (Number(row.original?.CashAmount || 0) +
//        Number(row.original?.OnlineAmount || 0));

// const previewCurrentDue = Math.max(
//   previewTotal - previewReceived,
//   0
// );

// const previewOutstanding =
//   previousDueForPreview + previewCurrentDue;

// // ==========================================
// // SET PREVIEW DATA
// // ==========================================

// const previewInvoice = {
//   ...row.original,

//   PreviousBalanceDue: Number(
//     previousDueForPreview.toFixed(2)
//   ),

//   CurrentInvoiceDue: Number(
//     previewCurrentDue.toFixed(2)
//   ),

//   BalanceDue: Number(
//     previewOutstanding.toFixed(2)
//   ),

//   invdetail,
// };

//                 setPreviewData(
//                   previewInvoice
//                 );

//                 setPreviewOpen(true);

//                 console.log(
//                   "PREVIEW DATA:",
//                   previewInvoice
//                 );
//               } catch (error) {
//                 console.error(
//                   "Error fetching invoice details for preview:",
//                   error
//                 );

//                 toast.error(
//                   "Unable to fetch invoice details."
//                 );
//               }
//             }}
//           >
//             Preview
//           </Button>
//         </Box>
//       ),
//     },

//    // ==================================================
// // REMARK / EDITED
// // ==================================================
// {
//   header: "Remark",
//   size: 140,

//   accessorFn: (row) => {
//     const createdOn =
//       row?.CreatedOn?.date ||
//       row?.CreatedOn ||
//       "";

//     const updatedOn =
//       row?.UpdatedOn?.date ||
//       row?.UpdatedOn ||
//       "";

//     const updateCount =
//       Number(row?.UpdateCount ?? 0);

//     const isEdited =
//       updateCount > 1 ||
//       (
//         createdOn &&
//         updatedOn &&
//         String(createdOn) !== String(updatedOn)
//       );

//     return isEdited ? "Edited" : "-";
//   },

//   Cell: ({ row }) => {
//     const invoice = row.original;

//     const createdOn =
//       invoice?.CreatedOn?.date ||
//       invoice?.CreatedOn ||
//       "";

//     const updatedOn =
//       invoice?.UpdatedOn?.date ||
//       invoice?.UpdatedOn ||
//       "";

//     const updateCount =
//       Number(invoice?.UpdateCount ?? 0);

//     const isEdited =
//       updateCount > 1 ||
//       (
//         createdOn &&
//         updatedOn &&
//         String(createdOn) !== String(updatedOn)
//       );

//     if (!isEdited) {
//       return (
//         <Typography
//           sx={{
//             color: "#999",
//             fontWeight: 500,
//           }}
//         >
//           -
//         </Typography>
//       );
//     }

//     return (
//       <Button
//         variant="contained"
//         size="small"
//         sx={{
//           background: "var(--primary-color)",
//           minWidth: "80px",
//           fontWeight: 600,
//         }}
//         onClick={() => {
//           handleInvoiceHistoryClick(invoice);
//         }}
//       >
//         Edited
//       </Button>
//     );
//   },
// },

//   ],
//   [
//     invoiceheaders,
//     productOptions,
//     pageNo,
//   ]
// );




//   // =========================
//   // Integration
//   // =========================

//   // Invoice Details
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState("");

//   const [phone, setPhone] = useState("");

//   const [device, setDevice] = useState("");

//   const [billFor, setBillFor] = useState("");

//   const [machineID, setMachineID] = useState("");

//   const [machineOptions, setMachineOptions] = useState([]);

//   const [isGST, setIsGST] = useState(false);

//   // Product Details
//   const [product, setProduct] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [rate, setRate] = useState("");
//   const [amount, SetAmount] = useState("");

//   // Keyboard navigation refs
//   const quantityRef = useRef(null);
//   const rateRef = useRef(null);
//   const productRef = useRef(null);

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
//   const discountRef = useRef(null);
//   const receivedAmountRef = useRef(null);

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

//   const [selectedCustomerName, setSelectedCustomerName] = useState("");

//   const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

//   const [newCustomerAddress, setNewCustomerAddress] = useState("");

//   const [acctGSTNo, setacctGSTNo] = useState("");

//   useEffect(() => {
//     // fetchAccounts();

//     fetchProduct();

//     fetchMachines();

//     fetchInvoiceHeader();
//   }, []);

//   //fetch customer from  account table
  

//  const fetchProduct = async () => {
//   try {
//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster&RateType=Dealer",
//     );

//     const data = await response.json();

//     console.log("DEALER PRODUCT API RESPONSE:", data);

//     productvalidation(data);
//   } catch (error) {
//     console.error("Error fetching dealer products:", error);
//   }
// };
//   // ======================================================
//   // FETCH MACHINES
//   // ======================================================

//   const fetchMachines = async () => {
//     try {
//       const response = await axios.get(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=Machines",
//       );

//       console.log("Machines API Response:", response.data);

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

// const productvalidation = (data) => {
//   const options = data
//     .filter(
//       (account) =>
//         account?.ProductName &&
//         String(account.ProductName).trim() !== ""
//     )
//     .map((account) => ({
//       value: account?.Id,
//       label: account?.ProductName,
//       cgst: account?.CGSTPercentage,
//       sgst: account?.SGSTPercentage,
//       igst: account?.IGSTPercentage,

//       // Dealer API मधून automatic Dealer Rate
//       purchaseRate: account?.Rate,
//     }));

//   setProductOptions(options);
// };

//   const resetForm = () => {
//     // =========================
//     // Invoice Details
//     // =========================
//     setInvoiceNo("");
//     setInvoiceDate(new Date());
//     setPhone("");
//     setDevice("");

//     // NEW BILL HEADER FIELDS
//     setBillFor("");
//     setMachineID("");
//     setIsGST(false);

//     // Customer
//     setSelectedAccount("");
//     setSelectedCustomerName("");

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
//  setErrors({
//   invoiceDate: "",
//   selectedAccount: "",
//   paymentMode: "",
//   rows: "",
//   phone: "",
// });

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
//    setSubTotalCal(0);
// setCgstTotal(0);
// setSgstTotal(0);
// setIgstTotal(0);
// setTotal(0);

// setPreviousBalanceDue(0);
// setCurrentInvoiceDue(0);
// setTotalOutstanding(0);
//   };

// const handleSubmit = async (e, shouldPrint = false) => {
//   // ======================================================
//   // 0. PREVENT DEFAULT FORM / BROWSER ACTION
//   // ======================================================

//   if (e) {
//     e.preventDefault();
//     e.stopPropagation();
//   }

//   // ======================================================
//   // 1. PREVENT DOUBLE SUBMIT
//   // ======================================================

//   if (isSubmittingRef.current) {
//     console.log(
//       "SUBMIT ALREADY IN PROGRESS - IGNORING"
//     );
//     return;
//   }

//   // ======================================================
//   // 2. MAIN FORM VALIDATION
//   // ======================================================

//   if (!validateForm()) {
//     console.log("FORM VALIDATION FAILED");
//     return;
//   }

//   // ======================================================
//   // 3. RECEIVED AMOUNT VALIDATION
//   // ======================================================

//   if (!validateReceivedAmount()) {
//     console.log(
//       "RECEIVED AMOUNT VALIDATION FAILED"
//     );
//     return;
//   }

//   // ======================================================
//   // 4. MIX PAYMENT VALIDATION
//   // ======================================================

//   if (!validatePaymentSplit()) {
//     console.log(
//       "PAYMENT VALIDATION FAILED"
//     );
//     return;
//   }

//   // ======================================================
//   // 5. LOCK SUBMIT
//   // ======================================================

//   isSubmittingRef.current = true;

//   let printWindow = null;

//   try {
//     // ======================================================
//     // 6. OPEN PRINT WINDOW ONLY IF PRINT REQUESTED
//     // ======================================================

//     if (shouldPrint) {
//       printWindow = window.open("", "_blank");

//       if (!printWindow) {
//         toast.error(
//           "Please allow popups for printing."
//         );

//         return;
//       }

//       // ======================================================
//       // TEMPORARY PRINT WINDOW CONTENT
//       // ======================================================

//       printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>Preparing Invoice...</title>
//           </head>

//           <body
//             style="
//               font-family: Arial;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               height: 100vh;
//               margin: 0;
//             "
//           >
//             <h3>
//               Preparing invoice for printing...
//             </h3>
//           </body>
//         </html>
//       `);

//       printWindow.document.close();
//     }

//     // ======================================================
//     // 7. FORMAT INVOICE DATE
//     // ======================================================

//     const formattedInvoicedate =
//       moment(invoiceDate).format("YYYY-MM-DD");

//     // ======================================================
//     // 8. FETCH PREVIOUS CUSTOMER DUE BEFORE SAVE
//     // ======================================================

//     const previousDueForSave =
//       await fetchPreviousBalance(
//         selectedAccount,
//         isEditing ? editId : null
//       );

//     // ======================================================
//     // 9. CURRENT INVOICE DUE
//     // ======================================================

//     const currentDueForSave = Math.max(
//       (parseFloat(total) || 0) -
//         (parseFloat(receivedAmount) || 0),
//       0
//     );

//     // ======================================================
//     // 10. TOTAL CUSTOMER OUTSTANDING
//     // ======================================================

//     const totalOutstandingForSave =
//       Number(previousDueForSave || 0) +
//       Number(currentDueForSave || 0);

//     console.log(
//       "PREVIOUS DUE:",
//       previousDueForSave
//     );

//     console.log(
//       "CURRENT INVOICE DUE:",
//       currentDueForSave
//     );

//     console.log(
//       "TOTAL OUTSTANDING:",
//       totalOutstandingForSave
//     );

//     // ======================================================
//     // 11. SET CUSTOMER DUE STATES
//     // ======================================================

//     setPreviousBalanceDue(
//       Number(
//         Number(previousDueForSave || 0).toFixed(2)
//       )
//     );

//     setCurrentInvoiceDue(
//       Number(
//         Number(currentDueForSave || 0).toFixed(2)
//       )
//     );

//     setTotalOutstanding(
//       Number(
//         Number(totalOutstandingForSave || 0).toFixed(2)
//       )
//     );

//     // ======================================================
//     // 12. INVOICE HEADER DATA
//     // ======================================================

//     const invoiceheaderdata = {
//       Id: isEditing ? editId : "",

//       InvoiceNo: invoiceNo,

//       InvoiceDate: formattedInvoicedate,

//       AccountId: selectedAccount
//         ? selectedAccount
//         : customerName,

//       ContactNo: phone,

//       BillFor: billFor || "",

//       MachineID: machineID
//         ? parseInt(machineID, 10)
//         : 0,

//       IsGST: isGST ? 1 : 0,

//       PaymentMode: paymentMode || "",

//       CashAmount:
//         parseFloat(cashAmount) || 0,

//       OnlineAmount:
//         parseFloat(onlineAmount) || 0,

//       Discount:
//         parseFloat(discount) || 0,

//       Transport:
//         parseFloat(transport) || 0,

//       CGSTAmount:
//         parseFloat(cgstTotal) || 0,

//       SGSTAmount:
//         parseFloat(sgstTotal) || 0,

//       IGSTAmount:
//         parseFloat(igstTotal) || 0,

//       Total:
//         parseFloat(total) || 0,

//       ReceivedAmount:
//         parseFloat(receivedAmount) || 0,

//       SubTotal:
//         parseFloat(subTotalcal) || 0,
//     };

//     console.log(
//       "INVOICE HEADER DATA TO API:",
//       invoiceheaderdata
//     );

//     // ======================================================
//     // 13. SELECT HEADER API
//     // ======================================================

//     const invoiceurl = isEditing
//       ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
//       : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

//     console.log(
//       "Saving invoice using:",
//       invoiceurl
//     );

//     // ======================================================
//     // 14. SAVE INVOICE HEADER
//     // ======================================================

//     const response = await axios.post(
//       invoiceurl,
//       qs.stringify(invoiceheaderdata),
//       {
//         headers: {
//           "Content-Type":
//             "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     console.log(
//       "Invoice Header Response:",
//       response.data
//     );

//     // ======================================================
//     // 15. GET INVOICE ID
//     // ======================================================

//    const invoiceId = isEditing
//   ? editId
//   : parseInt(response.data.Id, 10);

// const savedInvoiceNo = isEditing
//   ? invoiceNo
//   : response.data.InvoiceNo;

// console.log("Invoice ID:", invoiceId);
// console.log("Saved Invoice No:", savedInvoiceNo);

//     console.log(
//       "Invoice ID:",
//       invoiceId
//     );

//     if (!invoiceId) {
//       throw new Error(
//         "Invoice ID was not received from server."
//       );
//     }

//     // ======================================================
//     // 16. SAVE INVOICE DETAILS
//     // ======================================================

//     for (const [index, row] of rows.entries()) {
//       const rowData = {
//         Id: row.Id
//           ? parseInt(row.Id, 10)
//           : "",

//         InvoiceId:
//           parseInt(invoiceId, 10),

//         SerialNo: index + 1,

//         ProductId:
//           parseInt(row.ProductId, 10),

//         Quantity:
//           parseFloat(row.Quantity) || 0,

//         Rate:
//           parseFloat(row.Rate) || 0,

//         Amount:
//           parseFloat(row.Amount) || 0,

//         CGSTPercentage:
//           parseFloat(row.CGSTPercentage) || 0,

//         CGSTAmount:
//           parseFloat(row.CGSTAmount) || 0,

//         SGSTPercentage:
//           parseFloat(row.SGSTPercentage) || 0,

//         SGSTAmount:
//           parseFloat(row.SGSTAmount) || 0,

//         IGSTPercentage:
//           parseFloat(row.IGSTPercentage) || 0,

//         IGSTAmount:
//           parseFloat(row.IGSTAmount) || 0,
//       };

//       console.log(
//         `Invoice Detail ${index + 1}:`,
//         rowData
//       );

//       const invoicdedetailurl = row.Id
//         ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
//         : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

//       await axios.post(
//         invoicdedetailurl,
//         qs.stringify(rowData),
//         {
//           headers: {
//             "Content-Type":
//               "application/x-www-form-urlencoded",
//           },
//         }
//       );
//     }

//     // ======================================================
//     // 17. CUSTOMER NAME FOR PRINT
//     // ======================================================

//     const customerNameForPrint =
//       accountOptions.find(
//         ({ Id }) =>
//           String(Id) ===
//           String(selectedAccount)
//       )?.AccountName ||
//       accountName ||
//       "-";

//     // ======================================================
//     // 18. PREPARE PRINT DATA
//     // ======================================================

// const printData = {
//   ...invoiceheaderdata,

//   Id: invoiceId,

//   InvoiceNo: savedInvoiceNo,

//   Device: device || "-",

//   PaymentMode: paymentMode || "-",

//   PreviousBalanceDue: Number(
//     Number(previousDueForSave || 0).toFixed(2)
//   ),

//   CurrentInvoiceDue: Number(
//     Number(currentDueForSave || 0).toFixed(2)
//   ),

//   BalanceDue: Number(
//     Number(totalOutstandingForSave || 0).toFixed(2)
//   ),

//   accountDetails: {
//     AccountName: customerNameForPrint,
//   },

//   customerName: customerNameForPrint,

//   invdetail: rows.map((row) => ({
//     ...row,

//     ProductName:
//       row.ProductName ||
//       productOptions.find(
//         (option) =>
//           String(option.value) ===
//           String(row.ProductId)
//       )?.label ||
//       "Unknown",

//     Quantity: parseFloat(row.Quantity) || 0,
//     Rate: parseFloat(row.Rate) || 0,
//     Amount: parseFloat(row.Amount) || 0,

//     DiscountAmt:
//       parseFloat(row.DiscountAmt) || 0,

//     CGSTPercentage:
//       parseFloat(row.CGSTPercentage) || 0,

//     CGSTAmount:
//       parseFloat(row.CGSTAmount) || 0,

//     SGSTPercentage:
//       parseFloat(row.SGSTPercentage) || 0,

//     SGSTAmount:
//       parseFloat(row.SGSTAmount) || 0,

//     IGSTPercentage:
//       parseFloat(row.IGSTPercentage) || 0,

//     IGSTAmount:
//       parseFloat(row.IGSTAmount) || 0,
//   })),
// };

//     console.log(
//       "PRINT DATA:",
//       printData
//     );

//     // ======================================================
//     // 19. SUCCESS MESSAGE
//     // ======================================================

//     toast.success(
//       isEditing
//         ? "Sales Entry- Dealer Updated successfully!"
//         : "Sales Entry- Dealer Created successfully!"
//     );

//     // ======================================================
//     // 20. PRINT ONLY IF REQUESTED
//     // ======================================================

//     if (
//       shouldPrint &&
//       printWindow
//     ) {
//       console.log(
//         "CALLING generatePDF..."
//       );

//       generatePDF(
//         printData,
//         printWindow
//       );
//     } else {
//       console.log(
//         "SAVE ONLY - PRINT NOT REQUESTED"
//       );
//     }

//     // ======================================================
//     // 21. CLOSE DRAWER
//     // ======================================================

//     setIsDrawerOpen(false);

//     // ======================================================
//     // 22. RESET FORM
//     // ======================================================

//     resetForm();

//     // ======================================================
//     // 23. REFRESH TABLE DATA
//     // ======================================================

//     await fetchInvoiceHeader();

//   } catch (error) {
//     // ======================================================
//     // ERROR
//     // ======================================================

//     console.error(
//       "Error submitting invoice:",
//       error
//     );

//     // ======================================================
//     // CLOSE PRINT WINDOW ON ERROR
//     // ======================================================

//     if (
//       printWindow &&
//       !printWindow.closed
//     ) {
//       printWindow.close();
//     }

//     setIsDrawerOpen(false);

//     toast.error(
//       isEditing
//         ? "Sales Entry- Dealer Updated unsuccessfully!"
//         : "Sales Entry- Dealer unsuccessfully!"
//     );

//   } finally {
//     // ======================================================
//     // RELEASE SUBMIT LOCK
//     // ======================================================

//     isSubmittingRef.current = false;

//     console.log(
//       "SUBMIT LOCK RELEASED"
//     );
//   }
// };

// // ======================================================
// // CTRL + S = SAVE ONLY
// // ======================================================

// useEffect(() => {
//   const handleCtrlS = (event) => {
//     if (
//       event.ctrlKey &&
//       event.key.toLowerCase() === "s"
//     ) {
//       event.preventDefault();
//       event.stopPropagation();

//       if (!isDrawerOpen) {
//         return;
//       }

//       if (event.repeat) {
//         return;
//       }

//       console.log("CTRL + S PRESSED - SAVE ONLY");

//       handleSubmit(event, false);
//     }
//   };

//   window.addEventListener(
//     "keydown",
//     handleCtrlS,
//     true
//   );

//   return () => {
//     window.removeEventListener(
//       "keydown",
//       handleCtrlS,
//       true
//     );
//   };
// }, [isDrawerOpen]);

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
// const received =
//   parseFloat(receivedAmount) || 0;

// const grandTotal =
//   parseFloat(total) || 0;

// // Current bill due
// const balanceDue = Math.max(
//   grandTotal - received,
//   0
// );

// // Refund
// const refund = Math.max(
//   received - grandTotal,
//   0
// );

// // Total customer outstanding
// const customerOutstanding =
//   Number(previousBalanceDue || 0) +
//   Number(balanceDue || 0);

// // ======================================================
// // PAYMENT STATUS
// // ======================================================

// const isPaid =
//   balanceDue === 0 && received > 0;
  

// const handleReceivedAmountChange = (e) => {
//   const value = e.target.value;

//   // Empty value
//   if (value === "") {
//     setReceivedAmount("");

//     if (paymentMode === "C") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }

//     if (paymentMode === "O") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }

//     // Mix मध्ये Cash + Online manually enter होतात
//     return;
//   }

//   const receivedValue = parseFloat(value);

//   // Negative amount not allowed
//   if (receivedValue < 0) {
//     return;
//   }

//   // Main Received Amount
//   setReceivedAmount(value);

//   // Cash payment
//   if (paymentMode === "C") {
//     setCashAmount(value);
//     setOnlineAmount("");
//   }

//   // Online payment
//   if (paymentMode === "O") {
//     setOnlineAmount(value);
//     setCashAmount("");
//   }

//   // Mix payment
//   // Cash + Online manually enter होतात
// };


// const validateReceivedAmount = () => {
//   const receivedValue = parseFloat(receivedAmount);
//   const totalValue = parseFloat(total) || 0;

//   // Received Amount रिकामा असल्यास
//   if (
//     receivedAmount === "" ||
//     Number.isNaN(receivedValue)
//   ) {
//     toast.error(
//       `Please enter received amount ₹${totalValue.toFixed(2)}`
//     );

//     receivedAmountRef.current?.focus();
//     receivedAmountRef.current?.select();

//     return false;
//   }

//   // Negative amount
//   if (receivedValue < 0) {
//     toast.error("Received amount cannot be negative.");

//     receivedAmountRef.current?.focus();
//     receivedAmountRef.current?.select();

//     return false;
//   }

//   // Received > Current Bill Total
//   if (receivedValue > totalValue) {
//     const refundAmount =
//       receivedValue - totalValue;

//     toast.error(
//       `Received amount ₹${receivedValue.toFixed(
//         2
//       )} is greater than bill total ₹${totalValue.toFixed(
//         2
//       )}. Refund ₹${refundAmount.toFixed(
//         2
//       )} cannot be saved.`
//     );

//     receivedAmountRef.current?.focus();
//     receivedAmountRef.current?.select();

//     return false;
//   }

//   // Received <= Total is allowed
//   return true;
// };


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

//     if (splitTotal !== received) {
//       toast.error(`Cash + Online amount must be ₹${received.toFixed(2)}`);

//       return false;
//     }

//     return true;
//   };

  

//   const calculations = () => {
//     // =========================
//     // SUBTOTAL
//     // =========================

//     const subtotal = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.Amount) || 0),
//       0,
//     );

//     setSubTotalCal(subtotal.toFixed(2));

//     // =========================
//     // GST TOTALS
//     // Keep internally for backend
//     // =========================

//     const totalCGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
//       0,
//     );

//     setCgstTotal(totalCGST.toFixed(2));

//     const totalSGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
//       0,
//     );

//     setSgstTotal(totalSGST.toFixed(2));

//     const totalIGST = rows.reduce(
//       (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
//       0,
//     );

//     setIgstTotal(totalIGST.toFixed(2));

//     // =========================
//     // DISCOUNT
//     // =========================

//     const discountValue = parseFloat(discount) || 0;

//     // =========================
//     // TRANSPORT
//     // =========================

//     const transportValue = parseFloat(transport) || 0;

//     // =========================
//     // FINAL TOTAL
//     // =========================

//     const totalBeforeDiscount = subtotal;

//     const afterDiscount = Math.max(totalBeforeDiscount - discountValue, 0);

//     const grandTotal = afterDiscount + transportValue;

//     setTotal(grandTotal.toFixed(2));
//   };

//   useEffect(() => {
//     calculations();
//   }, [rows, transport, discount]);
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

//   const [editingRow, setEditingRow] = useState(null);

//   const handleEditRow = (index) => {
//     const row = rows[index];

//     setEditingRow(index);

//     setSelectedProductId(row.ProductId);
//     setProductName(row.ProductName);

//     const q = row.Quantity || "";
//     const r = row.Rate || "";

//     setQuantity(q);
//     setRate(r);

//     const qtyNum = parseFloat(q) || 0;
//     const rateNum = parseFloat(r) || 0;

//     const baseAmt = qtyNum * rateNum;

//     setBaseAmount(baseAmt);
//     SetAmount(baseAmt);

//     setCGST(row.CGSTPercentage || 0);
//     setSGST(row.SGSTPercentage || 0);
//     setIGST(row.IGSTPercentage || 0);

//     calculateCgstAmount(row.CGSTPercentage || 0, baseAmt);

//     calculateSgstAmount(row.SGSTPercentage || 0, baseAmt);

//     calculateIgstAmount(row.IGSTPercentage || 0, baseAmt);
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

//   const handleProductKeyDown = (event) => {
//     if (event.key !== "Enter") {
//       return;
//     }

//     event.preventDefault();
//     event.stopPropagation();

//     // Product validation
//     if (!selectedProductID) {
//       toast.error("Please select a product.");
//       return;
//     }

//     // Quantity validation
//     if (!quantity || Number(quantity) <= 0) {
//       toast.error("Please enter quantity.");
//       quantityRef.current?.focus();
//       return;
//     }

//     // Rate validation
//     if (!rate || Number(rate) <= 0) {
//       toast.error("Please enter rate.");
//       rateRef.current?.focus();
//       return;
//     }

//     // Add / update row
//     handleSaveOrAddRow();

//     // After row is added, focus Product field
//     setTimeout(() => {
//       productRef.current?.focus();
//     }, 0);
//   };

// const handleSaveOrAddRow = () => {
//   // ==============================
//   // 1. PRODUCT VALIDATION
//   // ==============================
//   if (!selectedProductID) {
//     alert("Please select a product before adding the row.");
//     return;
//   }

//   // ==============================
//   // 2. QUANTITY
//   // ==============================
//   const finalQuantity = parseFloat(quantity) || 1;

//   // ==============================
//   // 3. RATE
//   // ==============================
//   const finalRate = parseFloat(rate) || 0;

//   // ==============================
//   // 4. AMOUNT
//   // ==============================
//   const finalAmount = finalQuantity * finalRate;

//   // ==============================
//   // 5. SELECTED PRODUCT
//   // ==============================
//   const selectedOption = productOptions.find(
//     (option) =>
//       String(option.value) === String(selectedProductID)
//   );

//   const finalProductName =
//     productName ||
//     selectedProductName ||
//     selectedOption?.label ||
//     "";

//   // ==============================
//   // 6. GST VALUES
//   // Keep internally for backend
//   // ==============================
//   const finalCGST = parseFloat(cgst) || 0;
//   const finalCGSTAmount = parseFloat(cgstAmount) || 0;

//   const finalSGST = parseFloat(sgst) || 0;
//   const finalSGSTAmount = parseFloat(sgstAmount) || 0;

//   const finalIGST = parseFloat(igst) || 0;
//   const finalIGSTAmount = parseFloat(igstAmount) || 0;

//   // ==============================
//   // 7. DISCOUNT
//   // ==============================
//   const finalDiscount =
//     discount !== ""
//       ? parseFloat(discount) || 0
//       : 0;

//   // ==============================
//   // 8. EDIT EXISTING ROW
//   // ==============================
//   if (editingRow !== null) {
//     setRows((prevRows) =>
//       prevRows.map((row, index) => {
//         if (index !== editingRow) {
//           return row;
//         }

//         return {
//           ...row,

//           ProductId: selectedProductID,

//           ProductName: finalProductName,

//           Quantity: finalQuantity,

//           Rate: finalRate,

//           Amount: finalAmount,

//           // Internal GST values
//           CGSTPercentage: finalCGST,
//           CGSTAmount: finalCGSTAmount,

//           SGSTPercentage: finalSGST,
//           SGSTAmount: finalSGSTAmount,

//           IGSTPercentage: finalIGST,
//           IGSTAmount: finalIGSTAmount,

//           DiscountAmt: finalDiscount,
//         };
//       })
//     );

//     toast.success("Product row updated.");
//   }

//   // ==============================
//   // 9. ADD NEW ROW
//   // ==============================
//   else {
//     const newRow = {
//       Id: null,

//       InvoiceId: editId || null,

//       ProductId: selectedProductID,

//       ProductName: finalProductName,

//       Quantity: finalQuantity,

//       Rate: finalRate,

//       Amount: finalAmount,

//       // Internal GST values
//       CGSTPercentage: finalCGST,
//       CGSTAmount: finalCGSTAmount,

//       SGSTPercentage: finalSGST,
//       SGSTAmount: finalSGSTAmount,

//       IGSTPercentage: finalIGST,
//       IGSTAmount: finalIGSTAmount,

//       DiscountAmt: finalDiscount,
//     };

//     setRows((prevRows) => [
//       ...prevRows,
//       newRow,
//     ]);

//     toast.success("Product added.");
//   }

//   // ==============================
//   // 10. CLEAR ONLY PRODUCT INPUT
//   // ==============================
//   resetFields();
//   setEditingRow(null);
// };

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

//   // ======================================================
// // ESC = GO ONE STEP BACK
// // ======================================================
// useEffect(() => {
//   if (!isDrawerOpen) return;

//   const handleEscBack = (event) => {
//     if (event.key !== "Escape") return;

//     const activeElement = document.activeElement;

//     event.preventDefault();
//     event.stopPropagation();

//     // Received Amount -> Discount
//     if (receivedAmountRef.current === activeElement) {
//       setTimeout(() => {
//         discountRef.current?.focus();
//         discountRef.current?.select();
//       }, 50);
//       return;
//     }

//     // Discount -> Payment Mode
//     if (discountRef.current === activeElement) {
//       setTimeout(() => {
//         document.querySelector(
//           '[name="paymentMode"]'
//         )?.focus();
//       }, 50);
//       return;
//     }

//     // Payment Mode -> Quantity
//     if (activeElement?.name === "paymentMode") {
//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 50);
//       return;
//     }

//     // Quantity -> Product
//     if (quantityRef.current === activeElement) {
//       setTimeout(() => {
//         productRef.current?.focus();
//       }, 50);
//       return;
//     }

//     // Product -> Customer
//     if (productRef.current === activeElement) {
//       setTimeout(() => {
//         const customerInput = document.querySelector(
//           'input[placeholder="Select Customer"]'
//         );

//         customerInput?.focus();
//       }, 50);
//       return;
//     }
//   };

//   window.addEventListener("keydown", handleEscBack, true);

//   return () => {
//     window.removeEventListener("keydown", handleEscBack, true);
//   };
// }, [isDrawerOpen]);


//   const [text, setText] = useState("");

//   const customerDropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         customerDropdownRef.current &&
//         !customerDropdownRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//         setText("");
//       }
//     };

//     if (!showDropdown) {
//       return;
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDropdown]);

//   const serchCustomers = async () => {
//     try {
//       // Search रिकामी असेल तर list clear करा
//       if (!text.trim()) {
//         setAccountOptions([]);
//         return;
//       }

//       // 1. Search Account
//       const response = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${encodeURIComponent(text)}`,
//         {
//           method: "GET",
//           redirect: "follow",
//         },
//       );

//       const result = await response.json();

//       console.log("ACCOUNT SEARCH RESPONSE:", result);

//       if (!Array.isArray(result)) {
//         setAccountOptions([]);
//         return;
//       }

//       // 2. प्रत्येक account चा Address / CustomerType fetch करा
//       const dealerCustomers = [];

//       for (const customer of result) {
//         try {
//           const addressResponse = await fetch(
//             `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customer.Id}`,
//             {
//               method: "GET",
//               redirect: "follow",
//             },
//           );

//           const addressResult = await addressResponse.json();

//           console.log(`Address for ${customer.AccountName}:`, addressResult);

//           const address = Array.isArray(addressResult)
//             ? addressResult[0]
//             : null;

//           // 3. फक्त Dealer घ्या
//           if (address && String(address.CustomerType).toUpperCase() === "D") {
//             dealerCustomers.push({
//               ...customer,

//               CustomerType: address.CustomerType,

//               GSTNo: address.GSTNo || "",

//               Address1:
//                 address.Address1 ||
//                 address.address1 ||
//                 address.Address ||
//                 address.address ||
//                 address.AddressLine1 ||
//                 address.addressLine1 ||
//                 "",

//               Address2:
//                 address.Address2 ||
//                 address.address2 ||
//                 address.AddressLine2 ||
//                 address.addressLine2 ||
//                 "",

//               Address3:
//                 address.Address3 ||
//                 address.address3 ||
//                 address.AddressLine3 ||
//                 address.addressLine3 ||
//                 "",
//             });
//           }
//         } catch (addressError) {
//           console.error(
//             `Address fetch failed for AccountId ${customer.Id}:`,
//             addressError,
//           );
//         }
//       }

//       console.log("DEALER CUSTOMERS:", dealerCustomers);

//       // 4. फक्त Dealer records dropdown ला द्या
//       setAccountOptions(dealerCustomers);
//     } catch (error) {
//       console.error("Dealer customer search error:", error);

//       setAccountOptions([]);
//     }
//   };

//   useEffect(() => {
//     serchCustomers();
//   }, [text]);

//   // create new Customer
//   const [accountName, setAccountName] = useState("");
//   const [customerName, setCustomerName] = useState("");
  

//   const CreateCustomerMaster = async () => {
//     // ============================================================
//     // DEALER NAME
//     // ============================================================

//     const newCustomerName = accountName.trim();

//     if (!newCustomerName) {
//       toast.error("Please enter dealer name");
//       return;
//     }

//     // ============================================================
//     // DEALER ADDRESS
//     // ============================================================

//     const newAddress = newCustomerAddress.trim();

//     const myHeaders = new Headers();

//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     // ============================================================
//     // CREATE DEALER ACCOUNT
//     // ============================================================

//     const urlencoded = new URLSearchParams();

//     urlencoded.append("AccountName", newCustomerName);

//     urlencoded.append("GroupId", "3");

//     urlencoded.append("SubGroupId", "1");

//     urlencoded.append("OpeningBalance", "100");

//     urlencoded.append("DrORCr", "D");

//     urlencoded.append("TypeCode", "C");

//     urlencoded.append("IsSystem", "false");

//     try {
//       // ==========================================================
//       // 1. CREATE ACCOUNT
//       // ==========================================================

//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: urlencoded,
//           redirect: "follow",
//         },
//       );

//       const result = await response.json();

//       console.log("Dealer Created:", result);

//       if (!result || !result.Id) {
//         throw new Error("Dealer ID not received from API.");
//       }

//       // ==========================================================
//       // 2. CREATE ADDRESS
//       // ==========================================================

//       const addressData = new URLSearchParams();

//       addressData.append("AccountId", result.Id);

//       // Dealer
//       addressData.append("CustomerType", "D");

//       // Keep GST in database
//       // It will NOT be printed on invoice
//       addressData.append("GSTNo", "270000000000000");

//       addressData.append("Address1", newAddress);

//       addressData.append("Address", newAddress);

//       const addressResponse = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: addressData,
//           redirect: "follow",
//         },
//       );

//       const addressResult = await addressResponse.json();

//       console.log("Dealer Address Created:", addressResult);

//       // ==========================================================
//       // 3. CREATE LOCAL DEALER OBJECT
//       // ==========================================================

//       const newDealer = {
//         Id: result.Id,

//         AccountName: newCustomerName,

//         CustomerType: "D",

//         GSTNo: "270000000000000",

//         Address1: newAddress,

//         Address: newAddress,
//       };

//       // ==========================================================
//       // 4. ADD DEALER TO CURRENT DROPDOWN
//       // ==========================================================

//       setAccountOptions((previousOptions) => {
//         const alreadyExists = previousOptions.some(
//           (dealer) => String(dealer.Id) === String(result.Id),
//         );

//         if (alreadyExists) {
//           return previousOptions;
//         }

//         return [newDealer, ...previousOptions];
//       });

//       // ==========================================================
//       // 5. SELECT NEW DEALER IMMEDIATELY
//       // ==========================================================

//       setSelectedAccount(String(result.Id));

//       setSelectedCustomerName(newCustomerName);

//       setSelectedCustomerAddress(newAddress);

//       setPreviousBalanceDue(0);

//       // ==========================================================
//       // 6. SUCCESS MESSAGE
//       // ==========================================================

//       toast.success("Dealer created successfully");

//       // ==========================================================
//       // 7. CLOSE CUSTOMER POPUP
//       // ==========================================================

//       setShowDropdown(false);

//       // ==========================================================
//       // 8. CLEAR INPUTS
//       // ==========================================================

//       setAccountName("");

//       setNewCustomerAddress("");

//       setText("");
//     } catch (error) {
//       console.error("Error creating dealer:", error);

//       toast.error("Error creating dealer");
//     }
//   };
//   //set GSTno
//   const fetchAccounts = (customerId) => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`,
//       requestOptions,
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         const temp = Array.isArray(result) ? result[0] : null;

//         console.log("GST DATA:", temp?.GSTNo);

//         setacctGSTNo(String(temp?.GSTNo ?? ""));
//       })
//       .catch((error) => {
//         console.error("GST fetch error:", error);
//         setacctGSTNo("");
//       });
//   };


//   // ======================================================
// // FETCH SELECTED CUSTOMER CONTACT NUMBER
// // ======================================================
// const fetchCustomerContact = async (customerId) => {
//   try {
//     if (!customerId) {
//       setPhone("");
//       return;
//     }

//     const response = await fetch(
//       `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//         customerId
//       )}`
//     );

//     if (!response.ok) {
//       throw new Error(`Account API failed with status ${response.status}`);
//     }

//     const result = await response.json();

//     console.log("SELECTED CUSTOMER ACCOUNT RESPONSE:", result);

//     const accountData = Array.isArray(result)
//       ? result[0]
//       : result;

//     if (!accountData) {
//       setPhone("");
//       return;
//     }

//     const contactNo =
//       accountData?.MobileNo ||
//       accountData?.MobileNumber ||
//       accountData?.ContactNo ||
//       accountData?.ContactNumber ||
//       accountData?.PhoneNo ||
//       accountData?.PhoneNumber ||
//       "";

//     console.log("SELECTED CUSTOMER CONTACT NO:", contactNo);

//     setPhone(String(contactNo));
//   } catch (error) {
//     console.error("CUSTOMER CONTACT FETCH ERROR:", error);
//     setPhone("");
//   }
// };



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

//       const defaultQty = 1;

//       const defaultRate = parseFloat(newValue.purchaseRate) || 0;

//       setQuantity(defaultQty);

//       setRate(defaultRate);

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 0);

//       const sameState =
//         String(gstNo || "").substring(0, 2) ===
//         String(acctGSTNo || "").substring(0, 2);

//       const cgstValue = sameState ? newValue.cgst : "0";

//       const sgstValue = sameState ? newValue.sgst : "0";

//       const igstValue = !sameState ? newValue.igst : "0";

//       setCGST(cgstValue);
//       setSGST(sgstValue);
//       setIGST(igstValue);

//       // Calculate current input amount
//       calculateAmount(defaultQty, defaultRate);
//     } else {
//       setSelectedProductId("");
//       setProductName("");
//       setRate("");
//       setQuantity("");
//       setSelectedProductName("");

//       setCGST("0");
//       setSGST("0");
//       setIGST("0");

//       SetAmount("");
//     }
//   };

//   ///Pagination
//   const [totalPages, setTotalPages] = useState(1);
//   //validation
// const [errors, setErrors] = useState({
//   invoiceDate: "",
//   selectedAccount: "",
//   paymentMode: "",
//   rows: "",
//   phone: "",
// });

//   const validateForm = () => {
//    const newErrors = {
//   invoiceDate: "",
//   selectedAccount: "",
//   paymentMode: "",
//   rows: "",
//   phone: "",
// };

//     let isValid = true;

//     // Invoice Date
//     if (!invoiceDate) {
//       newErrors.invoiceDate = "Invoice date is required";

//       isValid = false;
//     } else {
//       const invoiceDateObj = new Date(invoiceDate);

//       const fromDateObj = new Date(fromdate);

//       const toDateObj = new Date(todate);

//       if (invoiceDateObj < fromDateObj) {
//         newErrors.invoiceDate = `Invoice date cannot be before ${new Date(
//           fromdate,
//         ).toLocaleDateString()}`;

//         isValid = false;
//       } else if (invoiceDateObj > toDateObj) {
//         newErrors.invoiceDate = `Invoice date cannot be after ${new Date(
//           todate,
//         ).toLocaleDateString()}`;

//         isValid = false;
//       }
//     }

//   // Customer Name
// if (!selectedCustomerName?.trim()) {
//   newErrors.selectedAccount = "Customer name is required";
//   isValid = false;
// }

// // ==============================
// // MOBILE NUMBER VALIDATION
// // ==============================
// const mobileDigits = String(phone || "").replace(/\D/g, "");

// if (mobileDigits.length < 12) {
//   newErrors.phone = "Valid mobile number is required";
//   isValid = false;

//   toast.error(
//     "📱 Please enter a valid 10-digit mobile number to continue."
//   );
// }

//     // Payment Mode
//     if (!paymentMode) {
//       newErrors.paymentMode = "Payment mode is required";

//       isValid = false;
//     }

//     // Product rows
//     if (rows.length === 0) {
//       newErrors.rows = "Please add at least one product";

//       isValid = false;
//     }

//     setErrors(newErrors);

//     return isValid;
//   };

//   //for yearId
//   const [yearid, setYearId] = useState("");
//   const [fromdate, setFromDate] = useState("");
//   const [todate, setToDate] = useState("");

//   useEffect(() => {
//     const storedYearId = Cookies.get("YearId");
//     const storedfromdate = Cookies.get("FromDate");
//     const storedtodate = Cookies.get("ToDate");

//     if (storedYearId) {
//       setYearId(storedYearId);
//       //console.log('storedYearId', storedYearId);
//     } else {
//       toast.error("Year is not set.");
//     }
//     if (storedfromdate) {
//       setFromDate(storedfromdate);
//       //console.log('storedfromdate', storedfromdate);
//     } else {
//       toast.error("FromDate is not set.");
//     }

//     if (storedtodate) {
//       setToDate(storedtodate);
//       // console.log('storedTodate', storedtodate);
//     } else {
//       toast.error("ToDate is not set.");
//     }
//   }, [yearid, fromdate, todate]);

//   //for print

//   // ======================================================
//   // GENERATE PDF / DIRECT PRINT
//   // ======================================================

//   // ============================================================
//   // GENERATE PDF / DIRECT PRINT
//   // ============================================================

// const generatePDF = async (printData = previewData, printWindow = null) => {
//   // ============================================================
//   // 1. CHECK INVOICE DATA
//   // ============================================================

//   if (!printData) {
//     toast.error("No invoice data available for printing.");

//     if (printWindow && !printWindow.closed) {
//       printWindow.close();
//     }

//     return;
//   }

//   console.log("========================================");
//   console.log("INVOICE PRINT START");
//   console.log("PRINT DATA:", printData);
//   console.log("SELECTED ACCOUNT:", selectedAccount);
//   console.log("SELECTED CUSTOMER NAME:", selectedCustomerName);
//   console.log("========================================");

//   // ============================================================
//   // 2. GET ACCOUNT ID
//   // ============================================================

//   let accountId = "";

//   accountId =
//     printData?.AccountId ||
//     printData?.AccountID ||
//     printData?.CustomerId ||
//     printData?.CustomerID ||
//     printData?.CustomerAccountId ||
//     printData?.CustomerAccountID ||
//     printData?.accountDetails?.Id ||
//     printData?.accountDetails?.AccountId ||
//     "";

//   // ============================================================
//   // 3. IF ACCOUNT ID NOT FOUND, GET FROM selectedAccount
//   // ============================================================

//   if (!accountId && selectedAccount) {
//     if (typeof selectedAccount === "object") {
//       accountId =
//         selectedAccount?.Id ||
//         selectedAccount?.ID ||
//         selectedAccount?.AccountId ||
//         selectedAccount?.AccountID ||
//         selectedAccount?.CustomerId ||
//         selectedAccount?.CustomerID ||
//         selectedAccount?.value ||
//         selectedAccount?.id ||
//         "";
//     } else {
//       accountId = selectedAccount;
//     }
//   }

//   // ============================================================
//   // 4. IF STILL NOT FOUND, FIND ID FROM accountOptions
//   // ============================================================

//   if (
//     !accountId &&
//     Array.isArray(accountOptions) &&
//     selectedCustomerName
//   ) {
//     const matchedAccount = accountOptions.find(
//       (account) =>
//         String(
//           account?.AccountName ||
//             account?.accountName ||
//             account?.label ||
//             ""
//         )
//           .trim()
//           .toLowerCase() ===
//         String(selectedCustomerName).trim().toLowerCase()
//     );

//     if (matchedAccount) {
//       accountId =
//         matchedAccount?.Id ||
//         matchedAccount?.ID ||
//         matchedAccount?.AccountId ||
//         matchedAccount?.AccountID ||
//         matchedAccount?.value ||
//         matchedAccount?.id ||
//         "";
//     }
//   }

//   console.log("FINAL ACCOUNT ID:", accountId);

//   // ============================================================
//   // 5. CUSTOMER VARIABLES
//   // ============================================================

//   let customerName = "";
//   let customerAddress1 = "";
//   let customerAddress2 = "";
//   let customerAddress3 = "";
//   let customerGSTNo = "";
//   let customerMobileNo = "";

//   // ============================================================
//   // 6. FETCH SELECTED CUSTOMER FROM ACCOUNT API
//   // ============================================================

//   if (accountId) {
//     try {
//       const accountResponse = await fetch(
//         `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
//           accountId
//         )}`
//       );

//       if (!accountResponse.ok) {
//         throw new Error(
//           `Account API failed with status ${accountResponse.status}`
//         );
//       }

//      const accountResult = await accountResponse.json();

// console.log("FULL ACCOUNT API RESPONSE:", accountResult);

// const accountData = Array.isArray(accountResult)
//   ? accountResult[0]
//   : Array.isArray(accountResult?.data)
//   ? accountResult.data[0]
//   : accountResult?.data || accountResult;

// console.log("FINAL ACCOUNT DATA FOR PRINT:", accountData);

      

//       if (accountData) {
//         customerName =
//           accountData?.AccountName ||
//           accountData?.accountName ||
//           "";

//         customerAddress1 =
//           accountData?.Address1 ||
//           accountData?.address1 ||
//           "";

//         customerAddress2 =
//           accountData?.Address2 ||
//           accountData?.address2 ||
//           "";

//         customerAddress3 =
//           accountData?.Address3 ||
//           accountData?.address3 ||
//           "";

//         customerGSTNo =
//           accountData?.GSTNo ||
//           accountData?.GSTNO ||
//           accountData?.GstNo ||
//           "";

//         customerMobileNo =
//           accountData?.MobileNo ||
//           accountData?.MobileNumber ||
//           accountData?.ContactNo ||
//           accountData?.ContactNumber ||
//           accountData?.PhoneNo ||
//           accountData?.PhoneNumber ||
//           "";
//       }
//     } catch (error) {
//       console.error("CUSTOMER ACCOUNT API ERROR:", error);
//     }
//   } else {
//     console.warn(
//       "ACCOUNT ID NOT FOUND. Customer API was not called."
//     );
//   }

//   // ============================================================
//   // 7. FALLBACK CUSTOMER NAME
//   // ============================================================

//   if (!customerName) {
//     customerName =
//       printData?.accountDetails?.AccountName ||
//       printData?.accountDetails?.accountName ||
//       printData?.CustomerName ||
//       printData?.customerName ||
//       printData?.AccountName ||
//       printData?.CustomerAccountName ||
//       selectedCustomerName ||
//       "-";
//   }

//   // ============================================================
//   // 8. FALLBACK ADDRESS 1
//   // ============================================================

//   if (!customerAddress1) {
//     customerAddress1 =
//       printData?.accountDetails?.Address1 ||
//       printData?.Address1 ||
//       "";
//   }

//   // ============================================================
//   // 9. FALLBACK ADDRESS 2
//   // ============================================================

//   if (!customerAddress2) {
//     customerAddress2 =
//       printData?.accountDetails?.Address2 ||
//       printData?.Address2 ||
//       "";
//   }

//   // ============================================================
//   // 10. FALLBACK ADDRESS 3
//   // ============================================================

//   if (!customerAddress3) {
//     customerAddress3 =
//       printData?.accountDetails?.Address3 ||
//       printData?.Address3 ||
//       "";
//   }

//   // ============================================================
//   // 11. CONTACT NUMBER
//   // ============================================================

//   const contactNo =
//     customerMobileNo ||
//     printData?.ContactNo ||
//     printData?.ContactNumber ||
//     printData?.MobileNo ||
//     printData?.MobileNumber ||
//     printData?.PhoneNo ||
//     "-";

//   // ============================================================
//   // 12. GST NUMBER
//   // ============================================================

//   const gstNumber =
//     customerGSTNo ||
//     printData?.GSTNo ||
//     printData?.CustomerGSTNo ||
//     printData?.customerGSTNo ||
//     "";

//   // ============================================================
//   // 13. CUSTOMER DEBUG
//   // ============================================================

//   console.log("========================================");
//   console.log("FINAL CUSTOMER INFORMATION");
//   console.log("ACCOUNT ID:", accountId);
//   console.log("CUSTOMER NAME:", customerName);
//   console.log("ADDRESS 1:", customerAddress1);
//   console.log("ADDRESS 2:", customerAddress2);
//   console.log("ADDRESS 3:", customerAddress3);
//   console.log("MOBILE:", contactNo);
//   console.log("GST:", gstNumber);
//   console.log("========================================");

//   // ============================================================
//   // 14. CREATE 80MM ROLL PDF
//   // ============================================================

//   const ROLL_WIDTH = 80;
//   const ROLL_HEIGHT = 300;

//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: [ROLL_WIDTH, ROLL_HEIGHT],
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   // ============================================================
//   // 15. INVOICE NUMBER
//   // ============================================================

//   const invoiceNo =
//     printData?.InvoiceNo ||
//     printData?.InvoiceNumber ||
//     printData?.BillNo ||
//     printData?.BillNumber ||
//     printData?.invoiceNo ||
//     "";

//   // ============================================================
//   // 16. DATE
//   // ============================================================

//   let invoiceDateText = "-";

//   try {
//     if (printData?.InvoiceDate?.date) {
//       invoiceDateText = moment(
//         printData.InvoiceDate.date
//       ).format("DD-MM-YYYY");
//     } else if (printData?.InvoiceDate) {
//       invoiceDateText = moment(
//         printData.InvoiceDate
//       ).format("DD-MM-YYYY");
//     }
//   } catch (error) {
//     console.error(
//       "Invoice date formatting error:",
//       error
//     );

//     invoiceDateText = "-";
//   }

//   // ============================================================
//   // 17. TIME
//   // ============================================================

//   const invoiceTime = moment().format("hh:mm A");

//   // ============================================================
//   // 18. COMPANY DETAILS
//   // ============================================================

//   const companyName = "AMRUT MILK PRODUCTS 2";
//   const companyAddress1 =
//     "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER";
//   const companyAddress2 = "KOLHAPUR.";
//   const companyPhone = "8830261523";
//   const companyState = "27-Maharashtra";

//   // ============================================================
//   // 19. LOAD IMAGE AS DATA URL
//   // ============================================================

//   const imageToDataURL = (imageSource) => {
//     return new Promise((resolve, reject) => {
//       if (!imageSource) {
//         reject(new Error("Image source is empty."));
//         return;
//       }

//       if (
//         typeof imageSource === "string" &&
//         imageSource.startsWith("data:image")
//       ) {
//         resolve(imageSource);
//         return;
//       }

//       const img = new Image();

//       img.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");

//           canvas.width =
//             img.naturalWidth || img.width;

//           canvas.height =
//             img.naturalHeight || img.height;

//           const ctx = canvas.getContext("2d");

//           ctx.drawImage(
//             img,
//             0,
//             0,
//             canvas.width,
//             canvas.height
//           );

//           resolve(
//             canvas.toDataURL("image/png")
//           );
//         } catch (error) {
//           reject(error);
//         }
//       };

//       img.onerror = () => {
//         reject(
//           new Error(
//             `Unable to load image: ${imageSource}`
//           )
//         );
//       };

//       img.src = imageSource;
//     });
//   };

//   // ============================================================
//   // 20. LOAD BOTH LOGOS
//   // ============================================================

//   let amrutLogoData = null;
//   let fremilaLogoData = null;

//   try {
//     amrutLogoData =
//       await imageToDataURL(amrutLogo);

//     console.log("Amrut Siddhi logo loaded.");
//   } catch (error) {
//     console.error(
//       "Amrut Siddhi logo error:",
//       error
//     );
//   }

//   try {
//     fremilaLogoData =
//       await imageToDataURL(fremilaLogo);

//     console.log("Fremila logo loaded.");
//   } catch (error) {
//     console.error(
//       "Fremila logo error:",
//       error
//     );
//   }

//   // ============================================================
//   // 21. ROLL PRINT MARGINS
//   // ============================================================

//   const leftMargin = 4;
//   const rightMargin = 4;

//   const contentWidth =
//     pageWidth -
//     leftMargin -
//     rightMargin;

//   // ============================================================
//   // 22. OUTER BORDER
//   // ============================================================

//   doc.setLineWidth(0.4);

//   doc.rect(
//     leftMargin,
//     4,
//     contentWidth,
//     pageHeight - 8
//   );

//   // ============================================================
//   // 23. HEADER
//   // ============================================================

//   let y = 11;

//   // ============================================================
//   // 23.1 AMRUT SIDDHI LOGO
//   // ============================================================

//   if (amrutLogoData) {
//     try {
//       doc.addImage(
//         amrutLogoData,
//         "PNG",
//         pageWidth - 25,
//         7,
//         18,
//         12
//       );
//     } catch (error) {
//       console.error(
//         "Amrut Siddhi PDF logo error:",
//         error
//       );
//     }
//   }

//   // ============================================================
//   // 23.2 FREMILA LOGO
//   // ============================================================

//   if (fremilaLogoData) {
//     try {
//       doc.addImage(
//         fremilaLogoData,
//         "PNG",
//         pageWidth - 25,
//         20,
//         18,
//         12
//       );
//     } catch (error) {
//       console.error(
//         "Fremila PDF logo error:",
//         error
//       );
//     }
//   }

//   // ============================================================
//   // 23.3 COMPANY NAME
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(9);

//   doc.text(
//     companyName,
//     leftMargin + 2,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 23.4 COMPANY ADDRESS 1
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "normal"
//   );

//   doc.setFontSize(5.5);

//   const companyAddressLines =
//     doc.splitTextToSize(
//       companyAddress1,
//       52
//     );

//   doc.text(
//     companyAddressLines,
//     leftMargin + 2,
//     y
//   );

//   y +=
//     companyAddressLines.length *
//     3.2;

//   // ============================================================
//   // 23.5 COMPANY ADDRESS 2
//   // ============================================================

//   doc.text(
//     companyAddress2,
//     leftMargin + 2,
//     y
//   );

//   y += 3.2;

//   // ============================================================
//   // 23.6 COMPANY PHONE
//   // ============================================================

//   doc.text(
//     `Phone no.: ${companyPhone}`,
//     leftMargin + 2,
//     y
//   );

//   y += 3.2;

//   // ============================================================
//   // 23.7 COMPANY STATE
//   // ============================================================

//   doc.text(
//     `State: ${companyState}`,
//     leftMargin + 2,
//     y
//   );

//   // ============================================================
//   // 24. TAX INVOICE
//   // ============================================================

//   y += 6;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(9);

//   doc.text(
//     "Tax Invoice",
//     pageWidth / 2,
//     y,
//     {
//       align: "center",
//     }
//   );

//   y += 5;

//   // ============================================================
//   // 25. HEADER LINE
//   // ============================================================

//   doc.setLineWidth(0.3);

//   doc.line(
//     leftMargin + 2,
//     y,
//     pageWidth - rightMargin - 2,
//     y
//   );

//   y += 5;

//   // ============================================================
//   // 26. BILL TO / INVOICE DETAILS
//   // ============================================================

//   const leftX = 6;
//   const rightX = 43;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(7);

//   doc.text(
//     "Bill To",
//     leftX,
//     y
//   );

//   doc.text(
//     "Invoice Details",
//     rightX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 27. CUSTOMER NAME
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(6.5);

//   const customerNameLines =
//     doc.splitTextToSize(
//       String(customerName || "-"),
//       34
//     );

//   doc.text(
//     customerNameLines,
//     leftX,
//     y
//   );

//   // ============================================================
//   // 28. INVOICE NUMBER
//   // ============================================================

//   doc.setFont(
//     "helvetica",
//     "normal"
//   );

//   doc.setFontSize(6);

//   doc.text(
//     `Invoice No.: ${invoiceNo || "-"}`,
//     rightX,
//     y
//   );

//   y += Math.max(
//     customerNameLines.length * 3.2,
//     4
//   );

//   // ============================================================
//   // 29. CUSTOMER ADDRESS 1
//   // ============================================================

//   if (customerAddress1) {
//     const address1Lines =
//       doc.splitTextToSize(
//         String(customerAddress1),
//         34
//       );

//     doc.text(
//       address1Lines,
//       leftX,
//       y
//     );

//     y +=
//       address1Lines.length *
//       3.2;
//   }

//   // ============================================================
//   // 30. DATE
//   // ============================================================

//   doc.text(
//     `Date: ${invoiceDateText}`,
//     rightX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 31. CUSTOMER ADDRESS 2
//   // ============================================================

//   if (customerAddress2) {
//     const address2Lines =
//       doc.splitTextToSize(
//         String(customerAddress2),
//         34
//       );

//     doc.text(
//       address2Lines,
//       leftX,
//       y
//     );

//     y +=
//       address2Lines.length *
//       3.2;
//   }

//   // ============================================================
//   // 32. TIME
//   // ============================================================

//   doc.text(
//     `Time: ${invoiceTime}`,
//     rightX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 33. CUSTOMER ADDRESS 3
//   // ============================================================

//   if (customerAddress3) {
//     const address3Lines =
//       doc.splitTextToSize(
//         String(customerAddress3),
//         34
//       );

//     doc.text(
//       address3Lines,
//       leftX,
//       y
//     );

//     y +=
//       address3Lines.length *
//       3.2;
//   }

//   // ============================================================
//   // 34. CONTACT NUMBER
//   // ============================================================

//   doc.text(
//     `Contact No.: ${contactNo}`,
//     leftX,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 36. LINE BEFORE TABLE
//   // ============================================================

//   y += 2;

//   doc.line(
//     leftMargin + 2,
//     y,
//     pageWidth - rightMargin - 2,
//     y
//   );

//   y += 4;

//   // ============================================================
//   // 37. INVOICE DETAILS
//   // ============================================================

//   const invoiceDetails =
//     Array.isArray(printData?.invdetail)
//       ? printData.invdetail
//       : [];

//   // ============================================================
//   // 38. PRODUCT TABLE DATA
//   // ============================================================

//   const tableData =
//     invoiceDetails.map(
//       (item, index) => {
//         const matchedProduct =
//           Array.isArray(productOptions)
//             ? productOptions.find(
//                 (option) =>
//                   String(
//                     option?.value
//                   ) ===
//                   String(
//                     item?.ProductId
//                   )
//               )
//             : null;

//         const productName =
//           item?.ProductName ||
//           item?.productName ||
//           matchedProduct?.label ||
//           "Unknown";

//         const hsnSac =
//           item?.HSNSAC ||
//           item?.HsnSac ||
//           item?.HSNCode ||
//           item?.HsnCode ||
//           item?.HSN ||
//           item?.SAC ||
//           item?.SACCode ||
//           "";

//         const quantity =
//           Number(
//             item?.Quantity || 0
//           );

//         const rate =
//           Number(
//             item?.Rate || 0
//           );

//         const amount =
//           Number(
//             item?.Amount || 0
//           );

//         return [
//           index + 1,
//           productName,
//           hsnSac,
//           quantity.toFixed(2),
//           rate.toFixed(2),
//           amount.toFixed(2),
//         ];
//       }
//     );

//   // ============================================================
//   // 39. PRODUCT TABLE
//   // ============================================================

//   autoTable(doc, {
//     head: [
//       [
//         "#",
//         "Item",
//         "HSN",
//         "Qty",
//         "Rate",
//         "Amount",
//       ],
//     ],

//     body:
//       tableData.length > 0
//         ? tableData
//         : [
//             [
//               "",
//               "No items",
//               "",
//               "",
//               "",
//               "",
//             ],
//           ],

//     startY: y,

//     margin: {
//       left: 6,
//       right: 6,
//     },

//     tableWidth: 68,

//     theme: "grid",

//     styles: {
//       font: "helvetica",
//       fontSize: 5.2,
//       cellPadding: 1,
//       lineWidth: 0.2,
//       textColor: 0,
//       valign: "middle",
//       overflow: "linebreak",
//     },

//     headStyles: {
//       font: "helvetica",
//       fontSize: 5.2,
//       fontStyle: "bold",
//       fillColor: [240, 240, 240],
//       textColor: 0,
//       halign: "center",
//       valign: "middle",
//     },

//     columnStyles: {
//       0: {
//         cellWidth: 5,
//         halign: "center",
//       },

//       1: {
//         cellWidth: 25,
//         halign: "left",
//       },

//       2: {
//         cellWidth: 10,
//         halign: "center",
//       },

//       3: {
//         cellWidth: 8,
//         halign: "right",
//       },

//       4: {
//         cellWidth: 10,
//         halign: "right",
//       },

//       5: {
//         cellWidth: 10,
//         halign: "right",
//       },
//     },
//   });

//   // ============================================================
//   // 40. TOTAL QUANTITY
//   // ============================================================

//   const totalQuantity =
//     invoiceDetails.reduce(
//       (sum, item) =>
//         sum +
//         Number(
//           item?.Quantity || 0
//         ),
//       0
//     );

//   // ============================================================
//   // 41. SUB TOTAL
//   // ============================================================

//   const subTotal =
//     Number(
//       printData?.SubTotal || 0
//     );

//   // ============================================================
//   // 42. GRAND TOTAL
//   // ============================================================

//   const grandTotal =
//     Number(
//       printData?.Total || 0
//     );

//   // ============================================================
//   // 43. RECEIVED AMOUNT
//   // ============================================================

//   const savedReceivedAmount =
//     parseFloat(
//       printData?.ReceivedAmount
//     );

//   const receivedAmount =
//     !Number.isNaN(
//       savedReceivedAmount
//     )
//       ? savedReceivedAmount
//       : (parseFloat(
//           printData?.CashAmount
//         ) || 0) +
//         (parseFloat(
//           printData?.OnlineAmount
//         ) || 0);




// // ============================================================
// // 44. PREVIOUS / CURRENT / TOTAL OUTSTANDING
// // ============================================================

// const previousDue = Number(
//   printData?.PreviousBalanceDue || 0
// );

// const currentBillDue = Math.max(
//   grandTotal - receivedAmount,
//   0
// );

// const totalOutstanding =
//   previousDue + currentBillDue;

// const refund = Math.max(
//   receivedAmount - grandTotal,
//   0
// );

//   // ============================================================
// // 45. TOTAL ROW
// // ============================================================
// // ONLY TOTAL ROW SHOULD BE DISPLAYED
// // Previous Due / Current Bill Due / Total Outstanding
// // are intentionally removed from the PDF.

// y =
//   doc.lastAutoTable?.finalY
//     ? doc.lastAutoTable.finalY + 4
//     : y + 4;

// autoTable(doc, {
//   body: [
//     [
//       "",
//       "Total",
//       "",
//       totalQuantity.toFixed(2),
//       "",
//       `Rs. ${grandTotal.toFixed(2)}`,
//     ],
//   ],

//   startY: y,

//   margin: {
//     left: 6,
//     right: 6,
//   },

//   tableWidth: 68,

//   theme: "grid",

//   styles: {
//     font: "helvetica",
//     fontSize: 5.3,
//     cellPadding: 1,
//     fontStyle: "bold",
//     lineWidth: 0.2,
//     valign: "middle",
//   },

//   columnStyles: {
//     0: {
//       cellWidth: 5,
//     },

//     1: {
//       cellWidth: 25,
//     },

//     2: {
//       cellWidth: 10,
//     },

//     3: {
//       cellWidth: 8,
//       halign: "right",
//     },

//     4: {
//       cellWidth: 10,
//     },

//     5: {
//       cellWidth: 10,
//       halign: "right",
//     },
//   },
// });
//   // ============================================================
//   // 46. NUMBER TO WORDS
//   // ============================================================

//   const numberToWords = (num) => {
//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];

//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const convertBelowThousand =
//       (number) => {
//         let result = "";

//         if (number >= 100) {
//           result +=
//             ones[
//               Math.floor(
//                 number / 100
//               )
//             ] +
//             " Hundred ";

//           number %= 100;
//         }

//         if (number >= 20) {
//           result +=
//             tens[
//               Math.floor(
//                 number / 10
//               )
//             ] +
//             " ";

//           number %= 10;
//         }

//         if (number > 0) {
//           result +=
//             ones[number] +
//             " ";
//         }

//         return result.trim();
//       };

//     if (num === 0) {
//       return "Zero";
//     }

//     num = Math.floor(num);

//     let result = "";

//     if (num >= 10000000) {
//       result +=
//         convertBelowThousand(
//           Math.floor(
//             num / 10000000
//           )
//         ) +
//         " Crore ";

//       num %= 10000000;
//     }

//     if (num >= 100000) {
//       result +=
//         convertBelowThousand(
//           Math.floor(
//             num / 100000
//           )
//         ) +
//         " Lakh ";

//       num %= 100000;
//     }

//     if (num >= 1000) {
//       result +=
//         convertBelowThousand(
//           Math.floor(
//             num / 1000
//           )
//         ) +
//         " Thousand ";

//       num %= 1000;
//     }

//     if (num > 0) {
//       result +=
//         convertBelowThousand(num);
//     }

//     return result.trim();
//   };

//   // ============================================================
//   // 47. AMOUNT IN WORDS
//   // ============================================================

//   const amountInWords =
//     `${numberToWords(
//       grandTotal
//     )} Rupees only`;

//   // ============================================================
//   // 48. SUMMARY TABLE
//   // ============================================================

//   y =
//     doc.lastAutoTable?.finalY
//       ? doc.lastAutoTable.finalY + 4
//       : y + 4;

// autoTable(doc, {
//   body: [
//     // ============================================================
//     // 1. SUB TOTAL
//     // ============================================================
//     [
//       {
//         content: "Invoice Amount In Words",
//         styles: {
//           fontStyle: "bold",
//         },
//       },

//       {
//         content: "Sub Total",
//         styles: {
//           fontStyle: "bold",
//         },
//       },

//       `Rs. ${subTotal.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 2. TOTAL
//     // ============================================================
//     [
//       amountInWords,
//       "Total",
//       `Rs. ${grandTotal.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 3. RECEIVED
//     // ============================================================
//     [
//       "",
//       "Received",
//       `Rs. ${receivedAmount.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 4. PREVIOUS CUSTOMER DUE
//     // ============================================================
//     [
//       "",
//       "Previous Due",
//       `Rs. ${previousDue.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 5. CURRENT BILL DUE
//     // ============================================================
//     [
//       "",
//       "Current Bill Due",
//       `Rs. ${currentBillDue.toFixed(2)}`,
//     ],

//     // ============================================================
//     // 6. TOTAL CUSTOMER OUTSTANDING
//     // ============================================================
//     [
//       "",
//       "Total Outstanding",
//       `Rs. ${totalOutstanding.toFixed(2)}`,
//     ],
//   ],

//   // ============================================================
//   // TABLE POSITION
//   // ============================================================
//   startY: y,

//   margin: {
//     left: 6,
//     right: 6,
//   },

//   // ============================================================
//   // TABLE WIDTH
//   // ============================================================
//   tableWidth: 68,

//   theme: "grid",

//   // ============================================================
//   // GENERAL STYLES
//   // ============================================================
//   styles: {
//     font: "helvetica",
//     fontSize: 5.3,
//     cellPadding: 1.5,
//     lineWidth: 0.2,
//     valign: "middle",
//     overflow: "linebreak",
//   },

//   // ============================================================
//   // COLUMN WIDTHS
//   // ============================================================
//   columnStyles: {
//     0: {
//       cellWidth: 39,
//     },

//     1: {
//       cellWidth: 14,
//       fontStyle: "bold",
//     },

//     2: {
//       cellWidth: 15,
//       halign: "right",
//     },
//   },
// });

//   // ============================================================
//   // 49. TERMS
//   // ============================================================

//   y =
//     doc.lastAutoTable?.finalY
//       ? doc.lastAutoTable.finalY + 5
//       : y + 5;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.setFontSize(6.5);

//   doc.text(
//     "Terms And Conditions",
//     6,
//     y
//   );

//   y += 3.5;

//   doc.setFont(
//     "helvetica",
//     "normal"
//   );

//   doc.setFontSize(5.5);

//   doc.text(
//     "Thanks for doing business with us!",
//     6,
//     y
//   );

//   y += 7;

//   // ============================================================
//   // 50. AUTHORIZED SIGNATORY
//   // ============================================================

//   doc.setFontSize(6);

//   doc.text(
//     "For: AMRUT MILK PRODUCTS 2",
//     pageWidth / 2,
//     y,
//     {
//       align: "center",
//     }
//   );

//   y += 9;

//   doc.line(
//     pageWidth / 2 - 15,
//     y,
//     pageWidth / 2 + 15,
//     y
//   );

//   y += 3.5;

//   doc.setFont(
//     "helvetica",
//     "bold"
//   );

//   doc.text(
//     "Authorized Signatory",
//     pageWidth / 2,
//     y,
//     {
//       align: "center",
//     }
//   );

//   // ============================================================
//   // 51. PRINT PDF - 80MM ROLL
//   // ============================================================

//   try {
//     // ----------------------------------------------------------
//     // IMPORTANT:
//     // Mark PDF for printing.
//     // ----------------------------------------------------------

//     if (
//       typeof doc.autoPrint ===
//       "function"
//     ) {
//       doc.autoPrint();
//     }

//     // ----------------------------------------------------------
//     // Create PDF Blob
//     // ----------------------------------------------------------

//     const pdfBlob =
//       doc.output("blob");

//     // ----------------------------------------------------------
//     // Create temporary PDF URL
//     // ----------------------------------------------------------

//     const pdfBlobUrl =
//       URL.createObjectURL(
//         pdfBlob
//       );

//     console.log(
//       "========================================"
//     );
//     console.log(
//       "80MM ROLL PDF CREATED"
//     );
//     console.log(
//       "PDF URL:",
//       pdfBlobUrl
//     );
//     console.log(
//       "========================================"
//     );

//     // ----------------------------------------------------------
//     // OPEN DIRECT PDF
//     // ----------------------------------------------------------

//     if (
//       printWindow &&
//       !printWindow.closed
//     ) {
//       printWindow.location.href =
//         pdfBlobUrl;

//       printWindow.focus();
//     } else {
//       const newPrintWindow =
//         window.open(
//           pdfBlobUrl,
//           "_blank"
//         );

//       if (!newPrintWindow) {
//         toast.error(
//           "Please allow popups for printing."
//         );

//         URL.revokeObjectURL(
//           pdfBlobUrl
//         );

//         return;
//       }

//       newPrintWindow.focus();
//     }

//     // ----------------------------------------------------------
//     // Keep Blob URL alive
//     // ----------------------------------------------------------

//     setTimeout(() => {
//       URL.revokeObjectURL(
//         pdfBlobUrl
//       );
//     }, 60000);
//   } catch (error) {
//     console.error(
//       "Error generating invoice PDF:",
//       error
//     );

//     if (
//       printWindow &&
//       !printWindow.closed
//     ) {
//       printWindow.close();
//     }

//     toast.error(
//       "Unable to generate invoice PDF."
//     );
//   }
// };

//   return (
//     <Box>
      


// <Box
//   sx={{
//     p: 5,
//     height: "auto",
//   }}
// >

//   {/* ======================================================
//       CREATE SALES ENTRY BUTTON
//   ====================================================== */}
//   <Box
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       mb: 2,
//     }}
//   >
//     <Button
//       sx={{
//         background: "var(--complementary-color)",
//         fontWeight: "bold",
//         fontSize: "17px",
//         padding: "9px 20px",
//       }}
//       variant="contained"
//       onClick={handleNewClick}
//     >
//       CREATE SALES ENTRY - DEALER
//     </Button>
//   </Box>


//   {/* ======================================================
//       INVOICE FILTERS
//   ====================================================== */}

  
//       <Box
//     sx={{
//       display: "flex",
//       gap: 2,
//       alignItems: "center",
//       flexWrap: "wrap",
//       mt: 2,
//       mb: 2,
//     }}
//   >
//     {/* SEARCH */}
//     <TextField
//       size="small"
//       label="Search"
//       placeholder="Bill No / Customer / Category"
//       value={searchText}
//       onChange={(e) => setSearchText(e.target.value)}
//       sx={{ minWidth: 250 }}
//     />
  
//     {/* FROM DATE */}
// {/* FROM DATE */}
// <TextField
//   size="small"
//   type="date"
//   label="From Date"
//   value={filterFromDate}
//   onChange={(e) => setFilterFromDate(e.target.value)}
//   InputLabelProps={{
//     shrink: true,
//   }}
//   sx={{ minWidth: 160 }}
// />
    
    
  
//     {/* TO DATE */}
//    {/* TO DATE */}
// <TextField
//   size="small"
//   type="date"
//   label="To Date"
//   value={filterToDate}
//   onChange={(e) => setFilterToDate(e.target.value)}
//   InputLabelProps={{
//     shrink: true,
//   }}
//   sx={{ minWidth: 160 }}
// />
  
//     {/* CATEGORY */}
//     <TextField
//       select
//       size="small"
//       label="Category"
//       value={categoryFilter}
//       onChange={(e) => setCategoryFilter(e.target.value)}
//       sx={{ minWidth: 160 }}
//     >
//       <MenuItem value="">All</MenuItem>
//       <MenuItem value="R">Retailer</MenuItem>
//       <MenuItem value="D">Dealer</MenuItem>
//       <MenuItem value="C">Caterers</MenuItem>
//     </TextField>
  
//     {/* CLEAR */}
//     <Button
//       variant="outlined"
//       size="small"
//       onClick={() => {
//         setSearchText("");
//         setFromDate("");
//         setToDate("");
//         setCategoryFilter("");
//       }}
//     >
//       Clear
//     </Button>
//   </Box>


//   {/* ======================================================
//       TABLE
//   ====================================================== */}
//   <MaterialReactTable
//     columns={columns}
//     data={filteredInvoiceData}
//     enablePagination={false}
//     muiTableHeadCellProps={{
//       sx: {
//         backgroundColor: "#E9ECEF",
//         color: "black",
//         fontSize: "16px",
//       },
//     }}
         
//           renderBottomToolbarCustomActions={() => (
//             <Box
//               mt={2}
//               alignItems="center"
//               display="flex"
//               justifyContent="flex-end"
//               width="100%"
//             >
//               <FirstPageIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setPageNo(1)}
//               />
//               <KeyboardArrowLeftIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() =>
//                   setPageNo((prev) => Math.max(Number(prev) - 1, 1))
//                 }
//               />
//               <Box ml={1}> Page No </Box>
//               <TextField
//                 sx={{
//                   width: "4.5%",
//                   ml: 1,
//                   "@media (max-width: 768px)": {
//                     width: "10%",
//                   },
//                 }}
//                 value={pageNo}
//                 onChange={(e) => setPageNo(e.target.value)}
//                 size="small"
//               />
//               <KeyboardArrowRightIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setPageNo((prev) => Number(prev) + 1)}
//               />
//               <LastPageIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setPageNo(totalPages)}
//               />
//               <Box ml={1}>Total Pages: {totalPages}</Box>
//             </Box>
//           )}
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
//             <Typography sx={{ mt: 1 }}>
//               Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park
//               Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
//             </Typography>

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
//                       {new Date(
//                         previewData.InvoiceDate.date,
//                       ).toLocaleDateString()}
//                     </Typography>
//                   </Box>

//                   <Box
//                     display={"flex"}
//                     justifyContent={"space-between"}
//                     gap={2}
//                     mt={2}
//                   >
//                     <Box>
//                       <Typography>
//                         <strong>Order No:</strong> {previewData.OrderNo}
//                       </Typography>
//                     </Box>
//                     <Box>
//                       <Typography>
//                         <strong>Order Date:</strong>{" "}
//                         {new Date(
//                           previewData.OrderDate.date,
//                         ).toLocaleDateString()}
//                       </Typography>
//                     </Box>
//                     <Box>
//                       <Typography>
//                         <strong>Customer Name:</strong>{" "}
//                         {previewData.accountDetails.AccountName}
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

//                   <Grid container spacing={4}>
//                     <Grid item xs={12} md={8}>
//                       <Typography
//                         variant="h6"
//                         fontWeight="bold"
//                         gutterBottom
//                         mt={2}
//                       >
//                         Sales Details
//                       </Typography>

//                       <TableContainer
//                         component={Paper}
//                         elevation={2}
//                         sx={{ width: "100%", mt: 2 }}
//                       >
//                         <Table size="small">
//                         <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//   <TableRow>
//     <TableCell>
//       <strong>Material</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Quantity (Lit)</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Rate</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Discount</strong>
//     </TableCell>

//     <TableCell>
//       <strong>Amount (Rs)</strong>
//     </TableCell>
//   </TableRow>
// </TableHead>

// <TableBody>
//   {previewData.invdetail.map((item, index) => {
//     const materialName =
//       productOptions.find(
//         (opt) =>
//           opt.value?.toString() ===
//           item.ProductId?.toString()
//       )?.label || "Unknown";

//     return (
//       <TableRow key={index}>
//         <TableCell>{materialName}</TableCell>

//         <TableCell>
//           {item.Quantity}
//         </TableCell>

//         <TableCell>
//           {item.Rate}
//         </TableCell>

//         <TableCell>
//           {item.DiscountAmt || 0}
//         </TableCell>

//         <TableCell>
//           {item.Amount}
//         </TableCell>
//       </TableRow>
//     );
//   })}
// </TableBody>
                         

//                         </Table>

//                       </TableContainer>

//                    <TableContainer
//   component={Paper}
//   elevation={1}
//   sx={{ width: "100%", mt: 8 }}
// >
//   <Table size="small">
//     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//       <TableRow>
//         <TableCell>
//           <strong>Payment Mode</strong>
//         </TableCell>

//         <TableCell>
//           <strong>Transport Charge</strong>
//         </TableCell>
//       </TableRow>
//     </TableHead>

//     <TableBody>
//       <TableRow>
//         <TableCell>
//           {previewData.PaymentMode || "-"}
//         </TableCell>

//         <TableCell>
//           ₹ {Number(previewData.Transport || 0).toFixed(2)}
//         </TableCell>
//       </TableRow>
//     </TableBody>
//   </Table>
// </TableContainer>

//                     </Grid>

//                     {/* Summary Table */}

//                   <Grid item xs={12} md={4}>
//   <Typography
//     variant="h6"
//     fontWeight="bold"
//     gutterBottom
//     mt={2}
//   >
//     Amount Summary
//   </Typography>

//   <TableContainer
//     component={Paper}
//     elevation={2}
//     sx={{
//       mt: 2,
//       borderRadius: 2,
//     }}
//   >
//     <Table size="small">

//       <TableBody>

//         {/* =============================== */}
//         {/* SUBTOTAL */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Subtotal</strong>
//           </TableCell>

//           <TableCell align="right">
//             ₹ {Number(previewData?.SubTotal || 0).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* TRANSPORT */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Transport</strong>
//           </TableCell>

//           <TableCell align="right">
//             ₹ {Number(previewData?.Transport || 0).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* GRAND TOTAL */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Grand Total</strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#1976d2",
//             }}
//           >
//             ₹ {Number(previewData?.Total || 0).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* RECEIVED AMOUNT */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong>Received Amount</strong>
//           </TableCell>

//           <TableCell align="right">
//             <Typography sx={{ fontWeight: "bold" }}>
//               ₹ {Number(previewReceivedAmount || 0).toFixed(2)}
//             </Typography>
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* PREVIOUS CUSTOMER DUE */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong style={{ color: "#e65100" }}>
//               Previous Customer Due
//             </strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#e65100",
//             }}
//           >
//             ₹{" "}
//             {Number(
//               previewData?.PreviousBalanceDue || 0
//             ).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* CURRENT BILL DUE */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong style={{ color: "#d32f2f" }}>
//               Current Bill Due
//             </strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#d32f2f",
//             }}
//           >
//             ₹{" "}
//             {Number(
//               previewData?.CurrentInvoiceDue || 0
//             ).toFixed(2)}
//           </TableCell>
//         </TableRow>


//         {/* =============================== */}
//         {/* TOTAL CUSTOMER OUTSTANDING */}
//         {/* =============================== */}

//         <TableRow>
//           <TableCell>
//             <strong style={{ color: "#b71c1c" }}>
//               Total Customer Outstanding
//             </strong>
//           </TableCell>

//           <TableCell
//             align="right"
//             sx={{
//               fontWeight: "bold",
//               color: "#b71c1c",
//               fontSize: "18px",
//             }}
//           >
//             ₹{" "}
//             {Number(
//               previewData?.BalanceDue || 0
//             ).toFixed(2)}
//           </TableCell>
//         </TableRow>

//       </TableBody>

//     </Table>
//   </TableContainer>
// </Grid>

//                   </Grid>
//                 </Box>
//               ) : (
//                 <Typography>No data to preview</Typography>
//               )}
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={generatePDF} color="primary">
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

//               display: "flex",
//               flexDirection: "column",

//               overflow: "hidden",

//               "@media (max-width: 900px)": {
//                 width: "100%",
//                 maxWidth: "100%",
//               },
//             },
//           }}
//         >
//           {/* ===================================================== */}
//           {/* DRAWER HEADER */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               px: 2,
//               py: 1.5,
//               minHeight: 70,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "rgb(236, 253, 230)",
//               borderBottom: "1px solid #ddd",
//               flexShrink: 0,
//             }}
//           >
//             {/* TITLE */}

//             <Typography
//               fontWeight="bold"
//               variant="h6"
//               sx={{
//                 fontSize: {
//                   xs: "17px",
//                   sm: "20px",
//                 },
//               }}
//             >
//               {isEditing
//                 ? "Update Sales Entry - Dealer"
//                 : "Create Sales Entry - Dealer"}
//             </Typography>

//             {/* TOTAL / REFUND / CLOSE */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: {
//                   xs: 1,
//                   sm: 3,
//                 },
//               }}
//             >
//               {/* TOTAL */}

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "12px",
//                       sm: "16px",
//                     },
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   TOTAL :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "20px",
//                       sm: "30px",
//                     },
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
//                   gap: 0.5,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "12px",
//                       sm: "16px",
//                     },
//                     fontWeight: 700,
//                     color: "#555",
//                   }}
//                 >
//                   REFUND :
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: "20px",
//                       sm: "30px",
//                     },
//                     fontWeight: 900,
//                     color: "#087f23",
//                     lineHeight: 1,
//                   }}
//                 >
//                   ₹ {Number(refund || 0).toFixed(2)}
//                 </Typography>
//               </Box>

//               {/* CLOSE */}

//               <CloseIcon
//                 sx={{
//                   cursor: "pointer",
//                   fontSize: 28,
//                 }}
//                 onClick={handleDrawerCloseAndGoSalesEntry}
//               />
//             </Box>
//           </Box>

//           {/* ===================================================== */}
//           {/* DRAWER CONTENT */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               flex: 1,
//               minHeight: 0,

//               overflowY: "auto",
//               overflowX: "hidden",

//               scrollbarWidth: "none",

//               "&::-webkit-scrollbar": {
//                 display: "none",
//               },

//               p: {
//                 xs: 1,
//                 sm: 1.5,
//               },
//             }}
//           >
//             {/* ===================================================== */}
//             {/* INVOICE / DEVICE / DATE */}
//             {/* ===================================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 2,
//                 mb: 1.5,

//                 "@media (max-width: 900px)": {
//                   flexDirection: "column",
//                 },
//               }}
//             >
//               {/* INVOICE NO */}

//               <Box flex={1} width="100%">
//                 <Typography variant="body2">Invoice No</Typography>

//                <TextField
//   variant="standard"
//   sx={{
//     mt: 0.5,

//     "& .MuiInput-underline:after": {
//       borderBottomWidth: 1.5,
//       borderBottomColor: "#44ad74",
//     },
//   }}
//   focused
//   value={invoiceNo}
//   size="small"
//   margin="none"
//   placeholder="Invoice No Auto Generated"
//   fullWidth
//   InputProps={{
//     readOnly: true,
//   }}
// />
//               </Box>

//               {/* DEVICE */}

//               <Box flex={1} width="100%">
//                 <Typography variant="body2">Device</Typography>

//                 <TextField
//                   variant="standard"
//                   value={device}
//                   onChange={(e) => setDevice(e.target.value)}
//                   fullWidth
//                   size="small"
//                   sx={{
//                     mt: 0.5,
//                   }}
//                 />
//               </Box>

//               {/* INVOICE DATE */}

//               <Box flex={1} width="100%">
//                 <Typography variant="body2">Invoice Date</Typography>

//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     value={invoiceDate ? new Date(invoiceDate) : null}
//                     format="dd-MM-yyyy"
//                     onChange={(newValue) => {
//                       setInvoiceDate(newValue);

//                       setErrors({
//                         ...errors,
//                         invoiceDate: undefined,
//                       });
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
//                 alignItems: "flex-start",
//                 gap: 2,
//                 mb: 1.5,

//                 "@media (max-width: 900px)": {
//                   flexDirection: "column",
//                 },
//               }}
//             >
//               {/* CUSTOMER */}

//               <Box
//                 ref={customerDropdownRef}
//                 flex={1}
//                 width="100%"
//                 position="relative"
//               >
//                 <Typography variant="body2">Customer</Typography>

//                 {/* SELECTED CUSTOMER */}
//                 <TextField
//                   fullWidth
//                   variant="standard"
//                   size="small"
//                   value={selectedCustomerName || ""}
//                   placeholder="Select Customer"
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

//                     "& .MuiInput-underline:hover:before": {
//                       borderBottomColor: "#44ad74",
//                     },

//                     "& .MuiInput-underline:after": {
//                       borderBottomColor: "#1976d2",
//                     },
//                   }}
//                 />

//                 {/* SELECTED CUSTOMER ADDRESS */}
//                 {selectedCustomerAddress && (
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       mt: 0.5,
//                       color: "#555",
//                       fontSize: "13px",
//                     }}
//                   >
//                     {selectedCustomerAddress}
//                   </Typography>
//                 )}

//                 {/* CUSTOMER POPUP */}
//                 {showDropdown && (
//                   <Paper
//                     elevation={3}
//                     sx={{
//                       position: "absolute",
//                       top: "100%",
//                       left: 0,
//                       width: "100%",
//                       maxHeight: 350,
//                       overflowY: "auto",
//                       zIndex: 9999,
//                       mt: 1,
//                       p: 2,
//                     }}
//                   >
//                     {/* SEARCH CUSTOMER */}
//                     <TextField
//                       autoFocus
//                       value={text}
//                       onChange={(e) => {
//                         setText(e.target.value);
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();
// if (accountOptions.length > 0) {
//   const option = accountOptions[0];

//   const customerId = option.Id?.toString() || "";

//   const customerName = option.AccountName || "";

//   const customerAddress =
//     option.Address1 ||
//     option.address1 ||
//     option.Address ||
//     option.address ||
//     option.AddressLine1 ||
//     option.addressLine1 ||
//     "";

//   setSelectedAccount(customerId);

//   setSelectedCustomerName(customerName);

//   setSelectedCustomerAddress(customerAddress);

// // Existing API logic
// fetchAccounts(customerId);

// fetchCustomerContact(customerId);

// // Fetch customer previous outstanding
// fetchPreviousBalance(customerId, null);

// // Close popup
// setShowDropdown(false);



// // Clear search
// setText("");
// }
//                         }

//                         if (e.key === "Escape") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           setShowDropdown(false);
//                           setText("");
//                         }
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

//                     {/* CREATE CUSTOMER */}
//                     <Box display="flex" gap={1} mt={1}>
//                       <TextField
//                         value={accountName}
//                         onChange={(e) => {
//                           setAccountName(e.target.value);
//                         }}
//                         size="small"
//                         placeholder="Create New Customer"
//                         fullWidth
//                       />

//                       <Button
//                         sx={{
//                           background: "var(--primary-color)",

//                           "&:hover": {
//                             background: "var(--primary-color)",
//                           },
//                         }}
//                         onClick={CreateCustomerMaster}
//                         variant="contained"
//                         startIcon={
//                           <AddCircleIcon
//                             sx={{
//                               fontSize: "20px",
//                             }}
//                           />
//                         }
//                       >
//                         ADD
//                       </Button>
//                     </Box>

//                     {/* NEW CUSTOMER ADDRESS */}
//                     <TextField
//                       value={newCustomerAddress}
//                       onChange={(e) => {
//                         setNewCustomerAddress(e.target.value);
//                       }}
//                       size="small"
//                       placeholder="Dealer Address"
//                       fullWidth
//                       sx={{
//                         mt: 1,
//                       }}
//                     />

//                     {/* CUSTOMER LIST */}
//                     <Box mt={1}>
//                       {accountOptions.length > 0 ? (
//                         accountOptions.map((option) => {
//                           const customerAddress =
//                             option.Address1 ||
//                             option.address1 ||
//                             option.Address ||
//                             option.address ||
//                             option.AddressLine1 ||
//                             option.addressLine1 ||
//                             "";

//                           return (
//                             <MenuItem
//                               key={option.Id}
//                               onClick={() => {
//                                 const customerId = option.Id?.toString() || "";

//                                 const customerName = option.AccountName || "";

//                                 setSelectedAccount(customerId);

//                                 setSelectedCustomerName(customerName);

//                                 setSelectedCustomerAddress(customerAddress);

                            
//                               // Existing API logic
// fetchAccounts(customerId);

// fetchCustomerContact(customerId);

// // Fetch customer previous outstanding
// fetchPreviousBalance(customerId, null);


                              

//                                 // Close popup
//                                 setShowDropdown(false);

//                                 // Clear search
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
//                                 {option.AccountName}
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

//               {/* CONTACT NUMBER */}

//               <Box flex={1} width="100%">
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
//                     height: "40px",
//                     fontSize: "16px",
//                     borderRadius: "5px",
//                   }}
//                   buttonStyle={{
//                     borderRadius: "5px",
//                   }}
//                 />
//               </Box>
//             </Box>
//             {/* ===================================================== */}
//             {/* PRODUCT DETAILS */}
//             {/* ===================================================== */}

//             <Paper
//               elevation={2}
//               sx={{
//                 width: "100%",
//                 border: "1px solid #dcdcdc",
//                 borderRadius: 2,
//                 overflow: "hidden",
//                 backgroundColor: "#fff",
//                 mb: 1.5,
//               }}
//             >
//               {/* PRODUCT DETAILS TITLE */}
//               <Box
//                 sx={{
//                   px: 1.5,
//                   py: 1.2,
//                   borderBottom: "1px solid #dcdcdc",
//                   backgroundColor: "#fff",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: { xs: "17px", sm: "20px" },
//                     fontWeight: 700,
//                   }}
//                 >
//                   Product Details
//                 </Typography>
//               </Box>

//               {/* ===================================================== */}
//               {/* PRODUCT TABLE */}
//               {/* ===================================================== */}

//               <TableContainer
//                 sx={{
//                   width: "100%",
//                   overflowX: "auto",
//                 }}
//               >
//                 <Table
//                   size="small"
//                   sx={{
//                     width: "100%",
//                     minWidth: 850,
//                     tableLayout: "fixed",

//                     "& .MuiTableCell-root": {
//                       borderBottom: "1px solid #e5e5e5",
//                       py: 1.2,
//                       px: 1.5,
//                       fontSize: "14px",
//                     },
//                   }}
//                 >
//                   {/* ================================================= */}
//                   {/* TABLE HEADER */}
//                   {/* ================================================= */}

//                   <TableHead>
//                     <TableRow
//                       sx={{
//                         backgroundColor: "#f5f5f5",
//                       }}
//                     >
//                       <TableCell
//                         sx={{
//                           width: "8%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Sr.No
//                       </TableCell>

//                       <TableCell
//                         sx={{
//                           width: "27%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Product
//                       </TableCell>

//                       <TableCell
//                         align="center"
//                         sx={{
//                           width: "15%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Quantity
//                       </TableCell>

//                       <TableCell
//                         align="right"
//                         sx={{
//                           width: "15%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Rate
//                       </TableCell>

//                       <TableCell
//                         align="right"
//                         sx={{
//                           width: "17%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Amount
//                       </TableCell>

//                       <TableCell
//                         align="center"
//                         sx={{
//                           width: "18%",
//                           fontWeight: 700,
//                         }}
//                       >
//                         Action
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   {/* ================================================= */}
//                   {/* TABLE BODY */}
//                   {/* ================================================= */}

//                   <TableBody>
//                     {/* ================================================= */}
//                     {/* SAVED PRODUCT ROWS */}
//                     {/* ================================================= */}

//                     {rows.map((row, index) => (
//                       <TableRow key={row.Id || `product-row-${index}`} hover>
//                         {/* SR NO */}
//                         <TableCell>{index + 1}</TableCell>

//                         {/* PRODUCT */}
//                         <TableCell>
//                           <Typography
//                             sx={{
//                               fontSize: "14px",
//                               fontWeight: 500,
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {row.ProductName || "-"}
//                           </Typography>
//                         </TableCell>

//                         {/* QUANTITY */}
//                         <TableCell align="center">
//                           <TextField
//                             variant="standard"
//                             type="number"
//                             value={row.Quantity ?? ""}
//                             onChange={(e) => {
//                               const updatedRows = [...rows];

//                               const qty =
//                                 e.target.value === ""
//                                   ? ""
//                                   : Number(e.target.value);

//                               const currentRate =
//                                 Number(updatedRows[index].Rate) || 0;

//                               updatedRows[index] = {
//                                 ...updatedRows[index],
//                                 Quantity: qty,
//                                 Amount: (Number(qty) || 0) * currentRate,
//                               };

//                               setRows(updatedRows);
//                             }}
//                             sx={{
//                               width: 80,
//                             }}
//                             inputProps={{
//                               min: 0,
//                             }}
//                           />
//                         </TableCell>

//                         {/* RATE */}
//                         <TableCell align="right">
//                           <TextField
//                             variant="standard"
//                             type="number"
//                             value={row.Rate ?? ""}
//                             onChange={(e) => {
//                               const updatedRows = [...rows];

//                               const newRate =
//                                 e.target.value === ""
//                                   ? ""
//                                   : Number(e.target.value);

//                               const currentQty =
//                                 Number(updatedRows[index].Quantity) || 0;

//                               updatedRows[index] = {
//                                 ...updatedRows[index],
//                                 Rate: newRate,
//                                 Amount: currentQty * (Number(newRate) || 0),
//                               };

//                               setRows(updatedRows);
//                             }}
//                             sx={{
//                               width: 100,
//                             }}
//                             inputProps={{
//                               min: 0,
//                             }}
//                           />
//                         </TableCell>

//                         {/* AMOUNT */}
//                         <TableCell align="right">
//                           ₹ {Number(row.Amount || 0).toFixed(2)}
//                         </TableCell>

//                         {/* ACTION */}
//                         <TableCell align="center">
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               gap: 0.5,
//                             }}
//                           >
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               onClick={() => handleEditRow(index)}
//                             >
//                               Edit
//                             </Button>

//                             <Button
//                               size="small"
//                               variant="outlined"
//                               color="error"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               Delete
//                             </Button>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}

//                     {/* ================================================= */}
//                     {/* NEW PRODUCT ROW */}
//                     {/* ================================================= */}

//                     <TableRow
//                       sx={{
//                         backgroundColor: "#fff",
//                       }}
//                     >
//                       {/* SR NO */}
//                       <TableCell>{rows.length + 1}</TableCell>

//                       {/* ================================================= */}
//                       {/* PRODUCT */}
//                       {/* ================================================= */}

//                       <TableCell>
// <Autocomplete
//   options={productOptions}
//   value={
//     productOptions.find(
//       (option) =>
//         String(option.value) === String(selectedProductID)
//     ) || null
//   }
//   getOptionLabel={(option) => option?.label || ""}
//   isOptionEqualToValue={(option, value) =>
//     String(option.value) === String(value?.value)
//   }
//   ListboxProps={{
//     style: {
//       maxHeight: "300px",
//       overflowY: "auto",
//     },
//   }}
//   onChange={(event, newValue) => {
//     handleItemChange(newValue);
//   }}
//   onKeyDown={(event) => {
//     if (event.key !== "Enter") {
//       return;
//     }

//     if (selectedProductID) {
//       event.preventDefault();
//       event.stopPropagation();

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);
//     }
//   }}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       inputRef={productRef}
//       variant="standard"
//       placeholder="Select Product"
//       size="small"
//       fullWidth
//       sx={{
//         "& .MuiInputBase-root": {
//           fontSize: "15px",
//         },
//       }}
//     />
//   )}
// />
//                       </TableCell>

//                       {/* ================================================= */}
//                       {/* QUANTITY */}
//                       {/* ================================================= */}
// <TableCell align="center">
// <TextField
//   variant="standard"
//   type="number"
//  value={quantity}
//   onChange={handleQuantityChange}
//   inputRef={quantityRef}
//   onKeyDown={(event) => {
//     if (event.key !== "Enter") {
//       return;
//     }

//     event.preventDefault();
//     event.stopPropagation();

//     // Product select आहे का?
//     if (!selectedProductID) {
//       toast.error("Please select a product.");

//       setTimeout(() => {
//         productRef.current?.focus();
//       }, 100);

//       return;
//     }

//     // Quantity check
//     if (!quantity || Number(quantity) <= 0) {
//       toast.error("Please enter quantity.");

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }

//     // Dealer Rate check
//     if (!rate || Number(rate) <= 0) {
//       toast.error("Dealer rate not available.");

//       return;
//     }

//     // ==========================================
//     // ADD / UPDATE ROW
//     // ==========================================
//     handleSaveOrAddRow();

//     // ==========================================
//     // AFTER ADD → PRODUCT FOCUS
//     // ==========================================
//     setTimeout(() => {
//       productRef.current?.focus();
//     }, 100);
//   }}
//   sx={{
//     width: 80,
//   }}
//   inputProps={{
//     min: 0,
//   }}
// />
// </TableCell>

//                       {/* ================================================= */}
//                       {/* RATE */}
//                       {/* ================================================= */}
// <TableCell align="right">
//   <TextField
//     variant="standard"
//     type="number"
//     // NEW
// value={rate}
//     inputRef={rateRef}
//     InputProps={{
//       readOnly: true,
//     }}
//     sx={{
//       width: 100,
//     }}
//     inputProps={{
//       min: 0,
//     }}
//   />
// </TableCell>

//                       {/* ================================================= */}
//                       {/* AMOUNT */}
//                       {/* ================================================= */}

//                       <TableCell align="right">
//                         ₹{" "}
//                         {(
//                           (Number(quantity) || 0) * (Number(rate) || 0)
//                         ).toFixed(2)}
//                       </TableCell>

//                       {/* ================================================= */}
//                       {/* ACTION */}
//                       {/* ================================================= */}

//                       <TableCell align="center">
//                         <Typography
//                           sx={{
//                             color: "#999",
//                             fontSize: "13px",
//                           }}
//                         >
//                           New
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* ERROR */}
//               {errors.rows && (
//                 <Typography
//                   color="error"
//                   sx={{
//                     px: 2,
//                     py: 1,
//                     fontSize: "14px",
//                   }}
//                 >
//                   {errors.rows}
//                 </Typography>
//               )}
//             </Paper>

//             {/* ===================================================== */}
//             {/* PAYMENT MODE + TRANSPORT */}
//             {/* ===================================================== */}

//             <Grid
//               container
//               spacing={2}
//               sx={{
//                 mb: 1.5,
//               }}
//             >
//               {/* PAYMENT MODE */}

//               <Grid item xs={12} md={6}>
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       fontWeight: 600,
//                       mb: 0.5,
//                     }}
//                   >
//                     Payment Mode
//                   </Typography>
// <TextField
//   select
//   variant="standard"
//   name="paymentMode"
//   value={paymentMode || ""}
//   onChange={(e) => {
//     const mode = e.target.value;

//     setPaymentMode(mode);
//     setReceivedAmount("");

//     if (mode !== "M") {
//       setCashAmount("");
//       setOnlineAmount("");
//     }

//     setErrors({
//       ...errors,
//       paymentMode: "",
//     });
//   }}
//   onKeyDown={(e) => {
//     // ENTER = पुढे Discount
//     if (e.key === "Enter") {
//       e.preventDefault();
//       e.stopPropagation();

//       if (!paymentMode) {
//         toast.error("Please select payment mode.");
//         return;
//       }

//       setTimeout(() => {
//         discountRef.current?.focus();
//         discountRef.current?.select();
//       }, 100);

//       return;
//     }

//     // ESC = मागे Quantity
//     if (e.key === "Escape") {
//       e.preventDefault();
//       e.stopPropagation();

//       setTimeout(() => {
//         quantityRef.current?.focus();
//         quantityRef.current?.select();
//       }, 100);

//       return;
//     }
//   }}
//   fullWidth
//   error={!!errors.paymentMode}
//   helperText={errors.paymentMode}
// >
//   <MenuItem value="">
//     Select Payment Mode
//   </MenuItem>

//   <MenuItem value="C">
//     Cash
//   </MenuItem>

//   <MenuItem value="O">
//     Online
//   </MenuItem>

//   <MenuItem value="M">
//     Mix
//   </MenuItem>
// </TextField>
//                 </Box>

//                 {/* MIX PAYMENT */}

//                 {paymentMode === "M" && (
//                   <Box
//                     sx={{
//                       mt: 1.5,
//                       p: 1.5,
//                       border: "1px solid #e0e0e0",
//                       borderRadius: 2,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontWeight: 700,
//                         mb: 1.5,
//                       }}
//                     >
//                       Mix Payment
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 2,
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
//                         }}
//                       />
//                     </Box>

//                     <Box
//                       sx={{
//                         mt: 1.5,
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Typography fontWeight={700}>Received</Typography>

//                       <Typography fontWeight={800} color="primary">
//                         ₹ {Number(receivedAmount || 0).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 )}
//               </Grid>

//               {/* TRANSPORT */}

//               <Grid item xs={12} md={6}>
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       fontWeight: 600,
//                       mb: 0.5,
//                     }}
//                   >
//                     Transport
//                   </Typography>

//                   <TextField
//                     variant="standard"
//                     value={transport}
//                     onChange={(e) => setTransport(e.target.value)}
//                     placeholder="Transport"
//                     fullWidth
//                     type="number"
//                   />
//                 </Box>
//               </Grid>
//             </Grid>

//             {/* ===================================================== */}
//             {/* AMOUNT SUMMARY - FULL WIDTH */}
//             {/* ===================================================== */}

//             <Paper
//               elevation={4}
//               sx={{
//                 width: "100%",
//                 p: {
//                   xs: 1.5,
//                   sm: 2,
//                 },
//                 borderRadius: 3,
//                 border: "1px solid #e0e0e0",
//                 backgroundColor: "#ffffff",
//                 mb: 2,
//               }}
//             >
//               {/* TITLE */}

//               <Typography
//                 variant="h5"
//                 sx={{
//                   fontWeight: 800,
//                   color: "#1976d2",
//                   mb: 2,
//                 }}
//               >
//                 Amount Summary
//               </Typography>

//               {/* SUMMARY ROW */}

//               <Grid container spacing={2} alignItems="center">
//                 {/* SUBTOTAL */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "17px",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Subtotal
//                     </Typography>

//                     <Typography
//                       sx={{
//                         fontSize: "19px",
//                         fontWeight: 700,
//                       }}
//                     >
//                       ₹ {Number(subTotalcal || 0).toFixed(2)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 {/* DISCOUNT */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "17px",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Discount
//                     </Typography>

//                     <TextField
//                       inputRef={discountRef}
//                       size="small"
//                       type="number"
//                       value={discount}
//                       onChange={(e) => {
//                         const value = e.target.value;

//                         if (value === "" || Number(value) >= 0) {
//                           setDiscount(value);
//                         }
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           setTimeout(() => {
//                             receivedAmountRef.current?.focus();
//                             receivedAmountRef.current?.select();
//                           }, 100);
//                         }
//                       }}
//                       placeholder="0.00"
//                       sx={{
//                         width: 120,

//                         "& input": {
//                           textAlign: "right",
//                           fontSize: "16px",
//                           fontWeight: 500,
//                         },
//                       }}
//                       inputProps={{
//                         min: 0,
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 {/* TOTAL */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "20px",
//                         fontWeight: 700,
//                       }}
//                     >
//                       Total
//                     </Typography>

//                     <Typography
//                       sx={{
//                         fontSize: "26px",
//                         fontWeight: 800,
//                         color: "#1976d2",
//                       }}
//                     >
//                       ₹ {Number(total || 0).toFixed(2)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 {/* RECEIVED */}

//                 <Grid item xs={12} sm={6} md={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "17px",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Received Amount
//                     </Typography>

//                     <TextField
//                       inputRef={receivedAmountRef}
//                       size="small"
//                       type="number"
//                       value={receivedAmount}
//                       onChange={handleReceivedAmountChange}
//                       disabled={paymentMode === "M"}
//                       placeholder="0.00"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           e.stopPropagation();

//                           // Received Amount पेक्षा पुढे जायचे असल्यास
//                           // Save button / पुढचा action इथे ठेवू शकतो.
//                         }
//                       }}
//                       sx={{
//                         width: 120,

//                         "& input": {
//                           textAlign: "right",
//                           fontSize: "16px",
//                           fontWeight: 500,
//                         },
//                       }}
//                       inputProps={{
//                         min: 0,
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>

//               <Divider
//                 sx={{
//                   my: 1.5,
//                 }}
//               />

//               {/* ================================================= */}
//               {/* PAYMENT STATUS */}
//               {/* ================================================= */}

//              {/* ================================================= */}
// {/* PAYMENT STATUS */}
// {/* ================================================= */}

// {isPaid ? (
//   <Box
//     sx={{
//       p: 1.5,
//       borderRadius: 2,
//       backgroundColor: "#e8f5e9",
//       border: "1px solid #a5d6a7",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Typography
//       sx={{
//         fontSize: "20px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       Paid
//     </Typography>

//     <Typography
//       sx={{
//         fontSize: "22px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       ₹ {Number(grandTotal || 0).toFixed(2)}
//     </Typography>
//   </Box>
// ) : received > grandTotal ? (
//   <Box
//     sx={{
//       p: 1.5,
//       borderRadius: 2,
//       backgroundColor: "#e8f5e9",
//       border: "1px solid #a5d6a7",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Typography
//       sx={{
//         fontSize: "20px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       Refund
//     </Typography>

//     <Typography
//       sx={{
//         fontSize: "22px",
//         fontWeight: 800,
//         color: "#087f23",
//       }}
//     >
//       ₹ {(received - grandTotal).toFixed(2)}
//     </Typography>
//   </Box>
// ) : (
//   <Box
//     sx={{
//       p: 1.5,
//       borderRadius: 2,
//       backgroundColor: "#ffebee",
//       border: "1px solid #ef9a9a",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Typography
//       sx={{
//         fontSize: "20px",
//         fontWeight: 800,
//         color: "#d32f2f",
//       }}
//     >
//       Current Bill Due
//     </Typography>

//     <Typography
//       sx={{
//         fontSize: "22px",
//         fontWeight: 800,
//         color: "#d32f2f",
//       }}
//     >
//       ₹ {Math.max(grandTotal - received, 0).toFixed(2)}
//     </Typography>
//   </Box>
// )}

// {/* ================================================= */}
// {/* PREVIOUS DUE */}
// {/* ================================================= */}

// <Box
//   sx={{
//     p: 1.5,
//     mt: 1,
//     borderRadius: 2,
//     backgroundColor: "#fff8e1",
//     border: "1px solid #ffcc80",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }}
// >
//   <Typography
//     sx={{
//       fontSize: "20px",
//       fontWeight: 800,
//       color: "#e65100",
//     }}
//   >
//     Previous Due
//   </Typography>

//   <Typography
//     sx={{
//       fontSize: "22px",
//       fontWeight: 800,
//       color: "#e65100",
//     }}
//   >
//     ₹ {Number(previousBalanceDue || 0).toFixed(2)}
//   </Typography>
// </Box>

// {/* ================================================= */}
// {/* TOTAL OUTSTANDING */}
// {/* ================================================= */}

// <Box
//   sx={{
//     p: 1.5,
//     mt: 1,
//     borderRadius: 2,
//     backgroundColor: "#ffebee",
//     border: "1px solid #ef5350",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }}
// >
//   <Typography
//     sx={{
//       fontSize: "20px",
//       fontWeight: 800,
//       color: "#b71c1c",
//     }}
//   >
//     Total Outstanding
//   </Typography>

//   <Typography
//     sx={{
//       fontSize: "22px",
//       fontWeight: 800,
//       color: "#b71c1c",
//     }}
//   >
//     ₹ {Number(customerOutstanding || 0).toFixed(2)}
//   </Typography>
// </Box>
//             </Paper>
//           </Box>

//           {/* ===================================================== */}
//           {/* SAVE / CANCEL / DELETE */}
//           {/* ===================================================== */}

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 2,
//               py: 1.5,
//               px: 2,
//               borderTop: "1px solid #ddd",
//               backgroundColor: "#fff",
//               flexShrink: 0,
//             }}
//           >
//           {/* SAVE / UPDATE */}

// <Button
//   sx={{
//     background: "var(--primary-color)",

//     "&:hover": {
//       background: "var(--primary-color)",
//     },
//   }}
//   onClick={handleSubmit}
//   variant="contained"
// >
//   {isEditing ? "Update" : "Save"}
// </Button>

// {/* PRINT */}

// <Button
//   sx={{
//     background: "var(--complementary-color)",

//     "&:hover": {
//       background: "var(--complementary-color)",
//     },
//   }}
//   onClick={(e) => handleSubmit(e, true)}
//   variant="contained"
//   startIcon={<PrintIcon />}
// >
//   Print
// </Button>

// {/* CANCEL */}

// <Button
//   sx={{
//     borderColor: "var(--complementary-color)",
//     color: "var(--complementary-color)",
//   }}
//   onClick={handleDrawerClose}
//   variant="outlined"
// >
//   <b>Cancel</b>
// </Button>

//             {isEditing && (
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={handleClickOpen}
//               >
//                 Delete
//               </Button>
//             )}

//             {/* DELETE DIALOG */}

//             <Dialog open={open} onClose={handleClose}>
//               <DialogTitle>Confirm Deletion</DialogTitle>

//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this item?
//                 </DialogContentText>
//               </DialogContent>

//               <DialogActions>
//                 <Button onClick={handleClose} color="primary">
//                   Cancel
//                 </Button>

//                 <Button onClick={handleConfirmDelete} color="error" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </Box>
//         </Drawer>

        

//         {/* ============================================================
//     INVOICE EDIT HISTORY DIALOG
// ============================================================ */}

// <Dialog
//   open={historyOpen}
//   onClose={() => {
//     setHistoryOpen(false);
//     setSelectedHistoryVersion(null);
//     setSelectedHistoryDetails([]);
//   }}
//   fullWidth
//   maxWidth="xl"
//   PaperProps={{
//     sx: {
//       borderRadius: 3,
//       maxHeight: "92vh",
//     },
//   }}
// >
//   {/* ================= HEADER ================= */}

//   <DialogTitle
//     sx={{
//       background:
//         "linear-gradient(135deg, #1976d2, #0d47a1)",
//       color: "#fff",
//       fontWeight: 700,
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <Box>
//       <Typography
//         sx={{
//           fontSize: "24px",
//           fontWeight: 700,
//         }}
//       >
//         Invoice Edit History
//       </Typography>

//       <Typography
//         sx={{
//           fontSize: "14px",
//           mt: 0.5,
//           opacity: 0.9,
//         }}
//       >
//         Invoice No:{" "}
//         {selectedHistoryInvoice?.InvoiceNo ||
//           selectedHistoryInvoice?.BillNo ||
//           "-"}
//       </Typography>
//     </Box>

//     <IconButton
//       onClick={() => {
//         setHistoryOpen(false);
//         setSelectedHistoryVersion(null);
//         setSelectedHistoryDetails([]);
//       }}
//       sx={{ color: "#fff" }}
//     >
//       <CloseIcon />
//     </IconButton>
//   </DialogTitle>

//   {/* ================= CONTENT ================= */}

//   <DialogContent
//     dividers
//     sx={{
//       backgroundColor: "#f7f9fc",
//     }}
//   >

//     {/* ================= LOADING ================= */}

//     {historyLoading ? (
//       <Box
//         sx={{
//           minHeight: 300,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Typography
//           sx={{
//             fontWeight: 600,
//             color: "#555",
//           }}
//         >
//           Loading invoice history...
//         </Typography>
//       </Box>
//     ) : (
//       <>

//         {/* =====================================================
//             CURRENT INVOICE
//         ===================================================== */}

//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 3,
//             borderRadius: 2,
//             border: "1px solid #ddd",
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: "22px",
//               fontWeight: 700,
//               color: "#1976d2",
//               mb: 3,
//             }}
//           >
//             Current Invoice
//           </Typography>

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns:
//                 "repeat(auto-fit, minmax(180px, 1fr))",
//               gap: 3,
//             }}
//           >

//             <Box>
//               <Typography color="text.secondary">
//                 Invoice No
//               </Typography>

//               <Typography fontWeight={700}>
//                 {currentHistoryHeader?.InvoiceNo ||
//                   currentHistoryHeader?.BillNo ||
//                   "-"}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography color="text.secondary">
//                 Invoice Date
//               </Typography>

//               <Typography fontWeight={700}>
//                 {currentHistoryHeader?.InvoiceDate?.date
//                   ? moment(
//                       currentHistoryHeader.InvoiceDate.date
//                     ).format("DD/MM/YYYY")
//                   : currentHistoryHeader?.InvoiceDate
//                   ? moment(
//                       currentHistoryHeader.InvoiceDate
//                     ).format("DD/MM/YYYY")
//                   : "-"}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography color="text.secondary">
//                 Customer
//               </Typography>

//               <Typography fontWeight={700}>
//                 {currentHistoryHeader?.AccountName ||
//                   currentHistoryHeader?.CustomerName ||
//                   selectedHistoryInvoice?.AccountName ||
//                   "-"}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography color="text.secondary">
//                 Total
//               </Typography>

//               <Typography
//                 fontWeight={700}
//                 sx={{ color: "#1976d2" }}
//               >
//                 ₹{" "}
//                 {Number(
//                   currentHistoryHeader?.Total || 0
//                 ).toFixed(2)}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography color="text.secondary">
//                 Received
//               </Typography>

//               <Typography fontWeight={700}>
//                 ₹{" "}
//                 {Number(
//                   currentHistoryHeader?.ReceivedAmount ||
//                     0
//                 ).toFixed(2)}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography color="text.secondary">
//                 Balance
//               </Typography>

//               <Typography
//                 fontWeight={700}
//                 sx={{ color: "red" }}
//               >
//                 ₹{" "}
//                 {Math.max(
//                   Number(
//                     currentHistoryHeader?.Total || 0
//                   ) -
//                     Number(
//                       currentHistoryHeader?.ReceivedAmount ||
//                         0
//                     ),
//                   0
//                 ).toFixed(2)}
//               </Typography>
//             </Box>

//           </Box>
//         </Paper>

//         {/* =====================================================
//             PREVIOUS INVOICE HISTORY
//         ===================================================== */}

//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 3,
//             borderRadius: 2,
//             border: "1px solid #ddd",
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: "22px",
//               fontWeight: 700,
//               color: "#e67e00",
//               mb: 2,
//             }}
//           >
//             Previous Invoice History
//           </Typography>

//           {historyHeader.length === 0 ? (
//             <Typography color="text.secondary">
//               No previous history found.
//             </Typography>
//           ) : (
//             <Box sx={{ overflowX: "auto" }}>
//               <Table size="small">

//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#eaf2f8",
//                     }}
//                   >
//                     <TableCell>
//                       <b>Version</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Invoice No</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Invoice Date</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Customer</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Total</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Received</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>View</b>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {[...historyHeader]
//                     .sort(
//                       (a, b) =>
//                         Number(b?.VersionNo || 0) -
//                         Number(a?.VersionNo || 0)
//                     )
//                     .map((item, index) => {

//                       const version =
//                         Number(item?.VersionNo || 0);

//                       const selected =
//                         selectedHistoryVersion ===
//                         version;

//                       return (
//                         <TableRow
//                           key={
//                             item?.Id ||
//                             `${version}-${index}`
//                           }
//                           sx={{
//                             backgroundColor: selected
//                               ? "#e3f2fd"
//                               : "inherit",
//                           }}
//                         >

//                           <TableCell>
//                             <Button
//                               variant={
//                                 selected
//                                   ? "contained"
//                                   : "outlined"
//                               }
//                               size="small"
//                               onClick={() =>
//                                 handleHistoryVersionClick(
//                                   item
//                                 )
//                               }
//                             >
//                               VERSION {version}
//                             </Button>
//                           </TableCell>

//                           <TableCell>
//                             {item?.InvoiceNo ||
//                               item?.BillNo ||
//                               "-"}
//                           </TableCell>

//                           <TableCell>
//                             {item?.InvoiceDate?.date
//                               ? moment(
//                                   item.InvoiceDate.date
//                                 ).format(
//                                   "DD/MM/YYYY"
//                                 )
//                               : item?.InvoiceDate
//                               ? moment(
//                                   item.InvoiceDate
//                                 ).format(
//                                   "DD/MM/YYYY"
//                                 )
//                               : "-"}
//                           </TableCell>

//                           <TableCell>
//                             {item?.AccountName ||
//                               item?.CustomerName ||
//                               "-"}
//                           </TableCell>

//                           <TableCell>
//                             ₹{" "}
//                             {Number(
//                               item?.Total || 0
//                             ).toFixed(2)}
//                           </TableCell>

//                           <TableCell>
//                             ₹{" "}
//                             {Number(
//                               item?.ReceivedAmount || 0
//                             ).toFixed(2)}
//                           </TableCell>

//                           <TableCell>
//                             <Button
//                               size="small"
//                               variant="text"
//                               onClick={() =>
//                                 handleHistoryVersionClick(
//                                   item
//                                 )
//                               }
//                             >
//                               VIEW
//                             </Button>
//                           </TableCell>

//                         </TableRow>
//                       );
//                     })}
//                 </TableBody>

//               </Table>
//             </Box>
//           )}
//         </Paper>

//         {/* =====================================================
//             OLD VS CURRENT HEADER
//         ===================================================== */}

//         {selectedHistoryVersion && (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               mb: 3,
//               borderRadius: 2,
//               border: "1px solid #ddd",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: "22px",
//                 fontWeight: 700,
//                 color: "#7b1fa2",
//                 mb: 2,
//               }}
//             >
//               Old vs Current Invoice
//             </Typography>

//             <Table size="small">

//               <TableHead>
//                 <TableRow
//                   sx={{
//                     backgroundColor: "#f3e5f5",
//                   }}
//                 >
//                   <TableCell>
//                     <b>Field</b>
//                   </TableCell>

//                   <TableCell>
//                     <b>
//                       Previous — Version{" "}
//                       {selectedHistoryVersion}
//                     </b>
//                   </TableCell>

//                   <TableCell>
//                     <b>Current</b>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>

//                 {[
//                   {
//                     field: "Invoice No",
//                     old:
//                       historyHeader.find(
//                         (x) =>
//                           Number(x?.VersionNo) ===
//                           Number(
//                             selectedHistoryVersion
//                           )
//                       )?.InvoiceNo ||
//                       historyHeader.find(
//                         (x) =>
//                           Number(x?.VersionNo) ===
//                           Number(
//                             selectedHistoryVersion
//                           )
//                       )?.BillNo ||
//                       "-",
//                     current:
//                       currentHistoryHeader?.InvoiceNo ||
//                       currentHistoryHeader?.BillNo ||
//                       "-",
//                   },

//                   {
//                     field: "Invoice Date",
//                     old:
//                       historyHeader.find(
//                         (x) =>
//                           Number(x?.VersionNo) ===
//                           Number(
//                             selectedHistoryVersion
//                           )
//                       )?.InvoiceDate?.date ||
//                       "-",
//                     current:
//                       currentHistoryHeader?.InvoiceDate
//                         ?.date ||
//                       currentHistoryHeader?.InvoiceDate ||
//                       "-",
//                   },

//                   {
//                     field: "Total",
//                     old:
//                       Number(
//                         historyHeader.find(
//                           (x) =>
//                             Number(x?.VersionNo) ===
//                             Number(
//                               selectedHistoryVersion
//                             )
//                         )?.Total || 0
//                       ).toFixed(2),
//                     current:
//                       Number(
//                         currentHistoryHeader?.Total ||
//                           0
//                       ).toFixed(2),
//                   },

//                   {
//                     field: "Received Amount",
//                     old:
//                       Number(
//                         historyHeader.find(
//                           (x) =>
//                             Number(x?.VersionNo) ===
//                             Number(
//                               selectedHistoryVersion
//                             )
//                         )?.ReceivedAmount || 0
//                       ).toFixed(2),
//                     current:
//                       Number(
//                         currentHistoryHeader?.ReceivedAmount ||
//                           0
//                       ).toFixed(2),
//                   },

//                   {
//                     field: "Discount",
//                     old:
//                       historyHeader.find(
//                         (x) =>
//                           Number(x?.VersionNo) ===
//                           Number(
//                             selectedHistoryVersion
//                           )
//                       )?.Discount || 0,
//                     current:
//                       currentHistoryHeader?.Discount || 0,
//                   },

//                   {
//                     field: "Transport",
//                     old:
//                       historyHeader.find(
//                         (x) =>
//                           Number(x?.VersionNo) ===
//                           Number(
//                             selectedHistoryVersion
//                           )
//                       )?.Transport || 0,
//                     current:
//                       currentHistoryHeader?.Transport || 0,
//                   },

//                 ].map((item) => (
//                   <TableRow key={item.field}>

//                     <TableCell>
//                       <b>{item.field}</b>
//                     </TableCell>

//                     <TableCell>
//                       {String(item.old)}
//                     </TableCell>

//                     <TableCell>
//                       {String(item.current)}
//                     </TableCell>

//                   </TableRow>
//                 ))}

//               </TableBody>

//             </Table>
//           </Paper>
//         )}

//         {/* =====================================================
//             PREVIOUS PRODUCT DETAILS
//         ===================================================== */}

//         {selectedHistoryVersion && (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               mb: 3,
//               borderRadius: 2,
//               border: "1px solid #ddd",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: "22px",
//                 fontWeight: 700,
//                 color: "#e67e00",
//                 mb: 2,
//               }}
//             >
//               Previous Product Details — Version{" "}
//               {selectedHistoryVersion}
//             </Typography>

//             {selectedHistoryDetails.length === 0 ? (
//               <Typography color="text.secondary">
//                 No previous product details found.
//               </Typography>
//             ) : (
//               <Table size="small">

//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#fff3e0",
//                     }}
//                   >
//                     <TableCell>
//                       <b>Product</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Quantity</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Rate</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Amount</b>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {selectedHistoryDetails.map(
//                     (detail, index) => {

//                       const product =
//                         productOptions.find(
//                           (option) =>
//                             String(option?.value) ===
//                             String(
//                               detail?.ProductId
//                             )
//                         );

//                       return (
//                         <TableRow
//                           key={
//                             detail?.Id ||
//                             `${detail?.ProductId}-${index}`
//                           }
//                         >

//                           <TableCell>
//                             {product?.label ||
//                               detail?.ProductName ||
//                               "Unknown"}
//                           </TableCell>

//                           <TableCell>
//                             {detail?.Quantity ?? "-"}
//                           </TableCell>

//                           <TableCell>
//                             ₹{" "}
//                             {Number(
//                               detail?.Rate || 0
//                             ).toFixed(2)}
//                           </TableCell>

//                           <TableCell>
//                             ₹{" "}
//                             {Number(
//                               detail?.Amount || 0
//                             ).toFixed(2)}
//                           </TableCell>

//                         </TableRow>
//                       );
//                     }
//                   )}
//                 </TableBody>

//               </Table>
//             )}
//           </Paper>
//         )}

//         {/* =====================================================
//             CURRENT PRODUCT DETAILS
//         ===================================================== */}

//         {selectedHistoryVersion && (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               mb: 2,
//               borderRadius: 2,
//               border: "1px solid #ddd",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: "22px",
//                 fontWeight: 700,
//                 color: "#1976d2",
//                 mb: 2,
//               }}
//             >
//               Current Product Details
//             </Typography>

//             {currentHistoryDetails.length === 0 ? (
//               <Typography color="text.secondary">
//                 No current product details found.
//               </Typography>
//             ) : (
//               <Table size="small">

//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#e3f2fd",
//                     }}
//                   >
//                     <TableCell>
//                       <b>Product</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Quantity</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Rate</b>
//                     </TableCell>

//                     <TableCell>
//                       <b>Amount</b>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {currentHistoryDetails.map(
//                     (detail, index) => {

//                       const product =
//                         productOptions.find(
//                           (option) =>
//                             String(option?.value) ===
//                             String(
//                               detail?.ProductId
//                             )
//                         );

//                       return (
//                         <TableRow
//                           key={
//                             detail?.Id ||
//                             `${detail?.ProductId}-${index}`
//                           }
//                         >

//                           <TableCell>
//                             {product?.label ||
//                               detail?.ProductName ||
//                               "Unknown"}
//                           </TableCell>

//                           <TableCell>
//                             {detail?.Quantity ?? "-"}
//                           </TableCell>

//                           <TableCell>
//                             ₹{" "}
//                             {Number(
//                               detail?.Rate || 0
//                             ).toFixed(2)}
//                           </TableCell>

//                           <TableCell>
//                             ₹{" "}
//                             {Number(
//                               detail?.Amount || 0
//                             ).toFixed(2)}
//                           </TableCell>

//                         </TableRow>
//                       );
//                     }
//                   )}
//                 </TableBody>

//               </Table>
//             )}
//           </Paper>
//         )}

//       </>
//     )}

//   </DialogContent>

//   {/* ================= FOOTER ================= */}

//   <DialogActions
//     sx={{
//       p: 2,
//       backgroundColor: "#fff",
//     }}
//   >
//     <Button
//       variant="contained"
//       onClick={() => {
//         setHistoryOpen(false);
//         setSelectedHistoryVersion(null);
//         setSelectedHistoryDetails([]);
//       }}
//     >
//       CLOSE
//     </Button>
//   </DialogActions>

// </Dialog>


//            <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           newestOnTop
//         />

//       </Box>
//     </Box>
//   );
// };

// export default DealerSalesEntry;













import { useMemo, useState, useEffect, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";
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

import MinimizeIcon from "@mui/icons-material/Minimize";
import Tooltip from "@mui/material/Tooltip";
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
import { toast, ToastContainer } from "react-toastify";
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

const DealerSalesEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // THIS SCREEN IS ONLY FOR DEALER CUSTOMERS
  // D = Dealer
  // =====================================================
  const PAGE_CUSTOMER_TYPE = "D";

  // =====================================================
// PREVENT MOUSE WHEEL FROM CHANGING NUMBER INPUT VALUE
// =====================================================
const preventNumberInputScroll = (event) => {
  event.currentTarget.blur();
};

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

const [minimizedBills, setMinimizedBills] = useState([]);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState([]);
  const [rows, setRows] = useState([]);


// ======================================================
// INVOICE LIST FILTERS
// ======================================================
const [searchText, setSearchText] = useState("");
const [categoryFilter, setCategoryFilter] = useState("");
const [filterFromDate, setFilterFromDate] = useState("");
const [filterToDate, setFilterToDate] = useState("");

// =====================================================
// INVOICE EDIT HISTORY
// =====================================================

const [historyOpen, setHistoryOpen] = useState(false);
const [historyLoading, setHistoryLoading] = useState(false);

const [selectedHistoryInvoice, setSelectedHistoryInvoice] =
  useState(null);

const [historyHeader, setHistoryHeader] = useState([]);
const [historyDetails, setHistoryDetails] = useState([]);

const [currentHistoryHeader, setCurrentHistoryHeader] =
  useState(null);

const [currentHistoryDetails, setCurrentHistoryDetails] =
  useState([]);

const [selectedHistoryVersion, setSelectedHistoryVersion] =
  useState(null);

const [selectedHistoryDetails, setSelectedHistoryDetails] =
  useState([]);

// Product options
const [productOptions, setProductOptions] = useState([]);

const [userId, setUserId] = useState(
  () => sessionStorage.getItem("UserId") || ""
);

// ======================================================
// USER ROLE
// ADMIN  -> Can edit any date
// SALE   -> Can edit only today's entry
// SALE2  -> Can edit only today's entry
// ======================================================

const userRole = String(
  sessionStorage.getItem("UserRole") || ""
)
  .trim()
  .toUpperCase();

const isAdmin = userRole === "ADMIN";

const getDeviceForLoggedInUser = () => {
  const userRole = String(
    sessionStorage.getItem("UserRole") || ""
  )
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




  useEffect(() => {
    // fetchInvdetails();
  }, []);

  
// ======================================================
// GET ALL INVOICE HEADERS
// ======================================================
const fetchInvoiceHeader = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    // ==================================================
    // 1. FIRST PAGE
    // ==================================================
    const firstResponse = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=1`,
      requestOptions
    );

    const firstResult = await firstResponse.json();

    const totalPages = Number(
      firstResult?.total_pages || 1
    );

    let allInvoiceData = [
      ...(firstResult?.data || []),
    ];

    // ==================================================
    // 2. GET REMAINING PAGES
    // ==================================================
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const response = await fetch(
          `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${page}`,
          requestOptions
        );

        const result = await response.json();

        allInvoiceData = [
          ...allInvoiceData,
          ...(result?.data || []),
        ];
      }
    }




// =====================================================
// OPEN INVOICE EDIT HISTORY
// =====================================================



    // ==================================================
    // 3. SORT NEWEST BILL FIRST
    // ==================================================
    allInvoiceData.sort(
      (a, b) =>
        Number(b?.Id || 0) -
        Number(a?.Id || 0)
    );

    // ==================================================
    // 4. FETCH ACCOUNT + ADDRESS
    // ==================================================
    const invoicesList = await Promise.all(
      allInvoiceData.map(async (invoice) => {
        try {
          // --------------------------------------------
          // ACCOUNT
          // --------------------------------------------
          let accountDetails = null;

          if (
            invoice?.AccountId &&
            Number(invoice.AccountId) !== 0
          ) {
            const acctResponse = await fetch(
              `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invoice.AccountId}`,
              requestOptions
            );

            if (acctResponse.ok) {
              const acctResult =
                await acctResponse.json();

              accountDetails = Array.isArray(
                acctResult
              )
                ? acctResult[0] || null
                : Array.isArray(acctResult?.data)
                  ? acctResult.data[0] || null
                  : acctResult?.data ||
                    acctResult ||
                    null;
            }
          }

          // --------------------------------------------
          // ADDRESS
          // --------------------------------------------
          let addressDetails = null;

          if (
            invoice?.AccountId &&
            Number(invoice.AccountId) !== 0
          ) {
            const addressResponse =
              await fetch(
                `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${invoice.AccountId}`,
                requestOptions
              );

            if (addressResponse.ok) {
              const addressResult =
                await addressResponse.json();

              addressDetails = Array.isArray(
                addressResult
              )
                ? addressResult[0] || null
                : Array.isArray(
                      addressResult?.data
                    )
                  ? addressResult.data[0] ||
                    null
                  : addressResult?.data ||
                    addressResult ||
                    null;
            }
          }

          // --------------------------------------------
          // CUSTOMER TYPE
          // --------------------------------------------
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

          return {
            ...invoice,

            accountDetails: {
              ...(accountDetails || {}),
              CustomerType: customerType,
            },

            addressDetails,
          };
        } catch (error) {
          console.error(
            `Failed to fetch customer details for invoice ${invoice?.Id}:`,
            error
          );


return {
  ...invoice,

  accountDetails: {
    AccountName: invoice?.AccountName || "",
    CustomerType:
      invoice?.CustomerType ||
      invoice?.customerType ||
      "",
  },

  addressDetails: null,
};

        }
      })
    );

    // ==================================================
    // 5. SAVE ALL INVOICES
    // ==================================================
    // ==================================================
// 5. FILTER ONLY DEALER INVOICES
// D = Dealer
// ==================================================

const dealerInvoices = invoicesList.filter((invoice) => {
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

  return customerType === PAGE_CUSTOMER_TYPE;
});

// ==================================================
// DEBUG
// ==================================================

console.log("====================================");
console.log("ALL INVOICES:", invoicesList.length);
console.log("DEALER INVOICES:", dealerInvoices.length);
console.log("DEALER DATA:", dealerInvoices);
console.log("====================================");

// ==================================================
// SHOW ONLY DEALER INVOICES
// ==================================================

setInvoiceheaders(dealerInvoices);

setTotalPages(totalPages);

    console.log(
      "ALL DEALER INVOICES:",
      invoicesList
    );

    console.log(
      "TOTAL DEALER INVOICE COUNT:",
      invoicesList.length
    );
  } catch (error) {
    console.error(
      "Error fetching all invoice headers:",
      error
    );
  }
};




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

  console.log("======================================");
  console.log("HISTORY VERSION CLICK");
  console.log("Invoice No:", historyItem?.InvoiceNo);
  console.log("Invoice ID:", historyItem?.InvoiceId);
  console.log("Version:", version);
  console.log("======================================");

  setSelectedHistoryVersion(version);

  const versionDetails = historyDetails.filter(
    (detail) =>
      Number(detail?.VersionNo) === version
  );

  console.log(
    "SELECTED VERSION DETAILS:",
    versionDetails
  );

  setSelectedHistoryDetails(versionDetails);
};



const fetchCurrentInvoiceForHistory = async (invoiceId) => {
  try {
   
    const headerResponse = await axios.get(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${invoiceId}`
    );

    const headerData = headerResponse.data;

    const currentHeader =
      Array.isArray(headerData)
        ? headerData[0] || null
        : Array.isArray(headerData?.data)
        ? headerData.data[0] || null
        : headerData?.data || headerData || null;

    // ==========================================
    // CURRENT DETAILS
    // ==========================================

    const detailResponse = await axios.get(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
    );

    const detailData = detailResponse.data;

    const currentDetails =
      Array.isArray(detailData)
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
    console.error(
      "CURRENT INVOICE HISTORY FETCH ERROR:",
      error
    );

    throw error;
  }
};



// =====================================================
// OPEN INVOICE EDIT HISTORY
// =====================================================

const handleInvoiceHistoryClick = async (invoice) => {
  console.log("======================================");
  console.log("EDITED BUTTON CLICKED");
  console.log("FULL INVOICE:", invoice);
  console.log("======================================");

  const invoiceId =
    invoice?.Id ||
    invoice?.InvoiceId ||
    invoice?.invoiceId;

  console.log("HISTORY INVOICE ID:", invoiceId);

  if (!invoiceId) {
    toast.error("Invoice ID not found.");
    return;
  }

  // Open dialog immediately
  setSelectedHistoryInvoice(invoice);
  setHistoryOpen(true);
  setHistoryLoading(true);

  // Clear old data
  setHistoryHeader([]);
  setHistoryDetails([]);
  setCurrentHistoryHeader(null);
  setCurrentHistoryDetails([]);
  setSelectedHistoryVersion(null);
  setSelectedHistoryDetails([]);

  try {
    // =================================================
    // OLD HEADER
    // =================================================
    const headerResponse = await axios.get(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(invoiceId)}`
    );

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

    console.log(
      "OLD HEADER HISTORY:",
      oldHeaders
    );

    setHistoryHeader(oldHeaders);

    // =================================================
    // OLD DETAILS
    // =================================================
    const detailResponse = await axios.get(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(invoiceId)}`
    );

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

    console.log(
      "OLD DETAIL HISTORY:",
      oldDetails
    );

    setHistoryDetails(oldDetails);

    // =================================================
    // LATEST VERSION
    // =================================================
    if (oldHeaders.length > 0) {
      const latestVersionItem =
        [...oldHeaders].sort(
          (a, b) =>
            Number(b?.VersionNo || 0) -
            Number(a?.VersionNo || 0)
        )[0];

      const latestVersion = Number(
        latestVersionItem?.VersionNo || 0
      );

      console.log(
        "LATEST VERSION:",
        latestVersion
      );

      if (latestVersion > 0) {
        setSelectedHistoryVersion(
          latestVersion
        );

        const versionDetails =
          oldDetails.filter(
            (detail) =>
              Number(detail?.VersionNo) ===
              latestVersion
          );

        setSelectedHistoryDetails(
          versionDetails
        );
      }
    }

    // =================================================
    // CURRENT INVOICE
    // =================================================
    await fetchCurrentInvoiceForHistory(
      invoiceId
    );

    console.log(
      "CURRENT INVOICE LOADED SUCCESSFULLY"
    );

  } catch (error) {
    console.error(
      "INVOICE HISTORY ERROR:",
      error
    );

    toast.error(
      "Unable to load invoice history."
    );
  } finally {
    setHistoryLoading(false);
  }
};




// ======================================================
// FETCH CUSTOMER PREVIOUS DUE
// ======================================================

const fetchPreviousBalance = async (
  customerId,
  excludeInvoiceId = null
) => {
  if (!customerId) {
    setPreviousBalanceDue(0);
    return 0;
  }

  try {
    const response = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoiceheader&Colname=AccountId&Colvalue=${encodeURIComponent(
        customerId
      )}`
    );

    if (!response.ok) {
      throw new Error(
        `Invoice history API failed with status ${response.status}`
      );
    }

    const result = await response.json();

    // API response array handle करा
    const invoiceList = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
      ? result.data
      : result?.data
      ? [result.data]
      : [];

    let previousBalance = 0;

    console.log("==============================================");
    console.log("PREVIOUS BALANCE CALCULATION");
    console.log("Customer ID:", customerId);
    console.log("Exclude Invoice ID:", excludeInvoiceId);
    console.log("Total Invoices Returned:", invoiceList.length);
    console.log("==============================================");

    for (const invoice of invoiceList) {
      const invoiceId = Number(invoice?.Id || 0);

      // --------------------------------------------------
      // EDIT MODE
      // Currently editing invoice Previous Due मध्ये
      // पुन्हा calculate होऊ नये
      // --------------------------------------------------
      if (
        excludeInvoiceId !== null &&
        excludeInvoiceId !== undefined &&
        String(invoiceId) === String(excludeInvoiceId)
      ) {
        console.log(
          "SKIPPING CURRENT EDIT INVOICE:",
          invoiceId
        );

        continue;
      }

      // --------------------------------------------------
      // Invoice Total
      // --------------------------------------------------
      const invoiceTotal =
        parseFloat(invoice?.Total) || 0;

      // --------------------------------------------------
      // Received Amount
      // --------------------------------------------------
      let invoiceReceived = 0;

      if (
        invoice?.ReceivedAmount !== null &&
        invoice?.ReceivedAmount !== undefined &&
        invoice?.ReceivedAmount !== ""
      ) {
        invoiceReceived =
          parseFloat(invoice.ReceivedAmount) || 0;
      } else {
        // Fallback:
        // Cash + Online
        const cashAmount =
          parseFloat(invoice?.CashAmount) || 0;

        const onlineAmount =
          parseFloat(invoice?.OnlineAmount) || 0;

        invoiceReceived =
          cashAmount + onlineAmount;
      }

      // --------------------------------------------------
      // Invoice Due
      // --------------------------------------------------
      const invoiceDue = Math.max(
        invoiceTotal - invoiceReceived,
        0
      );

      // --------------------------------------------------
      // Add to Previous Balance
      // --------------------------------------------------
      previousBalance += invoiceDue;

      console.log("Invoice Due Calculation:", {
        InvoiceId: invoiceId,
        Total: invoiceTotal,
        ReceivedAmount: invoiceReceived,
        Due: invoiceDue,
        RunningPreviousBalance: previousBalance,
      });
    }

    // --------------------------------------------------
    // Final Previous Due
    // --------------------------------------------------
    const finalPreviousBalance =
      Number(previousBalance.toFixed(2));

    console.log(
      "FINAL PREVIOUS BALANCE:",
      finalPreviousBalance
    );

    setPreviousBalanceDue(
      finalPreviousBalance
    );

    return finalPreviousBalance;
  } catch (error) {
    console.error(
      "Error fetching customer previous balance:",
      error
    );

    setPreviousBalanceDue(0);

    return 0;
  }
};





// ======================================================
// FILTER INVOICE LIST
// ======================================================
const filteredInvoiceData = useMemo(() => {
  const search = searchText.trim().toLowerCase();

  return invoiceheaders.filter((invoice) => {
    // Bill / Invoice number
   const billNo = String(
  invoice?.InvoiceNo || ""
).toLowerCase();

    // Customer name
    const customerName = String(
      invoice?.accountDetails?.AccountName || ""
    ).toLowerCase();

    // Customer type
    const customerType = String(
      invoice?.accountDetails?.CustomerType ||
        invoice?.addressDetails?.CustomerType ||
        invoice?.CustomerType ||
        ""
    )
      .trim()
      .toUpperCase();


      // =====================================================
// HARD FILTER
// SALES DEALER = ONLY DEALER CUSTOMERS
// =====================================================

if (customerType !== PAGE_CUSTOMER_TYPE) {
  return false;
}

    // Category name
    let categoryName = "";

    if (customerType === "R") {
      categoryName = "retailer";
    } else if (customerType === "D") {
      categoryName = "dealer";
    } else if (customerType === "C") {
      categoryName = "caterers";
    }

    // Invoice date
    const invoiceDate = invoice?.InvoiceDate?.date
      ? invoice.InvoiceDate.date.substring(0, 10)
      : typeof invoice?.InvoiceDate === "string"
        ? invoice.InvoiceDate.substring(0, 10)
        : "";

    // Category filter
    const categoryMatch =
      categoryFilter === "" ||
      customerType === categoryFilter;

    // Search filter
    const searchMatch =
      search === "" ||
      billNo.includes(search) ||
      customerName.includes(search) ||
      categoryName.includes(search);

    // From date
    const fromDateMatch =
      filterFromDate === "" ||
      (invoiceDate !== "" &&
        invoiceDate >= filterFromDate);

    // To date
    const toDateMatch =
      filterToDate === "" ||
      (invoiceDate !== "" &&
        invoiceDate <= filterToDate);

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
  filterFromDate,
  filterToDate,
]);


  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = () => {
    setIsDrawerOpen(true);
    //  handleEdit()
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // handleMenuOpen(false);
  };

// ======================================================
// DELETE HEADER DIALOG STATE
// ======================================================
const [open, setOpen] = useState(false);


// ======================================================
// HANDLE NEW DEALER SALES ENTRY
// ======================================================
const handleNewClick = () => {
  setIsDrawerOpen(true);
  resetForm();
  setIsEditing(false);
  setOpen(false);
};



// ======================================================
// MINIMIZE CURRENT DEALER SALES BILL
// ======================================================
const handleMinimizeBill = () => {
  try {
    // Unique ID
    const draftId =
      isEditing && editId
        ? `edit-${editId}`
        : `new-${Date.now()}`;

    // Save current Dealer bill
    const draftBill = {
      draftId,

      // Edit information
      isEditing,
      editId: editId || null,

      // Invoice information
      invoiceNo,
      invoiceDate,
      device,
      currentTime,

      // Customer
      customerName,
      phone,
      selectedAccount,

      // Product rows
      rows,

      // Current product entry
      selectedProductID,
      productName,
      selectedProductName,
      quantity,
      rate,
      amount,

      // Payment
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

      // Current editing row
      editingRow,

      // Minimized time
      minimizedAt: new Date().toISOString(),
    };

    console.log("======================================");
    console.log("MINIMIZING DEALER BILL");
    console.log("DRAFT BILL:", draftBill);
    console.log("======================================");

    // Add / update minimized bill
    setMinimizedBills((prev) => {
      const existingIndex = prev.findIndex(
        (bill) => bill.draftId === draftId
      );

      // Already minimized -> update
      if (existingIndex !== -1) {
        const updated = [...prev];

        updated[existingIndex] = draftBill;

        return updated;
      }

      // New minimized bill
      return [...prev, draftBill];
    });

    // Close drawer WITHOUT resetForm()
    setIsDrawerOpen(false);
    setShowDropdown(false);

    toast.success("Dealer bill minimized successfully.");
  } catch (error) {
    console.error(
      "Error minimizing Dealer bill:",
      error
    );

    toast.error("Unable to minimize Dealer bill.");
  }
};




// ======================================================
// RESUME MINIMIZED DEALER BILL
// ======================================================
const handleResumeBill = (billId) => {
  try {
    const bill = minimizedBills.find(
      (item) => item.draftId === billId
    );

    if (!bill) {
      toast.error("Minimized Dealer bill not found.");
      return;
    }

    // ==================================================
    // INVOICE
    // ==================================================
    setInvoiceNo(bill.invoiceNo || "");

    setInvoiceDate(
      bill.invoiceDate || new Date()
    );

    // Restore Time
    setCurrentTime(
      bill.currentTime || ""
    );

    setDevice(
      bill.device || ""
    );

    // ==================================================
    // CUSTOMER
    // ==================================================
    setSelectedAccount(
      bill.selectedAccount || ""
    );

    setCustomerName(
      bill.customerName || ""
    );

    setSelectedCustomerName(
      bill.selectedCustomerName ||
      bill.customerName ||
      ""
    );

    setPhone(
      bill.phone || ""
    );

    // ==================================================
    // PRODUCTS
    // ==================================================
    setRows(
      Array.isArray(bill.rows)
        ? bill.rows
        : []
    );

    // ==================================================
    // CURRENT PRODUCT ENTRY
    // ==================================================
    setSelectedProductId(
      bill.selectedProductID || ""
    );

    setSelectedProductName(
      bill.selectedProductName || ""
    );

    setProductName(
      bill.productName || ""
    );

    setQuantity(
      bill.quantity || ""
    );

    setRate(
      bill.rate || ""
    );

    SetAmount(
      bill.amount || ""
    );

    // ==================================================
    // PAYMENT
    // ==================================================
    setPaymentMode(
      bill.paymentMode || ""
    );

    setCashAmount(
      bill.cashAmount || ""
    );

    setOnlineAmount(
      bill.onlineAmount || ""
    );

    setReceivedAmount(
      bill.receivedAmount || ""
    );

    // ==================================================
    // DISCOUNT / TRANSPORT
    // ==================================================
    setDiscount(
      bill.discount || ""
    );

    setTransport(
      bill.transport || ""
    );

    // ==================================================
    // GST
    // ==================================================
    setIsGST(
      bill.isGST || false
    );

    setCGST(
      bill.cgst || ""
    );

    setCGSTAmount(
      bill.cgstAmount || ""
    );

    setSGST(
      bill.sgst || ""
    );

    setSGSTAmount(
      bill.sgstAmount || ""
    );

    setIGST(
      bill.igst || ""
    );

    setIGSTAmount(
      bill.igstAmount || ""
    );

    // ==================================================
    // OTHER
    // ==================================================
    setBillFor(
      bill.billFor || ""
    );

    setMachineID(
      bill.machineID || ""
    );

    // ==================================================
    // EDIT INFORMATION
    // ==================================================
    setIsEditing(
      bill.isEditing || false
    );

    setEditId(
      bill.editId || null
    );

    // ==================================================
    // CURRENT EDITING ROW
    // ==================================================
    setEditingRow(
      bill.editingRow ?? null
    );

    // ==================================================
    // OPEN DRAWER
    // ==================================================
    setIsDrawerOpen(true);

    // ==================================================
    // REMOVE FROM MINIMIZED LIST
    // ==================================================
    setMinimizedBills((prev) =>
      prev.filter(
        (item) => item.draftId !== billId
      )
    );

    toast.success(
      "Minimized Dealer bill resumed successfully."
    );

  } catch (error) {
    console.error(
      "Error resuming Dealer bill:",
      error
    );

    toast.error(
      "Unable to resume Dealer bill."
    );
  }
};




// ======================================================
// REMOVE MINIMIZED DEALER BILL
// ======================================================
const handleRemoveMinimizedBill = (billId) => {
  setMinimizedBills((prev) =>
    prev.filter(
      (item) => item.draftId !== billId
    )
  );

  toast.success(
    "Minimized Dealer bill removed."
  );
};

// ======================================================
// OPEN DEALER FORM FROM NAVIGATION
// ======================================================
useEffect(() => {
  if (location.state?.openCreateForm === true) {
    handleNewClick();

    const returnTo = location.state?.returnTo;

    navigate(location.pathname, {
      replace: true,
      state: {
        returnTo: returnTo || null,
      },
    });
  }
}, [location.state, location.pathname, navigate]);


// ======================================================
// SALES ENTRY KEYBOARD SHORTCUTS
// D = DEALER
// R = REGULAR
// C = CATERERS
// ======================================================
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
    // Drawer already open
    // --------------------------------------------------
    if (isDrawerOpen) {
      return;
    }

    // --------------------------------------------------
    // Ignore Ctrl / Alt / Windows key
    // --------------------------------------------------
    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }

    // --------------------------------------------------
    // Ignore repeated key
    // --------------------------------------------------
    if (event.repeat) {
      return;
    }

    const key = event.key?.toLowerCase();

    // ==================================================
    // D = DEALER
    // ==================================================
    if (key === "d") {
      event.preventDefault();
      event.stopPropagation();

      console.log("D pressed - Opening Dealer Sales Entry");

      setIsDrawerOpen(true);
      resetForm();
      setIsEditing(false);
      setOpen(false);

      return;
    }


   // ==================================================
// R = REGULAR SALES ENTRY
// ==================================================
if (key === "r") {
  event.preventDefault();
  event.stopPropagation();

  console.log("R pressed - Opening Regular Sales Entry");

  navigate("/salesentry", {
    state: {
      openCreateForm: true,
      returnTo: "/salesdealer",
    },
  });

  return;
}
    // ==================================================
    // C = CATERERS
    // ==================================================
    if (key === "c") {
      event.preventDefault();
      event.stopPropagation();

      console.log(
        "C pressed - Opening Caterers Sales Entry from Dealer"
      );

      navigate("/salescaterers", {
        state: {
          openCreateForm: true,
          returnTo: "/salesdealer",
        },
      });

      return;
    }
  };

  window.addEventListener(
    "keydown",
    handleSalesShortcut,
    true
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleSalesShortcut,
      true
    );
  };
}, [navigate, isDrawerOpen]);


// ======================================================
// CLOSE DEALER DRAWER
// ======================================================
const handleDrawerClose = () => {
  const returnTo = location.state?.returnTo;

  // Close current Regular form
  setIsDrawerOpen(false);
  setShowDropdown(false);
  resetForm();

  // If Regular form was opened from another Sales page,
  // go back to that page
  if (returnTo) {
    navigate(returnTo);
  }
};


// ======================================================
// CLOSE DEALER DRAWER AND GO TO REGULAR SALES
// ======================================================
const handleDrawerCloseAndGoBack = () => {
  const returnTo = location.state?.returnTo;

  setIsDrawerOpen(false);
  setShowDropdown(false);
  resetForm();

  if (returnTo) {
    navigate(returnTo);
  } else {
    navigate("/salesentry");
  }
};


// ======================================================
// DELETE HEADER DIALOG
// ======================================================
const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

  const handleConfirmDelete = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    // const itemId = currentRow.original.Id;
    // console.log('itemId',currentRow.original.Id)

    fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=invoiceheader&Id=${editId}`,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);

        handleDrawerClose();
        fetchInvoiceHeader();
        handleMenuClose();
        toast.success("Sales Entry - Dealer Deleted successfully!");
      })
      .catch((error) => console.error(error));
  };

  const [editId, setEditId] = useState("");

  //update form

const handleEdit = async (row) => {
  const originalData = row.original;

  if (!originalData) return;

 const rowId = originalData.Id;

const invheader = invoiceheaders.find(
  (h) => String(h.Id) === String(rowId)
);

  if (!invheader) {
    console.error("No invoice header found for the selected row.");
    return;
  }




  // ======================================================
// EDIT DATE RESTRICTION
// ADMIN  -> Can edit any date
// SALE   -> Can edit only today's invoice
// SALE2  -> Can edit only today's invoice
// ======================================================

const loggedInUser = String(
  sessionStorage.getItem("UserId") || ""
).trim().toUpperCase();

const invoiceDateValue = invheader.InvoiceDate?.date || invheader.InvoiceDate;

const invoiceDateOnly = new Date(invoiceDateValue);
const today = new Date();

invoiceDateOnly.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);

const isToday =
  invoiceDateOnly.getTime() === today.getTime();

if (loggedInUser !== "ADMIN" && !isToday) {
  toast.error("You can edit only today's invoices.");
  return;
}



  // ==============================
  // FETCH SAVED INVOICE DETAILS
  // ==============================
  let invdetail = [];

  try {
    const detailResponse = await axios.get(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invheader.Id}`
    );

    invdetail = Array.isArray(detailResponse.data)
      ? detailResponse.data
      : detailResponse.data?.data || [];

    console.log("EDIT INVOICE DETAIL RESPONSE:", invdetail);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    toast.error("Unable to fetch invoice details.");
    return;
  }

 // ==============================
// CUSTOMER DETAILS
// ==============================
fetchAccounts(invheader.AccountId);
fetchAccountName(invheader.AccountId);

const savedCustomerName =
  invheader.accountDetails?.AccountName ||
  invheader.accountDetails?.accountName ||
  "";

setCustomerName(savedCustomerName);
setSelectedAccount(invheader.AccountId);


// Fetch previous customer due
// Current edited invoice exclude करा
fetchPreviousBalance(
  invheader.AccountId,
  invheader.Id
);



setSelectedCustomerName(savedCustomerName);

  // ==============================
  // DATE CONVERSION
  // ==============================
  const convertDateForInput = (dateStr) => {
    if (typeof dateStr === "string" && dateStr.includes("-")) {
      const [year, month, day] = dateStr.split(" ")[0].split("-");

      return `${year}-${month}-${day}`;
    } else {
      toast.error(`Invalid date format: ${dateStr}`);
      return "";
    }
  };

  // ==============================
  // MAP SAVED PRODUCTS
  // ==============================
const mappedRows = invdetail.map((detail) => ({
  Id: detail.Id,

  InvoiceId: detail.InvoiceId,

  ProductId: detail.ProductId,

  ProductName:
    productOptions.find(
      (data) =>
        data.value?.toString() === detail.ProductId?.toString()
    )?.label || "",

  Quantity:
    detail.Quantity !== null && detail.Quantity !== undefined
      ? parseFloat(detail.Quantity) || 0
      : 0,

  Rate:
    detail.Rate !== null && detail.Rate !== undefined
      ? parseFloat(detail.Rate) || 0
      : 0,

  Amount:
    detail.Amount !== null && detail.Amount !== undefined
      ? parseFloat(detail.Amount) || 0
      : 0,

  CGSTPercentage:
    detail.CGSTPercentage !== null &&
    detail.CGSTPercentage !== undefined
      ? parseFloat(detail.CGSTPercentage) || 0
      : 0,

  CGSTAmount:
    detail.CGSTAmount !== null &&
    detail.CGSTAmount !== undefined
      ? parseFloat(detail.CGSTAmount) || 0
      : 0,

  SGSTPercentage:
    detail.SGSTPercentage !== null &&
    detail.SGSTPercentage !== undefined
      ? parseFloat(detail.SGSTPercentage) || 0
      : 0,

  SGSTAmount:
    detail.SGSTAmount !== null &&
    detail.SGSTAmount !== undefined
      ? parseFloat(detail.SGSTAmount) || 0
      : 0,

  IGSTPercentage:
    detail.IGSTPercentage !== null &&
    detail.IGSTPercentage !== undefined
      ? parseFloat(detail.IGSTPercentage) || 0
      : 0,

  IGSTAmount:
    detail.IGSTAmount !== null &&
    detail.IGSTAmount !== undefined
      ? parseFloat(detail.IGSTAmount) || 0
      : 0,

  DiscountAmt:
    detail.DiscountAmt !== null &&
    detail.DiscountAmt !== undefined
      ? parseFloat(detail.DiscountAmt) || 0
      : 0,
}));

  // ==============================
  // OPEN EDIT FORM
  // ==============================
  const invoiceDate = convertDateForInput(
    invheader.InvoiceDate?.date
  );

  setIsDrawerOpen(true);

  setInvoiceNo(invheader.InvoiceNo);

  setInvoiceDate(invoiceDate);

  setPhone(invheader.ContactNo);

  setDevice(getDeviceForLoggedInUser());

  // ==============================
  // BILL HEADER FIELDS
  // ==============================
  setBillFor(invheader.BillFor || "");

  setMachineID(
    invheader.MachineID
      ? String(invheader.MachineID)
      : ""
  );

  setIsGST(Number(invheader.IsGST) === 1);

  // ==============================
  // RESET CURRENT PRODUCT INPUT
  // ==============================
 // ==============================
// LOAD FIRST SAVED PRODUCT INTO INPUT
// ==============================
if (mappedRows.length > 0) {
  const firstRow = mappedRows[0];

  setEditingRow(0);

  setSelectedProductId(firstRow.ProductId);
  setProductName(firstRow.ProductName || "");

  setQuantity(firstRow.Quantity ?? "");
  setRate(firstRow.Rate ?? "");
  SetAmount(firstRow.Amount ?? "");

  setDiscount(firstRow.DiscountAmt ?? 0);

  setCGST(firstRow.CGSTPercentage ?? 0);
  setCGSTAmount(firstRow.CGSTAmount ?? 0);

  setSGST(firstRow.SGSTPercentage ?? 0);
  setSGSTAmount(firstRow.SGSTAmount ?? 0);

  setIGST(firstRow.IGSTPercentage ?? 0);
  setIGSTAmount(firstRow.IGSTAmount ?? 0);
} else {
  setEditingRow(null);

  setQuantity("");
  setRate("");
  SetAmount("");
  setDiscount("");

  setCGST("");
  setCGSTAmount("");

  setSGST("");
  setSGSTAmount("");

  setIGST("");
  setIGSTAmount("");
}


  // ==============================
  // PAYMENT DETAILS
  // ==============================
  setPaymentMode(invheader.PaymentMode || "");

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

  setDiscount(
    invheader.Discount != null
      ? String(invheader.Discount)
      : ""
  );

  setReceivedAmount(
    invheader.ReceivedAmount != null
      ? String(invheader.ReceivedAmount)
      : ""
  );

  setTransport(
    invheader.Transport != null
      ? String(invheader.Transport)
      : ""
  );

  // ==============================
  // SET SAVED PRODUCTS
  // ==============================
  setRows(mappedRows);

  // ==============================
  // EDIT MODE
  // ==============================
  setIsEditing(true);

  setEditId(row.original?.Id);

  handleMenuOpen();

  fetchInvoiceHeader();
};

  //table
  const [pageNo, setPageNo] = useState(1);
  //for preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);



  // ======================================================
// CUSTOMER-WISE DUE
// ======================================================

const [previousBalanceDue, setPreviousBalanceDue] = useState(0);
const [currentInvoiceDue, setCurrentInvoiceDue] = useState(0);
const [totalOutstanding, setTotalOutstanding] = useState(0);


const isSubmittingRef = useRef(false);
const [isSaving, setIsSaving] = useState(false);


const savedPreviewReceived = parseFloat(
  previewData?.ReceivedAmount
);

const previewReceivedAmount =
  !Number.isNaN(savedPreviewReceived)
    ? savedPreviewReceived
    : (parseFloat(previewData?.CashAmount) || 0) +
      (parseFloat(previewData?.OnlineAmount) || 0);

const previewTotal =
  parseFloat(previewData?.Total) || 0;

const previewRefund = Math.max(
  previewReceivedAmount - previewTotal,
  0
);

const previewCurrentDue = Math.max(
  previewTotal - previewReceivedAmount,
  0
);

const previewPreviousDue =
  Number(previewData?.PreviousBalanceDue || 0);

const previewTotalOutstanding =
  previewPreviousDue +
  previewCurrentDue;



  const columns = useMemo(
  () => [
  {
  accessorKey: "InvoiceNo",
  header: "Bill No",
  size: 80,
  Cell: ({ row }) => (
    <span>
      {row.original?.InvoiceNo || "-"}
    </span>
  ),
},

    {
      accessorKey: "InvoiceDate.date",
      header: "Invoice Date",
      size: 80,
      Cell: ({ cell }) => (
        <span>
          {cell.getValue()
            ? moment(cell.getValue()).format("DD-MM-YYYY")
            : "-"}
        </span>
      ),
    },

    // ======================================================
    // CUSTOMER NAME
    // ======================================================
    {
      header: "Customer Name",
      size: 120,
      accessorFn: (row) =>
        row?.accountDetails?.AccountName || "N/A",
      Cell: ({ cell }) => (
        <span>{cell.getValue()}</span>
      ),
    },

    // ======================================================
    // CATEGORY
    // ======================================================
    {
      header: "Category",
      size: 100,

      accessorFn: (row) => {
        const customerType = String(
          row?.accountDetails?.CustomerType ||
            row?.addressDetails?.CustomerType ||
            row?.CustomerType ||
            ""
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

    // ======================================================
    // TOTAL
    // ======================================================
    {
      accessorKey: "Total",
      header: "Total",
      size: 80,
    },

    // ======================================================
    // ACTIONS
    // ======================================================
    {
      header: "Actions",
      size: 200,

      Cell: ({ row }) => (
        <Box
          display="flex"
          gap={1}
          alignItems="center"
        >
          {/* EDIT */}
          <Button
            sx={{
              background:
                "var(--primary-color)",
            }}
            variant="contained"
            size="small"
            onClick={() => {
              handleEdit(row);
            }}
          >
            Edit
          </Button>

          {/* PREVIEW */}
          <Button
            variant="contained"
            sx={{
              background:
                "var(--complementary-color)",
            }}
            size="small"
            onClick={async () => {
              try {
                const invoiceId =
                  row.original?.Id;

                if (!invoiceId) {
                  toast.error(
                    "Invoice ID not found."
                  );
                  return;
                }

                // ==========================================
                // FETCH SAVED INVOICE DETAILS
                // ==========================================
                const detailResponse =
                  await axios.get(
                    `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${invoiceId}`
                  );

                const details =
                  Array.isArray(
                    detailResponse.data
                  )
                    ? detailResponse.data
                    : detailResponse.data?.data ||
                      [];

                console.log(
                  "PREVIEW INVOICE DETAIL RESPONSE:",
                  details
                );

                // ==========================================
                // ADD PRODUCT NAME
                // ==========================================
                const invdetail =
                  details.map((detail) => {
                    const matchedMaterial =
                      productOptions.find(
                        (item) =>
                          item.value?.toString() ===
                          detail.ProductId?.toString()
                      );

                    return {
                      ...detail,
                      ProductName:
                        matchedMaterial?.label ||
                        "Unknown",
                    };
                  });

               // ==========================================
// FETCH PREVIOUS CUSTOMER DUE FOR PREVIEW
// ==========================================

const previousDueForPreview =
  await fetchPreviousBalance(
    row.original?.AccountId,
    invoiceId
  );

const previewTotal =
  Number(row.original?.Total || 0);

const previewReceived =
  row.original?.ReceivedAmount != null
    ? Number(row.original.ReceivedAmount || 0)
    : (Number(row.original?.CashAmount || 0) +
       Number(row.original?.OnlineAmount || 0));

const previewCurrentDue = Math.max(
  previewTotal - previewReceived,
  0
);

const previewOutstanding =
  previousDueForPreview + previewCurrentDue;

// ==========================================
// SET PREVIEW DATA
// ==========================================

const previewInvoice = {
  ...row.original,

  PreviousBalanceDue: Number(
    previousDueForPreview.toFixed(2)
  ),

  CurrentInvoiceDue: Number(
    previewCurrentDue.toFixed(2)
  ),

  BalanceDue: Number(
    previewOutstanding.toFixed(2)
  ),

  invdetail,
};

                setPreviewData(
                  previewInvoice
                );

                setPreviewOpen(true);

                console.log(
                  "PREVIEW DATA:",
                  previewInvoice
                );
              } catch (error) {
                console.error(
                  "Error fetching invoice details for preview:",
                  error
                );

                toast.error(
                  "Unable to fetch invoice details."
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
    const createdOn =
      row?.CreatedOn?.date ||
      row?.CreatedOn ||
      "";

    const updatedOn =
      row?.UpdatedOn?.date ||
      row?.UpdatedOn ||
      "";

    const updateCount =
      Number(row?.UpdateCount ?? 0);

    const isEdited =
      updateCount > 1 ||
      (
        createdOn &&
        updatedOn &&
        String(createdOn) !== String(updatedOn)
      );

    return isEdited ? "Edited" : "-";
  },

  Cell: ({ row }) => {
    const invoice = row.original;

    const createdOn =
      invoice?.CreatedOn?.date ||
      invoice?.CreatedOn ||
      "";

    const updatedOn =
      invoice?.UpdatedOn?.date ||
      invoice?.UpdatedOn ||
      "";

    const updateCount =
      Number(invoice?.UpdateCount ?? 0);

    const isEdited =
      updateCount > 1 ||
      (
        createdOn &&
        updatedOn &&
        String(createdOn) !== String(updatedOn)
      );

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

    return (
      <Button
        variant="contained"
        size="small"
        sx={{
          background: "var(--primary-color)",
          minWidth: "80px",
          fontWeight: 600,
        }}
        onClick={() => {
          handleInvoiceHistoryClick(invoice);
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
    productOptions,
    pageNo,
  ]
);




  // =========================
  // Integration
  // =========================

  // Invoice Details
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const [phone, setPhone] = useState("");

  const [device, setDevice] = useState("");

  const [currentTime, setCurrentTime] = useState("");

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
  const discountRef = useRef(null);
  const receivedAmountRef = useRef(null);

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

  const [selectedCustomerName, setSelectedCustomerName] = useState("");

  const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

  const [newCustomerAddress, setNewCustomerAddress] = useState("");

  const [newCustomerContact, setNewCustomerContact] = useState("");

  const [acctGSTNo, setacctGSTNo] = useState("");

  useEffect(() => {
    // fetchAccounts();

    fetchProduct();

    fetchMachines();

    fetchInvoiceHeader();

    setDevice(getDeviceForLoggedInUser());
  }, []);

  //fetch customer from  account table



  useEffect(() => {
  const updateTime = () => {
    const now = new Date();

    setCurrentTime(
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  };

  updateTime();

  const timer = setInterval(updateTime, 1000);

  return () => clearInterval(timer);
}, []);
  

 const fetchProduct = async () => {
  try {
    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster&RateType=Dealer",
    );

    const data = await response.json();

    console.log("DEALER PRODUCT API RESPONSE:", data);

    productvalidation(data);
  } catch (error) {
    console.error("Error fetching dealer products:", error);
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
  const options = data
    .filter(
      (account) =>
        account?.ProductName &&
        String(account.ProductName).trim() !== ""
    )
    .map((account) => ({
      value: account?.Id,
      label: account?.ProductName,
      cgst: account?.CGSTPercentage,
      sgst: account?.SGSTPercentage,
      igst: account?.IGSTPercentage,

      // Dealer API मधून automatic Dealer Rate
      purchaseRate: account?.Rate,
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

  // Keep Device according to logged-in user
  setDevice(getDeviceForLoggedInUser());

  // =========================
  // NEW BILL HEADER FIELDS
  // =========================
  setBillFor("");
  setMachineID("");
  setIsGST(false);

  // =========================
  // Customer
  // =========================
  setSelectedAccount("");
  setSelectedCustomerName("");

  // =========================
  // Product Details
  // =========================
  setProduct("");
  setQuantity("");
  setRate("");
  SetAmount("");

  // =========================
  // Discount
  // =========================
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

  // =========================
  // Mix Payment
  // =========================
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
    phone: "",
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

  // =========================
  // Balance / Outstanding
  // =========================
  setPreviousBalanceDue(0);
  setCurrentInvoiceDue(0);
  setTotalOutstanding(0);
};


// ======================================================
// GET FINAL ROWS INCLUDING LAST PRODUCT
// EVEN IF ENTER IS NOT PRESSED
// ======================================================
const getRowsWithPendingProduct = () => {
  const finalRows = [...rows];

  // Existing row edit करत असताना
  // pending product automatically add करू नका
  if (editingRow !== null) {
    return finalRows;
  }

  const hasPendingProduct =
    selectedProductID &&
    quantity !== "" &&
    rate !== "" &&
    Number(quantity) > 0 &&
    Number(rate) > 0;

  if (!hasPendingProduct) {
    return finalRows;
  }

  const selectedOption = productOptions.find(
    (option) =>
      String(option.value) === String(selectedProductID)
  );

  const pendingQuantity = parseFloat(quantity) || 0;
  const pendingRate = parseFloat(rate) || 0;
  const pendingAmount =
    pendingQuantity * pendingRate;

  const pendingCGSTPercentage =
    parseFloat(cgst) || 0;

  const pendingSGSTPercentage =
    parseFloat(sgst) || 0;

  const pendingIGSTPercentage =
    parseFloat(igst) || 0;

  const pendingCGSTAmount =
    parseFloat(cgstAmount) ||
    ((pendingCGSTPercentage * pendingAmount) / 100);

  const pendingSGSTAmount =
    parseFloat(sgstAmount) ||
    ((pendingSGSTPercentage * pendingAmount) / 100);

  const pendingIGSTAmount =
    parseFloat(igstAmount) ||
    ((pendingIGSTPercentage * pendingAmount) / 100);

  const pendingRow = {
    Id: null,
    InvoiceId: null,

    ProductId: selectedProductID,

    ProductName:
      productName ||
      selectedProductName ||
      selectedOption?.label ||
      "",

    Quantity: pendingQuantity,
    Rate: pendingRate,
    Amount: pendingAmount,

    DiscountAmt: 0,

    CGSTPercentage: pendingCGSTPercentage,
    CGSTAmount: pendingCGSTAmount,

    SGSTPercentage: pendingSGSTPercentage,
    SGSTAmount: pendingSGSTAmount,

    IGSTPercentage: pendingIGSTPercentage,
    IGSTAmount: pendingIGSTAmount,
  };

  finalRows.push(pendingRow);

  console.log(
    "LAST PRODUCT AUTO INCLUDED:",
    pendingRow
  );

  return finalRows;
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
  // 1. PREVENT DOUBLE SUBMIT
  // ======================================================

  if (isSubmittingRef.current) {
    console.log(
      "SUBMIT ALREADY IN PROGRESS - IGNORING"
    );
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
  // 3. RECEIVED AMOUNT VALIDATION
  // ======================================================

  if (!validateReceivedAmount()) {
    console.log(
      "RECEIVED AMOUNT VALIDATION FAILED"
    );
    return;
  }

  // ======================================================
  // 4. MIX PAYMENT VALIDATION
  // ======================================================

  if (!validatePaymentSplit()) {
    console.log(
      "PAYMENT VALIDATION FAILED"
    );
    return;
  }

  const finalRows = getRowsWithPendingProduct();

console.log("FINAL ROWS TO SAVE:", finalRows);

  // ======================================================
  // 5. LOCK SUBMIT
  // ======================================================

  isSubmittingRef.current = true;
setIsSaving(true);

let printWindow = null;

  try {
    // ======================================================
    // 6. OPEN PRINT WINDOW ONLY IF PRINT REQUESTED
    // ======================================================

    if (shouldPrint) {
      printWindow = window.open("", "_blank");

      if (!printWindow) {
        toast.error(
          "Please allow popups for printing."
        );

        return;
      }

      // ======================================================
      // TEMPORARY PRINT WINDOW CONTENT
      // ======================================================

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

    // ======================================================
    // 7. FORMAT INVOICE DATE
    // ======================================================

    const formattedInvoicedate =
      moment(invoiceDate).format("YYYY-MM-DD");

    // ======================================================
    // 8. FETCH PREVIOUS CUSTOMER DUE BEFORE SAVE
    // ======================================================

    const previousDueForSave =
      await fetchPreviousBalance(
        selectedAccount,
        isEditing ? editId : null
      );

    // ======================================================
    // 9. CURRENT INVOICE DUE
    // ======================================================

    const currentDueForSave = Math.max(
      (parseFloat(total) || 0) -
        (parseFloat(receivedAmount) || 0),
      0
    );

    // ======================================================
    // 10. TOTAL CUSTOMER OUTSTANDING
    // ======================================================

    const totalOutstandingForSave =
      Number(previousDueForSave || 0) +
      Number(currentDueForSave || 0);

    console.log(
      "PREVIOUS DUE:",
      previousDueForSave
    );

    console.log(
      "CURRENT INVOICE DUE:",
      currentDueForSave
    );

    console.log(
      "TOTAL OUTSTANDING:",
      totalOutstandingForSave
    );

    // ======================================================
    // 11. SET CUSTOMER DUE STATES
    // ======================================================

    setPreviousBalanceDue(
      Number(
        Number(previousDueForSave || 0).toFixed(2)
      )
    );

    setCurrentInvoiceDue(
      Number(
        Number(currentDueForSave || 0).toFixed(2)
      )
    );

    setTotalOutstanding(
      Number(
        Number(totalOutstandingForSave || 0).toFixed(2)
      )
    );

    // ======================================================
    // 12. INVOICE HEADER DATA
    // ======================================================

  const invoiceheaderdata = {
  Id: isEditing ? editId : "",

  InvoiceNo: invoiceNo,

  InvoiceDate: formattedInvoicedate,

  AccountId: selectedAccount
    ? selectedAccount
    : customerName,

  ContactNo: phone,

  BillFor: billFor || "",

  MachineID: machineID
    ? parseInt(machineID, 10)
    : 0,

  IsGST: isGST ? 1 : 0,

  PaymentMode: paymentMode || "",

  CashAmount:
    parseFloat(cashAmount) || 0,

  OnlineAmount:
    parseFloat(onlineAmount) || 0,

  Discount:
    parseFloat(discount) || 0,

  Transport:
    parseFloat(transport) || 0,

  CGSTAmount:
    parseFloat(cgstTotal) || 0,

  SGSTAmount:
    parseFloat(sgstTotal) || 0,

  IGSTAmount:
    parseFloat(igstTotal) || 0,

  Total:
    parseFloat(total) || 0,

  ReceivedAmount:
    parseFloat(receivedAmount) || 0,

  SubTotal:
    parseFloat(subTotalcal) || 0,

  // =========================
  // Logged-in User Details
  // =========================
  CreatedBy: !isEditing ? userId : undefined,

  UpdatedBy: isEditing ? userId : undefined,

  // =========================
  // Logged-in User Device
  // =========================
  Device: device || "",
};

    console.log(
      "INVOICE HEADER DATA TO API:",
      invoiceheaderdata
    );

    // ======================================================
    // 13. SELECT HEADER API
    // ======================================================

    const invoiceurl = isEditing
      ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
      : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

    console.log(
      "Saving invoice using:",
      invoiceurl
    );

    // ======================================================
    // 14. SAVE INVOICE HEADER
    // ======================================================

    const response = await axios.post(
      invoiceurl,
      qs.stringify(invoiceheaderdata),
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
    // 15. GET INVOICE ID
    // ======================================================

   const invoiceId = isEditing
  ? editId
  : parseInt(response.data.Id, 10);

const savedInvoiceNo = isEditing
  ? invoiceNo
  : response.data.InvoiceNo;

console.log("Invoice ID:", invoiceId);
console.log("Saved Invoice No:", savedInvoiceNo);

    console.log(
      "Invoice ID:",
      invoiceId
    );

    if (!invoiceId) {
      throw new Error(
        "Invoice ID was not received from server."
      );
    }

    // ======================================================
    // 16. SAVE INVOICE DETAILS
    // ======================================================

   for (const [index, row] of finalRows.entries()) {
      const rowData = {
        Id: row.Id
          ? parseInt(row.Id, 10)
          : "",

        InvoiceId:
          parseInt(invoiceId, 10),

        SerialNo: index + 1,

        ProductId:
          parseInt(row.ProductId, 10),

        Quantity:
          parseFloat(row.Quantity) || 0,

        Rate:
          parseFloat(row.Rate) || 0,

        Amount:
          parseFloat(row.Amount) || 0,

        CGSTPercentage:
          parseFloat(row.CGSTPercentage) || 0,

        CGSTAmount:
          parseFloat(row.CGSTAmount) || 0,

        SGSTPercentage:
          parseFloat(row.SGSTPercentage) || 0,

        SGSTAmount:
          parseFloat(row.SGSTAmount) || 0,

        IGSTPercentage:
          parseFloat(row.IGSTPercentage) || 0,

        IGSTAmount:
          parseFloat(row.IGSTAmount) || 0,
      };

      console.log(
        `Invoice Detail ${index + 1}:`,
        rowData
      );

      const invoicdedetailurl = row.Id
        ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
        : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

      await axios.post(
        invoicdedetailurl,
        qs.stringify(rowData),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );
    }

    // ======================================================
    // 17. CUSTOMER NAME FOR PRINT
    // ======================================================

    const customerNameForPrint =
      accountOptions.find(
        ({ Id }) =>
          String(Id) ===
          String(selectedAccount)
      )?.AccountName ||
      accountName ||
      "-";

    // ======================================================
    // 18. PREPARE PRINT DATA
    // ======================================================

const printData = {
  ...invoiceheaderdata,

  Id: invoiceId,

  InvoiceNo: savedInvoiceNo,

  Device: device || "-",

  PaymentMode: paymentMode || "-",

  PreviousBalanceDue: Number(
    Number(previousDueForSave || 0).toFixed(2)
  ),

  CurrentInvoiceDue: Number(
    Number(currentDueForSave || 0).toFixed(2)
  ),

  BalanceDue: Number(
    Number(totalOutstandingForSave || 0).toFixed(2)
  ),

  accountDetails: {
    AccountName: customerNameForPrint,
  },

  customerName: customerNameForPrint,

  invdetail: finalRows.map((row) => ({
    ...row,

    ProductName:
      row.ProductName ||
      productOptions.find(
        (option) =>
          String(option.value) ===
          String(row.ProductId)
      )?.label ||
      "Unknown",

    Quantity: parseFloat(row.Quantity) || 0,
    Rate: parseFloat(row.Rate) || 0,
    Amount: parseFloat(row.Amount) || 0,

    DiscountAmt:
      parseFloat(row.DiscountAmt) || 0,

    CGSTPercentage:
      parseFloat(row.CGSTPercentage) || 0,

    CGSTAmount:
      parseFloat(row.CGSTAmount) || 0,

    SGSTPercentage:
      parseFloat(row.SGSTPercentage) || 0,

    SGSTAmount:
      parseFloat(row.SGSTAmount) || 0,

    IGSTPercentage:
      parseFloat(row.IGSTPercentage) || 0,

    IGSTAmount:
      parseFloat(row.IGSTAmount) || 0,
  })),
};

    console.log(
      "PRINT DATA:",
      printData
    );

    // ======================================================
    // 19. SUCCESS MESSAGE
    // ======================================================

    toast.success(
      isEditing
        ? "Sales Entry- Dealer Updated successfully!"
        : "Sales Entry- Dealer Created successfully!"
    );

    // ======================================================
    // 20. PRINT ONLY IF REQUESTED
    // ======================================================

    if (
      shouldPrint &&
      printWindow
    ) {
      console.log(
        "CALLING generatePDF..."
      );

      generatePDF(
        printData,
        printWindow
      );
    } else {
      console.log(
        "SAVE ONLY - PRINT NOT REQUESTED"
      );
    }

    // ======================================================
    // 21. CLOSE DRAWER
    // ======================================================

    setIsDrawerOpen(false);

    // ======================================================
    // 22. RESET FORM
    // ======================================================

    resetForm();

    // ======================================================
    // 23. REFRESH TABLE DATA
    // ======================================================

    await fetchInvoiceHeader();

  } catch (error) {
    // ======================================================
    // ERROR
    // ======================================================

    console.error(
      "Error submitting invoice:",
      error
    );

    // ======================================================
    // CLOSE PRINT WINDOW ON ERROR
    // ======================================================

    if (
      printWindow &&
      !printWindow.closed
    ) {
      printWindow.close();
    }

    setIsDrawerOpen(false);

    toast.error(
      isEditing
        ? "Sales Entry- Dealer Updated unsuccessfully!"
        : "Sales Entry- Dealer unsuccessfully!"
    );

  } finally {
    // ======================================================
    // RELEASE SUBMIT LOCK
    // ======================================================

    isSubmittingRef.current = false;
     setIsSaving(false);

    console.log(
      "SUBMIT LOCK RELEASED"
    );
  }
};

// ======================================================
// CTRL + S = SAVE ONLY
// ======================================================

useEffect(() => {
  const handleCtrlS = (event) => {
    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      event.stopPropagation();

      if (!isDrawerOpen) {
        return;
      }

      if (event.repeat) {
        return;
      }

      console.log("CTRL + S PRESSED - SAVE ONLY");

      handleSubmit(event, false);
    }
  };

  window.addEventListener(
    "keydown",
    handleCtrlS,
    true
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleCtrlS,
      true
    );
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
const received =
  parseFloat(receivedAmount) || 0;

const grandTotal =
  parseFloat(total) || 0;

// Current bill due
const balanceDue = Math.max(
  grandTotal - received,
  0
);

// Refund
const refund = Math.max(
  received - grandTotal,
  0
);

// Total customer outstanding
const customerOutstanding =
  Number(previousBalanceDue || 0) +
  Number(balanceDue || 0);

// ======================================================
// PAYMENT STATUS
// ======================================================

const isPaid =
  balanceDue === 0 && received > 0;
  

const handleReceivedAmountChange = (e) => {
  const value = e.target.value;

  // Empty value
  if (value === "") {
    setReceivedAmount("");

    if (paymentMode === "C") {
      setCashAmount("");
      setOnlineAmount("");
    }

    if (paymentMode === "O") {
      setCashAmount("");
      setOnlineAmount("");
    }

    // Mix मध्ये Cash + Online manually enter होतात
    return;
  }

  const receivedValue = parseFloat(value);

  // Negative amount not allowed
  if (receivedValue < 0) {
    return;
  }

  // Main Received Amount
  setReceivedAmount(value);

  // Cash payment
  if (paymentMode === "C") {
    setCashAmount(value);
    setOnlineAmount("");
  }

  // Online payment
  if (paymentMode === "O") {
    setOnlineAmount(value);
    setCashAmount("");
  }

  // Mix payment
  // Cash + Online manually enter होतात
};


const validateReceivedAmount = () => {
  const receivedValue = parseFloat(receivedAmount);
  const totalValue = parseFloat(total) || 0;

  // Received Amount रिकामा असल्यास
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

  // Negative amount
  if (receivedValue < 0) {
    toast.error("Received amount cannot be negative.");

    receivedAmountRef.current?.focus();
    receivedAmountRef.current?.select();

    return false;
  }

  // Received > Current Bill Total
  if (receivedValue > totalValue) {
    const refundAmount =
      receivedValue - totalValue;

    toast.error(
      `Received amount ₹${receivedValue.toFixed(
        2
      )} is greater than bill total ₹${totalValue.toFixed(
        2
      )}. Refund ₹${refundAmount.toFixed(
        2
      )} cannot be saved.`
    );

    receivedAmountRef.current?.focus();
    receivedAmountRef.current?.select();

    return false;
  }

  // Received <= Total is allowed
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

    if (splitTotal !== received) {
      toast.error(`Cash + Online amount must be ₹${received.toFixed(2)}`);

      return false;
    }

    return true;
  };

  

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

    setEditingRow(index);

    setSelectedProductId(row.ProductId);
    setProductName(row.ProductName);

    const q = row.Quantity || "";
    const r = row.Rate || "";

    setQuantity(q);
    setRate(r);

    const qtyNum = parseFloat(q) || 0;
    const rateNum = parseFloat(r) || 0;

    const baseAmt = qtyNum * rateNum;

    setBaseAmount(baseAmt);
    SetAmount(baseAmt);

    setCGST(row.CGSTPercentage || 0);
    setSGST(row.SGSTPercentage || 0);
    setIGST(row.IGSTPercentage || 0);

    calculateCgstAmount(row.CGSTPercentage || 0, baseAmt);

    calculateSgstAmount(row.SGSTPercentage || 0, baseAmt);

    calculateIgstAmount(row.IGSTPercentage || 0, baseAmt);
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

  const handleProductKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Product validation
    if (!selectedProductID) {
      toast.error("Please select a product.");
      return;
    }

    // Quantity validation
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Please enter quantity.");
      quantityRef.current?.focus();
      return;
    }

    // Rate validation
    if (!rate || Number(rate) <= 0) {
      toast.error("Please enter rate.");
      rateRef.current?.focus();
      return;
    }

    // Add / update row
    handleSaveOrAddRow();

    // After row is added, focus Product field
    setTimeout(() => {
      productRef.current?.focus();
    }, 0);
  };

const handleSaveOrAddRow = () => {
  // ==============================
  // 1. PRODUCT VALIDATION
  // ==============================
  if (!selectedProductID) {
    alert("Please select a product before adding the row.");
    return;
  }

  // ==============================
  // 2. QUANTITY
  // ==============================
  const finalQuantity = parseFloat(quantity) || 1;

  // ==============================
  // 3. RATE
  // ==============================
  const finalRate = parseFloat(rate) || 0;

  // ==============================
  // 4. AMOUNT
  // ==============================
  const finalAmount = finalQuantity * finalRate;

  // ==============================
  // 5. SELECTED PRODUCT
  // ==============================
  const selectedOption = productOptions.find(
    (option) =>
      String(option.value) === String(selectedProductID)
  );

  const finalProductName =
    productName ||
    selectedProductName ||
    selectedOption?.label ||
    "";

  // ==============================
  // 6. GST VALUES
  // Keep internally for backend
  // ==============================
  const finalCGST = parseFloat(cgst) || 0;
  const finalCGSTAmount = parseFloat(cgstAmount) || 0;

  const finalSGST = parseFloat(sgst) || 0;
  const finalSGSTAmount = parseFloat(sgstAmount) || 0;

  const finalIGST = parseFloat(igst) || 0;
  const finalIGSTAmount = parseFloat(igstAmount) || 0;

  // ==============================
  // 7. DISCOUNT
  // ==============================
  const finalDiscount =
    discount !== ""
      ? parseFloat(discount) || 0
      : 0;

  // ==============================
  // 8. EDIT EXISTING ROW
  // ==============================
  if (editingRow !== null) {
    setRows((prevRows) =>
      prevRows.map((row, index) => {
        if (index !== editingRow) {
          return row;
        }

        return {
          ...row,

          ProductId: selectedProductID,

          ProductName: finalProductName,

          Quantity: finalQuantity,

          Rate: finalRate,

          Amount: finalAmount,

          // Internal GST values
          CGSTPercentage: finalCGST,
          CGSTAmount: finalCGSTAmount,

          SGSTPercentage: finalSGST,
          SGSTAmount: finalSGSTAmount,

          IGSTPercentage: finalIGST,
          IGSTAmount: finalIGSTAmount,

          DiscountAmt: finalDiscount,
        };
      })
    );

    toast.success("Product row updated.");
  }

  // ==============================
  // 9. ADD NEW ROW
  // ==============================
  else {
    const newRow = {
      Id: null,

      InvoiceId: editId || null,

      ProductId: selectedProductID,

      ProductName: finalProductName,

      Quantity: finalQuantity,

      Rate: finalRate,

      Amount: finalAmount,

      // Internal GST values
      CGSTPercentage: finalCGST,
      CGSTAmount: finalCGSTAmount,

      SGSTPercentage: finalSGST,
      SGSTAmount: finalSGSTAmount,

      IGSTPercentage: finalIGST,
      IGSTAmount: finalIGSTAmount,

      DiscountAmt: finalDiscount,
    };

    setRows((prevRows) => [
      ...prevRows,
      newRow,
    ]);

    toast.success("Product added.");
  }

  // ==============================
  // 10. CLEAR ONLY PRODUCT INPUT
  // ==============================
  resetFields();
  setEditingRow(null);
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
        document.querySelector(
          '[name="paymentMode"]'
        )?.focus();
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
          'input[placeholder="Select Customer"]'
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


  const [text, setText] = useState("");

  const customerDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setText("");
      }
    };

    if (!showDropdown) {
      return;
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const serchCustomers = async () => {
    try {
      // Search रिकामी असेल तर list clear करा
      if (!text.trim()) {
        setAccountOptions([]);
        return;
      }

      // 1. Search Account
      const response = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${encodeURIComponent(text)}`,
        {
          method: "GET",
          redirect: "follow",
        },
      );

      const result = await response.json();

      console.log("ACCOUNT SEARCH RESPONSE:", result);

      if (!Array.isArray(result)) {
        setAccountOptions([]);
        return;
      }

      // 2. प्रत्येक account चा Address / CustomerType fetch करा
      const dealerCustomers = [];

      for (const customer of result) {
        try {
          const addressResponse = await fetch(
            `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customer.Id}`,
            {
              method: "GET",
              redirect: "follow",
            },
          );

          const addressResult = await addressResponse.json();

          console.log(`Address for ${customer.AccountName}:`, addressResult);

          const address = Array.isArray(addressResult)
            ? addressResult[0]
            : null;

          // 3. फक्त Dealer घ्या
          if (address && String(address.CustomerType).toUpperCase() === "D") {
            dealerCustomers.push({
              ...customer,

              CustomerType: address.CustomerType,

              GSTNo: address.GSTNo || "",


                ContactNo:
    address.ContactNo ||
    address.contactNo ||
    address.ContactNumber ||
    address.contactNumber ||
    address.MobileNo ||
    address.MobileNumber ||
    "",

              Address1:
                address.Address1 ||
                address.address1 ||
                address.Address ||
                address.address ||
                address.AddressLine1 ||
                address.addressLine1 ||
                "",

              Address2:
                address.Address2 ||
                address.address2 ||
                address.AddressLine2 ||
                address.addressLine2 ||
                "",

              Address3:
                address.Address3 ||
                address.address3 ||
                address.AddressLine3 ||
                address.addressLine3 ||
                "",
            });
          }
        } catch (addressError) {
          console.error(
            `Address fetch failed for AccountId ${customer.Id}:`,
            addressError,
          );
        }
      }

      console.log("DEALER CUSTOMERS:", dealerCustomers);

      // 4. फक्त Dealer records dropdown ला द्या
      setAccountOptions(dealerCustomers);
    } catch (error) {
      console.error("Dealer customer search error:", error);

      setAccountOptions([]);
    }
  };

  useEffect(() => {
    serchCustomers();
  }, [text]);

  // create new Customer
  const [accountName, setAccountName] = useState("");
  const [customerName, setCustomerName] = useState("");
  

  const CreateCustomerMaster = async () => {
    // ============================================================
    // DEALER NAME
    // ============================================================

    const newCustomerName = accountName.trim();

    if (!newCustomerName) {
      toast.error("Please enter dealer name");
      return;
    }

    // ============================================================
    // DEALER ADDRESS
    // ============================================================

    const newAddress = newCustomerAddress.trim();

    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // ============================================================
    // CREATE DEALER ACCOUNT
    // ============================================================

    const urlencoded = new URLSearchParams();

    urlencoded.append("AccountName", newCustomerName);

    urlencoded.append("GroupId", "3");

    urlencoded.append("SubGroupId", "1");

    urlencoded.append("OpeningBalance", "100");

    urlencoded.append("DrORCr", "D");

    urlencoded.append("TypeCode", "C");

    urlencoded.append("IsSystem", "false");

    try {
      // ==========================================================
      // 1. CREATE ACCOUNT
      // ==========================================================

      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
        {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow",
        },
      );

      const result = await response.json();

      console.log("Dealer Created:", result);

      if (!result || !result.Id) {
        throw new Error("Dealer ID not received from API.");
      }

      // ==========================================================
      // 2. CREATE ADDRESS
      // ==========================================================

      const addressData = new URLSearchParams();

      addressData.append("AccountId", result.Id);

      

      // Dealer
      addressData.append("CustomerType", "D");

      // Keep GST in database
      // It will NOT be printed on invoice
      addressData.append("GSTNo", "270000000000000");

      addressData.append("Address1", newAddress);

      addressData.append("Address", newAddress);


      addressData.append("MobileNo", newCustomerContact.trim());

     

      const addressResponse = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
        {
          method: "POST",
          headers: myHeaders,
          body: addressData,
          redirect: "follow",
        },
      );

      const addressResult = await addressResponse.json();

      console.log("Dealer Address Created:", addressResult);

      // ==========================================================
      // 3. CREATE LOCAL DEALER OBJECT
      // ==========================================================


const newDealer = {
  Id: result.Id,
  AccountName: newCustomerName,
  CustomerType: "D",
  GSTNo: "270000000000000",

  Address1: newAddress,
  Address: newAddress,

  ContactNo: newCustomerContact.trim(),
  MobileNo: newCustomerContact.trim(),
};

      // ==========================================================
      // 4. ADD DEALER TO CURRENT DROPDOWN
      // ==========================================================

      setAccountOptions((previousOptions) => {
        const alreadyExists = previousOptions.some(
          (dealer) => String(dealer.Id) === String(result.Id),
        );

        if (alreadyExists) {
          return previousOptions;
        }

        return [newDealer, ...previousOptions];
      });

      // ==========================================================
      // 5. SELECT NEW DEALER IMMEDIATELY
      // ==========================================================

      setSelectedAccount(String(result.Id));

      setSelectedCustomerName(newCustomerName);

      setSelectedCustomerAddress(newAddress);

      setPreviousBalanceDue(0);

      setPhone(newCustomerContact);

      // ==========================================================
      // 6. SUCCESS MESSAGE
      // ==========================================================

      toast.success("Dealer created successfully");

      // ==========================================================
      // 7. CLOSE CUSTOMER POPUP
      // ==========================================================

      setShowDropdown(false);

      // ==========================================================
      // 8. CLEAR INPUTS
      // ==========================================================

     setAccountName("");
setNewCustomerAddress("");
setNewCustomerContact("");
setText("");
    } catch (error) {
      console.error("Error creating dealer:", error);

      toast.error("Error creating dealer");
    }
  };
  //set GSTno
  const fetchAccounts = (customerId) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        const temp = Array.isArray(result) ? result[0] : null;

        console.log("GST DATA:", temp?.GSTNo);

        setacctGSTNo(String(temp?.GSTNo ?? ""));
      })
      .catch((error) => {
        console.error("GST fetch error:", error);
        setacctGSTNo("");
      });
  };


// ======================================================
// FETCH CUSTOMER SAVED CONTACT NUMBER
// FROM LAST SAVED INVOICE
// SAME LOGIC AS CATERERS
// ======================================================
const fetchCustomerContact = async (customerId) => {
  if (!customerId) {
    setPhone("");
    return;
  }

  try {
    const response = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
        customerId
      )}`
    );

    if (!response.ok) {
      throw new Error(`Contact API failed: ${response.status}`);
    }

    const result = await response.json();

    const addressData = Array.isArray(result)
      ? result[0]
      : result?.data || result;

    const savedMobile =
      addressData?.MobileNo ||
      addressData?.MobileNumber ||
      addressData?.ContactNo ||
      addressData?.ContactNumber ||
      "";

    console.log("DEALER SAVED MOBILE:", {
      customerId,
      addressData,
      savedMobile,
    });

    setPhone(String(savedMobile).trim());
  } catch (error) {
    console.error("Dealer customer mobile fetch error:", error);
    setPhone("");
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

      const defaultQty = 1;

      const defaultRate = parseFloat(newValue.purchaseRate) || 0;

      setQuantity(defaultQty);

      setRate(defaultRate);

      setTimeout(() => {
        quantityRef.current?.focus();
        quantityRef.current?.select();
      }, 0);

      const sameState =
        String(gstNo || "").substring(0, 2) ===
        String(acctGSTNo || "").substring(0, 2);

      const cgstValue = sameState ? newValue.cgst : "0";

      const sgstValue = sameState ? newValue.sgst : "0";

      const igstValue = !sameState ? newValue.igst : "0";

      setCGST(cgstValue);
      setSGST(sgstValue);
      setIGST(igstValue);

      // Calculate current input amount
      calculateAmount(defaultQty, defaultRate);
    } else {
      setSelectedProductId("");
      setProductName("");
      setRate("");
      setQuantity("");
      setSelectedProductName("");

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
  phone: "",
});

  const validateForm = () => {
   const newErrors = {
  invoiceDate: "",
  selectedAccount: "",
  paymentMode: "",
  rows: "",
  phone: "",
};

    let isValid = true;

    // Invoice Date
    if (!invoiceDate) {
      newErrors.invoiceDate = "Invoice date is required";

      isValid = false;
    } else {
      const invoiceDateObj = new Date(invoiceDate);

      const fromDateObj = new Date(fromdate);

      const toDateObj = new Date(todate);

      if (invoiceDateObj < fromDateObj) {
        newErrors.invoiceDate = `Invoice date cannot be before ${new Date(
          fromdate,
        ).toLocaleDateString()}`;

        isValid = false;
      } else if (invoiceDateObj > toDateObj) {
        newErrors.invoiceDate = `Invoice date cannot be after ${new Date(
          todate,
        ).toLocaleDateString()}`;

        isValid = false;
      }
    }

  // Customer Name
if (!selectedCustomerName?.trim()) {
  newErrors.selectedAccount = "Customer name is required";
  isValid = false;
}

// ==============================
// MOBILE NUMBER VALIDATION
// ==============================
const mobileDigits = String(phone || "").replace(/\D/g, "");

if (mobileDigits.length < 12) {
  newErrors.phone = "Valid mobile number is required";
  isValid = false;

  toast.error(
    "📱 Please enter a valid 10-digit mobile number to continue."
  );
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
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");

  useEffect(() => {
    const storedYearId = Cookies.get("YearId");
    const storedfromdate = Cookies.get("FromDate");
    const storedtodate = Cookies.get("ToDate");

    if (storedYearId) {
      setYearId(storedYearId);
      //console.log('storedYearId', storedYearId);
    } else {
      toast.error("Year is not set.");
    }
    if (storedfromdate) {
      setFromDate(storedfromdate);
      //console.log('storedfromdate', storedfromdate);
    } else {
      toast.error("FromDate is not set.");
    }

    if (storedtodate) {
      setToDate(storedtodate);
      // console.log('storedTodate', storedtodate);
    } else {
      toast.error("ToDate is not set.");
    }
  }, [yearid, fromdate, todate]);

  //for print

  // ======================================================
  // GENERATE PDF / DIRECT PRINT
  // ======================================================

  // ============================================================
  // GENERATE PDF / DIRECT PRINT
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
  console.log("SELECTED CUSTOMER NAME:", selectedCustomerName);
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

  if (
    !accountId &&
    Array.isArray(accountOptions) &&
    selectedCustomerName
  ) {
    const matchedAccount = accountOptions.find(
      (account) =>
        String(
          account?.AccountName ||
            account?.accountName ||
            account?.label ||
            ""
        )
          .trim()
          .toLowerCase() ===
        String(selectedCustomerName).trim().toLowerCase()
    );

    if (matchedAccount) {
      accountId =
        matchedAccount?.Id ||
        matchedAccount?.ID ||
        matchedAccount?.AccountId ||
        matchedAccount?.AccountID ||
        matchedAccount?.value ||
        matchedAccount?.id ||
        "";
    }
  }

  console.log("FINAL ACCOUNT ID:", accountId);

  // ============================================================
  // 5. CUSTOMER VARIABLES
  // ============================================================

  let customerName = "";
  let customerAddress1 = "";
  let customerAddress2 = "";
  let customerAddress3 = "";
  let customerGSTNo = "";
  let customerMobileNo = "";

  // ============================================================
  // 6. FETCH SELECTED CUSTOMER FROM ACCOUNT API
  // ============================================================

  if (accountId) {
    try {
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

     const accountResult = await accountResponse.json();

console.log("FULL ACCOUNT API RESPONSE:", accountResult);

const accountData = Array.isArray(accountResult)
  ? accountResult[0]
  : Array.isArray(accountResult?.data)
  ? accountResult.data[0]
  : accountResult?.data || accountResult;

console.log("FINAL ACCOUNT DATA FOR PRINT:", accountData);

      

      if (accountData) {
        customerName =
          accountData?.AccountName ||
          accountData?.accountName ||
          "";

        customerAddress1 =
          accountData?.Address1 ||
          accountData?.address1 ||
          "";

        customerAddress2 =
          accountData?.Address2 ||
          accountData?.address2 ||
          "";

        customerAddress3 =
          accountData?.Address3 ||
          accountData?.address3 ||
          "";

        customerGSTNo =
          accountData?.GSTNo ||
          accountData?.GSTNO ||
          accountData?.GstNo ||
          "";

        customerMobileNo =
          accountData?.MobileNo ||
          accountData?.MobileNumber ||
          accountData?.ContactNo ||
          accountData?.ContactNumber ||
          accountData?.PhoneNo ||
          accountData?.PhoneNumber ||
          "";
      }
    } catch (error) {
      console.error("CUSTOMER ACCOUNT API ERROR:", error);
    }
  } else {
    console.warn(
      "ACCOUNT ID NOT FOUND. Customer API was not called."
    );
  }

  // ============================================================
  // 7. FALLBACK CUSTOMER NAME
  // ============================================================

  if (!customerName) {
    customerName =
      printData?.accountDetails?.AccountName ||
      printData?.accountDetails?.accountName ||
      printData?.CustomerName ||
      printData?.customerName ||
      printData?.AccountName ||
      printData?.CustomerAccountName ||
      selectedCustomerName ||
      "-";
  }

  // ============================================================
  // 8. FALLBACK ADDRESS 1
  // ============================================================

  if (!customerAddress1) {
    customerAddress1 =
      printData?.accountDetails?.Address1 ||
      printData?.Address1 ||
      "";
  }

  // ============================================================
  // 9. FALLBACK ADDRESS 2
  // ============================================================

  if (!customerAddress2) {
    customerAddress2 =
      printData?.accountDetails?.Address2 ||
      printData?.Address2 ||
      "";
  }

  // ============================================================
  // 10. FALLBACK ADDRESS 3
  // ============================================================

  if (!customerAddress3) {
    customerAddress3 =
      printData?.accountDetails?.Address3 ||
      printData?.Address3 ||
      "";
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
    "-";

  // ============================================================
  // 12. GST NUMBER
  // ============================================================

  const gstNumber =
    customerGSTNo ||
    printData?.GSTNo ||
    printData?.CustomerGSTNo ||
    printData?.customerGSTNo ||
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
  console.log("GST:", gstNumber);
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
      invoiceDateText = moment(
        printData.InvoiceDate.date
      ).format("DD-MM-YYYY");
    } else if (printData?.InvoiceDate) {
      invoiceDateText = moment(
        printData.InvoiceDate
      ).format("DD-MM-YYYY");
    }
  } catch (error) {
    console.error(
      "Invoice date formatting error:",
      error
    );

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
  const companyAddress1 =
    "E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER";
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

          canvas.width =
            img.naturalWidth || img.width;

          canvas.height =
            img.naturalHeight || img.height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(
            canvas.toDataURL("image/png")
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(
          new Error(
            `Unable to load image: ${imageSource}`
          )
        );
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
    amrutLogoData =
      await imageToDataURL(amrutLogo);

    console.log("Amrut Siddhi logo loaded.");
  } catch (error) {
    console.error(
      "Amrut Siddhi logo error:",
      error
    );
  }

  try {
    fremilaLogoData =
      await imageToDataURL(fremilaLogo);

    console.log("Fremila logo loaded.");
  } catch (error) {
    console.error(
      "Fremila logo error:",
      error
    );
  }

  // ============================================================
  // 21. ROLL PRINT MARGINS
  // ============================================================

  const leftMargin = 4;
  const rightMargin = 4;

  const contentWidth =
    pageWidth -
    leftMargin -
    rightMargin;

  // ============================================================
  // 22. OUTER BORDER
  // ============================================================

  doc.setLineWidth(0.4);

  doc.rect(
    leftMargin,
    4,
    contentWidth,
    pageHeight - 8
  );

  // ============================================================
  // 23. HEADER
  // ============================================================

  let y = 11;

  // ============================================================
  // 23.1 AMRUT SIDDHI LOGO
  // ============================================================

  if (amrutLogoData) {
    try {
      doc.addImage(
        amrutLogoData,
        "PNG",
        pageWidth - 25,
        7,
        18,
        12
      );
    } catch (error) {
      console.error(
        "Amrut Siddhi PDF logo error:",
        error
      );
    }
  }

  // ============================================================
  // 23.2 FREMILA LOGO
  // ============================================================

  if (fremilaLogoData) {
    try {
      doc.addImage(
        fremilaLogoData,
        "PNG",
        pageWidth - 25,
        20,
        18,
        12
      );
    } catch (error) {
      console.error(
        "Fremila PDF logo error:",
        error
      );
    }
  }

  // ============================================================
  // 23.3 COMPANY NAME
  // ============================================================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.text(
    companyName,
    leftMargin + 2,
    y
  );

  y += 4;

  // ============================================================
  // 23.4 COMPANY ADDRESS 1
  // ============================================================

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(5.5);

  const companyAddressLines =
    doc.splitTextToSize(
      companyAddress1,
      52
    );

  doc.text(
    companyAddressLines,
    leftMargin + 2,
    y
  );

  y +=
    companyAddressLines.length *
    3.2;

  // ============================================================
  // 23.5 COMPANY ADDRESS 2
  // ============================================================

  doc.text(
    companyAddress2,
    leftMargin + 2,
    y
  );

  y += 3.2;

  // ============================================================
  // 23.6 COMPANY PHONE
  // ============================================================

  doc.text(
    `Phone no.: ${companyPhone}`,
    leftMargin + 2,
    y
  );

  y += 3.2;

  // ============================================================
  // 23.7 COMPANY STATE
  // ============================================================

  doc.text(
    `State: ${companyState}`,
    leftMargin + 2,
    y
  );

  // ============================================================
  // 24. TAX INVOICE
  // ============================================================

  y += 6;

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.text(
    "Tax Invoice",
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  y += 5;

  // ============================================================
  // 25. HEADER LINE
  // ============================================================

  doc.setLineWidth(0.3);

  doc.line(
    leftMargin + 2,
    y,
    pageWidth - rightMargin - 2,
    y
  );

  y += 5;

  // ============================================================
  // 26. BILL TO / INVOICE DETAILS
  // ============================================================

  const leftX = 6;
  const rightX = 43;

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(7);

  doc.text(
    "Bill To",
    leftX,
    y
  );

  doc.text(
    "Invoice Details",
    rightX,
    y
  );

  y += 4;

  // ============================================================
  // 27. CUSTOMER NAME
  // ============================================================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(6.5);

  const customerNameLines =
    doc.splitTextToSize(
      String(customerName || "-"),
      34
    );

  doc.text(
    customerNameLines,
    leftX,
    y
  );

  // ============================================================
  // 28. INVOICE NUMBER
  // ============================================================

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(6);

  doc.text(
    `Invoice No.: ${invoiceNo || "-"}`,
    rightX,
    y
  );

  y += Math.max(
    customerNameLines.length * 3.2,
    4
  );

  // ============================================================
  // 29. CUSTOMER ADDRESS 1
  // ============================================================

  if (customerAddress1) {
    const address1Lines =
      doc.splitTextToSize(
        String(customerAddress1),
        34
      );

    doc.text(
      address1Lines,
      leftX,
      y
    );

    y +=
      address1Lines.length *
      3.2;
  }

  // ============================================================
  // 30. DATE
  // ============================================================

  doc.text(
    `Date: ${invoiceDateText}`,
    rightX,
    y
  );

  y += 4;

  // ============================================================
  // 31. CUSTOMER ADDRESS 2
  // ============================================================

  if (customerAddress2) {
    const address2Lines =
      doc.splitTextToSize(
        String(customerAddress2),
        34
      );

    doc.text(
      address2Lines,
      leftX,
      y
    );

    y +=
      address2Lines.length *
      3.2;
  }

  // ============================================================
  // 32. TIME
  // ============================================================

  doc.text(
    `Time: ${invoiceTime}`,
    rightX,
    y
  );

  y += 4;

  // ============================================================
  // 33. CUSTOMER ADDRESS 3
  // ============================================================

  if (customerAddress3) {
    const address3Lines =
      doc.splitTextToSize(
        String(customerAddress3),
        34
      );

    doc.text(
      address3Lines,
      leftX,
      y
    );

    y +=
      address3Lines.length *
      3.2;
  }

  // ============================================================
  // 34. CONTACT NUMBER
  // ============================================================

  doc.text(
    `Contact No.: ${contactNo}`,
    leftX,
    y
  );

  y += 4;

  // ============================================================
  // 36. LINE BEFORE TABLE
  // ============================================================

  y += 2;

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

  const invoiceDetails =
    Array.isArray(printData?.invdetail)
      ? printData.invdetail
      : [];

  // ============================================================
  // 38. PRODUCT TABLE DATA
  // ============================================================

  const tableData =
    invoiceDetails.map(
      (item, index) => {
        const matchedProduct =
          Array.isArray(productOptions)
            ? productOptions.find(
                (option) =>
                  String(
                    option?.value
                  ) ===
                  String(
                    item?.ProductId
                  )
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

        const quantity =
          Number(
            item?.Quantity || 0
          );

        const rate =
          Number(
            item?.Rate || 0
          );

        const amount =
          Number(
            item?.Amount || 0
          );

        return [
          index + 1,
          productName,
          hsnSac,
          quantity.toFixed(2),
          rate.toFixed(2),
          amount.toFixed(2),
        ];
      }
    );

  // ============================================================
  // 39. PRODUCT TABLE
  // ============================================================

  autoTable(doc, {
    head: [
      [
        "#",
        "Item",
        "HSN",
        "Qty",
        "Rate",
        "Amount",
      ],
    ],

    body:
      tableData.length > 0
        ? tableData
        : [
            [
              "",
              "No items",
              "",
              "",
              "",
              "",
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

  const totalQuantity =
    invoiceDetails.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.Quantity || 0
        ),
      0
    );

  // ============================================================
  // 41. SUB TOTAL
  // ============================================================

  const subTotal =
    Number(
      printData?.SubTotal || 0
    );

  // ============================================================
  // 42. GRAND TOTAL
  // ============================================================

  const grandTotal =
    Number(
      printData?.Total || 0
    );

  // ============================================================
  // 43. RECEIVED AMOUNT
  // ============================================================

  const savedReceivedAmount =
    parseFloat(
      printData?.ReceivedAmount
    );

  const receivedAmount =
    !Number.isNaN(
      savedReceivedAmount
    )
      ? savedReceivedAmount
      : (parseFloat(
          printData?.CashAmount
        ) || 0) +
        (parseFloat(
          printData?.OnlineAmount
        ) || 0);




// ============================================================
// 44. PREVIOUS / CURRENT / TOTAL OUTSTANDING
// ============================================================

const previousDue = Number(
  printData?.PreviousBalanceDue || 0
);

const currentBillDue = Math.max(
  grandTotal - receivedAmount,
  0
);

const totalOutstanding =
  previousDue + currentBillDue;

const refund = Math.max(
  receivedAmount - grandTotal,
  0
);

  // ============================================================
// 45. TOTAL ROW
// ============================================================
// ONLY TOTAL ROW SHOULD BE DISPLAYED
// Previous Due / Current Bill Due / Total Outstanding
// are intentionally removed from the PDF.

y =
  doc.lastAutoTable?.finalY
    ? doc.lastAutoTable.finalY + 4
    : y + 4;

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
    valign: "middle",
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

    const convertBelowThousand =
      (number) => {
        let result = "";

        if (number >= 100) {
          result +=
            ones[
              Math.floor(
                number / 100
              )
            ] +
            " Hundred ";

          number %= 100;
        }

        if (number >= 20) {
          result +=
            tens[
              Math.floor(
                number / 10
              )
            ] +
            " ";

          number %= 10;
        }

        if (number > 0) {
          result +=
            ones[number] +
            " ";
        }

        return result.trim();
      };

    if (num === 0) {
      return "Zero";
    }

    num = Math.floor(num);

    let result = "";

    if (num >= 10000000) {
      result +=
        convertBelowThousand(
          Math.floor(
            num / 10000000
          )
        ) +
        " Crore ";

      num %= 10000000;
    }

    if (num >= 100000) {
      result +=
        convertBelowThousand(
          Math.floor(
            num / 100000
          )
        ) +
        " Lakh ";

      num %= 100000;
    }

    if (num >= 1000) {
      result +=
        convertBelowThousand(
          Math.floor(
            num / 1000
          )
        ) +
        " Thousand ";

      num %= 1000;
    }

    if (num > 0) {
      result +=
        convertBelowThousand(num);
    }

    return result.trim();
  };

  // ============================================================
  // 47. AMOUNT IN WORDS
  // ============================================================

  const amountInWords =
    `${numberToWords(
      grandTotal
    )} Rupees only`;

  // ============================================================
  // 48. SUMMARY TABLE
  // ============================================================

  y =
    doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 4
      : y + 4;

autoTable(doc, {
  body: [
    // ============================================================
    // 1. SUB TOTAL
    // ============================================================
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

    // ============================================================
    // 2. TOTAL
    // ============================================================
    [
      amountInWords,
      "Total",
      `Rs. ${grandTotal.toFixed(2)}`,
    ],

    // ============================================================
    // 3. RECEIVED
    // ============================================================
    [
      "",
      "Received",
      `Rs. ${receivedAmount.toFixed(2)}`,
    ],

    // ============================================================
    // 4. PREVIOUS CUSTOMER DUE
    // ============================================================
    [
      "",
      "Previous Due",
      `Rs. ${previousDue.toFixed(2)}`,
    ],

    // ============================================================
    // 5. CURRENT BILL DUE
    // ============================================================
    [
      "",
      "Current Bill Due",
      `Rs. ${currentBillDue.toFixed(2)}`,
    ],

    // ============================================================
    // 6. TOTAL CUSTOMER OUTSTANDING
    // ============================================================
    [
      "",
      "Total Outstanding",
      `Rs. ${totalOutstanding.toFixed(2)}`,
    ],
  ],

  // ============================================================
  // TABLE POSITION
  // ============================================================
  startY: y,

  margin: {
    left: 6,
    right: 6,
  },

  // ============================================================
  // TABLE WIDTH
  // ============================================================
  tableWidth: 68,

  theme: "grid",

  // ============================================================
  // GENERAL STYLES
  // ============================================================
  styles: {
    font: "helvetica",
    fontSize: 5.3,
    cellPadding: 1.5,
    lineWidth: 0.2,
    valign: "middle",
    overflow: "linebreak",
  },

  // ============================================================
  // COLUMN WIDTHS
  // ============================================================
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

  y =
    doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 5
      : y + 5;

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(6.5);

  doc.text(
    "Terms And Conditions",
    6,
    y
  );

  y += 3.5;

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(5.5);

  doc.text(
    "Thanks for doing business with us!",
    6,
    y
  );

  y += 7;

  // ============================================================
  // 50. AUTHORIZED SIGNATORY
  // ============================================================

  doc.setFontSize(6);

  doc.text(
    "For: AMRUT MILK PRODUCTS 2",
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  y += 9;

  doc.line(
    pageWidth / 2 - 15,
    y,
    pageWidth / 2 + 15,
    y
  );

  y += 3.5;

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Authorized Signatory",
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  // ============================================================
  // 51. PRINT PDF - 80MM ROLL
  // ============================================================

  try {
    // ----------------------------------------------------------
    // IMPORTANT:
    // Mark PDF for printing.
    // ----------------------------------------------------------

    if (
      typeof doc.autoPrint ===
      "function"
    ) {
      doc.autoPrint();
    }

    // ----------------------------------------------------------
    // Create PDF Blob
    // ----------------------------------------------------------

    const pdfBlob =
      doc.output("blob");

    // ----------------------------------------------------------
    // Create temporary PDF URL
    // ----------------------------------------------------------

    const pdfBlobUrl =
      URL.createObjectURL(
        pdfBlob
      );

    console.log(
      "========================================"
    );
    console.log(
      "80MM ROLL PDF CREATED"
    );
    console.log(
      "PDF URL:",
      pdfBlobUrl
    );
    console.log(
      "========================================"
    );

    // ----------------------------------------------------------
    // OPEN DIRECT PDF
    // ----------------------------------------------------------

    if (
      printWindow &&
      !printWindow.closed
    ) {
      printWindow.location.href =
        pdfBlobUrl;

      printWindow.focus();
    } else {
      const newPrintWindow =
        window.open(
          pdfBlobUrl,
          "_blank"
        );

      if (!newPrintWindow) {
        toast.error(
          "Please allow popups for printing."
        );

        URL.revokeObjectURL(
          pdfBlobUrl
        );

        return;
      }

      newPrintWindow.focus();
    }

    // ----------------------------------------------------------
    // Keep Blob URL alive
    // ----------------------------------------------------------

    setTimeout(() => {
      URL.revokeObjectURL(
        pdfBlobUrl
      );
    }, 60000);
  } catch (error) {
    console.error(
      "Error generating invoice PDF:",
      error
    );

    if (
      printWindow &&
      !printWindow.closed
    ) {
      printWindow.close();
    }

    toast.error(
      "Unable to generate invoice PDF."
    );
  }
};

  return (
    <Box>
      


<Box
  sx={{
    p: 5,
    height: "auto",
  }}
>

  {/* ======================================================
      CREATE SALES ENTRY BUTTON
  ====================================================== */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Button
      sx={{
        background: "var(--complementary-color)",
        fontWeight: "bold",
        fontSize: "17px",
        padding: "9px 20px",
      }}
      variant="contained"
      onClick={handleNewClick}
    >
      CREATE SALES ENTRY - DEALER
    </Button>
  </Box>



{/* ======================================================
    MINIMIZED DEALER BILLS
====================================================== */}

{minimizedBills.length > 0 && (
  <Box
    sx={{
      mt: 2,
      p: 2,
      width: "380px",
      maxWidth: "100%",
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
            gap: 1,
            p: 1,
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* BILL INFORMATION */}
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {bill.selectedCustomerName ||
                bill.customerName ||
                "Dealer Customer"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Invoice: {bill.invoiceNo || "-"}
            </Typography>
          </Box>

          {/* ACTIONS */}
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
              onClick={() =>
                handleResumeBill(bill.draftId)
              }
            >
              Resume
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() =>
                handleRemoveMinimizedBill(
                  bill.draftId
                )
              }
            >
              Remove
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
)}


  {/* ======================================================
      INVOICE FILTERS
  ====================================================== */}

  
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
{/* FROM DATE */}
<TextField
  size="small"
  type="date"
  label="From Date"
  value={filterFromDate}
  onChange={(e) => setFilterFromDate(e.target.value)}
  InputLabelProps={{
    shrink: true,
  }}
  sx={{ minWidth: 160 }}
/>
    
    
  
    {/* TO DATE */}
   {/* TO DATE */}
<TextField
  size="small"
  type="date"
  label="To Date"
  value={filterToDate}
  onChange={(e) => setFilterToDate(e.target.value)}
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
<MenuItem value="D">Dealer</MenuItem>
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


  {/* ======================================================
      TABLE
  ====================================================== */}
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
         
          renderBottomToolbarCustomActions={() => (
            <Box
              mt={2}
              alignItems="center"
              display="flex"
              justifyContent="flex-end"
              width="100%"
            >
              <FirstPageIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setPageNo(1)}
              />
              <KeyboardArrowLeftIcon
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  setPageNo((prev) => Math.max(Number(prev) - 1, 1))
                }
              />
              <Box ml={1}> Page No </Box>
              <TextField
                sx={{
                  width: "4.5%",
                  ml: 1,
                  "@media (max-width: 768px)": {
                    width: "10%",
                  },
                }}
                value={pageNo}
                onChange={(e) => setPageNo(e.target.value)}
                size="small"
              />
              <KeyboardArrowRightIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setPageNo((prev) => Number(prev) + 1)}
              />
              <LastPageIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setPageNo(totalPages)}
              />
              <Box ml={1}>Total Pages: {totalPages}</Box>
            </Box>
          )}
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
                      {new Date(
                        previewData.InvoiceDate.date,
                      ).toLocaleDateString()}
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
                      <Typography>
                        <strong>Order Date:</strong>{" "}
                        {new Date(
                          previewData.OrderDate.date,
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>
                        <strong>Customer Name:</strong>{" "}
                        {previewData.accountDetails.AccountName}
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

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        mt={2}
                      >
                        Sales Details
                      </Typography>

                      <TableContainer
                        component={Paper}
                        elevation={2}
                        sx={{ width: "100%", mt: 2 }}
                      >
                        <Table size="small">
                        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
          opt.value?.toString() ===
          item.ProductId?.toString()
      )?.label || "Unknown";

    return (
      <TableRow key={index}>
        <TableCell>{materialName}</TableCell>

        <TableCell>
          {item.Quantity}
        </TableCell>

        <TableCell>
          {item.Rate}
        </TableCell>

        <TableCell>
          {item.DiscountAmt || 0}
        </TableCell>

        <TableCell>
          {item.Amount}
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>
                         

                        </Table>

                      </TableContainer>

                   <TableContainer
  component={Paper}
  elevation={1}
  sx={{ width: "100%", mt: 8 }}
>
  <Table size="small">
    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
          ₹ {Number(previewData.Transport || 0).toFixed(2)}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

                    </Grid>

                    {/* Summary Table */}

                  <Grid item xs={12} md={4}>
  <Typography
    variant="h6"
    fontWeight="bold"
    gutterBottom
    mt={2}
  >
    Amount Summary
  </Typography>

  <TableContainer
    component={Paper}
    elevation={2}
    sx={{
      mt: 2,
      borderRadius: 2,
    }}
  >
    <Table size="small">

      <TableBody>

        {/* =============================== */}
        {/* SUBTOTAL */}
        {/* =============================== */}

        <TableRow>
          <TableCell>
            <strong>Subtotal</strong>
          </TableCell>

          <TableCell align="right">
            ₹ {Number(previewData?.SubTotal || 0).toFixed(2)}
          </TableCell>
        </TableRow>


        {/* =============================== */}
        {/* TRANSPORT */}
        {/* =============================== */}

        <TableRow>
          <TableCell>
            <strong>Transport</strong>
          </TableCell>

          <TableCell align="right">
            ₹ {Number(previewData?.Transport || 0).toFixed(2)}
          </TableCell>
        </TableRow>


        {/* =============================== */}
        {/* GRAND TOTAL */}
        {/* =============================== */}

        <TableRow>
          <TableCell>
            <strong>Grand Total</strong>
          </TableCell>

          <TableCell
            align="right"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            ₹ {Number(previewData?.Total || 0).toFixed(2)}
          </TableCell>
        </TableRow>


        {/* =============================== */}
        {/* RECEIVED AMOUNT */}
        {/* =============================== */}

        <TableRow>
          <TableCell>
            <strong>Received Amount</strong>
          </TableCell>

          <TableCell align="right">
            <Typography sx={{ fontWeight: "bold" }}>
              ₹ {Number(previewReceivedAmount || 0).toFixed(2)}
            </Typography>
          </TableCell>
        </TableRow>


        {/* =============================== */}
        {/* PREVIOUS CUSTOMER DUE */}
        {/* =============================== */}

        <TableRow>
          <TableCell>
            <strong style={{ color: "#e65100" }}>
              Previous Customer Due
            </strong>
          </TableCell>

          <TableCell
            align="right"
            sx={{
              fontWeight: "bold",
              color: "#e65100",
            }}
          >
            ₹{" "}
            {Number(
              previewData?.PreviousBalanceDue || 0
            ).toFixed(2)}
          </TableCell>
        </TableRow>


        {/* =============================== */}
        {/* CURRENT BILL DUE */}
        {/* =============================== */}

        <TableRow>
          <TableCell>
            <strong style={{ color: "#d32f2f" }}>
              Current Bill Due
            </strong>
          </TableCell>

          <TableCell
            align="right"
            sx={{
              fontWeight: "bold",
              color: "#d32f2f",
            }}
          >
            ₹{" "}
            {Number(
              previewData?.CurrentInvoiceDue || 0
            ).toFixed(2)}
          </TableCell>
        </TableRow>


        {/* =============================== */}
        {/* TOTAL CUSTOMER OUTSTANDING */}
        {/* =============================== */}

        <TableRow>
          <TableCell>
            <strong style={{ color: "#b71c1c" }}>
              Total Customer Outstanding
            </strong>
          </TableCell>

          <TableCell
            align="right"
            sx={{
              fontWeight: "bold",
              color: "#b71c1c",
              fontSize: "18px",
            }}
          >
            ₹{" "}
            {Number(
              previewData?.BalanceDue || 0
            ).toFixed(2)}
          </TableCell>
        </TableRow>

      </TableBody>

    </Table>
  </TableContainer>
</Grid>

                  </Grid>
                </Box>
              ) : (
                <Typography>No data to preview</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={generatePDF} color="primary">
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

              display: "flex",
              flexDirection: "column",

              overflow: "hidden",

              "@media (max-width: 900px)": {
                width: "100%",
                maxWidth: "100%",
              },
            },
          }}
        >
          {/* ===================================================== */}
          {/* DRAWER HEADER */}
          {/* ===================================================== */}

          <Box
            sx={{
              px: 2,
              py: 1.5,
              minHeight: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgb(236, 253, 230)",
              borderBottom: "1px solid #ddd",
              flexShrink: 0,
            }}
          >
            {/* TITLE */}

            <Typography
              fontWeight="bold"
              variant="h6"
              sx={{
                fontSize: {
                  xs: "17px",
                  sm: "20px",
                },
              }}
            >
              {isEditing
                ? "Update Sales Entry - Dealer"
                : "Create Sales Entry - Dealer"}
            </Typography>

            {/* TOTAL / REFUND / CLOSE */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: {
                  xs: 1,
                  sm: 3,
                },
              }}
            >
              {/* TOTAL */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "12px",
                      sm: "16px",
                    },
                    fontWeight: 700,
                    color: "#555",
                  }}
                >
                  TOTAL :
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "20px",
                      sm: "30px",
                    },
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
                  gap: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "12px",
                      sm: "16px",
                    },
                    fontWeight: 700,
                    color: "#555",
                  }}
                >
                  REFUND :
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "20px",
                      sm: "30px",
                    },
                    fontWeight: 900,
                    color: "#087f23",
                    lineHeight: 1,
                  }}
                >
                  ₹ {Number(refund || 0).toFixed(2)}
                </Typography>
              </Box>

              {/* CLOSE */}

           {/* MINIMIZE + CLOSE */}

<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
  }}
>
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
    onClick={
      isSaving
        ? undefined
        : handleDrawerCloseAndGoBack
    }
  />
</Box>
            </Box>
          </Box>

          {/* ===================================================== */}
          {/* DRAWER CONTENT */}
          {/* ===================================================== */}

          <Box
            sx={{
              flex: 1,
              minHeight: 0,

              overflowY: "auto",
              overflowX: "hidden",

              scrollbarWidth: "none",

              "&::-webkit-scrollbar": {
                display: "none",
              },

              p: {
                xs: 1,
                sm: 1.5,
              },
            }}
          >
            {/* ===================================================== */}
            {/* INVOICE / DEVICE / DATE */}
            {/* ===================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                mb: 1.5,

                "@media (max-width: 900px)": {
                  flexDirection: "column",
                },
              }}
            >
              {/* INVOICE NO */}

              <Box flex={1} width="100%">
                <Typography variant="body2">Invoice No</Typography>

               <TextField
  variant="standard"
  sx={{
    mt: 0.5,

    "& .MuiInput-underline:after": {
      borderBottomWidth: 1.5,
      borderBottomColor: "#44ad74",
    },
  }}
  focused
  value={invoiceNo}
  size="small"
  margin="none"
  placeholder="Invoice No Auto Generated"
  fullWidth
  InputProps={{
    readOnly: true,
  }}
/>
              </Box>

              {/* DEVICE */}

              <Box flex={1} width="100%">
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



{/* TIME */}
<Box flex={1}>
  <Typography variant="body2">Time</Typography>

  <TextField
    variant="standard"
    value={currentTime}
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
              </Box>

              {/* INVOICE DATE */}

              <Box flex={1} width="100%">
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
                alignItems: "flex-start",
                gap: 2,
                mb: 1.5,

                "@media (max-width: 900px)": {
                  flexDirection: "column",
                },
              }}
            >
              {/* CUSTOMER */}

              <Box
                ref={customerDropdownRef}
                flex={1}
                width="100%"
                position="relative"
              >
                <Typography variant="body2">Customer</Typography>

                {/* SELECTED CUSTOMER */}
                <TextField
                  fullWidth
                  variant="standard"
                  size="small"
                  value={selectedCustomerName || ""}
                  placeholder="Select Customer"
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

                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "#44ad74",
                    },

                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#1976d2",
                    },
                  }}
                />

                {/* SELECTED CUSTOMER ADDRESS */}
                {selectedCustomerAddress && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      color: "#555",
                      fontSize: "13px",
                    }}
                  >
                    {selectedCustomerAddress}
                  </Typography>
                )}

                {/* CUSTOMER POPUP */}
                {showDropdown && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      maxHeight: 350,
                      overflowY: "auto",
                      zIndex: 9999,
                      mt: 1,
                      p: 2,
                    }}
                  >
                    {/* SEARCH CUSTOMER */}
                    <TextField
                      autoFocus
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
if (accountOptions.length > 0) {
  const option = accountOptions[0];

 const customerId = option.Id?.toString() || "";

const customerName = option.AccountName || "";

const customerAddress =
  option.Address1 ||
  option.address1 ||
  option.Address ||
  option.address ||
  option.AddressLine1 ||
  option.addressLine1 ||
  "";
setSelectedAccount(customerId);

setSelectedCustomerName(customerName);

setSelectedCustomerAddress(customerAddress);

// ⭐ SAME AS CATERERS
// Fetch contact from last saved invoice
fetchCustomerContact(customerId);

fetchAccounts(customerId);

fetchPreviousBalance(customerId, null);

setShowDropdown(false);
setText("");
}
                        }

                        if (e.key === "Escape") {
                          e.preventDefault();
                          e.stopPropagation();

                          setShowDropdown(false);
                          setText("");
                        }
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

                    {/* CREATE CUSTOMER */}
                    <Box display="flex" gap={1} mt={1}>
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

                    {/* NEW CUSTOMER ADDRESS */}
                    <TextField
                      value={newCustomerAddress}
                      onChange={(e) => {
                        setNewCustomerAddress(e.target.value);
                      }}
                      size="small"
                      placeholder="Dealer Address"
                      fullWidth
                      sx={{
                        mt: 1,
                      }}
                    />


                 {/* NEW DEALER CONTACT NUMBER */}
<Box sx={{ mt: 1 }}>
  <PhoneInput
    country={"in"}
    value={newCustomerContact}
    onChange={(phone) => setNewCustomerContact(phone)}
    inputProps={{
      name: "newCustomerContact",
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
  />
</Box>
  

                    {/* CUSTOMER LIST */}
                    <Box mt={1}>
                      {accountOptions.length > 0 ? (
                        accountOptions.map((option) => {
                          const customerAddress =
                            option.Address1 ||
                            option.address1 ||
                            option.Address ||
                            option.address ||
                            option.AddressLine1 ||
                            option.addressLine1 ||
                            "";

                          return (
                            <MenuItem
                              key={option.Id}
onClick={() => {
  const customerId = option.Id?.toString() || "";

  const customerName = option.AccountName || "";

  setSelectedAccount(customerId);

  setSelectedCustomerName(customerName);

  setSelectedCustomerAddress(customerAddress);

  // =====================================================
  // ⭐ AUTOMATIC CONTACT NUMBER
  // SAME LOGIC AS CATERERS
  // FETCH FROM LAST SAVED INVOICE
  // =====================================================
  fetchCustomerContact(customerId);

  // =====================================================
  // GST / ACCOUNT DETAILS
  // =====================================================
  fetchAccounts(customerId);

  // =====================================================
  // PREVIOUS BALANCE
  // =====================================================
  fetchPreviousBalance(customerId, null);

  // =====================================================
  // CLOSE CUSTOMER SEARCH POPUP
  // =====================================================
  setShowDropdown(false);

  // =====================================================
  // CLEAR SEARCH TEXT
  // =====================================================
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
                                {option.AccountName}
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

              {/* CONTACT NUMBER */}

              <Box flex={1} width="100%">
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
                    height: "40px",
                    fontSize: "16px",
                    borderRadius: "5px",
                  }}
                  buttonStyle={{
                    borderRadius: "5px",
                  }}
                />
              </Box>
            </Box>
            {/* ===================================================== */}
            {/* PRODUCT DETAILS */}
            {/* ===================================================== */}

            <Paper
              elevation={2}
              sx={{
                width: "100%",
                border: "1px solid #dcdcdc",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#fff",
                mb: 1.5,
              }}
            >
              {/* PRODUCT DETAILS TITLE */}
              <Box
                sx={{
                  px: 1.5,
                  py: 1.2,
                  borderBottom: "1px solid #dcdcdc",
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "17px", sm: "20px" },
                    fontWeight: 700,
                  }}
                >
                  Product Details
                </Typography>
              </Box>

              {/* ===================================================== */}
              {/* PRODUCT TABLE */}
              {/* ===================================================== */}

              <TableContainer
                sx={{
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                <Table
                  size="small"
                  sx={{
                    width: "100%",
                    minWidth: 850,
                    tableLayout: "fixed",

                    "& .MuiTableCell-root": {
                      borderBottom: "1px solid #e5e5e5",
                      py: 1.2,
                      px: 1.5,
                      fontSize: "14px",
                    },
                  }}
                >
                  {/* ================================================= */}
                  {/* TABLE HEADER */}
                  {/* ================================================= */}

                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <TableCell
                        sx={{
                          width: "8%",
                          fontWeight: 700,
                        }}
                      >
                        Sr.No
                      </TableCell>

                      <TableCell
                        sx={{
                          width: "27%",
                          fontWeight: 700,
                        }}
                      >
                        Product
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          width: "15%",
                          fontWeight: 700,
                        }}
                      >
                        Quantity
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          width: "15%",
                          fontWeight: 700,
                        }}
                      >
                        Rate
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          width: "17%",
                          fontWeight: 700,
                        }}
                      >
                        Amount
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          width: "18%",
                          fontWeight: 700,
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  {/* ================================================= */}
                  {/* TABLE BODY */}
                  {/* ================================================= */}

                  <TableBody>
                    {/* ================================================= */}
                    {/* SAVED PRODUCT ROWS */}
                    {/* ================================================= */}

                    {rows.map((row, index) => (
                      <TableRow key={row.Id || `product-row-${index}`} hover>
                        {/* SR NO */}
                        <TableCell>{index + 1}</TableCell>

                        {/* PRODUCT */}
                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.ProductName || "-"}
                          </Typography>
                        </TableCell>

                        {/* QUANTITY */}
                        <TableCell align="center">
                          <TextField
                            variant="standard"
                            type="number"
                            value={row.Quantity ?? ""}
                            onChange={(e) => {
                              const updatedRows = [...rows];

                              const qty =
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value);

                              const currentRate =
                                Number(updatedRows[index].Rate) || 0;

                              updatedRows[index] = {
                                ...updatedRows[index],
                                Quantity: qty,
                                Amount: (Number(qty) || 0) * currentRate,
                              };

                              setRows(updatedRows);
                            }}
                            sx={{
                              width: 80,
                            }}
                          inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}
                          />
                        </TableCell>

                        {/* RATE */}
                        <TableCell align="right">
                          <TextField
                            variant="standard"
                            type="number"
                            value={row.Rate ?? ""}
                            onChange={(e) => {
                              const updatedRows = [...rows];

                              const newRate =
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value);

                              const currentQty =
                                Number(updatedRows[index].Quantity) || 0;

                              updatedRows[index] = {
                                ...updatedRows[index],
                                Rate: newRate,
                                Amount: currentQty * (Number(newRate) || 0),
                              };

                              setRows(updatedRows);
                            }}
                            sx={{
                              width: 100,
                            }}
                          inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}
                          />
                        </TableCell>

                        {/* AMOUNT */}
                        <TableCell align="right">
                          ₹ {Number(row.Amount || 0).toFixed(2)}
                        </TableCell>

                        {/* ACTION */}
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEditRow(index)}
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
                    {/* NEW PRODUCT ROW */}
                    {/* ================================================= */}

                    <TableRow
                      sx={{
                        backgroundColor: "#fff",
                      }}
                    >
                      {/* SR NO */}
                      <TableCell>{rows.length + 1}</TableCell>

                      {/* ================================================= */}
                      {/* PRODUCT */}
                      {/* ================================================= */}

                      <TableCell>
<Autocomplete
  options={productOptions}
  value={
    productOptions.find(
      (option) =>
        String(option.value) === String(selectedProductID)
    ) || null
  }
  getOptionLabel={(option) => option?.label || ""}
  isOptionEqualToValue={(option, value) =>
    String(option.value) === String(value?.value)
  }
  ListboxProps={{
    style: {
      maxHeight: "300px",
      overflowY: "auto",
    },
  }}
  onChange={(event, newValue) => {
    handleItemChange(newValue);
  }}
  onKeyDown={(event) => {
    if (event.key !== "Enter") {
      return;
    }

    if (selectedProductID) {
      event.preventDefault();
      event.stopPropagation();

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
      sx={{
        "& .MuiInputBase-root": {
          fontSize: "15px",
        },
      }}
    />
  )}
/>
                      </TableCell>

                      {/* ================================================= */}
                      {/* QUANTITY */}
                      {/* ================================================= */}
<TableCell align="center">
<TextField
  variant="standard"
  type="number"
 value={quantity}
  onChange={handleQuantityChange}
  inputRef={quantityRef}
  onKeyDown={(event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Product select आहे का?
    if (!selectedProductID) {
      toast.error("Please select a product.");

      setTimeout(() => {
        productRef.current?.focus();
      }, 100);

      return;
    }

    // Quantity check
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Please enter quantity.");

      setTimeout(() => {
        quantityRef.current?.focus();
        quantityRef.current?.select();
      }, 100);

      return;
    }

    // Dealer Rate check
    if (!rate || Number(rate) <= 0) {
      toast.error("Dealer rate not available.");

      return;
    }

    // ==========================================
    // ADD / UPDATE ROW
    // ==========================================
    handleSaveOrAddRow();

    // ==========================================
    // AFTER ADD → PRODUCT FOCUS
    // ==========================================
    setTimeout(() => {
      productRef.current?.focus();
    }, 100);
  }}
  sx={{
    width: 80,
  }}
 inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}
/>
</TableCell>

                      {/* ================================================= */}
                      {/* RATE */}
                      {/* ================================================= */}
<TableCell align="right">
  <TextField
    variant="standard"
    type="number"
    // NEW
value={rate}
    inputRef={rateRef}
    InputProps={{
      readOnly: true,
    }}
    sx={{
      width: 100,
    }}
   inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}
  />
</TableCell>

                      {/* ================================================= */}
                      {/* AMOUNT */}
                      {/* ================================================= */}

                      <TableCell align="right">
                        ₹{" "}
                        {(
                          (Number(quantity) || 0) * (Number(rate) || 0)
                        ).toFixed(2)}
                      </TableCell>

                      {/* ================================================= */}
                      {/* ACTION */}
                      {/* ================================================= */}

                      <TableCell align="center">
                        <Typography
                          sx={{
                            color: "#999",
                            fontSize: "13px",
                          }}
                        >
                          New
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ERROR */}
              {errors.rows && (
                <Typography
                  color="error"
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                  }}
                >
                  {errors.rows}
                </Typography>
              )}
            </Paper>

            {/* ===================================================== */}
            {/* PAYMENT MODE + TRANSPORT */}
            {/* ===================================================== */}

            <Grid
              container
              spacing={2}
              sx={{
                mb: 1.5,
              }}
            >
              {/* PAYMENT MODE */}

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
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
  <MenuItem value="">
    Select Payment Mode
  </MenuItem>

  <MenuItem value="C">
    Cash
  </MenuItem>

  <MenuItem value="O">
    Online
  </MenuItem>

  <MenuItem value="M">
    Mix
  </MenuItem>
</TextField>
                </Box>

                {/* MIX PAYMENT */}

                {paymentMode === "M" && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                      }}
                    >
                      Mix Payment
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
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

                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography fontWeight={700}>Received</Typography>

                      <Typography fontWeight={800} color="primary">
                        ₹ {Number(receivedAmount || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>

              {/* TRANSPORT */}

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
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
              </Grid>
            </Grid>

            {/* ===================================================== */}
            {/* AMOUNT SUMMARY - FULL WIDTH */}
            {/* ===================================================== */}

            <Paper
              elevation={4}
              sx={{
                width: "100%",
                p: {
                  xs: 1.5,
                  sm: 2,
                },
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                backgroundColor: "#ffffff",
                mb: 2,
              }}
            >
              {/* TITLE */}

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#1976d2",
                  mb: 2,
                }}
              >
                Amount Summary
              </Typography>

              {/* SUMMARY ROW */}

              <Grid container spacing={2} alignItems="center">
                {/* SUBTOTAL */}

                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "17px",
                        fontWeight: 600,
                      }}
                    >
                      Subtotal
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "19px",
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
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "17px",
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
                          }, 100);
                        }
                      }}
                      placeholder="0.00"
                      sx={{
                        width: 120,

                        "& input": {
                          textAlign: "right",
                          fontSize: "16px",
                          fontWeight: 500,
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
                      gap: 1,
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
                        fontSize: "26px",
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
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "17px",
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
                      disabled={paymentMode === "M"}
                      placeholder="0.00"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();

                          // Received Amount पेक्षा पुढे जायचे असल्यास
                          // Save button / पुढचा action इथे ठेवू शकतो.
                        }
                      }}
                      sx={{
                        width: 120,

                        "& input": {
                          textAlign: "right",
                          fontSize: "16px",
                          fontWeight: 500,
                        },
                      }}
                     inputProps={{
  min: 0,
  onWheel: preventNumberInputScroll,
}}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider
                sx={{
                  my: 1.5,
                }}
              />

              {/* ================================================= */}
              {/* PAYMENT STATUS */}
              {/* ================================================= */}

             {/* ================================================= */}
{/* PAYMENT STATUS */}
{/* ================================================= */}

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
        fontSize: "20px",
        fontWeight: 800,
        color: "#087f23",
      }}
    >
      Paid
    </Typography>

    <Typography
      sx={{
        fontSize: "22px",
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
        fontSize: "20px",
        fontWeight: 800,
        color: "#087f23",
      }}
    >
      Refund
    </Typography>

    <Typography
      sx={{
        fontSize: "22px",
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
        fontSize: "20px",
        fontWeight: 800,
        color: "#d32f2f",
      }}
    >
      Current Bill Due
    </Typography>

    <Typography
      sx={{
        fontSize: "22px",
        fontWeight: 800,
        color: "#d32f2f",
      }}
    >
      ₹ {Math.max(grandTotal - received, 0).toFixed(2)}
    </Typography>
  </Box>
)}

{/* ================================================= */}
{/* PREVIOUS DUE */}
{/* ================================================= */}

<Box
  sx={{
    p: 1.5,
    mt: 1,
    borderRadius: 2,
    backgroundColor: "#fff8e1",
    border: "1px solid #ffcc80",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Typography
    sx={{
      fontSize: "20px",
      fontWeight: 800,
      color: "#e65100",
    }}
  >
    Previous Due
  </Typography>

  <Typography
    sx={{
      fontSize: "22px",
      fontWeight: 800,
      color: "#e65100",
    }}
  >
    ₹ {Number(previousBalanceDue || 0).toFixed(2)}
  </Typography>
</Box>

{/* ================================================= */}
{/* TOTAL OUTSTANDING */}
{/* ================================================= */}

<Box
  sx={{
    p: 1.5,
    mt: 1,
    borderRadius: 2,
    backgroundColor: "#ffebee",
    border: "1px solid #ef5350",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Typography
    sx={{
      fontSize: "20px",
      fontWeight: 800,
      color: "#b71c1c",
    }}
  >
    Total Outstanding
  </Typography>

  <Typography
    sx={{
      fontSize: "22px",
      fontWeight: 800,
      color: "#b71c1c",
    }}
  >
    ₹ {Number(customerOutstanding || 0).toFixed(2)}
  </Typography>
</Box>
            </Paper>
          </Box>

          {/* ===================================================== */}
          {/* SAVE / CANCEL / DELETE */}
          {/* ===================================================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              py: 1.5,
              px: 2,
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
              flexShrink: 0,
            }}
          >
          {/* SAVE / UPDATE */}

<Button
  sx={{
    background: "var(--primary-color)",

    "&:hover": {
      background: "var(--primary-color)",
    },

    "&:disabled": {
      background: "#bdbdbd",
      color: "#ffffff",
    },
  }}
  onClick={handleSubmit}
  variant="contained"
  disabled={isSaving}
>
  {isSaving
    ? "Saving..."
    : isEditing
      ? "Update"
      : "Save"}
</Button>

{/* PRINT */}

<Button
  sx={{
    background: "var(--complementary-color)",

    "&:hover": {
      background: "var(--complementary-color)",
    },
  }}
  onClick={(e) => handleSubmit(e, true)}
  variant="contained"
  startIcon={<PrintIcon />}
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

            {isEditing && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpen}
              >
                Delete
              </Button>
            )}

            {/* DELETE DIALOG */}

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Confirm Deletion</DialogTitle>

              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this item?
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>

                <Button onClick={handleConfirmDelete} color="error" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Drawer>

        

        {/* ============================================================
    INVOICE EDIT HISTORY DIALOG
============================================================ */}

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
  {/* ================= HEADER ================= */}

  <DialogTitle
    sx={{
      background:
        "linear-gradient(135deg, #1976d2, #0d47a1)",
      color: "#fff",
      fontWeight: 700,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Box>
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        Invoice Edit History
      </Typography>

      <Typography
        sx={{
          fontSize: "14px",
          mt: 0.5,
          opacity: 0.9,
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
      sx={{ color: "#fff" }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  {/* ================= CONTENT ================= */}

  <DialogContent
    dividers
    sx={{
      backgroundColor: "#f7f9fc",
    }}
  >

    {/* ================= LOADING ================= */}

    {historyLoading ? (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: "#555",
          }}
        >
          Loading invoice history...
        </Typography>
      </Box>
    ) : (
      <>

        {/* =====================================================
            CURRENT INVOICE
        ===================================================== */}

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
              mb: 3,
            }}
          >
            Current Invoice
          </Typography>

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
                  currentHistoryHeader?.BillNo ||
                  "-"}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Invoice Date
              </Typography>

              <Typography fontWeight={700}>
                {currentHistoryHeader?.InvoiceDate?.date
                  ? moment(
                      currentHistoryHeader.InvoiceDate.date
                    ).format("DD/MM/YYYY")
                  : currentHistoryHeader?.InvoiceDate
                  ? moment(
                      currentHistoryHeader.InvoiceDate
                    ).format("DD/MM/YYYY")
                  : "-"}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Customer
              </Typography>

              <Typography fontWeight={700}>
                {currentHistoryHeader?.AccountName ||
                  currentHistoryHeader?.CustomerName ||
                  selectedHistoryInvoice?.AccountName ||
                  "-"}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Total
              </Typography>

              <Typography
                fontWeight={700}
                sx={{ color: "#1976d2" }}
              >
                ₹{" "}
                {Number(
                  currentHistoryHeader?.Total || 0
                ).toFixed(2)}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Received
              </Typography>

              <Typography fontWeight={700}>
                ₹{" "}
                {Number(
                  currentHistoryHeader?.ReceivedAmount ||
                    0
                ).toFixed(2)}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">
                Balance
              </Typography>

              <Typography
                fontWeight={700}
                sx={{ color: "red" }}
              >
                ₹{" "}
                {Math.max(
                  Number(
                    currentHistoryHeader?.Total || 0
                  ) -
                    Number(
                      currentHistoryHeader?.ReceivedAmount ||
                        0
                    ),
                  0
                ).toFixed(2)}
              </Typography>
            </Box>

          </Box>
        </Paper>

        {/* =====================================================
            PREVIOUS INVOICE HISTORY
        ===================================================== */}

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
              No previous history found.
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">

                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#eaf2f8",
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

                    <TableCell>
                      <b>View</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {[...historyHeader]
                    .sort(
                      (a, b) =>
                        Number(b?.VersionNo || 0) -
                        Number(a?.VersionNo || 0)
                    )
                    .map((item, index) => {

                      const version =
                        Number(item?.VersionNo || 0);

                      const selected =
                        selectedHistoryVersion ===
                        version;

                      return (
                        <TableRow
                          key={
                            item?.Id ||
                            `${version}-${index}`
                          }
                          sx={{
                            backgroundColor: selected
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
                                handleHistoryVersionClick(
                                  item
                                )
                              }
                            >
                              VERSION {version}
                            </Button>
                          </TableCell>

                          <TableCell>
                            {item?.InvoiceNo ||
                              item?.BillNo ||
                              "-"}
                          </TableCell>

                          <TableCell>
                            {item?.InvoiceDate?.date
                              ? moment(
                                  item.InvoiceDate.date
                                ).format(
                                  "DD/MM/YYYY"
                                )
                              : item?.InvoiceDate
                              ? moment(
                                  item.InvoiceDate
                                ).format(
                                  "DD/MM/YYYY"
                                )
                              : "-"}
                          </TableCell>

                          <TableCell>
                            {item?.AccountName ||
                              item?.CustomerName ||
                              "-"}
                          </TableCell>

                          <TableCell>
                            ₹{" "}
                            {Number(
                              item?.Total || 0
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            ₹{" "}
                            {Number(
                              item?.ReceivedAmount || 0
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() =>
                                handleHistoryVersionClick(
                                  item
                                )
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
            </Box>
          )}
        </Paper>

        {/* =====================================================
            OLD VS CURRENT HEADER
        ===================================================== */}

        {selectedHistoryVersion && (
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
                color: "#7b1fa2",
                mb: 2,
              }}
            >
              Old vs Current Invoice
            </Typography>

            <Table size="small">

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
                      Previous — Version{" "}
                      {selectedHistoryVersion}
                    </b>
                  </TableCell>

                  <TableCell>
                    <b>Current</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                {[
                  {
                    field: "Invoice No",
                    old:
                      historyHeader.find(
                        (x) =>
                          Number(x?.VersionNo) ===
                          Number(
                            selectedHistoryVersion
                          )
                      )?.InvoiceNo ||
                      historyHeader.find(
                        (x) =>
                          Number(x?.VersionNo) ===
                          Number(
                            selectedHistoryVersion
                          )
                      )?.BillNo ||
                      "-",
                    current:
                      currentHistoryHeader?.InvoiceNo ||
                      currentHistoryHeader?.BillNo ||
                      "-",
                  },

                  {
                    field: "Invoice Date",
                    old:
                      historyHeader.find(
                        (x) =>
                          Number(x?.VersionNo) ===
                          Number(
                            selectedHistoryVersion
                          )
                      )?.InvoiceDate?.date ||
                      "-",
                    current:
                      currentHistoryHeader?.InvoiceDate
                        ?.date ||
                      currentHistoryHeader?.InvoiceDate ||
                      "-",
                  },

                  {
                    field: "Total",
                    old:
                      Number(
                        historyHeader.find(
                          (x) =>
                            Number(x?.VersionNo) ===
                            Number(
                              selectedHistoryVersion
                            )
                        )?.Total || 0
                      ).toFixed(2),
                    current:
                      Number(
                        currentHistoryHeader?.Total ||
                          0
                      ).toFixed(2),
                  },

                  {
                    field: "Received Amount",
                    old:
                      Number(
                        historyHeader.find(
                          (x) =>
                            Number(x?.VersionNo) ===
                            Number(
                              selectedHistoryVersion
                            )
                        )?.ReceivedAmount || 0
                      ).toFixed(2),
                    current:
                      Number(
                        currentHistoryHeader?.ReceivedAmount ||
                          0
                      ).toFixed(2),
                  },

                  {
                    field: "Discount",
                    old:
                      historyHeader.find(
                        (x) =>
                          Number(x?.VersionNo) ===
                          Number(
                            selectedHistoryVersion
                          )
                      )?.Discount || 0,
                    current:
                      currentHistoryHeader?.Discount || 0,
                  },

                  {
                    field: "Transport",
                    old:
                      historyHeader.find(
                        (x) =>
                          Number(x?.VersionNo) ===
                          Number(
                            selectedHistoryVersion
                          )
                      )?.Transport || 0,
                    current:
                      currentHistoryHeader?.Transport || 0,
                  },

                ].map((item) => (
                  <TableRow key={item.field}>

                    <TableCell>
                      <b>{item.field}</b>
                    </TableCell>

                    <TableCell>
                      {String(item.old)}
                    </TableCell>

                    <TableCell>
                      {String(item.current)}
                    </TableCell>

                  </TableRow>
                ))}

              </TableBody>

            </Table>
          </Paper>
        )}

        {/* =====================================================
            PREVIOUS PRODUCT DETAILS
        ===================================================== */}

        {selectedHistoryVersion && (
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
              <Table size="small">

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
                  {selectedHistoryDetails.map(
                    (detail, index) => {

                      const product =
                        productOptions.find(
                          (option) =>
                            String(option?.value) ===
                            String(
                              detail?.ProductId
                            )
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
                            {detail?.Quantity ?? "-"}
                          </TableCell>

                          <TableCell>
                            ₹{" "}
                            {Number(
                              detail?.Rate || 0
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            ₹{" "}
                            {Number(
                              detail?.Amount || 0
                            ).toFixed(2)}
                          </TableCell>

                        </TableRow>
                      );
                    }
                  )}
                </TableBody>

              </Table>
            )}
          </Paper>
        )}

        {/* =====================================================
            CURRENT PRODUCT DETAILS
        ===================================================== */}

        {selectedHistoryVersion && (
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
              <Table size="small">

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
                  {currentHistoryDetails.map(
                    (detail, index) => {

                      const product =
                        productOptions.find(
                          (option) =>
                            String(option?.value) ===
                            String(
                              detail?.ProductId
                            )
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
                            {detail?.Quantity ?? "-"}
                          </TableCell>

                          <TableCell>
                            ₹{" "}
                            {Number(
                              detail?.Rate || 0
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            ₹{" "}
                            {Number(
                              detail?.Amount || 0
                            ).toFixed(2)}
                          </TableCell>

                        </TableRow>
                      );
                    }
                  )}
                </TableBody>

              </Table>
            )}
          </Paper>
        )}

      </>
    )}

  </DialogContent>

  {/* ================= FOOTER ================= */}

  <DialogActions
    sx={{
      p: 2,
      backgroundColor: "#fff",
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


           <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
        />

      </Box>
    </Box>
  );
};

export default DealerSalesEntry;




