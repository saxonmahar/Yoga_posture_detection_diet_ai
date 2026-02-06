import React, { useState } from 'react'
import { 
  Target, 
  Award, 
  Heart, 
  Globe, 
  CheckCircle,
  Users,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Brain,
  Lightbulb,
  Rocket,
  Eye,
  Compass
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AboutPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('mission')

  // helper function to navigate and scroll to top
  const goTo = (path) => {
    navigate(path)
    window.scrollTo(0, 0)
  }

  // Team members with realistic data
  const teamMembers = [
    {
      name: 'Anup Bhatt',
      role: 'Project Team Member',
      bio: 'Computer Science student with interest in wellness technology',
      expertise: 'Backend Development & System Design',
      image: '/images/team/anup.jpg',
      gradient: 'from-emerald-500 to-teal-500',
      achievements: ['Backend Development', 'Database Design', 'API Integration']
    },
    {
      name: 'Ashish Karn',
      role: 'Project Team Member',
      bio: 'Computer Science student specializing in machine learning',
      expertise: 'Machine Learning & Computer Vision',
      image: '/images/team/ashish.jpg',
      gradient: 'from-blue-500 to-cyan-500',
      achievements: ['ML Implementation', 'Pose Detection', 'AI Integration']
    },
    {
      name: 'Bishist Pandey',
      role: 'Project Team Member',
      bio: 'Computer Science student with focus on data science',
      expertise: 'Data Analysis & Nutrition Systems',
      image: '/images/team/bistey.jpg',
      gradient: 'from-purple-500 to-pink-500',
      achievements: ['Data Processing', 'Nutrition Algorithm', 'Analytics']
    },
    {
      name: 'Sanjay Mahar',
      role: 'Project Team Member',
      bio: 'Computer Science student and full-stack developer',
      expertise: 'Full-Stack Development & Architecture',
      image: '/images/team/sanjay.jpg',
      gradient: 'from-orange-500 to-red-500',
      achievements: ['Full-Stack Development', 'System Architecture', 'Project Coordination']
    },
    {
      name: 'Shashank Yadav',
      role: 'Project Team Member',
      bio: 'Computer Science student specializing in frontend development',
      expertise: 'Frontend Development & User Experience',
      image: '/images/team/shashank.jpg',
      gradient: 'from-indigo-500 to-purple-500',
      achievements: ['Frontend Development', 'UI/UX Design', 'User Interface']
    },
  ]

  const milestones = [
    { 
      year: '2024', 
      event: 'Project Inception', 
      description: 'Started development as a computer science academic project',
      icon: Rocket,
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      year: '2024', 
      event: 'AI Integration', 
      description: 'Successfully implemented pose detection using MediaPipe',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      year: '2026', 
      event: 'System Completion', 
      description: 'Completed full-stack development with AI integration and testing',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      year: '2026', 
      event: 'Academic Presentation', 
      description: 'Prepared for final academic evaluation and demonstration',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500'
    },
  ]

  const values = [
    { 
      icon: Target, 
      title: 'Accuracy & Reliability', 
      description: 'Our AI provides consistent pose detection and feedback to help improve your yoga practice over time.',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      icon: Heart, 
      title: 'Wellness Focus', 
      description: 'Every feature is designed to support your health and wellbeing journey with practical, achievable goals.',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      icon: Shield, 
      title: 'Privacy & Security', 
      description: 'Your personal data and practice information are protected with secure authentication and data handling.',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Globe, 
      title: 'Accessible Technology', 
      description: 'Making AI-powered wellness tools available to anyone with a computer and camera.',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Lightbulb, 
      title: 'Practical Innovation', 
      description: 'Applying computer vision and machine learning to create useful wellness applications.',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      icon: Users, 
      title: 'User-Centered Design', 
      description: 'Building features that address real user needs for yoga practice and nutrition guidance.',
      color: 'from-teal-500 to-green-500'
    },
  ]

  const stats = [
    { number: '85%', label: 'Avg Accuracy', icon: Target },
    { number: '6', label: 'Yoga Poses', icon: Users },
    { number: '10+', label: 'Sessions Tracked', icon: Heart },
    { number: '24/7', label: 'AI Available', icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full text-sm font-semibold text-emerald-400 mb-8 border border-emerald-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            REVOLUTIONIZING WELLNESS
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Academic Project:{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Wellness Platform
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
            This academic project demonstrates the practical application of AI technology in wellness. 
            Our goal is to create accessible tools that help people improve their yoga practice through computer vision and personalized nutrition recommendations.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => goTo('/register')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center group"
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
              className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-xl rounded-xl font-semibold text-white transition-all border border-slate-700/50 hover:border-slate-600 flex items-center justify-center group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-700/50 shadow-2xl">
                
                {/* Tab Navigation */}
                <div className="flex mb-8 bg-slate-700/30 rounded-2xl p-1">
                  {[
                    { id: 'mission', label: 'Our Mission', icon: Compass },
                    { id: 'vision', label: 'Our Vision', icon: Eye }
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Tab Content */}
                {activeTab === 'mission' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Bridging Ancient Wisdom & Modern Technology</h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      At YogaAI, we're revolutionizing wellness by combining thousands of years of yoga wisdom 
                      with cutting-edge artificial intelligence. Our mission is to democratize access to 
                      personalized wellness guidance, making expert-level instruction available to everyone, everywhere.
                    </p>
                    <div className="space-y-4">
                      {[
                        'Make expert wellness guidance accessible to everyone',
                        'Use AI to prevent injuries and perfect form',
                        'Provide personalized nutrition based on individual needs',
                        'Build a supportive global wellness community',
                        'Continuously innovate for better health outcomes'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center group">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-slate-300 group-hover:text-white transition-colors">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'vision' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-4">A World Where Wellness is Universal</h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      We envision a future where personalized wellness guidance is as accessible as checking 
                      the weather. Through AI-powered insights and community support, we're creating a world 
                      where everyone can achieve their optimal health and wellbeing.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Globe, text: 'Global Accessibility' },
                        { icon: Brain, text: 'AI-Powered Insights' },
                        { icon: Users, text: 'Community Support' },
                        { icon: TrendingUp, text: 'Continuous Growth' }
                      ].map((item, idx) => {
                        const Icon = item.icon
                        return (
                          <div key={idx} className="flex items-center p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors group">
                            <Icon className="w-5 h-5 text-cyan-400 mr-3 group-hover:scale-110 transition-transform" />
                            <span className="text-slate-300 text-sm font-medium">{item.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Technology Meets Wellness</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Our AI analyzes millions of data points to provide real-time feedback that was 
                    previously only available with personal trainers and nutritionists.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">98%</div>
                      <div className="text-xs text-slate-400">Pose Accuracy</div>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">24/7</div>
                      <div className="text-xs text-slate-400">AI Guidance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm font-semibold text-purple-400 mb-6 border border-purple-500/30 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              MEET OUR TEAM
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The Minds Behind{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Innovation
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our diverse team combines expertise in yoga, AI, nutrition, and technology to create 
              the most advanced wellness platform available today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-5 rounded-2xl blur-xl group-hover:opacity-10 transition-all duration-300`}></div>
                <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl group-hover:border-slate-600/70 transition-all duration-300 overflow-hidden">
                  
                  {/* Header with gradient accent */}
                  <div className={`h-1.5 bg-gradient-to-r ${member.gradient}`}></div>
                  
                  <div className="p-6">
                    {/* Profile Image - Centered & Circular */}
                    <div className="flex flex-col items-center mb-5">
                      <div className="relative">
                        {/* Glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity scale-110`}></div>
                        
                        {/* Image container with gradient border */}
                        <div className={`relative p-1 bg-gradient-to-br ${member.gradient} rounded-full`}>
                          <img
                            src={member.image}
                            alt={member.name}
                            className="relative w-28 h-28 rounded-full object-cover bg-slate-800 shadow-2xl"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          {/* Fallback */}
                          <div className={`hidden w-28 h-28 rounded-full bg-gradient-to-br ${member.gradient} items-center justify-center shadow-2xl`}>
                            <span className="text-3xl font-bold text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Badge */}
                        <div className={`absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center border-3 border-slate-800 shadow-lg`}>
                          <Star className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Name & Role - Centered */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3`}>
                        {member.role}
                      </p>
                      <div className="px-3 py-1.5 bg-slate-700/40 rounded-full text-xs text-slate-300 inline-block border border-slate-600/30">
                        {member.expertise}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-slate-400 leading-relaxed mb-4 text-center">
                      {member.bio}
                    </p>

                    {/* Achievements - Compact */}
                    <div className="space-y-2">
                      {member.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-400 group/item">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${member.gradient} rounded-full mr-2 flex-shrink-0 group-hover/item:scale-125 transition-transform`}></div>
                          <span className="font-medium group-hover/item:text-slate-300 transition-colors">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-sm font-semibold text-orange-400 mb-6 border border-orange-500/30 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              OUR JOURNEY
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Milestones of{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Innovation
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gradient-to-b from-emerald-500 via-cyan-500 to-purple-500"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon
                const isEven = index % 2 === 0
                
                return (
                  <div key={index} className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                    
                    {/* Content */}
                    <div className={`w-5/12 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl"></div>
                        <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                          <div className={`text-3xl font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent mb-2`}>
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">{milestone.event}</h3>
                          <p className="text-slate-400">{milestone.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="w-2/12 flex justify-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-2xl flex items-center justify-center shadow-lg border-4 border-slate-800`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="w-5/12"></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-sm font-semibold text-cyan-400 mb-6 border border-cyan-500/30 backdrop-blur-sm">
              <Heart className="w-4 h-4 mr-2" />
              OUR VALUES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Drives{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              These core values guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 h-full">
                    
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
              
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                  Wellness Journey?
                </span>
              </h3>
              
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already discovered the power of AI-guided wellness. 
                Your personalized journey to better health starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => goTo('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => goTo('/contact')}
                  className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 backdrop-blur-xl rounded-xl font-semibold text-white transition-all border border-slate-600/50 hover:border-slate-600 flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Contact Our Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
