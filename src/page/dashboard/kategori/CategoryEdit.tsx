import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

// ✅ Menggunakan endpoint Vercel secara dinamis
const API_URL = import.meta.env.VITE_API_URL || "https://backend-invofest-alpha.vercel.app";

const schema = z.object({
  name: z.string().min(3, "Nama kategori minimal 3 karakter"),
});

type FormData = z.infer<typeof schema>;

export default function CategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/${id}`);
        setValue("name", response.data.name);
      } catch (error) {
        console.error(error);
        alert("Kategori tidak ditemukan!");
        navigate("/dashboard/kategori"); // ✅ Disesuaikan dengan rute dasbor milikmu
      }
    };
    loadCategory();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`${API_URL}/categories/${id}`, data);
      alert("Kategori berhasil diperbarui!");
      navigate("/dashboard/kategori"); // ✅ Disesuaikan dengan rute dasbor milikmu
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui kategori.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Edit Kategori</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama Kategori</label>
          <input {...register("name")} placeholder="Nama Kategori" className="border p-2 rounded w-full text-sm" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/dashboard/kategori" className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            Batal
          </Link>
          <button type="submit" className="bg-[#7B1D3F] hover:bg-[#9e2550] text-white px-4 py-2 text-sm rounded-lg font-semibold cursor-pointer transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}