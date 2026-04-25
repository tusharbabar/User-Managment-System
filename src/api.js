import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

// Helper to get local data
const getLocalData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const getUsers = async (limit = 0, skip = 0) => {
  const params = {};
  if (limit) params.limit = limit;
  if (skip) params.skip = skip;
  
  const response = await api.get('/users', { params });
  let users = response.data.users;

  // Apply local modifications
  const localAdded = getLocalData('localAddedUsers');
  const localDeleted = getLocalData('localDeletedUsers');
  const localUpdated = JSON.parse(localStorage.getItem('localUpdatedUsers') || '{}');

  // Remove deleted
  users = users.filter(u => !localDeleted.includes(u.id));

  // Apply updates
  users = users.map(u => localUpdated[u.id] ? { ...u, ...localUpdated[u.id] } : u);

  // Prepend added
  users = [...localAdded, ...users];

  return { ...response.data, users };
};

export const getUserById = async (id) => {
  // Check local added first
  const localAdded = getLocalData('localAddedUsers');
  const addedUser = localAdded.find(u => String(u.id) === String(id));
  if (addedUser) return addedUser;

  // Otherwise fetch and apply updates
  const response = await api.get(`/users/${id}`);
  let user = response.data;
  
  const localUpdated = JSON.parse(localStorage.getItem('localUpdatedUsers') || '{}');
  if (localUpdated[id]) {
    user = { ...user, ...localUpdated[id] };
  }
  
  return user;
};

export const addUser = async (userData) => {
  const response = await api.post('/users/add', userData);
  const newUser = { ...response.data, ...userData, id: Date.now() }; // dummyjson always returns id 209 or something, we ensure uniqueness
  
  const localAdded = getLocalData('localAddedUsers');
  setLocalData('localAddedUsers', [newUser, ...localAdded]);
  
  return newUser;
};

export const updateUser = async (id, userData) => {
  // Note: dummyjson put might fail for local added users (high ids)
  // We just simulate it.
  let updatedUser = { ...userData, id };
  try {
    // Only call API if it's a real dummyjson user
    if (id < 1000000) {
      const response = await api.put(`/users/${id}`, userData);
      updatedUser = { ...response.data, ...userData };
    }
  } catch (e) {
    // Ignore error for locally added users
  }

  // Update local Added if it exists there
  const localAdded = getLocalData('localAddedUsers');
  const addedIndex = localAdded.findIndex(u => String(u.id) === String(id));
  if (addedIndex !== -1) {
    localAdded[addedIndex] = { ...localAdded[addedIndex], ...userData };
    setLocalData('localAddedUsers', localAdded);
  } else {
    // Store in localUpdated
    const localUpdated = JSON.parse(localStorage.getItem('localUpdatedUsers') || '{}');
    localUpdated[id] = { ...(localUpdated[id] || {}), ...userData };
    localStorage.setItem('localUpdatedUsers', JSON.stringify(localUpdated));
  }

  return updatedUser;
};

export const deleteUser = async (id) => {
  try {
    if (id < 1000000) {
      await api.delete(`/users/${id}`);
    }
  } catch (e) {}

  // Remove from localAdded if there
  const localAdded = getLocalData('localAddedUsers');
  const addedIndex = localAdded.findIndex(u => String(u.id) === String(id));
  if (addedIndex !== -1) {
    localAdded.splice(addedIndex, 1);
    setLocalData('localAddedUsers', localAdded);
  } else {
    // Mark as deleted
    const localDeleted = getLocalData('localDeletedUsers');
    if (!localDeleted.includes(id)) {
      setLocalData('localDeletedUsers', [...localDeleted, id]);
    }
  }
  
  return { id, isDeleted: true };
};

export default api;
