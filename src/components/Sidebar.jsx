

const NAV_ITEMS = [
  { group: "Overview", items: [{ key: "overview", label: "Dashboard", icon: "M3 13h4v8H3v-8Zm7-7h4v15h-4V6Zm7 4h4v11h-4V10Z" }] },
  { 
    group: "Releases", 
    items: [
      { key: "release", label: "Release Manager", icon: "M12 3v13m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" },
      { key: "publish", label: "Target Release", icon: "M12 4v16m8-8H4" } // Navigation Item
    ] 
  },
  {
    group: "Fleet",
    items: [
      { key: "monitor", label: "Deployment Monitor", icon: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z" },
      { key: "logs", label: "Update Logs", icon: "M9 4h11M9 12h11M9 20h11M4 4h.01M4 12h.01M4 20h.01" },
    ],
  },
];

export default function Sidebar({ view, setView }) {
  return (
    <aside className="w-64 bg-sidebar border-r border-line fixed inset-y-0 left-0 flex flex-col z-40">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-line shrink-0">
        <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center font-display font-bold text-sm text-white">U</div>
        <div className="leading-tight">
          <p className="font-display font-semibold text-white text-[15px]">UpdateHub</p>
          <p className="text-[11px] text-slate-500 -mt-0.5">POS Deployment Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            <p className="px-3 text-[11px] font-medium text-slate-500 mt-5 first:mt-0 mb-2 tracking-wide">{group.group}</p>
            {group.items.map((item) => (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-r-md rounded-l-sm border-l-2 text-sm transition-colors ${
                  view === item.key
                    ? "border-accent bg-accent/12 text-white"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className={`w-[18px] h-[18px] ${view === item.key ? "text-blue-400" : "text-slate-500"}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-line">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          System Settings
        </button>
      </div>
    </aside>
  );
}