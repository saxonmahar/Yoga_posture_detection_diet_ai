import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Leaf, Heart, Ruler, Weight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    level: "beginner",
    age: "",
    weight: "",
    height: "",
    bodyType: "mesomorphic",
    goal: "maintain",
    // Keep some enhanced preferences but make them optional
    yogaStyle: "hatha",
    sessionDuration: "30",
    preferredTime: "morning"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Calculate BMI from weight and height
  const calculateBMI = (weight, height) => {
    if (!weight || !height || weight <= 0 || height <= 0) return null;
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.age || !form.weight || !form.height) {
      return alert("Please fill all required fields");
    }
    
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(form.email)) {
      return alert("Please enter a valid email address");
    }
    
    // Check for suspicious domains
    const domain = form.email.toLowerCase().split('@')[1];
    const suspiciousDomains = ['test.com', 'fake.com', 'example.com', 'dummy.com', 'invalid.com'];
    if (suspiciousDomains.includes(domain)) {
      return alert("Please use a real email address. Temporary or fake email services are not allowed.");
    }
    
    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }
    if (form.age < 1 || form.age > 120) {
      return alert("Please enter a valid age");
    }
    if (form.weight < 1 || form.weight > 500) {
      return alert("Please enter a valid weight (1-500 kg)");
    }
    if (form.height < 50 || form.height > 300) {
      return alert("Please enter a valid height (50-300 cm)");
    }

    setLoading(true);

    try {
      // Calculate BMI
      const bmi = calculateBMI(parseFloat(form.weight), parseFloat(form.height));

      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        level: form.level,
        age: parseInt(form.age),
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        bodyType: form.bodyType,
        goal: form.goal,
        bmi: bmi ? parseFloat(bmi) : null,
        // Include some enhanced preferences
        yogaStyle: form.yogaStyle,
        sessionDuration: parseInt(form.sessionDuration),
        preferredTime: form.preferredTime
      });

      console.log("Registration successful:", result);
      
      // Handle different success scenarios
      if (result.success) {
        // Check if email verification is required
        if (result.requiresVerification) {
          if (result.emailWarning) {
            // Account created but email failed
            alert("Account created successfully! However, verification email failed to send. You can still login and resend verification later.");
            navigate("/login");
          } else {
            // Account created and email sent - redirect to login with verification needed
            navigate("/login", { 
              state: { 
                email: form.email,
                needsVerification: true,
                message: "Please check your email for the OTP code, then enter it below with your password to complete registration."
              }
            });
          }
        } else {
          // Account fully created
          navigate("/login");
        }
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      console.error("Error status:", err.response?.status);

      let message = "Registration failed. Please try again.";

      if (err.response?.data) {
        const data = err.response.data;
        console.log("Backend error data:", data);
        
        // Handle email validation errors specifically
        if (data.emailError) {
          message = data.message || "Invalid email address";
          if (data.validationDetails?.errors) {
            message = data.validationDetails.errors.join(", ");
          }
        } else if (Array.isArray(data.errors) && data.errors.length > 0) {
          message = data.errors.join(", ");
        } else if (data.message) {
          message = data.message;
        }
      } else if (err.message) {
        // Network or other errors
        if (err.message.includes('Network Error')) {
          message = "Cannot connect to server. Please check if the backend is running.";
        } else if (err.message.includes('timeout')) {
          message = "Request timed out. Please try again.";
        } else {
          message = `Connection error: ${err.message}`;
        }
      }

      console.log("Final error message:", message);
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

            {/* Age, Weight, Height Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Age */}
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Weight */}
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={form.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  required
                  min="1"
                  max="500"
                  step="0.1"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Height */}
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={form.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  required
                  min="50"
                  max="300"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* BMI Display */}
            {form.weight && form.height && parseFloat(form.weight) > 0 && parseFloat(form.height) > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-sm text-green-400 font-medium">
                  Your BMI: <span className="text-white">{calculateBMI(parseFloat(form.weight), parseFloat(form.height))}</span>
                </p>
              </div>
            )}

            {/* Body Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Body Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "ectomorphic", label: "Ectomorph", desc: "Naturally thin" },
                  { value: "mesomorphic", label: "Mesomorph", desc: "Athletic build" },
                  { value: "endomorphic", label: "Endomorph", desc: "Larger frame" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange("bodyType", type.value)}
                    disabled={loading}
                    className={`py-2.5 px-3 rounded-lg font-medium transition-all text-sm ${
                      form.bodyType === type.value
                        ? "bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/20"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={type.desc}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Your Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "weight_loss", label: "Lose Weight" },
                  { value: "maintain", label: "Maintain" },
                  { value: "weight_gain", label: "Gain Weight" },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => handleInputChange("goal", goal.value)}
                    disabled={loading}
                    className={`py-2.5 px-3 rounded-lg font-medium transition-all text-sm ${
                      form.goal === goal.value
                        ? "bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/20"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
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

            {/* Optional: Quick Yoga Preferences (Compact) */}
            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm text-slate-400 mb-3">Quick Preferences (Optional)</p>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={form.yogaStyle}
                  onChange={(e) => handleInputChange("yogaStyle", e.target.value)}
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
                  disabled={loading}
                >
                  <option value="hatha">Hatha</option>
                  <option value="vinyasa">Vinyasa</option>
                  <option value="yin">Yin</option>
                  <option value="power">Power</option>
                </select>
                
                <select
                  value={form.sessionDuration}
                  onChange={(e) => handleInputChange("sessionDuration", e.target.value)}
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
                  disabled={loading}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                </select>
                
                <select
                  value={form.preferredTime}
                  onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
                  disabled={loading}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
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
