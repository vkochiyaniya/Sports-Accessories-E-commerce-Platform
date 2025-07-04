import React, { Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // ✅ Import CartProvider
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

// Import Pages
import DashboardPage from "./pages/DashboardPage";
import StoreSection from "./pages/StoreSection";
import ContactPage from "./pages/ContactPage";
import AboutUs from "./pages/AboutUs";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage"; // ✅ Import Checkout Page
import UserOrdersPage from "./pages/UserOrdersPage"; // ✅ Import User Orders Page
import UserProfile from "./pages/UserProfile";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import OrdersPage from "./pages/admin/OrdersPage"; // ✅ Admin Orders Page
import StockPage from "./pages/admin/StockPage";
import InvoicePage from "./pages/admin/InvoicePage";
import EditProfile from "./pages/admin/EditProfile";
import EditProduct from "./pages/admin/EditProduct";
import AddProduct from "./pages/admin/AddProduct";
import TeamPage from "./pages/admin/Team";
import AdminContact from "./pages/admin/Admincontact";

// 🔄 Role-Based Redirect
const RoleRedirect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role;
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, isLoaded]);

  return <div className="p-10 text-center">Checking your role...</div>;
};

// 🔐 Protect Admin Routes
const AdminRoute = ({ children }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/sign-in" replace />;
  return user.publicMetadata?.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

// 🔄 Clerk Hosted Sign-In Redirect
const SignInRedirect = () => {
  useEffect(() => {
    window.location.href = "https://closing-shad-44.accounts.dev/sign-in?redirect_url=http://localhost:5173/role-redirect";
  }, []);
  return <div className="p-10 text-center">Redirecting to Sign-In...</div>;
};

// 🏗️ Render App
createRoot(document.getElementById("root")).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    signInUrl="https://closing-shad-44.accounts.dev/sign-in"
    signUpUrl="https://closing-shad-44.accounts.dev/sign-up"
    afterSignInUrl="/role-redirect"
    afterSignUpUrl="/role-redirect"
  >
    <CartProvider> {/* ✅ Wrap inside CartProvider */}
      <Router>
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <Routes>
            {/* Role-Based Redirect */}
            <Route path="/role-redirect" element={<RoleRedirect />} />

            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignInRedirect />} />
            <Route path="/sign-up" element={<Navigate to="https://closing-shad-44.accounts.dev/sign-up" replace />} />
            <Route path="/store" element={<StoreSection />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/productdetail/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<CheckoutPage />} /> {/* ✅ Added Checkout Page Route */}
            <Route path="/profile" element={<UserProfile />} />
            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <SignedIn>
                  <DashboardPage />
                </SignedIn>
              }
            />
            <Route
              path="/orders"
              element={
                <SignedIn>
                  <UserOrdersPage /> {/* ✅ User Orders Page */}
                </SignedIn>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <SignedIn>
                  <AdminRoute>
                    <Routes>
                      <Route path="" element={<AdminDashboard />} />
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="edit-product/:id" element={<EditProduct />} />
                      <Route path="orders" element={<OrdersPage />} /> {/* ✅ Admin Orders Page */}
                      <Route path="stock" element={<StockPage />} />
                      <Route path="invoice" element={<InvoicePage />} />
                      <Route path="edit-profile" element={<EditProfile />} />
                      <Route path="add-product" element={<AddProduct />} />
                      <Route path="team" element={<TeamPage />} />
                      <Route path="contact" element={<AdminContact />} />
                    </Routes>
                  </AdminRoute>
                </SignedIn>
              }
            />

            {/* Redirect Unauthenticated Users */}
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </CartProvider>
  </ClerkProvider>
);
