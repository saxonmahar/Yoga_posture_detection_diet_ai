import React from "react";
import { 
  Sparkles, 
  Target, 
  Zap, 
  Shield, 
  Users, 
  CheckCircle, 
  Award,
  ArrowRight,
  Play,
  Camera,
  Utensils,
  BarChart3,
  Heart,
  Brain,
  TrendingUp
} from "lucide-react";

export default function HomePage({ onNavigate }) {
  const features = [
    {
      icon: Camera,
      title: "AI Pose Detection",
      description: "Real-time feedback with 98% accuracy to perfect your form",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Utensils,
      title: "Personalized Diet",
      description: "Custom nutrition plans tailored to your wellness goals",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Detailed analytics and insights to track your journey",
      color: "from-green-500 to-emerald-400",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Yoga Instructor",
      content: "YogaAI transformed how I teach. The real-time feedback helps my students improve faster with perfect form.",
      avatar: "👩‍🏫",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Fitness Coach",
      content: "The personalized diet plans combined with yoga tracking gave me the best fitness results I've ever achieved.",
      avatar: "💪",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      role: "Wellness Coach",
      content: "This app helped me stay consistent with my practice. The dashboard insights and AI guidance are amazing!",
      avatar: "✨",
      rating: 5,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and set your wellness goals for personalized guidance",
      color: "from-purple-600 to-pink-600",
    },
    {
      number: "02",
      title: "Scan Your Poses",
      description: "Use AI pose detection to get real-time feedback on your form",
      color: "from-blue-600 to-cyan-500",
    },
    {
      number: "03",
      title: "Receive AI Diet Plan",
      description: "Get personalized nutrition recommendations based on your practice",
      color: "from-green-600 to-emerald-500",
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor improvements with detailed analytics and insights",
      color: "from-orange-600 to-yellow-500",
    },
  ];

  return (
    <div>
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-surface to-secondary -mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Text */}
            <div className="space-y-6 lg:space-y-8 relative z-10">
              <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-sm font-semibold text-accent">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Wellness Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Perfect Your Practice with{" "}
                <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
                  Intelligent Guidance
                </span>
              </h1>

              <p className="text-xl text-text-muted leading-relaxed">
                Real-time yoga posture detection meets personalized diet recommendations to transform your wellness journey with AI-powered precision.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
        

                <button
                  onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                  className="px-8 py-4 bg-card hover:bg-secondary rounded-xl text-lg font-semibold transition border border-white/10 flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-accent">98%</div>
                  <div className="text-sm text-text-muted">Pose Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">10K+</div>
                  <div className="text-sm text-text-muted">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">4.9</div>
                  <div className="text-sm text-text-muted">App Rating</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image/Animation */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-pink-600/20 border border-white/10 backdrop-blur-sm p-8 max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-3xl border border-white/5"></div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent to-pink-500 rounded-2xl flex items-center justify-center animate-float">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>

                {/* Main illustration */}
                <div className="relative h-full flex flex-col items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center mb-6 animate-glow">
                    <div className="text-6xl">🧘‍♀️</div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm font-medium">AI Active</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold">Real-time Pose Analysis</h3>
                    <p className="text-text-muted text-sm">
                      Get instant feedback on your yoga poses with advanced AI technology
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      {/* ... rest of your code remains unchanged ... */}
    </div>
  );
}
