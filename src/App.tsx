import { Routes, Route } from "react-router-dom";

// LAYOUT
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// PAGES
import Beranda from "./page/Beranda";
import Competition from "./page/Competition";
import Seminar from "./page/Seminar";
import Workshop from "./page/Workshop";
import Talkshow from "./page/Talkshow";
import Login from "./page/LoginForm";
import Register from "./page/RegisterForm";

// DASHBOARD PAGES
import Dashboard from "./page/dashboard/Dashboard";
import CategoryIndex from "./page/dashboard/kategori/CategoryIndex";
import CategoryCreate from "./page/dashboard/kategori/CategoryCreate";
import PembicaraIndex from "./page/dashboard/pembicara/PembicaraIndex";
import PembicaraCreate from "./page/dashboard/pembicara/PembicaraCreate";
import EventIndex from "./page/event/EventIndex";
import EventCreate from "./page/event/EventCreate";

// ROUTE PROTECT
import ProtectedRoute from "./route/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* 🌐 HALAMAN UTAMA (PAKAI HEADER) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/competition" element={<Competition />} />
        <Route path="/seminar" element={<Seminar />} />
        <Route path="/workshop" element={<Workshop />} />
        <Route path="/talkshow" element={<Talkshow />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Route>

      {/* 🔐 PROTECTED ROUTE */}
      <Route element={<ProtectedRoute />}>
        
        {/* 📊 DASHBOARD (TANPA HEADER ATAS) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="kategori" element={<CategoryIndex />} />
          <Route path="kategori/create" element={<CategoryCreate />} />
          <Route path="pembicara" element={<PembicaraIndex />} />
          <Route path="/dashboard/event" element={<EventIndex />} />
          <Route path="/dashboard/event/create" element={<EventCreate />} />
          <Route path="pembicara/create" element={<PembicaraCreate />} />
          <Route path="pembicara" element={<PembicaraIndex />} />
        </Route>

      </Route>

    </Routes>
  );
}

export default App;