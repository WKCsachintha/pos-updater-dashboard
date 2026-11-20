export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-card border border-line rounded-xl shadow-xs transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

