

import React from "react";

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

import { Visibility, VisibilityOff } from "@mui/icons-material";

import dayjs from "dayjs";

import Cookies from "js-cookie";

import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // ==========================================================
  // LOGIN STATES
  // ==========================================================

  const [userName, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const Login = () => {
    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (!userName || !password) {
      alert("Please enter username and password.");

      return;
    }

    // ========================================================
    // TEMPORARY SALE USER
    //
    // Username: Sale
    // Password: sale123456
    // ========================================================

    if (userName.trim().toLowerCase() === "sale" && password === "sale123456") {
      // ------------------------------------------------------
      // Clear old session values
      // ------------------------------------------------------

      sessionStorage.removeItem("UserRole");

      sessionStorage.removeItem("UserId");

      sessionStorage.removeItem("Name");

      // ------------------------------------------------------
      // Sale User ID
      // ------------------------------------------------------

      sessionStorage.setItem("UserId", "SALE");

      // ------------------------------------------------------
      // Sale User Name
      // ------------------------------------------------------

      sessionStorage.setItem("Name", "Sale User");

      // ------------------------------------------------------
      // Sale Role
      // ------------------------------------------------------

      sessionStorage.setItem("UserRole", "SALE");

      // ------------------------------------------------------
      // Success message
      // ------------------------------------------------------

      toast.success("Sale User Login Successful");

      // ------------------------------------------------------
      // Show Date Range screen
      // ------------------------------------------------------

      setIsLoggedIn(true);

      // IMPORTANT:
      // Do not call backend for Sale user.

      return;
    }

    // ========================================================
    // EXISTING BACKEND LOGIN
    // ========================================================

    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // ========================================================
    // REQUEST DATA
    // ========================================================

    const urlencoded = new URLSearchParams();

    urlencoded.append("UserId", userName);

    urlencoded.append("Password", password);

    // ========================================================
    // REQUEST OPTIONS
    // ========================================================

    const requestOptions = {
      method: "POST",

      headers: myHeaders,

      body: urlencoded,

      redirect: "follow",
    };

    // ========================================================
    // BACKEND LOGIN API
    // ========================================================

    fetch(
      "https://arohanagroapi.microtechsolutions.net.in/php/Usernameget.php",
      requestOptions,
    )
      .then((response) => response.json())

      .then((result) => {
        console.log("Login API Result:", result);

        // ==================================================
        // LOGIN SUCCESS
        // ==================================================

        if (result?.message === "Login successful") {
          // ------------------------------------------------
          // Clear old session values
          // ------------------------------------------------

          sessionStorage.removeItem("UserRole");

          // ------------------------------------------------
          // Store User ID
          // ------------------------------------------------

          sessionStorage.setItem("UserId", result.Id);

          // ------------------------------------------------
          // Store User Name
          // ------------------------------------------------

          sessionStorage.setItem("Name", result.Name);

          // ------------------------------------------------
          // IMPORTANT
          //
          // Existing backend users are treated
          // as ADMIN users.
          // ------------------------------------------------

          sessionStorage.setItem("UserRole", "ADMIN");

          console.log("UserRole:", sessionStorage.getItem("UserRole"));

          // ------------------------------------------------
          // Success message
          // ------------------------------------------------

          toast.success("Log In created successfully");

          // ------------------------------------------------
          // Show Date Range screen
          // ------------------------------------------------

          setIsLoggedIn(true);
        } else {
          // ================================================
          // LOGIN FAILED
          // ================================================

          alert("Login failed! Please check your credentials.");
        }
      })

      .catch((error) => {
        console.error("Login Error:", error);

        alert("Something went wrong during login.");
      });
  };

  // ==========================================================
  // DATE RANGE
  // ==========================================================

  const [FromDate, setFromDate] = useState(dayjs());

  const [ToDate, setToDate] = useState(dayjs());

  const [years, setYears] = useState([]);

  const [selectedYearId, setSelectedYearId] = useState("");

  // ==========================================================
  // FETCH DATE RANGE
  // ==========================================================

  const fetchDateRange = async () => {
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.net.in/php/getyears.php",
      );

      setYears(response.data);
    } catch (error) {
      console.error("Error fetching years:", error);

      toast.error("Error fetching Years");
    }
  };

  // ==========================================================
  // FETCH YEARS ON PAGE LOAD
  // ==========================================================

  useEffect(() => {
    fetchDateRange();
  }, []);

  // ==========================================================
  // YEAR SELECT
  // ==========================================================

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;

    setSelectedYearId(selectedId);

    const selectedYear = years.find(
      (year) => String(year.Id) === String(selectedId),
    );

    if (selectedYear) {
      setFromDate(dayjs(selectedYear.FromDate.date));

      setToDate(dayjs(selectedYear.ToDate.date));

      // ------------------------------------------------------
      // Store selected year
      // ------------------------------------------------------

      Cookies.set("SelectedYearId", selectedId, {
        expires: 7,
      });
    }
  };

  // ==========================================================
  // CONTINUE / OK
  // ==========================================================

  const handleOkClick = async (e) => {
    e.preventDefault();

    try {
      // ----------------------------------------------------
      // Date validation
      // ----------------------------------------------------

      if (!FromDate || !ToDate) {
        toast.error("Please select both From and To dates");

        return;
      }

      // ----------------------------------------------------
      // Year validation
      // ----------------------------------------------------

      if (!selectedYearId) {
        toast.error("Please select a year");

        return;
      }

      // ----------------------------------------------------
      // Format dates
      // ----------------------------------------------------

      const fromDate = FromDate.format("YYYY-MM-DD");

      const toDate = ToDate.format("YYYY-MM-DD");

      // ----------------------------------------------------
      // Find selected year
      // ----------------------------------------------------

      const selectedYear = years.find(
        (year) => String(year.Id) === String(selectedYearId),
      );

      if (selectedYear) {
        // --------------------------------------------------
        // Store From Date
        // --------------------------------------------------

        Cookies.set("FromDate", fromDate, {
          expires: 7,
        });

        // --------------------------------------------------
        // Store To Date
        // --------------------------------------------------

        Cookies.set("ToDate", toDate, {
          expires: 7,
        });

        // --------------------------------------------------
        // Store Year ID
        // --------------------------------------------------

        Cookies.set("YearId", selectedYear.Id, {
          expires: 7,
        });

        // --------------------------------------------------
        // Store Date Range
        // --------------------------------------------------

        Cookies.set("DateRange", selectedYear.DateRange, {
          expires: 7,
        });
      }

      // ----------------------------------------------------
      // Success
      // ----------------------------------------------------

      toast.success("Year selected successfully!");

      // ----------------------------------------------------
      // Go to application
      // ----------------------------------------------------

      navigate("/customermaster");
    } catch (error) {
      console.error("Error:", error);

      toast.error("Error saving record! " + error.message);
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

        backgroundImage: `url(${BaggroundImg})`,

        backgroundSize: "cover",

        backgroundPosition: "center",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",

            width: isSmallScreen ? "90vw" : "950px",

            height: isSmallScreen ? "auto" : "460px",

            borderRadius: "20px",

            overflow: "hidden",

            boxShadow: "0 4px 10px rgba(32, 30, 29, 0.22)",

            background: "rgba(255, 255, 255, 0.17)",

            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <Box
            sx={{
              width: "100%",

              justifyContent: "center",

              alignContent: "center",

              alignItems: "center",

              display: isSmallScreen ? "none" : "auto",
            }}
          >
            <Box className="login-logo">
              <img
                src={logo}
                alt="Amrut Dairy Logo"
                style={{
                  height: "460px",
                  width: "100%",
                }}
              />
            </Box>
          </Box>

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <Box
            sx={{
              width: isSmallScreen ? "100%" : "100%",

              padding: "40px",

              display: "flex",

              flexDirection: "column",

              alignItems: "center",
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
                    fontWeight: "bold",

                    color: "#3A3B3C",

                    marginBottom: 7,
                  }}
                >
                  Select Date Range
                </Typography>

                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={selectedYearId}
                  onChange={handleSelectChange}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "30px",

                      background:
                        "linear-gradient(90deg, rgba(173,216,230,0.5), rgba(216,191,216,0.5))",

                      backdropFilter: "blur(10px)",

                      WebkitBackdropFilter: "blur(10px)",

                      paddingLeft: 2,

                      color: "#000",

                      "& .MuiSelect-select": {
                        paddingY: "12px",
                      },

                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#666",
                    },
                  }}
                >

                 {years
  .filter((year) => {
    const range = year.DateRange || "";

    return (
      range.includes("01-04-2025") ||
      range.includes("01-04-2026")
    );
  })
  .map((year) => (
    <MenuItem key={year.Id} value={year.Id}>
      {year.DateRange}
    </MenuItem>
  ))}
                </TextField>

                <Button
                  sx={{
                    mt: 6,

                    fontSize: "16px",

                    width: "90%",

                    background: "#074e2c",

                    borderRadius: "20px",

                    "&:hover": {
                      backgroundColor: "#08A04B",
                    },
                  }}
                  fullWidth
                  onClick={handleOkClick}
                  variant="contained"
                  disabled={!FromDate || !ToDate || !selectedYearId}
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
                    fontWeight: "bold",

                    color: "#3A3B3C",

                    marginBottom: 7,
                  }}
                >
                  Welcome ..
                </Typography>

                {/* =================================================
                    USERNAME
                ================================================= */}

                <TextField
                  variant="standard"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  placeholder="Username"
                  sx={{
                    display: "flex",

                    height: "3.5vh",

                    width: "90%",

                    justifyContent: "center",

                    marginBottom: 3,

                    background: "rgba(255, 255, 255, 0.3)",

                    borderRadius: "20px",

                    p: 1,

                    paddingLeft: 3,
                  }}
                />

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <TextField
                  variant="standard"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    disableUnderline: true,

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "hide password" : "show password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{
                            right: 20,
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Password"
                  sx={{
                    display: "flex",

                    height: "3.5vh",

                    width: "90%",

                    justifyContent: "center",

                    marginBottom: 2,

                    background: "rgba(255, 255, 255, 0.3)",

                    borderRadius: "20px",

                    p: 1,

                    paddingLeft: 3,
                  }}
                />

                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                <Button
                  sx={{
                    mt: 6,

                    fontSize: "16px",

                    width: "90%",

                    background: "#074e2c",

                    borderRadius: "20px",

                    "&:hover": {
                      backgroundColor: "#08A04B",
                    },
                  }}
                  fullWidth
                  onClick={Login}
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
