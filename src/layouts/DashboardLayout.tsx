import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function DashboardLayout() {
  const logout = useAuthStore((state) => state.logout); // 🔥 ambil logout
  const navigate = useNavigate(); // 🔥 untuk redirect

  const handleLogout = () => {
    logout(); // 🔥 hapus auth
    navigate("/login", { replace: true }); // 🔥 pindah ke login
  };

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-red-800 text-white flex flex-col p-6">
        <h1 className="text-xl font-bold mb-8">InvoFest</h1>

        <nav className="flex flex-col gap-4">
          <NavLink to="/dashboard" className="hover:opacity-60">
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/kategori" className="hover:opacity-60">
            Categori Event
          </NavLink>

          <NavLink to="/dashboard/event" className="hover:opacity-60">
            Event
          </NavLink>

          <NavLink to="/dashboard/pembicara" className="hover:opacity-60">
            Pembicara
          </NavLink>
        </nav>

        {/* 🔴 LOGOUT (DITAMBAH FUNCTION SAJA) */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </main>

    </div>
  );
}