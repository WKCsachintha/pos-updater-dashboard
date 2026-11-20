import { useState, useEffect, useMemo } from "react";
import Button from "../components/common/Button";
import { masterApi, deploymentApi } from "../services/api";

export default function TargetReleasePage({ versions = [], onPublish }) {
  const [categories, setCategories] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [terminalList, setTerminalList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [versionId, setVersionId] = useState("");

  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
  const [terminal, setTerminal] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeDeployments, setActiveDeployments] = useState([]);
  const [loadingDeployments, setLoadingDeployments] = useState(true);

  useEffect(() => {
    fetchInitialMasterData();
    fetchActiveDeployments();
  }, []);

  async function fetchInitialMasterData() {
    try {
      const [catRes, compRes, branchRes, termRes] = await Promise.all([
        masterApi.getCategories(),
        masterApi.getCompanies(),
        masterApi.getBranches(),
        masterApi.getTerminals(),
      ]);

      if (catRes?.status === "success" && Array.isArray(catRes.data)) {
        const cats = catRes.data.map((c) => c.display_name);
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0]);
      } else {
        setCategories([]);
      }

      if (compRes?.status === "success" && Array.isArray(compRes.data)) {
        setCompanyList(compRes.data);
      } else {
        setCompanyList([]);
      }

      if (branchRes?.status === "success" && Array.isArray(branchRes.data)) {
        setBranchList(branchRes.data);
      } else {
        setBranchList([]);
      }

      if (termRes?.status === "success" && Array.isArray(termRes.data)) {
        setTerminalList(termRes.data);
      } else {
        setTerminalList([]);
      }
    } catch (error) {
      console.error("Error fetching master dropdowns:", error);
    }
  }

  const fetchActiveDeployments = async () => {
    setLoadingDeployments(true);
    try {
      const response = await deploymentApi.getTargetDeployments();
      if (response?.status === "success" && Array.isArray(response.data)) {
        setActiveDeployments(response.data);
      } else {
        setActiveDeployments([]);
      }
    } catch (error) {
      console.error("Error fetching target deployments:", error);
      setActiveDeployments([]);
    } finally {
      setLoadingDeployments(false);
    }
  };

  // Filter branches for selected company
  const filteredBranches = useMemo(() => {
    if (!company) return [];
    return branchList.filter((b) => String(b.company_index) === String(company));
  }, [branchList, company]);

  // Filter terminals for selected company and branch
  const filteredTerminals = useMemo(() => {
    if (!company || !branch) return [];
    let list = terminalList.filter((t) => String(t.company_index) === String(company));

    if (branch !== "ALL") {
      list = list.filter((t) => String(t.branch_index) === String(branch));
    }
    return list;
  }, [terminalList, company, branch]);

  const categoryVersions = useMemo(() => {
    if (!selectedCategory || !Array.isArray(versions)) return [];
    return versions.filter(
      (v) => v.systemType === selectedCategory || v.category === selectedCategory
    );
  }, [versions, selectedCategory]);

  const handleSelectDeployment = (item) => {
    if (!item) return;

    setVersionId("");
    setCompany("");
    setBranch("");
    setTerminal("");
    setIsMandatory(false);

    if (item.category) {
      setSelectedCategory(item.category);
    }

    setTimeout(() => {
      setVersionId(item.versionId ? String(item.versionId) : "");
      setCompany(item.company_index ? String(item.company_index) : item.company || "");
      setBranch(item.branch ? String(item.branch) : "ALL");
      setTerminal(item.terminal ? String(item.terminal) : "ALL");
      setIsMandatory(Boolean(item.mandatory));
    }, 50);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const targetData = {
      versionId: parseInt(versionId, 10),
      company: parseInt(company, 10),
      branch: branch,
      terminal: terminal,
      isMandatory: isMandatory ? 1 : 0,
    };

    setIsSubmitting(true);
    try {
      const response = await deploymentApi.publishTarget(targetData);

      if (response && response.status === "success") {
        alert("Target release published successfully!");
        if (onPublish) onPublish(targetData);
        fetchActiveDeployments();

        // Reset Form
        setVersionId("");
        setCompany("");
        setBranch("");
        setTerminal("");
        setIsMandatory(false);
      } else {
        alert("Error: " + (response?.message || "Could not publish target."));
      }
    } catch (error) {
      console.error("Failed to publish target release:", error);
      alert("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = selectedCategory && versionId && company && branch && terminal;

  return (
    <section className="space-y-6 fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left Side: Target Release Form */}
        <div className="xl:col-span-3 bg-card border border-line rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-display font-semibold text-heading text-lg">
              Target Release Settings
            </h2>
            <p className="text-xs text-muted mt-1">
              Assign targeted deployment parameters for existing builds to specific companies, branches, or terminals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Application Category <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setVersionId("");
                }}
                className="w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="" disabled>
                  -- Select Category --
                </option>
                {categories.map((cat, idx) => (
                  <option key={`cat-${idx}`} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Version Dropdown */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Release Version <span className="text-red-500">*</span>
              </label>
              <select
                value={versionId}
                onChange={(e) => setVersionId(e.target.value)}
                required
                className="w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40 font-mono"
              >
                <option value="" disabled>
                  -- Select Version --
                </option>
                {categoryVersions.map((v, idx) => (
                  <option key={`ver-${v.versionId || idx}`} value={v.versionId}>
                    v{v.versionNumber}
                    {v.releaseNotes ? ` - ${v.releaseNotes.substring(0, 35)}...` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target Company Dropdown */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  Target Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setBranch("");
                    setTerminal("");
                  }}
                  required
                  className="w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="" disabled>
                    -- Select Company --
                  </option>
                  {companyList.map((c, idx) => (
                    <option
                      key={`comp-${c.company_index || idx}`}
                      value={c.company_index}
                    >
                      {c.company_display_name || c.company_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Branch Dropdown */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  Target Branch <span className="text-red-500">*</span>
                </label>
                <select
                  value={branch}
                  onChange={(e) => {
                    setBranch(e.target.value);
                    setTerminal("");
                  }}
                  required
                  disabled={!company}
                  className={`w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                    !company && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <option value="" disabled>
                    -- Select Branch --
                  </option>
                  {company && <option value="ALL">ALL Branches</option>}
                  {filteredBranches.map((b, idx) => (
                    <option
                      key={`branch-${b.branch_index || idx}`}
                      value={b.branch_index}
                    >
                      {b.branch_name} ({b.branch_code || `Index: ${b.branch_index}`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Terminal Dropdown */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Target Terminal / Machine ID <span className="text-red-500">*</span>
              </label>
              <select
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                required
                disabled={!branch}
                className={`w-full bg-base border border-line rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:ring-2 focus:ring-accent/40 font-mono ${
                  !branch && "opacity-50 cursor-not-allowed"
                }`}
              >
                <option value="" disabled>
                  -- Select Terminal --
                </option>
                {branch && filteredTerminals.length === 0 ? (
                  <option disabled>No Terminals Found</option>
                ) : (
                  <>
                    {branch && <option value="ALL">ALL Terminals</option>}
                    {filteredTerminals.map((t, idx) => (
                      <option
                        key={`term-${t.terminal_index || idx}`}
                        value={t.terminal_id || t.terminal_number}
                      >
                        {t.terminal_id
                          ? `${t.terminal_id} (No: ${t.terminal_number})`
                          : `Terminal #${t.terminal_number}`}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Mandatory Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-2 select-none">
              <input
                type="checkbox"
                checked={isMandatory}
                onChange={(e) => setIsMandatory(e.target.checked)}
                className="w-4 h-4 rounded bg-base border-line text-accent focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-bodytext font-medium">
                Mark as mandatory update (forces client automatic download)
              </span>
            </label>

            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              loading={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting
                ? "Deploying Parameters..."
                : isFormValid
                ? "Publish Targeted Release"
                : "Complete all fields to publish"}
            </Button>
          </form>
        </div>

        {/* Right Side: Active Deployments Panel */}
        <div className="xl:col-span-2 bg-card border border-line rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-semibold text-heading text-base">
                Active Target Deployments
              </h3>
              <button
                onClick={fetchActiveDeployments}
                className="text-xs text-accent hover:underline font-medium cursor-pointer"
              >
                Refresh
              </button>
            </div>
            <p className="text-xs text-muted mb-4">
              Click any active deployment to inspect or duplicate parameters.
            </p>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {loadingDeployments ? (
                <div className="text-center py-12 text-xs text-muted flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Loading deployments...
                </div>
              ) : activeDeployments.length === 0 ? (
                <p className="text-xs text-muted text-center py-8">
                  No active target deployments found.
                </p>
              ) : (
                activeDeployments.map((item, idx) => (
                  <div
                    key={`dep-${item.id || idx}`}
                    onClick={() => handleSelectDeployment(item)}
                    className="p-3.5 bg-base border border-line hover:border-accent/60 rounded-xl space-y-1.5 cursor-pointer transition-all hover:bg-cardhover/40 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-heading font-mono">
                        v{item.version}
                      </span>
                      <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20 font-medium">
                        {item.category || "General"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>
                        Target: <strong className="text-heading">{item.company}</strong> (Branch: {item.branch})
                      </span>
                      {item.mandatory === 1 && (
                        <span className="text-amber-500 font-semibold text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted font-mono text-right pt-0.5">
                      {item.date}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-accent/5 border border-accent/20 rounded-xl">
            <p className="text-xs text-accent font-semibold flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Deployment Broadcast Rule
            </p>
            <p className="text-[11px] text-muted mt-1 leading-relaxed">
              Target parameters push update notifications immediately to matching POS terminals on their next background check-in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

