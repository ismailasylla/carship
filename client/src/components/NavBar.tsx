import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-blue-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">CarShip</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="text-white hover:text-gray-300">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
