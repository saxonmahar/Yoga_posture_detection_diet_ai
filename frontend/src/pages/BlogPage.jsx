import React from 'react';
import './CompanyPages.css';

const BlogPage = ({ onNavigate }) => {
  const blogPosts = [
    {
      id: 1,
      title: 'Implementing AI Pose Detection with MediaPipe',
      excerpt: 'Technical overview of our computer vision implementation',
      author: 'Development Team',
      date: 'Feb 15, 2026',
      readTime: '8 min read',
      category: 'Technology',
      image: '🔬'
    },
    {
      id: 2,
      title: 'Building a Full-Stack Wellness Platform',
      excerpt: 'Architecture decisions and technology stack overview',
      author: 'Project Team',
      date: 'Feb 10, 2026',
      readTime: '10 min read',
      category: 'Development',
      image: '🧠'
    },
    {
      id: 3,
      title: 'Machine Learning for Nutrition Recommendations',
      excerpt: 'How we implemented personalized diet suggestions',
      author: 'ML Team',
      date: 'Feb 5, 2026',
      readTime: '6 min read',
      category: 'AI/ML',
      image: '🥗'
    },
    {
      id: 4,
      title: 'User Experience Design for Wellness Apps',
      excerpt: 'Design principles for health and fitness applications',
      author: 'UI/UX Team',
      date: 'Jan 28, 2026',
      readTime: '7 min read',
      category: 'Design',
      image: '📅'
    },
    {
      id: 5,
      title: 'Database Design for User Progress Tracking',
      excerpt: 'Schema design and data management strategies',
      author: 'Backend Team',
      date: 'Jan 20, 2026',
      readTime: '5 min read',
      category: 'Database',
      image: '🚀'
    },
    {
      id: 6,
      title: 'Testing and Quality Assurance Process',
      excerpt: 'Our approach to ensuring system reliability and accuracy',
      author: 'QA Team',
      date: 'Jan 15, 2026',
      readTime: '4 min read',
      category: 'Testing',
      image: '🌅'
    }
  ];

  const categories = ['All', 'Technology', 'Development', 'AI/ML', 'Design', 'Database', 'Testing'];

  return (
    <div className="company-page">
      <div className="company-hero blog-hero">
        <h1>Project Development Blog</h1>
        <p className="subtitle">Technical insights and development journey of our AI-powered wellness platform</p>
      </div>

      <div className="company-content">
        {/* Categories */}
        <section className="section">
          <div className="categories-filter">
            {categories.map(category => (
              <button key={category} className={`category-btn ${category === 'All' ? 'active' : ''}`}>
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Post */}
        <section className="section">
          <div className="featured-post">
            <div className="featured-content">
              <span className="featured-badge">FEATURED</span>
              <h2>{blogPosts[0].title}</h2>
              <p className="featured-excerpt">{blogPosts[0].excerpt}</p>
              <div className="post-meta">
                <span className="author">{blogPosts[0].author}</span>
                <span className="date">{blogPosts[0].date}</span>
                <span className="read-time">{blogPosts[0].readTime}</span>
              </div>
              <button className="read-btn">Read Article →</button>
            </div>
            <div className="featured-image">
              <div className="image-placeholder">{blogPosts[0].image}</div>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="section">
          <h2>Latest Articles</h2>
          <div className="blog-grid">
            {blogPosts.slice(1).map(post => (
              <div key={post.id} className="blog-card">
                <div className="blog-image">{post.image}</div>
                <div className="blog-content">
                  <span className="blog-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-author">By {post.author}</span>
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                  <button className="blog-read-btn">Read →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="section newsletter-section">
          <div className="newsletter-card">
            <h2>Stay Updated</h2>
            <p>Follow our project development and technical documentation</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
            <p className="newsletter-note">Get updates on our academic project progress</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;