import PropTypes from 'prop-types';

export function Button({ children, variant = "default", className = "", ...props }) {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  
    const variantStyles = {
      default: "bg-pink-500 text-white hover:bg-pink-600",
      outline: "border border-pink-200 bg-transparent hover:bg-pink-100 text-pink-700",
      link: "underline-offset-4 hover:underline text-pink-500 hover:text-pink-700 p-0 h-auto",
    }
  
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`
  
    return (
      <button className={combinedClassName} {...props}>
        {children}
      </button>
    )
  }

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "outline", "link"]),
  className: PropTypes.string,
};
  
  