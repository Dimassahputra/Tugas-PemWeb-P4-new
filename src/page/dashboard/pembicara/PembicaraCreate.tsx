import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ 1. Deklarasikan API_URL dinamis dari environment variable di bagian paling atas
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/pembicara";

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  job: z.string().min(3, "Pekerjaan minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  photo: z.string().optional(),
  bio: z.string().min(5, "Bio minimal 5 karakter"),
  status: z.string().min(1, "Status wajib dipilih"),
});

type FormData = z.infer<typeof schema>;

export default function PembicaraCreate() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // ✅ 2. Ubah URL localhost menjadi template literal menggunakan `${API_URL}`
      const response = await axios.post(`${API_URL}/pembicara`, data);
      
      if (response.status === 201 || response.status === 200) {
        alert("Pembicara berhasil disimpan ke Supabase!");
        navigate("/dashboard/pembicara");
      }
    } catch (error: any) {
      console.error("Detail Error Pembicara:", error);
      
      // Memberikan pesan error yang lebih informatif jika gagal terhubung
      if (error.response) {
        alert(`Gagal dari Server: ${error.response.data.message || "Internal Server Error"}`);
      } else if (error.request) {
        alert(`Gagal menyambung ke server. Pastikan API di ${API_URL} sudah running!`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Tambah Pembicara</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("name")}
            placeholder="Nama"
            className="border p-2 rounded w-full"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register("job")}
            placeholder="Pekerjaan"
            className="border p-2 rounded w-full"
          />
          {errors.job && <p className="text-red-500 text-xs mt-1">{errors.job.message}</p>}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="border p-2 rounded w-full"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register("photo")}
            placeholder="URL Foto (Opsional)"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <textarea
            {...register("bio")}
            placeholder="Bio"
            className="border p-2 rounded w-full h-24"
          />
          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <select {...register("status")} className="border p-2 rounded w-full">
            <option value="">Pilih Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>

        {/* ✅ Pastikan type="submit" terpasang dengan benar */}
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold cursor-pointer transition-colors">
          Simpan
        </button>
      </form>
    </div>
  );
}