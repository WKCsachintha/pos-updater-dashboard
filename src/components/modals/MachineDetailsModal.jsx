import StatusPill from "../common/StatusPill";

export default function MachineDetailsModal({ machine, onClose }) {
  if (!machine) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-line rounded-xl w-full max-w-lg shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-base/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            </div>
            <h3 className="font-display text-base font-semibold text-heading">Terminal Telemetry</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-heading p-1.5 rounded-md hover:bg-cardhover transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between bg-base p-4 rounded-xl border border-line">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                Machine ID / Terminal Key
              </p>
              <p className="text-lg font-mono font-bold text-accent">{machine.machineId || "N/A"}</p>
            </div>
            <div>
              <StatusPill status={machine.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-base/60 p-3.5 rounded-lg border border-line">
              <p className="text-xs text-muted mb-0.5">Assigned Company</p>
              <p className="text-sm font-semibold text-heading">{machine.company || "All Companies"}</p>
            </div>
            <div className="bg-base/60 p-3.5 rounded-lg border border-line">
              <p className="text-xs text-muted mb-0.5">Branch Identifier</p>
              <p className="text-sm font-semibold text-heading font-mono">Branch #{machine.branch}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-base/60 p-3.5 rounded-lg border border-line">
              <p className="text-xs text-muted mb-0.5">Current Installed Version</p>
              <p className="text-base font-mono font-bold text-accent">v{machine.installed}</p>
            </div>
            <div className="bg-base/60 p-3.5 rounded-lg border border-line">
              <p className="text-xs text-muted mb-0.5">Last Communication Ping</p>
              <p className="text-xs font-mono text-bodytext mt-1">{machine.updatedAt || "N/A"}</p>
            </div>
          </div>

          {machine.errorMessage && machine.status?.toUpperCase() === "FAILED" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-500 mb-1 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Telemetry Error Log:
              </p>
              <p className="text-xs text-red-600 dark:text-red-300 font-mono leading-relaxed whitespace-pre-wrap">
                {machine.errorMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

