import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuthRoute from "./components/AuthRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const CarDetailPage = lazy(() => import("./pages/CarDetailPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AddCarForm = lazy(() => import("./components/addCarForm"));

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/add-car"
            element={<AuthRoute element={<AddCarForm />} />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
