import { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://demo.onlineserp.com/serp_dev/app/integration/poss_new/exe_realese.php";

function Dropzone({ file, setFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-2">Update Package (.zip)</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed rounded-lg py-8 px-4 text-center cursor-pointer transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-line hover:border-accent/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => e.target.files[0] && setFile(e.target.files[0])}
        />
        <svg className="w-8 h-8 mx-auto text-slate-500 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {file ? (
          <p className="text-sm text-slate-400"><span className="text-slate-200 font-medium">{file.name}</span> selected</p>
        ) : (
          <p className="text-sm text-slate-400">
            Drag & drop your <span className="text-slate-200 font-medium">.zip</span> build here, or <span className="text-accent">browse files</span>
          </p>
        )}
        <p className="text-[11px] text-slate-600 mt-1">Max 500MB — dynamic FileUrl generated on server</p>
      </div>
    </div>
  );
}

function RegistryItem({ version, onDeleteRelease }) {
  const categoryName = version.systemType || version.category || "General POS";

  return (
    <div className={`border rounded-lg p-4 transition-colors ${version.status === "Active" ? "border-accent/50 bg-accent/[0.04]" : "border-line bg-card/60"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm font-semibold ${version.status === "Active" ? "text-white" : "text-slate-300"}`}>
            v{version.versionNumber}
          </span>
          <span className="text-[11px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded font-medium">
            {categoryName}
          </span>
        </div>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${version.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-line text-slate-400"}`}>
          {version.status}
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">{version.releaseNotes}</p>

      <div className="mt-3 bg-base/80 border border-line/60 rounded-md p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" />
          </svg>
          <span className="text-xs text-slate-300 font-mono truncate">
            {version.fileName || version.fileUrl?.split('/').pop() || `${categoryName.replace(/\s+/g, "_")}_v${version.versionNumber}.zip`}
          </span>
        </div>
        <button
          onClick={() => onDeleteRelease(version.versionId)}
          className="text-slate-500 hover:text-red-400 p-1 transition-colors shrink-0"
          title="Delete Build"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9-.346 9m-4.788 0L9.26 9M19.228 5.79A48.11 48.11 0 0 0 12 5.4c-2.451 0-4.86.196-7.228.589M6.6 5.79 6 4.6a2.25 2.25 0 0 1 2.008-1.25h7.984A2.25 2.25 0 0 1 18 4.6l-.6 1.19m-11.4 0h13.5" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
        <span>Uploaded Build</span>
        <span className="font-mono">{version.createdDate}</span>
      </div>
    </div>
  );
}

export default function ReleaseManager({ versions = [], onPublish, onDeleteRelease }) {
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [systemTypes, setSystemTypes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Database එකෙන් Active Application Categories Load කරගැනීම
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${API_BASE}?action=get_all_release_categories`);
        if (res.data?.status === "success") {
          const catList = res.data.data.map(c => c.display_name);
          setSystemTypes(catList);
        }
      } catch (err) {
        console.error("Error loading release categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return versions;
    return versions.filter((v) =>
      (v.versionNumber && v.versionNumber.toLowerCase().includes(q)) ||
      (v.releaseNotes && v.releaseNotes.toLowerCase().includes(q)) ||
      (v.systemType && v.systemType.toLowerCase().includes(q))
    );
  }, [versions, search]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      alert("Please select a .zip package file.");
      return;
    }

    const form = new FormData(e.target);
    setIsUploading(true);

    try {
      await onPublish({
        systemType: form.get("systemType"),
        versionNumber: form.get("versionNumber"),
        releaseNotes: form.get("releaseNotes"),
        companyName: "ALL",
        branchName: "ALL",
        fileName: file.name,
        file: file
      });

      e.target.reset();
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="space-y-6 fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        
        {/* Left Form: Publish New Update */}
        <div className="xl:col-span-3 bg-card border border-line rounded-lg p-6">
          <h3 className="font-display font-semibold text-white text-base mb-1">Publish New Update</h3>
          <p className="text-xs text-slate-500 mb-5">
            Upload package, select application category, and register version details into database.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Dropzone file={file} setFile={setFile} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Application Category</label>
                <select 
                  name="systemType" 
                  required
                  className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {systemTypes.length === 0 ? (
                    <option value="Supermarket POS">Supermarket POS</option>
                  ) : (
                    systemTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Version Number</label>
                <input
                  name="versionNumber"
                  type="text"
                  required
                  placeholder="e.g. 1.0.8"
                  className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Release Notes</label>
              <textarea
                name="releaseNotes"
                rows="4"
                placeholder={"- Fixed receipt printer timeout on slow networks\n- Improved barcode scan latency"}
                className="w-full bg-base border border-line rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <p className="text-[11px] text-slate-600 mt-1">Markdown supported</p>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-accentdeep text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isUploading ? "Uploading Build..." : "Upload Update"}
            </button>
          </form>
        </div>

        {/* Right Side: Version Registry List */}
        <div className="xl:col-span-2 bg-card border border-line rounded-lg p-6 flex flex-col h-[650px]">
          <h3 className="font-display font-semibold text-white text-base mb-3">Version Registry</h3>

          <div className="relative mb-4 shrink-0">
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search version, system category, or notes…"
              className="w-full bg-base border border-line rounded-md pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-3 overflow-y-auto pr-1.5 flex-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-10">No versions found in Database.</p>
            ) : (
              filtered.map((v) => (
                <RegistryItem key={v.versionId} version={v} onDeleteRelease={onDeleteRelease} />
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}