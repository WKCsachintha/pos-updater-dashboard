import { useMemo, useState, useEffect } from "react";
import StatusPill from "./StatusPill";
import axios from "axios";

// Backend API URL
const API_BASE = "http://demo.onlineserp.com/serp/app/integration/poss_new/exe_realese.php";

export default function UpdateLogs({ onViewError }) {
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Server එකෙන් Update Logs ලබා ගැනීම
  const fetchUpdateLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}?action=get_update_logs`);
      
      if (response.data && response.data.status === "success") {
        setLogsData(response.data.data || []);
      } else {
        setLogsData([]);
      }
    } catch (error) {
      console.error("Error fetching update logs:", error);
      setLogsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdateLogs();
  }, []);

  // Filter Logic (Company, Status, Date)
  const filtered = useMemo(() => {
    return logsData.filter((r) => {
      const companyName = r.company ? r.company.toLowerCase() : "";
      const companyMatch = companyName.includes(company.toLowerCase());
      const statusMatch = status === "All Statuses" || r.status === status;

      let dateMatch = true;
      if (r.updatedAt) {
        const logDate = r.updatedAt.split(" ")[0]; // YYYY-MM-DD කොටස ගැනීම
        if (startDate && logDate < startDate) dateMatch = false;
        if (endDate && logDate > endDate) dateMatch = false;
      }

      return companyMatch && statusMatch && dateMatch;
    });
  }, [logsData, company, status, startDate, endDate]);

  return (
    <section className="space-y-5 fade-in">
      {/* Filters Bar */}
      <div className="bg-card border border-line rounded-lg p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Search company…"
          className="flex-1 min-w-[180px] bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <span className="text-slate-600 text-sm">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option>All Statuses</option>
          <option>SUCCESS</option>
          <option>PENDING</option>
          <option>FAILED</option>
        </select>
        <button
          onClick={fetchUpdateLogs}
          className="px-3 py-2 text-xs bg-base border border-line hover:border-accent text-slate-300 hover:text-white rounded-md transition-colors"
        >
          Refresh Logs
        </button>
      </div>

      {/* Table */}
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
                <td colSpan="6" className="text-center py-8 text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    Loading update logs from server...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">No update logs found.</td>
              </tr>
            ) : (
              filtered.map((r, index) => (
                <tr key={r.logId || index} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-slate-200 font-medium">{r.company}</p>
                    <p className="text-[11px] font-mono text-slate-500">Branch #{r.branch}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{r.machineId || "N/A"}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">
                    <span className="text-slate-500">v{r.previous || "1.0.0"}</span> → <span className="text-accent font-semibold">v{r.installed}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{r.updatedAt}</td>
                  <td className="px-5 py-3.5"><StatusPill status={r.status} /></td>
                  <td className="px-5 py-3.5">
                    {r.status === "FAILED" ? (
                      <button onClick={() => onViewError(r)} className="text-xs text-red-400 hover:underline font-medium">
                        View Error
                      </button>
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