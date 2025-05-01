import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/Navbar";
import { useEffect, useContext } from "react";
import { UserContext } from "../Context/UserContext";
import Footer from "../Footer/Footer";

export default function Layout() {
  const { setUserData } = useContext(UserContext);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setUserData(userToken);
    }
    // ❌ don't redirect here — leave that to <ProtectedRoute>
  }, [setUserData]);

  return (
    <>
      <NavBar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
