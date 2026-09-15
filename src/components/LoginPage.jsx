import { useState } from "react";

export default function LoginPage({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (password === "1234") {
      onLoginSuccess(); // Login සාර්ථක නම් App එකට දැනුම් දීම
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-body text-slate-200">
      <div className="bg-card border border-line rounded-xl p-8 w-full max-w-md shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center mx-auto text-accent">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-white text-xl">UpdateHub Login</h1>
          <p className="text-xs text-slate-400">POS Deployment Console Security</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Access Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password (e.g. 2026)"
              className="w-full bg-base border border-line rounded-md px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {error && (
              <p className="text-[11px] text-red-400 mt-1">Invalid password! Please try again (Password hint is 2026).</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-accent hover:bg-accentdeep text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-accent/20"
          >
            Authenticate & Enter
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500 font-mono">Secure POS Management Gateway v1.0</p>
        </div>
      </div>
    </div>
  );
}