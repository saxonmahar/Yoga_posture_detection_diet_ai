import React from 'react';
import { Target, Camera, Brain, CheckCircle, Zap, Users, Award, ArrowRight } from 'lucide-react';

function HowItWorksPage({ onNavigate }) {
  const steps = [
    {
      number: '01',
      icon: Target,
      title: 'Set Your Goals',
      description: 'Tell us your wellness objectives - weight loss, flexibility, stress relief, or strength building.',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      number: '02',
      icon: Camera,
      title: 'AI Pose Detection',
      description: 'Use your camera to practice yoga. Our AI analyzes your form in real-time.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      icon: Brain,
      title: 'Personalized Feedback',
      description: 'Get instant corrections and personalized tips to improve your practice.',
      color: 'from-green-500 to-emerald-400'
    },
    {
      number: '04',
      icon: Users,
      title: 'Track Progress',
      description: 'Monitor your improvements with detailed analytics and achievement milestones.',
      color: 'from-orange-500 to-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-6">
            <Zap className="w-4 h-4 mr-2" />
            SIMPLE PROCESS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How YogaAI Works in{' '}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Start your AI-powered wellness journey with our intuitive, step-by-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full hover:border-accent/30 transition card-hover">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6`}>
                    {step.number}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-text-muted">{step.description}</p>
                </div>
                
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-accent/50 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Explanation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Technology Behind YogaAI</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-card/50 rounded-2xl p-8 border border-white/10 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">Advanced AI Algorithms</h3>
                </div>
                <p className="text-text-muted mb-4">
                  Our system uses computer vision and machine learning to analyze 32 key points of your body in real-time.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    <span>98% pose accuracy</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    <span>Real-time feedback (under 200ms)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    <span>Personalized improvement tips</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <div className="bg-card/50 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mr-4">
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Proven Results</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Average improvement</span>
                      <span className="text-accent font-bold">+45%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">User satisfaction</span>
                      <span className="text-accent font-bold">94%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-text-muted mb-6 max-w-2xl mx-auto">
            Join thousands who transformed their wellness practice with AI guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-card hover:bg-secondary rounded-xl font-semibold transition border border-white/10"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;