import React from "react"; // შემოაქვს React-ის ბიბლიოთეკა
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // ნავიგაციის ხელსაწყოები
import { ToastContainer } from 'react-toastify'; // შეტყობინებების (Toast) კონტეინერი
import 'react-toastify/dist/ReactToastify.css'; // შეტყობინებების სტანდარტული სტილები
import Login from "./pages/Login"; // ავტორიზაციის გვერდი
import Register from "./pages/Register"; // რეგისტრაციის გვერდი
import Dashboard from "./pages/Dashboard"; // მართვის პანელის გვერდი

// დაცული როუტი: ამოწმებს არის თუ არა იუზერი შესული, თუ არა - გადაჰყავს ლოგინზე
const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isLoggedIn") === "true"; // ამოწმებს სტატუსს მეხსიერებაში
  return isAuth ? children : <Navigate to="/login" replace />; // თუ არაა შესული, ბლოკავს წვდომას
};

// საჯარო როუტი: თუ იუზერი უკვე შესულია, არ უშვებს ლოგინის/რეგისტრაციის გვერდზე
const PublicRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isLoggedIn") === "true"; // ამოწმებს ავტორიზაციას
  return isAuth ? <Navigate to="/dashboard" replace /> : children; // თუ შესულია, გადაჰყავს დეშბორდზე
};

function App() {
  return (
    <Router> {/* ნავიგაციის გარსი */}
      <Routes> {/* გვერდების ჩამონათვალი */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} /> {/* შესვლის გვერდი */}
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} /> {/* რეგისტრაციის გვერდი */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* დაცული დეშბორდი */}
        <Route path="*" element={<Navigate to="/login" replace />} /> {/* ნებისმიერ სხვა მისამართზე გადადის ლოგინზე */}
      </Routes>
      
      {/* შეტყობინებების (Popup) გლობალური კონტეინერი */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" /> 
    </Router>
  );
}

export default App; // აექსპორტებს აპლიკაციას