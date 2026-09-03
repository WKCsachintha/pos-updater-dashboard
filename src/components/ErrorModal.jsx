export default function ErrorModal({ row, onClose }) {
  if (!row) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-card border border-line rounded-lg w-full max-w-md p-6 fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-bad/15 flex items-center justify-center text-bad shrink-0">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">Update Failed</h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{row.machineId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-base border border-line rounded-md p-3">
          <p className="text-xs font-mono text-red-300 leading-relaxed">{row.error}</p>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 border border-line text-slate-400 hover:text-white text-sm rounded-md">Close</button>
          <button className="px-4 py-2 bg-accent hover:bg-accentdeep text-white text-sm font-medium rounded-md">Retry Deployment</button>
        </div>
      </div>
    </div>
  );
}
