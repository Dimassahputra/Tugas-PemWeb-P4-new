import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

type FormData = {
  name: string;
  categoryId: string;
  pembicaraId: string;
  dateEvent: string;
  location: string;
  description: string;
  status: string;
};

const schema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  pembicaraId: z.string().min(1, "Pembicara wajib dipilih"),
  dateEvent: z.string().min(1, "Tanggal wajib diisi"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  status: z.string().min(1, "Status wajib dipilih"),
});

export default function EventCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [pembicaras, setPembicaras] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Ambil opsi Kategori & Pembicara langsung dari database Supabase
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const resCat = await axios.get("http://localhost:3000/categories");
        const resPem = await axios.get("http://localhost:3000/pembicara");
        setCategories(resCat.data);
        setPembicaras(resPem.data);
      } catch (err) {
        console.error("Gagal memuat list dropdown:", err);
      }
    };
    loadDropdownData();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("http://localhost:3000/events", data);
      if (response.status === 201 || response.status === 200) {
        alert("Event berhasil disimpan ke Supabase!");
        navigate("/dashboard/event");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan event.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Tambah Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Nama Event */}
        <div>
          <input {...register("name")} placeholder="Nama Event" className="border p-2 rounded w-full" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Dropdown Kategori */}
        <div>
          <select {...register("categoryId")} className="border p-2 rounded w-full">
            <option value="">Pilih Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Dropdown Pembicara */}
        <div>
          <select {...register("pembicaraId")} className="border p-2 rounded w-full">
            <option value="">Pilih Pembicara</option>
            {pembicaras.map((p) => (
              <option key={p.id} value={p.id}>{p.name} - {p.job}</option>
            ))}
          </select>
          {errors.pembicaraId && <p className="text-red-500 text-xs mt-1">{errors.pembicaraId.message}</p>}
        </div>

        {/* Tanggal Event */}
        <div>
          <input type="date" {...register("dateEvent")} className="border p-2 rounded w-full" />
          {errors.dateEvent && <p className="text-red-500 text-xs mt-1">{errors.dateEvent.message}</p>}
        </div>

        {/* Lokasi */}
        <div>
          <input {...register("location")} placeholder="Lokasi Event" className="border p-2 rounded w-full" />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        {/* Deskripsi */}
        <div>
          <textarea {...register("description")} placeholder="Deskripsi Event" className="border p-2 rounded w-full h-24" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Status */}
        <div>
          <select {...register("status")} className="border p-2 rounded w-full">
            <option value="">Pilih Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>

        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold cursor-pointer transition-colors">
          Simpan Event
        </button>
      </form>
    </div>
  );
}