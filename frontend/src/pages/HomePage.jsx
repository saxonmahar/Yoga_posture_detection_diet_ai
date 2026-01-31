import React from "react";
import { 
  Sparkles, 
  ArrowRight,
  Play,
  Camera,
  Utensils,
  BarChart3
} from "lucide-react";

export default function HomePage({ onNavigate }) {
  const [currentPoseIndex, setCurrentPoseIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  
  const poseImages = [
    { src: "/images/poses/tree.jpg", name: "Tree Pose" },
    { src: "/images/poses/warrior2.jpg", name: "Warrior II" },
    { src: "/images/poses/downward_dog.jpg", name: "Downward Dog" },
    { src: "/images/poses/goddess.jpg", name: "Goddess" },
    { src: "/images/poses/plank.jpg", name: "Plank" },
    { src: "/images/poses/tpose.jpg", name: "T-Pose" }
  ];

  // Auto-rotate poses every 2 seconds (pause on hover)
  React.useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentPoseIndex((prev) => (prev + 1) % poseImages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [poseImages.length, isPaused]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative overflow-hidden -mt-25">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Text */}
            <div className="space-y-6 lg:space-y-8 relative z-10">
              <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full text-sm font-semibold text-green-400 border border-green-500/30">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Wellness Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Perfect Your Practice with{" "}
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Intelligent Guidance
                </span>
              </h1>

              <p className="text-xl text-slate-400 leading-relaxed">
                Real-time yoga posture detection meets personalized diet recommendations to transform your wellness journey with AI-powered precision.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-xl text-lg font-semibold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-green-400">98%</div>
                  <div className="text-sm text-slate-400">Pose Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">10K+</div>
                  <div className="text-sm text-slate-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">4.9</div>
                  <div className="text-sm text-slate-400">App Rating</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image/Animation */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-green-500/30 backdrop-blur-xl p-8 max-w-lg mx-auto shadow-2xl">
                <div className="absolute inset-0 rounded-3xl border border-green-500/20"></div>

                {/* Floating Camera Icon with Animation */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-green-500/20 cursor-pointer hover:scale-110 transition-transform group">
                  <Camera className="w-10 h-10 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  {/* Pulse rings for recording effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-red-400 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-red-300 animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
                </div>

                {/* Floating Progress Icon */}
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/20">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>

                {/* Floating Accuracy Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full backdrop-blur-sm">
                  <span className="text-green-400 text-xs font-semibold">98% Accuracy</span>
                </div>

                {/* Main Content Area */}
                <div className="relative h-full flex flex-col items-center justify-center">
                  
                  {/* Yoga Pose Showcase */}
                  <div className="relative mb-6">
                    {/* Main Pose Circle with Rotating Border */}
                    <div 
                      className="w-40 h-40 relative cursor-pointer"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full opacity-20 ${!isPaused ? 'animate-spin-slow' : ''}`}></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 overflow-hidden">
                        {/* Auto-rotating Yoga Pose Images */}
                        <div className="relative w-full h-full">
                          {poseImages.map((pose, index) => (
                            <img 
                              key={index}
                              src={pose.src} 
                              alt={pose.name} 
                              className={`absolute inset-0 w-full h-full object-cover object-center rounded-full transition-opacity duration-1000 ${
                                index === currentPoseIndex ? 'opacity-100' : 'opacity-0'
                              }`}
                              style={{
                                objectPosition: 'center center',
                                transform: 'scale(1.1)' // Slight zoom to ensure full coverage
                              }}
                            />
                          ))}
                          {/* Pose name indicator */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                            <span className="text-white text-xs font-semibold">
                              {poseImages[currentPoseIndex]?.name}
                            </span>
                          </div>
                          {/* Pause indicator */}
                          {isPaused && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <div className="w-2 h-2 bg-white rounded-full ml-0.5"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Floating Mini Pose Icons - Auto-rotating */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce shadow-lg overflow-hidden" style={{animationDelay: '0.5s'}}>
                      <img 
                        src={poseImages[(currentPoseIndex + 1) % poseImages.length]?.src} 
                        alt="Mini Pose" 
                        className="w-full h-full object-cover object-center rounded-full" 
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    
                    <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg overflow-hidden" style={{animationDelay: '1s'}}>
                      <img 
                        src={poseImages[(currentPoseIndex + 2) % poseImages.length]?.src} 
                        alt="Mini Pose" 
                        className="w-full h-full object-cover object-center rounded-full" 
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>

                    <div className="absolute top-1/2 -left-6 w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce shadow-lg overflow-hidden" style={{animationDelay: '1.5s'}}>
                      <img 
                        src={poseImages[(currentPoseIndex + 3) % poseImages.length]?.src} 
                        alt="Mini Pose" 
                        className="w-full h-full object-cover object-center rounded-full" 
                        style={{ transform: 'scale(1.3)' }}
                      />
                    </div>
                  </div>

                  {/* Status and Info */}
                  <div className="text-center space-y-4 w-full">
                    <div className="inline-flex items-center px-4 py-2 bg-slate-700/50 rounded-full border border-green-500/30 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm font-medium text-white">AI Active</span>
                      <div className="ml-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    </div>

                    <h3 className="text-2xl font-bold text-white">Real-time Pose Analysis</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Get instant feedback on your yoga poses with advanced AI technology
                    </p>

                    {/* Pose rotation indicator */}
                    <div className="flex justify-center gap-1 mt-3">
                      {poseImages.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index === currentPoseIndex 
                              ? 'bg-green-400 w-6 shadow-lg shadow-green-400/50' 
                              : 'bg-slate-600 w-2 hover:bg-slate-500'
                          }`}
                          onClick={() => setCurrentPoseIndex(index)}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-2">
                      {isPaused ? 'Hover to pause • Click dots to navigate' : 'Auto-rotating every 2 seconds'}
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                        6 Poses
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        Live Feedback
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                        Progress Tracking
                      </span>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => onNavigate('/pose-detection')}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center justify-center mx-auto group"
                    >
                      <Camera className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                      Try Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Animated Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Experience the future of wellness with our intelligent platform that combines computer vision, machine learning, and personalized recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 hover:border-green-500/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                
                <div className="mt-6 flex items-center text-green-400 group-hover:text-green-300 transition-colors">
                  <span className="text-sm font-semibold">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- YOGA POSES SHOWCASE SECTION ---------------- */}
      <section className="py-20 relative bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Master 6 Essential Yoga Poses
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our AI recognizes and provides real-time feedback on these fundamental yoga poses to help you perfect your practice.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Tree Pose", image: "/images/poses/tree.jpg", color: "from-green-500 to-emerald-400", difficulty: "Beginner" },
              { name: "Warrior II", image: "/images/poses/warrior2.jpg", color: "from-orange-500 to-red-500", difficulty: "Intermediate" },
              { name: "T Pose", image: "/images/poses/tpose.jpg", color: "from-blue-500 to-cyan-500", difficulty: "Beginner" },
              { name: "Goddess", image: "/images/poses/goddess.jpg", color: "from-purple-500 to-pink-500", difficulty: "Intermediate" },
              { name: "Downward Dog", image: "/images/poses/downward_dog.jpg", color: "from-yellow-500 to-orange-500", difficulty: "Intermediate" },
              { name: "Plank", image: "/images/poses/plank.jpg", color: "from-indigo-500 to-purple-500", difficulty: "Beginner" }
            ].map((pose, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-green-500/30 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`w-16 h-16 bg-gradient-to-br ${pose.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform overflow-hidden shadow-lg`}>
                  <img 
                    src={pose.image} 
                    alt={pose.name} 
                    className="w-full h-full object-cover object-center rounded-2xl"
                    style={{ 
                      objectPosition: 'center center',
                      transform: 'scale(1.1)' // Slight zoom for better coverage
                    }}
                  />
                </div>
                
                <h3 className="text-sm font-bold text-white text-center mb-2">{pose.name}</h3>
                <div className="text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    pose.difficulty === 'Beginner' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {pose.difficulty}
                  </span>
                </div>
                
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${pose.color} rounded-full animate-pulse`} style={{width: '85%'}}></div>
                  </div>
                  <p className="text-xs text-slate-400 text-center mt-1">85% Accuracy</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('/pose-detection')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-xl text-lg font-semibold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center justify-center mx-auto group"
            >
              <Camera className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Pose Detection
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => onNavigate('/pose-detection')}
          className="group relative w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 rounded-full shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <Camera className="w-8 h-8 text-white group-hover:animate-pulse" />
          
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 shadow-xl">
            Start AI Pose Detection
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-800 border-r border-b border-slate-700 transform rotate-45 -translate-y-1/2"></div>
          </div>
        </button>
      </div>
    </div>
  );
}
