import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

// ✅ Menggunakan endpoint Vercel secara dinamis
const API_URL = import.meta.env.VITE_API_URL || "https://backend-invofest-alpha.vercel.app";

type Category = { id: number; name: string };
type Speaker = { id: number; name: string };

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State Form
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pembicaraId, setPembicaraId] = useState("");
  const [dateEvent, setDateEvent] = useState("");
  const [status, setStatus] = useState("active");

  // State Pilihan Dropdown Relasi
  const [categories, setCategories] = useState<Category[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Ambil semua opsi kategori & pembicara untuk dropdown
        const [resCat, resSpeak, resEvent] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/pembicara`),
          axios.get(`${API_URL}/events/${id}`)
        ]);

        setCategories(resCat.data);
        setSpeakers(resSpeak.data);

        // 2. Masukkan data event lama ke dalam form input
        const eventData = resEvent.data;
        setName(eventData.name);
        setCategoryId(eventData.categoryId?.toString() || eventData.category?.id?.toString() || "");
        setPembicaraId(eventData.pembicaraId?.toString() || eventData.pembicara?.id?.toString() || "");
        setStatus(eventData.status || "active");
        
        if (eventData.dateEvent) {
          // Format ISO date string ke bentuk YYYY-MM-DD agar dibaca oleh input type="date"
          setDateEvent(new Date(eventData.dateEvent).toISOString().split("T")[0]);
        }
      } catch (error) {
        console.error("Gagal memuat data edit event:", error);
        alert("Data event tidak ditemukan atau server bermasalah.");
        navigate("/dashboard/event");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !pembicaraId || !dateEvent) {
      alert("Harap isi semua kolom form!");
      return;
    }

    try {
      await axios.put(`${API_URL}/events/${id}`, {
        name,
        categoryId: parseInt(categoryId),
        pembicaraId: parseInt(pembicaraId),
        dateEvent,
        status
      });

      alert("Event berhasil diperbarui!");
      navigate("/dashboard/event"); 
    } catch (error) {
      console.error("Gagal mengupdate event:", error);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  if (loading) {
    return <div className="p-14 text-center text-sm text-gray-400">Memuat data form edit...</div>;
  }

  return (
    <div className="px-7 py-8 max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#1a0a10] tracking-tight">Edit Event</h1>
        <p className="text-sm text-gray-400 mt-1">Ubah informasi detail event Invofest</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nama Event</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7B1D3F]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama event"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#7B1D3F]"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pembicara</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#7B1D3F]"
              value={pembicaraId}
              onChange={(e) => setPembicaraId(e.target.value)}
            >
              <option value="">-- Pilih Pembicara --</option>
              {speakers.map((spk) => (
                <option key={spk.id} value={spk.id}>{spk.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tanggal Event</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7B1D3F]"
              value={dateEvent}
              onChange={(e) => setDateEvent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#7B1D3F]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* ACTIONS TOMBOL */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
          <Link
            to="/dashboard/event"
            className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-[#7B1D3F] hover:bg-[#9e2550] rounded-lg transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}