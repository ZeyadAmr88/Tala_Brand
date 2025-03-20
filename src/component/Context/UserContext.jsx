import { createContext, useState, useEffect } from "react";

export let UserContext = createContext();

// eslint-disable-next-line react/prop-types
export default function UserContextProvider({ children }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");
        if (storedToken) {
            setUserData(storedToken); 
        }
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}
