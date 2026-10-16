

// import React from "react";

// import {
//   Box,
//   MenuItem,
//   Typography,
//   TextField,
//   Button,
//   useMediaQuery,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";

// import { useNavigate } from "react-router-dom";

// import BaggroundImg from "../imgs/bg7.2.jpg";
// import logo from "../imgs/amrutlogo.png";

// import { useState, useEffect } from "react";

// import { toast } from "react-toastify";

// import { Visibility, VisibilityOff } from "@mui/icons-material";

// import dayjs from "dayjs";

// import Cookies from "js-cookie";

// import axios from "axios";

// const Login = () => {
//   const navigate = useNavigate();

//   const isSmallScreen = useMediaQuery("(max-width:600px)");

//   // ==========================================================
//   // LOGIN STATES
//   // ==========================================================

//   const [userName, setUsername] = useState("");

//   const [password, setPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // ==========================================================
//   // PASSWORD VISIBILITY
//   // ==========================================================

//   const handleClickShowPassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   // ==========================================================
//   // LOGIN
//   // ==========================================================

//   const Login = () => {
//     // ========================================================
//     // BASIC VALIDATION
//     // ========================================================

//     if (!userName || !password) {
//       alert("Please enter username and password.");

//       return;
//     }

//     // ========================================================
//     // TEMPORARY SALE USER
//     //
//     // Username: Sale
//     // Password: sale123456
//     // ========================================================

//     if (userName.trim().toLowerCase() === "sale" && password === "sale123456") {
//       // ------------------------------------------------------
//       // Clear old session values
//       // ------------------------------------------------------

//       sessionStorage.removeItem("UserRole");

//       sessionStorage.removeItem("UserId");

//       sessionStorage.removeItem("Name");

//       // ------------------------------------------------------
//       // Sale User ID
//       // ------------------------------------------------------

//       sessionStorage.setItem("UserId", "SALE");

//       // ------------------------------------------------------
//       // Sale User Name
//       // ------------------------------------------------------

//       sessionStorage.setItem("Name", "Sale User");

//       // ------------------------------------------------------
//       // Sale Role
//       // ------------------------------------------------------

//       sessionStorage.setItem("UserRole", "SALE");

//       // ------------------------------------------------------
//       // Success message
//       // ------------------------------------------------------

//       toast.success("Sale User Login Successful");

//       // ------------------------------------------------------
//       // Show Date Range screen
//       // ------------------------------------------------------

//       setIsLoggedIn(true);

//       // IMPORTANT:
//       // Do not call backend for Sale user.

//       return;
//     }

//     // ========================================================
//     // EXISTING BACKEND LOGIN
//     // ========================================================

//     const myHeaders = new Headers();

//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     // ========================================================
//     // REQUEST DATA
//     // ========================================================

//     const urlencoded = new URLSearchParams();

//     urlencoded.append("UserId", userName);

//     urlencoded.append("Password", password);

//     // ========================================================
//     // REQUEST OPTIONS
//     // ========================================================

//     const requestOptions = {
//       method: "POST",

//       headers: myHeaders,

//       body: urlencoded,

//       redirect: "follow",
//     };

//     // ========================================================
//     // BACKEND LOGIN API
//     // ========================================================

//     fetch(
//       "https://arohanagroapi.microtechsolutions.net.in/php/Usernameget.php",
//       requestOptions,
//     )
//       .then((response) => response.json())

//       .then((result) => {
//         console.log("Login API Result:", result);

//         // ==================================================
//         // LOGIN SUCCESS
//         // ==================================================

//         if (result?.message === "Login successful") {
//           // ------------------------------------------------
//           // Clear old session values
//           // ------------------------------------------------

//           sessionStorage.removeItem("UserRole");

//           // ------------------------------------------------
//           // Store User ID
//           // ------------------------------------------------

//           sessionStorage.setItem("UserId", result.Id);

//           // ------------------------------------------------
//           // Store User Name
//           // ------------------------------------------------

//           sessionStorage.setItem("Name", result.Name);

//           // ------------------------------------------------
//           // IMPORTANT
//           //
//           // Existing backend users are treated
//           // as ADMIN users.
//           // ------------------------------------------------

//           sessionStorage.setItem("UserRole", "ADMIN");

//           console.log("UserRole:", sessionStorage.getItem("UserRole"));

//           // ------------------------------------------------
//           // Success message
//           // ------------------------------------------------

//           toast.success("Log In created successfully");

//           // ------------------------------------------------
//           // Show Date Range screen
//           // ------------------------------------------------

//           setIsLoggedIn(true);
//         } else {
//           // ================================================
//           // LOGIN FAILED
//           // ================================================

//           alert("Login failed! Please check your credentials.");
//         }
//       })

//       .catch((error) => {
//         console.error("Login Error:", error);

//         alert("Something went wrong during login.");
//       });
//   };

//   // ==========================================================
//   // DATE RANGE
//   // ==========================================================

//   const [FromDate, setFromDate] = useState(dayjs());

//   const [ToDate, setToDate] = useState(dayjs());

//   const [years, setYears] = useState([]);

//   const [selectedYearId, setSelectedYearId] = useState("");

//   // ==========================================================
//   // FETCH DATE RANGE
//   // ==========================================================

//   const fetchDateRange = async () => {
//     try {
//       const response = await axios.get(
//         "https://arohanagroapi.microtechsolutions.net.in/php/getyears.php",
//       );

//       setYears(response.data);
//     } catch (error) {
//       console.error("Error fetching years:", error);

//       toast.error("Error fetching Years");
//     }
//   };

//   // ==========================================================
//   // FETCH YEARS ON PAGE LOAD
//   // ==========================================================

//   useEffect(() => {
//     fetchDateRange();
//   }, []);

//   // ==========================================================
//   // YEAR SELECT
//   // ==========================================================

//   const handleSelectChange = (event) => {
//     const selectedId = event.target.value;

//     setSelectedYearId(selectedId);

//     const selectedYear = years.find(
//       (year) => String(year.Id) === String(selectedId),
//     );

//     if (selectedYear) {
//       setFromDate(dayjs(selectedYear.FromDate.date));

//       setToDate(dayjs(selectedYear.ToDate.date));

//       // ------------------------------------------------------
//       // Store selected year
//       // ------------------------------------------------------

//       Cookies.set("SelectedYearId", selectedId, {
//         expires: 7,
//       });
//     }
//   };

//   // ==========================================================
//   // CONTINUE / OK
//   // ==========================================================

//   const handleOkClick = async (e) => {
//     e.preventDefault();

//     try {
//       // ----------------------------------------------------
//       // Date validation
//       // ----------------------------------------------------

//       if (!FromDate || !ToDate) {
//         toast.error("Please select both From and To dates");

//         return;
//       }

//       // ----------------------------------------------------
//       // Year validation
//       // ----------------------------------------------------

//       if (!selectedYearId) {
//         toast.error("Please select a year");

//         return;
//       }

//       // ----------------------------------------------------
//       // Format dates
//       // ----------------------------------------------------

//       const fromDate = FromDate.format("YYYY-MM-DD");

//       const toDate = ToDate.format("YYYY-MM-DD");

//       // ----------------------------------------------------
//       // Find selected year
//       // ----------------------------------------------------

//       const selectedYear = years.find(
//         (year) => String(year.Id) === String(selectedYearId),
//       );

//       if (selectedYear) {
//         // --------------------------------------------------
//         // Store From Date
//         // --------------------------------------------------

//         Cookies.set("FromDate", fromDate, {
//           expires: 7,
//         });

//         // --------------------------------------------------
//         // Store To Date
//         // --------------------------------------------------

//         Cookies.set("ToDate", toDate, {
//           expires: 7,
//         });

//         // --------------------------------------------------
//         // Store Year ID
//         // --------------------------------------------------

//         Cookies.set("YearId", selectedYear.Id, {
//           expires: 7,
//         });

//         // --------------------------------------------------
//         // Store Date Range
//         // --------------------------------------------------

//         Cookies.set("DateRange", selectedYear.DateRange, {
//           expires: 7,
//         });
//       }

//       // ----------------------------------------------------
//       // Success
//       // ----------------------------------------------------

//       toast.success("Year selected successfully!");

//       // ----------------------------------------------------
//       // Go to application
//       // ----------------------------------------------------

//       navigate("/customermaster");
//     } catch (error) {
//       console.error("Error:", error);

//       toast.error("Error saving record! " + error.message);
//     }
//   };

//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (
//     <Box
//       sx={{
//         width: "100vw",

//         height: "100vh",

//         backgroundImage: `url(${BaggroundImg})`,

//         backgroundSize: "cover",

//         backgroundPosition: "center",

//         display: "flex",

//         alignItems: "center",

//         justifyContent: "center",
//       }}
//     >
//       <Box>
//         <Box
//           sx={{
//             display: "flex",

//             width: isSmallScreen ? "90vw" : "950px",

//             height: isSmallScreen ? "auto" : "460px",

//             borderRadius: "20px",

//             overflow: "hidden",

//             boxShadow: "0 4px 10px rgba(32, 30, 29, 0.22)",

//             background: "rgba(255, 255, 255, 0.17)",

//             flexDirection: isSmallScreen ? "column" : "row",
//           }}
//         >
//           {/* ==================================================
//               LEFT SIDE
//           ================================================== */}

//           <Box
//             sx={{
//               width: "100%",

//               justifyContent: "center",

//               alignContent: "center",

//               alignItems: "center",

//               display: isSmallScreen ? "none" : "auto",
//             }}
//           >
//             <Box className="login-logo">
//               <img
//                 src={logo}
//                 alt="Amrut Dairy Logo"
//                 style={{
//                   height: "460px",
//                   width: "100%",
//                 }}
//               />
//             </Box>
//           </Box>

//           {/* ==================================================
//               RIGHT SIDE
//           ================================================== */}

//           <Box
//             sx={{
//               width: isSmallScreen ? "100%" : "100%",

//               padding: "40px",

//               display: "flex",

//               flexDirection: "column",

//               alignItems: "center",
//             }}
//           >
//             {/* =================================================
//                 DATE RANGE SCREEN
//             ================================================= */}

//             {isLoggedIn ? (
//               <>
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontWeight: "bold",

//                     color: "#3A3B3C",

//                     marginBottom: 7,
//                   }}
//                 >
//                   Select Date Range
//                 </Typography>

//                 <TextField
//                   select
//                   fullWidth
//                   variant="outlined"
//                   value={selectedYearId}
//                   onChange={handleSelectChange}
//                   SelectProps={{
//                     MenuProps: {
//                       PaperProps: {
//                         sx: {
//                           maxHeight: 200,
//                         },
//                       },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       borderRadius: "30px",

//                       background:
//                         "linear-gradient(90deg, rgba(173,216,230,0.5), rgba(216,191,216,0.5))",

//                       backdropFilter: "blur(10px)",

//                       WebkitBackdropFilter: "blur(10px)",

//                       paddingLeft: 2,

//                       color: "#000",

//                       "& .MuiSelect-select": {
//                         paddingY: "12px",
//                       },

//                       "& .MuiOutlinedInput-notchedOutline": {
//                         border: "none",
//                       },
//                     },
//                   }}
//                   InputLabelProps={{
//                     sx: {
//                       color: "#666",
//                     },
//                   }}
//                 >

//                  {years
//   .filter((year) => {
//     const range = year.DateRange || "";

//     return (
//       range.includes("01-04-2025") ||
//       range.includes("01-04-2026")
//     );
//   })
//   .map((year) => (
//     <MenuItem key={year.Id} value={year.Id}>
//       {year.DateRange}
//     </MenuItem>
//   ))}
//                 </TextField>

//                 <Button
//                   sx={{
//                     mt: 6,

//                     fontSize: "16px",

//                     width: "90%",

//                     background: "#074e2c",

//                     borderRadius: "20px",

//                     "&:hover": {
//                       backgroundColor: "#08A04B",
//                     },
//                   }}
//                   fullWidth
//                   onClick={handleOkClick}
//                   variant="contained"
//                   disabled={!FromDate || !ToDate || !selectedYearId}
//                 >
//                   Continue
//                 </Button>
//               </>
//             ) : (
//               /* =================================================
//                  LOGIN SCREEN
//               ================================================= */

//               <>
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontWeight: "bold",

//                     color: "#3A3B3C",

//                     marginBottom: 7,
//                   }}
//                 >
//                   Welcome ..
//                 </Typography>

//                 {/* =================================================
//                     USERNAME
//                 ================================================= */}

//                 <TextField
//                   variant="standard"
//                   value={userName}
//                   onChange={(e) => setUsername(e.target.value)}
//                   InputProps={{
//                     disableUnderline: true,
//                   }}
//                   placeholder="Username"
//                   sx={{
//                     display: "flex",

//                     height: "3.5vh",

//                     width: "90%",

//                     justifyContent: "center",

//                     marginBottom: 3,

//                     background: "rgba(255, 255, 255, 0.3)",

//                     borderRadius: "20px",

//                     p: 1,

//                     paddingLeft: 3,
//                   }}
//                 />

//                 {/* =================================================
//                     PASSWORD
//                 ================================================= */}

//                 <TextField
//                   variant="standard"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   InputProps={{
//                     disableUnderline: true,

//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label={
//                             showPassword ? "hide password" : "show password"
//                           }
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                           sx={{
//                             right: 20,
//                           }}
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                   placeholder="Password"
//                   sx={{
//                     display: "flex",

//                     height: "3.5vh",

//                     width: "90%",

//                     justifyContent: "center",

//                     marginBottom: 2,

//                     background: "rgba(255, 255, 255, 0.3)",

//                     borderRadius: "20px",

//                     p: 1,

//                     paddingLeft: 3,
//                   }}
//                 />

//                 {/* =================================================
//                     LOGIN BUTTON
//                 ================================================= */}

//                 <Button
//                   sx={{
//                     mt: 6,

//                     fontSize: "16px",

//                     width: "90%",

//                     background: "#074e2c",

//                     borderRadius: "20px",

//                     "&:hover": {
//                       backgroundColor: "#08A04B",
//                     },
//                   }}
//                   fullWidth
//                   onClick={Login}
//                   variant="contained"
//                 >
//                   Login
//                 </Button>
//               </>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Login;





























































// import React from "react";

// import {
//   Box,
//   MenuItem,
//   Typography,
//   TextField,
//   Button,
//   useMediaQuery,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";

// import { useNavigate } from "react-router-dom";

// import BaggroundImg from "../imgs/bg7.2.jpg";
// import logo from "../imgs/amrutlogo.png";

// import { useState, useEffect } from "react";

// import { toast } from "react-toastify";

// import {
//   Visibility,
//   VisibilityOff,
// } from "@mui/icons-material";

// import dayjs from "dayjs";

// import Cookies from "js-cookie";

// import axios from "axios";


// const Login = () => {

//   const navigate = useNavigate();

//   const isSmallScreen =
//     useMediaQuery("(max-width:600px)");


//   // ==========================================================
//   // LOGIN STATES
//   // ==========================================================

//   const [userName, setUsername] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [isLoggedIn, setIsLoggedIn] =
//     useState(false);


//   // ==========================================================
//   // PASSWORD VISIBILITY
//   // ==========================================================

//   const handleClickShowPassword = () => {
//     setShowPassword((prev) => !prev);
//   };


//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };


//   // ==========================================================
//   // LOGIN
//   // ==========================================================

//   const Login = () => {

//     // ========================================================
//     // BASIC VALIDATION
//     // ========================================================

//     if (!userName || !password) {

//       alert(
//         "Please enter username and password."
//       );

//       return;
//     }


//     // ========================================================
//     // SALE USER
//     //
//     // Username: Sale
//     // Password: sale123456
//     // Role: SALE
//     // ========================================================

//     if (
//       userName.trim().toLowerCase() === "sale" &&
//       password === "sale123456"
//     ) {

//       // Clear previous session

//       sessionStorage.removeItem(
//         "UserRole"
//       );

//       sessionStorage.removeItem(
//         "UserId"
//       );

//       sessionStorage.removeItem(
//         "Name"
//       );


//       // User ID

//       sessionStorage.setItem(
//         "UserId",
//         "SALE"
//       );


//       // User Name

//       sessionStorage.setItem(
//         "Name",
//         "Sale User"
//       );


//       // Role

//       sessionStorage.setItem(
//         "UserRole",
//         "SALE"
//       );


//       // Login status

//       sessionStorage.setItem(
//         "isLoggedIn",
//         "true"
//       );


//       console.log(
//         "SALE LOGIN SUCCESS"
//       );

//       console.log(
//         "UserId:",
//         sessionStorage.getItem(
//           "UserId"
//         )
//       );

//       console.log(
//         "Name:",
//         sessionStorage.getItem(
//           "Name"
//         )
//       );

//       console.log(
//         "UserRole:",
//         sessionStorage.getItem(
//           "UserRole"
//         )
//       );


//       toast.success(
//         "Sale User Login Successful"
//       );


//       setIsLoggedIn(true);

//       return;
//     }


//     // ========================================================
//     // SALE2 USER
//     //
//     // Username: Sales2
//     // Password: Sale@123
//     // Role: SALE2
//     // ========================================================

//     if (
//       userName.trim().toLowerCase() === "sales2" &&
//       password === "Sale@123"
//     ) {

//       // Clear previous session

//       sessionStorage.removeItem(
//         "UserRole"
//       );

//       sessionStorage.removeItem(
//         "UserId"
//       );

//       sessionStorage.removeItem(
//         "Name"
//       );


//       // User ID

//       sessionStorage.setItem(
//         "UserId",
//         "SALES2"
//       );


//       // User Name

//       sessionStorage.setItem(
//         "Name",
//         "Sales2"
//       );


//       // Role

//       sessionStorage.setItem(
//         "UserRole",
//         "SALE2"
//       );


//       // Login status

//       sessionStorage.setItem(
//         "isLoggedIn",
//         "true"
//       );


//       console.log(
//         "================================="
//       );

//       console.log(
//         "SALE2 LOGIN SUCCESS"
//       );

//       console.log(
//         "UserId:",
//         sessionStorage.getItem(
//           "UserId"
//         )
//       );

//       console.log(
//         "Name:",
//         sessionStorage.getItem(
//           "Name"
//         )
//       );

//       console.log(
//         "UserRole:",
//         sessionStorage.getItem(
//           "UserRole"
//         )
//       );

//       console.log(
//         "================================="
//       );


//       toast.success(
//         "Sales2 User Login Successful"
//       );


//       setIsLoggedIn(true);

//       return;
//     }


//     // ========================================================
//     // EXISTING BACKEND LOGIN
//     // ========================================================

//     const myHeaders =
//       new Headers();


//     myHeaders.append(
//       "Content-Type",
//       "application/x-www-form-urlencoded"
//     );


//     const urlencoded =
//       new URLSearchParams();


//     urlencoded.append(
//       "UserId",
//       userName
//     );


//     urlencoded.append(
//       "Password",
//       password
//     );


//     const requestOptions = {

//       method: "POST",

//       headers: myHeaders,

//       body: urlencoded,

//       redirect: "follow",

//     };


//     fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/Usernameget.php",
//       requestOptions
//     )

//       .then(
//         (response) =>
//           response.json()
//       )

//       .then(
//         (result) => {

//           console.log(
//             "Login API Result:",
//             result
//           );


//           if (
//             result?.message ===
//             "Login successful"
//           ) {

//             sessionStorage.removeItem(
//               "UserRole"
//             );


//             sessionStorage.setItem(
//               "UserId",
//               result.Id
//             );


//             sessionStorage.setItem(
//               "Name",
//               result.Name
//             );


//             sessionStorage.setItem(
//               "UserRole",
//               "ADMIN"
//             );


//             sessionStorage.setItem(
//               "isLoggedIn",
//               "true"
//             );


//             console.log(
//               "UserRole:",
//               sessionStorage.getItem(
//                 "UserRole"
//               )
//             );


//             toast.success(
//               "Log In created successfully"
//             );


//             setIsLoggedIn(true);

//           } else {

//             alert(
//               "Login failed! Please check your credentials."
//             );

//           }

//         }
//       )

//       .catch(
//         (error) => {

//           console.error(
//             "Login Error:",
//             error
//           );

//           alert(
//             "Something went wrong during login."
//           );

//         }
//       );
//   };


//   // ==========================================================
//   // DATE RANGE
//   // ==========================================================

//   const [FromDate, setFromDate] =
//     useState(dayjs());

//   const [ToDate, setToDate] =
//     useState(dayjs());

//   const [years, setYears] =
//     useState([]);

//   const [selectedYearId, setSelectedYearId] =
//     useState("");


//   // ==========================================================
//   // FETCH DATE RANGE
//   // ==========================================================

//   const fetchDateRange =
//     async () => {

//       try {

//         const response =
//           await axios.get(
//             "https://amrutdairyapi.microtechsolutions.net.in/php/getyears.php"
//           );


//         setYears(
//           response.data
//         );

//       } catch (error) {

//         console.error(
//           "Error fetching years:",
//           error
//         );

//         toast.error(
//           "Error fetching Years"
//         );

//       }

//     };


//   // ==========================================================
//   // FETCH YEARS
//   // ==========================================================

//   useEffect(() => {

//     fetchDateRange();

//   }, []);


//   // ==========================================================
//   // YEAR SELECT
//   // ==========================================================

//   const handleSelectChange =
//     (event) => {

//       const selectedId =
//         event.target.value;


//       setSelectedYearId(
//         selectedId
//       );


//       const selectedYear =
//         years.find(
//           (year) =>
//             String(year.Id) ===
//             String(selectedId)
//         );


//       if (selectedYear) {

//         setFromDate(
//           dayjs(
//             selectedYear
//               .FromDate
//               .date
//           )
//         );


//         setToDate(
//           dayjs(
//             selectedYear
//               .ToDate
//               .date
//           )
//         );


//         Cookies.set(
//           "SelectedYearId",
//           selectedId,
//           {
//             expires: 7,
//           }
//         );

//       }

//     };


//   // ==========================================================
//   // CONTINUE
//   // ==========================================================

//   const handleOkClick =
//     async (e) => {

//       e.preventDefault();


//       try {

//         // ----------------------------------------------------
//         // DATE VALIDATION
//         // ----------------------------------------------------

//         if (
//           !FromDate ||
//           !ToDate
//         ) {

//           toast.error(
//             "Please select both From and To dates"
//           );

//           return;
//         }


//         // ----------------------------------------------------
//         // YEAR VALIDATION
//         // ----------------------------------------------------

//         if (!selectedYearId) {

//           toast.error(
//             "Please select a year"
//           );

//           return;
//         }


//         // ----------------------------------------------------
//         // FORMAT DATE
//         // ----------------------------------------------------

//         const fromDate =
//           FromDate.format(
//             "YYYY-MM-DD"
//           );


//         const toDate =
//           ToDate.format(
//             "YYYY-MM-DD"
//           );


//         // ----------------------------------------------------
//         // SELECTED YEAR
//         // ----------------------------------------------------

//         const selectedYear =
//           years.find(
//             (year) =>
//               String(year.Id) ===
//               String(selectedYearId)
//           );


//         if (selectedYear) {

//           Cookies.set(
//             "FromDate",
//             fromDate,
//             {
//               expires: 7,
//             }
//           );


//           Cookies.set(
//             "ToDate",
//             toDate,
//             {
//               expires: 7,
//             }
//           );


//           Cookies.set(
//             "YearId",
//             selectedYear.Id,
//             {
//               expires: 7,
//             }
//           );


//           Cookies.set(
//             "DateRange",
//             selectedYear.DateRange,
//             {
//               expires: 7,
//             }
//           );

//         }


//         toast.success(
//           "Year selected successfully!"
//         );


//         // ====================================================
//         // ROLE BASED NAVIGATION
//         // ====================================================

//         const currentRole =
//           sessionStorage.getItem(
//             "UserRole"
//           );


//         // ----------------------------------------------------
//         // SALE USER
//         // ----------------------------------------------------

//         if (
//           currentRole === "SALE"
//         ) {

//           navigate(
//             "/salesentry"
//           );

//           return;
//         }


//         // ----------------------------------------------------
//         // SALE2 USER
//         // ----------------------------------------------------

//         if (
//           currentRole === "SALE2"
//         ) {

//           navigate(
//             "/salesentry"
//           );

//           return;
//         }


//         // ----------------------------------------------------
//         // OTHER USERS
//         // ----------------------------------------------------

//         navigate(
//           "/customermaster"
//         );


//       } catch (error) {

//         console.error(
//           "Error:",
//           error
//         );


//         toast.error(
//           "Error saving record! " +
//           error.message
//         );

//       }

//     };


//   // ==========================================================
//   // UI
//   // ==========================================================

//   return (

//     <Box
//       sx={{
//         width: "100vw",

//         height: "100vh",

//         backgroundImage:
//           `url(${BaggroundImg})`,

//         backgroundSize:
//           "cover",

//         backgroundPosition:
//           "center",

//         display: "flex",

//         alignItems:
//           "center",

//         justifyContent:
//           "center",
//       }}
//     >

//       <Box>

//         <Box
//           sx={{
//             display: "flex",

//             width:
//               isSmallScreen
//                 ? "90vw"
//                 : "950px",

//             height:
//               isSmallScreen
//                 ? "auto"
//                 : "460px",

//             borderRadius:
//               "20px",

//             overflow:
//               "hidden",

//             boxShadow:
//               "0 4px 10px rgba(32, 30, 29, 0.22)",

//             background:
//               "rgba(255, 255, 255, 0.17)",

//             flexDirection:
//               isSmallScreen
//                 ? "column"
//                 : "row",
//           }}
//         >

//           {/* ==================================================
//               LEFT SIDE
//           ================================================== */}

//           <Box
//             sx={{
//               width:
//                 "100%",

//               justifyContent:
//                 "center",

//               alignContent:
//                 "center",

//               alignItems:
//                 "center",

//               display:
//                 isSmallScreen
//                   ? "none"
//                   : "auto",
//             }}
//           >

//             <Box
//               className="login-logo"
//             >

//               <img
//                 src={logo}
//                 alt="Amrut Dairy Logo"
//                 style={{
//                   height:
//                     "460px",

//                   width:
//                     "100%",
//                 }}
//               />

//             </Box>

//           </Box>


//           {/* ==================================================
//               RIGHT SIDE
//           ================================================== */}

//           <Box
//             sx={{
//               width:
//                 "100%",

//               padding:
//                 "40px",

//               display:
//                 "flex",

//               flexDirection:
//                 "column",

//               alignItems:
//                 "center",
//             }}
//           >

//             {/* =================================================
//                 DATE RANGE SCREEN
//             ================================================= */}

//             {isLoggedIn ? (

//               <>

//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontWeight:
//                       "bold",

//                     color:
//                       "#3A3B3C",

//                     marginBottom:
//                       7,
//                   }}
//                 >
//                   Select Date Range
//                 </Typography>


//                 <TextField
//                   select

//                   fullWidth

//                   variant="outlined"

//                   value={
//                     selectedYearId
//                   }

//                   onChange={
//                     handleSelectChange
//                   }

//                   SelectProps={{
//                     MenuProps: {
//                       PaperProps: {
//                         sx: {
//                           maxHeight:
//                             200,
//                         },
//                       },
//                     },
//                   }}

//                   InputProps={{
//                     sx: {

//                       borderRadius:
//                         "30px",

//                       background:
//                         "linear-gradient(90deg, rgba(173,216,230,0.5), rgba(216,191,216,0.5))",

//                       backdropFilter:
//                         "blur(10px)",

//                       WebkitBackdropFilter:
//                         "blur(10px)",

//                       paddingLeft:
//                         2,

//                       color:
//                         "#000",

//                       "& .MuiSelect-select": {
//                         paddingY:
//                           "12px",
//                       },

//                       "& .MuiOutlinedInput-notchedOutline": {
//                         border:
//                           "none",
//                       },

//                     },
//                   }}

//                   InputLabelProps={{
//                     sx: {
//                       color:
//                         "#666",
//                     },
//                   }}
//                 >

//                   {years
//                     .filter(
//                       (year) => {

//                         const range =
//                           year.DateRange ||
//                           "";

//                         return (
//                           range.includes(
//                             "01-04-2025"
//                           ) ||
//                           range.includes(
//                             "01-04-2026"
//                           )
//                         );

//                       }
//                     )

//                     .map(
//                       (year) => (

//                         <MenuItem
//                           key={
//                             year.Id
//                           }

//                           value={
//                             year.Id
//                           }
//                         >

//                           {
//                             year.DateRange
//                           }

//                         </MenuItem>

//                       )
//                     )}

//                 </TextField>


//                 <Button
//                   sx={{

//                     mt: 6,

//                     fontSize:
//                       "16px",

//                     width:
//                       "90%",

//                     background:
//                       "#074e2c",

//                     borderRadius:
//                       "20px",

//                     "&:hover": {
//                       backgroundColor:
//                         "#08A04B",
//                     },

//                   }}

//                   fullWidth

//                   onClick={
//                     handleOkClick
//                   }

//                   variant="contained"

//                   disabled={
//                     !FromDate ||
//                     !ToDate ||
//                     !selectedYearId
//                   }
//                 >

//                   Continue

//                 </Button>

//               </>

//             ) : (

//               /* =================================================
//                  LOGIN SCREEN
//               ================================================= */

//               <>

//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontWeight:
//                       "bold",

//                     color:
//                       "#3A3B3C",

//                     marginBottom:
//                       7,
//                   }}
//                 >

//                   Welcome ..

//                 </Typography>


//                 {/* =================================================
//                     USERNAME
//                 ================================================= */}

//                 <TextField
//                   variant="standard"

//                   value={
//                     userName
//                   }

//                   onChange={
//                     (e) =>
//                       setUsername(
//                         e.target.value
//                       )
//                   }

//                   InputProps={{
//                     disableUnderline:
//                       true,
//                   }}

//                   placeholder="Username"

//                   sx={{

//                     display:
//                       "flex",

//                     height:
//                       "3.5vh",

//                     width:
//                       "90%",

//                     justifyContent:
//                       "center",

//                     marginBottom:
//                       3,

//                     background:
//                       "rgba(255, 255, 255, 0.3)",

//                     borderRadius:
//                       "20px",

//                     p: 1,

//                     paddingLeft:
//                       3,

//                   }}

//                 />


//                 {/* =================================================
//                     PASSWORD
//                 ================================================= */}

//                 <TextField
//                   variant="standard"

//                   type={
//                     showPassword
//                       ? "text"
//                       : "password"
//                   }

//                   value={
//                     password
//                   }

//                   onChange={
//                     (e) =>
//                       setPassword(
//                         e.target.value
//                       )
//                   }

//                   InputProps={{

//                     disableUnderline:
//                       true,

//                     endAdornment: (

//                       <InputAdornment
//                         position="end"
//                       >

//                         <IconButton

//                           aria-label={
//                             showPassword
//                               ? "hide password"
//                               : "show password"
//                           }

//                           onClick={
//                             handleClickShowPassword
//                           }

//                           onMouseDown={
//                             handleMouseDownPassword
//                           }

//                           edge="end"

//                           sx={{
//                             right:
//                               20,
//                           }}
//                         >

//                           {
//                             showPassword
//                               ? <VisibilityOff />
//                               : <Visibility />
//                           }

//                         </IconButton>

//                       </InputAdornment>

//                     ),

//                   }}

//                   placeholder="Password"

//                   sx={{

//                     display:
//                       "flex",

//                     height:
//                       "3.5vh",

//                     width:
//                       "90%",

//                     justifyContent:
//                       "center",

//                     marginBottom:
//                       2,

//                     background:
//                       "rgba(255, 255, 255, 0.3)",

//                     borderRadius:
//                       "20px",

//                     p: 1,

//                     paddingLeft:
//                       3,

//                   }}

//                 />


//                 {/* =================================================
//                     LOGIN BUTTON
//                 ================================================= */}

//                 <Button

//                   sx={{

//                     mt: 6,

//                     fontSize:
//                       "16px",

//                     width:
//                       "90%",

//                     background:
//                       "#074e2c",

//                     borderRadius:
//                       "20px",

//                     "&:hover": {
//                       backgroundColor:
//                         "#08A04B",
//                     },

//                   }}

//                   fullWidth

//                   onClick={
//                     Login
//                   }

//                   variant="contained"
//                 >

//                   Login

//                 </Button>

//               </>

//             )}

//           </Box>

//         </Box>

//       </Box>

//     </Box>

//   );

// };


// export default Login;












































import {
  Box,
  MenuItem,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import BaggroundImg from "../imgs/bg7.2.jpg";
import logo from "../imgs/amrutlogo.png";

import { useState, useEffect } from "react";

import { toast } from "react-toastify";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import dayjs from "dayjs";

import Cookies from "js-cookie";

import axios from "axios";


const Login = () => {

  const navigate = useNavigate();

  const isSmallScreen =
    useMediaQuery("(max-width:600px)");


  // ==========================================================
  // LOGIN STATES
  // ==========================================================

  const [userName, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);


  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  const handleClickShowPassword = () => {
    setShowPassword(
      (prev) => !prev
    );
  };


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  // ==========================================================
  // LOGIN
  // ==========================================================

  const Login = async () => {

    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    const enteredUserName =
      String(userName || "").trim();

    const enteredPassword =
      String(password || "");

    if (!enteredUserName) {
      toast.error(
        "Please enter username."
      );
      return;
    }

    if (!enteredPassword) {
      toast.error(
        "Please enter password."
      );
      return;
    }


    try {

      // ======================================================
      // BACKEND LOGIN API
      // ======================================================

      const myHeaders =
        new Headers();

      myHeaders.append(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );


      // ======================================================
      // REQUEST DATA
      // ======================================================

      const urlencoded =
        new URLSearchParams();

      urlencoded.append(
        "UserId",
        enteredUserName
      );

      urlencoded.append(
        "Password",
        enteredPassword
      );


      // ======================================================
      // REQUEST OPTIONS
      // ======================================================

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };


      // ======================================================
      // LOGIN API
      // ======================================================

      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/Usernameget.php",
        requestOptions
      );




      
// const response = await fetch(
//   "https://amrutdairyapi.microtechsolutions.net.in/php/Usernameget.php",
//   {
//     ...requestOptions,
//     credentials: "include",
//   }
// );


      // ======================================================
      // CHECK RESPONSE
      // ======================================================

      if (!response.ok) {
        throw new Error(
          `Login API failed with status ${response.status}`
        );
      }


      const result =
        await response.json();


      console.log(
        "================================="
      );

      console.log(
        "LOGIN API RESULT:",
        result
      );

      console.log(
        "================================="
      );


      // ======================================================
      // LOGIN SUCCESS
      // ======================================================

      if (
        result?.message ===
        "Login successful"
      ) {


        // ====================================================
        // CLEAR OLD SESSION
        // ====================================================

        sessionStorage.removeItem(
          "UserId"
        );

        sessionStorage.removeItem(
          "LoginUserId"
        );

        sessionStorage.removeItem(
          "Name"
        );

        sessionStorage.removeItem(
          "UserRole"
        );

        sessionStorage.removeItem(
          "Device"
        );

        sessionStorage.removeItem(
          "CreatedBy"
        );

        sessionStorage.removeItem(
          "isLoggedIn"
        );


        // ====================================================
        // DATABASE USER ID
        //
        // IMPORTANT:
        // This is actual database Id.
        //
        // Example:
        // Sale  -> Id 6
        // Sale2 -> Id 7
        // Admin -> Id 8
        // ====================================================

        sessionStorage.setItem(
          "UserId",
          String(
            result.Id ?? ""
          )
        );


        // ====================================================
        // LOGIN USER ID
        //
        // Example:
        //
        // admin -> ADMIN
        // Sale  -> SALE
        // Sale2 -> SALE2
        //
        // We are NOT using result.Id for mapping.
        // ====================================================

        const loginUserId =
          String(
            result.UserId ??
            enteredUserName
          )
            .trim()
            .toUpperCase();


        sessionStorage.setItem(
          "LoginUserId",
          loginUserId
        );


        // ====================================================
        // USER NAME
        // ====================================================

        sessionStorage.setItem(
          "Name",
          String(
            result.Name ?? ""
          )
        );


        // ====================================================
        // ROLE
        // CREATED BY
        // DEVICE
        // ====================================================

        let userRole = "";

        let createdBy = "";

        let device = "";


        // ====================================================
        // ADMIN
        // ====================================================

        if (
          loginUserId ===
          "ADMIN"
        ) {

          userRole =
            "ADMIN";

          // Admin -> CreatedBy = 1
          createdBy =
            "1";

          
          device =
            "";

        }


        // ====================================================
        // SALE
        // ====================================================

        else if (
          loginUserId ===
          "SALE"
        ) {

          userRole =
            "SALE";

          // Sale -> CreatedBy = 2
          createdBy =
            "2";

          // Sale -> Device1
          device =
            "Device1";

        }


        // ====================================================
        // SALE2
        // ====================================================

        else if (
          loginUserId ===
          "SALE2"
        ) {

          userRole =
            "SALE2";

          // Sale2 -> CreatedBy = 3
          createdBy =
            "3";

          // Sale2 -> Device2
          device =
            "Device2";

        }


        // ====================================================
        // OTHER USER
        // ====================================================

        else {

          userRole =
            String(
              result.SaleRole ??
              ""
            )
              .trim()
              .toUpperCase();

          createdBy =
            "";

          device =
            "";
        }


        // ====================================================
        // SAVE USER ROLE
        // ====================================================

        sessionStorage.setItem(
          "UserRole",
          userRole
        );


        // ====================================================
        // SAVE CREATED BY
        // ====================================================

        sessionStorage.setItem(
          "CreatedBy",
          createdBy
        );


        // ====================================================
        // SAVE DEVICE
        // ====================================================

        sessionStorage.setItem(
          "Device",
          device
        );


        // ====================================================
        // LOGIN STATUS
        // ====================================================

        sessionStorage.setItem(
          "isLoggedIn",
          "true"
        );


        // ====================================================
        // DEBUG LOG
        // ====================================================

        console.log(
          "================================="
        );

        console.log(
          "LOGIN SUCCESS"
        );

        console.log(
          "Database UserId:",
          sessionStorage.getItem(
            "UserId"
          )
        );

        console.log(
          "LoginUserId:",
          sessionStorage.getItem(
            "LoginUserId"
          )
        );

        console.log(
          "Name:",
          sessionStorage.getItem(
            "Name"
          )
        );

        console.log(
          "UserRole:",
          sessionStorage.getItem(
            "UserRole"
          )
        );

        console.log(
          "CreatedBy:",
          sessionStorage.getItem(
            "CreatedBy"
          )
        );

        console.log(
          "Device:",
          sessionStorage.getItem(
            "Device"
          )
        );

        console.log(
          "================================="
        );


        // ====================================================
        // SUCCESS MESSAGE
        // ====================================================

        toast.success(
          "Log In created successfully"
        );


        // ====================================================
        // SHOW DATE RANGE SCREEN
        // ====================================================

        setIsLoggedIn(
          true
        );

      } else {

        // ====================================================
        // LOGIN FAILED
        // ====================================================

        toast.error(
          result?.error ||
          "Login failed! Please check your credentials."
        );

      }

    } catch (error) {

      // ======================================================
      // API ERROR
      // ======================================================

      console.error(
        "Login Error:",
        error
      );

      toast.error(
        "Something went wrong during login."
      );
    }
  };


  // ==========================================================
  // DATE RANGE STATES
  // ==========================================================

  const [
    FromDate,
    setFromDate
  ] = useState(
    dayjs()
  );


  const [
    ToDate,
    setToDate
  ] = useState(
    dayjs()
  );


  const [
    years,
    setYears
  ] = useState([]);


  const [
    selectedYearId,
    setSelectedYearId
  ] = useState("");


  // ==========================================================
  // FETCH DATE RANGE
  // ==========================================================

  const fetchDateRange =
    async () => {

      try {

        const response =
          await axios.get(
            "https://amrutdairyapi.microtechsolutions.net.in/php/getyears.php"
          );


        console.log(
          "GET YEARS STATUS:",
          response.status
        );


        console.log(
          "GET YEARS RESPONSE:",
          response.data
        );


        /*
         * Backend response can be:
         *
         * [
         *   {
         *      Id: 1,
         *      DateRange: "...",
         *      FromDate: "...",
         *      ToDate: "..."
         *   }
         * ]
         *
         * OR
         *
         * {
         *   data: [...]
         * }
         */


        setYears(
          Array.isArray(
            response.data
          )
            ? response.data
            : response.data?.data ||
              []
        );

      } catch (error) {

        console.error(
          "Error fetching years:",
          error
        );

        toast.error(
          "Error fetching Years"
        );
      }
    };


  // ==========================================================
  // FETCH YEARS
  // ==========================================================

  useEffect(() => {

    fetchDateRange();

  }, []);


  // ==========================================================
  // YEAR SELECT
  // ==========================================================

  const handleSelectChange =
    (event) => {

      const selectedId =
        String(
          event.target.value
        );


      setSelectedYearId(
        selectedId
      );


      console.log(
        "SELECTED YEAR ID:",
        selectedId
      );


      const selectedYear =
        years.find(
          (year) =>
            String(year.Id) ===
            String(selectedId)
        );


      console.log(
        "SELECTED YEAR:",
        selectedYear
      );


      if (selectedYear) {

        setFromDate(
          dayjs(
            selectedYear
              .FromDate?.date ||
            selectedYear.FromDate
          )
        );


        setToDate(
          dayjs(
            selectedYear
              .ToDate?.date ||
            selectedYear.ToDate
          )
        );


        Cookies.set(
          "SelectedYearId",
          selectedId,
          {
            expires: 7,
          }
        );
      }
    };


  // ==========================================================
  // CONTINUE
  // ==========================================================

  const handleOkClick =
    async (e) => {

      e.preventDefault();


      try {

        // ====================================================
        // DATE VALIDATION
        // ====================================================

        if (
          !FromDate ||
          !ToDate
        ) {

          toast.error(
            "Please select both From and To dates"
          );

          return;
        }


        // ====================================================
        // YEAR VALIDATION
        // ====================================================

        if (!selectedYearId) {

          toast.error(
            "Please select a year"
          );

          return;
        }


        // ====================================================
        // FORMAT DATE
        // ====================================================

        const fromDate =
          FromDate.format(
            "YYYY-MM-DD"
          );


        const toDate =
          ToDate.format(
            "YYYY-MM-DD"
          );


        // ====================================================
        // SELECTED YEAR
        // ====================================================

        const selectedYear =
          years.find(
            (year) =>
              String(year.Id) ===
              String(selectedYearId)
          );


        if (selectedYear) {

          Cookies.set(
            "FromDate",
            fromDate,
            {
              expires: 7,
            }
          );


          Cookies.set(
            "ToDate",
            toDate,
            {
              expires: 7,
            }
          );


          Cookies.set(
            "YearId",
            selectedYear.Id,
            {
              expires: 7,
            }
          );


          Cookies.set(
            "DateRange",
            selectedYear.DateRange,
            {
              expires: 7,
            }
          );
        }


        // ====================================================
        // SUCCESS
        // ====================================================

        toast.success(
          "Year selected successfully!"
        );


        // ====================================================
        // ROLE BASED NAVIGATION
        // ====================================================

        const currentRole =
          sessionStorage.getItem(
            "UserRole"
          );


        console.log(
          "CURRENT ROLE:",
          currentRole
        );


        // ====================================================
        // SALE USER
        // ====================================================

        if (
          currentRole ===
          "SALE"
        ) {

          navigate(
            "/salesentry"
          );

          return;
        }


        // ====================================================
        // SALE2 USER
        // ====================================================

        if (
          currentRole ===
          "SALE2"
        ) {

          navigate(
            "/salesentry"
          );

          return;
        }


        // ====================================================
        // OTHER USERS
        // ====================================================

        navigate(
          "/customermaster"
        );


      } catch (error) {

        console.error(
          "Error:",
          error
        );


        toast.error(
          "Error saving record! " +
          error.message
        );
      }
    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <Box
      sx={{
        width: "100vw",

        height: "100vh",

        backgroundImage:
          `url(${BaggroundImg})`,

        backgroundSize:
          "cover",

        backgroundPosition:
          "center",

        display: "flex",

        alignItems:
          "center",

        justifyContent:
          "center",
      }}
    >

      <Box>

        <Box
          sx={{
            display: "flex",

            width:
              isSmallScreen
                ? "90vw"
                : "950px",

            height:
              isSmallScreen
                ? "auto"
                : "460px",

            borderRadius:
              "20px",

            overflow:
              "hidden",

            boxShadow:
              "0 4px 10px rgba(32, 30, 29, 0.22)",

            background:
              "rgba(255, 255, 255, 0.17)",

            flexDirection:
              isSmallScreen
                ? "column"
                : "row",
          }}
        >


          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <Box
            sx={{
              width:
                "100%",

              justifyContent:
                "center",

              alignContent:
                "center",

              alignItems:
                "center",

              display:
                isSmallScreen
                  ? "none"
                  : "auto",
            }}
          >

            <Box
              className="login-logo"
            >

              <img
                src={logo}
                alt="Amrut Dairy Logo"
                style={{
                  height:
                    "460px",

                  width:
                    "100%",
                }}
              />

            </Box>

          </Box>


          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <Box
            sx={{
              width:
                "100%",

              padding:
                "40px",

              display:
                "flex",

              flexDirection:
                "column",

              alignItems:
                "center",
            }}
          >


            {/* =================================================
                DATE RANGE SCREEN
            ================================================= */}

            {isLoggedIn ? (

              <>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight:
                      "bold",

                    color:
                      "#3A3B3C",

                    marginBottom:
                      7,
                  }}
                >
                  Select Date Range
                </Typography>


                <TextField
                  select

                  fullWidth

                  variant="outlined"

                  value={
                    selectedYearId
                  }

                  onChange={
                    handleSelectChange
                  }

                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight:
                            200,
                        },
                      },
                    },
                  }}

                  InputProps={{
                    sx: {

                      borderRadius:
                        "30px",

                      background:
                        "linear-gradient(90deg, rgba(173,216,230,0.5), rgba(216,191,216,0.5))",

                      backdropFilter:
                        "blur(10px)",

                      WebkitBackdropFilter:
                        "blur(10px)",

                      paddingLeft:
                        2,

                      color:
                        "#000",

                      "& .MuiSelect-select": {
                        paddingY:
                          "12px",
                      },

                      "& .MuiOutlinedInput-notchedOutline": {
                        border:
                          "none",
                      },

                    },
                  }}

                  InputLabelProps={{
                    sx: {
                      color:
                        "#666",
                    },
                  }}
                >

                  {/* =================================================
                      SHOW ALL DATE RANGES
                  ================================================= */}

                  {years.map(
                    (year) => (

                      <MenuItem
                        key={
                          year.Id
                        }

                        value={
                          String(
                            year.Id
                          )
                        }
                      >

                        {
                          year.DateRange
                        }

                      </MenuItem>
                    )
                  )}

                </TextField>


                <Button
                  sx={{

                    mt: 6,

                    fontSize:
                      "16px",

                    width:
                      "90%",

                    background:
                      "#074e2c",

                    borderRadius:
                      "20px",

                    "&:hover": {
                      backgroundColor:
                        "#08A04B",
                    },

                  }}

                  fullWidth

                  onClick={
                    handleOkClick
                  }

                  variant="contained"

                  disabled={
                    !FromDate ||
                    !ToDate ||
                    !selectedYearId
                  }
                >
                  Continue
                </Button>

              </>

            ) : (

              /* =================================================
                 LOGIN SCREEN
              ================================================= */

              <>

                <Typography
                  variant="h4"
                  sx={{

                    fontWeight:
                      "bold",

                    color:
                      "#3A3B3C",

                    marginBottom:
                      7,

                  }}
                >
                  Welcome ..
                </Typography>


                {/* =================================================
                    USERNAME
                ================================================= */}

                <TextField
                  variant="standard"

                  value={
                    userName
                  }

                  onChange={
                    (e) =>
                      setUsername(
                        e.target.value
                      )
                  }

                  InputProps={{
                    disableUnderline:
                      true,
                  }}

                  placeholder="Username"

                  sx={{

                    display:
                      "flex",

                    height:
                      "3.5vh",

                    width:
                      "90%",

                    justifyContent:
                      "center",

                    marginBottom:
                      3,

                    background:
                      "rgba(255, 255, 255, 0.3)",

                    borderRadius:
                      "20px",

                    p:
                      1,

                    paddingLeft:
                      3,
                  }}
                />


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <TextField
                  variant="standard"

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  value={
                    password
                  }

                  onChange={
                    (e) =>
                      setPassword(
                        e.target.value
                      )
                  }

                  InputProps={{

                    disableUnderline:
                      true,

                    endAdornment: (

                      <InputAdornment
                        position="end"
                      >

                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide password"
                              : "show password"
                          }

                          onClick={
                            handleClickShowPassword
                          }

                          onMouseDown={
                            handleMouseDownPassword
                          }

                          edge="end"

                          sx={{
                            right:
                              20,
                          }}
                        >

                          {
                            showPassword
                              ? (
                                <VisibilityOff />
                              )
                              : (
                                <Visibility />
                              )
                          }

                        </IconButton>

                      </InputAdornment>

                    ),
                  }}

                  placeholder="Password"

                  sx={{

                    display:
                      "flex",

                    height:
                      "3.5vh",

                    width:
                      "90%",

                    justifyContent:
                      "center",

                    marginBottom:
                      2,

                    background:
                      "rgba(255, 255, 255, 0.3)",

                    borderRadius:
                      "20px",

                    p:
                      1,

                    paddingLeft:
                      3,

                  }}
                />


                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                <Button
                  sx={{

                    mt: 6,

                    fontSize:
                      "16px",

                    width:
                      "90%",

                    background:
                      "#074e2c",

                    borderRadius:
                      "20px",

                    "&:hover": {
                      backgroundColor:
                        "#08A04B",
                    },

                  }}

                  fullWidth

                  onClick={
                    Login
                  }

                  variant="contained"
                >
                  Login
                </Button>

              </>

            )}

          </Box>

        </Box>

      </Box>

    </Box>
  );
};


export default Login;











































