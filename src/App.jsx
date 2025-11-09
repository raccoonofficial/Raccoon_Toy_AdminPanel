import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import the audio file from its new location
import backgroundMusic from './assets/music/loverboy.mp3';

// Import all components for routing
import AdminPanel from './assets/Admin_Panel';
import Login from './assets/Login';
import AdminDashboard from './assets/Admin_Dashboard';
import AdminProducts from './assets/Admin_Products';
import AdminCustomersPage from './assets/Admin_Customers'; // This is the CUSTOMER LIST page
import AddCustomersPage from './assets/Add_Customers';     // This is the ADD CUSTOMER FORM page
import Admin_Orders from './assets/Admin_Orders';
import Finance from './assets/Finance';
import Add_Products from './assets/Add_Products';
import Add_Orders from './assets/Add_Orders';
import './App.css';

function App() {
  const userName = "shamim-kabir-kazim-git";
  const currentDate = new Date('2025-11-09T15:50:57Z');

  // This effect will run once when the App component mounts
  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;   // Make the music loop continuously
    audio.volume = 0.3;  // Set a reasonable starting volume

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Autoplay started successfully!
        console.log("Background music is playing.");
      }).catch(error => {
        // Autoplay was prevented. We'll wait for a user interaction.
        console.log("Autoplay prevented. Waiting for user interaction to play music.");
        const playOnClick = () => {
          audio.play();
          window.removeEventListener('click', playOnClick);
        };
        window.addEventListener('click', playOnClick);
      });
    }
    
    // Cleanup function to stop the music when the component is unmounted
    return () => {
      audio.pause();
    };
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* AdminPanel acts as a layout for all nested routes */}
        <Route path="/" element={<AdminPanel />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard userName={userName} date={currentDate} />} />
          
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<Add_Products />} />
          
          {/* --- Customer Routes --- */}
          <Route path="users" element={<AdminCustomersPage />} />
          <Route path="users/add" element={<AddCustomersPage />} />

          <Route path="orders" element={<Admin_Orders />} />
          <Route path="orders/add" element={<Add_Orders />} />
          
          <Route path="finance" element={<Finance />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;