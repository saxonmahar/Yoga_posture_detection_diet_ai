import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Leaf, Heart, Key } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check if user came from email verification
  useState(() => {
    if (location.state?.needsVerification) {
      setNeedsVerification(true);
      setForm(prev => ({ ...prev, email: location.state.email || "" }));
      setVerificationMessage(location.state.message || "Please enter your password and OTP to complete login");
    } else if (location.state?.verified) {
      // User just verified email, no need for OTP again
      setForm(prev => ({ ...prev, email: location.state.email || "" }));
      setVerificationMessage(location.state.message || "Email verified! Please enter your password to login.");
    }
  }, [location.state]);

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

    // If user needs verification, require OTP
    if (needsVerification && !form.otp) {
      return alert("Please enter the OTP code from your email");
    }

    setLoading(true);

    try {
      // If user needs verification, verify OTP first
      if (needsVerification && form.otp) {
        const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/email/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp
          }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
          alert(verifyData.message || "Invalid OTP code");
          setLoading(false);
          return;
        }

        // OTP verified, now proceed with login
        alert("Email verified successfully!");
      }

      await login({
        email: form.email,
        password: form.password
      });

      alert("Login successful!");
      
      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      let message = "Invalid email or password. Please try again.";

      if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      // Handle email verification required
      if (err.response?.data?.requiresVerification || err.response?.status === 403) {
        setNeedsVerification(true);
        setVerificationMessage("Please verify your email first. Check your inbox for the OTP code.");
        return;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!form.email) {
      alert("Please enter your email address first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/email/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("New OTP sent to your email!");
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      alert("Failed to resend OTP. Please try again.");
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
        
        // Check if there's a redirect URL stored
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectUrl);
        } else {
          navigate("/dashboard");
        }
      } catch {
        alert("Demo login failed. Please create an account.");
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen -mt-16 lg:-mt-20 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
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
          <p className="text-slate-400 mt-2">Nourish your body, calm your mind</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-5 border border-green-500/30">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {needsVerification ? "Complete Verification" : "Welcome Back"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {needsVerification ? "Enter your password and OTP to login" : "Sign in to your account"}
            </p>
          </div>

          {/* Verification Message */}
          {verificationMessage && (
            <div className="p-3 rounded-lg text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {verificationMessage}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  handleInputChange("email", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={18} />
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  handleInputChange("password", e.target.value)
                }
                className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-green-400 transition-colors"
                disabled={loading}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* OTP Field - Only show when verification is needed */}
            {needsVerification && (
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP from email"
                  value={form.otp}
                  onChange={(e) =>
                    handleInputChange("otp", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-center text-lg tracking-widest"
                  maxLength="6"
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : (needsVerification ? "Verify & Sign In" : "Sign In")}
            </button>

            {/* Resend OTP Button - Only show when verification is needed */}
            {needsVerification && (
              <button
                type="button"
                onClick={resendOTP}
                disabled={loading}
                className="w-full py-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                Didn't receive OTP? Resend Code
              </button>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-slate-400 hover:text-green-400 transition-colors"
                disabled={loading}
              >
                Forgot your password?
              </button>
            </div>
          </form>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg font-medium transition-all bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600 disabled:opacity-50 cursor-not-allowed"
          >
            Try Demo Account
          </button>

          <div className="text-center pt-2">
            <p className="text-slate-400 text-sm">
              New to YogaLife?{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
                className="text-green-400 font-semibold hover:text-green-300 transition-colors"
                disabled={loading}
              >
                Create your account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
