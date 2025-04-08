/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export let UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // حالة لتخزين صلاحيات الأدمن

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");
        const storedRole = localStorage.getItem("userRole"); // ✅ جِبنا الدور من التخزين

        if (storedToken) {
            try {
                setUserData({ token: storedToken, role: storedRole });

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
        <UserContext.Provider value={{ userData, isAdmin, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}
