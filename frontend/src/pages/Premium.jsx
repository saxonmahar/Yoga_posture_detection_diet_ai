import React, { useState } from 'react'
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Clock, 
  Award, 
  Sparkles,
  X,
  Heart,
  TrendingUp,
  Target
} from 'lucide-react'

function Premium({ onNavigate, user }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      color: 'from-gray-600 to-gray-800',
      features: [
        { text: 'Basic Pose Detection', included: true },
        { text: 'Limited Diet Plans', included: true },
        { text: 'Community Access', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Advanced AI Coaching', included: false },
        { text: 'Personalized Plans', included: false },
        { text: 'Live Yoga Classes', included: false },
        { text: 'Priority Support', included: false },
      ]
    },
    {
      name: 'Premium',
      price: selectedPlan === 'yearly' ? '$99' : '$12',
      period: selectedPlan === 'yearly' ? 'per year' : 'per month',
      color: 'from-premium to-orange-500',
      popular: true,
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Advanced Pose Analysis', included: true },
        { text: 'Custom Diet Plans', included: true },
        { text: 'Live Yoga Classes', included: true },
        { text: 'Personal AI Coach', included: true },
        { text: 'Progress Tracking', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Offline Access', included: true },
      ]
    },
  ]

  const benefits = [
    { icon: Zap, title: 'Advanced AI', description: 'Real-time personalized feedback' },
    { icon: Target, title: 'Custom Plans', description: 'Tailored to your goals' },
    { icon: Users, title: 'Live Classes', description: 'Join expert-led sessions' },
    { icon: Shield, title: 'Priority Support', description: '24/7 dedicated help' },
  ]

  const handleUpgrade = () => {
    setIsProcessing(true)
    setTimeout(() => {
      alert('Thank you for upgrading! You now have Premium access.')
      setIsProcessing(false)
      onNavigate('dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-premium to-orange-500 rounded-2xl flex items-center justify-center animate-glow">
              <Star className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-premium animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Level Up Your{' '}
            <span className="bg-gradient-to-r from-premium to-orange-400 bg-clip-text text-transparent">
              Wellness Journey
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Unlock premium AI-powered yoga guidance, personalized diet plans, and exclusive wellness features.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="bg-surface rounded-2xl p-1 inline-flex">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-8 py-3 rounded-xl font-semibold transition ${selectedPlan === 'monthly' ? 'bg-card text-text' : 'text-text-muted hover:text-text'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-8 py-3 rounded-xl font-semibold transition ${selectedPlan === 'yearly' ? 'bg-gradient-to-r from-accent to-pink-500 text-text' : 'text-text-muted hover:text-text'}`}
            >
              Yearly <span className="text-premium">(Save 30%)</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card/50 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all hover:scale-[1.02] ${
                plan.popular
                  ? 'border-premium/50 shadow-2xl shadow-premium/20'
                  : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-premium to-orange-500 rounded-full text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                  <span className="text-text-muted ml-2">/{plan.period}</span>
                </div>
                <p className="text-text-muted">
                  {plan.name === 'Premium' 
                    ? 'Perfect for serious wellness enthusiasts'
                    : 'Great for getting started'}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    {feature.included ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        plan.popular ? 'bg-premium/20' : 'bg-accent/20'
                      }`}>
                        <Check className={`w-4 h-4 ${plan.popular ? 'text-premium' : 'text-accent'}`} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-3">
                        <X className="w-4 h-4 text-text-muted" />
                      </div>
                    )}
                    <span className={feature.included ? '' : 'text-text-muted'}>{feature.text}</span>
                  </div>
                ))}
              </div>

              {plan.name === 'Free' ? (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-4 bg-surface hover:bg-secondary rounded-xl font-bold transition border border-white/10"
                >
                  Continue with Free
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-premium to-orange-500 hover:from-premium/90 hover:to-orange-600 rounded-xl font-bold transition-all shadow-lg shadow-premium/20 hover:shadow-premium/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Processing...
                    </>
                  ) : user?.isPremium ? (
                    'You are Premium!'
                  ) : (
                    'Upgrade to Premium'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose <span className="text-green-400">Premium</span>?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition hover:scale-105 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 border border-green-500/30">
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-slate-400">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">
            Loved by <span className="text-green-400">10,000+</span> Yogis
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah K.', role: 'Yoga Teacher', text: 'Premium transformed how I teach and practice. The AI feedback is incredible!' },
              { name: 'Mike R.', role: 'Fitness Coach', text: 'The personalized diet plans helped me lose 15lbs while gaining flexibility.' },
              { name: 'Emma L.', role: 'Wellness Coach', text: 'Best investment in my health. The live classes keep me motivated.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center mb-4">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-5 h-5 text-green-400 fill-green-400" />
                  ))}
                </div>
                <p className="text-slate-400 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
              { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee if you are not satisfied.' },
              { q: 'Can I switch between plans?', a: 'Absolutely! You can upgrade or downgrade your plan at any time.' },
              { q: 'Is there a free trial?', a: 'Yes, we offer a 7-day free trial for Premium features.' },
            ].map((faq, index) => (
              <div key={index} className="bg-card/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-accent hover:text-accent-light font-semibold flex items-center justify-center mx-auto mb-4"
          >
            ← Back to Dashboard
          </button>
          <p className="text-text-muted text-sm">
            Need help deciding?{' '}
            <button className="text-accent hover:text-accent-light">
              Contact our wellness experts
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Premium