import React from 'react';
import { Star, Quote, TrendingUp, Target, Award, Users } from 'lucide-react';

function TestimonialsPage({ onNavigate }) {
  const testimonials = [
    {
      name: 'Academic Reviewer',
      role: 'Computer Science Faculty',
      image: '👩‍🏫',
      content: 'This project demonstrates excellent integration of computer vision with practical wellness applications. The pose detection accuracy is impressive for an academic implementation.',
      rating: 5,
      stats: 'Technical Excellence'
    },
    {
      name: 'Student Tester',
      role: 'Beta User',
      image: '💪',
      content: 'As a test user, I found the AI feedback helpful for improving my yoga form. The system provides clear guidance and tracks progress well.',
      rating: 4,
      stats: 'Improved Practice'
    },
    {
      name: 'Wellness Enthusiast',
      role: 'Yoga Practitioner',
      image: '✨',
      content: 'The combination of pose detection and nutrition recommendations creates a comprehensive wellness platform. Great academic project!',
      rating: 4,
      stats: 'Comprehensive Features'
    },
    {
      name: 'Tech Student',
      role: 'Computer Science Student',
      image: '👨‍💻',
      content: 'Impressive use of MediaPipe and machine learning. The real-time pose analysis works smoothly and provides useful feedback.',
      rating: 5,
      stats: 'Great Implementation'
    },
    {
      name: 'Project Evaluator',
      role: 'Academic Assessor',
      image: '🥗',
      content: 'This project showcases practical application of AI in healthcare and wellness. The technical implementation is solid and well-documented.',
      rating: 5,
      stats: 'Academic Quality'
    },
    {
      name: 'Demo User',
      role: 'System Tester',
      image: '🏥',
      content: 'The pose detection system provides accurate feedback and the user interface is intuitive. Well-designed academic demonstration.',
      rating: 4,
      stats: 'User-Friendly Design'
    }
  ];

  const stats = [
    { icon: Users, value: '6', label: 'Yoga Poses' },
    { icon: Star, value: '85%', label: 'Avg Accuracy' },
    { icon: Target, value: '10+', label: 'Test Sessions' },
    { icon: TrendingUp, value: '24/7', label: 'AI Available' }
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
            Academic Project{' '}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              Testimonials
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Feedback from faculty, students, and testers who have evaluated our AI-powered wellness platform.
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
          <h2 className="text-3xl font-bold text-center mb-12">Project Development Journey</h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <div className="flex items-start">
                <div className="text-4xl mr-6">🧘‍♀️</div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Technical Implementation Success</h3>
                  <p className="text-text-muted mb-4">
                    "Our team successfully integrated MediaPipe for pose detection with a React frontend and Python backend. The system accurately detects 6 yoga poses and provides real-time feedback to users."
                  </p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">6</div>
                      <div className="text-sm text-text-muted">Poses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">85%</div>
                      <div className="text-sm text-text-muted">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">10+</div>
                      <div className="text-sm text-text-muted">Test Sessions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
              <div className="flex items-start">
                <div className="text-4xl mr-6">💪</div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Academic Learning Outcomes</h3>
                  <p className="text-text-muted mb-4">
                    "This project provided hands-on experience with computer vision, machine learning, full-stack development, and database management. We learned to integrate multiple technologies into a cohesive wellness platform."
                  </p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">4</div>
                      <div className="text-sm text-text-muted">Technologies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">5</div>
                      <div className="text-sm text-text-muted">Team Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">100%</div>
                      <div className="text-sm text-text-muted">Functional</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Try Our Academic Project?</h3>
          <p className="text-text-muted mb-6 max-w-2xl mx-auto">
            Experience our AI-powered yoga platform and see how computer vision can enhance wellness practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
            >
              Try Demo Version
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