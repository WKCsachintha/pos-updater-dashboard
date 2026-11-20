import { useRef, useState } from "react";

export default function Dropzone({ file, setFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-2">
        Update Package (.zip) <span className="text-red-500">*</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed rounded-xl py-8 px-4 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-accent bg-accent/10"
            : "border-line bg-base/50 hover:border-accent/60 hover:bg-base"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => e.target.files[0] && setFile(e.target.files[0])}
        />
        <div className="w-12 h-12 mx-auto rounded-full bg-card flex items-center justify-center text-muted mb-3 border border-line shadow-xs">
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>
        {file ? (
          <div>
            <p className="text-sm font-semibold text-heading">{file.name}</p>
            <p className="text-xs text-accent mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for deployment
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-bodytext">
              Drag & drop your <span className="text-heading font-semibold">.zip</span> build here, or{" "}
              <span className="text-accent font-semibold underline underline-offset-2">browse files</span>
            </p>
            <p className="text-[11px] text-muted mt-1.5">
              Max 500MB — Server generates dynamic secure FileUrl automatically
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

