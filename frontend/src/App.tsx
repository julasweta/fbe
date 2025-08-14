// App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes, notFoundRoute, mainRoutes } from "./routes/routes";
import MainLayout from "./layouts/MainLayout/MainLayout";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store";
import "./App.css";
import SeccondLayout from "./layouts/SeccondLayout";

export default function App() {
  const { theme } = useThemeStore();
  const { accessToken } = useAuthStore();

  return (
    <div className={`${theme}`}>
      <Routes>
        {/* Головна сторінка */}
        {mainRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<MainLayout>{element}</MainLayout>}
          />
        ))}


        {/* Публічні роути - доступні всім */}
        {publicRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<SeccondLayout>{element}</SeccondLayout>}
          />
        ))}

        {/* Приватні роути - тільки для залогінених */}
        {privateRoutes.map(({ path, element, children }) => (
          <Route
            key={path}
            path={path}
            element={
              accessToken ? (
                <SeccondLayout>{element}</SeccondLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            {children?.map((child) => (
              <Route
                key={child.path || "index"}
                index={child.index}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}

        {/* 404 сторінка - має бути в кінці */}
        <Route
          path={notFoundRoute.path}
          element={notFoundRoute.element}
        />
      </Routes>
    </div>
  );
}