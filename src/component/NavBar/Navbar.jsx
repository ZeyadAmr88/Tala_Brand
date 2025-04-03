"use client"

import { useContext, useState, useEffect } from "react"
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSignOutAlt,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../Context/UserContext"
import { CartContext } from "../Context/CartContext"
import SearchBar from "./../searchBar/SearchBar"
import { IoShareSocial } from "react-icons/io5"

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)

  const { userData, setUserData } = useContext(UserContext)
  const { cartItems } = useContext(CartContext)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setSocialDropdownOpen(false)
    setUserDropdownOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleSocialDropdown = () => {
    setSocialDropdownOpen(!socialDropdownOpen)
    setUserDropdownOpen(false)
  }

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
    setSocialDropdownOpen(false)
  }

  const toggleSearch = () => {
    setSearchVisible(!searchVisible)
  }

  const logout = () => {
    localStorage.removeItem("userToken")
    setUserData(null)
    navigate("/login")
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#ff42a0]/95 shadow-md" : "bg-[#ff42a0]"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Adjusted size while maintaining containment */}
          <div className="flex-shrink-0 h-20 flex items-center">
            <NavLink to="/" className="block h-full flex items-center">
              <img
                src="https://res.cloudinary.com/dsf7jh6jb/image/upload/v1742084773/logo-grid-2x_bty7py.png"
                className="h-12 md:h-16 w-auto object-contain"
                alt="Tala Brand"
                style={{
                  maxWidth: "180px",
                  pointerEvents: "auto",
                  zIndex: 10,
                  position: "relative",
                }}
              />
            </NavLink>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {userData && (
              <div className="flex space-x-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 hover:bg-white/10 ${
                      isActive ? "bg-white/20" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 hover:bg-white/10 ${
                      isActive ? "bg-white/20" : ""
                    }`
                  }
                >
                  Products
                </NavLink>
              </div>
            )}
          </div>

          {/* Right Side - Social & Auth */}
          <div className="flex items-center space-x-2">
            {/* Social Media - Desktop */}
            <div className="hidden md:flex items-center space-x-3 mr-4">
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <FaFacebookF className="text-lg" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <FaYoutube className="text-lg" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <FaTwitter className="text-lg" />
              </a>
            </div>

            {/* Social Media - Mobile */}
            <div className="md:hidden relative">
              <button
                onClick={toggleSocialDropdown}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <IoShareSocial className="text-lg" />
              </button>

              {socialDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                  <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FaFacebookF className="mr-2" /> Facebook
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FaInstagram className="mr-2" /> Instagram
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FaYoutube className="mr-2" /> YouTube
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FaTwitter className="mr-2" /> Twitter
                  </a>
                </div>
              )}
            </div>

            {/* Search Toggle - Mobile */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <FaSearch className="text-lg" />
            </button>

            {/* Auth & Cart */}
            {userData ? (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative p-2 rounded-full ${
                      isActive ? "bg-white/20" : "hover:bg-white/10"
                    } text-white transition-colors`
                  }
                >
                  <FaShoppingCart className="text-xl" />
                  {cartItems?.products?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#ff42a0] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems?.products?.length}
                    </span>
                  )}
                </NavLink>

                {/* User Menu - Desktop */}
                <button
                  onClick={logout}
                  className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-sm font-medium">Logout</span>
                </button>

                {/* User Menu - Mobile */}
                <div className="md:hidden relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  >
                    <FaUserCircle className="text-xl" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                      <NavLink to="/profile" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <FaUserCircle className="mr-2" /> Profile
                      </NavLink>
                      <div className="h-px bg-gray-200 my-1"></div>
                      <button
                        onClick={logout}
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                      isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? "bg-white text-[#ff42a0]" : "bg-white/10 text-white hover:bg-white/20"
                    } transition-colors`
                  }
                >
                  Register
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchVisible && (
        <div className="md:hidden px-4 py-3 bg-[#ff42a0]/95 shadow-inner">
          <SearchBar />
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-[#ff42a0]/95 shadow-inner">
          {userData ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-white font-medium ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-white font-medium ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-white font-medium ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
              >
                Cart
              </NavLink>
            </>
          ) : (
            <div className="py-2 text-center text-white/80 text-sm">Please login to see more options</div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar