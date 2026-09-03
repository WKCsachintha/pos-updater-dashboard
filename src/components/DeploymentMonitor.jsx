import { useMemo, useState, useEffect } from "react";
import StatusPill from "./StatusPill";
import axios from 'axios';

const TABS = [
  { key: "all", label: "All Clients" },
  { key: "success", label: "✅ Fully Updated" },
  { key: "pending", label: "⏳ Pending Update" },
  { key: "failed", label: "❌ Failed Updates" },
];

export default function DeploymentMonitor({ onViewError }) {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]); // API එකෙන් එන දත්ත තබා ගැනීමට
  const [loading, setLoading] = useState(true);

  // API එකෙන් දත්ත ලබා ගැනීම (Fetch Deployments / Logs)
  const fetchDeployments = async () => {
    setLoading(true);
    try {
      // මෙතැනට ඔබේ Server එකේ ලැයිස්තුව ලබාදෙන API Endpoint එක දෙන්න
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${API_URL}?action=get_deployments`); 
      
      // Server එකෙන් එන format එක අනුව මෙය වෙනස් විය හැක
      setData(response.data.data || []); 
    } catch (error) {
      console.error("Error fetching deployments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  const counts = useMemo(
    () => ({
      all: data.length,
      success: data.filter((r) => r.status === "SUCCESS").length,
      pending: data.filter((r) => r.status === "PENDING").length,
      failed: data.filter((r) => r.status === "FAILED").length,
    }),
    [data]
  );

  const rows = useMemo(() => {
    if (filter === "all") return data;
    const map = { success: "SUCCESS", pending: "PENDING", failed: "FAILED" };
    return data.filter((r) => r.status === map[filter]);
  }, [data, filter]);

  return (
    <section className="space-y-5 fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm border transition-colors ${
                filter === tab.key ? "bg-accent text-white border-accent" : "bg-card text-slate-300 border-line hover:border-accent/40"
              }`}
            >
              {tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded ${filter === tab.key ? "bg-white/20" : "bg-line"}`}>{counts[tab.key]}</span>
            </button>
          ))}
        </div>
        
        {/* Refresh Button එකට අපේ fetchDeployments פונקცია එක සම්බන්ධ කළා */}
        <button 
          onClick={fetchDeployments}
          className="text-xs text-slate-400 hover:text-white border border-line px-3 py-2 rounded-md flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="bg-card border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-slate-500 border-b border-line uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Branch</th>
              <th className="px-5 py-3 font-medium">Machine ID</th>
              <th className="px-5 py-3 font-medium">Installed Version</th>
              <th className="px-5 py-3 font-medium">Last Updated</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-400">Loading live data from server...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-400">No records found.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.machineId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-slate-200">{r.company}</td>
                  <td className="px-5 py-3.5 text-slate-400">{r.branch}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{r.machineId}</td>
                  <td className={`px-5 py-3.5 font-mono text-xs ${r.installed === r.latest ? "text-slate-300" : "text-warn"}`}>{r.installed}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{r.updatedAt}</td>
                  <td className="px-5 py-3.5"><StatusPill status={r.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    {r.status === "FAILED" ? (
                      <button onClick={() => onViewError(r)} className="text-xs text-bad hover:text-red-300 font-medium">View Error</button>
                    ) : (
                      <button className="text-xs text-slate-500 hover:text-white">Force Push</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}