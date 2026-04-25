import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';

const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <FiUsers size={24} />
            <span>User Management</span>
          </Link>
          <div>
            <Link to="/users" className="btn btn-outline" style={{ marginRight: '10px' }}>
              All Users
            </Link>
            <Link to="/users/add" className="btn btn-primary">
              Add User
            </Link>
          </div>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
