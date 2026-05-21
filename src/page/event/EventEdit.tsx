import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const schema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  pembicaraId: z.string().min(1, "Pembicara wajib dipilih"),
  dateEvent: z.string().min(1, "Tanggal wajib diisi"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  status: z.string().min(1, "Status wajib dipilih"),
});

type FormData = z.infer<typeof schema>;

export default function EventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [pembicaras, setPembicaras] = useState<any[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const loadDependenciesAndEvent = async () => {
      try {
        // 1. Ambil opsi dropdown data
        const resCat = await axios.get("http://localhost:3000/categories");
        const resPem = await axios.get("http://localhost:3000/pembicara");
        setCategories(resCat.data);
        setPembicaras(resPem.data);

        // 2. Ambil data lama Event
        const resEvent = await axios.get(`http://localhost:3000/events/${id}`);
        const eventData = resEvent.data;

        // 3. Format tanggal ke YYYY-MM-DD agar bisa terbaca oleh <input type="date">
        const formattedDate = eventData.dateEvent ? new Date(eventData.dateEvent).toISOString().split('T')[0] : "";

        setValue("name", eventData.name);
        setValue("categoryId", String(eventData.categoryId));
        setValue("pembicaraId", String(eventData.pembicaraId));
        setValue("dateEvent", formattedDate!);
        setValue("location", eventData.location);
        setValue("description", eventData.description);
        setValue("status", eventData.status);
      } catch (err) {
        console.error("Gagal memuat data edit event:", err);
        alert("Data event tidak ditemukan!");
        navigate("/dashboard/event");
      }
    };
    loadDependenciesAndEvent();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`http://localhost:3000/events/${id}`, data);
      alert("Event berhasil diperbarui!");
      navigate("/dashboard/event");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal memperbarui event.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input {...register("name")} placeholder="Nama Event" className="border p-2 rounded w-full" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <select {...register("categoryId")} className="border p-2 rounded w-full">
            <option value="">Pilih Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <select {...register("pembicaraId")} className="border p-2 rounded w-full">
            <option value="">Pilih Pembicara</option>
            {pembicaras.map((p) => (
              <option key={p.id} value={p.id}>{p.name} - {p.job}</option>
            ))}
          </select>
          {errors.pembicaraId && <p className="text-red-500 text-xs mt-1">{errors.pembicaraId.message}</p>}
        </div>

        <div>
          <input type="date" {...register("dateEvent")} className="border p-2 rounded w-full" />
          {errors.dateEvent && <p className="text-red-500 text-xs mt-1">{errors.dateEvent.message}</p>}
        </div>

        <div>
          <input {...register("location")} placeholder="Lokasi Event" className="border p-2 rounded w-full" />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <textarea {...register("description")} placeholder="Deskripsi Event" className="border p-2 rounded w-full h-24" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <select {...register("status")} className="border p-2 rounded w-full">
            <option value="">Pilih Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>

        <button type="submit" className="bg-[#7B1D3F] hover:bg-[#9e2550] text-white py-2 rounded font-semibold cursor-pointer">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}