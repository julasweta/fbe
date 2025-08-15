import CreateProduct from "../modules/admin/create-product/CreateProduct";
import Dashboard from "../modules/admin/dashboard/Dashboard";
import EditProduct from "../modules/admin/edit-product/EditProduct";
import Cart from "../modules/cart/Cart";
import Checkout from "../modules/orders/Checkout";
import { AboutPage, AuthPage, HomePage, NotFoundPage, ProfilePage, RegisterPage } from "../pages";
import AdminPage from "../pages/AdminPage";
import CartPage from "../pages/CartPage";
import CategoryPage from "../pages/CategoryPage";
import CollectionPage from "../pages/CollectionPage";
import ContactPage from "../pages/ContactPage";
import ProductPage from "../pages/ProductPage";

export const publicRoutes = [
 
  { path: "/login", element: <AuthPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/product/:id", element: <ProductPage /> },
  { path: "/category/:categorySlug", element: <CategoryPage /> },
  { path: "/group/:collectionSlug", element: <CollectionPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <Checkout /> },
];

export const mainRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
]

export const privateRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      { index: true, element: <Dashboard /> },
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

