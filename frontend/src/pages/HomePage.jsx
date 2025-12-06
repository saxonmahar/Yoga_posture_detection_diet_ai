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
    {
      icon: Users,
      title: "Live Community",
      description: "Join expert-led yoga sessions with global practitioners",
      color: "from-orange-500 to-yellow-400",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-surface to-secondary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
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
                  onClick={() => onNavigate("register")}
                  className="px-8 py-4 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 flex items-center justify-center"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>

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
      <section id="features" className="py-20 lg:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-4">
              <Target className="w-4 h-4 mr-2" />
              POWERFUL FEATURES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
                Holistic Wellness
              </span>
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Advanced AI technology combined with wellness expertise for your complete health journey.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-text">{feature.title}</h3>
                  <p className="text-text-muted">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <button className="text-accent hover:text-accent-light text-sm font-semibold flex items-center">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to transform your wellness journey?</h3>
                <p className="text-text-muted">Join thousands who achieved their fitness goals with AI guidance.</p>
              </div>
              <button
                onClick={() => onNavigate("register")}
                className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
              >
                Start Free 14-Day Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how" className="py-20 lg:py-32 bg-primary">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-4">
              <Zap className="w-4 h-4 mr-2" />
              SIMPLE PROCESS
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
                4 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Begin your AI-powered wellness journey with our intuitive step-by-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/50 transition">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6`}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text">{step.title}</h3>
                  <p className="text-text-muted">
                    {step.description}
                  </p>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-accent/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>

          {/* Process Visualization */}
          <div className="mt-16 bg-surface/50 rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold mb-4">See It In Action</h3>
                <p className="text-text-muted mb-6">
                  Watch how our AI technology analyzes yoga poses in real-time and provides instant feedback to help you perfect your form.
                </p>
                <button className="px-6 py-3 bg-card hover:bg-secondary rounded-xl font-semibold transition border border-white/10 flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo Video
                </button>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-pink-600/20 rounded-2xl border border-white/10 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-text-muted">AI Pose Detection Preview</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center animate-pulse">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section id="testimonials" className="py-20 lg:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-4">
              <Heart className="w-4 h-4 mr-2" />
              LOVED BY USERS
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
                10,000+ Yogis
              </span>
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Join our community of wellness enthusiasts who transformed their practice with AI guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 text-3xl flex items-center justify-center">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </div>

                <p className="text-text-muted mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034 1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292L3.93 8.72c-.783-.57-.38-1.81.588-1.81h3.461l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs text-text-muted">Verified User</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <div className="text-text-muted">User Satisfaction</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-accent mb-2">50K+</div>
              <div className="text-text-muted">Poses Analyzed</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-accent mb-2">4.9/5</div>
              <div className="text-text-muted">App Store Rating</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-accent mb-2">24/7</div>
              <div className="text-text-muted">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-surface to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-6">
            <Award className="w-4 h-4 mr-2" />
            START YOUR JOURNEY
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              Wellness Journey?
            </span>
          </h2>
          
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Join thousands who achieved their fitness goals with our AI-powered yoga and nutrition platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("register")}
              className="px-10 py-4 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl text-lg font-bold transition-all shadow-2xl shadow-accent/30 hover:shadow-accent/50 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free 14-Day Trial
            </button>

            <button className="px-10 py-4 bg-card hover:bg-secondary rounded-xl text-lg font-semibold transition border border-white/10">
              Book a Demo
            </button>
          </div>

          <p className="text-text-muted text-sm mt-6">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}