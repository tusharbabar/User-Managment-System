import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShield, FiActivity, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="home-container">
      {/* Decorative background blur elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <div className="hero-section text-center fade-in-up">
        <div className="badge-pill mb-4" style={{ display: 'inline-block', margin: '0 auto 1.5rem', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem' }}>
          ✨ The Next Generation of Management
        </div>
        <h1 className="hero-title">
          Manage Your Users <br />
          <span className="text-gradient">Effortlessly & Securely</span>
        </h1>
        <p className="hero-subtitle">
          Experience a sleek, modern, and intuitive User Management System built for the future. Seamlessly create, update, and organize your team with a beautiful interface.
        </p>
        <div className="hero-actions flex justify-center gap-4 mt-4">
          <Link to="/users" className="btn btn-primary btn-lg pulse-btn">
            View All Users <FiArrowRight />
          </Link>
          <Link to="/users/add" className="btn btn-outline btn-lg glass-btn">
            Add New User
          </Link>
        </div>
      </div>

      <div className="features-grid stagger-in">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <div className="feature-icon">
              <FiUsers />
            </div>
          </div>
          <h3>Centralized Dashboard</h3>
          <p>Get a complete overview of all your users in one beautifully designed, searchable, and filterable layout.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
              <FiShield />
            </div>
          </div>
          <h3>Secure & Reliable</h3>
          <p>Robust form validation and state management ensure that your data is handled perfectly and securely every time.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)' }}>
              <FiActivity />
            </div>
          </div>
          <h3>Lightning Fast</h3>
          <p>Built with modern React, the interface is snappy, responsive, and updates instantly without any page reloads.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
