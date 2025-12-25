import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Leaf, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.email || !form.password) return alert("Please fill all fields");
    if (!form.email.includes("@")) return alert("Please enter a valid email");
    if (form.password.length < 6) return alert("Password must be at least 6 characters");

    setLoading(true);

    try {
      const result = await login({
        email: form.email,
        password: form.password
      });

      alert("Login successful!");
      navigate("/Dashboard");
    } catch (err) {
      console.error("Login error:", err);

      let message = "Invalid email or password. Please try again.";
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

  const handleDemoLogin = async () => {
    setForm({ email: "demo@yogaai.com", password: "demo123" });
    setTimeout(async () => {
      setLoading(true);
      try {
        await login({ email: "demo@yogaai.com", password: "demo123" });
        alert("Demo login successful!");
        navigate("/Dashboard");
      } catch (err) {
        alert("Demo login failed. Please create an account.");
        setLoading(false);
      }
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) submit(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="absolute top-10 left-10 opacity-20">
        <Leaf size={80} className="text-emerald-600" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <Heart size={80} className="text-rose-400" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4 shadow-lg">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">YogaLife</h1>
          <p className="text-gray-600 mt-2">Nourish your body, calm your mind</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl space-y-5 border border-emerald-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 text-sm mt-1">Continue your wellness journey</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onKeyPress={handleKeyPress}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-all"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onKeyPress={handleKeyPress}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
                disabled={loading}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-all border border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Try Demo Account
          </button>

          <div className="text-center pt-2">
            <p className="text-gray-600 text-sm">
              New to YogaLife?{" "}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); navigate("/Register"); }}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                disabled={loading}
              >
                Create your account
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
