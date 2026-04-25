import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserById } from '../api';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (err) {
        setError('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!user) return <div className="alert alert-error">User not found</div>;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Link to="/users" className="icon-btn"><FiArrowLeft size={20} /></Link>
          <h2 className="page-title" style={{ margin: 0 }}>User Details</h2>
        </div>
        <Link to={`/users/edit/${user.id}`} className="btn btn-primary">
          <FiEdit /> Edit User
        </Link>
      </div>

      <div className="user-details-grid mt-4">
        <div className="text-center" style={{ borderRight: '1px solid var(--border-color)', paddingRight: '2rem' }}>
          <img 
            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || '') + ' ' + (user.lastName || ''))}&background=random`} 
            alt={user.firstName} 
            style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 1rem', display: 'block', objectFit: 'cover' }} 
          />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.firstName} {user.lastName}</h3>
          <span className={`badge ${user.role === 'admin' ? 'admin' : ''}`} style={{ fontSize: '1rem', padding: '0.25rem 1rem' }}>
            {user.role || 'user'}
          </span>
        </div>

        <div style={{ paddingLeft: '1rem' }}>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Contact Information
          </h4>
          
          <div className="info-group">
            <div className="info-label">Email Address</div>
            <div className="info-value">{user.email}</div>
          </div>
          
          <div className="info-group">
            <div className="info-label">Phone Number</div>
            <div className="info-value">{user.phone}</div>
          </div>

          <div className="info-group">
            <div className="info-label">Username</div>
            <div className="info-value">{user.username}</div>
          </div>

          <div className="info-group">
            <div className="info-label">Birth Date</div>
            <div className="info-value">{user.birthDate || 'N/A'}</div>
          </div>
          
          <div className="info-group">
            <div className="info-label">Address</div>
            <div className="info-value">
              {user.address ? `${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
