import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/events";

type Event = {
  id: number;
  name: string;
  category: { id: number; name: string };
  pembicara: { id: number; name: string };
  dateEvent: string;
  status: string;
};

export default function EventIndex() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Gagal memuat data event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus event "${name}"?`)) {
      try {
        await axios.delete(`${API_URL}/events/${id}`);
        alert("Event berhasil dihapus!");
        fetchEvents(); 
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus event.");
      }
    }
  };

  return (
    <div className="px-7 py-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#7B1D3F] rounded-full inline-block" />
            <span className="text-[10px] font-semibold text-[#7B1D3F] tracking-widest uppercase">
              Manajemen
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a0a10] tracking-tight">Event</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola semua event Invofest</p>
        </div>

        <Link
          to="/dashboard/event/create"
          className="flex items-center gap-1.5 bg-[#7B1D3F] hover:bg-[#9e2550] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Tambah Event
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-14 text-center text-sm text-gray-400">Memuat data dari database...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["No", "Nama Event", "Kategori", "Pembicara", "Tanggal", "Status", "Aksi"].map((h) => (
                  <th key={h} className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-4 py-2.5 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {events.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-rose-50/40 transition-colors">
                  <td className="px-4 py-3.5 text-sm text-gray-300 w-10">{index + 1}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#1a0a10]">{item.name}</td>
                  
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium bg-rose-50 text-[#7B1D3F] px-2.5 py-1 rounded-full">
                      {item.category?.name || "Tanpa Kategori"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {item.pembicara?.name || "Tanpa Pembicara"}
                  </td>

                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {item.dateEvent ? new Date(item.dateEvent).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) : "-"}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {item.status === "active" ? "● Aktif" : "● Nonaktif"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <Link 
                        to={`/dashboard/event/edit/${item.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <button 
                        className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <span className="text-3xl">📅</span>
            <p className="text-sm text-gray-400 font-medium">Belum ada event</p>
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-50">
          <span className="text-xs text-gray-300">Menampilkan {events.length} event</span>
        </div>
      </div>
    </div>
  );
}