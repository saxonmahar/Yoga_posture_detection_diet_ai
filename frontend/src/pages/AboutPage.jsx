import React from 'react'
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Globe, 
  CheckCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'  // <-- Import useNavigate

function AboutPage() {
  const navigate = useNavigate()  // <-- Initialize navigate

  const teamMembers = [
    { name: 'Sarah Chen', role: 'Co-Founder & Yoga Expert', bio: '15+ years yoga experience, certified instructor' },
    { name: 'Dr. Alex Johnson', role: 'Co-Founder & AI Researcher', bio: 'PhD in Computer Vision, Stanford alumni' },
    { name: 'Maya Patel', role: 'Nutrition Specialist', bio: 'Registered dietitian, wellness coach' },
    { name: 'David Kim', role: 'Lead Developer', bio: 'Full-stack developer, fitness enthusiast' },
  ]

  const milestones = [
    { year: '2022', event: 'Founded YogaAI', description: 'Started with a vision to combine AI and wellness' },
    { year: '2023', event: 'First Prototype', description: 'Developed initial pose detection algorithm' },
    { year: '2024', event: '10,000 Users', description: 'Reached milestone of 10k active users' },
    { year: '2025', event: 'AI Diet Features', description: 'Launched personalized nutrition plans' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-sm font-semibold text-accent mb-6">
            <Heart className="w-4 h-4 mr-2" />
            OUR STORY
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Revolutionizing Wellness with{" "}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              AI Technology
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            We believe everyone deserves access to personalized wellness guidance.
            Our mission is to make expert-level yoga and nutrition advice accessible to all.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-text-muted mb-6">
                At YogaAI, we're bridging the gap between traditional wellness practices and modern technology. 
                We combine ancient yoga wisdom with cutting-edge artificial intelligence to create personalized 
                wellness journeys for everyone.
              </p>
              <div className="space-y-4">
                {[
                  'Make expert guidance accessible to everyone',
                  'Use AI to prevent injuries and improve form',
                  'Provide personalized nutrition based on activity',
                  'Build a supportive wellness community'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-accent mr-3" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card/50 rounded-2xl p-8 border border-white/10">
              <div className="text-6xl mb-6">🧘‍♀️</div>
              <h3 className="text-2xl font-bold mb-4">Technology Meets Wellness</h3>
              <p className="text-text-muted">
                Our AI analyzes millions of data points to provide real-time feedback that was 
                previously only available with personal trainers.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-card/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-accent mb-2">{member.role}</p>
                  <p className="text-text-muted text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-pink-500/50 to-accent/50 transform -translate-x-1/2"></div>
              
              <div className="space-y-12 lg:space-y-0">
                {milestones.map((milestone, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <div key={index} className={`lg:flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                      <div className={`lg:w-1/2 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                        <div className="bg-card/50 rounded-xl p-6">
                          <div className="text-2xl font-bold text-accent mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-bold mb-2">{milestone.event}</h3>
                          <p className="text-text-muted">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-accent rounded-full border-4 border-primary"></div>
                      </div>
                      <div className="lg:w-1/2"></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: 'Accessibility', description: 'Making wellness guidance affordable and available to all' },
                { icon: Award, title: 'Excellence', description: 'Constantly improving our AI algorithms and user experience' },
                { icon: Globe, title: 'Community', description: 'Building supportive networks for wellness journeys' },
              ].map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-card/30 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-text-muted">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Wellness Revolution</h3>
            <p className="text-text-muted mb-6 max-w-2xl mx-auto">
              Be part of the community that's transforming how people approach yoga and nutrition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')} // <-- Navigate to login instead of register
                className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
              >
                Start Your Journey
              </button>
              <button
                onClick={() => navigate('/')} // Navigate to home
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

export default AboutPage
