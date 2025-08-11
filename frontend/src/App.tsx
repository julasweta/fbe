import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes/routes";
import MainLayout from "./layouts/MainLayout";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

export default function App() {
  const { accessToken } = useAuthStore();
  const { theme } = useThemeStore();

  return (
    <div className={`${theme} `}>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {privateRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              accessToken ? (
                <MainLayout>{element}</MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        ))}
      </Routes>
    </div>
  );
}