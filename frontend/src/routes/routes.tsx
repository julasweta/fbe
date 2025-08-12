// routes/routes.js
import { AboutPage, AuthPage, HomePage, NotFoundPage, ProfilePage, RegisterPage } from "../pages";
import ContactPage from "../pages/ContactPage";
import ProductPage from "../pages/ProductPage";

// Публічні роути - доступні всім
export const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/about", element: <AboutPage /> },
  // { path: "/products", element: <ProductsPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/product/:id", element: <ProductPage /> },
];

// Приватні роути - тільки для залогінених
export const privateRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  // { path: "/cart", element: <CartPage /> },
  //{ path: "/orders", element: <OrdersPage /> },
];

// Роут для 404 сторінки
export const notFoundRoute = {
  path: "*",
  element: <NotFoundPage />
};

