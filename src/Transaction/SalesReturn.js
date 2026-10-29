
// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Autocomplete,
//   IconButton,
//   Snackbar,
//   Alert,
//   Divider,
//   Chip,
//   Stack,
// } from "@mui/material";

// import {
//   AddRounded,
//   DeleteOutlineRounded,
//   SaveRounded,
//   RestartAltRounded,
//   ShoppingCartRounded,
// } from "@mui/icons-material";

// const ORANGE = "#E66B27";
// const GREEN = "#075333";

// const sampleCustomers = [
//   { AccountId: 1, AccountName: "Shree Ganesh Stores", ContactNo: "9876543210" },
//   { AccountId: 2, AccountName: "Sai Dairy Stores", ContactNo: "9823456780" },
// ];

// const sampleProducts = [
//   { ProductId: 1, ProductName: "Milk 500 ml", Rate: 30 },
//   { ProductId: 2, ProductName: "Curd 500 g", Rate: 35 },
//   { ProductId: 3, ProductName: "Paneer 200 g", Rate: 80 },
// ];

// const getToday = () => {
//   const date = new Date();
//   return [
//     date.getFullYear(),
//     String(date.getMonth() + 1).padStart(2, "0"),
//     String(date.getDate()).padStart(2, "0"),
//   ].join("-");
// };

// const formatAmount = (value) =>
//   (Number(value) || 0).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// export default function SalesReturn() {
//   const [returnDate, setReturnDate] = useState(getToday());

//   const [customer, setCustomer] = useState(null);
//   const [contactNo, setContactNo] = useState("");
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [remarks, setRemarks] = useState("");

//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState("1");
//   const [rate, setRate] = useState("");

//   const [products, setProducts] = useState([]);

//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("success");

//   const [returnNo] = useState(
//     () => `SR-${Date.now().toString().slice(-8)}`
//   );

//   const subtotal = useMemo(
//     () =>
//       products.reduce(
//         (sum, item) => sum + Number(item.Quantity) * Number(item.Rate),
//         0
//       ),
//     [products]
//   );

//   const total = subtotal;

//   const showMessage = (text, type = "success") => {
//     setMessage(text);
//     setMessageType(type);
//   };

//   const handleCustomerChange = (_, value) => {
//     setCustomer(value);
//     setContactNo(value?.ContactNo || "");
//   };

//   const handleProductChange = (_, value) => {
//     setProduct(value);
//     setRate(value ? String(value.Rate) : "");
//   };

//   const handleAddProduct = () => {
//     const qty = Number(quantity);
//     const productRate = Number(rate);

//     if (!product) {
//       showMessage("Please select a product.", "warning");
//       return;
//     }

//     if (!Number.isFinite(qty) || qty <= 0) {
//       showMessage("Please enter a valid quantity.", "warning");
//       return;
//     }

//     if (!Number.isFinite(productRate) || productRate < 0) {
//       showMessage("Please enter a valid rate.", "warning");
//       return;
//     }

//     setProducts((previous) => {
//       const existing = previous.find(
//         (item) => item.ProductId === product.ProductId
//       );

//       if (existing) {
//         return previous.map((item) =>
//           item.ProductId === product.ProductId
//             ? {
//                 ...item,
//                 Quantity: Number(item.Quantity) + qty,
//                 Rate: productRate,
//               }
//             : item
//         );
//       }

//       return [
//         ...previous,
//         {
//           ProductId: product.ProductId,
//           ProductName: product.ProductName,
//           Quantity: qty,
//           Rate: productRate,
//         },
//       ];
//     });

//     setProduct(null);
//     setQuantity("1");
//     setRate("");
//   };

//   const updateProduct = (id, field, value) => {
//     setProducts((previous) =>
//       previous.map((item) =>
//         item.ProductId === id
//           ? { ...item, [field]: value }
//           : item
//       )
//     );
//   };

//   const removeProduct = (id) => {
//     setProducts((previous) =>
//       previous.filter((item) => item.ProductId !== id)
//     );
//   };

//   const handleClear = () => {
//     setCustomer(null);
//     setContactNo("");
//     setInvoiceNo("");
//     setRemarks("");
//     setProduct(null);
//     setQuantity("1");
//     setRate("");
//     setProducts([]);
//     setReturnDate(getToday());
//     showMessage("Form cleared.");
//   };

//   const handleSave = () => {
//     if (!customer) {
//       showMessage("Please select a customer.", "warning");
//       return;
//     }

//     if (!returnDate) {
//       showMessage("Please select a return date.", "warning");
//       return;
//     }

//     if (products.length === 0) {
//       showMessage("Please add at least one product.", "warning");
//       return;
//     }

//     const invalidProduct = products.some(
//       (item) =>
//         !Number.isFinite(Number(item.Quantity)) ||
//         Number(item.Quantity) <= 0 ||
//         !Number.isFinite(Number(item.Rate)) ||
//         Number(item.Rate) < 0
//     );

//     if (invalidProduct) {
//       showMessage("Please check product quantities and rates.", "warning");
//       return;
//     }

//     const payload = {
//       SalesReturnNo: returnNo,
//       SalesReturnDate: returnDate,
//       AccountId: customer.AccountId,
//       ContactNo: contactNo,
//       InvoiceNo: invoiceNo,
//       Remarks: remarks,
//       ProductDetails: products.map((item) => ({
//         ...item,
//         Amount: Number(
//           (Number(item.Quantity) * Number(item.Rate)).toFixed(2)
//         ),
//       })),
//       SubTotal: Number(subtotal.toFixed(2)),
//       Total: Number(total.toFixed(2)),
//     };

//     // Connect your actual Sales Return POST API here.
//     console.log("Sales Return Payload:", payload);

//     showMessage(
//       "Validation successful. Connect your Sales Return API to save permanently.",
//       "info"
//     );
//   };

//   const fieldStyle = {
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "10px",
//       backgroundColor: "#FFFFFF",
//     },
//     "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
//       borderColor: GREEN,
//     },
//     "& .MuiInputLabel-root.Mui-focused": {
//       color: GREEN,
//     },
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#F5F7F6",
//         p: { xs: 1.5, md: 3 },
//       }}
//     >
//       <Box sx={{ maxWidth: 1500, mx: "auto" }}>
//         {/* Page heading */}
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           spacing={2}
//           sx={{ mb: 3 }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               sx={{ color: ORANGE, fontWeight: 800 }}
//             >
//               Sales Return
//             </Typography>

//             <Typography variant="body2" color="text.secondary">
//               Manage customer product returns
//             </Typography>
//           </Box>

//           <Chip
//             label="NEW RETURN"
//             sx={{
//               bgcolor: "#DDF3E4",
//               color: GREEN,
//               fontWeight: 800,
//               borderRadius: "8px",
//             }}
//           />
//         </Stack>

//         {/* Return information */}
//         <Paper
//           elevation={0}
//           sx={{
//             border: "1px solid #E0E8E3",
//             borderRadius: 3,
//             overflow: "hidden",
//             mb: 3,
//           }}
//         >
//           <Box
//             sx={{
//               bgcolor: GREEN,
//               color: "#FFFFFF",
//               px: 3,
//               py: 2,
//             }}
//           >
//             <Typography fontWeight={800}>
//               Return Information
//             </Typography>
//           </Box>

//           <Box sx={{ p: { xs: 2, md: 3 } }}>
//             <Grid container spacing={2.5}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   fullWidth
//                   label="Sales Return No."
//                   value={returnNo}
//                   InputProps={{ readOnly: true }}
//                   sx={fieldStyle}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   fullWidth
//                   type="date"
//                   label="Sales Return Date"
//                   value={returnDate}
//                   onChange={(e) => setReturnDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                   sx={fieldStyle}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Autocomplete
//                   options={sampleCustomers}
//                   value={customer}
//                   onChange={handleCustomerChange}
//                   getOptionLabel={(option) => option.AccountName || ""}
//                   isOptionEqualToValue={(option, value) =>
//                     option.AccountId === value.AccountId
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Customer *"
//                       placeholder="Select customer"
//                       sx={fieldStyle}
//                     />
//                   )}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   fullWidth
//                   label="Contact No."
//                   value={contactNo}
//                   onChange={(e) => setContactNo(e.target.value)}
//                   sx={fieldStyle}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Original Sales Bill No."
//                   placeholder="Enter original invoice number"
//                   value={invoiceNo}
//                   onChange={(e) => setInvoiceNo(e.target.value)}
//                   sx={fieldStyle}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={8}>
//                 <TextField
//                   fullWidth
//                   label="Remarks"
//                   placeholder="Reason for product return"
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                   sx={fieldStyle}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>

//         {/* Product details */}
//         <Paper
//           elevation={0}
//           sx={{
//             border: "1px solid #E0E8E3",
//             borderRadius: 3,
//             overflow: "hidden",
//             mb: 3,
//           }}
//         >
//           <Box
//             sx={{
//               bgcolor: "#FFF0E6",
//               borderBottom: "1px solid #F3D7C5",
//               px: 3,
//               py: 2,
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//             }}
//           >
//             <ShoppingCartRounded sx={{ color: ORANGE }} />

//             <Box sx={{ flexGrow: 1 }}>
//               <Typography fontWeight={800} color="#823D18">
//                 Product Details
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Add returned items and update their quantities
//               </Typography>
//             </Box>

//             <Chip
//               label={`${products.length} Items`}
//               sx={{ bgcolor: "#FFFFFF", color: ORANGE, fontWeight: 700 }}
//             />
//           </Box>

//           <Box sx={{ p: { xs: 2, md: 3 } }}>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} md={5}>
//                 <Autocomplete
//                   options={sampleProducts}
//                   value={product}
//                   onChange={handleProductChange}
//                   getOptionLabel={(option) => option.ProductName || ""}
//                   isOptionEqualToValue={(option, value) =>
//                     option.ProductId === value.ProductId
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Product"
//                       placeholder="Search product"
//                       sx={fieldStyle}
//                     />
//                   )}
//                 />
//               </Grid>

//               <Grid item xs={6} md={2}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Return Qty"
//                   value={quantity}
//                   onChange={(e) => setQuantity(e.target.value)}
//                   inputProps={{ min: 0.01, step: 0.01 }}
//                   sx={fieldStyle}
//                 />
//               </Grid>

//               <Grid item xs={6} md={2}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Rate (₹)"
//                   value={rate}
//                   onChange={(e) => setRate(e.target.value)}
//                   inputProps={{ min: 0, step: 0.01 }}
//                   sx={fieldStyle}
//                 />
//               </Grid>

//               <Grid item xs={12} md={3}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   startIcon={<AddRounded />}
//                   onClick={handleAddProduct}
//                   sx={{
//                     height: 56,
//                     bgcolor: ORANGE,
//                     borderRadius: 2,
//                     fontWeight: 800,
//                     textTransform: "none",
//                     "&:hover": { bgcolor: "#C95519" },
//                   }}
//                 >
//                   Add Product
//                 </Button>
//               </Grid>
//             </Grid>

//             {/* Product table */}
//             <Box sx={{ mt: 3, overflowX: "auto" }}>
//               <Box sx={{ minWidth: 750 }}>
//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: "65px minmax(190px,1fr) 120px 130px 140px 60px",
//                     gap: 1,
//                     alignItems: "center",
//                     bgcolor: "#E9EFEB",
//                     color: GREEN,
//                     p: 1.7,
//                     borderRadius: "10px 10px 0 0",
//                     fontWeight: 800,
//                     fontSize: 13,
//                   }}
//                 >
//                   <Box>Sr. No.</Box>
//                   <Box>Product Name</Box>
//                   <Box>Return Qty</Box>
//                   <Box>Rate (₹)</Box>
//                   <Box>Amount (₹)</Box>
//                   <Box>Action</Box>
//                 </Box>

//                 {products.length === 0 ? (
//                   <Box
//                     sx={{
//                       textAlign: "center",
//                       py: 6,
//                       border: "1px solid #E5EBE7",
//                       color: "text.secondary",
//                     }}
//                   >
//                     <ShoppingCartRounded
//                       sx={{ fontSize: 40, color: "#B6C8BE", mb: 1 }}
//                     />
//                     <Typography fontWeight={700}>
//                       No products added
//                     </Typography>
//                     <Typography variant="body2">
//                       Select a product above to get started.
//                     </Typography>
//                   </Box>
//                 ) : (
//                   products.map((item, index) => (
//                     <Box
//                       key={item.ProductId}
//                       sx={{
//                         display: "grid",
//                         gridTemplateColumns: "65px minmax(190px,1fr) 120px 130px 140px 60px",
//                         gap: 1,
//                         alignItems: "center",
//                         p: 1.5,
//                         border: "1px solid #E5EBE7",
//                         borderTop: 0,
//                         bgcolor: index % 2 === 0 ? "#FFFFFF" : "#FAFCFA",
//                       }}
//                     >
//                       <Typography variant="body2">
//                         {index + 1}
//                       </Typography>

//                       <Typography fontWeight={700}>
//                         {item.ProductName}
//                       </Typography>

//                       <TextField
//                         size="small"
//                         type="number"
//                         value={item.Quantity}
//                         inputProps={{ min: 0.01, step: 0.01 }}
//                         onChange={(e) =>
//                           updateProduct(
//                             item.ProductId,
//                             "Quantity",
//                             e.target.value
//                           )
//                         }
//                         sx={fieldStyle}
//                       />

//                       <TextField
//                         size="small"
//                         type="number"
//                         value={item.Rate}
//                         inputProps={{ min: 0, step: 0.01 }}
//                         onChange={(e) =>
//                           updateProduct(
//                             item.ProductId,
//                             "Rate",
//                             e.target.value
//                           )
//                         }
//                         sx={fieldStyle}
//                       />

//                       <Typography fontWeight={800} color={GREEN}>
//                         ₹ {formatAmount(
//                           Number(item.Quantity) * Number(item.Rate)
//                         )}
//                       </Typography>

//                       <IconButton
//                         aria-label="Remove product"
//                         onClick={() => removeProduct(item.ProductId)}
//                         sx={{ color: "#C62828" }}
//                       >
//                         <DeleteOutlineRounded />
//                       </IconButton>
//                     </Box>
//                   ))
//                 )}
//               </Box>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Totals */}
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 3,
//                 height: "100%",
//                 border: "1px solid #E0E8E3",
//                 borderRadius: 3,
//               }}
//             >
//               <Typography fontWeight={800} color={GREEN} gutterBottom>
//                 Return Summary
//               </Typography>

//               <Typography variant="body2" color="text.secondary">
//                 Check the returned products and quantities carefully before
//                 saving this return.
//               </Typography>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 3,
//                 border: "1px solid #D5E6DA",
//                 borderRadius: 3,
//                 bgcolor: "#EFF8F1",
//               }}
//             >
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 sx={{ mb: 2 }}
//               >
//                 <Typography color="text.secondary" fontWeight={600}>
//                   Sub Total
//                 </Typography>
//                 <Typography fontWeight={700}>
//                   ₹ {formatAmount(subtotal)}
//                 </Typography>
//               </Stack>

//               <Divider sx={{ mb: 2 }} />

//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Typography fontWeight={800} color={GREEN} variant="h6">
//                   Return Total
//                 </Typography>

//                 <Typography
//                   sx={{
//                     color: GREEN,
//                     fontWeight: 900,
//                     fontSize: { xs: 22, md: 28 },
//                   }}
//                 >
//                   ₹ {formatAmount(total)}
//                 </Typography>
//               </Stack>

//               <Typography variant="caption" color="text.secondary">
//                 Tax and discount calculations are not included yet.
//               </Typography>
//             </Paper>
//           </Grid>
//         </Grid>

//         {/* Action buttons */}
//         <Stack
//           direction={{ xs: "column-reverse", sm: "row" }}
//           justifyContent="center"
//           spacing={2}
//           sx={{ mt: 3, mb: 2 }}
//         >
//           <Button
//             variant="outlined"
//             startIcon={<RestartAltRounded />}
//             onClick={handleClear}
//             sx={{
//               minWidth: 160,
//               minHeight: 48,
//               borderRadius: 2,
//               color: GREEN,
//               borderColor: GREEN,
//               fontWeight: 800,
//               textTransform: "none",
//             }}
//           >
//             Clear Form
//           </Button>

//           <Button
//             variant="contained"
//             startIcon={<SaveRounded />}
//             onClick={handleSave}
//             sx={{
//               minWidth: 210,
//               minHeight: 48,
//               borderRadius: 2,
//               bgcolor: GREEN,
//               fontWeight: 800,
//               textTransform: "none",
//               "&:hover": { bgcolor: "#043D25" },
//             }}
//           >
//             Save Sales Return
//           </Button>
//         </Stack>
//       </Box>

//       <Snackbar
//         open={Boolean(message)}
//         autoHideDuration={4000}
//         onClose={() => setMessage("")}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           severity={messageType}
//           variant="filled"
//           onClose={() => setMessage("")}
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }













































import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

import {
  AddRounded,
  DeleteOutlineRounded,
  SaveRounded,
  RestartAltRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";

const ORANGE = "#E66B27";
const GREEN = "#075333";

const sampleCustomers = [
  { AccountId: 1, AccountName: "Shree Ganesh Stores", ContactNo: "9876543210" },
  { AccountId: 2, AccountName: "Sai Dairy Stores", ContactNo: "9823456780" },
];

;

const getToday = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatAmount = (value) =>
  (Number(value) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function SalesReturn() {
  const [returnDate, setReturnDate] = useState(getToday());

  const [customer, setCustomer] = useState(null);
  const [contactNo, setContactNo] = useState("");
    const [customerOptions, setCustomerOptions] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [remarks, setRemarks] = useState("");

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("");

  const [products, setProducts] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");


  const [productOptions, setProductOptions] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(false)

  const [returnNo] = useState(
    () => `SR-${Date.now().toString().slice(-8)}`
  );

  const subtotal = useMemo(
    () =>
      products.reduce(
        (sum, item) => sum + Number(item.Quantity) * Number(item.Rate),
        0
      ),
    [products]
  );

  const total = subtotal;

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleCustomerChange = (_, value) => {
    setCustomer(value);
    setContactNo(value?.ContactNo || "");
  };





  const fetchProducts = async () => {
  setLoadingProducts(true);

  try {
    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster"
    );

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Product API Response:", data);

    // Handle common API response structures.
    const productList = Array.isArray(data)
      ? data
      : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.result)
      ? data.result
      : Array.isArray(data.Table)
      ? data.Table
      : [];

    const formattedProducts = productList
      .map((item) => ({
        ...item,
        ProductId: item.ProductId ?? item.Id,
        ProductName: item.ProductName ?? item.Name ?? "",
        Rate: Number(item.Rate ?? 0),
      }))
      .filter(
        (item) =>
          item.ProductId != null &&
          item.ProductName.trim() !== ""
      );

    setProductOptions(formattedProducts);

    if (formattedProducts.length === 0) {
      console.warn("No products found. Check the API response format.");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    showMessage("Unable to fetch products.", "error");
  } finally {
    setLoadingProducts(false);
  }
};




useEffect(() => {
  fetchProducts();
}, []);


  const handleProductChange = (_, value) => {
    setProduct(value);
    setRate(value ? String(value.Rate) : "");
  };

  const handleAddProduct = () => {
    const qty = Number(quantity);
    const productRate = Number(rate);

    if (!product) {
      showMessage("Please select a product.", "warning");
      return;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      showMessage("Please enter a valid quantity.", "warning");
      return;
    }

    if (!Number.isFinite(productRate) || productRate < 0) {
      showMessage("Please enter a valid rate.", "warning");
      return;
    }

    setProducts((previous) => {
      const existing = previous.find(
        (item) => item.ProductId === product.ProductId
      );

      if (existing) {
        return previous.map((item) =>
          item.ProductId === product.ProductId
            ? {
                ...item,
                Quantity: Number(item.Quantity) + qty,
                Rate: productRate,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          ProductId: product.ProductId,
          ProductName: product.ProductName,
          Quantity: qty,
          Rate: productRate,
        },
      ];
    });

    setProduct(null);
    setQuantity("1");
    setRate("");
  };

  const updateProduct = (id, field, value) => {
    setProducts((previous) =>
      previous.map((item) =>
        item.ProductId === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((previous) =>
      previous.filter((item) => item.ProductId !== id)
    );
  };

  const handleClear = () => {
    setCustomer(null);
    setContactNo("");
    setInvoiceNo("");
    setRemarks("");
    setProduct(null);
    setQuantity("1");
    setRate("");
    setProducts([]);
    setReturnDate(getToday());
    showMessage("Form cleared.");
  };

  const handleSave = () => {
    if (!customer) {
      showMessage("Please select a customer.", "warning");
      return;
    }

    if (!returnDate) {
      showMessage("Please select a return date.", "warning");
      return;
    }

    if (products.length === 0) {
      showMessage("Please add at least one product.", "warning");
      return;
    }

    const invalidProduct = products.some(
      (item) =>
        !Number.isFinite(Number(item.Quantity)) ||
        Number(item.Quantity) <= 0 ||
        !Number.isFinite(Number(item.Rate)) ||
        Number(item.Rate) < 0
    );

    if (invalidProduct) {
      showMessage("Please check product quantities and rates.", "warning");
      return;
    }

    const payload = {
      SalesReturnNo: returnNo,
      SalesReturnDate: returnDate,
      AccountId: customer.AccountId,
      ContactNo: contactNo,
      InvoiceNo: invoiceNo,
      Remarks: remarks,
      ProductDetails: products.map((item) => ({
        ...item,
        Amount: Number(
          (Number(item.Quantity) * Number(item.Rate)).toFixed(2)
        ),
      })),
      SubTotal: Number(subtotal.toFixed(2)),
      Total: Number(total.toFixed(2)),
    };

    // Connect your actual Sales Return POST API here.
    console.log("Sales Return Payload:", payload);

    showMessage(
      "Validation successful. Connect your Sales Return API to save permanently.",
      "info"
    );
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#FFFFFF",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: GREEN,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: GREEN,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7F6",
        p: { xs: 1.5, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1500, mx: "auto" }}>
        {/* Page heading */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: ORANGE, fontWeight: 800 }}
            >
              Sales Return
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage customer product returns
            </Typography>
          </Box>

          <Chip
            label="NEW RETURN"
            sx={{
              bgcolor: "#DDF3E4",
              color: GREEN,
              fontWeight: 800,
              borderRadius: "8px",
            }}
          />
        </Stack>

        {/* Return information */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E0E8E3",
            borderRadius: 3,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box
            sx={{
              bgcolor: GREEN,
              color: "#FFFFFF",
              px: 3,
              py: 2,
            }}
          >
            <Typography fontWeight={800}>
              Return Information
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 } }}>
           <Grid container spacing={2.5}>
  {/* Sales Return Number */}
  <Grid item xs={12} sm={6} md={3}>
    <TextField
      fullWidth
      label="Sales Return No."
      value={returnNo}
      InputProps={{ readOnly: true }}
      sx={fieldStyle}
    />
  </Grid>

  {/* Sales Return Date */}
  <Grid item xs={12} sm={6} md={3}>
    <TextField
      fullWidth
      type="date"
      label="Sales Return Date"
      value={returnDate}
      onChange={(e) => setReturnDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={fieldStyle}
    />
  </Grid>

  {/* Customer Dropdown */}
<Grid item xs={12} sm={6} md={3}>
  <Autocomplete
    options={customerOptions}
    value={customer}
    loading={loadingCustomers}
    onChange={handleCustomerChange}
    getOptionLabel={(option) => option.AccountName || ""}
    isOptionEqualToValue={(option, value) =>
      String(option.AccountId) === String(value.AccountId)
    }
    noOptionsText={
      loadingCustomers ? "Loading customers..." : "No customers found"
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select Customer"
        placeholder="Search customer"
        sx={fieldStyle}
      />
    )}
  />
</Grid>

  {/* Contact Number */}
  <Grid item xs={12} sm={6} md={3}>
    <TextField
      fullWidth
      label="Contact No."
      value={contactNo}
      onChange={(e) => setContactNo(e.target.value)}
      sx={fieldStyle}
    />
  </Grid>
</Grid>
          </Box>
        </Paper>

        {/* Product details */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E0E8E3",
            borderRadius: 3,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box
            sx={{
              bgcolor: "#FFF0E6",
              borderBottom: "1px solid #F3D7C5",
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <ShoppingCartRounded sx={{ color: ORANGE }} />

            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight={800} color="#823D18">
                Product Details
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Add returned items and update their quantities
              </Typography>
            </Box>

            <Chip
              label={`${products.length} Items`}
              sx={{ bgcolor: "#FFFFFF", color: ORANGE, fontWeight: 700 }}
            />
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
             <Autocomplete
  options={productOptions}
  value={product}
  loading={loadingProducts}
  onChange={handleProductChange}
  getOptionLabel={(option) => option.ProductName || ""}
  isOptionEqualToValue={(option, value) =>
    String(option.ProductId) === String(value.ProductId)
  }
  noOptionsText={
    loadingProducts ? "Loading products..." : "No products found"
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Product"
      placeholder="Search product"
      sx={fieldStyle}
    />
  )}
/>
              </Grid>

              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Return Qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputProps={{ min: 0.01, step: 0.01 }}
                  sx={fieldStyle}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rate (₹)"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={fieldStyle}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddRounded />}
                  onClick={handleAddProduct}
                  sx={{
                    height: 56,
                    bgcolor: ORANGE,
                    borderRadius: 2,
                    fontWeight: 800,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#C95519" },
                  }}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>

            {/* Product table */}
            <Box sx={{ mt: 3, overflowX: "auto" }}>
              <Box sx={{ minWidth: 750 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "65px minmax(190px,1fr) 120px 130px 140px 60px",
                    gap: 1,
                    alignItems: "center",
                    bgcolor: "#E9EFEB",
                    color: GREEN,
                    p: 1.7,
                    borderRadius: "10px 10px 0 0",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  <Box>Sr. No.</Box>
                  <Box>Product Name</Box>
                  <Box>Return Qty</Box>
                  <Box>Rate (₹)</Box>
                  <Box>Amount (₹)</Box>
                  <Box>Action</Box>
                </Box>

                {products.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      border: "1px solid #E5EBE7",
                      color: "text.secondary",
                    }}
                  >
                    <ShoppingCartRounded
                      sx={{ fontSize: 40, color: "#B6C8BE", mb: 1 }}
                    />
                    <Typography fontWeight={700}>
                      No products added
                    </Typography>
                    <Typography variant="body2">
                      Select a product above to get started.
                    </Typography>
                  </Box>
                ) : (
                  products.map((item, index) => (
                    <Box
                      key={item.ProductId}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "65px minmax(190px,1fr) 120px 130px 140px 60px",
                        gap: 1,
                        alignItems: "center",
                        p: 1.5,
                        border: "1px solid #E5EBE7",
                        borderTop: 0,
                        bgcolor: index % 2 === 0 ? "#FFFFFF" : "#FAFCFA",
                      }}
                    >
                      <Typography variant="body2">
                        {index + 1}
                      </Typography>

                      <Typography fontWeight={700}>
                        {item.ProductName}
                      </Typography>

                      <TextField
                        size="small"
                        type="number"
                        value={item.Quantity}
                        inputProps={{ min: 0.01, step: 0.01 }}
                        onChange={(e) =>
                          updateProduct(
                            item.ProductId,
                            "Quantity",
                            e.target.value
                          )
                        }
                        sx={fieldStyle}
                      />

                      <TextField
                        size="small"
                        type="number"
                        value={item.Rate}
                        inputProps={{ min: 0, step: 0.01 }}
                        onChange={(e) =>
                          updateProduct(
                            item.ProductId,
                            "Rate",
                            e.target.value
                          )
                        }
                        sx={fieldStyle}
                      />

                      <Typography fontWeight={800} color={GREEN}>
                        ₹ {formatAmount(
                          Number(item.Quantity) * Number(item.Rate)
                        )}
                      </Typography>

                      <IconButton
                        aria-label="Remove product"
                        onClick={() => removeProduct(item.ProductId)}
                        sx={{ color: "#C62828" }}
                      >
                        <DeleteOutlineRounded />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Totals */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                border: "1px solid #E0E8E3",
                borderRadius: 3,
              }}
            >
              <Typography fontWeight={800} color={GREEN} gutterBottom>
                Return Summary
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Check the returned products and quantities carefully before
                saving this return.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #D5E6DA",
                borderRadius: 3,
                bgcolor: "#EFF8F1",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography color="text.secondary" fontWeight={600}>
                  Sub Total
                </Typography>
                <Typography fontWeight={700}>
                  ₹ {formatAmount(subtotal)}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={800} color={GREEN} variant="h6">
                  Return Total
                </Typography>

                <Typography
                  sx={{
                    color: GREEN,
                    fontWeight: 900,
                    fontSize: { xs: 22, md: 28 },
                  }}
                >
                  ₹ {formatAmount(total)}
                </Typography>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Tax and discount calculations are not included yet.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Action buttons */}
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="center"
          spacing={2}
          sx={{ mt: 3, mb: 2 }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAltRounded />}
            onClick={handleClear}
            sx={{
              minWidth: 160,
              minHeight: 48,
              borderRadius: 2,
              color: GREEN,
              borderColor: GREEN,
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            Clear Form
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveRounded />}
            onClick={handleSave}
            sx={{
              minWidth: 210,
              minHeight: 48,
              borderRadius: 2,
              bgcolor: GREEN,
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { bgcolor: "#043D25" },
            }}
          >
            Save Sales Return
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={messageType}
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
