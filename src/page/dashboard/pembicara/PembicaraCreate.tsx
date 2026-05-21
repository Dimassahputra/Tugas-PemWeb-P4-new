import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      const response = await axios.post("http://localhost:3000/pembicara", data);
      if (response.status === 201 || response.status === 200) {
        alert("Pembicara berhasil disimpan ke Supabase!");
        navigate("/dashboard/pembicara");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan pembicara.");
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

        <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold cursor-pointer transition-colors">
          Simpan
        </button>
      </form>
    </div>
  );
}