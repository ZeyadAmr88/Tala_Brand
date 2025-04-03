/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userToken = localStorage.getItem("userToken");

  console.log("User Token:", userToken);
  

  return userToken ? children : <Navigate to="/login" />;
}
