import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import CarList from "./components/CarList";
import CarDetailPage from "./components/CarDetailPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import CarForm from "./components/CarForm";
import NavBar from "./components/NavBar";
import HomePage from "./components/pages/HomePage";
import CarListPage from "./components/CarList";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-car" element={<CarForm />} />
        {/* <Route path="/" element={<CarListPage />} /> */}
        <Route path="/car/:id" element={<CarDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
