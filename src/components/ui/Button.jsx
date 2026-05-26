const variants = {
  primary: "bg-app-accent text-white hover:bg-app-accentHover border-app-accent",
  secondary: "bg-app-surface text-app-text hover:border-app-accent hover:text-white border-app-border",
  danger: "bg-transparent text-app-danger hover:bg-app-danger/10 border-app-danger/40",
  ghost: "bg-transparent text-app-muted hover:text-white hover:bg-white/5 border-transparent"
};

export default function Button({ children, className = "", variant = "secondary", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
