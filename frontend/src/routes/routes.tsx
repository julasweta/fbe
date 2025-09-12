
import { EditProduct, CreateCategory, CreateProduct, Dashboard, CreateCollection } from "../modules";
import ForgotPassword from "../modules/auth/ForgotPassword";
import ResetPassword from "../modules/auth/ResetPassword";
import Delivery from "../modules/common/Delivery";
import Checkout from "../modules/orders/Checkout";
import { AboutPage, AdminPage, AuthPage, CartPage, CategoryPage, ChangePassword, CollectionPage, ContactPage, HomePage, NotFoundPage, OrdersPage, PrivacyPage, ProductPage, ProfilePage, RegisterPage } from "../pages";


export const publicRoutes = [

  { path: "/login", element: <AuthPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/change-password", element: <ChangePassword /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/product/:id", element: <ProductPage /> },
  { path: "/category/:categorySlug", element: <CategoryPage /> },
  { path: "/group/:collectionSlug", element: <CollectionPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/delivery-terms", element: <Delivery /> },
];

export const mainRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
]

export const privateRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  { path: "/orders", element: <OrdersPage /> },
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "createproduct", element: <CreateProduct /> },
      { path: "edit-product/:id", element: <EditProduct /> },
      { path: "create-category", element: <CreateCategory /> },
      { path: "create-collection", element: <CreateCollection /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  }
  ,
];

export const notFoundRoute = {
  path: "*",
  element: <NotFoundPage />,
};

