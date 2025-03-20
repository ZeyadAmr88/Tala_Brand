import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/Navbar";
import Footer from "../Footer/Footer";
import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";

export default function Layout() {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      setUserData(userToken); // ✅ الآن يتم تمرير القيمة الحقيقية بدلاً من النص فقط
    } else {
      navigate("/login"); // ✅ تجنب مشاكل الإعادة غير الضرورية
    }
  }, [setUserData, navigate]);

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
