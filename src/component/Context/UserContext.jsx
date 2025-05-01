/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export let UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // حالة لتخزين صلاحيات الأدمن

    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userPassword");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        localStorage.removeItem("email");
        setUserData(null);
        setIsAdmin(false);
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");
        const storedRole = localStorage.getItem("userRole"); // ✅ جِبنا الدور من التخزين
        const storedUsername = localStorage.getItem("username"); // ✅ جِبنا الدور من التخزين
        

        if (storedToken) {
            try {
                setUserData({ token: storedToken, role: storedRole, username: storedUsername });

                // ✅ نحدث حالة الأدمن بناءً على الدور المخزن
                if (storedRole === "admin") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Error reading user data:", error);
                setUserData(null);
                setIsAdmin(false);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ userData, isAdmin, setUserData, logout }}>
            {children}
        </UserContext.Provider>
    );
}