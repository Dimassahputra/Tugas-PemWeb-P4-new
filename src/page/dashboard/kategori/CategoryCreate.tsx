import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

// ✅ Letakkan deklarasi baseUrl di sini menggunakan environment variable dinamis
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/categories";

export default function CategoryCreate() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert("Nama kategori wajib diisi!");
      return;
    }

    try {
      // ✅ Ubah "http://localhost:3000" menjadi `${API_URL}` dengan template literal (backtick)
      const response = await axios.post(`${API_URL}/categories`, {
        name: name
      });

      // Jika Express merespon dengan status sukses (200 atau 201)
      if (response.status === 201 || response.status === 200) {
        alert(`Kategori "${name}" berhasil ditambahkan ke Supabase!`);
        navigate("/dashboard/kategori");
      }
    } catch (error: any) {
      console.error("Detail Error Lengkap:", error);
      
      if (error.response) {
        // Kasus 1: Server merespon, tapi mengembalikan error (misal status 400 atau 500)
        alert(`Gagal dari Server: ${error.response.data.message || "Internal Server Error"}`);
      } else if (error.request) {
        // Kasus 2: Request dikirim, tapi tidak ada respon sama sekali dari server API
        alert(`Gagal menyambung ke server. Pastikan API kamu di ${API_URL} sudah berjalan!`);
      } else {
        // Kasus 3: Ada kesalahan setup request di frontend
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Kategori</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md"
      >
        <div className="mb-4">
          <label className="block text-sm mb-2">Nama Kategori</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama kategori"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}