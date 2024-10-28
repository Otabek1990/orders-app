import {
  Routes,
  Route,
 
} from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  const isAuthenticated = !!localStorage.getItem("isAuthenticated"); // Auth status

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Home />} />
      </Route>
    
    </Routes>
  );
}

export default App;
