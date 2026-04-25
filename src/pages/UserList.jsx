import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getUsers, deleteUser } from '../api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(100); // Fetch more for local filtering
      setUsers(data.users);
      setError('');
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteUser(userToDelete.id);
      // Remove from local state
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="header-actions">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Users</h1>
        <div className="flex gap-4 flex-wrap">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
          <Link to="/users/add" className="btn btn-primary">
            <FiPlus /> Add User
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loader-container"><div className="loader"></div></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr key={user.id}>
                    <td data-label="Name">
                      <div className="flex items-center gap-2">
                        <img 
                          src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random`} 
                          alt={user.firstName} 
                          style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover'}} 
                        />
                        <span style={{fontWeight: 500}}>{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Phone">{user.phone}</td>
                    <td data-label="Role">
                      <span className={`badge ${user.role === 'admin' ? 'admin' : ''}`}>
                        {user.role}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        <Link to={`/users/${user.id}`} className="icon-btn" title="View Details">
                          <FiEye />
                        </Link>
                        <Link to={`/users/edit/${user.id}`} className="icon-btn" title="Edit User">
                          <FiEdit />
                        </Link>
                        <button className="icon-btn delete" onClick={() => handleDeleteClick(user)} title="Delete User">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{padding: '2rem'}}>
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredUsers.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing <strong>{indexOfFirstUser + 1}</strong> to <strong>{Math.min(indexOfLastUser, filteredUsers.length)}</strong> of <strong>{filteredUsers.length}</strong> users
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <FiChevronLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
              if (
                number === 1 || 
                number === totalPages || 
                (number >= currentPage - 1 && number <= currentPage + 1)
              ) {
                return (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                );
              } else if (
                (number === currentPage - 2 && number > 1) || 
                (number === currentPage + 2 && number < totalPages)
              ) {
                return <span key={number} style={{padding: '0 8px', color: 'var(--text-secondary)'}}>...</span>;
              }
              return null;
            })}

            <button 
              className="pagination-btn" 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Delete</h3>
            <div className="modal-body">
              Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}? This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
