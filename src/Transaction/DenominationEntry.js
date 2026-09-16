import React, { useEffect, useMemo, useState } from "react";

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

// ============================================================
// API URLS
// ============================================================

const POST_DENOMINATION_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/postDailyDenomination.php";

const GET_DENOMINATION_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/get/getDailyDenomination.php";

const UPDATE_DENOMINATION_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/updateDailyDenomination.php";

const DELETE_TABLE_API =
  "https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php";

// ============================================================
// DEFAULT BRANCH / USER
// ============================================================

const BRANCH_ID = 1;
const USER_ID = 1;

// ============================================================
// COMPONENT
// ============================================================

const DenominationEntry = () => {
  // ==========================================================
  // MAIN TABLE DATA
  // ==========================================================

  const [entries, setEntries] = useState([]);

  // ==========================================================
  // FORM
  // ==========================================================

  const [openForm, setOpenForm] = useState(false);

  const [saving, setSaving] = useState(false);

  // ==========================================================
  // ENTRY NUMBER
  // ==========================================================

  const [entryNo, setEntryNo] = useState("");

  // ==========================================================
  // ENTRY DATE
  // ==========================================================

  const [entryDate, setEntryDate] = useState(new Date());

  // ==========================================================
  // PAGE NUMBER
  // ==========================================================

  const [pageNo, setPageNo] = useState(1);

  // ==========================================================
  // DENOMINATION MASTER
  // ==========================================================

  const denominationValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

  // ==========================================================
  // DENOMINATION ROWS
  // ==========================================================

  const [denominationRows, setDenominationRows] = useState([]);

  // ==========================================================
  // CREATE EMPTY ROWS
  // ==========================================================

  const createEmptyRows = () => {
    return denominationValues.map((value) => ({
      denomination: value,
      quantity: "",
      amount: 0,
    }));
  };

  // ==========================================================
  // FORMAT DENOMINATION
  // ==========================================================

  const formatDenomination = (value) => {
    if (value === 0.5) {
      return "0.50";
    }

    return String(value);
  };

  // ==========================================================
  // FORMAT DATE FOR DISPLAY
  // ==========================================================

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const d = new Date(value);

    if (isNaN(d.getTime())) {
      return "";
    }

    const day = String(d.getDate()).padStart(2, "0");

    const month = String(d.getMonth() + 1).padStart(2, "0");

    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // ==========================================================
  // FORMAT DATE FOR API
  // ==========================================================

  const formatApiDate = (value) => {
    if (!value) {
      return "";
    }

    const d = new Date(value);

    if (isNaN(d.getTime())) {
      return "";
    }

    const year = d.getFullYear();

    const month = String(d.getMonth() + 1).padStart(2, "0");

    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setEntryNo("");

    setEntryDate(new Date());

    setDenominationRows(createEmptyRows());
  };

  // ==========================================================
  // GET DENOMINATION DATA
  // ==========================================================

  const fetchDenominationEntries = async () => {
    try {
      console.log("GET DENOMINATION API CALL");

      const url = `${GET_DENOMINATION_API}?Id=&BranchId=${BRANCH_ID}`;

      console.log("GET URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GET API failed with status ${response.status}`);
      }

      const result = await response.json();

      console.log("GET DENOMINATION RESPONSE:", result);

      if (!result.success) {
        throw new Error(
          result.message || "Unable to load denomination entries",
        );
      }

      if (!Array.isArray(result.data)) {
        setEntries([]);
        return;
      }

      // ------------------------------------------------------
      // CONVERT API RESPONSE TO TABLE DATA
      // ------------------------------------------------------

      // ------------------------------------------------------
      // GROUP API DATA BY ENTRY NO
      // ------------------------------------------------------

      const groupedEntries = {};

      result.data.forEach((item) => {
        const entryNo = item.EntryNo;

        if (!groupedEntries[entryNo]) {
          groupedEntries[entryNo] = {
            id: item.Id,
            apiId: item.Id,

            branchId: item.BranchId,

            entryNo: item.EntryNo,

            entryDate: item.EntryDate,

            entryDateText: formatDate(item.EntryDate),

            total: 0,

            denominations: [],

            active: Number(item.Active || 0),

            createdBy: item.CreatedBy,

            updatedBy: item.UpdatedBy,

            updatedCount: item.UpdatedCount,
          };
        }

        // Calculate denomination amount
        const amount = Number(item.Amount || 0);

        // Add amount to Entry total
        groupedEntries[entryNo].total += amount;

        // Store denomination details
        groupedEntries[entryNo].denominations.push({
          id: item.Id,

          notes: Number(item.Notes || 0),

          numbers: Number(item.Numbers || 0),

          amount: amount,
        });
      });

      // Convert object to array
      const formattedEntries = Object.values(groupedEntries);

      console.log("GROUPED DENOMINATION ENTRIES:", formattedEntries);

      setEntries(formattedEntries);

      // ------------------------------------------------------
      // PAGE NUMBER
      // ------------------------------------------------------

      const calculatedPages =
        formattedEntries.length === 0
          ? 0
          : Math.ceil(formattedEntries.length / 10);

      if (calculatedPages === 0) {
        setPageNo(1);
      } else if (pageNo > calculatedPages) {
        setPageNo(calculatedPages);
      }
    } catch (error) {
      console.error("GET DENOMINATION ERROR:", error);

      toast.error("Unable to load Denomination Entries");
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    setDenominationRows(createEmptyRows());

    fetchDenominationEntries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  // QUANTITY CHANGE
  // ==========================================================

  const handleQuantityChange = (index, value) => {
    // --------------------------------------------------------
    // EMPTY VALUE
    // --------------------------------------------------------

    if (value === "") {
      setDenominationRows((previousRows) =>
        previousRows.map((row, rowIndex) => {
          if (rowIndex === index) {
            return {
              ...row,

              quantity: "",

              amount: 0,
            };
          }

          return row;
        }),
      );

      return;
    }

    // --------------------------------------------------------
    // ONLY INTEGER
    // --------------------------------------------------------

    if (!/^\d+$/.test(value)) {
      return;
    }

    const quantity = Number(value);

    // --------------------------------------------------------
    // CALCULATE AMOUNT
    // --------------------------------------------------------

    setDenominationRows((previousRows) =>
      previousRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          const amount = row.denomination * quantity;

          return {
            ...row,

            quantity: value,

            amount: amount,
          };
        }

        return row;
      }),
    );
  };

  // ==========================================================
  // TOTAL
  // ==========================================================

  const total = useMemo(() => {
    return denominationRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0,
    );
  }, [denominationRows]);

  // ==========================================================
  // CREATE API
  // ==========================================================

  // ==========================================================
  // CREATE DENOMINATION API
  // ==========================================================

  // ==========================================================
  // UPDATE API
  // ==========================================================

  const updateDenomination = async ({
    id,
    branchId,
    date,
    notes,
    numbers,
    amount,
    updatedBy,
  }) => {
    const formData = new FormData();

    formData.append("Id", String(id));

    formData.append("BranchId", String(branchId || BRANCH_ID));

    formData.append("EntryDate", formatApiDate(date));

    formData.append("Notes", String(Number(notes || 0)));

    formData.append("Numbers", String(Number(numbers || 0)));

    formData.append("Amount", Number(amount || 0).toFixed(2));

    formData.append("UpdatedBy", String(updatedBy || USER_ID));

    console.log("UPDATE DENOMINATION DATA:", {
      Id: id,

      BranchId: branchId || BRANCH_ID,

      EntryDate: formatApiDate(date),

      Notes: Number(notes || 0),

      Numbers: Number(numbers || 0),

      Amount: Number(amount || 0).toFixed(2),

      UpdatedBy: updatedBy || USER_ID,
    });

    const response = await fetch(UPDATE_DENOMINATION_API, {
      method: "POST",

      body: formData,
    });

    const result = await response.json();

    console.log("UPDATE DENOMINATION RESPONSE:", result);

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to update denomination");
    }

    return result;
  };

  // ==========================================================
  // CREATE DENOMINATION API
  // ==========================================================

  const createDenomination = async ({
    entryNo,
    entryDate,
    denomination,
    quantity,
    amount,
    branchId,
    createdBy,
  }) => {
    try {
      // ------------------------------------------------------
      // Convert values
      // ------------------------------------------------------

      const notes = Number(denomination || 0);

      const numbers = Number(quantity || 0);

      const totalAmount = Number(amount || notes * numbers);

      // ------------------------------------------------------
      // Create FormData
      // ------------------------------------------------------

      const formData = new FormData();

      // ------------------------------------------------------
      // API FIELDS
      // ------------------------------------------------------

      formData.append("BranchId", String(branchId || BRANCH_ID));

      formData.append("EntryDate", formatApiDate(entryDate));

      formData.append("Notes", String(notes));

      formData.append("Numbers", String(numbers));

      formData.append("Amount", totalAmount.toFixed(2));

      formData.append("CreatedBy", String(createdBy || USER_ID));

      // ------------------------------------------------------
      // EntryNo
      // ------------------------------------------------------

      if (
        entryNo !== undefined &&
        entryNo !== null &&
        String(entryNo).trim() !== ""
      ) {
        formData.append("EntryNo", String(entryNo).trim());
      }

      // ------------------------------------------------------
      // DEBUG
      // ------------------------------------------------------

      console.log("=================================");

      console.log("CREATE DENOMINATION API DATA");

      console.log("BranchId:", branchId || BRANCH_ID);

      console.log("EntryNo:", entryNo);

      console.log("EntryDate:", formatApiDate(entryDate));

      console.log("Notes:", notes);

      console.log("Numbers:", numbers);

      console.log("Amount:", totalAmount.toFixed(2));

      console.log("CreatedBy:", createdBy || USER_ID);

      console.log("=================================");

      // ------------------------------------------------------
      // CALL POST API
      // ------------------------------------------------------

      const response = await fetch(POST_DENOMINATION_API, {
        method: "POST",
        body: formData,
      });

      // ------------------------------------------------------
      // READ RESPONSE
      // ------------------------------------------------------

      const result = await response.json();

      console.log("CREATE DENOMINATION RESPONSE:", result);

      // ------------------------------------------------------
      // CHECK ERROR
      // ------------------------------------------------------

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to create denomination");
      }

      // ------------------------------------------------------
      // RETURN RESPONSE
      // ------------------------------------------------------

      return result;
    } catch (error) {
      console.error("CREATE DENOMINATION ERROR:", error);

      throw error;
    }
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSave = async () => {
    // ==========================================================
    // ENTRY NO VALIDATION
    // ==========================================================

    if (!entryNo || !entryNo.trim()) {
      toast.error("Please enter Entry No");
      return;
    }

    // ==========================================================
    // DATE VALIDATION
    // ==========================================================

    if (!entryDate) {
      toast.error("Please select Entry Date");
      return;
    }

    // ==========================================================
    // GET ONLY ENTERED DENOMINATIONS
    // ==========================================================

    const rowsToSave = denominationRows.filter(
      (row) => Number(row.quantity || 0) > 0,
    );

    // ==========================================================
    // QUANTITY VALIDATION
    // ==========================================================

    if (rowsToSave.length === 0) {
      toast.error("Please enter at least one denomination quantity");

      return;
    }

    try {
      setSaving(true);

      console.log("ROWS TO SAVE:", rowsToSave);
      // ========================================================
      // CALCULATE TOTAL
      // ========================================================

      const calculatedTotal = rowsToSave.reduce((sum, row) => {
        const denomination = Number(row.denomination || 0);

        const quantity = Number(row.quantity || 0);

        return sum + denomination * quantity;
      }, 0);

      console.log("TOTAL:", calculatedTotal);

      // ========================================================
      // SAVE ALL DENOMINATIONS
      // ========================================================

      for (const row of rowsToSave) {
        await createDenomination({
          entryNo: entryNo.trim(),
          entryDate: entryDate,
          denomination: row.denomination,
          quantity: row.quantity,
          amount: row.amount,
          branchId: BRANCH_ID,
          createdBy: USER_ID,
        });
      }

      // ========================================================
      // REFRESH GET API
      // ========================================================

      await fetchDenominationEntries();

      // ========================================================
      // SUCCESS
      // ========================================================

      toast.success("Denomination Entry saved successfully!");

      // ========================================================
      // CLOSE FORM
      // ========================================================

      setOpenForm(false);

      // ========================================================
      // RESET
      // ========================================================

      resetForm();
    } catch (error) {
      console.error("Denomination Save Error:", error);

      toast.error(error.message || "Unable to save Denomination Entry");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE DENOMINATION
  // ==========================================================

  const handleDeleteEntry = async (rowId) => {
    // --------------------------------------------------------
    // 1. CHECK ID
    // --------------------------------------------------------

    if (!rowId) {
      toast.error("Invalid record Id");
      return;
    }

    // --------------------------------------------------------
    // 2. CONFIRM DELETE
    // --------------------------------------------------------

    const confirmed = window.confirm(
      "Are you sure you want to delete this denomination entry?",
    );

    if (!confirmed) {
      return;
    }

    // --------------------------------------------------------
    // 3. CREATE DELETE API URL
    // --------------------------------------------------------

    const url = `${DELETE_TABLE_API}?Table=DailyDenomination&Id=${rowId}`;

    console.log("=================================");
    console.log("DELETE DENOMINATION");
    console.log("Row ID:", rowId);
    console.log("Delete API URL:", url);
    console.log("=================================");

    try {
      // ------------------------------------------------------
      // 4. CALL DELETE API
      // IMPORTANT:
      // Your working ProductMaster code uses GET
      // ------------------------------------------------------

      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
      });

      // ------------------------------------------------------
      // 5. READ RESPONSE
      // ------------------------------------------------------

      const result = await response.text();

      console.log("DELETE API STATUS:", response.status);

      console.log("DELETE API RESPONSE:", result);

      // ------------------------------------------------------
      // 6. CHECK DATABASE / BACKEND ERROR
      // ------------------------------------------------------

      if (
        result.includes("Connection could not be established") ||
        result.includes("Login failed") ||
        result.includes("SQLSTATE") ||
        result.includes('"error"')
      ) {
        toast.error("Delete failed. Database connection problem.");

        return;
      }

      // ------------------------------------------------------
      // 7. CHECK HTTP ERROR
      // ------------------------------------------------------

      if (!response.ok) {
        toast.error("Denomination delete failed.");

        return;
      }

      // ------------------------------------------------------
      // 8. SUCCESS
      // ------------------------------------------------------

      toast.success("Denomination deleted successfully!");

      // ------------------------------------------------------
      // 9. REFRESH TABLE
      // ------------------------------------------------------

      await fetchDenominationEntries();
    } catch (error) {
      console.error("DELETE DENOMINATION ERROR:", error);

      toast.error("Denomination delete failed.");
    }
  };

  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

  const totalPages = entries.length === 0 ? 0 : Math.ceil(entries.length / 10);

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = useMemo(
    () => [
      // ------------------------------------------------------
      // SR NO
      // ------------------------------------------------------

      {
        accessorKey: "srNo",

        header: "Sr.No",

        size: 80,

        Cell: ({ row }) => {
          const index = entries.findIndex(
            (item) => item.id === row.original.id,
          );

          return index + 1;
        },
      },

      // ------------------------------------------------------
      // ENTRY NO
      // ------------------------------------------------------

      {
        accessorKey: "entryNo",

        header: "Entry No",

        size: 150,
      },

      // ------------------------------------------------------
      // ENTRY DATE
      // ------------------------------------------------------

      {
        accessorKey: "entryDateText",

        header: "Entry Date",

        size: 160,
      },

      // ------------------------------------------------------
      // TOTAL
      // ------------------------------------------------------

      {
        accessorKey: "total",

        header: "Total",

        size: 150,

        Cell: ({ cell }) => (
          <span>₹ {Number(cell.getValue() || 0).toFixed(2)}</span>
        ),
      },

      // ------------------------------------------------------
      // ACTIONS
      // ------------------------------------------------------

      {
        header: "Actions",

        size: 150,

        enableSorting: false,

        enableColumnFilter: false,

        Cell: ({ row }) => (
          <Box display="flex" justifyContent="center">
            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteEntry(row.original.apiId)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [entries],
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
        {/* ==================================================
            PAGE TITLE
        ================================================== */}

        <Box textAlign="center" mb={5}>
          <Typography color="var(--complementary-color)" variant="h4">
            <b>Denomination Entry</b>
          </Typography>
        </Box>

        {/* ==================================================
            MAIN TABLE
        ================================================== */}

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
              CREATE DENOMINATION ENTRY
            </Button>
          </Box>

          {/* ==================================================
              MATERIAL REACT TABLE
          ================================================== */}

          <MaterialReactTable
            columns={columns}
            data={entries}
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
            DENOMINATION FORM
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
              HEADER
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
              Denomination Entry
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
              CONTENT
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
                ENTRY NO + DATE
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
              {/* ENTRY NO */}

              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Entry No:
                </Typography>

                <TextField
                  size="small"
                  value={entryNo}
                  onChange={(e) => setEntryNo(e.target.value)}
                  placeholder="Enter Entry No"
                  fullWidth
                />
              </Box>

              {/* ENTRY DATE */}

              <Box>
                <Typography fontWeight={600} mb={0.5} fontSize="14px">
                  Entry Date:
                </Typography>

                <DatePicker
                  value={entryDate}
                  onChange={(newValue) => setEntryDate(newValue)}
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

            {/* =================================================
                DENOMINATION TITLE
            ================================================= */}

            <Typography fontWeight={700} fontSize="15px" mb={1}>
              Denominations:
            </Typography>

            {/* =================================================
                DENOMINATION TABLE
            ================================================= */}

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #d0d0d0",

                overflowX: "auto",
              }}
            >
              <Table
                size="small"
                sx={{
                  minWidth: 600,

                  "& .MuiTableCell-root": {
                    border: "1px solid #d0d0d0",

                    py: 0.8,

                    px: 1,

                    fontSize: "13px",
                  },
                }}
              >
                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#e9ecef",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Notes
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Number / Quantity
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>
                  {denominationRows.map((row, index) => (
                    <TableRow hover key={row.denomination}>
                      {/* NOTE */}

                      <TableCell>
                        <Typography fontWeight={600}>
                          ₹ {formatDenomination(row.denomination)}
                        </Typography>
                      </TableCell>

                      {/* QUANTITY */}

                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={row.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          placeholder="Enter Number"
                          inputProps={{
                            min: 0,

                            step: 1,
                          }}
                          sx={{
                            width: 150,
                          }}
                        />
                      </TableCell>

                      {/* AMOUNT */}

                      <TableCell align="right">
                        <TextField
                          size="small"
                          value={Number(row.amount || 0).toFixed(2)}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            width: 160,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
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
            >
              <Typography fontWeight={700} fontSize="14px">
                Total:
              </Typography>

              <TextField
                size="small"
                value={Number(total).toFixed(2)}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  width: 160,
                }}
              />
            </Box>
          </DialogContent>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <DialogActions
            sx={{
              justifyContent: "flex-start",

              px: 2,

              py: 1.2,

              gap: 1,
            }}
          >
            {/* SAVE */}

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

            {/* CANCEL */}

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
      </Box>
    </LocalizationProvider>
  );
};

export default DenominationEntry;
