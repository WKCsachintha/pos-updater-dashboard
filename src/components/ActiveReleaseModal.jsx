export default function ActiveReleaseModal({ version, monitorData, onClose }) {
  if (!version) return null;

  const rows = version.releases.map((r) => {
    const posCount = monitorData.filter((m) => {
      const companyMatch = r.companyName === "ALL" || m.company === r.companyName;
      const branchMatch = r.branchName === "ALL" || m.branch === r.branchName;
      return companyMatch && branchMatch;
    }).length;
    return { ...r, posCount };
  });

  const totalPos = rows.reduce((sum, r) => sum + r.posCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-card border border-line rounded-lg w-full max-w-2xl p-6 fade-in max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[11px] text-accent font-mono">v{version.versionNumber}</p>
            <h3 className="font-display font-semibold text-white text-base mt-0.5">Active Release Details</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">{version.releaseNotes}</p>

        <div className="flex items-center gap-4 mb-4 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium">{rows.length} target{rows.length !== 1 ? "s" : ""}</span>
          <span className="px-2.5 py-1 rounded-full bg-line text-slate-300 font-medium">{totalPos} POS terminals covered</span>
        </div>

        <div className="overflow-y-auto flex-1 -mx-2 px-2">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="text-left text-[11px] text-slate-500 border-b border-line uppercase tracking-wide">
                <th className="py-2 font-medium">Company</th>
                <th className="py-2 font-medium">Branch</th>
                <th className="py-2 font-medium">Mandatory</th>
                <th className="py-2 font-medium text-right">POS Terminals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.releaseId}>
                  <td className="py-2.5 text-slate-200">{r.companyName}</td>
                  <td className="py-2.5 text-slate-400">{r.branchName}</td>
                  <td className="py-2.5">
                    {r.isMandatory ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-warn/15 text-warn">Mandatory</span>
                    ) : (
                      <span className="text-[11px] text-slate-600">Optional</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-300">{r.posCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
