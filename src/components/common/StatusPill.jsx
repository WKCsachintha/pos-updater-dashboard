export default function StatusPill({ status }) {
  const normStatus = (status || "").toUpperCase();

  const styles = {
    SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    FAILED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const dot = {
    SUCCESS: "bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
    PENDING: "bg-amber-500 dark:bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]",
    FAILED: "bg-red-500 dark:bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  };

  const currentStyle = styles[normStatus] || "bg-line text-muted border-line";
  const currentDot = dot[normStatus] || "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-all ${currentStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`} />
      {status || "UNKNOWN"}
    </span>
  );
}

