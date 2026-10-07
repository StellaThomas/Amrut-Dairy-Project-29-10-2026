import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import RestaurantIcon from "@mui/icons-material/Restaurant";

// ============================================================
// API
// ============================================================

const API_BASE = "https://amrutdairyapi.microtechsolutions.net.in/php";

// ============================================================
// SAFE ARRAY
// ============================================================

const toArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (data?.data) {
    return [data.data];
  }

  if (data) {
    return [data];
  }

  return [];
};

// ============================================================
// DATE VALUE
// ============================================================

const getDateValue = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return value?.date || value?.Date || value?.value || "";
  }

  return String(value);
};

// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {
  const dateValue = getDateValue(value);

  if (!dateValue) {
    return "-";
  }

  const date = moment(dateValue);

  if (!date.isValid()) {
    return "-";
  }

  return date.format("DD/MM/YYYY");
};

// ============================================================
// FILTER DATE
// ============================================================

const formatDateForFilter = (value) => {
  const dateValue = getDateValue(value);

  if (!dateValue) {
    return "";
  }

  const date = moment(dateValue);

  if (!date.isValid()) {
    return "";
  }

  return date.format("YYYY-MM-DD");
};

// ============================================================
// MONEY
// ============================================================

const money = (value) => {
  const number = Number(value || 0);

  return `₹ ${number.toFixed(2)}`;
};

// ============================================================
// CUSTOMER TYPE
// ============================================================

const getCustomerType = (invoice) => {
  const type = String(
    invoice?.CustomerType ||
      invoice?.customerType ||
      invoice?.accountDetails?.CustomerType ||
      invoice?.accountDetails?.customerType ||
      invoice?.addressDetails?.CustomerType ||
      invoice?.addressDetails?.customerType ||
      "",
  )
    .trim()
    .toUpperCase();

  return type;
};

// ============================================================
// SALE TYPE
//
// R = Regular
// D = Dealer
// C = Caterers
//
// IMPORTANT:
// AccountId = 0 means Walk-in Customer
// Walk-in is treated as Regular
// ============================================================

// ============================================================
// SALE TYPE
//
// R = Regular
// D = Dealer
// C = Caterers
//
// AccountId = 0 => Regular
// ============================================================
const getSaleType = (invoice) => {
  const accountId = Number(invoice?.AccountId || invoice?.accountId || 0);

  const customerType = getCustomerType(invoice);

  // Walk-in / no account
  if (accountId === 0) {
    return "Regular";
  }

  if (customerType === "R") {
    return "Regular";
  }

  if (customerType === "D") {
    return "Dealer";
  }

  if (customerType === "C") {
    return "Caterers";
  }

  // Unknown account type -> Regular
  return "Regular";
};

// ============================================================
// INVOICE NUMBER
// ============================================================

const getInvoiceNumber = (invoice) => {
  return (
    invoice?.InvoiceNo ||
    invoice?.InvoiceNumber ||
    invoice?.BillNo ||
    invoice?.BillNumber ||
    "-"
  );
};

// ============================================================
// COMPONENT
// ============================================================

const InvoiceEditHistoryDashboard = () => {
  // ==========================================================
  // MAIN DATA
  // ==========================================================

  const [invoiceList, setInvoiceList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [productOptions, setProductOptions] = useState([]);

  // ==========================================================
  // LOAD PRODUCT MASTER
  // ==========================================================
  const fetchProductMaster = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/get/gettable.php?Table=ProductMaster`,
      );

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      const options = data
        .map((product) => {
          const productId = product?.Id ?? product?.ProductId ?? product?.id;

          const productName =
            product?.ProductName ??
            product?.productName ??
            product?.Name ??
            product?.name ??
            "";

          return {
            value: productId,
            label: productName,
            Id: productId,
            ProductId: product?.ProductId ?? productId,
            ProductName: productName,
          };
        })
        .filter(
          (product) => product.value !== null && product.value !== undefined,
        );

      setProductOptions(options);

      console.log("==========================================");
      console.log("PRODUCT MASTER LOADED");
      console.log("TOTAL PRODUCTS:", options.length);
      console.log("PRODUCT MASTER:", options);
      console.log("==========================================");

      return options;
    } catch (error) {
      console.error("PRODUCT MASTER LOAD ERROR:", error);

      setProductOptions([]);

      return [];
    }
  };

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [searchText, setSearchText] = useState("");

  const [saleType, setSaleType] = useState("ALL");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  // ==========================================================
  // HISTORY DIALOG
  // ==========================================================

  const [historyOpen, setHistoryOpen] = useState(false);

  const [historyLoading, setHistoryLoading] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [historyHeader, setHistoryHeader] = useState([]);

  const [historyDetails, setHistoryDetails] = useState([]);

  const [currentHeader, setCurrentHeader] = useState(null);

  const [currentDetails, setCurrentDetails] = useState([]);

  const [selectedVersion, setSelectedVersion] = useState(null);

  const [selectedVersionDetails, setSelectedVersionDetails] = useState([]);

  // ==========================================================
  // FETCH ALL CURRENT INVOICES
  // ==========================================================

  const fetchAllInvoiceHeaders = async () => {
    try {
      console.log("==========================================");

      console.log("FETCHING ALL CURRENT INVOICES");

      console.log("==========================================");

      // First page
      const firstResponse = await axios.get(
        `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=1`,
      );

      const firstData = firstResponse?.data || {};

      const totalPages = Math.max(Number(firstData?.total_pages || 1), 1);

      console.log("TOTAL INVOICE PAGES:", totalPages);

      const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      );

      const responses = await Promise.all(
        pageNumbers.map(async (pageNo) => {
          try {
            const response = await axios.get(
              `${API_BASE}/get/gettblpage.php?Table=invoiceheader&PageNo=${pageNo}`,
            );

            return toArray(response);
          } catch (error) {
            console.error(`Invoice page ${pageNo} failed`, error);

            return [];
          }
        }),
      );

      const allInvoices = responses.flat();

      // =====================================================
      // REMOVE DUPLICATES
      // =====================================================

      const uniqueInvoices = [];

      const seenIds = new Set();

      allInvoices.forEach((invoice) => {
        const id = invoice?.Id || invoice?.InvoiceId;

        if (!id) {
          return;
        }

        const key = String(id);

        if (seenIds.has(key)) {
          return;
        }

        seenIds.add(key);

        uniqueInvoices.push(invoice);
      });

      console.log("TOTAL UNIQUE CURRENT INVOICES:", uniqueInvoices.length);

      return uniqueInvoices;
    } catch (error) {
      console.error("FETCH ALL INVOICE HEADER ERROR:", error);

      return [];
    }
  };

  // ==========================================================
  // FETCH ACCOUNT
  // ==========================================================

  const fetchAccount = async (accountId) => {
    if (!accountId || Number(accountId) === 0) {
      return null;
    }

    try {
      const response = await axios.get(
        `${API_BASE}/getbyid.php?Table=Account&Colname=Id&Colvalue=${encodeURIComponent(
          accountId,
        )}`,
      );

      const list = toArray(response);

      return list[0] || null;
    } catch (error) {
      console.error("ACCOUNT FETCH ERROR:", accountId, error);

      return null;
    }
  };

  // ==========================================================
  // FETCH ADDRESS
  // ==========================================================

  const fetchAddress = async (accountId) => {
    if (!accountId || Number(accountId) === 0) {
      return null;
    }

    try {
      const response = await axios.get(
        `${API_BASE}/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${encodeURIComponent(
          accountId,
        )}`,
      );

      const list = toArray(response);

      return list[0] || null;
    } catch (error) {
      console.error("ADDRESS FETCH ERROR:", accountId, error);

      return null;
    }
  };

  // ==========================================================
  // FETCH HISTORY FOR ONE INVOICE
  // ==========================================================

  const fetchInvoiceHistory = async (invoiceId) => {
    if (!invoiceId) {
      return [];
    }

    try {
      const response = await axios.get(
        `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
          invoiceId,
        )}`,
      );

      const history = toArray(response);

      console.log("HISTORY:", invoiceId, history);

      return history;
    } catch (error) {
      console.error("HISTORY FETCH ERROR:", invoiceId, error);

      return [];
    }
  };

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard = async () => {
    setLoading(true);

    try {
      console.log("==========================================");

      console.log("LOADING INVOICE EDIT HISTORY DASHBOARD");

      console.log("==========================================");

      // ======================================================
      // 1. CURRENT INVOICES
      // ======================================================

      const invoices = await fetchAllInvoiceHeaders();

      console.log("CURRENT INVOICE COUNT:", invoices.length);

      // ======================================================
      // 2. FIND EDITED INVOICES
      // ======================================================

      const editedInvoices = [];

      const batchSize = 8;

      for (let i = 0; i < invoices.length; i += batchSize) {
        const batch = invoices.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map(async (invoice) => {
            const invoiceId = invoice?.Id || invoice?.InvoiceId;

            if (!invoiceId) {
              return null;
            }

            const history = await fetchInvoiceHistory(invoiceId);

            // IMPORTANT
            // No history = not edited

            if (!history || history.length === 0) {
              return null;
            }

            return {
              ...invoice,

              isEdited: true,

              historyCount: history.length,

              historyHeader: history,
            };
          }),
        );

        batchResults.forEach((item) => {
          if (item) {
            editedInvoices.push(item);
          }
        });
      }

      console.log("==========================================");

      console.log("TOTAL EDITED INVOICES:", editedInvoices.length);

      console.log("EDITED INVOICES:", editedInvoices);

      console.log("==========================================");

      // ======================================================
      // 3. FETCH CUSTOMER DATA
      // ======================================================

      const finalInvoices = [];

      for (let i = 0; i < editedInvoices.length; i += batchSize) {
        const batch = editedInvoices.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map(async (invoice) => {
            const accountId = Number(invoice?.AccountId || 0);

            // Walk-in
            if (accountId === 0) {
              return {
                ...invoice,

                accountDetails: null,

                addressDetails: null,

                CustomerType: "R",
              };
            }

            // Fetch Account + Address
            const [account, address] = await Promise.all([
              fetchAccount(accountId),
              fetchAddress(accountId),
            ]);

            const customerType = String(
              address?.CustomerType ||
                address?.customerType ||
                account?.CustomerType ||
                account?.customerType ||
                invoice?.CustomerType ||
                invoice?.customerType ||
                "",
            )
              .trim()
              .toUpperCase();

            console.log("CATEGORY:", {
              InvoiceId: invoice?.Id,

              InvoiceNo: invoice?.InvoiceNo,

              AccountId: accountId,

              CustomerName: account?.AccountName,

              CustomerType: customerType,
            });

            return {
              ...invoice,

              accountDetails: {
                ...(account || {}),

                CustomerType: customerType,
              },

              addressDetails: address,

              CustomerType: customerType,
            };
          }),
        );

        finalInvoices.push(...batchResults);
      }

      // ======================================================
      // 4. SORT BY LATEST INVOICE
      // ======================================================

      finalInvoices.sort((a, b) => {
        const dateA = moment(getDateValue(a?.InvoiceDate)).valueOf();

        const dateB = moment(getDateValue(b?.InvoiceDate)).valueOf();

        return dateB - dateA;
      });

      // ======================================================
      // 5. SET DASHBOARD
      // ======================================================

      setInvoiceList(finalInvoices);

      console.log("==========================================");

      console.log("FINAL DASHBOARD DATA:", finalInvoices);

      console.log("==========================================");
    } catch (error) {
      console.error("DASHBOARD LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // First load Product Master
        await fetchProductMaster();

        // Then load invoice history dashboard
        await loadDashboard();
      } catch (error) {
        console.error("DASHBOARD INITIALIZATION ERROR:", error);
      }
    };

    initializeDashboard();
  }, []);

  // ==========================================================
  // CUSTOMER NAME
  // ==========================================================
  const getCustomerName = (invoice) => {
    const accountName =
      invoice?.accountDetails?.AccountName ||
      invoice?.accountDetails?.accountName ||
      invoice?.AccountName ||
      invoice?.CustomerName ||
      invoice?.customerName;

    if (accountName && String(accountName).trim()) {
      return String(accountName).trim();
    }

    // No customer/account name
    return "-";
  };

  // ==========================================================
  // CONTACT
  // ==========================================================

  const getContact = (invoice) => {
    return (
      invoice?.ContactNo ||
      invoice?.Phone ||
      invoice?.Mobile ||
      invoice?.MobileNo ||
      "-"
    );
  };

  // ==========================================================
  // FILTERED DATA
  //
  // SEARCH ONLY:
  // Invoice No
  // Customer Name
  // ==========================================================

  const filteredInvoices = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return invoiceList.filter((invoice) => {
      const invoiceNo = String(getInvoiceNumber(invoice)).toLowerCase();

      const customerName = String(getCustomerName(invoice)).toLowerCase();

      const invoiceDate = formatDateForFilter(invoice?.InvoiceDate);

      // ==================================================
      // SEARCH
      // ==================================================

      const searchMatch =
        !search || invoiceNo.includes(search) || customerName.includes(search);

      // ==================================================
      // SALE TYPE
      // ==================================================

      const currentSaleType = getSaleType(invoice);

      const typeMatch = saleType === "ALL" || currentSaleType === saleType;

      // ==================================================
      // FROM DATE
      // ==================================================

      const fromMatch = !fromDate || (invoiceDate && invoiceDate >= fromDate);

      // ==================================================
      // TO DATE
      // ==================================================

      const toMatch = !toDate || (invoiceDate && invoiceDate <= toDate);

      return searchMatch && typeMatch && fromMatch && toMatch;
    });
  }, [invoiceList, searchText, saleType, fromDate, toDate]);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const editedCount = filteredInvoices.length;

  const regularCount = filteredInvoices.filter(
    (invoice) => getSaleType(invoice) === "Regular",
  ).length;

  const dealerCount = filteredInvoices.filter(
    (invoice) => getSaleType(invoice) === "Dealer",
  ).length;

  const caterersCount = filteredInvoices.filter(
    (invoice) => getSaleType(invoice) === "Caterers",
  ).length;

  const dealerCaterersCount = dealerCount + caterersCount;

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearchText("");

    setSaleType("ALL");

    setFromDate("");

    setToDate("");
  };

  // ==========================================================
  // FETCH CURRENT INVOICE
  // ==========================================================

  const fetchCurrentInvoice = async (invoiceId) => {
    const [headerResponse, detailResponse] = await Promise.all([
      axios.get(
        `${API_BASE}/getbyid.php?Table=invoiceheader&Colname=Id&Colvalue=${encodeURIComponent(
          invoiceId,
        )}`,
      ),

      axios.get(
        `${API_BASE}/getbyid.php?Table=invoicedetail&Colname=InvoiceId&Colvalue=${encodeURIComponent(
          invoiceId,
        )}`,
      ),
    ]);

    const headers = toArray(headerResponse);

    const details = toArray(detailResponse);

    return {
      header: headers[0] || null,

      details,
    };
  };

  // ==========================================================
  // OPEN HISTORY
  // ==========================================================

  const openHistory = async (invoice) => {
    const invoiceId = invoice?.Id || invoice?.InvoiceId;

    if (!invoiceId) {
      console.error("Invoice ID missing:", invoice);

      return;
    }

    setSelectedInvoice(invoice);

    setHistoryOpen(true);

    setHistoryLoading(true);

    setHistoryHeader([]);

    setHistoryDetails([]);

    setCurrentHeader(null);

    setCurrentDetails([]);

    setSelectedVersion(null);

    setSelectedVersionDetails([]);

    try {
      // ======================================================
      // OLD HEADER
      // ======================================================

      const oldHeaderResponse = await axios.get(
        `${API_BASE}/getbyid.php?Table=invoiceheader_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
          invoiceId,
        )}`,
      );

      const oldHeaders = toArray(oldHeaderResponse);

      // ======================================================
      // OLD DETAILS
      // ======================================================

      const oldDetailResponse = await axios.get(
        `${API_BASE}/getbyid.php?Table=invoicedetail_history&Colname=InvoiceId&Colvalue=${encodeURIComponent(
          invoiceId,
        )}`,
      );

      const oldDetails = toArray(oldDetailResponse);

      console.log("OLD HEADERS:", oldHeaders);

      console.log("OLD DETAILS:", oldDetails);

      setHistoryHeader(oldHeaders);

      setHistoryDetails(oldDetails);

      // ======================================================
      // CURRENT INVOICE
      // ======================================================

      const current = await fetchCurrentInvoice(invoiceId);

      setCurrentHeader(current.header);

      setCurrentDetails(current.details);

      // ======================================================
      // DEFAULT LATEST VERSION
      // ======================================================

      if (oldHeaders.length > 0) {
        const sorted = [...oldHeaders].sort(
          (a, b) => Number(b?.VersionNo || 0) - Number(a?.VersionNo || 0),
        );

        const latest = sorted[0];

        const latestVersion = Number(latest?.VersionNo || 0);

        if (latestVersion) {
          setSelectedVersion(latestVersion);

          const latestDetails = oldDetails.filter(
            (detail) => Number(detail?.VersionNo) === latestVersion,
          );

          setSelectedVersionDetails(latestDetails);
        }
      }
    } catch (error) {
      console.error("OPEN HISTORY ERROR:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ==========================================================
  // SELECT VERSION
  // ==========================================================

  const selectVersion = (historyItem) => {
    const version = Number(historyItem?.VersionNo || 0);

    if (!version) {
      return;
    }

    setSelectedVersion(version);

    const details = historyDetails.filter(
      (detail) => Number(detail?.VersionNo) === version,
    );

    setSelectedVersionDetails(details);
  };

  // ==========================================================
  // CLOSE HISTORY
  // ==========================================================

  const closeHistory = () => {
    setHistoryOpen(false);

    setSelectedInvoice(null);

    setHistoryHeader([]);

    setHistoryDetails([]);

    setCurrentHeader(null);

    setCurrentDetails([]);

    setSelectedVersion(null);

    setSelectedVersionDetails([]);
  };

  // ==========================================================
  // PRODUCT NAME
  // ==========================================================

  // ==========================================================
  // GET PRODUCT NAME FROM PRODUCT MASTER
  // ==========================================================
  const getProductName = (detail) => {
    if (!detail) {
      return "-";
    }

    // --------------------------------------------------------
    // 1. If API already gives ProductName, use it
    // --------------------------------------------------------
    const directName =
      detail?.ProductName ||
      detail?.productName ||
      detail?.Product ||
      detail?.product;

    if (directName && String(directName).trim() !== "") {
      return String(directName).trim();
    }

    // --------------------------------------------------------
    // 2. Get ProductId from invoice detail
    // --------------------------------------------------------
    const productId =
      detail?.ProductId ??
      detail?.ProductID ??
      detail?.productId ??
      detail?.Product ??
      detail?.Product_Id;

    if (productId === null || productId === undefined || productId === "") {
      return "-";
    }

    // --------------------------------------------------------
    // 3. Find product in Product Master
    // --------------------------------------------------------
    const product = productOptions.find(
      (option) => String(option?.value) === String(productId),
    );

    // --------------------------------------------------------
    // 4. Return Product Master name
    // --------------------------------------------------------
    if (product?.label && String(product.label).trim() !== "") {
      return String(product.label).trim();
    }

    // --------------------------------------------------------
    // 5. Last fallback
    // --------------------------------------------------------
    return `Product ${productId}`;
  };

  // ==========================================================
  // SALE TYPE ICON
  // ==========================================================

  const getSaleTypeIcon = (type) => {
    if (type === "Dealer") {
      return (
        <StoreIcon
          sx={{
            fontSize: 18,
          }}
        />
      );
    }

    if (type === "Caterers") {
      return (
        <RestaurantIcon
          sx={{
            fontSize: 18,
          }}
        />
      );
    }

    return (
      <PersonIcon
        sx={{
          fontSize: 18,
        }}
      />
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",

        background: "linear-gradient(135deg,#f3f7f5 0%,#eef3f7 100%)",

        p: {
          xs: 1.5,
          md: 3,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg,#00695c 0%,#004d40 100%)",

          color: "#fff",

          borderRadius: 4,

          px: {
            xs: 2,
            md: 4,
          },

          py: {
            xs: 2,
            md: 3,
          },

          mb: 3,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: "rgba(255,255,255,0.15)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: 34,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 25,
                  md: 34,
                },

                fontWeight: 800,

                lineHeight: 1.1,
              }}
            >
              Invoice History
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: {
                  xs: 13,
                  md: 17,
                },

                opacity: 0.9,
              }}
            >
              View edited invoices and previous versions
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={async () => {
            try {
              setLoading(true);

              // First reload Product Master
              await fetchProductMaster();

              // Then reload Invoice History Dashboard
              await loadDashboard();
            } catch (error) {
              console.error("REFRESH DASHBOARD ERROR:", error);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          sx={{
            background: "rgba(255,255,255,0.16)",

            color: "#fff",

            textTransform: "none",

            fontWeight: 700,

            borderRadius: 2,

            px: 2.5,

            "&:hover": {
              background: "rgba(255,255,255,0.25)",
            },
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </Paper>

      {/* =====================================================
          SEARCH & FILTER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,

          p: {
            xs: 2,
            md: 3,
          },

          mb: 3,

          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1,

            mb: 2,
          }}
        >
          <ReceiptLongIcon
            sx={{
              color: "#00695c",
              fontSize: 28,
            }}
          />

          <Typography
            sx={{
              fontSize: 25,
              fontWeight: 800,
            }}
          >
            Search & Filter
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              md: "2fr 1fr 1fr 1fr auto",
            },

            gap: 2,

            alignItems: "center",
          }}
        >
          {/* SEARCH */}

          <TextField
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search Invoice / Customer"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#777",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* SALE TYPE */}

          <TextField
            select
            fullWidth
            label="Sale Type"
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
          >
            <MenuItem value="ALL">All Sales</MenuItem>

            <MenuItem value="Regular">Regular</MenuItem>

            <MenuItem value="Dealer">Dealer</MenuItem>

            <MenuItem value="Caterers">Caterers</MenuItem>
          </TextField>

          {/* FROM DATE */}

          <TextField
            fullWidth
            type="date"
            label="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* TO DATE */}

          <TextField
            fullWidth
            type="date"
            label="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* CLEAR */}

          <Button
            variant="outlined"
            startIcon={<FilterAltOffIcon />}
            onClick={clearFilters}
            sx={{
              height: 56,

              whiteSpace: "nowrap",

              textTransform: "none",

              fontWeight: 700,

              borderRadius: 2,
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            md: "repeat(3,1fr)",
          },

          gap: 3,

          mb: 3,
        }}
      >
        {/* EDITED */}

        <SummaryCard
          title="Edited Invoices"
          value={editedCount}
          icon={
            <EditNoteIcon
              sx={{
                fontSize: 50,
              }}
            />
          }
        />

        {/* REGULAR */}

        <SummaryCard
          title="Regular"
          value={regularCount}
          icon={
            <CalendarMonthIcon
              sx={{
                fontSize: 50,
              }}
            />
          }
        />

        {/* DEALER / CATERERS */}

        <SummaryCard
          title="Dealer / Caterers"
          value={dealerCaterersCount}
          icon={
            <HistoryIcon
              sx={{
                fontSize: 55,
              }}
            />
          }
        />
      </Box>

      {/* =====================================================
          SMALL TYPE SUMMARY
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Chip
          icon={<PersonIcon />}
          label={`Regular: ${regularCount}`}
          variant="outlined"
          sx={{
            fontWeight: 700,
          }}
        />

        <Chip
          icon={<StoreIcon />}
          label={`Dealer: ${dealerCount}`}
          variant="outlined"
          sx={{
            fontWeight: 700,
          }}
        />

        <Chip
          icon={<RestaurantIcon />}
          label={`Caterers: ${caterersCount}`}
          variant="outlined"
          sx={{
            fontWeight: 700,
          }}
        />
      </Box>

      {/* =====================================================
          EDITED INVOICE LIST
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,

          overflow: "hidden",

          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          sx={{
            px: 3,

            py: 2.5,

            background: "linear-gradient(135deg,#f4faf7,#edf7f3)",

            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography
            sx={{
              fontSize: 27,

              fontWeight: 800,
            }}
          >
            Edited Invoice List
          </Typography>

          <Typography
            sx={{
              color: "#666",

              mt: 0.5,
            }}
          >
            Only invoices having edit history are shown here.
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              py: 8,

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              flexDirection: "column",

              gap: 2,
            }}
          >
            <CircularProgress />

            <Typography color="text.secondary">
              Loading edited invoices...
            </Typography>
          </Box>
        ) : filteredInvoices.length === 0 ? (
          <Box
            sx={{
              py: 8,

              textAlign: "center",
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: 60,

                color: "#bbb",
              }}
            />

            <Typography
              sx={{
                mt: 1,

                fontSize: 18,

                fontWeight: 600,

                color: "#777",
              }}
            >
              No edited invoices found
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                color: "#999",
              }}
            >
              Try another invoice number or customer name.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "#edf3f2",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Invoice No
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Invoice Date
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Customer
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Sale Type
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Total
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Status
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredInvoices.map((invoice, index) => {
                  const currentType = getSaleType(invoice);

                  return (
                    <TableRow
                      key={invoice?.Id || invoice?.InvoiceId || index}
                      hover
                    >
                      {/* INVOICE NO */}

                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 800,

                            fontSize: 17,
                          }}
                        >
                          #{getInvoiceNumber(invoice)}
                        </Typography>
                      </TableCell>

                      {/* DATE */}

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",

                            alignItems: "center",

                            gap: 1,
                          }}
                        >
                          <CalendarMonthIcon
                            sx={{
                              fontSize: 20,

                              color: "#777",
                            }}
                          />

                          {formatDate(invoice?.InvoiceDate)}
                        </Box>
                      </TableCell>

                      {/* CUSTOMER */}

                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {getCustomerName(invoice)}
                        </Typography>

                        {getContact(invoice) !== "-" && (
                          <Typography
                            sx={{
                              fontSize: 12,

                              color: "#888",
                            }}
                          >
                            {getContact(invoice)}
                          </Typography>
                        )}
                      </TableCell>

                      {/* SALE TYPE */}

                      <TableCell>
                        <Chip
                          icon={getSaleTypeIcon(currentType)}
                          label={currentType}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 700,

                            borderRadius: 2,
                          }}
                        />
                      </TableCell>

                      {/* TOTAL */}

                      <TableCell align="right">
                        <Typography
                          sx={{
                            fontWeight: 800,

                            fontSize: 17,
                          }}
                        >
                          {money(invoice?.Total)}
                        </Typography>
                      </TableCell>

                      {/* STATUS */}

                      <TableCell>
                        <Chip
                          icon={<EditNoteIcon />}
                          label="EDITED"
                          size="small"
                          sx={{
                            fontWeight: 800,

                            background: "#eeeeee",

                            color: "#555",
                          }}
                        />
                      </TableCell>

                      {/* ACTION */}

                      <TableCell align="center">
                        <Button
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          onClick={() => openHistory(invoice)}
                          sx={{
                            textTransform: "none",

                            fontWeight: 800,

                            borderRadius: 2,

                            background: "#1976d2",

                            "&:hover": {
                              background: "#1565c0",
                            },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* =====================================================
          HISTORY DIALOG
      ===================================================== */}

      <Dialog
        open={historyOpen}
        onClose={closeHistory}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            borderRadius: 3,

            maxHeight: "94vh",
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            background: "linear-gradient(135deg,#1976d2,#0d47a1)",

            color: "#fff",

            px: 3,

            py: 2,

            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 28,

                fontWeight: 800,
              }}
            >
              Invoice Edit History
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                opacity: 0.9,
              }}
            >
              Invoice No:{" "}
              {selectedInvoice ? getInvoiceNumber(selectedInvoice) : "-"}
            </Typography>
          </Box>

          <IconButton
            onClick={closeHistory}
            sx={{
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            background: "#f5f7fa",

            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          {historyLoading ? (
            <Box
              sx={{
                minHeight: 400,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* =================================================
                  CURRENT INVOICE
              ================================================= */}

              <Paper
                elevation={0}
                sx={{
                  p: 3,

                  mb: 3,

                  borderRadius: 3,

                  border: "1px solid #ddd",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 26,

                    fontWeight: 800,

                    color: "#1976d2",

                    mb: 3,
                  }}
                >
                  Current Invoice
                </Typography>

                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "repeat(2,1fr)",

                      md: "repeat(6,1fr)",
                    },

                    gap: 3,
                  }}
                >
                  <InfoItem
                    label="Invoice No"
                    value={currentHeader?.InvoiceNo || currentHeader?.Id || "-"}
                  />

                  <InfoItem
                    label="Invoice Date"
                    value={formatDate(currentHeader?.InvoiceDate)}
                  />

                  <InfoItem
                    label="Customer"
                    value={getCustomerName({
                      ...selectedInvoice,
                      ...currentHeader,
                    })}
                  />

                  <InfoItem
                    label="Total"
                    value={money(currentHeader?.Total)}
                    valueColor="#1976d2"
                  />

                  <InfoItem
                    label="Received"
                    value={money(currentHeader?.ReceivedAmount)}
                  />

                  <InfoItem
                    label="Balance"
                    value={money(
                      Math.max(
                        Number(currentHeader?.Total || 0) -
                          Number(currentHeader?.ReceivedAmount || 0),
                        0,
                      ),
                    )}
                    valueColor="red"
                  />
                </Box>
              </Paper>

              {/* =================================================
                  PREVIOUS HISTORY
              ================================================= */}

              <Paper
                elevation={0}
                sx={{
                  p: 3,

                  mb: 3,

                  borderRadius: 3,

                  border: "1px solid #ddd",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 26,

                    fontWeight: 800,

                    color: "#ed6c02",

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
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            background: "#eaf2f8",
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Version
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Invoice No
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Invoice Date
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Customer
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Total
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Received
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            View
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {[...historyHeader]
                          .sort(
                            (a, b) =>
                              Number(b?.VersionNo || 0) -
                              Number(a?.VersionNo || 0),
                          )
                          .map((item, index) => {
                            const version = Number(item?.VersionNo || 0);

                            const selected = selectedVersion === version;

                            return (
                              <TableRow
                                key={item?.Id || `${version}-${index}`}
                                sx={{
                                  backgroundColor: selected
                                    ? "#e3f2fd"
                                    : "inherit",
                                }}
                              >
                                <TableCell>
                                  <Button
                                    variant={
                                      selected ? "contained" : "outlined"
                                    }
                                    size="small"
                                    onClick={() => selectVersion(item)}
                                  >
                                    VERSION {version}
                                  </Button>
                                </TableCell>

                                <TableCell>{item?.InvoiceNo || "-"}</TableCell>

                                <TableCell>
                                  {formatDate(item?.InvoiceDate)}
                                </TableCell>

                                <TableCell>
                                  {getCustomerName({
                                    ...selectedInvoice,
                                    ...item,
                                  })}
                                </TableCell>

                                <TableCell>{money(item?.Total)}</TableCell>

                                <TableCell>
                                  {money(item?.ReceivedAmount)}
                                </TableCell>

                                <TableCell>
                                  <Button
                                    size="small"
                                    onClick={() => selectVersion(item)}
                                  >
                                    VIEW
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              {/* =================================================
                  OLD VS CURRENT
              ================================================= */}

              {selectedVersion && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,

                    mb: 3,

                    borderRadius: 3,

                    border: "1px solid #ddd",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 26,

                      fontWeight: 800,

                      color: "#7b1fa2",

                      mb: 2,
                    }}
                  >
                    Old vs Current Invoice
                  </Typography>

                  {(() => {
                    const oldHeader = historyHeader.find(
                      (item) =>
                        Number(item?.VersionNo) === Number(selectedVersion),
                    );

                    const oldBalance = Math.max(
                      Number(oldHeader?.Total || 0) -
                        Number(oldHeader?.ReceivedAmount || 0),
                      0,
                    );

                    const currentBalance = Math.max(
                      Number(currentHeader?.Total || 0) -
                        Number(currentHeader?.ReceivedAmount || 0),
                      0,
                    );

                    return (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                background: "#f3e5f5",
                              }}
                            >
                              <TableCell
                                sx={{
                                  fontWeight: 800,
                                }}
                              >
                                Field
                              </TableCell>

                              <TableCell
                                sx={{
                                  fontWeight: 800,
                                }}
                              >
                                Version {selectedVersion}
                              </TableCell>

                              <TableCell
                                sx={{
                                  fontWeight: 800,
                                }}
                              >
                                Current
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            <CompareRow
                              label="Invoice No"
                              oldValue={oldHeader?.InvoiceNo || "-"}
                              currentValue={currentHeader?.InvoiceNo || "-"}
                            />

                            <CompareRow
                              label="Invoice Date"
                              oldValue={formatDate(oldHeader?.InvoiceDate)}
                              currentValue={formatDate(
                                currentHeader?.InvoiceDate,
                              )}
                            />

                            <CompareRow
                              label="Customer"
                              oldValue={getCustomerName({
                                ...selectedInvoice,
                                ...oldHeader,
                              })}
                              currentValue={getCustomerName({
                                ...selectedInvoice,
                                ...currentHeader,
                              })}
                            />

                            <CompareRow
                              label="Total"
                              oldValue={money(oldHeader?.Total)}
                              currentValue={money(currentHeader?.Total)}
                            />

                            <CompareRow
                              label="Received"
                              oldValue={money(oldHeader?.ReceivedAmount)}
                              currentValue={money(
                                currentHeader?.ReceivedAmount,
                              )}
                            />

                            <CompareRow
                              label="Balance"
                              oldValue={money(oldBalance)}
                              currentValue={money(currentBalance)}
                            />
                          </TableBody>
                        </Table>
                      </TableContainer>
                    );
                  })()}
                </Paper>
              )}

              {/* =================================================
                  PREVIOUS PRODUCTS
              ================================================= */}

              {selectedVersion && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,

                    mb: 3,

                    borderRadius: 3,

                    border: "1px solid #ddd",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 24,

                      fontWeight: 800,

                      color: "#7b1fa2",

                      mb: 2,
                    }}
                  >
                    Previous Product Details — Version {selectedVersion}
                  </Typography>

                  {selectedVersionDetails.length === 0 ? (
                    <Typography color="text.secondary">
                      No product details found for this version.
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              background: "#f7f1f8",
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Product
                            </TableCell>

                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Quantity
                            </TableCell>

                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Rate
                            </TableCell>

                            <TableCell
                              sx={{
                                fontWeight: 800,
                              }}
                            >
                              Amount
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {selectedVersionDetails.map((detail, index) => (
                            <TableRow key={detail?.Id || index}>
                              <TableCell>{getProductName(detail)}</TableCell>

                              <TableCell>
                                {detail?.Quantity ?? detail?.Qty ?? "-"}
                              </TableCell>

                              <TableCell>{money(detail?.Rate)}</TableCell>

                              <TableCell>{money(detail?.Amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>
              )}

              {/* =================================================
                  CURRENT PRODUCTS
              ================================================= */}

              <Paper
                elevation={0}
                sx={{
                  p: 3,

                  borderRadius: 3,

                  border: "1px solid #ddd",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 24,

                    fontWeight: 800,

                    color: "#1976d2",

                    mb: 2,
                  }}
                >
                  Current Product Details
                </Typography>

                {currentDetails.length === 0 ? (
                  <Typography color="text.secondary">
                    No current product details found.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            background: "#e3f2fd",
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Product
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Quantity
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Rate
                          </TableCell>

                          <TableCell
                            sx={{
                              fontWeight: 800,
                            }}
                          >
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {currentDetails.map((detail, index) => (
                          <TableRow key={detail?.Id || index}>
                            <TableCell>{getProductName(detail)}</TableCell>

                            <TableCell>
                              {detail?.Quantity ?? detail?.Qty ?? "-"}
                            </TableCell>

                            <TableCell>{money(detail?.Rate)}</TableCell>

                            <TableCell>{money(detail?.Amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </>
          )}
        </DialogContent>

        {/* CLOSE */}

        <Box
          sx={{
            px: 3,

            py: 1.5,

            borderTop: "1px solid #ddd",

            display: "flex",

            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={closeHistory}
            sx={{
              textTransform: "none",

              fontWeight: 700,
            }}
          >
            CLOSE
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

// ============================================================
// SUMMARY CARD
// ============================================================

const SummaryCard = ({ title, value, icon }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,

        borderRadius: 4,

        border: "1px solid #e5e7eb",

        minHeight: 145,

        display: "flex",

        justifyContent: "space-between",

        alignItems: "flex-start",
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "#666",

            fontSize: 17,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 42,

            fontWeight: 800,

            mt: 1,
          }}
        >
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          color: "#aaa",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};

// ============================================================
// INFO ITEM
// ============================================================

const InfoItem = ({ label, value, valueColor }) => {
  return (
    <Box>
      <Typography
        sx={{
          color: "#666",

          fontSize: 15,

          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 18,

          fontWeight: 800,

          color: valueColor || "#222",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

// ============================================================
// COMPARE ROW
// ============================================================

const CompareRow = ({ label, oldValue, currentValue }) => {
  const changed = String(oldValue ?? "") !== String(currentValue ?? "");

  return (
    <TableRow>
      <TableCell
        sx={{
          fontWeight: 700,
        }}
      >
        {label}
      </TableCell>

      <TableCell
        sx={{
          background: changed ? "#fff3e0" : "transparent",

          fontWeight: changed ? 700 : 500,
        }}
      >
        {oldValue}
      </TableCell>

      <TableCell
        sx={{
          background: changed ? "#e8f5e9" : "transparent",

          fontWeight: changed ? 700 : 500,
        }}
      >
        {currentValue}
      </TableCell>
    </TableRow>
  );
};

export default InvoiceEditHistoryDashboard;
