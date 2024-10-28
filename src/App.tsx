import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<string | boolean>(
    JSON.parse(localStorage.getItem("isAuthenticated") || "false")
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route element={<ProtectedRoute setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
