import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthRoute, CarForm, NavBar } from "./components";
import { CarDetailPage, HomePage, LoginPage, RegisterPage } from "./pages";

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
