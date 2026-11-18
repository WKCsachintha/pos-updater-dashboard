export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-accent hover:bg-accentdeep text-white shadow-sm shadow-accent/20 focus:ring-accent",
    secondary:
      "bg-card hover:bg-cardhover text-heading border border-line focus:ring-accent/50",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20 focus:ring-red-500",
    outline:
      "border border-line bg-transparent hover:bg-card text-heading focus:ring-accent/50",
    ghost:
      "bg-transparent hover:bg-card text-muted hover:text-heading focus:ring-accent/40",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}

