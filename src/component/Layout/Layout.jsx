import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/Navbar";
import Footer from "../Footer/Footer";
import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";


export default function Layout() {
  let Navigate = useNavigate()
  let { setUserData } = useContext(UserContext)
  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      setUserData('userToken')

    } else {
      Navigate('/login')
    }
  }, [Navigate, setUserData])
  return (
    <>
      <NavBar />
      <div className="container py-30">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
