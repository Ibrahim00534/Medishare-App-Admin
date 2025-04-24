import React, { useState, useEffect } from "react";
import { Bell, UserCircle } from "tabler-icons-react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const Navbar = () => {

  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchAdminName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(db, "admins"),
            where("uid", "==", user.uid)
          );

          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            setAdminName(docData.name);
          } else {
            console.log("Admin document not found.");
          }
        } catch (err) {
          console.error("Error fetching admin name:", err);
        }
      }
    };

    fetchAdminName();
  }, []);


  // Dummy notifications
  const notifications = [
    { id: 1, message: "Rider1 Out For Delivery ABC" },
    { id: 2, message: "New donation request received" },
    { id: 3, message: "Admin added successfully" },
    { id: 4, message: "User profile updated" },
  ];

  const handleLogout = () => {
    // Display confirmation alert before logging out
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Remove auth token from localStorage
      localStorage.removeItem("auth-token"); // Assuming you stored the token with the key "auth-token"

      // Update login state and navigate to login page
      setIsLoggedIn(false); // Update the state
      navigate("/login", { replace: true }); // Ensure "/login" is the route for your login page

      // Optionally, force a page reload if necessary to reset everything
      window.location.reload();
    }
  };

  const handleAddAdmin = () => {
    // Navigate to add new admin page using useNavigate
    navigate("/admins");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand"></span>
        <div className="d-flex align-items-center ml-auto">
          {/* Bell Icon with Notification Dropdown */}
          {isLoggedIn && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="notification-dropdown"
                className="d-flex align-items-center"
              >
                <Bell size={24} className="mx-3" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>Notifications</Dropdown.Header>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <Dropdown.Item key={notification.id}>
                      {notification.message}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>No new notifications</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* User Profile Dropdown */}
          {isLoggedIn && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="user-dropdown"
                className="d-flex align-items-center"
              >
                <UserCircle size={24} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.ItemText>
                  <strong>{adminName}</strong>
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleAddAdmin}>
                  Add New Admin
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
