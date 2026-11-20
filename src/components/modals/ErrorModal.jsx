import Button from "../common/Button";

export default function ErrorModal({ row, onClose }) {
  if (!row) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-line rounded-xl w-full max-w-md p-6 shadow-2xl fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-semibold text-heading text-base">
                Update Failed
              </h3>
              <p className="text-xs text-muted font-mono mt-0.5">
                {row.machineId || "Unknown Machine ID"}
              </p>
            </div>
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

        <div className="bg-base border border-line rounded-lg p-3.5 my-4">
          <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider mb-1">
            Server Telemetry Diagnostics
          </p>
          <p className="text-xs font-mono text-red-600 dark:text-red-300 leading-relaxed whitespace-pre-wrap break-words">
            {row.error || row.errorMessage || "No detailed stacktrace provided by client."}
          </p>
        </div>

        <div className="flex justify-end gap-2.5 mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              alert(`Retry deployment signal dispatched to ${row.machineId}`);
              onClose();
            }}
          >
            Retry Deployment
          </Button>
        </div>
      </div>
    </div>
  );
}

