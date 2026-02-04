import React from 'react';
import { 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Heart, 
  Users, 
  Crown, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Award,
  Globe,
  Clock,
  TrendingUp,
  Target,
  Brain,
  Camera,
  BarChart3,
  Utensils,
  Lock,
  Unlock,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
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
      name: 'Demo Version',
      price: 'Free',
      originalPrice: null,
      period: 'academic project',
      description: 'Full access to all features for demonstration',
      color: 'from-emerald-500 to-cyan-500',
      bgGradient: 'from-emerald-500/10 to-cyan-500/10',
      borderColor: 'border-emerald-500/30',
      popular: true,
      features: [
        'AI pose detection (6 poses)',
        'Real-time feedback and scoring',
        'Personalized diet recommendations',
        'Progress tracking and analytics',
        'Session scheduling system',
        'Community features',
        'Complete user dashboard',
        'All ML services included'
      ],
      bonuses: [
        'Full source code available',
        'Academic documentation',
        'Technical implementation details'
      ],
      buttonText: user ? 'Currently Using' : 'Try Demo',
      buttonDisabled: false,
      icon: Crown
    },
    {
      name: 'Student Plan',
      price: 'Rs 500',
      originalPrice: 'Rs 1,000',
      period: 'month',
      description: 'Affordable plan for students in Nepal',
      color: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      borderColor: 'border-blue-500/30',
      features: [
        'All demo features included',
        'Priority customer support',
        'Advanced progress analytics',
        'Custom workout plans',
        'Nutrition meal planning',
        'Community challenges',
        'Mobile app access',
        'Offline mode support'
      ],
      bonuses: [
        '50% student discount',
        'Free first month trial',
        'Educational institution support'
      ],
      buttonText: 'Start Student Plan',
      buttonDisabled: false,
      icon: Brain
    },
    {
      name: 'Professional Plan',
      price: 'Rs 2,000',
      originalPrice: 'Rs 3,000',
      period: 'month',
      description: 'For yoga instructors and wellness professionals',
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/30',
      features: [
        'Everything in Student Plan',
        'Multi-user management',
        'Custom branding options',
        'Advanced analytics dashboard',
        'API access for integration',
        'White-label solution',
        'Priority technical support',
        'Custom pose training'
      ],
      bonuses: [
        'Free setup and training',
        'Dedicated account manager',
        'Custom integration support'
      ],
      buttonText: 'Contact for Demo',
      buttonDisabled: false,
      icon: Users
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Computer Science Student',
      image: '👩‍🏫',
      rating: 5,
      text: 'This academic project showcases excellent use of AI technology. The pose detection system works remarkably well for a student implementation.',
      plan: 'Demo Version'
    },
    {
      name: 'Rajesh Thapa',
      role: 'Yoga Instructor, Kathmandu',
      image: '🧘‍♂️',
      rating: 4,
      text: 'Impressive technical implementation! The real-time feedback could be very useful for remote yoga instruction in Nepal.',
      plan: 'Student Plan'
    },
    {
      name: 'Sita Gurung',
      role: 'Wellness Enthusiast',
      image: '🌟',
      rating: 5,
      text: 'Great to see Nepalese students creating innovative wellness technology. The pricing in Rupees makes it accessible for local users.',
      plan: 'Demo → Student'
    }
  ];

  const guarantees = [
    {
      icon: Shield,
      title: 'Academic Quality',
      description: 'Professional-grade implementation with comprehensive documentation and source code access.'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected. Privacy-first design with local data storage options.'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Start immediately with demo version. No complex setup or installation required.'
    },
    {
      icon: Heart,
      title: 'Student Friendly',
      description: 'Affordable pricing in Nepalese Rupees with special discounts for students and educational institutions.'
    }
  ];

  const stats = [
    { number: '6', label: 'Yoga Poses', icon: Users },
    { number: '85%', label: 'Avg Accuracy', icon: Target },
    { number: '10+', label: 'Test Sessions', icon: Star },
    { number: 'Rs 500', label: 'Student Price', icon: Clock }
  ];

  const faqs = [
    {
      question: 'How does the AI pose detection work?',
      answer: 'Our system uses MediaPipe computer vision technology to analyze your body position in real-time through your device camera, providing feedback on yoga pose accuracy.'
    },
    {
      question: 'Why are prices in Nepalese Rupees?',
      answer: 'This project is developed by students at Cosmos College in Nepal. We use local currency to make our hypothetical pricing accessible to Nepalese users.'
    },
    {
      question: 'What devices are supported?',
      answer: 'The system works on modern web browsers with camera access. Tested on smartphones, tablets, and computers running Chrome, Firefox, and Safari.'
    },
    {
      question: 'Is this a real commercial product?',
      answer: 'This is an academic project demonstrating AI applications in wellness. The pricing shown is hypothetical to showcase potential commercial viability.'
    },
    {
      question: 'How accurate is the pose detection?',
      answer: 'Our testing shows approximately 85% accuracy across 6 supported yoga poses. Accuracy varies based on lighting conditions and camera quality.'
    },
    {
      question: 'Can I access the source code?',
      answer: 'Yes! As an academic project, we provide full source code access for educational purposes. Perfect for students learning AI and web development.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full text-sm font-semibold text-emerald-400 mb-8 border border-emerald-500/30 backdrop-blur-sm">
              <Crown className="w-4 h-4 mr-2" />
              TRANSPARENT PRICING
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Wellness Plan
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Start free, upgrade anytime. Join thousands of users transforming their yoga practice 
              with AI-powered guidance and personalized wellness insights.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl"></div>
                    <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const Icon = plan.icon
                return (
                  <div key={index} className="relative group">
                    {plan.popular && (
                      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg z-10 border-2 border-white/20">
                        <Star className="w-4 h-4 inline mr-1" fill="currentColor" />
                        MOST POPULAR
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className={`relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border ${plan.popular ? plan.borderColor : 'border-slate-700/50'} p-8 pt-12 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 h-full flex flex-col`}>
                      
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-center justify-center mb-2">
                          {plan.originalPrice && (
                            <span className="text-2xl text-slate-500 line-through mr-2">{plan.originalPrice}</span>
                          )}
                          <span className="text-5xl font-bold text-white">{plan.price}</span>
                          {plan.period !== 'pricing' && (
                            <span className="text-slate-400 ml-2">/{plan.period}</span>
                          )}
                        </div>
                        <p className="text-slate-400">{plan.description}</p>
                      </div>

                      {/* Features */}
                      <div className="flex-1 mb-8">
                        <h4 className="font-semibold text-white mb-4">What's included:</h4>
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                              <span className="text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.bonuses && (
                          <>
                            <h4 className="font-semibold text-white mb-4">Bonus features:</h4>
                            <ul className="space-y-3 mb-6">
                              {plan.bonuses.map((bonus, idx) => (
                                <li key={idx} className="flex items-center">
                                  <Sparkles className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                                  <span className="text-slate-300">{bonus}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {plan.limitations && (
                          <>
                            <h4 className="font-semibold text-slate-400 mb-4">Limitations:</h4>
                            <ul className="space-y-3">
                              {plan.limitations.map((limitation, idx) => (
                                <li key={idx} className="flex items-center">
                                  <Lock className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                                  <span className="text-slate-500">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => {
                          if (plan.name === 'Starter' && !user) {
                            goTo('/register');
                          } else if (plan.name === 'Premium' && !user?.isPremium) {
                            goTo('/premium');
                          } else if (plan.name === 'Enterprise') {
                            goTo('/contact');
                          }
                        }}
                        disabled={plan.buttonDisabled}
                        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center group ${
                          plan.popular
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20'
                            : plan.name === 'Starter'
                            ? 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600/50'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20'
                        } ${plan.buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {plan.buttonText}
                        {!plan.buttonDisabled && (
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Risk-Free{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Guarantee
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                We're confident you'll love YogaAI. That's why we offer these guarantees.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {guarantees.map((guarantee, index) => {
                const Icon = guarantee.icon
                return (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 text-center h-full">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{guarantee.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{guarantee.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full text-sm font-semibold text-yellow-400 mb-6 border border-yellow-500/30 backdrop-blur-sm">
                <Award className="w-4 h-4 mr-2" />
                CUSTOMER STORIES
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Loved by{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Thousands
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                See what our users are saying about their transformation journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
                    
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">{testimonial.image}</div>
                      <div>
                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                        <p className="text-slate-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-4">"{testimonial.text}"</p>

                    <div className="inline-flex items-center px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                      <span className="text-emerald-400 text-sm font-semibold">{testimonial.plan}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="text-xl text-slate-400">
                Everything you need to know about YogaAI pricing and features.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300">
                    <h3 className="font-bold text-white mb-3 text-lg">{faq.question}</h3>
                    <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Sales CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
                
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Interested in Our{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                    Academic Project?
                  </span>
                </h3>
                
                <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                  Connect with our development team at Cosmos College to learn more about our AI-powered wellness platform 
                  and explore potential collaboration opportunities.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => goTo('/contact')}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center group"
                  >
                    <Mail className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Contact Project Team
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => window.open('tel:+9779865918308', '_self')}
                    className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 backdrop-blur-xl rounded-xl font-semibold text-white transition-all border border-slate-600/50 hover:border-slate-600 flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us Now
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <p className="text-slate-500 text-sm">
                    Available Monday-Friday, 9AM-6PM NPT • Academic project inquiries welcome
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PricingPage;
