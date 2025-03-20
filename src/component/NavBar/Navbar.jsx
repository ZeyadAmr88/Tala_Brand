import { useContext, useState } from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { CartContext } from '../Context/CartContext';

const NavBar = () => {
    let Navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const Logout = () => {
        localStorage.removeItem('userToken');
        setUserData(null);
        Navigate('/login');
    };

    let { userData, setUserData } = useContext(UserContext);
    let { cartItems } = useContext(CartContext);

    return (
        <nav className="bg-[#ff42a0] p-4 fixed left-0 right-0 top-0 z-50 flex justify-between items-center h-20">
            {/* Logo */}
            <div className="text-white text-2xl font-bold max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
                <NavLink to="/" end>
                    <img
                        src="https://res.cloudinary.com/dsf7jh6jb/image/upload/v1742084773/logo-grid-2x_bty7py.png"
                        className="h-auto w-auto object-contain"
                        alt="Logo"
                    />

                </NavLink>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
                <button onClick={toggleMenu} className="text-white text-2xl m-5">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Navigation Links */}
            <ul className={`md:flex md:space-x-6  absolute md:static top-20 left-0 right-0 w-full bg-[#ff42a0] md:bg-transparent md:w-auto p-4 md:p-0 transition-all duration-300 ${isOpen ? 'block' : 'hidden md:flex '}`}>
                {userData && (
                    <>
                        <li><NavLink to="/" end className="text-white text-lg block md:inline">Home</NavLink></li>
                        <li><NavLink to="/cart" className="text-white text-lg block md:inline">Cart</NavLink></li>
                        <li><NavLink to="/products" className="text-white text-lg block md:inline">Products</NavLink></li>
                        <li><NavLink to="/categories" className="text-white text-lg block md:inline">Categories</NavLink></li>
                    </>
                )}
            </ul>

            <div className="flex items-center space-x-4">
                <FaFacebookF className="text-white text-xl hover:text-gray-300 cursor-pointer" />
                <FaInstagram className="text-white text-xl hover:text-gray-300 cursor-pointer" />
                <FaYoutube className="text-white text-xl hover:text-gray-300 cursor-pointer" />
                <FaTwitter className="text-white text-xl hover:text-gray-300 cursor-pointer" />

                {userData ? (
                    <>
                        <li className="text-white text-lg cursor-pointer list-none" onClick={Logout}>Logout</li>
                        <li className="list-none text-main relative">
                            <NavLink to="cart" className="relative">
                                <i className="fa-solid fa-cart-shopping fa-xl text-black">
                                    <span className="text-white absolute top-[-2px] left-[10px] text-xs font-thin">
                                        {cartItems?.products?.length}
                                    </span>
                                </i>
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <NavLink to="/register" className="text-white text-lg">Register</NavLink>
                        <NavLink to="/login" className="text-white text-lg">Login</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
