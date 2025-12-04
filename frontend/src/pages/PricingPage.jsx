import React, { useState } from 'react'
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Award,
  Sparkles,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  CheckCircle
} from 'lucide-react'

function PricingPage({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const plans = [
    {
      name: 'Free',
      description: 'For beginners exploring yoga',
      price: billingCycle === 'yearly' ? '$0' : '$0',
      period: 'forever',
      features: [
        { text: 'Basic Pose Detection (5 poses)', included: true },
        { text: 'Limited Diet Plans', included: true },
        { text: 'Community Access', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Email Support', included: true },
        { text: 'Advanced AI Coaching', included: false },
        { text: 'Personalized Plans', included: false },
        { text: 'Live Yoga Classes', included: false },
        { text: 'Priority Support', included: false },
        { text: 'Offline Access', included: false },
      ],
      cta: 'Get Started Free',
      color: 'from-gray-600 to-gray-800',
      buttonAction: () => onNavigate('register'),
    },
    {
      name: 'Premium',
      description: 'For serious wellness enthusiasts',
      price: billingCycle === 'yearly' ? '$99' : '$12',
      period: billingCycle === 'yearly' ? 'per year' : 'per month',
      popular: true,
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Advanced Pose Detection (50+ poses)', included: true },
        { text: 'Custom Diet Plans', included: true },
        { text: 'Live Yoga Classes', included: true },
        { text: 'Personal AI Coach', included: true },
        { text: 'Detailed Progress Tracking', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Offline Access', included: true },
        { text: 'Family Sharing (up to 5)', included: true },
        { text: 'Early Access to Features', included: true },
      ],
      cta: 'Start Free Trial',
      color: 'from-premium to-orange-500',
      savings: billingCycle === 'yearly' ? 'Save 30%' : null,
      buttonAction: () => onNavigate('premium'),
    },
    {
      name: 'Pro',
      description: 'For yoga instructors & studios',
      price: billingCycle === 'yearly' ? '$299' : '$29',
      period: billingCycle === 'yearly' ? 'per year' : 'per month',
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Unlimited Students', included: true },
        { text: 'Studio Management', included: true },
        { text: 'White-label Solution', included: true },
        { text: 'API Access', included: true },
        { text: 'Dedicated Account Manager', included: true },
        { text: 'Custom Integrations', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'Team Training', included: true },
        { text: 'SLA Guarantee', included: true },
      ],
      cta: 'Contact Sales',
      color: 'from-purple-600 to-pink-600',
      buttonAction: () => window.open('mailto:sales@yogaai.com', '_blank'),
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: '256-bit SSL encryption',
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: '10,000+ active users',
    },
    {
      icon: Zap,
      title: 'No Setup Fees',
      description: 'Start instantly',
    },
    {
      icon: Award,
      title: '30-Day Guarantee',
      description: 'Money-back promise',
    },
  ]

  const faqs = [
    {
      id: 1,
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No questions asked. All cancellations take effect at the end of your current billing period.'
    },
    {
      id: 2,
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial for Premium and Pro plans. No credit card required. You get full access to all features during the trial.'
    },
    {
      id: 3,
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you are not satisfied with our service, contact us within 30 days for a full refund.'
    },
    {
      id: 4,
      question: 'Can I switch between plans?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at your next billing cycle.'
    },
    {
      id: 5,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual Pro plans.'
    },
    {
      id: 6,
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees. The price you see is the price you pay. All taxes are included in the displayed price.'
    },
  ]

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-sm font-semibold text-accent mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            SIMPLE PRICING
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              Wellness Plan
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Start with a free plan or unlock premium features with our flexible pricing.
            No credit card required for free trial.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-surface rounded-2xl p-1 inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-xl font-semibold transition ${billingCycle === 'monthly' ? 'bg-card text-text' : 'text-text-muted hover:text-text'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-8 py-3 rounded-xl font-semibold transition flex items-center ${billingCycle === 'yearly' ? 'bg-gradient-to-r from-accent to-pink-500 text-text' : 'text-text-muted hover:text-text'}`}
              >
                Yearly
                {billingCycle === 'yearly' && (
                  <span className="ml-2 px-2 py-1 bg-premium text-xs font-bold rounded-full">Save 30%</span>
                )}
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
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
                  <p className="text-text-muted mb-4">{plan.description}</p>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                    <span className="text-text-muted ml-2">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-premium text-sm font-semibold">{plan.savings}</div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      {feature.included ? (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          plan.popular ? 'bg-premium/20' : 'bg-accent/20'
                        }`}>
                          <Check className={`w-3 h-3 ${plan.popular ? 'text-premium' : 'text-accent'}`} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mr-3 mt-0.5">
                          <X className="w-3 h-3 text-text-muted" />
                        </div>
                      )}
                      <span className={feature.included ? '' : 'text-text-muted line-through'}>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={plan.buttonAction}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-premium to-orange-500 hover:from-premium/90 hover:to-orange-600 shadow-lg shadow-premium/20 hover:shadow-premium/40'
                      : 'bg-surface hover:bg-secondary border border-white/10'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose YogaAI</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="bg-card/30 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-text-muted text-sm">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-card/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedFAQ === faq.id ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4 pt-2 border-t border-white/10">
                      <p className="text-text-muted">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Need a Custom Plan?</h3>
              <p className="text-text-muted mb-6 max-w-2xl mx-auto">
                Contact our team for enterprise solutions, educational discounts, or custom integrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open('mailto:sales@yogaai.com', '_blank')}
                  className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
                >
                  Contact Sales
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

          {/* Comparison Table (Optional) */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Plan Comparison</h3>
            <div className="bg-card/30 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left">Feature</th>
                    <th className="p-4 text-center">Free</th>
                    <th className="p-4 text-center">Premium</th>
                    <th className="p-4 text-center">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['AI Pose Detection', '5 poses', '50+ poses', 'Unlimited'],
                    ['Live Classes', '❌', '✅', '✅'],
                    ['Personal Coach', '❌', '✅', '✅'],
                    ['Diet Plans', 'Basic', 'Custom', 'Custom'],
                    ['Priority Support', '❌', '✅', '24/7'],
                    ['Users/Students', '1', '5', 'Unlimited'],
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-white/10 even:bg-white/5">
                      <td className="p-4">{row[0]}</td>
                      <td className="p-4 text-center">{row[1]}</td>
                      <td className="p-4 text-center">{row[2]}</td>
                      <td className="p-4 text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <p className="text-text-muted mb-6">
              Still have questions?{' '}
              <button className="text-accent hover:text-accent-light font-semibold">
                Contact our support team
              </button>
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="text-accent hover:text-accent-light font-semibold flex items-center justify-center mx-auto"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage