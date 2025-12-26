import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, HelpCircle, Users, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    { icon: '📧', title: 'General Inquiries', detail: 'hello@yogaai.com' },
    { icon: '💼', title: 'Business', detail: 'partners@yogaai.com' },
    { icon: '🏢', title: 'Office', detail: '123 Wellness St, San Francisco, CA' },
    { icon: '📞', title: 'Phone', detail: '+1 (555) 123-4567' },
    { icon: '⏰', title: 'Hours', detail: 'Mon-Fri, 9AM-6PM PST' },
    { icon: '🤝', title: 'Support', detail: 'support@yogaai.com' },
  ];

  const faqs = [
    { q: 'How accurate is the AI pose detection?', a: 'Our AI achieves 98% accuracy in pose detection.' },
    { q: 'Do you offer enterprise plans?', a: 'Yes, contact our business team for custom solutions.' },
    { q: 'Can I use YogaAI offline?', a: 'Basic features work offline, AI detection requires internet.' },
    { q: 'How do I cancel my subscription?', a: 'You can cancel anytime from your account settings.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-sm font-semibold text-accent mb-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            GET IN TOUCH
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Contact{" "}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with our team and let's start a conversation.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>

              {isSubmitted && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6 text-green-400">
                  ✅ Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Select a topic</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message..."
                    rows={6}
                    className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info & FAQs */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-secondary/30 rounded-xl">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <h3 className="font-semibold text-accent mb-1">{info.title}</h3>
                        <p className="text-text-muted">{info.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <HelpCircle className="w-6 h-6 mr-2 text-accent" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-white/10 pb-4 last:border-b-0">
                      <div className="font-semibold text-accent mb-2">❓ {faq.q}</div>
                      <div className="text-text-muted">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-accent" />
                  Follow Us
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="px-4 py-3 bg-secondary/50 hover:bg-secondary rounded-xl font-semibold transition-colors border border-white/10">
                    𝕏 Twitter
                  </button>
                  <button className="px-4 py-3 bg-secondary/50 hover:bg-secondary rounded-xl font-semibold transition-colors border border-white/10">
                    💼 LinkedIn
                  </button>
                  <button className="px-4 py-3 bg-secondary/50 hover:bg-secondary rounded-xl font-semibold transition-colors border border-white/10">
                    📸 Instagram
                  </button>
                  <button className="px-4 py-3 bg-secondary/50 hover:bg-secondary rounded-xl font-semibold transition-colors border border-white/10">
                    🎥 YouTube
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;