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
import CategoryEdit from "./page/dashboard/kategori/CategoryEdit";
import PembicaraIndex from "./page/dashboard/pembicara/PembicaraIndex";
import PembicaraCreate from "./page/dashboard/pembicara/PembicaraCreate";
import PembicaraEdit from "./page/dashboard/pembicara/PembicaraEdit";
import EventIndex from "./page/event/EventIndex";
import EventCreate from "./page/event/EventCreate";
import EventEdit from "./page/event/EventEdit";
import Biodata from "./page/dashboard/kategori/Biodata"; // ✅ Import Biodata kamu

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
          
          {/* 🧑‍💻 RUTE BIODATA KAMU */}
          <Route path="biodata" element={<Biodata />} />

          {/* 🗂️ RUTE KATEGORI */}
          <Route path="kategori" element={<CategoryIndex />} />
          <Route path="kategori/create" element={<CategoryCreate />} />
          <Route path="kategori/edit/:id" element={<CategoryEdit />} />

          {/* 👥 RUTE PEMBICARA */}
          <Route path="pembicara" element={<PembicaraIndex />} />
          <Route path="pembicara/create" element={<PembicaraCreate />} />
          <Route path="pembicara/edit/:id" element={<PembicaraEdit />} />

          {/* 📅 RUTE EVENT */}
          <Route path="event" element={<EventIndex />} />
          <Route path="event/create" element={<EventCreate />} />
          <Route path="event/edit/:id" element={<EventEdit />} />
        </Route>

      </Route>

    </Routes>
  );
}

export default App;