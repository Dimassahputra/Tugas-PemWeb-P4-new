import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

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
        const response = await axios.get(`http://localhost:3000/categories/${id}`);
        setValue("name", response.data.name);
      } catch (error) {
        console.error(error);
        alert("Kategori tidak ditemukan!");
        navigate("/dashboard/category");
      }
    };
    loadCategory();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`http://localhost:3000/categories/${id}`, data);
      alert("Kategori berhasil diperbarui!");
      navigate("/dashboard/category");
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
          <input {...register("name")} placeholder="Nama Kategori" className="border p-2 rounded w-full" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <button type="submit" className="bg-[#7B1D3F] hover:bg-[#9e2550] text-white py-2 rounded font-semibold cursor-pointer">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}