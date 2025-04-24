import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Donations from "./components/Donations";
import Requests from "./components/Requests";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Admins from "./components/Admins";
import DonationDelivery from "./components/DonationDelivery";
import MedicinesPage from "./components/MedicinesPage";
import Riders from "./components/Riders";
import Orders from "./components/Orders";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if there's an auth token in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Remove token from localStorage on logout
    localStorage.removeItem("auth-token");
  };

  return (
    <Router>
      <div className="d-flex">
        {/* Only show Sidebar if logged in */}
        {isLoggedIn && <Sidebar />}
        <div className="flex-grow-1">
          {/* Only show Navbar if logged in */}
          {isLoggedIn && <Navbar onLogout={handleLogout} />}
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            {/* Protected Routes */}
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/admins" element={<Admins />} />
                <Route path="/riders" element={<Riders />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/orders" element={<Orders />} />
                <Route
                  path="/delivery-tracking"
                  element={<DonationDelivery />}
                />
                
                <Route
                  path="/medicines-page"
                  element={<MedicinesPage />}
                />
              </>
            ) : (
              // Redirect to login for any other route if not logged in
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
