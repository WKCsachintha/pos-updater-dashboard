import { useMemo } from "react";

// System Categories List
const APP_CATEGORIES = [
  "Supermarket POS",
  "Restaurant POS",
  "Windows Service",
  "Backoffice",
  "Mobile POS",
];

export default function Overview({ versions, stats, onOpenActiveDetails, setView }) {
  const activeVersion = versions.find((v) => v.status === "Active");

  // System Categories 5න් දැනට Active වී ඇති Systems ගණන සෙවීම
  const activeSystemsCount = useMemo(() => {
    const activeCats = new Set();
    versions.forEach((v) => {
      if (v.status === "Active" && (v.systemType || v.category)) {
        activeCats.add(v.systemType || v.category);
      }
    });
    return activeCats.size;
  }, [versions]);

  // Category අනුව Active Versions සෙවීම
  const latestCategoryVersions = useMemo(() => {
    return APP_CATEGORIES.map((category) => {
      const match =
        versions.find(
          (v) => (v.systemType === category || v.category === category) && v.status === "Active"
        ) || versions.find((v) => v.systemType === category || v.category === category);

      return {
        category,
        versionNumber: match ? match.versionNumber : "N/A",
        status: match ? match.status : "Inactive",
      };
    });
  }, [versions]);

  // Pie Chart එක සඳහා Degrees ගණනය කිරීම
  const updatedPct = stats.total ? (stats.updated / stats.total) * 100 : 0;
  const pendingPct = stats.total ? (stats.pending / stats.total) * 100 : 0;
  
  const updatedDeg = (updatedPct / 100) * 360;
  const pendingDeg = updatedDeg + (pendingPct / 100) * 360;

  return (
    <section className="space-y-6 fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Active System Categories Count */}
        <button
          onClick={onOpenActiveDetails}
          className="text-left bg-card border border-line rounded-lg p-5 hover:border-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Active System Categories</p>
              <p className="font-display text-3xl font-semibold text-white mt-2">
                {activeSystemsCount} <span className="text-sm font-normal text-slate-400">/ {APP_CATEGORIES.length}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-md bg-accent/15 flex items-center justify-center text-accent">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0C20.25 4.097 16.556 2.25 12 2.25S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
              </svg>
            </div>
          </div>
          {/* <p className="text-xs text-accent mt-3 group-hover:underline">View details per system →</p> */}
        </button>

        {/* 2. Overall Fully Updated Branches */}
        <div className="bg-card border border-line rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Fully Updated Branches</p>
              <p className="font-display text-3xl font-semibold text-white mt-2">
                {stats.updated} <span className="text-sm font-normal text-slate-400">/ {stats.total}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-md bg-ok/15 flex items-center justify-center text-ok">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Overall branches on latest builds ({stats.pct}%)</p>
        </div>

        {/* 3. Pending / Outdated */}
        <div className="bg-card border border-line rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Pending / Outdated</p>
              <p className="font-display text-3xl font-semibold text-white mt-2">{stats.pending}</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-warn/15 flex items-center justify-center text-warn">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Behind the latest release</p>
        </div>

        {/* 4. Failed Updates */}
        <div className="bg-card border border-line rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Failed Updates</p>
              <p className="font-display text-3xl font-semibold text-white mt-2">{stats.failed}</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-bad/15 flex items-center justify-center text-bad">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Needs attention today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Rollout Status Donut Chart Section */}
        <div className="xl:col-span-2 bg-card border border-line rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-white text-base">
                Overall Rollout Status — All Systems
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Deployment breakdown across all {stats.total} branches</p>
            </div>
            <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-md font-semibold">
              {stats.pct}% Success
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
            <div className="relative flex items-center justify-center">
              <div
                className="w-40 h-40 rounded-full transition-all duration-500"
                style={{
                  background: `conic-gradient(#10b981 0deg ${updatedDeg}deg, #f59e0b ${updatedDeg}deg ${pendingDeg}deg, #ef4444 ${pendingDeg}deg 360deg)`,
                }}
              />
              <div className="absolute w-28 h-28 bg-card rounded-full flex flex-col items-center justify-center border border-line/50">
                <span className="font-display text-2xl font-bold text-white">{stats.pct}%</span>
                <span className="text-[10px] text-slate-500 font-medium">Completed</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs min-w-[200px]">
              <div className="flex items-center justify-between p-2 rounded bg-base/40 border border-line/30">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  Updated
                </span>
                <span className="font-mono text-white font-semibold">{stats.updated}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-base/40 border border-line/30">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                  Pending
                </span>
                <span className="font-mono text-white font-semibold">{stats.pending}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-base/40 border border-line/30">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
                  Failed
                </span>
                <span className="font-mono text-white font-semibold">{stats.failed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Category Active Versions Card */}
        <div className="bg-card border border-line rounded-lg p-5">
          <h3 className="font-display font-semibold text-white text-sm mb-4">Active System Versions</h3>
          <div className="space-y-3">
            {latestCategoryVersions.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-sm py-1 border-b border-line/40 last:border-0">
                <div>
                  <p className="text-slate-200 text-xs font-medium">{item.category}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {item.versionNumber !== "N/A" ? `v${item.versionNumber}` : "No Active Version"}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  item.status === "Active" 
                    ? "bg-accent/15 text-accent font-medium" 
                    : "bg-line text-slate-500"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => setView("publish")} className="w-full mt-4 text-xs text-accent hover:text-white font-medium text-left">
            Publish a target release →
          </button>
        </div>
      </div>
    </section>
  );
}