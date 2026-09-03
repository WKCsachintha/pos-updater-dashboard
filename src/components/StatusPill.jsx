export default function StatusPill({ status }) {
  const styles = {
    SUCCESS: "bg-ok/15 text-ok",
    PENDING: "bg-warn/15 text-warn",
    FAILED: "bg-bad/15 text-bad",
  };
  const dot = {
    SUCCESS: "bg-ok",
    PENDING: "bg-warn",
    FAILED: "bg-bad",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full ${styles[status] || "bg-line text-slate-400"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || "bg-slate-500"}`} />
      {status}
    </span>
  );
}
