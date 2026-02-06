import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react'

function Footer() {
  const navigate = useNavigate()

  const quickLinks = [
    { id: '', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About Us' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ]

  const productLinks = [
    { id: 'pose-detection', label: 'AI Pose Detection' },
    { id: 'diet-plan', label: 'Diet Plans' },
    { id: 'progress', label: 'Progress Tracking' },
    { id: 'dashboard', label: 'Dashboard' },
  ]

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/saxonmahar/Yoga_posture_detection_diet_ai' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
  ]

  const handleNavigate = (page) => navigate(`/${page}`)

  const handleSocialClick = (url) => {
    window.open(url, '_blank')
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                🧘
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">YogaAI</h2>
                <p className="text-sm text-slate-400">Intelligent Wellness Platform</p>
              </div>
            </div>

            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              Transform your yoga practice with AI-powered pose detection, personalized diet plans, 
              and comprehensive progress tracking. Your journey to wellness starts here.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-slate-400">
                <Mail className="w-4 h-4 mr-3 text-emerald-400" />
                <span className="text-sm">sanjaymahar2058@gmail.com</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Phone className="w-4 h-4 mr-3 text-emerald-400" />
                <span className="text-sm">+977 9865918308</span>
              </div>
              <div className="flex items-center text-slate-400">
                <MapPin className="w-4 h-4 mr-3 text-emerald-400" />
                <span className="text-sm">Cosmos College, Lalitpur, Nepal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, label, url }) => (
                <button
                  key={label}
                  onClick={() => handleSocialClick(url)}
                  className="w-10 h-10 bg-slate-800/50 hover:bg-emerald-500/20 border border-slate-700/50 hover:border-emerald-500/30 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  title={label}
                >
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavigate(link.id)}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-300 hover:translate-x-1 transform"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Features</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavigate(link.id)}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-300 hover:translate-x-1 transform"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="flex items-center text-slate-400 text-sm">
              <span>© {new Date().getFullYear()} YogaAI.</span>
              <Heart className="w-4 h-4 mx-2 text-red-500 animate-pulse" fill="currentColor" />
              <span>by Team YogaAI</span>
            </div>

            {/* Project Info */}
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <span>Final Year Project</span>
              <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
              <span>Cosmos College</span>
              <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
              <span>2024-2025</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-slate-700/30">
            <div className="text-center">
              <p className="text-slate-500 text-xs leading-relaxed">
                This project demonstrates AI-powered yoga pose detection and personalized wellness recommendations. 
                Built with React, Node.js, Python, and advanced computer vision technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
