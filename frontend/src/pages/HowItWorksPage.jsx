import React from 'react'
import { 
  UserPlus, 
  Camera, 
  Utensils, 
  BarChart3,
  Play,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  Award
} from 'lucide-react'

function HowItWorksPage({ onNavigate }) {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up in 30 seconds and set your wellness goals",
      details: "Tell us about your fitness level, preferences, and what you want to achieve.",
      color: "from-purple-600 to-pink-600",
    },
    {
      number: 2,
      icon: Camera,
      title: "Scan Your Yoga Poses",
      description: "Use our AI camera to analyze your form",
      details: "Real-time feedback on alignment, balance, and technique with corrective suggestions.",
      color: "from-blue-600 to-cyan-500",
    },
    {
      number: 3,
      icon: Utensils,
      title: "Get Personalized Diet Plan",
      description: "AI-generated nutrition plan based on your practice",
      details: "Custom meal plans, recipes, and grocery lists tailored to your yoga routine.",
      color: "from-green-600 to-emerald-500",
    },
    {
      number: 4,
      icon: BarChart3,
      title: "Track & Improve",
      description: "Monitor progress and get weekly insights",
      details: "Detailed analytics, progress reports, and adaptive recommendations for continuous improvement.",
      color: "from-orange-600 to-yellow-500",
    },
  ]

  const benefits = [
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with other wellness enthusiasts",
    },
    {
      icon: Target,
      title: "Achieve Goals",
      description: "Reach your fitness targets faster",
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Get badges for consistency and progress",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-sm font-semibold text-accent mb-6">
            <Play className="w-4 h-4 mr-2" />
            SIMPLE PROCESS
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            How YogaAI{" "}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              Works
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Transform your wellness journey in 4 simple steps with our AI-powered platform.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-pink-500/50 to-accent/50 transform -translate-x-1/2"></div>
            
            <div className="space-y-16 lg:space-y-32">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isEven = index % 2 === 0
                
                return (
                  <div key={step.number} className="relative">
                    <div className={`lg:flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                      {/* Step Card */}
                      <div className={`lg:w-1/2 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                        <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-accent/50 transition">
                          <div className="flex items-center mb-6">
                            <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mr-4`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <div className="text-sm text-accent font-semibold">Step {step.number}</div>
                              <h3 className="text-2xl font-bold">{step.title}</h3>
                            </div>
                          </div>
                          
                          <p className="text-text-muted mb-4">{step.description}</p>
                          <p className="text-sm text-text-muted/80">{step.details}</p>
                          
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center">
                              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                              <span className="text-sm text-text-muted">Included in free trial</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step Number */}
                      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold border-4 border-primary`}>
                          {step.number}
                        </div>
                      </div>
                      
                      {/* Spacer */}
                      <div className="lg:w-1/2"></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-center mb-12">Why It Works</h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-text-muted">{benefit.description}</p>
                  </div>
                )
              })}
            </div>

            {/* Demo CTA */}
            <div className="bg-gradient-to-br from-accent/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-accent/30">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">See It In Action</h3>
                  <p className="text-text-muted mb-6">
                    Watch a quick demo of how our AI analyzes yoga poses and provides real-time feedback.
                  </p>
                  <button className="px-6 py-3 bg-card hover:bg-secondary rounded-xl font-semibold transition border border-white/10 flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo Video
                  </button>
                </div>
                <div className="lg:w-96">
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-pink-600/20 rounded-2xl border border-white/10 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center mb-4">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-text-muted">AI Pose Detection Demo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-16 text-center">
              <button
                onClick={() => onNavigate('register')}
                className="px-10 py-4 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl text-lg font-bold transition-all shadow-2xl shadow-accent/30 hover:shadow-accent/50 flex items-center mx-auto"
              >
                <span>Start Your Journey Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <p className="text-text-muted text-sm mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorksPage