export default function RolloutDonutChart({ stats = { updated: 0, pending: 0, failed: 0, total: 0, pct: 0 } }) {
  const updatedPct = stats.total ? (stats.updated / stats.total) * 100 : 0;
  const pendingPct = stats.total ? (stats.pending / stats.total) * 100 : 0;
  const updatedDeg = (updatedPct / 100) * 360;
  const pendingDeg = updatedDeg + (pendingPct / 100) * 360;

  return (
    <div className="bg-card border border-line rounded-xl p-6 shadow-xs relative overflow-hidden group">
      {/* Ambient Glow Effects */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-accent/10 dark:bg-accent/15 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/20 transition-all duration-700" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="font-display font-semibold text-heading text-base tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Overall Rollout Status
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Deployment telemetry across all {stats.total} Terminals
          </p>
        </div>
        <div className="text-xs font-mono text-blue-600 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 border border-blue-200 dark:border-cyan-500/30 px-3 py-1.5 rounded-lg shadow-xs font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400" />
          {stats.pct}% Success
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4 relative z-10">
        {/* Glowing 3D Donut Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* Outer Layer Ring */}
          <div className="absolute w-48 h-48 rounded-full border border-line/60 bg-base/50 shadow-md backdrop-blur-xs" />

          {/* Dynamic Conic Gradient Slice Ring */}
          <div
            className="w-44 h-44 rounded-full transition-all duration-700 p-2.5"
            style={{
              background:
                stats.total > 0
                  ? `conic-gradient(#10b981 0deg ${updatedDeg}deg, #f59e0b ${updatedDeg}deg ${pendingDeg}deg, #ef4444 ${pendingDeg}deg 360deg)`
                  : "var(--theme-line)",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Inner Cutout */}
            <div className="w-full h-full bg-card rounded-full flex flex-col items-center justify-center border border-line shadow-inner relative">
              <span className="font-display text-3xl font-bold text-heading">
                {stats.pct}%
              </span>
              <span className="text-[10px] text-muted font-medium uppercase tracking-widest mt-0.5">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Status Legend Cards */}
        <div className="space-y-3 text-xs w-full max-w-[240px]">
          {/* Updated Status */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-base border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-200 shadow-xs group/card">
            <span className="flex items-center gap-2.5 text-bodytext font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Updated
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              {stats.updated}
            </span>
          </div>

          {/* Pending Status */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-base border border-amber-500/20 hover:border-amber-500/50 transition-all duration-200 shadow-xs group/card">
            <span className="flex items-center gap-2.5 text-bodytext font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
              Pending
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-sm bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {stats.pending}
            </span>
          </div>

          {/* Failed Status */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-base border border-red-500/20 hover:border-red-500/50 transition-all duration-200 shadow-xs group/card">
            <span className="flex items-center gap-2.5 text-bodytext font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              Failed
            </span>
            <span className="font-mono text-red-600 dark:text-red-400 font-bold text-sm bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/20">
              {stats.failed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

