// NavBar.jsx
import { useContext } from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { CartContext } from '../Context/CartContext';

const NavBar = () => {
    let Navigate = useNavigate()
    const Logout = () => {
        localStorage.removeItem('userToken')
        setUserData(null)
        Navigate('/login')

    }

    let { userData, setUserData } = useContext(UserContext)
    let { cartItems } = useContext(CartContext)

    return (
        <>
            <nav className="bg-teal-700 p-4 left-0 right-0 md:fixed z-50 flex justify-between items-center">
                <div className="text-white   text-2xl font-bold">
                    <NavLink to="/" end>Fresh Cart</NavLink>
                </div>
                {userData &&
                    <ul className="flex space-x-6">
                        <li>
                            <NavLink to="/" end className="text-white text-lg">Home</NavLink>
                        </li>

                        <li>
                            <NavLink to="/cart" className="text-white text-lg ">Cart</NavLink>

                        </li>
                        <li>
                            <NavLink to="/brands" className="text-white text-lg ">Brands</NavLink>
                        </li>
                        <li>
                            <NavLink to="/products" className="text-white text-lg ">Products</NavLink>
                        </li>
                        <li>
                            <NavLink to="/categories" className="text-white text-lg ">Categories</NavLink>
                        </li>
                    </ul>}

                <div className="flex items-center space-x-4">
                    <FaFacebookF className="text-white text-xl hover:text-gray-300 cursor-pointer" />
                    <FaInstagram className="text-white text-xl hover:text-gray-300 cursor-pointer" />
                    <FaYoutube className="text-white text-xl hover:text-gray-300 cursor-pointer" />
                    <FaTwitter className="text-white text-xl hover:text-gray-300 cursor-pointer" />


                    {userData ?
                        <>
                            <li className="text-white text-lg cursor-pointer list-none " onClick={() => Logout()} >Logout</li>
                            <li className='list-none text-main relative'>
                                <NavLink to="cart" className="relative"> <i className="fa-solid fa-cart-shopping fa-xl text-black "><span className='text-white absolute top-[-2px] left-[10px] text-xs font-thin'>{cartItems?.numOfCartItems}</span></i>

                                </NavLink>

                            </li>

                        </>

                        :
                        <>
                            <NavLink to="/register" className="text-white text-lg ">Register</NavLink>
                            <NavLink to="/login" className="text-white text-lg " >Login</NavLink>
                        </>
                    }
 
                </div>
            </nav >
        </>

    );
};

export default NavBar;
