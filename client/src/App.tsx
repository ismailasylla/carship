// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CarDetailPage from "./pages/CarDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CarForm from "./components/CarForm";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import AuthRoute from "./components/AuthRoute";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protecting the /add-car route */}
        <Route path="/add-car" element={<AuthRoute element={<CarForm />} />} />
      </Routes>
    </Router>
  );
};

export default App;
