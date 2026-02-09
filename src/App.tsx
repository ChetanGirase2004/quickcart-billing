import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { GuardAuthProvider } from "@/contexts/GuardAuthContext";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import CustomerPhoneAuth from "@/components/CustomerPhoneAuth";

// Admin Components
import AdminAuth from "@/components/admin/AdminAuth";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

// Guard Components
import GuardAuth from "@/components/guard/GuardAuth";
import GuardRoleGuard from "@/components/guard/GuardRoleGuard";
import CustomerProtectedRoute from "@/components/customer/CustomerProtectedRoute";

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
    <CustomerAuthProvider>
      <AdminAuthProvider>
        <GuardAuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Auth */}
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/customer/auth" element={<CustomerPhoneAuth />} />

                  {/* Admin Auth Routes */}
                  <Route path="/admin/auth" element={<AdminAuth />} />

                  {/* Admin Protected Routes */}
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="malls" element={<MallsManagement />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="*" element={<AdminDashboard />} />
                  </Route>

                  {/* Guard Auth Routes */}
                  <Route path="/guard/auth" element={<GuardAuth />} />

                  {/* Guard Protected Routes */}
                  <Route path="/guard" element={
                    <GuardRoleGuard>
                      <GuardLayout />
                    </GuardRoleGuard>
                  }>
                    <Route index element={<GuardHome />} />
                    <Route path="scan" element={<GuardScanPage />} />
                    <Route path="history" element={<GuardHistory />} />
                  </Route>

                  {/* Customer Routes */}
                  <Route
                    path="/customer"
                    element={
                      <CustomerProtectedRoute>
                        <CustomerLayout />
                      </CustomerProtectedRoute>
                    }
                  >
                    <Route index element={<CustomerHome />} />
                    <Route path="scan" element={<ScanProduct />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="bill/:billId" element={<DigitalBill />} />
                    <Route path="bills" element={<BillsHistory />} />
                  </Route>

                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </GuardAuthProvider>
      </AdminAuthProvider>
    </CustomerAuthProvider>
  </QueryClientProvider>
);

export default App;
