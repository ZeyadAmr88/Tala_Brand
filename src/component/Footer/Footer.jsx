import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
    return (
        <>
            <footer className="w-full py-6 bg-[#ff42a0] border-t border-pink-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center">
                        <p className="text-white mb-4">Connect with us</p>
                        <div className="flex space-x-6">
                            <a href="https://www.tiktok.com/@talabrand1?_t=ZS-8vVFvZN2UBb&_r=1" target="_blank" className="text-white hover:text-pink-700 transition-colors duration-200">
                                <FaTiktok className="h-6 w-6" />
                                <span className="sr-only">TikTok</span>
                            </a>
                            <a href="https://www.facebook.com/share/g/12BquFaLb62/?mibextid=wwXIfr" target="_blank" className="text-white hover:text-pink-700 transition-colors duration-200">
                                <FaFacebook className="h-6 w-6" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="https://www.instagram.com/talafashionstyel/?igsh=djVmNnRncHhsbW5z&utm_source=qr#" target="_blank" className="text-white hover:text-pink-700 transition-colors duration-200">
                                <FaInstagram className="h-6 w-6" />
                                <span className="sr-only">Instagram</span>
                            </a>


                        </div>
                        <p className="mt-6 text-sm text-white">
                            © {new Date().getFullYear()} Tala Brand. All rights reserved. 
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}
