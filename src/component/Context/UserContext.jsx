/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export let UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // ✅ حالة لتخزين صلاحيات الأدمن

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");

        if (storedToken) {
            try {
                const decodedUser = jwtDecode(storedToken); // ✅ فك تشفير التوكن
                console.log("Decoded User Data:", decodedUser); // 🔍 طباعة البيانات لرؤية الحقول المتاحة

                setUserData(decodedUser);

                // ✅ التحقق مما إذا كان المستخدم Admin (حسب الحقول المتاحة)
                if (decodedUser.role === "admin" || decodedUser.isAdmin === true) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Invalid token:", error);
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
