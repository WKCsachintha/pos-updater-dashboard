import { useMemo, useState, useEffect } from "react";
import Dropzone from "../components/release/Dropzone";
import RegistryItem from "../components/release/RegistryItem";
import Button from "../components/common/Button";
import { masterApi } from "../services/api";

export default function ReleaseManagerPage({ versions = [], onPublish, onDeleteRelease }) {
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Form States
  const [selectedCategory, setSelectedCategory] = useState("");
  const [versionNumber, setVersionNumber] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await masterApi.getCategories();
        if (res?.status === "success" && Array.isArray(res.data)) {
          setCategoriesList(res.data);
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
    return versions.filter(
      (v) =>
        (v.versionNumber && v.versionNumber.toLowerCase().includes(q)) ||
        (v.releaseNotes && v.releaseNotes.toLowerCase().includes(q)) ||
        (v.systemType && v.systemType.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q))
    );
  }, [versions, search]);

  const isFormValid = file && selectedCategory && versionNumber.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      alert("Please select a .zip package file.");
      return;
    }

    // Check for duplicate version in selected category
    const isDuplicate = versions.some((v) => {
      const categoryObj = categoriesList.find(
        (c) => String(c.category_index) === String(selectedCategory)
      );
      const catName = categoryObj ? categoryObj.display_name : "";

      return (
        v.versionNumber === versionNumber &&
        (v.systemType === catName || v.category === catName)
      );
    });

    if (isDuplicate) {
      alert(
        `Error: Version v${versionNumber} already exists for this Category! Please enter a new version number.`
      );
      return;
    }

    setIsUploading(true);

    try {
      await onPublish({
        systemType: selectedCategory,
        systemTypeId: selectedCategory,
        versionNumber: versionNumber.trim(),
        releaseNotes: releaseNotes.trim(),
        fileName: file.name,
        file: file,
      });

      // Clear Form on success
      setFile(null);
      setSelectedCategory("");
      setVersionNumber("");
      setReleaseNotes("");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="space-y-6 fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left Form: Publish New Update */}
        <div className="xl:col-span-3 bg-card border border-line rounded-xl p-6 shadow-xs">
          <div className="mb-5">
            <h2 className="font-display font-semibold text-heading text-lg">
              Publish New Package Build
            </h2>
            <p className="text-xs text-muted mt-1">
              Upload application ZIP package, assign target system type, and register release metadata.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Dropzone file={file} setFile={setFile} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  Application Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="systemType"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="" disabled>
                    -- Select Category --
                  </option>
                  {categoriesList.map((cat) => (
                    <option key={cat.category_index} value={cat.category_index}>
                      {cat.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  Version Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="versionNumber"
                  type="text"
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                  required
                  placeholder="e.g. 1.0.8"
                  className="w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading font-mono placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Release Notes & Changelog
              </label>
              <textarea
                name="releaseNotes"
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                rows="4"
                placeholder={
                  "- Fixed receipt printer timeout on slow networks\n- Improved barcode scan latency"
                }
                className="w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading placeholder:text-muted font-mono focus:outline-none focus:ring-2 focus:ring-accent/40 leading-relaxed"
              />
              <p className="text-[11px] text-muted mt-1.5">
                Markdown supported. Displayed on POS operator terminal notifications.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || isUploading}
              loading={isUploading}
              className="w-full md:w-auto px-6"
            >
              {isUploading
                ? "Uploading Build Package..."
                : !isFormValid
                ? "Complete Required Fields"
                : "Upload & Register Build"}
            </Button>
          </form>
        </div>

        {/* Right Side: Version Registry List */}
        <div className="xl:col-span-2 bg-card border border-line rounded-xl p-6 shadow-xs flex flex-col h-[680px]">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 className="font-display font-semibold text-heading text-base">
                Version Registry
              </h3>
              <p className="text-xs text-muted mt-0.5">
                All registered system builds
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-base border border-line text-muted">
              {filtered.length} builds
            </span>
          </div>

          <div className="relative mb-4 shrink-0">
            <svg
              className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search version, system category, or notes…"
              className="w-full bg-base border border-line rounded-xl pl-9 pr-3 py-2 text-xs text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted">
                No matching builds found in database.
              </div>
            ) : (
              filtered.map((v) => (
                <RegistryItem
                  key={v.versionId || v.versionNumber}
                  version={v}
                  onDeleteRelease={onDeleteRelease}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

