import React from 'react';
import './CompanyPages.css';

const PressPage = ({ onNavigate }) => {
  const pressReleases = [
    {
      id: 1,
      title: 'YogaAI Raises $10M Series A to Expand AI Yoga Platform',
      date: 'March 1, 2024',
      summary: 'Funding led by Tech Ventures to accelerate development of real-time pose detection.',
      link: '#'
    },
    {
      id: 2,
      title: 'YogaAI Partners with Major Wellness Chains',
      date: 'February 15, 2024',
      summary: 'New partnerships bring AI yoga to 500+ studios nationwide.',
      link: '#'
    },
    {
      id: 3,
      title: 'Study Shows YogaAI Improves Practice Consistency by 300%',
      date: 'January 30, 2024',
      summary: 'Independent research validates effectiveness of AI-guided yoga.',
      link: '#'
    },
    {
      id: 4,
      title: 'YogaAI Launches Personalized Diet Planning Feature',
      date: 'January 10, 2024',
      summary: 'New AI nutrition recommendations integrated with yoga practice.',
      link: '#'
    }
  ];

  const mediaCoverage = [
    { outlet: 'TechCrunch', logo: '📰', headline: 'AI Meets Yoga', date: 'Feb 2024' },
    { outlet: 'Forbes', logo: '💼', headline: 'Wellness Tech Revolution', date: 'Jan 2024' },
    { outlet: 'Health Magazine', logo: '🏥', headline: 'Digital Yoga Breakthrough', date: 'Dec 2023' },
    { outlet: 'Wired', logo: '🔌', headline: 'The Future of Fitness', date: 'Nov 2023' },
    { outlet: 'Bloomberg', logo: '📊', headline: 'Startup Spotlight', date: 'Oct 2023' },
    { outlet: 'Yoga Journal', logo: '🧘', headline: 'Technology & Tradition', date: 'Sep 2023' },
  ];

  return (
    <div className="company-page">
      <div className="company-hero press-hero">
        <h1>Press & Media</h1>
        <p className="subtitle">Latest news, media kit, and company information</p>
      </div>

      <div className="company-content">
        {/* Press Contact */}
        <section className="section press-contact">
          <div className="press-contact-card">
            <h2>Press Contact</h2>
            <p>For media inquiries, please contact:</p>
            <div className="contact-info">
              <p><strong>Sarah Johnson</strong></p>
              <p>Head of Communications</p>
              <p>press@yogaai.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="press-kit-buttons">
              <button className="press-kit-btn">📥 Download Press Kit</button>
              <button className="logo-kit-btn">🎨 Download Logos</button>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="section">
          <h2>Press Releases</h2>
          <div className="press-releases">
            {pressReleases.map(release => (
              <div key={release.id} className="press-release">
                <div className="release-date">{release.date}</div>
                <h3>{release.title}</h3>
                <p>{release.summary}</p>
                <a href={release.link} className="read-more">Read Full Release →</a>
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
                <div className="media-content">
                  <h3>{media.outlet}</h3>
                  <p className="headline">{media.headline}</p>
                  <p className="date">{media.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Company Facts */}
        <section className="section facts-section">
          <h2>Company Facts</h2>
          <div className="facts-grid">
            <div className="fact-card">
              <div className="fact-number">2022</div>
              <div className="fact-title">Founded</div>
            </div>
            <div className="fact-card">
              <div className="fact-number">50+</div>
              <div className="fact-title">Team Members</div>
            </div>
            <div className="fact-card">
              <div className="fact-number">10K+</div>
              <div className="fact-title">Active Users</div>
            </div>
            <div className="fact-card">
              <div className="fact-number">98%</div>
              <div className="fact-title">Pose Accuracy</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PressPage;