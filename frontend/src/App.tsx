import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import Events from "@/pages/Events";
import Layout from "@/components/Layout";
import Settings from "@/pages/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  useEffect(() => {
    // Add dark mode class to html element
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/events" element={<Events />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Redirect to login by default if not authenticated */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
