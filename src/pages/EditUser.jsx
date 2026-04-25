import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getUserById, updateUser } from '../api';
import { FiArrowLeft } from 'react-icons/fi';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'user'
        });
      } catch (err) {
        setServerError('Failed to fetch user details.');
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName || formData.firstName.length < 3) {
      newErrors.firstName = 'First Name is required and must be at least 3 characters.';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last Name is required.';
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'A valid Email is required.';
    }
    // API returns phone in format like '+1 123 456 7890' sometimes, let's just make it required
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setServerError('');
    
    try {
      await updateUser(id, formData);
      setSuccessMsg('User updated successfully!');
      setTimeout(() => navigate('/users'), 1500);
    } catch (err) {
      setServerError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-4">
        <Link to="/users" className="icon-btn"><FiArrowLeft size={20} /></Link>
        <h2 className="page-title" style={{ margin: 0 }}>Edit User</h2>
      </div>

      {serverError && <div className="alert alert-error">{serverError}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone *</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <select
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Link to="/users" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
