import { useMemo, useState, useEffect } from "react";
import StatusPill from "../components/common/StatusPill";
import Button from "../components/common/Button";
import { logsApi } from "../services/api";

export default function UpdateLogsPage({ onViewError }) {
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdateLogs = async () => {
    setLoading(true);
    try {
      const response = await logsApi.getUpdateLogs();
      if (response && response.status === "success") {
        setLogsData(response.data || []);
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

  // Filter Logic (Company, Status, Date range)
  const filtered = useMemo(() => {
    return logsData.filter((r) => {
      const companyName = r.company ? r.company.toLowerCase() : "";
      const companyMatch = companyName.includes(company.toLowerCase());
      const statusMatch = status === "All Statuses" || r.status === status;

      let dateMatch = true;
      if (r.updatedAt) {
        const logDate = r.updatedAt.split(" ")[0]; // YYYY-MM-DD
        if (startDate && logDate < startDate) dateMatch = false;
        if (endDate && logDate > endDate) dateMatch = false;
      }

      return companyMatch && statusMatch && dateMatch;
    });
  }, [logsData, company, status, startDate, endDate]);

  return (
    <section className="space-y-6 fade-in">
      {/* Filters Bar */}
      <div className="bg-card border border-line rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Search company…"
            className="w-full bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-base border border-line rounded-xl px-3 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <span className="text-muted text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-base border border-line rounded-xl px-3 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-base border border-line rounded-xl px-3.5 py-2 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option>All Statuses</option>
          <option>SUCCESS</option>
          <option>PENDING</option>
          <option>FAILED</option>
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUpdateLogs}
          disabled={loading}
          icon={
            <svg
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          }
        >
          {loading ? "Refreshing..." : "Refresh Logs"}
        </Button>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-line rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-line uppercase tracking-wider bg-base/40">
                <th className="px-5 py-3.5 font-semibold">Company / Branch</th>
                <th className="px-5 py-3.5 font-semibold">Machine ID</th>
                <th className="px-5 py-3.5 font-semibold">Previous → Installed</th>
                <th className="px-5 py-3.5 font-semibold">Audit Timestamp</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      Loading historical update logs from server...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-muted">
                    No historical update logs found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, index) => (
                  <tr
                    key={r.logId || index}
                    className="hover:bg-cardhover/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-heading font-medium">{r.company}</p>
                      <p className="text-[11px] font-mono text-muted">
                        Branch #{r.branch}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-heading font-semibold">
                      {r.machineId || "N/A"}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs">
                      <span className="text-muted">v{r.previous || "1.0.0"}</span>{" "}
                      <span className="text-muted/60 px-1">→</span>{" "}
                      <span className="text-accent font-bold">v{r.installed}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted font-mono text-xs">
                      {r.updatedAt}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {r.status === "FAILED" ? (
                        <button
                          onClick={() => onViewError(r)}
                          className="text-xs text-red-500 hover:text-red-600 hover:underline font-semibold cursor-pointer"
                        >
                          View Error
                        </button>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

