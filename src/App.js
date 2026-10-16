

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./Components/Sidebar";
import ProtectedRoute from "./ProtectedRoute";

// ============================================================
// MASTERS
// ============================================================

import CustomerMaster from "./Masters/CustomerMaster";
import SupplierMaster from "./Masters/SupplierMaster";
import ProductMaster from "./Masters/ProductMaster";
import MaterialMaster from "./Masters/MaterialMaster";
import AccountMaster from "./Masters/AccountMaster";
import UserMaster from "./Masters/UserMaster";

// ============================================================
// LOGIN
// ============================================================

import LoginPage from "./LogIn-SignUp/Login";
import CoverPage from "./LogIn-SignUp/coverpage";

// ============================================================
// TRANSACTIONS
// ============================================================

import Purchase from "./Transaction/PurchaseEntry";
import SalesEntry from "./Transaction/Sales";
import SalesB2B from "./Transaction/SalesB2B";
import ProductionEntry from "./Transaction/ProductionEntry";
import InwordAtStore from "./Transaction/InwordAtStore";
import DeliveryChallan from "./Transaction/DeliveryChallan";
import PurchaseOther from "./Transaction/PurchaseOther";
import Receipt from "./Transaction/Receipt";
import Payment from "./Transaction/Payment";
import PackingEntry from "./Transaction/PackingEntry";
import DailyStockEntryForm from "./Transaction/DailyStockEntryForm";
import DailyStockEntryAtMainOffice from "./Transaction/DailyStockEntryAtMainOffice";
import DenominationEntry from "./Transaction/DenominationEntry";
import SalesDealer from "./Transaction/SalesDealer";
import SalesCaterers from "./Transaction/SalesCaterers";

// ============================================================
// SETTINGS
// ============================================================

import Settings from "./Settings/Setting";

// ============================================================
// REPORTS
// ============================================================

import Salesreport from "./Reports/salesreport";
import ProductwiseSales from "./Reports/productwiseSales";
import CustomerWiseSales from "./Reports/customerWiseSales";
import StockReport from "./Reports/stockReport";
import AccountReceivable from "./Reports/accountReceivable";
import AccountPayable from "./Reports/accountPayable";
import PurchaseReport from "./Reports/PurchaseReport";
import ProductGroupwiseStock from "./Reports/ProductGroupwiseStock";
import ProductionReport from "./Reports/ProductionReport";
import StockReportForRowMaterial from "./Reports/StockReportForRowMaterial";
import SalesHSN from "./Reports/SalesHSN";
import PurchaseHSN from "./Reports/PurchaseHSN";
import Customerwisemonthlysales from "./Reports/Customerwisemonthlysales";
import InvoiceHistory from "./Transaction/InvoiceHistory";

import StockOutward from "./Transaction/StockOutward";

// ============================================================
// COMMON PAGE
// ============================================================

import Commonpage from "./Commonpage";

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* ==================================================
            LOGIN / PUBLIC ROUTES
        ================================================== */}

        <Route index element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/coverpage" element={<CoverPage />} />

        {/* ==================================================
            SIDEBAR / MAIN APPLICATION
        ================================================== */}

        <Route path="/" element={<Sidebar />}>
          {/* ==================================================
              MASTERS
              ADMIN ONLY
          ================================================== */}

          {/* Customer Master */}

          <Route
            path="/customermaster"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CustomerMaster />
              </ProtectedRoute>
            }
          />

          {/* Supplier Master */}

          <Route
            path="/suppliermaster"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <SupplierMaster />
              </ProtectedRoute>
            }
          />

          {/* Product Master */}

          <Route
            path="/productmaster"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductMaster />
              </ProtectedRoute>
            }
          />

          {/* Material Master */}

          <Route
            path="/materialmaster"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <MaterialMaster />
              </ProtectedRoute>
            }
          />

          {/* Account Master */}

          <Route
            path="/accountmaster"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AccountMaster />
              </ProtectedRoute>
            }
          />

          {/* User Master */}

          <Route
            path="/usermaster"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserMaster />
              </ProtectedRoute>
            }
          />

          {/* ==================================================
              TRANSACTIONS
          ================================================== */}

          {/* --------------------------------------------------
              SALES
              ADMIN + SALE
          -------------------------------------------------- */}

          <Route
            path="/salesentry"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SALE" , "SALE2"]}>
                <SalesEntry />
              </ProtectedRoute>
            }
          />

          <Route
            path="/salesdealer"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SALE" , "SALE2"]}>
                <SalesDealer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/salescaterers"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SALE" , "SALE2"]}>
                <SalesCaterers />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              DAILY STOCK ENTRY
              ADMIN + SALE
          -------------------------------------------------- */}

          <Route
            path="/dailystockentry"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SALE" , "SALE2"]}>
                <DailyStockEntryForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dailystockentry-main-office"
            element={
              <ProtectedRoute allowedRoles={["ADMIN" , "SALE" ,"SALE2"]}>
                <DailyStockEntryAtMainOffice />
              </ProtectedRoute>
            }
          />


          <Route
  path="/stock-outward"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "SALE", "SALE2"]}>
      <StockOutward />
    </ProtectedRoute>
  }
/>

        {/* ==================================================
    INVOICE EDIT HISTORY
    ADMIN + SALE
================================================== */}

<Route
  path="/invoiceedithistory"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <InvoiceHistory />
    </ProtectedRoute>
  }
/>

          <Route
            path="/denominationentry"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SALE", "SALE2"]}>
                <DenominationEntry />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PURCHASE
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/Purchase"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Purchase />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              SALES B2B
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/salesB2B"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <SalesB2B />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PRODUCTION ENTRY
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/productionentry"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductionEntry />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              INWORD AT STORE
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/inwordatstore"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <InwordAtStore />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              DELIVERY CHALLAN
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/deliverychallan"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DeliveryChallan />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PURCHASE OTHER
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/Purchaseother"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PurchaseOther />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              RECEIPTS
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/receipts"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Receipt />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PAYMENTS
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PACKING ENTRY
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/packingEntry"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PackingEntry />
              </ProtectedRoute>
            }
          />

          {/* ==================================================
              REPORTS
          ================================================== */}

          {/* --------------------------------------------------
              SALES REPORT
              ADMIN + SALE
          -------------------------------------------------- */}

          <Route
            path="/salesReport"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SALE", "SALE2"]}>
                <Salesreport />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PRODUCTWISE SALES
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/productwisesales"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductwiseSales />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              CUSTOMERWISE SALES
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/customerwisesales"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CustomerWiseSales />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              STOCK REPORT
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/stockreport"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <StockReport />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              ACCOUNT RECEIVABLE
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/accountreceivable"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AccountReceivable />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              ACCOUNT PAYABLE
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/accountpayable"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AccountPayable />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PURCHASE REPORT
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/purchasereport"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PurchaseReport />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PRODUCT GROUP WISE STOCK
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/product-group-wise-Stock"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductGroupwiseStock />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PRODUCTION REPORT
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/productionReport"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductionReport />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              STOCK REPORT FOR RAW MATERIAL
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/stockreportforrowmaterial"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <StockReportForRowMaterial />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              SALES HSN
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/saleshsnwise"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <SalesHSN />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              PURCHASE HSN
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/purchasehsnwise"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PurchaseHSN />
              </ProtectedRoute>
            }
          />

          {/* --------------------------------------------------
              CUSTOMERWISE MONTHLY SALES
              ADMIN ONLY
          -------------------------------------------------- */}

          <Route
            path="/customerwisemonthlysales"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Customerwisemonthlysales />
              </ProtectedRoute>
            }
          />

          {/* ==================================================
              SETTINGS
              ADMIN ONLY
          ================================================== */}

          <Route
            path="/setting"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* ==================================================
              COMMON PAGE
              ================================================== */}

          <Route
            path="/commonpage"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Commonpage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
