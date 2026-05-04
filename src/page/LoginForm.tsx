import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  const emailInput = (e.target as HTMLFormElement)[0] as HTMLInputElement;
  const passwordInput = (e.target as HTMLFormElement)[1] as HTMLInputElement;

  const email = emailInput.value;
  const password = passwordInput.value;

  //  VALIDASI
  if (!email || !password) {
    alert("Email dan password harus diisi!");
    return; 
  }

  login(email); 
  alert("Login berhasil!");
  navigate("/dashboard", { replace: true });
};

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex max-w-4xl w-full">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-brown from-red-100 to-red-200 items-center justify-center p-6">
          <img
            src="https://www.invofest-harkatnegeri.com/assets/Maskot-Hero.png"
            alt="login"
            className="w-72"
          />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-red-900 text-center mb-6">
            Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-3 rounded-lg"
            />

            <Button label="Masuk" variant="primary" />

            <p className="text-sm text-center text-gray-600">
              Belum punya akun?{" "}
              <Link to="/register" className="text-red-900 font-semibold">
                Registrasi Sekarang
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}