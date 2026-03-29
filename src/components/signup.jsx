import { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  // Make sure your authcontext exports a signUp or register function!
  const { signUp } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Pre-flight check: Make sure passwords match
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    // Pre-flight check: Basic length validation (adjust to your backend rules)
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await signUp(email.trim(), password);
      
      // Depending on your auth flow, you might redirect to a dashboard
      // OR redirect to "/login" if they need to verify their email first.
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message || "Failed to create an account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] text-white px-4">
      <div className="w-full max-w-md bg-[#121a22] p-8 rounded-2xl shadow-2xl border border-white/5">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Create an account 🚀</h1>
        <p className="text-sm text-gray-400 mb-6">
          Sign up to get started
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">

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
            autoComplete="new-password" // Tells password managers to generate a new one
            placeholder="Password"
            className="bg-[#1a222c] p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm Password"
            className="bg-[#1a222c] p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 transition p-3 rounded-lg font-semibold disabled:opacity-60 mt-2"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <button 
            onClick={() => navigate("/login")}
            className="text-indigo-400 cursor-pointer hover:underline bg-transparent border-none p-0 inline"
          >
            Log in
          </button>
        </p>

      </div>
    </div>
  );
}