import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from "axios"

import App from './App.jsx'
import './index.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://tala-store.vercel.app"

// Set token from localStorage if it exists
const token = localStorage.getItem("token")
if (token) {
  axios.defaults.headers.common["token"] = token
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
