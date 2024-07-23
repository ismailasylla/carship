import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-200">
            Home
          </Link>
        </li>
        <li>
          <Link to="/add-car" className="text-white hover:text-gray-200">
            Add Car
          </Link>
        </li>
        <li>
          <Link to="/login" className="text-white hover:text-gray-200">
            Login
          </Link>
        </li>
        <li>
          <Link to="/register" className="text-white hover:text-gray-200">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
