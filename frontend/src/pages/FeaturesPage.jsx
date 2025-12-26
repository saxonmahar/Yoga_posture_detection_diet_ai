import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeaturesPage.css';

const FeaturesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ai-coach');

  // helper function to navigate and scroll to top
  const goTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  }

  const features = [
    {
      id: 'ai-coach',
      icon: '🤖',
      title: 'AI Yoga Coach',
      description: 'Your personalized AI yoga assistant that adapts to your fitness level, goals, and preferences.',
      content: (
        <div className="content-grid">
          <div className="content-card">
            <h3>Personalized Sessions</h3>
            <p>AI-generated yoga sequences based on your mood, energy level, and fitness goals.</p>
          </div>
          <div className="content-card">
            <h3>Form Correction</h3>
            <p>Real-time posture analysis and feedback using computer vision technology.</p>
          </div>
          <div className="content-card">
            <h3>Adaptive Difficulty</h3>
            <p>Automatically adjusts poses and sequences as you progress in your journey.</p>
          </div>
        </div>
      )
    },
    {
      id: 'diet-plans',
      icon: '🥗',
      title: 'Diet Plans',
      description: 'Nutrition plans tailored to your yoga practice, dietary preferences, and health goals.',
      content: (
        <div className="ai-plan-grid">
          <div className="plan-item">
            <h3>Vegan Yoga Diet</h3>
            <p>Plant-based nutrition for enhanced flexibility and energy</p>
            <button className="feature-btn" onClick={() => alert('View Vegan Diet Plan')}>View Plan</button>
          </div>
          <div className="plan-item">
            <h3>Weight Management</h3>
            <p>Calorie-controlled plans for healthy weight goals</p>
            <button className="feature-btn" onClick={() => alert('View Weight Management Plan')}>View Plan</button>
          </div>
          <div className="plan-item">
            <h3>Detox & Cleanse</h3>
            <p>Purifying meals for mind-body cleansing</p>
            <button className="feature-btn" onClick={() => alert('View Detox Plan')}>View Plan</button>
          </div>
        </div>
      )
    },
    {
      id: 'progress-tracking',
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your yoga journey with detailed analytics and insights.',
      content: (
        <div className="tracking-stats">
          <div className="stat-card">
            <h3>Consistency Score</h3>
            <p>Current: 85%</p>
            <p>Weekly improvement: +5%</p>
          </div>
          <div className="stat-card">
            <h3>Flexibility Progress</h3>
            <p>Improved by 40%</p>
            <p>Next goal: Full forward bend</p>
          </div>
          <div className="stat-card">
            <h3>Session History</h3>
            <p>Total sessions: 48</p>
            <p>Total hours: 36.5</p>
          </div>
        </div>
      )
    }
  ];

  const activeFeature = features.find(feature => feature.id === activeTab);

  return (
    <div className="features-page">
      <div className="features-hero">
        <h1>Powerful Features for Your Yoga Journey</h1>
        <p>Discover how our AI-powered platform transforms your yoga practice</p>
      </div>

      <div className="features-container">
        <nav className="features-nav">
          {features.map(feature => (
            <button
              key={feature.id}
              className={`feature-tab ${activeTab === feature.id ? 'active' : ''}`}
              onClick={() => setActiveTab(feature.id)}
            >
              <span className="feature-icon">{feature.icon}</span>
              {feature.title}
            </button>
          ))}
        </nav>

        <div className="feature-content">
          <h2>{activeFeature.title}</h2>
          <p>{activeFeature.description}</p>
          {activeFeature.content}

          <div className="feature-cta">
            <button
              className="cta-btn"
              onClick={() => goTo('/')} // updated to scroll to top
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
