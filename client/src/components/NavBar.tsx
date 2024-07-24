import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { logout } from "../store/slices/authSlice";

const NavBar: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-customGray p-4 fixed top-0 left-0 w-full z-50 shadow-md mb-4">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-200">
              Home
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/add-car" className="text-white hover:text-gray-200">
                Add Car
              </Link>
            </li>
          )}
        </ul>
        <div className="flex space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-200">
                Register
              </Link>
            </>
          ) : (
            <button
              className="text-white hover:text-gray-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
