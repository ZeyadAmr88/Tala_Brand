import { CartContext } from "../Context/CartContext.jsx"
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A reusable component to display when no products are found
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display (default: "No Products Found")
 * @param {string} props.message - Message to display
 * @param {string} props.highlightedText - Text to highlight within the message
 * @param {string} props.primaryButtonText - Text for the primary button
 * @param {string} props.primaryButtonLink - Link for the primary button
 * @param {string} props.secondaryButtonText - Text for the secondary button (optional)
 * @param {string} props.secondaryButtonLink - Link for the secondary button (optional)
 * @param {string} props.iconType - Type of icon to display (default: "smile", options: "smile", "box", "category", "cube")
 * @param {string} props.accentColor - Accent color for the component (default: "pink")
 */
const NoProductsFound = ({
  title = "No Products Found",
  message,
  highlightedText,
  primaryButtonText = "Reset Filters",
  primaryButtonLink = "/products",
  secondaryButtonText,
  secondaryButtonLink,
  iconType = "smile",
  accentColor = "pink"
}) => {
  // Define color classes based on accentColor prop
  const colorClasses = {
    pink: {
      bg: "bg-pink-500",
      hover: "hover:bg-pink-600",
      text: "text-pink-600",
      border: "border-pink-200",
      hoverBg: "hover:bg-pink-50",
      iconBg: "bg-pink-100",
      ring: "focus:ring-pink-500",
    },
    blue: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-200",
      hoverBg: "hover:bg-blue-50",
      iconBg: "bg-blue-100",
      ring: "focus:ring-blue-500",
    },
    purple: {
      bg: "bg-purple-500",
      hover: "hover:bg-purple-600",
      text: "text-purple-600",
      border: "border-purple-200",
      hoverBg: "hover:bg-purple-50",
      iconBg: "bg-purple-100",
      ring: "focus:ring-purple-500",
    },
    indigo: {
      bg: "bg-indigo-500",
      hover: "hover:bg-indigo-600",
      text: "text-indigo-600",
      border: "border-indigo-200",
      hoverBg: "hover:bg-indigo-50",
      iconBg: "bg-indigo-100",
      ring: "focus:ring-indigo-500",
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.pink;

  // Define icons based on iconType prop
  const icons = {
    smile: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    box: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    ),
    category: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    ),
    cube: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    )
  };

  // Primary button icon
  const primaryButtonIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  // Secondary button icon based on link
  const getSecondaryButtonIcon = () => {
    if (secondaryButtonLink?.includes('categor')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    } else if (secondaryButtonLink?.includes('dashboard')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    }
  };

  // Render the message with highlighted text if provided
  const renderMessage = () => {
    if (highlightedText) {
      return (
        <>
          {message.split(highlightedText)[0]}
          <span className={`font-semibold ${colors.text}`}>"{highlightedText}"</span>
          {message.split(highlightedText)[1]}
        </>
      );
    }
    return message;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 text-center max-w-md mx-auto border border-gray-100 animate-fadeIn">
      <div className="relative mb-6 mx-auto">
        <div className={`absolute inset-0 ${colors.iconBg} rounded-full opacity-30 animate-pulse`}></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-16 w-16 sm:h-20 sm:w-20 ${colors.text} mx-auto relative z-10 transform transition-transform duration-500 hover:scale-110`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icons[iconType] || icons.smile}
        </svg>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">{title}</h3>
      
      <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-xs mx-auto">
        {renderMessage()}
      </p>
      
      <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
        <Link
          to={primaryButtonLink}
          className={`px-5 py-2.5 ${colors.bg} text-white rounded-lg font-medium text-sm sm:text-base shadow-md ${colors.hover} transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center justify-center w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.ring}`}
        >
          {primaryButtonIcon}
          {primaryButtonText}
        </Link>
        
        {secondaryButtonText && secondaryButtonLink && (
          <Link
            to={secondaryButtonLink}
            className={`px-5 py-2.5 bg-white ${colors.text} border ${colors.border} rounded-lg font-medium text-sm sm:text-base ${colors.hoverBg} transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.ring}`}
          >
            {getSecondaryButtonIcon()}
            {secondaryButtonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NoProductsFound;
