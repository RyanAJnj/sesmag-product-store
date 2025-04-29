import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";

function App() {
  const { theme } = useThemeStore();
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      {token && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/product/:id" element={token ? <ProductPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
