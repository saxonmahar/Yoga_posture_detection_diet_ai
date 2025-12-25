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

    if (!form.email || !form.password)
      return alert("Please fill all fields");
    if (!form.email.includes("@"))
      return alert("Please enter a valid email");
    if (form.password.length < 6)
      return alert("Password must be at least 6 characters");

    setLoading(true);

    try {
      await login({
        email: form.email,
        password: form.password
      });

      alert("Login successful!");
      navigate("/dashboard"); // ✅ FIXED
    } catch (err) {
      let message = "Invalid email or password. Please try again.";

      if (err.response?.data?.message) {
        message = err.response.data.message;
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
        await login({
          email: "demo@yogaai.com",
          password: "demo123"
        });

        alert("Demo login successful!");
        navigate("/dashboard"); // ✅ FIXED
      } catch {
        alert("Demo login failed. Please create an account.");
        setLoading(false);
      }
    }, 300);
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
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  handleInputChange("email", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border-2 rounded-xl"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  handleInputChange("password", e.target.value)
                }
                className="w-full pl-10 pr-12 py-3 border-2 rounded-xl"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 text-white rounded-xl"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 bg-emerald-100 text-emerald-700 rounded-xl"
          >
            Try Demo Account
          </button>

          <p className="text-center text-sm">
            New to YogaLife?{" "}
            <button
              onClick={() => navigate("/register")} // ✅ FIXED
              className="text-emerald-600 font-semibold"
            >
              Create your account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
