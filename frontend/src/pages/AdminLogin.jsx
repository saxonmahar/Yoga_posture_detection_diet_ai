// Admin Login Page - Separate login for admin access
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Attempting admin login...');
      console.log('📧 Email:', form.email);
      
      // Use AuthContext login function to properly set user state
      const response = await login({
        email: form.email,
        password: form.password
      });

      console.log('📦 Login response:', response);

      if (!response.success) {
        setError(response.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Check if user is admin
      const userRole = response.data?.user?.role;
      console.log('🛡️ User role:', userRole);
      
      if (userRole !== 'admin') {
        // Logout non-admin
        await fetch('http://localhost:5001/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }
      
      console.log('✅ Admin login successful! Redirecting to dashboard...');
      // Navigate to admin dashboard
      navigate("/admin/dashboard", { replace: true });
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen -mt-16 lg:-mt-20 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-lg shadow-red-500/20 animate-glow">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-2">System Management & Control</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-5 border border-red-500/30">
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-slate-400 text-sm mt-1">
              Enter your admin credentials
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30">
              {error}
            </div>
          )}

          {/* Info Message */}
          <div className="p-3 rounded-lg text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <strong>⚠️ Admin Access Only</strong><br/>
            Only authorized administrators can access this portal.
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-red-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Admin email address"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-red-400 transition-colors" size={18} />
              <input
                type={show ? "text" : "password"}
                placeholder="Admin password"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-red-400 transition-colors"
                disabled={loading}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Access Admin Panel"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-slate-400 text-sm">
              Not an admin?{" "}
              <Link
                to="/register"
                className="text-red-400 font-semibold hover:text-red-300 transition-colors"
              >
                User Registration
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            🔒 This is a secure admin area. All access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
