import React from 'react';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PricingPage({ user }) {
  const navigate = useNavigate();

  // helper function to navigate and scroll to top
  const goTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for beginners starting their yoga journey',
      color: 'from-gray-500 to-gray-700',
      features: [
        'Basic pose detection',
        '5 yoga sessions per week',
        'Community access',
        'Basic progress tracking'
      ],
      buttonText: user ? 'Current Plan' : 'Get Started Free',
      buttonDisabled: user?.isPremium === false
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'per month',
      description: 'Best for serious practitioners',
      color: 'from-yellow-500 to-orange-500',
      popular: true,
      features: [
        'Advanced AI pose detection',
        'Unlimited yoga sessions',
        'Personalized diet plans',
        'Live yoga classes',
        'Priority support',
        'Advanced analytics'
      ],
      buttonText: user?.isPremium ? 'Current Plan' : 'Upgrade to Premium',
      buttonDisabled: user?.isPremium === true
    },
    {
      name: 'Annual',
      price: '$190',
      period: 'per year',
      description: 'Best value for committed yogis',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Everything in Premium',
        'Save 20%',
        'Free annual health consultation',
        'Exclusive workshops',
        'Early access to features'
      ],
      buttonText: user?.isPremium ? 'Current Plan' : 'Choose Annual',
      buttonDisabled: user?.isPremium === true
    }
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay/Google Pay.'
    },
    {
      question: 'Can I switch between plans?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      
      <section className="relative overflow-hidden -mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-6">
              <Star className="w-4 h-4 mr-2" />
              SIMPLE PRICING
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
                Wellness Plan
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Start free, upgrade anytime. All plans include our core AI features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div key={index} className="relative">
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg z-10">
                    MOST POPULAR
                  </div>
                )}

                <div className={`bg-card/50 backdrop-blur-sm rounded-2xl border ${plan.popular ? 'border-yellow-500/50' : 'border-white/10'} p-8 pt-12 h-full`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-text-muted ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-text-muted">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <Check className="w-5 h-5 text-green-400 mr-3" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      if (plan.name === 'Free' && !user) {
                        goTo('/register');
                      } else if (plan.name === 'Premium' && !user?.isPremium) {
                        goTo('/premium');
                      }
                    }}
                    disabled={plan.buttonDisabled}
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                        : plan.name === 'Free'
                        ? 'bg-surface hover:bg-secondary border border-white/10'
                        : 'bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600'
                    } ${plan.buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
            <div className="bg-card/50 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 font-semibold">Features</th>
                    <th className="text-center p-6 font-semibold">Free</th>
                    <th className="text-center p-6 font-semibold">Premium</th>
                    <th className="text-center p-6 font-semibold">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['AI Pose Detection', '✓ Basic', '✓ Advanced', '✓ Advanced'],
                    ['Personalized Diet Plans', '✗', '✓', '✓'],
                    ['Live Yoga Classes', 'Limited', 'Unlimited', 'Unlimited'],
                    ['Progress Analytics', 'Basic', 'Advanced', 'Advanced'],
                    ['Community Access', '✓', '✓', '✓'],
                    ['Priority Support', '✗', '✓', '✓'],
                    ['Workshops', '✗', '✗', '✓']
                  ].map(([feature, free, premium, annual], idx) => (
                    <tr key={idx} className="border-b border-white/10">
                      <td className="p-6 font-medium">{feature}</td>
                      <td className="text-center p-6">{free}</td>
                      <td className="text-center p-6">{premium}</td>
                      <td className="text-center p-6">{annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card/30 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">{faq.question}</h3>
                  <p className="text-text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-text-muted mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the right plan for your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => goTo('/contact')}
                className="px-8 py-3 bg-card hover:bg-secondary rounded-xl font-semibold transition border border-white/10"
              >
                Contact Sales
              </button>
              <button
                onClick={() => goTo('/')}
                className="px-8 py-3 bg-card hover:bg-secondary rounded-xl font-semibold transition border border-white/10"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
