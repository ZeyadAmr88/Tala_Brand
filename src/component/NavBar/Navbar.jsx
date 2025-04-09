"use client"

import { useContext, useState, useEffect } from "react"
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../Context/UserContext"
import { CartContext } from "../Context/CartContext"
import SearchBar from "../searchBar/SearchBar"

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // const [searchVisible, setSearchVisible] = useState(false)

  const { userData, setUserData } = useContext(UserContext)
  const { cartItems } = useContext(CartContext)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const toggleMenu = () => setIsOpen(!isOpen)

  const logout = () => {
    localStorage.removeItem("userToken")
    setUserData(null)
    navigate("/login")
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#ff42a0]/95 shadow-md" : "bg-[#ff42a0]"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <NavLink to="/" className="h-full flex items-center">
            <img
              src="https://res.cloudinary.com/dsf7jh6jb/image/upload/v1742084773/logo-grid-2x_bty7py.png"
              className="h-12 md:h-16 w-auto object-contain"
              alt="Tala Brand"
            />
          </NavLink>

          <div className="hidden md:block">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {userData && (
              <>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-colors hover:bg-white/10 ${isActive ? "bg-white/20" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-colors hover:bg-white/10 ${isActive ? "bg-white/20" : ""
                    }`
                  }
                >
                  Products
                </NavLink>

                {userData.role === "admin" && (
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md text-white font-medium transition-colors hover:bg-white/10 ${isActive ? "bg-white/20" : ""
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                )}
              </>
            )}
          </div>

          {userData ? (
            <div className="flex items-center space-x-2">
              {userData.role !== "admin" && (
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative p-2 rounded-full text-white transition-colors ${isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`
                  }
                >
                  <FaShoppingCart className="text-xl" />
                  {cartItems?.products?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#ff42a0] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.products.length}
                    </span>
                  )}
                </NavLink>
              )}
              <NavLink
                to="/profile"
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <FaUserCircle className="text-xl" />
              </NavLink>

              <button
                onClick={logout}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          ) : (
            <>
              {location.pathname === "/login" && (
                <button
                  onClick={() => navigate("/register")}
                  className="text-white border border-white rounded-md px-4 py-1 hover:bg-white/10"
                >
                  Register
                </button>
              )}
              {location.pathname === "/register" && (
                <button
                  onClick={() => navigate("/login")}
                  className="text-white border border-white rounded-md px-4 py-1 hover:bg-white/10"
                >
                  Login
                </button>
              )}
            </>
          )}

          <button
            className="md:hidden text-white text-2xl ml-2"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 py-3 space-y-1 bg-[#ff42a0]/95 shadow-inner">
          {userData ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-white font-medium ${isActive ? "bg-white/20" : "hover:bg-white/10"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-white font-medium ${isActive ? "bg-white/20" : "hover:bg-white/10"
                  }`
                }
              >
                Products
              </NavLink>
              {userData.role === "admin" && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-white font-medium ${isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
              {userData.role !== "admin" && (
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-white font-medium ${isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`
                  }
                >
                  Cart
                </NavLink>
              )}
            </>
          ) : (
            <div className="py-2 text-center text-white/80 text-sm">
              {location.pathname === "/login" && (
                <button
                  onClick={() => navigate("/register")}
                  className="w-full text-white border border-white rounded-md px-4 py-1 hover:bg-white/10"
                >
                  Register
                </button>
              )}
              {location.pathname === "/register" && (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-white border border-white rounded-md px-4 py-1 hover:bg-white/10"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
