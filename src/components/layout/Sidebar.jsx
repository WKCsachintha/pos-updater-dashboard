import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

const NAV_GROUPS = [
  {
    group: "Overview",
    items: [
      {
        key: "overview",
        label: "Dashboard",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13h4v8H3v-8Zm7-7h4v15h-4V6Zm7 4h4v11h-4V10Z"
          />
        ),
      },
    ],
  },
  {
    group: "Release Management",
    items: [
      {
        key: "release",
        label: "Release Manager",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v13m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          />
        ),
      },
      {
        key: "publish",
        label: "Target Release",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        ),
      },
    ],
  },
  {
    group: "Fleet Monitoring",
    items: [
      {
        key: "monitor",
        label: "Deployment Monitor",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z"
          />
        ),
      },
      {
        key: "logs",
        label: "Update Logs",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 4h11M9 12h11M9 20h11M4 4h.01M4 12h.01M4 20h.01"
          />
        ),
      },
    ],
  },
  {
    group: "System Configuration",
    items: [
      {
        key: "master_settings",
        label: "Master Settings",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        ),
      },
    ],
  },
];

export default function Sidebar({ view, setView, onLogout }) {
  const { user } = useAuth();

  // Derive initials from full_name (e.g. "Dinesh Hashan" → "DH")
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("")
    : "?";

  // Role label based on user_type
  const roleLabel = user?.user_type === 1 ? "Super Admin" : "Operator";

  // Display name: first + last initial
  const displayName = user?.full_name
    ? user.full_name.split(" ").slice(0, 2).join(" ")
    : user?.username ?? "Unknown";
  return (
    <aside className="w-64 bg-sidebar border-r border-line fixed inset-y-0 left-0 flex flex-col z-40 transition-colors duration-200 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-line shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center font-display font-bold text-base text-white shadow-md shadow-accent/25">
            U
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-heading text-[15px] tracking-tight">
                UpdateHub
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-muted -mt-0.5 font-medium">
              POS Deployment Console
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-4 overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted/80 mb-1.5">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = view === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setView(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-accent/10 dark:bg-accent/15 text-accent font-semibold shadow-xs border border-accent/25"
                        : "text-muted hover:text-heading hover:bg-cardhover"
                    }`}
                  >
                    <svg
                      className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive ? "text-accent" : "text-muted"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      viewBox="0 0 24 24"
                    >
                      {item.icon}
                    </svg>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer Section */}
      <div className="p-3.5 border-t border-line space-y-3 bg-base/40">
        {/* Quick Theme Toggle Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-line">
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-medium text-heading">Theme</span>
          </div>
          <ThemeToggle />
        </div>

        {/* User Profile Card with Logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-line">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0">
              {initials}
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-xs font-semibold text-heading truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-muted truncate">{roleLabel}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log out of console"
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

