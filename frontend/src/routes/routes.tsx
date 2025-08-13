import CreateProduct from "../modules/admin/create-product/CreateProduct";
import Dashboard from "../modules/admin/dashboard/Dashboard";
import EditProduct from "../modules/admin/edit-product/EditProduct";
import { AboutPage, AuthPage, HomePage, NotFoundPage, ProfilePage, RegisterPage } from "../pages";
import AdminPage from "../pages/AdminPage";
import ContactPage from "../pages/ContactPage";
import ProductPage from "../pages/ProductPage";

export const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/product/:id", element: <ProductPage /> },
];

export const privateRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      { index: true, element: <div>Admin Dashboard</div> },
      { path: "createproduct", element: <CreateProduct /> },
      { path: "edit-product/:id", element: <EditProduct /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  }
,
];

export const notFoundRoute = {
  path: "*",
  element: <NotFoundPage />,
};

