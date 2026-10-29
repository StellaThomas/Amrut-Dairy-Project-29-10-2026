
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { toast } from "react-toastify";

const StockTransferApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("Pending");
  const [searchText, setSearchText] = useState("");

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
const [selectedViewRequest, setSelectedViewRequest] = useState(null);

const handleViewRequest = (request) => {
  setSelectedViewRequest(request);
  setViewDialogOpen(true);
};

const handleCloseViewDialog = () => {
  setViewDialogOpen(false);
  setSelectedViewRequest(null);
};

  const parseResponse = async (response) => {
    const text = await response.text();

    let result;

    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        "The server returned an invalid response. Please check the API."
      );
    }

    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.message || `Request failed with status ${response.status}.`
      );
    }

    return result;
  };

  const getRequestArray = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.requests)) return result.requests;
    if (Array.isArray(result?.records)) return result.records;

    return [];
  };



const fetchPendingRequests = useCallback(async () => {
  try {
    setLoading(true);

    // Fetch all request statuses for Shop 1
    const apiUrl =
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/getStockTransferRequest.php?ShopId=1";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await parseResponse(response);
    const data = getRequestArray(result);

    const mappedRequests = data.map((request) => {
      const items = Array.isArray(request.Items)
        ? request.Items
        : request.ProductId != null
        ? [
            {
              ProductId: request.ProductId,
              ProductName: request.ProductName,
              Quantity: request.Quantity,
            },
          ]
        : [];

      return {
        ...request,
        RequestId: request.RequestId ?? request.Id,
        RequestDate: request.RequestDate ?? request.Date ?? "",
        RequestStatus:
          request.RequestStatus ?? request.Status ?? "Pending",
        ShopId: request.ShopId ?? "",
        OfficeId: request.OfficeId ?? "",
        RequestedByUser:
          request.RequestedByUser ??
          request.RequestedByName ??
          request.RequestedBy ??
          "",
        Items: items,
        TotalQuantity: items.reduce(
          (total, item) => total + Number(item.Quantity || 0),
          0
        ),
      };
    });

    console.log("All Stock Transfer Requests:", mappedRequests);
    setRequests(mappedRequests);
  } catch (error) {
    console.error("Fetch Stock Transfer Requests Error:", error);
    toast.error(
      error.message || "Failed to load stock transfer requests."
    );
  } finally {
    setLoading(false);
  }
}, []);





  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

 const getAdminUserId = () => {
  const candidates = [
    sessionStorage.getItem("LoginUserId"),
    sessionStorage.getItem("CreatedBy"),
    sessionStorage.getItem("UserId"),
  ];

  const userId = candidates.find(
    (value) => value && /^\d+$/.test(value.trim())
  );

  console.log("Resolved Admin User ID:", userId || "");

  return userId || "";
};

  const handleApprove = async (request) => {
    const requestId = request.RequestId;

    if (!requestId) {
      toast.error("Request ID is missing.");
      return;
    }

    const approvedBy = getAdminUserId();

    if (!approvedBy) {
      toast.error("Admin user ID not found. Please log in again.");
      return;
    }

    const confirmed = window.confirm(
      `Approve stock transfer request #${requestId}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(requestId);

      const formData = new URLSearchParams();
      formData.append("RequestId", String(requestId));
      formData.append("ApprovedBy", String(approvedBy));

      console.log("Request ID:", requestId);
console.log("Approved By:", approvedBy);
console.log("Payload:", formData.toString());

      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/approveStockTransferRequest.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: formData.toString(),
        }
      );

      const result = await parseResponse(response);

      toast.success(
        result?.message || `Request #${requestId} approved successfully.`
      );

      await fetchPendingRequests();
    } catch (error) {
      console.error("Approve Stock Transfer Request Error:", error);

      toast.error(
        error.message || "Unable to approve the stock transfer request."
      );

      await fetchPendingRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    if (processingId !== null) return;

    setRejectDialogOpen(false);
    setSelectedRequest(null);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!selectedRequest?.RequestId) {
      toast.error("Request ID is missing.");
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    const rejectedBy = getAdminUserId();

    if (!rejectedBy) {
      toast.error("Admin user ID not found. Please log in again.");
      return;
    }

    const requestId = selectedRequest.RequestId;

    try {
      setProcessingId(requestId);

      const formData = new URLSearchParams();
      formData.append("RequestId", String(requestId));
      formData.append("RejectedBy", String(rejectedBy));
      formData.append("RejectionReason", rejectionReason.trim());

      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/rejectStockTransferRequest.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: formData.toString(),
        }
      );

      const result = await parseResponse(response);

      toast.success(
        result?.message || `Request #${requestId} rejected successfully.`
      );

      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");

      await fetchPendingRequests();
    } catch (error) {
      console.error("Reject Stock Transfer Request Error:", error);

      toast.error(
        error.message || "Unable to reject the stock transfer request."
      );

      await fetchPendingRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return requests.filter((request) => {
      const status = String(request.RequestStatus || "Pending").toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      const productText = request.Items.map(
        (item) => item.ProductName || ""
      )
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search ||
        String(request.RequestId || "").toLowerCase().includes(search) ||
        String(request.ShopId || "").toLowerCase().includes(search) ||
        String(request.RequestedByUser || "").toLowerCase().includes(search) ||
        productText.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [requests, searchText, statusFilter]);

  const pendingCount = requests.filter(
    (request) =>
      String(request.RequestStatus || "Pending").toLowerCase() === "pending"
  ).length;

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN");
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Stock Transfer Approval
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Review shop stock requests and approve or reject them.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={`Pending: ${pendingCount}`}
              color="warning"
              variant="outlined"
            />

            <Tooltip title="Refresh requests">
              <span>
                <IconButton
                  onClick={fetchPendingRequests}
                  disabled={loading || processingId !== null}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mt: 3,
          }}
        >
          <TextField
            select
            label="Request Status"
            size="small"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            SelectProps={{ native: true }}
            sx={{ minWidth: 170 }}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="All">All loaded requests</option>
          </TextField>

          <TextField
            label="Search request, shop or product"
            size="small"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 300 }, flex: 1 }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
         <TableHead>
  <TableRow
    sx={{
      backgroundColor: "#E8F5E9",
      "& th": {
        color: "#174D2A",
        fontWeight: 700,
        fontSize: "14px",
        borderBottom: "2px solid #C8E6C9",
        whiteSpace: "nowrap",
        py: 1.8,
      },
    }}
  >
    <TableCell>
      <strong>Request ID</strong>
    </TableCell>

    <TableCell>
      <strong>Request Date</strong>
    </TableCell>

    <TableCell>
      <strong>Products</strong>
    </TableCell>

    <TableCell align="right">
      <strong>Total Qty</strong>
    </TableCell>

    <TableCell>
      <strong>Status</strong>
    </TableCell>

    <TableCell align="center">
      <strong>Actions</strong>
    </TableCell>
  </TableRow>
</TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                  <Typography sx={{ mt: 1 }}>
                    Loading stock transfer requests...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  No stock transfer requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => {
                const status = String(
                  request.RequestStatus || "Pending"
                ).toLowerCase();

                const isPending = status === "pending";
                const isProcessing =
                  String(processingId) === String(request.RequestId);

                return (
                 

<TableRow
  key={request.RequestId}
  hover
  sx={{ "&:last-child td": { borderBottom: 0 } }}
>
  <TableCell>
    {request.RequestId || "-"}
  </TableCell>

  <TableCell>
    {formatDate(request.RequestDate)}
  </TableCell>

  <TableCell>
    <Button
      variant="outlined"
      size="small"
      onClick={() => handleViewRequest(request)}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 2,
      }}
    >
      View Products ({request.Items?.length || 0})
    </Button>
  </TableCell>

  <TableCell align="right">
    {Number(request.TotalQuantity || 0)}
  </TableCell>

  <TableCell>
    <Chip
      size="small"
      label={request.RequestStatus || "Pending"}
      color={
        status === "approved"
          ? "success"
          : status === "rejected"
          ? "error"
          : "warning"
      }
    />
  </TableCell>

  <TableCell align="center">
    {isPending ? (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          minWidth: 180,
        }}
      >
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={
            isProcessing ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CheckCircleOutlineIcon />
            )
          }
          disabled={processingId !== null}
          onClick={() => handleApprove(request)}
          sx={{
            minWidth: 100,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {isProcessing ? "Accepting..." : "Accept"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<CancelOutlinedIcon />}
          disabled={processingId !== null}
          onClick={() => openRejectDialog(request)}
          sx={{
            minWidth: 100,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Reject
        </Button>
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        No action
      </Typography>
    )}
  </TableCell>
</TableRow>



                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
   


<Dialog
  open={viewDialogOpen}
  onClose={handleCloseViewDialog}
  fullWidth
  maxWidth="md"
  PaperProps={{
    sx: {
      borderRadius: 3,
      overflow: "hidden",
    },
  }}
>
  <DialogTitle
    sx={{
      background: "linear-gradient(135deg, #075e36, #159957)",
      color: "#fff",
      py: 2,
    }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <Box>
        <Typography variant="h6" fontWeight={700}>
          Stock Outward Details
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Request #{selectedViewRequest?.RequestId ?? "-"}
        </Typography>
      </Box>

      <IconButton
        onClick={handleCloseViewDialog}
        sx={{ color: "#fff" }}
        aria-label="Close"
      >
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ p: { xs: 2, sm: 3 }, mt: 1 }}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      mb={3}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          Request Date
        </Typography>

        <Typography fontWeight={600}>
          {formatDate(selectedViewRequest?.RequestDate)}
        </Typography>
      </Box>

      <Chip
        label={selectedViewRequest?.RequestStatus || "Pending"}
        color={
          String(selectedViewRequest?.RequestStatus).toLowerCase() ===
          "approved"
            ? "success"
            : String(selectedViewRequest?.RequestStatus).toLowerCase() ===
              "rejected"
            ? "error"
            : "warning"
        }
      />
    </Box>

    <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
      Products in this request
    </Typography>

    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: 2 }}
    >
      <Table size="small">
       <TableHead>
  <TableRow
    sx={{
      backgroundColor: "#E8F5E9",
      "& th": {
        color: "#174D2A",
        fontWeight: 700,
        fontSize: "14px",
        borderBottom: "2px solid #C8E6C9",
        whiteSpace: "nowrap",
        py: 1.8,
      },
    }}
  >
    <TableCell>
      <strong>Sr. No.</strong>
    </TableCell>

    <TableCell>
      <strong>Product</strong>
    </TableCell>

    <TableCell>
      <strong>Product ID</strong>
    </TableCell>

    <TableCell align="right">
      <strong>Quantity</strong>
    </TableCell>

    <TableCell align="right">
      <strong>Rate (₹)</strong>
    </TableCell>

    <TableCell align="right">
      <strong>Amount (₹)</strong>
    </TableCell>
  </TableRow>
</TableHead>

        <TableBody>
          {(selectedViewRequest?.Items || []).length > 0 ? (
            selectedViewRequest.Items.map((item, index) => {
              const quantity = Number(item.Quantity || 0);
              const rate = Number(item.Rate || 0);
              const amount =
                item.Amount != null ? Number(item.Amount) : quantity * rate;

              return (
                <TableRow
                  key={`${item.ProductId}-${index}`}
                  hover
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>
                      {item.ProductName || "Unknown Product"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Code: {item.ProductCode ?? "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>{item.ProductId ?? "-"}</TableCell>

                  <TableCell align="right">{quantity}</TableCell>

                  <TableCell align="right">
                    {item.Rate == null
                      ? "-"
                      : `₹ ${rate.toFixed(2)}`}
                  </TableCell>

                  <TableCell align="right">
                    {item.Amount == null && item.Rate == null
                      ? "-"
                      : `₹ ${amount.toFixed(2)}`}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No product details available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <Box
      mt={2}
      p={2}
      sx={{
        backgroundColor: "#f5f8f6",
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography fontWeight={600}>
        Total Quantity
      </Typography>

      <Typography variant="h6" fontWeight={700} color="#075e36">
        {Number(selectedViewRequest?.TotalQuantity || 0)}
      </Typography>
    </Box>

    {String(selectedViewRequest?.RequestStatus).toLowerCase() ===
      "approved" && (
      <Typography
        variant="body2"
        color="success.main"
        sx={{ mt: 2 }}
      >
        This request has been approved for stock transfer.
      </Typography>
    )}
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>
    <Button
      variant="contained"
      onClick={handleCloseViewDialog}
      sx={{
        backgroundColor: "#075e36",
        textTransform: "none",
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


      <Dialog
        open={rejectDialogOpen}
        onClose={closeRejectDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Reject Stock Transfer Request
            <IconButton
              onClick={closeRejectDialog}
              disabled={processingId !== null}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Request ID: {selectedRequest?.RequestId || "-"}
          </Typography>

          <TextField
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            fullWidth
            required
            multiline
            minRows={3}
            inputProps={{ maxLength: 500 }}
            placeholder="Enter why this request is being rejected"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeRejectDialog}
            disabled={processingId !== null}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={
              processingId !== null || !rejectionReason.trim()
            }
            startIcon={
              processingId !== null ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <CancelOutlinedIcon />
              )
            }
          >
            Reject Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockTransferApproval;














































