import React, { useState } from 'react';
import './CompanyPages.css';

const ContactPage = ({ onNavigate }) => {
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
    <div className="company-page">
      <div className="company-hero contact-hero">
        <h1>Contact Us</h1>
        <p className="subtitle">We'd love to hear from you. Get in touch!</p>
      </div>

      <div className="company-content">
        <div className="contact-layout">
          {/* Left: Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            
            {isSubmitted && (
              <div className="success-message">
                ✅ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a topic</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Product Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message..."
                  rows={6}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <div className="contact-icon">{info.icon}</div>
                  <div className="contact-details">
                    <h3>{info.title}</h3>
                    <p>{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="faqs-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faqs-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">❓ {faq.q}</div>
                    <div className="faq-answer">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <button className="social-btn twitter">𝕏 Twitter</button>
                <button className="social-btn linkedin">💼 LinkedIn</button>
                <button className="social-btn instagram">📸 Instagram</button>
                <button className="social-btn youtube">🎥 YouTube</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;