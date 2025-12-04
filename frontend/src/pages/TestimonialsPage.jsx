import React from 'react'
import { 
  Star, 
  Quote, 
  Award, 
  TrendingUp,
  Heart,
  Users
} from 'lucide-react'

function TestimonialsPage({ onNavigate }) {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Yoga Instructor',
      content: 'As a yoga teacher for 10 years, I was skeptical about AI guidance. But YogaAI proved me wrong. The real-time feedback helps my students improve their form dramatically.',
      avatar: '👩‍🏫',
      rating: 5,
      stats: 'Improved student retention by 40%',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'Working long hours at a desk destroyed my posture. YogaAI not only fixed my back pain but also provided diet plans that boosted my energy levels significantly.',
      avatar: '💻',
      rating: 5,
      stats: 'Lost 15lbs in 3 months',
    },
    {
      name: 'Emma Wilson',
      role: 'Busy Mom',
      content: 'As a mother of two, I never had time for yoga classes. YogaAI lets me practice whenever I can. The short guided sessions fit perfectly into my schedule.',
      avatar: '👨‍👩‍👧‍👦',
      rating: 5,
      stats: 'Consistent 30-day streak',
    },
    {
      name: 'David Park',
      role: 'Fitness Coach',
      content: 'I recommend YogaAI to all my clients. The combination of pose detection and nutrition planning is revolutionary. Best investment in wellness tech.',
      avatar: '💪',
      rating: 5,
      stats: 'Recommended to 50+ clients',
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Beginner Yogi',
      content: 'I was intimidated by yoga studios. YogaAI made learning accessible and judgment-free. The AI corrections are gentle but effective.',
      avatar: '🌱',
      rating: 5,
      stats: 'Mastered 20+ poses',
    },
    {
      name: 'James Wilson',
      role: 'Corporate Executive',
      content: 'The stress relief programs combined with diet recommendations transformed my work-life balance. My productivity increased while my stress decreased.',
      avatar: '👔',
      rating: 5,
      stats: 'Stress levels reduced by 60%',
    },
  ]

  const stats = [
    { label: 'User Satisfaction', value: '98%', icon: Heart },
    { label: 'Pose Accuracy', value: '99.2%', icon: Award },
    { label: 'Active Community', value: '10K+', icon: Users },
    { label: 'Avg Rating', value: '4.9/5', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-sm font-semibold text-accent mb-6">
            <Quote className="w-4 h-4 mr-2" />
            USER STORIES
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              10,000+ Yogis
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Real stories from real people who transformed their wellness journey with AI guidance.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-card/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
                  <div className="text-text-muted text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition"
              >
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
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
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-accent font-semibold px-3 py-1 bg-accent/20 rounded-full">
                    {testimonial.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Testimonials Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Video Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <div key={item} className="bg-card/50 rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-pink-600/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Quote className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-text-muted">Video testimonial</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold mb-2">Real Transformation Story</h3>
                    <p className="text-text-muted text-sm">Watch how YogaAI changed someone's wellness journey</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Success Story?</h3>
            <p className="text-text-muted mb-6 max-w-2xl mx-auto">
              Join thousands of users who transformed their wellness journey with our AI-powered platform.
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
      </section>
    </div>
  )
}

export default TestimonialsPage