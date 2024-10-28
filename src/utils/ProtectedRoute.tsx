import Navbar from "../components/Navbar";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | string>>;
  isAuthenticated: boolean | string | null;
}

const ProtectedRoute = ({ isAuthenticated,setIsAuthenticated }: ProtectedRouteProps) => {
  return isAuthenticated ? (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
