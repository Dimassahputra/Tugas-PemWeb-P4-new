import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

// ✅ Menggunakan endpoint Vercel secara dinamis
const API_URL = import.meta.env.VITE_API_URL || "https://backend-invofest-alpha.vercel.app";

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  job: z.string().min(3, "Pekerjaan minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  photo: z.string().nullable().optional(),
  bio: z.string().min(5, "Bio minimal 5 karakter"),
  status: z.string().min(1, "Status wajib dipilih"),
});

type FormData = z.infer<typeof schema>;

export default function PembicaraEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Ambil data lama berdasarkan ID saat komponen dimuat
  useEffect(() => {
    const loadSpeaker = async () => {
      try {
        const response = await axios.get(`${API_URL}/pembicara/${id}`);
        const data = response.data;
        // Set nilai form dengan data dari database
        setValue("name", data.name);
        setValue("job", data.job);
        setValue("email", data.email);
        setValue("photo", data.photo);
        setValue("bio", data.bio);
        setValue("status", data.status);
      } catch (error) {
        console.error("Gagal memuat data pembicara:", error);
        alert("Data pembicara tidak ditemukan!");
        navigate("/dashboard/pembicara");
      }
    };
    loadSpeaker();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`${API_URL}/pembicara/${id}`, data);
      alert("Data pembicara berhasil diperbarui!");
      navigate("/dashboard/pembicara");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal memperbarui pembicara.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Edit Pembicara</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama</label>
          <input {...register("name")} placeholder="Nama" className="border p-2 rounded w-full text-sm" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pekerjaan</label>
          <input {...register("job")} placeholder="Pekerjaan" className="border p-2 rounded w-full text-sm" />
          {errors.job && <p className="text-red-500 text-xs mt-1">{errors.job.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <input {...register("email")} placeholder="Email" className="border p-2 rounded w-full text-sm" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">URL Foto (Opsional)</label>
          <input {...register("photo")} placeholder="URL Foto (Opsional)" className="border p-2 rounded w-full text-sm" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bio</label>
          <textarea {...register("bio")} placeholder="Bio" className="border p-2 rounded w-full h-24 text-sm" />
          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
          <select {...register("status")} className="border p-2 rounded w-full text-sm bg-white">
            <option value="">Pilih Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/dashboard/pembicara" className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
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