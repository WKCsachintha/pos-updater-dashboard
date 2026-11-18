import { useState } from "react";
import ThemeToggle from "../components/common/ThemeToggle";
import Button from "../components/common/Button";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ─── Eye Icons ─────────────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOff = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

// ─── Alert variants ─────────────────────────────────────────────────────────
function Alert({ type = "error", message }) {
  const styles = {
    error: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  };
  const icons = {
    error: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
    success: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-medium ${styles[type]}`}>
      {icons[type]}
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}

// ─── Input Field ────────────────────────────────────────────────────────────
function InputField({ label, id, type = "text", value, onChange, placeholder, required, autoFocus, icon, rightSlot, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-heading mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          className={`w-full bg-base border border-line rounded-xl ${icon ? "pl-10" : "pl-4"} ${rightSlot ? "pr-10" : "pr-4"} py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-150`}
        />
        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted mt-1.5">{hint}</p>}
    </div>
  );
}

// ─── Main LoginPage ──────────────────────────────────────────────────────────
export default function LoginPage({ onSwitchToSignup }) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type, message }

  async function handleLogin(e) {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const res = await authApi.login({ username: username.trim(), password });

      if (res.status === "success") {
        // Store full session via AuthContext
        login({
          token: res.token,
          user: res.user,
          permissions: res.permissions || [],
        });
        // Parent (App.jsx) re-renders because isAuthenticated flips to true
      } else {
        // Map known server messages to appropriate alert types
        const msg = res.message || "Login failed. Please try again.";
        const isInactive = msg.toLowerCase().includes("not active");
        setAlert({ type: isInactive ? "warning" : "error", message: msg });
      }
    } catch (err) {
      console.error("Login error:", err);
      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Unable to connect to the server. Please check your network.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base font-body text-bodytext p-4 relative transition-colors duration-200">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top-right theme toggle */}
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle showLabel />
      </div>

      <div className="relative bg-card border border-line rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-7 fade-in">
        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-tr from-accent to-blue-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-accent/25">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-heading text-2xl tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-muted mt-1">
              Sign in to the UpdateHub POS Deployment Console
            </p>
          </div>
        </div>

        {/* Alert message */}
        {alert && <Alert type={alert.type} message={alert.message} />}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            id="username"
            label="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setAlert(null); }}
            placeholder="Enter your username"
            required
            autoFocus
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
          />

          <InputField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAlert(null); }}
            placeholder="Enter your password"
            required
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted hover:text-heading transition-colors cursor-pointer p-0.5"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            }
          />

          <Button type="submit" size="lg" loading={loading} className="w-full mt-2 !py-3">
            {loading ? "Authenticating..." : "Sign In to Console"}
          </Button>
        </form>

        {/* Switch to Sign Up */}
        <div className="text-center space-y-3 pt-1 border-t border-line">
          <p className="text-xs text-muted">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-accent font-semibold hover:underline underline-offset-2 cursor-pointer"
            >
              Request Access
            </button>
          </p>
          <p className="text-[10px] text-muted/70 font-mono">
            UpdateHub Console • Enterprise POS Deployment
          </p>
        </div>
      </div>
    </div>
  );
}
