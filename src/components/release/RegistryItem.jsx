export default function RegistryItem({ version, onDeleteRelease }) {
  const categoryName = version.systemType || version.category || "General POS";
  const isActive = version.status === "Active";

  return (
    <div
      className={`border rounded-xl p-4 transition-all duration-200 ${
        isActive
          ? "border-accent/40 bg-accent/5 shadow-xs"
          : "border-line bg-card hover:border-line/80 hover:bg-cardhover/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-sm font-bold ${
              isActive ? "text-accent" : "text-heading"
            }`}
          >
            v{version.versionNumber}
          </span>
          <span className="text-[11px] bg-accent/10 border border-accent/20 text-accent px-2.5 py-0.5 rounded-full font-medium">
            {categoryName}
          </span>
        </div>
        <span
          className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-base text-muted border-line"
          }`}
        >
          {version.status}
        </span>
      </div>

      <p className="text-xs text-muted mt-2.5 line-clamp-2 leading-relaxed">
        {version.releaseNotes || "No release notes provided."}
      </p>

      <div className="mt-3 bg-base border border-line rounded-lg p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <svg
            className="w-4 h-4 text-accent shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4"
            />
          </svg>
          <span className="text-xs text-bodytext font-mono truncate">
            {version.fileName ||
              version.fileUrl?.split("/").pop() ||
              `${categoryName.replace(/\s+/g, "_")}_v${version.versionNumber}.zip`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-muted">
        <span>Uploaded Release</span>
        <span className="font-mono">{version.createdDate || "Recent"}</span>
      </div>
    </div>
  );
}

