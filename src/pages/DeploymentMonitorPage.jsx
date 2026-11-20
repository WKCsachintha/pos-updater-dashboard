// import { useMemo, useState, useEffect } from "react";
// import StatusPill from "../components/common/StatusPill";
// import Button from "../components/common/Button";
// import { deploymentApi } from "../services/api";

// const TABS = [
//   { key: "all", label: "All Clients" },
//   { key: "success", label: "✅ Fully Updated" },
//   { key: "pending", label: "⏳ Pending Update" },
//   { key: "failed", label: "❌ Failed Updates" },
// ];

// export default function DeploymentMonitorPage({ onViewError }) {
//   const [filter, setFilter] = useState("all");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDeployments = async () => {
//     setLoading(true);
//     try {
//       const response = await deploymentApi.getDeployments();
//       if (response && response.status === "success") {
//         setData(response.data || []);
//       } else {
//         setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching deployments:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeployments();
//   }, []);

//   const counts = useMemo(
//     () => ({
//       all: data.length,
//       success: data.filter((r) => r.status === "SUCCESS").length,
//       pending: data.filter((r) => r.status === "PENDING").length,
//       failed: data.filter((r) => r.status === "FAILED").length,
//     }),
//     [data]
//   );

//   //chavi

//   const rows = useMemo(() => {
//     if (filter === "all") return data;
//     const map = { success: "SUCCESS", pending: "PENDING", failed: "FAILED" };
//     return data.filter((r) => r.status === map[filter]);
//   }, [data, filter]);

//   return (
//     <section className="space-y-6 fade-in">
//       {/* Top Filter and Controls Bar */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex flex-wrap items-center gap-2">
//           {TABS.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setFilter(tab.key)}
//               className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer ${
//                 filter === tab.key
//                   ? "bg-accent text-white border-accent shadow-xs"
//                   : "bg-card text-muted border-line hover:border-accent/40 hover:text-heading"
//               }`}
//             >
//               <span>{tab.label}</span>
//               <span
//                 className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
//                   filter === tab.key
//                     ? "bg-white/20 text-white"
//                     : "bg-base text-muted"
//                 }`}
//               >
//                 {counts[tab.key]}
//               </span>
//             </button>
//           ))}
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={fetchDeployments}
//           disabled={loading}
//           icon={
//             <svg
//               className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
//               />
//             </svg>
//           }
//         >
//           {loading ? "Refreshing..." : "Refresh Status"}
//         </Button>
//       </div>

//       {/* Main Telemetry Table */}
//       <div className="bg-card border border-line rounded-xl overflow-hidden shadow-xs">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left text-[11px] text-muted border-b border-line uppercase tracking-wider bg-base/40">
//                 <th className="px-5 py-3.5 font-semibold">Company</th>
//                 <th className="px-5 py-3.5 font-semibold">Branch Index</th>
//                 <th className="px-5 py-3.5 font-semibold">Machine ID</th>
//                 <th className="px-5 py-3.5 font-semibold">Installed Version</th>
//                 <th className="px-5 py-3.5 font-semibold">Last Contact</th>
//                 <th className="px-5 py-3.5 font-semibold">Health Status</th>
//                 <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-line">
//               {loading ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-12 text-muted">
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
//                       Loading live terminal telemetry data...
//                     </div>
//                   </td>
//                 </tr>
//               ) : rows.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-12 text-muted">
//                     No telemetry records found for the selected filter.
//                   </td>
//                 </tr>
//               ) : (
//                 rows.map((r, index) => (
//                   <tr
//                     key={r.machineId || index}
//                     className="hover:bg-cardhover/50 transition-colors"
//                   >
//                     <td className="px-5 py-3.5 text-heading font-medium">
//                       {r.company}
//                     </td>
//                     <td className="px-5 py-3.5 text-muted font-mono text-xs">
//                       Branch #{r.branch}
//                     </td>
//                     <td className="px-5 py-3.5 font-mono text-xs text-heading font-semibold">
//                       {r.machineId || "N/A"}
//                     </td>
//                     <td className="px-5 py-3.5 font-mono text-xs text-accent font-bold">
//                       v{r.installed}
//                     </td>
//                     <td className="px-5 py-3.5 text-muted text-xs font-mono">
//                       {r.updatedAt}
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <StatusPill status={r.status} />
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       {r.status === "FAILED" ? (
//                         <button
//                           onClick={() => onViewError(r)}
//                           className="text-xs text-red-500 hover:text-red-600 hover:underline font-semibold cursor-pointer"
//                         >
//                           View Diagnostic
//                         </button>
//                       ) : (
//                         <span className="text-xs text-muted">Connected</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// }



import { useMemo, useState, useEffect } from "react";
import Button from "../components/common/Button";
import { deploymentApi } from "../services/api";

const TABS = [
  { key: "all", label: "All Releases" },
  { key: "active", label: "✅ Active Targets" },
  { key: "inactive", label: "⏸️ Inactive Targets" },
  { key: "mandatory", label: "🚨 Mandatory" },
];

export default function DeploymentMonitorPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeploymentHistory = async () => {
    setLoading(true);
    try {
      const response = await deploymentApi.getDeploymentHistory();
      if (response && response.status === "success") {
        setHistory(Array.isArray(response.data) ? response.data : []);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Error fetching deployment history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeploymentHistory();
  }, []);

  const counts = useMemo(
    () => ({
      all: history.length,
      active: history.filter((item) => Boolean(item.isActive)).length,
      inactive: history.filter((item) => !Boolean(item.isActive)).length,
      mandatory: history.filter((item) => Boolean(item.mandatory)).length,
    }),
    [history]
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return history.filter((item) => {
      if (filter === "active" && !item.isActive) return false;
      if (filter === "inactive" && item.isActive) return false;
      if (filter === "mandatory" && !item.mandatory) return false;

      if (!q) return true;

      const haystack = [
        item.publishedAt,
        item.publishedBy,
        item.company,
        item.branch,
        item.branchCode,
        item.terminalId,
        item.category,
        item.version,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [history, filter, search]);

  return (
    <section className="space-y-6 fade-in">
      {/* Top Filter, Search and Refresh Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                filter === tab.key
                  ? "bg-accent text-white border-accent shadow-xs"
                  : "bg-card text-muted border-line hover:border-accent/40 hover:text-heading"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  filter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-base text-muted"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, branch, terminal, version, user..."
            className="w-64 sm:w-72 px-3.5 py-2 rounded-xl text-xs bg-card text-heading border border-line focus:outline-none focus:border-accent placeholder:text-muted"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={fetchDeploymentHistory}
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
            {loading ? "Refreshing..." : "Refresh History"}
          </Button>
        </div>
      </div>

      {/* Target Release Deployment History Table */}
      <div className="bg-card border border-line rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-line uppercase tracking-wider bg-base/40">
                <th className="px-4 py-3.5 font-semibold">Date &amp; Time</th>
                <th className="px-4 py-3.5 font-semibold">Published By</th>
                <th className="px-4 py-3.5 font-semibold">Company</th>
                <th className="px-4 py-3.5 font-semibold">Branch</th>
                <th className="px-4 py-3.5 font-semibold">Terminal</th>
                <th className="px-4 py-3.5 font-semibold">Category</th>
                <th className="px-4 py-3.5 font-semibold">Version</th>
                <th className="px-4 py-3.5 font-semibold">Release Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      Loading target release history...
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-muted">
                    No target release history records found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="hover:bg-cardhover/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-muted whitespace-nowrap">
                      {row.publishedAt || "N/A"}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-heading whitespace-nowrap">
                      {row.publishedBy || "System"}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-heading">
                      {row.company || "Unknown"}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted">
                      <span className="font-medium text-heading">
                        {row.branch || "ALL"}
                      </span>
                      {row.branchCode ? (
                        <span className="ml-1.5 font-mono text-[11px] text-muted">
                          ({row.branchCode})
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-heading">
                      {row.terminalId || "ALL"}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-heading">
                      {row.category || "General POS"}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-accent whitespace-nowrap">
                      {row.version}
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            row.isActive
                              ? "bg-emerald-500/15 text-emerald-500"
                              : "bg-slate-500/15 text-slate-400"
                          }`}
                        >
                          {row.isActive ? "Active" : "Inactive"}
                        </span>
                        {row.mandatory ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-500/15 text-red-500">
                            Mandatory
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-base text-muted">
                            Optional
                          </span>
                        )}
                      </div>
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