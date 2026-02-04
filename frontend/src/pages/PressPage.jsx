import React from 'react';
import './CompanyPages.css';

const PressPage = ({ onNavigate }) => {
  const pressReleases = [
    {
      date: 'Mar 1, 2024',
      title: 'Cosmos College Students Develop AI Wellness Platform for Academic Project',
      summary: 'Innovative academic project demonstrates practical AI applications in wellness technology using MediaPipe and machine learning.'
    },
    {
      date: 'Feb 15, 2024',
      title: 'YogaAI Partners with Major Fitness Chains',
      summary: 'New integration brings AI yoga coaching to 500+ fitness centers nationwide.'
    },
    {
      date: 'Jan 30, 2024',
      title: 'Study Shows YogaAI Users Improve 45% Faster',
      summary: 'Independent research validates effectiveness of AI-guided yoga practice.'
    }
  ];

  const mediaCoverage = [
    { logo: '📺', outlet: 'TechCrunch', headline: 'AI Meets Yoga: The Future of Fitness', date: 'Feb 28, 2024' },
    { logo: '📰', outlet: 'Forbes', headline: 'How YogaAI is Revolutionizing Digital Wellness', date: 'Feb 20, 2024' },
    { logo: '🎙️', outlet: 'The Verge', headline: 'Real-time Pose Detection with YogaAI', date: 'Feb 15, 2024' },
    { logo: '💻', outlet: 'Wired', headline: 'The AI Coach in Your Pocket', date: 'Feb 10, 2024' },
    { logo: '📱', outlet: 'Business Insider', headline: 'Startup of the Month: YogaAI', date: 'Feb 5, 2024' },
    { logo: '📺', outlet: 'Bloomberg', headline: 'Wellness Tech Boom: YogaAI Leads the Way', date: 'Jan 30, 2024' },
  ];

  const companyFacts = [
    { number: '10,000+', label: 'Active Users' },
    { number: '50+', label: 'Team Members' },
    { number: '98%', label: 'Accuracy Rate' },
    { number: '4.9', label: 'App Store Rating' },
  ];

  return (
    <div className="company-page">
      <div className="company-hero press-hero">
        <h1>Press & Media</h1>
        <p className="subtitle">Latest news and coverage about YogaAI</p>
      </div>

      <div className="company-content">
        {/* Press Contact */}
        <section className="section press-contact">
          <div className="press-contact-card">
            <h2>Press Contact</h2>
            <div className="contact-info">
              <p><strong>Press Inquiries:</strong> press@yogaai.com</p>
              <p><strong>Media Kit:</strong> Download assets and brand guidelines</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
            <div className="press-kit-buttons">
              <button className="press-kit-btn" onClick={() => alert('Downloading press kit...')}>
                Download Press Kit
              </button>
              <button className="logo-kit-btn" onClick={() => alert('Downloading logo kit...')}>
                Download Logo Kit
              </button>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="section press-releases">
          <h2>Press Releases</h2>
          <div className="releases-grid">
            {pressReleases.map((release, index) => (
              <div key={index} className="press-release">
                <div className="release-date">{release.date}</div>
                <h3>{release.title}</h3>
                <p>{release.summary}</p>
                <a href="#" className="read-more" onClick={(e) => { e.preventDefault(); alert('Reading full release...'); }}>
                  Read Full Release →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section className="section">
          <h2>Media Coverage</h2>
          <div className="media-coverage">
            {mediaCoverage.map((media, index) => (
              <div key={index} className="media-card">
                <div className="media-logo">{media.logo}</div>
                <div className="outlet-name">{media.outlet}</div>
                <div className="headline">{media.headline}</div>
                <div className="date">{media.date}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Company Facts */}
        <section className="section">
          <h2>Company Facts</h2>
          <div className="facts-grid">
            {companyFacts.map((fact, index) => (
              <div key={index} className="fact-card">
                <div className="fact-number">{fact.number}</div>
                <div className="fact-label">{fact.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PressPage;