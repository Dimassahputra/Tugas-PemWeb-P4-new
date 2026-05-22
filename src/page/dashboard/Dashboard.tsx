import { Link } from "react-router-dom";
import { useEffect, useState } from "react"; 
import axios from "axios"; 

type Stat = {
  title: string;
  value: number;
  icon: string;
};

type EventItem = {
  name: string;
  category: string;
  date: string;
};

type SpeakerItem = {
  name: string;
  job: string;
};

// --- SUB-KOMPONEN TAMPILAN ---
function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-400 uppercase">
          {stat.title}
        </span>
        <span className="text-2xl">{stat.icon}</span>
      </div>
      <p className="text-4xl font-bold text-[#1a0a10]">
        {stat.value}
      </p>
      <div className="h-1 w-10 bg-[#7B1D3F] rounded-full" />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-4 h-0.5 bg-[#7B1D3F]" />
      <h2 className="text-sm font-bold text-[#1a0a10]">{title}</h2>
    </div>
  );
}

function EventListItem({ item, isLast }: { item: EventItem; isLast: boolean }) {
  return (
    <li className={`flex items-center justify-between py-4 ${isLast ? "" : "border-b border-gray-100"}`}>
      <div>
        <p className="font-semibold text-[#1a0a10]">{item.name}</p>
        <p className="text-sm text-gray-400">{item.date}</p>
      </div>
      <span className="text-sm bg-rose-100 text-[#7B1D3F] px-3 py-1 rounded-full font-medium">
        {item.category}
      </span>
    </li>
  );
}

function SpeakerListItem({ item, index, isLast }: { item: SpeakerItem; index: number; isLast: boolean }) {
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-[#7B1D3F] to-[#c9395e]",
    "from-[#1a4f7B] to-[#3982c9]",
    "from-[#1a7B3F] to-[#39c970]",
  ];

  return (
    <li className={`flex items-center gap-4 py-4 ${isLast ? "" : "border-b border-gray-100"}`}>
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[index % colors.length]} text-white text-sm font-bold flex items-center justify-center`}>
        {initials}
      </div>
      <div>
        <p className="font-semibold text-[#1a0a10]">{item.name}</p>
        <p className="text-sm text-gray-400">{item.job}</p>
      </div>
    </li>
  );
}

// --- MAIN KOMPONEN DASHBOARD ---
export default function Dashboard() {
  const [totalStats, setTotalStats] = useState<Stat[]>([
    { title: "Kategori", value: 0, icon: "🗂️" },
    { title: "Event", value: 0, icon: "📅" },
    { title: "Pembicara", value: 0, icon: "🎤" },
    { title: "Event Aktif", value: 0, icon: "✅" },
  ]);

  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);
  const [latestSpeakers, setLatestSpeakers] = useState<SpeakerItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || "https://backend-invofest-alpha.vercel.app";

        // ✅ HILANGKAN JALUR /api AGAR SINKRON DENGAN BACKEND KAMU
        const [catRes, eventRes, speakerRes] = await Promise.all([
          axios.get(`${baseUrl}/categories`),
          axios.get(`${baseUrl}/events`),
          axios.get(`${baseUrl}/pembicara`),
        ]);

        // Cek struktur respons data
        const rawCategories = catRes.data?.data || catRes.data || [];
        const rawEvents = eventRes.data?.data || eventRes.data || [];
        const rawSpeakers = speakerRes.data?.data || speakerRes.data || [];

        // Hitung total statistik
        const totalCategories = Array.isArray(rawCategories) ? rawCategories.length : 0;
        const totalEvents = Array.isArray(rawEvents) ? rawEvents.length : 0;
        const totalSpeakers = Array.isArray(rawSpeakers) ? rawSpeakers.length : 0;
        const activeEventsCount = Array.isArray(rawEvents) 
          ? rawEvents.filter((e: any) => e?.status === "active" || e?.status === "Aktif").length 
          : 0;

        setTotalStats([
          { title: "Kategori", value: totalCategories, icon: "🗂️" },
          { title: "Event", value: totalEvents, icon: "📅" },
          { title: "Pembicara", value: totalSpeakers, icon: "🎤" },
          { title: "Event Aktif", value: activeEventsCount, icon: "✅" },
        ]);

        // Ambil maksimal 3 data terbaru untuk ditaruh di list
        if (Array.isArray(rawEvents)) {
          const formattedEvents = rawEvents.slice(0, 3).map((e: any) => ({
            name: e.name || "Event Tanpa Nama",
            category: e.category?.name || e.category || "General",
            date: e.dateEvent ? new Date(e.dateEvent).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "Tanpa Tanggal"
          }));
          setLatestEvents(formattedEvents);
        }

        if (Array.isArray(rawSpeakers)) {
          const formattedSpeakers = rawSpeakers.slice(0, 3).map((s: any) => ({
            name: s.name || "Pembicara Tanpa Nama",
            job: s.job || "Expert"
          }));
          setLatestSpeakers(formattedSpeakers);
        }

        setErrorMessage(""); 
      } catch (err: any) {
        console.error("Gagal memuat ringkasan data dashboard:", err);
        setErrorMessage(err.message || "Terjadi kesalahan saat memuat data dari API.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="px-10 py-10 w-full space-y-10">

      {/* HEADER & BIODATA QUICK VIEW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-rose-50 to-white border border-rose-100/60 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#7B1D3F]" />
            <span className="text-xs font-semibold text-[#7B1D3F] uppercase tracking-widest">
              Overview
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a0a10]">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Ringkasan data Invofest hari ini</p>
        </div>

        {/* TOMBOL PROFIL */}
        <Link 
          to="/dashboard/biodata"
          className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-xl hover:shadow-md transition group text-left max-w-xs"
        >
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-lg">
            👨‍💻
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a0a10] group-hover:text-[#7B1D3F] transition">
              Dimas Sahputra
            </p>
            <p className="text-xs text-gray-400 font-medium">NIM. 24090016</p>
          </div>
          <span className="text-gray-300 group-hover:text-[#7B1D3F] ml-auto pl-2 text-sm transition">➔</span>
        </Link>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          ⚠️ <strong>Gagal mengambil data:</strong> {errorMessage}.
        </div>
      )}

      {/* CARDS STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {totalStats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* LIST CONTENT */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LATEST EVENT LIST */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <SectionHeader title="Event Terbaru" />
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-6 animate-pulse">Memuat data event...</p>
          ) : latestEvents.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Belum ada data event terbaru di database.</p>
          ) : (
            <ul>
              {latestEvents.map((item, i) => (
                <EventListItem
                  key={i}
                  item={item}
                  isLast={i === latestEvents.length - 1}
                />
              ))}
            </ul>
          )}
        </div>

        {/* LATEST SPEAKER LIST */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <SectionHeader title="Pembicara Terbaru" />
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-6 animate-pulse">Memuat data pembicara...</p>
          ) : latestSpeakers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Belum ada data pembicara terbaru di database.</p>
          ) : (
            <ul>
              {latestSpeakers.map((item, i) => (
                <SpeakerListItem
                  key={i}
                  item={item}
                  index={i}
                  isLast={i === latestSpeakers.length - 1}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
}