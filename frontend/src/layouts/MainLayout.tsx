import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col">
      {/* Хедер */}
   

      <div className="flex">
        {/* Сайдбар */}
        <aside className="w-60 bg-gray-800 text-white p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col gap-2 mb-4">
            <Link to="/dashboard" className="hover:underline">Home</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
          </nav>
          <button
            onClick={logout}
            className="text-red-400 hover:underline"
          >
            Logout
          </button>
        </aside>

        {/* Контент з прокруткою */}
        <main className="flex-1 bg-gray-100 p-6 ">
          {children}
        </main>
      </div>
    </div>
  );
}
