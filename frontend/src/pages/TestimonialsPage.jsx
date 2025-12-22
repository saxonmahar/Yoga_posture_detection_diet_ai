import React from 'react';
import { Star, Quote, TrendingUp, Target, Award, Users } from 'lucide-react';

function TestimonialsPage({ onNavigate }) {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Yoga Instructor',
      image: '👩‍🏫',
      content: 'YogaAI transformed how I teach. The real-time feedback helps my students improve faster with perfect form.',
      rating: 5,
      stats: '+40% improvement'
    },
    {
      name: 'Michael Chen',
      role: 'Fitness Coach',
      image: '💪',
      content: 'The personalized diet plans combined with yoga tracking gave me the best fitness results I\'ve ever achieved.',
      rating: 5,
      stats: 'Lost 15lbs in 2 months'
    },
    {
      name: 'Emma Wilson',
      role: 'Wellness Coach',
      image: '✨',
      content: 'This app helped me stay consistent with my practice. The dashboard insights and AI guidance are amazing!',
      rating: 5,
      stats: '35-day streak'
    },
    {
      name: 'David Kim',
      role: 'Software Engineer',
      image: '👨‍💻',
      content: 'As someone who sits all day, YogaAI helped fix my posture and reduce back pain significantly.',
      rating: 5,
      stats: 'Posture improved by 70%'
    },
    {
      name: 'Priya Sharma',
      role: 'Nutritionist',
      image: '🥗',
      content: 'The AI diet recommendations are spot-on! My clients love how personalized the plans are.',
      rating: 5,
      stats: '98% client satisfaction'
    },
    {
      name: 'Miguel Rodriguez',
      role: 'Physical Therapist',
      image: '🏥',
      content: 'Perfect for rehabilitation. The form correction prevents injuries and ensures proper technique.',
      rating: 5,
      stats: 'Injury rate reduced by 60%'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: Star, value: '4.9/5', label: 'Average Rating' },
    { icon: Target, value: '98%', label: 'Pose Accuracy' },
    { icon: TrendingUp, value: '+45%', label: 'Average Improvement' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-6">
            <Quote className="w-4 h-4 mr-2" />
            REAL STORIES
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by{' '}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              10,000+ Yogis
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Join our community of wellness enthusiasts who transformed their practice with AI guidance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-text-muted">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition card-hover">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div>
                  <p className="font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-text-muted text-sm">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-text-muted mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="px-3 py-1 bg-accent/20 text-accent text-sm font-semibold rounded-full">
                  {testimonial.stats}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <div className="flex items-start">
                <div className="text-4xl mr-6">🧘‍♀️</div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Sarah's 90-Day Transformation</h3>
                  <p className="text-text-muted mb-4">
                    "I started YogaAI as a complete beginner. With daily AI-guided sessions, I went from barely touching my toes to doing full splits in 90 days. The progress tracking kept me motivated!"
                  </p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">90</div>
                      <div className="text-sm text-text-muted">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">+120%</div>
                      <div className="text-sm text-text-muted">Flexibility</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">25lbs</div>
                      <div className="text-sm text-text-muted">Weight Loss</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
              <div className="flex items-start">
                <div className="text-4xl mr-6">💪</div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Michael's Strength Journey</h3>
                  <p className="text-text-muted mb-4">
                    "As a former athlete, I needed a smart way to rebuild strength after injury. YogaAI's personalized plans and form correction helped me regain mobility safely and effectively."
                  </p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">60</div>
                      <div className="text-sm text-text-muted">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">+80%</div>
                      <div className="text-sm text-text-muted">Strength</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">0</div>
                      <div className="text-sm text-text-muted">Injuries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h3>
          <p className="text-text-muted mb-6 max-w-2xl mx-auto">
            Join thousands who transformed their wellness journey with AI guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
            >
              Start Your Journey
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

export default TestimonialsPage;