import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Shield, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import api from "../services/api/client";

export default function EmailVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/email/verify", {
        email,
        otp: otpString
      });

      if (response.data.success) {
        setSuccess("Email verified successfully! You can now log in.");
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Email verified! You can now log in with your password.",
              email,
              verified: true
            }
          });
        }, 2000);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const response = await api.post("/email/resend", { email });
      
      if (response.data.success) {
        setSuccess("Verification code sent! Check your email.");
        setTimeLeft(600); // Reset timer
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError(err.response?.data?.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4 shadow-lg shadow-emerald-500/20">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Verify Your Email</h1>
          <p className="text-slate-400 mt-2">We sent a code to {email}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-emerald-500/30">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
              <p className="text-emerald-400 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4 text-center">
                Enter the 6-digit code
              </label>
              
              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Code expires in: <span className="text-emerald-400 font-mono">{formatTime(timeLeft)}</span>
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Email
                </>
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resending || timeLeft > 540} // Allow resend after 1 minute
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Code
                </>
              )}
            </button>
            {timeLeft > 540 && (
              <p className="text-slate-500 text-xs mt-1">
                Wait {formatTime(timeLeft - 540)} to resend
              </p>
            )}
          </div>

          {/* Back to Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-slate-400 text-sm hover:text-slate-300 transition-colors"
            >
              ← Back to Registration
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}