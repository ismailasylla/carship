import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  to,
  onClick,
  className,
  children,
  type = "button",
}) => {
  if (to) {
    return (
      <Link to={to} className={`w-full ${className}`}>
        <button
          type={type}
          className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 ${className}`}
        >
          {children}
        </button>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
