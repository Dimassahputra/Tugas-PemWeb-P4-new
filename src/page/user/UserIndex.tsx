import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type User = {
  id: number;
  username: string;
  foto: string;
  created_at: string;
};

export default function UserIndex() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus user ini?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#7B1D3F] rounded-full inline-block" />

            <span className="text-[10px] font-semibold text-[#7B1D3F] tracking-widest uppercase">
              Manajemen
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#1a0a10]">
            User
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Data user yang tersimpan di database
          </p>
        </div>

        <Link
          to="/dashboard/user/create"
          className="flex items-center gap-1.5 bg-[#7B1D3F] hover:bg-[#9e2550] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Tambah User
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Foto</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b hover:bg-rose-50/40 transition-colors"
              >
                <td className="px-4 py-3">
                  {index + 1}
                </td>

                <td className="px-4 py-3">
                  <img
                    src={user.foto || "/default-user.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>

                <td className="px-4 py-3 font-semibold">
                  {user.username}
                </td>

                <td className="px-4 py-3">
                  {new Date(
                    user.created_at
                  ).toLocaleDateString("id-ID")}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">

                    <Link
                      to={`/dashboard/user/edit/${user.id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(user.id)
                      }
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Hapus
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">
            Menampilkan {users.length} user
          </span>
        </div>
      </div>
    </div>
  );
}