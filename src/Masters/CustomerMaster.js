// import React, { useMemo, useState, useEffect } from 'react'
// import { Menu, Autocomplete, Alert, Box, useMediaQuery, Button, IconButton, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { MaterialReactTable, } from 'material-react-table';
// import { useTheme } from "@mui/material/styles";
// import '../Components/common.css'
// import axios from 'axios';
// import { toast } from "react-toastify";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import PhoneInput from "react-phone-input-2";
// import qs from 'qs';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import LastPageIcon from '@mui/icons-material/LastPage';
// import FirstPageIcon from '@mui/icons-material/FirstPage';

// const CustomerMaster = () => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const handleDrawerOpen = () => {
//     setIsDrawerOpen(true);
//     handleClearTemplate();
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//   };

//   //table
//   //tble data

//   const [data, setData] = useState([]);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);

//   const handleMenuOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };
//   const [idwiseData, setIdwiseData] = useState('')
//   const [addressId, setAddressId] = useState('')
//   const [accountId, setAccountId] = useState(null)
//   const handleEdit = () => {
//     if (currentRow) {
//        console.log("Editing item with ID:", currentRow.original);
//       setIdwiseData(currentRow.original.Id)
//       // console.log(currentRow.original.Id)

//       // setAccountId(currentRow.original.AccountId)
//       //  console.log('Accountidd',currentRow.original.AccountId)

//        setAccountId(currentRow.original.Id)
//        console.log('Accountidd',currentRow.original.Id)

//       setUpdatedAccountName(currentRow.original.AccountName)
//       setSelectedGroupOption(currentRow.original.GroupId)
//       setSelectedSubGroupOption(currentRow.original.SubGroupId)
//       setUpdatedCurrentBal(currentRow.original.OpeningBalance)
//       setDebitCredit(currentRow.original.DrORCr)
//       // setUpdatedAddress1(currentRow.original.Address1)
//       // setUpdatedAddress2(currentRow.original.Address2)
//       // setSelectedCity(currentRow.original.CityId)
//       // setSelectedState(currentRow.original.StateId)
//       // setUpdatedEmail(currentRow.original.EmailId)
//       // setUpdatedPincode(currentRow.original.Pincode)
//       // setupdatedMobile(currentRow.original.MobileNo)
//       // SetupdatedGSTNo(currentRow.original.GSTNo)
//       setupdatedIsSystem(currentRow.original.IsSystem)

//       // setAddressId(currentRow.original.Id)
//     }
//   };

//   // edit drawer
//   const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);
//   const handleEditDrawerOpen = () => {
//     handleEdit()
//     setEditIsDrawerOpen(true);
//     handleMenuOpen(false)

//   };

//   const handleEditDrawerClose = () => {
//     setEditIsDrawerOpen(false);
//   };
//   // console.log(idwiseData)
//  const [pageNo, setPageNo] = useState(1)
//   const fetchData = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow"
//     };

//     try {
//       const response = await fetch(`https://amrutdairyapi.microtechsolutions.net.in/php/get/getaccountbypage.php?TypeCode=c&PageNo=${pageNo}`, requestOptions);

//       const result = await response.json();
//       // console.log("Fetched result:", result);
//       setData(result.data);
//       setTotalPages(result.total_pages)
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [pageNo]);

//   const deleteCustomerMaster = async () => {
//     try {
//       // Delete Address First
//       const addressUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=Address&Id=${currentRow.original.Id}`;
//       console.log("Deleting Address:", addressUrl);

//       const addressResponse = await axios.get(addressUrl);
//       console.log("Address Deleted:", addressResponse.data);

//       // Delete Account After Address
//       const accountUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=Account&Id=${currentRow.original.AccountId}`;
//       console.log("Deleting Account:", accountUrl);

//       const accountResponse = await axios.get(accountUrl);
//       console.log("Account Deleted:", accountResponse.data);

//       toast.success("Customer master deleted successfully");
//       fetchData();

//     } catch (error) {
//       console.error("Error deleting customer:", error);
//     }
//   };

//   const columns = useMemo(() => {
//     return [
//       {
//         accessorKey: 'srNo',
//         header: 'Sr No',
//         size: 100,
//         Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
//       },
//       {
//         accessorKey: 'AccountName',
//         header: 'Account Name',
//         size: 150,
//       },

//       {
//         accessorKey: 'DrORCr',
//         header: 'Debit/Credit',
//         size: 150,
//       },

//       {
//         accessorKey: 'Address1',
//         header: 'Address 1',
//         size: 150,
//       },

//       {
//         accessorKey: 'Address2',
//         header: 'Address 2',
//         size: 150,
//       },

//       {
//         accessorKey: 'EmailId',
//         header: 'Email',
//         size: 150,
//       },

//      {
//   accessorKey: 'MobileNo',
//   header: 'Mobile No',
//   size: 150,
// },

// {
//   accessorKey: 'GSTNo',
//   header: 'GST No',
//   size: 150,
//   Cell: ({ cell }) => {
//     const gstNo = cell.getValue();

//     if (
//       !gstNo ||
//       String(gstNo).trim() === '' ||
//       String(gstNo).trim() === '270000000000000'
//     ) {
//       return '';
//     }

//     return String(gstNo).trim();
//   },
// },

// {
//   accessorKey: 'OpeningBalance',
//   header: 'Current Balance',
//   size: 150,
// },

//       {
//         id: 'actions',
//         header: 'Actions',
//         size: 150,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={(event) => handleMenuOpen(event, row)}
//           >
//             <MoreVertIcon />
//           </IconButton>
//         ),

//       },
//     ];
//   }, []);

//   const [accountCode, setAccountCode] = useState('')

//   const [AccountName, setAccountName] = useState('');
//   const [updatedAccountName, setUpdatedAccountName] = useState('');

//   const [currentBal, setCurrentBal] = useState('');
//   const [updatedcurrentBal, setUpdatedCurrentBal] = useState('');

//   const [debitCredit, setDebitCredit] = useState('');

//   const [typecode, setTypecode] = useState('C');
//   const [updatedtypecode, setUpdatedTypecode] = useState('C');

//   const [address1, setAddress1] = useState('');
//   const [updatedaddress1, setUpdatedAddress1] = useState('');

//   const [address2, setAddress2] = useState('');
//   const [updatedaddress2, setUpdatedAddress2] = useState('');

//   const [pincode, setPincode] = useState('');
//   const [updatedpincode, setUpdatedPincode] = useState('');

//   const [email, setEmail] = useState('');
//   const [updatedemail, setUpdatedEmail] = useState('');

//   const [mobileno, setMobile] = useState('');
//   const [updatedmobileno, setupdatedMobile] = useState('');

//   const [urls, setURLs] = useState('');

//   const [gstNo, SetGSTNo] = useState('');
//   const [updatedgstNo, SetupdatedGSTNo] = useState('');

//   const [issystem, setIsSystem] = useState(false);
// // Customer Type
// const [customerType, setCustomerType] = useState('');
// const [updatedCustomerType, setUpdatedCustomerType] = useState('');

//   const [updatedissystem, setupdatedIsSystem] = useState(false);

//   const [gst, setGst] = useState(false);

//   const [compliance, setCompliance] = useState(false);

//   //fetch groupId
//   const [groupOption, setGroupOption] = useState('');
//   const [selectedGroupOption, setSelectedGroupOption] = useState('');

//   const fetchGroup = async () => {
//     try {
//       const response = await fetch(
//         "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=accountgroup"
//       );
//       const result = await response.json();

//       // console.log("grp info:", result);

//       const options = result.map((grp) => ({
//         value: grp.Id,
//         label: grp.GroupName,
//       }));

//       setGroupOption(options);
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//     }
//   };

//   //fetch SubgroupId
//   const [subGroupOption, setSubGroupOption] = useState('');
//   const [selectedSubGroupOption, setSelectedSubGroupOption] = useState('');

//   const fetchSubGroup = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=subaccountgroup",
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         // console.log("grp info:", result);

//         const options = result.map((grp) => ({
//           value: grp.Id,
//           label: grp.SubGroupName,
//         }));

//         setSubGroupOption(options);

//       })
//       .catch((error) => console.error("Error fetching accounts:", error));
//   };

//   //for cityId
//   const [options, setOptions] = useState([]);
//   const [selectedCity, setSelectedCity] = useState(null);

//   const fetchCity = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=city",
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         // console.log("API Response:", result); // Debugging log

//         const cityOptions = result.map((city) => ({
//           value: city?.Id || "",
//           label: city?.CityName,
//         }));

//         setOptions(cityOptions);

//       })
//       .catch((error) => console.error("Error fetching cities:", error));
//   };
//   //for state id
//   const [stateOptions, setStateOptions] = useState([]);
//   const [loadingState, setLoadingState] = useState(false);
//   const [selectedState, setSelectedState] = useState(null);

//   const fetchState = async () => {
//     setLoadingState(true);

//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=state",
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         // console.log("API Response:", result); // Debugging log

//         const stateOptions = result.map((state) => ({
//           value: state?.Id || "",
//           label: state?.StateName || "Unknown",
//         }));

//         setStateOptions(stateOptions);

//       })
//       .catch((error) => console.error("Error fetching states:", error))
//       .finally(() => setLoadingState(false));
//   };

//   useEffect(() => {
//     fetchGroup();
//     fetchSubGroup();
//     fetchCity();
//     fetchState();
//     // fetchDataById(idwiseData)
//   }, [idwiseData]);

//   //create Customer Master
//   const CreateCustomerMaster = async () => {
//     try {
//       // Post Account Data
//       let accountData = qs.stringify({
//         'AccountName': AccountName,
//         'GroupId': selectedGroupOption,
//         'SubGroupId': selectedSubGroupOption,
//         'OpeningBalance': currentBal || '0',
//         'DrORCr': debitCredit,
//         'TypeCode': 'C',
//         'IsSystem': issystem,
//         'Depriciation': "0"
//       });

//       let accountConfig = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: accountData
//       };

//       const accountResponse = await axios.request(accountConfig);
//       console.log("Account Response:", accountResponse.data);

//       let accId = parseInt(accountResponse.data.Id);
//       setAccountId(accId);
//       console.log('accId', accId);

//       let addressData = qs.stringify({
//         'AccountId': accId,
//         'Address1': address1,
//         'Address2': address2,
//         'Address3': '',
//         'AreaId': '0',
//         'CityId': selectedCity,
//         'StateId': selectedState,
//         'Pincode': pincode,
//         'CountryId': '0',
//         'TelephoneNo': '0',
//         'FaxNo': '0',
//         'MobileNo': mobileno,
//         'EmailId': email,
//         'PANNo': '0',
//         'GSTNo': gstNo,
//         'CustomerType': customerType
//       });

//       let addressConfig = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: addressData
//       };

//       const addressResponse = await axios.request(addressConfig);
//       console.log("Address Response:", addressResponse.data);
//       handleDrawerClose()
//       handleClearTemplate();
//       toast.success("Customer Master created successfully");
//       fetchData();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   //clr all fields

// const handleClearTemplate = () => {
//   setAccountCode('');
//   setAccountName('');
//   setCurrentBal('');
//   setSelectedGroupOption('');
//   setSelectedSubGroupOption('');
//   setDebitCredit(' ');
//   setTypecode('');
//   setAddress1('');
//   setAddress2('');
//   setSelectedCity('');
//   setSelectedState('');
//   setPincode('');
//   setEmail(' ');
//   setMobile('');
//   setURLs('');
//   SetGSTNo('');
//   setIsSystem('');
//   setCustomerType('');
//   setUpdatedCustomerType('');
//   setGst(' ');
//   setCompliance('');
// }

//   //for update
//   const UpdateCustomerMaster = async () => {
//     try {
//       //  Post Account Data
//       let accountData = qs.stringify({
//         'AccountName': updatedAccountName,
//         'GroupId': selectedGroupOption,
//         'SubGroupId': selectedSubGroupOption,
//         'OpeningBalance': updatedcurrentBal || '0',
//         'DrORCr': debitCredit,
//         'TypeCode': 'C',
//         'IsSystem': updatedissystem,
//         'Depriciation': "0",
//         'Id': accountId
//       });
//       console.log("accountData", accountData)
//       let accountConfig = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://amrutdairyapi.microtechsolutions.net.in/php/updateaccount.php',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: accountData
//       };

//       const updateaccountResponse = await axios.request(accountConfig);
//       console.log("updateAccount Response:", updateaccountResponse.data);
//       //  let accId = parseInt(updateaccountResponse.data.Id)
//       //  setAccountId(accId)
//       // console.log('accId', accountId)

//       let addressData = qs.stringify({
//         'AccountId': accountId,
//         'Address1': updatedaddress1,
//         'Address2': updatedaddress2,
//         'Address3': '',
//         'AreaId': '0',
//         'CityId': selectedCity,
//         'StateId': selectedState,
//         'Pincode': updatedpincode,
//         'CountryId': '0',
//         'TelephoneNo': '0',
//         'FaxNo': '0',
//         'MobileNo': updatedmobileno,
//         'EmailId': updatedemail,
//         'PANNo': '0',
//         'GSTNo': updatedgstNo,
//         'Id': idwiseData,
//         'CustomerType': updatedCustomerType,
// 'Id': idwiseData

//       });

//       let addressConfig = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://amrutdairyapi.microtechsolutions.net.in/php/updateaddress.php',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: addressData
//       };

//       const addressResponse = await axios.request(addressConfig);
//       console.log("Address Response:", addressResponse.data);
//       toast.success("Customer Master updated successfully");
//       handleEditDrawerClose()
//       fetchData();

//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   //get Address
//   const getAddress=()=>{
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow"
//     };

//     fetch(`https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`, requestOptions)
//       .then((response) => response.json())
//       // .then((result) => console.log(result))
//       .then((result) => {
//         if (Array.isArray(result) && result.length > 0) {
//           const address = result[0];

//           console.log("Address Details:");
//           setUpdatedAddress1(address.Address1)
//           console.log("Address1:", address.Address1);

//           setUpdatedAddress2(address.Address2)
//           console.log("Address2:", address.Address2);

//         setSelectedCity(address.CityId)
//           console.log("CityId:", address.CityId);

//           setUpdatedEmail(address.EmailId)
//           console.log("EmailId:", address.EmailId.trim());

//           setupdatedMobile(address.MobileNo)
//           console.log("MobileNo:", address.MobileNo);

//           setUpdatedPincode(address.Pincode)
//           console.log("Pincode:", address.Pincode);

//           setSelectedState(address.StateId)
//           console.log("StateId:", address.StateId);

// const gstValue = String(address.GSTNo || '').trim();

// SetupdatedGSTNo(
//   gstValue === '270000000000000' ? '' : gstValue
// );

// console.log(
//   "GST:",
//   gstValue === '270000000000000' ? '' : gstValue
// );

// setUpdatedCustomerType(address.CustomerType || '');
// console.log(
//   "Customer Type:",
//   address.CustomerType
// );
//         } else {
//           console.log("No address found.");
//         }
//       })
//       .catch((error) => console.error(error));
//   }

// useEffect(() => {
//   if (accountId && isEditDrawerOpen) {
//     getAddress();
//   }
// }, [accountId, isEditDrawerOpen]);

//    ///Pagination
//    const [totalPages, setTotalPages] = useState(1);

//   return (
//     <Box>
//       <Box textAlign={'center'} >
//         <Typography variant='h4' color='var(--complementary-color)'><b>Customer Master</b></Typography>
//       </Box>
//       <Box sx={{
//         //  background: 'rgb(236, 253, 230)',
//         p: 5, height: 'auto'
//       }}>

//         <Box sx={{ display: 'flex', gap: 3 }}>
//           <Button sx={{ background: 'var(--complementary-color)', }}
//             variant="contained"
//             onClick={handleDrawerOpen}
//           >Create Customer Master </Button>
//         </Box>

//         <Box mt={4}>
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             enablePagination={false}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: '#E9ECEF',
//                 color: 'black',
//                 fontSize: '16px',
//             },
//             }}
//             renderBottomToolbarCustomActions={() => (
//               <Box
//                   mt={2}
//                   alignItems="center"
//                   display="flex"
//                   justifyContent="flex-end"
//                   width="100%"
//               >
//                   <FirstPageIcon sx={{ cursor: 'pointer' }} onClick={() => setPageNo(1)} />
//                   <KeyboardArrowLeftIcon
//                       sx={{ cursor: 'pointer' }}
//                       onClick={() => setPageNo((prev) => Math.max(Number(prev) - 1, 1))}
//                   />
//                   <Box> Page No </Box>
//                   <TextField
//                       sx={{ width: '4.5%', ml: 1 }}
//                       value={pageNo}
//                       onChange={(e) => setPageNo(e.target.value)}
//                       size="small"
//                   />
//                   <KeyboardArrowRightIcon
//                       sx={{ cursor: 'pointer' }}
//                       onClick={() => setPageNo((prev) => Number(prev) + 1)}
//                   />
//                   <LastPageIcon
//                       sx={{ cursor: 'pointer' }}
//                       onClick={() => setPageNo(totalPages)}
//                   />
//                   Total Pages : {totalPages}
//               </Box>
//           )}
//           />
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem
//               onClick={handleEditDrawerOpen}
//             >Edit </MenuItem>
//             <MenuItem
//               onClick={deleteCustomerMaster}
//             >
//               Delete</MenuItem>
//           </Menu>
//         </Box>

//         <Drawer
//           anchor="right"
//           open={isDrawerOpen}
//           onClose={handleDrawerClose}
//           PaperProps={{
//             sx: {
//               borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//               width: isSmallScreen ? "100%" : "800px",
//               zIndex: 1000,
//             },
//           }}
//         >
//           <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
//             <Typography m={2} variant="h6"><b>Create Customer Master</b></Typography>
//             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
//           </Box>
//           <Divider />

//           <Box>
//             <Box display="flex" alignItems="flex-start" gap={2}>
//               {/* Left Column */}
//               <Box flex={1}>
//                 {/* <Box m={1.5}>
//                   <Typography>Account Code</Typography>
//                   <TextField
//                     value={accountCode}
//                     onChange={(e) => setAccountCode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Code"
//                     fullWidth
//                   />
//                 </Box> */}

//                 <Box m={1.5}>
//                   <Typography>Account Name</Typography>
//                   <TextField
//                     value={AccountName}
//                     onChange={(e) => setAccountName(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Name"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Group</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedGroupOption}
//                       onChange={(event) => setSelectedGroupOption(event.target.value)}
//                     >
//                       {groupOption.length > 0 ? (
//                         groupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Type Code</Typography>
//                   <TextField
//                     value={typecode}
//                     disabled
//                     onChange={(e) => setTypecode(e.target.value)}
//                     size="small" placeholder="C" fullWidth />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 1</Typography>
//                   <TextField
//                     value={address1}
//                     onChange={(e) => setAddress1(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 1"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>City</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedCity || ""}
//                       onChange={(event) => setSelectedCity(event.target.value)}
//                     >
//                       {options.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Pincode</Typography>
//                   <TextField
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Pincode"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Mobile No</Typography>
//                   <PhoneInput
//                     country={"in"}
//                     value={mobileno}
//                     onChange={(phone) => setMobile(phone)}
//                     inputProps={{ name: "phone", required: true }}
//                     inputStyle={{
//                       width: "100%",
//                       height: "40px",
//                       fontSize: "16px",
//                       borderRadius: "5px",
//                     }}
//                     buttonStyle={{ borderRadius: "5px" }}
//                   />
//                 </Box>
//               </Box>

//               {/* Right Column */}
//               <Box flex={1}>
//                 <Box m={1.5}>
//                   <Typography>Opening Balance</Typography>
//                   <TextField
//                     value={currentBal}
//                     onChange={(e) => setCurrentBal(e.target.value)}
//                     size="small"
//                     placeholder="Enter Opening Balance"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Sub Group </Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedSubGroupOption}
//                       onChange={(event) => setSelectedSubGroupOption(event.target.value)}
//                     >
//                       {subGroupOption.length > 0 ? (
//                         subGroupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Debit/Credit</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={debitCredit}
//                       onChange={(event) => setDebitCredit(event.target.value)}
//                     >
//                       <MenuItem value="D">D</MenuItem>
//                       <MenuItem value="C">C</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 2</Typography>
//                   <TextField
//                     value={address2}
//                     onChange={(e) => setAddress2(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 2"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>State</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedState || ""}
//                       onChange={(event) => setSelectedState(event.target.value)}
//                     >
//                       {stateOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Email</Typography>
//                   <TextField
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     size="small"
//                     placeholder="Enter Email"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* <Box m={1.5}>
//                   <Typography>URL</Typography>
//                   <TextField
//                     value={urls}
//                     onChange={(e) => setURLs(e.target.value)}
//                     size="small"
//                     placeholder="Enter URL"
//                     fullWidth
//                   />
//                 </Box> */}

//                 <Box m={1.5}>
//                   <Typography>GST No</Typography>
//                   <TextField
//                     value={gstNo}
//                     onChange={(e) => SetGSTNo(e.target.value)}
//                     size="small"
//                     placeholder="Enter GST No"
//                     fullWidth
//                   />
//                 </Box>

//                <Box m={1.5}>
//   <Typography>Customer Type</Typography>

//   <FormControl fullWidth size="small">
//     <Select
//       value={customerType}
//       onChange={(event) =>
//         setCustomerType(event.target.value)
//       }
//       displayEmpty
//     >
//       <MenuItem value="" disabled>
//         Select Customer Type
//       </MenuItem>

//       <MenuItem value="D">
//         Dealer
//       </MenuItem>

//       <MenuItem value="C">
//         Caterers
//       </MenuItem>
//     </Select>
//   </FormControl>
// </Box>

//               </Box>
//             </Box>

//             <Box m={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={6}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={issystem}
//                     onChange={(event) => setIsSystem(event.target.checked)}
//                   />
//                 }
//                 label="Is System"
//               />
//               {/*

//               <FormControlLabel
//                 control={<Checkbox

//                   checked={gst}
//                   onChange={(event) => setGst(event.target.checked)}

//                 />}
//                 label="GST "
//               />

//               <FormControlLabel
//                 control={<Checkbox
//                   checked={compliance}
//                   onChange={(event) => setCompliance(event.target.checked)}

//                 />}
//                 label="Compliance"
//               /> */}
//             </Box>

//           </Box>

//           <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={5} mb={5} mt={3}>
//             <Box>
//               <Button sx={{
//                 background: 'var(--primary-color)',
//               }} onClick={CreateCustomerMaster} variant='contained'>Save </Button>
//             </Box>

//             <Box>
//               <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
//                 onClick={handleDrawerClose}
//                 variant='outlined'>
//                 <b>Cancel</b>

//               </Button>
//             </Box>
//           </Box>
//         </Drawer>

//         <Drawer
//           anchor="right"
//           open={isEditDrawerOpen}
//           onClose={handleEditDrawerClose}
//           PaperProps={{
//             sx: {
//               borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//               width: isSmallScreen ? "100%" : "800px",
//               zIndex: 1000,
//             },
//           }}
//         >
//           <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
//             <Typography m={2} variant="h6"><b>Update Customer Master</b></Typography>
//             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleEditDrawerClose} />
//           </Box>
//           <Divider />

//           <Box>

//             <Box display="flex" alignItems="flex-start" gap={2}>
//               {/* Left Column */}
//               <Box flex={1}>
//                 {/* <Box m={1.5}>
//                   <Typography>Account Code</Typography>
//                   <TextField
//                     value={updatedaccountCode}
//                     onChange={(e) => setUpdatedAccountCode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Code"
//                     fullWidth
//                   />
//                 </Box> */}

//                 <Box m={1.5}>
//                   <Typography>Account Name</Typography>
//                   <TextField
//                     value={updatedAccountName}
//                     onChange={(e) => setUpdatedAccountName(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Name"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Group</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedGroupOption}
//                       onChange={(event) => setSelectedGroupOption(event.target.value)}
//                     >
//                       {groupOption.length > 0 ? (
//                         groupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Type Code</Typography>
//                   <TextField
//                     value={updatedtypecode}
//                     disabled
//                      onChange={(e) => setUpdatedTypecode(e.target.value)}
//                     size="small" placeholder="Enter Type Code" fullWidth />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 1</Typography>
//                   <TextField
//                     value={updatedaddress1}
//                     onChange={(e) => setUpdatedAddress1(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 1"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>City</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedCity || ""}
//                       onChange={(event) => setSelectedCity(event.target.value)}
//                     >
//                       {options.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Pincode</Typography>
//                   <TextField
//                     value={updatedpincode}
//                     onChange={(e) => setUpdatedPincode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Pincode"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Mobile No</Typography>
//                   <PhoneInput
//                     country={"in"}
//                     value={updatedmobileno}
//                     onChange={(phone) => setupdatedMobile(phone)}
//                     inputProps={{ name: "phone", required: true }}
//                     inputStyle={{
//                       width: "100%",
//                       height: "40px",
//                       fontSize: "16px",
//                       borderRadius: "5px",
//                     }}
//                     buttonStyle={{ borderRadius: "5px" }}
//                   />
//                 </Box>
//               </Box>

//               {/* Right Column */}
//               <Box flex={1}>
//                 <Box m={1.5}>
//                   <Typography>Opening Balance</Typography>
//                   <TextField
//                     value={updatedcurrentBal}
//                     onChange={(e) => setUpdatedCurrentBal(e.target.value)}
//                     size="small"
//                     placeholder="Enter Current Balance"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Sub Group Id</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedSubGroupOption}
//                       onChange={(event) => setSelectedSubGroupOption(event.target.value)}
//                     >
//                       {subGroupOption.length > 0 ? (
//                         subGroupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Debit/Credit</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={debitCredit}
//                       onChange={(event) => setDebitCredit(event.target.value)}
//                     >
//                       <MenuItem value="D">D</MenuItem>
//                       <MenuItem value="C">C</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 2</Typography>
//                   <TextField
//                     value={updatedaddress2}
//                     onChange={(e) => setUpdatedAddress2(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 2"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>State</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedState || ""}
//                       onChange={(event) => setSelectedState(event.target.value)}
//                     >
//                       {stateOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Email</Typography>
//                   <TextField
//                     value={updatedemail}
//                     onChange={(e) => setUpdatedEmail(e.target.value)}
//                     size="small"
//                     placeholder="Enter Email"
//                     fullWidth
//                   />
//                 </Box>

//                 {/* <Box m={1.5}>
//                   <Typography>URL</Typography>
//                   <TextField
//                     value={updatedurls}
//                     onChange={(e) => setUpdatedURLs(e.target.value)}
//                     size="small"
//                     placeholder="Enter URL"
//                     fullWidth
//                   />
//                 </Box> */}

//                 <Box m={1.5}>
//                   <Typography>GST No</Typography>
//                   <TextField
//                     value={updatedgstNo}
//                     onChange={(e) => SetupdatedGSTNo(e.target.value)}
//                     size="small"
//                     placeholder="Enter GST No"
//                     fullWidth
//                   />
//                 </Box>

//                <Box m={1.5}>
//   <Typography>Customer Type</Typography>

//   <FormControl fullWidth size="small">
//     <Select
//       value={updatedCustomerType}
//       onChange={(event) =>
//         setUpdatedCustomerType(event.target.value)
//       }
//       displayEmpty
//     >
//       <MenuItem value="" disabled>
//         Select Customer Type
//       </MenuItem>

//       <MenuItem value="D">
//         Dealer
//       </MenuItem>

//       <MenuItem value="C">
//         Caterers
//       </MenuItem>
//     </Select>
//   </FormControl>
// </Box>

//               </Box>
//             </Box>

//             <Box m={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={6}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={updatedissystem}
//                     onChange={(event) => setupdatedIsSystem(event.target.checked)}
//                   />
//                 }
//                 label="Is System"
//               />

//               {/*
//               <FormControlLabel
//                 control={<Checkbox

//                   checked={updatedgst}
//                   onChange={(event) => setupdatedGst(event.target.checked)}

//                 />}
//                 label="GST "
//               />

//               <FormControlLabel
//                 control={<Checkbox
//                   checked={updatedcompliance}
//                   onChange={(event) => setupdatedCompliance(event.target.checked)}

//                 />}
//                 label="Compliance"
//               /> */}
//             </Box>

//           </Box>

//           <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//             <Box>
//               <Button onClick={UpdateCustomerMaster} sx={{
//                 background: 'var(--primary-color)',
//               }} variant='contained'>Save </Button>
//             </Box>

//             <Box>
//               <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleEditDrawerClose} variant='outlined'><b>Cancel</b> </Button>
//             </Box>
//           </Box>
//         </Drawer>

//       </Box>

//     </Box>
//   )
// }

// export default CustomerMaster





import React, { useMemo, useState, useEffect } from "react";
import {
  Menu,
  Autocomplete,
  Alert,
  Box,
  useMediaQuery,
  Button,
  IconButton,
  Typography,
  TextField,
  Drawer,
  Divider,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MaterialReactTable } from "material-react-table";
import { useTheme } from "@mui/material/styles";
import "../Components/common.css";
import axios from "axios";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneInput from "react-phone-input-2";
import qs from "qs";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";

const CustomerMaster = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    handleClearTemplate();
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  //table
  //tble data

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredData = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return data.filter((customer) => {
      const accountName = String(customer?.AccountName || "").toLowerCase();

      const mobileNo = String(customer?.MobileNo || "").toLowerCase();

      const emailId = String(customer?.EmailId || "").toLowerCase();

      const gstNo = String(customer?.GSTNo || "").toLowerCase();

      const customerType = String(customer?.CustomerType || "")
        .trim()
        .toUpperCase();

      // =========================
      // CUSTOMER CATEGORY
      // =========================
      let categoryName = "";

      if (customerType === "R") {
        categoryName = "retailer";
      } else if (customerType === "D") {
        categoryName = "dealer";
      } else if (customerType === "C") {
        categoryName = "caterers";
      }

      // =========================
      // CATEGORY FILTER
      // =========================
      const categoryMatch =
        categoryFilter === "" || customerType === categoryFilter;

      // =========================
      // SEARCH FILTER
      // =========================
      const searchMatch =
        search === "" ||
        accountName.includes(search) ||
        mobileNo.includes(search) ||
        emailId.includes(search) ||
        gstNo.includes(search) ||
        categoryName.includes(search);

      // =========================
      // CUSTOMER CREATED DATE
      // =========================
      const createdOn = customer?.CreatedOn?.date || "";

      // API date:
      // 2026-08-25 16:27:30.090000
      //
      // We only need:
      // 2026-08-25
      const customerDate = createdOn ? createdOn.substring(0, 10) : "";

      // =========================
      // FROM DATE FILTER
      // =========================
      const fromDateMatch =
        fromDate === "" || (customerDate !== "" && customerDate >= fromDate);

      // =========================
      // TO DATE FILTER
      // =========================
      const toDateMatch =
        toDate === "" || (customerDate !== "" && customerDate <= toDate);

      // =========================
      // ALL FILTERS
      // =========================
      return categoryMatch && searchMatch && fromDateMatch && toDateMatch;
    });
  }, [data, searchText, categoryFilter, fromDate, toDate]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [idwiseData, setIdwiseData] = useState("");
  const [addressId, setAddressId] = useState("");
  const [accountId, setAccountId] = useState(null);
  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original);
      setIdwiseData(currentRow.original.Id);
setAccountId(currentRow.original.AccountId);
      // console.log(currentRow.original.Id)

      // setAccountId(currentRow.original.AccountId)
      //  console.log('Accountidd',currentRow.original.AccountId)

     setAccountId(currentRow.original.AccountId);
console.log("Accountidd", currentRow.original.AccountId);

      setUpdatedAccountName(currentRow.original.AccountName);
      setSelectedGroupOption(currentRow.original.GroupId);
      setSelectedSubGroupOption(currentRow.original.SubGroupId);
      setUpdatedCurrentBal(currentRow.original.OpeningBalance || "0");
      setDebitCredit(currentRow.original.DrORCr);
      // setUpdatedAddress1(currentRow.original.Address1)
      // setUpdatedAddress2(currentRow.original.Address2)
      // setSelectedCity(currentRow.original.CityId)
      // setSelectedState(currentRow.original.StateId)
      // setUpdatedEmail(currentRow.original.EmailId)
      // setUpdatedPincode(currentRow.original.Pincode)
      // setupdatedMobile(currentRow.original.MobileNo)
      // SetupdatedGSTNo(currentRow.original.GSTNo)
      setupdatedIsSystem(currentRow.original.IsSystem);

      // setAddressId(currentRow.original.Id)
    }
  };

  // edit drawer
  const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);
 const handleEditDrawerOpen = () => {
  handleEdit();
  setEditIsDrawerOpen(true);
  handleMenuClose();
};

  const handleEditDrawerClose = () => {
    setEditIsDrawerOpen(false);
  };
  // console.log(idwiseData)
  const [pageNo, setPageNo] = useState(1);

// ======================================================
// FETCH ALL CUSTOMERS
// SAME LOGIC AS SALES CATERERS
// ======================================================
const fetchData = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    // --------------------------------------------------
    // 1. GET FIRST PAGE
    // --------------------------------------------------
    const firstResponse = await fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/get/getaccountbypage.php?TypeCode=c&PageNo=1`,
      requestOptions
    );

    if (!firstResponse.ok) {
      throw new Error(
        `API Error: ${firstResponse.status} ${firstResponse.statusText}`
      );
    }

    const firstResult = await firstResponse.json();

    console.log("========== CUSTOMER MASTER GET DATA ==========");
    console.log("First Customer:", firstResult?.data?.[0]);
    console.log("Total Pages:", firstResult?.total_pages);
    console.log("==============================================");

    // --------------------------------------------------
    // 2. GET TOTAL PAGES FROM API
    // --------------------------------------------------
    const totalPages = Number(firstResult?.total_pages || 1);

    // --------------------------------------------------
    // 3. FIRST PAGE DATA
    // --------------------------------------------------
    let allCustomers = [
      ...(Array.isArray(firstResult?.data)
        ? firstResult.data
        : []),
    ];

    // --------------------------------------------------
    // 4. GET REMAINING PAGES
    // --------------------------------------------------
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const response = await fetch(
          `https://amrutdairyapi.microtechsolutions.net.in/php/get/getaccountbypage.php?TypeCode=c&PageNo=${page}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(
            `API Error on Page ${page}: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        const pageData = Array.isArray(result?.data)
          ? result.data
          : [];

        console.log(
          `Customer Master - Page ${page}:`,
          pageData.length,
          "records"
        );

        allCustomers = [
          ...allCustomers,
          ...pageData,
        ];
      }
    }

    // --------------------------------------------------
    // 5. SAVE ALL CUSTOMERS
    // --------------------------------------------------
    console.log(
      "TOTAL CUSTOMER RECORDS:",
      allCustomers.length
    );

    console.log(
      "ALL CUSTOMER DATA:",
      allCustomers
    );

    setData(allCustomers);

  } catch (error) {
    console.error(
      "Error fetching all customer data:",
      error
    );

    setData([]);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

const deleteCustomerMaster = async () => {
  // Delete confirmation
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    // Delete Address First
    const addressUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=Address&Id=${currentRow.original.Id}`;
    console.log("Deleting Address:", addressUrl);

    const addressResponse = await axios.get(addressUrl);
    console.log("Address Deleted:", addressResponse.data);

    // Delete Account After Address
    const accountUrl = `https://amrutdairyapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=Account&Id=${currentRow.original.AccountId}`;
    console.log("Deleting Account:", accountUrl);

    const accountResponse = await axios.get(accountUrl);
    console.log("Account Deleted:", accountResponse.data);

    toast.success("Customer master deleted successfully");

    fetchData();
  } catch (error) {
    console.error("Error deleting customer:", error);
    toast.error("Failed to delete customer");
  }
};

  const columns = useMemo(() => {
    return [
   {
  accessorKey: "srNo",
  header: "Sr No",
  size: 100,
  Cell: ({ row }) => row.index + 1,
},

      {
        accessorKey: "AccountName",
        header: "Account Name",
        size: 150,
      },

      // =========================
      // CUSTOMER CATEGORY
      // =========================
      {
        accessorKey: "CustomerType",
        header: "Category",
        size: 150,
        Cell: ({ cell }) => {
          const type = String(cell.getValue() ?? "")
            .trim()
            .toUpperCase();

          if (type === "R") {
            return "Retailer";
          }

          if (type === "D") {
            return "Dealer";
          }

          if (type === "C") {
            return "Caterers";
          }

          return "";
        },
      },

      {
        accessorKey: "DrORCr",
        header: "Debit/Credit",
        size: 150,
      },

      {
        accessorKey: "Address1",
        header: "Address 1",
        size: 150,
      },

      // {
      //   accessorKey: "Address2",
      //   header: "Address 2",
      //   size: 150,
      // },

      // {
      //   accessorKey: "EmailId",
      //   header: "Email",
      //   size: 150,
      // },

      {
        accessorKey: "MobileNo",
        header: "Mobile No",
        size: 150,
      },

      // =========================
      // GST NUMBER
      // =========================
      // {
      //   accessorKey: "GSTNo",
      //   header: "GST No",
      //   size: 150,
      //   Cell: ({ cell }) => {
      //     const gstNo = cell.getValue();

      //     const gstValue = String(gstNo ?? "").trim();

      //     // Default GST number hide
      //     if (gstValue === "" || gstValue === "270000000000000") {
      //       return "";
      //     }

      //     return gstValue;
      //   },
      // },

      // {
      //   accessorKey: "OpeningBalance",
      //   header: "Current Balance",
      //   size: 150,
      // },

      // =========================
      // ACTIONS
      // =========================
      {
        id: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <IconButton onClick={(event) => handleMenuOpen(event, row)}>
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ];
  }, []);

  const [accountCode, setAccountCode] = useState("");

  const [AccountName, setAccountName] = useState("");
  const [updatedAccountName, setUpdatedAccountName] = useState("");

  const [currentBal, setCurrentBal] = useState("");
  const [updatedcurrentBal, setUpdatedCurrentBal] = useState("");

  const [debitCredit, setDebitCredit] = useState("");

  const [typecode, setTypecode] = useState("C");
  const [updatedtypecode, setUpdatedTypecode] = useState("C");

  const [address1, setAddress1] = useState("");
  const [updatedaddress1, setUpdatedAddress1] = useState("");

  const [address2, setAddress2] = useState("");
  const [updatedaddress2, setUpdatedAddress2] = useState("");

  const [pincode, setPincode] = useState("");
  const [updatedpincode, setUpdatedPincode] = useState("");

  const [email, setEmail] = useState("");
  const [updatedemail, setUpdatedEmail] = useState("");

  const [mobileno, setMobile] = useState("");
  const [updatedmobileno, setupdatedMobile] = useState("");

  const [urls, setURLs] = useState("");

  const [gstNo, SetGSTNo] = useState("");
  const [updatedgstNo, SetupdatedGSTNo] = useState("");

  const [issystem, setIsSystem] = useState(false);
  // Customer Type
  const [customerType, setCustomerType] = useState("");
  const [updatedCustomerType, setUpdatedCustomerType] = useState("");

  const [updatedissystem, setupdatedIsSystem] = useState(false);



  const [gst, setGst] = useState(false);

  const [compliance, setCompliance] = useState(false);

  //fetch groupId
 
const [groupOption, setGroupOption] = useState([]);
const [selectedGroupOption, setSelectedGroupOption] = useState("");

const fetchGroup = async () => {
  try {
    const response = await fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=AccountGroup"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Account Groups");
    }

    const result = await response.json();

    const options = (Array.isArray(result) ? result : []).map((grp) => ({
      value: String(grp.Id),
      label: grp.GroupName,
    }));

    setGroupOption(options);
    console.log("Account Group Options:", options);
  } catch (error) {
    console.error("Error fetching Account Groups:", error);
    setGroupOption([]);
  }
};


  //fetch SubgroupId
  const [subGroupOption, setSubGroupOption] = useState("");
  const [selectedSubGroupOption, setSelectedSubGroupOption] = useState("");

  const fetchSubGroup = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=subaccountgroup",
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log("grp info:", result);

        const options = result.map((grp) => ({
          value: grp.Id,
          label: grp.SubGroupName,
        }));

        setSubGroupOption(options);
      })
      .catch((error) => console.error("Error fetching accounts:", error));
  };

  //for cityId
  const [options, setOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const fetchCity = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=city",
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log("API Response:", result); // Debugging log

        const cityOptions = result.map((city) => ({
          value: city?.Id || "",
          label: city?.CityName,
        }));

        setOptions(cityOptions);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };
  //for state id
  const [stateOptions, setStateOptions] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  const fetchState = async () => {
    setLoadingState(true);

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://amrutdairyapi.microtechsolutions.net.in/php/get/gettable.php?Table=state",
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log("API Response:", result); // Debugging log

        const stateOptions = result.map((state) => ({
          value: state?.Id || "",
          label: state?.StateName || "Unknown",
        }));

        setStateOptions(stateOptions);
      })
      .catch((error) => console.error("Error fetching states:", error))
      .finally(() => setLoadingState(false));
  };

 useEffect(() => {
  fetchGroup();
  fetchSubGroup();
  fetchCity();
  fetchState();
}, []);
  //create Customer Master

  const [isSaving, setIsSaving] = useState(false);
  
const CreateCustomerMaster = async () => {
  // ================================
  // 1. ACCOUNT NAME VALIDATION
  // ================================
  if (!AccountName || AccountName.trim() === "") {
    toast.error("Customer Name is required");
    return;
  }

  // ================================
  // 2. MOBILE NUMBER VALIDATION
  // ================================
  if (!mobileno || mobileno.trim() === "") {
    toast.error("Mobile Number is required");
    return;
  }

  // ================================
  // 3. CUSTOMER TYPE VALIDATION
  // ================================
  if (!customerType || customerType.trim() === "") {
    toast.error("Customer Type is required");
    return;
  }

  // ================================
  // 4. NORMALIZE VALUES
  // ================================
  const newCustomerName = String(AccountName || "")
    .trim()
    .toLowerCase();

  const newCustomerMobile = String(mobileno || "")
    .replace(/\D/g, "");

  // ================================
  // 5. DUPLICATE CUSTOMER CHECK
  // ================================
  const duplicateCustomer = data.find((customer) => {
    const existingName = String(customer.AccountName || "")
      .trim()
      .toLowerCase();

    const existingMobile = String(customer.MobileNo || "")
      .replace(/\D/g, "");

    return (
      existingName === newCustomerName &&
      existingMobile === newCustomerMobile
    );
  });

  if (duplicateCustomer) {
    toast.error(
      "Customer with same Name and Mobile Number already exists"
    );
    return;
  }

  setIsSaving(true);

  // ================================
  // 6. CREATE CUSTOMER
  // ================================
  try {
    // --------------------------------
    // POST ACCOUNT DATA
    // --------------------------------
    const accountData = qs.stringify({
      AccountName: AccountName.trim(),
      GroupId: selectedGroupOption || "0",
      SubGroupId: selectedSubGroupOption || "0",
      OpeningBalance: currentBal || "0",
      DrORCr: debitCredit || "",
      TypeCode: "C",
      IsSystem: issystem || false,
      Depriciation: "0",
    });

    const accountConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://amrutdairyapi.microtechsolutions.net.in/php/postaccount.php",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: accountData,
    };

    const accountResponse = await axios.request(accountConfig);

    console.log("Account Response:", accountResponse.data);

    // --------------------------------
    // GET ACCOUNT ID
    // --------------------------------
    const accId = parseInt(accountResponse?.data?.Id, 10);

    console.log("Account ID:", accId);

    // --------------------------------
    // ACCOUNT ID VALIDATION
    // --------------------------------
    if (!accId || Number.isNaN(accId)) {
      toast.error("Account creation failed. Account ID not received.");
      return;
    }

    setAccountId(accId);

    // --------------------------------
    // POST ADDRESS DATA
    // --------------------------------
    const addressData = qs.stringify({
      AccountId: accId,
      Address1: address1 || "",
      Address2: address2 || "",
      Address3: "",
      AreaId: "0",
      CityId: selectedCity || "0",
      StateId: selectedState || "0",
      Pincode: pincode || "",
      CountryId: "0",
      TelephoneNo: "0",
      FaxNo: "0",
      MobileNo: mobileno || "",
      EmailId: email || "",
      PANNo: "0",
      GSTNo: gstNo || "",
      CustomerType: customerType || "",
    });

    const addressConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://amrutdairyapi.microtechsolutions.net.in/php/postaddress.php",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: addressData,
    };

    const addressResponse = await axios.request(addressConfig);

    console.log("Address Response:", addressResponse.data);

    // --------------------------------
    // SUCCESS
    // --------------------------------
    toast.success("Customer Master created successfully");

    handleDrawerClose();

    handleClearTemplate();

    await fetchData();
 } catch (error) {
  console.error("Error creating customer:", error);

  console.error(
    "API Error Response:",
    error?.response?.data
  );

  toast.error("Failed to create customer");
} finally {
  setIsSaving(false);
}
};




  

  //clr all fields

  const handleClearTemplate = () => {
    setAccountCode("");
    setAccountName("");
    setCurrentBal("0");
    setSelectedGroupOption("");
    setSelectedSubGroupOption("");
    setDebitCredit("");
    setTypecode("");
    setAddress1("");
    setAddress2("");
    setSelectedCity("");
    setSelectedState("");
    setPincode("");
    setEmail("");
    setMobile("");
    setURLs("");
    SetGSTNo("");
    setIsSystem("");
    setCustomerType("");
    setUpdatedCustomerType("");
    setGst(" ");
    setCompliance("");
  };

  //for update

const UpdateCustomerMaster = async () => {
  // =====================================================
  // 1. CUSTOMER NAME VALIDATION
  // =====================================================
  if (!updatedAccountName || updatedAccountName.trim() === "") {
    toast.error("Customer Name is required");
    return;
  }

  // =====================================================
  // 2. MOBILE NUMBER VALIDATION
  // =====================================================
  if (!updatedmobileno || String(updatedmobileno).trim() === "") {
    toast.error("Mobile Number is required");
    return;
  }

  // =====================================================
  // 3. CUSTOMER TYPE VALIDATION
  // =====================================================
  if (!updatedCustomerType || updatedCustomerType.trim() === "") {
    toast.error("Customer Type is required");
    return;
  }

  // =====================================================
  // 4. NORMALIZE NEW CUSTOMER VALUES
  // =====================================================
  const newCustomerName = String(updatedAccountName || "")
    .trim()
    .toLowerCase();

  const newCustomerMobile = String(updatedmobileno || "")
    .replace(/\D/g, "");

  // =====================================================
  // 5. DUPLICATE CUSTOMER CHECK
  //    Same Name + Same Mobile
  //    Ignore current customer
  // =====================================================
  const duplicateCustomer = data.find((customer) => {
    // -----------------------------------------------
    // Ignore current customer
    // -----------------------------------------------
    const isCurrentCustomer =
      String(customer.Id) === String(idwiseData) ||
      String(customer.AccountId) === String(accountId);

    if (isCurrentCustomer) {
      return false;
    }

    // -----------------------------------------------
    // Existing customer name
    // -----------------------------------------------
    const existingName = String(customer.AccountName || "")
      .trim()
      .toLowerCase();

    // -----------------------------------------------
    // Existing customer mobile
    // -----------------------------------------------
    const existingMobile = String(customer.MobileNo || "")
      .replace(/\D/g, "");

    // -----------------------------------------------
    // Compare
    // -----------------------------------------------
    return (
      existingName === newCustomerName &&
      existingMobile === newCustomerMobile
    );
  });

  // =====================================================
  // 6. DUPLICATE FOUND
  // =====================================================
  if (duplicateCustomer) {
    toast.error(
      "Customer with same Name and Mobile Number already exists"
    );
    return;
  }

  // =====================================================
  // 7. ACCOUNT ID VALIDATION
  // =====================================================
  if (!accountId || Number.isNaN(Number(accountId))) {
    console.error("Invalid Account ID:", accountId);
    toast.error("Invalid Account ID. Cannot update customer.");
    return;

  }

  setIsSaving(true);

  // =====================================================
  // 8. START UPDATE
  // =====================================================
  try {
    // ===================================================
    // ACCOUNT DATA
    // ===================================================
    const accountData = qs.stringify({
      AccountName: String(updatedAccountName || "").trim(),

      GroupId: selectedGroupOption || "0",

      SubGroupId: selectedSubGroupOption || "0",

      OpeningBalance: updatedcurrentBal || "0",

      DrORCr: debitCredit || "",

      TypeCode: "C",

      IsSystem: updatedissystem || false,

      Depriciation: "0",

      Id: accountId,
    });

    console.log(
      "ACCOUNT UPDATE DATA:",
      accountData
    );

    // ===================================================
    // ACCOUNT CONFIG
    // ===================================================
    const accountConfig = {
      method: "post",

      maxBodyLength: Infinity,

      url:
        "https://amrutdairyapi.microtechsolutions.net.in/php/updateaccount.php",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      data: accountData,
    };

    // ===================================================
    // UPDATE ACCOUNT
    // ===================================================
    const updateaccountResponse =
      await axios.request(accountConfig);

    console.log(
      "UPDATE ACCOUNT RESPONSE:",
      updateaccountResponse.data
    );

    // ===================================================
    // ADDRESS DATA
    // ===================================================
    const addressData = qs.stringify({
      AccountId: accountId,

      Address1: updatedaddress1 || "",

      Address2: updatedaddress2 || "",

      Address3: "",

      AreaId: "0",

      CityId: selectedCity || "0",

      StateId: selectedState || "0",

      Pincode: updatedpincode || "",

      CountryId: "0",

      TelephoneNo: "0",

      FaxNo: "0",

      MobileNo: updatedmobileno || "",

      EmailId: updatedemail || "",

      PANNo: "0",

      GSTNo: updatedgstNo || "",

      Id: idwiseData,

      CustomerType: updatedCustomerType || "",
    });

    console.log(
      "ADDRESS UPDATE DATA:",
      addressData
    );

    // ===================================================
    // ADDRESS CONFIG
    // ===================================================
    const addressConfig = {
      method: "post",

      maxBodyLength: Infinity,

      url:
        "https://amrutdairyapi.microtechsolutions.net.in/php/updateaddress.php",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      data: addressData,
    };

    // ===================================================
    // UPDATE ADDRESS
    // ===================================================
    const addressResponse =
      await axios.request(addressConfig);

    console.log(
      "UPDATE ADDRESS RESPONSE:",
      addressResponse.data
    );

    // ===================================================
    // SUCCESS
    // ===================================================
    toast.success(
      "Customer Master updated successfully"
    );

    // Close edit drawer
    handleEditDrawerClose();

    // Refresh customer list
    await fetchData();

  } catch (error) {
    // ===================================================
    // ERROR LOG
    // ===================================================
    console.error(
      "Error updating Customer Master:",
      error
    );

    // API response error
    console.error(
      "API Error Response:",
      error?.response?.data
    );

    // HTTP status
    console.error(
      "API Error Status:",
      error?.response?.status
    );

    toast.error(
      "Failed to update Customer Master"
    );
  }
};

  //get Address
  const getAddress = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://amrutdairyapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${accountId}`,
      requestOptions,
    )
      .then((response) => response.json())
      // .then((result) => console.log(result))
      .then((result) => {
       if (Array.isArray(result) && result.length > 0) {
  const address = result[0];

  console.log("Address Details:", address);

  // Address 1
  const address1 = address.Address1 || "";
  setUpdatedAddress1(address1);
  console.log("Address1:", address1);

  // Address 2
  const address2 = address.Address2 || "";
  setUpdatedAddress2(address2);
  console.log("Address2:", address2);

  // City
  const cityId = address.CityId || "";
  setSelectedCity(cityId);
  console.log("CityId:", cityId);

  // Email
  const email = address.EmailId || "";
  setUpdatedEmail(email);
  console.log("EmailId:", email);

  // Mobile
  const mobile = address.MobileNo || "";
  setupdatedMobile(mobile);
  console.log("MobileNo:", mobile);

  // Pincode
  const pincode = address.Pincode || "";
  setUpdatedPincode(pincode);
  console.log("Pincode:", pincode);

  // State
  const stateId = address.StateId || "";
  setSelectedState(stateId);
  console.log("StateId:", stateId);

  // GST
  const gstValue = String(address.GSTNo || "").trim();

  const finalGST =
    gstValue === "270000000000000" ? "" : gstValue;

  SetupdatedGSTNo(finalGST);

  console.log("GST:", finalGST);

  // Customer Type
  const customerType = address.CustomerType || "";
  setUpdatedCustomerType(customerType);
  console.log("Customer Type:", customerType);
} else {
          console.log("No address found.");
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (accountId && isEditDrawerOpen) {
      getAddress();
    }
  }, [accountId, isEditDrawerOpen]);

  ///Pagination
  const [totalPages, setTotalPages] = useState(1);

  return (
    <Box>
      <Box textAlign={"center"}>
        <Typography variant="h4" color="var(--complementary-color)">
          <b>Customer Master</b>
        </Typography>
      </Box>
      <Box
        sx={{
          //  background: 'rgb(236, 253, 230)',
          p: 5,
          height: "auto",
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            sx={{ background: "var(--complementary-color)" }}
            variant="contained"
            onClick={handleDrawerOpen}
          >
            Create Customer Master{" "}
          </Button>
        </Box>

        <Box mt={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            {/* From Date */}
            <TextField
              label="From Date"
              type="date"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: "180px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />

            {/* To Date */}
            <TextField
              label="To Date"
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: "180px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />

            {/* Search */}
            <TextField
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Customer..."
              sx={{
                width: "300px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Box>

          <MaterialReactTable
            columns={columns}
            data={filteredData}
            enablePagination={false}
            enableBottomToolbar={false}
            muiTableContainerProps={{
              sx: {
                maxHeight: "60vh",
                overflowY: "auto",
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#E9ECEF",
                color: "black",
                fontSize: "16px",
              },
            }}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditDrawerOpen}>Edit</MenuItem>

            <MenuItem onClick={deleteCustomerMaster}>Delete</MenuItem>
          </Menu>
        </Box>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "800px",
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
              background: "rgb(236, 253, 230)",
            }}
          >
            <Typography m={2} variant="h6">
              <b>Create Customer Master</b>
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <Divider />

          <Box>
            <Box display="flex" alignItems="flex-start" gap={2}>
              {/* Left Column */}
              <Box flex={1}>
                {/* <Box m={1.5}>
                  <Typography>Account Code</Typography>
                  <TextField
                    value={accountCode}
                    onChange={(e) => setAccountCode(e.target.value)}
                    size="small"
                    placeholder="Enter Account Code"
                    fullWidth
                  />
                </Box> */}

                <Box m={1.5}>
                  <Typography>Account Name</Typography>
                  <TextField
                    value={AccountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    size="small"
                    placeholder="Enter Account Name"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Group</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedGroupOption}
                      onChange={(event) =>
                        setSelectedGroupOption(event.target.value)
                      }
                    >
                      {groupOption.length > 0 ? (
                        groupOption.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No options available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Type Code</Typography>
                  <TextField
                    value={typecode}
                    disabled
                    onChange={(e) => setTypecode(e.target.value)}
                    size="small"
                    placeholder="C"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Address 1</Typography>
                  <TextField
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    size="small"
                    placeholder="Enter Address 1"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>City</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedCity || ""}
                      onChange={(event) => setSelectedCity(event.target.value)}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Pincode</Typography>
                  <TextField
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    size="small"
                    placeholder="Enter Pincode"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Mobile No</Typography>
                  <PhoneInput
                    country={"in"}
                    value={mobileno}
                    onChange={(phone) => setMobile(phone)}
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

              {/* Right Column */}
              <Box flex={1}>
                <Box m={1.5}>
                  <Typography>Opening Balance</Typography>
                  <TextField
                    value={currentBal}
                    onChange={(e) => setCurrentBal(e.target.value)}
                    size="small"
                    placeholder="Enter Opening Balance"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Sub Group </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedSubGroupOption}
                      onChange={(event) =>
                        setSelectedSubGroupOption(event.target.value)
                      }
                    >
                      {subGroupOption.length > 0 ? (
                        subGroupOption.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No options available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Debit/Credit</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={debitCredit}
                      onChange={(event) => setDebitCredit(event.target.value)}
                    >
                      <MenuItem value="D">D</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Address 2</Typography>
                  <TextField
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    size="small"
                    placeholder="Enter Address 2"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>State</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedState || ""}
                      onChange={(event) => setSelectedState(event.target.value)}
                    >
                      {stateOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Email</Typography>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    placeholder="Enter Email"
                    fullWidth
                  />
                </Box>

                {/* <Box m={1.5}>
                  <Typography>URL</Typography>
                  <TextField
                    value={urls}
                    onChange={(e) => setURLs(e.target.value)}
                    size="small"
                    placeholder="Enter URL"
                    fullWidth
                  />
                </Box> */}

                <Box m={1.5}>
                  <Typography>GST No</Typography>
                  <TextField
                    value={gstNo}
                    onChange={(e) => SetGSTNo(e.target.value)}
                    size="small"
                    placeholder="Enter GST No"
                    fullWidth
                  />
                </Box>

              <Box m={1.5}>
  <Typography>Customer Type</Typography>

  <FormControl fullWidth size="small">
    <Select
      value={customerType}
      onChange={(event) => setCustomerType(event.target.value)}
      displayEmpty
    >
      <MenuItem value="" disabled>
        Select Customer Type
      </MenuItem>

      <MenuItem value="R">Regular</MenuItem>
      <MenuItem value="D">Dealer</MenuItem>
      <MenuItem value="C">Caterers</MenuItem>
    </Select>
  </FormControl>
</Box>
              </Box>
            </Box>

            <Box
              m={2}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={6}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={issystem}
                    onChange={(event) => setIsSystem(event.target.checked)}
                  />
                }
                label="Is System"
              />
              {/* 

              <FormControlLabel
                control={<Checkbox

                  checked={gst}
                  onChange={(event) => setGst(event.target.checked)}

                />}
                label="GST "
              />


              <FormControlLabel
                control={<Checkbox
                  checked={compliance}
                  onChange={(event) => setCompliance(event.target.checked)}

                />}
                label="Compliance"
              /> */}
            </Box>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={5}
            mb={5}
            mt={3}
          >
            <Box>
             <Button
  onClick={CreateCustomerMaster}
  disabled={isSaving}
  variant="contained"
>
  {isSaving ? "Saving..." : "Save"}
</Button>
            </Box>

            <Box>
              <Button
                sx={{
                  borderColor: "var(--complementary-color)",
                  color: "var(--complementary-color)",
                }}
                onClick={handleDrawerClose}
                variant="outlined"
              >
                <b>Cancel</b>
              </Button>
            </Box>
          </Box>
        </Drawer>

        <Drawer
          anchor="right"
          open={isEditDrawerOpen}
          onClose={handleEditDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "800px",
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
              background: "rgb(236, 253, 230)",
            }}
          >
            <Typography m={2} variant="h6">
              <b>Update Customer Master</b>
            </Typography>
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={handleEditDrawerClose}
            />
          </Box>
          <Divider />

          <Box>
            <Box display="flex" alignItems="flex-start" gap={2}>
              {/* Left Column */}
              <Box flex={1}>
                {/* <Box m={1.5}>
                  <Typography>Account Code</Typography>
                  <TextField
                    value={updatedaccountCode}
                    onChange={(e) => setUpdatedAccountCode(e.target.value)}
                    size="small"
                    placeholder="Enter Account Code"
                    fullWidth
                  />
                </Box> */}

                <Box m={1.5}>
                  <Typography>Account Name</Typography>
                  <TextField
                    value={updatedAccountName}
                    onChange={(e) => setUpdatedAccountName(e.target.value)}
                    size="small"
                    placeholder="Enter Account Name"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Group</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedGroupOption}
                      onChange={(event) =>
                        setSelectedGroupOption(event.target.value)
                      }
                    >
                      {groupOption.length > 0 ? (
                        groupOption.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No options available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Type Code</Typography>
                  <TextField
                    value={updatedtypecode}
                    disabled
                    onChange={(e) => setUpdatedTypecode(e.target.value)}
                    size="small"
                    placeholder="Enter Type Code"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Address 1</Typography>
                  <TextField
                    value={updatedaddress1}
                    onChange={(e) => setUpdatedAddress1(e.target.value)}
                    size="small"
                    placeholder="Enter Address 1"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>City</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedCity || ""}
                      onChange={(event) => setSelectedCity(event.target.value)}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Pincode</Typography>
                  <TextField
                    value={updatedpincode}
                    onChange={(e) => setUpdatedPincode(e.target.value)}
                    size="small"
                    placeholder="Enter Pincode"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Mobile No</Typography>
                  <PhoneInput
                    country={"in"}
                    value={updatedmobileno}
                    onChange={(phone) => setupdatedMobile(phone)}
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

              {/* Right Column */}
              <Box flex={1}>
                <Box m={1.5}>
                  <Typography>Opening Balance</Typography>
                 <TextField
  value={updatedcurrentBal}
  onChange={(e) => setUpdatedCurrentBal(e.target.value)}
  size="small"
  placeholder="Enter Opening Balance"
  fullWidth
/>
                </Box>

                <Box m={1.5}>
                  <Typography>Sub Group Id</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedSubGroupOption}
                      onChange={(event) =>
                        setSelectedSubGroupOption(event.target.value)
                      }
                    >
                      {subGroupOption.length > 0 ? (
                        subGroupOption.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No options available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Debit/Credit</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={debitCredit}
                      onChange={(event) => setDebitCredit(event.target.value)}
                    >
                      <MenuItem value="D">D</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Address 2</Typography>
                  <TextField
                    value={updatedaddress2}
                    onChange={(e) => setUpdatedAddress2(e.target.value)}
                    size="small"
                    placeholder="Enter Address 2"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>State</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedState || ""}
                      onChange={(event) => setSelectedState(event.target.value)}
                    >
                      {stateOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Email</Typography>
                  <TextField
                    value={updatedemail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    size="small"
                    placeholder="Enter Email"
                    fullWidth
                  />
                </Box>

                {/* <Box m={1.5}>
                  <Typography>URL</Typography>
                  <TextField
                    value={updatedurls}
                    onChange={(e) => setUpdatedURLs(e.target.value)}
                    size="small"
                    placeholder="Enter URL"
                    fullWidth
                  />
                </Box> */}

                <Box m={1.5}>
                  <Typography>GST No</Typography>
                  <TextField
                    value={updatedgstNo}
                    onChange={(e) => SetupdatedGSTNo(e.target.value)}
                    size="small"
                    placeholder="Enter GST No"
                    fullWidth
                  />
                </Box>

               <Box m={1.5}>
  <Typography>Customer Type</Typography>

  <FormControl fullWidth size="small">
    <Select
      value={updatedCustomerType}
      onChange={(event) =>
        setUpdatedCustomerType(event.target.value)
      }
      displayEmpty
    >
      <MenuItem value="" disabled>
        Select Customer Type
      </MenuItem>

      <MenuItem value="R">Regular</MenuItem>
      <MenuItem value="D">Dealer</MenuItem>
      <MenuItem value="C">Caterers</MenuItem>
    </Select>
  </FormControl>
</Box>
              </Box>
            </Box>

            <Box
              m={2}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={6}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={updatedissystem}
                    onChange={(event) =>
                      setupdatedIsSystem(event.target.checked)
                    }
                  />
                }
                label="Is System"
              />

              {/* 
              <FormControlLabel
                control={<Checkbox

                  checked={updatedgst}
                  onChange={(event) => setupdatedGst(event.target.checked)}

                />}
                label="GST "
              />


              <FormControlLabel
                control={<Checkbox
                  checked={updatedcompliance}
                  onChange={(event) => setupdatedCompliance(event.target.checked)}

                />}
                label="Compliance"
              /> */}
            </Box>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            mt={5}
          >
            <Box>
             <Button
  onClick={UpdateCustomerMaster}
  disabled={isSaving}
  variant="contained"
>
  {isSaving ? "Saving..." : "Save"}
</Button>
            </Box>

            <Box>
              <Button
                sx={{
                  borderColor: "var(--complementary-color)",
                  color: "var(--complementary-color)",
                }}
                onClick={handleEditDrawerClose}
                variant="outlined"
              >
                <b>Cancel</b>{" "}
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default CustomerMaster;
