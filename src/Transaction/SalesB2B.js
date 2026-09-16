


import { useMemo, useState, useEffect } from "react";
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
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
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
import {
  MaterialReactTable,

} from "material-react-table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Cookies from 'js-cookie';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';


import logo from "../imgs/amrutlogo.png";
import logonew from '../imgs/logo_white.png'
import sign from '../imgs/sign.jpg'

// ------------------------------------------------------------
// Small helper: converts a number to words (Indian numbering,
// Rupees/Paise) for the "Total In Words" line on the invoice.
// No external package needed.
// ------------------------------------------------------------
const numberToWordsIndian = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen"
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const inWords = (n) => {
    if (n === 0) return "";
    if (n < 20) return a[n] + " ";
    if (n < 100) return b[Math.floor(n / 10)] + " " + inWords(n % 10);
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + "Thousand " + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + "Lakh " + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + "Crore " + inWords(n % 10000000);
  };

  const value = Math.abs(Number(num) || 0);
  const rupees = Math.floor(value);
  const paise = Math.round((value - rupees) * 100);

  let words = "Indian Rupee " + (inWords(rupees).trim() || "Zero") + " Only";
  if (paise > 0) {
    words = "Indian Rupee " + (inWords(rupees).trim() || "Zero") + " and " + inWords(paise).trim() + " Paise Only";
  }
  return words;
};

const SalesB2B = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState([]);
  const [rows, setRows] = useState([]);


  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);



  useEffect(() => {
    fetchInvdetails();
  }, []);

  // ============================================================
  // REQUIREMENT 1: Show ONLY B2B entries in this screen.
  //
  // TODO(backend): This assumes the `invoiceheader` table has (or
  // will have) a column that marks the sale type, e.g. `SaleType`
  // with values like "B2B" / "B2C" / "General". Two things to do:
  //
  //  a) Best option — filter server-side so pagination stays
  //     correct. In gettblpage.php, accept a SaleType param and
  //     add "AND SaleType = 'B2B'" to the WHERE clause, then call:
  //     .../gettblpage.php?Table=invoiceheader&PageNo=${pageNo}&SaleType=B2B
  //
  //  b) Until the backend supports the filter param, this code
  //     filters on the client after fetching (see hasTypeField
  //     check below). If the column doesn't exist yet in the API
  //     response, it safely falls back to showing everything (so
  //     nothing breaks) — update SALE_TYPE_FIELD / SALE_TYPE_VALUE
  //     below to match your actual column/value names.
  // ============================================================
  const SALE_TYPE_FIELD = "SaleType"; // <-- change to your actual column name
  const SALE_TYPE_VALUE = "B2B";      // <-- change to your actual B2B value

  //get of Invoice header
  const fetchInvoiceHeader = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch(
        `https://amrutdairyapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${pageNo}&${SALE_TYPE_FIELD}=${SALE_TYPE_VALUE}`,
        requestOptions
      );
      const result = await response.json();

      let invoiceData = result.data || [];

      // Client-side safety net filter (see note above). Remove this
      // once the backend query param above is actually implemented.
      const hasTypeField = invoiceData.some(
        (inv) => inv[SALE_TYPE_FIELD] !== undefined && inv[SALE_TYPE_FIELD] !== null
      );
      if (hasTypeField) {
        invoiceData = invoiceData.filter((inv) => inv[SALE_TYPE_FIELD] === SALE_TYPE_VALUE);
      }

      // Fetch account details for each invoice
      const InvoicesList = await Promise.all(
        invoiceData.map(async (invoice) => {
          try {
            const acctResponse = await fetch(
              `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invoice.AccountId}`, // assuming AccountId is the linking field
              requestOptions
            );

            const acctResult = await acctResponse.json();
            const accountDetails = Array.isArray(acctResult) ? acctResult[0] : null;

            const addressResponse = await fetch(
              `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${invoice.AccountId}`,
              requestOptions
            );

            const addressResult = await addressResponse.json();
            console.log(
              "Address API Response =",
              JSON.stringify(addressResult, null, 2)
            );
            const addressDetails = Array.isArray(addressResult) ? addressResult[0] : {};
            console.log(addressDetails);


            const cityName =
              cityOptions.find(
                (city) => Number(city.value) === Number(addressDetails.CityId)
              )?.label || "";

            const stateName =
              stateOptions.find(
                (state) => Number(state.value) === Number(addressDetails.StateId)
              )?.label || "";


            return {
              ...invoice,
              accountDetails: {
                ...accountDetails,
                ...addressDetails,
                CityName: cityName,
                StateName: stateName,
              },
            };
          } catch (error) {
            console.error(`Failed to fetch account for invoice ${invoice.Id}:`, error);
            return invoice; // fallback to original invoice
          }
        })
      );

      setInvoiceheaders(InvoicesList);
      setTotalPages(result.total_pages);

      // console.log(' invoice header:', InvoicesList);
    } catch (error) {
      console.error('Error fetching invoice headers:', error);
    }
  };


  //get of Invoice details
  const fetchInvdetails = async () => {
    try {
      const response = await axios.get(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=invoicedetail"
      );
      // console.log('detail', response.data)
      setInvoicedetails(response.data);
    } catch (error) { }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = () => {
    setIsDrawerOpen(true);
    //  handleEdit()
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // handleMenuOpen(false);
  };

  const handleNewClick = () => {
    setIsDrawerOpen(true);
    resetForm();
    setIsEditing(false);
    setOpen(false);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setShowDropdown(false)
    resetForm();
  };


  //for delete Header
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleConfirmDelete = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    // const itemId = currentRow.original.Id;
    // console.log('itemId',currentRow.original.Id)

    fetch(`https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=invoiceheader&Id=${editId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);

        handleDrawerClose();
        fetchInvoiceHeader();
        handleMenuClose()
        toast.success(
          "Sales Entry Deleted successfully!"
        );
      })
      .catch((error) => console.error(error));
  };


  const [editId, setEditId] = useState("");

  //update form
  const handleEdit = (row) => {
    const originalData = row.original;
    // console.log('row.original',row.original)
    if (!originalData) return;
    // console.log('original data',row)
    const rowId = originalData.Id;
    if (!originalData) {
      console.error("No row selected for editing.");
      return;
    }
    // console.log('rowid',rowId)


    const invheader = invoiceheaders.find(h => h.Id === rowId);
    if (!invheader) {
      console.error("No invoice header found for the selected row.");
      // toast.error("Invoice header not found.");
      return;
    }

    // console.log('Editing row data:', originalData);
    // console.log(' header with ID:', rowId);

    const invdetail = invoicedetails.filter(
      (detail) => detail.InvoiceId === invheader.Id
    );
    //  console.log("header", invheader);
    //  console.log("detail", invdetail);


    //
    fetchAccounts(invheader.AccountId)
    fetchAccountName(invheader.AccountId)
    setCustomerName(invheader.AccountId)
    setSelectedAccount(invheader.AccountId)


    // Convert date strings to DD-MM-YYYY format
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        toast.error(`Invalid date format: ${dateStr}`);
        return "";
      }
    };



    // Map the details to rows
    const mappedRows = invdetail.map((detail) => ({
      Id: detail.Id,
      InvoiceId: detail.InvoiceId,
      ProductId: detail.ProductId,
      ProductName: productOptions.find((data) => data.value === detail.ProductId)?.label || "",
      Quantity: parseFloat(detail.Quantity) || '0',
      Rate: parseFloat(detail.Rate) || '0',
      Amount: parseFloat(detail.Amount) || '0',
      CGSTPercentage: parseFloat(detail.CGSTPercentage) || '0',
      CGSTAmount: parseFloat(detail.CGSTAmount) || '0',
      SGSTPercentage: parseFloat(detail.SGSTPercentage) || '0',
      SGSTAmount: parseFloat(detail.SGSTAmount) || '0',
      IGSTPercentage: parseFloat(detail.IGSTPercentage) || '0',
      IGSTAmount: parseFloat(detail.IGSTAmount) || '0',
      DiscountAmt: detail.DiscountAmt,
      // TODO(backend): these three only populate once invoicedetail
      // actually has MRP / HSNCode / BatchRef columns.
      MRP: detail.MRP || "",
      HSN: detail.HSNCode || "",
      BatchRef: detail.BatchRef || "",
    }));
    const invoiceDate = convertDateForInput(invheader.InvoiceDate?.date);
    const orderdate = convertDateForInput(invheader.OrderDate?.date);
    // Set form fields
    setIsDrawerOpen(true);
    setInvoiceNo(invheader.InvoiceNo);
    setInvoiceDate(invoiceDate);
    setPhone(invheader.ContactNo);
    setOrderNo(invheader.OrderNo);
    setOrderDate(orderdate);
    //setSelectedProductId(invheader.ProductId);
    setQuantity(0);
    setRate(0);
    SetAmount(0);
    setDiscount(0);
    setCGST(0);
    setCGSTAmount(0);
    setSGST(0);
    setSGSTAmount(0);
    setIGST(0);
    setIGSTAmount(0);
    setPaymentMode(invheader.PaymentMode);
    setTransport(invheader.Transport);
    // REQUIREMENT 4 fields (see TODO(backend) notes further down)
    setTerms(invheader.Terms || "");
    setDueDate(invheader.DueDate ? convertDateForInput(invheader.DueDate) : "");
    setPoNo(invheader.PONo || "");
    setPlaceOfSupply(invheader.PlaceOfSupply || "");
    setSalesPerson(invheader.SalesPerson || "");
    setOrderSource(invheader.OrderSource || "");
    // Set the rows for the table with all the details
    setRows(mappedRows);
    handleMenuClose();
    setIsEditing(true);
    setEditId(row.original?.Id);
    handleMenuOpen()
    fetchInvoiceHeader();
  };


  //table
  const [pageNo, setPageNo] = useState(1)
  //for preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 50,
        Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
      },

      {
        accessorKey: "InvoiceDate.date",
        header: "Invoice Date",
        size: 50,
        Cell: ({ cell }) => (
          <span>{moment(cell.getValue()).format("DD-MM-YYYY")}</span>
        ),
      },

      {
        header: "Customer Name",
        size: 100,
        accessorFn: (row) => row.accountDetails?.AccountName || "N/A",
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
      },

      {
        accessorKey: "Total",
        header: "Total",
        size: 50,
      },

      {
        header: 'Actions',
        size: 200,
        Cell: ({ row }) => (
          <Box display="flex" gap={1}>
            <Button
              sx={{ background: 'var(--primary-color)' }}
              variant="contained"
              size="small"
              onClick={() => {
                // setCurrentRow(row);
                handleEdit(row);
              }}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              sx={{ background: 'var(--complementary-color)' }}
              size="small"
              onClick={() => {
                const invdetail = invoicedetails
                  .filter((detail) => detail.InvoiceId === row.original.Id)
                  .map((detail) => {
                    const matchedMaterial = productOptions.find(
                      (item) => item.value.toString() === detail.ProductId?.toString()
                    );
                    return {
                      ...detail,
                      ProductName: matchedMaterial?.label || "Unknown",
                    };
                  });
                setPreviewData({ ...row.original, invdetail });
                setPreviewOpen(true);
                console.log("ROW =", row.original);
                console.log("ACCOUNT DETAILS =", row.original.accountDetails);
                console.log("ADDRESS1 =", row.original.accountDetails?.Address1);
              }}
            >
              Preview
            </Button>
          </Box>
        ),
      },
    ],
    [invoiceheaders]
  );

  // useEffect(() => {
  //   fetchInvoiceHeader();
  // }, [pageNo]);


  // Integration
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(null);

  const [phone, setPhone] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [orderDate, setOrderDate] = useState(null);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [amount, SetAmount] = useState("");
  const [cgst, setCGST] = useState(0);
  const [cgstAmount, setCGSTAmount] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [sgstAmount, setSGSTAmount] = useState(0);
  const [igst, setIGST] = useState(0);
  const [igstAmount, setIGSTAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState(null);
  const [transport, setTransport] = useState("");
  const [productName, setProductName] = useState("");

  // ============================================================
  // REQUIREMENT 4: extra header-level fields used in the new
  // invoice format (Terms, Due Date, P.O.#, Place of Supply,
  // Sales Person, Order Source).
  //
  // TODO(backend): add matching columns to `invoiceheader`:
  //   Terms, DueDate, PONo, PlaceOfSupply, SalesPerson, OrderSource
  // Until those columns exist, these values are still collected
  // and shown in the Preview/PDF from local state, they just won't
  // persist/reload after a page refresh or come back via handleEdit.
  // ============================================================
  const [terms, setTerms] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [poNo, setPoNo] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [orderSource, setOrderSource] = useState("");

  // Per-line-item extra fields for the new item table
  // (MRP / HSN auto-fill from product master when available,
  // BatchRef is entered manually per line).
  // TODO(backend): add MRP, HSNCode columns to `productmaster`,
  // and MRP, HSNCode, BatchRef columns to `invoicedetail`.
  const [mrp, setMrp] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [batchRef, setBatchRef] = useState("");

  //fetch customer from  account table
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  const [acctGSTNo, setacctGSTNo] = useState("");




useEffect(() => {
  fetchProduct();
  fetchCity();
  fetchState();
}, []);

useEffect(() => {
  if (cityOptions.length > 0 && stateOptions.length > 0) {
    fetchInvoiceHeader();
  }
}, [cityOptions, stateOptions, pageNo]);

  //fetch customer from  account table
  const [productOptions, setProductOptions] = useState([]);


  const fetchProduct = async () => {
    try {
      const response = await fetch(
        "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=productmaster"
      );

      const data = await response.json();
      //  console.log("API Response:", data);
      productvalidation(data)

    } catch (error) {
      console.error("Error fetching accounts:", error);
    }

  };



  const fetchCity = async () => {
  try {
    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=city"
    );

    const result = await response.json();

    const cityData = result.map((city) => ({
      value: city.Id,
      label: city.CityName,
    }));

    setCityOptions(cityData);
  } catch (error) {
    console.error("Error fetching city:", error);
  }
};




const fetchState = async () => {
  try {
    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=state"
    );

    const result = await response.json();

    const stateData = result.map((state) => ({
      value: state.Id,
      label: state.StateName,
    }));

    setStateOptions(stateData);
  } catch (error) {
    console.error("Error fetching state:", error);
  }
};


  const [selectedProductID, setSelectedProductId] = useState('');
  const [selectedProductName, setSelectedProductName] = useState(null);




  const productvalidation = (data) => {
    const options = data.map((account) => ({
      value: account?.Id,
      label: account?.ProductName,
      cgst: account?.CGSTPercentage,
      sgst: account?.SGSTPercentage,
      igst: account?.IGSTPercentage,
      purchaseRate: account?.SellPrice,
      // TODO(backend): populate once productmaster has these columns
      mrp: account?.MRP || "",
      hsn: account?.HSNCode || "",
    }));
    setProductOptions(options);
  }

  const resetForm = () => {
    setInvoiceNo("");
    setInvoiceDate("");
    setPhone("");
    setSelectedAccount("");
    setOrderDate("");
    setOrderNo("");
    setProduct("");
    setQuantity("");
    setRate("");
    SetAmount("");
    setCGST("");
    setCGSTAmount("");
    setSGST("");
    setSGSTAmount("");
    setIGST("");
    setIGSTAmount("");
    setPaymentMode("");
    setTransport("");
    setErrors("");
    setDiscount("");
    setAccountOptions([])
    setRows([]);
    setTerms("");
    setDueDate("");
    setPoNo("");
    setPlaceOfSupply("");
    setSalesPerson("");
    setOrderSource("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedInvoicedate = moment(invoiceDate).format("YYYY-MM-DD");
    const formattedorderdate = moment(orderDate).format("YYYY-MM-DD");
    const formattedduedate = dueDate ? moment(dueDate).format("YYYY-MM-DD") : "";
    const invoiceheaderdata = {
      Id: isEditing ? editId : "",
      InvoiceNo: invoiceNo,
      InvoiceDate: formattedInvoicedate,
      AccountId: selectedAccount ? selectedAccount : customerName,
      OrderNo: orderNo,
      OrderDate: formattedorderdate,
      ContactNo: phone,
      Transport: parseFloat(transport),
      CGSTAmount: cgstTotal,
      SGSTAmount: sgstTotal,
      IGSTAmount: igstTotal,
      Total: total,
      PaymentMode: paymentMode,
      SubTotal: subTotalcal,
      // REQUIREMENT 1: mark every entry saved from this screen as B2B.
      // TODO(backend): make sure invoiceheader has this column; if not
      // yet added, the API will typically just ignore the extra field.
      [SALE_TYPE_FIELD]: SALE_TYPE_VALUE,
      // REQUIREMENT 4 fields — see TODO(backend) note above the states.
      Terms: terms,
      DueDate: formattedduedate,
      PONo: poNo,
      PlaceOfSupply: placeOfSupply,
      SalesPerson: salesPerson,
      OrderSource: orderSource,
    };
    // console.log("invoiceheaderdata", invoiceheaderdata);
    try {
      const invoiceurl = isEditing
        ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
        : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoiceheader.php";

      const response = await axios.post(
        invoiceurl,
        qs.stringify(invoiceheaderdata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const invoiceId = isEditing ? editId : parseInt(response.data.Id, 10);
      // console.log("invioce id ", invoiceId);
      //  console.log("rows", rows);

      for (const row of rows) {
        //  console.log("this row   ", row);
        const rowData = {
          Id: parseInt(row.Id, 10),
          InvoiceId: parseInt(invoiceId, 10),
          SerialNo: rows.indexOf(row) + 1,
          ProductId: parseInt(row.ProductId, 10),
          Quantity: parseFloat(row.Quantity),
          Rate: parseFloat(row.Rate),
          Amount: parseInt(row.Amount),
          CGSTPercentage: parseFloat(row.CGSTPercentage),
          CGSTAmount: parseFloat(row.CGSTAmount),
          SGSTPercentage: parseFloat(row.SGSTPercentage),
          SGSTAmount: parseFloat(row.SGSTAmount),
          IGSTPercentage: parseFloat(row.IGSTPercentage),
          IGSTAmount: parseFloat(row.IGSTAmount),
          DiscountAmt: row.DiscountAmt,
          // TODO(backend): add MRP, HSNCode, BatchRef columns to invoicedetail
          MRP: row.MRP || "",
          HSNCode: row.HSN || "",
          BatchRef: row.BatchRef || "",
        };
        // console.log({
        //   DiscountAmt:typeof row.DiscountAmt,
        //   // Quantity: typeof row.Quantity,
        //   Rate: typeof row.Rate
        // });

        //  console.log("this row has rowData ", rowData);

        const invoicdedetailurl =
          row.Id
            ? "https://amrutdairyapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
            : "https://amrutdairyapi.microtechsolutions.net.in/php/postinvoicedetail.php";

        //  console.log(" invoicdedetailurl is used ", invoicdedetailurl);
        try {
          const response = await axios.post(
            invoicdedetailurl,
            qs.stringify(rowData),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          // console.log("Response:", response);
        } catch (error) {
          console.error("Error:", error);
        }


      }

      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Sales Entry Updated successfully!"
          : "Sales Entry Created successfully!"
      );
      resetForm();
      fetchInvoiceHeader();
      fetchInvdetails();

      // console.log("Invoice Header Data:", invoiceheaderdata);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      setIsDrawerOpen(false);
      toast.error(
        isEditing
          ? "Sales Entry Updated unsuccessfully!"
          : "Sales Entry Created unsuccessfully!"
      );

    }
  };

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
  const [discount, setDiscount] = useState('');


  const [baseAmount, setBaseAmount] = useState(0);
  const calculateAmount = (qty, rt) => {
    const qtyNum = parseFloat(qty) || 0;
    const rateNum = parseFloat(rt) || 0;
    const baseAmt = qtyNum * rateNum;

    setBaseAmount(baseAmt); // store original amount before discount

    const discountNum = parseFloat(discount) || 0;
    const finalAmt = baseAmt - discountNum;

    SetAmount(finalAmt);
    calculateCgstAmount(cgst, finalAmt);
    calculateSgstAmount(sgst, finalAmt);
    calculateIgstAmount(igst, finalAmt);
  };

  const handleDiscountChange = (e) => {
    const discountValue = e.target.value;
    setDiscount(discountValue);

    const discountNum = parseFloat(discountValue) || 0;
    const finalAmt = baseAmount - discountNum;

    SetAmount(finalAmt);
    calculateCgstAmount(cgst, finalAmt);
    calculateSgstAmount(sgst, finalAmt);
    calculateIgstAmount(igst, finalAmt);
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
      MRP: mrp,
      HSN: hsnCode,
      BatchRef: batchRef,
    };
    // console.log("newRow", newRow);
    // Update rows state and ensure the new row is added to the table
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const [subTotalcal, setSubTotalCal] = useState()
  const [cgstTotal, setCgstTotal] = useState()
  const [igstTotal, setIgstTotal] = useState()
  const [sgstTotal, setSgstTotal] = useState()
  const [total, setTotal] = useState()

  const calculations = () => {
    const subtotal = rows.reduce(
      (acc, row) => acc + (parseFloat(row.Amount) || 0),
      0,
    );
    const subTotalCalculations = subtotal.toFixed(2)
    setSubTotalCal(subTotalCalculations)

    const totalCGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
      0
    );
    const cgstTotals = totalCGST.toFixed(2)
    setCgstTotal(cgstTotals)

    const totalSGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
      0
    );
    const sgstTotals = totalSGST.toFixed(2)
    setSgstTotal(sgstTotals)



    const totalIGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
      0
    );
    const igstTotals = totalIGST.toFixed(2)
    setIgstTotal(igstTotals)


    const transportValue = !isNaN(parseFloat(transport)) ? parseFloat(transport) : 0;
    const grandTotal =
      subtotal + totalCGST + totalSGST + totalIGST +
      // (parseFloat(transport) || 0);
      // (!isNaN(parseFloat(transport)) ? parseFloat(transport) : 0); 
      transportValue
    let totals = grandTotal.toFixed(2)
    setTotal(totals)
  }

  useEffect(() => {
    calculations()
  }, [rows, transport]);

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
    const d = row.DiscountAmt || 0;

    setQuantity(q);
    setRate(r);
    setDiscount(d);
    setMrp(row.MRP || "");
    setHsnCode(row.HSN || "");
    setBatchRef(row.BatchRef || "");

    // Set base and amount properly
    const qtyNum = parseFloat(q) || 0;
    const rateNum = parseFloat(r) || 0;
    const discountNum = parseFloat(d) || 0;

    const baseAmt = qtyNum * rateNum;
    const finalAmt = baseAmt - discountNum;

    setBaseAmount(baseAmt);
    SetAmount(finalAmt);
    setCGST(row.CGSTPercentage || 0);
    setSGST(row.SGSTPercentage || 0);
    setIGST(row.IGSTPercentage || 0);

    calculateCgstAmount(row.CGSTPercentage || 0, finalAmt);
    calculateSgstAmount(row.SGSTPercentage || 0, finalAmt);
    calculateIgstAmount(row.IGSTPercentage || 0, finalAmt);
  };


  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleSaveOrAddRow = () => {
    if (!selectedProductID) {
      alert("Please select an product before adding or saving the row.");
      return;
    }

    if (editingRow !== null) {
      // Update the existing row
      const updatedRows = [...rows];
      updatedRows[editingRow] = {
        ...updatedRows[editingRow],
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
        MRP: mrp,
        HSN: hsnCode,
        BatchRef: batchRef,

      };
      setRows(updatedRows);
      setEditingRow(null);
    } else {
      // Add a new row
      handleAddRow();
    }

    resetFields();
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
    setDiscount("");
    setMrp("");
    setHsnCode("");
    setBatchRef("");
  };


  //get company master
  const [gstNo, setGstNO] = useState("");
  const [comapanyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountNo, setAccountNo] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  // REQUIREMENT 2: Food/FSSAI License number.
  // TODO(backend): add a `FSSAINo` column to `companymaster` and
  // store the value there (e.g. 11526086000081). Once that's done
  // this will populate automatically — nothing else to change.
  const [fssaiNo, setFssaiNo] = useState("11526086000081");


  useEffect(() => {
    console.log("FSSAI =", fssaiNo);
  }, [fssaiNo]);



  const fetchCompanyMaster = async () => {
    try {
      const response = await axios.get(
        'https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=companymaster',
        { maxBodyLength: Infinity }
      );
      console.log(response.data);
      setGstNO(response.data[0].GSTNo);
      setCompanyName(response.data[0].CompanyName)
      setCompanyAddress(response.data[0].Address1)
      setBankName(response.data[0].BankName)
      setBranchName(response.data[0].BranchName)
      setAccountNo(response.data[0].AccountNo)
      setIfscCode(response.data[0].IFSCCode)
      // Falls back to blank until the backend column exists.
      // setFssaiNo(response.data[0].FSSAINo || "");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyMaster();
  }, []);

  //for serchApi
  const [showDropdown, setShowDropdown] = useState(false);
  const [text, setText] = useState("");


  const serchCustomers = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${text}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //setAccountOptions(result);
        setAccountOptions(Array.isArray(result) ? result : []);


      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    serchCustomers();
  }, [text]);

  // create new Customer
  const [accountName, setAccountName] = useState("");
  const [customerName, setCustomerName] = useState("");


  const Namevalidation = () => {
    let temp = accountName.split(" ")
    let surname = temp[1]
    if (surname && surname.length >= 1) {
      return true;
    } else {
      toast.error("Need to Insert First and last Name ");
      return false;
    }
  }

  const [customerGSTNo, setCustomerGSTNo] = useState("");

  const CreateCustomerMaster = () => {

    if (!Namevalidation()) {
      return;
    }
    // GST No validation
    if (!customerGSTNo || customerGSTNo.trim() === "") {
      toast.error("GST No is required");
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("AccountName", accountName);
    urlencoded.append("GroupId", "3");
    urlencoded.append("SubGroupId", "1");
    urlencoded.append("OpeningBalance", "100");
    urlencoded.append("DrORCr", "D");
    urlencoded.append("TypeCode", "C");
    urlencoded.append("IsSystem", "false");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log("Customer Created:", result);

        if (result && result.Id) {
          //console.log(result.Id)
          toast.success('user created')
          // Now set the address and GSTNo for this customer
          const addressData = new URLSearchParams();

          addressData.append("AccountId", result.Id);

          addressData.append("GSTNo", customerGSTNo);

          return fetch("https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php", {
            method: "POST",
            headers: myHeaders,
            body: addressData,
            redirect: "follow",
          });
        } else {
          throw new Error("Customer ID not received from API.");
        }
      })
      .then((response) => response.json())
      .then((addressResult) => {
        //console.log("Address Added:", addressResult);
        // Clear the input field after successful creation
        setAccountName("");
        setCustomerGSTNo("")
      })
      .catch((error) => console.error("Error:", error));
  };


  //set GSTno
  const fetchAccounts = (customerId) => {

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`, requestOptions)

      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        let temp = result[0]
        console.log("gstno", temp.GSTNo)
        setacctGSTNo(temp.GSTNo || 0)

      }

      )
      .catch((error) => console.error(error));
  };


  const fetchAccountName = (acctname) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${acctname}`, requestOptions)

      .then((response) => response.json())
      .then((result) => {
        // console.log('accountname', result)

        setAccountOptions(Array.isArray(result) ? result : []);
      }

      )
      .catch((error) => console.error(error));
  };

  //

  const handleItemChange = (newValue) => {

    if (newValue) {
      setSelectedProductId(newValue.value);
      setProductName(newValue.label);
      setRate(newValue.purchaseRate);
      setSelectedProductName(newValue.label);
      setCGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? newValue.cgst : "0");
      setSGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? newValue.sgst : "0");
      setIGST(gstNo?.substring(0, 2) !== acctGSTNo?.substring(0, 2) ? newValue.igst : "0");
      // Auto-fill MRP / HSN from product master (falls back to blank
      // until those columns exist on productmaster — see TODO above).
      setMrp(newValue.mrp || "");
      setHsnCode(newValue.hsn || "");

      // Recalculate the amount with the existing quantity
      calculateAmount(quantity, newValue.purchaseRate);
    } else {
      setSelectedProductId("");
      setProductName("");
      setRate("");
      setSelectedProductName("");
      setCGST("0");
      setSGST("0");
      setIGST("0");
      setMrp("");
      setHsnCode("");
    }
  }

  ///Pagination
  const [totalPages, setTotalPages] = useState(1);
  //validation
  const [errors, setErrors] = useState({
    invoiceDate: '',
    selectedAccount: '',
    orderNo: '',
    orderDate: '',
    paymentMode: '',
    rows: ''
  });

  const validateForm = () => {
    const newErrors = {
      invoiceDate: '',
      selectedAccount: '',
      orderNo: '',
      orderDate: '',
      paymentMode: '',
      // rows: ''
    };

    let isValid = true;

    if (!invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
      isValid = false;
    } else {
      // Convert dates to Date objects for comparison
      const invoiceDateObj = new Date(invoiceDate);
      const fromDateObj = new Date(fromdate);
      const toDateObj = new Date(todate);

      // Check if invoice date is before from date
      if (invoiceDateObj < fromDateObj) {
        newErrors.invoiceDate = `Invoice date cannot be before ${new Date(fromdate).toLocaleDateString()}`;
        isValid = false;
      }
      // Check if invoice date is after to date
      else if (invoiceDateObj > toDateObj) {
        newErrors.invoiceDate = `Invoice date cannot be after ${new Date(todate).toLocaleDateString()}`;
        isValid = false;
      }
    };

    if (!selectedAccount) {
      newErrors.selectedAccount = 'Customer is required';
      isValid = false;
    }

    if (!orderNo) {
      newErrors.orderNo = 'Order number is required';
      isValid = false;
    }

    if (!orderDate) {
      newErrors.orderDate = 'Order date is required';
      isValid = false;
    }

    if (!paymentMode) {
      newErrors.paymentMode = 'Payment mode is required';
      isValid = false;
    }

    // if (rows.length === 0) {
    //   newErrors.rows = 'At least one product must be added';
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  //for yearId
  const [yearid, setYearId] = useState('');
  const [fromdate, setFromDate] = useState('');
  const [todate, setToDate] = useState('');

  useEffect(() => {
    const storedYearId = Cookies.get("YearId");
    const storedfromdate = Cookies.get("FromDate");
    const storedtodate = Cookies.get("ToDate");

    if (storedYearId) {
      setYearId(storedYearId);
      //console.log('storedYearId', storedYearId);
    } else {
      toast.error("Year is not set.");
    };
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


  // ============================================================
  // REQUIREMENT 4: PDF layout rebuilt to match the reference
  // "Orgatma" invoice — 2-column header (logo+company info on the
  // left, invoice meta on the right), Bill To / Ship To side by
  // side, item table with MRP / HSN / Batch Ref columns, then
  // totals, "Items in Total" + "Total In Words", bank details,
  // terms, jurisdiction and signature.
  // ============================================================

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    if (!previewData) return;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 8;

    const drawBorder = () => {
      doc.setDrawColor(120);
      doc.setLineWidth(0.4);
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    };
    drawBorder();

    const checkPageBreak = (neededSpace = 8) => {
      if (y + neededSpace > pageHeight - 8) {
        doc.addPage();
        drawBorder();
        y = 12;
      }
    };


    // Format Invoice Date
    const invDateStr = previewData?.InvoiceDate?.date
      ? new Date(previewData.InvoiceDate.date).toLocaleDateString("en-GB")
      : "-";

    // Format Due Date
    const dueDateStr = dueDate
      ? new Date(dueDate).toLocaleDateString("en-GB")
      : "-";



    // ================= HEADER =================

    doc.addImage(logo, "JPEG", 10, y, 18, 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(comapanyName || "", 32, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const addressLines = doc.splitTextToSize(companyAddress || "", 110);
    doc.text(addressLines, 32, y + 10);

    doc.text(`GSTIN : ${gstNo || "-"}`, 32, y + 17);

    doc.text(`FSSAI : ${fssaiNo || "-"}`, 32, y + 22);

    // Right Side
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    doc.text(
      "TAX INVOICE",
      pageWidth - 10,
      y + 8,
      {
        align: "right",
      }
    );

    // Bottom Line
    doc.setDrawColor(180);
    doc.line(10, y + 28, pageWidth - 10, y + 28);

    // Move cursor below header
    y += 34;


    // ================= INVOICE DETAILS BOX =================
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);

    // Box
    doc.rect(10, y - 2, pageWidth - 20, 28);

    // Middle vertical line
    doc.line(pageWidth / 2, y - 2, pageWidth / 2, y + 26);

    doc.setFontSize(8);

    // Left Column
    doc.setFont(undefined, "bold");
    doc.text("Invoice No :", 12, y + 2);
    doc.setFont(undefined, "normal");
    doc.text(`${previewData.InvoiceNo || "-"}`, 40, y + 2);

    doc.setFont(undefined, "bold");
    doc.text("Invoice Date :", 12, y + 7);
    doc.setFont(undefined, "normal");
    doc.text(invDateStr, 40, y + 7);

    doc.setFont(undefined, "bold");
    doc.text("Terms :", 12, y + 12);
    doc.setFont(undefined, "normal");
    doc.text(`${terms || "-"}`, 40, y + 12);

    doc.setFont(undefined, "bold");
    doc.text("Due Date :", 12, y + 17);
    doc.setFont(undefined, "normal");
    doc.text(`${dueDateStr}`, 40, y + 17);

    doc.setFont(undefined, "bold");
    doc.text("P.O.# :", 12, y + 22);
    doc.setFont(undefined, "normal");
    doc.text(`${poNo || previewData.OrderNo || "-"}`, 40, y + 22);

    // Right Column
    doc.setFont(undefined, "bold");
    doc.text("Place Of Supply :", pageWidth / 2 + 3, y + 2);
    doc.setFont(undefined, "normal");
    doc.text(`${placeOfSupply || "-"}`, pageWidth / 2 + 35, y + 2);

    doc.setFont(undefined, "bold");
    doc.text("Sales Person :", pageWidth / 2 + 3, y + 7);
    doc.setFont(undefined, "normal");
    doc.text(`${salesPerson || "-"}`, pageWidth / 2 + 35, y + 7);




    doc.setFont(undefined, "bold");
    doc.text("Payment Mode :", pageWidth / 2 + 3, y + 17);
    doc.setFont(undefined, "normal");
    doc.text(`${previewData.PaymentMode || "-"}`, pageWidth / 2 + 35, y + 17);


    doc.setFont(undefined, "bold");
    doc.text("Order Source :", pageWidth / 2 + 3, y + 12);
    doc.setFont(undefined, "normal");
    doc.text(`${orderSource || "-"}`, pageWidth / 2 + 35, y + 12);
    // Move below invoice details box
    y += 32;



    // ================= BILL TO / SHIP TO =================

   const billBoxHeight = 48;

    doc.setDrawColor(180);
    doc.setLineWidth(0.2);

    // Outer Border
    doc.rect(10, y, pageWidth - 20, billBoxHeight);

    // Center Line
    doc.line(pageWidth / 2, y, pageWidth / 2, y + billBoxHeight);

    // Header Line
    doc.line(10, y + 6, pageWidth - 10, y + 6);

//==================== BILL TO ====================

doc.setFontSize(8.5);
doc.setFont(undefined, "bold");
doc.text("Bill To", 12, y + 4);

let leftY = y + 12;

doc.setFont(undefined, "bold");
doc.text("Customer Name :", 14, leftY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.AccountName || "--",
  45,
  leftY
);

leftY += 6;

doc.setFont(undefined, "bold");
doc.text("Address :", 14, leftY);

doc.setFont(undefined, "normal");
doc.text(
  `${previewData.accountDetails?.Address1 || "--"} ${previewData.accountDetails?.Address2 || ""} ${previewData.accountDetails?.Address3 || ""}`,
  35,
  leftY
);


// City
leftY += 6;

doc.setFont(undefined, "bold");
doc.text("City :", 14, leftY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.CityName || "--",
  28,
  leftY
);

// State
doc.setFont(undefined, "bold");
doc.text("State :", 58, leftY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.StateName || "--",
  74,
  leftY
);

// GST No
leftY += 6;

doc.setFont(undefined, "bold");
doc.text("GST No :", 14, leftY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.GSTNo || "--",
  35,
  leftY
);

// Contact No
leftY += 6;

doc.setFont(undefined, "bold");
doc.text("Contact No :", 14, leftY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.ContactNo || "--",
  40,
  leftY
);

// PIN
leftY += 6;

doc.setFont(undefined, "bold");
doc.text("PIN :", 14, leftY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.Pincode || "--",
  28,
  leftY
);
//==================== SHIP TO ====================

let rightY = y + 12;

doc.setFont(undefined, "bold");
doc.text("Ship To", pageWidth / 2 + 4, y + 4);

doc.setFont(undefined, "bold");
doc.text("Customer Name :", pageWidth / 2 + 6, rightY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.AccountName || "--",
  pageWidth / 2 + 37,
  rightY
);

rightY += 6;

doc.setFont(undefined, "bold");
doc.text("Address :", pageWidth / 2 + 6, rightY);

doc.setFont(undefined, "normal");
doc.text(
  `${previewData.accountDetails?.Address1 || "--"} ${previewData.accountDetails?.Address2 || ""} ${previewData.accountDetails?.Address3 || ""}`,
  pageWidth / 2 + 26,
  rightY
);
//==================== SHIP TO ====================

// City
rightY += 6;

doc.setFont(undefined, "bold");
doc.text("City :", pageWidth / 2 + 6, rightY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.CityName || "--",
  pageWidth / 2 + 20,
  rightY
);

// State
doc.setFont(undefined, "bold");
doc.text("State :", pageWidth / 2 + 46, rightY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.StateName || "--",
  pageWidth / 2 + 61,
  rightY
);

// GST No
rightY += 6;

doc.setFont(undefined, "bold");
doc.text("GST No :", pageWidth / 2 + 6, rightY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.GSTNo || "--",
  pageWidth / 2 + 26,
  rightY
);

// Contact No
rightY += 6;

doc.setFont(undefined, "bold");
doc.text("Contact No :", pageWidth / 2 + 6, rightY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.ContactNo || "--",
  pageWidth / 2 + 36,
  rightY
);

// PIN
rightY += 6;

doc.setFont(undefined, "bold");
doc.text("PIN :", pageWidth / 2 + 6, rightY);

doc.setFont(undefined, "normal");
doc.text(
  previewData.accountDetails?.Pincode || "--",
  pageWidth / 2 + 20,
  rightY
);

// Move Y below Bill To / Ship To box
y += billBoxHeight + 6;

    // ================= ITEM TABLE =================

    const tableHeaders = [[
      "#",
      "Item & Description",
      "MRP",
      "HSN/SAC",
      "Batch Refrence#",
      "Qty",
      "Rate",
      "Discount",
      "Amount",
      "CGST%",
      "CGST Amt",
      "SGST%",
      "SGST Amt",
      "IGST%",
      "IGST Amt",
    ]];



    const tableData = (previewData.invdetail || []).map((item, idx) => {
      const material = productOptions.find(
        (opt) => opt.value.toString() === item.ProductId?.toString()
      );


      return [
        idx + 1,

        material?.label || item.ProductName || "-",

        item.MRP || material?.mrp
          ? Number(item.MRP || material?.mrp).toFixed(2)
          : "-",

        item.HSNCode || material?.hsn || "-",

        item.BatchRef || "-",

        Number(item.Quantity || 0).toFixed(3),

        Number(item.Rate || 0).toFixed(3),

        Number(item.DiscountAmt || 0).toFixed(2),

        Number(item.Amount || 0).toFixed(2),

        Number(item.CGSTPercentage || 0).toFixed(2),

        Number(item.CGSTAmount || 0).toFixed(2),

        Number(item.SGSTPercentage || 0).toFixed(2),

        Number(item.SGSTAmount || 0).toFixed(2),

        Number(item.IGSTPercentage || 0).toFixed(2),

        Number(item.IGSTAmount || 0).toFixed(2),
      ];
    });




    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: y,
      theme: "grid",
      margin: { left: 10, right: 10 },
      tableWidth: "auto",
      styles: {
        font: "helvetica",
        fontSize: 5.5,
        cellPadding: 0.8,
        valign: "middle",
        halign: "center",
        overflow: "linebreak",
        lineWidth: 0.1,
        lineColor: [220, 220, 220],
      },
      headStyles: {
        fillColor: [235, 235, 235], textColor: [0, 0, 0], fontStyle: "bold",
        fontSize: 6, lineWidth: 0.15, lineColor: [210, 210, 210], halign: "center",
      },
      bodyStyles: { fillColor: [255, 255, 255] },
      columnStyles: {
        // #
        0: { cellWidth: 5, halign: "center" },

        // Item & Description
        1: { cellWidth: 35, halign: "left" },

        // MRP
        2: { cellWidth: 8, halign: "right" },

        // HSN/SAC
        3: { cellWidth: 13, halign: "center" },

        // Batch Ref
        4: { cellWidth: 8, halign: "center" },

        // Qty
        5: { cellWidth: 9, halign: "right" },

        // Rate
        6: { cellWidth: 14, halign: "right" },

        // Discount
        7: { cellWidth: 10, halign: "right" },

        // Amount
        8: { cellWidth: 14, halign: "right" },

        // CGST %
        9: { cellWidth: 7, halign: "center" },

        // CGST Amt
        10: { cellWidth: 10, halign: "right" },

        // SGST %
        11: { cellWidth: 7, halign: "center" },

        // SGST Amt
        12: { cellWidth: 10, halign: "right" },

        // IGST %
        13: { cellWidth: 7, halign: "center" },

        // IGST Amt
        14: { cellWidth: 10, halign: "right" },
      },
      didDrawPage: () => drawBorder(),
    });

    y = doc.lastAutoTable.finalY + 4;

    // ================= PAYMENT DETAILS =================

    checkPageBreak(40);

    const paymentStartY = y;

    // ---------- LEFT : PAYMENT DETAILS ----------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Payment Details", 10, paymentStartY);

    autoTable(doc, {
      startY: paymentStartY + 2,
      margin: { left: 10 },

      tableWidth: 90,

      head: [[
        "Payment Mode",
        "Transport Charge"
      ]],

    body: [[
  previewData.PaymentMode ||
  paymentMode ||
  "Cash",

  isNaN(parseFloat(previewData.Transport))
    ? "0.00"
    : parseFloat(previewData.Transport).toFixed(2)
]],

      theme: "grid",

      styles: {
        fontSize: 7,
        cellPadding: 1.3,
        lineWidth: 0.15,
        lineColor: [210, 210, 210]
      },

      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 5.3,
        cellPadding: 0.8,
        halign: "center",
        valign: "middle"
      }

    });


    // ---------- RIGHT : SUMMARY ----------

    autoTable(doc, {

      startY: paymentStartY,

      margin: {
        left: 118
      },

      tableWidth: 80,

     body: [

  [
    "Subtotal",
    isNaN(parseFloat(previewData.SubTotal))
      ? "0.00"
      : parseFloat(previewData.SubTotal).toFixed(2)
  ],

  [
    "CGST Total",
    isNaN(parseFloat(previewData.CGSTAmount))
      ? "0.00"
      : parseFloat(previewData.CGSTAmount).toFixed(2)
  ],

  [
    "SGST Total",
    isNaN(parseFloat(previewData.SGSTAmount))
      ? "0.00"
      : parseFloat(previewData.SGSTAmount).toFixed(2)
  ],

  [
    "IGST Total",
    isNaN(parseFloat(previewData.IGSTAmount))
      ? "0.00"
      : parseFloat(previewData.IGSTAmount).toFixed(2)
  ],

  [
    "Transport",
    isNaN(parseFloat(previewData.Transport))
      ? "0.00"
      : parseFloat(previewData.Transport).toFixed(2)
  ],

  [
    "Grand Total",
    isNaN(parseFloat(previewData.Total))
      ? "0.00"
      : parseFloat(previewData.Total).toFixed(2)
  ]

],

      theme: "grid",

      styles: {
        fontSize: 7,
        cellPadding: 1.3,
        lineWidth: 0.15,
        lineColor: [210, 210, 210]
      },




      columnStyles: {
        0: {
          cellWidth: 40,
          fontStyle: "bold"
        },

        1: {
          cellWidth: 40,
          halign: "right"
        }
      },

      didParseCell: (data) => {

        if (data.row.index === 5) {

          data.cell.styles.fillColor = [230, 240, 230];

          data.cell.styles.fontStyle = "bold";

        }

      }

    });



    // ---------- ITEMS TOTAL ----------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(

      `Items in Total: ${(previewData.invdetail || []).reduce((a, b) => a + (parseFloat(b.Quantity) || 0), 0)}`,

      10,

      paymentStartY + 34

    );

    // ---------- TOTAL IN WORDS ----------

    const wordsY = paymentStartY + 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
      "Total In Words :",
      10,
      wordsY
    );

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);

    const amountWords = doc.splitTextToSize(
      numberToWordsIndian(previewData.Total || 0),
      145
    );

    doc.text(
      amountWords,
      42,
      wordsY
    );


    // ---------- NEXT POSITION ----------
    const leftBottom = paymentStartY + 47;

    y = Math.max(
      doc.lastAutoTable.finalY,
      leftBottom
    );



    // ---------- BANK DETAILS ----------

    checkPageBreak(20);

    // Top Line
    doc.setDrawColor(220);
    doc.setLineWidth(0.2);
    doc.line(10, y, pageWidth - 10, y);

    y += 5;

    // Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Bank Details", 10, y);

    y += 5;

    doc.setFontSize(9);

    // Bank Name
    doc.setFont("helvetica", "bold");
    doc.text("Bank Name :", 10, y);

    doc.setFont("helvetica", "normal");
    doc.text(bankName || "-", 40, y);

    y += 5;

    // Branch Name
    doc.setFont("helvetica", "bold");
    doc.text("Branch Name :", 10, y);

    doc.setFont("helvetica", "normal");
    doc.text(branchName || "-", 40, y);

    y += 5;

    // Account Number
    doc.setFont("helvetica", "bold");
    doc.text("Account No :", 10, y);

    doc.setFont("helvetica", "normal");
    doc.text(accountNo || "-", 40, y);

    y += 5;

    // IFSC Code
    doc.setFont("helvetica", "bold");
    doc.text("IFSC Code :", 10, y);

    doc.setFont("helvetica", "normal");
    doc.text(ifscCode || "-", 40, y);

    y += 8;


    // ---------- TERMS & CONDITIONS ----------

    checkPageBreak(20);

    // Top Line
    doc.setDrawColor(220);
    doc.setLineWidth(0.2);
    doc.line(10, y, pageWidth - 10, y);

    y += 4;

    // Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TERMS & CONDITIONS", 10, y);

    y += 5;

    // Terms
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const termsList = [
      "1. Oils are best before 9 months from the manufacturing date and jaggery 12 months.",
      "2. Replacement will not be entertained once dispatched.",
      "3. Government taxes, if any, will be extra to your account.",
      "4. Material will be dispatched within 5 to 10 days of the purchase order (depending upon the quantity).",
      "5. Rates are supposed to vary with the seed rates in the market."
    ];

    termsList.forEach((item) => {
      const lines = doc.splitTextToSize(item, 180);

      doc.text(lines, 10, y);

      y += (lines.length * 3.8);
    });

    // Space after terms
    y += 3;

    // Jurisdiction
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
      "Subject to Kolhapur Jurisdiction",
      pageWidth / 2,
      y,
      {
        align: "center",
      }
    );

    y += 3;

    // ---------- SIGNATURE ----------

    // Check remaining space
    const requiredHeight = sign ? 22 : 12;

    if (y + requiredHeight > pageHeight - 12) {
      doc.addPage();
      drawBorder();
      y = 15;
    }

    const signWidth = 28;
    const signHeight = 14;

    const signX = pageWidth - 42;
    const centerX = signX + signWidth / 2;

    // Company Name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    doc.text(
      `For ${comapanyName || ""}`,
      centerX,
      y,
      { align: "center" }
    );

    y += 2;

    // Signature Image
    if (sign) {
      doc.addImage(
        sign,
        "JPEG",
        signX,
        y,
        signWidth,
        signHeight
      );

      y += signHeight;
    } else {
      y += 12;
    }

    // Signature Line
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);

    doc.line(
      signX,
      y,
      signX + signWidth,
      y
    );

    y += 2;

    // Authorized Signatory
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text(
      "Authorized Signatory",
      centerX,
      y,
      {
        align: "center",
      }
    );

    // ---------- SAVE ----------
    doc.save(`Invoice_${previewData.InvoiceNo || "Preview"}.pdf`);
  };

  return (
    <Box>

      <Box textAlign={"center"}>
        <Typography color='var(--complementary-color)' variant="h4">
          <b>B2B Sales Entry</b>
        </Typography>
      </Box>
      <Box sx={{ p: 5, height: 'auto' }}>


        <Box sx={{ display: "flex", gap: 3 }}>
          <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleNewClick}>
            Create B2B Sales Entry
          </Button>
        </Box>

        <MaterialReactTable
          columns={columns}
          data={invoiceheaders}
          enablePagination={false}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#E9ECEF',
              color: 'black',
              fontSize: '16px',
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
              <FirstPageIcon sx={{ cursor: 'pointer' }} onClick={() => setPageNo(1)} />
              <KeyboardArrowLeftIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo((prev) => Math.max(Number(prev) - 1, 1))}
              />
              <Box ml={1}> Page No </Box>
              <TextField
                sx={{
                  width: '4.5%',
                  ml: 1,
                  '@media (max-width: 768px)': {
                    width: '10%',
                  },
                }}
                value={pageNo}
                onChange={(e) => setPageNo(e.target.value)}
                size="small"
              />
              <KeyboardArrowRightIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo((prev) => Number(prev) + 1)}
              />
              <LastPageIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo(totalPages)}
              />
              <Box ml={1}>Total Pages: {totalPages}</Box>
            </Box>
          )}
        />

        {/* ///for preview///////// */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              mt: 3,
            },
          }}
        >
          <DialogTitle sx={{ p: 2 }}>

            <Grid
              container
              spacing={1}
              alignItems="center"
            >

              {/* LEFT SIDE */}

              <Grid item xs={7}>

                <Box display="flex" alignItems="center">

                  <img
                    src={logonew}
                    alt="logo"
                    style={{
                      width: 70,
                      height: 70,
                      marginRight: 15
                    }}
                  />

                  <Box>

                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold" }}
                    >
                      {comapanyName}
                    </Typography>


                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "11px",
                        lineHeight: 1.2
                      }}
                    >
                      {companyAddress}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "11px",
                        lineHeight: 1.2
                      }}
                    >
                      <b>GSTIN :</b> {gstNo}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "11px",
                        lineHeight: 1.2
                      }}
                    >
                      <b>FSSAI :</b> {fssaiNo}
                    </Typography>

                  </Box>

                </Box>

              </Grid>

              {/* RIGHT SIDE */}

              <Grid
                item
                xs={5}
                textAlign="right"
              >

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap"
                  }}
                >
                  TAX INVOICE
                </Typography>

              </Grid>

            </Grid>

          </DialogTitle>
          <Divider />




          <DialogContent dividers>
            <Box>
              {previewData ? (
                <Box>

                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 2,
                      p: 0,
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #d0d0d0"
                    }}
                  >

                    <Grid container spacing={0}>

                      {/* LEFT SIDE */}
                      <Grid
                        item
                        xs={6}
                        sx={{
                          borderRight: "1px solid #d0d0d0",
                          p: 2
                        }}
                      >
                        <Typography sx={{ mb: 1 }}>
                          <b>Invoice No :</b> {previewData.InvoiceNo || "-"}
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                          <b>Invoice Date :</b>{" "}
                          {previewData.InvoiceDate
                            ? new Date(previewData.InvoiceDate.date).toLocaleDateString()
                            : "-"}
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                          <b>Terms :</b> {terms || "-"}
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                          <b>Due Date :</b>{" "}
                          {dueDate
                            ? new Date(dueDate).toLocaleDateString()
                            : "-"}
                        </Typography>

                        <Typography>
                          <b>P.O.# :</b> {poNo || previewData.OrderNo || "-"}
                        </Typography>
                      </Grid>

                      {/* RIGHT SIDE */}
                      <Grid
                        item
                        xs={6}
                        sx={{
                          p: 2
                        }}
                      >
                        <Typography sx={{ mb: 1 }}>
                          <b>Place Of Supply :</b> {placeOfSupply || "-"}
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                          <b>Sales Person :</b> {salesPerson || "-"}
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                          <b>Order Source :</b> {orderSource || "-"}
                        </Typography>

                        <Typography>
                          <b>Payment Mode :</b> {previewData.PaymentMode || "-"}
                        </Typography>
                      </Grid>

                    </Grid>
                  </Paper>

                  {/* 
                  <Box display={'flex'} justifyContent={'space-between'} gap={2} mt={1} flexWrap="wrap">
                    <Box><Typography><strong>Order No:</strong> {previewData.OrderNo}</Typography></Box>
                    <Box><Typography><strong>Order Date:</strong>{" "} {new Date(previewData.OrderDate.date).toLocaleDateString()}</Typography></Box>
                    <Box><Typography><strong>P.O.#:</strong> {poNo || previewData.OrderNo || "-"}</Typography></Box>
                    <Box><Typography><strong>Place Of Supply:</strong> {placeOfSupply || "-"}</Typography></Box>
                  </Box> */}

                  {/* <Box display={'flex'} justifyContent={'space-between'} gap={2} mt={1} flexWrap="wrap">
                    <Box><Typography><strong>Sales Person:</strong> {salesPerson || "-"}</Typography></Box>
                    <Box><Typography><strong>Order Source:</strong> {orderSource || "-"}</Typography></Box>
                    <Box><Typography><strong>Payment Mode:</strong> {previewData.PaymentMode || "-"}</Typography></Box>
                  </Box> */}

                  <Grid container sx={{ mt: 2, border: "1px solid #000" }}>

                    {/* Bill To */}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        borderRight: { md: "1px solid #000" },
                        borderBottom: { xs: "1px solid #000", md: "none" }
                      }}
                    >
                      <Box sx={{ borderBottom: "1px solid #000", p: 1 }}>
                        <Typography fontWeight="bold">
                          Bill To
                        </Typography>
                      </Box>

                      <Box sx={{ p: 2 }}>

                       <Typography sx={{ mb: 1 }}>
  <strong>Customer Name :</strong>{" "}
  {previewData?.accountDetails?.AccountName || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>Address :</strong>{" "}
  {`${previewData?.accountDetails?.Address1 || "--"} 
    ${previewData?.accountDetails?.Address2 || ""} 
    ${previewData?.accountDetails?.Address3 || ""}`}
</Typography>

<Typography sx={{ mt: 1 }}>
  <strong>City :</strong> {previewData?.accountDetails?.CityName || "--"}
  &nbsp;&nbsp;&nbsp;&nbsp;
  <strong>State :</strong> {previewData?.accountDetails?.StateName || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>GST No :</strong>{" "}
  {previewData?.accountDetails?.GSTNo || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>Contact No :</strong>{" "}
  {previewData?.ContactNo || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>PIN :</strong>{" "}
  {previewData?.accountDetails?.Pincode || "--"}
</Typography>
                      </Box>
                    </Grid>

                    {/* Ship To */}
                    <Grid item xs={12} md={6}>

                      <Box sx={{ borderBottom: "1px solid #000", p: 1 }}>
                        <Typography fontWeight="bold">
                          Ship To
                        </Typography>
                      </Box>

                      <Box sx={{ p: 2 }}>

                        <Typography sx={{ mb: 1 }}>
  <strong>Customer Name :</strong>{" "}
  {previewData?.accountDetails?.AccountName || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>Address :</strong>{" "}
  {`${previewData?.accountDetails?.Address1 || "--"} 
    ${previewData?.accountDetails?.Address2 || ""} 
    ${previewData?.accountDetails?.Address3 || ""}`}
</Typography>

<Typography sx={{ mt: 1 }}>
  <strong>City :</strong>{" "}
  {previewData?.accountDetails?.CityName || "--"}
  &nbsp;&nbsp;&nbsp;&nbsp;

  <strong>State :</strong>{" "}
  {previewData?.accountDetails?.StateName || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>GST No :</strong>{" "}
  {previewData?.accountDetails?.GSTNo || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>Contact No :</strong>{" "}
  {previewData?.ContactNo || "--"}
</Typography>

<Typography sx={{ mb: 1 }}>
  <strong>PIN :</strong>{" "}
  {previewData?.accountDetails?.Pincode || "--"}
</Typography>

                      </Box>

                    </Grid>

                  </Grid>


                  <Divider sx={{ mt: 2 }} />

                  <Grid container spacing={4}>

                    {/* Full Width Sales Details */}
                    <Grid item xs={12}>
                      <TableContainer
                        component={Paper}
                        variant="outlined" sx={{ width: '100%', mt: 2 }}>
                        <Table size="small">
                          <TableHead
                            sx={{
                              backgroundColor: "#eeeeee"
                            }}
                          >
                            <TableRow>
                              <TableCell><strong>#</strong></TableCell>
                              <TableCell><strong>Item & Description</strong></TableCell>
                              <TableCell><strong>MRP</strong></TableCell>
                              <TableCell><strong>HSN/SAC</strong></TableCell>
                              <TableCell><strong>Batch Ref#</strong></TableCell>
                              <TableCell><strong>Qty</strong></TableCell>
                              <TableCell><strong>Rate</strong></TableCell>
                              <TableCell><strong>Discount</strong></TableCell>
                              <TableCell><strong>Amount (Rs)</strong></TableCell>
                              <TableCell><strong>CGST%</strong></TableCell>
                              <TableCell><strong>CGST Amount</strong></TableCell>
                              <TableCell><strong>SGST%</strong></TableCell>
                              <TableCell><strong>SGST Amount</strong></TableCell>
                              <TableCell><strong>IGST%</strong></TableCell>
                              <TableCell><strong>IGST Amount</strong></TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {previewData.invdetail.map((item, index) => {
                              const materialOpt = productOptions.find(
                                (opt) => opt.value.toString() === item.ProductId?.toString()
                              );
                              const materialName = materialOpt?.label || "Unknown";

                              return (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{materialName}</TableCell>
                                  <TableCell>{item.MRP || materialOpt?.mrp || "-"}</TableCell>
                                  <TableCell>{item.HSNCode || materialOpt?.hsn || "-"}</TableCell>
                                  <TableCell>{item.BatchRef || "-"}</TableCell>
                                  <TableCell>{item.Quantity}</TableCell>
                                  <TableCell>{item.Rate}</TableCell>
                                  <TableCell>{item.DiscountAmt || 0}</TableCell>
                                  <TableCell>{item.Amount}</TableCell>
                                  <TableCell>{item.CGSTPercentage || 0}</TableCell>
                                  <TableCell>{item.CGSTAmount || 0}</TableCell>
                                  <TableCell>{item.SGSTPercentage || 0}</TableCell>
                                  <TableCell>{item.SGSTAmount || 0}</TableCell>
                                  <TableCell>{item.IGSTPercentage || 0}</TableCell>
                                  <TableCell>{item.IGSTAmount || 0}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid item xs={12}>
                      <Grid container spacing={4}>

                        {/* Left Side - Payment Table */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" fontWeight="bold"  >
                            Payment Details
                          </Typography>

                          <TableContainer component={Paper} elevation={1} sx={{ width: '100%', mt: 2 }}>
                            <Table size="small">
                              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                  <TableCell><strong>Payment Mode</strong></TableCell>
                                  <TableCell><strong>Transport Charge</strong></TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                <TableRow>
                                  <TableCell>{previewData.PaymentMode}</TableCell>
                                  <TableCell>{previewData.Transport}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>

                          <Box mt={2}>
                            <Typography variant="body2">
                              <strong>Items in Total:</strong>{" "}
                              {(previewData.invdetail || []).reduce((a, i) => a + (parseFloat(i.Quantity) || 0), 0)}
                            </Typography>
                            <Typography variant="body2" mt={0.5}>
                              <strong>Total In Words:</strong> {numberToWordsIndian(previewData.Total || 0)}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Right Side - Amount Summary */}
                        <Grid item xs={12} md={6}>


                          <TableContainer
                            component={Paper}
                            variant="outlined" sx={{ mt: 2 }}>
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell><strong>Subtotal</strong></TableCell>
                                  <TableCell>{previewData.SubTotal}</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell><strong>CGST Total</strong></TableCell>
                                  <TableCell>{previewData.CGSTAmount}</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell><strong>SGST Total</strong></TableCell>
                                  <TableCell>{previewData.SGSTAmount}</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell><strong>IGST Total</strong></TableCell>
                                  <TableCell>{previewData.IGSTAmount}</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell><strong>Transport</strong></TableCell>
                                  <TableCell>{previewData.Transport}</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell><strong>Grand Total</strong></TableCell>
                                  <TableCell>{previewData.Total}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>

                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    {/* bank details */}

                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight="bold"  >
                        Bank Details
                      </Typography>

                      <Box mt={1}><Typography><strong>Bank Name:</strong> {bankName}</Typography></Box>
                      <Box mt={1}><Typography><strong>Branch Name:</strong> {branchName}</Typography></Box>
                      <Box mt={1}><Typography><strong>Account No:</strong> {accountNo}</Typography></Box>
                      <Box mt={1}><Typography><strong>IFSCCode:</strong> {ifscCode}</Typography></Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Box width="100%" mt={2} ml={4}>
                      <Typography variant="h6" gutterBottom>
                        <strong>TERMS & CONDITIONS</strong>
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        1. Oils are best before 9 months from the manufacturing date and jaggery 12 months.
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        2. Replacement will not be entertained once we dispatch the stock.
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        3. Government taxes if any will be extra to your account.
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        4. Material will be dispatched within 5 to 10 days of the purchase order (depending upon the qty).
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        5. Rates are supposed to vary with the seed rates in the market.
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                      mt={2}
                    >
                      <Typography>
                        <strong>Subject to Kolhapur Jurisdiction</strong>
                      </Typography>
                    </Box>

                    {/* sign */}
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      width="100%"
                      mt={3}
                      pr={4}
                    >
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          For {comapanyName || "Aarohan Agro"}
                        </Typography>

                        <img
                          src={sign}
                          alt="Authorized Signatory"
                          style={{ height: '80px', objectFit: 'contain' }}
                        />

                        <Typography
                          variant="body2"
                          sx={{ borderTop: '1px solid #000', pt: 0.5, mt: 0.5 }}
                        >
                          Authorized Signatory
                        </Typography>
                      </Box>
                    </Box>

                  </Grid>

                </Box>
              ) : (
                <Typography>No data to preview</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={generatePDF} color="primary" ><PrintIcon sx={{ fontSize: 35 }} /></Button>
            <Button variant='contained' onClick={() => setPreviewOpen(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "65%",
              zIndex: 1000,
            },
          }}
        >
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: 'rgb(236, 253, 230)'
            }}
          >
            <Typography m={2} fontWeight="bold" variant="h6">
              {isEditing ? "Update B2B Sales Entry" : "Create B2B Sales Entry"}
            </Typography>

            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, m: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">Invoice No</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={invoiceNo}
                  size="small"
                  margin="none"
                  placeholder="Invoice No Autogerated"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Invoice Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker

                    value={invoiceDate ? new Date(invoiceDate) : null}

                    format="dd-MM-yyyy"
                    onChange={(newValue) => { setInvoiceDate(newValue); setErrors({ ...errors, invoiceDate: undefined }) }}
                    slotProps={{
                      textField: {
                        size: "small", fullWidth: true, error: !!errors.invoiceDate,
                        helperText: errors.invoiceDate
                      },
                    }}
                    renderInput={(params) => <TextField />}
                  />
                </LocalizationProvider>
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Terms</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="e.g. Advance Payment"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Due Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={dueDate ? new Date(dueDate) : null}
                    format="dd-MM-yyyy"
                    onChange={(newValue) => setDueDate(newValue)}
                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                    renderInput={(params) => <TextField />}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

              <Box flex={1} position="relative">
                <Typography variant="body2">Customer</Typography>
                <TextField

                  fullWidth
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:before': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                      opacity: 1,
                    }, mt: 1
                  }}
                  size="small"
                  //value={selectedAccount || ""} 
                  value={selectedAccount
                    ? accountOptions.find(({ Id }) => String(Id) === selectedAccount)?.AccountName || accountOptions.map((option) => option.AccountName)
                    : " "}
                  placeholder="Select Customer"
                  onClick={() =>

                    setShowDropdown(true)}

                  error={!!errors.selectedAccount}
                  helperText={errors.selectedAccount}

                />

                {showDropdown && (
                  <Paper
                    sx={{ position: "absolute", width: "100%", maxHeight: 250, overflowY: "auto", zIndex: 10, mt: 1, p: 2 }}
                  >
                    <TextField
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Search Customer Name"
                      fullWidth
                    />
                    <Box display="flex" gap={1} mt={1}>
                      <TextField value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        size="small" placeholder="Create New Customer" fullWidth />


                      {/*  */}

                      {/* <Typography variant="body2">GST No</Typography> */}
                      <TextField
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:after': {
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#44ad74',
                          }, mt: 2
                        }}
                        focused
                        value={customerGSTNo}
                        onChange={(e) => { setCustomerGSTNo(e.target.value); }}
                        size="small"
                        margin="none"
                        placeholder="Enter GST No"

                        fullWidth
                      />




                      <Button sx={{
                        background: 'var(--primary-color)',
                      }}
                        onClick={CreateCustomerMaster}

                        variant="contained"
                        startIcon={<AddCircleIcon sx={{ fontSize: '20px' }} />}
                      >

                        Add
                      </Button>
                    </Box>
                    <Box mt={1}>

                      {accountOptions.map((option) => (
                        <MenuItem
                          key={option.Id}
                          onClick={() => {
                            setSelectedAccount(option.Id.toString());
                            fetchAccounts(option.Id.toString())
                            // console.log('options', option)
                            setShowDropdown(false);
                          }}
                        >
                          {option.AccountName}
                        </MenuItem>
                      ))}
                    </Box>
                  </Paper>
                )}
              </Box>



              <Box flex={1}>
                <Typography variant="body2">Contact Number</Typography>
                <PhoneInput

                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputProps={{ name: "phone", required: true }}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    fontSize: "16px",
                    borderRadius: "5px",
                  }}
                  buttonStyle={{ borderRadius: "5px" }}

                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">Order No</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={orderNo}
                  onChange={(e) => { setOrderNo(e.target.value); setErrors({ ...errors, orderNo: undefined }) }}
                  size="small"
                  margin="none"
                  placeholder="Order No"
                  error={!!errors.orderNo}
                  helperText={errors.orderNo}
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Order Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={orderDate ? new Date(orderDate) : null} // Convert to Date object
                    format="dd-MM-yyyy"
                    onChange={(newValue) => { setOrderDate(newValue); setErrors({ ...errors, orderDate: undefined }) }}
                    slotProps={{
                      textField: {
                        size: "small", fullWidth: true, error: !!errors.orderDate,
                        helperText: errors.orderDate
                      },
                    }}
                    renderInput={(params) => <TextField />}
                  />
                </LocalizationProvider>
              </Box>

              <Box flex={1}>
                <Typography variant="body2">P.O.#</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={poNo}
                  onChange={(e) => setPoNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Purchase Order No"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Place Of Supply</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="e.g. Maharashtra (27)"
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">Sales Person</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={salesPerson}
                  onChange={(e) => setSalesPerson(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Sales Person"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Order Source</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={orderSource}
                  onChange={(e) => setOrderSource(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="e.g. Dealer"
                  fullWidth
                />
              </Box>

              <Box flex={2} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>

              <Box flex={1}>
                <Typography variant="body2">Product </Typography>


                <Autocomplete
                  fullWidth

                  size="small"
                  options={productOptions}
                  getOptionLabel={(option) => option.label}
                  value={productOptions.find((option) => option.value === selectedProductID) || null}


                  onChange={(event, newValue) => {
                    if (!selectedAccount) {
                      alert("Please select a Customer before selecting an item.");
                      return;
                    }
                    handleItemChange(newValue);
                  }}

                  renderInput={(params) => <TextField {...params} variant="standard" sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }} focused />}
                />


              </Box>

              <Box flex={1}>
                <Typography variant="body2">HSN/SAC</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="HSN/SAC"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">MRP</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="MRP"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Batch Ref#</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={batchRef}
                  onChange={(e) => setBatchRef(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Batch Ref#"
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">Quantity</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={quantity}
                  onChange={handleQuantityChange}
                  size="small"
                  margin="none"
                  placeholder="Quantity"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">Rate</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={rate}
                  onChange={handleRateChange}
                  size="small"
                  margin="none"
                  placeholder="Rate"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">Discount(Rs)</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={discount}
                  onChange={handleDiscountChange}
                  size="small"
                  margin="none"
                  placeholder="Discount"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">Amount</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={amount}
                  size="small"

                  // placeholder="Amount"
                  fullWidth


                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">CGST%</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={cgst}
                  onChange={(e) => setCGST(e.target.value)}
                  // onChange={handleCgstChange}
                  size="small"
                  margin="none"
                  //  placeholder="CGST"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">CGST Amount</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={cgstAmount}
                  size="small"
                  margin="none"
                  // placeholder="CGST Amount"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">SGST%</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={sgst}
                  // onChange={handleSgstChange}
                  onChange={(e) => setSGST(e.target.value)}
                  size="small"
                  margin="none"
                  //  placeholder="SGST"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">SGST Amount</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={sgstAmount}
                  size="small"
                  margin="none"
                  // placeholder="SGST Amount"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">IGST %</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={igst}
                  // onChange={handleIgstChange}
                  onChange={(e) => setIGST(e.target.value)}
                  size="small"
                  margin="none"
                  // placeholder="IGST%"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">IGST Amount</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={igstAmount}
                  size="small"
                  margin="none"
                  // placeholder=" IGST Amount"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>

          <Box m={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveOrAddRow}


              sx={{ background: 'var(--complementary-color)', mb: 2, gap: 1 }}
            >
              <AddCircleOutlineIcon />
              {editingRow !== null ? "Update Row" : "Add to Table"}
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr No</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>HSN/SAC</TableCell>
                    <TableCell>MRP</TableCell>
                    <TableCell>Batch Ref#</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>CGST %</TableCell>
                    <TableCell>CGST Amount</TableCell>
                    <TableCell>SGST %</TableCell>
                    <TableCell>SGST Amount</TableCell>
                    <TableCell>IGST %</TableCell>
                    <TableCell>IGST Amount</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>

                        {row.ProductName}

                      </TableCell>
                      <TableCell>{row.HSN || "-"}</TableCell>
                      <TableCell>{row.MRP || "-"}</TableCell>
                      <TableCell>{row.BatchRef || "-"}</TableCell>
                      <TableCell>

                        {row.Quantity || ""}


                      </TableCell>
                      <TableCell>

                        {row.Rate || ""}

                      </TableCell>

                      <TableCell>
                        {row.DiscountAmt || 0}
                      </TableCell>
                      <TableCell>

                        {row.Amount || ""}

                      </TableCell>
                      <TableCell>

                        {row.CGSTPercentage || 0}

                      </TableCell>
                      <TableCell>

                        {row.CGSTAmount || 0}

                      </TableCell>
                      <TableCell>

                        {row.SGSTPercentage || 0}

                      </TableCell>
                      <TableCell>

                        {row.SGSTAmount || 0}

                      </TableCell>
                      <TableCell>

                        {row.IGSTPercentage || 0}

                      </TableCell>
                      <TableCell>

                        {row.IGSTAmount || 0}

                      </TableCell>

                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenutableOpen(event, index)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl1}
                          open={Boolean(anchorEl1) && selectedRow === index}
                          onClose={handletableMenuClose}
                        >
                          <MenuItem onClick={() => handleEditRow(index)}>
                            Edit
                          </MenuItem>

                          <MenuItem onClick={() => handleDeleteRow(index)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ display: "flex", gap: 10, m: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2">Payment Mode</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={paymentMode}
                  onChange={(e) => { setPaymentMode(e.target.value); setErrors({ ...errors, paymentMode: undefined }) }}
                  size="small"
                  placeholder="Payment Mode"
                  error={!!errors.paymentMode}
                  helperText={errors.paymentMode}
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="body2">Transport</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  size="small"
                  placeholder="Transport"
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 6, mt: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="h6">SubTotal</Typography>
                <Box sx={{ fontSize: '20px' }}><b>{subTotalcal}</b></Box>



              </Box>
              <Box>
                <Typography variant="h6">CGST</Typography>
                <Box sx={{ fontSize: '20px' }}><b> {cgstTotal}</b></Box>


              </Box>
              <Box>
                <Typography variant="h6">SGST</Typography>
                <Box sx={{ fontSize: '20px' }}><b>{sgstTotal}</b></Box>


              </Box>
              <Box>
                <Typography variant="h6">IGST</Typography>
                <Box sx={{ fontSize: '20px' }}><b>{igstTotal}</b></Box>


              </Box>

              <Box>
                <Typography variant="h6">Total</Typography>
                {/* <Box sx={{ fontSize: '20px', mr: 4, }} ><b>{total} Rs</b></Box> */}
                <Box sx={{ fontSize: '20px', mr: 4, }} ><b>{Math.ceil(total)} Rs</b></Box>


              </Box>
            </Box>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            mb={5}
          >
            <Box>
              <Button sx={{
                background: 'var(--primary-color)',
              }} onClick={handleSubmit} variant="contained">
                {isEditing ? "update" : "save"}{" "}
              </Button>
            </Box>

            <Box>
              <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant="outlined">
                <b>Cancel</b>{" "}
              </Button>
            </Box>

            <Box>
              {isEditing && (
                <Button variant="contained" color="error" onClick={handleClickOpen}>
                  Delete
                </Button>
              )}

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
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
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default SalesB2B;