import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UserList from './pages/UserList';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import UserDetails from './pages/UserDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="users/:id" element={<UserDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
