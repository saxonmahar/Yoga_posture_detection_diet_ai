import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Leaf, Send, Key } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Code, 3: New Password
  const [form, setForm] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const sendResetCode = async (e) => {
    e.preventDefault();
    
    if (!form.email) {
      setMessage("Please enter your email address");
      return;
    }
    
    if (!form.email.includes("@")) {
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Reset code sent to your email!");
        setStep(2);
      } else {
        setMessage(data.message || "Failed to send reset code");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyResetCode = async (e) => {
    e.preventDefault();
    
    if (!form.resetCode) {
      setMessage("Please enter the reset code");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/password/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: form.email,
          token: form.resetCode 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Code verified! Enter your new password.");
        setStep(3);
      } else {
        setMessage(data.message || "Invalid or expired reset code");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (!form.newPassword || !form.confirmPassword) {
      setMessage("Please fill in both password fields");
      return;
    }
    
    if (form.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    
    if (form.newPassword !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: form.email,
          token: form.resetCode,
          newPassword: form.newPassword 
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Password reset successful! You can now login with your new password.");
        navigate("/login");
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4 shadow-lg shadow-orange-500/20 animate-glow">
            <Key size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 mt-2">Recover access to your account</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-5 border border-orange-500/30">
          {/* Back to Login */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-slate-400 hover:text-orange-400 transition-colors text-sm"
            disabled={loading}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </button>

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
                <p className="text-slate-400 text-sm mt-1">Enter your email to receive a reset code</p>
              </div>

              <form onSubmit={sendResetCode} className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-orange-400 transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? "Sending..." : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Reset Code
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Reset Code */}
          {step === 2 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-white">Enter Reset Code</h2>
                <p className="text-slate-400 text-sm mt-1">Check your email for the 6-digit code</p>
              </div>

              <form onSubmit={verifyResetCode} className="space-y-4">
                <div className="relative group">
                  <Key className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-orange-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Enter 6-digit reset code"
                    value={form.resetCode}
                    onChange={(e) => handleInputChange("resetCode", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all text-center text-lg tracking-widest"
                    maxLength="6"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-slate-400 hover:text-orange-400 transition-colors text-sm"
                  disabled={loading}
                >
                  Resend Code
                </button>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-white">New Password</h2>
                <p className="text-slate-400 text-sm mt-1">Create a strong password for your account</p>
              </div>

              <form onSubmit={resetPassword} className="space-y-4">
                <div className="relative group">
                  <Key className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-orange-400 transition-colors" size={18} />
                  <input
                    type="password"
                    placeholder="New password (min 6 characters)"
                    value={form.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                    disabled={loading}
                  />
                </div>

                <div className="relative group">
                  <Key className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-orange-400 transition-colors" size={18} />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes("sent") || message.includes("verified") || message.includes("successful")
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}