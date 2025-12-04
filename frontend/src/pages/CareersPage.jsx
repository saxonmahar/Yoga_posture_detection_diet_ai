import React from 'react';
import './CompanyPages.css';

const CareersPage = ({ onNavigate }) => {
  const jobOpenings = [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build amazing user experiences for our yoga AI platform.'
    },
    {
      id: 2,
      title: 'AI/ML Engineer',
      department: 'Research',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Develop advanced pose detection algorithms.'
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create intuitive interfaces for wellness technology.'
    },
    {
      id: 4,
      title: 'Yoga Instructor Consultant',
      department: 'Content',
      location: 'Remote',
      type: 'Contract',
      description: 'Provide expert guidance for yoga pose libraries.'
    }
  ];

  const benefits = [
    { icon: '💻', title: 'Remote First', desc: 'Work from anywhere' },
    { icon: '💰', title: 'Competitive Salary', desc: 'Above market rates' },
    { icon: '🏖️', title: 'Unlimited PTO', desc: 'Flexible time off' },
    { icon: '🧘', title: 'Wellness Stipend', desc: '$500/month wellness budget' },
    { icon: '📚', title: 'Learning Budget', desc: '$2000/year for courses' },
    { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive coverage' },
  ];

  return (
    <div className="company-page">
      <div className="company-hero">
        <h1>Join Our Mission</h1>
        <p className="subtitle">Help millions achieve wellness through AI-powered yoga</p>
      </div>

      <div className="company-content">
        {/* Why Join Us */}
        <section className="section">
          <h2>Why Work at YogaAI?</h2>
          <p className="section-description">
            We're building the future of digital wellness, combining cutting-edge AI with ancient 
            yoga practices to help people live healthier, happier lives.
          </p>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Openings */}
        <section className="section">
          <h2>Open Positions</h2>
          <p className="section-description">
            Check out our current openings and find your perfect role.
          </p>
          
          <div className="jobs-grid">
            {jobOpenings.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <div className="job-tags">
                    <span className="tag department">{job.department}</span>
                    <span className="tag location">{job.location}</span>
                    <span className="tag type">{job.type}</span>
                  </div>
                </div>
                <p className="job-description">{job.description}</p>
                <button className="apply-btn" onClick={() => alert(`Applying for ${job.title}`)}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="section process-section">
          <h2>Our Hiring Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Application Review</h3>
              <p>We review your resume within 48 hours</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Initial Call</h3>
              <p>30-minute chat with our hiring team</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Skills Assessment</h3>
              <p>Practical task related to the role</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Team Interviews</h3>
              <p>Meet with team members and managers</p>
            </div>
            <div className="process-step">
              <div className="step-number">5</div>
              <h3>Offer</h3>
              <p>Welcome to the YogaAI family!</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section">
          <h2>Don't See Your Dream Role?</h2>
          <p>We're always looking for talented people. Send us your resume!</p>
          <button className="cta-btn" onClick={() => alert('Opening general application...')}>
            Submit General Application
          </button>
        </section>
      </div>
    </div>
  );
};

export default CareersPage;