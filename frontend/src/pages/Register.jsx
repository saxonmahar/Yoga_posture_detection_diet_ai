import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Leaf, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    level: "beginner",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return alert("Please fill all fields");
    }
    if (!form.email.includes("@")) {
      return alert("Please enter a valid email");
    }
    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);

    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        level: form.level,
      });

      console.log("Registration successful:", result);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);

      let message = "Registration failed. Please try again.";

      if (err.response?.data) {
        const data = err.response.data;
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          message = data.errors.join(", ");
        } else if (data.message) {
          message = data.message;
        }
      } else if (err.message) {
        message = err.message;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full mb-4 shadow-lg shadow-green-500/20 animate-glow">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">YogaLife</h1>
          <p className="text-slate-400 mt-2">Begin your wellness journey today</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-5 border border-green-500/30">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-slate-400 text-sm mt-1">Join our wellness community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 6 characters)"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-green-400 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-green-400 transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Your Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["beginner", "intermediate", "advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleInputChange("level", level)}
                    disabled={loading}
                    className={`py-2.5 px-4 rounded-lg font-medium transition-all ${
                      form.level === level
                        ? "bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/20"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="text-green-400 font-semibold hover:text-green-300 transition-colors"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          By creating an account, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
