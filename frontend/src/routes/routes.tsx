// routes/routes.js
import { AuthPage, NotFoundPage } from "../pages";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

// Публічні роути - доступні всім
export const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/register", element: <RegisterPage /> },
  // Додайте інші публічні сторінки
  // { path: "/about", element: <AboutPage /> },
  // { path: "/products", element: <ProductsPage /> },
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

