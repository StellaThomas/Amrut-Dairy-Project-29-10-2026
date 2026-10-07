

import { useState ,useEffect,useMemo} from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {Autocomplete,TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box,Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';
import moment from 'moment';
import { MRT_TablePagination as MUITablePagination } from "material-react-table";

const AccountReceivable = () => {
   const [fromDate, setFromDate] = useState(new Date());
const [toDate, setToDate] = useState(new Date());

    const [salesData, setSalesData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [accountOption, setAccountOption] = useState('');
      const [selectedAccountOption, setSelectedAccountOption] = useState('');
    //CUSTOMER ACCOUNTS

 const fetchAccounts  = async (inputValue) => {

    try {
      const response = await fetch(
        // "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=TypeCode&Colvalue=C"
         `https://amrutdairyapi.microtechsolutions.net.in/php/get/searchaccount.php?Table=Account&Colname=AccountName&Text=${inputValue}&TypeCode=c`
      );
      const result = await response.json();

    //    console.log("grp info:", result);

      const options = result.map((account) => ({
        value: account.Id,
        label: account.AccountName,
      }));

      setAccountOption(options);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

    useEffect(() => {
        fetchAccounts();
    }, []);


const getSalesReport = () => {
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-CA'); // Local YYYY-MM-DD
    };

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    const url = `https://amrutdairyapi.microtechsolutions.net.in/php/accountreceivable.php?fromdate=${formattedFromDate}&todate=${formattedToDate}&AccountId=${selectedAccountOption?.value}`;
    
     console.log(" URL:", url); 

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then(data => {
            //console.log('data', data);
            setSalesData(data);
            setShowTable(true);
            setPreviewOpen(true);
        })
        .catch((error) => console.error(error));
};




      const handleGetSalesReport = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        getSalesReport();
    };

  const generatePDF = () => {
    // =====================================================
    // CHECK DATA
    // =====================================================
    if (!Array.isArray(salesData) || salesData.length === 0) {
        alert("No data available to generate PDF");
        return;
    }

    // =====================================================
    // CREATE PDF
    // =====================================================
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // =====================================================
    // PAGE BORDER
    // =====================================================
    doc.setLineWidth(0.5);

    doc.rect(
        5,
        5,
        pageWidth - 10,
        pageHeight - 10
    );

    // =====================================================
    // HEADER
    // Only AMRUT MILK PRODUCTS 2
    // =====================================================

    let y = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text(
        "AMRUT MILK PRODUCTS 2",
        pageWidth / 2,
        y,
        {
            align: "center",
        }
    );

    // =====================================================
    // HEADER LINE
    // =====================================================

    y += 10;

    doc.setLineWidth(0.5);

    doc.line(
        10,
        y,
        pageWidth - 10,
        y
    );

    y += 8;

    // =====================================================
    // TABLE HEADERS
    // =====================================================

    const tableHeaders = [
        "Date",
        "DocNo",
        "Contact",
        "Amount",
        "Source",
    ];

    // =====================================================
    // TABLE DATA
    // =====================================================

    const tableData = salesData.map((item) => {
        return [
            item.Date || "-",
            item.DocNo || "-",
            item.Contact || "-",
            Number(item.Amount || 0).toFixed(2),
            item.Source || "-",
        ];
    });

    // =====================================================
    // TABLE
    // =====================================================

    autoTable(doc, {
        head: [tableHeaders],

        body: tableData,

        startY: y,

        margin: {
            left: 8,
            right: 8,
        },

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 1.5,
            textColor: 0,
            lineColor: [180, 180, 180],
            lineWidth: 0.2,
        },

        headStyles: {
            fillColor: [245, 245, 245],
            textColor: 0,
            fontStyle: "bold",
            fontSize: 8,
        },

        columnStyles: {
            0: {
                cellWidth: 35,
            },

            1: {
                cellWidth: 35,
            },

            2: {
                cellWidth: 45,
            },

            3: {
                cellWidth: 35,
                halign: "right",
            },

            4: {
                cellWidth: 35,
            },
        },

        // =================================================
        // NEW PAGE BORDER
        // =================================================

        didDrawPage: () => {
            doc.setLineWidth(0.5);

            doc.rect(
                5,
                5,
                pageWidth - 10,
                pageHeight - 10
            );
        },
    });

    // =====================================================
    // SAVE PDF
    // =====================================================

    doc.save("Account_receivable.pdf");
};






const exportToExcel = async (data) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("AccountReceivable");

  // Updated header row
  const headers = [
    "Date",
    "DocNo",
    "Contact",
    "Credit Amount",
    "Debit Amount",
    "Source",
    "Closing Balance", // 👈 Added this new column
  ];

  worksheet.addRow(headers);

  // Style header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  // Add data rows
  data.forEach((item) => {
    let creditAmount = 0;
    let debitAmount = 0;

    // 👇 segregate Credit/Debit
    if (item.Source?.toLowerCase() === "credit") {
      creditAmount = Number(item.Amount) || 0;
    } else if (item.Source?.toLowerCase() === "debit") {
      debitAmount = Number(item.Amount) || 0;
    }

    const closingBal = debitAmount - creditAmount; // 👈 Formula applied per row

    worksheet.addRow([
      item.Date || "",
      item.DocNo || "",
      item.Contact || "",
      creditAmount,
      debitAmount,
      item.Source || "",
      closingBal, // 👈 Inserted here
    ]);
  });

  // Auto-fit columns
  worksheet.columns.forEach((col) => {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 0;
      if (columnLength > maxLength) maxLength = columnLength;
    });
    col.width = maxLength + 5;
  });

  // Add Grand Total row
  const totalRowIndex = worksheet.lastRow.number + 2;
  const totalRow = worksheet.getRow(totalRowIndex);
  totalRow.getCell(3).value = "Grand Total";
  totalRow.getCell(3).font = { bold: true, size: 14 };
  totalRow.getCell(3).alignment = { horizontal: "right" };

  // Calculate totals dynamically based on data length
  const dataStartRow = 2;
  const dataEndRow = worksheet.lastRow.number - 2; // Adjust for totals

  totalRow.getCell(4).value = { formula: `SUM(D${dataStartRow}:D${dataEndRow})` };
  totalRow.getCell(5).value = { formula: `SUM(E${dataStartRow}:E${dataEndRow})` };
  totalRow.getCell(7).value = { formula: `E${totalRowIndex} - D${totalRowIndex}` }; // 👈 Closing Bal total

  // Style Grand Total row
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 14, color: { argb: "FF000000" } }; // Black bold text
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE699" }, // Light yellow background
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
    };
  });

  // Save workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `AccountReceivable_Report.xlsx`);
};




     const columns = useMemo(() => {
            return [
    
                {
                    accessorKey: 'Date',
                    header: 'Date',
                    size: 50,
                    Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
                },

                {
                    accessorKey: 'DocNo',
                    header: 'DocNo',
                    size: 50,

                },

                {
                    accessorKey: 'Contact',
                    header: 'Contact',
                    size: 50,

                    Cell: ({ cell }) => cell.getValue() || "-",
                },

                // {
                //     accessorKey: 'Amount',
                //     header: 'Amount',
                //     size: 50,

                // },

                {
                    accessorKey: 'Credit',
                    header: 'Credit Amount',
                    size: 50,
                    Cell: ({ row }) => (row.original.Source === 'Credit' ? row.original.Amount : '-'),

                },
                {
                    accessorKey: 'Debit',
                    header: 'Debit Amount',
                    size: 50,
                    Cell: ({ row }) => (row.original.Source === 'Debit' ? row.original.Amount : '-'),

                },

                {
                    accessorKey: 'Source',
                    header: 'Source',
                    size: 50,

                },

                {
                    accessorKey: 'Closing Balance',
                    header: 'Closing Balance',
                    size: 50,
                    Cell: ({ row }) => {
                        const debit = row.original.Source === 'Debit' ? parseFloat(row.original.Amount) : 0;
                        const credit = row.original.Source === 'Credit' ? parseFloat(row.original.Amount) : 0;
                        return (debit - credit).toLocaleString();
                    },
                }
            ];
        }, []);
        
      const table = useMaterialReactTable({
    columns,
    data: salesData,

    // ✅ Pagination OFF
    enablePagination: false,

    muiTableHeadCellProps: {
        style: {
            backgroundColor: "#E9ECEF",
            color: "black",
            fontSize: "16px",
        },
    },

    renderBottomToolbar: () => (
        <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            width="100%"
            gap={4}
            sx={{
                padding: "10px 16px",
            }}
        >
            {/* Credit Total */}
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    <b>Credit Total:</b>
                </Typography>

                <Typography variant="subtitle1" color="primary">
                    <b>
                        {grandTotal.toLocaleString("en-IN")}
                    </b>
                </Typography>
            </Box>

            {/* Debit Total */}
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    <b>Debit Total:</b>
                </Typography>

                <Typography variant="subtitle1" color="primary">
                    <b>
                        {grandDebitTotal.toLocaleString("en-IN")}
                    </b>
                </Typography>
            </Box>

            {/* Closing Balance Total */}
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    <b>Closing Bal Total:</b>
                </Typography>

                <Typography variant="subtitle1" color="primary">
                    <b>
                        {grandClosingBalTotal.toLocaleString("en-IN")}
                    </b>
                </Typography>
            </Box>
        </Box>
    ),
});

    const grandTotal = useMemo(() => {
        return salesData?.reduce((acc, row) =>
            acc + (row.Source === 'Credit' ? Number(row.Amount) || 0 : 0)
            , 0);
    }, [salesData]);

    const grandDebitTotal = useMemo(() => {
        return salesData?.reduce((acc, row) =>
            acc + (row.Source === 'Debit' ? Number(row.Amount) || 0 : 0)
            , 0);
    }, [salesData]);


    const grandClosingBalTotal = useMemo(() => {
    return salesData?.reduce((acc, row) => {
        const debit = row.Source === 'Debit' ? parseFloat(row.Amount) || 0 : 0;
        const credit = row.Source === 'Credit' ? parseFloat(row.Amount) || 0 : 0;
        return acc + (debit - credit);
    }, 0);
}, [salesData]);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Account Receivable</b></Typography>
            </Box>

            <Box sx={{ p: 5, height: 'auto' }}>

                <Box >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', gap: 10, }}>

                            <Box >
                                <Typography>From Date</Typography>
                                <DatePicker
                                    value={fromDate ? new Date(fromDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setFromDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", },
                                    }}
                                />
                            </Box>



                            <Box >
                                <Typography>To Date</Typography>
                                <DatePicker
                                    value={toDate ? new Date(toDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setToDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", },
                                    }}
                                />
                            </Box>


                           
                            <Box sx={{ width: 300 }}>
                                <Typography>Customers</Typography>
                                <Autocomplete
                                    size="small"
                                 
                                    options={accountOption}
                                    value={selectedAccountOption}
                                    onChange={(e, newValue) => setSelectedAccountOption(newValue)}
                                    onInputChange={(e, newInput) => fetchAccounts(newInput)}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Type Customer Name"  variant="standard" />
                                    )}
                                />

                            </Box>


                        </Box>



                    </LocalizationProvider>
                </Box>

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                    <Box>
                        <Button
                            sx={{
                                background: 'var(--primary-color)',
                            }}

                            onClick={handleGetSalesReport}
                            variant="contained"
                        >
                            Get Data
                        </Button>
                    </Box>

                </Box>
               

                    <>
                        {showTable && (
                            <>
                               <Dialog
    open={previewOpen}
    onClose={() => setPreviewOpen(false)}
    maxWidth="xlg"
    fullWidth
>
    {/* ================= HEADER ================= */}
    <DialogTitle
        sx={{
            textAlign: "center",
            borderBottom: "2px solid #222",
            pb: 2,
        }}
    >
        {/* Company Name */}
        <Typography
            sx={{
                fontSize: "38px",
                fontWeight: 900,
                letterSpacing: "1px",
                color: "#111",
            }}
        >
            AMRUT MILK PRODUCTS 2
        </Typography>

        {/* Address */}
        <Typography
            sx={{
                fontSize: "20px",
                color: "#555",
                mt: 1,
            }}
        >
            E-18 UDYAM CO-OP. SOCIETY, Y.P. POWAR NAGER, KOLHAPUR
        </Typography>

        {/* Phone + State */}
        <Typography
            sx={{
                fontSize: "18px",
                color: "#555",
                mt: 1,
            }}
        >
            Phone: 8830261523
            &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
            State: 27-Maharashtra
        </Typography>

        {/* Report Title */}
        <Typography
            sx={{
                fontSize: "22px",
                fontWeight: "bold",
                mt: 3,
                color: "#222",
            }}
        >
            Account Receivable from{" "}
            {fromDate
                ? new Date(fromDate).toLocaleDateString("en-GB")
                : "-"}
            {" "}to{" "}
            {toDate
                ? new Date(toDate).toLocaleDateString("en-GB")
                : "-"}
            {" "}For{" "}
            {selectedAccountOption
                ? selectedAccountOption.label
                : "-"}
        </Typography>
    </DialogTitle>


    {/* ================= TABLE ================= */}
    <DialogContent dividers>
        <Box>
            <MaterialReactTable
                table={table}
                enableColumnResizing
                muiTableHeadCellProps={{
                    sx: {
                        color: "var(--primary-color)",
                    },
                }}
                renderEmptyRowsFallback={() => null}
            />
        </Box>
    </DialogContent>


    {/* ================= ACTION BUTTONS ================= */}
    <DialogActions sx={{ p: 0 }}>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{
                borderTop: "2px solid #ddd",
                backgroundColor: "#f8f9fa",
                p: 2,
            }}
        >
            {/* Left side buttons */}
            <Box display="flex" gap={2}>

                {/* Print */}
                <Button
                    onClick={generatePDF}
                    color="primary"
                >
                    <PrintIcon sx={{ fontSize: 35 }} />
                </Button>

                {/* Excel */}
                <Button
                    variant="contained"
                    endIcon={<FileDownloadIcon />}
                    onClick={() => exportToExcel(salesData)}
                >
                    Excel Data
                </Button>

                {/* Close */}
                <Button
                    variant="contained"
                    onClick={() => setPreviewOpen(false)}
                    color="primary"
                >
                    Close
                </Button>

            </Box>
        </Box>
    </DialogActions>
</Dialog>
                            </>
                        )}
                    </>
                {/* )} */}
            </Box >
        </Box >
    );
};

export default AccountReceivable;














