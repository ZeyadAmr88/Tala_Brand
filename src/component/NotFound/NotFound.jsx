
import { Heart, Home, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="w-full max-w-md p-8 mx-auto text-center">
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-pink-200">404</h1>
          <div className="absolute -top-4 right-4 animate-bounce">
            <Heart className="h-12 w-12 text-pink-400" fill="#f472b6" />
          </div>
        </div>

        <h2 className="mt-8 text-3xl font-bold text-pink-700">Page Not Found</h2>

        <p className="mt-4 text-pink-600">Oops! The page you&apos;re looking for seems to have wandered off.</p>

        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-pink-300 hover:bg-pink-100 text-pink-700 font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        <div className="mt-12 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-pink-300 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
