"use client"

import { useContext, useState, useEffect } from "react"
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
  FaTachometerAlt
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
  const [scrolled, setScrolled] = useState(false)
  // const [searchVisible, setSearchVisible] = useState(false)

  const { userData, setUserData } = useContext(UserContext)
  const { cartItems } = useContext(CartContext)
  const { favorites } = useFavorites()

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
  
  // Add animation classes to tailwind config
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const logout = () => {
    localStorage.removeItem("userToken")
    setUserData(null)
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
        <div className="flex items-center h-20 relative">
          <NavLink to="/" className="h-full flex items-center group flex-shrink-0">
            <div className="relative flex items-center">
              <div className="absolute -inset-1 bg-white/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center p-2 rounded-lg border-2 border-white/30 bg-white/10 hover:bg-white/15 transition-all duration-300 shadow-lg group">
                <img
                  src="/logo.png"
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md group-hover:animate-bounce"
                  alt="Tala Brand"
                />
                <div className="hidden md:flex flex-col ml-3">
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl tracking-wider group-hover:text-pink-300">TALA</span>
                  <span className="text-pink-300 text-xs sm:text-sm md:text-base tracking-widest -mt-1 font-medium group-hover:text-white">BRAND</span>
                </div>
              </div>
            </div>
          </NavLink>

          {userData && location.pathname !== "/login" && location.pathname !== "/register" && (
            <div className="hidden md:block w-full max-w-md mx-4">
              <SearchBar />
            </div>
          )}
          
          <button
            onClick={toggleMenu}
            className="md:hidden ml-auto p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-auto">
            {userData && (
              <>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:bg-white/15 hover:shadow-inner flex items-center ${isActive ? "bg-white/20 shadow-inner border-b-2 border-white" : ""
                    }`
                  }
                >
                  <FaHome className="mr-2" /> Home
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:bg-white/15 hover:shadow-inner flex items-center ${isActive ? "bg-white/20 shadow-inner border-b-2 border-white" : ""
                    }`
                  }
                >
                  <FaBoxOpen className="mr-2" /> Products
                </NavLink>

                {userData.role === "admin" && (
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:bg-white/15 hover:shadow-inner flex items-center ${isActive ? "bg-white/20 shadow-inner" : ""
                      }`
                    }
                  >
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </NavLink>
                )}
              </>
            )}
          </div>

          {userData ? (
            <div className="flex items-center space-x-3">
              {userData.role !== "admin" && (
                <>
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `relative p-2 rounded-full text-white transition-all duration-200 ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                      }`
                    }
                  >
                    <FaHeart className="text-xl" />
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `relative p-2 rounded-full text-white transition-all duration-200 ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                      }`
                    }
                  >
                    <FaShoppingCart className="text-xl" />
                    {cartItems?.products?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-[#ff42a0] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {cartItems.products.length}
                      </span>
                    )}
                  </NavLink>
                </>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `p-2 rounded-full text-white transition-all duration-200 ${isActive ? "bg-white/20 shadow-inner ring-2 ring-white" : "hover:bg-white/15 hover:shadow-inner"
                  }`
                }
              >
                <FaUserCircle className="text-xl" />
              </NavLink>

              <button
                onClick={logout}
                className="p-2 rounded-full text-white hover:bg-white/15 hover:shadow-inner transition-all duration-200 group"
                title="Sign out"
              >
                <FaSignOutAlt className="text-xl group-hover:rotate-12 transition-transform" />
              </button>
            </div>
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
            className="md:hidden text-white text-2xl ml-2 p-2 rounded-full hover:bg-white/15 transition-all duration-200 border border-white/30"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <FaTimes className="transform rotate-90 transition-transform duration-300" /> : <FaBars className="transition-transform duration-300" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 py-3 space-y-2 bg-[#ff42a0]/95 shadow-inner border-t border-white/20">
          {userData ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner border-l-4 border-white" : "hover:bg-white/15 hover:shadow-inner border-l-4 border-transparent"
                  }`
                }
              >
                <FaHome className="mr-3 text-lg" /> Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner border-l-4 border-white" : "hover:bg-white/15 hover:shadow-inner border-l-4 border-transparent"
                  }`
                }
              >
                <FaBoxOpen className="mr-3 text-lg" /> Products
              </NavLink>
              {userData.role === "admin" && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                    }`
                  }
                >
                  <FaTachometerAlt className="mr-3 text-lg" /> Dashboard
                </NavLink>
              )}
              {userData.role !== "admin" && (
                <>
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                      }`
                    }
                  >
                    <FaHeart className="mr-3 text-lg" /> Favorites
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"
                      }`
                    }
                  >
                    <FaShoppingCart className="mr-3 text-lg" /> Cart
                    {cartItems?.products?.length > 0 && (
                      <span className="ml-2 bg-white text-[#ff42a0] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.products.length}
                      </span>
                    )}
                  </NavLink>
                </>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner border-l-4 border-white" : "hover:bg-white/15 hover:shadow-inner border-l-4 border-transparent"
                  }`
                }
              >
                <FaUserCircle className="mr-3 text-lg" /> Profile
              </NavLink>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-3 rounded-md text-white font-medium hover:bg-white/15 hover:shadow-inner text-left"
              >
                <FaSignOutAlt className="mr-3 text-lg" /> Sign Out
              </button>
            </>
          ) : null}
          
          {/* Mobile Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#ff42a0] shadow-lg p-4 md:hidden z-50 animate-fadeIn">
              <div className="py-3 space-y-4">
                {userData ? (
                  <>
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) =>
                        `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"}`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <FaHome className="mr-3 text-lg" /> Home
                    </NavLink>
                    <NavLink
                      to="/products"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"}`
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
                            `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"}`
                          }
                          onClick={() => setIsOpen(false)}
                        >
                          <FaHeart className="mr-3 text-lg" /> Favorites
                        </NavLink>
                        <NavLink
                          to="/cart"
                          className={({ isActive }) =>
                            `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"}`
                          }
                          onClick={() => setIsOpen(false)}
                        >
                          <FaShoppingCart className="mr-3 text-lg" /> Cart
                          {cartItems?.products?.length > 0 && (
                            <span className="ml-2 bg-white text-[#ff42a0] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {cartItems.products.length}
                            </span>
                          )}
                        </NavLink>
                      </>
                    )}
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-3 rounded-md text-white font-medium ${isActive ? "bg-white/20 shadow-inner" : "hover:bg-white/15 hover:shadow-inner"}`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserCircle className="mr-3 text-lg" /> Profile
                    </NavLink>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center px-3 py-3 rounded-md text-white font-medium hover:bg-white/15 hover:shadow-inner text-left"
                    >
                      <FaSignOutAlt className="mr-3 text-lg" /> Sign Out
                    </button>
                    {userData && location.pathname !== "/login" && location.pathname !== "/register" && (
                      <div className="w-full mt-3">
                        <SearchBar />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {location.pathname === "/login" && (
                      <button
                        onClick={() => {
                          navigate("/register");
                          setIsOpen(false);
                        }}
                        className="w-full text-white border-2 border-white/80 rounded-md px-4 py-2 hover:bg-white/15 transition-all duration-200 font-medium flex items-center justify-center"
                      >
                        <span>Create an Account</span> <span className="ml-1 text-xs">→</span>
                      </button>
                    )}
                    {location.pathname === "/register" && (
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsOpen(false);
                        }}
                        className="w-full text-white border-2 border-white/80 rounded-md px-4 py-2 hover:bg-white/15 transition-all duration-200 font-medium flex items-center justify-center"
                      >
                        <span>Sign In</span> <span className="ml-1 text-xs">→</span>
                      </button>
                    )}
                    {location.pathname !== "/login" && location.pathname !== "/register" && (
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            navigate("/login");
                            setIsOpen(false);
                          }}
                          className="w-full text-white border-2 border-white/80 rounded-md px-4 py-2 hover:bg-white/15 transition-all duration-200 font-medium"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            navigate("/register");
                            setIsOpen(false);
                          }}
                          className="w-full bg-white text-pink-600 rounded-md px-4 py-2 hover:bg-white/90 transition-all duration-200 font-medium"
                        >
                          Create an Account
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
