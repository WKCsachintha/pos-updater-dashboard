import { useState } from "react";
import ThemeToggle from "../components/common/ThemeToggle";
import Button from "../components/common/Button";
import { authApi } from "../services/api";

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

// ─── Alert Component ────────────────────────────────────────────────────────
function Alert({ type = "error", message }) {
  const styles = {
    error: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  };
  const icons = {
    error: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
    success: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs font-medium leading-relaxed ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

// ─── Reusable Input Field ───────────────────────────────────────────────────
function InputField({ label, id, type = "text", value, onChange, placeholder, required, autoFocus, icon, rightSlot, hint, error }) {
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
          className={`w-full bg-base border rounded-xl ${icon ? "pl-10" : "pl-4"} ${rightSlot ? "pr-10" : "pr-4"} py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:border-accent transition-all duration-150 ${
            error
              ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500"
              : "border-line focus:ring-accent/40"
          }`}
        />
        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted mt-1.5">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

// ─── Password Strength Indicator ────────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Lowercase", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special (@#!...)", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"][Math.min(passed, 4)];
  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-amber-400", "bg-lime-500", "bg-emerald-500"][Math.min(passed, 4)];

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= passed ? strengthColor : "bg-line"
            }`}
          />
        ))}
      </div>
      {/* Label + Checks */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className={`text-[10px] font-bold ${
          passed <= 1 ? "text-red-500" :
          passed === 2 ? "text-orange-500" :
          passed === 3 ? "text-amber-500" :
          passed >= 4 ? "text-emerald-500" : "text-muted"
        }`}>
          {strengthLabel}
        </span>
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-[10px] flex items-center gap-1 ${
              c.pass ? "text-emerald-600 dark:text-emerald-400" : "text-muted"
            }`}
          >
            {c.pass ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Signup Success State ────────────────────────────────────────────────────
function SignupSuccess({ fullName, onBackToLogin }) {
  return (
    <div className="text-center space-y-5 py-4 fade-in">
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div>
        <h2 className="font-display font-bold text-heading text-xl">Request Submitted!</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Hi <strong className="text-heading">{fullName}</strong>, your account request has been received.
          <br />
          A DB Admin will review and activate your account shortly.
        </p>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-600 dark:text-amber-400 text-left flex items-start gap-2.5">
        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <span>Your account is <strong>inactive</strong> until an Administrator activates it in the system. Contact your DB Admin to proceed.</span>
      </div>
      <Button variant="outline" size="md" className="w-full" onClick={onBackToLogin}>
        Back to Sign In
      </Button>
    </div>
  );
}

// ─── Main SignupPage ─────────────────────────────────────────────────────────
export default function SignupPage({ onSwitchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState({});

  function validateForm() {
    const errors = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters.";
    }

    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      errors.username = "Username must be 3–20 chars: lowercase letters, numbers, underscore only.";
    }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSignup(e) {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await authApi.signup({
        full_name: fullName.trim(),
        username: username.trim(),
        password,
      });

      if (res.status === "success") {
        setSubmitted(true);
      } else {
        setAlert({ type: "error", message: res.message || "Signup failed. Please try again." });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Unable to reach the server. Check your network.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base font-body text-bodytext p-4 relative transition-colors duration-200">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top-right theme toggle */}
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle showLabel />
      </div>

      <div className="relative bg-card border border-line rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6 fade-in">

        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-accent rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-heading text-2xl tracking-tight">
              Request Access
            </h1>
            <p className="text-xs text-muted mt-1">
              Create your UpdateHub console account
            </p>
          </div>
        </div>

        {/* Success state */}
        {submitted ? (
          <SignupSuccess fullName={fullName} onBackToLogin={onSwitchToLogin} />
        ) : (
          <>
            {/* Alert */}
            {alert && <Alert type={alert.type} message={alert.message} />}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <InputField
                id="full_name"
                label="Full Name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: null })); setAlert(null); }}
                placeholder="e.g. chavindu sachintha"
                required
                autoFocus
                error={fieldErrors.fullName}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                }
              />

              {/* Username */}
              <InputField
                id="username"
                label="Username"
                value={username}
                onChange={(e) => { setUsername(e.target.value.toLowerCase()); setFieldErrors((p) => ({ ...p, username: null })); setAlert(null); }}
                placeholder="e.g. chavindu_123"
                required
                error={fieldErrors.username}
                hint="Lowercase letters, numbers, underscore · 3–20 characters"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              {/* Password */}
              <div>
                <InputField
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: null })); setAlert(null); }}
                  placeholder="Create a strong password"
                  required
                  error={fieldErrors.password}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  }
                  rightSlot={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted hover:text-heading transition-colors cursor-pointer p-0.5" tabIndex={-1}>
                      {showPassword ? <EyeOff /> : <EyeOpen />}
                    </button>
                  }
                />
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <InputField
                id="confirm_password"
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: null })); }}
                placeholder="Re-enter your password"
                required
                error={fieldErrors.confirmPassword}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                }
                rightSlot={
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted hover:text-heading transition-colors cursor-pointer p-0.5" tabIndex={-1}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                }
              />

              {/* Info banner about admin activation */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-blue-600 dark:text-blue-400">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span>
                  After signup, your account must be <strong>activated by a DB Administrator</strong> before you can sign in.
                </span>
              </div>

              <Button type="submit" size="lg" loading={loading} className="w-full !py-3">
                {loading ? "Submitting Request..." : "Create Account"}
              </Button>
            </form>

            {/* Switch to Login */}
            <div className="text-center space-y-2 pt-1 border-t border-line">
              <p className="text-xs text-muted">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-accent font-semibold hover:underline underline-offset-2 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
              <p className="text-[10px] text-muted/70 font-mono">
                UpdateHub Console • Enterprise POS Deployment v2.4
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

