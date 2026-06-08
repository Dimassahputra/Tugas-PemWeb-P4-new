import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    foto: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          username: data.username || "",
          password: "",
          foto: data.foto || "",
        });
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:3000/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    if (response.ok) {
      alert("User berhasil diupdate");
      navigate("/dashboard/user");
    } else {
      alert("Gagal update user");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6 text-[#7B1D3F]">
        Edit User
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password Baru
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Foto (URL)
          </label>
          <input
            type="text"
            placeholder="Enter photo URL"
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
          Update User
        </button>
      </form>
    </div>
  );
}