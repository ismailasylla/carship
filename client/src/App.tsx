import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Login from "./components/pages/LoginPage";
import Register from "./components/pages/RegisterPage";
import CarForm from "./components/CarForm";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-car" element={<CarForm />} />
      </Routes>
    </Router>
  );
};

export default App;
