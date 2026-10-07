import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState(null);

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
    const role = String(sessionStorage.getItem("UserRole") || "")
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

  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [rows, setRows] = useState([]);

  const [physicalQuantities, setPhysicalQuantities] = useState({});

  const fetchDailyStockComparison = async (selectedDate = date) => {
    try {
      // ======================================================
      // DATE FORMAT
      // ======================================================

      const formattedDate =
        selectedDate instanceof Date
          ? `${selectedDate.getFullYear()}-${String(
              selectedDate.getMonth() + 1,
            ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
              2,
              "0",
            )}`
          : String(selectedDate).slice(0, 10);

      console.log("======================================");

      console.log("FETCH DAILY STOCK COMPARISON");

      console.log("ENTRY DATE:", formattedDate);

      // ======================================================
      // API URL
      // ======================================================

      const apiUrl =
        `https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyStockComparison.php` +
        `?EntryDate=${encodeURIComponent(formattedDate)}` +
        `&ShopId=` +
        `&OfficeId=2`;

      console.log("COMPARISON API URL:", apiUrl);

      // ======================================================
      // API CALL
      // ======================================================

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      console.log("COMPARISON API RAW RESPONSE:", text);

      if (!response.ok) {
        throw new Error(
          `Daily Stock Comparison API failed: ${response.status}`,
        );
      }

      // ======================================================
      // PARSE RESPONSE
      // ======================================================

      let result;

      try {
        result = text ? JSON.parse(text) : [];
      } catch (error) {
        console.error("COMPARISON API JSON ERROR:", error);

        throw new Error("Invalid Daily Stock Comparison API response");
      }

      // ======================================================
      // NORMALIZE
      // ======================================================

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      // ======================================================
      // MAP API RESPONSE
      // ======================================================

      const mappedData = data.map((item) => ({
        ProductId: item?.ProductId ?? "",

        ProductCode: item?.ProductCode ?? "",

        ProductName: item?.ProductName ?? "",

        Sale: Number(item?.Sale || 0),

        DailyStock: Number(item?.DailyStock || 0),

        Difference: Number(item?.Difference || 0),
      }));

      console.log("FINAL DAILY STOCK COMPARISON:", mappedData);

      console.log("======================================");

      return mappedData;
    } catch (error) {
      console.error("DAILY STOCK COMPARISON ERROR:", error);

      toast.error(error?.message || "Unable to fetch Daily Stock Comparison");

      return [];
    }
  };

  // ==========================================================
  // SAVE / UPDATE DAILY STOCK ENTRY
  // ==========================================================

  const handleSave = async () => {
    console.log("======================================");
    console.log("HANDLE SAVE CALLED");
    console.log("======================================");

    // ==========================================================
    // DATE VALIDATION
    // ==========================================================

    if (!date) {
      toast.error("Please select Date");
      return;
    }

    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    const entryDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    console.log("ENTRY DATE:", entryDate);

    try {
      setSaving(true);

      // ==========================================================
      // PREPARE SELECTED PRODUCTS
      // ==========================================================

      const selectedRows = productOptions
        .map((product) => {
          const productId = String(product.value);

          const savedValue = productQuantities?.[productId];

          const physicalValue = physicalQuantities?.[productId];

          const quantity =
            physicalValue !== undefined && physicalValue !== ""
              ? Number(physicalValue)
              : savedValue && typeof savedValue === "object"
                ? Number(savedValue?.quantity || 0)
                : Number(savedValue || 0);

          const detailId =
            savedValue && typeof savedValue === "object"
              ? savedValue?.detailId || ""
              : "";

          const rate =
            savedValue &&
            typeof savedValue === "object" &&
            savedValue.rate !== undefined &&
            savedValue.rate !== ""
              ? Number(savedValue.rate)
              : Number(productRates?.[productId] ?? product.rate ?? 0);

          return {
            Id: detailId,

            ProductId: Number(product.value),

            ProductCode: product.productCode || "",

            ProductName: product.label || "",

            Quantity: quantity,

            Rate: rate,

            Amount: quantity * rate,
          };
        })
        .filter((row) => Number(row.Quantity || 0) > 0);

      console.log("FINAL SELECTED ROWS:", selectedRows);

      // ==========================================================
      // VALIDATION
      // ==========================================================

      if (selectedRows.length === 0) {
        toast.error("Please enter quantity for at least one product");

        setSaving(false);
        return;
      }

      // ==========================================================
      // TOTAL AMOUNT
      // ==========================================================

      const totalAmount = selectedRows.reduce(
        (sum, row) => sum + Number(row.Quantity || 0) * Number(row.Rate || 0),
        0,
      );

      console.log("TOTAL AMOUNT:", totalAmount);

      // ==========================================================
      // EDIT EXISTING ENTRY
      // ==========================================================

      if (editingEntry) {
        const headerId = editingEntry?.Id || editingEntry?.id;

        if (!headerId) {
          throw new Error("Stock Entry Header ID not found");
        }

        console.log("UPDATING HEADER:", headerId);

        // ========================================================
        // UPDATE HEADER
        // ========================================================

        await updateDailyStockHeader(headerId, entryDate, totalAmount);

        // ========================================================
        // UPDATE / INSERT DETAILS
        // ========================================================

        for (const row of selectedRows) {
          const detailId = row?.Id || row?.id || "";

          const quantity = Number(row?.Quantity || 0);

          const rate = Number(row?.Rate || 0);

          const amount = quantity * rate;

          const detailData = new URLSearchParams();

          if (detailId) {
            // ==============================================
            // UPDATE EXISTING DETAIL
            // ==============================================

            detailData.append("Id", String(Number(detailId)));

            detailData.append("DailyStockHeaderId", String(Number(headerId)));

            detailData.append("ProductId", String(Number(row.ProductId)));

            detailData.append("Quantity", String(quantity));

            detailData.append("Rate", String(rate));

            detailData.append("Amount", String(amount));

            detailData.append("UpdatedBy", String(CREATED_BY));

            const response = await fetch(
              "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyStockDetail.php",
              {
                method: "POST",

                headers: {
                  Accept: "application/json",

                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                },

                body: detailData.toString(),
              },
            );

            const text = await response.text();

            console.log("DETAIL UPDATE RESPONSE:", text);

            let result = {};

            try {
              result = text ? JSON.parse(text) : {};
            } catch {
              throw new Error(`Invalid Detail Update API response: ${text}`);
            }

            if (!response.ok || result?.success === false) {
              throw new Error(
                result?.message || "Daily Stock Detail update failed",
              );
            }
          } else {
            // ==============================================
            // INSERT NEW DETAIL
            // ==============================================

            detailData.append("DailyStockHeaderId", String(Number(headerId)));

            detailData.append("ProductId", String(Number(row.ProductId)));

            detailData.append("Quantity", String(quantity));

            detailData.append("Rate", String(rate));

            detailData.append("Amount", String(amount));

            detailData.append("CreatedBy", String(CREATED_BY));

            const response = await fetch(
              "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
              {
                method: "POST",

                headers: {
                  Accept: "application/json",

                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                },

                body: detailData.toString(),
              },
            );

            const text = await response.text();

            console.log("DETAIL INSERT RESPONSE:", text);

            let result = {};

            try {
              result = text ? JSON.parse(text) : {};
            } catch {
              throw new Error(`Invalid Detail Insert API response: ${text}`);
            }

            if (!response.ok || result?.success === false) {
              throw new Error(
                result?.message || "Daily Stock Detail insert failed",
              );
            }
          }
        }

        toast.success("Daily Stock Entry updated successfully!");
      } else {
        // ========================================================
        // NEW HEADER
        // ========================================================

        const headerData = new URLSearchParams();

        headerData.append("EntryDate", entryDate);

        headerData.append("ShopId", String(STOCK_ENTRY_SHOP_ID));

        headerData.append("OfficeId", "");

        headerData.append("TotalAmount", String(Number(totalAmount || 0)));

        headerData.append("CreatedBy", String(CREATED_BY));

        console.log(
          "HEADER PAYLOAD:",
          Object.fromEntries(headerData.entries()),
        );

        // ========================================================
        // SAVE HEADER
        // ========================================================

        const headerResponse = await fetch(
          "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockHeader.php",
          {
            method: "POST",

            mode: "cors",

            credentials: "omit",

            headers: {
              Accept: "application/json",

              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },

            body: headerData.toString(),
          },
        );

        const headerText = await headerResponse.text();

        console.log("HEADER RESPONSE:", headerText);

        let headerResult = {};

        try {
          headerResult = headerText ? JSON.parse(headerText) : {};
        } catch {
          throw new Error(`Invalid Header API response: ${headerText}`);
        }

        if (!headerResponse.ok || !headerResult?.success) {
          throw new Error(
            headerResult?.message || "Daily Stock Header save failed",
          );
        }

        // ========================================================
        // GET CREATED HEADER ID
        // ========================================================

        const headerId =
          headerResult?.Id ??
          headerResult?.id ??
          headerResult?.insert_id ??
          headerResult?.DailyStockHeaderId ??
          headerResult?.data?.Id ??
          headerResult?.data?.id;

        if (!headerId) {
          throw new Error("Header created but Header ID was not returned.");
        }

        console.log("CREATED HEADER ID:", headerId);

        // ========================================================
        // SAVE DETAILS
        // ========================================================

        for (const row of selectedRows) {
          const detailData = new URLSearchParams();

          detailData.append("DailyStockHeaderId", String(Number(headerId)));

          detailData.append("ProductId", String(Number(row.ProductId)));

          detailData.append("Quantity", String(Number(row.Quantity || 0)));

          detailData.append("Rate", String(Number(row.Rate || 0)));

          detailData.append("Amount", String(Number(row.Amount || 0)));

          detailData.append("CreatedBy", String(CREATED_BY));

          const detailResponse = await fetch(
            "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyStockDetail.php",
            {
              method: "POST",

              headers: {
                Accept: "application/json",

                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },

              body: detailData.toString(),
            },
          );

          const detailText = await detailResponse.text();

          console.log("DETAIL RESPONSE:", detailText);

          let detailResult = {};

          try {
            detailResult = detailText ? JSON.parse(detailText) : {};
          } catch {
            throw new Error(`Invalid Detail API response: ${detailText}`);
          }

          if (!detailResponse.ok || detailResult?.success === false) {
            throw new Error(
              detailResult?.message || "Daily Stock Detail save failed",
            );
          }
        }

        toast.success("Daily Stock Entry saved successfully!");
      }

      // ==========================================================
      // REFRESH MAIN TABLE
      // ==========================================================

      // ==========================================================
      // REFRESH MAIN TABLE
      // ==========================================================

      await fetchDailyStockHeaders();

      // ==========================================================
      // BACKEND DAILY STOCK COMPARISON
      // ==========================================================
      //
      // IMPORTANT:
      // Frontend calculation करू नका.
      //
      // Backend API स्वतः calculate करेल:
      //
      // Previous Daily Stock
      //          -
      // Today's Sales
      //          =
      // Expected Stock
      //
      // Expected Stock
      //          -
      // Today's Actual Daily Stock
      //          =
      // Difference
      //
      // Example:
      // Previous Stock = 3
      // Sale           = 1
      // Daily Stock    = 1
      //
      // Expected = 3 - 1 = 2
      // Difference = 2 - 1 = 1
      //
      // ==========================================================

      try {
        const comparisonData = await fetchDailyStockComparison(entryDate);

        console.log("======================================");

        console.log("DAILY STOCK COMPARISON API RESULT:", comparisonData);

        console.log("======================================");

        // ========================================================
        // SET COMPARISON DATA
        // ========================================================

        setComparisonRows(Array.isArray(comparisonData) ? comparisonData : []);

        // ========================================================
        // OPEN COMPARISON POPUP
        // ========================================================

        setOpenComparisonPopup(true);
      } catch (comparisonError) {
        console.error("DAILY STOCK COMPARISON API ERROR:", comparisonError);

        // IMPORTANT:
        // Stock already saved successfully.
        // Therefore comparison error should NOT
        // show "Unable to save Daily Stock Entry".

        toast.warning(
          "Daily Stock saved successfully, but comparison could not be loaded.",
        );
      }

      // ==========================================================
      // CLOSE ENTRY FORM
      // ==========================================================

      setOpenForm(false);

      // ==========================================================
      // RESET FORM
      // ==========================================================

      resetForm();

      // ==========================================================
      // RESET PAGE
      // ==========================================================

      setPageNo(1);
    } catch (error) {
      console.error("DAILY STOCK SAVE ERROR:", error);

      toast.error(error?.message || "Unable to save Daily Stock Entry");
    } finally {
      setSaving(false);
    }
  };

  const handlePhysicalQuantityChange = (productId, value) => {
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
      const productCode = String(product?.productCode ?? "").toLowerCase();

      const productName = String(product?.label ?? "").toLowerCase();

      return productCode.includes(search) || productName.includes(search);
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
      (product) => String(product.value) === String(currentProductId),
    );

    if (currentIndex === -1) {
      return;
    }

    const nextProduct = filteredProductOptions[currentIndex + 1];

    // No next row
    if (!nextProduct) {
      return;
    }

    const nextInput = quantityInputRefs.current[String(nextProduct.value)];

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

    const savedValue = productQuantities?.[productId];

    let savedQuantity = "";
    let savedRate = Number(newValue.rate || 0);

    // Existing saved product
    if (savedValue && typeof savedValue === "object") {
      savedQuantity = savedValue?.quantity ?? "";

      if (savedValue?.rate !== undefined && savedValue?.rate !== "") {
        savedRate = Number(savedValue.rate);
      }
    } else if (
      savedValue !== undefined &&
      savedValue !== null &&
      savedValue !== ""
    ) {
      savedQuantity = savedValue;
    }

    setProductQuantity(savedQuantity === "" ? "" : String(savedQuantity));

    setProductRate(savedRate === 0 ? "" : String(savedRate));
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

    const productId = String(selectedProduct.value);

    setProductQuantities((previous) => ({
      ...previous,

      [productId]: {
        ...(previous[productId] || {}),

        quantity: value === "" ? "" : Number(value),

        rate: previous[productId]?.rate ?? Number(selectedProduct.rate || 0),

        detailId: previous[productId]?.detailId || "",
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

    const productId = String(selectedProduct.value);

    setProductQuantities((previous) => ({
      ...previous,

      [productId]: {
        ...(previous[productId] || {}),

        quantity: previous[productId]?.quantity ?? Number(productQuantity || 0),

        rate: value === "" ? "" : Number(value),

        detailId: previous[productId]?.detailId || "",
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
            item?.LocationType ?? item?.locationType ?? "",
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
              0,
          );

          // ========================================================
          // LOCATION TYPE
          // ========================================================
          const locationType = String(
            item?.LocationType ?? item?.locationType ?? "S",
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
            dateText: entryDate ? formatDate(entryDate) : "",

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

      console.log("==========================================");
      console.log("DAILY STOCK SHOP MAPPED DATA");
      console.log("==========================================");
      console.log("TOTAL SHOP RECORDS:", mappedData.length);
      console.log("MAPPED DAILY STOCK SHOP RECORDS:", mappedData);

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
        Id: Number(item?.Id ?? item?.id ?? 0),

        DailyStockHeaderId: Number(
          item?.DailyStockHeaderId ?? item?.dailyStockHeaderId ?? headerId ?? 0,
        ),

        ProductId: Number(
          item?.ProductId ??
            item?.ProductID ??
            item?.productId ??
            item?.productID ??
            item?.product_id ??
            0,
        ),

        Quantity: Number(
          item?.Quantity ?? item?.quantity ?? item?.Qty ?? item?.qty ?? 0,
        ),

        Rate: Number(
          item?.Rate ?? item?.rate ?? item?.Price ?? item?.price ?? 0,
        ),

        Amount: Number(item?.Amount ?? item?.amount ?? 0),
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
      } catch (error) {
        console.error("ERROR LOADING DAILY STOCK DATA:", error);
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
          ...(existing && typeof existing === "object" ? existing : {}),
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
      const headerId = entry?.Id ?? entry?.id ?? entry?.DailyStockHeaderId;

      if (!headerId) {
        toast.error("Stock Entry Shop Header ID not found");
        return;
      }

      console.log("EDIT HEADER ID:", headerId);

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
      const entryDate = entry?.EntryDate ?? entry?.entryDate ?? entry?.date;

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
      const details = await fetchDailyStockDetail(headerId);

      console.log("EDIT DAILY STOCK DETAILS:", details);

      if (!Array.isArray(details)) {
        console.error("Invalid detail response:", details);

        toast.error("Daily Stock details not found");

        return;
      }

      // --------------------------------------------------
      // CREATE PRODUCT QUANTITY MAP
      // --------------------------------------------------
      const quantityMap = {};

      details.forEach((item) => {
        const productId = item?.ProductId ?? item?.productId;

        if (
          productId === null ||
          productId === undefined ||
          String(productId).trim() === ""
        ) {
          return;
        }

        const detailId = item?.Id ?? item?.id ?? item?.DailyStockDetailId ?? "";

        const quantity = Number(item?.Quantity ?? item?.quantity ?? 0);

        const rate = Number(item?.Rate ?? item?.rate ?? 0);

        quantityMap[String(productId)] = {
          quantity: quantity,
          rate: rate,
          detailId: detailId,
        };
      });

      console.log("EDIT PRODUCT QUANTITY MAP:", quantityMap);

      // --------------------------------------------------
      // SET EXISTING DATA
      // --------------------------------------------------
      setProductQuantities(quantityMap);

      // ==========================================================
      // ALSO SET PHYSICAL QUANTITIES FOR EDIT MODE
      // ==========================================================
      const physicalMap = {};

      Object.keys(quantityMap).forEach((productId) => {
        physicalMap[productId] = quantityMap[productId]?.quantity ?? "";
      });

      setPhysicalQuantities(physicalMap);

      // --------------------------------------------------
      // ALSO UPDATE PRODUCT MASTER RATE
      // --------------------------------------------------
      setProductOptions((previousProducts) =>
        previousProducts.map((product) => {
          const saved = quantityMap[String(product.value)];

          if (!saved) {
            return product;
          }

          return {
            ...product,
            rate: saved.rate !== undefined ? saved.rate : product.rate,
          };
        }),
      );
    } catch (error) {
      console.error("EDIT STOCK ENTRY SHOP ERROR:", error);

      toast.error(error?.message || "Unable to load Stock Entry Shop");
    }
  };

  // const handleDeleteEntry = (id) => {
  //   setStockEntries((previousEntries) =>
  //     previousEntries.filter((item) => item.id !== id),
  //   );

  //   toast.success("Entry removed successfully");
  // };

  const handleDeleteEntry = async (id) => {
    // ========================================================
    // CHECK ID
    // ========================================================
    if (!id) {
      toast.error("Stock Entry ID not found");
      return;
    }

    try {
      setSaving(true);

      // ========================================================
      // DELETE HEADER
      // ========================================================

      const deleteUrl =
        `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php` +
        `?Table=dailystockheader&Id=${encodeURIComponent(id)}`;

      console.log("======================================");

      console.log("DELETE STOCK ENTRY SHOP");

      console.log("DELETE URL:", deleteUrl);

      console.log("HEADER ID:", id);

      console.log("======================================");

      const response = await fetch(deleteUrl, {
        method: "GET",
        redirect: "follow",
      });

      const resultText = await response.text();

      console.log("DELETE API STATUS:", response.status);

      console.log("DELETE API RESPONSE:", resultText);

      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (!response.ok) {
        throw new Error(`Delete API failed: ${response.status}`);
      }

      // ========================================================
      // REMOVE FROM UI
      // ========================================================

      setStockEntries((previousEntries) =>
        previousEntries.filter(
          (item) =>
            Number(item?.id) !== Number(id) && Number(item?.Id) !== Number(id),
        ),
      );

      // ========================================================
      // SUCCESS
      // ========================================================

      toast.success("Stock Entry Shop deleted successfully!");
    } catch (error) {
      console.error("DELETE STOCK ENTRY SHOP ERROR:", error);

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
                onClick={() => {
                  setDeleteEntryId(row.original.id);
                  setDeleteDialogOpen(true);
                }}
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

        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeleteEntryId(null);
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              color: "#d32f2f",
            }}
          >
            Delete Stock Entry
          </DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to delete this Stock Entry?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteEntryId(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                const id = deleteEntryId;

                setDeleteDialogOpen(false);
                setDeleteEntryId(null);

                await handleDeleteEntry(id);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
              <Typography fontWeight={600} mb={0.5} fontSize="14px">
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
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        Loading Products...
                      </TableCell>
                    </TableRow>
                  ) : filteredProductOptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        No Products Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProductOptions.map((product) => {
                      const savedValue =
                        productQuantities[String(product.value)];

                      // ================================
                      // DEFAULT QUANTITY = 0
                      // ================================
                      const quantity =
                        savedValue && typeof savedValue === "object"
                          ? (savedValue?.quantity ?? 0)
                          : (savedValue ?? 0);

                      // ================================
                      // CURRENT RATE
                      // ================================
                      const rate =
                        productRates[String(product.value)] ??
                        Number(product.rate || 0);

                      return (
                        <TableRow key={String(product.value)} hover>
                          {/* PRODUCT CODE */}
                          <TableCell>{product.productCode || "-"}</TableCell>

                          {/* PRODUCT NAME */}
                          <TableCell>{product.label || "-"}</TableCell>

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
                                  e.target.value,
                                );
                              }}
                              onKeyDown={(e) => {
                                handleQuantityKeyDown(e, product.value);
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
                                const value = e.target.value;

                                setProductRates((prev) => ({
                                  ...prev,

                                  [String(product.value)]:
                                    value === "" ? 0 : Number(value),
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

            <IconButton onClick={() => setOpenReport(false)}>
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
                    <TableCell sx={{ fontWeight: 700 }}>Product Code</TableCell>

                    <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>

                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Sale
                    </TableCell>

                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Daily Stock
                    </TableCell>

                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Difference
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {productOptions.map((product) => {
                    const productId = String(product.value);

                    const savedValue = productQuantities?.[productId];

                    const quantity =
                      typeof savedValue === "object"
                        ? (savedValue?.quantity ?? "")
                        : (savedValue ?? "");

                    const rate =
                      product.rate ?? product.SaleRate ?? product.Price ?? "";

                    return (
                      <TableRow key={productId} hover>
                        <TableCell>{product.productCode || "-"}</TableCell>

                        <TableCell>{product.label || "-"}</TableCell>

                        <TableCell align="center">
                          <TextField
                            size="small"
                            type="number"
                            value={quantity}
                            placeholder="Enter Qty"
                            onChange={(e) => {
                              handleProductQuantityChange(
                                product.value,
                                e.target.value,
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
                              const value = e.target.value;

                              setProductOptions((prevProducts) =>
                                prevProducts.map((item) =>
                                  String(item.value) === productId
                                    ? {
                                        ...item,
                                        rate: value === "" ? "" : Number(value),
                                      }
                                    : item,
                                ),
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
                      <TableCell colSpan={5} align="center">
                        No comparison data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    comparisonRows.map((row) => (
                      <TableRow key={String(row.ProductId)}>
                        {/* PRODUCT CODE */}
                        <TableCell>{row.ProductCode || "-"}</TableCell>

                        {/* PRODUCT NAME */}
                        <TableCell>{row.ProductName || "-"}</TableCell>

                        {/* SALE */}
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {Number(row.Sale || 0)}
                        </TableCell>

                        {/* DAILY STOCK */}
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {Number(row.DailyStock || 0)}
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
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setOpenComparisonPopup(false);
              }}
              sx={{
                textTransform: "none",
                backgroundColor: "var(--primary-color)",

                "&:hover": {
                  backgroundColor: "var(--primary-color)",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default EntryShop;
