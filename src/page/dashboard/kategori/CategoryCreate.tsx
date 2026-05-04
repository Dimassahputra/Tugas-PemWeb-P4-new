import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryCreate() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert("Nama kategori wajib diisi!");
      return;
    }

    alert(`Kategori "${name}" berhasil ditambahkan!`);

    // setelah submit balik ke index
    navigate("/dashboard/kategori");
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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}