"use client"

import { useContext, useState, useEffect, useRef } from "react"
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
  FaHeart,
  FaSearch,
  FaHome,
  FaBoxOpen,
  FaTachometerAlt,
  FaChevronDown
} from "react-icons/fa"
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom"
import { UserContext } from "../Context/UserContext"
import { CartContext } from "../Context/CartContext"
import SearchBar from "../searchBar/SearchBar"
import { useFavorites } from "../Context/FavoritesContext"

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const accountRef = useRef(null)
  const menuRef = useRef(null)

  const { userData, logout } = useContext(UserContext)
  const { cartItems } = useContext(CartContext)
  const { favorites } = useFavorites()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('button')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
  const toggleAccount = () => setIsAccountOpen(!isAccountOpen)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#ff42a0] shadow-lg backdrop-blur-sm bg-opacity-95" 
          : "bg-[#ff42a0]"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-20 relative">
          <NavLink to="/" className="flex items-center group flex-shrink-0">
            <div className="relative flex items-center">
              {/* <div className="absolute -inset-1 bg-white/30 rounded-full blur opacity-0 grou-hover:opacity-100 transition-opacity duration-300"></div> */}
              <div className="relative flex items-center p-2 ">
                <img
                  src="/logo.png"
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-md "
                  alt="Tala Brand"
                />
                {/* <div className="hidden md:flex flex-col ml-3">
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl tracking-wider group-hover:text-pink-300">TALA</span>
                  <span className="text-pink-300 text-xs sm:text-sm md:text-base tracking-widest -mt-1 font-medium group-hover:text-white">BRAND</span>
                </div> */}
              </div>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center space-x-6">
            {userData && (
              <>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:bg-white/15 hover:shadow-inner flex items-center ${isActive ? "bg-white/20 shadow-inner border-b-2 border-white" : ""}`
                  }
                >
                  <FaHome className="mr-2" /> Home
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:bg-white/15 hover:shadow-inner flex items-center ${isActive ? "bg-white/20 shadow-inner border-b-2 border-white" : ""}`
                  }
                >
                  <FaBoxOpen className="mr-2" /> Products
                </NavLink>
                {userData.role === "admin" && (
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:bg-white/15 hover:shadow-inner flex items-center ${isActive ? "bg-white/20 shadow-inner" : ""}`
                    }
                  >
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </NavLink>
                )}
              </>
            )}
          </div>

          {userData && location.pathname !== "/login" && location.pathname !== "/register" && (
            <div className="hidden md:block w-full max-w-md mx-4">
              <SearchBar />
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {userData ? (
              <>
                {userData.role !== "admin" && (
                  <>
                    <Link
                      to="/favorites"
                      className="relative p-2 text-white hover:text-pink-300 transition-colors duration-200"
                    >
                      <FaHeart className="w-5 h-5" />
                      {favorites?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-[#ff42a0] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/cart"
                      className="relative p-2 text-white hover:text-pink-300 transition-colors duration-200"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      {cartItems?.products?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-[#ff42a0] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItems.products.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={toggleAccount}
                    className="flex items-center space-x-2 p-2 text-white hover:text-pink-300 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      {userData?.username ? userData.username[0].toUpperCase() : <FaUserCircle className="w-5 h-5" />}
                    </div>
                    <span className="hidden md:inline text-sm font-medium">
                      {userData?.username}
                    </span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAccountOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {isAccountOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold">
                            {userData?.username ? userData.username[0].toUpperCase() : 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData?.username}</p>
                            <p className="text-xs text-gray-500">{userData?.email}</p>
                          </div>
                        </div>
                      </div>
                      {userData?.role !== "admin" && (
                        <Link
                          to="/allorders"
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FaBoxOpen className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-500 hover:text-white flex items-center space-x-2"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {location.pathname === "/login" && (
                  <button
                    onClick={() => navigate("/register")}
                    className="text-white border-2 border-white/80 rounded-md px-5 py-2 hover:bg-white/15 transition-all duration-200 font-medium hover:shadow-inner flex items-center group"
                  >
                    <span className="mr-1">Register</span> <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                )}
                {location.pathname === "/register" && (
                  <button
                    onClick={() => navigate("/login")}
                    className="text-white border-2 border-white/80 rounded-md px-5 py-2 hover:bg-white/15 transition-all duration-200 font-medium hover:shadow-inner flex items-center"
                  >
                    <span className="mr-1">Login</span> <span className="text-xs">→</span>
                  </button>
                )}
                {location.pathname !== "/login" && location.pathname !== "/register" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="text-white border-2 border-white/80 rounded-md px-5 py-2 hover:bg-white/15 transition-all duration-200 font-medium hover:shadow-inner"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="bg-white text-pink-600 rounded-md px-5 py-2 hover:bg-white/90 transition-all duration-200 font-medium hover:shadow-md hover:scale-105"
                    >
                      Register
                    </button>
                  </div>
                )}
              </>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-white hover:text-pink-300 transition-colors duration-200"
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`md:hidden fixed top-20 left-0 right-0 bg-[#ff42a0] shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {userData && (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                    isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaHome className="mr-3 text-lg" /> Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                    isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaBoxOpen className="mr-3 text-lg" /> Products
              </NavLink>
              {userData.role !== "admin" && (
                <>
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                        isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <FaHeart className="mr-3 text-lg" /> Favorites
                    {favorites?.length > 0 && (
                      <span className="ml-auto bg-white text-[#ff42a0] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                        isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <FaShoppingCart className="mr-3 text-lg" /> Cart
                    {cartItems?.products?.length > 0 && (
                      <span className="ml-auto bg-white text-[#ff42a0] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.products.length}
                      </span>
                    )}
                  </NavLink>
                </>
              )}
              {userData.role === "admin" && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                      isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaTachometerAlt className="mr-3 text-lg" /> Dashboard
                </NavLink>
              )}
            </>
          )}

          {userData && location.pathname !== "/login" && location.pathname !== "/register" && (
            <div className="px-4">
              <SearchBar />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
