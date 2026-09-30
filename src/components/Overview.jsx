import { useMemo, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

export default function Overview({ versions, onOpenActiveDetails, setView }) {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ updated: 0, pending: 0, failed: 0, total: 0, pct: 0 });
  const [loading, setLoading] = useState(true);

  // Dashboard Live Stats & Dynamic Categories Fetch කිරීම
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}?action=get_dashboard_stats`);
      if (response.data && response.data.status === "success") {
        setCategories(response.data.categories || []);
        setStats(response.data.stats || { updated: 0, pending: 0, failed: 0, total: 0, pct: 0 });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }

  // Active වී ඇති Categories ගණන
  const activeSystemsCount = useMemo(() => {
    const activeCats = new Set();
    versions.forEach((v) => {
      if (v.systemType) {
        activeCats.add(v.systemType);
      }
    });
    return activeCats.size;
  }, [versions]);

  // Category අනුව Active Version එක සෙවීම
  const latestCategoryVersions = useMemo(() => {
    return categories.map((category) => {
      const match = versions.find((v) => v.systemType === category);
      return {
        category,
        versionNumber: match ? match.versionNumber : "N/A",
        status: match ? "Active" : "Inactive",
      };
    });
  }, [versions, categories]);

  // Donut Chart Degrees
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
                {activeSystemsCount} <span className="text-sm font-normal text-slate-400">/ {categories.length}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-md bg-accent/15 flex items-center justify-center text-accent">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0C20.25 4.097 16.556 2.25 12 2.25S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
              </svg>
            </div>
          </div>
        </button>

        {/* 2. Fully Updated Terminals */}
        <div className="bg-card border border-line rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Fully Updated Terminals</p>
              <p className="font-display text-3xl font-semibold text-white mt-2">
                {stats.updated} <span className="text-sm font-normal text-slate-400">/ {stats.total}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-md bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Overall Terminals on latest builds ({stats.pct}%)</p>
        </div>

        {/* 3. Pending / Outdated */}
        <div className="bg-card border border-line rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Pending / Outdated</p>
              <p className="font-display text-3xl font-semibold text-white mt-2">{stats.pending}</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-amber-500/15 flex items-center justify-center text-amber-400">
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
            <div className="w-9 h-9 rounded-md bg-red-500/15 flex items-center justify-center text-red-400">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Needs attention today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Rollout Status Modern Glowing 3D Donut Chart Section */}
        <div className="xl:col-span-2 bg-card/80 backdrop-blur-md border border-line rounded-xl p-6 shadow-2xl relative overflow-hidden group">
          
          {/* Ambient Background Glow Effect */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-accent/15 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/25 transition-all duration-700" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="font-display font-semibold text-white text-base tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Overall Rollout Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Deployment breakdown across all {stats.total} Terminals</p>
            </div>
            <div className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {stats.pct}% Success
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4 relative z-10">
            
            {/* Glowing 3D Donut Ring */}
            <div className="relative flex items-center justify-center shrink-0">
              {/* Outer Layer Subtle Glow Ring */}
              <div className="absolute w-48 h-48 rounded-full border border-slate-700/50 bg-slate-900/40 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-sm" />
              
              {/* Dynamic Conic Gradient Slice Ring */}
              <div
                className="w-44 h-44 rounded-full transition-all duration-700 p-2"
                style={{
                  background: stats.total > 0 
                    ? `conic-gradient(#10b981 0deg ${updatedDeg}deg, #f59e0b ${updatedDeg}deg ${pendingDeg}deg, #ef4444 ${pendingDeg}deg 360deg)`
                    : '#1e293b',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Inner Cutout with Depth & Metallic Shadow */}
                <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center border border-slate-800/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] relative">
                  <span className="font-display text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
                    {stats.pct}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Completed</span>
                </div>
              </div>
            </div>

            {/* Futuristic Status Legend Cards */}
            <div className="space-y-3 text-xs w-full max-w-[240px]">
              {/* Updated Status */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] group/card">
                <span className="flex items-center gap-2.5 text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  Updated
                </span>
                <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  {stats.updated}
                </span>
              </div>

              {/* Pending Status */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] group/card">
                <span className="flex items-center gap-2.5 text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                  Pending
                </span>
                <span className="font-mono text-amber-400 font-bold text-sm bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                  {stats.pending}
                </span>
              </div>

              {/* Failed Status */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] group/card">
                <span className="flex items-center gap-2.5 text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  Failed
                </span>
                <span className="font-mono text-red-400 font-bold text-sm bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
                  {stats.failed}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* System Category Active Versions Card */}
        <div className="bg-card border border-line rounded-lg p-5">
          <h3 className="font-display font-semibold text-white text-sm mb-4">Active System Versions</h3>
          <div className="space-y-3">
            {categories.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No categories registered in Master Settings.</p>
            ) : (
              latestCategoryVersions.map((item) => (
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
              ))
            )}
          </div>
          <button onClick={() => setView("publish")} className="w-full mt-4 text-xs text-accent hover:text-white font-medium text-left">
            Publish a target release →
          </button>
        </div>
      </div>
    </section>
  );
}