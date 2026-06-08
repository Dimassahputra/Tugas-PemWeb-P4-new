import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    foto: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("User berhasil ditambahkan");
      navigate("/dashboard/user");
    } else {
      alert("Gagal menambahkan user");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6 text-[#7B1D3F]">
        Tambah User
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Masukkan username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="foto" className="block text-sm font-medium mb-1">
            Foto (URL)
          </label>
          <input
            id="foto"
            type="text"
            placeholder="Masukkan URL foto"
            value={form.foto}
            onChange={(e) =>
              setForm({ ...form, foto: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-[#7B1D3F] text-white px-5 py-2 rounded-lg"
        >
          Simpan User
        </button>
      </form>
    </div>
  );
}