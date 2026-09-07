import { useMemo, useState, useEffect } from "react";
import StatusPill from "./StatusPill";
import axios from 'axios';

const TABS = [
  { key: "all", label: "All Clients" },
  { key: "success", label: "✅ Fully Updated" },
  { key: "pending", label: "⏳ Pending Update" },
  { key: "failed", label: "❌ Failed Updates" },
];

// Backend API URL
const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

export default function DeploymentMonitor({ onViewError }) {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // API එකෙන් Deployments Fetch කරගැනීම
  const fetchDeployments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}?action=get_deployments`);
      
      if (response.data && response.data.status === "success") {
        setData(response.data.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching deployments:", error);
      setData([]);
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
              <span className={`text-[11px] px-1.5 py-0.5 rounded ${filter === tab.key ? "bg-white/20" : "bg-line"}`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
        
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
              <th className="px-5 py-3 font-medium">Branch Index</th>
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
                <td colSpan="7" className="text-center py-6 text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    Loading live telemetry data...
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-400">No telemetry logs found from POS clients.</td>
              </tr>
            ) : (
              rows.map((r, index) => (
                <tr key={r.machineId || index} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-slate-200 font-medium">{r.company}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono">Branch #{r.branch}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{r.machineId || "N/A"}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-accent">v{r.installed}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{r.updatedAt}</td>
                  <td className="px-5 py-3.5"><StatusPill status={r.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    {r.status === "FAILED" ? (
                      <button onClick={() => onViewError(r)} className="text-xs text-red-400 hover:underline font-medium">
                        View Error
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">Active</span>
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