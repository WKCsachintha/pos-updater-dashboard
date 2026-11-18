import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

/**
 * Persist auth session to sessionStorage.
 * Keys: pos_token, pos_user, pos_permissions
 */
function loadSession() {
  try {
    const token = sessionStorage.getItem("pos_token");
    const user = JSON.parse(sessionStorage.getItem("pos_user") || "null");
    const permissions = JSON.parse(sessionStorage.getItem("pos_permissions") || "null");
    if (token && user) return { token, user, permissions: permissions || [] };
  } catch (_) {}
  return null;
}

function saveSession({ token, user, permissions }) {
  sessionStorage.setItem("pos_token", token);
  sessionStorage.setItem("pos_user", JSON.stringify(user));
  sessionStorage.setItem("pos_permissions", JSON.stringify(permissions || []));
}

function clearSession() {
  sessionStorage.removeItem("pos_token");
  sessionStorage.removeItem("pos_user");
  sessionStorage.removeItem("pos_permissions");
  // Also clear the old key if it exists
  sessionStorage.removeItem("pos_auth");
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());

  const login = useCallback(({ token, user, permissions }) => {
    const sess = { token, user, permissions: permissions || [] };
    saveSession(sess);
    setSession(sess);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const isAuthenticated = Boolean(session?.token && session?.user);

  /**
   * Check whether the current user has a given permission string.
   * user_type === 1  → Super Admin → all permissions granted.
   */
  const hasPermission = useCallback(
    (permission) => {
      if (!session) return false;
      if (session.user?.user_type === 1) return true;
      return (session.permissions || []).includes(permission);
    },
    [session]
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        permissions: session?.permissions || [],
        isAuthenticated,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;

