import { useMemo, useState, useEffect } from "react";
import StatusPill from "./StatusPill";
import axios from "axios";

export default function UpdateLogs({ onViewError }) {
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Server එකෙන් Update Logs ලබා ගැනීම
  const fetchUpdateLogs = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      // ඔබේ PHP API එකේ Logs ලබා දෙන Action එක (උදා: action=get_update_logs)
      const response = await axios.get(`${API_URL}?action=get_update_logs`);
      
      if (response.data) {
        setLogsData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching update logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdateLogs();
  }, []);

  const filtered = useMemo(() => {
    return logsData.filter((r) => {
      const companyMatch = r.company.toLowerCase().includes(company.toLowerCase());
      const statusMatch = status === "All Statuses" || r.status === status;
      return companyMatch && statusMatch;
    });
  }, [logsData, company, status]);

  return (
    <section className="space-y-5 fade-in">
      <div className="bg-card border border-line rounded-lg p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Search company…"
          className="flex-1 min-w-[180px] bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <input type="date" className="bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent" />
        <span className="text-slate-600 text-sm">to</span>
        <input type="date" className="bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent">
          <option>All Statuses</option>
          <option>SUCCESS</option>
          <option>PENDING</option>
          <option>FAILED</option>
        </select>
      </div>

      <div className="bg-card border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-slate-500 border-b border-line uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Company / Branch</th>
              <th className="px-5 py-3 font-medium">Machine ID</th>
              <th className="px-5 py-3 font-medium">Previous → Installed</th>
              <th className="px-5 py-3 font-medium">Updated Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">Loading update logs from server...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">No update logs found.</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.machineId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-slate-200">{r.company}</p>
                    <p className="text-[11px] text-slate-500">{r.branch}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{r.machineId}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">
                    {r.installed === r.latest ? "—" : r.installed} → <span className="text-slate-200">{r.latest}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{r.updatedAt}</td>
                  <td className="px-5 py-3.5"><StatusPill status={r.status} /></td>
                  <td className="px-5 py-3.5">
                    {r.status === "FAILED" ? (
                      <button onClick={() => onViewError(r)} className="text-xs text-accent hover:text-blue-300 font-medium">View log</button>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
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