import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

function Footer() {
  const navigate = useNavigate()
  const socialLinks = [
    { icon: Facebook, label: 'facebook' },
    { icon: Twitter, label: 'twitter' },
    { icon: Instagram, label: 'instagram' },
    { icon: Youtube, label: 'youtube' },
  ]

  const productLinks = [
    { id: 'pose-detection', label: 'AI Pose Detection' },
    { id: 'diet-plan', label: 'AI Diet Plans' },
    { id: 'progress', label: 'Progress Tracking' },
    { id: 'features', label: 'AI Yoga Coach' },
    { id: 'premium', label: 'Live Classes' },
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
    navigate(`/${page}`)
  }

  const handleSocialClick = (platform) => {
    const urls = {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    }
    window.open(urls[platform], '_blank');
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert(`Thank you for subscribing with ${email}! You'll receive wellness tips soon.`);
      e.target.reset();
    }
  }

  return (
    <footer className="bg-slate-900/50 backdrop-blur-xl border-t border-slate-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <span className="text-xl font-bold">🧘</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  YogaAI
                </h2>
                <p className="text-sm text-slate-400">Intelligent Wellness</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Empowering your wellness journey with AI-powered yoga guidance and personalized nutrition.
              Join thousands who transformed their health with intelligent technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleSocialClick(social.label)}
                    className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-full flex items-center justify-center transition hover:scale-110 hover:shadow-lg hover:shadow-green-500/20 group"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-green-400 transition" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.id + link.label}>
                  <button
                    onClick={() => handleNavigate(link.id)}
                    className="text-slate-400 hover:text-green-400 transition hover:translate-x-1 block w-full text-left text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavigate(link.id)}
                    className="text-slate-400 hover:text-green-400 transition hover:translate-x-1 block w-full text-left text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Resources</h4>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavigate(link.id)}
                    className="text-slate-400 hover:text-green-400 transition hover:translate-x-1 block w-full text-left text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavigate(link.id)}
                    className="text-slate-400 hover:text-green-400 transition hover:translate-x-1 block w-full text-left text-sm"
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
                  className="px-4 py-2 bg-card border border-white/10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent w-full sm:w-64"
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
                © {new Date().getFullYear()} YogaAI. All rights reserved.
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
                <p className="font-semibold text-text-primary mb-2">Contact</p>
                <p>support@yogaai.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-2">Office</p>
                <p>123 Wellness Street</p>
                <p>San Francisco, CA 94107</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-2">Hours</p>
                <p>Mon-Fri: 9AM-6PM PST</p>
                <p>Support: 24/7 Available</p>
              </div>
            </div>
          </div>

          {/* App Download Links */}
          <div className="mt-8 text-center">
            <p className="text-text-muted mb-4">Download our mobile app:</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button 
                onClick={() => window.open('https://apps.apple.com', '_blank')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2"
              >
                <span className="text-xl">📱</span>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </button>
              <button 
                onClick={() => window.open('https://play.google.com', '_blank')}
                className="px-6 py-3 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0a7d46] transition flex items-center gap-2"
              >
                <span className="text-xl">🤖</span>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 
         

export default Footer