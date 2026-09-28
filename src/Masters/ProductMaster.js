

// import { useMemo, useState, useEffect } from "react";
// import {
//   useMediaQuery,
//   Box,
//   Button,
//   IconButton,
//   Typography,
//   TextField,
//   Drawer,
//   Divider,
//   FormControl,
//   Select,
//   MenuItem,
//   Menu,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { MaterialReactTable } from "material-react-table";

// import { useTheme } from "@mui/material/styles";
// import axios from "axios";
// import { toast } from "react-toastify";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import "../Components/common.css";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import FirstPageIcon from "@mui/icons-material/FirstPage";

// const ProductMaster = () => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const handleDrawerOpen = () => {
//     setIsDrawerOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//   };

//   //fetch groupId
//   const [groupOption, setGroupOption] = useState("");
//   const [selectedGroupOption, setSelectedGroupOption] = useState("");

// const fetchGroup = async () => {
//   try {
//     const response = await fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=productgroup"
//     );

//     const result = await response.json();

//     console.log("Product Group API Response:", result);

//     if (!Array.isArray(result)) {
//       console.error(
//         "Product Group API response is not an array:",
//         result
//       );

//       setGroupOption([]);
//       return;
//     }

//     const options = result
//       .filter(
//         (grp) =>
//           grp?.GroupName !== null &&
//           grp?.GroupName !== undefined &&
//           String(grp?.GroupName).trim() !== ""
//       )
//       .map((grp) => ({
//         value: grp.Id,
//         label: String(grp.GroupName).trim(),
//       }));

//     setGroupOption(options);
//   } catch (error) {
//     console.error("Error fetching Product Groups:", error);
//     setGroupOption([]);
//   }
// };

//   useEffect(() => {
//     fetchGroup();
//   }, []);

//   //table
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);

//   const handleMenuOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };
//   const [idwiseData, setIdwiseData] = useState("");
//   const handleEdit = () => {
//     if (currentRow) {
//       console.log("Editing item with ID:", currentRow.original);
//       setIdwiseData(currentRow.original.Id);
//       setUpdateProductCode(currentRow.original.ProductCode);
//       setSelectedGroupOption(currentRow.original.ProductGroupId);
//       setUpdateProductName(currentRow.original.ProductName);
//       setUpdateUOM(currentRow.original.UOM);

//       setUpdatePurchasePrice(currentRow.original.PurchasePrice);
//       setUpdateLocation(currentRow.original.Location);
//       setUpdateDealerPrice(currentRow.original.DealerPrice ?? "");
//       setUpdateCreditPrice(currentRow.original.CreditPrice ?? "");
//       setUpdateOpeningValue(currentRow.original.OpeningValue);
//       setUpdateReorderLevel(currentRow.original.ReOrderLevel);
//       setUpdateMinBal(currentRow.original.MinBalance);
//       setUpdateMaxBal(currentRow.original.MaxBalance);
//       setUpdateHsnCode(currentRow.original.HSNCode);
//       setUpdateCGST(currentRow.original.CGSTPercentage);
//       setUpdateIGST(currentRow.original.IGSTPercentage);
//       setUpdateSGST(currentRow.original.SGSTPercentage);
//     }
//   };
//   //  console.log('idwiseData', idwiseData)

//   const [data, setData] = useState([]);
//   const [pageNo, setPageNo] = useState(1);
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "ProductCode",
//         header: "Product Code",
//         size: 150,
//       },

//       {
//         accessorKey: "ProductName",
//         header: "ProductName",
//         size: 150,
//       },

//       {
//         accessorKey: "PurchasePrice",
//         header: "Retailer Price",
//         size: 150,
//       },

//       {
//         accessorKey: "DealerPrice",
//         header: "Dealer Price",
//         size: 150,
//       },

// {
//   accessorKey: "CreditPrice",
//   header: "Caterers Price",
//   size: 150,
// },

//       {
//         id: "actions",
//         header: "Actions",
//         size: 150,
//         Cell: ({ row }) => (
//           <IconButton onClick={(event) => handleMenuOpen(event, row)}>
//             <MoreVertIcon />
//           </IconButton>
//         ),
//       },
//     ],
//     [pageNo],
//   );

//   const [productCode, setProductCode] = useState("");
//   const [updateproductCode, setUpdateProductCode] = useState("");

//   const [productName, setProductName] = useState("");
//   const [updateproductName, setUpdateProductName] = useState("");

//   const [UOM, setUOM] = useState("");
//   const [updateUOM, setUpdateUOM] = useState("");

//   const [salesPrice, setSalesPrice] = useState(0);
//   const [updatesalesPrice, setUpdateSalesPrice] = useState("");

//   const [purchasePrice, setPurchasePrice] = useState(0);
//   const [updatepurchasePrice, setUpdatePurchasePrice] = useState("");

//   const [dealerPrice, setDealerPrice] = useState("");
//   const [updateDealerPrice, setUpdateDealerPrice] = useState("");

//   const [creditPrice, setCreditPrice] = useState("");
//   const [updateCreditPrice, setUpdateCreditPrice] = useState("");

//   const [location, setLocation] = useState("");
//   const [updatelocation, setUpdateLocation] = useState("");

//   const [openingValue, setOpeningValue] = useState(0);
//   const [updateopeningValue, setUpdateOpeningValue] = useState("");

//   const [reorderLevel, setReorderLevel] = useState(0);
//   const [updatereorderLevel, setUpdateReorderLevel] = useState("");

//   const [minbal, setMinBal] = useState(0);
//   const [updateminbal, setUpdateMinBal] = useState("");

//   const [maxbal, setMaxBal] = useState(0);
//   const [updatemaxbal, setUpdateMaxBal] = useState("");

//   const [hsnCode, setHsnCode] = useState("");
//   const [updatehsnCode, setUpdateHsnCode] = useState("");

//   const [CGST, setCGST] = useState(0);
//   const [updateCGST, setUpdateCGST] = useState("");

//   const [IGST, setIGST] = useState(0);
//   const [updateIGST, setUpdateIGST] = useState("");

//   const [SGST, setSGST] = useState(0);
//   const [updateSGST, setUpdateSGST] = useState("");

//   const CreateProductMaster = async () => {
//     // ==========================================
//     // 1. PRODUCT NAME VALIDATION ONLY
//     // ==========================================

//     if (!productName || productName.trim() === "") {
//       alert("Please enter Product Name.");
//       return;
//     }

//     try {
//       // ==========================================
//       // 2. CREATE FORM DATA
//       // ==========================================

//       const urlencoded = new URLSearchParams();

//       // Product Code
//       urlencoded.append(
//         "ProductCode",
//         productCode === "" || productCode == null ? "0" : String(productCode),
//       );

//       // Product Group is OPTIONAL
//       // If nothing is selected, send 0
//       urlencoded.append(
//         "ProductGroupId",
//         selectedGroupOption === "" || selectedGroupOption == null
//           ? "0"
//           : String(selectedGroupOption),
//       );

//       // Product Name
//       urlencoded.append("ProductName", productName.trim());

//       // UOM
//       urlencoded.append("UOM", UOM === "" || UOM == null ? "No" : String(UOM));

//       // ==========================================
//       // 3. PRICE VALUES
//       // ==========================================

//       urlencoded.append(
//         "PurchasePrice",
//         purchasePrice === "" || purchasePrice == null
//           ? "0"
//           : String(purchasePrice),
//       );

//       urlencoded.append(
//         "DealerPrice",
//         dealerPrice === "" || dealerPrice == null ? "0" : String(dealerPrice),
//       );

//       urlencoded.append(
//         "CreditPrice",
//         creditPrice === "" || creditPrice == null ? "0" : String(creditPrice),
//       );

//       // ==========================================
//       // 4. OTHER VALUES
//       // ==========================================

//       urlencoded.append(
//         "Location",
//         location === "" || location == null ? "0" : String(location),
//       );

//       urlencoded.append(
//         "OpeningValue",
//         openingValue === "" || openingValue == null
//           ? "0"
//           : String(openingValue),
//       );

//       urlencoded.append(
//         "ReOrderLevel",
//         reorderLevel === "" || reorderLevel == null
//           ? "0"
//           : String(reorderLevel),
//       );

//       urlencoded.append(
//         "MinBalance",
//         minbal === "" || minbal == null ? "0" : String(minbal),
//       );

//       urlencoded.append(
//         "MaxBalance",
//         maxbal === "" || maxbal == null ? "0" : String(maxbal),
//       );

//       // HSN Code
//       urlencoded.append(
//         "HSNCode",
//         hsnCode === "" || hsnCode == null ? "0" : String(hsnCode),
//       );

//       // GST
//       urlencoded.append(
//         "CGSTPercentage",
//         CGST === "" || CGST == null ? "0" : String(CGST),
//       );

//       urlencoded.append(
//         "IGSTPercentage",
//         IGST === "" || IGST == null ? "0" : String(IGST),
//       );

//       urlencoded.append(
//         "SGSTPercentage",
//         SGST === "" || SGST == null ? "0" : String(SGST),
//       );

//       // ==========================================
//       // 5. CHECK WHAT WE ARE SENDING
//       // ==========================================

//       console.log("========== PRODUCT CREATE PAYLOAD ==========");

//       console.log(Object.fromEntries(urlencoded.entries()));

//       // ==========================================
//       // 6. API REQUEST
//       // ==========================================

//       const response = await axios.post(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/postproductmaster.php",
//         urlencoded,
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         },
//       );

//       // ==========================================
//       // 7. API RESPONSE
//       // ==========================================

//       console.log("========== PRODUCT CREATE RESPONSE ==========");

//       console.log(response.data);

//       // ==========================================
//       // 8. CHECK BACKEND ERROR
//       // ==========================================

//       if (response.data && response.data.status === "error") {
//         console.error("Product creation failed:", response.data);

//         toast.error(response.data.message || "Product not created");

//         return;
//       }

//       // ==========================================
//       // 9. SUCCESS
//       // ==========================================

//       toast.success("Product created successfully");

//       await fetchData();

//       handleClearTemplate();

//       handleDrawerClose();
//     } catch (error) {
//       console.error("========== PRODUCT CREATE ERROR ==========");

//       console.error(error);

//       if (error.response) {
//         console.error("Backend Response:", error.response.data);

//         toast.error(error.response.data?.message || "Product not created");
//       } else {
//         toast.error("Unable to connect to Product API");
//       }
//     }
//   };

//   const handleClearTemplate = () => {
//     setProductCode("");
//     setSelectedGroupOption("");
//     setProductName("");
//     setUOM("");

//     setPurchasePrice(0);
//     setDealerPrice("");
//     setCreditPrice("");
//     setLocation("");
//     setOpeningValue(0);
//     setReorderLevel(0);
//     setMinBal(0);
//     setMaxBal(0);
//     setHsnCode(0);
//     setCGST(0);
//     setIGST(0);
//     setSGST(0);
//   };

//   const [productsGroups, setProductsGroups] = useState([]);
//   const [materialGroupError, setMaterialGroupError] = useState("");
//   // Fetch data from API material group
//   useEffect(() => {
//     axios
//       .get(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
//       )
//       .then((response) => {
//         if (response.data && Array.isArray(response.data)) {
//           // Extract unique MaterialGroupId values
//           const uniqueGroups = [
//             ...new Set(response.data.map((item) => item.ProductGroupId)),
//           ];
//           setProductsGroups(uniqueGroups);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching Material Groups:", error);
//         // setMaterialGroupError("Failed to load Material Groups.");
//       });
//   }, []);

//   //tble data
//   const [totalPages, setTotalPages] = useState(1);

// const fetchData = async () => {
//   try {
//     const response = await axios.get(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
//     );

//     const result = response.data;

//     console.log("Product Master API Response:", result);

//     if (!Array.isArray(result)) {
//       console.error("API response is not an array:", result);
//       setData([]);
//       setTotalPages(1);
//       return;
//     }

//     // Remove products where ProductName is null, undefined, or blank
//     const filteredResult = result.filter(
//       (item) =>
//         item?.ProductName !== null &&
//         item?.ProductName !== undefined &&
//         String(item?.ProductName).trim() !== ""
//     );

//     console.log(
//       "Filtered Product Master Data:",
//       filteredResult
//     );

//     const formattedData = filteredResult.map((item) => ({
//       ...item,

//       // Dealer Price
//       DealerPrice:
//         item.DealerPrice ??
//         item.dealerPrice ??
//         item.DEALERPRICE ??
//         item.dealer_price ??
//         item.Dealerprice ??
//         item["Dealer Price"] ??
//         "",

//       // Credit Price
//       CreditPrice:
//         item.CreditPrice ??
//         item.creditPrice ??
//         item.CREDITPRICE ??
//         item.credit_price ??
//         item.Creditprice ??
//         item["Credit Price"] ??
//         "",
//     }));

//     console.log(
//       "Formatted Product Master Data:",
//       formattedData
//     );

//     // Check values in console
//     formattedData.forEach((item) => {
//       console.log(
//         "Product ID:",
//         item.Id,
//         " | Product Name:",
//         item.ProductName,
//         " | Purchase Price:",
//         item.PurchasePrice,
//         " | Dealer Price:",
//         item.DealerPrice,
//         " | Credit Price:",
//         item.CreditPrice,
//       );
//     });

//     // =====================================================
//     // NEW PRODUCT FIRST
//     // Sort by Id in descending order
//     // Higher Id = newly created product
//     // =====================================================
//     formattedData.sort(
//       (a, b) => Number(b.Id || 0) - Number(a.Id || 0)
//     );

//     console.log(
//       "Sorted Product Master Data (Newest First):",
//       formattedData
//     );

//     setData(formattedData);
//     setTotalPages(1);

//   } catch (error) {
//     console.error("Error fetching Product Master:", error);

//     toast.error("Unable to load Product Master data");

//     setData([]);
//     setTotalPages(1);
//   }
// };

//   // console.log("result", data);
//   useEffect(() => {
//     fetchData();
//   }, [pageNo]);

//   // edit drawer
//   const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);
//   const handleEditDrawerOpen = () => {
//     handleEdit();
//     setEditIsDrawerOpen(true);
//     handleMenuClose();
//   };

//   const handleEditDrawerClose = () => {
//     setEditIsDrawerOpen(false);
//   };

//   //update
//   const UpdateProductMaster = () => {
//     const urlencoded = new URLSearchParams();
//     urlencoded.append("ProductCode", updateproductCode);
//     urlencoded.append("ProductGroupId", selectedGroupOption);
//     urlencoded.append("ProductName", updateproductName);
//     urlencoded.append("UOM", updateUOM);

//     urlencoded.append("PurchasePrice", updatepurchasePrice);
//     urlencoded.append("DealerPrice", updateDealerPrice);
//     urlencoded.append("CreditPrice", updateCreditPrice);
//     urlencoded.append("Location", updatelocation);
//     urlencoded.append("OpeningValue", updateopeningValue);
//     urlencoded.append("ReOrderLevel", updatereorderLevel);
//     urlencoded.append("MinBalance", updateminbal);
//     urlencoded.append("MaxBalance", updatemaxbal);
//     urlencoded.append("HSNCode", updatehsnCode);
//     urlencoded.append("CGSTPercentage", updateCGST);
//     urlencoded.append("IGSTPercentage", updateIGST);
//     urlencoded.append("SGSTPercentage", updateSGST);
//     urlencoded.append("Id", idwiseData);
//     const requestOptions = {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     };

//     axios
//       .post(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/updateproductmaster.php",
//         urlencoded,
//         requestOptions,
//       )
//       .then((response) => {
//         console.log("API Response:", response.data);
//         toast.success("Product Master Updated successfully");
//         fetchData();
//         handleEditDrawerClose();
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   //for delete

//   const DeleteProductMaster = async () => {
//     // 1. Check whether selected row and Id are available
//     if (!currentRow || !currentRow.original || !currentRow.original.Id) {
//       toast.error("Product ID not found");
//       return;
//     }

//     // 2. Get Product Id
//     const productId = currentRow.original.Id;

//     // 3. Delete API URL
//     const url = `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=ProductMaster&Id=${productId}`;

//     console.log("Delete API URL:", url);
//     console.log("Product ID:", productId);

//     try {
//       // 4. Call Delete API
//       const response = await fetch(url, {
//         method: "GET",
//         redirect: "follow",
//       });

//       // 5. Read API response
//       const result = await response.text();

//       console.log("Delete API Status:", response.status);
//       console.log("Delete API Response:", result);

//       // 6. Check backend/database error
//       if (
//         result.includes("Connection could not be established") ||
//         result.includes("Login failed") ||
//         result.includes("SQLSTATE") ||
//         result.includes('"error"')
//       ) {
//         toast.error("Product delete failed. Database connection problem.");
//         return;
//       }

//       // 7. Check HTTP error
//       if (!response.ok) {
//         toast.error("Product delete failed.");
//         return;
//       }

//       // 8. Success
//       toast.success("Product deleted successfully!");

//       // 9. Refresh product list
//       await fetchData();

//       // 10. Close menu
//       handleMenuClose();

//       // 11. Clear selected row
//       setCurrentRow(null);
//     } catch (error) {
//       console.error("Delete API Error:", error);
//       toast.error("Product delete failed.");
//     }
//   };

//   return (
//     <Box>
//       {/* ==================== PAGE TITLE ==================== */}
//       <Box textAlign={"center"}>
//         <Typography variant="h4" color="var(--complementary-color)">
//           <b>Product Master</b>
//         </Typography>
//       </Box>

//       {/* ==================== MAIN CONTENT ==================== */}
//       <Box
//         sx={{
//           p: 5,
//           height: "auto",
//         }}
//       >
//         {/* ==================== CREATE BUTTON ==================== */}
//         <Box sx={{ display: "flex", gap: 3 }}>
//           <Button
//             sx={{ background: "var(--complementary-color)" }}
//             variant="contained"
//             onClick={handleDrawerOpen}
//           >
//             Create Product Master
//           </Button>
//         </Box>

//         {/* ==================== PRODUCT TABLE ==================== */}
//         <Box mt={4} m={2}>
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: "#E9ECEF",
//                 color: "black",
//                 fontSize: "16px",
//               },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                 mt={2}
//                 alignItems={"center"}
//                 display={"flex"}
//                 justifyContent="flex-end"
//                 width="100%"
//               >
//                 {/* FIRST PAGE */}
//                 <FirstPageIcon
//                   sx={{ cursor: "pointer" }}
//                   onClick={() => setPageNo(1)}
//                 />
//                 {/* PREVIOUS PAGE */}
//                 <KeyboardArrowLeftIcon
//                   sx={{ cursor: "pointer" }}
//                   onClick={() =>
//                     setPageNo((prev) => Math.max(Number(prev) - 1, 1))
//                   }
//                 />
//                 <Box>Page No</Box>
//                 {/* PAGE NUMBER */}
//                 <TextField
//                   sx={{
//                     width: "4.5%",
//                     ml: 1,
//                     "@media (max-width: 768px)": {
//                       width: "10%",
//                     },
//                   }}
//                   value={pageNo}
//                   onChange={(e) => setPageNo(e.target.value)}
//                   size="small"
//                 />
//                 {/* NEXT PAGE */}
//                 <KeyboardArrowRightIcon
//                   sx={{ cursor: "pointer" }}
//                   onClick={() => setPageNo((prev) => Number(prev) + 1)}
//                 />
//                 {/* LAST PAGE */}
//                 <LastPageIcon
//                   sx={{ cursor: "pointer" }}
//                   onClick={() => setPageNo(totalPages)}
//                 />
//                 Total Pages : {totalPages}
//               </Box>
//             )}
//           />

//           {/* ==================== ACTION MENU ==================== */}
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem onClick={handleEditDrawerOpen}>Edit</MenuItem>

//             <MenuItem onClick={DeleteProductMaster}>Delete</MenuItem>
//           </Menu>
//         </Box>

//         {/* ====================================================== */}
//         {/* ================= CREATE DRAWER ====================== */}
//         {/* ====================================================== */}

//         <Drawer
//           anchor="right"
//           open={isDrawerOpen}
//           onClose={handleDrawerClose}
//           PaperProps={{
//             sx: {
//               borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//               width: isSmallScreen ? "100%" : "650px",
//               zIndex: 1000,
//             },
//           }}
//         >
//           {/* CREATE HEADER */}
//           <Box
//             sx={{
//               padding: 2,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "rgb(236, 253, 230)",
//             }}
//           >
//             <Typography m={2} variant="h6">
//               <b>Create Product Master</b>
//             </Typography>

//             <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
//           </Box>

//           <Divider />

//           {/* ================= PRODUCT CODE + GROUP ================= */}
//           <Box display="flex" alignItems="center" gap={2} m={1}>
//             {/* PRODUCT CODE */}
//             <Box flex={1} display="flex" flexDirection="column" gap={1}>
//               <Typography variant="body2">Product Code</Typography>

//               <TextField
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//                 value={productCode}
//                 size="small"
//                 placeholder="Product Code Autogenrated"
//                 fullWidth
//               />
//             </Box>

//             {/* PRODUCT GROUP */}
//             <Box flex={1} display="flex" flexDirection="column" gap={1}>
//               <Typography variant="body2">Product Group</Typography>

//               <FormControl
//                 fullWidth
//                 size="small"
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//               >
//                 <Select
//                   value={selectedGroupOption}
//                   onChange={(event) =>
//                     setSelectedGroupOption(event.target.value)
//                   }
//                 >
//                   {groupOption.length > 0 ? (
//                     groupOption.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem disabled>No options available</MenuItem>
//                   )}
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           {/* ================= PRODUCT NAME + UOM ================= */}
//           <Box display={"flex"} alignItems={"center"} gap={2} m={1}>
//             {/* PRODUCT NAME */}
//             <Box flex={2}>
//               <Typography>Product Name</Typography>

//               <TextField
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 size="small"
//                 placeholder="Enter Product Name"
//                 fullWidth
//               />
//             </Box>

//             {/* UOM */}
//             <Box flex={1}>
//               <Typography>UOM</Typography>

//               <FormControl
//                 fullWidth
//                 size="small"
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//               >
//                 <Select
//                   value={UOM}
//                   onChange={(event) => setUOM(event.target.value)}
//                   displayEmpty
//                 >
//                   <MenuItem value="">Select UOM</MenuItem>

//                   {/* FIXED UOM VALUE */}
//                   <MenuItem value="No">No</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           {/* ================= PRICE SECTION ================= */}
//           <Box>
//             <Box display="flex" alignItems="center" gap={2} m={1}>
//               {/* LEFT COLUMN */}
//               <Box flex={1}>
//                 {/* SALES PRICE */}

//                 {/* OPENING VALUE */}
//                 <Box mt={2}>
//                   <Typography>Opening Value</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={openingValue}
//                     onChange={(e) => setOpeningValue(e.target.value)}
//                     size="small"
//                     placeholder="Enter Op.Value"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* CGST */}
//                 <Box mt={2}>
//                   <Typography>CGST%</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={CGST}
//                     onChange={(e) => setCGST(e.target.value)}
//                     size="small"
//                     placeholder="Enter CGST%"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>

//               {/* MIDDLE COLUMN */}
//               <Box flex={1}>
//                 {/* ================= RETAILER PRICE ================= */}
//                 <Box>
//                   <Typography>Retailer Price</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={purchasePrice}
//                     onChange={(e) => setPurchasePrice(e.target.value)}
//                     size="small"
//                     placeholder="Enter Retailer Price"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* ================= DEALER PRICE ================= */}
//                 <Box mt={2}>
//                   <Typography>Dealer Price</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={dealerPrice}
//                     onChange={(e) => setDealerPrice(e.target.value)}
//                     size="small"
//                     placeholder="Enter Dealer Price"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* ================= CREDIT PRICE ================= */}
//                 <Box mt={2}>
//                   <Typography>Caterers Price</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={creditPrice}
//                     onChange={(e) => setCreditPrice(e.target.value)}
//                     size="small"
//                     placeholder="Enter Caterers Price"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* REORDER LEVEL */}
//                 <Box mt={2}>
//                   <Typography>Reorder Level</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={reorderLevel}
//                     onChange={(e) => setReorderLevel(e.target.value)}
//                     size="small"
//                     placeholder="Enter Reorder Level"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* SGST */}
//                 <Box mt={2}>
//                   <Typography>SGST%</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={SGST}
//                     onChange={(e) => setSGST(e.target.value)}
//                     size="small"
//                     placeholder="Enter SGST"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>

//               {/* RIGHT COLUMN */}
//               <Box flex={1}>
//                 {/* LOCATION */}
//                 <Box>
//                   <Typography>Location</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     size="small"
//                     placeholder="Enter Location"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* MIN BALANCE */}
//                 <Box mt={2}>
//                   <Typography>Min Balance</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={minbal}
//                     onChange={(e) => setMinBal(e.target.value)}
//                     size="small"
//                     placeholder="Enter Min Balance"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* IGST */}
//                 <Box mt={2}>
//                   <Typography>IGST%</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={IGST}
//                     onChange={(e) => setIGST(e.target.value)}
//                     size="small"
//                     placeholder="Enter IGST"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>
//             </Box>
//           </Box>

//           {/* ================= MAX BALANCE + HSN ================= */}
//           <Box mt={1}>
//             <Box display="flex" alignItems="center" gap={2} m={1}>
//               {/* MAX BALANCE */}
//               <Box flex={1}>
//                 <Typography>Max Balance</Typography>

//                 <TextField
//                   variant="standard"
//                   sx={{
//                     "& .MuiInput-underline:after": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                     },
//                     mt: 1,
//                   }}
//                   focused
//                   value={maxbal}
//                   onChange={(e) => setMaxBal(e.target.value)}
//                   size="small"
//                   placeholder="Enter Max Balance"
//                   fullWidth
//                 />
//               </Box>

//               {/* HSN CODE */}
//               <Box flex={1}>
//                 <Typography>HSN Code</Typography>

//                 <TextField
//                   variant="standard"
//                   sx={{
//                     "& .MuiInput-underline:after": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                     },
//                     mt: 1,
//                   }}
//                   focused
//                   value={hsnCode}
//                   onChange={(e) => setHsnCode(e.target.value)}
//                   size="small"
//                   placeholder="Enter HSN Code"
//                   fullWidth
//                 />
//               </Box>
//             </Box>
//           </Box>

//           {/* ================= CREATE BUTTONS ================= */}
//           <Box
//             display={"flex"}
//             alignItems={"center"}
//             justifyContent={"center"}
//             gap={2}
//             mt={5}
//           >
//             <Box>
//               <Button
//                 sx={{
//                   background: "var(--primary-color)",
//                 }}
//                 onClick={CreateProductMaster}
//                 variant="contained"
//               >
//                 Save
//               </Button>
//             </Box>

//             <Box>
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
//             </Box>
//           </Box>
//         </Drawer>

//         {/* ====================================================== */}
//         {/* ================= EDIT DRAWER ======================== */}
//         {/* ====================================================== */}

//         <Drawer
//           anchor="right"
//           open={isEditDrawerOpen}
//           onClose={handleEditDrawerClose}
//           PaperProps={{
//             sx: {
//               borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//               width: isSmallScreen ? "100%" : "650px",
//               zIndex: 1000,
//             },
//           }}
//         >
//           {/* EDIT HEADER */}
//           <Box
//             sx={{
//               padding: 2,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "rgb(236, 253, 230)",
//             }}
//           >
//             <Typography m={2} variant="h6">
//               <b>Update Product Master</b>
//             </Typography>

//             <CloseIcon
//               sx={{ cursor: "pointer" }}
//               onClick={handleEditDrawerClose}
//             />
//           </Box>

//           <Divider />

//           {/* ================= PRODUCT CODE + GROUP ================= */}
//           <Box display="flex" alignItems="center" gap={2} m={1}>
//             {/* PRODUCT CODE */}
//             <Box flex={1} display="flex" flexDirection="column" gap={1}>
//               <Typography variant="body2">Product Code</Typography>

//               <TextField
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//                 value={updateproductCode}
//                 size="small"
//                 placeholder="Enter Product Code"
//                 fullWidth
//               />
//             </Box>

//             {/* PRODUCT GROUP */}
//             <Box flex={1} display="flex" flexDirection="column" gap={1}>
//               <Typography variant="body2">Product Group</Typography>

//               <FormControl
//                 fullWidth
//                 size="small"
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//               >
//                 <Select
//                   value={selectedGroupOption}
//                   onChange={(event) =>
//                     setSelectedGroupOption(event.target.value)
//                   }
//                 >
//                   {groupOption.length > 0 ? (
//                     groupOption.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem disabled>No options available</MenuItem>
//                   )}
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           {/* ================= PRODUCT NAME + UOM ================= */}
//           <Box display={"flex"} alignItems={"center"} gap={2} m={1}>
//             {/* PRODUCT NAME */}
//             <Box flex={2}>
//               <Typography>Product Name</Typography>

//               <TextField
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//                 value={updateproductName}
//                 onChange={(e) => setUpdateProductName(e.target.value)}
//                 size="small"
//                 placeholder="Enter Product Name"
//                 fullWidth
//               />
//             </Box>

//             {/* UOM */}
//             <Box flex={1}>
//               <Typography>UOM</Typography>

//               <FormControl
//                 fullWidth
//                 size="small"
//                 variant="standard"
//                 sx={{
//                   "& .MuiInput-underline:after": {
//                     borderBottomWidth: 1.5,
//                     borderBottomColor: "#44ad74",
//                   },
//                   mt: 1,
//                 }}
//                 focused
//               >
//                 <Select
//                   value={updateUOM}
//                   onChange={(e) => setUpdateUOM(e.target.value)}
//                 >
//                   {/* FIXED UOM VALUE */}
//                   <MenuItem value="No">No</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           {/* ================= EDIT PRICE SECTION ================= */}
//           <Box>
//             <Box display="flex" alignItems="center" m={1} gap={1}>
//               {/* LEFT COLUMN */}
//               <Box flex={1}>
//                 {/* SALES PRICE */}
//                 <Box>
//                   <Typography>Sales Price</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updatesalesPrice}
//                     onChange={(e) => setUpdateSalesPrice(e.target.value)}
//                     size="small"
//                     placeholder="Enter Sales Price"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* OPENING VALUE */}
//                 <Box mt={2}>
//                   <Typography>Opening Value</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updateopeningValue}
//                     onChange={(e) => setUpdateOpeningValue(e.target.value)}
//                     size="small"
//                     placeholder="Enter Op.Value"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* CGST */}
//                 <Box mt={2}>
//                   <Typography>CGST%</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updateCGST}
//                     onChange={(e) => setUpdateCGST(e.target.value)}
//                     size="small"
//                     placeholder="Enter CGST%"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>

//               {/* MIDDLE COLUMN */}
//               <Box flex={1}>
//                 {/* RETAILER PRICE */}

//                 <Box>
//                   <Typography>Retailer Price</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updatepurchasePrice}
//                     onChange={(e) => setUpdatePurchasePrice(e.target.value)}
//                     size="small"
//                     placeholder="Enter Retailer Price"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* DEALER PRICE - FIXED */}
//                 <Box mt={2}>
//                   <Typography>Dealer Price</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updateDealerPrice}
//                     onChange={(e) => setUpdateDealerPrice(e.target.value)}
//                     size="small"
//                     placeholder="Enter Dealer Price"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* CREDIT PRICE */}
//                 <Box mt={2}>
//                   <Typography>Catters Price</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updateCreditPrice}
//                     onChange={(e) => setUpdateCreditPrice(e.target.value)}
//                     size="small"
//                     placeholder="Enter Catters Price"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* REORDER LEVEL */}
//                 <Box mt={2}>
//                   <Typography>Reorder Level</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updatereorderLevel}
//                     onChange={(e) => setUpdateReorderLevel(e.target.value)}
//                     size="small"
//                     placeholder="Enter Reorder Level"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* SGST */}
//                 <Box mt={2}>
//                   <Typography>SGST%</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updateSGST}
//                     onChange={(e) => setUpdateSGST(e.target.value)}
//                     size="small"
//                     placeholder="Enter SGST"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>

//               {/* RIGHT COLUMN */}
//               <Box flex={1}>
//                 {/* LOCATION */}
//                 <Box>
//                   <Typography>Location</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updatelocation}
//                     onChange={(e) => setUpdateLocation(e.target.value)}
//                     size="small"
//                     placeholder="Enter Location"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* MIN BALANCE */}
//                 <Box mt={2}>
//                   <Typography>Min Balance</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updateminbal}
//                     onChange={(e) => setUpdateMinBal(e.target.value)}
//                     size="small"
//                     placeholder="Enter Min Balance"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* IGST */}
//                 <Box mt={2}>
//                   <Typography>IGST%</Typography>

//                   <TextField
//                     variant="standard"
//                     sx={{
//                       "& .MuiInput-underline:after": {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: "#44ad74",
//                       },
//                       mt: 1,
//                     }}
//                     focused
//                     value={updateIGST}
//                     onChange={(e) => setUpdateIGST(e.target.value)}
//                     size="small"
//                     placeholder="Enter IGST"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>
//             </Box>
//           </Box>

//           {/* ================= EDIT MAX BALANCE + HSN ================= */}
//           <Box>
//             <Box display="flex" alignItems="center" gap={1} m={1}>
//               {/* MAX BALANCE */}
//               <Box flex={1}>
//                 <Typography>Max Balance</Typography>

//                 <TextField
//                   variant="standard"
//                   sx={{
//                     "& .MuiInput-underline:after": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                     },
//                     mt: 1,
//                   }}
//                   focused
//                   value={updatemaxbal}
//                   onChange={(e) => setUpdateMaxBal(e.target.value)}
//                   size="small"
//                   placeholder="Enter Max Balance"
//                   fullWidth
//                 />
//               </Box>

//               {/* HSN CODE */}
//               <Box flex={1}>
//                 <Typography>HSN Code</Typography>

//                 <TextField
//                   variant="standard"
//                   sx={{
//                     "& .MuiInput-underline:after": {
//                       borderBottomWidth: 1.5,
//                       borderBottomColor: "#44ad74",
//                     },
//                     mt: 1,
//                   }}
//                   focused
//                   value={updatehsnCode}
//                   onChange={(e) => setUpdateHsnCode(e.target.value)}
//                   size="small"
//                   placeholder="Enter HSN Code"
//                   fullWidth
//                 />
//               </Box>
//             </Box>
//           </Box>

//           {/* ================= UPDATE BUTTONS ================= */}
//           <Box
//             display={"flex"}
//             alignItems={"center"}
//             justifyContent={"center"}
//             gap={2}
//             mt={5}
//           >
//             <Box>
//               <Button
//                 sx={{
//                   background: "var(--primary-color)",
//                 }}
//                 onClick={UpdateProductMaster}
//                 variant="contained"
//               >
//                 Save
//               </Button>
//             </Box>

//             <Box>
//               <Button
//                 sx={{
//                   borderColor: "var(--complementary-color)",
//                   color: "var(--complementary-color)",
//                 }}
//                 onClick={handleEditDrawerClose}
//                 variant="outlined"
//               >
//                 <b>Cancel</b>
//               </Button>
//             </Box>
//           </Box>
//         </Drawer>
//       </Box>
//     </Box>
//   );
// };

// export default ProductMaster;



























































import { useMemo, useState, useEffect } from "react";
import {
  useMediaQuery,
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Drawer,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { MaterialReactTable } from "material-react-table";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import "../Components/common.css";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";

const ProductMaster = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // =========================================================
  // CREATE DRAWER
  // =========================================================

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // =========================================================
  // PRODUCT GROUP
  // =========================================================

  const [groupOption, setGroupOption] = useState([]);
  const [selectedGroupOption, setSelectedGroupOption] = useState("");

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=productgroup",
      );

      const result = await response.json();

      console.log("Product Group API Response:", result);

      if (!Array.isArray(result)) {
        console.error(
          "Product Group API response is not an array:",
          result,
        );

        setGroupOption([]);
        return;
      }

      const options = result
        .filter(
          (grp) =>
            grp?.GroupName !== null &&
            grp?.GroupName !== undefined &&
            String(grp?.GroupName).trim() !== "",
        )
        .map((grp) => ({
          value: grp.Id,
          label: String(grp.GroupName).trim(),
        }));

      setGroupOption(options);
    } catch (error) {
      console.error("Error fetching Product Groups:", error);
      setGroupOption([]);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  // =========================================================
  // TABLE MENU
  // =========================================================

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // =========================================================
  // ID
  // =========================================================

  const [idwiseData, setIdwiseData] = useState("");

  // =========================================================
  // CREATE STATES
  // =========================================================

  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [UOM, setUOM] = useState("");

  // Sales Price
  const [salesPrice, setSalesPrice] = useState(0);

  // Retailer Price
  const [purchasePrice, setPurchasePrice] = useState(0);

  // Dealer Price
  const [dealerPrice, setDealerPrice] = useState("");

  // Caterers Price
  const [creditPrice, setCreditPrice] = useState("");

  const [location, setLocation] = useState("");
  const [openingValue, setOpeningValue] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(0);

  const [minbal, setMinBal] = useState(0);
  const [maxbal, setMaxBal] = useState(0);

  const [hsnCode, setHsnCode] = useState("");

  const [CGST, setCGST] = useState(0);
  const [IGST, setIGST] = useState(0);
  const [SGST, setSGST] = useState(0);

  // =========================================================
  // UPDATE STATES
  // =========================================================

  const [updateproductCode, setUpdateProductCode] = useState("");
  const [updateproductName, setUpdateProductName] = useState("");
  const [updateUOM, setUpdateUOM] = useState("");

  const [updatesalesPrice, setUpdateSalesPrice] = useState("");

  const [updatepurchasePrice, setUpdatePurchasePrice] = useState("");
  const [updateDealerPrice, setUpdateDealerPrice] = useState("");
  const [updateCreditPrice, setUpdateCreditPrice] = useState("");

  const [updatelocation, setUpdateLocation] = useState("");
  const [updateopeningValue, setUpdateOpeningValue] = useState("");
  const [updatereorderLevel, setUpdateReorderLevel] = useState("");

  const [updateminbal, setUpdateMinBal] = useState("");
  const [updatemaxbal, setUpdateMaxBal] = useState("");

  const [updatehsnCode, setUpdateHsnCode] = useState("");

  const [updateCGST, setUpdateCGST] = useState("");
  const [updateIGST, setUpdateIGST] = useState("");
  const [updateSGST, setUpdateSGST] = useState("");

  // =========================================================
  // EDIT DRAWER
  // =========================================================

  const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);

  const handleEdit = () => {
    if (!currentRow || !currentRow.original) {
      toast.error("Please select a product");
      return;
    }

    const product = currentRow.original;

    console.log("Editing product:", product);

    setIdwiseData(product.Id);

    setUpdateProductCode(product.ProductCode ?? "");
    setSelectedGroupOption(product.ProductGroupId ?? "");
    setUpdateProductName(product.ProductName ?? "");
    setUpdateUOM(product.UOM ?? "");

    // =======================================================
    // PRICE VALUES
    // =======================================================

    setUpdateSalesPrice(product.SellPrice ?? "");
    setUpdatePurchasePrice(product.PurchasePrice ?? "");
    setUpdateDealerPrice(product.DealerPrice ?? "");
    setUpdateCreditPrice(product.CreditPrice ?? "");

    // =======================================================
    // OTHER VALUES
    // =======================================================

    setUpdateLocation(product.Location ?? "");
    setUpdateOpeningValue(product.OpeningValue ?? "");
    setUpdateReorderLevel(product.ReOrderLevel ?? "");

    setUpdateMinBal(product.MinBalance ?? "");
    setUpdateMaxBal(product.MaxBalance ?? "");

    setUpdateHsnCode(product.HSNCode ?? "");

    // =======================================================
    // GST
    // =======================================================

    setUpdateCGST(product.CGSTPercentage ?? "");
    setUpdateIGST(product.IGSTPercentage ?? "");
    setUpdateSGST(product.SGSTPercentage ?? "");
  };

  const handleEditDrawerOpen = () => {
    handleEdit();
    setEditIsDrawerOpen(true);
    handleMenuClose();
  };

  const handleEditDrawerClose = () => {
    setEditIsDrawerOpen(false);
  };

  // =========================================================
  // TABLE DATA
  // =========================================================

  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns = useMemo(
    () => [
      {
        accessorKey: "ProductCode",
        header: "Product Code",
        size: 150,
      },

      {
        accessorKey: "ProductName",
        header: "ProductName",
        size: 180,
      },

      {
        accessorKey: "SellPrice",
        header: "Sales Price",
        size: 150,
      },

      {
        accessorKey: "PurchasePrice",
        header: "Retailer Price",
        size: 150,
      },

      {
        accessorKey: "DealerPrice",
        header: "Dealer Price",
        size: 150,
      },

      {
        accessorKey: "CreditPrice",
        header: "Caterers Price",
        size: 150,
      },

      {
        id: "actions",
        header: "Actions",
        size: 120,

        Cell: ({ row }) => (
          <IconButton onClick={(event) => handleMenuOpen(event, row)}>
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ],
    [],
  );

  // =========================================================
  // CREATE PRODUCT
  // =========================================================

  const CreateProductMaster = async () => {
    // -------------------------------------------------------
    // PRODUCT NAME VALIDATION
    // -------------------------------------------------------

    if (!productName || productName.trim() === "") {
      alert("Please enter Product Name.");
      return;
    }

    try {
      const urlencoded = new URLSearchParams();

      // -------------------------------------------------------
      // PRODUCT BASIC INFO
      // -------------------------------------------------------

      urlencoded.append(
        "ProductCode",
        productCode === "" || productCode == null
          ? "0"
          : String(productCode),
      );

      urlencoded.append(
        "ProductGroupId",
        selectedGroupOption === "" || selectedGroupOption == null
          ? "0"
          : String(selectedGroupOption),
      );

      urlencoded.append("ProductName", productName.trim());

      urlencoded.append(
        "UOM",
        UOM === "" || UOM == null ? "No" : String(UOM),
      );

      // -------------------------------------------------------
      // PRICE VALUES
      // -------------------------------------------------------

      urlencoded.append(
        "SellPrice",
        salesPrice === "" || salesPrice == null
          ? "0"
          : String(salesPrice),
      );

      urlencoded.append(
        "PurchasePrice",
        purchasePrice === "" || purchasePrice == null
          ? "0"
          : String(purchasePrice),
      );

      urlencoded.append(
        "DealerPrice",
        dealerPrice === "" || dealerPrice == null
          ? "0"
          : String(dealerPrice),
      );

      urlencoded.append(
        "CreditPrice",
        creditPrice === "" || creditPrice == null
          ? "0"
          : String(creditPrice),
      );

      // -------------------------------------------------------
      // OTHER VALUES
      // -------------------------------------------------------

      urlencoded.append(
        "Location",
        location === "" || location == null ? "0" : String(location),
      );

      urlencoded.append(
        "OpeningValue",
        openingValue === "" || openingValue == null
          ? "0"
          : String(openingValue),
      );

      urlencoded.append(
        "ReOrderLevel",
        reorderLevel === "" || reorderLevel == null
          ? "0"
          : String(reorderLevel),
      );

      urlencoded.append(
        "MinBalance",
        minbal === "" || minbal == null ? "0" : String(minbal),
      );

      urlencoded.append(
        "MaxBalance",
        maxbal === "" || maxbal == null ? "0" : String(maxbal),
      );

      // -------------------------------------------------------
      // HSN
      // -------------------------------------------------------

      urlencoded.append(
        "HSNCode",
        hsnCode === "" || hsnCode == null ? "0" : String(hsnCode),
      );

      // -------------------------------------------------------
      // GST
      // -------------------------------------------------------

      urlencoded.append(
        "CGSTPercentage",
        CGST === "" || CGST == null ? "0" : String(CGST),
      );

      urlencoded.append(
        "IGSTPercentage",
        IGST === "" || IGST == null ? "0" : String(IGST),
      );

      urlencoded.append(
        "SGSTPercentage",
        SGST === "" || SGST == null ? "0" : String(SGST),
      );

      // -------------------------------------------------------
      // DEBUG PAYLOAD
      // -------------------------------------------------------

      console.log(
        "========== PRODUCT CREATE PAYLOAD ==========",
      );

      console.log(
        Object.fromEntries(urlencoded.entries()),
      );

      // -------------------------------------------------------
      // CREATE API
      // -------------------------------------------------------

      const response = await axios.post(
        "https://amrutdairyapi.microtechsolutions.net.in/php/postproductmaster.php",
        urlencoded,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log(
        "========== PRODUCT CREATE RESPONSE ==========",
      );

      console.log(response.data);

      // -------------------------------------------------------
      // BACKEND ERROR
      // -------------------------------------------------------

      if (
        response.data &&
        response.data.status === "error"
      ) {
        toast.error(
          response.data.message || "Product not created",
        );

        return;
      }

      // -------------------------------------------------------
      // SUCCESS
      // -------------------------------------------------------

      toast.success("Product created successfully");

      await fetchData();

      handleClearTemplate();

      handleDrawerClose();
    } catch (error) {
      console.error(
        "========== PRODUCT CREATE ERROR ==========",
      );

      console.error(error);

      if (error.response) {
        console.error(
          "Backend Response:",
          error.response.data,
        );

        toast.error(
          error.response.data?.message ||
            "Product not created",
        );
      } else {
        toast.error(
          "Unable to connect to Product API",
        );
      }
    }
  };

  // =========================================================
  // CLEAR CREATE FORM
  // =========================================================

  const handleClearTemplate = () => {
    setProductCode("");
    setSelectedGroupOption("");
    setProductName("");
    setUOM("");

    setSalesPrice(0);
    setPurchasePrice(0);
    setDealerPrice("");
    setCreditPrice("");

    setLocation("");
    setOpeningValue(0);
    setReorderLevel(0);

    setMinBal(0);
    setMaxBal(0);

    setHsnCode("");

    setCGST(0);
    setIGST(0);
    setSGST(0);
  };

  // =========================================================
  // FETCH PRODUCT DATA
  // =========================================================

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster",
      );

      const result = response.data;

      console.log(
        "Product Master API Response:",
        result,
      );

      if (!Array.isArray(result)) {
        console.error(
          "API response is not an array:",
          result,
        );

        setData([]);
        setTotalPages(1);

        return;
      }

      // -------------------------------------------------------
      // FILTER EMPTY PRODUCT NAMES
      // -------------------------------------------------------

      const filteredResult = result.filter(
        (item) =>
          item?.ProductName !== null &&
          item?.ProductName !== undefined &&
          String(item?.ProductName).trim() !== "",
      );

      // -------------------------------------------------------
      // FORMAT DATA
      // -------------------------------------------------------

      const formattedData = filteredResult.map(
        (item) => ({
          ...item,

          DealerPrice:
            item.DealerPrice ??
            item.dealerPrice ??
            item.DEALERPRICE ??
            item.dealer_price ??
            item.Dealerprice ??
            item["Dealer Price"] ??
            "",

          CreditPrice:
            item.CreditPrice ??
            item.creditPrice ??
            item.CREDITPRICE ??
            item.credit_price ??
            item.Creditprice ??
            item["Credit Price"] ??
            "",

          SellPrice:
            item.SellPrice ??
            item.sellPrice ??
            item.SELLPRICE ??
            item.sell_price ??
            item["Sell Price"] ??
            "",
        }),
      );

      console.log(
        "Formatted Product Master Data:",
        formattedData,
      );

      // -------------------------------------------------------
      // SORT NEWEST FIRST
      // -------------------------------------------------------

      formattedData.sort(
        (a, b) =>
          Number(b.Id || 0) -
          Number(a.Id || 0),
      );

      setData(formattedData);

      setTotalPages(1);
    } catch (error) {
      console.error(
        "Error fetching Product Master:",
        error,
      );

      toast.error(
        "Unable to load Product Master data",
      );

      setData([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  // =========================================================
  // UPDATE PRODUCT
  // =========================================================

  const UpdateProductMaster = async () => {
    try {
      const urlencoded = new URLSearchParams();

      // -------------------------------------------------------
      // BASIC INFO
      // -------------------------------------------------------

      urlencoded.append(
        "ProductCode",
        updateproductCode ?? "",
      );

      urlencoded.append(
        "ProductGroupId",
        selectedGroupOption ?? "0",
      );

      urlencoded.append(
        "ProductName",
        updateproductName ?? "",
      );

      urlencoded.append(
        "UOM",
        updateUOM ?? "No",
      );

      // -------------------------------------------------------
      // PRICE VALUES
      // -------------------------------------------------------

      urlencoded.append(
        "SellPrice",
        updatesalesPrice ?? "0",
      );

      urlencoded.append(
        "PurchasePrice",
        updatepurchasePrice ?? "0",
      );

      urlencoded.append(
        "DealerPrice",
        updateDealerPrice ?? "0",
      );

      urlencoded.append(
        "CreditPrice",
        updateCreditPrice ?? "0",
      );

      // -------------------------------------------------------
      // OTHER VALUES
      // -------------------------------------------------------

      urlencoded.append(
        "Location",
        updatelocation ?? "0",
      );

      urlencoded.append(
        "OpeningValue",
        updateopeningValue ?? "0",
      );

      urlencoded.append(
        "ReOrderLevel",
        updatereorderLevel ?? "0",
      );

      urlencoded.append(
        "MinBalance",
        updateminbal ?? "0",
      );

      urlencoded.append(
        "MaxBalance",
        updatemaxbal ?? "0",
      );

      // -------------------------------------------------------
      // HSN
      // -------------------------------------------------------

      urlencoded.append(
        "HSNCode",
        updatehsnCode ?? "0",
      );

      // -------------------------------------------------------
      // GST
      // -------------------------------------------------------

      urlencoded.append(
        "CGSTPercentage",
        updateCGST ?? "0",
      );

      urlencoded.append(
        "IGSTPercentage",
        updateIGST ?? "0",
      );

      urlencoded.append(
        "SGSTPercentage",
        updateSGST ?? "0",
      );

      urlencoded.append(
        "Id",
        idwiseData,
      );

      // -------------------------------------------------------
      // DEBUG
      // -------------------------------------------------------

      console.log(
        "========== PRODUCT UPDATE PAYLOAD ==========",
      );

      console.log(
        Object.fromEntries(urlencoded.entries()),
      );

      // -------------------------------------------------------
      // API
      // -------------------------------------------------------

      const response = await axios.post(
        "https://amrutdairyapi.microtechsolutions.net.in/php/updateproductmaster.php",
        urlencoded,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        },
      );

      console.log(
        "========== PRODUCT UPDATE RESPONSE ==========",
      );

      console.log(response.data);

      toast.success(
        "Product Master Updated successfully",
      );

      await fetchData();

      handleEditDrawerClose();
    } catch (error) {
      console.error(
        "Product Update Error:",
        error,
      );

      if (error.response) {
        console.error(
          "Backend Response:",
          error.response.data,
        );

        toast.error(
          error.response.data?.message ||
            "Product update failed",
        );
      } else {
        toast.error(
          "Unable to connect to Product API",
        );
      }
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const DeleteProductMaster = async () => {
    if (
      !currentRow ||
      !currentRow.original ||
      !currentRow.original.Id
    ) {
      toast.error("Product ID not found");
      return;
    }

    const productId =
      currentRow.original.Id;

    const url =
      `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=ProductMaster&Id=${productId}`;

    console.log(
      "Delete API URL:",
      url,
    );

    console.log(
      "Product ID:",
      productId,
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
      });

      const result =
        await response.text();

      console.log(
        "Delete API Status:",
        response.status,
      );

      console.log(
        "Delete API Response:",
        result,
      );

      if (
        result.includes(
          "Connection could not be established",
        ) ||
        result.includes(
          "Login failed",
        ) ||
        result.includes("SQLSTATE") ||
        result.includes('"error"')
      ) {
        toast.error(
          "Product delete failed. Database connection problem.",
        );

        return;
      }

      if (!response.ok) {
        toast.error(
          "Product delete failed.",
        );

        return;
      }

      toast.success(
        "Product deleted successfully!",
      );

      await fetchData();

      handleMenuClose();

      setCurrentRow(null);
    } catch (error) {
      console.error(
        "Delete API Error:",
        error,
      );

      toast.error(
        "Product delete failed.",
      );
    }
  };

  // =========================================================
  // COMMON TEXT FIELD STYLE
  // =========================================================

  const textFieldSx = {
    "& .MuiInput-underline:after": {
      borderBottomWidth: 1.5,
      borderBottomColor: "#44ad74",
    },
    mt: 1,
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <Box>

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <Box textAlign="center">
        <Typography
          variant="h4"
          color="var(--complementary-color)"
        >
          <b>Product Master</b>
        </Typography>
      </Box>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <Box
        sx={{
          p: 5,
          height: "auto",
        }}
      >

        {/* CREATE BUTTON */}

        <Box
          sx={{
            display: "flex",
            gap: 3,
          }}
        >
          <Button
            sx={{
              background:
                "var(--complementary-color)",
            }}
            variant="contained"
            onClick={handleDrawerOpen}
          >
            Create Product Master
          </Button>
        </Box>

        {/* =================================================
            PRODUCT TABLE
        ================================================= */}

        <Box
          mt={4}
          m={2}
        >
          <MaterialReactTable
            columns={columns}
            data={data}
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
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setPageNo(1)
                  }
                />

                <KeyboardArrowLeftIcon
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setPageNo(
                      (prev) =>
                        Math.max(
                          Number(prev) - 1,
                          1,
                        ),
                    )
                  }
                />

                <Box>
                  Page No
                </Box>

                <TextField
                  sx={{
                    width: "4.5%",
                    ml: 1,

                    "@media (max-width: 768px)":
                      {
                        width: "10%",
                      },
                  }}
                  value={pageNo}
                  onChange={(e) =>
                    setPageNo(
                      e.target.value,
                    )
                  }
                  size="small"
                />

                <KeyboardArrowRightIcon
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setPageNo(
                      (prev) =>
                        Number(prev) + 1,
                    )
                  }
                />

                <LastPageIcon
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setPageNo(totalPages)
                  }
                />

                Total Pages : {totalPages}
              </Box>
            )}
          />

          {/* ACTION MENU */}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={
                handleEditDrawerOpen
              }
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={
                DeleteProductMaster
              }
            >
              Delete
            </MenuItem>
          </Menu>
        </Box>

        {/* =====================================================
            CREATE DRAWER
        ===================================================== */}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius:
                isSmallScreen
                  ? "0"
                  : "10px 0 0 10px",

              width:
                isSmallScreen
                  ? "100%"
                  : "650px",

              zIndex: 1000,
            },
          }}
        >

          {/* HEADER */}

          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              background:
                "rgb(236, 253, 230)",
            }}
          >
            <Typography
              m={2}
              variant="h6"
            >
              <b>
                Create Product Master
              </b>
            </Typography>

            <CloseIcon
              sx={{
                cursor: "pointer",
              }}
              onClick={
                handleDrawerClose
              }
            />
          </Box>

          <Divider />

          {/* PRODUCT CODE + GROUP */}

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            m={1}
          >

            {/* PRODUCT CODE */}

            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Typography variant="body2">
                Product Code
              </Typography>

              <TextField
                variant="standard"
                sx={textFieldSx}
                focused
                value={productCode}
                size="small"
                placeholder="Product Code Autogenrated"
                fullWidth
              />
            </Box>

            {/* PRODUCT GROUP */}

            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Typography variant="body2">
                Product Group
              </Typography>

              <FormControl
                fullWidth
                size="small"
                variant="standard"
                sx={textFieldSx}
                focused
              >
                <Select
                  value={
                    selectedGroupOption
                  }
                  onChange={(event) =>
                    setSelectedGroupOption(
                      event.target.value,
                    )
                  }
                >
                  {groupOption.length >
                  0 ? (
                    groupOption.map(
                      (option) => (
                        <MenuItem
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </MenuItem>
                      ),
                    )
                  ) : (
                    <MenuItem disabled>
                      No options available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* PRODUCT NAME + UOM */}

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            m={1}
          >

            <Box flex={2}>
              <Typography>
                Product Name
              </Typography>

              <TextField
                variant="standard"
                sx={textFieldSx}
                focused
                value={productName}
                onChange={(e) =>
                  setProductName(
                    e.target.value,
                  )
                }
                size="small"
                placeholder="Enter Product Name"
                fullWidth
              />
            </Box>

            <Box flex={1}>
              <Typography>
                UOM
              </Typography>

              <FormControl
                fullWidth
                size="small"
                variant="standard"
                sx={textFieldSx}
                focused
              >
                <Select
                  value={UOM}
                  onChange={(event) =>
                    setUOM(
                      event.target.value,
                    )
                  }
                  displayEmpty
                >
                  <MenuItem value="">
                    Select UOM
                  </MenuItem>

                  <MenuItem value="No">
                    No
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* =================================================
              CREATE FORM FINAL LAYOUT
          ================================================= */}

          <Box>

            <Box
              display="flex"
              alignItems="flex-start"
              gap={2}
              m={1}
            >

              {/* ================= LEFT COLUMN ================= */}

              <Box flex={1}>

                {/* SALES PRICE */}

                <Box>
                  <Typography>
                    Sales Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={salesPrice}
                    onChange={(e) =>
                      setSalesPrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Sales Price"
                    fullWidth
                  />
                </Box>

                {/* OPENING VALUE */}

                <Box mt={2}>
                  <Typography>
                    Opening Value
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={openingValue}
                    onChange={(e) =>
                      setOpeningValue(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Op.Value"
                    fullWidth
                  />
                </Box>

                {/* CGST */}

                <Box mt={2}>
                  <Typography>
                    CGST %
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={CGST}
                    onChange={(e) =>
                      setCGST(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter CGST%"
                    fullWidth
                  />
                </Box>

                {/* IGST */}

                <Box mt={2}>
                  <Typography>
                    IGST %
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={IGST}
                    onChange={(e) =>
                      setIGST(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter IGST%"
                    fullWidth
                  />
                </Box>

                {/* SGST */}

                <Box mt={2}>
                  <Typography>
                    SGST %
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={SGST}
                    onChange={(e) =>
                      setSGST(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter SGST%"
                    fullWidth
                  />
                </Box>

                {/* HSN CODE */}

                <Box mt={2}>
                  <Typography>
                    HSN Code
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={hsnCode}
                    onChange={(e) =>
                      setHsnCode(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter HSN Code"
                    fullWidth
                  />
                </Box>

              </Box>

              {/* ================= RIGHT COLUMN ================= */}

              <Box flex={1}>

                {/* RETAILER PRICE */}

                <Box>
                  <Typography>
                    Retailer Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={purchasePrice}
                    onChange={(e) =>
                      setPurchasePrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Retailer Price"
                    fullWidth
                  />
                </Box>

                {/* DEALER PRICE */}

                <Box mt={2}>
                  <Typography>
                    Dealer Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={dealerPrice}
                    onChange={(e) =>
                      setDealerPrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Dealer Price"
                    fullWidth
                  />
                </Box>

                {/* CATERERS PRICE */}

                <Box mt={2}>
                  <Typography>
                    Caterers Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={creditPrice}
                    onChange={(e) =>
                      setCreditPrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Caterers Price"
                    fullWidth
                  />
                </Box>

                {/* MIN BALANCE */}

                <Box mt={2}>
                  <Typography>
                    Min Balance
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={minbal}
                    onChange={(e) =>
                      setMinBal(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Min Balance"
                    fullWidth
                  />
                </Box>

                {/* MAX BALANCE */}

                <Box mt={2}>
                  <Typography>
                    Max Balance
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={maxbal}
                    onChange={(e) =>
                      setMaxBal(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Max Balance"
                    fullWidth
                  />
                </Box>

                {/* REORDER LEVEL */}

                <Box mt={2}>
                  <Typography>
                    Reorder Level
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={reorderLevel}
                    onChange={(e) =>
                      setReorderLevel(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Reorder Level"
                    fullWidth
                  />
                </Box>

              </Box>

            </Box>
          </Box>

          {/* CREATE BUTTONS */}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mt={5}
            mb={3}
          >
            <Button
              sx={{
                background:
                  "var(--primary-color)",
              }}
              onClick={
                CreateProductMaster
              }
              variant="contained"
            >
              Save
            </Button>

            <Button
              sx={{
                borderColor:
                  "var(--complementary-color)",
                color:
                  "var(--complementary-color)",
              }}
              onClick={
                handleDrawerClose
              }
              variant="outlined"
            >
              <b>Cancel</b>
            </Button>
          </Box>
        </Drawer>

        {/* =====================================================
            EDIT DRAWER
        ===================================================== */}

        <Drawer
          anchor="right"
          open={isEditDrawerOpen}
          onClose={
            handleEditDrawerClose
          }
          PaperProps={{
            sx: {
              borderRadius:
                isSmallScreen
                  ? "0"
                  : "10px 0 0 10px",

              width:
                isSmallScreen
                  ? "100%"
                  : "650px",

              zIndex: 1000,
            },
          }}
        >

          {/* EDIT HEADER */}

          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              background:
                "rgb(236, 253, 230)",
            }}
          >
            <Typography
              m={2}
              variant="h6"
            >
              <b>
                Update Product Master
              </b>
            </Typography>

            <CloseIcon
              sx={{
                cursor: "pointer",
              }}
              onClick={
                handleEditDrawerClose
              }
            />
          </Box>

          <Divider />

          {/* PRODUCT CODE + GROUP */}

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            m={1}
          >

            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Typography variant="body2">
                Product Code
              </Typography>

              <TextField
                variant="standard"
                sx={textFieldSx}
                focused
                value={
                  updateproductCode
                }
                size="small"
                placeholder="Enter Product Code"
                fullWidth
              />
            </Box>

            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Typography variant="body2">
                Product Group
              </Typography>

              <FormControl
                fullWidth
                size="small"
                variant="standard"
                sx={textFieldSx}
                focused
              >
                <Select
                  value={
                    selectedGroupOption
                  }
                  onChange={(event) =>
                    setSelectedGroupOption(
                      event.target.value,
                    )
                  }
                >
                  {groupOption.length >
                  0 ? (
                    groupOption.map(
                      (option) => (
                        <MenuItem
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </MenuItem>
                      ),
                    )
                  ) : (
                    <MenuItem disabled>
                      No options available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

          </Box>

          {/* PRODUCT NAME + UOM */}

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            m={1}
          >

            <Box flex={2}>
              <Typography>
                Product Name
              </Typography>

              <TextField
                variant="standard"
                sx={textFieldSx}
                focused
                value={
                  updateproductName
                }
                onChange={(e) =>
                  setUpdateProductName(
                    e.target.value,
                  )
                }
                size="small"
                placeholder="Enter Product Name"
                fullWidth
              />
            </Box>

            <Box flex={1}>
              <Typography>
                UOM
              </Typography>

              <FormControl
                fullWidth
                size="small"
                variant="standard"
                sx={textFieldSx}
                focused
              >
                <Select
                  value={updateUOM}
                  onChange={(e) =>
                    setUpdateUOM(
                      e.target.value,
                    )
                  }
                >
                  <MenuItem value="No">
                    No
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

          </Box>

          {/* =================================================
              EDIT FINAL LAYOUT
          ================================================= */}

          <Box>

            <Box
              display="flex"
              alignItems="flex-start"
              gap={2}
              m={1}
            >

              {/* ================= LEFT COLUMN ================= */}

              <Box flex={1}>

                {/* SALES PRICE */}

                <Box>
                  <Typography>
                    Sales Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updatesalesPrice
                    }
                    onChange={(e) =>
                      setUpdateSalesPrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Sales Price"
                    fullWidth
                  />
                </Box>

                {/* OPENING VALUE */}

                <Box mt={2}>
                  <Typography>
                    Opening Value
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updateopeningValue
                    }
                    onChange={(e) =>
                      setUpdateOpeningValue(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Op.Value"
                    fullWidth
                  />
                </Box>

                {/* CGST */}

                <Box mt={2}>
                  <Typography>
                    CGST %
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={updateCGST}
                    onChange={(e) =>
                      setUpdateCGST(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter CGST%"
                    fullWidth
                  />
                </Box>

                {/* IGST */}

                <Box mt={2}>
                  <Typography>
                    IGST %
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={updateIGST}
                    onChange={(e) =>
                      setUpdateIGST(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter IGST%"
                    fullWidth
                  />
                </Box>

                {/* SGST */}

                <Box mt={2}>
                  <Typography>
                    SGST %
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={updateSGST}
                    onChange={(e) =>
                      setUpdateSGST(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter SGST%"
                    fullWidth
                  />
                </Box>

                {/* HSN */}

                <Box mt={2}>
                  <Typography>
                    HSN Code
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updatehsnCode
                    }
                    onChange={(e) =>
                      setUpdateHsnCode(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter HSN Code"
                    fullWidth
                  />
                </Box>

              </Box>

              {/* ================= RIGHT COLUMN ================= */}

              <Box flex={1}>

                {/* RETAILER PRICE */}

                <Box>
                  <Typography>
                    Retailer Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updatepurchasePrice
                    }
                    onChange={(e) =>
                      setUpdatePurchasePrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Retailer Price"
                    fullWidth
                  />
                </Box>

                {/* DEALER PRICE */}

                <Box mt={2}>
                  <Typography>
                    Dealer Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updateDealerPrice
                    }
                    onChange={(e) =>
                      setUpdateDealerPrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Dealer Price"
                    fullWidth
                  />
                </Box>

                {/* CATERERS PRICE */}

                <Box mt={2}>
                  <Typography>
                    Caterers Price
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updateCreditPrice
                    }
                    onChange={(e) =>
                      setUpdateCreditPrice(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Caterers Price"
                    fullWidth
                  />
                </Box>

                {/* MIN BALANCE */}

                <Box mt={2}>
                  <Typography>
                    Min Balance
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updateminbal
                    }
                    onChange={(e) =>
                      setUpdateMinBal(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Min Balance"
                    fullWidth
                  />
                </Box>

                {/* MAX BALANCE */}

                <Box mt={2}>
                  <Typography>
                    Max Balance
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updatemaxbal
                    }
                    onChange={(e) =>
                      setUpdateMaxBal(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Max Balance"
                    fullWidth
                  />
                </Box>

                {/* REORDER LEVEL */}

                <Box mt={2}>
                  <Typography>
                    Reorder Level
                  </Typography>

                  <TextField
                    variant="standard"
                    sx={textFieldSx}
                    focused
                    value={
                      updatereorderLevel
                    }
                    onChange={(e) =>
                      setUpdateReorderLevel(
                        e.target.value,
                      )
                    }
                    size="small"
                    placeholder="Enter Reorder Level"
                    fullWidth
                  />
                </Box>

              </Box>

            </Box>
          </Box>

          {/* UPDATE BUTTONS */}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mt={5}
            mb={3}
          >
            <Button
              sx={{
                background:
                  "var(--primary-color)",
              }}
              onClick={
                UpdateProductMaster
              }
              variant="contained"
            >
              Save
            </Button>

            <Button
              sx={{
                borderColor:
                  "var(--complementary-color)",
                color:
                  "var(--complementary-color)",
              }}
              onClick={
                handleEditDrawerClose
              }
              variant="outlined"
            >
              <b>Cancel</b>
            </Button>
          </Box>

        </Drawer>

      </Box>
    </Box>
  );
};

export default ProductMaster;