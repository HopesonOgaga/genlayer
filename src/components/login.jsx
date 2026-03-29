import { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom"; // Recommended for redirects

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // .trim() removes accidental trailing spaces
      await signIn(email.trim(), password);
      
      // Redirect immediately on success
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      // Only stop loading if we are staying on this page to show the error
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] text-white px-4">
      <div className="w-full max-w-md bg-[#121a22] p-8 rounded-2xl shadow-2xl border border-white/5">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-sm text-gray-400 mb-6">
          Login to continue
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="email"
            autoComplete="email"
            placeholder="Email address"
            className="bg-[#1a222c] p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="bg-[#1a222c] p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 transition p-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          Don’t have an account?{" "}
          <button 
            onClick={() => navigate("/signup")}
            className="text-indigo-400 cursor-pointer hover:underline bg-transparent border-none p-0 inline"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
}