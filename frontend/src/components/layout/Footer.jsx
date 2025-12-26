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

  const handleNavigate = (page) => navigate(`/${page}`)

  const handleSocialClick = (platform) => {
    const urls = {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    }
    window.open(urls[platform], '_blank')
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    if (email) {
      alert(`Thank you for subscribing with ${email}!`)
      e.target.reset()
    }
  }

  return (
    <footer className="bg-[#0b1020] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-pink-500 rounded-xl flex items-center justify-center">
                🧘
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">YogaAI</h2>
                <p className="text-sm text-slate-400">Intelligent Wellness</p>
              </div>
            </div>

            <p className="text-slate-400 mb-6 max-w-md">
              Empowering your wellness journey with AI-powered yoga guidance and nutrition.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => handleSocialClick(label)}
                  className="w-10 h-10 bg-white/5 hover:bg-pink-500/20 border border-white/10 rounded-full flex items-center justify-center"
                >
                  <Icon className="w-5 h-5 text-slate-300 hover:text-pink-400" />
                </button>
              ))}
            </div>
          </div>

          {[['Product', productLinks], ['Company', companyLinks], ['Resources', resourcesLinks], ['Legal', legalLinks]].map(
            ([title, links]) => (
              <div key={title}>
                <h4 className="font-bold text-lg mb-6 text-white">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => handleNavigate(link.id)}
                        className="text-slate-400 hover:text-pink-400 text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-l-lg text-white"
                required
              />
              <button className="px-6 py-2 bg-gradient-to-r from-accent to-pink-500 rounded-r-lg font-semibold">
                Subscribe
              </button>
            </form>

            <p className="text-slate-400 text-sm flex items-center">
              © {new Date().getFullYear()} YogaAI · Made with
              <Heart className="w-4 h-4 mx-1 text-red-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
