import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Menggunakan Environment Variable dari Vite, jika tidak ada fallback ke backend Vercel langsung
const API_URL = import.meta.env.VITE_API_URL || "https://backend-invofest-alpha.vercel.app";

type Speaker = {
  id: number;
  name: string;
  job: string;
  email: string;
  status: string;
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#7B1D3F] to-[#c9395e] text-white text-xs font-bold flex items-center justify-center">
      {initials}
    </div>
  );
}

export default function PembicaraIndex() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpeakers = async () => {
    try {
      const response = await axios.get(`${API_URL}/pembicara`);
      setSpeakers(response.data);
    } catch (error) {
      console.error("Gagal memuat data pembicara:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pembicara "${name}"?`)) {
      try {
        await axios.delete(`${API_URL}/pembicara/${id}`);
        alert("Pembicara berhasil dihapus!");
        fetchSpeakers(); 
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus pembicara. Pastikan data tidak terikat ke tabel event.");
      }
    }
  };

  return (
    <div className="px-10 py-10 w-full space-y-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#7B1D3F]" />
            <span className="text-xs font-semibold text-[#7B1D3F] uppercase tracking-widest">
              Manajemen
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a0a10]">Pembicara</h1>
          <p className="text-gray-400 mt-1">Kelola pembicara event Invofest</p>
        </div>

        <Link
          to="/dashboard/pembicara/create"
          className="flex items-center gap-2 bg-[#7B1D3F] hover:bg-[#9e2550] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <span className="text-lg leading-none">+</span>
          Tambah Pembicara
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-14 text-center text-sm text-gray-400">Memuat data pembicara...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["No", "Pembicara", "Pekerjaan", "Email", "Status", "Aksi"].map((h) => (
                  <th key={h} className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-5 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {speakers.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-rose-50/40 transition">
                  <td className="px-5 py-4 text-sm text-gray-400 w-10">{index + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={item.name} />
                      <span className="font-semibold text-[#1a0a10]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm bg-rose-50 text-[#7B1D3F] px-3 py-1 rounded-full font-medium">
                      {item.job}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{item.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.status === "active" || item.status === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {item.status === "active" || item.status === "Aktif" ? "● Aktif" : "● Nonaktif"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link 
                        to={`/dashboard/pembicara/edit/${item.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                      >
                        Edit
                      </Link>
                      <button 
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition cursor-pointer"
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

        {!loading && speakers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <span className="text-3xl">👥</span>
            <p className="text-sm text-gray-400 font-medium">Belum ada data pembicara</p>
          </div>
        )}

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <span className="text-sm text-gray-400">
            Menampilkan {speakers.length} pembicara
          </span>
        </div>
      </div>
    </div>
  );
}