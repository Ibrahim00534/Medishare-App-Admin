import React from "react";
import {
  Home,
  Users,
  Plus,
  FileText,
  TruckDelivery,
  ShieldLock,
  Pills,
  UserPlus
} from "tabler-icons-react";
import { Link } from "react-router-dom";
import Logo from "../assets/Main_Logo.png";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-light shadow-sm"
      style={{ height: "100vh", width: "250px" }}
    >
      <div className="text-center my-4">
        <img
          src={Logo}
          alt="Logo"
          style={{ maxWidth: "200px", height: "auto" }} // Adjust the size as needed
        />
      </div>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/" className="nav-link text-dark d-flex align-items-center">
            <Home size={24} className="me-2" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/users"
            className="nav-link text-dark d-flex align-items-center"
          >
            <Users size={24} className="me-2" />
            <span>Users</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/donations"
            className="nav-link text-dark d-flex align-items-center"
          >
            <Plus size={24} className="me-2" />
            <span>Donations</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/requests"
            className="nav-link text-dark d-flex align-items-center"
          >
            <FileText size={24} className="me-2" />
            <span>Requests</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admins"
            className="nav-link text-dark d-flex align-items-center"
          >
            <ShieldLock size={24} className="me-2" />
            <span>Admins</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/delivery-tracking"
            className="nav-link text-dark d-flex align-items-center"
          >
            <TruckDelivery size={24} className="me-2" />
            <span>Delivery Tracking</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/medicines-page"
            className="nav-link text-dark d-flex align-items-center"
          >
            <Pills size={24} className="me-2" /> {/* New icon for medicines */}
            <span>Medicines</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/riders" // Link to the Riders page
            className="nav-link text-dark d-flex align-items-center"
          >
            <UserPlus size={24} className="me-2" /> {/* Icon for Riders */}
            <span>Riders</span>
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/orders" // Link to the Riders page
            className="nav-link text-dark d-flex align-items-center"
          >
            <UserPlus size={24} className="me-2" /> {/* Icon for Riders */}
            <span>Orders</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
