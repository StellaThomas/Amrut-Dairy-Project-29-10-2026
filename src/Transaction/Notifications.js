import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";



import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CloseIcon from "@mui/icons-material/Close";

// =====================================================
// API CONSTANTS
// =====================================================

const PRODUCT_MASTER_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster";

const STOCK_REPORT_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/getstockreport.php";

// =====================================================
// TODAY DATE
// =====================================================

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
};

// =====================================================
// NORMALIZE API ARRAY
// =====================================================

const getArray = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.Data)) return result.Data;

  return [];
};

// =====================================================
// PRODUCT ID
// =====================================================

const getProductId = (product) => {
  return String(
    product?.Id ??
      product?.ProductId ??
      product?.ProductID ??
      ""
  ).trim();
};

// =====================================================
// REORDER LEVEL
// =====================================================

const getReorderLevel = (product) => {
  const value =
    product?.ReOrderLevel ??
    product?.ReorderLevel ??
    product?.Reorderlevel;

  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// =====================================================
// STOCK BALANCE
// =====================================================

const getStockBalance = (item) => {
  const value =
    item?.Balance ??
    item?.ClosingBalance ??
    item?.CurrentStock;

  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

// =====================================================
// NOTIFICATIONS COMPONENT
// =====================================================

export default function Notifications() {
    const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH LOW STOCK PRODUCTS
  // =====================================================

  const fetchLowStockProducts = async () => {
    if (!fromDate || !toDate) {
      setError("Please select From Date and To Date.");
      return;
    }

    if (fromDate > toDate) {
      setError("From Date cannot be greater than To Date.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(false);
    setProducts([]);

    try {
      // -------------------------------------------------
      // STOCK REPORT URL
      // -------------------------------------------------

      const queryParams = new URLSearchParams();

      queryParams.set("fromdate", fromDate);
      queryParams.set("todate", toDate);

      const stockUrl =
        STOCK_REPORT_API + "?" + queryParams.toString();

      console.log("PRODUCT MASTER API:", PRODUCT_MASTER_API);
      console.log("STOCK REPORT API:", stockUrl);

      // -------------------------------------------------
      // CALL BOTH APIs
      // -------------------------------------------------

      const [productResponse, stockResponse] =
        await Promise.all([
          fetch(PRODUCT_MASTER_API),
          fetch(stockUrl),
        ]);

      if (!productResponse.ok) {
        throw new Error(
          "Product Master API failed. HTTP status: " +
            productResponse.status
        );
      }

      if (!stockResponse.ok) {
        throw new Error(
          "Stock Report API failed. HTTP status: " +
            stockResponse.status
        );
      }

      const productResult = await productResponse.json();
      const stockResult = await stockResponse.json();

      if (productResult?.success === false) {
        throw new Error(
          productResult?.message ||
            "Product Master API returned an error."
        );
      }

      const stockSuccess =
        stockResult?.status === true ||
        stockResult?.status === "true" ||
        stockResult?.success === true;

      if (!stockSuccess) {
        throw new Error(
          stockResult?.message ||
            "Stock Report API returned an error."
        );
      }

      const productList = getArray(productResult);
      const stockList = getArray(stockResult);

      console.log("PRODUCT MASTER DATA:", productList);
      console.log("STOCK REPORT DATA:", stockList);

      // -------------------------------------------------
      // CREATE STOCK MAP
      // -------------------------------------------------

      const stockMap = new Map();

      stockList.forEach((item) => {
        const productId = String(
          item?.ProductId ??
            item?.ProductID ??
            item?.Id ??
            ""
        ).trim();

        const balance = getStockBalance(item);

        if (productId && balance !== null) {
          stockMap.set(productId, balance);
        }
      });

      // -------------------------------------------------
      // MATCH PRODUCT MASTER WITH STOCK REPORT
      // -------------------------------------------------

      const lowStockProducts = productList
        .map((product) => {
          const productId = getProductId(product);

          const currentStock = stockMap.get(productId);
          const reorderLevel = getReorderLevel(product);

          return {
            ...product,
            NotificationProductId: productId,
            CurrentStock: currentStock,
            ReorderLevel: reorderLevel,
          };
        })
        .filter((product) => {
          return (
            product.NotificationProductId !== "" &&
            product.CurrentStock !== undefined &&
            product.ReorderLevel > 0 &&
            product.CurrentStock <= product.ReorderLevel
          );
        })
        .sort((a, b) => a.CurrentStock - b.CurrentStock);

      console.log("LOW STOCK PRODUCTS:", lowStockProducts);

      setProducts(lowStockProducts);
      setHasSearched(true);
    } catch (err) {
      console.error("Notification API Error:", err);

      setProducts([]);
      setHasSearched(false);

      const message = err?.message || "Unable to fetch stock.";

      if (
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("load failed")
      ) {
        setError(
          "API could not be reached. Check internet connectivity and backend CORS settings."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE UI
  // =====================================================

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%", boxSizing: "border-box" }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            backgroundColor: "#054c2a",
            color: "#fff",
            p: 2.5,
          }}
        >


            
<Button
  variant="outlined"
  startIcon={<CloseIcon />}
  onClick={() => navigate(-1)}
  sx={{
    ml: "auto",
    color: "#fff",
    borderColor: "#fff",
    textTransform: "none",
    whiteSpace: "nowrap",
    "&:hover": {
      borderColor: "#fff",
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  }}
>
  Close
</Button>

          <NotificationsActiveIcon sx={{ fontSize: 30 }} />

          <Box>
            <Typography variant="h5" fontWeight="bold">
              Notifications
            </Typography>

            <Typography variant="body2">
              Minimum Stock Notification
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Check Stock
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 3 }}
          >
            <TextField
              label="From Date"
              type="date"
              size="small"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: toDate || undefined }}
              fullWidth
            />

            <TextField
              label="To Date"
              type="date"
              size="small"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: fromDate || undefined }}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={fetchLowStockProducts}
              disabled={loading || !fromDate || !toDate}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <RefreshIcon />
                )
              }
              sx={{
                minWidth: 145,
                py: 1,
                backgroundColor: "#054c2a",
                textTransform: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "#073d24",
                },
              }}
            >
              {loading ? "Loading..." : "Check Stock"}
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                py: 5,
              }}
            >
              <CircularProgress color="success" />
              <Typography>Loading stock details...</Typography>
            </Box>
          )}

          {!loading && !error && !hasSearched && (
            <Alert severity="info">
              Select dates and click Check Stock.
            </Alert>
          )}

          {!loading &&
            !error &&
            hasSearched &&
            products.length === 0 && (
              <Alert severity="success">
                No low-stock products found for the selected date range.
              </Alert>
            )}

          {!loading && !error && products.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Low Stock Products
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#b42318", fontWeight: "bold" }}
                >
                  Total: {products.length}
                </Typography>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          backgroundColor: "#e8f3eb",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      <TableCell>Product Code</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell align="right">
                        Current Balance
                      </TableCell>
                      <TableCell align="right">
                        Reorder Level
                      </TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        hover
                        key={product.NotificationProductId}
                      >
                        <TableCell>
                          {product.ProductCode ??
                            product.NotificationProductId}
                        </TableCell>

                        <TableCell>
                          {product.ProductName ?? "-"}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            color:
                              product.CurrentStock < 0
                                ? "error.main"
                                : "text.primary",
                            fontWeight: "bold",
                          }}
                        >
                          {Number(product.CurrentStock).toFixed(3)}
                        </TableCell>

                        <TableCell align="right">
                          {Number(product.ReorderLevel).toFixed(3)}
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            color="error.main"
                            fontWeight="bold"
                          >
                            Low Stock
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}