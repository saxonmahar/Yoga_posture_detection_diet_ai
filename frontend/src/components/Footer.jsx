import React from 'react'
import { Heart, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

function Footer({ onNavigate }) {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Youtube, label: 'YouTube' },
  ]

  const productLinks = [
    { id: 'features', label: 'AI Yoga Coach' },
    { id: 'features', label: 'Diet Plans' },
    { id: 'features', label: 'Live Classes' },
    { id: 'features', label: 'Progress Tracking' },
    { id: 'pose-detection', label: 'Pose Detection' },
  ]

  const companyLinks = [
    { id: 'about', label: 'About Us' },
    { id: 'careers', label: 'Careers' },
    { id: 'blog', label: 'Blog' },
    { id: 'press', label: 'Press' },
    { id: 'contact', label: 'Contact' },
  ]

  const resourcesLinks = [
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'premium', label: 'Premium Features' },
  ]

  const legalLinks = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'cookies', label: 'Cookie Policy' },
    { id: 'security', label: 'Security' },
    { id: 'gdpr', label: 'GDPR' },
  ]

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Fallback to window location if onNavigate is not provided
      window.location.href = `/${page}`;
    }
  }

  const handleSocialClick = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/yogaai',
      twitter: 'https://twitter.com/yogaai',
      instagram: 'https://instagram.com/yogaai',
      youtube: 'https://youtube.com/yogaai',
    }
    window.open(urls[platform.toLowerCase()], '_blank');
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      e.target.reset();
    }
  }

  return (
    <footer className="bg-surface border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">🧘</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
                  YogaAI
                </h2>
                <p className="text-sm text-text-muted">Intelligent Wellness</p>
              </div>
            </div>
            <p className="text-text-muted mb-6 max-w-md">
              Empowering your wellness journey with AI-powered yoga guidance and personalized nutrition.
              Join thousands who transformed their health with intelligent technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <button
                    key={index}
                    className="w-10 h-10 bg-card hover:bg-secondary rounded-full flex items-center justify-center transition hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                    onClick={() => handleSocialClick(social.label)}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-text">Product</h4>
            <ul className="space-y-4">
              {productLinks.map((link) => (
                <li key={link.id + link.label}>
                  <button 
                    onClick={() => handleNavigate(link.id)}
                    className="text-text-muted hover:text-accent transition hover:translate-x-1 block w-full text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-text">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => handleNavigate(link.id)}
                    className="text-text-muted hover:text-accent transition hover:translate-x-1 block w-full text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-text">Resources</h4>
            <ul className="space-y-4">
              {resourcesLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => handleNavigate(link.id)}
                    className="text-text-muted hover:text-accent transition hover:translate-x-1 block w-full text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-text">Legal</h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => handleNavigate(link.id)}
                    className="text-text-muted hover:text-accent transition hover:translate-x-1 block w-full text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-accent" />
                <span className="text-text-muted">Subscribe to our newsletter:</span>
              </div>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="px-4 py-2 bg-card border border-white/10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent w-full sm:w-auto"
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-r-lg font-semibold transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
            <div className="text-center md:text-right">
              <p className="text-text-muted text-sm">
                © 2024 YogaAI. All rights reserved.
              </p>
              <p className="text-text-muted text-sm mt-1 flex items-center justify-center md:justify-end">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for yogis worldwide.
              </p>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center md:text-left">
            <div className="grid md:grid-cols-3 gap-6 text-sm text-text-muted">
              <div>
                <p className="font-semibold text-text mb-2">Contact</p>
                <p>support@yogaai.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="font-semibold text-text mb-2">Office</p>
                <p>123 Wellness Street</p>
                <p>San Francisco, CA 94107</p>
              </div>
              <div>
                <p className="font-semibold text-text mb-2">Hours</p>
                <p>Mon-Fri: 9AM-6PM PST</p>
                <p>Support: 24/7 Available</p>
              </div>
            </div>
          </div>

          {/* App Download Links */}
          <div className="mt-8 text-center">
            <p className="text-text-muted mb-4">Download our mobile app:</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => window.open('https://apps.apple.com/app/yogaai', '_blank')}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2"
              >
                <span className="text-xl">📱</span>
                App Store
              </button>
              <button 
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.yogaai', '_blank')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <span className="text-xl">🤖</span>
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer