import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Pricing from "./pages/Pricing";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

export const routers = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", name: "home", element: <Index /> },
      { path: "/marketplace", name: "marketplace", element: <Marketplace /> },
      { path: "/marketplace/:categorySlug", name: "marketplace-category", element: <Marketplace /> },
      { path: "/product/:slug", name: "product-detail", element: <ProductDetail /> },
      { path: "/pricing", name: "pricing", element: <Pricing /> },
      { path: "/login", name: "login", element: <Login /> },
      { path: "/signup", name: "signup", element: <Signup /> },
      { path: "/forgot-password", name: "forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", name: "reset-password", element: <ResetPassword /> },
      {
        path: "/wishlist",
        name: "wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        name: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        name: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        name: "admin",
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "/admin", name: "admin-overview", element: <AdminOverview /> },
          { path: "/admin/products", name: "admin-products", element: <AdminProducts /> },
          { path: "/admin/categories", name: "admin-categories", element: <AdminCategories /> },
          { path: "/admin/orders", name: "admin-orders", element: <AdminOrders /> },
          { path: "/admin/users", name: "admin-users", element: <AdminUsers /> },
        ],
      },
      /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
      { path: "*", name: "404", element: <NotFound /> },
    ],
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
