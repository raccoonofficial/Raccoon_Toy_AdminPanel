import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './assets/Admin_Panel';
import Login from './assets/Login';
import './App.css';

function App() {
  console.log('App is rendering...');
  
  return (
    <div className="App">
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Panel Routes - handles all dashboard routes */}
        <Route path="/*" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}

export default App;