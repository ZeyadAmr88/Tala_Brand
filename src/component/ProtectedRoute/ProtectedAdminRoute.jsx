// src/ProtectedRoutes/ProtectedAdminRoute.jsx
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../Context/UserContext"

// eslint-disable-next-line react/prop-types
const ProtectedAdminRoute = ({ children }) => {
    const { userData } = useContext(UserContext)

    if (!userData || userData.role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedAdminRoute
