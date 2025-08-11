import { Navigate } from "react-router-dom";
import { AuthPage, NotFoundPage } from "../pages";

export const publicRoutes = [
  { path: "/login", element: <AuthPage /> },
];

export const privateRoutes = [
  // За замовчуванням "/" буде перенаправляти на "/dashboard"
  { path: "/", element: <Navigate to="/products" replace /> },


  { path: "*", element: <div><NotFoundPage /></div> },
];

