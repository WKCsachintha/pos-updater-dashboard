export default function ActiveReleaseModal({ version, monitorData = [], onClose }) {
  if (!version) return null;

  const releases = version.releases || [];
  const rows = releases.map((r) => {
    const posCount = monitorData.filter((m) => {
      const companyMatch = r.companyName === "ALL" || m.company === r.companyName;
      const branchMatch = r.branchName === "ALL" || m.branch === r.branchName;
      return companyMatch && branchMatch;
    }).length;
    return { ...r, posCount };
  });

  const totalPos = rows.reduce((sum, r) => sum + r.posCount, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-line rounded-xl w-full max-w-2xl p-6 fade-in max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                v{version.versionNumber}
              </span>
              <span className="text-xs font-medium text-muted">
                {version.systemType || "General POS"}
              </span>
            </div>
            <h3 className="font-display font-semibold text-heading text-lg mt-1">
              Active Release Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-heading p-1.5 rounded-md hover:bg-cardhover transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-muted mb-4 bg-base p-3 rounded-lg border border-line">
          {version.releaseNotes || "No specific release notes registered."}
        </p>

        <div className="flex items-center gap-3 mb-4 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent font-medium border border-accent/20">
            {rows.length} target{rows.length !== 1 ? "s" : ""} configured
          </span>
          <span className="px-2.5 py-1 rounded-md bg-cardhover text-bodytext font-medium border border-line">
            {totalPos} POS terminals active
          </span>
        </div>

        <div className="overflow-y-auto flex-1 -mx-2 px-2 custom-scrollbar">
          {rows.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No target branch breakdown available for this active build.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card border-b border-line">
                <tr className="text-left text-[11px] text-muted uppercase tracking-wide">
                  <th className="py-2.5 font-medium">Company</th>
                  <th className="py-2.5 font-medium">Branch</th>
                  <th className="py-2.5 font-medium">Policy</th>
                  <th className="py-2.5 font-medium text-right">Terminals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r, idx) => (
                  <tr key={r.releaseId || idx} className="hover:bg-cardhover/40 transition-colors">
                    <td className="py-3 text-heading font-medium">{r.companyName || "ALL"}</td>
                    <td className="py-3 text-bodytext font-mono text-xs">{r.branchName || "ALL"}</td>
                    <td className="py-3">
                      {r.isMandatory ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted">Optional</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-mono text-heading">{r.posCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

