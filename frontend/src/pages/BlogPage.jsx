import React from 'react';
import './CompanyPages.css';

const BlogPage = ({ onNavigate }) => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Science Behind AI Pose Detection',
      excerpt: 'How computer vision is revolutionizing yoga practice',
      author: 'Dr. Sarah Chen',
      date: 'Mar 15, 2024',
      readTime: '5 min read',
      category: 'Technology',
      image: '🔬'
    },
    {
      id: 2,
      title: 'Yoga for Mental Health: A Complete Guide',
      excerpt: 'Discover how specific poses can reduce anxiety and stress',
      author: 'Emma Wilson',
      date: 'Mar 10, 2024',
      readTime: '8 min read',
      category: 'Wellness',
      image: '🧠'
    },
    {
      id: 3,
      title: 'Nutrition Tips for Yogis',
      excerpt: 'What to eat before and after your practice',
      author: 'Michael Chen',
      date: 'Mar 5, 2024',
      readTime: '6 min read',
      category: 'Nutrition',
      image: '🥗'
    },
    {
      id: 4,
      title: 'Building a Consistent Yoga Practice',
      excerpt: 'Tips for maintaining daily yoga habits',
      author: 'Priya Sharma',
      date: 'Feb 28, 2024',
      readTime: '7 min read',
      category: 'Lifestyle',
      image: '📅'
    },
    {
      id: 5,
      title: 'The Future of Digital Wellness',
      excerpt: 'How AI is shaping the future of health and fitness',
      author: 'Alex Johnson',
      date: 'Feb 20, 2024',
      readTime: '10 min read',
      category: 'Future',
      image: '🚀'
    },
    {
      id: 6,
      title: 'Morning Yoga Routines for Energy',
      excerpt: 'Start your day right with these 15-minute sequences',
      author: 'Miguel Rodriguez',
      date: 'Feb 15, 2024',
      readTime: '4 min read',
      category: 'Routines',
      image: '🌅'
    }
  ];

  const categories = ['All', 'Technology', 'Wellness', 'Nutrition', 'Lifestyle', 'Future', 'Routines'];

  return (
    <div className="company-page">
      <div className="company-hero blog-hero">
        <h1>YogaAI Blog</h1>
        <p className="subtitle">Insights, tips, and news about yoga, wellness, and technology</p>
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
            <p>Subscribe to our newsletter for the latest articles and tips</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
            <p className="newsletter-note">No spam, unsubscribe anytime</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;