import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Customer
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerHome from "./pages/customer/CustomerHome";
import ScanProduct from "./pages/customer/ScanProduct";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import DigitalBill from "./pages/customer/DigitalBill";
import BillsHistory from "./pages/customer/BillsHistory";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MallsManagement from "./pages/admin/MallsManagement";
import TransactionsPage from "./pages/admin/TransactionsPage";

// Guard
import GuardLayout from "./layouts/GuardLayout";
import GuardHome from "./pages/guard/GuardHome";
import GuardScanPage from "./pages/guard/GuardScanPage";
import GuardHistory from "./pages/guard/GuardHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth */}
              <Route path="/" element={<LoginPage />} />

              {/* Customer Routes */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerHome />} />
                <Route path="scan" element={<ScanProduct />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="bill/:billId" element={<DigitalBill />} />
                <Route path="bills" element={<BillsHistory />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="malls" element={<MallsManagement />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="*" element={<AdminDashboard />} />
              </Route>

              {/* Guard Routes */}
              <Route path="/guard" element={<GuardLayout />}>
                <Route index element={<GuardHome />} />
                <Route path="scan" element={<GuardScanPage />} />
                <Route path="history" element={<GuardHistory />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
